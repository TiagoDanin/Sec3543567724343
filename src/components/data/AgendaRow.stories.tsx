import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AgendaList, AgendaRow } from "./AgendaRow";

const meta = {
  title: "Dados/AgendaRow",
  component: AgendaRow,
  args: {
    startsAt: "2026-09-19T09:00:00-03:00",
    title: "Credenciamento e abertura",
    children: "Recepção, boas-vindas e apresentação da edição.",
  },
  render: (args) => (
    <AgendaList>
      <AgendaRow {...args} />
    </AgendaList>
  ),
} satisfies Meta<typeof AgendaRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmado: Story = {};

/** Indefinido é declarado, nunca preenchido com invenção. */
export const EmDefinicao: Story = {
  name: "Em definição",
  args: {
    startsAt: "2026-09-19T10:00:00-03:00",
    title: "Trilhas técnica e gerencial",
    status: "em-definicao",
  },
};

export const ComPaginaDeDetalhe: Story = {
  name: "Com página de detalhe",
  args: { href: "#" },
};

export const Grade: Story = {
  render: () => (
    <AgendaList>
      <AgendaRow startsAt="2026-09-19T09:00:00-03:00" title="Credenciamento e abertura">
        Recepção, boas-vindas e apresentação da edição.
      </AgendaRow>
      <AgendaRow
        startsAt="2026-09-19T10:00:00-03:00"
        title="Trilhas técnica e gerencial"
        status="em-definicao"
      >
        Duas trilhas simultâneas ao longo do dia.
      </AgendaRow>
      <AgendaRow startsAt="2026-09-19T13:00:00-03:00" title="Intervalo e networking" />
      <AgendaRow startsAt="2026-09-19T18:00:00-03:00" title="Encerramento" />
    </AgendaList>
  ),
};
