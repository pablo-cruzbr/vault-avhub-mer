---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-11
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-10 (origin/master no omie-elt-pipeline), validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 10/11/2026. **Motivo:** atualização pelo comando "atualizar o vault" com o resultado da validação ponta a ponta feita em Docker local em 10/11/2026 (o fluxo físico, do pedido 28189 liberado até a entrega, rodou na `develop`). O teste rodou no av-hub `6fcbba6` e na api-acos-vital `d8de255`; depois dele a `develop` andou e o vault registra a de hoje: o av-hub PR #277 pôs no modal do transformar as duas respostas que faltavam (Qualidade e faturar em partes), e a api-acos-vital `cc3fbb3` acrescentou campos de cabeçalho de documento em `core.unidades` (ainda não descritos no vault). **Conferidas nesta atualização:** as raias [[01-Proposta-de-Venda]], [[03-Pedido-de-Venda-e-Liberacao]], [[04-PCP-Triagem-e-Destinacao]], [[05-Estoque-Atendimento]], [[06-Circuito-de-Compra]], [[08-Qualidade-Entrada]], [[11-Qualidade-Saida]], [[13-Expedicao]] e [[15-Custo-Real-e-Comissao]] (com as partes), [[Telas-por-Raia]], [[RBAC-e-Permissoes]], [[Onde-Estamos]], o backlog (BL-086 a BL-088; evidência no BL-003 e no BL-067), [[Pontas-Soltas]] (PS-046 a PS-053), [[Riscos]] (RS-023) e as perguntas OQ-49 a OQ-53. Antes, no mesmo dia, as citações de 16 notas de comissão, MES, estados e custo foram conferidas na `develop` de 10/11. **Ainda sem conferir:** as raias 02, 07, 09, 10, 12 e 14 continuam com o `develop-conferida` antigo; os campos novos de `core.unidades` (`cc3fbb3`).

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `cc3fbb3` | 10/11/2026 | commit direto na `develop`: campos de cabeçalho de documento em `unidades` |
| `av-hub` | `origin/develop` | `44bb770` | 10/11/2026 | PR #277 (`feat/log-56-passo-11-qualidade-faturar-partes`) |
| `api-pcp` | `origin/develop` | `2e564e6` | 10/11/2026 | PR #79 (`docs/guia-para-ia`) |
| `app-pcp` | `origin/develop` | `4c11886` | 10/11/2026 | PR #64 (`docs/guia-para-ia`) |
| `omie-elt-pipeline` | `origin/master` (não tem `develop`) | `0593c9f` | 10/11/2026 | PR #5 (`docs/guia-para-ia`) |

São os commits do `develop-conferida` das notas **conferidas** nesta atualização; as raias não tocadas ainda dizem os commits de 05/11.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 10/11/2026 (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-10.sql`). As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); o dump é a referência do esquema. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
