---
tags: [comissao, motor-atual, core_comissionamento, proposta, validacao, parte]
criado: 2026-11-05
estado-em: 2026-11-13
status: proposta
dono: Nathan
parte-de: "[[01-Motor-Atual-Como-Calcula]]"
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [dump core_comissionamento convertido (09-Diagramas/fontes), api-acos-vital f322dcd src/schemas/core_comissionamento, av-hub lib/simulador/motor.ts, av-hub app/(protected)/comissoes/simulador e analise-simuladores, av-hub app/api/comissoes, tela-simulador-comissao.png, N16-10, N16-11, N16-18, N16-19, N16-20]
---

# Como o motor de comissão atual calcula: detalhe técnico (2/2)

**Em uma frase:** detalhe técnico da nota [[01-Motor-Atual-Como-Calcula]] (parte 2 de 2): 3. Onde o custo líquido é calculado e a fórmula exata (N16-20); 4. O passo "Comissão: após a aprovação de Compras" e onde ele entra no fluxo novo; 5. Pontos de atenção que achei; O que a Michele precisa confirmar.

**Onde estamos:** ← [[01-Motor-Atual-Como-Calcula]] (resumo e índice) · partes: [[01-Motor-Atual-Como-Calcula-Detalhe-Tecnico-1]] · **01-Motor-Atual-Como-Calcula-Detalhe-Tecnico-2**

## 3. Onde o custo líquido é calculado e a fórmula exata (N16-20)

**Onde.** O custo líquido é calculado **só no navegador**, por uma função pura do front: `calcularSimulacao(entrada, parametros, regraFixa)` em `av-hub` `lib/simulador/motor.ts:176-518` (`calcularSimulacao`) (custo líquido em `:260-289`). A tela a chama a cada edição (`av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:664` (`calcularSimulacao(form, parametros)`)) e manda o resultado pronto à API. ✅ **Não existe função no banco nem rota na API que calcule**: a API só grava e valida (`api-acos-vital\...\simulacoes.route.js` guarda os campos como vieram; o BFF diz "A API ARMAZENA, NÃO CALCULA", `av-hub` `app/api/comissoes/simulacoes/route.ts:11` (`A API ARMAZENA, NÃO CALCULA`)). Do banco, só o `LEAST` e o teto em `vw_simulacao_resolvida` (`dump:1151-1198`). Consequência: o módulo novo precisa portar o motor para o servidor (nota 03, "Onde o cálculo roda").

**A fórmula, por item de revenda** (cada símbolo é uma entrada da tela; unidades e arredondamento como no código):

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
- **DIFAL, ST e frete da venda** são valores do cabeçalho: entram no **total da NF** (`:437-438`), não no custo. O DIFAL **da compra** não existe no motor.
- O **custo do pedido** é a soma dos itens (`:434`). A margem e a letra usam o custo líquido do item (R2, R3).

**Como isso vira "por evento" (N16-20).** Cada evento de custo (uma OC, um lote, uma parcial 5.01…) carrega as **suas** condições: fornecedor, condição de pagamento, encargo, frete, origem do ICMS, IPI, ST, DIFAL. O custo líquido do **evento** usa a mesma tabela de passos acima, com as entradas do evento (`compra_bruta` = valor do evento sem imposto; origem, IPI e ST do evento; frete do evento por VALOR quando a OC traz frete, senão RATEIO). O custo líquido do **item** é a soma dos eventos, mais a parte da quantidade ainda sem evento, calculada com as condições cotadas. Propriedade usada como teste: se todos os eventos de um item têm as mesmas condições, a soma é igual ao custo líquido calculado de uma vez (a fórmula é linear, exceto o zero de ICMS quando há ST, que é por evento). A venda continua com **um** conjunto de condições por pedido (destino, condição de pagamento, impostos sobre a venda, frete e ST da venda).

**O que a OC do hub guarda hoje** (fato do dump, N14-23): no cabeçalho, fornecedor, condição de pagamento, moeda e cotação, tipo e valor do frete, seguro e desconto; no item, quantidade, valor unitário e desconto. **Não guarda IPI, ICMS, ST nem DIFAL por item.** O `custos_eventos` grava `valor_total` já com desconto e cotação e tem colunas `icms_recuperar_total`, `ipi_total`, `st_total`, `frete_total` **sem preenchimento hoje**. Enquanto o imposto real não existe (OQ-11), o módulo novo faz assim 🟡: o evento herda origem, IPI e ST da proposta, proporcionais à quantidade coberta, e o cálculo fica marcado **"custo parcial por imposto"** (`imposto_completo = false`). A comissão calcula normalmente; só a Controladoria vê a marca. Quando o imposto real chegar, o evento passa a usá-lo e a marca some no recálculo seguinte.

