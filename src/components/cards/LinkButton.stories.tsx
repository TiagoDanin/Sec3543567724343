import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LinkButton } from "./LinkButton";

const TicketIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9h18M3 9l2-4h14l2 4M3 9v11h18V9M8 20v-6h5v6" />
  </svg>
);

const MailIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
  </svg>
);

const meta = {
  title: "Cards/LinkButton",
  component: LinkButton,
  args: {
    label: "Rótulo do link",
    description: "Linha de apoio",
    href: "https://example.com",
    icon: TicketIcon,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[520px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

/** O ingresso é a ação: bloco cheio, não filete. */
export const Destaque: Story = { args: { highlight: true } };

export const SemDescricao: Story = { name: "Sem descrição", args: { description: undefined } };

export const Lista: Story = {
  render: () => (
    <nav className="grid gap-3">
      <LinkButton label="Ingressos" description="Lote em venda" href="#" icon={TicketIcon} highlight />
      <LinkButton label="Chamada de patrocinadores" description="Formulário de cotas" href="#" icon={MailIcon} />
      <LinkButton label="Site oficial" description="Programação e local" href="#" external={false} />
    </nav>
  ),
};
