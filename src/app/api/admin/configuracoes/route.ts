import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const configs = await prisma.configuracao.findMany();
  const map: Record<string, string> = {};
  for (const c of configs) {
    map[c.chave] = c.valor;
  }
  return NextResponse.json(map);
}

const UpsertSchema = z.record(z.string(), z.string().max(500));

async function handleUpsert(req: NextRequest) {
  const body = await req.json();
  const parsed = UpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
  }

  const ops = Object.entries(parsed.data).map(([chave, valor]) =>
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

export async function PUT(req: NextRequest) {
  return handleUpsert(req);
}

export async function POST(req: NextRequest) {
  return handleUpsert(req);
}
