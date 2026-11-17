---
id: LOG-59
titulo: Excluir proposta pelo Hub e tratar o pedido excluído direto no Omie
status: parcial
autor: Robert (pedido), Nathan (ajustes e registro)
data: 2026-11-16
camadas: [frontend, backend, api, sql]
donos: {frontend: Robert, backend: Gustavo, api: Gustavo, sql: Gustavo}
nos_0b: [V0.4, V0.6, V0.7]
notas_afetadas: [01-Proposta-de-Venda, 01-Proposta-de-Venda-Detalhe-Tecnico-2, 03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2, Estados-e-Status, Colunas-Protegidas]
depende_de: [LOG-56]
decisoes: [N16-167, N16-03, N16-84, N16-02]
develop-conferida: [api-acos-vital 96e83de, av-hub 4cce84b, omie-elt-pipeline 28efc5a, em 2026-11-17]
tags: [contrato, proposta, exclusao, omie, pipeline]
criado: 2026-11-16
estado-em: 2026-11-17
dono: Nathan
fontes: [PDF de Robert de 16/11/2026 ("Exclusão de proposta e pedido excluído no Omie"), resposta do Nathan de 16/11/2026 (Documentos-para-o-Nathan/2026-11-16_Resposta_Nathan_exclusao-de-proposta.pdf, fora do vault), Dump-AvHub-Teste-2026-11-16, api-acos-vital develop 2e333e3, av-hub develop 25e0a34, omie-elt-pipeline develop 3aaea0e]
---

# LOG-59 · Excluir proposta pelo Hub e tratar o pedido excluído direto no Omie

