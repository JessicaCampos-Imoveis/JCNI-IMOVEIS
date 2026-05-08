import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const WebhookUpdateSchema = z.object({
  nome: z.string().min(1).max(120).optional(),
  url: z.string().url().max(500).optional(),
  evento: z.enum(["lead.criado", "lead.status_alterado"]).optional(),
  ativo: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = WebhookUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados invalidos", detalhes: parsed.error.flatten() }, { status: 400 });
  }

  const webhook = await prisma.webhook.update({
    where: { id },
    data: parsed.data,
  }).catch(() => null);

  if (!webhook) return NextResponse.json({ error: "Webhook nao encontrado" }, { status: 404 });
  return NextResponse.json({ webhook });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.webhook.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
