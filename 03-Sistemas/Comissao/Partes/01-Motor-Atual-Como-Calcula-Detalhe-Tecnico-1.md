---
tags: [comissao, motor-atual, core_comissionamento, proposta, validacao, parte]
criado: 2026-11-05
estado-em: 2026-11-13
status: proposta
dono: Nathan
parte-de: "[[01-Motor-Atual-Como-Calcula]]"
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [dump core_comissionamento convertido (09-Diagramas/fontes), api-acos-vital f322dcd src/schemas/core_comissionamento, av-hub lib/simulador/motor.ts, av-hub app/(protected)/comissoes/simulador e analise-simuladores, av-hub app/api/comissoes, tela-simulador-comissao.png, N16-10, N16-11, N16-18, N16-19, N16-20]
---

# Como o motor de comissão atual calcula: detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[01-Motor-Atual-Como-Calcula]] (parte 1 de 2): Resumo em dez linhas; Visão do fluxo atual; 1. Quem faz o quê hoje; 2. Regra a regra.

**Onde estamos:** ← [[01-Motor-Atual-Como-Calcula]] (resumo e índice) · partes: **01-Motor-Atual-Como-Calcula-Detalhe-Tecnico-1** · [[01-Motor-Atual-Como-Calcula-Detalhe-Tecnico-2]]

## Resumo em dez linhas

1. O **vendedor** preenche um "simulador" por pedido, item a item: custo de compra, impostos, preço de venda. O simulador calcula a **margem líquida de cada item** e dá uma **letra** (A, B, C ou D) e um **percentual** de comissão.
2. **Compras** abre a mesma simulação, corrige os custos para o valor real e gera uma segunda versão, com o **percentual de Compras**.
3. A comissão de cada item usa o **menor** entre o percentual do vendedor e o de Compras (`pct_final`).
4. Alguns clientes têm **regra fixa**: um teto de percentual, que muda conforme o markup do pedido.
5. Item de **fabricação interna** paga um percentual fixo (hoje 2%) e não entra na margem. Item em **prejuízo** não paga nada.
6. A comissão só vira dinheiro **depois de faturar**: valor faturado do item na NF × `pct_final`.
7. **Bloqueio por NF** zera a comissão daquela nota. **Lista de bloqueio** (cliente ou vendedor) tira a nota do cálculo.
8. O vendedor **não vê o valor** antes de Compras aprovar.
9. Os **coordenadores** têm conta à parte: ajuda de custo mais um percentual do faturamento total do mês.
10. Quem valida hoje é **Compras**; não existe etapa de Controladoria. Isso muda no módulo novo (N16-10).

## Visão do fluxo atual

```mermaid
flowchart LR
    V["Vendedor<br/>preenche o simulador<br/>(RASCUNHO → ENVIADO)"] --> C["Compras<br/>analisa e corrige<br/>(APROVADO)"]
    C --> M["Menor percentual<br/>por item<br/>(pct_final)"]
    R["Regra fixa<br/>do cliente<br/>(teto)"] --> M
    M --> F["NF faturada<br/>valor do item × pct_final"]
    F --> B["Bloqueio por NF<br/>zera o valor"]
    L["Lista de bloqueio<br/>cliente / vendedor<br/>tira a nota"] --> F
    B --> P["Comissão a pagar<br/>(situação VALIDADO)"]
```

## 1. Quem faz o quê hoje

| Quem | O que faz | Onde |
|---|---|---|
| Vendedor | Preenche, salva rascunho e envia o simulador do pedido | `comissoes/simulador/page.tsx` (envio em `:1148-1190`) |
| Compras | Aprova a simulação como está, ou cria uma versão com os custos corrigidos e aprova | `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:803-845` (`aprovarCompras`), fila em `comissoes/analise-simuladores/page.tsx` |
| Analista/Gerência | Acompanha o mês na Visão Geral e bloqueia NF | `comissoes/visao-geral`, `comissoes/bloqueio-comissoes` |
| Coordenador | Recebe ajuda de custo e percentual sobre o faturamento do mês | `comissao_coordenadores`, `fn_dashboard_comissoes` |

