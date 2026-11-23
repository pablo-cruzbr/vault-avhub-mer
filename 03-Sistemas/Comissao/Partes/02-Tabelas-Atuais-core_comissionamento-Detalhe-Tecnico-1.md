---
tags: [comissao, banco, core_comissionamento, tabelas, dba, parte]
criado: 2026-11-23
estado-em: 2026-11-23
status: proposta
dono: Gustavo (DBA)
parte-de: "[[02-Tabelas-Atuais-core_comissionamento]]"
develop-conferida: [api-acos-vital ce4f90f, av-hub 7f0f7e2, em 2026-11-23, colunas, filtros e migrations da comissão de 18 a 23/11; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [dump core_comissionamento convertido (09-Diagramas/fontes), api-acos-vital f322dcd src/schemas/core_comissionamento, N16-11, api-acos-vital 7c05f92, 0244b1a, e363da5, 0e56354, 06bb146 (models e rotas de core_comissionamento), N16-185 a N16-190, PS-062, PS-063]
---

# Tabelas, views e funções atuais do `core_comissionamento`: detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[02-Tabelas-Atuais-core_comissionamento]] (parte 1 de 2): O que entrou de 18 a 23/11 (no tst; produção ❓, PS-062); Mapa do schema; Tabelas.

**Onde estamos:** ← [[02-Tabelas-Atuais-core_comissionamento]] (resumo e índice) · partes: **02-Tabelas-Atuais-core_comissionamento-Detalhe-Tecnico-1** · [[02-Tabelas-Atuais-core_comissionamento-Detalhe-Tecnico-2]]

## O que entrou de 18 a 23/11 (no tst; produção ❓, PS-062)

A comissão passou ao grão do pedido (N16-185, N16-186), à competência (N16-187), ao escopo do vínculo próprio (N16-189), à trava da versão do vendedor (N16-188) e à versão pré-aceita (N16-190). O código da `api-acos-vital` está na `develop` (commits `7c05f92`, `0244b1a`, `e363da5`, `0e56354`, `06bb146`). As migrations ficam com o DBA, **fora do repositório**. As seis estão no **tst** ✅ ([[Dump-AvHub-Teste-2026-11-23]], onde a ficha dá a linha de cada objeto) e não estão no dump de **produção** de 18/11: sem elas, o `SELECT` das rotas falha. ❓ Produção (PS-062).

| Migration | O que cria ou muda | Onde o código cita |
|---|---|---|
| `2026-11-18_comissao_grao_pedido` | CHECK de `regra_aplicada` com `PREJUIZO_PEDIDO` e `FABRICACAO_BLOQUEADA`; `venda_revenda`, `venda_fabricacao`, `pct_venda_fabricacao` (do pedido) na `vw_comissao_master` | `api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:69` (`const REGRAS = [`); `vw_comissao_master.model.js:90` (`pct_venda_fabricacao:`) |
| `2026-11-18_comissao_competencia` | `desbloqueado_em`, `mes_competencia`, `vale_na_competencia` na master e na `vw_comissao_nf`; tabela `calendario_comissao` (dia de fechamento por unidade, padrão 10); função `fn_comissao_nfs_deslocadas` | `src/schemas/core_comissionamento/competencia.js:7` (`Competência = o mês em que a comissão`) |
| `2026-11-19_comissao_escopo_fabricacao` | O peso da fabricação também na `vw_comissao_nf` | `vw_comissao_nf.model.js:71` (`pct_venda_fabricacao:`) |
| `2026-11-19_comissao_master_itens_desempenho` | `margem_item_vendedor`, `margem_item_compras`, `tipo_item`, `descricao` na master e na `vw_simulacao_resolvida` | `vw_comissao_master.model.js:109` (`margem_item_vendedor:`) |
| `2026-11-19_comissao_trava_versao_vendedor` | Trigger `trg_simulacoes_trava_versao_vendedor`: versão nova do vendedor só depois de `DEVOLVIDO`; erro 23514 `VERSAO_VENDEDOR_FECHADA` (409 na API) | `src/schemas/core_comissionamento/tables/simulacoes/simulacoes.route.js:175` (`const versaoFechada`) |
| `2026-11-23_comissao_pre_aceita_devolvido` | View `vw_simulacao_pre_aceita` (versão de menor comissão do pedido; empate, Compras); `origem_pre_aceita`, `id_simulacao_pre_aceita`, `valor_comissao_sem_bloqueio`; situação `DEVOLVIDO`; no resumo, `qtd_devolvido`, `valor_comissao_pre_aceito` e `valor_comissao_bloqueado` deixa de ser sempre 0 | `vw_simulacao_resolvida.model.js:136` (`origem_pre_aceita:`); `vw_comissao_master.model.js:123` (`valor_comissao_sem_bloqueio:`); `vw_comissao_resumo_mensal.model.js:45` (`valor_comissao_pre_aceito:`) |

No tst de 23/11 também está `simulador_parametros.pct_predominancia_fabricacao` (`dump tst 23/11:21794`), que antes só aparecia no model: (padrão 50; `api-acos-vital` `src/schemas/core_comissionamento/tables/simulador_parametros/simulador_parametros.model.js:112` (`pct_predominancia_fabricacao:`)), lido pelo motor do front. ❓ A coluna no banco não aparece nos dumps lidos. Não há tela para mudar o corte (PS-063).

**Filtros novos nas rotas** (todos na `develop`):

- `competencia=AAAA-MM` em `/comissoes_nf`, `/comissoes_master` e `/comissoes_resumo_mensal` (este também `AAAA`); exclusivo com `mes`, `ano`, `data_inicio`, `data_fim` e `is_track_record`, porque a perna de cada nota é escolhida por `vale_na_competencia` (`competencia.js:41` (`export function lerCompetencia`)).
- `meus=true` nas mesmas três e em `/simulacao_resolvida`: recorta pelo vínculo **próprio** do token (`auth.fn_vendedores_do_usuario`, `origem = 'proprio'`); sem vínculo próprio, resposta vazia em vez de 403; quem entra só por Minhas Comissões tem o recorte sempre (`src/schemas/core_comissionamento/recorte.js:9` (`export const SQL_VINCULOS_PROPRIOS`), `:65` (`export async function lerRecorteVendedor`); `src/middlewares/escopoVendedor.js:121` (`simulacao_resolvida:`)).
- `com_fabricacao`, `misto` e `pct_venda_fabricacao_min`/`_max` em `/comissoes_nf` e `/comissoes_master` (`recorte.js:132` (`export function lerFiltroFabricacao`)).
- `POST /simulacoes` com item inválido (regra fora da lista) dá 400 em vez de 500 (`simulacoes.route.js:151` (`const itemInvalido`)).

## Mapa do schema

```mermaid
erDiagram
    simulador_parametros ||--o{ simulacoes : "id_parametros"
    simulacoes ||--o{ simulacao_itens : "id_simulacao (cascade)"
    simulacoes ||--o| simulacoes : "id_simulacao_contestada"
    regras_comissoes_fixas }o--|| simulacoes : "cliente (sem FK)"
    bloqueio_comissoes }o--|| simulacoes : "NF (sem FK)"
    comissao_coordenadores ||--o{ comissao_coordenadores_historico : "trigger"
```

Convenção do schema atual: `codigo_empresa uuid` = unidade (`core.unidades`); percentuais em **pontos percentuais** (2 = 2%).

## Tabelas

### 1. `simulador_parametros` (`dump:909-952`)

Parâmetros do motor por unidade e vigência. ✅ Uma simulação grava `id_parametros` e fica amarrada a ela.

| Coluna | Tipo | Nulo | Para que serve |
|---|---|---|---|
| `id` | uuid (uuidv7) | não | PK |
| `codigo_empresa` | uuid | não | Unidade (FK `core.unidades`) |
| `vigencia_inicio`, `vigencia_fim` | date | não / sim | Vigência; `fim` nulo = aberta |
| `descricao` | varchar(60) | não | Rótulo ("Maio/23") |
| `margem_desejada` | numeric(10,4) | não | Margem alvo do preço sugerido |
| `pct_despesas_operacionais` | numeric(10,6) | não | Soma das 9 despesas |
| `detalhe_despesas` | **jsonb** | não | Detalhe por categoria (só auditoria) |
| `pct_rateio_logistica` | numeric(10,6) | não | Rateio de frete de compra |
| `pct_comissao_provisao` | numeric(10,4) | não | Provisão de comissão dentro do mark-up |
| `pct_pis`, `pct_cofins`, `pct_irpj_base`, `pct_irpj`, `pct_csll_base`, `pct_csll`, `pct_adicional_ir` | numeric(10,4) | não | Impostos sobre a venda |
| `icms_saida` | **jsonb** (objeto) | não | Destino → alíquota |
| `icms_entrada` | **jsonb** (objeto) | não | Origem da compra → alíquota |
| `encargos_pagamento` | **jsonb** (objeto) | não | Condição de pagamento → encargo |
| `faixas_comissao` | **jsonb** (array) | não | `[{letra, margem_min, pct}]` |
| `pct_fabricacao_interna` | numeric(10,4) | não | % fixo da fabricação |
| `created_*`, `updated_*`, `deleted_*` | timestamptz/uuid | | Auditoria e soft delete |

**Chaves e regras:** PK `id`; UNIQUE parcial uma vigência aberta por unidade (`uq_simulador_parametros_vigente`, `dump:1855`); EXCLUDE sem sobreposição por unidade (`dump:1701`); CHECKs 0..100 em todos os percentuais e `jsonb_typeof` dos 4 JSON (`dump:938-951`).

**Problemas e melhorias**
- **JSON com regra de negócio** (`icms_saida`, `icms_entrada`, `encargos_pagamento`, `faixas_comissao`): sem chave estrangeira, sem unicidade, sem tipo por valor. As chaves são **texto livre** ("SÃO PAULO - Base de ICMS Reduzida") e o motor casa ignorando caixa mas **não** acento (`motor.ts:79-94`). → tabelas filhas com código (`parametros_icms_saida`, `parametros_icms_entrada`, `parametros_encargos_pagamento`, `parametros_faixas`).
- `detalhe_despesas` soma 11,451733 e o agregado guarda 11,451734 (`dump:1660`): duas verdades. → `parametros_despesas` filha; agregado explícito e tolerância documentada.
- Nomes: prefixo `pct_` no início, mistura de `margem_desejada` (sem `pct`). → sufixo `_pct` em todos.
- Sem trava no banco para "parâmetro já usado não muda"; só um comentário (`dump:961-965`). → trigger.
- Sem auditoria de quem mudou (só `updated_by`). → tabela `auditoria`.
- Uma linha por unidade com valores iguais (3 cópias). Mantido por unidade (cada unidade pode divergir), mas a Controladoria deve confirmar (M02 em [[01-Motor-Atual-Como-Calcula]]).

### 2. `simulacoes` (`dump:780-835`)

Uma linha por **versão** de simulação de um pedido (substitui planilhas .xlsx). ✅ Versão enviada é imutável.

| Grupo | Colunas | Observação |
|---|---|---|
| Identidade | `id`, `codigo_empresa`, `numero_pedido` varchar(15), `sequencial` numeric(4,0), `codigo_pedido_omie` bigint, `origem` (`VENDEDOR`/`COMPRAS`), `versao`, `id_simulacao_contestada`, `status` | `sequencial` sempre nulo na prática; `codigo_pedido_omie` só informativo |
| Contexto | `codigo_vendedor_omie`, `codigo_cliente`, `data_pedido`, `estado_destino`, `condicao_pagamento`, `isento_imposto` | Texto livre em `estado_destino` e `condicao_pagamento` |
| Frete e venda | `frete_compra_tipo` (`RATEIO`/`VALOR`), `frete_compra_valor`, `valor_st_venda`, `imposto_retido_difal`, `frete_venda` | |
| Parâmetros | `id_parametros` (FK, obrigatório) | |
| Resultado | `custo_total`, `venda_sugerida`, `total_nf`, `valor_liquido`, `markup_projetado`, `markup_real`, `markup_bruto`, `pct_opex`, `lucro`, `margem_liquida`, `letra_equivalente`, `pct_comissao_efetivo`, `valor_comissao_total`, `qtd_itens`, `qtd_itens_prejuizo` | Todos **nulos permitidos**: o resultado do motor chega depois do cabeçalho |
| Texto | `observacao`, `motivo_devolucao`, `submitted_at` | |
| Auditoria | `created_*`, `updated_*`, `deleted_*` | |

**Chaves e regras:** PK `id`; UNIQUE parcial `uq_simulacoes_versao` (empresa, pedido, `COALESCE(sequencial,-1)`, origem, versão) e `uq_simulacoes_rascunho` (um rascunho por pedido e origem) (`dump:1841, 1848`); CHECKs de status, origem, `COMPRAS` exige `id_simulacao_contestada`, `DEVOLVIDO` exige motivo, enviado exige `submitted_at` (`dump:826-834`); FKs para unidade, parâmetros e a própria tabela. Índices `ix_simulacoes_fila`, `_pedido`, `_vendedor` (`dump:1792-1806`).

**Problemas e melhorias**
- **Dois conceitos numa tabela:** a simulação do vendedor (preço e custo digitados) e a de Compras (custo corrigido). No módulo novo são **dois cálculos** do mesmo dossiê (`COTADO` e `REAL`), e o de custo real vem do evento, não de digitação.
- Amarrada ao **número do pedido do Omie**; o módulo novo amarra ao **id da proposta** (N16-02, N16-04) e ao id do pedido do hub.
- `sequencial` nulo + `COALESCE(-1)` em dois UNIQUE e em joins: frágil (ponto 5 de [[01-Motor-Atual-Como-Calcula]]). → sem sequencial; uma proposta = um pedido.
- `status` varchar com 5 valores; `DEVOLVIDO` é terminal e "legado" na tela (`av-hub` `lib/domain/comissoes-simulador-tela.ts:37` (`Devolvido (legado)`)). → máquina de estados explícita ([[04-Regras-e-Estados-da-Comissao-Nova]]).
- Resultado todo anulável e sem unidade de medida explícita (`qtd` double). → colunas `NOT NULL` no cálculo gravado; só entra linha de cálculo completa.
- Sem histórico de recálculo: cada mudança de custo exige digitar nova versão. → cada recálculo automático é uma linha nova e imutável.
- Sem coluna da versão do motor: não se sabe com que código o número saiu. → `versao_motor`.

### 3. `simulacao_itens` (`dump:672-706`)

Itens de uma simulação. Desde 18/11 cada item grava a **letra do pedido** (ou o fixo da fabricação) e a margem própria só como informação (N16-185).

| Grupo | Colunas |
|---|---|
| Identidade | `id`, `id_simulacao` (FK, cascade), `ordem`, `codigo_item_omie` bigint, `codigo_produto_omie`, `codigo_produto`, `descricao` |
| Venda | `qtd` **double precision**, `unidade`, `tipo_item` (`REVENDA`/`FABRICACAO_INTERNA`), `preco_unit_venda` |
| Compra | `qtd_compra` **double**, `unidade_compra`, `preco_unit_compra`, `fornecedor` varchar(120), `origem_compra` varchar(50), `pct_ipi`, `valor_st`, `frete_compra_valor` |
| Resultado | `custo_liquido`, `preco_unit_sugerido`, `icms_efetivo`, `pct_impostos`, `margem_item`, `letra_item`, `pct_comissao`, `regra_aplicada` |

**Chaves:** PK `id`; UNIQUE `(id_simulacao, ordem)` e parcial `(id_simulacao, codigo_item_omie)` (`dump:1827-1834`).

**Problemas e melhorias**
- `qtd` e `qtd_compra` em **double precision**: erro de ponto flutuante em quantidade. → `numeric(15,4)`.
- `origem_compra` em **texto livre** (casa com o JSON de parâmetros). → código controlado (`SP`, `SP_REDUZIDA`, `OUTRA_UF`, `IMPORTACAO_SP`, `IMPORTACAO_OUTRA_UF`, `SIMPLES`), igual ao `OrigemIcmsCompra` do Comercial.
- Não guarda as **contas intermediárias** (compra bruta, ICMS recuperável, IPI em valor, frete, lucro): quem audita precisa refazer (`dump:715-718`). → todas gravadas.
- Não guarda o **teto** da regra fixa nem o percentual da letra antes do teto (a view recalcula). → `comissao_letra_pct`, `teto_regra_pct`, `comissao_pct`.
- Não guarda **de onde veio o custo** ("a fonte some ao recarregar", `av-hub` `lib/domain/comissoes-simulador-tela.ts:53-60` (`a fonte some`)). → novo modelo guarda custo cotado, custo real e cobertura.
- Sem `id_item_proposta`/`id_item_pedido`: amarra pelo `codigo_item_omie`, que só existe depois de o pedido estar no Omie.

### 4. `regras_comissoes_fixas` (`dump:589-603`)

Teto por cliente e unidade.

| Coluna | Tipo | Obs. |
|---|---|---|
| `id` | uuid | PK |
| `codigo_empresa`, `codigo_cliente` | uuid, varchar(60) | Chave de negócio (UNIQUE parcial, `dump:1820`) |
| `comissao_padrao`, `comissao_condicional`, `margem` | numeric(10,2) | 0..100 |
| `created_at`, `updated_at`, `deleted_at` | timestamptz | Sem `created_by`/`updated_by`/`deleted_by` |

**Problemas e melhorias**
- `margem` é, na verdade, **gatilho de markup bruto** (`motor.ts:475`), e o nome convida a confundir com margem líquida. → `gatilho_markup_pct`.
- CHECK limita `margem` a 0..100, mas markup bruto passa de 100 (ex.: 115,24). → faixa 0..1000.
- **Sem vigência**: mudar a regra reescreve o passado. → `vigencia_inicio/fim` com EXCLUDE.
- **Sem autoria** (nenhum `*_by`) e sem histórico. → auditoria.
- Nada impede padrão maior que condicional (`dump:1417-1419`). → CHECK `condicional >= padrão` 🟡.
- Soft delete só pelo `deleted_at`; a API usa `paranoid` (`dump:640-643`).
- Dados: 5 linhas, uma apagada; `margem` = 100,00 em todas (`dump:1602-1606`).

### 5. `bloqueio_comissoes` (`dump:410-420`)

Bloqueio por NF.

| Coluna | Tipo | Obs. |
|---|---|---|
| `codigo_empresa` | uuid | PK composta |
| `numero_nf` | varchar(10) | PK composta; **com zeros à esquerda**; `CHECK` só dígitos |
| `is_blocked` | boolean | default false |
| `motivo` | varchar(255) | **opcional** |
| `created_*`, `updated_*` | | `created_by`/`updated_by` sem FK |

**Problemas e melhorias**
- Chave é o **número da NF com zeros**; sem os zeros nunca casa e nada avisa (`dump:447-450`). Sem FK para `notas_fiscais`. → o módulo novo usa `codigo_nf_omie` (PK real da NF, `Dump Avhub (Esqueleto).sql:22695`) e o bloqueio vira **decisão** da NF.
- **Motivo opcional**; quem bloqueou e quando só em `created_by`/`updated_at`, e a linha é reescrita ao desbloquear (histórico perdido). → decisão imutável, com justificativa obrigatória, valor antes e depois.
- A API tem `DELETE` físico ("só para lançamento por engano", `bloqueio_comissoes.route.js:144-158`): apaga a auditoria. → sem delete.
- Dados: 2 linhas, ambas `is_blocked = false` (`dump:1570-1571`).

### 6 e 7. `blacklist_comissoes_destinatario` e `blacklist_comissoes_vendedores` (`dump:333-342, 372-381`)

| Tabela | Chave | Colunas |
|---|---|---|
| `…_destinatario` | `(codigo_empresa, codigo_cliente varchar(60))` | `observacao`, `created_*`, `updated_*` |
| `…_vendedores` | `(codigo_empresa, codigo_vendedor_omie varchar(11))` | idem |

A presença da linha é o bloqueio. ✅

**Problemas e melhorias**
- **Duas tabelas iguais** com domínios de chave diferentes. → uma tabela `exclusoes` com `tipo` (`CLIENTE`/`VENDEDOR`).
- **Sem vigência**: vale sobre qualquer NF, inclusive de meses fechados. → vigência com EXCLUDE.
- **Sem motivo obrigatório** (`observacao` nula em todas as 9 linhas, `dump:1549-1563`). → `motivo NOT NULL`.
- A exclusão **some com a nota** da lista (`NOT EXISTS`, `dump:1305-1309`) em vez de aparecer marcada. → comissão excluída fica visível com valor zero e `motivo_zerado`.
- Sem `deleted_at`: remoção física. → `deleted_at/by` + auditoria.
- Domínio do `codigo_cliente` (varchar 60) difere de `core.parceiros.codigo_parceiro_omie` (varchar 15); exige `::text` (`dump:361-365`). Mantido, documentado.

### 8. `comissao_coordenadores` (`dump:475-498`)

| Coluna | Tipo | Obs. |
|---|---|---|
| `id` | uuid | PK |
| `nome` | varchar(100) | **É a chave da vigência** (`lower(btrim(nome))`, `dump:1693`) |
| `id_funcionario` | uuid | opcional (FK `core.funcionarios`); nulo nas 6 linhas |
| `tipo` | varchar(10) | `gerencia` / `excecao` |
| `ajuda_custo` | numeric(14,2) | ≥ 0 |
| `percentual_comissao` | numeric(7,4) | pontos percentuais |
| `ordem_desempate` | smallint | substitui "casas decimais" do JSON |
| `vigencia_inicio`, `vigencia_fim` | date | EXCLUDE sem sobreposição por nome |
| `observacao`, `origem` | text, varchar(30) | `origem` = `manual`/`carga_json_2026_10` |
| `created_*`, `updated_*`, `deleted_*` | | soft delete |

**Problemas e melhorias**
- **Nome como chave**: dois cadastros com grafia diferente viram duas pessoas. → tabela `coordenadores` (pessoa, FK opcional a `core.funcionarios`) + `coordenadores_regras` (valores por vigência).
- Mistura pessoa e regra numa linha. → separadas.
- **Sem API** (nenhum model nem rota), só a função de leitura; mudança é SQL (`core_comissionamento/index.js`). → rota no módulo novo, pela tela de parâmetros.
- Valores nominais (remuneração) numa tabela legível; a LOG-42 já alertou para o dado pessoal no repositório. Aqui não são copiados.
- Dados: 6 linhas, vigência desde 2000-01-01 (carga sem data real), `id_funcionario` nulo (`dump:1578-1583`).

### 9. `comissao_coordenadores_historico` (`dump:549-559`)

| Coluna | Tipo |
|---|---|
| `id` | bigint identity |
| `id_coordenador` | uuid (sem FK, de propósito: sobrevive a delete) |
| `operacao` | varchar(10) (`INSERT`/`UPDATE`/`DELETE`) |
| `dados_antes`, `dados_depois` | **jsonb** |
| `feito_por` | uuid |
| `feito_em` | timestamptz |
| `usuario_banco` | text (default `CURRENT_USER`) |

Gravada por trigger (`fn_comissao_coordenadores_historico`, `dump:35-54`) e **imutável** (`fn_…_imutavel`, `dump:70-76`; triggers `dump:1883, 1890`). ✅ Bom desenho; é o padrão a generalizar.

**Melhorias:** o histórico existe só para esta tabela (parâmetros, regras e blacklists não têm). → `core_comissao.auditoria` genérica, alimentada por **uma** função de trigger, nas 10 tabelas de configuração.
