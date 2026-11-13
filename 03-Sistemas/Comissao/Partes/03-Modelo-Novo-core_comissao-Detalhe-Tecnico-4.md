---
tags: [comissao, banco, core_comissao, modelo, proposta, controladoria, parte]
criado: 2026-11-05
estado-em: 2026-11-13
status: proposta
dono: Gustavo (DBA)
parte-de: "[[03-Modelo-Novo-core_comissao]]"
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [N16-02, N16-03, N16-09, N16-10, N16-11, N16-17, N16-18, N16-19, N16-20, OQ-06, OQ-11, OQ-12, OQ-28, dump core_comissionamento convertido, av-hub lib/simulador/motor.ts, tela-simulador-comissao.png]
---

# Modelo novo: schema `core_comissao`: detalhe técnico (4/4)

**Em uma frase:** detalhe técnico da nota [[03-Modelo-Novo-core_comissao]] (parte 4 de 4): O motor é o mesmo: a fórmula preservada; Onde o cálculo roda; Mapa de-para: tabela atual → tabela nova; O que NÃO migra; Plano de carga de dados (para o Gustavo); Riscos; Perguntas em aberto.

**Onde estamos:** ← [[03-Modelo-Novo-core_comissao]] (resumo e índice) · partes: [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-1]] · [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-2]] · [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-3]] · **03-Modelo-Novo-core_comissao-Detalhe-Tecnico-4**

## O motor é o mesmo: a fórmula preservada

O cálculo de **margem, letra, prejuízo, fabricação interna, teto da regra fixa e menor percentual** é o de `lib/simulador/motor.ts` e `vw_simulacao_resolvida`, sem mudar fórmula. A tabela mostra cada regra e onde ela passa a morar.

| Regra (nota 01) | Módulo atual | Módulo novo |
|---|---|---|
| R1 Custo líquido | `motor.ts:283-318` | Mesma função no motor da API; contas intermediárias gravadas em `comissao_calculo_itens` (`compra_bruta`, `icms_recuperar`, `valor_ipi`, `frete_item`, `custo_liquido`) |
| R2 Margem líquida do item | `motor.ts:342-354` | Idêntica; `margem_item_pct` |
| R3 Letra e % | `motor.ts:176-179, 389-401` | Idêntica; faixas em `parametros_faixas` |
| R4 Prejuízo e fabricação | `motor.ts:369-394` | Idêntica; `parametros.fabricacao_interna_pct` |
| R5 Percentual de Compras | Segunda simulação digitada por Compras | **Cálculo `REAL`**, automático, por evento de custo (N16-20); a conferência de Compras (🟡 OQ-28) vira `compras_estado` |
| R6 `pct_final` = menor | `dump:1186-1190` | `comissoes_nf_itens.comissao_final_pct = LEAST(cotada, real)` (CHECK `final <= cotada`) |
| R7 Teto da regra fixa | View (`dump:1151-1198`) | Aplicado **no motor, por cálculo** (cada versão com o markup bruto dela) e gravado (`teto_regra_pct`, `regra_aplicada`). O resultado é o mesmo da view |
| R8 Valor sobre o faturado | `dump:1128` | `fn_comissao_nf_fechar`: `round(valor_faturado_item × pct / 100, 2)` |
| R9–R10 NF, situação, visibilidade | Views e BFF | `comissoes_nf` + estados; visibilidade em views e API |
| R11–R12 Bloqueio e listas | `bloqueio_comissoes`, `blacklist_*` | Decisão `BLOQUEAR`; `exclusoes` |
| R15 Coordenadores | `fn_dashboard_comissoes` | `coordenadores*` + `fn_coordenadores_apurar` (mesma conta, sem bloqueio por NF) |

**O que muda (e só isso)**

1. **A entrada de custo, por evento (N16-20).** No cálculo `REAL`, o custo de compra do item vem de `core_comercial.custos_eventos` (as linhas de OC, lote, matéria-prima e mão de obra), **não de digitação**. Cada evento é calculado **com as condições dele** pela fórmula de `motor.ts:283-318` (nota 01, seção 3) e o item soma os eventos. A parte do item ainda sem evento usa o preço e as condições cotados. IPI, ST, DIFAL e origem do ICMS **reais** não existem na OC do hub (N14-23): enquanto não vierem (OQ-11), o evento herda os da proposta e o cálculo fica marcado `imposto_completo = false` (🟡, "custo parcial por imposto"). O encargo da condição de pagamento do evento (OQ-12) fica guardado, mas a fórmula atual do custo líquido não o usa: no motor atual o encargo só entra no preço sugerido (`motor.ts:330`).
2. **Chaves por código** em vez de texto (origem da compra, destino da venda).
3. **O teto da regra fixa** passa a ser aplicado dentro do motor (já existe o trecho, `motor.ts:473-490`, não usado hoje) e não só na view. Equivalência a provar nos testes.
4. **Arredondamento** do valor em reais no banco (`round(numeric, 2)`), como a view atual.
5. **Onde roda** (abaixo).

