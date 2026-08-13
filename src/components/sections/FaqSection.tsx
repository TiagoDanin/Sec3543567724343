import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { NoteWithLink } from "@/components/primitives/Note";
import { Reveal } from "@/components/primitives/Reveal";
import type { Duvida, Secao } from "@/lib/cms";

export type FaqSectionProps = {
  duvidas: Duvida[];
  secao: Secao;
  /** `h1` na rota dedicada, onde a seção é o assunto da página. */
  titleAs?: "h1" | "h2";
};

/**
 * O sinal de abrir. Desenhado, não tipografado: `+` e `−` em texto mudam de
 * largura entre as duas famílias e o alvo pula ao alternar.
 */
const Sinal = (
  <svg
    viewBox="0 0 14 14"
    aria-hidden="true"
    className="text-cream-3 group-hover:text-orange group-open:text-orange mt-[7px] size-[14px] shrink-0 fill-none stroke-current stroke-[1.6] transition-colors duration-200 [stroke-linecap:round]"
  >
    <path d="M1 7h12" />
    <path
      d="M7 1v12"
      className="origin-center transition-transform duration-300 ease-(--ease-brand) group-open:scale-y-0"
    />
  </svg>
);

/** `**termo**` marca o destaque sem exigir MDX, como no resto do conteúdo. */
function Enfase({ texto }: { texto: string }) {
  return (
    <>
      {texto.split("**").map((trecho, posicao) =>
        posicao % 2 === 1 ? (
          <strong key={posicao} className="text-cream font-bold">
            {trecho}
          </strong>
        ) : (
          trecho
        ),
      )}
    </>
  );
}

/**
 * Parágrafos separados por linha em branco; bloco de linhas iniciadas por `- `
 * vira lista. É a mesma marcação que o espelho em Markdown já publica, então a
 * resposta é escrita uma vez e serve aos dois destinos.
 */
function Resposta({ texto }: { texto: string }) {
  return (
    <>
      {texto.split("\n\n").map((bloco, index) => {
        const linhas = bloco.split("\n");
        const espaco = index === 0 ? "" : "mt-[14px]";

        if (linhas.every((linha) => linha.startsWith("- "))) {
          return (
            <ul key={index} className={`max-w-[68ch] ${espaco}`}>
              {linhas.map((linha, posicao) => (
                <li
                  key={posicao}
                  className="text-cream-2 before:bg-mint relative pl-[18px] text-[16px] leading-[1.7] not-first:mt-1.5 before:absolute before:top-[13px] before:left-0 before:h-px before:w-[9px] before:content-['']"
                >
                  <Enfase texto={linha.slice(2)} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={index}
            className={`text-cream-2 max-w-[68ch] text-[16px] leading-[1.7] ${espaco}`}
          >
            <Enfase texto={bloco} />
          </p>
        );
      })}
    </>
  );
}

/**
 * Dúvidas frequentes em sanfona nativa. `details` no lugar de um accordion de
 * biblioteca por uma razão que não é preferência: a resposta fechada continua
 * no HTML, e é dela que saem o resultado de busca e a citação de assistente de
 * IA. Um accordion que monta o conteúdo ao abrir publica uma página sem
 * resposta nenhuma — exatamente o que esta seção existe para evitar.
 *
 * O atributo `name` faz o navegador fechar a anterior ao abrir outra. Onde não
 * houver suporte, mais de uma fica aberta: perde-se o recolhimento, nunca o
 * conteúdo.
 */
export function FaqSection({ duvidas, secao, titleAs }: FaqSectionProps) {
  if (duvidas.length === 0) return null;

  return (
    <Section id="faq" variant="panel">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={secao.eyebrow}
            eyebrowTone={secao.eyebrowTom}
            title={secao.titulo}
            titleAs={titleAs}
            lede={secao.lede}
            slim
          />
        </Reveal>

        <div className="border-line border-t">
          {duvidas.map((duvida, index) => (
            <Reveal key={duvida.pergunta} step={(index % 3) as 0 | 1 | 2}>
              <details
                name="duvidas"
                open={index === 0}
                className="border-line group border-b [&::details-content]:overflow-hidden"
              >
                <summary className="grid cursor-pointer list-none grid-cols-[auto_1fr_auto] items-start gap-x-[clamp(14px,2vw,26px)] py-[22px] [&::-webkit-details-marker]:hidden">
                  <span className="text-cream-3 group-open:text-orange mt-[5px] font-mono text-[12px] tracking-[0.14em] tabular-nums transition-colors duration-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="group-hover:text-orange group-open:text-cream text-cream-2 text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.45] font-semibold transition-colors duration-200">
                    {duvida.pergunta}
                  </h3>

                  {Sinal}
                </summary>

                {/* Alinhado à pergunta, não à margem: a coluna do numeral é o
                    que faz a lista ler como uma pilha e não como texto solto. */}
                <div className="duvida-corpo grid grid-cols-[auto_1fr] gap-x-[clamp(14px,2vw,26px)] pb-[26px]">
                  <span aria-hidden="true" className="font-mono text-[12px] tracking-[0.14em]">
                    &nbsp;&nbsp;
                  </span>
                  <div>
                    <Resposta texto={duvida.resposta} />
                  </div>
                </div>
              </details>
            </Reveal>
          ))}
        </div>

        {secao.nota ? (
          <NoteWithLink
            text={secao.nota}
            label={secao.notaLinkLabel}
            href={secao.notaLinkUrl}
            className="mt-8"
          />
        ) : null}
      </Container>
    </Section>
  );
}
