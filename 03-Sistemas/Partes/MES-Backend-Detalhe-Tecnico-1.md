---
tags: [sistemas, mes, api-pcp, nestjs, backend, parte]
criado: 2026-11-05
estado-em: 2026-11-10
status: vigente
dono: Robert
parte-de: "[[MES-Backend]]"
fontes: [api-pcp befd973 (develop, 27/10; a main parou em 08/10 e está em 8e2bf56), prisma/migrations até 20261028120100, Dump MES (Esqueleto).sql de 14/10 (defasado), v1 App-PCP-Backend-Producao, App-PCP-Visao-Geral, MES-Arquitetura-Decisoes]
---

# MES Backend (`api-pcp`): detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[MES-Backend]] (parte 1 de 2): Como o app sobe; Módulos (`src/app.module.ts:36-72`); Rotas por módulo e permissão.

**Onde estamos:** ← [[MES-Backend]] (resumo e índice) · partes: **MES-Backend-Detalhe-Tecnico-1** · [[MES-Backend-Detalhe-Tecnico-2]]

## Como o app sobe

| Item | Valor | Fonte |
|---|---|---|
| Entrada | `NestFactory.create(AppModule)`, `ValidationPipe({ whitelist: true, transform: true })` | ✅ `src/main.ts:96-97` |
| Porta | `PORT` (padrão 3000) | ✅ `src/main.ts:156` (`process.env.PORT ?? 3000`) |
| Guards globais | `JwtAuthGuard` depois `PermissionsGuard` (APP_GUARD, negam por padrão; só `@Public()` escapa do JWT) | ✅ `src/app.module.ts:85-86` (`APP_GUARD`) |
| Filtro global | `PrismaExceptionFilter` traduz P2002/P2003/P2039/P2025 em HTTP amigável | ✅ `src/app.module.ts:88` |
| Saúde | `GET /health` público (`@Public()`) | ✅ `src/app.controller.ts:11-12` |
| Docs | `/docs` (Scalar) e `/api-docs-json` com Basic Auth `DOCS_USER`/`DOCS_PASSWORD`; sem senha em produção responde 404 | ✅ `src/main.ts:56-83` |
| Migrations | 66 pastas em `prisma/migrations` (de `20260818164425_init` a `20261028120100_op_e_lote_fabricado`); schema em 7 arquivos `prisma/models/*.prisma` (54 models, 22 enums) | ✅ `api-pcp/prisma/` |

215 rotas (contagem dos decorators `@Get/@Post/@Put/@Patch/@Delete` dos controllers na `develop`, 29/10; eram 192 em 14/10). A tabela rota a rota está na seção seguinte; as rotas novas de 15 a 28/10 têm a sua própria subseção.

## Módulos (`src/app.module.ts:36-72`)

| Módulo | Pasta | O que faz | Nós do 0b |
|---|---|---|---|
| Auth | `auth/` | login por usuário/senha, login Azure (via BFF), menu, setores permitidos | todos |
| RBAC | `rbac/{perfis,telas,usuarios-perfis}` | perfis, telas, permissões em lote, setores e depósitos por perfil | todos |
| Usuários, Auditoria | `usuarios/`, `auditoria/` | cadastro de usuário, log de login e de acesso | — |
| Cadastros de produção | `setores/`, `fabricas/` (UI "Destinos"), `maquinas/`, `operadores/`, `roteiros/`, `roteiro-item/` | cadastro de setor (tipos em [[Banco-MES]]), destino FABRICACAO/REVENDA, máquinas, operadores, roteiro | P2, F1 |
| Pedidos | `pedidos/` | Triagem (`/pedidos/carteira`), Destinação (`POST /pedidos/completo/lote`), consulta ao Omie, relatório/PDF, soft delete | P1, P2 |
| Itens e parciais | `itens-pedido/`, `itens-parciais/`, `historico-itens-parciais/`, `item-parcial-anexos/`, `item-parcial-observacoes/` | ciclo de vida da parcial: receber, iniciar, mover, concluir, pausar, reprovar, retrabalho, split, devolver, atender estoque | E3, E4, F1, Q7 |
| Estoque | `estoque/` (`estoque.controller` = depósitos, `materiais/`, `operacao/`, `etiquetas/`, `alertas/`, `produtos-avhub/`) | depósitos e localizações, materiais, saldo, lotes, movimentos, reservas, etiqueta, alertas | E1, E3, E5 |
| Compras (lado MES) | `compras/` | requisição de compra do PCP, Compras · CCP (esperados, chegada, liberação), Recebimento (conferência, recontagem, decisão) | P3, C5, R0 a R6 |
| Qualidade | `qualidade/` | inspeção de entrada por lote (aprovar, reprovar, RNC) | Q1 a Q4 |
| Expedição | `entregas/`, `pedido-embalagens/`, `pedido-embalagem-pallets/`, `pedido-anexos/` | entrega, embalagem, paletes, anexos (canhoto, NF) | X1, X4 |
| Divergências | `divergencias/` | divergência de produção (abrir, analisar, resolver) | R6 (produção) |
| Integração av-hub | `integracao-avhub/` | rotas de serviço para o av-hub (`/requisicoes-compra`, `/itens/status`, `/itens/custo`), envio da requisição (LOG-34), leitura dos marcos (LOG-35), da referência da OC (API-004/007) e da referência da requisição do Hub (API-009) | P3, C1 a C5, R4 |
| Painéis | `dashboard/`, `relatorios/`, `pedidos-excluidos/` | início, TV, relatórios de tempo por setor e de compras, pedidos excluídos | — |

