import { GoogleAnalytics } from "@next/third-parties/google";
import { GTAG_BOOTSTRAP, MEASUREMENT_ID } from "@/lib/analytics";

/**
 * Vem antes do `<GoogleAnalytics>`, que reaproveita a fila existente
 * (`window.dataLayer || []`) — é assim que a negativa de publicidade e a
 * oposição de quem já recusou chegam na frente do `config`. `<script>` nativo
 * porque `beforeInteractive` não vale fora do `_document`.
 */
export function ConsentBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: GTAG_BOOTSTRAP }} />;
}

export function Analytics() {
  return <GoogleAnalytics gaId={MEASUREMENT_ID} />;
}
