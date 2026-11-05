# Selos de 14-Fiscal-Omie contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio 14-Fiscal-Omie`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|
| `app/(protected)/minhas-notas/page.tsx` | 105 | — | — | 🔴 não existe na develop |
| `app/(protected)/notas-equipe/page.tsx` | 106 | av-hub: `app/(protected)/notas-equipe/page.tsx` | — | ok (9 linhas) |
| `app/(protected)/pcp-notas/page.tsx` | 107 | av-hub: `app/(protected)/pcp-notas/page.tsx` | — | ok (9 linhas) |
| `app/(protected)/vendas/notas-fiscais-saida/page.tsx` | 108 | av-hub: `app/(protected)/vendas/notas-fiscais-saida/page.tsx` | — | ok (235 linhas) |
| `components/Pedidos/EtapaDosItens.tsx` | 109 | av-hub: `components/Pedidos/EtapaDosItens.tsx` | — | ok (115 linhas) |
| `notasFiscais.ts` | 8, 118, 119, 120 | av-hub: `lib/api/notasFiscais.ts`<br>av-hub: `services/notasFiscais.ts`<br>omie-elt-pipeline: `src/omie/resources/notasFiscais.ts` | 21-46, 57-58, 125-165 | ok (171 linhas) |
| `pedidosVendas.ts` | 8, 96, 117, 135 | omie-elt-pipeline: `src/omie/resources/pedidosVendas.ts` | 134-136 | ok (252 linhas) |
| `src/utils/omie.js` | 79 | api-acos-vital: `src/utils/omie.js` | — | ok (244 linhas) |

## ✅ sem repositório nem arquivo citado (3)

- linha 58: - ✅ Omie emite a nota; o pipeline traz pedido e nota; as telas de notas do hub.
- linha 121: | Cron do pipeline | hoje a cada 3 min (`SYNC_HOJE_CRON`); mês a cada 20 min; últimos meses a cada 3 h; full 3h17 | `config` `:89-104` ✅ |
- linha 128: #### O1 e O2 (lado Omie) ✅

## Citações deslocadas (o identificador está em outra linha) (0)

