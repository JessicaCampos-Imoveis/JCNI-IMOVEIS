import path from "path";
import fs from "fs";

// sharp usa addon nativo C (libvips) — nao roda em Cloudflare Workers.
// Import dinamico: se falhar, processarImagem retorna o buffer original sem processamento.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SharpFn = (...args: any[]) => any;

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const WATERMARK_OPACITY = 0.30;

// Caminho para a logo usada como watermark (arquivo estático em /public)
const WATERMARK_PATH = path.join(process.cwd(), "public", "images", "logo_jcni.png");

/**
 * Pipeline completo de processamento de imagem (RN08):
 * 1. Remove metadados EXIF
 * 2. Corrige orientação
 * 3. Resize máximo 1200×1200px mantendo proporção
 * 4. Aplica watermark (logo 30% opacity, bottom-right) — se solicitado
 * 5. Converte para WebP (qualidade 82)
 *
 * Retorna Buffer WebP pronto para upload.
 */
export async function processarImagem(params: {
  input: Buffer;
  aplicarWatermark?: boolean;
}): Promise<Buffer> {
  const { input, aplicarWatermark = true } = params;

  // Tenta carregar sharp dinamicamente; retorna buffer original em ambientes sem suporte (ex: Cloudflare Workers)
  let sharp: SharpFn | null = null;
  try {
    sharp = ((await import("sharp")) as { default: SharpFn }).default;
  } catch {
    return input;
  }

  // 1-3: Strip EXIF + resize + orientacao
  let pipeline = sharp(input, { failOn: "none" })
    .rotate() // corrige orientação EXIF automaticamente
    .resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .withMetadata({}); // remove EXIF mantendo apenas dimensões/colorspace mínimos

  if (aplicarWatermark && fs.existsSync(WATERMARK_PATH)) {
    const { width: imgWidth, height: imgHeight } = await sharp(input)
      .resize(MAX_WIDTH, MAX_HEIGHT, { fit: "inside", withoutEnlargement: true })
      .metadata();

    const w = imgWidth ?? MAX_WIDTH;
    const h = imgHeight ?? MAX_HEIGHT;

    // Watermark: 25% da largura da imagem, máx 240px
    const wmWidth = Math.min(Math.round(w * 0.25), 240);

    const watermarkBuffer = await sharp(WATERMARK_PATH)
      .resize(wmWidth, null, { fit: "inside" })
      .composite([{
        input: Buffer.from([0, 0, 0, Math.round(255 * WATERMARK_OPACITY)]),
        raw: { width: 1, height: 1, channels: 4 },
        tile: true,
        blend: "dest-in",
      }])
      .png()
      .toBuffer();

    const wmMeta = await sharp(watermarkBuffer).metadata();
    const wmH = wmMeta.height ?? 40;

    const margin = 16;
    pipeline = sharp(await pipeline.toBuffer())
      .composite([{
        input: watermarkBuffer,
        gravity: "southeast",
        top: h - wmH - margin,
        left: w - wmWidth - margin,
        blend: "over",
      }]);
  }

  return pipeline.webp({ quality: 82 }).toBuffer();
}
