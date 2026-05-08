-- CreateEnum
CREATE TYPE "TipoImovel" AS ENUM ('APARTAMENTO', 'CASA', 'TERRENO', 'COMERCIAL', 'COBERTURA', 'KITNET', 'RURAL');

-- CreateEnum
CREATE TYPE "Finalidade" AS ENUM ('VENDA', 'ALUGUEL', 'AMBOS');

-- CreateEnum
CREATE TYPE "StatusImovel" AS ENUM ('DISPONIVEL', 'RESERVADO', 'VENDIDO', 'LOCADO', 'INATIVO');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NOVO', 'EM_CONTATO', 'VISITOU', 'PROPOSTA', 'FECHADO', 'PERDIDO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL DEFAULT '',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imovel" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoImovel" NOT NULL,
    "finalidade" "Finalidade" NOT NULL,
    "status" "StatusImovel" NOT NULL DEFAULT 'DISPONIVEL',
    "preco" DECIMAL(65,30) NOT NULL,
    "precoCondominio" DECIMAL(65,30),
    "iptu" DECIMAL(65,30),
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL DEFAULT 'Sorocaba',
    "estado" TEXT NOT NULL DEFAULT 'SP',
    "nomeCondominio" TEXT,
    "area" DOUBLE PRECISION,
    "areaUtil" DOUBLE PRECISION,
    "quartos" INTEGER,
    "suites" INTEGER,
    "banheiros" INTEGER,
    "vagas" INTEGER,
    "videoYoutube" TEXT,
    "visualizacoes" INTEGER NOT NULL DEFAULT 0,
    "slugUrl" TEXT NOT NULL,
    "altTexto" TEXT,
    "metaTitulo" TEXT,
    "metaDescricao" TEXT,
    "nomeProprietario" TEXT,
    "telefoneProprietario" TEXT,
    "emailProprietario" TEXT,
    "cep" TEXT,
    "rua" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "andar" TEXT,
    "observacoesInternas" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Foto" (
    "id" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "watermark" BOOLEAN NOT NULL DEFAULT true,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Foto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comodo" (
    "id" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "areaM2" DOUBLE PRECISION,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Comodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaComodidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "icone" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CategoriaComodidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comodidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "icone" TEXT,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "Comodidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImovelComodidade" (
    "imovelId" TEXT NOT NULL,
    "comodidadeId" TEXT NOT NULL,

    CONSTRAINT "ImovelComodidade_pkey" PRIMARY KEY ("imovelId","comodidadeId")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT NOT NULL,
    "mensagem" TEXT,
    "imovelId" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NOVO',
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "origem" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "Configuracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "statusHttp" INTEGER NOT NULL,
    "resposta" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Imovel_codigo_key" ON "Imovel"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Imovel_slugUrl_key" ON "Imovel"("slugUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Configuracao_chave_key" ON "Configuracao"("chave");

-- CreateIndex
CREATE INDEX "Configuracao_chave_idx" ON "Configuracao"("chave");

-- AddForeignKey
ALTER TABLE "Foto" ADD CONSTRAINT "Foto_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comodo" ADD CONSTRAINT "Comodo_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comodidade" ADD CONSTRAINT "Comodidade_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaComodidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImovelComodidade" ADD CONSTRAINT "ImovelComodidade_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImovelComodidade" ADD CONSTRAINT "ImovelComodidade_comodidadeId_fkey" FOREIGN KEY ("comodidadeId") REFERENCES "Comodidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookLog" ADD CONSTRAINT "WebhookLog_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
