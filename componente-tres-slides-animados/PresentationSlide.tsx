import type { CommercialPresentation, CommercialSlide as CommercialSlideType } from "./types";
import { SlideCover } from "./slide-layouts/SlideCover";
import { SlideSplit } from "./slide-layouts/SlideSplit";
import { SlideStatement } from "./slide-layouts/SlideStatement";

export function PresentationSlide({
  presentation,
  slide,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlideType;
}) {
  if (slide.type === "cover") {
    return <SlideCover presentation={presentation} slide={slide} />;
  }

  if (slide.type === "statement") {
    return <SlideStatement presentation={presentation} slide={slide} />;
  }

  return <SlideSplit presentation={presentation} slide={slide} />;
}

