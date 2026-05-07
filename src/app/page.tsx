import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import MobileNav from "./_components/MobileNav";
import {
  BRAND_SETTINGS,
  SITE_IMAGES,
  type ManagedSiteImage,
} from "@/lib/site-settings";
import { getPublicConfig } from "@/lib/config-reader";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";
import { ChatIaWidget } from "@/components/chat-ia-widget";
import type { CSSProperties } from "react";
import type { Finalidade, StatusImovel, TipoImovel } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Imóveis em Sorocaba — Comprar, Vender e Alugar | JCNI",
  description: SITE_CONFIG.shortDescription,
  alternates: { canonical: "/" },
};

export const revalidate = 300;

type HomeCard = {
  id: string;
  href: string;
  tipoLabel: string;
  finalidadeLabel: string;
  statusLabel: string | null;
  preco: string;
  bairro: string;
  imageUrl: string;
  imageAlt: string;
  features: string[];
};

type HomeTipoFiltro = "TODOS" | TipoImovel;

const HOME_TIPO_TABS: Array<{ value: HomeTipoFiltro; label: string }> = [
  { value: "TODOS", label: "Todos" },
  { value: "APARTAMENTO", label: "Apartamentos" },
  { value: "CASA", label: "Casas" },
  { value: "TERRENO", label: "Terrenos" },
  { value: "COMERCIAL", label: "Comercial" },
  { value: "COBERTURA", label: "Coberturas" },
];

const STATUS_LABEL: Record<StatusImovel, string> = {
  DISPONIVEL: "Disponível",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
  LOCADO: "Locado",
  INATIVO: "Inativo",
};

const TIPO_LABEL: Record<TipoImovel, string> = {
  APARTAMENTO: "Apartamento",
  CASA: "Casa",
  TERRENO: "Terreno",
  COMERCIAL: "Comercial",
  COBERTURA: "Cobertura",
  KITNET: "Kitnet",
  RURAL: "Rural",
};

const FINALIDADE_LABEL: Record<Finalidade, string> = {
  VENDA: "Venda",
  ALUGUEL: "Locação",
  AMBOS: "Venda/Locação",
};

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

function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function imagemFallbackPorTipo(tipo: TipoImovel): ManagedSiteImage {
  if (tipo === "APARTAMENTO") return SITE_IMAGES.propertyCardApartment;
  if (tipo === "CASA") return SITE_IMAGES.propertyCardHouse;
  if (tipo === "COBERTURA") return SITE_IMAGES.propertyCardCondo;
  return SITE_IMAGES.propertyCardInterior;
}

function obterTipoAtivo(valor?: string): HomeTipoFiltro {
  const normalizado = (valor ?? "").toUpperCase();
  if (HOME_TIPO_TABS.some((t) => t.value === normalizado)) {
    return normalizado as HomeTipoFiltro;
  }
  return "TODOS";
}

