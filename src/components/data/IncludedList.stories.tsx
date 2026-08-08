import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IncludedList } from "./IncludedList";

const icons = {
  booth: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9h18M3 9l2-4h14l2 4M3 9v11h18V9M8 20v-6h5v6" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 21V3M6 4h12l-3 4 3 4H6" />
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
    </svg>
  ),
  cert: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3h14v13H5zM8 7h8M8 11h5M9 16v5l3-2 3 2v-5" />
    </svg>
  ),
};

const meta = {
  title: "Dados/IncludedList",
  component: IncludedList,
  args: {
    items: [
      { icon: icons.booth, text: "Área de exposição e ativações" },
      { icon: icons.flag, text: "Acesso à competição CTF" },
      { icon: icons.mic, text: "Todas as palestras" },
      { icon: icons.cert, text: "Certificado de participação" },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[1000px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IncludedList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Quatro itens: 4 · 2 · 1 coluna — nunca uma linha órfã. */
export const Padrao: Story = { name: "Padrão" };
