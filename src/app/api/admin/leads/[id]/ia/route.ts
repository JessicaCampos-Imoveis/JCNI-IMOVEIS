import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/crypto-helpers";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";

type Params = { params: Promise<{ id: string }> };

const RequestSchema = z.object({
  acao: z.enum(["resumo", "sugestao", "mensagem"]),
});

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

function statusTemperaturaLabel(status: string): string {
  if (status === "NOVO" || status === "EM_CONTATO") return "Morno";
  if (status === "VISITOU" || status === "PROPOSTA") return "Quente";
  return "Frio";
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
    }

    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados invalidos: acao deve ser resumo | sugestao | mensagem" }, { status: 400 });
    }

    const { acao } = parsed.data;

    // Carregar configuracao de IA
    const configRows = await prisma.configuracao.findMany({
      where: { chave: { in: ["chat_provider", "chat_api_key"] } },
    });
    const conf: Record<string, string> = {};
    for (const r of configRows) conf[r.chave] = r.valor;

    if (!conf.chat_provider || !conf.chat_api_key) {
      return NextResponse.json(
        { error: "Assistente de IA nao configurado. Acesse Configuracoes > Chat IA para ativar." },
        { status: 422 }
      );
    }

    let apiKey: string;
    try {
      apiKey = decryptApiKey(conf.chat_api_key);
    } catch {
      return NextResponse.json(
        { error: "Chave de API invalida. Reconfigure em Configuracoes > Chat IA." },
        { status: 422 }
      );
    }

    // Buscar lead com contexto operacional completo
    const lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        mensagem: true,
        status: true,
        origem: true,
        responsavel: true,
        proximaAcao: true,
        motivoPerda: true,
        criadoEm: true,
        imovel: {
          select: {
            codigo: true,
            titulo: true,
            tipo: true,
            finalidade: true,
            preco: true,
            bairro: true,
            cidade: true,
          },
        },
        notas: {
          orderBy: { criadaEm: "desc" },
          take: 5,
          select: { texto: true, criadaEm: true },
        },
        tarefas: {
          where: { status: "PENDENTE" },
          orderBy: { criadaEm: "desc" },
          take: 5,
          select: { titulo: true, tipo: true, dataHora: true, responsavel: true },
        },
        atividades: {
          orderBy: { criadaEm: "desc" },
          take: 8,
          select: { titulo: true, descricao: true, criadaEm: true },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead nao encontrado" }, { status: 404 });
    }

    const diasDecorridos = Math.floor(
      (Date.now() - new Date(lead.criadoEm).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Montar contexto estruturado
    const linhasBase = [
      `Lead: ${lead.nome}`,
      `Telefone: ${lead.telefone}`,
      lead.email ? `E-mail: ${lead.email}` : null,
      `Status no funil: ${lead.status} | Temperatura: ${statusTemperaturaLabel(lead.status)}`,
      `Origem: ${lead.origem ?? "Nao informada"}`,
      `Criado ha ${diasDecorridos} dia(s)`,
      lead.responsavel ? `Responsavel: ${lead.responsavel}` : null,
      lead.proximaAcao ? `Proxima acao registrada: ${lead.proximaAcao}` : null,
      lead.mensagem ? `Mensagem inicial do lead: "${lead.mensagem}"` : null,
    ].filter(Boolean) as string[];

    const imovelCtx = lead.imovel
      ? [
          `Imovel de interesse: ${lead.imovel.codigo} — ${lead.imovel.titulo}`,
          `  Tipo: ${lead.imovel.tipo} | Finalidade: ${lead.imovel.finalidade}`,
          `  Bairro: ${lead.imovel.bairro}, ${lead.imovel.cidade}`,
          `  Preco: R$ ${Number(lead.imovel.preco).toLocaleString("pt-BR")}`,
        ].join("\n")
      : "Nenhum imovel vinculado.";

    const notasCtx =
      lead.notas.length > 0
        ? "Observacoes internas (recentes):\n" +
          lead.notas
            .map((n) => `- "${n.texto}" (${new Date(n.criadaEm).toLocaleDateString("pt-BR")})`)
            .join("\n")
        : "Sem observacoes internas.";

    const tarefasCtx =
      lead.tarefas.length > 0
        ? "Tarefas pendentes:\n" +
          lead.tarefas
            .map(
              (t) =>
                `- [${t.tipo}] ${t.titulo}${t.dataHora ? ` — para ${t.dataHora}` : ""}`
            )
            .join("\n")
        : "Nenhuma tarefa pendente.";

    const atividadesCtx =
      lead.atividades.length > 0
        ? "Historico de atividades:\n" +
          lead.atividades
            .map(
              (a) =>
                `- ${a.titulo}: ${a.descricao} (${new Date(a.criadaEm).toLocaleDateString("pt-BR")})`
            )
            .join("\n")
        : "Sem atividades registradas.";

    const fullContext = [
      linhasBase.join("\n"),
      imovelCtx,
      notasCtx,
      tarefasCtx,
      atividadesCtx,
    ].join("\n\n");

    let prompt: string;
    switch (acao) {
      case "resumo":
        prompt = `Voce e um assistente de CRM imobiliario. Com base nos dados do lead abaixo, gere um resumo executivo em 4 a 6 linhas destacando: quem e o lead, o que busca, em que etapa do funil esta, pontos de atencao e oportunidade. Seja objetivo e profissional. Responda em portugues do Brasil.\n\n${fullContext}`;
        break;
      case "sugestao":
        prompt = `Voce e um assistente de CRM imobiliario especializado em conversao. Com base no historico do lead abaixo, sugira a proxima acao mais estrategica para avançar no funil. Seja pratico: indique uma acao especifica com horario/abordagem recomendada. Responda em 2 a 3 paragrafos em portugues do Brasil.\n\n${fullContext}`;
        break;
      case "mensagem":
        prompt = `Voce e um assistente de CRM imobiliario. Crie uma mensagem de WhatsApp profissional, cordial e personalizada para enviar ao lead ${lead.nome} agora. A mensagem deve ser natural (nao generica), mencionar o imovel de interesse se houver, e incentivar o proximo passo. Maximo 180 palavras. Responda apenas com a mensagem, sem introducoes ou explicacoes. Escreva em portugues do Brasil.\n\n${fullContext}`;
        break;
    }

    const model = buildModel(conf.chat_provider, apiKey);
    const { text } = await generateText({ model, prompt, maxTokens: 600 });

    return NextResponse.json({ resultado: text.trim() });
  } catch (err) {
    console.error("[POST /api/admin/leads/[id]/ia]", err);
    return NextResponse.json({ error: "Erro ao processar solicitacao de IA" }, { status: 500 });
  }
}
