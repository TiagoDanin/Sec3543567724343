import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Note } from "./Note";

const meta = {
  title: "Primitivos/Note",
  component: Note,
  args: {
    children: (
      <>
        Observação de rodapé de seção, com um <a href="#">link em menta</a> no meio.
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="max-w-[720px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Note>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };
