---
tags: [comissao, motor-atual, core_comissionamento, proposta, validacao]
criado: 2026-10-16
atualizado: 2026-10-29
status: proposta
dono: Nathan
fontes: [dump core_comissionamento convertido (09-Diagramas/fontes), api-acos-vital f322dcd src/schemas/core_comissionamento, av-hub lib/simulador/motor.ts, av-hub app/(protected)/comissoes/simulador e analise-simuladores, av-hub app/api/comissoes, tela-simulador-comissao.png, N16-10, N16-11, N16-18, N16-19, N16-20]
---

# Como o motor de comissão atual calcula

**Em uma frase:** hoje o vendedor simula a margem de cada item, Compras confere o custo, e a comissão é o menor entre os dois percentuais, paga só sobre o que foi faturado.

**Quando consultar esta nota:** quando precisar saber como o Simulador de Comissão atual chega ao percentual e ao valor de cada nota. A Michele (Controladoria) confere o motor aqui antes de ele ir para a proposta. Nada do módulo atual é alterado ([[Registro-de-Decisoes]], N16-11: o motor novo é o mesmo).

## Como a comissão é calculada

**Em português:** a comissão de cada item é o **menor** entre o percentual do vendedor e o percentual de Compras, depois das regras fixas e dos bloqueios. O valor em reais é esse percentual aplicado sobre o que foi faturado.

1. O vendedor preenche o simulador do pedido, item a item: custo de compra, impostos e preço de venda.
2. O simulador calcula a margem líquida de cada item. Cada margem cai numa faixa, com uma letra e um percentual.
3. Compras abre a mesma simulação e corrige o custo para o valor real. Isso gera o percentual de Compras.
4. Vale o menor dos dois. Custo real melhor que o cotado não aumenta a comissão.
5. Alguns clientes têm regra fixa: um teto de percentual.
6. Item de fabricação interna paga 2% fixo. Item em prejuízo paga 0%.
7. A comissão só vira dinheiro depois de faturar: valor faturado do item vezes o percentual final.
8. Bloqueio por nota fiscal (NF) zera a comissão daquela nota. Cliente ou vendedor na lista de bloqueio tira a nota do cálculo.

| Letra | Margem líquida do item | Percentual |
|---|---|---|
| A | 15% ou mais | 2,0% |
| B | 12% até menos de 15% | 1,3% |
| C | 9% até menos de 12% | 0,7% |
| D | 0% até menos de 9% | 0,5% |

## Exemplo

**Um item.** 50 flanges custam R$ 100 cada, com ICMS de 12% e frete por rateio. O custo líquido fica em R$ 4.471,95. Vendidas a R$ 230 cada (R$ 11.500), a margem líquida é 29,41%. É letra A, 2%. A comissão estimada é R$ 230,00.

**Menor dos dois.** No pedido 27917, o vendedor deu letra A (2,0%) ao item 1. Compras refez o custo e ele caiu para letra C (0,7%). Vale **0,7%**. O item 2 ficou em 2,0% nos dois e vale **2,0%**.

**Várias notas.** Exemplo da Michele: venda de R$ 1.000 a 2%, faturada em seis notas (500, 100, 100, 100, 100 e 100). A comissão é 2% sobre cada nota, R$ 20 no total. O caso está em [[15-Custo-Real-e-Comissao]].

## Quem faz o quê hoje

| Quem | O que faz |
|---|---|
| Vendedor | Preenche, salva rascunho e envia o simulador do pedido |
| Compras | Aprova a simulação como está ou cria uma versão com os custos corrigidos |
| Analista e Gerência | Acompanham o mês na Visão Geral e bloqueiam NF |
| Coordenador | Recebe ajuda de custo mais um percentual do faturamento total do mês |

O vendedor só vê o valor em reais depois que Compras aprova. Hoje quem valida é Compras: não existe etapa de Controladoria. Isso muda no módulo novo (N16-10).

## Outras regras em uma linha

