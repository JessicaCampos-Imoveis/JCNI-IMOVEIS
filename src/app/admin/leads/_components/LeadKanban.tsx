"use client";

import type { DragEvent } from "react";
import { STATUS_COLOR, STATUS_LABEL, STATUS_OPTIONS, type LeadItem, type LeadStatus } from "../_lib/types";
import { LeadCard } from "./LeadCard";

type Props = {
  leadsPorStatus: Record<LeadStatus, LeadItem[]>;
  expandedId: string | null;
  overCol: LeadStatus | null;
  savingLeadId: string | null;
  onToggleCard: (leadId: string) => void;
  onDragStart: (e: DragEvent, leadId: string) => void;
  onDragOver: (e: DragEvent, status: LeadStatus) => void;
  onDrop: (e: DragEvent, status: LeadStatus) => void;
  onDragLeave: () => void;
  onDragEnd: () => void;
  onChangeStatus: (leadId: string, status: LeadStatus) => void;
  onArchiveLead: (leadId: string, leadNome: string) => void;
  onDeleteLead: (leadId: string, leadNome: string) => void;
};

export function LeadKanban({
  leadsPorStatus,
  expandedId,
  overCol,
  savingLeadId,
  onToggleCard,
  onDragStart,
  onDragOver,
  onDrop,
  onDragLeave,
  onDragEnd,
  onChangeStatus,
  onArchiveLead,
  onDeleteLead,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        gap: "0.65rem",
        alignItems: "start",
      }}
    >
      {STATUS_OPTIONS.map((status) => {
        const cards = leadsPorStatus[status];
        const isOver = overCol === status;
        const col = STATUS_COLOR[status];

        return (
          <section
            key={status}
            onDragOver={(e) => onDragOver(e, status)}
            onDrop={(e) => onDrop(e, status)}
            onDragLeave={onDragLeave}
            style={{
              background: isOver ? `${col}10` : "#f5f7fb",
              outline: isOver ? `1px solid ${col}` : "1px solid #d8dee9",
              outlineOffset: -1,
              borderRadius: 8,
              minHeight: 248,
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              padding: "0.5rem 0.45rem 0.55rem",
              transition: "background 0.15s, outline-color 0.15s, transform 0.15s",
            }}
          >
            {/* Cabecalho da coluna */}
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.05rem 0.15rem 0.35rem",
                marginBottom: "0.05rem",
                borderBottom: `2px solid ${col}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: col,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontWeight: 700, fontSize: "0.75rem", color: "#1f2d3d", letterSpacing: "0.01em" }}>
                  {STATUS_LABEL[status]}
                </span>
              </div>
              {cards.length > 0 && (
                <span
                  style={{
                    background: "#e9edf5",
                    color: "#1f2d3d",
                    borderRadius: "999px",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "0.08rem 0.45rem",
                    minWidth: 18,
                    textAlign: "center",
                  }}
                >
                  {cards.length}
                </span>
              )}
            </header>

            {cards.map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) => onDragStart(e, lead.id)}
                onDragEnd={onDragEnd}
                style={{ cursor: savingLeadId === lead.id ? "wait" : "grab" }}
              >
                <LeadCard
                  lead={lead}
                  expanded={expandedId === lead.id}
                  saving={savingLeadId === lead.id}
                  onToggle={() => onToggleCard(lead.id)}
                  onChangeStatus={(novo) => onChangeStatus(lead.id, novo)}
                  onArchive={() => onArchiveLead(lead.id, lead.nome)}
                  onDelete={() => onDeleteLead(lead.id, lead.nome)}
                />
              </div>
            ))}

            {cards.length === 0 && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 72 }}>
                <span style={{ color: "#aab2bf", fontSize: "0.72rem" }}>Sem leads</span>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
