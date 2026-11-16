---
tags: [dados, banco, av-hub, postgres]
criado: 2026-10-14
estado-em: 2026-11-16
status: vigente
dono: Gustavo (DBA)
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [Dump do Avhub para referência (29.10).sql (guardado em api-acos-vital/; esqueleto, gerado em 29/10/2026 14:54), Dump Avhub (Esqueleto).sql de 14/10/2026, api-acos-vital 0384e89, omie-elt-pipeline 0f739f0, v1 AV-Hub-API-Estado-Atual, Schema-Postgres-Multi-Dominio, PDF de Robert de 09/11/2026 (contrato LOG-56 v8 e adendo v4), Dump-AvHub-Teste-2026-11-09 (09/11/2026), Dump-AvHub-Teste-2026-11-10 (10/11/2026), PDF de Gustavo de 10/11/2026 (entrega N16-147 itens 1 e 2), Dump-AvHub-Teste-2026-11-12 (12/11/2026)]
---

# Banco do av-hub

> [!info] Dump mais novo: banco de teste, 13/11/2026
> O esqueleto do banco de **teste** de 16/11/2026 11:23 ([[Dump-AvHub-Teste-2026-11-16]]) é o mais novo: tem **151 tabelas, 55 views, 291 funções e 209 triggers**. Desde 13/11 entraram o "Da proposta à comissão" (simulação v1 que nasce rascunho e só vai a enviada com o pedido faturado, liberação automática do pedido da proposta, item do Omie ligado ao item da proposta, evento do PDF) e os campos "Desvios" e "Pintura/acabamento" do item da proposta. Ainda não tem a coluna `numero_pedido_omie` que a lista de propostas da `api-acos-vital` `2e333e3` lê (BL-101). O anterior, de 13/11, é o [[Dump-AvHub-Teste-2026-11-13]].
>
> O esqueleto do banco de **teste** de 12/11/2026 15:01 ([[Dump-AvHub-Teste-2026-11-12]]) tem **151 tabelas, 55 views, 283 funções e 204 triggers**. A tabela `core_comercial.unidades_emissoras` **saiu**: a empresa emissora agora é a própria unidade (`core.unidades` ganhou `sigla` e os campos do cabeçalho dos documentos, lidos pela `core.vw_unidades_cabecalho`), e `id_unidade_emissora` saiu de `propostas` e `pedidos_venda` (em `sequencias_proposta` virou `codigo_empresa`). Entraram o índice único do LOG-56 (`uq_pedidos_venda_omie`), o banco do LOG-57 (`core_comercial.divergencias_compra` e `_eventos`), do LOG-58 (`core_vendas_faturamento.avisos_mes_compra`) e do API-019 (`vw_pedido_venda_compra_proposta`), a carteira de clientes na proposta (`parametros_carteira_clientes`, `fn_carteira_clientes`) e o `encargo_pagamento` da proposta e da simulação. A regra do refaturamento não mudou. A tabela de schemas abaixo foi reconferida no dump de 13/11 para `core`, `core_vendas_faturamento` e `core_comercial`; as outras listas de tabelas são de dumps anteriores.
>
> Antes dele, o esqueleto do banco de **teste** de 10/11/2026 07:36 ([[Dump-AvHub-Teste-2026-11-10]]) tem **148 tabelas, 259 funções e 195 triggers**, com as mesmas 51 views. Entrou a primeira parte do LOG-56: a conta corrente do pedido com a conta padrão por unidade (`parametros_pedido_venda_omie`), as respostas da Qualidade e do faturamento em partes no pedido, os valores sugeridos na `vw_pedidos_liberacao` e a `fn_proposta_prontidao_omie`. O índice único do LOG-56 ainda não foi aplicado. A regra do refaturamento não mudou.
>
> Antes dele, o esqueleto do banco de **teste** de 09/11/2026 15:51 ([[Dump-AvHub-Teste-2026-11-09]]) tem **250 funções e 192 triggers**, com as mesmas 146 tabelas e 51 views. Entraram as três migrations do pedido do Hub de 05/11 e 06/11, que continuam fora do repositório (BL-024): o envio ao Omie (`fn_pedido_venda_envio_iniciar`, `_omie_registrar`, `_omie_erro` e `_payload_omie`), a `fn_proposta_transformar` de 4 argumentos e as colunas novas de `core_comercial.pedidos_venda`. Também entraram `auth.permissoes.pode_exportar` (LOG-48) e o setor da requisição de uso interno. O quadro abaixo, de 04/11, continua valendo para o resto.
>
> **Dump de 04/11/2026:**
> O Nathan enviou o esqueleto do banco de **teste** (`tst`) de 04/11/2026 23:58 (PostgreSQL 18.6), sem dados: [[Dump-AvHub-Teste-2026-11-04]]. Frente ao de 29/10 abaixo: **15 schemas, 146 tabelas, 51 views, 238 funções e 191 triggers**. Mudou só o `core_comercial` e entrou o schema `orcamento_pdf` (tabela `relatorio`):
> - `core_comercial` passa a ter **12 tabelas** (`propostas`, `propostas_itens`, `propostas_eventos`, `propostas_versoes`, `pedidos_venda`, `pedidos_venda_itens`, `parametros_custo`, `unidades_emissoras`, `perfis_comerciais`, `sequencias_documento`, `sequencias_proposta`, `chaves_idempotencia`), 2 views e 28 funções (entre elas `fn_proposta_aprovar`, `_cancelar`, `_revisar`, `_copiar`, `_transformar` e `fn_propostas_expirar`).
> - Saíram as 13 tabelas do módulo de teste do Pablo: `ofertas`, `solicitacoes_custo`, `clientes`, `clientes_contatos`, `fornecedores_perfil`, `fornecedores_categorias`, `categorias_suprimento`, `apelidos_fornecedor`, `certificados`, `notificacoes`, `produtos_pendentes`, `produtos_perfil` e `tabelas_custo_telha` (com a view `vw_fornecedores_por_cnpj`).
> - Sem mudança: `divergencias_compra` e o schema `core_comissao` continuam ausentes; o contador de documentos aceita só `ordem_compra` e `requisicao_compra`; a numeração da proposta continua `CO-<código><ano>-<seq>-R00`.
> O resto desta nota descreve o dump de 29/10, que continua valendo para os outros schemas. Comparação completa: [[Dump-AvHub-Teste-2026-11-04]].
>
> O arquivo do dump de 29/10 saiu da `develop` da `api-acos-vital` no commit `1654f65` (05/11/2026). Para relê-lo: `git show b97981c:"Dump do Avhub para referência (29.10).sql"` dentro de `api-acos-vital`. O esqueleto de 04/11 está no vault, em `04-Dados/Dumps/`.

