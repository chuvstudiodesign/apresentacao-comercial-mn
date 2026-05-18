"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { Redo2, Save, Undo2, X } from "lucide-react";
import type {
  CommercialPresentation,
  CommercialSlide,
} from "@/data/commercial-presentations";
import { cn } from "@/lib/utils";

const CANVAS_W = 1600;
const CANVAS_H = 900;
const STORAGE_KEY = "quem-somos-presentation-editor-v1";

type TextField =
  | "title"
  | "body"
  | "quote"
  | `bullet-${number}`
  | `card-title-${number}`
  | `card-description-${number}`
  | `stat-value-${number}`
  | `stat-label-${number}`;

type SlideEditState = {
  slideId: string;
  textGroup: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  groups?: Record<
    string,
    {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  >;
  image?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  texts: Partial<Record<TextField, string>>;
};

type EditorDocument = {
  version: 1;
  presentationSlug: string;
  slides: SlideEditState[];
};

type DragState =
  | {
      type: "move";
      target: "group" | "image";
      groupKey?: string;
      slideId: string;
      startX: number;
      startY: number;
      originX: number;
      originY: number;
      scale: number;
    }
  | {
      type: "resize-image";
      slideId: string;
      corner: "nw" | "ne" | "sw" | "se";
      startX: number;
      startY: number;
      originX: number;
      originY: number;
      originW: number;
      originH: number;
      scale: number;
    }
  | {
      type: "resize-group";
      slideId: string;
      groupKey: string;
      side: "left" | "right";
      startX: number;
      originX: number;
      originW: number;
      scale: number;
    };

type SelectedState = {
  slideId: string;
  target: "group" | "image";
  groupKey?: string;
} | null;

type SaveState = "idle" | "saving" | "saved" | "error";

type HistoryState = {
  past: EditorDocument[];
  future: EditorDocument[];
};

type EditorContextValue = {
  document: EditorDocument;
  selected: SelectedState;
  saveState: SaveState;
  saveMessage: string;
  hasSelection: boolean;
  canUndo: boolean;
  canRedo: boolean;
  setSelected: (selected: SelectedState) => void;
  setDragState: (dragState: DragState | null) => void;
  updateText: (slideId: string, field: TextField, value: string) => void;
  undo: () => void;
  redo: () => void;
  cancel: () => void;
  save: () => Promise<void>;
};

const EditorContext = createContext<EditorContextValue | null>(null);

function useEditor() {
  const value = useContext(EditorContext);
  if (!value) {
    throw new Error("QuemSomosPresentationEditor context missing");
  }
  return value;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function cloneDocument(document: EditorDocument): EditorDocument {
  return JSON.parse(JSON.stringify(document)) as EditorDocument;
}

function documentsEqual(a: EditorDocument, b: EditorDocument) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function getEventScale(event: ReactMouseEvent) {
  const viewport = (event.currentTarget as HTMLElement).closest(
    "[data-editor-viewport]"
  ) as HTMLElement | null;

  return viewport ? viewport.getBoundingClientRect().width / CANVAS_W : 1;
}

function createTexts(slide: CommercialSlide): SlideEditState["texts"] {
  return {
    title: slide.title,
    body: slide.body ?? "",
    quote: slide.quote ?? "",
    ...Object.fromEntries(
      (slide.bullets ?? []).map((bullet, index) => [`bullet-${index}`, bullet])
    ),
    ...Object.fromEntries(
      (slide.cards ?? []).flatMap((card, index) => [
        [`card-title-${index}`, card.title],
        [`card-description-${index}`, card.description],
      ])
    ),
    ...Object.fromEntries(
      (slide.stats ?? []).flatMap((stat, index) => [
        [`stat-value-${index}`, stat.value],
        [`stat-label-${index}`, stat.label],
      ])
    ),
  };
}

function getInitialTextGroup(slide: CommercialSlide): SlideEditState["textGroup"] {
  if (slide.type === "cover") {
    return { x: 90, y: 381, width: 702, height: 326 };
  }

  if (slide.type === "statement" || slide.type === "principle" || slide.type === "turning-point") {
    return slide.imageSrc
      ? { x: 86, y: 174, width: 780, height: 560 }
      : { x: 86, y: 202, width: 900, height: 520 };
  }

  if (slide.type === "closing") {
    return { x: 86, y: 270, width: 1180, height: 430 };
  }

  if (slide.type === "framework" || slide.type === "decision") {
    return { x: 90, y: 90, width: 1420, height: 650 };
  }

  if (
    slide.type === "leaders" ||
    slide.type === "action-plan" ||
    slide.type === "benefits" ||
    slide.type === "recommendations"
  ) {
    return { x: 90, y: 90, width: 1420, height: 620 };
  }

  if (slide.type === "stats" || slide.type === "risks") {
    return { x: 90, y: 90, width: 1420, height: 610 };
  }

  return { x: 90, y: 90, width: 1420, height: 630 };
}

function getInitialGroups(slide: CommercialSlide): NonNullable<SlideEditState["groups"]> {
  const main = getInitialTextGroup(slide);

  if (slide.type === "cover") {
    return { main };
  }

  if (slide.type === "statement" || slide.type === "principle" || slide.type === "turning-point") {
    return { main };
  }

  if (slide.type === "closing") {
    return {
      main: { x: 86, y: 270, width: 720, height: 430 },
      quote: { x: 880, y: 430, width: 420, height: 220 },
    };
  }

  if (slide.type === "framework" || slide.type === "decision") {
    return {
      heading: { x: 90, y: 90, width: 580, height: 185 },
      body: { x: 750, y: 102, width: 560, height: 120 },
      cards: { x: 90, y: 305, width: 1420, height: 460 },
    };
  }

  if (
    slide.type === "leaders" ||
    slide.type === "action-plan" ||
    slide.type === "benefits" ||
    slide.type === "recommendations"
  ) {
    return {
      heading: { x: 90, y: 90, width: 430, height: 380 },
      cards: { x: 590, y: 90, width: 860, height: 560 },
    };
  }

  if (slide.type === "stats" || slide.type === "risks") {
    return {
      heading: { x: 90, y: 90, width: 520, height: 420 },
      stats: { x: 700, y: 90, width: 800, height: 520 },
    };
  }

  return {
    heading: { x: 90, y: 90, width: 500, height: 560 },
    bullets: { x: 650, y: 570, width: 790, height: 210 },
  };
}

function getInitialImage(slide: CommercialSlide): SlideEditState["image"] {
  if (!slide.imageSrc) return undefined;

  if (slide.type === "cover") {
    return { x: 914, y: 174, width: 464, height: 552 };
  }

  if (slide.type === "turning-point") {
    return { x: 920, y: 120, width: 570, height: 660 };
  }

  return { x: 870, y: 150, width: 560, height: 520 };
}

function createInitialDocument(presentation: CommercialPresentation): EditorDocument {
  return {
    version: 1,
    presentationSlug: presentation.slug,
    slides: presentation.slides.map((slide) => ({
      slideId: slide.id,
      textGroup: getInitialTextGroup(slide),
      groups: getInitialGroups(slide),
      image: getInitialImage(slide),
      texts: createTexts(slide),
    })),
  };
}

function readStorage(slug: string): EditorDocument | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as EditorDocument;
    return parsed.presentationSlug === slug ? parsed : null;
  } catch {
    return null;
  }
}

