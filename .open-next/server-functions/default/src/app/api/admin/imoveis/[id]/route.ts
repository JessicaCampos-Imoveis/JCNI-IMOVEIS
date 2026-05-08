import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { gerarSlug, gerarAltTexto, gerarMetaTitulo, gerarMetaDescricao } from "@/lib/imovel-utils";
import type { TipoImovel, Finalidade } from "@/generated/prisma/client";

type Params = { params: Promise<{ id: string }> };

const ImovelUpdateSchema = z.object({
  titulo: z.string().min(5).max(200).optional(),
  descricao: z.string().max(5000).optional().nullable(),
  tipo: z.enum(["APARTAMENTO", "CASA", "TERRENO", "COMERCIAL", "COBERTURA", "KITNET", "RURAL"]).optional(),
  finalidade: z.enum(["VENDA", "ALUGUEL", "AMBOS"]).optional(),
  status: z.enum(["DISPONIVEL", "RESERVADO", "VENDIDO", "LOCADO", "INATIVO"]).optional(),
  preco: z.number().positive().optional(),
  precoCondominio: z.number().positive().optional().nullable(),
  iptu: z.number().positive().optional().nullable(),
  bairro: z.string().min(2).max(100).optional(),
  cidade: z.string().min(2).max(100).optional(),
  estado: z.string().length(2).optional(),
  nomeCondominio: z.string().max(200).optional().nullable(),
  area: z.number().positive().optional().nullable(),
  areaUtil: z.number().positive().optional().nullable(),
  quartos: z.number().int().min(0).max(50).optional().nullable(),
  suites: z.number().int().min(0).max(50).optional().nullable(),
  banheiros: z.number().int().min(0).max(50).optional().nullable(),
  vagas: z.number().int().min(0).max(50).optional().nullable(),
  videoYoutube: z.string().url().optional().nullable().or(z.literal("")),
  nomeProprietario: z.string().max(200).optional().nullable(),
  telefoneProprietario: z.string().max(30).optional().nullable(),
  emailProprietario: z.string().email().optional().nullable().or(z.literal("")),
  cep: z.string().max(10).optional().nullable(),
  rua: z.string().max(200).optional().nullable(),
  numero: z.string().max(20).optional().nullable(),
  complemento: z.string().max(100).optional().nullable(),
  andar: z.string().max(20).optional().nullable(),
  observacoesInternas: z.string().max(2000).optional().nullable(),
  // SEO (editave manualmente)
  metaTitulo: z.string().max(200).optional().nullable(),
  metaDescricao: z.string().max(400).optional().nullable(),
  slugUrl: z.string().max(300).optional().nullable(),
  altTexto: z.string().max(300).optional().nullable(),
  comodidadeIds: z.array(z.string().min(1)).optional(),
});

