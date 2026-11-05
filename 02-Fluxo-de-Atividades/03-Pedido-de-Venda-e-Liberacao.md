---
tags: [fluxo, raia, vendas, liberacao, av-hub, v1, v2, v3]
criado: 2026-10-14
estado-em: 2026-11-05
status: vigente
ordem: 3
nos: [V1, V2, V3]
anterior: "[[02-Orcamento-Base-de-Preco]]"
proxima: "[[04-PCP-Triagem-e-Destinacao]]"
develop-conferida: [api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Nathan
fontes: [LOG-26 (contrato de liberação), LOG-40 (escopo do vendedor), API-005, API-006, SQL-010, 00-Fluxo-Mestre-0b, v1 01-Fluxo-Operacional/Entrada-Comercial, v1 Fluxograma-Telas-por-Bloco bloco 1, v1 Fluxo-Sistema-no-Meio atos 1b e 17, api-acos-vital f322dcd, HUB b55ac55, api-pcp 579a625, app-pcp 1fca8d3, Dump Avhub 14/10]
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
8. Depois disso, o vendedor só acompanha. O cartão "Etapa dos itens" mostra em que etapa está cada item.

Os passos acima descrevem a liberação que **existe hoje** ✅ (`av-hub` `app/(protected)/vendas/liberar-pedidos/page.tsx` e `app/(protected)/liberacao-equipe/page.tsx`; `api-acos-vital` `src/schemas/core_vendas_faturamento/aggregates/pedidos_liberacao/pedidos_liberacao.route.js:89` e `:165`; `api-pcp` `src/pedidos/omie-integracao.ts:339-349`, a confirmação de importação).

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
- Só pedido incluído a partir da data de corte precisa de liberação. A carteira anterior não trava.
- O vendedor corrige a resposta até o MES importar. Depois, ela trava.
- O MES busca a lista. Ninguém empurra pedido para ele.
- O gerente só visualiza. Vendedor e auxiliar liberam.
- O vendedor vê só os pedidos dele. A API aplica isso pelo token de login.
- O pedido do Omie entra na liberação com os mesmos filtros da Carteira antiga.
- A resposta sobre Qualidade é guardada agora e usada depois, na fila de inspeção de processo. Essa fila ainda não existe.

## O que já existe e o que falta

- ✅ (`av-hub`, `api-acos-vital`) Telas Liberar Pedidos e Liberação da Equipe, e as rotas da API.
- ✅ (`api-pcp`) O MES lê os liberados, recusa pedido não liberado e confirma a importação, com reenvio automático.
- ✅ (`av-hub`) Cartão "Etapa dos itens" no detalhe do pedido.
- 🟡 Os 9 estados macro do vendedor não existem no código. Hoje ele vê a situação da liberação e 11 etapas por item.
- 🔴 Chave própria do MES, mapa de rotas por tela e teste do escopo do vendedor.
- 🔴 Renovar o token expirado, reabrir marcação depois da importação e alertar pedido parado.
- 🔴 Fila de inspeção de processo da Qualidade e refinos do cartão Etapa dos itens.
- 🔴 Pedido manual: o desenho só prevê pedido que chega do Omie.
- A `api-acos-vital` (`develop`, 29/10/2026) já cria, aprova, cancela e transforma a proposta em pedido do Hub.
- 🔴 A API **não envia o pedido ao Omie**, e a resposta de `V2`/`V3` na tela do pedido do Omie ainda não existe.
- ❓ Valor da data de corte em produção e migration `api005`.

Raia seguinte: [[04-PCP-Triagem-e-Destinacao]].

## Detalhe técnico

Nós do [[00-Fluxo-Mestre-0b]]: `V1` pedido chega do Omie travado, `V2` vendedor marca se a Qualidade acompanha, `V3` vendedor libera. Selos e convenções em [[Regras-do-Vault]].

Depois da liberação, esta raia continua como leitura: o vendedor acompanha o item pelo cartão **Etapa dos itens** (status por item que o MES informa, [[Contratos-da-v2|API-005]] e [[Contratos-da-v2|API-006]]).

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-1]]: Quem atua (onde) · Regras decididas · Estados · Telas · Endpoints e contratos · Como está no código
- [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2]]: Dados · Quem vê o quê · Pedido que nasce da proposta: liberação e cancelamento · O que falta desenvolver · Pendências · Diagrama do subfluxo
