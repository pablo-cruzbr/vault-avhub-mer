---
tags: [fluxo, raia, custo-real, comissao, k1, k2, k3, k4, k5, k6, controladoria, simulador, tela, devolucao, apuracao, parte]
criado: 2026-11-05
estado-em: 2026-11-10
status: proposta
dono: Nathan (fluxo) · Gustavo (banco e API) · Robert (custo no MES) · Michele (decisão da comissão)
parte-de: "[[15-Custo-Real-e-Comissao]]"
develop-conferida: [api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, app-pcp 4c11886, omie-elt-pipeline master 0593c9f, em 2026-11-10]
fontes: [Registro-de-Decisoes (N16-09 a N16-11, N16-17 a N16-23, N16-34 a N16-51, N16-57, N16-71, N16-74), Proposta-Orcamento-Comissao/01-Decisoes/Respostas-da-Controladoria-2026-10-19 (fora do vault), Proposta-Orcamento-Comissao/01-Decisoes/Respostas-de-Compras-2026-10-19 (fora do vault), Estudo-Omie-API, 09-Diagramas/fontes/tela-simulador-comissao.png, av-hub comissoes/simulador/page.tsx e lib/simulador/motor.ts, 03-Sistemas/Comissao/01-Motor-Atual-Como-Calcula, 00-Fluxo-Mestre-0b, 03-Estoque-Atendimento-e-Despacho, 04-Circuito-de-Compra, Modelo-Estoque-e-Custo-do-Lote, API-008, LOG-47, 10-Anexo-Fora-do-Fluxo/Comissoes, api-pcp (estoque.prisma, compras.service.ts), 09-Diagramas/artifact-proposta-pedido.html, api-pcp develop de 27/10/2026 (GET /itens/custo, custo da OC), N16-143, N16-144, BL-067, BL-088, OQ-51, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Custo real e comissão no fluxo (K1 a K6): detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[15-Custo-Real-e-Comissao]] (parte 1 de 2): Os nós K1 a K6; Como o custo real atravessa o fluxo; O exemplo do Nathan; As condições de cada evento de custo (N16-20).

**Onde estamos:** ← [[15-Custo-Real-e-Comissao]] (resumo e índice) · partes: **15-Custo-Real-e-Comissao-Detalhe-Tecnico-1** · [[15-Custo-Real-e-Comissao-Detalhe-Tecnico-2]]

## Os nós K1 a K6

Os `K` seguem o desenho do Nathan (artifact); o detalhe vem de N16-10, N16-42 a N16-51 e N16-74.

| Nó | O que acontece | Quando |
|---|---|---|
| `K1` | **Comissão estimada** nasce na proposta (`V0.3`), pelo motor atual (percentual final = menor entre o do vendedor e o de compras), numa tela semelhante à do Simulador de Comissão (N16-19). O vendedor só vê a comissão que ele colocou. Parâmetros: os de **"Maio/23"** continuam, com vigência (N16-39); o **encargo** entra no **preço sugerido**, não no custo | ao criar e a cada revisão da proposta |
| `K2` | **Recalcula com o custo real**, por evento: OC (com o valor da NF de entrada no recebimento), lote do Estoque, matéria-prima da produção. **Cada evento carrega as suas condições** (N16-20). Enquanto o custo do item não cobre a quantidade, o custo é **parcial**, e a comissão só vale para as **peças com custo real** (N16-48) | a cada evento de custo |
| `K3` | **Fecha por nota fiscal** (`O1`). **Cada nota fecha com o percentual vigente naquele momento**, com o custo real que já entrou. Chega à Controladoria **já calculada**. O mesmo item pode sair em várias notas, **sem pagar duas vezes a mesma quantidade** (N16-49). Quando o custo completa depois da decisão, a diferença (complemento ou desconto) vai para a **apuração seguinte, para nova decisão** | quando o Omie emite a nota |
| `K4` | **Decidem a Controladoria, a Gerência ou a Coordenação**, com as mesmas permissões: aprovar, desaprovar, bloquear (e **desbloquear**), cortar ou alterar, por **valor ou percentual, sem teto**, **sempre com justificativa** e rastro (quem, quando, valor anterior e novo). **Ninguém decide sobre a própria comissão** (N16-44, N16-45). A Controladoria também tem a visão geral e os relatórios (N16-50) | depois de `K3` |
| `K5` | **O vendedor vê a comissão real**, com a **justificativa**, **só depois da decisão** (N16-46). Desaprovada aparece com **R$ 0 e o motivo** | depois de `K4` |
| `K6` | **NF cancelada, devolvida ou recusada**: a comissão é **abatida na mesma proporção**. Se ainda não foi paga, reduz o valor a pagar; **se já foi paga, o desconto entra na próxima apuração** do vendedor (N16-47). A devolução **total** vem do Omie; a **parcial** só chega marcada, e o Fiscal ou a Controladoria **informam o que voltou** (N16-74) | depois da nota |

