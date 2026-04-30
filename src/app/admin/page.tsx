import Link from "next/link";
import AdminTopbar from "./_components/AdminTopbar";

const statsCards = [
  {
    label: "Imóveis publicados",
    value: "0",
    sub: "Fase 2: CRUD disponível em breve",
    href: "/admin/imoveis",
  },
  {
    label: "Leads novos",
    value: "0",
    sub: "Fase 3: formulários públicos ativos",
    href: "/admin/leads",
  },
  {
    label: "Perfis no radar",
    value: "0",
    sub: "Fase 4: cruzamento inteligente",
    href: "/admin/radar",
  },
];

const quickLinks = [
  { label: "Cadastrar imóvel", href: "/admin/imoveis/novo", accent: true },
  { label: "Ver leads", href: "/admin/leads", accent: false },
  { label: "Configurações", href: "/admin/configuracoes", accent: false },
  { label: "Site público", href: "/", accent: false, blank: true },
];

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <AdminTopbar />
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
