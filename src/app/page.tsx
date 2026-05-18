"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { commercialPresentations, userPresentations } from "@/data/commercial-presentations";
import type { CommercialPresentation } from "@/data/commercial-presentations";

const allPresentations = [...commercialPresentations, ...userPresentations];
import { PresentationSlide } from "@/components/commercial-presentations/PresentationSlide";
import { SlideViewport } from "@/components/commercial-presentations/SlideViewport";
import { Section } from "@/app/styleguide/foundation-sections";
import { ChamferedPanel } from "@/components/chamfered-panel";
import { TypingAnimation } from "@/components/magicui/typing-animation";

const BRAND_LOGO_URL =
  "https://raw.githubusercontent.com/chuvstudiodesign/logos-masi-negocios/71ad67702f1e8fc61061ef81a2e9f372788e7dab/Negocios.svg";

const NAV_TOP = 22;
const NAV_H = 60;
const NAV_X = 30;

const HERO_TITLE = "Sistema de criação de apresentação comercial.";
const HERO_TITLE_CLASS =
  "max-w-5xl text-center text-[34px] md:text-[62px] font-extrabold leading-[1.05] tracking-normal text-foreground";

const presentation = commercialPresentations[0];

// Resumos de até 31 chars para cada slide — únicos, baseados no conteúdo real
const SLIDE_SUMMARIES = [
  "O futuro dos negócios no Brasil", // 01 cover
  "Tese: contexto, tech e execução", // 02 statement
  "O mercado mudou de ritmo",        // 03 context
  "Ferramentas novas, velha visão",  // 04 problem
  "Cliente reorganiza o mercado",    // 05 behavior
  "Oportunidade na conexão real",    // 06 opportunity
  "Três sinais para observar agora", // 07 stats
  "Mercado, produto e execução",     // 08 framework
  "Inovação vira método e rotina",   // 09 principle
  "Aplicação prática no negócio",    // 10 example
  "Como líderes criam mecanismos",   // 11 leaders
  "Critérios claros de decisão",     // 12 decision
  "Sistema por trás da narrativa",   // 13 concept
  "Menos dispersão, mais critério",  // 14 turning-point
  "Quatro movimentos para agir já",  // 15 action-plan
  "Clareza e consistência no valor", // 16 benefits
  "Riscos de não agir agora",        // 17 risks
  "O que a liderança deve fazer",    // 18 recommendations
  "Próximo passo: plano de 90 dias", // 19 cta
  "Transforme clareza em movimento", // 20 closing
];

// ── Stacked slides preview (hero) ─────────────────────────────────────────────

const SLIDE_W = 1600;
const SLIDE_H = 900;
const DISPLAY_W = 680;
const OFFSET_Y = 36;
const OFFSET_Z = 60;
const DOWNLOAD_PREVIEW_W = 560;

