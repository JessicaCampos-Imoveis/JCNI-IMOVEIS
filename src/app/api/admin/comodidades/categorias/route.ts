import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

function normalizarNome(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

const CategoriaCreateSchema = z.object({
  nome: z.string().min(2).max(100),
  icone: z.string().max(50).optional().nullable(),
  ordem: z.number().int().min(0).optional(),
});

export async function GET() {
  try {
    const categorias = await prisma.categoriaComodidade.findMany({
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
      include: {
        itens: {
          orderBy: [{ nome: "asc" }],
          select: {
            id: true,
            nome: true,
            icone: true,
            categoriaId: true,
          },
        },
      },
    });

    return NextResponse.json(categorias);
  } catch (err) {
    console.error("[GET /api/admin/comodidades/categorias]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CategoriaCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const nome = normalizarNome(parsed.data.nome);

    const duplicada = await prisma.categoriaComodidade.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    if (duplicada) {
      return NextResponse.json({ error: "Categoria ja cadastrada" }, { status: 409 });
    }

    let ordem = parsed.data.ordem;
    if (ordem === undefined) {
      const ultima = await prisma.categoriaComodidade.findFirst({
        orderBy: { ordem: "desc" },
        select: { ordem: true },
      });
      ordem = (ultima?.ordem ?? -1) + 1;
    }

    const categoria = await prisma.categoriaComodidade.create({
      data: {
        nome,
        icone: parsed.data.icone ?? null,
        ordem,
      },
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/comodidades/categorias]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
