import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/app/_components/SiteHeader";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Alugar Imóveis em Sorocaba | JCNI",
  description: "Consulte imóveis para locação em Sorocaba e região com atendimento direto e transparente.",
  alternates: { canonical: "/alugar" },
  openGraph: {
    title: "Alugar Imóveis em Sorocaba | JCNI",
    description: "Consulte imóveis para locação em Sorocaba e região com atendimento direto e transparente.",
    url: `${SITE_CONFIG.siteUrl}/alugar`,
    siteName: "JCNI – Jéssica Campos Negócios Imobiliários",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RentPage() {
  return (
    <main className="simple-page">
      <SiteHeader />
      <section className="simple-shell">
        <p className="eyebrow">Alugar</p>
        <h1>Imóveis para locação</h1>
        <p>
          Esta rota será ligada automaticamente à listagem de imóveis com
          finalidade de aluguel quando o módulo de cadastro estiver ativo.
        </p>
        <Link className="secondary-action" href="/imoveis">
          Ver listagem geral
        </Link>
      </section>
    </main>
  );
}
