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

### Publicação

O repositório é `xibesec/xibesec.github.io` e o Pages é alimentado por GitHub Actions, não por branch:

- `.github/workflows/deploy.yml` — push na `main` roda lint, typecheck e build, e publica `dist/`. Em Settings → Pages, **Source** precisa estar em _GitHub Actions_.
- `.github/workflows/ci.yml` — as mesmas verificações em pull request, mais `format:check`.

O `basePath` fica **vazio**: o repo é o site raiz da organização e o domínio próprio vem de `public/CNAME`, copiado para `dist/` pelo próprio build. `NEXT_PUBLIC_BASE_PATH` existe só para preview sob subcaminho e não é usado no deploy. O `.nojekyll` também sai de `public/`, e é por isso que o upload do artefato roda com `include-hidden-files: true` — no padrão, a action descarta todo dotfile da raiz.

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

`contents/settings/index.json` tem um bloco `sections` com um booleano por seção. A home faz `{settings.sections.palestrantes && <SecaoPalestrantes />}`. É o que permite publicar a landing com o que já está pronto e ir ligando o resto conforme a organização entrega, **sem tocar em código**. A mesma chave governa o JSON-LD e o espelho em Markdown: seção desligada não vira `subEvent` no schema nem arquivo em `/docs/`.

### Fonte única de URL e SEO

`src/lib/site.ts` concentra nome, tagline, descrição, `siteUrl`, locale, redes e contatos, mais `absoluteUrl(path)` e `pageMetadata({ title, description, path, image })`. Toda página interna monta seu `Metadata` por essa função — é o que impede uma rota nova sair sem canonical. **Nunca** repetir a URL do site em outro arquivo.

`src/lib/links.ts` resolve a pergunta seguinte: **para onde o botão aponta quando a seção que ele buscava não está publicada**. `externo(href)` monta o par `target="_blank"` + `rel="noopener"` — o `Button` lê o `target` e acrescenta sozinho a seta de "sai do site". `alvoCompra(settings)` devolve a âncora `#ingressos` enquanto a seção estiver ligada e cai no `ticketsUrl` quando não estiver. `ancoraViva(href, sections)` diz se uma âncora existe na página: o conteúdo em `contents/` não sabe o que foi ao ar, e é assim que a nota de uma seção deixa de linkar para outra que não foi publicada. Duas regras: **o rótulo manda no destino** — botão que diz "comprar" vai ao Sympla, botão que convida a participar rola até a tabela de preços; e **nenhuma âncora literal `#secao` fora desse arquivo** em CTA que uma feature flag possa desligar.

`src/lib/schema.tsx` fabrica o JSON-LD: `<SchemaMarkup>` mais `eventSchema`, `organizationSchema`, `websiteSchema`, `generateFaqSchema`, `generateBreadcrumbs`, `generatePersonSchema`. Tudo alimentado por `site.ts` + `contents/`, com `@id` estáveis (`#organization`, `#website`) referenciados pelos schemas de página.

`app/sitemap.ts` e `app/robots.ts` usam as convenções nativas do App Router — compatíveis com `output: "export"`, sem `next-sitemap`, e ambos precisam de `export const dynamic = "force-static"` (sem isso o build do export falha). Só emitir URL de rota que `generateStaticParams` realmente gera. O sitemap usa `canonicalUrl()`, que aplica a barra final imposta pelo `trailingSlash` — sem ela o sitemap aponta para um endereço que o canonical não confirma.

`robots.ts` libera nominalmente os rastreadores de assistentes de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended e afins). Não é decoração: esses bots leem o bloco do próprio user-agent antes do `*`, e bot bloqueado não cita o evento.

### Espelho em Markdown e `llms.txt`

O HTML é para gente; `src/lib/docs.ts` gera a **mesma informação em Markdown**, para assistentes de IA e agentes. Route Handlers com `export const dynamic = "force-static"` escrevem os arquivos no build — `app/llms.txt/route.ts` vira `dist/llms.txt`, `app/docs/[doc]/route.ts` vira `dist/docs/<slug>.md`. O `trailingSlash` não interfere no nome.

| Arquivo            | O que é                                              |
| ------------------ | ---------------------------------------------------- |
| `/llms.txt`        | Índice curto no formato de llmstxt.org               |
| `/llms-full.txt`   | Todo o conteúdo publicado em um arquivo              |
| `/index.md`        | Espelho da home                                      |
| `/docs/agents.md`  | Respostas canônicas e a lista do que **não** afirmar |
| `/docs/<seção>.md` | Um documento por seção publicada                     |

Três regras governam isso:

1. **Não é conteúdo paralelo.** Tudo sai de `contents/` pela fachada de `cms.ts`. Escrever texto novo direto no `docs.ts` recria o problema que `contents/` existe para evitar.
2. **Documento só existe enquanto a seção estiver ligada** em `settings.sections`. Publicar em Markdown o que a página não mostra cria uma segunda verdade — e `llms.txt` lê a mesma lista, então nunca aponta para arquivo que o build não gerou.
3. **O indefinido é declarado**, não omitido: `/docs/agents.md` traz a lista do que a organização ainda não publicou. É o que faz um assistente responder "ainda não foi anunciado" em vez de estimar.

