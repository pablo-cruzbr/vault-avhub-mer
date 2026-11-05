# Fatos de 03-Pedido-de-Venda-e-Liberacao

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/03-Pedido-de-Venda-e-Liberacao.md`, antes de mexer na nota.
Gerada por `node _v3/scripts/fatos.mjs extrair`. Conferência: `node _v3/scripts/fatos.mjs conferir 03-Pedido-de-Venda-e-Liberacao`.

## decisões e IDs (11)

- `N16-05`
- `N16-106`
- `N16-142`
- `N16-30`
- `N16-33`
- `N16-68`
- `N16-69`
- `N16-70`
- `N16-71`
- `N16-84`
- `N16-91`

## contratos (7)

- `API-005`
- `API-006`
- `LOG-26`
- `LOG-40`
- `LOG-45`
- `LOG-50`
- `SQL-010`

## commits (1)

- `484dea6`

## arquivo:linha (29)

- `/carteira/page.ts`
- `/etapas/route.ts`
- `/route.ts`
- `/vendas/liberar-pedidos/page.ts`
- `PedidoDetalhe.ts`
- `aggregates/pedidos_liberacao/pedidos_liberacao.route.js:88`
- `aggregates/pedidos_liberados/pedidos_liberados.route.js:57`
- `api-pcp/src/pedidos/omie-integracao.ts:338`
- `app/api/liberar-pedidos/route.ts`
- `components/LiberarPedidos/fontes.ts`
- `components/Pedidos/EtapaDosItens.ts`
- `escopoVendedor.js`
- `fontes.ts`
- `integracao-avhub.controller.ts:26`
- `integracao-avhub.service.ts:114-156`
- `itens_pedido_status.route.js:54`
- `lib/api/pedidosVenda.ts`
- `lib/api/portalPcp.ts`
- `lib/domain/etapas-item.ts:30-41`
- `liberacao-equipe/page.ts`
- `omie-integracao.ts:339-349`
- `pedidos.service.ts:244-249`
- `pedidos.service.ts:402-406`
- `pedidos.service.ts:63-122`
- `producao.prisma:118`
- `src/middlewares/escopoVendedor.js:79`
- `src/schemas/core_vendas_faturamento/index.js:179-180`
- `src/utils/acessoConfig.js:73-74`
- `tables/itens_pedido_status/itens_pedido_status.job.js`

## rotas (15)

- `GET /api/liberar-pedidos`
- `GET /api/pedidos-venda/:fonte/:empresa/:pedido/etapas`
- `GET /itens/status`
- `GET /itens_pedido_status`
- `GET /itens_pedido_status?codigo_empresa=&pedido_venda=&historico=`
- `GET /pedidos_liberacao`
- `GET /pedidos_liberacao?vendedor=&codigo_empresa=&status=&busca=&sort=&order=&page=&limit=`
- `GET /pedidos_liberados`
- `GET /pedidos_liberados/:numero/itens?codigo_empresa=`
- `GET /pedidos_liberados?codigo_empresa=&alterado_desde=&mes=&ano=&importado=&page=&limit=`
- `POST /:numero/importado`
- `POST /pedidos_liberados/:numero/importado?codigo_empresa=`
- `POST /pedidos_venda_hub/:id/cancelar`
- `PUT /api/liberar-pedidos/:empresa/:numero`
- `PUT /pedidos_liberacao/:codigo_empresa/:numero_pedido`

## datas (11)

- `01/09/2026`
- `01/10`
- `05/11/2026`
- `07/10`
- `14/10`
- `15/10`
- `26/10`
- `26/10/2026`
- `28/09/2026`
- `29/10/2026`
- `30/09`

## código entre crases (220)

- `/:numero/itens`
- `/carteira`
- `/itens_pedido_status`
- `/liberacao-equipe`
- `/meus-pedidos/pedido/:empresa/:numero`
- `/pcp-pedidos`
- `/pcp-pedidos/pedido/...`
- `/pedidos-equipe/pedido/:empresa/:numero`
- `/pedidos_liberacao`
- `/pedidos_liberados`
- `/pedidos_liberados/*`
- `/pedidos_liberados/:numero/itens`
- `/produtos/pedidoetapas/`
- `/produtos/pedidovendafat/`
- `/vendas/liberar-pedidos`
- `/vendas/notas-fiscais-saida`
- `/vendas/pedidos-de-venda`
- `2026-07-28`
- `2026-09-01`
- `23514`
- `484dea6`
- `:115`
- `:141`
- `:143`
- `:164`
- `:167-192`
- `:181-186`
- `:187`
- `:194`
- `:222`
- `:283`
- `:50`
- `:814`
- `?fonte=equipe`
- `AGUARDANDO_LIBERACAO`
- `API_KEY`
- `AVHUB_REENVIO_IMPORTADO_MIN`
- `AlterarPedidoVenda`
- `AvhubApiKeyGuard`
- `CancelarPedidoVenda`
- `ComprasDoPedido`
- `ConflictException`
- `EM_COMPRA`
- `EM_ESTOQUE`
- `EM_INSPECAO`
- `EM_PRODUCAO`
- `EM_RECEBIMENTO`
- `ESCOPO_VENDEDORES_EXIGIR`
- `ETAPA_ATRASO_MINUTOS`
- `ExcluirPedido`
- `FATURADO`
- `GAMBIARRA(`
- `GET /api/liberar-pedidos`
- `GET /api/pedidos-venda/:fonte/:empresa/:pedido/etapas`
- `GET /itens/status`
- `GET /itens_pedido_status`
- `GET /itens_pedido_status?codigo_empresa=&pedido_venda=&historico=`
- `GET /pedidos_liberacao`
- `GET /pedidos_liberados`
- `GET /pedidos_liberados/:numero/itens?codigo_empresa=`
- `IncluirPedido`
- `ListarEtapasPedido`
- `MES_API_KEY`
- `MES_INTEGRACAO_KEYS`
- `MES_STATUS_INTERVALO_SEG`
- `P1`
- `P2`
- `PEDIDO_FORA_DA_LIBERACAO`
- `PEDIDO_FORA_DO_ESCOPO`
- `PEDIDO_IMPORTADO_MES`
- `PEDIDO_NAO_LIBERADO`
- `PENDENTE_PCP`
- `POST .../importado`
- `POST /:numero/importado`
- `POST /pedidos_liberados/:numero/importado?codigo_empresa=`
- `POST /pedidos_venda_hub/:id/cancelar`
- `POST importado`
- `PRONTO_EXPEDICAO`
- `PUT`
- `PUT /api/liberar-pedidos/:empresa/:numero`
- `PUT /pedidos_liberacao/:codigo_empresa/:numero_pedido`
- `PedidoDetalhe.tsx:1051`
- `Pedidos.acompanhamentoQualidade`
- `Pedidos.acompanhamento_qualidade`
- `Pedidos.codigo_pedido_omie`
- `Pedidos.importado_avhub_em`
- `SELECT data_inicio_liberacao FROM core_vendas_faturamento.parametros_vendas`
- `SEM_VENDEDOR_VINCULADO`
- `V1`
- `V2`
- `V3`
- `[codigoEmpresa]/[numeroPedido]/route.ts`
- `acao`
- `acompanhamento_qualidade`
- `acompanhamento_qualidade boolean`
- `aggregates/pedidos_liberacao/pedidos_liberacao.route.js:88`
- `aggregates/pedidos_liberados/pedidos_liberados.route.js:57`
- `alterado`
- `api-acos-vital`
- `api-pcp`
- `api-pcp/src/pedidos/omie-integracao.ts:338`
- `api-test`
- `api005`
- `app-pcp`
- `app-pcp/app/(protected)/carteira/page.tsx:286-290`
- `app/(protected)/vendas/liberar-pedidos/page.tsx`
- `app/api/liberar-pedidos/route.ts`
- `app/api/pedidos-venda/[fonte]/[codigoEmpresa]/[pedidoVenda]/etapas/route.ts`
- `auth.rotas_telas`
- `auth.telas`
- `av-hub`
- `cliente`
- `codigo_empresa`
- `codigo_pedido_integracao`
- `components/LiberarPedidos/`
- `components/LiberarPedidos/fontes.ts`
- `components/Pedidos/EtapaDosItens.tsx`
- `compras.fechamento`
- `compras.requisicao`
- `contagem.pendente`
- `core_fluxo.item_estado_projetado`
- `core_vendas_faturamento`
- `data_inclusao`
- `data_inclusao >=`
- `data_inclusao >= parametros_vendas.data_inicio_liberacao`
- `data_inicio_liberacao date`
- `data_previsao`
- `develop`
- `disponivel: false`
- `escopoVendedor.js`
- `escopoVendedoresExigir = () => true`
- `estado_macro`
- `estoque.atendimento`
- `etapa`
- `etapa <> 0`
- `etapaDoItem`
- `exclusionSync`
- `expedicao.concluido`
- `expedicao.embalagem`
- `fabrica.espera`
- `fabrica.execucao`
- `false`
- `fn_pedidos_vendas_liberacao_historico`
- `fn_pedidos_vendas_liberacao_regras`
- `fontes.ts`
- `id = 1`
- `importado`
- `importado_mes`
- `importado_mes_em`
- `importado_mes_referencia`
- `integracao-avhub.controller.ts:26`
- `integracao-avhub.service.ts:114-156`
- `itens_pedido_status`
- `itens_pedido_status.route.js:54`
- `lib/api/pedidosVenda.ts`
- `lib/api/portalPcp.ts`
- `lib/domain/etapas-item.ts:30-41`
- `liberacao`
- `liberacao-equipe`
- `liberacao-equipe/page.tsx`
- `liberado`
- `liberado_em`
- `liberado_por`
- `liberar-pedidos`
- `liberar-pedidos.pode_editar`
- `null`
- `numero_pedido`
- `omie-integracao.ts:339-349`
- `ordena por`
- `par`
- `parametros_vendas`
- `parametros_vendas.data_inicio_liberacao`
- `pedido_venda`
- `pedidos-equipe`
- `pedidos.service.ts:244-249`
- `pedidos.service.ts:402-406`
- `pedidos.service.ts:63-122`
- `pedidos_liberacao`
- `pedidos_vendas`
- `pedidos_vendas_liberacao`
- `pedidos_vendas_liberacao_historico`
- `pedidos_vendas_liberacao_historico.acao`
- `pendente`
- `pode_aprovar`
- `pode_editar`
- `pode_visualizar`
- `producao.prisma:118`
- `public`
- `qualidade.inspecao`
- `qualidade.quarentena`
- `qualidade.reprovado`
- `quantidade_na_etapa`
- `recebimento.conferencia`
- `referencia`
- `req.usuario`
- `sequencial = 0`
- `situacao = 'Pendente'`
- `src/middlewares/escopoVendedor.js:79`
- `src/schemas/core_vendas_faturamento/index.js:179-180`
- `src/utils/acessoConfig.js:73-74`
- `status_liberacao`
- `status_liberacao = liberado`
- `status_liberacao IN ('liberado','importado')`
- `tables/itens_pedido_status/itens_pedido_status.job.js`
- `todos`
- `total_pedido_venda`
- `true`
- `updated_at`
- `updated_by`
- `usuario`
- `v2-antes-da-v3`
- `valor_anterior`
- `vendedor`
- `vinculados`
- `vw_pedidos_liberacao`
- `vw_vendas_planilha`
- `{ acompanhamento_qualidade, updated_by }`
- `{ referencia }`
- `| HUB lê da API | caixa do vendedor e tela do gerente (sem`
- `| MES lê (polling) | só liberados; com`

## regras e linhas de conteúdo (140)

- O pedido nasce no Omie (o sistema de gestão) e chega ao av-hub **travado**. `V1`
- O vendedor, ou o auxiliar dele, abre a tela Liberar Pedidos, na aba "Aguardando você".
- Ele responde: a Qualidade acompanha esse pedido desde o início? Sim ou Não. `V2`
- Ele libera **na mesma ação** da resposta. `V3`
- Até o PCP importar o pedido, o vendedor ainda pode corrigir a resposta.
- O MES (sistema de chão de fábrica) consulta a lista de liberados. Ninguém empurra o pedido para ele. `P1`
- Quando o PCP grava as ordens, o MES avisa o av-hub. O pedido vira "No PCP" e a resposta trava, com um cadeado. `P2`
- Depois disso, o vendedor só acompanha. O cartão "Etapa dos itens" mostra em que etapa está cada item.
- | Vendedor | Marca Sim ou Não e libera os pedidos dele |
- | Auxiliar do titular | Libera pelos titulares que ele auxilia |
- | Gerente | Só vê todos os pedidos da liberação; descobre quem está segurando pedido |
- | PCP | Usa os pedidos liberados; não marca nada |
- | Gustavo (DBA), Nathan, Robert | Banco e API, telas do av-hub, e lado MES |
- Só pedido liberado vai ao MES. Sem liberação, o PCP não vê o pedido.
- A resposta e a liberação são uma ação só.
- A regra vale por pedido. As parciais criadas depois herdam a resposta.
- Só pedido incluído a partir da data de corte precisa de liberação. A carteira anterior não trava.
- O vendedor corrige a resposta até o MES importar. Depois, ela trava.
- O MES busca a lista. Ninguém empurra pedido para ele.
- O gerente só visualiza. Vendedor e auxiliar liberam.
- O vendedor vê só os pedidos dele. A API aplica isso pelo token de login.
- O pedido do Omie entra na liberação com os mesmos filtros da Carteira antiga.
- A resposta sobre Qualidade é guardada agora e usada depois, na fila de inspeção de processo. Essa fila ainda não existe.
- ✅ (`av-hub`, `api-acos-vital`) Telas Liberar Pedidos e Liberação da Equipe, e as rotas da API.
- ✅ (`api-pcp`) O MES lê os liberados, recusa pedido não liberado e confirma a importação, com reenvio automático.
- ✅ (`av-hub`) Cartão "Etapa dos itens" no detalhe do pedido.
- 🟡 Os 9 estados macro do vendedor não existem no código. Hoje ele vê a situação da liberação e 11 etapas por item.
- 🔴 Chave própria do MES, mapa de rotas por tela e teste do escopo do vendedor.
- 🔴 Renovar o token expirado, reabrir marcação depois da importação e alertar pedido parado.
- 🔴 Fila de inspeção de processo da Qualidade e refinos do cartão Etapa dos itens.
- 🔴 Pedido manual: o desenho só prevê pedido que chega do Omie.
- ❓ Valor da data de corte em produção e migration `api005`.
- | Vendedor | Marca Sim ou Não e libera os pedidos dele | Portal do Vendedor, `/vendas/liberar-pedidos` |
- | Auxiliar do titular | Libera pelos titulares que auxilia (mesmo escopo de Meus Pedidos) | idem |
- | Gerente (perfis que já veem Pedidos da Equipe) | Vê todos os pedidos da liberação, só leitura; descobre quem está segurando pedido | Portal do Gerente, `/liberacao-equipe` |
- | PCP | Consome os liberados (não marca nada) | MES, ver [[04-PCP-Triagem-e-Destinacao]] |
- | Gustavo (DBA) | Banco e API desta raia | `api-acos-vital` |
- | Nathan | Front do av-hub (telas e BFF) | HUB |
- | Robert | Lado MES do contrato (`importado`, polling) | `api-pcp` |
- | 1 | O pedido chega do Omie travado; o vendedor marca "a Qualidade acompanha desde o início?" (Sim ou Não) e libera **na mesma ação** (marcação e liberação não se separam). | 📝 |
- | 2 | **Só pedido liberado vai ao MES.** Sem linha em `pedidos_vendas_liberacao`, o MES não enxerga o pedido (`/pedidos_liberados` não o lista; os itens respondem 409 `PEDIDO_NAO_LIBERADO`). | 📝 |
- | 3 | Grão **por pedido** (`codigo_empresa` + `numero_pedido`). As parciais que o pipeline cria depois herdam a marcação. | 📝 |
- | 4 | **Data de corte:** só pedido incluído a partir de `parametros_vendas.data_inicio_liberacao` precisa de liberação. A carteira anterior não trava. | 📝 |
- | 5 | O vendedor pode **corrigir a marcação até o MES importar**. Depois da importação a marcação trava (409 `PEDIDO_IMPORTADO_MES`; no banco, erro `23514` do trigger). | 📝 |
- | 6 | **Ninguém empurra ao MES: o MES faz GET (polling).** É o Fluxo 4 da integração (os Fluxos 1 a 3 são requisição, referência da OC e status por item). | 📝 |
- | 7 | Quem libera: o vendedor e o auxiliar dos titulares que ele auxilia. | 📝 |
- | 8 | O gerente tem tela própria, **só visualização**, com todos os vendedores. | 📝 |
- | 9 | O escopo do vendedor é aplicado **pela API a partir do token** (contrato [[Contratos-da-v2\|LOG-40]]): sem a chave `vendedor`, a API preenche com os vendedores do usuário. O BFF não filtra mais. | 📝 |
- | 10 | Pedido do Omie entra na liberação com os mesmos filtros que a Carteira antiga usava: `sequencial = 0`, sem track record, grupo líquido (sem dedução ou blacklist), `etapa <> 0`, incluído a partir da data de corte e `situacao = 'Pendente'` (ou já liberado). | 📝 |
- | 11 | A marcação "Qualidade acompanha" é **capturada agora e consumida depois** pela fila de inspeção de processo da Qualidade (não existe, ver "O que falta"). | 📝 |
- | Valor | Significado | Quem vê |
- | `pendente` | O vendedor ainda não liberou; o PCP não vê. Aba "Aguardando você" (vendedor) ou "Aguardando vendedor" (gerente) | vendedor, gerente |
- | `liberado` | Liberado; o MES ainda não confirmou a importação. Dá para trocar a marcação. Aba "Liberados" | vendedor, gerente, MES |
- | `importado` | O MES confirmou (`importado_mes_em` preenchido). A marcação está travada. Aba "No PCP" | vendedor, gerente, MES |
- | Nome atual | Nome antigo | Rota | App | Quem |
- | Liberar Pedidos | Caixa de entrada do vendedor (tela 1.1) | `/vendas/liberar-pedidos` | HUB (Portal do Vendedor) | Vendedor: `pode_visualizar` e `pode_editar` |
- | Liberação da Equipe | visão do gerente da 1.1 | `/liberacao-equipe` | HUB (Portal do Gerente) | perfis com `pedidos-equipe`: só `pode_visualizar` |
- | Meus Pedidos (detalhe, cartão Etapa dos itens) | Meus Pedidos por etapa (tela 1.2) | `/meus-pedidos/pedido/:empresa/:numero` | HUB | Vendedor |
- | Pedidos da Equipe (detalhe, mesmo cartão) | idem | `/pedidos-equipe/pedido/:empresa/:numero` | HUB | Gerência |
- | Pedidos do PCP | Portal PCP | `/pcp-pedidos`, `/pcp-pedidos/pedido/...` | HUB | acompanhamento comercial, **não** é o `app-pcp` |
- | Triagem dos Pedidos | Carteira de Pedidos | `/carteira` | app-pcp | PCP (ver [[04-PCP-Triagem-e-Destinacao]]) |
- | Método e rota | Direção | Uso | Contrato |
- | `GET /pedidos_liberacao?vendedor=&codigo_empresa=&status=&busca=&sort=&order=&page=&limit=` | HUB lê da API | caixa do vendedor e tela do gerente (sem `vendedor` = todos) | [[Contratos-da-v2\|LOG-26]] §4.1 |
- | `PUT /pedidos_liberacao/:codigo_empresa/:numero_pedido` `{ acompanhamento_qualidade, updated_by }` | HUB escreve | libera (1ª vez) ou troca a marcação; 404 `PEDIDO_FORA_DA_LIBERACAO`, 409 `PEDIDO_IMPORTADO_MES`, 403 `PEDIDO_FORA_DO_ESCOPO` e `SEM_VENDEDOR_VINCULADO` | idem |
- | `GET /pedidos_liberados?codigo_empresa=&alterado_desde=&mes=&ano=&importado=&page=&limit=` | MES lê (polling) | só liberados; com `alterado_desde` ordena por `liberacao_alterada_em` crescente | idem §4.2 |
- | `GET /pedidos_liberados/:numero/itens?codigo_empresa=` | MES lê | itens do pedido mais o objeto `liberacao`; 409 `PEDIDO_NAO_LIBERADO` | idem |
- | `POST /pedidos_liberados/:numero/importado?codigo_empresa=` `{ referencia }` | MES escreve | confirma a importação (idempotente); trava a marcação | idem |
- | `GET /api/liberar-pedidos` e `PUT /api/liberar-pedidos/:empresa/:numero` | BFF do HUB | repassa à API; `?fonte=equipe` exige a tela `liberacao-equipe` | idem §5 |
- | `GET /itens/status` (MES) e `GET /itens_pedido_status?codigo_empresa=&pedido_venda=&historico=` (hub) | MES para hub (job de 90 s) e HUB lê | cartão Etapa dos itens | [[Contratos-da-v2\|API-005]], [[Contratos-da-v2\|API-006]], [[Contratos-da-v2\|SQL-010]] |
- | `GET /api/pedidos-venda/:fonte/:empresa/:pedido/etapas` | BFF do HUB | repassa `/itens_pedido_status`; responde `disponivel: false` quando o hub ainda não tem a rota | API-006 |
- ✅ Rotas montadas em `src/schemas/core_vendas_faturamento/index.js:179-180` (`/pedidos_liberacao`, `/pedidos_liberados`) e job de status em `:181-186`.
- ✅ `GET /pedidos_liberacao` em `aggregates/pedidos_liberacao/pedidos_liberacao.route.js:88` (lê uma vez a view e deriva página, total e contagem por status); `PUT` em `:164`, com `PEDIDO_FORA_DA_LIBERACAO` (`:187`) e `PEDIDO_IMPORTADO_MES` (`:194`, `:222`).
- ✅ `GET /pedidos_liberados` em `aggregates/pedidos_liberados/pedidos_liberados.route.js:57` (filtra `status_liberacao IN ('liberado','importado')`), `/:numero/itens` em `:115` (409 `PEDIDO_NAO_LIBERADO` definido em `:50`), `POST /:numero/importado` em `:143`.
- ✅ Escopo do vendedor **fixo no código**: `src/utils/acessoConfig.js:73-74` (`escopoVendedoresExigir = () => true`; a chave `ESCOPO_VENDEDORES_EXIGIR` não é mais lida). Regra da rota em `src/middlewares/escopoVendedor.js:79` (`pedidos_liberacao`: formato `par`, detalhe `pedido_venda`).
- ✅ Regras no banco (Dump Avhub 14/10): trigger `fn_pedidos_vendas_liberacao_regras` (linha 7783: `liberado_por` e `liberado_em` não mudam; depois de `importado_mes_em`, trocar a marcação dá `23514`), `fn_pedidos_vendas_liberacao_historico` (linha 7743), tabela `parametros_vendas` (linha 18031), `pedidos_vendas_liberacao` (linha 18285), view `vw_pedidos_liberacao` (linha 20870).
- ✅ Job que alimenta o cartão: `tables/itens_pedido_status/itens_pedido_status.job.js` (intervalo `MES_STATUS_INTERVALO_SEG`, padrão 90, linha 217) e rota `itens_pedido_status.route.js:54`. O escopo do vendedor cobre `/itens_pedido_status` (dono por pedido; pedido sem dono conhecido em `pedidos_vendas` dá 403, fail-closed).
- ✅ BFF `app/api/liberar-pedidos/route.ts` (GET): para a fonte `vendedor` exige token de usuário (sem ele, 401 "Sessão sem identidade no backend") e **não manda `vendedor`**; 403 `SEM_VENDEDOR_VINCULADO` vira "sem vínculo". `[codigoEmpresa]/[numeroPedido]/route.ts` (PUT): exige token, põe o autor pela sessão, e o dono do pedido é conferido pela API.
- ✅ `components/LiberarPedidos/` (lista, tabela, hook e `fontes.ts`) e páginas `app/(protected)/vendas/liberar-pedidos/page.tsx` e `liberacao-equipe/page.tsx`.
- ✅ Cartão `components/Pedidos/EtapaDosItens.tsx`, embutido em `PedidoDetalhe.tsx:1051` (ao lado de `ComprasDoPedido`, `:814`), alimentado por `app/api/pedidos-venda/[fonte]/[codigoEmpresa]/[pedidoVenda]/etapas/route.ts`. Tradução das etapas em `lib/domain/etapas-item.ts:30-41`; aviso de dado velho acima de 10 minutos (`ETAPA_ATRASO_MINUTOS`).
- ✅ A Triagem lê `GET /pedidos_liberados` (`api-pcp/src/pedidos/omie-integracao.ts:338`); os itens vêm de `/pedidos_liberados/:numero/itens` (`:141`).
- ✅ A criação da destinação recusa pedido não liberado (`pedidos.service.ts:244-249`, `ConflictException`) e guarda `Pedidos.acompanhamentoQualidade` (`:283`, coluna em `producao.prisma:118`). A Triagem mostra a coluna Qualidade ("Acompanha" ou "Não", `app-pcp/app/(protected)/carteira/page.tsx:286-290`).
- ✅ Confirmação de importação (`POST .../importado`, `omie-integracao.ts:339-349`) feita depois da criação das OPs (`pedidos.service.ts:402-406`), com **reenvio automático** a cada `AVHUB_REENVIO_IMPORTADO_MIN` (padrão 10 min) para pedidos dos últimos 7 dias (`pedidos.service.ts:63-122`). Isto cumpre a promessa de retentativa feita no contrato 26.
- ✅ O status por item sai de `GET /itens/status` (`integracao-avhub.controller.ts:26`; `integracao-avhub.service.ts:114-156`; `etapaDoItem` em `:167-192`), protegido por `AvhubApiKeyGuard` com `MES_API_KEY` (fail-closed).
- | Tabela ou view | Schema | Colunas que importam |
- | `parametros_vendas` | `core_vendas_faturamento` | linha única (`id = 1`); `data_inicio_liberacao date` (compara com `data_inclusao >=`); sem linha, a view fica vazia |
- | `pedidos_vendas_liberacao` | `core_vendas_faturamento` | PK (`codigo_empresa`, `numero_pedido`); `acompanhamento_qualidade boolean`; `liberado_por`, `liberado_em`; `updated_by`, `updated_at` (cursor do polling); `importado_mes_em`, `importado_mes_referencia`. Sem FK para `pedidos_vendas` (o pipeline recria linhas) |
- | `pedidos_vendas_liberacao_historico` | `core_vendas_faturamento` | `acao` (`liberado`, `alterado`, `importado_mes`), `valor_anterior`, `usuario`, `referencia` |
- | `vw_pedidos_liberacao` | `core_vendas_faturamento` | um pedido por linha; `status_liberacao`; sobre `vw_vendas_planilha` |
- | `itens_pedido_status` (+ cursor) | `core_vendas_faturamento` | uma linha por parcial e etapa; alimentada pelo job de 90 s ([[Contratos-da-v2\|SQL-010]]) |
- | `Pedidos.acompanhamento_qualidade`, `Pedidos.importado_avhub_em`, `Pedidos.codigo_pedido_omie` | `public` (MES) | cópia da marcação, selo de importação confirmada, id do pedido no Omie |
- Regra: `data_inclusao >= parametros_vendas.data_inicio_liberacao`. Pedido anterior não trava, **e também não aparece na Triagem**: os itens dele respondem 404 e o MES mostra "não encontrado" (observação do Robert, 30/09). Os pedidos anteriores à data de corte ficam fora do MES e terminam no sistema antigo 📝 (N16-142, 29/10/2026); falta uma mensagem clara no lugar do erro 404 🔴.
- Valor vigente: ❓. O contrato registra `2026-07-28` na `api-test` (conferido em 01/10) e `2026-09-01` no banco local. O vault anterior dizia 01/09/2026 em produção. O Dump Avhub é de esqueleto e não traz o dado. Conferir com `SELECT data_inicio_liberacao FROM core_vendas_faturamento.parametros_vendas` (Gustavo).
- | Dado | Vendedor | Auxiliar | Gerente | PCP (MES) |
- | Pedido `pendente` | só os dele | os dos titulares que auxilia | todos, em Liberação da Equipe | **não vê** |
- | Pedido `liberado` ou `importado` | os dele | idem | todos | vê (Triagem) |
- | Marcar e liberar | sim | sim | **não** (só leitura) | não |
- | Etapa por item (cartão) | dos pedidos no escopo dele | idem | dos pedidos da equipe | não usa o cartão; vê o roteiro no MES |
- O pedido nasce liberado e o PCP o vê na triagem. O pedido digitado direto no Omie segue o mesmo caminho: chega travado, com vendas pronta, e o vendedor responde e libera. `V1`, `V2`, `V3`
- O pedido criado pela proposta nasce liberado, porque a Qualidade já foi respondida na proposta.
- Pedido cancelado: a requisição e a OC ainda não emitida cancelam sozinhas. O que já foi comprado vai ao Estoque, livre.
- Pedido já faturado: o cancelamento não desfaz compra nem produção.
- ✅ (`av-hub`) Telas Liberar Pedidos e Liberação da Equipe.
- 🔴 Cancelamento do pedido, com tarja na requisição e na OC.
- | 10 | O pedido criado pela proposta **nasce liberado**, sem `V3`. O `V1` tem duas origens, que seguem o mesmo fluxo e a mesma tela; o pedido digitado no Omie chega com a parte de vendas pronta (só se altera no Omie), e o vendedor responde `V2`/`V3` e preenche a parte de compras no Hub, sem travar o fluxo | 📝 N16-05, N16-106 |
- | 22 | **Pedido cancelado:** a requisição do PCP e a OC ainda não emitida são **canceladas sozinhas, com tarja**; a OC e o PCP são avisados; o que já foi comprado vai ao **Estoque, livre**, como lote com o custo da OC | 📝 N16-68, N16-69, N16-70 |
- | 23 | **Pedido já faturado:** o cancelamento não desfaz compra nem produção; fica só o abatimento da comissão e o saldo ainda não faturado, **parte por parte** | 📝 N16-71 |
- | 26 | Se alguém mexer no pedido no Omie depois, o sistema só avisa e traz a mudança | 📝 N16-30 |
- | 32 | **Pedidos de Venda e Notas Fiscais de Saída** ficam inativas também em produção | 📝 N16-33 |
- | Nome atual | Rota | App | Quem | Nó | Estado |
- | Pedidos de Venda (lista do Omie) | `/vendas/pedidos-de-venda` | HUB | Vendedor | `V1` | ✅ página no código; **inativada também em produção** (N16-33) |
- | Notas Fiscais de Saída | `/vendas/notas-fiscais-saida` | HUB | — | — | ✅ (`av-hub`) página no código; **inativada também em produção** (N16-33) |
- | **Tarja de pedido cancelado** na requisição e na OC | nas telas da requisição e da OC | HUB, MES | Compras, PCP | cancelamento | 🔴 |
- | Liberar Pedidos, Liberação da Equipe | `/vendas/liberar-pedidos`, `/liberacao-equipe` | HUB | Vendedor, gerente | `V2`, `V3` | ✅ (`av-hub`) hoje; a resposta passa para a tela do pedido (N16-106) 🟡 |
- | Método e rota | Uso | Nó | Estado |
- | `POST /pedidos_venda_hub/:id/cancelar` | registrar o cancelamento do pedido no hub; avisa OC e PCP, cancela requisição e OC não emitida, manda o comprado ao Estoque | cancelamento | 🔴 🟡 nome |
- ✅ **Existe cancelar pedido por API** (`CancelarPedidoVenda`, serviço `/produtos/pedidovendafat/`), e também `ExcluirPedido` e `AlterarPedidoVenda`. **Quem cancela, edita e exclui é o vendedor** (N16-84), não o Fiscal. O `ListarEtapasPedido` (`/produtos/pedidoetapas/`) devolve, por pedido, cancelamento, devolução e faturamento. **O hub guarda o cancelamento por conta própria** (quem, quando, motivo) porque o `exclusionSync` apagaria do hub um pedido excluído no Omie.
- | # | O quê | Dono | Nó | Selo |
- | 6 | Liberação gravada na resposta do `IncluirPedido`, com histórico | Gustavo | `V1` | 🔴 |
- | 13 | **Cancelamento:** registro no hub, requisição e OC não emitida canceladas com tarja, aviso à OC e ao PCP, comprado ao Estoque, ajuste do `exclusionSync` | Nathan, Gustavo, Robert (Estoque) | cancelamento | 🔴 |
- | 4 | 📝 Quem cancela: o vendedor, por API (N16-84). Falta testar a diferença entre `CancelarPedidoVenda` e `ExcluirPedido` e quando cada um vale (OQ-17, OQ-48) | Nathan |
- | 8 | Estado do item que vai ao Estoque quando o pedido cancela e a reserva do MES | Robert |
- | # | O quê | Dono | Nó | Selo |
- | 1 | **L6: chave própria do MES**, de escrita, restrita a `/pedidos_liberados/*` e às rotas que ele usa. Hoje o MES usa a chave admin ou de banco; a única chave própria (`MES_INTEGRACAO_KEYS`) só abre o PUT do contrato 34. Decidir: chave restrita ou seguir com a admin | Gustavo (decide), Robert (troca a variável `API_KEY`) | V3, P2 | 🔴 |
- | 2 | **L3: mapear `auth.rotas_telas`** para `GET /pedidos_liberacao` (`liberar-pedidos` ou `liberacao-equipe`, `pode_visualizar`) e `PUT` (`liberar-pedidos.pode_editar`); confirmar que `/pedidos_liberados/*` fica como rota de serviço | Gustavo | V2 | 🔴 |
- | 3 | **Testar o escopo do vendedor com usuário vendedor** (roteiro da seção 5 do contrato 40): nenhum teste rodou; sessão sem token responde 401 no BFF | Nathan e Gustavo | V2 | 🔴 |
- | 4 | **Token expirado vira furo de acesso** quando o BFF para de filtrar: sem `req.usuario` a API não aplica escopo (`escopoVendedor.js`). Renovar o token antes de qualquer remoção de filtro | Gustavo | V2 | 🔴 |
- | 5 | **Reabrir marcação depois da importação.** Hoje ninguém destrava. Decidir se a Gerência ou o PCP pode reabrir (rota nova, permissão `pode_aprovar`) | Nathan decide, Gustavo implementa | V3 | 🔴 |
- | 6 | **Pedido parado.** Pedido que o vendedor nunca libera é invisível ao PCP. A tela do gerente mostra quem segura; falta alerta depois de N horas e definir quem recebe (decisão T-07 do v1) | Nathan | V3 | 🔴 |
- | 7 | **Fila de inspeção de processo** que consome `Pedidos.acompanhamentoQualidade`: o dado chega e é gravado, mas nenhuma tela do MES o usa além da coluna da Triagem | Robert | V2 e raia de [[11-Qualidade-Saida]] | 🔴 |
- | 8 | **Estados macro do vendedor** (os 8 do desenho): decidir se entram ou se o vendedor fica com `status_liberacao` mais 11 etapas; se entrarem, depende do feed do MES (`estado_macro`) | Nathan decide, Robert (feed) | V1 a O2 | 🔴 |
- | 9 | **Cartão Etapa dos itens:** teste ponta a ponta com a migration `api005` aplicada; `quantidade_na_etapa` tipado como número e a API pode mandar `null`; sem linha do tempo, SLA nem filtro por etapa; `compras.fechamento` ainda aparece como "Em compra" (sem cotação, aprovação ou trânsito) | Nathan (front), Gustavo (migration), Robert (etapa de compra mais fina) | V1 | 🔴 |
- | 10 | **Migration `api005`** (função, tabela e mapa de rotas do status por item) não verificada no banco; DDL não versionado | Gustavo | V1 | ❓ |
- | 11 | ✅ Marcas `GAMBIARRA(` de escopo removidas do front (`lib/api/pedidosVenda.ts`, `lib/api/portalPcp.ts`; `484dea6`, 15/10): contrato [[Contratos-da-v2\|LOG-50]] | Nathan | V2 | ✅ |
- | 12 | **Valor da data de corte em produção** e documentar | Nathan e Gustavo | V1 | ❓ |
- | 13 | Pedido manual ([[Contratos-da-v2\|LOG-45]]): o desenho só prevê pedido que chega do Omie; o risco do `exclusionSync` apagar pedido manual está em [[Riscos]] | Gustavo | V1 | 🔴 |
- | 1 | Auxiliar pode liberar pelo titular? Está implementado que sim; confirmar a regra de negócio | Nathan |
- | 2 | ✅ (`api-pcp`) Pedidos anteriores à data de corte ficam fora do MES e terminam no sistema antigo (N16-142). Falta só trocar o erro 404 dos itens por uma mensagem clara 🔴 | Robert (mensagem) |
- | 3 | O vendedor confirma pedido a pedido ou existe liberação automática depois de um prazo? (T-07) | Nathan e Comercial |
- | 4 | Quem avisa o vendedor quando o pedido já está importado e ele tenta trocar a marcação (hoje aparece o cadeado)? | Nathan |
- | 5 | Perfil com escopo `todos`: só a Gerência PCP? Os demais perfis passam a ver só os vendedores vinculados, o que muda o dia a dia de comprador e diligenciador | Nathan e Gustavo |

## subfluxo mermaid

```text
flowchart TD
    subgraph SEC_VENDAS["Vendas · av-hub"]
        V1["V1 · Pedido chega do Omie travado<br/>status_liberacao pendente"]
        V2["V2 · Vendedor marca<br/>a Qualidade acompanha? Sim ou Não"]
        V3["V3 · Vendedor libera<br/>status_liberacao liberado"]
        V1 --> V2 --> V3
        V3 -.->|"troca a marcação até a importação"| V2
    end
    subgraph SEC_PCP["PCP · MES"]
        P1["P1 · Triagem do Pedido<br/>GET pedidos_liberados"]
        P2["P2 · Destinação do Pedido<br/>cria as OPs"]
        P1 --> P2
    end
    V3 -->|"MES faz polling"| P1
    P2 -->|"POST importado<br/>status_liberacao importado, marcação trava"| V3
    P2 -.->|"GET itens status a cada 90 s"| V1
```
