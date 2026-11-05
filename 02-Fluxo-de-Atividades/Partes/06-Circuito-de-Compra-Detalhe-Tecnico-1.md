---
tags: [fluxo, raia, compras, ccp, requisicao, oc, aprovacao, omie, fornecedor, p3, c0, c1, c2, c3, c4, c5, fn1, parte]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Compras (regra) · Gustavo (API) · Nathan (front av-hub) · Robert (MES)
parte-de: "[[06-Circuito-de-Compra]]"
develop-conferida: [api-acos-vital 1654f65, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
fontes: [00-Fluxo-Mestre-0b, Integracao-AvHub-MES (INT-02, INT-03, INT-04), LOG-34, LOG-35, LOG-32, LOG-23, LOG-36, SQL-008, API-004, v1 02-PRD-Estoque/Fluxo-Compras-Completo, decisões do Nathan de 14/10 (duas origens, aprovação, Compras·CCP só leitura), api-pcp 579a625, api-acos-vital f322dcd, omie-elt-pipeline 0f739f0, HUB b55ac55 (lido em disco), Dump Avhub 14/10, api-pcp develop de 27/10/2026 (K4, API-009, API-011), N16-144]
---

# Circuito de compra (P3, C0 a C5, FN1): detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[06-Circuito-de-Compra]] (parte 1 de 2): Nós e entradas; Quem atua (onde); Regras decididas; Estados; Telas; Endpoints e contratos.

**Onde estamos:** ← [[06-Circuito-de-Compra]] (resumo e índice) · partes: **06-Circuito-de-Compra-Detalhe-Tecnico-1** · [[06-Circuito-de-Compra-Detalhe-Tecnico-2]]

## Nós e entradas

Nós do [[00-Fluxo-Mestre-0b]]: `P3` requisição de compra (origem PCP, MES), `C0` requisição de compra (origem Compras, av-hub), `C1` cotação, `C2` acima de R$ 30 mil?, `C3` aprovação, `C4` emissão da OC, `C5` follow-up do CCP, `FN1` fornecedor. Fecha em `FN1 → R0` ([[07-Recebimento]]). Entrada: `E4` "solicitar compra" ([[05-Estoque-Atendimento]]) e `Q3` recompra ([[08-Qualidade-Entrada]]). Sequências técnicas completas em [[Integracao-AvHub-MES]]. Selos em [[Regras-do-Vault]].

## Quem atua (onde)

| Quem | Papel | Onde |
|---|---|---|
| PCP | Abre a requisição do material do pedido (origem PCP) | MES, setor Requisições (`/compras/requisicoes`) |
| Comprador | Cota, negocia, emite a OC; OC **até R$ 30 mil sai livre**, sem aprovação | HUB, `/compras/requisicoes`, `/compras/nova` |
| Compras (necessidade própria) | Cria requisição sem pedido de venda ("Nova requisição"); a OC dela chega ao MES pela referência | HUB, `compras.pode_criar` |
| Gerente de Compras | Aprova a OC **acima de R$ 30 mil** (perfil com `pode_aprovar` na tela `compras`) | HUB, `/compras/aprovacoes` |
| CCP | Follow-up com o fornecedor: confirmação, previsão, despacho, ocorrência | HUB, `/compras/followup` |
| Pipeline | Envia a OC aprovada ao Omie (fila) | `omie-elt-pipeline`, `envioOrdensCompra.ts` |
| Fornecedor | Recebe a OC e entrega (CIF) ou libera para coleta (FOB); sem acesso ao sistema | externo |
| Compras · CCP no MES | Só leitura: espelha os marcos | MES, `/compras/pedidos-compra` |
| Doca | Registra a chegada com NF e tira a parcial de Compras · CCP | MES ([[07-Recebimento]]) |
| Gustavo, Nathan, Robert | API do av-hub, front do av-hub, MES | ver [[Equipe-e-Divisao]] |

## Regras decididas

| # | Regra | Selo |
|---|---|---|
| 1 | **A requisição tem duas origens.** (1) Compras cria no av-hub ("Nova requisição", `POST /compras/requisicoes`, permissão `compras.pode_criar`); (2) o PCP cria no MES a requisição do material do pedido (Estoque → "Solicitar compra" → setor `REQUISICAO`) | 📝 ✅ HUB `components/Compras/ComprasRequisicoes.tsx:186`, `app/api/compras/requisicoes/route.ts:79-80`; MES `compras.service.ts:135-218` |
| 2 | O circuito do MES é **fixo do sistema, fora do roteiro**: `Estoque → Requisições → Compras · CCP → Recebimento → Qualidade · Entrada → Estoque` | 📝 ✅ `circuito-compra.ts:9-25` |
| 3 | **Ida (LOG-34):** o MES **empurra** cada item da requisição por `PUT /compras/requisicoes/origem/{id_origem}`; fila própria, sem perder se o av-hub cair | 📝 ✅ `envio-avhub.service.ts:21`, `:130` |
| 4 | **Volta (LOG-35):** o MES **lê** os marcos por `GET /compras/requisicoes/eventos` com cursor; polling de 5 min mais leitura sob demanda | 📝 ✅ `eventos-avhub.service.ts:25-31` |
| 5 | **Aprovação:** a OC que **excede R$ 30 mil** é aprovada pelo **Gerente de Compras**; a OC **até R$ 30 mil** é liberada sem aprovação (**compradores livres**). **A Diretoria não aprova.** Regra provisória: fica mais rígida depois da conversa com Compras (🟡, ver Pendências) | 📝 N14-21 ✅ `ordens_compra.route.js:1227-1237`, `FecharCompra.tsx:604-605`, trigger `fn_ordens_compra_recalcular` |
| 6 | Limite de aprovação é **por unidade**, configurável (`parametros_compras.limite_aprovacao`, padrão 30.000,00), em BRL (OC em moeda estrangeira converte pela cotação) | 📝 ✅ `parametros_compras.model.js:16`; Dump Avhub `fn_ordens_compra_recalcular` (linha 6779) |
| 7 | OC emitida marca a requisição `atendida` por trigger; **nunca** pelo PATCH; OC cancelada devolve **todas** as requisições dela a `aberta` ("nenhum estado é beco sem saída") | 📝 ✅ `requisicoes_compra.route.js:14-16`, `:423-429`; Dump `fn_ordens_compra_requisicao` |
| 8 | Cancelar requisição exige motivo (3 a 500 caracteres) | ✅ `requisicoes_compra.route.js:441-447` |
| 9 | Requisição com OC **não se cancela pelo MES**: 409 `REQUISICAO_COM_OC`; o envio fica `RECUSADO` e não repete | ✅ `requisicoes_compra.route.js:220-264`, `envio-avhub.service.ts:164-169` |
| 10 | **Compras · CCP no MES é só leitura.** A parcial só sai dele quando a doca registra a chegada **com NF** | 📝 ✅ `compras.service.ts:353-399` |
| 11 | OC aprovada entra na lista de **esperados** do Recebimento; OC cancelada tira de lá e devolve ao comprador | 📝 ✅ `compras.service.ts:305-351`, `requisicao-avhub.eventos.ts:275-280` |
| 12 | Rede de segurança: sem OC aprovada vinda do av-hub, quem tem `compras-liberar` libera com motivo | 📝 ✅ `compras.service.ts:404-446` |
| 13 | A OC vai ao **Omie pela pipeline**, por fila (decisão de 24/09): `enviar` = aprovada e pendente; `excluir` = cancelada que já estava no Omie | 📝 ✅ `ordens_compra.route.js:856-888`, `envioOrdensCompra.ts:18-40` |
| 14 | O sistema **não envia a OC ao fornecedor**: e-mail ou PDF fora do sistema; frete CIF (fornecedor entrega) ou FOB (coleta da empresa) | 📝 FN1 fora do sistema |
| 15 | Quem aprova ou cancela OC precisa de `pode_aprovar` na tela `compras`; a identidade vem da sessão do BFF | ✅ `ordens_compra.route.js:1227-1237`; HUB `app/api/compras/ordens/[id]/route.ts:35`, `:53` |
| 16 | Comprador só emite OC na unidade a que pertence; unidade que compra por outra unidade recusa (23514) | ✅ Dump `fn_ordens_compra_nascer`, `fn_ordens_compra_comprador` |

## Estados

### Requisição no av-hub (`requisicoes_compra.status`)

`aberta` → `em_cotacao` → `atendida` (só trigger) · `cancelada`. Transições do PATCH: `aberta→em_cotacao|cancelada`, `em_cotacao→aberta|cancelada`, `cancelada→aberta|em_cotacao`, `atendida→(nenhuma)` (`requisicoes_compra.route.js:12-22`).

### OC no av-hub (`ordens_compra.status`, `status_sincronizacao_omie`)

| Campo | Valores | Fonte |
|---|---|---|
| `status` | `rascunho`, `aguardando_aprovacao`, `aprovado`, `cancelado` | `ordens_compra.route.js:90` |
| `status_sincronizacao_omie` | `pendente`, `sincronizado`, `erro` | `ordens_compra.route.js:94` |
| `finalidade` | `pedidos_venda`, `recompra`, `estoque`, `uso_interno` (só as duas primeiras ligam a PV) | `ordens_compra.route.js:91-93` |

Trigger de recálculo: OC nasce `aguardando_aprovacao`; ao recalcular o total em BRL, **valor ≤ limite vira `aprovado` sozinho**, valor > limite fica `aguardando_aprovacao`; `rascunho` e `cancelado` não mudam; OC já aprovada que sobe acima do limite volta a `aguardando_aprovacao` (Dump `fn_ordens_compra_recalcular`, linhas 6750-6794).

### Marcos que o MES recebe (`requisicoes_compra_eventos.tipo`, 14 valores)

`requisicao_recebida`, `em_cotacao`, `oc_criada`, `oc_removida`, `oc_enviada_aprovacao`, `oc_aprovada`, `oc_no_omie`, `fornecedor_confirmou`, `previsao_alterada`, `despachada`, `ocorrencia`, `oc_cancelada`, `requisicao_cancelada`, `requisicao_reaberta` (Dump Avhub, `requisicoes_compra_eventos_tipo_check`, linha 18692). Só existem para requisição com `id_origem` (a do MES).

### No MES

| Entidade | Valores | Código |
|---|---|---|
| `StatusRequisicaoCompra` | `ABERTA`, `EM_COMPRA`, `RECEBIDA_PARCIAL`, `RECEBIDA`, `CANCELADA` | `compras.prisma:9-15` |
| `etapaCompra` (por material) | `AGUARDANDO_COMPRADOR`, `EM_COTACAO`, `EM_APROVACAO`, `COM_FORNECEDOR`, `EM_TRANSITO`, `CANCELADA` | `compras.prisma:145-149` |
| `TipoItemRequisicao` | `PRODUTO_FINAL` (revenda), `MATERIA_PRIMA` (fabricação) | `compras.prisma:19-22` |
| Envio ao av-hub | `PENDENTE`, `ENVIADO`, `RECUSADO`, `FALHOU` | `integracao.prisma:20-28` |

Efeito de cada marco no MES: tabela em [[Integracao-AvHub-MES]] (INT-03) e `requisicao-avhub.eventos.ts:234-318`.

## Telas

| Nome | Rota | App | Quem | Estado |
|---|---|---|---|---|
| Requisições de compras (fila do setor `REQUISICAO`, "Solicitar compra" e "Requisitar") | `/compras/requisicoes` | app-pcp | PCP | ✅ `compras/requisicoes/page.tsx` (`tipos=['REQUISICAO']`) |
| Compras · CCP (fila do setor `COMPRAS`, só leitura, linha do tempo, "Atualizar") | `/compras/pedidos-compra` | app-pcp | PCP, doca | ✅ `compras/pedidos-compra/page.tsx`, `CompraCcpCard.tsx`, `EventosRequisicaoModal.tsx` |
| Requisições (lista e kanban; botão **Nova requisição** com `pode_criar`) | `/compras/requisicoes`, `/compras/requisicoes/kanban` | HUB | Comprador | ✅ `components/Compras/ComprasRequisicoes.tsx:186-189`, `:426` |
| Emissão da OC | `/compras/nova`, `/compras/nova/[requisicaoId]` | HUB | Comprador | ✅ `components/Compras/FecharCompra.tsx` (limite em `:604-605`, aviso em `:1652`) |
| Ordens de Compra (lista, kanban, detalhe, Omie) | `/compras/ordens`, `/compras/ordem/[id]`, `/compras/pedido-omie/[id]` | HUB | Comprador | ✅ `components/Compras/ComprasOrdens.tsx`, `OrdemDetalhe.tsx`, `PedidoOmieDetalhe.tsx` |
| Aprovações ("acima do limite da unidade") | `/compras/aprovacoes` | HUB | Gerência de Compras | ✅ `components/Compras/ComprasAprovacoes.tsx:78` |
| Follow-up do CCP | `/compras/followup` | HUB | CCP | ✅ `components/Compras/Followup/FollowupLista.tsx`, `FollowupPainel.tsx` |
| Dashboard de Compras, Compradores | `/compras/dashboard-compras`, `/compras/compradores` | HUB | Compras | ✅ (`av-hub`) fora da espinha |

Nome histórico no MES: o setor `COMPRAS` aparece como "Pedidos de Compra" em rótulos de 09/10 e hoje como **Compras · CCP**; a rota continua `/compras/pedidos-compra`. HUB confirmado no clone local do `av-hub` em 14/10 (b55ac55).

## Endpoints e contratos

### MES (`api-pcp`, `compras/requisicoes`)

| Rota | Permissão | Efeito | Código |
|---|---|---|---|
| `GET /compras/requisicoes?idItemPedido&status` | `movimentacoes:visualizar` | Lista (até 200) com `marcos` | `compras.controller.ts:30-34` ✅ |
| `GET /compras/requisicoes/esperados` | idem | Parciais em Compras · CCP com OC aprovada ou liberação manual, ordenadas por previsão | `:45-51` ✅ |
| `POST /compras/requisicoes/sincronizar` | idem | Lê agora os marcos (pula se a última leitura boa < 30 s) | `:53-60` ✅ |
| `GET /compras/requisicoes/:id`, `/:id/eventos` | idem | Detalhe e linha do tempo | `:62-73` ✅ |
| `POST /compras/requisicoes` | `movimentacoes:editar` | Cria requisição e move a parcial a Compras · CCP; enfileira o envio | `:75-79` ✅ |
| `POST /compras/requisicoes/:id/cancelar` | idem | Só requisição `ABERTA`; parcial volta a Requisições | `:81-91` ✅ |
| `POST /compras/requisicoes/:id/chegada` | idem + `pode_atuar` no Recebimento | Chegada com NF ([[07-Recebimento]]) | `:93-103` ✅ |
| `POST /compras/requisicoes/:id/liberar-recebimento` | idem + `compras-liberar` | Rede de segurança | `:105-115` ✅ |
| `PATCH /compras/requisicoes/:id/compra` | — | **Removida** (14/10): o registro manual da compra saiu | ✅ ausente em `compras.controller.ts` |

### av-hub (`api-acos-vital`)

| Rota | Quem chama | Efeito | Código |
|---|---|---|---|
| `PUT /compras/requisicoes/origem/:id_origem` | MES (chave `MES_INTEGRACAO_KEYS`) | cria, atualiza, cancela ou ignora (`fn_requisicao_mes_aplicar`) | `requisicoes_compra.route.js:220` ✅ [[Contratos-da-v2\|LOG-34]] |
| `GET /compras/requisicoes/eventos` | MES (`API_KEY`) | marcos com cursor `(registrado_em, id)` | `:289` ✅ [[Contratos-da-v2\|LOG-35]] |
| `GET`, `GET /resumo`, `GET /:id`, `POST`, `PATCH /:id` | HUB (BFF) | caixa do Compras e "Nova requisição"; PATCH só `em_cotacao`, `aberta`, `cancelada` | `:148`, `:199`, `:371`, `:384`, `:413` ✅ |
| `GET /compras/ordens`, `POST /compras/ordens`, `PATCH /:id` (`aprovado` ou `cancelado`) | HUB | lista, emite, aprova ou cancela | `ordens_compra.route.js:606`, `:922`, `:1174` ✅ [[Contratos-da-v2\|LOG-23]], [[Contratos-da-v2\|LOG-36]] |
| `GET /compras/ordens/fila-omie`, `PATCH /:id/sincronizacao`, `POST /:id/reenviar` | pipeline e HUB | fila e retorno do envio ao Omie | `ordens_compra.route.js:856`, `:1264`, `:1318` ✅ |
| `GET /compras/acompanhamento`, `GET`/`PUT /compras/ordens/:id/acompanhamento`, `POST …/contatos`, `POST …/ocorrencias`, `PATCH /compras/ocorrencias/:id` | HUB (CCP) | follow-up | `ordens_compra_acompanhamento.route.js:298-586` ✅ [[Contratos-da-v2\|LOG-32]] |
| `GET /ordens-compra/referencia` | MES (job) | referência e valores da OC | [[Contratos-da-v2\|API-004]], [[Contratos-da-v2\|API-007]]; lado hub ✅ (`api-acos-vital`); o MES consome na `develop` (K4, `6914fe9`, 15/10) ✅ |
| `GET /compras/requisicoes/referencia` | MES (job) | requisições do Compras com pedido de venda, antes de virarem OC | [[Contratos-da-v2\|API-009]]; lado hub ✅ (`api-acos-vital`); o MES lê na `develop` (`9e75df5`, 23/10) ✅ |

Montagem em `core_vendas_faturamento/index.js:190-193`. Contratos de banco: [[Contratos-da-v2|SQL-008]], [[Contratos-da-v2|SQL-007]], [[Contratos-da-v2|SQL-011]], [[Contratos-da-v2|SQL-012]].
