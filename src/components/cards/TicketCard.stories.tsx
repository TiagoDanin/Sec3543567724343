import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TicketCard } from "./TicketCard";

const meta = {
  title: "Cards/TicketCard",
  component: TicketCard,
  args: {
    name: "Lote 2 · Meia-entrada",
    priceInCents: 4000,
    terms: "em até 6x · vendas até 10/08/2026",
    href: "https://example.com",
  },
  decorators: [
    (Story) => (
      <div className="max-w-[380px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TicketCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const SemCondicoes: Story = {
  name: "Sem condições de pagamento",
  args: { terms: undefined },
};

/** Os três lotes têm o mesmo peso: o laranja é do que o ponteiro toca. */
export const Grade: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-5 max-[960px]:grid-cols-1">
      <TicketCard {...args} name="Lote 2 · Meia-entrada" priceInCents={4000} />
      <TicketCard {...args} name="Lote 2 · Social" priceInCents={6000} />
      <TicketCard {...args} name="Lote 2 · Inteira" priceInCents={8000} />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="max-w-[1000px]">
        <Story />
      </div>
    ),
  ],
};
