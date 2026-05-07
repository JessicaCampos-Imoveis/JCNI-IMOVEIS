import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

function normalizarNome(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

const ItemCreateSchema = z.object({
  nome: z.string().min(2).max(100),
  icone: z.string().max(50).optional().nullable(),
  categoriaId: z.string().min(1),
});

export async function GET() {
  try {
    const itens = await prisma.comodidade.findMany({
      orderBy: [{ nome: "asc" }],
      include: {
        categoria: {
          select: { id: true, nome: true, icone: true },
        },
      },
    });

    return NextResponse.json(itens);
  } catch (err) {
    console.error("[GET /api/admin/comodidades/itens]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ItemCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const nome = normalizarNome(parsed.data.nome);

    const categoria = await prisma.categoriaComodidade.findUnique({
      where: { id: parsed.data.categoriaId },
      select: { id: true },
    });

    if (!categoria) {
      return NextResponse.json({ error: "Categoria nao encontrada" }, { status: 404 });
    }

    const duplicado = await prisma.comodidade.findFirst({
      where: {
        categoriaId: parsed.data.categoriaId,
        nome: {
          equals: nome,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    if (duplicado) {
      return NextResponse.json({ error: "Item ja cadastrado nesta categoria" }, { status: 409 });
    }

    const item = await prisma.comodidade.create({
      data: {
        nome,
        icone: parsed.data.icone ?? null,
        categoriaId: parsed.data.categoriaId,
      },
      include: {
        categoria: {
          select: { id: true, nome: true, icone: true },
        },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/comodidades/itens]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
