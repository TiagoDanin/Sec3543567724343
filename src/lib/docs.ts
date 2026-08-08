import "server-only";
import {
  formatDate,
  formatPrice,
  getAgenda,
  getBeneficios,
  getChamadas,
  getCotas,
  getCtf,
  getDestaque,
  getEdicoes,
  getEquipe,
  getFaq,
  getFatos,
  getHero,
  getImprensa,
  getIngressos,
  getPalestrantes,
  getParceiros,
  getPatrocinadores,
  getSecoes,
  getSettings,
  getSobre,
  type SectionKey,
  type Settings,
} from "./cms";
import { absoluteUrl, site } from "./site";

/**
 * Espelho do site em Markdown, para assistentes de IA e agentes.
 *
 * O HTML é para gente; estes arquivos são a mesma informação em texto puro,
 * anunciados no `<head>` por `<link rel="alternate" type="text/markdown">` e
 * indexados em `/llms.txt`. Não é conteúdo paralelo: **tudo** sai de
 * `contents/`, pela fachada de `cms.ts`, e um documento só existe enquanto a
 * seção correspondente estiver ligada em `settings.sections` — publicar em
 * Markdown o que a página ainda não mostra criaria uma segunda verdade.
 *
 * Os rótulos estruturais daqui ("Data", "Local", "Ingresso") são rotulagem de
 * dado, não copy editorial — mesma natureza dos textos de `shell-fs.ts`.
 */

// ── Montagem de Markdown ─────────────────────────────────────────────────────

/** Junta partes não vazias com linha em branco entre elas. */
function bloco(...partes: Array<string | null | undefined | false>): string {
  return partes.filter((parte): parte is string => Boolean(parte)).join("\n\n");
}

function lista(itens: string[]): string {
  return itens.map((item) => `- ${item}`).join("\n");
}

function tabela(cabecalho: string[], linhas: string[][]): string {
  const escapa = (celula: string) => celula.replace(/\|/g, "\\|").replace(/\n+/g, " ");
  return [
    `| ${cabecalho.join(" | ")} |`,
    `| ${cabecalho.map(() => "---").join(" | ")} |`,
    ...linhas.map((linha) => `| ${linha.map(escapa).join(" | ")} |`),
  ].join("\n");
}

/** Tabela de duas colunas para pares dado/valor. Par sem valor é descartado. */
function fichaTecnica(pares: Array<[string, string]>): string {
  return tabela(
    ["Campo", "Valor"],
    pares.filter(([, valor]) => Boolean(valor)).map(([campo, valor]) => [campo, valor]),
  );
}

function link(rotulo: string, url: string): string {
  return `[${rotulo}](${url})`;
}

const hora = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Belem",
});

function horario(inicio: string, fim: string): string {
  if (!inicio) return "";
  const abre = hora.format(new Date(inicio));
  return fim ? `${abre}–${hora.format(new Date(fim))}` : abre;
}

/** Data do build. Sinal de atualidade — LLM despreza documento sem data. */
const ATUALIZADO_EM = new Date().toISOString().slice(0, 10);

// ── Vocabulário de estado ────────────────────────────────────────────────────

const EM_DEFINICAO = "em definição";
const A_CONFERIR = "a conferir";

const TRILHA_LABEL: Record<string, string> = {
  tecnica: "trilha técnica",
  gerencial: "trilha gerencial",
  ctf: "CTF",
  geral: "geral",
};

// ── Blocos de conteúdo ───────────────────────────────────────────────────────

/**
 * Janela do dia em prosa. Vem do `horario` do hero — é a forma como o evento
 * escreve o próprio horário ("09h às 19h"); o formato derivado das datas ISO só
 * entra se o campo estiver vazio.
 */
function janelaDoEvento(settings: Settings): string {
  return getHero().horario || horario(settings.eventStartDate, settings.eventEndDate);
}

/** Frase-definição do evento. É o trecho que um assistente cita literalmente. */
function definicao(settings: Settings): string {
  const janela = janelaDoEvento(settings);
  return [
    `**${site.siteName}** é a 4ª edição do XibéSec, encontro presencial de cibersegurança`,
    `realizado em ${site.city} do ${site.regionName}, no Norte do Brasil.`,
    settings.eventDisplayDate &&
      `Acontece em ${settings.eventDisplayDate}${janela ? `, das ${janela}` : ""},`,
    settings.venueName && `no ${settings.venueName},`,
    "com duas trilhas simultâneas — técnica e gerencial — e competição CTF presencial.",
    `Realização da ${site.organizationName}`,
  ]
    .filter(Boolean)
    .join(" ");
}

