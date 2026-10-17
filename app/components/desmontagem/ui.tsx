"use client";

import type { Action, ModalName } from "./content";

type Props = {
  action: Action;
  onModal: (m: ModalName) => void;
  onGoto?: (chapter: number) => void;
};

/** Botão/link de ação: abre uma janela, rola até um capítulo ou segue o link. */
export function ActionLink({ action: a, onModal, onGoto }: Props) {
  const cls = `dm-b${a.primary ? " dm-p" : ""}`;
  const m = a.modal;
  if (m) {
    if (!a.href) {
      return (
        <button type="button" className={cls} onClick={() => onModal(m)}>
          {a.label}
        </button>
      );
    }
    return (
      <a
        className={cls}
        href={a.href}
        onClick={(e) => {
          e.preventDefault();
          onModal(m);
        }}
      >
        {a.label}
      </a>
    );
  }
  if (a.goto !== undefined) {
    const to = a.goto;
    return (
      <button type="button" className={cls} onClick={() => onGoto?.(to)}>
        {a.label}
      </button>
    );
  }
  const external = !!a.href && a.href.startsWith("http");
  return (
    <a className={cls} href={a.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
      {a.label}
    </a>
  );
}
