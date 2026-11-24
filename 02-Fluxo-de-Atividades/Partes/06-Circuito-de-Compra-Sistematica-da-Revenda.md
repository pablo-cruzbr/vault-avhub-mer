---
tags: [fluxo, raia, compras, revenda, oc, aprovacao, markup, cotacao, recompra, sistematica, parte]
criado: 2026-11-24
estado-em: 2026-11-24
status: vigente
dono: Compras (regra) · Nathan (decisões)
parte-de: "[[06-Circuito-de-Compra]]"
develop-conferida: [api-acos-vital ed6d147, av-hub 8fb8c9d, em 2026-11-24, limite de aprovação, envio da OC, comprador da requisição e Análise de Simuladores]
fontes: [Sistemática do Setor de Compras – Revenda Aços Vital, de Loise (Coordenadora de Compras), recebida em 24/11/2026 (fora do vault), Perguntas-Compras rev01 com as respostas de Compras (questionário do Nathan de 16/10/2026, respondido em 19/10/2026 e reenviado em 24/11/2026, fora do vault), Registro-de-Decisoes (N16-40, N16-41, N16-53, N16-54, N16-57, N16-61, N16-63, N16-66, N16-76, N16-87, N16-123, N16-144, N16-161), roteiro Compras do zero (D1 a D8)]
---

# Sistemática de Compras da Revenda (Loise, 24/11/2026)

**Em uma frase:** o processo de Compras da Revenda como a Coordenação de Compras o descreve, e onde ele não bate com as regras e o código do [[06-Circuito-de-Compra]].

**Quando consultar:** antes de decidir a aprovação da OC, a cotação, o envio da OC, os prazos de atraso, o controle de markup da compra ou a recompra; e para saber quem é quem em Compras.

**Onde estamos:** ← [[06-Circuito-de-Compra]] (resumo e índice) · partes: [[06-Circuito-de-Compra-Detalhe-Tecnico-1]] · [[06-Circuito-de-Compra-Detalhe-Tecnico-2]] · **06-Circuito-de-Compra-Sistematica-da-Revenda**

Em 24/11/2026 a Loise (Coordenadora de Compras) mandou ao Nathan dois documentos:

- **Sistemática do Setor de Compras – Revenda.** Descreve o processo de hoje e o que Compras quer do sistema. Traz o fluxo e o organograma como imagens. É o que esta nota resume.
- **Perguntas-Compras rev01.** É o questionário do Nathan de 16/10/2026 (B1 a B12) com as respostas de Compras. São as mesmas respostas de 19/10/2026, que já viraram decisões (tabela no fim desta nota).

Os dois documentos ficam fora do vault. A Sistemática cobre **só a Revenda**: as compras de MRO, as de estoque e as de uso interno não aparecem nela.

## O processo de hoje

Todo pedido de Revenda passa três vezes pela Coordenação de Compras:

1. na triagem;
2. na aprovação da OC;
3. na conferência do markup.

Cada item é cotado com pelo menos 3 fornecedores, e o pedido só fecha depois que a Coordenação confere o markup realizado contra o previsto pelo vendedor.

1. **Entrada.** O PCP manda o pedido de venda em papel, com o simulador:
   - a página 1 é de Compras: item, quantidade, impostos e fornecedor sugerido;
   - a página 2 é de Vendas: o valor de venda.

   O pedido tem de vir com o simulador assinado, a descrição técnica completa, a quantidade, o prazo e o fornecedor sugerido. O PCP confere o estoque antes e marca de amarelo os itens que existem em estoque. A urgência é dada pelo vendedor, pelo gerente ou pela Coordenação, sem critério formal.
2. **Triagem.** A Coordenação registra o pedido e escolhe o comprador.
3. **Cotação.** São pelo menos 3 cotações. O peso de cada critério muda de venda para venda: preço, prazo, condição de pagamento e, quando o cliente exige, certificados de qualidade ou de origem. A cotação é feita por e-mail, telefone e WhatsApp, sem mapa de cotação.
4. **Emissão da OC no Omie.** A OC leva:
   - os dados do fornecedor;
   - os itens com NCM, unidade e impostos por item (IPI, ICMS, ST/DIFAL);
   - frete CIF ou FOB e a condição de pagamento;
   - o número do pedido de venda, no campo "Nº do Pedido do Fornecedor";
   - o projeto 16 – Revenda, a categoria, o comprador e a previsão de entrega;
   - a instrução para o fornecedor pôr o número e o item da OC no XML da NF-e (`xPed`, `nItemPed`).
