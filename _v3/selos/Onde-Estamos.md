# Selos de Onde-Estamos contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio Onde-Estamos`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|

## ✅ sem repositório nem arquivo citado (14)

- linha 17: > **O critério de pronto é a `develop` dos sistemas**: se está na `develop`, o selo é ✅. A `develop` está congelada e é a versão mais atualizada; o software ain
- linha 31: | [[04-PCP-Triagem-e-Destinacao]] | ✅ Triagem e Destinação · 🔴 volta de reprovado | Robert | Caminho para o item reprovado (retrabalho ou nova compra); mostrar
- linha 32: | [[05-Estoque-Atendimento]] · [[09-Estoque-Entrada-do-Lote]] · [[12-Estoque-Despacho]] | ✅ Atendimento · 🔴 despacho | Robert | Documento de retirada com baixa
- linha 35: | [[07-Recebimento]] | ✅ Recebimento por OC e por NF na `develop` | Robert | Conferir contra a OC (preço, quantidade, fornecedor, N16-135); rateio da chegada; t
- linha 36: | [[08-Qualidade-Entrada]] | ✅ Pronto | Robert, Gustavo | Recompra por RNC (relatório de não conformidade) ainda sem contrato |
- linha 37: | [[10-Producao-e-Roteiro]] | ✅ Filas · 🔴 consumo | Robert | Baixar a matéria-prima consumida; gravar os status `EM_PRODUCAO` e `BLOQUEADO`; tela de divergênci
- linha 48: | Status por item | ✅ Pronto |
- linha 67: | [[04-PCP-Triagem-e-Destinacao]] | P1, P2, P6 | ✅ P1/P2 · 🔴 P6 | Novo norte (retrabalho ou reabre compra): o motor passou a ler o `RoteiroItem`, mas a volta d
- linha 68: | [[05-Estoque-Atendimento]] (E1–E4) · [[09-Estoque-Entrada-do-Lote]] (E5) · [[12-Estoque-Despacho]] (E6) | E1–E6 | ✅ E1–E5 · 🔴 E6 | **Documento de retirada co
- linha 71: | [[07-Recebimento]] | R0–R6 | ✅ | ✅ custo da OC no lote, recebimento por OC e por NF (várias OCs na mesma nota, N16-136) na `develop`; falta a conferência cont
- linha 72: | [[08-Qualidade-Entrada]] | Q1–Q4 | ✅ | Recompra por RNC sem contrato | Robert, Gustavo |
- linha 73: | [[10-Producao-e-Roteiro]] | F1 | ✅ filas · 🔴 consumo | Consumo de matéria-prima; `EM_PRODUCAO` e `BLOQUEADO` nunca são gravados; divergência de produção sem 
- linha 74: | [[11-Qualidade-Saida]] | Q7, Q8 | 🟡 | ✅ `aprovar-saida` e `receber-fabricado`: o aprovado volta ao Estoque como lote `PRODUCAO` (`develop`, 27/10); confirmar
- linha 84: | Status por item (API-005, API-006) | ✅ |

## Citações deslocadas (o identificador está em outra linha) (0)

