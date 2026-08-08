import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta = {
  title: "Primitivos/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "ghost", "mint"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    arrow: { control: "boolean" },
    full: { control: "boolean" },
  },
  args: { children: "Comprar ingresso", variant: "primary", size: "md" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ver programação" },
};

export const Mint: Story = {
  args: { variant: "mint", children: "Quero participar" },
};

export const ComSeta: Story = {
  name: "Com seta (navegação interna)",
  args: { arrow: true, children: "Garantir presença" },
};

export const LinkExterno: Story = {
  name: "Link externo (seta diagonal automática)",
  args: { href: "https://example.com", target: "_blank", rel: "noopener", children: "Comprar" },
};

export const Tamanhos: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Pequeno</Button>
      <Button size="md">Médio</Button>
      <Button size="lg">Grande</Button>
    </div>
  ),
};

export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary">Primária</Button>
      <Button variant="ghost">Filete</Button>
      <Button variant="mint">Menta</Button>
    </div>
  ),
};
