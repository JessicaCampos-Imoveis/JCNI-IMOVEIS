-- Migration: CRM Leads Operacional
-- Adiciona campos CRM ao Lead + tabelas LeadNota, LeadTarefa, LeadAtividade

-- 1. Novos campos no Lead
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "responsavel"  TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "proximaAcao"  TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "motivoPerda"  TEXT;

-- 2. Enum LeadTarefaStatus
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LeadTarefaStatus') THEN
    CREATE TYPE "LeadTarefaStatus" AS ENUM ('PENDENTE', 'CONCLUIDA');
  END IF;
END $$;

-- 3. Notas do lead
CREATE TABLE IF NOT EXISTS "LeadNota" (
  "id"       TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "leadId"   TEXT         NOT NULL,
  "texto"    TEXT         NOT NULL,
  "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT now(),

  CONSTRAINT "LeadNota_pkey"          PRIMARY KEY ("id"),
  CONSTRAINT "LeadNota_leadId_fkey"   FOREIGN KEY ("leadId")
    REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. Tarefas do lead
CREATE TABLE IF NOT EXISTS "LeadTarefa" (
  "id"          TEXT               NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "leadId"      TEXT               NOT NULL,
  "titulo"      TEXT               NOT NULL,
  "tipo"        TEXT               NOT NULL DEFAULT 'FOLLOW_UP',
  "dataHora"    TEXT,
  "responsavel" TEXT,
  "observacao"  TEXT,
  "status"      "LeadTarefaStatus" NOT NULL DEFAULT 'PENDENTE',
  "criadaEm"   TIMESTAMP(3)       NOT NULL DEFAULT now(),

  CONSTRAINT "LeadTarefa_pkey"        PRIMARY KEY ("id"),
  CONSTRAINT "LeadTarefa_leadId_fkey" FOREIGN KEY ("leadId")
    REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Atividades / timeline do lead
CREATE TABLE IF NOT EXISTS "LeadAtividade" (
  "id"        TEXT         NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "leadId"    TEXT         NOT NULL,
  "tipo"      TEXT         NOT NULL,
  "titulo"    TEXT         NOT NULL,
  "descricao" TEXT         NOT NULL DEFAULT '',
  "origem"    TEXT,
  "tone"      TEXT,
  "criadaEm"  TIMESTAMP(3) NOT NULL DEFAULT now(),

  CONSTRAINT "LeadAtividade_pkey"        PRIMARY KEY ("id"),
  CONSTRAINT "LeadAtividade_leadId_fkey" FOREIGN KEY ("leadId")
    REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para performance nas listagens por lead
CREATE INDEX IF NOT EXISTS "LeadNota_leadId_idx"      ON "LeadNota"("leadId");
CREATE INDEX IF NOT EXISTS "LeadTarefa_leadId_idx"     ON "LeadTarefa"("leadId");
CREATE INDEX IF NOT EXISTS "LeadAtividade_leadId_idx"  ON "LeadAtividade"("leadId");
