import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { encryptApiKey } from "@/lib/crypto-helpers";

const SalvarSchema = z.object({
  provider: z.enum(["openai", "anthropic", "gemini", "groq"]),
  apiKey: z.string().min(1).max(500),
  nome: z.string().max(100).default("Assistente JCNI"),
  tom: z.enum(["formal", "amigavel", "neutro"]).default("amigavel"),
  boasVindas: z
    .string()
    .max(500)
    .default("Ola! Como posso ajudar voce a encontrar o imovel ideal?"),
  gatilhoWhatsApp: z
    .string()
    .max(300)
    .default("o cliente quiser agendar visita"),
  ctaWhatsApp: z
    .string()
    .max(200)
    .default("Conversar com a Jessica pelo WhatsApp"),
  ativo: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const parsed = SalvarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", detalhes: parsed.error.issues },
      { status: 400 }
    );
  }

  const {
    provider,
    apiKey,
    nome,
    tom,
    boasVindas,
    gatilhoWhatsApp,
    ctaWhatsApp,
    ativo,
  } = parsed.data;

  const encryptedKey = encryptApiKey(apiKey);

  const entries: Record<string, string> = {
    chat_provider: provider,
    chat_api_key: encryptedKey,
    chat_nome: nome,
    chat_tom: tom,
    chat_boas_vindas: boasVindas,
    chat_gatilho_whatsapp: gatilhoWhatsApp,
    chat_cta_whatsapp: ctaWhatsApp,
    chat_ativo: ativo ? "true" : "false",
  };

  const ops = Object.entries(entries).map(([chave, valor]) =>
    prisma.configuracao.upsert({
      where: { chave },
      update: { valor },
      create: { chave, valor },
    })
  );

  await prisma.$transaction(ops);
  revalidateTag("site-config");

  return NextResponse.json({ ok: true });
}