✅ O simulador é **calculado no navegador** (`av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:664` (`calcularSimulacao(form, parametros)`)) por uma função do front, `lib/simulador/motor.ts`. O banco guarda o resultado e só faz a conta do **menor percentual** (view `vw_simulacao_resolvida`). Isso importa para o módulo novo: o motor precisa sair do navegador (ver nota 03).

## 2. Regra a regra

### R1. Custo líquido do item (o que a empresa gasta para ter o item)

**O que faz.** Soma o que se paga ao fornecedor, tira o ICMS que a empresa recupera e soma IPI, ST e frete de compra.

- Compra bruta = quantidade comprada × preço unitário de compra.
- ICMS recuperável = compra bruta × alíquota da **origem da compra** (zero se o item tem ST).
- IPI = compra bruta × % de IPI.
- Frete: ou **rateio** (`pct_rateio_logistica`, hoje 1,438975% sobre compra + IPI + ST) ou **valor** informado por linha.
- **Custo líquido** = compra bruta − ICMS recuperável + IPI + ST + frete.

**Exemplo.** 50 flanges a R$ 100 de custo, origem "Demais estados" (12%), sem IPI nem ST, frete por rateio:

| Passo | Conta | Valor |
|---|---|---|
| Compra bruta | 50 × 100 | R$ 5.000,00 |
| ICMS recuperável | 5.000 × 12% | R$ 600,00 |
| Frete (rateio) | 5.000 × 1,438975% | R$ 71,95 |
| **Custo líquido** | 5.000 − 600 + 0 + 0 + 71,95 | **R$ 4.471,95** |

**De onde vem.** ✅ `lib/simulador/motor.ts:283-289` (compra, IPI, crédito de ICMS), `:307-312` (frete e custo líquido). Alíquotas: `simulador_parametros.icms_entrada` e `pct_rateio_logistica` (`dump:909-952`). A quantidade da compra é separada da quantidade da venda (`qtd_compra`, `dump:697-699`); o motor não converte unidade, cada lado usa o seu total.

### R2. Margem líquida do item

**O que faz.** Pega o preço de venda do item e desconta custo líquido, despesas operacionais, impostos sobre a venda e a provisão de comissão. O que sobra, dividido pela venda, é a **margem líquida do item**. É ela que decide a letra.

- Despesas operacionais: `pct_despesas_operacionais` (hoje 11,451734%).
- Impostos sobre a venda: ICMS efetivo do destino + PIS + COFINS + IRPJ + CSLL + adicional de IR. Com ICMS 12% a soma é **18,252%**.
- Provisão de comissão: `pct_comissao_provisao` (hoje 2%).
- Item "isento de imposto" zera o bloco de impostos inteiro.

**Exemplo** (mesmo item, venda a R$ 230 a unidade, destino Minas Gerais):

| Passo | Conta | Valor |
|---|---|---|
| Venda do item | 50 × 230 | R$ 11.500,00 |
| Despesas operacionais | 11.500 × 11,451734% | R$ 1.316,95 |
| Impostos | 11.500 × 18,252% | R$ 2.098,98 |
| Provisão de comissão | 11.500 × 2% | R$ 230,00 |
| Lucro do item | 11.500 − 4.471,95 − 1.316,95 − 2.098,98 − 230 | R$ 3.382,12 |
| **Margem líquida** | 3.382,12 ÷ 11.500 | **29,41%** |

**De onde vem.** ✅ `lib/simulador/motor.ts:342-354` (lucro e margem), `:104-110` (impostos), `:144-167` (ICMS efetivo na venda: importação, base reduzida e ST têm regras próprias). Gravado em `simulacao_itens.margem_item` (`dump:745-747`).

