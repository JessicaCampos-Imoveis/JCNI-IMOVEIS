"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type ComodidadeItem = {
  id: string;
  nome: string;
  icone: string | null;
  categoriaId: string;
};

type CategoriaComodidade = {
  id: string;
  nome: string;
  icone: string | null;
  ordem: number;
  itens: ComodidadeItem[];
};

export default function AdminComodidadesPage() {
  const [categorias, setCategorias] = useState<CategoriaComodidade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [ajudaAberta, setAjudaAberta] = useState(false);

  const [novaCategoria, setNovaCategoria] = useState("");
  const [novoItemNome, setNovoItemNome] = useState("");
  const [novoItemCategoria, setNovoItemCategoria] = useState("");

  const [salvandoCategoria, setSalvandoCategoria] = useState(false);
  const [salvandoItem, setSalvandoItem] = useState(false);

  const carregarCategorias = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/admin/comodidades/categorias");
      if (!res.ok) throw new Error("Erro ao carregar comodidades");
      const data = (await res.json()) as CategoriaComodidade[];
      setCategorias(data);
      if (data.length > 0 && !novoItemCategoria) {
        setNovoItemCategoria(data[0].id);
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar comodidades");
    } finally {
      setCarregando(false);
    }
  }, [novoItemCategoria]);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  async function criarCategoria() {
    const nome = novaCategoria.trim();
    if (!nome) return;
    setSalvandoCategoria(true);
    try {
      const res = await fetch("/api/admin/comodidades/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao criar categoria");
      }
      setNovaCategoria("");
      await carregarCategorias();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao criar categoria");
    } finally {
      setSalvandoCategoria(false);
    }
  }

  async function editarCategoria(cat: CategoriaComodidade) {
    const nome = prompt("Novo nome da categoria:", cat.nome);
    if (!nome || nome.trim() === cat.nome) return;

    const res = await fetch(`/api/admin/comodidades/categorias/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome.trim() }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Erro ao atualizar categoria");
      return;
    }

    await carregarCategorias();
  }

  async function excluirCategoria(cat: CategoriaComodidade) {
    if (!confirm(`Excluir categoria \"${cat.nome}\"?`)) return;

    const res = await fetch(`/api/admin/comodidades/categorias/${cat.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Erro ao excluir categoria");
      return;
    }

    await carregarCategorias();
  }

  async function criarItem() {
    const nome = novoItemNome.trim();
    if (!nome || !novoItemCategoria) return;

    setSalvandoItem(true);
    try {
      const res = await fetch("/api/admin/comodidades/itens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, categoriaId: novoItemCategoria }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao criar item");
      }
      setNovoItemNome("");
      await carregarCategorias();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao criar item");
    } finally {
      setSalvandoItem(false);
    }
  }

  async function editarItem(item: ComodidadeItem) {
    const nome = prompt("Novo nome do item:", item.nome);
    if (!nome || nome.trim() === item.nome) return;

    const res = await fetch(`/api/admin/comodidades/itens/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome.trim() }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Erro ao atualizar item");
      return;
    }

    await carregarCategorias();
  }

  async function excluirItem(item: ComodidadeItem) {
    if (!confirm(`Excluir item \"${item.nome}\"?`)) return;

    const res = await fetch(`/api/admin/comodidades/itens/${item.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Erro ao excluir item");
      return;
    }

    await carregarCategorias();
  }

  const termoBusca = busca.trim().toLowerCase();
  const resumoCategorias = categorias.map((cat) => ({
    id: cat.id,
    nome: cat.nome,
    total: cat.itens.length,
  }));

  const resultadosBusca =
    termoBusca.length === 0
      ? []
      : categorias.flatMap((cat) =>
          cat.itens
            .filter((item) => item.nome.toLowerCase().includes(termoBusca))
            .map((item) => ({ item, categoria: cat }))
        );

  return (
    <div className="admin-comodidades-page">
      <div className="header-shell" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
        <div>
          <Link href="/admin" className="breadcrumb">← Dashboard</Link>
          <h1>Comodidades</h1>
          <p>Gerencie as categorias e itens de comodidade que podem ser vinculados a cada imóvel no cadastro.</p>
        </div>
        <button
          type="button"
          onClick={() => setAjudaAberta((v) => !v)}
          title="Como usar este painel"
          style={{ marginTop: "0.25rem", height: 28, width: 28, borderRadius: "50%", border: `1.5px solid ${ajudaAberta ? "#1d4ed8" : "#9ca3af"}`, background: ajudaAberta ? "#1d4ed8" : "#fff", color: ajudaAberta ? "#fff" : "#6b7280", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >?</button>
      </div>

      {/* Painel de ajuda — visível so apos clicar (?) */}
      {ajudaAberta && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "0.85rem 1rem", marginBottom: "1.25rem" }}>
          <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#1d4ed8", margin: "0 0 0.35rem" }}>Como funciona</p>
          <ul style={{ margin: 0, padding: "0 0 0 1.1rem", fontSize: "0.8rem", color: "#1e40af", lineHeight: 1.7 }}>
            <li><strong>Categorias</strong> agrupam comodidades relacionadas (ex: &ldquo;Lazer&rdquo;, &ldquo;Segurança&rdquo;, &ldquo;Infraestrutura&rdquo;).</li>
            <li><strong>Itens</strong> são as comodidades individuais (ex: &ldquo;Piscina&rdquo;, &ldquo;Academia&rdquo;, &ldquo;Portaria 24h&rdquo;).</li>
            <li>Na edição de um imóvel, você poderá marcar quais dessas comodidades ele possui — elas aparecem na página pública do imóvel.</li>
            <li>Para excluir uma categoria, remova primeiro todos os itens vinculados a ela.</li>
          </ul>
        </div>
      )}

      <section className="top-controls" aria-label="Busca e cadastro rápido">
        <div className="busca-wrap">
          <label htmlFor="busca-comodidade">Buscar comodidade ou categoria</label>
          <input
            id="busca-comodidade"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar comodidade..."
            className="input"
          />
        </div>

        <div className="cadastro-rapido">
          <div className="cadastro-item">
            <label htmlFor="nova-categoria">Nova categoria</label>
            <div className="linha-inline">
              <input
                id="nova-categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                placeholder="Nome da categoria"
                className="input"
              />
              <button onClick={criarCategoria} className="btn-primary" disabled={salvandoCategoria}>
                {salvandoCategoria ? "Salvando..." : "Adicionar"}
              </button>
            </div>
          </div>

          <div className="cadastro-item grow">
            <label htmlFor="novo-item">Nova comodidade</label>
            <div className="linha-inline linha-item">
              <input
                id="novo-item"
                value={novoItemNome}
                onChange={(e) => setNovoItemNome(e.target.value)}
                placeholder="Nome da comodidade"
                className="input"
              />
              <select
                value={novoItemCategoria}
                onChange={(e) => setNovoItemCategoria(e.target.value)}
                className="input"
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
              <button onClick={criarItem} className="btn-primary" disabled={salvandoItem || categorias.length === 0}>
                {salvandoItem ? "Salvando..." : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {carregando && <p className="estado">Carregando...</p>}
      {erro && <p className="erro">{erro}</p>}

      {!carregando && categorias.length === 0 && (
        <p className="estado">Nenhuma categoria cadastrada.</p>
      )}

      {!carregando && categorias.length > 0 && (
        <section className="resumo-categorias" aria-label="Resumo por categoria">
          {resumoCategorias.map((cat) => (
            <div key={cat.id} className="resumo-chip">
              <span>{cat.nome}</span>
              <strong>{cat.total}</strong>
            </div>
          ))}
        </section>
      )}

      {!carregando && categorias.length > 0 && (
        <div className="categorias-lista" aria-live="polite">
          {termoBusca ? (
            <section className="categoria-card busca-card">
              <div className="categoria-header busca-header">
                <h3>Resultados para &quot;{busca}&quot;</h3>
                <span>{resultadosBusca.length} encontrado(s)</span>
              </div>

              {resultadosBusca.length === 0 ? (
                <p className="sem-itens">Nenhuma comodidade encontrada.</p>
              ) : (
                <ul className="itens-lista compacta">
                  {resultadosBusca.map(({ item, categoria }) => (
                    <li key={`${categoria.id}-${item.id}`} className="item-linha slim">
                      <div className="item-main">
                        <span className="item-name">{item.nome}</span>
                        <span className="item-categoria">{categoria.nome}</span>
                      </div>
                      <details className="acoes-menu">
                        <summary aria-label={`Ações para ${item.nome}`}>⋮</summary>
                        <div className="menu-popover">
                          <button onClick={() => editarItem(item)}>Editar</button>
                          <button className="danger" onClick={() => excluirItem(item)}>Excluir</button>
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : (
            categorias.map((cat) => (
              <details key={cat.id} className="categoria-card accordion">
                <summary className="categoria-summary">
                  <div className="summary-main">
                    <span className="summary-arrow" aria-hidden="true">▸</span>
                    <h3>{cat.nome}</h3>
                    <span className="contador">{cat.itens.length} itens</span>
                  </div>
                  <div className="summary-actions" onClick={(e) => e.preventDefault()}>
                    <details className="acoes-menu categoria-menu">
                      <summary aria-label={`Ações da categoria ${cat.nome}`}>⋮</summary>
                      <div className="menu-popover">
                        <button onClick={() => editarCategoria(cat)}>Editar categoria</button>
                        <button className="danger" onClick={() => excluirCategoria(cat)}>Excluir categoria</button>
                      </div>
                    </details>
                  </div>
                </summary>

                {cat.itens.length === 0 ? (
                  <p className="sem-itens">Sem itens nesta categoria.</p>
                ) : (
                  <ul className="itens-lista compacta">
                    {cat.itens.map((item) => (
                      <li key={item.id} className="item-linha slim">
                        <span className="item-name">{item.nome}</span>
                        <details className="acoes-menu">
                          <summary aria-label={`Ações para ${item.nome}`}>⋮</summary>
                          <div className="menu-popover">
                            <button onClick={() => editarItem(item)}>Editar</button>
                            <button className="danger" onClick={() => excluirItem(item)}>Excluir</button>
                          </div>
                        </details>
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            ))
          )}
        </div>
      )}

      <style>{`
        .admin-comodidades-page { padding: 1.5rem; max-width: 1160px; margin: 0 auto; }
        .header-shell { margin-bottom: 1rem; }
        .breadcrumb { font-size: 0.81rem; color: #6b7280; text-decoration: none; display: inline-block; margin-bottom: 0.45rem; }
        .breadcrumb:hover { color: #374151; }
        h1 { margin: 0; font-size: 1.72rem; color: #1f2937; }
        .header-shell p { margin: 0.3rem 0 0; color: #6b7280; font-size: 0.9rem; }

        .top-controls {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
          padding: 0.95rem;
          display: grid;
          gap: 0.8rem;
          margin-bottom: 0.9rem;
        }
        .busca-wrap,
        .cadastro-item { display: grid; gap: 0.32rem; }
        .busca-wrap label,
        .cadastro-item label { font-size: 0.76rem; color: #6b7280; font-weight: 600; }
        .cadastro-rapido { display: grid; gap: 0.7rem; }
        .linha-inline { display: flex; align-items: center; gap: 0.5rem; }
        .linha-item { flex-wrap: wrap; }
        .grow { min-width: 0; }
        .input {
          min-height: 38px;
          padding: 0 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.88rem;
          background: #fff;
          color: #111827;
          min-width: 0;
          flex: 1;
        }
        .btn-primary {
          min-height: 38px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: #fff;
          font-size: 0.84rem;
          font-weight: 600;
          padding: 0 0.9rem;
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .resumo-categorias { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.75rem; }
        .resumo-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.42rem;
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          padding: 0.35rem 0.62rem;
          background: #f9fafb;
          font-size: 0.77rem;
          color: #4b5563;
        }
        .resumo-chip strong {
          display: inline-flex;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 999px;
          align-items: center;
          justify-content: center;
          background: #dbeafe;
          color: #1e40af;
          font-size: 0.72rem;
        }

        .estado { color: #6b7280; font-size: 0.9rem; margin-top: 0.8rem; }
        .erro {
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          margin-top: 0.8rem;
          font-size: 0.86rem;
        }

        .categorias-lista { display: grid; gap: 0.6rem; }
        .categoria-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
          overflow: hidden;
        }
        .busca-card { padding: 0.8rem 0.85rem; }
        .busca-header { padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 0.55rem; }

        .accordion > summary {
          list-style: none;
          cursor: pointer;
        }
        .accordion > summary::-webkit-details-marker { display: none; }
        .categoria-summary {
          padding: 0.78rem 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.65rem;
        }
        .summary-main { display: inline-flex; align-items: center; gap: 0.5rem; min-width: 0; }
        .summary-main h3 {
          margin: 0;
          font-size: 0.96rem;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .summary-arrow { color: #6b7280; font-size: 0.7rem; transition: transform 0.15s ease; }
        .accordion[open] .summary-arrow { transform: rotate(90deg); }
        .contador {
          font-size: 0.77rem;
          color: #4b5563;
          background: #f3f4f6;
          border-radius: 999px;
          padding: 0.22rem 0.45rem;
        }

        .itens-lista { list-style: none; margin: 0; padding: 0; }
        .itens-lista.compacta { border-top: 1px solid #f1f5f9; }
        .item-linha {
          padding: 0.55rem 0.85rem;
          border-top: 1px solid #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .item-linha:first-child { border-top: none; }
        .item-linha.slim { min-height: 38px; }
        .item-main { display: grid; gap: 0.15rem; }
        .item-name { color: #111827; font-size: 0.88rem; }
        .item-categoria { color: #6b7280; font-size: 0.73rem; }
        .sem-itens { color: #9ca3af; margin: 0; padding: 0.75rem 0.85rem; font-size: 0.85rem; }

        .acoes-menu {
          position: relative;
        }
        .acoes-menu > summary {
          list-style: none;
          cursor: pointer;
          color: #6b7280;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.92rem;
          user-select: none;
          background: #fff;
        }
        .acoes-menu > summary::-webkit-details-marker { display: none; }
        .menu-popover {
          position: absolute;
          top: 34px;
          right: 0;
          z-index: 10;
          min-width: 140px;
          display: grid;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          box-shadow: 0 12px 28px rgba(17, 24, 39, 0.12);
          overflow: hidden;
        }
        .menu-popover button {
          border: none;
          background: #fff;
          color: #111827;
          text-align: left;
          padding: 0.55rem 0.7rem;
          font-size: 0.82rem;
          cursor: pointer;
        }
        .menu-popover button:hover { background: #f9fafb; }
        .menu-popover button.danger { color: #b91c1c; }
        .categoria-menu .menu-popover { min-width: 180px; }

        @media (min-width: 940px) {
          .cadastro-rapido {
            grid-template-columns: 1fr 1.6fr;
            align-items: end;
          }
        }

        @media (max-width: 640px) {
          .admin-comodidades-page { padding: 1rem; }
          h1 { font-size: 1.42rem; }
          .linha-inline { flex-direction: column; align-items: stretch; }
          .btn-primary { width: 100%; }
          .input { width: 100%; }
          .categoria-summary { padding: 0.72rem 0.72rem; }
          .item-linha { padding: 0.5rem 0.72rem; }
        }
      `}</style>
    </div>
  );
}
