import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/site-config";
import MobileNav from "@/app/_components/MobileNav";
import { BRAND_SETTINGS } from "@/lib/site-settings";
import { getPublicConfig } from "@/lib/config-reader";

export async function SiteHeader() {
  const config = await getPublicConfig();
  const logoUrl = config.logoUrl;
  const logoAlt = config.logoAlt;
  return (
    <header className="site-header">
      <MobileNav />
      <Link className="brand" href="/" aria-label="Pagina inicial - JCNI">
        <BrandMark logoUrl={logoUrl} logoAlt={logoAlt} />
      </Link>
      <nav className="nav-links" aria-label="Navegacao principal">
        <div className="nav-item">
          <Link className="nav-trigger" href="/comprar">
            Comprar <ChevronDown />
          </Link>
          <div className="nav-dropdown">
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Tipo de imovel</span>
              <Link href="/comprar?tipo=apartamento">Apartamentos</Link>
              <Link href="/comprar?tipo=casa">Casas</Link>
              <Link href="/comprar?tipo=terreno">Terrenos</Link>
              <Link href="/comprar?tipo=cobertura">Coberturas</Link>
              <Link href="/comprar?tipo=comercial">Comercial</Link>
            </div>
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Regioes em Sorocaba</span>
              <Link href="/comprar?bairro=campolim">Campolim</Link>
              <Link href="/comprar?bairro=centro">Centro</Link>
              <Link href="/comprar?bairro=eden">Eden</Link>
              <Link href="/comprar?bairro=wanel-ville">Wanel Ville</Link>
              <Link href="/comprar?bairro=alem-ponte">Alem Ponte</Link>
              <Link href="/comprar?bairro=jardim-paulistano">Jd. Paulistano</Link>
            </div>
          </div>
        </div>
        <div className="nav-item">
          <Link className="nav-trigger" href="/alugar">
            Alugar <ChevronDown />
          </Link>
          <div className="nav-dropdown">
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Tipo de imovel</span>
              <Link href="/alugar?tipo=apartamento">Apartamentos</Link>
              <Link href="/alugar?tipo=casa">Casas</Link>
              <Link href="/alugar?tipo=kitnet">Kitnet / Studio</Link>
              <Link href="/alugar?tipo=comercial">Comercial</Link>
            </div>
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Regioes em Sorocaba</span>
              <Link href="/alugar?bairro=campolim">Campolim</Link>
              <Link href="/alugar?bairro=centro">Centro</Link>
              <Link href="/alugar?bairro=eden">Eden</Link>
              <Link href="/alugar?bairro=wanel-ville">Wanel Ville</Link>
              <Link href="/alugar?bairro=alem-ponte">Alem Ponte</Link>
              <Link href="/alugar?bairro=aparecidinha">Aparecidinha</Link>
            </div>
          </div>
        </div>
        <Link href="/imoveis">Imoveis</Link>
        <Link href="/contato">Contato</Link>
      </nav>
      <a className="header-action" href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer">
        Instagram
      </a>
    </header>
  );
}

function BrandMark({ logoUrl, logoAlt }: { logoUrl: string; logoAlt: string }) {
  if (logoUrl) {
    return (
      <Image
        className="brand-logo-image"
        src={logoUrl}
        alt={logoAlt}
        width={56}
        height={56}
        priority
      />
    );
  }

  return <span className="brand-mark">{BRAND_SETTINGS.initials}</span>;
}

function ChevronDown() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
