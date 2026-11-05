# Selos de 01-Proposta-de-Venda contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio 01-Proposta-de-Venda`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|
| `api-comercial/prisma/models/enums.prisma` | 152 | av-hub: `api-comercial/prisma/models/enums.prisma` | 69-76 | ok (244 linhas) |
| `app/(protected)/vendas/propostas/page.tsx` | 177 | av-hub: `app/(protected)/vendas/propostas/page.tsx` | — | ok (12 linhas) |
| `app/api/comercial/[...rota]/route.ts` | 8 | av-hub: `app/api/comercial/[...rota]/route.ts` | — | ok (146 linhas) |
| `av-hub/app/(protected)/comissoes/simulador/page.tsx` | 281 | av-hub: `app/(protected)/comissoes/simulador/page.tsx` | — | ok (2522 linhas) |
| `comissoes/simulador/page.tsx` | 8 | av-hub: `app/(protected)/comissoes/simulador/page.tsx` | — | ok (2522 linhas) |
| `components/Propostas/PropostaForm/PropostaForm.tsx` | 178 | av-hub: `components/Propostas/PropostaForm/PropostaForm.tsx` | — | ok (1058 linhas) |
| `core_comercial/aggregates/propostas/propostas.route.js` | 8 | api-acos-vital: `src/schemas/core_comercial/aggregates/propostas/propostas.route.js` | — | ok (574 linhas) |
| `custos.routes.ts` | 8, 216 | av-hub: `api-comercial/src/modules/custos/custos.routes.ts` | 30-30 | ok (607 linhas) |
| `domain/numeracao/numeroProposta.ts` | 234 | av-hub: `api-comercial/src/domain/numeracao/numeroProposta.ts` | 3-12 | ok (64 linhas) |
| `domain/permissoes/capacidades.ts` | 239 | av-hub: `api-comercial/src/domain/permissoes/capacidades.ts` | 47-56 | ok (100 linhas) |
| `emailProposta.ts` | 238 | av-hub: `api-comercial/src/modules/propostas/emailProposta.ts` | — | ok (60 linhas) |
| `enums.prisma` | 8, 162 | av-hub: `api-comercial/prisma/models/enums.prisma` | 119-136 | ok (244 linhas) |
| `envioOrdensCompra.ts` | 302 | omie-elt-pipeline: `src/jobs/envioOrdensCompra.ts` | — | ok (288 linhas) |
| `lib/domain/andamento-proposta.ts` | 8 | av-hub: `lib/domain/andamento-proposta.ts` | — | ok (191 linhas) |
| `lib/simulador/motor.ts` | 305 | av-hub: `api-comercial/src/domain/simulador/motor.ts`<br>av-hub: `lib/simulador/motor.ts` | — | ok (513 linhas) |
| `numeroProposta.ts` | 8 | av-hub: `api-comercial/src/domain/numeracao/numeroProposta.ts` | — | ok (64 linhas) |
| `ordens_compra.route.js` | 245 | api-acos-vital: `src/schemas/core_vendas_faturamento/tables/ordens_compra/ordens_compra.route.js` | 857-857 | ok (1369 linhas) |
| `pedidoOmie.ts` | 236 | av-hub: `api-comercial/src/modules/propostas/pedidoOmie.ts` | — | ok (389 linhas) |
| `prisma/models/vendas.prisma` | 232 | av-hub: `api-comercial/prisma/models/vendas.prisma` | 45-109 | ok (242 linhas) |
| `propostas.route.js` | 152, 197 | api-acos-vital: `src/schemas/core_comercial/aggregates/propostas/propostas.route.js` | — | ok (574 linhas) |
| `propostas.routes.ts` | 8, 214, 218 | av-hub: `api-comercial/src/modules/propostas/propostas.routes.ts` | 146-164 | ok (215 linhas) |
| `propostas.service.ts` | 8, 233, 234, 237 | av-hub: `api-comercial/src/modules/propostas/propostas.service.ts` | 478-481, 313-322, 853-903 | ok (1029 linhas) |
| `simulador.routes.ts` | 241 | av-hub: `api-comercial/src/modules/simulador/simulador.routes.ts` | — | ok (261 linhas) |
| `simulador/page.tsx` | 288 | av-hub: `app/(protected)/cadastros/acessos/auxiliares-vendedor/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/compradores/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/diligenciadores/page.tsx` | 1053-1053 | ambíguo (136 arquivos) |
| `vendas.prisma` | 8 | av-hub: `api-comercial/prisma/models/vendas.prisma` | — | ok (242 linhas) |
| `vendas/propostas/[id]/page.tsx` | 179 | av-hub: `app/(protected)/vendas/propostas/[id]/page.tsx` | — | ok (54 linhas) |
| `vendas/propostas/nova/page.tsx` | 178 | av-hub: `app/(protected)/vendas/propostas/nova/page.tsx` | — | ok (31 linhas) |

