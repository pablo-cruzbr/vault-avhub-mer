---
id: SQL-023
titulo: Limpeza das telas antigas do Hub (telas, rotas e permissões sem uso)
status: para-implementar
autor: Nathan
data: 2026-11-18
camadas: [frontend, api, sql]
donos: {frontend: Nathan, api: Nathan, sql: Gustavo}
nos_0b: []
notas_afetadas: [RBAC-e-Permissoes, Banco-AvHub, 02-Orcamento-Base-de-Preco]
depende_de: [LOG-60]
decisoes: [N16-177, N16-173, N16-14]
develop-conferida: [api-acos-vital 3f762d2, av-hub 4b5c023, em 2026-11-18]
tags: [contrato, banco, rbac, permissoes, telas, limpeza]
criado: 2026-11-18
estado-em: 2026-11-18
dono: Nathan
fontes: [conversa do Nathan com o Claude de 18/11/2026 (lista da limpeza e o que fica), banco do Docker local com os dados do tst (docker-teste, fora do vault), api-acos-vital develop 3f762d2, av-hub develop 4b5c023, RBAC-e-Permissoes]
---

# SQL-023 · Limpeza das telas antigas do Hub

## 1. Resumo em linguagem simples

A tela de permissões mostra telas que não existem mais, como Categorias, Vínculos e Sem Cadastro dentro de Orçamento. Isso confunde quem dá acesso. Este contrato **apaga 12 telas sem uso**, junto com as permissões e as rotas delas. Também **tira do Hub três páginas antigas**: Pedidos de Venda, Notas Fiscais de Saída e Orçamento por PDF. Duas telas que continuam ativas dependiam dessas rotas e passam a ter acesso próprio: a busca no topo dos dashboards e o Bloqueio de Comissões. É o primeiro passo antes de redesenhar as telas de Acessos.

## 2. Contexto: o que deve ser feito e por quê

- **O problema:**
  - ao dar ao orçamentista as telas do Orçamento, a tela de permissões mostra 7 telas, mas só 3 existem (N16-173);
  - o mesmo acontece em Vendas, em Suprimentos e em Experimental.
- **Por que elas aparecem:** as telas antigas estão **desativadas** (`auth.telas.ativo = false`), mas não foram apagadas. A tela de permissões lista todas as linhas, inclusive as desativadas.
- **O risco por trás da confusão:**
  - a autorização da API (`auth.fn_autorizar`) não olha o `ativo` da tela;
  - uma tela desativada continua **dando acesso** às rotas mapeadas para ela (por exemplo, `POST`, `PUT` e `DELETE` em `/categorias`) a quem tiver a permissão ligada.
- **Quem sofre:** quem cadastra acesso (o Nathan e o Gustavo), e cada perfil que carrega permissões sem efeito.
- **De onde vem:** pedido do Nathan de 18/11/2026, "fazer uma limpa, tirar tudo que não era para ter" (N16-177). Depois dele vem o redesenho das telas de Acessos, em contrato próprio.
- **Se não for feito:**
  - quem dá acesso continua marcando telas mortas;
  - rotas sem tela continuam abertas por permissões esquecidas.

## 3. Onde fica no fluxo

É transversal, sem nó do 0b. Notas afetadas: [[RBAC-e-Permissoes]] (mapa de telas e rotas), [[Banco-AvHub]] (schema `auth`) e [[02-Orcamento-Base-de-Preco]] (o menu do Orçamento com 3 telas, N16-173).

## 4. Como está hoje

**Banco** (Docker com os dados do tst, 18/11/2026). São 97 telas, 12 delas desativadas. O mapa de rotas tem 613 linhas, e há 223 permissões.

| Tela (slug) | Menu | `ativo` | Linhas no mapa | Perfis com acesso | Página no Hub |
|---|---|---|---|---|---|
| `categorias` | Orçamento | não | 5 | 2 | não (removida em 16/10, N16-14) |
| `historico-produtos` | Orçamento | não | 4 | 2 | não |
| `sem-cadastro` | Orçamento | não | 1 | 2 | não |
| `vinculos` | Orçamento | não | 1 | 2 | não |
| `suprimentos`, `sincronizacao-omie`, `matriz-precos` | Suprimentos | não | 0 | 1 | não (a matriz virou a aba Cotações, N16-173) |
| `comercial` | raiz | não | 0 | 1 | não |
| `pedidos-de-venda` | Vendas | não | 4 | 2 | sim, antiga |
| `notas-fiscais-saida` | Vendas | não | 6 | 2 | sim, antiga |
| `simulador-comissao` | Experimental | sim | 1 | 1 | não |
| `orcamento-pdf` | Experimental | sim | 4 | 0 | sim (`experimental/orcamento-pdf`) |

