# Fatos de 02-Orcamento-Base-de-Preco

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/02-Orcamento-Base-de-Preco.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir 02-Orcamento-Base-de-Preco`.

## decisões e IDs (4)

- `N16-107`
- `N16-108`
- `N16-117`
- `N16-119`

## contratos (0)


## commits (1)

- `d6dc1a6`

## arquivo:linha (3)

- `Orcamento.md`
- `core_comercial/index.js`
- `orcamento.route.js:140-312`

## rotas (0)


## datas (3)

- `26/10/2026`
- `27/10`
- `29/10/2026`

## código entre crases (17)

- `/suprimentos`
- `B1`
- `B2`
- `B3`
- `B4`
- `C7`
- `Orcamento.md`
- `V0.2`
- `V0.3`
- `api-acos-vital`
- `api-comercial`
- `av-hub`
- `av-hub/api-comercial`
- `core_comercial/index.js`
- `d6dc1a6`
- `develop`
- `orcamento.route.js:140-312`

## regras e linhas de conteúdo (33)

- O vendedor monta a proposta e tenta preencher o custo com o que conseguiu. Ele não é dono do dado, mas decide o valor que põe. `V0.2`
- Se precisa de referência, ele abre a página do produto: histórico de preços, melhores fornecedores com nota, flutuação e valor médio. É só leitura. `B2`
- Se não tem o dado, ele pede o custo de um item ao Orçamento. Não há prazo fixo: o sistema só cronometra o tempo. O vendedor segue trabalhando. `B3`
- O orçamentista assume o pedido, cota com fornecedores e responde com uma oferta. O custo aparece na proposta. Se nenhum fornecedor serve, o pedido fecha com justificativa. `B4`
- A oferta entra na base de preço e não muda mais. Para corrigir, o orçamentista invalida com motivo e lança outra. `B1`
- Quando Compras emite a ordem de compra (OC), o preço pago vira a última referência do produto. O valor correto usado na OC também deve entrar no histórico. `C7`, `B1`
- Com o custo na proposta, o sistema calcula margem e comissão estimada para o vendedor. `V0.3`
- | Orçamento (setor novo; o Moisés é uma das pessoas) | Cota com fornecedores, atualiza ofertas e responde pedidos de custo |
- | Vendedor | Consulta a página do produto, pede cotação e decide o valor que põe na proposta |
- | Compras | Dona do dado de compra. As OC efetivadas alimentam a base |
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
- ✅ Telas no `av-hub` (`develop`, menu enxuto de 27/10, N16-107 e N16-108): Pedidos de custo (Painel do Comprador e Pedido de cotação, em abas), Produtos (Catálogo, Pesquisa de materiais e Ofertas, em abas), Fornecedores, Parâmetros (custo e Telha, em abas) e Custo por item.
- 🔴 Sem API e sem banco: oferta imutável com histórico, média por período e pedido de custo existem só no `api-comercial` de teste (legado de consulta, N16-117), que será removido; falta portar para a `api-acos-vital`. Na API do Hub já há a leitura de fornecedores, vínculos, categorias e cotações (✅ `api-acos-vital` `orcamento.route.js:140-312`).
- 📝 As regras acima estão decididas.
- 🟡 Valor correto da OC (`C7`) entrando no histórico de compras.
- 🟡 Cadastro das telas em produção.
- 🔴 Página do produto para o vendedor.
- 🔴 Nota do fornecedor, ranking por categoria e volatilidade.
- 🔴 Prazo de entrega em dias.
- 🔴 Matriz de preços, com modelo e tela.
- 🔴 Cronômetro do pedido de custo no lugar do prazo.
- 🔴 Migração do módulo para a `api-acos-vital`.
- [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-1]]: Ligações · Objetivo · Quem atua (completo) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2]]: Como estava no módulo de teste do Pablo (🔴 `av-hub/api-comercial`, que será removido) · Dados 🟡 · Quem vê o quê · Orçamento visto da proposta (B2 a B4) · O que falta desenvolver · Pendências · Diagrama do subfluxo · O que foi do antigo anexo `Orcamento.md`
