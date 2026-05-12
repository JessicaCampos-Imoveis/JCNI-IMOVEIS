/**
 * config-reader.ts
 * Le as configuracoes do site do banco (tabela Configuracao) com cache de 60s.
 * Toda leitura no site publico deve passar por aqui — nunca pelo endpoint /api.
 * Fallback para valores estaticos se o banco estiver indisponivel.
 */
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BRAND_SETTINGS, SITE_IMAGES } from "@/lib/site-settings";
import { THEME_PRESETS, type ThemePreset } from "@/lib/theme-presets";
import { SITE_CONFIG } from "@/lib/site-config";

export type PublicConfig = {
  logoUrl: string;
  logoAlt: string;
  jessicaFotoUrl: string;
  jessicaFotoHeroUrl: string;
  heroTitulo: string;
  heroSubtitulo: string;
  sobreTitulo: string;
  sobreCorpo: string;
  exibirIptu: boolean;
  exibirComodos: boolean;
  ordenacaoMaisVisitados: boolean;
  financiamentoLinkAtivo: boolean;
  financiamentoLinkUrl: string;
  temaPreset: ThemePreset;
  // Analytics e rastreamento
  gaId: string;
  metaPixelId: string;
  tiktokPixelId: string;
  gtmId: string;
  linkedinTagId: string;
  recaptchaSiteKey: string;
  // Chat ao vivo
  chatProvider: string;
  chatId: string;
  // Scripts customizados (conteudo JS, sem tags <script> externas)
  scriptHead: string;
  scriptBody: string;
  // Chat IA
  chatIaAtivo: boolean;
  chatIaBoasVindas: string;
  chatIaCtaWhatsApp: string;
  chatIaNome: string;
  // WhatsApp (numero para links dinamicos)
  whatsappNumero: string;
  contatoEmail: string;
  instagramUrl: string;
  instagramAtivo: boolean;
  socialWhatsappUrl: string;
  socialWhatsappAtivo: boolean;
  facebookUrl: string;
  facebookAtivo: boolean;
  linkedinUrl: string;
  linkedinAtivo: boolean;
  tiktokUrl: string;
  tiktokAtivo: boolean;
  // OG Image para compartilhamento social
  ogImageUrl: string;
  // Hero background
  heroBgUrl: string;
  // Radar JCNI
  radarTitulo: string;
  radarCardDescricao: string;
};

const DEFAULT: PublicConfig = {
  logoUrl: BRAND_SETTINGS.logo.imageUrl,
  logoAlt: BRAND_SETTINGS.logo.alt,
  jessicaFotoUrl: SITE_IMAGES.jessicaPortrait.url,
  jessicaFotoHeroUrl: SITE_IMAGES.jessicaPortrait.url,
  heroTitulo: "Encontre o imóvel certo em Sorocaba e região",
  heroSubtitulo: "Compra, venda e locação com atendimento consultivo, anúncios de alto padrão e dados tratados com responsabilidade.",
  sobreTitulo: "Atendimento consultivo para decisões imobiliárias",
  sobreCorpo: "Especialista em imóveis residenciais e comerciais em Sorocaba, a Jéssica acompanha cada cliente com atenção direta — da busca ao fechamento. Aqui você encontra imóveis bem descritos, fotos tratadas e contato sem intermediários.",
  exibirIptu: true,
  exibirComodos: true,
  ordenacaoMaisVisitados: false,
  financiamentoLinkAtivo: false,
  financiamentoLinkUrl: "",
  temaPreset: THEME_PRESETS[0],
  gaId: "",
  metaPixelId: "",
  tiktokPixelId: "",
  gtmId: "",
  linkedinTagId: "",
  recaptchaSiteKey: "",
  chatProvider: "none",
  chatId: "",
  scriptHead: "",
  scriptBody: "",
  // Chat IA
  chatIaAtivo: false,
  chatIaBoasVindas: "Ola! Como posso ajudar voce a encontrar o imovel ideal?",
  chatIaCtaWhatsApp: "Conversar com a Jessica pelo WhatsApp",
  chatIaNome: "Assistente JCNI",
  // WhatsApp
  whatsappNumero: "",
  contatoEmail: SITE_CONFIG.email,
  instagramUrl: SITE_CONFIG.instagramUrl,
  instagramAtivo: true,
  socialWhatsappUrl: "",
  socialWhatsappAtivo: false,
  facebookUrl: "",
  facebookAtivo: false,
  linkedinUrl: "",
  linkedinAtivo: false,
  tiktokUrl: "",
  tiktokAtivo: false,
  // OG Image
  ogImageUrl: "",
  // Hero background
  heroBgUrl: SITE_IMAGES.homeHero.url,
  // Radar JCNI
  radarTitulo: "Receba indicações quando surgir um imóvel compatível com seu perfil",
  radarCardDescricao: "Score de compatibilidade, motivos de match e contato direto via WhatsApp — tudo pelo painel da Jéssica.",
};

/** Remove caracteres nao seguros para interpolacao em atributos e scripts. */
function safeId(id: string): string {
  return id.replace(/[^A-Za-z0-9\-_.]/g, "");
}

