'use client';

import { useState } from 'react';

const etapas = [
  {
    titulo: 'WhatsApp',
    evento: 'O morador inicia o atendimento pelo canal que já usa.',
    detalhe: 'Entrada do atendimento',
  },
  {
    titulo: 'Django',
    evento: 'A conversa segue pelo atendimento automatizado em Python.',
    detalhe: 'Integração de backend',
  },
  {
    titulo: 'Consulta ao GSAN',
    evento: 'A consulta busca informações e ajuda a evitar solicitações duplicadas.',
    detalhe: 'Integração com o sistema comercial',
  },
  {
    titulo: 'Equipe',
    evento: 'Quando precisa de uma pessoa, a equipe assume com o contexto da conversa.',
    detalhe: 'Transferência para atendimento humano',
  },
];

export default function FluxoAtendimento() {
  const [etapaAtiva, definirEtapaAtiva] = useState(2);
  const etapa = etapas[etapaAtiva];

  return (
    <section className="fluxo-atendimento" aria-labelledby="fluxo-atendimento-titulo">
      <header className="fluxo-atendimento__cabecalho">
        <div>
          <span className="fluxo-atendimento__sobretitulo">PRODUTO REAL · SAAE JUAZEIRO</span>
          <h2 id="fluxo-atendimento-titulo">Uma conversa.<br /><i>Um fluxo inteiro.</i></h2>
        </div>
        <span className="fluxo-atendimento__estado"><i aria-hidden="true" /> EM USO</span>
      </header>

      <ol className="fluxo-atendimento__etapas" aria-label="Etapas do atendimento">
        {etapas.map((item, indice) => (
          <li key={item.titulo}>
            <button
              className={indice === etapaAtiva ? 'fluxo-atendimento__etapa esta-ativa' : 'fluxo-atendimento__etapa'}
              type="button"
              aria-current={indice === etapaAtiva ? 'step' : undefined}
              aria-controls="fluxo-atendimento-detalhe"
              onClick={() => definirEtapaAtiva(indice)}
            >
              <span className="fluxo-atendimento__numero">0{indice + 1}</span>
              <span className="fluxo-atendimento__nome">{item.titulo}</span>
          <span className="fluxo-atendimento__marcador" aria-hidden="true">›</span>
            </button>
          </li>
        ))}
      </ol>

      <div key={etapaAtiva} className="fluxo-atendimento__detalhe" id="fluxo-atendimento-detalhe" aria-live="polite" aria-atomic="true">
        <div className="fluxo-atendimento__detalhe-cabecalho">
          <span><i aria-hidden="true">●</i> RASTRO DO ATENDIMENTO</span>
          <span>ETAPA 0{etapaAtiva + 1} / 04</span>
        </div>
        <p>{etapa.evento}</p>
        <small>{etapa.detalhe}</small>
      </div>

      <footer className="fluxo-atendimento__rodape">
        <span>Toque em uma etapa para acompanhar</span>
        <a href="#project-atendimento-saae">Ver o projeto <span aria-hidden="true">↗</span></a>
      </footer>
    </section>
  );
}
