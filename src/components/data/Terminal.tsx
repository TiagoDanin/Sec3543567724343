import { TerminalFrame } from "@/components/data/TerminalFrame";
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

/** Saída fixa de terminal: a janela do CTF, com a varredura da moldura. */
export function Terminal({ name, lines, caret = true, className }: TerminalProps) {
  return (
    <TerminalFrame
      name={name}
      className={className}
      bodyClassName="overflow-x-auto p-[clamp(18px,2.4vw,28px)] font-mono text-[clamp(12px,1.05vw,13px)] leading-[2.05] max-[430px]:px-3.5 max-[430px]:py-4 max-[430px]:text-[11.5px]"
    >
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
            <>
              {MARK[line.kind] ? " " : ""}
              {line.text}
            </>
          )}
        </span>
      ))}

      {caret ? (
        <span className="block [white-space:pre]">
          <b className="text-cream font-bold">$ </b>
          <u className="animate-blink bg-mint inline-block h-[1.05em] w-[0.6em] align-[-0.16em] no-underline" />
        </span>
      ) : null}
    </TerminalFrame>
  );
}
