import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { StatusImovel } from "@/generated/prisma/client";

type Params = { params: Promise<{ slug: string }> };

// ─── Campos publicos — identicos ao /api/imoveis (RN01) ──────────────────────

const IMOVEL_PUBLIC_SELECT = {
  id: true,
  codigo: true,
  titulo: true,
  descricao: true,
  tipo: true,
  finalidade: true,
  status: true,
  preco: true,
  precoCondominio: true,
  iptu: true,
  bairro: true,
  cidade: true,
  estado: true,
  area: true,
  areaUtil: true,
  quartos: true,
  suites: true,
  banheiros: true,
  vagas: true,
  videoYoutube: true,
  nomeCondominio: true,
  slugUrl: true,
  altTexto: true,
  metaTitulo: true,
  metaDescricao: true,
  visualizacoes: true,
  criadoEm: true,
  fotos: {
    select: {
      id: true,
      url: true,
      ordem: true,
      destaque: true,
    },
    orderBy: [{ destaque: "desc" as const }, { ordem: "asc" as const }],
  },
  comodos: {
    select: {
      id: true,
      nome: true,
      areaM2: true,
      ordem: true,
    },
    orderBy: { ordem: "asc" as const },
  },
  comodidades: {
    select: {
      comodidade: {
        select: {
          id: true,
          nome: true,
          icone: true,
          categoria: {
            select: { id: true, nome: true, icone: true, ordem: true },
          },
        },
      },
    },
  },
};

// ─── GET /api/imoveis/[slug] ──────────────────────────────────────────────────

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    const imovel = await prisma.imovel.findFirst({
      where: {
        slugUrl: slug,
        deletadoEm: null,
        status: {
          // INATIVO nunca aparece (RN02); DISPONIVEL, RESERVADO, VENDIDO, LOCADO sao visiveis
          not: "INATIVO" as StatusImovel,
        },
      },
      select: IMOVEL_PUBLIC_SELECT,
    });

    if (!imovel) {
      return NextResponse.json({ error: "Imovel nao encontrado" }, { status: 404 });
    }

    // Incrementa visualizacoes de forma nao-bloqueante
    prisma.imovel
      .update({
        where: { id: imovel.id },
        data: { visualizacoes: { increment: 1 } },
      })
      .catch(() => {
        // falha silenciosa — nao bloqueia a resposta
      });

    // Serializa Decimal para number
    const resposta = {
      ...imovel,
      preco: Number(imovel.preco),
      precoCondominio: imovel.precoCondominio != null ? Number(imovel.precoCondominio) : null,
      iptu: imovel.iptu != null ? Number(imovel.iptu) : null,
    };

    return NextResponse.json(resposta, {
      headers: {
        // ISR-like cache: 1h via CDN, revalida em background
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[GET /api/imoveis/[slug]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