## Rotas por módulo e permissão

`telaSlug, ação` vem do `@RequirePermission` (ver [[RBAC-e-Permissoes]]). Todas exigem Bearer JWT, exceto as marcadas `público` ou `chave`. A lista inteira foi extraída dos controllers de `api-pcp/src` em 14/10 ✅.

### Auth, Auditoria, Saúde

| Rota | Permissão | Código |
|---|---|---|
| `GET /health` | público | ✅ `app.controller.ts:12` |
| `POST /auth/login` | público | ✅ `auth.controller.ts:21` |
| `POST /auth/azure` | `x-api-key` = `MES_INTERNAL_API_KEY` (só o BFF do app-pcp) | ✅ `auth.controller.ts:31`, `guards/api-key.guard.ts:15` |
| `GET /auth/me`, `/auth/menu`, `/auth/setores-permitidos` | só JWT | ✅ `auth.controller.ts:38-60` |
| `GET /auth/dashboard-check` | `dashboard`, visualizar | ✅ `auth.controller.ts:56-57` (`dashboard-check`) |
| `GET /auditoria/login`, `/auditoria/acesso` | `usuarios`, visualizar | ✅ `auditoria.controller.ts:18,24` |

### Pedidos (Triagem e Destinação) — P1, P2

| Rota | Permissão | Código |
|---|---|---|
| `GET /pedidos/carteira` | `carteira`, visualizar | ✅ `pedidos.controller.ts:102` |
| `POST /pedidos` | `ordens-producao`, criar | ✅ `:50` |
| `POST /pedidos/completo/lote` | `ordens-producao`, criar | ✅ `:58` |
| `GET /pedidos/consulta-omie/:numeroPedido`, `/unidades`, `/setor-estoque-fixo`, `/itens-existentes/:pedidoVenda` | `ordens-producao`, criar | ✅ `:70-112` |
| `GET /pedidos`, `/pedidos/:id`, `/:id/relatorio`, `/:id/imprimir` | `ordens-producao`, visualizar | ✅ `:121-141` |
| `PATCH /pedidos/:id` | `ordens-producao`, editar | ✅ `:152` |
| `DELETE /pedidos/:id` | `ordens-producao`, deletar (soft delete, grava em `pedidos_excluidos`) | ✅ `:162` |
| `GET /pedidos-excluidos`, `/pedidos-excluidos/:id` | `pedidos-excluidos`, visualizar | ✅ `pedidos-excluidos.controller.ts:22,28` |
| `/itens-pedido` (POST, GET, GET `:id`, GET `:id/rastreio`, PATCH `:id`, PATCH `:id/desativar`, DELETE `:id`) | `ordens-producao` (criar/editar → editar; ler → visualizar; DELETE → deletar) | ✅ `itens-pedido.controller.ts:33-75` |
| `/pedido-anexos`, `/pedido-embalagens`, `/pedido-embalagem-pallets` (CRUD) | `ordens-producao` (editar/visualizar/deletar) | ✅ controllers respectivos |
| `/roteiro-item` (CRUD) | `ordens-producao` (editar/visualizar) | ✅ `roteiro-item.controller.ts` |
| `GET /historico-itens-parciais`, `/:id` | `ordens-producao`, visualizar | ✅ `historico-itens-parciais.controller.ts:17,23` |