function mergeDocument(
  stored: EditorDocument | null,
  initial: EditorDocument
): EditorDocument {
  if (!stored) return initial;

  return {
    ...initial,
    slides: initial.slides.map((initialSlide) => {
      const storedSlide = stored.slides.find(
        (slide) => slide.slideId === initialSlide.slideId
      );

      return storedSlide
        ? {
            ...initialSlide,
            ...storedSlide,
            groups: {
              ...initialSlide.groups,
              ...(!storedSlide.groups && storedSlide.textGroup
                ? { main: storedSlide.textGroup }
                : {}),
              ...storedSlide.groups,
            },
            texts: { ...initialSlide.texts, ...storedSlide.texts },
          }
        : initialSlide;
    }),
  };
}

function updateSlide(
  document: EditorDocument,
  slideId: string,
  updater: (slide: SlideEditState) => SlideEditState
): EditorDocument {
  return {
    ...document,
    slides: document.slides.map((slide) =>
      slide.slideId === slideId ? updater(slide) : slide
    ),
  };
}

function EditableText({
  slideId,
  field,
  className,
  fallback,
  groupKey = "main",
}: {
  slideId: string;
  field: TextField;
  className?: string;
  fallback?: string;
  groupKey?: string;
}) {
  const { document, setSelected, updateText } = useEditor();
  const ref = useRef<HTMLDivElement>(null);
  const slideState = document.slides.find((slide) => slide.slideId === slideId);
  const value = slideState?.texts[field] ?? fallback ?? "";

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={cn("cursor-text whitespace-pre-wrap outline-none", className)}
      onMouseDown={() => setSelected({ slideId, target: "group", groupKey })}
      onFocus={() => setSelected({ slideId, target: "group", groupKey })}
      onInput={(event) => updateText(slideId, field, event.currentTarget.innerText)}
    >
      {value}
    </div>
  );
}