**Ficam, por decisão (N16-177):**
- `blog`, `organograma-clientes` e `organograma-debug-fatias`: **outro sistema usa**, mesmo sem página no Hub;
- `api-docs`: protege o `/docs` da API;
- `pedidos-venda-financeiro`: a conta corrente do pedido (`LOG-56`), que a API usa em `src/schemas/core_comercial/aggregates/pedidos/pedidos.route.js:53` (`tela própria`).

**Código que depende das telas que saem** (`origin/develop`):
- A busca no topo dos dashboards procura pedido e nota pelas rotas do BFF das páginas antigas:
  - `av-hub` `components/Layout/AppLayout/OverlayHeader/OverlayHeader.tsx:195` (`getPedidosVendaPaginados({ numero_pedido: query, limit: 5 }),`);
  - a rota do BFF exige a tela antiga: `app/api/pedidos-venda/route.ts:7` (`requirePermission('pedidos-de-venda', 'pode_visualizar')`);
  - e a de notas, em `app/api/notas-fiscais-saida/route.ts:4` (`tela: 'notas-fiscais-saida',`).
- O Bloqueio de Comissões procura a nota pela mesma rota: `app/(protected)/comissoes/bloqueio-comissoes/page.tsx:114` (`const data = await getNotasFiscaisSaida({`).
- O Cadastro de Produtos lê as famílias: `app/api/familias/route.ts:25` (`requirePermission(['produtos', 'catalogo-produtos'], 'pode_visualizar')`).
  - Na API, porém, `GET /familias_produtos` só está mapeada para a tela antiga `historico-produtos`.
  - Hoje só passa quem tem essa tela ligada.
- O Orçamento lê as categorias do Omie com as telas `fornecedores`, `catalogo-produtos` e `painel-comprador`: `app/api/comercial/[...rota]/route.ts:137` (`{ padrao: '/categorias', metodo: 'GET', tela: ['fornecedores', 'catalogo-produtos', 'painel-comprador']`).
  - Na API, `GET /categorias` só está mapeada para `categorias`, `compras` e `propostas`.
- Rota sem tela no mapa responde 403 a quem tem token: `api-acos-vital` `src/middlewares/identidadeUsuario.js:115` (`ROTA_SEM_PERMISSAO_MAPEADA`).
- A API do Orçamento por PDF é o schema `orcamento_pdf`, com uma tabela (`orcamento_pdf.relatorio`, 0 linhas no tst): `src/schemas/orcamento_pdf/index.js:21` (`export const rotas = [{ path: "/orcamento_pdf"`).

## 5. Regras de negócio

- **R1.** Saem 12 telas: `categorias`, `historico-produtos`, `sem-cadastro`, `vinculos`, `suprimentos`, `sincronizacao-omie`, `matriz-precos`, `comercial`, `pedidos-de-venda`, `notas-fiscais-saida`, `simulador-comissao` e `orcamento-pdf` (N16-177).
- **R2.** A tela é **apagada**, não só desativada. As permissões saem junto, e as linhas do mapa de rotas também.
- **R3.** Nenhuma tela que fica pode depender de uma que sai:
  - a busca dos dashboards passa a exigir `dash-vendas` (pedidos) e `dash-faturamento` (notas);
  - o Bloqueio de Comissões passa a exigir `bloqueio-comissoes`;
  - as famílias de produto passam a exigir `produtos` ou `catalogo-produtos`;
  - as categorias do Omie no Orçamento passam a exigir `fornecedores`, `catalogo-produtos` ou `painel-comprador`.
- **R4.** Ficam `blog`, `organograma-clientes`, `organograma-debug-fatias`, `api-docs`, `pedidos-venda-financeiro` e o menu `experimental` (N16-177).
- **R5.** O que fica sem tela passa a responder 403 a usuário com token. São rotas que nenhuma tela do Hub chama hoje:
  - `POST /categorias`, `PUT` e `DELETE /categorias/*`;
  - `GET /catalogo_de_produtos` e `GET /historico_precos`;
  - `POST /nota_fiscal_saida`, `PUT`, `PATCH` e `DELETE /nota_fiscal_saida/*`;
  - `/orcamento_pdf/*`.

