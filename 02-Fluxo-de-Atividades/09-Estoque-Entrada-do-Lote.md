---
tags: [fluxo, raia, estoque, entrada, lote, fabricado, comprado, mes, e5]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
ordem: 9
nos: [E5]
anterior: "[[08-Qualidade-Entrada]]"
proxima: "[[10-Producao-e-Roteiro]]"
develop-conferida: [api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Robert (MES) · Nathan (decisões)
fontes: [00-Fluxo-Mestre-0b, dividida de 03-Estoque-Atendimento-e-Despacho da v2 (tag v2-antes-da-v3) em 05/11/2026, api-pcp develop befd973 de 27/10/2026 (aprovar-saida, receber-fabricado), circuito-compra.ts, LOG-53]
---

# Raia Estoque: entrada do lote (E5)

**Em uma frase:** o item comprado volta ao Estoque depois que a Qualidade libera o lote, e o fabricado aprovado vira lote e saldo; nos dois casos o almoxarife faz a reserva.

**Quando consultar:** dúvidas sobre a entrada do lote no estoque depois da Qualidade: saldo, reserva e a entrada do fabricado.

**Onde estamos no fluxo:** ← [[08-Qualidade-Entrada]] | [[10-Producao-e-Roteiro]] → · nós desta nota: `E5`

Entrada: [[08-Qualidade-Entrada]] (comprado) e [[11-Qualidade-Saida]] (fabricado). Próxima raia: [[10-Producao-e-Roteiro]]. O MES é o sistema de chão de fábrica; OP é a ordem de produção.

## Como funciona, passo a passo

6. O item comprado volta ao mesmo Estoque depois que a Qualidade libera o lote. O almoxarife faz a reserva. `E5`

- O item fabricado chega pelo "sim" da inspeção de saída ([[11-Qualidade-Saida]]). O almoxarife informa a localização. Só então nasce o lote do fabricado, com saldo e reserva para a própria parcela. `E5`

Os passos 1 a 5 (saldo, atendimento e o restante) estão em [[05-Estoque-Atendimento]]; o passo 7 (despacho) em [[12-Estoque-Despacho]].

## Quem atua

| Quem | O que faz |
|---|---|
| Qualidade | Libera o lote comprado ou aprova o fabricado na inspeção de saída |
| Almoxarife | Faz a reserva e, no fabricado, informa a localização |

## Regras que valem

- O item comprado só volta ao Estoque depois que a Qualidade libera o lote.
- Tudo que é fabricado ou comprado passa pelo Estoque (decisão de 14/10). O fabricado aprovado já volta ao Estoque como lote na `develop` (27/10).
- O fabricado gera um lote de origem `PRODUCAO` por ordem de produção e produto ([[Contratos-da-v2|LOG-53]]).

## O que já existe e o que falta

- ✅ Comprado: a parcial volta ao Estoque quando a Qualidade aprova o lote, e o almoxarife reserva (`circuito-compra.ts:166-250`, `itens-parciais.service.ts:592-593`).
- Fabricado: [[Contratos-da-v2|LOG-53]] ✅ está na `develop` do MES desde 27/10/2026 (`api-pcp` `ab3318d`): um lote de origem `PRODUCAO` por ordem de produção e produto, criado quando o Estoque recebe o fabricado aprovado e informa a localização.
- 🔴 O lote do fabricado nasce sem custo (BL-067).
- 🔴 A Expedição ainda não sai do Estoque pela retirada.

## Detalhe técnico

Nó do [[00-Fluxo-Mestre-0b]]: `E5` entrada no Estoque. Os estados do lote (`StatusQualidadeLote`, `OrigemLote`) e da reserva estão em [[05-Estoque-Atendimento]]. Selos em [[Regras-do-Vault]].

### Regras decididas

A numeração é a da nota de Estoque da v2; as outras regras estão em [[05-Estoque-Atendimento]] e [[12-Estoque-Despacho]].

| # | Regra | Selo |
|---|---|---|
| 9 | Parcial de item **comprado** só entra de volta no Estoque depois que a Qualidade liberou o lote (409 se há lote `PENDENTE`) | 📝 ✅ `itens-parciais.service.ts:862-874` |
| 11 | **Tudo que é fabricado ou comprado vai para o Estoque**: o fabricado aprovado vira lote e saldo e só então é despachado | 📝 ✅ (`api-pcp`) na `develop` (27/10, `ab3318d`): `aprovar-saida` e `receber-fabricado`; 🔴 a Expedição ainda não sai do Estoque pela retirada |

### Endpoints e contratos

| Método e rota | Permissão | Efeito | Código |
|---|---|---|---|
| `PATCH /itens-parciais/:id/aprovar-saida`, `PATCH /itens-parciais/:id/receber-fabricado` | `movimentacoes:editar` | O "sim" da inspeção de saída e a entrada do fabricado no Estoque, com a localização | [[Contratos-da-v2\|LOG-53]] ✅ `develop` (27/10, `itens-parciais.controller.ts`) |

### Como está no código

#### E5: entrada no Estoque

✅ **Comprado:** a Qualidade aprova o lote, e `devolverAoEstoqueParciaisProntas` funde as parciais do item e devolve a parcial ao setor Estoque com `idLoteCompra = null` (`circuito-compra.ts:166-250`). O lote já nasceu no Recebimento com `ENTRADA` no saldo e `origem = RECEBIMENTO`. A reserva é criada na **segunda passada** pelo almoxarife: "Atender pelo estoque" com a quantidade toda (`itens-parciais.service.ts:592-593`). Detalhe em [[08-Qualidade-Entrada]].

✅ (`api-pcp`) **Fabricado (na `develop`, 27/10, `ab3318d`):** o "sim" da inspeção de saída é `PATCH /itens-parciais/:id/aprovar-saida` (aprova tudo ou só uma `quantidade`; o resto continua na inspeção). A parcela aprovada volta ao setor Estoque, `EM_TRANSITO`, marcada como fabricado aprovado. O almoxarife informa a localização em `PATCH /itens-parciais/:id/receber-fabricado`, e só então nasce o lote `PRODUCAO` (um por OP e produto, sem custo), com `ENTRADA`, saldo e reserva para a própria parcela. Decisão de 14/10 cumprida. 🔴 O lote nasce sem custo (BL-067).

### O que falta desenvolver

| # | O quê | Dono | Nó | Selo |
|---|---|---|---|---|
| 2 | Fabricado vira lote e saldo: feito na `develop` (27/10). Falta a Expedição passar a sair do Estoque com reserva e retirada (junto do item 1) e o custo do fabricado (BL-067) | Robert | E5, Q8 | ✅ (`api-pcp`) lote; 🔴 retirada e custo |

O item 1 (documento de retirada) está em [[12-Estoque-Despacho]]; os demais em [[05-Estoque-Atendimento]].

### Pendências

- Nathan e Robert: como o item **fabricado** entra no Estoque: um lote por ordem de produção, ou por parcial aprovada? Quem informa localização? **Respondido e feito na `develop` (27/10): [[Contratos-da-v2|LOG-53]] define e o código cria um lote por ordem de produção e produto; quem informa a localização é o almoxarife, em `receber-fabricado`.**
- Nathan: custo do item fabricado (rateio por peso ou área) continua fora do ciclo 1 (decisão de 09/10)?
