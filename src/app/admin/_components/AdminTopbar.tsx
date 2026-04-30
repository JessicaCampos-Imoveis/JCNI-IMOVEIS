"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminTopbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="admin-topbar">
      <Link href="/admin" className="admin-topbar-logo-link" aria-label="Painel JCNI">
        <Image
          src="/images/logo_jcni.png"
          alt="JCNI"
          width={44}
          height={44}
          className="admin-topbar-logo"
          priority
        />
      </Link>
      <span className="admin-topbar-brand">
        <span className="admin-topbar-name">Jessica Campos</span>
        <span className="admin-topbar-label">Painel ADM</span>
      </span>
      <nav className="admin-topbar-nav">
        <Link href="/admin" className="admin-topbar-link">Dashboard</Link>
        <Link href="/" className="admin-topbar-link" target="_blank" rel="noopener">
          Ver site
        </Link>
      </nav>
      <button type="button" onClick={handleLogout} className="admin-logout-btn">
        Sair
      </button>
    </header>
  );
}
