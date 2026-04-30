import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  BRAND_SETTINGS,
  SITE_IMAGES,
  type ManagedSiteImage,
} from "@/lib/site-settings";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";
import type { CSSProperties } from "react";

// ---------------------------------------------------------------------------
// Fase 2: substituir demoPropertyCards por dados reais de GET /api/imoveis
// ---------------------------------------------------------------------------

const demoPropertyCards = [
  {
    href: "/imoveis",
    tipo: "Apartamento",
    finalidade: "Venda",
    preco: "A consultar",
    bairro: "Sorocaba",
    features: ["2 quartos", "1 vaga", "65 m²"],
    image: SITE_IMAGES.propertyCardApartment,
  },
  {
    href: "/imoveis",
    tipo: "Casa",
    finalidade: "Venda",
    preco: "A consultar",
    bairro: "Sorocaba",
    features: ["3 quartos", "2 vagas", "180 m²"],
    image: SITE_IMAGES.propertyCardHouse,
  },
  {
    href: "/imoveis",
    tipo: "Apartamento",
    finalidade: "Locação",
    preco: "A consultar",
    bairro: "Sorocaba",
    features: ["1 quarto", "1 vaga", "42 m²"],
    image: SITE_IMAGES.propertyCardInterior,
  },
  {
    href: "/imoveis",
    tipo: "Cobertura",
    finalidade: "Venda",
    preco: "A consultar",
    bairro: "Sorocaba",
    features: ["4 quartos", "3 vagas", "320 m²"],
    image: SITE_IMAGES.propertyCardCondo,
  },
];

const serviceCards = [
  {
    title: "Comprar com clareza",
    description:
      "Curadoria por bairro, perfil e faixa de valor. Cada imóvel tem página própria com fotos tratadas, plantas e dados completos.",
  },
  {
    title: "Vender com estratégia",
    description:
      "Anúncios profissionais com SEO, portais integrados e visibilidade direta para compradores em Sorocaba e região.",
  },
  {
    title: "Alugar com segurança",
    description:
      "Imóveis verificados, atendimento ágil e processo transparente do primeiro contato até a entrega das chaves.",
  },
];

const quickStats = [
  ["Atendimento direto", "Sem intermediários — você fala com a Jéssica em cada etapa"],
  ["Imóveis bem documentados", "Fotos tratadas, página própria, SEO e dados estruturados"],
  ["Sorocaba e região", "Expertise local com cobertura focada no mercado regional"],
];



function imageVars(image: ManagedSiteImage): CSSProperties {
  return {
    "--managed-image": `url("${image.url}")`,
  } as CSSProperties;
}