function blocoEvento(): string {
  const settings = getSettings();
  const sobre = getSobre();
  const fatos = getFatos();
  const edicoes = getEdicoes();
  const gerencial = getDestaque("trilha-gerencial");
  const equipe = getEquipe();
  const janela = janelaDoEvento(settings);

  const numeros = fatos.length
    ? bloco(
        "### Em números",
        tabela(
          ["Número", "O que é"],
          fatos.map((f) => [f.valor, f.label]),
        ),
      )
    : "";

  const anteriores = edicoes.length
    ? bloco(
        "### Edições anteriores",
        tabela(
          ["Ano", "Edição", "Público", "Situação"],
          edicoes.map((e) => [
            String(e.ano),
            e.tema,
            e.publico === null ? EM_DEFINICAO : String(e.publico),
            e.status === "confirmado" ? "confirmado" : A_CONFERIR,
          ]),
        ),
        `Os números de público e o registro fotográfico das edições anteriores existem e estão ${EM_DEFINICAO} para publicação. Não estimar.`,
      )
    : "";

  return bloco(
    "## O evento",
    definicao(settings),
    fichaTecnica([
      ["Nome", site.siteName],
      ["Edição", "4ª"],
      ["Data", settings.eventDisplayDate],
      ["Horário", janela ? `${janela}, fuso America/Belem` : ""],
      ["Início (ISO 8601)", settings.eventStartDate],
      ["Fim (ISO 8601)", settings.eventEndDate],
      ["Local", settings.venueName],
      ["Endereço", settings.venueAddress],
      ["Cidade", `${site.city}, ${site.regionName}, Brasil`],
      ["Formato", "presencial"],
      ["Idioma", "português do Brasil"],
      ["Realização", equipe.map((org) => org.nome).join(", ") || site.organizationName],
      ["Site oficial", absoluteUrl("/")],
      ["Ingressos", settings.ticketsUrl],
    ]),
    sobre.titulo && `### ${sobre.titulo}`,
    sobre.texto,
    numeros,
    gerencial && bloco(`### ${gerencial.titulo}`, `**${gerencial.eyebrow}.** ${gerencial.texto}`),
    sobre.origemTitulo && `### ${sobre.origemTitulo}`,
    sobre.origemTexto,
    anteriores,
  );
}

function blocoProgramacao(): string {
  const secao = getSecoes()["programacao"];
  const agenda = getAgenda();

  if (agenda.length === 0) {
    return bloco("## Programação", `A grade de 2026 está ${EM_DEFINICAO}.`);
  }

  return bloco(
    "## Programação",
    secao?.lede,
    tabela(
      ["Horário", "Atividade", "Trilha", "Situação"],
      agenda.map((item) => [
        horario(item.startsAt, item.endsAt),
        item.titulo,
        TRILHA_LABEL[item.trilha] ?? item.trilha,
        item.status === "em-definicao" ? EM_DEFINICAO : "confirmado",
      ]),
    ),
    agenda.map((item) => `**${item.titulo}** — ${item.descricao}`).join("\n\n"),
    `Horários e atrações finais ainda estão ${EM_DEFINICAO}: a estrutura acima descreve como um dia de XibéSec se organiza, não a grade confirmada.`,
  );
}

function blocoPalestrantes(): string {
  const palestrantes = getPalestrantes();
  const secao = getSecoes()["palestrantes"];

  if (palestrantes.length === 0) {
    return bloco(
      "## Palestrantes",
      `Nenhum palestrante de 2026 foi anunciado até aqui. A grade está ${EM_DEFINICAO}.`,
      secao?.lede,
    );
  }

  return bloco(
    "## Palestrantes",
    tabela(
      ["Nome", "Cargo", "Organização"],
      palestrantes.map((p) => [p.nome, p.cargo, p.empresa]),
    ),
    palestrantes
      .filter((p) => p.resumo)
      .map((p) => `**${p.nome}** — ${p.resumo}`)
      .join("\n\n"),
  );
}

