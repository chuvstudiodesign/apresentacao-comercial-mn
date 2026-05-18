"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigation } from "./navigation";

const SL = 30;  // desktop sidebar offset (px) = page spacing
const SW = 256; // desktop sidebar width (px)

// Mobile navbar constants
const NAV_TOP = 22;    // gap from top edge (half of section padding-y 45px)
const NAV_H = 60;      // navbar height (px)
const NAV_X = 30;      // horizontal gap from screen edges (= --spacing-page)
const BRAND_LOGO_URL = "https://raw.githubusercontent.com/chuvstudiodesign/logos-masi-negocios/71ad67702f1e8fc61061ef81a2e9f372788e7dab/Negocios.svg";

function SidebarContent({
  pathname,
  onNavClick,
  logoClassName = "h-7",
}: {
  pathname: string;
  onNavClick?: () => void;
  logoClassName?: string;
}) {
  return (
    <>
      <div className="mb-5 border-b border-white pb-5">
        <Link href="/styleguide" onClick={onNavClick} className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BRAND_LOGO_URL}
            alt="Negocios"
            className={`${logoClassName} w-auto`}
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-6">
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {section.title}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavClick}
                    className={cn(
                      "block rounded-[10px] px-2 py-2.5 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-[#aff000] font-medium text-black"
                        : "text-foreground hover:bg-black/5"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-white pt-5">
        <p className="text-[11px] text-muted-foreground">MN Design System © 2025</p>
      </div>
    </>
  );
}

export default function StyleguideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const slideExportRoute =
    pathname.startsWith("/styleguide/paginas/apresentacoes-comerciais/slide-");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [tabVisible, setTabVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const revealTab = useCallback(() => {
    setTabVisible(true);
    clearTimer();
    timerRef.current = setTimeout(() => setTabVisible(false), 5000);
  }, [clearTimer]);

  const handleCollapse = useCallback(() => {
    setDesktopOpen(false);
    setTimeout(revealTab, 300);
  }, [revealTab]);

  const handleExpand = useCallback(() => {
    setDesktopOpen(true);
    setTabVisible(false);
    clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (desktopOpen) return;
    const onMove = (e: MouseEvent) => {
      if (e.clientX < 48) revealTab();
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [desktopOpen, revealTab]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const btnLeft = SL + SW - 12;

  if (slideExportRoute) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen bg-background">

      {/* ── Mobile floating navbar ── */}
      <header
        className="fixed z-30 flex items-center justify-between rounded-[10px] bg-[#ececec] lg:hidden"
        style={{
          top: NAV_TOP,
          left: NAV_X,
          right: NAV_X,
          height: NAV_H,
          paddingLeft: NAV_X,
          paddingRight: NAV_X,
        }}
      >
        <Link href="/styleguide" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BRAND_LOGO_URL}
            alt="Negocios"
            className="h-[19px] w-auto"
          />
        </Link>

        <div className="flex min-w-0 items-center gap-3">
          <a
            href="https://www.masinegocios.com.br/design-system"
            className="whitespace-nowrap rounded-[8px] px-3 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            Design System
          </a>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
            className="rounded-[10px] p-1.5 transition-colors hover:bg-black/5"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M3 6h16M3 11h16M3 16h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer (opens from the RIGHT) ── */}
      <aside
        className={cn(
          "fixed right-[30px] top-[30px] z-50 w-[min(20rem,calc(100vw-60px))]",
          "flex flex-col overflow-y-auto rounded-[10px] border border-white p-5",
          "transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-[calc(100%+30px)]"
        )}
        style={{ backgroundColor: "#ececec", height: "calc(100vh - 60px)" }}
      >
        <SidebarContent pathname={pathname} onNavClick={() => setMobileOpen(false)} logoClassName="h-5" />
      </aside>

      {/* ── Desktop sidebar (fixed, slides left on collapse) ── */}
      <aside
        className="no-scrollbar hidden flex-col overflow-y-auto rounded-[10px] border border-white p-5 lg:flex"
        style={{
          backgroundColor: "#ececec",
          boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
          position: "fixed",
          left: SL,
          top: SL,
          width: SW,
          maxHeight: `calc(100vh - ${SL * 2}px)`,
          transform: desktopOpen ? "translateX(0)" : `translateX(${-(SW + SL)}px)`,
          transition: "transform 300ms ease-in-out",
          zIndex: 20,
        }}
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* ── Collapse button (right edge of sidebar) ── */}
      <button
        onClick={handleCollapse}
        aria-label="Fechar menu"
        className="fixed z-30 hidden h-14 w-6 items-center justify-center rounded-full border border-black/[0.08] shadow-sm lg:flex"
        style={{
          backgroundColor: "#ececec",
          left: btnLeft,
          top: "50%",
          transform: desktopOpen
            ? "translateX(0) translateY(-50%)"
            : `translateX(${-(SW + SL)}px) translateY(-50%)`,
          opacity: desktopOpen ? 1 : 0,
          pointerEvents: desktopOpen ? "auto" : "none",
          transition: "transform 300ms ease-in-out, opacity 200ms ease-in-out",
        }}
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path
            d="M5.5 1L1 6L5.5 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Expand tab (left screen edge) ── */}
      <button
        onClick={handleExpand}
        onMouseEnter={() => !desktopOpen && revealTab()}
        aria-label="Abrir menu"
        className="fixed left-0 z-20 hidden h-16 w-5 flex-col items-center justify-center rounded-r-full border border-l-0 border-black/[0.08] shadow-sm lg:flex"
        style={{
          backgroundColor: "#ececec",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: !desktopOpen && tabVisible ? 1 : 0,
          pointerEvents: !desktopOpen && tabVisible ? "auto" : "none",
          transition: "opacity 400ms ease-in-out",
        }}
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path
            d="M1.5 1L6 6L1.5 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Main content ── */}
      <div
        className={cn(
          "px-[30px] pb-4 pt-[98px] transition-[padding-left] duration-300 ease-in-out lg:pr-[30px] lg:pt-[30px] lg:pb-[30px]",
          desktopOpen
            ? "lg:pl-[316px]"
            : "lg:pl-[30px]"
        )}
      >
        <main>{children}</main>
      </div>
    </div>
  );
}
