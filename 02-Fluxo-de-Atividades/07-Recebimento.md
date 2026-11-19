---
tags: [fluxo, raia, recebimento, doca, nf, conferencia, divergencia, lote, mes, r0, r1, r2, r3, r4, r6]
criado: 2026-10-14
estado-em: 2026-11-19
status: vigente
ordem: 7
nos: [R0, R1, R2, R3, R4, R6]
anterior: "[[06-Circuito-de-Compra]]"
proxima: "[[08-Qualidade-Entrada]]"
develop-conferida: [api-pcp 5aa95d5 (main 3af224e), app-pcp f3a10bf (main fe8972b), em 2026-11-19, main do MES e IT-LOG-REC-001; api-acos-vital e522962, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13, reteste por cliques e Da proposta à comissão; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13; api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05; api-pcp bd6b442, em 2026-11-13 (aviso do LOG-58)]
dono: Robert (MES) · Nathan (decisões)
fontes: [00-Fluxo-Mestre-0b, Integracao-AvHub-MES (INT-03), API-007, API-008, v1 02-PRD-Estoque/Fluxo-Recebimento-Completo, v1 App-PCP-Recebimento-Conferencia, decisões do Nathan de 14/10 (conferência contra a NF), api-pcp 579a625 (recebimento.service.ts, compras.service.ts, compras.prisma, compras-ccp.dto.ts), app-pcp 1fca8d3 (FilaSetor, ConferirRecebimentoModal, decisoes-pcp), api-pcp develop de 27/10/2026 (recebimento por OC e por NF, custo da OC), API-011, N16-134 a N16-137, IT-LOG-REC-001 rev. 01 de Douglas Fonseca (recebida em 18/11/2026, aprovada pela gerência)]
---

# Raia Recebimento (R0 a R6)

**Em uma frase:** a doca recebe o material comprado, confere contra a nota fiscal (NF) e transforma o que chegou em lote em quarentena, para a Qualidade inspecionar. Enquanto houver divergência aberta, nada entra no estoque.

**Quando consultar:** dúvidas sobre a doca: conferência contra a nota fiscal, divergência e a criação do lote em quarentena.

**Onde estamos no fluxo:** ← [[06-Circuito-de-Compra]] | [[08-Qualidade-Entrada]] → · nós desta nota: `R0`, `R1`, `R2`, `R3`, `R4`, `R6`

Nós do [[00-Fluxo-Mestre-0b]]: `R0`, `R1`, `R2`, `R3`, `R4`, `R6`. Entrada: `FN1` ([[06-Circuito-de-Compra]]). Saída: `Q1` ([[08-Qualidade-Entrada]]) ou `P6` ([[04-PCP-Triagem-e-Destinacao]]). Selos em [[Regras-do-Vault]].

Siglas desta nota: OC é a ordem de compra; NF é a nota fiscal; PCP é o planejamento e controle da produção; MES é o sistema de chão de fábrica, onde a doca trabalha.

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
- Peso real é obrigatório quando há peso teórico. Tolerância padrão de 5%, ajustável por material (N16-134).
- Avaria exige foto.
- O lote sempre nasce em quarentena, mesmo item acabado.
- O Recebimento nunca decide compra. A divergência vai ao PCP, e a reabertura devolve a Compras.
- Só pode haver um recebimento aberto por parcial.
- O custo do lote vem da OC, hoje é opcional e não bloqueia o recebimento. A N16-09 manda que todo lote tenha custo (obrigatório, BL-066), o que ainda não vale no código.
- Divergência contra a OC também bloqueia, quando o cruzamento existir (N16-135).
- Uma nota pode trazer itens de mais de uma OC. A conferência é por item da OC (N16-136, proposta do Robert).
- Quando o PCP reabre o recebimento, o av-hub tem de ser avisado (N16-137). Isso exige contrato novo entre MES e hub.

As decisões N16-134 a N16-137 são de 29/10/2026 (lote N16-120 a N16-143).

## O processo da doca (IT-LOG-REC-001)

Em 18/11/2026 o Douglas Fonseca (Recebimento) mandou a instrução de trabalho **IT-LOG-REC-001, Recebimento de Materiais, revisão 01**, aprovada pela gerência (o gerente a enviou ao Nathan). É o processo oficial da doca e a base para desenhar Recebimento e Compras. O documento fica fora do vault.

**O que a IT define:**

- Papéis: Programação de Frota, Motorista, Portaria, Operador Logístico Administrativo, Recebimento, Compras, Fiscal e Qualidade.
- Duas formas de chegada: entrega do fornecedor na planta e coleta com a frota própria.
- A conferência é contra a nota fiscal **e** contra a OC, na unidade de medida da OC. Material sem OC não é descarregado até Compras ou a liderança se manifestarem.
- Três resultados: conforme, conforme com ressalva e não conforme. O material não conforme é segregado com a etiqueta "Material Bloqueado" e tem registro fotográfico.
- Compras trata a divergência com o fornecedor e devolve a decisão ao Recebimento. A IT lista dez tratativas (recebimento parcial, recusa total ou parcial, devolução, carta de correção, nota complementar, reposição, aceite com ressalva, reclassificação, liberação excepcional) e os motivos de recusa.
- A entrada fiscal só é feita depois da liberação do Recebimento.
- Checklist da doca e indicadores do processo.

