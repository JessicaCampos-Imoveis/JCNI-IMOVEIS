"use client";

import { useCallback, useMemo, useState } from "react";
import type { LeadActivityEvent, LeadItem, LeadLossReason, LeadNote, LeadStatus, LeadTask } from "../_lib/types";

export function useAdminLeads() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [busca, setBusca] = useState("");
  const [statusFiltroMobile, setStatusFiltroMobile] = useState<LeadStatus | "TODOS">("TODOS");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [toastErro, setToastErro] = useState("");
  const [salvandoLeadId, setSalvandoLeadId] = useState<string | null>(null);
  const [leadResponsavel, setLeadResponsavel] = useState<Record<string, string>>({});
  const [leadProximaAcao, setLeadProximaAcao] = useState<Record<string, string>>({});
  const [leadNotas, setLeadNotas] = useState<Record<string, LeadNote[]>>({});
  const [leadTarefas, setLeadTarefas] = useState<Record<string, LeadTask[]>>({});
  const [leadAtividades, setLeadAtividades] = useState<Record<string, LeadActivityEvent[]>>({});
  const [leadMotivoPerda, setLeadMotivoPerda] = useState<Record<string, LeadLossReason | "">>({});

  // ID do lead cujo detalhe está sendo carregado (para evitar carregar 2x)
  const [carregandoDetalheId, setCarregandoDetalheId] = useState<string | null>(null);

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

  const atualizarStatus = useCallback(
    async (id: string, novoStatus: LeadStatus, origem = "api") => {
      if (salvandoLeadId === id) return;

      const atual = leads.find((l) => l.id === id);
      if (!atual || atual.status === novoStatus) return;

      const statusAnterior = atual.status;
      setSalvandoLeadId(id);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: novoStatus } : l)));

      try {
        const res = await fetch(`/api/admin/leads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: novoStatus }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Nao foi possivel atualizar status");
        }

        // registrar atividade via API (best-effort)
        void fetch(`/api/admin/leads/${id}/atividades`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "lead.status_alterado",
            titulo: `Status alterado para ${novoStatus}`,
            descricao: `De ${statusAnterior} para ${novoStatus}`,
            origem,
            tone: novoStatus === "PERDIDO" ? "warning" : "success",
          }),
        }).then(() => carregarDetalhe(id));
      } catch (e) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: statusAnterior } : l)));
        setToastErro(e instanceof Error ? e.message : "Erro ao atualizar status");
      } finally {
        setSalvandoLeadId(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leads, salvandoLeadId]
  );

  const arquivarLead = useCallback(
    async (id: string, motivo?: LeadLossReason | "") => {
      const atual = leads.find((l) => l.id === id);
      if (!atual) return;

      if (atual.status === "PERDIDO") {
        setToastErro("Este lead ja esta arquivado na etapa Perdido.");
        return;
      }

      await atualizarStatus(id, "PERDIDO", "arquivar");

      // Salvar motivo de perda e registrar atividade via API
      if (motivo) {
        void fetch(`/api/admin/leads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motivoPerda: motivo }),
        }).then(() =>
          fetch(`/api/admin/leads/${id}/atividades`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipo: "lead.perda_registrada",
              titulo: "Lead marcado como perdido",
              descricao: `Motivo: ${motivo}`,
              origem: "arquivar",
              tone: "warning",
            }),
          })
        ).then(() => carregarDetalhe(id));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [atualizarStatus, leads]
  );

  const excluirLead = useCallback(
    async (id: string) => {
      if (salvandoLeadId === id) return;

      const snapshot = leads;
      setSalvandoLeadId(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));

      try {
        const res = await fetch(`/api/admin/leads/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmText: "EXCLUIR", leadIdConfirm: id }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Nao foi possivel excluir o lead");
        }
      } catch (e) {
        setLeads(snapshot);
        setToastErro(e instanceof Error ? e.message : "Erro ao excluir lead");
      } finally {
        setSalvandoLeadId(null);
      }
    },
    [leads, salvandoLeadId]
  );

  // ─── carregar detalhe do lead (notas, tarefas, atividades, campos CRM) ──────
  const carregarDetalhe = useCallback(async (leadId: string) => {
    if (carregandoDetalheId === leadId) return;
    setCarregandoDetalheId(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.responsavel !== undefined)
        setLeadResponsavel((p) => ({ ...p, [leadId]: data.responsavel ?? "" }));
      if (data.proximaAcao !== undefined)
        setLeadProximaAcao((p) => ({ ...p, [leadId]: data.proximaAcao ?? "" }));
      if (data.motivoPerda !== undefined)
        setLeadMotivoPerda((p) => ({ ...p, [leadId]: (data.motivoPerda as LeadLossReason) ?? "" }));
      if (Array.isArray(data.notas))
        setLeadNotas((p) => ({ ...p, [leadId]: data.notas }));
      if (Array.isArray(data.tarefas))
        setLeadTarefas((p) => ({ ...p, [leadId]: data.tarefas.map((t: Record<string, unknown>) => ({ ...t, criadaEm: t.criadaEm as string, quando: t.criadaEm as string })) }));
      if (Array.isArray(data.atividades))
        setLeadAtividades((p) => ({ ...p, [leadId]: data.atividades.map((a: Record<string, unknown>) => ({ id: a.id as string, tipo: a.tipo as LeadActivityEvent["tipo"], titulo: a.titulo as string, descricao: a.descricao as string, quando: a.criadaEm as string, origem: a.origem as string | undefined, tone: a.tone as LeadActivityEvent["tone"] })) }));
    } finally {
      setCarregandoDetalheId(null);
    }
  }, [carregandoDetalheId]);

  const definirResponsavel = useCallback(async (leadId: string, responsavel: string) => {
    setLeadResponsavel((prev) => ({ ...prev, [leadId]: responsavel }));
    await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responsavel }),
    });
    void fetch(`/api/admin/leads/${leadId}/atividades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "lead.responsavel_alterado", titulo: "Responsável alterado", descricao: responsavel, origem: "drawer", tone: "neutral" }),
    });
  }, []);

  const definirProximaAcao = useCallback(async (leadId: string, proximaAcao: string) => {
    setLeadProximaAcao((prev) => ({ ...prev, [leadId]: proximaAcao }));
    await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proximaAcao }),
    });
    void fetch(`/api/admin/leads/${leadId}/atividades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "lead.proxima_acao_alterada", titulo: "Próxima ação atualizada", descricao: proximaAcao, origem: "drawer", tone: proximaAcao ? "success" : "neutral" }),
    });
  }, []);

  const adicionarNota = useCallback(async (leadId: string, texto: string) => {
    const nota = texto.trim();
    if (!nota) return;
    // otimista: adiciona localmente imediatamente
    const tempId = `temp-note-${Date.now()}`;
    setLeadNotas((prev) => ({
      ...prev,
      [leadId]: [...(prev[leadId] ?? []), { id: tempId, texto: nota, criadaEm: new Date().toISOString() }],
    }));
    const res = await fetch(`/api/admin/leads/${leadId}/notas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: nota }),
    });
    if (res.ok) {
      const criada = await res.json();
      setLeadNotas((prev) => ({
        ...prev,
        [leadId]: (prev[leadId] ?? []).map((n) => (n.id === tempId ? criada : n)),
      }));
    }
  }, []);

  const criarTarefa = useCallback(async (leadId: string, tarefa: { titulo: string; dataHora: string; responsavel: string; observacao: string; tipo: LeadTask["tipo"] }) => {
    if (!tarefa.titulo.trim()) return;
    const tempId = `temp-task-${Date.now()}`;
    const tempTask: LeadTask = {
      id: tempId,
      titulo: tarefa.titulo.trim(),
      dataHora: tarefa.dataHora,
      responsavel: tarefa.responsavel.trim() || "Jéssica Campos",
      status: "PENDENTE",
      observacao: tarefa.observacao.trim(),
      tipo: tarefa.tipo,
    };
    setLeadTarefas((prev) => ({ ...prev, [leadId]: [...(prev[leadId] ?? []), tempTask] }));
    const res = await fetch(`/api/admin/leads/${leadId}/tarefas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: tempTask.titulo, tipo: tempTask.tipo, dataHora: tempTask.dataHora, responsavel: tempTask.responsavel, observacao: tempTask.observacao }),
    });
    if (res.ok) {
      const criada = await res.json();
      setLeadTarefas((prev) => ({
        ...prev,
        [leadId]: (prev[leadId] ?? []).map((t) => (t.id === tempId ? { ...criada, quando: criada.criadaEm } : t)),
      }));
    }
  }, []);

  const concluirTarefa = useCallback(async (leadId: string, tarefaId: string) => {
    const tarefaAtual = (leadTarefas[leadId] ?? []).find((t) => t.id === tarefaId);
    const novoStatus = tarefaAtual?.status === "CONCLUIDA" ? "PENDENTE" : "CONCLUIDA";
    setLeadTarefas((prev) => ({
      ...prev,
      [leadId]: (prev[leadId] ?? []).map((t) => (t.id === tarefaId ? { ...t, status: novoStatus } : t)),
    }));
    void fetch(`/api/admin/leads/${leadId}/tarefas/${tarefaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
  }, [leadTarefas]);

  const registrarVisita = useCallback(async (leadId: string, dataHora: string, observacao: string) => {
    await criarTarefa(leadId, { titulo: "Visita ao imóvel", dataHora, responsavel: "Jéssica Campos", observacao, tipo: "VISITA" });
  }, [criarTarefa]);

  const registrarProposta = useCallback(async (leadId: string, observacao: string) => {
    await criarTarefa(leadId, { titulo: "Registrar proposta", dataHora: new Date().toISOString().slice(0, 16), responsavel: "Jéssica Campos", observacao, tipo: "PROPOSTA" });
  }, [criarTarefa]);

  const leadsFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();

    const base = q
      ? leads.filter(
          (l) =>
            l.nome.toLowerCase().includes(q) ||
            l.telefone.includes(q) ||
            (l.email ?? "").toLowerCase().includes(q) ||
            (l.mensagem ?? "").toLowerCase().includes(q)
        )
      : leads;

    if (statusFiltroMobile === "TODOS") return base;
    return base.filter((l) => l.status === statusFiltroMobile);
  }, [leads, busca, statusFiltroMobile]);

  const porStatus = useMemo(() => {
    return {
      NOVO: leads.filter((l) => l.status === "NOVO"),
      EM_CONTATO: leads.filter((l) => l.status === "EM_CONTATO"),
      VISITOU: leads.filter((l) => l.status === "VISITOU"),
      PROPOSTA: leads.filter((l) => l.status === "PROPOSTA"),
      FECHADO: leads.filter((l) => l.status === "FECHADO"),
      PERDIDO: leads.filter((l) => l.status === "PERDIDO"),
    };
  }, [leads]);

  return {
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
    leadResponsavel,
    leadProximaAcao,
    leadNotas,
    leadTarefas,
    leadAtividades,
    leadMotivoPerda,
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
  };
}
