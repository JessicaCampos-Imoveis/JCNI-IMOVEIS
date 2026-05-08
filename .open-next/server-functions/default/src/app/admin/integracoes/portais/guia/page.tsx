"use client";

import { useState } from "react";
import Link from "next/link";
type Passo = {
  texto: string;
  destaque?: boolean;
};

type GuiaPortal = {
  id: string;
  nome: string;
  gratuito: boolean;
  dificuldade: "Facil" | "Media";
  prazoAtivacao: string;
  site: string;
  youtubeBusca: string;
  obs?: string;
  passos: Passo[];
};

const GUIA: GuiaPortal[] = [
  {
    id: "zapimoveis",
    nome: "ZAP Imoveis",
    gratuito: false,
    dificuldade: "Media",
    prazoAtivacao: "24 a 72 horas",
    site: "https://www.zapimoveis.com.br",
    youtubeBusca:
      "https://www.youtube.com/results?search_query=zap+imoveis+integracao+xml+imobiliaria",
    passos: [
      {
        texto:
          'Acesse zapimoveis.com.br e clique em "Anuncie seus imoveis" ou va direto para a area de imobiliarias.',
      },
      {
        texto:
          "Fale com um consultor comercial — eles entram em contato rapido. Informe o tamanho da sua carteira de imoveis.",
      },
      {
        texto:
          "Escolha um plano. O ZAP nao tem opcao gratuita para imobiliarias, mas o valor varia por regiao e quantidade de anuncios.",
      },
      {
        texto:
          'Durante o onboarding, diga ao consultor ou ao time tecnico: "preciso ativar a integracao por feed XML". Eles vao pedir a URL do feed.',
        destaque: true,
      },
      {
        texto:
          "Copie a URL do feed desta pagina (card do ZAP Imoveis) e mande para o consultor por e-mail ou WhatsApp.",
        destaque: true,
      },
      {
        texto:
          "O time tecnico do ZAP valida o XML e ativa a importacao. Em 24 a 72 horas seus imoveis aparecem no portal.",
      },
      {
        texto:
          "Pronto — a partir dai o ZAP puxa o feed automaticamente. Nao precisa fazer mais nada.",
      },
    ],
  },
  {
    id: "vivareal",
    nome: "Viva Real",
    gratuito: false,
    dificuldade: "Media",
    prazoAtivacao: "24 a 72 horas",
    site: "https://www.vivareal.com.br",
    youtubeBusca:
      "https://www.youtube.com/results?search_query=vivareal+integracao+xml+imobiliaria",
    obs: "Viva Real e ZAP Imoveis sao do mesmo grupo (OLX Group). Quando voce contratar um, o consultor vai oferecer os dois juntos com desconto. A URL do feed e a mesma para os dois.",
    passos: [
      {
        texto:
          "Se voce ja contratou o ZAP Imoveis, fale com o mesmo consultor — ele pode ativar o Viva Real junto, geralmente com desconto em pacote.",
      },
      {
        texto:
          "Se ainda nao contratou nenhum, acesse vivareal.com.br e clique em anunciar para imobiliarias.",
      },
      {
        texto:
          "Mesmo processo do ZAP: escolha o plano, peca integracao XML, mande a URL do feed.",
        destaque: true,
      },
      {
        texto:
          "A mesma URL de feed que voce usa no ZAP funciona no Viva Real. O formato XML e identico — sao do mesmo grupo.",
        destaque: true,
      },
      {
        texto:
          "Ativacao em 24 a 72 horas apos enviar a URL para o consultor.",
      },
    ],
  },
  {
    id: "olximoveis",
    nome: "OLX Imoveis",
    gratuito: false,
    dificuldade: "Media",
    prazoAtivacao: "24 a 72 horas",
    site: "https://www.olx.com.br",
    youtubeBusca:
      "https://www.youtube.com/results?search_query=olx+imoveis+imobiliaria+xml+integracao",
    obs: "OLX faz parte do mesmo grupo que ZAP e Viva Real (OLX Group). Os tres portais aceitam o mesmo formato de XML. Voce pode negociar os tres em um unico contrato.",
    passos: [
      {
        texto:
          "Acesse olx.com.br e va para a area de anunciantes imobiliarios, ou fale com o mesmo consultor do ZAP/Viva Real.",
      },
      {
        texto:
          "Informe que voce ja tem o feed XML gerado e peca a ativacao de integracao por URL.",
        destaque: true,
      },
      {
        texto: "A URL do feed e exatamente a mesma dos outros dois portais do grupo.", destaque: true,
      },
      {
        texto:
          "Ativacao em 24 a 72 horas.",
      },
    ],
  },
  {
    id: "imovelweb",
    nome: "ImovelWeb",
    gratuito: false,
    dificuldade: "Media",
    prazoAtivacao: "24 a 48 horas",
    site: "https://www.imovelweb.com.br",
    youtubeBusca:
      "https://www.youtube.com/results?search_query=imovelweb+integracao+xml+imobiliaria",
    passos: [
      {
        texto:
          "Acesse imovelweb.com.br e va para a area de anunciar/parceiros imobiliarios.",
      },
      {
        texto:
          "Fale com o comercial e informe que quer integrar por feed XML.",
      },
      {
        texto:
          "Apos a contratacao, voce recebe acesso ao painel de parceiro. La dentro: va em Configuracoes > Integracao > XML/Feed.",
        destaque: true,
      },
      {
        texto:
          "Cole a URL do feed no campo indicado e salve. O portal faz uma importacao de teste imediatamente.",
        destaque: true,
      },
      {
        texto:
          "Se a importacao de teste der erro, entre em contato com o suporte deles — o XML gerado aqui e no formato correto, provavelmente e so um ajuste de configuracao no painel deles.",
      },
      {
        texto:
          "Ativacao completa em 24 a 48 horas.",
      },
    ],
  },
  {
    id: "chavesnamao",
    nome: "Chaves na Mao",
    gratuito: true,
    dificuldade: "Facil",
    prazoAtivacao: "Imediato (ate 24 horas)",
    site: "https://www.chavesnamao.com.br",
    youtubeBusca:
      "https://www.youtube.com/results?search_query=chaves+na+mao+importar+imoveis+xml",
    passos: [
      {
        texto:
          "Acesse chavesnamao.com.br e crie uma conta como imobiliaria (gratuito, sem contrato).",
      },
      {
        texto:
          "Confirme o e-mail e acesse o painel administrativo deles.",
      },
      {
        texto:
          'No painel, procure por "Importar Imoveis", "Integracao XML" ou "Feed de Imoveis".',
        destaque: true,
      },
      {
        texto:
          "Cole a URL do feed no campo indicado. Configure para importar automaticamente (diariamente ou a cada 6 horas).",
        destaque: true,
      },
      {
        texto:
          "Clique em importar agora para testar. Os imoveis devem aparecer em minutos.",
      },
      {
        texto:
          "Gratuito, sem necessidade de falar com consultor. Voce mesmo configura.",
      },
    ],
  },
];

