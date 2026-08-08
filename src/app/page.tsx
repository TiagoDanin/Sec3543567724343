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
import { pageMetadata, site } from "@/lib/site";
import {
  SECAO_VAZIA,
  formatDate,
  formatPrice,
  getAgenda,
  getBeneficios,
  getChamadas,
  getCtf,
  getDestaque,
  getEdicoes,
  getEquipe,
  getFatos,
  getHero,
  getIngressos,
  getNavegacao,
  getPalestrantes,
  getParceiros,
  getPatrocinadoresPorCota,
  getSecoes,
  getSettings,
  getSobre,
  lowestPrice,
} from "@/lib/cms";

// Rótulos de navegação: interface, não conteúdo editorial.
const SKIP = "Pular para o conteúdo";
const NAV_CTA = "Comprar ingresso";
const DOCK_CTA = "Ingressos";
const FATOS_ARIA = "O XibéSec 2026 em números";

export const metadata = pageMetadata({
  title: `${site.siteTagline} · 19 de setembro · ${site.city}, ${site.region}`,
  description: site.siteDescription,
  path: "/",
});

export default function Page() {
  const settings = getSettings();
  const { sections } = settings;

  const secoes = getSecoes();
  const secao = (chave: string) => secoes[chave] ?? SECAO_VAZIA;

  const hero = getHero();
  const navegacao = getNavegacao();
  const fatos = getFatos();
  const sobre = getSobre();
  const edicoes = getEdicoes();
  const trilhaGerencial = getDestaque("trilha-gerencial");
  const agenda = getAgenda();
  const ctf = getCtf();
  const palestrantes = getPalestrantes();
  const ingressos = getIngressos();
  const beneficios = getBeneficios();
  const chamadas = getChamadas();
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

      <SkipLink href="#conteudo">{SKIP}</SkipLink>

      <NavBar
        items={navegacao.filter((item) => !item.noMenu)}
        action={
          <Button size="sm" href="#ingressos">
            {NAV_CTA}
          </Button>
        }
      />

      <main id="conteudo" className="flex-1">
        <Hero hero={hero} settings={settings} />

        {sections.ingressos ? <CountdownBar settings={settings} ingressos={ingressos} /> : null}

        {sections.fatos ? (
          <FactStrip
            facts={fatos.map((fato) => ({ value: fato.valor, label: fato.label }))}
            aria-label={FATOS_ARIA}
          />
        ) : null}

        <Greca tone="orange" />

        {sections.sobre ? (
          <EventoSection
            sobre={sobre}
            edicoes={edicoes}
            settings={settings}
            secao={secao("evento")}
            showEdicoes={sections.edicoes}
          />
        ) : null}

        {trilhaGerencial ? (
          <Section tight>
            <Container>
              <Reveal>
                <HighlightPanel
                  flag={trilhaGerencial.flag}
                  eyebrow={trilhaGerencial.eyebrow}
                  title={trilhaGerencial.titulo}
                >
                  {trilhaGerencial.texto}
                </HighlightPanel>
              </Reveal>
            </Container>
          </Section>
        ) : null}

        {sections.agenda ? (
          <ProgramacaoSection agenda={agenda} secao={secao("programacao")} />
        ) : null}

        {sections.ctf ? <CtfSection ctf={ctf} secao={secao("ctf")} /> : null}

        {sections.palestrantes ? (
          <PalestrantesSection palestrantes={palestrantes} secao={secao("palestrantes")} />
        ) : null}

        {sections.ingressos ? (
          <IngressosSection
            ingressos={ingressos}
            beneficios={beneficios}
            secao={secao("ingressos")}
          />
        ) : null}

        {sections.participe ? (
          <ParticipeSection chamadas={chamadas} secao={secao("participe")} settings={settings} />
        ) : null}

        <Greca tone="green" />

        {sections.patrocinio ? (
          <PatrocinioSection
            grupos={gruposPatrocinio}
            secao={secao("patrocinio")}
            kit={secao("patrocinio-kit")}
          />
        ) : null}

        <Greca tone="green" />

        {sections.parceiros ? (
          <ParceirosSection parceiros={parceiros} secao={secao("parceiros")} />
        ) : null}

        {sections.local ? <LocalSection settings={settings} secao={secao("local")} /> : null}

        <Fechamento settings={settings} secao={secao("fechamento")} />
      </main>

      <SiteFooter settings={settings} equipe={equipe} />

      {sections.ingressos && cheapest !== null && lote ? (
        <Dock
          headline={`Lote ${lote.lote} · a partir de ${formatPrice(cheapest)}`}
          detail={`vendas até ${formatDate(lote.validThrough)}`}
          action={
            <Button size="sm" href="#ingressos">
              {DOCK_CTA}
            </Button>
          }
        />
      ) : null}
    </>
  );
}