**Provas de que é o mesmo (testes de ouro, critério de aceite)**

- As **14 simulações e 21 itens** do dump (`dump:1613-1653`) viram fixtures: o motor novo reproduz letra, percentual e valor.
- O exemplo da nota [[04-Regras-e-Estados-da-Comissao-Nova]] (pedido de 5 itens: comissão cotada R$ 513,10, calculada com o custo real R$ 307,50; conferido contra `lib/simulador/motor.ts` e validado em banco descartável).
- Casos de borda: isento, importação com e sem SP, base reduzida, ST (destino SP e outro), frete `VALOR`, fabricação, prejuízo, teto padrão e condicional, margem exatamente 0, 9, 12 e 15.
- Aceita-se diferença de até R$ 0,01 por NF, e cada diferença é explicada (ponto flutuante do motor atual contra o arredondamento do banco).

## Onde o cálculo roda

| Opção | Como é | Prós | Contras |
|---|---|---|---|
| **A. Tudo no banco** (função plpgsql) | Port do motor para SQL; trigger no evento de custo | Atômico; sem job; DBA dono de tudo; sem divergência entre API e banco | Reescrever 250 linhas de motor em SQL (`ROUNDUP`, tolerância 1e-9, mapas de parâmetros); teste de ouro mais difícil; regra de negócio escondida no banco; dois motores durante a transição |
| **B. Motor na API** (função pura TypeScript) + gravação no banco | Porta `lib/simulador/motor.ts` para a `api-acos-vital` quase sem mudar; `fn_calculo_gravar` grava; job recalcula | **Mesmo código que hoje** (garante "motor igual"); testável com fixtures; versão gravada; Pablo migra o Comercial para a mesma API (N16-15) | Precisa de job e de evento; duas camadas (API calcula, banco grava e fecha) |
| **C. Híbrido** | Motor na API para margem e letra; **fechamento por NF, menor percentual, arredondamento e decisão no banco** | Divide como hoje (motor no código, `LEAST` no banco); o dinheiro é sempre fechado por função com `CHECK` | Igual à B |

**Sugestão 🟡 (Claude): opção C.** O motor continua sendo o **mesmo código** (porta de `motor.ts`, testes de ouro), rodando na API; tudo que fecha dinheiro (`fn_comissao_nf_fechar`, `fn_comissao_decidir`) roda no banco, com restrições que impedem valor errado. Motivos: (1) a regra do projeto é lógica no backend, e hoje o motor está no navegador (`av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:664` (`calcularSimulacao(form, parametros)`)); (2) mantém a fórmula idêntica por reaproveitar o código; (3) as funções do banco são pequenas e testáveis (validadas em banco descartável); (4) o DBA (Gustavo) revisa o que grava dinheiro. Decisão do Nathan e do Gustavo; estimativa de esforço é do Claude, por complexidade.

### Custo parcial (regra do cálculo `REAL`) 🟡

O custo real chega aos poucos (N16-09, exemplo do Nathan). Para o recálculo não ficar "melhor do que é" enquanto a compra não terminou, o custo líquido do item é:

`custo líquido do item = Σ custo líquido de cada evento + custo líquido cotado do item × quantidade ainda não coberta ÷ quantidade do item`

- A parte já comprada usa **as condições de cada evento**; a parte que falta usa o preço e as condições da proposta.
- Quando `quantidade_coberta = quantidade do item`, a segunda parcela some e o item fica `custo_completo = true`.
- Evento sem imposto real: herda IPI, ST e origem da proposta, proporcionais à quantidade coberta; `imposto_real = false` no evento e `imposto_completo = false` no item e no cálculo.
- Os números por dia estão na nota [[04-Regras-e-Estados-da-Comissao-Nova]]. Alternativa: esperar a cobertura completa (a comissão ficaria só com o cotado até lá). Pergunta OQ-25.

## Mapa de-para: tabela atual → tabela nova

