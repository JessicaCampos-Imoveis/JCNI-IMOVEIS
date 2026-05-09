import { NextRequest, NextResponse } from "next/server";

type MunicipioIBGE = { id: number; nome: string };

type CacheMunicipios = {
  data: MunicipioIBGE[];
  expiresAt: number;
};

const MUNICIPIOS_TTL_MS = 6 * 60 * 60 * 1000;
const cacheMunicipiosPorUf = new Map<string, CacheMunicipios>();

function normalizarTexto(v: string): string {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function ufValida(uf: string): boolean {
  return /^[A-Z]{2}$/.test(uf);
}

async function carregarMunicipiosPorUf(uf: string): Promise<MunicipioIBGE[]> {
  const agora = Date.now();
  const emCache = cacheMunicipiosPorUf.get(uf);

  if (emCache && emCache.expiresAt > agora) {
    return emCache.data;
  }

  try {
    const resposta = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`, {
      cache: "no-store",
    });

    if (!resposta.ok) {
      throw new Error(`IBGE retornou ${resposta.status}`);
    }

    const data = (await resposta.json()) as MunicipioIBGE[];
    const lista = Array.isArray(data)
      ? data.slice().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
      : [];

    cacheMunicipiosPorUf.set(uf, {
      data: lista,
      expiresAt: agora + MUNICIPIOS_TTL_MS,
    });

    return lista;
  } catch {
    if (emCache) {
      return emCache.data;
    }
    throw new Error("Falha ao carregar municipios do IBGE.");
  }
}

export async function GET(req: NextRequest) {
  const uf = (req.nextUrl.searchParams.get("uf") || "SP").toUpperCase();
  const q = (req.nextUrl.searchParams.get("q") || "").trim();

  if (!ufValida(uf)) {
    return NextResponse.json({ error: "UF invalida." }, { status: 400 });
  }

  try {
    const municipios = await carregarMunicipiosPorUf(uf);
    const cidades = municipios.map((m) => m.nome);

    const resultado = q
      ? cidades.filter((c) => normalizarTexto(c).includes(normalizarTexto(q)))
      : cidades;

    return NextResponse.json({
      uf,
      cidades: resultado,
      total: resultado.length,
      cacheTtlMs: MUNICIPIOS_TTL_MS,
    });
  } catch (error) {
    console.error("[GET /api/admin/localidades/cidades]", error);
    return NextResponse.json(
      {
        uf,
        cidades: [],
        total: 0,
        error: "Nao foi possivel carregar cidades agora.",
      },
      { status: 200 }
    );
  }
}
