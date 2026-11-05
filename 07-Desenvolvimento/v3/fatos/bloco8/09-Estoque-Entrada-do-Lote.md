# Fatos de 09-Estoque-Entrada-do-Lote

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/09-Estoque-Entrada-do-Lote.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir 09-Estoque-Entrada-do-Lote`.

## decisões e IDs (1)

- `BL-067`

## contratos (1)

- `LOG-53`

## commits (1)

- `ab3318d`

## arquivo:linha (4)

- `circuito-compra.ts:166-250`
- `itens-parciais.controller.ts`
- `itens-parciais.service.ts:592-593`
- `itens-parciais.service.ts:862-874`

## rotas (2)

- `PATCH /itens-parciais/:id/aprovar-saida`
- `PATCH /itens-parciais/:id/receber-fabricado`

## datas (4)

- `09/10`
- `14/10`
- `27/10`
- `27/10/2026`

## código entre crases (23)

- `E5`
- `EM_TRANSITO`
- `ENTRADA`
- `OrigemLote`
- `PATCH /itens-parciais/:id/aprovar-saida`
- `PATCH /itens-parciais/:id/receber-fabricado`
- `PENDENTE`
- `PRODUCAO`
- `StatusQualidadeLote`
- `ab3318d`
- `api-pcp`
- `aprovar-saida`
- `circuito-compra.ts:166-250`
- `develop`
- `devolverAoEstoqueParciaisProntas`
- `idLoteCompra = null`
- `itens-parciais.controller.ts`
- `itens-parciais.service.ts:592-593`
- `itens-parciais.service.ts:862-874`
- `movimentacoes:editar`
- `origem = RECEBIMENTO`
- `quantidade`
- `receber-fabricado`

## regras e linhas de conteúdo (11)

- O item comprado volta ao mesmo Estoque depois que a Qualidade libera o lote. O almoxarife faz a reserva. `E5`
- O item comprado só volta ao Estoque depois que a Qualidade libera o lote.
- Tudo que é fabricado ou comprado passa pelo Estoque (decisão de 14/10). O fabricado aprovado já volta ao Estoque como lote na `develop` (27/10).
- | 9 | Parcial de item **comprado** só entra de volta no Estoque depois que a Qualidade liberou o lote (409 se há lote `PENDENTE`) | 📝 ✅ `itens-parciais.service.ts:862-874` |
- | 11 | **Tudo que é fabricado ou comprado vai para o Estoque**: o fabricado aprovado vira lote e saldo e só então é despachado | 📝 ✅ (`api-pcp`) na `develop` (27/10, `ab3318d`): `aprovar-saida` e `receber-fabricado`; 🔴 a Expedição ainda não sai do Estoque pela retirada |
- | Método e rota | Permissão | Efeito | Código |
- | `PATCH /itens-parciais/:id/aprovar-saida`, `PATCH /itens-parciais/:id/receber-fabricado` | `movimentacoes:editar` | O "sim" da inspeção de saída e a entrada do fabricado no Estoque, com a localização | [[Contratos-da-v2\|LOG-53]] ✅ `develop` (27/10, `itens-parciais.controller.ts`) |
- | # | O quê | Dono | Nó | Selo |
- | 2 | Fabricado vira lote e saldo: feito na `develop` (27/10). Falta a Expedição passar a sair do Estoque com reserva e retirada (junto do item 1) e o custo do fabricado (BL-067) | Robert | E5, Q8 | ✅ (`api-pcp`) lote; 🔴 retirada e custo |
- Nathan e Robert: como o item **fabricado** entra no Estoque: um lote por ordem de produção, ou por parcial aprovada? Quem informa localização? **Respondido e feito na `develop` (27/10): [[Contratos-da-v2|LOG-53]] define e o código cria um lote por ordem de produção e produto; quem informa a localização é o almoxarife, em `receber-fabricado`.**
- Nathan: custo do item fabricado (rateio por peso ou área) continua fora do ciclo 1 (decisão de 09/10)?
