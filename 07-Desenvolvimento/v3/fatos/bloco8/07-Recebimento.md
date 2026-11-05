# Fatos de 07-Recebimento

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/07-Recebimento.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir 07-Recebimento`.

## decisões e IDs (9)

- `BL-035`
- `BL-066`
- `N16-09`
- `N16-120`
- `N16-134`
- `N16-135`
- `N16-136`
- `N16-137`
- `N16-143`

## contratos (1)

- `API-011`

## commits (3)

- `5f50fff`
- `97b9adc`
- `9ced089`

## arquivo:linha (0)


## rotas (1)

- `POST /compras/recebimentos/nf`

## datas (4)

- `08/10`
- `19/10`
- `20/10`
- `29/10/2026`

## código entre crases (17)

- `5f50fff`
- `97b9adc`
- `9ced089`
- `FN1`
- `P6`
- `POST /compras/recebimentos/nf`
- `Q1`
- `R0`
- `R1`
- `R2`
- `R3`
- `R4`
- `R6`
- `api-pcp`
- `app-pcp`
- `develop`
- `main`

## regras e linhas de conteúdo (35)

- **A OC é aprovada.** A parcial (a parte do pedido que espera o material) entra na lista de esperados da doca. Compras também pode liberar à mão (`R0`).
- **A carga chega com a nota.** A doca informa o número ou a chave de 44 dígitos da NF. Sem NF, a parcial não sai de Compras · CCP (`R0`).
- **A doca confere contra a NF.** Conta o que chegou e compara com a nota, não com a OC. Receber mais do que o pedido é permitido, e a sobra fica livre no estoque (`R1`).
- **A doca pesa.** Se o material tem peso teórico, o peso real é obrigatório. Desvio acima de 5% vira divergência de peso (`R2`).
- **O sistema confere.** Se não há divergência, o lote nasce na hora. Se há, nada entra e outra pessoa precisa recontar (`R3`).
- **Cria o lote em quarentena.** O lote nasce pendente, com entrada no saldo. Segue para a Qualidade (`R4`).
- **Chegou só uma parte?** Essa parte vai à Qualidade. O restante volta a Compras · CCP, esperando a próxima NF (`R4`).
- **Divergência: outra pessoa reconta.** Quem conferiu não reconta. A recontagem pede todos os itens (`R6`).
- **Se a recontagem ainda diverge, o PCP decide.** Aceita (entra o que foi recontado) ou reabre (nada entra e a parcial volta a Compras). O motivo é obrigatório (`R6`).
- | Doca (conferente) | Registra a chegada com a NF, conta, pesa e informa avaria e descrição |
- | Segunda pessoa | Reconta quando há divergência |
- | PCP | Aceita ou reabre quando a recontagem continua divergindo |
- | Compras | Libera para o Recebimento sem OC aprovada; em geral só o Administrador |
- | Qualidade | Recebe o lote e inspeciona |
- A conferência é contra a nota, não contra o pendente nem contra a OC.
- Sem NF, a parcial não sai de Compras · CCP. Assim o tempo do fornecedor não cai no Recebimento.
- Divergência aberta trava a entrada no estoque.
- Quem conferiu não pode recontar.
- Peso real é obrigatório quando há peso teórico. Tolerância padrão de 5%, por material.
- O lote sempre nasce em quarentena, mesmo item acabado.
- O Recebimento nunca decide compra. A divergência vai ao PCP, e a reabertura devolve a Compras.
- Só pode haver um recebimento aberto por parcial.
- O custo do lote vem da OC, hoje é opcional e não bloqueia o recebimento. A N16-09 manda que todo lote tenha custo (obrigatório, BL-066), o que ainda não vale no código.
- Divergência contra a OC também bloqueia, quando o cruzamento existir (N16-135).
- ✅ (`app-pcp`) Telas de recebimento, recontagem e decisão do PCP; lote em quarentena com etiqueta em PDF.
- ✅ (`api-pcp`) Recebimento parcial com divisão da parcial.
- ✅ (`api-pcp`) Na `develop` do MES: o custo da OC é gravado no lote (19/10, `97b9adc`; unidade diferente da OC ou OC fora da projeção gera lote sem custo e sinalizado).
- ✅ Na `develop` do MES: entrada de mercadoria de OC sem requisição do MES (OC criada só no av-hub), por OC e por NF, e uso interno sem lote (16 a 20/10).
- 🔴 A conferência ainda não cruza com a OC (preço, quantidade comprada, fornecedor); só compara contado com a NF. O rateio da chegada entre destinos da OC também falta (API-011).
- 🔴 Aviso ao av-hub quando o PCP reabre o recebimento; leitor de código de barras da NF; reabertura de divergência de produção.
- 🟡 Aviso à doca quando uma OC esperada é cancelada.
- 🔴 Alerta de OC que passou da previsão sem chegar.
- ❓ Teste ponta a ponta com OC real.
- [[07-Recebimento-Detalhe-Tecnico-1]]: Nós · Quem atua (onde) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[07-Recebimento-Detalhe-Tecnico-2]]: Como está no código · Dados · Mercadoria de OC sem requisição do MES (C0) · O que falta desenvolver · Pendências · Subfluxo
