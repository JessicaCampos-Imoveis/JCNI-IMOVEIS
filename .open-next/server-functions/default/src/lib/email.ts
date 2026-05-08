/**
 * src/lib/email.ts
 * Wrapper Resend para envio de emails transacionais.
 *
 * Uso:
 *   await enviarEmailConfirmacaoLead({ nome, email, mensagem, imovelTitulo })
 *   await enviarEmailNotificacaoLead({ nome, telefone, email, mensagem, imovelTitulo })
 *
 * Se RESEND_API_KEY nao estiver definida ou for placeholder, loga no console
 * sem lancar excecao (falha silenciosa para nao bloquear o cadastro do lead).
 */

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY ?? "";
const from = process.env.RESEND_FROM ?? "Jessica Campos <onboarding@resend.dev>";
const notifyEmail = process.env.NOTIFY_EMAIL ?? "";

function resendDisponivel(): boolean {
  return apiKey.length > 10 && !apiKey.startsWith("re_SUBSTITUA");
}

function resendClient() {
  return new Resend(apiKey);
}

// ─── Email de confirmacao para o lead ────────────────────────────────────────

interface ConfirmacaoLeadParams {
  nome: string;
  email: string;
  mensagem?: string | null;
  imovelTitulo?: string | null;
}

export async function enviarEmailConfirmacaoLead(params: ConfirmacaoLeadParams): Promise<void> {
  if (!resendDisponivel()) {
    console.info("[email] Resend nao configurado — confirmacao de lead ignorada");
    return;
  }
  if (!params.email) return;

  const imovelInfo = params.imovelTitulo
    ? `<p>Imovel de interesse: <strong>${params.imovelTitulo}</strong></p>`
    : "";

  const mensagemInfo = params.mensagem
    ? `<p>Sua mensagem: <em>${params.mensagem}</em></p>`
    : "";

  try {
    const resend = resendClient();
    await resend.emails.send({
      from,
      to: [params.email],
      subject: "Recebemos seu contato — Jessica Campos Negócios Imobiliários",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <h2 style="color:#b45309">Ola, ${params.nome}!</h2>
          <p>Recebemos seu contato e em breve nossa equipe entrara em contato pelo numero informado.</p>
          ${imovelInfo}
          ${mensagemInfo}
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
          <p style="font-size:13px;color:#6b7280">
            Jessica Campos Negocios Imobiliarios · Sorocaba, SP
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Falha ao enviar confirmacao para lead:", err);
  }
}

// ─── Email de notificacao para a corretora ────────────────────────────────────

interface NotificacaoLeadParams {
  nome: string;
  telefone: string;
  email?: string | null;
  mensagem?: string | null;
  imovelTitulo?: string | null;
  imovelSlug?: string | null;
}

export async function enviarEmailNotificacaoLead(params: NotificacaoLeadParams): Promise<void> {
  if (!resendDisponivel()) {
    console.info("[email] Resend nao configurado — notificacao de lead ignorada");
    return;
  }
  if (!notifyEmail) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const imovelInfo = params.imovelTitulo
    ? `<p><strong>Imovel:</strong> ${params.imovelTitulo}${params.imovelSlug ? ` — <a href="${appUrl}/imoveis/${params.imovelSlug}">${appUrl}/imoveis/${params.imovelSlug}</a>` : ""}</p>`
    : "<p><em>Sem imovel vinculado (contato geral)</em></p>";

  const emailInfo = params.email
    ? `<p><strong>Email:</strong> ${params.email}</p>`
    : "";

  const mensagemInfo = params.mensagem
    ? `<p><strong>Mensagem:</strong> ${params.mensagem}</p>`
    : "";

  try {
    const resend = resendClient();
    await resend.emails.send({
      from,
      to: [notifyEmail],
      subject: `Novo lead: ${params.nome}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <h2 style="color:#b45309">Novo lead recebido</h2>
          <p><strong>Nome:</strong> ${params.nome}</p>
          <p><strong>Telefone:</strong> ${params.telefone}</p>
          ${emailInfo}
          ${imovelInfo}
          ${mensagemInfo}
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
          <p><a href="${appUrl}/admin/leads" style="color:#b45309">Ver no painel ADM</a></p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Falha ao enviar notificacao de lead:", err);
  }
}
