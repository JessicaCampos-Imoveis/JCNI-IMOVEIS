import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL nao definida em .env / .env.local");

const prisma = new PrismaClient({
  datasourceUrl: dbUrl,
});

async function main() {
  const SALT = 12;
  const senha = process.env.ADMIN_SENHA;
  if (!senha) throw new Error("ADMIN_SENHA nao definida em .env.local");

  const email1 = process.env.ADMIN_EMAIL;
  const email2 = process.env.ADMIN2_EMAIL;
  if (!email1 || !email2) throw new Error("ADMIN_EMAIL / ADMIN2_EMAIL nao definidos em .env.local");

  const hash = await bcrypt.hash(senha, SALT);

  await prisma.usuario.upsert({
    where: { email: email1 },
    update: { senha: hash, nome: "Jessica (admin)" },
    create: { email: email1, senha: hash, nome: "Jessica (admin)" },
  });

  await prisma.usuario.upsert({
    where: { email: email2 },
    update: { senha: hash, nome: "Jessica Campos" },
    create: { email: email2, senha: hash, nome: "Jessica Campos" },
  });

  console.log(`Seed concluido: ${email1} e ${email2}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
