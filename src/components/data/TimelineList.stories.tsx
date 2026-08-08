import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TimelineList } from "./TimelineList";

const meta = {
  title: "Dados/TimelineList",
  component: TimelineList,
  args: {
    entries: [
      { year: 2023, label: "Primeira edição", href: "#" },
      { year: 2024, label: "Segunda edição", href: "#" },
      { year: 2025, label: "Terceira edição", href: "#" },
      { year: 2026, label: "Quarta edição", detail: "19 de setembro", current: true },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TimelineList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

/** Sem `href` a linha não vira área de clique — não há registro para mostrar. */
export const SemRegistro: Story = {
  name: "Sem registro",
  args: {
    entries: [
      { year: 2023, label: "Primeira edição" },
      { year: 2026, label: "Quarta edição", detail: "19 de setembro", current: true },
    ],
  },
};
