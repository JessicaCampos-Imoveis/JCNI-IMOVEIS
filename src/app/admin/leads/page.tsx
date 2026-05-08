"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LeadStatus = "NOVO" | "EM_CONTATO" | "VISITOU" | "PROPOSTA" | "FECHADO" | "PERDIDO";

type LeadItem = {
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

const STATUS_LABEL: Record<LeadStatus, string> = {
  NOVO: "Novo",
  EM_CONTATO: "Em contato",
  VISITOU: "Visitou",
  PROPOSTA: "Proposta",
  FECHADO: "Fechado",
  PERDIDO: "Perdido",
};

const STATUS_COLOR: Record<LeadStatus, string> = {
  NOVO: "#2563eb",
  EM_CONTATO: "#7c3aed",
  VISITOU: "#0891b2",
  PROPOSTA: "#d97706",
  FECHADO: "#16a34a",
  PERDIDO: "#6b7280",
};

const STATUS_OPTIONS: LeadStatus[] = ["NOVO", "EM_CONTATO", "VISITOU", "PROPOSTA", "FECHADO", "PERDIDO"];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvandoLeadId, setSalvandoLeadId] = useState<string | null>(null);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<LeadStatus | null>(null);
  const [ajudaAberta, setAjudaAberta] = useState(false);
  const draggingId = useRef<string | null>(null);

  const carregarLeads = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/admin/leads");
      if (!res.ok) throw new Error("Erro ao carregar leads");
      const data = await res.json();
      setLeads((data.leads as LeadItem[]) ?? []);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar leads");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarLeads(); }, [carregarLeads]);

  async function atualizarStatus(id: string, status: LeadStatus) {
    setSalvandoLeadId(id);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Nao foi possivel atualizar status");
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao atualizar status");
      carregarLeads();
    } finally {
      setSalvandoLeadId(null);
    }
  }

  const leadsFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.nome.toLowerCase().includes(q) ||
        l.telefone.includes(q) ||
        (l.email ?? "").toLowerCase().includes(q) ||
        (l.mensagem ?? "").toLowerCase().includes(q)
    );
  }, [leads, busca]);

  const porStatus = useMemo(() => {
    const map: Record<LeadStatus, LeadItem[]> = {
      NOVO: [], EM_CONTATO: [], VISITOU: [], PROPOSTA: [], FECHADO: [], PERDIDO: [],
    };
    for (const l of leadsFiltrados) map[l.status].push(l);
    return map;
  }, [leadsFiltrados]);

  function handleDragStart(e: React.DragEvent, id: string) {
    draggingId.current = id;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverCol(status);
  }

  function handleDrop(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault();
    setOverCol(null);
    const id = draggingId.current;
    if (!id) return;
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === status) return;
    atualizarStatus(id, status);
  }

  function handleDragEnd() {
    draggingId.current = null;
    setOverCol(null);
  }

  const total = leads.length;

  return (
    <div style={{ padding: "1.5rem", minHeight: "100vh", background: "#f3f4f6" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.35rem", color: "#111827" }}>Leads / CRM</h1>
          <p style={{ margin: "0.2rem 0 0", color: "#6b7280", fontSize: "0.88rem" }}>{total} lead{total !== 1 ? "s" : ""} no total</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setAjudaAberta((v) => !v)}
            title="Como funciona este painel"
            style={{ height: 28, width: 28, borderRadius: "50%", border: "1.5px solid #9ca3af", background: ajudaAberta ? "#1d4ed8" : "#fff", color: ajudaAberta ? "#fff" : "#6b7280", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            ?
          </button>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar lead..."
            style={{ height: 38, borderRadius: 8, border: "1px solid #d1d5db", padding: "0 0.75rem", fontSize: "0.88rem", minWidth: 200, background: "#fff" }}
          />
          <button
            type="button"
            onClick={carregarLeads}
            style={{ height: 38, borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", padding: "0 1rem", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem" }}
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Painel de ajuda — visível só após clicar (?) */}
      {ajudaAberta && (
        <div style={{ marginBottom: "1.25rem", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "0.85rem 1rem" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.82rem", color: "#1d4ed8", marginBottom: "0.35rem" }}>Como funciona o CRM de leads</p>
          <ul style={{ margin: 0, padding: "0 0 0 1.1rem", fontSize: "0.8rem", color: "#1e40af", lineHeight: 1.65 }}>
            <li><strong>Cada coluna</strong> representa uma etapa do atendimento: Novo → Em contato → Visitou → Proposta → Fechado / Perdido.</li>
            <li><strong>Arrastar o card</strong> entre colunas atualiza o status do lead automaticamente em tempo real.</li>
            <li><strong>Clique no card</strong> para expandir e ver mensagem, imóvel de interesse, UTMs de origem e alterar o status pelo seletor (ideal no celular).</li>
            <li><strong>Busca:</strong> filtre por nome, telefone, e-mail ou palavra-chave da mensagem em tempo real.</li>
            <li>Leads marcados como <strong>Fechado</strong> = negociação concluída com sucesso. <strong>Perdido</strong> = lead descartado.</li>
          </ul>
        </div>
      )}

      {carregando && <p style={{ color: "#6b7280" }}>Carregando leads...</p>}
      {erro && <p style={{ color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.6rem 0.75rem" }}>{erro}</p>}

      {/* Kanban board */}
      {!carregando && !erro && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(210px, 1fr))",
            gap: "0.75rem",
            overflowX: "auto",
            paddingBottom: "1rem",
            alignItems: "start",
          }}
        >
          {STATUS_OPTIONS.map((status) => {
            const cards = porStatus[status];
            const isOver = overCol === status;
            return (
              <div
                key={status}
                onDragOver={(e) => handleDragOver(e, status)}
                onDrop={(e) => handleDrop(e, status)}
                onDragLeave={() => setOverCol(null)}
                style={{
                  background: isOver ? "#eff6ff" : "#fff",
                  border: `2px dashed ${isOver ? "#2563eb" : "#e5e7eb"}`,
                  borderRadius: 12,
                  minHeight: 300,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.45rem",
                  padding: "0.75rem 0.5rem",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                {/* Column header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 0.25rem 0.4rem",
                    borderBottom: `3px solid ${STATUS_COLOR[status]}`,
                    marginBottom: "0.3rem",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "0.8rem", color: STATUS_COLOR[status], letterSpacing: "0.03em", textTransform: "uppercase" }}>
                    {STATUS_LABEL[status]}
                  </span>
                  <span
                    style={{
                      background: STATUS_COLOR[status],
                      color: "#fff",
                      borderRadius: "999px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.1rem 0.45rem",
                      minWidth: 22,
                      textAlign: "center",
                    }}
                  >
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                {cards.map((lead) => {
                  const aberto = expandido === lead.id;
                  const salvando = salvandoLeadId === lead.id;
                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setExpandido(aberto ? null : lead.id)}
                      style={{
                        background: "#f9fafb",
                        borderRadius: 10,
                        border: "1px solid #e5e7eb",
                        padding: "0.65rem 0.7rem",
                        cursor: salvando ? "wait" : "grab",
                        opacity: salvando ? 0.6 : 1,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        userSelect: "none",
                        transition: "opacity 0.15s",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111827", marginBottom: "0.15rem" }}>{lead.nome}</div>
                      <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>{lead.telefone}</div>
                      {lead.email && (
                        <div style={{ fontSize: "0.74rem", color: "#9ca3af", marginTop: "0.1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {lead.email}
                        </div>
                      )}

                      {aberto && (
                        <div style={{ marginTop: "0.6rem", fontSize: "0.78rem", color: "#374151", borderTop: "1px solid #e5e7eb", paddingTop: "0.5rem" }}>
                          {lead.mensagem && (
                            <p style={{ margin: "0 0 0.4rem", fontStyle: "italic", color: "#4b5563" }}>&ldquo;{lead.mensagem}&rdquo;</p>
                          )}
                          {lead.imovel && (
                            <p style={{ margin: "0 0 0.25rem" }}>
                              Imóvel: <strong>{lead.imovel.codigo}</strong> &middot; {lead.imovel.titulo}
                            </p>
                          )}
                          <p style={{ margin: "0 0 0.25rem" }}>Criado: {new Date(lead.criadoEm).toLocaleString("pt-BR")}</p>
                          {lead.origem && <p style={{ margin: "0 0 0.25rem" }}>Origem: {lead.origem}</p>}
                          {[lead.utmSource, lead.utmMedium, lead.utmCampaign].some(Boolean) && (
                            <p style={{ margin: "0 0 0.25rem" }}>
                              UTM: {[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ")}
                            </p>
                          )}
                          {/* Fallback select para mobile */}
                          <div style={{ marginTop: "0.55rem" }} onClick={(e) => e.stopPropagation()}>
                            <label style={{ fontSize: "0.74rem", color: "#6b7280", display: "block", marginBottom: "0.2rem" }}>Mover para:</label>
                            <select
                              value={lead.status}
                              disabled={salvando}
                              onChange={(e) => atualizarStatus(lead.id, e.target.value as LeadStatus)}
                              style={{ width: "100%", height: 32, borderRadius: 6, border: "1px solid #d1d5db", fontSize: "0.8rem", padding: "0 0.5rem", background: "#fff" }}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {cards.length === 0 && (
                  <p style={{ textAlign: "center", color: "#d1d5db", fontSize: "0.78rem", marginTop: "1rem" }}>Vazio</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p style={{ color: "#9ca3af", fontSize: "0.74rem", marginTop: "0.5rem" }}>
        💡 No desktop: arraste os cards entre colunas para mover o status. No celular: clique no card e use o seletor &ldquo;Mover para&rdquo;.
      </p>
    </div>
  );
}
