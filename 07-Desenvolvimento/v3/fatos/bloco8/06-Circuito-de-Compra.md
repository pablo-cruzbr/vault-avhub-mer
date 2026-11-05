# Fatos de 06-Circuito-de-Compra

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/06-Circuito-de-Compra.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir 06-Circuito-de-Compra`.

## decisões e IDs (14)

- `BL-049`
- `BL-050`
- `N16-08`
- `N16-106`
- `N16-120`
- `N16-123`
- `N16-127`
- `N16-137`
- `N16-143`
- `N16-144`
- `N16-60`
- `N16-67`
- `N16-76`
- `N16-88`

## contratos (1)

- `API-009`

## commits (0)


## arquivo:linha (0)


## rotas (0)


## datas (7)

- `08/10`
- `14/10`
- `15/10`
- `23/10`
- `26/10`
- `29/10`
- `29/10/2026`

## código entre crases (25)

- `C0`
- `C1`
- `C2`
- `C3`
- `C4`
- `C5`
- `C6`
- `C7`
- `C8`
- `FN1`
- `FN1 → R0`
- `P3`
- `R0`
- `api-acos-vital`
- `api-pcp`
- `app-pcp`
- `av-hub`
- `develop`
- `divergencias_compra`
- `estoque`
- `fn_requisicao_mes_aplicar`
- `main`
- `pedidos_venda`
- `recompra`
- `uso_interno`

## regras e linhas de conteúdo (35)

- **Nasce a requisição.** O PCP (planejamento e controle da produção) pede o material do pedido pelo MES (`P3`). O Compras também pode criar uma requisição própria no av-hub, sem pedido de venda (`C0`).
- **O MES envia ao av-hub.** Cada item da requisição do PCP vai para o av-hub. Se o av-hub cair, a fila guarda e nada se perde (`P3`).
- **Compras confere a parte do vendedor.** Quando o pedido vem de uma proposta, o sistema puxa fornecedor, impostos e frete que o vendedor preencheu. O comprador confere 📝 (`C6`).
- **O comprador cota e negocia.** As duas origens caem na mesma caixa. A cotação acontece fora do sistema, e o comprador marca a requisição como em cotação (`C1`).
- **Valor correto e aviso ao vendedor.** Compras segue o fornecedor do vendedor ou usa o valor correto. Se comprar acima do custo da proposta, o vendedor aprova ou reprova 📝 (`C7`, `C8`).
- **Acima de R$ 30 mil, o Gerente aprova.** Até esse valor a OC sai sozinha, sem aprovação. Acima, espera o Gerente de Compras (`C2`, `C3`).
- **O comprador emite a OC.** Ela leva fornecedor, frete CIF ou FOB, moeda e valor por item. A requisição passa a "atendida". A integração envia a OC ao Omie por fila (`C4`).
- **O CCP acompanha o fornecedor.** Registra confirmação, previsão, despacho e ocorrências. O MES mostra esses marcos só para leitura (`C5`).
- **O fornecedor entrega.** Entrega no frete CIF ou libera para coleta no FOB. O sistema não envia a OC ao fornecedor: o comprador manda PDF ou e-mail por fora (`FN1`).
- **A OC aprovada entra nos esperados da doca.** Dali o trabalho passa ao [[07-Recebimento]] (`R0`).
- | PCP | Abre no MES a requisição do material do pedido |
- | Comprador | Cota, negocia e emite a OC; até R$ 30 mil sem aprovação |
- | Gerente de Compras | Aprova a OC acima de R$ 30 mil |
- | CCP (acompanhamento de compras) | Acompanha o fornecedor: confirmação, previsão, despacho e ocorrência |
- | Fornecedor | Recebe a OC e entrega; não acessa o sistema |
- | Doca | Registra a chegada com a nota fiscal |
- Existem duas origens de requisição, mas uma caixa só: PCP e Compras são tratados igual.
- Até R$ 30 mil, o comprador emite livre. Acima, o Gerente de Compras aprova.
- O limite de R$ 30 mil é por unidade e provisório. Endurece depois da conversa com Compras.
- O Gerente de Compras pode aprovar a OC que ele mesmo emitiu (N16-123).
- Cancelar requisição exige motivo de 3 a 500 caracteres.
- Requisição que já tem OC não se cancela pelo MES.
- Compras · CCP no MES é só leitura.
- A OC aprovada vai ao Omie por fila. OC com erro sai da fila e só volta se alguém reenviar.
- OC cancelada devolve todas as requisições dela a "aberta". Nenhum estado é beco sem saída.
- ✅ (`av-hub`, `app-pcp`) Telas das duas origens, emissão da OC, lista de OCs, aprovações e follow-up do CCP.
- ✅ Envio da OC ao Omie testado em 14/10. Produção ainda ❓.
- 🟡 Regra de aprovação provisória: vai endurecer depois da conversa com Compras.
- 📝 `C6` a `C8` decididos em 26/10; sem código na `api-acos-vital` nem no front 🔴 (conferido em 29/10: nenhuma rota `divergencias_compra`).
- ✅ O MES lê a OC do hub desde 15/10 (K4, `develop` do `api-pcp`) e as requisições do Compras com pedido de venda aparecem ao PCP na Triagem desde 23/10 (API-009). 🔴 Falta o PCP ver a OC do pedido na Triagem e na Destinação (BL-049) e o saldo futuro no Estoque (BL-050).
- 🔴 Perfil exclusivo do CCP (hoje vale a permissão da tela).
- 🔴 Contrato de recompra por RNC e aviso de atraso ao PCP e ao vendedor.
- ❓ Teste ponta a ponta com as chaves reais; versionar `fn_requisicao_mes_aplicar`.
- [[06-Circuito-de-Compra-Detalhe-Tecnico-1]]: Nós e entradas · Quem atua (onde) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[06-Circuito-de-Compra-Detalhe-Tecnico-2]]: Como está no código · C6, C7 e C8: a parte de compras do pedido da proposta · O que falta desenvolver · Pendências · Subfluxo
