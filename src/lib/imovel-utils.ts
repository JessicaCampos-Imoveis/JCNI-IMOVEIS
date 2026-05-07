import { prisma } from "@/lib/prisma";
import type { TipoImovel, Finalidade } from "@/generated/prisma/client";

// ─── Código IMV ───────────────────────────────────────────────────────────────

/**
 * Gera próximo código IMV-XXXX sequencial, garantindo unicidade no banco.
 * RN07: código gerado automaticamente.
 */
export async function gerarCodigoImovel(): Promise<string> {
  const ultimo = await prisma.imovel.findFirst({
    orderBy: { criadoEm: "desc" },
    select: { codigo: true },
  });

  let proximo = 1;
  if (ultimo?.codigo) {
    const num = parseInt(ultimo.codigo.replace("IMV-", ""), 10);
    if (!isNaN(num)) proximo = num + 1;
  }

  // Garante unicidade em caso de concorrência
  let codigo = `IMV-${String(proximo).padStart(4, "0")}`;
  while (await prisma.imovel.findUnique({ where: { codigo } })) {
    proximo++;
    codigo = `IMV-${String(proximo).padStart(4, "0")}`;
  }

  return codigo;
}

// ─── Slug ────────────────────────────────────────────────────────────────────

const TIPO_SLUG: Record<TipoImovel, string> = {
  APARTAMENTO: "apartamento",
  CASA: "casa",
  TERRENO: "terreno",
  COMERCIAL: "comercial",
  COBERTURA: "cobertura",
  KITNET: "kitnet",
  RURAL: "rural",
};

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Gera slug semântico: tipo-bairro-codigo
 * Ex: casa-vila-progresso-imv-0042
 * Garante unicidade incrementando sufixo se necessário.
 */
export async function gerarSlug(
  tipo: TipoImovel,
  bairro: string,
  codigo: string,
  imovelIdAtual?: string,
): Promise<string> {
  const base = `${TIPO_SLUG[tipo]}-${slugify(bairro)}-${slugify(codigo)}`;

  const existente = await prisma.imovel.findUnique({
    where: { slugUrl: base },
    select: { id: true },
  });

  // Único ou pertence ao próprio imóvel (edição)
  if (!existente || existente.id === imovelIdAtual) return base;

  // Fallback com sufixo numérico
  let i = 2;
  while (true) {
    const candidate = `${base}-${i}`;
    const dup = await prisma.imovel.findUnique({
      where: { slugUrl: candidate },
      select: { id: true },
    });
    if (!dup || dup.id === imovelIdAtual) return candidate;
    i++;
  }
}

// ─── Alt text (RN09) ─────────────────────────────────────────────────────────

const TIPO_LABEL: Record<TipoImovel, string> = {
  APARTAMENTO: "Apartamento",
  CASA: "Casa",
  TERRENO: "Terreno",
  COMERCIAL: "Imóvel Comercial",
  COBERTURA: "Cobertura",
  KITNET: "Kitnet",
  RURAL: "Imóvel Rural",
};

export function gerarAltTexto(params: {
  tipo: TipoImovel;
  quartos?: number | null;
  bairro: string;
  cidade: string;
  codigo: string;
}): string {
  const { tipo, quartos, bairro, cidade, codigo } = params;
  const q = quartos ? `${quartos}q ` : "";
  return `${TIPO_LABEL[tipo]} ${q}${bairro} ${cidade} — ${codigo}`;
}

// ─── Meta tags automáticas ────────────────────────────────────────────────────

const FINALIDADE_LABEL: Record<Finalidade, string> = {
  VENDA: "à venda",
  ALUGUEL: "para alugar",
  AMBOS: "à venda ou para alugar",
};

export function gerarMetaTitulo(params: {
  tipo: TipoImovel;
  finalidade: Finalidade;
  quartos?: number | null;
  bairro: string;
  cidade: string;
}): string {
  const { tipo, finalidade, quartos, bairro, cidade } = params;
  const q = quartos ? ` ${quartos} quartos` : "";
  return `${TIPO_LABEL[tipo]}${q} ${FINALIDADE_LABEL[finalidade]} em ${bairro}, ${cidade} | JCNI`;
}

export function gerarMetaDescricao(params: {
  tipo: TipoImovel;
  finalidade: Finalidade;
  quartos?: number | null;
  area?: number | null;
  bairro: string;
  cidade: string;
  codigo: string;
}): string {
  const { tipo, finalidade, quartos, area, bairro, cidade, codigo } = params;
  const partes: string[] = [
    `${TIPO_LABEL[tipo]} ${FINALIDADE_LABEL[finalidade]} em ${bairro}, ${cidade}.`,
  ];
  if (quartos) partes.push(`${quartos} quartos.`);
  if (area) partes.push(`${area} m².`);
  partes.push(`Código ${codigo}. Atendimento consultivo por Jéssica Campos.`);
  return partes.join(" ");
}
