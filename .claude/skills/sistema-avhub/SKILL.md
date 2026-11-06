---
name: sistema-avhub
description: Ler e procurar no sistema av-hub (ERP da Aços Vital), formado pelo front av-hub (HUB, Next.js, com o BFF) e pela API api-acos-vital (Express e Sequelize). Use para conferir uma tela, uma rota do BFF, uma rota da API, uma regra ou uma tabela do av-hub, ou para seguir uma funcionalidade da tela até o banco.
---

# Sistema av-hub (front `av-hub` + API `api-acos-vital`)

Os dois repositórios ficam ao lado do vault: `../av-hub` e `../api-acos-vital`. **Só leitura:** nunca troque de branch, faça commit ou stash neles. A branch local de quem trabalha pode ser uma `feat/...`; **a base é sempre a `origin/develop`** (regra F5 do `CLAUDE.md`).

## 0. Antes de ler
1. `git -C ../av-hub fetch --all --prune` e `git -C ../api-acos-vital fetch --all --prune`; anote o commit de `origin/develop` de cada um.
2. Leia sem checkout: `git -C ../av-hub show origin/develop:<arquivo>`, `git -C ../av-hub grep -n "<termo>" origin/develop -- <pastas>`, `git -C ../av-hub ls-tree -r --name-only origin/develop <pasta>`.
3. Cite sempre: repositório, commit da `origin/develop` e arquivo:linha.
4. Nunca abra `.env`, `.env.local` nem chaves. Os nomes das variáveis estão no código (`process.env.NOME`).

## 1. Onde fica cada coisa no `av-hub` (front)
| O que procuro | Onde |
|---|---|
| Tela (página) | `app/(protected)/<módulo>/.../page.tsx` (ex.: `vendas`, `compras`, `orcamento`, `comissoes`, `cadastros`, `torre-fluxo`) |
| Login | `app/(public)/login/` |
| Componentes da tela | `components/` |
| **BFF** (o que a tela chama) | `app/api/<recurso>/.../route.ts` |
| Como o BFF chama a API | `lib/api/fetchHelper.ts` (usa `API_URL` e `API_KEY`), `lib/auth/backendToken.ts`; clientes por assunto em `lib/api/*.ts` |
| Permissão de tela e rota | `lib/api/requirePermission.ts`, `lib/api/mePermissoes*.ts` |
| Regras de domínio do front | `services/` |
| Autenticação e CSP de todas as rotas | `proxy.ts` (next-auth) |
| Padrão visual | `docs/design/guia-de-interface.md` e a skill do próprio repositório em `.claude/skills/interface-hub/` |

**Não são fonte de estado:** `docs/ENVIAR - *.md` (contratos antigos da v1) e `api-comercial/` (módulo de teste do Pablo, que será removido: o que só existe nele é 🔴, regra F3).

## 2. Onde fica cada coisa na `api-acos-vital` (API)
| O que procuro | Onde |
|---|---|
| Como as rotas são montadas | `src/app.js` → `src/schemas/index.js` → `src/schemas/<schema>/index.js` (cada schema lista caminho, router e middlewares) |
| Uma rota | `src/schemas/<schema>/<tipo>/<objeto>/<objeto>.route.js` (`<tipo>` = `tables`, `views`, `functions` ou `aggregates`) |
| O modelo da tabela/view | `<objeto>.model.js` (Sequelize) |
| A documentação da rota | `<objeto>.swagger.json`; Scalar em `/docs` quando a API roda |
| Segurança e escopo | `src/middlewares/` (`apiKeyAuth`, `ipFilter`, `identidadeUsuario`, `aplicarEscopoVendedor`, `registrarAuditoria`) |
| Testes | `test/unit/`, `test/integracao/` |

**O nome da pasta do schema é o nome do schema no banco** (`core_comercial`, `core_compras`, `core_vendas_faturamento`, `auth`...). **O esquema do banco não está no repositório** (não há migrations): para confirmar tabela, coluna ou função, use a skill `banco-de-dados`.

## 3. Receita: seguir uma funcionalidade da tela ao banco
1. Ache a tela: `git -C ../av-hub grep -n "<texto da tela>" origin/develop -- app components`.
2. Na tela, ache a chamada ao BFF (`fetch('/api/...')` ou um cliente de `lib/api`).
3. Abra `app/api/<recurso>/route.ts` e veja o caminho da API que ele chama.
4. Na API, ache a rota: `git -C ../api-acos-vital grep -n "<caminho>" origin/develop -- src/schemas`, depois o `.route.js`, o `.model.js` e a função ou tabela usada.
5. Confirme a tabela, coluna ou função no dump mais recente (skill `banco-de-dados`).
6. Se faltar um elo, a funcionalidade **não está pronta**, mesmo que o vault diga ✅.
7. Se precisar ver a tela funcionando, use a skill `preview-de-telas`.

## 4. Notas do vault deste sistema
`03-Sistemas/AV-Hub-Front`, `03-Sistemas/AV-Hub-API`, `10-Anexo-Fora-do-Fluxo/Mapa-Rotas-BFF-Bearer`, `02-Fluxo-de-Atividades/Transversais/Telas-por-Raia`, `03-Sistemas/RBAC-e-Permissoes`, `04-Dados/Banco-AvHub`, `03-Sistemas/Mapa-do-Modulo-do-Pablo` e `05-Integracoes/Chaves-e-Autenticacao`. Compare o que leu com elas; divergência vai para o relatório (ou para `Pontas-Soltas`, se for o admin).
