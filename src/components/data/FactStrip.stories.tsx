import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FactStrip } from "./FactStrip";

const meta = {
  title: "Dados/FactStrip",
  component: FactStrip,
  parameters: { layout: "fullscreen" },
  args: {
    "aria-label": "Números da edição",
    facts: [
      { value: "4ª", label: "edição" },
      { value: "10h", label: "de programação" },
      { value: "2", label: "trilhas simultâneas" },
      { value: "21", label: "organizações parceiras" },
    ],
  },
} satisfies Meta<typeof FactStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const Curta: Story = {
  args: { facts: [{ value: "4ª", label: "edição" }] },
};
