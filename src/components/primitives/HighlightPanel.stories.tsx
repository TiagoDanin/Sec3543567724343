import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HighlightPanel } from "./HighlightPanel";

const meta = {
  title: "Primitivos/HighlightPanel",
  component: HighlightPanel,
  args: {
    flag: "Novidade 2026",
    eyebrow: "Trilha gerencial",
    title: "Conteúdo também para quem decide.",
    children:
      "Trilha dedicada ao público gerencial, rodando em paralelo à trilha técnica durante todo o dia.",
  },
  decorators: [
    (Story) => (
      <div className="max-w-[1000px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HighlightPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const SemSelo: Story = { name: "Sem selo", args: { flag: undefined } };
