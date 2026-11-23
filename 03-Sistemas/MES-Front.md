---
tags: [sistemas, mes, app-pcp, nextjs, frontend]
criado: 2026-10-14
estado-em: 2026-11-23
status: vigente
dono: Robert (Estoque: Nathan, N16-180)
develop-conferida: [app-pcp 8259344, em 2026-11-23 (Estoque e visual do Hub, PRs #70 a #82); api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [app-pcp 8259344 (develop, 23/11), N16-180 a N16-184, N16-192, app-pcp 93f96de (develop, 27/10; a main parou em 08/10), api-pcp befd973, v1 App-PCP-Visao-Geral, App-PCP-Modelo-Producao, App-PCP-Recebimento-Conferencia]
---

# MES Front (`app-pcp`)

**Em uma frase:** é o site do MES (sistema de chão de fábrica), onde PCP, Estoque, Qualidade, Produção e Expedição fazem o trabalho do dia. Ele só conversa com a API do MES ([[MES-Backend]]). Dono: Robert; o Estoque é do Nathan desde 19/11 (N16-180). Desde 19/11 tem a casca e o tema do AV-Hub (N16-192).

## Quem usa e para quê

- **PCP:** tria os pedidos, define a Destinação e acompanha tudo.
- **Estoque:** atende as parciais, vê o estoque por material, lote ou endereço, movimenta, conta o inventário e acompanha pendências e painel.
- **Compras e Recebimento:** pedem compra, acompanham o CCP, recebem com nota e conferem.
- **Qualidade:** inspeciona a entrada e a saída.
- **Produção e Expedição:** trabalham a fila do setor, lançam pallets e confirmam a entrega.
- **Administradores:** cadastram setores, máquinas, usuários e perfis.

## Como se encaixa no fluxo

Cada etapa do fluxo tem a sua tela. A lista completa, por nó, está no Detalhe técnico e em [[Telas-por-Raia]].

- Triagem e Destinação do pedido (`P1`, `P2`), Montagem do Roteiro, Produtos em Produção e acompanhamento (`X1`).
- Atendimento do Estoque (`E1` a `E4`) e as outras 6 telas do Estoque por tarefa (N16-184).
- Requisição de compra (`P3`) e Compras · CCP (`C5`).
- Recebimento, divergências e inspeção de entrada (`R0` a `R6`, `Q1` a `Q4`).
- Filas de produção (`F1`), inspeção de saída (`Q7`, `Q8`) e Expedição (`X1` a `X4`).

## Regras que valem

- Quem não tem login vai para a tela de entrada.
- Cada tela confere a permissão do usuário. Quem garante de verdade é a API.
- O MES não tem a ação "aprovar". Só ver, criar, editar e excluir.
- Custo do lote só aparece com a permissão de custo. A carga inicial exige custo (N16-181).
- As ações do Estoque mandam uma chave de idempotência: clicar duas vezes não grava duas vezes.
- Filtros das telas do Estoque ficam na URL: o link abre a tela como estava.
- O botão "Liberar sem OC" exige a permissão de liberar compra.
- As filas só mostram os setores em que o perfil do usuário atua.
- A tela de Compras · CCP é só leitura.
- O Compras do av-hub usa outro conjunto de permissões.

## O que já existe e o que falta

- ✅ Todas as telas do fluxo acima, Estoque, cadastros e painéis.
- ✅ Telas novas de 20 a 27/10 (só na `develop`): Montagem do Roteiro, Produtos em Produção, fila de Recebimento redesenhada, fila de fabricação por OP, ordem da fila, finalizar produção, aprovar saída e receber fabricado (LOG-53).
- ✅ Estoque reorganizado (19 a 23/11, só na `develop`): Pendências, Atender pedidos (com Reservas), Movimentar, Estoque (por material, lote ou endereço) com a página do Material e do Lote, Movimentos (com o Kardex), Inventário e Painel com dados reais; as URLs antigas (Mapa do Depósito, Reservas) redirecionam ✅ `app-pcp` `app/(protected)/estoque-operacao/mapa-deposito/page.tsx:6` (`redirect('/estoque-operacao/saldo?visao=endereco')`).
- ✅ Visual do Hub (N16-192): cabeçalho com trilha pelo menu, luz de fundo no escuro, largura 1680, cartões translúcidos, peças `Alternar` e `BuscaSelecao` ✅ `components/Layout/PageLayout/PageHeader/PageHeader.tsx`, `components/Ui/BuscaSelecao/BuscaSelecao.tsx`. As telas dos outros setores mudam só pela casca comum.
- 🟡 Telas novas do Estoque (`pendencias`, `movimentar`, `inventario`, `inventario-aprovar`) ainda sem cadastro em Acessos no tst e na produção (PS-060).
- 🔴 Não há tela de Torre de Fluxo.
- 🔴 Não há tela de documento de retirada (`E6`).
- 🔴 Não há tela do `P6` (Novo norte).
- 🟡 Em Compras · CCP a atualização leva até 5 minutos, ou vale o botão "Atualizar".
- 🟡 Reteste no Docker de 13/11 (43 telas abertas): `/ordens-producao/<id inválido>` fica em "Carregando..." para sempre, sem mensagem, porque a tela só sai do carregando quando acha o pedido ✅ `app-pcp` `app/(protected)/ordens-producao/[id]/page.tsx:502-505` (`loading || !pedido`); a Montagem do Roteiro e o Lote tratam o caso. A fila de um setor que não existe (`/movimentacoes/<id>`) aparece vazia ("Nenhum item na fila deste setor") em vez de "setor não encontrado".
- ❓ O nome interno de três telas (Permissões, Setores por Perfil e Depósitos por Perfil) não foi conferido no cadastro. O Mapa do Depósito virou só permissão (`mapa-deposito`, junto com `reservas`) ✅ `lib/telasSoPermissao.ts:20` (`'mapa-deposito'`).

## Detalhe técnico

Front do MES. Next.js 16.3 (App Router) com React 19, MUI 9 e NextAuth 4 (✅ `app-pcp/package.json`). A `main` recebeu a `develop` em 17 e 18/11 (#67, #69); o Estoque de 19/11 em diante está só na `develop`. Fala só com o `api-pcp` ([[MES-Backend]]), por um BFF fino em `app/api/**` que repassa o Bearer do usuário (`session.accessToken`). Dono: Robert. Selos: [[Regras-do-Vault]].

### Como funciona

- **Login:** NextAuth com Azure AD ou usuário e senha. O Azure chama `POST /auth/azure` do `api-pcp` com `x-api-key: MES_INTERNAL_API_KEY`; a senha chama `POST /auth/login` ✅ `app-pcp` `app/api/auth/[...nextauth]/route.ts:54-60` (`/auth/azure`), `:112` (`/auth/login`). A sessão guarda `menu` (de `GET /auth/menu`) e `setoresPermitidos` (de `GET /auth/setores-permitidos`) ✅ `:21,37`.
- **Rotas protegidas:** `proxy.ts` (middleware NextAuth) barra tudo menos `/login`, `/api/auth` e estáticos ✅ `app-pcp` `proxy.ts:3-18` (`withAuth`).
- **Variável do BFF:** `API_URL` aponta para o `api-pcp` (não para o av-hub) ✅ `app/api/**`; mais `MES_INTERNAL_API_KEY` e `AZURE_AD_*`.
- **Permissão na tela:** `usePermission()` pega o último segmento da URL como slug da tela e consulta o menu da sessão ✅ `app-pcp` `hooks/usePermission.ts:8-17` (`usePermission`). Telas que abrem uma fila de setor passam `telaId` explícito. Ações: `pode_visualizar`, `pode_criar`, `pode_editar`, `pode_deletar` (o MES não tem `pode_aprovar`) ✅ `app-pcp` `lib/permissions.ts:3` (`pode_deletar`).
- **Telas "só de permissão":** `estoque-custo`, `compras-liberar`, `programar-fila`, `reservas` e `mapa-deposito` (as duas últimas desde 19/11, abas de outras telas) (26/10: muda a ordem de qualquer fila de fabricação, inclusive das travadas para o PCP) existem em `telas` para o perfil receber a flag, mas não têm página nem item de menu ✅ `lib/telasSoPermissao.ts:10`. Ver [[RBAC-e-Permissoes]].
- **Nomes antigos no código:** a UI já mostra os nomes novos (Triagem dos Pedidos, Destinação do Pedido, Acompanhamento dos Pedidos); as rotas e os arquivos mantêm `carteira`, `ordens-producao`, `ordens-producao/novo` ✅ títulos em `app/(protected)/{carteira,ordens-producao,ordens-producao/novo}/page.tsx`.

### Telas (todas em `app/(protected)/`)

A coluna "Slug" é o `telaId` que decide `pode_*` na tela. Nós do 0b: [[00-Fluxo-Mestre-0b]].

#### Fluxo de Atividades

| Tela (nome atual · antigo) | Rota | Slug | Nó | Chama (via BFF) | Código |
|---|---|---|---|---|---|
| Triagem dos Pedidos · Carteira | `/carteira` | `carteira` | P1 | `GET /pedidos/carteira` | ✅ `carteira/page.tsx`, `services/carteira.ts` |
| Destinação do Pedido · Nova Ordem de Produção | `/ordens-producao/novo` | `ordens-producao` (criar) | P2 | `GET /pedidos/consulta-omie/:n`, `POST /pedidos/completo/lote`, `GET /pedidos/requisicoes-hub/:pedidoVenda` (aviso das requisições do Compras no av-hub); o roteiro saiu desta tela em 22/10 | ✅ `ordens-producao/novo/page.tsx`, `components/Pcp/RequisicoesHubAviso.tsx` |
| Montagem do Roteiro | `/montagem-roteiro`, `/montagem-roteiro/[id]` | `montagem-roteiro` | P2 | `GET /pedidos/roteiros`, `GET`/`PUT /pedidos/:id/roteiro`, `POST /pedidos/:id/devolver-destinacao`; enquanto o roteiro não é liberado, o item só sai do Estoque para compra | ✅ `montagem-roteiro/page.tsx:106-107` |
| Produtos em Produção | `/produtos-em-producao` | `produtos-em-producao` | F1, X1 | `GET /pedidos/produtos-em-producao`: uma linha por split, onde o produto está no roteiro, com exportação em planilha | ✅ `produtos-em-producao/page.tsx:244-245` |
| Acompanhamento dos Pedidos · lista de Ordens de Produção | `/ordens-producao` e `/ordens-producao/[id]` | `ordens-producao` | P2, X1 | `GET /pedidos`, `/pedidos/:id`, embalagens, anexos, itens | ✅ `ordens-producao/page.tsx`, `[id]/page.tsx` |
| Atender pedidos (Estoque) | `/estoque-operacao/atendimento` | `atendimento` | E1 a E4 | fila própria do Estoque (`FilaEstoque`, 19/11); `PATCH /itens-parciais/:id/atender-estoque`, `POST /itens-parciais/atender-estoque/lote` (OP inteira); `GET /estoque/saldo/disponivel-parcial/:id`, `…/disponivel-setor/:id`, `…/materia-prima/:id`; no setor Estoque, `receber-fabricado` (LOG-53) | ✅ `estoque-operacao/atendimento/page.tsx:67` (`title="Atender pedidos"`) |
| Requisições de compras | `/compras/requisicoes` | `requisicoes` | P3 | fila de setor tipo `REQUISICAO`; `POST /compras/requisicoes` (modal `RequisitarCompraModal`) | ✅ `app-pcp` `compras/requisicoes/page.tsx:13` (`telaId="requisicoes"`) |
| Compras · CCP | `/compras/pedidos-compra` | `pedidos-compra` | C5 | fila de setor tipo `COMPRAS`, só leitura; `POST /compras/requisicoes/sincronizar`; `GET /compras/requisicoes/:id/eventos` (linha do tempo) | ✅ `compras/pedidos-compra/page.tsx:9-15`, `components/CompraCcpCard.tsx`, `EventosRequisicaoModal.tsx` |
| Recebimento | `/logistica/logistica-entrada` | `logistica-entrada` | R0 a R4 | fila tipo `LOGISTICA_ENTRADA` com "Entregas esperadas": `GET /compras/requisicoes/esperados`, `POST …/:id/chegada` ("Receber com NF"), `POST /compras/recebimentos`, `…/:id/recontar`; botão de liberar sem OC só com `compras-liberar` editar. Redesenhada em 26/10: `GET /compras/recebimentos/oc-esperadas` e `POST /compras/recebimentos/nf` (recebe por NF, com várias OCs) | ✅ `logistica/logistica-entrada/page.tsx`, `movimentacoes/components/FilaRecebimento.tsx`, `RecebimentoFila.tsx`, `ReceberComNfModal.tsx`, `ConferirNfModal.tsx` |
| Divergências de Recebimento | `/decisoes-pcp` | `decisoes-pcp` | R6 | `GET /compras/recebimentos/decisoes`, `POST …/:id/decidir` (aceitar ou reabrir) | ✅ `decisoes-pcp/page.tsx` |
| Inspeção de entrada | `/qualidade/inspecao-entrada` | `inspecao-entrada` | Q1 a Q4 | `GET /qualidade/lotes`, `POST /qualidade/lotes/:id/aprovar` e `/reprovar` | ✅ `qualidade/inspecao-entrada/page.tsx`; BFF `app/api/qualidade/[id]/{aprovar,reprovar}` |
| Filas de Produção (Movimentações) | `/movimentacoes`, `/movimentacoes/[setorId]` | `movimentacoes` | F1 | `/itens-parciais/*` (receber, iniciar, mover, concluir, pausar, reprovar, retrabalho, devolver, split, `finalizar`, `reabrir`); fila de fabricação por OP (`FilaFabricacao`, `FilaPorOp`) e ordem da fila (`GET`/`PUT /setores/:id/ordem-fila`) | ✅ `movimentacoes/[setorId]/page.tsx:16` |
| Inspeção de saída | `/qualidade/inspecao-saida` | `inspecao-saida` | Q7, Q8 | fila de setor tipo `QUALIDADE` (exceto `qualidade-entrada`); na fabricação, `PATCH /itens-parciais/:id/aprovar-saida` (`AprovarSaidaModal`) | ✅ `qualidade/inspecao-saida/page.tsx:14` |
| Expedição | `/logistica/expedicao` | `expedicao` | X1 a X4 | fila tipo `EXPEDICAO`; `POST /entregas`; embalagens e paletes | ✅ `logistica/expedicao/page.tsx:13` |

Todas as telas "módulo" (Requisições, Compras · CCP, Recebimento, Inspeção de saída, Expedição) usam o mesmo componente `ModuloSetores` + `FilaSetor`, que filtra os setores do tipo do módulo pelo `PerfilSetor` do usuário ✅ `movimentacoes/components/ModuloSetores.tsx:12-88`. Compras · CCP é só leitura: as ações da fila de um setor `COMPRAS` em decisão são apenas `requisitar-compra` (para ordem sem setor Requisições) e `devolver` ✅ `movimentacoes/acoes.ts:106-127`. Setor Recebimento: só `registrar-recebimento` (sem "Devolver" desde 14/10) ✅ `:126-128`.

#### Estoque

| Tela | Rota | Slug | Observação |
|---|---|---|---|
| Pendências | `/estoque-operacao/pendencias` | `pendencias` | o que o Estoque precisa fazer agora; cada grupo leva à tela que resolve ✅ `pendencias/page.tsx:70` (`title="Pendências"`) |
| Atender pedidos | `/estoque-operacao/atendimento` (aba Reservas: `?aba=reservas`) | `atendimento`; aba com `reservas` | fila própria do Estoque com Atender, Devolver, Receber e Enviar fabricado; KPIs e filtros na URL ✅ `atendimento/page.tsx:67` (`title="Atender pedidos"`), `atendimento/FilaEstoque.tsx` |
| Movimentar | `/estoque-operacao/movimentar` | `movimentar` | transferir, ajustar e carga inicial (custo obrigatório, só com `estoque-custo` editar) ✅ `movimentar/page.tsx:93` (`title="Movimentar"`), `saldo/EntradaLoteModal.tsx:155` (`A carga inicial exige o custo do lote`) |
| Estoque | `/estoque-operacao/saldo` (visões material, lote e endereço; o Mapa do Depósito redireciona) | `saldo` | custo só com `estoque-custo` visualizar; coluna "A chegar" das OCs de estoque ✅ `saldo/page.tsx:233` (`title="Estoque"`) |
| Material | `/estoque-operacao/saldo/material/[id]` | `saldo` | saldo do material por lote e endereço ✅ `saldo/material/[id]/page.tsx:66` (`title={d.material.descricao}`) |
| Lote | `/estoque-operacao/lotes/[id]` | `saldo` | rastreabilidade, linha do tempo, etiqueta; bloco `custo` só com `estoque-custo` visualizar ✅ `app-pcp` `estoque-operacao/lotes/[id]/page.tsx:219` (`lote.custo !== undefined`) |
| Movimentos | `/estoque-operacao/movimentacao` (aba Kardex: `/movimentacao/kardex`) | `movimentacao` | lista de movimentos e kardex com saldo corrido ✅ `movimentacao/page.tsx:172` (`title="Movimentos"`) |
| Inventário | `/estoque-operacao/inventario`, `/inventario/[id]` | `inventario`; aprovar com `inventario-aprovar` | contagem cega, recontagem e aprovação acima do limite ✅ `inventario/page.tsx:78` (`title="Inventário"`) |
| Painel do Estoque | `/estoque-operacao/painel-estoque` | `painel-estoque` | KPIs, gráfico e alertas reais (mínimo, RNC, custo a informar) ✅ `painel-estoque/page.tsx:242` (`title="Painel do Estoque"`) |
| Depósitos | `/cadastros/estoque/depositos` | `depositos` | depósitos e localizações |
| Materiais | `/cadastros/estoque/materiais` | `materiais` | natureza, peso teórico, tolerância, mínimos |

#### Cadastros e acessos

| Tela | Rota | Slug |
|---|---|---|
| Destinos (fábricas) | `/cadastros/operacional/fabricas` | `fabricas` |
| Setores | `/cadastros/operacional/setores` | `setores` |
| Máquinas | `/cadastros/operacional/maquinas` | `maquinas` |
| Operadores | `/cadastros/operacional/operadores` | `operadores` |
| Usuários | `/cadastros/acessos/usuarios` | `usuarios` |
| Perfis | `/cadastros/acessos/perfis` | `perfis` |
| Telas | `/cadastros/acessos/telas` | `telas` |
| Permissões | `/cadastros/acessos/permissoes` | `permissoes` ❓ (o endpoint usado é `/perfis/:id/permissoes/bulk`, slug `perfis`) |
| Usuários × Perfis | `/cadastros/acessos/usuarios-perfis` | `usuarios-perfis` |
| Setores por Perfil | `/cadastros/acessos/setores-perfil` | `setores-perfil` ❓ |
| Depósitos por Perfil | `/cadastros/acessos/depositos-perfil` | `depositos-perfil` ❓ |

#### Painéis

`/dashboard` (Início, "Resumo da produção agora"), `/relatorios` (tempo por setor, compras), `/pedidos-excluidos`, `/blank`, `/` ✅ títulos nas páginas. O BFF `app/api/compras/em-andamento/route.ts` repassa `GET /compras/em-andamento` (compras em andamento por pedido).

### Permissões que o front confere

| Onde | Regra | Código |
|---|---|---|
| Carga inicial (Movimentar) | exige custo; sem `estoque-custo` editar não dá carga | ✅ `saldo/EntradaLoteModal.tsx:155` (`A carga inicial exige o custo do lote`) |
| Saldo e Lote | coluna/bloco de custo só com `estoque-custo` visualizar | ✅ `lotes/[id]/page.tsx:219` (`lote.custo !== undefined`) |
| Fila de Recebimento | botão "Liberar sem OC" só com `compras-liberar` editar | ✅ `app-pcp` `movimentacoes/components/fila/useFilaSetor.ts:55` (`TELA_LIBERAR_RECEBIMENTO`) |
| Botões das filas | `PermissionButton` + `setoresPermitidos` da sessão (a garantia é o `PerfilSetor` no `api-pcp`) | ✅ `components/Ui/PermissionButton` |
| Rotas de ação (BFF) | `requirePermission(session, 'movimentacoes', 'pode_editar')` e equivalentes | ✅ `app/api/requisicoes-compra/[id]/chegada/route.ts:12` |

O Compras do av-hub (permissões `compras.pode_criar`, `compras.pode_aprovar`, `followup.*`) **não** existe aqui: é outro RBAC ([[RBAC-e-Permissoes]]).

### Diferenças e pontas soltas do front

- 🔴 Não há tela de Torre de Fluxo nem tela de documento de retirada (E6).
- 🔴 Não há tela de P6 (Novo norte).
- 🟡 Em Compras · CCP o front lê o MES, não o av-hub; a lista de esperados e a linha do tempo dependem do polling de 5 min ou do botão "Atualizar" (`POST /compras/requisicoes/sincronizar`, pulado se a leitura tem menos de 30 s) ✅ `services/comprasRequisicoes.ts:52`, `api-pcp/src/integracao-avhub/eventos-avhub.service.ts:25`.
- ❓ Slugs de `Permissões`, `Setores por Perfil` e `Depósitos por Perfil` dependem do cadastro em `telas` (o seed `01-base.sql` citado nos comentários não está nos repositórios).

Fluxograma por raia: [[Telas-por-Raia]].
