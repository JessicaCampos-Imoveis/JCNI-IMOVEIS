"use client";

import { FormEvent, useState } from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import { SiteHeader } from "@/app/_components/SiteHeader";

export default function ContactPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function enviarLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const nomeLimpo = nome.trim();
    const telefoneLimpo = telefone.trim();
    if (!nomeLimpo || !telefoneLimpo) {
      setErro("Preencha nome e telefone para enviar.");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeLimpo,
          email: email.trim(),
          telefone: telefoneLimpo,
          mensagem: mensagem.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErro(body.error ?? "Nao foi possivel enviar seu contato agora.");
        return;
      }

      setSucesso("Mensagem enviada. A Jessica entrara em contato em breve.");
      setNome("");
      setEmail("");
      setTelefone("");
      setMensagem("");
    } catch {
      setErro("Erro de conexao. Tente novamente em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="simple-page">
      <SiteHeader />
      <section className="simple-shell contact-layout">
        <div>
          <p className="eyebrow">Contato</p>
          <h1>Fale com a Jéssica Campos</h1>
          <p>
            Preencha o formulário e entraremos em contato em breve. Você
            também pode chamar diretamente pelo Instagram.
          </p>
        </div>
        <form className="login-form contact-form" onSubmit={enviarLead}>
          <label>
            <span>Nome</span>
            <input
              type="text"
              name="nome"
              autoComplete="name"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={enviando}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={enviando}
            />
          </label>
          <label>
            <span>Telefone</span>
            <input
              type="tel"
              name="telefone"
              autoComplete="tel"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              disabled={enviando}
            />
          </label>
          <label>
            <span>Mensagem</span>
            <textarea
              name="mensagem"
              rows={5}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              disabled={enviando}
              placeholder="Conte o que voce procura ou sua duvida"
            />
          </label>

          {erro && <p className="contact-feedback error">{erro}</p>}
          {sucesso && <p className="contact-feedback success">{sucesso}</p>}

          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>
        <a className="text-link" href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer">
          Seguir no Instagram
        </a>
      </section>

      <style>{`
        .contact-form textarea {
          min-height: 122px;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          background: var(--color-bg);
          color: var(--color-text);
          padding: 12px 16px;
          font-size: 1rem;
          resize: vertical;
          width: 100%;
        }

        .contact-form textarea:focus {
          outline: none;
          border-color: var(--color-accent);
        }

        .contact-form textarea:disabled {
          opacity: 0.6;
        }

        .contact-feedback {
          margin: -4px 0 2px;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 0.86rem;
        }

        .contact-feedback.error {
          background: rgba(157, 47, 47, 0.08);
          color: var(--color-danger);
        }

        .contact-feedback.success {
          background: rgba(47, 111, 78, 0.12);
          color: var(--color-success);
        }
      `}</style>
    </main>
  );
}
