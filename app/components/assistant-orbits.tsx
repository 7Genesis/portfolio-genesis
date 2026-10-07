'use client';

export default function AssistantOrbits() {
  return (
    <div className="portfolio-ide__screensaver" role="group" aria-label="Marcas animadas de Claude e Codex">
      <span className="portfolio-ide__screensaver-mark portfolio-ide__screensaver-mark--claude" role="img" aria-label="Claude">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.5v7M16 21.5v7M3.5 16h7M21.5 16h7M7.15 7.15l4.95 4.95m7.8 7.8 4.95 4.95m0-17.7-4.95 4.95m-7.8 7.8-4.95 4.95" /></svg>
      </span>
      <span className="portfolio-ide__screensaver-mark portfolio-ide__screensaver-mark--codex" role="img" aria-label="Codex">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="m11 8-8 8 8 8M21 8l8 8-8 8M18 5l-4 22" /></svg>
      </span>
    </div>
  );
}