Regras de visibilidade: o vendedor só vê a estimada que ele colocou e a **comissão real depois da decisão** (N16-10). Na aprovação de **compra acima do valor** (`C8`), ele vê o valor da compra do produto dele e **aprova ou reprova** (N16-60); isso **supera** a regra antiga de que não havia aviso (N16-18). A Controladoria vê o custo real e a diferença.

## Como o custo real atravessa o fluxo

Regra (N16-09, N16-40): o custo real de um item do pedido é a **soma das linhas** (OC, NF de entrada ou lote); o unitário médio é o total dividido pela quantidade; o custo do pedido é a soma dos itens. Cada linha guarda data, material, origem, quantidade e valor. Linhas podem ser parciais (5.01, 5.02… do item parcial do MES).

**A linha da OC nasce na aprovação da OC, com o valor da OC (provisório), e vale só até o recebimento: no recebimento, o valor da NF de entrada a substitui** (N16-23, N16-40), porque a maioria dos materiais é comprada por KG pelo peso teórico e a NF pode divergir da balança. OC cancelada antes de receber estorna a linha. O **lote** é de uma OC específica: identifica a OC e **não soma o custo de novo** (N16-37).

| Nó | O que entra no custo real | Origem da linha | Selo |
|---|---|---|---|
| `C4` | O valor da OC, por item, vinculado ao pedido de venda (`ordens_compra_itens_vinculos`); inclui a **OC de mão de obra** (categoria "Despesas com Industrialização", ou "Serviços Tomados" com o Nº do Pedido do Fornecedor apontando um PV) | `OC` | 🔴 linha por evento; vínculo ✅ (`api-acos-vital`) ([[Contratos-da-v2\|LOG-14b]]) |
| `C7` | Compras usa o valor correto; a proposta **não muda**; se for maior que o da proposta, o vendedor aprova ou reprova (`C8`) | `OC` | 📝 N16-08, N16-17, N16-60 |
| NF de entrada | No recebimento, o valor da NF substitui o da OC. **O CCP vincula a NF de entrada à OC**, na tela de Follow-up, e o item do pedido vem do vínculo da OC (a ligação automática do Omie não existe na prática; N16-57, N16-86), inclusive com várias NFs por OC e KG contra PC. A NF traz **imposto real** e a **data real de recebimento** | `NF_ENTRADA` | 🔴 recurso novo na pipeline ([[Estudo-Omie-API]]) |
| `R4` | O lote nasce com custo, **obrigatório**: valor total e valor por item; no fim, o valor unitário | `OC` (ou `CARGA_INICIAL`, `MANUAL`) | ✅ (`api-pcp`) o lote do Recebimento nasce com o custo da OC na `develop` do MES (19/10, `97b9adc`); 🔴 custo obrigatório (N16-09, BL-066). ❓ o dado de estoque hoje não é confiável (aviso de Compras) |
| `E3` | Item atendido pelo Estoque usa o **custo real do lote** (o da OC que o originou) | lote | ✅ (`api-pcp`) `GET /itens/custo` existe na `develop` do MES (27/10, `6c11147`); 🔴 teste junto com o job do hub e merge do MES para a `main` (BL-035) |
| `E5` | O fabricado aprovado vira lote; o custo do lote fabricado é **só a matéria-prima** | `PRODUCAO` | ✅ (`api-pcp`) o lote `PRODUCAO` existe na `develop` (27/10); 🔴 o custo do fabricado (BL-067) ([[Contratos-da-v2\|LOG-53]]): `GET /itens/custo` deixa o fabricado de fora (`api-pcp` `src/integracao-avhub/itens-custo.ts:9`, `fabricado fica de fora até o custo da matéria-prima`). Na validação local em Docker de 10/11/2026 o item fabricado chegou ao Hub com `quantidade_com_custo = 0`, embora 4 barras de R$ 50 da OC tenham sido consumidas |
| `F1` | A matéria-prima enviada à produção para o item fabricado (J2, J3) | lote da matéria-prima | 🟡 a `develop` baixa a matéria-prima no "Atender pelo estoque" (19/10); a baixa na retirada (N16-140) e o custo da matéria-prima no fabricado são 🔴 (BL-010) |
| `O1` | Fecha a comissão sobre a NF | NF | ✅ lado Omie; `K3` 🔴 |

