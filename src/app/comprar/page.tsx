import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/app/_components/SiteHeader";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Comprar Imóveis em Sorocaba | JCNI",
  description: "Encontre imóveis para compra em Sorocaba e região com atendimento consultivo da Jéssica Campos.",
  alternates: { canonical: "/comprar" },
  openGraph: {
    title: "Comprar Imóveis em Sorocaba | JCNI",
    description: "Encontre imóveis para compra em Sorocaba e região com atendimento consultivo da Jéssica Campos.",
    url: `${SITE_CONFIG.siteUrl}/comprar`,
    siteName: "JCNI – Jéssica Campos Negócios Imobiliários",
    locale: "pt_BR",
    type: "website",
  },
};

export default function BuyPage() {
  return (
    <main className="simple-page">
      <SiteHeader />
      <section className="simple-shell">
        <p className="eyebrow">Comprar</p>
        <h1>Imóveis para compra</h1>
        <p>
          Esta rota será ligada automaticamente à listagem de imóveis com
          finalidade de venda quando o módulo de cadastro estiver ativo.
        </p>
        <Link className="secondary-action" href="/imoveis">
          Ver listagem geral
        </Link>
      </section>
    </main>
  );
}
