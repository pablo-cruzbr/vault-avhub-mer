---
tags: [desenvolvimento, backlog, pendencias, parte, validacao]
criado: 2026-11-16
estado-em: 2026-11-16
status: vigente
dono: Nathan
parte-de: "[[Backlog-por-Frente]]"
develop-conferida: [api-acos-vital 2e333e3, av-hub f63b01b, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-16]
fontes: [retestes R5 e R6 pela API no Docker local de 16/11/2026 (docker-teste/RETESTE-R5-2026-11-16-HUB.md, -MES.md, RETESTE-R6-2026-11-16-HUB.md e -MES.md, fora do vault), Dump-AvHub-Teste-2026-11-16, PDF de Gustavo de 16/11/2026 (status dos contratos)]
---

# Backlog: defeitos dos retestes R5 e R6 de 16/11

**Em uma frase:** itens BL-101 a BL-107, o que os retestes R5 e R6 acharam pela API no Docker local em 16/11/2026, depois de igualar o banco do Hub ao esqueleto do tst de 16/11. Cada linha diz a frente.

**Onde estamos:** ← [[Backlog-por-Frente]] (resumo e índice) · reteste anterior: [[Backlog-Reteste-R4-2026-11-16]]

O R5 e o R6 rodaram pela API, com Omie e S3 desligados. O R6 usou a `develop` de 16/11 12:00 (api-acos-vital `2e333e3`, av-hub `f63b01b`, api-pcp `bd6b442`, app-pcp `897dcd7`) e o banco do Hub conferido objeto a objeto contra o [[Dump-AvHub-Teste-2026-11-16]].

**O que passou a funcionar ou foi confirmado:**
- "Desvios" e "Pintura/acabamento" gravam no banco igual ao tst: o BL-097 era só do Docker local.
- A simulação v1 do "transformar" nasce `RASCUNHO` e só vai a `ENVIADO` com o pedido faturado (409 `PEDIDO_SEM_FATURAMENTO`).
- LOG-58b: cancelar a OC de recompra reabre o aviso do MES; o mesmo aviso aceita nova recompra; o detalhe lista as recompras canceladas; `SUBSTITUICAO` e `SEM_RECOMPRA` funcionam; o saldo futuro e a doca do MES voltam a contar pela OC original.
- Cancelar a OC devolve a requisição ligada a `aberta`.
- No MES: fabricação de ponta a ponta (28887/1, flange: requisição de MP, OC, recebimento, Qualidade, Corte, Usinagem, inspeção de saída, lote fabricado, Embalagem, Logística, entregue); decisão `REABRIR` do PCP (aviso `RECEBIMENTO_REABERTO` no Hub); devolver destinação; split; pausar e retomar; retrabalho, que volta ao setor anterior.

Continuam abertos, sem mudança: BL-098 (visto também na fabricação), BL-096, BL-100, BL-088 e PS-059 no item de pedido (ver BL-102).

| ID | Nó | Frente | O que falta | Selo | Evidência |
|---|---|---|---|---|---|
| BL-101 | V0.7 | Gustavo | ✅ **Resolvido em 16/11: a migration `2026-11-16_comercial_proposta_lista_pedido_omie` foi aplicada no tst (Gustavo) e está no dump das 13:58 ([[Dump-AvHub-Teste-2026-11-16]]); no Docker, a lista voltou a 200 e a busca pelo nº do Omie acha a proposta.** Registro anterior: **A lista de propostas responde 500 sem a migration do nº do Omie.** A `api-acos-vital` `2e333e3` lê `p.numero_pedido_omie` na lista e na busca (`src/schemas/core_comercial/aggregates/propostas/propostas.route.js:429` (`OR p.numero_pedido_omie ILIKE :termo`), `:478`); a coluna não está no tst de 16/11 nem no Docker (log: `column p.numero_pedido_omie does not exist`). Aplicar a migration `2026-11-16_comercial_proposta_lista_pedido_omie` no tst junto com o deploy do commit, senão a tela de Propostas para | ✅ | R6 Hub, defeito 1 |
| BL-102 | R1, Q4 | Robert | **A recompra de um item de pedido recebida pela doca não libera a parte boa em quarentena.** A doca mostra duas linhas para a mesma peça (a OC de recompra e a requisição); recebida pela linha da OC, a recompra vira lote solto, e o lote original fica em `QUARENTENA` (aprovar dá 409). A liberação só corre com lote de requisição (`api-pcp` `src/qualidade/qualidade.service.ts:88` (`this.itemDoLote(tx, lote.idRequisicaoItem)`)) e a doca conta a OC de recompra sem ligá-la ao aviso (`src/compras/compra-oc.ts:209` (`const esperado =`)). É o PS-059 no item de pedido | 🔴 | R5 (28879) e R6 (28725/2, LT-20261116-0012 e -0014) |
| BL-103 | F1 | Robert | **Consolidar parciais não leva as reservas.** Depois de consolidar, a reserva fica presa na parcial cancelada e o saldo do lote some para o estoque (`api-pcp` `src/itens-parciais/itens-parciais.service.ts:2265` (`async consolidar(`)). Só pela API: o app não tem o botão | 🟡 | R6 (28725/1, LT-20261116-0009) |
| BL-104 | F1 | Robert | **Pausar aceita motivo vazio pela API** (`api-pcp` `src/itens-parciais/dto/pausar-item-parcial.dto.ts:4`); a tela exige o motivo | 🟡 | R6 MES |
| BL-105 | C3 | Gustavo | **Cancelar OC: erro de trigger vira 500 e o motivo some.** O `catch` do `PATCH` trata só a divergência e o `23514` (`api-acos-vital` `src/schemas/core_vendas_faturamento/tables/ordens_compra/ordens_compra.route.js:1331` (`ehTravaDeTrigger(err)`)); o resto vai a 500. Pede `updated_by` mesmo com o token (`:1283`), aceita cancelar sem motivo e só grava o motivo no campo `motivo_reprovacao` (com outro nome, some sem aviso) | 🟡 | R5 e R6 Hub (OC-000028, OC-000030, OC-000036) |
| BL-106 | C0 | Gustavo | **A resposta do `POST /integracao/mes/avisos-compra` não traz `recompras_canceladas`**; o `GET` do mesmo aviso traz | 🟡 | R6 Hub |
| BL-107 | P3, C0 | Robert | **A API aceita prazo passado na requisição** (`api-pcp` `src/compras/dto/requisitar-compra.dto.ts:71` (`@IsDateString({ strict: true })`)), também no `POST /compras/requisicoes/op`. A tela já recusa (BL-089); falta o DTO | 🟡 | R5 e R6 (REQ-000052, prazo 15/11) |