export default function Home() {
  const heroStyle = {
    "--home-hero-image": `url("${SITE_IMAGES.homeHero.url}")`,
    "--portrait-image": `url("${SITE_IMAGES.jessicaPortrait.url}")`,
  } as CSSProperties;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="hero-section">
        <div className="hero-media" style={heroStyle} aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Jéssica Campos Negócios Imobiliários</p>
          <h1>Encontre o imóvel certo em Sorocaba e região</h1>
          <p className="hero-copy">
            Compra, venda e locação com atendimento consultivo, anúncios de alto
            padrão e dados tratados com responsabilidade.
          </p>
          <SearchPanel />
        </div>
      </section>

      <section className="section-shell service-grid" aria-labelledby="services">
        <div className="section-heading">
          <p className="eyebrow">Por que a JCNI</p>
          <h2 id="services">Uma experiência direta e profissional</h2>
        </div>
        <div className="cards-grid three">
          {serviceCards.map((card) => (
            <article className="service-card" key={card.title}>
              <span className="card-index" aria-hidden="true" />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band" aria-labelledby="properties">
        <div className="section-shell">
          <div className="section-heading inline">
            <div>
              <p className="eyebrow">Imóveis</p>
              <h2 id="properties">Em Sorocaba e região</h2>
            </div>
            <a className="text-link" href="/imoveis">
              Ver todos
            </a>
          </div>

          <div className="type-tabs" role="tablist" aria-label="Tipo de imóvel">
            <button className="type-tab active" type="button">Todos</button>
            <button className="type-tab" type="button">Apartamentos</button>
            <button className="type-tab" type="button">Casas</button>
            <button className="type-tab" type="button">Terrenos</button>
            <button className="type-tab" type="button">Comercial</button>
            <button className="type-tab" type="button">Coberturas</button>
          </div>

          <PropertyGrid />
        </div>
      </section>

      <section className="section-shell split-section" aria-labelledby="about">
        <div className="portrait-card">
          <div
            className="portrait-image"
            style={imageVars(SITE_IMAGES.jessicaPortrait)}
            role="img"
            aria-label={SITE_IMAGES.jessicaPortrait.alt}
          />
        </div>
        <div className="split-content">
          <p className="eyebrow">Sobre a Jéssica</p>
          <h2 id="about">Atendimento consultivo para decisões imobiliárias</h2>
          <p>
            Especialista em imóveis residenciais e comerciais em Sorocaba, a
            Jéssica acompanha cada cliente com atenção direta — da busca ao
            fechamento. Aqui você encontra imóveis bem descritos, fotos
            tratadas e contato sem intermediários.
          </p>
          <div className="stats-list">
            {quickStats.map(([label, value]) => (
              <div key={label}>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-band" aria-labelledby="radar">
        <div className="section-shell radar-layout">
          <div>
            <p className="eyebrow contrast">Radar JCNI</p>
            <h2 id="radar">
              Receba indicações quando surgir um imóvel compatível com seu
              perfil
            </h2>
          </div>
          <div className="radar-card">
            <span>Ao publicar um imóvel</span>
            <strong>o sistema cruza com clientes compatíveis</strong>
            <p>
              Score de compatibilidade, motivos de match e contato direto via
              WhatsApp — tudo pelo painel da Jéssica.
            </p>
          </div>
        </div>
      </section>

      <WhatsAppBubble />
      <FooterLinksband />
      <SiteFooter />
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Página inicial — JCNI">
        <BrandMark />
        <span>{BRAND_SETTINGS.displayName}</span>
      </Link>
      <nav className="nav-links" aria-label="Navegação principal">
        <div className="nav-item">
          <a className="nav-trigger" href="/comprar">
            Comprar <ChevronDown />
          </a>
          <div className="nav-dropdown">
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Tipo de imóvel</span>
              <a href="/comprar?tipo=apartamento">Apartamentos</a>
              <a href="/comprar?tipo=casa">Casas</a>
              <a href="/comprar?tipo=terreno">Terrenos</a>
              <a href="/comprar?tipo=cobertura">Coberturas</a>
              <a href="/comprar?tipo=comercial">Comercial</a>
            </div>
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Regiões em Sorocaba</span>
              <a href="/comprar?bairro=campolim">Campolim</a>
              <a href="/comprar?bairro=centro">Centro</a>
              <a href="/comprar?bairro=eden">Éden</a>
              <a href="/comprar?bairro=wanel-ville">Wanel Ville</a>
              <a href="/comprar?bairro=alem-ponte">Além Ponte</a>
              <a href="/comprar?bairro=jardim-paulistano">Jd. Paulistano</a>
            </div>
          </div>
        </div>
        <div className="nav-item">
          <a className="nav-trigger" href="/alugar">
            Alugar <ChevronDown />
          </a>
          <div className="nav-dropdown">
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Tipo de imóvel</span>
              <a href="/alugar?tipo=apartamento">Apartamentos</a>
              <a href="/alugar?tipo=casa">Casas</a>
              <a href="/alugar?tipo=kitnet">Kitnet / Studio</a>
              <a href="/alugar?tipo=comercial">Comercial</a>
            </div>
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Regiões em Sorocaba</span>
              <a href="/alugar?bairro=campolim">Campolim</a>
              <a href="/alugar?bairro=centro">Centro</a>
              <a href="/alugar?bairro=eden">Éden</a>
              <a href="/alugar?bairro=wanel-ville">Wanel Ville</a>
              <a href="/alugar?bairro=alem-ponte">Além Ponte</a>
              <a href="/alugar?bairro=aparecidinha">Aparecidinha</a>
            </div>
          </div>
        </div>
        <a href="/imoveis">Imóveis</a>
        <a href="/contato">Contato</a>
      </nav>
      <a className="header-action" href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer">
        Instagram
      </a>
    </header>
  );
}

function BrandMark() {
  if (BRAND_SETTINGS.logo.imageUrl) {
    return (
      <Image
        className="brand-logo-image"
        src={BRAND_SETTINGS.logo.imageUrl}
        alt={BRAND_SETTINGS.logo.alt}
        width={120}
        height={34}
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

function SearchPanel() {
  return (
    <form className="search-panel">
      <div className="search-tabs" role="tablist" aria-label="Finalidade">
        <button className="active" type="button">
          Comprar
        </button>
        <button type="button">Alugar</button>
      </div>
      <div className="search-row">
        <input
          type="search"
          name="q"
          autoComplete="off"
          placeholder="Bairro, condomínio ou código do imóvel"
          aria-label="Busca de imóveis"
        />
        <button type="submit">Buscar imóveis</button>
      </div>
    </form>
  );
}

function PropertyGrid() {
  return (
    <>
      <div className="property-grid">
        {demoPropertyCards.map((card) => (
          <a className="property-card" href={card.href} key={card.image.id}>
            <div className="property-card-img">
              <Image
                src={card.image.url}
                alt={card.image.alt}
                width={900}
                height={675}
                sizes="(max-width: 620px) 100vw, (max-width: 920px) 50vw, 25vw"
              />
            </div>
            <div className="property-card-body">
              <p className="property-card-type">
                {card.tipo} &middot; {card.finalidade}
              </p>
              <p className="property-card-price">{card.preco}</p>
              <p className="property-card-location">{card.bairro}</p>
              <div className="property-card-features" aria-label="Dados do imóvel">
                {card.features.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="more-btn-wrap">
        <a className="more-btn" href="/imoveis">Ver todos os imóveis</a>
      </div>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="brand contrast" href="/">
          <BrandMark />
          <span>{BRAND_SETTINGS.displayName}</span>
        </Link>
        <p>{SITE_CONFIG.shortDescription}</p>
      </div>
      <nav aria-label="Links do rodapé">
        <a href="/imoveis">Imóveis</a>
        <a href="/contato">Contato</a>
        <a href="/politica-de-privacidade">Privacidade</a>
        <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
      </nav>
      <div>
        <span>Contato</span>
        <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
      </div>
    </footer>
  );
}

function FooterLinksband() {
  return (
    <section className="footer-links-band" aria-labelledby="footer-explore-heading">
      <div className="footer-links-shell">
        <p id="footer-explore-heading" className="eyebrow">Explorar em Sorocaba e região</p>
        <div className="footer-links-grid">
          <div className="footer-links-col">
            <span className="footer-links-col-heading">Apartamentos à venda</span>
            <a href="/imoveis?finalidade=venda&tipo=apartamento&bairro=campolim">Aptos no Campolim</a>
            <a href="/imoveis?finalidade=venda&tipo=apartamento&bairro=centro">Aptos no Centro</a>
            <a href="/imoveis?finalidade=venda&tipo=apartamento&bairro=wanel-ville">Aptos no Wanel Ville</a>
            <a href="/imoveis?finalidade=venda&tipo=apartamento&bairro=eden">Aptos no Éden</a>
            <a href="/imoveis?finalidade=venda&tipo=apartamento&bairro=alem-ponte">Aptos no Além Ponte</a>
            <a href="/imoveis?finalidade=venda&tipo=apartamento">Ver todos os aptos</a>
          </div>
          <div className="footer-links-col">
            <span className="footer-links-col-heading">Casas à venda</span>
            <a href="/imoveis?finalidade=venda&tipo=casa&bairro=campolim">Casas no Campolim</a>
            <a href="/imoveis?finalidade=venda&tipo=casa&bairro=eden">Casas no Éden</a>
            <a href="/imoveis?finalidade=venda&tipo=casa&bairro=wanel-ville">Casas no Wanel Ville</a>
            <a href="/imoveis?finalidade=venda&tipo=casa&bairro=alem-ponte">Casas no Além Ponte</a>
            <a href="/imoveis?finalidade=venda&tipo=casa&bairro=jardim-paulistano">Casas no Jd. Paulistano</a>
            <a href="/imoveis?finalidade=venda&tipo=casa">Ver todas as casas</a>
          </div>
          <div className="footer-links-col">
            <span className="footer-links-col-heading">Para alugar</span>
            <a href="/imoveis?finalidade=aluguel&tipo=apartamento&bairro=centro">Aptos no Centro</a>
            <a href="/imoveis?finalidade=aluguel&tipo=apartamento&bairro=campolim">Aptos no Campolim</a>
            <a href="/imoveis?finalidade=aluguel&tipo=casa&bairro=eden">Casas no Éden</a>
            <a href="/imoveis?finalidade=aluguel&tipo=casa&bairro=alem-ponte">Casas no Além Ponte</a>
            <a href="/imoveis?finalidade=aluguel&tipo=kitnet">Kitnet / Studio</a>
            <a href="/imoveis?finalidade=aluguel&tipo=comercial">Salas comerciais</a>
          </div>
          <div className="footer-links-col">
            <span className="footer-links-col-heading">Regiões</span>
            <a href="/imoveis?bairro=campolim">Campolim</a>
            <a href="/imoveis?bairro=centro">Centro de Sorocaba</a>
            <a href="/imoveis?bairro=eden">Éden</a>
            <a href="/imoveis?bairro=wanel-ville">Wanel Ville</a>
            <a href="/imoveis?bairro=alem-ponte">Além Ponte</a>
            <a href="/imoveis?bairro=aparecidinha">Aparecidinha</a>
            <a href="/imoveis?bairro=jardim-paulistano">Jardim Paulistano</a>
            <a href="/imoveis?bairro=santa-rosalia">Santa Rosália</a>
          </div>
        </div>
      </div>
    </section>
  );
}