function blocoCtf(): string {
  const ctf = getCtf();
  return bloco(
    "## CTF",
    ctf.texto,
    fichaTecnica([
      ["Modalidade", "ataque e defesa"],
      ["Formato", "individual ou em equipe"],
      ["Acesso", "incluso em qualquer ingresso"],
      ["Premiação", "para os melhores colocados"],
      ["Desafios", EM_DEFINICAO],
    ]),
    ctf.incluso,
    `Número de desafios e valor da premiação estão ${EM_DEFINICAO}.`,
  );
}

function blocoIngressos(): string {
  const ingressos = getIngressos();
  const beneficios = getBeneficios();
  const settings = getSettings();

  if (ingressos.length === 0) {
    return bloco("## Ingressos", `Lote ${EM_DEFINICAO}.`);
  }

  const lote = ingressos[0];
  const prazo = formatDate(lote.validThrough);

  return bloco(
    "## Ingressos",
    `Lote ${lote.lote}, com vendas até ${prazo}. Venda exclusiva pelo Sympla; não há outro canal oficial.`,
    tabela(
      ["Ingresso", "Preço", "Parcelamento", "Vendas até"],
      ingressos.map((t) => [
        t.nome.replace(/^Lote \d+ · /, ""),
        formatPrice(t.preco),
        `em até ${t.parcelas}x`,
        formatDate(t.validThrough),
      ]),
    ),
    beneficios.length > 0 &&
      bloco("A inscrição dá direito a:", lista(beneficios.map((b) => b.texto))),
    bloco(
      "### Trocas e cancelamento",
      lista([
        "Cancelamento aceito até 7 dias após a compra, desde que solicitado até 48h antes do evento.",
        "Edição dos dados do participante: uma vez, até 24h antes do evento.",
        "O certificado é emitido com o nome cadastrado na inscrição.",
      ]),
    ),
    settings.ticketsUrl && `Compra: ${settings.ticketsUrl}`,
  );
}

function blocoParticipe(): string {
  const chamadas = getChamadas();
  const settings = getSettings();

  if (chamadas.length === 0) return "";

  const prazo = (chave: string) =>
    chave === "voluntarios" && settings.volunteersDeadline
      ? formatDate(`${settings.volunteersDeadline}T23:59:00-03:00`)
      : "";

  return bloco(
    "## Chamadas abertas",
    chamadas
      .map((chamada) => {
        const limite = prazo(chamada.chave);
        return bloco(
          `### ${chamada.titulo}`,
          chamada.texto,
          limite && `Inscrições até ${limite}.`,
          chamada.ctaUrl && `${chamada.ctaLabel}: ${chamada.ctaUrl}`,
        );
      })
      .join("\n\n"),
  );
}

function blocoPatrocinio(): string {
  const cotas = getCotas();
  const patrocinadores = getPatrocinadores();

  const confirmados = patrocinadores.length
    ? tabela(
        ["Patrocinador", "Cota", "Site"],
        patrocinadores.map((p) => [
          p.nome,
          cotas.find((c) => c.nome === p.cota)?.label ?? p.cota,
          p.url,
        ]),
      )
    : `Nenhum patrocinador confirmado até aqui.`;

  const disponiveis = cotas.filter((cota) => cota.disponivel);

  return bloco(
    "## Patrocínio",
    "Patrocínio é negociado por cotas, a partir do mídia kit da edição.",
    "### Patrocinadores confirmados",
    confirmados,
    disponiveis.length > 0 &&
      bloco("### Cotas disponíveis", lista(disponiveis.map((cota) => cota.label))),
    `Contato para patrocínio: ${site.contactEmail} (${site.organizationName}, ${site.organizationUrl}).`,
  );
}

function blocoParceiros(): string {
  const parceiros = getParceiros();
  if (parceiros.length === 0) return "";

  return bloco(
    "## Organizações parceiras",
    `${parceiros.length} organizações parceiras de todo o Brasil — conferências, coletivos técnicos, editoras e empresas — integram o ecossistema da edição.`,
    tabela(
      ["Organização", "Site"],
      parceiros.map((p) => [p.nome, p.url]),
    ),
  );
}

