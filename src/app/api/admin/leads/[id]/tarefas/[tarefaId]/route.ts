import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; tarefaId: string }> };

const PatchTarefaSchema = z.object({
  status: z.enum(["PENDENTE", "CONCLUIDA"]).optional(),
  titulo: z.string().max(300).optional(),
  dataHora: z.string().max(30).optional(),
  responsavel: z.string().max(120).optional(),
  observacao: z.string().max(1000).optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id, tarefaId } = await params;
    const body = await req.json();
    const parsed = PatchTarefaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados invalidos", detalhes: parsed.error.flatten() }, { status: 400 });
    }

    const tarefa = await prisma.leadTarefa.update({
      where: { id: tarefaId, leadId: id },
      data: {
        ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {}),
        ...(parsed.data.titulo !== undefined ? { titulo: parsed.data.titulo } : {}),
        ...(parsed.data.dataHora !== undefined ? { dataHora: parsed.data.dataHora } : {}),
        ...(parsed.data.responsavel !== undefined ? { responsavel: parsed.data.responsavel } : {}),
        ...(parsed.data.observacao !== undefined ? { observacao: parsed.data.observacao } : {}),
      },
      select: { id: true, titulo: true, tipo: true, dataHora: true, responsavel: true, observacao: true, status: true, criadaEm: true },
    });

    if (parsed.data.status === "CONCLUIDA") {
      await prisma.leadAtividade.create({
        data: {
          leadId: id,
          tipo: "lead.tarefa_concluida",
          titulo: `Tarefa concluida: ${tarefa.titulo}`,
          descricao: "",
          tone: "success",
        },
      });
    }

    return NextResponse.json(tarefa);
  } catch (err) {
    console.error("[PATCH /api/admin/leads/[id]/tarefas/[tarefaId]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id, tarefaId } = await params;
    await prisma.leadTarefa.delete({ where: { id: tarefaId, leadId: id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/leads/[id]/tarefas/[tarefaId]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
