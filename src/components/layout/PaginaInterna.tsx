import type { ReactNode } from "react";
import { SkipLink } from "@/components/primitives/SkipLink";
import { Button } from "@/components/primitives/Button";
import { NavBar } from "@/components/layout/NavBar";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { alvoCompraDeOutraRota } from "@/lib/links";
import { SchemaMarkup } from "@/lib/schema";
import { buildShellFs } from "@/lib/shell-fs";
import type { SectionKey } from "@/lib/cms";
import { getEquipe, getNavegacao, getSettings } from "@/lib/cms";

// Rótulos de navegação: interface, não conteúdo editorial.
const SKIP = "Pular para o conteúdo";
const NAV_CTA = "Ingressos";

export type PaginaInternaProps = {
  children: ReactNode;
  schema?: object | object[];
};

/**
 * Casca das rotas internas: barra, conteúdo e rodapé. A home não usa — lá o CTA
 * é medido e há o dock de ingressos.
 */
export function PaginaInterna({ children, schema }: PaginaInternaProps) {
  const settings = getSettings();
  const navegacao = getNavegacao();
  const equipe = getEquipe();
  const compra = alvoCompraDeOutraRota(settings);

  return (
    <>
      {schema ? <SchemaMarkup schema={schema} /> : null}

      <SkipLink href="#conteudo">{SKIP}</SkipLink>

      <NavBar
        items={navegacao.filter(
          (item) =>
            !item.noMenu && (!item.secao || settings.sections[item.secao as SectionKey] === true),
        )}
        action={
          <Button size="sm" {...compra} href={compra.href}>
            {NAV_CTA}
          </Button>
        }
      />

      {/* A barra é fixa: sem a folga do topo ela cobre o começo da primeira seção. */}
      <main id="conteudo" className="flex-1 pt-(--nav-h)">
        {children}
      </main>

      <SiteFooter settings={settings} equipe={equipe} shellFs={buildShellFs()} />
    </>
  );
}
