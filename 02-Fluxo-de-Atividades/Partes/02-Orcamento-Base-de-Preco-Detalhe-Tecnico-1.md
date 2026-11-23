---
tags: [fluxo, raia, orcamento, base-de-preco, matriz-de-precos, pedido-de-custo, pagina-do-produto, score, volatilidade, b1, b2, b3, b4, parte]
criado: 2026-11-05
estado-em: 2026-11-23
status: proposta
dono: Nathan (dono do Orçamento desde 17/11, N16-168) · Gustavo (banco e API)
parte-de: "[[02-Orcamento-Base-de-Preco]]"
develop-conferida: [api-acos-vital ce4f90f, av-hub 7f0f7e2, em 2026-11-23 (busca rápida e visual de Compras; só na develop); omie-elt-pipeline 28efc5a, em 2026-11-18 (C7); api-acos-vital 0e9f93e, av-hub a92272a, em 2026-11-17 (LOG-60 entregue; também na main: api-acos-vital #313, av-hub #307 f5b614a); api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13; api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
fontes: [Registro-de-Decisoes (N16-06, N16-07, N16-14, N16-16, N16-41, N16-52, N16-54, N16-55, N16-56, N16-58, N16-59, N16-72), Proposta-Score-e-Volatilidade-OQ-46, Proposta-Orcamento-Comissao/01-Decisoes/Respostas-de-Compras-2026-10-19 (fora do vault), Estudo-Omie-API, 10-Anexo-Fora-do-Fluxo/Orcamento (antigo, substituído), LOG-42, LOG-52, api-comercial 5aa5311 (suprimentos.prisma, suprimentos.routes.ts, custos.routes.ts), HUB branch feat/menu-orcamento-vendas-compras (ededeea, 200e860, 5aa5311), telas-vendas-orcamento-compras.sql, Dump Avhub 14/10, av-hub develop 758d5f0 (app/(protected)/orcamento), N16-107, N16-108, N16-117, N16-119, N16-179, N16-191, N16-192, api-acos-vital #329, av-hub #335 e #336]
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
| 8 | O valor correto que Compras usa na OC (`C7`) entra no histórico de compras; a proposta não muda | 📝 N16-08 ✅ (liga ao histórico, conferido pelo código em 18/11: `omie-elt-pipeline` `src/omie/resources/pedidosCompras.ts:179` (`valor_unitario: unitario,`)) |
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

Valores do módulo de teste do Pablo (histórico: `f7d8d7f:api-comercial/prisma/models/enums.prisma`; removido em 06/11/2026). Não são regra: vale o desenho desta raia e as decisões.

| Campo | Valores | Fonte |
|---|---|---|
| `StatusSolicitacao` (pedido de custo) | `ABERTA`, `RESPONDIDA`, `SEM_FORNECEDOR`, `CANCELADA` | `enums.prisma:188-195` 🔴 só no módulo de teste |
| SLA da solicitação (calculado) | `ATRASADA`, `VENCE_HOJE`, `NO_PRAZO` | `custos.routes.ts:338` 🔴 só no módulo de teste; **sai** com N16-58 (sem prazo; o tempo é cronometrado) 🔴 |
| `StatusOferta` | `VIGENTE`, `VENCIDA`, `INVALIDADA`, `HISTORICA` | `enums.prisma:179-186` 🔴 só no módulo de teste |
| `FonteOferta` | `MANUAL`, `MAPA_COTACAO`, `PEDIDO_OMIE`, `MIGRACAO` | `enums.prisma:170-177` 🔴 só no módulo de teste |
| `OrigemCusto` (item da proposta) | `VIGENTE`, `HISTORICO`, `MANUAL`, `SEM_CUSTO` | `enums.prisma:110-117` 🔴 só no módulo de teste |

A oferta é **imutável** (RN-130): corrigir é invalidar com motivo e lançar outra, o que garante o histórico (`suprimentos.prisma:138-183`). O pedido de custo passa a guardar **abertura e resposta** para o cronômetro, no lugar do prazo obrigatório 🔴.

## Telas

O menu Orçamento foi reescrito em 17/11/2026 (`LOG-60`, N16-173) com 3 telas e dado real. As telas do Pablo (abas Cotação, Ofertas, Pesquisa de materiais e Telha) saíram do menu; os componentes ficam no repositório enquanto branches abertas os usarem (BL-084). Desde 23/11 as telas seguem o visual das telas de Compras (N16-192, `av-hub` #336, só visual): o cabeçalho padrão `components/Ui/CabecalhoDaTela/CabecalhoDaTela.tsx:22` (`export default function CabecalhoDaTela`), a barra e os KPIs de `components/Pedidos/PedidosLista.module.css`, a tabela de `components/Compras/ComprasLista.module.css` e três peças próprias: `components/Orcamento/BarraDaLista.tsx:24` (`export default function BarraDaLista`), `components/Orcamento/BotaoVoltar.tsx:10` (`export default function BotaoVoltar`) e `components/Orcamento/LinhasEsqueleto.tsx:6` (`export default function LinhasEsqueleto`). Conferido no `av-hub` `7f0f7e2`:

| Tela | Rota | O que tem | Nó | Estado |
|---|---|---|---|---|
| Pedidos de custo | `/orcamento/painel-comprador` e `/[id]` | Fila com KPIs e tempo de espera; a página do pedido: assumir, registrar cotação, responder ou "sem fornecedor", cancelar | `B3`, `B4` | ✅ `components/Orcamento/PedidosFila.tsx:41` (`export default function PedidosFila`) |
| Produtos | `/orcamento/catalogo-produtos` e `/[id]` | Lista com o último preço pago; página com as duas fontes (cotação vigente e última compra), gráfico e as abas Cotações, Fornecedores, Compras e Vendas | `B1`, `B2` | ✅ `components/Orcamento/ProdutoPagina.tsx:61` (`export default function ProdutoPagina`) |
| Fornecedores | `/orcamento/fornecedores` e `/[id]` | Lista e ficha a partir de `core.parceiros`, compras e cotações | `B1` | ✅ `components/Orcamento/FornecedorPagina.tsx:31` (`export default function FornecedorPagina`) |
| Solicitações de custo (Vendas) | `/vendas/solicitacoes-custo` | Os pedidos de custo do vendedor | `B3` | ✅ `app/(protected)/vendas/solicitacoes-custo/page.tsx:9` (`<PedidosFila deVendas />`) |
| Parâmetros de custo | — | Saiu do Hub (N16-179, `av-hub` #321): os valores ficam no banco e mudam só por SQL do Gustavo; a proposta continua lendo os parâmetros (`SQL-024`) | — | 📝 N16-179 |
| Custo real por item | `/comissoes/custo-itens` | Saiu do Orçamento: é da raia 15 | — | ✅ `app/(protected)/comissoes/custo-itens/page.tsx:3` (`export default function Page`) |
| Matriz de preços | — | Virou a aba Cotações do produto (N16-173); a tela `matriz-precos` fica inativa | `B1`, `B2` | ✅ `components/Orcamento/ProdutoPagina.tsx:404` (`valor: 'cotacoes' as const`) |

## Endpoints e contratos

Todos estão na `api-acos-vital` `0e9f93e` (contrato `LOG-60`; a busca rápida, `ce4f90f`, adendo do `LOG-60`), com o token do usuário e as linhas de `auth.rotas_telas` da migration `2026-11-17_orcamento_cotacoes_pedidos_custo`:

| Método e rota | Uso | Nó | Código |
|---|---|---|---|
| `GET /produtos/precos`, `GET /produtos/:id/precos?meses=` | Lista com o último preço; página de preço (média, mínimo, máximo, volatilidade, série, fornecedores, compras) | `B1`, `B2` | ✅ `src/schemas/core/tables/produtos/produtos.route.js:283` (`router.get("/precos"`) e `:285` (`router.get("/:id/precos"`) |
| `GET /produtos/busca?q=&limit=` | Seletor de produto do "Pedir cotação": até 20 por busca (padrão 8); os já comprados em memória, renovada a cada 10 min, e o banco completa com os nunca comprados, por código; sem migration (vale a linha `GET /produtos` de `auth.rotas_telas`, por prefixo). No Hub, o BFF exige `catalogo-produtos` (`app/api/comercial/[...rota]/route.ts:112`, `padrao: '/produtos/busca'`) | `B3` | ✅ `src/schemas/core/tables/produtos/produtos.route.js:284` (`router.get("/busca", buscarProdutos)`), `src/schemas/core/tables/produtos/produtos.busca.js:23` (`const RENOVAR_MS = 10 * 60 * 1000`) e `src/utils/buscaProduto.js:39` (`export function primeirosQueCasam`); N16-191 |
| `GET`, `POST /comercial/solicitacoes_custo`; `POST …/:id/assumir`, `liberar`, `responder`, `cancelar` | Pedido de custo | `B3`, `B4` | ✅ `src/schemas/core_comercial/aggregates/solicitacoes_custo/solicitacoes_custo.route.js:231` (`router.post("/solicitacoes_custo"`) e `:313` (`router.post("/solicitacoes_custo/:id/responder"`) |
| `GET`, `POST /comercial/ofertas`; `POST /comercial/ofertas/:id/invalidar` | Cotação de fornecedor (imutável) | `B1`, `B4` | ✅ `src/schemas/core_comercial/aggregates/ofertas/ofertas.route.js:93` (`router.get("/ofertas"`) |
| `GET /comercial/fornecedores`, `/comercial/fornecedores/:id` | Lista e ficha do fornecedor | `B1` | ✅ `src/schemas/core_comercial/aggregates/fornecedores/fornecedores.route.js:48` (`router.get("/fornecedores"`) |
| `POST /custos/sugerir` | Sugestão de custo na proposta | `B2` | 🔴 sem API (o BFF responde 503); a proposta deve passar a mostrar as duas fontes (N16-172), com o Robert |
| Nota e ranking do fornecedor | — | `B2` | Fora do escopo por decisão (N16-174) |

Contrato: `LOG-60` (`06-Contratos/Entregues/LOG-60-Orcamento-Pedido-de-Custo-e-Cotacao`).
