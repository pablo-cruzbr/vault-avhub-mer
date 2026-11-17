---
tags: [fluxo, raia, orcamento, base-de-preco, matriz-de-precos, pedido-de-custo, pagina-do-produto, score, volatilidade, b1, b2, b3, b4]
criado: 2026-10-16
estado-em: 2026-11-05
status: proposta
ordem: 2
nos: [B1, B2, B3, B4]
anterior: "[[01-Proposta-de-Venda]]"
proxima: "[[03-Pedido-de-Venda-e-Liberacao]]"
develop-conferida: [api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Pablo e Robert (módulo; o Robert conduz as rotas desde 28/10, N16-117) · Gustavo (banco e API) · Nathan (front)
fontes: [Registro-de-Decisoes (N16-06, N16-07, N16-14, N16-16, N16-41, N16-52, N16-54, N16-55, N16-56, N16-58, N16-59, N16-72), Proposta-Score-e-Volatilidade-OQ-46, Proposta-Orcamento-Comissao/01-Decisoes/Respostas-de-Compras-2026-10-19 (fora do vault), Estudo-Omie-API, 10-Anexo-Fora-do-Fluxo/Orcamento (antigo, substituído), LOG-42, LOG-52, api-comercial 5aa5311 (suprimentos.prisma, suprimentos.routes.ts, custos.routes.ts), HUB branch feat/menu-orcamento-vendas-compras (ededeea, 200e860, 5aa5311), telas-vendas-orcamento-compras.sql, Dump Avhub 14/10, av-hub develop 758d5f0 (app/(protected)/orcamento), N16-107, N16-108, N16-117, N16-119]
---

# Orçamento e base de preço de compra

**Em uma frase:** o Orçamento é o setor novo que mantém o preço de compra de cada produto, sempre com histórico, para o vendedor consultar ou pedir cotação quando não tem o custo.

**Quando consultar:** dúvidas sobre o preço de compra de um produto: de onde vem, como o histórico é guardado e como o vendedor pede cotação.

**Onde estamos no fluxo:** ← [[01-Proposta-de-Venda]] | [[03-Pedido-de-Venda-e-Liberacao]] → · nós desta nota: `B1`, `B2`, `B3`, `B4`

Esta nota substitui o anexo [[Orcamento]], arquivado em 26/10/2026. Os nós são `B1` a `B4` do [[00-Fluxo-Mestre-0b]].

## Como funciona, passo a passo

1. O vendedor monta a proposta e tenta preencher o custo com o que conseguiu. Ele não é dono do dado, mas decide o valor que põe. `V0.2`
2. Se precisa de referência, ele abre a página do produto: histórico de preços, melhores fornecedores com nota, flutuação e valor médio. É só leitura. `B2`
3. Se não tem o dado, ele pede o custo de um item ao Orçamento. Não há prazo fixo: o sistema só cronometra o tempo. O vendedor segue trabalhando. `B3`
4. O orçamentista assume o pedido, cota com fornecedores e responde com uma oferta. O custo aparece na proposta. Se nenhum fornecedor serve, o pedido fecha com justificativa. `B4`
5. A oferta entra na base de preço e não muda mais. Para corrigir, o orçamentista invalida com motivo e lança outra. `B1`
6. Quando Compras emite a ordem de compra (OC), o preço pago vira a última referência do produto. O valor correto usado na OC também deve entrar no histórico. `C7`, `B1`
7. Com o custo na proposta, o sistema calcula margem e comissão estimada para o vendedor. `V0.3`

## Exemplo

O vendedor do Cliente Exemplo S.A. não tem o preço do flange. Ele olha o histórico e vê a média das compras anteriores. A cotação mais recente tem menos de 7 dias? Então ele usa o valor dela.

Se não tem cotação recente, pede ao Orçamento o custo dos 100 flanges e continua montando a proposta. O orçamentista cota com fornecedores e responde. A cotação vira uma oferta vigente. Se estava errada, ele a invalida com motivo e lança a certa.

Depois, Compras emite a OC dos 100 flanges. O preço pago passa a ser a última referência de compra do produto.

## Quem atua

| Quem | O que faz |
|---|---|
| Orçamento (setor novo; o Moisés é uma das pessoas) | Cota com fornecedores, atualiza ofertas e responde pedidos de custo |
| Vendedor | Consulta a página do produto, pede cotação e decide o valor que põe na proposta |
| Compras | Dona do dado de compra. As OC efetivadas alimentam a base |

Quem desenvolve: o Orçamento é do Pablo, com o Robert (N16-117, N16-119).

## Regras que valem

- A base é o preço de compra do produto e guarda sempre o histórico.
- Duas fontes alimentam a base: as OC efetivadas e a atualização do orçamentista. Vale sempre o valor mais atualizado.
- A matriz de preços é por produto, fornecedor, unidade e vigência.
- O vendedor não é dono do dado de custo. Ele responde pelo valor que decide.
- O pedido de custo não tem prazo fixo, e o vendedor nunca fica bloqueado.
- A oferta não se edita. Corrigir é invalidar com motivo e lançar outra.
- A nota do fornecedor pesa preço em 50%, prazo em 30% e histórico em 20%.
- Sem dado de prazo ou histórico, a nota fica neutra e aparece o aviso "poucos dados".
- Vale a última cotação com menos de 7 dias. Mais velha, o vendedor vê a média e pode pedir nova.
- O setor funciona mesmo sem orçamentista disponível. O perfil "orçamentista" deve existir.

## O que já existe e o que falta

- 📝 **Contrato `LOG-60` (`06-Contratos/Ativos/LOG-60-Orcamento-Pedido-de-Custo-e-Cotacao`, 17/11/2026):** pedido de custo com cronômetro, cotação imutável, página do produto com as duas fontes (N16-172) e fornecedores, com o menu de três telas (N16-173). Validade da cotação definida por quem registra, só produto do catálogo, sem e-mail de cotação e nota e ranking do fornecedor para o futuro (N16-174). Código em PR (api-acos-vital #312, av-hub #306), ainda fora da `develop`; a migration fica com o Gustavo.
- O front de Fornecedores, Produtos, Cotação e a análise da proposta lê a API do Hub desde 27/10 (`av-hub` `d6dc1a6`).
- A `api-comercial` de teste não roda desde 29/10/2026 e foi removida do av-hub em 06/11/2026 (PR #261, `dd9d729`); o código fica legível em `git show f7d8d7f:api-comercial/<arquivo>`.
- 🔴 Na `api-acos-vital` (`develop`), o router `/suprimentos` existe, mas ainda não tem rota: nasce fechado (`core_comercial/index.js`, "fase 4").
- ✅ Telas no `av-hub` (`develop`, menu enxuto de 27/10, N16-107 e N16-108): Pedidos de custo (Painel do Comprador e Pedido de cotação, em abas), Produtos (Catálogo, Pesquisa de materiais e Ofertas, em abas), Fornecedores, Parâmetros (custo e Telha, em abas) e Custo por item.
- 🔴 Sem API e sem banco: oferta imutável com histórico, média por período e pedido de custo existiam só no `api-comercial` de teste, removido do av-hub em 06/11/2026 (PR #261, `dd9d729`); falta portar para a `api-acos-vital`. No banco de teste de 04/11/2026 as tabelas `core_comercial.ofertas` e `solicitacoes_custo` também saíram ([[Dump-AvHub-Teste-2026-11-04]]). Na API do Hub já há a leitura de fornecedores, vínculos, categorias e cotações (✅ `api-acos-vital` `orcamento.route.js:140-312`).
- 📝 As regras acima estão decididas.
- 🟡 Valor correto da OC (`C7`) entrando no histórico de compras.
- 🟡 Cadastro das telas em produção.
- 🔴 Página do produto para o vendedor.
- 🔴 Nota do fornecedor, ranking por categoria e volatilidade.
- 🔴 Prazo de entrega em dias.
- 🔴 Matriz de preços, com modelo e tela.
- 🔴 Cronômetro do pedido de custo no lugar do prazo.
- 🔴 Perfil "orçamentista".
- 🔴 Migração do módulo para a `api-acos-vital`.

## Detalhe técnico

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-1]]: Ligações · Objetivo · Quem atua (completo) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2]]: Como estava no módulo de teste do Pablo (🔴 `av-hub/api-comercial`, removido em 06/11/2026) · Dados 🟡 · Quem vê o quê · Orçamento visto da proposta (B2 a B4) · O que falta desenvolver · Pendências · Diagrama do subfluxo · O que foi do antigo anexo `Orcamento.md`
