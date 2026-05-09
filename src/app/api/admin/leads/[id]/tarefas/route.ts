import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const TarefaSchema = z.object({
  titulo: z.string().min(1).max(300),
  tipo: z.string().max(50).default("FOLLOW_UP"),
  dataHora: z.string().max(30).optional(),
  responsavel: z.string().max(120).optional(),
  observacao: z.string().max(1000).optional(),
});

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const tarefas = await prisma.leadTarefa.findMany({
      where: { leadId: id },
      orderBy: { criadaEm: "asc" },
      select: { id: true, titulo: true, tipo: true, dataHora: true, responsavel: true, observacao: true, status: true, criadaEm: true },
    });
    return NextResponse.json(tarefas);
  } catch (err) {
    console.error("[GET /api/admin/leads/[id]/tarefas]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = TarefaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados invalidos", detalhes: parsed.error.flatten() }, { status: 400 });
    }

    const tarefa = await prisma.leadTarefa.create({
      data: {
        leadId: id,
        titulo: parsed.data.titulo,
        tipo: parsed.data.tipo,
        dataHora: parsed.data.dataHora,
        responsavel: parsed.data.responsavel,
        observacao: parsed.data.observacao,
        status: "PENDENTE",
      },
      select: { id: true, titulo: true, tipo: true, dataHora: true, responsavel: true, observacao: true, status: true, criadaEm: true },
    });

    await prisma.leadAtividade.create({
      data: {
        leadId: id,
        tipo: "lead.tarefa_criada",
        titulo: `Tarefa: ${parsed.data.titulo}`,
        descricao: parsed.data.observacao?.slice(0, 120) ?? "",
        tone: "neutral",
      },
    });

    return NextResponse.json(tarefa, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/leads/[id]/tarefas]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
