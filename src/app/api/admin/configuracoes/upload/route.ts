/**
 * POST /api/admin/configuracoes/upload
 * Upload de imagens de marca (logo, foto da Jessica).
 * Protegido pelo middleware (JWT).
 * Armazena no bucket imoveis-fotos em site-assets/.
 * Salva a URL em Configuracao e invalida o cache do site.
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { deletarFoto, uploadFoto } from "@/lib/storage";

const TIPOS_PERMITIDOS: Record<string, { chave: string; maxDim: number }> = {
  logo: { chave: "marca_logo_url", maxDim: 400 },
  foto_jessica: { chave: "marca_foto_jessica_url", maxDim: 1200 },
  foto_jessica_hero: { chave: "marca_foto_jessica_hero_url", maxDim: 1400 },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

function extrairNomeArquivoStorage(url: string): string | null {
  try {
    const parsed = new URL(url);
    const marker = "/storage/v1/object/public/imoveis-fotos/";
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) return null;

    const nomeArquivo = decodeURIComponent(parsed.pathname.slice(idx + marker.length));
    if (!nomeArquivo) return null;
    return nomeArquivo;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const tipo = String(formData.get("tipo") ?? "");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Arquivo nao enviado" }, { status: 400 });
  }

  const tipoConfig = TIPOS_PERMITIDOS[tipo];
  if (!tipoConfig) {
    return NextResponse.json(
      { error: "Tipo invalido. Use: logo, foto_jessica, foto_jessica_hero" },
      { status: 400 },
    );
  }

  const configAnterior = await prisma.configuracao.findUnique({
    where: { chave: tipoConfig.chave },
    select: { valor: true },
  });

  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato nao suportado. Use JPG, PNG ou WebP." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.byteLength > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Arquivo muito grande (max 10MB)" }, { status: 400 });
  }

  // Processar: remove EXIF, resize, converte para WebP
  let processed: Buffer;
  try {
    processed = await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize(tipoConfig.maxDim, tipoConfig.maxDim, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .withMetadata({})
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "Nao foi possivel processar a imagem. Use JPG, PNG ou WebP valido." },
      { status: 400 },
    );
  }

  // Upload para storage
  const nomeArquivo = `site-assets/${tipo}-${Date.now()}.webp`;
  let url: string;
  try {
    const result = await uploadFoto({ buffer: processed, nomeArquivo });
    url = result.url;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "erro desconhecido";
    console.error("[configuracoes/upload] Falha no storage:", detail);

    return NextResponse.json(
      {
        error: "Falha ao salvar imagem no storage.",
        ...(process.env.NODE_ENV !== "production" ? { detail } : {}),
      },
      { status: 502 },
    );
  }

  // Salvar URL na configuracao
  await prisma.configuracao.upsert({
    where: { chave: tipoConfig.chave },
    update: { valor: url },
    create: { chave: tipoConfig.chave, valor: url },
  });

  const nomeArquivoAnterior = configAnterior?.valor
    ? extrairNomeArquivoStorage(configAnterior.valor)
    : null;

  // Limpeza best-effort: remove arquivo antigo apos persistir nova URL.
  if (nomeArquivoAnterior && nomeArquivoAnterior !== nomeArquivo) {
    try {
      await deletarFoto(nomeArquivoAnterior);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "erro desconhecido";
      console.warn("[configuracoes/upload] Nao foi possivel remover imagem antiga:", detail);
    }
  }

  // Invalida cache do site imediatamente
  revalidateTag("site-config");

  return NextResponse.json({ url });
}
