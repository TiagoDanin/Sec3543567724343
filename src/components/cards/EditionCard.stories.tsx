import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EditionCard } from "./EditionCard";

const meta = {
  title: "Cards/EditionCard",
  component: EditionCard,
  args: { year: 2024, title: "Segunda edição", index: 1 },
  decorators: [
    (Story) => (
      <div className="max-w-[520px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EditionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As fotos existem mas não foram entregues: espaço reservado, não stock. */
export const SemFoto: Story = { name: "Sem foto (padrão)" };

export const NoTopoDaPilha: Story = { name: "No topo da pilha", args: { active: true } };

export const Pilha: Story = {
  render: () => (
    <div className="grid gap-6">
      <EditionCard year={2023} title="Primeira edição" index={0} />
      <EditionCard year={2024} title="Segunda edição" index={1} active />
      <EditionCard year={2025} title="Terceira edição" index={2} />
    </div>
  ),
};
