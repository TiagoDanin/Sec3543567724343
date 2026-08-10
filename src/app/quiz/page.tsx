import { SkipLink } from "@/components/primitives/SkipLink";
import { Section } from "@/components/primitives/Section";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { NavBar } from "@/components/layout/NavBar";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { QuizFlow } from "@/components/quiz/QuizFlow";

import { buildShellFs } from "@/lib/shell-fs";
import { alvoCompra } from "@/lib/links";
import { pageMetadata, site } from "@/lib/site";
import type { SectionKey } from "@/lib/cms";
import { getEquipe, getNavegacao, getQuiz, getSettings } from "@/lib/cms";

const SKIP = "Pular para o conteúdo";
const NAV_CTA = "Ingressos";

export const metadata = pageMetadata({
  title: "Que tipo de hacker você é? · Quiz",
  description:
    "Sete perguntas para descobrir seu arquétipo em segurança da informação e seu time na roda de cores — red, blue, purple e os demais. No fim, uma carta pronta para compartilhar.",
  path: "/quiz",
});

export default function QuizPage() {
  const settings = getSettings();
  const quiz = getQuiz();
  const navegacao = getNavegacao();
  const equipe = getEquipe();
  const { sections } = settings;
  const compra = alvoCompra(settings);

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
        <Section className="pt-(--nav-h) pb-(--sec-y-tight)">
          <Container>
            <p className="text-orange font-mono text-[11px] tracking-[0.24em] uppercase">
              {quiz.copy.eyebrow}
            </p>
            <h1 className="font-display text-cream mt-5 max-w-4xl text-[clamp(30px,6vw,60px)] leading-[1.02] tracking-[-0.02em] text-balance uppercase">
              {quiz.copy.titulo}
            </h1>
            <p className="text-cream-2 mt-6 max-w-2xl text-[17px] leading-[1.65]">
              {quiz.copy.lede}
            </p>

            <noscript>
              <div className="border-orange bg-panel mt-9 max-w-2xl border-l-2 px-5 py-4">
                <p className="text-orange font-mono text-[10px] tracking-[0.2em] uppercase">
                  {quiz.copy.semJsTitulo}
                </p>
                <p className="text-cream-2 mt-2 text-[15px] leading-[1.6]">
                  {quiz.copy.semJsTexto}
                </p>
              </div>
            </noscript>
          </Container>
        </Section>

        <Section variant="panel">
          <Container>
            <QuizFlow
              quiz={quiz}
              dominio={site.siteUrl.replace(/^https?:\/\//, "")}
              ctaHref={compra.href}
              ctaTarget={compra.target}
              ctaRel={compra.rel}
            />
          </Container>
        </Section>
      </main>

      <SiteFooter settings={settings} equipe={equipe} shellFs={buildShellFs()} />
    </>
  );
}
