---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-12
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-12, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 12/11/2026. **Motivo:** comando "atualizar o vault" depois dos merges de 12/11. Antes, no mesmo dia, o vault já tinha registrado a entrega do Gustavo (API e banco do API-019, do LOG-57 e do LOG-58, `bebca52`) e o front do C6 a C8 e dos avisos do MES (av-hub #282, #283 e #287). **Conferidas nesta atualização:** a tela da proposta (av-hub #278, #279, #286, #288 e #291) em [[01-Proposta-de-Venda]] e na parte técnica 1; o encargo da condição em [[15-Custo-Real-e-Comissao]] e no [[01-Motor-Atual-Como-Calcula]]; o follow-up do CCP (#284) na parte técnica 2 de [[06-Circuito-de-Compra]]; a chave do MES com a rota dos avisos em [[Chaves-e-Autenticacao]] e [[Integracao-AvHub-MES]]; a pipeline (a `develop` nova, o histórico de situação e previsão do pedido e a proposta da `tipos_frete`) em [[Pipeline-Omie]], [[03-Pedido-de-Venda-e-Liberacao]] e no dicionário [[Pedidos-de-Venda]]; as regras e as skills que diziam que a pipeline não tinha `develop`; [[Onde-Estamos]] e [[Pontas-Soltas]] (PS-054). **Ainda sem conferir:** o MES não mudou desde 10/11, e as raias 02, 07, 09, 10, 12 e 14 continuam com o `develop-conferida` antigo; os campos novos de `core.unidades` (`cc3fbb3`); as citações quebradas fora das notas tocadas (o `conferir-citacoes` acusava 73 antes desta atualização, a maior parte do `api-comercial` removido e de caminhos ambíguos).

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `bebca52` | 12/11/2026 | commit direto na `develop`: avisos do MES ao Compras (LOG-58) |
| `av-hub` | `origin/develop` | `d82d58b` | 12/11/2026 | PR #291 (`feat/encargo-condicao-omie`) |
| `api-pcp` | `origin/develop` | `2e564e6` | 10/11/2026 | PR #79 (`docs/guia-para-ia`) |
| `app-pcp` | `origin/develop` | `4c11886` | 10/11/2026 | PR #64 (`docs/guia-para-ia`) |
| `omie-elt-pipeline` | `origin/develop` (existe desde 12/11; a `master`, de produção, está em `8f79d12` com o mesmo conteúdo) | `d8fddca` | 12/11/2026 | PR #7 (`feat/tipos-frete`) |

São os commits do `develop-conferida` das notas conferidas nesta atualização; as raias não tocadas ainda dizem commits anteriores.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 12/11/2026 (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-12.sql`, [[Dump-AvHub-Teste-2026-11-12]]). Ele é anterior à migration do encargo da condição (PS-054). As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); o dump é a referência do esquema. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
