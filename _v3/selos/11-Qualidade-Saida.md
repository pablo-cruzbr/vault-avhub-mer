# Selos de 11-Qualidade-Saida contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio 11-Qualidade-Saida`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|
| `acoes.ts` | 92 | av-hub: `components/Compras/acoes.ts`<br>av-hub: `components/Funcionarios/acoes.ts`<br>av-hub: `components/Vagas/acoes.ts` | 67-67 | ambíguo (4 arquivos) |
| `divergencias.controller.ts` | 124 | api-pcp: `src/divergencias/divergencias.controller.ts` | 38-43 | ok (61 linhas) |
| `fila/CartaoItemParcial.tsx` | 108, 130, 131 | app-pcp: `app/(protected)/movimentacoes/components/fila/CartaoItemParcial.tsx` | 305-305, 150-150, 301-302 | ok (1051 linhas) |
| `integracao-avhub.service.ts` | 101 | api-pcp: `src/integracao-avhub/integracao-avhub.service.ts` | 172-172 | ok (184 linhas) |
| `itens-parciais.controller.ts` | 118 | api-pcp: `src/itens-parciais/itens-parciais.controller.ts` | — | ok (343 linhas) |
| `itens-parciais.service.ts` | 8, 72, 83, 90 | api-pcp: `src/itens-parciais/itens-parciais.service.ts` | 426-435, 1014-1014, 966-989 | ok (2433 linhas) |
| `pedidos.service.ts` | 8, 72, 89 | api-pcp: `src/pedidos/pedidos.service.ts` | 520-525, 512-525 | ok (807 linhas) |
| `producao.prisma` | 99, 134 | api-pcp: `prisma/models/producao.prisma` | 77-82, 118-118 | ok (580 linhas) |
| `qualidade.service.ts` | 94 | api-pcp: `src/qualidade/qualidade.service.ts` | 212-212 | ok (275 linhas) |
| `qualidade/inspecao-saida/page.tsx` | 107 | app-pcp: `app/(protected)/qualidade/inspecao-saida/page.tsx` | 1-18 | ok (19 linhas) |
| `qualidade/page.tsx` | 109 | av-hub: `app/(protected)/cadastros/acessos/auxiliares-vendedor/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/compradores/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/diligenciadores/page.tsx` | — | ambíguo (136 arquivos) |

## ✅ sem repositório nem arquivo citado (12)

- linha 59: - ✅ Telas de inspeção e fila da Qualidade; reprovar, falso alarme e retrabalho.
- linha 60: - ✅ Na `develop` (27/10): o "sim" leva ao Estoque, com lote e saldo, por uma ação explícita de aprovar (`aprovar-saida`, com quantidade aprovada; o resto contin
- linha 91: | 3 | Reprovar grava histórico e abre `Divergencia` tipo `QUALIDADE`, `ABERTA`, com motivo | ✅ `:1036-1058` |
- linha 93: | 5 | Aprovado volta ao Estoque: **lote e saldo do fabricado**, retirada depois ([[Contratos-da-v2\|LOG-53]], [[Contratos-da-v2\|LOG-54]]) | 📝 ✅ lote e saldo n
- linha 95: | 7 | Inspeção de saída tem trava de laudo? Pergunta T-04 para a inspeção documental (ciclo 2). Hoje não há laudo na saída. **Decidido em 29/10 (N16-129): sem l
- linha 117: | `PATCH /itens-parciais/:id/receber`, `/iniciar` | inspetor assume a parcial | `service:224`, `:299` ✅ |
- linha 119: | `PATCH /itens-parciais/:id/receber-fabricado` `{ idLocalizacao }` | o Estoque recebe o fabricado e cria o lote `PRODUCAO` | `develop` (27/10) ✅ ([[09-Estoque-
- linha 121: | `PATCH /itens-parciais/:id/reprovar` `{ motivo }` | reprova e abre divergência | `controller:205-213`, `service:1011` ✅ |
- linha 122: | `PATCH /itens-parciais/:id/resolver` | falso alarme | `service:1067` ✅ |
- linha 123: | `PATCH /itens-parciais/:id/retrabalho` `{ motivo }` | volta ao setor anterior, `retrabalho = true` | `service:1124` ✅ |
- linha 141: | 1 | O "sim" do Q8 leva ao Estoque, com lote e saldo do fabricado: feito na `develop` (27/10). Falta o documento de retirada | Robert | Q8, `E5`, `E6` | ✅ lote
- linha 142: | 2 | Ação explícita de aprovar na inspeção, com quantidade aprovada: feita na `develop` (`aprovar-saida`). Falta a quantidade reprovada (reprovação parcial, N1

## Citações deslocadas (o identificador está em outra linha) (5)

- nota linha 72: `pedidos.service.ts:520-525` (api-pcp) — `EXPEDICAO` não está perto; aparece na linha 584
- nota linha 83: `itens-parciais.service.ts:1014` (api-pcp) — `QUALIDADE` não está perto; aparece na linha 157
- nota linha 89: `pedidos.service.ts:512-525` (api-pcp) — `QUALIDADE` não está perto; aparece na linha 583
- nota linha 90: `itens-parciais.service.ts:966-989` (api-pcp) — `reprovar` não está perto; aparece na linha 1698
- nota linha 108: `fila/CartaoItemParcial.tsx:305` (app-pcp) — `FilaSetor` não está perto; aparece na linha 68
