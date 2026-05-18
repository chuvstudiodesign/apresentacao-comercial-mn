"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { CommercialPresentation, CommercialSlide } from "@/data/commercial-presentations";
import { cn } from "@/lib/utils";

const CANVAS_W = 1600;
const CANVAS_H = 900;

type Rect = { x: number; y: number; width: number; height: number };
type SlideSnapshot = {
  groups: Record<string, Rect>;
  image?: Rect;
  texts: Record<string, string>;
};

// Snapshot exported from the visual editor — 2026-05-18
const SNAPSHOT: Record<string, SlideSnapshot> = {
  "quem-somos-masi-negocios-01": {
    groups: { main: { x: 90, y: 381, width: 702, height: 326 } },
    image: { x: 639.073, y: 25.36, width: 883.942, height: 736.856 },
    texts: { title: "Quem\nSomos", body: "Educação empresarial, aceleração e experiências para inovação, crescimento e resultados reais.", "bullet-0": "Educação", "bullet-1": "Aceleração", "bullet-2": "Experiências" },
  },
  "quem-somos-masi-negocios-02": {
    groups: { main: { x: 86, y: 202, width: 727.19, height: 520 } },
    texts: { title: "Crescimento que transforma", body: "A MASI existe para desenvolver empresários \ne construir empresas mais fortes.", quote: "O crescimento das empresas transforma pessoas, mercados e o país." },
  },
  "quem-somos-masi-negocios-03": {
    groups: { heading: { x: 90, y: 90, width: 421.45, height: 560 }, bullets: { x: 650, y: 567.58, width: 790, height: 210 } },
    image: { x: 607.764, y: 41.239, width: 858.489, height: 518.792 },
    texts: { title: "Hub de experiências", body: "A Masi conecta empresários a especialistas, mentores e outros empresários em evolução constante.", "bullet-0": "Mentorias", "bullet-1": "Workshops", "bullet-2": "Cursos", "bullet-3": "Eventos", "bullet-4": "Aceleração" },
  },
  "quem-somos-masi-negocios-04": {
    groups: { heading: { x: 90, y: 90, width: 421.45, height: 560 }, bullets: { x: 650, y: 570, width: 790, height: 210 } },
    texts: { title: "Empresários buscam evolução", body: "Crescer exige inovação, gestão, estratégia e acesso a conhecimento prático de quem já construiu.", "bullet-0": "Inovação", "bullet-1": "Gestão", "bullet-2": "Estratégia", "bullet-3": "Conhecimento prático" },
  },
  "quem-somos-masi-negocios-05": {
    groups: { heading: { x: 90, y: 90, width: 500, height: 560 }, bullets: { x: 650, y: 570, width: 790, height: 210 } },
    texts: { title: "O crescimento trava", body: "Empresas avançam até certo ponto, mas travam por falta de gestão, cultura, vendas, processos ou liderança.", "bullet-0": "Gestão", "bullet-1": "Cultura", "bullet-2": "Vendas", "bullet-3": "Processos", "bullet-4": "Liderança" },
  },
  "quem-somos-masi-negocios-06": {
    groups: { heading: { x: 90, y: 90, width: 500, height: 560 }, bullets: { x: 650, y: 570, width: 790, height: 210 } },
    image: { x: 560.634, y: 8.61, width: 897.16, height: 556.254 },
    texts: { title: "Destravar o próximo nível", body: "A Masi ajuda empresários a identificar gargalos e transformar conhecimento prático em crescimento sustentável.", "bullet-0": "Diagnóstico", "bullet-1": "Direção", "bullet-2": "Acompanhamento" },
  },
  "quem-somos-masi-negocios-07": {
    groups: { heading: { x: 90, y: 90, width: 580, height: 185 }, body: { x: 750, y: 102, width: 560, height: 120 }, cards: { x: 90, y: 305, width: 1420, height: 460 } },
    texts: { title: "Como atuamos", body: "Um sistema de experiências que combina conteúdo, prática, conexão e acompanhamento.", "card-title-0": "Programas presenciais", "card-description-0": "Encontros de imersão, aplicação e troca qualificada.", "card-title-1": "Programas online", "card-description-1": "Conteúdo estruturado para ampliar acesso e continuidade.", "card-title-2": "Mentorias e workshops", "card-description-2": "Direcionamento prático com especialistas e executivos.", "card-title-3": "Aceleração empresarial", "card-description-3": "Diagnóstico, acompanhamento e plano de crescimento." },
  },
  "quem-somos-masi-negocios-08": {
    groups: { heading: { x: 90, y: 90, width: 430, height: 380 }, cards: { x: 590, y: 90, width: 860, height: 560 } },
    texts: { title: "Conexões que aceleram", body: "Empresários crescem melhor quando acessam especialistas, mentores e pares que enfrentam desafios reais.", "card-title-0": "Especialistas", "card-description-0": "Profissionais com repertório aplicado em crescimento.", "card-title-1": "Mentores", "card-description-1": "Lideranças que já construíram, escalaram e operaram empresas.", "card-title-2": "Empresários", "card-description-2": "Pares que compartilham desafios, decisões e aprendizados." },
  },
  "quem-somos-masi-negocios-09": {
    groups: { main: { x: 86, y: 202, width: 608.761, height: 520 } },
    texts: { title: "Conhecimento que vem da prática", body: "A Masi conecta teoria útil a decisões, vendas, gestão, cultura e execução.", quote: "O conhecimento que transforma empresas nasce no jogo real da liderança." },
  },
  "quem-somos-masi-negocios-10": {
    groups: { heading: { x: 90, y: 90, width: 500, height: 560 }, bullets: { x: 650, y: 570, width: 790, height: 210 } },
    image: { x: 577.553, y: 18.278, width: 906.828, height: 633.595 },
    texts: { title: "Repertório de empresas que escalaram", body: "Especialistas com experiência em empresas como iFood, OLX, Sympla, PlayKids e outras referências de crescimento.", "bullet-0": "Experiência real", "bullet-1": "Diagnóstico estratégico", "bullet-2": "Decisão aplicada", "bullet-3": "Execução acompanhada" },
  },
  "quem-somos-masi-negocios-11": {
    groups: { heading: { x: 90, y: 90, width: 520, height: 420 }, stats: { x: 700, y: 90, width: 800, height: 520 } },
    texts: { title: "Impacto real", body: "Programas, mentorias, encontros e conteúdos práticos para empresas em busca de evolução.", "stat-value-0": "1000+", "stat-label-0": "empresários impactados", "stat-value-1": "Centenas", "stat-label-1": "empresas impactadas", "stat-value-2": "5", "stat-label-2": "formatos de experiência" },
  },
  "quem-somos-masi-negocios-12": {
    groups: { heading: { x: 90, y: 90, width: 430, height: 380 }, cards: { x: 590, y: 90, width: 860, height: 560 } },
    texts: { title: "Resultados que importam", body: "O foco é gerar crescimento sustentável, eficiência e visão estratégica de longo prazo.", "card-title-0": "Crescimento sustentável", "card-description-0": "Evolução com estrutura, método e ritmo.", "card-title-1": "Aumento de margem", "card-description-1": "Melhores decisões para proteger resultado.", "card-title-2": "Organização empresarial", "card-description-2": "Mais clareza em gestão, processos e prioridades.", "card-title-3": "Visão de longo prazo", "card-description-3": "Estratégia para construir empresas mais fortes." },
  },
  "quem-somos-masi-negocios-13": {
    groups: { main: { x: 86, y: 174, width: 498.429, height: 560 } },
    image: { x: 573.172, y: 7.613, width: 913.202, height: 808.64 },
    texts: { title: "Empresários não precisam crescer sozinhos", body: "Quando empresários se conectam, compartilham desafios e aprendizados, o crescimento fica mais rápido e estruturado.", quote: "Crescimento também é ecossistema." },
  },
  "quem-somos-masi-negocios-14": {
    groups: { heading: { x: 90, y: 90, width: 430, height: 380 }, cards: { x: 590, y: 90, width: 860, height: 560 } },
    texts: { title: "Um ecossistema em movimento", body: "A proposta é criar um ambiente onde empresários aprendem, trocam e geram oportunidades juntos.", "card-title-0": "Aprender", "card-description-0": "Acesso a conhecimento aplicado e direcionado.", "card-title-1": "Trocar", "card-description-1": "Compartilhar desafios, decisões e aprendizados.", "card-title-2": "Conectar", "card-description-2": "Criar relações qualificadas entre empresários.", "card-title-3": "Crescer", "card-description-3": "Transformar repertório em oportunidades reais." },
  },
  "quem-somos-masi-negocios-15": {
    groups: { heading: { x: 90, y: 90, width: 430, height: 380 }, cards: { x: 590, y: 90, width: 860, height: 560 } },
    texts: { title: "Onde ajudamos a evoluir", body: "A Masi atua nos temas que mais destravam o próximo nível de crescimento das empresas.", "card-title-0": "Gestão e estratégia", "card-description-0": "Direção clara, prioridades e tomada de decisão.", "card-title-1": "Vendas e marketing", "card-description-1": "Crescimento comercial com método e consistência.", "card-title-2": "Cultura e liderança", "card-description-2": "Times mais alinhados, responsáveis e preparados.", "card-title-3": "Inovação e processos", "card-description-3": "Eficiência, organização e visão de futuro." },
  },
  "quem-somos-masi-negocios-16": {
    groups: { main: { x: 86, y: 270, width: 707.492, height: 430 }, quote: { x: 1051.601, y: 432.417, width: 420, height: 220 } },
    texts: { title: "Construir empresas melhores para construir um país melhor", body: "Desenvolvemos empresários para construir empresas mais fortes, lucrativas e bem estruturadas.", quote: "O futuro do Brasil passa por empresas mais preparadas." },
  },
};

