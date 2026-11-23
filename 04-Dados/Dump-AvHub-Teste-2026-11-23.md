---
tags: [dados, banco, dump, av-hub, teste]
criado: 2026-11-23
estado-em: 2026-11-23
status: vigente
dono: Gustavo (DBA)
fontes: ["Dump avhub teste 23.11 (esqueleto).sql, gerado em 23/11/2026 12:00 e enviado pelo Nathan em 23/11/2026", "Dump-AvHub-Producao-2026-11-18 e Dump-AvHub-Teste-2026-11-16 (comparação)", "api-acos-vital ce4f90f (origin/develop, para ligar cada objeto à migration que o código cita)"]
---

# Dump do banco de teste do av-hub (23/11/2026)

**Em uma frase:** é o retrato do esquema do banco de **teste** do av-hub em 23/11/2026. Ele tem tudo o que a produção tinha em 18/11 e mais as seis migrations da comissão de 18 a 23/11 (fecha a PS-062 no teste) e a estrutura das telas de Acessos (`LOG-62`).

**Quando consultar:** para saber se uma mudança de banco de 18 a 23/11 já está no tst. A nota geral do banco é o [[Banco-AvHub]]. O dump anterior do teste é o [[Dump-AvHub-Teste-2026-11-16]], e o de produção é o [[Dump-AvHub-Producao-2026-11-18]].

## Ficha do arquivo

- **Arquivo:** `04-Dados/Dumps/avhub-tst-esqueleto-2026-11-23.sql`, cópia sem mudança do arquivo enviado pelo Nathan em 23/11/2026 (`Dump avhub teste 23.11 (esqueleto).sql`).
- **Ambiente:** teste. Gerado em 23/11/2026 às **12:00**. É um dump do cluster: papéis e esquema.
- **Só esquema:** nenhum `COPY` de dados, e os papéis não trazem senha.
  - Não há dado de cliente, de pedido nem de usuário.
  - Por isso não aparecem as linhas de telas, rotas e permissões (`auth.telas`, `auth.rotas_telas`, `auth.permissoes`): o cadastro das telas novas do Estoque (PS-060) e a P2 do `LOG-62` (BL-110) não se conferem por aqui.
- **Lugar na precedência:** fonte 2 (dumps), depois do código na `develop` (F5). Ele mostra o que está **aplicado no teste**.
- **Docker local:** a estrutura do Docker foi igualada a este dump em 23/11 (`docker-teste/migrations/2026-11-23_igualar_esqueleto_tst.sql`, fora do vault), com zero diferença no catálogo.

## Teste (23/11) × produção (18/11) × teste (16/11)

Contagem feita do mesmo jeito nos três arquivos (linhas `CREATE`):

| | 16/11 (teste) | 18/11 (produção) | 23/11 (teste) |
|---|---|---|---|
| Tabelas | 151 | 156 | 157 |
| Views | 55 | 55 | 57 |
| Funções | 290 | 300 | 306 |
| Triggers | 209 | 214 | 219 |
| Índices | 323 | 334 | 335 |

**Nada da produção de 18/11 falta aqui.** Do teste de 16/11 para cá entraram o Orçamento (`LOG-60`), a Central de Avisos (`LOG-61`) e a exclusão de proposta (`LOG-59`), os mesmos objetos descritos no dump de produção: o que lá era "não se sabe se está no tst" passa a ✅ no tst.

## O que o teste tem a mais que a produção de 18/11

### As seis migrations da comissão (N16-185 a N16-190)

| Migration (nome citado no código) | O que aparece no dump |
|---|---|
| `2026-11-18_comissao_grao_pedido` | `PREJUIZO_PEDIDO` e `FABRICACAO_BLOQUEADA` no CHECK de `simulacao_itens` (`:21462`, `simulacao_itens_regra_check`) e de `propostas_itens` (`:19956`); `venda_revenda`, `venda_fabricacao` e `pct_venda_fabricacao` na `vw_comissao_master` (`:23150`) |
| `2026-11-18_comissao_competencia` | Tabela `core_comissionamento.calendario_comissao` (`:21140`); `fn_comissao_mes_aberto` (`:6210`), `fn_comissao_nfs_deslocadas` (`:6246`) e `fn_comissao_resumo_competencia` (`:6279`); `mes_competencia` e `vale_na_competencia` na master e na `vw_comissao_nf` (`:23563`) |
| `2026-11-19_comissao_escopo_fabricacao` | `venda_revenda`, `venda_fabricacao` e `pct_venda_fabricacao` na `vw_comissao_nf` (`:23563`) |
| `2026-11-19_comissao_master_itens_desempenho` | `margem_item_vendedor` e `margem_item_compras` na master e na `vw_simulacao_resolvida` (`:22095`) |
| `2026-11-19_comissao_trava_versao_vendedor` | `fn_simulacoes_trava_versao_vendedor` (`:6609`), com `VERSAO_VENDEDOR_FECHADA` (`:6644`), e o trigger `trg_simulacoes_trava_versao_vendedor` (`:36879`); `DEVOLVIDO` no `simulacoes_status_check` (`:21646`) |
| `2026-11-23_comissao_pre_aceita_devolvido` | View `vw_simulacao_pre_aceita` (`:21890`); `origem_pre_aceita` na master, na NF e na resolvida; `valor_comissao_pre_aceito` e `qtd_devolvido` na `vw_comissao_resumo_mensal` (`:23727`) |

Também está no banco o corte da predominância, que o vault dava como "sem migration, só no model": `simulador_parametros.pct_predominancia_fabricacao numeric(10,4) DEFAULT 50 NOT NULL` (`:21794`), com CHECK de 0 a 100 (`:21806`). Os bloqueios ganharam dois triggers, `trg_bloqueio_comissoes_delete` (`:36799`) e `trg_bloqueio_comissoes_desbloqueio` (`:36807`), que gravam quando a nota foi desbloqueada (`unblocked_at`, que as views mostram como `desbloqueado_em`).

### Telas de Acessos (`LOG-62`)

- `auth.telas` com `acao_de` (`:17363`) e `rotulo_acao` (`:17364`), mais o índice `ix_telas_acao_de` (`:33525`).
- `auth.usuarios.ultimo_acesso_em` (`:17407`).
- A view `auth.vw_telas_acoes_usadas` (`:17619`), que lista as ações que `auth.rotas_telas` de fato usa.

## O que isso muda no vault

- **PS-062:** as seis migrations da comissão estão no tst ✅. Continua ❓ a produção, cujo último dump (18/11, 07:22) não tem nenhuma delas.
- **Comissão:** em [[02-Tabelas-Atuais-core_comissionamento]] e [[01-Motor-Atual-Como-Calcula]], o banco das rotas novas passa de ❓ a ✅ no tst.
- **`LOG-62`:** a estrutura está no tst; os dados (telas, rotas e a P2) não vêm no esquema.
- **[[Banco-AvHub]]:** o dump mais novo passa a ser este.