function EditorFrame({
  presentation,
  slide,
  children,
  dark = false,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative h-full w-full overflow-hidden",
        dark ? "text-white" : "bg-[#ECECEC] text-black"
      )}
      style={
        dark
          ? {
              background: `linear-gradient(135deg, ${presentation.darkAccent} 0%, #0C1C16 68%, #000000 100%)`,
            }
          : undefined
      }
    >
      {children}
      <div
        className={cn(
          "absolute bottom-[4.6%] left-[5.4%] right-[5.4%] z-20 flex items-center justify-between text-[13px] font-semibold uppercase tracking-[0.08em]",
          dark ? "text-white/42" : "text-black/38"
        )}
      >
        <span>{slide.footer}</span>
        <span>{presentation.title}</span>
      </div>
    </section>
  );
}

function EditableImage({ slide, slideState }: { slide: CommercialSlide; slideState: SlideEditState }) {
  const { selected, setSelected, setDragState } = useEditor();
  if (!slide.imageSrc || !slideState.image) return null;

  const isSelected = selected?.slideId === slide.id && selected.target === "image";

  return (
    <div
      className={cn(
        "absolute z-10 select-none",
        isSelected && "outline outline-2 outline-[#5FC318]"
      )}
      style={{
        left: slideState.image.x,
        top: slideState.image.y,
        width: slideState.image.width,
        height: slideState.image.height,
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
        setSelected({ slideId: slide.id, target: "image" });
        setDragState({
          type: "move",
          target: "image",
          slideId: slide.id,
          startX: event.clientX,
          startY: event.clientY,
          originX: slideState.image?.x ?? 0,
          originY: slideState.image?.y ?? 0,
          scale: getEventScale(event),
        });
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.imageSrc.src}
        alt={slide.imageAlt ?? ""}
        className="h-full w-full object-contain"
        draggable={false}
      />
      {isSelected &&
        (["nw", "ne", "sw", "se"] as const).map((corner) => (
          <button
            key={corner}
            type="button"
            aria-label={`Redimensionar imagem ${corner}`}
            className={cn(
              "absolute h-4 w-4 rounded-[3px] border-2 border-[#5FC318] bg-white shadow-sm",
              corner === "nw" && "-left-2 -top-2 cursor-nwse-resize",
              corner === "ne" && "-right-2 -top-2 cursor-nesw-resize",
              corner === "sw" && "-bottom-2 -left-2 cursor-nesw-resize",
              corner === "se" && "-bottom-2 -right-2 cursor-nwse-resize"
            )}
            onMouseDown={(event) => {
              event.stopPropagation();
              setSelected({ slideId: slide.id, target: "image" });
              setDragState({
                type: "resize-image",
                slideId: slide.id,
                corner,
                startX: event.clientX,
                startY: event.clientY,
                originX: slideState.image?.x ?? 0,
                originY: slideState.image?.y ?? 0,
                originW: slideState.image?.width ?? 0,
                originH: slideState.image?.height ?? 0,
                scale: getEventScale(event),
              });
            }}
          />
        ))}
    </div>
  );
}

function TextGroup({
  slide,
  slideState,
  children,
  className,
  groupKey = "main",
}: {
  slide: CommercialSlide;
  slideState: SlideEditState;
  children: ReactNode;
  className?: string;
  groupKey?: string;
}) {
  const { selected, setSelected, setDragState } = useEditor();
  const group = slideState.groups?.[groupKey] ?? slideState.textGroup;
  const isSelected =
    selected?.slideId === slide.id &&
    selected.target === "group" &&
    selected.groupKey === groupKey;

  function startMove(event: ReactMouseEvent) {
    if ((event.target as HTMLElement).isContentEditable) return;

    event.stopPropagation();
    setSelected({ slideId: slide.id, target: "group", groupKey });
    setDragState({
      type: "move",
      target: "group",
      groupKey,
      slideId: slide.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: group.x,
      originY: group.y,
      scale: getEventScale(event),
    });
  }

  return (
    <div
      className={cn(
        "absolute z-20 select-none",
        isSelected && "outline outline-2 outline-[#5FC318]",
        className
      )}
      style={{
        left: group.x,
        top: group.y,
        width: group.width,
        minHeight: group.height,
      }}
      onMouseDown={startMove}
    >
      {children}
      {isSelected &&
        (["left", "right"] as const).map((side) => (
          <button
            key={side}
            type="button"
            aria-label={`Ajustar largura ${side}`}
            className={cn(
              "absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-ew-resize rounded-[3px] border-2 border-[#5FC318] bg-white shadow-sm",
              side === "left" ? "-left-2" : "-right-2"
            )}
            onMouseDown={(event) => {
              event.stopPropagation();
              setSelected({ slideId: slide.id, target: "group", groupKey });
              setDragState({
                type: "resize-group",
                slideId: slide.id,
                groupKey,
                side,
                startX: event.clientX,
                originX: group.x,
                originW: group.width,
                scale: getEventScale(event),
              });
            }}
          />
        ))}
    </div>
  );
}

function SlideChrome({
  presentation,
  slide,
  dark = false,
  largeLogo = false,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  dark?: boolean;
  largeLogo?: boolean;
}) {
  return (
    <div className="absolute left-[90px] right-[90px] top-[90px] z-30 flex items-start justify-between">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark ? "/logos/primary/masi-primary-light.svg" : "/logos/primary/masi-primary-dark.svg"}
        alt="MASI"
        style={{ height: largeLogo ? 29 : 23, width: "auto" }}
      />
      <p
        className={cn(
          "text-[15px] font-bold uppercase leading-none tracking-[0.08em]",
          dark ? "text-white/70" : "text-black/55"
        )}
        style={{ color: dark ? "rgba(255,255,255,0.72)" : presentation.accent }}
      >
        {slide.eyebrow}
      </p>
    </div>
  );
}

