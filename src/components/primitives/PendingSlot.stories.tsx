import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PendingSlot } from "./PendingSlot";

const meta = {
  title: "Primitivos/PendingSlot",
  component: PendingSlot,
  args: { ratio: "16/10", mark: "2024" },
  decorators: [
    (Story) => (
      <div className="max-w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PendingSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FotoDeEdicao: Story = { name: "Foto de edição anterior" };

export const SemMarca: Story = { name: "Sem marca d'água", args: { mark: undefined } };

export const Retrato: Story = {
  name: "Retrato de palestrante",
  args: { ratio: "1/1", mark: undefined, label: "Palestrante a confirmar" },
};
