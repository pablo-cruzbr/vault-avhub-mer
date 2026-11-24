---
tags: [desenvolvimento, plano, qualidade, qualidade-entrada, qualidade-saida, mes, av-hub, proposta]
criado: 2026-11-24
estado-em: 2026-11-24
status: proposta
dono: Pablo
develop-conferida: [api-pcp 50f0a65 (develop), av-hub feat/qualidade-v2 (PR 338, rascunho, fora da develop), em 2026-11-24]
fontes: [api-pcp src/qualidade e src/itens-parciais (leitura em 24/11), SQL-025, API-023, 08-Qualidade-Entrada, 11-Qualidade-Saida, Registro-N16-117-a-N16-149]
---

# Qualidade v2: plano de ligação (Hub e MES)

**Em uma frase:** divide a SQL-025 em duas entregas pequenas no MES, compara as telas do Hub com as rotas que o MES já tem e separa o que já está decidido do que contraria uma decisão.

**Quando consultar:** antes de começar a reprovação parcial na saída (N16-128), o fechamento da RNC (registro de não conformidade) ou a ligação do Hub ao MES.

## 1. Duas entregas pequenas

As duas são no `api-pcp` e no `app-pcp`, em PRs separados. Nenhuma depende das telas novas do Hub.

### Entrega A: reprovar só uma parte na saída (N16-128)

Já decidida, sem migração de banco.

| Onde | O que muda |
|---|---|
| `ReprovarItemParcialDto` | Campo opcional `quantidade`, igual ao de `AprovarSaidaItemParcialDto` |
| `ItensParciaisService.reprovar` | Sem quantidade ou igual à da parcela: como hoje. Menor: baixa a quantidade da original, que segue em inspeção, e cria a parcela reprovada |
| Parcela reprovada | `REPROVADO`, no mesmo setor, com `idParcialOrigem` e com o **`idSetorOrigem` da original** (sem ele, `retrabalho` responde 409) |
| Divergência e histórico | Ligados à parcela nova |
| `app-pcp` | Campo de quantidade no botão Reprovar |

O `aprovarSaida` já divide a parcela do mesmo jeito, então é o modelo. O `split` não serve: só aceita `RECEBIDO`.

**Aceite:** com 100 peças, reprovar 5 deixa 95 em inspeção e 5 reprovadas; a soma continua 100; as 5 podem ir a retrabalho ou falso alarme; quantidade zero ou maior que a parcela é recusada; duas chamadas ao mesmo tempo não passam da quantidade.

### Entrega B: fechar a RNC da entrada

Precisa de migração pequena. A nota continua sendo emitida no Omie.

| Onde | O que muda |
|---|---|
| `rncs` | Colunas novas, todas anuláveis: `numero_nota_devolucao`, `encerrada_em`, `encerrada_por_id` |
| Rota nova | `POST /qualidade/rncs/:id/fechar` com `{ numeroNotaDevolucao }`, permissão `inspecao-entrada` editar |
| Serviço | Numa transação: trava o lote, confere que está `REPROVADO`, dá saída do saldo com `registrarSaidaDoLote`, põe `nota_devolucao_pendente = false` e grava quem fechou |
| Alerta | `GET /estoque/alertas/rnc-pendentes` já filtra pela marca, então a RNC sai sozinha |

**Aceite:** fechar zera o saldo do lote reprovado, com movimento no livro; fechar de novo responde 409; lote com reserva ou em inventário travado é recusado sem mudar nada.

**A definir:** quem fecha (Qualidade ou Estoque) e o que acontece se a reposição chegar antes da baixa (aberto na N16-126).

Ficam para depois, fora de A e B: numeração da RNC, causa e ação, conferência item a item, segregação, dossiê e anexos.

## 2. Telas do Hub e rotas que o MES já tem