function EditableCover({
  presentation,
  slide,
  slideState,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  slideState: SlideEditState;
}) {
  return (
    <EditorFrame presentation={presentation} slide={slide}>
      <SlideChrome presentation={presentation} slide={slide} />
      <TextGroup slide={slide} slideState={slideState}>
        <div className="flex flex-col justify-end gap-[30px]">
          <EditableText
            slideId={slide.id}
            field="title"
            className="max-w-[17ch] text-[104px] font-extrabold leading-[0.84] tracking-normal"
          />
          <EditableText
            slideId={slide.id}
            field="body"
            className="max-w-[48ch] text-[22px] leading-[1.45] text-black/62"
          />
          <div className="flex flex-wrap gap-[14px] pt-[2px]">
            {slide.bullets?.map((bullet, index) => (
              <span
                key={index}
                className="rounded-full bg-black px-[18px] py-[8px] text-[12px] font-bold uppercase tracking-[0.08em] text-white"
              >
                <EditableText
                  slideId={slide.id}
                  field={`bullet-${index}`}
                  fallback={bullet}
                />
              </span>
            ))}
          </div>
        </div>
      </TextGroup>
      <EditableImage slide={slide} slideState={slideState} />
    </EditorFrame>
  );
}

function EditableStatement({
  presentation,
  slide,
  slideState,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  slideState: SlideEditState;
}) {
  const dark = slide.visual === "quote" || slide.visual === "dark";

  return (
    <EditorFrame presentation={presentation} slide={slide} dark={dark}>
      {!slide.imageSrc && <SlideChrome presentation={presentation} slide={slide} dark={dark} />}
      <TextGroup slide={slide} slideState={slideState}>
        <div className="flex flex-col gap-[32px]">
          {slide.imageSrc && (
            <p className="text-[15px] font-bold uppercase leading-none tracking-[0.08em] text-white/70">
              {slide.eyebrow}
            </p>
          )}
          <EditableText
            slideId={slide.id}
            field={slide.quote ? "quote" : "title"}
            className="max-w-[22ch] text-[68px] font-extrabold leading-[0.9] tracking-normal"
          />
          <div className="h-[6px] w-[18%] rounded-full" style={{ background: presentation.accent }} />
          <EditableText
            slideId={slide.id}
            field="body"
            className={cn(
              "max-w-[54ch] text-[22px] leading-[1.45]",
              dark ? "text-white/72" : "text-black/62"
            )}
          />
        </div>
      </TextGroup>
      <EditableImage slide={slide} slideState={slideState} />
    </EditorFrame>
  );
}

function EditableSplit({
  presentation,
  slide,
  slideState,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  slideState: SlideEditState;
}) {
  return (
    <EditorFrame presentation={presentation} slide={slide}>
      <TextGroup slide={slide} slideState={slideState} groupKey="heading">
        <div className="flex min-h-[560px] flex-col justify-between">
          <p className="text-[15px] font-bold uppercase leading-none tracking-[0.08em]" style={{ color: presentation.accent }}>
            {slide.eyebrow}
          </p>
          <div className="flex flex-col gap-[39px]">
            <EditableText
              slideId={slide.id}
              field="title"
              groupKey="heading"
              className="max-w-[16ch] text-[53px] font-extrabold leading-[0.96] tracking-normal"
            />
            <EditableText
              slideId={slide.id}
              field="body"
              groupKey="heading"
              className="max-w-[42ch] text-[22px] leading-[1.45] text-black/62"
            />
          </div>
        </div>
      </TextGroup>
      <TextGroup slide={slide} slideState={slideState} groupKey="bullets">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-[18px]">
          {slide.bullets?.map((bullet, index) => (
            <div key={index} className="rounded-[10px] bg-white p-[24px] shadow-[var(--shadow-card)]">
              <p className="mb-[18px] font-mono text-[15px] font-bold" style={{ color: presentation.accent }}>
                0{index + 1}
              </p>
              <EditableText
                slideId={slide.id}
                field={`bullet-${index}`}
                fallback={bullet}
                groupKey="bullets"
                className="text-[16px] font-semibold leading-[1.2] text-black"
              />
            </div>
          ))}
        </div>
      </TextGroup>
      <EditableImage slide={slide} slideState={slideState} />
    </EditorFrame>
  );
}

