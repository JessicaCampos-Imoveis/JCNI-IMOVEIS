"use client";

import { LeadCard } from "./LeadCard";
import type { LeadItem, LeadStatus } from "../_lib/types";

type Props = {
  leads: LeadItem[];
  selectedLeadId: string | null;
  savingLeadId: string | null;
  onToggleCard: (leadId: string) => void;
  onChangeStatus: (leadId: string, status: LeadStatus) => void;
  onArchiveLead: (leadId: string, leadNome: string) => void;
  onDeleteLead: (leadId: string, leadNome: string) => void;
};

export function LeadMobileList({ leads, selectedLeadId, savingLeadId, onToggleCard, onChangeStatus, onArchiveLead, onDeleteLead }: Props) {
  return (
    <div style={{ display: "grid", gap: "0.55rem" }}>
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          expanded={selectedLeadId === lead.id}
          saving={savingLeadId === lead.id}
          onToggle={() => onToggleCard(lead.id)}
          onChangeStatus={(novo) => onChangeStatus(lead.id, novo)}
          onArchive={() => onArchiveLead(lead.id, lead.nome)}
          onDelete={() => onDeleteLead(lead.id, lead.nome)}
        />
      ))}
      {leads.length === 0 && (
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.8rem", margin: "1.2rem 0 0.2rem" }}>Nenhum lead no filtro atual.</p>
      )}
    </div>
  );
}
