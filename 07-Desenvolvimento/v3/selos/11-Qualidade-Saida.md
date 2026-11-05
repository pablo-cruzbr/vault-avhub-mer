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

## ✅ sem repositório nem arquivo citado (0)


## Citações deslocadas (o identificador está em outra linha) (5)

- nota linha 72: `pedidos.service.ts:520-525` (api-pcp) — `EXPEDICAO` não está perto; aparece na linha 584
- nota linha 83: `itens-parciais.service.ts:1014` (api-pcp) — `QUALIDADE` não está perto; aparece na linha 157
- nota linha 89: `pedidos.service.ts:512-525` (api-pcp) — `QUALIDADE` não está perto; aparece na linha 583
- nota linha 90: `itens-parciais.service.ts:966-989` (api-pcp) — `reprovar` não está perto; aparece na linha 1698
- nota linha 108: `fila/CartaoItemParcial.tsx:305` (app-pcp) — `FilaSetor` não está perto; aparece na linha 68
