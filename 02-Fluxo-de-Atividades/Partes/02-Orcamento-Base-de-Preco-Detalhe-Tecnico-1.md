---
tags: [fluxo, raia, orcamento, base-de-preco, matriz-de-precos, pedido-de-custo, pagina-do-produto, score, volatilidade, b1, b2, b3, b4, parte]
criado: 2026-11-05
estado-em: 2026-11-05
status: proposta
dono: Pablo e Robert (módulo; o Robert conduz as rotas desde 28/10, N16-117) · Gustavo (banco e API) · Nathan (front)
parte-de: "[[02-Orcamento-Base-de-Preco]]"
develop-conferida: [api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
fontes: [Registro-de-Decisoes (N16-06, N16-07, N16-14, N16-16, N16-41, N16-52, N16-54, N16-55, N16-56, N16-58, N16-59, N16-72), Proposta-Score-e-Volatilidade-OQ-46, Proposta-Orcamento-Comissao/01-Decisoes/Respostas-de-Compras-2026-10-19 (fora do vault), Estudo-Omie-API, 10-Anexo-Fora-do-Fluxo/Orcamento (antigo, substituído), LOG-42, LOG-52, api-comercial 5aa5311 (suprimentos.prisma, suprimentos.routes.ts, custos.routes.ts), HUB branch feat/menu-orcamento-vendas-compras (ededeea, 200e860, 5aa5311), telas-vendas-orcamento-compras.sql, Dump Avhub 14/10, av-hub develop 758d5f0 (app/(protected)/orcamento), N16-107, N16-108, N16-117, N16-119]
---

# Orçamento e base de preço de compra: detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[02-Orcamento-Base-de-Preco]] (parte 1 de 2): Ligações; Objetivo; Quem atua (completo); Regras decididas; Estados; Telas; Endpoints e contratos.

**Onde estamos:** ← [[02-Orcamento-Base-de-Preco]] (resumo e índice) · partes: **02-Orcamento-Base-de-Preco-Detalhe-Tecnico-1** · [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2]]

## Ligações

O que foi do antigo anexo [[Orcamento]] está na última seção. Nós do [[00-Fluxo-Mestre-0b]]: `B1` a `B4`. Ligações: `V0.2` (o vendedor preenche o custo, consulta ou pede cotação) e `V0.3` em [[01-Proposta-de-Venda]]; `C6` a `C8` em [[06-Circuito-de-Compra]]. Selos em [[Regras-do-Vault]].

## Objetivo

O **Orçamento é o setor orçamentário** (N16-07): vai atrás de fornecedores e mantém a **base de precificação**. O setor é **novo e ainda está em formação**; uma das pessoas é o **Moisés** (N16-104). O sistema funciona sem orçamentista disponível (N16-59) e o perfil "orçamentista" deve existir.

**O vendedor não é o dono do dado de custo** (N16-54). Sem o dado, ele **consulta a página do produto** ou **pede uma cotação**. A base tem **duas fontes** (N16-41): as **ordens de compra efetivadas** (o custo da última compra, item a item) e o **setor orçamentário**, que também atualiza os valores à mão; **vale sempre o valor mais atualizado** (N16-52). A **matriz de preços** é por produto × fornecedor × unidade × vigência (N16-32); quantidade, moeda e condição de compra ficam para depois. O **pedido de custo** não tem prazo fixo e o sistema **cronometra o tempo** (N16-58); o vendedor nunca fica bloqueado.

Os nós (numeração 🟡: o desenho do Nathan fixou só o intervalo `B1` a `B4`; o significado de cada um é proposta):

| Nó | O que acontece |
|---|---|
| `B1` | Base de preço de compra do produto, sempre com histórico, com duas fontes: OC efetivadas e atualização do orçamentista |
| `B2` | Página do produto para o vendedor: histórico, top fornecedores com score, últimos preços, flutuação anual, mensal e de todo o período (como bolsa de valores), volatilidade e valor médio. Só leitura |
| `B3` | Pedido de custo: o vendedor sem o dado pede a cotação de um item. Sem prazo fixo, com o tempo cronometrado |
| `B4` | Cotação: o orçamentista cota com fornecedores, grava a oferta na base (`B1`) e preenche o custo na proposta |