const DIFICULDADE_COR: Record<GuiaPortal["dificuldade"], string> = {
  Facil: "bg-emerald-100 text-emerald-700",
  Media: "bg-amber-100 text-amber-700",
};

function PortalGuia({ portal }: { portal: GuiaPortal }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Cabecalho clicavel */}
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-slate-800">{portal.nome}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              portal.gratuito
                ? "bg-emerald-100 text-emerald-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {portal.gratuito ? "Gratuito" : "Requer contrato"}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFICULDADE_COR[portal.dificuldade]}`}
          >
            {portal.dificuldade}
          </span>
          <span className="text-xs text-slate-500">
            Ativacao: {portal.prazoAtivacao}
          </span>
        </div>
        <span
          className={`text-slate-400 text-lg transition-transform ${aberto ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {/* Conteudo */}
      {aberto && (
        <div className="px-5 pb-5 flex flex-col gap-4 border-t border-slate-100">
          {/* Aviso especial */}
          {portal.obs && (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              <strong>Observacao:</strong> {portal.obs}
            </div>
          )}

          {/* Passos */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">
              Passo a passo:
            </p>
            <ol className="flex flex-col gap-3">
              {portal.passos.map((passo, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-bold">
                    {i + 1}
                  </span>
                  <span
                    className={`text-sm leading-relaxed ${
                      passo.destaque
                        ? "text-slate-800 font-medium"
                        : "text-slate-600"
                    }`}
                  >
                    {passo.texto}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={portal.site}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Acessar site do portal
            </a>
            <a
              href={portal.youtubeBusca}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Buscar videos tutoriais no YouTube
            </a>
          </div>
          <p className="text-xs text-slate-400">
            O botao do YouTube busca por tutoriais atuais deste portal — sempre
            mostra os videos mais recentes disponiveis.
          </p>
        </div>
      )}
    </div>
  );
}

export default function GuiaPortaisPage() {
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Voltar */}
      <Link
        href="/admin/integracoes/portais"
        className="inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 mb-6"
      >
        ← Voltar para Portais XML
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mb-1">
        Guia de Integracao com Portais
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Instrucoes completas para ativar cada portal. Clique no nome para
        expandir o passo a passo.
      </p>

      {/* Como funciona — explicacao geral */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 mb-6">
        <h2 className="font-semibold text-blue-800 mb-2 text-sm uppercase tracking-wide">
          Como o XML funciona (leia primeiro)
        </h2>
        <div className="flex flex-col gap-2 text-sm text-blue-800">
          <p>
            Seu site gera automaticamente um arquivo XML com todos os imoveis
            disponíveis. Este arquivo fica em uma URL fixa (visivel nos cards da
            pagina anterior).
          </p>
          <p>
            Quando voce cadastra essa URL no portal, ele passa a acessar esse
            arquivo de tempos em tempos (geralmente a cada 6-12 horas) e atualiza
            os anuncios automaticamente. Voce nao precisa fazer nada depois disso
            — qualquer alteracao ou novo imovel aparece no portal automaticamente.
          </p>
          <p className="font-medium">
            Resumindo: voce da a URL uma vez, e pronto para sempre.
          </p>
        </div>
      </div>

      {/* Portais */}
      <div className="flex flex-col gap-3">
        {GUIA.map((portal) => (
          <PortalGuia key={portal.id} portal={portal} />
        ))}
      </div>

      {/* Duvidas */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="font-semibold text-slate-800 mb-2">Algum portal deu erro?</p>
        <p>
          Os portais podem mudar o layout do painel deles com o tempo. Se os
          passos acima nao estiverem exatamente como descrito, procure pelo suporte
          do proprio portal — eles tem atendimento por e-mail e WhatsApp e o
          onboarding de novas imobiliarias e responsabilidade deles.
        </p>
        <p className="mt-2">
          O XML gerado pelo seu site ja esta no formato correto e aceito por todos
          os portais. Se o erro for no XML, entre em contato com seu desenvolvedor.
        </p>
      </div>
    </div>
  );
}
