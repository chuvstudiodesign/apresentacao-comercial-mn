import { cn } from "../utils";
import type { CommercialSlideChart } from "../types";

export function SlideChartVisual({
  chart,
  accent,
  className,
}: {
  chart: CommercialSlideChart;
  accent: string;
  className?: string;
}) {
  const max = Math.max(...chart.data.map((d) => Math.max(d.value, d.secondary ?? 0)));
  const paddedMax = Math.ceil(max / 10) * 10 || 100;

  if (chart.type === "bar") {
    return (
      <div
        className={cn("flex flex-col overflow-hidden rounded-[10px] bg-white p-[36px]", className)}
        style={{ boxShadow: "var(--shadow-card, 0 12px 28px rgba(15,23,42,0.06))" }}
      >
        <p className="text-[14px] font-bold uppercase tracking-[0.08em]" style={{ color: accent }}>
          {chart.valueLabel}
        </p>
        <div className="mt-[24px] flex flex-1 flex-col justify-around gap-[12px]">
          {chart.data.map((datum) => (
            <div key={datum.label} className="flex flex-col gap-[8px]">
              <div className="flex items-baseline justify-between gap-[12px]">
                <span className="text-[14px] font-semibold leading-[1.2] text-black/58">
                  {datum.label}
                </span>
                <span className="shrink-0 text-[18px] font-extrabold" style={{ color: accent }}>
                  {datum.value}%
                </span>
              </div>
              <div className="h-[10px] overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(datum.value / paddedMax) * 100}%`,
                    background: accent,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const svgW = 560;
  const svgH = 200;
  const padX = 24;
  const padTop = 28;
  const padBottom = 28;
  const chartW = svgW - padX * 2;
  const chartH = svgH - padTop - padBottom;
  const n = chart.data.length;
  const xStep = n > 1 ? chartW / (n - 1) : 0;

  const toX = (i: number) => padX + i * xStep;
  const toY = (v: number) => padTop + chartH - (v / paddedMax) * chartH;
  const primaryPath = chart.data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d.value)}`)
    .join(" ");

  return (
    <div
      className={cn("flex flex-col overflow-hidden rounded-[10px] bg-white p-[36px]", className)}
      style={{ boxShadow: "var(--shadow-card, 0 12px 28px rgba(15,23,42,0.06))" }}
    >
      <p className="text-[14px] font-bold uppercase tracking-[0.08em]" style={{ color: accent }}>
        {chart.valueLabel}
      </p>
      <div className="mt-[16px] flex-1">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ minHeight: 140 }}>
          {[0, 25, 50, 75, 100]
            .filter((v) => v <= paddedMax)
            .map((v) => (
              <line
                key={v}
                x1={padX}
                x2={svgW - padX}
                y1={toY(v)}
                y2={toY(v)}
                stroke="rgba(0,0,0,0.06)"
                strokeWidth={1}
              />
            ))}
          <path
            d={primaryPath}
            fill="none"
            stroke={accent}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chart.data.map((d, i) => (
            <g key={d.label}>
              <circle cx={toX(i)} cy={toY(d.value)} r={5} fill={accent} />
              <text
                x={toX(i)}
                y={toY(d.value) - 11}
                textAnchor="middle"
                fontSize={13}
                fontWeight="700"
                fill={accent}
                fontFamily="inherit"
              >
                {d.value}%
              </text>
              <text
                x={toX(i)}
                y={svgH - 4}
                textAnchor="middle"
                fontSize={11}
                fill="rgba(0,0,0,0.40)"
                fontFamily="inherit"
              >
                {d.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {(chart.insight || chart.source) && (
        <div className="mt-[12px] border-t border-black/[0.08] pt-[14px]">
          {chart.insight && (
            <p className="text-[13px] leading-[1.35] text-black/46">{chart.insight}</p>
          )}
          {chart.source && (
            <p className="mt-[8px] text-[11px] font-semibold uppercase tracking-[0.06em] text-black/28">
              {chart.source}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

