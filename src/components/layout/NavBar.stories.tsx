import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavBar } from "./NavBar";
import { Button } from "@/components/primitives/Button";

const meta = {
  title: "Layout/NavBar",
  component: NavBar,
  parameters: { layout: "fullscreen" },
  args: {
    items: [
      { label: "O evento", href: "#evento" },
      { label: "Programação", href: "#programacao" },
      { label: "CTF", href: "#ctf" },
      { label: "Palestrantes", href: "#palestrantes" },
      { label: "Patrocínio", href: "#patrocinio" },
    ],
    action: (
      <Button size="sm" href="#ingressos">
        Comprar ingresso
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="-m-8">
        <Story />
        {/* Altura para exercitar o estado de rolagem. */}
        <div className="h-[160vh]" />
      </div>
    ),
  ],
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const SemAcao: Story = { name: "Sem botão", args: { action: undefined } };
