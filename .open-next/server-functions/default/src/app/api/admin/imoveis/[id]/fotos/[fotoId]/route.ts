import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { deletarFoto } from "@/lib/storage";

type Params = { params: Promise<{ id: string; fotoId: string }> };

const PatchFotoSchema = z.object({
  destaque: z.boolean().optional(),
  watermark: z.boolean().optional(),
});

// ─── PATCH /api/admin/imoveis/[id]/fotos/[fotoId] ────────────────────────────

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id, fotoId } = await params;

    const foto = await prisma.foto.findFirst({
      where: { id: fotoId, imovelId: id },
    });

    if (!foto) {
      return NextResponse.json({ error: "Foto nao encontrada" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = PatchFotoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Se estiver marcando como destaque, remove destaque das outras fotos
    if (parsed.data.destaque === true) {
      await prisma.foto.updateMany({
        where: { imovelId: id, id: { not: fotoId } },
        data: { destaque: false },
      });
    }

    const atualizada = await prisma.foto.update({
      where: { id: fotoId },
      data: parsed.data,
    });

    return NextResponse.json(atualizada);
  } catch (err) {
    console.error("[PATCH /api/admin/imoveis/[id]/fotos/[fotoId]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ─── DELETE /api/admin/imoveis/[id]/fotos/[fotoId] ───────────────────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id, fotoId } = await params;

    const foto = await prisma.foto.findFirst({
      where: { id: fotoId, imovelId: id },
    });

    if (!foto) {
      return NextResponse.json({ error: "Foto nao encontrada" }, { status: 404 });
    }

    // Remove do storage primeiro
    await deletarFoto(foto.nomeArquivo);

    // Remove do banco
    await prisma.foto.delete({ where: { id: fotoId } });

    // Se era destaque, promove a próxima foto
    if (foto.destaque) {
      const proxima = await prisma.foto.findFirst({
        where: { imovelId: id },
        orderBy: { ordem: "asc" },
      });
      if (proxima) {
        await prisma.foto.update({
          where: { id: proxima.id },
          data: { destaque: true },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/imoveis/[id]/fotos/[fotoId]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
