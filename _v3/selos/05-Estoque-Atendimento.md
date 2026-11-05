# Selos de 05-Estoque-Atendimento contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio 05-Estoque-Atendimento`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|
| `AtenderEstoqueModal.tsx` | 93, 134 | app-pcp: `app/(protected)/movimentacoes/components/AtenderEstoqueModal.tsx` | 332-345, 232-232 | ok (582 linhas) |
| `alertas.controller.ts` | 153 | api-pcp: `src/estoque/alertas/alertas.controller.ts` | 19-25 | ok (25 linhas) |
| `atendimento/page.tsx` | 134 | av-hub: `app/(protected)/cadastros/acessos/auxiliares-vendedor/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/compradores/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/diligenciadores/page.tsx` | 1-16 | ambíguo (136 arquivos) |
| `circuito-compra.ts` | 8, 87 | api-pcp: `src/compras/circuito-compra.ts` | 19-25 | ok (298 linhas) |
| `estoque-operacao.controller.ts` | 147, 149, 150, 151, 152 | api-pcp: `src/estoque/operacao/estoque-operacao.controller.ts` | 45-49, 39-43, 66-70, 78-88, 90-98 | ok (132 linhas) |
| `estoque-operacao.helpers.ts` | 88, 97, 124, 171 | api-pcp: `src/estoque/operacao/estoque-operacao.helpers.ts` | 150-170, 431-452, 287-287, 150-170 | ok (778 linhas) |
| `estoque-operacao.service.ts` | 79, 96, 98, 99, 147, 150 | api-pcp: `src/estoque/operacao/estoque-operacao.service.ts` | 614-616, 404-409, 657-673, 429-437, 112-147, 398-445 | ok (1105 linhas) |
| `estoque.prisma` | 8, 79, 91, 96, 114 | api-pcp: `prisma/models/estoque.prisma` | 86-106, 45-52, 385-393, 38-43, 378-382 | ok (476 linhas) |
| `integracao-avhub.controller.ts` | 95 | api-pcp: `src/integracao-avhub/integracao-avhub.controller.ts` | — | ok (34 linhas) |
| `itens-custo.ts` | 8, 95 | api-pcp: `src/integracao-avhub/itens-custo.ts` | — | ok (279 linhas) |
| `itens-parciais.controller.ts` | 148 | api-pcp: `src/itens-parciais/itens-parciais.controller.ts` | 163-180 | ok (343 linhas) |
| `itens-parciais.service.ts` | 8, 79, 89, 90, 92, 94, 124, 128, 148, 161, 167, 177 | api-pcp: `src/itens-parciais/itens-parciais.service.ts` | 617-617, 595-600, 588-590, 721-727, 701-714, 2100-2100, 629-639, 796-796, 650-659, 744-856, 1056-1059 | ok (2433 linhas) |
| `oc-referencia-avhub.service.ts` | 163 | api-pcp: `src/integracao-avhub/oc-referencia-avhub.service.ts` | — | ok (329 linhas) |
| `ordens_compra.route.js` | 163 | api-acos-vital: `src/schemas/core_vendas_faturamento/tables/ordens_compra/ordens_compra.route.js` | 982-982 | ok (1369 linhas) |
| `pedidos.service.ts` | 87, 91 | api-pcp: `src/pedidos/pedidos.service.ts` | 226-232, 695-699 | ok (807 linhas) |
| `vw_ordens_compra_referencia_mes.swagger.json` | 163 | api-acos-vital: `src/schemas/core_vendas_faturamento/views/vw_ordens_compra_referencia_mes/vw_ordens_compra_referencia_mes.swagger.json` | 61-88 | ok (346 linhas) |

## ✅ sem repositório nem arquivo citado (11)

- linha 56: - ✅ Telas Atendimento, Saldo, Reservas, Movimentação e Lote com etiqueta.
- linha 57: - ✅ Reserva, divisão da parcial, solicitar compra, entrada do item comprado e baixa na Embalagem.
- linha 135: | Saldo | Consulta de Saldo | `/estoque-operacao/saldo` | `saldo` | ✅ |
- linha 136: | Reservas | — | `/estoque-operacao/reservas` | `reservas` | ✅ consulta e liberação |
- linha 137: | Movimentação | — | `/estoque-operacao/movimentacao` | `movimentacao` | ✅ entrada, ajuste, transferência |
- linha 138: | Lote (detalhe, etiqueta) | — | `/estoque-operacao/lotes/[id]` | `saldo` | ✅ PDF Code128 `GET /estoque/lotes/:id/etiqueta` |
- linha 155: | `PUT /estoque/lotes/:id/custo` | `estoque-custo:editar` | Informa ou corrige o custo do lote à mão, com motivo e histórico | [[Contratos-da-v2\|API-008]] ✅ `d
- linha 173: ✅ **Custo do item (na `develop`, 27/10).** Cada `Reserva` liga lote e parcial, e `lote_custo.custo_liquido_unitario` guarda o custo. A saída grava o custo do lo
- linha 179: ✅ **Enviar à produção** (`ROTEIRO`) move a parcial para a próxima etapa do roteiro. Na `develop`, o item de fabricação pode ser atendido com matéria-prima do es
- linha 207: | 4 | `lote_custo` com `origem = OC` no recebimento e rota `MANUAL`: feitos na `develop`. Falta o custo obrigatório em todo lote (BL-066, N16-09) | Robert | R4 
- linha 208: | 5 | Baixa de matéria-prima **na retirada** (N16-140), com genealogia (J2, J3, J4). Hoje baixa na hora do "Atender pelo estoque" (`develop`) | Robert | E4, F1 

## Citações deslocadas (o identificador está em outra linha) (5)

- nota linha 87: `pedidos.service.ts:226-232` (api-pcp) — `estoque` não está perto; aparece na linha 23
- nota linha 94: `itens-parciais.service.ts:701-714` (api-pcp) — `EXPEDICAO` não está perto; aparece na linha 780
- nota linha 124: `estoque-operacao.helpers.ts:287` (api-pcp) — `quantidadeConsumida` não está perto; aparece na linha 42
- nota linha 134: `AtenderEstoqueModal.tsx:232` (app-pcp) — `atendimento` não está perto; aparece na linha 47
- nota linha 161: `itens-parciais.service.ts:650-659` (api-pcp) — `alocacoes` não está perto; aparece na linha 74
