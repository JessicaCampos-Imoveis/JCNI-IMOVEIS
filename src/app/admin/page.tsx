import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StorageAlert } from "@/app/admin/_components/StorageAlert";
import type { StorageNivel } from "@/app/admin/_components/StorageAlert";

// Supabase free: 1 GB de storage
const STORAGE_LIMITE_MB = 1024;
// Media WebP pos-pipeline (~180 KB por foto). Estimativa conservadora.
const AVG_FOTO_KB = 180;

const quickLinks = [
  { label: "Cadastrar imóvel", href: "/admin/imoveis/novo", accent: true },
  { label: "Comodidades", href: "/admin/comodidades", accent: false },
  { label: "Ver leads", href: "/admin/leads", accent: false },
  { label: "Configurações", href: "/admin/configuracoes", accent: false },
  { label: "Site público", href: "/", accent: false, blank: true },
];

export default async function AdminDashboard() {
  const [imoveisTotal, imoveisDisponiveis, leadsTotal, leadsNovos, fotosTotal] =
    await Promise.all([
      prisma.imovel.count({ where: { deletadoEm: null } }),
      prisma.imovel.count({ where: { status: "DISPONIVEL", deletadoEm: null } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NOVO" } }),
      prisma.foto.count(),
    ]);

  const storageEstimadoMB = Math.round((fotosTotal * AVG_FOTO_KB) / 1024);
  const storagePct = Math.min(
    Math.round((storageEstimadoMB / STORAGE_LIMITE_MB) * 100),
    100
  );
  const storageNivel: StorageNivel =
    storagePct >= 90 ? "critico" : storagePct >= 70 ? "aviso" : "ok";

  const statsCards = [
    {
      label: "Imóveis no acervo",
      value: String(imoveisTotal),
      sub: `${imoveisDisponiveis} disponíveis para venda/aluguel`,
      href: "/admin/imoveis",
    },
    {
      label: "Leads novos",
      value: String(leadsNovos),
      sub: `${leadsTotal} total no CRM`,
      href: "/admin/leads",
    },
    {
      label: "Fotos cadastradas",
      value: String(fotosTotal),
      sub: `~${storageEstimadoMB} MB estimados em storage`,
      href: "/admin/imoveis",
    },
  ];

  return (
    <div className="admin-page">
      <main className="admin-shell">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Bem-vinda de volta</p>
            <h1>Visão geral</h1>
          </div>
        </div>

        {/* Banner/modal de alerta de armazenamento (só aparece se nivel > ok) */}
        <StorageAlert
          nivel={storageNivel}
          pct={storagePct}
          storageMB={storageEstimadoMB}
          limiteMB={STORAGE_LIMITE_MB}
        />

        <div className="admin-grid">
          {statsCards.map(({ label, value, sub, href }) => (
            <Link href={href} key={label} className="admin-card admin-card--link">
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{sub}</p>
            </Link>
          ))}
        </div>

        {/* Card de armazenamento */}
        <div className={`admin-card storage-card storage-card--${storageNivel}`}>
          <div className="storage-card__header">
            <span>Armazenamento (Supabase Storage)</span>
            <strong className="storage-card__label">
              {storageEstimadoMB} MB
              <small> / {STORAGE_LIMITE_MB} MB &nbsp;({storagePct}%)</small>
            </strong>
          </div>

          <div className="storage-bar">
            <div
              className="storage-bar__fill"
              style={{ width: `${storagePct}%` }}
              role="progressbar"
              aria-valuenow={storagePct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <p className="storage-card__note">
            {storageNivel === "critico" && (
              <>⚠️ Armazenamento crítico. Considere excluir definitivamente imóveis inativos com muitas fotos para liberar espaço.</>  
            )}
            {storageNivel === "aviso" && (
              <>🟡 Mais de 70% usado. Acompanhe e planeje migração para R2 quando necessário.</>
            )}
            {storageNivel === "ok" && (
              <>✅ Armazenamento confortável. Estimativa baseada em ~{AVG_FOTO_KB} KB por foto (WebP).</>
            )}
          </p>
        </div>

        <div className="admin-panel">
          <div>
            <h2>Ações rápidas</h2>
            <p>Gerencie o acervo, acompanhe leads e ajuste as configurações do site.</p>
          </div>
          <div className="admin-nav-row">
            {quickLinks.map(({ label, href, accent, blank }) => (
              <Link
                key={label}
                href={href}
                className={accent ? "header-action" : "secondary-action"}
                {...(blank ? { target: "_blank", rel: "noopener" } : {})}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

