---
tags: [anexo, clientes, grupos-de-empresa, av-hub, fora-do-fluxo]
criado: 2026-10-14
estado-em: 2026-11-09
status: vigente
dono: Gustavo (DBA)
develop-conferida: [api-acos-vital d160d17, av-hub 6fcbba6, em 2026-11-09]
fontes: [api-acos-vital f322dcd src/schemas/core_vendas_faturamento, HUB b55ac55 app/(protected)/acompanhamento-clientes e lib/domain/acompanhamentoClientes.ts, conferência de 29/10/2026 em api-acos-vital develop 0384e89 e av-hub develop 758d5f0, LOG-48, API-014, PDF de Gustavo de 09/11/2026 (entrega LOG-48)]
---

# Acompanhamento de Clientes e grupos de empresa

**Em uma frase:** a tela mostra, por cliente e por grupo de empresas, quanto comprou e faturou no mês, quais vendedores o atenderam e se ele está parado.

**Quando consultar:** quando a dúvida é "este cliente está inativo?" ou "como vários CNPJs viram um grupo?". Esta nota fica fora do fluxo 0b. Contrato: [[Contratos-da-v2|LOG-48]] (banco e API existem; pendências de banco abertas).

## Como funciona

- Vários CNPJs podem formar um **grupo**. Se um CNPJ não vendeu, mas outro do grupo comprou dentro do prazo, ele **não** é marcado como inativo. Cada CNPJ mostra a própria contagem.
- O vínculo é manual. O sistema sugere grupos pela raiz do CNPJ (os 8 primeiros dígitos).
- Na tela, o prazo de inatividade é de 30, 60, 90 ou 180 dias (padrão: 90). A API aceita de 1 a 3650.
- O vendedor vê só os próprios clientes. Gerência e admin veem todos 📝 (decisões de 13/10).

## Onde está hoje

- ✅ Banco, rotas, telas e diálogo de grupos existem. A tela agora fica em `vendas/acompanhamento-clientes`.
- ✅ **Setor do cliente e do grupo** ([[Contratos-da-v2|API-014]]): tabelas `clientes_setor` e `setores_clientes` na API (varios setores por alvo, `43dbec3` de 23/10) e BFF `clientes-setor` e `setores-clientes` no HUB; banco e API terminados em 29/10. Falta o Nathan testar salvar 2 setores, o filtro e o Excel.
- ✅ O que o banco e a API deviam ao contrato ([[Contratos-da-v2|LOG-48]] §9, §10, §12 e os vendedores do grupo) está na `develop` (migration 048b), e o front já usa o que a API soma: as marcas `GAMBIARRA` da tela saíram em 30/10 (`av-hub` `046598a`). Entrega do Gustavo de 09/11, conferida na `develop`.
- ✅ A linha do grupo traz os `vendedores`, somados pela API.
- ✅ NF de pedido cancelado ou denegado sai dos totais (§9.1), e a lista filtra por um cliente só na página do cliente (§9.2).
- ✅ Venda e faturamento por cliente com as deduções separadas (§10).
- ✅ A lista parte do cadastro (tipo Cliente) mais quem comprou; NF conta como compra; quem nunca comprou sai como `sem_compra` (§12).
- 📝 Produção: segundo o Gustavo (09/11), a 048b está no banco de produção e os perfis "Gerência Geral e Diretoria" e "Acompanhamento G.G e DIretoria" têm escopo `todos` (§6). O dump de produção não está no vault, então isso não foi conferido aqui.

## O que falta

- A permissão de exportar (`pode_exportar`, N16-147 item 2) entrou na API em 09/11 (`d160d17`), mas a migration `2026-11-09_log48b_pode_exportar.sql` não está no repositório e o botão "Exportar Excel" da tela ainda não olha a permissão 🟡 Gustavo e Nathan.
- Endpoint de exportação no backend (§13.2): opcional, não feito 🔴.

## Detalhe técnico

