import type { CommercialPresentation, CommercialSlide } from "../types";
import { imageUrl } from "../types";
import { SlideBody, SlideEyebrow, SlideFooter, SlideShell, SlideTitle } from "./SlidePrimitives";

export function SlideStatement({
  presentation,
  slide,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
}) {
  const dark = slide.visual === "quote";

  if (slide.imageSrc) {
    return (
      <article
        className="relative flex h-full w-full overflow-hidden p-[5.4%] text-white"
        style={{
          background: `linear-gradient(135deg, ${presentation.darkAccent} 0%, #0C1C16 68%, #000000 100%)`,
        }}
      >
        <div className="relative z-10 grid min-h-0 w-full grid-cols-[1fr_0.82fr] gap-[6%]">
          <div className="flex flex-col justify-center gap-[4%] pb-[5%]">
            <SlideEyebrow accent={presentation.accent} dark={dark}>
              {slide.eyebrow}
            </SlideEyebrow>
            <SlideTitle size="lg" className="max-w-[22ch] text-[64px] leading-[0.9]">
              {slide.quote ?? slide.title}
            </SlideTitle>
            <div className="h-[6px] w-[22%] rounded-full" style={{ background: presentation.accent }} />
            <SlideBody dark={dark} className="max-w-[44ch]">
              {slide.body}
            </SlideBody>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl(slide.imageSrc)}
          alt={slide.imageAlt ?? ""}
          className="absolute right-[3%] top-[57%] z-0 block h-auto max-h-[90%] w-auto max-w-[51%] -translate-y-1/2 object-contain"
        />
        <SlideFooter presentation={presentation} slide={slide} dark={dark} />
      </article>
    );
  }

  return (
    <SlideShell presentation={presentation} slide={slide} dark={dark}>
      <div className="flex h-full flex-col justify-center gap-[4%] pb-[5%]">
        <SlideEyebrow accent={presentation.accent} dark={dark}>
          {slide.eyebrow}
        </SlideEyebrow>
        <SlideTitle size="lg" className="max-w-[22ch] text-[68px] leading-[0.9]">
          {slide.quote ?? slide.title}
        </SlideTitle>
        <div className="h-[6px] w-[18%] rounded-full" style={{ background: presentation.accent }} />
        <SlideBody dark={dark} className="max-w-[54ch]">
          {slide.body}
        </SlideBody>
      </div>
    </SlideShell>
  );
}

