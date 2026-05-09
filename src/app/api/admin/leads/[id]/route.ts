import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { dispararWebhooks } from "@/lib/webhook";

type Params = { params: Promise<{ id: string }> };

const LeadUpdateSchema = z.object({
  status: z.enum(["NOVO", "EM_CONTATO", "VISITOU", "PROPOSTA", "FECHADO", "PERDIDO"]),
});

const LeadPatchSchema = z.object({
  status: z.enum(["NOVO", "EM_CONTATO", "VISITOU", "PROPOSTA", "FECHADO", "PERDIDO"]).optional(),
  responsavel: z.string().max(120).optional(),
  proximaAcao: z.string().max(500).optional(),
  motivoPerda: z.string().max(200).optional(),
});

const LeadDeleteSchema = z.object({
  confirmText: z.literal("EXCLUIR"),
  leadIdConfirm: z.string().min(1),
});

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
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
        responsavel: true,
        proximaAcao: true,
        motivoPerda: true,
        imovel: { select: { id: true, codigo: true, titulo: true, slugUrl: true } },
        notas: { orderBy: { criadaEm: "asc" }, select: { id: true, texto: true, criadaEm: true } },
        tarefas: { orderBy: { criadaEm: "asc" }, select: { id: true, titulo: true, tipo: true, dataHora: true, responsavel: true, observacao: true, status: true, criadaEm: true } },
        atividades: { orderBy: { criadaEm: "desc" }, take: 50, select: { id: true, tipo: true, titulo: true, descricao: true, origem: true, tone: true, criadaEm: true } },
      },
    });

    if (!lead) return NextResponse.json({ error: "Lead nao encontrado" }, { status: 404 });

    return NextResponse.json(lead);
  } catch (err) {
    console.error("[GET /api/admin/leads/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const body = await req.json();
    const parsed = LeadPatchSchema.safeParse(body);

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
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.responsavel !== undefined ? { responsavel: parsed.data.responsavel } : {}),
        ...(parsed.data.proximaAcao !== undefined ? { proximaAcao: parsed.data.proximaAcao } : {}),
        ...(parsed.data.motivoPerda !== undefined ? { motivoPerda: parsed.data.motivoPerda } : {}),
      },
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

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const body = await req.json().catch(() => ({}));
    const parsed = LeadDeleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Confirmacao invalida para exclusao" },
        { status: 400 }
      );
    }

    if (parsed.data.leadIdConfirm !== id) {
      return NextResponse.json(
        { error: "Lead de confirmacao nao confere" },
        { status: 400 }
      );
    }

    const existente = await prisma.lead.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existente) {
      return NextResponse.json({ error: "Lead nao encontrado" }, { status: 404 });
    }

    await prisma.lead.delete({ where: { id } });

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[DELETE /api/admin/leads/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}