| Tabela atual | Tabela(s) nova(s) | O que acontece com as colunas | Dados |
|---|---|---|---|
| `simulador_parametros` | `parametros` + `parametros_despesas`, `_icms_saida`, `_icms_entrada`, `_encargos_pagamento`, `_faixas` | `margem_desejada`→`margem_desejada_pct`; `pct_despesas_operacionais`→`despesas_operacionais_pct`; `pct_rateio_logistica`→`rateio_logistica_pct`; `pct_comissao_provisao`→`provisao_comissao_pct`; `pct_pis`→`pis_pct` (idem COFINS, IRPJ, CSLL, bases, adicional); `pct_fabricacao_interna`→`fabricacao_interna_pct`; `exige_conferencia_compras` é novo (`false`); `detalhe_despesas`→9 linhas; `icms_saida`, `icms_entrada`, `encargos_pagamento`, `faixas_comissao` (JSON)→linhas | **Migra**: 3 linhas (uma por unidade) |
| `regras_comissoes_fixas` | `regras_fixas_cliente` | `margem`→`gatilho_markup_pct`; `comissao_padrao`→`comissao_padrao_pct`; `comissao_condicional`→`comissao_condicional_pct`; ganha `vigencia_*`, `motivo`, `created_by` | **Migra** as 4 vivas, com `vigencia_inicio = 2000-01-01` 🟡; a apagada fica |
| `blacklist_comissoes_destinatario` | `exclusoes` (`tipo = CLIENTE`) | `codigo_cliente`→`codigo_omie`; `observacao`→`motivo` (obrigatório) | **Migra** 1 linha, motivo "Migrado do módulo Comissões" 🟡 |
| `blacklist_comissoes_vendedores` | `exclusoes` (`tipo = VENDEDOR`) | `codigo_vendedor_omie`→`codigo_omie` | **Migra** 8 linhas 🟡 |
| `comissao_coordenadores` | `coordenadores` + `coordenadores_regras` | `nome`→pessoa; `tipo` em minúsculas→`GERENCIA`/`EXCECAO`; `ajuda_custo`, `percentual_comissao`→`percentual_pct`, `ordem_desempate`, vigência→`coordenadores_regras` | **Migra** 6 pessoas e 6 regras, 🟡 sujeito a OQ-06 |
| `bloqueio_comissoes` | decisão `BLOQUEAR` em `comissao_decisoes` | Sem tabela própria | **Não migra** (2 linhas, ambas desbloqueadas) |
| `comissao_coordenadores_historico` | `auditoria` | Trigger genérica | **Não migra**; a auditoria nova começa na carga |
| `simulacoes` | `comissao_calculos` (+ `comissoes`) | Vendedor→`COTADO`; Compras→`REAL`; `markup_bruto`→`markup_bruto_pct`; `margem_liquida`→`margem_liquida_pct`; `pct_comissao_efetivo`→`comissao_efetiva_pct`; `numero_pedido`/`sequencial` saem (chave é a proposta) | **Não migra**: 14 simulações de pedidos antigos ficam no módulo atual (N16-13, sem migração do ERP antigo) |
| `simulacao_itens` | `comissao_calculo_itens` | `pct_ipi`→`ipi_pct`; `preco_unit_compra`→`preco_unit_compra_cotado`; `margem_item`→`margem_item_pct`; `pct_comissao`→`comissao_pct`; `qtd` e `qtd_compra` de `double`→`numeric(15,4)`; `origem_compra` texto→código | **Não migra** (idem) |
| `vw_simulacao_resolvida` | `comissoes_nf_itens` (gravado) | O `LEAST` e o teto passam de view a linha gravada | Substituída |
| `vw_comissao_master` | `comissoes_nf` + `vw_comissao_visao_geral` | Situação por estado explícito | Substituída |
| `vw_comissao_nf` | `vw_comissao_nf_fila` | | Substituída |
| `vw_comissao_resumo_mensal` | `vw_comissao_resumo_mensal` | `valor_comissao_bloqueado` corrigido | Substituída |
| `fn_dashboard_comissoes`, `fn_comissao_coordenadores_mes`, `fn_jsonb_numero` | `fn_coordenadores_vigentes`, `fn_coordenadores_apurar` | A conta do coordenador é a mesma | `fn_jsonb_numero` não migra (existe por causa do JSON do relatório provisório) |
| `core_vendas_faturamento.comissoes_provisoria` | — | Fora do schema; não usada | Não migra |

Conversão de chaves dos JSON de parâmetros (carga, 🟡):

