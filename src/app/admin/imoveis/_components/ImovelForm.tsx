"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ImovelFormData = {
  titulo: string;
  descricao: string;
  tipo: string;
  finalidade: string;
  status: string;
  preco: string;
  precoCondominio: string;
  iptu: string;
  bairro: string;
  cidade: string;
  estado: string;
  nomeCondominio: string;
  area: string;
  areaUtil: string;
  quartos: string;
  suites: string;
  banheiros: string;
  vagas: string;
  videoYoutube: string;
  nomeProprietario: string;
  telefoneProprietario: string;
  emailProprietario: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  andar: string;
  observacoesInternas: string;
  // SEO
  metaTitulo: string;
  metaDescricao: string;
  slugUrl: string;
  altTexto: string;
  comodidadeIds: string[];
};

export const FORM_INICIAL: ImovelFormData = {
  titulo: "",
  descricao: "",
  tipo: "APARTAMENTO",
  finalidade: "VENDA",
  status: "DISPONIVEL",
  preco: "",
  precoCondominio: "",
  iptu: "",
  bairro: "",
  cidade: "Sorocaba",
  estado: "SP",
  nomeCondominio: "",
  area: "",
  areaUtil: "",
  quartos: "",
  suites: "",
  banheiros: "",
  vagas: "",
  videoYoutube: "",
  nomeProprietario: "",
  telefoneProprietario: "",
  emailProprietario: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  andar: "",
  observacoesInternas: "",
  metaTitulo: "",
  metaDescricao: "",
  slugUrl: "",
  altTexto: "",
  comodidadeIds: [],
};

// ─── Tipo foto carregada do servidor ─────────────────────────────────────────

type FotoExistente = {
  id: string;
  url: string;
  ordem: number;
  destaque: boolean;
  watermark: boolean;
};

type CategoriaComodidadeForm = {
  id: string;
  nome: string;
  itens: { id: string; nome: string }[];
};

type Props = {
  values: ImovelFormData;
  imovelId?: string;
  onChange: (updated: Partial<ImovelFormData>) => void;
};

type Aba = "basico" | "detalhes" | "endereco" | "proprietario" | "fotos" | "seo";

const ABAS: { id: Aba; label: string }[] = [
  { id: "basico", label: "Basico" },
  { id: "detalhes", label: "Detalhes" },
  { id: "endereco", label: "Endereco" },
  { id: "proprietario", label: "Proprietario" },
  { id: "fotos", label: "Fotos" },
  { id: "seo", label: "SEO" },
];

