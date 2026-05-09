"use client";

import type { LeadStatus } from "../_lib/types";
import { STATUS_LABEL, STATUS_OPTIONS } from "../_lib/types";

type Props = {
  busca: string;
  onBuscaChange: (value: string) => void;
  onRefresh: () => void;
  statusFiltroMobile: LeadStatus | "TODOS";
  onStatusFiltroMobileChange: (value: LeadStatus | "TODOS") => void;
  ajudaAberta: boolean;
  onToggleAjuda: () => void;
};

export function LeadFilters({
  busca,
  onBuscaChange,
  onRefresh,
  statusFiltroMobile,
  onStatusFiltroMobileChange,
  ajudaAberta,
  onToggleAjuda,
}: Props) {
  return (
    <div style={{ display: "grid", gap: "0.6rem", width: "100%" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onToggleAjuda}
          title="Como funciona este painel"
          style={{
            height: 30,
            width: 30,
            borderRadius: "50%",
            border: "1.5px solid #9ca3af",
            background: ajudaAberta ? "#1d4ed8" : "#fff",
            color: ajudaAberta ? "#fff" : "#6b7280",
            fontWeight: 700,
            fontSize: "0.82rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ?
        </button>
        <input
          type="search"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar lead..."
          style={{
            height: 38,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: "0 0.75rem",
            fontSize: "0.88rem",
            minWidth: 220,
            background: "#fff",
            flex: 1,
          }}
        />
        <button
          type="button"
          onClick={onRefresh}
          style={{
            height: 38,
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            padding: "0 1rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.88rem",
          }}
        >
          Atualizar
        </button>
      </div>

      <div className="lead-mobile-only" style={{ display: "none" }}>
        <div style={{ display: "flex", gap: "0.35rem", overflowX: "auto", paddingBottom: 2 }}>
          <button
            type="button"
            onClick={() => onStatusFiltroMobileChange("TODOS")}
            style={{
              border: statusFiltroMobile === "TODOS" ? "1px solid #93c5fd" : "1px solid #d1d5db",
              background: statusFiltroMobile === "TODOS" ? "#eff6ff" : "#fff",
              color: statusFiltroMobile === "TODOS" ? "#1d4ed8" : "#4b5563",
              borderRadius: 999,
              padding: "0.35rem 0.65rem",
              fontSize: "0.74rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Todos
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusFiltroMobileChange(status)}
              style={{
                border: statusFiltroMobile === status ? "1px solid #93c5fd" : "1px solid #d1d5db",
                background: statusFiltroMobile === status ? "#eff6ff" : "#fff",
                color: statusFiltroMobile === status ? "#1d4ed8" : "#4b5563",
                borderRadius: 999,
                padding: "0.35rem 0.65rem",
                fontSize: "0.74rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {STATUS_LABEL[status]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
