import Image from 'next/image';
import { ArrowUpRight } from './ui';

const landingPages = [
  {
    number: '01',
    client: 'Docctor Med',
    title: 'Jacarepaguá',
    category: 'Odontologia · SEO local',
    description: 'Uma página para apresentar tratamentos e levar o visitante ao agendamento da clínica.',
    href: 'https://docctormedjacarepagua.com.br/odontologia/',
    image: '/evidence/lp-docctor-jacarepagua.webp',
    alt: 'Captura da landing page de odontologia da Docctor Med em Jacarepaguá, com chamada para agendamento.',
    mark: 'RJ',
  },
  {
    number: '02',
    client: 'Docctor Med',
    title: 'Caxias do Sul',
    category: 'Odontologia · SEO local',
    description: 'A mesma proposta adaptada à unidade, à localização e ao contato local da clínica.',
    href: 'https://docctormedcaxiasdosul.com.br/odontologia/',
    image: '/evidence/lp-docctor-caxias.webp',
    alt: 'Captura da landing page de odontologia da Docctor Med em Caxias do Sul, com chamada para agendamento.',
    mark: 'RS',
  },
  {
    number: '03',
    client: 'StarFit',
    title: 'Transnordestina',
    category: 'Academia · página de vendas',
    description: 'Apresentação da unidade, planos e estrutura com chamadas para conhecer e iniciar a matrícula.',
    href: 'https://starfitpnz.com.br/transnordestina/',
    image: '/evidence/lp-starfit-transnordestina.webp',
    alt: 'Captura da página de vendas da unidade StarFit Transnordestina.',
    mark: 'PE',
  },
  {
    number: '04',
    client: 'NovaLab · ConectaLab',
    title: 'Chegou a sua hora de crescer',
    category: 'Programa · captação de contatos',
    description: 'Uma jornada gamificada apresentada por etapas, com materiais, conteúdos e chamadas para contato.',
    href: 'https://lp.novalab.me/conectalab/',
    image: '/evidence/lp-conectalab.webp',
    alt: 'Captura da landing page ConectaLab, programa de crescimento da NovaLab.',
    mark: 'NL',
  },
] as const;

export default function LandingGallery() {
  return (
    <section className="folio-lp-gallery" aria-labelledby="folio-lp-title">
      <div className="folio-lp-gallery__head">
        <div>
          <span className="folio-lp-gallery__eyebrow">WEB · AQUISIÇÃO · EXPERIÊNCIA</span>
          <h3 id="folio-lp-title">Landing pages<br /><i>que já estão no ar.</i></h3>
        </div>
        <p>Trabalhos para negócios reais, com a mensagem, o contexto local e o próximo passo à vista. Abra uma página para ver a experiência completa.</p>
      </div>

      <div className="folio-lp-grid">
        {landingPages.map((page) => (
          <a className="folio-lp-card" key={page.number} href={page.href} target="_blank" rel="noreferrer" aria-label={`Abrir a landing page ${page.client} — ${page.title}`}>
            <div className="folio-lp-card__screen">
              <Image src={page.image} alt={page.alt} width={960} height={576} sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 42vw" />
              <span className="folio-lp-card__index">LP · {page.number}</span>
              <span className="folio-lp-card__open">Abrir página <ArrowUpRight /></span>
            </div>
            <div className="folio-lp-card__body">
              <div className="folio-lp-card__meta"><span>{page.client}</span><span>{page.mark}</span></div>
              <h4>{page.title}</h4>
              <p>{page.description}</p>
              <div className="folio-lp-card__footer"><span>{page.category}</span><ArrowUpRight /></div>
            </div>
          </a>
        ))}
      </div>
      <p className="folio-lp-gallery__note">Capturas das páginas públicas consultadas em outubro de 2026. Os sites podem mudar com o tempo.</p>
    </section>
  );
}
