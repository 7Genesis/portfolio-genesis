import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fontes auto-hospedadas (mesma abordagem da referência): sem request ao Google no carregamento.
const bigShoulders = localFont({
  src: "./fonts/big-shoulders-display.woff2",
  variable: "--font-big-shoulders",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono.woff2",
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = "https://portfolio-genesis-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Genesis Melo | Desenvolvedor Full Stack",
  description:
    "Desenvolvedor Full Stack. Chatbots com IA, apps mobile, automações e sistemas sob medida em Python, Node.js, TypeScript e React.",
  alternates: { canonical: "/" },
  authors: [{ name: "Genesis Melo", url: siteUrl }],
  keywords: [
    "Desenvolvedor Full Stack",
    "Python",
    "Node.js",
    "TypeScript",
    "React",
    "React Native",
    "chatbot com IA",
  ],
  openGraph: {
    title: "Genesis Melo | Desenvolvedor Full Stack",
    description:
      "Chatbots com IA, apps mobile, automações e sistemas sob medida em Python, Node.js, TypeScript e React.",
    url: siteUrl,
    siteName: "Genesis Melo — Portfólio",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genesis Melo | Desenvolvedor Full Stack",
    description:
      "Chatbots com IA, apps mobile, automações e sistemas sob medida em Python, Node.js, TypeScript e React.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Genesis Melo",
  jobTitle: "Desenvolvedor Full Stack",
  url: siteUrl,
  image: `${siteUrl}/genesis-melo.jpg`,
  sameAs: ["https://www.linkedin.com/in/genesis-melo/", "https://github.com/7Genesis"],
  knowsAbout: [
    "Python",
    "Django",
    "Node.js",
    "TypeScript",
    "React",
    "React Native",
    "PostgreSQL",
    "Chatbots com IA",
  ],
};

// Contrato de direção (seed REF-GABRIELRICHARD-BRIEF-PINNED) registrado como nó de texto
// dentro de <script type="text/plain"> — React remove comentários JSX do HTML emitido.
const DIRECTION_CONTRACT = `THESIS: o portfolio vira uma cidade noturna navegavel por secoes; recusa o scroll editorial padrao.
OWN-WORLD: synthwave geometrico — violeta profundo, janelas ambar, Big Shoulders gigante + JetBrains Mono, conteudo como codigo numerado, menu lateral 01-07.
STORY: o visitante entende em segundos quem e Genesis, navega como num jogo e chama no WhatsApp ou baixa o curriculo.
FIRST VIEWPORT: cidade vista do morro; a direita, "Ola, eu sou GENESIS MELO" gigante, cargo em accent, stack, CTA de curriculo.
FORM: navegador de secoes estilo jogo, brief fixado pela referencia gabrielrichard.dev, com correcoes de scroll pedidas pelo usuario.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${bigShoulders.variable} ${jetbrainsMono.variable}`}>
        <script type="text/plain" data-direction-contract="REF-GABRIELRICHARD-BRIEF-PINNED">
          {DIRECTION_CONTRACT}
        </script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