`pageMetadata()` deriva o alternate sozinho — `/` → `/index.md` — e emite `<link rel="alternate" type="text/markdown">`. Rota nova nasce com espelho anunciado; passar `markdown: null` desliga quando a rota não tiver um.

### O quiz em `/quiz`

Sete perguntas, um arquétipo no fim e uma carta em imagem (1080×1920) para compartilhar. Roda inteira no navegador: nome e foto **não saem do aparelho**, e não há coleta de resposta. A rota existe sempre — o que a esconde do menu é `noMenu: true` em `contents/navegacao`.

Quatro decisões que não se desfazem sem quebrar algo:

- **A carta é DOM fotografado por `html-to-image`, não `canvas`.** O recorte sem borda são três máscaras em gradiente aninhadas, e `ctx.drawImage()` não aplica máscara. Aninhadas porque `mask-composite` diverge entre navegadores.
- **`cacheBust: false` na exportação.** Ligado, concatena `?<timestamp>` na URL de cada imagem — e `blob:` com query string não existe. O sintoma engana: baixar funciona com o mascote e só quebra depois que a pessoa envia a foto.
- **Os assets da carta são data URI** (`carta-assets.ts`), gerados de `public/images/`. Recurso por URL externa sai em branco no arquivo exportado. Regerar quando a marca mudar.
- **`onnxruntime-web` fixado em `1.21.0`**, a peer dependency exata de `@imgly/background-removal`. Com a `1.27` o recorte falha em runtime, e o erro só aparece depois de baixar ~91 MB.

**O recorte de fundo é opcional por construção.** São ~127 MB de um CDN externo, e o WASM leva o `dist/` de ~15 MB para ~175 MB — nada disso no bundle inicial, que segue em 48 KB. O download começa na abertura da página e **não começa** em conexão econômica ou 2g/3g. Falhando, a carta funciona com as máscaras em gradiente.

O WebKit não exporta a imagem, e a interface pede para abrir no Chrome. Detectado por motor, não por nome: todo navegador no iOS é WebKit, inclusive o Chrome de iPhone.

## Git

**Nunca trocar de branch sem pedido explícito.** `git checkout`, `git switch` e qualquer coisa que mova o `HEAD` só acontecem quando a pessoa pede, com essas palavras. Trocar de branch por conta própria — para "organizar", para deixar o trabalho no lugar certo, para o commit sair da branch que parece a correta — muda o chão embaixo de quem está trabalhando: o editor recarrega, o servidor de dev perde o `dist/`, e mudança não commitada vai junto para uma branch que não era a esperada.

O trabalho é feito **na branch em que a sessão está**, seja ela qual for. Parecendo errada, diga isso e pergunte; não corrija sozinho.

Para levar commit de uma branch a outra sem sair da atual, `git fetch . origem:destino` faz o fast-forward sem mexer no `HEAD` nem no working tree. É a ferramenta certa quando o pedido é "puxar para a main" e há trabalho sujo em cima da mesa.

Vale também para o resto do que é irreversível ou compartilhado: sem `push`, sem `reset --hard`, sem reescrever histórico já publicado, sem apagar branch — a não ser que peçam.

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

**Comentário é exceção, não hábito.** O código diz _o que_ faz; comentário só entra quando há um _porquê_ que o código não consegue dizer — uma armadilha do navegador, uma ordem que parece arbitrária mas não é, uma decisão contra-intuitiva que alguém desfaria por engano. Comentário que parafraseia a linha seguinte é ruído: ele envelhece, mente e some na revisão.

Não comentar: o óbvio (`// estado do carrossel`), a narração do diff (`// agora com três modos`), nem cada campo de um tipo que o nome já explica. Preferir nome melhor a comentário explicativo, e uma frase seca a um parágrafo literário — o JSDoc de um componente diz para que ele serve em duas ou três linhas, não conta a história de como chegou ali. Na dúvida, apagar: o que sobrevive é o que ninguém deduziria lendo o código.

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

A home está composta e o build publica; ainda **não existem**:

- `src/lib/event.ts` — geração do `.ics` a partir de `contents/settings`;
- `app/manifest.ts`;
- `error.tsx`, `loading.tsx` e `not-found.tsx` seguem como placeholders vazios do scaffold — o `not-found` não tem nem navegação nem link de volta;
- script `predev` gerando `.studio/studio.d.ts` (o `prebuild` já existe);
- `scripts/validate-content.ts` com Zod;
- `app/palestrantes/[slug]` e `app/programacao/[slug]` — as páginas de detalhe. Enquanto não existirem, `SpeakerCard` e `AgendaRow` são renderizados **sem `href`** na home: card que leva a 404 é pior que card sem link. `BioHeader` já está pronto na bancada esperando a rota. Criando as páginas, devolver o `href` nas duas seções e conferir sitemap e espelho em Markdown;
- fotos das edições anteriores, logos das organizações parceiras e da imprensa: os diretórios em `public/images/` existem vazios, e por isso `EditionCard` e `PartnerChip` caem no estado de pendência.

As coleções em `contents/` existem com o schema declarado e **conteúdo vazio, de propósito**. Não preencher sem pedido explícito.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
