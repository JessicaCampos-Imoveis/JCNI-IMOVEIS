export default function RentPage() {
  return (
    <main className="simple-page">
      <section className="simple-shell">
        <p className="eyebrow">Alugar</p>
        <h1>Imóveis para locação</h1>
        <p>
          Esta rota será ligada automaticamente à listagem de imóveis com
          finalidade de aluguel quando o módulo de cadastro estiver ativo.
        </p>
        <a className="secondary-action" href="/imoveis">
          Ver listagem geral
        </a>
      </section>
    </main>
  );
}