- **Prejuízo:** item de revenda sem lucro paga 0%, qualquer que seja a letra.
- **Regra fixa:** o teto muda conforme o markup bruto do pedido (venda menos compra, dividido pela compra).
- **Bloqueio por NF:** o número da nota é digitado com zeros à esquerda. Sem os zeros, o bloqueio não casa e ninguém é avisado.
- **Coordenadores:** total = ajuda de custo mais percentual sobre o faturamento do mês. O bloqueio por NF não vale para eles.
- **Parâmetros:** faixas, impostos e despesas ficam em tabela com vigência. Hoje é "Maio/23", nas três unidades.
- **Encargo da condição de pagamento:** desde 12/11/2026 a proposta e a simulação levam o encargo da condição do Omie (`encargo_pagamento`). O motor usa esse valor; sem ele (simulação antiga), procura a condição na tabela da vigência, como antes. ✅ `av-hub` `lib/simulador/motor.ts:189` (`const encargoInformado = entrada.encargo_pagamento ?? null;`) e `:230` (`const encargo = encargoInformado ??`), commit `d82d58b` (PR #291). Fora de 0 a 100%, o motor recusa (`:191`, `O encargo da condição de pagamento deve ficar entre 0% e 100%.`).

## O que muda no módulo novo

- O percentual de Compras deixa de ser digitado. Ele passa a ser calculado sozinho, a cada evento de custo.
- A Controladoria decide no final, com justificativa. O vendedor só vê o valor real depois da decisão.
- O passo "Compras aprova o percentual" fica pronto no sistema, mas desligado (N16-51).
- O cálculo sai do navegador. Hoje ele roda só lá e a API apenas grava.

O desenho completo está em [[03-Modelo-Novo-core_comissao]] e os estados em [[04-Regras-e-Estados-da-Comissao-Nova]].

## Pontos de atenção

1. O resumo mensal mostra "bloqueado" sempre R$ 0, mesmo com NF bloqueada. ✅
2. O teto da regra fixa só é aplicado pelo banco. O motor da tela não o recebe. ✅
3. Bloqueio e listas de bloqueio não têm data nem motivo obrigatório. Valem para sempre, até sobre meses pagos. ✅
4. Quem aprova não é separado de quem digita. A tela esconde o botão, mas o servidor não barra. ✅
5. Nada reconfere o custo líquido gravado, porque só o navegador o calcula. ✅

A lista completa, com 14 pontos, está no detalhe técnico.

## O que a Michele precisa confirmar

Ela respondeu em 19/10/2026 (N16-42 a N16-51). Onde a resposta difere do padrão proposto, vale a resposta. Em resumo:

- Decidem Controladoria, Gerência e Coordenação, sem teto (M10).
- O vendedor lê a justificativa (M11).
- Só entram as peças com custo real (M12).
- Cancelamento e devolução abatem na mesma proporção (M13).

As perguntas M01 a M19, com os padrões, estão no detalhe técnico.

## Detalhe técnico

Esta nota explica, em linguagem simples, **o que o módulo Comissões de hoje faz**. Serve para a Michele (Controladoria) conferir antes de o motor ir para a proposta ([[Registro-de-Decisoes]], N16-11: o motor novo é o mesmo). Nada do módulo atual é alterado. A lista de perguntas está no fim, em "O que a Michele precisa confirmar".

Como ler: **✅** está na `develop` ou no banco (com arquivo e linha) · **📝** decisão do Nathan · **🟡** parcial na `develop` · **🔴** não está na `develop` · **❓** não conferido na `develop`. Nos números, `dump` é `09-Diagramas/fontes/core_comissionamento-dump-convertido.sql`.

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[01-Motor-Atual-Como-Calcula-Detalhe-Tecnico-1]]: Resumo em dez linhas · Visão do fluxo atual · 1. Quem faz o quê hoje · 2. Regra a regra
- [[01-Motor-Atual-Como-Calcula-Detalhe-Tecnico-2]]: 3. Onde o custo líquido é calculado e a fórmula exata (N16-20) · 4. O passo "Comissão: após a aprovação de Compras" e onde ele entra no fluxo novo · 5. Pontos de atenção que achei · O que a Michele precisa confirmar
