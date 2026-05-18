export type ImageAsset = string | { src: string };

export type CommercialSlideType =
  | "cover"
  | "statement"
  | "context";

export type CommercialSlideVisual =
  | "editorial"
  | "split"
  | "quote";

export type CommercialSlideChartDatum = {
  label: string;
  value: number;
  secondary?: number;
};

export type CommercialSlideChart = {
  type: "bar" | "line";
  valueLabel: string;
  secondaryLabel?: string;
  insight?: string;
  source?: string;
  data: CommercialSlideChartDatum[];
};

export type CommercialSlide = {
  id: string;
  type: CommercialSlideType;
  visual: CommercialSlideVisual;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  body?: string;
  quote?: string;
  bullets?: string[];
  chart?: CommercialSlideChart;
  footer?: string;
  imageDirection?: string;
  imageSrc?: ImageAsset;
  imageAlt?: string;
};

export type CommercialPresentation = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  theme: string;
  style: string;
  useCase: string;
  accent: string;
  darkAccent: string;
  tags: string[];
  slides: CommercialSlide[];
};

export function imageUrl(asset?: ImageAsset) {
  if (!asset) return undefined;
  return typeof asset === "string" ? asset : asset.src;
}

