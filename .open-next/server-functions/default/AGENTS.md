# AGENTS.md - App Jessica Campos

## Fonte oficial

- Ler `../Documentos/PRD-MESTRE.md` antes de planejar, codar, revisar ou alterar comportamento.
- Seguir `../Documentos/INICIO-INTELIGENTE.md`.
- Se a demanda nao estiver coberta por RN/US/CA, atualizar o PRD antes de implementar.

## Regras do app

- Responder em portugues do Brasil.
- Nao usar emojis.
- Manter layout responsivo e sem aparencia generica de IA.
- Usar Next.js 15 App Router, TypeScript strict e Tailwind CSS v4.
- Manter arquitetura free-first: Cloudflare Pages/Workers, R2, Supabase e Resend.
- Nao depender de Vercel Hobby para entrega comercial.
- Nao expor dados privados em rotas publicas, HTML, XML, JSON-LD, analytics ou logs publicos.
- Cada imovel publicado deve ter landing page SEO robusta.

## UI e verificacao

- Seguir prints/Figma como estrutura visual, sem copiar marcas, logos, textos ou fotos de terceiros.
- Nao usar blobs, orbs, bokeh, gradientes decorativos aleatorios, glassmorphism sem funcao, ilustracoes 3D genericas ou textos inventados.
- Validar 390px, 768px, 1366px, 1440px e 1920px quando houver navegador disponivel.
- Usar `$playwright-interactive` quando houver app rodando e for preciso validar visualmente.

## Finalizacao

- Rodar `npm run typecheck`, `npm run lint` e `npm run build` quando possivel.
- Informar claramente checks nao executados e risco residual.
