"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/app/_components/SiteHeader";

type StatusImovel = "DISPONIVEL" | "RESERVADO" | "VENDIDO" | "LOCADO" | "INATIVO";

type ImovelCard = {
  id: string;
  codigo: string;
  titulo: string;
  tipo: string;
  finalidade: string;
  status: StatusImovel;
  preco: number;
  bairro: string;
  cidade: string;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  area: number | null;
  slugUrl: string;
  fotos: { id: string; url: string }[];
};

type ApiResponse = {
  imoveis: ImovelCard[];
  paginacao: {
    total: number;
    pagina: number;
    totalPaginas: number;
  };
};

const FINALIDADES = ["VENDA", "ALUGUEL", "AMBOS"] as const;
const TIPOS = ["APARTAMENTO", "CASA", "TERRENO", "COMERCIAL", "COBERTURA", "KITNET", "RURAL"] as const;

const BAIRRO_SLUG_MAP: Record<string, string> = {
  campolim: "Campolim",
  centro: "Centro",
  eden: "Eden",
  "wanel-ville": "Wanel Ville",
  "alem-ponte": "Alem Ponte",
  aparecidinha: "Aparecidinha",
  "jardim-paulistano": "Jardim Paulistano",
  "santa-rosalia": "Santa Rosalia",
};

const STATUS_LABEL: Record<StatusImovel, string> = {
  DISPONIVEL: "Disponivel",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
  LOCADO: "Locado",
  INATIVO: "Inativo",
};

function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function normalizarEnum<T extends string>(valor: string | null, permitidos: readonly T[]): T | "" {
  if (!valor) return "";
  const candidato = valor.trim().toUpperCase() as T;
  return permitidos.includes(candidato) ? candidato : "";
}

function normalizarTextoLocal(valor: string | null): string {
  if (!valor) return "";
  const decodificado = decodeURIComponent(valor).trim().replace(/\+/g, " ");
  if (!decodificado) return "";
  const slug = decodificado.toLowerCase();
  if (BAIRRO_SLUG_MAP[slug]) return BAIRRO_SLUG_MAP[slug];
  return decodificado.replace(/-/g, " ");
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<main className="imoveis-page"><p className="estado">Carregando imóveis...</p></main>}>
      <PropertiesPageContent />
    </Suspense>
  );
}

function PropertiesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [imoveis, setImoveis] = useState<ImovelCard[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [total, setTotal] = useState(0);

  const filtros = useMemo(
    () => ({
      finalidade: normalizarEnum(searchParams.get("finalidade"), FINALIDADES),
      tipo: normalizarEnum(searchParams.get("tipo"), TIPOS),
      bairro: normalizarTextoLocal(searchParams.get("bairro")),
      q: normalizarTextoLocal(searchParams.get("busca")),
    }),
    [searchParams]
  );

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const qs = searchParams.toString();
        const res = await fetch(`/api/imoveis${qs ? `?${qs}` : ""}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Erro ao carregar imóveis");
        const data = (await res.json()) as ApiResponse;
        if (!ativo) return;
        setImoveis(data.imoveis ?? []);
        setTotal(data.paginacao?.total ?? 0);
      } catch {
        if (!ativo) return;
        setErro("Não foi possível carregar os imóveis no momento.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [searchParams]);

  function atualizarFiltro(chave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(chave, valor);
    else params.delete(chave);
    params.delete("pagina");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <main className="imoveis-page">
      <SiteHeader />

      <section className="imoveis-shell">
        <div className="imoveis-heading">
          <p className="eyebrow">Imóveis</p>
          <h1>Imóveis em Sorocaba e região</h1>
          <p>Busca com filtros e URL compartilhável para facilitar o atendimento.</p>
        </div>

        <div className="imoveis-filtros" aria-label="Filtros de imóveis">
          <input
            type="search"
            placeholder="Código, bairro ou palavra-chave"
            value={filtros.q}
            onChange={(e) => atualizarFiltro("busca", e.target.value)}
          />
          <select value={filtros.finalidade} onChange={(e) => atualizarFiltro("finalidade", e.target.value)}>
            <option value="">Comprar ou alugar</option>
            <option value="VENDA">Comprar</option>
            <option value="ALUGUEL">Alugar</option>
            <option value="AMBOS">Ambos</option>
          </select>
          <select value={filtros.tipo} onChange={(e) => atualizarFiltro("tipo", e.target.value)}>
            <option value="">Todos os tipos</option>
            <option value="APARTAMENTO">Apartamento</option>
            <option value="CASA">Casa</option>
            <option value="TERRENO">Terreno</option>
            <option value="COMERCIAL">Comercial</option>
            <option value="COBERTURA">Cobertura</option>
            <option value="KITNET">Kitnet</option>
            <option value="RURAL">Rural</option>
          </select>
          <input
            type="text"
            placeholder="Bairro"
            value={filtros.bairro}
            onChange={(e) => atualizarFiltro("bairro", e.target.value)}
          />
        </div>

        {carregando && <p className="estado">Carregando imóveis...</p>}
        {erro && <p className="erro">{erro}</p>}

        {!carregando && !erro && (
          <>
            <p className="resultado">{total} imóvel(is) encontrado(s)</p>

            {imoveis.length === 0 ? (
              <div className="estado-vazio">
                <p>Nenhum imóvel encontrado para os filtros selecionados.</p>
                <button type="button" onClick={() => router.replace(pathname)}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="imoveis-grid">
                {imoveis.map((imovel) => (
                  <Link key={imovel.id} href={`/imoveis/${imovel.slugUrl}`} className="imovel-card">
                    <div className="imovel-card-img">
                      {imovel.fotos[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imovel.fotos[0].url} alt={imovel.titulo} loading="lazy" />
                      ) : (
                        <div className="sem-foto">Sem foto</div>
                      )}
                      {imovel.status !== "DISPONIVEL" && (
                        <span className={`badge-status badge-${imovel.status.toLowerCase()}`}>
                          {STATUS_LABEL[imovel.status]}
                        </span>
                      )}
                    </div>

                    <div className="imovel-card-body">
                      <p className="codigo">{imovel.codigo}</p>
                      <h2>{imovel.titulo}</h2>
                      <p className="preco">{formatarPreco(imovel.preco)}</p>
                      <p className="local">{imovel.bairro}, {imovel.cidade}</p>
                      <div className="meta">
                        <span>{imovel.area ? `${imovel.area} m²` : "-"}</span>
                        <span>{imovel.quartos ?? "-"}q</span>
                        <span>{imovel.banheiros ?? "-"}b</span>
                        <span>{imovel.vagas ?? "-"}v</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <style>{`
        .imoveis-page { min-height: 100vh; background: var(--color-bg); }
        .imoveis-shell { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 54px; }
        .imoveis-heading h1 { margin-bottom: 8px; }
        .imoveis-heading p { color: var(--color-text-muted); }
        .imoveis-filtros {
          margin-top: 22px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 10px;
        }
        .imoveis-filtros input,
        .imoveis-filtros select {
          min-height: 44px;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          background: var(--color-surface);
          padding: 0 12px;
          color: var(--color-text);
        }
        .resultado { margin: 18px 0 12px; font-size: 0.88rem; color: var(--color-text-muted); }
        .estado, .erro { margin-top: 18px; }
        .erro { color: #b91c1c; }
        .estado-vazio {
          margin-top: 18px;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          background: var(--color-surface);
          padding: 16px;
        }
        .estado-vazio button {
          margin-top: 10px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-bg);
          min-height: 38px;
          padding: 0 12px;
          cursor: pointer;
        }
        .imoveis-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .imovel-card {
          border: 1px solid var(--color-border);
          border-radius: 12px;
          background: var(--color-surface);
          overflow: hidden;
          color: inherit;
          text-decoration: none;
        }
        .imovel-card-img {
          position: relative;
          aspect-ratio: 4 / 3;
          background: var(--color-surface-muted);
        }
        .imovel-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .sem-foto {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          font-size: 0.84rem;
        }
        .badge-status {
          position: absolute;
          top: 10px;
          left: 10px;
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .badge-reservado { background: #fef3c7; color: #92400e; }
        .badge-vendido { background: #dbeafe; color: #1e3a8a; }
        .badge-locado { background: #dcfce7; color: #14532d; }
        .imovel-card-body { padding: 12px; }
        .codigo { margin: 0; font-size: 0.76rem; color: var(--color-text-muted); }
        .imovel-card h2 {
          margin: 4px 0 8px;
          font-size: 1rem;
          line-height: 1.3;
        }
        .preco { margin: 0 0 6px; font-weight: 800; color: var(--color-primary); }
        .local { margin: 0 0 9px; font-size: 0.85rem; color: var(--color-text-muted); }
        .meta { display: flex; gap: 8px; color: var(--color-text-muted); font-size: 0.8rem; }

        @media (max-width: 980px) {
          .imoveis-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .imoveis-filtros { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 620px) {
          .imoveis-shell { width: min(1180px, calc(100% - 22px)); padding-top: 20px; }
          .imoveis-grid { grid-template-columns: 1fr; }
          .imoveis-filtros { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
