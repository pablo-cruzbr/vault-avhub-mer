---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-13
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-13, teste da proposta no Docker local de 13/11, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 13/11/2026. **Motivo:** comando "atualizar o vault" depois dos merges do fim de 12/11. **Conferidas nesta atualização:** o filtro da fila por PV (BL-086, api-acos-vital #309 e av-hub #295), os avisos do MES de ponta a ponta (LOG-58, api-pcp #80 e av-hub #294) e os ajustes de Compras (av-hub #293, #296, #297 e #298) em [[06-Circuito-de-Compra]], na parte técnica 2 e no LOG-58; o menu (#292) em [[Telas-por-Raia]]; o histórico do pedido (#285) em [[03-Pedido-de-Venda-e-Liberacao]]; o prazo da requisição (app-pcp #65) em [[04-PCP-Triagem-e-Destinacao]]; o teste da proposta no Docker de 13/11 em [[01-Proposta-de-Venda]], com a PS-056 e a PS-046 em [[Pontas-Soltas]]; [[Onde-Estamos]]. O saldo futuro (BL-050, api-pcp #81, app-pcp #66, api-acos-vital #310) já tinha entrado no PR #127 do vault. **Ainda sem conferir:** as raias 02, 09, 10, 12 e 14 continuam com o `develop-conferida` antigo; os campos novos de `core.unidades` (`cc3fbb3`); 71 citações quebradas ou deslocadas fora das notas tocadas (a maior parte do `api-comercial` removido e de caminhos ambíguos).

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `9abda4f` | 12/11/2026 | PR #310 (`feat/oc-referencia-aviso-recompra`) |
| `av-hub` | `origin/develop` | `c6310ad` | 12/11/2026 | PR #297 (`fix/compras-oc-omie-sem-fornecedor`) |
| `api-pcp` | `origin/develop` | `bd6b442` | 12/11/2026 | PR #81 (`feat/saldo-futuro-oc-estoque`) |
| `app-pcp` | `origin/develop` | `897dcd7` | 12/11/2026 | PR #66 (`feat/saldo-futuro-oc-estoque`) |
| `omie-elt-pipeline` | `origin/develop` (a `master`, de produção, está em `8f79d12` com o mesmo conteúdo) | `d8fddca` | 12/11/2026 | PR #7 (`feat/tipos-frete`), sem mudança desde 12/11 |

São os commits do `develop-conferida` das notas conferidas nesta atualização; as raias não tocadas ainda dizem commits anteriores.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 12/11/2026 (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-12.sql`, [[Dump-AvHub-Teste-2026-11-12]]). Ele é anterior à migration do encargo da condição (PS-054). As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); o dump é a referência do esquema. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