// ── Shared primitives ─────────────────────────────────────────────────────────

function FrozenFrame({ presentation, slide, children, dark = false }: {
  presentation: CommercialPresentation; slide: CommercialSlide; children: ReactNode; dark?: boolean;
}) {
  return (
    <section
      className={cn("relative h-full w-full overflow-hidden", dark ? "text-white" : "bg-[#ECECEC] text-black")}
      style={dark ? { background: `linear-gradient(135deg, ${presentation.darkAccent} 0%, #0C1C16 68%, #000000 100%)` } : undefined}
    >
      {children}
      <div className={cn("absolute bottom-[4.6%] left-[5.4%] right-[5.4%] z-20 flex items-center justify-between text-[13px] font-semibold uppercase tracking-[0.08em]", dark ? "text-white/42" : "text-black/38")}>
        <span>{slide.footer}</span>
        <span>{presentation.title}</span>
      </div>
    </section>
  );
}

function FrozenChrome({ presentation, slide, dark = false, largeLogo = false }: {
  presentation: CommercialPresentation; slide: CommercialSlide; dark?: boolean; largeLogo?: boolean;
}) {
  return (
    <div className="absolute left-[90px] right-[90px] top-[90px] z-30 flex items-start justify-between">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dark ? "/logos/primary/masi-primary-light.svg" : "/logos/primary/masi-primary-dark.svg"} alt="MASI" style={{ height: largeLogo ? 29 : 23, width: "auto" }} />
      <p className={cn("text-[15px] font-bold uppercase leading-none tracking-[0.08em]", dark ? "text-white/70" : "text-black/55")} style={{ color: dark ? "rgba(255,255,255,0.72)" : presentation.accent }}>
        {slide.eyebrow}
      </p>
    </div>
  );
}

