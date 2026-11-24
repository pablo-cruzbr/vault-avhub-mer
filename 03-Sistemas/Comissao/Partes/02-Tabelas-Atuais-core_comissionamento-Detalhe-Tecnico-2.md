---
tags: [comissao, banco, core_comissionamento, tabelas, dba, parte]
criado: 2026-11-23
estado-em: 2026-11-24
status: proposta
dono: Gustavo (DBA)
parte-de: "[[02-Tabelas-Atuais-core_comissionamento]]"
develop-conferida: [api-acos-vital ed6d147, em 2026-11-24, rotas de aprovação, fechamento, ajuste, contestação e por pedido; api-acos-vital ce4f90f, av-hub 7f0f7e2, em 2026-11-23, colunas, filtros e migrations da comissão de 18 a 23/11; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [PDF de Gustavo de 24/11/2026, Dump-AvHub-Teste-2026-11-24, api-acos-vital 9e6ef60, 0b7d92c, ed6d147, dump core_comissionamento convertido (09-Diagramas/fontes), api-acos-vital f322dcd src/schemas/core_comissionamento, N16-11, api-acos-vital 7c05f92, 0244b1a, e363da5, 0e56354, 06bb146 (models e rotas de core_comissionamento), N16-185 a N16-190, PS-062, PS-063]
---

# Tabelas, views e funções atuais do `core_comissionamento`: detalhe técnico (2/2)

**Em uma frase:** detalhe técnico da nota [[02-Tabelas-Atuais-core_comissionamento]] (parte 2 de 2): Views; Funções; Rotas da API que existem hoje; O que entrou em 23 e 24/11; Resumo dos problemas de estrutura.

**Onde estamos:** ← [[02-Tabelas-Atuais-core_comissionamento]] (resumo e índice) · partes: [[02-Tabelas-Atuais-core_comissionamento-Detalhe-Tecnico-1]] · **02-Tabelas-Atuais-core_comissionamento-Detalhe-Tecnico-2**

## Views

| View | Grão | O que faz | Linhas |
|---|---|---|---|
| `vw_simulacao_resolvida` | item da versão corrente do vendedor | Desde 23/11, a versão pré-aceita do pedido (menor comissão; empate, Compras) no lugar do `LEAST` item a item; teto da regra fixa, valor por item faturado, economia de Compras, margem do item nas duas versões | `dump:1007-1199` (versão antiga) |
| `vw_comissao_master` | item faturado | Junta NF faturada + simulação resolvida + bloqueio + regra fixa; aplica listas de bloqueio; `situacao` (com `DEVOLVIDO`); valor máximo; competência; peso da fabricação do pedido | `dump:1227-1377` (versão antiga) |
| `vw_comissao_nf` | NF | Soma a master por NF; % efetivo ponderado; situação mais grave; itens sem vínculo | `dump:1426-1465` |
| `vw_comissao_resumo_mensal` | mês (e vendedor) | `GROUPING SETS`; contagens por situação (com `qtd_devolvido`); a pagar; máximo; pré-aceito; bloqueado; economia | `dump:1502-1525` (versão antiga) |

**Problemas e melhorias**
- `vw_simulacao_resolvida` repetia 40+ colunas em dois CTE (`corrente`, `primeira_vendedor`) e 3 `CROSS JOIN LATERAL` encadeados (dump antigo); a escolha da versão que paga e o teto ficam **dentro de views**, sem teste. → no módulo novo, gravados por função com testes (o desenho ainda é por item; ver [[03-Modelo-Novo-core_comissao]]).
- A comissão é **recalculada em toda leitura** (sem foto): mês fechado muda se alguém mexer em simulação ou regra (`visao-geral/route.ts:113-116` admite). → decisão imutável da Controladoria e valores gravados por NF.
- `vw_comissao_master` filtra por `is_track_record`; a view soma as duas pernas (viva e histórica) e **dobra mês fechado** sem o filtro (API exige o parâmetro, `vw_comissao_nf.route.js:20-30`). → o módulo novo não usa perna histórica; a NF fica gravada.
- `valor_comissao_bloqueado` era `valor_faturado_nf × 0` (`dump:1522`); desde 23/11 é o pré-aceito das notas bloqueadas (`vw_comissao_resumo_mensal.model.js:37` (`valor_comissao_bloqueado:`)), banco no tst e na produção (PDF do Gustavo de 24/11).
- Comentário da master truncado (`dump:1386`).
- A leitura de `situacao` exige conhecer a precedência de 6 estados escrita em texto (`dump:1399-1403`). → duas máquinas de estados com tabela de visibilidade.

## Funções

| Função | O que faz | Linhas | Problema / melhoria |
|---|---|---|---|
| `fn_dashboard_comissoes(p_ano_mes, p_is_track_record, p_aplicar_bloqueio, p_incluir_pedidos)` → jsonb | Dashboard do mês: vendedores (do relatório provisório) + coordenadores; ranking; cartões | `dump:111-287` | Monta JSON de 5 estruturas dentro de uma função; depende de `comissoes_provisoria` (JSON externo) e de `fn_dashboard_mensal_faturamento`; `p_aplicar_bloqueio` sempre `false` pela rota (`api-acos-vital` `src/schemas/core_comissionamento/functions/fn_dashboard_comissoes/fn_dashboard_comissoes.route.js:50` (`tr.isTrackRecord, false`)). → apuração mensal em tabela (`coordenadores_apuracoes`), vendedores vêm das NFs decididas |
| `fn_comissao_coordenadores_mes(p_ini, p_fim)` | Parâmetro de coordenador vigente no período (mais recente se houver duas) | `dump:85-95` | Chave por nome. → `fn_coordenadores_vigentes` por id |
| `fn_jsonb_numero(jsonb)` | Converte campo do JSON do relatório provisório em número (ausente = 0) | `dump:303-313` | Existe só por causa do JSON. Não migra |
| `fn_comissao_coordenadores_historico()` | Trigger: grava INSERT/UPDATE/DELETE no histórico | `dump:35-54` | → `fn_auditar()` genérica |
| `fn_comissao_coordenadores_historico_imutavel()` | Trigger: barra UPDATE/DELETE do histórico | `dump:70-76` | → `fn_log_imutavel()` em todo log |

Também usadas: `public.set_updated_at()` em 8 tabelas (`dump:1862-1918`).

## Rotas da API que existem hoje

Montadas em `core_comissionamento/index.js:57` (`export const rotas = [`); as rotas de 23 e 24/11 estão na seção seguinte.

| Caminho | Fonte | Observação |
|---|---|---|
| `/simulador_parametros` | tabela | CRUD genérico (`crudFactory`) |
| `/simulacoes` | tabela + itens | Máquina de estados na rota (`simulacoes.route.js:34`, `const TRANSICOES = {`); 409 `PEDIDO_SEM_FATURAMENTO` e `VERSAO_VENDEDOR_FECHADA`; lista `pick` descarta campo ausente **sem erro** (`:59-63`); versão calculada na rota (`:222-231`) |
| `/simulacao_resolvida`, `/comissoes_master`, `/comissoes_nf`, `/comissoes_resumo_mensal` | views | Leitura; `is_track_record` obrigatório nas de NF, salvo com `competencia`; `meus`, `competencia` e filtros de fabricação (veja "O que entrou de 18 a 23/11") |
| `/blacklist_comissoes_destinatario`, `/blacklist_comissoes_vendedores` | tabelas | CRUD; presença bloqueia |
| `/bloqueio_comissoes/:numero_nf` | tabela | PUT é upsert; DELETE físico |
| `/regras_comissoes_fixas` | tabela | CRUD genérico, `paranoid` |
| `/dashboard/comissoes` | função | permissão `dash-comissoes` |

Sem rota: `comissao_coordenadores` e o histórico.

## O que entrou em 23 e 24/11: aprovação, fechamento, ajuste e contestação

Decisões N16-194 a N16-200. API na `develop` (`api-acos-vital` `9e6ef60`, `0b7d92c` e `ed6d147`, do Gustavo); as cinco migrations de 23/11 (`comissao_aprovacao_controladoria`, `comissao_fechamento_revogacao`, `comissao_a2_nota_parcial`, `comissao_ajuste_contestacao` e `comissao_dashboard_sistema`) estão no tst ✅ ([[Dump-AvHub-Teste-2026-11-24]], com a linha de cada objeto) e, pela palavra do Gustavo, na produção. Sem as quatro primeiras, `/comissoes_nf`, `/comissoes_master` e `/simulacao_resolvida` dão 500.

| Rota | O que faz | Onde |
|---|---|---|
| `POST /comissoes_aprovacoes` | Aprova em lote parcial (até 2.000 pedidos), com as versões que a tela mostrou; volta `aprovados`, `ja_aprovados` e `recusados` (`VERSAO_MUDOU`, `COMPRAS_NAO_CONCLUIU`, `PEDIDO_SEM_SIMULACAO`, `DUPLICADO_NO_LOTE`, `PARAMETRO_INVALIDO`); autor = token; corpo até 1 MB. Mapa: `visao-geral`, `pode_aprovar` | ✅ `api-acos-vital` `src/schemas/core_comissionamento/tables/aprovacoes_comissao/aprovacoes_comissao.route.js:33` (`router.post("/"`) |
| `GET /comissoes_aprovacoes` | Histórico com `vigente`; filtros de unidade, pedido, autor e período | `:67` (`router.get("/"`) |
| `POST /comissoes_aprovacoes/{id}/revogar` | Revoga com motivo, numa linha nova, só a vigente e só com o mês aberto | `:120` (`router.post("/:id/revogar"`) |
| `GET /comissoes_fechamentos`, `/itens`, `/diferencas`; `PUT /inicio` | Fotos do fechamento, itens e diferenças; o `PUT` grava o marco por unidade (`visao-geral`, `pode_aprovar`) | ✅ `src/schemas/core_comissionamento/tables/fechamentos_comissao/fechamentos_comissao.route.js:25` (`router.get("/"`), `:98` (`router.put("/inicio"`) |
| `GET /comissoes_pedido` | Uma linha por pedido na competência, com os filtros da NF e o recorte; desde 24/11, `is_bloqueada` e `motivo_bloqueio` (o `min()` das notas bloqueadas) | ✅ `src/schemas/core_comissionamento/views/vw_comissao_pedido/vw_comissao_pedido.route.js:116` (`bool_or(n.is_bloqueada) AS is_bloqueada`) |
| `GET /comissoes_resumo_mensal?competencia=` | Desde 24/11, `qtd_pedidos` e um `qtd_pedidos_<situação>` por situação (a do pedido é a mais severa das notas); os contadores de nota não mudam | ✅ `src/schemas/core_comissionamento/views/vw_comissao_resumo_mensal/vw_comissao_resumo_mensal.route.js:93` (`count(*)::int AS qtd_pedidos`); ordem das situações em `src/schemas/core_comissionamento/situacaoPedido.js:30` (`export const CONTADORES_PEDIDO`) |
| `POST /comissoes_ajustes` | Ajuste de letra da Controladoria (`visao-geral`, `pode_editar`); vale o último | ✅ `src/schemas/core_comissionamento/tables/ajustes_comissao/ajustes_comissao.route.js:39` (`router.post("/"`) |
| `POST /comissoes_contestacoes`; `/{id}/manter`, `/aceitar`, `/negar` | Abrir (`minhas-comissoes`, `pode_criar`); Compras mantém (`analise-simuladores`, `pode_editar`); a Controladoria aceita ou nega (`visao-geral`, `pode_editar`) | ✅ `src/schemas/core_comissionamento/tables/contestacoes_vendedor/contestacoes_vendedor.route.js:52` (`router.post("/"`), `:92`, `:94`, `:96` |
| `GET /simulacoes`, `/simulacoes/{id}` | Quem lê só por Minhas Comissões vê só o vínculo próprio (lista vazia ou 404) | ✅ `src/schemas/core_comissionamento/tables/simulacoes/simulacoes.route.js:169` (`const recorteMinhasComissoes`) |

**Situações novas da NF:** `AGUARDANDO_APROVACAO` (Compras concluiu, falta a Controladoria), `VALIDADO_PARCIAL` (paga a parte que casou) e `ITEM_AMBIGUO` (não paga), com os contadores no resumo. A master e a NF ganham `aprovado_por`, `aprovado_por_nome`, `aprovado_em`, `ajustado` e `letra_ajustada`. O total de `/comissoes_nf` deixou de ignorar `numero_pedido` e `numero_nf` (bug antigo, corrigido em `9e6ef60`).

**Rotina:** `fn_comissao_fechar_meses()` no `pg_cron` (job `comissao_fechamento_diario`, 04:17 UTC), dia de fechamento em `calendario_comissao` (padrão 10). Nada fecha sem o marco, que não está gravado (BL-114).

**Desempenho (Gustavo, cópia da produção de 17/11):** aprovar 11 pedidos num lote, 29 ms; leituras cerca de 40 ms mais lentas pela view de estado; `fn_comissao_resumo_competencia` de 5–7 s para 0,4 s por mês; contadores por pedido, cerca de 0,4 s a mais por mês (não medido).

O que falta para ir ao ar: [[Backlog-Entrega-Gustavo-2026-11-24]] e PS-068.

## Resumo dos problemas de estrutura

São os 11 itens de "O que está frágil e o que o módulo novo faz", no topo desta nota.

Relacionados: [[01-Motor-Atual-Como-Calcula]], [[03-Modelo-Novo-core_comissao]], [[Comissoes]], [[Banco-AvHub]].
