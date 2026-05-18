import brasil2Image from "./assets/brasil-2.png";
import moinhoImage from "./assets/brasil-2-moinho.png";
import type { CommercialPresentation } from "./types";

export const presentation: CommercialPresentation = {
  id: "deck-01",
  slug: "futuro-negocios-brasil",
  title: "O Futuro\ndos Negócios\nno Brasil",
  subtitle: "Empreendedorismo, transformação de mercado e inovação aplicada.",
  description:
    "Modelo para abrir conversas estratégicas sobre novos mercados, mudanças econômicas e oportunidades para empresas brasileiras.",
  theme: "Empreendedorismo, transformação de mercado, inovação aplicada",
  style: "Editorial institucional com mapas de oportunidade e blocos de impacto.",
  useCase: "Propostas consultivas, palestras institucionais e reuniões com lideranças.",
  accent: "#5FC318",
  darkAccent: "#0C1C16",
  tags: ["Brasil", "Inovação", "Mercado"],
  slides: [
    {
      id: "futuro-negocios-brasil-01",
      type: "cover",
      visual: "editorial",
      eyebrow: "01 / 20 - Modelo comercial",
      footer: "MASI Negócios - Design System",
      title: "O Futuro\ndos Negócios\nno Brasil",
      subtitle: "Empreendedorismo, transformação de mercado e inovação aplicada.",
      body:
        "Modelo para abrir conversas estratégicas sobre novos mercados, mudanças econômicas e oportunidades para empresas brasileiras.",
      bullets: ["Brasil", "Inovação", "Mercado"],
      imageDirection:
        "Imagem sugerida: composição editorial sobre empreendedorismo, transformação de mercado, inovação aplicada, com arquitetura, negócios e tecnologia.",
      imageSrc: brasil2Image,
      imageAlt: "Visual editorial da apresentação comercial sobre negócios e inovação.",
    },
    {
      id: "futuro-negocios-brasil-02",
      type: "statement",
      visual: "quote",
      eyebrow: "02 / 20 - Tese central",
      footer: "MASI Negócios - Design System",
      title:
        "O futuro dos negócios no Brasil será decidido por empresas que combinam contexto local, tecnologia acessível e execução disciplinada.",
      quote:
        "O futuro dos negócios no Brasil será decidido por empresas que combinam contexto local, tecnologia acessível e execução disciplinada.",
      body: "Uma tese para alinhar liderança, narrativa comercial e prioridades de execução.",
      imageSrc: moinhoImage,
      imageAlt: "Moinho em composição editorial sobre negócios no Brasil.",
    },
    {
      id: "futuro-negocios-brasil-03",
      type: "context",
      visual: "split",
      eyebrow: "03 / 20 - Contexto",
      footer: "MASI Negócios - Design System",
      title: "O mercado mudou de ritmo",
      body:
        "O mercado brasileiro amadurece enquanto consumidores, distribuição e capital exigem negócios mais claros, digitais e eficientes.",
      bullets: [
        "Mais comparação entre experiências",
        "Ciclos de decisão menos lineares",
        "Pressão por eficiência e diferenciação",
      ],
      chart: {
        type: "line",
        valueLabel: "Empresas usando IA",
        insight:
          "A adoção saiu de maioria simples para padrão de mercado em menos de dois anos.",
        source: "McKinsey, State of AI 2025",
        data: [
          { label: "2023", value: 55 },
          { label: "Início 24", value: 72 },
          { label: "Fim 24", value: 78 },
        ],
      },
    },
  ],
};

