import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const ComodoCreateSchema = z.object({
  nome: z.string().min(1).max(100),
  areaM2: z.number().positive().optional().nullable(),
  ordem: z.number().int().min(0).optional(),
});

// ─── GET /api/admin/imoveis/[id]/comodos ─────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const imovel = await prisma.imovel.findFirst({
      where: { id, deletadoEm: null },
      select: { id: true },
    });

    if (!imovel) {
      return NextResponse.json({ error: "Imovel nao encontrado" }, { status: 404 });
    }

    const comodos = await prisma.comodo.findMany({
      where: { imovelId: id },
      orderBy: { ordem: "asc" },
    });

    return NextResponse.json(comodos);
  } catch (err) {
    console.error("[GET /api/admin/imoveis/[id]/comodos]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ─── POST /api/admin/imoveis/[id]/comodos ────────────────────────────────────

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

    const body = await req.json();
    const parsed = ComodoCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Se ordem não informada, usa a próxima disponível
    let ordem = parsed.data.ordem;
    if (ordem === undefined) {
      const ultimo = await prisma.comodo.findFirst({
        where: { imovelId: id },
        orderBy: { ordem: "desc" },
        select: { ordem: true },
      });
      ordem = (ultimo?.ordem ?? -1) + 1;
    }

    const comodo = await prisma.comodo.create({
      data: {
        imovelId: id,
        nome: parsed.data.nome,
        areaM2: parsed.data.areaM2 ?? null,
        ordem,
      },
    });

    return NextResponse.json(comodo, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/imoveis/[id]/comodos]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
