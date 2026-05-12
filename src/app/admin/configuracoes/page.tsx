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
  conteudo: "Personalize os textos principais: título e subtítulo do hero, seção Sobre, Radar e OG image para compartilhamento.",
  exibicao: "Controle o que é exibido nos anúncios: IPTU, cômodos e link de simulação de financiamento.",
  whatsapp: "Número e mensagem padrão para o botão de contato via WhatsApp que aparece em cada imóvel.",
  notificacoes: "Receba um e-mail a cada novo lead e configure confirmação automática para o interessado.",
  integracoes: "Analytics (GA4, Meta Pixel, GTM), chat ao vivo (Tawk, JivoChat, Crisp), CRM e scripts personalizados.",
  tema: "Escolha a identidade visual do site: paleta de cores, estilo geral e aparência dos botões.",
  webhooks: "Dispare chamadas HTTP automáticas para outros sistemas quando leads chegam ou mudam de status.",
};

const TAB_GUIDES: Record<TabId, { titulo: string; items: string[] }> = {
  geral: {
    titulo: "Como usar a aba Geral",
    items: [
      "Nome da empresa, telefone, e-mail, endereço e CRECI aparecem no rodapé do site e em e-mails de contato.",
      "Logo: PNG com fundo transparente funciona melhor. Recomendado: 240x60px. Aparece no cabeçalho e no rodapé.",
      "Foto Corretor(a): foto quadrada 400×400px, usada na seção Sobre da página inicial.",
      "Foto Banner: foto vertical/de corpo inteiro 1400×800px, exibida no topo da home como destaque.",
      "Todas as imagens são otimizadas automaticamente para WebP pelo servidor.",
    ],
  },
  conteudo: {
    titulo: "Como usar a aba Conteúdo",
    items: [
      "Hero = a primeira seção que o visitante vê ao abrir o site. Título curto e chamativo converte melhor.",
      "Seção Sobre: conte a história da Jessica em 2-4 frases, destacando experiência e region.",
      "Radar JCNI: texto que aparece na faixa escura \"Receba indicações…\". Pode personalizar título e descrição do card.",
      "OG Image: imagem exibida quando o link do site é compartilhado no WhatsApp, Instagram e redes sociais. Recomendado 1200×630px.",
      "Deixe em branco para usar os valores padrão do sistema. Alterações ficam visíveis em até 1 minuto.",
    ],
  },
  exibicao: {
    titulo: "Como usar a aba Exibição",
    items: [
      "IPTU: se desativado, o valor do IPTU não aparece nas páginas de imóvel, útil quando não se tem a informação.",
      "Cômodos: oculta quartos/banheiros/vagas nos cards de listagem se desativado.",
      "Link de financiamento: ativa um botão \"Simular financiamento\" em cada imóvel, apontando para a URL configurada.",
      "Imóveis mais visitados: reordena a listagem para mostrar os mais acessados primeiro.",
    ],
  },
  whatsapp: {
    titulo: "Como usar a aba WhatsApp",
    items: [
      "Número no formato internacional sem '+': ex. 5515999999999.",
      "A mensagem padrão é pré-preenchida quando o visitante clica no botão de WhatsApp. Use variáveis como {imovel} se o template suportar.",
      "O botão flutuante aparece em todas as páginas públicas do site.",
    ],
  },
  notificacoes: {
    titulo: "Como usar a aba Notificações",
    items: [
      "E-mail de chegada de lead: você recebe um e-mail quando alguém preenche um formulário no site.",
      "Confirmação automática: o interessado recebe um e-mail confirmando que a mensagem foi recebida.",
      "Os e-mails são enviados via Resend com template HTML responsivo.",
      "Se o e-mail de destino não for preenchido aqui, usa o e-mail geral da aba Geral.",
    ],
  },
  integracoes: {
    titulo: "Como usar a aba Integrações",
    items: [
      "Analytics: cole apenas o ID do serviço (não o script inteiro). Deixe em branco para desativar.",
      "GA4: Measurement ID começa com G- (ex: G-XXXXXXXXXX).",
      "Meta Pixel: só o número do Pixel ID (15 dígitos).",
      "Chat ao vivo: apenas um provedor ativo por vez. Selecione o card e preencha o ID.",
      "CRM: quando ativo, leads capturados são enviados automaticamente. O token é secreto; mantenha em sigilo.",
      "Scripts: cole scripts de terceiros confiáveis. Scripts maliciosos comprometem o site e os visitantes.",
    ],
  },
  tema: {
    titulo: "Como usar a aba Tema",
    items: [
      "Escolha entre os presets disponíveis: cada um define paleta de cores e tipografia do site inteiro.",
      "A mudança é imediata após salvar, sem necessidade de redesploy.",
      "Os presets são testados para contraste e acessibilidade (WCAG AA).",
    ],
  },
  webhooks: {
    titulo: "Como usar a aba Webhooks",
    items: [
      "Webhook = uma chamada HTTP automática para outro sistema quando um evento ocorre.",
      "Eventos disponíveis: lead.criado (novo lead), lead.status (lead mudou de etapa).",
      "A URL deve aceitar POST com JSON. O payload inclui os dados do lead.",
      "Use para integrar com n8n, Zapier, Make, ou qualquer sistema que aceite HTTP.",
      "Se a requisição falhar, o sistema registra o erro mas não tenta novamente automaticamente.",
    ],
  },
};

