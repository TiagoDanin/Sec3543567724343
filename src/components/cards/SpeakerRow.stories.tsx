import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SpeakerRow, SpeakerList } from "./SpeakerRow";

const meta = {
  title: "Cards/SpeakerRow",
  component: SpeakerRow,
  decorators: [
    (Story) => (
      <SpeakerList className="max-w-[980px]">
        <Story />
      </SpeakerList>
    ),
  ],
} satisfies Meta<typeof SpeakerRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Estado de lançamento: o próximo nome ainda não foi anunciado. */
export const AConfirmar: Story = { name: "A confirmar", args: {} };

export const Preenchida: Story = {
  args: {
    name: "Nome do palestrante",
    role: "Cargo · Organização",
    topic: "Título da palestra que a pessoa apresenta na edição",
    subjects: ["Tema um", "Tema dois", "Tema três"],
    href: "#",
  },
};

export const Lista: Story = {
  render: () => (
    <>
      <SpeakerRow
        name="Nome do palestrante"
        role="Cargo · Organização"
        topic="Título da palestra que a pessoa apresenta na edição"
        subjects={["Tema um", "Tema dois"]}
        href="#"
      />
      <SpeakerRow
        name="Outro nome"
        role="Cargo mais longo, com organização junto"
        topic="Um título de palestra bem mais comprido, para conferir como a linha se comporta quando o assunto não cabe em uma linha só"
        subjects={["Tema um", "Tema dois", "Tema três", "Tema quatro"]}
        href="#"
      />
      <SpeakerRow />
    </>
  ),
};
