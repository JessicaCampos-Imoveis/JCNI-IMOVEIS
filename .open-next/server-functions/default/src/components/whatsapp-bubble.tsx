import { buildWhatsAppHref, WHATSAPP_SETTINGS } from "@/lib/site-settings";

type WhatsAppBubbleProps = {
  message?: string;
  source?: string;
};

export function WhatsAppBubble({
  message = WHATSAPP_SETTINGS.messageTemplates.general,
  source = WHATSAPP_SETTINGS.defaultSource,
}: WhatsAppBubbleProps) {
  const href = buildWhatsAppHref(message, source);

  if (!href) {
    return null;
  }

  return (
    <a
      className="whatsapp-bubble"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com Jéssica pelo WhatsApp"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M12.03 3.02a8.9 8.9 0 0 0-7.59 13.53l-1.02 3.72 3.82-1a8.88 8.88 0 0 0 4.79 1.38h.01a8.82 8.82 0 0 0 6.3-2.6 8.88 8.88 0 0 0 2.61-6.31 8.94 8.94 0 0 0-8.92-8.72Zm5.24 12.78c-.22.62-1.27 1.17-1.78 1.25-.46.07-1.03.1-1.67-.1-.38-.12-.87-.28-1.5-.55-2.64-1.14-4.36-3.8-4.5-3.98-.13-.18-1.07-1.43-1.07-2.73 0-1.3.68-1.94.92-2.2.24-.27.53-.34.71-.34h.51c.16 0 .39-.06.61.46.23.55.77 1.88.84 2.02.06.13.11.3.02.48-.09.18-.13.29-.27.44-.13.16-.28.35-.4.47-.13.13-.27.27-.12.53.16.27.69 1.13 1.47 1.83 1.01.9 1.86 1.18 2.13 1.32.27.13.42.11.58-.07.15-.18.66-.77.84-1.04.18-.27.35-.22.59-.13.24.09 1.54.73 1.8.86.27.13.45.2.51.31.07.12.07.68-.15 1.3Z" />
      </svg>
      <span className="sr-only">Abrir conversa no WhatsApp</span>
    </a>
  );
}