| JSON atual | Código novo |
|---|---|
| `icms_saida`: Paraná, São Paulo, Minas Gerais, Rio de Janeiro, Santa Catarina, Rio Grande do Sul, Demais estados, Importação | `PR`, `SP`, `MG`, `RJ`, `SC`, `RS`, `DEMAIS`, `IMPORTACAO` |
| `icms_entrada`: SÃO PAULO, SÃO PAULO - Base de ICMS Reduzida, DEMAIS ESTADOS, SÃO PAULO - IMPORTAÇÃO, DEMAIS ESTADOS - IMPORTAÇÃO, OPTANTE SIMPLES | `SP`, `SP_REDUZIDA`, `OUTRA_UF`, `IMPORTACAO_SP`, `IMPORTACAO_OUTRA_UF`, `SIMPLES` |
| `encargos_pagamento`: 19 condições ("30 DDL", "À Vista", "30/60"…) | `condicao_pagamento` igual, texto |

## O que NÃO migra

- `simulacoes`, `simulacao_itens` e os dados de pedido do módulo atual: continuam lá, **intocados**. O pedido que chega do Omie **sem proposta** entra no módulo **novo** (N16-103, anexo `0006`): dossiê `PEDIDO_OMIE`; o vendedor preenche a simulação como hoje no Simulador de Comissão (N16-104) e a comissão segue como a da proposta.
- `bloqueio_comissoes`, `comissao_coordenadores_historico`, `comissoes_provisoria`, `fn_jsonb_numero`, as 4 views antigas.
- A regra do protótipo `experimental/simulador-comissao` (letra por pedido inteiro) **não** é referência; o motor de referência é o por item.
- Telas de Comissões atuais: seguem funcionando, sem mudança (N16-11).

## Plano de carga de dados (para o Gustavo)

1. Aplicar `0001-core-comissao.sql` (blocos 0 a 8).
2. Carga de parâmetros: 3 linhas de `simulador_parametros` → `parametros` e filhas, convertendo as chaves (tabela acima). Conferir: o agregado de despesas fica 11,451734 e o detalhe soma 11,451733 (diferença de 0,000001, esperada).
3. Carga de `regras_fixas_cliente` (4), `exclusoes` (9), `coordenadores` e `coordenadores_regras` (6 e 6), com `created_by` nulo e motivo de migração.
4. Conferir contagens e que `fn_parametros_json` devolve, por unidade, o mesmo objeto de `simulador_parametros` (diff por chave).
5. Aplicar o bloco 9 depois do SQL de proposta e pedido e do SQL do Orçamento.
6. Rodar os testes de ouro do motor (API) contra as 14 simulações.

## Riscos

| # | Risco | Mitigação |
|---|---|---|
| 1 | O custo real do Ciclo 1 vem **sem impostos** (API-008, D5; a OC do hub não guarda IPI, ICMS, ST nem DIFAL por item, N14-23); o crédito de ICMS, o IPI e a ST de cada evento são herdados da proposta, o que pode divergir do imposto real da OC | Marcar o evento (`imposto_real = false`) e o cálculo (`imposto_completo = false`); a Controladoria vê "imposto estimado"; revisar quando existir imposto por item (OQ-11, PS-014, [[Modelo-Estoque-e-Custo-do-Lote]]) |
| 7 | Muitos eventos por item (50 OCs de 1 unidade = 50 linhas de evento por item e por recálculo, e cálculo é imutável) | Recálculo só quando muda o conjunto de eventos; o job agrupa eventos pendentes por comissão (`uq_fila_pendente`); estimar volume antes do go-live |
| 8 | A cotação de moeda e o desconto da OC já entram em `valor_total` do evento (`fn_custo_evento_sincronizar_oc`); `cotacao_a_conferir` pode estar marcada | O evento herda a marca; a tela do drill-down mostra "cotação a conferir" |
| 2 | Faturamento parcial de um **item** em duas NFs: a chave de ligação é `codigo_item_omie` (único por item de pedido, `uq_produto_vendas_item_linha`) | Pergunta C03 ao Gustavo; o modelo aceita 1 NF por item hoje |
| 3 | A `vw_pedido_item_custo` não tem `atualizado_em` (tem `eventos` e `ultimo_evento_em`) | Trigger em `custos_eventos` enfileira; a varredura `vw_comissao_custo_divergente` (bloco 9) é a rede de segurança |
| 4 | Motor em ponto flutuante (JS) contra `numeric` no banco | Aceitar até R$ 0,01 por NF com explicação; testes de ouro |
| 5 | A Michele pode discordar do significado de "desaprovar" e "bloquear" | Perguntas M10 e M11; os `CHECK` de `comissao_decisoes` mudam com uma linha |
| 6 | Dado pessoal de remuneração em `coordenadores_regras` | Perfil da tela de parâmetros restrito; a `auditoria` guarda quem viu/mudou apenas escrita |

## Perguntas em aberto

