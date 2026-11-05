# Fatos de 14-Fiscal-Omie

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/14-Fiscal-Omie.md` no commit b27a30d (antes da troca dos números de tela do v1).
Gerada por `node _v3/scripts/fatos.mjs extrair`. Conferência: `node _v3/scripts/fatos.mjs conferir 14-Fiscal-Omie`.

## decisões e IDs (7)

- `N16-120`
- `N16-130`
- `N16-132`
- `N16-133`
- `N16-143`
- `N16-92`
- `N16-94`

## contratos (0)


## commits (1)

- `260e835`

## arquivo:linha (11)

- `/minhas-notas/page.ts`
- `/notas-equipe/page.ts`
- `/pcp-notas/page.ts`
- `/vendas/notas-fiscais-saida/page.ts`
- `components/Pedidos/EtapaDosItens.ts`
- `notasFiscais.ts:125-165`
- `notasFiscais.ts:21-46`
- `notasFiscais.ts:57-58`
- `pedidosVendas.ts`
- `pedidosVendas.ts:134-136`
- `src/utils/omie.js`

## rotas (2)

- `POST /comercial/clientes`
- `POST /comercial/propostas/:id/transformar`

## datas (7)

- `07/10`
- `08/10`
- `22/01/2027`
- `28/10`
- `28/10/2026`
- `29/10`
- `29/10/2026`

## código entre crases (83)

- `(`
- `(Dump Avhub linha 11084; recurso`
- `) usa`
- `) é a etapa do Omie (`
- `).`
- `); os nomes por operação estão em`
- `/meus-pedidos/pedido/...`
- `/minhas-notas`
- `/notas-equipe`
- `/pcp-notas`
- `/produtos/nfconsultar/`
- `/produtos/pedido/`
- `/vendas/notas-fiscais-saida`
- `0 é o pedido guarda-chuva e 1, 2... são parciais. A liberação (`
- `10-Anexo-Fora-do-Fluxo`
- `260e835`
- `:89-104`
- `Autorizado`
- `CONCLUIDO`
- `Cancelado`
- `Denegado`
- `Dev. Parcial`
- `Devolvido`
- `Encerrado`
- `Entrega.numeroNf`
- `ExcluirPedCompra`
- `Faturado`
- `IncluirPedido`
- `ItensPedido.quantidadePendente`
- `ListarNF`
- `ListarPedidos`
- `O1`
- `O2`
- `POST /comercial/clientes`
- `POST /comercial/propostas/:id/transformar`
- `Pendente`
- `SYNC_HOJE_CRON`
- `UpsertClienteCpfCnpj`
- `UpsertPedCompra`
- `X4`
- `afterUpsert`
- `api-acos-vital`
- `api-pcp`
- `app/(protected)/minhas-notas/page.tsx`
- `app/(protected)/notas-equipe/page.tsx`
- `app/(protected)/pcp-notas/page.tsx`
- `app/(protected)/vendas/notas-fiscais-saida/page.tsx`
- `autorizado`
- `cancelado`
- `codigo_empresa`
- `codigo_item_omie`
- `codigo_nf_omie`
- `components/Pedidos/EtapaDosItens.tsx`
- `config`
- `core.etapas_faturamento`
- `core_vendas_faturamento.notas_fiscais`
- `denegado`
- `develop`
- `devolucao_parcial`
- `devolvido`
- `do cabeçalho e de`
- `encerrado`
- `expedicao.concluido`
- `faturado`
- `faturado = S`
- `fn_sync_situacao_pv`
- `habilitado, tabela populada em produção, registro #5).`
- `master`
- `notasFiscais.ts:125-165`
- `notasFiscais.ts:21-46`
- `notasFiscais.ts:57-58`
- `numero_nf`
- `omie-elt-pipeline`
- `pedidosVendas.ts`
- `pedidos_vendas.situacao`
- `produto_vendas`
- `sequencial`
- `situacao`
- `situacao = 'Faturado'`
- `src/utils/omie.js`
- `status_sincronizacao_omie = pendente`
- `tpNF = 1`
- `trg_sync_situacao_pv`

## regras e linhas de conteúdo (64)

- A carga fica pronta e a Logística avisa o faturista, fora do sistema. `X4`
- O faturista emite a nota no Omie, inteira ou em partes. `O1`
- A cada 3 minutos, o pipeline lê os pedidos e o banco marca o pedido como Faturado. `O2`
- O pipeline lê as notas e grava o número da nota em cada item. Assim o item dá baixa. `O2`
- O vendedor vê o pedido e a nota nas telas de notas. `O2`
- | Faturamento (Omie) | Emite a nota de saída |
- | Expedição ou Logística | Avisa que a carga está pronta |
- | Pipeline do Omie (`omie-elt-pipeline`) | Traz pedidos e notas para o banco do av-hub |
- | Vendedor | Acompanha o pedido faturado |
- | Gustavo e Robert | Gustavo cuida do banco e do pipeline; Robert, da futura sinalização no MES |
- Só o Omie emite ou edita nota fiscal (decisão #30).
- A baixa do item volta pelo pipeline, sem tela e sem escrita do MES.
- O banco calcula a situação do pedido a partir das marcas do Omie.
- As telas de notas só mostram o que o Omie já emitiu.
- A única escrita do pipeline no Omie é o envio da ordem de compra. A API do Hub, por conta própria, também cadastra cliente no Omie (`POST /comercial/clientes`, 28/10/2026).
- Remessa de produtos fica para o Ciclo 2 (22/01/2027).
- ✅ Omie emite a nota; o pipeline traz pedido e nota; as telas de notas do hub.
- 🔴 Fila de sinalização de carga pronta (tela 11.1) e a volta da nota ao MES.
- 🔴 Remessa de produtos (Ciclo 2).
- 🟡 Pedido faturado antes da entrega: só avisa. Dicionário de etapas do Omie.
- ❓ Itens legados com `codigo_item_omie` nulo.
- | 1 | Emissão fiscal 100% no Omie; nenhum módulo do ERP emite ou edita NF | 📝 (#30) |
- | 2 | A baixa de item no pedido volta pelo **pipeline** (polling), sem tela e sem escrita do MES | 📝 ✅ |
- | 3 | Parcial x integral na faturação é decisão da Expedição ([[13-Expedicao]], X2, T-06); pela N16-130, de 29/10, quem decide é o vendedor, pela marca "pode faturar em partes" | 📝 |
- | 4 | A sinalização ao Omie é uma fila de cargas prontas (tela 11.1), com acompanhamento do número e da chave da NF pelo pipeline | 🟡 desenho, sem código |
- | 5 | Remessa de produtos (registro de remessa) fica para o Ciclo 2 (22/01/2027) | 📝 |
- | 6 | Só uma escrita do pipeline no Omie: envio da OC (`UpsertPedCompra`, `ExcluirPedCompra`; `omie-elt-pipeline` `master` sem mudança desde 08/10). A `api-acos-vital` (`develop`) já escreve cliente no Omie por `UpsertClienteCpfCnpj` (`260e835`, 28/10, `src/utils/omie.js`); o pedido da proposta (`IncluirPedido`) ainda não é enviado: `POST /comercial/propostas/:id/transformar` grava o pedido do Hub com `status_sincronizacao_omie = pendente` e deixa o envio para a pipeline | ✅ [[06-Circuito-de-Compra]]; 🔴 envio do pedido |
- | Ordem | Condição (flag do Omie) | `situacao` |
- | 1 | `cancelado` | `Cancelado` |
- | 2 | `denegado` | `Denegado` |
- | 3 | `devolvido` | `Devolvido` |
- | 4 | `devolucao_parcial` | `Dev. Parcial` |
- | 5 | `encerrado` | `Encerrado` |
- | 6 | `faturado` | `Faturado` |
- | 7 | `autorizado` | `Autorizado` |
- | 8 | nenhuma | `Pendente` |
- | Nome atual | Nome antigo | Rota | App | Estado |
- | Fila de sinalização de faturamento (11.1) | — | — | MES | 🔴 não existe |
- | Minhas Notas | — | `/minhas-notas` | HUB | ✅ `app/(protected)/minhas-notas/page.tsx` (pós-fato, por vendedor) |
- | Notas da Equipe | — | `/notas-equipe` | HUB | ✅ `app/(protected)/notas-equipe/page.tsx` |
- | Notas do PCP | — | `/pcp-notas` | HUB | ✅ `app/(protected)/pcp-notas/page.tsx` |
- | Notas Fiscais de Saída | — | `/vendas/notas-fiscais-saida` | HUB | ✅ `app/(protected)/vendas/notas-fiscais-saida/page.tsx` |
- | Etapa dos itens (cartão no pedido) | — | `/meus-pedidos/pedido/...` | HUB | ✅ `components/Pedidos/EtapaDosItens.tsx`; só chega até `expedicao.concluido` |
- | O quê | Direção | Fonte |
- | `ListarPedidos` (`/produtos/pedido/`) | pipeline lê do Omie por janela de data de inclusão | `pedidosVendas.ts` ✅ |
- | `ListarNF` (`/produtos/nfconsultar/`, `tpNF = 1`, por data de emissão) | pipeline lê do Omie | `notasFiscais.ts:21-46` ✅ |
- | `core_vendas_faturamento.notas_fiscais` (chave `codigo_empresa`, `codigo_nf_omie`) | destino da NF | `notasFiscais.ts:57-58` ✅ |
- | `afterUpsert` da NF | grava `codigo_nf_omie` e `numero_nf` nos itens de `produto_vendas` do mesmo pedido que ainda não têm NF | `notasFiscais.ts:125-165` ✅ |
- | Cron do pipeline | hoje a cada 3 min (`SYNC_HOJE_CRON`); mês a cada 20 min; últimos meses a cada 3 h; full 3h17 | `config` `:89-104` ✅ |
- | Sinalização do MES ao Omie (11.1) | MES para Omie, via av-hub | 🔴 sem contrato |
- `ListarPedidos` a cada 3 minutos (janela de hoje) traz o pedido com `faturado = S`; a trigger recalcula `situacao = 'Faturado'`.
- `ListarNF` traz a nota e o `afterUpsert` carimba `codigo_nf_omie` e `numero_nf` em cada item de `produto_vendas`. O item "dá baixa" no pedido por esse vínculo.
- | # | O quê | Dono | Nó | Selo |
- | 1 | Contrato e fila de sinalização MES para o av-hub (carga pronta por pedido e itens) e destino no Omie | Nathan desenha, Gustavo (API e pipeline), Robert (MES) | X4, O1 | 🔴 |
- | 2 | Tela 11.1 no MES: cargas prontas, sinalizar, ver número e chave da NF | Robert | O1 | 🔴 |
- | 3 | Volta da NF ao MES: ligar `Entrega.numeroNf` ao número do Omie (hoje digitado) e mostrar "faturado" na Expedição | Robert, Gustavo | O2 | 🔴 |
- | 4 | Pedido em `Faturado` antes de entregue: definir se o MES bloqueia ou só avisa | Nathan | O2 | 🟡 |
- | 5 | Remessa de produtos (Ciclo 2) | Robert | O1 | 🔴 |
- | 6 | Reconciliar itens legados com `codigo_item_omie` nulo que travam o vínculo da NF | Gustavo | O2 | ❓ |
- | 7 | Dicionário de etapas do Omie para o Portal do Vendedor, ligando `core.etapas_faturamento` | Nathan | O2 | 🟡 |
- Nathan e Faturamento: quem sinaliza (Expedição ou Logística) e qual o gatilho (carga fechada ou item `CONCLUIDO`)? **Decidido em 29/10/2026 (N16-132), ver quadro no topo.**
- Nathan: sinalização por carga ou por pedido? Faturamento parcial gera um pedido filho (`sequencial`) no Omie? **Respondido (N16-132, N16-92 a N16-94, N16-133), ver quadro no topo: por carga fechada.**
- Gustavo: o pipeline tem latência de minutos; o MES precisa do retorno em quanto tempo?
- Nathan: devolução de cliente (`Devolvido`, `Dev. Parcial`) afeta saldo do Estoque? Fluxo decidido para o Estoque na Fase D, sem código.

## subfluxo mermaid

```text
flowchart TD
    X4["X4 · Logistica de saida"] -.->|"sinalizacao 11.1 (sem codigo)"| FILA["Fila de sinalizacao de faturamento"]
    FILA -.-> O1
    X4 -->|"aviso fora do sistema"| O1["O1 · Omie emite a nota fiscal"]
    O1 --> O2["O2 · Baixa o item no pedido<br/>faturado = S, numero_nf nos itens"]
    O2 -->|"pipeline ListarPedidos e ListarNF"| HUB["av-hub · pedido Faturado, notas"]
    HUB --> V["Vendedor acompanha"]
    O2 -.->|"volta da NF ao MES (sem codigo)"| X4
```
