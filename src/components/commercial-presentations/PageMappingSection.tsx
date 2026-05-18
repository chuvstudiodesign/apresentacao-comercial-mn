type Field = {
  name: string;
  limit?: number;
  note?: string;
};

type PageType = {
  id: string;
  type: string;
  desc: string;
  fields: Field[];
};

const PAGE_TYPES: PageType[] = [
  {
    id: "01",
    type: "Capa",
    desc: "Abertura visual da apresentação",
    fields: [
      { name: "Título", limit: 31 },
      { name: "Subtítulo", limit: 63 },
      { name: "Corpo", limit: 125 },
      { name: "Tags", note: "3 tags · ~10 car. cada" },
    ],
  },
  {
    id: "02",
    type: "Tese com citação",
    desc: "Afirmação central com imagem de impacto",
    fields: [
      { name: "Citação / Tese", limit: 133 },
      { name: "Corpo", limit: 79 },
    ],
  },
  {
    id: "03",
    type: "Contexto + gráfico de linha",
    desc: "Narrativa de mercado com dado visual",
    fields: [
      { name: "Título", limit: 24 },
      { name: "Corpo", limit: 129 },
      { name: "Bullets", note: "3 itens · ~35 car. cada" },
      { name: "Gráfico de linha", note: "3–5 pontos de dado" },
    ],
  },
  {
    id: "04",
    type: "Problema + gráfico de barras",
    desc: "Tensão central com evidência numérica",
    fields: [
      { name: "Título", limit: 37 },
      { name: "Corpo", limit: 137 },
      { name: "Bullets", note: "3 itens · ~29 car. cada" },
      { name: "Gráfico de barras", note: "3–4 barras com valor %" },
    ],
  },
  {
    id: "05",
    type: "Texto + imagem editorial",
    desc: "Comportamento ou contexto com foto",
    fields: [
      { name: "Título", limit: 44 },
      { name: "Corpo", limit: 131 },
      { name: "Bullets", note: "3 itens · ~35 car. cada" },
    ],
  },
  {
    id: "06",
    type: "Oportunidade + gráfico",
    desc: "Abertura de caminho com dado de apoio",
    fields: [
      { name: "Título", limit: 30 },
      { name: "Corpo", limit: 119 },
      { name: "Bullets", note: "3 itens · ~20 car. cada" },
      { name: "Gráfico de barras", note: "3–4 barras com valor %" },
    ],
  },
  {
    id: "07",
    type: "Estatísticas em destaque",
    desc: "Três números de impacto em evidência",
    fields: [
      { name: "Título", limit: 31 },
      { name: "Corpo", limit: 77 },
      { name: "Stat — valor", note: "3 itens · ~8 car. cada" },
      { name: "Stat — legenda", note: "3 itens · ~70 car. cada" },
    ],
  },
  {
    id: "08",
    type: "Framework em cards",
    desc: "Estrutura de 4 pilares com descrição",
    fields: [
      { name: "Título", limit: 41 },
      { name: "Corpo", limit: 85 },
      { name: "Card — título", note: "4 cards · ~10 car. cada" },
      { name: "Card — descrição", note: "4 cards · ~50 car. cada" },
    ],
  },
  {
    id: "09",
    type: "Princípio com citação",
    desc: "Afirmação estratégica de uma linha",
    fields: [
      { name: "Título", limit: 51 },
      { name: "Citação", limit: 76 },
      { name: "Corpo", limit: 89 },
    ],
  },
  {
    id: "10",
    type: "Exemplo + gráfico de linha",
    desc: "Caso aplicado com evidência de escala",
    fields: [
      { name: "Título", limit: 32 },
      { name: "Corpo", limit: 130 },
      { name: "Bullets", note: "4 itens · ~25 car. cada" },
      { name: "Gráfico de linha", note: "4 pontos comparativos" },
    ],
  },
  {
    id: "11",
    type: "Cards de destaque",
    desc: "Três práticas ou atributos em cards",
    fields: [
      { name: "Título", limit: 27 },
      { name: "Corpo", limit: 122 },
      { name: "Card — título", note: "3 cards · ~10 car. cada" },
      { name: "Card — descrição", note: "3 cards · ~46 car. cada" },
    ],
  },
  {
    id: "12",
    type: "Mapa em cards",
    desc: "Critérios de decisão em grade visual",
    fields: [
      { name: "Título", limit: 15 },
      { name: "Corpo", limit: 70 },
      { name: "Card — título", note: "4 cards · ~13 car. cada" },
      { name: "Card — descrição", note: "4 cards · ~32 car. cada" },
    ],
  },
  {
    id: "13",
    type: "Conceito + imagem",
    desc: "Ideia central com foto e lista de apoio",
    fields: [
      { name: "Título", limit: 31 },
      { name: "Corpo", limit: 102 },
      { name: "Bullets", note: "4 itens · ~12 car. cada" },
    ],
  },
  {
    id: "14",
    type: "Virada em destaque",
    desc: "Momento de tensão com fundo escuro",
    fields: [
      { name: "Título", limit: 17 },
      { name: "Corpo", limit: 109 },
      { name: "Citação", limit: 43 },
    ],
  },
  {
    id: "15",
    type: "Plano em cards",
    desc: "Sequência de quatro passos práticos",
    fields: [
      { name: "Título", limit: 34 },
      { name: "Corpo", limit: 61 },
      { name: "Card — título", note: "4 cards · ~30 car. cada" },
      { name: "Card — descrição", note: "4 cards · ~50 car. cada" },
    ],
  },
  {
    id: "16",
    type: "Benefícios em cards",
    desc: "Resultados esperados em três blocos",
    fields: [
      { name: "Título", limit: 20 },
      { name: "Corpo", limit: 92 },
      { name: "Card — título", note: "3 cards · ~35 car. cada" },
      { name: "Card — descrição", note: "3 cards · ~45 car. cada" },
    ],
  },
  {
    id: "17",
    type: "Riscos em estatísticas",
    desc: "Consequências de não agir em números",
    fields: [
      { name: "Título", limit: 18 },
      { name: "Corpo", limit: 89 },
      { name: "Stat — valor", note: "3 itens · ~2 car. cada" },
      { name: "Stat — legenda", note: "3 itens · ~45 car. cada" },
    ],
  },
  {
    id: "18",
    type: "Recomendações em cards",
    desc: "Três direcionamentos práticos de ação",
    fields: [
      { name: "Título", limit: 30 },
      { name: "Corpo", limit: 81 },
      { name: "Card — título", note: "3 cards · ~45 car. cada" },
      { name: "Card — descrição", note: "3 cards · ~45 car. cada" },
    ],
  },
  {
    id: "19",
    type: "Chamada + gráfico",
    desc: "CTA com dado de valor e passos concretos",
    fields: [
      { name: "Título", limit: 13 },
      { name: "Corpo", limit: 65 },
      { name: "Bullets", note: "4 itens · ~20 car. cada" },
      { name: "Gráfico de barras", note: "3 barras com valor %" },
    ],
  },
  {
    id: "20",
    type: "Contracapa",
    desc: "Encerramento com citação e nome do deck",
    fields: [
      { name: "Título", limit: 50 },
      { name: "Subtítulo", limit: 31 },
      { name: "Corpo", limit: 118 },
      { name: "Citação", limit: 83 },
    ],
  },
];

