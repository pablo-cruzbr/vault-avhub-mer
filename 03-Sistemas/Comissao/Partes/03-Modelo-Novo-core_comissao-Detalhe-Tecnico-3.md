---
tags: [comissao, banco, core_comissao, modelo, proposta, controladoria, parte]
criado: 2026-11-05
estado-em: 2026-11-23
develop-conferida: [api-acos-vital ce4f90f, av-hub 7f0f7e2, em 2026-11-23, só o grão do motor atual]
status: proposta
dono: Gustavo (DBA)
parte-de: "[[03-Modelo-Novo-core_comissao]]"
fontes: [N16-02, N16-03, N16-09, N16-10, N16-11, N16-17, N16-18, N16-19, N16-20, OQ-06, OQ-11, OQ-12, OQ-28, dump core_comissionamento convertido, av-hub lib/simulador/motor.ts, tela-simulador-comissao.png]
---

# Modelo novo: schema `core_comissao`: detalhe técnico (3/4)

**Em uma frase:** detalhe técnico da nota [[03-Modelo-Novo-core_comissao]] (parte 3 de 4): Grupo: NF, conferência de Compras e decisão (de Tabelas e colunas); Grupo: Rastro (de Tabelas e colunas); Como as tabelas respondem ao que o Nathan pediu; Views; Funções do banco.

**Onde estamos:** ← [[03-Modelo-Novo-core_comissao]] (resumo e índice) · partes: [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-1]] · [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-2]] · **03-Modelo-Novo-core_comissao-Detalhe-Tecnico-3** · [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-4]]

## Tabelas e colunas (continuação)

### Grupo: NF, conferência de Compras e decisão

#### `core_comissao.comissoes_nf`

Comissão fechada sobre UMA NF faturada. É o que chega à Controladoria já calculada. Enquanto AGUARDANDO_DECISAO o custo real que chegar recalcula; depois da decisão não muda mais.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_comissao` | uuid | não |  |  |
| `codigo_empresa` | uuid | não |  |  |
| `codigo_nf_omie` | bigint | não |  | Chave estável da NF (PK de notas_fiscais é codigo_empresa + codigo_nf_omie). Corrige o bloqueio atual, que usa o número com zeros à esquerda. |
| `numero_nf` | varchar(10) | não |  |  |
| `data_emissao` | date | não |  |  |
| `id_calculo_cotado` | uuid | não |  |  |
| `id_calculo_real` | uuid | sim |  |  |
| `valor_faturado` | numeric(15,2) | não |  |  |
| `valor_se_cotado` | numeric(15,2) | não |  | O que a NF pagaria só com o percentual do vendedor (custo cotado). |
| `valor_calculado` | numeric(15,2) | não |  | Soma dos itens: round(valor faturado x LEAST(percentual cotado, percentual real) / 100, 2). Zero quando motivo_zerado. |
| `queda_por_custo` | numeric(15,2) | sim | (valor_se_cotado - valor_calculado) |  |
| `comissao_efetiva_pct` | numeric(7,4) | sim |  |  |
| `custo_completo` | boolean | não | false |  |
| `qtd_itens` | integer | não | 0 |  |
| `qtd_itens_sem_vinculo` | integer | não | 0 |  |
| `motivo_zerado` | varchar(20) | sim |  |  |
| `estado` | varchar(20) | não | 'AGUARDANDO_DECISAO' | AGUARDANDO_DECISAO > APROVADA / DESAPROVADA / CORTADA / ALTERADA (finais) ou BLOQUEADA (pode ser liberada por nova decisão). NF_CANCELADA: NF cancelada antes da decisão. |
| `valor_final` | numeric(15,2) | sim |  | Valor decidido pela Controladoria. Nulo até a decisão. BLOQUEADA = 0 (retido; valor_calculado mostra quanto está retido). |
| `id_decisao_atual` | uuid | sim |  |  |
| `compras_estado` | varchar(10) | não | 'PENDENTE' | 🟡 Conferência de Compras sobre o percentual de Compras (o passo Comissão: após a aprovação de Compras do simulador atual). PENDENTE > CONFIRMADA ou CONTESTADA. Qualquer recálculo da NF volta a PENDENTE. Interno: o vendedor nunca vê (N16-18). |
| `compras_por` | uuid | sim |  |  |
| `compras_em` | timestamptz | sim |  |  |
| `decidida_em` | timestamptz | sim |  |  |
| `recalculada_em` | timestamptz | sim |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |

#### `core_comissao.comissoes_nf_itens`

Quebra da comissão da NF por item faturado: valor faturado x menor percentual entre o cotado e o real (⚠️ o motor atual passou ao grão do pedido em 18 a 23/11 (N16-185, N16-186, N16-190); este desenho ainda é por item. Ver "O motor mudou de grão" em [[03-Modelo-Novo-core_comissao]]). Regenerada enquanto a NF aguarda decisão.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_comissao_nf` | uuid | não |  |  |
| `id_item_cotado` | uuid | não |  |  |
| `id_item_real` | uuid | sim |  |  |
| `id_item_pedido` | uuid | sim |  |  |
| `codigo_item_omie` | bigint | não |  |  |
| `quantidade_faturada` | numeric(15,4) | sim |  |  |
| `valor_faturado_item` | numeric(15,2) | não |  |  |
| `comissao_cotada_pct` | numeric(7,4) | não |  |  |
| `comissao_real_pct` | numeric(7,4) | sim |  |  |
| `comissao_final_pct` | numeric(7,4) | não |  | LEAST(comissao_cotada_pct, comissao_real_pct); sem cálculo real, vale o cotado. Mesma regra de pct_final do módulo atual. |
| `regra_aplicada` | varchar(20) | não |  |  |
| `valor_se_cotado` | numeric(15,2) | não |  |  |
| `valor_calculado` | numeric(15,2) | não |  |  |

