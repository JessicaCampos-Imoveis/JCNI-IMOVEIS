"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type PortalStatus = {
  id: string;
  nome: string;
  grupo: string;
  requerContrato: boolean;
  maxFotos: number;
  documentacaoUrl: string;
  ativo: boolean;
  countImoveis: number;
};

type Alertas = {
  totalDisponivel: number;
  semFoto: number;
  semPreco: number;
  semDescricao: number;
};

type PortaisResponse = {
  portais: PortalStatus[];
  alertas: Alertas;
};

const GRUPO_LABEL: Record<string, string> = {
  olxgroup: "OLX Group (ZAP + Viva Real + OLX)",
  imovelweb: "ImovelWeb",
  chavesnamao: "Chaves na Mao",
  generico: "Generico",
};

function CopyButton({ value }: { value: string }) {
  const [copiado, setCopiado] = useState(false);

  function copiar() {
    navigator.clipboard.writeText(value).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
    >
      {copiado ? "Copiado!" : "Copiar URL"}
    </button>
  );
}

function PortalCard({
  portal,
  siteUrl,
  onToggle,
  salvando,
}: {
  portal: PortalStatus;
  siteUrl: string;
  onToggle: (id: string, ativo: boolean) => void;
  salvando: boolean;
}) {
  const feedUrl = `${siteUrl}/api/xml/${portal.id}`;

  return (
    <div
      className={`rounded-xl border p-5 flex flex-col gap-4 transition-colors ${
        portal.ativo
          ? "border-amber-300 bg-amber-50"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Cabecalho */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800 text-base">
              {portal.nome}
            </span>
            {portal.requerContrato && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                Requer contrato
              </span>
            )}
            {portal.ativo && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                Ativo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Formato: {GRUPO_LABEL[portal.grupo] ?? portal.grupo} &middot; Max{" "}
            {portal.maxFotos} fotos por imovel
          </p>
        </div>

        {/* Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-sm text-slate-600">
            {portal.ativo ? "Ativo" : "Inativo"}
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={portal.ativo}
              disabled={salvando}
              onChange={(e) => onToggle(portal.id, e.target.checked)}
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors ${
                portal.ativo ? "bg-amber-500" : "bg-slate-300"
              } ${salvando ? "opacity-60" : ""}`}
            />
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                portal.ativo ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>

      {/* Como funciona — guia de passos */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
          Como ativar neste portal
        </p>
        <ol className="flex flex-col gap-1.5 text-xs text-slate-600 list-none">
          <li className="flex gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
            {portal.requerContrato ? (
              <span>Feche o contrato com o portal (plano de anuncio).</span>
            ) : (
              <span>Cadastre sua imobiliaria no site do portal (gratuito).</span>
            )}
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
            <span>Ative o feed aqui (botao acima) e copie a URL abaixo.</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
            <span>Mande a URL para o atendente do portal {portal.requerContrato ? "(por e-mail ou WhatsApp do onboarding)" : "no campo de integracao XML"}. So precisa fazer isso uma vez.</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            <span className="text-slate-500">Pronto — o portal puxa seus imoveis automaticamente. Nao precisa fazer mais nada.</span>
          </li>
        </ol>
      </div>

      {/* URL do feed */}
      <div>
        <p className="text-xs font-medium text-slate-600 mb-1">
          URL do feed — copie e mande ao portal:
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <code className="flex-1 text-xs bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-700 break-all select-all">
            {feedUrl}
          </code>
          <CopyButton value={feedUrl} />
        </div>
      </div>

      {/* Contagem + docs */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-sm">
        <span className="text-slate-600">
          <strong className="text-slate-800">{portal.countImoveis}</strong>{" "}
          imovel{portal.countImoveis !== 1 ? "is" : ""} disponivel
          {portal.countImoveis !== 1 ? "is" : ""} no feed
        </span>
        <a
          href={portal.documentacaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber-700 underline underline-offset-2 hover:text-amber-900"
        >
          Info do portal
        </a>
      </div>
    </div>
  );
}

export default function PortaisPage() {
  const [dados, setDados] = useState<PortaisResponse | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://jessicacampos.com.br";

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/admin/portais");
      if (!res.ok) throw new Error("Falha ao carregar portais");
      const json: PortaisResponse = await res.json();
      setDados(json);
    } catch {
      setErro("Nao foi possivel carregar os dados. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function togglePortal(portalId: string, ativo: boolean) {
    if (!dados) return;
    setSalvando(true);
    setFeedback(null);

    // Atualiza otimisticamente
    setDados((prev) =>
      prev
        ? {
            ...prev,
            portais: prev.portais.map((p) =>
              p.id === portalId ? { ...p, ativo } : p
            ),
          }
        : prev
    );

    try {
      const res = await fetch("/api/admin/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [`portal_${portalId}_ativo`]: String(ativo) }),
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      setFeedback(`Portal ${ativo ? "ativado" : "desativado"} com sucesso.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      // Reverte em caso de erro
      setDados((prev) =>
        prev
          ? {
              ...prev,
              portais: prev.portais.map((p) =>
                p.id === portalId ? { ...p, ativo: !ativo } : p
              ),
            }
          : prev
      );
      setErro("Erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Portais XML</h1>
            <p className="text-sm text-slate-500 mt-1">
              Todos os portais imobiliarios do Brasil funcionam igual: voce ativa o
              portal aqui, copia a URL e manda uma unica vez para o atendente do
              portal. Depois disso, eles puxam seus imoveis automaticamente a cada
              poucas horas. Nao precisa fazer mais nada.
            </p>
          </div>
          <Link
            href="/admin/integracoes/portais/guia"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            Ver guia passo a passo
          </Link>
        </div>
      </div>

      {/* Alertas de qualidade */}
      {dados && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-700 mb-3 text-sm">
            Qualidade dos imoveis no feed
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-2xl font-bold text-slate-800">
                {dados.alertas.totalDisponivel}
              </span>
              <span className="text-xs text-slate-500">Disponiveis</span>
            </div>
            <div
              className={`flex flex-col gap-0.5 ${dados.alertas.semFoto > 0 ? "text-red-600" : "text-slate-500"}`}
            >
              <span className="text-2xl font-bold">
                {dados.alertas.semFoto}
              </span>
              <span className="text-xs">Sem foto</span>
            </div>
            <div
              className={`flex flex-col gap-0.5 ${dados.alertas.semPreco > 0 ? "text-amber-600" : "text-slate-500"}`}
            >
              <span className="text-2xl font-bold">
                {dados.alertas.semPreco}
              </span>
              <span className="text-xs">Sem preco</span>
            </div>
            <div
              className={`flex flex-col gap-0.5 ${dados.alertas.semDescricao > 0 ? "text-amber-600" : "text-slate-500"}`}
            >
              <span className="text-2xl font-bold">
                {dados.alertas.semDescricao}
              </span>
              <span className="text-xs">Sem descricao</span>
            </div>
          </div>
          {(dados.alertas.semFoto > 0 || dados.alertas.semPreco > 0) && (
            <p className="mt-3 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              Imoveis sem foto ou sem preco aparecem no feed mas podem ser
              recusados pelos portais na validacao automatica deles.
            </p>
          )}
        </div>
      )}

      {/* Feedback / erro */}
      {feedback && (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm">
          {feedback}
        </div>
      )}
      {erro && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {erro}
        </div>
      )}

      {/* Loading */}
      {carregando && (
        <div className="text-center py-16 text-slate-400 text-sm">
          Carregando portais...
        </div>
      )}

      {/* Cards de portais */}
      {dados && !carregando && (
        <div className="flex flex-col gap-4">
          {dados.portais.map((portal) => (
            <PortalCard
              key={portal.id}
              portal={portal}
              siteUrl={siteUrl}
              onToggle={togglePortal}
              salvando={salvando}
            />
          ))}
        </div>
      )}

      {/* Nota sobre contratos */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
        <strong>Portais pagos (ZAP, Viva Real, OLX, ImovelWeb):</strong> voce
        pode ativar o feed aqui agora mesmo. O feed XML fica disponivel na URL
        acima e sera validado pelo portal quando voce contratar o plano. Portais
        gratuitos (Chaves na Mao, 123i) aceitam o feed sem contrato previo.
      </div>
    </div>
  );
}
