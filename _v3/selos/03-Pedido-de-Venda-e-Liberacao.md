# Selos de 03-Pedido-de-Venda-e-Liberacao contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio 03-Pedido-de-Venda-e-Liberacao`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|
| `PedidoDetalhe.tsx` | 175 | av-hub: `components/Pedidos/PedidoDetalhe.tsx` | 1051-1051 | ok (1081 linhas) |
| `[codigoEmpresa]/[numeroPedido]/route.ts` | 173 | av-hub: `app/api/liberar-pedidos/[codigoEmpresa]/[numeroPedido]/route.ts`<br>app-pcp: `app/api/pedidos/consulta-omie/[numeroPedido]/route.ts` | — | ok (62 linhas) |
| `aggregates/pedidos_liberacao/pedidos_liberacao.route.js` | 165 | api-acos-vital: `src/schemas/core_vendas_faturamento/aggregates/pedidos_liberacao/pedidos_liberacao.route.js` | 88-88 | ok (235 linhas) |
| `aggregates/pedidos_liberados/pedidos_liberados.route.js` | 166 | api-acos-vital: `src/schemas/core_vendas_faturamento/aggregates/pedidos_liberados/pedidos_liberados.route.js` | 57-57 | ok (172 linhas) |
| `api-pcp/src/pedidos/omie-integracao.ts` | 179 | api-pcp: `src/pedidos/omie-integracao.ts` | 338-338 | ok (370 linhas) |
| `app-pcp/app/(protected)/carteira/page.tsx` | 180 | app-pcp: `app/(protected)/carteira/page.tsx` | 286-290 | ok (427 linhas) |
| `app/(protected)/vendas/liberar-pedidos/page.tsx` | 174 | av-hub: `app/(protected)/vendas/liberar-pedidos/page.tsx` | — | ok (11 linhas) |
| `app/api/liberar-pedidos/route.ts` | 173 | av-hub: `app/api/liberar-pedidos/route.ts` | — | ok (65 linhas) |
| `app/api/pedidos-venda/[fonte]/[codigoEmpresa]/[pedidoVenda]/etapas/route.ts` | 175 | av-hub: `app/api/pedidos-venda/[fonte]/[codigoEmpresa]/[pedidoVenda]/etapas/route.ts` | — | ok (59 linhas) |
| `components/LiberarPedidos/fontes.ts` | 143 | av-hub: `components/LiberarPedidos/fontes.ts` | — | ok (52 linhas) |
| `components/Pedidos/EtapaDosItens.tsx` | 175 | av-hub: `components/Pedidos/EtapaDosItens.tsx` | — | ok (115 linhas) |
| `escopoVendedor.js` | 286 | api-acos-vital: `src/middlewares/escopoVendedor.js` | — | ok (397 linhas) |
| `fontes.ts` | 174 | av-hub: `components/LiberarPedidos/fontes.ts`<br>av-hub: `components/Pedidos/fontes.ts` | — | ok (167 linhas) |
| `integracao-avhub.controller.ts` | 182 | api-pcp: `src/integracao-avhub/integracao-avhub.controller.ts` | 26-26 | ok (34 linhas) |
| `integracao-avhub.service.ts` | 182 | api-pcp: `src/integracao-avhub/integracao-avhub.service.ts` | 114-156 | ok (184 linhas) |
| `itens_pedido_status.route.js` | 169 | api-acos-vital: `src/schemas/core_vendas_faturamento/tables/itens_pedido_status/itens_pedido_status.route.js` | 54-54 | ok (116 linhas) |
| `lib/api/pedidosVenda.ts` | 293 | av-hub: `lib/api/pedidosVenda.ts` | — | ok (136 linhas) |
| `lib/api/portalPcp.ts` | 293 | av-hub: `lib/api/portalPcp.ts` | — | ok (125 linhas) |
| `lib/domain/etapas-item.ts` | 122, 175 | av-hub: `lib/domain/etapas-item.ts` | 30-41, 30-41 | ok (73 linhas) |
| `liberacao-equipe/page.tsx` | 174 | av-hub: `app/(protected)/cadastros/acessos/auxiliares-vendedor/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/compradores/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/diligenciadores/page.tsx` | — | ambíguo (136 arquivos) |
| `omie-integracao.ts` | 181 | api-pcp: `src/pedidos/omie-integracao.ts` | 339-349 | ok (370 linhas) |
| `pedidos.service.ts` | 180, 181 | api-pcp: `src/pedidos/pedidos.service.ts` | 244-249, 402-406, 63-122 | ok (807 linhas) |
| `producao.prisma` | 180 | api-pcp: `prisma/models/producao.prisma` | 118-118 | ok (580 linhas) |
| `src/middlewares/escopoVendedor.js` | 167 | api-acos-vital: `src/middlewares/escopoVendedor.js` | 79-79 | ok (397 linhas) |
| `src/schemas/core_vendas_faturamento/index.js` | 164 | api-acos-vital: `src/schemas/core_vendas_faturamento/index.js` | 179-180 | ok (252 linhas) |
| `src/utils/acessoConfig.js` | 167 | api-acos-vital: `src/utils/acessoConfig.js` | 73-74 | ok (104 linhas) |
| `tables/itens_pedido_status/itens_pedido_status.job.js` | 169 | api-acos-vital: `src/schemas/core_vendas_faturamento/tables/itens_pedido_status/itens_pedido_status.job.js` | — | ok (233 linhas) |

## ✅ sem repositório nem arquivo citado (0)


## Citações deslocadas (o identificador está em outra linha) (4)

- nota linha 165: `aggregates/pedidos_liberacao/pedidos_liberacao.route.js:88` (api-acos-vital) — `PEDIDO_FORA_DA_LIBERACAO` não está perto; aparece na linha 188
- nota linha 167: `src/utils/acessoConfig.js:73-74` (api-acos-vital) — `ESCOPO_VENDEDORES_EXIGIR` não está perto; aparece na linha 28
- nota linha 175: `lib/domain/etapas-item.ts:30-41` (av-hub) — `ETAPA_ATRASO_MINUTOS` não está perto; aparece na linha 72
- nota linha 181: `pedidos.service.ts:402-406` (api-pcp) — `AVHUB_REENVIO_IMPORTADO_MIN` não está perto; aparece na linha 103
