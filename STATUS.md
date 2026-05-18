# Status do Sistema de Apresentações

> Quando o usuário perguntar "o que falta?" ou "qual o status do sistema?", ler este arquivo e responder com o estado atual.

---

## ✅ Concluído

### Sistema de criação (PRESENTATION-SYSTEM.md)
- Steps 1–5: gatilho → pergunta → análise → mapeamento → preview → criação
- Step 4b e 4c: plano de imagens e aprovação
- Step 6: geração de imagens via Codex/imagegen, com briefing visual e referências do usuário
- Step 7: confirmação final
- Arquivo `user-presentations.ts` para armazenar apresentações criadas
- Mapeamento de 20 tipos de página com limites de caracteres

### Sistema de imagens (IMAGE-SYSTEM.md)
- Algoritmo de seleção: quais slides recebem imagem (fórmula + prioridades)
- Regra de não-consecutividade entre slides com imagem
- Mapa conceito → objeto para prompts de conteúdo
- Direção visual oficial definida: objetos físicos realistas, minimalistas, técnicos, premium e futuristas
- Referências visuais disponíveis em `IMAGENS REFERENCIA/`
- Fluxo de geração via Codex/imagegen, sem script local obrigatório
- Convenção de nomes de arquivo e atualização dos slides após geração

### Interface (app)
- Página inicial: hero com animação de digitação + slides empilhados com scroll-fan
- Section 2: Apresentação Demo com sidebar colapsável e thumbnails verticais
- Section 3: PowerPoint e Figma com preview do deck e botões de download em mock
- Menu hambúrguer funcional com lista de apresentações
- Rota dinâmica `/apresentacao/[slug]` para cada apresentação
- Mapeamento de Páginas mantido apenas como regra interna em `PRESENTATION-SYSTEM.md`

### Apresentação de exemplo
- "Modelo de Gestão" criada com 23 slides em `user-presentations.ts`

---

## 🔴 Faltando — Bloqueado aguardando usuário

Nenhum bloqueio geral no sistema de imagens. Para cada nova apresentação, o usuário pode informar referências ou exceções específicas.

---

## 🟡 Faltando — Para construir

### 3. Integração final das imagens geradas
**O que é:** salvar as imagens aprovadas em `/Imagens/[slug]/slide-NN.png` e atualizar `user-presentations.ts` com `imageSrc` e `imageAlt`.  
**Depende de:** plano de imagens aprovado e geração feita via Codex/imagegen.

### 4. Rotas de exportação para Figma (apresentações do usuário)
**O que é:** rotas isoladas `1600×900` sem sidebar/navbar para cada slide de cada apresentação do usuário, equivalente às que já existem para a apresentação demo em `/styleguide/paginas/apresentacoes-comerciais/slide-N`.  
**Rota proposta:** `/apresentacao/[slug]/export/[index]`  
**Por que:** necessário para exportar apresentações do usuário para o Figma → PPT.  
**Depende de:** nada, pode ser construído agora.

### 5. Script de exportação Figma automatizado (local)
**O que é:** um único comando que captura todos os slides de uma apresentação para o Figma automaticamente, sem abrir URL manualmente slide a slide.  
**Como:** usar `open` em loop para cada rota isolada + polling do MCP.  
**Rota:** `npm run export-figma modelo-gestao`  
**Depende de:** item 4 (rotas isoladas).  
**Limitação conhecida:** funciona apenas localmente (requer Figma Desktop + localhost).

---

## 📋 Ordem de execução recomendada

```
1. Usuário fornece: conteúdo da apresentação
2. Mapear slides e aprovar plano de imagens
3. Gerar imagens aqui no Codex/imagegen conforme a direção visual oficial
4. Integrar imagens em /Imagens/[slug] e user-presentations.ts
5. Construir: rotas /apresentacao/[slug]/export/[index]
6. Construir: script de exportação Figma automatizado
7. Testar: fluxo completo (criar apresentação → gerar imagens → exportar Figma → PPT)
```

---

## 🗒️ Notas e decisões tomadas

- **Exportação PPT direta (PptxGenJS):** testada, resultado muito diferente do visual original. Descartada por enquanto.
- **Exportação via screenshot (Playwright):** não é editável. Descartada.
- **Melhor caminho para PPT editável:** Figma → PPT (já funciona localmente, resultado perfeito).
- **Fonte no PPT:** se retomar PptxGenJS, usar Arial (usuário aprovou).
- **Imagens:** serão geradas por Codex/imagegen nesta conversa, com iteração visual orientada pelo usuário.
- **Transparência:** o arquivo final integrado deve ser PNG com alpha real; não integrar imagens com fundo falso.
- **Aplicação de imagens:** imagens de objeto devem aparecer inteiras, sem crop, sem `object-cover` e sem frame que corte o PNG.
- **Conteúdo:** o sistema pode criar novas páginas, layouts ou implementações para preservar informação relevante; não cortar conteúdo para caber no componente.
- **Gráficos:** só usar com dados reais, fonte explícita ou números fornecidos pelo usuário. Sem base, trocar por cards, texto estruturado ou visual conceitual.
