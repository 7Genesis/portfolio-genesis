# Portfólio Genesis Melo

Meu portfólio de desenvolvedor Backend e Full Stack: https://portfolio-genesis-one.vercel.app

A home é uma página em que um MacBook e um iPhone em 3D se desmontam conforme a rolagem, e cada etapa mostra uma parte do meu trabalho: perfil, LeadFlow Engine, SAAE (atendimento e app), sites entregues, dados e qualidade, experiência e contato. Serve para recrutadores e clientes percorrerem projetos, repositórios e contatos em um só lugar. Os textos de experiência e projetos são os mesmos do meu LinkedIn: https://www.linkedin.com/in/genesis-melo/

## Páginas

| Rota | O que é |
| --- | --- |
| `/` | Experiência de desmontagem em 3D, com 8 capítulos, e uma versão simples sem 3D |
| `/anatomia` | Explorador 3D do MacBook Pro: gire, aproxime e abra o notebook peça por peça |
| `/classico` | Versão clássica do portfólio, fora do índice dos buscadores (`noindex`) e sem link a partir da home |

## Stack

**Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS 4**, **three.js 0.160** e **GSAP** (com `@gsap/react` e ScrollTrigger).

## Decisões técnicas

- **Duas versões da home.** A cena 3D só roda onde compensa. A versão simples (HTML, sem 3D) entra quando a tela tem menos de 860 px, o navegador não tem WebGL, o usuário prefere menos movimento (`prefers-reduced-motion`), o aparelho informa 2 ou menos núcleos ou 2 GB ou menos de memória, ou o modo de economia de dados está ativo. Se a cena falhar ao carregar, a página cai sozinha para a versão simples. Dá para forçar com `/?modo=simples` ou `/?modo=3d`. Motivo: o conteúdo precisa ficar legível e leve em celular e em aparelho fraco, e o 3D é um acréscimo.
- **three.js em pacote separado.** A cena é carregada com `dynamic(..., { ssr: false })` e `import()`, então quem usa a versão simples não baixa three.js nem os modelos. A cena libera geometrias, texturas, renderer e listeners ao desmontar.
- **Progresso da rolagem suavizado.** A posição da rolagem vira um alvo de 0 a 1, e a animação o acompanha com amortecimento exponencial dependente do tempo (`damp`), que dá o mesmo movimento em telas de 60 Hz e de 120 Hz. A rolagem do documento nunca é bloqueada, só lida. Motivo: manter rolagem nativa (teclado, toque, barra) em vez de um scroll customizado.
- **Custo de render controlado.** O `devicePixelRatio` é limitado a 1,75 (1,25 em tela estreita), o laço de animação é pausado quando a aba fica oculta ou a cena sai da tela, e as texturas das telas dos aparelhos são desenhadas em `CanvasTexture`, sem vídeo.
- **Modelos compactados.** Os `.glb` em `public/desmontagem/modelos/` (cerca de 2,1 MB e 2,8 MB) usam compressão Meshopt, decodificada com `MeshoptDecoder`.
- **GSAP onde há animação por tween.** Ele cuida das revelações de seção da página `/classico` (com ScrollTrigger) e das animações do explorador `/anatomia`. A desmontagem da home não depende dele: ela é dirigida pela rolagem e pelo laço de render do three.js.
- **Páginas estáticas.** Todas as rotas são pré-renderizadas (`next build` as marca como estáticas), o que combina com o deploy na Vercel.

## Rodar localmente

Requer Node.js 20.9 ou superior (exigência do Next.js 16).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run start    # serve o build
```

Lint: use `npx eslint .`. O script `npm run lint` chama `next eslint`, comando que não existe no Next.js 16.2.10, e por isso falha.

## Testes

O projeto não tem testes automatizados. A checagem hoje é `npm run build` (compila e verifica os tipos) e conferência visual no navegador.

## Estrutura

```
app/page.tsx                    home: monta a experiência de desmontagem
app/components/desmontagem/     cena 3D (scene.ts), conteúdo dos capítulos (content.ts),
                                telas dos aparelhos (screens.ts), versão simples e modais
app/anatomia/ e components/anatomia/   explorador 3D do MacBook
app/classico/                   versão clássica
app/layout.tsx                  metadados (Open Graph, Twitter) e dados estruturados (schema.org)
app/robots.ts, sitemap.ts       SEO
public/desmontagem/             modelos .glb e capturas de tela dos projetos
public/curriculo/               currículo em PDF
docs/                           notas de design e handoff
```

## Créditos dos modelos 3D

MacBook Pro M3 16 inch 2024 (jackbaeten) e iPhone 17 Pro (Ranguel), do Sketchfab, sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Os créditos completos também aparecem no rodapé do site. Apple, MacBook e iPhone são marcas da Apple Inc.; o projeto não tem vínculo com a Apple.

## Deploy

Cada commit na branch `main` é publicado automaticamente pela Vercel.

## Licença

MIT. Veja [LICENSE](LICENSE).
