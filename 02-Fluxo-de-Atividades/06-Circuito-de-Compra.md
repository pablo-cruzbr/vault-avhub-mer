---
tags: [fluxo, raia, compras, ccp, requisicao, oc, aprovacao, omie, fornecedor, p3, c0, c1, c2, c3, c4, c5, fn1]
criado: 2026-10-14
estado-em: 2026-11-05
status: vigente
ordem: 6
nos: [P3, C0, C1, C2, C3, C4, C5, C6, C7, C8, FN1]
anterior: "[[05-Estoque-Atendimento]]"
proxima: "[[07-Recebimento]]"
develop-conferida: [api-acos-vital 1654f65, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Compras (regra) · Gustavo (API) · Nathan (front av-hub) · Robert (MES)
fontes: [00-Fluxo-Mestre-0b, Integracao-AvHub-MES (INT-02, INT-03, INT-04), LOG-34, LOG-35, LOG-32, LOG-23, LOG-36, SQL-008, API-004, v1 02-PRD-Estoque/Fluxo-Compras-Completo, decisões do Nathan de 14/10 (duas origens, aprovação, Compras·CCP só leitura), api-pcp 579a625, api-acos-vital f322dcd, omie-elt-pipeline 0f739f0, HUB b55ac55 (lido em disco), Dump Avhub 14/10, api-pcp develop de 27/10/2026 (K4, API-009, API-011), N16-144]
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
3. **Compras confere a parte do vendedor.** Quando o pedido vem de uma proposta, o sistema puxa fornecedor, impostos e frete que o vendedor preencheu. O comprador confere 📝 (`C6`).
4. **O comprador cota e negocia.** As duas origens caem na mesma caixa. A cotação acontece fora do sistema, e o comprador marca a requisição como em cotação (`C1`).
5. **Valor correto e aviso ao vendedor.** Compras segue o fornecedor do vendedor ou usa o valor correto. Se comprar acima do custo da proposta, o vendedor aprova ou reprova 📝 (`C7`, `C8`).
6. **Acima de R$ 30 mil, o Gerente aprova.** Até esse valor a OC sai sozinha, sem aprovação. Acima, espera o Gerente de Compras (`C2`, `C3`).
7. **O comprador emite a OC.** Ela leva fornecedor, frete CIF ou FOB, moeda e valor por item. A requisição passa a "atendida". A integração envia a OC ao Omie por fila (`C4`).
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
- Cancelar requisição exige motivo de 3 a 500 caracteres.
- Requisição que já tem OC não se cancela pelo MES.
- Compras · CCP no MES é só leitura.
- A OC aprovada vai ao Omie por fila. OC com erro sai da fila e só volta se alguém reenviar.
- OC cancelada devolve todas as requisições dela a "aberta". Nenhum estado é beco sem saída.

**Parte de compras do pedido da proposta (`C6` a `C8`)**

- Antes de cotar, Compras confere o que o vendedor preencheu na proposta: fornecedor, impostos e frete. O sistema puxa esses dados para a OC (`C6`).
- Compras pode seguir o fornecedor do vendedor ou usar o valor correto, sem mudar a proposta (`C7`).
- Se Compras comprar acima do custo do vendedor, o vendedor aprova ou reprova em Meus Pedidos. A conta é por produto, sem tolerância. O reprovado vai à Gerência fisicamente e à lista de Reprovados de Compras (`C8`). Vale para o pedido da proposta e para o digitado no Omie 📝 (N16-08, N16-60 a N16-67, N16-76, N16-106) 🔴.
- O imposto por item da OC vem da parte de compras do pedido quando a finalidade da linha é `pedidos_venda` ou `recompra`. Para `estoque` ou `uso_interno`, o Comprador digita. É uma linha por pedido, sem média. O frete é rateado pelas linhas na proporção do valor. O Comprador pode editar antes de aprovar 📝 (N16-144). O contrato só será escrito quando o desenvolvimento começar.

**Acompanhamento e avisos**

- Compras e o CCP registram as datas de entrega do fornecedor. Essas datas movem a previsão de faturamento (N16-88).
- O Compras será avisado no av-hub da recompra por RNC (registro de não conformidade da Qualidade; N16-127). Hoje só o MES sabe, e a OC segue "atendida".
- Pelo mesmo caminho, o Compras será avisado quando o PCP reabrir o recebimento (N16-137).

## O que já existe e o que falta

- ✅ (`av-hub`, `app-pcp`) Telas das duas origens, emissão da OC, lista de OCs, aprovações e follow-up do CCP.
- ✅ Envio da OC ao Omie testado em 14/10. Produção ainda ❓.
- 🟡 Regra de aprovação provisória: vai endurecer depois da conversa com Compras.
- 📝 `C6` a `C8` decididos em 26/10; sem código na `api-acos-vital` nem no front 🔴 (conferido em 29/10: nenhuma rota `divergencias_compra`). Detalhe em [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].
- ✅ O MES lê a OC do hub desde 15/10 (K4, `develop` do `api-pcp`) e as requisições do Compras com pedido de venda aparecem ao PCP na Triagem desde 23/10 (API-009). 🔴 Falta o PCP ver a OC do pedido na Triagem e na Destinação (BL-049) e o saldo futuro no Estoque (BL-050).
- ✅ (`api-pcp` `src/compras/recebimento.service.ts:169` e `src/compras/recebimento.controller.ts:20`; leitura da OC em `src/integracao-avhub/oc-referencia-avhub.service.ts:97`) O recebimento e a leitura da OC pelo MES estão na `develop` do MES (15 a 26/10). A `main` do MES parou em 08/10.
- 🔴 Perfil exclusivo do CCP (hoje vale a permissão da tela).
- 🔴 Contrato de recompra por RNC e aviso de atraso ao PCP e ao vendedor.
- 🔴 Contrato novo entre MES e hub para `C6` a `C8` e para os avisos da recompra por RNC (N16-127) e da reabertura do recebimento (N16-137).
- ❓ Teste ponta a ponta com as chaves reais; versionar `fn_requisicao_mes_aplicar`.

## Detalhe técnico

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[06-Circuito-de-Compra-Detalhe-Tecnico-1]]: Nós e entradas · Quem atua (onde) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[06-Circuito-de-Compra-Detalhe-Tecnico-2]]: Como está no código · C6, C7 e C8: a parte de compras do pedido da proposta · O que falta desenvolver · Pendências · Subfluxo
