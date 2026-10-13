# Portfólio Genesis Melo: direção de arte e handoff

## Estado verificável

- Arquivo editável no Figma: https://www.figma.com/design/bstv66i5H3G24VYL8BX8oy
- Páginas: storyboard do SAAE e protótipo de cinco cenas; homepage desktop; homepage responsiva com frames de 390, 768 e 1280 px.
- O Figma contém 17 variáveis de cor, espaçamento e raio na coleção `Genesis Portfolio / Semantic` e cinco estilos de texto.
- As cinco cenas usam capturas reais do aplicativo. Os botões foram conectados às cenas seguintes por Smart Animate de 450 ms. A reprodução final dessas interações ainda precisa de inspeção visual no Figma.
- O componente `AppProof` no site foi atualizado com as cinco capturas, rolagem vertical natural, imagem sticky no desktop e cenas em fluxo normal no mobile. A renderização local ainda precisa ser validada: o processo Next e a checagem TypeScript ficaram sem resposta neste ambiente.

## Diagnóstico

O site atual apresenta projetos e experiência com conteúdo factual, mas a linguagem visual de editor/IDE ocupa espaço de destaque que poderia mostrar os produtos. O projeto do SAAE tinha uma prova visual pequena diante da amplitude do app. A proposta passa a mostrar o produto real primeiro, com explicações concisas sobre o problema e a engenharia. Isso é particularmente importante para recrutadores e clientes que percorrem a página rapidamente.

As capturas fornecidas são do aplicativo móvel SAAE Juazeiro. A ordem que comunica melhor o uso é: **Início → Faturas → Serviços → Atendimento → Chat**. As capturas de Serviços em sequência representam partes da mesma lista, portanto uma tela é suficiente para o primeiro percurso. Notícias, interrupções e notificações estão vazias nas capturas e acrescentariam pouco à história principal. A tela de configurações contém CPF, matrícula, telefone e e-mail; a de chamados mostra protocolos. Elas não foram usadas nem copiadas para o portfólio público.

## Direção visual

- Base azul profundo para o produto SAAE, ciano contido como acento e superfícies claras para texto e pausas entre projetos.
- Tipografia Inter para informação e títulos de interface, com destaque editorial pontual em serifa; texto sempre legível sobre fundo sólido ou de contraste suficiente.
- Moldura de telefone discreta, captura real proporcional, sem perspectiva agressiva que torne a UI ilegível.
- A seção de engenharia usa diagrama textual curto para mostrar fluxo de processamento. Evitar alegar métricas, clientes ou funcionalidades não comprovadas.
- A seção de contato encerra a narrativa com links diretos e chamada objetiva.

## Storyboard do scroll vertical para implementação

| Cena | Visual principal | Texto | Estado de entrada |
| --- | --- | --- | --- |
| 1 | Início | Um lugar para os serviços do cidadão | Opacidade 0→1, deslocamento vertical até 20 px |
| 2 | Faturas | Consulte a situação das contas | Captura anterior reduz escala até 0,96 e perde opacidade; seguinte aparece |
| 3 | Serviços | Abra uma solicitação | Mesmo dispositivo e enquadramento, troca gradual de imagem |
| 4 | Atendimento | Escolha o canal certo | Acento de fundo muda discretamente, sem blur na captura |
| 5 | Chat | A conversa continua | Dispositivo se estabiliza, surgem links para o projeto |

Um `position: sticky` deve manter o dispositivo visível dentro da seção do case; cada cena textual ocupa cerca de uma viewport e determina o progresso. Não bloquear a rolagem do documento. `scroll-snap-type: y proximity` pode ajudar a parar perto de uma cena, mas deve ser omitido caso crie saltos em touchpads ou leitores de tela. Em mobile, a apresentação vira uma sequência de cenas no fluxo normal, com imagem grande e transições discretas.

Os estados de Figma demonstram a ordem e a intenção visual. Smart Animate por clique não simula progresso contínuo de scroll. No navegador, interpolar apenas `transform` e `opacity` das camadas, com transições curtas, e trocar o conteúdo acessível no início de cada cena estável. Blur é opcional e deve ficar restrito a camadas decorativas estáticas.

## Implementação sugerida na stack existente

O projeto usa Next.js 16.2.10 e React 19.2.4; GSAP já consta nas dependências. Não há motivo para instalar outra biblioteca de motion. Começar com CSS sticky e `IntersectionObserver` para saber qual cena está ativa. Para interpolação contínua, avaliar CSS scroll-driven animations nos navegadores alvo; manter fallback que mostra cenas completas sem animação. GSAP ScrollTrigger só se a combinação CSS + observer não oferecer a continuidade visual esperada.

O componente deve isolar estado da cena, texto e fontes das imagens em uma estrutura de dados única. As imagens devem manter dimensões e usar `next/image`, evitando deslocamento de layout. Não processar o evento `scroll` a cada frame para medir posições. Usar `IntersectionObserver` para estados e, se o progresso contínuo for essencial, uma única medição agendada por `requestAnimationFrame` durante a seção visível.

`prefers-reduced-motion: reduce` deve exibir a cena sem parallax, fades demorados ou movimento automático. Todos os links e controles precisam de foco visível, labels acessíveis e ordem de tabulação previsível. A imagem não substitui a descrição textual da funcionalidade. Evitar carrossel automático.

## Componentes e estados para finalizar no Figma

- Navegação: padrão, hover, foco e menu mobile.
- Botão principal/secundário: padrão, hover, foco, desabilitado.
- Cartão de projeto: capa, resumo, tecnologias, link e variação mobile.
- Moldura de dispositivo: smartphone e desktop.
- Indicador de cena: atual, anterior e próxima.
- Item de trajetória: marco, cargo, empresa e período.

Esses componentes precisam ser materializados como componentes/variantes com Auto Layout em uma próxima edição do arquivo. A cota de chamadas da integração Figma Starter foi atingida após a criação do protótipo. As variáveis e estilos de texto já estão no arquivo.

## Critérios de revisão antes da publicação

1. Conferir no Figma se os cinco botões navegam na ordem certa e se o texto mobile não se sobrepõe.
2. Abrir o site em 390, 768, 1280 e 1440 px; conferir hierarquia, corte das capturas, foco e toque.
3. Medir LCP, CLS e INP após implementar a seção sticky; verificar principalmente aparelhos móveis reais.
4. Confirmar autorização para exibir marca e imagens institucionais em portfolio público.
5. Manter fora dos assets públicos CPF, telefone, e-mail, matrícula e números de protocolo.
