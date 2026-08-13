import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Eyebrow, SectionTitle } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Tag } from "@/components/primitives/Tag";
import { Button } from "@/components/primitives/Button";
import { NoteWithLink } from "@/components/primitives/Note";
import type { LinkAlvo } from "@/lib/links";
import { credencial, paragrafos, type Palestrante, type Secao } from "@/lib/cms";

// Rótulos de dado e de navegação: mesma natureza de "Data" e "Local" na ficha
// técnica dos documentos, não copy editorial de `contents/`.
const PALESTRA_LABEL = "A palestra";
const BIO_LABEL = "Quem é";
const TEMAS_LABEL = "Temas";
const EXPERIENCIA_LABEL = "Experiência";
const CERTIFICACOES_LABEL = "Certificações";
const PALCOS_LABEL = "Já palestrou em";
const CIDADE_LABEL = "De";
const REDES_LABEL = "Onde encontrar";
const VOLTAR_LABEL = "Todos os palestrantes";

export type PalestranteSectionProps = {
  palestrante: Palestrante;
  secao: Secao;
  /** Destino do botão de compra, resolvido pela rota que renderiza. */
  compra: LinkAlvo;
  /** Endereço do índice, para o caminho de volta. */
  indiceHref: string;
};

function Ficha({ palestrante }: { palestrante: Palestrante }) {
  const linhas: Array<[string, string]> = [
    [EXPERIENCIA_LABEL, palestrante.experiencia],
    [CIDADE_LABEL, palestrante.cidade],
    [CERTIFICACOES_LABEL, palestrante.certificacoes.join(", ")],
    [PALCOS_LABEL, palestrante.palcos.join(", ")],
  ].filter((linha): linha is [string, string] => Boolean(linha[1]));

  if (linhas.length === 0) return null;

  return (
    <dl className="border-line border-t pt-6">
      {linhas.map(([rotulo, valor]) => (
        <div key={rotulo} className="mt-[14px] first:mt-0">
          <dt className="text-cream-3 font-mono text-[11px] tracking-[0.2em] uppercase">
            {rotulo}
          </dt>
          <dd className="text-cream-2 mt-1 text-[15px] leading-[1.6]">{valor}</dd>
        </div>
      ))}
    </dl>
  );
}

function Redes({ palestrante }: { palestrante: Palestrante }) {
  const links = [
    { label: "LinkedIn", href: palestrante.linkedin },
    { label: "GitHub", href: palestrante.github },
    { label: "Twitter", href: palestrante.twitter },
    { label: "Site", href: palestrante.site },
  ].filter((link) => link.href);

  if (links.length === 0) return null;

  return (
    <nav aria-label={REDES_LABEL} className="border-line mt-6 border-t pt-6">
      <p className="text-cream-3 font-mono text-[11px] tracking-[0.2em] uppercase">{REDES_LABEL}</p>

      <ul className="mt-3 flex flex-wrap gap-x-[18px] gap-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener"
              className="text-cream-2 ease-brand hover:text-orange hover:border-orange focus-visible:text-orange focus-visible:border-orange border-b border-transparent font-mono text-[12px] tracking-[0.14em] uppercase transition-colors duration-250"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * A página de uma pessoa. O nome ocupa a largura inteira, e só abaixo dele a
 * página se divide: a palestra e a bio na coluna de leitura, a ficha numa faixa
 * estreita de dado ao lado.
 *
 * Não há retrato nem moldura à espera de um. Uma coluna larga guardando ficha
 * de quatro linhas é o desenho de quem tirou a foto e não refez a página.
 *
 * A palestra vem antes da biografia de propósito: é o que a pessoa vai ver no
 * dia, e é o que responde à pergunta que trouxe quem chegou pela busca.
 */
export function PalestranteSection({
  palestrante,
  secao,
  compra,
  indiceHref,
}: PalestranteSectionProps) {
  const cargo = credencial(palestrante);

  return (
    <Section id="palestrante">
      <Container>
        <Reveal as="header" className="border-line border-b pb-[clamp(28px,3.5vw,44px)]">
          {secao.eyebrow ? (
            <Eyebrow tone={secao.eyebrowTom} className="mb-[18px]">
              {secao.eyebrow}
            </Eyebrow>
          ) : null}

          <SectionTitle as="h1">{palestrante.nome}</SectionTitle>

          {cargo ? (
            <p className="text-mint mt-[14px] font-mono text-[12px] tracking-[0.14em] uppercase">
              {cargo}
            </p>
          ) : null}

          {palestrante.resumo ? (
            <p className="text-cream-2 mt-5 max-w-[62ch] text-[17px] leading-[1.65]">
              {palestrante.resumo}
            </p>
          ) : null}
        </Reveal>
      </Container>

      <Container className="mt-[clamp(30px,4vw,52px)] grid grid-cols-[minmax(0,1fr)_minmax(0,300px)] items-start gap-[clamp(32px,5vw,72px)] max-[900px]:grid-cols-1">
        <div>
          {palestrante.palestraTitulo ? (
            <Reveal>
              <Eyebrow className="mb-[14px]">{PALESTRA_LABEL}</Eyebrow>

              <SectionTitle as="h2" size="md">
                {palestrante.palestraTitulo}
              </SectionTitle>

              {paragrafos(palestrante.palestraResumo).map((paragrafo, index) => (
                <p
                  key={index}
                  className="text-cream-2 mt-[18px] max-w-[68ch] text-[16px] leading-[1.7]"
                >
                  {paragrafo}
                </p>
              ))}

              {palestrante.temas.length > 0 ? (
                <ul aria-label={TEMAS_LABEL} className="mt-6 flex flex-wrap gap-2">
                  {palestrante.temas.map((tema) => (
                    <li key={tema}>
                      <Tag tone="mint">{tema}</Tag>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ) : null}

          {palestrante.bio ? (
            <Reveal className="border-line mt-[clamp(32px,4vw,52px)] border-t pt-[clamp(28px,3.5vw,44px)]">
              <Eyebrow className="mb-[14px]">{BIO_LABEL}</Eyebrow>

              {paragrafos(palestrante.bio).map((paragrafo, index) => (
                <p
                  key={index}
                  className="text-cream-2 mt-[18px] max-w-[68ch] text-[16px] leading-[1.7] first:mt-0"
                >
                  {paragrafo}
                </p>
              ))}
            </Reveal>
          ) : null}

          <Reveal className="mt-[clamp(32px,4vw,52px)] flex flex-wrap items-center gap-4">
            {secao.cta ? (
              <Button {...compra} href={compra.href}>
                {secao.cta}
              </Button>
            ) : null}

            <Button variant="ghost" href={indiceHref} arrow>
              {VOLTAR_LABEL}
            </Button>
          </Reveal>

          <NoteWithLink text={secao.nota} label={secao.notaLinkLabel} href={secao.notaLinkUrl} />
        </div>

        <Reveal
          as="aside"
          className="max-[900px]:mt-[clamp(28px,4vw,40px)] max-[900px]:max-w-[520px]"
        >
          <Ficha palestrante={palestrante} />
          <Redes palestrante={palestrante} />
        </Reveal>
      </Container>
    </Section>
  );
}
