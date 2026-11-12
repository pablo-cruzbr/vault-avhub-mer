---
tags: [fluxo, raia, compras, ccp, requisicao, oc, aprovacao, omie, fornecedor, p3, c0, c1, c2, c3, c4, c5, fn1]
criado: 2026-10-14
estado-em: 2026-11-12
status: vigente
ordem: 6
nos: [P3, C0, C1, C2, C3, C4, C5, C6, C7, C8, FN1]
anterior: "[[05-Estoque-Atendimento]]"
proxima: "[[07-Recebimento]]"
develop-conferida: [api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, app-pcp 4c11886, omie-elt-pipeline master 0593c9f, em 2026-11-10, av-hub bc85670 (BL-086), em 2026-11-12, citação conferida no a43befe, api-acos-vital bebca52 (LOG-57, LOG-58, API-019), av-hub a43befe (front de C6 a C8 e LOG-58), api-pcp 2e564e6, em 2026-11-12]
dono: Compras (regra) · Gustavo (API) · Nathan (front av-hub) · Robert (MES)
fontes: [00-Fluxo-Mestre-0b, Integracao-AvHub-MES (INT-02, INT-03, INT-04), LOG-34, LOG-35, LOG-32, LOG-23, LOG-36, SQL-008, API-004, v1 02-PRD-Estoque/Fluxo-Compras-Completo, decisões do Nathan de 14/10 (duas origens, aprovação, Compras·CCP só leitura), api-pcp 579a625, api-acos-vital f322dcd, omie-elt-pipeline 0f739f0, HUB b55ac55 (lido em disco), Dump Avhub 14/10, api-pcp develop de 27/10/2026 (K4, API-009, API-011), N16-144, BL-086, OQ-52, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Circuito de compra (P3, C0 a C8, FN1)

**Em uma frase:** transforma a necessidade de um material em uma ordem de compra (OC) aprovada, enviada ao Omie e acompanhada até o fornecedor entregar.

**Quando consultar:** dúvidas sobre compras: da necessidade à ordem de compra aprovada, o envio ao Omie e o acompanhamento até a entrega.

**Onde estamos no fluxo:** ← [[05-Estoque-Atendimento]] | [[07-Recebimento]] → · nós desta nota: `P3`, `C0`, `C1`, `C2`, `C3`, `C4`, `C5`, `C6`, `C7`, `C8`, `FN1`

Quem pede o material é o MES (sistema de chão de fábrica); depois ele só lê. O av-hub cota, aprova, emite e acompanha. Preço, fornecedor e condição ficam no av-hub. O MES recebe só os marcos do andamento. CCP é o acompanhamento de compras: quem segue o fornecedor até a entrega.

Nós do [[00-Fluxo-Mestre-0b]] de que esta nota é dona: `P3`, `C0` a `C8` e `FN1`. Fecha em `FN1 → R0` ([[07-Recebimento]]). Selos em [[Regras-do-Vault]].

## Como funciona, passo a passo

1. **Nasce a requisição.** O PCP (planejamento e controle da produção) pede o material do pedido pelo MES (`P3`). O Compras também pode criar uma requisição própria no av-hub, sem pedido de venda (`C0`).
2. **O MES envia ao av-hub.** Cada item da requisição do PCP vai para o av-hub. Se o av-hub cair, a fila guarda e nada se perde (`P3`).
3. **Compras confere a parte do vendedor.** Quando o pedido vem de uma proposta, o sistema puxa fornecedor, impostos e frete que o vendedor preencheu. O comprador confere e pode usar o preço cotado ✅ (`av-hub` `components/Compras/FecharCompra/ItemOrdem.tsx:248` (`<CotacaoDaProposta`)) (`C6`).
4. **O comprador cota e negocia.** As duas origens caem na mesma caixa. A cotação acontece fora do sistema, e o comprador marca a requisição como em cotação (`C1`).
5. **Valor correto e aviso ao vendedor.** Compras segue o fornecedor do vendedor ou usa o valor correto. Se comprar acima do custo da proposta, a OC espera o vendedor aprovar ou reprovar em Meus Pedidos ✅ (`av-hub` `app/(protected)/vendas/meus-pedidos/page.tsx:9` (`topo={<DivergenciasDoVendedor />}`)) (`C7`, `C8`).
6. **Acima de R$ 30 mil, o Gerente aprova.** Até esse valor a OC sai sozinha, sem aprovação. Acima, espera o Gerente de Compras (`C2`, `C3`).
7. **O comprador emite a OC.** Ela leva fornecedor, frete CIF ou FOB, moeda e valor por item. A integração envia a OC ao Omie por fila (`C4`). A requisição só passa a "atendida" quando a OC é aberta **pela requisição** (`/compras/nova/[requisicaoId]`). Pela "Nova ordem de compra" com pedido de venda, a OC não leva a requisição: ela fica `aberta` e a compra se desliga do pedido no MES (BL-086, em [[Backlog-por-Frente]]). A validação local em Docker de 10/11/2026 viu os dois caminhos.
8. **O CCP acompanha o fornecedor.** Registra confirmação, previsão, despacho e ocorrências. O MES mostra esses marcos só para leitura (`C5`).
9. **O fornecedor entrega.** Entrega no frete CIF ou libera para coleta no FOB. O sistema não envia a OC ao fornecedor: o comprador manda PDF ou e-mail por fora (`FN1`).
10. **A OC aprovada entra nos esperados da doca.** Dali o trabalho passa ao [[07-Recebimento]] (`R0`).

## Exemplo

O PCP vê que faltam os materiais para os 100 flanges do Cliente Exemplo S.A. e abre a requisição no MES. Ela aparece na caixa do Compras.

O comprador negocia com fornecedores por telefone e e-mail e emite a OC. Se a compra passar de R$ 30 mil, a OC espera o Gerente de Compras. Se ficar abaixo, sai direto e segue ao Omie.

O comprador manda o PDF ao fornecedor por fora. O CCP anota a confirmação e a previsão de chegada, e o PCP acompanha pelo MES. Os 100 flanges chegam à doca com a nota fiscal.

## Quem atua

| Quem | O que faz |
|---|---|
| PCP | Abre no MES a requisição do material do pedido |
| Comprador | Cota, negocia e emite a OC; até R$ 30 mil sem aprovação |
| Gerente de Compras | Aprova a OC acima de R$ 30 mil |
| CCP (acompanhamento de compras) | Acompanha o fornecedor: confirmação, previsão, despacho e ocorrência |
| Fornecedor | Recebe a OC e entrega; não acessa o sistema |
| Doca | Registra a chegada com a nota fiscal |

## Regras que valem

O fluxo foi aprovado em 26/10. As decisões N16-120 a N16-143 são de 29/10/2026.

**Requisição e aprovação**

- Existem duas origens de requisição, mas uma caixa só: PCP e Compras são tratados igual.
- Até R$ 30 mil, o comprador emite livre. Acima, o Gerente de Compras aprova.
- A Diretoria não aprova.
- O limite de R$ 30 mil é por unidade e provisório. Endurece depois da conversa com Compras.
- O Gerente de Compras pode aprovar a OC que ele mesmo emitiu (N16-123).
- Não há trava entre quem emite e quem aprova a OC. O limite de R$ 30 mil continua provisório (N16-123).
- Na validação local em Docker de 10/11/2026, o comprador que emitiu uma OC acima de R$ 30 mil aprovou a própria OC: ele também tinha o perfil de testes com `pode_aprovar`. Isso é o que a N16-123 decidiu (sem trava), e a pergunta "quem emite pode aprovar?" foi reaberta na OQ-52 ([[Perguntas-Proposta-Pedido-Comissao]]).
- Cancelar requisição exige motivo de 3 a 500 caracteres.
- Requisição que já tem OC não se cancela pelo MES.
- Compras · CCP no MES é só leitura.
- A OC aprovada vai ao Omie por fila. OC com erro sai da fila e só volta se alguém reenviar.
- OC cancelada devolve todas as requisições dela a "aberta". Nenhum estado é beco sem saída.

**Parte de compras do pedido da proposta (`C6` a `C8`)**

- Antes de cotar, Compras confere o que o vendedor preencheu na proposta: fornecedor, impostos e frete. O sistema puxa esses dados para a OC (`C6`).
- Compras pode seguir o fornecedor do vendedor ou usar o valor correto, sem mudar a proposta (`C7`).
- Se Compras comprar acima do custo do vendedor, o vendedor aprova ou reprova em Meus Pedidos. A conta é por produto, sem tolerância. O reprovado vai à Gerência fisicamente e à lista de Reprovados de Compras (`C8`). Vale para o pedido da proposta e para o digitado no Omie 📝 (N16-08, N16-60 a N16-67, N16-76, N16-106) 🟡: API e banco prontos (LOG-57), falta a tela.
- O imposto por item da OC vem da parte de compras do pedido quando a finalidade da linha é `pedidos_venda` ou `recompra`. Para `estoque` ou `uso_interno`, o Comprador digita. É uma linha por pedido, sem média. O frete é rateado pelas linhas na proporção do valor. O Comprador pode editar antes de aprovar 📝 (N16-144). O contrato só será escrito quando o desenvolvimento começar.

**Acompanhamento e avisos**

- Compras e o CCP registram as datas de entrega do fornecedor. Essas datas movem a previsão de faturamento (N16-88).
- O Compras será avisado no av-hub da recompra por RNC (registro de não conformidade da Qualidade; N16-127). Hoje só o MES sabe, e a OC segue "atendida".
- Pelo mesmo caminho, o Compras será avisado quando o PCP reabrir o recebimento (N16-137).

## O que já existe e o que falta

- ✅ (`av-hub`, `app-pcp`) Telas das duas origens, emissão da OC, lista de OCs, aprovações e follow-up do CCP.
- ✅ Envio da OC ao Omie testado em 14/10. Produção ainda ❓.
- 🟡 Regra de aprovação provisória: vai endurecer depois da conversa com Compras. Sem segregação entre quem emite e quem aprova, como decidido na N16-123 (reaberta na OQ-52).
- ✅ (`av-hub` `lib/domain/compras-fechamento-tela.ts:92` (`export function requisicoesQueOItemAtende(`)) A "Nova ordem de compra" com pedido de venda oferece a requisição na fila do mesmo produto e PV, e a OC ligada a fecha (BL-086, 12/11). Provisório: o filtro por PV é feito na tela até a API filtrar.
- ✅ `C6` a `C8`: **API, banco e front prontos** (conferido na `develop` de 12/11; o front no `av-hub` `a43befe`, PRs #282 e #283). Falta só a margem considerada no aviso (BL-078) e o PV digitado no Omie (segunda etapa, N16-102). `C6` e `C7` (API-019): a consulta do PV devolve a parte de compras da proposta, `api-acos-vital` `src/schemas/core_vendas_faturamento/views/vw_pedido_venda_compras/vw_pedido_venda_compras.route.js:72` (`vw_pedido_venda_compra_proposta`). `C8` (LOG-57): a emissão da OC compara com o cotado e segura a OC, `api-acos-vital` `src/schemas/core_vendas_faturamento/tables/ordens_compra/ordens_compra.route.js:1206` (`fn_divergencias_compra_gerar(:id)`), e as rotas de Compras e de Meus Pedidos existem, `api-acos-vital` `src/schemas/core_comercial/tables/divergencias_compra/divergencias_compra.route.js:147` (`comprasDivergencias.get("/"`). O banco está aplicado no teste ([[Dump-AvHub-Teste-2026-11-12]]). No `av-hub`, a emissão da OC mostra o cotado e pede o motivo da compra acima (`components/Compras/FecharCompra/CotacaoDaProposta.tsx:45`, `Cotado na proposta {proposta.numero_proposta}`), Meus Pedidos tem "Para você responder" (`components/Pedidos/DivergenciasDoVendedor.tsx:76`, `Para você responder`), Compras tem a lista (`app/(protected)/compras/divergencias/page.tsx:8`, `<DivergenciasLista />`) e o detalhe da OC mostra por que ela espera (`components/Compras/OrdemDetalhe.tsx:203`, `<DivergenciasDaOrdem`). Detalhe em [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].
- ✅ O MES lê a OC do hub desde 15/10 (K4, `develop` do `api-pcp`) e as requisições do Compras com pedido de venda aparecem ao PCP na Triagem desde 23/10 (API-009). 🔴 Falta o PCP ver a OC do pedido na Triagem e na Destinação (BL-049) e o saldo futuro no Estoque (BL-050).
- ✅ (`api-pcp` `src/compras/recebimento.service.ts:169` e `src/compras/recebimento.controller.ts:20`; leitura da OC em `src/integracao-avhub/oc-referencia-avhub.service.ts:97`) O recebimento e a leitura da OC pelo MES estão na `develop` do MES (15 a 26/10). A `main` do MES parou em 08/10.
- 🟡 Perfil do CCP criado pelo Nathan em 30/10/2026 na produção (BL-017). No tst ele não existe, e Comprador e Gerência de Compras ainda editam o follow-up. O SQL que cria o perfil e deixa Compras só lendo está pronto (`../Perguntas-e-Respostas/perfil-CCP-followup.sql`, fora do vault), testado no Docker em 12/11; falta o Gustavo aplicar no tst e na produção. No MES as rotas de Compras · CCP continuam exigindo só a permissão `movimentacoes`, então quem edita depende das permissões dadas ao perfil.
- 🟡 Recompra por RNC e reabertura do recebimento (LOG-58): a API do av-hub recebe o aviso do MES e o Compras trata, `api-acos-vital` `src/schemas/core_vendas_faturamento/tables/avisos_mes_compra/avisos_mes_compra.route.js:110` (`integracaoMesAvisos.post("/"`), e a OC de recompra aponta o aviso (`id_aviso_mes`); banco aplicado no teste. A tela do Compras está na `develop` do `av-hub` (`a43befe`, PR #287): faixa do aviso no detalhe da OC (`components/Compras/OrdemDetalhe.tsx:216`, `<AvisosMesDaOrdem`), cartão em Requisições (`components/Compras/ComprasRequisicoes.tsx:167`, `<AvisosMesPainel`) e Nova OC de recompra. Falta o MES enviar (`api-pcp` `2e564e6` não tem nada) 🔴. Aviso de atraso ao PCP e ao vendedor: sem contrato.
- 📝 Contratos novos: `C6` e `C7` no API-019, `C8` no LOG-57, os avisos da recompra por RNC (N16-127) e da reabertura do recebimento (N16-137) no LOG-58.
- ❓ Teste ponta a ponta com as chaves reais; versionar `fn_requisicao_mes_aplicar`.

## Detalhe técnico

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[06-Circuito-de-Compra-Detalhe-Tecnico-1]]: Nós e entradas · Quem atua (onde) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[06-Circuito-de-Compra-Detalhe-Tecnico-2]]: Como está no código · C6, C7 e C8: a parte de compras do pedido da proposta · O que falta desenvolver · Pendências · Subfluxo
