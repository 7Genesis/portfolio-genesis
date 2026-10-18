# DESIGN.md — Mundo visual "Cidade Noturna" (v1)

Registrado a partir do build executado (não de intenção). Contrato: REF-GABRIELRICHARD-BRIEF-PINNED
(no body como <script type="text/plain"> — React não emite comentários JSX).

## Direção
Portfólio-jogo em seções de tela cheia. Uma cidade synthwave geométrica (SVG, dados estáticos em
city-data.json gerados por scripts/gen-city.mjs a partir de city-engine.mjs) muda de ambiente por
seção, com um personagem flat (character.tsx) que muda de pose: parado no morro, andando na rua,
voando entre nuvens, andando à meia-noite, sentado digitando na mesa, de pé sob neon, sentado no
parapeito ao pôr do sol.

## Tokens
- Tipografia: Big Shoulders Display (display, auto-hospedada em app/fonts) + JetBrains Mono (corpo/código, auto-hospedada).
- Cores base: fundo #07060f; tinta #e6edf3; névoa #9aa4bf; acento #b9c6ff; CTA #c7d2fe (texto #0b0a1a).
- Sintaxe (blocos de código): kw #ff7b72 · string #a5d6ff · número #d2a8ff · prop #7ee787 · comentário #8b949e · gutter #5c6375.
- Céus por seção (sky 2-3 stops + lua/sol + halo): night violeta, street azul-âmbar, clouds roxo com nuvens, midnight azul-noite, neon magenta saturado, sunset laranja→roxo, room interior azul-índigo.

## Componentes
- game.tsx: palco fixo (≥1024px). Seções absolutas com crossfade 600ms + settle Ken Burns (scale 1.05→1 em 6s). Barras de frame: marca (topo-esq), menu lateral numerado (esq), dicas + progresso 0N/07 (rodapé).
- Navegação: wheel com acumulador (threshold 50, cooldown 650ms) = 1 gesto/1 seção; setas/PgUp/PgDn/Home/End/1-7/Esc mudam seção de verdade; painéis longos rolam por dentro (troca de seção só na borda); hash #secao sincronizado. Mobile (<lg): fluxo nativo empilhado, nav de âncoras 01–07 no rodapé, sem hijack.
- Parallax de mouse: --px/--py no svg da cena (só modo jogo).
- Layout de conteúdo: coluna direita max-w-xl, centralizada sem clipping (my-auto), scrim lateral funcional para legibilidade.
- Padrões: SectionHead (número + hairline + título display gigante), CodeBlock com numeração, StatBar (blocos), lista de projetos sem cards, contato estilo terminal, CTA periwinkle.

## Regras
- Zero dependência nova. Sem engine 3D; cenas e personagem são SVG geométrico determinístico.
- Zero aleatoriedade em runtime (SSR == cliente, sem hydration mismatch).
- prefers-reduced-motion: sem animações/parallax.
- Conteúdo real de Genesis Melo (PRODUCT.md); claims só com evidência.
