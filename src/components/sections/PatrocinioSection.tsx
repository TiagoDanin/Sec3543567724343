import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Button } from "@/components/primitives/Button";
import { KitBanner } from "@/components/primitives/KitBanner";
import { SponsorSlot } from "@/components/cards/SponsorSlot";
import { patrocinio as copy } from "@/lib/copy";
import { asset, site } from "@/lib/site";
import type { Cota, Patrocinador } from "@/lib/cms";

export type PatrocinioSectionProps = {
  grupos: Array<{ cota: Cota; patrocinadores: Patrocinador[] }>;
};

/**
 * Única seção clara do site. A inversão existe porque as marcas chegam em
 * arquivo com fundo branco chapado e não podem ser recortadas.
 *
 * A seção mostra só patrocinador confirmado — não anuncia cota vaga. Ver
 * PRODUCT.md.
 */
export function PatrocinioSection({ grupos }: PatrocinioSectionProps) {
  const mailto = `mailto:${site.contactEmail}?subject=${encodeURIComponent(copy.mailSubject)}`;

  return (
    <Section id="patrocinio" variant="light">
      <Container>
        <Reveal>
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} lede={copy.lede} alignEnd />
        </Reveal>

        {grupos.map((grupo) => (
          <Reveal key={grupo.cota.nome} className="mb-10">
            <div className="mb-3.5 flex items-baseline justify-between gap-4">
              <p className="text-cream font-mono text-[12px] tracking-[0.16em] uppercase">
                {grupo.cota.label}
              </p>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-5">
              {grupo.patrocinadores.map((patrocinador) => (
                <SponsorSlot
                  key={patrocinador.slug}
                  name={patrocinador.nome}
                  logo={patrocinador.logo ? asset(patrocinador.logo) : undefined}
                  href={patrocinador.url}
                  tier={grupo.cota.label}
                />
              ))}
            </div>
          </Reveal>
        ))}

        <Reveal>
          <KitBanner
            title={copy.kitTitle}
            actions={<Button href={mailto}>{copy.kitCta}</Button>}
          >
            {copy.kitText}
          </KitBanner>
        </Reveal>
      </Container>
    </Section>
  );
}
