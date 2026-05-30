import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import { SiteHeader as SharedSiteHeader } from "./_components/SiteHeader";
import { PublicSiteFooter } from "./_components/PublicSiteFooter";
import { PropertyCardHome, type HomeCard } from "./_components/PropertyCardHome";
import { SearchPanel } from "./_components/SearchPanel";
import {
  SITE_IMAGES,
  type ManagedSiteImage,
} from "@/lib/site-settings";
import { getPublicConfig } from "@/lib/config-reader";
import { ProtectedPhoto } from "@/components/protected-photo";
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

type HomeTipoFiltro = "TODOS" | "NOVIDADES" | TipoImovel;

const TIPOS_VALIDOS = new Set<string>(["APARTAMENTO", "CASA", "TERRENO", "COMERCIAL", "COBERTURA", "KITNET", "RURAL"]);

const STATUS_LABEL: Record<StatusImovel, string> = {
  RASCUNHO: "Rascunho",
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
  if (TIPOS_VALIDOS.has(normalizado)) return normalizado as HomeTipoFiltro;
  return "TODOS";
}

async function carregarCardsHome(tipoAtivo: HomeTipoFiltro): Promise<HomeCard[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const statusAtivos: StatusImovel[] = ["DISPONIVEL", "RESERVADO", "VENDIDO", "LOCADO"];
  const vinte4h = new Date(Date.now() - 86_400_000);

  const where = {
    deletadoEm: null as null,
    status: { in: statusAtivos },
    ...(tipoAtivo === "NOVIDADES"
      ? { criadoEm: { gte: vinte4h } }
      : tipoAtivo !== "TODOS"
      ? { tipo: tipoAtivo as TipoImovel }
      : {}),
  };

  try {
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
        criadoEm: true,
        fotos: {
          select: { url: true },
          orderBy: [{ destaque: "desc" }, { ordem: "asc" }],
          take: 5,
        },
      },
    });

    return imoveis.map((imovel) => {
      const fallback = imagemFallbackPorTipo(imovel.tipo);
      const fotos = imovel.fotos.map((f) => f.url);
      if (fotos.length === 0) fotos.push(fallback.url);

      return {
        id: imovel.id,
        href: `/imoveis/${imovel.slugUrl}`,
        tipoLabel: TIPO_LABEL[imovel.tipo],
        finalidadeLabel: FINALIDADE_LABEL[imovel.finalidade],
        statusLabel: imovel.status === "DISPONIVEL" ? null : STATUS_LABEL[imovel.status],
        preco: formatarPreco(Number(imovel.preco)),
        bairro: imovel.bairro,
        fotos,
        imageAlt: imovel.altTexto ?? imovel.titulo,
        criadoEm: imovel.criadoEm.toISOString(),
        features: [
          imovel.area ? `${Number(imovel.area)} m²` : null,
          imovel.quartos != null ? `${imovel.quartos} quarto${imovel.quartos !== 1 ? "s" : ""}` : null,
          imovel.banheiros != null ? `${imovel.banheiros} banheiro${imovel.banheiros !== 1 ? "s" : ""}` : null,
          imovel.vagas != null ? `${imovel.vagas} vaga${imovel.vagas !== 1 ? "s" : ""}` : null,
        ].filter((v): v is string => v !== null),
      };
    });
  } catch {
    return [];
  }
}