PostgreSQL do av-hub, de responsabilidade do DBA (Gustavo). Usado pela `api-acos-vital` ([[AV-Hub-API]]) e pela pipeline Omie ([[Pipeline-Omie]], que escreve direto nas tabelas `core*` e `omie_*`). O dump de 29/10 é só esqueleto: **156 tabelas, 52 views, 222 funções, 199 triggers, 14 schemas**, sem nenhuma linha de dado ✅ `grep` do dump. O de 14/10 tinha 126 tabelas, 44 views, 178 funções, 125 triggers e 13 schemas; a diferença é o schema `core_comercial` (23 tabelas, 3 views, 12 funções, herdado da `api-comercial`, [[API-Comercial]]), `auth.chaves_servico_rotas` e `_uso`, e cinco tabelas novas em `core_vendas_faturamento`. Os números de linha (`:NNNN`) das tabelas abaixo são do dump de 14/10; no de 29/10 mudaram. Por que o av-hub tem vários schemas e o MES um só: [[Schemas-Postgres]]. Banco do MES: [[Banco-MES]]. Selos: [[Regras-do-Vault]].

## Schemas

| Schema | Tabelas | Views | Conteúdo | Dono do dado |
|---|---|---|---|---|
| `auth` | 17 | 3 | usuários, perfis, telas, permissões, mapa rota → tela, chaves de serviço, sessões, auditoria, favoritos ([[RBAC-e-Permissoes]]) | av-hub |
| `core` | 22 | 2 | cadastros: `unidades` (com `sigla` gerada e os campos do cabeçalho dos documentos `nome_documento`, `telefone_documento`, `email_documento`, `site_documento`, `logo_url`, lidos pela view `vw_unidades_cabecalho`; a API aceita os cinco no `PUT /unidades/{id}` ✅ `api-acos-vital` `src/schemas/core/tables/unidades/unidades.route.js:49` (`"nome_documento", "telefone_documento"`), mas o av-hub não tem tela para editá-los 🔴), `parceiros` (+endereço, dados bancários, tipos, produtos), `produtos`, `funcionarios`, `cargos`, `setores`, `familia_produtos`, `categorias`, `cnaes`, `projetos`, `contas_correntes`, `cotacoes_moeda`, `etapas_faturamento`, `locais_estoque`, `estoque_saldo`, `documentos_anexos`, `origem_dados` | Omie (pipeline) e cadastro |
| `core_vendas_faturamento` | 56 | 26 | pedidos de venda, NF, liberação, **requisições e ordens de compra**, follow-up, status e custo por item, comissão provisória, metas, blacklists, setor do cliente (`setores_clientes`, `clientes_setor`), observação do PCP por item (`pedido_item_observacao_pcp`, `pedido_marcacao_pcp`), referência da requisição para o MES (`requisicoes_compra_referencia_mes`) e da OC (`ordens_compra_referencia_mes`), avisos do MES ao Compras (`avisos_mes_compra`, LOG-58) | Omie + av-hub |
| `core_comercial` | 16 | 3 | **módulo Comercial** (dump de 13/11): `propostas` (+ `_itens`, `_eventos`, `_versoes`), `pedidos_venda` (+ `_itens`, `_conta_corrente_historico`), `divergencias_compra` (+ `_eventos`, LOG-57), `parametros_custo`, `parametros_pedido_venda_omie`, `parametros_carteira_clientes`, `perfis_comerciais`, `chaves_idempotencia`, `sequencias_documento`, `sequencias_proposta`; views `vw_propostas_lista`, `vw_divergencias_compra`, `vw_pedido_venda_compra_proposta`. As tabelas do teste do Pablo (`clientes`, `ofertas`, `solicitacoes_custo` etc.) saíram em 04/11 e `unidades_emissoras` em 12/11; funções `fn_*` (`fn_proposta_criar`, `_aprovar`, `_cancelar`, `_copiar`, `_revisar`, `_transformar`…). **Existe no banco real; a decisão N16-116 diz que `core_comercial` não existirá** (a proposta iria para `core_vendas_faturamento`) 📝, e o código de 28 e 29/10 ainda usa `core_comercial.*` ✅ | Pablo (origem) / Robert (rotas) / Gustavo (banco) |
| `core_fluxo` | 3 | 1 | **Torre de Fluxo**: `evento`, `feed_cursor`, `item_estado_projetado` | av-hub (projeção do MES) |
| `core_compras` | 7 | 11 | catálogo/histórico de preços e Orçamento (`orc_*`, `produtos_compras`) | av-hub |
| `core_comissionamento` | 9 | 4 | simulador, regras fixas, bloqueios, coordenadores | av-hub |
| `core_aprovacao_de_vagas` | 4 | 1 | vagas e decisões | av-hub |
| `core_organograma` | 7 | 2 | organograma e "welcome" | av-hub |
| `core_mapas` | 0 | 2 | `mapa_unidades`, `vw_todos_os_clientes` | view |
| `historico` | 3 | 0 | `hst_pedidos_vendas`, `hst_notas_fiscais`, `hst_produto_vendas` (histórico congelado) | pipeline |
| `omie_raw` | 5 | 0 | **obsoleto e vazio** (N14-27): staging bruto `"notasFiscais"`, `"pedidosVendas"`, `parceiros`, `produtos`, `vendedores`, de `sql/002_staging_tables.sql`, que só servia à auditoria opcional `RAW_AUDIT_ENABLED`, removida do código no contrato 38; nada lê nem escreve ([[Pipeline-Omie]]). `DROP` das tabelas e do schema: Gustavo (BL-054) | — |
| `omie_ctl` | 1 | 0 | `run_log` (execuções da pipeline) | pipeline |
| `core_estoque` | 0 | 0 | **vazio** (criado e sem objetos) 🟡 | — |

