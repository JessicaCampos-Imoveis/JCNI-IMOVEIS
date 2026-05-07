import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const ReorderSchema = z.object({
  // Array de { fotoId, ordem } na nova sequência
  fotos: z.array(
    z.object({
      fotoId: z.string(),
      ordem: z.number().int().min(0),
    })
  ).min(1),
});

// ─── PATCH /api/admin/imoveis/[id]/fotos/reorder ─────────────────────────────

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const imovel = await prisma.imovel.findFirst({
      where: { id, deletadoEm: null },
      select: { id: true },
    });

    if (!imovel) {
      return NextResponse.json({ error: "Imovel nao encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = ReorderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Atualiza cada foto em transação
    await prisma.$transaction(
      parsed.data.fotos.map(({ fotoId, ordem }) =>
        prisma.foto.updateMany({
          where: { id: fotoId, imovelId: id },
          data: { ordem },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/admin/imoveis/[id]/fotos/reorder]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
