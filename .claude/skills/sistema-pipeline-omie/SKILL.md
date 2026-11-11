---
name: sistema-pipeline-omie
description: Ler e procurar no omie-elt-pipeline, que traz os dados do Omie para o Postgres do av-hub e envia as ordens de compra ao Omie (TypeScript, BullMQ, Redis). Use para saber de onde vem um dado do Omie, como funciona a sincronização, o envio de OC, as colunas protegidas ou as exclusões.
---

# Sistema `omie-elt-pipeline`

Fica ao lado do vault: `../omie-elt-pipeline`. **Só leitura.** **A base é a `origin/master`**: este repositório não tem `develop`.

## 0. Antes de ler
0. Se `../omie-elt-pipeline` não existir, siga "Repositório ausente" no `CLAUDE.md`: não adivinhe o código.
1. `git -C ../omie-elt-pipeline fetch --all --prune`; anote o commit de `origin/master`.
2. Leia sem checkout: `git -C ../omie-elt-pipeline show origin/master:<arquivo>`, `git -C ../omie-elt-pipeline grep -n "<termo>" origin/master -- src sql`. Cite repositório, commit e arquivo:linha com âncora.
3. **Nunca abra o `.env`** (tem chaves do Omie, senhas e segredos de TOTP). Os nomes das variáveis estão no `.env.example`.
4. **Nunca rode** worker, job ou CLI do pipeline (`full-sync`, `envio-oc`, `scheduler`...). **O Omie não tem ambiente de teste**: qualquer escrita afeta dado real.

## 1. Onde fica cada coisa
| O que procuro | Onde |
|---|---|
| Mapa do repositório para IA | `CLAUDE.md` (caminho de um dado, agendamento, tabelas, exclusões, limites do Omie, o que está velho no `ARCHITECTURE.md`). Enquanto o PR #5 não entrar na `master`: `git -C ../omie-elt-pipeline show origin/docs/guia-para-ia:CLAUDE.md` |
| Visão geral e decisões | `ARCHITECTURE.md` (camadas de sync, multi-filial, rate limit, colunas protegidas, exclusões). **Partes estão velhas** (destino `omie_raw`, 5 recursos, 3 processos, chave do `produto_vendas`): confira no código |
| Cliente e chamadas do Omie | `src/omie/` |
| Recurso do Omie → tabela de destino | `src/omie/resources/<nome>.ts`, campo `table:` (por exemplo `core.produtos`, `core_vendas_faturamento.pedidos_vendas`) |
| Jobs e camadas de sincronização | `src/jobs/` (hoje, mês, últimos meses, full sync, exclusões, PTAX, geocodificação, envio de OC) |
| Workers da fila | `src/workers/` (extração, carga, envio de OC) |
| Fila | `src/queue/` (BullMQ, Redis) |
| Envio ao av-hub | `src/avhub/` |
| Scraping de relatórios do Omie | `src/scraping/` (Playwright) |
| Banco: schemas e tabelas de controle | `sql/001_schemas.sql`, `sql/003_control_tables.sql` (controle em `omie_ctl.*`, por exemplo `omie_ctl.run_log`). O `sql/002_staging_tables.sql` cria o staging `omie_raw`, que **não** é o destino da carga |
| Migrations e contratos do DBA | `sql/dba_migrations/` |

## 2. Receita: de onde vem um dado
1. A carga grava direto nas tabelas do av-hub, nos schemas `core.*` e `core_vendas_faturamento.*` (não em tabelas `omie_*`). Confira a tabela no dump (skill `banco-de-dados`).
2. Ache o recurso que grava nela: `git -C ../omie-elt-pipeline grep -n "table: '<schema>.<tabela>'" origin/master -- src/omie/resources`. Filhos (itens, vínculos) são gravados no `afterUpsert` de outro recurso: se não achar pelo `table:`, busque só o nome da tabela em `src`.
3. No recurso, o `mapRow` diz de qual campo do Omie vem cada coluna. Se a coluna não está no `mapRow`, ela é protegida, vem do `afterUpsert` de outro recurso, de um job ou de um trigger do banco. Siga até a chamada do Omie em `src/omie/` e o job que agenda em `src/jobs/`.
4. Confira as colunas protegidas (que o pipeline nunca escreve) em `ARCHITECTURE.md` e na nota `05-Integracoes/Colunas-Protegidas`.

## 3. Notas do vault deste sistema
`03-Sistemas/Pipeline-Omie`, `05-Integracoes/Omie-Integracao-Estado`, `05-Integracoes/Estudo-Omie-API`, `05-Integracoes/Mapa-IncluirPedido-Omie`, `05-Integracoes/Colunas-Protegidas` e os dicionários em `05-Integracoes/Omie-Dicionarios/`.