Regra de negócio completa: vários CNPJs formam um **grupo**. Se um CNPJ não vendeu mas outro do grupo comprou dentro do prazo, ele **não** é marcado como inativo; cada CNPJ mostra a própria contagem. O vínculo é manual, com sugestão pela raiz do CNPJ (8 primeiros dígitos). Prazo de inatividade escolhido na tela: 30, 60, 90 ou 180 dias (padrão 90; a API aceita de 1 a 3650). O vendedor vê só os próprios clientes; gerência e admin veem todos 📝 (decisões de 13/10).

### Estado

| Item | Estado | Selo |
|---|---|---|
| Tabelas | `grupos_clientes` e `grupos_clientes_membros` em `core_vendas_faturamento` | ✅ pastas `tables/grupos_clientes*` |
| Rotas da lista e do movimento | `GET /acompanhamento_clientes`, `GET /acompanhamento_clientes/movimento` (`dias_inativo`, `codigo_cliente`, `id_grupo`) | ✅ `fn_acompanhamento_clientes.route.js`; montagem em `core_vendas_faturamento/index.js` |
| Rotas de grupos | `GET /grupos_clientes`, `/sugestoes`, `/:id`, `POST /`, `PUT` e `DELETE /:id`, `POST /:id/membros`, `DELETE /:id/membros/:empresa/:codigo` | ✅ `grupos_clientes.route.js` |
| Visão antiga | `GET /clientes_inativos` (cada `codigo_cliente` sozinho) | ✅ `core_vendas_faturamento/index.js` |
| Telas | `vendas/acompanhamento-clientes` (lista), `cliente/[codigoEmpresa]/[codigoCliente]`, `grupo/[id]`; diálogo `GrupoClientesDialog`; BFF `app/api/acompanhamento-clientes`, `app/api/grupos-clientes`, `app/api/clientes-setor` e `app/api/setores-clientes` | ✅ |
| Status do cliente na tela | `ativo`, `inativo`, `coberto_grupo`, `sem_compra` | ✅ `lib/domain/acompanhamentoClientes.ts` |

### Pendências (detalhe)

- Vendedores na linha do grupo: a API soma os vendedores dos membros ✅ `api-acos-vital` `fn_acompanhamento_clientes.route.js:592` (`GROUP BY 1, 2) v) AS vendedores`); o front deixou de montar (`av-hub` `046598a`, 30/10).
- NF cancelada fora dos totais (§9.1) ✅ dump 04/11 `:5270` (`NF válida (compra) = viva e sem o pedido cancelado/denegado`); filtro por um cliente (§9.2) ✅ `api-acos-vital` `fn_acompanhamento_clientes.route.js:504` (`[048b, §9.2] Um CNPJ só`).
- Venda e faturamento com deduções (§10): colunas `venda_bruta_mes`, `venda_deducoes_mes`, `venda_liquida_mes`, `faturamento_*` e `composicao_mes` ✅ `api-acos-vital` `fn_acompanhamento_clientes.route.js:224` (`venda_deducoes_mes: "venda_deducoes_mes"`); função no dump 04/11 `:5191`.
- Base de clientes (§12): cadastro tipo Cliente + quem tem pedido ou NF + membros de grupo ✅ dump 04/11 `:5557` (COMMENT da função) e `:5518` (`'sem_compra'`). O "1.265 de 3.842" era de antes da 048b.
- Perfil Gerência `todos` (§6): 📝 dado de produção informado pelo Gustavo (dump de produção de 04/11, `auth.perfis.escopo_vendedores`), não conferido aqui.
- `pode_exportar` 🟡: `api-acos-vital` `src/schemas/auth/tables/permissoes/permissoes.model.js:54` (`pode_exportar: {`); falta a migration no repositório e ligar o botão da tela, que hoje não olha a permissão: `av-hub` `components/AcompanhamentoClientes/AcompanhamentoClientes.tsx:484` (`onClick={exportarExcel}`).