Contagem por `CREATE TABLE`/`CREATE VIEW` do dump de 29/10 ✅, reconferida no de 13/11 (mesmos números nos outros schemas; `orcamento_pdf` tem 1 tabela, `relatorio`). O estoque físico da fábrica **não** está no av-hub: `core.estoque_saldo` e `core.locais_estoque` são espelho do Omie (a extração `estoque` está desligada) e `core_estoque` não tem nada ✅ `omie-elt-pipeline/src/omie/resources/estoque.ts:16`; o saldo real é o do MES ([[Modelo-Estoque-e-Custo-do-Lote]]).

Convenções ✅: chave `uuid` com `DEFAULT uuidv7()`; colunas de auditoria (`created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) com `trg_*_updated_at` (`public.set_updated_at`); quantidades de requisição e OC em `numeric(15,4)`; dinheiro `numeric(15,2)`; empresa por `codigo_empresa uuid` (= `core.unidades.id`).

## Tabelas do fluxo de Atividades (`core_vendas_faturamento`)

### Liberação do pedido (V1 a V3, P1, P2)

| Tabela / view | Colunas e regras | Dump |
|---|---|---|
| `pedidos_vendas` | pedido do Omie, PK `(codigo_empresa, codigo_pedido_omie)`; `numero_pedido`, `sequencial`, `etapa`, `situacao`, `data_inclusao`, `data_previsao`, `codigo_cliente`, `codigo_vendedor_omie`, `valor_total_pedido`, `faturado`, `cancelado`, `devolvido`, `encerrado`, **`manual`** (protegida da pipeline) | `:2328` |
| **`pedidos_vendas_liberacao`** | PK `(codigo_empresa, numero_pedido)`; `acompanhamento_qualidade boolean NOT NULL`, `liberado_por`, `liberado_em`, `updated_by`, `updated_at`, **`importado_mes_em`**, **`importado_mes_referencia`** (60) | `:18285` |
| `pedidos_vendas_liberacao_historico` | `acao` em `liberado`, `alterado`, `importado_mes`; `valor_anterior`, `usuario`, `referencia` | dump |
| `parametros_vendas` | linha única (`id = 1`); **`data_inicio_liberacao`** (corte da caixa) | `:18031` |
| view `vw_pedidos_liberacao` | `status_liberacao` = `importado` (tem `importado_mes_em`), `liberado` (tem linha de liberação) ou `pendente`; só pedidos com `sequencial = 0`, `etapa <> 0`, sem `deleted_at`, `data_inclusao >= data_inicio_liberacao` e (liberado **ou** `situacao = 'Pendente'`); construída sobre a `vw_vendas_planilha`, com `grupo IS NULL` (o G6 fica fora, ver abaixo) | dump; teste 04/11 `:25460`, filtro `:25492` |

**O grupo G6 (refaturamento) tem duas redações diferentes no mesmo banco** ✅ (dump de teste de 04/11, [[Dump-AvHub-Teste-2026-11-04]]):

- **`vw_vendas_planilha`** (CREATE na linha 25250; base da `vw_pedidos_liberacao` e, por ela, da tela Liberar Pedidos). Linha 25386: `obs_venda ~* 'refat|reaft'` **ou** `codigo_categoria = '1.01.96'` dá G6. Linha 25390, a porta da família: `bool_or` da mesma condição sobre as parciais (`sequencial > 0`, sem `deleted_at`, `etapa <> 0`) leva o pedido-pai a G6. Não consulta a tabela `refaturamentos` para decidir, embora exponha `status_refaturamento` (linha 25363).
- **`vw_faturamento_planilha`** (CREATE na linha 17848; base da comissão). Linha 18042: `obs_venda ~* 'refat|reaft'` **e** (`status_refaturamento` nulo, `Proibido` ou `Sem Referência`) dá G6. Linha 18043: observação sem `refat` **e** categoria `'1.01.96'` dá G6.
- As duas não são equivalentes. Na Liberar Pedidos some todo pedido com `refat`/`reaft` na observação, em qualquer unidade, e todo pedido `1.01.96`; os refaturamentos de Uberaba (`1.01.99`) e da HRM (`1.01.98`) não caem em G6 pela categoria.
- Tabela `core_vendas_faturamento.refaturamentos` (linha 17487): chave `codigo_pedido_omie`, `status_refaturamento` em `Permitido`, `Proibido` ou `Sem Referência`, calculada (`computed_at`, `periodo`), por `codigo_empresa`. A N16-152 (b), de 09/11/2026, faz dela a fonte do refaturamento e tira a observação da porta do G6 ([[Registro-N16-150-a-N16-155]]); 🔴 sem código. Risco: [[Riscos]] (RS-022).

### Requisição de compra (P3, C0, C1)

| Tabela | Colunas e regras | Dump |
|---|---|---|
| **`requisicoes_compra`** | `numero_requisicao` (gerado pelo banco, único por unidade), `codigo_empresa`, `material` (60), `descricao`, **`quantidade numeric(15,4) > 0`**, `unidade_medida` (10), `prazo_necessidade date`, `acabado_sugerido`, `solicitante`, **`id_setor`** (só `uso_interno`; FK `core.setores`, mesma unidade, N16-147; migration api010b, teste), `status` (`aberta`, `em_cotacao`, `atendida`, `cancelada`), `id_ordem_compra`, **`id_origem uuid`** (id do item da requisição do MES), `numero_requisicao_mes`, `codigo_pedido_omie bigint`, `numero_pedido_venda`, `motivo_cancelamento`, `cancelada_por_origem` (`compras` ou `mes`). CHECK `atendida ⇔ id_ordem_compra IS NOT NULL` | `:18541` |
| **`requisicoes_compra_eventos`** | só inserção (`trg_req_eventos_imutavel`); `id_requisicao`, `id_origem`, `codigo_empresa`, `tipo` (14 valores), `ocorrido_em`, `registrado_em DEFAULT clock_timestamp()`, `status_requisicao`, `id_ordem_compra`, `dados jsonb`, `criado_por`; índice do cursor `(registrado_em, id)` | `:18680` |
| view `vw_requisicoes_compra_eventos` | acrescenta `autor` (usuário e funcionário) e `comprador` (migration 035b) | dump |
| `contadores_documento` | contador atômico por unidade e tipo (`requisicao`, `ordem_compra`) | `:16555` |

Tipos de marco: `requisicao_recebida`, `em_cotacao`, `oc_criada`, `oc_removida`, `oc_enviada_aprovacao`, `oc_aprovada`, `oc_no_omie`, `fornecedor_confirmou`, `previsao_alterada`, `despachada`, `ocorrencia`, `oc_cancelada`, `requisicao_cancelada`, `requisicao_reaberta` ✅ CHECK `requisicoes_compra_eventos_tipo_check`.

### Ordem de compra, aprovação e follow-up (C2 a C5)

| Tabela | Colunas e regras | Dump |
|---|---|---|
| **`ordens_compra`** | `numero_pedido` (`OC-` + contador), `codigo_empresa`, `id_requisicao`, `codigo_fornecedor`, `codigo_transportadora`, `tipo_frete` (CIF/FOB), `finalidade` (padrão `estoque`), `moeda` (padrão `BRL`), **`cotacao_moeda`**, `cotacao_data`, `cotacao_origem`, `valor_mercadorias`, `valor_descontos`, `valor_frete`, `valor_seguro`, `valor_total`, **`valor_total_brl`**, **`status`** (`rascunho`, `aguardando_aprovacao`, `aprovado`, `cancelado`), `aprovado_por`, `aprovado_em`, `cancelado_por`, `cancelado_em`, `motivo_reprovacao`, **`status_sincronizacao_omie`** (padrão `pendente`), `erro_sincronizacao_omie`, `codigo_pedido_omie`, `numero_pedido_omie`, `sincronizado_em`, `id_comprador`, `data_previsao_chegada`, `codigo_condicao_pagamento`, `quantidade_parcelas` | `:17257` |
| **`ordens_compra_itens`** | `ordem`, `codigo_produto`, `descricao_produto`, `quantidade numeric(15,4)`, `unidade_medida`, **`valor_unitario numeric(15,4)`**, `desconto` (%), `valor_desconto`, `valor_total_item`, **`tipo_material`** (`nao_acabado` padrão, ou acabado), `local_estoque`, `id_requisicao` | `:17737` |
| `ordens_compra_itens_vinculos` | item da OC → pedido de venda: `numero_pedido_venda`, `codigo_empresa_pv`, `quantidade`, `pv_conferido` | `:17804` |
| `ordens_compra_parcelas`, `ordens_compra_historico`, `ordens_compra_comprador_historico` | parcelas geradas pela condição, histórico de status, histórico de comprador | dump |
| **`ordens_compra_acompanhamento`** | 1 por OC: `confirmacao_status` (padrão `pendente`), `confirmado_em`, `confirmado_por`, `despachado_em`, `nf_fornecedor`, `transportadora` | `:17520` |
| `ordens_compra_contatos`, `ordens_compra_ocorrencias` | contatos (imutáveis) e ocorrências (`tipo`, `descricao`, `proposta_fornecedor`, `status` `aberta`, `decidido_por`, `decidido_em`) | `:17664`, `:17884` |
| **`ordens_compra_referencia_mes`** | `id_ordem_compra`, `alterado_em` (cursor da API-004); mantida por `fn_oc_referencia_mes_marcar` | `:17965` |
| **`requisicoes_compra_referencia_mes`** e view `vw_requisicoes_compra_referencia_mes` (API-009, migration api009) | requisição do Compras com pedido de venda, vista pelo PCP antes da OC; `alterado_em` por trigger; `visivel_ao_pcp` (cancelada, pedido retirado ou excluída = falso) | dump de 29/10 |
| view `vw_ordens_compra_referencia_mes` | OCs `aprovado` (e as canceladas que já foram aprovadas) com `situacao` `aprovada` ou `cancelada`, também `codigo_fornecedor`, `nome_fornecedor` e `cnpj_fornecedor` (api007b, 26/10), `itens` em jsonb (`id_item_oc`, `codigo_produto_omie`, `quantidade`, `tipo_material`, `local_estoque`, `id_requisicao`, `id_origem`, `numero_requisicao_mes`, `destino` por pedido de venda ou estoque, `valor_unitario`, `desconto_pct`, `valor_desconto`, `valor_total_item`), `moeda`, `cotacao_moeda`, `cotacao_data`, `cotacao_origem`, `valor_frete`, `valor_seguro` | dump |
| `parametros_compras` | por unidade: **`limite_aprovacao numeric(15,2) DEFAULT 30000.00`** | `:18001` |
| `compradores`, `condicoes_pagamento_compras` | espelho do Omie + vínculo comprador ↔ `core.funcionarios` | `:16375` |
| `pedidos_compras`, `pedidos_compras_itens`, `pedidos_compras_parcelas`, `pedidos_compras_etapas` | espelho dos pedidos de compra do Omie (não é a OC do av-hub) | dump |

Observações ✅: a **cotação da moeda é por OC** (`ordens_compra.cotacao_moeda`); o valor é por item. O 0b diz "valor, moeda e cotação por item": a cotação vale para a OC inteira.

### Status e custo por item (todos os nós, E3, R4)

| Tabela | Colunas e regras | Dump |
|---|---|---|
| `itens_pedido_status` | foto da parcial do MES: `codigo_empresa`, `id_item_parcial`, `pedido_venda`, `ordem_producao`, `codigo_produto_omie`, `codigo_produto`, **`etapa`** (11 valores, ver [[Estados-e-Status]]), `setor_codigo`, `setor_nome`, `setor_tipo`, `status`, `quantidade_na_etapa`, `atendido_pelo_estoque`, `ocorrido_em`, `mes_updated_at`, `mes_deleted_at`, `lido_em`; histórico (uma linha por foto) | `:16990` |
| `itens_pedido_status_cursor` | cursor por unidade | dump |
| view `vw_itens_pedido_status_atual` | etapa mais recente por item | dump |
| **`itens_pedido_custo`** | `quantidade`, `quantidade_com_custo`, `custo_total numeric(18,6)`, `custo_medio`, `completo`, `cotacao_a_conferir`, `lotes jsonb`, `id_mes`, `mes_alterado_em`; a chave era `(codigo_empresa, numero_pedido, item)` (047) no dump de 14/10; **no dump de 29/10 é `(codigo_empresa, numero_pedido, codigo_produto_omie)` (047b)** ✅ | `:16782` (dump de 14/10); 29/10: `:20600`, constraint `:27722` |
| `itens_pedido_custo_cursor` | cursor por unidade | dump |

### Torre de Fluxo (`core_fluxo`)

| Objeto | Regra | Dump |
|---|---|---|
| `item_estado_projetado` | estado atual por `(codigo_empresa, numero_pedido, codigo_item_omie)`: `id_item_mes`, `etapa_fluxo`, `estado_macro`, `setor_fluxo`, responsável (`id_responsavel_atual`, nome, setor, `fila_setor_fluxo`), `entrou_etapa_em`, `prazo_pedido`, `encerrado_em` e `encerramento` (`cancelado` ou `concluido`), `ultimo_seq`, `ultimo_evento_*`; escrita só por `fn_feed_aplicar` | `:2169` |
| `evento` | eventos do hub (Comercial e Compras), `seq bigint`, `origem = 'av-hub'`, ator, autorizador (diferente do ator), `passou_para_*`, `motivo`; só inserção; **nasce vazia, a instrumentação do hub é pergunta aberta** | `:15649` |
| `feed_cursor` | `fonte` (`mes`), `ultimo_seq` | dump |
| view `vw_item_estado_atual` e funções `fn_torre_setores`, `fn_torre_itens`, `fn_feed_aplicar` | leitura da Torre | dump |

## Funções e triggers que carregam a regra de compra

Lista, com a regra de aprovação por limite, em [[AV-Hub-API]]. Resumo dos objetos que o MES e o HUB dependem: `fn_requisicao_mes_aplicar` (`:8680`), `fn_req_evento` (`:8580`), `fn_requisicoes_compra_status` (`:8923`) e `_zz_eventos` (`:8961`), `fn_ordens_compra_nascer` (`:6619`), `_recalcular` (`:6750`), `_requisicao` (`:6810`), `_status` (`:6851`), `fn_oc_referencia_mes_marcar`, `fn_pedidos_vendas_liberacao_regras` (`:7751`), `fn_itens_pedido_*_gravar`, `core_fluxo.fn_feed_aplicar` (`:1914`), `auth.fn_autorizar` (`:357`).

## O que falta no banco para o fluxo (DBA)

| Falta | Para | Selo |
|---|---|---|
| Migration **047b** na base que gerou o dump | custo por item | ✅ aplicada (dump de 29/10) |
| Nada na aprovação: a trigger `fn_ordens_compra_recalcular` já aprova até o limite e deixa `aguardando_aprovacao` acima dele (N14-21 ✅); só endurecer depois, com Compras 🟡 | C2/C3 | ✅ |
| A referência da OC para o MES (`vw_ordens_compra_referencia_mes`) já traz `destino` por pedido de venda ou estoque, `finalidade` e o fornecedor, mas só das OCs `aprovado` e das canceladas que já foram aprovadas: OC `aguardando_aprovacao` não aparece. O MES já lê a referência (`develop`); conferir se isso basta para o **saldo futuro** do Estoque (N14-20) ou se o MES precisa também das OCs em aprovação e de uma consulta por produto e por pedido (BL-028) | C0 → MES | 🟡 |
| Instrumentar `core_fluxo.evento` com os marcos do hub (Comercial e Compras) | Torre | 🔴 |
| Linhas de `auth.rotas_telas` e `auth.telas` para `torre-fluxo`, `torre-fluxo-trilha`, `custo-itens` e para as 21 telas do módulo comercial | permissões | ❓ |
| Onde fica o módulo comercial: `core_comercial` (existe e o código usa) ou `core_vendas_faturamento` (N16-116). Se for mudar, é migração sobre as 23 tabelas existentes (N16-98) | Comercial | 🔴 decisão x código |
| Imposto por item da OC (N16-144): hoje `ordens_compra_itens` não tem imposto; o desenho vem do pedido (parte de compras) ou do Comprador, e o contrato só nasce quando o desenvolvimento começar | Compras / custo | 📝, 🔴 sem código |

Diferenças entre código e banco: [[Diferencas-Codigo-x-Banco]].