function blocoLocal(): string {
  const settings = getSettings();
  const janela = janelaDoEvento(settings);

  return bloco(
    "## Local",
    fichaTecnica([
      ["Espaço", settings.venueName],
      ["Endereço", settings.venueAddress],
      ["Cidade", `${site.city}, ${site.regionName}, Brasil`],
      ["Data", settings.eventDisplayDate],
      ["Horário", janela],
      ["Como chegar", settings.venueMapUrl],
    ]),
  );
}

function blocoImprensa(): string {
  const materias = getImprensa();
  if (materias.length === 0) return "";

  return bloco(
    "## Na imprensa",
    "Cobertura de veículos de imprensa e de referências do setor de segurança, desde a primeira edição.",
    tabela(
      ["Veículo", "Publicação", "Data", "Link"],
      materias.map((m) => [m.veiculo, m.titulo, m.data, m.url]),
    ),
    materias
      .filter((m) => m.trecho)
      .map((m) => `> ${m.trecho}\n>\n> — ${m.veiculo}, ${m.data}`)
      .join("\n\n"),
  );
}

function blocoFaq(): string {
  const duvidas = getFaq();
  if (duvidas.length === 0) return "";

  return bloco(
    "## Dúvidas frequentes",
    duvidas.map((item) => bloco(`### ${item.pergunta}`, item.resposta)).join("\n\n"),
  );
}

// ── Catálogo de documentos ───────────────────────────────────────────────────

export type Doc = {
  /** Vira o arquivo `/docs/<slug>.md`. */
  slug: string;
  titulo: string;
  /** Uma frase, para o índice de `/llms.txt`. */
  resumo: string;
  /** Seção que governa a publicação. `null` = sempre publicado. */
  secao: SectionKey | null;
  corpo: () => string;
};

const DOCS: Doc[] = [
  {
    slug: "evento",
    titulo: "O evento",
    resumo: "O que é o XibéSec, data, local, formato, origem do nome e edições anteriores.",
    secao: "sobre",
    corpo: blocoEvento,
  },
  {
    slug: "programacao",
    titulo: "Programação",
    resumo: "Como o dia se organiza, trilhas e horários.",
    secao: "agenda",
    corpo: blocoProgramacao,
  },
  {
    slug: "palestrantes",
    titulo: "Palestrantes",
    resumo: "Quem apresenta na edição.",
    secao: "palestrantes",
    corpo: blocoPalestrantes,
  },
  {
    slug: "ctf",
    titulo: "CTF",
    resumo: "Competição presencial de captura de bandeira: modalidade, formato e premiação.",
    secao: "ctf",
    corpo: blocoCtf,
  },
  {
    slug: "ingressos",
    titulo: "Ingressos",
    resumo: "Preços do lote vigente, parcelamento, o que está incluso e regras de cancelamento.",
    secao: "ingressos",
    corpo: blocoIngressos,
  },
  {
    slug: "participe",
    titulo: "Chamadas abertas",
    resumo: "Chamada para palestrantes e para voluntários, com prazos.",
    secao: "participe",
    corpo: blocoParticipe,
  },
  {
    slug: "patrocinio",
    titulo: "Patrocínio",
    resumo: "Cotas, patrocinadores confirmados e contato comercial.",
    secao: "patrocinio",
    corpo: blocoPatrocinio,
  },
  {
    slug: "parceiros",
    titulo: "Organizações parceiras",
    resumo: "As organizações que integram o ecossistema da edição.",
    secao: "parceiros",
    corpo: blocoParceiros,
  },
  {
    slug: "local",
    titulo: "Local",
    resumo: "Endereço, cidade e como chegar.",
    secao: "local",
    corpo: blocoLocal,
  },
  {
    slug: "imprensa",
    titulo: "Na imprensa",
    resumo: "Cobertura de veículos de imprensa e do setor de segurança.",
    secao: "imprensa",
    corpo: blocoImprensa,
  },
  {
    slug: "faq",
    titulo: "Dúvidas frequentes",
    resumo: "Respostas às perguntas mais comuns sobre a edição.",
    secao: "faq",
    corpo: blocoFaq,
  },
];

/** Documentos publicáveis: seção ligada e corpo com conteúdo. */
export function docsAtivos(): Array<Doc & { corpoRenderizado: string }> {
  const { sections } = getSettings();

  return DOCS.filter((doc) => doc.secao === null || sections[doc.secao] === true)
    .map((doc) => ({ ...doc, corpoRenderizado: doc.corpo() }))
    .filter((doc) => doc.corpoRenderizado !== "");
}