async function carregarTabsHome(): Promise<Array<{ value: string; label: string }>> {
  if (!process.env.DATABASE_URL) {
    return [{ value: "TODOS", label: "Todos" }];
  }

  const statusAtivos: StatusImovel[] = ["DISPONIVEL", "RESERVADO", "VENDIDO", "LOCADO"];
  const vinte4h = new Date(Date.now() - 86_400_000);

  try {
    const [tiposGrupo, novidadesCount] = await Promise.all([
      prisma.imovel.groupBy({
        by: ["tipo"],
        where: { deletadoEm: null, status: { in: statusAtivos } },
        _count: { _all: true },
      }),
      prisma.imovel.count({
        where: { deletadoEm: null, status: { in: statusAtivos }, criadoEm: { gte: vinte4h } },
      }),
    ]);

    const tabs: Array<{ value: string; label: string }> = [
      { value: "TODOS", label: "Todos" },
    ];

    if (novidadesCount > 0) {
      tabs.push({ value: "NOVIDADES", label: "Novidades" });
    }

    const ORDEM_TIPOS: TipoImovel[] = ["APARTAMENTO", "CASA", "COBERTURA", "TERRENO", "COMERCIAL", "KITNET", "RURAL"];
    for (const tipo of ORDEM_TIPOS) {
      if (tiposGrupo.some((g) => g.tipo === tipo)) {
        tabs.push({ value: tipo, label: TIPO_LABEL[tipo] });
      }
    }

    return tabs;
  } catch {
    return [{ value: "TODOS", label: "Todos" }];
  }
}

type HomeDestaque = {
  id: string;
  href: string;
  titulo: string;
  bairro: string;
  preco: string;
  tipoLabel: string;
  fotoUrl: string;
  imageAlt: string;
};

async function carregarHomeDestaques(): Promise<HomeDestaque[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
  // Verifica se a secao esta ativa
  const cfgAtivo = await prisma.configuracao.findUnique({
    where: { chave: "home_destaques_ativo" },
  });
  if (cfgAtivo?.valor !== "true") return [];

  const statusAtivos: StatusImovel[] = ["DISPONIVEL", "RESERVADO"];

  // Usa campo destaqueHome no modelo Imovel como fonte de verdade
  const imoveis = await prisma.imovel.findMany({
    where: { destaqueHome: true, deletadoEm: null, status: { in: statusAtivos } },
    orderBy: { atualizadoEm: "desc" },
    select: {
      id: true,
      slugUrl: true,
      titulo: true,
      tipo: true,
      preco: true,
      bairro: true,
      altTexto: true,
      fotos: {
        where: { destaque: true },
        take: 1,
        orderBy: { ordem: "asc" },
        select: { url: true },
      },
    },
  });

    return imoveis.map((imovel) => ({
      id: imovel.id,
      href: `/imoveis/${imovel.slugUrl}`,
      titulo: imovel.titulo,
      bairro: imovel.bairro,
      preco: formatarPreco(Number(imovel.preco)),
      tipoLabel: TIPO_LABEL[imovel.tipo],
      fotoUrl: imovel.fotos[0]?.url ?? imagemFallbackPorTipo(imovel.tipo).url,
      imageAlt: imovel.altTexto ?? imovel.titulo,
    }));
  } catch {
    return [];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ tipo?: string; finalidade?: string; novidades?: string }>;
}) {
  const [params, siteConfig] = await Promise.all([
    searchParams?.then((value) => value ?? {}) ?? Promise.resolve({} as { tipo?: string; finalidade?: string; novidades?: string }),
    getPublicConfig(),
  ]);
  const tipoAtivo: HomeTipoFiltro = params.novidades === "1"
    ? "NOVIDADES"
    : obterTipoAtivo(params.tipo);
  const finalidadeInicial = params.finalidade === "ALUGUEL" ? "ALUGUEL" : "VENDA";

  const [cards, tabsDisponiveis, homeDestaques] = await Promise.all([
    carregarCardsHome(tipoAtivo),
    carregarTabsHome(),
    carregarHomeDestaques(),
  ]);

  // Foto da Jessica: permite imagem dedicada no hero e fallback para a foto padrao
  const jessicaFotoUrl = siteConfig.jessicaFotoUrl;
  const jessicaFotoHeroUrl = siteConfig.jessicaFotoHeroUrl;
  const jessicaPortrait: ManagedSiteImage = {
    ...SITE_IMAGES.jessicaPortrait,
    url: jessicaFotoUrl,
  };

  const heroStyle = {
    "--portrait-image": `url("${jessicaFotoHeroUrl}")`,
  } as CSSProperties;

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
      <SharedSiteHeader />
      <section className="hero-section">
        <div
          className={`hero-media${siteConfig.heroPortraitOculto ? " portrait-oculto" : ""}`}
          style={heroStyle}
          aria-hidden="true"
        >
          <Image
            src={siteConfig.heroBgUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 620px) 0vw, 100vw"
            className="hero-bg-desktop"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <Image
            src={siteConfig.heroBgMobileUrl}
            alt=""
            fill
            sizes="(min-width: 621px) 0vw, 100vw"
            className="hero-bg-mobile"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
          <div className="hero-media-gradient" />
        </div>
        <div className="hero-content">
          <h1>{siteConfig.heroTitulo}</h1>
          <p className="hero-copy">
            {siteConfig.heroSubtitulo}
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

          <TypeTabs tipoAtivo={tipoAtivo} tabs={tabsDisponiveis} />

          <PropertyGrid
            cards={cards}
            watermarkCssAtivo={siteConfig.watermarkCssAtivo}
            watermarkLogoUrl={siteConfig.watermarkLogoUrl}
            watermarkOpacidade={siteConfig.watermarkOpacidade}
          />
        </div>
      </section>

      {siteConfig.sobreAtivo && (
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
            <h2 id="about">{siteConfig.sobreTitulo}</h2>
            <p>{siteConfig.sobreCorpo}</p>
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
      )}

      {homeDestaques.length > 0 && (
        <section className="destaques-section" aria-labelledby="destaques-titulo">
          <div className="section-shell">
            <div className="section-heading centered">
              <h2 id="destaques-titulo">{siteConfig.homeDestaqueTitulo}</h2>
            </div>
            <div className="destaques-grid">
              {homeDestaques.map((card) => (
                <Link key={card.id} href={card.href} className="destaque-card">
                  <ProtectedPhoto
                    ativo={siteConfig.watermarkCssAtivo}
                    logoUrl={siteConfig.watermarkLogoUrl || undefined}
                    opacidade={siteConfig.watermarkOpacidade}
                    className="destaque-img-wrap"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.fotoUrl} alt={card.imageAlt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </ProtectedPhoto>
                  <div className="destaque-card-body">
                    <strong className="destaque-card-titulo">{card.titulo}</strong>
                    <p className="destaque-card-desc">{card.bairro} · {card.preco}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <WhatsAppBubble />
      {siteConfig.chatIaAtivo && (
        <ChatIaWidget
          boasVindas={siteConfig.chatIaBoasVindas}
          ctaWhatsApp={siteConfig.chatIaCtaWhatsApp}
          nome={siteConfig.chatIaNome}
          whatsappNumero={siteConfig.whatsappNumero}
          whatsappUrl={siteConfig.socialWhatsappUrl}
          avatarUrl={siteConfig.chatIaAvatarUrl || undefined}
        />
      )}
      <FooterLinksband />
      <PublicSiteFooter />
    </main>
  );
}

function TypeTabs({ tipoAtivo, tabs }: { tipoAtivo: HomeTipoFiltro; tabs: Array<{ value: string; label: string }> }) {
  return (
    <div className="type-tabs" role="tablist" aria-label="Tipo de imóvel">
      {tabs.map((tab) => {
        const href =
          tab.value === "TODOS" ? "/" :
          tab.value === "NOVIDADES" ? "/?novidades=1" :
          `/?tipo=${tab.value}`;
        return (
          <Link
            key={tab.value}
            href={href}
            className={`type-tab ${tab.value === tipoAtivo ? "active" : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

function PropertyGrid({
  cards,
  watermarkCssAtivo = false,
  watermarkLogoUrl = "",
  watermarkOpacidade = 25,
}: {
  cards: HomeCard[];
  watermarkCssAtivo?: boolean;
  watermarkLogoUrl?: string;
  watermarkOpacidade?: number;
}) {
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
          <PropertyCardHome
            card={card}
            index={index}
            key={card.id}
            watermarkCssAtivo={watermarkCssAtivo}
            watermarkLogoUrl={watermarkLogoUrl}
            watermarkOpacidade={watermarkOpacidade}
          />
        ))}
      </div>
      <div className="more-btn-wrap">
        <Link className="more-btn" href="/imoveis">Ver todos os imóveis</Link>
      </div>
    </>
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
