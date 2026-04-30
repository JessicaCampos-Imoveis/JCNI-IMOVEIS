import Link from "next/link";
import Image from "next/image";
import {
  BRAND_SETTINGS,
  MANAGED_SITE_IMAGES,
  WHATSAPP_SETTINGS,
} from "@/lib/site-settings";

export default function AdminConfiguracoesPage() {
  const whatsappConfigured = Boolean(WHATSAPP_SETTINGS.phoneE164);

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Configurações</p>
            <h1>Marca, imagens e WhatsApp</h1>
            <div className="admin-nav-row">
              <Link className="secondary-action" href="/admin">
                Voltar ao painel
              </Link>
              <Link className="secondary-action" href="/">
                Ver site público
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-config-grid">
          <section className="admin-config-card" aria-labelledby="brand-config">
            <p className="eyebrow">Marca</p>
            <h2 id="brand-config">Logo substituível</h2>
            <p>
              A logo deve aceitar arquivo enviado pelo painel e manter fallback
              textual para evitar quebra visual caso o arquivo seja removido.
            </p>
            <div className="config-form-grid">
              <label>
                Nome curto
                <input defaultValue={BRAND_SETTINGS.initials} readOnly />
              </label>
              <label>
                Nome exibido
                <input defaultValue={BRAND_SETTINGS.displayName} readOnly />
              </label>
              <label className="wide">
                Nome completo
                <input defaultValue={BRAND_SETTINGS.fullName} readOnly />
              </label>
              <label className="wide">
                URL da logo
                <input
                  defaultValue={BRAND_SETTINGS.logo.imageUrl || "Usando fallback textual JCNI"}
                  readOnly
                />
              </label>
            </div>
          </section>

          <section className="admin-config-card" aria-labelledby="images-config">
            <p className="eyebrow">Imagens gerenciáveis</p>
            <h2 id="images-config">Onde cada imagem aparece</h2>
            <p>
              Cada imagem do site precisa ter posição identificável no painel,
              tamanho recomendado, texto alternativo e status de demonstração.
            </p>
            <div className="managed-images-grid">
              {MANAGED_SITE_IMAGES.map((image) => (
                <article className="managed-image-card" key={image.id}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={480}
                    height={360}
                    sizes="(max-width: 620px) 100vw, 240px"
                  />
                  <div>
                    <span className="status-pill">
                      {image.isDemo ? "Imagem demo" : "Imagem oficial"}
                    </span>
                    <h3>{image.label}</h3>
                    <p>{image.usage}</p>
                    <p>{image.adminLocation}</p>
                    <p>{image.recommendedSize}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-config-card" aria-labelledby="whatsapp-config">
            <p className="eyebrow">Contato direto</p>
            <h2 id="whatsapp-config">WhatsApp configurável</h2>
            <p>
              O balão público só deve abrir conversa quando existir número real
              configurado. As mensagens precisam aceitar origem, UTM e código
              do imóvel quando aplicável.
            </p>
            <div className="config-form-grid">
              <label>
                Status
                <input
                  defaultValue={whatsappConfigured ? "Configurado" : "Pendente de número real"}
                  readOnly
                />
              </label>
              <label>
                Número E.164
                <input
                  defaultValue={WHATSAPP_SETTINGS.phoneE164 || "Aguardando telefone da Jéssica"}
                  readOnly
                />
              </label>
              <label className="wide">
                Mensagem geral
                <textarea defaultValue={WHATSAPP_SETTINGS.messageTemplates.general} readOnly />
              </label>
              <label className="wide">
                Mensagem de imóvel
                <textarea defaultValue={WHATSAPP_SETTINGS.messageTemplates.property} readOnly />
              </label>
              <label className="wide">
                Mensagem do radar
                <textarea defaultValue={WHATSAPP_SETTINGS.messageTemplates.radar} readOnly />
              </label>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