Hoje o código tem a base: `lote_custo` (`api-pcp/prisma/models/estoque.prisma`, opcional hoje), `OrigemCusto` `CARGA_INICIAL`, `OC`, `MANUAL` (as três já gravadas na `develop` do MES), `GET /itens/custo` publicado pelo MES na `develop` (27/10) e a tabela `itens_pedido_custo` no hub com o job que o lê (`itens_pedido_custo.job.js:78`) ([[Contratos-da-v2|API-008]], [[Contratos-da-v2|LOG-47]]). O que as decisões acrescentam: custo **obrigatório**, linhas **por evento**, a **NF de entrada como verdade** do valor, e a soma por item do pedido.

### Sobras de chapa ❓

Quando o item é fabricado com chapa, quem calcula o aproveitamento é o **PCP ou a Engenharia**; Compras só registra nas observações da OC. Se **não há sobra aproveitável**, o custo todo da chapa vai para o pedido. Se há, a sobra **vai ao Estoque** (e quem a controla é o Recebimento e o PCP). **Falta definir como a sobra aproveitável ganha custo** e como esse custo entra no pedido que a usa (OQ-32).

## O exemplo do Nathan

Pedido com 5 itens: A. 50 Flanges; B. 1 Mão de obra; C. 50 Tubos; D. Flange sobre desenho; E. 50 Flanges cegas. Na proposta, o vendedor pôs as 50 flanges (A) a **R$ 100** o unitário. A compra, dividida em dias, fecha em **R$ 150** o unitário. **Só os R$ 100 e R$ 150 são do Nathan; os demais valores abaixo são ilustrativos 🟡 (Claude), para mostrar o cálculo.**

| Dia | Evento (PCP e Compras) | Item | Origem | Linha de custo | Custo acumulado do item |
|---|---|---|---|---|---|
| 01 | Requisição de 50 tubos | C | OC | 50 × R$ 80 = R$ 4.000 | C: 50 de 50, R$ 4.000, unitário R$ 80 (completo) |
| 01 | Requisição de 10 flanges | A | OC | 10 × R$ 140 = R$ 1.400 | A: 10 de 50, R$ 1.400 (**parcial**) |
| 02 | 20 flanges | A | OC | 20 × R$ 150 = R$ 3.000 | A: 30 de 50, R$ 4.400 (parcial) |
| 03 | 1 mão de obra | B | OC de serviço | 1 × R$ 1.200 = R$ 1.200 | B: 1 de 1, R$ 1.200 (completo) |
| 03 | O restante das flanges normais | A | OC | 20 × R$ 155 = R$ 3.100 | A: 50 de 50, R$ 7.500, **unitário R$ 150** (completo) |
| 04 | As 50 flanges cegas já estão no estoque | E | lote | 50 × R$ 90 = R$ 4.500 (custo real do lote, o da OC que o originou) | E: 50 de 50, R$ 4.500, unitário R$ 90 |
| 05 | O PCP manda a matéria-prima para a flange sobre desenho | D | lote da matéria-prima | custo só da matéria-prima, por exemplo R$ 600 | D: custo da matéria-prima; completo quando a quantidade do item está coberta |

