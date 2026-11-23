---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-23
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-23, decisões N16-180 a N16-192 (19 a 23/11), git log -1 origin/develop de cada sistema em 2026-11-17, conversa do Nathan de 17/11/2026 (N16-168 a N16-171), git log -1 origin/develop de cada sistema em 2026-11-16, reteste R4 no Docker de 16/11/2026 (docker-teste/RETESTE-R4-2026-11-16.md), reteste por cliques no Docker de 13/11/2026 (docker-teste/RETESTE-CLIQUES-2026-11-13.md, fora do vault), conferência completa do vault de 13/11/2026 (docker-teste/conferencia-vault/, fora do vault), reteste R2 no Docker de 13/11/2026 (docker-teste/RELATORIO-VALIDACAO.md seção R2, RETESTE-2026-11-13-AVHUB.md e RETESTE-2026-11-13-MES.md, fora do vault), teste da proposta no Docker local de 13/11, validação local em Docker de 10/11/2026]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 23/11/2026. **Motivo:** o Nathan pediu o vault com tudo o que foi feito no AV-Hub e no MES de 17 a 23/11. Na `develop`, desde a base de 17/11: no MES, o Estoque do Nathan (`api-pcp` PRs #85 a #95: testes, motor único, conferência do livro, lote v2, travas, idempotência, kardex, inventário, painel, consulta, pendências, valor do kardex; `app-pcp` PRs #70 a #82: telas por tarefa, fila do Estoque, casca e tema do Hub, filtros); no Hub, a comissão por pedido, a predominância, a competência, a trava da versão do vendedor, a versão pré-aceita e o recorte do vínculo próprio (`av-hub` #312, #313, #327, #331, #333, #334; `api-acos-vital` `7c05f92`, `0244b1a`, `e363da5`, `0e56354`, `06bb146`), o LOG-62 (#314), o SQL-023 e o SQL-024 (#310, #321), o cabeçalho padrão (#319), o padrão de comentários (#323), o Next 16.4.6 (#325), a busca rápida do Pedir cotação (API #329, Hub #335) e o Orçamento no visual de Compras (#336); `omie-elt-pipeline` só o padrão de comentários (#10). **Nesta atualização:** decisões N16-180 a N16-192 e PS-060 a PS-064; raias [[01-Proposta-de-Venda]], [[05-Estoque-Atendimento]] (dividida: [[05-Estoque-Atendimento-Detalhe-Tecnico]]), [[09-Estoque-Entrada-do-Lote]], [[12-Estoque-Despacho]] e [[15-Custo-Real-e-Comissao]]; [[MES-Backend]], [[MES-Front]], [[AV-Hub-API]], [[AV-Hub-Front]], as notas da comissão (02 dividida), [[Onde-Estamos]], [[Equipe-e-Divisao]], [[Regras-do-Vault]], as telas e o RBAC, os contratos `LOG-60`, `SQL-023` e `SQL-024`, o backlog e cerca de 100 citações de código acertadas na `develop` de 23/11 (sobram 8 do `api-comercial` legado, de propósito). **Ainda sem conferir:** a produção das migrations da comissão de 18 a 23/11 (no tst desde o [[Dump-AvHub-Teste-2026-11-23]]; PS-062), o deploy do MES e o cadastro das telas novas do Estoque em Acessos no tst e na produção (PS-060).

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `ce4f90f` | 23/11/2026 | PR #329 (busca rápida de produto); na `main` até o PR #327 (19/11) |
| `av-hub` | `origin/develop` | `7f0f7e2` | 23/11/2026 | PR #336 (Orçamento no visual de Compras); na `main` até o PR #330 (19/11) |
| `api-pcp` | `origin/develop` | `c8036db` | 23/11/2026 | PR #95 (valor do kardex); na `main` até o PR #84 (18/11) |
| `app-pcp` | `origin/develop` | `8259344` | 23/11/2026 | PR #82 (filtros do Estoque no padrão do Hub); na `main` até o PR #69 (18/11) |
| `omie-elt-pipeline` | `origin/develop` (a `master` é a produção) | `e42b65d` | 18/11/2026 | PR #10 (padrão de comentários) |

São os commits do `develop-conferida` das notas conferidas nesta atualização; as raias não tocadas ainda dizem commits anteriores.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 23/11/2026 12:00 (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-23.sql`, [[Dump-AvHub-Teste-2026-11-23]]), com a comissão de 18 a 23/11 e a estrutura do `LOG-62`; o de **produção** é o de 18/11 ([[Dump-AvHub-Producao-2026-11-18]]). As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); o dump é a referência do esquema. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
