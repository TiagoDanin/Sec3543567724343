import type { Arquetipo } from "@/lib/content-types";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { COR_DO_TIME } from "./Carta";

export type ArquetiposIndexProps = {
  titulo: string;
  lede: string;
  arquetipos: Arquetipo[];
};

/**
 * Os arquétipos em HTML, no servidor. O quiz vive em JavaScript e guarda o
 * resultado atrás das perguntas: sem esta lista a rota chega ao buscador — e a
 * quem não executa script — como um formulário sem assunto.
 */
export function ArquetiposIndex({ titulo, lede, arquetipos }: ArquetiposIndexProps) {
  if (arquetipos.length === 0) return null;

  return (
    <Section id="arquetipos" tight>
      <Container>
        <SectionHeader title={titulo} lede={lede} slim />

        <ul className="grid grid-cols-3 gap-px max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
          {arquetipos.map((arquetipo) => (
            <li key={arquetipo.slug} className="border-line bg-panel border px-5 py-5.5">
              <p
                className="font-mono text-[11px] tracking-[0.2em] uppercase"
                style={{ color: COR_DO_TIME[arquetipo.timeCor] ?? COR_DO_TIME.blue }}
              >
                {[arquetipo.sigla, arquetipo.time].filter(Boolean).join(" · ")}
              </p>

              <h3 className="font-display text-cream mt-2.5 text-[19px] leading-[1.16] tracking-[-0.01em]">
                {arquetipo.nome}
              </h3>

              {arquetipo.area ? (
                <p className="text-mint mt-1.5 font-mono text-[12px] tracking-[0.04em]">
                  {arquetipo.area}
                </p>
              ) : null}

              {arquetipo.resumo ? (
                <p className="text-cream-2 mt-3.5 text-[15px] leading-[1.6]">{arquetipo.resumo}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
