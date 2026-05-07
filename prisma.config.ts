
// Prisma config — carrega .env.local (convenção Next.js) para o CLI de migrations
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { defineConfig } from "prisma/config";

const fallbackDbUrl = "postgresql://postgres:postgres@localhost:5432/postgres";
const prismaDbUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? fallbackDbUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Em CI/build (Cloudflare), DIRECT_URL pode não existir; para `prisma generate`
    // basta uma URL válida sintaticamente, sem conexão real com banco.
    url: prismaDbUrl,
  },
});
