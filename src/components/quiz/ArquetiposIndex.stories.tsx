import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Arquetipo } from "@/lib/content-types";
import { ArquetiposIndex } from "./ArquetiposIndex";

const base: Omit<Arquetipo, "slug" | "nome" | "sigla" | "time" | "timeCor" | "area" | "resumo"> = {
  timeCorNome: "Vermelho",
  timePapel: "Segurança ofensiva",
  ferramenta: "Burp Suite e um alvo autorizado",
  trilha: "tecnica",
  raridade: "6,8%",
  raridadeLabel: "Raro",
  texto: "",
  noEvento: "",
  order: 1,
};

const meta = {
  title: "Quiz/ArquetiposIndex",
  component: ArquetiposIndex,
  parameters: { layout: "fullscreen" },
  args: {
    titulo: "Todos os arquétipos",
    lede: "Cada arquétipo é um jeito de estar na segurança da informação — um time na roda de cores e uma área de atuação.",
    arquetipos: [
      {
        ...base,
        slug: "arrombador-de-portas",
        nome: "Arrombador de Portas",
        sigla: "RED",
        time: "Red Team",
        timeCor: "red",
        area: "Pentest e intrusão",
        resumo: "Você já mexeu naquilo que estava escrito para não mexer.",
      },
      {
        ...base,
        slug: "coruja-de-plantao",
        nome: "Coruja de Plantão",
        sigla: "SOC",
        time: "Blue Team",
        timeCor: "blue",
        area: "Monitoramento e SOC",
        resumo: "O alerta das três da manhã é seu, e você sabe qual deles é ruído.",
      },
      {
        ...base,
        slug: "tradutor-de-risco",
        nome: "Tradutor de Risco",
        sigla: "GRC",
        time: "White Team",
        timeCor: "white",
        area: "Governança e risco",
        resumo: "Você explica para a diretoria o que o time técnico já sabia.",
      },
    ],
  },
} satisfies Meta<typeof ArquetiposIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

/** Sem arquétipo publicado a seção não existe. */
export const Vazio: Story = { args: { arquetipos: [] } };