function CampoTexto({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  name: keyof ImovelFormData;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="campo">
      <label className="campo-label">
        {label}
        {required && <span className="campo-req">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="campo-input"
      />
      {hint && <span className="campo-hint">{hint}</span>}
    </div>
  );
}

type IbgeMunicipio = { id: number; nome: string };

function normalizarTexto(v: string): string {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function CampoCidadeIBGE({
  value,
  estado,
  onChange,
  required,
}: {
  value: string;
  estado: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [cidades, setCidades] = useState<IbgeMunicipio[]>([]);
  const [sugestoes, setSugestoes] = useState<IbgeMunicipio[]>([]);
  const [aberto, setAberto] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const uf = (estado || "SP").toUpperCase();
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then((r) => r.json())
      .then((data: IbgeMunicipio[]) => {
        if (Array.isArray(data)) {
          setCidades(data.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
        }
      })
      .catch(() => {
        setCidades([]);
      });
  }, [estado]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleInput(v: string) {
    onChange(v);
    if (v.length >= 2 && cidades.length > 0) {
      const q = normalizarTexto(v);
      setSugestoes(cidades.filter((c) => normalizarTexto(c.nome).includes(q)).slice(0, 8));
      setAberto(true);
    } else {
      setSugestoes([]);
      setAberto(false);
    }
  }

  function selecionar(cidade: string) {
    onChange(cidade);
    setSugestoes([]);
    setAberto(false);
  }

  return (
    <div className="campo" ref={wrapRef} style={{ position: "relative" }}>
      <label className="campo-label">
        Cidade{required && <span className="campo-req">*</span>}
      </label>
      <input
        type="text"
        name="cidade"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => {
          if (value.length >= 2 && sugestoes.length > 0) setAberto(true);
        }}
        required={required}
        placeholder="Digite ou selecione a cidade"
        className="campo-input"
        autoComplete="off"
      />
      {aberto && sugestoes.length > 0 && (
        <ul style={{
          position: "absolute",
          zIndex: 50,
          top: "100%",
          left: 0,
          right: 0,
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          listStyle: "none",
          margin: "2px 0 0",
          padding: "4px 0",
          maxHeight: 220,
          overflowY: "auto",
        }}>
          {sugestoes.map((c) => (
            <li
              key={c.id}
              onMouseDown={(e) => { e.preventDefault(); selecionar(c.nome); }}
              style={{
                padding: "8px 14px",
                fontSize: "0.85rem",
                cursor: "pointer",
                color: "#1e293b",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              {c.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Campo Bairro com autocomplete via IBGE (dependente da cidade) ─────────
function CampoBairroIBGE({
  value,
  cidade,
  estado,
  onChange,
  required,
}: {
  value: string;
  cidade: string;
  estado: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [bairros, setBairros] = useState<string[]>([]);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Carrega bairros a partir da cidade/UF escolhidas.
  useEffect(() => {
    const cidadeTrim = cidade.trim();
    if (!cidadeTrim) {
      setBairros([]);
      setSugestoes([]);
      setAberto(false);
      return;
    }

    const uf = (estado || "SP").toUpperCase();
    const cidadeNorm = normalizarTexto(cidadeTrim);
    let cancelado = false;
    setCarregando(true);

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then((r) => r.json())
      .then((municipios: IbgeMunicipio[]) => {
        const municipio = Array.isArray(municipios)
          ? municipios.find((m) => normalizarTexto(m.nome) === cidadeNorm)
          : null;

        if (!municipio) {
          if (!cancelado) {
            setBairros([]);
            setSugestoes([]);
          }
          return;
        }

        return fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${municipio.id}/subdistritos`)
          .then((r) => r.json())
          .then((data: { nome: string }[]) => {
            if (!cancelado && Array.isArray(data)) {
              setBairros(data.map((d) => d.nome).sort((a, b) => a.localeCompare(b, "pt-BR")));
            }
          });
      })
      .catch(() => {
        if (!cancelado) {
          setBairros([]);
          setSugestoes([]);
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [cidade, estado]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleInput(v: string) {
    onChange(v);
    if (v.length >= 2 && bairros.length > 0) {
      const q = normalizarTexto(v);
      setSugestoes(bairros.filter((b) => normalizarTexto(b).includes(q)).slice(0, 8));
      setAberto(true);
    } else {
      setSugestoes([]);
      setAberto(false);
    }
  }

  function selecionar(bairro: string) {
    onChange(bairro);
    setSugestoes([]);
    setAberto(false);
  }

  return (
    <div className="campo" ref={wrapRef} style={{ position: "relative" }}>
      <label className="campo-label">
        Bairro{required && <span className="campo-req">*</span>}
      </label>
      <input
        type="text"
        name="bairro"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => {
          if (value.length >= 2 && sugestoes.length > 0) setAberto(true);
        }}
        required={required}
        placeholder={cidade.trim() ? "Digite ou selecione o bairro" : "Selecione a cidade para sugerir bairros"}
        className="campo-input"
        autoComplete="off"
      />
      <span className="campo-hint">
        {carregando
          ? "Carregando bairros..."
          : cidade.trim()
            ? bairros.length > 0
              ? "Digite ao menos 2 letras para sugerir bairros da cidade"
              : "Cidade sem bairros IBGE encontrados (ou não reconhecida). Você pode digitar manualmente."
            : "Escolha a cidade para carregar sugestões automáticas de bairro."}
      </span>
      {aberto && sugestoes.length > 0 && (
        <ul style={{
          position: "absolute",
          zIndex: 50,
          top: "100%",
          left: 0,
          right: 0,
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          listStyle: "none",
          margin: "2px 0 0",
          padding: "4px 0",
          maxHeight: 220,
          overflowY: "auto",
        }}>
          {sugestoes.map((b) => (
            <li
              key={b}
              onMouseDown={(e) => { e.preventDefault(); selecionar(b); }}
              style={{
                padding: "8px 14px",
                fontSize: "0.85rem",
                cursor: "pointer",
                color: "#1e293b",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CampoSelect({
  label,
  name,
  value,
  onChange,
  required,
  options,
}: {
  label: string;
  name: keyof ImovelFormData;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="campo">
      <label className="campo-label">
        {label}
        {required && <span className="campo-req">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="campo-select"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function CampoTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  name: keyof ImovelFormData;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="campo">
      <label className="campo-label">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="campo-textarea"
      />
      {hint && <span className="campo-hint">{hint}</span>}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ImovelForm({ values, imovelId, onChange }: Props) {
  const [aba, setAba] = useState<Aba>("basico");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  // ── Estado fotos ────────────────────────────────────────────────────────────
  const [fotos, setFotos] = useState<FotoExistente[]>([]);
  const [carregandoFotos, setCarregandoFotos] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState("");
  const [arrastarSobre, setArrastarSobre] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categoriasComodidade, setCategoriasComodidade] = useState<CategoriaComodidadeForm[]>([]);
  const [carregandoComodidades, setCarregandoComodidades] = useState(false);
  const [erroComodidades, setErroComodidades] = useState("");

  const carregarFotos = useCallback(async () => {
    if (!imovelId) return;
    setCarregandoFotos(true);
    try {
      const r = await fetch(`/api/admin/imoveis/${imovelId}`);
      if (r.ok) {
        const data = await r.json();
        setFotos((data.fotos as FotoExistente[]) ?? []);
      }
    } finally {
      setCarregandoFotos(false);
    }
  }, [imovelId]);

  useEffect(() => {
    if (aba === "fotos" && imovelId) {
      carregarFotos();
    }
  }, [aba, imovelId, carregarFotos]);

  useEffect(() => {
    let ativo = true;
    async function carregarComodidades() {
      setCarregandoComodidades(true);
      setErroComodidades("");
      try {
        const r = await fetch("/api/admin/comodidades/categorias");
        if (!r.ok) throw new Error("Erro ao carregar comodidades");
        const data = (await r.json()) as CategoriaComodidadeForm[];
        if (ativo) setCategoriasComodidade(data);
      } catch {
        if (ativo) setErroComodidades("Nao foi possivel carregar comodidades.");
      } finally {
        if (ativo) setCarregandoComodidades(false);
      }
    }
    carregarComodidades();
    return () => {
      ativo = false;
    };
  }, []);

  async function enviarArquivo(arquivo: File) {
    if (!imovelId) {
      setErroFoto("Salve o imovel primeiro antes de enviar fotos.");
      return;
    }
    setEnviandoFoto(true);
    setErroFoto("");
    try {
      const fd = new FormData();
      fd.append("arquivo", arquivo);
      const r = await fetch(`/api/admin/imoveis/${imovelId}/fotos`, { method: "POST", body: fd });
      if (!r.ok) {
        const body = await r.json();
        setErroFoto(body.error ?? "Erro ao enviar foto.");
        return;
      }
      await carregarFotos();
    } catch {
      setErroFoto("Erro de conexao ao enviar.");
    } finally {
      setEnviandoFoto(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (arquivo) enviarArquivo(arquivo);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setArrastarSobre(false);
    const arquivo = e.dataTransfer.files?.[0];
    if (arquivo) enviarArquivo(arquivo);
  }

  async function toggleDestaque(fotoId: string) {
    if (!imovelId) return;
    await fetch(`/api/admin/imoveis/${imovelId}/fotos/${fotoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destaque: true }),
    });
    await carregarFotos();
  }

  async function toggleWatermark(foto: FotoExistente) {
    if (!imovelId) return;
    await fetch(`/api/admin/imoveis/${imovelId}/fotos/${foto.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watermark: !foto.watermark }),
    });
    await carregarFotos();
  }

  async function deletarFoto(fotoId: string) {
    if (!imovelId) return;
    if (!confirm("Excluir esta foto permanentemente?")) return;
    await fetch(`/api/admin/imoveis/${imovelId}/fotos/${fotoId}`, { method: "DELETE" });
    await carregarFotos();
  }

  function toggleComodidade(comodidadeId: string) {
    const atual = values.comodidadeIds ?? [];
    const novo = atual.includes(comodidadeId)
      ? atual.filter((id) => id !== comodidadeId)
      : [...atual, comodidadeId];
    onChange({ comodidadeIds: novo });
  }

  const f = (field: keyof ImovelFormData) => (v: string) => onChange({ [field]: v });
  const onCidadeChange = (v: string) => onChange({ cidade: v, bairro: "" });

  function numericOrUndef(v: string): number | undefined {
    const n = parseFloat(v.replace(",", "."));
    return isNaN(n) ? undefined : n;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const payload: Record<string, unknown> = {
        titulo: values.titulo,
        descricao: values.descricao || undefined,
        tipo: values.tipo,
        finalidade: values.finalidade,
        status: values.status,
        preco: numericOrUndef(values.preco),
        precoCondominio: numericOrUndef(values.precoCondominio),
        iptu: numericOrUndef(values.iptu),
        bairro: values.bairro,
        cidade: values.cidade,
        estado: values.estado,
        nomeCondominio: values.nomeCondominio || undefined,
        area: numericOrUndef(values.area),
        areaUtil: numericOrUndef(values.areaUtil),
        quartos: values.quartos ? parseInt(values.quartos, 10) : undefined,
        suites: values.suites ? parseInt(values.suites, 10) : undefined,
        banheiros: values.banheiros ? parseInt(values.banheiros, 10) : undefined,
        vagas: values.vagas ? parseInt(values.vagas, 10) : undefined,
        videoYoutube: values.videoYoutube || undefined,
        nomeProprietario: values.nomeProprietario || undefined,
        telefoneProprietario: values.telefoneProprietario || undefined,
        emailProprietario: values.emailProprietario || undefined,
        cep: values.cep || undefined,
        rua: values.rua || undefined,
        numero: values.numero || undefined,
        complemento: values.complemento || undefined,
        andar: values.andar || undefined,
        observacoesInternas: values.observacoesInternas || undefined,
        metaTitulo: values.metaTitulo || undefined,
        metaDescricao: values.metaDescricao || undefined,
        slugUrl: values.slugUrl || undefined,
        altTexto: values.altTexto || undefined,
        comodidadeIds: values.comodidadeIds,
      };

      const url = imovelId ? `/api/admin/imoveis/${imovelId}` : "/api/admin/imoveis";
      const method = imovelId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        setErro(body.error ?? "Erro ao salvar imóvel.");
        return;
      }

      router.push("/admin/imoveis");
      router.refresh();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="imovel-form" noValidate>
      {/* Abas */}
      <div className="abas">
        {ABAS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAba(a.id)}
            className={`aba-btn ${aba === a.id ? "aba-ativa" : ""}`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* ── ABA: Básico ─────────────────────────────────────────────────────── */}
      {aba === "basico" && (
        <div className="aba-conteudo">
          <CampoTexto label="Título" name="titulo" value={values.titulo} onChange={f("titulo")} required placeholder="Ex: Apartamento 2 dormitórios com vista privilegiada" />
          <CampoTextarea label="Descrição" name="descricao" value={values.descricao} onChange={f("descricao")} placeholder="Descreva o imóvel…" />

          <div className="grid-2">
            <CampoSelect label="Tipo" name="tipo" value={values.tipo} onChange={f("tipo")} required options={[
              { value: "APARTAMENTO", label: "Apartamento" },
              { value: "CASA", label: "Casa" },
              { value: "TERRENO", label: "Terreno" },
              { value: "COMERCIAL", label: "Comercial" },
              { value: "COBERTURA", label: "Cobertura" },
              { value: "KITNET", label: "Kitnet" },
              { value: "RURAL", label: "Rural" },
            ]} />
            <CampoSelect label="Finalidade" name="finalidade" value={values.finalidade} onChange={f("finalidade")} required options={[
              { value: "VENDA", label: "Venda" },
              { value: "ALUGUEL", label: "Aluguel" },
              { value: "AMBOS", label: "Venda e Aluguel" },
            ]} />
          </div>

          <div className="grid-2">
            <CampoSelect label="Status" name="status" value={values.status} onChange={f("status")} required options={[
              { value: "DISPONIVEL", label: "Disponível" },
              { value: "RESERVADO", label: "Reservado" },
              { value: "VENDIDO", label: "Vendido" },
              { value: "LOCADO", label: "Locado" },
              { value: "INATIVO", label: "Inativo" },
            ]} />
            <CampoTexto label="Preço (R$)" name="preco" value={values.preco} onChange={f("preco")} required type="number" placeholder="Ex: 450000" />
          </div>

          <div className="grid-2">
            <CampoCidadeIBGE value={values.cidade} estado={values.estado} onChange={onCidadeChange} required />
            <CampoBairroIBGE value={values.bairro} cidade={values.cidade} estado={values.estado} onChange={f("bairro")} required />
          </div>

          <div className="comodidades-box">
            <div className="comodidades-head">
              <h3>Comodidades</h3>
              <span>{values.comodidadeIds.length} selecionada(s)</span>
            </div>

            {carregandoComodidades && <p className="comodidades-estado">Carregando comodidades...</p>}
            {erroComodidades && <p className="comodidades-erro">{erroComodidades}</p>}

            {!carregandoComodidades && !erroComodidades && categoriasComodidade.length === 0 && (
              <p className="comodidades-estado">Nenhuma comodidade cadastrada. Cadastre em /admin/comodidades.</p>
            )}

            {!carregandoComodidades && categoriasComodidade.length > 0 && (
              <div className="comodidades-categorias">
                {categoriasComodidade.map((categoria) => (
                  <div key={categoria.id} className="categoria-comodidade">
                    <p className="categoria-titulo">{categoria.nome}</p>
                    <div className="checks-comodidades">
                      {categoria.itens.map((item) => (
                        <label key={item.id} className="check-comodidade">
                          <input
                            type="checkbox"
                            checked={values.comodidadeIds.includes(item.id)}
                            onChange={() => toggleComodidade(item.id)}
                          />
                          <span>{item.nome}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ABA: Detalhes ───────────────────────────────────────────────────── */}
      {aba === "detalhes" && (
        <div className="aba-conteudo">
          <div className="grid-3">
            <CampoTexto label="Área total (m²)" name="area" value={values.area} onChange={f("area")} type="number" />
            <CampoTexto label="Área útil (m²)" name="areaUtil" value={values.areaUtil} onChange={f("areaUtil")} type="number" />
            <CampoTexto label="Quartos" name="quartos" value={values.quartos} onChange={f("quartos")} type="number" />
          </div>
          <div className="grid-3">
            <CampoTexto label="Suítes" name="suites" value={values.suites} onChange={f("suites")} type="number" />
            <CampoTexto label="Banheiros" name="banheiros" value={values.banheiros} onChange={f("banheiros")} type="number" />
            <CampoTexto label="Vagas de garagem" name="vagas" value={values.vagas} onChange={f("vagas")} type="number" />
          </div>
          <div className="grid-2">
            <CampoTexto label="Condomínio (R$/mês)" name="precoCondominio" value={values.precoCondominio} onChange={f("precoCondominio")} type="number" />
            <CampoTexto label="IPTU (R$/ano)" name="iptu" value={values.iptu} onChange={f("iptu")} type="number" />
          </div>
          <CampoTexto label="Nome do condomínio" name="nomeCondominio" value={values.nomeCondominio} onChange={f("nomeCondominio")} />
          <CampoTexto label="Vídeo YouTube (URL)" name="videoYoutube" value={values.videoYoutube} onChange={f("videoYoutube")} type="url" placeholder="https://youtube.com/watch?v=..." hint="URL completa do vídeo no YouTube" />
        </div>
      )}

      {/* ── ABA: Endereço ───────────────────────────────────────────────────── */}
      {aba === "endereco" && (
        <div className="aba-conteudo">
          <p className="aviso-privado">🔒 Dados privados — não são exibidos no site público</p>
          <div className="grid-2">
            <CampoTexto label="CEP" name="cep" value={values.cep} onChange={f("cep")} />
            <CampoTexto label="Estado" name="estado" value={values.estado} onChange={f("estado")} />
          </div>
          <div className="grid-3">
            <div style={{ gridColumn: "span 2" }}>
              <CampoTexto label="Rua / Logradouro" name="rua" value={values.rua} onChange={f("rua")} />
            </div>
            <CampoTexto label="Número" name="numero" value={values.numero} onChange={f("numero")} />
          </div>
          <div className="grid-2">
            <CampoTexto label="Complemento" name="complemento" value={values.complemento} onChange={f("complemento")} />
            <CampoTexto label="Andar" name="andar" value={values.andar} onChange={f("andar")} placeholder="Ex: 12º" />
          </div>
        </div>
      )}

      {/* ── ABA: Proprietário ───────────────────────────────────────────────── */}
      {aba === "proprietario" && (
        <div className="aba-conteudo">
          <p className="aviso-privado">🔒 Dados privados — não são exibidos no site público</p>
          <CampoTexto label="Nome do proprietário" name="nomeProprietario" value={values.nomeProprietario} onChange={f("nomeProprietario")} />
          <div className="grid-2">
            <CampoTexto label="Telefone" name="telefoneProprietario" value={values.telefoneProprietario} onChange={f("telefoneProprietario")} type="tel" />
            <CampoTexto label="E-mail" name="emailProprietario" value={values.emailProprietario} onChange={f("emailProprietario")} type="email" />
          </div>
          <CampoTextarea label="Observações internas" name="observacoesInternas" value={values.observacoesInternas} onChange={f("observacoesInternas")} placeholder="Notas sobre o imóvel, negociação, histórico…" />
        </div>
      )}

      {/* ── ABA: Fotos ──────────────────────────────────────────────────────── */}
      {aba === "fotos" && (
        <div className="aba-conteudo">
          {!imovelId && (
            <p className="aviso-info">Salve o imóvel primeiro para habilitar o upload de fotos.</p>
          )}

          {imovelId && (
            <>
              {/* Zona de drop */}
              <div
                className={`zona-upload${arrastarSobre ? " zona-upload-ativa" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setArrastarSobre(true); }}
                onDragLeave={() => setArrastarSobre(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/tiff"
                  className="input-oculto"
                  onChange={onFileChange}
                  disabled={enviandoFoto}
                />
                {enviandoFoto ? (
                  <span className="upload-status">Processando e enviando…</span>
                ) : (
                  <>
                    <span className="upload-icone">+</span>
                    <span className="upload-texto">Clique ou arraste uma foto aqui</span>
                    <span className="upload-hint">JPEG, PNG, WebP, HEIC — máx 20MB</span>
                  </>
                )}
              </div>

              {erroFoto && <p className="form-erro">{erroFoto}</p>}

              {/* Lista de fotos */}
              {carregandoFotos && <p className="loading-fotos">Carregando fotos…</p>}

              {!carregandoFotos && fotos.length === 0 && (
                <p className="sem-fotos">Nenhuma foto cadastrada ainda.</p>
              )}

              {!carregandoFotos && fotos.length > 0 && (
                <div className="grade-fotos">
                  {fotos
                    .slice()
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((foto) => (
                      <div key={foto.id} className={`card-foto${foto.destaque ? " card-foto-destaque" : ""}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={foto.url} alt="Foto do imóvel" className="foto-thumb" />

                        {foto.destaque && (
                          <span className="badge-destaque">Destaque</span>
                        )}

                        <div className="foto-acoes">
                          {!foto.destaque && (
                            <button
                              type="button"
                              className="btn-foto-acao"
                              onClick={() => toggleDestaque(foto.id)}
                              title="Marcar como destaque"
                            >
                              Destaque
                            </button>
                          )}
                          <button
                            type="button"
                            className={`btn-foto-acao${foto.watermark ? " btn-ativo" : ""}`}
                            onClick={() => toggleWatermark(foto)}
                            title={foto.watermark ? "Remover marca d'água" : "Adicionar marca d'água"}
                          >
                            {foto.watermark ? "Com WM" : "Sem WM"}
                          </button>
                          <button
                            type="button"
                            className="btn-foto-excluir"
                            onClick={() => deletarFoto(foto.id)}
                            title="Excluir foto"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── ABA: SEO ────────────────────────────────────────────────────────── */}
      {aba === "seo" && (
        <div className="aba-conteudo">
          <p className="aviso-info">Campos gerados automaticamente ao salvar. Edite se quiser personalizar.</p>

          <CampoTexto
            label="Meta Título (title)"
            name="metaTitulo"
            value={values.metaTitulo}
            onChange={f("metaTitulo")}
            placeholder="Gerado automaticamente"
            hint="Recomendado: 50–60 caracteres"
          />

          <CampoTextarea
            label="Meta Descrição"
            name="metaDescricao"
            value={values.metaDescricao}
            onChange={f("metaDescricao")}
            placeholder="Gerada automaticamente"
            hint="Recomendado: 120–160 caracteres"
          />

          <CampoTexto
            label="Slug da URL"
            name="slugUrl"
            value={values.slugUrl}
            onChange={f("slugUrl")}
            placeholder="Gerado automaticamente: ex. casa-vila-progresso-imv-0042"
            hint="Use apenas letras minúsculas, números e hífens"
          />

          <CampoTexto
            label="Alt Text das fotos"
            name="altTexto"
            value={values.altTexto}
            onChange={f("altTexto")}
            placeholder="Gerado automaticamente: ex. Casa 3 quartos Vila Progresso Sorocaba — IMV-0042"
            hint="Descreve a foto principal para acessibilidade e SEO"
          />
        </div>
      )}

      {/* Rodapé com erro e botão */}
      {erro && <div className="form-erro">{erro}</div>}

      <div className="form-rodape">
        <button
          type="button"
          onClick={() => router.push("/admin/imoveis")}
          className="btn-cancelar"
          disabled={salvando}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-salvar" disabled={salvando}>
          {salvando ? "Salvando…" : imovelId ? "Salvar alterações" : "Criar imóvel"}
        </button>
      </div>

      <style>{`
        .imovel-form { display: flex; flex-direction: column; gap: 0; }

        .abas { display: flex; border-bottom: 2px solid #e5e7eb; gap: 0; margin-bottom: 0; overflow-x: auto; }
        .aba-btn { padding: 0.625rem 1.25rem; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 0.875rem; font-weight: 500; color: #6b7280; white-space: nowrap; margin-bottom: -2px; }
        .aba-btn:hover { color: #1f2937; }
        .aba-ativa { color: #2563eb !important; border-bottom-color: #2563eb !important; }

        .aba-conteudo { display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem 0; }

        .campo { display: flex; flex-direction: column; gap: 0.25rem; }
        .campo-label { font-size: 0.875rem; font-weight: 600; color: #374151; }
        .campo-req { color: #dc2626; margin-left: 2px; }
        .campo-hint { font-size: 0.75rem; color: #9ca3af; }
        .campo-input, .campo-select, .campo-textarea { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; background: #fff; width: 100%; box-sizing: border-box; }
        .campo-input:focus, .campo-select:focus, .campo-textarea:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .campo-textarea { resize: vertical; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }

        .aviso-privado { background: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 0.625rem 0.875rem; font-size: 0.8125rem; color: #92400e; margin: 0; }
        .aviso-info { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 0.625rem 0.875rem; font-size: 0.8125rem; color: #1e40af; margin: 0; }

        .comodidades-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.875rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .comodidades-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
        .comodidades-head h3 { margin: 0; font-size: 0.95rem; }
        .comodidades-head span { font-size: 0.8rem; color: #6b7280; }
        .comodidades-estado { margin: 0; color: #6b7280; font-size: 0.85rem; }
        .comodidades-erro { margin: 0; color: #dc2626; font-size: 0.85rem; }
        .comodidades-categorias { display: grid; gap: 0.625rem; }
        .categoria-comodidade { border: 1px solid #f0f1f4; border-radius: 8px; padding: 0.625rem; }
        .categoria-titulo { margin: 0 0 0.5rem; font-size: 0.85rem; font-weight: 700; color: #374151; }
        .checks-comodidades { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.35rem 0.6rem; }
        .check-comodidade { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #374151; }

        .zona-upload { border: 2px dashed #d1d5db; border-radius: 8px; padding: 2.5rem 1rem; text-align: center; cursor: pointer; transition: border-color 0.15s, background 0.15s; display: flex; flex-direction: column; align-items: center; gap: 0.375rem; }
        .zona-upload:hover { border-color: #2563eb; background: #f0f7ff; }
        .zona-upload-ativa { border-color: #2563eb; background: #eff6ff; }
        .input-oculto { display: none; }
        .upload-icone { font-size: 2rem; line-height: 1; color: #9ca3af; }
        .upload-texto { font-size: 0.9375rem; font-weight: 600; color: #374151; }
        .upload-hint { font-size: 0.75rem; color: #9ca3af; }
        .upload-status { font-size: 0.875rem; color: #2563eb; font-weight: 500; }
        .loading-fotos { color: #9ca3af; font-size: 0.875rem; text-align: center; padding: 1rem; }
        .sem-fotos { color: #9ca3af; font-size: 0.875rem; text-align: center; padding: 1rem; }

        .grade-fotos { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
        .card-foto { border: 2px solid #e5e7eb; border-radius: 8px; overflow: hidden; position: relative; }
        .card-foto-destaque { border-color: #2563eb; }
        .foto-thumb { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .badge-destaque { position: absolute; top: 6px; left: 6px; background: #2563eb; color: #fff; font-size: 0.625rem; font-weight: 700; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.05em; }
        .foto-acoes { display: flex; gap: 4px; padding: 6px; background: #f9fafb; flex-wrap: wrap; }
        .btn-foto-acao { flex: 1; padding: 0.25rem 0; font-size: 0.6875rem; font-weight: 600; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; cursor: pointer; color: #374151; min-width: 0; }
        .btn-foto-acao:hover { background: #f3f4f6; }
        .btn-ativo { background: #dbeafe; border-color: #93c5fd; color: #1e40af; }
        .btn-foto-excluir { padding: 0.25rem 0.4rem; font-size: 0.8125rem; border: 1px solid #fecaca; border-radius: 4px; background: #fff; cursor: pointer; color: #dc2626; }
        .btn-foto-excluir:hover { background: #fee2e2; }

        .form-erro { background: #fee2e2; border: 1px solid #fecaca; border-radius: 6px; padding: 0.625rem 0.875rem; color: #dc2626; font-size: 0.875rem; }
        .form-rodape { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; margin-top: 0.5rem; }
        .btn-cancelar { padding: 0.5rem 1.25rem; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; cursor: pointer; font-size: 0.875rem; }
        .btn-cancelar:hover:not(:disabled) { background: #f3f4f6; }
        .btn-salvar { padding: 0.5rem 1.5rem; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.875rem; }
        .btn-salvar:hover:not(:disabled) { background: #1d4ed8; }
        .btn-salvar:disabled, .btn-cancelar:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 640px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .grid-3 > div[style] { grid-column: auto !important; }
        }
      `}</style>
    </form>
  );
}
