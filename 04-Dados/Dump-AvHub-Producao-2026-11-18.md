---
tags: [dados, banco, dump, av-hub, producao]
criado: 2026-11-18
estado-em: 2026-11-18
status: vigente
dono: Gustavo (DBA)
fontes: ["Dump avhub produção 18.11 (esqueleto).sql, gerado em 18/11/2026 07:22 e enviado pelo Nathan em 18/11/2026", "Dump-AvHub-Teste-2026-11-16 (comparação)", "api-acos-vital 3f762d2 e av-hub 4b5c023 (origin/develop, só para conferir se o código acompanha)"]
---

# Dump do banco de produção do av-hub (18/11/2026)

**Em uma frase:** é o primeiro retrato do esquema do banco de **produção** do av-hub no vault, tirado em 18/11/2026. Ele confirma em produção o Orçamento (`LOG-60`), a Central de Avisos (`LOG-61`) e a exclusão de proposta com o pedido excluído no Omie (`LOG-59`), e tem tudo o que o teste de 16/11 tinha.

**Quando consultar:** quando uma nota precisar saber se uma mudança de banco já está em produção. A nota geral do banco é o [[Banco-AvHub]]. O último dump do teste é o [[Dump-AvHub-Teste-2026-11-16]].

## Ficha do arquivo

- **Arquivo:** `04-Dados/Dumps/avhub-prd-esqueleto-2026-11-18.sql`, cópia sem mudança do arquivo enviado pelo Nathan em 18/11/2026 (`Dump avhub produção 18.11 (esqueleto).sql`).
- **Ambiente:** produção (banco `avhub_prd_db`). Gerado em 18/11/2026 às **07:22**, PostgreSQL 18.6. É um dump do cluster: papéis e esquema.
- **Só esquema:** nenhum `COPY` de dados, e os papéis não trazem senha.
  - Não há dado de cliente, de pedido nem de usuário.
  - Por isso não aparecem as linhas de telas, rotas e permissões (`auth.telas`, `auth.rotas_telas`, `auth.permissoes`) nem o catálogo de avisos (`core.notificacao_tipos`).
- **Lugar na precedência:** fonte 2 (dumps), depois do código na `develop` (F5). Ele mostra o que está **aplicado em produção**.

## Produção (18/11) × teste (16/11)

| | 16/11 (teste) | 18/11 (produção) |
|---|---|---|
| Tabelas | 151 | 156 |
| Views | 55 | 55 |
| Funções | 291 | 301 |
| Triggers | 209 | 214 |
| Índices | 324 | 335 |

**Nada do teste falta em produção.** Os objetos a mais são os três blocos abaixo. Outras 8 tabelas aparecem diferentes, sem mudança de regra:
- em 7 delas o Postgres escreveu o mesmo `CHECK` de outro jeito (`ARRAY[...]::text[]` × `ARRAY[(...)::text]`): `simulacoes`, `simulacao_itens`, `contadores_documento`, `fechamento_manual`, `ordens_compra`, `ordens_compra_itens` e `pedidos_vendas_status_historico`;
- em `pedidos_compras_itens` só muda a ordem das colunas `codigo_item_integracao` e `codigo_categoria`.

### Orçamento (`LOG-60`, migration `2026-11-17_orcamento_cotacoes_pedidos_custo`)

- `core_comercial.solicitacoes_custo` (`:19819`), o pedido de custo, com o produto obrigatório (`id_produto uuid NOT NULL`, N16-174) e os `CHECK` de status.
- `core_comercial.ofertas` (`:19065`), a cotação de fornecedor, com `valida_ate date NOT NULL` e `prazo_entrega_dias` de 0 a 365.
- A imutabilidade: `core_comercial.fn_oferta_imutavel` (`:3340`) e o trigger `trg_ofertas_imutavel` (`:35767`).
- A migration grava, na mesma transação, o menu e as rotas (`auth.telas`, `auth.rotas_telas`) e as telas do perfil "Orçamentos" (`auth.permissoes`). Essas linhas não vêm no esquema, mas a transação é uma só: se as tabelas estão aqui, a migration rodou inteira.

### Central de Avisos (`LOG-61`, migration `2026-11-18_central_de_avisos`)

- As tabelas `core.notificacao_tipos` (`:17948`), `core.notificacoes` (`:17988`) e `core.notificacao_preferencias` (`:17935`).
- O índice único do agrupamento: `ux_notificacoes_agrupamento` (`:33184`).
- As funções `core.fn_notificar` (`:1625`), `core.fn_destinatarios_por_tela` (`:1433`), `core.fn_usuario_tem_tela` (`:2042`) e `core.fn_avisos_limpar` (`:1370`).
- O dump é das 07:22 de 18/11, então o SQL dos avisos já estava aplicado nesse horário.

### Exclusão de proposta e pedido excluído no Omie (`LOG-59`)

- `core_comercial.fn_proposta_excluir` (`:4725`), que só exclui nos status `ABERTA`, `CANCELADA`, `EXPIRADA` e `EXCLUIDA_OMIE` (`:4792`), e `fn_proposta_exclusao_soltar` (`:4826`).
- O pedido que sai do espelho do Omie:
  - `core_comercial.fn_pedido_venda_excluido_omie` (`:3742`) leva a proposta a `EXCLUIDA_OMIE` (`:3785`) e grava o evento `PEDIDO_EXCLUIDO_OMIE` (`:3790`);
  - `fn_pedido_venda_voltou_omie` (`:4246`) faz a volta;
  - o trigger `trg_pedidos_vendas_pedido_omie_saida` (`:36880`), com `core_vendas_faturamento.fn_pedidos_vendas_pedido_omie_saida` (`:14222`), dispara as duas.
- As colunas e restrições:
  - `core_comercial.pedidos_venda.excluido_omie_em` (`:19262`);
  - `propostas.status` passou de `varchar(12)` para `varchar(20)`, com `EXCLUIDA_OMIE` no `ck_propostas_status` (`:4931`);
  - os tipos de evento novos em `ck_propostas_eventos_tipo`.
- A view `vw_propostas_lista` passa a ignorar o pedido excluído no Omie ao ligar a proposta ao pedido (`pv.excluido_omie_em IS NULL`).
- É a migration `2026-11-16_comercial_proposta_exclusao_pedido_excluido_omie`, que o vault dava como "não conferida em dump".

## O que isso muda no vault

- **`LOG-59`:** o banco passa de ❓ a ✅ em produção. Continua 🔴 a trava do `exclusionSync` na pipeline.
- **`LOG-60` e `LOG-61`:** a migration conferida em produção. Na raia 02, o perfil "Orçamentos" e o cadastro das telas passam de 🟡 a ✅ (pela migration inteira). Ainda não conferido: quem está no perfil.
- **[[Banco-AvHub]]:** o dump mais novo passa a ser este, o primeiro de produção.
- **O teste:** o último dump do tst é o de 16/11. Não se sabe se o LOG-59, o LOG-60 e o LOG-61 também estão no tst.