const ACCENT = "#5FC318";

function FieldRow({ field }: { field: Field }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#ECECEC] py-[7px] last:border-0">
      <span className="text-[11px] font-medium text-[#474747]">{field.name}</span>
      {field.limit != null ? (
        <span className="shrink-0 font-mono text-[11px] font-bold text-foreground">
          {field.limit} car.
        </span>
      ) : (
        <span className="shrink-0 text-right font-mono text-[10px] text-muted-foreground">
          {field.note}
        </span>
      )}
    </div>
  );
}

function PageTypeCard({ page }: { page: PageType }) {
  return (
    <div className="ds-card flex flex-col gap-4 !p-[30px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="mb-1 font-mono text-[11px] font-black" style={{ color: ACCENT }}>
            {page.id}
          </p>
          <h3 className="text-[15px] font-bold leading-tight text-foreground">
            {page.type}
          </h3>
          <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
            {page.desc}
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="rounded-[8px] bg-[#FAFAFA] px-3 py-1">
        {page.fields.map((f) => (
          <FieldRow key={f.name} field={f} />
        ))}
      </div>
    </div>
  );
}

export function PageMappingSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {PAGE_TYPES.map((page) => (
        <PageTypeCard key={page.id} page={page} />
      ))}
    </div>
  );
}