Custo do pedido (itens completos, valores ilustrativos): R$ 4.000 + R$ 7.500 + R$ 1.200 + R$ 4.500 + R$ 600 = R$ 17.800. No recebimento de cada compra, o valor da NF de entrada substitui o da OC naquela linha.

O item A mostra a regra: o vendedor cotou R$ 100 o unitário (R$ 5.000 as 50); o custo real fecha em R$ 150 (R$ 7.500). O **preço de venda não muda** (N16-17). Como a compra ficou **mais cara que a proposta, o vendedor aprova ou reprova** a compra de cada produto (`C8`); se aprova, a margem e a comissão caem.

### O que acontece com a comissão no exemplo

| Momento | `K` | O que o sistema faz | Quem vê |
|---|---|---|---|
| Proposta criada | `K1` | Estima a comissão com o custo cotado (A a R$ 100) | o vendedor vê a estimada que ele pôs |
| Dia 01 a 03 | `K2` | A cada linha de custo recalcula. Enquanto A está **parcial**, **só as peças com custo real entram na comissão**; o restante espera (N16-48) | a Controladoria vê o custo real e a diferença |
| Dia 01 a 03, compra acima do valor | `C8` | O vendedor é avisado em Meus Pedidos e aprova ou reprova a compra de A | o vendedor vê o valor da compra de A |
| Dia 03, A completo | `K2` | A fecha a R$ 150; a margem do item cai; a comissão cai. A diferença das peças que entraram depois vai para a **apuração seguinte**, para nova decisão | só a Controladoria |
| Depois do faturamento (`O1`) | `K3` | Fecha sobre a NF, já calculada, com o percentual vigente naquele momento | Controladoria |
| Decisão | `K4` | Controladoria, Gerência ou Coordenação aprovam, desaprovam, bloqueiam, cortam ou alteram, com justificativa | **agora** o vendedor vê a comissão real e a justificativa (`K5`) |
| Devolução da nota | `K6` | Total: abatimento de 100% sozinho. Parcial: pendência para Fiscal ou Controladoria informarem o que voltou; depois, abatimento proporcional | Controladoria; o vendedor vê o desconto com o motivo |

### Várias notas, mesmo item (N16-49)

Exemplo da Michele: venda de R$ 1.000 a 2%, com notas de 500, 100, 100, 100, 100 e 100: a comissão é paga a 2% sobre cada nota. Se o custo real muda entre uma nota e outra, **cada nota fecha com o percentual vigente naquele momento**; quando o custo completa, o sistema recalcula o percentual final e **lança a diferença na apuração seguinte**. O banco guarda a **quantidade já comissionada** por item e nunca paga duas vezes a mesma peça (testado em 19/10).

## As condições de cada evento de custo (N16-20)

Um item de 50 unidades pode ter 50 OCs diferentes: cada uma com a sua condição de pagamento, encargo, impostos, frete e fornecedor. Por isso o custo real **não** usa um conjunto de condições por pedido. A regra:

| Lado | Condições | De onde vêm |
|---|---|---|
| **Venda** | **Um conjunto por pedido**, como no Simulador: estado de destino e ICMS, condição de pagamento e encargo, "com impostos", valor ST, imposto retido ou DIFAL, frete na venda | a proposta (`V0.2`, `V0.3`); na tela da Controladoria, as mesmas |
| **Custo real** | **Um conjunto por evento**: fornecedor, condição de pagamento, IPI, ICMS, ST, DIFAL, frete, origem do fornecedor (por exemplo, optante pelo Simples) | a OC (`C4`, `C7`) ou a **NF de entrada** (imposto real), o lote (`R4`, `E3`) ou a matéria-prima (`F1`) |