#### `core_comissao.comissao_conferencias_compras`

🟡 Conferência de Compras sobre o cálculo REAL da NF. CONFIRMAR = Compras concorda com o percentual de Compras; CONTESTAR (justificativa obrigatória) = custo, imposto ou classificação do item errado: Compras corrige na OC ou no lote e o motor recalcula. Compras NÃO altera a proposta (N16-08). Só INSERT.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_comissao_nf` | uuid | não |  |  |
| `sequencia` | integer | não |  |  |
| `tipo` | varchar(10) | não |  |  |
| `id_calculo_real` | uuid | sim |  |  |
| `justificativa` | text | sim |  |  |
| `feito_por` | uuid | não |  |  |
| `feito_em` | timestamptz | não | now() |  |

#### `core_comissao.comissao_decisoes`

Decisão da Controladoria sobre a comissão de uma NF: quem, quando, justificativa obrigatória (10+ caracteres), valor antes e depois. Só INSERT. A comissão da NF recebe uma decisão final; BLOQUEAR admite decisão posterior.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_comissao_nf` | uuid | não |  |  |
| `sequencia` | integer | não |  |  |
| `tipo` | varchar(10) | não |  |  |
| `justificativa` | text | não |  |  |
| `justificativa_visivel_vendedor` | boolean | não | false | 🟡 M11: a Controladoria escolhe se o vendedor lê a justificativa. Padrão: não. |
| `corte_pct` | numeric(7,4) | sim |  | Só em CORTAR: percentual cortado (50 = pela metade). |
| `valor_antes` | numeric(15,2) | não |  |  |
| `valor_depois` | numeric(15,2) | não |  |  |
| `estado_antes` | varchar(20) | não |  |  |
| `estado_depois` | varchar(20) | não |  |  |
| `decidido_por` | uuid | não |  |  |
| `decidido_em` | timestamptz | não | now() |  |

### Grupo: Rastro

#### `core_comissao.comissao_eventos`

