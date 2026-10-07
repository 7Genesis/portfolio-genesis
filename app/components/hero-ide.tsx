'use client';

import { useState } from 'react';

const FILES = [
  {
    id: 'controller',
    name: 'leads.controller.ts',
    path: 'src / leads',
    code: `import { Controller, Post, Body } from '@nestjs/common';
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

export interface CreateLeadDto {
  name: string;
  email: string;
  phone?: string;
  source?: string;
  status?: string;
  priority?: number;
}

@Controller('leads')
export class LeadsController {
  constructor(
    @InjectQueue('lead-queue') private readonly leadsQueue: Queue,
  ) {}

  @Post('webhook')
  async receiveWebhook(@Body() data: CreateLeadDto) {
    await this.leadsQueue.add('process-lead', data);
    return { success: true, message: 'Lead na fila de processamento.' };
  }
}`,
  },
  {
    id: 'service',
    name: 'leads.service.ts',
    path: 'src / leads',
    code: `const MAX_TENTATIVAS = 6;
const ESPERA_MS = 15;

async processAndAssignLead(dto: CreateLeadDto) {
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    const resultado = await this.tentarAtribuir(dto);
    if (resultado) return resultado;
    await new Promise((r) => setTimeout(r, ESPERA_MS * tentativa));
  }
  throw new Error('Vendedores ocupados, tente novamente.');
}

private async tentarAtribuir(dto: CreateLeadDto) {
  return await this.prisma.db.$transaction(async (tx) => {
    const users = await tx.$queryRaw<Vendedor[]>\`
      SELECT id, name
      FROM "User"
      WHERE "isActive" = true
      ORDER BY "lastAssignedLeadAt" ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    \`;

    if (!users || users.length === 0) {
      const ativos = await tx.user.count({ where: { isActive: true } });
      if (ativos === 0) {
        throw new Error('Nenhum vendedor ativo encontrado.');
      }
      return null;
    }

    const selectedUser = users[0];
    const newLead = await tx.lead.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone || '',
        source: dto.source || '',
        priority: dto.priority || 1,
        status: 'Assigned',
        userId: selectedUser.id,
      },
    });

    await tx.user.update({
      where: { id: selectedUser.id },
      data: { lastAssignedLeadAt: new Date() },
    });

    return { lead: newLead, user: selectedUser };
  });
}`,
  },
  {
    id: 'bootstrap',
    name: 'main.ts',
    path: 'src',
    code: `import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Ativa a validação global de dados de entrada
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  await app.listen(3000);
}

bootstrap();`,
  },
];

const TOKEN = /(?:\/\/.*|\/\*[\s\S]*?\*\/|'[^']*'|"[^"]*"|`[^`]*`|\b(?:import|from|export|interface|type|class|async|await|return|private|public|readonly|constructor|new|throw|for|let|const|if|true|false)\b|\b\d+\b|\b[A-Z][A-Za-z0-9_]*\b)/g;

function highlight(line: string) {
  return line.split(TOKEN).filter((part) => part !== undefined && part !== '').map((part, index) => {
    let tone = '';
    if (part.startsWith('//') || part.startsWith('/*')) tone = 'hero-ide__token--comment';
    else if (/^[`'"]/.test(part)) tone = 'hero-ide__token--string';
    else if (/^\d+$/.test(part)) tone = 'hero-ide__token--number';
    else if (/^(?:import|from|export|interface|type|class|async|await|return|private|public|readonly|constructor|new|throw|for|let|const|if|true|false)$/.test(part)) tone = 'hero-ide__token--keyword';
    else if (/^[A-Z]/.test(part)) tone = 'hero-ide__token--type';
    return tone ? <span className={tone} key={index + '-' + part}>{part}</span> : part;
  });
}

export default function HeroIde() {
  const [activeId, setActiveId] = useState('controller');
  const activeFile = FILES.find((file) => file.id === activeId) ?? FILES[0];

  return (
    <section className="hero-ide" aria-label="Prévia interativa do código do LeadFlow Engine">
      <header className="hero-ide__titlebar">
        <div className="hero-ide__window-controls" aria-hidden="true"><i /><i /><i /></div>
        <span>leadflow-engine — Visual Studio Code</span>
        <a className="hero-ide__titlebar-end" href="https://github.com/7Genesis/leadflow-engine" target="_blank" rel="noreferrer" aria-label="Abrir o repositório LeadFlow Engine no GitHub">↗</a>
      </header>

      <div className="hero-ide__workspace">
        <aside className="hero-ide__activity" aria-hidden="true">
          <span className="hero-ide__activity-icon hero-ide__activity-icon--active">▤</span>
          <span className="hero-ide__activity-icon">⌕</span>
          <span className="hero-ide__activity-icon">⑂</span>
          <span className="hero-ide__activity-spacer" />
          <span className="hero-ide__activity-icon">⚙</span>
        </aside>

        <aside className="hero-ide__explorer" aria-label="Arquivos do projeto">
          <div className="hero-ide__explorer-heading">EXPLORADOR</div>
          <div className="hero-ide__project-name"><span>⌄</span> LEADFLOW-ENGINE</div>
          <div className="hero-ide__folder"><span>⌄</span> src</div>
          <div className="hero-ide__folder hero-ide__folder--nested"><span>⌄</span> leads</div>
          {FILES.filter((file) => file.id !== 'bootstrap').map((file) => (
            <button key={file.id} type="button" onClick={() => setActiveId(file.id)} className={'hero-ide__file' + (activeId === file.id ? ' is-active' : '')} aria-label={'Abrir ' + file.name}>
              <span className="hero-ide__ts-icon">TS</span>{file.name}
            </button>
          ))}
          <button type="button" onClick={() => setActiveId('bootstrap')} className={'hero-ide__file hero-ide__file--root' + (activeId === 'bootstrap' ? ' is-active' : '')} aria-label="Abrir main.ts">
            <span className="hero-ide__ts-icon">TS</span>main.ts
          </button>
        </aside>

        <div className="hero-ide__editor">
          <div className="hero-ide__tabs" aria-label="Arquivos abertos">
            {FILES.map((file) => (
              <button key={file.id} type="button" aria-pressed={activeId === file.id} onClick={() => setActiveId(file.id)} className={'hero-ide__tab' + (activeId === file.id ? ' is-active' : '')}>
                <span className="hero-ide__ts-icon">TS</span>{file.name}<span className="hero-ide__tab-close" aria-hidden="true">×</span>
              </button>
            ))}
          </div>

          <div className="hero-ide__breadcrumbs">{activeFile.path.split(' / ').map((part, index) => <span key={part + index}>{part}</span>)}<span>›</span><strong>{activeFile.name}</strong></div>

          <div className="hero-ide__code" role="tabpanel" aria-label={'Conteúdo de ' + activeFile.name}>
            <pre>{activeFile.code.split('\n').map((line, index) => (
              <span className="hero-ide__line" key={activeFile.id + '-' + index}><span className="hero-ide__line-number">{index + 1}</span><code>{highlight(line) || ' '}</code></span>
            ))}</pre>
          </div>

          <div className="hero-ide__terminal">
            <div className="hero-ide__terminal-head"><span>PROBLEMAS</span><span>SAÍDA</span><strong>TERMINAL · EXEMPLO</strong><span className="hero-ide__terminal-more">···</span></div>
            <div className="hero-ide__terminal-body">
              <span><b>$</b> curl -X POST localhost:3000/leads/webhook</span>
              <span className="hero-ide__terminal-muted">{"{\"name\":\"Ana\",\"email\":\"ana@empresa.com\"}"}</span>
              <span className="hero-ide__terminal-response"><i>›</i> {"{\"success\":true,\"message\":\"Lead na fila de processamento.\"}"}</span>
            </div>
          </div>

          <footer className="hero-ide__status"><span>⎇ main</span><span>TypeScript</span><span>UTF-8</span><span>LF</span></footer>
        </div>
      </div>
    </section>
  );
}