### Parciais (fila de setor) — E3, E4, F1, Q7, X1

Todas com `movimentacoes`, que no guard vale "qualquer tela de fila de setor" (`atendimento`, `requisicoes`, `pedidos-compra`, `logistica-entrada`, `expedicao`, `inspecao-saida`) ✅ `common/constants/telas-fila-setor.constants.ts:7-15` (`TELAS_FILA_SETOR`), `auth/guards/permissions.guard.ts:56-58`. Além disso o service confere o `PerfilSetor.podeAtuar` do setor atual (`PerfisService.ensurePodeAtuar`).

| Rota | Ação | Código |
|---|---|---|
| `GET /itens-parciais`, `/contagem-por-setor`, `/:id`, `/:id/setores-percorridos` | visualizar | ✅ `itens-parciais.controller.ts:57,67,94,143` |
| `POST /itens-parciais/lote/:acao` | editar | ✅ `:79` |
| `PATCH /:id/receber`, `/iniciar`, `/mover`, `/concluir`, `/pallets`, `/pausar`, `/reprovar`, `/resolver`, `/retrabalho`, `/retomar`, `/desfazer-recebimento`, `/consolidar`, `/atender-estoque` | editar | ✅ `:100-297` |
| `POST /:id/split`, `/:id/devolver` | editar | ✅ `:249,259` |
| `PATCH /:id/cancelar` | `ordens-producao`, deletar | ✅ `:275` |
| `/item-parcial-anexos`, `/item-parcial-observacoes` (CRUD) | `movimentacoes` editar/visualizar | ✅ controllers respectivos |
| `/divergencias` (POST, GET, GET `:id`, PATCH `:id`, PATCH `:id/resolver`) | `movimentacoes` | ✅ `divergencias.controller.ts:32-56` |
| `POST /entregas`, `GET /entregas`, `GET /entregas/:id` | `movimentacoes` editar/visualizar | ✅ `entregas.controller.ts:26-42` (`movimentacoes`) |

### Compras (lado MES) e Recebimento — P3, C5, R0 a R6

| Rota | Permissão | Código |
|---|---|---|
| `GET /compras/requisicoes` | `movimentacoes`, visualizar | ✅ `compras.controller.ts:31` |
| `GET /compras/requisicoes/produtos-avhub` | `movimentacoes`, editar | ✅ `:40` |
| `GET /compras/requisicoes/esperados` | `movimentacoes`, visualizar | ✅ `:48` |
| `POST /compras/requisicoes/sincronizar` | `movimentacoes`, visualizar | ✅ `:57` |
| `GET /compras/requisicoes/:id/eventos`, `/:id` | `movimentacoes`, visualizar | ✅ `:64,70` |
| `POST /compras/requisicoes` | `movimentacoes`, editar | ✅ `:76` |
| `POST /compras/requisicoes/:id/cancelar` | `movimentacoes`, editar | ✅ `:84` |
| `POST /compras/requisicoes/:id/chegada` | `movimentacoes`, editar; o service exige `pode_atuar` no setor Recebimento e NF (número ou chave) | ✅ `:96`, `compras.service.ts:356-401` |
| `POST /compras/requisicoes/:id/liberar-recebimento` | `movimentacoes`, editar; o service exige `compras-liberar` editar | ✅ `:108`, `compras.service.ts:404-445` |
| `GET /compras/recebimentos`, `/:id` | `movimentacoes`, visualizar | ✅ `recebimento.controller.ts:27,40` |
| `GET /compras/recebimentos/decisoes` | `decisoes-pcp`, visualizar | ✅ `:34` |
| `POST /compras/recebimentos`, `/:id/recontar` | `movimentacoes`, editar | ✅ `:46,52` |
| `POST /compras/recebimentos/:id/decidir` | `decisoes-pcp`, editar | ✅ `:62` |
| `GET /relatorios/compras`, `/relatorios/tempos-por-setor` | `relatorios`, visualizar | ✅ `relatorios.controller.ts:19,26` |

A rota `PATCH /compras/requisicoes/:id/compra` ("Registrar compra" manual) **não existe mais** ✅ (nenhuma ocorrência em `compras.controller.ts`).

### Estoque — E1, E3, E5

