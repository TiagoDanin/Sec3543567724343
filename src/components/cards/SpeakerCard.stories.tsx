import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SpeakerCard } from "./SpeakerCard";

const meta = {
  title: "Cards/SpeakerCard",
  component: SpeakerCard,
  decorators: [
    (Story) => (
      <div className="max-w-[260px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SpeakerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Estado de lançamento: nenhum nome de 2026 foi anunciado. */
export const AConfirmar: Story = { name: "A confirmar", args: {} };

export const Preenchido: Story = {
  args: { name: "Nome do palestrante", topic: "Título da palestra", href: "#" },
};

export const Grade: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-5 max-[900px]:grid-cols-2">
      <SpeakerCard />
      <SpeakerCard />
      <SpeakerCard />
      <SpeakerCard />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="max-w-[1000px]">
        <Story />
      </div>
    ),
  ],
};
