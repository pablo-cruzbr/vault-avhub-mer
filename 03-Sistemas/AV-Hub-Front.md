---
tags: [sistemas, av-hub, hub, nextjs, frontend, bff]
criado: 2026-10-14
estado-em: 2026-11-24
status: vigente
dono: Nathan
develop-conferida: [av-hub c4a455d, em 2026-11-24 (DEVOLVIDO, Provável, AGUARDANDO_APROVACAO e Visão Geral por pedido, PRs #337 e #339); av-hub 7f0f7e2, api-acos-vital ce4f90f, em 2026-11-23, comissões, proposta, busca de produto, cabeçalho, peças do Orçamento, avisos e comentários; av-hub 857d90e (versão do Next), em 2026-11-18; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [av-hub PRs #308, #312, #313, #316, #319, #321, #323, #327, #329, #331 a #336 (develop 7f0f7e2), N16-179, N16-185 a N16-192, LOG-61, PS-064, av-hub 758d5f0 (develop, 29/10; repositório `av-hub`, antes `00 - HUB`), api-acos-vital 0384e89, v1 AV-Hub-Arquitetura-BFF, AV-Hub-Modulos, AV-Hub-RBAC]
---

# AV-Hub Front (HUB)

**Em uma frase:** é o site do av-hub, com os portais do Vendedor, do Gerente, de Compras, do PCP (só leitura), de Comissões e de RH, mais Propostas e Orçamento. Dono: Nathan, também do Orçamento e das telas da comissão; as telas de Propostas são do Robert (N16-168, N16-169).

## Quem usa e para quê

- **Vendedor e auxiliar:** liberam pedidos e acompanham a etapa de cada item.
- **Gerente:** libera e acompanha os pedidos da equipe.
- **Compras:** criam requisição, cotam, emitem a OC (ordem de compra) e fazem o follow-up do CCP.
- **Gerência de Compras:** aprova a OC acima do limite.
- **PCP:** consulta pedidos e notas, sem alterar.

## Como se encaixa no fluxo

- **Vendas (`V1` a `V3`):** a tela Liberar Pedidos é o portão do fluxo.
- **Acompanhamento (`V1` a `O2`):** o card "Etapa dos itens" mostra onde cada item está na fábrica.
- **Compras (`C0` a `C5`):** requisição, cotação, aprovação, OC e follow-up.
- **Torre de Fluxo e custo por item:** as telas existem desde 15/10 (`/torre-fluxo` e `/orcamento/custo-itens`) sobre a API ([[AV-Hub-API]]). Elas só mostram dado quando o MES publicar (a Torre ainda não; o custo já está na `develop` do MES).

## Regras que valem

- O navegador só fala com o servidor do próprio site, que repassa à API.
- O servidor confere a permissão antes de chamar a API. O menu da sessão só serve de apresentação.
- Quem age (autor, aprovador) vem da sessão, nunca de um campo do formulário.
- O front não deve guardar regra de negócio. Onde ainda há, o código leva a marca `GAMBIARRA(` (9 ocorrências em 8 arquivos, 29/10).
- A "Nova requisição" do Compras não gera marco no MES. O MES a vê pela referência da requisição (API-009) e depois pela OC.
- Aprovar OC exige a permissão de aprovar. Até R$ 30 mil a OC sai liberada sem aprovação (N14-21).

## O que já existe e o que falta

- ✅ Liberação (vendedor e equipe), requisições, cotação, aprovação, OC, follow-up e compradores.
- ✅ Card "Etapa dos itens" com rótulo para as 11 etapas.
- ✅ Tela da Torre de Fluxo (LOG-46, BL-022, 15/10): mapa por setor, lista, trilha do item, tempo e ranking. Sem o feed do MES a tela mostra "indisponível" (fixtures só em desenvolvimento).
- ✅ Tela de custo real por item com simulador, sem imposto (LOG-47, BL-023, 15/10), em `/orcamento/custo-itens`.
- ✅ Excluir requisição de compra (contrato 55, 23/10).
- ✅ Propostas e Orçamento leem a API do Hub (`/api/comercial/*`, 27 a 29/10). A rota que ainda não foi migrada responde 503 `RECURSO_NAO_MIGRADO`.
- 🟡 Nenhuma tela lista os marcos da requisição. Quem os lê é o MES.
- ✅ O MES lê a OC da "Nova requisição" pela referência da OC (desde 15/10, `develop` do MES) e as requisições do Compras com pedido de venda (API-009, 23/10). Falta só a produção receber a `develop` do MES.
- 📝 Imposto por item decidido em 29/10 (N16-144); falta a tela: campos de imposto e selo de origem na emissão da OC, quando o desenvolvimento começar.
- 🟡 Endurecer a regra de aprovação quando Compras definir.
- ✅ O Orçamento antigo (JSON local) saiu em 16/10 (`c851cda`). As telas novas de Orçamento (Catálogo de produtos, Fornecedores, Painel do comprador, Custo dos itens) leem a API do Hub ([[02-Orcamento-Base-de-Preco]]). A tela Parâmetros de custo saiu (N16-179, PR #321): os valores mudam só por SQL.
- ✅ Busca rápida de produto no "Pedir cotação" (N16-191, PR #335): o BFF repassa `GET /produtos/busca` com a permissão `catalogo-produtos` (`av-hub` `app/api/comercial/[...rota]/route.ts:112` (`padrao: '/produtos/busca'`)).
- ✅ Um visual só (N16-192): o cabeçalho padrão das telas (`av-hub` `components/Ui/CabecalhoDaTela/CabecalhoDaTela.tsx:22` (`export default function CabecalhoDaTela`) e `CaminhoDaTela.tsx:11` (`export default function CaminhoDaTela`), PR #319) e, no padrão de Compras, as peças do Orçamento reaproveitáveis em outras áreas (`components/Orcamento/BarraDaLista.tsx:24` (`export default function BarraDaLista`), `BotaoVoltar.tsx:10` (`export default function BotaoVoltar`), `LinhasEsqueleto.tsx:6` (`export default function LinhasEsqueleto`), PR #336).
- ✅ Central de Avisos (LOG-61, PR #308): o BFF repassa `/me/avisos` sem checar tela, porque a API decide quem vê o quê (`av-hub` `app/api/avisos/[[...rota]]/route.ts:41` (`/me/avisos`)).
- ✅ Comissões (módulo atual), 18 a 23/11: o simulador e a proposta calculam a comissão pelo pedido inteiro, com predominância (N16-185, N16-186; `av-hub` `lib/simulador/motor.ts:475` (`Comissão por PEDIDO`)); a Visão Geral agrupa as notas por pedido, lê pela competência, filtra o pedido misto e mostra a margem do item (`lib/domain/comissoes-visao-geral.ts:312` (`export function agruparPorPedido`)), com uma linha por pedido e a letra da versão que paga (PR #339); Minhas Comissões lê `/comissoes_nf` com `meus=true` e os itens por um BFF novo, `/api/comissoes/minhas-comissoes/itens`, fora do `/faturamento_planilha` (`app/api/comissoes/minhas-comissoes/route.ts:152` (`/comissoes_nf?`)). As duas telas mostram `DEVOLVIDO` e o valor "Provável" (PR #337); a situação `AGUARDANDO_APROVACAO` ainda não vem da API (PS-065). Regras em [[01-Motor-Atual-Como-Calcula]].
- ✅ Padrão de comentários de código: seção "Comentários" no `CLAUDE.md` do av-hub (`av-hub` `CLAUDE.md:178` (`## Comentários`)) e a skill `comentarios-codigo`.

## Detalhe técnico

Front do av-hub: Portal do Vendedor, Portal do Gerente, Compras, Comercial & Suprimentos, PCP (portal de leitura), Comissões, RH. Dono: Nathan. Next.js 16 (App Router), React, MUI 9, NextAuth 4, `@react-pdf/renderer`, S3 ✅ `av-hub/package.json`. O Next está na **16.4.6** desde 18/11/2026: `av-hub` `package.json:33` (`"next": "^16.4.6"`), PR #325 e release #326. A 16.4.3 tinha duas falhas de cache com `'use cache'` (GHSA-mfr8-8qww-v76h e GHSA-vc7v-qv4w-wrv8, que o Hub não usa) e fazia o `next build` parar com `SecurityFatalError`. Repositório: `av-hub` (develop, 758d5f0). A pasta `api-comercial/` ficou nele como legado só de leitura (28/10, `a90d306`) e foi removida do av-hub em 06/11/2026 (PR #261, `dd9d729`); o código fica legível em `git show f7d8d7f:api-comercial/<arquivo>` ([[API-Comercial]]). Esta nota cobre o que o fluxo de Atividades usa; o resto vai em [[Comissoes]], [[Dashboards]] e afins (anexo fora do fluxo).

### Como funciona

- **BFF.** O navegador só fala com `app/api/**` (202 `route.ts`); o BFF chama a `api-acos-vital` com `process.env.API_URL` e `x-api-key` (`API_KEY`) ✅ grep em `app lib services`. O módulo Comercial & Suprimentos passa por `app/api/comercial/[...rota]/route.ts`, que tem uma lista de rotas permitidas (72 padrões, cada um com tela e ação de `auth.telas`). Só 21 estão marcadas `api: 'hub'` e falam com a `api-acos-vital`; as demais respondem **503 `RECURSO_NAO_MIGRADO`** até a rota existir lá. A `api-comercial` do Pablo saiu do BFF (N16-111): `COMERCIAL_API_URL` e `COMERCIAL_API_KEY` não são mais usadas ✅ `lib/api/comercialApi.ts:15-21,83`. O mapa completo de rotas e do que cada uma exige: [[Mapa-Rotas-BFF-Bearer]].
- **Identidade.** `headersComIdentidade()` (via `headersDaApi()`) soma `x-api-key` e `Authorization: Bearer <token do usuário>` emitido por `POST /autenticacao/*` da API `lib/api/escopoUnidade.ts`. O token do usuário é lido do cookie httpOnly no servidor (`lib/auth/backendToken.ts`) e **não** vai na `session` que o navegador lê: a sessão só informa `sessaoExpirada`, e `providers/SessaoExpiradaGuard.tsx` leva ao login ✅ HUB `d0ef359`. Com o token, a API aplica a permissão por rota (`auth.fn_autorizar`) e o escopo de vendedor ([[RBAC-e-Permissoes]]). Autoria (`created_by`, `aprovado_por`…) sai da sessão, nunca do corpo ✅ `lib/compras/api.ts:42-45`.
- **Login.** NextAuth com Azure AD (o `id_token` vai ao `/autenticacao/azure`, que é a prova de identidade; perfis e tela inicial vêm de `GET /me/permissoes`) (`AZURE_AD_CLIENT_ID`, `_SECRET`, `_TENANT_ID`) ✅; `NEXT_PUBLIC_DEV_SEM_LOGIN` liga o modo de desenvolvimento sem login (tudo liberado) ✅ `av-hub` `lib/auth/devSemLogin.ts`, `lib/api/requirePermission.ts:34` (`if (DEV_SEM_LOGIN) return null`).
- **Permissão no BFF.** `requirePermission(telaSlug | [slugs], acao)` confere primeiro `GET /me/permissoes` (cache 5 s) e responde 401 sem o token do usuário, 503 se `/me/permissoes` estiver fora do ar e 403 para tela fora de `auth.telas`; o menu preso no JWT é só apresentação e não autoriza nada ✅ `lib/api/requirePermission.ts`. Ações: `pode_visualizar`, `pode_criar`, `pode_editar`, `pode_deletar`, `pode_aprovar` ✅ `av-hub` `lib/permissions.ts:5-10` (`export type Acao =`).
- **Permissão na tela.** `can('pode_x', 'slug')` lê o menu da sessão; botões e abas dependem disso ✅ ex.: `components/Compras/ComprasRequisicoes.tsx:94,186`.
- **Sem camada de dados no cliente.** Hooks por módulo (`components/Compras/useCompras.ts`, `Followup/useFollowup.ts`) chamam o BFF; sem regra de negócio no front ("GAMBIARRA(" marca onde ainda há: 9 ocorrências em 8 arquivos de `app`, `components`, `lib`, `services`) ✅ grep de 29/10.

### Telas do fluxo de Atividades

| Nó | Tela (nome atual · antigo) | Rota | Slug (`auth.telas`) | BFF → API | Código |
|---|---|---|---|---|---|
| V1 a V3 | Liberar Pedidos | `/vendas/liberar-pedidos` (antes `/liberar-pedidos`; o menu foi enxugado em 27/10, N16-107) | `liberar-pedidos` | `GET /api/liberar-pedidos` → `GET /pedidos_liberacao`; `PUT /api/liberar-pedidos/:empresa/:numero` → `PUT /pedidos_liberacao/:empresa/:numero` | ✅ `app/(protected)/vendas/liberar-pedidos/page.tsx`, `components/LiberarPedidos/`, `app/api/liberar-pedidos/[codigoEmpresa]/[numeroPedido]/route.ts:19` |
| V2, V3 | Liberação da equipe (gerente) | `/liberacao-equipe` | `liberacao-equipe` | mesma rota, `?fonte=equipe` | ✅ `app/api/liberar-pedidos/route.ts:31-36` |
| V1 a O2 | Meus pedidos, Pedidos da equipe, PCP · Pedidos (detalhe com "Etapa dos itens") | `/vendas/meus-pedidos`, `/pedidos-equipe`, `/pcp-pedidos` (+ `…/pedido/[codigoEmpresa]/[pedidoVenda]`) | `meus-pedidos`, `pedidos-equipe`, `pcp-pedidos` | `GET /api/pedidos-venda/[fonte]/…/etapas` → `GET /itens_pedido_status` | ✅ `components/Pedidos/EtapaDosItens.tsx`, `app/api/pedidos-venda/[fonte]/[codigoEmpresa]/[pedidoVenda]/etapas/route.ts:18-58` (`export async function GET(` na `:23`) |
| C0 | Requisições (Nova requisição) | `/compras/requisicoes`, `/compras/requisicoes/kanban` | `compras` | `GET /api/compras/requisicoes` → `GET /compras/requisicoes`; `POST /api/compras/requisicoes` → `POST /compras/requisicoes` (permissão `compras.pode_criar`) | ✅ `components/Compras/ComprasRequisicoes.tsx:191-195`, `app/api/compras/requisicoes/route.ts:80` |
| C1 | Cotação: mudar status da requisição (aberta, em cotação, cancelada com motivo); excluir requisição própria do Compras | idem (kanban e lista) | `compras` (editar) | `PATCH /api/compras/requisicoes/[id]` → `PATCH /compras/requisicoes/:id`; `DELETE /api/compras/requisicoes/[id]` → `DELETE /compras/requisicoes/:id` (contrato 55) | ✅ `app/api/compras/requisicoes/[id]/route.ts:32`, `components/Compras/Kanban/RequisicoesKanban.tsx:77` |
| C4 | Fechar compra / Nova OC (uma ou várias requisições) | `/compras/nova`, `/compras/nova/[requisicaoId]` | `compras` (criar) | `POST /api/compras/ordens` → `POST /compras/ordens` | ✅ `components/Compras/FecharCompra.tsx`, `app/api/compras/ordens/route.ts:113` |
| C2, C3 | Aprovações | `/compras/aprovacoes` | `compras` (`pode_aprovar`) | `PATCH /api/compras/ordens/[id]` (status `aprovado` ou `cancelado`) → `PATCH /compras/ordens/:id` | ✅ `components/Compras/ComprasAprovacoes.tsx:34`, `app/api/compras/ordens/[id]/route.ts:35` |
| C4 | Ordens (lista, kanban, detalhe, PDF, reenviar ao Omie) | `/compras/ordens`, `/compras/ordens/kanban`, `/compras/ordem/[id]`, `/compras/pedido-omie/[id]` | `compras` | `GET/…/api/compras/ordens/*`, `/pdf`, `/reenviar` (editar) | ✅ `components/Compras/ComprasOrdens.tsx`, `OrdemDetalhe.tsx:193-196` |
| C5 | Follow-up do CCP (confirmação, previsão, despacho, contato, ocorrência) | `/compras/followup` | `followup` | `GET /api/compras/acompanhamento`; `GET/PUT /api/compras/ordens/[id]/acompanhamento`; `POST …/contatos`, `…/ocorrencias`; `PATCH /api/compras/ocorrencias/[id]` (decidir: `followup.pode_aprovar`) | ✅ `components/Compras/Followup/FollowupPainel.tsx:107-110` (`const podeDecidir = can('pode_aprovar', 'followup')`), `app/api/compras/ocorrencias/[id]/route.ts:13` (`requirePermission('followup', 'pode_aprovar')`) |
| — | Compradores (vínculo comprador × funcionário) | `/compras/compradores` | `compradores` | `GET/PUT /api/compras/compradores` | ✅ `components/Compras/Compradores/CompradorVinculo.tsx:74` |
| — | Painel de compras | `/compras/dashboard-compras`, `/compras` | `compras` | `GET /api/compras/dashboard` | ✅ `app/api/compras/dashboard/route.ts:17` |
| Torre | Torre de Fluxo: mapa por setor, lista, trilha do item, tempo e ranking | `/torre-fluxo`, `/torre-fluxo/item/[id]`, `/torre-fluxo/tempo`, `/torre-fluxo/ranking` | `torre-fluxo`, `torre-fluxo-trilha` | `GET /api/fluxo/torre`, `/api/fluxo/itens/[id]`, `/api/fluxo/sla-etapas` → `GET /fluxo/torre`, `/fluxo/itens/:id`, `/fluxo/sla-etapas`; 404 da API = `disponivel: false` (fixtures só em desenvolvimento) | ✅ `app/(protected)/torre-fluxo/`, `app/api/fluxo/`, `lib/fluxo/bff.ts` |
| E3, R4 | Custo real dos itens do pedido, com simulador (sem imposto) | `/orcamento/custo-itens` | `custo-itens` | `GET /api/custo-itens?numero_pedido=` → `GET /itens_pedido_custo` | ✅ `app/(protected)/orcamento/custo-itens/page.tsx`, `components/CustoItens/CustoItens.tsx`, `app/api/custo-itens/route.ts:10` |

As rotas de apoio do BFF de Compras exigem `compras.pode_visualizar`: `condicoes-pagamento`, `contas-correntes`, `fornecedores`, `transportadoras`, `projetos`, `produtos`, `categorias`, `cotacao`, `parametros`, `minhas-unidades` (esta última também aceita `compradores`) ✅ `app/api/compras/*/route.ts`.

### O que existe e o que falta, por nó

| Nó | Estado no HUB | Selo |
|---|---|---|
| V2, V3 | Tela de liberação completa, com as duas fontes (vendedor e equipe) e mapa de unidades | ✅ |
| C0 | "Nova requisição" cria requisição própria do Compras (sem `id_origem`; ela não gera marco no MES, mas o MES a vê pela referência da requisição, API-009, e a **OC** dela chega pela referência da OC, N14-20). Se o Compras vincula a requisição ou a OC a um pedido de venda, o PCP vê no MES; se é de estoque, o Estoque vê o saldo futuro | ✅ tela; ✅ o MES lê as duas referências (`develop` do MES); tela no HUB só se o MES precisar (BL-041) 🟡 |
| C1 | Mudança de status da requisição; cancelar exige motivo (3 a 500 caracteres, regra da API) | ✅ `api-acos-vital` `requisicoes_compra.route.js:508-514` |
| C2/C3 | Uma única tela de aprovação, com **uma** permissão (`compras.pode_aprovar`, perfil Gerência de Compras): aprova a OC que excede o limite (R$ 30 mil por padrão); até o limite a OC é liberada sem aprovação e a Diretoria não aprova (N14-21) | ✅ tela e regra (ver [[AV-Hub-API]]); 🟡 endurecer depois com Compras |
| C4 | OC com valor, desconto, moeda, cotação (no cabeçalho da OC), CIF/FOB (`tipo_frete`), flag `tipo_material` por item | ✅ `FecharCompra.tsx` |
| C5 | Follow-up do CCP | ✅ |
| Torre de Fluxo (LOG-46) | Telas e BFF prontos desde 15/10 (`3cd55de`, BL-022); falta o feed do MES (`/fluxo/*`) e a concessão da tela a um perfil de negócio | ✅ tela; 🔴 dado |
| Custo por item (LOG-47) | Tela e BFF prontos desde 15/10 (`544ee0b`, BL-023), sem imposto; a tela só enche quando o MES de produção publicar `GET /itens/custo` | ✅ tela; 🟡 dado |
| Status por item (API-005/006) | Card "Etapa dos itens" lê `GET /itens_pedido_status`; rótulos para as 11 etapas, o que não conhece aparece cru | ✅ `lib/domain/etapas-item.ts:34-47` |
| Marcos da requisição (LOG-35) | Nenhuma tela do HUB lista os marcos (`requisicoes_compra_eventos`); quem os lê é o MES | 🟡 |

### Permissões do HUB que o fluxo toca

Resumo; a tabela completa está em [[RBAC-e-Permissoes]].

| Slug | Ações usadas | Onde |
|---|---|---|
| `liberar-pedidos`, `liberacao-equipe` | visualizar, editar | `app/api/liberar-pedidos/**` |
| `compras` | visualizar, criar (nova requisição e nova OC), editar (status da requisição, reenviar ao Omie), aprovar (aprovar e cancelar OC) | `app/api/compras/**` |
| `followup` | visualizar, editar, aprovar | `app/api/compras/{acompanhamento,ocorrencias,ordens/[id]/(acompanhamento\|contatos\|ocorrencias)}` |
| `compradores` | visualizar, editar | `app/api/compras/compradores/**` |
| `pcp-pedidos`, `pcp-notas`, `pcp-dashboard` | visualizar (criar e deletar nas observações do PCP) | `app/api/pcp/**` |

### Pontas soltas conferidas no código

- ✅ O módulo antigo de Orçamento (JSON local em `lib/orcamento/`, `app/api/orcamento/*`) foi removido em 16/10 (`c851cda`). O Orçamento de hoje são as telas em `app/(protected)/orcamento/` sobre `/api/comercial/*` ([[02-Orcamento-Base-de-Preco]]).
- ✅ A aprovação lê `limite_aprovacao` de `GET /compras/parametros` apenas para avisar na tela de OC ("Acima de R$… ela nasce Aguardando aprovação") ✅ `av-hub` `components/Compras/FecharCompra/useFecharCompra.ts:488` (`const exigeAprovacao`); aviso em `components/Compras/FecharCompra/ResumoCompra.tsx:118` (`ela nasce &quot;Aguardando`).
- ✅ `api-comercial` removida do av-hub em 06/11/2026 (PR #261, `dd9d729`): av-hub `lib/api/comercialApi.ts:15` (`A api-comercial de teste foi removida`); legível em `git show f7d8d7f:api-comercial/<arquivo>` ([[API-Comercial]]).

### O que o Nathan precisa construir para o fluxo

1. ✅ Tela Torre de Fluxo (`/torre-fluxo`, trilha, tempo, ranking) feita em 15/10. Falta conceder `torre-fluxo` e `torre-fluxo-trilha` a um perfil de negócio e o MES publicar `/fluxo/*`.
2. ✅ Tela de custo por item feita em 15/10. Falta conferir com dado real quando o MES de produção publicar `GET /itens/custo`.
3. A aprovação da OC já funciona (N14-21); quando Compras definir a regra mais rígida 🟡, ajustar `ComprasAprovacoes.tsx` e a API junto com o Gustavo. Nada a construir agora.
4. O MES enxergar a OC de "Nova requisição" (N14-20): já lê a referência da OC e da requisição (na `develop` do MES); o Nathan só faz tela no HUB se o MES precisar (BL-041) 🟡.
5. Imposto por item: desenho decidido em 29/10 (N16-144). Falta pôr os campos de imposto e o selo de origem na emissão da OC, quando o desenvolvimento começar 🔴.
