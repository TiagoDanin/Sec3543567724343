import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KitBanner } from "./KitBanner";
import { Button } from "./Button";

const meta = {
  title: "Primitivos/KitBanner",
  component: KitBanner,
  args: {
    title: "Associe sua marca ao evento.",
    children: "Fale com a organização para receber as cotas, o perfil de público e os formatos.",
    actions: <Button href="mailto:contato@exemplo.com">Falar com a organização</Button>,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[1000px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof KitBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };
