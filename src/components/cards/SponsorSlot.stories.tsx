import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SponsorSlot } from "./SponsorSlot";

const meta = {
  title: "Cards/SponsorSlot",
  component: SponsorSlot,
  args: { name: "Patrocinador", href: "https://example.com", tier: "Bronze" },
  // Vive dentro da seção clara, que inverte o tema localmente.
  decorators: [
    (Story) => (
      <div className="on-light text-ink max-w-[520px] bg-white p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SponsorSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemLogo: Story = { name: "Sem logo em arquivo" };

export const SemLink: Story = { args: { href: undefined } };
