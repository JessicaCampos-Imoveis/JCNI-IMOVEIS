"use client";

import { useEffect, useMemo, useState } from "react";

type FreeUsageResponse = {
  updatedAt: string;
  limits: {
    fileStorageBytes: number;
    databaseBytes: number;
    monthlyActiveUsers: number;
    egressBytes: number;
    cachedEgressBytes: number;
    apiRequests: "unlimited";
  };
  usage: {
    fileStorageBytes: number | null;
    databaseBytes: number | null;
    monthlyActiveUsers: number | null;
    egressBytes: number | null;
    cachedEgressBytes: number | null;
    apiRequests: number | null;
  };
  percentages: {
    fileStorage: number | null;
    database: number | null;
    monthlyActiveUsers: number | null;
  };
  notes: {
    egressBytes: string;
    cachedEgressBytes: string;
    apiRequests: string;
  };
};

function formatBytes(v: number | null): string {
  if (v == null) return "-";
  if (v >= 1024 * 1024 * 1024) return `${(v / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  if (v >= 1024 * 1024) return `${(v / (1024 * 1024)).toFixed(2)} MB`;
  if (v >= 1024) return `${(v / 1024).toFixed(2)} KB`;
  return `${v} B`;
}

function pctClass(p: number | null): string {
  if (p == null) return "";
  if (p >= 90) return "danger";
  if (p >= 70) return "warn";
  return "ok";
}

export function SupabaseFreeLimitsCard() {
  const [data, setData] = useState<FreeUsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const res = await fetch("/api/admin/supabase/free-usage", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar limites do Supabase.");
        const body = (await res.json()) as FreeUsageResponse;
        if (!ativo) return;
        setData(body);
        setError("");
      } catch {
        if (!ativo) return;
        setError("Nao foi possivel carregar o painel de limites agora.");
      } finally {
        if (ativo) setLoading(false);
      }
    }

    void carregar();
    const timer = setInterval(() => {
      void carregar();
    }, 60000);

    return () => {
      ativo = false;
      clearInterval(timer);
    };
  }, []);

  const atualizadoEm = useMemo(() => {
    if (!data?.updatedAt) return "-";
    const dt = new Date(data.updatedAt);
    return dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }, [data?.updatedAt]);

  return (
    <section className="admin-panel free-limits-panel" aria-labelledby="supabase-free-limits">
      <div className="free-limits-head">
        <div>
          <h2 id="supabase-free-limits">Limites do plano Free (Supabase)</h2>
          <p>
            Monitoramento em tempo real do que é possível via API/DB do projeto. Atualização automática a cada 60s.
          </p>
        </div>
        <span className="free-limits-updated">Atualizado: {atualizadoEm}</span>
      </div>

      {loading && <p className="free-limits-state">Carregando limites...</p>}
      {!loading && error && <p className="free-limits-error">{error}</p>}

      {!loading && !error && data && (
        <div className="free-limits-table" role="table" aria-label="Limites do plano free">
          <div className="free-limits-row" role="row">
            <span role="cell">File storage</span>
            <span role="cell">{formatBytes(data.usage.fileStorageBytes)}</span>
            <span role="cell">{formatBytes(data.limits.fileStorageBytes)}</span>
            <span className={`pill ${pctClass(data.percentages.fileStorage)}`} role="cell">
              {data.percentages.fileStorage == null ? "-" : `${data.percentages.fileStorage}%`}
            </span>
          </div>

          <div className="free-limits-row" role="row">
            <span role="cell">Database size</span>
            <span role="cell">{formatBytes(data.usage.databaseBytes)}</span>
            <span role="cell">{formatBytes(data.limits.databaseBytes)}</span>
            <span className={`pill ${pctClass(data.percentages.database)}`} role="cell">
              {data.percentages.database == null ? "-" : `${data.percentages.database}%`}
            </span>
          </div>

          <div className="free-limits-row" role="row">
            <span role="cell">Monthly active users</span>
            <span role="cell">{data.usage.monthlyActiveUsers ?? "-"}</span>
            <span role="cell">{data.limits.monthlyActiveUsers.toLocaleString("pt-BR")}</span>
            <span className={`pill ${pctClass(data.percentages.monthlyActiveUsers)}`} role="cell">
              {data.percentages.monthlyActiveUsers == null ? "-" : `${data.percentages.monthlyActiveUsers}%`}
            </span>
          </div>

          <div className="free-limits-row" role="row">
            <span role="cell">Egress</span>
            <span role="cell">-</span>
            <span role="cell">{formatBytes(data.limits.egressBytes)}</span>
            <span className="pill" role="cell">Painel Supabase</span>
          </div>

          <div className="free-limits-row" role="row">
            <span role="cell">Cached egress</span>
            <span role="cell">-</span>
            <span role="cell">{formatBytes(data.limits.cachedEgressBytes)}</span>
            <span className="pill" role="cell">Painel Supabase</span>
          </div>

          <div className="free-limits-row" role="row">
            <span role="cell">API requests</span>
            <span role="cell">Ilimitado</span>
            <span role="cell">Ilimitado</span>
            <span className="pill ok" role="cell">OK</span>
          </div>
        </div>
      )}

      <p className="free-limits-footnote">
        Egress e Cached Egress não têm endpoint público confiável por projeto no Supabase. Para esses dois itens, a fonte oficial continua sendo a tela de Billing/Usage do Supabase.
      </p>
    </section>
  );
}
