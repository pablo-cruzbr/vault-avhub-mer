---
id: SQL-021
aliases: ["Contrato SQL 021", "021-Produto-Vendas-Codigo-Item"]
tags: [contrato, contrato-sql, dba, pipeline, pedido-de-venda, rastreabilidade]
criado: 2026-11-04
atualizado: 2026-11-04
status: parcial
sistemas: [hub-banco, pipeline-omie]
dono: "Gustavo (DBA)"
etapa_0b: []
fontes: ["pedido do Robert ao Nathan de 03/11/2026 (item 5)", "omie-elt-pipeline: src/omie/resources/produtoVendas.ts, pedidosVendas.ts, src/db/colunasExistentes.ts (branch feat/produto-vendas-codigo-item-integracao)", "Dump do Avhub de 29/10/2026 (produto_vendas, pedidos_compras_itens)"]
criado_original: 2026-11-04
---

# Contrato SQL 021 — Item do pedido de venda: `produto_vendas.codigo_item_integracao`

> **Onde atua:** av-hub: banco · pipeline Omie

> [!abstract] Resumo em linguagem natural
> **O que é:** uma coluna nova em `produto_vendas` para guardar o identificador que o Hub manda ao Omie em cada item do pedido de venda criado pela proposta. Com ela, o item faturado se liga ao item da proposta que o gerou.
>
> **Quem é afetado:** o Gustavo (cria a coluna), o Robert (monta o payload do pedido) e quem rastreia a venda do pedido até a comissão.
>
> **Situação:** parcial. O código da pipeline está escrito e passa no typecheck; falta o Gustavo criar a coluna.
>
> **Exemplo:** o pedido sai com dois itens, com `codigo_item_integracao` "1" e "2". Depois que o Omie fatura, as duas linhas de `produto_vendas` carregam esses códigos, junto do `codigo_pedido_omie`.

> [!info] Situação em 04/11/2026
> **Status:** `parcial` · **Pasta:** `Ativos` · **Nós do 0b:** — · **Dono:** Gustavo (DBA)
> • ✅ Código na branch `feat/produto-vendas-codigo-item-integracao` do `omie-elt-pipeline`, **ainda sem PR**: `mapItemRow` lê `ide.codigo_item_integracao` (`src/omie/resources/produtoVendas.ts`); o `afterUpsert` do pedido de venda filtra as colunas pelo que a tabela tem de fato (`src/omie/resources/pedidosVendas.ts`, helper em `src/db/colunasExistentes.ts`). O typecheck passa. **Não foi testado contra banco nem Omie.**
> • ✅ O dump de 29/10 confirma o ponto de partida: `produto_vendas` **não** tem a coluna, e `pedidos_compras_itens.codigo_item_integracao` existe como `varchar(20)`.
> • 🔴 **Gustavo:** criar a coluna (seção SQL).
> • 🔴 **Robert:** mandar `ide.codigo_item_integracao` em cada item do `IncluirPedido`.
> • 🔴 **Nathan e Robert:** depois da coluna, conferir num pedido de teste (item 4 do pedido de 03/11).
> Selos em [[Regras-do-Vault]].

## Por quê

O pedido do Robert de 03/11/2026 (item 5) apontou que nem `cabecalho.codigo_pedido_integracao` nem `ide.codigo_item_integracao` eram mapeados pela pipeline. Os dois são espaço livre: podem levar identificadores nossos sem efeito no Hub nem no simulador.

Sem o item, a ligação pedido → item faturado não volta sozinha. O `codigo_item_omie` é gerado pelo Omie, não vem na resposta do `IncluirPedido` e só aparece no sync seguinte. Com o `codigo_item_integracao` gravado, dá para ir da proposta ao pedido, ao item faturado e à comissão.

A mudança é **aditiva**: `NULL` para todo o histórico e para pedido digitado direto no Omie, sem efeito em quem já existe. A decisão de o Omie calcular os impostos do pedido (e do Hub não os mandar) está em [[Registro-de-Decisoes]] (N16-95).

## SQL

