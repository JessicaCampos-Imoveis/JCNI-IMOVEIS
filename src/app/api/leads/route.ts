import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  enviarEmailConfirmacaoLead,
  enviarEmailNotificacaoLead,
} from "@/lib/email";
import { dispararWebhooks } from "@/lib/webhook";
import { dispararCRM } from "@/lib/crm";

const LeadCreateSchema = z.object({
  nome: z.string().min(2).max(120),
  telefone: z.string().min(8).max(30),
  email: z.string().email().max(120).optional().or(z.literal("")),
  mensagem: z.string().max(2000).optional().or(z.literal("")),
  imovelSlug: z.string().max(300).optional().or(z.literal("")),
  utmSource: z.string().max(100).optional().or(z.literal("")),
  utmMedium: z.string().max(100).optional().or(z.literal("")),
  utmCampaign: z.string().max(120).optional().or(z.literal("")),
});

function vazioParaNull(value?: string): string | null {
  if (!value) return null;
  const v = value.trim();
  return v.length > 0 ? v : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LeadCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let imovelId: string | null = null;

    const slug = vazioParaNull(data.imovelSlug);
    if (slug) {
      const imovel = await prisma.imovel.findFirst({
        where: { slugUrl: slug, deletadoEm: null },
        select: { id: true },
      });
      imovelId = imovel?.id ?? null;
    }

    const emailLead = vazioParaNull(data.email);

    const lead = await prisma.lead.create({
      data: {
        nome: data.nome.trim(),
        telefone: data.telefone.trim(),
        email: emailLead,
        mensagem: vazioParaNull(data.mensagem),
        imovelId,
        origem: "contato",
        utmSource: vazioParaNull(data.utmSource),
        utmMedium: vazioParaNull(data.utmMedium),
        utmCampaign: vazioParaNull(data.utmCampaign),
      },
      select: {
        id: true,
        nome: true,
        criadoEm: true,
      },
    });

    // Busca titulo do imovel para incluir nos emails
    let imovelTitulo: string | null = null;
    if (imovelId) {
      const imovelRef = await prisma.imovel.findUnique({
        where: { id: imovelId },
        select: { titulo: true },
      });
      imovelTitulo = imovelRef?.titulo ?? null;
    }

    // Disparar emails e webhooks em paralelo sem bloquear resposta
    void Promise.all([
      emailLead
        ? enviarEmailConfirmacaoLead({
            nome: lead.nome,
            email: emailLead,
            mensagem: vazioParaNull(data.mensagem),
            imovelTitulo,
          })
        : Promise.resolve(),
      enviarEmailNotificacaoLead({
        nome: lead.nome,
        telefone: data.telefone.trim(),
        email: emailLead,
        mensagem: vazioParaNull(data.mensagem),
        imovelTitulo,
        imovelSlug: slug,
      }),
      dispararWebhooks("lead.criado", {
        id: lead.id,
        nome: lead.nome,
        telefone: data.telefone.trim(),
        email: emailLead,
        mensagem: vazioParaNull(data.mensagem),
        imovelTitulo,
        imovelSlug: slug,
        criadoEm: lead.criadoEm,
      }),
      dispararCRM({
        nome: lead.nome,
        telefone: data.telefone.trim(),
        email: emailLead,
        mensagem: vazioParaNull(data.mensagem),
        imovelTitulo,
      }),
    ]);

    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
