---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-13
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-13, reteste por cliques no Docker de 13/11/2026 (docker-teste/RETESTE-CLIQUES-2026-11-13.md, fora do vault), conferência completa do vault de 13/11/2026 (docker-teste/conferencia-vault/, fora do vault), reteste R2 no Docker de 13/11/2026 (docker-teste/RELATORIO-VALIDACAO.md seção R2, RETESTE-2026-11-13-AVHUB.md e RETESTE-2026-11-13-MES.md, fora do vault), teste da proposta no Docker local de 13/11, validação local em Docker de 10/11/2026]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 13/11/2026 (terceira atualização do dia). **Motivo:** o reteste por cliques no Docker de 13/11 (seção R3 de `docker-teste/RELATORIO-VALIDACAO.md`, fora do vault) e a mudança "Da proposta à comissão" que entrou na `develop` da `api-acos-vital` depois da base anterior. **Nesta atualização:** os 📝 do reteste nas raias 01, 04, 05, 06, 07 e 08, no API-019 (a OC só lê o pedido do Omie: decisão do Nathan de 13/11 de manter assim) e na parte técnica da raia 07; os defeitos de tela como BL-089 a BL-096 ([[Backlog-Reteste-por-Cliques-2026-11-13]]); "Da proposta à comissão" (`8265223`) nas raias 03 e 15, no LOG-56, na BL-069, na T-07 e na AV-Hub-API (rota `pdf_gerado`). **Ainda sem conferir:** a migration `2026-11-13_comercial_proposta_pedido_comissao` (não está no dump de 13/11); o `omie-elt-pipeline` `3aaea0e` só tira a porta do Redis do `docker-compose`, sem efeito no vault.

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `e522962` | 13/11/2026 | `8265223` ("Da proposta à comissão", pedido do Robert), direto na `develop` |
| `av-hub` | `origin/develop` | `c6310ad` | 12/11/2026 | PR #297 (`fix/compras-oc-omie-sem-fornecedor`) |
| `api-pcp` | `origin/develop` | `bd6b442` | 12/11/2026 | PR #81 (`feat/saldo-futuro-oc-estoque`) |
| `app-pcp` | `origin/develop` | `897dcd7` | 12/11/2026 | PR #66 (`feat/saldo-futuro-oc-estoque`) |
| `omie-elt-pipeline` | `origin/develop` (a `master`, de produção, está em `8f79d12`, sem a seed 013; o `conferir-citacoes` lê a `master`) | `3aaea0e` | 13/11/2026 | `3aaea0e` tira a porta do Redis do `docker-compose`; antes, a seed `sql/dba_migrations/013_seed_familia_produtos_hrm.sql` (`46b53d4`, ⏳ pendente do DBA) |

São os commits do `develop-conferida` das notas conferidas nesta atualização; as raias não tocadas ainda dizem commits anteriores.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 13/11/2026 09:40 (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-13.sql`, [[Dump-AvHub-Teste-2026-11-13]]), com o LOG-58b, a SQL-022 e a coluna da SQL-021. As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); o dump é a referência do esquema. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
