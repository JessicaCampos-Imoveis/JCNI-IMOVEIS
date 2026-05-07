import type { Metadata } from "next";
import { SiteHeader } from "@/app/_components/SiteHeader";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidade | JCNI",
  description: "Conheça como os dados são tratados no site da Jéssica Campos Negócios Imobiliários.",
  alternates: { canonical: "/politica-de-privacidade" },
  openGraph: {
    title: "Política de Privacidade | JCNI",
    description: "Conheça como os dados são tratados no site da Jéssica Campos Negócios Imobiliários.",
    url: `${SITE_CONFIG.siteUrl}/politica-de-privacidade`,
    siteName: "JCNI – Jéssica Campos Negócios Imobiliários",
    locale: "pt_BR",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main className="simple-page">
      <SiteHeader />
      <section className="simple-shell">
        <p className="eyebrow">Privacidade</p>
        <h1>Política de privacidade</h1>
        <p>
          Esta página será finalizada com o texto jurídico aprovado antes da
          publicação em produção. O projeto já nasce com máscara de dados e
          separação entre informações públicas e privadas.
        </p>
      </section>
    </main>
  );
}
