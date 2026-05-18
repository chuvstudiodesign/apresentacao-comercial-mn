import type { CommercialPresentation, CommercialSlide } from "../types";
import { imageUrl } from "../types";
import { ChamferedPanel } from "../chamfered-panel";
import {
  AbstractVisual,
  SlideBody,
  SlideEyebrow,
  SlideFooter,
  SlideLogo,
  SlideTitle,
} from "./SlidePrimitives";

export function SlideCover({
  presentation,
  slide,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
}) {
  return (
    <article className="relative flex h-full w-full overflow-hidden bg-[#D4D4D4] p-[20px] text-black">
      <ChamferedPanel
        strokeColor="#FFFFFF"
        strokeWidth={1}
        innerStyle={{
          background: "#ECECEC",
          borderRadius: 10,
          padding: 80,
        }}
      >
        <div className="relative z-10 flex min-h-0 w-full flex-col">
          <div className="flex items-start justify-between">
            <SlideLogo size="large" />
            <SlideEyebrow accent={presentation.accent}>{slide.eyebrow}</SlideEyebrow>
          </div>
          <div className="relative mt-[20px] min-h-0 flex-1">
            <div className="absolute left-0 top-1/2 z-20 flex w-[680px] max-w-[58%] -translate-y-1/2 flex-col items-start gap-[32px] text-left">
              <SlideTitle size="xl" className="max-w-[17ch] text-[85px] leading-[0.82]">
                {slide.title}
              </SlideTitle>
              <SlideBody className="max-w-[572px]">{slide.body}</SlideBody>
              <div className="flex flex-wrap gap-[12px] pt-[4px]">
                {slide.bullets?.map((bullet) => (
                  <span
                    key={bullet}
                    className="rounded-full bg-black px-[21px] py-[9px] text-[13px] font-bold uppercase tracking-[0.08em] text-white"
                  >
                    {bullet}
                  </span>
                ))}
              </div>
            </div>
            {slide.imageSrc ? (
              <div
                className="absolute left-[75%] top-1/2 z-10 w-[46%] rounded-[10px]"
                style={{
                  transform: "translate(-50%, -50%) scale(1.04)",
                  transformOrigin: "center center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl(slide.imageSrc)}
                  alt={slide.imageAlt ?? ""}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            ) : (
              <AbstractVisual
                accent={presentation.accent}
                label="Área para imagem editorial de negócios, tecnologia e transformação de mercado."
                className="h-full min-h-[450px]"
                variant="orbital"
              />
            )}
          </div>
        </div>
      </ChamferedPanel>
      <SlideFooter presentation={presentation} slide={slide} />
    </article>
  );
}

