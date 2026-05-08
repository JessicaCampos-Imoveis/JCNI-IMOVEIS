This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy (Cloudflare Pages)

Este projeto faz deploy no **Cloudflare Pages** usando o adapter **OpenNext**.

Observacao importante em 07/05/2026: no plano gratuito atual, o deploy do app completo via Worker/OpenNext ficou bloqueado por limite de tamanho do bundle. Para manter custo zero, a direcao mais viavel e reduzir a parte runtime do app para uma estrategia mais estatica/lightweight no Pages em vez de insistir no mesmo bundle atual.

Projeto Pages criado na conta auditada: `jessica-campos` -> `jessica-campos.pages.dev`.

Runbook operacional desta migracao: `Documentos/CLOUDFLARE-PAGES-FREE-RUNBOOK.md`.

Consulte `Documentos/PRD-MESTRE.md` — seção "Fases de Desenvolvimento / Fase 6" para o guia completo de deploy.
