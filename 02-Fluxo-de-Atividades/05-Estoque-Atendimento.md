---
tags: [fluxo, raia, estoque, atendimento, reserva, lote, custo, mes, e1, e2, e3, e4]
criado: 2026-10-14
estado-em: 2026-11-13
status: vigente
ordem: 5
nos: [E1, E2, E3, E4]
anterior: "[[04-PCP-Triagem-e-Destinacao]]"
proxima: "[[06-Circuito-de-Compra]]"
develop-conferida: [api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, app-pcp 4c11886, omie-elt-pipeline master 0593c9f, em 2026-11-10; api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13 (BL-050)]
dono: Robert (MES) · Nathan (decisões)
fontes: [00-Fluxo-Mestre-0b, dividida de 03-Estoque-Atendimento-e-Despacho da v2 (tag v2-antes-da-v3) em 05/11/2026 (E5 foi para 09-Estoque-Entrada-do-Lote e E6 para 12-Estoque-Despacho), v1 02-PRD-Estoque/Fluxo-Estoque-Completo, v1 Estoque-Custo-do-Lote, v1 Rota-Estoque, v1 Modelo-Destinacao-Item, v1 Encaixe-Estoque-Revenda-no-PCP, decisões do Nathan de 14/10, API-008, api-pcp 579a625 (itens-parciais.service.ts, estoque-operacao.*, estoque.prisma, circuito-compra.ts), app-pcp 1fca8d3 (AtenderEstoqueModal), api-pcp develop befd973 de 27/10/2026 (aprovar-saida, receber-fabricado, itens-custo.ts, ConsumoMateriaPrima), LOG-53, N16-09, N16-140, OQ-49, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Raia Estoque: atendimento (E1 a E4)

**Em uma frase:** toda parcial de item passa primeiro pelo Estoque. O almoxarife atende o que o saldo cobre e decide o que fazer com o resto: comprar ou mandar para a produção.

**Quando consultar:** dúvidas sobre o que o almoxarife faz com a parcial: saldo, reserva, atender pelo estoque, comprar ou produzir.

**Onde estamos no fluxo:** ← [[04-PCP-Triagem-e-Destinacao]] | [[06-Circuito-de-Compra]] → · nós desta nota: `E1`, `E2`, `E3`, `E4`

## Como funciona, passo a passo

1. A parcial chega ao Estoque, vinda do PCP (planejamento e controle da produção), com a quantidade toda.
2. O almoxarife vê o saldo livre na filial do pedido: lotes liberados menos reservas. `E1`
3. Ele informa quanto atende, de zero até a quantidade da parcial, e de quais lotes. Atender zero é um clique. `E2`
4. O sistema reserva o lote e separa a parte atendida, que segue para a Expedição. `E3`
5. Para o restante, o almoxarife escolhe: solicitar compra ou enviar à produção (🔴 na `develop`, sem matéria-prima no estoque só a compra; veja a regra 7). `E4`

Depois:

- A entrada do lote comprado ou fabricado (passo 6, `E5`) está em [[09-Estoque-Entrada-do-Lote]]. A entrada do fabricado segue a [[Contratos-da-v2|LOG-53]].
- O despacho pela retirada (passo 7, `E6`) está em [[12-Estoque-Despacho]]. Ele usa o documento de retirada (N16-120 a N16-122 e N16-140).

## Exemplo

O pedido tem 100 flanges. O almoxarife encontra 40 em lotes liberados e informa 40. Elas viram uma parcial própria, com reserva, a caminho da Expedição. As 60 restantes seguem na parcial original. Se o destino for a Revenda, as 60 vão para a compra. Se for fabricação, ele informa a matéria-prima do estoque que vai consumir, e só as flanges cobertas por ela seguem para a produção; o que sobrar vai para compra. Quando a Expedição pede a retirada, o almoxarife confirma e o saldo baixa com o custo daquele lote. É o desenho decidido (N16-120 a N16-122); hoje a baixa é na Embalagem.

## Quem atua

| Quem | O que faz |
|---|---|
| Almoxarife | Atende pelo saldo, solicita compra, dá entrada, ajusta e transfere saldo |
| Gestor de Estoque | Supervisiona o painel e o saldo |
| Compras e CCP (acompanhamento de compras) | Recebem o "Solicitar compra" pelo setor Requisições |
| Robert | Dono do código do MES (sistema de chão de fábrica) |

## Regras que valem

As decisões de 29/10/2026 sobre esta etapa estão no lote N16-120 a N16-143 do [[Registro-de-Decisoes]].

- O saldo livre é por filial: lotes liberados menos reservas ativas, na filial do pedido.
- Saldo zero exige clique. A parcial nunca passa sozinha.
- O saldo é lido e a reserva criada no mesmo passo, para evitar corrida entre pedidos.
- A reserva não expira. Termina por liberação explícita ou quando a ordem é excluída.
- Na Revenda, o restante sempre vai para compra.
- Na fabricação, o restante pode comprar matéria-prima ou seguir o roteiro (regra 7). 🔴 A `develop` só manda o restante para compra e recusa o roteiro sem matéria-prima (`api-pcp` `src/itens-parciais/itens-parciais.service.ts:932`, `destinoRestante === 'ROTEIRO'`); a #100 aceitou isso só até o levantamento físico de 26 a 30/10. ❓ Manter a regra e ajustar o código, ou mudar a regra (OQ-49). Visto na validação local em Docker de 10/11/2026.
- Ajuste de saldo não usa o que está reservado e exige motivo.
- O custo do lote é opcional e nunca bloqueia nada.
- A matéria-prima baixa do saldo na retirada, não no atendimento (N16-140).

## O que já existe e o que falta

Tudo o que é MES nesta nota está na `develop` do `api-pcp` e do `app-pcp`. A `main` parou em 08/10 e só recebe com o merge BL-035.

- ✅ (`app-pcp`) Telas Atendimento, Saldo, Reservas, Movimentação e Lote com etiqueta.
- ✅ (`api-pcp`) Reserva, divisão da parcial, solicitar compra, entrada do item comprado e baixa na Embalagem.
- 🟡 Painel do Estoque e Mapa do Depósito ainda são protótipos.
- ✅ (`api-pcp`) Na `develop` do MES: fabricado aprovado vira lote `PRODUCAO` e saldo (27/10); rota `GET /itens/custo` com o custo do item (27/10, `6c11147`); custo da OC no lote do Recebimento (19/10); baixa de matéria-prima no "Atender pelo estoque" (19/10).
- 🔴 Baixa da matéria-prima na retirada (N16-140). Hoje a `develop` baixa no "Atender pelo estoque" de item de fabricação (`ConsumoMateriaPrima`, 19/10, `8d07917`).
- ✅ (`api-pcp`, `app-pcp`) Saldo futuro (BL-050, 13/11):
  - o que ainda vai chegar por OC de estoque aprovada aparece no modal "Atender pelo estoque" e num card da tela Saldo;
  - backend: `api-pcp` `src/estoque/operacao/saldo-futuro.ts:68` (`export async function saldoFuturoPorProduto`);
  - front: `app-pcp` `app/(protected)/estoque-operacao/saldo/SaldoFuturoCard.tsx:50` (`A chegar por OC de estoque`);
  - 🟡 a view do SQL-022 está no tst desde 13/11 (Gustavo); falta o teste no tst confirmar que a reprovada que já tem recompra conta uma vez só. Na produção, até a view chegar (depois da log58), ela conta duas vezes.
- 🔴 Custo obrigatório em todo lote (BL-066) e custo do fabricado (BL-067).
- 🔴 Contagem cíclica, transferência entre filiais e separação física.

Entrada: [[04-PCP-Triagem-e-Destinacao]]. Próxima raia: [[06-Circuito-de-Compra]].

## Detalhe técnico

Nós do [[00-Fluxo-Mestre-0b]]: `E1` saldo disponível, `E2` saldo cobre?, `E3` atende pelo saldo (split e reserva, custo do item), `E4` o que fazer com o restante. `E5` entrada no Estoque: [[09-Estoque-Entrada-do-Lote]]. `E6` despacho: [[12-Estoque-Despacho]]. Entrada: [[04-PCP-Triagem-e-Destinacao]]. Vizinhos: [[06-Circuito-de-Compra]], [[07-Recebimento]], [[08-Qualidade-Entrada]], [[11-Qualidade-Saida]], [[13-Expedicao]]. Selos em [[Regras-do-Vault]].

### Quem atua (onde)

| Quem | Papel | Onde |
|---|---|---|
| Almoxarife | Atende pelo saldo, solicita compra, dá entrada, ajusta e transfere saldo | MES, `/estoque-operacao/atendimento` e demais telas de Estoque |
| Gestor de Estoque | Supervisiona; não aparece nas conversas operacionais | MES, painel e saldo |
| Compras · CCP | Recebe o "Solicitar compra" via setor Requisições | [[06-Circuito-de-Compra]] |
| Robert | Dono do código | `api-pcp`, `app-pcp` |

Permissão: agir no setor exige `PerfilSetor.podeAtuar` (`ensurePodeAtuar`, `itens-parciais.service.ts:617`); movimentação e carga inicial exigem `PerfilDeposito.podeAtuar` no depósito (`estoque.prisma:86-106`, `estoque-operacao.service.ts:614-616`).

### Regras decididas

As regras 9 e 11 (entrada do lote) estão em [[09-Estoque-Entrada-do-Lote]]; a regra 10 (despacho) em [[12-Estoque-Despacho]].

| # | Regra | Selo |
|---|---|---|
| 1 | O Estoque (setor `estoque`) é a **etapa 1** de todo roteiro e o **único** Estoque do circuito (a compra volta a ele) | 📝 ✅ `pedidos.service.ts:226-232`, `circuito-compra.ts:19-25` |
| 2 | Saldo disponível = soma dos lotes `LIBERADO` − reservas `ATIVA`, na **filial do pedido** (DEC-1) | 📝 ✅ `estoque-operacao.helpers.ts:150-170` (valida `LIBERADO`, mesmo produto e filial, disponível) |
| 3 | A leitura do saldo e a criação da reserva acontecem **no mesmo passo** (evita corrida entre pedidos) | 📝 ✅ `itens-parciais.service.ts:595-600`, `:744-852` |
| 4 | **Saldo zero exige clique**: a parcial nunca passa sozinha; atender 0 é uma ação explícita | 📝 ✅ `itens-parciais.service.ts:588-590`, `:657-659` (#31b) |
| 5 | Reserva nasce `ATIVA`, **sem expiração**; libera por ação explícita (`LIBERADA`) ou quando a ordem é excluída | 📝 ✅ `estoque.prisma:45-52`, `pedidos.service.ts:695-699` |
| 6 | Na **Revenda** o restante **sempre** vai para compra (não há o que produzir) | 📝 ✅ `itens-parciais.service.ts:721-727` |
| 7 | Na **Fabricação** o restante pode seguir o roteiro (`ROTEIRO`) ou ir à compra (`COMPRA`, matéria-prima) | 📝 🔴 a `develop` recusa `ROTEIRO` sem matéria-prima com 400 (`api-pcp` `src/itens-parciais/itens-parciais.service.ts:932`, `destinoRestante === 'ROTEIRO'`); a #100 aceitou isso só até o levantamento físico; ❓ OQ-49 |
| 8 | A parte atendida vai para a **primeira etapa `EXPEDICAO`** depois do Estoque; sem ela no roteiro, 409 | ✅ `itens-parciais.service.ts:701-714` |
| 12 | **Custo do item = média ponderada dos lotes** das reservas (Regra A: faturamento parcial usa o custo médio do item no pedido) | 📝 ✅ `GET /itens/custo` na `develop` (27/10, `6c11147`, `integracao-avhub.controller.ts`, regra em `itens-custo.ts`); fabricado fora até o custo da matéria-prima ([[Contratos-da-v2\|API-008]]) |
| 13 | O custo do lote é **opcional hoje** e não bloqueia carga inicial, recebimento, reserva nem despacho. A N16-09 decide que **todo lote tem custo** (obrigatório, inclusive na carga inicial) | ✅ opcional no código (`estoque-operacao.service.ts:404-409`, `estoque.prisma:385-393`); 📝 N16-09, 🔴 obrigatório (BL-066) |
| 14 | Lote filho de cisão herda o custo do pai; transferência entre depósitos não muda o custo | 📝 ✅ `estoque-operacao.helpers.ts:431-452` |
| 15 | Ajuste de saldo não pode comer o que já está reservado; motivo obrigatório | ✅ `estoque-operacao.service.ts:657-673` |
| 16 | Carga inicial (marco zero) nasce `LIBERADO` sem inspeção; é o primeiro estoque | 📝 ✅ `estoque-operacao.service.ts:429-437` |
| 17 | **Saldo futuro:** para OC de itens de **estoque** (sem pedido de venda), o Estoque do MES mostra as **OCs em andamento** e a parte delas que preenche o estoque: **saldo atual + saldo futuro** ([[Glossario]]). A fonte é a referência da OC do hub (`GET /ordens-compra/referencia`, item com `destino` do tipo `estoque`) | 📝 N14-20; ✅ (`api-pcp`) o MES já lê a referência da OC (K4, `develop`, 15/10); 🔴 o cálculo e a coluna (BL-050) |
| 18 | Se a OC está **vinculada a um pedido de venda** (`destino` do tipo `pedido_venda`), o Estoque e o PCP veem que já existe OC para aquele pedido; essa quantidade **não** entra no saldo futuro livre | 📝 N14-20 🔴 (BL-049: o PCP ainda não vê a OC do pedido na Triagem e na Destinação) |

### Estados

#### Lote (`StatusQualidadeLote`, `OrigemLote`)

| `StatusQualidadeLote` | Conta no disponível? | Quem muda |
|---|---|---|
| `PENDENTE` | Não | Recebimento cria ([[07-Recebimento]]) |
| `LIBERADO` | **Sim** | Qualidade aprova ou carga inicial |
| `REPROVADO` | Não | Qualidade ([[08-Qualidade-Entrada]]) |
| `QUARENTENA` | Não | Reprovação parcial |

`OrigemLote` = `RECEBIMENTO`, `CARGA_INICIAL` e, na `develop`, `PRODUCAO` (fabricado aprovado, um lote por OP e produto, `estoque.prisma`) ✅. `TipoMovimentoEstoque` = `ENTRADA`, `SAIDA`, `TRANSFERENCIA`, `AJUSTE` (`estoque.prisma:38-43`). `OrigemCusto` = `CARGA_INICIAL`, `OC`, `MANUAL` (`estoque.prisma:378-382`).

#### Reserva (`StatusReserva`)

| Valor | Quando |
|---|---|
| `ATIVA` | Nasce em "Atender pelo estoque" (`reservarParaParcial`) |
| `CONSUMIDA` | A parcial é recebida na Embalagem (`consumirReservasDaParcial`, saída do lote) |
| `LIBERADA` | Ordem excluída, parcial cancelada ou liberação manual com motivo |

`quantidadeConsumida` acompanha parcial; estorno (`estornarConsumosDaParcial`) devolve o saldo à mesma localização quando a Embalagem desfaz o recebimento ou devolve ao Estoque (`itens-parciais.service.ts:2100`, `:1587`; `estoque-operacao.helpers.ts:287`).

#### Parcial no Estoque

Aceita agir em `CRIADO`, `EM_TRANSITO`, `RECEBIDO`, `EM_ANDAMENTO` (`itens-parciais.service.ts:629-639`). A parte atendida segue `EM_TRANSITO` com `atendidoPeloEstoque = true`; o restante segue `EM_TRANSITO` ao setor `REQUISICAO` (compra) ou à próxima etapa do roteiro.

### Telas

| Nome atual | Nome antigo | Rota | Slug | Estado |
|---|---|---|---|---|
| Atendimento | Atendimento / Baixa | `/estoque-operacao/atendimento` | `atendimento` | ✅ fila do setor `ESTOQUE` com modal "Atender pelo estoque" (`atendimento/page.tsx:1-16`, `AtenderEstoqueModal.tsx:232`) |
| Saldo | Consulta de Saldo | `/estoque-operacao/saldo` | `saldo` | ✅ (`app-pcp`) |
| Reservas | — | `/estoque-operacao/reservas` | `reservas` | ✅ (`app-pcp`) consulta e liberação |
| Movimentação | — | `/estoque-operacao/movimentacao` | `movimentacao` | ✅ (`app-pcp`) entrada, ajuste, transferência |
| Lote (detalhe, etiqueta) | — | `/estoque-operacao/lotes/[id]` | `saldo` | ✅ (`app-pcp`, `api-pcp`) PDF Code128 `GET /estoque/lotes/:id/etiqueta` |
| Painel do Estoque | Dashboard do Estoque | `/estoque-operacao/painel-estoque` | `painel-estoque` | 🟡 protótipo com dados de exemplo; dois alertas reais |
| Mapa do Depósito | — | `/estoque-operacao/mapa-deposito` | — | 🟡 mock |
| Saldo futuro (coluna e detalhe das OCs em andamento no Atendimento e no Saldo) | — | `/estoque-operacao/atendimento`, `/estoque-operacao/saldo` | `atendimento`, `saldo` | 🔴 não existe (BL-050) |

### Endpoints e contratos

| Método e rota | Permissão | Efeito | Código |
|---|---|---|---|
| `GET /estoque/saldo/disponivel-parcial/:idItemParcial` | `movimentacoes:visualizar` | Lotes `LIBERADO` com disponível, mais `outrasFiliais` | `estoque-operacao.controller.ts:45-49`, `estoque-operacao.service.ts:112-147` ✅ |
| `PATCH /itens-parciais/:id/atender-estoque` | `movimentacoes:editar` | `quantidadeEstoque`, `alocacoes[]` (lote e quantidade), `materiaPrima` (consumos e unidades cobertas), `destinoRestante` `COMPRA` (`ROTEIRO` ainda está no tipo, mas é recusado), observação | `itens-parciais.controller.ts:163-180`, `itens-parciais.service.ts:796` ✅ |
| `GET /estoque/saldo` | `saldo:visualizar` | Saldo por lote e localização; custo só para quem tem `estoque-custo` | `estoque-operacao.controller.ts:39-43` ✅ |
| `POST /estoque/lotes/carga-inicial` | `movimentacao:criar` | Lote `LIBERADO`, custo opcional (`estoque-custo:editar`) | `estoque-operacao.controller.ts:66-70`, `estoque-operacao.service.ts:398-445` ✅ |
| `GET /estoque/movimentos`, `POST /estoque/movimentos` | `movimentacao` | Transferência e ajuste | `estoque-operacao.controller.ts:78-88` ✅ |
| `GET /estoque/reservas`, `PATCH /estoque/reservas/:id/liberar` | `reservas` | Consulta e liberação com motivo | `estoque-operacao.controller.ts:90-98` ✅ |
| `GET /estoque/alertas/estoque-minimo`, `/rnc-pendentes` | Estoque | Dois alertas do painel | `alertas.controller.ts:19-25` ✅ |
| `GET /itens/custo` (MES → av-hub) | chave do av-hub | Custo do item (uma linha por filial, pedido e produto; cursor `alterado_em`) | [[Contratos-da-v2\|API-008]], [[Contratos-da-v2\|LOG-47]] ✅ na `develop` do MES (27/10, `6c11147`); o job do hub ainda não foi testado junto |
| `PUT /estoque/lotes/:id/custo` | `estoque-custo:editar` | Informa ou corrige o custo do lote à mão, com motivo e histórico | [[Contratos-da-v2\|API-008]] ✅ (`api-pcp`) `develop` (27/10) |

### Como está no código

#### E1 e E2: saldo disponível e decisão

✅ O modal busca `GET /estoque/saldo/disponivel-parcial/:id` e sugere lotes (inclusive os da compra daquele item). `E2` não é um nó automático: o almoxarife informa quanto atende (0 a quantidade da parcial) e de quais lotes (`alocacoes` somando exatamente a quantidade atendida, `itens-parciais.service.ts:650-659`). Só é possível agir em setor tipo `ESTOQUE` (`:623-627`).

🔴 **Saldo futuro (N14-20).** O modal e a tela Saldo só mostram o saldo atual (lotes `LIBERADO` menos reservas). Falta mostrar as OCs em andamento. Do lado do hub já há: `ordens_compra.finalidade` (`estoque` é o padrão, `ordens_compra.route.js:982`), `ordens_compra_itens_vinculos` (item da OC para pedido de venda), a view `vw_pedido_venda_itens_compra` e a referência `GET /ordens-compra/referencia`, cujo item traz `destino[]` (`pedido_venda` ou `estoque`, somando a quantidade) ✅ (`vw_ordens_compra_referencia_mes.swagger.json:61-88`). No MES, o job que lê a referência já existe na `develop` (K4, `6914fe9`, 15/10, `oc-referencia-avhub.service.ts`) ✅ e o aviso de compra em andamento aparece ao requisitar (API-011, 20/10). Falta o cálculo do saldo futuro (OC aprovada, parte `estoque` do `destino`, menos o que já foi recebido) e a coluna no Atendimento e no Saldo (BL-050). A referência só traz OC `aprovado` e as canceladas que já foram aprovadas (`vw_ordens_compra_referencia_mes`, [[Banco-AvHub]]): OC em aprovação não entra, e o Gustavo confere se isso basta (BL-028). Como a mercadoria entra no Estoque: [[07-Recebimento]].

#### E3: atender pelo saldo (split e reserva)

✅ Duas formas, numa transação (`itens-parciais.service.ts:744-856`):
- **Tudo atendido** (`restante = 0`): a própria parcial vai `EM_TRANSITO` para a Expedição com `atendidoPeloEstoque = true` e a reserva nasce sobre ela (`:746-779`).
- **Parte atendida**: a parcial original segue com o restante; nasce uma parcial nova, `atendidoPeloEstoque`, com `idParcialOrigem`, indo à Expedição, e a reserva aponta para ela (`:784-852`). A soma das parciais continua igual ao total do item.

A reserva valida lote `LIBERADO`, mesmo produto (`codigoProdutoOmie`) e mesma filial (`codigoEmpresa`), e disponível suficiente (`estoque-operacao.helpers.ts:150-170`). O snapshot (pedido, ordem, item) sobrevive à exclusão da ordem.

✅ (`api-pcp`) **Custo do item (na `develop`, 27/10).** Cada `Reserva` liga lote e parcial, e `lote_custo.custo_liquido_unitario` guarda o custo. A saída grava o custo do lote no movimento, e `GET /itens/custo` devolve o custo por filial, pedido e produto (`6c11147`, [[Contratos-da-v2|API-008]]). O fabricado fica de fora até existir o custo da matéria-prima (BL-067).

#### E4: o restante

✅ `destinoRestante = COMPRA` (ou Revenda, sempre) move a parcial para o setor `REQUISICAO` (`setorDoCircuito`, `itens-parciais.service.ts:1056-1059`); o PCP abre a requisição lá ([[06-Circuito-de-Compra]], nó `P3`). A observação de histórico diz "Sem saldo no estoque: N vão para compra (Requisições)" (`:808-811`).

✅ (`api-pcp`) **Enviar à produção** só existe com matéria-prima do estoque: as unidades cobertas seguem para a próxima etapa do roteiro e o restante vai para compra. Não há mais "segue o roteiro" sem matéria-prima (`itens-parciais.service.ts:932`, `destinoRestante === 'ROTEIRO'`; ❓ regra a confirmar com o Nathan, OQ-49). O item de fabricação é atendido com matéria-prima do estoque: lote(s) de qualquer produto, com a quantidade baixada e as unidades do item cobertas (`ConsumoMateriaPrima`, 19/10, `8d07917`; a baixa é imediata e devolver a parcial ao Estoque estorna). 🔴 Diverge da N16-140: a decisão é baixar na retirada, pelo documento, e não na hora do atendimento. A genealogia (J4) segue sem código.

A entrada no Estoque (`E5`) está em [[09-Estoque-Entrada-do-Lote]]; o despacho (`E6`) em [[12-Estoque-Despacho]].

### Dados

| Tabela (todas em `public`, MES) | Papel |
|---|---|
| `depositos`, `localizacoes_estoque`, `perfil_depositos` | Depósito (pertence a uma filial), localização, permissão por perfil |
| `materiais` | Produto do av-hub espelhado; chave `(codigo_empresa, codigo_produto_omie)`; peso teórico e tolerância |
| `lotes` | `status_qualidade`, `origem`, `id_lote_pai`, `id_requisicao_item`, NF, fornecedor |
| `saldos_estoque`, `movimentos_estoque` | Saldo por lote, localização e depósito; movimentos `ENTRADA`, `SAIDA`, `TRANSFERENCIA`, `AJUSTE` |
| `reservas` | Lote, parcial, `quantidade`, `quantidade_consumida`, status, snapshot do pedido |
| `lote_custo` | 1:1 com `lotes`: custo líquido unitário, componentes, `id_item_oc`, `cotacao_a_conferir` (migration `20261009140000_lote_custo`) |

Modelo completo e custo em [[Modelo-Estoque-e-Custo-do-Lote]] e [[Banco-MES]].

#### Custo do lote (resumo)

`custo_liquido_unitario = valor_unitario × (1 − desconto) × cotação − ICMS a recuperar + IPI + ST`; frete fica gravado e fora do líquido; moeda estrangeira usa a PTAX da OC; só revenda no ciclo 1. **O que está gravado na `develop`:** carga inicial (`origem CARGA_INICIAL`), cisão, custo da OC no recebimento (`origem OC`, 19/10, `97b9adc`; unidade diferente da OC ou OC fora da projeção gera lote sem custo e sinalizado) e custo à mão (`MANUAL`, `PUT /estoque/lotes/:id/custo`, com motivo e histórico, 27/10). Falta o custo obrigatório em todo lote (BL-066) e o custo do fabricado (BL-067). Ver [[07-Recebimento]], nó `R4`.

### O que falta desenvolver

O item 1 (documento de retirada) está em [[12-Estoque-Despacho]] e o item 2 (fabricado vira lote) em [[09-Estoque-Entrada-do-Lote]].

| # | O quê | Dono | Nó | Selo |
|---|---|---|---|---|
| 3 | `GET /itens/custo`: feito na `develop` (27/10). Falta testar junto com o job do hub ([[Contratos-da-v2\|LOG-47]]) e o merge do MES para a `main` (BL-035) | Robert, Gustavo | E3 | ✅ (`api-pcp`) rota; 🔴 teste conjunto |
| 4 | `lote_custo` com `origem = OC` no recebimento e rota `MANUAL`: feitos na `develop`. Falta o custo obrigatório em todo lote (BL-066, N16-09) | Robert | R4 | ✅ (`api-pcp`) gravação; 🔴 obrigatório |
| 5 | Baixa de matéria-prima **na retirada** (N16-140), com genealogia (J2, J3, J4). Hoje baixa na hora do "Atender pelo estoque" (`develop`) | Robert | E4, F1 | 🟡 baixa imediata ✅ (`api-pcp`); 🔴 retirada e genealogia |
| 6 | Contagem cíclica e ponto de pedido preventivo (EB2 a EB5): só há os alertas | Robert | — | 🔴 |
| 7 | Transferência entre filiais (etapas 2 a 4): só o saldo por filial (`outrasFiliais`) existe; ver [[Transferencia-entre-Filiais]] | Robert | E1 | 🔴 |
| 8 | Separação física (`ordem_separacao`): sem código | Robert | E3 | 🔴 |
| 9 | Trocar os mocks do `painel-estoque` e `mapa-deposito` por dados reais | Robert | — | 🟡 |
| 10 | Importação de carga inicial em lote (hoje um lote por vez) | Robert | — | 🔴 |
| 11 | **Saldo futuro** no Atendimento e no Saldo (saldo atual + OCs em andamento de estoque), a partir da referência da OC (BL-050; depende de BL-001) | Robert (MES), Gustavo (BL-028) | E1 | 🔴 |

### Pendências

As pendências do despacho estão em [[12-Estoque-Despacho]] e as do fabricado em [[09-Estoque-Entrada-do-Lote]].

- Robert: o setor Estoque aparece uma vez no roteiro (etapa 0). O v1 falava em duas vezes (início e fim); o código resolveu com a parcial voltando ao mesmo setor. Confirmar que o histórico mostra isso com clareza.

### Subfluxo

```mermaid
flowchart TD
    P2["P2 · Destinação do Pedido<br/>Estoque como etapa 1"] --> E1["E1 · Saldo disponível<br/>lotes LIBERADO menos reservas ATIVA, na filial do pedido<br/>saldo futuro das OCs em andamento, a construir"]
    C0["C0 · Requisição de compra<br/>origem Compras, no av-hub<br/>a OC chega ao MES pela referência, destino estoque ou pedido"] -.->|"saldo futuro"| E1
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