### R3. Letra e percentual do vendedor

**O que faz.** A margem líquida do item cai numa faixa. Cada faixa tem uma letra e um percentual de comissão. Os intervalos são "de X até antes da próxima faixa".

| Letra | Margem líquida do item | Percentual |
|---|---|---|
| A | 15% ou mais | 2,0% |
| B | 12% até menos de 15% | 1,3% |
| C | 9% até menos de 12% | 0,7% |
| D | 0% até menos de 9% | 0,5% |

**Exemplo.** Margem 29,41% → letra A → 2%. Comissão estimada do item: 11.500 × 2% = **R$ 230,00**.

**De onde vem.** ✅ `av-hub` `lib/simulador/motor.ts:165-168` (`faixaDaMargem`) e `:364-376`. Faixas em `simulador_parametros.faixas_comissao` (`dump:998-1000`, valores em `dump:1660`). A letra é decidida **por item**; a letra do pedido (`simulacoes.letra_equivalente`) é só informativa (`dump:901-902`).

### R4. Prejuízo e fabricação interna

**O que faz.**
- **Prejuízo:** item de revenda com lucro menor ou igual a zero (ou sem preço de venda) paga **0%**, qualquer que seja a letra.
- **Fabricação interna:** item fabricado pela empresa paga um **percentual fixo** (`pct_fabricacao_interna`, hoje 2%). Não tem custo de compra informado, então **não entra na margem do pedido** e **não tem teto de regra fixa**.

**Exemplo.** Flange sobre desenho (fabricação interna) vendida a R$ 1.800: 1.800 × 2% = **R$ 36,00**. Item de revenda com venda de R$ 4.000 e custo líquido de R$ 4.471,95: prejuízo, comissão **R$ 0,00**.

**De onde vem.** ✅ `motor.ts:369-394`. Fabricação vem **antes** do teste de prejuízo de propósito (`:364-371`). Regra gravada em `simulacao_itens.regra_aplicada` (`PREJUIZO`, `FABRICACAO_INTERNA`, `LETRA`, `TETO_PADRAO`, `TETO_CONDICIONAL`; `dump:704, 754-756`).

### R5. Percentual de Compras

**O que faz.** Compras abre a simulação do vendedor e, se o custo estiver errado, grava uma **segunda versão** (origem `COMPRAS`) com o custo correto. O motor roda de novo e dá um novo percentual por item. A versão do vendedor passa a `CONTESTADO`; a de Compras fica `APROVADO`. Se Compras concorda, só aprova a versão do vendedor.

**Estados da simulação:** `RASCUNHO` → `ENVIADO` → `APROVADO`, `CONTESTADO` ou `DEVOLVIDO`. Os três últimos são finais; versão enviada não muda, correção é versão nova.

**De onde vem.** ✅ `simulacoes.route.js:30-36` (transições), `:233-259` (Compras contesta a do vendedor no mesmo POST), `:311-345` (transição; `DEVOLVIDO` exige motivo), `:348-351` (só rascunho edita). Tela: `av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:803-845` (`aprovarCompras`).

### R6. `pct_final`: o menor dos dois

**O que faz.** Para cada item: `pct_final` = o **menor** entre o percentual do vendedor e o de Compras. Se Compras não analisou, vale o do vendedor. Consequência: **custo real melhor que o cotado não aumenta a comissão**; só o pior caso conta.

**Exemplo.** Pedido 27917, conferido no `dump` (vendedor: letra A nos 2 itens; Compras refez o custo do item 1 e ele caiu para letra C):

| Item | % vendedor | % Compras | `pct_final` |
|---|---|---|---|
| 1 | 2,0% (A) | 0,7% (C) | **0,7%** |
| 2 | 2,0% (A) | 2,0% (A) | **2,0%** |

