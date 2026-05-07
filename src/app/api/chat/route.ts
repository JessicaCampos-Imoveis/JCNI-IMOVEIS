import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/crypto-helpers";
import type { ModelMessage } from "ai";
import type { Finalidade, TipoImovel } from "@/generated/prisma/client";

const ChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(50),
});

const TIPO_LABEL: Record<TipoImovel, string> = {
  APARTAMENTO: "Apartamento",
  CASA: "Casa",
  TERRENO: "Terreno",
  COMERCIAL: "Comercial / Sala",
  COBERTURA: "Cobertura",
  KITNET: "Kitnet",
  RURAL: "Rural",
};

const FINAL_LABEL: Partial<Record<Finalidade, string>> = {
  VENDA: "venda",
  ALUGUEL: "aluguel",
  AMBOS: "venda e aluguel",
};

function buildModel(provider: string, apiKey: string) {
  switch (provider) {
    case "openai":
      return createOpenAI({ apiKey })("gpt-4o-mini");
    case "anthropic":
      return createAnthropic({ apiKey })("claude-3-haiku-20240307");
    case "gemini":
      return createGoogleGenerativeAI({ apiKey })("gemini-1.5-flash");
    case "groq":
    default:
      return createGroq({ apiKey })("llama-3.1-8b-instant");
  }
}

function formatarPreco(preco: number | null, finalidade: Finalidade): string {
  if (!preco) return "a consultar";
  const fmt = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(preco);
  return finalidade === "ALUGUEL" ? `${fmt}/mes` : fmt;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON invalido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = ChatSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Dados invalidos" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Ler config do banco — apenas chaves necessarias
  const rows = await prisma.configuracao.findMany({
    where: {
      chave: {
        in: [
          "chat_ativo",
          "chat_provider",
          "chat_api_key",
          "chat_nome",
          "chat_tom",
          "chat_gatilho_whatsapp",
        ],
      },
    },
  });
  const conf: Record<string, string> = {};
  for (const r of rows) conf[r.chave] = r.valor;

  if (conf["chat_ativo"] !== "true") {
    return new Response("Chat IA nao esta ativo.", { status: 503 });
  }

  const provider = conf["chat_provider"] ?? "groq";
  const encryptedKey = conf["chat_api_key"] ?? "";
  if (!encryptedKey) {
    return new Response("Chave de API nao configurada.", { status: 503 });
  }

  let apiKey: string;
  try {
    apiKey = decryptApiKey(encryptedKey);
  } catch {
    return new Response("Erro interno de configuracao.", { status: 503 });
  }

  // Buscar os 30 imoveis mais recentes disponíveis (apenas campos publicos)
  const imoveis = await prisma.imovel.findMany({
    where: { status: "DISPONIVEL", deletadoEm: null },
    orderBy: { criadoEm: "desc" },
    take: 30,
    select: {
      codigo: true,
      tipo: true,
      finalidade: true,
      preco: true,
      bairro: true,
      cidade: true,
      estado: true,
      quartos: true,
      banheiros: true,
      vagas: true,
      area: true,
    },
  });

  const listaImoveis = imoveis
    .map((i) => {
      const preco = formatarPreco(
        i.preco ? Number(i.preco) : null,
        i.finalidade
      );
      const tipo = TIPO_LABEL[i.tipo] ?? i.tipo;
      const final = FINAL_LABEL[i.finalidade] ?? i.finalidade;
      const detalhes = [
        i.quartos ? `${i.quartos}q` : null,
        i.banheiros ? `${i.banheiros}b` : null,
        i.vagas ? `${i.vagas}v` : null,
        i.area ? `${i.area}m2` : null,
      ]
        .filter(Boolean)
        .join(" ");
      return `[${i.codigo}] ${tipo} a ${final} | ${preco} | ${i.bairro}, ${i.cidade}-${i.estado}${detalhes ? ` | ${detalhes}` : ""}`;
    })
    .join("\n");

  const nome = conf["chat_nome"] ?? "Assistente JCNI";
  const tom = conf["chat_tom"] ?? "amigavel";
  const tomDesc =
    tom === "formal"
      ? "Use linguagem formal e profissional."
      : tom === "neutro"
        ? "Use linguagem neutra e objetiva."
        : "Seja amigavel, proximo e acolhedor.";
  const gatilho =
    conf["chat_gatilho_whatsapp"] ??
    "o cliente quiser agendar visita ou tiver interesse concreto em um imovel";

  const systemPrompt = `Voce e ${nome}, assistente imobiliario digital da Jessica Campos Negocios Imobiliarios em Sorocaba, SP.
${tomDesc}

PORTFOLIO DISPONIVEL (${imoveis.length} imoveis):
${listaImoveis || "Nenhum imovel disponivel no momento."}

REGRAS:
1. Responda APENAS sobre imoveis da lista acima. Nao invente imoveis, precos ou caracteristicas.
2. Nao revele enderecos completos — mencione apenas bairro e cidade.
3. Quando ${gatilho}, responda normalmente e adicione ao FINAL da resposta exatamente: [WHATSAPP_CTA]
4. Sempre em portugues brasileiro. Se nao souber algo, diga honestamente.
5. Se o perfil do cliente nao bater com a lista, indique os mais proximos do pedido.`;

  try {
    const model = buildModel(provider, apiKey);
    const result = streamText({
      model,
      system: systemPrompt,
      messages: parsed.data.messages as ModelMessage[],
      maxOutputTokens: 800,
    });

    return result.toTextStreamResponse();
  } catch (e) {
    console.error("[api/chat] streamText error:", e);
    return new Response("Erro ao processar resposta do assistente.", {
      status: 500,
    });
  }
}
