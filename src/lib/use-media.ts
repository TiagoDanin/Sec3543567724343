"use client";

import { useSyncExternalStore } from "react";

// Um store por consulta, compartilhado entre todos os componentes que a usam.
// O snapshot precisa ser estável entre renders — `matchMedia().matches` lido
// direto já é, porque o objeto MediaQueryList é o mesmo e só muda no evento.
const stores = new Map<string, MediaQueryList>();

function lista(query: string) {
  let mql = stores.get(query);
  if (!mql) {
    mql = window.matchMedia(query);
    stores.set(query, mql);
  }
  return mql;
}

/**
 * Casamento de media query, com o servidor respondendo o valor de `noServidor`.
 *
 * Existe para decidir **o que montar**, não o que mostrar: esconder por classe
 * ainda paga hidratação e estado de cliente. Quando o custo é só de pintura,
 * a variante `max-[900px]:hidden` do Tailwind continua sendo o caminho certo.
 *
 * `useSyncExternalStore` é a via sancionada para isso: o React usa o snapshot
 * de servidor na hidratação e re-renderiza depois, sem erro de divergência.
 */
export function useMediaQuery(query: string, noServidor = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = lista(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => lista(query).matches,
    () => noServidor,
  );
}

/** O ponto em que a página deixa de ser uma coluna de celular. */
export const DESKTOP = "(min-width: 901px)";

/**
 * `true` no desktop. O servidor responde `true` de propósito: o HTML estático
 * nasce com a composição larga, e o celular tira o que não cabe no primeiro
 * quadro de cliente — nunca o contrário, que faria o desktop piscar sem peça.
 */
export const useDesktop = () => useMediaQuery(DESKTOP, true);
