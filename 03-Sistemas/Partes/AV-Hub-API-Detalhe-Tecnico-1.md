---
tags: [sistemas, av-hub, api-acos-vital, express, sequelize, compras, torre-de-fluxo, custo, parte]
criado: 2026-11-05
estado-em: 2026-10-29
status: vigente
dono: Gustavo (DBA)
parte-de: "[[AV-Hub-API]]"
fontes: [api-acos-vital 0384e89 (develop, 29/10), Dump do Avhub para referência (29.10).sql (guardado em api-acos-vital/), Dump Avhub (Esqueleto).sql de 14/10, v1 AV-Hub-API-Estado-Atual, AV-Hub-RBAC, Integracao-AvHub-MES-Especificacao-F1]
---

# AV-Hub API (`api-acos-vital`): detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[AV-Hub-API]] (parte 1 de 2): Como a requisição é tratada (ordem do `app.js`); Organização do código; Rotas do fluxo de Atividades.

**Onde estamos:** ← [[AV-Hub-API]] (resumo e índice) · partes: **AV-Hub-API-Detalhe-Tecnico-1** · [[AV-Hub-API-Detalhe-Tecnico-2]]

## Como a requisição é tratada (ordem do `app.js`)

1. `helmet` (CSP fechada na API, aberta só nas páginas de docs), cache HTTP e CORS por lista (`CORS_ORIGINS`; o curinga `*` só vale fora de produção) ✅ `app.js:56-95`.
2. Sessão no Postgres (`auth.sessions`) só em `/auth`, `/docs`, `/api-docs-json`; limite de 20 logins/min por IP em `/auth/login` ✅ `app.js:107-130`.
3. `requestLogger`, `/docs` (`rotasDocs`), `ipFilter` (regras em `auth.ip_regras`), **`apiKeyAuth`** ✅ `app.js:135-147`.
4. Limite geral de 5 000 requisições por minuto **por chave de serviço**, contado depois da chave validada (LOG-51 S5) ✅ `app.js:155-165`.
5. `express.json` só **depois** da chave (limite `JSON_BODY_LIMIT`, padrão 10 mb; corpo acima de 1 MB vai para o log) ✅ `app.js:171-181`.
6. `registrarAuditoria`, **`identidadeUsuario`** (valida o token do usuário e chama `auth.fn_autorizar`), **`aplicarEscopoVendedor`** ✅ `app.js:187-189`.
7. Routers de todos os schemas na ordem de `schemas/index.js` ✅ `app.js:204-206`. As rotas de `/comercial` e `/suprimentos` passam ainda por `exigirTokenUsuario` (sem Bearer válido, 401 `TOKEN_USUARIO_AUSENTE`, mesmo com `x-api-key` válida) ✅ `core_comercial/index.js`.
8. Na subida a API **não cria** schema nem tabela (roda sem DDL, LOG-51 S8): só confere que os schemas `auth`, `core`, `core_aprovacao_de_vagas`, `core_mapas`, `core_organograma` e `core_vendas_faturamento` existem e inicia **3 jobs** do MES (status, Torre, custo) mais a limpeza das chaves de idempotência ✅ `app.js:236-264`.

Autenticação e permissão em detalhe: [[RBAC-e-Permissoes]] e [[Chaves-e-Autenticacao]].

## Organização do código

`src/schemas/<schema>/{tables,views,aggregates,functions}/<entidade>/<entidade>.{model,route}.js` + `.swagger.json`; `src/schemas/<schema>/index.js` registra models e a lista `rotas` (caminho, router, middlewares); `src/schemas/index.js` junta tudo ✅. Schemas com rotas: `auth`, `core`, `core_aprovacao_de_vagas`, `core_mapas`, `core_organograma`, `core_comissionamento`, `core_compras`, `core_fluxo`, `core_vendas_faturamento` e, desde 28/10, `core_comercial` (rotas `/comercial/*`, sem model Sequelize: SQL direto e funções `fn_*` do banco; ver "Módulo comercial" abaixo). `core_fluxo` não tem model Sequelize: usa SQL direto sobre funções do banco ✅ `core_fluxo/index.js:1-6`.

## Rotas do fluxo de Atividades

### Liberação do pedido (LOG-26) — V1 a V3, P1, P2

