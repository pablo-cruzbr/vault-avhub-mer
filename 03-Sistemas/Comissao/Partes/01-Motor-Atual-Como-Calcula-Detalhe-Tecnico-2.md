---
tags: [comissao, motor-atual, core_comissionamento, proposta, validacao, parte]
criado: 2026-11-05
estado-em: 2026-11-24
status: proposta
dono: Nathan
parte-de: "[[01-Motor-Atual-Como-Calcula]]"
develop-conferida: [av-hub c4a455d, em 2026-11-24 (DEVOLVIDO, Provável, AGUARDANDO_APROVACAO e Visão Geral por pedido, PRs #337 e #339); api-acos-vital ce4f90f, av-hub 7f0f7e2, em 2026-11-23, comissão por pedido e pré-aceita; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [dump core_comissionamento convertido (09-Diagramas/fontes), api-acos-vital f322dcd src/schemas/core_comissionamento, av-hub lib/simulador/motor.ts, av-hub app/(protected)/comissoes/simulador e analise-simuladores, av-hub app/api/comissoes, tela-simulador-comissao.png, N16-10, N16-11, N16-18, N16-19, N16-20, N16-185 a N16-190, PS-062, PS-063, PS-064]
---

# Como o motor de comissão atual calcula: detalhe técnico (2/2)

**Em uma frase:** detalhe técnico da nota [[01-Motor-Atual-Como-Calcula]] (parte 2 de 2): 3. Onde o custo líquido é calculado e a fórmula exata (N16-20); 4. O passo "Comissão: após a aprovação de Compras" e onde ele entra no fluxo novo; 5. Pontos de atenção que achei; O que a Michele precisa confirmar.

**Onde estamos:** ← [[01-Motor-Atual-Como-Calcula]] (resumo e índice) · partes: [[01-Motor-Atual-Como-Calcula-Detalhe-Tecnico-1]] · **01-Motor-Atual-Como-Calcula-Detalhe-Tecnico-2**

## 2. Regra a regra (continuação)

### R17. Parâmetros e versão

**O que faz.** Os percentuais (faixas, impostos, despesas, ICMS, encargos de pagamento, margem desejada, fabricação interna e, desde 19/11, o corte da predominância) ficam numa tabela com **vigência** por unidade. A simulação grava qual versão usou (`id_parametros`) e fica amarrada a ela. **Não se edita parâmetro vigente**: fecha-se a vigência e abre-se outra.

**Dados no dump:** 3 linhas (uma por unidade), todas "Maio/23", vigência aberta, valores iguais (`dump:1660-1662`).

**De onde vem.** ✅ `simulador_parametros` (`dump:909-952`), regra no comentário `dump:961-965`, exclusão de sobreposição `dump:1701`.

### R18. Mark-up e preço sugerido (informativo)

**O que faz.** O simulador sugere um preço de venda: `mark-up = 1 ÷ (1 − (margem desejada + despesas + impostos + provisão))`, arredondado **para cima** em 2 casas, aplicado ao custo líquido por unidade, mais o encargo da condição de pagamento. Não decide comissão.

**Exemplo.** Soma = 10 + 11,451734 + 18,252 + 2 = 41,703734%. Mark-up = 1 ÷ 0,58296266 = 1,7153 → **1,72**.

**De onde vem.** ✅ `av-hub` `lib/simulador/motor.ts:116` (`export function calcularMarkup`), `:327` (`const precoUnitSugerido`). O arredondamento para cima copia o `ROUNDUP` da planilha (`:51`, `export function arredondarParaCima`).

## 3. Onde o custo líquido é calculado e a fórmula exata (N16-20)

**Onde.** O custo líquido é calculado **só no navegador**, por uma função pura do front: `calcularSimulacao(entrada, parametros, regraFixa)` em `av-hub` `lib/simulador/motor.ts:196` (`export function calcularSimulacao(`) (custo líquido em `:315`, `const custoLiquido`). A tela a chama a cada edição (`av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:713` (`calcularSimulacao(form, parametros)`)) e manda o resultado pronto à API. ✅ **Não existe função no banco nem rota na API que calcule**: a API só grava e valida (`api-acos-vital\...\simulacoes.route.js` guarda os campos como vieram; o BFF diz "A API ARMAZENA, NÃO CALCULA", `av-hub` `app/api/comissoes/simulacoes/route.ts:12` (`A API ARMAZENA, NÃO CALCULA`)). Do banco, só a escolha da versão pré-aceita e o teto em `vw_simulacao_resolvida` (R6 e R7 da parte 1). Consequência: o módulo novo precisa portar o motor para o servidor (nota 03, "Onde o cálculo roda").

**A fórmula, por item de revenda** (as linhas de `motor.ts` desta tabela são do cálculo de 13/11 e se deslocaram com o grão por pedido; as âncoras atuais estão em R1 da parte 1) (cada símbolo é uma entrada da tela; unidades e arredondamento como no código):

| Passo | Fórmula | Entrada da tela | Código |
|---|---|---|---|
| Compra bruta | `qtd_compra × preco_unit_compra` | Compra: QTD, PREÇO | `motor.ts:283` |
| IPI | `compra_bruta × pct_ipi ÷ 100` | % IPI | `:278` |
| ICMS de entrada | `0` se `valor_st > 0`; senão a alíquota de `icms_entrada` da **origem da compra** | ORIGEM, ST | `:280-283` |
| ICMS a recuperar | `compra_bruta × icms_entrada ÷ 100` | | `:289` |
| Frete, tipo RATEIO | `(compra_bruta + IPI + valor_st) × pct_rateio_logistica ÷ 100` (hoje 1,438975%) | Frete na compra: rateio | `:310` |
| Frete, tipo VALOR | o frete **da linha** (fabricação interna: zero) | FRETE | `:207-210`, `:309` |
| **Custo líquido** | `compra_bruta − ICMS a recuperar + IPI + valor_st + frete` | CUSTO LÍQ. | `:312` |

- Em **fabricação interna** não há compra: `compra_bruta = IPI = ICMS = 0` (`:259-261`) e o custo líquido é zero; a comissão é o percentual fixo (R4).
- O **encargo da condição de pagamento não entra no custo líquido.** Entra só no preço sugerido: `arredondarParaCima(custo_liquido ÷ qtd × mark-up, 2) × (1 + encargo ÷ 100)` (`:324-325`).
- **DIFAL, ST e frete da venda** são valores do cabeçalho: entram no **total da NF** (`av-hub` `lib/simulador/motor.ts:409` (`const totalNf`)), não no custo. O DIFAL **da compra** não existe no motor.
- O **custo do pedido** é a soma dos itens (`:406`, `const custoTotal`). A letra usa a margem da revenda do pedido, que soma o lucro de cada item (R2, R3).

**Como isso vira "por evento" (N16-20).** Cada evento de custo (uma OC, um lote, uma parcial 5.01…) carrega as **suas** condições: fornecedor, condição de pagamento, encargo, frete, origem do ICMS, IPI, ST, DIFAL. O custo líquido do **evento** usa a mesma tabela de passos acima, com as entradas do evento (`compra_bruta` = valor do evento sem imposto; origem, IPI e ST do evento; frete do evento por VALOR quando a OC traz frete, senão RATEIO). O custo líquido do **item** é a soma dos eventos, mais a parte da quantidade ainda sem evento, calculada com as condições cotadas. Propriedade usada como teste: se todos os eventos de um item têm as mesmas condições, a soma é igual ao custo líquido calculado de uma vez (a fórmula é linear, exceto o zero de ICMS quando há ST, que é por evento). A venda continua com **um** conjunto de condições por pedido (destino, condição de pagamento, impostos sobre a venda, frete e ST da venda).

**O que a OC do hub guarda hoje** (fato do dump, N14-23): no cabeçalho, fornecedor, condição de pagamento, moeda e cotação, tipo e valor do frete, seguro e desconto; no item, quantidade, valor unitário e desconto. **Não guarda IPI, ICMS, ST nem DIFAL por item.** O `custos_eventos` grava `valor_total` já com desconto e cotação e tem colunas `icms_recuperar_total`, `ipi_total`, `st_total`, `frete_total` **sem preenchimento hoje**. Enquanto o imposto real não existe (OQ-11), o módulo novo faz assim 🟡: o evento herda origem, IPI e ST da proposta, proporcionais à quantidade coberta, e o cálculo fica marcado **"custo parcial por imposto"** (`imposto_completo = false`). A comissão calcula normalmente; só a Controladoria vê a marca. Quando o imposto real chegar, o evento passa a usá-lo e a marca some no recálculo seguinte.

## 4. O passo "Comissão: após a aprovação de Compras" e onde ele entra no fluxo novo

**O que é hoje.** Na tela do vendedor a coluna de comissão em reais **não existe** e no lugar aparece o chip "Comissão: após a aprovação de Compras" (`av-hub` `components/Comissoes/Simulador/TabelaItens.tsx:58` (`Comissão: após a aprovação de Compras`); a coluna só aparece no modo Compras, `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:171` (`mostrarComissao = modoCompras`)). O pedido é pago pela versão de menor comissão, sobre o faturado (N16-190). O passo existe de ponta a ponta no código:

| Etapa | O que acontece | Onde |
|---|---|---|
| 1. Vendedor envia | A simulação passa de `RASCUNHO` a `ENVIADO`, só com o pedido faturado; depois disso, versão nova só se Compras devolver (N16-188) | `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:810` (`const salvar = async`) |
| 2. Fila de Compras | A tela `Análise de Simuladores` lista as versões `ENVIADO` do vendedor (e as de Compras que ficaram sem aprovar). Botão "Analisar" abre o simulador em `?modo=compras&id_simulacao=…` | `analise-simuladores/page.tsx:20, 85-89`; `services/comissoes/simulador.ts:260-270` |
| 3. Compras revisa | A mesma tela do simulador, editável no modo Compras; a simulação carrega **os parâmetros congelados** da versão (`id_parametros`), não os vigentes de hoje | `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:412` (`async function carregarAnalise`) |
| 4a. Aprova como está | `PUT /simulacoes/:id {status: APROVADO}` | `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:858` (`const aprovarCompras = async`) |
| 4b. Ajusta e aprova | `POST /simulacoes` com `origem = COMPRAS` e `id_simulacao_contestada`; no mesmo POST a versão do vendedor vira `CONTESTADO`; depois a versão de Compras vai a `APROVADO` (retomável se a segunda chamada falhar) | `simulacoes.route.js`; `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:858` (`const aprovarCompras = async`) |
| 5. Versão pré-aceita | O pedido inteiro paga pela versão de menor comissão (empate, Compras); sem Compras, vale a do vendedor (N16-190) | `vw_simulacao_resolvida` (`origem_pre_aceita`), migration fora do repositório (PS-062) |
| 6. Vendedor vê | Minhas Comissões lê `/comissoes_nf` com `meus=true`, pela competência; o BFF não corta mais o valor (❓ se a view o zera antes da validação, PS-062) | `av-hub` `app/api/comissoes/minhas-comissoes/route.ts:152` (`/comissoes_nf?`) |

Estados e transições: `RASCUNHO → ENVIADO → APROVADO | CONTESTADO | DEVOLVIDO`, os três últimos terminais (`api-acos-vital` `src/schemas/core_comissionamento/tables/simulacoes/simulacoes.route.js:34` (`const TRANSICOES = {`)). `DEVOLVIDO` exige motivo. A trava da versão do vendedor está em `:175` (`const versaoFechada`).

**Permissões de hoje.** A tela `Análise de Simuladores` e o `Simulador` são duas telas do cadastro (`slug` `analise-simuladores` e `simulador`). O BFF aceita qualquer uma das duas para ler, criar e editar (`av-hub` `app/api/comissoes/simulacoes/route.ts:31` (`pode_visualizar`) e `:60`; `av-hub` `app/api/comissoes/simulacoes/[id]/route.ts:48` (`pode_visualizar`) e `:58`); **a ação de aprovar é um `PUT` de status com a permissão `pode_editar` de qualquer das duas**, ou seja, quem tem `pode_editar` no `Simulador` do vendedor consegue chamar a rota de aprovação. A tela esconde o botão, o BFF não barra 🔴 (ponto de atenção 13).

**Onde ele se encaixa no fluxo novo (proposta 🟡, OQ-28).**

| Hoje | No módulo novo |
|---|---|
| Vendedor "envia" o simulador do pedido a Compras | Não há envio: a proposta salva já grava o cálculo **cotado** (comissão estimada, `K1`). O vendedor só vê esse |
| Compras redigita o custo (versão `COMPRAS`) | Ninguém redigita: o cálculo **real** nasce sozinho dos eventos de custo (OC, lote, matéria-prima), cada evento com as suas condições (`K2`, N16-20). Compras **não altera a proposta** (N16-08) e usa o valor correto na OC (`C7`) |
| O pedido paga pela versão de menor comissão (vendedor ou Compras, N16-190) | ⚠️ No desenho, ainda por item e por NF: `comissao_final_pct = LEAST(cotada, real)`. Diverge do motor atual, que é por pedido (veja [[03-Modelo-Novo-core_comissao]]) |
| Compras aprova (`APROVADO`) e só então o vendedor vê | **Conferência de Compras** por NF (🟡): `CONFIRMAR` ou `CONTESTAR`, sem alterar valor. Padrão **desligado** (`exige_conferencia_compras = false`): a decisão da Controladoria não espera Compras. Se a Michele e o Nathan mantiverem o passo, liga-se o parâmetro e a Controladoria só aprova, corta ou altera depois da confirmação |
| Quem valida o pedido é Compras; **não existe etapa de Controladoria** | A **Controladoria decide uma vez**, no final, com justificativa (`K4`); o vendedor só vê a comissão real depois dessa decisão |
| `Análise de Simuladores` (fila de Compras) | Visão **Compras** da mesma tela de comissão da NF (nota 04, "três visões"): lista as NFs com `compras_estado = PENDENTE`, mostra o cálculo real por evento e permite confirmar ou contestar |

Em uma frase: **a aprovação de Compras sobre o percentual vira a conferência do cálculo real, e a decisão final sai de Compras e vai para a Controladoria.**

## 5. Pontos de atenção que achei

| # | O que | Onde | Selo |
|---|---|---|---|
| 1 | O resumo mensal mostrava "bloqueado" sempre zero; desde 23/11 mostra o pré-aceito das notas bloqueadas | `dump:1522`; `vw_comissao_resumo_mensal.model.js:37` (`valor_comissao_bloqueado:`) | ✅ código; ❓ banco (PS-062) |
| 2 | O teto da regra fixa só é aplicado pela view; o motor do front não recebe a regra | `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:713` (`calcularSimulacao(form, parametros)`), `av-hub` `lib/simulador/motor.ts:549` (`const usaCondicional`) | ✅ |
| 3 | O bloqueio por NF casa pelo número com zeros; sem os zeros não casa e não avisa | `dump:447-450` | ✅ |
| 4 | As listas de bloqueio e a regra fixa não têm data nem motivo obrigatório; bloqueio vale retroativo | `dump:333-381` | ✅ |
| 5 | A simulação guarda `sequencial` sempre nulo, e a `vw_comissao_master` casa `COALESCE(sequencial, -1)` com o da NF (que é 0 ou maior em pedido de família). Pode não casar em NF de pedido com sequencial | `dump:1367`, `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:779` (`SEMPRE null`) | ❓ conferir em produção |
| 6 | O protótipo `experimental/simulador-comissao` calculava a letra pelo **pedido inteiro**; ele saiu do código (av-hub `e1cc499`). Desde 18/11 o motor de verdade também é por pedido (N16-185): o que era só do protótipo é a regra vigente. A documentação `av-hub/docs/comissao/processo-comissionamento.md` ainda diz que o protótipo foi superado | `av-hub` `docs/comissao/processo-comissionamento.md:3` (`Superado (16/10/2026)`), `lib/simulador/motor.ts:475` (`Comissão por PEDIDO`) | ✅ |
| 7 | O dashboard de vendedores depende de um JSON gerado fora do repositório | `dump:158-214` | ✅ / ❓ gerador |
| 8 | O coordenador não tem API de cadastro; valores mudam só por SQL | `core_comissionamento/index.js` (sem rota) | ✅ |
| 9 | O comentário da `vw_comissao_master` no dump está truncado ("(texto atual)") | `dump:1386` | ✅ |
| 10 | O flag `vendedores.comissao` (cadastro) não é lido pelo motor nem pelas views | `dump:1227-1377` | ✅ / ❓ uso |
| 11 | O briefing diz 6 funções; o dump tem 5 (`fn_dashboard_comissoes`, `fn_comissao_coordenadores_mes`, `fn_jsonb_numero` e as 2 do histórico) | `dump:35-322` | ✅ |
| 12 | Refaturamento e devolução não aparecem na lógica da view (a nota diz zero casos em 6 meses) | `dump:1388-1392` | ✅ / ❓ |
| 13 | O BFF não separa quem aprova de quem digita: o `PUT` de status aceita `pode_editar` do `Simulador` do vendedor | `av-hub` `app/api/comissoes/simulacoes/[id]/route.ts:58` (`pode_editar`) | ✅ |
| 14 | O custo líquido só existe no navegador; nenhuma rota nem função de banco o recalcula, então nada reconfere o valor gravado | `motor.ts:315` (`const custoLiquido`), `simulacoes.route.js` | ✅ |
| 15 | Seis migrations da comissão (`2026-11-18_comissao_competencia`, `2026-11-18_comissao_grao_pedido`, `2026-11-19_comissao_escopo_fabricacao`, `2026-11-19_comissao_master_itens_desempenho`, `2026-11-19_comissao_trava_versao_vendedor`, `2026-11-23_comissao_pre_aceita_devolvido`) estão fora do repositório; estão no tst de 23/11, não na produção de 18/11, e sem elas as rotas de comissão falham | comentários dos models; `dump tst 23/11:36879` (`trg_simulacoes_trava_versao_vendedor`) | ✅ tst; ❓ produção (PS-062) |
| 16 | O corte da predominância (`pct_predominancia_fabricacao`) não tem tela: só muda por SQL ou pela API | `simulador_parametros.model.js:112` (`pct_predominancia_fabricacao:`) | ✅ PS-063 |
| 17 | Minhas Comissões e Visão Geral mostram `DEVOLVIDO`, o provável e a versão que paga (PS-064 fechada em 24/11); `AGUARDANDO_APROVACAO` sem fonte na API | `av-hub` `lib/domain/comissoes-minhas-comissoes.ts:59` (`DEVOLVIDO: {`) | ✅ PS-064 · ❓ PS-065 |

## O que a Michele precisa confirmar

Cada pergunta traz o que o módulo novo vai fazer se ela não responder (🟡). **A Michele respondeu em 19/10/2026 ([[Registro-de-Decisoes|respostas da Controladoria de 19/10 (N16-42 a N16-51)]]); onde a resposta diverge do padrão abaixo, vale a resposta (N16-42 a N16-51).**

| # | Pergunta | Padrão proposto 🟡 |
|---|---|---|
| M01 | As **faixas A/B/C/D** (15/12/9/0 e 2/1,3/0,7/0,5) e o **2% de fabricação interna** continuam valendo? | Sim, vira parâmetro com vigência |
| M02 | Os **percentuais de despesa, impostos e provisão de 2%** de "Maio/23" ainda são os vigentes? A margem desejada é 10%? | ✅ Provisoriamente sim (N16-39): "Maio/23" continua até haver nova vigência com novos dados |
| M03 | Custo real **melhor** que o cotado: o vendedor fica com o percentual cotado (menor dos dois). É o desejado? | Sim, igual ao atual |
| M04 | **Regras fixas por cliente**: continuam? O gatilho é o markup bruto do pedido? Podem ter data de fim? (OQ-06) | Continuam, com vigência; campo renomeado |
| M05 | **Lista de bloqueio** de cliente e de vendedor: continua? Quem está nela hoje (1 cliente, 8 vendedores) migra? A comissão excluída deve **aparecer com valor zero e motivo** para a Controladoria, em vez de sumir? (OQ-06) | Migra com vigência a partir de 2000-01-01; aparece zerada com motivo |
| M06 | **Bloqueio por NF** vira a decisão "bloquear" da Controladoria (com justificativa)? As 2 linhas antigas (desbloqueadas) podem ficar só no módulo antigo? (OQ-06) | Sim; não migra |
| M07 | **Coordenadores**: continuam no módulo novo, com a mesma conta e sem bloqueio por NF? Quem aprova a apuração do mês? (OQ-06) | Sim, mesma conta; apuração mensal fechada pela Controladoria |
| M08 | **Item de fabricação interna**: com o custo real da matéria-prima agora disponível (N16-09), continua 2% fixo sem olhar a margem, ou passa a ter letra? | Continua 2% fixo; custo só informativo |
| M09 | **Mão de obra** (serviço comprado por OC): comissiona como revenda (letra pela margem)? Que origem de compra usar para o ICMS (hoje exigida na revenda)? | Revenda, sem crédito de ICMS (origem "Optante Simples" = 0%) |
| M10 | **"Desaprovar"** zera e encerra? **"Bloquear"** retém e pode ser liberado depois? **"Alterar"** pode aumentar acima do calculado? Há teto? | ✅ Respondida (N16-44, N16-45): aprovar, desaprovar, bloquear (e desbloquear), cortar ou alterar, por valor ou percentual, **sem teto**, sempre com justificativa e rastro; decidem a Controladoria, a Gerência e a Coordenação; ninguém decide sobre a própria comissão |
| M11 | O vendedor pode ler a **justificativa** da Controladoria? | ✅ Respondida (N16-46): **sim**; o vendedor vê a justificativa depois da decisão (`K5`); desaprovada aparece com R$ 0 e o motivo |
| M12 | A comissão da NF entra na fila **mesmo com o custo real incompleto**, ou só quando o custo estiver completo? | ✅ Respondida (N16-48): paga-se **só sobre as peças com custo real**; quando o custo completa, a diferença vai para a apuração seguinte, para nova decisão. O restante **não** usa o cotado |
| M17 | **Passo de Compras** (seção 4): Compras continua conferindo o percentual de Compras antes da Controladoria? (OQ-28) | Não; o cálculo real por evento o substitui; a conferência fica pronta no banco, desligada (`exige_conferencia_compras = false`) |
| M18 | **Encargo da condição de pagamento**: entra no custo líquido do evento? Hoje só entra no preço sugerido (seção 3). (OQ-12) | ✅ Respondida (N16-22): não entra no custo; segue só no preço sugerido |
| M19 | **Imposto real do evento** (IPI, ICMS, ST, DIFAL): ✅ respondida (N16-38, OQ-11): vem dos campos novos da OC, pré-preenchidos com os dados da proposta e editados por Compras. O evento herda da proposta só se Compras não tiver editado | Respondida |
| M13 | NF **cancelada** depois da decisão, e **devolução**: como fica a comissão paga? | ✅ Respondida (N16-47, N16-74): **abate na mesma proporção, desde a primeira versão**; se já paga, desconta na próxima apuração. Devolução total vem do Omie; a parcial o Fiscal ou a Controladoria informam (item, quantidade, valor), com pendência até lá (`K6`) |
| M14 | **Pedido que chega do Omie sem proposta** (V1, segunda origem): continua no módulo atual? | ✅ Respondida (N16-103 a N16-106): o módulo atual não muda; o pedido do Omie entra no módulo **novo** pelo mesmo fluxo do Hub, e a estimativa é a parte de compras que o vendedor preenche no pedido; a nota que sair antes dela espera |
| M15 | O flag **`vendedores.comissao`** e a **ajuda de custo do vendedor** (`vendedores.ajuda_custo`) valem para quê? O motor atual não os lê | Fora do motor; ficam no cadastro |
| M16 | O **valor retido** (comissões bloqueadas) deve aparecer no resumo mensal da Controladoria, o que hoje mostra zero por defeito? (OQ-05) | Sim |

Relacionados: [[02-Tabelas-Atuais-core_comissionamento]], [[03-Modelo-Novo-core_comissao]], [[04-Regras-e-Estados-da-Comissao-Nova]], [[Comissoes]], [[Contratos-da-v2|LOG-47]], [[Regras-do-Vault]].
