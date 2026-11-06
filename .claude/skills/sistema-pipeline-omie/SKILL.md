---
name: sistema-pipeline-omie
description: Ler e procurar no omie-elt-pipeline, que traz os dados do Omie para o Postgres do av-hub e envia as ordens de compra ao Omie (TypeScript, BullMQ, Redis). Use para saber de onde vem um dado do Omie, como funciona a sincronização, o envio de OC, as colunas protegidas ou as exclusões.
---

# Sistema `omie-elt-pipeline`

Fica ao lado do vault: `../omie-elt-pipeline`. **Só leitura.** **A base é a `origin/master`**: este repositório não tem `develop`.

## 0. Antes de ler
1. `git -C ../omie-elt-pipeline fetch --all --prune`; anote o commit de `origin/master`.
2. Leia sem checkout: `git -C ../omie-elt-pipeline show origin/master:<arquivo>`, `git -C ../omie-elt-pipeline grep -n "<termo>" origin/master -- src sql`.
3. **Nunca abra o `.env`** (tem chaves do Omie, senhas e segredos de TOTP). Os nomes das variáveis estão no `.env.example`.
4. **Nunca rode** worker, job ou CLI do pipeline (`full-sync`, `envio-oc`, `scheduler`...). **O Omie não tem ambiente de teste**: qualquer escrita afeta dado real.

## 1. Onde fica cada coisa
| O que procuro | Onde |
|---|---|
| Visão geral e decisões | `ARCHITECTURE.md` (camadas de sync, multi-filial, rate limit, colunas protegidas, exclusões) |
| Cliente e chamadas do Omie | `src/omie/` |
| Jobs e camadas de sincronização | `src/jobs/` (hoje, mês, últimos meses, full sync, exclusões, PTAX, geocodificação, envio de OC) |
| Workers da fila | `src/workers/` (extração, carga, envio de OC) |
| Fila | `src/queue/` (BullMQ, Redis) |
| Envio ao av-hub | `src/avhub/` |
| Scraping de relatórios do Omie | `src/scraping/` (Playwright) |
| Banco: schemas e tabelas de controle | `sql/001_schemas.sql`, `sql/002_staging_tables.sql`, `sql/003_control_tables.sql` |
| Migrations e contratos do DBA | `sql/dba_migrations/` |

## 2. Receita: de onde vem um dado
1. Ache a tabela de destino (`omie_*`) no `sql/` ou no dump (skill `banco-de-dados`).
2. Ache quem grava nela: `git -C ../omie-elt-pipeline grep -n "<tabela>" origin/master -- src`.
3. Siga até a chamada do Omie em `src/omie/` e o job que agenda em `src/jobs/`.
4. Confira as colunas protegidas (que o pipeline nunca escreve) em `ARCHITECTURE.md` e na nota `05-Integracoes/Colunas-Protegidas`.

## 3. Notas do vault deste sistema
`03-Sistemas/Pipeline-Omie`, `05-Integracoes/Omie-Integracao-Estado`, `05-Integracoes/Estudo-Omie-API`, `05-Integracoes/Mapa-IncluirPedido-Omie`, `05-Integracoes/Colunas-Protegidas` e os dicionários em `05-Integracoes/Omie-Dicionarios/`.
