import { cn } from "@/lib/utils";

export type TerminalLine = {
  /** `cmd` é a linha de comando; `ok`/`warn` levam o marcador colorido. */
  kind: "cmd" | "ok" | "warn" | "plain";
  text: string;
};

export type TerminalProps = {
  /** Rótulo da barra de título. */
  name?: string;
  lines: TerminalLine[];
  /** Cursor piscante na última linha. */
  caret?: boolean;
  className?: string;
};

const MARK: Record<TerminalLine["kind"], string | null> = {
  cmd: null,
  ok: "[+]",
  warn: "[?]",
  plain: null,
};

/**
 * Casca de terminal do CTF. A varredura de fósforo é uma camada com `overflow
 * hidden` do tamanho exato do corpo: posicionada direto no corpo, o rastro
 * passaria do fim e criaria rolagem.
 */
export function Terminal({ name = "xibesec@2026: ~", lines, caret = true, className }: TerminalProps) {
  return (
    <div className={cn("bg-shell relative overflow-hidden border border-mint/34", className)}>
      <div className="flex items-center gap-[7px] border-b border-mint/20 bg-mint/5 px-3.5 py-[11px]">
        <span className="bg-orange size-2" />
        <span className="bg-mint size-2" />
        <span className="bg-cream/30 size-2" />
        <span className="text-cream-3 ml-2 font-mono text-[11px] tracking-[0.1em]">{name}</span>
      </div>

      <div className="text-cream-2 relative overflow-x-auto p-[clamp(18px,2.4vw,28px)] font-mono text-[clamp(12px,1.05vw,13px)] leading-[2.05] max-[430px]:px-3.5 max-[430px]:py-4 max-[430px]:text-[11.5px]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-2 overflow-hidden">
          <span className="animate-scan absolute inset-x-0 -top-[90px] h-[90px] bg-linear-to-b from-mint/0 via-mint/7 to-mint/15 shadow-[0_1px_0_rgb(79_227_172/0.9),0_6px_22px_rgb(79_227_172/0.22)]" />
        </span>

        {lines.map((line, index) => (
          <span
            key={index}
            style={{ "--i": index } as React.CSSProperties}
            className="block [white-space:pre]"
          >
            {MARK[line.kind] ? (
              <i className={cn("not-italic", line.kind === "ok" ? "text-mint" : "text-orange")}>
                {MARK[line.kind]}
              </i>
            ) : null}
            {line.kind === "cmd" ? (
              <b className="text-cream font-bold">{line.text}</b>
            ) : (
              <>{MARK[line.kind] ? " " : ""}{line.text}</>
            )}
          </span>
        ))}

        {caret ? (
          <span className="block [white-space:pre]">
            <b className="text-cream font-bold">$ </b>
            <u className="animate-blink bg-mint inline-block h-[1.05em] w-[0.6em] align-[-0.16em] no-underline" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
