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

function formatNumber(v: number | null): string {
  if (v == null) return "-";
  return v.toLocaleString("pt-BR");
}

function clampPct(v: number | null): number {
  if (v == null || Number.isNaN(v)) return 0;
  return Math.min(Math.max(v, 0), 100);
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

  const fileStoragePct = data?.percentages.fileStorage ?? null;
  const databasePct = data?.percentages.database ?? null;
  const mauPct = data?.percentages.monthlyActiveUsers ?? null;

  return (
    <section className="free-limits-panel" aria-labelledby="supabase-free-limits">
      <div className="free-limits-head">
        <div>
          <h2 id="supabase-free-limits">Limites de Banco de Dados e Infraestrutura</h2>
          <p>
            Painel compacto com consumo e teto de recursos criticos do projeto. Atualizacao automatica a cada 60s.
          </p>
        </div>
        <span className="free-limits-updated">Atualizado: {atualizadoEm}</span>
      </div>

      {loading && <p className="free-limits-state">Carregando limites...</p>}
      {!loading && error && <p className="free-limits-error">{error}</p>}

      {!loading && !error && data && (
        <div className="free-limits-grid" aria-label="Limites de banco de dados e infraestrutura">
          <article className="free-limit-card" aria-label="File storage">
            <div className="free-limit-card-head">
              <h3>File storage</h3>
              <span className={`pill ${pctClass(fileStoragePct)}`}>
                {fileStoragePct == null ? "-" : `${fileStoragePct}%`}
              </span>
            </div>
            <div className="free-limit-values">
              <p>
                <span>Uso</span>
                <strong>{formatBytes(data.usage.fileStorageBytes)}</strong>
              </p>
              <p>
                <span>Limite</span>
                <strong>{formatBytes(data.limits.fileStorageBytes)}</strong>
              </p>
            </div>
            <div className="free-limits-meter" aria-label="Capacidade de file storage">
              <span className={`free-limits-meter-fill ${pctClass(fileStoragePct)}`} style={{ width: `${clampPct(fileStoragePct)}%` }} />
            </div>
          </article>

          <article className="free-limit-card" aria-label="Database size">
            <div className="free-limit-card-head">
              <h3>Database size</h3>
              <span className={`pill ${pctClass(databasePct)}`}>
                {databasePct == null ? "-" : `${databasePct}%`}
              </span>
            </div>
            <div className="free-limit-values">
              <p>
                <span>Uso</span>
                <strong>{formatBytes(data.usage.databaseBytes)}</strong>
              </p>
              <p>
                <span>Limite</span>
                <strong>{formatBytes(data.limits.databaseBytes)}</strong>
              </p>
            </div>
            <div className="free-limits-meter" aria-label="Capacidade de database size">
              <span className={`free-limits-meter-fill ${pctClass(databasePct)}`} style={{ width: `${clampPct(databasePct)}%` }} />
            </div>
          </article>

          <article className="free-limit-card" aria-label="Monthly active users">
            <div className="free-limit-card-head">
              <h3>Monthly active users</h3>
              <span className={`pill ${pctClass(mauPct)}`}>
                {mauPct == null ? "-" : `${mauPct}%`}
              </span>
            </div>
            <div className="free-limit-values">
              <p>
                <span>Uso</span>
                <strong>{formatNumber(data.usage.monthlyActiveUsers)}</strong>
              </p>
              <p>
                <span>Limite</span>
                <strong>{data.limits.monthlyActiveUsers.toLocaleString("pt-BR")}</strong>
              </p>
            </div>
            <div className="free-limits-meter" aria-label="Capacidade de monthly active users">
              <span className={`free-limits-meter-fill ${pctClass(mauPct)}`} style={{ width: `${clampPct(mauPct)}%` }} />
            </div>
          </article>

          <article className="free-limit-card free-limit-card--external" aria-label="Egress">
            <div className="free-limit-card-head">
              <h3>Egress</h3>
              <span className="pill">Painel Supabase</span>
            </div>
            <div className="free-limit-values">
              <p>
                <span>Uso</span>
                <strong>-</strong>
              </p>
              <p>
                <span>Limite</span>
                <strong>{formatBytes(data.limits.egressBytes)}</strong>
              </p>
            </div>
            <p className="free-limit-note">{data.notes.egressBytes}</p>
          </article>

          <article className="free-limit-card free-limit-card--external" aria-label="Cached egress">
            <div className="free-limit-card-head">
              <h3>Cached egress</h3>
              <span className="pill">Painel Supabase</span>
            </div>
            <div className="free-limit-values">
              <p>
                <span>Uso</span>
                <strong>-</strong>
              </p>
              <p>
                <span>Limite</span>
                <strong>{formatBytes(data.limits.cachedEgressBytes)}</strong>
              </p>
            </div>
            <p className="free-limit-note">{data.notes.cachedEgressBytes}</p>
          </article>

          <article className="free-limit-card" aria-label="API requests">
            <div className="free-limit-card-head">
              <h3>API requests</h3>
              <span className="pill ok">Sem teto</span>
            </div>
            <div className="free-limit-values">
              <p>
                <span>Uso</span>
                <strong>Ilimitado</strong>
              </p>
              <p>
                <span>Limite</span>
                <strong>Ilimitado</strong>
              </p>
            </div>
            <div className="free-limits-meter" aria-hidden>
              <span className="free-limits-meter-fill ok" style={{ width: "100%" }} />
            </div>
          </article>
        </div>
      )}

      <p className="free-limits-footnote">
        Egress e Cached Egress nao tem endpoint publico confiavel por projeto no Supabase. Para esses dois itens, a fonte oficial continua sendo a tela de Billing/Usage do Supabase.
      </p>
    </section>
  );
}
