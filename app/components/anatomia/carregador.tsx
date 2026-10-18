"use client";

import dynamic from "next/dynamic";

// o explorador (three.js e gsap) fica em pacote separado e só é baixado nesta página
const Anatomia = dynamic(() => import("./anatomia"), {
  ssr: false,
  loading: () => (
    <main
      role="status"
      style={{ display: "grid", placeItems: "center", height: "100dvh", background: "#07080c", color: "#9aa3c7", font: "500 13px monospace", letterSpacing: "0.14em", textTransform: "uppercase" }}
    >
      Montando o MacBook…
    </main>
  ),
});

export default function Carregador() {
  return <Anatomia />;
}
