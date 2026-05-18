import type { CSSProperties, ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { ChamferedPanel } from "@/components/chamfered-panel";
import { Typography } from "@/components/typography";

const cardStyles = {
  borderRadius: 10,
  background: "#ffffff",
  padding: "30px",
  boxShadow: "var(--shadow-card)",
} as CSSProperties;

const sectionDemoStyle = {
  background: "#ECECEC",
  borderRadius: 10,
  padding: "80px 60px",
} as CSSProperties;

export function Section({
  title,
  eyebrow,
  subtitle,
  children,
  first = false,
  centered = false,
  hideSeparator = false,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children: ReactNode;
  first?: boolean;
  centered?: boolean;
  hideSeparator?: boolean;
}) {
  const content = (
    <>
      <div className={`${hideSeparator ? "mb-[var(--section-padding-y)]" : "mb-5"}${centered ? " text-center" : ""}`}>
        {eyebrow && (
          <p className="ds-caption mb-2 text-primary">{eyebrow}</p>
        )}
        <h1 className="ds-section-title">{title}</h1>
        {subtitle && <p className="ds-section-subtitle">{subtitle}</p>}
      </div>
      {!hideSeparator && <Separator className="mb-6 bg-white" />}
      {children}
    </>
  );

  if (first) {
    return (
      <section className="w-full">
        <ChamferedPanel
          strokeColor="#FFFFFF"
          strokeWidth={1}
          innerStyle={{
            background: "#ECECEC",
            borderRadius: 10,
            padding: "var(--section-padding-y) var(--section-padding-x)",
          }}
        >
          <div className="w-full">{content}</div>
        </ChamferedPanel>
      </section>
    );
  }

  return (
    <section className="ds-section">
      {content}
    </section>
  );
}

export function FoundationPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="ds-page-header px-1">
      <h1 className="ds-page-title">{title}</h1>
      {description && <p className="ds-page-description">{description}</p>}
    </header>
  );
}

