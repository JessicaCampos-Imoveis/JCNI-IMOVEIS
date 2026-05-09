import { NextRequest, NextResponse } from "next/server";

type MunicipioIBGE = { id: number; nome: string };
type LocalidadeNome = { nome: string };

type CacheMunicipios = {
  data: MunicipioIBGE[];
  expiresAt: number;
};

type CacheBairros = {
  data: string[];
  expiresAt: number;
};

const MUNICIPIOS_TTL_MS = 6 * 60 * 60 * 1000;
const BAIRROS_TTL_MS = 2 * 60 * 60 * 1000;

const cacheMunicipiosPorUf = new Map<string, CacheMunicipios>();
const cacheBairrosPorCidade = new Map<string, CacheBairros>();

const BAIRROS_COMPLEMENTARES: Record<string, string[]> = {
  "SP|sorocaba": [
    "Campolim",
    "Jardim Simus",
    "Wanel Ville",
    "Jardim Europa",
    "Ipanema",
    "Vila Progresso",
    "Eden",
    "Aparecidinha",
    "Jardim Goncalves",
    "Jardim Sao Paulo",
    "Vila Haro",
    "Jardim Refugio",
    "Jardim Faculdade",
    "Vila Trujillo",
  ],
};

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

function chaveBairro(uf: string, cidade: string): string {
  return `${uf.toUpperCase()}|${normalizarTexto(cidade)}`;
}

function mergeUnicoOrdenado(...listas: string[][]): string[] {
  const set = new Set<string>();

  for (const lista of listas) {
    for (const item of lista) {
      const valor = item?.trim();
      if (!valor) continue;
      set.add(valor);
    }
  }

  return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"));
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
    if (emCache) return emCache.data;
    throw new Error("Falha ao carregar municipios do IBGE.");
  }
}

async function carregarBairrosIBGE(municipioId: number): Promise<string[]> {
  const [distritosRes, subdistritosRes] = await Promise.all([
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${municipioId}/distritos`, { cache: "no-store" }),
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${municipioId}/subdistritos`, { cache: "no-store" }),
  ]);

  const distritos = distritosRes.ok ? ((await distritosRes.json()) as LocalidadeNome[]) : [];
  const subdistritos = subdistritosRes.ok ? ((await subdistritosRes.json()) as LocalidadeNome[]) : [];

  return mergeUnicoOrdenado(
    Array.isArray(distritos) ? distritos.map((d) => d.nome) : [],
    Array.isArray(subdistritos) ? subdistritos.map((d) => d.nome) : []
  );
}

export async function GET(req: NextRequest) {
  const uf = (req.nextUrl.searchParams.get("uf") || "SP").toUpperCase();
  const cidade = (req.nextUrl.searchParams.get("cidade") || "").trim();
  const q = (req.nextUrl.searchParams.get("q") || "").trim();

  if (!ufValida(uf)) {
    return NextResponse.json({ error: "UF invalida." }, { status: 400 });
  }

  if (!cidade) {
    return NextResponse.json({ error: "Cidade e obrigatoria." }, { status: 400 });
  }

  const chave = chaveBairro(uf, cidade);
  const agora = Date.now();
  const emCache = cacheBairrosPorCidade.get(chave);

  if (emCache && emCache.expiresAt > agora) {
    const bairrosFiltrados = q
      ? emCache.data.filter((b) => normalizarTexto(b).includes(normalizarTexto(q)))
      : emCache.data;

    return NextResponse.json({
      uf,
      cidade,
      bairros: bairrosFiltrados,
      total: bairrosFiltrados.length,
      cacheTtlMs: BAIRROS_TTL_MS,
      fromCache: true,
    });
  }

  const bairrosLocais = BAIRROS_COMPLEMENTARES[chave] ?? [];

  try {
    const municipios = await carregarMunicipiosPorUf(uf);
    const municipio = municipios.find((m) => normalizarTexto(m.nome) === normalizarTexto(cidade));

    const bairrosIBGE = municipio ? await carregarBairrosIBGE(municipio.id) : [];
    const bairros = mergeUnicoOrdenado(bairrosIBGE, bairrosLocais);

    cacheBairrosPorCidade.set(chave, {
      data: bairros,
      expiresAt: agora + BAIRROS_TTL_MS,
    });

    const bairrosFiltrados = q
      ? bairros.filter((b) => normalizarTexto(b).includes(normalizarTexto(q)))
      : bairros;

    return NextResponse.json({
      uf,
      cidade,
      bairros: bairrosFiltrados,
      total: bairrosFiltrados.length,
      cacheTtlMs: BAIRROS_TTL_MS,
      fromCache: false,
    });
  } catch (error) {
    console.error("[GET /api/admin/localidades/bairros]", error);

    const fallback = mergeUnicoOrdenado(bairrosLocais);
    const bairrosFiltrados = q
      ? fallback.filter((b) => normalizarTexto(b).includes(normalizarTexto(q)))
      : fallback;

    return NextResponse.json(
      {
        uf,
        cidade,
        bairros: bairrosFiltrados,
        total: bairrosFiltrados.length,
        error: "Fonte externa indisponivel no momento."
      },
      { status: 200 }
    );
  }
}