| Rota | Permissão | Código |
|---|---|---|
| `GET /estoque/saldo` | `saldo`, visualizar (inclui `custoUnitario` só com `estoque-custo` visualizar) | ✅ `estoque-operacao.controller.ts:40`, `estoque-operacao.service.ts:62-105` |
| `GET /estoque/saldo/disponivel-parcial/:idItemParcial` | `movimentacoes`, visualizar | ✅ `:46` |
| `GET /estoque/lotes/:id` | `saldo`, visualizar | ✅ `:73` |
| `GET /estoque/lotes/:id/etiqueta` | `saldo`, visualizar | ✅ `etiqueta.controller.ts:21` |
| `POST /estoque/lotes/carga-inicial` | `movimentacao`, criar (custo opcional: `estoque-custo` editar) | ✅ `:67`, `service:398-475` |
| `GET /estoque/unidades`, `/estoque/produtos-avhub` | `movimentacao`, criar | ✅ `:55,61` |
| `GET /estoque/movimentos` | `movimentacao`, visualizar | ✅ `:79` |
| `POST /estoque/movimentos` (TRANSFERENCIA ou AJUSTE) | `movimentacao`, criar | ✅ `:85` |
| `GET /estoque/reservas`; `PATCH /estoque/reservas/:id/liberar` | `reservas`, visualizar/editar | ✅ `:91,97` |
| `/estoque/depositos` (POST, GET, GET `unidades`, GET/PATCH/DELETE `:id`), `/:id/localizacoes` (POST, PATCH, DELETE) | `depositos` criar/visualizar/editar/deletar | ✅ `estoque.controller.ts:23-87` (`estoque/depositos`) |
| `GET/PATCH /estoque/materiais`, `/:id` | `materiais` visualizar/editar | ✅ `materiais.controller.ts:21-41` (`estoque/materiais`) |
| `GET /estoque/alertas/estoque-minimo`, `/rnc-pendentes` | `painel-estoque`, visualizar | ✅ `alertas.controller.ts:19,25` |

Observação: o controller usa o slug `movimentacao` (singular, ações do Estoque) e `movimentacoes` (plural, fila de setor). São duas telas diferentes em `telas` ✅ `estoque-operacao.controller.ts:55-85` x `itens-parciais.controller.ts:57`. Conferir se as duas existem em produção ❓.

### Qualidade — Q1 a Q4

| Rota | Permissão | Código |
|---|---|---|
| `GET /qualidade/lotes` | `inspecao-entrada`, visualizar | ✅ `qualidade.controller.ts:21` |
| `POST /qualidade/lotes/:id/aprovar`, `/:id/reprovar` | `inspecao-entrada`, editar | ✅ `:27,33` |

A Inspeção de saída (Q7) não tem controller próprio: é uma fila de setor tipo `QUALIDADE` (`/itens-parciais/:id/reprovar`).

### Cadastros de produção, RBAC, Painéis

`/fabricas`, `/maquinas`, `/operadores`, `/roteiros`, `/setores`, `/usuarios`, `/perfis`, `/telas`, `/usuarios-perfis`, `/dashboard`, `/dashboard/tv`: CRUD por tela com o mesmo slug do recurso (`fabricas`, `maquinas`, `operadores`, `roteiros`, `setores`, `usuarios`, `perfis`, `telas`, `dashboard`). Exceções ✅:
- `GET /setores`, `/setores/:id`, `/setores/:id/painel` sem `@RequirePermission` (só JWT) — `setores.controller.ts:42-53`.
- `PATCH /usuarios/:id/senha` sem `@RequirePermission` (a service decide) — `usuarios.controller.ts:63`.
- `POST /perfis/:id/permissoes/bulk`, `/setores/bulk`, `/depositos/bulk`, `/usuarios`: `perfis`, editar — `perfis.controller.ts:60-91` (`permissoes/bulk`).
- `GET /usuarios-perfis`: `usuarios-perfis`, visualizar — `usuarios-perfis.controller.ts:17`.

### Rotas de serviço para o av-hub (sem JWT)

| Rota | Auth | Uso | Código |
|---|---|---|---|
| `GET /requisicoes-compra` | `x-api-key` = `MES_API_KEY` (`AvhubApiKeyGuard`, fail-closed) | contrato 003 (legado, sem consumidor) | ✅ `integracao-avhub.controller.ts:20`, `avhub-api-key.guard.ts:14` |
| `GET /itens/status` | idem | contratos 005/006: job de 90 s do av-hub | ✅ `:26`; `integracao-avhub.service.ts:114-165` |
| `GET /itens/custo?alterado_desde=&apos_id=&codigo_empresa=&limit=` | idem | API-008 / LOG-47: custo real por filial + pedido + produto, sem impostos; só pedido do Omie e item que tem ou teve reserva no Estoque (fabricado fica de fora); janela de segurança de 180 s; só na `develop` (27/10, `6c11147`) | ✅ `integracao-avhub.controller.ts:29`, `itens-custo.ts:1-30` |

