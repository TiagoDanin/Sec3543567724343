import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapaDoSite } from "./MapaDoSite";

const meta = {
  title: "Seções/MapaDoSite",
  component: MapaDoSite,
  parameters: { layout: "fullscreen" },
  args: {
    eyebrow: "Mapa do site",
    titulo: "Tudo que está publicado.",
    lede: "As páginas no ar e os arquivos que o site escreve para leitura por máquina.",
    paginas: [
      {
        rotulo: "Início",
        href: "/",
        resumo: "O encontro de cibersegurança do Norte do Brasil.",
        markdown: "/index.md",
      },
      {
        rotulo: "O evento",
        href: "/evento/",
        resumo: "O que é o XibéSec, data, local, formato e edições anteriores.",
        markdown: "/docs/evento.md",
      },
      {
        rotulo: "Mapa do site",
        href: "/sitemap/",
        resumo: "",
        markdown: null,
      },
    ],
    arquivosTitulo: "Para máquinas",
    arquivos: [
      { path: "/llms.txt", resumo: "índice do site para assistentes de IA" },
      { path: "/sitemap.xml", resumo: "mapa do site" },
    ],
  },
} satisfies Meta<typeof MapaDoSite>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };
