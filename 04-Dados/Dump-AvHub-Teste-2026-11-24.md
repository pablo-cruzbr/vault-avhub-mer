---
tags: [dados, banco, dump, av-hub, teste]
criado: 2026-11-24
estado-em: 2026-11-24
status: vigente
dono: Gustavo (DBA)
fontes: ["Dump avhub testes 24.11 (esqueleto).sql, gerado em 24/11/2026 14:15 e enviado pelo Nathan em 24/11/2026", "Dump-AvHub-Teste-2026-11-23 (comparação)", "PDF de Gustavo de 24/11/2026 (migrations de 18 a 24/11 no tst e na produção)", "api-acos-vital ed6d147 (origin/develop)"]
---

# Dump do banco de teste do av-hub (24/11/2026)

**Em uma frase:** é o retrato do esquema do banco de **teste** do av-hub em 24/11/2026; em relação ao de 23/11 ele traz as quatro migrations da comissão de 23/11 (aprovação da Controladoria, fechamento e revogação, A2 e nota parcial, ajuste e contestação) e o dashboard no modo sistema.

**Quando consultar:** para saber se o banco do fluxo novo da comissão (N16-194 a N16-200) está no tst. A nota geral do banco é o [[Banco-AvHub]]; o dump anterior do teste é o [[Dump-AvHub-Teste-2026-11-23]].

## Ficha do arquivo

- **Arquivo:** `04-Dados/Dumps/avhub-tst-esqueleto-2026-11-24.sql`, cópia sem mudança do arquivo enviado pelo Nathan em 24/11/2026 (`Dump avhub testes 24.11 (esqueleto).sql`).
- **Ambiente:** teste. Gerado em 24/11/2026 às **14:15**. Dump do cluster: papéis e esquema.
- **Só esquema:** nenhum `COPY`. Não aparecem as linhas de `auth.telas`, `auth.rotas_telas` e `auth.permissoes`, então a `custo-item` inativa (PS-066) e as ações dos perfis (BL-112) não se conferem por aqui. O job do `pg_cron` também não aparece (é dado do schema `cron`); só o comentário que o cita (`:6983`, `comissao_fechamento_diario`).
- **Produção:** este dump é só do tst. Que as mesmas migrations estão na produção é a palavra do Gustavo (PDF de 24/11, `APLICADAS.md`); não há dump de produção depois do de 18/11 ([[Dump-AvHub-Producao-2026-11-18]]).

## Teste de 24/11 × teste de 23/11

Contagem pelas linhas que começam com `CREATE` nos dois arquivos:

| | 23/11 | 24/11 | Diferença |
|---|---|---|---|
| Tabelas | 157 | 164 | +7 |
| Views | 57 | 60 | +3 |
| Funções | 307 | 324 | +17 |
| Triggers | 219 | 226 | +7 |
| Índices | 336 | 342 | +6 |

(Por esta contagem o de 23/11 tem 307 funções; a nota dele diz 306.) Nada do dump de 23/11 sumiu.

## O que entrou

| Migration (PDF do Gustavo) | O que aparece no dump |
|---|---|
| `2026-11-23_comissao_aprovacao_controladoria` (N16-194) | Tabela `aprovacoes_comissao` (`:22019`) com trigger de imutável; `fn_comissao_aprovar` (`:6297`); view `vw_comissao_aprovacao_pedido` (`:23346`); a situação `AGUARDANDO_APROVACAO` na NF (`:24662`) e `qtd_aguardando_aprovacao` no resumo (`:25305`) |
| `2026-11-23_comissao_fechamento_revogacao` (N16-195, N16-196) | Tabelas `comissao_inicio_sistema` (`:6720`), `fechamentos_comissao` (`:6834`), `fechamentos_comissao_itens` (`:22401`) e `revogacoes_aprovacao` (`:7157`), todas com trigger de imutável; `fn_comissao_fechar_meses` (`:6951`), `fn_comissao_fechar_mes`, `fn_comissao_mes_fechado`, `fn_comissao_diferencas`, `fn_comissao_definir_inicio` e `fn_comissao_revogar` (`:7184`) |
| `2026-11-23_comissao_a2_nota_parcial` (N16-197) | View `vw_simulacao_casamento` (`:23413`); as situações `VALIDADO_PARCIAL` (`:25024`) e `ITEM_AMBIGUO`, com `qtd_validado_parcial` e `qtd_item_ambiguo` no resumo (`:25306`, `:25307`) |
| `2026-11-23_comissao_ajuste_contestacao` (N16-198, N16-199) | Tabelas `ajustes_comissao` (`:6187`) e `contestacoes_vendedor` (`:6411`); view `vw_comissao_ajuste_vigente` (`:23017`); `fn_comissao_ajustar`, `fn_comissao_contestar` (`:6581`), `fn_comissao_contestacao_manter`, `_aceitar`, `_negar` e `_pegar`; o trigger `trg_simulacoes_contestacao_corrigida` (`:38632`), que marca a contestação como corrigida quando Compras grava a versão nova |
| `2026-11-23_comissao_dashboard_sistema` (N16-200) | `fn_dashboard_vendedores_sistema` (`:7516`) |

## O que isso muda no vault

- **Comissão:** o banco do fluxo novo está no tst ✅ ([[02-Tabelas-Atuais-core_comissionamento]]); na produção, pela palavra do Gustavo.
- **PS-062 e PS-065:** fechadas em 24/11 ([[Pontas-Soltas-Resolvidas-em-14-10]]).
- **Docker local:** igualado ao dump de 23/11, ainda não tem estas sete tabelas; para testar o fluxo novo da comissão no Docker, é preciso igualar a este.
- **[[Banco-AvHub]]:** o dump mais novo do teste passa a ser este.
