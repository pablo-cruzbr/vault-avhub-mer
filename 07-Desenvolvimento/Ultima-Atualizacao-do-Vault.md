---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-16
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-16, reteste R4 no Docker de 16/11/2026 (docker-teste/RETESTE-R4-2026-11-16.md), reteste por cliques no Docker de 13/11/2026 (docker-teste/RETESTE-CLIQUES-2026-11-13.md, fora do vault), conferência completa do vault de 13/11/2026 (docker-teste/conferencia-vault/, fora do vault), reteste R2 no Docker de 13/11/2026 (docker-teste/RELATORIO-VALIDACAO.md seção R2, RETESTE-2026-11-13-AVHUB.md e RETESTE-2026-11-13-MES.md, fora do vault), teste da proposta no Docker local de 13/11, validação local em Docker de 10/11/2026]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 16/11/2026. **Motivo:** o reteste R4 no Docker de 16/11, o fluxo de 0 a 100% pelas telas (`docker-teste/RETESTE-R4-2026-11-16.md`, fora do vault), a decisão N16-166 (item de fabricação não calcula custo, por enquanto) e o que entrou na `develop` desde 13/11: no av-hub, o simulador com visual novo (#299) e o PDF técnico com os dados técnicos do item (#300 e #301); na `api-acos-vital`, os campos "Desvios" e "Pintura/acabamento" do item (`96316f4`). **Nesta atualização:** a N16-166 no [[Registro-de-Decisoes]] (e a N16-09 suspensa em parte); o BL-067 adiado; a nota [[Backlog-Reteste-R4-2026-11-16]] (BL-097 a BL-100); o BL-089 resolvido; [[01-Proposta-de-Venda]] e a parte técnica 2; [[15-Custo-Real-e-Comissao]]; [[Onde-Estamos]]. **Ainda sem conferir:** a migration `2026-11-16_comercial_proposta_item_desvios_pintura` no tst; as citações quebradas fora das notas tocadas.

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `96316f4` | 16/11/2026 | `96316f4` (desvios e pintura do item), direto na `develop` |
| `av-hub` | `origin/develop` | `f63b01b` | 16/11/2026 | PR #301 (`feat/proposta-pdf-tecnico`) |
| `api-pcp` | `origin/develop` | `bd6b442` | 12/11/2026 | PR #81 (`feat/saldo-futuro-oc-estoque`) |
| `app-pcp` | `origin/develop` | `897dcd7` | 12/11/2026 | PR #66 (`feat/saldo-futuro-oc-estoque`) |
| `omie-elt-pipeline` | `origin/develop` (a `master`, de produção, está em `8f79d12`, sem a seed 013; o `conferir-citacoes` lê a `master`) | `3aaea0e` | 13/11/2026 | sem mudança desde 13/11 |

São os commits do `develop-conferida` das notas conferidas nesta atualização; as raias não tocadas ainda dizem commits anteriores.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 13/11/2026 09:40 (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-13.sql`, [[Dump-AvHub-Teste-2026-11-13]]), com o LOG-58b, a SQL-022 e a coluna da SQL-021. As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); o dump é a referência do esquema. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
