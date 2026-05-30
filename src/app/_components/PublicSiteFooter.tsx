import Link from "next/link";
import { getPublicConfig } from "@/lib/config-reader";
import { BRAND_SETTINGS } from "@/lib/site-settings";
import { SITE_CONFIG } from "@/lib/site-config";

export async function PublicSiteFooter() {
  const config = await getPublicConfig();

  const socialLinks = [
    { key: "instagram", label: "Instagram", href: config.instagramUrl, ativo: config.instagramAtivo },
    { key: "whatsapp", label: "WhatsApp", href: config.socialWhatsappUrl, ativo: config.socialWhatsappAtivo },
    { key: "facebook", label: "Facebook", href: config.facebookUrl, ativo: config.facebookAtivo },
    { key: "linkedin", label: "LinkedIn", href: config.linkedinUrl, ativo: config.linkedinAtivo },
    { key: "tiktok", label: "TikTok", href: config.tiktokUrl, ativo: config.tiktokAtivo },
  ].filter((item) => item.href && item.ativo);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Coluna 1 — Marca */}
          <div className="footer-brand-col">
            {config.logoUrl ? (
              <Link className="footer-logo-link" href="/" aria-label="Pagina inicial - JCNI">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.logoUrl}
                  alt={config.logoAlt || BRAND_SETTINGS.displayName}
                  height={38}
                  style={{ maxHeight: 38, width: "auto", objectFit: "contain", display: "block" }}
                />
              </Link>
            ) : (
              <Link className="brand contrast" href="/">
                <span className="brand-mark">{BRAND_SETTINGS.initials}</span>
              </Link>
            )}
            <p className="footer-tagline">{SITE_CONFIG.shortDescription}</p>
            {socialLinks.length > 0 && (
              <div className="footer-socials" aria-label="Redes sociais">
                {socialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                  >
                    {renderSocialIcon(item.key)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Coluna 2 — Navegacao */}
          <nav className="footer-nav-col" aria-label="Links do rodape">
            <span className="footer-col-label">Navegacao</span>
            <Link href="/">Inicio</Link>
            <Link href="/comprar">Comprar</Link>
            <Link href="/alugar">Alugar</Link>
            <Link href="/imoveis">Imoveis</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/politica-de-privacidade">Privacidade</Link>
          </nav>

          {/* Coluna 3 — Contato */}
          <div className="footer-contact-col">
            <span className="footer-col-label">Contato</span>
            {config.contatoEmail && (
              <a href={`mailto:${config.contatoEmail}`} className="footer-contact-link">
                {config.contatoEmail}
              </a>
            )}
            {config.whatsappNumero && (
              <a
                href={`https://wa.me/${config.whatsappNumero.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Barra de copyright */}
        <div className="footer-bottom">
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} {BRAND_SETTINGS.displayName}. Todos os direitos reservados.
          </span>
          <span className="footer-copy footer-copy-dim">Corretora de imóveis — CRECI</span>
        </div>
      </div>
    </footer>
  );
}

function renderSocialIcon(key: string) {
  if (key === "instagram") {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (key === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
        <path d="M20 11.8A8.8 8.8 0 0 1 6.8 19.5L3.5 20.5l1-3.1A8.8 8.8 0 1 1 20 11.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (key === "facebook") {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
        <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.3 1.4-1.3h1.5V5.6c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.7v2h-2.4V14h2.4v7h2.7Z" fill="currentColor" />
      </svg>
    );
  }
  if (key === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
        <rect x="4" y="9" width="3" height="11" fill="currentColor" />
        <circle cx="5.5" cy="5.5" r="1.8" fill="currentColor" />
        <path d="M10 9h2.9v1.6h.1c.4-.8 1.4-1.9 3-1.9 3.2 0 3.8 2.1 3.8 4.9V20H17v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 2.9V20H10Z" fill="currentColor" />
      </svg>
    );
  }
  // tiktok
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
      <path d="M14.6 4c.6 1.8 1.7 2.9 3.4 3.2v2.6c-1.3 0-2.4-.4-3.4-1.2V15a5 5 0 1 1-5-5c.3 0 .6 0 .9.1v2.8a2.4 2.4 0 1 0 1.7 2.3V4h2.4Z" fill="currentColor" />
    </svg>
  );
}

