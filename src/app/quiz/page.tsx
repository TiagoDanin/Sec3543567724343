import { SkipLink } from "@/components/primitives/SkipLink";
import { Button } from "@/components/primitives/Button";
import { NavBar } from "@/components/layout/NavBar";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { ArquetiposIndex } from "@/components/quiz/ArquetiposIndex";
import { QuizFlow } from "@/components/quiz/QuizFlow";

import { markdownDaRota } from "@/lib/docs";
import { buildShellFs } from "@/lib/shell-fs";
import { alvoCompraDeOutraRota } from "@/lib/links";
import { SchemaMarkup, generateBreadcrumbs, quizSchema } from "@/lib/schema";
import { canonicalUrl, pageMetadata, site } from "@/lib/site";
import type { SectionKey } from "@/lib/cms";
import { getEquipe, getNavegacao, getQuiz, getSettings } from "@/lib/cms";

const SKIP = "Pular para o conteúdo";
const NAV_CTA = "Ingressos";
const HOME_LABEL = "Início";

const quiz = getQuiz();

// Contados, não escritos: descrição que promete "sete perguntas" vira mentira
// no dia em que alguém acrescenta a oitava.
const DESCRICAO = `${quiz.perguntas.length} perguntas para descobrir seu arquétipo em segurança da informação e seu time na roda de cores — red, blue, purple, yellow, orange e white. São ${quiz.arquetipos.length} resultados possíveis, e no fim uma carta pronta para compartilhar.`;

export const metadata = pageMetadata({
  title: "Que tipo de hacker você é? · Quiz",
  description: DESCRICAO,
  path: "/quiz",
  markdown: markdownDaRota("/quiz"),
});

export default function QuizPage() {
  const settings = getSettings();
  const navegacao = getNavegacao();
  const equipe = getEquipe();
  const { sections } = settings;
  const compra = alvoCompraDeOutraRota(settings);

  const schema = [
    quizSchema({
      titulo: quiz.copy.titulo,
      descricao: DESCRICAO,
      listaTitulo: quiz.copy.indiceTitulo,
      arquetipos: quiz.arquetipos,
    }),
    generateBreadcrumbs([
      { name: HOME_LABEL, url: canonicalUrl("/") },
      { name: quiz.copy.titulo, url: canonicalUrl("/quiz") },
    ]),
  ];

  return (
    <>
      <SchemaMarkup schema={schema} />

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

        <ArquetiposIndex
          titulo={quiz.copy.indiceTitulo}
          lede={quiz.copy.indiceLede}
          arquetipos={quiz.arquetipos}
        />
      </main>

      <SiteFooter settings={settings} equipe={equipe} shellFs={buildShellFs()} />
    </>
  );
}
