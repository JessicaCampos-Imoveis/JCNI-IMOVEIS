"use client";

import type { LeadItem, LeadStatus } from "../_lib/types";
import { STATUS_COLOR, STATUS_LABEL, statusTemperatura } from "../_lib/types";

type Props = {
  lead: LeadItem;
  expanded: boolean;
  saving: boolean;
  onToggle: () => void;
  onChangeStatus: (status: LeadStatus) => void;
  onArchive: () => void;
  onDelete: () => void;
};

const TEMP_COLOR: Record<ReturnType<typeof statusTemperatura>, string> = {
  Quente: "#ef4444",
  Morno: "#f59e0b",
  Frio: "#60a5fa",
};

export function LeadCard({ lead, expanded, saving, onToggle, onChangeStatus, onArchive, onDelete }: Props) {
  const whatsappHref = `https://wa.me/55${lead.telefone.replace(/\D/g, "")}`;
  const statusColor = STATUS_COLOR[lead.status];
  const temp = statusTemperatura(lead.status);
  const tempColor = TEMP_COLOR[temp];
  const dataFormatada = new Date(lead.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  return (
    <article
      onClick={onToggle}
      style={{
        background: "#ffffff",
        borderRadius: 6,
        borderTop: expanded ? "1px solid #9fb7e6" : "1px solid #cfd7e6",
        borderRight: expanded ? "1px solid #9fb7e6" : "1px solid #cfd7e6",
        borderBottom: expanded ? "1px solid #9fb7e6" : "1px solid #cfd7e6",
        borderLeft: `2px solid ${statusColor}`,
        padding: 0,
        overflow: "hidden",
        cursor: saving ? "wait" : "pointer",
        opacity: saving ? 0.6 : 1,
        boxShadow: expanded ? "0 4px 14px rgba(37,99,235,0.10)" : "0 1px 1px rgba(9,30,66,0.05)",
        userSelect: "none",
        transition: "box-shadow 0.15s, border-color 0.15s, opacity 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!saving) {
          const target = e.currentTarget as HTMLElement;
          target.style.boxShadow = "0 6px 18px rgba(9,30,66,0.12)";
          target.style.borderColor = "#b9c5d8";
        }
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.boxShadow = "0 1px 1px rgba(9,30,66,0.05)";
        target.style.borderColor = "#cfd7e6";
      }}
    >
      <div style={{ padding: "0.5rem 0.55rem 0.45rem" }}>
        {/* Linha principal: nome + dot temperatura */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.8rem",
                color: "#172b4d",
                lineHeight: 1.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {lead.nome}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#5e6c84", marginTop: 1 }}>{lead.telefone}</div>
          </div>
          <span
            title={temp}
            style={{
              flexShrink: 0,
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: tempColor,
              marginTop: 4,
              boxShadow: `0 0 0 2px ${tempColor}22`,
            }}
          />
        </div>

        {/* Chip de imovel */}
        {lead.imovel && (
          <div
            style={{
              marginTop: 5,
              fontSize: "0.68rem",
              color: "#44546f",
              background: "#f6f8fb",
              borderRadius: 4,
              padding: "0.12rem 0.35rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {lead.imovel.codigo} — {lead.imovel.titulo}
          </div>
        )}

        <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: "0.66rem", color: "#8993a4" }}>{dataFormatada}</span>
          <span style={{ fontSize: "0.68rem", color: "#8993a4" }}>{temp}</span>
        </div>
      </div>

      <div className="lead-mobile-only" style={{ display: "none", marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 6 }}>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textAlign: "center",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "0.35rem 0.2rem",
              textDecoration: "none",
              color: "#374151",
              fontSize: "0.72rem",
              fontWeight: 700,
              background: "#fff",
            }}
          >
            WhatsApp
          </a>
          <button
            type="button"
            onClick={onToggle}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "0.35rem 0.2rem",
              color: "#374151",
              fontSize: "0.72rem",
              fontWeight: 700,
              background: "#fff",
            }}
          >
            Detalhes
          </button>
          <select
            value={lead.status}
            disabled={saving}
            onChange={(e) => onChangeStatus(e.target.value as LeadStatus)}
            style={{
              border: `1px solid ${statusColor}55`,
              borderRadius: 8,
              padding: "0.32rem 0.2rem",
              color: statusColor,
              fontSize: "0.72rem",
              fontWeight: 700,
              background: `${statusColor}12`,
            }}
          >
            {Object.keys(STATUS_LABEL).map((status) => (
              <option key={status} value={status}>{STATUS_LABEL[status as LeadStatus]}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={onArchive}
            disabled={saving}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "0.35rem 0.2rem",
              color: "#374151",
              fontSize: "0.72rem",
              fontWeight: 700,
              background: "#fff",
            }}
          >
            Arquivar
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={saving}
            style={{
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "0.35rem 0.2rem",
              color: "#b91c1c",
              fontSize: "0.72rem",
              fontWeight: 700,
              background: "#fff5f5",
            }}
          >
            Excluir
          </button>
          <button
            type="button"
            onClick={onToggle}
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              padding: "0.35rem 0.2rem",
              color: "#0f172a",
              fontSize: "0.72rem",
              fontWeight: 700,
              background: "#fff",
              gridColumn: "1 / -1",
            }}
          >
            Abrir detalhe
          </button>
        </div>
      </div>
    </article>
  );
}
