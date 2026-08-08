import { SkipLink } from "@/components/primitives/SkipLink";
import { Greca } from "@/components/primitives/Greca";
import { Section } from "@/components/primitives/Section";
import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/primitives/Reveal";
import { HighlightPanel } from "@/components/primitives/HighlightPanel";
import { Button } from "@/components/primitives/Button";
import { FactStrip } from "@/components/data/FactStrip";
import { NavBar } from "@/components/layout/NavBar";
import { Dock } from "@/components/layout/Dock";

import { Hero } from "@/components/sections/Hero";
import { CountdownBar } from "@/components/sections/CountdownBar";
import { EventoSection } from "@/components/sections/EventoSection";
import { ProgramacaoSection } from "@/components/sections/ProgramacaoSection";
import { CtfSection } from "@/components/sections/CtfSection";
import { PalestrantesSection } from "@/components/sections/PalestrantesSection";
import { IngressosSection } from "@/components/sections/IngressosSection";
import { ParticipeSection } from "@/components/sections/ParticipeSection";
import { PatrocinioSection } from "@/components/sections/PatrocinioSection";
import { ParceirosSection } from "@/components/sections/ParceirosSection";
import { LocalSection } from "@/components/sections/LocalSection";
import { Fechamento } from "@/components/sections/Fechamento";
import { SiteFooter } from "@/components/sections/SiteFooter";

import { SchemaMarkup, eventSchema, organizationWithSocial, websiteSchema } from "@/lib/schema";
import { chrome, countdown, trilhaGerencial } from "@/lib/copy";
import { pageMetadata } from "@/lib/site";
import {
  formatDate,
  formatPrice,
  getAgenda,
  getCtf,
  getEdicoes,
  getEquipe,
  getFatos,
  getIngressos,
  getNavegacao,
  getPalestrantes,
  getParceiros,
  getPatrocinadoresPorCota,
  getSettings,
  getSobre,
  lowestPrice,
} from "@/lib/cms";

export const metadata = pageMetadata({
  title: "Para quem tem fome de segurança · 19 de setembro · Belém, PA",
  description:
    "O encontro de cibersegurança que leva a energia do Norte do Brasil para quem vive infosec, hacking e tecnologia. 4ª edição: 19 de setembro de 2026, 09h às 19h, Bristol Marambaia Hotel, Belém do Pará.",
  path: "/",
});

export default function Page() {
  const settings = getSettings();
  const { sections } = settings;

  const navegacao = getNavegacao();
  const fatos = getFatos();
  const sobre = getSobre();
  const edicoes = getEdicoes();
  const agenda = getAgenda();
  const ctf = getCtf();
  const palestrantes = getPalestrantes();
  const ingressos = getIngressos();
  const gruposPatrocinio = getPatrocinadoresPorCota();
  const parceiros = getParceiros();
  const equipe = getEquipe();

  const cheapest = lowestPrice(ingressos);
  const lote = ingressos[0];

  return (
    <>
      <SchemaMarkup
        schema={[websiteSchema, organizationWithSocial, eventSchema({ settings, ingressos })]}
      />

      <SkipLink href="#conteudo">{chrome.skip}</SkipLink>

      <NavBar
        items={navegacao.filter((item) => !item.noMenu)}
        action={
          <Button size="sm" href="#ingressos">
            {chrome.navCta}
          </Button>
        }
      />

      <main id="conteudo" className="flex-1">
        <Hero settings={settings} />

        {sections.ingressos ? (
          <CountdownBar settings={settings} ingressos={ingressos} />
        ) : null}

        {sections.fatos ? (
          <FactStrip
            facts={fatos.map((fato) => ({ value: fato.valor, label: fato.label }))}
            aria-label="O XibéSec 2026 em números"
          />
        ) : null}

        <Greca tone="orange" />

        {sections.sobre ? (
          <EventoSection
            sobre={sobre}
            edicoes={edicoes}
            settings={settings}
            showEdicoes={sections.edicoes}
          />
        ) : null}

        <Section tight>
          <Container>
            <Reveal>
              <HighlightPanel
                flag={trilhaGerencial.flag}
                eyebrow={trilhaGerencial.eyebrow}
                title={trilhaGerencial.title}
              >
                {trilhaGerencial.text}
              </HighlightPanel>
            </Reveal>
          </Container>
        </Section>

        {sections.agenda ? <ProgramacaoSection agenda={agenda} /> : null}

        {sections.ctf ? <CtfSection ctf={ctf} /> : null}

        {sections.palestrantes ? <PalestrantesSection palestrantes={palestrantes} /> : null}

        {sections.ingressos ? <IngressosSection ingressos={ingressos} /> : null}

        {sections.participe ? <ParticipeSection settings={settings} /> : null}

        <Greca tone="green" />

        {sections.patrocinio ? <PatrocinioSection grupos={gruposPatrocinio} /> : null}

        <Greca tone="green" />

        {sections.parceiros ? <ParceirosSection parceiros={parceiros} /> : null}

        {sections.local ? <LocalSection settings={settings} /> : null}

        <Fechamento settings={settings} />
      </main>

      <SiteFooter settings={settings} equipe={equipe} />

      {sections.ingressos && cheapest !== null ? (
        <Dock
          headline={`Lote ${lote?.lote} · a partir de ${formatPrice(cheapest)}`}
          detail={lote ? `vendas até ${formatDate(lote.validThrough)}` : undefined}
          action={
            <Button size="sm" href="#ingressos">
              {chrome.dockCta}
            </Button>
          }
        />
      ) : null}
    </>
  );
}
