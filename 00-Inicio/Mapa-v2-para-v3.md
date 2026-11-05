---
tags: [vault, mapa, migracao]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Nathan
fontes: ["_v3/mapa-renomeacao.csv", "tag v2-antes-da-v3 do vault"]
---

# Mapa v2 para v3

**Em uma frase:** diz onde foi parar cada nota da v2 que mudou de nome ou de lugar na v3.

**Quando consultar esta nota:** quando você achar um nome antigo (por exemplo `11-Proposta-e-Pedido-de-Venda` ou `LOG-34`) e quiser saber onde ele está hoje.

A v2 está guardada na tag `v2-antes-da-v3`. Na v3, as notas de raia seguem a ordem do fluxo do [[00-Fluxo-Mestre-0b]] (F1): Proposta → Orçamento → Pedido → PCP → Estoque → Compra → Recebimento → Qualidade → Produção → Expedição → Fiscal → Comissão. Notas que não aparecem aqui não mudaram de nome.

## Notas de raia (`02-Fluxo-de-Atividades`)

| Nota da v2 | Nota na v3 | Motivo |
|---|---|---|
| `11-Proposta-e-Pedido-de-Venda` | [[01-Proposta-e-Pedido-de-Venda]] (provisório) | A proposta abre o fluxo (V0.1–V0.7). No Bloco 3 vira `01-Proposta-de-Venda`, e os trechos de orçamento, pedido e compra vão para as notas donas |
| `12-Orcamento-Base-de-Preco` | [[02-Orcamento-Base-de-Preco]] | B1–B4 vêm logo depois da proposta |
| `01-Vendas-Liberacao` | [[03-Pedido-de-Venda-e-Liberacao]] | V1–V3 |
| `02-PCP-Triagem-e-Destinacao` | [[04-PCP-Triagem-e-Destinacao]] | P1, P2, P6 |
| `03-Estoque-Atendimento-e-Despacho` | [[05-Estoque-Atendimento]] (E1–E4) · [[09-Estoque-Entrada-do-Lote]] (E5) · [[12-Estoque-Despacho]] (E6) | D1: o Estoque aparece em três momentos do fluxo. As regras 9 e 11 foram para a 09 e a regra 10 para a 12, com a numeração da v2 |
| `04-Circuito-de-Compra` | [[06-Circuito-de-Compra]] | P3, C0–C8, FN1 |
| `05-Recebimento` | [[07-Recebimento]] | R0–R6 |
| `06-Qualidade-Entrada` | [[08-Qualidade-Entrada]] | Q1–Q4 |
| `07-Producao-e-Roteiro` | [[10-Producao-e-Roteiro]] | F1 (o 09 fica para a entrada do lote no estoque) |
| `08-Qualidade-Saida` | [[11-Qualidade-Saida]] | Q7, Q8 |
| `09-Expedicao` | [[13-Expedicao]] | X1–X4 (o 12 fica para o despacho do estoque) |
| `10-Fiscal-Omie` | [[14-Fiscal-Omie]] | O1, O2 |
| `13-Custo-Real-e-Comissao-no-Fluxo` | [[15-Custo-Real-e-Comissao]] | K1–K6 fecham o fluxo |

## Transversais (saem da sequência)

| Nota da v2 | Nota na v3 | Motivo |
|---|---|---|
| `14-Telas-e-Experiencia-do-Usuario` | [[Telas-e-Experiencia-do-Usuario]] | Vale para todas as raias; perde o número |
| `Estados-e-Status` | [[Estados-e-Status]] | Só mudou para `02-Fluxo-de-Atividades/Transversais/` |
| `Telas-por-Raia` | [[Telas-por-Raia]] | Só mudou para `02-Fluxo-de-Atividades/Transversais/` |

## Contratos

| Na v2 | Na v3 | Motivo |
|---|---|---|
| contratos → `06-Contratos/Ativos`, `Entregues`, `Arquivados`, `Consultas` (92 contratos e anexos) | [[Contratos-da-v2]] | F2: os contratos ficaram na tag `v2-antes-da-v3`; o índice traz ID, título, status, nós e link do GitHub |
| `Painel-de-Contratos` | [[Contratos-da-v2]] | O índice substitui o painel |
| `06-Contratos/Consultas/Modelo-de-Consulta` | [[Modelo-de-Consulta]] | É modelo, não contrato: foi para `06-Contratos/Modelos/` |

O mapa completo, legível por script, está em `_v3/mapa-renomeacao.csv`.