## 6. Frontend

**Sistema:** av-hub (HUB).
- **Saem as páginas:**
  - `app/(protected)/vendas/pedidos-de-venda/` (página e CSS);
  - `app/(protected)/vendas/notas-fiscais-saida/` (página e CSS);
  - `app/(protected)/experimental/orcamento-pdf/page.tsx`.
- **Sai o Orçamento por PDF inteiro:**
  - `components/OrcamentoPdf/` (11 arquivos);
  - as rotas do BFF `app/api/orcamento-pdf/route.ts` e `app/api/orcamento-pdf/[id]/route.ts`;
  - a exceção de layout em `av-hub` `components/Layout/AppLayout/Layout.tsx:23` (`pathname === '/experimental/orcamento-pdf'`).
- **Ficam**, porque a busca dos dashboards e o Bloqueio de Comissões usam:
  - os services `services/vendas/pedidosVendaPaginados.ts` e `services/vendas/notasFiscaisSaida.ts`;
  - os tipos em `lib/domain/vendas-pedidos-de-venda.ts` e `lib/domain/vendas-notas-fiscais-saida.ts`;
  - as rotas do BFF `app/api/pedidos-venda/route.ts` e `app/api/notas-fiscais-saida/route.ts`, que mudam de tela:
    - `pedidos-venda`: `requirePermission('dash-vendas', 'pode_visualizar')`;
    - `notas-fiscais-saida`: `tela: ['dash-faturamento', 'bloqueio-comissoes']`.
- **Fora do código:** atualizar o `CLAUDE.md` do Hub, onde a linha de `pedidosVendaPaginados.ts` diz "a tela Vendas › Pedidos de venda".
- **Antes de apagar:** conferir as branches abertas (BL-084). Hoje as que trazem esses arquivos só os herdaram da `develop`.
- **Estados:** não muda nada nas telas que ficam.

## 7. Backend

Não se aplica: não há regra nova no servidor. A autorização (`auth.fn_autorizar`) continua igual e só lê o mapa novo.

## 8. API

- Sai o schema `orcamento_pdf` da `api-acos-vital`: a pasta `src/schemas/orcamento_pdf/`, a montagem em `src/schemas/index.js:17` (`import { rotas as orcamento_pdf }`) e `:30`, o limite de corpo em `src/utils/limiteCorpo.js:21` (`limite: "1mb"`) e a dica de migration em `src/utils/erroHttp.js:138` (`2026-11-03_orcamento_pdf_relatorio.sql`).
- Na lista `TELAS_MODULO` de `src/schemas/core_comercial/capacidades.js` saem `sincronizacao-omie` e `matriz-precos`.
- Nenhuma rota nova. As rotas da seção 4 que passam a exigir outras telas são só linhas novas no mapa (seção 9).

## 9. Banco (SQL)

- **Banco:** av-hub, schema `auth`. **Quem aplica:** Gustavo, primeiro no tst e depois em produção.
- **Arquivo:** `docker-teste/migrations/2026-11-18_limpeza_telas_antigas.sql`. Ele roda numa transação só e pode ser rodado de novo sem efeito (`ON CONFLICT DO NOTHING`, e o `DELETE` por slug).
- **O que faz:**
  1. insere 8 linhas no mapa de rotas (R3);
  2. confere que nenhuma tela que fica está dentro de uma que sai, e para se estiver;
  3. apaga as linhas do mapa das 12 telas;
  4. apaga as 12 telas. As permissões saem pela FK com `CASCADE`, e a tela inicial de perfil vira `NULL`.
- **Volta:** tudo o que é apagado fica em `auth.auditoria`, pelo trigger `trg_auditoria_linha`. Para voltar, reinsira as linhas de `auth.telas`, `auth.permissoes` e `auth.rotas_telas`, nessa ordem, e apague as 8 linhas com `observacao LIKE 'SQL-023:%'`.
- **Depois, em separado:** `DROP SCHEMA orcamento_pdf CASCADE`, só se a tabela `orcamento_pdf.relatorio` estiver vazia também em produção (pergunta P2).

