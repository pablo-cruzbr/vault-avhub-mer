---
tags: [fluxo, raia, custo-real, comissao, k1, k2, k3, k4, k5, k6, controladoria, simulador, tela, devolucao, apuracao]
criado: 2026-10-16
estado-em: 2026-11-13
status: proposta
ordem: 15
nos: [K1, K2, K3, K4, K5, K6]
anterior: "[[14-Fiscal-Omie]]"
develop-conferida: [api-acos-vital e522962, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13, reteste por cliques e Da proposta à comissão; av-hub d82d58b, em 2026-11-12, só o encargo da condição (PR #291); api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, app-pcp 4c11886, omie-elt-pipeline master 0593c9f, em 2026-11-10; av-hub a43befe, em 2026-11-12, só a aprovação do vendedor (LOG-57)]
dono: Nathan (fluxo) · Gustavo (banco e API) · Robert (custo no MES) · Michele (decisão da comissão)
fontes: [Registro-de-Decisoes (N16-09 a N16-11, N16-17 a N16-23, N16-34 a N16-51, N16-57, N16-71, N16-74), Proposta-Orcamento-Comissao/01-Decisoes/Respostas-da-Controladoria-2026-10-19 (fora do vault), Proposta-Orcamento-Comissao/01-Decisoes/Respostas-de-Compras-2026-10-19 (fora do vault), Estudo-Omie-API, 09-Diagramas/fontes/tela-simulador-comissao.png, av-hub comissoes/simulador/page.tsx e lib/simulador/motor.ts, 03-Sistemas/Comissao/01-Motor-Atual-Como-Calcula, 00-Fluxo-Mestre-0b, 03-Estoque-Atendimento-e-Despacho, 04-Circuito-de-Compra, Modelo-Estoque-e-Custo-do-Lote, API-008, LOG-47, 10-Anexo-Fora-do-Fluxo/Comissoes, api-pcp (estoque.prisma, compras.service.ts), 09-Diagramas/artifact-proposta-pedido.html, api-pcp develop de 27/10/2026 (GET /itens/custo, custo da OC), N16-143, N16-144, BL-067, BL-088, OQ-51, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Custo real e comissão no fluxo (K1 a K6)

**Em uma frase:** o vendedor estima a comissão na proposta, o custo real vai chegando conforme compras, estoque e produção acontecem, e a Controladoria decide a comissão final quando a nota sai.

**Quando consultar:** dúvidas sobre dinheiro do pedido: comissão estimada, custo real que chega ao longo do fluxo e a comissão final.

**Onde estamos no fluxo:** ← [[14-Fiscal-Omie]] | fim do fluxo → · nós desta nota: `K1`, `K2`, `K3`, `K4`, `K5`, `K6`

O fluxo novo ainda é proposta: não há API nem tela dele. O que já existe é o motor atual e telas de referência (veja "O que já existe e o que falta"). Esta nota mostra só o fluxo. Os modelos de dados estão em [[03-Modelo-Novo-core_comissao]]. Decisões: [[Registro-de-Decisoes]]. Selos: [[Regras-do-Vault]].

## Como funciona, passo a passo

1. O vendedor monta a proposta e o sistema estima a comissão pelo motor atual. Ele só vê a estimativa que ele mesmo colocou. `K1`
2. Cada compra, lote do Estoque ou matéria-prima da produção gera uma linha de custo real, com as condições do próprio evento. `K2`
3. Enquanto o custo do item não cobre a quantidade, o custo é parcial. Só as peças com custo real entram na comissão. `K2`
4. No recebimento, o valor da nota de entrada substitui o valor da ordem de compra (OC). `K2`
5. Se a compra sai mais cara que a proposta, o vendedor aprova ou reprova a compra do produto dele. O preço de venda não muda. `C8`
6. Quando o Omie emite a nota, a comissão fecha com o percentual vigente naquele momento e chega à Controladoria já calculada. `K3`
7. Controladoria, Gerência ou Coordenação decidem: aprovar, desaprovar, bloquear, desbloquear, cortar ou alterar. Sempre com justificativa. `K4`
8. Só depois da decisão o vendedor vê a comissão real e o motivo. Desaprovada aparece com R$ 0. `K5`
9. Se a nota for cancelada, devolvida ou recusada, a comissão é abatida na mesma proporção. `K6`

Se o custo completar depois da decisão, a diferença vai para a apuração seguinte, para nova decisão.

## Exemplo

Um pedido com 50 flanges (item A). Na proposta, o vendedor cotou R$ 100 por flange. A compra fechou a R$ 150 por flange, em várias OCs. Os R$ 100 e os R$ 150 vêm do exemplo do Nathan.

- No início, a Controladoria vê custo parcial e a diferença contra o cotado.
- O vendedor aprova ou reprova a compra mais cara. Se aprova, a margem e a comissão caem.
- A nota sai e a comissão chega à Controladoria. Ela aprova ou corta, com justificativa.
- O vendedor do Cliente Exemplo S.A. passa a ver o valor real e o porquê.
- Se o cliente devolver parte das flanges, o Fiscal ou a Controladoria informam quantas voltaram. A comissão cai na proporção.

## Quem atua

| Quem | O que faz |
|---|---|
| Vendedor | Estima a comissão; aprova ou reprova compra acima do valor; vê a real depois da decisão |
| Controladoria | Acompanha o custo real, decide a comissão e informa o que voltou nas devoluções parciais |
| Gerência e Coordenação | Mesmas permissões de decisão da Controladoria |
| Compras | Fornece o custo real pela OC e pela nota de entrada |
| Fiscal | Informa, com a Controladoria, o que voltou numa devolução parcial |

## Regras que valem

- Controladoria, Gerência e Coordenação decidem sem teto. Ninguém decide a própria comissão.
- Toda decisão tem justificativa, autor, data e valores anterior e novo.
- O vendedor vê a comissão real só depois da decisão.
- Com custo parcial, só as peças com custo real entram na comissão.
- Cada nota fecha com o percentual vigente. Nunca se paga duas vezes a mesma peça.
- A nota de entrada manda: ela substitui o valor da OC.
- O encargo da condição de pagamento entra no preço sugerido, não no custo.
- ✅ O encargo é o da condição de pagamento do Omie, gravado na proposta e na simulação (`encargo_pagamento`, de 0 a 100%). O motor usa esse valor e só procura a condição na tabela da vigência quando ele falta, como nas propostas gravadas antes do campo: `av-hub` `lib/simulador/motor.ts:230` (`const encargo = encargoInformado ??`). A tela está em [[01-Proposta-de-Venda]].
- Cancelamento, devolução ou recusa abatem a comissão. Se já foi paga, o desconto entra na próxima apuração.
- Devolução total vem do Omie. Na parcial, o Fiscal ou a Controladoria informam o que voltou.
- O imposto por item da OC vem da parte de compras do pedido (finalidade `pedidos_venda` ou `recompra`) ou é digitado (`estoque`, `uso_interno`). Uma linha por pedido, sem média. O frete é rateado pelo valor. A fórmula do custo com imposto segue o motor do comissionamento (N16-144). O contrato só será escrito quando o desenvolvimento começar.

Onde os dados ficam (decisões de 29/10/2026, bloco N16-120 a N16-143):

- A comissão nova fica em `core_comissao`, schema próprio, já modelado e testado (N16-143). O schema não está no banco de teste do av-hub (dado do tst, visto na validação local em Docker de 10/11/2026), e a `api-acos-vital` não o usa; ali só existe o `core_comissionamento` do motor atual.
- Proposta, pedido e custo realizado vão para `core_vendas_faturamento`: a N16-116 decide que não existirá `core_comercial`. O código ainda diverge (veja abaixo).

## O que já existe e o que falta

- ✅ (`api-acos-vital`) Motor atual de comissão, só leitura aqui.
- ✅ (`av-hub`) Simulador de Comissão, usado como referência da tela nova.
- 🟡 Tela "Custo real por item" existe, sem imposto, e lê o custo real do MES (os dados de exemplo só entram se a API falhar fora de produção). O problema é o acesso e a filial (BL-088, em [[Backlog-por-Frente]]): a rota tem escopo de vendedor, e na validação local em Docker de 10/11/2026 até o perfil de testes recebeu 403 no pedido de outro vendedor; só o perfil de testes tem a tela; e o campo "Filial (opcional)" é obrigatório e pede o UUID da unidade digitado. Quem deve ver o custo real, e com qual escopo, é a OQ-51 ([[Perguntas-Proposta-Pedido-Comissao]]).
- 🔴 Custo do item fabricado: chega ao Hub com custo 0 (BL-067). A validação local em Docker de 10/11/2026 confirmou: o item fabricado ficou sem custo, embora a matéria-prima consumida tivesse custo da OC; o de revenda chegou completo.
- 🟡 Módulo novo em `core_comissao`: modelado e testado num Postgres à parte, sem API nem tela. Não está no banco de teste (tst) de 10/11/2026.
- ⚠️ ❓ Schema: o código e o dump de 29/10 da `api-acos-vital` já usam `core_comercial.propostas` e `core_comercial.fn_proposta_*` (e o dump do banco de teste de 04/11/2026 também tem o pedido do Hub em `core_comercial.pedidos_venda`), contra a N16-116 (`core_vendas_faturamento`). A divergência está aberta com o Nathan e o Gustavo.
- 🟡 **Da proposta à comissão (pedido do Robert, 13/11/2026; `api-acos-vital` `8265223`).** A simulação v1 do transformar nasce `RASCUNHO`, e não mais `ENVIADO` (`src/schemas/core_comercial/aggregates/propostas/propostas.route.js:664` (`a v1 nasce RASCUNHO`)). A simulação do vendedor só vai a `ENVIADO` com o pedido faturado (NF válida): sem nota, 409 `PEDIDO_SEM_FATURAMENTO` (`src/schemas/core_comissionamento/tables/simulacoes/simulacoes.route.js:141` (`const semFaturamento`)); o rascunho continua livre, e a origem `COMPRAS` não muda. `GET /pedido_venda_itens/{numero_pedido}` ganhou o campo `faturado`, da mesma função do banco (`src/schemas/core_vendas_faturamento/views/vw_pedido_venda_itens/vw_pedido_venda_itens.route.js:111` (`async function pedidoFaturado`)). O `codigo_item` de cada linha do Omie passa ao pedido do Hub e à simulação (`src/schemas/core_comercial/pedidoOmie.js:159` (`async function gravarItensDoOmie`)). As funções (`fn_pedido_faturado`, `fn_pedido_venda_itens_omie_gravar`) vêm da migration `2026-11-13_comercial_proposta_pedido_comissao`, que não está no dump do banco de teste de 13/11 (09:40) nem no Docker local: código na `develop`, banco pendente.
- 🔴 Comissão estimada na proposta (`K1`).
- 🔴 Custo real por evento, com a nota de entrada como verdade (`K2`).
- 🔴 Tela da Controladoria, relatórios e visão geral (`K4`).
- ✅ Aprovação do vendedor na compra acima do valor (LOG-57, 12/11): a OC espera e o vendedor aprova ou reprova em Meus Pedidos (`av-hub` `components/Pedidos/DivergenciasDoVendedor.tsx:76`, `Para você responder`). A divergência aprovada é a fonte do custo aprovado pelo vendedor; a margem considerada no aviso e o uso na comissão real vêm com o BL-078 🔴.
- 🔴 Pendência de devolução parcial e apuração do vendedor. A pendência de devolução parcial já está no banco (no modelo de `core_comissao`); falta API e tela.
- ❓ Sobra aproveitável de chapa (OQ-32) e devolução de compra ao fornecedor (OQ-42).

## Detalhe técnico

O custo realizado por item fica em `core_vendas_faturamento` e a comissão nova em `core_comissao` (testado em Postgres 18 com as respostas da Controladoria); o modelo está explicado em [[03-Modelo-Novo-core_comissao]].

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[15-Custo-Real-e-Comissao-Detalhe-Tecnico-1]]: Os nós K1 a K6 · Como o custo real atravessa o fluxo · O exemplo do Nathan · As condições de cada evento de custo (N16-20)
- [[15-Custo-Real-e-Comissao-Detalhe-Tecnico-2]]: A tela da comissão: três visões da mesma tela (N16-19) · Casos de borda do custo real · Estados da comissão · Quem vê o quê · Estado no código e o que falta · Diagrama do subfluxo
