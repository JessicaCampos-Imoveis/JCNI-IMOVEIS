export type LeadStatus = "NOVO" | "EM_CONTATO" | "VISITOU" | "PROPOSTA" | "FECHADO" | "PERDIDO";

export type LeadLossReason =
  | "NAO_RESPONDEU"
  | "FORA_DO_ORCAMENTO"
  | "COMPROU_OUTRO_IMOVEL"
  | "PRECO_ALTO"
  | "LOCALIZACAO_NAO_AGRADOU"
  | "IMOVEL_INDISPONIVEL"
  | "DESISTIU"
  | "SEM_CREDITO"
  | "LEAD_DUPLICADO"
  | "OUTRO";

export type LeadTaskStatus = "PENDENTE" | "CONCLUIDA";

export type LeadNote = {
  id: string;
  texto: string;
  criadaEm: string;
};

export type LeadTask = {
  id: string;
  titulo: string;
  dataHora: string;
  responsavel: string;
  status: LeadTaskStatus;
  observacao: string;
  tipo: "RETORNAR" | "ENVIAR_IMOVEIS" | "CONFIRMAR_VISITA" | "ENVIAR_PROPOSTA" | "DOCUMENTACAO" | "FOLLOW_UP" | "VISITA" | "PROPOSTA";
};

export type LeadActivityType =
  | "lead.criado"
  | "lead.status_alterado"
  | "lead.nota_adicionada"
  | "lead.responsavel_alterado"
  | "lead.tarefa_criada"
  | "lead.tarefa_concluida"
  | "lead.visita_agendada"
  | "lead.proposta_registrada"
  | "lead.perda_registrada"
  | "lead.proxima_acao_alterada"
  | "webhook.enviado"
  | "webhook.falhou";

export type LeadActivityEvent = {
  id: string;
  tipo: LeadActivityType;
  titulo: string;
  descricao: string;
  quando: string;
  origem?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
};

export type LeadItem = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  mensagem: string | null;
  status: LeadStatus;
  origem: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  criadoEm: string;
  imovel: {
    id: string;
    codigo: string;
    titulo: string;
    slugUrl: string;
  } | null;
};

export const STATUS_LABEL: Record<LeadStatus, string> = {
  NOVO: "Novo",
  EM_CONTATO: "Em contato",
  VISITOU: "Visitou",
  PROPOSTA: "Proposta",
  FECHADO: "Fechado",
  PERDIDO: "Perdido",
};

export const STATUS_COLOR: Record<LeadStatus, string> = {
  NOVO: "#2563eb",
  EM_CONTATO: "#7c3aed",
  VISITOU: "#0891b2",
  PROPOSTA: "#d97706",
  FECHADO: "#16a34a",
  PERDIDO: "#6b7280",
};

export const STATUS_OPTIONS: LeadStatus[] = ["NOVO", "EM_CONTATO", "VISITOU", "PROPOSTA", "FECHADO", "PERDIDO"];

export function statusTemperatura(status: LeadStatus): "Frio" | "Morno" | "Quente" {
  if (status === "NOVO" || status === "EM_CONTATO") return "Morno";
  if (status === "VISITOU" || status === "PROPOSTA") return "Quente";
  return "Frio";
}
