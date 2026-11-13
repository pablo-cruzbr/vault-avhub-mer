---
id: LOG-57
titulo: Compra acima do cotado na proposta, aprovação do vendedor e lista de Compras (C8)
status: parcial
autor: Nathan
data: 2026-11-11
camadas: [frontend, backend, api, sql]
donos: {frontend: Nathan, backend: Gustavo, api: Gustavo, sql: Gustavo}
nos_0b: [C8]
notas_afetadas: [06-Circuito-de-Compra, 06-Circuito-de-Compra-Detalhe-Tecnico-2, Estados-e-Status, 15-Custo-Real-e-Comissao, Backlog-por-Frente]
depende_de: [API-019, BL-078]
decisoes: [N16-159, N16-17, N16-60, N16-61, N16-62, N16-63, N16-64, N16-65, N16-66, N16-67, N16-73, N16-76, N16-102, N16-157]
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13; api-acos-vital 637f183, av-hub d0e8f8f, em 2026-11-11; api-acos-vital bebca52, em 2026-11-12, a entrega do Gustavo; av-hub a43befe, em 2026-11-12, o front (PR #283)]
tags: [contrato, compras, c8, divergencia, vendedor, meus-pedidos]
criado: 2026-11-11
estado-em: 2026-11-13
dono: Nathan
fontes: [06-Circuito-de-Compra-Detalhe-Tecnico-2 (regras 16 a 20 e item 12 de "O que falta"), Registro-de-Decisoes N16-60 a N16-67, N16-73, N16-76 e N16-102, Estados-e-Status (divergencias_compra), escolhas do Nathan de 11/11/2026 (OC espera; só PV de proposta nesta etapa; diferença de custo agora e margem considerada com o BL-078), api-acos-vital develop 637f183, av-hub develop d0e8f8f, "Relatório de entrega de Gustavo de 12/11/2026 (LOG-57), conferido na develop bebca52 e no dump de teste de 12/11", "Relatório de entrega de Gustavo de 13/11/2026 (LOG-57, LOG-58 e SQL-022: respostas e log58b)", Dump-AvHub-Teste-2026-11-13]
---

# LOG-57 · Compra acima do cotado na proposta, aprovação do vendedor e lista de Compras (C8)

## 1. Resumo em linguagem simples

Quando Compras emite uma OC por um preço maior que o custo que o vendedor cotou na proposta, a margem e a comissão do vendedor caem. Com este contrato, cada item comprado acima do cotado abre uma **divergência** para o vendedor do pedido, que aprova ou reprova na tela **Meus Pedidos**. A OC **espera** a resposta e não vai ao Omie antes. Se o vendedor reprova, o caso entra numa **lista de Compras**, que leva à Gerência na conversa e registra a solução. Compra mais barata que o cotado só avisa o vendedor.

## 2. Contexto: o que deve ser feito e por quê

- **O problema hoje.** Compras avisa o vendedor por e-mail, à mão, com cópia para a Gerência e a Controladoria (N16-62, prints do PV 27824). Nada fica registrado no sistema, a OC segue sem esperar o vendedor e ninguém sabe quais casos estão parados.
- **Quem sofre.** O vendedor, que perde margem e comissão sem ter decidido (N16-60); Compras, que controla os casos por e-mail; a Controladoria, que não tem o histórico.
- **De onde vem.** N16-60 a N16-67, N16-73 e N16-76 (fluxo confirmado em 22/10), regras 16 a 20 e item 12 de "O que falta" da raia 06 ([[06-Circuito-de-Compra-Detalhe-Tecnico-2]]). Raia do Nathan desde a N16-157.
- **Escolhas do Nathan em 11/11/2026 (N16-159):** (1) a OC espera a decisão do vendedor e não vai ao Omie antes; (2) nesta etapa, só o pedido que nasceu de proposta, com o valor cotado vindo do API-019; o pedido digitado no Omie (N16-102, valor de referência informado por Compras) fica para uma segunda etapa; (3) a primeira versão mostra a margem da proposta e a diferença de custo, e a margem considerada entra quando o motor da comissão estiver na API (BL-078).
- **Se não for feito.** O `C8` continua por e-mail, a comissão cai sem a decisão do vendedor e a Controladoria decide sem histórico.

## 3. Onde fica no fluxo

Nó `C8` do [[00-Fluxo-Mestre-0b]], raia [[06-Circuito-de-Compra]]. Lê o cotado da raia [[01-Proposta-de-Venda]] (pelo API-019) e alimenta a comissão da raia [[15-Custo-Real-e-Comissao]]. O vendedor responde em Meus Pedidos (N16-64).

## 4. Como está hoje

- **Banco.** ✅ **Aplicado no teste em 12/11** ([[Dump-AvHub-Teste-2026-11-12]]): as duas tabelas, a coluna, a view `vw_divergencias_compra` e as funções da seção 9. Até o dump de 10/11 não existia `core_comercial.divergencias_compra` ([[Banco-AvHub]]). Os estados `PENDENTE`, `APROVADO`, `REPROVADO`, `RESOLVIDO` e os tipos de solução estão só no desenho ([[Estados-e-Status]]). O cotado por item existe em `core_comercial.propostas_itens.preco_unit_compra`.
- **API.** ✅ Entregue pelo Gustavo em 12/11 (`bebca52`). As cinco rotas da seção 8 exigem token de usuário: `GET /compras/divergencias` e `POST /compras/divergencias/{id}/solucao` (`api-acos-vital` `src/schemas/core_comercial/tables/divergencias_compra/divergencias_compra.route.js:147`, `comprasDivergencias.get("/"`; `:167`, `comprasDivergencias.post("/:id/solucao"`), `GET /meus-pedidos/divergencias` (`:200`, `meusPedidosDivergencias.get("/"`) e as decisões do vendedor (`:235`, `meusPedidosDivergencias.post("/:id/aprovar"`; `:237`, `meusPedidosDivergencias.post("/:id/reprovar"`). A OC é emitida em `POST /compras/ordens` (`src/schemas/core_vendas_faturamento/tables/ordens_compra/ordens_compra.route.js:935`, `router.post("/"`), que gera as divergências (`:1206`, `fn_divergencias_compra_gerar(:id)`); o `PATCH /compras/ordens/{id}` (`:1227`, `router.patch("/:id"`) dá `409 DIVERGENCIA_PENDENTE` com divergência aberta (`:1305`, `codigo: "DIVERGENCIA_PENDENTE"`). Estados da OC: `rascunho`, `aguardando_aprovacao`, `aprovado` e `cancelado` (`:94`, `const STATUS`).
- **Front.** ✅ Entregue pelo Nathan em 12/11 (`av-hub` PR #283). A emissão pede o motivo do item acima do cotado (`av-hub` `components/Compras/FecharCompra/CotacaoDaProposta.tsx:85`, `value={item.motivo_divergencia ?? ''}`) e avisa que a OC vai esperar; Meus Pedidos tem "Para você responder" e os avisos (`app/(protected)/vendas/meus-pedidos/page.tsx:9`, `topo={<DivergenciasDoVendedor />}`); Compras · Divergências lista e registra a solução (`app/(protected)/compras/divergencias/page.tsx:8`, `<DivergenciasLista />`); o detalhe da OC mostra por que ela não aprova (`components/Compras/OrdemDetalhe.tsx:209`, `<DivergenciasDaOrdem`).

## 5. Regras de negócio

- **R1. Quando nasce.** Na emissão da OC, para cada item ligado a um item de PV que nasceu de proposta com `preco_unit_compra` preenchido, a API compara o valor unitário do item da OC (com desconto, em reais, na mesma unidade de medida da cotação) com o cotado. Acima: nasce uma divergência `PENDENTE` (N16-60, N16-63: sem tolerância). Abaixo: nasce uma divergência `INFORMATIVA` (N16-65). Igual, unidade diferente, moeda estrangeira ou PV sem proposta: nada (escolha 2).
- **R2. Por produto.** Uma divergência por item de OC e item de PV. Uma OC com itens de vendedores diferentes avisa cada um (N16-63).
- **R3. A OC espera.** OC com divergência `PENDENTE` ou `REPROVADO` nasce em `aguardando_aprovacao` (mesmo abaixo do limite de aprovação), não pode ir para `aprovado` e não entra na fila do Omie. O `PATCH` para `aprovado` responde `409 DIVERGENCIA_PENDENTE` (escolha 1, N16-61).
- **R4. O vendedor decide.** O vendedor do PV (o responsável do pedido do Hub) aprova ou reprova cada divergência `PENDENTE`, sem prazo (N16-63). Reprovar pede um comentário curto, opcional. Ninguém mais aprova no lugar dele.
- **R5. Aprovada.** A divergência vai a `APROVADO`. Sem outra pendente ou reprovada na OC, ela volta ao fluxo de hoje: se o valor está abaixo do limite, a API a aprova como faria na emissão; se não, segue para a aprovação de Compras (N16-61).
- **R6. Reprovada.** A divergência vai a `REPROVADO` e entra na lista de Compras (N16-73). A Gerência decide na conversa física, sem botão (N16-66).
- **R7. Solução de Compras.** Compras registra a solução de uma divergência `REPROVADO`, com motivo obrigatório: `MANTIDO` (a Gerência autorizou: a OC segue como em R5); `NOVO_VALOR` ou `NOVO_FORNECEDOR` (Compras cancela a OC e emite outra, que passa de novo por R1); `PEDIDO_CANCELADO` (a OC é cancelada e o cancelamento do pedido segue N16-68 a N16-71). A divergência vai a `RESOLVIDO` e o vendedor vê a solução em Meus Pedidos (N16-65, N16-67).
- **R8. O que o aviso mostra** (N16-62): PV e OC, produto, valor cotado e valor da compra, diferença em R$ e %, fornecedor da OC com o prazo e a condição de pagamento, o **motivo escrito por Compras** (obrigatório quando a compra passa do cotado) e a **margem da proposta**. A **margem considerada** entra com o BL-078 (escolha 3).
- **R9. Motivo na emissão.** Quando algum item passa do cotado, a tela da OC pede o motivo por item antes de emitir; a API recusa a OC sem ele (`400 MOTIVO_DIVERGENCIA_OBRIGATORIO`).
- **R10. Histórico.** Cada passo guarda quem, quando e o quê. O tempo em cada estado é medido (N16-66, N16-73).
- **R11. OC cancelada.** As divergências `PENDENTE` ou `REPROVADO` da OC cancelada vão a `RESOLVIDO` com solução `OC_CANCELADA`, sem ação do vendedor.

## 6. Frontend

- **Tela da OC** (`/compras/nova`, `/compras/nova/[requisicaoId]`, sobre o API-019): no item acima do cotado, o campo obrigatório **"Motivo da compra acima do cotado"** (R9). O resumo da OC diz **"Esta OC vai esperar o vendedor aprovar N item(ns) acima do cotado"**.
- **Detalhe da OC** (`/compras/ordem/[id]`): a lista das divergências da OC com o estado de cada uma. Com `PENDENTE` ou `REPROVADO`, o botão "Aprovar" fica desabilitado com o texto **"Esperando o vendedor"** ou **"Reprovada pelo vendedor: veja em Divergências"**.
- **Meus Pedidos** (`/vendas/meus-pedidos`): no topo, **"Para você responder"**, com as divergências `PENDENTE` do vendedor logado (R8), e os botões **"Aprovar a compra"** e **"Reprovar"** (com comentário). Abaixo, **"Avisos"**: as `INFORMATIVA` e as `RESOLVIDO` dos últimos 30 dias, com a solução. Sem pendência, a seção não aparece.
- **Compras · Divergências** (`/compras/divergencias`, nova): lista com filtro por estado (padrão `REPROVADO`), unidade e comprador; colunas PV, OC, produto, vendedor, cotado, compra, diferença, estado e há quanto tempo; ação **"Registrar solução"** (tipo e motivo, R7). Item novo no menu de Compras.
- **Estados:** carregando, vazio ("Nenhuma divergência para tratar"), erro com a mensagem da API.
- **BFF:** rotas novas em `app/api/compras/divergencias/` (lista, solução) e `app/api/meus-pedidos/divergencias/` (lista do vendedor, aprovar, reprovar), com `requirePermission` (seção 10).

## 7. Backend

- **Repositório:** `api-acos-vital`, módulo novo `src/schemas/core_comercial/tables/divergencias_compra/` e ajuste em `ordens_compra.route.js`.
- **Na emissão (`POST /compras/ordens`):** na mesma transação da OC, calcula R1 por item, grava as divergências e, se houver `PENDENTE`, grava a OC em `aguardando_aprovacao` (R3). Recusa sem motivo (R9).
- **No `PATCH /compras/ordens/{id}`:** recusa `aprovado` com divergência aberta (R3); no `cancelado`, aplica R11.
- **Na decisão do vendedor:** confere que o usuário é o responsável do PV; aplica R5 na mesma transação (aprova a OC sozinha quando o valor está abaixo do limite e não há outra aberta).
- **Fila do Omie:** a OC só entra quando sai de `aguardando_aprovacao` para `aprovado`; não muda nada no envio.
- **Logs e auditoria:** cada mudança de estado em `core_comercial.divergencias_compra_eventos` (R10).

## 8. API

| Método | Rota | Quem chama | Perfil/permissão |
|---|---|---|---|
| GET | `/compras/divergencias?estado=&codigo_empresa=&id_ordem_compra=` | Compras | tela `compras-divergencias`, visualizar |
| POST | `/compras/divergencias/{id}/solucao` | Compras | tela `compras-divergencias`, editar |
| GET | `/meus-pedidos/divergencias?estado=` | vendedor | tela `meus-pedidos`, visualizar; só as do próprio vendedor |
| POST | `/meus-pedidos/divergencias/{id}/aprovar` | vendedor | tela `meus-pedidos`; só o responsável do PV |
| POST | `/meus-pedidos/divergencias/{id}/reprovar` | vendedor | idem |

- **Item de resposta (as duas listas):**

```json
{
  "id": "…uuid…",
  "tipo": "ACIMA",
  "estado": "PENDENTE",
  "numero_pedido_venda": "29853",
  "numero_pedido_hub": "PV-000003",
  "numero_proposta": "CO-AV2026-0010-R00",
  "id_ordem_compra": "…uuid…",
  "numero_ordem_compra": "OC-000013",
  "codigo_produto": "CHAPA12150135A36",
  "descricao_produto": "…",
  "unidade_medida": "M2",
  "valor_cotado": 120.0,
  "valor_compra": 130.0,
  "diferenca": 10.0,
  "diferenca_pct": 8.3,
  "quantidade": 35,
  "diferenca_total": 350.0,
  "margem_proposta_pct": 18.4,
  "margem_considerada_pct": null,
  "fornecedor": "ACOCIL …",
  "condicao_pagamento": "30 dias",
  "data_previsao_chegada": "2026-11-30",
  "motivo_compras": "Único fornecedor com o material em estoque",
  "vendedor": { "id": "…", "nome": "…" },
  "comprador": { "id": "…", "nome": "…" },
  "decidido_por": null, "decidido_em": null, "comentario_vendedor": null,
  "solucao_tipo": null, "solucao_motivo": null, "resolvido_por": null, "resolvido_em": null,
  "criado_em": "2026-11-11T20:00:00Z",
  "dias_no_estado": 0
}
```

- **Request das ações:** `aprovar` sem corpo; `reprovar` `{ "comentario": "texto opcional, até 500" }`; `solucao` `{ "tipo": "MANTIDO|NOVO_VALOR|NOVO_FORNECEDOR|PEDIDO_CANCELADO", "motivo": "obrigatório, até 1000" }`.
- **Emissão da OC:** o item de `POST /compras/ordens` aceita `motivo_divergencia` (texto, até 1000), obrigatório quando R1 der `ACIMA`.
- **Erros:** `409 DIVERGENCIA_PENDENTE` "A OC espera o vendedor aprovar a compra acima do cotado"; `409 DIVERGENCIA_ESTADO` "A divergência não está mais pendente"; `403 NAO_E_O_VENDEDOR` "Só o vendedor do pedido decide esta divergência"; `400 MOTIVO_DIVERGENCIA_OBRIGATORIO` "Item N: escreva o motivo da compra acima do cotado"; `400 SOLUCAO_INVALIDA`.
- **Idempotência:** aprovar ou reprovar de novo responde `409 DIVERGENCIA_ESTADO`, sem efeito.

## 9. Banco (SQL)

> [!info] Aplicado no banco de teste (dump de 12/11)
> Está no [[Dump-AvHub-Teste-2026-11-12]]: `divergencias_compra` (`:17909`), `divergencias_compra_eventos` (`:18039`), `ordens_compra_itens.motivo_divergencia` (`:19223`), `vw_divergencias_compra` (`:19278`), `fn_divergencias_compra_gerar` (`:2748`), `fn_divergencia_compra_decidir` (`:2541`) e `fn_oc_liberar_apos_divergencia` (`:3139`), com os três índices pedidos. O texto abaixo diz o que está no banco desde 13/11 (Gustavo), igual no [[Dump-AvHub-Teste-2026-11-13]]. Falta a produção.

- **`core_comercial.divergencias_compra`** (nova): `id uuid PK`, `codigo_empresa uuid NOT NULL`, `numero_pedido_venda varchar(30) NOT NULL`, `codigo_empresa_pv uuid NOT NULL` (a unidade do PV do vínculo), `codigo_produto_pv varchar(60) NOT NULL` (igual ao vínculo), `id_pedido_hub uuid` (FK `pedidos_venda`), `id_proposta_item uuid` (FK `propostas_itens`), `id_ordem_compra uuid NOT NULL` (FK), `id_ordem_compra_item uuid NOT NULL` (FK; único junto com o PV: `uq_divergencias_compra_item_pv` em `(id_ordem_compra_item, codigo_empresa_pv, numero_pedido_venda, codigo_produto_pv)`, porque um item da OC pode atender vários PVs), `tipo varchar(12) NOT NULL CHECK (tipo IN ('ACIMA','ABAIXO'))`, `estado varchar(12) NOT NULL CHECK (estado IN ('PENDENTE','APROVADO','REPROVADO','RESOLVIDO','INFORMATIVA'))`, `valor_cotado numeric(15,4) NOT NULL`, `valor_compra numeric(15,4) NOT NULL`, `unidade_medida varchar(10)`, `quantidade numeric(15,4)`, `margem_proposta_pct numeric(9,4)`, `margem_considerada_pct numeric(9,4)` (nula até o BL-078), `motivo_compras text`, `id_vendedor uuid NOT NULL`, `decidido_por uuid`, `decidido_em timestamptz`, `comentario_vendedor text`, `solucao_tipo varchar(20) CHECK (solucao_tipo IN ('MANTIDO','NOVO_VALOR','NOVO_FORNECEDOR','PEDIDO_CANCELADO','OC_CANCELADA'))`, `solucao_motivo text`, `resolvido_por uuid`, `resolvido_em timestamptz`, `created_at`, `updated_at`.
- Índices: `(id_vendedor, estado)`, `(estado, codigo_empresa)`, `(id_ordem_compra)`.
- **`core_comercial.divergencias_compra_eventos`** (nova): `id`, `id_divergencia` (FK), `de_estado`, `para_estado`, `por uuid`, `em timestamptz`, `detalhe jsonb` (R10).
- **`ordens_compra_itens.motivo_divergencia text`** (nova, nula).
- **Migration:** up cria as duas tabelas e a coluna; down as remove. Aplicada pelo Gustavo no teste e depois na produção (N16-155: o SQL fica com o DBA, fora do repositório).
- **Dados existentes:** nenhuma carga; vale para OCs emitidas depois.
- **Estados:** acrescenta `INFORMATIVA` e a solução `OC_CANCELADA` ao que está em [[Estados-e-Status]].

## 10. Permissões e perfis

- Tela nova `compras-divergencias` (Comprador e Gerência de Compras: ver e editar). Linhas novas em `auth.rotas_telas` para as cinco rotas.
- Vendedor: as rotas de Meus Pedidos usam a tela `meus-pedidos` e o escopo do próprio vendedor (só as divergências em que ele é `id_vendedor`).
- A Gerência (João Vitor, Sérgio Vital) e a Controladoria não ganham botão (N16-66); podem ver a lista de Compras se o perfil tiver a tela.

## 11. Integrações afetadas

- **Omie:** a OC com divergência aberta não entra na fila de envio (R3); o envio em si não muda.
- **MES:** nenhuma. A OC em `aguardando_aprovacao` já não aparece na referência como aprovada.
- **Comissão:** a divergência aprovada é a fonte do "aprovado pelo vendedor" no custo real (raia 15); a margem considerada vem do BL-078.

## 12. Critérios de aceite

- [x] Banco: as duas tabelas e a coluna existem no teste, com os `CHECK` da seção 9.
- [x] API: OC com item acima do cotado nasce em `aguardando_aprovacao` e com a divergência `PENDENTE`; sem motivo, `400 MOTIVO_DIVERGENCIA_OBRIGATORIO`.
- [x] API: `PATCH` para `aprovado` com divergência aberta dá `409 DIVERGENCIA_PENDENTE`.
- [x] API: o vendedor do PV aprova e a OC abaixo do limite fica `aprovado`; outro usuário recebe `403 NAO_E_O_VENDEDOR`.
- [x] API: reprovar leva à lista de Compras; `MANTIDO` libera a OC; cancelar a OC resolve as abertas com `OC_CANCELADA`.
- [x] API: item abaixo do cotado gera `INFORMATIVA` e não segura a OC.
- [x] Frontend: Meus Pedidos mostra "Para você responder" e "Avisos"; Compras · Divergências lista e registra a solução; o detalhe da OC mostra por que não aprova.

## 13. Como testar

1. **Acima, aprovado:** PV 29853 (proposta `CO-AV2026-0010-R00`, cotado R$ 120,00/M2). OC de R$ 125,00/M2 com motivo. Ela nasce `aguardando_aprovacao` e não vai ao Omie. O vendedor aprova em Meus Pedidos; a OC (abaixo de R$ 30 mil) fica `aprovado` e entra na fila.
2. **Acima, reprovado:** o mesmo com R$ 140,00. O vendedor reprova; o caso aparece em Compras · Divergências; Compras registra `MANTIDO` com motivo; a OC segue.
3. **Abaixo:** R$ 110,00. Nada segura a OC; o vendedor vê o aviso.
4. **Limite:** igual a R$ 120,00, ou em KG: nada nasce.

## 14. Ordem de implementação e responsáveis

1. **Banco (Gustavo):** ✅ tabelas e coluna (aplicadas no teste em 12/11, [[Dump-AvHub-Teste-2026-11-12]]; produção pendente).
2. **API (Gustavo):** ✅ emissão, `PATCH`, as cinco rotas (12/11, `bebca52`; 83 verificações no relatório de entrega).
3. **Front (Nathan):** ✅ motivo na OC, detalhe da OC, Meus Pedidos e a lista de Compras (12/11, `av-hub` PR #283). Conferido contra o código da API, ainda não contra a API rodando.
4. **Comissão (Robert, BL-078):** a margem considerada, depois.

## 15. Riscos, rollback e perguntas em aberto

- **Risco:** o vendedor não responde e a compra fica parada (N16-63: "o problema é dele"). A lista de Compras mostra há quanto tempo; avaliar um lembrete depois.
- **Rollback:** a R3 não tem chave para desligar (escolha do Gustavo: sem flags). Voltar é reverter a API e rodar o down que está no cabeçalho da migration log57, que fica com o DBA (N16-155).
- **Pergunta (Nathan):** o vendedor do PV é o `id_responsavel` do pedido do Hub. Diligenciador ou auxiliar do vendedor também decide?
- **Pergunta (Nathan):** o e-mail de Compras deixa de existir (N16-64), ou a Gerência e a Controladoria ainda recebem cópia?
- **Pergunta (Gustavo, 12/11):** registrar no contrato a unicidade por item da OC × PV × produto e o `varchar(60)`? ✅ Sim (Gustavo, 13/11): a seção 9 passa a dizer o que está no banco.
- **Escolhas da entrega (Gustavo, 12/11) que diferem da seção 9 ou que ela não dizia:** a unicidade ficou por item da OC × PV × produto (`uq_divergencias_compra_item_pv`), e não só `id_ordem_compra_item`, porque um item da OC pode atender dois PVs; `codigo_produto_pv` é `varchar(60)`, igual ao vínculo, e não `varchar(30)`; há a coluna a mais `codigo_empresa_pv` (a conta Omie do PV); NOVO_VALOR, NOVO_FORNECEDOR e PEDIDO_CANCELADO cancelam a OC na mesma chamada (R7); a margem é a do item da proposta e, vazia, a margem líquida da proposta (R8); o vendedor é `pedidos_venda.id_responsavel` e, sem ele, o responsável da proposta (sem nenhum dos dois não nasce divergência, só um WARNING no log do banco); a unidade da cotação é `unidade_compra` e, vazia, a `unidade_medida` do item da proposta; a OC liberada pelo vendedor fica com `aprovado_por` nulo, como a aprovação automática.
- **Segunda etapa:** PV digitado no Omie, com o valor de referência informado por Compras (N16-102).

## 16. Impacto no vault quando for entregue

- [[06-Circuito-de-Compra]] e [[06-Circuito-de-Compra-Detalhe-Tecnico-2]]: `C8` de 🔴 a ✅; item 12 de "O que falta" sai.
- [[Estados-e-Status]]: `INFORMATIVA` e `OC_CANCELADA` ✅.
- [[15-Custo-Real-e-Comissao]]: a divergência aprovada como fonte do custo aprovado pelo vendedor.
- [[Backlog-por-Frente]]: a linha do `C8` fecha.
