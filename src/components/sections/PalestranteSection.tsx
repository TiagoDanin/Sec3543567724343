import Image from "next/image";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Eyebrow, SectionTitle } from "@/components/primitives/SectionHeader";
import { PendingSlot } from "@/components/primitives/PendingSlot";
import { Reveal } from "@/components/primitives/Reveal";
import { Tag } from "@/components/primitives/Tag";
import { Button } from "@/components/primitives/Button";
import { NoteWithLink } from "@/components/primitives/Note";
import type { LinkAlvo } from "@/lib/links";
import { asset } from "@/lib/site";
import { credencial, iniciais, paragrafos, type Palestrante, type Secao } from "@/lib/cms";

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
const RETRATO_PENDENTE = "Retrato em curadoria";
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
    <dl className="border-line mt-6 border-t pt-6">
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
 * A página de uma pessoa: retrato e ficha à esquerda, palestra e bio à direita.
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
      {/* O nome vem antes da ficha no HTML e depois dela na tela: quem lê por
          leitor ou por rastreador encontra o assunto da página na primeira
          linha, e não o rótulo "Experiência". */}
      <Container className="grid grid-cols-[minmax(0,.62fr)_minmax(0,1fr)] items-start gap-[clamp(32px,5vw,72px)] max-[900px]:grid-cols-1">
        <div className="max-[900px]:order-1 min-[901px]:col-start-2 min-[901px]:row-start-1">
          <Reveal>
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

          {palestrante.palestraTitulo ? (
            <Reveal className="border-line mt-[clamp(32px,4vw,52px)] border-t pt-[clamp(28px,3.5vw,44px)]">
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

        <Reveal className="max-[900px]:order-2 max-[900px]:mt-[clamp(28px,4vw,40px)] max-[900px]:max-w-[320px] min-[901px]:col-start-1 min-[901px]:row-start-1">
          {palestrante.foto ? (
            <Image
              src={asset(palestrante.foto)}
              alt={palestrante.nome}
              width={640}
              height={640}
              priority
              className="border-line-2 w-full border object-cover"
            />
          ) : (
            <PendingSlot
              ratio="1/1"
              mark={iniciais(palestrante.nome)}
              label={`${RETRATO_PENDENTE}: ${palestrante.nome}`}
            />
          )}

          <Ficha palestrante={palestrante} />
          <Redes palestrante={palestrante} />
        </Reveal>
      </Container>
    </Section>
  );
}