| Ação no Hub | Rota no MES (`develop`) | Situação |
|---|---|---|
| Fila da entrada | `GET /qualidade/lotes` | Parcial: só devolve `PENDENTE`, sem RNC, corrida nem resumo |
| Aprovar lote | `POST /qualidade/lotes/:id/aprovar` | Existe; pede só `laudoUrl`, sem conferência |
| Reprovar lote | `POST /qualidade/lotes/:id/reprovar` | Existe, com parte; sem conferência |
| Tratativa da RNC | Não existe | Falta |
| Fechar a RNC | Não existe | Entrega B |
| Receber e iniciar a peça | `PATCH /itens-parciais/:id/receber` e `/iniciar` | Existe |
| Aprovar a peça | `PATCH /itens-parciais/:id/aprovar-saida` | Existe; o Hub chama `mover` (ver abaixo) |
| Reprovar a peça | `PATCH /itens-parciais/:id/reprovar` | Existe, só inteira: Entrega A |
| Falso alarme | `PATCH /itens-parciais/:id/resolver` | Existe |
| Retrabalho | `PATCH /itens-parciais/:id/retrabalho` | Existe; volta ao setor anterior (N16-141 pede escolha) |
| Reparo, substituição, devolução, descarte e concessão | Não existem como tratativa da saída | Falta |
| Segregação e conferência da saída | Não existem | Falta |
| Dossiê, laudo digital e anexos | Não existem | Falta, no Hub |

### Diferenças que precisam de ajuste

1. **`mover` não aprova mais.** No MES a inspeção de saída usa `aprovar-saida`, e o controller diz que `mover` é recusado nesse setor. O Hub e o `API-023` ainda dizem `mover`.
2. **O Hub e a SQL-025 usam caminhos diferentes na saída:** o código chama `PATCH /itens-parciais/:id/:acao`; a SQL-025 propõe `POST /qualidade/saida/parciais/:id/:acao`.
3. **`rncs.motivo` já existe** no MES. A SQL-025 pede para criar.
4. **Retrabalho troca o id:** a parcela reprovada vira `CANCELADO` e nasce outra, com `idDevolvidoDe`. Uma RNC ligada à parcela tem de seguir esse vínculo.
5. **Nomes:** o MES usa `laudoUrl` e `quantidadeReprovada`; o Hub, `laudo_url` e `quantidade_reprovada`.

### O que mais trava: gravar no MES a partir do Hub

As rotas do MES que o Hub consulta com chave são de leitura. As da Qualidade exigem o login do usuário **do MES** e, na saída, o vínculo dele com o setor. Só ajustar o caminho da chamada não basta.

| Opção | Prós | Contras |
|---|---|---|
| **a. Decisão fica no MES (recomendada agora)** | A e B saem sem esperar integração; uma fonte de verdade | As telas novas do Hub esperam ou viram consulta |
| b. Hub grava no MES por rota nova de serviço | Uma tela só, no Hub | Precisa identificar o usuário no MES e refazer permissão e auditoria |
| c. Decisão passa ao Hub | Tudo no Hub | Saldo e parcelas estão no MES: perde a transação única |

## 3. O que já está decidido e o que contraria

| Assunto no PR 338 | Regra atual | Situação |
|---|---|---|
| Laudo, motivo e evidência na entrada | Igual | Decidido |
| Reprovar parte na saída | N16-128 | Decidido, pode avançar |
| Travar a decisão à Qualidade | N16-124 | Decidido, falta no MES |
| Fechar a RNC da entrada | Falta listada em [[08-Qualidade-Entrada]] | Pode avançar; falta definir quem fecha |
| Escolher o setor de volta no retrabalho | N16-141 | Decidido; o Hub não tem a escolha |
| **Checklist na saída** | **N16-129: sem laudo nem checklist** (Nathan, 29/10) | **Contraria**: Nathan confirma, além da Mayara (QT-05) |
| **RNC na saída** | Não gera RNC | **Contraria**: Cadu (QT-10) |
| **Concessão na saída** | N16-125 recusa concessão **de lote**; sobre a peça da saída não há regra | **Depende**: Cadu (QT-11) e Nathan |
| Conferência de 14 itens, causa e ação na entrada | Sem regra | Novo: Mayara (QT-01) |
| Segregação e tratativas além de retrabalho e falso alarme | Só duas saídas na fila | Novo: Mayara (QT-06 e QT-08) |
| Documentação ao cliente | Sem nota no vault oficial | Novo: Mayara (QT-12 a QT-16) |

## Ver também

[[SQL-025-Qualidade-v2-Banco-e-API]] · `API-023` · [[Perguntas-Qualidade-Mayara]] · [[08-Qualidade-Entrada]] · [[11-Qualidade-Saida]]
