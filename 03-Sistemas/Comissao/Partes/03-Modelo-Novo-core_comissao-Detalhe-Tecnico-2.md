---
tags: [comissao, banco, core_comissao, modelo, proposta, controladoria, parte]
criado: 2026-11-05
estado-em: 2026-10-29
status: proposta
dono: Gustavo (DBA)
parte-de: "[[03-Modelo-Novo-core_comissao]]"
fontes: [N16-02, N16-03, N16-09, N16-10, N16-11, N16-17, N16-18, N16-19, N16-20, OQ-06, OQ-11, OQ-12, OQ-28, dump core_comissionamento convertido, av-hub lib/simulador/motor.ts, tela-simulador-comissao.png]
---

# Modelo novo: schema `core_comissao`: detalhe técnico (2/4)

**Em uma frase:** detalhe técnico da nota [[03-Modelo-Novo-core_comissao]] (parte 2 de 4): Tabelas e colunas; Grupo: Dossiê e cálculo (de Tabelas e colunas).

**Onde estamos:** ← [[03-Modelo-Novo-core_comissao]] (resumo e índice) · partes: [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-1]] · **03-Modelo-Novo-core_comissao-Detalhe-Tecnico-2** · [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-3]] · [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-4]]

## Tabelas e colunas

Gerado do DDL aplicado em banco descartável (PostgreSQL 18, 16/10/2026, teste funcional); a coluna "Observação" vem dos `COMMENT ON` do DDL.

### Grupo: Parâmetros e regras

#### `core_comissao.parametros`

Parâmetros do motor por unidade e vigência (era simulador_parametros). Linha usada por um cálculo é IMUTÁVEL (só vigencia_fim muda): para mudar percentual, feche a vigência e abra outra. Detalhes em parametros_*.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `codigo_empresa` | uuid | não |  |  |
| `vigencia_inicio` | date | não |  | Parâmetros são por MÊS (N16-19): a vigência começa no dia 1 (a tela mostra "Parâmetros: Maio/23"; hoje: 2023-05-01, descricao Maio/23). |
| `vigencia_fim` | date | sim |  |  |
| `descricao` | varchar(60) | não |  |  |
| `margem_desejada_pct` | numeric(7,4) | não |  |  |
| `despesas_operacionais_pct` | numeric(10,6) | não |  | Soma das despesas operacionais, pontos percentuais. É o valor que o motor usa; parametros_despesas guarda o detalhe (tolerância de 0,00001: na carga atual o detalhe soma 11,451733 e o agregado é 11,451734). |
| `rateio_logistica_pct` | numeric(10,6) | não |  |  |
| `provisao_comissao_pct` | numeric(7,4) | não |  | Comissão máxima provisionada dentro do mark-up e descontada da margem do item (era pct_comissao_provisao). |
| `pis_pct` | numeric(7,4) | não |  |  |
| `cofins_pct` | numeric(7,4) | não |  |  |
| `irpj_base_pct` | numeric(7,4) | não |  |  |
| `irpj_pct` | numeric(7,4) | não |  |  |
| `csll_base_pct` | numeric(7,4) | não |  |  |
| `csll_pct` | numeric(7,4) | não |  |  |
| `adicional_ir_pct` | numeric(7,4) | não |  |  |
| `fabricacao_interna_pct` | numeric(7,4) | não |  | Percentual fixo pago ao item de fabricação interna. |
| `exige_conferencia_compras` | boolean | não | false | 🟡 OQ-28: true = a Controladoria só aprova, corta ou altera a NF depois de Compras confirmar o percentual (o passo "Comissão: após a aprovação de Compras" do simulador atual). Padrão false (o cálculo REAL pelo custo da OC substitui a versão de Compras). |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |

#### `core_comissao.parametros_despesas`