Perguntas para a Michele estão em M01 a M16 na nota [[01-Motor-Atual-Como-Calcula]]; **ela respondeu em 19/10/2026 ([[Registro-de-Decisoes|respostas da Controladoria de 19/10 (N16-42 a N16-51)]]) e onde diverge dos padrões abaixo vale a resposta**: `C05`, `C07` e a `C03` mudaram (N16-44, N16-48, N16-49), e o DDL ainda precisa acompanhar. As demais:

| ID | Pergunta | Quem responde | Padrão proposto 🟡 |
|---|---|---|---|
| C01 | (Respondida) Nomes das tabelas de `core_comercial`: o desenho de 16/10 usa o **singular** (`proposta`, `proposta_item`, `pedidos`, `pedidos_itens`, `custos_eventos`) | Gustavo | O bloco 9 já está com esses nomes |
| C02 | (Respondida) A `vw_pedido_item_custo` não tem `atualizado_em`, mas tem `eventos` e `ultimo_evento_em`, e `custos_eventos` aceita trigger de INSERT | Gustavo | Trigger enfileira; a view de divergência é rede de segurança |
| C03 | ✅ **Respondida (N16-49):** o mesmo item pode sair em várias NFs, **sem pagar duas vezes a mesma quantidade** (`quantidade_comissionavel`). Resta ao Gustavo confirmar como o Omie devolve o `codigo_item_omie` por NF 🟡 | Nathan (feito), Gustavo | Várias NFs por item, controlando a quantidade já paga |
| C04 | A entrada do motor (itens, destino, condição, frete, preço) sai de uma view `core_comercial` ou o serviço da proposta a monta? | Pablo, Gustavo | Serviço interno da API lê as tabelas da proposta |
| C05 | ✅ **Respondida (N16-48, OQ-25):** o custo parcial **não usa o cotado no restante**; a comissão é paga **só sobre as peças com custo real**; quando o custo completa, a diferença vai para a apuração seguinte, para nova decisão (`valor_pendente_custo`) | Michele (feita) | Só peças com custo real |
| C06 | ✅ **Respondida (N16-68 a N16-71):** pedido cancelado antes da NF: a comissão estimada vira histórico, com motivo; o comprado vai ao Estoque. **Falta no DDL:** campos do cancelamento do pedido e a pendência de devolução parcial (passo seguinte) | Nathan (feito) | Histórico com motivo |
| C07 | ✅ **Respondida (N16-44, N16-45):** decidem a Controladoria, a Gerência e a Coordenação, com as mesmas permissões e sem teto; ninguém decide sobre a própria comissão (`perfil_decisor` em `comissao_decisoes`) | Nathan (feito) | Três perfis |
| C09 | ✅ **Respondida (N16-38, OQ-11):** a OC e o item da OC ganham campos de IPI, ICMS, ST e DIFAL, pré-preenchidos com os da proposta e editados por Compras antes de comprar. `imposto_real` = true quando vêm da OC aprovada 🟡 | Nathan (feito) | Campos da OC |
| C10 | ✅ **Respondida (N16-22):** o encargo da condição de pagamento **não entra no custo do evento**; entra só no preço sugerido, como no motor atual (`motor.ts:330`). O percentual do evento fica guardado para auditoria | Nathan (feito) | Não entra no custo |
| C11 | DIFAL da **compra** (uso e consumo) entra no custo líquido? O motor atual só conhece o DIFAL da **venda** (cabeçalho, total da NF) | Michele | Não entra; guardado no evento |
| C12 | ✅ **Respondida (N16-51, OQ-28):** o passo em que Compras aprova o percentual de compras **sai do fluxo e fica pronto no sistema, desligado** (`exige_conferencia_compras = false`); o cálculo `REAL` o substitui | Nathan (feito) | Desligado |
| C13 | Onde fica o pedido de aprovação do vendedor (`C8`): em `core_comercial` (`divergencia_compra`), não em `core_comissao`; a comissão só reage ao resultado (aprovada: margem e comissão caem) | Gustavo | `core_comercial` |
| C14 | Abatimento por devolução parcial: tabela de pendência (`comissao_devolucao_pendente`) com NF, quem informou, item, quantidade e valor | Gustavo | Pendência até o Fiscal ou a Controladoria informar |
| C08 | Cargas de `vigencia_inicio` das regras e exclusões migradas: `2000-01-01` (como os coordenadores) ou a data de criação? | Michele | `2000-01-01` |

Relacionados: [[01-Motor-Atual-Como-Calcula]], [[02-Tabelas-Atuais-core_comissionamento]], [[04-Regras-e-Estados-da-Comissao-Nova]], [[Contratos-da-v2|LOG-47]], [[Modelo-Estoque-e-Custo-do-Lote]], [[Comissoes]].
