import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dock } from "./Dock";
import { Button } from "@/components/primitives/Button";

const meta = {
  title: "Layout/Dock",
  component: Dock,
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    headline: "Lote 2 · a partir de R$ 40",
    detail: "vendas até 10/08",
    showAfter: 0,
    action: (
      <Button size="sm" href="#ingressos">
        Ingressos
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="-m-8 h-[140vh]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Só aparece abaixo de 860px — redimensione a janela do canvas para ver. */
export const Padrao: Story = { name: "Padrão" };

export const RecolheNoRodape: Story = {
  name: "Recolhe no rodapé",
  decorators: [
    (Story) => (
      <div className="-m-8">
        <div className="h-[140vh]" />
        <Story />
        <footer className="bg-panel border-line text-cream-2 border-t p-8 font-mono text-[12px]">
          Rodapé de bancada — role até aqui para ver a barra sair.
          <div className="h-[60vh]" />
        </footer>
      </div>
    ),
  ],
};
