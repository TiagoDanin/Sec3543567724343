import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tag } from "./Tag";

const meta = {
  title: "Primitivos/Tag",
  component: Tag,
  argTypes: { tone: { control: "inline-radio", options: ["orange", "mint"] } },
  args: { children: "Em definição", tone: "orange" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmDefinicao: Story = { name: "Em definição" };

export const Confirmado: Story = { args: { children: "Confirmado", tone: "mint" } };
