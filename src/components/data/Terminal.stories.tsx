import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Terminal } from "./Terminal";

const meta = {
  title: "Dados/Terminal",
  component: Terminal,
  args: {
    name: "xibesec@2026: ~/ctf",
    lines: [
      { kind: "cmd", text: "$ xibesec ctf --edicao 2026" },
      { kind: "ok", text: "modalidade ....... ataque e defesa" },
      { kind: "ok", text: "formato .......... individual ou em equipe" },
      { kind: "ok", text: "acesso ........... incluso no ingresso" },
      { kind: "warn", text: "desafios ......... em preparacao" },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const SemCursor: Story = { args: { caret: false } };