## ✅ sem repositório nem arquivo citado (15)

- linha 20: > - ✅ No banco, o dump de 29/10 traz `core_comercial.propostas`, os itens, as versões, os eventos e a função `fn_proposta_criar`. As funções de revisar, aprovar
- linha 74: - ✅ Lista de propostas, nova proposta e detalhe da proposta no front, lendo a API do Hub; clientes pelo Acompanhamento de Clientes (N16-112).
- linha 76: - ✅ Meus Pedidos, com a etapa dos itens.
- linha 107: | Gerente de Vendas e perfis que veem a equipe | Leem propostas da equipe (escopo `vinculados`/`todos`) ✅ o gestor vê o time (N16-147, N16-148); falta a relação
- linha 166: Mesmo vocabulário da OC (`pendente`, `sincronizado`, `erro`; Dump Avhub 17315-17320): `pendente` (na fila), `sincronizado` (Omie criou; guarda o número do Omie)
- linha 228: ### Como está no código (✅ do módulo do Pablo)
- linha 235: - ✅ **Comandos de status:** `perder` (`:555-575`), `reabrir` (`:578-606`), `fechar` com fechamento parcial por item (`:609-649`) e `calcularFechamento`. **Diver
- linha 249: - ✅ O `IncluirPedido` aceita o **nosso código de integração** do pedido e do item: o hub grava a liberação na **resposta** da inclusão e liga o item da proposta
- linha 251: - ✅ **A categoria do pedido decide se ele gera comissão.** A regra do grupo G6 compara o código `'1.01.96'` (refaturamento em Mogi) e a `vw_comissao_master` só 
- linha 253: - ✅ Devolução de **venda**: a total vem do Omie; a **parcial** só chega marcada, sem valor, item nem quantidade. Fiscal ou Controladoria informam o que voltou (
- linha 299: | 2 | Estado `APROVADA`, trava de ajuste e aprovar com a revisão: rotas feitas (29/10). Falta ligar o BFF e a tela, e conferir no banco a regra "incompleta" | R
- linha 300: | 3 | Cancelar com motivo: rota feita (29/10). Falta o histórico da comissão estimada | Robert | `V0C` | ✅ API; 🔴 histórico |
- linha 301: | 4 | Botão "Transformar em pedido" e marcação da Qualidade obrigatória: rota `transformar` feita (grava o pedido do Hub `pendente`). Faltam a tela, a fila do p
- linha 303: | 8 | Trocar a AwesomeAPI pela PTAX do hub: o front já lê o câmbio do Hub (`GET /cambio` para `/cotacoes_moeda/atual`, 27/10) | Robert | `V0.1` | ✅ front; ❓ API
- linha 317: | 1 | ✅ Alçada de desconto e margem: tudo fisicamente (N16-75; OQ-04 fechada) | Nathan (feito) |

## Citações deslocadas (o identificador está em outra linha) (1)

- nota linha 233: `propostas.service.ts:478-481` (av-hub) — `atualizar` não está perto; aparece na linha 525
