# Componente: três slides animados

Esta pasta contém o bloco visual do hero com os três slides empilhados, sombra e animação de abertura no scroll.

## Como usar

Copie a pasta `componente-tres-slides-animados` para o outro projeto, de preferência dentro de `src/components/`.

Importe assim:

```tsx
import { StackedSlidesPreview } from "@/components/componente-tres-slides-animados";

export function MinhaSection() {
  return (
    <section className="min-h-[900px] bg-[#ECECEC] py-24">
      <StackedSlidesPreview />
    </section>
  );
}
```

## Requisitos

- Next.js/React com suporte a componentes client.
- Tailwind CSS com classes arbitrárias habilitadas.
- A pasta precisa ficar dentro de uma área escaneada pelo Tailwind, como `src/components`, para as classes serem geradas.

## Arquivos principais

- `StackedSlidesPreview.tsx`: controla o stack, sombras e animação por scroll.
- `PresentationSlide.tsx`: escolhe o layout do slide.
- `slide-layouts/`: layouts dos 3 primeiros slides.
- `data.ts`: dados exatos dos 3 slides.
- `assets/`: imagens e logos necessários.

## Observação

Se o outro projeto já tiver conteúdo próprio, o caminho mais simples é manter `StackedSlidesPreview` como está e editar apenas `data.ts`.