**De onde vem.** ✅ `vw_simulacao_resolvida`: `LEAST(...)` em `dump:1186-1190`. Dados em `dump:1648-1649`. A comissão do vendedor para esse pedido era R$ 216,69 e a de Compras R$ 142,48 (`dump:1648-1649`).

### R7. Regras fixas por cliente (teto)

**O que faz.** Alguns clientes têm um **teto** de percentual combinado. Cada cliente (por unidade) tem três números: comissão **padrão**, comissão **condicional** e a **margem** de gatilho. O teto vale assim: se o **markup bruto** do pedido for **maior ou igual** à margem de gatilho, o teto é a condicional; senão, a padrão. O teto só limita item de **revenda** que pagou pela letra.

Atenção: o gatilho usa o **markup bruto** do pedido, `(total da NF − compra bruta) ÷ compra bruta`, e **não** a margem líquida da letra. No pedido 26616 as duas dão 115,24% e 16,37% (`dump:891-894`). No novo modelo o campo `margem` passa a se chamar `gatilho_markup_pct` para não confundir.

**Exemplo.** Cliente com padrão 0,5%, condicional 1,3% e gatilho 100%. Pedido com markup bruto de 127,87%: usa a condicional (1,3%). Item de letra A (2%) fica em **1,3%**. Se Compras refez o custo e o markup do pedido dela caiu para 60,19% (abaixo de 100%), o teto da versão de Compras é 0,5%; o `pct_final` é o menor dos dois tetos, **0,5%**. Esse é o caso do pedido 27917: 5.709,01 × 0,5% + 5.125,68 × 0,5% = **R$ 54,18** (e não os R$ 142,48 de Compras sem o teto). Conta feita sobre o valor do pedido; o real usa o faturado.

**De onde vem.** ✅ A view aplica o teto: `dump:1151-1198` (cada versão usa o markup da própria versão; `regra_fixa_aplicada` em `:1136-1142`). Regra em `regras_comissoes_fixas` (`dump:589-603`). ⚠️ O motor do front **tem** um trecho que aplica o teto (`av-hub` `lib/simulador/motor.ts:442-459` (`regraFixa`)), mas a tela chama `calcularSimulacao(form, parametros)` **sem** a regra fixa (`av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:664` (`calcularSimulacao(form, parametros)`)): na prática o teto só é aplicado pela view.

### R8. Comissão em reais: sobre o faturado, por item

**O que faz.** O dinheiro só existe depois de faturar. Para cada item que saiu em uma NF: `valor da comissão = valor faturado do item × pct_final ÷ 100`, arredondado a 2 casas. Item **ainda não faturado fica sem valor (nulo, pendente), nunca zero**.

**Exemplo.** Item faturado em R$ 5.709,01 com `pct_final` 0,5% → 28,545 → **R$ 28,55**.

**De onde vem.** ✅ `dump:1128` (`valor_comissao`), `:1129` (`economia_compras`, comparada com a **primeira** versão do vendedor), `:1105-1113` (faturado por `codigo_empresa` + `codigo_item_omie`, não por código do pedido Omie, que muda quando o Omie recria o pedido; `dump:863-865`).

### R9. Comissão por NF e situação

**O que faz.** Soma os itens da NF. O percentual efetivo da NF é **ponderado** pelo valor dos itens. A **situação** da NF é a mais grave entre seus itens, nesta ordem: `BLOQUEADA`, `SEM_SIMULADOR`, `RASCUNHO`, `AGUARDANDO_COMPRAS`, `ITENS_FORA_DO_SIMULADOR`, `VALIDADO`. Só `VALIDADO` entra em "a pagar". A validação é **do pedido**: aprovado uma vez, vale para todas as NFs, inclusive de meses depois.

Também conta os itens da NF **sem vínculo** com a simulação (`qtd_itens_sem_vinculo`): é o aviso do caso "simulou 8, faturou 10".

