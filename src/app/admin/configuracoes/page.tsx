"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { THEME_PRESETS } from "@/lib/theme-presets";
import { BRAND_SETTINGS, SITE_IMAGES } from "@/lib/site-settings";

type ConfigMap = Record<string, string>;

const TABS = [
  { id: "geral", label: "Geral" },
  { id: "conteudo", label: "Conteudo" },
  { id: "exibicao", label: "Exibicao" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "notificacoes", label: "Notificacoes" },
  { id: "integracoes", label: "Integracoes" },
  { id: "tema", label: "Tema" },
  { id: "webhooks", label: "Webhooks" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const TAB_DESCRIPTIONS: Record<TabId, string> = {
  geral: "Dados básicos do negócio: nome, contato, CRECI, logo e fotos da corretora — aparecem em todo o site.",
  conteudo: "Personalize os textos principais: título e subtítulo do hero, e a seção 'Sobre' com sua história.",
  exibicao: "Controle o que é exibido nos anúncios: IPTU, cômodos e link de simulação de financiamento.",
  whatsapp: "Número e mensagem padrão para o botão de contato via WhatsApp que aparece em cada imóvel.",
  notificacoes: "Receba um e-mail a cada novo lead e configure confirmação automática para o interessado.",
  integracoes: "Analytics (GA4, Meta Pixel, GTM), chat ao vivo (Tawk, JivoChat, Crisp), CRM e scripts personalizados.",
  tema: "Escolha a identidade visual do site: paleta de cores, estilo geral e aparência dos botões.",
  webhooks: "Dispare chamadas HTTP automáticas para outros sistemas quando leads chegam ou mudam de status.",
};

type Webhook = {
  id: string;
  nome: string;
  url: string;
  evento: string;
  ativo: boolean;
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
    </div>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-amber-500"
      />
      <label htmlFor={id} className="text-sm text-slate-700">{label}</label>
    </div>
  );
}

function ImageUploadField({
  label,
  currentUrl,
  tipo,
  onUpload,
  uploadMsg,
}: {
  label: string;
  currentUrl: string;
  tipo: "logo" | "foto_jessica" | "foto_jessica_hero";
  onUpload: (file: File, tipo: "logo" | "foto_jessica" | "foto_jessica_hero") => Promise<void>;
  uploadMsg: { text: string; ok: boolean } | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="flex items-center gap-4">
        {currentUrl && (
          <Image
            src={currentUrl}
            alt={label}
            width={64}
            height={64}
            className="rounded-lg border border-slate-200 object-contain bg-slate-50"
            unoptimized
          />
        )}
        <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
          Trocar imagem
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f, tipo); }}
          />
        </label>
      </div>
      {uploadMsg && (
        <p className={`text-xs ${uploadMsg.ok ? "text-green-600" : "text-red-600"}`}>
          {uploadMsg.text}
        </p>
      )}
    </div>
  );
}

