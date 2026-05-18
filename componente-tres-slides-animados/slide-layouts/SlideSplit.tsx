import type { CommercialPresentation, CommercialSlide } from "../types";
import { imageUrl } from "../types";
import { AbstractVisual, SlideBody, SlideEyebrow, SlideShell, SlideTitle } from "./SlidePrimitives";
import { SlideChartVisual } from "./SlideChart";

export function SlideSplit({
  presentation,
  slide,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
}) {
  return (
    <SlideShell presentation={presentation} slide={slide}>
      <div className="grid h-full grid-cols-[0.92fr_1.08fr] gap-[7%] pb-[5%]">
        <div className="flex flex-col justify-between">
          <SlideEyebrow accent={presentation.accent}>{slide.eyebrow}</SlideEyebrow>
          <div className="flex flex-col gap-[39px]">
            <SlideTitle size="md" className="max-w-[16ch]">
              {slide.title}
            </SlideTitle>
            <SlideBody>{slide.body}</SlideBody>
          </div>
        </div>
        <div className="grid min-h-0 grid-rows-[1fr_auto] gap-[5%]">
          {slide.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl(slide.imageSrc)}
              alt={slide.imageAlt ?? ""}
              className="block h-auto max-h-[520px] w-auto max-w-full self-center justify-self-center object-contain"
            />
          ) : slide.chart ? (
            <SlideChartVisual chart={slide.chart} accent={presentation.accent} className="h-full" />
          ) : (
            <AbstractVisual
              accent={presentation.accent}
              variant={slide.visual === "split" ? "grid" : "orbital"}
              label={slide.imageDirection}
            />
          )}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-[3%]">
            {slide.bullets?.map((bullet, index) => (
              <div
                key={bullet}
                className="rounded-[10px] bg-white p-[8%] shadow-[var(--shadow-card,0_12px_28px_rgba(15,23,42,0.06))]"
              >
                <p className="mb-[8%] font-mono text-[15px] font-bold" style={{ color: presentation.accent }}>
                  0{index + 1}
                </p>
                <p className="text-[16px] font-semibold leading-[1.2] text-black">{bullet}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

