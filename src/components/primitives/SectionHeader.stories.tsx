import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionHeader } from "./SectionHeader";

const meta = {
  title: "Primitivos/SectionHeader",
  component: SectionHeader,
  argTypes: {
    eyebrowTone: { control: "inline-radio", options: ["orange", "mint", "dim"] },
    titleSize: { control: "inline-radio", options: ["md", "lg"] },
    alignEnd: { control: "boolean" },
    slim: { control: "boolean" },
  },
  args: {
    eyebrow: "Rótulo da seção",
    title: "Título da seção em duas linhas.",
    lede: "Texto de apoio, alinhado à direita do título em telas largas e empilhado abaixo dele a partir de 860px.",
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const AlinhadoPelaBase: Story = {
  name: "Alinhado pela base",
  args: { alignEnd: true },
};

export const RotuloMenta: Story = {
  name: "Rótulo em menta",
  args: { eyebrowTone: "mint" },
};

export const SemApoio: Story = {
  name: "Sem texto de apoio",
  args: { lede: undefined },
};

export const Slim: Story = {
  args: { slim: true, titleSize: "md" },
};
