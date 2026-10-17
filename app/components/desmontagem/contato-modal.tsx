"use client";

import { useRef, useState } from "react";
import { EMAIL, WHATSAPP, WHATSAPP_NUMBER } from "./content";
import { useModal } from "./use-modal";

type Props = { open: boolean; onClose: () => void };

const ASSUNTOS = ["Vaga de emprego", "Projeto ou freelance", "Só quero conversar"];

/**
 * Janela de conversa. Um chat de verdade com resposta ao vivo exigiria a API oficial do WhatsApp (servidor, token e custo);
 * aqui a conversa é montada na janela e segue para o WhatsApp do Genesis com o texto pronto. Nada é enviado a servidor.
 */
export function ContatoModal({ open, onClose }: Props) {
  const boxRef = useRef<HTMLFormElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [nome, setNome] = useState("");
  const [assunto, setAssunto] = useState(ASSUNTOS[0]);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState(false);
  useModal(open, onClose, boxRef, textRef);

  const montar = () => {
    const quem = nome.trim() ? `Olá Genesis, aqui é ${nome.trim()}.` : "Olá Genesis!";
    return `${quem} Vim pelo seu portfólio. Assunto: ${assunto}.\n\n${texto.trim()}`;
  };
  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) {
      setErro(true);
      textRef.current?.focus();
      return;
    }
    const url = `${WHATSAPP}?text=${encodeURIComponent(montar())}`;
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = url;
    onClose();
  };
  const tab = open ? 0 : -1;

  return (
    <div
      className={`dm-cvm${open ? " on" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Conversar com Genesis Melo"
      aria-hidden={!open}
      inert={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="dm-cvbox dm-pop" ref={boxRef} onSubmit={enviar} noValidate>
        <div className="dm-cvhead">
          <span>Conversar · WhatsApp</span>
          <button className="dm-b" type="button" onClick={onClose} tabIndex={tab}>
            Fechar ✕
          </button>
        </div>
        <div className="dm-popbody dm-chat">
          <div className="dm-bubble">Oi! Eu sou o Genesis. Sobre o que você quer falar?</div>
          <div className="dm-quick" role="group" aria-label="Assunto">
            {ASSUNTOS.map((a) => (
              <button key={a} type="button" className={a === assunto ? "on" : undefined} aria-pressed={a === assunto} onClick={() => setAssunto(a)} tabIndex={tab}>
                {a}
              </button>
            ))}
          </div>
          <label className="dm-field">
            Seu nome (opcional)
            <input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" placeholder="Como posso te chamar?" tabIndex={tab} />
          </label>
          <label className="dm-field">
            Sua mensagem
            <textarea
              ref={textRef}
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
                setErro(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) enviar(e);
              }}
              rows={4}
              placeholder="Escreva aqui."
              aria-invalid={erro}
              aria-describedby="dm-msg-hint"
              tabIndex={tab}
            />
          </label>
          <p id="dm-msg-hint" className={`dm-hint${erro ? " err" : ""}`}>
            {erro ? "Escreva uma mensagem para continuar." : "Ao enviar, o WhatsApp abre com o texto pronto e você confirma o envio por lá."}
          </p>
          <div className="dm-btns">
            <button className="dm-b dm-p" type="submit" tabIndex={tab}>
              Enviar pelo WhatsApp
            </button>
            <a className="dm-b" href={`${WHATSAPP}?text=${encodeURIComponent("Olá Genesis! Vim pelo seu portfólio.")}`} target="_blank" rel="noopener noreferrer" tabIndex={tab} data-n={WHATSAPP_NUMBER}>
              Abrir WhatsApp direto
            </a>
            <a className="dm-b" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Contato pelo portfólio")}`} tabIndex={tab}>
              Prefiro e-mail
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