// ─── GET /api/admin/imoveis/[id] ─────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const imovel = await prisma.imovel.findFirst({
      where: { id, deletadoEm: null },
      include: {
        fotos: { orderBy: [{ destaque: "desc" }, { ordem: "asc" }] },
        comodos: { orderBy: { ordem: "asc" } },
        comodidades: {
          include: {
            comodidade: { include: { categoria: true } },
          },
        },
      },
    });

    if (!imovel) {
      return NextResponse.json({ error: "Imovel nao encontrado" }, { status: 404 });
    }

    return NextResponse.json(imovel);
  } catch (err) {
    console.error("[GET /api/admin/imoveis/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ─── PUT /api/admin/imoveis/[id] ─────────────────────────────────────────────

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const existente = await prisma.imovel.findFirst({
      where: { id, deletadoEm: null },
      select: { id: true, codigo: true, tipo: true, bairro: true, finalidade: true, quartos: true, cidade: true, area: true },
    });

    if (!existente) {
      return NextResponse.json({ error: "Imovel nao encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = ImovelUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Regenera slug/alt/meta se campos SEO mudaram
    const tipo = (data.tipo ?? existente.tipo) as TipoImovel;
    const bairro = data.bairro ?? existente.bairro;
    const finalidade = (data.finalidade ?? existente.finalidade) as Finalidade;
    const cidade = data.cidade ?? existente.cidade;
    const quartos = "quartos" in data ? data.quartos : existente.quartos;
    const area = "area" in data ? data.area : existente.area;

    const slugChanged = data.tipo || data.bairro;

    const slugUrlAuto = slugChanged
      ? await gerarSlug(tipo, bairro, existente.codigo, id)
      : undefined;

    const altTextoAuto = gerarAltTexto({ tipo, quartos: quartos ?? undefined, bairro, cidade, codigo: existente.codigo });
    const metaTituloAuto = gerarMetaTitulo({ tipo, finalidade, quartos: quartos ?? undefined, bairro, cidade });
    const metaDescricaoAuto = gerarMetaDescricao({ tipo, finalidade, bairro, cidade, quartos: quartos ?? undefined, area: area ?? undefined, codigo: existente.codigo });

    // Campos SEO: se o usuario enviou valor nao-nulo explicitamente, usa o dele; senao usa o gerado
    const slugUrl = (data.slugUrl != null && data.slugUrl !== "") ? data.slugUrl : (slugUrlAuto ?? undefined);
    const altTexto = (data.altTexto != null && data.altTexto !== "") ? data.altTexto : altTextoAuto;
    const metaTitulo = (data.metaTitulo != null && data.metaTitulo !== "") ? data.metaTitulo : metaTituloAuto;
    const metaDescricao = (data.metaDescricao != null && data.metaDescricao !== "") ? data.metaDescricao : metaDescricaoAuto;

    const comodidadeIds = data.comodidadeIds ? Array.from(new Set(data.comodidadeIds)) : undefined;

    // Extrai campos SEO e comodidades do payload para tratamento separado (nao usar spread direto no update)
    const {
      slugUrl: payloadSlugUrl,
      altTexto: payloadAltTexto,
      metaTitulo: payloadMetaTitulo,
      metaDescricao: payloadMetaDescricao,
      comodidadeIds: payloadComodidadeIds,
      ...dataRest
    } = data;
    // Uso intencional para evitar warnings de variaveis nao utilizadas.
    void payloadSlugUrl;
    void payloadAltTexto;
    void payloadMetaTitulo;
    void payloadMetaDescricao;
    void payloadComodidadeIds;

    const atualizado = await prisma.imovel.update({
      where: { id },
      data: {
        ...dataRest,
        tipo: data.tipo as TipoImovel | undefined,
        finalidade: data.finalidade as Finalidade | undefined,
        status: data.status as never,
        ...(slugUrl && { slugUrl }),
        altTexto,
        metaTitulo,
        metaDescricao,
        videoYoutube: data.videoYoutube === "" ? null : data.videoYoutube,
        emailProprietario: data.emailProprietario === "" ? null : data.emailProprietario,
        comodidades: comodidadeIds
          ? {
              deleteMany: {},
              create: comodidadeIds.map((comodidadeId) => ({ comodidadeId })),
            }
          : undefined,
      },
      select: {
        id: true,
        codigo: true,
        slugUrl: true,
        titulo: true,
        status: true,
        atualizadoEm: true,
      },
    });

    return NextResponse.json(atualizado);
  } catch (err) {
    console.error("[PUT /api/admin/imoveis/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ─── DELETE /api/admin/imoveis/[id] — soft delete ou purge ───────────────────

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const purge = req.nextUrl.searchParams.get("purge") === "true";

    const existente = await prisma.imovel.findFirst({
      where: { id },
      select: {
        id: true,
        fotos: { select: { id: true, url: true } },
      },
    });

    if (!existente) {
      return NextResponse.json({ error: "Imovel nao encontrado" }, { status: 404 });
    }

    if (purge) {
      // Excluir fotos do Storage antes de apagar o registro
      if (existente.fotos.length > 0) {
        const { StorageClient } = await import("@supabase/storage-js");
        const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1`;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
        const storage = new StorageClient(storageUrl, {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        });
        const bucket = process.env.STORAGE_BUCKET ?? "imoveis-fotos";
        // Extrair paths das URLs
        const paths = existente.fotos.map((f) => {
          try {
            const url = new URL(f.url);
            // path: /storage/v1/object/public/<bucket>/<path>
            const parts = url.pathname.split(`/object/public/${bucket}/`);
            return parts[1] ?? f.id;
          } catch {
            return f.id;
          }
        });
        await storage.from(bucket).remove(paths).catch((e) => {
          console.error("[DELETE purge] erro ao remover fotos do storage:", e);
        });
      }

      // Hard delete — cascata remove fotos, cômodos e comodidades via prisma schema
      await prisma.imovel.delete({ where: { id } });
    } else {
      // Soft delete
      await prisma.imovel.update({
        where: { id },
        data: {
          status: "INATIVO",
          deletadoEm: new Date(),
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/imoveis/[id]]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
