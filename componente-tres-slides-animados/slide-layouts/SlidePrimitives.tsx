import type { CSSProperties, ReactNode } from "react";
import logoDark from "../assets/masi-primary-dark.svg";
import logoLight from "../assets/masi-primary-light.svg";
import { cn } from "../utils";
import type { CommercialPresentation, CommercialSlide } from "../types";
import { imageUrl } from "../types";

export function SlideShell({
  presentation,
  slide,
  children,
  dark = false,
  className,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  if (!dark) {
    return (
      <article className="relative flex h-full w-full overflow-hidden bg-[#D4D4D4] p-[20px] text-black">
        <section className="relative flex h-full w-full overflow-hidden rounded-[10px] bg-[#ECECEC] p-[70px]">
          <div className={cn("relative z-10 flex min-h-0 w-full flex-col", className)}>
            {children}
          </div>
          <SlideFooter presentation={presentation} slide={slide} dark={false} />
        </section>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "relative flex h-full w-full overflow-hidden p-[5.4%]",
        dark ? "text-white" : "text-black",
        className,
      )}
      style={{
        background: dark
          ? `linear-gradient(135deg, ${presentation.darkAccent} 0%, #0C1C16 68%, #000000 100%)`
          : "linear-gradient(135deg, #FFFFFF 0%, #F8F8F8 56%, #ECECEC 100%)",
      }}
    >
      <div className="relative z-10 flex min-h-0 w-full flex-col">{children}</div>
      <SlideFooter presentation={presentation} slide={slide} dark={dark} />
    </article>
  );
}

export function SlideEyebrow({
  children,
  dark = false,
  accent,
}: {
  children?: ReactNode;
  dark?: boolean;
  accent: string;
}) {
  if (!children) return null;

  return (
    <p
      className={cn(
        "text-[15px] font-bold uppercase leading-none tracking-[0.08em]",
        dark ? "text-white/70" : "text-black/55",
      )}
      style={{ color: dark ? "rgba(255,255,255,0.72)" : accent }}
    >
      {children}
    </p>
  );
}

export function SlideTitle({
  children,
  size = "lg",
  className,
}: {
  children: ReactNode;
  size?: "xl" | "lg" | "md";
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "max-w-[13ch] font-extrabold leading-[0.9] tracking-normal",
        size === "xl" && "text-[104px]",
        size === "lg" && "text-[81px]",
        size === "md" && "text-[53px] leading-[0.96]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function SlideBody({
  children,
  dark = false,
  className,
}: {
  children?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  if (!children) return null;

  return (
    <p
      className={cn(
        "max-w-[42ch] text-[22px] leading-[1.45]",
        dark ? "text-white/72" : "text-black/62",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SlideFooter({
  presentation,
  slide,
  dark = false,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute bottom-[4.6%] left-[5.4%] right-[5.4%] z-20 flex items-center justify-between text-[13px] font-semibold uppercase tracking-[0.08em]",
        dark ? "text-white/42" : "text-black/38",
      )}
    >
      <span>{slide.footer}</span>
      <span>{presentation.title}</span>
    </div>
  );
}

export function SlideLogo({
  dark = false,
  size = "default",
}: {
  dark?: boolean;
  size?: "default" | "large";
}) {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl(dark ? logoLight : logoDark)}
        alt="MASI"
        className={cn(size === "large" ? "h-[29px]" : "h-[23px]", "w-auto")}
      />
    </div>
  );
}

export function AbstractVisual({
  accent,
  dark = false,
  label,
  variant = "grid",
  className,
}: {
  accent: string;
  dark?: boolean;
  label?: string;
  variant?: "grid" | "orbital" | "bars" | "panel";
  className?: string;
}) {
  const lineColor = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)";
  const style = {
    "--slide-accent": accent,
    "--slide-line": lineColor,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "relative h-full min-h-[180px] overflow-hidden rounded-[10px] border",
        dark ? "border-white/10 bg-white/[0.06]" : "border-black/10 bg-white",
        className,
      )}
      style={style}
    >
      {variant === "grid" && (
        <div className="absolute inset-[9%] grid grid-cols-3 gap-[5%]">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="rounded-[10px] border border-[var(--slide-line)]"
              style={{
                background:
                  item === 2
                    ? accent
                    : dark
                      ? "rgba(255,255,255,0.08)"
                      : "#F8F8F8",
              }}
            />
          ))}
        </div>
      )}
      {variant === "orbital" && (
        <div className="absolute inset-0">
          <div className="absolute left-[18%] top-[18%] h-[62%] w-[62%] rounded-full border border-[var(--slide-line)]" />
          <div className="absolute left-[30%] top-[30%] h-[38%] w-[38%] rounded-full border border-[var(--slide-line)]" />
          <div className="absolute left-[48%] top-[8%] h-[12%] w-[12%] rounded-full bg-[var(--slide-accent)]" />
          <div className="absolute bottom-[18%] left-[18%] h-[9%] w-[9%] rounded-full bg-black/20" />
        </div>
      )}
      {variant === "bars" && (
        <div className="absolute inset-x-[12%] bottom-[16%] flex h-[60%] items-end gap-[5%]">
          {[42, 68, 52, 86, 74].map((height, index) => (
            <div
              key={height}
              className="flex-1 rounded-t-[10px]"
              style={{
                height: `${height}%`,
                background: index === 3 ? accent : dark ? "rgba(255,255,255,0.18)" : "#ECECEC",
              }}
            />
          ))}
        </div>
      )}
      {variant === "panel" && (
        <div className="absolute inset-[10%] grid grid-cols-2 gap-[6%]">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-[10px] border border-[var(--slide-line)]"
              style={{ background: item === 1 ? accent : dark ? "rgba(255,255,255,0.08)" : "#F8F8F8" }}
            />
          ))}
        </div>
      )}
      {label && (
        <div
          className={cn(
            "absolute bottom-[7%] left-[8%] right-[8%] line-clamp-3 max-h-[18%] overflow-hidden text-[13px] font-semibold leading-[1.3] tracking-normal",
            dark ? "text-white/48" : "text-black/42",
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
}

