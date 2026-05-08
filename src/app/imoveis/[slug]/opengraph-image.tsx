import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/site-config";

export const runtime = "nodejs";
export const revalidate = 3600;
export const alt = "Imóvel Jéssica Campos Negócios Imobiliários";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const imovel = await (async () => {
    try {
      return await prisma.imovel.findFirst({
        where: { slugUrl: slug, deletadoEm: null },
        select: {
          titulo: true,
          tipo: true,
          bairro: true,
          cidade: true,
          preco: true,
          quartos: true,
          area: true,
          fotos: {
            select: { url: true, destaque: true },
            orderBy: [{ destaque: "desc" }, { ordem: "asc" }],
            take: 1,
          },
        },
      });
    } catch (error) {
      console.warn("opengraph-image: fallback sem dados do banco.", error);
      return null;
    }
  })();

  const fotoUrl = imovel?.fotos[0]?.url ?? null;
  const titulo = imovel?.titulo ?? "Imóvel";
  const bairro = imovel?.bairro ?? "";
  const cidade = imovel?.cidade ?? "Sorocaba";
  const localizacao = [bairro, cidade].filter(Boolean).join(", ");

  const preco = imovel?.preco
    ? Number(imovel.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#111827",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Foto de fundo */}
        {fotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.55,
            }}
          />
        )}

        {/* Gradiente escuro de baixo para cima */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.92) 100%)",
            display: "flex",
          }}
        />

        {/* Conteúdo */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "48px 64px",
          }}
        >
          {/* Topo: Marca */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                borderRadius: "8px",
                padding: "8px 18px",
                color: "white",
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "2px",
              }}
            >
              JCNI
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "17px",
                fontWeight: 400,
              }}
            >
              {SITE_CONFIG.brandFull}
            </span>
          </div>

          {/* Base: Dados do imóvel */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {preco && (
              <div
                style={{
                  color: "#FBBF24",
                  fontSize: "34px",
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                }}
              >
                {preco}
              </div>
            )}

            <div
              style={{
                color: "white",
                fontSize: titulo.length > 60 ? "36px" : "44px",
                fontWeight: 700,
                lineHeight: 1.2,
                maxWidth: "960px",
              }}
            >
              {titulo}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                color: "rgba(255,255,255,0.82)",
                fontSize: "21px",
                marginTop: "4px",
              }}
            >
              {localizacao && <span>📍 {localizacao}</span>}
              {imovel?.quartos && (
                <span>🛏 {imovel.quartos} quarto{imovel.quartos > 1 ? "s" : ""}</span>
              )}
              {imovel?.area && <span>📐 {imovel.area} m²</span>}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
