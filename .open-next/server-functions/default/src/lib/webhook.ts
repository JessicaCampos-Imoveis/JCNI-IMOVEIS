/**
 * src/lib/webhook.ts
 * Disparo de webhooks genericos para eventos de lead.
 *
 * Busca webhooks ativos para o evento no banco e faz POST para cada URL
 * com payload JSON padrao. Falhas sao registradas em WebhookLog sem
 * interromper o fluxo principal.
 */

import { prisma } from "@/lib/prisma";

export type WebhookEvento = "lead.criado" | "lead.status_alterado";

export interface WebhookPayload {
  evento: WebhookEvento;
  timestamp: string;
  data: Record<string, unknown>;
}

export async function dispararWebhooks(
  evento: WebhookEvento,
  data: Record<string, unknown>
): Promise<void> {
  let webhooks: { id: string; url: string }[] = [];

  try {
    webhooks = await prisma.webhook.findMany({
      where: { ativo: true, evento },
      select: { id: true, url: true },
    });
  } catch (err) {
    console.error("[webhook] Erro ao buscar webhooks:", err);
    return;
  }

  if (webhooks.length === 0) return;

  const payload: WebhookPayload = {
    evento,
    timestamp: new Date().toISOString(),
    data,
  };

  await Promise.all(
    webhooks.map(async (wh) => {
      let statusHttp = 0;
      let resposta: string | null = null;
      try {
        const res = await fetch(wh.url, {
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

      try {
        await prisma.webhookLog.create({
          data: { webhookId: wh.id, statusHttp, resposta },
        });
      } catch (logErr) {
        console.error("[webhook] Falha ao gravar log:", logErr);
      }
    })
  );
}
