---
tags: [comissao, banco, core_comissionamento, tabelas, dba]
criado: 2026-10-16
estado-em: 2026-11-23
status: proposta
dono: Gustavo (DBA)
develop-conferida: [api-acos-vital ce4f90f, av-hub 7f0f7e2, em 2026-11-23, colunas, filtros e migrations da comissão de 18 a 23/11; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [dump core_comissionamento convertido (09-Diagramas/fontes), api-acos-vital f322dcd src/schemas/core_comissionamento, N16-11, api-acos-vital 7c05f92, 0244b1a, e363da5, 0e56354, 06bb146 (models e rotas de core_comissionamento), N16-185 a N16-190, PS-062, PS-063]
---

# Tabelas, views e funções atuais do `core_comissionamento`

**Em uma frase:** o banco atual da comissão (`core_comissionamento`) tinha, no dump, 9 tabelas, 4 views e 5 funções; de 18 a 23/11 ganhou colunas, uma view, uma tabela, uma função e um trigger por seis migrations que não estão no repositório, e esta nota lista o que há nele e o que o módulo novo corrige.

**Quando consultar esta nota:** quando o time de TI ou o DBA (Gustavo) precisar saber o que existe hoje, o que está frágil e para onde cada tabela vai no módulo novo. O schema atual **não é alterado** (N16-11). Quem não é técnico lê só este resumo.

## O que existe hoje, em palavras simples

| Tabela | O que guarda | Linhas |
|---|---|---|
| `simulador_parametros` | Percentuais do motor por unidade e vigência ("Maio/23"), com o corte da predominância desde 19/11 | 3 |
| `simulacoes` | Cada versão da simulação de um pedido (vendedor ou Compras) | 14 |
| `simulacao_itens` | Os itens de cada simulação; desde 18/11 cada item leva a letra do pedido (a margem do item só informa) | 21 |
| `regras_comissoes_fixas` | Teto de comissão por cliente | 5 (1 apagada) |
| `bloqueio_comissoes` | Bloqueio de comissão por nota fiscal (NF) | 2 |
| `blacklist_comissoes_destinatario` | Clientes fora do cálculo | 1 |
| `blacklist_comissoes_vendedores` | Vendedores fora do cálculo | 8 |
| `comissao_coordenadores` | Ajuda de custo e percentual dos coordenadores | 6 |
| `comissao_coordenadores_historico` | Histórico imutável das mudanças dos coordenadores | 6 |

As 4 views juntam tudo para mostrar a comissão por item, por NF e por mês. As 5 funções montam o dashboard e gravam o histórico dos coordenadores. Os objetos novos de 18 a 23/11 (competência, grão por pedido, peso da fabricação, trava do vendedor e versão pré-aceita) estão em "O que entrou de 18 a 23/11", no detalhe técnico; o banco deles é ❓ (PS-062).

## Exemplo

Um bloqueio por NF é gravado com o número digitado com zeros, como `00051698`. Se alguém digitar sem os zeros, o bloqueio nunca casa com a nota e nada avisa. O módulo novo usa o código da NF no Omie (`codigo_nf_omie`), que não depende de zeros.

## O que está frágil e o que o módulo novo faz

1. **Regra de negócio dentro de JSON** (parâmetros). O módulo novo usa tabelas com tipo.
2. **Texto livre como chave** (origem da compra, destino, nome do coordenador, número da NF). Passa a usar códigos e ids.
3. **Sem vigência** em regra fixa e listas de bloqueio. Mudar a regra reescreve o passado. Passam a ter vigência.
4. **Sem autoria e sem histórico** em regra fixa, listas e bloqueio. Passam a ter autor e auditoria.
5. **Motivo opcional** no bloqueio e nas listas. Passa a ser obrigatório.
6. **Quantidade em ponto flutuante** (`double`). Passa a `numeric(15,4)`.
7. **Cálculo não gravado.** Contas intermediárias, fonte do custo e versão do motor somem. Tudo passa a ser gravado.
8. **Leitura recalcula tudo.** Mês fechado pode mudar. A NF decidida passa a ser uma foto.
9. **Motor no navegador.** O banco só escolhe a versão que paga (pré-aceita). O motor vai para o servidor.
10. **Visibilidade decidida na tela (BFF).** Passa a ser decidida no banco e na API.
11. **Exclusão física** do bloqueio apaga a auditoria. Reverter vira uma nova decisão.

Bom exemplo a copiar: o histórico dos coordenadores é imutável e gravado por gatilho. O módulo novo generaliza isso numa tabela `auditoria`.

Para o motor e as regras, veja [[01-Motor-Atual-Como-Calcula]]. Para o desenho novo, [[03-Modelo-Novo-core_comissao]].

## Detalhe técnico

Inventário do que existe hoje, com o que está bom e o que deve ser **melhorado no módulo novo** ([[03-Modelo-Novo-core_comissao]]). O schema atual **não é alterado** (N16-11). Citações: `dump` = `09-Diagramas/fontes/core_comissionamento-dump-convertido.sql`; "API" = `api-acos-vital\src\schemas\core_comissionamento`. Selos em [[Regras-do-Vault]].

**Contagem conferida no dump:** 9 tabelas, 4 views, **5 funções** (o briefing diz 6; ver [[01-Motor-Atual-Como-Calcula]], ponto 11). Linhas hoje: `blacklist_comissoes_destinatario` 1, `blacklist_comissoes_vendedores` 8, `bloqueio_comissoes` 2, `comissao_coordenadores` 6, `comissao_coordenadores_historico` 6, `regras_comissoes_fixas` 5 (1 apagada), `simulacoes` 14, `simulacao_itens` 21, `simulador_parametros` 3 (`dump:1549-1662`).

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[02-Tabelas-Atuais-core_comissionamento-Detalhe-Tecnico-1]]: O que entrou de 18 a 23/11 (banco ❓, PS-062) · Mapa do schema · Tabelas
- [[02-Tabelas-Atuais-core_comissionamento-Detalhe-Tecnico-2]]: Views · Funções · Rotas da API que existem hoje · Resumo dos problemas de estrutura
