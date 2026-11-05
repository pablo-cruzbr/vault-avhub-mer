---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-05 (origin/master no omie-elt-pipeline), 07-Desenvolvimento/v3/PROGRESSO.md (seção Ambiente)]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 05/11/2026. **Motivo:** atualização pelo comando "atualizar o vault" depois da v3: só a `api-acos-vital` andou (`b97981c` para `1654f65`, envio síncrono do pedido ao Omie); os outros quatro sistemas seguem nos commits da v3. Conferido nas notas [[01-Proposta-de-Venda]] (e a parte 1 do detalhe), [[03-Pedido-de-Venda-e-Liberacao]], [[AV-Hub-API]], [[Onde-Estamos]], o backlog do Nathan (BL-076, BL-080, BL-081), [[Banco-AvHub]] e [[Dump-AvHub-Teste-2026-11-04]]. **Conferidos depois, no mesmo dia:** [[06-Circuito-de-Compra]] e suas partes (só as linhas citadas deslocaram; as travas da requisição agora são fixas), [[RBAC-e-Permissoes]], [[Mapa-IncluirPedido-Omie]] (e a parte 2), a tabela e o diagrama do [[00-Fluxo-Mestre-0b]] (`V0.7` amarelo, sem fila) e o [[Roteiro-da-Proposta-em-Diante]]. **Ainda sem conferir:** o BL-064 do backlog do Gustavo (diz que a finalidade obrigatória depende da chave `COMPRAS_REQUISICAO_EXIGIR_CADASTRO`, que o código não lê mais), as citações de `acessoConfig.js` em notas fora destas (as linhas deslocaram) e as citações de `ordens_compra.route.js` e `requisicoes_compra.route.js` em notas que não são as de Compras.

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `1654f65` | 05/11/2026 | commit direto na `develop`: "envio síncrono de pedidos ao Omie" (o commit anterior era `b97981c`, PR #306) |
| `av-hub` | `origin/develop` | `2e5456d` (`2e5456dfa9c8f313031650e4aded58dbabe20a77`) | 05/11/2026 | PR #258 (`feat/proposta-compo...`) |
| `api-pcp` | `origin/develop` | `befd973` (`befd9731018f3d7b851fd74f7af7f7abe51b799a`) | 27/10/2026 | PR #78 (`feat/op-lote-fabrica...`) |
| `app-pcp` | `origin/develop` | `93f96de` (`93f96dece30c84b0088229ae5bc4b8d0ad640ed3`) | 27/10/2026 | PR #63 (`feat/op-lote-fabrica...`) |
| `omie-elt-pipeline` | `origin/master` (não tem `develop`) | `5e7e94d` (`5e7e94d3b424431104c97f0a0e64021e0786805a`) | 05/11/2026 | PR #4 (`feat/produto-vendas-c...`) |

São os commits do `develop-conferida` das notas de raia **conferidas**; as raias não tocadas nesta atualização ainda dizem `b97981c` para a `api-acos-vital`.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 04/11/2026 23:58, enviado pelo Nathan: [[Dump-AvHub-Teste-2026-11-04]]. O de 29/10 saiu da `develop` no `1654f65`; relê-se com `git show b97981c:"Dump do Avhub para referência (29.10).sql"` em `api-acos-vital`. As migrations de 05/11 que o código cita não estão no repositório. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
