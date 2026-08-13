import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaqSection } from "./FaqSection";

const meta = {
  title: "Seções/FaqSection",
  component: FaqSection,
  parameters: { layout: "fullscreen" },
  args: {
    secao: {
      chave: "faq",
      eyebrow: "Antes de comprar",
      eyebrowTom: "mint",
      titulo: "Dúvidas frequentes sobre o XibéSec 2026.",
      lede: "Data, local, preço, o que o ingresso inclui, como funciona o CTF — e o que ainda está em definição.",
      nota: "Ficou faltando alguma coisa? A organização responde no {link}.",
      notaLinkLabel: "@xibesec no Instagram",
      notaLinkUrl: "https://www.instagram.com/xibesec/",
      cta: "",
      ctaUrl: "",
    },
    duvidas: [
      {
        pergunta: "O que é o XibéSec?",
        resposta:
          "O XibéSec é um encontro presencial de cibersegurança realizado em Belém, no Pará. A edição de 2026 é a quarta, com duas trilhas simultâneas, a técnica e a gerencial, e uma competição CTF presencial.",
        order: 1,
      },
      {
        pergunta: "O que está incluso no ingresso?",
        resposta:
          "A inscrição dá direito a:\n\n- Área de exposição, patrocinadores, organizações parceiras e ativações\n- Acesso à competição CTF\n- Todas as palestras\n\nO acesso ao CTF já está incluso em qualquer ingresso, sem inscrição à parte.",
        order: 2,
      },
      {
        pergunta: "Como funciona o CTF do XibéSec?",
        resposta:
          "É uma **caça às flags**. Cada desafio esconde uma vulnerabilidade: quem encontra a falha captura a flag e pontua.\n\nOs desafios ainda estão em preparação.",
        order: 3,
      },
    ],
  },
} satisfies Meta<typeof FaqSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

/** Na rota dedicada a seção é o assunto da página, e o título vira `h1`. */
export const RotaDedicada: Story = {
  name: "Rota dedicada",
  args: { titleAs: "h1" },
};

/** Sem dúvida cadastrada a seção não renderiza — não há estado vazio a mostrar. */
export const SemDuvidas: Story = {
  name: "Sem dúvidas",
  args: { duvidas: [] },
};
