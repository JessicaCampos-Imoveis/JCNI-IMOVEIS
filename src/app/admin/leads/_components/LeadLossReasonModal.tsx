"use client";

import { useEffect, useState } from "react";
import type { LeadLossReason } from "../_lib/types";

const LOSS_REASONS: { value: LeadLossReason; label: string }[] = [
  { value: "NAO_RESPONDEU", label: "Não respondeu" },
  { value: "FORA_DO_ORCAMENTO", label: "Fora do orçamento" },
  { value: "COMPROU_OUTRO_IMOVEL", label: "Comprou/alugou outro imóvel" },
  { value: "PRECO_ALTO", label: "Preço alto" },
  { value: "LOCALIZACAO_NAO_AGRADOU", label: "Localização não agradou" },
  { value: "IMOVEL_INDISPONIVEL", label: "Imóvel indisponível" },
  { value: "DESISTIU", label: "Desistiu" },
  { value: "SEM_CREDITO", label: "Sem crédito/aprovação" },
  { value: "LEAD_DUPLICADO", label: "Lead duplicado" },
  { value: "OUTRO", label: "Outro" },
];

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: (payload: { reason: LeadLossReason; note: string }) => void;
};

export function LeadLossReasonModal({ open, title, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState<LeadLossReason>("NAO_RESPONDEU");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setReason("NAO_RESPONDEU");
    setNote("");
  }, [open]);

  if (!open) return null;

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Motivo de perda">
      <div style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div>
            <p style={eyebrowStyle}>Lead perdido</p>
            <h3 style={titleStyle}>{title}</h3>
            <p style={textStyle}>Registre o motivo para manter a rastreabilidade operacional do funil.</p>
          </div>
          <button type="button" onClick={onClose} style={closeStyle} aria-label="Fechar">
            ×
          </button>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={labelStyle}>Motivo</label>
          <select value={reason} onChange={(e) => setReason(e.target.value as LeadLossReason)} style={inputStyle}>
            {LOSS_REASONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={labelStyle}>Observação</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Contexto adicional sobre a perda, objeção ou motivo operacional."
            style={{ ...inputStyle, resize: "vertical", minHeight: 92 }}
          />
        </div>

        <div style={actionsStyle}>
          <button type="button" onClick={onClose} style={secondaryButtonStyle}>
            Cancelar
          </button>
          <button type="button" onClick={() => onConfirm({ reason, note })} style={primaryButtonStyle}>
            Confirmar perda
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.42)",
  display: "grid",
  placeItems: "center",
  zIndex: 90,
  padding: 16,
};

const panelStyle: React.CSSProperties = {
  width: "min(560px, 100%)",
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #dbe3ef",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.22)",
  padding: 18,
  display: "grid",
  gap: 14,
};

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#b91c1c",
};

const titleStyle: React.CSSProperties = {
  margin: "0.25rem 0 0",
  fontSize: "1.05rem",
  lineHeight: 1.25,
  color: "#172b4d",
};

const textStyle: React.CSSProperties = {
  margin: "0.3rem 0 0",
  color: "#64748b",
  fontSize: "0.84rem",
  lineHeight: 1.45,
};

const closeStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#334155",
  cursor: "pointer",
  flexShrink: 0,
  fontSize: "1.15rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  padding: "0.7rem 0.75rem",
  fontSize: "0.84rem",
  color: "#172b4d",
  background: "#fff",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  flexWrap: "wrap",
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: 38,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#334155",
  fontSize: "0.8rem",
  fontWeight: 700,
  padding: "0 1rem",
  cursor: "pointer",
};

const primaryButtonStyle: React.CSSProperties = {
  minHeight: 38,
  borderRadius: 10,
  border: "1px solid #b91c1c",
  background: "#b91c1c",
  color: "#fff",
  fontSize: "0.8rem",
  fontWeight: 700,
  padding: "0 1rem",
  cursor: "pointer",
};