Detalhe das despesas operacionais (SEDES, PESSOAL, PRODUCAO, LOGISTICA, MARKETING, TERCEIROS, FINANCEIRAS, CONTRIBUICOES, ADMINISTRATIVAS). Só auditoria: o motor usa o agregado de parametros.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_parametros` | uuid | não |  |  |
| `categoria` | varchar(30) | não |  |  |
| `pct` | numeric(10,6) | não |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |

#### `core_comissao.parametros_icms_saida`

ICMS de saída por destino da venda. destino = UF (SP, MG, PR, RJ, SC, RS), DEMAIS (demais estados) ou IMPORTACAO (alíquota usada no mark-up de importação). Substitui o JSON icms_saida.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_parametros` | uuid | não |  |  |
| `destino` | varchar(12) | não |  |  |
| `rotulo` | varchar(60) | não |  |  |
| `aliquota_pct` | numeric(7,4) | não |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |

#### `core_comissao.parametros_icms_entrada`

ICMS recuperável na compra por origem. Códigos iguais aos de OrigemIcmsCompra do Comercial. Substitui o JSON icms_entrada (que casava por texto).

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_parametros` | uuid | não |  |  |
| `origem_compra` | varchar(25) | não |  |  |
| `aliquota_pct` | numeric(7,4) | não |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |

#### `core_comissao.parametros_encargos_pagamento`

Encargo financeiro somado ao preço sugerido por condição de pagamento. Substitui o JSON encargos_pagamento.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_parametros` | uuid | não |  |  |
| `condicao_pagamento` | varchar(40) | não |  |  |
| `encargo_pct` | numeric(7,4) | não |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |

#### `core_comissao.parametros_faixas`

Faixas da letra: margem líquida mínima do item (semiaberto [min, próxima)) e percentual. Hoje A 15/2,0; B 12/1,3; C 9/0,7; D 0/0,5. Substitui o JSON faixas_comissao.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_parametros` | uuid | não |  |  |
| `letra` | char(1) | não |  |  |
| `margem_min_pct` | numeric(7,4) | não |  |  |
| `comissao_pct` | numeric(7,4) | não |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |

#### `core_comissao.regras_fixas_cliente`

Teto de comissão por cliente e vigência (era regras_comissoes_fixas). Limita só item de REVENDA com regra LETRA. Gatilho: markup bruto do pedido >= gatilho_markup_pct usa a condicional, senão a padrão.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `codigo_empresa` | uuid | não |  |  |
| `codigo_cliente` | varchar(60) | não |  | Código Omie do parceiro (varchar(60), como notas_fiscais.codigo_cliente). Só é único dentro da unidade. |
| `vigencia_inicio` | date | não |  |  |
| `vigencia_fim` | date | sim |  |  |
| `gatilho_markup_pct` | numeric(8,4) | não |  | Era `margem`. Compara com o MARKUP BRUTO do pedido ((total NF - compra bruta) / compra bruta), não com a margem líquida da letra. |
| `comissao_padrao_pct` | numeric(7,4) | não |  |  |
| `comissao_condicional_pct` | numeric(7,4) | não |  | CHECK condicional >= padrão é proposta 🟡 (o módulo atual não impede o contrário). |
| `motivo` | text | sim |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |
| `deleted_at` | timestamptz | sim |  |  |
| `deleted_by` | uuid | sim |  |  |

#### `core_comissao.exclusoes`

Cliente ou vendedor fora do comissionamento, com vigência e motivo obrigatório (era blacklist_comissoes_destinatario e blacklist_comissoes_vendedores). A comissão excluída NÃO some: fica com valor 0 e motivo_zerado visível à Controladoria.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `codigo_empresa` | uuid | não |  |  |
| `tipo` | varchar(10) | não |  |  |
| `codigo_omie` | varchar(60) | não |  |  |
| `vigencia_inicio` | date | não | CURRENT_DATE |  |
| `vigencia_fim` | date | sim |  |  |
| `motivo` | text | não |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |
| `deleted_at` | timestamptz | sim |  |  |
| `deleted_by` | uuid | sim |  |  |

#### `core_comissao.coordenadores`

📝 Vale no módulo novo (N16-34, OQ-06). Pessoa que recebe ajuda de custo e comissão sobre o faturamento total do mês (não depende de proposta). Os valores ficam em coordenadores_regras, por vigência.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `nome` | varchar(100) | não |  |  |
| `id_funcionario` | uuid | sim |  |  |
| `ativo` | boolean | não | true |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |

#### `core_comissao.coordenadores_regras`

Ajuda de custo e percentual do coordenador por vigência. GERENCIA = ranking da gerência; EXCECAO = entra no ranking de vendedores com o mesmo cálculo. Mudar valor = fechar a vigência e abrir outra.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_coordenador` | uuid | não |  |  |
| `tipo` | varchar(10) | não |  |  |
| `ajuda_custo` | numeric(14,2) | não | 0 |  |
| `percentual_pct` | numeric(7,4) | não | 0 | Pontos percentuais: 0,35 = 0,35% do faturamento total do mês. |
| `ordem_desempate` | smallint | não | 0 | Desempate do ranking quando o total empata (menor primeiro). |
| `vigencia_inicio` | date | não |  |  |
| `vigencia_fim` | date | sim |  |  |
| `observacao` | text | sim |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |

#### `core_comissao.coordenadores_apuracoes`

🟡 Foto mensal da comissão dos coordenadores: comissao = round(percentual/100 x faturamento_base, 2); total = ajuda_custo + comissao. O bloqueio/decisão por NF NÃO reduz (decisão do Nathan de 06/10/2026, contrato 38). Depois de fechada não muda.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `competencia` | date | não |  |  |
| `id_coordenador` | uuid | não |  |  |
| `id_regra` | uuid | não |  |  |
| `tipo` | varchar(10) | não |  |  |
| `faturamento_base` | numeric(15,2) | não |  |  |
| `percentual_pct` | numeric(7,4) | não |  |  |
| `ajuda_custo` | numeric(14,2) | não |  |  |
| `comissao` | numeric(15,2) | não |  |  |
| `total` | numeric(15,2) | não |  |  |
| `ordem_desempate` | smallint | não |  |  |
| `gerada_em` | timestamptz | não | now() |  |
| `gerada_por` | uuid | sim |  |  |
| `fechada_em` | timestamptz | sim |  |  |
| `fechada_por` | uuid | sim |  |  |

### Grupo: Dossiê e cálculo

#### `core_comissao.comissoes`

Dossiê da comissão de UMA proposta (uma proposta = um pedido, N16-02). Nasce estimada na V0.3 e acompanha a proposta até o encerramento ou o cancelamento. Cancelada vira histórico consultável.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `codigo_empresa` | uuid | não |  |  |
| `id_proposta` | uuid | não |  |  |
| `id_pedido_venda` | uuid | sim |  |  |
| `numero_proposta` | varchar(20) | não |  |  |
| `numero_pedido` | varchar(20) | sim |  |  |
| `codigo_vendedor_omie` | varchar(11) | não |  |  |
| `codigo_cliente` | varchar(60) | não |  |  |
| `estado` | varchar(20) | não | 'ESTIMADA' | ESTIMADA (proposta ajustável) > CONGELADA (proposta aprovada, estimativa travada) > EM_ACOMPANHAMENTO (pedido criado, custo real chegando, NFs) > ENCERRADA. CANCELADA = histórico. |
| `id_calculo_cotado` | uuid | sim |  | Cálculo do vendedor que vale (o último antes da aprovação da proposta). |
| `id_calculo_real` | uuid | sim |  | Último cálculo feito com o custo real. |
| `custo_real_acima_cotado` | boolean | não | false | Só para a Controladoria e a Gerência. NUNCA sai nas telas do vendedor (N16-18). |
| `proposta_aprovada_em` | timestamptz | sim |  |  |
| `encerrada_em` | timestamptz | sim |  |  |
| `cancelada_em` | timestamptz | sim |  |  |
| `cancelada_por` | uuid | sim |  |  |
| `motivo_cancelamento` | text | sim |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |
| `updated_at` | timestamptz | não | now() |  |
| `updated_by` | uuid | sim |  |  |

