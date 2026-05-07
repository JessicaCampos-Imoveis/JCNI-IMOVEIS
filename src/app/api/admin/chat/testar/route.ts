import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";

const TestarSchema = z.object({
  provider: z.enum(["openai", "anthropic", "gemini", "groq"]),
  apiKey: z.string().min(1).max(500),
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

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, erro: "JSON invalido" },
      { status: 400 }
    );
  }

  const parsed = TestarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, erro: "Dados invalidos" },
      { status: 400 }
    );
  }

  const { provider, apiKey } = parsed.data;

  try {
    const model = buildModel(provider, apiKey);
    await generateText({
      model,
      messages: [{ role: "user" as const, content: "Oi" }],
      maxOutputTokens: 3,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Retornar mensagem truncada — sem vazar detalhes internos
    const clean =
      msg.length > 300 ? msg.substring(0, 300) + "..." : msg;
    return NextResponse.json({ ok: false, erro: clean });
  }
}
