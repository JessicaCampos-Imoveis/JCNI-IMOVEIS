import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { gerarCodigoImovel, gerarSlug, gerarAltTexto, gerarMetaTitulo, gerarMetaDescricao } from "@/lib/imovel-utils";
import type { TipoImovel, Finalidade } from "@/generated/prisma/client";

const ITENS_POR_PAGINA = 20;

// ─── Zod schema para criação ──────────────────────────────────────────────────

const ImovelCreateSchema = z.object({
  titulo: z.string().min(5).max(200),
  descricao: z.string().max(5000).optional(),
  tipo: z.enum(["APARTAMENTO", "CASA", "TERRENO", "COMERCIAL", "COBERTURA", "KITNET", "RURAL"]),
  finalidade: z.enum(["VENDA", "ALUGUEL", "AMBOS"]),
  status: z.enum(["DISPONIVEL", "RESERVADO", "VENDIDO", "LOCADO", "INATIVO"]).default("DISPONIVEL"),
  preco: z.number().positive(),
  precoCondominio: z.number().positive().optional(),
  iptu: z.number().positive().optional(),
  bairro: z.string().min(2).max(100),
  cidade: z.string().min(2).max(100).default("Sorocaba"),
  estado: z.string().length(2).default("SP"),
  nomeCondominio: z.string().max(200).optional(),
  area: z.number().positive().optional(),
  areaUtil: z.number().positive().optional(),
  quartos: z.number().int().min(0).max(50).optional(),
  suites: z.number().int().min(0).max(50).optional(),
  banheiros: z.number().int().min(0).max(50).optional(),
  vagas: z.number().int().min(0).max(50).optional(),
  videoYoutube: z.string().url().optional().or(z.literal("")),
  // Dados privados (RN01)
  nomeProprietario: z.string().max(200).optional(),
  telefoneProprietario: z.string().max(30).optional(),
  emailProprietario: z.string().email().optional().or(z.literal("")),
  cep: z.string().max(10).optional(),
  rua: z.string().max(200).optional(),
  numero: z.string().max(20).optional(),
  complemento: z.string().max(100).optional(),
  andar: z.string().max(20).optional(),
  observacoesInternas: z.string().max(2000).optional(),
  comodidadeIds: z.array(z.string().min(1)).optional(),
});

// ─── GET /api/admin/imoveis ───────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const pagina = Math.max(1, parseInt(searchParams.get("pagina") ?? "1", 10));
    const status = searchParams.get("status") ?? undefined;
    const tipo = searchParams.get("tipo") ?? undefined;
    const busca = searchParams.get("busca")?.trim() ?? undefined;

    const where = {
      deletadoEm: null,
      ...(status && { status: status as never }),
      ...(tipo && { tipo: tipo as never }),
      ...(busca && {
        OR: [
          { titulo: { contains: busca, mode: "insensitive" as const } },
          { codigo: { contains: busca, mode: "insensitive" as const } },
          { bairro: { contains: busca, mode: "insensitive" as const } },
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
        select: {
          id: true,
          codigo: true,
          titulo: true,
          tipo: true,
          finalidade: true,
          status: true,
          preco: true,
          bairro: true,
          cidade: true,
          quartos: true,
          vagas: true,
          slugUrl: true,
          visualizacoes: true,
          criadoEm: true,
          atualizadoEm: true,
          fotos: {
            where: { destaque: true },
            take: 1,
            select: { url: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      imoveis,
      paginacao: {
        total,
        pagina,
        porPagina: ITENS_POR_PAGINA,
        totalPaginas: Math.ceil(total / ITENS_POR_PAGINA),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/imoveis]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ─── POST /api/admin/imoveis ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ImovelCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const { comodidadeIds: comodidadeIdsRaw, ...dataRest } = data;
    const comodidadeIds = Array.from(new Set(comodidadeIdsRaw ?? []));

    const codigo = await gerarCodigoImovel();
    const slugUrl = await gerarSlug(data.tipo as TipoImovel, data.bairro, codigo);
    const altTexto = gerarAltTexto({
      tipo: data.tipo as TipoImovel,
      quartos: data.quartos,
      bairro: data.bairro,
      cidade: data.cidade,
      codigo,
    });
    const metaTitulo = gerarMetaTitulo({
      tipo: data.tipo as TipoImovel,
      finalidade: data.finalidade as Finalidade,
      quartos: data.quartos,
      bairro: data.bairro,
      cidade: data.cidade,
    });
    const metaDescricao = gerarMetaDescricao({
      tipo: data.tipo as TipoImovel,
      finalidade: data.finalidade as Finalidade,
      bairro: data.bairro,
      cidade: data.cidade,
      quartos: data.quartos,
      area: data.area,
      codigo,
    });

    const imovel = await prisma.imovel.create({
      data: {
        ...dataRest,
        tipo: dataRest.tipo as TipoImovel,
        finalidade: dataRest.finalidade as Finalidade,
        status: dataRest.status as never,
        codigo,
        slugUrl,
        altTexto,
        metaTitulo,
        metaDescricao,
        precoCondominio: dataRest.precoCondominio ?? null,
        iptu: dataRest.iptu ?? null,
        videoYoutube: dataRest.videoYoutube || null,
        emailProprietario: dataRest.emailProprietario || null,
        comodidades: comodidadeIds.length > 0
          ? {
              create: comodidadeIds.map((comodidadeId) => ({ comodidadeId })),
            }
          : undefined,
      },
      select: {
        id: true,
        codigo: true,
        slugUrl: true,
        titulo: true,
        status: true,
        criadoEm: true,
      },
    });

    return NextResponse.json(imovel, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/imoveis]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
