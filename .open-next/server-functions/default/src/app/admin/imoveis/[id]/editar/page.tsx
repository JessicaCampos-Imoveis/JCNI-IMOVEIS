"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImovelForm, type ImovelFormData, FORM_INICIAL } from "../../_components/ImovelForm";

type Props = { params: Promise<{ id: string }> };

function formFromApi(data: Record<string, unknown>): ImovelFormData {
  const str = (v: unknown) => (v != null ? String(v) : "");
  return {
    titulo: str(data.titulo),
    descricao: str(data.descricao),
    tipo: str(data.tipo) || "APARTAMENTO",
    finalidade: str(data.finalidade) || "VENDA",
    status: str(data.status) || "DISPONIVEL",
    preco: data.preco != null ? String(data.preco) : "",
    precoCondominio: data.precoCondominio != null ? String(data.precoCondominio) : "",
    iptu: data.iptu != null ? String(data.iptu) : "",
    bairro: str(data.bairro),
    cidade: str(data.cidade) || "Sorocaba",
    estado: str(data.estado) || "SP",
    nomeCondominio: str(data.nomeCondominio),
    area: data.area != null ? String(data.area) : "",
    areaUtil: data.areaUtil != null ? String(data.areaUtil) : "",
    quartos: data.quartos != null ? String(data.quartos) : "",
    suites: data.suites != null ? String(data.suites) : "",
    banheiros: data.banheiros != null ? String(data.banheiros) : "",
    vagas: data.vagas != null ? String(data.vagas) : "",
    videoYoutube: str(data.videoYoutube),
    nomeProprietario: str(data.nomeProprietario),
    telefoneProprietario: str(data.telefoneProprietario),
    emailProprietario: str(data.emailProprietario),
    cep: str(data.cep),
    rua: str(data.rua),
    numero: str(data.numero),
    complemento: str(data.complemento),
    andar: str(data.andar),
    observacoesInternas: str(data.observacoesInternas),
    metaTitulo: str(data.metaTitulo),
    metaDescricao: str(data.metaDescricao),
    slugUrl: str(data.slugUrl),
    altTexto: str(data.altTexto),
    comodidadeIds: Array.isArray(data.comodidades)
      ? data.comodidades
          .map((c) => (c && typeof c === "object" && "comodidadeId" in c ? String((c as { comodidadeId: unknown }).comodidadeId) : ""))
          .filter(Boolean)
      : [],
  };
}

export default function EditarImovelPage({ params }: Props) {
  const [id, setId] = useState<string>("");
  const [values, setValues] = useState<ImovelFormData>(FORM_INICIAL);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    params.then(({ id: imovelId }) => {
      setId(imovelId);
      fetch(`/api/admin/imoveis/${imovelId}`)
        .then((r) => {
          if (!r.ok) throw new Error("Imóvel não encontrado");
          return r.json();
        })
        .then((data) => {
          setValues(formFromApi(data));
        })
        .catch((e) => setErro(e.message))
        .finally(() => setCarregando(false));
    });
  }, [params]);

  if (carregando) {
    return (
      <div className="form-page">
        <div className="loading-state">Carregando imóvel…</div>
        <style>{`.form-page{padding:1.5rem;}.loading-state{text-align:center;padding:3rem;color:#6b7280;}`}</style>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="form-page">
        <p className="erro-msg">{erro}</p>
        <Link href="/admin/imoveis">← Voltar</Link>
        <style>{`.form-page{padding:1.5rem;}.erro-msg{color:#dc2626;margin-bottom:1rem;}`}</style>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-page-header">
        <div>
          <Link href="/admin/imoveis" className="breadcrumb">← Imóveis</Link>
          <h1 className="form-page-title">Editar Imóvel</h1>
        </div>
      </div>

      <div className="form-card">
        <ImovelForm
          values={values}
          imovelId={id}
          onChange={(updated) => setValues((prev) => ({ ...prev, ...updated }))}
        />
      </div>

      <style>{`
        .form-page { padding: 1.5rem; max-width: 800px; margin: 0 auto; }
        .form-page-header { margin-bottom: 1.25rem; }
        .breadcrumb { font-size: 0.875rem; color: #6b7280; text-decoration: none; display: inline-block; margin-bottom: 0.5rem; }
        .breadcrumb:hover { color: #374151; }
        .form-page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
        .form-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1.5rem; }

        @media (max-width: 640px) {
          .form-page { padding: 1rem; }
          .form-page-title { font-size: 1.3rem; }
          .form-card { padding: 1rem; border-radius: 12px; }
        }
      `}</style>
    </div>
  );
}
