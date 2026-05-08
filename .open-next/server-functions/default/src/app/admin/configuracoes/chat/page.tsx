"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Provider = "groq" | "openai" | "anthropic" | "gemini";
type Tom = "amigavel" | "formal" | "neutro";

type ChatConfig = {
  nome: string;
  tom: Tom;
  boasVindas: string;
  gatilhoWhatsApp: string;
  ctaWhatsApp: string;
};

type ChatMsg = { role: "user" | "assistant"; content: string };

// ─── Dados dos providers ──────────────────────────────────────────────────────

const PROVIDERS: Array<{
  id: Provider;
  nome: string;
  descricao: string;
  recomendado?: boolean;
}> = [
  {
    id: "groq",
    nome: "Groq",
    descricao: "Gratuito • Llama 3 • Muito rapido",
    recomendado: true,
  },
  {
    id: "openai",
    nome: "OpenAI",
    descricao: "GPT-4o mini • Pago por uso",
  },
  {
    id: "anthropic",
    nome: "Anthropic",
    descricao: "Claude Haiku • Pago por uso",
  },
  {
    id: "gemini",
    nome: "Google Gemini",
    descricao: "Gemini 1.5 Flash • Cota gratuita",
  },
];

const GUIAS: Record<
  Provider,
  { passos: string[]; link: string; placeholder: string }
> = {
  groq: {
    passos: [
      "Acesse console.groq.com e crie uma conta gratuita.",
      'No menu lateral, clique em "API Keys" e depois "Create API Key".',
      "Copie a chave gerada — ela comeca com gsk_",
      "Cole a chave no campo abaixo e clique em Testar Conexao.",
    ],
    link: "https://console.groq.com",
    placeholder: "gsk_...",
  },
  openai: {
    passos: [
      "Acesse platform.openai.com e faca login.",
      'Clique no seu perfil > "API Keys" > "Create new secret key".',
      "Adicione creditos em Billing (minimo $5) para usar a API.",
      "Copie a chave — ela comeca com sk-",
    ],
    link: "https://platform.openai.com/api-keys",
    placeholder: "sk-...",
  },
  anthropic: {
    passos: [
      "Acesse console.anthropic.com e crie uma conta.",
      'Em "API Keys", clique em "Create Key".',
      "Adicione creditos em Billing.",
      "Copie a chave — ela comeca com sk-ant-",
    ],
    link: "https://console.anthropic.com",
    placeholder: "sk-ant-...",
  },
  gemini: {
    passos: [
      "Acesse aistudio.google.com e faca login com sua conta Google.",
      'Clique em "Get API Key" > "Create API key in new project".',
      "Copie a chave gerada.",
      "Cota gratuita disponivel — sem precisar de cartao de credito.",
    ],
    link: "https://aistudio.google.com/app/apikey",
    placeholder: "AIza...",
  },
};

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function StepIndicator({
  atual,
  total,
}: {
  atual: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <div key={n} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              n < atual
                ? "bg-green-500 text-white"
                : n === atual
                  ? "bg-amber-500 text-white"
                  : "bg-slate-200 text-slate-500"
            }`}
          >
            {n < atual ? "✓" : n}
          </div>
          {n < total && (
            <div
              className={`h-0.5 w-8 transition-colors ${n < atual ? "bg-green-500" : "bg-slate-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Campo({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  rows,
  hint,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      )}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ─── Preview de chat ──────────────────────────────────────────────────────────