#### `core_comissao.comissao_itens_vinculo`

Liga o item da proposta ao item do pedido e ao codigo_item_omie (chave do item faturado em produto_vendas). Preenchido por fn_comissao_vincular_itens quando o pedido é criado no Omie.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_comissao` | uuid | não |  |  |
| `id_item_proposta` | uuid | não |  |  |
| `id_item_pedido` | uuid | não |  |  |
| `codigo_item_omie` | bigint | não |  |  |
| `created_at` | timestamptz | não | now() |  |
| `created_by` | uuid | sim |  |  |

#### `core_comissao.comissao_calculos`

Cada execução do motor sobre uma comissão. COTADO = com o custo que o vendedor pôs na proposta; REAL = com o custo real do pedido. Só INSERT: cada recálculo é uma linha nova, então o histórico (inclusive de proposta cancelada) nunca se perde.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_comissao` | uuid | não |  |  |
| `sequencia` | integer | não |  |  |
| `tipo` | varchar(6) | não |  |  |
| `gatilho` | varchar(20) | não |  |  |
| `id_parametros` | uuid | não |  |  |
| `id_regra_fixa` | uuid | sim |  |  |
| `versao_motor` | varchar(20) | não |  | Versão do código do motor que calculou (ex.: motor-1.0.0), para reproduzir e comparar. |
| `estado_destino` | varchar(12) | não |  | Código de parametros_icms_saida.destino (SP, MG, PR, RJ, SC, RS, DEMAIS). A tela mostra rotulo e icms_destino_pct (ex.: São Paulo, ICMS 18%). |
| `icms_destino_pct` | numeric(7,4) | não |  |  |
| `condicao_pagamento` | varchar(40) | não |  |  |
| `encargo_pagamento_pct` | numeric(7,4) | não |  | Encargo da condição de pagamento da VENDA; entra só no preço sugerido (motor.ts:324), não no custo nem na margem. |
| `isento_imposto` | boolean | não | false |  |
| `frete_compra_tipo` | varchar(6) | não | 'RATEIO' |  |
| `frete_compra_total` | numeric(15,2) | não | 0 |  |
| `valor_st_venda` | numeric(15,2) | não | 0 |  |
| `imposto_retido_difal` | numeric(15,2) | não | 0 |  |
| `frete_venda` | numeric(15,2) | não | 0 |  |
| `custo_total` | numeric(15,2) | não |  |  |
| `venda_sugerida` | numeric(15,2) | não |  |  |
| `valor_liquido` | numeric(15,2) | não |  |  |
| `total_nf` | numeric(15,2) | não |  |  |
| `markup_projetado` | numeric(10,4) | sim |  | Preço sugerido total / custo total (motor.ts:532). |
| `markup_real` | numeric(10,4) | sim |  | MARK-UP REAL da tela: arredondarParaCima(venda de revenda / custo total, 2) (motor.ts:535). |
| `markup_bruto_pct` | numeric(10,4) | não |  | O "AC8": (total NF de revenda - compra bruta) / compra bruta. Gatilho da regra fixa. Não é a margem líquida que decide a letra. |
| `margem_liquida_pct` | numeric(10,4) | não |  |  |
| `lucro` | numeric(15,2) | não |  |  |
| `letra_equivalente` | char(1) | sim |  |  |
| `comissao_efetiva_pct` | numeric(7,4) | não |  |  |
| `valor_comissao_total` | numeric(15,2) | não |  |  |
| `qtd_itens` | integer | não |  |  |
| `qtd_itens_prejuizo` | integer | não | 0 |  |
| `custo_completo` | boolean | não | false | REAL: true quando todos os itens de revenda têm a quantidade inteira coberta por custo real. |
| `imposto_completo` | boolean | não | true | REAL: false quando algum evento de custo usou o imposto herdado da proposta por falta de imposto real (OQ-11). Cálculo parcial por imposto. |
| `avisos` | jsonb | não | '[]' |  |
| `calculado_em` | timestamptz | não | now() |  |
| `calculado_por` | uuid | sim |  |  |