## 4. O passo "Comissão: após a aprovação de Compras" e onde ele entra no fluxo novo

**O que é hoje.** Na tela do vendedor a coluna de comissão em reais **não existe** e no lugar aparece o chip "Comissão: após a aprovação de Compras" (`av-hub` `components/Comissoes/Simulador/GradeItens.tsx:62-65` (`após a aprovação de Compras`); a coluna só aparece no modo Compras, `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:152` (`mostrarComissao = modoCompras`)). O texto da dica diz que o valor pago é o menor entre a versão do vendedor e a de Compras, calculado sobre o faturado. O passo existe de ponta a ponta no código:

| Etapa | O que acontece | Onde |
|---|---|---|
| 1. Vendedor envia | A simulação passa de `RASCUNHO` a `ENVIADO` | `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:759-801` (`const salvar = async`) |
| 2. Fila de Compras | A tela `Análise de Simuladores` lista as versões `ENVIADO` do vendedor (e as de Compras que ficaram sem aprovar). Botão "Analisar" abre o simulador em `?modo=compras&id_simulacao=…` | `analise-simuladores/page.tsx:20, 85-89`; `services/comissoes/simulador.ts:260-270` |
| 3. Compras revisa | A mesma tela do simulador, com "Compra — Compras revisa", editável; a simulação carrega **os parâmetros congelados** da versão (`id_parametros`), não os vigentes de hoje | `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:378-454` (`carregarAnalise`), `av-hub` `components/Comissoes/Simulador/GradeItens.tsx:50` (`Compras revisa`) |
| 4a. Aprova como está | `PUT /simulacoes/:id {status: APROVADO}` | `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:803-845` (`aprovarCompras`) |
| 4b. Ajusta e aprova | `POST /simulacoes` com `origem = COMPRAS` e `id_simulacao_contestada`; no mesmo POST a versão do vendedor vira `CONTESTADO`; depois a versão de Compras vai a `APROVADO` (retomável se a segunda chamada falhar) | `simulacoes.route.js:252-278`; `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:803-845` (`aprovarCompras`) |
| 5. Menor percentual | Por item, `pct_final = LEAST(percentual do vendedor, percentual de Compras)`; sem Compras, vale o do vendedor | `vw_simulacao_resolvida`, `dump:1186-1190` |
| 6. Vendedor vê | Só depois de alguma versão `APROVADO` o BFF libera percentual e valor em reais | `minhas-comissoes/route.ts:27-31, 229, 249-264` |

Estados e transições: `RASCUNHO → ENVIADO → APROVADO | CONTESTADO | DEVOLVIDO`, os três últimos terminais (`simulacoes.route.js:30-36`). `DEVOLVIDO` exige motivo (`:328-335`).

**Permissões de hoje.** A tela `Análise de Simuladores` e o `Simulador` são duas telas do cadastro (`slug` `analise-simuladores` e `simulador`). O BFF aceita qualquer uma das duas para ler, criar e editar (`av-hub` `app/api/comissoes/simulacoes/route.ts:30` (`pode_visualizar`) e `:59`; `av-hub` `app/api/comissoes/simulacoes/[id]/route.ts:50` (`pode_visualizar`) e `:60`); **a ação de aprovar é um `PUT` de status com a permissão `pode_editar` de qualquer das duas**, ou seja, quem tem `pode_editar` no `Simulador` do vendedor consegue chamar a rota de aprovação. A tela esconde o botão, o BFF não barra 🔴 (ponto de atenção 13).

**Onde ele se encaixa no fluxo novo (proposta 🟡, OQ-28).**

