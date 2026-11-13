---
tags: [sistemas, rbac, permissoes, mes, av-hub, seguranca]
criado: 2026-10-14
estado-em: 2026-11-13
status: vigente
dono: Gustavo (DBA)
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13; api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, app-pcp 4c11886, omie-elt-pipeline master 0593c9f, em 2026-11-10]
fontes: [api-pcp befd973 (develop), app-pcp 93f96de (develop), api-acos-vital 1654f65 (develop, 05/11), api-acos-vital 0384e89 (develop, 29/10), av-hub 758d5f0 (develop), Dump MES de 14/10, Dump Avhub de 14/10 e de 29/10, v1 AV-Hub-RBAC, Achado-Duplicacao-RBAC, PS-048, OQ-50, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# RBAC e permissões

**Em uma frase:** é o controle de quem pode ver e fazer o quê. Existem **dois sistemas de permissão separados**, um no MES e outro no av-hub, sem sincronização entre eles. Dono: Gustavo (DBA).

## Quem usa e para quê

- **Administrador:** cadastra usuários e perfis.
- **Qualquer usuário:** só vê as telas e faz as ações que o perfil permite.
- **Sistemas entre si:** usam chaves de serviço ([[Chaves-e-Autenticacao]]).
- **Quem decide fluxo (Nathan, Gustavo):** monta os perfis, como a Gerência de Compras.

## Como se encaixa no fluxo

- **MES:** permissão por tela e por setor. O Estoque ainda separa por depósito. Telas só de permissão: custo do lote, liberar recebimento sem OC e programar a fila.
- **av-hub:** permissão por tela e por rota. A liberação, a Torre de Fluxo e o custo por item têm a sua.
- **Compras:** a aprovação da OC acima de R$ 30 mil depende da permissão "aprovar" do av-hub (N14-21).
- **Comercial:** as rotas `/comercial/*` da API do Hub usam as permissões do av-hub e sempre exigem o token do usuário. A `api-comercial` de teste foi removida do av-hub em 06/11/2026 ([[API-Comercial]], histórico).
- Um perfil do MES não existe no av-hub e vice-versa. O usuário tem um cadastro em cada um ([[Schemas-Postgres]]).

## Regras que valem

- Rota sem mapa de permissão é negada por padrão.
- Basta **um** perfil do usuário permitir.
- No MES, ter a tela não basta: é preciso "pode atuar" no setor ou no depósito.
- No av-hub, o vendedor só vê pedidos e notas dos vendedores do seu escopo (`proprios`, `vinculados` ou `todos`).
- O que o usuário faz é sempre registrado em nome do token de login, nunca de um campo enviado.
- O menu da tela é só apresentação. Quem nega é o servidor.
- Dois acessos especiais no MES: o custo do lote e a liberação de recebimento sem OC.
- A tela de custo por item do av-hub nasce sem permissão para nenhum perfil (decisão de 13/10).

## O que já existe e o que falta

- ✅ Regras do MES e do av-hub, com checagem na tela, no BFF e na API.
- ✅ Aprovação da OC com uma permissão só, sem segunda alçada nem Diretoria. 🟡 Endurece depois da conversa com Compras.
- 🟡 A Gerência de Compras ainda não tem usuários vinculados (tarefa de cadastro, Nathan e Gustavo).
- ❓ Perfil CCP no MES (N14-24): criado pelo Nathan em 30/10/2026 (cadastro, não conferido no ambiente real; BL-017). Não existe no MES de teste: na validação local em Docker de 10/11/2026 o banco de teste do MES (dado do tst) tinha um perfil só, Administrador, com todos os usuários. A `develop` do `api-pcp` não cria o perfil (é cadastro). As rotas de Compras · CCP do `api-pcp` continuam exigindo só a permissão `movimentacoes`, e o CCP agora também registra chegada.
- 🟡 No av-hub de teste (dado do tst, validação local em Docker de 10/11/2026), o perfil Gerência Geral e Diretoria tem 12 de 22 telas sem "Visualizar", entre elas `liberacao-equipe` (o gerente recebe 403 na Liberação da Equipe), `simulador`, `comissoes`, `minhas-comissoes`, `parametros` e `visao-geral` (PS-048, em [[Pontas-Soltas]]). Se é de propósito é a OQ-50 ([[Perguntas-Proposta-Pedido-Comissao]]). A mudança de permissão na tela vale na hora, sem novo login.
- No mesmo banco de teste, as 10 permissões que o perfil de testes `Admin (Dev)` tem a mais que as telas visíveis são de telas inativas (`sem-cadastro`, `vinculos`, `notas-fiscais-saida`, `pedidos-de-venda`, `categorias`, `historico-produtos`, `comercial`, `suprimentos`, `sincronizacao-omie`, `api-docs`): não é acesso escondido.
- 🟡 Alinhar os perfis das duas permissões de custo: `estoque-custo` (MES) e `custo-itens` (av-hub).
- 🔴 Permissão do documento de retirada (`E6`): a tela e a rota também não existem.
- ✅ Chaves de serviço do banco podem ser presas às rotas que usam (migration 051, `modo_rotas` `livre`, `registrar` ou `exigir`, tabelas `auth.chaves_servico_rotas` e `chaves_servico_uso`). O modo de cada chave em produção ❓ Gustavo.
- 🔴 Chave do MES com acesso mínimo ao av-hub (hoje lê e escreve). Gustavo.
- ❓ As linhas de `auth.rotas_telas` das rotas novas e o que existe em produção. Gustavo.
- ❓ O cadastro das telas `movimentacao` e `movimentacoes` e o do `compras-liberar` (a seed não está nos repositórios).

## Detalhe técnico

São **dois RBACs separados**, em dois bancos, sem sincronização: o do MES (`api-pcp`, schema `public`) e o do av-hub (`api-acos-vital`, schema `auth`). Um perfil do MES não existe no av-hub e vice-versa; o usuário tem um cadastro em cada um. Isso não é contradição: ver [[Schemas-Postgres]]. Chaves de serviço entre sistemas: [[Chaves-e-Autenticacao]]. Selos: [[Regras-do-Vault]].

### 1. RBAC do MES

#### Modelo ✅ ([[Banco-MES]])

| Tabela | Chave | Colunas que decidem |
|---|---|---|
| `telas` | `slug` único | `nome`, `ordem`, `ativo`, `id_parent` (árvore do menu) |
| `perfis` | `nome` único | — |
| `permissoes` | `(id_perfil, id_tela)` único | `pode_visualizar`, `pode_criar`, `pode_editar`, `pode_deletar` (4 flags, default `false`) |
| `usuarios_perfis` | `(id_usuario, id_perfil)` | um usuário tem vários perfis |
| `perfil_setores` | `(id_perfil, id_setor)` | `pode_visualizar`, `pode_atuar` |
| `perfil_depositos` | `(id_perfil, id_deposito)` | `pode_visualizar`, `pode_atuar` |

Dump MES `:1046-1113`, `:1396-1440` ✅.

#### Regras no código

- **Guard global.** `JwtAuthGuard` e depois `PermissionsGuard` são `APP_GUARD`. Rota sem `@Public()` exige Bearer; rota com `@RequirePermission(slug, ação)` confere a permissão ✅ `api-pcp/src/app.module.ts:85-86` (`APP_GUARD`), `auth/guards/permissions.guard.ts:33-80`. Rota **sem** `@RequirePermission` só exige JWT (ex.: `GET /setores`, `PATCH /usuarios/:id/senha`).
- **OR entre perfis.** Basta **um** perfil do usuário permitir ✅ `permissions.guard.ts:56-70`; mesma regra em `PerfisService.temPermissao` ✅ `rbac/perfis/perfis.service.ts:332-345` (`async temPermissao(`).
- **`movimentacoes` é virtual.** Vale "qualquer tela de fila de setor": `movimentacoes`, `atendimento`, `requisicoes`, `pedidos-compra`, `logistica-entrada`, `expedicao`, `inspecao-saida` ✅ `common/constants/telas-fila-setor.constants.ts:7-15` (`TELAS_FILA_SETOR`). É o `@RequirePermission('movimentacoes', …)` das rotas de parcial, compras, entregas e divergências.
- **Limite real por setor.** Mesmo com a tela, o service chama `PerfisService.ensurePodeAtuar(userId, idSetor)`: só age quem tem `perfil_setores.pode_atuar` no setor atual da parcial ✅ `perfis.service.ts:278`; `compras.service.ts:356-401` exige `pode_atuar` no **Recebimento** para registrar a chegada.
- **Limite real por depósito.** `ensurePodeAtuarDepositos` (carga inicial, movimento, reserva) e `depositosVisiveis` (Saldo só mostra os depósitos que o perfil vê) ✅ `estoque-operacao.service.ts:62-66,401`.
- **Permissão que muda o conteúdo.** `temPermissao(userId, slug, campo)` decide o que vai na resposta, não a rota: `estoque-custo` e `compras-liberar` ✅ abaixo.
- **Front.** O menu da sessão (`GET /auth/menu`) leva as 4 flags por tela; `usePermission()` usa o último segmento da URL como slug ✅ `app-pcp/hooks/usePermission.ts:8-17`, `lib/permissions.ts:3`. O front esconde botões; quem garante é a API.

#### Telas só de permissão (sem página nem menu) ✅

| Slug | Flag | Efeito | Código |
|---|---|---|---|
| `estoque-custo` | `pode_visualizar` | `GET /estoque/saldo` e `GET /estoque/lotes/:id` incluem o custo do lote (`custoUnitario`, bloco `custo`) | ✅ `estoque-operacao.service.ts:67,546`; `app-pcp/…/saldo/page.tsx:36` |
| `estoque-custo` | `pode_editar` | `POST /estoque/lotes/carga-inicial` aceita `custoUnitario` (sem a flag, 403 "Sem permissão para informar o custo do lote") | ✅ `api-pcp` `src/estoque/operacao/estoque-operacao.service.ts:634-640` (`Sem permissão para informar o custo do lote`); `EntradaLoteModal.tsx:36` |
| `compras-liberar` | `pode_editar` | `POST /compras/requisicoes/:id/liberar-recebimento` (rede de segurança: esperados do Recebimento sem OC aprovada, com motivo obrigatório) | ✅ `compras.service.ts:404-409`; `fila/CartaoItemParcial.tsx:227` (`liberarModal`) |

Terceira tela só de permissão, desde 26/10: `programar-fila` (`editar` muda a ordem de qualquer fila de fabricação, inclusive nos setores travados para o PCP; o líder com "pode atuar" só muda onde o setor não é travado; vale só para setor produtivo) ✅ `api-pcp/src/setores/fila-ordem.service.ts:13,84`.

Seeds: `estoque-custo` nasce "default-deny, só o Administrador" ✅ `api-pcp` `src/common/constants/estoque-custo.constants.ts:3` (`TELA_CUSTO_LOTE = 'estoque-custo'`) é a tela; o seed "default-deny, só o Administrador" ❓ não achado na develop de 10/11 nem na de 12/11; `compras-liberar` entra por `01-base.sql`, que **não está nos repositórios** ❓ Robert. A lista de telas só de permissão: `app-pcp/lib/telasSoPermissao.ts:10`.

#### Slugs do MES (extraídos dos controllers) ✅

| Slug | Quem usa | Ações |
|---|---|---|
| `dashboard` | `/dashboard`, `/auth/dashboard-check` | visualizar |
| `carteira` | Triagem do Pedido | visualizar |
| `ordens-producao` | Destinação, Acompanhamento, itens, anexos, embalagens, paletes, roteiro-item, histórico, PDF da OP | criar (Destinação), editar, visualizar, deletar (cancelar parcial, excluir) |
| `montagem-roteiro` | Montagem do Roteiro (`/pedidos/roteiros`, `/pedidos/:id/roteiro`, `devolver-destinacao`) | visualizar, editar |
| `produtos-em-producao` | Produtos em Produção (`/pedidos/produtos-em-producao`) | visualizar |
| `pedidos-excluidos` | pedidos excluídos | visualizar |
| `movimentacoes` (virtual) | parciais, entregas, divergências, anexos e observações de parcial, `/compras/requisicoes/*`, `/compras/recebimentos` (ler, conferir, recontar), `/estoque/saldo/disponivel-parcial/:id` | visualizar, editar |
| `atendimento`, `requisicoes`, `pedidos-compra`, `logistica-entrada`, `expedicao`, `inspecao-saida` | telas de módulo (fila de setor) | as quatro flags, via `movimentacoes` |
| `decisoes-pcp` | Divergências de Recebimento | visualizar (lista), editar (decidir) |
| `inspecao-entrada` | Qualidade de entrada | visualizar, editar (aprovar, reprovar) |
| `saldo`, `reservas`, `movimentacao`, `depositos`, `materiais`, `painel-estoque` | Estoque | conforme tabela de rotas em [[MES-Backend]] |
| `fabricas`, `maquinas`, `operadores`, `roteiros`, `setores` | cadastros de produção | criar, editar, visualizar, deletar (🟡 `roteiros`: ver abaixo) |
| `usuarios`, `perfis`, `telas`, `usuarios-perfis` | acessos | idem |
| `relatorios` | relatórios | visualizar |
| `estoque-custo`, `compras-liberar`, `programar-fila` | só permissão | ver acima |

**Reteste no Docker de 13/11 (MES, develop de 12/11)** 🟡:
- `GET /setores`, `/setores/:id` e `/setores/:id/painel` só exigem login, sem `@RequirePermission` ✅ `api-pcp` `src/setores/setores.controller.ts:41-54` (`@Get(':id/painel')`). As duas primeiras já eram assim de propósito (o BFF filtra); o painel, não: um perfil sem permissão nenhuma recebe a fila do setor com pedido, cliente, prazo, prioridade e as últimas observações.
- O escopo por setor e por depósito só vale quando a consulta filtra o setor ou o depósito: sem filtro, um perfil sem setores vê todas as parciais, reservas, lotes e o saldo futuro ✅ `src/itens-parciais/itens-parciais.service.ts:100-101` (`PerfilSetor.podeVisualizar só é checado quando a consulta filtra um setor`).
- A tela `roteiros` da tabela acima não existe na tabela `telas` do MES de teste, e o CRUD `/roteiros` exige essa tela: até o Administrador recebe 403 ✅ `src/roteiros/roteiros.controller.ts:24` (`@RequirePermission('roteiros', 'editar')`). O app não usa essas rotas: a Montagem do Roteiro usa `/pedidos/roteiros` e `/pedidos/:id/roteiro`. ❓ A decidir (Robert): criar a tela ou tirar o CRUD.

`movimentacao` (singular, ajuste e carga inicial) e `movimentacoes` (plural, fila) são telas distintas ✅ `estoque-operacao.controller.ts:63-93` e `itens-parciais.controller.ts:57`; conferir o cadastro de ambas em produção ❓.

#### Autenticação do MES

- Login por usuário e senha com `bcrypt`; bloqueio por tentativas: 5 por usuário e 20 por IP em 15 min ✅ `auth/auth.service.ts:8-15,218-232`. Token com `JWT_EXPIRES_IN` (padrão `8h`) ✅ `auth.module.ts:19`.
- Azure AD: o app-pcp valida com o Azure e chama `POST /auth/azure` com `x-api-key: MES_INTERNAL_API_KEY`; o MES **resolve** o e-mail para um usuário já cadastrado (não cria conta) ✅ `auth.service.ts:68`, `api-key.guard.ts:15`.
- Auditoria: `auditoria_login` e `auditoria_acesso` ✅ dump `:465-492`.

### 2. RBAC do av-hub

#### Modelo ✅ ([[Banco-AvHub]], schema `auth`)

| Tabela | Papel |
|---|---|
| `auth.telas` | `slug` (único), `nome`, `id_parent`, `ordem`, `ativo` |
| `auth.perfis` | `nome`, `tela_inicial_id`, **`escopo_vendedores`** (`proprios`, `vinculados`, `todos`; padrão `vinculados`) |
| `auth.permissoes` | `(id_perfil, id_tela)` com `pode_visualizar`, `pode_criar`, `pode_editar`, `pode_deletar`, **`pode_aprovar`** |
| `auth.usuarios`, `usuarios_perfis`, `usuarios_unidades` | usuário, vínculo com perfis, unidades do usuário |
| **`auth.rotas_telas`** | mapa **rota → tela + ação**: `metodo`, `rota` (com curingas), `slug_tela`, `acao` (se nula, deriva do método: GET visualizar, POST criar, DELETE deletar, demais editar), `escopo_vendedor`, `ativo`, `origem` |
| `auth.rotas_administrativas` | rotas que uma chave de escrita só abre com token de usuário |
| `auth.chaves_servico` | chaves de serviço no banco (`hash_sha256`, `acesso` leitura/escrita/admin, `exige_usuario`, `expira_em`, `revogada_em`) |
| `auth.ip_regras`, `logs`, `auditoria`, `login_tentativas`, `sessions`, `usuarios_favoritos` | apoio |

#### Como a API decide ✅

1. **Chave de serviço** (`x-api-key`): `API_KEYS` do `.env` (admin), chaves de `auth.chaves_servico` (com `modo_rotas`, migration 051), ou `MES_INTEGRACAO_KEYS` (só `PUT /compras/requisicoes/origem/:id` e, desde o LOG-58, `POST /integracao/mes/avisos-compra`; qualquer outra rota dá 403 `CHAVE_MES_ROTA_NAO_PERMITIDA`) ✅ `api-acos-vital` `src/middlewares/apiKeyAuth.js:110` (`metodo === "POST" && ROTA_MES_AVISOS.test(caminho)`). Confirmado no Docker em 13/11. O limite geral é de 5 000 requisições por minuto por chave.
2. **Token de usuário** (`Authorization: Bearer`): `identidadeUsuario` valida o token e chama `auth.fn_autorizar(usuario, versão, método, caminho)` ✅ `middlewares/identidadeUsuario.js:40-100`. A função devolve 401 `usuario_invalido` ou `token_revogado`; 403 `rota_sem_mapa` (rota sem linha em `auth.rotas_telas`: **fail-closed**) ou 403 `sem_permissao` (com a lista `exige_uma_de`); 200 com o escopo de vendedores. A permissão é **OR entre perfis** do usuário ✅ dump `fn_autorizar` `:357` (join `usuarios_perfis → perfis → permissoes → telas`).
3. **Identidade passa a ser a do token.** `id_usuario_sessao` na query e os campos `created_by`, `updated_by`, `deleted_by`, `aprovado_por`, `decidido_por`, `cancelado_por` do corpo são **sobrescritos** pelo id do token ✅ `identidadeUsuario.js:29-37`.
4. **Sem token:** chave de `.env` e chave do MES seguem sem identidade (o MES e a pipeline não são usuários). Chave com `exige_usuario` recebe 401 `TOKEN_USUARIO_AUSENTE` ✅ `:63-69`.
5. **Escopo de vendedor** (contrato 40): perfil que não é `todos` só vê pedidos e notas dos vendedores do usuário (`escopoVendedor.js`); **escopo de unidade** (`auth.usuarios_unidades`) e de setor (`escopoUnidade.js`, `escopoSetor.js`) ✅. Desde o `1654f65` (LOG-50), "sem vínculo" olha os vínculos de **todas** as unidades: quem não tem vínculo em nenhuma recebe 403 `SEM_VENDEDOR_VINCULADO`; quem só tem vínculo em outra unidade recebe 403 `PEDIDO_FORA_DO_ESCOPO` no detalhe de pedido e 403 `VENDEDOR_FORA_DO_ESCOPO` na lista ✅ `api-acos-vital` `src/middlewares/escopoVendedor.js`, `develop` `1654f65`.
6. **BFF.** `requirePermission(slug, ação)` do HUB lê `GET /me/permissoes` (ao vivo, cache 5 s) e responde 401 sem o token do usuário, 503 se `/me/permissoes` falhar e 403 se a tela não estiver em `auth.telas`: o menu do JWT é só apresentação e não autoriza nada ✅ `av-hub/lib/api/requirePermission.ts`. Por isso o BFF nega **antes** de chegar à API, e a API nega de novo pelo mapa.
7. Rotas fora do mapa de permissão: `ROTAS_SEM_PERMISSAO_DE_TELA` em `utils/acessoConfig.js` ✅.

Dados em `auth.rotas_telas` e `auth.telas`: **o dump é só esqueleto** (sem `COPY`/`INSERT`), então quais linhas existem em produção ❓ Gustavo (`auth.vw_rotas_telas_conferencia` ajuda a conferir).

#### Permissões do av-hub que o fluxo de Atividades usa

| Tela (slug) | Ação | Quem decide | Efeito | Código |
|---|---|---|---|---|
| `liberar-pedidos` | `pode_visualizar`, `pode_editar` | BFF + mapa | lista e libera os próprios pedidos (V2, V3) | ✅ `HUB app/api/liberar-pedidos/[codigoEmpresa]/[numeroPedido]/route.ts:19` |
| `liberacao-equipe` | `pode_visualizar` | BFF | caixa da equipe | ✅ `app/api/liberar-pedidos/route.ts:31-36` |
| **`compras`** | **`pode_criar`** | BFF (`requirePermission('compras','pode_criar')`) e tela | **"Nova requisição"** (`POST /compras/requisicoes`, C0) e **emitir OC** (`POST /compras/ordens`, C4); também o botão "Gerar OC" | ✅ `HUB app/api/compras/requisicoes/route.ts:80`, `app/api/compras/ordens/route.ts:113`, `components/Compras/ComprasRequisicoes.tsx:94,186` |
| `compras` | `pode_editar` | BFF e API | mudar status da requisição (cotação, cancelar com motivo); **reenviar OC ao Omie** | ✅ `app/api/compras/requisicoes/[id]/route.ts:32`, `api-acos-vital` `src/schemas/core_vendas_faturamento/tables/ordens_compra/ordens_compra.route.js:1420` (`"compras", "pode_editar"`) |
| **`compras`** | **`pode_aprovar`** | BFF **e** API (regra fixa `EXIGIR_PODE_APROVAR = true`) | **aprovar e cancelar OC** que excede o limite (R$ 30 mil por padrão; perfil Gerência de Compras); até o limite a OC é liberada sem aprovação (N14-21) | ✅ `HUB app/api/compras/ordens/[id]/route.ts:35`, `ordens_compra.route.js:39-43,1232` |
| `compras` | `pode_visualizar` | BFF | listas, detalhes, catálogos de apoio | ✅ `app/api/compras/**` |
| `followup` | `pode_visualizar`, `pode_editar`, `pode_aprovar` | BFF e API | ler a fila do CCP; gravar confirmação, previsão, despacho, contato, ocorrência; **decidir ocorrência** (precisa também ser o comprador da OC ou admin) | ✅ `HUB app/api/compras/ocorrencias/[id]/route.ts:13`, `api-acos-vital …/ordens_compra_acompanhamento.route.js:154`, `utils/acessoConfig.js` |
| `compradores` | `pode_visualizar`, `pode_editar` | BFF e API | vínculo comprador × funcionário; só quem é comprador vinculado na unidade emite OC (regra fixa, `BLOQUEAR_SEM_COMPRADOR = true`) | ✅ `compradores.route.js:210`, `ordens_compra.route.js:36` |
| **`custo-itens`** | `pode_visualizar` | **API, sempre** (também sem token) e BFF | `GET /itens_pedido_custo` e a tela `/orcamento/custo-itens`; **nasce sem permissão para nenhum perfil** (decisão de 13/10) | ✅ `itens_pedido_custo.route.js:41-48,76-85`; `av-hub app/api/custo-itens/route.ts:10` |
| **`torre-fluxo`** | visualizar | mapa (migration 046/046b) e BFF | `GET /fluxo/torre`, `/fluxo/sla-etapas`, `/fluxo/itens/:id/tempo`; telas `/torre-fluxo` | ✅ `item_estado_projetado.route.js:16-25`; `av-hub app/api/fluxo/torre/route.ts:18` |
| **`torre-fluxo-trilha`** | visualizar | mapa e BFF | `GET /fluxo/itens/:id` (mostra nomes de pessoas); 046b concede só ao perfil de testes do time de TI (nenhum perfil de negócio) | ✅ idem; `av-hub app/api/fluxo/itens/[id]/route.ts:13` |
| `pcp-pedidos`, `pcp-notas`, `pcp-dashboard` | visualizar (+criar e deletar nas observações) | BFF | portal PCP do av-hub (leitura) | ✅ `HUB app/api/pcp/**` |
| `meus-pedidos`, `pedidos-equipe` | visualizar | BFF | card "Etapa dos itens" | ✅ `HUB lib/api/pedidosVenda.ts` |

#### Slugs do Comercial

As 21 telas do módulo (`propostas`, `propostas-delegacao`, `propostas-valores`, `custo-item` (singular, ≠ `custo-itens`), `relatorio-gerencial`, `painel-comprador`, `clientes`, `solicitacoes-custo`, `ofertas-fornecedor`, `pedido-cotacao`, `catalogo-produtos`, `fornecedores`, `historico-compras`, `parametros-custo`, `tabela-telha`, `sincronizacao-omie`, `matriz-precos`, `pesquisa-materiais`, `relatorio-cotacoes`, `dash-comercial`, `empresas-emissoras`) ✅ `api-acos-vital/src/schemas/core_comercial/capacidades.js:20-26`. As capacidades (`escopo` por `escopo_vendedores` do perfil, `ve_valores`, `ve_custo`, `pode_delegar`, `comprador`…) saem das telas do usuário em `auth.fn_me_permissoes`, não do cargo comercial; `GET /comercial/me` devolve esse mapa. A `api-comercial` de teste lia `GET /me/permissoes` do av-hub; ela foi removida em 06/11/2026 ([[API-Comercial]], histórico). Toda rota `/comercial/*` e `/suprimentos/*` exige o token do usuário (401 `TOKEN_USUARIO_AUSENTE` mesmo com `x-api-key` válida) ✅ `middlewares/exigirTokenUsuario.js`. No BFF do av-hub cada rota da lista tem tela e ação ✅ `app/api/comercial/[...rota]/route.ts`. Em 05/11 entraram `POST /comercial/propostas/:id/transformar` e `POST /comercial/pedidos/:id/enviar-omie`, ambas declaradas com `propostas:pode_editar`, e `GET /comercial/produtos`, com `propostas:pode_visualizar` (`api-acos-vital` `pedidos.route.js:14`, `produtos.route.js`, `develop` `1654f65`). ❓ Não conferi se `auth.rotas_telas` tem linha para as rotas novas: com Bearer, rota sem linha dá 403 `ROTA_SEM_PERMISSAO_MAPEADA` ([[Chaves-e-Autenticacao]]), e o BFF ainda não as lista.

### 3. Lacunas e decisões abertas

| Item | Estado |
|---|---|
| Aprovação da OC (N14-21, 14/10): acima de R$ 30 mil, Gerente de Compras; até R$ 30 mil, compradores livres; sem Diretoria | ✅ Uma permissão (`compras.pode_aprovar`); até o limite o banco aprova sozinho e acima dele só a Gerência decide ([[AV-Hub-API]]). Não há segunda alçada nem papel Diretoria. 🟡 A regra endurece depois da conversa com Compras. A Gerência de Compras ainda não tem usuários vinculados (tarefa cadastral, Nathan e Gustavo) |
| Perfil CCP no MES (C5) | ❓ Perfil criado pelo Nathan em 30/10/2026 (BL-017; cadastro, não conferido no ambiente real). Não existe no MES de teste de 10/11/2026, que só tem o perfil Administrador (dado do tst). As rotas de Compras · CCP exigem só `movimentacoes`, então quem edita depende das permissões dadas ao perfil (N14-24) |
| Gerência Geral e Diretoria sem "Visualizar" em 12 de 22 telas no tst (inclui `liberacao-equipe` e `simulador`) | 🟡 PS-048; ❓ OQ-50: é de propósito? |
| Permissão do documento de retirada (E6) | 🔴 não existe (a tela e a rota também não) |
| Quem vê custo no MES e no av-hub | duas permissões distintas: `estoque-custo` (MES, custo do lote) e `custo-itens` (av-hub, custo do pedido) 🟡 alinhar perfis |
| Chave própria do MES com escopo mínimo para ler o av-hub (hoje `API_KEY` de leitura e escrita) | 🔴 Gustavo ([[Chaves-e-Autenticacao]]) |
| Linhas de `auth.rotas_telas` das rotas novas (`/fluxo/*`, `/itens_pedido_custo`, `/compras/requisicoes/eventos`, `/compras/requisicoes/referencia`, `/comercial/*`) e as 21 telas do módulo comercial em `auth.telas` | ❓ Gustavo |
| Duplicação de RBAC entre MES e av-hub (achado antigo) | por decisão cada sistema mantém o seu; o av-hub é a fonte dos perfis comerciais ([[Registro-de-Decisoes]]) |
