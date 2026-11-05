---
tags: [sistemas, av-hub, api-acos-vital, express, sequelize, compras, torre-de-fluxo, custo]
criado: 2026-10-14
atualizado: 2026-10-29
status: vigente
dono: Gustavo (DBA)
fontes: [api-acos-vital 1654f65 (develop, 05/11), api-acos-vital 0384e89 (develop, 29/10), Dump do Avhub para referência (29.10).sql (guardado em api-acos-vital/), Dump Avhub (Esqueleto).sql de 14/10, v1 AV-Hub-API-Estado-Atual, AV-Hub-RBAC, Integracao-AvHub-MES-Especificacao-F1]
---

# AV-Hub API (`api-acos-vital`)

**Em uma frase:** é a API do av-hub. Guarda os dados de vendas e compras, aplica as permissões e conversa com o MES e o Omie. Dono: Gustavo (DBA, quem cuida do banco); o front é do Nathan ([[AV-Hub-Front]]).

## Quem usa e para quê

- **HUB (as telas):** lê e grava pedidos, requisições, ordens de compra e permissões.
- **MES:** lê os pedidos liberados, avisa que importou, envia a requisição de compra e lê o andamento dela ([[MES-Backend]]).
- **Pipeline do Omie:** pega a fila de OCs (ordens de compra) a enviar e devolve o resultado ([[Pipeline-Omie]]).
- **Módulo comercial (`/comercial/*`):** desde 28/10 a API do Hub guarda as rotas de proposta, cadastros e cliente, no lugar da `api-comercial` do Pablo (N16-111, LOG-52). A `api-comercial` virou legado só de leitura ([[API-Comercial]]).

## Como se encaixa no fluxo

- **Vendas (`V1` a `V3`):** guarda a caixa de liberação do vendedor. O MES só enxerga o que está liberado.
- **Compras (`C0` a `C5`):** recebe a requisição e controla cotação, OC, aprovação, envio ao Omie e follow-up do CCP.
- **Etapa dos itens:** a cada 90 segundos lê no MES onde cada item está e mostra ao vendedor.
- **Torre de Fluxo e custo por item:** o código está pronto aqui. O MES já publica o custo por item (`GET /itens/custo`, 27/10, só na `develop` do MES); a Torre ainda não, porque o MES não publica `/fluxo/*`.

## Regras que valem

- OC até R$ 30 mil nasce aprovada. Acima disso, só o Gerente de Compras aprova (N14-21). A Diretoria não aprova.
- Só comprador vinculado à unidade emite OC.
- Pedido já importado pelo MES não aceita mais mudança na marcação (erro 409).
- Cancelar requisição exige motivo de 3 a 500 caracteres.
- Quem age vem sempre do token de login, nunca do corpo do pedido.
- Rota sem mapa de permissão é negada por padrão.
- Marco de compra só nasce para requisição que veio do MES. A requisição criada no Compras não gera marco; o MES a vê pela referência da requisição (API-009) e depois pela referência da OC.
- Jobs novos não guardam regra em variável de ambiente. Só o job de status por item ainda faz isso.

## O que já existe e o que falta

- ✅ Liberação, requisições, OC com aprovação, follow-up e status por item.
- ✅ Custo por item: a rota, o job e o banco estão alinhados (a migration 047b está no dump de 29/10) e o MES publica `GET /itens/custo` na `develop`. O HUB tem a tela de custo por item.
- ✅ Torre de Fluxo: a rota, o job e a tela do HUB existem. 🔴 O MES não publica `/fluxo/*`, então a Torre fica vazia.
- ✅ O MES consome a referência da OC (`GET /ordens-compra/referencia`, desde 15/10, `develop` do MES) e agora a referência da requisição do Compras (API-009).
- ✅ Requisição de compra pode ser excluída (exclusão lógica, 23/10, contrato 55).
- ✅ Rotas do módulo comercial (`/comercial/*`): `me`, empresas emissoras, responsáveis, parâmetros de custo, propostas, clientes e parceiros (28 e 29/10).
- ✅ Em 05/11 (`api-acos-vital` `develop` `1654f65`) entraram: `POST /comercial/pedidos/:id/enviar-omie` (`pedidos.route.js:30`), `GET /comercial/produtos` (`produtos.route.js:42`), o corpo do `transformar` com o envio síncrono ao Omie (`propostas.route.js:597-618`, `pedidoOmie.js`), `GET /categorias?tipo=receita` (`categorias.route.js:47-57`) e `GET /compras/condicoes-pagamento/com-encargos` (`condicoes_pagamento_compras.route.js:29`). ❓ O banco dessas funções está fora do repositório (migrations de 05/11; ver [[Dump-AvHub-Teste-2026-11-04]]).
- ✅ A requisição do Compras passou a ter as travas fixas, sem a chave `COMPRAS_REQUISICAO_EXIGIR_CADASTRO`: `finalidade` obrigatória, material do cadastro da unidade e pedido de venda existente; a OC liga a trava "pedido do vínculo é da unidade da OC" (`api-acos-vital` `requisicoes_compra.route.js` e `ordens_compra.route.js`, `develop` `1654f65`).
- ✅ Escopo do vendedor (LOG-50): "sem vínculo" passa a olhar os vínculos de todas as unidades. Quem só tem vínculo em outra unidade recebe `PEDIDO_FORA_DO_ESCOPO` no detalhe e `VENDEDOR_FORA_DO_ESCOPO` na lista, em vez de `SEM_VENDEDOR_VINCULADO` (`api-acos-vital` `src/middlewares/escopoVendedor.js`, `develop` `1654f65`).
- 🟡 O limite de R$ 30 mil é provisório. Endurece depois da conversa com Compras.
- ✅ O filtro `alterado_desde` de produtos e parceiros foi corrigido em 16/10 (`38d2f74`).
- 🔴 `pessoa_vendedor` continua sem tabela (conferido no dump de 29/10).
- ❓ A rota de favoritos já falhou em setembro; não reproduzido em 14/10.
- ❓ Valor do início da liberação em produção e quais perfis abrem a Torre.

## Detalhe técnico

API do av-hub: Node (ESM) + Express 4 + Sequelize 6 + PostgreSQL (`pg`), sessão em `connect-pg-simple`, docs Scalar em `/docs` atrás de Azure AD ✅ `api-acos-vital/package.json`, `src/app.js`. Dono: Gustavo (DBA faz banco e API); o front é do Nathan ([[AV-Hub-Front]]). Banco: [[Banco-AvHub]]. Schemas: [[Schemas-Postgres]]. Selos: [[Regras-do-Vault]].

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[AV-Hub-API-Detalhe-Tecnico-1]]: Como a requisição é tratada (ordem do `app.js`) · Organização do código · Rotas do fluxo de Atividades
- [[AV-Hub-API-Detalhe-Tecnico-2]]: Funções e triggers que carregam a regra · Módulo comercial (`core_comercial`, `/comercial/*`) — contrato LOG-52, desde 28/10 · Outros módulos (resumo; detalhe nos anexos) · Variáveis de ambiente (conferidas) · Defeitos conhecidos da API
