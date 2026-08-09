// Normalização do nome que a pessoa digita para entrar na carta.

/**
 * Partículas que pertencem ao sobrenome seguinte, não são nome próprio. Sem
 * elas, "José da Silva" viraria "José Silva" e "Maria de Lourdes" perderia o
 * "de", que é como a pessoa escreve o próprio nome.
 */
const PARTICULAS = new Set([
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "di",
  "du",
  "del",
  "der",
  "van",
  "von",
  "la",
  "le",
]);

function capitalizar(palavra: string): string {
  const minuscula = palavra.toLocaleLowerCase("pt-BR");
  if (PARTICULAS.has(minuscula)) return minuscula;

  // Hífen e apóstrofo separam nomes compostos: "Jean-Pierre", "D'Ávila".
  return minuscula.replace(
    /(^|[-'])(\p{L})/gu,
    (_, antes: string, letra: string) => antes + letra.toLocaleUpperCase("pt-BR"),
  );
}

/**
 * "tiago danin" e "TIAGO DANIN" viram "Tiago Danin"; a partir de três nomes,
 * o do meio sai e ficam o primeiro e o último ("Tiago Jatahy Danin" → "Tiago
 * Danin"), que é o que cabe na carta sem encolher a tipografia.
 *
 * A partícula anda junto do sobrenome que ela acompanha, então "José da Silva
 * Filho" devolve "José Filho", não "José da Filho".
 */
export function normalizarNome(bruto: string): string {
  const partes = bruto.trim().split(/\s+/).filter(Boolean).map(capitalizar);
  if (partes.length === 0) return "";

  const significativos = partes.filter((parte) => !PARTICULAS.has(parte));
  if (significativos.length <= 2) return partes.join(" ");

  const primeiro = partes[0];
  const ultimo = significativos[significativos.length - 1];
  const inicioDoUltimo = partes.lastIndexOf(ultimo);

  // A partícula imediatamente anterior faz parte do sobrenome: "de Lourdes".
  const comParticula =
    inicioDoUltimo > 0 && PARTICULAS.has(partes[inicioDoUltimo - 1])
      ? `${partes[inicioDoUltimo - 1]} ${ultimo}`
      : ultimo;

  return primeiro === comParticula ? primeiro : `${primeiro} ${comParticula}`;
}
