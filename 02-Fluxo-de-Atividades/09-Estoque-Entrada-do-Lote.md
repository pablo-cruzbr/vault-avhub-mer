---
tags: [fluxo, raia, estoque, entrada, lote, fabricado, comprado, etiqueta, mes, e5]
criado: 2026-11-05
estado-em: 2026-11-24
status: vigente
ordem: 9
nos: [E5]
anterior: "[[08-Qualidade-Entrada]]"
proxima: "[[10-Producao-e-Roteiro]]"
develop-conferida: [api-pcp 6bca516, em 2026-11-24 (retirada da Expedição, PR #96); api-pcp c8036db, app-pcp 8259344, em 2026-11-23; api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Nathan (MES e decisões, N16-180)
fontes: [00-Fluxo-Mestre-0b, dividida de 03-Estoque-Atendimento-e-Despacho da v2 (tag v2-antes-da-v3) em 05/11/2026, api-pcp develop befd973 de 27/10/2026 (aprovar-saida, receber-fabricado), circuito-compra.ts, LOG-53, N16-166, N16-180 a N16-182, api-pcp c8036db (PRs #88 lote v2 e etiqueta, #90 histórico do lote), app-pcp 8259344 (PRs #70, #73)]
---

# Raia Estoque: entrada do lote (E5)

**Em uma frase:** o item comprado volta ao Estoque depois que a Qualidade libera o lote, e o fabricado aprovado vira lote e saldo; nos dois casos o almoxarife faz a reserva.

**Quando consultar:** dúvidas sobre a entrada do lote no estoque depois da Qualidade: saldo, reserva, custo a informar, peso e rastreabilidade do lote, etiqueta e a entrada do fabricado.

**Onde estamos no fluxo:** ← [[08-Qualidade-Entrada]] | [[10-Producao-e-Roteiro]] → · nós desta nota: `E5`

Entrada: [[08-Qualidade-Entrada]] (comprado) e [[11-Qualidade-Saida]] (fabricado). Próxima raia: [[10-Producao-e-Roteiro]]. O MES é o sistema de chão de fábrica; OP é a ordem de produção.

## Como funciona, passo a passo

6. O item comprado volta ao mesmo Estoque depois que a Qualidade libera o lote. O almoxarife faz a reserva. `E5`

- O item fabricado chega pelo "sim" da inspeção de saída ([[11-Qualidade-Saida]]). O almoxarife informa a localização. Só então nasce o lote do fabricado, com saldo e reserva para a própria parcela. `E5`
- Se o lote comprado entrou sem custo, ele aparece como "Custo a informar" até alguém com a permissão de custo informar.
- Na página do lote, o almoxarife completa o peso real, as medidas e a rastreabilidade do aço (corrida, norma, grau, certificado) e imprime a etiqueta.

Os passos 1 a 5 (saldo, atendimento e o restante) estão em [[05-Estoque-Atendimento]]; o passo 7 (despacho) em [[12-Estoque-Despacho]].

## Quem atua

| Quem | O que faz |
|---|---|
| Qualidade | Libera o lote comprado ou aprova o fabricado na inspeção de saída |
| Almoxarife | Faz a reserva, informa a localização do fabricado, completa peso e rastreabilidade e imprime a etiqueta |
| Quem tem `estoque-custo` | Informa o custo do lote que entrou sem custo |

## Regras que valem

- O item comprado só volta ao Estoque depois que a Qualidade libera o lote.
- Tudo que é fabricado ou comprado passa pelo Estoque (decisão de 14/10).
- O fabricado gera um lote de origem `PRODUCAO` por ordem de produção e produto ([[Contratos-da-v2|LOG-53]]), sem custo por enquanto (N16-166).
- O lote recebido sem custo entra marcado "custo a informar" e fica em alerta (N16-181).
- O saldo fica na unidade do material; o lote guarda o peso real e o kg por unidade (N16-182).
- Toda mudança de peso, medida ou rastreabilidade fica na linha do tempo do lote, que não pode ser alterada (N16-184).

## O que já existe e o que falta

Tudo de 19/11 em diante está só na `develop` do MES.

- ✅ Comprado: a parcial volta ao Estoque quando a Qualidade aprova o lote, e o almoxarife reserva (`api-pcp` `src/compras/circuito-compra.ts:163`, `devolverAoEstoqueParciaisProntas`).
- ✅ Fabricado ([[Contratos-da-v2|LOG-53]]): um lote `PRODUCAO` por OP e produto, criado quando o Estoque recebe o fabricado aprovado e informa a localização (`api-pcp` `src/itens-parciais/itens-parciais.service.ts:1403`, `async receberFabricado(`).
- ✅ Lote v2: peso real, kg por unidade, medidas, corrida, norma, grau, certificado e a marca `custo_pendente`, com o alerta "Custo a informar" no painel, nas pendências e no lote (`api-pcp` `src/compras/recebimento.service.ts:1152`, `custoPendente: !custo.dados`; `src/estoque/operacao/lote-v2.ts:24`, `export function pesoDoLote(`).
- ✅ Etiqueta nova: código de barras do código curto do lote, faixa de qualidade (liberado, quarentena, bloqueado), endereço, peso, NF, fornecedor e corrida (`api-pcp` `src/estoque/etiquetas/etiqueta.service.ts:198`, `bcid: 'code128'`).
- ✅ Linha do tempo do lote (criação, qualidade, RNC, movimentos, reservas, custo, rastreabilidade, cisão): `api-pcp` `src/estoque/kardex/kardex.controller.ts:24` (`@Get('lotes/:id/historico')`).
- ⏸ O lote do fabricado nasce sem custo: BL-067 adiado (N16-166).
- ✅ A Expedição sai do Estoque pela retirada: o atendimento abre a retirada com destino Expedição e o saldo só baixa na confirmação, `api-pcp` `src/itens-parciais/itens-parciais.service.ts:1214` (`destino: 'EXPEDICAO'`) ([[12-Estoque-Despacho]], N16-193).

## Detalhe técnico

Nó do [[00-Fluxo-Mestre-0b]]: `E5` entrada no Estoque. Os estados do lote e da reserva estão em [[05-Estoque-Atendimento]]; tabelas em [[Modelo-Estoque-e-Custo-do-Lote]] e [[Banco-MES]]. Selos em [[Regras-do-Vault]].

### Regras decididas

A numeração é a da nota de Estoque da v2; as outras regras estão em [[05-Estoque-Atendimento]] e [[12-Estoque-Despacho]].

| # | Regra | Selo |
|---|---|---|
| 9 | Parcial de item **comprado** só entra de volta no Estoque depois que a Qualidade liberou o lote (409 se há lote `PENDENTE`) | 📝 ✅ `api-pcp` `src/itens-parciais/itens-parciais.service.ts:1255` (`statusQualidade: 'PENDENTE'`) |
| 11 | **Tudo que é fabricado ou comprado vai para o Estoque**: o fabricado aprovado vira lote e saldo e só então é despachado | 📝 ✅ `itens-parciais.service.ts:1298` (`async aprovarSaida(`), `:1403` (`async receberFabricado(`); 🔴 a Expedição ainda não sai pela retirada |
| 25 | Lote recebido sem custo nasce com `custo_pendente = true` e fica em alerta até `PUT /estoque/lotes/:id/custo`; fabricado não entra no alerta | 📝 N16-181 ✅ `api-pcp` `src/compras/recebimento.service.ts:1152` (`custoPendente: !custo.dados`), `src/itens-parciais/itens-parciais.service.ts:1432` (`LIBERADO, sem custo`) |
| 26 | Peso do lote: kg por unidade = peso real ÷ quantidade, ou o peso teórico do material | 📝 N16-182 ✅ `api-pcp` `src/estoque/operacao/lote-v2.ts:24` (`export function pesoDoLote(`) |

### Telas

| Tela | Rota | Slug | Estado |
|---|---|---|---|
| Lote (detalhe, etiqueta, rastreabilidade, linha do tempo) | `/estoque-operacao/lotes/[id]` | `saldo` | ✅ `app-pcp` `app/(protected)/estoque-operacao/lotes/[id]/RastreabilidadeCard.tsx`, `LinhaDoTempoCard.tsx` |
| Fila do Estoque (receber fabricado) | `/estoque-operacao/atendimento` | `atendimento` | ✅ `app-pcp` `app/(protected)/estoque-operacao/atendimento/FilaEstoque.tsx:62` (`export default function FilaEstoque`) |

### Endpoints e contratos

| Método e rota | Permissão | Efeito | Código |
|---|---|---|---|
| `PATCH /itens-parciais/:id/aprovar-saida`, `PATCH /itens-parciais/:id/receber-fabricado` | `movimentacoes:editar` | O "sim" da inspeção de saída e a entrada do fabricado no Estoque, com a localização | [[Contratos-da-v2\|LOG-53]] ✅ `api-pcp` `src/itens-parciais/itens-parciais.controller.ts:251` (`@Patch(':id/receber-fabricado')`) |
| `PATCH /estoque/lotes/:id/rastreabilidade` | `movimentacao:criar` | Peso real, medidas, corrida, norma, grau, certificado; grava `lote_historico` | ✅ `api-pcp` `src/estoque/operacao/estoque-operacao.controller.ts:118` (`@Patch('lotes/:id/rastreabilidade')`) |
| `GET /estoque/lotes/:id/historico` | `saldo:visualizar` | Linha do tempo do lote | ✅ `api-pcp` `src/estoque/kardex/kardex.controller.ts:24` (`@Get('lotes/:id/historico')`) |
| `GET /estoque/lotes/:id/etiqueta` | `saldo:visualizar` | PDF 100 × 50 mm | ✅ `api-pcp` `src/estoque/etiquetas/etiqueta.service.ts:12` (`Code128 do código do lote (curto`) |
| `GET /estoque/alertas/custo-pendente` | `painel-estoque:visualizar` | Lotes com saldo e custo a informar | ✅ `api-pcp` `src/estoque/alertas/alertas.controller.ts:34` (`@Get('custo-pendente')`) |

### Como está no código

#### E5: entrada no Estoque

✅ **Comprado:** a Qualidade aprova o lote, e `devolverAoEstoqueParciaisProntas` funde as parciais do item e devolve a parcial ao setor Estoque: `api-pcp` `src/compras/circuito-compra.ts:163` (`export async function devolverAoEstoqueParciaisProntas`). O lote já nasceu no Recebimento com `ENTRADA` pelo motor e `origem = RECEBIMENTO`; sem custo da OC, nasce com `custo_pendente`. A reserva é criada na **segunda passada** pelo almoxarife: "Atender pelo estoque" com a quantidade toda. Detalhe em [[08-Qualidade-Entrada]].

✅ **Fabricado (LOG-53):** o "sim" da inspeção de saída é `aprovar-saida` (tudo ou só uma `quantidade`). A parcela aprovada volta ao setor Estoque, `EM_TRANSITO`. O almoxarife informa a localização em `receber-fabricado` (`api-pcp` `src/itens-parciais/itens-parciais.service.ts:1403`, `async receberFabricado(`), e só então nasce o lote `PRODUCAO` (um por OP e produto, sem custo), com `ENTRADA` pelo motor, saldo e reserva para a própria parcela. ⏸ O custo do fabricado está adiado (BL-067, N16-166).

✅ **Etiqueta:** o conteúdo sai de `api-pcp` `src/estoque/etiquetas/conteudo-etiqueta.ts:49` (`export function faixaDaQualidade`): verde para `LIBERADO`, vermelha (bloqueado) para `REPROVADO`, amarela (quarentena) para os demais. O peso aparece estimado pelo kg por unidade quando o lote não foi pesado.

### O que falta desenvolver

| # | O quê | Dono | Nó | Selo |
|---|---|---|---|---|
| 2 | Fabricado vira lote e saldo: feito. Falta a Expedição sair do Estoque pela retirada (item 1) | Nathan | E5, Q8 | ✅ lote (`itens-parciais.service.ts:1403`, `async receberFabricado(`); 🔴 retirada |
| — | Custo do fabricado (BL-067) | Nathan | E5 | ⏸ adiado (N16-166) |

O item 1 (documento de retirada) está em [[12-Estoque-Despacho]]; os demais em [[05-Estoque-Atendimento]].

### Pendências

- Respondida (27/10): o fabricado entra num lote por OP e produto, e o almoxarife informa a localização em `receber-fabricado` ([[Contratos-da-v2|LOG-53]]).
- Respondida (16/11): o fabricado fica sem custo por enquanto (N16-166).
