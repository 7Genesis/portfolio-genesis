import type { Metadata } from "next";
import Link from "next/link";
import Carregador from "../components/anatomia/carregador";
import { barlow, plexMono } from "../components/desmontagem/fonts";

export const metadata: Metadata = {
  title: "Anatomia do MacBook Pro com M1 Pro | Genesis Melo",
  description:
    "Modelo 3D interativo de um MacBook Pro com chip Apple M1 Pro: vista explodida, componentes internos, fluxo de dados, calor e energia.",
  alternates: { canonical: "/anatomia" },
};

export default function Page() {
  return (
    <div className={`${barlow.variable} ${plexMono.variable}`}>
      <Carregador />
      <noscript>
        <p style={{ padding: 24, color: "#eef1ff", background: "#07080c" }}>
          Esta página precisa de JavaScript para mostrar o modelo 3D. <Link href="/">Voltar ao portfólio</Link>.
        </p>
      </noscript>
    </div>
  );
}