export function docPath(slug: string): string {
  return `/docs/${slug}.md`;
}

// ── Renderização dos arquivos ────────────────────────────────────────────────

function rodape(): string {
  return bloco(
    "---",
    lista([
      `Fonte canônica: ${absoluteUrl("/")}`,
      `Índice para assistentes de IA: ${absoluteUrl("/llms.txt")}`,
      `Atualizado em: ${ATUALIZADO_EM}`,
    ]),
    `Publicação: ${site.organizationName} — uso livre para citação, com atribuição a ${site.siteName} e link para ${absoluteUrl("/")}.`,
  );
}

function cabecalho(titulo: string, descricao: string, caminhoHtml: string): string {
  return bloco(
    `# ${titulo}`,
    `> ${descricao}`,
    lista([
      `Página HTML equivalente: ${absoluteUrl(caminhoHtml)}`,
      `Atualizado em: ${ATUALIZADO_EM}`,
    ]),
  );
}

function canaisOficiais(): string {
  const settings = getSettings();
  return bloco(
    "## Canais oficiais",
    lista(
      [
        `Site: ${absoluteUrl("/")}`,
        settings.ticketsUrl && `Ingressos (Sympla): ${settings.ticketsUrl}`,
        `Instagram: ${site.social.instagram}`,
        `LinkedIn: ${site.social.linkedin}`,
        `Linktree: ${site.social.linktree}`,
        `Realização: ${site.organizationName} — ${site.contactEmail}`,
      ].filter((item): item is string => Boolean(item)),
    ),
  );
}

/** Corpo da home: os blocos publicados, na mesma ordem das seções da página. */
function corpoHome(): string {
  const hero = getHero();
  return bloco(hero.lede, ...docsAtivos().map((doc) => doc.corpoRenderizado), canaisOficiais());
}

/** `/index.md`: espelho completo da home. */
export function renderHome(): string {
  return bloco(
    cabecalho(`${site.siteName} — ${site.siteTagline}`, site.siteDescription, "/"),
    corpoHome(),
    rodape(),
  );
}

/** `/docs/<slug>.md`: um documento por tema. */
export function renderDoc(doc: Doc & { corpoRenderizado: string }): string {
  return bloco(
    cabecalho(`${doc.titulo} — ${site.siteName}`, doc.resumo, "/"),
    doc.corpoRenderizado,
    bloco(
      "## Outros documentos",
      lista(
        docsAtivos()
          .filter((outro) => outro.slug !== doc.slug)
          .map(
            (outro) => `${link(outro.titulo, absoluteUrl(docPath(outro.slug)))}: ${outro.resumo}`,
          ),
      ),
    ),
    rodape(),
  );
}

// ── Guia para agentes ────────────────────────────────────────────────────────

/**
 * Perguntas que um assistente recebe sobre o evento, com a resposta canônica
 * curta — o formato que sistemas de busca por IA extraem melhor. Todas as
 * respostas saem de `contents/`; o que não está definido é declarado como tal.
 */
