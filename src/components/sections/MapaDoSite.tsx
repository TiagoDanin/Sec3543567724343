import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionTitle } from "@/components/primitives/SectionHeader";

// Rótulos de coluna: rotulagem de dado, como a dos documentos em Markdown.
const COL_PAGINA = "Página";
const COL_ENDERECO = "Endereço";
const COL_MARKDOWN = "Markdown";
const SEM_MARKDOWN = "—";

export type LinhaDeRota = {
  rotulo: string;
  href: string;
  resumo: string;
  /** Espelho da rota em Markdown, quando o build gera um. */
  markdown: string | null;
};

export type LinhaDeArquivo = {
  path: string;
  resumo: string;
};

export type MapaDoSiteProps = {
  titulo: string;
  eyebrow: string;
  lede: string;
  paginas: LinhaDeRota[];
  arquivosTitulo: string;
  arquivos: LinhaDeArquivo[];
};

/**
 * O mapa do site em HTML: as páginas publicadas e os arquivos que o build
 * escreve para máquina. É a leitura humana do `sitemap.xml` — e o link interno
 * que as rotas fora do menu não teriam de outro jeito.
 */
export function MapaDoSite({
  titulo,
  eyebrow,
  lede,
  paginas,
  arquivosTitulo,
  arquivos,
}: MapaDoSiteProps) {
  return (
    <>
      {/* O topo é o mesmo do quiz: a folga da barra fixa vem do `main`. */}
      <Section className="pt-0 pb-(--sec-y-tight)">
        <Container>
          <p className="text-orange font-mono text-[11px] tracking-[0.24em] uppercase">{eyebrow}</p>

          <h1 className="font-display text-cream mt-5 max-w-4xl text-[clamp(30px,6vw,60px)] leading-[1.02] tracking-[-0.02em] text-balance uppercase">
            {titulo}
          </h1>

          <p className="text-cream-2 mt-6 mb-[clamp(30px,5vw,64px)] max-w-2xl text-[17px] leading-[1.65]">
            {lede}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="text-cream-3 font-mono text-[11px] tracking-[0.2em] uppercase">
                  <th scope="col" className="border-line border-b pb-3">
                    {COL_PAGINA}
                  </th>
                  <th scope="col" className="border-line border-b pb-3">
                    {COL_ENDERECO}
                  </th>
                  <th scope="col" className="border-line border-b pb-3">
                    {COL_MARKDOWN}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginas.map((rota) => (
                  <tr key={rota.href} className="border-line-2 border-b align-top">
                    <td className="py-4 pr-6">
                      <a
                        href={rota.href}
                        className="text-cream hover:text-orange text-[17px] transition-colors duration-200"
                      >
                        {rota.rotulo}
                      </a>
                      {rota.resumo ? (
                        <p className="text-cream-3 mt-1 max-w-[52ch] text-[14px] leading-[1.6]">
                          {rota.resumo}
                        </p>
                      ) : null}
                    </td>
                    <td className="py-4 pr-6 font-mono text-[13px]">
                      <a
                        href={rota.href}
                        className="text-mint hover:text-orange transition-colors duration-200"
                      >
                        {rota.href}
                      </a>
                    </td>
                    <td className="py-4 font-mono text-[13px]">
                      {rota.markdown ? (
                        <a
                          href={rota.markdown}
                          className="text-cream-2 hover:text-orange transition-colors duration-200"
                        >
                          {rota.markdown}
                        </a>
                      ) : (
                        <span className="text-cream-3">{SEM_MARKDOWN}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section variant="panel" tight>
        <Container>
          <SectionTitle size="md" as="h2">
            {arquivosTitulo}
          </SectionTitle>

          <ul className="mt-7 grid gap-px sm:grid-cols-2">
            {arquivos.map((arquivo) => (
              <li key={arquivo.path} className="border-line border px-5 py-4">
                <a
                  href={arquivo.path}
                  className="text-mint hover:text-orange font-mono text-[13px] transition-colors duration-200"
                >
                  {arquivo.path}
                </a>
                <p className="text-cream-3 mt-1.5 text-[14px] leading-[1.55]">{arquivo.resumo}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
