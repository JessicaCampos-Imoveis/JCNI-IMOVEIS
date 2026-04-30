import { SITE_CONFIG } from "@/lib/site-config";

export default function ContactPage() {
  return (
    <main className="simple-page">
      <section className="simple-shell contact-layout">
        <div>
          <p className="eyebrow">Contato</p>
          <h1>Fale com a Jéssica Campos</h1>
          <p>
            Preencha o formulário e entraremos em contato em breve. Você
            também pode chamar diretamente pelo Instagram.
          </p>
        </div>
        <form className="login-form contact-form">
          <label>
            <span>Nome</span>
            <input type="text" name="name" autoComplete="name" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" autoComplete="email" />
          </label>
          <label>
            <span>Telefone</span>
            <input type="tel" name="phone" autoComplete="tel" />
          </label>
          <button type="submit">Enviar mensagem</button>
        </form>
        <a className="text-link" href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer">
          Seguir no Instagram
        </a>
      </section>
    </main>
  );
}
