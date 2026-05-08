import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; comodoId: string }> };

const ComodoUpdateSchema = z.object({
  nome: z.string().min(1).max(100).optional(),
  areaM2: z.number().positive().optional().nullable(),
  ordem: z.number().int().min(0).optional(),
});

// ─── PATCH /api/admin/imoveis/[id]/comodos/[comodoId] ────────────────────────

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id, comodoId } = await params;

    const comodo = await prisma.comodo.findFirst({
      where: { id: comodoId, imovelId: id },
    });

    if (!comodo) {
      return NextResponse.json({ error: "Comodo nao encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = ComodoUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const atualizado = await prisma.comodo.update({
      where: { id: comodoId },
      data: parsed.data,
    });

    return NextResponse.json(atualizado);
  } catch (err) {
    console.error("[PATCH /api/admin/imoveis/[id]/comodos/[comodoId]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ─── DELETE /api/admin/imoveis/[id]/comodos/[comodoId] ───────────────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id, comodoId } = await params;

    const comodo = await prisma.comodo.findFirst({
      where: { id: comodoId, imovelId: id },
    });

    if (!comodo) {
      return NextResponse.json({ error: "Comodo nao encontrado" }, { status: 404 });
    }

    await prisma.comodo.delete({ where: { id: comodoId } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/imoveis/[id]/comodos/[comodoId]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
