import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Imóveis em Sorocaba e Região | JCNI",
  description: "Veja imóveis para compra e locação com filtros por tipo, finalidade e localização.",
  alternates: { canonical: "/imoveis" },
  openGraph: {
    title: "Imóveis em Sorocaba e Região | JCNI",
    description: "Veja imóveis para compra e locação com filtros por tipo, finalidade e localização.",
    url: `${SITE_CONFIG.siteUrl}/imoveis`,
    siteName: "JCNI – Jéssica Campos Negócios Imobiliários",
    locale: "pt_BR",
    type: "website",
  },
};

export default function ImoveisLayout({ children }: { children: React.ReactNode }) {
  return children;
}