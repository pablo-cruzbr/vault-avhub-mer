---
tags: [sistemas, av-hub, api-acos-vital, express, sequelize, compras, torre-de-fluxo, custo, parte]
criado: 2026-11-05
estado-em: 2026-11-23
status: vigente
dono: Gustavo (DBA)
parte-de: "[[AV-Hub-API]]"
develop-conferida: [api-acos-vital ce4f90f, av-hub 7f0f7e2, em 2026-11-23, só o resumo de Comissão e o pdf_gerado; api-acos-vital e522962, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13, reteste por cliques e Da proposta à comissão; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [api-acos-vital 0384e89 (develop, 29/10), Dump do Avhub para referência (29.10).sql (guardado em api-acos-vital/), Dump Avhub (Esqueleto).sql de 14/10, v1 AV-Hub-API-Estado-Atual, AV-Hub-RBAC, Integracao-AvHub-MES-Especificacao-F1]
---

# AV-Hub API (`api-acos-vital`): detalhe técnico (2/2)

**Em uma frase:** detalhe técnico da nota [[AV-Hub-API]] (parte 2 de 2): Funções e triggers que carregam a regra; Módulo comercial (`core_comercial`, `/comercial/*`) — contrato LOG-52, desde 28/10; Outros módulos (resumo; detalhe nos anexos); Variáveis de ambiente (conferidas); Defeitos conhecidos da API.

**Onde estamos:** ← [[AV-Hub-API]] (resumo e índice) · partes: [[AV-Hub-API-Detalhe-Tecnico-1]] · **AV-Hub-API-Detalhe-Tecnico-2**

## Funções e triggers que carregam a regra

| Objeto (schema `core_vendas_faturamento`) | Regra | Dump |
|---|---|---|
| `fn_requisicao_mes_aplicar(uuid, jsonb)` | cria, atualiza, cancela ou ignora a requisição do MES; lock advisory por `id_origem` | `:8680` |
| `fn_requisicoes_compra_numerar`, `_numero_fixo` | número gerado pelo banco por unidade (`contadores_documento`); o número do MES vai para `numero_requisicao_mes` | triggers `:26246`, `:26254` |
| `fn_requisicoes_compra_status`, `_cancelamento` | transições `aberta`/`em_cotacao`/`cancelada`; `atendida` só pela trigger da OC | `:8923`; trigger `:26238` |
| `fn_requisicoes_compra_zz_eventos` | marcos `requisicao_recebida`, `em_cotacao`, `requisicao_cancelada`, `requisicao_reaberta` | `:8961` |
| `fn_req_evento`, `fn_req_evento_ligar`, `fn_req_eventos_imutavel` | grava marco só se há `id_origem`; histórico só de inserção | dump |
| `fn_ordens_compra_{nascer,numerar,numero_fixo,recalcular,status,requisicao,comprador,condicao,parcelas,historico,finalidade_guardar,itens_valores,ao_apagar,zz_eventos}` | numeração `OC-`, aprovação por limite, parcelas, requisição atendida, marcos `oc_*` | triggers `:25949-26086` |
| `fn_oc_acompanhamento_*`, `fn_oc_contatos_*`, `fn_oc_ocorrencias_*`, `fn_oc_itens_zz_eventos` | follow-up do CCP e marcos `oc_aprovada`, `fornecedor_confirmou`, `previsao_alterada`, `despachada`, `ocorrencia` | dump |
| `fn_oc_referencia_mes_marcar` | mantém `ordens_compra_referencia_mes.alterado_em` (cursor da API-004) | triggers `:25877,25901,25909` |
| `fn_pedidos_vendas_liberacao_regras`, `_historico` | trava a marcação depois do `importado` e grava `pedidos_vendas_liberacao_historico` (`liberado`, `alterado`, `importado_mes`) | `:18285` |
| `fn_itens_pedido_status_gravar`, `_do_pedido` | grava página do `/itens/status` e lê por pedido | `:4657` |
| `fn_itens_pedido_custo_gravar`, `_do_pedido` | idem para o custo (versão 047b no dump de 29/10) | dump de 29/10 `:6290`, `:6317` |
| `core_fluxo.fn_feed_aplicar`, `fn_torre_setores`, `fn_torre_itens`, `fn_evento_imutavel` | projeção da Torre | `:1914` |
| `auth.fn_autorizar`, `fn_me_permissoes`, `fn_escopo_vendedores_usuario`, `fn_validar_chave_servico` | permissão por rota, `/me/permissoes`, escopo, chaves de serviço | `:357` |

## Módulo comercial (`core_comercial`, `/comercial/*`) — contrato LOG-52, desde 28/10

Rotas montadas em `core_comercial/index.js`, todas com `exigirTokenUsuario` (token do usuário sempre), `asyncHandler`, `Idempotency-Key` nas escritas e `If-Match`/ETag na revisão da proposta. O código foi feito a pedido do Robert (28 e 29/10; N16-117). A permissão de cada rota sai de `auth.rotas_telas`; as capacidades (`escopo`, `ve_valores`, `ve_custo`…) saem de `core_comercial/capacidades.js` ✅.

| Rota | Faz | Código |
|---|---|---|
| `GET /comercial/me` | capacidades do usuário no módulo | ✅ `aggregates/cadastros/cadastros.route.js:40` |
| `GET /comercial/empresas_emissoras`, `GET /comercial/responsaveis` | empresa que emite a proposta; quem pode emitir em nome de quem | ✅ `:66`, `:107` |
| `GET`/`PUT /comercial/parametros_custo` | parâmetros de custo, com vigência | ✅ `:144`, `:170` |
| `POST /comercial/clientes` | cadastra o cliente no Omie da unidade e grava em `core.parceiros` (upsert por CNPJ) | ✅ `aggregates/clientes/clientes.route.js:123` |
| `GET /comercial/parceiros?tipo=&empresa=` | cadastro de parceiros para a proposta | ✅ `aggregates/parceiros/parceiros.route.js:60` |
| `POST`/`GET /comercial/propostas`, `GET …/resumo`, `GET …/:id`, `GET …/:id/eventos` | cria (status `ABERTA`), lista, KPIs, abre, linha do tempo | ✅ `aggregates/propostas/propostas.route.js:383-548` (`router.post("/propostas"` a `"/propostas/:id/eventos"`) |
| `POST …/:id/eventos/pdf_gerado` (13/11) | o Hub avisa que gerou o PDF (`COMERCIAL` ou `TECNICA`): evento `PDF_GERADO` na linha do tempo; o mesmo usuário, tipo e revisão em menos de 10 min não grava de novo (200); `COMERCIAL` só para quem vê valores (senão 403). A função `fn_proposta_pdf_gerado` vem da migration `2026-11-13_comercial_proposta_pedido_comissao`, ainda não aplicada no teste | 🟡 `propostas.route.js:692` (`router.post("/propostas/:id/eventos/pdf_gerado"`) |
| `PUT …/:id`, `POST …/:id/aprovar`, `…/cancelar`, `…/copiar`, `…/transformar` | revisão na negociação, ciclo de vida até o pedido | ✅ `propostas.route.js:550-676` (`router.put("/propostas/:id"` a `"/propostas/:id/transformar"`) |

⚠️ O código e o dump de 29/10 ainda guardam proposta, itens e eventos em `core_comercial.*` (23 tabelas, herdadas da `api-comercial`), enquanto a decisão N16-116 manda a proposta para `core_vendas_faturamento` e diz que `core_comercial` não existirá. Ver [[Banco-AvHub]] e a dúvida registrada no relatório do dia.

Rotas do `core_vendas_faturamento` acrescentadas depois de 14/10 (resumo):

- Setor do cliente e do grupo (API-014): `GET/POST/PUT /setores_clientes`, `PUT /clientes_setor` (vários setores por cliente desde 23/10) ✅ `tables/setores_clientes`, `tables/clientes_setor`.
- Portal PCP (API-016/017): `GET /pedido_item_observacao_pcp`, `/contagem`, `POST`, `DELETE /:id`; carteira com período e previsão (`GET /pedidos_venda/carteira`, `/carteira/vendedores`, `/carteira/previsao`) ✅. `/pedido_observacao_pcp` (por parcial) continua montada, sem uso na tela.
- Duplicatas prováveis de produto (21/10) em `core/tables/produtos` e `utils/produtosDuplicatas.js` ✅.

## Outros módulos (resumo; detalhe nos anexos)

Vendas e faturamento (`/pedidos_venda`, `/vendas_*`, `/faturamento_*`, `/dashboard*`, `/ranking_*`, `/ritmo_*`, `/nf_classified`), Comissão (`core_comissionamento`; rotas, filtros e migrations de 18 a 23/11 em [[02-Tabelas-Atuais-core_comissionamento]]), Vagas (`core_aprovacao_de_vagas`), Organograma, Orçamento (`/orcamento/*` sobre `core_compras.orc_*`), cadastros `core.*` (parceiros, produtos, unidades, funcionários), Acompanhamento de Clientes e grupos de clientes (`/acompanhamento_clientes`, `/grupos_clientes`, contrato 48). Ficam em [[Comissoes]], [[Dashboards]], [[Orcamento]], [[RH-Vagas-Funcionarios]], [[Acompanhamento-Clientes]].

## Variáveis de ambiente (conferidas)

| Variável | Uso | Código |
|---|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_POOL_MAX`, `DB_STATEMENT_TIMEOUT_MS` | banco | ✅ `db.js:6-55` |
| `SESSION_SECRET`, `AZURE_AD_CLIENT_ID`, `_CLIENT_SECRET`, `_TENANT_ID`, `_REDIRECT_URI` | obrigatórias na subida | ✅ `utils/env.js:1-12` |
| `API_KEYS` | chaves de serviço do `.env` (valem como admin) | ✅ `apiKeyAuth.js:59` |
| `MES_INTEGRACAO_KEYS` | chaves do MES (≥ 32 caracteres), só para `PUT /compras/requisicoes/origem/:id` e `POST /integracao/mes/avisos-compra` (LOG-58) | ✅ `api-acos-vital` `src/middlewares/apiKeyAuth.js:93` (`process.env.MES_INTEGRACAO_KEYS`), `:110` (`ROTA_MES_AVISOS`) |
| `USUARIO_TOKEN_SEGREDO` (≥ 32), `USUARIO_TOKEN_TTL_SEGUNDOS` | token de usuário; sem o segredo a API não sobe | ✅ `utils/env.js:25-32`, `tokenUsuario.js:30-35` |
| `MES_API_URL`, `MES_API_KEY` | os 3 jobs que leem o MES; sem elas o job não sobe e avisa | ✅ `itens_pedido_status.job.js:204-205`, `utils/mesFluxo.js:21-22` |
| `MES_STATUS_INTERVALO_SEG`, `MES_STATUS_CORTE_INICIAL_DIAS` | só o job do status por item ainda lê regra em ambiente | ✅ `itens_pedido_status.job.js:34-37` |
| `CORS_ORIGINS`, `JSON_BODY_LIMIT`, `PORT`, `NODE_ENV` | HTTP | ✅ `app.js` |
| `IDENTIDADE_EXIGIR_TOKEN`, `AUTENTICACAO_AZURE_VALIDAR_ID_TOKEN`, `ESCOPO_UNIDADE_EXIGIR_SESSAO`, `FUNCIONARIOS_TELA_SLUG`, `VAGAS_TELA_SLUG`, `VENDAS_PLANILHA_PAGINAR_POR_PEDIDO`, `DOCS_API_KEY`, `AZURE_AD_ISSUER`, `AZURE_AD_JWKS_URI` | chaves remanescentes | ✅ `utils/acessoConfig.js`, demais arquivos |

Os jobs de Torre e custo seguem a regra do Nathan: nada de regra em ambiente, só endereço e segredo ✅ cabeçalhos `item_estado_projetado.job.js:41-46`, `itens_pedido_custo.job.js:36-44`.

## Defeitos conhecidos da API

Resumo; lista com severidade em [[Bugs-Conhecidos]].

- ✅ Corrigido em 16/10 (`38d2f74`): `alterado_desde` em `GET /produtos` e `GET /parceiros` agora roda antes do `return where` (`core/tables/produtos/produtos.route.js:51-70`, `core/tables/parceiros/parceiros.route.js:97-110`).
- 🔴 `pessoa_vendedor` tem model e rota (`/pessoa_vendedor`) e a tabela não existe nos dumps de 14/10 e de 29/10 (`schemas/core_vendas_faturamento/index.js` monta o router).
- ✅ A tabela `itens_pedido_custo` do dump de 29/10 já está na versão 047b.
- 🟡 Reteste no Docker de 13/11 (develop de 12/11): 7 GET com id de tipo errado respondem 500 (`invalid input syntax for type uuid`) em vez de 400: `GET /permissoes_usuario/menu/:id_usuario`, `/permissoes_usuario/:id_usuario/:id_perfil/:id_tela`, `/mapa_unidades/:id`, `/fechamento_manual/:ano/:mes/:tipo`, `/metas_mensais/:ano/:mes/:tipo`, `/metas_mensais/:ano/:mes` e `/pessoa_vendedor/:id`. A rota passa o parâmetro direto ao banco, sem validar o tipo, por exemplo `api-acos-vital` `src/schemas/core_mapas/views/mapa_unidades/mapa_unidades.route.js:33` (`router.get("/:id"`) e `src/schemas/core_vendas_faturamento/tables/metas_mensais/metas_mensais.route.js:64-65` (`getMeta`). As outras 81 rotas com parâmetro respondem 400 ou 404.
- 🟡 Reteste de 13/11: a API aceita texto com UTF-8 inválido e grava o caractere de substituição `U+FFFD`. Uma chamada feita fora de UTF-8 gravou a unidade `PÇ` como `P` mais o `U+FFFD` nas OC-000013 e OC-000016, e por isso o lote do MES nasceu sem custo (a unidade da OC não bateu com a do material, PS-059). Esperado: 400 para corpo com UTF-8 inválido.
- ❓ `usuarios_favoritos.model.js:13` declara `id` sem `defaultValue` (de propósito, o banco tem `DEFAULT uuidv7()`); o POST de favoritos já deu `400 "Campo obrigatório não informado: id"` em setembro; não reproduzido em 14/10 e não reconferido em 29/10.
