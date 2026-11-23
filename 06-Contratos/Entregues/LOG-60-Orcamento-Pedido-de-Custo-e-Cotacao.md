---
id: LOG-60
titulo: Orçamento com dado real — pedido de custo, cotação de fornecedor, preço do produto e fornecedores
status: implementado-na-develop
autor: Nathan
data: 2026-11-17
camadas: [frontend, backend, api, sql]
donos: {frontend: Nathan, backend: Nathan, api: Nathan, sql: Gustavo}
nos_0b: [B1, B2, B3, B4]
notas_afetadas: [02-Orcamento-Base-de-Preco, 02-Orcamento-Base-de-Preco-Detalhe-Tecnico-1, 02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2, Registro-N16-167-em-diante]
depende_de: []
decisoes: [N16-07, N16-41, N16-52, N16-54, N16-55, N16-58, N16-59, N16-72, N16-168, N16-172, N16-173, N16-174, N16-191]
develop-conferida: [api-acos-vital ce4f90f, av-hub 7f0f7e2, em 2026-11-23 (adendo da busca rápida); api-acos-vital 0e9f93e, av-hub a92272a, em 2026-11-17, entrega (também na main: api-acos-vital #313, av-hub #307 f5b614a); api-acos-vital 96e83de, av-hub 4cce84b, em 2026-11-17]
tags: [contrato, orcamento, pedido-de-custo, cotacao, oferta, fornecedores, pagina-do-produto]
criado: 2026-11-17
estado-em: 2026-11-23
dono: Nathan
fontes: [conversa do Nathan com o Claude de 17/11/2026, api-acos-vital PR #312 (branch feat/orcamento-precos-produto, 6e2c584), av-hub PR #306 (branch feat/orcamento-telas, 4d6ca7f), migration 2026-11-17_orcamento_cotacoes_pedidos_custo (SQL no PR #312), banco do Docker de teste (cópia do tst de 16/11)]
---

# LOG-60 · Orçamento com dado real: pedido de custo, cotação, preço do produto e fornecedores

> **Situação em 17/11 (tarde):** ✅ implementado na `develop` e levado à `main`.
> - API: `api-acos-vital` #312 (`0e9f93e`) e release #313. Rotas: `src/schemas/core_comercial/index.js:54` (`comercial.use(solicitacoesCusto);`), `src/schemas/core_comercial/aggregates/ofertas/ofertas.route.js:141` (`router.post("/ofertas"`), `src/schemas/core_comercial/aggregates/fornecedores/fornecedores.route.js:48` (`router.get("/fornecedores"`) e `src/schemas/core/tables/produtos/produtos.route.js:285` (`router.get("/:id/precos"`). Correção do menu: `src/schemas/auth/views/vw_permissoes_usuario/vw_permissoes_usuario.route.js:82` (`telaMap.set(t.id, {`).
> - Telas: `av-hub` #306 (`a92272a`) e release #307 (`f5b614a`): `components/Orcamento/PedidosFila.tsx:41` (`export default function PedidosFila`), `components/Orcamento/ProdutoPagina.tsx:61` (`export default function ProdutoPagina`) e `app/(protected)/vendas/solicitacoes-custo/page.tsx:9` (`<PedidosFila deVendas />`).
> - Banco: a migration `2026-11-17_orcamento_cotacoes_pedidos_custo` foi aplicada pelo Gustavo e está no dump de produção de 18/11 ([[Dump-AvHub-Producao-2026-11-18]]): `04-Dados/Dumps/avhub-prd-esqueleto-2026-11-18.sql:19819` (`CREATE TABLE core_comercial.solicitacoes_custo`) e `:19065` (`CREATE TABLE core_comercial.ofertas`).
> - Adendo de 23/11 (N16-191), só na `develop` (API #329 `ce4f90f`, Hub #335): a busca de produto do "Pedir cotação" usa `GET /produtos/busca?q=&limit=` (máx. 20), com os já comprados em memória renovada a cada 10 min e o banco completando com os nunca comprados; sem migration. `src/schemas/core/tables/produtos/produtos.route.js:284` (`router.get("/busca", buscarProdutos)`); no Docker, de 0,2–2,1 s para 22–104 ms.
> - ❓ Em produção, não conferido: o deploy, o acesso do perfil de vendas (`catalogo-produtos`, `solicitacoes-custo`) e as pessoas no perfil "Orçamentos".

## 1. Resumo em linguagem simples

O Orçamento passa a ter três telas que funcionam com dado real e formam um fluxo só para o setor de orçamentistas:

1. O vendedor pede o custo de um item.
2. O orçamentista pega o pedido, registra o preço que cada fornecedor passou e responde com o escolhido.
3. O vendedor vê, lado a lado, essa cotação e o último preço pago numa compra, e **escolhe** o valor da proposta.

Também ficam prontos o histórico de preço de cada produto (última compra, média, volatilidade, fornecedores) e a ficha do fornecedor. As telas antigas, feitas sem documentação e que respondiam 503, saem do menu.

## 2. Contexto: o que deve ser feito e por quê

- **O problema hoje.** O menu Orçamento tinha 5 entradas (Pedidos de custo, Produtos, Fornecedores, Parâmetros, Custo por item), com abas para Cotação, Ofertas, Pesquisa de materiais e Telha. Quase tudo respondia 503 `RECURSO_NAO_MIGRADO`, porque o módulo de teste do Pablo (`api-comercial`) saiu do av-hub em 06/11/2026 (PR #261) e nunca chegou à `api-acos-vital` ([[02-Orcamento-Base-de-Preco]]). As tabelas de oferta e de pedido de custo também não existem no banco ([[Dump-AvHub-Teste-2026-11-04]]).
- **Quem sofre.** O setor de Orçamento, que é novo (N16-07, N16-104) e não tem onde trabalhar. E o vendedor, que não tem a quem pedir o custo nem onde ver o histórico de preço.
- **De onde vem.** O Nathan virou dono da raia 02 (N16-168). Pedido dele em 17/11/2026: telas usuais, com dado real, sem tutoriais, com fluxo contínuo e organizado.
- **Se não for feito.** O vendedor continua sem base de preço (o B2 fica 🔴), e o pedido de custo da proposta não tem para onde ir.

## 3. Onde fica no fluxo

- Nós `B1` (base de preço), `B2` (página do produto), `B3` (pedido de custo) e `B4` (cotação e resposta) do [[00-Fluxo-Mestre-0b]].
- Raia [[02-Orcamento-Base-de-Preco]] e as partes [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-1]] e [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2]].
- Liga com o `V0.2` (o vendedor preenche o custo) de [[01-Proposta-de-Venda]].

## 4. Como está hoje

| Camada | Na `develop` (17/11) | No PR |
|---|---|---|
| Banco | 🔴 Sem `ofertas` nem `solicitacoes_custo`. Só `core_comercial.parametros_custo` e as `core_compras.orc_*` (carga de 02/10, sem atualização) | 🟡 Migration nova (seção 9) |
| API | 🔴 `/suprimentos` sem rota. `/orcamento/*` lê só as `orc_*` | 🟡 Rotas da seção 8 |
| BFF | 🔴 As rotas `/solicitacoes-custo`, `/ofertas` e `/fornecedores/:id` respondem 503 | 🟡 Apontam para a API do Hub |
| Telas | 🔴 Telas do Pablo com tutorial ("Fluxo do custo", "Como funciona Suprimentos"), quase todas em 503 | 🟡 Três telas novas (seção 6) |

## 5. Regras de negócio

- **R1.** O pedido de custo **não tem prazo**. O sistema guarda `aberta_em`, `assumida_em` e `respondida_em` e mostra há quanto tempo o pedido espera. O vendedor nunca fica bloqueado (N16-58).
- **R2.** Um pedido por item, numerado `PC-AAAA-NNNN`, **só de produto do catálogo**. O item sem cadastro no Omie fica de fora: quem precisa pede o cadastro por fora ao setor responsável e, quando o produto chega pelo sync, pede o custo (N16-174).
- **R3.** O Orçamento (`painel-comprador:pode_editar`) assume, devolve à fila, registra cotação e responde. Registrar cotação num pedido livre já o assume.
- **R4.** A resposta é **uma cotação vigente** do mesmo produto, ou **"sem fornecedor"** com justificativa. Pode ser uma cotação de outro pedido que ainda vale; não precisa cotar de novo.
- **R5.** Quem pediu, ou o Orçamento, cancela o pedido aberto, com motivo.
- **R6.** A cotação **não se edita nem se apaga**. Para corrigir, invalida-se com motivo e lança-se outra, e o histórico fica inteiro (RN-130, N16-41).
- **R7.** A validade **não é fixa**: quem registra a cotação informa até quando o fornecedor garante o preço (1 dia, 10, 30, uma promoção). O campo é obrigatório e não tem padrão (N16-174, que supera os "7 dias" da N16-55 e o parâmetro por categoria da N16-72). Vigente quer dizer não invalidada e com `valida_ate` maior ou igual a hoje.
- **R8.** **Duas fontes, o vendedor escolhe** (N16-172): a página do produto mostra a cotação vigente e a última compra lado a lado, sem "valor sugerido". O vendedor responde pelo valor que põe (N16-54).
- **R9.** A última compra vem dos itens de pedidos de compra do Omie. Ficam de fora o pedido excluído, a etapa `CA` e o preço zero.
  - Preço acima de 3 vezes ou abaixo de 1/3 da mediana fica **fora da curva**; item em outra unidade fica **outra unidade**. Os dois aparecem marcados e ficam fora das contas.
  - A média é ponderada pela quantidade.
  - A volatilidade é o coeficiente de variação dos últimos 90 dias, com no mínimo 3 pontos; acima de 20% é alta (N16-55, N16-56).
- **R10.** "PÇ", "pc" e "PC" contam como a mesma unidade.
- **R11.** Quem vê o quê: o Orçamento (`painel-comprador:pode_visualizar`) vê todos os pedidos; quem só pede vê os seus.

## 6. Frontend

**Sistema:** av-hub. O menu Orçamento fica com 3 telas (N16-173).

| Tela | Rota | O que tem |
|---|---|---|
| Pedidos de custo | `/orcamento/painel-comprador` | KPIs: abertos, livres, comigo, o que espera há mais tempo e o tempo de resposta (mediana de 30 dias). Abas: Abertos, Comigo, Livres, Fechados e Todos. Busca. O pedido aberto mais antigo aparece primeiro. Botão "Novo pedido". `components/Orcamento/PedidosFila.tsx:41` (`export default function PedidosFila`) |
| Pedido de custo | `/orcamento/painel-comprador/[id]` | Ações: Assumir, Devolver à fila, Sem fornecedor e Cancelar pedido. Cartões: cotações deste pedido (com "Responder com esta"), cotações já vigentes do produto, o que foi pedido e "Quanto já pagamos" (última compra e 12 meses). `components/Orcamento/PedidoPagina.tsx:47` |
| Produtos | `/orcamento/catalogo-produtos` e `/[id]` | Lista com o último preço pago e a média de 12 meses. A página mostra as **duas fontes** (cotação vigente e última compra) nos dois primeiros números, mais média, volatilidade, compras e o gráfico mensal. Abas: Cotações, Fornecedores, Compras e Vendas. Botão "Pedir cotação" para o vendedor ou "Registrar cotação" para o orçamentista. `components/Orcamento/ProdutoPagina.tsx:61` |
| Solicitações de custo (Vendas) | `/vendas/solicitacoes-custo` | Os pedidos de custo do vendedor: a mesma lista de Pedidos de custo, com o título de Vendas; a API devolve só os dele, e o pedido abre a mesma página (para ele, só "Cancelar pedido"). A tela já estava no menu de Vendas, mas o endereço dava 404 (`e9c232e`) |
| Fornecedores | `/orcamento/fornecedores` e `/[id]` | Lista com última compra, pedidos e valor dos últimos 12 meses e cotações vigentes. Ficha com contato, produtos (último preço), compras e cotações. `components/Orcamento/FornecedorPagina.tsx:31` |

- **Saem do Orçamento:**
  - Parâmetros de custo vai para `/cadastros/auxiliares/parametros-custo` (configuração, não trabalho do dia).
  - Custo real por item vai para `/comissoes/custo-itens` (raia 15).
  - A aba Telha sai.
  - A Matriz de preços vira a aba Cotações do produto.
  - Saem também a faixa "Fluxo do custo", o guia "Como funciona Suprimentos" e as dicas e selos do menu lateral. Os componentes antigos ficam no repositório, porque branches abertas ainda os usam (BL-084).
- **Estados:** skeleton com a forma do conteúdo. Vazio com saída ("Limpar filtros", "Novo pedido"). Erro com "Tentar novamente". Sem acesso, com mensagem própria. A mensagem de erro da API (`detail`) aparece no aviso.
- **Diálogos:**
  - "Pedir cotação": produto do catálogo (busca rápida, adendo de 23/11), quantidade, unidade e observação. Produto que não aparece na busca mostra o aviso "Produto sem cadastro no Omie fica de fora: peça o cadastro ao setor responsável e depois peça o custo".
  - "Registrar cotação":
    - fornecedor do cadastro, por nome ou CNPJ, ou sem cadastro;
    - preço sem IPI, unidade, IPI, prazo em dias, **validade (obrigatória, começa vazia, não aceita data passada)**, condição de pagamento e observação.
  - Diálogo de motivo para cancelar, fechar sem fornecedor e invalidar.
- **BFF:** a lista `ROTAS` de `app/api/comercial/[...rota]/route.ts:92` passa `/solicitacoes-custo`, `/solicitacoes-custo/:id` e as ações, `/ofertas`, `/ofertas/:id/invalidar`, `/fornecedores` e `/fornecedores/:id` para a API do Hub (`api: 'hub'`).

## 7. Backend

- **Repositório:** `api-acos-vital`, módulo `core_comercial`.
  - Usa o token sempre, `asyncHandler` e `tratarErrosHttp`.
  - Dinheiro em `Decimal`, com saída em texto.
  - Entrada validada com zod.
- **Arquivos:**
  - `src/schemas/core_comercial/aggregates/solicitacoes_custo/solicitacoes_custo.route.js`;
  - `src/schemas/core_comercial/aggregates/ofertas/ofertas.route.js`;
  - `src/schemas/core_comercial/aggregates/fornecedores/fornecedores.route.js`;
  - `src/schemas/core/tables/produtos/produtos.precos.js`, com as regras R9 e R10 em `src/utils/precosProduto.js` (16 testes).
- **Concorrência:** cada ação é um `UPDATE` com a condição de estado no `WHERE`, para que dois cliques ao mesmo tempo não passem os dois. Sem linha atualizada, a API responde 409 dizendo o porquê.
- **Transação:** a criação do pedido (número e linhas) e o registro de cotação com o assumir do pedido rodam em transação.
- **Auditoria:** automática (`auth.auditoria`), mais o trigger `auth.fn_auditar_linha` nas duas tabelas novas.

## 8. API

| Método | Rota | Quem chama | Permissão (`auth.rotas_telas`) |
|---|---|---|---|
| GET | `/comercial/solicitacoes_custo` | Fila e "os meus" | `solicitacoes-custo` ou `painel-comprador`, visualizar |
| GET | `/comercial/solicitacoes_custo/:id` | Página do pedido | idem (casa por prefixo) |
| POST | `/comercial/solicitacoes_custo` | Proposta, página do produto e fila | `solicitacoes-custo:pode_criar` ou `catalogo-produtos:pode_visualizar` |
| POST | `…/:id/assumir`, `…/:id/liberar`, `…/:id/responder` | Orçamento | `painel-comprador:pode_editar` |
| POST | `…/:id/cancelar` | Quem pediu e o Orçamento | `solicitacoes-custo` ou `painel-comprador`, editar |
| GET | `/comercial/ofertas?id_produto=\|id_fornecedor=\|id_solicitacao=&situacao=vigentes\|todas` | Produto, pedido e fornecedor | `catalogo-produtos` ou `painel-comprador`, visualizar |
| POST | `/comercial/ofertas` e `/comercial/ofertas/:id/invalidar` | Orçamento | `painel-comprador:pode_editar` |
| GET | `/comercial/fornecedores` e `/comercial/fornecedores/:id` | Fornecedores | `fornecedores:pode_visualizar` |
| GET | `/produtos/precos` e `/produtos/:id/precos?meses=` | Produtos | o `GET /produtos` que já existe (catalogo-produtos, produtos, compras) |

- **Pedir custo:**
  - Request: `{ "id_proposta": null, "itens": [{ "id_produto": "<uuid>", "descricao": "…", "quantidade": "120", "unidade_medida": "KG", "observacao": "…" }] }`.
  - Response 201: `{ "solicitacoes": [{ "id", "numero": "PC-2026-0003" }], "numeros": [...] }`.
- **Fila:** `{ total, page, totalPages, limit, solicitacoes[], resumo: { abertos, livres, meus, respondidos_30d, mediana_minutos_30d, mais_antigo_minutos }, papel: { ve_todos, trabalha } }`.
- **Detalhe:** o pedido, com `pode: { assumir, liberar, cotar, responder, cancelar }`. A tela mostra só o que a API libera.
- **Registrar cotação:**
  - Obrigatórios: `id_produto` e `preco`, mais o fornecedor (`id_fornecedor` ou `fornecedor_nome`).
  - `valida_ate` é obrigatória e não pode ser antes da data da cotação (400 "informe até quando a cotação vale"). Sem `unidade`, vale a do produto.
  - Response 201: a cotação, com `situacao`, `preco_com_ipi`, `dias_para_vencer` e `outra_unidade`.
- **Responder:** `{ "id_oferta": "<uuid>" }` ou `{ "sem_fornecedor": "justificativa" }`.
- **Erros:**
  - 400 `REQUISICAO_INVALIDA` (zod).
  - 403 "Só o Orçamento trabalha no pedido de custo." e "Só o Orçamento registra e invalida cotações."
  - 404 `NAO_ENCONTRADO`: também para o pedido de outra pessoa, quando quem pede não é do Orçamento.
  - 409 `STATUS_NAO_PERMITE` ("O pedido PC-… já está respondida."), `JA_ASSUMIDO` ("… já foi assumido por …"), `COTACAO_INVALIDADA`, `COTACAO_VENCIDA` e `COTACAO_DE_OUTRO_PRODUTO`.
- **Idempotência:** pedir custo, registrar cotação e responder aceitam `Idempotency-Key`.

## 9. Banco (SQL)

Migration `2026-11-17_orcamento_cotacoes_pedidos_custo`. O texto completo está no PR #312. Ela pode rodar mais de uma vez sem erro e foi testada no Docker de teste (cópia do tst de 16/11), aplicada como `postgres`.

- **`core_comercial.solicitacoes_custo`** (nova)
  - Colunas:
    - identificação: `id`, `numero` (único), `codigo_empresa` (FK `core.unidades`);
    - origem: `id_proposta` e `id_item_proposta` (FK com `ON DELETE SET NULL`), `id_produto` (FK `core.produtos`, **obrigatório**, N16-174);
    - o item: `descricao`, `quantidade numeric(18,4)`, `unidade_medida`, `observacao`;
    - estado: `status` (`ABERTA`, `RESPONDIDA`, `SEM_FORNECEDOR`, `CANCELADA`), `id_solicitante`, `aberta_em`, `id_orcamentista`, `assumida_em`;
    - desfecho: `id_oferta_resposta` (FK `ofertas`), `justificativa`, `respondida_em`, `respondida_por`, `motivo_cancelamento`, `cancelada_em`, `cancelada_por`, `updated_at`.
  - Os `CHECK` amarram o status aos campos. Exemplo: `RESPONDIDA` exige a oferta e `respondida_em`.
  - Índices por status e abertura, por quem pediu, por proposta e por produto.
- **`core_comercial.ofertas`** (nova)
  - Colunas:
    - o quê: `id`, `id_produto` (FK, obrigatório);
    - de quem: `id_fornecedor` (FK `core.parceiros`) ou `fornecedor_nome`;
    - preço e condições: `preco numeric(18,6) > 0`, `unidade`, `ipi_pct` de 0 a 100, `prazo_entrega_dias` de 0 a 365 (o número que a nota de prazo do N16-56 pede), `condicao_pagamento`;
    - datas e origem: `data_cotacao`, `valida_ate` (≥ `data_cotacao`), `observacao`, `id_solicitacao`, `created_at`, `created_by`;
    - invalidação: `invalidada_em`, `invalidada_por`, `motivo_invalidacao`, os três juntos.
  - O trigger `trg_ofertas_imutavel` (`core_comercial.fn_oferta_imutavel`) só deixa invalidar, uma vez, e recusa `DELETE`.
- **`auth.rotas_telas`:** 14 linhas para as rotas da seção 8.
- **`auth.telas`:**
  - Pedidos de custo, Produtos e Fornecedores ficam nas ordens 1, 2 e 3.
  - `parametros-custo` vai para `cadastros/auxiliares` e `custo-itens` para `comissoes`.
  - `matriz-precos` fica `ativo = false`.
- **`auth.permissoes`:** o perfil "Orçamentos" recebe `painel-comprador` (visualizar, criar, editar), `catalogo-produtos` e `fornecedores` (visualizar).
- **Desfazer (down):**
  - Voltar as linhas de `auth.telas` (nome, ordem, pai, ativo).
  - Apagar as 14 linhas novas de `auth.rotas_telas`.
  - `DROP TABLE core_comercial.ofertas, core_comercial.solicitacoes_custo CASCADE` e `DROP FUNCTION core_comercial.fn_oferta_imutavel`, só se ainda não houver dado de produção.
- **Dados existentes:** nenhuma carga. A base de compras já existe (`pedidos_compras` e `pedidos_compras_itens`, gravadas pela pipeline).

## 10. Permissões e perfis

| Perfil | O que faz |
|---|---|
| Orçamentos (orçamentista) | Tudo: fila, pedido, cotação, produtos e fornecedores (pela migration) |
| Vendedor / Vendas | 🔴 **Falta configurar em produção:** `catalogo-produtos` (visualizar), para ver a página do produto e pedir cotação, e `solicitacoes-custo` (criar e editar), para acompanhar e cancelar os seus. Fica com o Gustavo, porque os perfis de produção são outros. No Docker, o perfil Vendas recebeu esse acesso e foi testado: o menu mostra Orçamento › Produtos e Vendas › Solicitações de custo |
| Compras, Gerência | Leitura, conforme os perfis (2.ª tabela da [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2]]) |

## 11. Integrações afetadas

- **Omie e pipeline:** nada muda. A API só lê `core.parceiros`, `core.produtos`, `pedidos_compras` e `pedidos_compras_itens`, gravados pela `omie-elt-pipeline`.
- **MES:** nenhuma.

## 12. Critérios de aceite

- [ ] **Banco:** a migration aplicada no tst e em produção; as duas tabelas existem; `UPDATE` de preço numa oferta falha com "A cotação gravada não muda".
- [ ] **API:** as rotas da seção 8 respondem na `develop` com token. Sem a migration, respondem 403 `ROTA_SEM_PERMISSAO_MAPEADA`.
- [ ] **Frontend:**
  - o menu Orçamento mostra só Pedidos de custo, Produtos e Fornecedores;
  - nenhuma das três telas responde 503;
  - Parâmetros de custo abre em Cadastros › Auxiliares e Custo real por item em Comissões.
- [ ] **Fluxo:** o pedido criado pelo vendedor aparece na fila do Orçamento, é assumido, recebe cotação, é respondido, e a cotação aparece na página do produto ao lado da última compra.

## 13. Como testar

**Roteiro automático:** `docker-teste/scripts/testes-orcamento.mjs` (fora dos repositórios, na pasta do ambiente de teste). Ele roda contra a API local (`localhost:3012`) e o banco do Docker, com quatro usuários: `teste.orcamentos`, `teste.vendas`, `teste.comprador` e `teste.admin`. Em 17/11: **95 de 95 passaram**.

| Grupo | Casos | O que confere |
|---|---|---|
| Acesso | 4 | Sem token dá 401; o Comprador, sem as telas, recebe 403 na fila, na cotação e em Fornecedores |
| Produtos | 8 | Lista, busca "tubo a106 sch40", alcance, página do produto (3 e 12 meses e tudo), 404 |
| Fornecedores | 8 | Lista, busca por CNPJ, ordem por valor, alcance, ficha (contagem de produtos), 404 e 400 |
| Pedido (vendedor) | 16 | Criar; sem produto, quantidade zero e sem itens dão 400; produto inexistente dá 404; `Idempotency-Key` não duplica; vê só os seus; o de outra pessoa dá 404; não assume nem cota (403); cancela o seu (motivo curto dá 400, cancelar de novo dá 409) |
| Orçamento | 10 | Fila e resumo; aba Livres; busca pelo número; assumir; já assumido dá 409 `JA_ASSUMIDO`; devolver à fila; **dois assumindo ao mesmo tempo: um 200 e um 409** |
| Cotação | 25 | 10 validações (validade vazia ou passada, preço, IPI, prazo, fornecedor, produto); preço com IPI (100,50 + 5% = 105,5250); unidade do produto por padrão e "outra unidade"; fornecedor sem cadastro; registrar assume o pedido; vigentes da mais barata para a mais cara; invalidar e invalidar de novo (409) |
| Responder | 17 | Invalidada, vencida e de outro produto dão 409 com o código; o vendedor não responde (403); responder de novo, cancelar respondido e cotar em pedido fechado dão 409; "sem fornecedor"; o Orçamento cancela pedido de outra pessoa; o vendedor vê a resposta |
| Banco | 7 | Editar, apagar ou mexer em cotação invalidada é recusado; `RESPONDIDA` sem cotação é recusado (CHECK); produto obrigatório; validade antes da cotação é recusada; a auditoria grava |

**Pelas telas**, no Hub local:
- **Admin:**
  - Fila, pedido, produto (abas Cotações, Fornecedores, Compras e Vendas), Fornecedores e ficha, Parâmetros em Cadastros e Custo real em Comissões.
  - Nada deu erro, e o console ficou limpo.
- **Vendedor (`teste.vendas`):**
  - Pediu cotação pela página do produto (PC-2026-0009) e vê só "Pedir cotação", sem "Registrar" nem "Invalidar".
  - No pedido, só "Cancelar pedido".
  - Em Vendas › Solicitações de custo, só os pedidos dele.

**Defeitos achados nos testes e corrigidos nos PRs:**
1. **Menu com endereço errado** (`api-acos-vital` `b3b670e`, `/permissoes_usuario/menu`).
   - O problema: a tela permitida sem a tela-mãe subia para a raiz, e o front montava o endereço sem o pai. O "Produtos" do vendedor levava a `/catalogo-produtos` e o "Vendedores" a `/vendedores`, os dois com 404.
   - A correção: o menu passa a trazer o ancestral que falta como grupo, sem permissão própria.
   - O defeito já existia antes do Orçamento e vale para qualquer perfil.
2. **`/vendas/solicitacoes-custo` sem página** (`av-hub` `e9c232e`). A tela já estava no menu de Vendas e dava 404.

## 14. Ordem de implementação e responsáveis

1. **Banco:** o Gustavo revisa e aplica a migration no tst e na produção.
2. **API (Nathan):** o PR #312 entra na `develop`.
3. **Front (Nathan):** o PR #306 entra na `develop`, **no mesmo deploy**, porque muda os endereços de Parâmetros e Custo real por item.
4. **Perfis:** o Gustavo libera o vendedor (seção 10).
5. **Proposta (Robert):** o "Solicitar custo" do item e a cotação ao lado do custo usam `POST /comercial/solicitacoes_custo` com `id_proposta` e `id_item_proposta`. Hoje o `solicitarCusto` (`services/comercial/propostas.ts`) e o `SolicitacoesProposta` existem, mas nenhuma tela os usa.

## 15. Riscos, rollback e perguntas em aberto

- **Risco: deploy separado.** O front sem a migration deixa o menu velho apontando para endereços que mudaram, e as rotas novas dão 403.
- **Risco: fornecedor por unidade.** O mesmo fornecedor tem uma linha em `core.parceiros` por unidade (AV, AU, HRM), então aparece mais de uma vez na lista. A unidade vai junto em cada linha.
- **Rollback:** reverter os dois PRs e rodar o down da seção 9.
Respondidas pelo Nathan em 17/11/2026 (N16-174):
- **E-mail de cotação aos fornecedores:** não volta. O orçamentista pede o preço por fora e registra a cotação no pedido.
- **Nota e ranking do fornecedor (N16-55):** cancelados neste contrato; ficam para o futuro. O prazo em dias já fica gravado na cotação.
- **Validade:** não é fixa; quem registra define (R7).
- **Item sem cadastro:** fica de fora (R2).

## 16. Impacto no vault quando for entregue

- [[02-Orcamento-Base-de-Preco]]:
  - "O que já existe e o que falta": passam a ✅ a página do produto (B2), o pedido de custo com cronômetro (B3), a oferta imutável com histórico (B1, B4) e o prazo de entrega em dias **na oferta**;
  - continua 🔴 o perfil do vendedor; a matriz como tela própria sai (vira a aba Cotações, N16-173); a nota e o ranking do fornecedor ficam para o futuro (N16-174);
  - a tabela "Telas" da parte 1 muda para as 3 telas.
- [[02-Orcamento-Base-de-Preco-Detalhe-Tecnico-2]]: os itens 1, 2, 4 (parte), 5, 7 e 8 de "O que falta desenvolver".
- [[Onde-Estamos]] e a porcentagem da raia 02.