## Quem atua (completo)

| Quem | Papel | Onde |
|---|---|---|
| Orçamento (setor orçamentário, novo; o Moisés é uma das pessoas) | Cota com fornecedores, atualiza ofertas, responde pedidos de custo | Orçamento (`/orcamento/*`) |
| Vendedor | Consulta a página do produto, pede cotação; **decide o valor que põe na proposta** | Vendas e Orçamento (só consulta) |
| Compras | Dona do dado de compra; o valor das OC efetivadas alimenta a base; o valor correto da OC (`C7`) entra no histórico | Compras |
| Robert | Conduz o módulo e faz as rotas na `api-acos-vital` (N16-117) | `api-acos-vital` |
| Pablo | Dono do Orçamento; acompanha o Robert (N16-117) | `api-acos-vital` |
| Gustavo (DBA) | Revisa e aplica a migração do Orçamento no `core_comercial` | `api-acos-vital` |
| Nathan | Telas | HUB |

`Admin (Dev)` não é ator.

## Regras decididas

| # | Regra | Selo |
|---|---|---|
| 1 | Orçamento é o setor orçamentário; mantém a base de precificação; é um setor novo (o Moisés é uma das pessoas) e o sistema funciona sem orçamentista | 📝 N16-07, N16-59, N16-104 |
| 2 | A base é o preço de compra do produto, **sempre com histórico** | 📝 N16-07 |
| 3 | A base tem **duas fontes**: OC efetivadas (custo da última compra) e atualização do orçamentista. **Vale sempre o valor mais atualizado** | 📝 N16-41, N16-52 |
| 4 | A matriz de preços é por produto × fornecedor × unidade × vigência | 📝 N16-32 |
| 5 | O vendedor tem a **página do produto** (histórico, top fornecedores e score, últimos preços, flutuação, volatilidade, média). É só consulta | 📝 N16-07, N16-52 |
| 6 | **O vendedor não é o dono do dado de custo**: preenche com o que conseguiu; sem o dado, pede cotação ou vê o histórico das OC. Ele decide o valor e a responsabilidade é dele | 📝 N16-06, N16-54 |
| 7 | O pedido de custo **não tem prazo fixo**; o tempo é cronometrado; o vendedor nunca fica bloqueado | 📝 N16-58, N16-06 |
| 8 | O valor correto que Compras usa na OC (`C7`) entra no histórico de compras; a proposta não muda | 📝 N16-08 🟡 (liga ao histórico) |
| 9 | O Orçamento volta ao escopo (a decisão "só pro futuro" foi revista) | 📝 N16-16 |

### Regras da página do produto (N16-55, N16-56, N16-72)

| Item | Regra | Selo |
|---|---|---|
| Score do fornecedor | `(Nota Preço × 0,5) + (Nota Prazo × 0,3) + (Nota Histórico × 0,2)`. Nota Preço = menor preço ÷ preço do fornecedor × 100. Nota Prazo = menor prazo em dias ÷ prazo do fornecedor × 100. Nota Histórico = percentual de entregas no prazo (ou taxa de aprovação de cotações passadas) | 📝 N16-55 |
| Nota Preço | compara o **custo líquido** (com imposto e frete), na **mesma unidade** (preço por KG) e na **mesma moeda** | 📝 N16-56 |
| Nota Prazo | prazo de **entrega em dias, como número** (hoje a `Oferta` guarda texto livre) | 📝 N16-56, 🔴 campo novo |
| Nota Histórico | usa a **data real do recebimento** (`dRec` na NF de entrada do Omie, [[Estudo-Omie-API]]) contra a prevista | 📝 N16-56 |
| Falta de prazo ou histórico | **nota neutra** naquilo que falta e o aviso **"poucos dados"** | 📝 N16-72 |
| Top fornecedores | score associado à **frequência de vitória** (= Compras efetivamente comprou do fornecedor, aparece numa OC), ranqueado por **categoria** de material | 📝 N16-55, N16-72 |
| Volatilidade | coeficiente de variação (desvio padrão ÷ média) dos preços dos últimos 30 a 90 dias; alerta "Alta Volatilidade" acima de 15% ou 20%; **só calcula com um mínimo de pontos** | 📝 N16-55, N16-56 |
| Dado recente | a **última cotação válida** por produto, com menos de **7 dias** (parâmetro por categoria). Mais velha: o vendedor vê a média histórica e o botão de pedir cotação | 📝 N16-55, N16-72 |
| Parâmetros | pesos, limites e dias são **parâmetro configurável, com vigência**, não fixos no código | 📝 N16-56 |

