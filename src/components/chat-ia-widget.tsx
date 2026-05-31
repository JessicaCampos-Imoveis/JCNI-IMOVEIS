"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  boasVindas: string;
  ctaWhatsApp: string;
  nome: string;
  whatsappNumero: string;
  whatsappUrl?: string;
};

export function ChatIaWidget({
  boasVindas,
  ctaWhatsApp,
  nome,
  whatsappNumero,
  whatsappUrl,
}: Props) {
  const [aberto, setAberto] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: boasVindas },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWaCta, setShowWaCta] = useState(false);
  const [erroRede, setErroRede] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, aberto]);

  useEffect(() => {
    if (aberto) {
      // pequeno delay para o painel aparecer antes de focar
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [aberto]);

  const enviar = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const novas: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(novas);
    setInput("");
    setLoading(true);
    setShowWaCta(false);
    setErroRede(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: novas.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        setMsgs((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Desculpe, ocorreu um erro. Tente novamente ou fale pelo WhatsApp.",
          },
        ]);
        setShowWaCta(true);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let completo = "";

      // Adicionar placeholder para o streaming
      setMsgs((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        completo += decoder.decode(value, { stream: true });
        const exibido = completo.replace("[WHATSAPP_CTA]", "").trim();
        setMsgs((prev) => {
          const copia = [...prev];
          copia[copia.length - 1] = { role: "assistant", content: exibido };
          return copia;
        });
      }

      if (completo.includes("[WHATSAPP_CTA]")) {
        setShowWaCta(true);
      }
    } catch {
      setErroRede(true);
      setMsgs((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Problema de conexao. Verifique a internet e tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, msgs]);

  const waHref = whatsappNumero
    ? `https://wa.me/${whatsappNumero.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Ola, Jessica! Vim pelo assistente do site e gostaria de conversar sobre imoveis."
      )}`
    : whatsappUrl || null;

  return (
    <>
      {/* Botao flutuante */}
      <button
        onClick={() => setAberto((v) => !v)}
        className="chat-ia-fab"
        aria-label={aberto ? "Fechar assistente" : "Abrir assistente de imoveis com IA"}
        aria-expanded={aberto}
      >
        {aberto ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01" />
            <path d="M12 10h.01" />
            <path d="M16 10h.01" />
          </svg>
        )}
        <span className="chat-ia-fab-label">IA</span>
      </button>

      {/* Painel de chat */}
      {aberto && (
        <div
          className="chat-ia-panel"
          role="dialog"
          aria-modal="true"
          aria-label={`Chat com ${nome}`}
        >
          {/* Header */}
          <div className="chat-ia-header">
            <div className="chat-ia-avatar">IA</div>
            <div className="chat-ia-header-info">
              <p className="chat-ia-header-nome">{nome}</p>
              <p className="chat-ia-header-status">
                {loading ? "Digitando..." : "Assistente imobiliario"}
              </p>
            </div>
            <button
              onClick={() => setAberto(false)}
              className="chat-ia-close"
              aria-label="Fechar chat"
            >
              ×
            </button>
          </div>

          {/* Mensagens */}
          <div className="chat-ia-messages" role="log" aria-live="polite">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`chat-ia-msg ${m.role === "user" ? "chat-ia-msg-user" : "chat-ia-msg-assistant"}`}
              >
                <div className="chat-ia-bubble">
                  {m.content ||
                    (loading &&
                      i === msgs.length - 1 &&
                      m.role === "assistant" ? (
                      <span className="chat-ia-typing">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : null)}
                </div>
              </div>
            ))}

            {/* CTA WhatsApp */}
            {showWaCta && waHref && (
              <div className="chat-ia-wa-cta">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chat-ia-wa-btn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.09-1.35A9.953 9.953 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.93 13.3c-.22.62-1.27 1.17-1.78 1.25-.46.07-1.03.1-1.67-.1-.38-.12-.87-.28-1.5-.55-2.63-1.13-4.34-3.78-4.47-3.96-.13-.18-1.06-1.41-1.06-2.69 0-1.28.67-1.91.91-2.17.24-.26.52-.32.69-.32.17 0 .35.01.5.01.16.01.38-.06.59.45.22.53.74 1.81.81 1.94.07.13.11.28.02.44-.09.16-.13.26-.26.4-.13.14-.27.31-.39.42-.13.11-.26.23-.11.46.15.22.66.98 1.43 1.59.98.83 1.81 1.09 2.07 1.21.26.12.41.1.56-.06.15-.16.64-.75.81-.99.17-.24.35-.2.59-.12.24.08 1.52.72 1.78.85.26.13.43.2.5.31.07.1.07.59-.15 1.21z" />
                  </svg>
                  {ctaWhatsApp}
                </a>
              </div>
            )}

            {erroRede && waHref && !showWaCta && (
              <div className="chat-ia-wa-cta">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chat-ia-wa-btn"
                >
                  {ctaWhatsApp}
                </a>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-ia-input-area">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  enviar();
                }
              }}
              placeholder="Digite sua pergunta..."
              className="chat-ia-input"
              disabled={loading}
              aria-label="Digitar mensagem"
            />
            <button
              onClick={enviar}
              disabled={loading || !input.trim()}
              className="chat-ia-send"
              aria-label="Enviar mensagem"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
