import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const WebhookSchema = z.object({
  nome: z.string().min(1).max(120),
  url: z.string().url().max(500),
  evento: z.enum(["lead.criado", "lead.status_alterado"]),
  ativo: z.boolean().optional().default(true),
});

export async function GET() {
  const webhooks = await prisma.webhook.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      _count: { select: { logs: true } },
    },
  });

  return NextResponse.json({ webhooks });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = WebhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados invalidos", detalhes: parsed.error.flatten() }, { status: 400 });
  }

  const webhook = await prisma.webhook.create({ data: parsed.data });
  return NextResponse.json({ webhook }, { status: 201 });
}
