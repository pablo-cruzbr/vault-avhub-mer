---
tags: [projeto, cronograma, capacidade]
criado: 2026-11-11
estado-em: 2026-11-17
status: vigente
dono: Nathan
fontes: [Cronograma (ondas W0 a W4, feriados, foco), Equipe-e-Divisao, Registro-de-Decisoes N16-145, N16-156, N16-157, N16-158, N16-168, N16-169 e N16-170, Q&A de 11/11/2026 com o Robert (P4, P13, P16; fora do vault, ../Perguntas-e-Respostas/), proposta de cronograma de 16/10/2026 (blocos N1 a N8, P1 a P7; fora do vault), Backlog-por-Frente (estado de 10/11/2026)]
---

# Capacidade do Robert depois da N16-157

**Em uma frase:** com as raias 01, 03, 14 e 15 o Robert ganha cerca de 62 pd (faixa de 43 a 81); sozinho, isso empurra o fim do plano de 02/12/2027 para 28/03/2028, mas com o Nathan desenvolvendo junto em todo o processo (40% de foco) o plano fecha em 20/10/2027.

**Quando consultar esta nota:** quando você precisar saber quanto trabalho o Robert tem depois da divisão das raias de 11/11/2026, quando cada marco cai e quanto o apoio do Nathan muda as datas.

> 🟡 Estimativa do Nathan com apoio do Claude, por complexidade (±30%), no mesmo método do [[Cronograma]]: dias úteis = pd ÷ foco, mesmos feriados, crédito só para o que está na `develop`. Os pd das raias novas saem dos blocos da proposta de 16/10/2026, menos o que a `develop` já tem segundo o [[Backlog-por-Frente]] de 10/11. **O Robert valida item a item antes de as datas valerem como compromisso.** O fim do Ciclo 1 em 03/03/2027 (36,1 pd) é o que o Robert validou em 11/11 e não muda aqui.

## O que entra na conta do Robert

Antes da N16-157 a fila do Robert era: o plano até 18/12/2026, depois a W0 (déficit do Ciclo 1, 36,1 pd, até 03/03/2027) e as ondas W1 a W4 do PCP legado (141 pd). O módulo Comercial, que ele conduz desde 28/10, nunca entrou na conta (RS-004). A N16-157 soma as raias abaixo.

| Raia | O que falta | pd | Itens |
|---|---|---|---|
| 01 Proposta e 03 Pedido | Passos do Robert no LOG-56 (7d, 11 a 14) | 2,5 | LOG-56 |
| 01 Proposta e 03 Pedido | Meus Pedidos com o pedido do Omie no mesmo fluxo, visões de Compras e da Controladoria na proposta, aviso de compra acima do valor (o que sobra dos blocos N1 e N2, 13 pd, depois de lista, nova, detalhe, aprovar, cancelar e transformar estarem na `develop`) | 6,0 | BL-075 |
| 01 Proposta e 03 Pedido | Regras novas da proposta e do pedido que faltam: Qualidade, faturar em partes, data por item (o que sobra dos blocos P2 e P3, 19 pd) | 4,0 | N16-150, N16-151 |
| 01 Proposta | ICMS do item pelo destino, selects por unidade, teste do pedido real no Omie | 2,5 | BL-087, BL-080 (tela), BL-081 |
| 14 Fiscal · Omie | O que sobra da pipeline do pedido: condições de pagamento, cenários de impostos, sequenciais, recebimento da NF-e (bloco N3, 5 pd, com o `IncluirPedido` já na `develop`) | 4,0 | BL-076 |
| 15 Custo Real e Comissão | Motor da comissão na API (bloco P6) | 8,0 | BL-078 |
| 15 Custo Real e Comissão | Custo por evento (bloco P7) | 6,0 | N16-09 |
| 15 Custo Real e Comissão | Telas da Controladoria e da comissão: visão geral, minhas comissões, parâmetros (blocos N5 e N6) | 20,0 | BL-075 |
| 15 Custo Real e Comissão | Custo real por item: cenário com imposto, PTAX por lote, ligação com o simulador, filial e mensagens de 403; resíduo dos coordenadores | 5,0 | BL-023, BL-088 (tela), BL-077 |
| 15 Custo Real e Comissão | Parte do Robert no imposto por item (lote e OC) | 2,0 | BL-053 |
| 02 Orçamento | Acompanhar o Pablo (revisão dos blocos P5 e N7, cerca de 10%) | 2,0 | N16-157 |
| **Total** | | **62,0** (43,4 a 80,6) | |

**Fora da conta, sem pd** ❓: o faturamento em partes no Fiscal (N16-92 a N16-100), o cancelamento pelo Omie (N16-68 a N16-71), as datas do pedido e o calendário do marketing (N16-88 a N16-104) e o contrato próprio das pernas 3 a 5 do MES (N16-151). Quando ganharem pd, entram aqui.