function SaveBar({ saving, onSave }: { saving: boolean; onSave: () => void }) {
  return (
    <div className="flex justify-end pt-2">
      <button
        onClick={onSave}
        disabled={saving}
        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
      >
        {saving ? "Salvando..." : "Salvar alteracoes"}
      </button>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<TabId>("geral");
  const [cfg, setCfg] = useState<ConfigMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [uploadMsg, setUploadMsg] = useState<{ tipo: string; text: string; ok: boolean } | null>(null);

  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [wLoading, setWLoading] = useState(false);
  const [newWh, setNewWh] = useState({ nome: "", url: "", evento: "lead.criado" });
  const [whSaving, setWhSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/configuracoes")
      .then((r) => r.json())
      .then((data: ConfigMap) => {
        setCfg(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === "webhooks") loadWebhooks();
  }, [tab]);

  function loadWebhooks() {
    setWLoading(true);
    fetch("/api/admin/webhooks")
      .then((r) => r.json())
      .then((data) => {
        setWebhooks(Array.isArray(data) ? data : (data.webhooks ?? []));
        setWLoading(false);
      })
      .catch(() => setWLoading(false));
  }

  function set(chave: string, valor: string) {
    setCfg((prev) => ({ ...prev, [chave]: valor }));
  }

  async function salvar() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      if (res.ok) {
        setMsg({ type: "ok", text: "Configuracoes salvas com sucesso." });
      } else {
        setMsg({ type: "err", text: "Erro ao salvar. Tente novamente." });
      }
    } catch {
      setMsg({ type: "err", text: "Erro de rede." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  }

  async function uploadImagem(file: File, tipo: "logo" | "foto_jessica" | "foto_jessica_hero") {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("tipo", tipo);
    setUploadMsg({ tipo, text: "Enviando...", ok: true });
    try {
      const res = await fetch("/api/admin/configuracoes/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const chave =
          tipo === "logo"
            ? "marca_logo_url"
            : tipo === "foto_jessica"
              ? "marca_foto_jessica_url"
              : "marca_foto_jessica_hero_url";
        setCfg((prev) => ({ ...prev, [chave]: data.url }));
        setUploadMsg({ tipo, text: "Imagem enviada com sucesso.", ok: true });
      } else {
        setUploadMsg({ tipo, text: data.error ?? "Erro ao enviar imagem.", ok: false });
      }
    } catch {
      setUploadMsg({ tipo, text: "Erro de rede ao enviar imagem.", ok: false });
    } finally {
      setTimeout(() => setUploadMsg(null), 4000);
    }
  }

  async function criarWebhook(e: React.FormEvent) {
    e.preventDefault();
    setWhSaving(true);
    try {
      const res = await fetch("/api/admin/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWh),
      });
      if (res.ok) {
        setNewWh({ nome: "", url: "", evento: "lead.criado" });
        loadWebhooks();
      }
    } finally {
      setWhSaving(false);
    }
  }

  async function toggleWebhook(id: string, ativo: boolean) {
    await fetch(`/api/admin/webhooks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !ativo }),
    });
    loadWebhooks();
  }

  async function deletarWebhook(id: string) {
    if (!confirm("Remover este webhook?")) return;
    await fetch(`/api/admin/webhooks/${id}`, { method: "DELETE" });
    loadWebhooks();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Configuracoes</h1>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            title={TAB_DESCRIPTIONS[t.id]}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.id
                ? "bg-white border border-b-white border-slate-200 text-amber-600 -mb-px"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 font-medium">{TAB_DESCRIPTIONS[tab]}</p>
      </div>

      {msg && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            msg.type === "ok"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      {tab === "geral" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              Informações básicas sobre seu negócio. Estes dados aparecem em toda a parte pública do site.
            </p>
            <Field label="Nome da empresa" name="empresa_nome" value={cfg.empresa_nome ?? ""} onChange={(v) => set("empresa_nome", v)} placeholder="Jessica Campos Negocios Imobiliarios" />
            <Field label="Telefone de contato" name="empresa_telefone" value={cfg.empresa_telefone ?? ""} onChange={(v) => set("empresa_telefone", v)} placeholder="(11) 99999-9999" />
            <Field label="E-mail de contato" name="empresa_email" value={cfg.empresa_email ?? ""} onChange={(v) => set("empresa_email", v)} type="email" placeholder="contato@jessicacampos.com" />
            <Field label="Endereco" name="empresa_endereco" value={cfg.empresa_endereco ?? ""} onChange={(v) => set("empresa_endereco", v)} placeholder="Rua, numero - Bairro, Cidade - UF" />
            <Field label="CRECI" name="empresa_creci" value={cfg.empresa_creci ?? ""} onChange={(v) => set("empresa_creci", v)} placeholder="CRECI 123456" />
          </div>

          <hr className="border-slate-200" />

          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-slate-700">Imagens de marca</p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800 font-medium mb-2 flex items-center gap-1">
                <span>💡</span> Como suas imagens aparecem:
              </p>
              <ul className="text-xs text-amber-700 space-y-1 ml-5 list-disc">
                <li><strong>Logo:</strong> Topo esquerdo do site e em emails</li>
                <li><strong>Foto Corretor(a):</strong> Seção &quot;Sobre&quot; (foto quadrada, 400x400px recomendado)</li>
                <li><strong>Foto Banner:</strong> Topo da página inicial (foto de corpo inteiro, 1400x800px recomendado)</li>
              </ul>
              <p className="text-xs text-amber-700 mt-2">Todas as imagens são otimizadas automaticamente em WebP para rápido carregamento.</p>
            </div>

            <ImageUploadField
              label="Logo do site"
              currentUrl={cfg.marca_logo_url || BRAND_SETTINGS.logo.imageUrl}
              tipo="logo"
              onUpload={uploadImagem}
              uploadMsg={uploadMsg?.tipo === "logo" ? uploadMsg : null}
            />

            <ImageUploadField
              label="Foto Corretor(a)"
              currentUrl={cfg.marca_foto_jessica_url || SITE_IMAGES.jessicaPortrait.url}
              tipo="foto_jessica"
              onUpload={uploadImagem}
              uploadMsg={uploadMsg?.tipo === "foto_jessica" ? uploadMsg : null}
            />

            <ImageUploadField
              label="Foto Banner"
              currentUrl={cfg.marca_foto_jessica_hero_url || SITE_IMAGES.jessicaPortrait.url}
              tipo="foto_jessica_hero"
              onUpload={uploadImagem}
              uploadMsg={uploadMsg?.tipo === "foto_jessica_hero" ? uploadMsg : null}
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-xs text-blue-700">📸 <strong>Dica:</strong> use imagens de alta qualidade. A logo funciona bem com fundo transparente (PNG).</p>
            </div>
          </div>

          <SaveBar saving={saving} onSave={salvar} />
        </div>
      )}

      {tab === "conteudo" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Personalize os textos da página inicial e da seção &quot;Sobre&quot;. Deixe em branco para usar o conteúdo padrão do sistema. Alterações ficam visíveis no site em até 1 minuto após salvar.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              💡 <strong>Hero</strong> = a primeira seção grande que o visitante vê ao abrir o site, com título, subtítulo e barra de busca de imóveis.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="texto_hero_titulo">
              Titulo do hero (pagina inicial)
            </label>
            <input
              id="texto_hero_titulo"
              type="text"
              value={cfg.texto_hero_titulo ?? ""}
              onChange={(e) => set("texto_hero_titulo", e.target.value)}
              placeholder="Encontre o imovel certo em Sorocaba e regiao"
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="texto_hero_subtitulo">
              Subtitulo / descricao do hero
            </label>
            <textarea
              id="texto_hero_subtitulo"
              value={cfg.texto_hero_subtitulo ?? ""}
              onChange={(e) => set("texto_hero_subtitulo", e.target.value)}
              rows={3}
              placeholder="Compra, venda e locacao com atendimento consultivo..."
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="texto_sobre_titulo">
              Titulo da secao Sobre
            </label>
            <input
              id="texto_sobre_titulo"
              type="text"
              value={cfg.texto_sobre_titulo ?? ""}
              onChange={(e) => set("texto_sobre_titulo", e.target.value)}
              placeholder="Atendimento consultivo para decisoes imobiliarias"
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="texto_sobre_corpo">
              Texto principal da secao Sobre
            </label>
            <textarea
              id="texto_sobre_corpo"
              value={cfg.texto_sobre_corpo ?? ""}
              onChange={(e) => set("texto_sobre_corpo", e.target.value)}
              rows={5}
              placeholder="Especialista em imoveis residenciais e comerciais em Sorocaba..."
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
          <SaveBar saving={saving} onSave={salvar} />
        </div>
      )}

      {tab === "exibicao" && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-slate-600">
            Escolha quais informações aparecem nos anuncios de imóveis: IPTU, cômodos do imóvel, link de simulador de financiamento, etc.
          </p>

          <div className="flex flex-col gap-3">
            <Toggle
              id="exibir_iptu"
              label="Exibir IPTU nas paginas de imovel"
              checked={cfg.exibir_iptu !== "false"}
              onChange={(v) => set("exibir_iptu", v ? "true" : "false")}
            />
            <Toggle
              id="exibir_comodos"
              label="Exibir listagem de comodos nas paginas de imovel"
              checked={cfg.exibir_comodos !== "false"}
              onChange={(v) => set("exibir_comodos", v ? "true" : "false")}
            />
            <Toggle
              id="ordenacao_mais_visitados"
              label="Ordenar listagem por mais visitados (quando ativo, prioriza imoveis com mais visualizacoes)"
              checked={cfg.ordenacao_mais_visitados_ativa === "true"}
              onChange={(v) => set("ordenacao_mais_visitados_ativa", v ? "true" : "false")}
            />
            <Toggle
              id="financiamento_link_ativo"
              label="Exibir link de simulacao de financiamento nas paginas de imovel"
              checked={cfg.financiamento_link_ativo === "true"}
              onChange={(v) => set("financiamento_link_ativo", v ? "true" : "false")}
            />
          </div>

          {cfg.financiamento_link_ativo === "true" && (
            <Field
              label="URL da simulacao de financiamento"
              name="financiamento_link_url"
              value={cfg.financiamento_link_url ?? ""}
              onChange={(v) => set("financiamento_link_url", v)}
              placeholder="https://..."
            />
          )}

          <SaveBar saving={saving} onSave={salvar} />
        </div>
      )}

      {tab === "whatsapp" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Configure o botão de contato via WhatsApp que aparece em cada página de imóvel. O visitante clica e abre uma conversa já com a mensagem preenchida.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              📱 <strong>Formato do número:</strong> código do país + DDD + número, sem espaços ou traços. Exemplo para São Paulo: <code className="bg-blue-100 px-1 rounded">5511999999999</code>.
            </p>
          </div>
          <Field label="Numero do WhatsApp (apenas digitos)" name="whatsapp_numero" value={cfg.whatsapp_numero ?? ""} onChange={(v) => set("whatsapp_numero", v)} placeholder="5511999999999" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="whatsapp_msg">
              Mensagem padrao
            </label>
            <textarea
              id="whatsapp_msg"
              value={cfg.whatsapp_msg ?? ""}
              onChange={(e) => set("whatsapp_msg", e.target.value)}
              rows={4}
              placeholder="Ola! Vi seu interesse no imovel e gostaria de ajudar."
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
          <SaveBar saving={saving} onSave={salvar} />
        </div>
      )}

      {tab === "notificacoes" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Configure quando e para quem o sistema envia e-mails automáticos ao receber um novo lead.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800 font-medium mb-1">⚙️ Pré-requisito técnico (feito uma vez)</p>
            <p className="text-xs text-amber-700">
              O disparo de e-mails usa o serviço Resend. As variáveis abaixo precisam estar configuradas no servidor:{" "}
              <code className="bg-amber-100 px-1 rounded">RESEND_API_KEY</code> (chave de acesso),{" "}
              <code className="bg-amber-100 px-1 rounded">RESEND_FROM</code> (e-mail remetente verificado) e{" "}
              <code className="bg-amber-100 px-1 rounded">NOTIFY_EMAIL</code> (seu e-mail para receber os avisos).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="notif_lead_email" checked={cfg.notif_lead_email !== "false"} onChange={(e) => set("notif_lead_email", e.target.checked ? "true" : "false")} className="w-4 h-4 accent-amber-500" />
            <label htmlFor="notif_lead_email" className="text-sm text-slate-700">Enviar email de notificacao para cada novo lead</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="notif_confirmacao_lead" checked={cfg.notif_confirmacao_lead !== "false"} onChange={(e) => set("notif_confirmacao_lead", e.target.checked ? "true" : "false")} className="w-4 h-4 accent-amber-500" />
            <label htmlFor="notif_confirmacao_lead" className="text-sm text-slate-700">Enviar email de confirmacao para o lead</label>
          </div>
          <SaveBar saving={saving} onSave={salvar} />
        </div>
      )}

      {tab === "tema" && (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-slate-600">
            Customize a aparência visual do site: escolha o tema (moderno, classico, minimalista), o tipo de buscador e as cores principais.
          </p>
          <p className="text-sm text-slate-500">
            Escolha o esquema de cores do site. A mudanca entra em vigor em ate 1 minuto apos salvar.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEME_PRESETS.map((preset) => {
              const ativo = (cfg.tema_preset ?? THEME_PRESETS[0].id) === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => set("tema_preset", preset.id)}
                  className={`flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-colors ${
                    ativo
                      ? "border-amber-500 bg-amber-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex gap-1">
                    {["--color-bg", "--color-accent", "--color-primary"].map((v) => (
                      <span
                        key={v}
                        className="w-5 h-5 rounded-full border border-slate-200"
                        style={{ backgroundColor: preset.tokens[v] }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{preset.name}</p>
                  <p className="text-xs text-slate-500">{preset.intent}</p>
                  {ativo && (
                    <span className="text-xs text-amber-600 font-medium">✓ Ativo</span>
                  )}
                </button>
              );
            })}
          </div>
          <SaveBar saving={saving} onSave={salvar} />
        </div>
      )}

      {tab === "integracoes" && (
        <div className="flex flex-col gap-8">

          {/* Analytics */}
          <section className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Analytics e rastreamento</p>
              <p className="text-xs text-slate-400 mt-0.5">Deixe em branco para desativar. Os scripts sao injetados automaticamente em todas as paginas.</p>
            </div>
            <Field label="Google Analytics 4 — Measurement ID" name="ga_measurement_id" value={cfg.ga_measurement_id ?? ""} onChange={(v) => set("ga_measurement_id", v)} placeholder="G-XXXXXXXXXX" />
            <Field label="Meta Pixel (Facebook/Instagram) — Pixel ID" name="meta_pixel_id" value={cfg.meta_pixel_id ?? ""} onChange={(v) => set("meta_pixel_id", v)} placeholder="123456789012345" />
            <Field label="TikTok Pixel — Pixel ID" name="tiktok_pixel_id" value={cfg.tiktok_pixel_id ?? ""} onChange={(v) => set("tiktok_pixel_id", v)} placeholder="CXXXXXXXXXXXXXXXX" />
            <Field label="Google Tag Manager — Container ID" name="gtm_container_id" value={cfg.gtm_container_id ?? ""} onChange={(v) => set("gtm_container_id", v)} placeholder="GTM-XXXXXXX" />
            <Field label="LinkedIn Insight Tag — Partner ID" name="linkedin_insight_tag" value={cfg.linkedin_insight_tag ?? ""} onChange={(v) => set("linkedin_insight_tag", v)} placeholder="1234567" />
            <Field label="reCAPTCHA v3 — Site Key (publica)" name="recaptcha_site_key" value={cfg.recaptcha_site_key ?? ""} onChange={(v) => set("recaptcha_site_key", v)} placeholder="6Le..." />
          </section>

          <hr className="border-slate-200" />

          {/* Chat ao vivo */}
          <section className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Chat ao vivo</p>
              <p className="text-xs text-slate-400 mt-0.5">Apenas um provedor pode estar ativo por vez. O widget aparece em todas as paginas publicas.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {(["none", "tawk", "jivo", "crisp"] as const).map((p) => (
                <label key={p} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="chat_ao_vivo_provider"
                    value={p}
                    checked={(cfg.chat_ao_vivo_provider ?? "none") === p}
                    onChange={() => set("chat_ao_vivo_provider", p)}
                    className="accent-amber-500"
                  />
                  <span className="text-sm text-slate-700">
                    {p === "none" ? "Desativado" : p === "tawk" ? "Tawk.to" : p === "jivo" ? "JivoChat" : "Crisp"}
                  </span>
                </label>
              ))}
            </div>
            {cfg.chat_ao_vivo_provider && cfg.chat_ao_vivo_provider !== "none" && (
              <Field
                label={`ID${cfg.chat_ao_vivo_provider === "tawk" ? " / URL embed do Tawk.to" : cfg.chat_ao_vivo_provider === "jivo" ? " do JivoChat" : " do Crisp (Website ID)"}`}
                name="chat_ao_vivo_id"
                value={cfg.chat_ao_vivo_id ?? ""}
                onChange={(v) => set("chat_ao_vivo_id", v)}
                placeholder={
                  cfg.chat_ao_vivo_provider === "tawk"
                    ? "https://embed.tawk.to/xxx/yyy"
                    : cfg.chat_ao_vivo_provider === "jivo"
                    ? "xxxxxxxx"
                    : "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                }
              />
            )}
          </section>

          <hr className="border-slate-200" />

          {/* CRM */}
          <section className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">CRM externo</p>
              <p className="text-xs text-slate-400 mt-0.5">Quando ativo, leads criados no site sao enviados automaticamente para o CRM.</p>
            </div>

            <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <Toggle
                id="crm_rdstation_ativo"
                label="RD Station Marketing — sincronizar leads"
                checked={cfg.crm_rdstation_ativo === "true"}
                onChange={(v) => set("crm_rdstation_ativo", v ? "true" : "false")}
              />
              {cfg.crm_rdstation_ativo === "true" && (
                <Field
                  label="Token publico do RD Station"
                  name="crm_rdstation_token"
                  value={cfg.crm_rdstation_token ?? ""}
                  onChange={(v) => set("crm_rdstation_token", v)}
                  placeholder="seu-token-publico-rd"
                />
              )}
            </div>

            <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <Toggle
                id="crm_hubspot_ativo"
                label="HubSpot — sincronizar leads"
                checked={cfg.crm_hubspot_ativo === "true"}
                onChange={(v) => set("crm_hubspot_ativo", v ? "true" : "false")}
              />
              {cfg.crm_hubspot_ativo === "true" && (
                <Field
                  label="Access Token do HubSpot (Private App)"
                  name="crm_hubspot_token"
                  value={cfg.crm_hubspot_token ?? ""}
                  onChange={(v) => set("crm_hubspot_token", v)}
                  placeholder="pat-eu1-..."
                />
              )}
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Scripts livres */}
          <section className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Scripts customizados</p>
              <div className="mt-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700">
                  ⚠️ Cole apenas scripts de fontes confiaveis. Aceita snippet completo com tags &lt;script&gt;...&lt;/script&gt; ou apenas o JS. Scripts maliciosos comprometem o site e os visitantes.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="script_head">
                Script no &lt;head&gt; (todas as paginas)
              </label>
              <textarea
                id="script_head"
                value={cfg.script_head ?? ""}
                onChange={(e) => set("script_head", e.target.value)}
                rows={5}
                placeholder="<script>\n  // seu codigo aqui\n</script>"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="script_body">
                Script antes de &lt;/body&gt; (todas as paginas)
              </label>
              <textarea
                id="script_body"
                value={cfg.script_body ?? ""}
                onChange={(e) => set("script_body", e.target.value)}
                rows={5}
                placeholder="<script>\n  // seu codigo aqui\n</script>"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
              />
            </div>
          </section>

          <SaveBar saving={saving} onSave={salvar} />
        </div>
      )}

      {tab === "webhooks" && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-slate-600">
              Webhooks permitem que este site avise automaticamente outros sistemas (n8n, Make, Zapier, seu próprio servidor) quando algo acontece.
            </p>
            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700 font-medium mb-1">📡 Eventos disponíveis</p>
              <ul className="text-xs text-blue-700 list-disc ml-4 space-y-1">
                <li><strong>lead.criado</strong> — disparado a cada novo lead recebido pelo site.</li>
                <li><strong>lead.status_alterado</strong> — disparado quando você muda o status de um lead no CRM.</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2">O sistema envia um POST com o payload JSON do evento para a URL cadastrada. A URL deve retornar HTTP 2xx para confirmar o recebimento.</p>
            </div>
          </div>
          <form onSubmit={criarWebhook} className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">Novo webhook</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nome" name="wh_nome" value={newWh.nome} onChange={(v) => setNewWh((p) => ({ ...p, nome: v }))} placeholder="Minha integracao" />
              <Field label="URL" name="wh_url" value={newWh.url} onChange={(v) => setNewWh((p) => ({ ...p, url: v }))} placeholder="https://..." />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Evento</label>
              <select value={newWh.evento} onChange={(e) => setNewWh((p) => ({ ...p, evento: e.target.value }))} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="lead.criado">lead.criado</option>
                <option value="lead.status_alterado">lead.status_alterado</option>
              </select>
            </div>
            <button type="submit" disabled={whSaving || !newWh.nome || !newWh.url} className="self-start px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
              {whSaving ? "Salvando..." : "Adicionar webhook"}
            </button>
          </form>

          {wLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : webhooks.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Nenhum webhook cadastrado.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {webhooks.map((wh) => (
                <div key={wh.id} className={`flex flex-col sm:flex-row sm:items-center gap-2 p-4 rounded-xl border ${wh.ativo ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{wh.nome}</p>
                    <p className="text-xs text-slate-400 truncate">{wh.url}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">{wh.evento}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleWebhook(wh.id, wh.ativo)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${wh.ativo ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {wh.ativo ? "Ativo" : "Inativo"}
                    </button>
                    <button onClick={() => deletarWebhook(wh.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