Linha do tempo de cada comissão (para a tela de detalhe). Só INSERT. visivel_vendedor marca o que a tela do vendedor pode listar (nunca valor real nem custo antes da decisão).

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_comissao` | uuid | não |  |  |
| `id_comissao_nf` | uuid | sim |  |  |
| `tipo` | varchar(30) | não |  |  |
| `descricao` | text | não |  |  |
| `dados` | jsonb | não | '{}' |  |
| `visivel_vendedor` | boolean | não | false |  |
| `feito_por` | uuid | sim |  |  |
| `feito_em` | timestamptz | não | now() |  |

#### `core_comissao.comissao_fila_recalculo`

Caixa de saída de eventos: um custo real novo (ou NF nova) marca a comissão e o job do motor recalcula. Eventos repetidos enquanto pendentes viram um só.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_comissao` | uuid | não |  |  |
| `motivo` | varchar(12) | não |  |  |
| `criado_em` | timestamptz | não | now() |  |
| `processado_em` | timestamptz | sim |  |  |
| `id_calculo_gerado` | uuid | sim |  |  |
| `tentativas` | integer | não | 0 |  |
| `erro` | text | sim |  |  |

#### `core_comissao.auditoria`

Quem mudou parâmetro, regra, exclusão ou coordenador, quando, antes e depois. Só INSERT. Alimentada por core_comissao.fn_auditar().

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | bigint | não |  |  |
| `tabela` | varchar(40) | não |  |  |
| `id_registro` | uuid | não |  |  |
| `operacao` | varchar(6) | não |  |  |
| `dados_antes` | jsonb | sim |  |  |
| `dados_depois` | jsonb | sim |  |  |
| `feito_por` | uuid | sim |  |  |
| `feito_em` | timestamptz | não | now() |  |
| `usuario_banco` | text | não | CURRENT_USER |  |


## Como as tabelas respondem ao que o Nathan pediu

| Requisito (decisão) | Onde está |
|---|---|
| Comissão estimada da proposta, por item e total (N16-10) | `comissao_calculos` (`tipo = COTADO`, total em `valor_comissao_total`) e `comissao_calculo_itens` (`valor_comissao_estimado`) |
| Histórico quando a proposta é cancelada (N16-02) | `comissoes.estado = CANCELADA` + `cancelada_em/por`, `motivo_cancelamento`; cálculos e eventos **permanecem** (imutáveis); vendedor lê por `vw_comissao_vendedor` |
| Recálculo automático por evento de custo real (N16-09, N16-10, N16-20) | `comissao_fila_recalculo` (alimentada por trigger em `core_comercial.custos_eventos`, bloco 9) + job do motor lendo `core_comercial.vw_pedido_item_custo` e `custos_eventos`; resultado em `comissao_calculos` (`tipo = REAL`, `gatilho = CUSTO_REAL`) com um `comissao_calculo_eventos` por evento |
| Condições próprias de cada evento (N16-20) | `comissao_calculo_eventos` (condição de pagamento, encargo, frete, origem do ICMS, IPI, ST, DIFAL, fornecedor); `vw_comissao_eventos_custo` |
| Passo "Comissão: após a aprovação de Compras" (N16-19, OQ-28) | `comissoes_nf.compras_estado`, `comissao_conferencias_compras`, `parametros.exige_conferencia_compras` (padrão `false`) |
| Fechamento por NF (N16-10) | `comissoes_nf` + `comissoes_nf_itens`, por `fn_comissao_nf_fechar` |
| Fila da Controladoria (N16-10) | `vw_comissao_nf_fila` (filtro `estado = AGUARDANDO_DECISAO`) |
| Decisão com justificativa, quem, quando, antes e depois (N16-10) | `comissao_decisoes` (justificativa `CHECK >= 10`, `valor_antes`, `valor_depois`, `decidido_por`, `decidido_em`) |
| Vendedor vê a estimada até a decisão e a real depois (N16-10) | `vw_comissao_vendedor`, `vw_comissao_nf_vendedor` |
| Visão geral da Controladoria (N16-10) | `vw_comissao_visao_geral`, `vw_comissao_resumo_mensal` |
| Parâmetros, regras fixas, bloqueios, blacklists, coordenadores (N16-11) | `parametros*`, `regras_fixas_cliente`, `exclusoes`, `coordenadores*` |
| Auditoria | `auditoria` (configuração), `comissao_eventos` (linha do tempo), `comissao_decisoes` (decisão) |

