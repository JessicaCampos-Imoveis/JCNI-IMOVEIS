export default function BuyPage() {
  return (
    <main className="simple-page">
      <section className="simple-shell">
        <p className="eyebrow">Comprar</p>
        <h1>Imóveis para compra</h1>
        <p>
          Esta rota será ligada automaticamente à listagem de imóveis com
          finalidade de venda quando o módulo de cadastro estiver ativo.
        </p>
        <a className="secondary-action" href="/imoveis">
          Ver listagem geral
        </a>
      </section>
    </main>
  );
}
