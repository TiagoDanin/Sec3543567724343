import type { StudioConfig } from "nextjs-studio";

// Atalho para literais de select/multi-select.
const opt = (value: string, label = value) => ({ label, value });

const trilhas = [
  opt("tecnica", "Técnica"),
  opt("gerencial", "Gerencial"),
  opt("geral", "Geral"),
  opt("ctf", "CTF"),
];

const cotas = [
  opt("platina", "Platina"),
  opt("ouro", "Ouro"),
  opt("prata", "Prata"),
  opt("bronze", "Bronze"),
];

const config: StudioConfig = {
  collections: {
    // ── Configuração do site (singleton) ─────────────────────────────────
    // Identidade, datas, local e as chaves que ligam/desligam cada seção.
    settings: {
      schema: {
        collection: "settings",
        label: "Configuração do site",
        fields: [
          {
            name: "eventStartDate",
            type: "date",
            includeTime: true,
            required: true,
            label: "Início do evento",
          },
          {
            name: "eventEndDate",
            type: "date",
            includeTime: true,
            required: true,
            label: "Fim do evento",
          },
          { name: "eventDisplayDate", type: "text", required: true, label: "Data por extenso" },
          { name: "venueName", type: "text", required: true, label: "Local" },
          { name: "venueAddress", type: "text", required: true, label: "Endereço" },
          { name: "venueMapUrl", type: "url", label: "Link do mapa" },
          { name: "ticketsUrl", type: "url", required: true, label: "Link de venda (Sympla)" },
          { name: "volunteersDeadline", type: "date", label: "Prazo de voluntários" },
          { name: "cfpDeadline", type: "date", label: "Prazo do CFP" },
          {
            name: "sections",
            type: "object",
            label: "Seções visíveis",
            description: "Liga e desliga cada seção sem tocar em código.",
            fields: [
              { name: "fatos", type: "boolean", label: "Faixa de fatos" },
              { name: "sobre", type: "boolean", label: "Sobre o evento" },
              { name: "edicoes", type: "boolean", label: "Edições anteriores" },
              { name: "agenda", type: "boolean", label: "Programação" },
              { name: "ctf", type: "boolean", label: "CTF" },
              { name: "palestrantes", type: "boolean", label: "Palestrantes" },
              { name: "ingressos", type: "boolean", label: "Ingressos" },
              { name: "participe", type: "boolean", label: "Participe" },
              { name: "patrocinio", type: "boolean", label: "Patrocínio" },
              { name: "parceiros", type: "boolean", label: "Parceiros" },
              { name: "local", type: "boolean", label: "Local" },
              { name: "faq", type: "boolean", label: "Dúvidas" },
            ],
          },
        ],
      },
    },

    // ── Hero (singleton) ─────────────────────────────────────────────────
    hero: {
      schema: {
        collection: "hero",
        label: "Hero",
        fields: [
          { name: "tituloLinha", type: "text", required: true, label: "Título — primeira linha" },
          {
            name: "tituloDestaque",
            type: "text",
            required: true,
            label: "Título — segunda linha (laranja)",
          },
          { name: "lede", type: "long-text", required: true, rows: 3, label: "Texto de apoio" },
          { name: "ctaPrimario", type: "text", required: true, label: "Botão primário" },
          { name: "ctaSecundario", type: "text", label: "Botão secundário" },
          { name: "horario", type: "text", label: "Horário por extenso" },
          {
            name: "lugares",
            type: "array",
            label: "Lugar (separado por ·)",
            itemFields: [{ name: "nome", type: "text", required: true, label: "Nome" }],
          },
        ],
      },
    },

    // ── Cabeçalho das seções ─────────────────────────────────────────────
    // Um registro por seção da home. `chave` casa com o id da âncora.
    // O token {link} no campo `nota` é trocado pelo link no render.
    secoes: {
      schema: {
        collection: "secoes",
        label: "Cabeçalho das seções",
        fields: [
          { name: "chave", type: "text", required: true, label: "Chave (id da seção)" },
          { name: "eyebrow", type: "text", label: "Rótulo" },
          {
            name: "eyebrowTom",
            type: "select",
            label: "Cor do rótulo",
            options: [
              { label: "Laranja", value: "orange" },
              { label: "Menta", value: "mint" },
              { label: "Apagado", value: "dim" },
            ],
          },
          { name: "titulo", type: "text", label: "Título" },
          { name: "lede", type: "long-text", rows: 3, label: "Texto de apoio" },
          { name: "nota", type: "long-text", rows: 2, label: "Observação (use {link})" },
          { name: "notaLinkLabel", type: "text", label: "Rótulo do link da observação" },
          { name: "notaLinkUrl", type: "text", label: "Destino do link da observação" },
          { name: "cta", type: "text", label: "Botão" },
        ],
      },
    },

    // ── Blocos de destaque ───────────────────────────────────────────────
    destaques: {
      schema: {
        collection: "destaques",
        label: "Blocos de destaque",
        fields: [
          { name: "chave", type: "text", required: true, label: "Chave" },
          { name: "flag", type: "text", label: "Selo" },
          { name: "eyebrow", type: "text", label: "Rótulo" },
          { name: "titulo", type: "text", required: true, label: "Título" },
          { name: "texto", type: "long-text", required: true, rows: 4, label: "Texto" },
        ],
      },
    },

    // ── O que a inscrição dá direito ─────────────────────────────────────
    beneficios: {
      schema: {
        collection: "beneficios",
        label: "Direitos da inscrição",
        fields: [
          { name: "texto", type: "text", required: true, label: "Texto" },
          {
            name: "icone",
            type: "select",
            required: true,
            label: "Ícone",
            options: [
              { label: "Área de exposição", value: "exposicao" },
              { label: "Bandeira (CTF)", value: "ctf" },
              { label: "Microfone (palestras)", value: "palestras" },
              { label: "Certificado", value: "certificado" },
            ],
          },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },

    // ── Chamadas abertas ─────────────────────────────────────────────────
    chamadas: {
      schema: {
        collection: "chamadas",
        label: "Chamadas abertas",
        fields: [
          { name: "chave", type: "text", required: true, label: "Chave" },
          { name: "eyebrow", type: "text", required: true, label: "Rótulo" },
          {
            name: "eyebrowTom",
            type: "select",
            label: "Cor do rótulo",
            options: [
              { label: "Laranja", value: "orange" },
              { label: "Menta", value: "mint" },
            ],
          },
          { name: "titulo", type: "text", required: true, label: "Título" },
          { name: "texto", type: "long-text", required: true, rows: 3, label: "Texto" },
          { name: "prazoPrefixo", type: "text", label: "Prefixo do prazo" },
          { name: "ctaLabel", type: "text", required: true, label: "Botão" },
          { name: "ctaUrl", type: "url", required: true, label: "Destino do botão" },
          {
            name: "ctaVariante",
            type: "select",
            label: "Variante do botão",
            options: [
              { label: "Primária", value: "primary" },
              { label: "Menta", value: "mint" },
            ],
          },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },

    // ── Sobre o evento (singleton) ───────────────────────────────────────
    sobre: {
      schema: {
        collection: "sobre",
        label: "Sobre o evento",
        fields: [
          { name: "titulo", type: "text", label: "Título" },
          { name: "texto", type: "long-text", rows: 4, label: "Texto" },
          { name: "origemTitulo", type: "text", label: "Título da origem do nome" },
          { name: "origemTexto", type: "long-text", rows: 4, label: "Origem do nome (Xibé)" },
          {
            name: "pilares",
            type: "array",
            label: "Pilares",
            itemFields: [
              { name: "titulo", type: "text", required: true, label: "Título" },
              { name: "texto", type: "long-text", required: true, rows: 2, label: "Texto" },
            ],
          },
        ],
      },
    },

    // ── Fatos verificáveis (lista) ───────────────────────────────────────
    // Faixa `.strip`: número em mono laranja + rótulo.
    fatos: {
      schema: {
        collection: "fatos",
        label: "Fatos",
        fields: [
          { name: "valor", type: "text", required: true, label: "Valor" },
          { name: "label", type: "text", required: true, label: "Rótulo" },
        ],
      },
    },

    // ── Navegação (lista) ────────────────────────────────────────────────
    // Fonte única do menu, do rodapé e do <nav> para crawlers.
    navegacao: {
      schema: {
        collection: "navegacao",
        label: "Navegação",
        fields: [
          { name: "label", type: "text", required: true, label: "Rótulo" },
          { name: "href", type: "text", required: true, label: "Destino" },
          {
            name: "grupo",
            type: "select",
            label: "Grupo no rodapé",
            options: [opt("evento", "Evento"), opt("participar", "Participar")],
          },
          { name: "noMenu", type: "boolean", label: "Aparece no menu principal" },
        ],
      },
    },

    // ── Ingressos ────────────────────────────────────────────────────────
    // Preço em CENTAVOS. Nunca string formatada: precisa somar e alimentar Offer.
    ingressos: {
      schema: {
        collection: "ingressos",
        label: "Ingressos",
        fields: [
          { name: "nome", type: "text", required: true, label: "Nome" },
          { name: "slug", type: "slug", from: "nome", required: true },
          { name: "lote", type: "number", format: "integer", required: true, label: "Lote" },
          {
            name: "preco",
            type: "number",
            format: "integer",
            required: true,
            label: "Preço (centavos)",
          },
          { name: "parcelas", type: "number", format: "integer", label: "Parcelas" },
          { name: "descricao", type: "long-text", rows: 2, label: "Descrição" },
          {
            name: "validThrough",
            type: "date",
            includeTime: true,
            required: true,
            label: "Válido até",
          },
          { name: "ctaUrl", type: "url", label: "Link de compra" },
          { name: "featured", type: "boolean", label: "Caminho primário" },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },

    // ── Programação ──────────────────────────────────────────────────────
    // Horário em ISO, nunca "10:35 - 11:00": precisa ordenar, calcular duração e gerar .ics.
    // `slug` vazio = item de grade sem página de detalhe (intervalo, credenciamento).
    agenda: {
      schema: {
        collection: "agenda",
        label: "Programação",
        fields: [
          { name: "titulo", type: "text", required: true, label: "Título" },
          { name: "slug", type: "text", label: "Slug (vazio = sem página)" },
          { name: "descricao", type: "long-text", rows: 3, label: "Descrição" },
          { name: "startsAt", type: "date", includeTime: true, required: true, label: "Começa" },
          { name: "endsAt", type: "date", includeTime: true, required: true, label: "Termina" },
          { name: "trilha", type: "select", required: true, label: "Trilha", options: trilhas },
          {
            name: "tipo",
            type: "select",
            required: true,
            label: "Tipo",
            options: [
              opt("palestra", "Palestra"),
              opt("keynote", "Keynote"),
              opt("intervalo", "Intervalo"),
              opt("operacional", "Operacional"),
              opt("ctf", "CTF"),
            ],
          },
          {
            name: "speakerSlug",
            type: "relation",
            collection: "palestrantes",
            label: "Palestrante",
          },
          {
            name: "status",
            type: "select",
            label: "Situação",
            options: [opt("confirmado", "Confirmado"), opt("em-definicao", "Em definição")],
          },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },

    // ── Palestrantes ─────────────────────────────────────────────────────
    // Corpo MDX = bio longa. Nasce vazia: nenhum nome anunciado para 2026.
    palestrantes: {
      mediaDir: "public/images/palestrantes",
      schema: {
        collection: "palestrantes",
        label: "Palestrantes",
        fields: [
          { name: "nome", type: "text", required: true, label: "Nome" },
          { name: "slug", type: "slug", from: "nome", required: true },
          { name: "cargo", type: "text", label: "Cargo" },
          { name: "empresa", type: "text", label: "Empresa" },
          { name: "foto", type: "media", accept: ["image/*"], label: "Foto" },
          { name: "resumo", type: "text", label: "Resumo (card)" },
          { name: "linkedin", type: "url", label: "LinkedIn" },
          { name: "github", type: "url", label: "GitHub" },
          { name: "twitter", type: "url", label: "Twitter / X" },
          { name: "site", type: "url", label: "Site" },
          { name: "destaque", type: "boolean", label: "Destaque" },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },

    // ── Cotas de patrocínio ──────────────────────────────────────────────
    cotas: {
      schema: {
        collection: "cotas",
        label: "Cotas de patrocínio",
        fields: [
          { name: "nome", type: "select", required: true, label: "Cota", options: cotas },
          { name: "label", type: "text", required: true, label: "Rótulo" },
          { name: "preco", type: "number", format: "integer", label: "Preço (centavos)" },
          {
            name: "beneficios",
            type: "array",
            label: "Benefícios",
            itemFields: [{ name: "item", type: "text", required: true, label: "Benefício" }],
          },
          { name: "featured", type: "boolean", label: "Destaque" },
          {
            name: "disponivel",
            type: "boolean",
            label: "Disponível",
            description: "A página não anuncia cota vaga sem aval — ver PRODUCT.md.",
          },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },

    // ── Patrocinadores confirmados ───────────────────────────────────────
    patrocinadores: {
      mediaDir: "public/images/patrocinadores",
      schema: {
        collection: "patrocinadores",
        label: "Patrocinadores",
        fields: [
          { name: "nome", type: "text", required: true, label: "Nome" },
          { name: "slug", type: "slug", from: "nome", required: true },
          { name: "logo", type: "media", accept: ["image/*"], label: "Logo" },
          { name: "url", type: "url", label: "Site" },
          { name: "cota", type: "select", required: true, label: "Cota", options: cotas },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },

    // ── Organizações parceiras ───────────────────────────────────────────
    // `url` e `logo` opcionais de propósito: handles ainda não confirmados.
    parceiros: {
      mediaDir: "public/images/parceiros",
      schema: {
        collection: "parceiros",
        label: "Organizações parceiras",
        fields: [
          { name: "nome", type: "text", required: true, label: "Nome" },
          { name: "slug", type: "slug", from: "nome", required: true },
          { name: "url", type: "url", label: "Link (confirmar antes de publicar)" },
          { name: "logo", type: "media", accept: ["image/*"], label: "Logo" },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },

    // ── Edições anteriores ───────────────────────────────────────────────
    // `publico` e `fotos` nascem nulos e é assim que devem ficar até o cliente entregar.
    edicoes: {
      mediaDir: "public/images/edicoes",
      schema: {
        collection: "edicoes",
        label: "Edições anteriores",
        fields: [
          { name: "ano", type: "number", format: "integer", required: true, label: "Ano" },
          { name: "tema", type: "text", label: "Tema" },
          { name: "local", type: "text", label: "Local" },
          { name: "publico", type: "number", format: "integer", label: "Público (não estimar)" },
          { name: "resumo", type: "long-text", rows: 2, label: "Resumo" },
          { name: "albumUrl", type: "url", label: "Álbum de fotos" },
          {
            name: "status",
            type: "select",
            required: true,
            label: "Situação",
            options: [opt("confirmado", "Confirmado"), opt("a-conferir", "A conferir")],
          },
        ],
      },
    },

    // ── CTF (singleton) ──────────────────────────────────────────────────
    ctf: {
      schema: {
        collection: "ctf",
        label: "CTF",
        fields: [
          { name: "titulo", type: "text", label: "Título" },
          { name: "texto", type: "long-text", rows: 4, label: "Texto" },
          { name: "formato", type: "text", label: "Formato" },
          { name: "premiacao", type: "text", label: "Premiação" },
          { name: "incluso", type: "text", label: "Aviso de acesso incluso" },
          {
            name: "linhas",
            type: "array",
            label: "Linhas do terminal",
            itemFields: [{ name: "texto", type: "text", required: true, label: "Linha" }],
          },
        ],
      },
    },

    // ── Dúvidas frequentes ───────────────────────────────────────────────
    // Resposta no campo, não no corpo: alimenta o accordion e o FAQPage do JSON-LD.
    faq: {
      schema: {
        collection: "faq",
        label: "Dúvidas frequentes",
        fields: [
          { name: "pergunta", type: "text", required: true, label: "Pergunta" },
          { name: "resposta", type: "long-text", required: true, rows: 3, label: "Resposta" },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },

    // ── Realização ───────────────────────────────────────────────────────
    equipe: {
      mediaDir: "public/images/equipe",
      schema: {
        collection: "equipe",
        label: "Realização",
        fields: [
          { name: "nome", type: "text", required: true, label: "Nome" },
          { name: "slug", type: "slug", from: "nome", required: true },
          { name: "papel", type: "text", label: "Papel" },
          { name: "url", type: "url", label: "Site" },
          { name: "logo", type: "media", accept: ["image/*"], label: "Logo" },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },

    // ── Código de conduta (MDX único) ────────────────────────────────────
    "codigo-de-conduta": {
      schema: {
        collection: "codigo-de-conduta",
        label: "Código de conduta",
        fields: [
          { name: "titulo", type: "text", required: true, label: "Título" },
          { name: "updatedAt", type: "date", required: true, label: "Atualizado em" },
        ],
      },
    },

    // ── Link-in-bio ──────────────────────────────────────────────────────
    // Página de QR code do evento: muda de destino sem redeploy de código.
    links: {
      schema: {
        collection: "links",
        label: "Links (QR code)",
        fields: [
          { name: "label", type: "text", required: true, label: "Rótulo" },
          { name: "href", type: "url", required: true, label: "Destino" },
          { name: "descricao", type: "text", label: "Descrição" },
          { name: "enabled", type: "boolean", label: "Ativo" },
          { name: "order", type: "number", format: "integer", label: "Ordem" },
        ],
      },
    },
  },
};

export default config;