## Estados

Valores reais do módulo do Pablo (`api-comercial/prisma/models/enums.prisma`, hoje só para leitura):

| Campo | Valores | Fonte |
|---|---|---|
| `StatusSolicitacao` (pedido de custo) | `ABERTA`, `RESPONDIDA`, `SEM_FORNECEDOR`, `CANCELADA` | `enums.prisma:188-195` 🔴 só no módulo de teste |
| SLA da solicitação (calculado) | `ATRASADA`, `VENCE_HOJE`, `NO_PRAZO` | `custos.routes.ts:338` 🔴 só no módulo de teste; **sai** com N16-58 (sem prazo; o tempo é cronometrado) 🔴 |
| `StatusOferta` | `VIGENTE`, `VENCIDA`, `INVALIDADA`, `HISTORICA` | `enums.prisma:179-186` 🔴 só no módulo de teste |
| `FonteOferta` | `MANUAL`, `MAPA_COTACAO`, `PEDIDO_OMIE`, `MIGRACAO` | `enums.prisma:170-177` 🔴 só no módulo de teste |
| `OrigemCusto` (item da proposta) | `VIGENTE`, `HISTORICO`, `MANUAL`, `SEM_CUSTO` | `enums.prisma:110-117` 🔴 só no módulo de teste |

A oferta é **imutável** (RN-130): corrigir é invalidar com motivo e lançar outra, o que garante o histórico (`suprimentos.prisma:138-183`). O pedido de custo passa a guardar **abertura e resposta** para o cronômetro, no lugar do prazo obrigatório 🔴.

## Telas

Menu **Orçamento** desde 16/10/2026; enxugado em 27/10/2026 (N16-107 e N16-108, `av-hub` `a1493a8`): as telas antigas viraram abas dentro de 4 entradas. Conferido em `app/(protected)/orcamento/*` da `develop` em 29/10/2026:

| Nome atual | Rota | Abas (conferidas no código) | Nó | Estado |
|---|---|---|---|---|
| Pedidos de custo (Painel do Comprador) | `/orcamento/painel-comprador` | fila do Painel do Comprador e Pedido de cotação (`PaginaComAbas`) | `B3`, `B4` | 🟡 tela no `av-hub`; os dados (`/painel-comprador`, `/solicitacoes-custo`) respondem 503 no BFF: sem API e sem banco 🔴 — fila de solicitações de custo; responde com oferta (PR #201) |
| Produtos (Catálogo) | `/orcamento/catalogo-produtos`, `/[id]` | Catálogo, Pesquisa de materiais e Ofertas | `B1`, `B2` | ✅ o detalhe do produto mostra os preços (`components/Suprimentos/ProdutoDetalhe.tsx`); é a base da página do produto |
| Fornecedores (e ficha) | `/orcamento/fornecedores`, `/[id]` | lista e ficha | `B1` | ✅ (`av-hub`) |
| Parâmetros de custo | `/orcamento/parametros-custo` | Custo (ICMS a recuperar, densidades, validade) e Telha (tabela da telha) | `B1` | ✅ (`av-hub`); 🟡 recebe também os pesos do score e os limites |
| Custo por item | `/orcamento/custo-itens` | — | `B2` | ✅ (`av-hub`) itens, lotes e custo médio do pedido |
| Custo do item (oculta) | — | — | `B2` | ✅ (`api-acos-vital`) slug `custo-item`: libera ver custo, margem e sugestão |
| Solicitações de custo (oculta, em Vendas) | — | — | `B3` | ✅ (`api-acos-vital`) slug `solicitacoes-custo`: o vendedor pede custo pela proposta |
| Histórico de compras | — | — | `B1` | Sai (N16-108): `/compras/historico-compras` não existe mais na `develop`; o histórico está em Ordens de compra, com filtro por produto |
| **Página do produto para o vendedor**: histórico, top fornecedores com score, flutuação anual, mensal e total, volatilidade, média | 🟡 | 🟡 | `B2` | 🔴 hoje só quem tem `custo-item` ou `painel-comprador` vê custo (`capacidades.ts:77`) |
| Matriz de preços | 🟡 | 🟡 (o BFF já cita o slug `matriz-precos`, `app/api/comercial/[...rota]/route.ts:89,104`) | `B1`, `B2` | 🔴 tela ainda não construída |

## Endpoints e contratos

Rotas do `api-comercial` (legado só para leitura, N16-117) que o Robert recria na `api-acos-vital` ([[Contratos-da-v2|LOG-52]]; nenhuma delas existe ainda na `api-acos-vital`, conferido em 29/10/2026):

| Método e rota | Uso | Nó | Código |
|---|---|---|---|
| `GET /produtos`, `/produtos/:id`, `POST /produtos` | catálogo | `B2` | 🟡 `GET /produtos` e `/produtos/:id` vão à API do Hub (✅ `api-acos-vital` `src/schemas/core/tables/produtos/produtos.route.js`); `POST /produtos` 🔴 só no módulo de teste (`suprimentos.routes.ts:29`, `:72`, `:106`) |
| `GET /produtos/:id/precos?dias=` | mínimo, máximo, último, média e por fornecedor com variação sobre a média | `B2` | 🔴 sem API e sem banco: o BFF aponta para a API do Hub, mas a `api-acos-vital` não tem a rota; existe só no módulo de teste (`suprimentos.routes.ts:823-875`) (exige `veCusto`) |
| `GET /produtos/:id/score_fornecedores`, `/volatilidade` | score, ranking por categoria, coeficiente de variação, dado recente | `B2` | 🔴 🟡 nomes |
| `GET /ofertas`, `POST /ofertas`, `POST /ofertas/:id/invalidar`, `GET /ofertas/importacoes`, `/exportar` | base com histórico | `B1`, `B4` | ✅ `:645`, `:687`, `:791`, `:561`, `:597` |
| `GET /solicitacoes_custo`, `POST /solicitacoes_custo` | fila e criação do pedido de custo | `B3` | 🔴 sem API e sem banco (só no módulo de teste `av-hub/api-comercial`, que será removido; o BFF responde 503): `custos.routes.ts:304`, `:367` |
| `POST /solicitacoes_custo/:id/assumir`, `liberar`, `responder`, `cancelar` | comprador pega, devolve, responde, cancela | `B4` | 🔴 sem API e sem banco (só no módulo de teste `av-hub/api-comercial`, que será removido; o BFF responde 503): `custos.routes.ts:494`, `:500`, `:406`, `:508` |
| `POST /custos/sugerir` | sugestão de custo | `B2` | 🔴 sem API e sem banco (só no módulo de teste `av-hub/api-comercial`, que será removido; o BFF responde 503): `custos.routes.ts:30` |
| Matriz de preços | 🟡 | `B1`, `B2` | 🔴 |

Contratos: os do Orçamento foram removidos em 29/10/2026 e o Robert cria os novos. Dependências: [[Contratos-da-v2|LOG-52]] (fases 4 e 5).