**De onde vem.** ✅ `vw_comissao_master` situação em `dump:1348-1360`; `vw_comissao_nf` em `dump:1426-1465` (ponderação em `:1444`); resumo do mês em `dump:1520`. A lista só considera NF faturada, de venda líquida, com pedido e vendedor (`dump:1305`).

### R10. O vendedor só vê o valor depois da aprovação

**O que faz.** Enquanto Compras não aprova, o vendedor vê a **letra** e a margem do item, mas **não o valor em reais**. O corte é feito no servidor da tela (BFF), não no CSS, para o número não ir no JSON.

**De onde vem.** ✅ `av-hub` `app/api/comissoes/minhas-comissoes/route.ts:26-29` (`O CORTE DO VALOR`), `:221` (validado = alguma versão `APROVADO`), `:225-235` (situação), `:241-256` (percentual, valor e teto só se validado). ✅ No simulador a coluna de comissão em reais só aparece na visão de Compras (`av-hub` `components/Comissoes/Simulador/useSimuladorComissao.ts:152` (`mostrarComissao = modoCompras`)). 🟡 No módulo novo o corte passa para o banco e a API (nota 03), porque o BFF não é barreira de segurança.

### R11. Bloqueio por NF

**O que faz.** Uma NF pode ser **bloqueada**: o valor da comissão daquela nota vira zero, com um motivo em texto livre. Desbloquear é marcar "não bloqueada" (a linha fica, com quem mexeu). Não existe chave para a NF: o número é digitado com zeros à esquerda (`00051698`) e, se vier sem os zeros, **o bloqueio nunca casa e nada avisa**.

**Dados hoje:** 2 linhas, **ambas desbloqueadas**, sem motivo (`dump:1570-1571`).

**De onde vem.** ✅ `bloqueio_comissoes` (`dump:410-420`), uso em `vw_comissao_master` (`dump:1338-1347, 1368`). O motivo é opcional (`dump:465-468`).

### R12. Listas de bloqueio: cliente e vendedor

**O que faz.** Cliente na lista de bloqueio, ou vendedor na lista, **faz a NF sair do cálculo**: a nota não aparece na lista de comissões. Não confundir com `blacklist_vendedor_g5` do faturamento, que é outra coisa (cascata de deduções da venda líquida).

**Dados hoje:** 1 cliente e 8 vendedores, sem observação (`dump:1549, 1556-1563`).

**De onde vem.** ✅ `blacklist_comissoes_destinatario` e `blacklist_comissoes_vendedores` (`dump:333-342, 372-381`), usadas nos `NOT EXISTS` da `vw_comissao_master` (`dump:1305-1309`). Não têm data: valem para sempre, sobre qualquer NF, inclusive de meses já pagos.

### R13. Valor máximo (pior caso)

**O que faz.** Para planejar o mês antes de existir simulador, a Visão Geral mostra o **valor máximo possível**: valor do item × o menor entre a maior faixa vigente (2%) e o maior dos dois percentuais da regra fixa do cliente. Se a nota já está validada, mostra o valor real.

**De onde vem.** ✅ `dump:1361-1365` e comentário `:1410-1419`.

### R14. Resumo mensal e cartões

**O que faz.** Mostra por mês e por vendedor: notas por situação, faturado, comissão a pagar (só `VALIDADO`), valor máximo, bloqueado e economia de Compras. A linha de total e as linhas por vendedor vêm juntas (`is_total`); somar sem filtrar duplica.

⚠️ **A coluna "bloqueado" do resumo é sempre zero.** A conta é `valor_faturado_nf × 0` (`dump:1522`). Quem lê "comissões bloqueadas" nessa view vê R$ 0, mesmo com NF bloqueada. No módulo novo o valor retido é a soma do valor calculado das NFs bloqueadas.

### R15. Coordenadores