async function carregarCardsHome(tipoAtivo: HomeTipoFiltro): Promise<HomeCard[]> {
  const where = {
    deletadoEm: null,
    status: { in: ["DISPONIVEL", "RESERVADO", "VENDIDO", "LOCADO"] as StatusImovel[] },
    ...(tipoAtivo !== "TODOS" ? { tipo: tipoAtivo } : {}),
  };

  const imoveis = await prisma.imovel.findMany({
    where,
    orderBy: { criadoEm: "desc" },
    take: 8,
    select: {
      id: true,
      slugUrl: true,
      titulo: true,
      tipo: true,
      finalidade: true,
      status: true,
      preco: true,
      bairro: true,
      area: true,
      quartos: true,
      banheiros: true,
      vagas: true,
      altTexto: true,
      fotos: {
        select: { url: true },
        orderBy: [{ destaque: "desc" }, { ordem: "asc" }],
        take: 1,
      },
    },
  });

  return imoveis.map((imovel) => {
    const fallback = imagemFallbackPorTipo(imovel.tipo);
    const fotoPrincipal = imovel.fotos[0]?.url;

    return {
      id: imovel.id,
      href: `/imoveis/${imovel.slugUrl}`,
      tipoLabel: TIPO_LABEL[imovel.tipo],
      finalidadeLabel: FINALIDADE_LABEL[imovel.finalidade],
      statusLabel: imovel.status === "DISPONIVEL" ? null : STATUS_LABEL[imovel.status],
      preco: formatarPreco(Number(imovel.preco)),
      bairro: imovel.bairro,
      imageUrl: fotoPrincipal ?? fallback.url,
      imageAlt: imovel.altTexto ?? imovel.titulo,
      features: [
        imovel.area ? `${imovel.area} m²` : "- m²",
        imovel.quartos != null ? `${imovel.quartos} quartos` : "- quartos",
        imovel.banheiros != null ? `${imovel.banheiros} banheiros` : "- banheiros",
        imovel.vagas != null ? `${imovel.vagas} vagas` : "- vagas",
      ],
    };
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams?:
    | { tipo?: string; finalidade?: string }
    | Promise<{ tipo?: string; finalidade?: string }>;
}) {
  const [params, siteConfig] = await Promise.all([
    Promise.resolve(searchParams ?? {}),
    getPublicConfig(),
  ]);
  const tipoAtivo = obterTipoAtivo(params.tipo);
  const cards = await carregarCardsHome(tipoAtivo);
  const finalidadeInicial = params.finalidade === "ALUGUEL" ? "ALUGUEL" : "VENDA";

  const heroStyle = {
    "--portrait-image": `url("${SITE_IMAGES.jessicaPortrait.url}")`,
  } as CSSProperties;

  // Foto da Jessica: usa URL do banco se disponivel, senão fallback ao arquivo estatico
  const jessicaFotoUrl = siteConfig.jessicaFotoUrl;
  const jessicaPortrait: ManagedSiteImage = {
    ...SITE_IMAGES.jessicaPortrait,
    url: jessicaFotoUrl,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Jéssica Campos Negócios Imobiliários",
    url: SITE_CONFIG.siteUrl,
    description: SITE_CONFIG.shortDescription,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sorocaba",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    areaServed: "Sorocaba e região",
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader logoUrl={siteConfig.logoUrl} logoAlt={siteConfig.logoAlt} />
      <section className="hero-section">
        <div className="hero-media" style={heroStyle} aria-hidden="true">
          <Image
            src={SITE_IMAGES.homeHero.url}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className="hero-media-gradient" />
        </div>
        <div className="hero-content">
          <p className="eyebrow">Jéssica Campos Negócios Imobiliários</p>
          <h1>{siteConfig.heroTitulo || "Encontre o imóvel certo em Sorocaba e região"}</h1>
          <p className="hero-copy">
            {siteConfig.heroSubtitulo || "Compra, venda e locação com atendimento consultivo, anúncios de alto padrão e dados tratados com responsabilidade."}
          </p>
          <SearchPanel finalidadeInicial={finalidadeInicial} />
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
            <Link className="text-link" href="/imoveis">
              Ver todos
            </Link>
          </div>

          <TypeTabs tipoAtivo={tipoAtivo} />

          <PropertyGrid cards={cards} />
        </div>
      </section>

      <section className="section-shell split-section" aria-labelledby="about">
        <div className="portrait-card">
          <div
            className="portrait-image"
            style={imageVars(jessicaPortrait)}
            role="img"
            aria-label={jessicaPortrait.alt}
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
      {siteConfig.chatIaAtivo && (
        <ChatIaWidget
          boasVindas={siteConfig.chatIaBoasVindas}
          ctaWhatsApp={siteConfig.chatIaCtaWhatsApp}
          nome={siteConfig.chatIaNome}
          whatsappNumero={siteConfig.whatsappNumero}
        />
      )}
      <FooterLinksband />
      <SiteFooter />
    </main>
  );
}

function SiteHeader({ logoUrl, logoAlt }: { logoUrl: string; logoAlt: string }) {
  return (
    <header className="site-header">
      <MobileNav />
      <Link className="brand" href="/" aria-label="Página inicial — JCNI">
        <BrandMark logoUrl={logoUrl} logoAlt={logoAlt} />
      </Link>
      <nav className="nav-links" aria-label="Navegação principal">
        <div className="nav-item">
          <Link className="nav-trigger" href="/comprar">
            Comprar <ChevronDown />
          </Link>
          <div className="nav-dropdown">
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Tipo de imóvel</span>
              <Link href="/comprar?tipo=apartamento">Apartamentos</Link>
              <Link href="/comprar?tipo=casa">Casas</Link>
              <Link href="/comprar?tipo=terreno">Terrenos</Link>
              <Link href="/comprar?tipo=cobertura">Coberturas</Link>
              <Link href="/comprar?tipo=comercial">Comercial</Link>
            </div>
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Regiões em Sorocaba</span>
              <Link href="/comprar?bairro=campolim">Campolim</Link>
              <Link href="/comprar?bairro=centro">Centro</Link>
              <Link href="/comprar?bairro=eden">Éden</Link>
              <Link href="/comprar?bairro=wanel-ville">Wanel Ville</Link>
              <Link href="/comprar?bairro=alem-ponte">Além Ponte</Link>
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
              <span className="nav-dropdown-label">Tipo de imóvel</span>
              <Link href="/alugar?tipo=apartamento">Apartamentos</Link>
              <Link href="/alugar?tipo=casa">Casas</Link>
              <Link href="/alugar?tipo=kitnet">Kitnet / Studio</Link>
              <Link href="/alugar?tipo=comercial">Comercial</Link>
            </div>
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Regiões em Sorocaba</span>
              <Link href="/alugar?bairro=campolim">Campolim</Link>
              <Link href="/alugar?bairro=centro">Centro</Link>
              <Link href="/alugar?bairro=eden">Éden</Link>
              <Link href="/alugar?bairro=wanel-ville">Wanel Ville</Link>
              <Link href="/alugar?bairro=alem-ponte">Além Ponte</Link>
              <Link href="/alugar?bairro=aparecidinha">Aparecidinha</Link>
            </div>
          </div>
        </div>
        <Link href="/imoveis">Imóveis</Link>
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

function SearchPanel({ finalidadeInicial }: { finalidadeInicial: "VENDA" | "ALUGUEL" }) {
  return (
    <form className="search-panel" action="/imoveis" method="GET">
      <div className="search-tabs" role="tablist" aria-label="Finalidade">
        <button className={finalidadeInicial === "VENDA" ? "active" : ""} type="submit" name="finalidade" value="VENDA">
          Comprar
        </button>
        <button className={finalidadeInicial === "ALUGUEL" ? "active" : ""} type="submit" name="finalidade" value="ALUGUEL">Alugar</button>
      </div>
      <div className="search-row">
        <input
          type="search"
          name="busca"
          autoComplete="off"
          placeholder="Bairro, condomínio ou código do imóvel"
          aria-label="Busca de imóveis"
        />
        <button type="submit" name="finalidade" value={finalidadeInicial}>Buscar imóveis</button>
      </div>
    </form>
  );
}

function TypeTabs({ tipoAtivo }: { tipoAtivo: HomeTipoFiltro }) {
  return (
    <div className="type-tabs" role="tablist" aria-label="Tipo de imóvel">
      {HOME_TIPO_TABS.map((tab) => (
        <Link
          key={tab.value}
          href={tab.value === "TODOS" ? "/" : `/?tipo=${tab.value}`}
          className={`type-tab ${tab.value === tipoAtivo ? "active" : ""}`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

function PropertyGrid({ cards }: { cards: HomeCard[] }) {
  if (cards.length === 0) {
    return (
      <div className="more-btn-wrap">
        <p>Nenhum imóvel disponível para este filtro no momento.</p>
        <Link className="more-btn" href="/imoveis">Ver todos os imóveis</Link>
      </div>
    );
  }

  return (
    <>
      <div className="property-grid">
        {cards.map((card, index) => (
          <Link className="property-card" href={card.href} key={card.id}>
            <div className="property-card-img">
              <Image
                src={card.imageUrl}
                alt={card.imageAlt}
                width={900}
                height={675}
                sizes="(max-width: 620px) 100vw, (max-width: 920px) 50vw, 25vw"
                priority={index === 0}
              />
            </div>
            <div className="property-card-body">
              <p className="property-card-type">
                {card.tipoLabel} &middot; {card.finalidadeLabel}
                {card.statusLabel ? ` · ${card.statusLabel}` : ""}
              </p>
              <p className="property-card-price">{card.preco}</p>
              <p className="property-card-location">{card.bairro}</p>
              <div className="property-card-features" aria-label="Dados do imóvel">
                {card.features.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="more-btn-wrap">
        <Link className="more-btn" href="/imoveis">Ver todos os imóveis</Link>
      </div>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="brand contrast" href="/">
          <span className="brand-mark">{BRAND_SETTINGS.initials}</span>
          <span>{BRAND_SETTINGS.displayName}</span>
        </Link>
        <p>{SITE_CONFIG.shortDescription}</p>
      </div>
      <nav aria-label="Links do rodapé">
        <Link href="/imoveis">Imóveis</Link>
        <Link href="/contato">Contato</Link>
        <Link href="/politica-de-privacidade">Privacidade</Link>
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
            <Link href="/imoveis?finalidade=venda&tipo=apartamento&bairro=campolim">Aptos no Campolim</Link>
            <Link href="/imoveis?finalidade=venda&tipo=apartamento&bairro=centro">Aptos no Centro</Link>
            <Link href="/imoveis?finalidade=venda&tipo=apartamento&bairro=wanel-ville">Aptos no Wanel Ville</Link>
            <Link href="/imoveis?finalidade=venda&tipo=apartamento&bairro=eden">Aptos no Éden</Link>
            <Link href="/imoveis?finalidade=venda&tipo=apartamento&bairro=alem-ponte">Aptos no Além Ponte</Link>
            <Link href="/imoveis?finalidade=venda&tipo=apartamento">Ver todos os aptos</Link>
          </div>
          <div className="footer-links-col">
            <span className="footer-links-col-heading">Casas à venda</span>
            <Link href="/imoveis?finalidade=venda&tipo=casa&bairro=campolim">Casas no Campolim</Link>
            <Link href="/imoveis?finalidade=venda&tipo=casa&bairro=eden">Casas no Éden</Link>
            <Link href="/imoveis?finalidade=venda&tipo=casa&bairro=wanel-ville">Casas no Wanel Ville</Link>
            <Link href="/imoveis?finalidade=venda&tipo=casa&bairro=alem-ponte">Casas no Além Ponte</Link>
            <Link href="/imoveis?finalidade=venda&tipo=casa&bairro=jardim-paulistano">Casas no Jd. Paulistano</Link>
            <Link href="/imoveis?finalidade=venda&tipo=casa">Ver todas as casas</Link>
          </div>
          <div className="footer-links-col">
            <span className="footer-links-col-heading">Para alugar</span>
            <Link href="/imoveis?finalidade=aluguel&tipo=apartamento&bairro=centro">Aptos no Centro</Link>
            <Link href="/imoveis?finalidade=aluguel&tipo=apartamento&bairro=campolim">Aptos no Campolim</Link>
            <Link href="/imoveis?finalidade=aluguel&tipo=casa&bairro=eden">Casas no Éden</Link>
            <Link href="/imoveis?finalidade=aluguel&tipo=casa&bairro=alem-ponte">Casas no Além Ponte</Link>
            <Link href="/imoveis?finalidade=aluguel&tipo=kitnet">Kitnet / Studio</Link>
            <Link href="/imoveis?finalidade=aluguel&tipo=comercial">Salas comerciais</Link>
          </div>
          <div className="footer-links-col">
            <span className="footer-links-col-heading">Regiões</span>
            <Link href="/imoveis?bairro=campolim">Campolim</Link>
            <Link href="/imoveis?bairro=centro">Centro de Sorocaba</Link>
            <Link href="/imoveis?bairro=eden">Éden</Link>
            <Link href="/imoveis?bairro=wanel-ville">Wanel Ville</Link>
            <Link href="/imoveis?bairro=alem-ponte">Além Ponte</Link>
            <Link href="/imoveis?bairro=aparecidinha">Aparecidinha</Link>
            <Link href="/imoveis?bairro=jardim-paulistano">Jardim Paulistano</Link>
            <Link href="/imoveis?bairro=santa-rosalia">Santa Rosália</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
