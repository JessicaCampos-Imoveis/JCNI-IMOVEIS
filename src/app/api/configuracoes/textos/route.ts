import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/configuracoes/textos
 * Endpoint publico — retorna apenas os textos editaveis do site (hero, sobre).
 * Nenhuma chave privada (API keys, tokens, CRECI interno) e exposta aqui.
 * ISR: revalida automaticamente quando o admin salva via revalidateTag("site-config").
 */

export const revalidate = 60;

const PUBLIC_TEXT_KEYS = [
  "texto_hero_titulo",
  "texto_hero_subtitulo",
  "texto_sobre_titulo",
  "texto_sobre_corpo",
] as const;

type PublicTextos = Record<(typeof PUBLIC_TEXT_KEYS)[number], string>;

export async function GET() {
  try {
    const rows = await prisma.configuracao.findMany({
      where: { chave: { in: [...PUBLIC_TEXT_KEYS] } },
      select: { chave: true, valor: true },
    });

    const textos = Object.fromEntries(
      PUBLIC_TEXT_KEYS.map((k) => [k, ""])
    ) as PublicTextos;

    for (const row of rows) {
      if ((PUBLIC_TEXT_KEYS as readonly string[]).includes(row.chave)) {
        (textos as Record<string, string>)[row.chave] = row.valor;
      }
    }

    return NextResponse.json(textos, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    const fallback = Object.fromEntries(
      PUBLIC_TEXT_KEYS.map((k) => [k, ""])
    ) as PublicTextos;
    return NextResponse.json(fallback);
  }
}