function FrozenGroup({ snap, groupKey = "main", children, className }: {
  snap: SlideSnapshot; groupKey?: string; children: ReactNode; className?: string;
}) {
  const g = snap.groups[groupKey];
  if (!g) return null;
  return (
    <div className={cn("absolute z-20", className)} style={{ left: g.x, top: g.y, width: g.width, minHeight: g.height }}>
      {children}
    </div>
  );
}

function FrozenImage({ slide, snap }: { slide: CommercialSlide; snap: SlideSnapshot }) {
  if (!slide.imageSrc || !snap.image) return null;
  const { x, y, width, height } = snap.image;
  return (
    <div className="absolute z-10" style={{ left: x, top: y, width, height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slide.imageSrc.src} alt={slide.imageAlt ?? ""} className="h-full w-full object-contain" draggable={false} />
    </div>
  );
}

// ── Slide type renderers ──────────────────────────────────────────────────────

function FrozenCover({ presentation, slide, snap }: { presentation: CommercialPresentation; slide: CommercialSlide; snap: SlideSnapshot }) {
  return (
    <FrozenFrame presentation={presentation} slide={slide}>
      <FrozenChrome presentation={presentation} slide={slide} />
      <FrozenGroup snap={snap}>
        <div className="flex flex-col justify-end gap-[30px]">
          <div className="max-w-[17ch] text-[104px] font-extrabold leading-[0.84] tracking-normal whitespace-pre-wrap">{snap.texts.title}</div>
          <div className="max-w-[48ch] text-[22px] leading-[1.45] text-black/62 whitespace-pre-wrap">{snap.texts.body}</div>
          <div className="flex flex-wrap gap-[14px] pt-[2px]">
            {slide.bullets?.map((bullet, i) => (
              <span key={i} className="rounded-full bg-black px-[18px] py-[8px] text-[12px] font-bold uppercase tracking-[0.08em] text-white">
                {snap.texts[`bullet-${i}`] ?? bullet}
              </span>
            ))}
          </div>
        </div>
      </FrozenGroup>
      <FrozenImage slide={slide} snap={snap} />
    </FrozenFrame>
  );
}

function FrozenStatement({ presentation, slide, snap }: { presentation: CommercialPresentation; slide: CommercialSlide; snap: SlideSnapshot }) {
  const dark = slide.visual === "quote" || slide.visual === "dark";
  return (
    <FrozenFrame presentation={presentation} slide={slide} dark={dark}>
      {!slide.imageSrc && <FrozenChrome presentation={presentation} slide={slide} dark={dark} />}
      <FrozenGroup snap={snap}>
        <div className="flex flex-col gap-[32px]">
          {slide.imageSrc && <p className="text-[15px] font-bold uppercase leading-none tracking-[0.08em] text-white/70">{slide.eyebrow}</p>}
          <div className="max-w-[22ch] text-[68px] font-extrabold leading-[0.9] tracking-normal whitespace-pre-wrap">{snap.texts.quote || snap.texts.title}</div>
          <div className="h-[6px] w-[18%] rounded-full" style={{ background: presentation.accent }} />
          <div className={cn("max-w-[54ch] text-[22px] leading-[1.45] whitespace-pre-wrap", dark ? "text-white/72" : "text-black/62")}>{snap.texts.body}</div>
        </div>
      </FrozenGroup>
      <FrozenImage slide={slide} snap={snap} />
    </FrozenFrame>
  );
}

function FrozenSplit({ presentation, slide, snap }: { presentation: CommercialPresentation; slide: CommercialSlide; snap: SlideSnapshot }) {
  return (
    <FrozenFrame presentation={presentation} slide={slide}>
      <FrozenGroup snap={snap} groupKey="heading">
        <div className="flex min-h-[560px] flex-col justify-between">
          <p className="text-[15px] font-bold uppercase leading-none tracking-[0.08em]" style={{ color: presentation.accent }}>{slide.eyebrow}</p>
          <div className="flex flex-col gap-[39px]">
            <div className="max-w-[16ch] text-[53px] font-extrabold leading-[0.96] tracking-normal whitespace-pre-wrap">{snap.texts.title}</div>
            <div className="max-w-[42ch] text-[22px] leading-[1.45] text-black/62 whitespace-pre-wrap">{snap.texts.body}</div>
          </div>
        </div>
      </FrozenGroup>
      <FrozenGroup snap={snap} groupKey="bullets">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-[18px]">
          {slide.bullets?.map((bullet, i) => (
            <div key={i} className="rounded-[10px] bg-white p-[24px] shadow-[var(--shadow-card)]">
              <p className="mb-[18px] font-mono text-[15px] font-bold" style={{ color: presentation.accent }}>0{i + 1}</p>
              <div className="text-[16px] font-semibold leading-[1.2] text-black whitespace-pre-wrap">{snap.texts[`bullet-${i}`] ?? bullet}</div>
            </div>
          ))}
        </div>
      </FrozenGroup>
      <FrozenImage slide={slide} snap={snap} />
    </FrozenFrame>
  );
}

function FrozenFramework({ presentation, slide, snap }: { presentation: CommercialPresentation; slide: CommercialSlide; snap: SlideSnapshot }) {
  return (
    <FrozenFrame presentation={presentation} slide={slide}>
      <FrozenGroup snap={snap} groupKey="heading">
        <p className="text-[15px] font-bold uppercase leading-none tracking-[0.08em]" style={{ color: presentation.accent }}>{slide.eyebrow}</p>
        <div className="mt-[22px] max-w-[17ch] text-[53px] font-extrabold leading-[0.96] tracking-normal whitespace-pre-wrap">{snap.texts.title}</div>
      </FrozenGroup>
      <FrozenGroup snap={snap} groupKey="body">
        <div className="max-w-[45ch] pt-[1%] text-[22px] leading-[1.45] text-black/62 whitespace-pre-wrap">{snap.texts.body}</div>
      </FrozenGroup>
      <FrozenGroup snap={snap} groupKey="cards">
        <div className="grid grid-cols-2 grid-rows-2 gap-[22px]">
          {slide.cards?.map((card, i) => (
            <div key={i} className="relative min-h-[205px] overflow-hidden rounded-[10px] bg-white p-[28px] shadow-[var(--shadow-card)]">
              <p className="font-mono text-[15px] font-bold" style={{ color: presentation.accent }}>0{i + 1}</p>
              <div className="mt-[28px] text-[28px] font-extrabold leading-[1] tracking-normal text-black whitespace-pre-wrap">{snap.texts[`card-title-${i}`] ?? card.title}</div>
              <div className="mt-[16px] max-w-[32ch] text-[15px] leading-[1.28] text-black/58 whitespace-pre-wrap">{snap.texts[`card-description-${i}`] ?? card.description}</div>
            </div>
          ))}
        </div>
      </FrozenGroup>
    </FrozenFrame>
  );
}

function FrozenCards({ presentation, slide, snap }: { presentation: CommercialPresentation; slide: CommercialSlide; snap: SlideSnapshot }) {
  return (
    <FrozenFrame presentation={presentation} slide={slide}>
      <FrozenGroup snap={snap} groupKey="heading">
        <div className="flex flex-col gap-[34px]">
          <p className="text-[15px] font-bold uppercase leading-none tracking-[0.08em]" style={{ color: presentation.accent }}>{slide.eyebrow}</p>
          <div className="max-w-[13ch] text-[53px] font-extrabold leading-[0.96] tracking-normal whitespace-pre-wrap">{snap.texts.title}</div>
          <div className="max-w-[42ch] text-[22px] leading-[1.45] text-black/62 whitespace-pre-wrap">{snap.texts.body}</div>
        </div>
      </FrozenGroup>
      <FrozenGroup snap={snap} groupKey="cards">
        <div className="grid grid-cols-2 gap-[18px]">
          {slide.cards?.map((card, i) => (
            <div key={i} className="relative min-h-[230px] overflow-hidden rounded-[10px] bg-white p-[28px] shadow-[var(--shadow-card)]">
              <div className="mb-[32px] flex h-[48px] w-[48px] items-center justify-center rounded-full font-mono text-[15px] font-bold text-black" style={{ background: i === 0 ? presentation.accent : "#ECECEC" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mb-[16px] text-[23px] font-bold leading-[1.08] tracking-normal text-black whitespace-pre-wrap">{snap.texts[`card-title-${i}`] ?? card.title}</div>
              <div className="text-[15px] leading-[1.35] text-black/58 whitespace-pre-wrap">{snap.texts[`card-description-${i}`] ?? card.description}</div>
            </div>
          ))}
        </div>
      </FrozenGroup>
    </FrozenFrame>
  );
}

function FrozenStats({ presentation, slide, snap }: { presentation: CommercialPresentation; slide: CommercialSlide; snap: SlideSnapshot }) {
  const dark = slide.type === "risks";
  return (
    <FrozenFrame presentation={presentation} slide={slide} dark={dark}>
      <FrozenGroup snap={snap} groupKey="heading">
        <div className="flex flex-col gap-[38px]">
          <p className={cn("text-[15px] font-bold uppercase leading-none tracking-[0.08em]", dark ? "text-white/70" : "text-black/55")} style={{ color: dark ? undefined : presentation.accent }}>{slide.eyebrow}</p>
          <div className="max-w-[12ch] text-[53px] font-extrabold leading-[0.96] tracking-normal whitespace-pre-wrap">{snap.texts.title}</div>
          <div className={cn("max-w-[42ch] text-[22px] leading-[1.45] whitespace-pre-wrap", dark ? "text-white/72" : "text-black/62")}>{snap.texts.body}</div>
        </div>
      </FrozenGroup>
      <FrozenGroup snap={snap} groupKey="stats">
        <div className="flex flex-col gap-[18px]">
          {slide.stats?.map((stat, i) => (
            <div key={i} className={cn("relative isolate flex items-center gap-[34px] overflow-hidden rounded-[10px] px-[44px] py-[34px]", dark ? "border border-white/18 bg-white/[0.08]" : "bg-white shadow-[var(--shadow-card)]")}>
              <div className="shrink-0 font-mono text-[56px] font-bold leading-none tracking-normal whitespace-pre-wrap">{snap.texts[`stat-value-${i}`] ?? stat.value}</div>
              <div className={cn("text-[17px] font-semibold leading-[1.3] whitespace-pre-wrap", dark ? "text-white/72" : "text-black/68")}>{snap.texts[`stat-label-${i}`] ?? stat.label}</div>
            </div>
          ))}
        </div>
      </FrozenGroup>
    </FrozenFrame>
  );
}

function FrozenClosing({ presentation, slide, snap }: { presentation: CommercialPresentation; slide: CommercialSlide; snap: SlideSnapshot }) {
  return (
    <FrozenFrame presentation={presentation} slide={slide} dark>
      <FrozenChrome presentation={presentation} slide={slide} dark largeLogo />
      <FrozenGroup snap={snap}>
        <div className="flex flex-col gap-[40px]">
          <div className="max-w-[15ch] text-[72px] font-extrabold leading-[0.84] tracking-normal whitespace-pre-wrap">{snap.texts.title}</div>
          <div className="max-w-[50ch] text-[22px] leading-[1.45] text-white/72 whitespace-pre-wrap">{snap.texts.body}</div>
        </div>
      </FrozenGroup>
      <FrozenGroup snap={snap} groupKey="quote">
        <div className="flex flex-col justify-end gap-[38px]">
          <div className="text-[28px] font-semibold leading-[1.08] text-white/80 whitespace-pre-wrap">{snap.texts.quote}</div>
          <div className="h-[8px] w-full rounded-full" style={{ background: presentation.accent }} />
        </div>
      </FrozenGroup>
    </FrozenFrame>
  );
}

function FrozenSlideContent({ presentation, slide, snap }: { presentation: CommercialPresentation; slide: CommercialSlide; snap: SlideSnapshot }) {
  if (slide.type === "cover") return <FrozenCover presentation={presentation} slide={slide} snap={snap} />;
  if (slide.type === "closing") return <FrozenClosing presentation={presentation} slide={slide} snap={snap} />;
  if (slide.type === "statement" || slide.type === "principle" || slide.type === "turning-point") return <FrozenStatement presentation={presentation} slide={slide} snap={snap} />;
  if (slide.type === "framework" || slide.type === "decision") return <FrozenFramework presentation={presentation} slide={slide} snap={snap} />;
  if (slide.type === "leaders" || slide.type === "action-plan" || slide.type === "benefits" || slide.type === "recommendations") return <FrozenCards presentation={presentation} slide={slide} snap={snap} />;
  if (slide.type === "stats" || slide.type === "risks") return <FrozenStats presentation={presentation} slide={slide} snap={snap} />;
  return <FrozenSplit presentation={presentation} slide={slide} snap={snap} />;
}

// ── Public export ─────────────────────────────────────────────────────────────

export function QuemSomosFrozenSlide({ presentation, slide }: { presentation: CommercialPresentation; slide: CommercialSlide }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const snap = SNAPSHOT[slide.id];

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale((entry?.contentRect.width ?? CANVAS_W) / CANVAS_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!snap) return null;

  return (
    <div ref={viewportRef} className="relative aspect-video w-full overflow-hidden bg-[#D4D4D4] shadow-[var(--shadow-card)]">
      <div
        className="absolute left-0 top-0 origin-top-left overflow-hidden bg-[#D4D4D4] p-[20px] text-black"
        style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})` }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[10px]">
          <FrozenSlideContent presentation={presentation} slide={slide} snap={snap} />
        </div>
      </div>
    </div>
  );
}
