---
tags: [pesquisa, comercial, suprimentos, api-comercial, proposta, orcamento, mapa, staging]
criado: 2026-10-16
estado-em: 2026-11-11
status: proposta
dono: Pablo
fontes: [av-hub 5aa5311 (branch feat/menu-orcamento-vendas-compras) api-comercial/prisma/models e prisma/migrations, api-comercial/src/modules e src/domain, api-comercial/README.md, app/api/comercial/[...rota]/route.ts, app/(protected)/vendas orcamento compras, components/Propostas Suprimentos PainelComprador, lib/domain/fluxo-suprimentos.ts, docs/ENVIAR - contrato-comercial-suprimentos-telas.md, Dump Avhub (Esqueleto).sql, omie-elt-pipeline src/jobs/envioOrdensCompra.ts, 00-Briefing-Decisoes]
---

# Mapa do módulo do Pablo (Comercial e Suprimentos), histórico

**Em uma frase:** o Pablo criou um módulo comercial de teste (`api-comercial`), sem dados, que foi **removido do av-hub em 06/11/2026**; esta nota guarda o que ele tinha e como as decisões mudaram cada parte.

**Quando consultar esta nota:** para saber como o código de teste fazia algo (histórico em `git show f7d8d7f:api-comercial/<arquivo>`). Ele não é fonte de regra nem de estado: vale o desenho das raias, o [[00-Fluxo-Mestre-0b]] e as decisões; o módulo vive na `api-acos-vital`.