**Não existem no MES** ✅ (grep em `api-pcp/src` sem ocorrência de `fluxo/`): `GET /fluxo/eventos`, `GET /fluxo/itens/:id/(tempo)`, `GET /fluxo/sla-etapas` (Torre de Fluxo, LOG-46). O job da Torre do av-hub recebe 404 e espera 10 min ([[AV-Hub-API]], [[Rastreabilidade-e-Torre-de-Fluxo]]). Dono: Robert 🔴. O `GET /itens/custo` passou a existir em 27/10 (acima).

### Rotas novas de 15 a 28/10 (só na `develop`) ✅

| Rota | Permissão | O que faz | Código |
|---|---|---|---|
| `GET /compras/em-andamento` | `movimentacoes`, visualizar | compras em andamento por pedido (API-011 R1/R2) | ✅ `compra-em-andamento.controller.ts:16-17` |
| `GET /compras/requisicoes/:id/ocs` | `movimentacoes`, visualizar | OCs ligadas à requisição | ✅ `compras.controller.ts:66-67` |
| `POST /compras/requisicoes/op` | `movimentacoes`, editar | requisita a OP inteira | ✅ `:87-88` |
| `GET /compras/recebimentos/oc-esperadas` | `movimentacoes`, visualizar | itens de OC esperados no Recebimento, sem requisição | ✅ `recebimento.controller.ts:39-40` |
| `POST /compras/recebimentos/nf` | `movimentacoes`, editar | recebe com NF (várias OCs) | ✅ `:59-60` |
| `GET /estoque/saldo/disponivel-setor/:idSetor`, `GET /estoque/saldo/materia-prima/:idItemParcial` | `movimentacoes`, visualizar | saldo por setor; matéria-prima que cobre a parcial | ✅ `estoque-operacao.controller.ts:50-58` |
| `PUT /estoque/lotes/:id/custo` | `estoque-custo`, editar | custo manual do lote, com motivo e histórico (`lote_custo_historico`) | ✅ `:94-95` |
| `POST /itens-parciais/atender-estoque/lote` | `movimentacoes`, editar | atende a OP inteira pelo Estoque | ✅ `itens-parciais.controller.ts:88-89` |
| `PATCH /itens-parciais/:id/finalizar`, `/:id/reabrir` | `movimentacoes`, editar | status novo `FINALIZADO` (produção acabou, a peça espera no setor) | ✅ `:149-161` |
| `PATCH /itens-parciais/:id/aprovar-saida`, `/:id/receber-fabricado` | `movimentacoes`, editar | a inspeção de saída aprova o fabricado; o Estoque recebe e cria o lote `PRODUCAO` (LOG-53) | ✅ `:235-248`; `itens-parciais.service.ts:1267,1403` |
| `GET /pedidos/produtos-em-producao` | `produtos-em-producao`, visualizar | uma linha por split, com a etapa no roteiro | ✅ `pedidos.controller.ts:96-97` |
| `GET /pedidos/roteiros` | `montagem-roteiro`, visualizar | OPs destinadas esperando roteiro | ✅ `:102-103` |
| `GET /pedidos/:id/roteiro`, `PUT /pedidos/:id/roteiro`, `POST /pedidos/:id/devolver-destinacao` | `montagem-roteiro`, visualizar ou editar | montagem do roteiro, separada da Triagem (22/10); liberar o roteiro grava `roteiro_liberado_em` | ✅ `:176-196` |
| `GET /pedidos/requisicoes-hub/:pedidoVenda` | `ordens-producao`, criar | requisições do Compras (av-hub) para o pedido, vistas na Destinação (API-009) | ✅ `:117-118` |
| `GET /pedidos/:id/op` | `ordens-producao`, visualizar | PDF da OP (`ordem-producao-pdf.ts`) | ✅ `:162-163` |
| `GET /setores/:id/ordem-fila`, `PUT /setores/:id/ordem-fila` | `movimentacoes`, visualizar ou editar | ordem manual da fila do setor (`fila_setor_ordem`) | ✅ `setores.controller.ts:58-65` |
