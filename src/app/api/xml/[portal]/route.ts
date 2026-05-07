/**
 * GET /api/xml/[portal]
 * Feed XML publico para portais imobiliarios.
 * ISR: revalidado a cada 30 minutos.
 *
 * Retorna 404 se o portal for desconhecido ou estiver desativado no painel.
 * Privacidade: expoe somente bairro + cidade + UF (RN-PRIV-05).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPortalConfig,
  gerarXml,
  type ImovelParaXml,
} from "@/lib/xml-portais";

export const revalidate = 1800; // 30 minutos

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ portal: string }> }
) {
  const { portal: portalId } = await params;

  // 1. Verifica se o portal existe no catalogo
  const portalConfig = getPortalConfig(portalId);
  if (!portalConfig) {
    return new NextResponse("Portal nao encontrado", { status: 404 });
  }

  // 2. Verifica se o portal esta ativo no banco (Configuracao)
  const chave = `portal_${portalId}_ativo`;
  const config = await prisma.configuracao.findUnique({ where: { chave } });
  if (!config || config.valor !== "true") {
    return new NextResponse("Feed desativado", { status: 404 });
  }

  // 3. Busca imoveis disponíveis, sem soft delete, com fotos
  const imoveis = await prisma.imovel.findMany({
    where: {
      status: "DISPONIVEL",
      deletadoEm: null,
    },
    select: {
      codigo: true,
      titulo: true,
      descricao: true,
      tipo: true,
      finalidade: true,
      preco: true,
      precoCondominio: true,
      iptu: true,
      area: true,
      areaUtil: true,
      quartos: true,
      suites: true,
      banheiros: true,
      vagas: true,
      bairro: true,
      cidade: true,
      estado: true,
      slugUrl: true,
      fotos: {
        select: { url: true, ordem: true },
        orderBy: { ordem: "asc" },
      },
    },
  });

  // 4. Mapeia para o tipo do engine (converte Decimal -> number | null)
  const imoveisParaXml: ImovelParaXml[] = imoveis.map((im) => ({
    codigo: im.codigo,
    titulo: im.titulo,
    descricao: im.descricao,
    tipo: im.tipo,
    finalidade: im.finalidade,
    preco: im.preco !== null ? Number(im.preco) : null,
    precoCondominio:
      im.precoCondominio !== null ? Number(im.precoCondominio) : null,
    iptu: im.iptu !== null ? Number(im.iptu) : null,
    area: im.area !== null ? Number(im.area) : null,
    areaUtil: im.areaUtil !== null ? Number(im.areaUtil) : null,
    quartos: im.quartos,
    suites: im.suites,
    banheiros: im.banheiros,
    vagas: im.vagas,
    bairro: im.bairro,
    cidade: im.cidade,
    estado: im.estado,
    slugUrl: im.slugUrl,
    fotos: im.fotos,
  }));

  // 5. Determina URL base do site
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://jessicacampos.com.br";

  // 6. Gera XML e retorna
  const xml = gerarXml(portalConfig, imoveisParaXml, siteUrl);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=300",
    },
  });
}
