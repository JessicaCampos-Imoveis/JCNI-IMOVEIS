export default function PropertiesPage() {
  return (
    <main className="simple-page">
      <section className="simple-shell">
        <p className="eyebrow">Imóveis</p>
        <h1>Imóveis em Sorocaba e região</h1>
        <p>
          Filtros, cards e páginas individuais serão publicados conforme o
          acervo da Jéssica for cadastrado no painel. Nenhum imóvel
          fictício é exibido.
        </p>
        <div className="filter-preview" aria-label="Filtros disponíveis">
          <span>Comprar ou alugar</span>
          <span>Bairro</span>
          <span>Tipo</span>
          <span>Faixa de valor</span>
          <span>Quartos</span>
          <span>Vagas</span>
        </div>
      </section>
    </main>
  );
}
