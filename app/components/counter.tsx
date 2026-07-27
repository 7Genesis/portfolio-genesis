'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Formata como número brasileiro (milhar com ".", decimal com ","). */
  locale?: boolean;
  duration?: number;
  className?: string;
}

export default function Counter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  locale = true,
  duration = 2,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) => {
    const fixed = n.toFixed(decimals);
    if (!locale) return fixed;
    return Number(fixed).toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const obj = { val: 0 };
        node.textContent = `${prefix}${format(0)}${suffix}`;

        gsap.to(obj, {
          val: value,
          duration,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 90%',
            once: true,
          },
          onUpdate: () => {
            node.textContent = `${prefix}${format(obj.val)}${suffix}`;
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(value)}
      {suffix}
    </span>
  );
}
