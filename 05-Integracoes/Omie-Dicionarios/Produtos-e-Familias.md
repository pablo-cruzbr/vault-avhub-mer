---
tags: [omie, dicionario, pipeline, produtos, familias]
criado: 2026-10-14
estado-em: 2026-11-13
status: vigente
dono: Gustavo (DBA)
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [v1 08-Integracao-Omie/01-Dados-Extraidos/Produtos-e-Familias, omie-elt-pipeline 0f739f0, Registro-de-Decisoes #20]
---

# Dicionário Omie: Produtos e famílias

**Em uma frase:** tabelas de produtos e de famílias (grupos de produtos) copiadas do Omie, com a origem de cada coluna.

**Quando consultar esta nota:** ao procurar de onde vem um dado do produto (código, unidade, NCM, peso) ou ao tratar produto duplicado ou sem família.

## `core.produtos`

Fonte: `ListarProdutos` (`/geral/produtos/`), resource `produtos.ts`. Chave de conflito (identifica a linha e evita duplicar): `(codigo_empresa, codigo_produto_omie)`, com alternativa antiga em `(codigo_empresa, codigo_produto)`.

| Coluna | Campo ou origem Omie |
|---|---|
| `codigo_produto` | `prod.codigo`, entidades HTML decodificadas, até 40 caracteres (`OMIE_<codigo_produto>` se vier vazio) |
| `codigo_produto_omie` | `prod.codigo_produto` |
| `descricao` | `prod.descricao`, decodificada |
| `familias_produtos` | `prod.codigo_familia` se válido (não vazio, não "0"); senão a família padrão da filial; se nem isso existir, a linha é pulada |
| `unidade_medida` | `prod.unidade` (padrão `'PÇ'`) |
| `ncm` | `prod.ncm` sem pontos (NCM é a classificação fiscal) |
| `especificacoes` (jsonb) | `altura`, `largura`, `profundidade`, `peso_bruto`, `peso_liq`, `marca`, `modelo` (default 0 ou vazio) |
| `ativo` | `prod.inativo === 'N'` |
| `codigo_empresa` | filial |
| `id`, `id_origem`, `created_at/by`, `updated_at/by`, `deleted_at/by` | controle do banco (identificador, autoria e datas de criação, alteração e exclusão) |

`peso_bruto` e `peso_liq` já vêm do Omie. Não existem em lugar nenhum: tolerância de peso (decidida em 5% para todas, no MES: `Material.toleranciaPeso` `@default(0.05)`, 📝 DEC-6 e #26), estoque máximo e ponto de pedido. O estoque mínimo existe na API do Omie (por produto e local), mas o saldo do Omie é ignorado 📝 (#28).

## Ressalva multi-filial

A família padrão por filial vem de `FAMILIA_PADRAO_POR_FILIAL` (`produtos.ts`), com entrada fixa só para `mogi` e `uberaba`. Produto sem família de uma filial nova (HRM) é pulado. Decidido (📝 #20): é tarefa de código, e o `ARCHITECTURE.md` do pipeline, que diz que nova filial não muda código, deve ser corrigido ([[Pontas-Soltas]] PS-016). Desde 11/11 o dono da pipeline é o Nathan (P9 do Q&A Nathan-Gustavo de 11/11), e a família padrão da HRM foi decidida em 13/11 (P17): a mesma `10081333170` sem nome de Mogi e Uberaba. A seed está na `develop` do pipeline, `omie-elt-pipeline` `46b53d4`, `sql/dba_migrations/013_seed_familia_produtos_hrm.sql` (ainda não está na `master`), ⏳ pendente: o DBA aplica no teste e na produção **antes** de `hrm` entrar no `FAMILIA_PADRAO_POR_FILIAL`, na mesma ordem da 004 de Uberaba (código antes da linha no banco quebra a FK `fk_produtos_familia_produtos`). Hoje o mapa ainda tem só `mogi` e `uberaba` 🔴 `omie-elt-pipeline` `src/omie/resources/produtos.ts:22` (`FAMILIA_PADRAO_POR_FILIAL`).

## `core.familia_produtos`

Fonte: `PesquisarFamilias` (`/geral/familias/`), resource `familiaProdutos.ts`. Chave: `(codigo_empresa, codigo_fprodutos)`.

| Coluna | Campo ou origem Omie |
|---|---|
| `codigo_fprodutos` | `familia.codigo` |
| `nome` | `familia.nomeFamilia` |
| `ativo` | `familia.inativo === 'N'` |
| `codigo_empresa` | filial |

## Alias e dedup de catálogo

`material_alias_omie` não é extraído pelo pipeline: é tabela do lado do Estoque (`materialCanonicoId` + `codigoOmie`), pré-requisito de limpeza do cadastro (produtos duplicados no Omie apontam para um material canônico). O pipeline traz o catálogo bruto, duplicatas incluídas. O `Material` do MES nasce só na primeira entrada de estoque do produto ([[Modelo-Estoque-e-Custo-do-Lote]]).

Ver também: [[Omie-Integracao-Estado]], [[Notas-Fiscais-e-Itens]].
