"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { LeadFilters } from "./_components/LeadFilters";
import { LeadDrawer } from "./_components/LeadDrawer";
import { LeadKanban } from "./_components/LeadKanban";
import { LeadLossReasonModal } from "./_components/LeadLossReasonModal";
import { LeadMobileList } from "./_components/LeadMobileList";
import { useAdminLeads } from "./_hooks/useAdminLeads";
import type { LeadLossReason, LeadStatus } from "./_lib/types";

export default function AdminLeadsPage() {
  const {
    leads,
    leadsFiltrados,
    porStatus,
    busca,
    setBusca,
    statusFiltroMobile,
    setStatusFiltroMobile,
    carregando,
    erro,
    toastErro,
    setToastErro,
    salvandoLeadId,
    carregarLeads,
    atualizarStatus,
    arquivarLead,
    excluirLead,
    carregarDetalhe,
    definirResponsavel,
    definirProximaAcao,
    adicionarNota,
    criarTarefa,
    concluirTarefa,
    registrarVisita,
    registrarProposta,
    leadResponsavel,
    leadProximaAcao,
    leadMotivoPerda,
    leadNotas,
    leadTarefas,
    leadAtividades,
  } = useAdminLeads();

  const [expandido, setExpandido] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<LeadStatus | null>(null);
  const [ajudaAberta, setAjudaAberta] = useState(false);
  const [pendingLoss, setPendingLoss] = useState<{ leadId: string; leadNome: string; origem: string } | null>(null);
  const draggingId = useRef<string | null>(null);

  const leadSelecionado = leads.find((lead) => lead.id === expandido) ?? null;

  useEffect(() => {
    carregarLeads();
  }, [carregarLeads]);

  useEffect(() => {
    if (expandido) void carregarDetalhe(expandido);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandido]);

  useEffect(() => {
    if (!toastErro) return;
    const timer = setTimeout(() => setToastErro(""), 3500);
    return () => clearTimeout(timer);
  }, [toastErro, setToastErro]);

  function handleDragStart(e: DragEvent, id: string) {
    draggingId.current = id;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: DragEvent, status: LeadStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverCol(status);
  }

  function handleDrop(e: DragEvent, status: LeadStatus) {
    e.preventDefault();
    setOverCol(null);
    const id = draggingId.current;
    if (!id) return;
    requestStatusChange(id, status, "drag desktop");
    draggingId.current = null;
  }

  function handleDragLeave() {
    setOverCol(null);
  }

  function handleDragEnd() {
    draggingId.current = null;
    setOverCol(null);
  }

  function toggleCard(leadId: string) {
    setExpandido((prev) => (prev === leadId ? null : leadId));
  }

  function requestStatusChange(leadId: string, status: LeadStatus, origem: string) {
    if (status === "PERDIDO") {
      const leadNome = leads.find((lead) => lead.id === leadId)?.nome ?? "Lead";
      setPendingLoss({ leadId, leadNome, origem });
      return;
    }
    void atualizarStatus(leadId, status, origem);
  }

  async function confirmarMotivoPerda(payload: { reason: LeadLossReason; note: string }) {
    if (!pendingLoss) return;
    await arquivarLead(pendingLoss.leadId, payload.reason);
    if (payload.note.trim()) {
      void adicionarNota(pendingLoss.leadId, `Motivo de perda: ${payload.reason}. ${payload.note.trim()}`);
    }
    setPendingLoss(null);
  }

  async function handleArchiveLead(leadId: string, leadNome: string) {
    const ok = window.confirm(`Arquivar o lead "${leadNome}" como Perdido?`);
    if (!ok) return;
    await arquivarLead(leadId);
  }

  async function handleDeleteLead(leadId: string, leadNome: string) {
    const etapa1 = window.confirm(`Excluir definitivamente o lead "${leadNome}"? Esta acao nao pode ser desfeita.`);
    if (!etapa1) return;
    const etapa2 = window.prompt("Confirmacao final: digite EXCLUIR para remover este lead em definitivo.");
    if (etapa2 !== "EXCLUIR") {
      setToastErro("Exclusao cancelada: confirmacao invalida.");
      return;
    }
    await excluirLead(leadId);
  }

  const total = leads.length;

  return (
    <div style={{ padding: "1.5rem", minHeight: "100vh", background: "#f3f4f6" }}>
      <LeadLossReasonModal
        open={Boolean(pendingLoss)}
        title={pendingLoss ? `Motivo para ${pendingLoss.leadNome}` : "Motivo de perda"}
        onClose={() => setPendingLoss(null)}
        onConfirm={confirmarMotivoPerda}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "0.8rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.35rem", color: "#111827" }}>Leads / CRM</h1>
          <p style={{ margin: "0.2rem 0 0", color: "#6b7280", fontSize: "0.88rem" }}>
            {total} lead{total !== 1 ? "s" : ""} no total
          </p>
        </div>
        <div className="lead-filters-wrap">
          <LeadFilters
            busca={busca}
            onBuscaChange={setBusca}
            onRefresh={carregarLeads}
            statusFiltroMobile={statusFiltroMobile}
            onStatusFiltroMobileChange={setStatusFiltroMobile}
            ajudaAberta={ajudaAberta}
            onToggleAjuda={() => setAjudaAberta((v) => !v)}
          />
        </div>
      </div>

      {ajudaAberta && (
        <div
          style={{
            marginBottom: "1.25rem",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 10,
            padding: "0.85rem 1rem",
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.82rem", color: "#1d4ed8", marginBottom: "0.35rem" }}>
            Como funciona o CRM de leads
          </p>
          <ul
            style={{
              margin: 0,
              padding: "0 0 0 1.1rem",
              fontSize: "0.8rem",
              color: "#1e40af",
              lineHeight: 1.65,
            }}
          >
            <li>
              <strong>Cada coluna</strong> representa uma etapa do atendimento: Novo - Em contato - Visitou - Proposta - Fechado / Perdido.
            </li>
            <li>
              <strong>Arrastar o card</strong> entre colunas atualiza o status do lead automaticamente em tempo real.
            </li>
            <li>
              <strong>Clique no card</strong> para expandir e ver mensagem, imovel de interesse, UTMs de origem e alterar o status pelo seletor.
            </li>
            <li>
              <strong>Busca:</strong> filtre por nome, telefone, e-mail ou palavra-chave da mensagem em tempo real.
            </li>
            <li>
              Leads marcados como <strong>Fechado</strong> = negociacao concluida com sucesso. <strong>Perdido</strong> = lead descartado.
            </li>
          </ul>
        </div>
      )}

      {toastErro && (
        <p
          style={{
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            padding: "0.6rem 0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          {toastErro}
        </p>
      )}

      {carregando && <p style={{ color: "#6b7280" }}>Carregando leads...</p>}

      {erro && (
        <p
          style={{
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            padding: "0.6rem 0.75rem",
          }}
        >
          {erro}
        </p>
      )}

      {!carregando && !erro && (
        <>
          <LeadDrawer
            lead={leadSelecionado}
            open={Boolean(leadSelecionado)}
            onClose={() => setExpandido(null)}
            onChangeStatus={(novo) => {
              if (!leadSelecionado) return;
              requestStatusChange(leadSelecionado.id, novo, "drawer");
            }}
            onArchive={() => {
              if (!leadSelecionado) return;
              void handleArchiveLead(leadSelecionado.id, leadSelecionado.nome);
            }}
            onDelete={() => {
              if (!leadSelecionado) return;
              void handleDeleteLead(leadSelecionado.id, leadSelecionado.nome);
            }}
            responsavel={leadResponsavel[leadSelecionado?.id ?? ""] ?? "Jessica Campos"}
            proximaAcao={leadProximaAcao[leadSelecionado?.id ?? ""] ?? ""}
            motivoPerda={leadMotivoPerda[leadSelecionado?.id ?? ""] ?? ""}
            notas={leadNotas[leadSelecionado?.id ?? ""] ?? []}
            tarefas={leadTarefas[leadSelecionado?.id ?? ""] ?? []}
            atividades={leadAtividades[leadSelecionado?.id ?? ""] ?? []}
            onResponsavelChange={(value) => {
              if (!leadSelecionado) return;
              void definirResponsavel(leadSelecionado.id, value).then(() =>
                carregarDetalhe(leadSelecionado.id)
              );
            }}
            onProximaAcaoChange={(value) => {
              if (!leadSelecionado) return;
              void definirProximaAcao(leadSelecionado.id, value);
            }}
            onAddNota={(texto) => {
              if (!leadSelecionado) return;
              void adicionarNota(leadSelecionado.id, texto);
            }}
            onAddTarefa={(tarefa) => {
              if (!leadSelecionado) return;
              void criarTarefa(leadSelecionado.id, tarefa);
            }}
            onToggleTarefa={(taskId) => {
              if (!leadSelecionado) return;
              void concluirTarefa(leadSelecionado.id, taskId);
            }}
            onRegistrarVisita={(dataHora, observacao) => {
              if (!leadSelecionado) return;
              void registrarVisita(leadSelecionado.id, dataHora, observacao);
            }}
            onRegistrarProposta={(observacao) => {
              if (!leadSelecionado) return;
              void registrarProposta(leadSelecionado.id, observacao);
            }}
          />

          <div className="lead-desktop-board">
            <div className="lead-desktop-board-panel">
              <LeadKanban
                leadsPorStatus={porStatus}
                expandedId={expandido}
                overCol={overCol}
                savingLeadId={salvandoLeadId}
                onToggleCard={toggleCard}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onChangeStatus={(leadId, status) => requestStatusChange(leadId, status, "drag desktop")}
                onArchiveLead={handleArchiveLead}
                onDeleteLead={handleDeleteLead}
              />
            </div>
          </div>

          <div className="lead-mobile-list">
            <LeadMobileList
              leads={leadsFiltrados}
              selectedLeadId={expandido}
              savingLeadId={salvandoLeadId}
              onToggleCard={toggleCard}
              onChangeStatus={(leadId, status) => requestStatusChange(leadId, status, "mobile seletor")}
              onArchiveLead={handleArchiveLead}
              onDeleteLead={handleDeleteLead}
            />
          </div>
        </>
      )}

      <style>{`
        .lead-desktop-board { display: none; }
        .lead-mobile-list { display: block; }
        .lead-filters-wrap { width: 100%; }
        @media (min-width: 900px) {
          .lead-desktop-board { display: block; }
          .lead-mobile-list { display: none; }
          .lead-filters-wrap { width: auto; }
        }
      `}</style>
    </div>
  );
}