function EditableFramework({
  presentation,
  slide,
  slideState,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  slideState: SlideEditState;
}) {
  return (
    <EditorFrame presentation={presentation} slide={slide}>
      <TextGroup slide={slide} slideState={slideState} groupKey="heading">
        <p className="text-[15px] font-bold uppercase leading-none tracking-[0.08em]" style={{ color: presentation.accent }}>
          {slide.eyebrow}
        </p>
        <EditableText
          slideId={slide.id}
          field="title"
          groupKey="heading"
          className="mt-[22px] max-w-[17ch] text-[53px] font-extrabold leading-[0.96] tracking-normal"
        />
      </TextGroup>
      <TextGroup slide={slide} slideState={slideState} groupKey="body">
        <EditableText
          slideId={slide.id}
          field="body"
          groupKey="body"
          className="max-w-[45ch] pt-[1%] text-[22px] leading-[1.45] text-black/62"
        />
      </TextGroup>
      <TextGroup slide={slide} slideState={slideState} groupKey="cards">
        <div className="grid grid-cols-2 grid-rows-2 gap-[22px]">
          {slide.cards?.map((card, index) => (
            <div key={index} className="relative min-h-[205px] overflow-hidden rounded-[10px] bg-white p-[28px] shadow-[var(--shadow-card)]">
              <p className="font-mono text-[15px] font-bold" style={{ color: presentation.accent }}>
                0{index + 1}
              </p>
              <EditableText
                slideId={slide.id}
                field={`card-title-${index}`}
                fallback={card.title}
                groupKey="cards"
                className="mt-[28px] text-[28px] font-extrabold leading-[1] tracking-normal text-black"
              />
              <EditableText
                slideId={slide.id}
                field={`card-description-${index}`}
                fallback={card.description}
                groupKey="cards"
                className="mt-[16px] max-w-[32ch] text-[15px] leading-[1.28] text-black/58"
              />
            </div>
          ))}
        </div>
      </TextGroup>
    </EditorFrame>
  );
}

function EditableCards({
  presentation,
  slide,
  slideState,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  slideState: SlideEditState;
}) {
  return (
    <EditorFrame presentation={presentation} slide={slide}>
      <TextGroup slide={slide} slideState={slideState} groupKey="heading">
        <div className="flex flex-col gap-[34px]">
          <p className="text-[15px] font-bold uppercase leading-none tracking-[0.08em]" style={{ color: presentation.accent }}>
            {slide.eyebrow}
          </p>
          <EditableText
            slideId={slide.id}
            field="title"
            groupKey="heading"
            className="max-w-[13ch] text-[53px] font-extrabold leading-[0.96] tracking-normal"
          />
          <EditableText
            slideId={slide.id}
            field="body"
            groupKey="heading"
            className="max-w-[42ch] text-[22px] leading-[1.45] text-black/62"
          />
        </div>
      </TextGroup>
      <TextGroup slide={slide} slideState={slideState} groupKey="cards">
        <div className="grid grid-cols-2 gap-[18px]">
          {slide.cards?.map((card, index) => (
            <div key={index} className="relative min-h-[230px] overflow-hidden rounded-[10px] bg-white p-[28px] shadow-[var(--shadow-card)]">
              <div
                className="mb-[32px] flex h-[48px] w-[48px] items-center justify-center rounded-full font-mono text-[15px] font-bold text-black"
                style={{ background: index === 0 ? presentation.accent : "#ECECEC" }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <EditableText
                slideId={slide.id}
                field={`card-title-${index}`}
                fallback={card.title}
                groupKey="cards"
                className="mb-[16px] text-[23px] font-bold leading-[1.08] tracking-normal text-black"
              />
              <EditableText
                slideId={slide.id}
                field={`card-description-${index}`}
                fallback={card.description}
                groupKey="cards"
                className="text-[15px] leading-[1.35] text-black/58"
              />
            </div>
          ))}
        </div>
      </TextGroup>
    </EditorFrame>
  );
}

function EditableStats({
  presentation,
  slide,
  slideState,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  slideState: SlideEditState;
}) {
  const dark = slide.type === "risks";

  return (
    <EditorFrame presentation={presentation} slide={slide} dark={dark}>
      <TextGroup slide={slide} slideState={slideState} groupKey="heading">
        <div className="flex flex-col gap-[38px]">
          <p className={cn("text-[15px] font-bold uppercase leading-none tracking-[0.08em]", dark ? "text-white/70" : "text-black/55")} style={{ color: dark ? undefined : presentation.accent }}>
            {slide.eyebrow}
          </p>
          <EditableText
            slideId={slide.id}
            field="title"
            groupKey="heading"
            className="max-w-[12ch] text-[53px] font-extrabold leading-[0.96] tracking-normal"
          />
          <EditableText
            slideId={slide.id}
            field="body"
            groupKey="heading"
            className={cn("max-w-[42ch] text-[22px] leading-[1.45]", dark ? "text-white/72" : "text-black/62")}
          />
        </div>
      </TextGroup>
      <TextGroup slide={slide} slideState={slideState} groupKey="stats">
        <div className="flex flex-col gap-[18px]">
          {slide.stats?.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "relative isolate flex items-center gap-[34px] overflow-hidden rounded-[10px] px-[44px] py-[34px]",
                dark ? "border border-white/18 bg-white/[0.08]" : "bg-white shadow-[var(--shadow-card)]"
              )}
            >
              <EditableText
                slideId={slide.id}
                field={`stat-value-${index}`}
                fallback={stat.value}
                groupKey="stats"
                className="shrink-0 font-mono text-[56px] font-bold leading-none tracking-normal"
              />
              <EditableText
                slideId={slide.id}
                field={`stat-label-${index}`}
                fallback={stat.label}
                groupKey="stats"
                className={cn("text-[17px] font-semibold leading-[1.3]", dark ? "text-white/72" : "text-black/68")}
              />
            </div>
          ))}
        </div>
      </TextGroup>
    </EditorFrame>
  );
}

