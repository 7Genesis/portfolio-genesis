# Redesign imersivo do portfólio

## Objetivo

Reorganizar o portfólio de Genesis Melo em uma apresentação imersiva, inspirada na navegação por capítulos e nos cenários 3D de [Hubtown](https://hubtown.co.in/). A página deve ajudar recrutadores e clientes a percorrer sistemas, sites e repositórios, e a entender rapidamente o que foi desenvolvido.

## Direção aprovada

- A composição atual pode mudar por completo.
- A referência visual é a experiência narrativa da Hubtown: capítulos em tela cheia, indicação clara de progresso e navegação direta entre etapas.
- A resposta anterior sobre preservar o layout foi substituída pela autorização explícita para alterar a composição.
- Preservar apenas fatos, links e texto já existentes no portfólio, com a correção atual da seção Sobre.
- Não usar travessões ou emojis no conteúdo visível.
- O pedido anterior de interação em tempo real significa resposta imediata a cursor, teclado ou toque na própria página. Não implica sincronização automática com GitHub ou serviços externos.

## Abordagens consideradas

1. Reconstruir todos os capítulos e cenários em WebGL. Oferece máxima liberdade visual, com custo alto de carregamento, implementação e acessibilidade.
2. Fazer uma página convencional e acrescentar pequenos efeitos Three.js. Tem menor risco técnico, mas não acompanha a referência imersiva aprovada.
3. Usar capítulos HTML acessíveis como estrutura, com uma cena Three.js focada na exploração dos projetos e transições leves por CSS. Esta opção mantém a leitura, oferece movimento 3D onde agrega valor e permite uma experiência utilizável sem WebGL. É a recomendação.

## Estrutura proposta

1. **Abertura**: apresentação de Genesis Melo, especialidade e ações de contato, sobre a mídia hero já existente.
2. **Sistemas e produtos**: aplicações e sistemas do SAAE, MeetPoint, LeadFlow Engine e StockFlow.
3. **Sites publicados**: navegação pelos cinco sites e páginas já listados no código.
4. **Repositórios**: projetos públicos do GitHub com tecnologia, resumo e link direto.
5. **Sobre e experiência**: resumo revisado, experiência, formação, cursos e métricas existentes.
6. **Contato**: WhatsApp, LinkedIn e e-mail já configurados.

Uma navegação persistente indica o capítulo atual e permite saltar diretamente entre capítulos. A exploração de sistemas, sites e repositórios destaca o item selecionado e atualiza seu título, descrição, tecnologias e destino sem recarregar a página. Para projetos públicos, o destino é o link já confirmado no portfólio. Itens de código privado continuam identificados como privados.

## Arquitetura e interação

- Preservar Next.js App Router e a estrutura de conteúdo server-rendered sempre que possível.
- Tratar cada capítulo como markup semântico normal; manter os textos e links disponíveis sem depender da inicialização WebGL.
- Usar Three.js em um componente cliente isolado para criar uma composição abstrata de módulos e conexões associadas aos grupos de projetos. O foco visual é a seleção imediata de categorias e projetos, não reproduzir os prédios da referência.
- Manter seleção equivalente por botões HTML, teclado e toque. O ponteiro pode realçar projetos e mover levemente a câmera ou a composição, sem prender a rolagem vertical.
- Respeitar `prefers-reduced-motion`; desativar animações contínuas e manter os controles funcionais.
- Em falha de WebGL, renderizar a mesma seleção HTML com um fundo estático. Não fazer chamadas ao GitHub ou incorporar sites externos em iframes.
- Adaptar o menu lateral a uma barra compacta em telas menores. A navegação móvel usa rolagem e toque normais, sem exigir arrasto horizontal.

## Dados e integridade

- Usar os dados, descrições, métricas e URLs existentes em `app/page.tsx` e seus componentes.
- Não inventar imagens de produto, estado de publicação, métricas, tecnologias ou funcionalidades.
- As demonstrações e os sites abrem no endereço público existente em nova aba.
- O conteúdo do site continua em português brasileiro.

## Arquivos e escopo provável

- Reorganizar `app/page.tsx` em capítulos semânticos e conectar os conjuntos de projetos já definidos.
- Ajustar `app/components/nav.tsx` para navegação e estado de capítulo sem remover acessibilidade por teclado.
- Substituir `app/components/constellation.tsx` por uma cena de exploração focada em projetos, mantendo sua fronteira cliente isolada.
- Atualizar `app/globals.css` somente para o sistema visual e os comportamentos de capítulo necessários.
- Acrescentar Three.js e tipos de desenvolvimento apenas se a instalação ainda não estiver presente.
- Preservar `app/components/about.tsx`, incluindo a revisão da seção Sobre, salvo mudanças estritamente necessárias para integrá-la.
- Não publicar, fazer deploy ou alterar os repositórios públicos nesta etapa.

## Verificação e riscos

- Conferir tipos, lint dos arquivos tocados e build de produção.
- Conferir no navegador local a abertura, troca entre capítulos, seleção de sistemas, sites e repositórios, navegação por teclado, responsividade e o fallback sem WebGL quando viável.
- Não executar uma suíte de testes automatizados sem pedido explícito.
- O principal risco é custo de GPU, memória e carregamento da cena. Limitar a geometria, renderização contínua e resolução do canvas; parar a animação fora da viewport e em `prefers-reduced-motion`.
- A referência inclui mídia e efeitos proprietários. Reproduzir somente a linguagem de capítulos, enquadramento, progresso e exploração 3D; não copiar marca, imagens ou código.
