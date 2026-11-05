# Selos de 10-Producao-e-Roteiro contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio 10-Producao-e-Roteiro`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|
| `FilaSetor.tsx` | 160 | app-pcp: `app/(protected)/movimentacoes/components/FilaSetor.tsx` | — | ok (156 linhas) |
| `acoes.ts` | 132 | av-hub: `components/Compras/acoes.ts`<br>av-hub: `components/Funcionarios/acoes.ts`<br>av-hub: `components/Vagas/acoes.ts` | 55-60 | ambíguo (4 arquivos) |
| `app-pcp/app/(protected)/movimentacoes/acoes.ts` | 119 | app-pcp: `app/(protected)/movimentacoes/acoes.ts` | 61-71 | ok (132 linhas) |
| `circuito-compra.ts` | 204 | api-pcp: `src/compras/circuito-compra.ts` | 19-25 | ok (298 linhas) |
| `compras.prisma` | 220 | api-pcp: `prisma/models/compras.prisma` | 17-22 | ok (336 linhas) |
| `divergencias.controller.ts` | 195 | api-pcp: `src/divergencias/divergencias.controller.ts` | 26-61 | ok (61 linhas) |
| `divergencias.service.ts` | 213 | api-pcp: `src/divergencias/divergencias.service.ts` | — | ok (156 linhas) |
| `estoque-operacao.helpers.ts` | 221 | api-pcp: `src/estoque/operacao/estoque-operacao.helpers.ts` | 317-317 | ok (778 linhas) |
| `fabricas.prisma` | 8, 95, 204, 205 | api-pcp: `prisma/models/fabricas.prisma` | 162-176, 17-32, 5-8 | ok (176 linhas) |
| `fila/CartaoItemParcial.tsx` | 132 | app-pcp: `app/(protected)/movimentacoes/components/fila/CartaoItemParcial.tsx` | 301-305 | ok (1051 linhas) |
| `integracao-avhub.service.ts` | 196 | api-pcp: `src/integracao-avhub/integracao-avhub.service.ts` | 114-114 | ok (184 linhas) |
| `item-parcial-status.constants.ts` | 153 | api-pcp: `src/common/constants/item-parcial-status.constants.ts` | 31-41 | ok (41 linhas) |
| `itens-parciais.controller.ts` | 95 | api-pcp: `src/itens-parciais/itens-parciais.controller.ts` | 56-56 | ok (343 linhas) |
| `itens-parciais.service.ts` | 8, 81, 83, 95, 172 | api-pcp: `src/itens-parciais/itens-parciais.service.ts` | 245-257, 722-730, 52-54, 227-227 | ok (2433 linhas) |
| `movimentacoes/labels.ts` | 117 | app-pcp: `app/(protected)/movimentacoes/labels.ts`<br>app-pcp: `app/(protected)/ordens-producao/labels.ts` | 7-17 | ok (48 linhas) |
| `movimentacoes/page.tsx` | 159 | av-hub: `app/(protected)/cadastros/acessos/auxiliares-vendedor/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/compradores/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/diligenciadores/page.tsx` | — | ambíguo (136 arquivos) |
| `pedidos.controller.ts` | 191, 192, 194 | api-pcp: `src/pedidos/pedidos.controller.ts` | 58-58, 92-92 | ok (222 linhas) |
| `pedidos.service.ts` | 8, 101, 102, 103, 104 | api-pcp: `src/pedidos/pedidos.service.ts` | 459-463, 500-506, 512-525, 545-569 | ok (807 linhas) |
| `prisma/models/producao.prisma` | 8 | api-pcp: `prisma/models/producao.prisma` | — | ok (580 linhas) |
| `producao.prisma` | 117, 202, 203 | api-pcp: `prisma/models/producao.prisma` | 29-54, 47-52, 262-275 | ok (580 linhas) |
| `roteiro-efetivo.ts` | 70, 193, 203 | api-pcp: `src/roteiros/roteiro-efetivo.ts` | — | ok (121 linhas) |
| `roteiro-item.controller.ts` | 193 | api-pcp: `src/roteiro-item/roteiro-item.controller.ts` | 25-25 | ok (55 linhas) |
| `roteiros.controller.ts` | 193 | api-pcp: `src/roteiros/roteiros.controller.ts` | 24-24 | ok (54 linhas) |
| `seed.ts` | 209 | av-hub: `api-comercial/prisma/seed.ts`<br>api-pcp: `prisma/seed.ts` | — | ok (139 linhas) |

## ✅ sem repositório nem arquivo citado (31)