Os números de linha desta seção são de 14/10 (`f322dcd`); só os da requisição de compra foram refeitos em 29/10. Nos demais arquivos podem ter deslocado poucas linhas.

| Rota | Quem chama | O que faz | Código |
|---|---|---|---|
| `GET /pedidos_liberacao` | HUB | caixa do vendedor (escopo de vendedor do token) | ✅ `aggregates/pedidos_liberacao/pedidos_liberacao.route.js:88` |
| `PUT /pedidos_liberacao/:codigo_empresa/:numero_pedido` corpo `{acompanhamento_qualidade, updated_by}` | HUB | upsert da marcação; 404 `PEDIDO_FORA_DA_LIBERACAO`; 409 `PEDIDO_IMPORTADO_MES` | ✅ `:164-233` |
| `GET /pedidos_liberados` | MES | só `liberado` e `importado` | ✅ `aggregates/pedidos_liberados/pedidos_liberados.route.js:57` |
| `GET /pedidos_liberados/:numero/itens?codigo_empresa=` | MES | itens; 409 `PEDIDO_NAO_LIBERADO` | ✅ `:115`, `:53-56` |
| `POST /pedidos_liberados/:numero/importado?codigo_empresa=` corpo `{referencia}` (até 60 caracteres) | MES | grava `importado_mes_em` e a referência (idempotente) | ✅ `:143-170` |

Trava no banco: `trg_pedidos_vendas_liberacao_regras` e `_historico` (função no dump `:7751`; tabela `:18285`). A caixa só mostra pedidos a partir de `parametros_vendas.data_inicio_liberacao` ✅ tabela no dump `:18031`; no banco de teste o valor é `2026-09-01` 📝 (Nathan, 09/11/2026); em produção será definido ao publicar a Liberação, que ainda não está lá (BL-025).

### Requisição de compra (LOG-34, LOG-35) — P3, C0, C1

| Rota | Quem chama | O que faz | Código |
|---|---|---|---|
| `GET /compras/requisicoes` (`status`, `codigo_empresa`, `q`, `page`, `limit` até 200) | HUB | lista; fila ordenada por prazo | ✅ `tables/requisicoes_compra/requisicoes_compra.route.js:236` |
| `GET /compras/requisicoes/resumo` | HUB | contadores `abertas`, `em_cotacao`, `atendidas`, `canceladas` | ✅ `:292` |
| `PUT /compras/requisicoes/origem/:id_origem` | **MES** (chave `MES_INTEGRACAO_KEYS`, a única rota que ela abre) | `fn_requisicao_mes_aplicar`: `criada` (201), `atualizada`, `cancelada`, `ignorada_com_oc`, `ignorada_cancelada`, `nao_existe`; 409 `REQUISICAO_COM_OC` ao cancelar com OC | ✅ `:314`; `middlewares/apiKeyAuth.js:59-76` |
| `GET /compras/requisicoes/eventos?alterado_desde=&apos_id=&codigo_empresa=&limit=` (até 500) | **MES** (chave `API_KEYS`) | marcos com `autor` e `comprador` (view `vw_requisicoes_compra_eventos`, migration 035b; sem a view devolve `null`); cursor `(registrado_em, id)` | ✅ `:382` |
| `GET /compras/requisicoes/referencia?alterado_desde=&codigo_empresa=&apos_id=&page=&limit=` | **MES** (chave de serviço, sem token) | API-009: requisição do Compras com pedido de venda, para o PCP saber que o item já está em compra antes da OC aprovada; `visivel_ao_pcp = false` manda o MES apagar a linha; montada **antes** de `/compras/requisicoes/:id` | ✅ `views/vw_requisicoes_compra_referencia_mes/…route.js:59`; `core_vendas_faturamento/index.js:208` |
| `GET /compras/requisicoes/:id` | HUB | detalhe | ✅ `:466` |
| `POST /compras/requisicoes` | HUB (permissão `compras.pode_criar` no BFF) | cria requisição própria do Compras (sem `id_origem`); `status` e `id_ordem_compra` nunca vêm do cliente | ✅ `:479` |
| `PATCH /compras/requisicoes/:id` corpo `{status, motivo?}` | HUB | `aberta` ↔ `em_cotacao` ↔ `cancelada` (cancelar exige `motivo` de 3 a 500 caracteres e grava `cancelada_por_origem = 'compras'`); `atendida` nunca por aqui | ✅ `:586` |
| `DELETE /compras/requisicoes/:id` (contrato 55, 23/10) | HUB | exclusão lógica (`deleted_at`, `deleted_by`) de requisição do Compras; 409 `REQUISICAO_COM_OC` (já tem OC) e 409 `REQUISICAO_DO_MES` (veio do MES); 403 `SEM_PERMISSAO_EXCLUIR`; não gera marco | ✅ `:696-760` |

