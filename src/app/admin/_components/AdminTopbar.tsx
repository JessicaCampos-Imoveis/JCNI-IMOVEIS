"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  blank?: boolean;
};

const NAV_LINKS: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/imoveis", label: "Imoveis" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/comodidades", label: "Comodidades" },
  { href: "/admin/configuracoes", label: "Configuracoes" },
  { href: "/admin/integracoes/portais", label: "Portais XML" },
  { href: "/admin/configuracoes/chat", label: "Chat IA" },
  { href: "/", label: "Ver site", blank: true },
];

export default function AdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  useEffect(() => {
    function onEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuAberto(false);
    }

    if (menuAberto) {
      window.addEventListener("keydown", onEsc);
    }

    return () => {
      window.removeEventListener("keydown", onEsc);
    };
  }, [menuAberto]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMenuAberto(false);
    router.push("/admin/login");
    router.refresh();
  }

  function isAtivo(href: string): boolean {
    if (href === "/") return false;
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="admin-topbar">
        <button
          type="button"
          className={`admin-mobile-menu-btn${menuAberto ? " is-open" : ""}`}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          aria-controls="admin-mobile-drawer"
          onClick={() => setMenuAberto((prev) => !prev)}
        >
          <span className="admin-mobile-menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <Link href="/admin" className="admin-topbar-logo-link" aria-label="Painel JCNI">
          <Image
            src="/images/logo_jcni.png"
            alt="JCNI"
            width={56}
            height={56}
            className="admin-topbar-logo"
            priority
          />
        </Link>

        <span className="admin-topbar-brand">
          <span className="admin-topbar-name">Jessica Campos</span>
          <span className="admin-topbar-label">Painel ADM</span>
        </span>

        <nav className="admin-topbar-nav" aria-label="Navegacao principal">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-topbar-link${isAtivo(item.href) ? " active" : ""}`}
              {...(item.blank ? { target: "_blank", rel: "noopener" } : {})}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button type="button" onClick={handleLogout} className="admin-logout-btn admin-logout-btn-desktop">
          Sair
        </button>
      </header>

      {menuAberto && (
        <>
          <button
            type="button"
            className="admin-mobile-overlay"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
          />
          <aside id="admin-mobile-drawer" className="admin-mobile-drawer" aria-label="Menu do painel">
            <div className="admin-mobile-drawer-head">
              <span className="admin-mobile-drawer-title">Navegacao do painel</span>
            </div>
            <nav className="admin-mobile-nav">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-mobile-link${isAtivo(item.href) ? " active" : ""}`}
                  {...(item.blank ? { target: "_blank", rel: "noopener" } : {})}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button type="button" onClick={handleLogout} className="admin-mobile-logout-btn">
              Sair do painel
            </button>
          </aside>
        </>
      )}
    </>
  );
}
