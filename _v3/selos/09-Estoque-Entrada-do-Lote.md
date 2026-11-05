# Selos de 09-Estoque-Entrada-do-Lote contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio 09-Estoque-Entrada-do-Lote`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|
| `circuito-compra.ts` | 8, 54 | api-pcp: `src/compras/circuito-compra.ts` | 166-250 | ok (298 linhas) |
| `itens-parciais.controller.ts` | 48 | api-pcp: `src/itens-parciais/itens-parciais.controller.ts` | — | ok (343 linhas) |
| `itens-parciais.service.ts` | 41, 54 | api-pcp: `src/itens-parciais/itens-parciais.service.ts` | 862-874, 592-593 | ok (2433 linhas) |

## ✅ sem repositório nem arquivo citado (3)

- linha 42: | 11 | **Tudo que é fabricado ou comprado vai para o Estoque**: o fabricado aprovado vira lote e saldo e só então é despachado | 📝 ✅ na `develop` (27/10, `ab33
- linha 56: ✅ **Fabricado (na `develop`, 27/10, `ab3318d`):** o "sim" da inspeção de saída é `PATCH /itens-parciais/:id/aprovar-saida` (aprova tudo ou só uma `quantidade`; 
- linha 62: | 2 | Fabricado vira lote e saldo: feito na `develop` (27/10). Falta a Expedição passar a sair do Estoque com reserva e retirada (junto do item 1) e o custo do 

## Citações deslocadas (o identificador está em outra linha) (2)

- nota linha 41: `itens-parciais.service.ts:862-874` (api-pcp) — `PENDENTE` não está perto; aparece na linha 1219
- nota linha 54: `itens-parciais.service.ts:592-593` (api-pcp) — `ENTRADA` não está perto; aparece na linha 1402
