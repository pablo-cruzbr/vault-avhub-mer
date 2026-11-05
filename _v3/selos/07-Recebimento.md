# Selos de 07-Recebimento contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio 07-Recebimento`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|
| `ConferirRecebimentoModal.tsx` | 141, 145 | app-pcp: `app/(protected)/movimentacoes/components/ConferirRecebimentoModal.tsx` | 199-199, 60-60 | ok (460 linhas) |
| `FilaRecebimento.tsx` | 141 | app-pcp: `app/(protected)/movimentacoes/components/FilaRecebimento.tsx` | 147-147 | ok (177 linhas) |
| `ReceberComNfModal.tsx` | 141 | app-pcp: `app/(protected)/movimentacoes/components/ReceberComNfModal.tsx` | 56-56 | ok (95 linhas) |
| `RecontarRecebimentoModal.tsx` | 141 | app-pcp: `app/(protected)/movimentacoes/components/RecontarRecebimentoModal.tsx` | 91-91 | ok (183 linhas) |
| `circuito-compra.ts` | 135 | api-pcp: `src/compras/circuito-compra.ts` | 30-35 | ok (298 linhas) |
| `compra-oc.ts` | 193 | api-pcp: `src/compras/compra-oc.ts` | — | ok (206 linhas) |
| `compras-ccp.dto.ts` | 8, 103 | api-pcp: `src/compras/dto/compras-ccp.dto.ts` | 17-20 | ok (29 linhas) |
| `compras.controller.ts` | 151, 152, 153 | api-pcp: `src/compras/compras.controller.ts` | 45-51, 93-103, 105-115 | ok (134 linhas) |
| `compras.prisma` | 8, 111, 119, 129, 203 | api-pcp: `prisma/models/compras.prisma` | 39-47, 31-37, 42-47, 84-104 | ok (336 linhas) |
| `compras.service.ts` | 8, 96, 102, 103, 104, 106, 110, 113, 135, 152, 153, 170, 186, 193, 216 | api-pcp: `src/compras/compras.service.ts` | 897-898, 305-351, 356-370, 464-464, 537-568, 506-531, 545-547, 111-114, 819-862, 404-446, 318-326, 472-616, 878-898 | ok (1169 linhas) |
| `conferir-recebimento.dto.ts` | 109 | api-pcp: `src/compras/dto/conferir-recebimento.dto.ts` | 140-143 | ok (316 linhas) |
| `decisoes-pcp/page.tsx` | 142 | av-hub: `app/(protected)/cadastros/acessos/auxiliares-vendedor/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/compradores/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/diligenciadores/page.tsx` | — | ambíguo (136 arquivos) |
| `estoque.prisma` | 105 | api-pcp: `prisma/models/estoque.prisma` | 167-167 | ok (476 linhas) |
| `estoque/etiquetas/etiqueta.controller.ts` | 162 | api-pcp: `src/estoque/etiquetas/etiqueta.controller.ts` | — | ok (23 linhas) |
| `fila/CartaoItemParcial.tsx` | 141 | app-pcp: `app/(protected)/movimentacoes/components/fila/CartaoItemParcial.tsx` | 907-907, 895-895, 761-761 | ok (1051 linhas) |
| `logistica/logistica-entrada/page.tsx` | 145 | app-pcp: `app/(protected)/logistica/logistica-entrada/page.tsx` | — | ok (17 linhas) |
| `recebimento.controller.ts` | 154, 157, 158 | api-pcp: `src/compras/recebimento.controller.ts` | 26-43 | ok (85 linhas) |
| `recebimento.service.ts` | 8, 96, 104, 105, 106, 107, 108, 109, 111, 112, 115, 157, 174, 178, 193, 197, 216 | api-pcp: `src/compras/recebimento.service.ts` | 260-260, 830-830, 100-102, 373-400, 200-231, 233-244, 315-326, 331-368, 411-413, 534-546, 340-351, 147-162, 316-332, 340-351, 147-162 | ok (1521 linhas) |
| `requisicao-avhub.eventos.ts` | 170 | api-pcp: `src/integracao-avhub/requisicao-avhub.eventos.ts` | 275-280, 300-307 | ok (389 linhas) |
| `vw_ordens_compra_referencia_mes.swagger.json` | 219 | api-acos-vital: `src/schemas/core_vendas_faturamento/views/vw_ordens_compra_referencia_mes/vw_ordens_compra_referencia_mes.swagger.json` | 44-88 | ok (346 linhas) |

## ✅ sem repositório nem arquivo citado (10)

- linha 70: - ✅ Telas de recebimento, recontagem e decisão do PCP; lote em quarentena com etiqueta em PDF.
- linha 71: - ✅ Recebimento parcial com divisão da parcial.
- linha 114: | 13 | **Custo do lote vem da OC.** Hoje é opcional e não bloqueia o recebimento; a N16-09 torna o custo obrigatório em todo lote | 📝 ✅ gravado na `develop` (1
- linha 155: | `GET /compras/recebimentos/decisoes` | `decisoes-pcp:visualizar` | Fila `AGUARDANDO_DECISAO` | `:32-37` ✅ |
- linha 156: | `POST /compras/recebimentos` | `movimentacoes:editar` | R1 a R4: conferir (`idRequisicao`, `idItemParcial`, itens com `quantidadeNf`, `quantidadeContada`, `pe
- linha 159: | `POST /compras/recebimentos/:id/recontar` | `movimentacoes:editar` | Recontagem por outra pessoa | `:51-59` ✅ |
- linha 160: | `POST /compras/recebimentos/:id/decidir` `{decisao: ACEITAR\|REABRIR, motivo}` | `decisoes-pcp:editar` | Decisão do PCP | `:61-69` ✅ |
- linha 161: | `POST /compras/requisicoes/:id/recebimentos` | — | **Removida**; o registro direto não existe mais | ✅ |
- linha 182: ✅ "Bate" = nenhuma divergência calculada nem informada. Não bate: `AGUARDANDO_RECONTAGEM`. A recontagem exige **todos** os itens (`:263-265`), mantém `DESCRICAO
- linha 235: | 1 | Gravar o custo da OC no lote (`lote_custo`, `origem OC`, `id_item_oc`): feito na `develop` (19/10). Falta o custo obrigatório em todo lote (BL-066) | Robe

## Citações deslocadas (o identificador está em outra linha) (9)

- nota linha 96: `recebimento.service.ts:260` (api-pcp) — `registrarRecebimento` não está perto; aparece na linha 830
- nota linha 105: `recebimento.service.ts:373-400` (api-pcp) — `PESO` não está perto; aparece na linha 45
- nota linha 106: `recebimento.service.ts:200-231` (api-pcp) — `PENDENTE` não está perto; aparece na linha 1123
- nota linha 106: `compras.service.ts:537-568` (api-pcp) — `PENDENTE` não está perto; aparece na linha 888
- nota linha 107: `recebimento.service.ts:233-244` (api-pcp) — `AGUARDANDO_RECONTAGEM` não está perto; aparece na linha 48
- nota linha 109: `recebimento.service.ts:331-368` (api-pcp) — `ACEITAR` não está perto; aparece na linha 159
- nota linha 113: `compras.service.ts:545-547` (api-pcp) — `PENDENTE` não está perto; aparece na linha 888
- nota linha 115: `recebimento.service.ts:340-351` (api-pcp) — `REABERTO` não está perto; aparece na linha 636
- nota linha 197: `recebimento.service.ts:340-351` (api-pcp) — `REABRIR` não está perto; aparece na linha 159
