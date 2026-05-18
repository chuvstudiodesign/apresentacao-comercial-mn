"use client";

import { useEffect, useId, useRef, useState } from "react";

const BORDER_RADIUS = 10;
const CHAMFER_SIZE = 32;
const CHAMFER_RADIUS = 4.5;

type ChamferedPanelProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  strokeColor?: string;
  strokeWidth?: number;
};

export function ChamferedPanel({
  children,
  style,
  innerStyle,
  strokeColor,
  strokeWidth = 0,
}: ChamferedPanelProps) {
  const clipPathId = useId().replace(/:/g, "");
  const [size, setSize] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const clipPath = buildChamferPath(
    size.width,
    size.height,
    CHAMFER_SIZE,
    BORDER_RADIUS,
    CHAMFER_RADIUS,
  );
  const strokePath = buildChamferPath(
    size.width,
    size.height,
    CHAMFER_SIZE,
    BORDER_RADIUS,
    CHAMFER_RADIUS,
    strokeWidth / 2,
  );

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
      >
        <defs>
          <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
            <path d={clipPath} />
          </clipPath>
        </defs>
        {strokePath && strokeColor && strokeWidth > 0 ? (
          <path
            d={strokePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 0,
          clipPath: `url(#${clipPathId})`,
          WebkitClipPath: `url(#${clipPathId})`,
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function buildChamferPath(
  width: number,
  height: number,
  chamfer: number,
  radius: number,
  chamferRadius: number,
  inset = 0,
) {
  if (!width || !height) return "";

  const safeInset = Math.max(0, inset);
  const w = width - safeInset * 2;
  const h = height - safeInset * 2;
  if (w <= 0 || h <= 0) return "";

  const ox = safeInset;
  const oy = safeInset;
  const r = Math.max(0, Math.min(radius - safeInset, 24));
  const c = Math.max(0, Math.min(chamfer - safeInset, Math.min(w * 0.35, h * 0.35)));
  const cr = Math.max(0, Math.min(chamferRadius, c * 0.45));

  return `
    M ${ox + c + cr} ${oy}
    H ${ox + w - r}
    Q ${ox + w} ${oy} ${ox + w} ${oy + r}
    V ${oy + h - r}
    Q ${ox + w} ${oy + h} ${ox + w - r} ${oy + h}
    H ${ox + r}
    Q ${ox} ${oy + h} ${ox} ${oy + h - r}
    V ${oy + c + cr}
    Q ${ox} ${oy + c} ${ox + cr} ${oy + c - cr}
    L ${ox + c - cr} ${oy + cr}
    Q ${ox + c} ${oy} ${ox + c + cr} ${oy}
    Z
  `;
}

