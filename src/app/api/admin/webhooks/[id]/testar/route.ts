import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const webhook = await prisma.webhook.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        url: true,
        evento: true,
        ativo: true,
      },
    });

    if (!webhook) {
      return NextResponse.json({ error: "Webhook nao encontrado" }, { status: 404 });
    }

    const payload = {
      evento: webhook.evento,
      timestamp: new Date().toISOString(),
      data: {
        teste: true,
        origem: "admin.webhooks.testar",
        webhookId: webhook.id,
      },
    };

    let statusHttp = 0;
    let resposta: string | null = null;

    try {
      const res = await fetch(webhook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      statusHttp = res.status;
      resposta = await res.text().catch(() => null);
    } catch (err) {
      statusHttp = 0;
      resposta = err instanceof Error ? err.message : "Timeout ou erro de rede";
    }

    await prisma.webhookLog.create({
      data: {
        webhookId: webhook.id,
        statusHttp,
        resposta,
      },
    });

    return NextResponse.json({
      ok: statusHttp >= 200 && statusHttp < 300,
      statusHttp,
      resposta,
    });
  } catch (err) {
    console.error("[POST /api/admin/webhooks/[id]/testar]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
