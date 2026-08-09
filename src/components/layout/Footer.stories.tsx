import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer } from "./Footer";

const meta = {
  title: "Layout/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
  args: {
    tagline: "Assinatura do evento, cidade e estado",
    columns: [
      {
        title: "Redes",
        links: [
          { label: "Instagram", href: "#", external: true },
          { label: "LinkedIn", href: "#", external: true },
        ],
      },
      {
        title: "Realização",
        lead: "Nome da realizadora",
        links: [{ label: "contato@exemplo.com", href: "mailto:contato@exemplo.com" }],
      },
      {
        title: "Transparência",
        links: [{ label: "Privacidade", href: "#" }],
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="-m-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };
