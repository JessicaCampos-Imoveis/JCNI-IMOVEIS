import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/_components/SiteHeader";
import { SITE_CONFIG } from "@/lib/site-config";
import { WHATSAPP_SETTINGS, buildWhatsAppHref } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

// ISR por LP de imóvel conforme gate da Fase 3 do PRD.
export const revalidate = 3600;

type StatusImovel = "DISPONIVEL" | "RESERVADO" | "VENDIDO" | "LOCADO" | "INATIVO";

type ImovelDetalhe = {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string | null;
  tipo: string;
  finalidade: string;
  status: StatusImovel;
  preco: number;
  precoCondominio: number | null;
  iptu: number | null;
  bairro: string;
  cidade: string;
  estado: string;
  area: number | null;
  areaUtil: number | null;
  quartos: number | null;
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  slugUrl: string;
  altTexto: string | null;
  metaTitulo: string | null;
  metaDescricao: string | null;
  fotos: { id: string; url: string; destaque: boolean }[];
  comodidades: {
    comodidade: {
      id: string;
      nome: string;
      categoria: { id: string; nome: string };
    };
  }[];
};

type ImovelRelacionado = {
  id: string;
  slugUrl: string;
  titulo: string;
  preco: number;
  bairro: string;
  cidade: string;
  status: StatusImovel;
  fotos: { id: string; url: string }[];
};

type Props = {
  params: Promise<{ slug: string }>;
};

const STATUS_LABEL: Record<StatusImovel, string> = {
  DISPONIVEL: "Disponivel",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
  LOCADO: "Locado",
  INATIVO: "Inativo",
};

const BAIRRO_COORDENADAS: Record<string, [lat: number, lon: number]> = {
  campolim: [-23.5229, -47.4693],
  centro: [-23.5017, -47.4581],
  eden: [-23.4167, -47.3633],
  "wanel-ville": [-23.4964, -47.5058],
  "alem-ponte": [-23.4885, -47.441],
  aparecidinha: [-23.4395, -47.417],
  "jardim-paulistano": [-23.5038, -47.4877],
  "santa-rosalia": [-23.4918, -47.4477],
};

