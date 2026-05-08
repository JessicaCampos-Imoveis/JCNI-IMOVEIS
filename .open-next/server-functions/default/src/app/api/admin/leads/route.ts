import { NextRequest, NextResponse } from "next/server";
import type { LeadStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const LEADS_POR_PAGINA = 50;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const pagina = Math.max(1, parseInt(searchParams.get("pagina") ?? "1", 10));
    const status = searchParams.get("status")?.trim() ?? "";
    const busca = searchParams.get("busca")?.trim() ?? "";

    const where = {
      ...(status ? { status: status as LeadStatus } : {}),
      ...(busca
        ? {
            OR: [
              { nome: { contains: busca, mode: "insensitive" as const } },
              { telefone: { contains: busca, mode: "insensitive" as const } },
              { email: { contains: busca, mode: "insensitive" as const } },
              { mensagem: { contains: busca, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy: { criadoEm: "desc" },
        skip: (pagina - 1) * LEADS_POR_PAGINA,
        take: LEADS_POR_PAGINA,
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          mensagem: true,
          status: true,
          origem: true,
          utmSource: true,
          utmMedium: true,
          utmCampaign: true,
          criadoEm: true,
          imovel: {
            select: {
              id: true,
              codigo: true,
              titulo: true,
              slugUrl: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      leads,
      paginacao: {
        total,
        pagina,
        porPagina: LEADS_POR_PAGINA,
        totalPaginas: Math.ceil(total / LEADS_POR_PAGINA),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/leads]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}