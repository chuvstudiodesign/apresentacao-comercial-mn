"use client";

import { useEffect, useRef } from "react";
import { presentation as defaultPresentation } from "./data";
import { PresentationSlide } from "./PresentationSlide";
import type { CommercialPresentation } from "./types";

const SLIDE_W = 1600;
const SLIDE_H = 900;
const DISPLAY_W = 680;
const DISPLAY_H = Math.round(DISPLAY_W * (SLIDE_H / SLIDE_W));
const DISPLAY_SCALE = DISPLAY_W / SLIDE_W;
const OFFSET_Y = 36;
const OFFSET_Z = 60;
const FAN_X = DISPLAY_W * 0.3;
const X_BY_INDEX = [-FAN_X, 0, FAN_X] as const;

export function StackedSlidesPreview({
  presentation = defaultPresentation,
  className,
}: {
  presentation?: CommercialPresentation;
  className?: string;
}) {
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const slideDivs = useRef<(HTMLDivElement | null)[]>([]);
  const slides = presentation.slides.slice(0, 3);

  useEffect(() => {
    function applyProgress(p: number) {
      slideDivs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translateZ(${-i * OFFSET_Z}px) translateX(${X_BY_INDEX[i as 0 | 1 | 2] * p}px)`;
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

  return (
    <div
      className={className ?? "relative mx-auto"}
      style={{
        width: DISPLAY_W,
        height: DISPLAY_H + OFFSET_Y * (slides.length - 1),
        perspective: "1400px",
        perspectiveOrigin: "50% 30%",
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          ref={(el) => {
            slideDivs.current[i] = el;
          }}
          className="absolute left-0 overflow-hidden rounded-[8px]"
          style={{
            width: DISPLAY_W,
            height: DISPLAY_H,
            top: i * OFFSET_Y,
            zIndex: slides.length - i,
            willChange: "transform",
            transform: `translateZ(${-i * OFFSET_Z}px) translateX(0px)`,
            boxShadow: `0 ${10 + i * 12}px ${24 + i * 20}px rgba(0,0,0,${0.16 + i * 0.07})`,
          }}
        >
          <div
            className="origin-top-left"
            style={{
              width: SLIDE_W,
              height: SLIDE_H,
              transform: `scale(${DISPLAY_SCALE})`,
            }}
          >
            <PresentationSlide presentation={presentation} slide={slide} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default StackedSlidesPreview;