function slugifyTexto(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

function getMapEmbedUrl(bairro: string): string {
  const key = slugifyTexto(bairro);
  const [lat, lon] = BAIRRO_COORDENADAS[key] ?? [-23.5017, -47.4581];
  const delta = 0.035;
  const bbox = [lon - delta, lat - delta, lon + delta, lat + delta].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}

function formatarPreco(valor: number | null): string {
  if (valor == null) return "Não informado";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

async function getImovel(slug: string): Promise<ImovelDetalhe | null> {
  const imovel = await prisma.imovel.findFirst({
    where: {
      slugUrl: slug,
      deletadoEm: null,
      status: { in: ["DISPONIVEL", "RESERVADO", "VENDIDO", "LOCADO"] },
    },
    select: {
      id: true,
      codigo: true,
      titulo: true,
      descricao: true,
      tipo: true,
      finalidade: true,
      status: true,
      preco: true,
      precoCondominio: true,
      iptu: true,
      bairro: true,
      cidade: true,
      estado: true,
      area: true,
      areaUtil: true,
      quartos: true,
      suites: true,
      banheiros: true,
      vagas: true,
      slugUrl: true,
      altTexto: true,
      metaTitulo: true,
      metaDescricao: true,
      fotos: {
        select: { id: true, url: true, destaque: true },
        orderBy: [{ destaque: "desc" }, { ordem: "asc" }],
      },
      comodidades: {
        select: {
          comodidade: {
            select: {
              id: true,
              nome: true,
              categoria: { select: { id: true, nome: true } },
            },
          },
        },
      },
    },
  });

  if (!imovel) return null;

  return {
    ...imovel,
    preco: Number(imovel.preco),
    precoCondominio: imovel.precoCondominio != null ? Number(imovel.precoCondominio) : null,
    iptu: imovel.iptu != null ? Number(imovel.iptu) : null,
    area: imovel.area != null ? Number(imovel.area) : null,
    areaUtil: imovel.areaUtil != null ? Number(imovel.areaUtil) : null,
  } as ImovelDetalhe;
}

async function getRelacionados(imovel: ImovelDetalhe): Promise<ImovelRelacionado[]> {
  const relacionados = await prisma.imovel.findMany({
    where: {
      deletadoEm: null,
      status: { in: ["DISPONIVEL", "RESERVADO", "VENDIDO", "LOCADO"] },
      tipo: imovel.tipo as never,
      bairro: imovel.bairro,
      slugUrl: { not: imovel.slugUrl },
    },
    orderBy: { criadoEm: "desc" },
    take: 4,
    select: {
      id: true,
      slugUrl: true,
      titulo: true,
      preco: true,
      bairro: true,
      cidade: true,
      status: true,
      fotos: {
        select: { id: true, url: true },
        orderBy: [{ destaque: "desc" }, { ordem: "asc" }],
        take: 1,
      },
    },
  });

  return relacionados.map((item) => ({
    ...item,
    preco: Number(item.preco),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const imovel = await getImovel(slug);

  if (!imovel) {
    return {
      title: "Imóvel não encontrado | Jéssica Campos",
      robots: { index: false, follow: false },
    };
  }

  const title = imovel.metaTitulo ?? `${imovel.titulo} | ${imovel.codigo} | ${SITE_CONFIG.brandFull}`;
  const description =
    imovel.metaDescricao ??
    `${imovel.tipo} em ${imovel.bairro}, ${imovel.cidade}. Confira fotos, detalhes e fale com a Jéssica.`;
  const canonical = `${SITE_CONFIG.siteUrl}/imoveis/${imovel.slugUrl}`;
  const ogImage = imovel.fotos[0]?.url;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: ogImage ? [{ url: ogImage, alt: imovel.altTexto ?? imovel.titulo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ImovelSlugPage({ params }: Props) {
  const { slug } = await params;
  const imovel = await getImovel(slug);

  if (!imovel) notFound();

  const comodidadesPorCategoria = imovel.comodidades.reduce<Record<string, string[]>>((acc, item) => {
    const categoria = item.comodidade.categoria.nome;
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(item.comodidade.nome);
    return acc;
  }, {});

  const relacionados = await getRelacionados(imovel);
  const propertyMessage = WHATSAPP_SETTINGS.messageTemplates.property
    .replace("{propertyCode}", imovel.codigo)
    .replace("{propertyUrl}", `${SITE_CONFIG.siteUrl}/imoveis/${imovel.slugUrl}`);
  const whatsappHref = buildWhatsAppHref(propertyMessage, "lp_imovel");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: imovel.titulo,
    description: imovel.metaDescricao ?? imovel.descricao ?? `${imovel.tipo} em ${imovel.bairro}, ${imovel.cidade}`,
    url: `${SITE_CONFIG.siteUrl}/imoveis/${imovel.slugUrl}`,
    image: imovel.fotos.map((foto) => foto.url),
    datePosted: new Date().toISOString(),
    address: {
      "@type": "PostalAddress",
      addressLocality: imovel.bairro,
      addressRegion: imovel.estado,
      addressCountry: "BR",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: imovel.preco,
      availability:
        imovel.status === "DISPONIVEL"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
    },
  };

  return (
    <main className="imovel-slug-page">
      <SiteHeader />

      <section className="imovel-shell">
        <p className="breadcrumb">
          <Link href="/imoveis">Imóveis</Link> / {imovel.codigo}
        </p>

        <div className="title-row">
          <div>
            <h1>{imovel.titulo}</h1>
            <p className="sub">{imovel.bairro}, {imovel.cidade} - {imovel.estado}</p>
          </div>
          <div className="title-side">
            <span className={`status status-${imovel.status.toLowerCase()}`}>{STATUS_LABEL[imovel.status]}</span>
            <strong>{formatarPreco(imovel.preco)}</strong>
          </div>
        </div>

        <div className="gallery-grid">
          {imovel.fotos.length > 0 ? (
            imovel.fotos.map((foto) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={foto.id} src={foto.url} alt={imovel.altTexto ?? imovel.titulo} loading="lazy" />
            ))
          ) : (
            <div className="sem-fotos">Sem fotos publicadas para este imóvel.</div>
          )}
        </div>

        <div className="ficha-grid">
          <article className="card">
            <h2>Resumo</h2>
            <p>{imovel.descricao || "Descrição em atualização."}</p>
          </article>

          <article className="card">
            <h2>Características</h2>
            <ul>
              <li>Tipo: {imovel.tipo}</li>
              <li>Finalidade: {imovel.finalidade}</li>
              <li>Área total: {imovel.area ? `${imovel.area} m²` : "Não informada"}</li>
              <li>Área útil: {imovel.areaUtil ? `${imovel.areaUtil} m²` : "Não informada"}</li>
              <li>Quartos: {imovel.quartos ?? "-"}</li>
              <li>Suítes: {imovel.suites ?? "-"}</li>
              <li>Banheiros: {imovel.banheiros ?? "-"}</li>
              <li>Vagas: {imovel.vagas ?? "-"}</li>
              <li>Condomínio: {formatarPreco(imovel.precoCondominio)}</li>
              <li>IPTU: {formatarPreco(imovel.iptu)}</li>
            </ul>
          </article>
        </div>

        <section className="cta-wrap card" aria-labelledby="cta-whatsapp">
          <div>
            <h2 id="cta-whatsapp">Gostou deste imóvel?</h2>
            <p>Fale direto com a Jéssica pelo WhatsApp com a referência do imóvel já preenchida.</p>
          </div>
          {whatsappHref ? (
            <a className="whatsapp-cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Conversar sobre {imovel.codigo}
            </a>
          ) : (
            <p className="sem-dados">WhatsApp ainda não configurado no painel.</p>
          )}
        </section>

        <section className="map-wrap" aria-labelledby="mapa-bairro">
          <h2 id="mapa-bairro">Localização aproximada por bairro</h2>
          <p className="sem-dados">Mapa por bairro para preservar dados privados do proprietário.</p>
          <div className="map-frame">
            <iframe
              title={`Mapa do bairro ${imovel.bairro}`}
              src={getMapEmbedUrl(imovel.bairro)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <section className="comodidades-wrap">
          <h2>Comodidades</h2>
          {Object.keys(comodidadesPorCategoria).length === 0 ? (
            <p className="sem-dados">Comodidades não informadas.</p>
          ) : (
            <div className="comodidades-grid">
              {Object.entries(comodidadesPorCategoria).map(([categoria, itens]) => (
                <article key={categoria} className="card">
                  <h3>{categoria}</h3>
                  <ul>
                    {itens.map((nome) => (
                      <li key={nome}>{nome}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="relacionados-wrap" aria-labelledby="veja-tambem">
          <h2 id="veja-tambem">Veja também</h2>
          {relacionados.length === 0 ? (
            <p className="sem-dados">Sem imóveis relacionados no momento.</p>
          ) : (
            <div className="relacionados-grid">
              {relacionados.map((item) => (
                <Link key={item.id} href={`/imoveis/${item.slugUrl}`} className="rel-card">
                  <div className="rel-card-img">
                    {item.fotos[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.fotos[0].url} alt={item.titulo} loading="lazy" />
                    ) : (
                      <div className="sem-foto">Sem foto</div>
                    )}
                  </div>
                  <div className="rel-card-body">
                    <p className="codigo">{item.status !== "DISPONIVEL" ? STATUS_LABEL[item.status] : item.cidade}</p>
                    <h3>{item.titulo}</h3>
                    <p className="preco">{formatarPreco(item.preco)}</p>
                    <p className="local">{item.bairro}, {item.cidade}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        .imovel-slug-page { min-height: 100vh; background: var(--color-bg); }
        .imovel-shell { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 54px; }
        .breadcrumb { font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 10px; }
        .breadcrumb a { color: var(--color-text-muted); text-decoration: none; }
        .title-row { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; }
        .sub { color: var(--color-text-muted); margin-top: 5px; }
        .title-side { display: grid; justify-items: end; gap: 8px; }
        .title-side strong { font-size: 1.3rem; color: var(--color-primary); }
        .status {
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .status-disponivel { background: #dcfce7; color: #166534; }
        .status-reservado { background: #fef3c7; color: #92400e; }
        .status-vendido { background: #dbeafe; color: #1e3a8a; }
        .status-locado { background: #e0e7ff; color: #3730a3; }
        .gallery-grid {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .gallery-grid img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid var(--color-border);
        }
        .sem-fotos {
          border: 1px dashed var(--color-border);
          border-radius: 10px;
          padding: 20px;
          color: var(--color-text-muted);
          grid-column: 1 / -1;
        }
        .ficha-grid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .cta-wrap {
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .whatsapp-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 10px;
          background: #16a34a;
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          white-space: nowrap;
        }
        .map-wrap { margin-top: 14px; }
        .map-frame {
          margin-top: 8px;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          background: var(--color-surface);
        }
        .map-frame iframe {
          width: 100%;
          min-height: 320px;
          border: 0;
          display: block;
        }
        .card {
          border: 1px solid var(--color-border);
          border-radius: 12px;
          background: var(--color-surface);
          padding: 14px;
        }
        .card h2, .card h3 { margin-bottom: 8px; }
        .card p { color: var(--color-text-muted); line-height: 1.6; }
        .card ul { margin: 0; padding-left: 18px; display: grid; gap: 4px; color: var(--color-text); }
        .comodidades-wrap { margin-top: 14px; }
        .comodidades-grid { margin-top: 10px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .relacionados-wrap { margin-top: 14px; }
        .relacionados-grid {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }
        .rel-card {
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          background: var(--color-surface);
          text-decoration: none;
          color: inherit;
        }
        .rel-card-img {
          aspect-ratio: 4 / 3;
          background: var(--color-surface-muted);
        }
        .rel-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .rel-card-body { padding: 10px; }
        .rel-card-body h3 { margin: 3px 0 7px; font-size: 0.95rem; line-height: 1.35; }
        .sem-dados { color: var(--color-text-muted); margin-top: 6px; }

        @media (max-width: 920px) {
          .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .comodidades-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .relacionados-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 640px) {
          .imovel-shell { width: min(1180px, calc(100% - 22px)); }
          .title-row { flex-direction: column; }
          .title-side { justify-items: start; }
          .gallery-grid, .ficha-grid, .comodidades-grid, .relacionados-grid { grid-template-columns: 1fr; }
          .cta-wrap { flex-direction: column; align-items: flex-start; }
          .whatsapp-cta { width: 100%; }
        }
      `}</style>
    </main>
  );
}
