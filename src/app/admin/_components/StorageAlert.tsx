"use client";

import { useEffect, useState } from "react";

export type StorageNivel = "ok" | "aviso" | "critico";

interface Props {
  nivel: StorageNivel;
  pct: number;
  storageMB: number;
  limiteMB: number;
}

// Desenvolvedora responsavel pelo projeto (exibido no alerta para contato)
const DEV_CONTATO = "Desenvolvedor do sistema";

export function StorageAlert({ nivel, pct, storageMB, limiteMB }: Props) {
  const [modalAberto, setModalAberto] = useState(false);
  const [bannerFechado, setBannerFechado] = useState(false);

  useEffect(() => {
    if (nivel === "ok") return;
    // Abre o modal uma vez por sessao para nao encher o saco a cada clique
    const chave = `storage-modal-${nivel}-${Math.floor(pct / 10) * 10}`;
    if (!sessionStorage.getItem(chave)) {
      sessionStorage.setItem(chave, "1");
      setModalAberto(true);
    }
  }, [nivel, pct]);

  if (nivel === "ok") return null;

  const titulo =
    nivel === "critico"
      ? "🚨 Armazenamento Quase Cheio!"
      : "⚠️ Atenção ao Armazenamento";

  const mensagemBanner =
    nivel === "critico"
      ? `🚨 Armazenamento crítico: ${pct}% usado (${storageMB} MB de ${limiteMB} MB). Novos uploads podem falhar. Fale com o desenvolvedor.`
      : `⚠️ Armazenamento em ${pct}% (${storageMB} MB de ${limiteMB} MB). Fique de olho.`;

  return (
    <>
      {/* Banner fixo logo abaixo do cabeçalho */}
      {!bannerFechado && (
        <div className={`storage-banner storage-banner--${nivel}`} role="alert">
          <span>{mensagemBanner}</span>
          <div className="storage-banner__actions">
            <button
              className="storage-banner__btn-detalhe"
              onClick={() => setModalAberto(true)}
            >
              Ver detalhes
            </button>
            <button
              className="storage-banner__btn-fechar"
              aria-label="Fechar aviso"
              onClick={() => setBannerFechado(true)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal de alerta */}
      {modalAberto && (
        <div
          className="storage-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="storage-modal-titulo"
          onClick={() => setModalAberto(false)}
        >
          <div
            className={`storage-modal storage-modal--${nivel}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="storage-modal__icone">
              {nivel === "critico" ? "🚨" : "⚠️"}
            </div>

            <h2 id="storage-modal-titulo">{titulo}</h2>

            {nivel === "critico" ? (
              <>
                <p>
                  O espaço de armazenamento de fotos está{" "}
                  <strong>quase cheio: {pct}% ocupado</strong> ({storageMB} MB
                  de {limiteMB} MB disponíveis no plano gratuito).
                </p>
                <p>
                  Se o espaço acabar, novos uploads de fotos vão{" "}
                  <strong>parar de funcionar</strong>. Para resolver isso, é
                  necessário ampliar o plano ou migrar as fotos para outro
                  serviço.
                </p>
                <div className="storage-modal__acao-critica">
                  <p>
                    📞 <strong>Entre em contato com o {DEV_CONTATO}</strong>{" "}
                    para resolver isso antes que cause problemas.
                  </p>
                </div>
                <p className="storage-modal__dica">
                  💡 Você também pode liberar espaço excluindo permanentemente
                  imóveis inativos com muitas fotos (use &ldquo;Excluir definitivamente&rdquo; na lista de
                  imóveis).
                </p>
              </>
            ) : (
              <>
                <p>
                  O armazenamento de fotos já está em{" "}
                  <strong>{pct}% da capacidade</strong> ({storageMB} MB de{" "}
                  {limiteMB} MB). Ainda há espaço, mas é bom ficar de olho.
                </p>
                <p>
                  Quando chegar em <strong>90%</strong>, será necessário
                  ampliar o espaço. Isso é simples de resolver, mas precisa ser
                  feito com antecedência.
                </p>
                <div className="storage-modal__acao-aviso">
                  <p>
                    📞 Quando o medidor passar de 90%, avise o{" "}
                    <strong>{DEV_CONTATO}</strong> com antecedência para
                    não ter surpresas.
                  </p>
                </div>
                <p className="storage-modal__dica">
                  💡 Para liberar espaço: exclua permanentemente imóveis
                  inativos com muitas fotos usando a opção{" "}
                  <strong>&ldquo;Excluir definitivamente&rdquo;</strong> na lista de imóveis.
                </p>
              </>
            )}

            <div className="storage-modal__rodape">
              <p>
                <em>O banco de dados (textos, leads, configurações) está{" "}
                  <strong>bem longe do limite</strong> — só as fotos precisam
                  de atenção.</em>
              </p>
              <button
                className="header-action"
                onClick={() => setModalAberto(false)}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