5. **Aprovação da OC.** Toda OC é aprovada, sem limite de valor:

   | Unidade | Quem aprova |
   |---|---|
   | Mogi e HRM | Loise ou Sérgio |
   | Uberaba | Marcela ou Sérgio |

   - **O que se confere:** preço, prazo contra a previsão de faturamento, exigências do cliente e markup.
   - **Reprovação:** o comprador traz outra solução, ou a Coordenação ou o Diretor sugerem uma. O motivo sai de uma lista que Compras mantém.
   - **Fornecedor novo:** a Qualidade homologa, a pedido de Compras por e-mail.
6. **Envio.** O comprador manda a OC ao fornecedor por e-mail ou WhatsApp, e o fornecedor confirma que recebeu.
7. **Em paralelo:**
   - o fornecedor e o CCP cuidam da entrega (confirmação, follow-up, chegada);
   - a Coordenação confere o markup e aprova o simulador, o que libera a comissão;
   - o pedido volta ao PCP.

## Regras de Compras

**Markup.** É markup sobre o custo, não margem sobre a venda:

| Indicador | Conta |
|---|---|
| % Vendedor (previsto) | (Venda ÷ Simulador − 1) × 100 |
| % Compras (realizado) | (Venda ÷ Total Comprado − 1) × 100 |
| Total Comprado | Material em estoque + comprado |
| Saving | Proposta inicial do fornecedor − valor final da OC, por OC |

Exemplo da Loise, PV 143: 31,69% previsto e −19,02% realizado.

**Markup realizado abaixo do previsto.** A Coordenadora trava a compra e decide se libera. Depois:

- o comprador formaliza;
- o Gerente de Vendas reaprova;
- os casos graves vão ao Diretor.

Não há faixa de valor.

**Status do pedido** (dias corridos até o faturamento):

| Status | Quando |
|---|---|
| Em andamento | OCs pendentes, mais de 2 dias até o faturamento |
| Risco | OCs pendentes, 2 dias ou menos |
| Atrasado | OCs pendentes, previsão de faturamento vencida |
| Com Problema | Compra travada (descrição errada, volta ao vendedor etc.) |
| Finalizado | Todas as OCs emitidas |

**Status da OC:**

| Status | Quando |
|---|---|
| Pendente | Dentro da previsão de entrega |
| Atrasado | Previsão vencida, sem entrega |
| Entregue | Entregue no prazo |
| Entregue c/ Atraso | Entregue depois da previsão |

Os motivos (Com Problema, reprovação da OC, recompra) ficam numa lista que Compras mantém e amplia.

**Sobras e recompra:**

| Caso | Custo |
|---|---|
| Sobra reaproveitável | Vai ao estoque e não é descontada do pedido de origem; o reuso aparece no simulador do vendedor que usar a sobra |
| Sobra não reaproveitável | Custo inteiro no pedido, explicado nas observações da OC |
| Recompra por erro comercial | Entra no Total Comprado do pedido original |
| Recompra por outro motivo | Custo à parte, por setor e motivo |

## Depois da compra

| Ocorrência | Quem vê | O que acontece | Hoje |
|---|---|---|---|
| Atraso | CCP | O CCP avisa as áreas; PCP, CCP, gerentes e Compras cobram o fornecedor; o PCP avisa os vendedores | Planilha e contato direto |
| Quantidade errada | CCP e diligenciadores | Compras é acionado; o CCP ou o comprador cobra o fornecedor | Contato direto |
| Qualidade ou especificação | Qualidade | RNC para Compras: devolução, troca ou aceite combinado com o vendedor | E-mail |
| Devolução | Indicada na RNC | Formulário com o Fiscal, NF de devolução, Logística (ou o fornecedor retira); Financeiro e Compras acompanham o crédito | E-mail e formulário |
| Recompra | Diligenciadores, Logística, PCP ou Comercial | Formulário, aprovação do Gerente Comercial, requisição do PCP, Carteira Recompra; depois o fluxo normal a partir da cotação | E-mail e planilha |
| Cancelamento | Cliente ou fornecedor | A OC é encerrada no Omie, ou a mesma OC é reaproveitada com outro fornecedor e outro preço | Sem histórico |
| Peso divergente | Recebimento da NF | A compra é pelo peso teórico, e a NF pode vir com o peso de balança, mudando o total | Sem controle |

