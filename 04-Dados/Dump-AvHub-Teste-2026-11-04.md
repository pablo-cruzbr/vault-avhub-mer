---
tags: [dados, banco, dump, av-hub, teste]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Gustavo (DBA)
fontes: ["Dump do Avhub para referência tst (esqueleto).sql, enviado pelo Nathan em 05/11/2026", "Dump do Avhub para referência (29.10).sql (api-acos-vital, develop b97981c)"]
---

# Dump do banco de teste do av-hub (04/11/2026)

**Em uma frase:** é o retrato mais novo do esquema do banco do av-hub, tirado do ambiente de **teste** em 04/11/2026, e mostra o que mudou desde o dump de 29/10: o módulo da proposta ganhou as funções e as tabelas do pedido do Hub, e as tabelas do módulo de teste do Pablo saíram.

**Atenção (05/11/2026):** a `api-acos-vital` `develop` 1654f65 chama no banco o que **não está neste dump**, conferido por busca no arquivo: as funções `fn_pedido_venda_envio_iniciar`, `fn_pedido_venda_omie_registrar` e `fn_pedido_venda_omie_erro`; `fn_proposta_transformar` de 4 argumentos (o dump só tem a de 3); e, em `core_comercial.pedidos_venda`, as colunas `data_previsao`, `numero_contrato`, `bloqueado` e `tentativas_envio_omie`, além de `codigo_parcela`. O código as atribui à migration `2026-11-05_comercial_pedido_venda_omie.sql`, que não está no repositório. Já estão no dump a coluna `encargos` de `condicoes_pagamento_compras` e `fn_proposta_itens_produtos_conferir`. O arquivo do dump de 29/10 também saiu da `develop` nesse commit.

**Quando consultar:** quando uma nota citar o banco do av-hub e você precisar saber se o que ela diz ainda vale; a nota geral do banco é o [[Banco-AvHub]].

## Ficha do arquivo

- **Arquivo:** `04-Dados/Dumps/avhub-tst-esqueleto-2026-11-04.sql`, cópia sem mudança do arquivo enviado pelo Nathan em 05/11/2026 (`Dump do Avhub para referência tst (esqueleto).sql`). **Está no git** desde 05/11/2026, quando o repositório `vault-avhub-mer` passou a ser privado (decisão do Nathan): quem tem acesso ao repositório recebe o arquivo pelo `git pull`. É só o esquema (tabelas, funções e papéis), sem nenhuma linha de dados e sem senhas. Antes, a pasta `04-Dados/Dumps/` ficava no `.gitignore` e só no computador do Nathan. **Se o repositório voltar a ser público, a pasta tem de sair do git antes.**
- **Ambiente:** teste (`tst`). Gerado em 04/11/2026 às 23:58, PostgreSQL 18.6, `pg_dump` 18.3, dump do cluster (papéis e esquema).
- **Só esquema:** nenhum `COPY` nem `INSERT`, e os papéis não trazem senha. Não há dado de cliente, de pedido nem de usuário.
- **Lugar na precedência:** fonte 2 (dumps), depois do código na `develop` (F5). Ele mostra o que está **aplicado no banco de teste**; a migration que criou um objeto pode não estar no repositório.

## O que mudou desde o dump de 29/10

| | 29/10 | 04/11 (teste) |
|---|---|---|
| Schemas | 14 | 15 (entrou `orcamento_pdf`) |
| Tabelas | 156 | 146 |
| Views | 52 | 51 |
| Funções | 222 | 238 |
| Triggers | 199 | 191 |
| `core_comercial`: tabelas, views e funções | 23, 3 e 12 | 12, 2 e 28 |

**Entraram:**
- **Funções da proposta:** `fn_proposta_aprovar`, `fn_proposta_cancelar`, `fn_proposta_revisar`, `fn_proposta_copiar`, `fn_proposta_transformar` e `fn_propostas_expirar`. Vieram com as de apoio: `fn_proposta_trava`, `fn_proposta_snapshot`, `fn_proposta_itens_gravar`, `fn_proposta_itens_produtos_conferir`, `fn_proposta_totais_atualizar`, `fn_proposta_analise_gravar`, `fn_proposta_cliente_resolver`, `fn_proposta_exigir_validade`, `fn_proposta_validade_ate`, `fn_proposta_validade_do_corpo` e `fn_hoje`.
- **Pedido do Hub:** tabelas `core_comercial.pedidos_venda` e `pedidos_venda_itens`, com status `ABERTO` ou `CANCELADO` e `status_sincronizacao_omie` com padrão `pendente`. O `fn_proposta_transformar` grava nelas e numa simulação de comissão (`core_comissionamento.simulacoes` e `simulacao_itens`). Ele **não grava liberação**.
- **Status da proposta:** o `ck_propostas_status` passou a aceitar `EXPIRADA`.
- **Relatório do orçamento:** o schema `orcamento_pdf`, com a tabela `relatorio`.

**Saíram:** as 13 tabelas do módulo de teste do Pablo no `core_comercial`: `ofertas`, `solicitacoes_custo`, `clientes`, `clientes_contatos`, `fornecedores_perfil`, `fornecedores_categorias`, `categorias_suprimento`, `apelidos_fornecedor`, `certificados`, `notificacoes`, `produtos_pendentes`, `produtos_perfil` e `tabelas_custo_telha`. Com elas saíram a view `vw_fornecedores_por_cnpj` e a função `fn_ofertas_imutavel`.

**Não mudou:**
- A numeração da proposta continua `CO-<código><ano>-<seq>-R00` (`fn_proposta_criar`), e não só dígitos como pede a N16-148 (PS-038).
- O contador de documentos (`ck_contadores_documento_tipo`) aceita só `ordem_compra` e `requisicao_compra`.
- Continuam ausentes `divergencias_compra`, o schema `core_comissao` e a coluna `produto_vendas.codigo_item_integracao`.
- Ninguém grava em `core_fluxo.evento`.
- Os outros schemas (`core_vendas_faturamento`, `core_compras`, `auth` etc.) têm a mesma contagem de tabelas e views.

## O que isso muda no vault

- [[01-Proposta-de-Venda]]: as funções de transição existem no banco de teste; a migration delas segue ❓ fora do repositório.
- [[Onde-Estamos]]: o "Transformar em pedido" existe no banco de teste e grava o pedido do Hub, sem liberação.
- [[Backlog-Frente-Gustavo]] (BL-068, BL-069) e [[Backlog-Frente-Comercial-e-Suprimentos]] (BL-071): anotado o que o dump confirma e o que continua faltando.
- [[Banco-AvHub]], [[Schemas-Postgres]], [[Diferencas-Codigo-x-Banco]], [[Estados-e-Status]], [[Estados]], [[Componentes-e-Implantacao]], [[02-Orcamento-Base-de-Preco]], [[15-Custo-Real-e-Comissao]] e [[Ultima-Atualizacao-do-Vault]]: o fato de 29/10 continua, e o de 04/11 entra ao lado.
- A divergência de schema com a N16-116 (proposta em `core_comercial` e não em `core_vendas_faturamento`) fica mais forte: o pedido do Hub também nasceu em `core_comercial`.
