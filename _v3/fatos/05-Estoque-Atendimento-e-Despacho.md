# Fatos de 05-Estoque-Atendimento-e-Despacho

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/05-Estoque-Atendimento-e-Despacho.md`, antes de mexer na nota.
Gerada por `node _v3/scripts/fatos.mjs extrair`. Conferência: `node _v3/scripts/fatos.mjs conferir 05-Estoque-Atendimento-e-Despacho`.

## decisões e IDs (15)

- `BL-001`
- `BL-028`
- `BL-035`
- `BL-049`
- `BL-050`
- `BL-066`
- `BL-067`
- `DEC-1`
- `N14-20`
- `N16-09`
- `N16-120`
- `N16-121`
- `N16-122`
- `N16-140`
- `N16-143`

## contratos (5)

- `API-008`
- `API-011`
- `LOG-47`
- `LOG-53`
- `LOG-54`

## commits (5)

- `6914fe9`
- `6c11147`
- `8d07917`
- `97b9adc`
- `ab3318d`

## arquivo:linha (49)

- `AtenderEstoqueModal.ts`
- `alertas.controller.ts:19-25`
- `atendimento/page.ts`
- `circuito-compra.ts:166-250`
- `circuito-compra.ts:19-25`
- `estoque-operacao.controller.ts:39-43`
- `estoque-operacao.controller.ts:45-49`
- `estoque-operacao.controller.ts:66-70`
- `estoque-operacao.controller.ts:78-88`
- `estoque-operacao.controller.ts:90-98`
- `estoque-operacao.helpers.ts:150-170`
- `estoque-operacao.helpers.ts:208-284`
- `estoque-operacao.helpers.ts:287`
- `estoque-operacao.helpers.ts:431-452`
- `estoque-operacao.service.ts:112-147`
- `estoque-operacao.service.ts:398-445`
- `estoque-operacao.service.ts:399-401`
- `estoque-operacao.service.ts:404-409`
- `estoque-operacao.service.ts:429-437`
- `estoque-operacao.service.ts:657-673`
- `estoque.prisma`
- `estoque.prisma:378-382`
- `estoque.prisma:38-43`
- `estoque.prisma:385-393`
- `estoque.prisma:45-52`
- `estoque.prisma:86-106`
- `integracao-avhub.controller.ts`
- `itens-custo.ts`
- `itens-parciais.controller.ts`
- `itens-parciais.controller.ts:163-180`
- `itens-parciais.service.ts:1450`
- `itens-parciais.service.ts:275-285`
- `itens-parciais.service.ts:588-590`
- `itens-parciais.service.ts:592-593`
- `itens-parciais.service.ts:595-600`
- `itens-parciais.service.ts:607`
- `itens-parciais.service.ts:617`
- `itens-parciais.service.ts:629-639`
- `itens-parciais.service.ts:650-659`
- `itens-parciais.service.ts:701-714`
- `itens-parciais.service.ts:721-727`
- `itens-parciais.service.ts:727-730`
- `itens-parciais.service.ts:744-856`
- `itens-parciais.service.ts:862-874`
- `oc-referencia-avhub.service.ts`
- `ordens_compra.route.js:982`
- `pedidos.service.ts:226-232`
- `pedidos.service.ts:695-699`
- `vw_ordens_compra_referencia_mes.swagger.js`

## rotas (17)

- `GET /estoque/alertas/estoque-minimo`
- `GET /estoque/lotes/:id/etiqueta`
- `GET /estoque/movimentos`
- `GET /estoque/reservas`
- `GET /estoque/saldo`
- `GET /estoque/saldo/disponivel-parcial/:id`
- `GET /estoque/saldo/disponivel-parcial/:idItemParcial`
- `GET /itens/custo`
- `GET /ordens-compra/referencia`
- `PATCH /estoque/reservas/:id/liberar`
- `PATCH /itens-parciais/:id/aprovar-saida`
- `PATCH /itens-parciais/:id/atender-estoque`
- `PATCH /itens-parciais/:id/receber`
- `PATCH /itens-parciais/:id/receber-fabricado`
- `POST /estoque/lotes/carga-inicial`
- `POST /estoque/movimentos`
- `PUT /estoque/lotes/:id/custo`

## datas (9)

- `08/10`
- `09/10`
- `14/10`
- `15/10`
- `19/10`
- `20/10`
- `27/10`
- `27/10/2026`
- `29/10/2026`

## código entre crases (207)

- `(codigo_empresa, codigo_produto_omie)`
- `/estoque-operacao/atendimento`
- `/estoque-operacao/lotes/[id]`
- `/estoque-operacao/mapa-deposito`
- `/estoque-operacao/movimentacao`
- `/estoque-operacao/painel-estoque`
- `/estoque-operacao/reservas`
- `/estoque-operacao/saldo`
- `/rnc-pendentes`
- `20261009140000_lote_custo`
- `6914fe9`
- `6c11147`
- `8d07917`
- `97b9adc`
- `:1587`
- `:253-258`
- `:607-613`
- `:623-627`
- `:657-659`
- `:744-852`
- `:746-779`
- `:784-852`
- `:808-811`
- `AJUSTE`
- `ATIVA`
- `AtenderEstoqueModal.tsx:232`
- `AtenderEstoqueModal.tsx:332-345`
- `CARGA_INICIAL`
- `COMPRA`
- `CONSUMIDA`
- `CRIADO`
- `ConsumoMateriaPrima`
- `E1`
- `E2`
- `E3`
- `E4`
- `E5`
- `E6`
- `EM_ANDAMENTO`
- `EM_TRANSITO`
- `ENTRADA`
- `ESTOQUE`
- `EXPEDICAO`
- `GET /estoque/alertas/estoque-minimo`
- `GET /estoque/lotes/:id/etiqueta`
- `GET /estoque/movimentos`
- `GET /estoque/reservas`
- `GET /estoque/saldo`
- `GET /estoque/saldo/disponivel-parcial/:id`
- `GET /estoque/saldo/disponivel-parcial/:idItemParcial`
- `GET /itens/custo`
- `GET /ordens-compra/referencia`
- `LIBERADA`
- `LIBERADO`
- `MANUAL`
- `MovimentoEstoque`
- `OC`
- `OrigemCusto`
- `OrigemLote`
- `P3`
- `PATCH /estoque/reservas/:id/liberar`
- `PATCH /itens-parciais/:id/aprovar-saida`
- `PATCH /itens-parciais/:id/atender-estoque`
- `PATCH /itens-parciais/:id/receber`
- `PATCH /itens-parciais/:id/receber-fabricado`
- `PENDENTE`
- `POST /estoque/lotes/carga-inicial`
- `POST /estoque/movimentos`
- `PRODUCAO`
- `PUT /estoque/lotes/:id/custo`
- `PerfilDeposito.podeAtuar`
- `PerfilSetor.podeAtuar`
- `QUARENTENA`
- `R4`
- `RECEBIDO`
- `RECEBIMENTO`
- `REPROVADO`
- `REQUISICAO`
- `ROTEIRO`
- `Reserva`
- `SAIDA`
- `StatusQualidadeLote`
- `StatusReserva`
- `TRANSFERENCIA`
- `TipoMovimentoEstoque`
- `ab3318d`
- `alertas.controller.ts:19-25`
- `alocacoes`
- `alocacoes[]`
- `alterado_em`
- `api-pcp`
- `app-pcp`
- `aprovado`
- `aprovar-saida`
- `atendidoPeloEstoque`
- `atendidoPeloEstoque = true`
- `atendimento`
- `atendimento/page.tsx:1-16`
- `circuito-compra.ts:166-250`
- `circuito-compra.ts:19-25`
- `codigoEmpresa`
- `codigoProdutoOmie`
- `consumirReservasDaParcial`
- `cotacao_a_conferir`
- `depositos`
- `destino`
- `destinoRestante`
- `destinoRestante = COMPRA`
- `destino[]`
- `develop`
- `devolverAoEstoqueParciaisProntas`
- `ensurePodeAtuar`
- `estoque`
- `estoque-custo`
- `estoque-custo:editar`
- `estoque-operacao.controller.ts:39-43`
- `estoque-operacao.controller.ts:45-49`
- `estoque-operacao.controller.ts:66-70`
- `estoque-operacao.controller.ts:78-88`
- `estoque-operacao.controller.ts:90-98`
- `estoque-operacao.helpers.ts:150-170`
- `estoque-operacao.helpers.ts:208-284`
- `estoque-operacao.helpers.ts:287`
- `estoque-operacao.helpers.ts:431-452`
- `estoque-operacao.service.ts:112-147`
- `estoque-operacao.service.ts:398-445`
- `estoque-operacao.service.ts:399-401`
- `estoque-operacao.service.ts:404-409`
- `estoque-operacao.service.ts:429-437`
- `estoque-operacao.service.ts:657-673`
- `estoque.prisma`
- `estoque.prisma:378-382`
- `estoque.prisma:38-43`
- `estoque.prisma:385-393`
- `estoque.prisma:45-52`
- `estoque.prisma:86-106`
- `estornarConsumosDaParcial`
- `idLoteCompra = null`
- `idParcialOrigem`
- `idReserva`
- `id_item_oc`
- `id_lote_pai`
- `id_requisicao_item`
- `integracao-avhub.controller.ts`
- `itens-custo.ts`
- `itens-parciais.controller.ts`
- `itens-parciais.controller.ts:163-180`
- `itens-parciais.service.ts:1450`
- `itens-parciais.service.ts:275-285`
- `itens-parciais.service.ts:588-590`
- `itens-parciais.service.ts:592-593`
- `itens-parciais.service.ts:595-600`
- `itens-parciais.service.ts:607`
- `itens-parciais.service.ts:617`
- `itens-parciais.service.ts:629-639`
- `itens-parciais.service.ts:650-659`
- `itens-parciais.service.ts:701-714`
- `itens-parciais.service.ts:721-727`
- `itens-parciais.service.ts:727-730`
- `itens-parciais.service.ts:744-856`
- `itens-parciais.service.ts:862-874`
- `localizacoes_estoque`
- `lote_custo`
- `lote_custo.custo_liquido_unitario`
- `lotes`
- `main`
- `mapa-deposito`
- `materiais`
- `movimentacao`
- `movimentacao:criar`
- `movimentacoes:editar`
- `movimentacoes:visualizar`
- `movimentos_estoque`
- `oc-referencia-avhub.service.ts`
- `ordem_separacao`
- `ordens_compra.finalidade`
- `ordens_compra.route.js:982`
- `ordens_compra_itens_vinculos`
- `origem`
- `origem = OC`
- `origem = RECEBIMENTO`
- `origem CARGA_INICIAL`
- `origem OC`
- `outrasFiliais`
- `painel-estoque`
- `pedido_venda`
- `pedidos.service.ts:226-232`
- `pedidos.service.ts:695-699`
- `perfil_depositos`
- `public`
- `quantidade`
- `quantidadeConsumida`
- `quantidadeEstoque`
- `quantidade_consumida`
- `receber()`
- `receber-fabricado`
- `reservarParaParcial`
- `reservas`
- `restante = 0`
- `saldo`
- `saldo:visualizar`
- `saldos_estoque`
- `setorDoCircuito`
- `status_qualidade`
- `vw_ordens_compra_referencia_mes`
- `vw_ordens_compra_referencia_mes.swagger.json:61-88`
- `vw_pedido_venda_itens_compra`

## regras e linhas de conteúdo (116)

- A parcial chega ao Estoque, vinda do PCP, com a quantidade toda.
- O almoxarife vê o saldo livre na filial do pedido: lotes liberados menos reservas. `E1`
- Ele informa quanto atende, de zero até a quantidade da parcial, e de quais lotes. Atender zero é um clique. `E2`
- O sistema reserva o lote e separa a parte atendida, que segue para a Expedição. `E3`
- Para o restante, o almoxarife escolhe: solicitar compra ou enviar à produção. `E4`
- O item comprado volta ao mesmo Estoque depois que a Qualidade libera o lote. O almoxarife faz a reserva. `E5`
- Na saída física, quem precisa da mercadoria pede um documento de retirada, e a baixa acontece na retirada. Hoje a baixa acontece quando a Embalagem recebe a parcial. `E6`
- | Almoxarife | Atende pelo saldo, solicita compra, dá entrada, ajusta e transfere saldo |
- | Gestor de Estoque | Supervisiona o painel e o saldo |
- | Expedição (Embalagem) | Hoje dispara a baixa ao receber a parcial. No desenho final, pede a retirada |
- | Produção | Receberia matéria-prima por documento de retirada, que ainda não existe |
- | Compras e CCP (acompanhamento de compras) | Recebem o "Solicitar compra" pelo setor Requisições |
- | Robert | Dono do código do MES (sistema de chão de fábrica) |
- O saldo livre é por filial: lotes liberados menos reservas ativas, na filial do pedido.
- Saldo zero exige clique. A parcial nunca passa sozinha.
- O saldo é lido e a reserva criada no mesmo passo, para evitar corrida entre pedidos.
- A reserva não expira. Termina por liberação explícita ou quando a ordem é excluída.
- Na Revenda, o restante sempre vai para compra.
- Na fabricação, o restante pode comprar matéria-prima ou seguir o roteiro.
- O item comprado só volta ao Estoque depois que a Qualidade libera o lote.
- Ajuste de saldo não usa o que está reservado e exige motivo.
- O custo do lote é opcional e nunca bloqueia nada.
- Tudo que é fabricado ou comprado passa pelo Estoque (decisão de 14/10). O fabricado aprovado já volta ao Estoque como lote na `develop` (27/10).
- ✅ Telas Atendimento, Saldo, Reservas, Movimentação e Lote com etiqueta.
- ✅ Reserva, divisão da parcial, solicitar compra, entrada do item comprado e baixa na Embalagem.
- 🟡 Painel do Estoque e Mapa do Depósito ainda são protótipos.
- ✅ Na `develop` do MES: fabricado aprovado vira lote `PRODUCAO` e saldo (27/10); rota `GET /itens/custo` com o custo do item (27/10, `6c11147`); custo da OC no lote do Recebimento (19/10); baixa de matéria-prima no "Atender pelo estoque" (19/10).
- 🔴 Documento de retirada e baixa na retirada.
- 🔴 Baixa de matéria-prima na retirada (hoje é na hora do atendimento).
- 🔴 Saldo futuro, com as OCs (ordens de compra) em andamento (BL-050).
- 🔴 Custo obrigatório em todo lote (BL-066) e custo do fabricado (BL-067).
- 🔴 Contagem cíclica, transferência entre filiais e separação física.
- | Almoxarife | Atende pelo saldo, solicita compra, dá entrada, ajusta e transfere saldo | MES, `/estoque-operacao/atendimento` e demais telas de Estoque |
- | Gestor de Estoque | Supervisiona; não aparece nas conversas operacionais | MES, painel e saldo |
- | Expedição (Embalagem) | Hoje dispara a baixa ao receber a parcial; no desenho final pede a retirada | MES, [[13-Expedicao]] |
- | Produção | Receberia matéria-prima por documento de retirada (não existe) | MES, [[10-Producao-e-Roteiro]] |
- | Compras · CCP | Recebe o "Solicitar compra" via setor Requisições | [[06-Circuito-de-Compra]] |
- | Robert | Dono do código | `api-pcp`, `app-pcp` |
- | 1 | O Estoque (setor `estoque`) é a **etapa 1** de todo roteiro e o **único** Estoque do circuito (a compra volta a ele) | 📝 ✅ `pedidos.service.ts:226-232`, `circuito-compra.ts:19-25` |
- | 2 | Saldo disponível = soma dos lotes `LIBERADO` − reservas `ATIVA`, na **filial do pedido** (DEC-1) | 📝 ✅ `estoque-operacao.helpers.ts:150-170` (valida `LIBERADO`, mesmo produto e filial, disponível) |
- | 3 | A leitura do saldo e a criação da reserva acontecem **no mesmo passo** (evita corrida entre pedidos) | 📝 ✅ `itens-parciais.service.ts:595-600`, `:744-852` |
- | 4 | **Saldo zero exige clique**: a parcial nunca passa sozinha; atender 0 é uma ação explícita | 📝 ✅ `itens-parciais.service.ts:588-590`, `:657-659` (#31b) |
- | 5 | Reserva nasce `ATIVA`, **sem expiração**; libera por ação explícita (`LIBERADA`) ou quando a ordem é excluída | 📝 ✅ `estoque.prisma:45-52`, `pedidos.service.ts:695-699` |
- | 6 | Na **Revenda** o restante **sempre** vai para compra (não há o que produzir) | 📝 ✅ `itens-parciais.service.ts:721-727` |
- | 7 | Na **Fabricação** o restante pode seguir o roteiro (`ROTEIRO`) ou ir à compra (`COMPRA`, matéria-prima) | 📝 ✅ `:607-613`, `AtenderEstoqueModal.tsx:332-345` |
- | 8 | A parte atendida vai para a **primeira etapa `EXPEDICAO`** depois do Estoque; sem ela no roteiro, 409 | ✅ `itens-parciais.service.ts:701-714` |
- | 9 | Parcial de item **comprado** só entra de volta no Estoque depois que a Qualidade liberou o lote (409 se há lote `PENDENTE`) | 📝 ✅ `itens-parciais.service.ts:862-874` |
- | 10 | **Despacho é no Estoque**: quem precisa da mercadoria gera o **documento de retirada**; a **baixa do saldo ocorre na retirada** | 📝 🔴 não existe; contrato [[Contratos-da-v2\|LOG-54]], decisões N16-120 a N16-122 |
- | 11 | **Tudo que é fabricado ou comprado vai para o Estoque**: o fabricado aprovado vira lote e saldo e só então é despachado | 📝 ✅ na `develop` (27/10, `ab3318d`): `aprovar-saida` e `receber-fabricado`; 🔴 a Expedição ainda não sai do Estoque pela retirada |
- | 12 | **Custo do item = média ponderada dos lotes** das reservas (Regra A: faturamento parcial usa o custo médio do item no pedido) | 📝 ✅ `GET /itens/custo` na `develop` (27/10, `6c11147`, `integracao-avhub.controller.ts`, regra em `itens-custo.ts`); fabricado fora até o custo da matéria-prima ([[Contratos-da-v2\|API-008]]) |
- | 13 | O custo do lote é **opcional hoje** e não bloqueia carga inicial, recebimento, reserva nem despacho. A N16-09 decide que **todo lote tem custo** (obrigatório, inclusive na carga inicial) | ✅ opcional no código (`estoque-operacao.service.ts:404-409`, `estoque.prisma:385-393`); 📝 N16-09, 🔴 obrigatório (BL-066) |
- | 14 | Lote filho de cisão herda o custo do pai; transferência entre depósitos não muda o custo | 📝 ✅ `estoque-operacao.helpers.ts:431-452` |
- | 15 | Ajuste de saldo não pode comer o que já está reservado; motivo obrigatório | ✅ `estoque-operacao.service.ts:657-673` |
- | 16 | Carga inicial (marco zero) nasce `LIBERADO` sem inspeção; é o primeiro estoque | 📝 ✅ `estoque-operacao.service.ts:429-437` |
- | 17 | **Saldo futuro:** para OC de itens de **estoque** (sem pedido de venda), o Estoque do MES mostra as **OCs em andamento** e a parte delas que preenche o estoque: **saldo atual + saldo futuro** ([[Glossario]]). A fonte é a referência da OC do hub (`GET /ordens-compra/referencia`, item com `destino` do tipo `estoque`) | 📝 N14-20; ✅ o MES já lê a referência da OC (K4, `develop`, 15/10); 🔴 o cálculo e a coluna (BL-050) |
- | 18 | Se a OC está **vinculada a um pedido de venda** (`destino` do tipo `pedido_venda`), o Estoque e o PCP veem que já existe OC para aquele pedido; essa quantidade **não** entra no saldo futuro livre | 📝 N14-20 🔴 (BL-049: o PCP ainda não vê a OC do pedido na Triagem e na Destinação) |
- | `StatusQualidadeLote` | Conta no disponível? | Quem muda |
- | `PENDENTE` | Não | Recebimento cria ([[07-Recebimento]]) |
- | `LIBERADO` | **Sim** | Qualidade aprova ou carga inicial |
- | `REPROVADO` | Não | Qualidade ([[08-Qualidade-Entrada]]) |
- | `QUARENTENA` | Não | Reprovação parcial |
- | `ATIVA` | Nasce em "Atender pelo estoque" (`reservarParaParcial`) |
- | `CONSUMIDA` | A parcial é recebida na Embalagem (`consumirReservasDaParcial`, saída do lote) |
- | `LIBERADA` | Ordem excluída, parcial cancelada ou liberação manual com motivo |
- | Nome atual | Nome antigo | Rota | Slug | Estado |
- | Atendimento | Atendimento / Baixa | `/estoque-operacao/atendimento` | `atendimento` | ✅ fila do setor `ESTOQUE` com modal "Atender pelo estoque" (`atendimento/page.tsx:1-16`, `AtenderEstoqueModal.tsx:232`) |
- | Saldo | Consulta de Saldo | `/estoque-operacao/saldo` | `saldo` | ✅ |
- | Reservas | — | `/estoque-operacao/reservas` | `reservas` | ✅ consulta e liberação |
- | Movimentação | — | `/estoque-operacao/movimentacao` | `movimentacao` | ✅ entrada, ajuste, transferência |
- | Lote (detalhe, etiqueta) | — | `/estoque-operacao/lotes/[id]` | `saldo` | ✅ PDF Code128 `GET /estoque/lotes/:id/etiqueta` |
- | Painel do Estoque | Dashboard do Estoque | `/estoque-operacao/painel-estoque` | `painel-estoque` | 🟡 protótipo com dados de exemplo; dois alertas reais |
- | Mapa do Depósito | — | `/estoque-operacao/mapa-deposito` | — | 🟡 mock |
- | Retirada (documento de despacho) | — | — | — | 🔴 não existe |
- | Saldo futuro (coluna e detalhe das OCs em andamento no Atendimento e no Saldo) | — | `/estoque-operacao/atendimento`, `/estoque-operacao/saldo` | `atendimento`, `saldo` | 🔴 não existe (BL-050) |
- | Método e rota | Permissão | Efeito | Código |
- | `GET /estoque/saldo/disponivel-parcial/:idItemParcial` | `movimentacoes:visualizar` | Lotes `LIBERADO` com disponível, mais `outrasFiliais` | `estoque-operacao.controller.ts:45-49`, `estoque-operacao.service.ts:112-147` ✅ |
- | `PATCH /itens-parciais/:id/atender-estoque` | `movimentacoes:editar` | `quantidadeEstoque`, `alocacoes[]` (lote e quantidade), `destinoRestante` `ROTEIRO` ou `COMPRA`, observação | `itens-parciais.controller.ts:163-180`, `itens-parciais.service.ts:607` ✅ |
- | `GET /estoque/saldo` | `saldo:visualizar` | Saldo por lote e localização; custo só para quem tem `estoque-custo` | `estoque-operacao.controller.ts:39-43` ✅ |
- | `POST /estoque/lotes/carga-inicial` | `movimentacao:criar` | Lote `LIBERADO`, custo opcional (`estoque-custo:editar`) | `estoque-operacao.controller.ts:66-70`, `estoque-operacao.service.ts:398-445` ✅ |
- | `GET /estoque/movimentos`, `POST /estoque/movimentos` | `movimentacao` | Transferência e ajuste | `estoque-operacao.controller.ts:78-88` ✅ |
- | `GET /estoque/reservas`, `PATCH /estoque/reservas/:id/liberar` | `reservas` | Consulta e liberação com motivo | `estoque-operacao.controller.ts:90-98` ✅ |
- | `GET /estoque/alertas/estoque-minimo`, `/rnc-pendentes` | Estoque | Dois alertas do painel | `alertas.controller.ts:19-25` ✅ |
- | `GET /itens/custo` (MES → av-hub) | chave do av-hub | Custo do item (uma linha por filial, pedido e produto; cursor `alterado_em`) | [[Contratos-da-v2\|API-008]], [[Contratos-da-v2\|LOG-47]] ✅ na `develop` do MES (27/10, `6c11147`); o job do hub ainda não foi testado junto |
- | `PATCH /itens-parciais/:id/aprovar-saida`, `PATCH /itens-parciais/:id/receber-fabricado` | `movimentacoes:editar` | O "sim" da inspeção de saída e a entrada do fabricado no Estoque, com a localização | [[Contratos-da-v2\|LOG-53]] ✅ `develop` (27/10, `itens-parciais.controller.ts`) |
- | `PUT /estoque/lotes/:id/custo` | `estoque-custo:editar` | Informa ou corrige o custo do lote à mão, com motivo e histórico | [[Contratos-da-v2\|API-008]] ✅ `develop` (27/10) |
- | Documento de retirada (criar, listar, confirmar) | a definir | Gera a retirada; baixa o saldo | 🔴 sem contrato, sem rota |
- **Tudo atendido** (`restante = 0`): a própria parcial vai `EM_TRANSITO` para a Expedição com `atendidoPeloEstoque = true` e a reserva nasce sobre ela (`:746-779`).
- **Parte atendida**: a parcial original segue com o restante; nasce uma parcial nova, `atendidoPeloEstoque`, com `idParcialOrigem`, indo à Expedição, e a reserva aponta para ela (`:784-852`). A soma das parciais continua igual ao total do item.
- **Documento de retirada** gerado por quem precisa da mercadoria (Expedição ou Produção), com itens, lotes, quantidades e solicitante.
- **Baixa na retirada**, feita pelo Estoque, e não no recebimento da Embalagem.
- Reserva passa a significar só "separar sem despachar".
- A matéria-prima enviada à produção também sai por documento de retirada.
- | Tabela (todas em `public`, MES) | Papel |
- | `depositos`, `localizacoes_estoque`, `perfil_depositos` | Depósito (pertence a uma filial), localização, permissão por perfil |
- | `materiais` | Produto do av-hub espelhado; chave `(codigo_empresa, codigo_produto_omie)`; peso teórico e tolerância |
- | `lotes` | `status_qualidade`, `origem`, `id_lote_pai`, `id_requisicao_item`, NF, fornecedor |
- | `saldos_estoque`, `movimentos_estoque` | Saldo por lote, localização e depósito; movimentos `ENTRADA`, `SAIDA`, `TRANSFERENCIA`, `AJUSTE` |
- | `reservas` | Lote, parcial, `quantidade`, `quantidade_consumida`, status, snapshot do pedido |
- | `lote_custo` | 1:1 com `lotes`: custo líquido unitário, componentes, `id_item_oc`, `cotacao_a_conferir` (migration `20261009140000_lote_custo`) |
- | # | O quê | Dono | Nó | Selo |
- | 1 | **Documento de retirada** (modelo, rotas, tela de pedido e de confirmação) e **baixa do saldo na retirada**; tirar `consumirReservasDaParcial` do `receber()` da Embalagem | Robert (decisão: Nathan) | E6 | 🔴 |
- | 2 | Fabricado vira lote e saldo: feito na `develop` (27/10). Falta a Expedição passar a sair do Estoque com reserva e retirada (junto do item 1) e o custo do fabricado (BL-067) | Robert | E5, Q8 | ✅ lote; 🔴 retirada e custo |
- | 3 | `GET /itens/custo`: feito na `develop` (27/10). Falta testar junto com o job do hub ([[Contratos-da-v2\|LOG-47]]) e o merge do MES para a `main` (BL-035) | Robert, Gustavo | E3 | ✅ rota; 🔴 teste conjunto |
- | 4 | `lote_custo` com `origem = OC` no recebimento e rota `MANUAL`: feitos na `develop`. Falta o custo obrigatório em todo lote (BL-066, N16-09) | Robert | R4 | ✅ gravação; 🔴 obrigatório |
- | 5 | Baixa de matéria-prima **na retirada** (N16-140), com genealogia (J2, J3, J4). Hoje baixa na hora do "Atender pelo estoque" (`develop`) | Robert | E4, F1 | 🟡 baixa imediata ✅; 🔴 retirada e genealogia |
- | 6 | Contagem cíclica e ponto de pedido preventivo (EB2 a EB5): só há os alertas | Robert | — | 🔴 |
- | 7 | Transferência entre filiais (etapas 2 a 4): só o saldo por filial (`outrasFiliais`) existe; ver [[Transferencia-entre-Filiais]] | Robert | E1 | 🔴 |
- | 8 | Separação física (`ordem_separacao`): sem código | Robert | E3 | 🔴 |
- | 9 | Trocar os mocks do `painel-estoque` e `mapa-deposito` por dados reais | Robert | — | 🟡 |
- | 10 | Importação de carga inicial em lote (hoje um lote por vez) | Robert | — | 🔴 |
- | 11 | **Saldo futuro** no Atendimento e no Saldo (saldo atual + OCs em andamento de estoque), a partir da referência da OC (BL-050; depende de BL-001) | Robert (MES), Gustavo (BL-028) | E1 | 🔴 |
- Nathan: o documento de retirada nasce de quem? Expedição pede ao Estoque, ou o Estoque gera quando a parcial chega à Expedição? O que o documento imprime e quem confirma? **Decidido em 29/10/2026 (N16-120): a Expedição ou a Produção pede ao Estoque, e só o Estoque confirma. O que o documento imprime segue aberto.**
- Nathan: a Reserva continua existindo depois da retirada (para rastrear custo) ou é consumida junto? **Decidido em 29/10/2026 (N16-121): consumida junto com a baixa.**
- Nathan e Robert: como o item **fabricado** entra no Estoque: um lote por ordem de produção, ou por parcial aprovada? Quem informa localização? **Respondido e feito na `develop` (27/10): [[Contratos-da-v2|LOG-53]] define e o código cria um lote por ordem de produção e produto; quem informa a localização é o almoxarife, em `receber-fabricado`.**
- Nathan: custo do item fabricado (rateio por peso ou área) continua fora do ciclo 1 (decisão de 09/10)?
- Robert: o setor Estoque aparece uma vez no roteiro (etapa 0). O v1 falava em duas vezes (início e fim); o código resolveu com a parcial voltando ao mesmo setor. Confirmar que o histórico mostra isso com clareza.

## subfluxo mermaid

```text
flowchart TD
    P2["P2 · Destinação do Pedido<br/>Estoque como etapa 1"] --> E1["E1 · Saldo disponível<br/>lotes LIBERADO menos reservas ATIVA, na filial do pedido<br/>saldo futuro das OCs em andamento, a construir"]
    C0["C0 · OC do hub<br/>referência da OC, destino estoque ou pedido"] -.->|"saldo futuro"| E1
    E1 --> E2{"E2 · Saldo cobre o item?<br/>almoxarife informa quanto atende"}
    E2 -->|"sim, tudo ou parte"| E3["E3 · Atende pelo saldo<br/>split e reserva ATIVA<br/>custo do item = média dos lotes, GET itens custo"]
    E2 -->|"não, ou o restante"| E4{"E4 · O que fazer com o restante?"}
    E4 -->|"solicitar compra"| P3["P3 · Requisição de compra<br/>setor Requisições"]
    E4 -->|"enviar à produção"| E6
    P3 -.->|"circuito de compra"| R4["R4 · Lote em quarentena"]
    R4 --> Q1["Q1 · Inspeção de entrada"]
    Q1 -->|"aprova"| E5["E5 · Entrada no Estoque<br/>comprado vira lote e saldo<br/>fabricado vira lote PRODUCAO na develop"]
    Q8{"Q8 · Qualidade de saída aprova?"} -->|"sim, decisão: volta ao Estoque"| E5
    E5 --> E3
    E3 --> E6["E6 · Despacho<br/>documento de retirada e baixa na retirada<br/>hoje a baixa ocorre na Embalagem"]
    E6 -->|"produto pronto"| X1["X1 · Embalagem e paletização"]
    E6 -->|"matéria-prima ou beneficiamento"| F1["F1 · Setores produtivos do roteiro"]
```
