import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contato | JCNI",
  description: "Entre em contato com a Jéssica Campos para compra, venda ou locação de imóveis em Sorocaba e região.",
  alternates: { canonical: "/contato" },
  openGraph: {
    title: "Contato | JCNI",
    description: "Entre em contato com a Jéssica Campos para compra, venda ou locação de imóveis em Sorocaba e região.",
    url: `${SITE_CONFIG.siteUrl}/contato`,
    siteName: "JCNI – Jéssica Campos Negócios Imobiliários",
    locale: "pt_BR",
    type: "website",
  },
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return children;
}