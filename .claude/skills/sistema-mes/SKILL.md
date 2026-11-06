---
name: sistema-mes
description: Ler e procurar no MES, o sistema de chão de fábrica da Aços Vital, formado pela API api-pcp (NestJS e Prisma) e pelo front app-pcp (Next.js). Use para conferir uma tela, rota, regra, migration ou tabela do MES (PCP, estoque, compras no MES, recebimento, qualidade, produção, expedição) ou a integração com o av-hub.
---

# Sistema MES (API `api-pcp` + front `app-pcp`)

Os repositórios ficam ao lado do vault: `../api-pcp` e `../app-pcp`. **Só leitura:** nunca troque de branch, faça commit ou stash neles. **A base é a `origin/develop`** (regra F5). Atenção: a `main` do MES fica atrás da `develop`; o que vale é a `develop`.

## 0. Antes de ler
1. `git -C ../api-pcp fetch --all --prune` e `git -C ../app-pcp fetch --all --prune`; anote o commit de `origin/develop`.
2. Leia sem checkout: `git -C ../api-pcp show origin/develop:<arquivo>`, `git -C ../api-pcp grep -n "<termo>" origin/develop -- src prisma`.
3. Cite repositório, commit e arquivo:linha. Nunca abra `.env` nem chaves.

## 1. Onde fica cada coisa na `api-pcp` (API)
| O que procuro | Onde |
|---|---|
| Módulos (um por assunto) | `src/<módulo>/` (ex.: `compras`, `estoque`, `itens-parciais`, `pedidos`, `qualidade`, `roteiros`, `integracao-avhub`, `rbac`) |
| Rotas | `src/<módulo>/*.controller.ts` (decorators `@Get`, `@Post`, `@Patch`...) |
| Regras de negócio | `src/<módulo>/*.service.ts` |
| Formato de entrada | `src/<módulo>/dto/` (class-validator) |
| Integração com o av-hub | `src/integracao-avhub/` (jobs com intervalo pelas variáveis `AVHUB_*`) |
| Permissões | `src/rbac/`, `src/auth/` |
| **Banco do MES (fonte do esquema)** | `prisma/schema.prisma`, `prisma/models/*.prisma` e `prisma/migrations/<data>_<nome>/migration.sql` (schema `public`) |
| Documentação da API | `/docs` quando a API roda (Basic Auth) |
| Guias do time | `docs/` (NestJS e Prisma) |

No MES, **o esquema do banco está no repositório**: a última migration da `origin/develop` diz como o banco deve estar. Para confirmar o banco real, use a skill `banco-de-dados`.

## 2. Onde fica cada coisa no `app-pcp` (front)
| O que procuro | Onde |
|---|---|
| Tela | `app/(protected)/<tela>/.../page.tsx` (ex.: `carteira` = Triagem do Pedido, `ordens-producao` = Destinação/Ordens, `estoque-operacao`, `qualidade`, `logistica`, `movimentacoes`, `montagem-roteiro`, `decisoes-pcp`) |
| BFF | `app/api/<recurso>/.../route.ts` |
| Chamada à API | `lib/api/fetchHelper.ts`, `lib/api/requireSession.ts`, `lib/api/requirePermission.ts` |
| Regras do front | `services/`, `lib/` |

O `app-pcp` usa uma versão nova do Next.js: o `AGENTS.md` do próprio repositório manda ler a documentação em `node_modules/next/dist/docs/` antes de concluir algo sobre o framework. Use os nomes novos de tela e registre os dois (`Regras-do-Vault`).

## 3. Receita: seguir uma funcionalidade
1. Tela no `app-pcp` → chamada ao BFF → `app/api/.../route.ts` → caminho da API.
2. Na `api-pcp`: `git -C ../api-pcp grep -n "<caminho>" origin/develop -- src` → controller → service → modelo Prisma.
3. Confira a coluna ou tabela na última migration da `origin/develop`.
4. Integração com o av-hub: leia os dois lados (`src/integracao-avhub/` e a skill `sistema-avhub`) e a nota `05-Integracoes/Integracao-AvHub-MES`.
5. Para ver a tela, use a skill `preview-de-telas`.

## 4. Notas do vault deste sistema
`03-Sistemas/MES-Backend`, `03-Sistemas/MES-Front`, `04-Dados/Banco-MES`, `02-Fluxo-de-Atividades/Transversais/Estados-e-Status`, `05-Integracoes/Integracao-AvHub-MES` e as raias `04` a `14`.
