# Selos de 13-Expedicao contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio 13-Expedicao`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|
| `ConfirmarEntregaModal.tsx` | 118, 133 | app-pcp: `app/(protected)/movimentacoes/components/ConfirmarEntregaModal.tsx` | 94-94 | ok (196 linhas) |
| `EmbalagensSection.tsx` | 119 | app-pcp: `app/(protected)/ordens-producao/EmbalagensSection.tsx` | — | ok (323 linhas) |
| `FilaSetor.tsx` | 97 | app-pcp: `app/(protected)/movimentacoes/components/FilaSetor.tsx` | 810-835 | 🟡 linha 810-835 passa do fim (156 linhas) |
| `PalletsModal.tsx` | 117 | app-pcp: `app/(protected)/movimentacoes/components/PalletsModal.tsx` | — | ok (249 linhas) |
| `entregas.controller.ts` | 131, 132 | api-pcp: `src/entregas/entregas.controller.ts` | 34-38, 40-50 | 🟡 linha 40-50 passa do fim (44 linhas) |
| `entregas.service.ts` | 98, 99, 102, 131, 153, 167 | api-pcp: `src/entregas/entregas.service.ts` | 17-24, 44-63, 82-82, 25-25, 87-94, 104-130 | ok (151 linhas) |
| `estoque-operacao.helpers.ts` | 8, 151 | api-pcp: `src/estoque/operacao/estoque-operacao.helpers.ts` | 208-280 | ok (778 linhas) |
| `fabricas.prisma` | 95 | api-pcp: `prisma/models/fabricas.prisma` | 13-14 | ok (176 linhas) |
| `integracao-avhub.service.ts` | 107 | api-pcp: `src/integracao-avhub/integracao-avhub.service.ts` | 187-188 | 🟡 linha 187-188 passa do fim (184 linhas) |
| `item-parcial-status.constants.ts` | 109 | api-pcp: `src/common/constants/item-parcial-status.constants.ts` | 44-50 | 🟡 linha 44-50 passa do fim (41 linhas) |
| `itens-parciais.service.ts` | 8, 95, 96, 128, 144, 151 | api-pcp: `src/itens-parciais/itens-parciais.service.ts` | 966-973, 946-951, 224-289, 927-961, 278-285 | ok (2433 linhas) |
| `lib/domain/etapas-item.ts` | 107 | av-hub: `lib/domain/etapas-item.ts` | 44-45 | ok (73 linhas) |
| `logistica/expedicao/page.tsx` | 115 | app-pcp: `app/(protected)/logistica/expedicao/page.tsx` | 1-16 | ok (17 linhas) |
| `pedido-embalagem-pallets.controller.ts` | 134 | api-pcp: `src/pedido-embalagem-pallets/pedido-embalagem-pallets.controller.ts` | 28-28 | ok (56 linhas) |
| `pedido-embalagens.controller.ts` | 134 | api-pcp: `src/pedido-embalagens/pedido-embalagens.controller.ts` | 32-32 | ok (57 linhas) |
| `producao.prisma` | 109, 144, 145 | api-pcp: `prisma/models/producao.prisma` | 57-64, 454-468, 294-338 | ok (580 linhas) |

## ✅ sem repositório nem arquivo citado (4)

- linha 62: - ✅ Fila, pallets, confirmar entrega com comprovante e fechamento do pedido.
- linha 129: | `PATCH /itens-parciais/:id/pallets` `{ pesosPallets[], nomesPallets[], unidadesPallets[] }` | arrays paralelos por pallet | idem | `controller:182-190`, `serv
- linha 130: | `PATCH /itens-parciais/:id/mover`, `/concluir` | passa da Embalagem à Logística e conclui no último setor | idem | `service:366`, `:520` ✅ |
- linha 140: #### X1 · paletes ✅

## Citações deslocadas (o identificador está em outra linha) (4)

- nota linha 95: `itens-parciais.service.ts:966-973` (api-pcp) — `EXPEDICAO` não está perto; aparece na linha 780
- nota linha 144: `producao.prisma:454-468` (api-pcp) — `nomesPallets` não está perto; aparece na linha 415
- nota linha 144: `itens-parciais.service.ts:927-961` (api-pcp) — `nomesPallets` não está perto; aparece na linha 1647
- nota linha 151: `estoque-operacao.helpers.ts:208-280` (api-pcp) — `consumirReservasDaParcial` não está perto; aparece na linha 317
