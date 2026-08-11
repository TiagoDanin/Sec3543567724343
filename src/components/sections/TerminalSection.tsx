import { NoteWithLink } from "@/components/primitives/Note";
import { ShellTerminal, type ShellNode } from "@/components/data/ShellTerminal";
import type { Secao } from "@/lib/cms";

export type TerminalSectionProps = {
  secao: Secao;
  /** Sistema de arquivos do shell, montado a partir de `contents/`. */
  fs: ShellNode;
  /** Data-alvo do evento, para o `uptime`. */
  target: string;
};

/**
 * A rota do xibesh: o shell toma a tela inteira sob a barra, e o cabeçalho da
 * página é a abertura do próprio terminal — título em display acima da janela
 * empurraria para fora da vista justamente o que a rota existe para mostrar.
 */
export function TerminalSection({ secao, fs, target }: TerminalSectionProps) {
  return (
    <section className="h-[calc(100dvh-var(--nav-h))]">
      <ShellTerminal
        variant="palco"
        fs={fs}
        target={target}
        banner={
          <div className="mb-[clamp(14px,2vw,22px)] max-w-[92ch]">
            {secao.eyebrow ? <p className="text-cream/45">{secao.eyebrow}</p> : null}

            <h1 className="text-mint mt-1 text-[13px] font-bold">{secao.titulo}</h1>

            <p className="text-cream-2 mt-2.5 leading-[1.8]">{secao.lede}</p>

            <NoteWithLink
              text={secao.nota}
              label={secao.notaLinkLabel}
              href={secao.notaLinkUrl}
              className="mt-2.5 max-w-none text-[13px] leading-[1.8]"
            />
          </div>
        }
      />
    </section>
  );
}
