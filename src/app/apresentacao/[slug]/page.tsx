"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { commercialPresentations, userPresentations } from "@/data/commercial-presentations";
import type { CommercialPresentation } from "@/data/commercial-presentations";
import { SlideViewport } from "@/components/commercial-presentations/SlideViewport";
import { ChamferedPanel } from "@/components/chamfered-panel";

const BRAND_LOGO_URL =
  "https://raw.githubusercontent.com/chuvstudiodesign/logos-masi-negocios/71ad67702f1e8fc61061ef81a2e9f372788e7dab/Negocios.svg";

const NAV_TOP = 22;
const NAV_H = 60;
const NAV_X = 30;
const SIDEBAR_W = Math.round(248 * 1.2 * 1.1 * 1.15);

const allPresentations = [...commercialPresentations, ...userPresentations];

function PresentationPanel({ presentation }: { presentation: CommercialPresentation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewportHeight, setViewportHeight] = useState(0);
  const viewportWrapRef = useRef<HTMLDivElement>(null);
  const currentSlide = presentation.slides[currentIndex] ?? presentation.slides[0];

  useEffect(() => {
    const el = viewportWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setViewportHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const prev = () => setCurrentIndex((i) => (i === 0 ? presentation.slides.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === presentation.slides.length - 1 ? 0 : i + 1));

  return (
    <div className="flex items-start gap-0" style={{ maxWidth: 2200 }}>
      <div className="flex min-w-0 flex-1 flex-col">
        <div ref={viewportWrapRef}>
          <SlideViewport presentation={presentation} slide={currentSlide} />
        </div>
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
              <ArrowLeft className="size-4" /> Anterior
            </button>
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-1.5 rounded-[8px] bg-foreground px-3 py-2 text-[13px] font-medium text-background transition hover:opacity-80"
            >
              Próximo <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-start pl-2">
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="mt-3 flex h-14 w-6 flex-none items-center justify-center rounded-full border border-black/[0.08] bg-[#ececec] shadow-sm transition-colors hover:bg-white"
          aria-label={sidebarOpen ? "Fechar painel" : "Abrir painel"}
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            {sidebarOpen ? (
              <path d="M1.5 1L6 6L1.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M5.5 1L1 6L5.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
        <div
          className="ml-2 overflow-hidden rounded-[10px] transition-[width] duration-300 ease-in-out"
          style={{ width: sidebarOpen ? SIDEBAR_W : 0, height: viewportHeight || "auto" }}
        >
          <div
            className="flex flex-col bg-white shadow-[var(--shadow-card)] rounded-[10px]"
            style={{ width: SIDEBAR_W, height: viewportHeight || "auto" }}
          >
            <div className="no-scrollbar flex-1 overflow-y-auto p-[20px]">
              <div className="flex flex-col gap-1">
                {presentation.slides.map((slide, index) => {
                  const active = index === currentIndex;
                  const isDark = slide.visual === "dark" || slide.visual === "quote" || slide.type === "closing";
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "w-full rounded-[8px] border p-2 text-left transition",
                        active ? "border-black bg-white shadow-sm" : "border-transparent hover:border-black/10 hover:bg-[#FAFAFA]"
                      )}
                    >
                      <div
                        className="aspect-video w-full overflow-hidden rounded-[6px]"
                        style={{
                          background: isDark
                            ? `linear-gradient(135deg, ${presentation.darkAccent}, #0C1C16)`
                            : "linear-gradient(135deg, #FFFFFF, #ECECEC)",
                        }}
                      >
                        <div className="flex h-full flex-col justify-between p-2">
                          <span className="font-mono text-[14px] font-black" style={{ color: presentation.accent }}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={cn("text-[16px] font-bold leading-tight", isDark ? "text-white" : "text-black")}>
                            {slide.title.replace(/\n/g, " ").slice(0, 31)}
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

export default function PresentationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const presentation = allPresentations.find((p) => p.slug === slug);
  if (!presentation) notFound();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setMenuOpen(false)}
        />
      )}

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
            type="button"
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
          {allPresentations.map((item) => (
            <Link
              key={item.id}
              href={`/apresentacao/${item.slug}`}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition hover:bg-black/5",
                item.slug === presentation.slug ? "bg-white text-foreground shadow-sm" : "text-foreground"
              )}
            >
              {item.title.replace(/\n/g, " ")}
            </Link>
          ))}
        </nav>
        <div className="mt-3 border-t border-white/50 pt-3 md:hidden">
          <a
            href="https://www.masinegocios.com.br/design-system"
            className="block rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-black/5"
          >
            Design System
          </a>
        </div>
      </aside>

      <header
        className="fixed z-30 flex items-center justify-between rounded-[10px] border border-white bg-[#ececec] left-[10px] right-[10px] pl-[20px] pr-[20px] md:left-[30px] md:right-[30px] md:pl-[30px] md:pr-[30px]"
        style={{ top: NAV_TOP, height: NAV_H }}
      >
        <Link href="/" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/symbol/masi-symbol-dark.svg" alt="Masi" className="block md:hidden" style={{ width: 24, height: 24 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND_LOGO_URL} alt="Masi Negócios" className="hidden md:block h-[19px] w-auto" />
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

      <div className="px-[10px] pb-[10px] md:px-[30px] md:pb-[30px]" style={{ paddingTop: NAV_TOP + NAV_H + NAV_TOP }}>
        <main>
          <div className="ds-page">
            <section className="w-full">
              <ChamferedPanel
                strokeColor="#FFFFFF"
                strokeWidth={1}
                innerStyle={{ background: "#ECECEC", borderRadius: 10, padding: "var(--section-padding-y) var(--section-padding-x)" }}
              >
                <div className="w-full flex flex-col gap-5">
                  <div>
                    <p className="ds-caption mb-1 text-primary">Apresentação</p>
                    <h1 className="ds-section-title">{presentation.title.replace(/\n/g, " ")}</h1>
                    {presentation.subtitle && (
                      <p className="ds-section-subtitle">{presentation.subtitle}</p>
                    )}
                  </div>
                  <PresentationPanel presentation={presentation} />
                </div>
              </ChamferedPanel>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
