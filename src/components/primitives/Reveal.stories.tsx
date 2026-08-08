import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionHeader";

const meta = {
  title: "Primitivos/Reveal",
  component: Reveal,
  args: { step: 0, children: <SectionTitle>Sobe com desfoque ao entrar na tela.</SectionTitle> },
  argTypes: { step: { control: "inline-radio", options: [0, 1, 2] } },
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

/** Escalonamento em passos de 80ms. O sistema usa no máximo três. */
export const Escalonado: Story = {
  render: () => (
    <div className="grid gap-4">
      <Reveal step={0}>
        <p className="border-line bg-panel border p-6">Primeiro</p>
      </Reveal>
      <Reveal step={1}>
        <p className="border-line bg-panel border p-6">Segundo</p>
      </Reveal>
      <Reveal step={2}>
        <p className="border-line bg-panel border p-6">Terceiro</p>
      </Reveal>
    </div>
  ),
};
