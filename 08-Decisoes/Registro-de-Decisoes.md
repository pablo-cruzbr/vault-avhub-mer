---
tags: [decisoes, registro, dec, en, ec, n14, n16]
criado: 2026-10-14
atualizado: 2026-11-05
status: vigente
dono: Nathan
fontes: [v1 00-Indice/Registro-de-Decisoes-2026-10-07 (#1 a #99), v1 Decisoes-Chave-ERP e Perguntas-em-Aberto-Consolidadas (DEC-1 a DEC-12), v1 Encaixe-Estoque-Revenda-no-PCP (EN-01 a EN-07, EC-01 a EC-08), decisões do Nathan de 14/10/2026, decisões N16 de 16 a 26/10/2026 (pasta Proposta-Orcamento-Comissao, histórico), código de 14/10]
---

# Registro de decisões

**Em uma frase:** esta é a lista única de tudo o que a equipe já decidiu sobre o Aços Hub, uma decisão por linha, com data, quem decidiu e o que ela substitui; para uma visão rápida, comece pelas "Decisões mais importantes em linguagem simples" abaixo.

Lista única de decisões do projeto: **N16-01 a N16-148** (16/10 a 30/10), **N14-01 a N14-33** (14 e 15/10), **DEC-1 a DEC-12**, **EN-01 a EN-07**, **EC-01 a EC-08** e **#1 a #106** do registro de 07/10. Cada linha tem data, dono, selo e o texto completo da decisão. Decisões superadas ou ajustadas trazem a nota na coluna "Superada". Prefixos: DEC = decisão com prazo; EN = encaixe do Estoque e da Revenda no PCP; EC = encaixe do circuito de compra, da Qualidade e da baixa; `#n` = item do registro de 07/10. Selos: 📝 decidido, 🟡 proposta adotada, 🔴 aberto, ✅ conferido no código, ❓ não conferido em produção ([[Regras-do-Vault]]). Tarefas: [[Backlog-por-Frente]]. Contradições do v1: [[Contradicoes-Resolvidas]].

**Precedência:** código, dumps, este registro, [[00-Fluxo-Mestre-0b]], v1. Em conflito entre dois itens, vale o de data mais recente.

## Como usar este registro

- **Onde estão as decisões.** Cada época tem a sua tabela, numa nota à parte (desde a v3, para cada arquivo ficar abaixo de 25 KB): as decisões N16 (16 a 29/10/2026) sobre proposta, pedido, custo real, comissão e o que veio depois, em cinco notas por faixa de ID; as N14 (14 e 15/10); as DEC (com prazo, de setembro); as EN e EC (encaixe do Estoque, da Revenda e da compra no PCP); e as de número simples (#1 a #106), agrupadas por tema (ambientes, pipeline, Estoque e MES, equipe, Compras, nomes, contratos e custo do lote). A lista das notas está mais abaixo, em "Decisões de 16 a 26/10/2026" e em "Onde está cada decisão". O texto das decisões foi movido sem mudança.
- **As colunas.** *ID* é o código fixo da decisão (nunca muda). *Decisão* é o texto completo; o trecho em negrito no começo é o título e, nas linhas longas, "Em resumo" diz a mesma coisa em palavras simples. *Data* é quando se decidiu. *Dono* é quem decidiu (em geral o Nathan; "Claude (leitura do dump)" marca um fato lido no banco). *Selo* diz em que pé está. *Superada* liga a linha a outra decisão (veja abaixo).
- **Os selos.** 📝 decidido; 🟡 proposta adotada, ainda a confirmar; 🔴 aberto (e "🔴 sem código" é decidido, mas ainda não feito); ✅ conferido no código ou testado; ❓ não conferido. O texto depois do selo diz o que falta. Nas linhas antigas, "❓ não conferido em produção" quer dizer "não conferido na `develop`" (F5). Mais em [[Regras-do-Vault]].
- **Achar por ID.** Veja pela faixa qual nota tem o ID (por exemplo, `N16-60` está em [[Registro-N16-44-a-N16-72]] e `#42` em [[Registro-39-a-80]]), abra a nota e use Ctrl+F com o ID inteiro. Mais rápido: a busca do vault (Ctrl+Shift+F) com o ID acha a linha e onde ele é citado.
- **Achar por assunto.** Veja as "Decisões mais importantes em linguagem simples" e o "Índice por assunto" logo abaixo: cada linha do índice lista os IDs do assunto. Depois ache o ID como no item acima.
- **"Supera" e "completa".** A coluna *Superada* traz a decisão ligada e uma palavra entre parênteses. **Supera** (ou "substitui", "corrige", "ajusta") quer dizer que a linha troca o que a outra dizia, no todo ou "em parte"; a decisão antiga fica na tabela só como histórico e vale a mais recente. **Completa** (ou "esclarece", "refina") quer dizer que a linha acrescenta detalhe sem revogar a outra: valem as duas juntas. Em algumas linhas antigas a coluna aponta o inverso, a decisão nova que a substituiu (por exemplo, a N16-08 aponta a N16-60). Em conflito entre duas linhas, vale a de data mais recente.
- **Tarefas e contradições.** O que fazer com cada decisão está em [[Backlog-por-Frente]]; as contradições do v1 já resolvidas, em [[Contradicoes-Resolvidas]]. O fluxo completo está em [[00-Fluxo-Mestre-0b]], e a proposta e o pedido em [[01-Proposta-de-Venda|11-Proposta-e-Pedido-de-Venda]].

## Decisões mais importantes em linguagem simples

Resumo das decisões vigentes que mais pesam, agrupadas por assunto. O ID entre parênteses leva à linha completa.

**Proposta e pedido**

- A proposta aprovada vira pedido de venda pelo botão "Transformar em pedido de venda"; o pedido é criado no Omie por API, pela mesma fila da OC (N16-02).
- Uma proposta vale um pedido: não existe fechamento parcial, e proposta cancelada não vira pedido (N16-02).
- Ao transformar em pedido, o vendedor responde três coisas obrigatórias: a previsão de faturamento, se a Qualidade acompanha desde o zero e se o pedido pode faturar em partes (N16-05, N16-89).
- O pedido digitado direto no Omie segue o mesmo fluxo do pedido criado no Hub; o que veio do Omie só se altera no Omie (N16-106).
- "Sequencial" é só um agrupamento para o Fiscal faturar em partes, não outro pedido; o que se preserva é o código do produto (N16-94, N16-101).

**Orçamento**

- O Orçamento mantém o preço de compra de cada produto, sempre com histórico; o vendedor só consulta e decide o valor da proposta (N16-07, N16-52).
- A base de preço vem das ordens de compra efetivadas e da atualização do setor orçamentário, e vale sempre o valor mais atualizado (N16-41, N16-52).

**Compras e OC**

- Compra acima do valor da proposta: o vendedor aprova ou reprova, por produto, sem tolerância e sem prazo; se reprova, Compras leva o caso à Gerência numa conversa física (N16-76).
- Quem emite a OC acima de R$ 30 mil pode ser o próprio Gerente de Compras que a aprova, como o código faz hoje (N16-123).
- Lote 100% reprovado volta ao fornecedor e abre a recompra (RNC), e o Compras é avisado no av-hub (N16-126, N16-127).
- Uma nota fiscal pode trazer itens de mais de uma OC, e a conferência é por item da OC (N16-136).

**Custo real e comissão**

- A comissão nasce estimada na proposta, o custo real a recalcula, ela fecha sobre a NF depois de faturar e a Controladoria aprova uma vez, no final (N16-10).
- O custo real do item segue o valor da NF de entrada recebida, e não só o da OC (N16-40).
- O custo real e a compra acima do valor valem para o pedido que nasce de proposta e para o digitado direto no Omie (N16-102).
- O pedido digitado no Omie tem estimativa preenchida pelo vendedor, como hoje no Simulador de Comissão (N16-104).
- A comissão nova fica no schema `core_comissao`, separada do `core_comissionamento` atual (N16-143).
- O imposto da linha da OC vem da parte de compras do pedido quando a OC é de pedido de venda ou recompra; para estoque ou uso interno, o Comprador digita. Uma linha por pedido, frete rateado pelo valor (N16-144).

**Menu e telas**

- A tela da proposta é parecida com o Simulador de Comissão atual, com três visões: vendedor, Compras e Controladoria (N16-19).
- Menu enxuto: Vendas com quatro entradas (Propostas, Clientes, Meus Pedidos, Relatórios) e Orçamento com quatro (N16-107).
- A tela Histórico de compras saiu: Ordens de compra já mostra todo o histórico (N16-108).
- As telas do Pablo ficam; o Robert troca o backend delas em vez de refazer tudo (N16-119).

**Banco e API**

- Toda a API do comercial fica na `api-acos-vital`, reusando o que o Hub já tem; a `api-comercial` sai de produção (N16-111).
- O Hub é um sistema só: cada conceito tem uma tabela, uma rota e uma tela (N16-112).
- Não existirá `core_comercial`: a proposta fica em `core_vendas_faturamento` (N16-116).
- E-mail e notificações do Hub ficam para o futuro (N16-113).
- A pasta `api-comercial` do Pablo ficou no repositório só para leitura (N16-117) até 06/11/2026, quando saiu do av-hub (PR #261); o código fica legível no commit `f7d8d7f`.

**Quem faz o quê**

- O Robert começa pela proposta e faz as rotas; o Nathan cuida da tela e do começo da comissão; o Gustavo, do banco; o Pablo acompanha (N16-118, N16-117).
- Quem precisa da mercadoria (Expedição ou Produção) pede a retirada ao Estoque, e só o Estoque confirma; é aí que o saldo baixa (N16-120).
- Pedido integral ou por partes: quem decide é o vendedor, no pedido (N16-130).
- Só quem está vinculado à Qualidade libera ou reprova lote em quarentena (N16-124).

## Índice por assunto

Cada linha lista os IDs do assunto, para você ir direto às linhas da tabela (Ctrl+F no ID). Um ID pode aparecer em mais de um assunto.

- **Proposta (criar, aprovar, cancelar, tela):** N16-01, N16-02, N16-03, N16-04, N16-05, N16-12, N16-19, N16-24, N16-25, N16-26, N16-27, N16-28, N16-29, N16-31, N16-75, N16-115, N16-116, N16-118, N16-119, N16-160.
- **Pedido de venda e Omie (criar, alterar, impostos de venda):** N16-02, N16-30, N16-35, N16-36, N16-82, N16-83, N16-84, N16-90, N16-95, N16-102, N16-104, N16-106, N16-142.
- **Datas e previsão de faturamento:** N16-86, N16-88, N16-91, N16-96, N16-97, N16-104, #105, #106.
- **Faturamento em partes e pedido sequencial:** N16-89, N16-91, N16-92, N16-93, N16-94, N16-97, N16-99, N16-100, N16-101, N16-130.
- **Orçamento e base de preço (produto, fornecedor, score):** N16-06, N16-07, N16-16, N16-32, N16-41, N16-52, N16-54, N16-55, N16-56, N16-58, N16-59, N16-72, N16-104, N16-107, N16-108, N16-114, N14-02, #39.
- **Compras e OC (emissão, aprovação, requisição):** N14-03, N14-08, N14-14, N14-21, N14-23, N14-24, N14-25, N14-28, N14-29, N14-30, N14-33, DEC-3, N16-08, N16-123, N16-144, #50, #50b, #51, EC-04.
- **Compra acima do valor da proposta:** N16-159, N16-17, N16-18, N16-60, N16-61, N16-62, N16-63, N16-64, N16-65, N16-66, N16-67, N16-73, N16-76, N16-102.
- **Custo real (por evento, NF de entrada, imposto da OC):** N16-09, N16-20, N16-22, N16-23, N16-37, N16-38, N16-40, N16-48, N16-53, N16-57, N16-86, N16-102, N16-144.
- **Custo do lote e custo no Estoque:** #93, #94, #95, #97, #98, #99, N16-37, DEC-12.
- **Comissão (cálculo, Controladoria, relatórios):** N16-10, N16-11, N16-12, N16-21, N16-34, N16-35, N16-39, N16-42, N16-43, N16-44, N16-45, N16-46, N16-47, N16-48, N16-49, N16-50, N16-51, N16-74, N16-77, N16-78, N16-103, N16-104, N16-105, N16-143, #90.
- **Unidades e contas Omie:** N16-79, N16-80, N16-81, N16-83, N16-85, N14-31, DEC-1, EN-07, #31c.
- **Menu e telas:** N16-14, N16-19, N16-33, N16-107, N16-108, N16-119, N14-33, #54, #74.
- **Banco e API (onde cada coisa mora):** N16-15, N16-98, N16-154, N16-155, N16-109, N16-111, N16-112, N16-113, N16-116, N16-117, N16-143, N14-07, N14-15, N14-26, #3, #6, #82.
- **Quem faz o quê e cronograma:** N16-157, N16-158, N14-09, N14-10, N14-11, N14-13, N14-32, N16-115, N16-117, N16-118, #32, #33, #33b, #34, #35, #36, #37, #73, #75, #96, #27.
- **Estoque, retirada e baixa:** N14-05, N14-06, N16-87, N16-120, N16-121, N16-122, N16-139, N16-140, EN-01, EN-03, EN-04, EC-02, EC-05, DEC-4, #31b, #24, #25, #28, #29, #78, #100.
- **Recebimento e Qualidade:** N14-04, N16-124, N16-125, N16-126, N16-127, N16-128, N16-129, N16-134, N16-135, N16-136, N16-137, DEC-5, DEC-6, EC-01, EC-06, EC-07, #26.
- **PCP, Triagem e Produção:** N14-22, N16-93, N16-138, N16-141, EN-02, EN-05, EN-06, EC-03, #74, #78, #104, #105, #106.
- **Expedição e Fiscal:** N16-92, N16-93, N16-130, N16-131, N16-132, N16-133, N14-05.
- **Devolução e cancelamento:** N16-24, N16-47, N16-68, N16-69, N16-70, N16-71, N16-74, N16-84, DEC-10, #31.
- **Integração av-hub e MES:** DEC-2, N14-20, N14-28, N14-29, N14-30, N14-31, N16-127, N16-132, N16-133, N16-137, N16-142, #2, #10, #41, #42, #43, #44, #76, #84.
- **Pipeline Omie, ambientes e segurança:** N14-13, N14-16, N14-17, N14-18, N14-27, #1, #4, #5, #7, #8, #9, #11, #12, #13, #14, #15, #16, #17, #18, #19, #20, #22, #23, #87, #88.
- **Clientes, produtos e dashboards:** #49, #101, #102, #103.
- **Documentação, contratos e regras do vault:** N14-01, N14-19, #55, #56, #57, #60, #61, #62, #64, #65, #66, #67, #68, #69, #70, #71, #72, #79, #80, #81, #85, #89, #91, #92.
- **Prazos, retenção e itens adiados:** DEC-7, DEC-8, DEC-9, DEC-11, #17, #53, N14-17.

## Decisões de 16 a 26/10/2026 (proposta, orçamento, pedido de venda, custo real e comissão)

Tomadas pelo Nathan entre 16 e 26/10/2026, com respostas da Controladoria (Michele), de Compras e da Gerência. Desenham a proposta (`V0`), o Orçamento (`B1` a `B4`), o pedido de venda do Hub, as datas, o faturamento em partes, o custo real por evento e a comissão nova (`K1` a `K6`). O fluxo foi aprovado em 26/10/2026 ([[01-Proposta-de-Venda|11-Proposta-e-Pedido-de-Venda]] e `09-Diagramas/artifact-proposta-pedido.html`). Os contratos dessa parte foram removidos em 29/10/2026 ([[Contratos-da-v2]]); o Robert cria os novos.

A tabela fica em 6 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3). As linhas foram movidas sem mudança:

- [[Registro-N16-01-a-N16-43]]: N16-01 a N16-43
- [[Registro-N16-44-a-N16-72]]: N16-44 a N16-72
- [[Registro-N16-73-a-N16-96]]: N16-73 a N16-96
- [[Registro-N16-97-a-N16-116]]: N16-97 a N16-116
- [[Registro-N16-117-a-N16-149]]: N16-117 a N16-149
- [[Registro-N16-150-a-N16-155]]: N16-150 a N16-155 (modal "Transformar em pedido", Qualidade e refaturamento, 05/11/2026; refaturamento por unidade, 10/11/2026; a empresa emissora vira a própria unidade, 10/11/2026; sem migrations no repositório da API, 11/11/2026; sem carga do marco zero em 13/11, N16-156, 11/11/2026; dono de cada raia do fluxo 0b, N16-157, e a API do MES com o Robert, N16-158, 11/11/2026; compra acima do cotado, primeira etapa, N16-159, 11/11/2026; empresa, responsável e carteira de clientes da proposta, N16-160, pedidos do Robert de 11/11/2026)

## Onde está cada decisão

Estas seções ficam em notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3). O texto foi movido sem mudança:

- [[Registro-N14-01-a-N14-33]]: Decisões de 14/10/2026 (Nathan)
- [[Registro-DEC-EN-EC-e-1-a-38]]: DEC-1 a DEC-12 (decisões com prazo, de 21 e 22/09/2026) · EN-01 a EN-07 e EC-01 a EC-08 (encaixe do Estoque, da Revenda e do circuito de compra no PCP) · Ambientes e produção (#1 a #6) · Pipeline Omie e segurança (#7 a #20) · Estoque e MES (#21 a #31c) · Equipe e cronograma (#32 a #38)
- [[Registro-39-a-80]]: Compras, CCP e contratos (#39 a #53) · Nomes, documentação e achados (#54 a #80)
- [[Registro-81-a-100-e-Estado-no-Codigo]]: Contratos criados a partir do código (#81 a #96) · Custo do lote (#97 a #99) · Matéria-prima no atendimento (#100) · Estado no código das decisões que mexem em código (14/10/2026; linhas N16 lidas em 16/10/2026 no `api-comercial` 5aa5311)
