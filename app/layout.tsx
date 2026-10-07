import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const siteUrl = "https://portfolio-genesis-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Genesis Melo | Desenvolvedor Full Stack Júnior",
  description:
    "Desenvolvedor Full Stack Júnior com foco em backend, APIs e integrações. Node.js, TypeScript, NestJS, Python, Django, PostgreSQL, React e React Native.",
  alternates: { canonical: "/" },
  authors: [{ name: "Genesis Melo", url: siteUrl }],
  keywords: [
    "Desenvolvedor Full Stack Júnior",
    "Backend e APIs",
    "Python",
    "Node.js",
    "TypeScript",
    "React",
    "React Native",
    "chatbot com IA",
  ],
  openGraph: {
    title: "Genesis Melo | Desenvolvedor Full Stack Júnior",
    description:
      "Full Stack Júnior com foco em backend: APIs, integrações e aplicações web e mobile com Node.js, TypeScript, NestJS, Python, React e PostgreSQL.",
    url: siteUrl,
    siteName: "Genesis Melo — Portfólio",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genesis Melo | Desenvolvedor Full Stack Júnior",
    description:
      "Full Stack Júnior com foco em backend: APIs, integrações e aplicações web e mobile com Node.js, TypeScript, NestJS, Python, React e PostgreSQL.",
  },
};

// Dados estruturados (schema.org) para buscadores
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Genesis Melo",
  jobTitle: "Desenvolvedor Full Stack Júnior",
  url: siteUrl,
  image: `${siteUrl}/genesis-melo.jpg`,
  sameAs: ["https://www.linkedin.com/in/genesis-melo/", "https://github.com/7Genesis"],
  knowsAbout: [
    "NestJS",
    "PostgreSQL",
    "Redis",
    "Python",
    "Django",
    "Node.js",
    "TypeScript",
    "APIs REST",
    "React",
    "React Native",
    "Chatbots com IA",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${instrumentSerif.variable} font-sans`}>
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
