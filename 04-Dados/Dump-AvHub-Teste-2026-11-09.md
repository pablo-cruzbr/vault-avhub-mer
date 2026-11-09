---
tags: [dados, banco, dump, av-hub, teste]
criado: 2026-11-09
estado-em: 2026-11-09
status: vigente
dono: Gustavo (DBA)
fontes: ["Dump do Avhub para referência tst (esqueleto).sql, gerado em 09/11/2026 15:51 e enviado pelo Nathan em 09/11/2026", "Dump-AvHub-Teste-2026-11-04 (comparação)", "Q&A do Nathan para o Gustavo sobre o LOG-56, 09/11/2026 (P3, P4 e P6)"]
---

# Dump do banco de teste do av-hub (09/11/2026)

**Em uma frase:** é o retrato mais novo do esquema do banco do av-hub, tirado do ambiente de **teste** em 09/11/2026, e mostra aplicadas no teste as três migrations do pedido do Hub de 05/11 e 06/11, que continuam fora do repositório, e a permissão de exportar do LOG-48.

**Quando consultar:** quando uma nota citar o banco do av-hub e você precisar saber se o que ela diz ainda vale; a nota geral do banco é o [[Banco-AvHub]]. O dump anterior é o [[Dump-AvHub-Teste-2026-11-04]].

## Ficha do arquivo

- **Arquivo:** `04-Dados/Dumps/avhub-tst-esqueleto-2026-11-09.sql`, cópia sem mudança do arquivo enviado pelo Nathan em 09/11/2026 (`Dump do Avhub para referência tst (esqueleto).sql`). O arquivo veio com fim de linha CRLF; o `.gitattributes` guarda os dumps sem normalizar. O número das linhas não muda com isso.
- **Ambiente:** teste (`tst`). Gerado em 09/11/2026 às 15:51, PostgreSQL 18.6, dump do cluster (papéis e esquema).
- **Só esquema:** nenhum `COPY` nem `INSERT` de dados, e os papéis não trazem senha. Não há dado de cliente, de pedido nem de usuário.
- **Lugar na precedência:** fonte 2 (dumps), depois do código na `develop` (F5). Ele mostra o que está **aplicado no banco de teste**. Segundo o Gustavo (09/11), as migrations de 05/11 e 06/11 estão só na pasta local dele e ainda não foram aplicadas em produção (BL-024).

## O que mudou desde o dump de 04/11

| | 04/11 (teste) | 09/11 (teste) |
|---|---|---|
| Schemas | 15 | 15 |
| Tabelas | 146 | 146 |
| Views | 51 | 51 |
| Funções | 238 | 250 |
| Triggers | 191 | 192 |
| `core_comercial`: tabelas, views e funções | 12, 2 e 28 | 12, 2 e 39 |

**Entraram (migrations `2026-11-05_comercial_limpeza_core_comercial.sql`, `2026-11-05_comercial_pedido_venda_omie.sql` e `2026-11-06_comercial_pedido_venda_dados_nf.sql`, segundo o Gustavo):**
- **Envio do pedido ao Omie:** `fn_pedido_venda_envio_iniciar` (`:2587`), `fn_pedido_venda_omie_registrar` (`:2699`), `fn_pedido_venda_omie_erro` (`:2660`), `fn_pedido_venda_payload_omie` (`:2755`), `fn_pedido_venda_pendencias` e `fn_pedido_venda_vendedor`. Vieram com as de apoio `fn_comercial_codigos_omie_conferir`, `fn_comercial_codigos_omie_problemas`, `fn_proposta_codigos_omie_gravar`, `fn_frete_modalidade_omie` e `fn_data_do_corpo`.
- **`fn_proposta_transformar` com 4 argumentos** (`p_dados jsonb`, `:3876`), no lugar da de 3. É a que a `api-acos-vital` chama.
- **`core_comercial.pedidos_venda`** (`:16234`) ganhou `data_previsao`, `bloqueado`, `etapa` (só `10`), `codigo_parcela`, `codigo_categoria`, `numero_contrato` (`SPOT` ou `CONTRATO`), `frete_modalidade`, `dados_adicionais_nf` (até 5.000 caracteres), `envio_omie_iniciado_em`, `tentativas_envio_omie`, `payload_omie` e `id_simulacao` (chave para `core_comissionamento.simulacoes`, com índice).
- **`core_comercial.propostas`** ganhou `codigo_condicao_pagamento`.
- **Permissão de exportar (LOG-48, N16-147):** `auth.permissoes.pode_exportar` (`:14456`), aceita em `auth.rotas_telas.acao` e devolvida pela `auth.vw_permissoes_usuario`.
- **Setor na requisição de uso interno:** `core_vendas_faturamento.requisicoes_compra.id_setor` (só com finalidade `uso_interno`, chave para `core.setores`), com o trigger `trg_requisicoes_compra_setor`, a função `fn_requisicao_compra_setor_validar` e o setor na `vw_ordens_compra_referencia_mes`.

**O `obs_venda` vai ao Omie com as observações da proposta** ✅: a `fn_pedido_venda_payload_omie` manda `observacoes.obs_venda = btrim(pv.observacoes)` (`:2790`, `jsonb_build_object('obs_venda', btrim(pv.observacoes))`), e a `fn_proposta_transformar` copia `observacoes` da proposta para o pedido. É o risco da §7.7 do contrato LOG-56: "refat" nas observações tira o pedido da Liberar Pedidos.

**Não mudou:**
- Nada do LOG-56 ainda: `pedidos_venda` não tem `qualidade_acompanha`, `faturar_em_partes` nem `codigo_conta_corrente`, e o índice `ix_pedidos_venda_omie` continua parcial.
- A numeração da proposta continua `CO-<código><ano>-<seq>-R00`.
- Continuam ausentes `divergencias_compra`, o schema `core_comissao` e a coluna `produto_vendas.codigo_item_integracao`.

## O que isso muda no vault

- [[Banco-AvHub]] e [[Diferencas-Codigo-x-Banco]]: o "Transformar em pedido" e o envio ao Omie existem no banco de teste.
- [[Onde-Estamos]] e [[01-Proposta-de-Venda]]: deixa de faltar a função de 4 argumentos no banco de teste. Continua faltando versionar as migrations (BL-024) e aplicá-las em produção.
- [[Dump-AvHub-Teste-2026-11-04]]: o "Atenção" sobre o que faltava no dump fica resolvido neste.
