"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image, { type ImageLoaderProps } from "next/image";

type StatusImovel = "DISPONIVEL" | "RESERVADO" | "VENDIDO" | "LOCADO" | "INATIVO";
type TipoImovel = "APARTAMENTO" | "CASA" | "TERRENO" | "COMERCIAL" | "COBERTURA" | "KITNET" | "RURAL";

type Imovel = {
  id: string;
  codigo: string;
  titulo: string;
  tipo: TipoImovel;
  finalidade: string;
  status: StatusImovel;
  preco: number;
  bairro: string;
  cidade: string;
  quartos: number | null;
  vagas: number | null;
  slugUrl: string;
  visualizacoes: number;
  criadoEm: string;
  fotos: { url: string }[];
};

type Paginacao = {
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
};

const STATUS_LABEL: Record<StatusImovel, string> = {
  DISPONIVEL: "Disponível",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
  LOCADO: "Locado",
  INATIVO: "Inativo",
};

const STATUS_COLOR: Record<StatusImovel, string> = {
  DISPONIVEL: "badge-disponivel",
  RESERVADO: "badge-reservado",
  VENDIDO: "badge-vendido",
  LOCADO: "badge-locado",
  INATIVO: "badge-inativo",
};

const TIPO_LABEL: Record<TipoImovel, string> = {
  APARTAMENTO: "Apto",
  CASA: "Casa",
  TERRENO: "Terreno",
  COMERCIAL: "Comercial",
  COBERTURA: "Cobertura",
  KITNET: "Kitnet",
  RURAL: "Rural",
};

function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function passthroughLoader({ src }: ImageLoaderProps): string {
  return src;
}