- linha 66: - ✅ Roteiro, filas por setor, receber, iniciar, mover, pausar, retomar, concluir, reprovar, devolver, cancelar. É o único subfluxo com motor completo desde o in
- linha 67: - ✅ Telas: Filas de Produção, Destinação do Pedido, Acompanhamento dos Pedidos, Cadastros operacionais; na `develop`, também Montagem do Roteiro e Produtos em P
- linha 68: - ✅ Na `develop` (23/10): ação "finalizar" no setor (status `FINALIZADO`, para o cronômetro e a peça aguarda no setor; `reabrir` volta a `EM_ANDAMENTO`).
- linha 69: - ✅ Na `develop` (27/10): Ordem de Produção impressa (PDF, 2ª via) e fabricado aprovado vira lote e saldo no Estoque (LOG-53).
- linha 105: | 5 | `receber` e `iniciar` são obrigatórios em todo setor antes de `mover` ou `concluir`. `iniciar` preenche `startedAt` (cronômetro) e, em setor com `exigeMaq
- linha 106: | 6 | `concluir` só no **último** setor do roteiro; `mover` só quando existe próximo (`:540-547`, `:426-434`). `mover` aceita `idSetorDestino` livre dentro da f
- linha 107: | 7 | `reprovar` é exclusivo de setor tipo `QUALIDADE` (403 fora dele) e exige `EM_ANDAMENTO` (`:966-989`, `:1011-1021`) | ✅ |
- linha 108: | 8 | `retrabalho` só sai de `REPROVADO`: cancela a linha e cria outra `EM_TRANSITO` no setor anterior com `retrabalho = true` (`:1124-1192`). Não altera a quan
- linha 109: | 9 | `devolver` cria linha nova ligada por `idDevolvidoDe`; a antiga vira `CANCELADO` e nunca é editada (`:1387-1488`). Não vale para parcial com requisição de
- linha 110: | 10 | Item de pedido inativo bloqueia toda ação, menos `cancelar` (`:202-208`) | ✅ |
- linha 111: | 11 | **Tudo que é fabricado volta ao Estoque** como lote e saldo, e só sai pelo documento de retirada. Decisão do Nathan de 14/10 | 📝 ✅ lote e saldo na `deve
- linha 113: | 13 | Novo norte (P6): o PCP decide entre retrabalho e reabrir a compra. Roteiro individual do item (`RoteiroItem`, C8) é a ferramenta decidida | 📝 ✅ `Roteiro
- linha 176: | `GET /itens-parciais?idSetorAtual=&status=&idItemPedido=` | fila do setor, com `ehUltimaEtapa` | `movimentacoes:visualizar` | `controller:56-60`, `service:43-
- linha 177: | `GET /itens-parciais/contagem-por-setor` | badge por setor | idem | `controller:66-70` ✅ |
- linha 178: | `GET /itens-parciais/:id`, `/:id/setores-percorridos` | detalhe e destinos válidos de devolução | idem | `controller:93-149` ✅ |
- linha 179: | `PATCH /:id/receber` | `CRIADO` ou `EM_TRANSITO` para `RECEBIDO` | `movimentacoes:editar` | `service:224` ✅ |
- linha 180: | `PATCH /:id/iniciar` | `RECEBIDO` para `EM_ANDAMENTO` (máquina e operador) | idem | `service:299` ✅ |
- linha 181: | `PATCH /:id/mover` | `EM_ANDAMENTO` para `EM_TRANSITO` no próximo setor (ou `idSetorDestino`), com quantidade parcial | idem | `service:366` ✅ |
- linha 182: | `PATCH /:id/concluir` | `CONCLUIDO` no último setor | idem | `service:520` ✅ |
- linha 183: | `PATCH /:id/finalizar`, `PATCH /:id/reabrir` | finaliza o setor (com ou sem enviar) e reabre | idem | `develop` (23/10) ✅ |
- linha 184: | `PATCH /:id/aprovar-saida`, `PATCH /:id/receber-fabricado` | o "sim" da inspeção de saída e a entrada do fabricado no Estoque | idem | `develop` (27/10) ✅ ([[
- linha 185: | `PATCH /:id/pausar`, `/:id/retomar` | pausa e retomada | idem | `service:881`, `:1199` ✅ |
- linha 186: | `PATCH /:id/reprovar`, `/:id/resolver`, `/:id/retrabalho` | reprovação com `Divergencia`, falso alarme, retrabalho | idem | `service:1011`, `:1067`, `:1124` ✅
- linha 187: | `POST /:id/split`, `PATCH /:id/consolidar` | divide e junta parciais `RECEBIDO` | idem | `service:1250`, `:1616` ✅ sem botão na tela |
- linha 188: | `POST /:id/devolver`, `PATCH /:id/desfazer-recebimento` | devolução e desfazer | idem | `service:1387`, `:1557` ✅ |
- linha 189: | `PATCH /:id/cancelar` | cancela de qualquer status não terminal; libera reservas | `ordens-producao:deletar` | `controller:274-282`, `service:1506` ✅ |
- linha 190: | `POST /itens-parciais/lote/:acao` | ação em lote (`ACOES_LOTE_ITEM_PARCIAL`) | `movimentacoes:editar` | `controller:78-91` ✅ sem UI |
- linha 225: #### Fabricado vira lote ✅ (só na `develop`)
- linha 233: | 1 | Baixa de matéria-prima na retirada do Estoque (N16-140) e genealogia; hoje há a baixa imediata no "Atender pelo estoque" (`develop`) | Robert | F1 | 🟡 ba
- linha 234: | 2 | Fabricado aprovado vira lote e saldo: feito na `develop` (27/10). Falta a saída pelo documento de retirada | Robert | F1, `E5` | ✅ lote; 🔴 retirada |
- linha 235: | 3 | `RoteiroItem` lido por `mover`, `concluir` e Expedição: lido pelo motor na `develop`; conferir a Expedição | Robert | P6 | ✅ motor; ❓ Expedição |

## Citações deslocadas (o identificador está em outra linha) (3)

- nota linha 83: `itens-parciais.service.ts:722-730` (api-pcp) — `REVENDA` não está perto; aparece na linha 1016
- nota linha 95: `itens-parciais.service.ts:52-54` (api-pcp) — `PerfilSetor` não está perto; aparece na linha 100
- nota linha 103: `pedidos.service.ts:512-525` (api-pcp) — `QUALIDADE` não está perto; aparece na linha 583
