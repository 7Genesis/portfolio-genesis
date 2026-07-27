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
  title: "Genesis Melo | Engenheiro de Software & Growth",
  description: "Engenheiro de Software especializado em arquiteturas escaláveis (Node.js, Next.js) e Gestor de Tráfego focado em alavancagem de ROAS e eficiência operacional.",
  openGraph: {
    title: "Genesis Melo | Engenheiro de Software & Growth",
    description: "Construindo APIs robustas, arquiteturas escaláveis e estratégias orientadas a dados para alavancagem comercial.",
    url: "https://seusite.vercel.app", 
    siteName: "Genesis Melo Portfolio",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Genesis Melo - Engenheiro de Software & Growth",
      },
    ],
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