Estados da requisição no av-hub: `aberta`, `em_cotacao`, `atendida`, `cancelada` (CHECK `ck_requisicoes_compra_status`, dump `:18541`). `atendida` só pela trigger da OC (`trg_ordens_compra_requisicao`: OC que nasce com `id_requisicao` marca atendida; OC cancelada devolve todas as requisições a `aberta`) ✅ dump `fn_ordens_compra_requisicao` (dump `:6810`). O banco impõe `atendida ⇔ id_ordem_compra IS NOT NULL` (`ck_requisicoes_compra_atendida`).

**Marcos (14 tipos)** gravados por trigger em `requisicoes_compra_eventos`, só quando a requisição tem `id_origem`, ou seja, veio do MES ✅ `fn_req_evento` (dump `:8580`): `requisicao_recebida`, `em_cotacao`, `oc_criada`, `oc_removida`, `oc_enviada_aprovacao`, `oc_aprovada`, `oc_no_omie`, `fornecedor_confirmou`, `previsao_alterada`, `despachada`, `ocorrencia`, `oc_cancelada`, `requisicao_cancelada`, `requisicao_reaberta` (CHECK `requisicoes_compra_eventos_tipo_check`). Requisição criada pelo Compras não gera marco e não chega ao MES por esse caminho. O MES a enxerga pela referência da requisição (API-009, acima) e, depois da aprovação, pela referência da OC ✅.

### Ordem de compra e aprovação — C2 a C4

| Rota | Faz | Código |
|---|---|---|
| `GET /compras/ordens` (+ `/resumo`, `/dashboard`) | histórico unificado: OCs do av-hub e pedidos de compra só do Omie (somente leitura) | ✅ `tables/ordens_compra/ordens_compra.route.js:607,720,810` |
| `GET /compras/ordens/:id` | detalhe; 404 com `origem: "omie"` para pedido só do Omie | ✅ `:893` |
| `POST /compras/ordens` | emite a OC; só comprador vinculado na unidade (400); PV digitado precisa existir no Omie (`EXIGIR_PV_EXISTENTE`); item precisa ser produto do cadastro da unidade | ✅ `:923`, regras fixas `:35-56` |
| `PATCH /compras/ordens/:id` corpo `{status: aprovado|cancelado, aprovado_por, updated_by, motivo_reprovacao}` | decide; exige `compras.pode_aprovar` do usuário (403) | ✅ `:1177-1265`, `EXIGIR_PODE_APROVAR = true` (`:38-42`) |
| `PATCH /compras/ordens/:id/sincronizacao` | retorno do Omie (`nCodPed`, erro) | ✅ `:1267` |
| `POST /compras/ordens/:id/reenviar` | volta a OC à fila do Omie; exige `compras.pode_editar` | ✅ `:1321`, `usuarioTemPermissao(..., "pode_editar")` `:1343` |
| `GET /compras/ordens/fila-omie` | fila para a pipeline (`aprovado` pendente = enviar; `cancelado` com `codigo_pedido_omie` = excluir) | ✅ `:857-891` |
| `GET /compras/acompanhamento`; `GET/PUT /compras/ordens/:id/acompanhamento`; `POST …/contatos`, `…/ocorrencias`; `PATCH /compras/ocorrencias/:id` | follow-up do CCP (LOG-32): `followup.pode_visualizar` lê, `pode_editar` grava, `pode_aprovar` decide ocorrência | ✅ `tables/ordens_compra_acompanhamento/…route.js:298-586`, `:154` |
| `GET /compras/compradores`, `/:id/sugestoes`, `/:id`; `PUT /compras/compradores/:id` | vínculo comprador × funcionário (`compradores.pode_editar`) | ✅ `tables/compradores/compradores.route.js:76-210` |
| `GET /compras/pedidos-venda/:numero` e `/:numero/compras` | itens do PV com saldo a comprar | ✅ `views/vw_pedido_venda_compras/…route.js:52,92` |
| `GET /compras/condicoes-pagamento`, `/compras/parametros` | catálogos e `limite_aprovacao` | ✅ `tables/condicoes_pagamento_compras/…route.js:19,24` |
| `GET /compras/fornecedores`, `/compras/transportadoras` | projeções de `core.parceiros` | ✅ `core/aggregates/compras_parceiros/…route.js:84-85` |
| `GET /ordens-compra/referencia?alterado_desde=&codigo_empresa=&page=&limit=` | referência da OC para o MES (API-004/007), limite 100 padrão e 500 máximo; item com `destino[]` (`pedido_venda` ou `estoque`) e OC com `finalidade`; desde 26/10 traz o fornecedor (`codigo_fornecedor`, `nome_fornecedor`, `cnpj_fornecedor`, api007b, `a7fda49`). **O MES consome** a cada 5 min (desde 15/10, `develop` do MES) | ✅ `views/vw_ordens_compra_referencia_mes/…route.js:70`, `:38-39` |

