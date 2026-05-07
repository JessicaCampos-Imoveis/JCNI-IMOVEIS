import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { dispararWebhooks } from "@/lib/webhook";

type Params = { params: Promise<{ id: string }> };

const LeadUpdateSchema = z.object({
  status: z.enum(["NOVO", "EM_CONTATO", "VISITOU", "PROPOSTA", "FECHADO", "PERDIDO"]),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const body = await req.json();
    const parsed = LeadUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existente = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        nome: true,
        telefone: true,
        email: true,
        mensagem: true,
        criadoEm: true,
        imovel: {
          select: {
            slugUrl: true,
            titulo: true,
          },
        },
      },
    });

    if (!existente) {
      return NextResponse.json({ error: "Lead nao encontrado" }, { status: 404 });
    }

    const atualizado = await prisma.lead.update({
      where: { id },
      data: { status: parsed.data.status },
      select: {
        id: true,
        status: true,
        nome: true,
        criadoEm: true,
      },
    });

    if (existente.status !== atualizado.status) {
      void dispararWebhooks("lead.status_alterado", {
        id: atualizado.id,
        nome: existente.nome,
        telefone: existente.telefone,
        email: existente.email,
        mensagem: existente.mensagem,
        statusAnterior: existente.status,
        statusNovo: atualizado.status,
        imovelSlug: existente.imovel?.slugUrl ?? null,
        imovelTitulo: existente.imovel?.titulo ?? null,
        criadoEm: existente.criadoEm,
      });
    }

    return NextResponse.json(atualizado);
  } catch (err) {
    console.error("[PATCH /api/admin/leads/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}