**O que faz.** Coordenadores não dependem de proposta. Cada um tem **ajuda de custo** (valor fixo) e um **percentual**, com data de vigência. Duas famílias:
- **Gerência:** ranking próprio; comissão = percentual ÷ 100 × **faturamento total do mês** (todas as vendas líquidas).
- **Exceção:** entra no ranking dos vendedores, com a mesma conta.

`total = ajuda de custo + comissão − bloqueado`. O **bloqueio por NF não vale para coordenador** (decisão do Nathan de 06/10/2026, contrato 38): a função é sempre chamada com bloqueio desligado. O ranking ordena por total e, em empate, por `ordem_desempate`, depois por nome.

**Exemplo (valores inventados; os reais ficam no banco):** faturamento do mês R$ 10.000.000; percentual 0,30%; ajuda de custo R$ 4.000. Comissão = 0,30 ÷ 100 × 10.000.000 = R$ 30.000; total = R$ 34.000.

**Mudar valor** = fechar a vigência e abrir outra, para meses passados não mudarem. Se a pessoa tem duas vigências no mês (troca no meio), vale a que começou por último. Toda alteração fica num histórico que **não pode ser editado nem apagado**.

**Dados hoje:** 5 de gerência e 1 de exceção, todos com vigência desde 01/01/2000 (carga do `coordenadores.json`, `dump:1578-1583`). Os valores nominais não são copiados aqui.

**De onde vem.** ✅ `fn_dashboard_comissoes` (`dump:111-287`; conta do coordenador em `:179-194`), `fn_comissao_coordenadores_mes` (`dump:85-95`), tabela e travas (`dump:475-498, 1693`), histórico e imutabilidade (`dump:35-54, 70-76, 1883-1890`). ✅ Bloqueio desligado: `fn_dashboard_comissoes.route.js:20-22, 50`. ✅ A tela `dash-comissoes` ainda lê `lib/comissoes/coordenadores.json` do repositório e calcula no navegador (`LOG-42`, [[Comissoes]]). A tabela `comissao_coordenadores` **não tem rota na API**; só a função de leitura.

### R16. Vendedores do dashboard

**O que faz.** A lista de vendedores do dashboard (`dash-comissoes`) vem do **relatório provisório do mês** (`comissoes_provisoria`, um JSON que um gerador externo grava), e não das views novas. A comissão e o bloqueio ali "como o gerador mandou".

**De onde vem.** ✅ `fn_dashboard_comissoes` (`dump:158-161, 197-214`), `comissoes_provisoria.route.js` (PUT grava o JSON). ❓ Quem é o gerador (o "sistema Python" que o código cita) não está nos repositórios lidos.

### R17. Parâmetros e versão

**O que faz.** Os percentuais (faixas, impostos, despesas, ICMS, encargos de pagamento, margem desejada, fabricação interna) ficam numa tabela com **vigência** por unidade. A simulação grava qual versão usou (`id_parametros`) e fica amarrada a ela. **Não se edita parâmetro vigente**: fecha-se a vigência e abre-se outra.

**Dados hoje:** 3 linhas (uma por unidade), todas "Maio/23", vigência aberta, valores iguais (`dump:1660-1662`).

**De onde vem.** ✅ `simulador_parametros` (`dump:909-952`), regra no comentário `dump:961-965`, exclusão de sobreposição `dump:1701`.

### R18. Mark-up e preço sugerido (informativo)

**O que faz.** O simulador sugere um preço de venda: `mark-up = 1 ÷ (1 − (margem desejada + despesas + impostos + provisão))`, arredondado **para cima** em 2 casas, aplicado ao custo líquido por unidade, mais o encargo da condição de pagamento. Não decide comissão.

**Exemplo.** Soma = 10 + 11,451734 + 18,252 + 2 = 41,703734%. Mark-up = 1 ÷ 0,58296266 = 1,7153 → **1,72**.

**De onde vem.** ✅ `motor.ts:119-133, 324-326`. O arredondamento para cima copia o `ROUNDUP` da planilha (`:40-55`).
