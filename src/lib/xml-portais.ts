/**
 * xml-portais.ts
 * Engine de geracao de feeds XML para portais imobiliarios.
 * Cada portal tem um grupo XML (mesma spec) e flags de comportamento.
 *
 * Privacidade: XML usa SOMENTE bairro + cidade + UF (nunca CEP, rua, numero).
 */
import type { TipoImovel, Finalidade } from "@/generated/prisma/client";

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

export type PortalId =
  | "zapimoveis"
  | "vivareal"
  | "olximoveis"
  | "imovelweb"
  | "chavesnamao";

type GrupoXml = "olxgroup" | "imovelweb" | "chavesnamao" | "generico";

export type PortalConfig = {
  id: PortalId;
  nome: string;
  grupo: GrupoXml;
  requerContrato: boolean;
  maxFotos: number;
  documentacaoUrl: string;
};

/** Subconjunto publico de campos do Imovel necessarios para o XML. */
export type ImovelParaXml = {
  codigo: string;
  titulo: string;
  descricao: string | null;
  tipo: TipoImovel;
  finalidade: Finalidade;
  preco: number | null;
  precoCondominio: number | null;
  iptu: number | null;
  area: number | null;
  areaUtil: number | null;
  quartos: number | null;
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  bairro: string;
  cidade: string;
  estado: string;
  slugUrl: string;
  fotos: Array<{ url: string; ordem: number }>;
};

// ---------------------------------------------------------------------------
// Catalogo de portais
// ---------------------------------------------------------------------------

export const PORTAIS_CONFIG: PortalConfig[] = [
  {
    id: "zapimoveis",
    nome: "ZAP Imoveis",
    grupo: "olxgroup",
    requerContrato: true,
    maxFotos: 30,
    documentacaoUrl: "https://developers.zapimoveis.com.br",
  },
  {
    id: "vivareal",
    nome: "Viva Real",
    grupo: "olxgroup",
    requerContrato: true,
    maxFotos: 30,
    documentacaoUrl: "https://developers.vivareal.com.br",
  },
  {
    id: "olximoveis",
    nome: "OLX Imoveis",
    grupo: "olxgroup",
    requerContrato: true,
    maxFotos: 20,
    documentacaoUrl: "https://developers.olx.com.br",
  },
  {
    id: "imovelweb",
    nome: "ImovelWeb",
    grupo: "imovelweb",
    requerContrato: true,
    maxFotos: 25,
    documentacaoUrl: "https://www.imovelweb.com.br/anunciar",
  },
  {
    id: "chavesnamao",
    nome: "Chaves na Mao",
    grupo: "chavesnamao",
    requerContrato: false,
    maxFotos: 15,
    documentacaoUrl: "https://www.chavesnamao.com.br/imobiliarias",
  },
];