**Regra de aprovação conferida no banco** (a que de fato roda):

- `fn_ordens_compra_nascer` (BEFORE INSERT): toda OC nasce `aguardando_aprovacao` (ou `rascunho`) ✅ dump `:6619`.
- `fn_ordens_compra_recalcular` (itens): depois de somar os itens, a OC com `valor_total_brl` **até** `parametros_compras.limite_aprovacao` (padrão R$ 30 000,00 por unidade) vira **`aprovado` sozinha**; acima do limite fica `aguardando_aprovacao`; uma OC já aprovada que sobe acima do limite volta a `aguardando_aprovacao` ✅ dump `:6750`.
- `fn_ordens_compra_status` (BEFORE UPDATE): `cancelado` é final; aprovar acima do limite exige que a OC tenha passado por `aguardando_aprovacao`; carimba `aprovado_em` e `cancelado_em` ✅ dump `:6851`.
- Quem decide: um usuário com `compras.pode_aprovar` (perfil Gerência de Compras) ✅ `ordens_compra.route.js:1235`.

Isto **é** a regra decidida em 14/10 (N14-21): a OC que excede R$ 30 mil é aprovada pelo Gerente de Compras; até R$ 30 mil os compradores ficam livres (o banco aprova sozinho); a Diretoria não aprova ✅ (`ordens_compra.route.js:1230-1240`; função `fn_ordens_compra_recalcular` em `docs/ENVIAR - contrato-compras-backend.md:649-694` do HUB). 🟡 A regra é provisória: endurece depois da conversa com Compras. Ver [[Contradicoes-Resolvidas]] CR-13.

### Status por item (API-005/006) — todos os nós

| Rota | Faz | Código |
|---|---|---|
| `GET /itens_pedido_status?codigo_empresa=&pedido_venda=` | etapa dos itens do pedido, com escopo de vendedor | ✅ `tables/itens_pedido_status/itens_pedido_status.route.js:54` |
| Job | a cada `MES_STATUS_INTERVALO_SEG` (padrão 90 s) por unidade ativa: `GET {MES_API_URL}/itens/status?alterado_desde=&codigo_empresa=&incluir_deletados=true&limit=1000`; grava com `fn_itens_pedido_status_gravar`; trava `avhub.mes_status_itens`; corte inicial `MES_STATUS_CORTE_INICIAL_DIAS` (30) | ✅ `itens_pedido_status.job.js:3-60` |

### Torre de Fluxo (LOG-46) — os 9 setores

| Rota | Permissão (migration 046/046b em `auth.rotas_telas`) | Faz | Código |
|---|---|---|---|
| `GET /fluxo/torre?codigo_empresa=&setor=&etapa=&situacao=&q=&page=&limit=` (`situacao` = `no_prazo`, `fora_do_prazo`, `sem_dono`; até 500 por página) | `torre-fluxo` | mapa por setor e lista de itens (`fn_torre_setores`, `fn_torre_itens`) | ✅ `core_fluxo/tables/item_estado_projetado/item_estado_projetado.route.js:185` |
| `GET /fluxo/itens/:id` | `torre-fluxo-trilha` (mostra nomes de pessoas) | item + trilha (MES + eventos do hub) + tempo | ✅ `:302` |
| `GET /fluxo/itens/:id/tempo` | `torre-fluxo` | tempo por etapa (proxy do MES) | ✅ `:281` |
| `GET /fluxo/sla-etapas` | `torre-fluxo` | meta por etapa (proxy do MES) | ✅ `:262` |

