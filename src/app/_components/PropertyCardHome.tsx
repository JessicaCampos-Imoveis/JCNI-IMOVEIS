"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export type HomeCard = {
  id: string;
  href: string;
  tipoLabel: string;
  finalidadeLabel: string;
  statusLabel: string | null;
  preco: string;
  bairro: string;
  fotos: string[];
  imageAlt: string;
  criadoEm: string;
  features: string[];
};

const VINTE4H_MS = 86_400_000;

function HeartSvg({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconArea() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9H21M9 3V21" />
    </svg>
  );
}

function IconQuartos() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9V19M22 9V19M2 14H22M7 9V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

function IconBanheiro() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12H20V17a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5z" />
      <path d="M4 12V7a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v5" />
    </svg>
  );
}

function IconVaga() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="8" width="20" height="10" rx="2" />
      <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <path d="M10 13h4" />
    </svg>
  );
}

function featIcon(f: string) {
  if (f.includes("m\u00b2")) return <IconArea />;
  if (f.includes("quarto") || f.includes("su\u00edte")) return <IconQuartos />;
  if (f.includes("banheiro")) return <IconBanheiro />;
  return <IconVaga />;
}

export function PropertyCardHome({
  card,
  index,
  watermarkCssAtivo = false,
  watermarkLogoUrl = "",
  watermarkOpacidade = 25,
}: {
  card: HomeCard;
  index: number;
  watermarkCssAtivo?: boolean;
  watermarkLogoUrl?: string;
  watermarkOpacidade?: number;
}) {
  const [fotoIdx, setFotoIdx] = useState(0);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    try {
      setFavorito(localStorage.getItem(`fav-${card.id}`) === "1");
    } catch {
      /* no-op */
    }
  }, [card.id]);

  const total = card.fotos.length;
  const isNovo = Date.now() - new Date(card.criadoEm).getTime() < VINTE4H_MS;
  const fotoSrc = card.fotos[fotoIdx] ?? card.fotos[0] ?? "";

  const prevFoto = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setFotoIdx((i) => (i - 1 + total) % total);
    },
    [total]
  );

  const nextFoto = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setFotoIdx((i) => (i + 1) % total);
    },
    [total]
  );

  const toggleFav = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setFavorito((prev) => {
        const next = !prev;
        try {
          if (next) localStorage.setItem(`fav-${card.id}`, "1");
          else localStorage.removeItem(`fav-${card.id}`);
        } catch {
          /* no-op */
        }
        return next;
      });
    },
    [card.id]
  );

  return (
    <article className="property-card">
      <style>{`
        .property-card { position: relative; }
        .pc-img-wrap { position: relative; overflow: hidden; aspect-ratio: 4/3; background: var(--color-surface-muted); }
        .pc-img-link { display: block; width: 100%; height: 100%; }
        .pc-img-link img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.25s ease; }
        .property-card:hover .pc-img-link img { transform: scale(1.04); }
        .pc-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.88); backdrop-filter: blur(3px); border: 0; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem; color: var(--color-text); opacity: 0; transition: opacity 0.15s; z-index: 3; padding: 0; line-height: 1; }
        .property-card:hover .pc-nav { opacity: 1; }
        @media (hover: none) { .property-card .pc-nav { opacity: 1; } }
        .pc-nav-prev { left: 8px; }
        .pc-nav-next { right: 8px; }
        .pc-counter { position: absolute; bottom: 8px; right: 10px; z-index: 3; background: rgba(0,0,0,0.5); color: #fff; border-radius: 999px; padding: 2px 8px; font-size: 0.62rem; font-weight: 600; pointer-events: none; }
        .pc-badge-novo { position: absolute; top: 10px; left: 10px; z-index: 3; background: var(--color-accent); color: #fff; border-radius: 999px; padding: 3px 10px; font-size: 0.64rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; pointer-events: none; }
        .pc-badge-st { position: absolute; top: 10px; z-index: 3; border-radius: 999px; padding: 3px 10px; font-size: 0.64rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; pointer-events: none; }
        .pc-badge-st.pos-left { left: 10px; }
        .pc-badge-st.pos-right { right: 10px; }
        .pc-badge-st.reservado { background: #fde68a; color: #78350f; }
        .pc-badge-st.vendido { background: #bbf7d0; color: #14532d; }
        .pc-badge-st.locado { background: #bfdbfe; color: #1e3a5f; }
        .pc-body { position: relative; }
        .pc-link { display: block; padding: 13px 16px 14px; text-decoration: none; color: inherit; }
        .pc-link:hover { color: inherit; }
        .pc-type { margin: 0 0 3px; font-size: 0.7rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.05em; }
        .pc-price { margin: 0 0 3px; font-size: 1.1rem; font-weight: 800; color: var(--color-text); line-height: 1.2; padding-right: 30px; }
        .pc-local { margin: 0 0 9px; font-size: 0.8rem; color: var(--color-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pc-feats { display: flex; flex-wrap: wrap; gap: 6px 10px; }
        .pc-feat { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--color-text-muted); }
        .pc-feat svg { flex-shrink: 0; }
        .pc-heart { position: absolute; top: 11px; right: 12px; z-index: 1; background: none; border: 0; padding: 4px; cursor: pointer; color: var(--color-text-muted); border-radius: 50%; transition: color 0.15s, background 0.15s; display: flex; align-items: center; justify-content: center; }
        .pc-heart:hover { background: var(--color-surface-muted); color: #e11d48; }
        .pc-heart.fav { color: #e11d48; }
      `}</style>

      {/* Foto com slider */}
      <div
        className="pc-img-wrap"
        onContextMenu={watermarkCssAtivo ? (e) => e.preventDefault() : undefined}
      >
        <Link
          href={card.href}
          className="pc-img-link"
          aria-label={card.imageAlt}
          tabIndex={-1}
          aria-hidden="true"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoSrc}
            alt={card.imageAlt}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </Link>

        {/* Marca dagua: z-index 2 (abaixo dos botoes de nav z-index 3) */}
        {watermarkCssAtivo && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 2,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={watermarkLogoUrl || "/images/logo_jcni.png"}
              alt=""
              draggable={false}
              style={{
                width: "40%",
                maxWidth: 200,
                minWidth: 60,
                opacity: Math.min(100, Math.max(0, watermarkOpacidade)) / 100,
                objectFit: "contain",
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
          </div>
        )}

        {total > 1 && (
          <>
            <button
              className="pc-nav pc-nav-prev"
              onClick={prevFoto}
              aria-label="Foto anterior"
              type="button"
            >
              &#8249;
            </button>
            <button
              className="pc-nav pc-nav-next"
              onClick={nextFoto}
              aria-label="Proxima foto"
              type="button"
            >
              &#8250;
            </button>
            <span className="pc-counter">{fotoIdx + 1}/{total}</span>
          </>
        )}

        {isNovo && <span className="pc-badge-novo">Novo</span>}
        {card.statusLabel && (
          <span
            className={`pc-badge-st ${card.statusLabel.toLowerCase()} ${isNovo ? "pos-right" : "pos-left"}`}
          >
            {card.statusLabel}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="pc-body">
        <Link href={card.href} className="pc-link" target="_blank" rel="noopener noreferrer">
          <p className="pc-type">{card.tipoLabel} &middot; {card.finalidadeLabel}</p>
          <p className="pc-price">{card.preco}</p>
          <p className="pc-local">{card.bairro}</p>
          {card.features.length > 0 && (
            <div className="pc-feats" aria-label="Dados do imovel">
              {card.features.map((f) => (
                <span key={f} className="pc-feat">
                  {featIcon(f)}
                  {f}
                </span>
              ))}
            </div>
          )}
        </Link>

        <button
          className={`pc-heart${favorito ? " fav" : ""}`}
          onClick={toggleFav}
          type="button"
          aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={favorito}
        >
          <HeartSvg filled={favorito} />
        </button>
      </div>
    </article>
  );
}
