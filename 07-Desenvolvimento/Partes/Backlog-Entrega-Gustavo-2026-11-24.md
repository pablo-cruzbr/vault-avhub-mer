---
tags: [desenvolvimento, backlog, pendencias, parte, comissao]
criado: 2026-11-24
estado-em: 2026-11-24
status: vigente
dono: Nathan
parte-de: "[[Backlog-por-Frente]]"
develop-conferida: [api-acos-vital ed6d147, em 2026-11-24]
fontes: [PDF de Gustavo de 24/11/2026 (comissões: aprovação, fechamento e contestação; SQL-024; telas para a produção; custo-item), N16-194 a N16-200]
---

# Backlog: o que a entrega do Gustavo de 24/11 deixou por fazer

**Em uma frase:** itens BL-111 a BL-115: o que falta para o fluxo de comissão que o Gustavo terminou na API (aprovação, fechamento, revogação, ajuste e contestação, N16-194 a N16-200) chegar a quem usa, e a cópia das telas do teste para a produção. Cada linha diz a frente.

**Onde estamos:** ← [[Backlog-por-Frente]] (resumo e índice) · teste anterior: [[Backlog-Teste-Acessos-2026-11-18]]

O backend está na `develop` (`api-acos-vital` `9e6ef60`, `0b7d92c` e `ed6d147`) e as migrations estão no tst e na produção ([[02-Tabelas-Atuais-core_comissionamento]]). O que segue é o que falta fora da API.

| ID | Nó | Frente | O que falta | Selo | Evidência |
|---|---|---|---|---|---|
| BL-111 | K4 | Robert | **As telas do fluxo novo da comissão.** A Visão Geral por pedido (com os contadores por pedido e o motivo do bloqueio de `ed6d147`), a aprovação em lote, a revogação, o ajuste de letra e a contestação nas telas do Hub. A API já responde: `api-acos-vital` `src/schemas/core_comissionamento/tables/aprovacoes_comissao/aprovacoes_comissao.route.js:33` (`router.post("/"`), `src/schemas/core_comissionamento/tables/contestacoes_vendedor/contestacoes_vendedor.route.js:52` (`router.post("/"`) | 🔴 | PDF de Gustavo de 24/11, "O que ficou de fora" |
| BL-112 | K4 | Nathan ou Robert | **Dar as ações nos perfis, pela tela Acessos.** Controladoria: `pode_aprovar` e `pode_editar` na Visão Geral. Compras: `pode_editar` na Análise de Simuladores. Vendedor: `pode_criar` em Minhas Comissões. Na produção de 17/11 nenhum perfil com a Visão Geral tinha `pode_aprovar`: ninguém aprova até isso ser dado. O Robert assumiu o `pode_aprovar`; falta dizer quem dá o resto (pergunta 3 do Gustavo) | 🔴 | PDF de Gustavo de 24/11, seção 3.6 |
| BL-113 | K4 | Robert, Gustavo | **Ajuda de custo duplicada, antes do marco.** O cadastro de vendedores soma R$ 43.000 (11 pessoas) e a provisória de novembro, R$ 155.000 (46 pessoas); a ajuda de quem é coordenador e vendedor ao mesmo tempo (o Antonio Paiva) entraria duas vezes | 🔴 | PDF de Gustavo de 24/11, seção 3.6 |
| BL-114 | K4 | Robert | **Gravar o marco "primeira competência paga pelo sistema" só quando o fluxo rodar.** O `PUT /comissoes_fechamentos/inicio` liga a rotina de fechamento e passa o dashboard ao modo sistema (N16-195, N16-200); hoje não há marco em nenhuma unidade. Simulando novembro com a produção de hoje, o pré-aceito dá 0 e o teto R$ 124 mil. Depende de BL-111 a BL-113. A rota: `api-acos-vital` `src/schemas/core_comissionamento/tables/fechamentos_comissao/fechamentos_comissao.route.js:98` (`router.put("/inicio"`) | 🔴 | PDF de Gustavo de 24/11, seções 3.1 e 3.6 |

## Fora da comissão

| ID | Nó | Frente | O que falta | Selo | Evidência |
|---|---|---|---|---|---|
| BL-115 | transversal | Nathan, Gustavo | **Copiar as telas e permissões do Hub do teste para a produção.** Pedido do Nathan de 19/11 (v2 em 23/11). Os scripts do Gustavo estão prontos (`Outros/Claude outputs/telas-teste-para-producao/`, fora do vault): `2026-11-19_0_conferir_telas_rodar_nos_dois.sql` compara a impressão digital dos dois bancos; `2026-11-19_1_rodar_no_TESTE_gera_scripts.sql` roda no tst e gera uma célula que só lê a produção e outra que copia telas e permissões numa transação **sem commit**. Desde 23/11 a produção fica igual ao teste (o que falta entra, o que sobra sai por `deleted_at`); perfis, `usuarios_perfis` e `auth.rotas_telas` não são tocados. Efeito para usuários reais (verificação de 19/11): o perfil Vendedor ganha Liberar pedidos (ver e editar); Gerência Geral e Diretoria ganham criar, editar e deletar no Acompanhamento de Clientes e perdem o Experimental. Falta quem roda dar o `COMMIT`; se o teste mudar, gerar de novo. Acerto pontual à parte, de 23/11 (❓ se já foi aplicado): `2026-11-23_menu_orcamento_e_compras_producao.sql` (o Orçamento só com Pedidos de custo, Produtos e Fornecedores, N16-173; o Histórico de compras sai de Compras) | 🟡 | PDF de Gustavo de 24/11, seção 5 |

A versão de Compras depois da contestação, que talvez não possa ser aprovada em produção, é a PS-068 ([[Pontas-Soltas-PS-066-em-diante]]).
