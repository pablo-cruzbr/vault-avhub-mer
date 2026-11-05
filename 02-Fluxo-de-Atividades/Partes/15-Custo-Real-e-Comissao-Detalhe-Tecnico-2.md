---
tags: [fluxo, raia, custo-real, comissao, k1, k2, k3, k4, k5, k6, controladoria, simulador, tela, devolucao, apuracao, parte]
criado: 2026-11-05
estado-em: 2026-11-05
status: proposta
dono: Nathan (fluxo) · Gustavo (banco e API) · Robert (custo no MES) · Michele (decisão da comissão)
parte-de: "[[15-Custo-Real-e-Comissao]]"
develop-conferida: [api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
fontes: [Registro-de-Decisoes (N16-09 a N16-11, N16-17 a N16-23, N16-34 a N16-51, N16-57, N16-71, N16-74), Proposta-Orcamento-Comissao/01-Decisoes/Respostas-da-Controladoria-2026-10-19 (fora do vault), Proposta-Orcamento-Comissao/01-Decisoes/Respostas-de-Compras-2026-10-19 (fora do vault), Estudo-Omie-API, 09-Diagramas/fontes/tela-simulador-comissao.png, av-hub comissoes/simulador/page.tsx e lib/simulador/motor.ts, 03-Sistemas/Comissao/01-Motor-Atual-Como-Calcula, 00-Fluxo-Mestre-0b, 03-Estoque-Atendimento-e-Despacho, 04-Circuito-de-Compra, Modelo-Estoque-e-Custo-do-Lote, API-008, LOG-47, 10-Anexo-Fora-do-Fluxo/Comissoes, api-pcp (estoque.prisma, compras.service.ts), 09-Diagramas/artifact-proposta-pedido.html, api-pcp develop de 27/10/2026 (GET /itens/custo, custo da OC), N16-143, N16-144]
---

# Custo real e comissão no fluxo (K1 a K6): detalhe técnico (2/2)

**Em uma frase:** detalhe técnico da nota [[15-Custo-Real-e-Comissao]] (parte 2 de 2): A tela da comissão: três visões da mesma tela (N16-19); Casos de borda do custo real; Estados da comissão; Quem vê o quê; Estado no código e o que falta; Diagrama do subfluxo.

**Onde estamos:** ← [[15-Custo-Real-e-Comissao]] (resumo e índice) · partes: [[15-Custo-Real-e-Comissao-Detalhe-Tecnico-1]] · **15-Custo-Real-e-Comissao-Detalhe-Tecnico-2**

## A tela da comissão: três visões da mesma tela (N16-19)

A tela da proposta é **semelhante à do Simulador de Comissão** que o Nathan mandou em 16/10 (`09-Diagramas/fontes/tela-simulador-comissao.png`; código em `av-hub/app/(protected)/comissoes/simulador/page.tsx`). Mesmo motor e mesmas regras, em **tabelas novas** (N16-21). A Controladoria tem a mesma tela com a verdade na tabela: o custo real e afins.

### Blocos da tela e o que cada visão mostra

| Bloco do Simulador (imagem) | (a) Vendedor, na proposta (`V0.2`, `V0.3`) | (b) Compras (`C6`, `C7`, `C8`) | (c) Controladoria (`K4`) |
|---|---|---|---|
| **Pedido:** Unidade, Número do pedido (busca pelo número exato), Cliente, Vendedor, Itens | Unidade, **número da proposta** (automático, só dígitos, sem busca), cliente, vendedor, itens | Pedido, proposta ligada, requisição do PCP | NF, pedido, proposta, vendedor, cliente |
| **Condições comerciais**, com "Parâmetros: Maio/23": estado de destino e ICMS, condição de pagamento e encargo, "Com impostos", frete na compra, valor ST, imposto retido ou DIFAL, frete na venda | Preenche. Os parâmetros vigentes são gravados com o cálculo (`id_parametros`, [[03-Modelo-Novo-core_comissao]]) | Lê as da proposta (só leitura) | As da venda (um conjunto por pedido) e, no drill-down, **as de cada evento de custo** (N16-20) |
| **Itens:** "Compra: você preenche", "Resultado: o sistema calcula"; colunas COMPRA, VENDA, RESULTADO | Preenche a compra (custo cotado) e a venda; vê custo líquido, sugerido, margem e letra | Vê o **cotado do vendedor** ao lado do **valor da OC** e do fornecedor; edita os campos de imposto da OC; **não altera a proposta** (N16-08) | **Estimado × real, lado a lado**: custo líquido real, margem real, letra real, comissão real, por item e por evento |
| **Chip** "Comissão: após a aprovação de Compras" | Não aparece. O vendedor vê a comissão estimada que ele colocou; a real só depois da decisão | **O passo de Compras aprovar o percentual fica desligado** (provisório; o valor estimado por Compras vem do Omie, sem digitação; N16-51) | Substituído pela decisão |
| **Rodapé:** custo, venda, total da NF, sugerido, mark-up real, mark-up s/ compra, margem e letra | Estimados | Estimados e reais | Estimados e reais, com a queda por custo |
| **Botões:** Recomeçar, Salvar rascunho, Enviar | Salvar a proposta; "Enviar" vira marcar aprovada e transformar em pedido (`V0.4` a `V0.6`) | Registrar a OC e tratar a lista dos casos reprovados | **Aprovar, desaprovar, bloquear, desbloquear, cortar ou alterar**, sempre com justificativa |

### O passo "aprovação de Compras" do motor atual

Hoje (✅ `simulacoes.route.js:30-36`, `:233-259`; `simulador/page.tsx:1192-1234`): o vendedor envia o simulador; Compras abre e, se o custo está errado, cria uma segunda versão (origem `COMPRAS`) com o custo correto; o percentual final do item é o menor entre o do vendedor e o de Compras ([[01-Motor-Atual-Como-Calcula]], R5 e R10).

No fluxo novo (N16-51, OQ-28 em parte): o **percentual de Compras** deixa de ser uma digitação e passa a ser o cálculo `REAL`, gerado a cada evento de custo (`K2`); o passo "Compras aprova o percentual" **sai do fluxo e fica pronto no sistema, desligado**, até Compras validar. O percentual final continua sendo o **menor** entre os dois.

### Telas e menu que a imagem mostra

| Item do menu na imagem | O que é hoje | Alinhamento 🟡 |
|---|---|---|
| Comissões › Simulador, Análise de Simuladores, Minhas Comissões, Visão Geral, Parâmetros, Bloqueio de Comissões | Módulo atual (`app/(protected)/comissoes/*`), **não muda** (N16-11) | O módulo novo fica em Operações |
| Operações › "Custo real por item" | `app/(protected)/orcamento/custo-itens/page.tsx` (`CustoItens`; a rota antiga `custo-itens` foi para o menu Orçamento em 27/10): custo real por pedido, KPIs, lotes e simulador de margem **sem imposto**, sobre dados de teste (BL-023, `544ee0b`; [[Contratos-da-v2\|LOG-47]]) | Pode ser a entrada do drill-down por evento da Controladoria; precisa ligar ao custo por evento e ao imposto |
| Dashboards › "Matriz de preços" | O BFF cita o slug `matriz-precos`; a tela ainda não existe | É a matriz de preços do Orçamento ([[02-Orcamento-Base-de-Preco]]) |

Os contratos com o detalhe das telas e das regras foram removidos em 29/10/2026; o Robert cria os novos.

### Relatórios da Controladoria (N16-50)

A lista por mês, vendedor, unidade e status (com exportação para Excel), mais: (1) **markup real** (Venda ÷ Custo − 1) de todos os pedidos, por vendedor, com consolidado; (2) **Faturamento × Compras por pedido**, com markup real, percentual de comissão e valor a pagar. Nos dois, separar **Revenda, Industrializado e Projeto** e sinalizar **recompra no mesmo pedido**. O **valor retido** das comissões bloqueadas aparece no resumo mensal, separado do valor a pagar. ❓ Projeto e recompra aguardam a OQ-44.

## Casos de borda do custo real

| Caso | O que acontece |
|---|---|
| OC cancelada antes de receber | A linha de custo dela é estornada; o item volta a parcial |
| NF de entrada diferente da OC (peso da balança) | O valor da NF substitui o da OC (N16-40) |
| Item sem nenhuma linha quando a NF de saída sai | `K3` fecha só as peças com custo real; o resto espera (N16-48); a Controladoria vê "custo parcial" |
| Unidade de medida diferente entre proposta, OC e lote (KG × PC) | **Sem conversão no sistema** (Compras); o CCP liga a NF de entrada à OC (N16-86, que corrige a N16-57); linha marcada "unidade diferente" |
| Pedido digitado no Omie | O `K1` nasce quando o vendedor preenche a parte de compras do pedido (a simulação, N16-104, N16-106); a nota que sair antes **espera**, e a Controladoria já vê a margem real (N16-105); com as duas, fecha pelo menor |
| Proposta ou pedido **cancelado** | A estimada vira histórico. O que já foi comprado vai ao **Estoque, livre**, como lote com o custo da OC, e **deixa de ser custo** do pedido cancelado (N16-68, N16-69) |
| Pedido **faturado** e depois cancelado | O cancelamento não desfaz compra nem produção; fica o abatimento da comissão (`K6`) e o saldo não faturado, parte por parte (N16-71) |
| Devolução de **venda** | Total vem do Omie; parcial só chega marcada e o Fiscal ou a Controladoria informam item, quantidade e valor (N16-74) |
| Devolução de **compra** (NF de entrada devolvida ao fornecedor) | ❓ Como aparece no Omie e o efeito na linha de custo: adiado (OQ-42) |
| Pedido manual (`MAN-`) | Nunca entra no custo (D6 do 008, [[Contratos-da-v2\|LOG-45]]) |

## Estados da comissão

Os estados são os do banco (testado), resumidos em [[04-Regras-e-Estados-da-Comissao-Nova]]. Por nó do fluxo:

| Nó | Dossiê da proposta ou do pedido (`comissoes`) | Comissão da nota (`comissoes_nf`) e lançamentos |
|---|---|---|
| `K1` | `ESTIMADA` (salva e revisada); `CONGELADA` quando a proposta é aprovada | — |
| `K2` | `EM_ACOMPANHAMENTO` (o pedido existe e o custo real chega) | — |
| `K3` | `EM_ACOMPANHAMENTO` | `AGUARDANDO_DECISAO` (a nota fechou, já calculada); lançamento `COMPLEMENTO` ou `DESCONTO` quando o custo completa depois |
| `K4` | — | `APROVADA`, `DESAPROVADA` (R$ 0, visível), `CORTADA`, `ALTERADA` ou `BLOQUEADA` (desbloquear devolve à fila, com justificativa) |
| `K6` | — | `NF_CANCELADA` (nota cancelada inteira antes da decisão); lançamento `ABATIMENTO`; devolução parcial em `comissao_devolucao_pendencia` (`ABERTA` → `INFORMADA` ou `DISPENSADA`) |
| `V0C` | `CANCELADA` (vira histórico, com motivo; só sem nota faturada) | — |
| fim | `ENCERRADA` (tudo faturado e decidido) | — |

A decisão tem seis ações (`aprovar`, `desaprovar`, `bloquear`, `desbloquear`, `cortar`, `alterar`), sempre com justificativa.

## Quem vê o quê

| Dado | Vendedor | Gerência e Coordenação | Compras | Controladoria |
|---|---|---|---|---|
| Comissão estimada | a que ele pôs | 🟡 OQ-21 | não | sim |
| Custo real e diferença cotado × real | **não** | 🟡 | custo da OC | sim |
| Valor da compra de um produto dele, em aprovação (`C8`) | **sim** | não | sim | sim |
| Comissão real e justificativa | só depois da decisão | decidem | não | sim |
| Complementos, descontos e abatimentos | os dele, com o motivo, depois de decididos | decidem | não | sim |
| Visão geral e relatórios | não | 🟡 | não | sim |
| Pendência de devolução parcial | não | não | não | sim (com o Fiscal) |

## Estado no código e o que falta

| Item | Estado | Selo |
|---|---|---|
| Motor atual (menor entre o percentual do vendedor e o de compras, regras fixas, bloqueios, blacklists) | existe em `core_comissionamento`, só leitura aqui ([[Comissoes]]) | ✅ (`api-acos-vital`) |
| Módulo novo em `core_comissao`, em Operações | rascunhado e **testado num Postgres 18 em 19/10**; sem API nem tela | 🔴 Gustavo (banco), Nathan (telas) |
| Comissão estimada na proposta (`K1`) | não existe; o simulador do Hub só pré-preenche o lado da compra | 🔴 |
| Custo real por evento, com a NF de entrada como verdade (`K2`) | não existe | 🔴 Robert, Gustavo |
| Recurso novo da pipeline: recebimento de NF-e (imposto real, data de recebimento) | não existe | 🔴 Nathan ([[Estudo-Omie-API]]) |
| Custo obrigatório em todo lote e `GET /itens/custo` | `GET /itens/custo` e o custo da OC no lote existem na `develop` do MES (27/10 e 19/10); o custo obrigatório (BL-066) não | ✅ (`api-pcp`) rota; 🔴 obrigatório, Robert (OQ-07) |
| Tela da Controladoria igual à do Simulador, com custo real, e visão geral (`K4`, N16-19) | não existe; o Simulador atual é a referência | 🔴 Nathan |
| Aprovação do vendedor na compra acima do valor, lista de Compras e cancelamento | não existe; o modelo atual **ainda não conhece** | 🔴 |
| Abatimento por devolução, pendência de devolução parcial e apuração do vendedor | o abatimento está no modelo; a pendência de devolução parcial e a apuração (OQ-42) **não** | 🔴 |
| Tela da proposta no formato do Simulador | não existe; o Simulador atual calcula no navegador | 🔴 Robert (tela de proposta), Nathan (`K1`) |

## Diagrama do subfluxo

```mermaid
flowchart TD
    subgraph SEC_VENDAS["Vendas · av-hub"]
        V03["V0.3 · Comissão estimada nasce"]
        V0C["V0C · Proposta cancelada"]
    end
    subgraph SEC_COMP["Compras · av-hub"]
        C7["C7 · Compras usa o valor correto na OC"]
        C8["C8 · Compra acima do valor<br/>vendedor aprova ou reprova"]
        C4["C4 · Emite a Ordem de Compra<br/>inclui OC de mão de obra"]
        NFE["NF de entrada<br/>valor real e imposto real<br/>CCP vincula à OC"]
    end
    subgraph SEC_EST["Estoque · MES"]
        E3["E3 · Atende pelo saldo<br/>custo real do lote"]
    end
    subgraph SEC_PROD["Produção · MES"]
        F1["F1 · Setores produtivos<br/>fabricado: só a matéria-prima"]
    end
    subgraph SEC_FIS["Fiscal · Omie"]
        O1["O1 · Emite a nota fiscal"]
    end
    subgraph SEC_COM["Comissão · av-hub · Operações"]
        K1["K1 · Comissão estimada"]
        K2["K2 · Recalcula com o custo real<br/>só as peças com custo real"]
        K3["K3 · Fecha por nota fiscal<br/>diferença na apuração seguinte"]
        K4["K4 · Controladoria, Gerência ou Coordenação decidem<br/>sempre justificam"]
        K5["K5 · Vendedor vê a comissão real e a justificativa"]
        K6["K6 · NF cancelada, devolvida ou recusada<br/>abatimento proporcional"]
        K1 --> K2 --> K3 --> K4 --> K5
        K3 -.-> K6
    end
    V03 --> K1
    V0C -.->|"vira histórico"| K1
    C7 --> C8 --> C4
    C4 -.->|"valor da OC, provisório"| K2
    NFE -.->|"substitui o valor da OC"| K2
    E3 -.->|"custo real do lote"| K2
    F1 -.->|"matéria-prima"| K2
    O1 --> K3
    O1 -.->|"cancelada, devolvida, recusada"| K6
```