```sql
-- SQL-023 · Limpeza das telas antigas do Hub (auth.telas, auth.rotas_telas, auth.permissoes)
-- Decisão do Nathan de 18/11/2026 (N16-177). Aplica: Gustavo, no tst e depois em produção.
--
-- Saem 12 telas que não têm mais uso: o Orçamento antigo do Pablo (4), o menu
-- Suprimentos (3), o menu Comercial vazio, Pedidos de Venda e Notas Fiscais de
-- Saída (as páginas também saem do Hub), o Simulador de Comissão e o Orçamento
-- por PDF de Experimental. Ficam, por decisão: blog, organograma-clientes,
-- organograma-debug-fatias (outro sistema usa), api-docs e pedidos-venda-financeiro.
--
-- A tela é apagada de verdade (DELETE), não só desativada: a tela de permissões
-- do Hub lista todas as linhas de auth.telas, inclusive as desativadas. As
-- permissões saem junto (FK com CASCADE) e as rotas do mapa saem pelo slug.
-- Tudo fica registrado em auth.auditoria (trigger trg_auditoria_linha).
--
-- ORDEM: aplicar DEPOIS do release do av-hub do SQL-023 (as rotas do BFF
-- /api/pedidos-venda e /api/notas-fiscais-saida deixam de exigir as telas que
-- saem). Antes do release, a busca dos dashboards e o Bloqueio de Comissões
-- dariam 403.
--
-- ANTES DE APLICAR EM PRODUÇÃO (Gustavo): rode a conferência do fim do arquivo
-- (bloco "Conferência de uso") e veja se alguma chave de serviço chamou nos
-- últimos 30 dias uma das rotas que ficam sem tela. Se chamou, pare e avise.

BEGIN;

-- 1. Rotas que outras telas ainda usam e que hoje só passam porque o perfil tem
--    uma das telas antigas. Sem estas linhas, elas trancariam (403) depois da limpeza.
INSERT INTO auth.rotas_telas (metodo, rota, slug_tela, acao, observacao) VALUES
  -- Cadastro de Produtos e a página do produto do Orçamento leem as famílias
  -- (av-hub app/api/familias/route.ts exige produtos ou catalogo-produtos).
  ('GET', '/familias_produtos', 'produtos',          'pode_visualizar', 'SQL-023: era só da tela antiga historico-produtos'),
  ('GET', '/familias_produtos', 'catalogo-produtos', 'pode_visualizar', 'SQL-023: era só da tela antiga historico-produtos'),
  -- As categorias do Omie nas telas do Orçamento (av-hub comercial/[...rota], padrão /categorias).
  ('GET', '/categorias', 'fornecedores',      'pode_visualizar', 'SQL-023: Orçamento; antes passava pela tela antiga categorias'),
  ('GET', '/categorias', 'catalogo-produtos', 'pode_visualizar', 'SQL-023: Orçamento; antes passava pela tela antiga categorias'),
  ('GET', '/categorias', 'painel-comprador',  'pode_visualizar', 'SQL-023: Orçamento; antes passava pela tela antiga categorias'),
  -- A busca no topo dos dashboards (OverlayHeader) procura pedido e nota, e o
  -- Bloqueio de Comissões procura a nota. As rotas do BFF passam a exigir estas
  -- telas no lugar de pedidos-de-venda e notas-fiscais-saida (av-hub, mesmo PR).
  ('GET', '/pedidos_vendas',    'dash-vendas',        'pode_visualizar', 'SQL-023: busca do topo dos dashboards; era pedidos-de-venda'),
  ('GET', '/nota_fiscal_saida', 'dash-faturamento',   'pode_visualizar', 'SQL-023: busca do topo dos dashboards; era notas-fiscais-saida'),
  ('GET', '/nota_fiscal_saida', 'bloqueio-comissoes', 'pode_visualizar', 'SQL-023: Bloqueio de Comissões procura a nota; era notas-fiscais-saida')
ON CONFLICT DO NOTHING;

-- 2. As telas que saem.
CREATE TEMP TABLE sql023_sai (slug text PRIMARY KEY) ON COMMIT DROP;
INSERT INTO sql023_sai VALUES
  ('categorias'), ('historico-produtos'), ('sem-cadastro'), ('vinculos'),   -- Orçamento antigo do Pablo
  ('sincronizacao-omie'), ('matriz-precos'), ('suprimentos'),             -- menu Suprimentos
  ('comercial'),                                                          -- menu vazio
  ('pedidos-de-venda'), ('notas-fiscais-saida'),                          -- páginas antigas de Vendas
  ('simulador-comissao'), ('orcamento-pdf');                              -- Experimental

-- Trava: nenhuma tela que fica pode estar pendurada numa que sai.
DO $$
DECLARE v text;
BEGIN
  SELECT string_agg(f.slug, ', ') INTO v
    FROM auth.telas f JOIN auth.telas p ON p.id = f.id_parent
   WHERE p.slug IN (SELECT slug FROM sql023_sai) AND f.slug NOT IN (SELECT slug FROM sql023_sai);
  IF v IS NOT NULL THEN
    RAISE EXCEPTION 'SQL-023: telas que ficam estão dentro de uma que sai: %', v;
  END IF;
END $$;

-- 3. Mapa de rotas das telas que saem.
DELETE FROM auth.rotas_telas WHERE slug_tela IN (SELECT slug FROM sql023_sai);

-- 4. As telas (as permissões saem pela FK com CASCADE; tela inicial de perfil vira NULL).
--    Filhas primeiro, para a FK de id_parent não apagar nada fora da lista.
DELETE FROM auth.telas WHERE slug IN (SELECT slug FROM sql023_sai) AND id_parent IN (SELECT id FROM auth.telas WHERE slug IN (SELECT slug FROM sql023_sai));
DELETE FROM auth.telas WHERE slug IN (SELECT slug FROM sql023_sai);

COMMIT;

-- ─── Conferência de uso (rodar ANTES, só leitura) ──────────────────────────────
-- Rotas que ficam sem nenhuma tela depois da limpeza (a API passa a responder 403
-- a quem chamar com token de usuário):
--   POST /categorias, PUT e DELETE /categorias/*, GET /catalogo_de_produtos,
--   GET /historico_precos, POST /nota_fiscal_saida, PUT, PATCH e DELETE
--   /nota_fiscal_saida/*, GET e PUT /orcamento_pdf/relatorios, GET e DELETE
--   /orcamento_pdf/relatorios/*.
--
-- SELECT c.nome, u.metodo, u.caminho, u.quantidade, u.ultima_em
--   FROM auth.chaves_servico_uso u JOIN auth.chaves_servico c ON c.id = u.id_chave
--  WHERE u.ultima_em > now() - interval '30 days'
--    AND (u.caminho ~ '^/categorias' AND u.metodo <> 'GET'
--      OR u.caminho ~ '^/(catalogo_de_produtos|historico_precos|orcamento_pdf)'
--      OR u.caminho ~ '^/nota_fiscal_saida' AND u.caminho !~ '^/nota_fiscal_saida/manual' AND u.metodo <> 'GET')
--  ORDER BY u.ultima_em DESC;
--
-- ─── Conferência depois ───────────────────────────────────────────────────────
-- SELECT slug FROM auth.telas WHERE slug IN ('categorias','historico-produtos','sem-cadastro','vinculos',
--   'sincronizacao-omie','matriz-precos','suprimentos','comercial','pedidos-de-venda','notas-fiscais-saida',
--   'simulador-comissao','orcamento-pdf');                                   -- 0 linhas
-- SELECT slug FROM auth.telas WHERE slug IN ('blog','organograma-clientes','organograma-debug-fatias',
--   'api-docs','pedidos-venda-financeiro','experimental');                   -- 6 linhas
--
-- ─── Volta (rollback) ─────────────────────────────────────────────────────────
-- As linhas apagadas estão em auth.auditoria (tabela, operação DELETE, linha antiga).
-- Para voltar, reinsira de lá as linhas de auth.telas, auth.permissoes e
-- auth.rotas_telas, nessa ordem, e apague as 8 linhas inseridas no passo 1
-- (observacao LIKE 'SQL-023:%').
```