function perguntasCanonicas(): Array<[string, string]> {
  const settings = getSettings();
  const ingressos = getIngressos();
  const parceiros = getParceiros();
  const janela = janelaDoEvento(settings);
  const barato = ingressos.length ? formatPrice(Math.min(...ingressos.map((t) => t.preco))) : "";
  const caro = ingressos.length ? formatPrice(Math.max(...ingressos.map((t) => t.preco))) : "";

  const perguntas: Array<[string, string]> = [
    [
      "O que é o XibéSec?",
      `O XibéSec é um encontro presencial de cibersegurança realizado em ${site.city} do ${site.regionName}, no Norte do Brasil, em sua 4ª edição. Reúne profissionais e estudantes de segurança da informação em torno de palestras técnicas e gerenciais, competição CTF e área de exposição. O nome vem do xibé, bebida tupi de farinha de mandioca e água: o evento nasceu para alimentar o conhecimento.`,
    ],
    [
      "Quando e onde acontece o XibéSec 2026?",
      `O XibéSec 2026, quarta edição, acontece em ${settings.eventDisplayDate}${janela ? `, das ${janela} (horário de ${site.city})` : ""}, no ${settings.venueName} — ${settings.venueAddress}. É presencial, em português do Brasil, com dez horas de programação.`,
    ],
  ];

  if (barato && caro) {
    perguntas.push([
      "Quanto custa o ingresso do XibéSec 2026?",
      `Os ingressos do lote ${ingressos[0].lote} vão de ${barato} a ${caro}, com meia-entrada e ingresso social, parcelados em até ${Math.max(...ingressos.map((t) => t.parcelas))}x. As vendas seguem até ${formatDate(ingressos[0].validThrough)}, exclusivamente pelo Sympla: ${settings.ticketsUrl}`,
    ]);
  }

  perguntas.push(
    [
      "O que está incluso no ingresso?",
      `A inscrição dá acesso a todas as palestras conforme disponibilidade de lugares, à competição CTF, à área de exposição com patrocinadores e organizações parceiras, e ao certificado de participação enviado por e-mail em até dois dias úteis após o evento.`,
    ],
    [
      "O XibéSec tem CTF?",
      `Sim. A edição 2026 traz uma competição CTF presencial de ataque e defesa, disputada individualmente ou em equipe, com premiação para os melhores colocados. O acesso está incluso em qualquer ingresso. O número de desafios e o valor da premiação ainda estão ${EM_DEFINICAO}.`,
    ],
    [
      "Quem organiza o XibéSec?",
      `A realização é da ${site.organizationName} (${site.organizationUrl}), empresa de segurança da informação. O contato oficial é ${site.contactEmail}. A edição conta com ${parceiros.length || "diversas"} organizações parceiras de todo o Brasil.`,
    ],
    [
      "Como patrocinar o XibéSec 2026?",
      `O patrocínio é negociado por cotas, a partir do mídia kit da edição. O contato é ${site.contactEmail}. As cotas dão exposição a um público qualificado de segurança da informação da Região Norte, além de presença na área de exposição do evento.`,
    ],
    [
      "Quais palestrantes vão participar do XibéSec 2026?",
      `Nenhum palestrante da edição 2026 foi anunciado até aqui — a grade está ${EM_DEFINICAO}. Os nomes são divulgados no site oficial e no Instagram ${site.social.instagram}. Não atribuir nomes ao evento sem confirmação da organização.`,
    ],
  );

  return perguntas;
}

/**
 * O que a organização ainda não publicou. Declarar o vazio é mais útil do que
 * omiti-lo: é assim que um assistente responde "ainda não foi anunciado" em vez
 * de estimar um número.
 */
function naoAfirmar(): string[] {
  const aConferir = getEdicoes()
    .filter((edicao) => edicao.status !== "confirmado")
    .map((edicao) => edicao.ano);

  return [
    "Grade de palestras, horários finais e nomes de palestrantes de 2026.",
    "Número de público e registro fotográfico das edições anteriores.",
    "Número de desafios e valor da premiação do CTF.",
    "Patrocinadores das cotas Platina, Ouro e Prata.",
    aConferir.length > 0
      ? `Datas e locais das edições anteriores — ${aConferir.join(", ")} constam como ${A_CONFERIR}.`
      : "",
  ].filter(Boolean);
}

