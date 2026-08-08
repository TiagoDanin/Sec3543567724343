import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Greca } from "./Greca";

const meta = {
  title: "Primitivos/Greca",
  component: Greca,
  parameters: { layout: "fullscreen" },
  argTypes: { tone: { control: "inline-radio", options: ["orange", "green"] } },
  args: { tone: "orange" },
  decorators: [
    (Story) => (
      <div className="-mx-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Greca>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Laranja: Story = {};

export const Verde: Story = { args: { tone: "green" } };