function ImplementationCodeBlock({
  title,
  code,
}: {
  title: string;
  code: string;
}) {
  return (
    <div className="w-full">
      <Typography as="p" variant="label" className="mb-3 normal-case tracking-normal text-black">
        {title}
      </Typography>
      <div className="bg-[#D4D4D4] p-5 text-foreground">
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[12px] leading-6 text-foreground">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function SectionSystemBlock({
  first = false,
  eyebrow,
}: {
  first?: boolean;
  eyebrow?: string;
}) {
  return (
    <>
      <Section
        eyebrow={eyebrow}
        title="Princípio"
        subtitle="A section é o container que organiza um assunto completo dentro do fundo global."
        first={first}
      >
        <div className="flex flex-col gap-8">
          <div className="max-w-3xl">
            <h3 className="ds-h2 mb-2">Duas camadas, sempre nesta ordem.</h3>
            <p className="ds-body-sm text-muted-foreground">
              A base da página é o fundo global. Sobre ela entram os containers de section, que organizam cada assunto da tela. A primeira section recebe o chanfro da marca no canto superior esquerdo. As seguintes seguem o contorno padrão com radius de 10px. Dentro desse container vivem título, textos, ícones, imagens e os cards, que aprofundam e organizam o conteúdo da própria section.
            </p>
          </div>

          <div>
            <div className="flex flex-col gap-0">
              {[
                {
                  layer: "01",
                  name: "Base canvas",
                  color: "#D4D4D4",
                  description: "Fundo global da página. Cria o respiro externo e aparece entre uma section e outra.",
                },
                {
                  layer: "02",
                  name: "Section container",
                  color: "#ECECEC",
                  description: "Container principal do assunto. Usa radius de 10px e chanfro de 32px apenas na primeira section.",
                },
                {
                  layer: "03",
                  name: "Cards internos",
                  color: "#FFFFFF",
                  description: "Blocos usados para explicar, dividir e aprofundar o conteúdo que já está dentro da section.",
                },
              ].map((item) => (
                <div
                  key={item.layer}
                  className="flex items-center gap-4 border-b border-white py-3 last:border-0"
                >
                  <span className="w-6 shrink-0 font-mono text-[10px] font-bold text-primary">
                    {item.layer}
                  </span>
                  <div
                    className="h-8 w-8 shrink-0 rounded-[10px] border border-black/15"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <Typography as="p" variant="body" className="font-semibold text-foreground">{item.name}</Typography>
                    <Typography as="p" variant="code" className="mt-0.5 text-muted-foreground">{item.description}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Section Specs"
        subtitle="Regras fixas do container de section em qualquer página do foundation."
      >
        <div className="flex flex-col gap-4">
          {[
            {
              title: "Base Canvas",
              value: "#D4D4D4",
              note: "Background da página. Token: --background.",
            },
            {
              title: "Section",
              value: "#ECECEC",
              note: "Container do assunto. Token: --background-section.",
            },
            {
              title: "Corner Radius",
              value: "10px",
              note: "Arredondamento padrão do contorno da section em todas as páginas.",
            },
            {
              title: "Chamfer",
              value: "32px na primeira",
              note: "Corte diagonal aplicado apenas na primeira section para marcar a abertura da página.",
            },
            {
              title: "Padding",
              value: "80px × 60px",
              note: "80px no topo e na base. 60px nas laterais para organizar todo o conteúdo interno.",
            },
            {
              title: "Gap Vertical",
              value: "30px",
              note: "Espaço entre uma section e a seguinte no fluxo da página.",
            },
          ].map((spec) => (
            <div key={spec.title} className="ds-card !p-[30px] flex w-full max-w-md flex-col gap-1">
              <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">
                {spec.title}
              </Typography>
              <Typography as="p" variant="h3" className="text-foreground">
                {spec.value}
              </Typography>
              <Typography as="p" variant="body-sm" className="text-muted-foreground">
                {spec.note}
              </Typography>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Estrutura visual"
        subtitle="Exemplo de como a página monta a primeira section com chanfro e as seguintes com o contorno padrão."
      >
        <div className="bg-[#D4D4D4] p-[30px]">
          <div className="flex flex-col gap-[30px]">
            <div className="relative">
              <ChamferedPanel
                strokeColor="#FFFFFF"
                strokeWidth={1}
                innerStyle={sectionDemoStyle}
              >
              <div className="flex w-full flex-col gap-6">
                <div>
                  <div>
                    <Typography as="p" variant="label" className="normal-case tracking-normal text-primary">Section 1</Typography>
                    <Typography as="p" variant="h3" className="mt-1 text-foreground">Abertura com chanfro</Typography>
                    <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">
                      Primeira section da página com corte diagonal de 32px no canto superior esquerdo.
                    </Typography>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div style={cardStyles}>
                    <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">Card</Typography>
                    <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">Resumo principal do assunto.</Typography>
                  </div>
                  <div style={cardStyles}>
                    <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">Card</Typography>
                    <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">Complemento visual ou dado de apoio.</Typography>
                  </div>
                </div>
              </div>
              </ChamferedPanel>
            </div>

            <div style={sectionDemoStyle}>
              <div className="flex flex-col gap-6">
                <div>
                  <div>
                    <Typography as="p" variant="label" className="normal-case tracking-normal text-primary">Section 2</Typography>
                    <Typography as="p" variant="h3" className="mt-1 text-foreground">Contorno padrão</Typography>
                    <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">
                      Radius de 10px, sem chanfro, mantendo o mesmo padding estrutural.
                    </Typography>
                  </div>
                </div>
                <div style={cardStyles}>
                  <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">Card largo</Typography>
                  <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">
                    Quando o assunto precisa de uma leitura linear, um card único pode ocupar o bloco principal.
                  </Typography>
                </div>
              </div>
            </div>

            <div style={sectionDemoStyle}>
              <div className="flex flex-col gap-6">
                <div>
                  <div>
                    <Typography as="p" variant="label" className="normal-case tracking-normal text-primary">Section 3</Typography>
                    <Typography as="p" variant="h3" className="mt-1 text-foreground">Outro arranjo interno</Typography>
                    <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">
                      A terceira section muda a composição dos cards, mas preserva a mesma estrutura externa.
                    </Typography>
                  </div>
                </div>
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-6">
                  <div style={cardStyles}>
                    <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">Texto</Typography>
                    <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">Bloco principal para explicação, contexto ou narrativa.</Typography>
                  </div>
                  <div style={cardStyles}>
                    <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">Apoio</Typography>
                    <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">Card secundário para dado, ícone ou observação complementar.</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Padrão de implementação em Tailwind"
        subtitle="Referência prática de classes e tokens para montar a base da página e o container de section."
      >
        <div className="flex flex-col gap-4">
          {[
            {
              title: "BG PAGE",
              value: 'bg-[#D4D4D4]',
              note: "Fundo da página. Equivale ao base canvas.",
            },
            {
              title: "BG SECTION",
              value: 'bg-[#ECECEC]',
              note: "Fundo do container da section.",
            },
            {
              title: "RADIUS",
              value: 'rounded-[10px]',
              note: "Raio padrão da section, dos cards e dos blocos estruturais.",
            },
            {
              title: "PADDING SECTION",
              value: 'px-[60px] py-[80px]',
              note: "Padding estrutural do container da section.",
            },
            {
              title: "GAP ENTRE SECTIONS",
              value: 'gap-[30px]',
              note: "Distância vertical constante entre uma section e outra.",
            },
            {
              title: "PRIMEIRA SECTION",
              value: 'ChamferedPanel',
              note: "A primeira section usa o componente com chanfro em vez de um rounded simples.",
            },
          ].map((item) => (
            <div key={item.title} className="ds-card !p-[30px] flex w-full max-w-lg flex-col gap-1">
              <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">
                {item.title}
              </Typography>
              <Typography as="p" variant="code" className="text-foreground">
                {item.value}
              </Typography>
              <Typography as="p" variant="body-sm" className="text-muted-foreground">
                {item.note}
              </Typography>
            </div>
          ))}
          <div className="flex flex-col gap-6 pt-2">
            <ImplementationCodeBlock
              title="Section básica"
              code={`<section className="rounded-[10px] bg-[#ECECEC] px-[60px] py-[80px]">
  <h2 className="text-[32px] font-bold leading-none text-black">
    Título da section
  </h2>
  <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#474747]">
    Texto introdutório da section com o conteúdo principal do assunto.
  </p>
</section>`}
            />
            <ImplementationCodeBlock
              title="Código base da página com sections"
              code={`<div className="flex flex-col gap-[30px] bg-[#D4D4D4] p-[30px]">
  <ChamferedPanel
    innerStyle={{
      background: "#ECECEC",
      borderRadius: 10,
      padding: "80px 60px",
    }}
  >
    <div>{/* primeira section */}</div>
  </ChamferedPanel>

  <section className="rounded-[10px] bg-[#ECECEC] px-[60px] py-[80px]">
    {/* section seguinte */}
  </section>
</div>`}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Regras"
        subtitle="Conjunto fixo de decisões que mantém a hierarquia da página consistente."
      >
        <div className="flex flex-col gap-0">
          {[
            {
              index: "01",
              title: "Base sempre no background da página",
              note: "A página começa no base canvas #D4D4D4. Esse fundo nunca vira área principal de conteúdo.",
            },
            {
              index: "02",
              title: "Tudo vive dentro de uma section",
              note: "Nenhum conteúdo principal fica solto no background. Títulos, textos, imagens, ícones e cards entram sempre dentro da section.",
            },
            {
              index: "03",
              title: "Radius único e constante",
              note: "O raio estrutural é sempre 10px para manter a linguagem visual estável.",
            },
            {
              index: "04",
              title: "Gap e padding consistentes",
              note: "O espaço entre sections é 30px. Dentro da section, o padding é 80px no topo e na base com 60px nas laterais.",
            },
            {
              index: "05",
              title: "Sem section dentro de section",
              note: "A hierarquia é sempre page background, section, conteúdo e cards. Sections não são aninhadas entre si.",
            },
          ].map((rule) => (
            <div
              key={rule.index}
              className="flex items-start gap-4 border-b border-white py-4 last:border-0"
            >
              <span className="w-8 shrink-0 font-mono text-[10px] font-bold text-primary">
                {rule.index}
              </span>
              <div className="flex flex-col gap-1">
                <Typography as="p" variant="body" className="font-semibold text-foreground">
                  {rule.title}
                </Typography>
                <Typography as="p" variant="body-sm" className="text-muted-foreground">
                  {rule.note}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

export function CardSystemBlock({
  first = false,
  eyebrow,
}: {
  first?: boolean;
  eyebrow?: string;
}) {
  return (
    <>
      <Section
        eyebrow={eyebrow}
        title="Princípio"
        subtitle="O card é a terceira camada da hierarquia visual e recebe o conteúdo real da interface."
        first={first}
      >
        <div className="flex flex-col gap-8">
          <div className="max-w-3xl">
            <h3 className="ds-h2 mb-2">Três camadas, com o card no conteúdo final.</h3>
            <p className="ds-body-sm text-muted-foreground">
              A página começa no background global, passa pelo container da section e chega ao card. É no card que o conteúdo real ganha estrutura, contraste e leitura.
            </p>
            <p className="ds-body-sm mt-3 text-muted-foreground">
              O card vive sempre dentro das sections. Ele define a terceira camada visual, usa fundo branco e organiza blocos como títulos, textos, métricas, imagens, ícones e ações.
            </p>
          </div>

          <div className="flex flex-col gap-0">
            {[
              {
                layer: "01",
                name: "Base canvas",
                color: "#D4D4D4",
                description: "Fundo global da página. Cria o respiro e segura a hierarquia completa.",
              },
              {
                layer: "02",
                name: "Section container",
                color: "#ECECEC",
                description: "Agrupa o assunto da página e recebe o card como conteúdo principal.",
              },
              {
                layer: "03",
                name: "Card",
                color: "#FFFFFF",
                description: "Terceira camada. Onde o conteúdo real é organizado e ganha contraste.",
              },
            ].map((item) => (
              <div
                key={item.layer}
                className="flex items-center gap-4 border-b border-white py-3 last:border-0"
              >
                <span className="w-6 shrink-0 font-mono text-[10px] font-bold text-primary">
                  {item.layer}
                </span>
                <div
                  className="h-8 w-8 shrink-0 rounded-[10px] border border-black/15"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <Typography as="p" variant="body" className="font-semibold text-foreground">{item.name}</Typography>
                  <Typography as="p" variant="code" className="mt-0.5 text-muted-foreground">{item.description}</Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        title="Card Specs"
        subtitle="Especificações fixas do card como terceira camada da interface."
      >
        <div className="flex flex-col gap-4">
          {[
            {
              title: "Card",
              value: "#FFFFFF",
              note: "Fundo padrão do card. Token: --card.",
            },
            {
              title: "Corner Radius",
              value: "10px",
              note: "Raio padrão do card, alinhado à linguagem estrutural do sistema.",
            },
            {
              title: "Padding Interno",
              value: "30px × 30px",
              note: "Espaçamento interno base do card em todos os lados.",
            },
            {
              title: "Gap Interno",
              value: "16px a 24px",
              note: "Faixa de espaçamento entre blocos internos, conforme a densidade do conteúdo.",
            },
          ].map((spec) => (
            <div key={spec.title} className="ds-card !p-[30px] flex w-full max-w-md flex-col gap-1">
              <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">
                {spec.title}
              </Typography>
              <Typography as="p" variant="h3" className="text-foreground">
                {spec.value}
              </Typography>
              <Typography as="p" variant="body-sm" className="text-muted-foreground">
                {spec.note}
              </Typography>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Estrutura visual"
        subtitle="Exemplo prático de como o card se comporta dentro da section e que tipos de bloco ele pode conter."
      >
        <div className="bg-[#D4D4D4] p-[30px]">
          <ChamferedPanel
            strokeColor="#FFFFFF"
            strokeWidth={1}
            innerStyle={sectionDemoStyle}
          >
            <div className="flex flex-col gap-6">
              <div>
                <Typography as="p" variant="label" className="normal-case tracking-normal text-primary">Section</Typography>
                <Typography as="p" variant="h3" className="mt-1 text-foreground">Exemplo de card dentro da estrutura</Typography>
                <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">
                  O card organiza o conteúdo real sem quebrar a hierarquia da página.
                </Typography>
              </div>

              <div className="grid grid-cols-[1.2fr_0.8fr] gap-6">
                <div style={cardStyles}>
                  <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">Card principal</Typography>
                  <Typography as="p" variant="h3" className="mt-2 text-foreground">Título do conteúdo</Typography>
                  <Typography as="p" variant="body-sm" className="mt-3 text-muted-foreground">
                    Aqui entram texto, narrativa, contexto e qualquer bloco principal de leitura da section.
                  </Typography>
                  <div className="mt-5 flex gap-3">
                    <div className="rounded-[10px] bg-[#ECECEC] px-3 py-2">
                      <Typography as="p" variant="caption" className="normal-case tracking-normal text-foreground">Badge</Typography>
                    </div>
                    <div className="rounded-[10px] bg-[#ECECEC] px-3 py-2">
                      <Typography as="p" variant="caption" className="normal-case tracking-normal text-foreground">Ação</Typography>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div style={cardStyles}>
                    <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">Métrica</Typography>
                    <Typography as="p" variant="display" className="mt-2 text-foreground">24</Typography>
                    <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">Bloco compacto para número, indicador ou status.</Typography>
                  </div>
                  <div style={cardStyles}>
                    <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">Apoio</Typography>
                    <Typography as="p" variant="body-sm" className="mt-2 text-muted-foreground">O card também pode conter uma observação curta, mídia ou dado secundário.</Typography>
                  </div>
                </div>
              </div>
            </div>
          </ChamferedPanel>
        </div>
      </Section>

      <Section
        title="Padrão de implementação em Tailwind"
        subtitle="Conjunto de classes e decisões práticas para construir cards dentro da estrutura do sistema."
      >
        <div className="flex flex-col gap-4">
          {[
            {
              title: "BG CARD",
              value: 'bg-[#FFFFFF]',
              note: "Fundo do card.",
            },
            {
              title: "RADIUS",
              value: 'rounded-[10px]',
              note: "Raio do card.",
            },
            {
              title: "PADDING",
              value: 'p-[30px]',
              note: "Padding interno base do card em todos os lados.",
            },
            {
              title: "GAP INTERNO",
              value: 'gap-4 / gap-6',
              note: "Gap entre blocos internos.",
            },
            {
              title: "CONTEXTO",
              value: 'dentro da section',
              note: "O card sempre vive dentro da section.",
            },
          ].map((item) => (
            <div key={item.title} className="ds-card !p-[30px] flex w-full max-w-md flex-col gap-1">
              <Typography as="p" variant="label" className="normal-case tracking-normal text-foreground">
                {item.title}
              </Typography>
              <Typography as="p" variant="code" className="text-foreground">
                {item.value}
              </Typography>
              <Typography as="p" variant="body-sm" className="text-muted-foreground">
                {item.note}
              </Typography>
            </div>
          ))}
          <div className="flex flex-col gap-6 pt-2">
            <ImplementationCodeBlock
              title="Card básico"
              code={`<div className="rounded-[10px] bg-[#FFFFFF] p-[30px]">
  <h3 className="text-[18px] font-semibold text-black">
    Título do card
  </h3>
  <p className="mt-2 text-[13px] leading-6 text-[#474747]">
    Conteúdo principal do card com texto de apoio.
  </p>
</div>`}
            />
            <ImplementationCodeBlock
              title="Cards em grid dentro de uma section"
              code={`<section className="rounded-[10px] bg-[#ECECEC] px-[60px] py-[80px]">
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <div className="rounded-[10px] bg-[#FFFFFF] p-[30px]">
      {/* card 1 */}
    </div>

    <div className="rounded-[10px] bg-[#FFFFFF] p-[30px]">
      {/* card 2 */}
    </div>
  </div>
</section>`}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Regras"
        subtitle="Conjunto fixo de uso para manter o card coerente dentro da hierarquia visual."
      >
        <div className="flex flex-col gap-0">
          {[
            {
              index: "01",
              title: "Card sempre branco",
              note: "A terceira camada usa #FFFFFF para criar contraste claro contra a section.",
            },
            {
              index: "02",
              title: "Corner radius único",
              note: "O card segue o mesmo raio estrutural de 10px usado no sistema.",
            },
            {
              index: "03",
              title: "Conteúdo interno pode variar",
              note: "Textos, métricas, ícones, mídia, ações e blocos de apoio podem viver dentro do card.",
            },
            {
              index: "04",
              title: "Padding interno constante",
              note: "Topo, base, esquerda e direita seguem o padding base do card para preservar leitura e ritmo.",
            },
            {
              index: "05",
              title: "Gap interno consistente",
              note: "Os elementos dentro do card precisam manter espaçamentos previsíveis para não quebrar a hierarquia.",
            },
            {
              index: "06",
              title: "Card sempre dentro de section",
              note: "A hierarquia correta é background da página, section, conteúdo e card. O card não substitui a section.",
            },
          ].map((rule) => (
            <div
              key={rule.index}
              className="flex items-start gap-4 border-b border-white py-4 last:border-0"
            >
              <span className="w-8 shrink-0 font-mono text-[10px] font-bold text-primary">
                {rule.index}
              </span>
              <div className="flex flex-col gap-1">
                <Typography as="p" variant="body" className="font-semibold text-foreground">
                  {rule.title}
                </Typography>
                <Typography as="p" variant="body-sm" className="text-muted-foreground">
                  {rule.note}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

export function FoundationFooter() {
  return (
    <div className="px-1 pb-4 pt-2">
      <p className="text-xs text-muted-foreground">
        MN Design System · Primary{" "}
        <span className="font-mono text-primary">#5FC318</span> · Brand Green{" "}
        <span className="font-mono" style={{ color: "#AFF000" }}>#AFF000</span>{" "}
        · Font: Inter
      </p>
    </div>
  );
}
