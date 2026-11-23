---
tags: [comissao, motor-atual, core_comissionamento, proposta, validacao]
criado: 2026-10-16
estado-em: 2026-11-23
status: proposta
dono: Nathan
develop-conferida: [api-acos-vital ce4f90f, av-hub 7f0f7e2, em 2026-11-23, comissão por pedido, predominância, competência, escopo, trava e pré-aceita]
fontes: [dump core_comissionamento convertido (09-Diagramas/fontes), api-acos-vital f322dcd src/schemas/core_comissionamento, av-hub lib/simulador/motor.ts, av-hub app/(protected)/comissoes/simulador e analise-simuladores, av-hub app/api/comissoes, tela-simulador-comissao.png, N16-10, N16-11, N16-18, N16-19, N16-20, N16-185 a N16-190, PS-062, PS-063, PS-064, av-hub PRs #312, #313, #327, #331 a #334, api-acos-vital 7c05f92, 0244b1a, e363da5, 0e56354, 06bb146]
---

# Como o motor de comissão atual calcula

**Em uma frase:** hoje a comissão é decidida pelo pedido inteiro: a margem da revenda do pedido dá uma letra, essa letra (ou o percentual fixo da fabricação, se ela predomina) vale para todos os itens, e o pedido é pago pela versão de menor comissão entre a do vendedor e a de Compras, só sobre o que foi faturado.

**Quando consultar esta nota:** quando precisar saber como o Simulador de Comissão atual chega ao percentual e ao valor de cada nota. A Michele (Controladoria) confere o motor aqui. O módulo novo ([[03-Modelo-Novo-core_comissao]]) ainda foi desenhado por item e diverge deste motor (veja "O que muda no módulo novo").

## Como a comissão é calculada

**Em português:** o pedido inteiro recebe um percentual só. Ele sai da margem da revenda do pedido, ou do percentual fixo da fabricação quando a fabricação pesa mais na venda. Pedido no prejuízo não paga nada. O valor em reais é esse percentual sobre o faturado (N16-185, N16-186, N16-190).

1. O vendedor preenche o simulador do pedido, item a item: custo de compra, impostos e preço de venda.
2. O simulador calcula o custo líquido e a margem de cada item. A margem do item só informa qual linha puxa o pedido para baixo: ela não decide nada.
3. O simulador soma a revenda e calcula a **margem do pedido** (só revenda; a fabricação fica fora dos dois lados). Essa margem cai numa faixa, com uma letra e um percentual. 📝 N16-185
4. **Predominância:** se a fabricação passa de `pct_predominancia_fabricacao` (padrão 50%) da venda do pedido, todos os itens pagam o percentual fixo da fabricação (2%). Abaixo disso, todos pagam a letra da revenda, fabricação inclusive. Pedido só de fabricação paga o fixo. 📝 N16-186
5. **Prejuízo do pedido:** se a margem da revenda do pedido fica em zero ou abaixo, nenhum item paga. A revenda fica `PREJUIZO_PEDIDO` e a fabricação `FABRICACAO_BLOQUEADA` (a Controladoria pode liberar). `PREJUIZO` fica só para item sem preço de venda. 📝 N16-185
6. Alguns clientes têm regra fixa: um teto de percentual para os itens pagos pela letra.
7. Compras abre a simulação e, se o custo estiver errado, grava uma versão própria. O pedido inteiro é pago pela versão de **menor comissão** (a "pré-aceita"); no empate, vale a de Compras. 📝 N16-190
8. A comissão só vira dinheiro depois de faturar: valor faturado do item vezes o percentual da versão pré-aceita.
9. Bloqueio por nota fiscal (NF) zera a comissão daquela nota. Cliente ou vendedor na lista de bloqueio tira a nota do cálculo.

| Letra | Margem líquida da revenda do pedido | Percentual |
|---|---|---|
| A | 15% ou mais | 2,0% |
| B | 12% até menos de 15% | 1,3% |
| C | 9% até menos de 12% | 0,7% |
| D | 0% até menos de 9% | 0,5% |

## Exemplo

**Item fraco em pedido bom.** Pedido com dois itens de revenda: item 1 vende R$ 10.000 com lucro de R$ 2.500 (25%); item 2 vende R$ 5.000 com lucro de R$ 150 (3%). A margem do pedido é 2.650 ÷ 15.000 = 17,67%: letra A, 2%, nos dois itens. Comissão estimada: R$ 300,00. O item 2 sozinho daria letra D; pelo pedido, ele recebe a letra A.

**Predominância.** Pedido de R$ 10.000 com R$ 6.000 de fabricação (60%): a fabricação predomina e os dois lados pagam 2%, R$ 200,00. Com R$ 3.000 de fabricação (30%) e revenda com margem de 10% (letra C), os dois lados pagam 0,7%, R$ 70,00.

**Pré-aceita.** A versão do vendedor dá R$ 300 de comissão e a de Compras, com o custo corrigido, R$ 210. O pedido inteiro é pago pela versão de Compras, sobre o faturado. Antes de 23/11 valia o menor percentual item a item, que podia misturar as duas versões.

**Várias notas.** Venda de R$ 1.000 a 2%, faturada em seis notas: 2% sobre cada nota, R$ 20 no total ([[15-Custo-Real-e-Comissao]]).

## Quem faz o quê hoje

| Quem | O que faz |
|---|---|
| Vendedor | Preenche, salva rascunho e envia o simulador do pedido. Depois de enviar, só cria versão nova se Compras devolver (N16-188) |
| Compras | Aprova a simulação como está, cria uma versão com os custos corrigidos ou devolve ao vendedor |
| Analista e Gerência | Acompanham o mês na Visão Geral, por pedido e por competência, confirmam a predominância e bloqueiam NF |
| Coordenador | Recebe ajuda de custo mais um percentual do faturamento total do mês |

O vendedor só vê o valor em reais depois que Compras aprova, e só a comissão do vínculo próprio (N16-189). Hoje quem valida é Compras: não existe etapa de Controladoria.

## Outras regras em uma linha

- **Competência:** a comissão é vista e filtrada pelo mês em que é paga (`competencia=AAAA-MM`), não pelo mês de emissão. Nota desbloqueada depois do fechamento vai para o mês ainda aberto (N16-187).
- **Regra fixa:** o teto muda conforme o markup bruto do pedido (venda menos compra, dividido pela compra).
- **Bloqueio por NF:** o número da nota é digitado com zeros à esquerda. Sem os zeros, o bloqueio não casa e ninguém é avisado.
- **Coordenadores:** total = ajuda de custo mais percentual sobre o faturamento do mês. O bloqueio por NF não vale para eles.
- **Parâmetros:** faixas, impostos, despesas e o corte da predominância ficam em tabela com vigência. Hoje é "Maio/23", nas três unidades. O corte não tem tela (PS-063).
- **Encargo da condição de pagamento:** a proposta e a simulação levam o encargo da condição do Omie (`encargo_pagamento`); sem ele, o motor procura a condição na tabela da vigência. ✅ `av-hub` `lib/simulador/motor.ts:209` (`const encargoInformado = entrada.encargo_pagamento ?? null;`) e `:250` (`const encargo = encargoInformado ??`). Fora de 0 a 100%, o motor recusa (`:211`, `O encargo da condição de pagamento deve ficar entre 0% e 100%.`).

## O que muda no módulo novo

- O percentual de Compras deixa de ser digitado. Ele passa a ser calculado sozinho, a cada evento de custo.
- A Controladoria decide no final, com justificativa. O vendedor só vê o valor real depois da decisão.
- O passo "Compras aprova o percentual" fica pronto no sistema, mas desligado (N16-51).
- O cálculo sai do navegador. Hoje ele roda só lá e a API apenas grava (BL-078 🔴).
- ⚠️ O desenho do módulo novo ainda é **por item** (letra por item e `LEAST` entre cotado e real item a item). O motor atual passou a ser **por pedido** (N16-185, N16-186, N16-190). As divergências estão em [[03-Modelo-Novo-core_comissao]].

O desenho completo está em [[03-Modelo-Novo-core_comissao]] e os estados em [[04-Regras-e-Estados-da-Comissao-Nova]].

## Pontos de atenção

1. ✅ O resumo mensal passa a mostrar o valor bloqueado (o pré-aceito das notas bloqueadas). A migration está no tst ([[Dump-AvHub-Teste-2026-11-23]]); produção ❓ (PS-062).
2. O teto da regra fixa só é aplicado pela view. O motor da tela não o recebe. ✅
3. Bloqueio e listas de bloqueio não têm data nem motivo obrigatório. Valem para sempre, até sobre meses pagos. ✅
4. Quem aprova não é separado de quem digita. A tela esconde o botão, mas o servidor não barra. ✅
5. Nada reconfere o custo líquido gravado, porque só o navegador o calcula. ✅
6. As seis migrations da comissão de 18 a 23/11 estão fora do repositório. Estão no tst ✅ ([[Dump-AvHub-Teste-2026-11-23]]), mas não no dump de produção de 18/11: sem elas as rotas novas falham (PS-062) ❓.
7. Minhas Comissões no Hub ainda não mostra `DEVOLVIDO` e fala em 403 onde a API já responde vazio (PS-064).

A lista completa está no detalhe técnico.

## O que a Michele precisa confirmar

Ela respondeu em 19/10/2026 (N16-42 a N16-51). Onde a resposta difere do padrão proposto, vale a resposta. A comissão por pedido e a predominância vieram depois, a pedido do Robert (18 e 19/11): o motor aplica e sinaliza, e a Controladoria confirma ao aprovar. Em resumo:

- Decidem Controladoria, Gerência e Coordenação, sem teto (M10).
- O vendedor lê a justificativa (M11).
- Só entram as peças com custo real (M12).
- Cancelamento e devolução abatem na mesma proporção (M13).

As perguntas M01 a M19, com os padrões, estão no detalhe técnico.

## Detalhe técnico

Esta nota explica, em linguagem simples, **o que o módulo Comissões de hoje faz**. Serve para a Michele (Controladoria) conferir. A lista de perguntas está no fim, em "O que a Michele precisa confirmar".

Como ler: **✅** está na `develop` ou no banco (com arquivo e linha) · **📝** decisão · **🟡** parcial na `develop` · **🔴** não está na `develop` · **❓** não conferido. Nos números, `dump` é `09-Diagramas/fontes/core_comissionamento-dump-convertido.sql` (anterior ao grão por pedido).

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[01-Motor-Atual-Como-Calcula-Detalhe-Tecnico-1]]: Resumo em dez linhas · Visão do fluxo atual · 1. Quem faz o quê hoje · 2. Regra a regra
- [[01-Motor-Atual-Como-Calcula-Detalhe-Tecnico-2]]: 2. Regra a regra (continuação: R17 e R18) · 3. Onde o custo líquido é calculado e a fórmula exata (N16-20) · 4. O passo "Comissão: após a aprovação de Compras" e onde ele entra no fluxo novo · 5. Pontos de atenção que achei · O que a Michele precisa confirmar