function StackedSlidesPreview() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [effectiveW, setEffectiveW] = useState(DISPLAY_W);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const slideDivs = useRef<(HTMLDivElement | null)[]>([]);
  const fanXRef = useRef(DISPLAY_W * 0.3);
  const slides = presentation.slides.slice(0, 3);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setEffectiveW(Math.min(DISPLAY_W, Math.floor(entry.contentRect.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const fx = effectiveW * 0.3;
    fanXRef.current = fx;
    const p = progressRef.current;
    slideDivs.current.forEach((el, i) => {
      if (!el) return;
      el.style.transform = `translateZ(${-i * OFFSET_Z}px) translateX(${[-fx, 0, fx][i] * p}px)`;
    });
  }, [effectiveW]);

  useEffect(() => {
    function applyProgress(p: number) {
      const fx = fanXRef.current;
      slideDivs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translateZ(${-i * OFFSET_Z}px) translateX(${[-fx, 0, fx][i] * p}px)`;
      });
    }
    function onScroll() {
      const clamped = Math.min(1, window.scrollY / 380);
      if (clamped === progressRef.current) return;
      progressRef.current = clamped;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        applyProgress(progressRef.current);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const displayH = Math.round(effectiveW * (SLIDE_H / SLIDE_W));
  const displayScale = effectiveW / SLIDE_W;

  return (
    <div ref={wrapperRef} className="w-full">
      <div
        className="relative mx-auto"
        style={{
          width: effectiveW,
          height: displayH + OFFSET_Y * (slides.length - 1),
          perspective: "1400px",
          perspectiveOrigin: "50% 30%",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => { slideDivs.current[i] = el; }}
            className="absolute left-0 overflow-hidden rounded-[8px]"
            style={{
              width: effectiveW,
              height: displayH,
              top: i * OFFSET_Y,
              zIndex: slides.length - i,
              willChange: "transform",
              transform: `translateZ(${-i * OFFSET_Z}px) translateX(0px)`,
              boxShadow: `0 ${10 + i * 12}px ${24 + i * 20}px rgba(0,0,0,${0.16 + i * 0.07})`,
            }}
          >
            <div
              className="origin-top-left"
              style={{ width: SLIDE_W, height: SLIDE_H, transform: `scale(${displayScale})` }}
            >
              <PresentationSlide presentation={presentation} slide={slide} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Home presentation panel (section 2) ───────────────────────────────────────

const SIDEBAR_W = Math.round(248 * 1.2 * 1.1 * 1.15); // 377px (+20% +10% +15%)

function HomePresentationPanel({ presentation }: { presentation: CommercialPresentation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Altura do SlideViewport medida em tempo real para sincronizar o painel lateral
  const [viewportHeight, setViewportHeight] = useState(0);
  const viewportWrapRef = useRef<HTMLDivElement>(null);
  const currentSlide = presentation.slides[currentIndex] ?? presentation.slides[0];

  useEffect(() => {
    const el = viewportWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setViewportHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? presentation.slides.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i === presentation.slides.length - 1 ? 0 : i + 1));

  return (
    <div className="flex items-start gap-0" style={{ maxWidth: 2200 }}>
      {/* ── Slide + nav abaixo ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Wrapper medido para sincronizar altura do painel lateral */}
        <div ref={viewportWrapRef}>
          <SlideViewport presentation={presentation} slide={currentSlide} />
        </div>

        {/* Controles abaixo do slide: número (esquerda) + botões (direita) */}
        <div className="mt-3 flex items-center justify-end md:justify-between">
          <span className="hidden md:inline-flex rounded-full bg-[#ECECEC] px-4 py-2 font-mono text-[12px] font-bold text-foreground">
            {String(currentIndex + 1).padStart(2, "0")} de {presentation.slides.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              className="flex items-center gap-1.5 rounded-[8px] bg-[#ECECEC] px-3 py-2 text-[13px] font-medium transition hover:bg-[#D4D4D4]"
            >
              <ArrowLeft className="size-4" />
              Anterior
            </button>
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-1.5 rounded-[8px] bg-foreground px-3 py-2 text-[13px] font-medium text-background transition hover:opacity-80"
            >
              Próximo
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Sidebar direita — oculta em mobile ── */}
      <div className="hidden md:flex items-start pl-2">
        {/* Vinheta de toggle — canto superior, estilo style guide */}
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? "Fechar painel" : "Abrir painel"}
          className="mt-3 flex h-14 w-6 flex-none items-center justify-center rounded-full border border-black/[0.08] bg-[#ececec] shadow-sm transition-colors hover:bg-white"
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            {sidebarOpen ? (
              <path d="M1.5 1L6 6L1.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M5.5 1L1 6L5.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>

        {/* Painel — mesma altura do viewport (medida via ResizeObserver) */}
        <div
          className="ml-2 overflow-hidden rounded-[10px] transition-[width] duration-300 ease-in-out"
          style={{
            width: sidebarOpen ? SIDEBAR_W : 0,
            height: viewportHeight || "auto",
          }}
        >
          <div
            className="flex flex-col bg-white shadow-[var(--shadow-card)] rounded-[10px]"
            style={{ width: SIDEBAR_W, height: viewportHeight || "auto" }}
          >
            <div className="no-scrollbar flex-1 overflow-y-auto p-[20px]">
              <div className="flex flex-col gap-1">
                {presentation.slides.map((slide, index) => {
                  const active = index === currentIndex;
                  const isDark =
                    slide.visual === "dark" ||
                    slide.visual === "quote" ||
                    slide.type === "closing";

                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "w-full rounded-[8px] border p-2 text-left transition",
                        active
                          ? "border-black bg-white shadow-sm"
                          : "border-transparent hover:border-black/10 hover:bg-[#FAFAFA]"
                      )}
                    >
                      {/* Miniatura aspect-video */}
                      <div
                        className="aspect-video w-full overflow-hidden rounded-[6px]"
                        style={{
                          background: isDark
                            ? `linear-gradient(135deg, ${presentation.darkAccent}, #0C1C16)`
                            : "linear-gradient(135deg, #FFFFFF, #ECECEC)",
                        }}
                      >
                        <div className="flex h-full flex-col justify-between p-2">
                          <span
                            className="font-mono text-[14px] font-black"
                            style={{ color: presentation.accent }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={cn(
                              "text-[16px] font-bold leading-tight",
                              isDark ? "text-white" : "text-black"
                            )}
                          >
                            {SLIDE_SUMMARIES[index] ?? slide.title.replace(/\n/g, " ").slice(0, 31)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PowerPoint download section ───────────────────────────────────────────────

function PowerPointMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-7", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        fill="currentColor"
      />
      <path d="M14 2l6 6h-6V2z" fill="white" opacity="0.25" />
      <text
        x="7"
        y="17.5"
        fontSize="9"
        fontWeight="900"
        fill="white"
        fontFamily="system-ui,-apple-system,sans-serif"
      >
        P
      </text>
    </svg>
  );
}

function FigmaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 38 57"
      className={cn("h-[25px] w-auto", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      {/* top-left cell — rounded left side */}
      <path d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z" />
      {/* top-right cell — rounded right side */}
      <path d="M19 0h9.5a9.5 9.5 0 0 1 0 19H19V0z" />
      {/* middle-left cell — rounded left side */}
      <path d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z" />
      {/* middle-right cell — full circle */}
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      {/* bottom-left cell — rounded bottom */}
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" />
    </svg>
  );
}

function DownloadFormatHeader() {
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex size-11 items-center justify-center rounded-[9px] bg-[#ECECEC]">
            <PowerPointMark className="size-[28.5px]" />
          </span>
          <span className="flex size-11 items-center justify-center rounded-[9px] bg-[#ECECEC]">
            <FigmaMark />
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-foreground">Arquivo PowerPoint e Figma</p>
          <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
            Formatos .pptx e .fig editáveis
          </p>
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <span className="rounded-full bg-[#AFF000] px-3 py-1 font-mono text-[11px] font-bold text-black">
          PPTX
        </span>
        <span className="rounded-full bg-[#ECECEC] px-3 py-1 font-mono text-[11px] font-bold text-black">
          FIG
        </span>
      </div>
    </div>
  );
}

function DownloadSlideStack({ presentation }: { presentation: CommercialPresentation }) {
  const slides = presentation.slides.slice(0, 6);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [effectiveW, setEffectiveW] = useState(DOWNLOAD_PREVIEW_W);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const slideDivs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setEffectiveW(Math.min(DOWNLOAD_PREVIEW_W, Math.floor(entry.contentRect.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function applyProgress(p: number) {
    slideDivs.current.forEach((el, index) => {
      if (!el) return;
      const scale = Math.max(0.62, 1 - index * 0.043);
      const y = index * (5 + p * 90);
      const x = (index % 2 === 0 ? -1 : 1) * index * 3 * p;
      const depth = index * (90 + p * 60);
      el.style.transform = `translate3d(${x}px, ${y}px, ${-depth}px) scale(${scale})`;
    });
  }

  useEffect(() => {
    function updateFromScroll() {
      const el = stackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const start = viewportHeight * 0.6;
      const end = viewportHeight * 0.28;
      const next = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      if (Math.abs(next - progressRef.current) < 0.005) return;
      progressRef.current = next;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        applyProgress(progressRef.current);
      });
    }
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    updateFromScroll();
    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function onWheel(event: React.WheelEvent<HTMLDivElement>) {
    const next = Math.max(0, Math.min(1, progressRef.current + event.deltaY / 650));
    if (next === progressRef.current) return;
    progressRef.current = next;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      applyProgress(progressRef.current);
    });
  }

  const previewH = Math.round(effectiveW * (SLIDE_H / SLIDE_W));
  const previewScale = effectiveW / SLIDE_W;

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <div
        ref={stackRef}
        className="relative mx-auto"
        onWheel={onWheel}
        style={{
          width: effectiveW,
          height: previewH + 360,
          perspective: "1800px",
          perspectiveOrigin: "50% 5%",
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => { slideDivs.current[index] = el; }}
            className="absolute left-0 overflow-hidden rounded-[8px]"
            style={{
              top: 0,
              width: effectiveW,
              height: previewH,
              zIndex: slides.length - index,
              transformOrigin: "50% 0%",
              willChange: "transform",
              transform: `translate3d(0, ${index * 5}px, ${-index * 90}px) scale(${Math.max(0.62, 1 - index * 0.043)})`,
              boxShadow: `0 ${12 + index * 4}px ${24 + index * 6}px rgba(0,0,0,${0.13 + index * 0.014})`,
            }}
          >
            <div
              className="origin-top-left"
              style={{ width: SLIDE_W, height: SLIDE_H, transform: `scale(${previewScale})` }}
            >
              <PresentationSlide presentation={presentation} slide={slide} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PowerPointDownloadSection({ presentation }: { presentation: CommercialPresentation }) {
  return (
    <div className="grid items-stretch gap-[30px] lg:grid-cols-[minmax(0,1.3fr)_minmax(288px,0.76fr)]">
      <div className="flex min-h-[300px] flex-col overflow-hidden rounded-[10px] bg-white p-[30px] shadow-[var(--shadow-card)] lg:min-h-[580px]">
        <DownloadFormatHeader />

        <div className="relative mt-8 flex h-[240px] items-start justify-center pt-8 lg:h-[460px]">
          <DownloadSlideStack presentation={presentation} />
        </div>
      </div>

      <div className="flex min-h-[300px] flex-col justify-between rounded-[10px] bg-[#0C1C16] p-[30px] text-white shadow-[var(--shadow-card)] lg:min-h-[580px]">
        <div>
          <p className="font-mono text-[12px] font-bold uppercase text-[#AFF000]">
            Versão para apresentação
          </p>
          <h2 className="mt-4 max-w-xl text-[30px] font-extrabold leading-[1.05] tracking-normal lg:text-[44px]">
            Esta apresentação está disponível em PowerPoint e Figma.
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-7 text-white/72">
            Baixe os arquivos editáveis para apresentar, adaptar textos, revisar páginas e levar o material para reuniões comerciais.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2 border-y border-white/10 py-4">
            <div>
              <p className="font-mono text-[11px] font-bold text-white/40">SLIDES</p>
              <p className="mt-1 text-[18px] font-bold">{presentation.slides.length}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] font-bold text-white/40">FORMATO</p>
              <p className="mt-1 text-[18px] font-bold">16:9</p>
            </div>
            <div>
              <p className="font-mono text-[11px] font-bold text-white/40">ARQUIVOS</p>
              <p className="mt-1 text-[18px] font-bold">.pptx / .fig</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/Slide-Masi-Negocios-Demo.pptx"
              download="Slide Masi Negocios Demo.pptx"
              className="flex h-12 items-center gap-2 rounded-[8px] bg-white px-5 text-[14px] font-bold text-black transition hover:opacity-80"
            >
              <Download className="size-4" />
              Download PowerPoint
            </a>
            <a
              href="/Slide-Masi-Negocios-Demo.fig"
              download="Slide Masi Negocios Demo.fig"
              className="flex h-12 items-center gap-2 rounded-[8px] bg-white/10 px-5 text-[14px] font-bold text-white transition hover:opacity-80"
            >
              <Download className="size-4" />
              Download Figma
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Overlay do menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Drawer de apresentações — desliza da direita */}
      <aside
        className={cn(
          "fixed z-50 flex flex-col overflow-y-auto rounded-[10px] border border-white p-5",
          "transition-transform duration-200",
          menuOpen ? "translate-x-0" : "translate-x-[calc(100%+30px)]"
        )}
        style={{
          right: NAV_X,
          top: NAV_X,
          width: 280,
          maxHeight: `calc(100vh - ${NAV_X * 2}px)`,
          backgroundColor: "#ececec",
          boxShadow: "0 18px 40px rgba(15,23,42,0.10)",
        }}
      >
        <div className="mb-4 flex items-center justify-between border-b border-white pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Apresentações
          </p>
          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-[8px] p-1 transition hover:bg-black/5"
            aria-label="Fechar menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-black/5"
          >
            Início
          </Link>
          {allPresentations.map((p) => (
            <Link
              key={p.id}
              href={`/apresentacao/${p.slug}`}
              onClick={() => setMenuOpen(false)}
              className="block rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-black/5"
            >
              {p.title.replace(/\n/g, " ")}
            </Link>
          ))}
        </nav>

        {allPresentations.length === 0 && (
          <p className="text-[12px] text-muted-foreground">
            Nenhuma apresentação criada ainda. Peça ao Claude para criar uma.
          </p>
        )}
        <div className="mt-3 border-t border-white/50 pt-3 md:hidden">
          <a
            href="https://www.masinegocios.com.br/design-system"
            className="block rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-black/5"
          >
            Design System
          </a>
        </div>
      </aside>

      {/* Floating navbar */}
      <header
        className="fixed z-30 flex items-center justify-between rounded-[10px] bg-[#ececec] border border-white left-[10px] right-[10px] pl-[10px] pr-[10px] md:left-[30px] md:right-[30px] md:pl-[30px] md:pr-[30px]"
        style={{ top: NAV_TOP, height: NAV_H }}
      >
        <Link href="/" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND_LOGO_URL} alt="Masi Negócios" className="h-[19px] w-auto" />
        </Link>
        <div className="flex min-w-0 items-center gap-3">
          <a
            href="https://www.masinegocios.com.br/design-system"
            className="hidden md:block whitespace-nowrap rounded-[8px] px-3 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            Design System
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            className="rounded-[10px] p-1.5 transition-colors hover:bg-black/5"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content — cresce com a viewport, sem limite artificial */}
      <div
        className="px-[10px] pb-[10px] md:px-[30px] md:pb-[30px]"
        style={{ paddingTop: NAV_TOP + NAV_H + NAV_TOP }}
      >
        <main>
          <div className="ds-page">
            {/* Section 1 — Hero */}
            <section className="w-full">
              <ChamferedPanel
                strokeColor="#FFFFFF"
                strokeWidth={1}
                innerStyle={{
                  background: "#ECECEC",
                  borderRadius: 10,
                  padding: "100px var(--section-padding-x) var(--section-padding-y)",
                }}
              >
                <div className="flex w-full flex-col items-center overflow-visible">
                  <div className="flex w-full max-w-5xl flex-col items-center gap-[60px] text-center">
                    <Image
                      src="/logos/primary/masi-primary-dark.svg"
                      alt="Masi Negócios"
                      width={256}
                      height={77}
                      priority
                      className="h-auto w-[256px]"
                    />
                    <div className="relative z-10 w-full max-w-5xl">
                      <h1 className={`${HERO_TITLE_CLASS} invisible mx-auto`} aria-hidden="true">
                        {HERO_TITLE}
                      </h1>
                      <TypingAnimation
                        as="h1"
                        duration={2800}
                        className={`${HERO_TITLE_CLASS} absolute inset-x-0 top-0 mx-auto`}
                      >
                        {HERO_TITLE}
                      </TypingAnimation>
                    </div>
                  </div>
                  <div className="mt-[100px] flex w-full justify-center overflow-visible">
                    <StackedSlidesPreview />
                  </div>
                </div>
              </ChamferedPanel>
            </section>

            {/* Section 2 — Apresentação Demo */}
            <Section
              title="Apresentação Demo"
              subtitle="Esta apresentação segue o estilo visual de section, de card e de imagem."
              centered
              hideSeparator
            >
              <div className="mx-auto w-full md:w-[90%]">
                <HomePresentationPanel presentation={presentation} />
              </div>
            </Section>

            {/* Section 3 — PowerPoint e Figma */}
            <Section
              title="PowerPoint e Figma"
              subtitle="Além da visualização interativa, a apresentação pode ser disponibilizada como arquivo editável para uso em reuniões, propostas e ajustes de design."
              centered
              hideSeparator
            >
              <div className="mx-auto w-full md:w-[90%]">
                <PowerPointDownloadSection presentation={presentation} />
              </div>
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
}