function EditableClosing({
  presentation,
  slide,
  slideState,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  slideState: SlideEditState;
}) {
  return (
    <EditorFrame presentation={presentation} slide={slide} dark>
      <SlideChrome presentation={presentation} slide={slide} dark largeLogo />
      <TextGroup slide={slide} slideState={slideState}>
        <div className="flex flex-col gap-[40px]">
          <EditableText
            slideId={slide.id}
            field="title"
            className="max-w-[15ch] text-[72px] font-extrabold leading-[0.84] tracking-normal"
          />
          <EditableText
            slideId={slide.id}
            field="body"
            className="max-w-[50ch] text-[22px] leading-[1.45] text-white/72"
          />
        </div>
      </TextGroup>
      <TextGroup slide={slide} slideState={slideState} groupKey="quote">
        <div className="flex flex-col justify-end gap-[38px]">
          <EditableText
            slideId={slide.id}
            field="quote"
            groupKey="quote"
            className="text-[28px] font-semibold leading-[1.08] text-white/80"
          />
          <div className="h-[8px] w-full rounded-full" style={{ background: presentation.accent }} />
        </div>
      </TextGroup>
    </EditorFrame>
  );
}

function EditableSlideContent({
  presentation,
  slide,
  slideState,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
  slideState: SlideEditState;
}) {
  if (slide.type === "cover") {
    return <EditableCover presentation={presentation} slide={slide} slideState={slideState} />;
  }

  if (slide.type === "closing") {
    return <EditableClosing presentation={presentation} slide={slide} slideState={slideState} />;
  }

  if (slide.type === "statement" || slide.type === "principle" || slide.type === "turning-point") {
    return <EditableStatement presentation={presentation} slide={slide} slideState={slideState} />;
  }

  if (slide.type === "framework" || slide.type === "decision") {
    return <EditableFramework presentation={presentation} slide={slide} slideState={slideState} />;
  }

  if (
    slide.type === "leaders" ||
    slide.type === "action-plan" ||
    slide.type === "benefits" ||
    slide.type === "recommendations"
  ) {
    return <EditableCards presentation={presentation} slide={slide} slideState={slideState} />;
  }

  if (slide.type === "stats" || slide.type === "risks") {
    return <EditableStats presentation={presentation} slide={slide} slideState={slideState} />;
  }

  return <EditableSplit presentation={presentation} slide={slide} slideState={slideState} />;
}

export function QuemSomosEditableSlide({
  presentation,
  slide,
}: {
  presentation: CommercialPresentation;
  slide: CommercialSlide;
}) {
  const { document, selected, setSelected } = useEditor();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const slideState =
    document.slides.find((item) => item.slideId === slide.id) ??
    createInitialDocument(presentation).slides[0];

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setScale((entry?.contentRect.width ?? CANVAS_W) / CANVAS_W);
    });

    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setSelected(null);
  }, [setSelected, slide.id]);

  return (
      <div
        data-editor-viewport
        ref={viewportRef}
        className="relative aspect-video w-full overflow-hidden bg-[#D4D4D4] shadow-[var(--shadow-card)]"
    >
      <div
        className="absolute left-0 top-0 h-[900px] w-[1600px] origin-top-left overflow-hidden bg-[#D4D4D4] p-[20px] text-black"
        style={{ transform: `scale(${scale})` }}
        onMouseDown={() => {
          if (selected?.slideId === slide.id) setSelected(null);
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[10px]">
          <EditableSlideContent
            presentation={presentation}
            slide={slide}
            slideState={slideState}
          />
        </div>
      </div>
    </div>
  );
}

export function QuemSomosPresentationEditor({
  presentation,
  children,
}: {
  presentation: CommercialPresentation;
  children: ReactNode;
}) {
  const initialDocument = useMemo(
    () => createInitialDocument(presentation),
    [presentation]
  );
  const [document, setDocument] = useState<EditorDocument>(initialDocument);
  const [selected, setSelected] = useState<SelectedState>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const currentDocumentRef = useRef(initialDocument);
  const committedDocumentRef = useRef(initialDocument);
  const dragStartDocumentRef = useRef<EditorDocument | null>(null);

  function replaceDocument(nextDocument: EditorDocument) {
    currentDocumentRef.current = nextDocument;
    setDocument(nextDocument);
  }

  function pushHistory(before: EditorDocument, after: EditorDocument) {
    if (documentsEqual(before, after)) return;

    setHistory((current) => ({
      past: [...current.past.slice(-49), cloneDocument(before)],
      future: [],
    }));
  }

  function applyDocumentChange(
    updater: (current: EditorDocument) => EditorDocument
  ) {
    setDocument((current) => {
      const before = cloneDocument(current);
      const nextDocument = updater(current);

      currentDocumentRef.current = nextDocument;
      pushHistory(before, nextDocument);

      return nextDocument;
    });
    setSaveState("idle");
    setSaveMessage("");
  }

  function handleSetDragState(nextDragState: DragState | null) {
    if (nextDragState && !dragState) {
      dragStartDocumentRef.current = cloneDocument(currentDocumentRef.current);
    }

    if (!nextDragState && dragStartDocumentRef.current) {
      pushHistory(dragStartDocumentRef.current, currentDocumentRef.current);
      dragStartDocumentRef.current = null;
    }

    setDragState(nextDragState);
  }

  useEffect(() => {
    const hydratedDocument = mergeDocument(
      readStorage(presentation.slug),
      initialDocument
    );

    committedDocumentRef.current = cloneDocument(hydratedDocument);
    currentDocumentRef.current = hydratedDocument;
    setDocument(hydratedDocument);
    setHistory({ past: [], future: [] });
    setSaveState("idle");
    setSaveMessage("");
  }, [initialDocument, presentation.slug]);

  useEffect(() => {
    if (!dragState) return;

    const onMove = (event: MouseEvent) => {
      const dx = (event.clientX - dragState.startX) / dragState.scale;
      const dy =
        "startY" in dragState
          ? (event.clientY - dragState.startY) / dragState.scale
          : 0;

      setDocument((current) => {
        const nextDocument = updateSlide(current, dragState.slideId, (slide) => {
          if (dragState.type === "move") {
            const layer =
              dragState.target === "image"
                ? slide.image
                : (slide.groups?.[dragState.groupKey ?? "main"] ?? slide.textGroup);
            if (!layer) return slide;

            if (dragState.target === "group") {
              const groupKey = dragState.groupKey ?? "main";

              return {
                ...slide,
                groups: {
                  ...slide.groups,
                  [groupKey]: {
                    ...layer,
                    x: clamp(dragState.originX + dx, -300, CANVAS_W - 80),
                    y: clamp(dragState.originY + dy, -300, CANVAS_H - 80),
                  },
                },
              };
            }

            return {
              ...slide,
              image: {
                ...layer,
                x: clamp(dragState.originX + dx, -300, CANVAS_W - 80),
                y: clamp(dragState.originY + dy, -300, CANVAS_H - 80),
              },
            };
          }

          if (dragState.type === "resize-group") {
            const group = slide.groups?.[dragState.groupKey] ?? slide.textGroup;
            const minWidth = 140;
            let x = group.x;
            let width = group.width;

            if (dragState.side === "right") {
              width = clamp(dragState.originW + dx, minWidth, CANVAS_W);
            } else {
              width = clamp(dragState.originW - dx, minWidth, CANVAS_W);
              x = dragState.originX + (dragState.originW - width);
            }

            return {
              ...slide,
              groups: {
                ...slide.groups,
                [dragState.groupKey]: {
                  ...group,
                  x,
                  width,
                },
              },
            };
          }

          if (!slide.image) return slide;

          const minSize = 120;
          const image = { ...slide.image };

          if (dragState.corner.includes("e")) {
            image.width = clamp(dragState.originW + dx, minSize, CANVAS_W);
          }
          if (dragState.corner.includes("s")) {
            image.height = clamp(dragState.originH + dy, minSize, CANVAS_H);
          }
          if (dragState.corner.includes("w")) {
            const width = clamp(dragState.originW - dx, minSize, CANVAS_W);
            image.x = dragState.originX + (dragState.originW - width);
            image.width = width;
          }
          if (dragState.corner.includes("n")) {
            const height = clamp(dragState.originH - dy, minSize, CANVAS_H);
            image.y = dragState.originY + (dragState.originH - height);
            image.height = height;
          }

          return { ...slide, image };
        });

        currentDocumentRef.current = nextDocument;
        return nextDocument;
      });
      setSaveState("idle");
      setSaveMessage("");
    };

    const onUp = () => handleSetDragState(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragState]);

  function updateText(slideId: string, field: TextField, value: string) {
    applyDocumentChange((current) =>
      updateSlide(current, slideId, (slide) => ({
        ...slide,
        texts: { ...slide.texts, [field]: value },
      }))
    );
  }

  function undo() {
    setHistory((currentHistory) => {
      const previousDocument = currentHistory.past.at(-1);
      if (!previousDocument) return currentHistory;

      const currentSnapshot = cloneDocument(currentDocumentRef.current);
      replaceDocument(cloneDocument(previousDocument));
      setSaveState("idle");
      setSaveMessage("");

      return {
        past: currentHistory.past.slice(0, -1),
        future: [currentSnapshot, ...currentHistory.future],
      };
    });
  }

  function redo() {
    setHistory((currentHistory) => {
      const nextDocument = currentHistory.future[0];
      if (!nextDocument) return currentHistory;

      const currentSnapshot = cloneDocument(currentDocumentRef.current);
      replaceDocument(cloneDocument(nextDocument));
      setSaveState("idle");
      setSaveMessage("");

      return {
        past: [...currentHistory.past, currentSnapshot],
        future: currentHistory.future.slice(1),
      };
    });
  }

  function cancel() {
    const committedDocument = cloneDocument(committedDocumentRef.current);

    replaceDocument(committedDocument);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(committedDocument));
    setHistory({ past: [], future: [] });
    setSelected(null);
    setSaveState("idle");
    setSaveMessage("Alterações canceladas");
  }

  async function save() {
    const payload = currentDocumentRef.current;

    setSaveState("saving");
    setSaveMessage("");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    try {
      const response = await fetch("/api/commercial-presentations/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Falha ao salvar");
      }

      setSaveState("saved");
      setSaveMessage("Salvo");
      committedDocumentRef.current = cloneDocument(payload);
      setHistory({ past: [], future: [] });
      setSelected(null);
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "Erro ao salvar");
    }
  }

  const hasUnsavedChanges = !documentsEqual(document, committedDocumentRef.current);

  const value = useMemo<EditorContextValue>(
    () => ({
      document,
      selected,
      saveState,
      saveMessage,
      hasSelection: selected !== null,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      setSelected,
      setDragState: handleSetDragState,
      updateText,
      undo,
      redo,
      cancel,
      save,
    }),
    [document, history.future.length, history.past.length, selected, saveMessage, saveState]
  );

  return (
    <EditorContext.Provider value={value}>
      {children}
      {selected && (
        <div className="fixed bottom-[30px] right-[30px] z-[80] flex items-center gap-2">
          {saveMessage && (
            <span
              className={cn(
                "rounded-[8px] bg-white px-3 py-2 text-xs font-semibold shadow-sm",
                saveState === "error" ? "text-red-700" : "text-black/60"
              )}
            >
              {saveMessage}
            </span>
          )}
          <button
            type="button"
            onClick={undo}
            onMouseDown={(event) => event.preventDefault()}
            disabled={history.past.length === 0}
            className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-white px-4 text-sm font-bold text-black shadow-[var(--shadow-card)] transition hover:bg-[#ECECEC] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Undo2 className="h-4 w-4" />
            Voltar
          </button>
          <button
            type="button"
            onClick={redo}
            onMouseDown={(event) => event.preventDefault()}
            disabled={history.future.length === 0}
            className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-white px-4 text-sm font-bold text-black shadow-[var(--shadow-card)] transition hover:bg-[#ECECEC] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Redo2 className="h-4 w-4" />
            Avançar
          </button>
          <button
            type="button"
            onClick={cancel}
            onMouseDown={(event) => event.preventDefault()}
            disabled={!hasUnsavedChanges}
            className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-white px-4 text-sm font-bold text-black shadow-[var(--shadow-card)] transition hover:bg-[#ECECEC] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <X className="h-4 w-4" />
            Cancelar
          </button>
          <button
            type="button"
            onClick={save}
            onMouseDown={(event) => event.preventDefault()}
            disabled={!hasUnsavedChanges || saveState === "saving"}
            className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#5FC318] px-4 text-sm font-bold text-black shadow-[var(--shadow-card)] transition hover:bg-[#AFF000]"
          >
            <Save className="h-4 w-4" />
            {saveState === "saving" ? "Salvando" : "Salvar"}
          </button>
        </div>
      )}
    </EditorContext.Provider>
  );
}
