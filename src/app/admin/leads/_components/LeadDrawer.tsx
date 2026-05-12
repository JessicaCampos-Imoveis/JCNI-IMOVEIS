"use client";

import { useEffect, useState } from "react";
import type { LeadActivityEvent, LeadItem, LeadLossReason, LeadNote, LeadStatus, LeadTask } from "../_lib/types";
import { STATUS_COLOR, STATUS_LABEL, statusTemperatura } from "../_lib/types";

type Props = {
  lead: LeadItem | null;
  open: boolean;
  onClose: () => void;
  onChangeStatus: (status: LeadStatus) => void;
  onArchive: () => void;
  onDelete: () => void;
  responsavel: string;
  proximaAcao: string;
  motivoPerda: LeadLossReason | "";
  notas: LeadNote[];
  tarefas: LeadTask[];
  atividades: LeadActivityEvent[];
  onResponsavelChange: (value: string) => void;
  onProximaAcaoChange: (value: string) => void;
  onAddNota: (texto: string) => void;
  onAddTarefa: (tarefa: { titulo: string; dataHora: string; responsavel: string; observacao: string; tipo: LeadTask["tipo"] }) => void;
  onToggleTarefa: (taskId: string) => void;
  onRegistrarVisita: (dataHora: string, observacao: string) => void;
  onRegistrarProposta: (observacao: string) => void;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildBaseTimeline(lead: LeadItem): LeadActivityEvent[] {
  const items: LeadActivityEvent[] = [
    {
      id: `base-created-${lead.id}`,
      tipo: "lead.criado",
      titulo: "Lead criado",
      descricao: lead.origem ? `Entrada via ${lead.origem}` : "Lead recebido no CRM.",
      quando: formatDate(lead.criadoEm),
      tone: "success",
    },
    {
      id: `base-status-${lead.id}`,
      tipo: "lead.status_alterado",
      titulo: "Status atual",
      descricao: `Etapa ${STATUS_LABEL[lead.status]}`,
      quando: `Temperatura: ${statusTemperatura(lead.status)}`,
      tone: lead.status === "PERDIDO" ? "warning" : "neutral",
    },
  ];

  if (lead.imovel) {
    items.push({
      id: `base-imovel-${lead.id}`,
      tipo: "lead.proxima_acao_alterada",
      titulo: "Imóvel associado",
      descricao: `${lead.imovel.codigo} — ${lead.imovel.titulo}`,
      quando: "Vinculado ao atendimento",
      tone: "neutral",
    });
  }

  if (lead.utmSource || lead.utmMedium || lead.utmCampaign) {
    items.push({
      id: `base-utm-${lead.id}`,
      tipo: "webhook.enviado",
      titulo: "Campanha de origem",
      descricao: [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / "),
      quando: "UTM capturada",
      tone: "neutral",
    });
  }

  return items;
}

export function LeadDrawer({
  lead,
  open,
  onClose,
  onChangeStatus,
  onArchive,
  onDelete,
  responsavel,
  proximaAcao,
  motivoPerda,
  notas,
  tarefas,
  atividades,
  onResponsavelChange,
  onProximaAcaoChange,
  onAddNota,
  onAddTarefa,
  onToggleTarefa,
  onRegistrarVisita,
  onRegistrarProposta,
}: Props) {
  const [notaTexto, setNotaTexto] = useState("");
  const [acaoTexto, setAcaoTexto] = useState(proximaAcao ?? "");
  const [responsavelDraft, setResponsavelDraft] = useState(responsavel);

  // Sincroniza quando um lead diferente é aberto (prop vem do carregarDetalhe)
  useEffect(() => { setResponsavelDraft(responsavel); }, [responsavel]);
  const [tarefaTitulo, setTarefaTitulo] = useState("");
  const [tarefaDataHora, setTarefaDataHora] = useState("");
  const [tarefaResponsavel, setTarefaResponsavel] = useState(responsavel || "Jéssica Campos");
  const [tarefaObservacao, setTarefaObservacao] = useState("");
  const [tarefaTipo, setTarefaTipo] = useState<LeadTask["tipo"]>("RETORNAR");
  const [visitaDataHora, setVisitaDataHora] = useState("");
  const [visitaObs, setVisitaObs] = useState("");
  const [propostaObs, setPropostaObs] = useState("");

  if (!lead) return null;

  const statusColor = STATUS_COLOR[lead.status];
  const temp = statusTemperatura(lead.status);
  const baseTimeline = buildBaseTimeline(lead);
  const timeline = [...atividades, ...baseTimeline].slice(0, 30);
  const whatsappHref = `https://wa.me/55${lead.telefone.replace(/\D/g, "")}`;
  const emailHref = lead.email ? `mailto:${lead.email}` : "#";
  const leadSlug = lead.imovel?.slugUrl ? `/imoveis/${lead.imovel.slugUrl}` : "#";
  const adminImovelHref = lead.imovel?.id ? `/admin/imoveis/${lead.imovel.id}` : "#";

  function salvarProximaAcao() {
    onProximaAcaoChange(acaoTexto);
  }

  function salvarNota() {
    onAddNota(notaTexto);
    setNotaTexto("");
  }

  function salvarTarefa() {
    onAddTarefa({
      titulo: tarefaTitulo,
      dataHora: tarefaDataHora,
      responsavel: tarefaResponsavel,
      observacao: tarefaObservacao,
      tipo: tarefaTipo,
    });
    setTarefaTitulo("");
    setTarefaDataHora("");
    setTarefaObservacao("");
  }

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: open ? "rgba(15, 23, 42, 0.42)" : "transparent",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.18s ease",
          zIndex: 70,
        }}
      />

      <aside
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(480px, 100vw)",
          height: "100vh",
          background: "#ffffff",
          boxShadow: open ? "-18px 0 40px rgba(15, 23, 42, 0.18)" : "none",
          transform: open ? "translateX(0)" : "translateX(102%)",
          transition: "transform 0.2s ease",
          zIndex: 80,
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid #dbe3ef",
        }}
      >
        <div style={{ padding: "1rem 1rem 0.85rem", borderBottom: "1px solid #e5e7eb", background: "#f8fafc" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: statusColor }}>
                Detalhe do lead
              </p>
              <h2 style={{ margin: "0.25rem 0 0", fontSize: "1.12rem", lineHeight: 1.25, color: "#172b4d" }}>{lead.nome}</h2>
              <p style={{ margin: "0.2rem 0 0", color: "#5e6c84", fontSize: "0.82rem" }}>{lead.telefone}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#334155",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            <span style={{ background: `${statusColor}14`, color: statusColor, border: `1px solid ${statusColor}30`, borderRadius: 999, padding: "0.15rem 0.5rem", fontSize: "0.72rem", fontWeight: 700 }}>
              {STATUS_LABEL[lead.status]}
            </span>
            <span style={{ background: "#e5eefc", color: "#1d4ed8", borderRadius: 999, padding: "0.15rem 0.5rem", fontSize: "0.72rem", fontWeight: 700 }}>
              Temperatura {temp}
            </span>
            <span style={{ background: "#eef2f7", color: "#334155", borderRadius: 999, padding: "0.15rem 0.5rem", fontSize: "0.72rem", fontWeight: 700 }}>
              ID {lead.id.slice(0, 8)}
            </span>
          </div>
        </div>

        <div style={{ padding: "0.95rem 1rem 1rem", overflowY: "auto", display: "grid", gap: 12 }}>
          <section style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={actionStyle}>
                WhatsApp
              </a>
              <a href={emailHref} style={actionStyle}>
                E-mail
              </a>
              <a href={leadSlug} target="_blank" rel="noopener noreferrer" style={actionStyle}>
                Ver imóvel
              </a>
              <a href={adminImovelHref} style={actionStyle}>
                Abrir painel
              </a>
              <button type="button" onClick={onArchive} style={destructiveSoftStyle}>
                Marcar como perdido
              </button>
              <button type="button" onClick={onDelete} style={destructiveStyle}>
                Excluir
              </button>
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitle}>Resumo operacional</h3>
              <div style={infoGrid}>
                <InfoRow label="Status" value={STATUS_LABEL[lead.status]} />
                <InfoRow label="Origem" value={lead.origem ?? "Não informada"} />
                <InfoRow label="E-mail" value={lead.email ?? "Não informado"} />
                <InfoRow label="Criado em" value={formatDate(lead.criadoEm)} />
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.71rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                  Responsável
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                  <input
                    value={responsavelDraft}
                    onChange={(e) => setResponsavelDraft(e.target.value)}
                    placeholder="Jéssica Campos"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => onResponsavelChange(responsavelDraft.trim())}
                    style={smallButtonStyle}
                  >
                    Salvar
                  </button>
                </div>
                <p style={helperTextStyle}>{responsavel ? `Atual: ${responsavel}` : "Sem responsável definido."}</p>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.71rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                  Mover etapa
                </label>
                <select
                  value={lead.status}
                  onChange={(e) => onChangeStatus(e.target.value as LeadStatus)}
                  style={{
                    width: "100%",
                    height: 36,
                    borderRadius: 10,
                    border: `1px solid ${statusColor}35`,
                    background: `${statusColor}10`,
                    color: "#172b4d",
                    fontSize: "0.78rem",
                    padding: "0 0.65rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {Object.keys(STATUS_LABEL).map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABEL[status as LeadStatus]}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: "0.71rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                  Próxima ação
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                  <input value={acaoTexto} onChange={(e) => setAcaoTexto(e.target.value)} placeholder="Ex: ligar amanhã às 14h" style={inputStyle} />
                  <button type="button" onClick={salvarProximaAcao} style={smallButtonStyle}>
                    Salvar
                  </button>
                </div>
                <p style={helperTextStyle}>{proximaAcao ? `Atual: ${proximaAcao}` : "Sem próxima ação definida."}</p>
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitle}>Imóvel vinculado</h3>
              {lead.imovel ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <p style={textLine}><strong>{lead.imovel.codigo}</strong> {lead.imovel.titulo}</p>
                  <p style={textMuted}>Slug público: {lead.imovel.slugUrl}</p>
                  <p style={textMuted}>O alerta de imóvel inativo/vendido/locado entra na próxima camada do backend.</p>
                </div>
              ) : (
                <p style={emptyState}>Nenhum imóvel associado ainda.</p>
              )}
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitle}>Observações internas</h3>
              <div style={{ display: "grid", gap: 8 }}>
                <textarea
                  value={notaTexto}
                  onChange={(e) => setNotaTexto(e.target.value)}
                  rows={4}
                  placeholder="Anote contexto, objeções, preferências e próximos passos..."
                  style={{ ...inputStyle, minHeight: 88, resize: "vertical" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                  <span style={helperTextStyle}>{notas.length} nota(s) interna(s)</span>
                  <button type="button" onClick={salvarNota} style={smallButtonStyle}>
                    Adicionar nota
                  </button>
                </div>
                {notas.length > 0 ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    {notas.slice(0, 3).map((nota) => (
                      <div key={nota.id} style={noteItemStyle}>
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "#172b4d", lineHeight: 1.4 }}>{nota.texto}</p>
                        <span style={{ color: "#94a3b8", fontSize: "0.68rem" }}>{nota.criadaEm}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={emptyState}>Sem observações internas ainda.</p>
                )}
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitle}>Tarefas e ações</h3>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={subLabelStyle}>Tipo de tarefa</label>
                  <select value={tarefaTipo} onChange={(e) => setTarefaTipo(e.target.value as LeadTask["tipo"])} style={inputStyle}>
                    <option value="RETORNAR">Retornar ligação</option>
                    <option value="ENVIAR_IMOVEIS">Enviar opções de imóveis</option>
                    <option value="CONFIRMAR_VISITA">Confirmar visita</option>
                    <option value="ENVIAR_PROPOSTA">Enviar proposta</option>
                    <option value="DOCUMENTACAO">Cobrar documentação</option>
                    <option value="FOLLOW_UP">Fazer follow-up</option>
                    <option value="VISITA">Agendar visita</option>
                    <option value="PROPOSTA">Registrar proposta</option>
                  </select>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={subLabelStyle}>Título da tarefa</label>
                  <input value={tarefaTitulo} onChange={(e) => setTarefaTitulo(e.target.value)} placeholder="Ex: Retornar ligação" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={subLabelStyle}>Data e hora</label>
                  <input value={tarefaDataHora} onChange={(e) => setTarefaDataHora(e.target.value)} placeholder="2026-05-09 14:00" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={subLabelStyle}>Responsável</label>
                  <input value={tarefaResponsavel} onChange={(e) => setTarefaResponsavel(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={subLabelStyle}>Observação</label>
                  <textarea value={tarefaObservacao} onChange={(e) => setTarefaObservacao(e.target.value)} rows={3} style={{ ...inputStyle, minHeight: 74, resize: "vertical" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button type="button" onClick={salvarTarefa} style={smallButtonStyle}>
                    Criar tarefa
                  </button>
                  <button type="button" onClick={() => onRegistrarVisita(visitaDataHora || new Date().toISOString().slice(0, 16), visitaObs)} style={smallButtonStyle}>
                    Agendar visita
                  </button>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={subLabelStyle}>Visita rápida - data e hora</label>
                  <input value={visitaDataHora} onChange={(e) => setVisitaDataHora(e.target.value)} placeholder="2026-05-09 14:00" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={subLabelStyle}>Visita rápida - observação</label>
                  <input value={visitaObs} onChange={(e) => setVisitaObs(e.target.value)} placeholder="Observações da visita" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={subLabelStyle}>Proposta rápida</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                    <input value={propostaObs} onChange={(e) => setPropostaObs(e.target.value)} placeholder="Observação da proposta" style={inputStyle} />
                    <button type="button" onClick={() => onRegistrarProposta(propostaObs)} style={smallButtonStyle}>
                      Registrar
                    </button>
                  </div>
                </div>
                {tarefas.length > 0 ? (
                  <div style={{ display: "grid", gap: 8, marginTop: 2 }}>
                    {tarefas.slice(0, 4).map((task) => (
                      <button key={task.id} type="button" onClick={() => onToggleTarefa(task.id)} style={taskItemStyle}>
                        <span style={{ width: 10, height: 10, borderRadius: 999, background: task.status === "CONCLUIDA" ? "#16a34a" : "#f59e0b", marginTop: 4, flexShrink: 0 }} />
                        <span style={{ minWidth: 0, textAlign: "left" }}>
                          <strong style={{ display: "block", color: "#172b4d", fontSize: "0.8rem" }}>{task.titulo}</strong>
                          <span style={{ color: "#64748b", fontSize: "0.7rem" }}>{task.dataHora || "Sem data"} · {task.responsavel}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={emptyState}>Nenhuma tarefa criada.</p>
                )}
              </div>
            </div>

            {motivoPerda && (
              <div style={cardStyle}>
                <h3 style={cardTitle}>Motivo de perda</h3>
                <p style={textLine}>{motivoPerda}</p>
              </div>
            )}

            <div style={cardStyle}>
              <h3 style={cardTitle}>Timeline rica</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {timeline.map((item) => (
                  <div key={item.id} style={timelineRow}>
                    <span style={{ ...timelineDot, background: toneColor(item.tone) }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, color: "#172b4d", fontSize: "0.82rem" }}>{item.titulo}</p>
                      <p style={{ margin: "0.15rem 0 0", color: "#5e6c84", fontSize: "0.76rem", lineHeight: 1.35 }}>{item.descricao}</p>
                      <p style={{ margin: "0.15rem 0 0", color: "#94a3b8", fontSize: "0.7rem" }}>{item.quando}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 640px) {
          aside {
            width: 100vw !important;
          }
        }
      `}</style>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gap: 2 }}>
      <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8", fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: "0.82rem", color: "#172b4d", lineHeight: 1.35 }}>{value}</span>
    </div>
  );
}

function toneColor(tone?: "neutral" | "success" | "warning" | "danger"): string {
  switch (tone) {
    case "success":
      return "#16a34a";
    case "warning":
      return "#d97706";
    case "danger":
      return "#dc2626";
    default:
      return "#64748b";
  }
}

const actionStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 36,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  fontSize: "0.78rem",
  fontWeight: 700,
  textDecoration: "none",
} as const;

const destructiveStyle = {
  ...actionStyle,
  border: "1px solid #fca5a5",
  color: "#b91c1c",
  background: "#fff5f5",
} as const;

const destructiveSoftStyle = {
  ...actionStyle,
  border: "1px solid #d1d5db",
  color: "#334155",
  background: "#fff",
} as const;

const cardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: "0.85rem",
  background: "#fff",
  display: "grid",
  gap: 10,
} as const;

const cardTitle = {
  margin: 0,
  fontSize: "0.84rem",
  color: "#0f172a",
  fontWeight: 800,
} as const;

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
} as const;

const textLine = { margin: 0, color: "#172b4d", fontSize: "0.82rem", lineHeight: 1.4 };
const textMuted = { margin: 0, color: "#64748b", fontSize: "0.76rem", lineHeight: 1.45 };
const emptyState = { margin: 0, color: "#64748b", fontSize: "0.78rem", lineHeight: 1.45 };
const helperTextStyle = { margin: 0, color: "#64748b", fontSize: "0.72rem", lineHeight: 1.45 };
const subLabelStyle = { fontSize: "0.71rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 } as const;
const timelineRow = {
  display: "grid",
  gridTemplateColumns: "10px 1fr",
  gap: 10,
  alignItems: "start",
} as const;
const timelineDot = {
  width: 9,
  height: 9,
  borderRadius: 999,
  marginTop: 5,
  boxShadow: "0 0 0 3px rgba(100,116,139,0.14)",
} as const;
const inputStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  padding: "0.62rem 0.7rem",
  fontSize: "0.78rem",
  color: "#172b4d",
  background: "#fff",
} as const;
const smallButtonStyle = {
  minHeight: 36,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  color: "#0f172a",
  fontSize: "0.76rem",
  fontWeight: 700,
  padding: "0 0.8rem",
  cursor: "pointer",
} as const;
const noteItemStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: "0.7rem",
  background: "#fbfdff",
  display: "grid",
  gap: 4,
} as const;
const taskItemStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: "0.7rem",
  background: "#fff",
  display: "grid",
  gridTemplateColumns: "10px 1fr",
  gap: 10,
  textAlign: "left",
  cursor: "pointer",
} as const;
