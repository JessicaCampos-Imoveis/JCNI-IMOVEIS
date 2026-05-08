import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { getPublicConfig } from "@/lib/config-reader";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const configs = await prisma.configuracao.findMany();
  const map: Record<string, string> = {};
  for (const c of configs) {
    map[c.chave] = c.valor;
  }
  const publicConfig = await getPublicConfig();

  return NextResponse.json({
    texto_hero_titulo: publicConfig.heroTitulo,
    texto_hero_subtitulo: publicConfig.heroSubtitulo,
    texto_sobre_titulo: publicConfig.sobreTitulo,
    texto_sobre_corpo: publicConfig.sobreCorpo,
    og_image_url: publicConfig.ogImageUrl,
    radar_titulo: publicConfig.radarTitulo,
    radar_card_descricao: publicConfig.radarCardDescricao,
    empresa_email: publicConfig.contatoEmail,
    social_instagram_url: publicConfig.instagramUrl,
    social_whatsapp_url: publicConfig.socialWhatsappUrl,
    social_facebook_url: publicConfig.facebookUrl,
    social_linkedin_url: publicConfig.linkedinUrl,
    social_tiktok_url: publicConfig.tiktokUrl,
    ...map,
  });
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
