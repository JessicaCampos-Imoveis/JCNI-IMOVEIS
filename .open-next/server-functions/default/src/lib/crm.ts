/**
 * crm.ts
 * Integracoes com CRM externo: RD Station Marketing e HubSpot.
 * Chamado server-side em /api/leads quando as respectivas integracoes estao ativas.
 * Nunca expoe tokens ao cliente — apenas consome do banco via Prisma.
 */
import { prisma } from "@/lib/prisma";

type LeadPayload = {
  nome: string;
  telefone: string;
  email: string | null;
  mensagem: string | null;
  imovelTitulo: string | null;
};

async function enviarParaRDStation(token: string, lead: LeadPayload): Promise<void> {
  const body = {
    event_type: "CONVERSION",
    event_family: "CDP",
    payload: {
      conversion_identifier: "Lead via site JCNI",
      name: lead.nome,
      ...(lead.email ? { email: lead.email } : {}),
      personal_phone: lead.telefone,
      ...(lead.mensagem ? { cf_mensagem: lead.mensagem } : {}),
      ...(lead.imovelTitulo ? { cf_imovel_interesse: lead.imovelTitulo } : {}),
    },
    token,
  };

  const res = await fetch("https://api.rd.services/platform/conversions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[RD Station] ${res.status}: ${text.slice(0, 200)}`);
  }
}

async function enviarParaHubSpot(token: string, lead: LeadPayload): Promise<void> {
  const [firstname, ...rest] = lead.nome.trim().split(" ");
  const lastname = rest.join(" ") || "";

  const properties: Record<string, string> = { firstname, phone: lead.telefone };
  if (lastname) properties.lastname = lastname;
  if (lead.email) properties.email = lead.email;
  if (lead.mensagem) properties.message = lead.mensagem;

  const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ properties }),
  });

  // 409 = contato ja existe — nao e erro para nos
  if (!res.ok && res.status !== 409) {
    const text = await res.text().catch(() => "");
    throw new Error(`[HubSpot] ${res.status}: ${text.slice(0, 200)}`);
  }
}

/**
 * Verifica as configuracoes de CRM no banco e dispara para os CRMs ativos.
 * Chamado de forma assincrona (void) para nao bloquear a resposta ao lead.
 */
export async function dispararCRM(lead: LeadPayload): Promise<void> {
  try {
    const rows = await prisma.configuracao.findMany({
      where: {
        chave: {
          in: [
            "crm_rdstation_ativo",
            "crm_rdstation_token",
            "crm_hubspot_ativo",
            "crm_hubspot_token",
          ],
        },
      },
      select: { chave: true, valor: true },
    });

    const cfg: Record<string, string> = {};
    for (const r of rows) cfg[r.chave] = r.valor;

    await Promise.allSettled([
      cfg["crm_rdstation_ativo"] === "true" && cfg["crm_rdstation_token"]
        ? enviarParaRDStation(cfg["crm_rdstation_token"], lead)
        : Promise.resolve(),
      cfg["crm_hubspot_ativo"] === "true" && cfg["crm_hubspot_token"]
        ? enviarParaHubSpot(cfg["crm_hubspot_token"], lead)
        : Promise.resolve(),
    ]);
  } catch (err) {
    console.error("[dispararCRM]", err);
  }
}
