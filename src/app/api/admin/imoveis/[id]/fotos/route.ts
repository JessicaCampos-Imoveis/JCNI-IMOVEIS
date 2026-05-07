import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processarImagem } from "@/lib/image-pipeline";
import { uploadFoto, gerarNomeArquivo } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/tiff"];

function mapearErroUpload(err: unknown): { status: number; mensagem: string } {
  const mensagem = err instanceof Error ? err.message : "Erro interno";
  const lower = mensagem.toLowerCase();

  if (
    lower.includes("unsupported image format") ||
    lower.includes("input buffer") ||
    lower.includes("corrupt") ||
    lower.includes("invalid") ||
    lower.includes("heif") ||
    lower.includes("vips")
  ) {
    return {
      status: 400,
      mensagem: "Nao foi possivel processar a imagem enviada. Use JPG, PNG ou WebP valido.",
    };
  }

  if (mensagem.includes("Storage upload falhou")) {
    return {
      status: 502,
      mensagem: "Falha no storage ao salvar a imagem. Tente novamente em instantes.",
    };
  }

  return { status: 500, mensagem: "Erro interno" };
}

// ─── POST /api/admin/imoveis/[id]/fotos ──────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const imovel = await prisma.imovel.findFirst({
      where: { id, deletadoEm: null },
      select: { id: true },
    });

    if (!imovel) {
      return NextResponse.json({ error: "Imovel nao encontrado" }, { status: 404 });
    }

    const formData = await req.formData();
    const arquivo = formData.get("arquivo");

    if (!arquivo || typeof arquivo === "string") {
      return NextResponse.json({ error: "Arquivo nao enviado" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(arquivo.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo nao suportado. Use JPEG, PNG, WebP, HEIC ou TIFF." },
        { status: 400 }
      );
    }

    const arrayBuffer = await arquivo.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Arquivo excede 20MB" }, { status: 400 });
    }

    const inputBuffer = Buffer.from(arrayBuffer);
    const aplicarWatermark = formData.get("watermark") !== "false";

    // Pipeline: EXIF strip + resize + watermark + WebP
    const processado = await processarImagem({ input: inputBuffer, aplicarWatermark });

    // Upload para Supabase Storage
    const nomeArquivo = gerarNomeArquivo(id);
    const { url } = await uploadFoto({ buffer: processado, nomeArquivo });

    // Calcula próxima ordem
    const ultimaFoto = await prisma.foto.findFirst({
      where: { imovelId: id },
      orderBy: { ordem: "desc" },
      select: { ordem: true },
    });
    const proxOrdem = (ultimaFoto?.ordem ?? -1) + 1;

    // Verifica se é a primeira foto (vira destaque)
    const totalFotos = await prisma.foto.count({ where: { imovelId: id } });
    const destaque = totalFotos === 0;

    const foto = await prisma.foto.create({
      data: {
        imovelId: id,
        url,
        nomeArquivo,
        ordem: proxOrdem,
        destaque,
        watermark: aplicarWatermark,
      },
    });

    return NextResponse.json(foto, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/imoveis/[id]/fotos]", err);
    const erroMapeado = mapearErroUpload(err);
    return NextResponse.json({ error: erroMapeado.mensagem }, { status: erroMapeado.status });
  }
}
