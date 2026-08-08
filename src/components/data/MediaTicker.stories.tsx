import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MediaTicker } from "./MediaTicker";
import type { Materia } from "@/lib/cms";

const materia = (veiculo: string, titulo: string, data: string, order: number): Materia => ({
  veiculo,
  slug: `${veiculo}-${order}`.toLowerCase(),
  titulo,
  url: "https://example.com",
  data,
  tipo: "materia",
  trecho: "",
  logo: "",
  order,
});

const MATERIAS: Materia[] = [
  materia(
    "RedePará",
    "XibéSec retorna a Belém com foco em segurança da informação",
    "2024-11-08",
    1,
  ),
  materia(
    "It Show",
    "Belém sediará evento transformador em segurança da informação",
    "2024-11-22",
    2,
  ),
  materia("HQPOP", "XibéSec 2025 leva cibersegurança para a Amazônia", "2025-09-11", 3),
  materia("AnchisesLandia", "Como foram os eventos de segurança em 2024", "2025-01-30", 4),
];

const meta = {
  title: "Dados/MediaTicker",
  component: MediaTicker,
  parameters: { layout: "fullscreen" },
  args: { materias: MATERIAS },
  decorators: [
    (Story) => (
      <div className="-mx-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MediaTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Passe o ponteiro sobre a faixa: a esteira para enquanto você lê. */
export const Padrao: Story = { name: "Padrão" };

/** Com poucos itens a trilha duplicada ainda fecha o laço sem emenda. */
export const PoucosItens: Story = {
  name: "Poucos itens",
  args: { materias: MATERIAS.slice(0, 2) },
};

/** Lista vazia não renderiza nada — a seção some junto. */
export const Vazio: Story = { args: { materias: [] } };
