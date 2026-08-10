import { SkipLink } from "@/components/primitives/SkipLink";
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

      {/* O cabeçalho mora no fluxo, e não aqui, porque encolhe no resultado. */}
      <main id="conteudo" className="flex-1">
        <QuizFlow
          quiz={quiz}
          dominio={site.siteUrl.replace(/^https?:\/\//, "")}
          ctaHref={compra.href}
          ctaTarget={compra.target}
          ctaRel={compra.rel}
        />
      </main>

      <SiteFooter settings={settings} equipe={equipe} shellFs={buildShellFs()} />
    </>
  );
}