## O que Compras quer do sistema

| Área | Hoje | Desejado |
|---|---|---|
| Pedido | Papel, marca-texto, urgência informal | Pedido digital com simulador, saldo de estoque automático, campos obrigatórios e prioridade com motivo |
| Tramitação | O pedido vai e volta da Coordenação 3 vezes | Status e aviso a cada etapa |
| Controle | 3 planilhas digitadas à mão | Carteira, Gestão por OC e Recompra geradas do pedido e do Omie |
| Cotação | WhatsApp e e-mail | Mapa de cotação obrigatório anexado à OC, com proposta inicial e valor final (saving calculado) |
| Cliente | Exigências conhecidas de boca | Exigências por cliente cadastradas (certificado de qualidade, origem) |
| OC | Pedido de venda no campo "Nº do Pedido do Fornecedor" | Campo próprio para o pedido de venda; envio pelo sistema com confirmação do fornecedor |
| Aprovação | Trava manual | Bloqueio automático por markup abaixo do previsto; aprovador por unidade; reprovação com motivo |
| Fornecedor | Homologação por e-mail | Pedido de homologação à Qualidade no sistema; indicador de entrega no prazo (OTD) |
| Comissão | Simulador aprovado numa pasta do TI | A aprovação no sistema dispara o cálculo |
| Follow-up | Cobrança manual | Alertas de vencimento, data reprogramada, aviso automático a PCP, vendedor e comprador |
| RNC e devolução | E-mail e formulário | RNC ligada à OC; devolução com status de NF, retirada e crédito |
| Recompra | Formulário por e-mail | Formulário digital com aprovação comercial e requisição automática; motivos padronizados |
| Cancelamento | OC alterada sem rastro | Motivo e histórico das alterações |
| Recebimento | Peso divergente sem controle | Comparar o valor da OC com o da NF |

**Relatórios:**

- já apresentados ao Diretor hoje:
  - saving mensal por comprador;
  - recompra por setor;
- novos:
  - markup previsto × realizado por comprador e por vendedor;
  - entrega no prazo por fornecedor;
  - OCs reprovadas e pedidos com problema, por motivo.

## Quem é quem em Compras

**Liderança:**

- Sérgio, Diretor de Suprimentos: aprova a OC em todas as unidades e as divergências graves de markup;
- Ronaldo, Gerente de Compras da HRM;
- Loise, Coordenadora de Compras: faz a triagem, distribui os pedidos, aprova a OC de Mogi e da HRM, confere o markup e aprova o simulador;
- Victória, Supervisora de Compras.

**A equipe atende a Aços Vital e a HRM:**

- **Compradores de Revenda** (Flaviane, Larissa, Tatiane e Samuel): cotam, emitem e enviam a OC e registram no controle;
- **Compradores de MRO:** Lucas e Rogers;
- **Estratégico e Importação:** Lindayane e Marcela, que também aprova a OC de Uberaba;
- **Fiscal** (Vinicius Bravo): ajusta a OC conforme a NF;
- **Controladoria** (Michele): custos e margens.

**Outras áreas:**

- PCP e CCP: origem do pedido, estoque, follow-up do fornecedor e aviso aos vendedores;
- Qualidade: RNC e homologação de fornecedor novo;
- Gerente Comercial ou de Vendas: aprova a recompra e o markup abaixo do previsto;
- Financeiro: crédito da devolução.

Isso alimenta a etapa 0 do roteiro (cadastros e acessos).

## Onde a Sistemática não bate com o sistema

