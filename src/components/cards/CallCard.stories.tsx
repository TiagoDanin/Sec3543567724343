import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CallCard } from "./CallCard";

const meta = {
  title: "Cards/CallCard",
  component: CallCard,
  args: {
    eyebrow: "Palestrantes",
    title: "Chamada para palestrantes",
    children: "Envie sua proposta de palestra para a trilha técnica ou para a gerencial.",
    ctaLabel: "Enviar proposta",
    ctaHref: "https://example.com",
  },
  decorators: [
    (Story) => (
      <div className="max-w-[440px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CallCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const ComPrazo: Story = {
  name: "Com prazo",
  args: {
    eyebrow: "Voluntários",
    eyebrowTone: "mint",
    title: "Chamada para voluntários",
    children: "Participe da organização e apoie a experiência do público.",
    deadline: "Inscrições até 20 de agosto de 2026",
    ctaLabel: "Quero ser voluntário",
    ctaVariant: "mint",
  },
};
