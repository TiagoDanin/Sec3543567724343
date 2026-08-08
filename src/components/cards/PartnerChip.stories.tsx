import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PartnerChip } from "./PartnerChip";

const meta = {
  title: "Cards/PartnerChip",
  component: PartnerChip,
  args: { name: "Organização parceira", href: "https://example.com" },
} satisfies Meta<typeof PartnerChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComLink: Story = { name: "Com link" };

/** Handle ainda não confirmado: o chip renderiza sem link. */
export const SemLink: Story = { name: "Sem link", args: { href: undefined } };

export const Conjunto: Story = {
  render: () => (
    <ul className="flex flex-wrap gap-2.5">
      <li>
        <PartnerChip name="Organização A" href="#" />
      </li>
      <li>
        <PartnerChip name="Organização B" href="#" />
      </li>
      <li>
        <PartnerChip name="Organização C" />
      </li>
    </ul>
  ),
};