Idempotente. A única mudança é acrescentar uma coluna nulável, sem default. Nenhuma tabela ou índice existente é alterado.

```sql
BEGIN;

ALTER TABLE core_vendas_faturamento.produto_vendas
  ADD COLUMN IF NOT EXISTS codigo_item_integracao character varying(20);

COMMENT ON COLUMN core_vendas_faturamento.produto_vendas.codigo_item_integracao IS
  'ide.codigo_item_integracao do Omie (string20): identificador do item que o Hub
   envia no IncluirPedido. Liga o item faturado ao item da proposta. NULL no
   historico e em pedido digitado direto no Omie. Nao e chave: pode repetir entre
   pedidos, entao use sempre junto de codigo_pedido_omie.';

COMMIT;
```

**Rollback:**

```sql
ALTER TABLE core_vendas_faturamento.produto_vendas
  DROP COLUMN IF EXISTS codigo_item_integracao;
```

## Como a pipeline usa a coluna

- `mapItemRow` devolve `codigo_item_integracao` com o valor de `det[].ide.codigo_item_integracao` (vazio vira `NULL`).
- **A pipeline tolera a coluna ausente.** Antes de gravar os itens, o pedido de venda lê as colunas reais da tabela (cache de 1 hora) e descarta as que não existem, avisando uma vez no log. Sem isso, gravar uma coluna inexistente derrubaria a transação do pedido inteiro.
- Por causa desse cache, depois que o Gustavo criar a coluna o valor passa a ser gravado sozinho em **até 1 hora**, sem reiniciar nem fazer deploy.
- O helper (`colunasExistentes.ts`) é o mesmo que o `pedidosCompras.ts` já usava, só movido para um lugar comum.

## Critérios de aceite

1. Depois do SQL, a coluna existe como `varchar(20)`, nulável e sem default, e todas as linhas atuais ficam `NULL`.
2. Em até 1 hora, o sync de um pedido **criado pela API** grava em `produto_vendas.codigo_item_integracao` o valor enviado; o de um pedido **digitado no Omie** deixa `NULL`.
3. Antes do SQL, o sync de pedidos de venda continua sem erro e o log avisa uma vez "Coluna ainda não existe no banco" para esta coluna.
4. Ressincronizar o mesmo pedido não cria linhas novas: a chave continua `codigo_empresa` + `codigo_item_omie`.

## Perguntas ao DBA

1. Alguma view ou função lê `produto_vendas` com `SELECT *` e mudaria de formato com a coluna nova? Só vi colunas explícitas no dump, mas não varri tudo.
2. **Índice:** o valor pode repetir entre pedidos (o exemplo do Robert usa a sequência do item, "1", "2"), então ele só serve junto do pedido. Se aparecer consulta lenta, o índice parcial seria `(codigo_empresa, codigo_pedido_omie, codigo_item_integracao) WHERE codigo_item_integracao IS NOT NULL`. Não incluí agora, para não criar um índice sem consulta que o use. Concorda?

## Fora deste contrato

- **`pedidos_vendas.codigo_pedido_integracao`** (o "PV-000001"): a pipeline também não o mapeia. 🟡 Falta decidir se ganha coluna. Só conferi que o código não o referencia; **não conferi se a coluna existe** em `pedidos_vendas`.
- Categoria, conta corrente e etapa do pedido, listas filtradas pela unidade e a validação no servidor: são da API e da proposta (Robert e Gustavo). Sem contrato próprio até o desenvolvimento começar.
- A coluna `encargos` em `condicoes_pagamento_compras`: é do simulador, definição do Gustavo. A pipeline já não a sobrescreve (está em `PROTECTED_COLUMNS`).

## Riscos

- O valor **repete entre pedidos**. Não é chave: nunca consultar só por ele, sempre com `codigo_pedido_omie`.
- O Omie limita o campo a 20 caracteres. Se a API mandar mais, ele corta e o valor guardado fica diferente do enviado.
- A pipeline só lê o que o Omie devolve. Se o Hub mandar o identificador errado, a coluna guarda o errado.
