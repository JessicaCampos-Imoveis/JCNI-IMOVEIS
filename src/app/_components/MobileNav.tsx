"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  // Fecha com Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Bloqueia scroll do body quando aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="mobile-menu-btn"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div
            className="mobile-nav-overlay"
            aria-hidden="true"
            onClick={close}
          />
          <nav
            id="mobile-nav-drawer"
            className="mobile-nav-drawer"
            aria-label="Menu principal"
          >
            <Link href="/comprar" className="mobile-nav-link" onClick={close}>Comprar</Link>
            <Link href="/alugar" className="mobile-nav-link" onClick={close}>Alugar</Link>
            <Link href="/imoveis" className="mobile-nav-link" onClick={close}>Imóveis</Link>
            <Link href="/contato" className="mobile-nav-link" onClick={close}>Contato</Link>
            <a
              href={SITE_CONFIG.instagramUrl}
              className="mobile-nav-link mobile-nav-link--instagram"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              Instagram
            </a>
          </nav>
        </>
      )}
    </>
  );
}