export function getPortalConfig(id: string): PortalConfig | undefined {
  return PORTAIS_CONFIG.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Mapeamentos de enum para strings XML
// ---------------------------------------------------------------------------

/**
 * OLX Group (ZAP / Viva Real / OLX):
 *   TipoImovel XML: Residencial | Comercial | Rural
 *   SubTipoImovel XML: Apartamento | Casa | Terreno | Cobertura | Kitchenette | Loja | Sala Comercial | Sitio | Fazenda
 */
const OLX_TIPO: Record<TipoImovel, { tipo: string; subtipo: string }> = {
  APARTAMENTO: { tipo: "Residencial", subtipo: "Apartamento" },
  CASA: { tipo: "Residencial", subtipo: "Casa" },
  TERRENO: { tipo: "Residencial", subtipo: "Terreno" },
  COMERCIAL: { tipo: "Comercial", subtipo: "Sala Comercial" },
  COBERTURA: { tipo: "Residencial", subtipo: "Cobertura" },
  KITNET: { tipo: "Residencial", subtipo: "Kitchenette" },
  RURAL: { tipo: "Rural", subtipo: "Sitio" },
};

const OLX_CATEGORIA: Record<Finalidade, string> = {
  VENDA: "Venda",
  ALUGUEL: "Locacao",
  AMBOS: "VendaLocacao",
};

// ---------------------------------------------------------------------------
// Utilitario: escape XML seguro
// ---------------------------------------------------------------------------

function esc(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ---------------------------------------------------------------------------
// Gerador OLX Group (ZAP / Viva Real / OLX — mesma spec)
// ---------------------------------------------------------------------------

function gerarXmlOlxGroup(
  imoveis: ImovelParaXml[],
  siteUrl: string,
  maxFotos: number
): string {
  const linhas: string[] = [];

  linhas.push('<?xml version="1.0" encoding="UTF-8"?>');
  linhas.push("<Carga>");
  linhas.push("  <Imoveis>");

  for (const im of imoveis) {
    const { tipo, subtipo } = OLX_TIPO[im.tipo] ?? {
      tipo: "Residencial",
      subtipo: "Outros",
    };
    const categoria = OLX_CATEGORIA[im.finalidade] ?? "Venda";
    const fotos = im.fotos
      .slice()
      .sort((a, b) => a.ordem - b.ordem)
      .slice(0, maxFotos);
    const link = `${siteUrl}/imoveis/${esc(im.slugUrl)}`;

    linhas.push("    <Imovel>");
    linhas.push(`      <CodigoImovel>${esc(im.codigo)}</CodigoImovel>`);
    linhas.push(`      <TipoImovel>${esc(tipo)}</TipoImovel>`);
    linhas.push(`      <SubTipoImovel>${esc(subtipo)}</SubTipoImovel>`);
    linhas.push(`      <Categoria>${esc(categoria)}</Categoria>`);
    linhas.push(`      <TituloImovel>${esc(im.titulo)}</TituloImovel>`);
    linhas.push(`      <DetalheImovel>${esc(im.descricao ?? "")}</DetalheImovel>`);
    if (im.preco !== null)
      linhas.push(`      <Valor>${im.preco.toFixed(2)}</Valor>`);
    if (im.precoCondominio !== null)
      linhas.push(
        `      <ValorCondominio>${im.precoCondominio.toFixed(2)}</ValorCondominio>`
      );
    if (im.iptu !== null)
      linhas.push(`      <ValorIPTU>${im.iptu.toFixed(2)}</ValorIPTU>`);
    if (im.area !== null)
      linhas.push(`      <AreaTotal>${im.area}</AreaTotal>`);
    if (im.areaUtil !== null)
      linhas.push(`      <AreaUtil>${im.areaUtil}</AreaUtil>`);
    if (im.quartos !== null)
      linhas.push(`      <QtdDormitorios>${im.quartos}</QtdDormitorios>`);
    if (im.suites !== null)
      linhas.push(`      <QtdSuites>${im.suites}</QtdSuites>`);
    if (im.banheiros !== null)
      linhas.push(`      <QtdBanheiros>${im.banheiros}</QtdBanheiros>`);
    if (im.vagas !== null)
      linhas.push(`      <QtdVagas>${im.vagas}</QtdVagas>`);
    linhas.push(`      <Cidade>${esc(im.cidade)}</Cidade>`);
    linhas.push(`      <Bairro>${esc(im.bairro)}</Bairro>`);
    linhas.push(`      <UF>${esc(im.estado)}</UF>`);

    if (fotos.length > 0) {
      linhas.push("      <Fotos>");
      fotos.forEach((f, idx) => {
        if (idx === 0) {
          linhas.push(`        <Foto Principal="true">${esc(f.url)}</Foto>`);
        } else {
          linhas.push(`        <Foto>${esc(f.url)}</Foto>`);
        }
      });
      linhas.push("      </Fotos>");
    }

    linhas.push(`      <LinkImovel>${esc(link)}</LinkImovel>`);
    linhas.push("    </Imovel>");
  }

  linhas.push("  </Imoveis>");
  linhas.push("</Carga>");

  return linhas.join("\n");
}

// ---------------------------------------------------------------------------
// Gerador ImovelWeb
// ---------------------------------------------------------------------------

const IW_TIPO: Record<TipoImovel, string> = {
  APARTAMENTO: "Apartamento",
  CASA: "Casa",
  TERRENO: "Terreno",
  COMERCIAL: "Comercial",
  COBERTURA: "Cobertura",
  KITNET: "Kitnet",
  RURAL: "Rural",
};

const IW_OPERACAO: Record<Finalidade, string> = {
  VENDA: "Venta",
  ALUGUEL: "Alquiler",
  AMBOS: "VentaAlquiler",
};

function gerarXmlImovelweb(
  imoveis: ImovelParaXml[],
  siteUrl: string,
  maxFotos: number
): string {
  const linhas: string[] = [];
  linhas.push('<?xml version="1.0" encoding="UTF-8"?>');
  linhas.push("<propiedades>");

  for (const im of imoveis) {
    const tipo = IW_TIPO[im.tipo] ?? "Otros";
    const op = IW_OPERACAO[im.finalidade] ?? "Venta";
    const fotos = im.fotos
      .slice()
      .sort((a, b) => a.ordem - b.ordem)
      .slice(0, maxFotos);
    const link = `${siteUrl}/imoveis/${esc(im.slugUrl)}`;

    linhas.push("  <propiedade>");
    linhas.push(`    <codigo>${esc(im.codigo)}</codigo>`);
    linhas.push(`    <tipo>${esc(tipo)}</tipo>`);
    linhas.push(`    <operacao>${esc(op)}</operacao>`);
    linhas.push(`    <titulo>${esc(im.titulo)}</titulo>`);
    linhas.push(`    <descricao>${esc(im.descricao ?? "")}</descricao>`);
    if (im.preco !== null)
      linhas.push(`    <preco>${im.preco.toFixed(2)}</preco>`);
    if (im.area !== null) linhas.push(`    <area>${im.area}</area>`);
    if (im.quartos !== null)
      linhas.push(`    <dormitorios>${im.quartos}</dormitorios>`);
    if (im.banheiros !== null)
      linhas.push(`    <banheiros>${im.banheiros}</banheiros>`);
    if (im.vagas !== null) linhas.push(`    <vagas>${im.vagas}</vagas>`);
    linhas.push(`    <cidade>${esc(im.cidade)}</cidade>`);
    linhas.push(`    <bairro>${esc(im.bairro)}</bairro>`);
    linhas.push(`    <uf>${esc(im.estado)}</uf>`);
    linhas.push(`    <url>${esc(link)}</url>`);

    if (fotos.length > 0) {
      linhas.push("    <fotos>");
      fotos.forEach((f) => {
        linhas.push(`      <foto>${esc(f.url)}</foto>`);
      });
      linhas.push("    </fotos>");
    }

    linhas.push("  </propiedade>");
  }

  linhas.push("</propiedades>");
  return linhas.join("\n");
}

// ---------------------------------------------------------------------------
// Gerador generico (Chaves na Mao / 123i e outros)
// ---------------------------------------------------------------------------

function gerarXmlGenerico(
  imoveis: ImovelParaXml[],
  siteUrl: string,
  maxFotos: number
): string {
  const linhas: string[] = [];
  linhas.push('<?xml version="1.0" encoding="UTF-8"?>');
  linhas.push("<imoveis>");

  for (const im of imoveis) {
    const fotos = im.fotos
      .slice()
      .sort((a, b) => a.ordem - b.ordem)
      .slice(0, maxFotos);
    const link = `${siteUrl}/imoveis/${esc(im.slugUrl)}`;

    linhas.push("  <imovel>");
    linhas.push(`    <id>${esc(im.codigo)}</id>`);
    linhas.push(`    <tipo>${esc(im.tipo)}</tipo>`);
    linhas.push(`    <finalidade>${esc(im.finalidade)}</finalidade>`);
    linhas.push(`    <titulo>${esc(im.titulo)}</titulo>`);
    linhas.push(`    <descricao>${esc(im.descricao ?? "")}</descricao>`);
    if (im.preco !== null)
      linhas.push(`    <preco>${im.preco.toFixed(2)}</preco>`);
    if (im.precoCondominio !== null)
      linhas.push(`    <condominio>${im.precoCondominio.toFixed(2)}</condominio>`);
    if (im.iptu !== null)
      linhas.push(`    <iptu>${im.iptu.toFixed(2)}</iptu>`);
    if (im.area !== null) linhas.push(`    <area>${im.area}</area>`);
    if (im.areaUtil !== null)
      linhas.push(`    <areaUtil>${im.areaUtil}</areaUtil>`);
    if (im.quartos !== null)
      linhas.push(`    <quartos>${im.quartos}</quartos>`);
    if (im.suites !== null) linhas.push(`    <suites>${im.suites}</suites>`);
    if (im.banheiros !== null)
      linhas.push(`    <banheiros>${im.banheiros}</banheiros>`);
    if (im.vagas !== null) linhas.push(`    <vagas>${im.vagas}</vagas>`);
    linhas.push(`    <cidade>${esc(im.cidade)}</cidade>`);
    linhas.push(`    <bairro>${esc(im.bairro)}</bairro>`);
    linhas.push(`    <estado>${esc(im.estado)}</estado>`);
    linhas.push(`    <url>${esc(link)}</url>`);

    if (fotos.length > 0) {
      linhas.push("    <fotos>");
      fotos.forEach((f) => {
        linhas.push(`      <foto>${esc(f.url)}</foto>`);
      });
      linhas.push("    </fotos>");
    }

    linhas.push("  </imovel>");
  }

  linhas.push("</imoveis>");
  return linhas.join("\n");
}

// ---------------------------------------------------------------------------
// Dispatcher principal
// ---------------------------------------------------------------------------

export function gerarXml(
  portal: PortalConfig,
  imoveis: ImovelParaXml[],
  siteUrl: string
): string {
  switch (portal.grupo) {
    case "olxgroup":
      return gerarXmlOlxGroup(imoveis, siteUrl, portal.maxFotos);
    case "imovelweb":
      return gerarXmlImovelweb(imoveis, siteUrl, portal.maxFotos);
    case "chavesnamao":
    case "generico":
    default:
      return gerarXmlGenerico(imoveis, siteUrl, portal.maxFotos);
  }
}
