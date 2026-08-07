# XibeSec 2026

Estrutura base do site — Next.js 16 (App Router) + Tailwind CSS 4 + TypeScript, com yarn.

## Requisitos

- Node.js 20.9+
- Yarn

## Scripts

```bash
yarn dev        # servidor de desenvolvimento (Turbopack) em http://localhost:3000
yarn build      # build de produção
yarn start      # servidor de produção
yarn lint       # ESLint
yarn lint:fix   # ESLint com correção automática
yarn typecheck  # checagem de tipos (tsc --noEmit)
```

## Estrutura

```
.
├── public/                 # assets estáticos servidos em /
├── src/
│   ├── app/                # App Router
│   │   ├── layout.tsx      # root layout (html/body)
│   │   ├── page.tsx        # rota /
│   │   ├── loading.tsx     # estado de carregamento
│   │   ├── error.tsx       # error boundary (client)
│   │   ├── not-found.tsx   # 404
│   │   └── globals.css     # entrada do Tailwind + tokens de tema
│   ├── components/         # componentes de UI
│   ├── lib/                # utilitários e helpers
│   └── types/              # tipos compartilhados
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs      # plugin @tailwindcss/postcss
└── tsconfig.json           # alias @/* -> src/*
```
