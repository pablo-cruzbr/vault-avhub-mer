# Selos de 08-Qualidade-Entrada contra a develop

Gerado em 2026-11-05 por `node _v3/scripts/selos.mjs relatorio 08-Qualidade-Entrada`.

Base: api-acos-vital `origin/develop` b97981c · av-hub `origin/develop` 2e5456d · api-pcp `origin/develop` befd973 · app-pcp `origin/develop` 93f96de · omie-elt-pipeline `origin/master` 5e7e94d

## Arquivos citados

| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |
|---|---|---|---|---|
| `acoes.ts` | 132 | av-hub: `components/Compras/acoes.ts`<br>av-hub: `components/Funcionarios/acoes.ts`<br>av-hub: `components/Vagas/acoes.ts` | 91-100 | ambíguo (4 arquivos) |
| `alertas.service.ts` | 177 | api-pcp: `src/estoque/alertas/alertas.service.ts` | 63-63 | ok (69 linhas) |
| `api-pcp/src/qualidade/dto/aprovar-lote.dto.ts` | 85 | api-pcp: `src/qualidade/dto/aprovar-lote.dto.ts` | 4-9 | ok (10 linhas) |
| `app-pcp/.../movimentacoes/acoes.ts` | 125 | app-pcp: `app/(protected)/movimentacoes/acoes.ts` | 98-100 | ok (132 linhas) |
| `app-pcp/app/(protected)/qualidade/inspecao-entrada/page.tsx` | 131 | app-pcp: `app/(protected)/qualidade/inspecao-entrada/page.tsx` | 116-118 | ok (293 linhas) |
| `circuito-compra.ts` | 8, 86, 87, 156, 157, 167, 173 | api-pcp: `src/compras/circuito-compra.ts` | 166-250, 239-249, 166-250, 181-186, 256-300, 188-249 | 🟡 linha 256-300 passa do fim (298 linhas) |
| `estoque-operacao.helpers.ts` | 100 | api-pcp: `src/estoque/operacao/estoque-operacao.helpers.ts` | 165-165 | ok (778 linhas) |
| `estoque-operacao.service.ts` | 89 | api-pcp: `src/estoque/operacao/estoque-operacao.service.ts` | 429-429 | ok (1105 linhas) |
| `estoque.prisma` | 8, 95, 104, 166 | api-pcp: `prisma/models/estoque.prisma` | 25-31, 11-17, 263-276 | ok (476 linhas) |
| `estoque/alertas/alertas.service.ts` | 144 | api-pcp: `src/estoque/alertas/alertas.service.ts` | 63-64 | ok (69 linhas) |
| `itens-parciais.service.ts` | 181, 189 | api-pcp: `src/itens-parciais/itens-parciais.service.ts` | 607-607, 862-879, 1011-1020 | ok (2433 linhas) |
| `painel-estoque/page.tsx` | 133 | av-hub: `app/(protected)/cadastros/acessos/auxiliares-vendedor/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/compradores/page.tsx`<br>av-hub: `app/(protected)/cadastros/acessos/diligenciadores/page.tsx` | 205-205 | ambíguo (136 arquivos) |
| `perfis.service.ts` | 188, 189 | api-pcp: `src/rbac/perfis/perfis.service.ts` | 278-289 | ok (347 linhas) |
| `qualidade.controller.ts` | 141, 142, 143, 187 | api-pcp: `src/qualidade/qualidade.controller.ts` | 19-23, 25-29, 31-35, 19-35 | 🟡 linha 31-35, 19-35 passa do fim (34 linhas) |
| `qualidade.service.ts` | 8, 86, 90, 121, 141, 142, 143, 152, 161, 211 | api-pcp: `src/qualidade/qualidade.service.ts` | 222-246, 226-234, 199-207, 39-81, 83-100, 102-265, 83-100, 102-265 | ok (275 linhas) |
| `reprovar-lote.dto.ts` | 85 | api-pcp: `src/qualidade/dto/reprovar-lote.dto.ts` | 5-27 | 🟡 linha 5-27 passa do fim (26 linhas) |

## ✅ sem repositório nem arquivo citado (5)

- linha 58: - ✅ Tela de inspeção, aprovação, reprovação com cisão do lote e devolução da parte reprovada a Compras.
- linha 59: - ✅ Substituição que se une à parte em quarentena e segue ao Estoque.
- linha 84: | Inspeção de entrada é por **lote**; a de saída é um setor tipo `QUALIDADE` no roteiro | EC-01 (Nathan, 29/09) | 📝 ✅ |
- linha 88: | O sistema nunca emite a nota de devolução: só sinaliza (`nota_devolucao_pendente`); o Omie emite | Regra de Q10/Q11 do v1; Registro #30 (Omie é o fiscal) | 📝
- linha 190: | Login | Escritório entra por Azure AD; chão de fábrica por usuário e senha | `POST /auth/azure`, `POST /auth/login` ✅ |

## Citações deslocadas (o identificador está em outra linha) (4)

- nota linha 89: `estoque-operacao.service.ts:429` (api-pcp) — `LIBERADO` não está perto; aparece na linha 67
- nota linha 181: `itens-parciais.service.ts:607` (api-pcp) — `EM_TRANSITO` não está perto; aparece na linha 274
- nota linha 181: `itens-parciais.service.ts:862-879` (api-pcp) — `EM_TRANSITO` não está perto; aparece na linha 274
- nota linha 189: `itens-parciais.service.ts:1011-1020` (api-pcp) — `QUALIDADE` não está perto; aparece na linha 157