> **Situação em 17/11:** 🟡 parcial.
> - ✅ **API (Parte A):** a exclusão lógica está na `develop`: `api-acos-vital` `96e83de` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:759` (`router.delete("/propostas/:id"`). A API também lê o pedido excluído no Omie (`src/schemas/core_comercial/pedidoOmie.js:91`, `excluido_omie_em`).
> - ✅ **Tela:** excluir pela lista e pelo andamento, e o "Excluído no Omie" na linha do tempo: `av-hub` `e073fe0` `components/Propostas/PropostasLista.tsx:284` (`await excluirProposta(p.id, p.versao)`) e `lib/domain/andamento-proposta.ts:166` (`Excluído no Omie em`).
> - ❓ **Banco:** a API cita a migration `2026-11-16_comercial_proposta_exclusao_pedido_excluido_omie` (`src/utils/erroHttp.js:143`, `fn_proposta_excluir`). Ela não estava na lista das 20 da MEGA aplicada em produção em 17/11 (N16-171) e não foi conferida em dump.
> - 🔴 **Pipeline:** a trava do `exclusionSync` para resposta vazia do Omie não está na `develop` da `omie-elt-pipeline` (`28efc5a`).

## 1. Resumo em linguagem simples

O vendedor passa a poder **excluir uma proposta** pelo Hub, mas só quando isso é seguro: aberta, cancelada, expirada, ou "virou pedido" com um pedido que nunca chegou ao Omie. A exclusão só esconde; nada é apagado do banco. Proposta aprovada se cancela com motivo, e pedido que está no Omie se exclui pela tela de pedidos.

Quando alguém **exclui o pedido direto no Omie**, a proposta que virou esse pedido passa a um status novo, "Excluído no Omie". A partir dele, o vendedor copia a proposta para refazer a venda. Se a exclusão tiver sido engano e o pedido voltar, a proposta volta a "Virou pedido".

## 2. Contexto: o que deve ser feito e por quê

- **O problema hoje:** a lista de propostas já tem a exclusão, uma a uma e em lote, e chama `DELETE /comercial/propostas/{id}` (`av-hub` `services/comercial/propostas.ts:576` (`export function excluirProposta(`)). A API não tem essa rota: as rotas de `propostas.route.js` são criar, listar, resumo, detalhe, eventos, revisar, aprovar, cancelar, copiar, transformar, prontidão e PDF (`api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:394` (`router.post("/propostas"`)). Além disso, a proposta cujo pedido falhou no Omie fica presa em "Virou pedido", com o "Tentar novamente" como única saída.
- **Pedido excluído no Omie:** a proposta continua dizendo "Virou pedido" e aponta para um pedido que não existe mais.
- **Quem sofre:** o vendedor, que não limpa a própria lista e não sabe que o pedido sumiu; os indicadores do `/resumo`, que contam a proposta como convertida.
- **De onde vem:** pedido do Robert de 16/11/2026, com a regra combinada com o Nathan; ajustado pelo Nathan na mesma data, depois de conferir a pipeline e o banco (N16-167).
- **Se não for feito:** o botão de excluir dá erro, as propostas presas ficam na lista para sempre e a taxa de conversão fica inflada.

## 3. Onde fica no fluxo

Nós `V0.4` (aprovar), `V0.6` (transformar) e `V0.7` (pedido no Omie) do [[00-Fluxo-Mestre-0b]], raia [[01-Proposta-de-Venda]]. Toca também o cancelamento do pedido na raia [[03-Pedido-de-Venda-e-Liberacao]] (item 13 de "O que falta", na parte técnica 2), sem resolvê-lo.

## 4. Como está hoje

| Camada | Estado |
|---|---|
| Front | 🟡 A lista oferece "Excluir" a quem tem `propostas:pode_deletar` (`av-hub` `components/Propostas/PropostasLista.tsx:253` (`const podeExcluir = can('pode_deletar');`)) e chama a rota que não existe |
| API | 🔴 Sem `DELETE /comercial/propostas/{id}` |
| Banco | ✅ `core_comercial.propostas` já tem `deleted_at` e `deleted_by` ([[Dump-AvHub-Teste-2026-11-16]]); o evento `EXCLUIDA` já está no `ck_propostas_eventos_tipo` (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-16.sql:18917` (`ck_propostas_eventos_tipo`)). 🔴 O status é `varchar(12)` e o `CHECK` só aceita cinco valores (`:4426` (`status character varying(12)`), `:4496` (`ck_propostas_status`)); evento sem usuário só no `EXPIRADA` (`:18918` (`ck_propostas_eventos_usuario`)) |
| Pipeline | O pedido excluído no Omie é **apagado** do espelho, não marcado: `omie-elt-pipeline` `src/jobs/exclusionSync.ts:136` (`DELETE FROM core_vendas_faturamento.pedidos_vendas`), a cada 20 minutos (janela de 60 dias) e uma vez por dia às 4h27 (janela de 180 dias) (`src/config/index.ts:110` (`exclusionSyncCurtaCron`)). Não há trava para resposta vazia do Omie (`src/jobs/exclusionSync.ts:109` (`const excluidos = rows.filter`)) |
| Indicadores | A conversão do `/resumo` é transformadas sobre decididas (transformadas, canceladas e expiradas) (`propostas.route.js:524` (`const decididas`)) |

## 5. Regras de negócio

- **R1.** Excluir pela proposta só em `ABERTA`, `CANCELADA`, `EXPIRADA`, no status novo da R6, e em `TRANSFORMADA` cujo pedido nunca chegou ao Omie (R3). N16-167.
- **R2.** `APROVADA` não se exclui: cancela-se com o motivo (N16-03). `TRANSFORMADA` com pedido no Omie, inclusive cancelado no Omie, não se exclui pela proposta: o pedido se exclui pela tela de pedidos, num contrato à parte. Quem exclui pedido é o vendedor (N16-84).
- **R3.** Antes de excluir uma `TRANSFORMADA` sem pedido no Omie, a API consulta o Omie pelo PV (`ConsultarPedido` pelo código de integração, como o `/transformar`). Se o pedido existir, grava o número e recusa. Se não existir, a exclusão leva junto a proposta, o pedido do Hub e a simulação v1 em `RASCUNHO`.
- **R4.** A exclusão é lógica (`deleted_at`, `deleted_by`): a numeração não ganha buraco nem é reaproveitada. A proposta excluída some da lista, do `/resumo`, da busca e das propostas do cliente; o detalhe responde 404. Grava o evento `EXCLUIDA` com quem excluiu.
- **R5.** Cada recusa tem um `codigo` próprio.
- **R6.** Quando o pedido nascido de proposta some do espelho (a pipeline apaga a linha), a proposta vai de `TRANSFORMADA` ao status novo ("Excluído no Omie"). O pedido do Hub guarda o número e a data da exclusão; a lista deixa de mostrar o número; a linha do tempo ganha um evento; a simulação v1 em `RASCUNHO` é excluída (se já tiver sido enviada, não se mexe e o Robert é avisado).
- **R7.** No status novo: copiar e excluir, sim; editar, aprovar, cancelar e transformar, não. Ele entra no filtro da lista e no `por_status` do `/resumo`, e conta como decidida e não convertida (como cancelada e expirada).
- **R8. Caminho de volta.** Se o pedido reaparecer no espelho (exclusão por engano ou falha da pipeline), a proposta volta a `TRANSFORMADA`, com um evento de volta, e a simulação v1 é refeita ou restaurada. N16-167.
- **R9.** Pedido cancelado no Omie (`cancelado = true`, sem exclusão) não muda a proposta.

## 6. Frontend

- **Sistema e tela:** av-hub, Propostas (lista e detalhe). Dono: Robert.
- O botão "Excluir" só aparece nos status da R1; a recusa da API continua valendo e a tela mostra a mensagem do `detail`/`error`, reagindo pelo `codigo`.
- Status novo na lista e no detalhe, com o rótulo "Excluído no Omie" e a ação "Copiar".
- Em "Virou pedido" sem pedido no Omie, a ação "Excluir" ao lado de "Tentar novamente".
- Evento novo na linha do tempo (exclusão no Omie e volta).

## 7. Backend

- **Repositório e módulo:** `api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/`. Dono: Gustavo.
- A exclusão roda numa transação: proposta, pedido do Hub e simulação v1 (R3, R4).
- A consulta ao Omie da R3 usa a conta Omie da unidade do pedido, como o envio. Se o Omie não responder, recusa (não exclui no escuro).
- **Pipeline (Gustavo e Robert):** trava no `exclusionSync` para não apagar nada quando o Omie devolver zero pedidos, ou muito menos do que o banco tem na janela. Isso protege o espelho inteiro, não só a proposta.

## 8. API

| Método | Rota | Quem chama | Permissão |
|---|---|---|---|
| `DELETE` | `/comercial/propostas/{id}` | BFF da lista e do detalhe | `propostas:pode_deletar`, com o mesmo escopo das outras ações |

- **Request:** sem corpo; `If-Match` com a versão, como no `PUT` (o front já manda).
- **Sucesso:** 200 (ou 204), com a proposta excluída deixando de aparecer.
- **Erros:** 404 fora do escopo ou já excluída; 409 `VERSAO_DESATUALIZADA`; 428 sem `If-Match`; 409 com `codigo` próprio para aprovada, para pedido no Omie e para pedido achado na consulta da R3. Os nomes dos códigos são do Gustavo; ponto de partida: `PROPOSTA_APROVADA_NAO_EXCLUI`, `PEDIDO_NO_OMIE_NAO_EXCLUI`, `PEDIDO_ENCONTRADO_NO_OMIE`.
- **Repetida:** excluir de novo responde 404.
- **Lista e resumo:** o status novo entra nos filtros e no `por_status`; a conversão segue a R7.

## 9. Banco (SQL)

- `core_comercial.propostas.status`: aumentar o campo ou escolher um nome de até 12 letras ("EXCLUIDA_OMIE" tem 13); incluir o status novo no `ck_propostas_status`.
- `core_comercial.propostas_eventos`: tipos novos (exclusão no Omie e volta; `PEDIDO_EXCLUIDO_OMIE` cabe no `varchar(20)`) no `ck_propostas_eventos_tipo`, liberados da exigência de usuário no `ck_propostas_eventos_usuario`.
- `core_comercial.pedidos_venda`: a data em que o pedido foi excluído no Omie (coluna nova), sem apagar o número.
- **Gatilhos em `core_vendas_faturamento.pedidos_vendas`:** `AFTER DELETE` para a R6 (casando por `codigo_empresa` + `codigo_pedido_omie` com o pedido do Hub) e, no `AFTER INSERT`, a volta da R8. O `trg_pedidos_vendas_liberacao_proposta_reativado` (`AFTER UPDATE OF deleted_at`) não dispara nesse caminho, porque a pipeline não mexe no `deleted_at`.
- `vw_propostas_lista`: `numero_pedido_omie` nulo quando a proposta está no status novo.
- **Migration:** com o DBA, fora do repositório (N16-155); o nome vai no relatório de entrega.

## 10. Permissões e perfis

`propostas:pode_deletar` exclui, com o mesmo escopo de leitura das outras ações (próprias, compartilhadas ou todas). A mudança automática de status (R6 e R8) não tem usuário.

## 11. Integrações afetadas

- **Omie:** só leitura (`ConsultarPedido`) na R3.
- **Pipeline:** a trava do `exclusionSync` (seção 7).
- **MES:** nenhuma neste contrato. Quando o pedido some do espelho, ele sai da Liberar Pedidos, mas o MES não é avisado se já tinha importado o pedido. Isso fica no cancelamento do pedido (raia 03, item 13 de "O que falta").

## 12. Critérios de aceite

- [ ] Banco: o status novo grava; o evento sem usuário grava; o gatilho de exclusão e o de volta funcionam no tst.
- [ ] API: `DELETE` com as recusas da R1 e da R2, cada uma com o seu `codigo`; a R3 consulta o Omie antes; lista, busca e `/resumo` sem a excluída; conversão pela R7.
- [ ] Pipeline: com o Omie devolvendo zero pedidos, nada é apagado.
- [ ] Frontend: o botão só nos status da R1; status novo com "Copiar"; "Excluir" ao lado de "Tentar novamente".

## 13. Como testar

1. Proposta `ABERTA` → excluir → some da lista e do `/resumo`; o detalhe dá 404; o evento `EXCLUIDA` fica no banco.
2. Proposta `APROVADA` → excluir → 409 com o `codigo` dela.
3. `TRANSFORMADA` com o Omie em erro e o pedido inexistente no Omie → excluir → proposta, pedido do Hub e simulação v1 excluídos.
4. Apagar à mão, no tst, a linha do espelho de um pedido nascido de proposta → a proposta vai ao status novo e a lista mostra o número vazio. Reinserir a linha → a proposta volta a `TRANSFORMADA`.
5. Simular o Omie devolvendo lista vazia na pipeline → nada apagado.

## 14. Ordem de implementação e responsáveis

1. Gustavo: banco (status, eventos, coluna, gatilhos, view).
2. Gustavo: API (`DELETE`, R3, lista e resumo).
3. Gustavo e Robert: trava do `exclusionSync`.
4. Robert: front.

## 15. Riscos, rollback e perguntas em aberto

- **Exclusão em massa por engano:** coberta pela trava do `exclusionSync` e pela R8.
- **Pedido já importado pelo MES:** fica na fábrica sem aviso, até o contrato do cancelamento.
- **Rollback:** voltar o `CHECK` e os gatilhos; as propostas no status novo voltam a `TRANSFORMADA`.
- **Em aberto:** o nome do status e dos códigos (Gustavo).

## 16. Impacto no vault quando for entregue

[[01-Proposta-de-Venda]] (estados e "O que já existe"), [[Estados-e-Status]] (status novo da proposta), [[Colunas-Protegidas]] (a trava do `exclusionSync`), o item 13 da raia [[03-Pedido-de-Venda-e-Liberacao]] e o [[Onde-Estamos]].