| Hoje | No módulo novo |
|---|---|
| Vendedor "envia" o simulador do pedido a Compras | Não há envio: a proposta salva já grava o cálculo **cotado** (comissão estimada, `K1`). O vendedor só vê esse |
| Compras redigita o custo (versão `COMPRAS`) | Ninguém redigita: o cálculo **real** nasce sozinho dos eventos de custo (OC, lote, matéria-prima), cada evento com as suas condições (`K2`, N16-20). Compras **não altera a proposta** (N16-08) e usa o valor correto na OC (`C7`) |
| `pct_final` = menor entre vendedor e Compras | Igual, por item e por NF: `comissao_final_pct = LEAST(cotada, real)` (R6) |
| Compras aprova (`APROVADO`) e só então o vendedor vê | **Conferência de Compras** por NF (🟡): `CONFIRMAR` ou `CONTESTAR`, sem alterar valor. Padrão **desligado** (`exige_conferencia_compras = false`): a decisão da Controladoria não espera Compras. Se a Michele e o Nathan mantiverem o passo, liga-se o parâmetro e a Controladoria só aprova, corta ou altera depois da confirmação |
| Quem valida o pedido é Compras; **não existe etapa de Controladoria** | A **Controladoria decide uma vez**, no final, com justificativa (`K4`); o vendedor só vê a comissão real depois dessa decisão |
| `Análise de Simuladores` (fila de Compras) | Visão **Compras** da mesma tela de comissão da NF (nota 04, "três visões"): lista as NFs com `compras_estado = PENDENTE`, mostra o cálculo real por evento e permite confirmar ou contestar |

Em uma frase: **a aprovação de Compras sobre o percentual vira a conferência do cálculo real, e a decisão final sai de Compras e vai para a Controladoria.**

## 5. Pontos de atenção que achei

| # | O que | Onde | Selo |
|---|---|---|---|
| 1 | O resumo mensal mostra "bloqueado" sempre zero | `dump:1522` | ✅ |
| 2 | O teto da regra fixa só é aplicado pela view; o motor do front não recebe a regra | `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:664` (`calcularSimulacao(form, parametros)`), `av-hub` `lib/simulador/motor.ts:442-459` (`regraFixa`) | ✅ |
| 3 | O bloqueio por NF casa pelo número com zeros; sem os zeros não casa e não avisa | `dump:447-450` | ✅ |
| 4 | As listas de bloqueio e a regra fixa não têm data nem motivo obrigatório; bloqueio vale retroativo | `dump:333-381` | ✅ |
| 5 | A simulação guarda `sequencial` sempre nulo, e a `vw_comissao_master` casa `COALESCE(sequencial, -1)` com o da NF (que é 0 ou maior em pedido de família). Pode não casar em NF de pedido com sequencial | `dump:1367`, `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:728-733` (`SEMPRE null`) | ❓ conferir em produção |
| 6 | O protótipo `experimental/simulador-comissao` calculava a letra pelo **pedido inteiro**; ele saiu do código (av-hub `e1cc499`), e a documentação `av-hub/docs/comissao/processo-comissionamento.md` ainda o descreve, mas já avisa no topo que foi superado. O motor de verdade é por **item** (`lib/simulador/motor.ts`) | `av-hub` `docs/comissao/processo-comissionamento.md:3` (`Superado (16/10/2026)`), `lib/simulador/motor.ts:372` (`faixaDaMargem`) | ✅ |
| 7 | O dashboard de vendedores depende de um JSON gerado fora do repositório | `dump:158-214` | ✅ / ❓ gerador |
| 8 | O coordenador não tem API de cadastro; valores mudam só por SQL | `core_comissionamento/index.js` (sem rota) | ✅ |
| 9 | O comentário da `vw_comissao_master` no dump está truncado ("(texto atual)") | `dump:1386` | ✅ |
| 10 | O flag `vendedores.comissao` (cadastro) não é lido pelo motor nem pelas views | `dump:1227-1377` | ✅ / ❓ uso |
| 11 | O briefing diz 6 funções; o dump tem 5 (`fn_dashboard_comissoes`, `fn_comissao_coordenadores_mes`, `fn_jsonb_numero` e as 2 do histórico) | `dump:35-322` | ✅ |
| 12 | Refaturamento e devolução não aparecem na lógica da view (a nota diz zero casos em 6 meses) | `dump:1388-1392` | ✅ / ❓ |
| 13 | O BFF não separa quem aprova de quem digita: o `PUT` de status aceita `pode_editar` do `Simulador` do vendedor | `app/api/comissoes/simulacoes/[id]/route.ts:60` | ✅ |
| 14 | O custo líquido só existe no navegador; nenhuma rota nem função de banco o recalcula, então nada reconfere o valor gravado | `motor.ts:283-318`, `simulacoes.route.js` | ✅ |

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
