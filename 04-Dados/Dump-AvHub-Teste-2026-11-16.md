---
tags: [dados, banco, dump, av-hub, teste]
criado: 2026-11-16
estado-em: 2026-11-16
status: vigente
dono: Gustavo (DBA)
fontes: ["Dump avhub teste 16.11 (esqueleto).sql, gerado em 16/11/2026 11:23 e enviado pelo Nathan em 16/11/2026", "Dump avhub teste 16.11 (esqueleto) (1).sql, gerado em 16/11/2026 13:58 e enviado pelo Nathan em 16/11/2026 (substitui o das 11:23)", "Dump-AvHub-Teste-2026-11-13 (comparação)", "api-acos-vital 8265223 e 96316f4 (origin/develop, só para conferir se o código acompanha)"]
---

# Dump do banco de teste do av-hub (16/11/2026)

**Em uma frase:** é o retrato mais novo do esquema do banco do av-hub, tirado do ambiente de **teste** em 16/11/2026. Ele traz para o banco o "Da proposta à comissão" (pedido do Robert de 13/11: simulação que nasce rascunho, pedido da proposta liberado sozinho, item do Omie ligado ao item da proposta, evento do PDF) e os campos "Desvios" e "Pintura/acabamento" do item da proposta.

**Quando consultar:** quando uma nota citar o banco do av-hub e você precisar saber se o que ela diz ainda vale. A nota geral do banco é o [[Banco-AvHub]]. O dump anterior é o [[Dump-AvHub-Teste-2026-11-13]].

## Ficha do arquivo

- **Arquivo:** `04-Dados/Dumps/avhub-tst-esqueleto-2026-11-16.sql`, cópia sem mudança do arquivo enviado pelo Nathan em 16/11/2026 (`Dump avhub teste 16.11 (esqueleto).sql`).
- **Ambiente:** teste (`tst`). Gerado em 16/11/2026 às **13:58** (a 2ª versão do dia, que substituiu a das 11:23; a única diferença é a coluna da lista de propostas, abaixo), PostgreSQL 18.6 (pg_dump 18.3), dump do cluster (papéis e esquema).
- **Só esquema:** nenhum `COPY` de dados, e os papéis não trazem senha. O único `INSERT` do arquivo é texto de um comentário. Não há dado de cliente, de pedido nem de usuário, e por isso os cadastros de tela e de rota (`auth.telas`, `auth.rotas_telas`) não aparecem aqui.
- **Lugar na precedência:** fonte 2 (dumps), depois do código na `develop` (F5). Ele mostra o que está **aplicado no banco de teste** e é a referência do esquema: as migrations ficam com o DBA, fora do repositório (N16-155).

## O que mudou desde o dump de 13/11

| | 13/11 (teste) | 16/11 (teste) |
|---|---|---|
| Tabelas | 151 | 151 |
| Views | 55 | 55 |
| Funções | 284 | 291 |
| Triggers | 205 | 209 |
| Índices | 324 | 324 |

### Da proposta à comissão (pedido do Robert de 13/11; `api-acos-vital` `8265223`)

- **A simulação do vendedor nasce rascunho.** O `fn_proposta_transformar` (`:5146`) grava a v1 como `RASCUNHO`, sem data de envio (`:5256`). O trigger `trg_simulacoes_envio_exige_faturamento` (`:35069`), com a função `fn_simulacoes_envio_exige_faturamento` (`:5967`), só deixa a simulação de origem `VENDEDOR` ir a `ENVIADO` quando o pedido tem nota fiscal válida (`fn_pedido_faturado`, `:12494`); sem nota, erro `PEDIDO_SEM_FATURAMENTO` (409 na API). A origem `COMPRAS` não muda.
- **O pedido da proposta é liberado sozinho para o MES.** Quando a sincronização traz do Omie um pedido que nasceu de proposta, o trigger `trg_pedidos_vendas_liberacao_proposta` (`:35926`, e `_reativado` em `:35934`) chama `fn_pedido_venda_liberacao_automatica` (`:3637`): grava a liberação com a Qualidade e o faturamento em partes do modal, em nome de quem transformou, e o histórico ganha `origem = 'PROPOSTA'` (coluna nova em `pedidos_vendas_liberacao_historico`, `:26101`). Não sobrescreve liberação que já existe, e a Liberar Pedidos continua podendo trocar a resposta até o PCP importar. Isso muda a R7 do LOG-56 só para o pedido nascido de proposta.
- **O item do Omie fica ligado ao item da proposta.** `fn_pedido_venda_itens_omie_gravar` (`:3570`) grava o `codigo_item` do Omie no pedido do Hub e na simulação em rascunho; o trigger `trg_produto_vendas_item_hub` (`:36022`), com `fn_produto_vendas_item_hub` (`:13778`), faz o mesmo quando a sincronização traz a linha com `codigo_item_integracao` (SQL-021).
- **Evento do PDF.** `fn_proposta_pdf_gerado` (`:4856`) grava `PDF_GERADO` (comercial ou técnico) na linha do tempo da proposta, sem repetir o mesmo usuário, tipo e revisão em menos de 10 minutos.

### Dados técnicos do item da proposta

- `core_comercial.propostas_itens` ganhou `tec_desvios` e `tec_esquema_pintura` (`text`, até 500 caracteres; `:18993`), gravados por `fn_proposta_itens_gravar` e copiados por `fn_proposta_copiar`. É a migration `2026-11-16_comercial_proposta_item_desvios_pintura`, que faltava no Docker local no reteste R4 (BL-097).

### Não mudou

- O LOG-57, o LOG-58b e a view do SQL-022 estão iguais aos de 13/11.
- O encargo da condição de pagamento continua na proposta e na simulação.

## O que isso muda no vault

- [[Banco-AvHub]]: o aviso do dump mais novo passa a ser este.
- BL-097: os campos existem no tst; o problema era só do Docker local.
- [[15-Custo-Real-e-Comissao]], [[03-Pedido-de-Venda-e-Liberacao]] e LOG-56: o "Da proposta à comissão" sai de "banco pendente" e passa a estar no tst.
- O Docker local foi igualado a este esquema em 16/11 (funções, triggers e colunas das três áreas do comercial, vendas e comissão). Na tarde de 16/11 ele foi conferido objeto a objeto contra este arquivo (colunas, views, triggers, constraints, índices e corpo das funções): a única diferença era o índice `uq_ordens_compra_id_aviso_mes` (`:33998`), que aqui ignora a OC cancelada ou excluída; recriado igual, a 2ª recompra do mesmo aviso passou a funcionar no reteste R6 ([[Backlog-Reteste-R5-R6-2026-11-16]]).

## Lista de propostas com o nº do Omie (versão das 13:58)

- A view `core_comercial.vw_propostas_lista` ganhou a coluna `numero_pedido_omie`: o número do pedido no Omie do pedido do Hub ligado à proposta, sem zeros à esquerda (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-16.sql:18535` (`AS numero_pedido_omie`)). É a migration `2026-11-16_comercial_proposta_lista_pedido_omie`, aplicada no tst em 16/11 (Gustavo), que a `api-acos-vital` `2e333e3` lê na lista e na busca (`src/schemas/core_comercial/aggregates/propostas/propostas.route.js:455` (`OR p.numero_pedido_omie ILIKE :termo`)). Na versão das 11:23 ela faltava, e a lista de propostas respondia 500 no Docker (BL-101, ✅ resolvido). Aplicada também no Docker em 16/11: a lista voltou a 200 e a busca pelo nº do Omie acha a proposta.
- O resto do arquivo é igual ao das 11:23; as linhas depois da view andaram 4.
