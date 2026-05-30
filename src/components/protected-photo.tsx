"use client";

/**
 * ProtectedPhoto — envolve uma imagem publica com overlay de marca dagua CSS.
 *
 * Quando `ativo=true`:
 *  - Exibe a logo centralizada sobre a foto (logo permanece visivel em screenshots).
 *  - Impede right-click / "Salvar imagem" (preventDefault).
 *  - Impede drag da imagem.
 *  - Overlay com pointer-events: none para nao bloquear cliques no card.
 *
 * O overlay eh visivel em impressao (@media print) se o usuario tentar imprimir.
 */

import { type ReactNode } from "react";

interface ProtectedPhotoProps {
  /** Quando true, aplica o overlay da marca dagua */
  ativo: boolean;
  /** URL da logo para o overlay. Fallback para /images/logo_jcni.png */
  logoUrl?: string;
  /** Opacidade do overlay 0-100 (padrao 25) */
  opacidade?: number;
  /** Conteudo: normalmente um <Image> ou <img> */
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ProtectedPhoto({
  ativo,
  logoUrl,
  opacidade = 25,
  children,
  className,
  style,
}: ProtectedPhotoProps) {
  const logoSrc = logoUrl || "/images/logo_jcni.png";
  const opacidadeCss = Math.min(100, Math.max(0, opacidade)) / 100;

  function bloquearContextMenu(e: React.MouseEvent) {
    if (ativo) e.preventDefault();
  }

  function bloquearDrag(e: React.DragEvent) {
    if (ativo) e.preventDefault();
  }

  return (
    <div
      className={className}
      style={{ position: "relative", ...style }}
      onContextMenu={bloquearContextMenu}
      onDragStart={bloquearDrag}
    >
      {children}

      {ativo && (
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
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt=""
            draggable={false}
            style={{
              width: "40%",
              maxWidth: 240,
              minWidth: 80,
              opacity: opacidadeCss,
              objectFit: "contain",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>
      )}

      {ativo && (
        <style>{`
          @media print {
            [data-protected-photo] img[alt=""] {
              opacity: ${opacidadeCss} !important;
              display: block !important;
            }
          }
        `}</style>
      )}
    </div>
  );
}