- O **custo líquido de cada evento** é calculado com as condições do próprio evento, pela **mesma fórmula do motor** (compra, IPI e crédito de ICMS em `lib/simulador/motor.ts:277-283`; frete e custo líquido em `:307-312`, ver [[01-Motor-Atual-Como-Calcula]]). Depois **soma**: o custo líquido do item é a soma dos eventos e o unitário médio é o total dividido pela quantidade coberta. O custo do pedido é a soma dos itens. **O encargo da condição de pagamento NÃO entra no custo**: entra no **preço sugerido**, como no motor atual (N16-22).
- **Imposto da compra.** O vendedor registra os impostos na proposta; ao chegar a requisição, o sistema os **puxa para a OC**, Compras os confere e edita **no hub**, e o que edita **volta ao Omie pela mesma sincronização da OC** (N16-38, N16-53). O hub **não** guarda hoje IPI, ICMS, ST nem DIFAL por item; **o Omie guarda** ICMS, ST, IPI, PIS e COFINS por item do pedido de compra, **em valor e sem DIFAL**, e a **NF de entrada** traz base, alíquota e valor ([[Estudo-Omie-API]]). **O Nathan traz esses dados do Omie para o hub.** O **DIFAL da compra** fica fora do custo líquido (provisório, Compras valida). Conferido em 29/10/2026 no dump: `ordens_compra_itens` ainda não tem coluna de imposto. Pela N16-144 (29/10), o imposto da linha da OC vem da **parte de compras do pedido** (o que o vendedor preencheu, N16-38 e N16-106) quando a OC é de pedido ou de recompra; nas OCs de estoque ou uso interno o Comprador digita; a edição na OC não volta ao pedido.
- Até os campos existirem, o evento calcula **sem imposto** (como o Ciclo 1) e a linha mostra "sem imposto" 🟡; a Controladoria vê que o custo está sem o imposto real. O impacto no cronograma está na proposta de cronograma (`Proposta-Orcamento-Comissao/07-Cronograma/Proposta-de-Cronograma.md`, fora do vault, a validar).
- No exemplo do Nathan (item A), cada requisição vira uma OC com o seu fornecedor, a sua condição e o seu imposto. O custo líquido de A é a soma das três, cada uma com as suas condições. Impostos e encargos de cada uma são "a definir": **não há valor inventado aqui** 🟡.

### Drill-down por evento (visão da Controladoria)

Na tela da Controladoria, cada item abre a **lista dos seus eventos de custo**. Colunas propostas 🟡:

| Coluna | Observação |
|---|---|
| Data e origem | `OC`, `NF_ENTRADA`, `LOTE`, `MATERIA_PRIMA`, `CARGA_INICIAL`, `MANUAL` (origens do MES em `estoque.prisma:378-382`, mais a NF de entrada e a matéria-prima do fabricado) |
| Documento | número da OC, NF de entrada, lote, parcial do MES (5.01, 5.02…) |
| Fornecedor e condição de pagamento | com o encargo do evento só para auditoria (N16-22) |
| Quantidade e preço | preço de compra do evento |
| IPI, ICMS, ST, DIFAL, frete | do evento; "sem imposto" enquanto não houver o imposto real |
| Custo líquido do evento e unitário | pelo motor |
| Cotado × real | o que o vendedor pôs para a mesma quantidade e a diferença (só a Controladoria vê) |
| Estado da linha | normal, estornada (OC cancelada), "unidade diferente", "sem imposto" |

Fonte de cada linha: eventos de custo realizado por item no `core_vendas_faturamento` e cálculos da comissão. O vendedor **não** vê esta lista.