type Webhook = {
  id: string;
  nome: string;
  url: string;
  evento: string;
  ativo: boolean;
};

type ImageUploadTipo = "logo" | "foto_jessica" | "foto_jessica_hero" | "og_image" | "hero_bg";

function AccordionSection({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-xl border transition-colors ${open ? "border-amber-200 bg-white" : "border-slate-200 bg-slate-50"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <span
          className={`shrink-0 w-5 h-5 flex items-center justify-center text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-amber-500" : ""}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function ConteudoCard({
  titulo,
  descricao,
  valor,
  editing,
  onToggle,
  children,
}: {
  titulo: string;
  descricao: string;
  valor: string;
  editing: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{titulo}</p>
          <p className="mt-1 text-xs text-slate-500">{descricao}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          {editing ? "Fechar" : "Editar"}
        </button>
      </div>

      <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 whitespace-pre-line">
        {valor.trim() || "Sem conteúdo preenchido."}
      </div>

      {editing && <div className="mt-3 flex flex-col gap-3">{children}</div>}
    </section>
  );
}

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

function SocialField({
  label,
  value,
  active,
  onToggle,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  active: boolean;
  onToggle: (v: boolean) => void;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{label}</p>
          <p className="text-xs text-slate-500">Mostra o icone elegante no rodape quando estiver ativo.</p>
        </div>
        <Toggle id={`toggle_${label}`} label={active ? "Ativo" : "Desativado"} checked={active} onChange={onToggle} />
      </div>
      <Field label={`URL do ${label}`} name={label.toLowerCase()} value={value} onChange={onChange} placeholder={placeholder} />
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
  tipo: ImageUploadTipo;
  onUpload: (file: File, tipo: ImageUploadTipo) => Promise<void>;
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
  const [ajudaAberta, setAjudaAberta] = useState(false);
  const [conteudoEditando, setConteudoEditando] = useState<Record<string, boolean>>({});
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

  function toggleConteudoCard(id: string) {
    setConteudoEditando((prev) => ({ ...prev, [id]: !prev[id] }));
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

  async function uploadImagem(file: File, tipo: ImageUploadTipo) {
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
              : tipo === "foto_jessica_hero"
                ? "marca_foto_jessica_hero_url"
                : tipo === "hero_bg"
                  ? "hero_bg_url"
                  : "og_image_url";
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
      <div className="flex items-center justify-center min-h-75">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Configuracoes</h1>
        <button
          type="button"
          onClick={() => setAjudaAberta((v) => !v)}
          title="Guia desta aba"
          className={`w-8 h-8 rounded-full border-2 font-bold text-sm flex items-center justify-center transition-colors ${
            ajudaAberta ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-300 hover:border-slate-400"
          }`}
        >
          ?
        </button>
      </div>

      {ajudaAberta && (
        <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs font-bold text-blue-700 mb-2">{TAB_GUIDES[tab].titulo}</p>
          <ul className="text-xs text-blue-700 space-y-1.5 pl-4 list-disc leading-relaxed">
            {TAB_GUIDES[tab].items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setAjudaAberta(false); }}
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

      <div className="mb-4 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500">{TAB_DESCRIPTIONS[tab]}</p>
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
        <div className="flex flex-col gap-4">
          <AccordionSection
            title="Informações da empresa"
            subtitle="Nome, telefone, e-mail, endereço e CRECI — aparecem no site público."
            defaultOpen={true}
          >
            <div className="flex flex-col gap-4 pt-1">
            <Field label="Nome da empresa" name="empresa_nome" value={cfg.empresa_nome ?? ""} onChange={(v) => set("empresa_nome", v)} placeholder="Jessica Campos Negocios Imobiliarios" />
            <Field label="Telefone de contato" name="empresa_telefone" value={cfg.empresa_telefone ?? ""} onChange={(v) => set("empresa_telefone", v)} placeholder="(11) 99999-9999" />
            <Field label="E-mail de contato" name="empresa_email" value={cfg.empresa_email ?? ""} onChange={(v) => set("empresa_email", v)} type="email" placeholder="contato@jessicacampos.com" />
            <Field label="Endereco" name="empresa_endereco" value={cfg.empresa_endereco ?? ""} onChange={(v) => set("empresa_endereco", v)} placeholder="Rua, numero - Bairro, Cidade - UF" />
            <Field label="CRECI" name="empresa_creci" value={cfg.empresa_creci ?? ""} onChange={(v) => set("empresa_creci", v)} placeholder="CRECI 123456" />
            </div>
          </AccordionSection>

          <AccordionSection
            title="Redes sociais"
            subtitle="Links exibidos no rodapé do site. Ative apenas o que quiser mostrar."
          >
            <div className="flex flex-col gap-3 pt-1">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs text-slate-600">
                Estes links aparecem no rodapé público do site com os ícones oficiais. Ative apenas o que quiser exibir.
              </p>
            </div>
            <div className="grid gap-3">
              <SocialField
                label="Instagram"
                value={cfg.social_instagram_url ?? ""}
                active={cfg.social_instagram_ativo !== "false"}
                onToggle={(v) => set("social_instagram_ativo", v ? "true" : "false")}
                onChange={(v) => set("social_instagram_url", v)}
                placeholder="https://instagram.com/..."
              />
              <SocialField
                label="WhatsApp"
                value={cfg.social_whatsapp_url ?? ""}
                active={cfg.social_whatsapp_ativo === "true"}
                onToggle={(v) => set("social_whatsapp_ativo", v ? "true" : "false")}
                onChange={(v) => set("social_whatsapp_url", v)}
                placeholder="https://wa.me/5511999999999"
              />
              <SocialField
                label="Facebook"
                value={cfg.social_facebook_url ?? ""}
                active={cfg.social_facebook_ativo === "true"}
                onToggle={(v) => set("social_facebook_ativo", v ? "true" : "false")}
                onChange={(v) => set("social_facebook_url", v)}
                placeholder="https://facebook.com/..."
              />
              <SocialField
                label="LinkedIn"
                value={cfg.social_linkedin_url ?? ""}
                active={cfg.social_linkedin_ativo === "true"}
                onToggle={(v) => set("social_linkedin_ativo", v ? "true" : "false")}
                onChange={(v) => set("social_linkedin_url", v)}
                placeholder="https://linkedin.com/in/..."
              />
              <SocialField
                label="TikTok"
                value={cfg.social_tiktok_url ?? ""}
                active={cfg.social_tiktok_ativo === "true"}
                onToggle={(v) => set("social_tiktok_ativo", v ? "true" : "false")}
                onChange={(v) => set("social_tiktok_url", v)}
                placeholder="https://tiktok.com/@..."
              />
            </div>
            </div>
          </AccordionSection>

          <AccordionSection
            title="Imagens de marca"
            subtitle="Logo, foto da corretora e imagens do banner principal."
          >
            <div className="flex flex-col gap-4 pt-1">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800 font-medium mb-2 flex items-center gap-1">
                <span>💡</span> Como suas imagens aparecem:
              </p>
              <ul className="text-xs text-amber-700 space-y-1 ml-5 list-disc">
                <li><strong>Logo:</strong> Topo esquerdo do site e em emails</li>
                <li><strong>Foto Corretor(a):</strong> Seção &quot;Sobre&quot; (foto quadrada, 400x400px recomendado)</li>
                <li><strong>Foto Banner:</strong> Retrato da corretora sobreposto ao hero (corpo inteiro, 1400x800px recomendado)</li>
                <li><strong>Fundo do Banner:</strong> Imagem de fundo do hero principal (paisagem, 1920×1080px recomendado)</li>
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
              label="Foto Banner (retrato da corretora)"
              currentUrl={cfg.marca_foto_jessica_hero_url || SITE_IMAGES.jessicaPortrait.url}
              tipo="foto_jessica_hero"
              onUpload={uploadImagem}
              uploadMsg={uploadMsg?.tipo === "foto_jessica_hero" ? uploadMsg : null}
            />

            <ImageUploadField
              label="Imagem de Fundo do Banner (Hero)"
              currentUrl={cfg.hero_bg_url || ""}
              tipo="hero_bg"
              onUpload={uploadImagem}
              uploadMsg={uploadMsg?.tipo === "hero_bg" ? uploadMsg : null}
            />
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2">
              <p className="text-xs text-slate-500">🖼️ <strong>Fundo do hero:</strong> imagem exibida como plano de fundo no banner principal. Recomendado 1920×1080px, formato paisagem. Deixe sem imagem para usar o padrão do tema.</p>
            </div>
            </div>
          </AccordionSection>

          <SaveBar saving={saving} onSave={salvar} />
        </div>
      )}

      {tab === "conteudo" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            O painel já carrega o conteúdo atual do site. Clique em Editar apenas no bloco que quiser ajustar. Alterações ficam visíveis em até 1 minuto após salvar.
          </p>
          <ConteudoCard
            titulo="Hero"
            descricao="Primeira seção da home, com título e subtítulo principais."
            valor={`${cfg.texto_hero_titulo ?? ""}\n\n${cfg.texto_hero_subtitulo ?? ""}`}
            editing={Boolean(conteudoEditando.hero)}
            onToggle={() => toggleConteudoCard("hero")}
          >
            <Field
              label="Título do hero"
              name="texto_hero_titulo"
              value={cfg.texto_hero_titulo ?? ""}
              onChange={(v) => set("texto_hero_titulo", v)}
              placeholder="Encontre o imóvel certo em Sorocaba e região"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="texto_hero_subtitulo">
                Subtítulo do hero
              </label>
              <textarea
                id="texto_hero_subtitulo"
                value={cfg.texto_hero_subtitulo ?? ""}
                onChange={(e) => set("texto_hero_subtitulo", e.target.value)}
                rows={3}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </ConteudoCard>

          <ConteudoCard
            titulo="Sobre a Jéssica"
            descricao="Bloco institucional da home com posicionamento e apresentação da corretora."
            valor={`${cfg.texto_sobre_titulo ?? ""}\n\n${cfg.texto_sobre_corpo ?? ""}`}
            editing={Boolean(conteudoEditando.sobre)}
            onToggle={() => toggleConteudoCard("sobre")}
          >
            <Field
              label="Título da seção Sobre"
              name="texto_sobre_titulo"
              value={cfg.texto_sobre_titulo ?? ""}
              onChange={(v) => set("texto_sobre_titulo", v)}
              placeholder="Atendimento consultivo para decisões imobiliárias"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="texto_sobre_corpo">
                Texto principal da seção Sobre
              </label>
              <textarea
                id="texto_sobre_corpo"
                value={cfg.texto_sobre_corpo ?? ""}
                onChange={(e) => set("texto_sobre_corpo", e.target.value)}
                rows={5}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </ConteudoCard>

          <ConteudoCard
            titulo="OG Image"
            descricao="Imagem de compartilhamento social. Agora pode ser enviada por upload ou informada por URL manual."
            valor={cfg.og_image_url ?? ""}
            editing={Boolean(conteudoEditando.og)}
            onToggle={() => toggleConteudoCard("og")}
          >
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
              <strong>OG Image</strong> é a imagem exibida quando o link é compartilhado no WhatsApp, Instagram, LinkedIn etc. Recomendado 1200×630px.
            </div>
            <ImageUploadField
              label="Imagem de compartilhamento"
              currentUrl={cfg.og_image_url ?? ""}
              tipo="og_image"
              onUpload={uploadImagem}
              uploadMsg={uploadMsg?.tipo === "og_image" ? uploadMsg : null}
            />
            <Field
              label="URL manual da OG Image"
              name="og_image_url"
              value={cfg.og_image_url ?? ""}
              onChange={(v) => set("og_image_url", v)}
              placeholder="https://exemplo.com/og-image.jpg"
            />
          </ConteudoCard>

          <ConteudoCard
            titulo="Radar JCNI"
            descricao="Faixa escura da home que explica o matching automático entre imóveis e clientes."
            valor={`${cfg.radar_titulo ?? ""}\n\n${cfg.radar_card_descricao ?? ""}`}
            editing={Boolean(conteudoEditando.radar)}
            onToggle={() => toggleConteudoCard("radar")}
          >
            <Field
              label="Título do Radar"
              name="radar_titulo"
              value={cfg.radar_titulo ?? ""}
              onChange={(v) => set("radar_titulo", v)}
              placeholder="Receba indicações quando surgir um imóvel compatível com seu perfil"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="radar_card_descricao">
                Descrição do card Radar
              </label>
              <textarea
                id="radar_card_descricao"
                value={cfg.radar_card_descricao ?? ""}
                onChange={(e) => set("radar_card_descricao", e.target.value)}
                rows={3}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </ConteudoCard>

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
        <div className="flex flex-col gap-4">

          {/* Analytics */}
          <AccordionSection
            title="Analytics e rastreamento"
            subtitle="Scripts injetados automaticamente em todas as páginas. Deixe em branco para desativar."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "ga_measurement_id", nome: "Google Analytics 4", sigla: "GA4", placeholder: "G-XXXXXXXXXX", dica: "Measurement ID" },
                { key: "meta_pixel_id", nome: "Meta Pixel", sigla: "Meta", placeholder: "123456789012345", dica: "Facebook / Instagram — Pixel ID" },
                { key: "tiktok_pixel_id", nome: "TikTok Pixel", sigla: "TikTok", placeholder: "CXXXXXXXXXXXXXXXX", dica: "Pixel ID" },
                { key: "gtm_container_id", nome: "Google Tag Manager", sigla: "GTM", placeholder: "GTM-XXXXXXX", dica: "Container ID" },
                { key: "linkedin_insight_tag", nome: "LinkedIn Insight Tag", sigla: "LinkedIn", placeholder: "1234567", dica: "Partner ID" },
                { key: "recaptcha_site_key", nome: "reCAPTCHA v3", sigla: "reCAPTCHA", placeholder: "6Le...", dica: "Site Key publica" },
              ].map(({ key, nome, sigla, placeholder, dica }) => {
                const val = (cfg as Record<string, string | null | undefined>)[key] ?? "";
                const ativo = val.trim().length > 0;
                return (
                  <div key={key} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold shrink-0">{sigla.slice(0, 2)}</span>
                        <span className="text-sm font-semibold text-slate-800">{nome}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${ativo ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                        {ativo ? "Configurado" : "Inativo"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{dica}</p>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => set(key as keyof typeof cfg, e.target.value)}
                      placeholder={placeholder}
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                    />
                  </div>
                );
              })}
            </div>
          </AccordionSection>

          {/* Chat ao vivo */}
          <AccordionSection
            title="Chat ao vivo"
            subtitle="Widget de chat externo. Apenas um provedor ativo por vez."
          >
            <div className="flex flex-wrap gap-3 mb-4">
              {(["none", "tawk", "jivo", "crisp"] as const).map((p) => {
                const ativo = (cfg.chat_ao_vivo_provider ?? "none") === p;
                const label = p === "none" ? "Desativado" : p === "tawk" ? "Tawk.to" : p === "jivo" ? "JivoChat" : "Crisp";
                const desc = p === "none" ? "Sem widget de chat" : p === "tawk" ? "Gratuito e popular" : p === "jivo" ? "Multi-canal" : "Chat moderno";
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set("chat_ao_vivo_provider", p)}
                    className={`flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 text-left transition-all cursor-pointer w-36 focus:outline-none ${ativo ? "border-amber-400 bg-amber-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  >
                    <span className={`text-sm font-semibold ${ativo ? "text-amber-700" : "text-slate-700"}`}>{label}</span>
                    <span className="text-[11px] text-slate-400">{desc}</span>
                    {ativo && <span className="mt-1 text-[10px] font-bold text-amber-600 uppercase tracking-wide">Ativo</span>}
                  </button>
                );
              })}
            </div>
            {cfg.chat_ao_vivo_provider && cfg.chat_ao_vivo_provider !== "none" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <Field
                  label={`ID de configuracao do ${cfg.chat_ao_vivo_provider === "tawk" ? "Tawk.to" : cfg.chat_ao_vivo_provider === "jivo" ? "JivoChat" : "Crisp"}`}
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
              </div>
            )}
          </AccordionSection>

          {/* CRM */}
          <AccordionSection
            title="CRM externo"
            subtitle="Quando ativo, leads são enviados automaticamente para o CRM escolhido."
          >
            <div className="flex flex-col gap-3">
              {[
                { toggleKey: "crm_rdstation_ativo", tokenKey: "crm_rdstation_token", nome: "RD Station Marketing", placeholder: "seu-token-publico-rd", labelToken: "Token publico do RD Station" },
                { toggleKey: "crm_hubspot_ativo", tokenKey: "crm_hubspot_token", nome: "HubSpot", placeholder: "pat-eu1-...", labelToken: "Access Token (Private App)" },
              ].map(({ toggleKey, tokenKey, nome, placeholder, labelToken }) => {
                const ativo = (cfg as Record<string, string | null | undefined>)[toggleKey] === "true";
                return (
                  <div key={toggleKey} className={`rounded-xl border p-4 transition-all ${ativo ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-800">{nome}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ativo ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                        {ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <Toggle
                      id={toggleKey}
                      label={`Sincronizar leads com ${nome}`}
                      checked={ativo}
                      onChange={(v) => set(toggleKey as keyof typeof cfg, v ? "true" : "false")}
                    />
                    {ativo && (
                      <div className="mt-3">
                        <Field
                          label={labelToken}
                          name={tokenKey}
                          value={(cfg as Record<string, string | null | undefined>)[tokenKey] ?? ""}
                          onChange={(v) => set(tokenKey as keyof typeof cfg, v)}
                          placeholder={placeholder}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </AccordionSection>

          {/* Scripts livres */}
          <AccordionSection
            title="Scripts customizados"
            subtitle="Cole JavaScript de fontes confiáveis para carregar em todas as páginas."
          >
            <div className="flex flex-col gap-4">
              <div className="px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl flex gap-2">
                <span className="text-amber-500 text-xs mt-0.5 shrink-0">⚠</span>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Cole apenas scripts de fontes confiaveis. Aceita snippet completo com <code className="bg-amber-100 px-1 rounded">&lt;script&gt;</code> ou apenas JS puro. Scripts maliciosos comprometem o site e os visitantes.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="script_head">
                  Antes de <code className="bg-slate-100 px-1 rounded text-xs">&lt;/head&gt;</code> — em todas as paginas
                </label>
                <textarea
                  id="script_head"
                  value={cfg.script_head ?? ""}
                  onChange={(e) => set("script_head", e.target.value)}
                  rows={4}
                  placeholder={"<script>\n  // seu codigo aqui\n</script>"}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y bg-slate-50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="script_body">
                  Antes de <code className="bg-slate-100 px-1 rounded text-xs">&lt;/body&gt;</code> — em todas as paginas
                </label>
                <textarea
                  id="script_body"
                  value={cfg.script_body ?? ""}
                  onChange={(e) => set("script_body", e.target.value)}
                  rows={4}
                  placeholder={"<script>\n  // seu codigo aqui\n</script>"}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y bg-slate-50"
                />
              </div>
            </div>
          </AccordionSection>

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
