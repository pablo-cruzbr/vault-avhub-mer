---
tags: [desenvolvimento, pontas-soltas, pendencias, parte]
criado: 2026-11-24
estado-em: 2026-11-24
status: vigente
dono: Nathan
parte-de: "[[Pontas-Soltas]]"
develop-conferida: [api-acos-vital ed6d147, em 2026-11-24]
fontes: [PDF de Gustavo de 18/11/2026 (LOG-62, grão de pedido, SQL-023), PDF de Gustavo de 24/11/2026 (comissões, SQL-024, telas para a produção e custo-item), Outros/Dump avhub auth 23.11.sql (do Gustavo, fora do vault)]
---

# Pontas soltas abertas desde a PS-066

**Em uma frase:** as pontas soltas abertas a partir da PS-066, que vieram das entregas do Gustavo de 18 e 24/11/2026; as anteriores estão em [[Pontas-Soltas]], que ficou no limite de 25 KB.

**Onde estamos:** ← [[Pontas-Soltas]] (como ler, resumo e as pontas até a PS-065) · fechadas: [[Pontas-Soltas-Resolvidas-em-14-10]]

As colunas e os selos são os mesmos da nota principal.

| ID | Ponta solta | Dono | Nó | Proposta | Ref |
|---|---|---|---|---|---|
| PS-066 | **Ninguém vê custo, margem e letra na proposta desde 19/11, nem o Admin (Dev).** No dump de auth de 23/11 a tela `custo-item` está com `ativo = false` desde 19/11 16:40, gravado pela tela Acessos (`PUT /acessos/telas/...`) com o usuário do Nathan. A `auth.fn_me_permissoes` ignora tela inativa; a `auth.fn_autorizar` deixou de ignorar em 04/11 ("tela inativa só some do menu"). O BFF (`requirePermission`) e a API do Hub leem a primeira: ✅ `api-acos-vital` `src/schemas/core_comercial/capacidades.js:64` (`ve_custo: pode("custo-item", "pode_visualizar")`). Risco nos dados: o `PUT` da proposta (`fn_proposta_revisar`) regrava os itens; se a tela mandou a análise nula, ela foi apagada (o snapshot fica em `propostas_versoes`), e um pedido transformado nesse período pode ter a v1 da simulação sem letra. O Gustavo tem um diagnóstico só de leitura (`diagnostico-custo-item-inativa-2026-11-24.sql`, fora do vault). A `pedidos-venda-financeiro` também está inativa desde 18/11 (ação de Pedidos da Equipe pelo `LOG-62`); na API ela passa pela `fn_autorizar`, e falta ver se o Hub a confere pelo `/me/permissoes` | Nathan (decide), Gustavo | transversal | **Pergunta (Gustavo):** (1) reativar já a `custo-item` (por Acessos ou com `UPDATE auth.telas SET ativo = true WHERE slug = 'custo-item'`) até o Robert decidir o custo na proposta (a proposta dele, de 24/11: `ve_custo` = `propostas: pode_visualizar` e depois apagar a tela)? (2) Qual regra vale para tela inativa: a `fn_me_permissoes` passa a contar como a `fn_autorizar`, ou as duas voltam a ignorar? 🔴 | BL-110, [[RBAC-e-Permissoes]], `LOG-62` |
| PS-067 | **Dois riscos do grão de pedido, que mudam o que se paga (Gustavo, 18/11).** (1) A `vw_comissao_master` liga a simulação à nota comparando o sequencial com `COALESCE(..., -1)`: os pedidos de produção têm sequencial 0 e as simulações nascem com nulo, então um pedido com simulação aprovada sai `ITENS_FORA_DO_SIMULADOR`, com comissão 0. As colunas novas da master (`venda_revenda`, `venda_fabricacao`, `pct_venda_fabricacao`) ligam pelo pedido e não sofrem disso. ❓ Desde a A1 (`api-acos-vital` `b9a46a1`) a versão é contada pelo pedido, sem o sequencial; não foi conferido se isso fecha o (1). (2) Faturamento em partes: 895 pedidos de produção têm itens em parcelas, cada uma com `codigo_item_omie` próprio; com a regra "item faturado sem correspondente deixa a nota pendente", eles travam. A A2 (N16-197) casa pelo produto quando o código não casa, o que pode cobrir parte do (2) ❓ | Robert | K1, K4 | **Pergunta (Gustavo):** quem leva os dois riscos ao Robert, o Nathan ou o Gustavo? O Gustavo não mexeu porque mudam o que se paga 🟡 | N16-185, [[01-Motor-Atual-Como-Calcula]] |
| PS-068 | **A versão de Compras depois da contestação pode não ter como ser aprovada em produção.** O pedido corrigido por contestação (N16-199) fica `AGUARDANDO_COMPRAS` até a versão de Compras ir a `APROVADO`; na produção, `PUT /simulacoes/*` só está mapeado para a tela do Simulador em `auth.rotas_telas` | Robert, Gustavo | K4 | **Pergunta (Gustavo):** conferir como a Análise de Simuladores aprova hoje e, se preciso, mapear a rota também para ela 🔴 | BL-112, N16-199 |

## Ligações rápidas

- As pontas até a PS-065: [[Pontas-Soltas]].
- O que falta fazer na comissão antes de ir ao ar: [[Backlog-Entrega-Gustavo-2026-11-24]].
