# Portfólio — Genesis Melo

Meu portfólio de desenvolvedor Full Stack: https://portfolio-genesis-one.vercel.app

Feito com **Next.js 16** (App Router), **React 19**, **TypeScript** e **Tailwind CSS 4**. As animações de rolagem usam **GSAP** (ScrollTrigger), e o hero é um vídeo dirigido pela rolagem.

## Estrutura

```
app/page.tsx                 seções: projetos, skills, experiência, GitHub e contato
app/layout.tsx               metadados (Open Graph, Twitter) e dados estruturados (schema.org)
app/opengraph-image.png      imagem de compartilhamento (1200x630)
app/robots.ts, sitemap.ts    SEO
app/components/              hero (scroll-stage), sobre, constelação de skills, animações
public/                      vídeos e pôsteres do hero, retrato
```

Os textos de experiência e projetos são os mesmos do meu LinkedIn: https://www.linkedin.com/in/genesis-melo/

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run lint
```

## Deploy

Cada commit na branch `main` é publicado automaticamente pela Vercel.