/**
 * Extrai o conteudo JS de uma unica tag <script>...</script> se presente,
 * ou retorna o input como esta. Previne HTML aninhado em dangerouslySetInnerHTML.
 */
function extractScriptContent(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/^<script[^>]*>([\s\S]*?)<\/script>\s*$/i);
  return match ? match[1].trim() : trimmed;
}

async function fetchConfig(): Promise<PublicConfig> {
  try {
    const rows = await prisma.configuracao.findMany();
    const m: Record<string, string> = {};
    for (const r of rows) m[r.chave] = r.valor;

    return {
      logoUrl: m["marca_logo_url"] || DEFAULT.logoUrl,
      logoAlt: DEFAULT.logoAlt,
      jessicaFotoUrl: m["marca_foto_jessica_url"] || DEFAULT.jessicaFotoUrl,
      jessicaFotoHeroUrl: m["marca_foto_jessica_hero_url"] || DEFAULT.jessicaFotoHeroUrl,
      heroTitulo: m["texto_hero_titulo"] ?? DEFAULT.heroTitulo,
      heroSubtitulo: m["texto_hero_subtitulo"] ?? DEFAULT.heroSubtitulo,
      sobreTitulo: m["texto_sobre_titulo"] ?? DEFAULT.sobreTitulo,
      sobreCorpo: m["texto_sobre_corpo"] ?? DEFAULT.sobreCorpo,
      exibirIptu: m["exibir_iptu"] !== "false",
      exibirComodos: m["exibir_comodos"] !== "false",
      ordenacaoMaisVisitados: m["ordenacao_mais_visitados_ativa"] === "true",
      financiamentoLinkAtivo: m["financiamento_link_ativo"] === "true",
      financiamentoLinkUrl: m["financiamento_link_url"] ?? DEFAULT.financiamentoLinkUrl,
      temaPreset:
        THEME_PRESETS.find((p) => p.id === m["tema_preset"]) ?? DEFAULT.temaPreset,
      gaId: safeId(m["ga_measurement_id"] ?? ""),
      metaPixelId: safeId(m["meta_pixel_id"] ?? ""),
      tiktokPixelId: safeId(m["tiktok_pixel_id"] ?? ""),
      gtmId: safeId(m["gtm_container_id"] ?? ""),
      linkedinTagId: safeId(m["linkedin_insight_tag"] ?? ""),
      recaptchaSiteKey: safeId(m["recaptcha_site_key"] ?? ""),
      chatProvider: m["chat_ao_vivo_provider"] ?? "none",
      chatId: m["chat_ao_vivo_id"] ?? "",
      scriptHead: extractScriptContent(m["script_head"] ?? ""),
      scriptBody: extractScriptContent(m["script_body"] ?? ""),
      // Chat IA
      chatIaAtivo: m["chat_ativo"] === "true",
      chatIaBoasVindas:
        m["chat_boas_vindas"] ?? DEFAULT.chatIaBoasVindas,
      chatIaCtaWhatsApp:
        m["chat_cta_whatsapp"] ?? DEFAULT.chatIaCtaWhatsApp,
      chatIaNome: m["chat_nome"] ?? DEFAULT.chatIaNome,
      // WhatsApp
      whatsappNumero: m["whatsapp_numero"] ?? "",
      contatoEmail: m["empresa_email"] ?? DEFAULT.contatoEmail,
      instagramUrl: m["social_instagram_url"] ?? DEFAULT.instagramUrl,
      instagramAtivo: m["social_instagram_ativo"] ? m["social_instagram_ativo"] === "true" : Boolean(m["social_instagram_url"] ?? DEFAULT.instagramUrl),
      socialWhatsappUrl: m["social_whatsapp_url"] ?? DEFAULT.socialWhatsappUrl,
      socialWhatsappAtivo: m["social_whatsapp_ativo"] === "true",
      facebookUrl: m["social_facebook_url"] ?? DEFAULT.facebookUrl,
      facebookAtivo: m["social_facebook_ativo"] === "true",
      linkedinUrl: m["social_linkedin_url"] ?? DEFAULT.linkedinUrl,
      linkedinAtivo: m["social_linkedin_ativo"] === "true",
      tiktokUrl: m["social_tiktok_url"] ?? DEFAULT.tiktokUrl,
      tiktokAtivo: m["social_tiktok_ativo"] === "true",
      // OG Image
      ogImageUrl: m["og_image_url"] ?? "",
      // Hero background
      heroBgUrl: m["hero_bg_url"] || DEFAULT.heroBgUrl,
      // Radar JCNI
      radarTitulo: m["radar_titulo"] ?? DEFAULT.radarTitulo,
      radarCardDescricao: m["radar_card_descricao"] ?? DEFAULT.radarCardDescricao,
    };
  } catch {
    return DEFAULT;
  }
}

/**
 * Retorna a configuracao publica do site com cache de 60s.
 * O cache e invalidado imediatamente quando o admin salva configuracoes
 * via revalidateTag("site-config").
 */
export const getPublicConfig = unstable_cache(fetchConfig, ["public-config"], {
  revalidate: 60,
  tags: ["site-config"],
});
