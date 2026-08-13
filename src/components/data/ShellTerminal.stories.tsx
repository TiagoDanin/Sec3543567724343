import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShellTerminal, type ShellNode } from "./ShellTerminal";

// Recorte do sistema de arquivos, só para a bancada. Em produção ele é montado
// a partir de contents/ por src/lib/shell-fs.ts.
const FS: ShellNode = {
  "evento.txt": ["Evento de exemplo.", "Data e local vêm do conteúdo."],
  ctf: {
    "regras.txt": ["Modalidade  captura de flags", "Acesso      incluso no ingresso"],
    ".flag": ["XIBESEC{exemplo_de_bancada}", "", "Achou sem ninguém mandar."],
  },
  trilhas: {
    "tecnica.txt": ["Ofensiva, defesa, forense e nuvem."],
    "gerencial.txt": ["Liderança, riscos e governança."],
  },
};

const meta = {
  title: "Dados/ShellTerminal",
  component: ShellTerminal,
  parameters: { layout: "fullscreen" },
  args: { fs: FS, target: "2026-09-19T09:00:00-03:00" },
  decorators: [
    (Story) => (
      <div className="bg-panel -m-8 pt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShellTerminal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Clique em qualquer ponto do bloco para focar. `help` lista os comandos; `ls -a`
 * revela os ocultos; `sudo su` aceita as senhas mais vazadas do mundo — a piada
 * é o recado.
 */
export const Padrao: Story = { name: "Padrão" };

/**
 * A variante de `/terminal`: moldura, varredura e a altura da caixa que a
 * envolve — na rota, a tela inteira sob a barra. A sessão abre com o `neofetch`.
 */
export const Palco: Story = {
  args: { variant: "palco", neofetchNaAbertura: true },
  decorators: [
    (Story) => (
      <div className="h-[520px]">
        <Story />
      </div>
    ),
  ],
};
