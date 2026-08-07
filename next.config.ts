import type { NextConfig } from "next";

// Vazio em produção (domínio próprio xibesec.com.br). Só é preenchido quando o
// site é publicado sob um subcaminho, como em preview de repositório de projeto.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  // Fixa a raiz do workspace: existe um yarn.lock no diretório pai.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
