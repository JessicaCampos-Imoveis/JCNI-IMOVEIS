import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const NotaSchema = z.object({
  texto: z.string().min(1).max(2000),
});

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const notas = await prisma.leadNota.findMany({
      where: { leadId: id },
      orderBy: { criadaEm: "asc" },
      select: { id: true, texto: true, criadaEm: true },
    });
    return NextResponse.json(notas);
  } catch (err) {
    console.error("[GET /api/admin/leads/[id]/notas]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = NotaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados invalidos", detalhes: parsed.error.flatten() }, { status: 400 });
    }

    const nota = await prisma.leadNota.create({
      data: { leadId: id, texto: parsed.data.texto },
      select: { id: true, texto: true, criadaEm: true },
    });

    // registrar atividade
    await prisma.leadAtividade.create({
      data: {
        leadId: id,
        tipo: "lead.nota_adicionada",
        titulo: "Nota adicionada",
        descricao: parsed.data.texto.slice(0, 120),
        tone: "neutral",
      },
    });

    return NextResponse.json(nota, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/leads/[id]/notas]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
