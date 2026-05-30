"use client";

import { useState } from "react";

const PLACEHOLDERS: Record<"VENDA" | "ALUGUEL", string> = {
  VENDA: "Bairro, condominio, codigo ou tipo de imovel",
  ALUGUEL: "Bairro, condominio ou imovel para alugar",
};

const IconHome = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 22V12h6v10"/>
  </svg>
);

const IconKey = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="M21 2l-9.6 9.6"/>
    <path d="M15.5 7.5l3 3L22 7l-3-3"/>
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

export function SearchPanel({ finalidadeInicial }: { finalidadeInicial: "VENDA" | "ALUGUEL" }) {
  const [aba, setAba] = useState<"VENDA" | "ALUGUEL">(finalidadeInicial);

  return (
    <form className="search-panel" action="/imoveis" method="GET">
      <input type="hidden" name="finalidade" value={aba} />
      <div className="search-tabs" role="tablist" aria-label="Finalidade">
        <button
          type="button"
          role="tab"
          aria-selected={aba === "VENDA"}
          className={aba === "VENDA" ? "active" : ""}
          onClick={() => setAba("VENDA")}
        >
          <IconHome />
          Comprar
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={aba === "ALUGUEL"}
          className={aba === "ALUGUEL" ? "active" : ""}
          onClick={() => setAba("ALUGUEL")}
        >
          <IconKey />
          Alugar
        </button>
      </div>
      <div className="search-row">
        <input
          type="search"
          name="busca"
          autoComplete="off"
          placeholder={PLACEHOLDERS[aba]}
          aria-label="Busca de imoveis"
        />
        <button type="submit" className="search-submit-btn">
          <IconSearch />
          Buscar imoveis
        </button>
      </div>
    </form>
  );
}
