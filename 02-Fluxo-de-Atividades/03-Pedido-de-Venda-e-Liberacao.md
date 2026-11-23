---
tags: [fluxo, raia, vendas, liberacao, av-hub, v1, v2, v3]
criado: 2026-10-14
estado-em: 2026-11-13
status: vigente
ordem: 3
nos: [V1, V2, V3]
anterior: "[[02-Orcamento-Base-de-Preco]]"
proxima: "[[04-PCP-Triagem-e-Destinacao]]"
develop-conferida: [api-acos-vital e522962, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13, reteste por cliques e Da proposta à comissão; av-hub c6310ad, em 2026-11-13, só o histórico na tela; omie-elt-pipeline develop d8fddca, em 2026-11-12, só o histórico do pedido; api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, em 2026-11-10; app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Nathan
fontes: [LOG-26 (contrato de liberação), LOG-40 (escopo do vendedor), API-005, API-006, SQL-010, 00-Fluxo-Mestre-0b, v1 01-Fluxo-Operacional/Entrada-Comercial, v1 Fluxograma-Telas-por-Bloco bloco 1, v1 Fluxo-Sistema-no-Meio atos 1b e 17, api-acos-vital f322dcd, HUB b55ac55, api-pcp 579a625, app-pcp 1fca8d3, Dump Avhub 14/10, api-acos-vital develop cc3fbb3 (pedidos_liberacao.route.js, pedidoOmie.js), av-hub develop 44bb770 (EtapaDosItens.tsx, LiberarPedidosLista.tsx, AndamentoProposta.tsx), api-pcp develop 2e564e6 (omie-integracao.ts), validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Raia Vendas: liberação do pedido (V1 a V3)

**Em uma frase:** o pedido de venda só segue para a produção depois que o vendedor o libera. É o portão do fluxo e a única entrada de pedido de venda no MES: sem liberação, o PCP (planejamento e controle da produção) não enxerga o pedido.

**Quando consultar:** dúvidas sobre o pedido de venda: o portão de liberação, o cancelamento e o que o MES enxerga do pedido.

**Onde estamos no fluxo:** ← [[02-Orcamento-Base-de-Preco]] | [[04-PCP-Triagem-e-Destinacao]] → · nós desta nota: `V1`, `V2`, `V3`

## Como funciona, passo a passo

1. O pedido nasce no Omie (o sistema de gestão) e chega ao av-hub **travado**. `V1`
2. O vendedor, ou o auxiliar dele, abre a tela Liberar Pedidos, na aba "Aguardando você".
3. Ele responde: a Qualidade acompanha esse pedido desde o início? Sim ou Não. `V2`
4. Ele libera **na mesma ação** da resposta. `V3`
5. Até o PCP importar o pedido, o vendedor ainda pode corrigir a resposta.
6. O MES (sistema de chão de fábrica) consulta a lista de liberados. Ninguém empurra o pedido para ele. `P1`
7. Quando o PCP grava as ordens, o MES avisa o av-hub. O pedido vira "No PCP" e a resposta trava, com um cadeado. `P2`
8. Depois disso, o vendedor só acompanha. O cartão "Andamento na produção", no detalhe do pedido, mostra em que etapa está cada item.

Os passos acima descrevem a liberação que **existe hoje** ✅ (`av-hub` `app/(protected)/vendas/liberar-pedidos/page.tsx` e `app/(protected)/liberacao-equipe/page.tsx`; `api-acos-vital` `src/schemas/core_vendas_faturamento/aggregates/pedidos_liberacao/pedidos_liberacao.route.js:97` (`router.get("/"`) e `:173` (`router.put("/:codigo_empresa/:numero_pedido"`); `api-pcp` `src/pedidos/omie-integracao.ts:343` (`marcarPedidoImportadoIntegracao`), a confirmação de importação). A validação local em Docker de 10/11/2026 percorreu esses passos com o pedido 28189: liberou com "Sim" na mesma ação, corrigiu para "Não" antes da importação, e depois da importação pelo MES a resposta travou (409 `PEDIDO_IMPORTADO_MES`).

### O pedido pode vir de dois lugares (desenho decidido)

O desenho aprovado em 26/10/2026 (decisões de 16 a 26/10/2026) põe a proposta antes do `V1`. São duas origens no mesmo fluxo 📝 (N16-05, N16-91, N16-106):

- **Pedido que nasce da proposta:** já vem liberado. O vendedor responde a Qualidade no botão "Transformar em pedido". Detalhe em [[01-Proposta-de-Venda]].
- **Pedido digitado no Omie:** continua chegando travado. O vendedor responde a Qualidade e o faturamento em partes na tela do pedido. Ali ele também preenche a parte de compras, sem travar o fluxo.

Nas duas origens, a liberação gravada é a mesma desta nota, e é ela que o MES lê. Esse desenho ainda não está todo pronto (veja "O que já existe e o que falta").

## Exemplo

O Cliente Exemplo S.A. pede 100 flanges, e o pedido é digitado no Omie. Ele chega ao av-hub travado, na aba "Aguardando você". O vendedor marca "Sim" (a Qualidade acompanha) e libera. O PCP abre a Triagem e vê os 100 flanges. Quando o PCP grava as ordens, o pedido passa para "No PCP" e a marcação trava.

## Quem atua

| Quem | O que faz |
|---|---|
| Vendedor | Marca Sim ou Não e libera os pedidos dele |
| Auxiliar do titular | Libera pelos titulares que ele auxilia |
| Gerente | Só vê todos os pedidos da liberação; descobre quem está segurando pedido |
| PCP | Usa os pedidos liberados; não marca nada |
| Gustavo (DBA), Nathan, Robert | Banco e API, telas do av-hub, e lado MES |

## Regras que valem

- Só pedido liberado vai ao MES. Sem liberação, o PCP não vê o pedido.
- A resposta e a liberação são uma ação só.
- A regra vale por pedido. As parciais criadas depois herdam a resposta.
- Só pedido incluído a partir da data de corte precisa de liberação. A carteira anterior não trava. A data de corte é um dado do banco (`parametros_vendas.data_inicio_liberacao`), não do código: no banco de teste é **01/09/2026**, e a tela Liberar Pedidos mostra essa data no rodapé (validação local em Docker de 10/11/2026, com os dados do tst).
- O vendedor corrige a resposta até o MES importar. Depois, ela trava.
- O MES busca a lista. Ninguém empurra pedido para ele.
- O gerente só visualiza. Vendedor e auxiliar liberam.
- O vendedor vê só os pedidos dele. A API aplica isso pelo token de login.
- O pedido do Omie entra na liberação com os mesmos filtros da Carteira antiga.
- A resposta sobre Qualidade é guardada agora e usada depois, na fila de inspeção de processo. Essa fila ainda não existe.

## O que já existe e o que falta

- ✅ (`av-hub`, `api-acos-vital`) Telas Liberar Pedidos e Liberação da Equipe, e as rotas da API.
- ✅ (`api-pcp`) O MES lê os liberados, recusa pedido não liberado e confirma a importação, com reenvio automático.
- ✅ (`av-hub`) Cartão "Andamento na produção" no detalhe do pedido (`av-hub` `components/Pedidos/EtapaDosItens.tsx:61`, `<h2>Andamento na produção</h2>`; o arquivo guarda o nome antigo "Etapa dos itens").
- ✅ (`omie-elt-pipeline`) Cada mudança de situação e de previsão de faturamento do pedido que vem do Omie fica gravada em `pedidos_vendas_status_historico` (PR #6 da pipeline, 12/11/2026): `src/omie/resources/pedidosVendas.ts:53` (`async function registrarHistoricoPedido(`). Tinha parado na reescrita da pipeline; ver [[Pipeline-Omie]].
- ✅ (`av-hub`) O histórico do pedido na tela diz "Registrado como" na primeira linha, em vez de mostrar uma mudança sem valor anterior (`components/Pedidos/PedidoDetalhe/HistoricoPedido.tsx:51` (`Registrado como`), PR #285).
- 🟡 **Pedido de proposta liberado sozinho para o MES (pedido do Robert, 13/11/2026).** Quando o Omie aceita o pedido do Hub, o registro do sucesso passa a liberar o pedido para o MES, sem a Liberar Pedidos: `api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:598` (`da proposta é liberado para o MES sozinho`) e `src/schemas/core_comercial/pedidoOmie.js:20` (`desde 13/11 a liberação automática`). A regra fica no banco (`fn_pedido_venda_omie_registrar`), na migration `2026-11-13_comercial_proposta_pedido_comissao`, que não está no dump do banco de teste de 13/11 (09:40) nem no Docker local: código na `develop`, banco pendente. Responde em parte a pergunta T-07 (liberação automática). O pedido que nasce no Omie continua passando pela Liberar Pedidos.
- 🟡 Os 9 estados macro do vendedor não existem no código. Hoje ele vê a situação da liberação e 11 etapas por item.
- 🔴 Chave própria do MES, mapa de rotas por tela e teste do escopo do vendedor.
- 🔴 Renovar o token expirado, reabrir marcação depois da importação e alertar pedido parado.
- 🔴 Fila de inspeção de processo da Qualidade e refinos do cartão "Andamento na produção".
- 🔴 Pedido manual: o desenho só prevê pedido que chega do Omie.
- A `api-acos-vital` (`develop`, 29/10/2026) já cria, aprova, cancela e transforma a proposta em pedido do Hub.
- 🟡 O envio do pedido da proposta ao Omie existe no código da API (`api-acos-vital` `src/schemas/core_comercial/pedidoOmie.js:239`, `call: "IncluirPedido"`) e a tela da proposta já o chama, e o banco dessa função está no banco de teste (dump de 10/11; o DDL fica com o DBA, N16-155); detalhe em [[01-Proposta-de-Venda]]. 🔴 A resposta de `V2`/`V3` na tela do pedido do Omie ainda não existe.
- ❓ Valor da data de corte em produção (no banco de teste é 01/09/2026) e migration `api005`.

Raia seguinte: [[04-PCP-Triagem-e-Destinacao]].

## Detalhe técnico

Nós do [[00-Fluxo-Mestre-0b]]: `V1` pedido chega do Omie travado, `V2` vendedor marca se a Qualidade acompanha, `V3` vendedor libera. Selos e convenções em [[Regras-do-Vault]].

Depois da liberação, esta raia continua como leitura: o vendedor acompanha o item pelo cartão **Andamento na produção** (no código, `EtapaDosItens.tsx`; status por item que o MES informa, [[Contratos-da-v2|API-005]] e [[Contratos-da-v2|API-006]]).

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-1]]: Quem atua (onde) · Regras decididas · Estados · Telas · Endpoints e contratos · Como está no código
- [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2]]: Dados · Quem vê o quê · Pedido que nasce da proposta: liberação e cancelamento · O que falta desenvolver · Pendências · Diagrama do subfluxo