export default function AdminImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao | null>(null);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [purgando, setPurgando] = useState<string | null>(null);
  const [modalPurge, setModalPurge] = useState<{ id: string; titulo: string; codigo: string } | null>(null);
  const [ajudaAberta, setAjudaAberta] = useState(false);

  const buscarImoveis = useCallback(async () => {
    setCarregando(true);
    try {
      const params = new URLSearchParams({ pagina: String(pagina) });
      if (busca) params.set("busca", busca);
      if (filtroStatus) params.set("status", filtroStatus);
      if (filtroTipo) params.set("tipo", filtroTipo);

      const res = await fetch(`/api/admin/imoveis?${params}`);
      if (!res.ok) throw new Error("Erro ao buscar imóveis");
      const data = await res.json();
      setImoveis(data.imoveis);
      setPaginacao(data.paginacao);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }, [pagina, busca, filtroStatus, filtroTipo]);

  useEffect(() => {
    buscarImoveis();
  }, [buscarImoveis]);

  async function excluirImovel(id: string, titulo: string) {
    if (!confirm(`Desativar "${titulo}"?\n\nO imóvel será marcado como Inativo e removido do site público.`)) return;
    setExcluindo(id);
    try {
      const res = await fetch(`/api/admin/imoveis/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
      await buscarImoveis();
    } catch (err) {
      alert("Erro ao desativar imóvel.");
      console.error(err);
    } finally {
      setExcluindo(null);
    }
  }

  async function purgarImovel() {
    if (!modalPurge) return;
    setPurgando(modalPurge.id);
    try {
      const res = await fetch(`/api/admin/imoveis/${modalPurge.id}?purge=true`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao purgar");
      setModalPurge(null);
      await buscarImoveis();
    } catch (err) {
      alert("Erro ao excluir permanentemente o imóvel.");
      console.error(err);
    } finally {
      setPurgando(null);
    }
  }

  return (
    <div className="admin-imoveis-page">
      {/* Cabeçalho */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Imóveis</h1>
          {paginacao && (
            <p className="page-subtitle">{paginacao.total} imóvel{paginacao.total !== 1 ? "is" : ""} cadastrado{paginacao.total !== 1 ? "s" : ""}</p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setAjudaAberta((v) => !v)}
            title="Como usar este painel"
            className={ajudaAberta ? "btn-ajuda btn-ajuda--ativo" : "btn-ajuda"}
          >
            ?
          </button>
          <Link href="/admin/imoveis/novo" className="btn-primary">
            + Novo Imóvel
          </Link>
        </div>
      </div>

      {/* Painel de ajuda — visível só após clicar (?) */}
      {ajudaAberta && (
        <div className="info-banner">
          <p className="info-banner-titulo">Como gerenciar seus imóveis</p>
          <ul className="info-banner-lista">
            <li><strong>✏️ Editar</strong> — abre o formulário completo do imóvel para alterar dados, fotos, comodidades e status.</li>
            <li><strong>👁 Ver no site</strong> — abre a landing page pública do imóvel em nova aba.</li>
            <li><strong>🗑 Desativar</strong> — marca o imóvel como <em>Inativo</em> e o remove do site público. Os dados são mantidos e pode ser reativado.</li>
            <li><strong>☠ Excluir permanentemente</strong> — remove o imóvel e todas as fotos do sistema. <em>Essa ação não pode ser desfeita.</em></li>
          </ul>
          <p className="info-banner-dica">💡 Use os filtros de status e tipo para localizar rapidamente um imóvel no acervo.</p>
        </div>
      )}

      {/* Filtros */}
      <div className="filtros-bar">
        <input
          type="search"
          placeholder="Buscar por título, código ou bairro…"
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
          className="input-busca"
        />
        <select
          value={filtroStatus}
          onChange={(e) => { setFiltroStatus(e.target.value); setPagina(1); }}
          className="select-filtro"
        >
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABEL).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={filtroTipo}
          onChange={(e) => { setFiltroTipo(e.target.value); setPagina(1); }}
          className="select-filtro"
        >
          <option value="">Todos os tipos</option>
          {Object.entries(TIPO_LABEL).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      {/* Tabela desktop / Cards mobile */}
      {carregando ? (
        <div className="loading-state">Carregando…</div>
      ) : imoveis.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum imóvel encontrado.</p>
          <Link href="/admin/imoveis/novo" className="btn-primary">Cadastrar primeiro imóvel</Link>
        </div>
      ) : (
        <>
          {/* Tabela — visível em telas >= 768px */}
          <div className="table-wrapper">
            <table className="imoveis-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Código</th>
                  <th>Título / Bairro</th>
                  <th>Tipo</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {imoveis.map((im) => (
                  <tr key={im.id}>
                    <td className="col-foto">
                      {im.fotos[0] ? (
                        <Image
                          loader={passthroughLoader}
                          unoptimized
                          src={im.fotos[0].url}
                          alt={im.titulo}
                          className="thumb"
                          width={56}
                          height={40}
                        />
                      ) : (
                        <div className="thumb-placeholder">◻</div>
                      )}
                    </td>
                    <td className="col-codigo">{im.codigo}</td>
                    <td className="col-titulo">
                      <span className="titulo-linha">{im.titulo}</span>
                      <span className="bairro-linha">{im.bairro}, {im.cidade}</span>
                    </td>
                    <td>{TIPO_LABEL[im.tipo]}</td>
                    <td className="col-preco">{formatarPreco(im.preco)}</td>
                    <td>
                      <span className={`badge ${STATUS_COLOR[im.status]}`}>{STATUS_LABEL[im.status]}</span>
                    </td>
                    <td className="col-acoes">
                      <Link href={`/admin/imoveis/${im.id}/editar`} className="btn-acao-editar" title="Editar">
                        ✏️
                      </Link>
                      <a
                        href={`/imoveis/${im.slugUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-acao-ver"
                        title="Ver no site"
                      >
                        👁
                      </a>
                      <button
                        onClick={() => excluirImovel(im.id, im.titulo)}
                        disabled={excluindo === im.id}
                        className="btn-acao-excluir"
                        title="Desativar"
                      >
                        {excluindo === im.id ? "…" : "🗑"}
                      </button>
                      <button
                        onClick={() => setModalPurge({ id: im.id, titulo: im.titulo, codigo: im.codigo })}
                        disabled={purgando === im.id}
                        className="btn-acao-purge"
                        title="Excluir permanentemente"
                      >
                        ☠
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — visível em mobile */}
          <div className="imoveis-cards">
            {imoveis.map((im) => (
              <div key={im.id} className="imovel-card">
                {im.fotos[0] && (
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={im.fotos[0].url}
                    alt={im.titulo}
                    className="card-foto"
                    width={1200}
                    height={640}
                  />
                )}
                <div className="card-body">
                  <div className="card-header-line">
                    <span className="card-codigo">{im.codigo}</span>
                    <span className={`badge ${STATUS_COLOR[im.status]}`}>{STATUS_LABEL[im.status]}</span>
                  </div>
                  <p className="card-titulo">{im.titulo}</p>
                  <p className="card-bairro">{im.bairro}, {im.cidade}</p>
                  <p className="card-preco">{formatarPreco(im.preco)}</p>
                  <div className="card-acoes">
                    <Link href={`/admin/imoveis/${im.id}/editar`} className="btn-card-editar">Editar</Link>
                    <button
                      onClick={() => excluirImovel(im.id, im.titulo)}
                      disabled={excluindo === im.id}
                      className="btn-card-excluir"
                    >
                      {excluindo === im.id ? "Aguarde…" : "Desativar"}
                    </button>
                    <button
                      onClick={() => setModalPurge({ id: im.id, titulo: im.titulo, codigo: im.codigo })}
                      disabled={purgando === im.id}
                      className="btn-card-purge"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {paginacao && paginacao.totalPaginas > 1 && (
            <div className="paginacao">
              <button
                onClick={() => setPagina((p) => p - 1)}
                disabled={pagina <= 1}
                className="btn-pagina"
              >
                ← Anterior
              </button>
              <span className="pagina-info">
                Página {pagina} de {paginacao.totalPaginas}
              </span>
              <button
                onClick={() => setPagina((p) => p + 1)}
                disabled={pagina >= paginacao.totalPaginas}
                className="btn-pagina"
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal Purge */}
      {modalPurge && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModalPurge(null); }}>
          <div className="modal-purge" role="dialog" aria-modal="true" aria-labelledby="modal-purge-title">
            <div className="modal-purge-icon">☠️</div>
            <h2 id="modal-purge-title">Excluir permanentemente</h2>
            <div className="modal-purge-aviso">
              <strong>Esta ação não pode ser desfeita.</strong>
              O imóvel <strong>{modalPurge.codigo}</strong> — <em>{modalPurge.titulo}</em> e todas as suas fotos serão excluídos permanentemente do sistema.
            </div>
            <div className="modal-purge-acoes">
              <button
                onClick={() => setModalPurge(null)}
                className="btn-cancelar-purge"
                disabled={purgando === modalPurge.id}
              >
                Cancelar
              </button>
              <button
                onClick={purgarImovel}
                className="btn-confirmar-purge"
                disabled={purgando === modalPurge.id}
              >
                {purgando === modalPurge.id ? "Excluindo…" : "Excluir permanentemente"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-imoveis-page { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }

        .info-banner { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 0.85rem 1rem; margin-bottom: 1.25rem; }
        .info-banner-titulo { font-weight: 700; font-size: 0.82rem; color: #1d4ed8; margin: 0 0 0.35rem; }
        .info-banner-lista { margin: 0; padding: 0 0 0 1.1rem; font-size: 0.8rem; color: #1e40af; line-height: 1.7; }
        .info-banner-dica { font-size: 0.78rem; color: #1e40af; margin: 0.45rem 0 0; }

        .btn-ajuda { height: 28px; width: 28px; border-radius: 50%; border: 1.5px solid #9ca3af; background: #fff; color: #6b7280; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s, color 0.15s; }
        .btn-ajuda--ativo { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }

        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
        .page-subtitle { font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0 0; }

        .btn-primary { background: #2563eb; color: #fff; padding: 0.5rem 1.25rem; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 0.875rem; white-space: nowrap; }
        .btn-primary:hover { background: #1d4ed8; }

        .filtros-bar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .input-busca { flex: 1; min-width: 200px; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; }
        .select-filtro { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; background: #fff; }

        .loading-state, .empty-state { text-align: center; padding: 3rem 1rem; color: #6b7280; display: flex; flex-direction: column; align-items: center; gap: 1rem; }

        /* Tabela */
        .table-wrapper { overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 8px; display: none; }
        .imoveis-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .imoveis-table th { background: #f9fafb; padding: 0.75rem 1rem; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb; white-space: nowrap; }
        .imoveis-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
        .imoveis-table tr:last-child td { border-bottom: none; }
        .imoveis-table tr:hover td { background: #f9fafb; }

        .thumb { width: 56px; height: 40px; object-fit: cover; border-radius: 4px; }
        .thumb-placeholder { width: 56px; height: 40px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9ca3af; }
        .col-codigo { white-space: nowrap; font-family: monospace; font-size: 0.8rem; color: #6b7280; }
        .col-titulo { min-width: 200px; }
        .titulo-linha { display: block; font-weight: 500; }
        .bairro-linha { display: block; font-size: 0.8rem; color: #6b7280; margin-top: 2px; }
        .col-preco { white-space: nowrap; font-weight: 600; }
        .col-acoes { white-space: nowrap; }

        .btn-acao-editar, .btn-acao-ver, .btn-acao-excluir { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; text-decoration: none; }
        .btn-acao-editar:hover { background: #dbeafe; }
        .btn-acao-ver:hover { background: #dcfce7; }
        .btn-acao-excluir:hover { background: #fee2e2; }
        .btn-acao-excluir:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-acao-purge { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; text-decoration: none; color: #dc2626; }
        .btn-acao-purge:hover { background: #fee2e2; }
        .btn-acao-purge:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Badges */
        .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .badge-disponivel { background: #dcfce7; color: #166534; }
        .badge-reservado { background: #fef9c3; color: #854d0e; }
        .badge-vendido { background: #dbeafe; color: #1e40af; }
        .badge-locado { background: #e0e7ff; color: #3730a3; }
        .badge-inativo { background: #f3f4f6; color: #6b7280; }

        /* Cards mobile */
        .imoveis-cards { display: flex; flex-direction: column; gap: 1rem; }
        .imovel-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #fff; }
        .card-foto { width: 100%; height: 160px; object-fit: cover; }
        .card-body { padding: 0.875rem 1rem; }
        .card-header-line { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
        .card-codigo { font-family: monospace; font-size: 0.8rem; color: #6b7280; }
        .card-titulo { font-weight: 600; margin: 0 0 0.25rem; }
        .card-bairro { font-size: 0.875rem; color: #6b7280; margin: 0 0 0.5rem; }
        .card-preco { font-weight: 700; font-size: 1rem; margin: 0 0 0.75rem; }
        .card-acoes { display: flex; gap: 0.5rem; }
        .btn-card-editar { flex: 1; text-align: center; padding: 0.5rem; border-radius: 6px; background: #2563eb; color: #fff; font-weight: 600; text-decoration: none; font-size: 0.875rem; }
        .btn-card-excluir { flex: 1; padding: 0.5rem; border-radius: 6px; background: #fee2e2; color: #dc2626; font-weight: 600; border: none; cursor: pointer; font-size: 0.875rem; }
        .btn-card-excluir:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-card-purge { flex: 1; padding: 0.5rem; border-radius: 6px; background: #dc2626; color: #fff; font-weight: 600; border: none; cursor: pointer; font-size: 0.875rem; }
        .btn-card-purge:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Modal Purge */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
        .modal-purge { background: #fff; border-radius: 12px; padding: 1.5rem; max-width: 480px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .modal-purge-icon { font-size: 2.5rem; text-align: center; margin-bottom: 0.75rem; }
        .modal-purge h2 { font-size: 1.125rem; font-weight: 700; text-align: center; margin: 0 0 0.75rem; color: #dc2626; }
        .modal-purge-aviso { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 0.875rem 1rem; font-size: 0.875rem; color: #7f1d1d; margin-bottom: 1.25rem; line-height: 1.5; }
        .modal-purge-aviso strong { display: block; margin-bottom: 0.25rem; }
        .modal-purge-acoes { display: flex; gap: 0.75rem; justify-content: flex-end; }
        .btn-cancelar-purge { padding: 0.5rem 1.25rem; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; font-weight: 600; cursor: pointer; font-size: 0.875rem; }
        .btn-cancelar-purge:hover { background: #f3f4f6; }
        .btn-confirmar-purge { padding: 0.5rem 1.25rem; border-radius: 6px; background: #dc2626; color: #fff; font-weight: 600; border: none; cursor: pointer; font-size: 0.875rem; }
        .btn-confirmar-purge:hover:not(:disabled) { background: #b91c1c; }
        .btn-confirmar-purge:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Paginação */
        .paginacao { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
        .btn-pagina { padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; cursor: pointer; font-size: 0.875rem; }
        .btn-pagina:hover:not(:disabled) { background: #f3f4f6; }
        .btn-pagina:disabled { opacity: 0.4; cursor: not-allowed; }
        .pagina-info { font-size: 0.875rem; color: #6b7280; }

        /* Breakpoints */
        @media (min-width: 768px) {
          .table-wrapper { display: block; }
          .imoveis-cards { display: none; }
        }

        @media (max-width: 640px) {
          .admin-imoveis-page { padding: 1rem; }
          .page-title { font-size: 1.3rem; }
          .btn-primary { width: 100%; text-align: center; }
          .filtros-bar { flex-direction: column; }
          .input-busca { min-width: 0; width: 100%; }
          .select-filtro { width: 100%; }
          .card-acoes { flex-wrap: wrap; }
          .btn-card-editar,
          .btn-card-excluir,
          .btn-card-purge { min-width: calc(50% - 0.25rem); }
          .modal-purge-acoes { flex-direction: column; }
          .btn-cancelar-purge,
          .btn-confirmar-purge { width: 100%; }
        }
      `}</style>
    </div>
  );
}
