import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Countdown } from "./Countdown";

const meta = {
  title: "Dados/Countdown",
  component: Countdown,
  args: { target: "2026-09-19T09:00:00-03:00" },
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

/** Zerada: a contagem para em 00, não vira negativa. */
export const Encerrada: Story = { args: { target: "2020-01-01T00:00:00-03:00" } };