- **Projeção:** `core_fluxo.item_estado_projetado`, uma linha por `(codigo_empresa, numero_pedido, codigo_item_omie)`, escrita **só** por `core_fluxo.fn_feed_aplicar` ✅ dump `:2169`. Também existem `core_fluxo.evento` (eventos do hub, append-only, nasce vazia) e `core_fluxo.feed_cursor` (`fonte = 'mes'`).
- **Job:** `item_estado_projetado.job.js` a cada 90 s (`INTERVALO_MS`), primeira rodada aos 5 s, `GET {MES_API_URL}/fluxo/eventos?apos_seq=<cursor - 200>&limite=1000`, até 50 páginas por rodada, trava `avhub.fluxo_feed`; 404 do MES = "feed ainda não publicado": avisa uma vez e espera 10 min ✅ `:46-60`.
- **Escopo:** por unidade (`auth.usuarios_unidades`); fora do escopo, 403 na lista e 404 no item; MES fora do ar devolve 200 com `mes_indisponivel = true` ✅ `:16-33`.
- **Estado hoje:** o MES **não publica** `/fluxo/*` 🔴 (Robert); o job está dando 404. O HUB já tem a tela da Torre (15/10, BL-022; ver [[AV-Hub-Front]]). A 046b concede as duas telas só ao perfil de testes do time de TI ✅ comentário `:22-25`, então nenhum perfil de negócio abre a Torre; a concessão real ❓ Gustavo.

### Custo real por item (LOG-47 §1, API-008) — E3, R4

| Rota | Permissão | Faz | Código |
|---|---|---|---|
| `GET /itens_pedido_custo?codigo_empresa=&numero_pedido=` | `custo-itens.pode_visualizar`, **sempre** (também sem token, via `id_usuario_sessao`); 403 `USUARIO_NAO_INFORMADO`/`SEM_PERMISSAO`; `PEDIDO_FORA_DO_ESCOPO` para vendedor sem escopo | custo por produto do pedido: `quantidade`, `quantidade_com_custo`, `custo_total`, `custo_medio`, `completo`, `cotacao_a_conferir`, `lotes`; pedido manual devolve `pedido_manual: true` e itens vazios | ✅ `tables/itens_pedido_custo/itens_pedido_custo.route.js:66-154` |
| Job | chave `MES_API_KEY` | a cada 90 s por unidade ativa: `GET {MES_API_URL}/itens/custo?alterado_desde=<cursor>&apos_id=&codigo_empresa=&limit=1000`; grava com `fn_itens_pedido_custo_gravar`; 1ª leitura desde 1970; MES 404 = espera 10 min; trava `avhub.mes_custo_itens` | ✅ `itens_pedido_custo.job.js:51-60` |

- A migration **047b** troca a chave de `(unidade, pedido, item)` para `(unidade, pedido, codigo_produto_omie)` (o item é o produto) ✅ cabeçalho do job. O dump de 14/10 estava na 047 (rota daria 500); **o dump de 29/10 já está na 047b**: `UNIQUE uq_itens_pedido_custo (codigo_empresa, numero_pedido, codigo_produto_omie)` e `fn_itens_pedido_custo_do_pedido` devolve `codigo_produto_omie` ✅ (dump de 29/10, `:6290`, `:27722`). Ver [[Diferencas-Codigo-x-Banco]].
- O MES tem `GET /itens/custo` desde 27/10 (`6c11147`), só na `develop` do `api-pcp` ✅ ([[Modelo-Estoque-e-Custo-do-Lote]]). Enquanto a `develop` do MES não chega à produção, o job recebe 404.
- Etapas 2 (simulador pré-preenchido) e 3 (comissão por NF) do LOG-47 são Ciclo 2 e não leem a tabela ✅ comentário do job.
