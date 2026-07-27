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

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-genesis-one.vercel.app"),
  title: "Genesis Melo | Desenvolvedor Full Stack",
  description:
    "Desenvolvedor Full Stack — APIs escaláveis e seguras em Node.js, TypeScript e PostgreSQL, interfaces modernas com Next.js e integrações com IA.",
  openGraph: {
    title: "Genesis Melo | Desenvolvedor Full Stack",
    description:
      "Construo APIs escaláveis, interfaces modernas e integrações com IA, com foco em arquitetura em camadas e alta performance.",
    url: "https://portfolio-genesis-one.vercel.app",
    siteName: "Genesis Melo — Portfólio",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${instrumentSerif.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}