function PreviewChat({ boasVindas, nome }: { boasVindas: string; nome: string }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "assistant", content: boasVindas },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function enviar() {
    const text = input.trim();
    if (!text || loading) return;

    const atualizadas: ChatMsg[] = [
      ...msgs,
      { role: "user", content: text },
    ];
    setMsgs(atualizadas);
    setInput("");
    setLoading(true);
    setErro("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: atualizadas.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok || !res.body) {
        const txt = await res.text();
        setErro(txt || "Erro ao chamar o chat.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text2 = "";
      setMsgs((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text2 += decoder.decode(value, { stream: true });
        const exibido = text2.replace("[WHATSAPP_CTA]", "").trim();
        setMsgs((prev) => {
          const copia = [...prev];
          copia[copia.length - 1] = { role: "assistant", content: exibido };
          return copia;
        });
      }
    } catch {
      setErro("Erro de conexao. Verifique se o servidor esta rodando.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* header */}
      <div className="bg-amber-500 text-white px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
          IA
        </div>
        <span className="font-semibold text-sm">{nome}</span>
        <span className="ml-auto text-xs opacity-75">Preview</span>
      </div>

      {/* mensagens */}
      <div className="h-72 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-amber-500 text-white rounded-br-sm"
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
              }`}
            >
              {m.content || (loading && m.role === "assistant" ? "..." : "")}
            </div>
          </div>
        ))}
        {erro && (
          <p className="text-xs text-red-500 text-center">{erro}</p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="bg-white border-t border-slate-200 flex gap-2 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Digite uma mensagem de teste..."
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          disabled={loading}
        />
        <button
          onClick={enviar}
          disabled={loading || !input.trim()}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-amber-600 transition-colors"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}

// ─── Wizard principal ─────────────────────────────────────────────────────────

export default function ChatIaWizardPage() {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState<Provider>("groq");
  const [apiKey, setApiKey] = useState("");
  const [mostrarKey, setMostrarKey] = useState(false);
  const [testeStatus, setTesteStatus] = useState<
    "idle" | "testing" | "ok" | "erro"
  >("idle");
  const [testeErro, setTesteErro] = useState("");
  const [config, setConfig] = useState<ChatConfig>({
    nome: "Assistente JCNI",
    tom: "amigavel",
    boasVindas:
      "Ola! Sou o assistente virtual da Jessica Campos. Como posso ajudar voce a encontrar o imovel ideal?",
    gatilhoWhatsApp: "o cliente quiser agendar uma visita ou tiver interesse concreto em um imovel",
    ctaWhatsApp: "Conversar com a Jessica pelo WhatsApp",
  });
  const [salvando, setSalvando] = useState(false);
  const [salvoOk, setSalvoOk] = useState(false);
  const [ativando, setAtivando] = useState(false);
  const [ativoOk, setAtivoOk] = useState(false);
  const [erroGeral, setErroGeral] = useState("");

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function testarConexao() {
    if (!apiKey.trim()) return;
    setTesteStatus("testing");
    setTesteErro("");
    try {
      const res = await fetch("/api/admin/chat/testar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });
      const data = (await res.json()) as { ok: boolean; erro?: string };
      if (data.ok) {
        setTesteStatus("ok");
      } else {
        setTesteStatus("erro");
        setTesteErro(data.erro ?? "Erro desconhecido.");
      }
    } catch {
      setTesteStatus("erro");
      setTesteErro("Falha de rede ao testar conexao.");
    }
  }

  async function salvarESeguir() {
    setSalvando(true);
    setErroGeral("");
    try {
      const res = await fetch("/api/admin/chat/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          nome: config.nome,
          tom: config.tom,
          boasVindas: config.boasVindas,
          gatilhoWhatsApp: config.gatilhoWhatsApp,
          ctaWhatsApp: config.ctaWhatsApp,
          ativo: false,
        }),
      });
      if (!res.ok) throw new Error("Falha ao salvar.");
      setSalvoOk(true);
      setStep(5);
    } catch (e) {
      setErroGeral(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function ativarNoSite() {
    setAtivando(true);
    setErroGeral("");
    try {
      const res = await fetch("/api/admin/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_ativo: "true" }),
      });
      if (!res.ok) throw new Error("Falha ao ativar.");
      setAtivoOk(true);
    } catch (e) {
      setErroGeral(e instanceof Error ? e.message : "Erro ao ativar.");
    } finally {
      setAtivando(false);
    }
  }

  async function desativar() {
    await fetch("/api/admin/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_ativo: "false" }),
    });
    setAtivoOk(false);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Topo */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/configuracoes"
          className="text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Voltar para Configuracoes"
        >
          ←
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Chat IA</h1>
          <p className="text-sm text-slate-500">
            Configure o assistente inteligente do site em 5 passos.
          </p>
        </div>
      </div>

      {/* Indicador */}
      <StepIndicator atual={step} total={5} />

      {/* ── Passo 1: Escolher provider ─────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              1. Escolha o provedor de IA
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              O provedor e o servico que vai gerar as respostas do assistente.
              Recomendamos o Groq — e gratuito e muito rapido.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-colors ${
                  provider === p.id
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-semibold text-slate-800 text-sm">
                    {p.nome}
                  </span>
                  {p.recomendado && (
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Recomendado
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">{p.descricao}</span>
                {provider === p.id && (
                  <span className="text-xs text-amber-600 font-medium mt-1">
                    ✓ Selecionado
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className="self-end bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
          >
            Continuar →
          </button>
        </div>
      )}

      {/* ── Passo 2: Guia do provider ──────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              2. Como obter sua chave de API — {PROVIDERS.find((p) => p.id === provider)?.nome}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Siga os passos abaixo para criar sua chave gratuitamente.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 flex flex-col gap-4 border border-slate-200">
            {GUIAS[provider].passos.map((passo, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700">{passo}</p>
              </div>
            ))}
          </div>

          <a
            href={GUIAS[provider].link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:border-amber-400 hover:text-amber-600 transition-colors self-start"
          >
            Acessar {PROVIDERS.find((p) => p.id === provider)?.nome} ↗
          </a>

          <div className="flex gap-3 justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-slate-500 hover:text-slate-700 text-sm font-medium"
            >
              ← Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Ja tenho a chave →
            </button>
          </div>
        </div>
      )}

      {/* ── Passo 3: Colar chave + testar ─────────────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              3. Cole sua chave de API e teste a conexao
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              A chave sera salva de forma criptografada no banco de dados.
              Nunca e exposta publicamente.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="apiKey"
              className="text-sm font-medium text-slate-700"
            >
              Chave de API —{" "}
              {PROVIDERS.find((p) => p.id === provider)?.nome}
            </label>
            <div className="flex gap-2">
              <input
                id="apiKey"
                type={mostrarKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTesteStatus("idle");
                }}
                placeholder={GUIAS[provider].placeholder}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setMostrarKey((v) => !v)}
                className="border border-slate-300 rounded-lg px-3 text-sm text-slate-500 hover:text-slate-700"
              >
                {mostrarKey ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {/* Status do teste */}
          {testeStatus === "ok" && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm text-green-700">
                Conexao OK! Provedor respondeu com sucesso.
              </span>
            </div>
          )}
          {testeStatus === "erro" && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                Falha na conexao
              </p>
              <p className="text-xs text-red-500 mt-1 break-all">{testeErro}</p>
            </div>
          )}

          <div className="flex gap-3 items-center flex-wrap">
            <button
              onClick={testarConexao}
              disabled={!apiKey.trim() || testeStatus === "testing"}
              className="bg-slate-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-40"
            >
              {testeStatus === "testing" ? "Testando..." : "Testar Conexao"}
            </button>
            {testeStatus === "ok" && (
              <button
                onClick={() => setStep(4)}
                className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
              >
                Continuar →
              </button>
            )}
          </div>

          <button
            onClick={() => setStep(2)}
            className="self-start text-slate-500 hover:text-slate-700 text-sm font-medium"
          >
            ← Voltar
          </button>
        </div>
      )}

      {/* ── Passo 4: Configurar comportamento ─────────────────────────────── */}
      {step === 4 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              4. Configure o comportamento do assistente
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Personalize o nome, tom e mensagens do assistente.
            </p>
          </div>

          <div className="flex flex-col gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
            <Campo
              label="Nome do assistente"
              id="chat-nome"
              value={config.nome}
              onChange={(v) => setConfig((c) => ({ ...c, nome: v }))}
              placeholder="Ex.: Assistente JCNI"
              hint='Como o assistente se apresenta para o visitante.'
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Tom de atendimento
              </label>
              <div className="flex gap-3 flex-wrap">
                {(
                  [
                    { id: "amigavel", label: "Amigavel" },
                    { id: "formal", label: "Formal" },
                    { id: "neutro", label: "Neutro" },
                  ] as Array<{ id: Tom; label: string }>
                ).map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="tom"
                      value={t.id}
                      checked={config.tom === t.id}
                      onChange={() => setConfig((c) => ({ ...c, tom: t.id }))}
                      className="accent-amber-500"
                    />
                    <span className="text-sm text-slate-700">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Campo
              label="Mensagem de boas-vindas"
              id="chat-boasvindas"
              value={config.boasVindas}
              onChange={(v) => setConfig((c) => ({ ...c, boasVindas: v }))}
              rows={3}
              hint="Primeira mensagem que o visitante ve ao abrir o chat."
            />

            <Campo
              label="Quando redirecionar para o WhatsApp?"
              id="chat-gatilho"
              value={config.gatilhoWhatsApp}
              onChange={(v) =>
                setConfig((c) => ({ ...c, gatilhoWhatsApp: v }))
              }
              placeholder="Ex.: o cliente quiser agendar uma visita"
              hint="Descreva a situacao em que o assistente deve sugerir o WhatsApp."
            />

            <Campo
              label="Texto do botao de WhatsApp no chat"
              id="chat-cta"
              value={config.ctaWhatsApp}
              onChange={(v) => setConfig((c) => ({ ...c, ctaWhatsApp: v }))}
              placeholder="Ex.: Conversar com a Jessica pelo WhatsApp"
            />
          </div>

          {erroGeral && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {erroGeral}
            </p>
          )}

          <div className="flex gap-3 justify-between items-center">
            <button
              onClick={() => setStep(3)}
              className="text-slate-500 hover:text-slate-700 text-sm font-medium"
            >
              ← Voltar
            </button>
            <button
              onClick={salvarESeguir}
              disabled={salvando || !config.nome.trim()}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-40"
            >
              {salvando ? "Salvando..." : "Salvar e Pré-visualizar →"}
            </button>
          </div>
        </div>
      )}

      {/* ── Passo 5: Preview + ativar ──────────────────────────────────────── */}
      {step === 5 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              5. Pré-visualizar e ativar
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Teste o assistente abaixo antes de ativar no site.
            </p>
          </div>

          {salvoOk && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-green-700">
                Configuracao salva com sucesso.
              </span>
            </div>
          )}

          <PreviewChat boasVindas={config.boasVindas} nome={config.nome} />

          {ativoOk ? (
            <div className="flex flex-col gap-3 bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-green-700">
                ✓ Chat IA ativo no site!
              </p>
              <p className="text-xs text-green-600">
                O botao de chat aparece agora na pagina inicial para todos os
                visitantes.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 underline"
                >
                  Ver no site ↗
                </a>
                <button
                  onClick={desativar}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Desativar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {erroGeral && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {erroGeral}
                </p>
              )}
              <button
                onClick={ativarNoSite}
                disabled={ativando}
                className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors disabled:opacity-40"
              >
                {ativando ? "Ativando..." : "Ativar Chat IA no site"}
              </button>
              <p className="text-xs text-slate-400 text-center">
                O botao de chat aparecera no canto inferior esquerdo do site.
                Voce pode desativar a qualquer momento.
              </p>
            </div>
          )}

          <button
            onClick={() => setStep(4)}
            className="self-start text-slate-500 hover:text-slate-700 text-sm font-medium"
          >
            ← Editar configuracoes
          </button>
        </div>
      )}
    </div>
  );
}