## Depois da divisão do Comercial (17/11/2026)

Com a N16-169, as telas da raia 15 passam ao Nathan, e o Robert deixa de acompanhar o Orçamento (N16-168). Saem da conta do Robert 29 pd: as telas da Controladoria e da comissão (20), o custo real por item (5), a parte de tela do imposto por item (2) e o acompanhamento do Pablo (2). A conta dele nas raias novas cai de 62 para **cerca de 33 pd**: 29 do Comercial e 4 do Fiscal · Omie. O Nathan recebe esses 27 pd de telas e o Orçamento, que era do Pablo (blocos P4, P5 e N7 da proposta de 16/10, cerca de 27 pd), perto de **54 pd** 🟡. Os três cenários abaixo ainda usam os 62 pd e não foram refeitos.

**Prazo de 01/12/2026 (N16-170).** De 17/11 a 01/12 são 10 ou 11 dias úteis (10 se 20/11 for feriado). No foco do plano (Robert 75%, Nathan 40%), os dois rendem cerca de 12 pd; a 100%, cerca de 21 pd. O Comercial inteiro (cerca de 80 pd) não cabe. A entrega mínima, em que a proposta vira pedido no Omie, pede cerca de 15 pd e só cabe com os dois perto de 100% no Comercial, o que segura o MES e a raia 06 nessas duas semanas 🟡.

## Os três cenários

Datas de fim de cada fila, a 75% de foco do Robert e com os feriados do [[Cronograma]]. A linha "Sem as raias novas" é a fila de hoje com a W0 terminando em 03/03/2027 (a tabela de ondas do [[Cronograma]] ainda parte de 18/02).

| Cenário | Raias novas | M8 Flange alta | M9 Flange completa | M10 Caldeiraria | M11 Análise e gestão |
|---|---|---|---|---|---|
| Sem as raias novas (referência) | — | 24/05/2027 | 13/07/2027 | 19/10/2027 | 02/12/2027 |
| **A. Robert sozinho** | 01/07/2027 | 20/09/2027 | 10/11/2027 | 15/02/2028 | **28/03/2028** |
| **B. Nathan desenvolve junto, 40% de foco** | 23/04/2027 | 16/06/2027 | 19/07/2027 | 21/09/2027 | **20/10/2027** |
| C. Nathan desenvolve junto, 20% de foco | 26/05/2027 | 29/07/2027 | 08/09/2027 | 26/11/2027 | 30/12/2027 |

Faixa de ±30% nos 62 pd: no cenário A o M11 vai de 22/02/2028 a 02/05/2028; no B, de 24/09/2027 a 12/11/2027.

**Como o cenário B foi montado.** O Nathan acompanha todo o processo como coordenador e desenvolvedor (N16-157), com o foco de 40% do plano (0,4 pd por dia útil). (1) De 12/11 a 09/12/2026 ele fecha os itens dele que travam alguém: a visão de Compras na proposta e a conferência C6 e C7 (raia 06), o BL-086 e o cadastro de telas (cerca de 7,5 pd). (2) De 10/12/2026 a 03/03/2027, enquanto o Robert fecha o plano e a W0, o Nathan adianta as raias novas: cerca de 22,8 pd. (3) De 04/03/2027 em diante os dois trabalham juntos (1,15 pd por dia útil) no que sobra das raias novas e nas ondas W1 a W4. O cenário C é o mesmo com o Nathan a 20%. A organização do código do av-hub (BL-082 a BL-085) fica fora, porque não tem prazo.

## O que o cenário B pede

- **O Nathan como desenvolvedor do MES nas ondas W1 a W4.** A conta só fecha em 20/10/2027 se o Nathan também desenvolver no PCP legado, não só nas raias do Hub. Se ele ficar só nas raias do Hub, a partir de 23/04/2027 o Robert volta a 0,75 pd por dia e os marcos caem em 13/07/2027 (M8), 31/08/2027 (M9), 09/12/2027 (M10) e 20/01/2028 (M11).
- **A coordenação cabe nos outros 60%.** A conta supõe que o tempo de coordenar, decidir e manter o vault não sai dos 40% de desenvolvimento.
- **A raia 06 continua do Nathan.** Os itens dele vêm primeiro na fila dele (passo 1).

## Riscos

- O RS-004 continua 🔴: no cenário A o fim passa para 2028.
- Sem pd, os itens "fora da conta" podem somar semanas, sobretudo o faturamento em partes e o cancelamento pelo Omie.
- O Gustavo acompanha a API do MES (N16-158), mas a conta não usa a folga dele (11,9 pd na S1–FC e 9,8 pd na S5); ela fica como reserva.

Equipe: [[Equipe-e-Divisao]]. Marcos e ondas: [[Cronograma]]. Risco: [[Riscos]] (RS-004). Decisões: [[Registro-N16-150-a-N16-155]].