## Views

| View | Quem usa | O que devolve |
|---|---|---|
| `vw_comissao_vendedor` | Vendedor (escopo do token) | Por proposta: **estimada** (do cálculo cotado) sempre; `valor_decidido` só das NFs já decididas. **Não traz** custo real, margem, queda nem comparação |
| `vw_comissao_nf_vendedor` | Vendedor | Por NF: `EM_ANALISE` **sem valor** até a decisão; depois `valor_final` e tipo da decisão; justificativa só se a Controladoria marcou |
| `vw_comissao_nf_fila` | Controladoria, Compras (leitura) | Por NF: faturado, valor se cotado, valor calculado, **queda por custo**, margem e letra cotadas e reais, custo completo, imposto real completo, conferência de Compras, estado |
| `vw_comissao_eventos_custo` | Controladoria, Gerência, Compras (leitura) | Um evento de custo por linha, com as condições do próprio evento (N16-20) |
| `vw_comissao_itens_custo` | Controladoria e Gerência | Por item: custo cotado × custo real, cobertura, margem, letra, % cotado, % real e % final |
| `vw_comissao_visao_geral` | Controladoria e Gerência | Toda comissão em qualquer estado, com estimado, com custo real, calculado, final e bloqueado |
| `vw_comissao_resumo_mensal` | Controladoria | Por mês e vendedor (`GROUPING SETS`; filtrar `is_total`); `valor_bloqueado` real (no módulo atual é sempre zero) |

A API escolhe a view pelo perfil. O vendedor **nunca** recebe permissão nas views da Controladoria.

## Funções do banco

| Função | Papel |
|---|---|
| `fn_parametros_json(codigo_empresa, data)` | Parâmetros vigentes na forma que o motor consome |
| `fn_regra_fixa_vigente(codigo_empresa, codigo_cliente, data)` | Id da regra fixa do cliente na data |
| `fn_excluido(codigo_empresa, tipo, codigo, data)` | Cliente ou vendedor excluído na data |
| `fn_calculo_gravar(payload jsonb)` | Grava cálculo (cabeçalho e itens) numa transação e aponta o dossiê |
| `fn_comissao_mudar_estado(...)` | Única porta de mudança de estado do dossiê (aprovar proposta, criar pedido, encerrar, cancelar) |
| `fn_comissao_nf_fechar(id_comissao, codigo_nf_omie)` | Fecha ou refaz a comissão da NF (menor percentual por item, valor faturado × percentual, exclusão) |
| `fn_comissao_decidir(...)` | Decisão da Controladoria, com todas as travas (e a conferência de Compras quando o parâmetro a exige) |
| `fn_comissao_conferir_compras(id_comissao_nf, tipo, justificativa, usuario)` | 🟡 Compras confirma ou contesta o cálculo real da NF |
| `fn_comissao_vincular_itens(id_comissao, itens, usuario)` | Liga item da proposta, item do pedido e `codigo_item_omie` |
| `fn_comissao_nf_cancelar(id_comissao_nf, usuario)` | NF cancelada antes da decisão sai da fila (`NF_CANCELADA`) |
| `fn_coordenadores_vigentes(ini, fim)`, `fn_coordenadores_apurar(competencia, faturamento, usuario)` | Coordenadores (📝 N16-34) |
| `fn_log_imutavel()`, `fn_auditar()`, `fn_parametros_travar()`, `fn_regra_fixa_travar()`, `fn_apuracao_travar()`, `fn_parametros_completo()` | Triggers |
