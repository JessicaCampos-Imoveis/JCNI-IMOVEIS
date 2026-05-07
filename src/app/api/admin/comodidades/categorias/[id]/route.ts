import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

function normalizarNome(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

type Params = { params: Promise<{ id: string }> };

const CategoriaUpdateSchema = z.object({
  nome: z.string().min(2).max(100).optional(),
  icone: z.string().max(50).optional().nullable(),
  ordem: z.number().int().min(0).optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const existente = await prisma.categoriaComodidade.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existente) {
      return NextResponse.json({ error: "Categoria nao encontrada" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = CategoriaUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const dataAtualizacao = { ...parsed.data };

    if (typeof dataAtualizacao.nome === "string") {
      dataAtualizacao.nome = normalizarNome(dataAtualizacao.nome);

      const duplicada = await prisma.categoriaComodidade.findFirst({
        where: {
          id: { not: id },
          nome: {
            equals: dataAtualizacao.nome,
            mode: "insensitive",
          },
        },
        select: { id: true },
      });

      if (duplicada) {
        return NextResponse.json({ error: "Ja existe categoria com este nome" }, { status: 409 });
      }
    }

    const atualizada = await prisma.categoriaComodidade.update({
      where: { id },
      data: dataAtualizacao,
    });

    return NextResponse.json(atualizada);
  } catch (err) {
    console.error("[PATCH /api/admin/comodidades/categorias/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const categoria = await prisma.categoriaComodidade.findUnique({
      where: { id },
      select: { id: true, _count: { select: { itens: true } } },
    });

    if (!categoria) {
      return NextResponse.json({ error: "Categoria nao encontrada" }, { status: 404 });
    }

    if (categoria._count.itens > 0) {
      return NextResponse.json(
        { error: "Categoria possui itens vinculados. Remova os itens antes de excluir." },
        { status: 400 }
      );
    }

    await prisma.categoriaComodidade.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/comodidades/categorias/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
