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

**Data:** 16/11/2026 (tarde). **Motivo:** o esqueleto do banco de teste de 16/11 ([[Dump-AvHub-Teste-2026-11-16]]), a conferência do Docker contra ele e os retestes R5 e R6 pela API (`docker-teste/RETESTE-R5-2026-11-16-*.md` e `RETESTE-R6-2026-11-16-*.md`, fora do vault); na `develop`, só a `api-acos-vital` `2e333e3` (nº do Omie na lista de propostas) desde a base da manhã. **Nesta atualização:** [[Dump-AvHub-Teste-2026-11-16]] e [[Banco-AvHub]]; a nota [[Backlog-Reteste-R5-R6-2026-11-16]] (BL-101 a BL-107); [[01-Proposta-de-Venda]] e a parte técnica 2; [[06-Circuito-de-Compra]]; [[08-Qualidade-Entrada]]; [[10-Producao-e-Roteiro]]; [[15-Custo-Real-e-Comissao]] ("Da proposta à comissão" no tst); [[Onde-Estamos]]. A base anterior (manhã de 16/11) foi o reteste R4 e a N16-166. **Depois, no mesmo dia:** o dump das 13:58 trouxe a migration `2026-11-16_comercial_proposta_lista_pedido_omie` (BL-101 resolvido) e o status do Gustavo (PDF de 16/11) foi registrado nos LOG-56, LOG-57 e LOG-58, no [[Banco-AvHub]] (fila da produção) e no BL-095. **Ainda sem conferir:** as citações quebradas fora das notas tocadas.

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `2e333e3` | 16/11/2026 | `2e333e3` (nº do Omie na lista de propostas), direto na `develop` |
| `av-hub` | `origin/develop` | `f63b01b` | 16/11/2026 | PR #301 (`feat/proposta-pdf-tecnico`) |
| `api-pcp` | `origin/develop` | `bd6b442` | 12/11/2026 | PR #81 (`feat/saldo-futuro-oc-estoque`) |
| `app-pcp` | `origin/develop` | `897dcd7` | 12/11/2026 | PR #66 (`feat/saldo-futuro-oc-estoque`) |
| `omie-elt-pipeline` | `origin/develop` (a `master`, de produção, está em `8f79d12`, sem a seed 013; o `conferir-citacoes` lê a `master`) | `3aaea0e` | 13/11/2026 | sem mudança desde 13/11 |

São os commits do `develop-conferida` das notas conferidas nesta atualização; as raias não tocadas ainda dizem commits anteriores.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 16/11/2026 13:58 (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-16.sql`, que substituiu o das 11:23, [[Dump-AvHub-Teste-2026-11-16]]), com o "Da proposta à comissão" e os campos "Desvios" e "Pintura" do item. As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); o dump é a referência do esquema. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
