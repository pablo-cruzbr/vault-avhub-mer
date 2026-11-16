---
tags: [decisoes, registro, n16, parte]
criado: 2026-11-16
estado-em: 2026-11-16
status: vigente
dono: Nathan
parte-de: "[[Registro-de-Decisoes]]"
fontes: [PDF de Robert de 16/11/2026 ("Exclusão de proposta e pedido excluído no Omie"), resposta do Nathan de 16/11/2026 (fora do vault), omie-elt-pipeline develop 3aaea0e (src/jobs/exclusionSync.ts), Dump-AvHub-Teste-2026-11-16]
---

# Registro de decisões: N16-167 em diante

**Em uma frase:** decisões N16 da nota [[Registro-de-Decisoes]] a partir da N16-167 (parte 7). A parte anterior, [[Registro-N16-150-a-N16-155]], chegou perto de 25 KB.

**Onde estamos:** ← [[Registro-de-Decisoes]] (resumo e índice) · partes: [[Registro-N16-01-a-N16-43]] · [[Registro-N16-44-a-N16-72]] · [[Registro-N16-73-a-N16-96]] · [[Registro-N16-97-a-N16-116]] · [[Registro-N16-117-a-N16-149]] · [[Registro-N16-150-a-N16-155]] · **Registro-N16-167-em-diante**

| ID | Decisão | Data | Dono | Selo | Superada |
|---|---|---|---|---|---|
| N16-167 | **Excluir proposta pelo Hub e o pedido excluído no Omie.** Nathan, 16/11/2026, a partir do pedido do Robert da mesma data. (1) **Exclusão pela proposta**, lógica (`deleted_at`), só em `ABERTA`, `CANCELADA`, `EXPIRADA`, no status novo do item 3, e em "virou pedido" cujo pedido nunca chegou ao Omie (antes, a API consulta o Omie pelo PV; se o pedido existir lá, recusa). A exclusão leva junto o pedido do Hub e a simulação v1 em rascunho. (2) **Não se exclui:** a aprovada (cancela-se com motivo, N16-03) e a que virou pedido no Omie, mesmo cancelado; esse pedido se exclui pela tela de pedidos (N16-84). (3) **Pedido excluído direto no Omie:** quando a pipeline apaga o pedido do espelho, a proposta vai a um status novo ("Excluído no Omie"). A partir dele, o vendedor só copia ou exclui. O status conta como decidido e não convertido no `/resumo`. (4) **Caminho de volta:** se o pedido reaparecer no espelho, a proposta volta a "Virou pedido". (5) **Trava na pipeline:** o `exclusionSync` não apaga nada quando o Omie devolve zero pedidos ou muito menos do que o banco tem. Detalhe e camadas em `LOG-59` (`06-Contratos/Ativos/LOG-59-Exclusao-de-Proposta-e-Pedido-Excluido-no-Omie`)\|`LOG-59` (`06-Contratos/Ativos/LOG-59-Exclusao-de-Proposta-e-Pedido-Excluido-no-Omie`) | 16/11/2026 | Nathan | 📝 | |
