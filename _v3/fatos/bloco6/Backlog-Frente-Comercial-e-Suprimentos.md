# Fatos de Backlog-Frente-Comercial-e-Suprimentos

Foto tirada em 2026-11-05 de `07-Desenvolvimento/Partes/Backlog-Frente-Comercial-e-Suprimentos.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir Backlog-Frente-Comercial-e-Suprimentos`.

## decisões e IDs (25)

- `BL-046`
- `BL-047`
- `BL-062`
- `BL-068`
- `BL-071`
- `BL-072`
- `BL-073`
- `N14-15`
- `N16-02`
- `N16-04`
- `N16-05`
- `N16-06`
- `N16-07`
- `N16-08`
- `N16-115`
- `N16-116`
- `N16-117`
- `N16-118`
- `N16-119`
- `N16-148`
- `N16-15`
- `N16-24`
- `N16-55`
- `N16-58`
- `PS-038`

## contratos (1)

- `LOG-52`

## commits (0)


## arquivo:linha (6)

- `/route.ts`
- `api-comercial/README.md`
- `custos.routes.ts:378`
- `propostas.routes.ts:146-164`
- `propostas.service.ts:467-649`
- `suprimentos.routes.ts:823-880`

## rotas (0)


## datas (4)

- `15/10`
- `16/10`
- `28/10`
- `29/10`

## código entre crases (23)

- `ABERTA`
- `APROVADA`
- `C6`
- `C7`
- `CANCELADA`
- `HUB api-comercial/README.md`
- `If-Match`
- `POST`
- `TRANSFORMADA`
- `api-acos-vital`
- `api-comercial`
- `api-comercial/`
- `app/api/comercial/[...rota]/route.ts`
- `asyncHandler`
- `auth.rotas_telas`
- `core_comercial`
- `core_vendas_faturamento`
- `custos.routes.ts:378`
- `develop`
- `pedidos_compras`
- `propostas.routes.ts:146-164`
- `propostas.service.ts:467-649`
- `suprimentos.routes.ts:823-880`

## regras e linhas de conteúdo (7)

- | ID | Nó | O que falta | Selo | Evidência |
- | BL-046 | C1, C4 | Relação entre o orçamento do módulo comercial e a OC/cotação de Compras (decisão #39: orçamento é por fora) Respondida em 16/10: o Orçamento é o setor orçamentário, com base de preço de compra com histórico; Compras é dona da compra e confere a proposta (`C6`, `C7`); ver [[02-Orcamento-Base-de-Preco]] e BL-073. | ✅ respondida | `HUB api-comercial/README.md` |
- | BL-047 | C4 | Sincronização Omie do módulo (produtos, fornecedores, pedidos de compra) coexiste com o pipeline: não duplicar o espelho `pedidos_compras`. **No desenho do LOG-52 a sincronização própria some** e a pipeline é a fonte; falta o Gustavo confirmar o que ela carrega (Q1) | 🟡 | `HUB api-comercial/README.md` |
- | BL-062 | C4 | **Migrar o módulo Comercial & Suprimentos para a `api-acos-vital`; desde 28/10 o Robert conduz.** **Migrar o módulo Comercial & Suprimentos para a `api-acos-vital` (LOG-52 fases 1 a 5):** schema `core_comercial` por migration, itens transversais (Decimal, zod, `If-Match`, idempotência, `asyncHandler`, XLSX, e-mail), domínio portado com os testes, rotas e `auth.rotas_telas`. O que a API já tem não se recria (produtos, parceiros, pedidos de compra, PTAX, usuários, auditoria) **N16-15: o Gustavo revisa e aplica no banco toda a parte do Pablo (BL-068).** | [[Contratos-da-v2\|LOG-52]] | 🔴 | N14-15; inventário de 15/10 nos dois lados |
- | BL-071 | V0.1 a V0.5, V0C | **Em 29/10: a API de proposta já existe na `api-acos-vital` (`develop`) e as telas no av-hub, com o Robert; as linhas de código desta linha são do `api-comercial` (legado).** **Proposta no módulo novo**: estados `ABERTA`, `APROVADA`, `TRANSFORMADA`, `CANCELADA`; trava de ajuste depois de aprovada; "incompleta" que impede aprovar; cancelar com motivo, sem reabrir; numeração só numérica por unidade e tipo (formato decidido: só dígitos, ano mais sequência; PS-038, N16-148); fim do fechamento parcial e do pedido digitado à mão | 🔴 📝 N16-02 a N16-04, N16-24 | `propostas.service.ts:467-649` |
- | BL-072 | V0.6, V0.7, C6, C7 | **Em 29/10: a API de proposta já existe na `api-acos-vital` (`develop`) e as telas no av-hub, com o Robert; as linhas de código desta linha são do `api-comercial` (legado).** **Pedido de venda por API**: `POST` que grava na fila, rotas de fila e retorno da pipeline, as três respostas obrigatórias do "Transformar em pedido"; leitura da parte de compras para `C6` e `C7` | 🔴 📝 N16-02, N16-05, N16-08 | `propostas.routes.ts:146-164` (a substituir) |
- | BL-073 | B1 a B4 | **Orçamento** ([[02-Orcamento-Base-de-Preco]]): página do produto com score e volatilidade, matriz de preços, pedido de custo sem prazo e com o tempo cronometrado, valor correto da OC no histórico | 🔴 📝 N16-06, N16-07, N16-55, N16-58 | `suprimentos.routes.ts:823-880`, `custos.routes.ts:378` |
