import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

function normalizarNome(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

type Params = { params: Promise<{ id: string }> };

const ItemUpdateSchema = z.object({
  nome: z.string().min(2).max(100).optional(),
  icone: z.string().max(50).optional().nullable(),
  categoriaId: z.string().min(1).optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const existente = await prisma.comodidade.findUnique({
      where: { id },
      select: { id: true, nome: true, categoriaId: true },
    });

    if (!existente) {
      return NextResponse.json({ error: "Item nao encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = ItemUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (parsed.data.categoriaId) {
      const categoria = await prisma.categoriaComodidade.findUnique({
        where: { id: parsed.data.categoriaId },
        select: { id: true },
      });

      if (!categoria) {
        return NextResponse.json({ error: "Categoria nao encontrada" }, { status: 404 });
      }
    }

    const categoriaDestino = parsed.data.categoriaId ?? existente.categoriaId;
    const nomeDestino = normalizarNome(parsed.data.nome ?? existente.nome);

    const duplicado = await prisma.comodidade.findFirst({
      where: {
        id: { not: id },
        categoriaId: categoriaDestino,
        nome: {
          equals: nomeDestino,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    if (duplicado) {
      return NextResponse.json({ error: "Ja existe item com este nome na categoria" }, { status: 409 });
    }

    const dataAtualizacao = {
      ...parsed.data,
      ...(parsed.data.nome ? { nome: normalizarNome(parsed.data.nome) } : {}),
    };

    const atualizado = await prisma.comodidade.update({
      where: { id },
      data: dataAtualizacao,
      include: {
        categoria: {
          select: { id: true, nome: true, icone: true },
        },
      },
    });

    return NextResponse.json(atualizado);
  } catch (err) {
    console.error("[PATCH /api/admin/comodidades/itens/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const existente = await prisma.comodidade.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existente) {
      return NextResponse.json({ error: "Item nao encontrado" }, { status: 404 });
    }

    await prisma.comodidade.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/comodidades/itens/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
