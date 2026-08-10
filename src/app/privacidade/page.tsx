import { BotaoOposicao } from "@/components/analytics/BotaoOposicao";
import { SkipLink } from "@/components/primitives/SkipLink";
import { Section } from "@/components/primitives/Section";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { NavBar } from "@/components/layout/NavBar";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { HighlightPanel } from "@/components/primitives/HighlightPanel";

import { markdownDaRota } from "@/lib/docs";
import { buildShellFs } from "@/lib/shell-fs";
import { alvoCompraDeOutraRota } from "@/lib/links";
import { pageMetadata } from "@/lib/site";
import type { SectionKey } from "@/lib/cms";
import { formatDate, getEquipe, getNavegacao, getPrivacidade, getSettings } from "@/lib/cms";

const SKIP = "Pular para o conteúdo";
const NAV_CTA = "Ingressos";
const ATUALIZADO = "Atualizado em";

export const metadata = pageMetadata({
  title: "Privacidade",
  description:
    "O site do XibéSec mede audiência com base em legítimo interesse, sem publicidade e sem perfil de usuário — e deixa desligar a medição a qualquer momento. O quiz roda no navegador: nome e foto não saem do aparelho.",
  path: "/privacidade",
  markdown: markdownDaRota("/privacidade"),
});

export default function PrivacidadePage() {
  const settings = getSettings();
  const privacidade = getPrivacidade();
  const navegacao = getNavegacao();
  const equipe = getEquipe();
  const { sections } = settings;
  const compra = alvoCompraDeOutraRota(settings);

  return (
    <>
      <SkipLink href="#conteudo">{SKIP}</SkipLink>

      <NavBar
        items={navegacao.filter(
          (item) => !item.noMenu && (!item.secao || sections[item.secao as SectionKey] === true),
        )}
        action={
          <Button size="sm" {...compra} href={compra.href}>
            {NAV_CTA}
          </Button>
        }
      />

      <main id="conteudo" className="flex-1">
        <Section className="pt-[calc(var(--sec-y)+64px)]">
          <Container className="max-w-[860px]">
            <h1 className="font-display text-cream text-[clamp(30px,6vw,56px)] leading-[1.04] tracking-[-0.02em] text-balance uppercase">
              {privacidade.titulo}
            </h1>

            {privacidade.atualizadoEm ? (
              <p className="text-cream-3 mt-4 font-mono text-[12px] tracking-[0.08em]">
                {ATUALIZADO} {formatDate(privacidade.atualizadoEm)}
              </p>
            ) : null}

            {privacidade.lede ? (
              <p className="text-cream-2 mt-6 max-w-[68ch] text-[17px] leading-[1.65]">
                {privacidade.lede}
              </p>
            ) : null}

            <HighlightPanel title={privacidade.destaque.titulo} className="mt-10">
              {privacidade.destaque.texto}
            </HighlightPanel>

            {privacidade.blocos.map((bloco) => (
              <section key={bloco.titulo} className="mt-11">
                <h2 className="font-display text-cream text-[clamp(19px,2.4vw,25px)] leading-[1.15] tracking-[-0.01em] uppercase">
                  {bloco.titulo}
                </h2>
                <p className="text-cream-2 mt-3.5 max-w-[70ch] text-[15px] leading-[1.75]">
                  {bloco.texto}
                </p>
              </section>
            ))}

            {privacidade.oposicao.titulo ? (
              <section className="border-line-2 mt-14 border-t pt-11">
                <h2 className="font-display text-cream text-[clamp(19px,2.4vw,25px)] leading-[1.15] tracking-[-0.01em] uppercase">
                  {privacidade.oposicao.titulo}
                </h2>
                <p className="text-cream-2 mt-3.5 max-w-[70ch] text-[15px] leading-[1.75]">
                  {privacidade.oposicao.texto}
                </p>
                <BotaoOposicao
                  botaoDesligar={privacidade.oposicao.botaoDesligar}
                  botaoLigar={privacidade.oposicao.botaoLigar}
                  estadoDesligado={privacidade.oposicao.estadoDesligado}
                />
              </section>
            ) : null}
          </Container>
        </Section>
      </main>

      <SiteFooter settings={settings} equipe={equipe} shellFs={buildShellFs()} />
    </>
  );
}
