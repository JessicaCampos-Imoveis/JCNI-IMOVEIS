"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const senha = fd.get("senha") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Erro ao autenticar.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="login-card">
        <div className="login-logo-wrap">
          <Image
            src="/images/logo_jcni.png"
            alt="JCNI - Jessica Campos Negócios Imobiliários"
            width={88}
            height={88}
            priority
          />
        </div>
        <p className="eyebrow">Acesso restrito</p>
        <h1>Entrar no painel</h1>
        {error && (
          <p role="alert" className="login-error">
            {error}
          </p>
        )}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              disabled={loading}
            />
          </label>
          <label>
            <span>Senha</span>
            <input
              type="password"
              name="senha"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Autenticando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
