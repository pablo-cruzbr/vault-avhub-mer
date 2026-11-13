---
tags: [decisoes, perguntas, oq, consulta, proposta, orcamento, comissao, staging, parte]
criado: 2026-11-05
estado-em: 2026-11-13
status: proposta
dono: Nathan
parte-de: "[[Perguntas-Proposta-Pedido-Comissao]]"
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [Proposta-Orcamento-Comissao/00-Briefing-Decisoes (OQ-02 a OQ-12, fora do vault), Proposta-Orcamento-Comissao/08-Reuniao/Proposta-Orcamento-Pedido-Comissao.docx (fora do vault) (perguntas das seções 4 e 5), Modelo-de-Consulta, protótipo api-comercial (commit 5aa5311; removido do av-hub em 06/11/2026, PR #261, dd9d729; legível em f7d8d7f), Dump Avhub 14/10, Registro-de-Decisoes (até N16-155), LOG-56 (R7 e R11), CON-03 da v2 (Contratos-da-v2), develop de 11/11/2026 (api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, omie-elt-pipeline master 0593c9f)]
---

# Perguntas: detalhe da OQ-02 à OQ-30, consultas e perguntas do documento de 16/10

**Em uma frase:** parte da nota [[Perguntas-Proposta-Pedido-Comissao]] com o contexto e as opções de cada pergunta da OQ-02 à OQ-30, a resposta que cada uma recebeu, as consultas que saem daqui e as perguntas do documento de 16/10.

**Onde estamos:** ← [[Perguntas-Proposta-Pedido-Comissao]] (resumo e índice) · partes: [[Perguntas-Proposta-Pedido-Comissao-Quadro-Geral]] · **Perguntas-Proposta-Pedido-Comissao-OQ-02-a-OQ-30**

**Como ler:** cada pergunta abre com a **Situação** (conferida em 11/11/2026). O contexto e as opções ficam como estavam quando a pergunta foi feita: são o histórico de por que a decisão foi tomada. As citações ao `api-comercial` são do protótipo do Pablo, que foi removido do av-hub em 06/11/2026 (PR #261, commit `dd9d729`) e não é fonte de estado; o texto antigo fica legível no commit `f7d8d7f`. Das 28 perguntas desta parte (a OQ-18 nunca foi usada), 25 estão respondidas, 1 está aberta (OQ-07) e 2 estão adiadas (OQ-21 e OQ-28).

## 2. OQ-02 a OQ-12 (do briefing)

### OQ-02 · Prazo de resposta do pedido de custo e o que fazer se vencer

**Situação.** ✅ Respondida (N16-58, N16-59): sem prazo fixo; o sistema cronometra o tempo e o vendedor nunca fica bloqueado. O setor orçamentário é novo; o Moisés é uma das pessoas (N16-104).

**Contexto (histórico).** N16-06 mandava ter prazo, sem valor. O protótipo `api-comercial` tinha `SolicitacaoCusto.prazoResposta` obrigatório e prazo padrão de 2 dias úteis ("SLA padrão", `api-comercial/src/modules/custos/custos.routes.ts:378`), com a fila mostrando `ATRASADA`, `VENCE_HOJE` ou `NO_PRAZO` (`:338`) e a rota `POST /solicitacoes_custo/:id/liberar` (`custos.routes.ts:500`). O protótipo saiu do av-hub; não conta como pronto.

**Opções que estavam na mesa.** Para o vencimento: (a) só destacar na fila do Orçamento; (b) avisar o gerente do Orçamento; (c) liberar o vendedor para cotar sozinho; (d) cancelar a solicitação. Para o prazo: fixo, escolhido pelo vendedor, ou por tipo de produto. O default era 2 dias úteis com aviso ao gerente; a decisão foi não ter prazo fixo.

### OQ-03 · Quem decide o que fazer com o cliente quando o custo real passa do cotado?

**Situação.** ✅ Respondida pelas N16-61 e N16-69, fora do sistema: compra acima da proposta pede a aprovação do vendedor; reprovada, a Gerência decide em conversa física; sem acordo, o pedido pode ser cancelado e o vendedor renegocia com o cliente. A diferença que aparece depois, pela NF de entrada (N16-40), reduz a comissão, e a Controladoria a vê (N16-18). O João Vitor pode contestar.

**Contexto (histórico).** Renegociar o preço, absorver a perda ou cancelar é decisão de pessoas. Opções: o vendedor com a Gerência; só a Gerência; o vendedor sozinho dentro de um limite. O default (decisão fora do sistema, a Gerência com o vendedor) é o que as decisões confirmaram.

### OQ-04 · Quem aprova desconto e margem, e até quanto cada um aprova?

**Situação.** ✅ Respondida (N16-75): tudo fisicamente; não há alçada no sistema. Reforça a N16-12.

**Contexto (histórico).** Opções: alçadas por faixa de desconto, de margem, por valor total ou por cliente; um aprovador por faixa.

### OQ-05 · Relatórios da visão geral da Controladoria

**Situação.** ✅ Respondida pela Michele (N16-50): lista por mês, vendedor, unidade e status, com exportação para Excel; markup real por vendedor; Faturamento × Compras por pedido, separando Revenda, Industrializado e Projeto, com sinal de recompra.

**Contexto (histórico).** A Controladoria vê tudo e tem a visão geral das comissões (N16-10). Candidatos: comissão por vendedor e mês; estimada × real × final; pendentes de decisão; decididas por ação; cotado × real por proposta; comissões de propostas canceladas.

### OQ-06 · Bloqueio, blacklists e coordenadores no módulo novo

**Situação.** ✅ Respondida (N16-34, N16-43): bloqueio por NF, listas de clientes e de vendedores, regras fixas e coordenadores valem todos no módulo novo, em tabelas novas; a Michele confirmou os detalhes.

**Contexto (histórico).** N16-11 traz o motor atual para a proposta. Os coordenadores eram `comissao_coordenadores`, lidos de JSON no front ([[Contratos-da-v2\|LOG-42]]). Opções: copiar tudo com listas separadas; listas compartilhadas; coordenadores no módulo atual.

### OQ-07 · Custo obrigatório em todo lote, inclusive na carga inicial de 13/11

**Situação.** **Aberta.** Pergunta: na carga inicial do marco zero (13/11/2026), o lote sem custo é recusado ou entra com custo `MANUAL` e motivo? Quem responde: Robert, com o Nathan. Trava: BL-066 e BL-031 e o marco zero (M5).

**Contexto.** N16-09 torna o custo obrigatório em todo lote e supera o #93. A `develop` ainda aceita custo opcional na carga inicial (`api-pcp` `src/estoque/operacao/estoque-operacao.service.ts:634` (`dto.custoUnitario && dto.custoUnitario > 0`)), a carga é de um lote por chamada e a carga em lote (G1) não existe. A origem `MANUAL` já existe no MES (`api-pcp` `prisma/models/estoque.prisma:375` (`MANUAL`)). Exigir custo de todo o saldo inicial é trabalho de Compras e Controladoria, não só de código.

**Opções.** (a) Obrigatório já na G1: sem custo, a linha não entra; (b) obrigatório no Recebimento (`R4`) e, na carga inicial, custo informado ou custo `MANUAL` com motivo obrigatório e auditoria; (c) obrigatório só depois do marco zero. **Default 🟡:** (b). A estimativa está em `Proposta-Orcamento-Comissao/07-Cronograma/Proposta-de-Cronograma.md` (fora do vault, a validar). Ligada à OQ-38 (o saldo está confiável?).

### OQ-08 · OC de serviço (mão de obra) existe no Compras?

**Situação.** ✅ Respondida por Compras (19/10): mão de obra se reconhece pela categoria "Despesas com Industrialização", ou "Serviços Tomados – PJ/PF" com o campo "Nº do Pedido do Fornecedor" apontando um PV.

**Contexto (histórico).** N16-09 diz que a mão de obra é gerada na OC e entra no custo. O item da OC exige produto do cadastro ([[Contratos-da-v2\|LOG-36]]) e só tem `tipo_material` `acabado` ou `nao_acabado` ([[Estados-e-Status]]). O default era tratar o serviço como produto do cadastro, vinculado ao pedido (`ordens_compra_itens_vinculos`).

### OQ-09 · Se o Omie recusar o pedido criado no hub

**Situação.** ✅ Respondida (N16-36): o pedido fica com `status_sincronizacao_omie = erro` e o motivo, o vendedor vê o erro e tem o botão "Tentar novamente"; a proposta segue `APROVADA` e a marcação da Qualidade não se perde. ✅ Na `develop`: `av-hub` `components/Propostas/PropostaForm/AndamentoProposta.tsx:87` (`status_sincronizacao_omie === 'erro'`).

**Contexto (histórico).** A pergunta supunha que o pedido seguiria o padrão da OC, por fila na pipeline (`omie-elt-pipeline` `src/jobs/envioOrdensCompra.ts`, em que a OC com erro sai da fila e só volta por "Reenviar"; [[06-Circuito-de-Compra]]). Não foi assim: o pedido de venda é enviado de forma síncrona pela API, na mesma requisição do `/transformar`, sem fila (N16-149; `LOG-56` (`06-Contratos/Ativos/LOG-56-Transformar-Proposta-em-Pedido`)).

### OQ-10 · Matriz de preços: dimensões

**Situação.** ✅ Respondida (N16-32), confirmada por Compras (19/10): produto × fornecedor × unidade × vigência. Quantidade, moeda e condição de compra ficam para depois.

**Contexto (histórico).** N16-07 diz que a matriz será criada. O protótipo `api-comercial` tinha só a oferta por produto e fornecedor, com histórico e média (`Oferta`, `suprimentos.prisma:138-183`).

### OQ-11 · De onde vêm o IPI, o ICMS, a ST e o DIFAL reais de cada evento de custo

**Situação.** ✅ Respondida (N16-38) e completada pela N16-144: o vendedor preenche o imposto na parte de compras da proposta; a OC de pedido traz esse imposto por item, e a OC para estoque ou uso interno tem o imposto digitado pelo Comprador, que pode editar antes de aprovar. O Omie guarda o imposto da OC e o hub o traz (N16-53). 🔴 Sem código; o contrato será escrito quando o desenvolvimento começar.

**Contexto (histórico).** N16-20: cada evento de custo carrega as suas condições. A OC do hub não guarda IPI, ICMS, ST nem DIFAL por item (N14-23 deixou o Ciclo 1 sem imposto); o desenho era a PS-014 e o BL-053. Opções: campos novos na OC; a NF de entrada; as duas.

### OQ-12 · Encargo financeiro do evento

**Situação.** ✅ Respondida (N16-22): o encargo da condição de pagamento entra no **preço sugerido**, como no motor atual, e não no custo do evento; o percentual é cadastrado por condição.

**Contexto (histórico).** Opções: calcular das parcelas da OC; cadastrar o percentual por condição de pagamento (ex.: 28/45, 1,5%).

## 3. OQ-13 a OQ-30 (descobertas ao documentar)

| ID | Contexto e origem (histórico) | Opções | Situação |
|---|---|---|---|
| **OQ-26** Quem marca "aprovada" | A aprovação da Gerência é física (N16-12), mas o sistema precisa de um estado "aprovada" que libere o `V0.6` (N16-02) e trave a edição (N16-03). O protótipo `api-comercial` tinha `StatusProposta` sem esse papel (`ABERTA`, `PARCIAL`, `FECHADA`, `PERDIDA`, `enums.prisma:69-76`) | (a) o vendedor marca e confirma a aprovação física; (b) só a Gerência marca; (c) o vendedor marca e a Gerência confirma depois | ✅ N16-25: (a), gravando quem, quando e qual revisão. O João Vitor pode contestar |
| **OQ-27** "Cancelada" é "perdida"? | O briefing fala em proposta cancelada; o protótipo tinha `PERDIDA` com motivo e `reabrir` (`propostas.service.ts:555-606`) e `POST /:id/duplicar` (`propostas.routes.ts:125`) | (a) um estado só, `CANCELADA`; (b) `PERDIDA` e `CANCELADA`; reabertura nunca ou só antes de aprovar | ✅ N16-24: um estado só, `CANCELADA`, que não reabre. O ciclo antigo segue na PS-035 |
| **OQ-13** Evento do custo real | N16-09 diz "por evento" e "vem da ordem de compra", sem dizer quando a linha nasce. Origem: exemplo do Nathan (dias 01 a 05) | OC emitida, aprovada ou recebida; lote na reserva (`E3`) ou na saída (`E6`) | ✅ N16-23 e N16-37: o custo vem da OC aprovada; o lote só identifica a OC de origem. N16-40: no recebimento vale o valor da NF de entrada |
| **OQ-14** Dois números do pedido | N16-04 diz "só números" e "sincroniza com o Omie". O Omie atribui o próprio número, que é a chave no MES. A OC usava `OC-000001` por unidade (`fn_proximo_numero_documento`, Dump Avhub 8110-8140) | Sequência por unidade ou por empresa emissora e ano | ✅ N16-26: por unidade e tipo; o número do Omie segue a chave no MES. N16-148: o banco guarda só dígitos e o prefixo aparece só na tela e no PDF. A emissora é a própria unidade (N16-154) |
| **OQ-15** Liberação gravada na criação | `pedidos_vendas_liberacao` tem chave com o número do Omie e `acompanhamento_qualidade` obrigatório (Dump Avhub 18285-18296); o número do Omie só existe depois da resposta | (a) a pipeline grava ao trazer o pedido; (b) gravar na resposta do `IncluirPedido`; (c) trigger | ✅ **Fechada, superada pelo R7 do LOG-56 (Nathan, 09/11/2026):** o `/transformar` grava a Qualidade só em `core_comercial.pedidos_venda` e não cria a liberação; a Liberar Pedidos mostra a resposta como valor inicial e a liberação segue sendo ato do vendedor (`LOG-56` (`06-Contratos/Ativos/Partes/LOG-56-Transformar-Proposta-em-Pedido-Detalhe-1`), §7.3). Criar a linha faria o pedido nascer importável pelo MES sem ninguém liberar |
| **OQ-16** Etapa e campos do pedido no Omie | A view da liberação só aceita pedido com `etapa <> 0` ([[03-Pedido-de-Venda-e-Liberacao]] regra 10); etapa 0 é orçamento no Omie | Etapa de "Pedido de venda" da conta; campos: vendedor, condição, parcelas, projeto, frete | ✅ Etapa sempre `"10"` e primeiro teste com `bloqueado = "S"` (N16-149); CFOP e cenário (N16-83); o Omie aceita o nosso número (N16-82); conta corrente padrão por conta Omie (R11 do LOG-56; PS-041 fechada). Resta o teste com a conta corrente no Omie (BL-081) |
| **OQ-17** Pedido mexido no Omie depois | Se alguém altera ou cancela o pedido no Omie, a proposta e a comissão estimada divergem. Origem: [[Contratos-da-v2\|LOG-45]] e #15 | (a) só aviso; (b) pedido cancelado cancela a proposta | ✅ N16-30: (a), a pipeline traz a mudança. N16-84: quem cancela é o vendedor, por API. O teste segue na OQ-48 |
| **OQ-19** Pedido sem proposta | Para o pedido que chega do Omie sem proposta não há `V0.3`, logo não há `K1` (N16-05) | (a) a comissão nasce na NF sem estimativa; (b) o vendedor preenche uma estimativa | ✅ N16-35 dizia (a); a **N16-104 corrigiu para (b)**: o vendedor preenche como faz hoje no Simulador, e o percentual final é o menor entre o dele e o do custo real |
| **OQ-20** "Parte de compras vazia" | N16-03 impede aprovar proposta incompleta; o protótipo aceitava item sem custo (`origemCusto = SEM_CUSTO`, `vendas.prisma:144`) | (a) qualquer item sem custo e sem fornecedor; (b) só quando todos estão vazios; (c) serviço fora | ✅ N16-31: (a) |
| **OQ-21** Perfis e permissões | N16-13: "cada perfil recebe o seu módulo". O protótipo derivava a capacidade de telas (`propostas`, `custo-item`, `simulador`, `capacidades.ts:47-56`) | Lista de perfis por módulo; quem vê custo, margem e comissão estimada | ⏸ N16-85: os perfis novos são cadastrados depois das telas. Responde o Nathan; o Gustavo cadastra |
| **OQ-22** PTAX de que dia | N16-13: a PTAX do hub. O protótipo guardava `cotacaoMoeda` (`vendas.prisma:62`) e usava a AwesomeAPI (`cambio.ts:1-2`) | Dia da criação da revisão, da aprovação ou do pedido | ✅ N16-27: dia da aprovação; a OC usa a PTAX da OC ([[Contratos-da-v2\|LOG-11]]) |
| **OQ-23** Unidade de medida diferente | Proposta em `PC`, `KG`, `M`, `TN`; OC e lote em outra unidade. Era a PS-006 e o D2 do 008, que a N16-09 supera | (a) fator por produto; (b) bloquear; (c) custo parcial marcado | ✅ Compras (19/10): não há conversão no sistema; a OC segue a unidade do faturamento do fornecedor |
| **OQ-24** Produto pendente vira pedido? | Produto novo nasce `PEND-xxxx` sem cadastro no Omie ([[Contratos-da-v2\|LOG-52]] seção 3.3) | (a) não vira pedido até o cadastro; (b) `V0.7` cria o produto | ✅ N16-28: (a). Quem cadastra e em quanto tempo é a OQ-36 (Fiscal) |
| **OQ-25** Comissão enquanto o custo é parcial | No exemplo do Nathan o item A passa dias com 10, 30 e 50 de 50 flanges cobertas ([[15-Custo-Real-e-Comissao]]) | (a) real do coberto mais cotado do resto; (b) só com o item completo; (c) custo médio | ✅ N16-48 (Michele): comissão só sobre as peças com custo real; a diferença vem na apuração seguinte. Diverge do default (a) |
| **OQ-28** Aprovação de Compras sobre o percentual | O Simulador atual tem um passo de Compras: cria uma versão com origem `COMPRAS` e o percentual final é o menor entre o do vendedor e o de Compras (`api-acos-vital` `src/schemas/core_comissionamento/tables/simulacoes/simulacoes.route.js:267` (`cabecalho.origem === "COMPRAS"`); `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:803` (`aprovarCompras`)). N16-08: Compras não altera a proposta | (a) o passo some e o cálculo `REAL` faz o papel; (b) Compras aprova antes; (c) Compras só confere | ⏸ N16-51 (provisório): (a), o passo fica desligado e o valor estimado por Compras vem do Omie. Falta Compras validar (A20, a mesma da OQ-45); a N16-77 manda seguir sem travar o banco |
| **OQ-29** Pedidos de Venda e NF de Saída | O Nathan inativou as duas telas na api-test (16/10); o SQL de produção não as tocava. As páginas seguem no código em `app/(protected)/vendas/pedidos-de-venda` e `.../notas-fiscais-saida` | (a) inativar também em produção; (b) manter | ✅ N16-33: (a) |
| **OQ-30** Correção da marcação no pedido da proposta | O vendedor corrige a marcação até o MES importar (regra 5 de [[03-Pedido-de-Venda-e-Liberacao]]) | (a) manter, com histórico `alterado`; (b) bloquear | ✅ N16-29: (a) |

## 4. Consultas que saem daqui

O plano antigo desta seção (CON-03 para a Gerência, CON-04 para a Controladoria, CON-05 para Compras e CON-06 para o Fiscal) foi superado: as perguntas da Gerência e quase todas as da Controladoria foram respondidas por decisão, e o ID `CON-03` foi usado em 30/10/2026 para outra consulta. O que vale hoje:

| Consulta | Para quem | Perguntas | Situação |
|---|---|---|---|
| [[Contratos-da-v2\|CON-03]] Devolução de compra e classificação do pedido | Michele (Controladoria) e Fiscal | OQ-44 (perguntas 1 e 2: Projeto e recompra) e OQ-42 (pergunta 3: devolução de compra) | Escrita, `aguardando-resposta` (N16-147, item 10) |
| Consulta a Compras (sem ID) | Gerente de Compras | OQ-28 e OQ-45 (o padrão provisório da N16-51) e OQ-47 (o e-mail de hoje) | Não escrita. O próximo ID livre é `CON-04`; quem dá o ID é o Nathan |
| Consulta ao Fiscal (sem ID) | Fiscal (❓ pessoa) | OQ-36 (cadastro de produto novo no Omie) | Não escrita |
| Conversa de dezembro | PCP, Engenharia e Recebimento | OQ-32 (custo da sobra de chapa), com as Q7 a Q13 do [[Contratos-da-v2\|LOG-54]] | Marcada pelo Nathan para dezembro de 2026 (N16-146) |

Perguntas técnicas não viram Consulta: ficam em [[Pontas-Soltas]]. Abertas: OQ-39 (Gustavo), OQ-48 (Nathan, PS-037) e OQ-49 a OQ-53 (Nathan; PS-048, PS-049, RS-023). A OQ-21 está adiada (N16-85). A OQ-15 e a OQ-16, que estavam nesta lista, foram fechadas (LOG-56, N16-149).

## 5. Perguntas do documento de 16/10 já respondidas por decisão

| Pergunta do documento | Resposta |
|---|---|
| "Uma proposta marcada como incompleta pode ser aprovada?" (João Vitor) | Não: N16-03 |
| "Até quando uma proposta aprovada pode ser revisada?" (João Vitor) | Não pode: N16-03 (ajuste só até aprovar) |
| "O bloqueio de comissões e as listas de bloqueio valem também no módulo novo?" (Michele) | Sim: N16-11, N16-34 e N16-43 (OQ-06) |
| "A Controladoria quer ser avisada ou só ver a diferença?" (Michele) | A Controladoria vê o custo real e a diferença (N16-18); o aviso ao vendedor existe só para a compra acima do valor da proposta (N16-60) |
| "O que a Controladoria ajusta (percentual, valor ou os dois) e com qual justificativa?" (Michele) | N16-10: aprova, desaprova, bloqueia, corta ou altera, sempre com justificativa; o vendedor vê a justificativa (N16-46) |
| "A estimada da proposta cancelada, guardada como histórico, atende a auditoria?" (Michele) | ❓ Não achei resposta própria; a N16-43 garante que a comissão excluída nunca some (aparece com valor zero e o motivo) |
