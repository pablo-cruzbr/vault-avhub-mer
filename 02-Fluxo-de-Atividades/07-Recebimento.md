---
tags: [fluxo, raia, recebimento, doca, nf, conferencia, divergencia, lote, mes, r0, r1, r2, r3, r4, r6]
criado: 2026-10-14
estado-em: 2026-11-05
status: vigente
ordem: 7
nos: [R0, R1, R2, R3, R4, R6]
anterior: "[[06-Circuito-de-Compra]]"
proxima: "[[08-Qualidade-Entrada]]"
develop-conferida: [api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Robert (MES) · Nathan (decisões)
fontes: [00-Fluxo-Mestre-0b, Integracao-AvHub-MES (INT-03), API-007, API-008, v1 02-PRD-Estoque/Fluxo-Recebimento-Completo, v1 App-PCP-Recebimento-Conferencia, decisões do Nathan de 14/10 (conferência contra a NF), api-pcp 579a625 (recebimento.service.ts, compras.service.ts, compras.prisma, compras-ccp.dto.ts), app-pcp 1fca8d3 (FilaSetor, ConferirRecebimentoModal, decisoes-pcp), api-pcp develop de 27/10/2026 (recebimento por OC e por NF, custo da OC), API-011, N16-134 a N16-137]
---

# Raia Recebimento (R0 a R6)

**Em uma frase:** a doca recebe o material comprado, confere contra a nota fiscal (NF) e transforma o que chegou em lote em quarentena, para a Qualidade inspecionar. Enquanto houver divergência aberta, nada entra no estoque.

**Quando consultar:** dúvidas sobre a doca: conferência contra a nota fiscal, divergência e a criação do lote em quarentena.

**Onde estamos no fluxo:** ← [[06-Circuito-de-Compra]] | [[08-Qualidade-Entrada]] → · nós desta nota: `R0`, `R1`, `R2`, `R3`, `R4`, `R6`

Nós do [[00-Fluxo-Mestre-0b]]: `R0`, `R1`, `R2`, `R3`, `R4`, `R6`. Entrada: `FN1` ([[06-Circuito-de-Compra]]). Saída: `Q1` ([[08-Qualidade-Entrada]]) ou `P6` ([[04-PCP-Triagem-e-Destinacao]]). Selos em [[Regras-do-Vault]].

> [!info] Decisões de 29/10/2026 (N16-120 a N16-143)
> - N16-134: tolerância de peso de 5% por padrão, ajustável por material.
> - N16-135: quando houver cruzamento com a OC, divergência contra a OC bloqueia, como a da nota.
> - N16-136: uma nota pode trazer itens de mais de uma OC. A conferência é por item da OC (proposta do Robert). Na `develop` do MES isso já existe: `POST /compras/recebimentos/nf` recebe várias conferências na mesma nota, cada uma de uma requisição do MES ou de uma OC do hub, e a tela "Receber com NF" aceita vários itens (`api-pcp` 19 a 20/10, `app-pcp` `5f50fff`, `9ced089`) ✅.
> - N16-137: a reabertura pelo PCP avisa o av-hub. Exige contrato novo entre MES e hub.
> - Código: o que aparece como ✅ de MES, a partir da conferência por OC e do custo da OC, está na `develop` do `api-pcp` e do `app-pcp`. A `main` do MES parou em 08/10 e só recebe com o merge BL-035.

## Como funciona, passo a passo

1. **A OC é aprovada.** A parcial (a parte do pedido que espera o material) entra na lista de esperados da doca. Compras também pode liberar à mão (`R0`).
2. **A carga chega com a nota.** A doca informa o número ou a chave de 44 dígitos da NF. Sem NF, a parcial não sai de Compras · CCP (`R0`).
3. **A doca confere contra a NF.** Conta o que chegou e compara com a nota, não com a OC. Receber mais do que o pedido é permitido, e a sobra fica livre no estoque (`R1`).
4. **A doca pesa.** Se o material tem peso teórico, o peso real é obrigatório. Desvio acima de 5% vira divergência de peso (`R2`).
5. **O sistema confere.** Se não há divergência, o lote nasce na hora. Se há, nada entra e outra pessoa precisa recontar (`R3`).
6. **Cria o lote em quarentena.** O lote nasce pendente, com entrada no saldo. Segue para a Qualidade (`R4`).
7. **Chegou só uma parte?** Essa parte vai à Qualidade. O restante volta a Compras · CCP, esperando a próxima NF (`R4`).
8. **Divergência: outra pessoa reconta.** Quem conferiu não reconta. A recontagem pede todos os itens (`R6`).
9. **Se a recontagem ainda diverge, o PCP decide.** Aceita (entra o que foi recontado) ou reabre (nada entra e a parcial volta a Compras). O motivo é obrigatório (`R6`).

## Exemplo

A OC dos 100 flanges está aprovada, então a parcial aparece na lista da doca. Na chegada, a doca informa a NF e a parcial passa ao Recebimento.

A NF diz 100 flanges e a doca conta 100. O flange tem peso teórico cadastrado, então a doca digita o peso real. Tudo bate, e o lote nasce pendente, com entrada no saldo, rumo à Qualidade.

Se faltassem flanges mesmo depois da recontagem, o PCP decidiria entre aceitar o que chegou ou reabrir a compra.

## Quem atua

| Quem | O que faz |
|---|---|
| Doca (conferente) | Registra a chegada com a NF, conta, pesa e informa avaria e descrição |
| Segunda pessoa | Reconta quando há divergência |
| PCP | Aceita ou reabre quando a recontagem continua divergindo |
| Compras | Libera para o Recebimento sem OC aprovada; em geral só o Administrador |
| Qualidade | Recebe o lote e inspeciona |

## Regras que valem

- A conferência é contra a nota, não contra o pendente nem contra a OC.
- Sem NF, a parcial não sai de Compras · CCP. Assim o tempo do fornecedor não cai no Recebimento.
- Divergência aberta trava a entrada no estoque.
- Quem conferiu não pode recontar.
- Peso real é obrigatório quando há peso teórico. Tolerância padrão de 5%, por material.
- Avaria exige foto.
- O lote sempre nasce em quarentena, mesmo item acabado.
- O Recebimento nunca decide compra. A divergência vai ao PCP, e a reabertura devolve a Compras.
- Só pode haver um recebimento aberto por parcial.
- O custo do lote vem da OC, hoje é opcional e não bloqueia o recebimento. A N16-09 manda que todo lote tenha custo (obrigatório, BL-066), o que ainda não vale no código.
- Divergência contra a OC também bloqueia, quando o cruzamento existir (N16-135).

## O que já existe e o que falta

- ✅ (`app-pcp`) Telas de recebimento, recontagem e decisão do PCP; lote em quarentena com etiqueta em PDF.
- ✅ (`api-pcp`) Recebimento parcial com divisão da parcial.
- ✅ (`api-pcp`) Na `develop` do MES: o custo da OC é gravado no lote (19/10, `97b9adc`; unidade diferente da OC ou OC fora da projeção gera lote sem custo e sinalizado).
- ✅ Na `develop` do MES: entrada de mercadoria de OC sem requisição do MES (OC criada só no av-hub), por OC e por NF, e uso interno sem lote (16 a 20/10).
- 🔴 A conferência ainda não cruza com a OC (preço, quantidade comprada, fornecedor); só compara contado com a NF. O rateio da chegada entre destinos da OC também falta (API-011).
- 🔴 Aviso ao av-hub quando o PCP reabre o recebimento; leitor de código de barras da NF; reabertura de divergência de produção.
- 🟡 Aviso à doca quando uma OC esperada é cancelada.
- 🔴 Alerta de OC que passou da previsão sem chegar.
- ❓ Teste ponta a ponta com OC real.

## Detalhe técnico

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[07-Recebimento-Detalhe-Tecnico-1]]: Nós · Quem atua (onde) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[07-Recebimento-Detalhe-Tecnico-2]]: Como está no código · Dados · Mercadoria de OC sem requisição do MES (C0) · O que falta desenvolver · Pendências · Subfluxo
