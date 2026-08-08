import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BioHeader, SocialRow } from "./BioHeader";

const meta = {
  title: "Layout/BioHeader",
  component: BioHeader,
  args: {
    logo: "/images/marca/logo-xibesec.png",
    handle: "@perfil",
    lede: "Linha de apoio da página de links, com a assinatura do evento.",
    facts: ["19.09.2026", "09h às 19h", "Belém, PA"],
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BioHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const SemLogo: Story = { name: "Sem logo", args: { logo: undefined } };

export const ComRedes: Story = {
  name: "Com a linha de redes",
  render: (args) => (
    <>
      <BioHeader {...args} />
      <SocialRow
        aria-label="Redes"
        links={[
          { label: "Instagram", href: "#" },
          { label: "LinkedIn", href: "#" },
          { label: "Sympla", href: "#" },
        ]}
      />
    </>
  ),
};
