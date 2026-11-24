---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-24
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-24, decisão N16-193 (23/11), git log -1 origin/develop de cada sistema em 2026-11-23, decisões N16-180 a N16-192 (19 a 23/11), git log -1 origin/develop de cada sistema em 2026-11-17, conversa do Nathan de 17/11/2026 (N16-168 a N16-171), git log -1 origin/develop de cada sistema em 2026-11-16, reteste R4 no Docker de 16/11/2026 (docker-teste/RETESTE-R4-2026-11-16.md), reteste por cliques no Docker de 13/11/2026 (docker-teste/RETESTE-CLIQUES-2026-11-13.md, fora do vault), conferência completa do vault de 13/11/2026 (docker-teste/conferencia-vault/, fora do vault), reteste R2 no Docker de 13/11/2026 (docker-teste/RELATORIO-VALIDACAO.md seção R2, RETESTE-2026-11-13-AVHUB.md e RETESTE-2026-11-13-MES.md, fora do vault), teste da proposta no Docker local de 13/11, validação local em Docker de 10/11/2026]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 24/11/2026. **Depois, no mesmo dia (só o MES):** o coletor do Estoque (N16-201; `api-pcp` PR #99, `app-pcp` PR #86) e a sessão vencida do MES (`api-pcp` PR #98, `app-pcp` PR #85) em [[05-Estoque-Atendimento]] e a parte técnica, [[12-Estoque-Despacho]], [[MES-Front]], [[MES-Backend-Detalhe-Tecnico-1]], [[Pontas-Soltas]] (PS-060) e [[Onde-Estamos]]; as linhas do MES abaixo são dessa rodada, as outras seguem as da manhã. **Motivo:** o Nathan pediu de novo o vault com tudo o que está pronto. A rodada de 23/11 (PR do vault #153, base `ce4f90f`, `7f0f7e2`, `c8036db`, `8259344`) já estava na `main`; desde ela, na `develop`: no MES, a retirada do Estoque (`api-pcp` #96, `app-pcp` #83: BL-007) e a matéria-prima pela retirada com a devolução da sobra (`api-pcp` #97, `app-pcp` #84), decisão N16-193; no Hub, `DEVOLVIDO`, o valor provável, a situação `AGUARDANDO_APROVACAO` e a Visão Geral por pedido (`av-hub` #337 e #339). `api-acos-vital` e `omie-elt-pipeline` sem mudança. **Nesta atualização:** [[12-Estoque-Despacho]] (reescrita), [[05-Estoque-Atendimento]] e a parte técnica, [[10-Producao-e-Roteiro]], [[13-Expedicao]], [[MES-Backend]] e as partes, [[MES-Front]], [[Banco-MES]] (com as migrations de 19/11 que faltavam), [[Modelo-Estoque-e-Custo-do-Lote]], [[15-Custo-Real-e-Comissao]], [[AV-Hub-Front]], [[01-Motor-Atual-Como-Calcula]] e a parte 2, [[Registro-de-Decisoes]] (N16-193), [[Pontas-Soltas]] (PS-064 fechada, PS-065), [[Riscos]] (RS-010), [[Backlog-Frente-Robert]] (BL-007 ✅), [[Onde-Estamos]] e [[Tipos-de-ID]]. **Ainda sem conferir:** a situação `AGUARDANDO_APROVACAO` em algum banco (PS-065), o deploy de cada sistema e a produção do MES.

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `ce4f90f` | 23/11/2026 | PR #329 (busca rápida de produto); na `main` até o PR #327 (19/11) |
| `av-hub` | `origin/develop` | `c4a455d` | 23/11/2026 | PR #339 (Visão Geral por pedido e aguardando aprovação); na `main` até o PR #330 (19/11) |
| `api-pcp` | `origin/develop` | `50f0a65` | 24/11/2026 | PR #99 (coletor do Estoque), depois do PR #98 (sessão vencida); na `main` até o PR #84 (18/11) |
| `app-pcp` | `origin/develop` | `03fb038` | 24/11/2026 | PR #86 (coletor do Estoque), depois do PR #85 (sessão vencida); na `main` até o PR #69 (18/11) |
| `omie-elt-pipeline` | `origin/develop` (a `master` é a produção) | `e42b65d` | 18/11/2026 | PR #10 (padrão de comentários) |

São os commits do `develop-conferida` das notas conferidas nesta atualização; as raias não tocadas ainda dizem commits anteriores.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 23/11/2026 12:00 (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-23.sql`, [[Dump-AvHub-Teste-2026-11-23]]), com a comissão de 18 a 23/11 e a estrutura do `LOG-62`; o de **produção** é o de 18/11 ([[Dump-AvHub-Producao-2026-11-18]]). As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); o dump é a referência do esquema. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
