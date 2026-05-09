import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const AtividadeSchema = z.object({
  tipo: z.string().min(1).max(80),
  titulo: z.string().min(1).max(300),
  descricao: z.string().max(1000).default(""),
  origem: z.string().max(80).optional(),
  tone: z.enum(["neutral", "success", "warning", "danger"]).optional(),
});

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = AtividadeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados invalidos", detalhes: parsed.error.flatten() }, { status: 400 });
    }

    const atividade = await prisma.leadAtividade.create({
      data: {
        leadId: id,
        tipo: parsed.data.tipo,
        titulo: parsed.data.titulo,
        descricao: parsed.data.descricao,
        origem: parsed.data.origem,
        tone: parsed.data.tone,
      },
      select: { id: true, tipo: true, titulo: true, descricao: true, origem: true, tone: true, criadaEm: true },
    });

    return NextResponse.json(atividade, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/leads/[id]/atividades]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