> [!warning] Leia os selos desta nota pelo F3 (05/11/2026)
> Esta nota descreve o `api-comercial` de teste, que foi removido do av-hub em 06/11/2026 (PR #261, `dd9d729`); o código fica legível em `git show f7d8d7f:api-comercial/<arquivo>`. Aqui, ✅ quer dizer "visto no código de teste", e **não** pronto: pelo F3, o que só existe no `api-comercial` é 🔴 "sem API e sem banco". O estado do módulo na `develop` está no [[Onde-Estamos]] (linhas da proposta e do Orçamento), nas raias [[01-Proposta-de-Venda]], [[02-Orcamento-Base-de-Preco]] e [[06-Circuito-de-Compra]] e no [[Backlog-Frente-Comercial-e-Suprimentos]]. O envio do pedido ao Omie não é mais por fila: desde 03/11 a `api-acos-vital` chama o Omie direto ([[Mapa-IncluirPedido-Omie]]).

Selos: ✅ visto no código · 📝 decidido (`N16-xx`) · 🟡 proposta nova · ❓ 🔴 não conferido ou falta. Decisões em [[Registro-de-Decisoes]].

## O que era (histórico)

- Era um servidor de teste do módulo comercial: propostas, clientes, orçamento e compras. Nunca foi publicado (N14-15, N16-15) e foi removido do av-hub em 06/11/2026 (PR #261, `dd9d729`).
- Tinha cerca de 30 tabelas, 24 listas de valores fixos e 91 rotas.
- Não tinha dado nenhum (N16-109). 📝
- As telas estão no av-hub, em Vendas, Orçamento e Histórico de compras; o BFF só fala com a `api-acos-vital`.
- O Robert conduz o módulo na API do Hub (`api-acos-vital`). O Pablo acompanha e o Gustavo revisa o banco (N16-117).

## O que o código antigo tinha e o desenho mantém

Quem manda é o desenho e as decisões; a tabela só mostra onde o código antigo já fazia o mesmo. Na `develop`, o que não está na `api-acos-vital` é 🔴 "sem API e sem banco".

| Item | Por quê | Selo |
|---|---|---|
| Cálculo da proposta (linha, totais, margem) | A regra já bate com o sistema antigo. O N16-11 manda manter o motor | ✅ |
| Custo líquido, médias e escolha do custo | Servem à base de preço do Orçamento | ✅ |
| Configurador de telha | O N16-15 mantém o módulo | ✅ |
| Clientes e carteira | Continuam em Vendas | ✅ |
| Empresas emissoras (AV, AU, HRM) | Continuam, com a unidade do Omie | ✅ |
| Pedido de custo | Vira o pedido de custo ao Orçamento (N16-06) | ✅ |
| Ofertas que não mudam | O histórico fica sempre na base (N16-07) | ✅ |
| Painel do Comprador, fornecedores, catálogo e histórico de compras | São telas do Orçamento e de Compras | ✅ |

## O que muda

| No código antigo | No desenho | Decisão |
|---|---|---|
| Número `CO-AV2026-0012-R03` | Só dígitos, em sequência própria. O prefixo aparece só na tela e no PDF | 📝 N16-04 |
| Status aberta, parcial, fechada, perdida | Aberta, aprovada, transformada, cancelada | 📝 N16-02, N16-03 |
| Fechamento parcial por item | Some: uma proposta vale um pedido | 📝 N16-02 |
| Proposta sem custo podia fechar | Proposta incompleta não aprova | 📝 N16-03 |
| O vendedor digita o pedido no Omie | Um botão cria o pedido por API, numa fila | 📝 N16-02 |
| Qualidade registrada na liberação | Obrigatória na proposta. O pedido nasce liberado | 📝 N16-05 |
| Câmbio da AwesomeAPI | PTAX do Hub | 📝 N16-13 |
| Pedido de custo com prazo de 2 dias úteis | Sem prazo fixo. O tempo é cronometrado | 📝 N16-06, N16-58 |
| Custo real do pedido não existe | Custo real por evento e por item | 📝 N16-09 |
| Compras não atua na proposta | Compras confere (`C6`) e usa o valor correto na OC (`C7`), sem alterar a proposta | 📝 N16-08, N16-17 |

## O que fica de fora da migração

| Item | Motivo |
|---|---|
| Migração do ERP antigo | Não há migração (N16-13) |
| Sincronização própria com o Omie e suas tabelas de cópia | A pipeline é a fonte (N16-14, N14-15) |
| Câmbio próprio | Vale a PTAX do Hub |
| Planilha "pedido a digitar no Omie" | O pedido sai por API |
| Auditoria própria 🟡 | Já existe `auth.auditoria` |
| Perfis de teste 🟡 | São fictícios e nunca vão à produção |

## Defeitos que a migração não pode herdar

A auditoria de 15/10 achou 24 itens. Exemplos: escopo por vendedor que não restringe e CNPJ alfanumérico rejeitado. A lista está em [[Contratos-da-v2|LOG-52]] §10.

## Perguntas abertas

| # | Pergunta | Quem | Selo |
|---|---|---|---|
| M1 | Qual é o nome real da tela de pedidos de venda e de notas fiscais de saída? | Nathan | ❓ |
| M2 | Como o pedido por API recebe a condição de pagamento de venda, que o Omie não espelha? | Gustavo, Nathan | 🔴 |
| M3 | O cliente da proposta existe nas duas contas do Omie? | Nathan, Gustavo | 🔴 |

## Detalhe técnico

Tudo abaixo é o conteúdo completo da nota original, sem cortes.

Este mapa descreve o código de teste `av-hub\api-comercial` (N14-15, N16-15), removido em 06/11/2026 e legível no commit `f7d8d7f`, e o que as decisões N16 mudam nele. Cada fato do código traz arquivo e linha (✅). Decisão traz o ID `N16-xx` (📝). O que é proposta nova leva 🟡. O que não deu para conferir leva ❓ ou 🔴. Decisões: [[Registro-de-Decisoes]].

Caminhos abaixo são relativos a `f7d8d7f:api-comercial/` (histórico, no repositório av-hub) quando não dizem o contrário.

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[Mapa-do-Modulo-do-Pablo-Detalhe-Tecnico-1]]: 1. Em uma página · 2. Camadas da requisição · 3. Banco: o que cada migration criou · 4. Regras de negócio no código
- [[Mapa-do-Modulo-do-Pablo-Detalhe-Tecnico-2]]: 5. Rotas por módulo (`/v1`) · 6. Telas do av-hub · 7. Integrações com o Omie · 8. O que serve como está, o que muda e o que fica de fora · 9. Defeitos do código de teste que a migração não pode herdar · 10. Perguntas que nascem deste mapa
