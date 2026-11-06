---
name: criar-contrato
description: Só para o admin do vault (Nathan, GitHub oluccaa). Criar um contrato novo direto no vault, em arquivo único com contexto e todas as camadas (frontend, backend, API, SQL), com ID final, numa branch com PR. Use quando o admin disser "cria um contrato", "abre um contrato" ou "registra esta demanda".
---

# Criar um contrato direto no vault (admin)

## 0. Confirme que é o admin
Rode `git config user.name` e `git config user.email`. É o admin se o nome for `oluccaa` ou `Nathan Lucca`, ou se o e-mail contiver `oluccaa`. Se não for, **pare**: não grave nada e use a skill `pedir-contrato` (PDF para o grupo).

## 1. Prepare e leia
1. Prepare o ambiente como manda o `CLAUDE.md` (fetch do vault e dos cinco sistemas; `git pull --ff-only` na `main`).
2. Leia `06-Contratos/Modelos/Modelo-de-Contrato.md` inteiro. Ele manda na estrutura e nas regras.
3. Junte o contexto antes de escrever:
   - a raia de cada nó envolvido (`02-Fluxo-de-Atividades/NN-...`) e as partes dela;
   - as decisões ligadas (busca no `08-Decisoes/Registro-de-Decisoes`);
   - contratos parecidos no `06-Contratos/Contratos-da-v2` e as tasks no `07-Desenvolvimento/Backlog-por-Frente`;
   - **o estado atual de cada camada na `origin/develop`**: telas no `av-hub`/`app-pcp`, rotas e serviços na `api-acos-vital`/`api-pcp`, tabelas no banco (dump mais recente em `04-Dados`). Leia sem checkout e anote repositório, commit e arquivo:linha.

## 2. Pergunte o que faltar
No máximo 3 perguntas por vez, até ter: o porquê, o que muda em cada camada, quem implementa cada camada e como saber que ficou pronto.

## 3. Dê o ID
1. Defina a camada principal e o prefixo (`LOG`, `SQL`, `API`), pela tabela do modelo.
2. Pegue o próximo número livre: confira a linha "Próximos IDs livres" no fim do `06-Contratos/Contratos-da-v2`, o `01-Projeto/Tipos-de-ID` **e** os arquivos que já existem em `06-Contratos/*/` e nas branches abertas (`git branch -r`). Use o maior + 1.

## 4. Escreva e registre (numa branch)
1. Crie a branch a partir da `main` atualizada: `git switch -c docs/contrato-<ID>-<apelido>`.
2. Crie `06-Contratos/Ativos/<ID>-<Apelido>.md` no formato do modelo, com **todas** as seções. Camada que não se aplica fica com "Não se aplica: <motivo>".
3. Registre:
   - a linha na seção "Contratos novos (v3)" do `Contratos-da-v2` (ID, título, pasta, status, nós);
   - "Próximos IDs livres" no `Contratos-da-v2` e no `Tipos-de-ID`;
   - o link `[[<ID>-<Apelido>|<ID>]]` na seção "O que falta" de cada raia dona dos nós (o `nos:` do frontmatter diz qual é).
4. Rode `cd 09-Diagramas/mapa && node build.mjs` e depois `node scripts/validar.mjs` na raiz. Tem de dar tudo zero.
5. Commit (`docs(contrato): <ID> <título>`), push da branch e PR para a `main`. O merge é do admin, com a Action verde.

## 5. Avise quem implementa
Se o admin pedir, gere o PDF do contrato com a skill `gerar-pdf` (tipo `Contrato`) e a mensagem para o grupo, com o ID e quem faz cada camada.
