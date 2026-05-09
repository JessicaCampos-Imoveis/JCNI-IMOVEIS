import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SupabaseFreeLimitsCard } from "@/app/admin/_components/SupabaseFreeLimitsCard";

const quickLinks = [
  { label: "Cadastrar imóvel", href: "/admin/imoveis/novo", accent: true },
  { label: "Comodidades", href: "/admin/comodidades", accent: false },
  { label: "Ver leads", href: "/admin/leads", accent: false },
  { label: "Configurações", href: "/admin/configuracoes", accent: false },
  { label: "Site público", href: "/", accent: false, blank: true },
];

export default async function AdminDashboard() {
  const [imoveisTotal, imoveisDisponiveis, leadsTotal, leadsNovos, fotosTotal] =
    await (async () => {
      try {
        return await Promise.all([
          prisma.imovel.count({ where: { deletadoEm: null } }),
          prisma.imovel.count({ where: { status: "DISPONIVEL", deletadoEm: null } }),
          prisma.lead.count(),
          prisma.lead.count({ where: { status: "NOVO" } }),
          prisma.foto.count(),
        ]);
      } catch (error) {
        console.warn("admin-dashboard: fallback em contadores por indisponibilidade do banco.", error);
        return [0, 0, 0, 0, 0] as const;
      }
    })();

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
      sub: "Uso real do plano free no painel abaixo",
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

        <div className="admin-grid">
          {statsCards.map(({ label, value, sub, href }) => (
            <Link href={href} key={label} className="admin-card admin-card--link">
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{sub}</p>
            </Link>
          ))}
        </div>

        <div className="admin-panel admin-panel--dashboard-controls">
          <div>
            <h2>Ações rápidas</h2>
            <p>Gerencie o acervo, acompanhe leads e ajuste as configurações do site.</p>
          </div>
          <div className="admin-nav-row">
            {quickLinks.map(({ label, href, accent, blank }) => (
              <Link
                key={label}
                href={href}
                className={accent ? "admin-action admin-action--primary" : "admin-action"}
                {...(blank ? { target: "_blank", rel: "noopener" } : {})}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <SupabaseFreeLimitsCard />
      </main>
    </div>
  );
}

