/**
 * GET /api/admin/portais
 * Retorna estado de cada portal (ativo/inativo) + contagens de imoveis + alertas de qualidade.
 * Rota protegida pelo middleware admin.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { PORTAIS_CONFIG, type PortalId } from "@/lib/xml-portais";

export async function GET() {
  // 1. Le todas as configuracoes de portais de uma vez
  const configs = await prisma.configuracao.findMany({
    where: {
      chave: {
        in: PORTAIS_CONFIG.map((p) => `portal_${p.id}_ativo`),
      },
    },
  });
  const configMap: Record<string, string> = {};
  for (const c of configs) {
    configMap[c.chave] = c.valor;
  }

  // 2. Conta imoveis validos para os feeds (DISPONIVEL, nao deletado)
  const totalDisponivel = await prisma.imovel.count({
    where: { status: "DISPONIVEL", deletadoEm: null },
  });

  // 3. Alertas de qualidade: imoveis sem foto
  const semFoto = await prisma.imovel.count({
    where: {
      status: "DISPONIVEL",
      deletadoEm: null,
      fotos: { none: {} },
    },
  });

  // 4. Alertas de qualidade: imoveis sem preco (usando raw para evitar limitacao de tipo Decimal?)
  const semPrecoRows = await prisma.$queryRaw<[{ count: bigint }]>(
    Prisma.sql`SELECT COUNT(*)::int AS count FROM "Imovel" WHERE status = 'DISPONIVEL' AND "deletadoEm" IS NULL AND preco IS NULL`
  );
  const semPreco = Number(semPrecoRows[0]?.count ?? 0);

  // 5. Alertas de qualidade: imoveis sem descricao
  const semDescricao = await prisma.imovel.count({
    where: {
      status: "DISPONIVEL",
      deletadoEm: null,
      OR: [{ descricao: null }, { descricao: "" }],
    },
  });

  // 6. Monta resposta por portal
  const portaisStatus = PORTAIS_CONFIG.map((p) => {
    const ativo = configMap[`portal_${p.id}_ativo`] === "true";
    return {
      id: p.id as PortalId,
      nome: p.nome,
      grupo: p.grupo,
      requerContrato: p.requerContrato,
      maxFotos: p.maxFotos,
      documentacaoUrl: p.documentacaoUrl,
      ativo,
      countImoveis: totalDisponivel,
    };
  });

  return NextResponse.json({
    portais: portaisStatus,
    alertas: {
      totalDisponivel,
      semFoto,
      semPreco,
      semDescricao,
    },
  });
}
