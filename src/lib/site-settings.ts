export type ManagedSiteImage = {
  id: string;
  label: string;
  adminLocation: string;
  usage: string;
  url: string;
  alt: string;
  recommendedSize: string;
  isDemo: boolean;
};

export const BRAND_SETTINGS = {
  displayName: "Jéssica Campos",
  fullName: "Jéssica Campos Negócios Imobiliários",
  initials: "JCNI",
  logo: {
    mode: "text",
    imageUrl: "",
    alt: "Logo da Jéssica Campos Negócios Imobiliários",
  },
} as const;

export const SITE_IMAGES = {
  homeHero: {
    id: "homeHero",
    label: "Banner principal da home",
    adminLocation: "Admin > Configurações > Imagens > Home > Banner principal",
    usage: "Imagem de fundo do hero da página inicial.",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=82",
    alt: "Sala residencial ampla usada como imagem demonstrativa do banner principal",
    recommendedSize: "1800 x 1000 px, WebP, até 350 KB",
    isDemo: true,
  },
  jessicaPortrait: {
    id: "jessicaPortrait",
    label: "Foto institucional da Jéssica",
    adminLocation: "Admin > Configurações > Marca > Foto institucional",
    usage: "Imagem institucional usada no hero e na seção sobre a Jéssica.",
    url: "/images/jessica-campos.jpeg",
    alt: "Jéssica Campos, especialista em negócios imobiliários",
    recommendedSize: "1200 x 1600 px, WebP, até 300 KB",
    isDemo: false,
  },
  propertyCardApartment: {
    id: "propertyCardApartment",
    label: "Card demo de apartamento",
    adminLocation: "Admin > Imóveis > Fotos > Foto principal do imóvel",
    usage: "Imagem demonstrativa para visualizar cards antes do cadastro real.",
    url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    alt: "Fachada residencial usada como imagem demonstrativa de imóvel",
    recommendedSize: "900 x 675 px, WebP, até 220 KB",
    isDemo: true,
  },
  propertyCardHouse: {
    id: "propertyCardHouse",
    label: "Card demo de casa",
    adminLocation: "Admin > Imóveis > Fotos > Foto principal do imóvel",
    usage: "Imagem demonstrativa para visualizar cards antes do cadastro real.",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    alt: "Casa contemporânea usada como imagem demonstrativa de imóvel",
    recommendedSize: "900 x 675 px, WebP, até 220 KB",
    isDemo: true,
  },
  propertyCardInterior: {
    id: "propertyCardInterior",
    label: "Card demo de interior",
    adminLocation: "Admin > Imóveis > Fotos > Galeria do imóvel",
    usage: "Imagem demonstrativa para composição de cards e landing pages.",
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    alt: "Interior residencial usado como imagem demonstrativa de imóvel",
    recommendedSize: "900 x 675 px, WebP, até 220 KB",
    isDemo: true,
  },
  propertyCardCondo: {
    id: "propertyCardCondo",
    label: "Card demo de condomínio",
    adminLocation: "Admin > Imóveis > Fotos > Galeria do imóvel",
    usage: "Imagem demonstrativa para composição de cards e landing pages.",
    url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    alt: "Área social residencial usada como imagem demonstrativa de imóvel",
    recommendedSize: "900 x 675 px, WebP, até 220 KB",
    isDemo: true,
  },
} satisfies Record<string, ManagedSiteImage>;

export const MANAGED_SITE_IMAGES = Object.values(SITE_IMAGES);

export const WHATSAPP_SETTINGS = {
  enabled: true,
  phoneE164: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_E164 ?? "",
  displayLabel: "WhatsApp",
  defaultSource: "site_publico",
  messageTemplates: {
    general:
      "Olá, Jéssica. Vim pelo site JCNI e gostaria de atendimento imobiliário.",
    property:
      "Olá, Jéssica. Tenho interesse no imóvel {propertyCode}: {propertyUrl}",
    radar:
      "Olá, {clientName}. Sou a Jéssica Campos e encontrei um imóvel compatível com seu perfil: {propertyUrl}",
  },
} as const;

export function buildWhatsAppHref(
  message: string,
  source: string = WHATSAPP_SETTINGS.defaultSource,
) {
  const phone = WHATSAPP_SETTINGS.phoneE164.replace(/\D/g, "");

  if (!WHATSAPP_SETTINGS.enabled || !phone) {
    return null;
  }

  const messageWithSource = `${message}\nOrigem: ${source}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(messageWithSource)}`;
}