#### `core_comissao.comissao_calculo_itens`

Item de um cálculo, com TODAS as entradas e saídas do motor (reprodutível). A comissão é decidida item a item. Só INSERT.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_calculo` | uuid | não |  |  |
| `ordem` | integer | não |  |  |
| `id_item_proposta` | uuid | não |  |  |
| `id_item_pedido` | uuid | sim |  |  |
| `codigo_item_omie` | bigint | sim |  |  |
| `codigo_produto` | varchar(60) | sim |  |  |
| `descricao` | text | sim |  |  |
| `tipo_item` | varchar(20) | não | 'REVENDA' |  |
| `qtd` | numeric(15,4) | não |  |  |
| `unidade` | varchar(20) | sim |  |  |
| `qtd_compra` | numeric(15,4) | sim |  |  |
| `unidade_compra` | varchar(20) | sim |  |  |
| `fornecedor` | varchar(120) | sim |  |  |
| `origem_compra` | varchar(25) | sim |  |  |
| `ipi_pct` | numeric(7,4) | não | 0 |  |
| `valor_st` | numeric(15,2) | não | 0 |  |
| `frete_compra_valor` | numeric(15,2) | não | 0 |  |
| `preco_unit_compra_cotado` | numeric(15,4) | não | 0 | Preço unitário de compra que o vendedor pôs na proposta (na unidade de compra). No cálculo REAL o custo líquido do item é a SOMA do custo líquido de cada evento (comissao_calculo_eventos, com as condições do próprio evento, N16-20) mais a parte ainda não coberta, calculada com o preço e as condições cotados. |
| `preco_unit_venda` | numeric(15,4) | não |  |  |
| `quantidade_coberta` | numeric(15,4) | sim |  |  |
| `custo_real_total` | numeric(15,2) | sim |  | custo_total de core_comercial.vw_pedido_item_custo, lido pelo item = empresa + número do pedido + produto do Omie (N16-102; soma das linhas de OC ou lote, sem impostos no Ciclo 1). Nulo no cálculo COTADO. |
| `custo_real_unitario_medio` | numeric(15,6) | sim |  |  |
| `custo_completo` | boolean | não | false |  |
| `qtd_eventos` | integer | não | 0 | REAL: quantidade de eventos de custo (OC, lote) somados no item. |
| `qtd_descoberta` | numeric(15,4) | sim |  |  |
| `custo_liquido_descoberto` | numeric(15,2) | não | 0 | REAL: custo líquido da quantidade ainda não coberta por evento = custo líquido cotado x qtd_descoberta / qtd. Zero quando o item está completo. |
| `imposto_completo` | boolean | não | true |  |
| `custo_real_acima_cotado` | boolean | não | false |  |
| `compra_bruta` | numeric(15,2) | não | 0 |  |
| `icms_entrada_pct` | numeric(7,4) | não | 0 |  |
| `icms_recuperar` | numeric(15,2) | não | 0 |  |
| `valor_ipi` | numeric(15,2) | não | 0 |  |
| `frete_item` | numeric(15,2) | não | 0 |  |
| `custo_liquido` | numeric(15,2) | não | 0 |  |
| `preco_unit_sugerido` | numeric(15,4) | sim |  |  |
| `preco_total_sugerido` | numeric(15,2) | sim |  |  |
| `venda_item` | numeric(15,2) | não |  |  |
| `icms_efetivo_pct` | numeric(7,4) | sim |  |  |
| `impostos_pct` | numeric(7,4) | sim |  |  |
| `lucro_item` | numeric(15,2) | sim |  |  |
| `margem_item_pct` | numeric(10,4) | sim |  |  |
| `letra_item` | char(1) | sim |  |  |
| `comissao_letra_pct` | numeric(7,4) | não |  | Percentual da letra (ou 0 no prejuízo, ou o fixo da fabricação interna) ANTES do teto da regra fixa. |
| `teto_regra_pct` | numeric(7,4) | sim |  |  |
| `comissao_pct` | numeric(7,4) | não |  | Percentual do item neste cálculo, já com o teto da regra fixa. É o "percentual do vendedor" (COTADO) ou "percentual de compras" (REAL) do módulo atual. |
| `regra_aplicada` | varchar(20) | não |  |  |
| `valor_comissao_estimado` | numeric(15,2) | não |  | venda_item x comissao_pct / 100, sobre o valor do pedido. O pagamento real usa o faturado da NF (comissoes_nf_itens). |

#### `core_comissao.comissao_calculo_eventos`

Detalhe por evento do custo líquido de um item REAL (N16-20): condições do próprio evento (condição de pagamento, encargo, origem do ICMS, IPI, ST, DIFAL, frete, fornecedor) e o custo líquido pela fórmula do motor. Só INSERT. A soma de custo_liquido dos eventos mais custo_liquido_descoberto do item é o custo_liquido do item.

| Coluna | Tipo | Nulo | Padrão | Observação |
|---|---|---|---|---|
| `id` | uuid | não | uuidv7() |  |
| `id_calculo_item` | uuid | não |  |  |
| `ordem` | integer | não |  |  |
| `id_custo_evento` | uuid | não |  | core_comercial.custos_eventos.id. FK entra no bloco 9, depois do SQL de proposta e pedido. |
| `codigo_parcial` | varchar(20) | sim |  |  |
| `data_evento` | date | não |  |  |
| `origem` | varchar(26) | não |  |  |
| `numero_documento` | varchar(30) | sim |  |  |
| `fornecedor` | varchar(120) | sim |  |  |
| `quantidade_coberta` | numeric(15,4) | não |  |  |
| `valor_unitario` | numeric(15,6) | não |  |  |
| `valor_total` | numeric(15,2) | não |  |  |
| `moeda` | varchar(3) | não | 'BRL' |  |
| `cotacao_moeda` | numeric(15,6) | sim |  |  |
| `condicao_pagamento` | varchar(40) | sim |  |  |
| `encargo_pagamento_pct` | numeric(7,4) | sim |  | Encargo da condição de pagamento da OC (OQ-12, N16-22). Guardado para auditoria; não entra no custo líquido do evento (o encargo só entra no preço sugerido, como no motor atual). |
| `frete_tipo` | varchar(6) | não | 'RATEIO' | VALOR quando a OC traz o frete do evento; RATEIO usa parametros.rateio_logistica_pct sobre compra + IPI + ST, como motor.ts:307-310. |
| `frete_valor` | numeric(15,2) | não | 0 |  |
| `origem_compra` | varchar(25) | sim |  |  |
| `ipi_pct` | numeric(7,4) | não | 0 |  |
| `valor_st` | numeric(15,2) | não | 0 |  |
| `valor_difal` | numeric(15,2) | não | 0 |  |
| `imposto_real` | boolean | não | false | true quando IPI, ST, ICMS e DIFAL vieram do documento (OQ-11). false = herdados da proposta (cálculo parcial por imposto): hoje a OC do hub não guarda imposto por item (N14-23). |
| `compra_bruta` | numeric(15,2) | não |  |  |
| `icms_entrada_pct` | numeric(7,4) | não | 0 |  |
| `icms_recuperar` | numeric(15,2) | não | 0 |  |
| `valor_ipi` | numeric(15,2) | não | 0 |  |
| `frete_evento` | numeric(15,2) | não | 0 |  |
| `custo_liquido` | numeric(15,2) | não |  | compra_bruta - icms_recuperar + valor_ipi + valor_st + frete_evento (motor.ts:312). icms_recuperar = 0 quando valor_st > 0 (motor.ts:280-283). |