## 10. Permissões e perfis

Nenhum perfil perde acesso a uma tela que existe. Quem tinha só as telas que saem perde as permissões delas, que já não abriam nada.

| Quem | Antes | Depois |
|---|---|---|
| Quem busca pedido e nota no topo dos dashboards | precisava de `pedidos-de-venda` e `notas-fiscais-saida` | `dash-vendas` e `dash-faturamento` |
| Quem procura a nota no Bloqueio de Comissões | `notas-fiscais-saida` | `bloqueio-comissoes` |
| Quem escolhe a família no Cadastro de Produtos | `historico-produtos` | `produtos` ou `catalogo-produtos` |
| Orçamentista (categorias do Omie) | `categorias` | `fornecedores`, `catalogo-produtos` ou `painel-comprador` |

## 11. Integrações afetadas

- **Outros sistemas que usam o `auth` do Hub** (o que usa `blog` e o organograma): as telas deles ficam.
- **Antes de aplicar em produção:** a conferência de uso do SQL lista as chamadas dos últimos 30 dias por chave de serviço às rotas que ficam sem tela.
- **MES, Omie e pipeline:** nenhuma mudança.

## 12. Critérios de aceite

- [ ] **Banco:**
  - as 12 telas não existem em `auth.telas`;
  - as 6 que ficam existem (`blog`, `organograma-clientes`, `organograma-debug-fatias`, `api-docs`, `pedidos-venda-financeiro` e `experimental`);
  - há 8 linhas com `observacao LIKE 'SQL-023:%'` em `auth.rotas_telas`.