| Ponto | Sistemática (Compras) | Regra ou código de hoje | Situação |
|---|---|---|---|
| Aprovação da OC | Toda OC é aprovada, sem limite; o aprovador depende da unidade | ✅ Até R$ 30 mil sai sozinha (`api-acos-vital` `src/schemas/core_vendas_faturamento/tables/condicoes_pagamento_compras/condicoes_pagamento_compras.route.js:17` (`const LIMITE_PADRAO = "30000.00";`)) e quem emite pode aprovar (N16-123, N16-161; [[06-Circuito-de-Compra#Regras que valem]]) | ❓ falta o Nathan decidir a D2 com isso em mãos |
| Compra mais cara que a prevista | Markup do pedido inteiro abaixo do previsto: a Coordenadora trava e libera, e o Gerente de Vendas reaprova | O vendedor aprova ou reprova por produto, sem tolerância; se reprova, a Gerência decide numa conversa física (N16-61, N16-63, N16-66, N16-76, LOG-57) | ❓ duas regras para o mesmo caso; falta decidir se convivem ou qual vale |
| Sobra reaproveitável de chapa | Vai ao estoque sem descontar do pedido de origem | A sobra volta ao lote com o custo da saída (N16-87, N16-193); se o custo do pedido de origem descontar a devolução, as regras não fecham. OQ-32 em aberto ([[15-Custo-Real-e-Comissao]]) | ❓ falta o Nathan decidir; muda a comissão |
| Unidade de medida | Sem conversão no sistema; a OC usa o produto cadastrado na unidade em que o fornecedor fatura | O vínculo da NF com o item do pedido é feito por uma pessoa (N16-57); lote de OC em unidade diferente do material entra sem custo | 📝 confirma a N16-57; o produto da OC pode ter outro código que o da requisição |
| Envio da OC | Desejado: envio pelo sistema, com confirmação do fornecedor | 🔴 O Hub gera o PDF, mas não envia | ❓ D6 respondida em parte: não diz se o envio é pelo Hub ou pelo Omie, nem o canal |
| Cotação | Mapa de cotação obrigatório anexado à OC, com saving | 🔴 Cotação fora do sistema | ❓ D5: Compras quer a cotação registrada no Hub |
| Prazos e atraso | Risco com 2 dias corridos ou menos até o faturamento; OC atrasada com a previsão vencida | 🔴 Sem alertas | ❓ D7 tem a regra de Compras; falta decidir quem é avisado |
| Triagem da Coordenação | A Coordenação escolhe o comprador de cada pedido | 🔴 Ninguém designa o comprador: o Hub mostra como comprador quem pôs a requisição em cotação ou emitiu a OC (`api-acos-vital` `src/schemas/core_vendas_faturamento/tables/requisicoes_compra/requisicoes_compra.route.js:438` (`'id_comprador', e.id_comprador`)) | ❓ novo |
| Pedido de venda na OC | Campo próprio | A OC do Hub já liga ao pedido de venda pela finalidade ([[06-Circuito-de-Compra]], passo 7) | ❓ conferir se o campo do Omie continua necessário |
| Aprovação do simulador | A Coordenação aprova e libera a comissão | ✅ Compras aprova a simulação na Análise de Simuladores (`av-hub` `app/(protected)/comissoes/analise-simuladores/page.tsx:95` (`title="Análise de Simuladores"`); [[15-Custo-Real-e-Comissao]]) | 📝 bate |
| Recompra | Aprovação do Gerente Comercial; custo no pedido original quando o erro é do Comercial | A recompra por RNC é tratada pelo aviso do MES (LOG-58), sem aprovação comercial | ❓ novo |

## Respostas B1 a B12: já registradas em 19/10

| Pergunta | Resposta de Compras | Onde está |
|---|---|---|
| B1 Impostos na OC | Já existem por item na OC do Omie e formam o custo | N16-53, N16-144 |
| B2 Valor depois da aprovação | A mesma OC pode mudar (até o fornecedor); é preciso acompanhar o valor da NF por causa do peso de balança | N16-40 (o custo real segue a NF de entrada) |
| B3 Mão de obra | Item conforme o fornecedor (KG, peça, serviço), nas categorias "Despesas com Industrialização" e "Serviços Tomados – PJ/PF" | Compras, 19/10 |
| B4 Unidades | Sem conversão no sistema (já testada, não atende) | N16-57 |
| B5 Lote e OC | Toda compra tem OC de origem; o estoque ainda precisa ser acertado com o PCP | BL-066 (custo obrigatório no lote) |
| B6 Base de preços | Produto × fornecedor × unidade × vigência | N16-41 |
| B7 Quem orça | O vendedor; sugestão de consultar a última OC efetivada | N16-41, N16-54 (o custo é de Compras e do setor orçamentário) |
| B8 Produto novo | O Fiscal cadastra antes do pedido de venda; prazo a confirmar com o Fiscal | ❓ |
| B9 a B12 Chapa e sobras | O aproveitamento é do PCP ou da Engenharia; a sobra reaproveitável vai ao estoque e o reuso aparece no simulador | N16-87, OQ-32 |
