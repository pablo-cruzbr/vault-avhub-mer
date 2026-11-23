---
id: LOG-58
titulo: O MES avisa o Compras no av-hub da recompra por RNC e da reabertura do recebimento
status: parcial
autor: Nathan
data: 2026-11-12
camadas: [frontend, backend, api, sql]
donos: {frontend: Nathan, backend: "Robert (MES) e Gustavo (av-hub)", api: Gustavo, sql: Gustavo}
nos_0b: [Q3, R5, C1]
notas_afetadas: [06-Circuito-de-Compra, 06-Circuito-de-Compra-Detalhe-Tecnico-2, 07-Recebimento, 08-Qualidade-Entrada, Integracao-AvHub-MES, Backlog-por-Frente]
depende_de: []
decisoes: [N16-126, N16-127, N16-135, N16-137, N16-157, N16-158]
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13; api-pcp 2e564e6, api-acos-vital 637f183, av-hub d0e8f8f, em 2026-11-12; api-acos-vital bebca52, em 2026-11-12, a entrega do Gustavo; av-hub a43befe, em 2026-11-12, o front (PR #287); api-pcp bd6b442, av-hub c6310ad, em 2026-11-13, o envio do MES (PR #80) e a recompra sem pedido (PR #294)]
tags: [contrato, compras, mes, rnc, recebimento, recompra]
criado: 2026-11-12
estado-em: 2026-11-16
dono: Nathan
fontes: [Registro-de-Decisoes N16-126, N16-127, N16-135 e N16-137, 06-Circuito-de-Compra-Detalhe-Tecnico-2 (item 7 de "O que falta" e a pendência da recompra), api-pcp develop 2e564e6 (recebimento.service.ts, circuito-compra.ts, qualidade.service.ts, prisma/models), api-acos-vital develop 637f183, "Relatório de entrega de Gustavo de 12/11/2026 (LOG-58), conferido na develop bebca52 e no dump de teste de 12/11", "Relatório de entrega de Gustavo de 13/11/2026 (LOG-57, LOG-58 e SQL-022: respostas e log58b)", Dump-AvHub-Teste-2026-11-13, PDF de Gustavo de 16/11/2026 (status dos contratos)]
---

# LOG-58 · O MES avisa o Compras no av-hub da recompra por RNC e da reabertura do recebimento

## 1. Resumo em linguagem simples

Quando a Qualidade reprova um lote comprado ou o PCP reabre um recebimento, o MES devolve a necessidade de compra ao setor Compras · CCP do próprio MES. O av-hub não fica sabendo: a OC continua "atendida" e o comprador não vê que precisa devolver e comprar de novo. Com este contrato, o MES manda um **aviso** ao av-hub, que aparece para o Compras na OC e numa lista, com o botão para abrir a **OC de recompra** já preenchida.

## 2. Contexto: o que deve ser feito e por quê

- **O problema hoje.** No MES, a reprovação na inspeção de entrada move a parte reprovada para Compras ✅ `api-pcp` `src/compras/circuito-compra.ts:253` (`export async function devolverAComprasParteReprovada(`), e a decisão `REABRIR` do PCP faz o mesmo com o recebimento ✅ `src/compras/recebimento.service.ts:636` (`if (dto.decisao === 'REABRIR') {`). Nada disso sai do MES: no av-hub a OC e a requisição seguem como estavam.
- **Quem sofre.** O comprador, que só descobre a devolução por conversa; o pedido de venda, que espera um material que ninguém está comprando.
- **De onde vem.** N16-126 (lote 100% reprovado: devolve e abre a recompra), N16-127 (o Compras é avisado no av-hub), N16-137 (a reabertura avisa pelo mesmo caminho), N16-135 (divergência contra a OC bloqueia como a da nota). Raia do Nathan desde a N16-157; a API do MES é do Robert, com o Gustavo acompanhando (N16-158).
- **Se não for feito.** A recompra depende de alguém lembrar, e o custo e o prazo do pedido ficam errados no av-hub.

## 3. Onde fica no fluxo

Nasce em `Q3` ([[08-Qualidade-Entrada]]) e em `R5` ([[07-Recebimento]]) e chega a `C1` ([[06-Circuito-de-Compra]]). O canal entre os sistemas está em [[Integracao-AvHub-MES]].

## 4. Como está hoje

- **MES.** ✅ As duas devoluções existem, como na seção 2. O lote guarda o item da OC do av-hub (`Lote.idItemOc`, `prisma/models/estoque.prisma:406`), e o recebimento sem requisição guarda a OC (`Recebimento.idOrdemCompra`, `prisma/models/compras.prisma:196`); o com requisição chega à OC pela requisição. 🔴 Nenhuma chamada ao av-hub nesses dois pontos.
- **Canal existente.** O MES lê os marcos do av-hub por polling (contrato 35) e manda a requisição por `PUT` (contrato 34). Não existe caminho do MES para o av-hub com eventos de compra.
- **av-hub.** ✅ Entregue pelo Gustavo em 12/11. Banco aplicado no teste ([[Dump-AvHub-Teste-2026-11-12]]): `core_vendas_faturamento.avisos_mes_compra` (`:23757`) e `ordens_compra.id_aviso_mes` (`:18986`); produção pendente. API na `develop` (`bebca52`): `POST /integracao/mes/avisos-compra` (`api-acos-vital` `src/schemas/core_vendas_faturamento/tables/avisos_mes_compra/avisos_mes_compra.route.js:110`, `integracaoMesAvisos.post("/"`), `GET /compras/avisos-mes` (`:161`, `comprasAvisosMes.get("/"`), `GET /compras/avisos-mes/{id}` (`:183`, `comprasAvisosMes.get("/:id"`, a mais que a seção 8, para a tela de recompra montar a OC) e `PATCH /compras/avisos-mes/{id}` (`:192`, `comprasAvisosMes.patch("/:id"`). A chave do MES abre só a rota nova (`src/middlewares/apiKeyAuth.js:119`, `const ROTA_MES_AVISOS`). A OC aceita a finalidade `recompra`, que liga ao pedido de venda (`src/schemas/core_vendas_faturamento/tables/ordens_compra/ordens_compra.route.js:98`, `const FINALIDADES_COM_PV`). Front ✅ (Nathan, 12/11, `av-hub` PR #287): faixa do aviso no detalhe da OC com "Nova OC de recompra", "Fornecedor vai substituir" e "Sem recompra" (`av-hub` `components/Compras/OrdemDetalhe.tsx:225`, `<AvisosMesDaOrdem`), cartão em Requisições (`components/Compras/ComprasRequisicoes.tsx:172`, `<AvisosMesPainel`) e a OC de recompra montada pelo `GET /compras/avisos-mes/{id}` (`components/Compras/FecharCompra/montarDoAviso.ts:22`, `getAvisoMes(avisoId)`).

## 5. Regras de negócio

- **R1. Dois avisos.** `RECOMPRA_RNC`: a Qualidade reprovou toda a quantidade ou parte de um lote comprado (N16-126). `RECEBIMENTO_REABERTO`: o PCP decidiu `REABRIR` um recebimento (N16-137).
- **R2. O que o aviso leva:** a OC e o item do av-hub, a quantidade devolvida e a unidade, o motivo (o da RNC ou o da decisão do PCP), o código da RNC ou do recebimento, o lote (se houver), o pedido de venda (se houver), quem decidiu e quando.
- **R3. A OC não muda sozinha.** O aviso não cancela nem altera a OC: o Compras decide (devolver, cobrar a substituição do fornecedor, emitir outra OC). O aviso fica `ABERTO` até o Compras tratar.
- **R4. Tratar o aviso.** O Compras escolhe: **"Nova OC de recompra"** (abre a Nova OC com finalidade `recompra`, o mesmo produto, a quantidade devolvida e o mesmo pedido de venda; ao emitir, o aviso vai a `RESOLVIDO` com a OC nova) ou **"Fornecedor vai substituir"** / **"Sem recompra"**, com motivo obrigatório. Se a OC de recompra for cancelada ou excluída depois, o aviso volta a `ABERTO`, sem o tratamento, e o Compras pode emitir outra OC de recompra; a OC cancelada guarda o `id_aviso_mes` como histórico (Gustavo, 13/11; migration `2026-11-13_log58b_aviso_volta_aberto_recompra_cancelada.sql`, no tst, [[Dump-AvHub-Teste-2026-11-13]]).
- **R5. Uma vez só.** O MES manda cada aviso com um id próprio; repetir o mesmo id não cria outro.
- **R6. Falha de envio.** Se o av-hub não responder, o MES guarda o aviso e tenta de novo, como já faz no envio da requisição (`integracao.prisma`, estados `PENDENTE`, `ENVIADO`, `RECUSADO`, `FALHOU`). A devolução no MES não espera o av-hub.
- **R7. Substituição antes da baixa.** O que acontece se a substituição chegar antes de o lote reprovado sair fisicamente segue aberto (N16-126); este contrato não muda isso.

## 6. Frontend

- **Detalhe da OC** (`/compras/ordem/[id]`): faixa em âmbar **"O MES devolveu N UN deste item: <motivo> (RNC-…)"** por aviso aberto, com os botões do R4.
- **Compras · Avisos do MES** (aba nova em `/compras/requisicoes` ou cartão no painel de Compras): lista dos avisos `ABERTO` com OC, produto, quantidade, pedido de venda, tipo, motivo e há quanto tempo.
- **Nova OC de recompra:** `/compras/nova?aviso={id}` monta a OC com finalidade `recompra`, o produto, a quantidade e o vínculo ao PV do aviso; o comprador escolhe fornecedor e valores.
- **BFF:** `app/api/compras/avisos-mes/route.ts` (lista) e `app/api/compras/avisos-mes/[id]/route.ts` (tratar), com `requirePermission('compras', ...)`.

## 7. Backend

- **MES (Robert):** nos dois pontos da seção 2, na mesma transação, grava o aviso numa fila de saída (o mesmo padrão do envio da requisição) e um job envia ao av-hub (R5, R6). Para o `RECOMPRA_RNC`, a OC vem de `Lote.idItemOc`; para o `RECEBIMENTO_REABERTO`, de `Recebimento.idOrdemCompra` ou da OC da requisição.
- **av-hub (Gustavo):** recebe, confere a chave de serviço do MES, grava o aviso e responde. A emissão da OC com `id_aviso_mes` resolve o aviso (R4).

## 8. API

| Método | Rota | Quem chama | Permissão |
|---|---|---|---|
| POST | `/integracao/mes/avisos-compra` | MES (job) | chave de serviço do MES, com a rota na lista dela |
| GET | `/compras/avisos-mes?status=&codigo_empresa=&id_ordem_compra=` | BFF | tela `compras`, visualizar |
| PATCH | `/compras/avisos-mes/{id}` | BFF | tela `compras`, editar |

- **POST (MES → av-hub):**

```json
{
  "id_aviso_mes": "…uuid do MES…",
  "tipo": "RECOMPRA_RNC",
  "id_ordem_compra": "…uuid da OC no av-hub…",
  "id_ordem_compra_item": "…uuid do item…",
  "quantidade": 4,
  "unidade_medida": "PC",
  "motivo": "Dureza fora da especificação",
  "codigo_documento": "RNC-0012",
  "codigo_lote": "LT-20261110-0003",
  "numero_pedido_venda": "28189",
  "decidido_por": "teste.qualidade",
  "decidido_em": "2026-11-12T14:00:00Z"
}
```

  Respostas: `201` criado; `200` com o mesmo aviso se o `id_aviso_mes` já existe (R5); `404 OC_NAO_ENCONTRADA`; `400` com o campo inválido.
- **PATCH (tratar):** `{ "acao": "SUBSTITUICAO" | "SEM_RECOMPRA", "motivo": "obrigatório" }`. A recompra resolve pela emissão: `POST /compras/ordens` aceita `id_aviso_mes` no cabeçalho.
- **GET:** lista com os campos do POST, mais `id`, `status`, `numero_ordem_compra`, `codigo_produto`, `descricao_produto`, `id_ordem_compra_recompra`, `tratado_por`, `tratado_em`, `motivo_tratamento`, `criado_em`.

## 9. Banco (SQL)

> [!info] Aplicado no banco de teste (dump de 12/11)
> Está no [[Dump-AvHub-Teste-2026-11-12]] com as colunas abaixo: `avisos_mes_compra` (`:23757`), `ordens_compra.id_aviso_mes` (`:18986`, única quando preenchida, `uq_ordens_compra_id_aviso_mes`), `vw_avisos_mes_compra` (`:26232`), `fn_aviso_mes_compra_registrar` (`:7295`) e `fn_aviso_mes_compra_tratar` (`:7371`). Além do índice `(status, id_ordem_compra)`, o banco tem `(id_ordem_compra, created_at DESC)`. A rota da `api-acos-vital` já está na `develop` (`bebca52`). Falta a produção e o lado do MES.

- **`core_vendas_faturamento.avisos_mes_compra`** (nova): `id uuid PK`, `id_aviso_mes uuid NOT NULL UNIQUE`, `tipo varchar(25) NOT NULL CHECK (tipo IN ('RECOMPRA_RNC','RECEBIMENTO_REABERTO'))`, `status varchar(12) NOT NULL DEFAULT 'ABERTO' CHECK (status IN ('ABERTO','RESOLVIDO'))`, `id_ordem_compra uuid NOT NULL` (FK), `id_ordem_compra_item uuid` (FK), `quantidade numeric(15,4) NOT NULL`, `unidade_medida varchar(20)`, `motivo text NOT NULL`, `codigo_documento varchar(30)`, `codigo_lote varchar(30)`, `numero_pedido_venda varchar(30)`, `decidido_por varchar(100)`, `decidido_em timestamptz`, `acao_tratamento varchar(15) CHECK (acao_tratamento IN ('RECOMPRA','SUBSTITUICAO','SEM_RECOMPRA'))`, `id_ordem_compra_recompra uuid` (FK), `motivo_tratamento text`, `tratado_por uuid`, `tratado_em timestamptz`, `created_at`, `updated_at`.
- Índices: `(status, id_ordem_compra)`.
- **`ordens_compra.id_aviso_mes uuid`** (nova, nula, FK): a OC de recompra aponta o aviso que resolveu.
- **MES:** a fila de saída do aviso, no mesmo modelo da do envio da requisição (Robert).
- Migrations com o DBA (N16-155); down remove tabela e colunas.

## 10. Permissões e perfis

Comprador e Gerência de Compras veem e tratam (tela `compras`). O CCP vê os avisos pelo follow-up, sem tratar. A rota do MES entra só na lista da chave de serviço do MES.

## 11. Integrações afetadas

- **MES → av-hub:** caminho novo, com fila e nova tentativa (R6).
- **av-hub → MES:** a OC de recompra chega ao MES pela referência de sempre (contratos 004 e 007), com destino no pedido de venda. ❓ O MES liga a parcial que voltou a Compras · CCP a essa OC nova sozinho, como faz com a OC do pedido? (pergunta ao Robert, seção 15).
- **Omie e Fiscal:** a nota de devolução ao fornecedor continua fora do sistema (`RNC.notaDevolucaoPendente`, raia 14).

## 12. Critérios de aceite

- [ ] MES: reprovar um lote de OC do av-hub e reabrir um recebimento geram um aviso cada, enviados ao av-hub; com o av-hub fora, o aviso espera e é reenviado. *13/11:* a reprovação foi testada ponta a ponta no Docker (reteste R2, ver seção 13); faltam a reabertura e o av-hub fora do ar.
- [x] API: o POST grava o aviso; repetir o `id_aviso_mes` não duplica; OC inexistente dá `404`.
- [x] Front: o detalhe da OC mostra o aviso; "Nova OC de recompra" abre a OC preenchida e, emitida, resolve o aviso; "Fornecedor vai substituir" pede motivo.
- [x] Banco: tabela e coluna como na seção 9.

## 13. Como testar

1. No Docker, emitir uma OC ligada ao PV 28189, receber no MES (lote em quarentena) e reprovar 2 PÇ na inspeção → aviso `RECOMPRA_RNC` de 2 PÇ no detalhe da OC → "Nova OC de recompra" → OC nova `recompra` de 2 PÇ ligada ao PV 28189 → aviso `RESOLVIDO`.
2. Recebimento com divergência, recontagem que continua divergindo e decisão `REABRIR` → aviso `RECEBIMENTO_REABERTO`.
3. Desligar a API do av-hub, reprovar, religar: o aviso chega depois.

✅ **Teste 1 feito no Docker em 13/11 (reteste R2, develop de 12/11):** 2 de 5 PÇ reprovadas criaram, na mesma transação, o lote filho, a RNC e o `AVISO_COMPRA` na fila; o envio saiu em 49 s (201); o Hub gravou em `avisos_mes_compra`; a OC de recompra emitida com `id_aviso_mes` resolveu o aviso (`RESOLVIDO`, `RECOMPRA`) e voltou ao MES com `oc_referencia.id_aviso_mes_origem` igual ao id do aviso. 🟡 O aviso esperou o ciclo da fila (60 s), porque a reprovação não chama `disparar()`. Os testes 2 e 3 não foram feitos.

## 14. Ordem de implementação e responsáveis

1. **Banco e API do av-hub (Gustavo):** ✅ tabela, coluna, as três rotas (mais `GET /compras/avisos-mes/{id}`) e a chave do MES (12/11, `bebca52`; 96 verificações no relatório de entrega). ✅ LOG-58b (13/11): OC de recompra cancelada reabre o aviso; migration `2026-11-13_log58b_aviso_volta_aberto_recompra_cancelada.sql` aplicada no tst (Gustavo), só banco, sem API nova.
2. **MES (Robert, com o Gustavo acompanhando, N16-158):** ✅ a fila de saída e o envio nos dois pontos (12/11, `api-pcp` PR #80): `api-pcp` `src/integracao-avhub/aviso-compra-avhub.envio.ts:68` (`export async function enfileirarAvisoRecompraRnc(`) e `:104` (`export async function enfileirarAvisosRecebimentoReaberto(`).
3. **Front (Nathan):** ✅ detalhe da OC, lista, Nova OC de recompra (12/11, `av-hub` PR #287). A recompra de aviso sem pedido de venda usa a finalidade da OC original (13/11, PR #294). Testado no Docker local; falta o teste no tst.
4. **Histórico da recompra cancelada (Gustavo na API, Nathan no front):** ✅ API entregue em 16/11 (`api-acos-vital` `57bd81d`): `src/schemas/core_vendas_faturamento/tables/avisos_mes_compra/avisos_mes_compra.route.js:138` (`recompras_canceladas: await buscarRecomprasCanceladas(id)`); testada no Docker no reteste R6 ([[Backlog-Reteste-R5-R6-2026-11-16]]: o aviso reabre e lista as canceladas; a resposta do `POST` ainda não as traz, BL-106). 🔴 Falta o front (Nathan). Decidido em 13/11 (seção 15): o `GET /compras/avisos-mes/{id}` traz as OCs de recompra canceladas do aviso, e a faixa do aviso reaberto as mostra.

**Situação em 16/11 (status do Gustavo):** banco, API, log58b e o histórico das recompras canceladas estão no tst e na `develop`. Falta a produção: log58, depois SQL-022 e log58b, e a API (fila em [[Banco-AvHub]]). Robert: o teste 2 (REABRIR) e o teste 3 (av-hub fora do ar); a reprovação não chama `disparar()`, então o aviso espera ~60 s; e a pergunta dele: a OC de recompra acha sozinha a parcial que voltou ao CCP, ou o aviso manda o id? Nathan: mostrar `recompras_canceladas` na faixa do aviso; aviso por lote ou por item da OC?; testar no tst a recompra sem pedido de venda (PR #294).

## 15. Riscos, rollback e perguntas em aberto

- **Pergunta (Robert):** a OC de recompra emitida no av-hub encontra sozinha a parcial que voltou a Compras · CCP no MES (pelo pedido de venda e pelo produto), ou o aviso precisa mandar o id da parcial para a OC nova levar de volta?
- **Pergunta (Nathan):** reprovação parcial (N16-128 é da saída; a de entrada já cinde o lote) avisa com a quantidade reprovada; confirmar que é por lote, não por item da OC.
- **Rollback:** o MES para de enviar; os avisos gravados ficam como histórico.
- **Risco:** OC cancelada ou já recomprada à mão antes do aviso chegar: o Compras trata com "Sem recompra".
- **Pergunta (Gustavo, 12/11):** se a OC de recompra for cancelada depois, o aviso deve voltar a `ABERTO`? ✅ Sim (Gustavo, 13/11): volta, pela migration log58b (R4).
- **Decidido (Nathan, 13/11), pergunta do Gustavo:** o aviso reaberto mostra que houve uma OC de recompra cancelada antes. Hoje o GET do aviso não traz esse histórico; só a OC cancelada guarda o `id_aviso_mes`. O Gustavo acrescenta a lista dessas OCs no `GET /compras/avisos-mes/{id}`, e o Nathan a mostra na faixa do aviso 🔴.
- **Escolhas da entrega (Gustavo, 12/11) que o contrato não dizia:** `ordens_compra.id_aviso_mes` aponta o `id` do aviso no av-hub (o do GET), não o `id_aviso_mes` do MES; a finalidade `recompra` não é obrigatória no banco (aviso de OC de estoque não tem PV, e `recompra` exige vínculo); a OC de recompra tem de ser da mesma unidade da OC do aviso (AV585); `id_aviso_mes` repetido com corpo diferente devolve o aviso original sem conferir (R5), com log `[LOG-58]`; OC excluída dá `404 OC_NAO_ENCONTRADA`, e o MES deve marcar o envio como recusado; além do índice `(status, id_ordem_compra)` há `(id_ordem_compra, created_at)`. A tabela aceita aviso por lote ou por item (o item é opcional), enquanto a pergunta acima não for respondida.

## 16. Impacto no vault quando for entregue

- [[06-Circuito-de-Compra]] e [[06-Circuito-de-Compra-Detalhe-Tecnico-2]]: a recompra por RNC e a reabertura saem de "O que falta".
- [[08-Qualidade-Entrada]] e [[07-Recebimento]]: o aviso ao av-hub ✅.
- [[Integracao-AvHub-MES]]: o caminho MES → av-hub de avisos de compra.
