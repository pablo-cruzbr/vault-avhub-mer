# Fatos de 11-Qualidade-Saida

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/11-Qualidade-Saida.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir 11-Qualidade-Saida`.

## decisões e IDs (7)

- `BL-035`
- `EC-06`
- `N16-120`
- `N16-128`
- `N16-129`
- `N16-141`
- `N16-143`

## contratos (4)

- `API-005`
- `API-006`
- `LOG-53`
- `LOG-54`

## commits (1)

- `ab3318d`

## arquivo:linha (15)

- `acoes.ts:67`
- `divergencias.controller.ts:38-43`
- `fila/CartaoItemParcial.ts`
- `integracao-avhub.service.ts:172`
- `itens-parciais.controller.ts`
- `itens-parciais.service.ts:1014`
- `itens-parciais.service.ts:426-435`
- `itens-parciais.service.ts:966-989`
- `pedidos.service.ts:512-525`
- `pedidos.service.ts:520-525`
- `producao.prisma:118`
- `producao.prisma:77-82`
- `qualidade.service.ts:212`
- `qualidade/inspecao-saida/page.ts`
- `qualidade/page.ts`

## rotas (8)

- `GET /divergencias`
- `PATCH /itens-parciais/:id/aprovar-saida`
- `PATCH /itens-parciais/:id/mover`
- `PATCH /itens-parciais/:id/receber`
- `PATCH /itens-parciais/:id/receber-fabricado`
- `PATCH /itens-parciais/:id/reprovar`
- `PATCH /itens-parciais/:id/resolver`
- `PATCH /itens-parciais/:id/retrabalho`

## datas (7)

- `08/10`
- `14/10`
- `22/01/2027`
- `27/10`
- `27/10/2026`
- `29/10`
- `29/10/2026`

## código entre crases (99)

- `/decisoes-pcp`
- `/iniciar`
- `/movimentacoes/[setorId]`
- `/qualidade`
- `/qualidade/inspecao-saida`
- `:1017-1021`
- `:1036-1058`
- `:182-186`
- `:299`
- `:67-74`
- `ABERTA`
- `CANCELADA`
- `DANO`
- `DOCUMENTACAO`
- `Divergencia`
- `E5`
- `E6`
- `EM_ANALISE`
- `EM_ANDAMENTO`
- `EM_TRANSITO`
- `ESTOQUE`
- `EXPEDICAO`
- `FilaSetor`
- `GET /divergencias`
- `ModuloSetores`
- `OUTRO`
- `P6`
- `PATCH /itens-parciais/:id/aprovar-saida`
- `PATCH /itens-parciais/:id/mover`
- `PATCH /itens-parciais/:id/receber`
- `PATCH /itens-parciais/:id/receber-fabricado`
- `PATCH /itens-parciais/:id/reprovar`
- `PATCH /itens-parciais/:id/resolver`
- `PATCH /itens-parciais/:id/retrabalho`
- `PRAZO`
- `PRODUCAO`
- `Pedidos.acompanhamentoQualidade`
- `PerfilSetor.podeAtuar`
- `Q7`
- `Q8`
- `QUALIDADE`
- `QUANTIDADE`
- `REPROVADO`
- `RESOLVIDA`
- `StatusDivergencia`
- `TipoDivergencia`
- `ab3318d`
- `acoes.ts:67`
- `acompanhamentoQualidade`
- `api-pcp`
- `app-pcp`
- `aprovar-saida`
- `concluir`
- `controller:205-213`
- `develop`
- `divergencias.controller.ts:38-43`
- `ehUltimaEtapa`
- `ensureLotesCompradosLiberados`
- `excluirCodigos`
- `fila/CartaoItemParcial.tsx:150`
- `fila/CartaoItemParcial.tsx:301-302`
- `fila/CartaoItemParcial.tsx:305`
- `inspecao-saida`
- `integracao-avhub.service.ts:172`
- `itens-parciais.controller.ts`
- `itens-parciais.service.ts:1014`
- `itens-parciais.service.ts:426-435`
- `itens-parciais.service.ts:966-989`
- `main`
- `mover`
- `movimentacoes`
- `pedidos.service.ts:512-525`
- `pedidos.service.ts:520-525`
- `producao.prisma:118`
- `producao.prisma:77-82`
- `qualidade-entrada`
- `qualidade.inspecao`
- `qualidade.reprovado`
- `qualidade.service.ts:212`
- `qualidade/inspecao-saida/page.tsx:1-18`
- `qualidade/page.tsx`
- `quantidade`
- `receber-fabricado`
- `reprovar`
- `resolver`
- `retrabalho`
- `retrabalho = true`
- `rncs`
- `service:1011`
- `service:1067`
- `service:1124`
- `service:224`
- `service:366`
- `service:862-874`
- `setor.tipo === 'QUALIDADE'`
- `tipos={['QUALIDADE']}`
- `{ idLocalizacao }`
- `{ motivo }`
- `{ observacao?, quantidade? }`

## regras e linhas de conteúdo (63)

- A produção conclui a parcial e ela cai na fila da Qualidade. `Q7`
- O inspetor recebe a parcial e inicia a inspeção. `Q7`
- Ele decide com um clique e um motivo. `Q8`
- Aprovado: o item volta ao Estoque e vira lote quando o almoxarife informa a localização (na `develop`; na `main` do MES ainda segue à Expedição). `Q8`
- Reprovado: o sistema abre uma divergência com o motivo. `Q8`
- O PCP decide: falso alarme, retrabalho ou reabrir a compra. `P6`
- Estando boas, ele as aprova (tudo ou só uma quantidade). Elas voltam ao Estoque e viram lote (`develop`); na `main` do MES vão direto à Expedição.
- Havendo problema, ele reprova com um motivo. Pela decisão, pode ser só 5 das 100. Hoje são as 100.
- O PCP vê a divergência e escolhe entre falso alarme e retrabalho.
- | Inspetor da Qualidade | Recebe, inicia, reprova ou segue com a parcial |
- | PCP | Decide retrabalho ou reabertura de compra |
- | Operador do setor anterior | Recebe o item em retrabalho |
- Todo roteiro de fabricação tem um setor de Qualidade antes da Expedição. Revenda não exige.
- Só se reprova em setor de Qualidade, com a inspeção em andamento.
- Reprovado só tem duas saídas: falso alarme ou retrabalho.
- Reprovação de saída não gera RNC nem nota de devolução. RNC é do lote comprado.
- O fabricado aprovado vira lote e saldo no Estoque.
- ✅ (`app-pcp`) Telas de inspeção e fila da Qualidade; reprovar, falso alarme e retrabalho.
- ✅ (`api-pcp`) Na `develop` (27/10): o "sim" leva ao Estoque, com lote e saldo, por uma ação explícita de aprovar (`aprovar-saida`, com quantidade aprovada; o resto continua na inspeção).
- 🔴 Reprovar só uma parte (N16-128): a reprovação continua sendo da parcela inteira.
- 🔴 Tela do novo norte do PCP; fila de inspeção de processo; reabrir divergência.
- 🟡 Laudo ou evidência na reprovação de saída.
- ❓ Uso real da tela em ambiente; regra de sucata e refugo.
- | Inspetor da Qualidade | Recebe, inicia, **reprova** ou segue (`mover`) | `/qualidade/inspecao-saida` |
- | PCP | Decide retrabalho ou reabertura de compra depois da reprovação | MES (sem tela dedicada) |
- | Operador do setor anterior | Recebe o retrabalho | fila do setor |
- | Vendedor | Marcou "Qualidade acompanha desde o início" (V2); nada consome o flag ainda | av-hub |
- | 1 | Todo roteiro de **fabricação** tem um setor tipo `QUALIDADE`, antes da primeira `EXPEDICAO` (EC-06). Revenda não exige | 📝 ✅ `pedidos.service.ts:512-525` |
- | 2 | `reprovar` só em setor tipo `QUALIDADE` e a partir de `EM_ANDAMENTO` | ✅ `itens-parciais.service.ts:966-989`, `:1017-1021` |
- | 3 | Reprovar grava histórico e abre `Divergencia` tipo `QUALIDADE`, `ABERTA`, com motivo | ✅ `:1036-1058` |
- | 4 | Reprovado só tem duas saídas: `resolver` (falso alarme, volta a `EM_ANDAMENTO`) ou `retrabalho` (volta ao setor anterior; pela N16-141, de 29/10, o PCP passará a escolher o setor). Mover, concluir, pausar e devolver somem | ✅ `acoes.ts:67` |
- | 5 | Aprovado volta ao Estoque: **lote e saldo do fabricado**, retirada depois ([[Contratos-da-v2\|LOG-53]], [[Contratos-da-v2\|LOG-54]]) | 📝 ✅ (`api-pcp`) lote e saldo na `develop` (27/10); 🔴 retirada |
- | 6 | Reprovação de inspeção de saída **não** gera RNC nem nota de devolução: RNC é conceito do lote comprado | ✅ `rncs` só em `qualidade.service.ts:212` |
- | 7 | Inspeção de saída tem trava de laudo? Pergunta T-04 para a inspeção documental (ciclo 2). Hoje não há laudo na saída. **Decidido em 29/10 (N16-129): sem laudo nem checklist.** | 📝 ✅ (`api-pcp`) |
- | Nome atual | Nome antigo | Rota | App | Slug | Estado |
- | Inspeção de saída | — | `/qualidade/inspecao-saida` | app-pcp | `inspecao-saida` | ✅ `qualidade/inspecao-saida/page.tsx:1-18`: `ModuloSetores` com `tipos={['QUALIDADE']}` e `excluirCodigos` do setor `qualidade-entrada` |
- | Fila do setor Qualidade | Movimentações | `/movimentacoes/[setorId]` | app-pcp | `movimentacoes` | ✅ mesma `FilaSetor`; botão Reprovar só com `setor.tipo === 'QUALIDADE'` (`fila/CartaoItemParcial.tsx:305`) |
- | Qualidade (índice) | — | `/qualidade` | app-pcp | ❓ | ✅ `qualidade/page.tsx` |
- | Método e rota | Uso | Código |
- | `PATCH /itens-parciais/:id/receber`, `/iniciar` | inspetor assume a parcial | `service:224`, `:299` ✅ |
- | `PATCH /itens-parciais/:id/aprovar-saida` `{ observacao?, quantidade? }` | **"aprova"**: a parcela (ou só a `quantidade`) volta ao Estoque `EM_TRANSITO`, marcada como fabricado aprovado | `develop` (27/10, `itens-parciais.controller.ts`) ✅ |
- | `PATCH /itens-parciais/:id/receber-fabricado` `{ idLocalizacao }` | o Estoque recebe o fabricado e cria o lote `PRODUCAO` | `develop` (27/10) ✅ (`api-pcp`) ([[09-Estoque-Entrada-do-Lote]]) |
- | `PATCH /itens-parciais/:id/mover` | na `main` do MES era o "aprova": segue ao próximo setor do roteiro | `service:366` ✅ |
- | `PATCH /itens-parciais/:id/reprovar` `{ motivo }` | reprova e abre divergência | `controller:205-213`, `service:1011` ✅ |
- | `PATCH /itens-parciais/:id/resolver` | falso alarme | `service:1067` ✅ |
- | `PATCH /itens-parciais/:id/retrabalho` `{ motivo }` | volta ao setor anterior, `retrabalho = true` | `service:1124` ✅ |
- | `GET /divergencias` | consulta divergências | `divergencias.controller.ts:38-43` ✅ |
- O "Aprovar" que aparece na tela (rótulo da ação `resolver`, `fila/CartaoItemParcial.tsx:150`, em 14/10) **não** aprovava a inspeção: só desfaz uma reprovação. Na `develop` há a ação explícita `aprovar-saida`; conferir o rótulo na tela do `app-pcp` (❓).
- Como a Qualidade é um setor comum no roteiro, `ehUltimaEtapa` é falso nela (a Expedição vem depois), então a tela oferece `mover`, não `concluir` (`fila/CartaoItemParcial.tsx:301-302`).
- Registro de 14/10 (superado na `develop`): o fabricado aprovado nunca passava pelo Estoque, e `mover` levava a parcial direto à primeira etapa `EXPEDICAO`. Na `develop`, a reserva do lote `PRODUCAO` nasce em `receber-fabricado`.
- `ensureLotesCompradosLiberados` só barra envio a setor `ESTOQUE` com lote comprado pendente (`service:862-874`); não protege este caso.
- `Pedidos.acompanhamentoQualidade` (V2) é gravado (`producao.prisma:118`) e mostrado na Triagem, mas nenhuma fila consome ([[03-Pedido-de-Venda-e-Liberacao]], item 7).
- ❓ Ninguém conferiu o uso real da tela em ambiente.
- | # | O quê | Dono | Nó | Selo |
- | 1 | O "sim" do Q8 leva ao Estoque, com lote e saldo do fabricado: feito na `develop` (27/10). Falta o documento de retirada | Robert | Q8, `E5`, `E6` | ✅ (`api-pcp`) lote; 🔴 retirada |
- | 2 | Ação explícita de aprovar na inspeção, com quantidade aprovada: feita na `develop` (`aprovar-saida`). Falta a quantidade reprovada (reprovação parcial, N16-128), o motivo e a evidência | Robert | Q7 | ✅ (`api-pcp`) aprovar; 🔴 reprovar em parte |
- | 3 | Tela do novo norte para a reprovação (P6): retrabalho, ajustar roteiro, reabrir compra. `/decisoes-pcp` só trata recebimento | Robert, Nathan | P6 | 🔴 |
- | 4 | Laudo ou evidência na reprovação de saída (a reprovação de entrada exige motivo e evidência, a de saída só motivo) | Robert, Qualidade | Q7 | 🟡 |
- | 5 | Fila de inspeção de processo que usa `acompanhamentoQualidade` (ciclo 2, 22/01/2027) | Robert | V2 | 🔴 |
- | 6 | Reabertura de divergência encerrada | Robert | P6 | 🔴 |
- Nathan e Qualidade: reprovação parcial na saída existe (parte aprovada segue, parte reprovada vai a retrabalho)? Hoje a parcial inteira é reprovada. (Decidido em 29/10, N16-128: pode reprovar só parte.)
- Nathan: sucata e refugo da produção: como entram no saldo e no custo?
- Qualidade: a inspeção de saída exige laudo (T-04)? (Decidido em 29/10, N16-129: sem laudo.)

## subfluxo mermaid

```text
flowchart TD
    F1["F1 · Setores produtivos"] --> Q7["Q7 · Inspecao de saida<br/>setor QUALIDADE do roteiro"]
    Q7 --> Q8{"Q8 · Aprova?"}
    Q8 -->|"sim (decidido: Estoque)"| E5["E5 · Entrada no Estoque<br/>lote e saldo do fabricado"]
    Q8 -.->|"sim (codigo hoje: mover)"| X1["X1 · Embalagem e paletizacao"]
    Q8 -->|nao| P6["P6 · Novo norte"]
    P6 -->|retrabalho| F1
    P6 -->|reabre compra| P3["P3 · Requisicao de compra"]
    E5 --> E6["E6 · Documento de retirada"]
    E6 --> X1
```
