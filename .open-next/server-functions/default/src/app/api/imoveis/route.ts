import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TipoImovel, Finalidade, StatusImovel } from "@/generated/prisma/client";

// ─── DTO público — NUNCA inclui dados privados (RN01) ─────────────────────────

export type FotoPublica = {
  id: string;
  url: string;
  ordem: number;
  destaque: boolean;
};

export type ImovelPublico = {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string | null;
  tipo: TipoImovel;
  finalidade: Finalidade;
  status: StatusImovel;
  preco: number;
  precoCondominio: number | null;
  bairro: string;
  cidade: string;
  estado: string;
  area: number | null;
  areaUtil: number | null;
  quartos: number | null;
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  videoYoutube: string | null;
  nomeCondominio: string | null;
  slugUrl: string;
  altTexto: string | null;
  metaTitulo: string | null;
  metaDescricao: string | null;
  fotos: FotoPublica[];
  criadoEm: Date;
};

const ITENS_POR_PAGINA = 20;

const FINALIDADES = ["VENDA", "ALUGUEL", "AMBOS"] as const;
const TIPOS = ["APARTAMENTO", "CASA", "TERRENO", "COMERCIAL", "COBERTURA", "KITNET", "RURAL"] as const;

const BAIRRO_SLUG_MAP: Record<string, string> = {
  campolim: "Campolim",
  centro: "Centro",
  eden: "Eden",
  "wanel-ville": "Wanel Ville",
  "alem-ponte": "Alem Ponte",
  aparecidinha: "Aparecidinha",
  "jardim-paulistano": "Jardim Paulistano",
  "santa-rosalia": "Santa Rosalia",
};

function normalizarEnum<T extends string>(valor: string | null, permitidos: readonly T[]): T | undefined {
  if (!valor) return undefined;
  const candidato = valor.trim().toUpperCase() as T;
  return permitidos.includes(candidato) ? candidato : undefined;
}

function normalizarTextoLocal(valor: string | null): string | undefined {
  if (!valor) return undefined;
  const decodificado = decodeURIComponent(valor).trim().replace(/\+/g, " ");
  if (!decodificado) return undefined;
  const slug = decodificado.toLowerCase();
  if (BAIRRO_SLUG_MAP[slug]) return BAIRRO_SLUG_MAP[slug];
  return decodificado.replace(/-/g, " ");
}

// ─── Campos public select — explícito para segurança ─────────────────────────

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
};

// ─── GET /api/imoveis ─────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const pagina = Math.max(1, parseInt(searchParams.get("pagina") ?? "1", 10));
    const finalidade = normalizarEnum(searchParams.get("finalidade"), FINALIDADES);
    const tipo = normalizarEnum(searchParams.get("tipo"), TIPOS);
    const bairro = normalizarTextoLocal(searchParams.get("bairro"));
    const cidadeParam = normalizarTextoLocal(searchParams.get("cidade"));
    const quartosMin = searchParams.get("quartos_min");
    const precoMin = searchParams.get("preco_min");
    const precoMax = searchParams.get("preco_max");
    const busca = normalizarTextoLocal(searchParams.get("busca"));

    const where = {
      deletadoEm: null,
      status: { in: ["DISPONIVEL", "RESERVADO", "VENDIDO", "LOCADO"] as StatusImovel[] },
      ...(finalidade && { finalidade: finalidade as never }),
      ...(tipo && { tipo: tipo as never }),
      ...(bairro && { bairro: { contains: bairro, mode: "insensitive" as const } }),
      ...(cidadeParam && { cidade: { contains: cidadeParam, mode: "insensitive" as const } }),
      ...(quartosMin && { quartos: { gte: parseInt(quartosMin, 10) } }),
      ...(precoMin || precoMax
        ? {
            preco: {
              ...(precoMin && { gte: parseFloat(precoMin) }),
              ...(precoMax && { lte: parseFloat(precoMax) }),
            },
          }
        : {}),
      ...(busca && {
        OR: [
          { titulo: { contains: busca, mode: "insensitive" as const } },
          { bairro: { contains: busca, mode: "insensitive" as const } },
          { descricao: { contains: busca, mode: "insensitive" as const } },
        ],
      }),
    };

    const [total, imoveis] = await Promise.all([
      prisma.imovel.count({ where }),
      prisma.imovel.findMany({
        where,
        orderBy: { criadoEm: "desc" },
        skip: (pagina - 1) * ITENS_POR_PAGINA,
        take: ITENS_POR_PAGINA,
        select: IMOVEL_PUBLIC_SELECT,
      }),
    ]);

    // Serializa Decimal para number antes de enviar
    const imoveisSerializados = imoveis.map((i) => ({
      ...i,
      preco: Number(i.preco),
      precoCondominio: i.precoCondominio != null ? Number(i.precoCondominio) : null,
    }));

    return NextResponse.json({
      imoveis: imoveisSerializados,
      paginacao: {
        total,
        pagina,
        porPagina: ITENS_POR_PAGINA,
        totalPaginas: Math.ceil(total / ITENS_POR_PAGINA),
      },
    });
  } catch (err) {
    console.error("[GET /api/imoveis]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
