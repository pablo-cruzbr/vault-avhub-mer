---
tags: [desenvolvimento, backlog, pendencias, parte, validacao]
criado: 2026-11-13
estado-em: 2026-11-16
status: vigente
dono: Nathan
parte-de: "[[Backlog-por-Frente]]"
develop-conferida: [api-acos-vital e522962, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13]
fontes: [reteste por cliques no Docker local de 13/11/2026 (docker-teste/RETESTE-CLIQUES-2026-11-13.md e seção R3 de docker-teste/RELATORIO-VALIDACAO.md, fora do vault), PDF de Gustavo de 16/11/2026 (status dos contratos)]
---

# Backlog: defeitos do reteste por cliques de 13/11

**Em uma frase:** itens BL-089 a BL-096, os defeitos de tela que o reteste por cliques no Docker local de 13/11/2026 achou. Eles ficam numa nota à parte porque as notas das frentes já estão perto de 25 KB. Cada linha diz a frente.

**Onde estamos:** ← [[Backlog-por-Frente]] (resumo e índice) · frentes: [[Backlog-Frente-Robert]], [[Backlog-Frente-Gustavo]], [[Backlog-Frente-Nathan]]

O reteste rodou na `develop` de 12/11 (av-hub `c6310ad`, api-acos-vital `9abda4f`, app-pcp `897dcd7`, api-pcp `bd6b442`), clicando nas telas do Hub e do MES. Não houve 🔴 que bloqueie o fluxo. Os itens abaixo são 🟡: o fluxo passa, mas a tela erra ou esconde algo.

| ID | Nó | Frente | O que falta | Selo | Evidência |
|---|---|---|---|---|---|
| BL-089 | P3, C0 | Robert (tela) e Robert (`api-pcp`) | ✅ **Resolvido (app-pcp #65, 12/11) e confirmado no reteste R4 de 16/11: o campo começa vazio quando o prazo venceu e não aceita data passada.** Registro anterior: **O "Necessário até" aceita data passada.** O "Requisitar OP" gravou a RC-20261113-0002 (no Hub, REQ-000046) com prazo 01/01/2026. O campo tem só o `min` do navegador, o envio confere só o formato, e a API aceita qualquer data ISO. Falta recusar data anterior a hoje na tela e no DTO | 🟡 | `app-pcp` `app/(protected)/movimentacoes/components/RequisitarOpModal.tsx:106` (`Informe a data de necessidade`), `:164` (`htmlInput: { min: hojeSaoPaulo() }`); `api-pcp` `src/compras/dto/requisitar-compra.dto.ts:71` (`@IsDateString({ strict: true })`) |
| BL-090 | E1 | Robert | **O "A chegar por OC de estoque" (BL-050) não aparece no "Atender OP".** Ele só existe no modal "Atender pelo estoque" da vista em cartões; a lista por OP, que é a vista que abre primeiro, não mostra o saldo futuro | 🟡 | `app-pcp` `app/(protected)/estoque-operacao/saldo/SaldoFuturoCard.tsx:50` (`A chegar por OC de estoque`); [[05-Estoque-Atendimento]] |
| BL-091 | R6 | Robert | **A recontagem não é às cegas.** A aba Pendências mostra a primeira contagem para quem vai recontar. **Pergunta (Nathan):** a recontagem deve esconder a primeira contagem? | 🟡 ❓ | `app-pcp` `app/(protected)/movimentacoes/components/RecebimentoFila.tsx:987` (`contado {Number(i.quantidadeContada)`) |
| BL-092 | V0.6, V0.7 | Robert (raia 01, N16-157), com o Nathan | **O cartão da proposta não se atualiza depois da falha do Omie.** Depois do transformar com o Omie recusando, o cartão continua "Aprovada", com "Transformar em pedido" e sem o "Tentar novamente", até recarregar a página. O cartão "Virou pedido" mostra "Qualidade: não informada" com o pedido gravado `qualidade_acompanha = true` (visto também no R1 e no R2) | 🟡 | `av-hub` `components/Propostas/PropostaForm/TransformarModal.tsx:320-327`; [[01-Proposta-de-Venda]] |
| BL-093 | V0.7 | Robert e Gustavo | **O nº do pedido do cliente é cortado em 15 caracteres sem aviso.** O modal do transformar aceita 30, mas o envio ao Omie (`fn_pedido_venda_payload_omie`) leva só 15. **Pergunta (Nathan):** limitar o campo a 15 ou avisar que o Omie corta? | 🟡 ❓ | [[Mapa-IncluirPedido-Omie]]; pedido PV-000008 (`OC-CLI-CLIQUES-1311`) |
| BL-094 | Q1 | Robert | **O "Prazo do pedido" da Inspeção de entrada sai um dia antes** (29/10 para um prazo de 30/10): a data vira `Date` no fuso do navegador | 🟡 | `app-pcp` `app/(protected)/qualidade/inspecao-entrada/page.tsx:189` (`new Date(row.prazoPedido).toLocaleDateString`) |
| BL-095 | C2, C8 | Gustavo | **A OC aprovada pelo vendedor fica sem `aprovado_por`.** Na OC-000020 (compra acima do cotado aprovada em Meus Pedidos) a decisão ficou só na divergência; a OC passou a `aprovado` sem quem aprovou. Foi uma escolha da entrega de 12/11; o Gustavo corrige banco e API assim que o Nathan decidir (status de 16/11). **Pergunta (Nathan):** a OC liberada pelo vendedor grava o vendedor em `aprovado_por`? | 🟡 ❓ | LOG-57; OC-000020 no Docker |
| BL-096 | C5 | Nathan e Gustavo | **O Follow-up lista OCs já recebidas como "Sem confirmação".** As OC-000010, 11, 16 e 17 estão concluídas no MES e continuam na lista do CCP | 🟡 | [[06-Circuito-de-Compra]] |

Pequenos pontos de tela do mesmo reteste, sem item próprio: a margem aparece como "em breve", os pallets em "unid." para item em KG, o lote não aparece no modal de inspeção e há números fora do formato brasileiro.
