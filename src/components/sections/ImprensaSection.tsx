import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { MediaTicker } from "@/components/data/MediaTicker";
import { cn } from "@/lib/utils";
import type { Materia, Secao } from "@/lib/cms";

const ano = new Intl.DateTimeFormat("pt-BR", { year: "numeric", timeZone: "America/Belem" });

export type ImprensaSectionProps = {
  materias: Materia[];
  /** A frase de terceiro que abre a seção. Sem ela, só a esteira. */
  destaque?: Materia;
  secao: Secao;
};

/**
 * Prova social de imprensa, na porta da seção de patrocínio: quem decide verba
 * lê isto antes de abrir o mídia kit.
 */
export function ImprensaSection({ materias, destaque, secao }: ImprensaSectionProps) {
  if (materias.length === 0) return null;

  const naEsteira = destaque ? materias.filter((m) => m.slug !== destaque.slug) : materias;
  const lista = materias;

  return (
    <>
      {/* impeccable-variants-start edcc0741 */}
      <div
        data-impeccable-variants="edcc0741"
        data-impeccable-variant-count="4"
        style={{ display: "contents" }}
      >
        <style data-impeccable-css="edcc0741">{`
          [data-impeccable-variant] .imp-row { border-color: var(--line); }

          /* v1 — densidade da lista */
          [data-impeccable-variant="1"][data-p-densidade="compacta"] .imp-row { padding-block: 0.75rem; }
          [data-impeccable-variant="1"][data-p-densidade="confortavel"] .imp-row { padding-block: 1.25rem; }
          [data-impeccable-variant="1"] .imp-quote { font-size: calc(0.85rem + var(--p-citacao, 1) * 0.35rem); }

          /* v2 — colunas da grade */
          [data-impeccable-variant="2"][data-p-colunas="duas"] .imp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          [data-impeccable-variant="2"][data-p-colunas="tres"] .imp-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          @media (max-width: 900px) {
            [data-impeccable-variant="2"] .imp-grid { grid-template-columns: 1fr !important; }
            [data-impeccable-variant="2"] .imp-split { grid-template-columns: 1fr !important; }
          }

          /* v3 — faixa única */
          [data-impeccable-variant="3"] .animate-ticker { animation-duration: calc(var(--p-velocidade, 64) * 1s); }
          [data-impeccable-variant="3"][data-p-altura="fina"] .imp-lane a { padding-block: 0.7rem; }
          [data-impeccable-variant="3"][data-p-altura="media"] .imp-lane a { padding-block: 1.15rem; }

          /* v4 — mural */
          [data-impeccable-variant="4"][data-p-colunas="duas"] .imp-wall { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          [data-impeccable-variant="4"][data-p-colunas="tres"] .imp-wall { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          [data-impeccable-variant="4"][data-p-colunas="quatro"] .imp-wall { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          @media (max-width: 900px) {
            [data-impeccable-variant="4"] .imp-wall { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* ── original ────────────────────────────────────────────────── */}
        <div data-impeccable-variant="original" style={{ display: "none" }}>
          <Section id="imprensa" tight>
            <Container>
              <Reveal>
                <SectionHeader
                  eyebrow={secao.eyebrow}
                  eyebrowTone={secao.eyebrowTom}
                  title={secao.titulo}
                  titleSize="md"
                  lede={secao.lede}
                  slim
                />
              </Reveal>

              {destaque ? (
                <Reveal>
                  <figure className="border-line m-0 border-y py-[clamp(28px,4vw,48px)]">
                    <blockquote>
                      <p className="font-display text-cream max-w-[22ch] text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.14] font-bold tracking-[-0.02em]">
                        <span aria-hidden="true" className="text-orange -ml-[0.55em] pr-[0.1em]">
                          “
                        </span>
                        {destaque.trecho}
                        <span aria-hidden="true" className="text-orange">
                          ”
                        </span>
                      </p>
                    </blockquote>
                    <figcaption className="mt-6">
                      <a
                        href={destaque.url}
                        target="_blank"
                        rel="noopener"
                        className="group ease-brand inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 transition-colors duration-250"
                      >
                        <span className="text-mint group-hover:text-cream ease-brand font-mono text-[12px] tracking-[0.2em] uppercase transition-colors duration-250">
                          {destaque.veiculo}
                        </span>
                        <span className="text-cream-3 group-hover:text-cream-2 ease-brand border-b border-transparent text-[14px] transition-colors duration-250 group-hover:border-current">
                          {destaque.titulo}
                          {destaque.data ? `, ${ano.format(new Date(destaque.data))}` : null}
                        </span>
                      </a>
                    </figcaption>
                  </figure>
                </Reveal>
              ) : null}

              {naEsteira.length > 0 ? (
                <MediaTicker materias={naEsteira} className="border-line -mx-(--gutter) border-b" />
              ) : null}
            </Container>
          </Section>
        </div>

        {/* ── v1 · eixo HIERARQUIA ────────────────────────────────────────
            As matérias assumem o comando. A citação recua para uma linha de
            apoio em mono ao lado do rótulo; o que ganha escala é a manchete
            publicada, com o veículo como âncora à esquerda. */}
        <div
          data-impeccable-variant="1"
          data-impeccable-params='[{"id":"densidade","kind":"steps","default":"compacta","label":"Densidade","options":[{"value":"compacta","label":"Compacta"},{"value":"confortavel","label":"Confortável"}]},{"id":"citacao","kind":"range","min":0,"max":2,"step":0.1,"default":1,"label":"Peso da citação"}]'
        >
          <section id="imprensa" className="py-[clamp(36px,4.5vw,56px)]">
            <Container>
              <Reveal>
                <div className="border-line flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b pb-5">
                  <p className="text-mint font-mono text-[11px] font-medium tracking-[0.24em] uppercase">
                    {secao.eyebrow}
                  </p>
                  {destaque ? (
                    <p className="imp-quote text-cream-2 max-w-[46ch] leading-[1.5]">
                      <span className="text-orange">“</span>
                      {destaque.trecho}
                      <span className="text-orange">”</span>{" "}
                      <a
                        href={destaque.url}
                        target="_blank"
                        rel="noopener"
                        className="text-cream-3 hover:text-mint ease-brand font-mono text-[11px] tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-250"
                      >
                        {destaque.veiculo}
                      </a>
                    </p>
                  ) : null}
                </div>
              </Reveal>

              <ul className="bg-line grid gap-px">
                {lista.map((materia) => (
                  <li key={materia.slug} className="bg-ink">
                    <a
                      href={materia.url}
                      target="_blank"
                      rel="noopener"
                      className="imp-row group ease-brand hover:bg-panel grid grid-cols-[minmax(9rem,10rem)_1fr_auto] items-baseline gap-6 px-1 transition-colors duration-300 max-[720px]:grid-cols-1 max-[720px]:gap-1"
                    >
                      <span className="text-orange group-hover:text-orange-2 ease-brand font-mono text-[11px] tracking-[0.24em] uppercase transition-colors duration-250">
                        {materia.veiculo}
                      </span>
                      <span className="text-cream group-hover:text-cream ease-brand text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.35] font-medium transition-colors duration-250">
                        {materia.titulo}
                      </span>
                      <span className="text-cream/40 font-mono text-[11px] tabular-nums">
                        {materia.data ? ano.format(new Date(materia.data)) : null}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        </div>

        {/* ── v2 · eixo TOPOLOGIA ─────────────────────────────────────────
            De empilhado para lado a lado: a citação vira coluna estreita à
            esquerda e as matérias ocupam a área maior à direita, em grade.
            Corta altura pela metade sem encolher nada. */}
        <div
          data-impeccable-variant="2"
          style={{ display: "none" }}
          data-impeccable-params='[{"id":"colunas","kind":"steps","default":"duas","label":"Colunas","options":[{"value":"duas","label":"2"},{"value":"tres","label":"3"}]},{"id":"filete","kind":"toggle","default":true,"label":"Filete nos cartões"}]'
        >
          <section id="imprensa" className="py-[clamp(36px,4.5vw,56px)]">
            <Container>
              <div className="imp-split grid grid-cols-[minmax(0,.8fr)_minmax(0,1.6fr)] items-start gap-[clamp(28px,4vw,56px)]">
                <Reveal>
                  <p className="text-mint mb-5 font-mono text-[11px] font-medium tracking-[0.24em] uppercase">
                    {secao.eyebrow}
                  </p>

                  {destaque ? (
                    <figure className="m-0">
                      <blockquote>
                        <p className="font-display text-cream text-[clamp(1.15rem,1.9vw,1.6rem)] leading-[1.2] font-bold tracking-[-0.02em]">
                          <span aria-hidden="true" className="text-orange">
                            “
                          </span>
                          {destaque.trecho}
                          <span aria-hidden="true" className="text-orange">
                            ”
                          </span>
                        </p>
                      </blockquote>
                      <figcaption className="mt-4">
                        <a
                          href={destaque.url}
                          target="_blank"
                          rel="noopener"
                          className="text-mint hover:text-cream ease-brand font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-250"
                        >
                          {destaque.veiculo}
                        </a>
                      </figcaption>
                    </figure>
                  ) : null}
                </Reveal>

                <Reveal>
                  <ul className="imp-grid grid grid-cols-2 gap-px [&>li]:bg-ink bg-line">
                    {naEsteira.map((materia) => (
                      <li key={materia.slug}>
                        <a
                          href={materia.url}
                          target="_blank"
                          rel="noopener"
                          className="group ease-brand hover:bg-panel flex h-full flex-col gap-2 p-[clamp(16px,1.6vw,22px)] transition-colors duration-300"
                        >
                          <span className="text-orange group-hover:text-orange-2 ease-brand font-mono text-[11px] tracking-[0.24em] uppercase transition-colors duration-250">
                            {materia.veiculo}
                          </span>
                          <span className="text-cream text-[15px] leading-[1.35] font-medium">
                            {materia.titulo}
                          </span>
                          <span className="text-cream/40 mt-auto font-mono text-[11px] tabular-nums">
                            {materia.data ? ano.format(new Date(materia.data)) : null}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </Container>
          </section>
        </div>

        {/* ── v3 · eixo DENSIDADE ─────────────────────────────────────────
            Uma faixa só. O rótulo entra na mesma linha da esteira, a citação
            vira o primeiro vagão — em laranja, para o olho pegar primeiro.
            É a menor altura possível sem perder nenhuma matéria. */}
        <div
          data-impeccable-variant="3"
          style={{ display: "none" }}
          data-impeccable-params='[{"id":"velocidade","kind":"range","min":30,"max":120,"step":5,"default":64,"label":"Duração da volta (s)"},{"id":"altura","kind":"steps","default":"fina","label":"Altura da faixa","options":[{"value":"fina","label":"Fina"},{"value":"media","label":"Média"}]}]'
        >
          <section id="imprensa" className="border-line border-y py-[clamp(20px,2.4vw,32px)]">
            <Container className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <p className="text-mint font-mono text-[11px] font-medium tracking-[0.24em] uppercase">
                {secao.eyebrow}
              </p>
              <p className="text-cream-3 font-mono text-[11px] tracking-[0.14em] uppercase">
                {materias.length} publicações
              </p>
            </Container>

            <div className="imp-lane ticker-host group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
              <ul className="animate-ticker flex w-max items-center">
                {[...materias, ...materias].map((materia, index) => {
                  const eco = index >= materias.length;
                  const ehDestaque = destaque && materia.slug === destaque.slug;
                  return (
                    <li
                      key={`${materia.slug}-${index}`}
                      aria-hidden={eco ? "true" : undefined}
                      className="flex shrink-0 items-center"
                    >
                      <a
                        href={materia.url}
                        target="_blank"
                        rel="noopener"
                        tabIndex={eco ? -1 : undefined}
                        className="ease-brand group/item flex items-baseline gap-3 px-[clamp(18px,2.4vw,30px)] transition-colors duration-250"
                      >
                        <span
                          className={cn(
                            "ease-brand shrink-0 font-mono text-[11px] tracking-[0.24em] whitespace-nowrap uppercase transition-colors duration-250",
                            ehDestaque ? "text-mint" : "text-orange group-hover/item:text-orange-2",
                          )}
                        >
                          {materia.veiculo}
                        </span>
                        <span
                          className={cn(
                            "ease-brand whitespace-nowrap transition-colors duration-250",
                            ehDestaque
                              ? "text-cream text-[15px] font-medium"
                              : "text-cream-2 group-hover/item:text-cream text-[15px]",
                          )}
                        >
                          {ehDestaque ? `“${materia.trecho}”` : materia.titulo}
                        </span>
                      </a>
                      <span
                        aria-hidden="true"
                        className="bg-cream/22 size-[5px] shrink-0 rotate-45"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>

        {/* ── v4 · eixo DECOMPOSIÇÃO ──────────────────────────────────────
            Mural de recortes: cada publicação é uma célula da mesma grade de
            1px, e a citação ocupa a primeira célula em laranja cheio. Uma só
            leitura, sem hierarquia de bloco separado. */}
        <div
          data-impeccable-variant="4"
          style={{ display: "none" }}
          data-impeccable-params='[{"id":"colunas","kind":"steps","default":"tres","label":"Colunas","options":[{"value":"duas","label":"2"},{"value":"tres","label":"3"},{"value":"quatro","label":"4"}]},{"id":"citacao","kind":"toggle","default":true,"label":"Citação em bloco cheio"}]'
        >
          <section id="imprensa" className="py-[clamp(36px,4.5vw,56px)]">
            <Container>
              <Reveal>
                <p className="text-mint mb-5 font-mono text-[11px] font-medium tracking-[0.24em] uppercase">
                  {secao.eyebrow}
                </p>
              </Reveal>

              <Reveal>
                <ul className="imp-wall bg-line border-line grid grid-cols-3 gap-px border">
                  {destaque ? (
                    <li className="bg-orange text-ink col-span-1 row-span-1">
                      <a
                        href={destaque.url}
                        target="_blank"
                        rel="noopener"
                        className="ease-brand hover:bg-orange-2 flex h-full flex-col justify-between gap-4 p-[clamp(18px,2vw,26px)] transition-colors duration-300"
                      >
                        <p className="font-display text-[clamp(1.05rem,1.5vw,1.35rem)] leading-[1.16] font-bold tracking-[-0.02em]">
                          “{destaque.trecho}”
                        </p>
                        <span className="text-ink/70 font-mono text-[11px] tracking-[0.2em] uppercase">
                          {destaque.veiculo}
                        </span>
                      </a>
                    </li>
                  ) : null}

                  {naEsteira.map((materia) => (
                    <li key={materia.slug} className="bg-ink">
                      <a
                        href={materia.url}
                        target="_blank"
                        rel="noopener"
                        className="group ease-brand hover:bg-panel flex h-full flex-col gap-3 p-[clamp(18px,2vw,26px)] transition-colors duration-300"
                      >
                        <span className="text-orange group-hover:text-orange-2 ease-brand font-mono text-[11px] tracking-[0.24em] uppercase transition-colors duration-250">
                          {materia.veiculo}
                        </span>
                        <span className="text-cream text-[15px] leading-[1.35] font-medium">
                          {materia.titulo}
                        </span>
                        <span className="text-cream/40 mt-auto font-mono text-[11px] tabular-nums">
                          {materia.data ? ano.format(new Date(materia.data)) : null}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Container>
          </section>
        </div>
      </div>
      {/* impeccable-variants-end edcc0741 */}
    </>
  );
}
