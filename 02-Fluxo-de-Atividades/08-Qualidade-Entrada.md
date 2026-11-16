---
tags: [fluxo, raia, qualidade, qualidade-entrada, lote, rnc, quarentena, mes]
criado: 2026-10-14
estado-em: 2026-11-16
status: vigente
ordem: 8
nos: [Q1, Q2, Q3, Q4]
anterior: "[[07-Recebimento]]"
proxima: "[[09-Estoque-Entrada-do-Lote]]"
develop-conferida: [api-acos-vital e522962, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13, reteste por cliques e Da proposta à comissão; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13; api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, app-pcp 4c11886, omie-elt-pipeline master 0593c9f, em 2026-11-10; api-pcp bd6b442, em 2026-11-13 (aviso do LOG-58)]
dono: Robert (MES) · Qualidade (regra de negócio) · Nathan (decisões)
fontes: [v1 02-PRD-Estoque/Fluxo-Qualidade-Completo, v1 01-Fluxo-Operacional/Encaixe-Estoque-Revenda-no-PCP (EC-01, EC-07), api-pcp 579a625 (qualidade.service.ts, circuito-compra.ts, estoque.prisma), app-pcp 1fca8d3 (qualidade/inspecao-entrada), Registro-de-Decisoes #25 #26, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Qualidade de entrada (Q1 a Q4)

**Em uma frase:** a Qualidade inspeciona o lote que chegou do fornecedor e decide se ele entra no Estoque ou volta para Compras, para que nada comprado vire saldo sem laudo.

**Quando consultar:** dúvidas sobre a inspeção do material comprado: laudo, liberação do lote ou devolução para Compras.

**Onde estamos no fluxo:** ← [[07-Recebimento]] | [[09-Estoque-Entrada-do-Lote]] → · nós desta nota: `Q1`, `Q2`, `Q3`, `Q4`

Nós `Q1` a `Q4` do [[00-Fluxo-Mestre-0b]]. A inspeção de saída da produção é outra raia: [[11-Qualidade-Saida]]. Tudo acontece no MES (sistema de chão de fábrica).

## Como funciona, passo a passo

1. O [[07-Recebimento]] entrega o lote em quarentena (status `PENDENTE`). Ele aparece na fila da Qualidade, do mais antigo ao mais novo. O lote já tem saldo desde o recebimento, mas o disponível é 0: só lote `LIBERADO` pode ser reservado. `Q1`
2. O inspetor da Qualidade abre o lote na tela de inspeção e decide: aprova ou reprova. `Q2`
3. Para aprovar, ele anexa o laudo. Para reprovar, anexa laudo, motivo e evidência e informa a quantidade reprovada. `Q2`
4. Aprovado: o lote fica `LIBERADO`. A parcial que esperava junta-se às outras do mesmo item e volta ao Estoque ([[09-Estoque-Entrada-do-Lote]]). `E5`
5. Reprovado em parte: a quantidade reprovada vira um lote filho separado e o sistema abre a RNC (registro de não conformidade). Pela EC-07, a parte aprovada fica em quarentena até a substituição ser aprovada; 🔴 a `develop` libera a parte boa na mesma ação quando nenhuma parcial espera pelo lote (PS-053). `Q3`
6. A parte reprovada volta para Compras ([[06-Circuito-de-Compra]]), que combina com o fornecedor a devolução e a substituição. `Q3`
7. Se ainda há parcial esperando, a parte aprovada fica em quarentena até a substituição chegar. `Q4`
8. A substituição chega como nova entrega com nota, passa de novo pela inspeção e, aprovada, une-se à parte em quarentena. `Q4` → `E5`

## Exemplo

O lote de aço carbono comprado para as 100 flanges chega e fica em quarentena. O inspetor reprova uma parte. Só essa quantidade vira um lote filho, a RNC abre e Compras negocia a troca com o fornecedor. O aço aprovado espera em quarentena. Quando a reposição chega e passa na inspeção, as duas partes se unem e seguem ao Estoque. O Omie emite a nota de devolução, não o sistema.

## Quem atua

| Quem | O que faz |
|---|---|
| Inspetor da Qualidade | Anexa o laudo, aprova ou reprova o lote |
| Almoxarife / Recebimento | Entrega o lote em quarentena e recebe a parcial de volta no Estoque |
| Compras | Recebe a parte reprovada e alinha devolução e substituição |
| PCP (planejamento e controle da produção) | Só acompanha a parcial; não decide nada aqui |

## Regras que valem

- A inspeção vale para o lote, nunca para a parcial (decisão EC-01).
- Aprovar exige laudo. Reprovar exige laudo, motivo e evidência. No recebimento e na entrada de lote no estoque o laudo é opcional ✅ (`api-pcp` `src/qualidade/dto/aprovar-lote.dto.ts:8` e `reprovar-lote.dto.ts:9` obrigatórios; `src/compras/dto/registrar-recebimento.dto.ts:53`, `conferir-recebimento.dto.ts:106,268` e `src/estoque/operacao/dto/entrada-lote.dto.ts:25` opcionais).
- Na reprovação parcial, a parte aprovada fica em quarentena até a substituição ser aprovada (EC-07). 🔴 A `develop` só segue isso quando ainda há parcial esperando o lote; sem parcial, libera a parte boa na mesma ação (PS-053): ajustar o código ou combinar um meio-termo. 🔴 E a substituição só libera a quarentena quando chega **pela requisição**: a recompra pela OC com `id_aviso_mes`, recebida pela doca, vira lote solto e o lote original fica em `QUARENTENA` (`api-pcp` `src/qualidade/qualidade.service.ts:88` (`this.itemDoLote(tx, lote.idRequisicaoItem)`); BL-102, retestes R5 e R6 de 16/11).
- ✅ Cancelar a OC de recompra devolve o aviso ao Compras (LOG-58b): o aviso volta a `ABERTO`, aceita nova recompra, e o saldo futuro e a doca do MES voltam a contar pela OC original (`api-pcp` `src/compras/recebimento.service.ts:279` (`saldoDosItensOc(this.prisma, itens)`); detalhe do aviso em `api-acos-vital` `src/schemas/core_vendas_faturamento/tables/avisos_mes_compra/avisos_mes_compra.route.js:138` (`recompras_canceladas`)). Testado pela API no Docker com o banco igual ao tst de 16/11 (reteste R6, [[Backlog-Reteste-R5-R6-2026-11-16]]).
- Material aprovado vai ao Estoque. Nunca segue direto à Expedição.
- O sistema nunca emite a nota de devolução. Ele só sinaliza e o Omie emite.
- Lote da carga inicial já nasce liberado, porque a dupla conferência faz o papel do laudo.
- Reprovação total também tem saída: a parte volta a Compras. Nenhum estado fica sem dono.
- Devolução a fornecedor (RNC) e devolução de cliente são coisas diferentes. Só a primeira existe aqui.
- Só o setor da Qualidade decide o lote (N16-124). Hoje qualquer usuário com permissão de editar a inspeção decide.
- Não existe concessão: o lote é liberado ou reprovado (N16-125).
- Lote 100% reprovado volta ao fornecedor e abre a recompra (RNC, N16-126).
- O Compras é avisado no av-hub da recompra (N16-127), pelo contrato LOG-58.

As quatro decisões acima são de 29/10/2026 (bloco N16-120 a N16-143).

## O que já existe e o que falta

- ✅ (`app-pcp`) Tela de inspeção, aprovação, reprovação com cisão do lote e devolução da parte reprovada a Compras.
- ✅ (`api-pcp`) Substituição que se une à parte em quarentena e segue ao Estoque.
- 🟡 Painel do Estoque com alerta de RNC pendentes: é protótipo, mas o alerta usa API real.
- 🟡 Travar a decisão ao setor da Qualidade (decidido em N16-124, falta código).
- 🔴 Fechar a RNC: registrar a nota de devolução e dar baixa do lote reprovado. Hoje é manual, fora do MES.
- ✅ (`api-pcp`) Avisar o Compras no av-hub da recompra por RNC (N16-127, LOG-58, 12/11): `api-pcp` `src/qualidade/qualidade.service.ts:226` (`await enfileirarAvisoRecompraRnc(tx, {`). Testado no Docker: 2 PÇ reprovadas na OC-000013 viraram aviso no Hub, resolvido pela recompra OC-000014. Pela tela, em 13/11: a reprovação parcial do LT-20261113-0008 virou `AVISO_COMPRA` enviado em 26 s e resolvido pela OC-000023. 🟡 O "Prazo do pedido" da Inspeção de entrada sai um dia antes (29/10 para 30/10, fuso; `app-pcp` `app/(protected)/qualidade/inspecao-entrada/page.tsx:189` (`new Date(row.prazoPedido).toLocaleDateString`), BL-094).
- ✅ Teste ponta a ponta no Docker em 13/11 (reteste R2): a reprovação de 2 de 5 PÇ criou, na mesma transação, o lote filho, a RNC e o `AVISO_COMPRA` na fila; o envio saiu em 49 s (201); o Hub gravou em `avisos_mes_compra`; a OC de recompra emitida com `id_aviso_mes` resolveu o aviso (`RESOLVIDO`, `RECOMPRA`) e voltou ao MES com `oc_referencia.id_aviso_mes_origem` igual ao id do aviso. 🟡 O aviso espera o ciclo da fila (60 s): a reprovação não chama `disparar()`, e a requisição de compra chama ✅ `api-pcp` `src/compras/compras.service.ts:591` (`this.envioAvhub.disparar();`).
- 🔴 Inspeção de processo (Ciclo 2).
- ❓ Nome do perfil da Qualidade no ambiente real.

## Detalhe técnico

### Quem atua (onde)

| Quem | Onde | O que faz |
|---|---|---|
| Inspetor da Qualidade | MES, tela `/qualidade/inspecao-entrada` | Anexa o laudo, aprova ou reprova o lote (informa a quantidade reprovada) |
| Almoxarife / Recebimento | MES | Entrega o lote em quarentena (nó `R4`), depois recebe a parcial de volta no Estoque |
| Compras (comprador, CCP) | av-hub e Compras · CCP no MES | Recebe de volta a parte reprovada, alinha com o fornecedor a devolução e a substituição |
| PCP | MES | Não decide nada aqui; só vê a parcial andando |

CCP = acompanhamento de compras. Os perfis são dados do banco (`perfis`, `permissoes`, `perfil_setores`); o código não fixa nome de perfil "Qualidade" ❓ (confirmar o nome no ambiente). Detalhe de permissões na seção "Perfil e permissões do setor QUALIDADE".

### Regras decididas

| Regra | Decisão | Selo |
|---|---|---|
| Inspeção de entrada é por **lote**; a de saída é um setor tipo `QUALIDADE` no roteiro | EC-01 (Nathan, 29/09) | 📝 ✅ (`api-pcp`) |
| Aprovar exige laudo; reprovar exige laudo, motivo e evidência | Regra de Q4 do v1, trava dura no DTO | 📝 ✅ `api-pcp/src/qualidade/dto/aprovar-lote.dto.ts:4-9`, `reprovar-lote.dto.ts:5-26` |
| Reprovação total ou parcial: a parte aprovada fica em **QUARENTENA** até a substituição; a parte reprovada volta a Compras, que alinha devolução e substituição com o fornecedor; a substituição passa de novo pela inspeção e, aprovada, **une-se** à parte em quarentena | EC-07 (Nathan, 29/09) | 📝 ✅ `api-pcp` `src/compras/circuito-compra.ts:163` (`export async function devolverAoEstoqueParciaisProntas(`), `src/qualidade/qualidade.service.ts:234-245` (`aindaEsperando`) |
| Aprovado volta ao Estoque (entrada no saldo); nunca vai direto à Expedição | Decisão do Nathan de 24/09, reafirmada em 14/10 (tudo que é comprado vai ao Estoque) | 📝 ✅ `circuito-compra.ts:239-249` |
| O sistema nunca emite a nota de devolução: só sinaliza (`nota_devolucao_pendente`); o Omie emite | Regra de Q10/Q11 do v1; Registro #30 (Omie é o fiscal) | 📝 ✅ sinalização, 🔴 fechamento |
| Lote da carga inicial nasce `LIBERADO`, sem inspeção (dupla conferência faz o papel do laudo) | DEC-4, Registro #25 | 📝 ✅ `api-pcp` `src/estoque/operacao/estoque-operacao.service.ts:658-659` (`origem: 'CARGA_INICIAL'`, `statusQualidade: 'LIBERADO'`) |
| Reprovação **total** do lote não fica sem saída: a parcial volta a Compras (nunca estado final sem dono) | Princípio "nenhum estado é beco sem saída" | 📝 ✅ `api-pcp` `src/qualidade/qualidade.service.ts:217-224` (`devolverAComprasParteReprovada`) (ver "Como está no código") |
| Devolução a fornecedor (RNC) e devolução de cliente são conceitos distintos; só o primeiro existe aqui | Nota de Q10/Q11 do v1 | 📝 |

### Estados

`StatusQualidadeLote` (enum exato, `estoque.prisma:25-31`): `PENDENTE` · `LIBERADO` · `REPROVADO` · `QUARENTENA`

| Valor | Significado | Entra no saldo disponível? |
|---|---|---|
| `PENDENTE` | Recém-recebido, aguardando inspeção. Quarentena de recebimento. Já tem linha de saldo desde o recebimento (`api-pcp` `src/compras/recebimento.service.ts:1152` e `src/compras/compras.service.ts:1047`, `aplicarDeltaSaldo(tx`), com disponível 0 | Não (`api-pcp` `src/estoque/operacao/estoque-operacao.helpers.ts:10`, `Disponível do lote = saldo total (só se LIBERADO)`) |
| `LIBERADO` | Aprovado (ou carga inicial). Só lote `LIBERADO` conta no disponível e pode ser reservado | Sim (`estoque-operacao.helpers.ts:165`) |
| `REPROVADO` | Lote inteiro reprovado, ou o **lote filho** da cisão com a quantidade reprovada | Não |
| `QUARENTENA` | Parte aprovada de uma reprovação parcial, bloqueada até a substituição ser aprovada | Não |

`OrigemLote` (`estoque.prisma:11-17`) tem `RECEBIMENTO`, `CARGA_INICIAL` e, desde 27/10 na `develop`, `PRODUCAO` (lote do fabricado, ver [[11-Qualidade-Saida]] e [[Estados-e-Status]]).

#### Transições

```mermaid
stateDiagram-v2
    [*] --> PENDENTE : recebimento sem divergencia, ou decisao do PCP
    [*] --> LIBERADO : carga inicial
    PENDENTE --> LIBERADO : aprovar com laudo
    PENDENTE --> REPROVADO : reprovar tudo
    PENDENTE --> LIBERADO : reprovar parte, pai fica LIBERADO se ninguem espera
    PENDENTE --> QUARENTENA : reprovar parte e a parcial ainda espera
    QUARENTENA --> LIBERADO : substituicao aprovada e unida
    LIBERADO --> [*]
    REPROVADO --> [*] : RNC aberta, devolucao ao fornecedor
```

Em toda reprovação parcial nasce um **lote filho** `REPROVADO` (`idLotePai` apontando o pai) com a quantidade reprovada. O pai fica `LIBERADO` na mesma ação quando nenhuma parcial espera por ele, ou `QUARENTENA` quando ainda há parcial aguardando ✅ (`api-pcp` `src/qualidade/qualidade.service.ts:195` (`statusQualidade: 'LIBERADO'`) e `:239` (`aindaEsperando > 0`)). A validação local em Docker de 10/11/2026 viu o primeiro caso: reprovado 1 de 2 peças, o filho nasceu `REPROVADO` com RNC e o pai ficou `LIBERADO` com disponível 1, o que diverge da EC-07 (PS-053).

#### Estado da parcial na raia

A parcial que espera a decisão fica no setor `qualidade-entrada` ("Qualidade · Entrada", tipo `QUALIDADE`), com `idLoteCompra` apontando o lote. Nesse setor a fila **não oferece ação** (`app-pcp/.../movimentacoes/acoes.ts:98-100`): quem decide é a inspeção do lote. Status `StatusItemParcial` completos em [[Estados-e-Status]].

### Telas

| Nome atual | Nome antigo | Rota | App | Slug de permissão | Estado |
|---|---|---|---|---|---|
| Inspeção de entrada | Qualidade (mock) | `/qualidade/inspecao-entrada` | app-pcp | `inspecao-entrada` | ✅ `app-pcp/app/(protected)/qualidade/inspecao-entrada/page.tsx:116-118`; a rota `qualidade/route` ainda cita mock ❓ |
| Qualidade · Entrada (fila do setor, só leitura) | — | `/movimentacoes/[setorId]` | app-pcp | `movimentacoes` (ou slug equivalente de fila) | ✅ `acoes.ts:91-100` |
| Painel do Estoque, alerta "RNC pendentes" | — | `/estoque-operacao/painel-estoque` | app-pcp | `painel-estoque` | 🟡 painel é protótipo com dados de exemplo (`painel-estoque/page.tsx:205`), o alerta usa API real |

A tela de inspeção lista os lotes `PENDENTE` com material, quantidade, fornecedor, NF, requisição e prazo do pedido, e abre o modal de decisão (laudo, motivo, evidência, quantidade reprovada).

### Endpoints e contratos

| Método e rota | Direção | Permissão | Efeito | Código |
|---|---|---|---|---|
| `GET /qualidade/lotes` | app-pcp → api-pcp | `inspecao-entrada:visualizar` | Fila: lotes com `statusQualidade = PENDENTE`, mais antigo primeiro | `api-pcp` `src/qualidade/qualidade.controller.ts:16-20` (`fila()`), `src/qualidade/qualidade.service.ts:31-73` (`async fila()`) ✅ |
| `POST /qualidade/lotes/:id/aprovar` | idem | `inspecao-entrada:editar` | Lote `LIBERADO`, devolve parciais ao Estoque | `api-pcp` `src/qualidade/qualidade.controller.ts:22-26` (`@Post(':id/aprovar')`), `src/qualidade/qualidade.service.ts:75-92` (`async aprovar(`) ✅ |
| `POST /qualidade/lotes/:id/reprovar` | idem | `inspecao-entrada:editar` | RNC, cisão, devolução a Compras | `api-pcp` `src/qualidade/qualidade.controller.ts:28-32` (`@Post(':id/reprovar')`), `src/qualidade/qualidade.service.ts:94-265` (`async reprovar(`) ✅ |
| `GET /estoque/alertas/rnc-pendentes` | app-pcp → api-pcp | permissão do Estoque | Lista RNC com `notaDevolucaoPendente = true` | `estoque/alertas/alertas.service.ts:63-64` ✅ |

Não há contrato com o av-hub para a RNC. O Compras só vê o efeito indireto (ver "O que falta desenvolver"). Contratos relacionados: [[Contratos-da-v2|LOG-35]] (marcos), [[Contratos-da-v2|LOG-34]] (ida da requisição), [[Contratos-da-v2|API-008]] (a cisão herda o custo do pai).

### Como está no código

#### Aprovar (nó `Q2` sim, depois `E5`)

`QualidadeService.aprovar` (`api-pcp` `src/qualidade/qualidade.service.ts:75-92` (`async aprovar(`)), numa transação:

1. Trava o lote (`travarLotes`) e exige `PENDENTE` (`loteParaDecidir`, `:276-283`; outro status dá 409 "já foi decidido").
2. Grava `statusQualidade = LIBERADO`, `laudoUrl`, `liberadoById`, `liberadoEm`.
3. Se o lote veio de uma requisição, chama `devolverAoEstoqueParciaisProntas` (`circuito-compra.ts:166-250`): junta as parciais do mesmo item que esperavam no setor Qualidade · Entrada, **libera os lotes em `QUARENTENA` do mesmo item**, funde as parciais numa só (a mais antiga é o destino; as outras viram `CANCELADO` com "Unida à parcial…") e move a parcial resultante, `EM_TRANSITO`, para o setor Estoque, com `idLoteCompra = null`.
4. Matéria-prima (requisição sem produto final): a parcial só volta quando nenhum lote da requisição está `PENDENTE` (`circuito-compra.ts:181-186`).

#### Reprovar (nós `Q2` não, `Q3`, `Q4`)

`QualidadeService.reprovar` (`api-pcp` `src/qualidade/qualidade.service.ts:94-265` (`async reprovar(`)):

1. Exige `PENDENTE`. `quantidadeReprovada` é opcional; ausente = saldo total do lote. Tem de estar entre 0,0001 e o saldo (`:107-112`).
2. **Total** (`reprovada >= saldo`): o próprio lote vira `REPROVADO` com `motivoReprovacao`, `evidenciaUrl`, `reprovadoPor`, `reprovadoEm` (`:124-128`).
3. **Parcial** (cisão, `:129-208`): nasce o lote filho `LT-AAAAMMDD-NNNN`, `REPROVADO`, com `idLotePai`; o saldo é tirado das localizações do pai (maior saldo primeiro) com um `MovimentoEstoque` `SAIDA` no pai e um `ENTRADA` no filho, motivo "Cisão por reprovação (RNC)". O filho herda o custo do pai (`copiarCustoParaFilho`, `:153`). O pai fica `LIBERADO`.
4. Abre a `Rnc` (`rncs`) do lote reprovado: motivo (300), evidência, quantidade reprovada, `notaDevolucaoPendente = true` por padrão (`:205-213`; modelo em `estoque.prisma:263-276`).
5. EC-07: `devolverAComprasParteReprovada` (`circuito-compra.ts:253`) move a parte reprovada das parciais que esperavam o lote para o setor Compras (parcial inteira se a quantidade cobre, senão `splitParaDestino`); o restante continua no setor Qualidade · Entrada. Se ainda há parcial esperando (`STATUS_AGUARDANDO`), o **pai passa a `QUARENTENA`** (`:234-245`). Na mesma transação, avisa o Compras no Hub (LOG-58, `:226`, `enfileirarAvisoRecompraRnc`).
6. Compras precisa recomprar: `RequisicaoCompraItem.quantidadeRecebida` decrementa a quantidade reprovada e a requisição `RECEBIDA` volta a `RECEBIDA_PARCIAL` (`:248-259`).
7. Fecha chamando `devolverAoEstoqueParciaisProntas` de novo, para o caso da matéria-prima (`:261-262`).

#### Substituição (EC-07)

A substituição chega como **nova chegada com NF** de uma requisição que voltou a Compras · CCP (lista de "esperados" do [[07-Recebimento]]). A conferência cria um lote novo `PENDENTE` e a parcial nova vai para Qualidade · Entrada com o novo `idLoteCompra`. Quando esse lote é aprovado, `devolverAoEstoqueParciaisProntas` encontra as duas parciais no setor (a que está em quarentena e a nova), libera o lote em `QUARENTENA`, funde as parciais e devolve ao Estoque (`circuito-compra.ts:188-249`). ✅

#### Nota de devolução e RNC

A RNC só nasce e é listada (`alertas.service.ts:63`). **Não existe endpoint nem tela para fechar a RNC**, registrar a nota de devolução do Omie, nem dar `SAIDA` no saldo do lote reprovado (o saldo fica no lote filho `REPROVADO`, fora do disponível). Fechamento manual, fora do MES, como o desenho do v1 previa para o ciclo 1. 🔴

#### Retorno ao Estoque

A parcial chega ao setor Estoque `EM_TRANSITO`. O almoxarife usa "Atender pelo estoque" (`PATCH /itens-parciais/:id/atender-estoque`, `itens-parciais.service.ts:607`): reserva sobre lote `LIBERADO` e despacha para a Expedição. O bloqueio inverso existe: enviar para um setor tipo `ESTOQUE` com lote `PENDENTE` do item é recusado (`ensureLotesCompradosLiberados`, `itens-parciais.service.ts:1220-1237`).

### Perfil e permissões do setor QUALIDADE

| Recurso | Regra | Código |
|---|---|---|
| Fila e decisão de lote | `RequirePermission('inspecao-entrada', 'visualizar'|'editar')`. Não há checagem de `PerfilSetor` no serviço | `qualidade.controller.ts:19-34` ✅ |
| Fila do setor Qualidade · Entrada | Só aparece para quem tem `podeVisualizar` no setor `qualidade-entrada` (tabela `perfil_setores`) | `perfis.service.ts` / `useSetoresPermitidos` ✅ |
| Inspeção de saída | Setor(es) tipo `QUALIDADE` do roteiro, fila `/qualidade/inspecao-saida`; agir exige `podeAtuar` no setor (`ensurePodeAtuar`) | `perfis.service.ts:278-289`, `itens-parciais.service.ts:909-918` ✅ |
| Login | Escritório entra por Azure AD; chão de fábrica por usuário e senha | `POST /auth/azure`, `POST /auth/login` ✅ (`api-pcp`) |

Consequência de projeto: qualquer usuário com `inspecao-entrada:editar` decide qualquer lote, mesmo sem vínculo de setor. 🟡 se for desejado travar por setor (Robert). Decidido: travar (N16-124, ver "Regras que valem").

### Dados (dump MES, tudo em `public`)

| Tabela | Colunas relevantes |
|---|---|
| `lotes` | `codigo`, `status_qualidade`, `laudo_url`, `id_lote_pai`, `quarentena_desde`, `liberado_by_id`, `liberado_em`, `motivo_reprovacao`, `evidencia_url`, `reprovado_by_id`, `reprovado_em`, `id_requisicao_item`, `numero_nf`, `fornecedor` |
| `rncs` | `id_lote`, `motivo`, `evidencia_url`, `quantidade_reprovada`, `nota_devolucao_pendente`, `aberta_por_id`, `aberta_em` |
| `itens_parciais` | `id_lote_compra` |
| `saldos_estoque`, `movimentos_estoque` | Cisão gera `SAIDA` no pai e `ENTRADA` no filho |
| `requisicoes_compra_itens` | `quantidade_recebida` |
| `lote_custo` | Cisão copia o custo do pai |

### O que falta desenvolver

| # | Item | Dono | Nó | Selo |
|---|---|---|---|---|
| 1 | Fechar a RNC: endpoint e tela para registrar a nota de devolução, dar baixa do lote reprovado e zerar `nota_devolucao_pendente` | Robert (MES) | Q3 | 🔴 |
| 2 | Contrato para a **recompra por RNC**: avisar o Compras no av-hub que a parte reprovada exige devolução e substituição (hoje só o MES sabe; a OC no av-hub segue "atendida") | Nathan decide, Gustavo e Robert implementam | Q3 → `C1` | ✅ LOG-58 (12/11; testado no Docker em 13/11) |
| 3 | Vincular a inspeção ao setor: checar `PerfilSetor` em `aprovar` e `reprovar` (decidido em N16-124; conferido em 29/10 na `develop` do MES: `qualidade.service.ts` ainda não checa o setor) | Robert | Q2 | 📝 🔴 |
| 4 | Concessão de lote fora de especificação: não existe (N16-125). Lote 100% reprovado: volta ao fornecedor e abre a recompra (N16-126), o que depende do item 1 e do contrato do item 2 | Nathan | Q2 | 📝 decidido; 🔴 sem código |
| 5 | Inspeção de processo (vendedor marca "Qualidade acompanha desde o início"; inspeção documental). O flag existe em `Pedidos.acompanhamentoQualidade` mas nada o consome | Robert, Ciclo 2 | — | 🔴 |
| 6 | Trocar o mock restante de `qualidade/route` e do painel do Estoque por dados reais | Robert | — | 🟡 |
| 7 | Rótulo de etapa "Em quarentena" do contrato 005 já existe (`qualidade.quarentena`); falta teste ponta a ponta no cartão "Etapa dos itens" | Nathan | — | ❓ |

### Pendências

- Nathan: a trava do laudo vale igual na inspeção de processo (documental)? (T-04 do v1, só afeta o Ciclo 2).
- Nathan: concessão de lote fora de especificação existe? Quem autoriza? Qual o destino de um lote 100% reprovado? **Decidido (N16-125 e N16-126, ver "Regras que valem").**
- Qualidade e Robert: nome do perfil da Qualidade no ambiente e quem pode decidir lote (ver item 3). **Decidido: a decisão do lote fica travada ao setor da Qualidade (N16-124). O nome do perfil no ambiente segue ❓.**
- Robert: comportamento esperado quando o fornecedor entrega a substituição **antes** de o lote reprovado ser baixado fisicamente (sem movimento de devolução, o saldo do filho `REPROVADO` convive com o novo lote).

### Diagrama do subfluxo

```mermaid
flowchart TD
    R4["R4 · Lote em quarentena"] --> Q1["Q1 · Inspecao de entrada por lote"]
    Q1 --> Q2{"Q2 · Aprova o lote?"}
    Q2 -->|sim| E5["E5 · Entrada no Estoque<br/>lote LIBERADO, parcial volta ao Estoque"]
    Q2 -->|"nao, total ou parcial"| Q3["Q3 · RNC e cisao do lote<br/>a parte reprovada volta a Compras"]
    Q3 --> Q4["Q4 · Parte aprovada em QUARENTENA<br/>ate a substituicao"]
    Q3 -->|recompra| C1["C1 · Cotacao e negociacao"]
    C1 --> R0["R0 · Esperados: substituicao chega com NF"]
    R0 --> R4
    Q4 -->|"substituicao aprovada, partes unidas"| E5
```
