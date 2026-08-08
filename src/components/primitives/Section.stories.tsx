import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Section } from "./Section";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Button } from "./Button";

const meta = {
  title: "Primitivos/Section",
  component: Section,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "inline-radio", options: ["ink", "panel", "light"] },
    tight: { control: "boolean" },
  },
  // O conteúdo vem do `render`; `children` existe só para satisfazer o tipo.
  args: { variant: "ink", tight: false, children: null },
  render: (args) => (
    <Section {...args}>
      <Container>
        <SectionHeader
          eyebrow="Rótulo"
          title="Seção de exemplo."
          lede="As seções alternam o chão de igapó e o painel."
        />
        <Button variant="ghost">Ação</Button>
      </Container>
    </Section>
  ),
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Igapo: Story = { name: "Chão de igapó" };

export const Painel: Story = { args: { variant: "panel" } };

/** A única inversão do sistema: recebe logo com fundo branco chapado. */
export const Clara: Story = { name: "Clara (patrocínio)", args: { variant: "light" } };

export const Tight: Story = { name: "Ritmo reduzido", args: { tight: true } };
