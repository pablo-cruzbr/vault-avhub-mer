---
tags: [fluxo, raia, vendas, proposta, v0, simulador, tela, parte]
criado: 2026-11-05
estado-em: 2026-11-12
status: proposta
dono: Nathan (regra) · Robert (rotas e telas de proposta) · Pablo (acompanha) · Gustavo (banco) · Compras (C6, C7, C8)
parte-de: "[[01-Proposta-de-Venda]]"
develop-conferida: [api-acos-vital bebca52, av-hub d82d58b, em 2026-11-12, só as rotas do transformar e do BFF; api-acos-vital cc3fbb3, av-hub 44bb770, em 2026-11-10; api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
fontes: [nota 11-Proposta-e-Pedido-de-Venda da v2 (tag v2-antes-da-v3), sem C6–C8, V1–V3 e B2–B4, que foram para 06, 03 e 02 em 05/11/2026, Registro-de-Decisoes (N16-01 a N16-144), api-acos-vital develop cc30c85 e 0384e89 de 29/10/2026 (core_comercial/aggregates/propostas/propostas.route.js, clientes, cadastros, parceiros), Dump Avhub 29/10/2026 (fn_proposta_criar, core_comercial.propostas), av-hub develop 758d5f0 (app/api/comercial/[...rota]/route.ts, lib/domain/andamento-proposta.ts), Estudo-Omie-API, 09-Diagramas/fontes/tela-simulador-comissao.png, 09-Diagramas/fontes/email-divergencia-margem-pv27824.jpg e pv28204.jpg, av-hub comissoes/simulador/page.tsx, 00-Fluxo-Mestre-0b, 01-Vendas-Liberacao, 04-Circuito-de-Compra, Proposta-Orcamento-Comissao/08-Reuniao/Proposta-Orcamento-Pedido-Comissao.docx (fora do vault), 09-Diagramas/artifact-proposta-pedido.html, api-comercial 5aa5311 (propostas.routes.ts, propostas.service.ts, vendas.prisma, enums.prisma, custos.routes.ts, numeroProposta.ts), Dump Avhub 14/10, av-hub develop 44bb770 (PR #277, commit 20e6089), api-acos-vital develop cc3fbb3, Dump-AvHub-Teste-2026-11-10, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Proposta de venda: detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[01-Proposta-de-Venda]] (parte 1 de 2): Nota de raia; Objetivo; Quem atua (completo); Regras decididas; Estados; Telas; Endpoints e contratos.

**Onde estamos:** ← [[01-Proposta-de-Venda]] (resumo e índice) · partes: **01-Proposta-de-Venda-Detalhe-Tecnico-1** · [[01-Proposta-de-Venda-Detalhe-Tecnico-2]]

## Nota de raia

**Nota de raia (proposta, fluxo aprovado em 26/10/2026).** Nós do [[00-Fluxo-Mestre-0b]]: `V0.1` a `V0.7`, `V0C`, `V1`, e para o pedido digitado no Omie `V2` e `V3` ([[03-Pedido-de-Venda-e-Liberacao]]); `B1` a `B4` aparecem aqui só como ligação ([[02-Orcamento-Base-de-Preco]]); `C6`, `C7` e `C8` na raia de Compras; `K1` a `K6` em [[15-Custo-Real-e-Comissao]]. Selos em [[Regras-do-Vault]]; decisões em [[Registro-de-Decisoes]]; o que o Omie permite em [[Estudo-Omie-API]].

## Objetivo

Construir dentro do av-hub o começo do fluxo, que hoje não tem lugar. O vendedor preenche a parte de venda e a de orçamento e compra com o que conseguiu (telefone, e-mail), mas **não é o dono do dado de custo**: o dono é Compras e o Orçamento (N16-54). O pedido criado pela proposta **nasce liberado**: a escolha "a Qualidade acompanha?" já foi feita na proposta. O pedido digitado direto no Omie segue o **mesmo fluxo e a mesma tela** (N16-106): chega travado, com a parte de vendas pronta (só se altera no Omie), e o vendedor responde `V2`/`V3` e preenche a parte de compras.

Depois do pedido, o PCP abre as requisições (`P3`). Compras recebe e o sistema **puxa os dados da proposta**; Compras **confere os impostos**, edita no hub e valida se segue ou busca valor ou condição melhor (`C6`, `C7`). A compra acima do valor da proposta passa pelo vendedor, produto por produto, em "Meus Pedidos" (`C8`, N16-60 a N16-67). O cancelamento do pedido avisa a OC e o PCP e cancela a requisição e a OC ainda não emitida (N16-68 a N16-71). O passo a passo está no resumo do topo.

## Quem atua (completo)

| Quem | Papel | Onde |
|---|---|---|
| Vendedor | Cria e revisa a proposta, preenche o custo que conseguiu ou pede cotação, marca a aprovação, transforma em pedido, **aprova ou reprova a compra acima do valor**, **cancela ou exclui o pedido** (N16-84) e vê o andamento em Meus Pedidos | Vendas, `/vendas/propostas`, Meus Pedidos |
| Auxiliar do titular | Mesmo escopo do vendedor (vê e edita pelos titulares que auxilia, como em Meus Pedidos) 🟡 | idem |
| Gerência (João Vitor, Sérgio Vital) | Aprova desconto e margem **fisicamente** (`V0.4`). Quando o vendedor reprova uma compra, **Compras leva o caso a ela, fisicamente**; a Gerência **não cancela no sistema** e **não tem tela** para isso (N16-66) | fora do sistema |
| Orçamento (setor orçamentário) | **Setor novo; uma das pessoas é o Moisés** (N16-104). O sistema funciona sem orçamentista (N16-59). Atende o pedido de custo e mantém a base de preço ([[02-Orcamento-Base-de-Preco]]). O perfil "orçamentista" deve existir | Orçamento, `/orcamento/painel-comprador` |
| Gerente de Vendas e perfis que veem a equipe | Leem propostas da equipe (escopo `vinculados`/`todos`) ✅ (`api-acos-vital`) o gestor vê o time (N16-147, N16-148); falta a relação gestor-time no banco (Gustavo) | Vendas |
| PCP | Consome o pedido liberado e abre a requisição (`P1` a `P3`); **é avisado do cancelamento** do pedido; **liga a NF de entrada ao item do pedido** (N16-57) | MES |
| Compras (compradores, Gerente de Compras) | `C6`, `C7`, `C8`, OC (`C1` a `C4`); **lista dos casos reprovados pelo vendedor** e registro da solução (N16-73) | HUB, `/compras/*` |
| Fiscal | Cria o produto novo no Omie; separa o pedido em sequenciais para faturar em partes (N16-92); informa a **devolução parcial** (N16-74). **Não cancela o pedido**: quem cancela é o vendedor (N16-84) | Omie |
| Controladoria (Michele) | Decide a comissão ao fim, numa tela igual à da proposta, com o custo real ([[15-Custo-Real-e-Comissao]]); também informa a devolução parcial | HUB, Operações |
| Robert | Conduz o módulo comercial: rotas da proposta na `api-acos-vital` e telas de proposta (N16-117 a N16-119) | `api-acos-vital`, HUB |
| Pablo | Acompanha o Robert; Orçamento (N16-117) | `api-acos-vital` |
| Gustavo (DBA) | Banco (migrations e funções da proposta) | `api-acos-vital` |
| Nathan | Comissão estimada (`K1`), BFF, pipeline do pedido de venda, carga do imposto da OC do Omie | HUB, `omie-elt-pipeline` |

`Admin (Dev)` não é ator ([[Regras-do-Vault]]).

## Regras decididas

Origem: [[Registro-de-Decisoes]]. As regras 14 a 20 e 30 (`C6`, `C7`, `C8`) estão em [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]], com a mesma numeração.

| # | Regra | Selo |
|---|---|---|
| 1 | A proposta é a primeira etapa do fluxo mestre (`V0`), antes do `V1` | 📝 N16-01 |
| 2 | Uma proposta equivale a **um** pedido. Não há fechamento parcial | 📝 N16-02 |
| 3 | O botão "Transformar em pedido de venda" (`V0.6`) só aparece na proposta **aprovada** | 📝 N16-02 |
| 4 | O pedido é criado **por API no Omie** (`V0.7`), pelo padrão da OC: a API grava numa fila e a pipeline envia | 📝 N16-02 |
| 5 | **Cancelada** é um estado só (`CANCELADA`, com motivo) e **não reabre**: o vendedor duplica. Nunca vira pedido; a comissão estimada vira histórico | 📝 N16-02, N16-24 |
| 6 | A proposta só se ajusta **até ser aprovada**; cada ajuste gera uma revisão. Aprovada, não se ajusta mais | 📝 N16-03 |
| 7 | Proposta **incompleta** é a que tem **qualquer item sem custo e sem fornecedor**; **não pode ser aprovada** | 📝 N16-03, N16-31 |
| 8 | Número automático e próprio, só dígitos, **por unidade e tipo**; proposta e pedido têm sequências próprias; prefixo só na tela e no PDF; o número do Omie segue a chave no MES | 📝 N16-04, N16-26; 🔴 não aplicado: o banco grava `CO-AV2026-0011-R00` (`fn_proposta_criar`, [[Dump-AvHub-Teste-2026-11-10]]) |
| 9 | "A Qualidade acompanha?" é obrigatório em `V0.6`; sem a marcação, o pedido não é criado. O vendedor pode corrigir a marcação até o MES importar, com histórico | 📝 N16-05, N16-29 |
| 11 | O vendedor preenche o custo com o que conseguiu, mas **não é o dono do dado** (Compras e Orçamento são). Sem o dado, pede cotação ao orçamentista ou vê o histórico das OC. Ele decide o valor que põe | 📝 N16-06, N16-54 |
| 12 | A aprovação de desconto e margem é **física** neste ciclo (`V0.4`); no sistema, só no próximo. **O vendedor marca "aprovada"** no sistema, que grava quem, quando e qual revisão | 📝 N16-12, N16-25 |
| 13 | A comissão estimada nasce em `V0.3` (`K1`) e só o vendedor a vê, como ele a colocou | 📝 N16-10 |
| 24 | O câmbio vem da PTAX do Hub, **do dia da aprovação**; não há migração do ERP antigo de propostas | 📝 N16-13, N16-27 |
| 25 | Produto pendente (`PEND-xxxx`) **não vira pedido** até o cadastro no Omie | 📝 N16-28 |
| 27 | Erro do Omie ao criar o pedido: **erro de sincronia**, com o motivo e o botão **"Tentar novamente"**; a proposta segue aprovada | 📝 N16-36 |
| 28 | **A tela da proposta é semelhante à do Simulador de Comissão atual**: pedido, condições comerciais (um conjunto por proposta), itens com Compra, Venda e Resultado, e rodapé de totais com margem e letra. Mesmo motor e mesmas regras, em tabelas novas. Seção "A tela da proposta" abaixo | 📝 N16-19, N16-21, 🔴 sem código |
| 29 | O vendedor preenche o custo de compra dos itens na própria tela e vê custo líquido, sugerido, margem, letra e a comissão estimada que ele colocou. **Não vê** a comissão real antes da decisão da Controladoria. Na aprovação de **C8** ele vê o valor da compra daquele produto | 📝 N16-10, N16-19, N16-60 |
| 31 | A Michele tem a tela igual, com o custo real e afins, lado a lado com o estimado, e as condições de **cada evento de custo** | 📝 N16-19, N16-20 |

A regra 21 (pedido de custo ao Orçamento, `B3`) está em [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2#Orçamento visto da proposta (B2 a B4)]].

As regras 10, 22, 23, 26 e 32 (pedido, liberação, cancelamento e telas de pedido) estão em [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]], com a mesma numeração.

## Estados

### Proposta (`status`) 🟡

O enum antigo, no `api-comercial` do Pablo (removido em 06/11/2026; legível no `f7d8d7f`), era `StatusProposta`: `ABERTA`, `PARCIAL`, `FECHADA`, `PERDIDA` (`api-comercial/prisma/models/enums.prisma:69-76`). Na `api-acos-vital` (`develop`, 29/10) a rota aceita `ABERTA`, `APROVADA`, `TRANSFORMADA`, `CANCELADA` e `EXPIRADA` (`propostas.route.js`, `STATUS`); o `CHECK` `ck_propostas_status` do dump de 29/10 tem só os quatro primeiros ❓ (`EXPIRADA`: a validade vencida passa de `ABERTA` a `EXPIRADA` por um agendador diário do banco, `fn_propostas_expirar`, e a API a expira na hora quando alguém esbarra nela; a validade não consta nas decisões N16 lidas: confirmar com o Nathan). Valores, como estão no banco e na API:

| Valor | De onde vem | Significado | Quem vê |
|---|---|---|---|
| `ABERTA` | `ABERTA` | Em elaboração. Ajusta e revisa. Se algum item está sem custo e sem fornecedor, a tela marca **incompleta** (campo calculado, não é estado) | vendedor, equipe |
| `APROVADA` | `FECHADA` (sem fechamento parcial) | O vendedor marcou a aprovação da Gerência. Travada. Libera o botão `V0.6` | vendedor, equipe |
| `TRANSFORMADA` | novo | O pedido foi criado a partir dela (`V0.6`, `V0.7`); grava `transformada_em`. Travada | vendedor, equipe |
| `CANCELADA` | `PERDIDA` | Estado único, não reabre (duplica). A comissão estimada vira histórico | vendedor, equipe |
| `EXPIRADA` | novo | Validade vencida sem aprovação (ver acima) | vendedor, equipe |

`PARCIAL` deixou de existir (N16-02). Eventos da linha do tempo no dump de 29/10 (`ck_propostas_eventos_tipo`, 15 tipos): `CRIADA`, `REVISADA`, `DUPLICADA`, `COPIADA`, `PDF_GERADO`, `EXCLUIDA`, `CUSTO_ALTERADO`, `MIGRADA`, `EMAIL_ENVIADO`, `REATRIBUIDA`, `APROVADA`, `CANCELADA`, `TRANSFORMADA`, `PEDIDO_ENVIADO`, `PEDIDO_ERRO` (os dois últimos para o envio ao Omie, `V0.7`). Saíram `PERDIDA`, `REABERTA`, `FECHAMENTO_PARCIAL` e `FECHAMENTO_TOTAL`. Registro anterior (módulo de teste, `enums.prisma:119-136`): `TipoEventoProposta` tinha 14 valores, com `PERDIDA`, `REABERTA`, `FECHAMENTO_*` e `PEDIDO_OMIE_ATUALIZADO`.

### Pedido de venda do hub (`status_sincronizacao_omie`)

Mesmo vocabulário da OC (`pendente`, `sincronizado`, `erro`; Dump Avhub 17315-17320): `pendente` (criado no Hub), `sincronizado` (Omie criou; guarda o número do Omie), `erro` (Omie recusou; texto do erro; botão "Tentar novamente", N16-36). ✅ `POST /comercial/propostas/:id/transformar` grava o pedido do Hub e já tenta enviá-lo ao Omie na mesma requisição, e `POST /comercial/pedidos/:id/enviar-omie` reenvia (`api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:661` (`router.post("/propostas/:id/transformar"`) e `src/schemas/core_comercial/aggregates/pedidos/pedidos.route.js:33` (`router.post("/pedidos/:id/enviar-omie"`)). ✅ A tela tem o botão "Tentar novamente no Omie" (`av-hub` `components/Propostas/PropostaForm/AndamentoProposta.tsx:251`, `Tentar novamente no Omie`). ❓ O banco dessas funções (`fn_pedido_venda_envio_iniciar`, `fn_pedido_venda_omie_registrar`, `fn_pedido_venda_omie_erro`) vem da migration `2026-11-05_comercial_pedido_venda_omie.sql`, fora do repositório e do dump de 04/11.

O pedido de aprovação do vendedor (`C8`) está em [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].

A liberação do pedido da proposta está em [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].


## Telas

| Nome atual | Rota | App | Quem | Nó | Estado |
|---|---|---|---|---|---|
| Propostas (lista) | `/vendas/propostas` | HUB | Vendedor, equipe | `V0.1` | ✅ `app/(protected)/vendas/propostas/page.tsx` (movida em 16/10, `200e860`); lê `GET /comercial/propostas` da API do Hub |
| Nova proposta | `/vendas/propostas/nova` | HUB | Vendedor | `V0.1`, `V0.2` | ✅ `vendas/propostas/nova/page.tsx`, formulário `components/Propostas/PropostaForm/PropostaForm.tsx` |
| Proposta (detalhe, revisões, linha do tempo) | `/vendas/propostas/[id]` | HUB | Vendedor, equipe | `V0.1` a `V0.7` | ✅ `vendas/propostas/[id]/page.tsx` (abas e análise de margem, 29/10, `88fbafe`); ✅ aprovar, cancelar, copiar e transformar com botão e BFF (ver as duas linhas abaixo) |
| Acompanhamento de Clientes (a tela Clientes passou a ser esta, N16-112) | `/vendas/acompanhamento-clientes` | HUB | Vendedor | `V0.1` | ✅ (`av-hub` `1a48140`, 27/10); o cliente da proposta sai do cadastro do Hub e `POST /comercial/clientes` cadastra no Omie |
| Relatório Gerencial | `/vendas/relatorio-gerencial` | HUB | Gerência | — | ✅ (`av-hub`); o Relatório de Cotações não existe mais como página na `develop` (conferido em 29/10) |
| Tela da proposta no formato do Simulador (pedido, condições, itens, totais) | dentro de `/vendas/propostas/[id]` e `/vendas/propostas/nova` | HUB | Vendedor | `V0.2`, `V0.3` | 🟡 itens em grade e condições no layout do Simulador desde 27/10 (`37c9cf2`); a análise de margem é gravada com a proposta (29/10); 🔴 sem a comissão estimada à vista e sem a trava de proposta incompleta (16/11, [[01-Proposta-de-Venda-Detalhe-Tecnico-2#Como está o V0.3 (conferido na `develop` em 16/11/2026)]]) |
| Visão da Controladoria da mesma tela, com custo real | Operações 🟡 | HUB | Controladoria | `K4` | 🔴 ([[15-Custo-Real-e-Comissao]]) |
| Botão "Transformar em pedido de venda" e marcação da Qualidade | dentro de `/vendas/propostas/[id]` | HUB | Vendedor | `V0.6` | ✅ `av-hub` `components/Propostas/PropostaForm/AndamentoProposta.tsx:232` (`Transformar em pedido`); o modal envia as seis respostas, com a Qualidade e o faturamento em partes (`TransformarModal.tsx:295` `qualidade_acompanha: qualidadeAcompanha === 'sim'` e `:296` `faturar_em_partes: faturarEmPartes === 'sim'`, PR #277); BFF `app/api/comercial/[...rota]/route.ts:42` (`/propostas/:id/transformar`) |
| Marcar "aprovada" (registro da aprovação física), cancelar e copiar | idem | HUB | Vendedor | `V0.4`, `V0.5`, `V0C` | ✅ `av-hub` `AndamentoProposta.tsx:227` (`Cliente aprovou`), `:241` (`Cancelar proposta`) e `:256` (`Copiar para nova proposta`); BFF `app/api/comercial/[...rota]/route.ts:35` (`/propostas/:id/aprovar`), `:36` (`/propostas/:id/cancelar`) e `:37` (`/propostas/:id/copiar`). 🟡 O "Cliente aprovou" trava a proposta sem pedir confirmação (validação local em Docker de 10/11/2026) |

A página do produto (`B2`) está em [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2#Orçamento visto da proposta (B2 a B4)]].

As telas do pedido (Pedidos de Venda, Notas Fiscais de Saída, tarja de cancelado, Liberar Pedidos) estão em [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].

As telas de `C6`, `C7` e `C8` (Meus Pedidos com a aprovação, lista de reprovados, visão e conferência de Compras) estão em [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].

O contrato do menu de Vendas, Orçamento e Compras foi removido em 29/10/2026; o Robert cria o novo. O menu já foi enxugado no front em 27/10 (N16-107, `av-hub` `a1493a8`): Vendas tem hoje Propostas, Acompanhamento de Clientes, Meus Pedidos, Relatório Gerencial e as telas de pedido e nota.

## Endpoints e contratos

Em 29/10/2026 a `api-acos-vital` (`develop`, `cc30c85`) monta estas rotas sob `/comercial` (`propostas.route.js`); o `api-comercial` de teste (removido em 06/11/2026) tinha as mesmas sem prefixo:

| Método e rota | Uso | Nó | Estado |
|---|---|---|---|
| `POST /comercial/propostas` | criar (idempotente; valida cliente em `core.parceiros`, validade, número) | `V0.1` | ✅ `api-acos-vital` |
| `GET /comercial/propostas`, `/resumo`, `/:id`, `/:id/eventos` | listar e ler | `V0.1` | ✅ `api-acos-vital` |
| `PUT /comercial/propostas/:id` | revisar (só `ABERTA`, `If-Match`) | `V0.1`, `V0.2` | ✅ `api-acos-vital` |
| `POST /comercial/propostas/:id/aprovar` | `ABERTA` para `APROVADA` | `V0.4`, `V0.5` | ✅ `api-acos-vital` |
| `POST /comercial/propostas/:id/cancelar` `{ motivo }` | cancelar (`ABERTA` ou `APROVADA`) | `V0C` | ✅ `api-acos-vital` |
| `POST /comercial/propostas/:id/copiar` | nova `ABERTA` a partir desta | `V0.1` | ✅ `api-acos-vital` |
| `POST /comercial/propostas/:id/transformar` | pedido do Hub (`pendente`) e simulação v1, numa transação; recebe no corpo `data_previsao`, `qualidade_acompanha` e `faturar_em_partes` (os três obrigatórios, LOG-56), `numero_pedido_cliente`, `codigo_categoria`, `numero_contrato` (`SPOT` ou `CONTRATO`), `bloqueado`, `frete_modalidade` e `dados_adicionais_nf`, e em seguida envia o pedido ao Omie (`IncluirPedido`, uma tentativa só) | `V0.6`, `V0.7` | ✅ `api-acos-vital` `propostas.route.js:651` (`qualidade_acompanha: previsaoObrigatoria`), `:638` (`faturar_em_partes: previsaoObrigatoria`), `:614` (`router.post("/propostas/:id/transformar"`); ✅ tela e BFF (PR #277 do av-hub); ❓ banco (migration de 05/11 fora do repositório) |
| `POST /comercial/pedidos/:id/enviar-omie` | "Tentar novamente": reenvia ao Omie o pedido do Hub `pendente` ou com `erro`; aceita os campos do modal para trocar o gravado (aqui todos opcionais); 409 `ENVIO_EM_ANDAMENTO` ou `PEDIDO_JA_SINCRONIZADO` | `V0.7` | ✅ `api-acos-vital` `pedidos.route.js:33` (`router.post("/pedidos/:id/enviar-omie"`); ❓ banco |
| `GET /comercial/produtos?codigo_empresa=` | catálogo da unidade da proposta, só ativos; unidade obrigatória | `V0.2` | ✅ `api-acos-vital` `src/schemas/core_comercial/aggregates/produtos/produtos.route.js:42` (`router.get("/produtos"`) |
| `GET /categorias?codigo_empresa=&tipo=receita` | categorias de receita lançáveis (sem totalizadoras e sem `nao_exibir`) da unidade, para o campo categoria | `V0.6` | ✅ `api-acos-vital` `src/schemas/core/tables/categorias/categorias.route.js:57` (`conta_receita = true`) |
| `POST /comercial/clientes`, `GET /comercial/parceiros` | cadastrar cliente no Omie da unidade; listar parceiros | `V0.1` | ✅ `api-acos-vital` (28 e 29/10) |

Rotas do `api-comercial` de teste (removido em 06/11/2026) ainda sem equivalente na `api-acos-vital`, e rotas novas ainda por fazer:

| Método e rota | Uso | Nó | Estado |
|---|---|---|---|
| `GET /propostas/:id/versoes`, `/:id/versoes/:revisao` | listar versões | `V0.1` | 🔴 sem API e sem banco (existia só no módulo de teste `av-hub/api-comercial`, removido em 06/11/2026; o BFF responde 503): `propostas.routes.ts` |
| `POST /propostas/calcular`, `/itens/importar`, `GET /itens/modelo` | pré-visualizar, planilha de itens | `V0.1` | 🔴 sem API e sem banco (existia só no módulo de teste `av-hub/api-comercial`, removido em 06/11/2026; o BFF responde 503): `:27`, `:55`, `:68` |
| `POST /custos/sugerir` | sugestão de custo para o item | `V0.2` | 🔴 sem API e sem banco (existia só no módulo de teste `av-hub/api-comercial`, removido em 06/11/2026; o BFF responde 503): `custos.routes.ts:30` |
| `GET /pedidos_venda_hub/fila-omie`, `PATCH /pedidos_venda_hub/:id/sincronizacao`, `POST /:id/reenviar` | fila e retorno da pipeline, espelho de `/compras/ordens/fila-omie` | `V0.7` | 🔴 (nome em aberto; o pedido já nasce `pendente` em `transformar`) |
| `GET /propostas/:id/pedido_omie`, `PUT` (digitar o número à mão) | **substituídas**: o pedido deixa de ser digitado | `V0.7` | 🔴 só no módulo de teste (`propostas.routes.ts:146-164`), saem |

As rotas de preço do produto e de pedido de custo (`B2` a `B4`) estão em [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2#Orçamento visto da proposta (B2 a B4)]].

A rota de cancelamento do pedido está em [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].

Auditoria das telas e a nova página de proposta: [[Telas-e-Experiencia-do-Usuario]]; mapa do pedido no Omie: [[Mapa-IncluirPedido-Omie]].

Contratos: os desta parte foram removidos em 29/10/2026 e o Robert cria os novos. Nomes de rota 🟡: o Gustavo e o Robert fecham.