**Onde a IT e o MES não batem** (a resolver no desenho de Compras e Recebimento; nenhuma regra desta nota mudou ainda):

| Ponto | IT-LOG-REC-001 | MES hoje e regras desta nota | Situação |
|---|---|---|---|
| Contra o que conferir | NF e OC, na unidade da OC | só contado × NF | 🔴 o cruzamento com a OC falta (N16-135) |
| Receber acima da OC | não conforme | sem requisição entra sem divergência | ❓ a IT responde a pergunta do reteste; falta o Nathan decidir |
| Quem decide a divergência | Compras, com o fornecedor | o PCP ("O Recebimento nunca decide compra. A divergência vai ao PCP") | ❓ decisão do Nathan |
| Recontagem | não fala | quem conferiu não pode recontar (BL-091: às cegas?) | ❓ pergunta ao Douglas |
| Recusa no ato | prevista (o caminhão volta com o material) | não há recusa na doca, só divergência | 🔴 sem código |
| Entrada fiscal | depois da liberação | o MES não trata a entrada fiscal | ❓ como o hub e o Omie entram nisso |
| Coleta com frota própria | prevista, com coleta improdutiva | não existe no MES | 🔴 sem código |

As perguntas que a IT deixou em aberto foram mandadas ao Douglas em 18/11; o roteiro está em [[06-Circuito-de-Compra#Roteiro até 100%]].

## O que já existe e o que falta

- ✅ (`app-pcp`) Telas de recebimento, recontagem e decisão do PCP; lote em quarentena com etiqueta em PDF.
- 🟡 (`app-pcp`) A recontagem não é às cegas: a aba Pendências mostra a primeira contagem a quem vai recontar (`app-pcp` `app/(protected)/movimentacoes/components/RecebimentoFila.tsx:987` (`contado {Number(i.quantidadeContada)`), reteste por cliques de 13/11). **Pergunta (Nathan):** deve ser às cegas? (BL-091)
- ✅ (`api-pcp`) Recebimento parcial com divisão da parcial.
- ✅ (`api-pcp`) Na `develop` do MES: o custo da OC é gravado no lote (19/10, `97b9adc`; unidade diferente da OC ou OC fora da projeção gera lote sem custo e sinalizado).
- ✅ Na `develop` do MES: entrada de mercadoria de OC sem requisição do MES (OC criada só no av-hub), por OC e por NF, e uso interno sem lote (16 a 20/10).
- ✅ Na `develop` do MES: uma nota com itens de várias OCs (N16-136). `POST /compras/recebimentos/nf` recebe várias conferências na mesma nota, cada uma de uma requisição do MES ou de uma OC do hub, e a tela "Receber com NF" aceita vários itens (`api-pcp` 19 a 20/10, `app-pcp` `5f50fff`, `9ced089`).
- O que aparece como ✅ de MES nesta nota, a partir da conferência por OC e do custo da OC, está na `develop` do `api-pcp` e do `app-pcp` e foi publicado na `main` do MES desde 17 e 18/11/2026 (BL-035): em 19/11 a `main` contém toda a `develop` nos dois (`api-pcp` PRs #82 e #84, `app-pcp` PRs #67 e #69).
- 🔴 A conferência ainda não cruza com a OC (preço, quantidade comprada, fornecedor); só compara contado com a NF. A IT-LOG-REC-001 exige a conferência contra a OC ([[#O processo da doca (IT-LOG-REC-001)]]). O rateio da chegada entre destinos da OC também falta (API-011).
- ✅ (`api-pcp`) Aviso ao av-hub quando o PCP reabre o recebimento (N16-137, LOG-58, 12/11): `api-pcp` `src/compras/recebimento.service.ts:640` (`await enfileirarAvisosRecebimentoReaberto(tx, {`), enviado pela fila `integracao_avhub_envios`.
- 🔴 Leitor de código de barras da NF; reabertura de divergência de produção.
- 🟡 Aviso à doca quando uma OC esperada é cancelada.
- 🟡 Reteste no Docker de 13/11 (PS-059): a lista "A chegar" da doca (`GET /compras/recebimentos/oc-esperadas`) não desconta a recompra, e a OC original e a recompra ficam esperadas juntas; só o saldo futuro do Estoque desconta ✅ `api-pcp` `src/estoque/operacao/saldo-futuro.ts:35-63` (`async function reprovadoComRecompra(`). Receber acima da OC sem requisição entra sem divergência (é a regra) e esconde a reprovação no "a chegar". Quando a unidade da OC difere da do material, o lote nasce sem custo e a conferência não avisa; o motivo só fica no histórico do lote ✅ `src/compras/compra-oc.ts:102-106` (`custo a informar (D2)`). ❓ Pergunta do reteste: receber acima da OC sem requisição continua sem aviso?
- 🔴 Alerta de OC que passou da previsão sem chegar.
- ❓ Teste ponta a ponta com OC real.

## Detalhe técnico

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[07-Recebimento-Detalhe-Tecnico-1]]: Nós · Quem atua (onde) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[07-Recebimento-Detalhe-Tecnico-2]]: Como está no código · Dados · Mercadoria de OC sem requisição do MES (C0) · O que falta desenvolver · Pendências · Subfluxo
