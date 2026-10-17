import Desmontagem from "./components/desmontagem/desmontagem";
import { barlow, plexMono } from "./components/desmontagem/fonts";

export default function Home() {
  return (
    <Desmontagem
      className={`${barlow.variable} ${plexMono.variable}`}
      fonts={{ sans: barlow.style.fontFamily, mono: plexMono.style.fontFamily }}
    />
  );
}
