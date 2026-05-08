import type { MetadataRoute } from "next";
import type { StatusImovel } from "@/generated/prisma/client";
import { SITE_CONFIG } from "@/lib/site-config";

type SitemapImovel = {
  slugUrl: string;
  atualizadoEm: Date;
};

async function listarImoveisIndexaveis(): Promise<SitemapImovel[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    return await prisma.imovel.findMany({
      where: {
        deletadoEm: null,
        status: { in: ["DISPONIVEL", "RESERVADO", "VENDIDO", "LOCADO"] as StatusImovel[] },
      },
      select: {
        slugUrl: true,
        atualizadoEm: true,
      },
      orderBy: { atualizadoEm: "desc" },
    });
  } catch (error) {
    console.warn("sitemap: fallback para rotas fixas por indisponibilidade do banco.", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.siteUrl.replace(/\/$/, "");

  const rotasFixas: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/comprar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alugar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const imoveisIndexaveis = await listarImoveisIndexaveis();

  const rotasImoveis: MetadataRoute.Sitemap = imoveisIndexaveis.map((imovel) => ({
    url: `${baseUrl}/imoveis/${imovel.slugUrl}`,
    lastModified: imovel.atualizadoEm,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...rotasFixas, ...rotasImoveis];
}