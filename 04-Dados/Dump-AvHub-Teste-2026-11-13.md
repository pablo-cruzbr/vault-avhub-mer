---
tags: [dados, banco, dump, av-hub, teste]
criado: 2026-11-13
estado-em: 2026-11-13
status: vigente
dono: Gustavo (DBA)
fontes: ["Dump avhub teste 13.11.sql, gerado em 13/11/2026 09:40 e enviado pelo Nathan em 13/11/2026", "Dump-AvHub-Teste-2026-11-12 (comparação)", "Relatório de entrega de Gustavo de 13/11/2026 (LOG-57, LOG-58 e SQL-022: respostas e log58b)", "omie-elt-pipeline 46b53d4 (origin/develop de 13/11/2026, só para conferir se o código acompanha)"]
---

# Dump do banco de teste do av-hub (13/11/2026)

**Em uma frase:** é o retrato mais novo do esquema do banco do av-hub, tirado do ambiente de **teste** em 13/11/2026. Ele mostra a OC de recompra cancelada devolvendo o aviso do MES ao Compras (LOG-58b), a referência da OC com o aviso de origem (SQL-022) e a coluna `codigo_item_integracao` no item do pedido de venda (SQL-021).

**Quando consultar:** quando uma nota citar o banco do av-hub e você precisar saber se o que ela diz ainda vale. A nota geral do banco é o [[Banco-AvHub]]. O dump anterior é o [[Dump-AvHub-Teste-2026-11-12]].

## Ficha do arquivo

- **Arquivo:** `04-Dados/Dumps/avhub-tst-esqueleto-2026-11-13.sql`, cópia sem mudança do arquivo enviado pelo Nathan em 13/11/2026 (`Dump avhub teste 13.11.sql`).
- **Ambiente:** teste (`tst`). Gerado em 13/11/2026 às 09:40, PostgreSQL 18.6 (pg_dump 18.3), dump do cluster (papéis e esquema).
- **Só esquema:** nenhum `COPY` de dados, e os papéis não trazem senha. O único `INSERT` do arquivo é texto de um comentário. Não há dado de cliente, de pedido nem de usuário.
- **Lugar na precedência:** fonte 2 (dumps), depois do código na `develop` (F5). Ele mostra o que está **aplicado no banco de teste** e é a referência do esquema: as migrations ficam com o DBA, fora do repositório (N16-155).

## O que mudou desde o dump de 12/11

| | 12/11 (teste) | 13/11 (teste) |
|---|---|---|
| Tabelas | 151 | 151 |
| Views | 55 | 55 |
| Funções | 283 | 284 |
| Triggers | 204 | 205 |
| Índices | 324 | 324 |

### LOG-58b: a OC de recompra cancelada devolve o aviso ao Compras

- **Entrou** o trigger `trg_ordens_compra_aviso_mes_reabrir` (`:35282`), depois de mudar `status` ou `deleted_at` de `core_vendas_faturamento.ordens_compra`, com a função `fn_ordens_compra_aviso_mes_reabrir` (`:11369`): quando a OC de recompra é cancelada ou excluída, o aviso volta a `ABERTO` e perde o tratamento (`acao_tratamento`, `id_ordem_compra_recompra`, `motivo_tratamento`, `tratado_por` e `tratado_em` ficam nulos). Só reabre se o aviso ainda aponta essa OC.
- **Mudou** `fn_avisos_mes_compra_guardar` (`:7429`): o aviso resolvido continua sem voltar (AV581), com uma única exceção, `RESOLVIDO` por `RECOMPRA` para `ABERTO` quando a OC de recompra está cancelada ou excluída (`:7448`).
- **Mudou** o índice `uq_ordens_compra_id_aviso_mes` (`:33611`): vale só para OC ativa (não cancelada e não excluída). Assim o aviso reaberto aceita outra OC de recompra, e a cancelada guarda o `id_aviso_mes` como histórico.

### SQL-022: a referência da OC diz de qual aviso ela é a recompra

- A view `core_vendas_faturamento.vw_ordens_compra_referencia_mes` (`:27883`) ganhou no fim a coluna `id_aviso_mes_origem` (`:27920`), com um `LEFT JOIN` em `avisos_mes_compra`. Era o que faltava no dump de 12/11 (`:27831`).

### SQL-021: o item do pedido de venda guarda o item da proposta

- `core_vendas_faturamento.produto_vendas` (`:6410`) ganhou `codigo_item_integracao varchar(30)` (`:6432`, com comentário em `:6460`): o identificador do item que o Hub manda no `IncluirPedido`, que liga o item faturado ao item da proposta. Nulo no histórico e no pedido digitado direto no Omie.
- **O código acompanha:** a pipeline do Omie grava a coluna e já tolerava a falta dela (`omie-elt-pipeline` `src/omie/resources/pedidosVendas.ts:259`, `A coluna codigo_item_integracao chega ao banco depois do código`).

### Não mudou

- O banco do LOG-57 está igual ao de 12/11: `codigo_empresa_pv uuid NOT NULL` e `codigo_produto_pv varchar(60)` em `core_comercial.divergencias_compra` (`:17964`, `:17966`) e a unicidade `uq_divergencias_compra_item_pv` (`:32244`).
- O encargo da condição de pagamento continua na proposta e na simulação (`:4347`, `:20168`).

## O que isso muda no vault

- [[Banco-AvHub]]: o aviso do dump mais novo passa a ser este.
- LOG-58: a OC de recompra cancelada reabre o aviso (R4).
- SQL-022: a coluna da view está no teste, e o ❓ "não conferido em dump" sai.
- BL-079 (SQL-021): a coluna existe no teste.
