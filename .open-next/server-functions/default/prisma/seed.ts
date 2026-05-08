import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client";
import bcryptjs from "bcryptjs";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL nao definida em .env / .env.local");

const prisma = new PrismaClient({
  datasourceUrl: dbUrl,
});

function normalizarNome(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

const COMODIDADES_BASE: Array<{ categoria: string; itens: string[] }> = [
  {
    categoria: "Internas do imóvel",
    itens: [
      "Ar-condicionado",
      "Armários planejados",
      "Closet",
      "Varanda",
      "Varanda gourmet",
      "Sacada",
      "Lavabo",
      "Suíte",
      "Cozinha americana",
      "Cozinha planejada",
      "Área de serviço",
      "Despensa",
      "Escritório",
      "Mobiliado",
      "Semi-mobiliado",
      "Lareira",
      "Aquecimento a gás",
      "Aquecimento solar",
      "Fechadura eletrônica",
      "Permite pets",
    ],
  },
  {
    categoria: "Condomínio",
    itens: [
      "Portaria 24h",
      "Portaria virtual",
      "Segurança 24h",
      "Controle de acesso",
      "Elevador",
      "Elevador de serviço",
      "Piscina",
      "Piscina aquecida",
      "Piscina infantil",
      "Academia",
      "Salão de festas",
      "Espaço gourmet",
      "Churrasqueira",
      "Playground",
      "Brinquedoteca",
      "Coworking",
      "Pet place",
      "Pet wash",
      "Bicicletário",
      "Mini mercado",
    ],
  },
  {
    categoria: "Segurança",
    itens: [
      "Portão eletrônico",
      "Interfone",
      "Vídeo porteiro",
      "Câmeras de segurança",
      "Alarme",
      "Monitoramento 24h",
      "Guarita",
      "Cerca elétrica",
      "Controle biométrico",
      "Acesso por reconhecimento facial",
    ],
  },
  {
    categoria: "Área externa",
    itens: [
      "Quintal",
      "Jardim",
      "Piscina privativa",
      "Churrasqueira externa",
      "Área gourmet",
      "Edícula",
      "Horta",
      "Pomar",
      "Depósito",
      "Portão automático",
    ],
  },
  {
    categoria: "Garagem e mobilidade",
    itens: [
      "Garagem coberta",
      "Garagem descoberta",
      "Vaga para visitante",
      "Vaga para moto",
      "Vaga demarcada",
      "Tomada para carro elétrico",
      "Carregador para carro elétrico",
      "Bicicletário",
      "Fácil acesso ao transporte público",
      "Próximo a ponto de ônibus",
    ],
  },
  {
    categoria: "Comercial",
    itens: [
      "Recepção",
      "Sala de reunião",
      "Auditório",
      "Copa",
      "Banheiro PCD",
      "Ar-condicionado central",
      "Cabeamento estruturado",
      "Pé-direito alto",
      "Docas",
      "Estacionamento para clientes",
      "Elevador comercial",
      "Elevador de carga",
      "Vitrine",
      "Mezanino",
    ],
  },
  {
    categoria: "Acessibilidade",
    itens: [
      "Acessibilidade PCD",
      "Acesso para PCD",
      "Rampa de acesso",
      "Elevador com acessibilidade",
      "Banheiro adaptado",
      "Piso tátil",
      "Vaga PCD",
    ],
  },
  {
    categoria: "Sustentabilidade",
    itens: [
      "Energia solar",
      "Energia solar no condomínio",
      "Aquecimento solar",
      "Reuso de água",
      "Captação de água da chuva",
      "Iluminação LED",
      "Horta comunitária",
      "Carregador para carro elétrico",
    ],
  },
];

async function seedComodidadesBase() {
  for (let i = 0; i < COMODIDADES_BASE.length; i++) {
    const categoriaBase = COMODIDADES_BASE[i];
    const nomeCategoria = normalizarNome(categoriaBase.categoria);

    let categoria = await prisma.categoriaComodidade.findFirst({
      where: {
        nome: {
          equals: nomeCategoria,
          mode: "insensitive",
        },
      },
      select: { id: true, nome: true },
    });

    if (!categoria) {
      categoria = await prisma.categoriaComodidade.create({
        data: {
          nome: nomeCategoria,
          ordem: i,
        },
        select: { id: true, nome: true },
      });
    }

    const existentes = await prisma.comodidade.findMany({
      where: { categoriaId: categoria.id },
      select: { id: true, nome: true },
    });

    const nomesExistentes = new Set(
      existentes.map((item) => normalizarNome(item.nome).toLowerCase()),
    );

    for (const item of categoriaBase.itens) {
      const nomeItem = normalizarNome(item);
      const chave = nomeItem.toLowerCase();
      if (nomesExistentes.has(chave)) continue;

      await prisma.comodidade.create({
        data: {
          categoriaId: categoria.id,
          nome: nomeItem,
        },
      });

      nomesExistentes.add(chave);
    }
  }
}

async function main() {
  const SALT = 12;
  const senha = process.env.ADMIN_SENHA;
  if (!senha) throw new Error("ADMIN_SENHA nao definida em .env.local");

  const email1 = process.env.ADMIN_EMAIL;
  const email2 = process.env.ADMIN2_EMAIL;
  if (!email1 || !email2) throw new Error("ADMIN_EMAIL / ADMIN2_EMAIL nao definidos em .env.local");

  const hash = await bcryptjs.hash(senha, SALT);

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

  await seedComodidadesBase();
  console.log("Seed de comodidades padrao concluido (idempotente).");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
