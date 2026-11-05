---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-05 (origin/master no omie-elt-pipeline), _v3/PROGRESSO.md (seção Ambiente)]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 05/11/2026. **Motivo:** construção da v3 do vault (branch `v3`, Blocos 3 a 6; reconferida no Bloco 7).

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `b97981c` (`b97981c4ba120691afbd4c9602417c3888e66e2b`) | 03/11/2026 | PR #306 (`feat/orcamento-pdf-...`) |
| `av-hub` | `origin/develop` | `2e5456d` (`2e5456dfa9c8f313031650e4aded58dbabe20a77`) | 05/11/2026 | PR #258 (`feat/proposta-compo...`) |
| `api-pcp` | `origin/develop` | `befd973` (`befd9731018f3d7b851fd74f7af7f7abe51b799a`) | 27/10/2026 | PR #78 (`feat/op-lote-fabrica...`) |
| `app-pcp` | `origin/develop` | `93f96de` (`93f96dece30c84b0088229ae5bc4b8d0ad640ed3`) | 27/10/2026 | PR #63 (`feat/op-lote-fabrica...`) |
| `omie-elt-pipeline` | `origin/master` (não tem `develop`) | `5e7e94d` (`5e7e94d3b424431104c97f0a0e64021e0786805a`) | 05/11/2026 | PR #4 (`feat/produto-vendas-c...`) |

São os mesmos commits do `develop-conferida` das notas de raia.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 04/11/2026 23:58, enviado pelo Nathan: [[Dump-AvHub-Teste-2026-11-04]]. O de 29/10 continua em `api-acos-vital` (`Dump do Avhub para referência (29.10).sql`, na `develop`). Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
