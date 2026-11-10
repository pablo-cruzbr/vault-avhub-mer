---
tags: [dados, banco, dump, av-hub, teste]
criado: 2026-11-10
estado-em: 2026-11-10
status: vigente
dono: Gustavo (DBA)
fontes: ["Dump do Avhub para referência tst (esqueleto) (2).sql, gerado em 10/11/2026 07:36 e enviado pelo Nathan em 10/11/2026", "Dump-AvHub-Teste-2026-11-09 (comparação)"]
---

# Dump do banco de teste do av-hub (10/11/2026)

**Em uma frase:** é o retrato mais novo do esquema do banco do av-hub, tirado do ambiente de **teste** em 10/11/2026. Ele mostra aplicada no teste a primeira parte do LOG-56: a resposta da Qualidade, o faturamento em partes, a conta corrente do pedido e a prontidão da proposta para o Omie.

**Quando consultar:** quando uma nota citar o banco do av-hub e você precisar saber se o que ela diz ainda vale. A nota geral do banco é o [[Banco-AvHub]]. O dump anterior é o [[Dump-AvHub-Teste-2026-11-09]].

## Ficha do arquivo

- **Arquivo:** `04-Dados/Dumps/avhub-tst-esqueleto-2026-11-10.sql`, cópia sem mudança do arquivo enviado pelo Nathan em 10/11/2026 (`Dump do Avhub para referência tst (esqueleto) (2).sql`). Veio com fim de linha CRLF, como o anterior.
- **Ambiente:** teste (`tst`). Gerado em 10/11/2026 às 07:36, PostgreSQL 18.6, dump do cluster (papéis e esquema).
- **Só esquema:** nenhum `COPY` nem `INSERT` de dados, e os papéis não trazem senha. Não há dado de cliente, de pedido nem de usuário.
- **Lugar na precedência:** fonte 2 (dumps), depois do código na `develop` (F5). Ele mostra o que está **aplicado no banco de teste**, não o que está versionado (BL-024).

## O que mudou desde o dump de 09/11

| | 09/11 (teste) | 10/11 (teste) |
|---|---|---|
| Schemas | 15 | 15 |
| Tabelas | 146 | 148 |
| Views | 51 | 51 |
| Funções | 250 | 259 |
| Triggers | 192 | 195 |
| `core_comercial`: tabelas e funções | 12 e 39 | 14 e 48 |

**Entrou (LOG-56):**
- **Conta corrente do pedido (R11, §7.4 e §8.2):** a tabela `core_comercial.parametros_pedido_venda_omie` (`:16598`, a conta padrão por unidade, com o trigger `trg_parametros_pedido_venda_omie_regras`), a função `fn_conta_corrente_padrao` (`:2344`), a coluna `pedidos_venda.codigo_conta_corrente`, e a troca da conta com trava: `fn_pedido_venda_conta_corrente_iniciar` (`:2727`), `_checar` (`:2633`), `_gravar` (`:2689`) e `_soltar` (`:2762`), além da coluna `conta_corrente_troca_em`. A troca fica registrada em `pedidos_venda_conta_corrente_historico` (`:16868`), e o trigger `fn_pedidos_venda_conta_corrente_valida` (`:3176`) confere a conta.
- **Respostas do modal (R1):** `pedidos_venda.qualidade_acompanha` e `pedidos_venda.faturar_em_partes` (`:16691`), e `pedidos_vendas_liberacao.faturar_em_partes`.
- **Valor sugerido na Liberar Pedidos:** a `vw_pedidos_liberacao` ganhou `qualidade_acompanha_sugerida` e `faturar_em_partes_sugerido` (`:26683`).
- **Prontidão da proposta para o Omie:** `fn_proposta_prontidao_omie` (`:3988`).
- **Mudaram por dentro:** `fn_proposta_transformar` (`:4229`), `fn_pedido_venda_envio_iniciar`, `fn_pedido_venda_payload_omie`, `fn_pedido_venda_pendencias` e `fn_pedidos_vendas_liberacao_regras`.

**Não mudou:**
- O índice `ix_pedidos_venda_omie` continua **parcial e não único** (`:30191`). O índice único do LOG-56 ainda não foi aplicado.
- O `obs_venda` continua indo ao Omie com as observações da proposta (`:2993`, `jsonb_build_object('obs_venda', btrim(pv.observacoes))`).
- A regra do refaturamento não mudou. `fn_resolver_refaturamento` (`:13259`), `fn_resolver_refaturamento_lote` (`:13513`), `vw_faturamento_planilha` e `vw_vendas_planilha` estão iguais às de 09/11. O código de refaturamento continua fixo em `1.01.96`, sem olhar a unidade (RS-022).
- O banco de teste não tem a extensão `pg_cron`, e nenhum repositório chama `fn_resolver_refaturamento` nem `_lote`. Quem preenche `refaturamentos` no teste, e quando, ❓ não está no esquema.

## O que isso muda no vault

- [[Banco-AvHub]]: o aviso do dump mais novo passa a ser este.
- LOG-56: parte do banco do passo 3 da §14 está aplicada no teste. Falta o índice único e versionar as migrations (BL-024).