- [ ] **Frontend:**
  - as três páginas saíram da `develop` do av-hub;
  - a busca dos dashboards e o Bloqueio de Comissões funcionam com um usuário que não tem as telas antigas;
  - o `npm run check` passa.
- [ ] **API:** a `develop` não monta mais `/orcamento_pdf`.
- [ ] **Tela de permissões:** no menu Orçamento aparecem só Pedidos de custo, Produtos e Fornecedores.

## 13. Como testar

Feito no Docker em 18/11/2026, com os dados do tst:
- **Teste desfeito (`ROLLBACK`):** de 97 para 85 telas, de 613 para 592 linhas no mapa e de 223 para 206 permissões. As 6 telas que ficam continuaram lá.
- **Aplicado de verdade:** um usuário do perfil "Orçamentos" teve o resultado da autorização (`auth.fn_autorizar`) abaixo:
  - **200** em `GET /categorias`, `GET /familias_produtos`, `GET /comercial/solicitacoes_custo` e `POST /comercial/ofertas`;
  - **403** em `GET /catalogo_de_produtos` e `GET /orcamento_pdf/relatorios`, como esperado.
- **Ainda falta testar:**
  - com o av-hub novo: a busca no topo de Dashboards › Vendas e o campo de nota do Bloqueio de Comissões, com um perfil sem as telas antigas;
  - na tela de permissões: o menu Orçamento só com as 3 telas.

## 14. Ordem de implementação e responsáveis

1. **Nathan:** PR do av-hub (seção 6) e da api-acos-vital (seção 8), na `develop` e depois na `main`.
2. **Gustavo:** aplica o SQL **depois do release do av-hub**. Antes do release, as rotas do BFF ainda exigiriam as telas apagadas e dariam 403 na busca dos dashboards e no Bloqueio de Comissões.
3. **Gustavo:** o `DROP SCHEMA orcamento_pdf`, se a P2 confirmar que pode.

## 15. Riscos, rollback e perguntas em aberto

- **Risco:**
  - uma integração fora do Hub chamar, com token de usuário, uma rota que fica sem tela (R5);
  - a conferência de uso cobre as chaves de serviço, mas não as chamadas com token.
- **Rollback:** pela `auth.auditoria` (seção 9).
- **P1. A tela `custo-item` não existe.** A API decide quem vê o custo pela tela `custo-item` (`api-acos-vital` `src/schemas/core_comercial/capacidades.js:62` (`ve_custo: pode("custo-item"`)), e essa tela não existe no tst. A cadastrada é `custo-itens`, de Comissões. O vault já trata as duas como diferentes ([[RBAC-e-Permissoes]]). Então hoje ninguém tem `ve_custo` pela tela. Cria-se a tela oculta `custo-item`, ou a API passa a usar `custo-itens`? Não entra neste SQL.
- **P2.** A tabela `orcamento_pdf.relatorio` está vazia em produção? Se estiver, o schema é apagado.

## 16. Impacto no vault quando for entregue

- **[[RBAC-e-Permissoes]]:** tirar as 12 telas das listas e registrar as 8 linhas novas do mapa.
- **[[Banco-AvHub]]:** registrar o fim do schema `orcamento_pdf`, se a P2 confirmar.
- **[[02-Orcamento-Base-de-Preco]]:** o menu Orçamento só com as 3 telas também na tela de permissões.
- **Status do contrato:** `implementado-na-develop`.