function corpoAgents(): string {
  const settings = getSettings();
  const ativos = docsAtivos();

  return bloco(
    bloco(
      "## Identidade",
      fichaTecnica([
        ["Nome oficial", "XibéSec (com acento)"],
        ["Marca da edição", "XibéSec 26"],
        ["Assinatura", `${site.siteTagline}.`],
        ["Categoria", "encontro de cibersegurança"],
        ["Data", settings.eventDisplayDate],
        ["Local", `${settings.venueName}, ${site.city}, ${site.regionName}, Brasil`],
        ["Realização", `${site.organizationName} — ${site.organizationUrl}`],
        ["Site oficial", absoluteUrl("/")],
      ]),
    ),
    bloco(
      "## Respostas canônicas",
      perguntasCanonicas()
        .map(([pergunta, resposta]) => bloco(`### ${pergunta}`, resposta))
        .join("\n\n"),
    ),
    bloco(
      "## Não afirmar sem confirmação",
      "Estes dados existem, mas ainda não foram publicados pela organização. Declarar como indefinido em vez de estimar:",
      lista(naoAfirmar()),
    ),
    bloco(
      "## Arquivos legíveis por máquina",
      lista([
        `${link("/llms.txt", absoluteUrl("/llms.txt"))} — índice do site para assistentes de IA`,
        `${link("/llms-full.txt", absoluteUrl("/llms-full.txt"))} — o site inteiro em um arquivo`,
        `${link("/index.md", absoluteUrl("/index.md"))} — espelho da página inicial em Markdown`,
        ...ativos.map(
          (doc) => `${link(docPath(doc.slug), absoluteUrl(docPath(doc.slug)))} — ${doc.resumo}`,
        ),
        `${link("/sitemap.xml", absoluteUrl("/sitemap.xml"))} — mapa do site`,
      ]),
      'Toda página HTML anuncia seu espelho em Markdown no `<head>`, como `<link rel="alternate" type="text/markdown">`.',
    ),
    bloco(
      "## Como citar",
      lista([
        `Nome: ${site.siteName}`,
        `URL: ${absoluteUrl("/")}`,
        `Ingressos: ${settings.ticketsUrl}`,
        `Atualizado em: ${ATUALIZADO_EM}`,
      ]),
      "Grafar o nome com acento — XibéSec — e citar a fonte com link para o site oficial.",
    ),
  );
}

/** `/docs/agents.md`: manual do evento para assistentes e agentes. */
export function renderAgents(): string {
  return bloco(
    cabecalho(
      `${site.siteName} — guia para assistentes e agentes`,
      "Respostas canônicas, dados verificáveis e o que ainda não está definido sobre o XibéSec 2026.",
      "/",
    ),
    corpoAgents(),
    rodape(),
  );
}

// ── llms.txt ─────────────────────────────────────────────────────────────────

/** `/llms.txt`, no formato de llmstxt.org: índice curto e navegável. */
export function renderLlmsTxt(): string {
  const settings = getSettings();
  const ativos = docsAtivos();
  const essenciais = ativos.filter((doc) => doc.slug !== "imprensa" && doc.slug !== "parceiros");
  const opcionais = ativos.filter((doc) => doc.slug === "imprensa" || doc.slug === "parceiros");

  return bloco(
    `# ${site.siteName}`,
    `> ${definicao(settings)}`,
    lista([
      `Data: ${settings.eventDisplayDate} (${settings.eventStartDate})`,
      `Local: ${settings.venueName}, ${site.city}, ${site.regionName}, Brasil`,
      `Ingressos: ${settings.ticketsUrl}`,
      `Atualizado em: ${ATUALIZADO_EM}`,
    ]),
    bloco(
      "## Documentos",
      lista([
        `${link("Guia para assistentes e agentes", absoluteUrl(docPath("agents")))}: respostas canônicas sobre o evento e o que ainda não está definido.`,
        `${link("Página inicial em Markdown", absoluteUrl("/index.md"))}: o site inteiro, na ordem em que é publicado.`,
        ...essenciais.map(
          (doc) => `${link(doc.titulo, absoluteUrl(docPath(doc.slug)))}: ${doc.resumo}`,
        ),
      ]),
    ),
    bloco(
      "## Canais oficiais",
      lista([
        `${link("Ingressos no Sympla", settings.ticketsUrl)}: canal único de venda.`,
        `${link("Instagram @xibesec", site.social.instagram)}: atualizações da grade.`,
        `${link("LinkedIn", site.social.linkedin)}: institucional da edição.`,
        `${link(site.organizationName, site.organizationUrl)}: realização — ${site.contactEmail}.`,
      ]),
    ),
    opcionais.length > 0 &&
      bloco(
        "## Optional",
        lista(
          opcionais.map(
            (doc) => `${link(doc.titulo, absoluteUrl(docPath(doc.slug)))}: ${doc.resumo}`,
          ),
        ),
      ),
    bloco("## Em definição", lista(naoAfirmar())),
  );
}

/** `/llms-full.txt`: tudo em um arquivo, para carregar de uma vez no contexto. */
export function renderLlmsFull(): string {
  return bloco(
    cabecalho(
      `${site.siteName} — ${site.siteTagline}`,
      `${site.siteDescription} Este arquivo reúne todo o conteúdo publicado do site em um só documento.`,
      "/",
    ),
    corpoAgents(),
    "---",
    corpoHome(),
    rodape(),
  );
}
