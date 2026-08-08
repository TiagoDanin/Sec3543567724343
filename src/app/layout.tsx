import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { site, absoluteUrl, asset } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.siteName} · ${site.siteTagline}`,
    template: `%s | ${site.siteName}`,
  },
  description: site.siteDescription,
  keywords: [...site.keywords],
  authors: [{ name: site.organizationName, url: site.organizationUrl }],
  creator: site.organizationName,
  publisher: site.organizationName,
  alternates: { canonical: absoluteUrl("/") },
  icons: {
    icon: [{ url: asset("/favicon.svg"), type: "image/svg+xml" }],
    apple: asset("/images/marca/logo-xibesec.png"),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
