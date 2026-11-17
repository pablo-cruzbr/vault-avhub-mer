---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-17
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-17, conversa do Nathan de 17/11/2026 (N16-168 a N16-171), git log -1 origin/develop de cada sistema em 2026-11-16, reteste R4 no Docker de 16/11/2026 (docker-teste/RETESTE-R4-2026-11-16.md), reteste por cliques no Docker de 13/11/2026 (docker-teste/RETESTE-CLIQUES-2026-11-13.md, fora do vault), conferência completa do vault de 13/11/2026 (docker-teste/conferencia-vault/, fora do vault), reteste R2 no Docker de 13/11/2026 (docker-teste/RELATORIO-VALIDACAO.md seção R2, RETESTE-2026-11-13-AVHUB.md e RETESTE-2026-11-13-MES.md, fora do vault), teste da proposta no Docker local de 13/11, validação local em Docker de 10/11/2026]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 17/11/2026. **Motivo:** o Nathan informou a MEGA aplicada em produção pelo Gustavo, pediu a `develop` de todos os sistemas na `main` e mudou a equipe do Comercial (N16-168 a N16-171). Na `develop`, desde a base de 16/11: `api-acos-vital` `96e83de` (exclusão lógica da proposta, LOG-59) e `av-hub` `ca3526b`, `63f9afb` e `e073fe0` (coluna Pedido Omie, revenda completa no compositor, exclusão e "Excluído no Omie"); `omie-elt-pipeline` `28efc5a` (porta 6379 do Redis mantida); MES sem mudança. **Nesta atualização:** [[Registro-N16-167-em-diante]], [[Registro-de-Decisoes]], [[Tipos-de-ID]], [[Equipe-e-Divisao]], [[Regras-do-Vault]], [[Capacidade-do-Robert]], [[Cronograma]], [[Banco-AvHub]], [[01-Proposta-de-Venda]] e a parte técnica 2, `LOG-59` e [[Contratos-da-v2]], [[Integracao-AvHub-MES-Detalhe-Tecnico-2]], [[Backlog-Frente-Nathan-Proposta-Omie-e-Comissao]] e [[Onde-Estamos]]. **Ainda sem conferir:** o deploy de cada sistema, as 17 migrations do MES aplicadas em produção e a produção do Hub por dump.

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `96e83de` | 16/11/2026 | `96e83de` (exclusão lógica da proposta), direto na `develop`; na `main` pelo PR #311 (17/11) |
| `av-hub` | `origin/develop` | `4cce84b` | 17/11/2026 | PR #304 (`feat/proposta-exclusao`); na `main` pelo PR #305 (17/11) |
| `api-pcp` | `origin/develop` | `bd6b442` | 12/11/2026 | PR #81 (`feat/saldo-futuro-oc-estoque`); na `main` pelo PR #82 (17/11) |
| `app-pcp` | `origin/develop` | `897dcd7` | 12/11/2026 | PR #66 (`feat/saldo-futuro-oc-estoque`); na `main` pelo PR #67 (17/11) |
| `omie-elt-pipeline` | `origin/develop` (a `master`, de produção, recebeu a `develop` em 17/11 pelo PR #9, com a seed 013) | `28efc5a` | 17/11/2026 | `28efc5a` (porta do Redis), direto na `develop` |

São os commits do `develop-conferida` das notas conferidas nesta atualização; as raias não tocadas ainda dizem commits anteriores.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 16/11/2026 13:58 (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-16.sql`, que substituiu o das 11:23, [[Dump-AvHub-Teste-2026-11-16]]), com o "Da proposta à comissão" e os campos "Desvios" e "Pintura" do item. As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); o dump é a referência do esquema. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
