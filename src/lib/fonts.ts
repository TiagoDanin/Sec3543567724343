import { Archivo, Archivo_Black, JetBrains_Mono } from "next/font/google";

// Archivo Black existe só no peso 400; o 700 aciona o negrito sintético do
// navegador, que é como o protótipo aprovado renderiza. Ver DESIGN.md.
export const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const fontVariables = [archivo.variable, archivoBlack.variable, jetbrainsMono.variable].join(
  " ",
);
