import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_CONFIG } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: "JCNI – Jéssica Campos Negócios Imobiliários",
    template: "%s | JCNI",
  },
  description: SITE_CONFIG.shortDescription,
  openGraph: {
    title: "JCNI – Jéssica Campos Negócios Imobiliários",
    description: SITE_CONFIG.shortDescription,
    url: SITE_CONFIG.siteUrl,
    siteName: "JCNI – Jéssica Campos Negócios Imobiliários",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
