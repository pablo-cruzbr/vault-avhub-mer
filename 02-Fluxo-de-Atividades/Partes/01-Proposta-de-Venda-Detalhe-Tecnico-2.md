---
tags: [fluxo, raia, vendas, proposta, v0, simulador, tela, parte]
criado: 2026-11-05
estado-em: 2026-11-16
status: proposta
dono: Nathan (regra) · Robert (rotas e telas de proposta) · Pablo (acompanha) · Gustavo (banco) · Compras (C6, C7, C8)
parte-de: "[[01-Proposta-de-Venda]]"
develop-conferida: [api-acos-vital 2e333e3, av-hub f63b01b, em 2026-11-16, o V0.3 e os retestes R5 e R6; api-acos-vital 96316f4, av-hub f63b01b, em 2026-11-16, os dados técnicos e o reteste R4; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13; api-acos-vital cc3fbb3, av-hub 44bb770, em 2026-11-10; api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
fontes: [nota 11-Proposta-e-Pedido-de-Venda da v2 (tag v2-antes-da-v3), sem C6–C8, V1–V3 e B2–B4, que foram para 06, 03 e 02 em 05/11/2026, Registro-de-Decisoes (N16-01 a N16-144), api-acos-vital develop cc30c85 e 0384e89 de 29/10/2026 (core_comercial/aggregates/propostas/propostas.route.js, clientes, cadastros, parceiros), Dump Avhub 29/10/2026 (fn_proposta_criar, core_comercial.propostas), av-hub develop 758d5f0 (app/api/comercial/[...rota]/route.ts, lib/domain/andamento-proposta.ts), Estudo-Omie-API, 09-Diagramas/fontes/tela-simulador-comissao.png, 09-Diagramas/fontes/email-divergencia-margem-pv27824.jpg e pv28204.jpg, av-hub comissoes/simulador/page.tsx, 00-Fluxo-Mestre-0b, 01-Vendas-Liberacao, 04-Circuito-de-Compra, Proposta-Orcamento-Comissao/08-Reuniao/Proposta-Orcamento-Pedido-Comissao.docx (fora do vault), 09-Diagramas/artifact-proposta-pedido.html, api-comercial 5aa5311 (propostas.routes.ts, propostas.service.ts, vendas.prisma, enums.prisma, custos.routes.ts, numeroProposta.ts), Dump Avhub 14/10, av-hub develop 44bb770 (PR #277, commit 20e6089), api-acos-vital develop cc3fbb3, Dump-AvHub-Teste-2026-11-10, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Proposta de venda: detalhe técnico (2/2)

**Em uma frase:** detalhe técnico da nota [[01-Proposta-de-Venda]] (parte 2 de 2): Como estava no módulo de teste do Pablo (🔴 `av-hub/api-comercial`, removido em 06/11/2026); O Omie nesta raia ([[Estudo-Omie-API]]); Dados 🟡; Quem vê o quê; A tela da proposta (N16-19); O que falta desenvolver; Pendências; Diagrama do subfluxo.

**Onde estamos:** ← [[01-Proposta-de-Venda]] (resumo e índice) · partes: [[01-Proposta-de-Venda-Detalhe-Tecnico-1]] · **01-Proposta-de-Venda-Detalhe-Tecnico-2**

## Como estava no módulo de teste do Pablo (🔴 `av-hub/api-comercial`, removido em 06/11/2026)

Tudo abaixo é do `api-comercial` (pasta `av-hub/api-comercial`), serviço **só de teste** (N14-15), depois legado só para leitura (N16-117) e **removido do av-hub em 06/11/2026 (PR #261, `dd9d729`)**; o código fica legível em `git show f7d8d7f:api-comercial/<arquivo>`. pelo F3, o que só existe nele é 🔴 "sem API e sem banco". No `av-hub` `develop` (2e5456d) o BFF já não fala com ele: as rotas que ainda não existem na API do Hub respondem 503 `RECURSO_NAO_MIGRADO` (`lib/api/comercialApi.ts`, N16-111). Parte disto já foi refeita na `api-acos-vital` (rotas da proposta, `develop`, 29/10; ver o quadro de endpoints); o que não foi segue 🔴 lá. As regras antigas de fechamento parcial, perda, reabrir e pedido digitado no Omie saíram do front em 28/10 (`av-hub` `2008344`).

- 🔴 (só no módulo de teste) **Proposta completa:** modelo `Proposta` (`prisma/models/vendas.prisma:45-109`) com cliente, empresa emissora, itens, moeda, incoterm, frete, condição, totais, `valorFechado`, `acompanhamentoQualidade`, `numeroPedidoOmie`; itens com snapshot de custo (`PropostaItem`, `:111-166`: `custo`, `margemPct`, `origemCusto`, `idOferta`, `fornecedor`, `custoLiquidoUnit`, `margemRealPct`).
- 🔴 (só no módulo de teste) **Revisão:** `atualizar` só roda em `ABERTA` (`propostas.service.ts:478-481`); se o conteúdo comercial muda, `revisao + 1` e uma linha em `propostas_versoes` com o snapshot (`:483-515`); evento `REVISADA`.
- 🔴 (só no módulo de teste) **Numeração atômica** (`proximoSequencial`, `propostas.service.ts:313-322`), mas com formato `CO-AV2026-0012-R03` (`domain/numeracao/numeroProposta.ts:3-12`), por empresa e ano: **diverge de N16-04 e N16-26** 🔴.
- 🔴 (só no módulo de teste) **Comandos de status:** `perder` (`:555-575`), `reabrir` (`:578-606`), `fechar` com fechamento parcial por item (`:609-649`) e `calcularFechamento`. **Divergem de N16-02, N16-03 e N16-24** 🔴: reabrir e fechar em parte deixam de existir.
- 🔴 (só no módulo de teste) **Pedido no Omie à mão:** `pedidoOmie` monta o resumo para o vendedor digitar (`:663-691`), com planilha (`pedidoOmie.ts`), e `registrarPedidoOmie` grava o número e a marcação da Qualidade (`:694-725`); `exigirGanha` aceita `FECHADA` e `PARCIAL` (`:652-656`). Sai com N16-02 🔴.
- 🔴 (só no módulo de teste) **Duplicar e copiar para outra empresa** (`propostas.service.ts:853-903`).
- 🔴 (só no módulo de teste) **PDF e e-mail da proposta** (HUB gera o PDF; `emailProposta.ts`; evento `PDF_GERADO`).
- 🔴 (só no módulo de teste) **Capacidades** derivadas das telas do hub: `propostas`, `propostas-valores`, `custo-item`, `painel-comprador`, `propostas-delegacao` (`domain/permissoes/capacidades.ts:47-56`).
- O pedido de custo no módulo de teste está em [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2#Orçamento visto da proposta (B2 a B4)]].
- 🔴 (só no módulo de teste) **Simulador do Hub** lê a proposta ligada ao pedido para pré-preencher o lado da compra (`simulador.routes.ts`, PR #207). Não é a comissão estimada da proposta.

No HUB (branch `feat/menu-orcamento-vendas-compras`, `5aa5311`): as páginas de Vendas já estão em `app/(protected)/vendas/*` ✅ (`av-hub`).

No av-hub (API do hub), o que serve de padrão: contador por `(unidade, tipo)` (`contadores_documento`, `fn_proximo_numero_documento`, Dump Avhub 8110-8140, 16552-16564); fila da OC para o Omie (`GET /compras/ordens/fila-omie`, `PATCH …/sincronizacao`, `POST …/reenviar`, `ordens_compra.route.js:868`, `:1267`, `:1321`); liberação (`pedidos_vendas_liberacao`, Dump 18285).

## O Omie nesta raia ([[Estudo-Omie-API]])

- ✅ (Omie, [[Estudo-Omie-API]]) O `IncluirPedido` aceita o **nosso código de integração** do pedido e do item: o hub grava a liberação na **resposta** da inclusão e liga o item da proposta ao `codigo_item_omie`. Etapa inicial `"10"`. A pipeline precisa **gravar** `codigo_pedido_integracao`.
- 🟡 Pode ser possível **mandar o nosso `numero_pedido`**, e o pedido criado por API pode nascer **bloqueado** na tela do Omie: ❓ só teste.
- ✅ **A categoria do pedido decide se ele gera comissão.** A regra do grupo G6 compara o código `'1.01.96'` (refaturamento em Mogi) e a `vw_comissao_master` só lê `grupo IS NULL`; a categoria que o Hub manda em `informacoes_adicionais.codigo_categoria` entra direto nessa regra. 🔴 Em Uberaba o refaturamento é o `1.01.99` e **não** cai em G6 ([[Riscos]], RS-022). 🟡 A tela deve mostrar essa consequência na hora de escolher a categoria; ver [[Mapa-IncluirPedido-Omie]], seção 5.3.1.
- O cancelamento do pedido no Omie (`CancelarPedidoVenda`, quem cancela) está em [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].
- ✅ Devolução de **venda**: a total vem do Omie; a **parcial** só chega marcada, sem valor, item nem quantidade. Fiscal ou Controladoria informam o que voltou (N16-74).

## Dados 🟡

Schema (proposta, pedido de venda do hub, numeração, custo realizado por item): o modelo está no banco (contratos removidos em 29/10/2026). ⚠️ A N16-116 (27/10) decidiu que não existirá `core_comercial` e que a proposta fica em `core_vendas_faturamento`; o dump e o código de 29/10 criam e usam `core_comercial.propostas` e `core_comercial.fn_proposta_*`. Divergência a fechar com o Nathan e o Gustavo ❓. Aqui só o que o fluxo exige:

| Dado | Regra |
|---|---|
| `propostas.status`, `revisao`, `aprovada_em`, `aprovada_por`, `aprovada_revisao` | aprovação grava quem, quando e **qual revisão** |
| `propostas.acompanhamento_qualidade` | obrigatório no `V0.6`, copiado ao pedido |
| `pedidos_venda_hub.numero`, `numero_omie`, `codigo_pedido_integracao`, `status_sincronizacao_omie`, `id_proposta`, `cancelado_em`, `cancelado_por`, `motivo_cancelamento` | 1 para 1 com a proposta (único); o cancelamento é guardado **no hub**, mesmo que o Omie exclua o pedido |
| `contadores_documento.tipo` | ganha `proposta` e `pedido_venda` (o `CHECK` hoje só aceita `ordem_compra` e `requisicao_compra`, Dump 16560) |
| Item da proposta ↔ item do pedido ↔ `codigo_item_omie` ↔ item da OC | chave do custo real |

## Quem vê o quê

| Dado | Vendedor | Auxiliar | Gerente de equipe | Orçamento | Compras | PCP | Controladoria |
|---|---|---|---|---|---|---|---|
| Proposta (venda, preço, desconto) | só as dele | dos titulares | todas da equipe | só o pedido de custo, sem preço de venda 🟡 | a parte de compras, quando há requisição do pedido | não | só a tela da comissão (mesma estrutura da proposta), não edita a proposta |
| Custo e margem | os que ele pôs (`propostas-valores`, `custo-item`) | idem | equipe | custo que preenche | custo e valor correto | não | sim (custo real e diferença) |
| **Aviso de compra acima do valor** | **sim, só o dos produtos dele**, com margem atual, margem considerada, motivo e fornecedor | idem 🟡 | 🟡 OQ-21 | não | **sim, a lista dos reprovados** | não | sim |
| Comissão estimada | só a que ele pôs | idem | 🟡 OQ-21 | não | não | não | sim |
| Pedido de venda do hub | os dele | idem | equipe | não | o vinculado à requisição | liberado; **avisado do cancelamento** | não |

A matriz completa por perfil estava no contrato removido em 29/10/2026; o Robert cria o novo.

## A tela da proposta (N16-19)

A tela de criar e revisar a proposta segue a do **Simulador de Comissão atual** (`09-Diagramas/fontes/tela-simulador-comissao.png`; `av-hub/app/(protected)/comissoes/simulador/page.tsx`). Blocos, na ordem da imagem:

1. **Pedido** → na proposta: unidade, número da proposta (automático, N16-04), cliente, vendedor e quantidade de itens.
2. **Condições comerciais** (um conjunto por proposta, como no Simulador): estado de destino com ICMS, condição de pagamento com encargo ("o encargo financeiro entra no preço sugerido"), chave "Com impostos", frete na compra (rateio pelo percentual de logística), valor ST (venda), imposto retido ou DIFAL e frete na venda ("entra na NF, mas fica fora da margem"). Os parâmetros vigentes ("Parâmetros: Maio/23" na imagem, que continuam valendo, N16-39) são gravados com o cálculo. 🟡 O `SimularImpostos` do Omie pode alimentar a ST e o DIFAL da venda sem digitação ([[Estudo-Omie-API]]).
3. **Itens**: bloco Compra (fabricação, quantidade, unidade, preço, origem, % IPI, ST, frete e fornecedor: o vendedor preenche), bloco Venda (quantidade e preço) e bloco Resultado (custo líquido, sugerido, margem e letra: o sistema calcula).
4. **Rodapé de totais**: custo, venda, total da NF, sugerido, mark-up real, mark-up sobre a compra, margem e letra.

As colunas e as condições **vêm das mesmas entradas do motor atual** (`simulacoes`, `simulacao_itens`, `simulador_parametros` e a view `vw_simulacao_resolvida`, ver [[01-Motor-Atual-Como-Calcula]]); o `core_comercial` (itens da proposta) e o `core_comissao` casam com elas, sem colunas paralelas. Hoje o Simulador calcula no navegador (`av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:664`, `calcularSimulacao(form, parametros)`) e a proposta não calcula comissão; o cálculo passa à API ([[03-Modelo-Novo-core_comissao]]).

**Três visões da mesma tela** (detalhe e tabela por bloco em [[15-Custo-Real-e-Comissao]]): (a) o vendedor, na proposta, preenche o custo e vê margem, letra e a comissão estimada que ele colocou; (b) Compras vê o cotado do vendedor ao lado do valor da OC e usa o valor correto na OC, sem alterar a proposta; quando o valor é maior, o vendedor aprova em Meus Pedidos; (c) a Controladoria vê estimado e real lado a lado, com o drill-down por evento de custo (cada evento com as suas condições, N16-20), e decide com justificativa.

## Como está o V0.3 (conferido na `develop` em 16/11/2026)

- ✅ A tela segue o Simulador (grade, condições e compositor de item, desde 27/10) e a aba "Análise de margem" roda o mesmo motor do Simulador enquanto o vendedor digita: custo líquido, preço sugerido, margem e letra (`av-hub` `components/Propostas/PropostaForm/AbaAnalise.tsx:32` (`titulo="Análise de margem"`); `components/Propostas/PropostaForm/useEdicaoProposta.ts:112` (`Roda o MOTOR do simulador`)).
- ✅ A API grava com a proposta a letra, a regra aplicada e o percentual de comissão de cada item, só visíveis a quem vê custo (`api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:172` (`pct_comissao: zPercentual()`)).
- 🔴 A comissão estimada não aparece ao vendedor: a tela mostra só a etiqueta "Comissão: após a aprovação de Compras" (`av-hub` `components/Propostas/PropostaForm/ItensResumo.tsx:98` (`Comissão: após a aprovação de Compras`)). Isso contraria a N16-10; o Nathan decide se vale a regra ou o código.
- 🔴 Aprovar não trava a proposta incompleta: `fn_proposta_aprovar` confere só o status `ABERTA` e a validade ([[Dump-AvHub-Teste-2026-11-16]], `04-Dados/Dumps/avhub-tst-esqueleto-2026-11-16.sql:4096` (`CREATE FUNCTION core_comercial.fn_proposta_aprovar`)). Na tela, "N sem fornecedor" só aparece como informação no cartão de andamento (`av-hub` `lib/domain/andamento-proposta.ts:111` (`sem fornecedor`)).
- 🔴 O motor roda só no navegador: a API grava a letra e a comissão que recebe, sem refazer a conta. Um valor errado entra como veio, e a margem considerada do aviso de compra mais cara sai nula (BL-078).

## O que falta desenvolver

- ✅ **Retestes R5 e R6 pela API no Docker (16/11, banco igual ao tst de 16/11), AV2026-0022 → PV-000010 e AV2026-0024 → PV-000011:** "Desvios" e "Pintura/acabamento" gravam e passam à revisão e à cópia (`api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:150` (`tec_desvios: texto(500)`)) (o BL-097 era só do Docker local); revisão com `If-Match` (428 sem, 409 com versão velha); as seis respostas do transformar; a simulação v1 nasce `RASCUNHO`; a fabricação entra sem custo, sem margem e sem letra (N16-166); "Tentar novamente" grava a previsão e a Qualidade sem criar outro pedido. Defeitos em [[Backlog-Reteste-R5-R6-2026-11-16]] (o BL-101, a lista de propostas da `2e333e3` sem a migration, foi resolvido no tst no mesmo dia).
- 🟡 **Reteste R4 no Docker (16/11), da AV2026-0021 ao PV-000009:** criar, revisar (R01), PDF comercial e PDF técnico (`?tipo=tecnica`, `av-hub` `app/api/comercial/propostas/[id]/pdf/route.ts:31` (`get('tipo') === 'tecnica'`)), aprovar e transformar funcionaram, e o transformar gravou a simulação de comissão. Os "Dados técnicos" do item ganharam "Desvios" e "Pintura/acabamento" (av-hub #299 a #301, api `96316f4`), que dependem da migration de 16/11 (BL-097). Continuam o cartão "Qualidade: não informada" e sem atualizar depois da falha do Omie (BL-092), e o pedido do Hub fora de Meus Pedidos. Item de fabricação não tem custo (N16-166). Detalhe em [[Backlog-Reteste-R4-2026-11-16]].

Os itens 7 e 12 (`C6`, `C7`, `C8`) estão em [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].

| # | O quê | Dono | Nó | Selo |
|---|---|---|---|---|
| 1 | Migrar o módulo de propostas para a `api-acos-vital`: feito para criar, listar, revisar, aprovar, cancelar, copiar e transformar (29/10). Falta a numeração só de dígitos (hoje `CO-{AV\|AU\|HRM}{AAAA}-{NNNN}-R{RR}`, formato decidido: só dígitos, ano mais sequência, N16-148 e PS-038; diverge da N16-04 e da N16-26, e a mudança é do Gustavo), versões, importação de itens e o cálculo no servidor | Robert, Gustavo | `V0.1` | ✅ rotas; 🔴 numeração e o resto (na validação local em Docker de 10/11/2026 o número saiu `CO-AV2026-0011-R00`) |
| 2 | Estado `APROVADA`, trava de ajuste e aprovar com a revisão: rotas, BFF e botão "Cliente aprovou" feitos (`av-hub` `AndamentoProposta.tsx:231`, `Cliente aprovou`). Falta conferir no banco a regra "incompleta" e pedir confirmação antes de travar | Robert, Nathan | `V0.4`, `V0.5` | ✅ API e tela; 🟡 confirmação |
| 3 | Cancelar com motivo: rota, BFF e botão feitos (`av-hub` `AndamentoProposta.tsx:241`, `Cancelar proposta`). Falta o histórico da comissão estimada | Robert | `V0C` | ✅ API e tela; 🔴 histórico |
| 4 | Botão "Transformar em pedido" e marcação da Qualidade obrigatória: rota `transformar` feita, com a Qualidade e o faturamento em partes obrigatórios (LOG-56), e o modal envia as seis respostas (PR #277 do av-hub, `TransformarModal.tsx:295`, `qualidade_acompanha: qualidadeAcompanha === 'sim'`). O envio ao Omie é síncrono, sem fila (N16-149). Falta a data por item no faturamento em partes | Robert (API), Nathan (tela), Gustavo (banco) | `V0.6`, `V0.7` | ✅ API e tela; 🔴 data por item |
| 5 | Pipeline: `IncluirPedido` por fila, espelho do `envioOrdensCompra.ts`, com `codigo_pedido_integracao` e `codigo_item_integracao`; gravar esses códigos no hub | Nathan | `V0.7` | 🔴 |
| 8 | Trocar a AwesomeAPI pela PTAX do hub: o front já lê o câmbio do Hub (`GET /cambio` para `/cotacoes_moeda/atual`, 27/10) | Robert | `V0.1` | ✅ (`av-hub`) front; ❓ API |
| 9 | Aprovar com perfil da Gerência no sistema | — | `V0.4` | próximo ciclo (N16-12) |
| 10 | `V0.3` em três partes (retrato abaixo, em "Como está o V0.3"): (a) trava de proposta incompleta na aprovação (item de revenda sem custo ou sem fornecedor; a fabricação fica fora, N16-166): banco, erro da API e selo "Incompleta" com o Aprovar desligado; (b) mostrar a comissão estimada ao vendedor (N16-10) ou mudar a regra (decisão do Nathan); (c) o motor na API (porta de `lib/simulador/motor.ts`), recalculando a cada salvamento e revisão em vez de gravar o que a tela manda | (a) Gustavo (banco), Robert (API e tela); (b) Nathan; (c) Robert, Gustavo, Nathan (`K1`) | `V0.2`, `V0.3`, `K1` | 🔴 (a) 🟡 (b) 🔴 (c) |
| 11 | Visão de Compras (leitura) e visão da Controladoria (custo real, drill-down por evento) da mesma tela | Nathan | `C6`, `C7`, `K4` | 🔴 |
| 14 | **Pipeline do Omie:** gravar os códigos de integração, ampliar o espelho e o envio da OC com os impostos, recurso novo de recebimento de NF-e, cancelamento e devolução da NF | Nathan, Gustavo | vários | 🔴 ([[Estudo-Omie-API]]) |
| 15 | Excluir proposta pelo Hub (`DELETE /comercial/propostas/{id}`, só nos status seguros) e status novo "Excluído no Omie" quando a pipeline apaga o pedido, com caminho de volta e trava no `exclusionSync`: `LOG-59` (`06-Contratos/Ativos/LOG-59-Exclusao-de-Proposta-e-Pedido-Excluido-no-Omie`)\|`LOG-59` (`06-Contratos/Ativos/LOG-59-Exclusao-de-Proposta-e-Pedido-Excluido-no-Omie`) (N16-167) | Gustavo (banco e API), Robert (front) | `V0.4`, `V0.6`, `V0.7` | 🔴 |

O item 15 (página do produto) está em [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2#Orçamento visto da proposta (B2 a B4)]].

Os itens 6 (liberação) e 13 (cancelamento) estão em [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].

## Pendências

| # | Pergunta | Dono |
|---|---|---|
| 1 | 📝 Alçada de desconto e margem: tudo fisicamente (N16-75; OQ-04 fechada) | Nathan (feito) |
| 2 | Perfis do Orçamento e de quem vê a equipe (OQ-21); o Moisés é uma das pessoas do setor (N16-104) | Nathan, Gustavo |
| 3 | Testes no Omie: campos obrigatórios, `numero_pedido` próprio, pedido bloqueado, `ExcluirPedido` (OQ-16, OQ-48). Roteiro: pedido mínimo, `ConsultarPedido`, comparar com um digitado à mão, `ExcluirPedido`, com cadastros TESTE. Espera a unidade, a categoria e a decisão da conta corrente | Nathan |
| 5 | Quem cadastra produto novo, e em quanto tempo (OQ-36) | Fiscal |

As pendências 4 e 8 (cancelamento) estão em [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].

As pendências 6 e 7 (aviso e e-mail de Compras) estão em [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].

Lista completa em [[Perguntas-Proposta-Pedido-Comissao]].

## Diagrama do subfluxo

```mermaid
flowchart TD
    subgraph SEC_VENDAS["Vendas · av-hub"]
        V01["V0.1 · Vendedor cria a proposta<br/>número automático CO-AV2026-0011-R00<br/>revisa até aprovar"]
        V02["V0.2 · Vendedor preenche o custo<br/>com o que conseguiu<br/>não é o dono do dado"]
        V03["V0.3 · Comissão estimada nasce<br/>tela como a do Simulador de Comissão<br/>item sem custo e sem fornecedor = incompleta"]
        V04["V0.4 · Gerência aprova desconto e margem<br/>aprovação física neste ciclo"]
        V05{"V0.5 · Vendedor marca aprovada?"}
        V0C["V0C · Proposta cancelada<br/>estado único, não reabre<br/>comissão estimada vira histórico"]
        V06["V0.6 · Transformar em pedido de venda<br/>obriga marcar se a Qualidade acompanha"]
        V07["V0.7 · Cria o pedido por API no Omie<br/>direto pela API, síncrono<br/>erro: Tentar novamente"]
        V1["V1 · Pedido de venda no av-hub<br/>da proposta: nasce liberado<br/>digitado no Omie: chega travado, vendas pronta"]
        V2["V2 · Vendedor marca se a Qualidade acompanha<br/>e se fatura em partes · pedido do Omie"]
        V3["V3 · Vendedor libera e preenche a parte de compras<br/>pedido do Omie"]
        V01 --> V02 --> V03 --> V04 --> V05
        V05 -->|não| V0C
        V05 -->|sim| V06 --> V07 --> V1
        V1 -->|"digitado no Omie, travado"| V2 --> V3
    end
    subgraph SEC_ORC["Orçamento · av-hub"]
        B2["B2 · Página do produto<br/>histórico, fornecedores, score, volatilidade, média"]
        B3["B3 · Pedido de cotação<br/>sem prazo, tempo cronometrado"]
        B4["B4 · Orçamentista cota e preenche o custo<br/>setor de Orçamento"]
        B3 --> B4
    end
    subgraph SEC_PCP["PCP · MES"]
        P1["P1 · Triagem do Pedido"]
        P3["P3 · Requisição de compra<br/>(origem PCP)"]
    end
    subgraph SEC_COMP["Compras · av-hub"]
        C6["C6 · Compras confere<br/>puxa da proposta impostos, frete, fornecedor<br/>edita no hub"]
        C7["C7 · Compras usa o valor correto na OC<br/>pode trocar de fornecedor<br/>a proposta não muda"]
        C8{"C8 · Compra acima do valor da proposta?<br/>por produto, sem tolerância"}
        C8A["Vendedor aprova ou reprova<br/>em Meus Pedidos, sem tempo limite"]
        C8R["Reprovado: Compras leva à Gerência<br/>fisicamente, resolve e notifica o vendedor"]
        C1["C1 · Cotação e negociação"]
        C4["C4 · Emite a Ordem de Compra<br/>aprovação C2 e C3 em 04-Circuito-de-Compra"]
    end
    subgraph SEC_CAN["Cancelamento"]
        CAN["Pedido cancelado<br/>requisição e OC não emitida cancelam sozinhas, com tarja<br/>OC e PCP avisados<br/>o comprado vai ao Estoque, livre"]
    end
    subgraph SEC_COM["Comissão · av-hub · Operações"]
        K1["K1 · Comissão estimada"]
        K2["K2 · Recalcula com o custo real"]
    end
    B2 -.->|"consulta, só leitura"| V02
    V02 -.->|"sem o dado, pede cotação"| B3
    B4 -->|"custo preenchido na proposta"| V03
    V03 --> K1
    V0C -.->|"vira histórico"| K1
    V1 -->|"da proposta: já liberado"| P1
    V3 --> P1
    P1 -.-> P3
    P3 --> C6 --> C1 --> C7 --> C8
    C8 -->|"não, ou mais barato (só informa)"| C4
    C8 -->|"sim"| C8A
    C8A -->|"aprova"| C4
    C8A -->|"reprova"| C8R --> C1
    C8R -.->|"se não resolve"| CAN
    C4 -.->|"custo real da OC"| K2
    K1 --> K2
    CAN -.->|"cancela a OC não emitida"| C4
```

Próxima raia no desenho: [[06-Circuito-de-Compra]] (para `P3`, `C6`, `C7`, `C8`) e [[02-Orcamento-Base-de-Preco]].
