import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        imovel: {
          select: {
            id: true,
            tipo: true,
            finalidade: true,
            preco: true,
            bairro: true,
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead nao encontrado" }, { status: 404 });
    }

    if (!lead.imovel) {
      return NextResponse.json({ similares: [] });
    }

    const imovel = lead.imovel;
    const preco = Number(imovel.preco);
    const precoMin = preco * 0.6;
    const precoMax = preco * 1.4;

    const similares = await prisma.imovel.findMany({
      where: {
        id: { not: imovel.id },
        tipo: imovel.tipo,
        finalidade: imovel.finalidade,
        status: "DISPONIVEL",
        deletadoEm: null,
        OR: [
          { preco: { gte: precoMin, lte: precoMax } },
          { bairro: imovel.bairro },
        ],
      },
      select: {
        id: true,
        codigo: true,
        titulo: true,
        tipo: true,
        finalidade: true,
        preco: true,
        bairro: true,
        cidade: true,
        area: true,
        quartos: true,
        vagas: true,
        slugUrl: true,
        fotos: {
          where: { destaque: true },
          take: 1,
          select: { url: true },
        },
      },
      orderBy: { criadoEm: "desc" },
      take: 4,
    });

    return NextResponse.json({ similares });
  } catch (err) {
    console.error("[GET /api/admin/leads/[id]/similares]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
