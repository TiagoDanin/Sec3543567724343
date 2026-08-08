# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Idioma do projeto: **português do Brasil**, com acentuação correta. Vale para copy, comentários, labels do CMS e mensagens de commit.

## Comandos

```bash
yarn dev              # desenvolvimento em http://localhost:3000
yarn build            # build de produção → dist/
yarn storybook        # Storybook em http://localhost:6006
yarn build-storybook  # Storybook estático → storybook-static/
yarn lint             # ESLint 9 (flat config)
yarn lint:fix         # ESLint com correção automática
yarn typecheck        # tsc --noEmit
yarn format           # Prettier
yarn format:check     # Prettier em modo verificação
```

Não há suíte de testes e não se pretende adicionar uma: o site é 100% estático. O par que substitui é `yarn typecheck` + `yarn build`, e um validador de conteúdo com Zod (ainda não escrito, ver _Pendências_).

O runner de teste que vem no scaffold do Storybook (`@storybook/addon-vitest`, `vitest`, `playwright`) foi removido de propósito — o Storybook aqui é bancada de desenvolvimento visual, não harness de teste.

**Nunca** ligar `typescript.ignoreBuildErrors` ou `eslint.ignoreDuringBuilds` no `next.config.ts`. Os quatro projetos de referência ligam, e o resultado é build verde sobre código quebrado.

## Arquitetura

Site de evento, **estático puro**: Next.js 16 App Router com `output: "export"` → `dist/`, publicado no GitHub Pages sob domínio próprio **xibesec.com.br** (`public/CNAME`). Sem servidor, sem ISR, sem rota dinâmica em runtime — tudo resolve no build.

Três documentos governam o projeto e devem ser tratados como código, não como anotação:

- `PRODUCT.md` — o que o evento é, quem decide o quê, léxico obrigatório e a lista do que é **explicitamente indefinido**.
- `DESIGN.md` — tokens, tipografia, componentes e a lista _O que não fazer_.
- este arquivo — como o código se organiza.

Mudou a estrutura? Atualize o documento correspondente no mesmo commit.

### Conteúdo fora do código

Todo o conteúdo mora em `contents/`, fora de `src/`, para que alguém da organização edite um arquivo sem entrar no código. O content layer é **nextjs-studio**:

1. `studio.config.ts` declara o schema de cada coleção, com labels em pt-BR.
2. O CLI gera `.studio/studio.d.ts` a partir desse schema.
3. `src/lib/cms.ts` é a **única porta de entrada**. Nenhum componente importa `queryCollection` direto — todos chamam `getSettings()`, `getAgenda()`, `getPalestrantes()` e afins. É isso que torna a troca do backend de conteúdo um refactor de um arquivo.

`src/lib/content-types.ts` guarda **só** tipos e helpers puros, sem nenhum import de `nextjs-studio/server`, e `cms.ts` faz `export * from "./content-types"`. Sem essa separação, importar um tipo dentro de um `'use client'` arrasta código de servidor e quebra o build.

Formato por natureza do dado:

| Natureza                                          | Formato                                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------ |
| Singleton (`settings`, `sobre`, `ctf`)            | `index.json` com objeto                                                        |
| Lista (`agenda`, `ingressos`, `parceiros`, …)     | `index.json` com array, ou `NN-slug.json` por registro quando a ordem importar |
| Texto longo (`palestrantes`, `codigo-de-conduta`) | `.mdx` com frontmatter                                                         |

### Feature flags de seção

`contents/settings/index.json` tem um bloco `sections` com um booleano por seção. A home faz `{settings.sections.palestrantes && <SecaoPalestrantes />}`. É o que permite publicar a landing com o que já está pronto e ir ligando o resto conforme a organização entrega, **sem tocar em código**. Hoje todas estão `false`.

### Fonte única de URL e SEO

`src/lib/site.ts` concentra nome, tagline, descrição, `siteUrl`, locale, redes e contatos, mais `absoluteUrl(path)` e `pageMetadata({ title, description, path, image })`. Toda página interna monta seu `Metadata` por essa função — é o que impede uma rota nova sair sem canonical. **Nunca** repetir a URL do site em outro arquivo.

`src/lib/schema.tsx` fabrica o JSON-LD: `<SchemaMarkup>` mais `eventSchema`, `organizationSchema`, `websiteSchema`, `generateFaqSchema`, `generateBreadcrumbs`, `generatePersonSchema`. Tudo alimentado por `site.ts` + `contents/`, com `@id` estáveis (`#organization`, `#website`) referenciados pelos schemas de página.

`app/sitemap.ts`, `app/robots.ts` e `app/manifest.ts` usam as convenções nativas do App Router — compatíveis com `output: "export"`, sem `next-sitemap`. Só emitir URL de rota que `generateStaticParams` realmente gera.

## Regras de escrita de código

**Nenhuma copy dentro de `.tsx`.** Texto visível vem de `contents/`. Corrigir uma frase não pode exigir PR de código. Valor calculado no build entra como token `{placeholder}` no JSON e é interpolado no render.

**Indefinido é indefinido.** Campo ausente é `optional`/`nullable` no schema — nunca a string `"A definir"` gravada no dado, que vira copy real por acidente. O componente decide: `<PendingSlot>` para foto que não chegou, `<StatusTag>Em definição</StatusTag>` para grade e palestrante. Isso vale integralmente para número de público das edições anteriores, nomes de palestrantes e detalhes do CTF — ver `PRODUCT.md` → _Explicitamente indefinido_.

**Tailwind 4 CSS-first, sem `tailwind.config`.** Os tokens do `DESIGN.md` vivem em `:root` no `globals.css` e são mapeados em `@theme inline`. O scanner é estático: ``className={`bg-${cor}`}`` não é detectado e a classe some do CSS. Sempre `Record<string, string>` com as classes escritas por extenso.

**Nada de aleatoriedade no render.** `Math.random()` em componente causa mismatch de hidratação. Cor de trilha vem de mapa; destaque vem de `featured: true` no conteúdo.

**Tipos de dado que já deram errado nos projetos de referência:**

- preço em **centavos como `number`**, formatado no render com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` — string `"R$ 80,00"` não soma, não compara e não alimenta `Offer.price`;
- horário como **ISO com offset** (`startsAt`/`endsAt`), não `"10:35 - 11:00"` — string livre não ordena, não calcula duração e não gera `.ics`;
- relação palestrante↔palestra por **`speakerSlug`**, nunca por comparação de nome em lowercase.

**Nada de `as unknown as X`** para reconciliar o tipo gerado com o tipo de domínio. Se não bate, o schema está errado — corrija o schema.

**Tema escuro é intenção de marca, não preferência de sistema.** Sem toggle, sem `next-themes`, sem `darkMode: "class"`, sem bloco `prefers-color-scheme`. A única inversão é `.sec--light`, escopada na seção de patrocínio para receber logo com fundo branco chapado.

**shadcn/ui sob demanda.** No máximo `accordion` (FAQ) e `sheet` (menu mobile), pela acessibilidade de teclado. Botão e card são escritos à mão: o `DESIGN.md` proíbe canto arredondado e `box-shadow` em interface, exatamente o default do shadcn.

**Papéis de cor não se trocam:** laranja é ação e hierarquia de seção; menta é dado, hora e confirmação. A leitura do preço e do horário depende disso.

## Léxico

`PRODUCT.md` → _Percepção a Corrigir_ é normativo. Resumo operacional: a palavra _comunidade_ não pode aparecer como a categoria do evento; usar "encontro de cibersegurança", "edição", "programação", "trilhas", "participantes" e "organizações parceiras". Porte se demonstra com número verificável, nunca com adjetivo.

## Biblioteca de componentes

O Storybook é a bancada: componente novo nasce lá, com story, antes de entrar em qualquer rota. `.storybook/preview.tsx` já aplica as três famílias e o chão de igapó, então a story mostra o componente no ambiente real.

```
src/components/
├── primitives/   Button, Container, Section, SectionHeader (+ Eyebrow, SectionTitle),
│                 Tag, Note, Greca, Reveal, SkipLink, PendingSlot, HighlightPanel, KitBanner
├── cards/        TicketCard, SpeakerCard, CallCard, EditionCard, SponsorSlot,
│                 PartnerChip, LinkButton
├── data/         Countdown, FactStrip, AgendaRow (+ AgendaList), TimelineList,
│                 Terminal, IncludedList
└── layout/       NavBar, Brand, Footer, Dock, BioHeader (+ SocialRow)
```

Regras que valem para todos:

- **Sem copy embutida.** Todo texto visível entra por prop. Os valores nas stories são exemplos de bancada, não conteúdo do site.
- **Estado de pendência é parte do componente**, não um caso à parte: `SpeakerCard` sem `name` declara "A confirmar"; `EditionCard` sem `photo` cai no `PendingSlot`; `PartnerChip` sem `href` renderiza sem link.
- Componente com estado de navegador (`NavBar`, `Dock`, `Countdown`, `Greca`, `Reveal`) leva `"use client"`; o resto é server component.
- `Countdown` usa `useSyncExternalStore` com relógio compartilhado, não `setState` dentro de efeito — a regra `react-hooks/set-state-in-effect` do ESLint 9 barra o segundo, e o snapshot precisa ser estável entre ticks para não re-renderizar em laço.
- `Reveal` escreve a classe direto no nó via ref. Sem JavaScript o conteúdo aparece inteiro, como manda o `DESIGN.md`.

O addon MCP do Storybook está ligado e declarado em `.mcp.json` — o servidor responde em `http://localhost:6006/mcp` **enquanto `yarn storybook` estiver rodando**.

## Pendências

O repositório está em fase de estrutura. Ainda **não existem**:

- `src/lib/` — falta `site.ts`, `cms.ts`, `content-types.ts`, `schema.tsx`, `event.ts` (já há `fonts.ts` e `utils.ts`);
- scripts `predev`/`prebuild` gerando `.studio/studio.d.ts`, e o script `studio` para abrir o editor;
- as rotas — `page.tsx`, `error.tsx`, `loading.tsx` e `not-found.tsx` seguem como placeholders vazios do scaffold, e nenhuma seção da home foi composta;
- `.github/workflows/` — `deploy.yml` (GitHub Pages) e `ci.yml` (lint + typecheck + build);
- `scripts/validate-content.ts` com Zod;
- os ativos de marca em `public/` — favicon, OG image, logos, mascote e os padrões marajoara. Sem eles, `Greca`, `BioHeader` e `SponsorSlot` renderizam sem imagem.

As coleções em `contents/` existem com o schema declarado e **conteúdo vazio, de propósito**. Não preencher sem pedido explícito.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
