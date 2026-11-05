---
tags: [fluxo, raia, estoque, despacho, retirada, baixa, mes, e6]
criado: 2026-11-05
atualizado: 2026-11-05
status: vigente
nos: [E6]
dono: Robert (MES) · Nathan (decisões)
fontes: [00-Fluxo-Mestre-0b, dividida de 03-Estoque-Atendimento-e-Despacho da v2 (tag v2-antes-da-v3) em 05/11/2026, api-pcp 579a625 (itens-parciais.service.ts, estoque-operacao.helpers.ts), LOG-54, N16-120 a N16-122, N16-140]
---

# Raia Estoque: despacho (E6)

**Em uma frase:** na saída física, quem precisa da mercadoria pede ao Estoque um documento de retirada, e a baixa do saldo acontece na retirada; hoje a baixa ainda acontece quando a Embalagem recebe a parcial.

> [!info] Decisões de 29/10/2026 (N16-120 a N16-143)
> - O documento de retirada é pedido ao Estoque por quem precisa da mercadoria, Expedição ou Produção. Só o Estoque confirma (N16-120). O que o documento imprime segue aberto. Contrato: [[Contratos-da-v2|LOG-54]].
> - A reserva é consumida junto com a baixa. A saída grava lote, pedido e o custo do lote naquele momento (N16-121).
> - A Embalagem só recebe a parcial depois da retirada confirmada (N16-122).
> - A matéria-prima da produção sai por documento de retirada, pela quantidade pedida (N16-140).

## Como funciona, passo a passo

7. Na saída física, quem precisa da mercadoria pede um documento de retirada, e a baixa acontece na retirada. Hoje a baixa acontece quando a Embalagem recebe a parcial. `E6`

Os passos 1 a 5 estão em [[05-Estoque-Atendimento]]; o passo 6 (entrada do lote) em [[09-Estoque-Entrada-do-Lote]].

## Quem atua

| Quem | O que faz |
|---|---|
| Expedição (Embalagem) | Hoje dispara a baixa ao receber a parcial. No desenho final, pede a retirada |
| Produção | Receberia matéria-prima por documento de retirada, que ainda não existe |

O almoxarife, o Gestor de Estoque e o Robert estão em [[05-Estoque-Atendimento]].

## O que já existe e o que falta

- 🔴 Documento de retirada e baixa na retirada.
- 🔴 Baixa de matéria-prima na retirada (hoje é na hora do atendimento).

Entrada: [[11-Qualidade-Saida]] (fabricado aprovado) e o atendimento pelo saldo em [[05-Estoque-Atendimento]]. Próxima raia: [[13-Expedicao]].

## Detalhe técnico

Nó do [[00-Fluxo-Mestre-0b]]: `E6` despacho. Selos em [[Regras-do-Vault]].

### Quem atua (onde)

| Quem | Papel | Onde |
|---|---|---|
| Expedição (Embalagem) | Hoje dispara a baixa ao receber a parcial; no desenho final pede a retirada | MES, [[13-Expedicao]] |
| Produção | Receberia matéria-prima por documento de retirada (não existe) | MES, [[10-Producao-e-Roteiro]] |

### Regras decididas

A numeração é a da nota de Estoque da v2; as outras regras estão em [[05-Estoque-Atendimento]] e [[09-Estoque-Entrada-do-Lote]].

| # | Regra | Selo |
|---|---|---|
| 10 | **Despacho é no Estoque**: quem precisa da mercadoria gera o **documento de retirada**; a **baixa do saldo ocorre na retirada** | 📝 🔴 não existe; contrato [[Contratos-da-v2\|LOG-54]], decisões N16-120 a N16-122 |

### Telas

| Nome atual | Nome antigo | Rota | Slug | Estado |
|---|---|---|---|---|
| Retirada (documento de despacho) | — | — | — | 🔴 não existe |

### Endpoints e contratos

| Método e rota | Permissão | Efeito | Código |
|---|---|---|---|
| Documento de retirada (criar, listar, confirmar) | a definir | Gera a retirada; baixa o saldo | 🔴 sem contrato, sem rota |

### Como está no código

#### E6: despacho

✅ O que existe: quando a **Embalagem recebe** a parcial atendida (`PATCH /itens-parciais/:id/receber`), o código chama `consumirReservasDaParcial` (`itens-parciais.service.ts:275-285`). Ele tira o saldo das localizações do lote (maior saldo primeiro), grava um `MovimentoEstoque` `SAIDA` por pedaço com `idReserva`, e marca a reserva `CONSUMIDA` (`estoque-operacao.helpers.ts:208-284`). Se o saldo físico não cobre, 409 "registre um ajuste antes de entregar" (`:253-258`). Se a Embalagem desfaz o recebimento ou devolve ao Estoque, o saldo volta (`estornarConsumosDaParcial`).

🔴 O que o desenho decidido exige e não existe:
1. **Documento de retirada** gerado por quem precisa da mercadoria (Expedição ou Produção), com itens, lotes, quantidades e solicitante.
2. **Baixa na retirada**, feita pelo Estoque, e não no recebimento da Embalagem.
3. Reserva passa a significar só "separar sem despachar".
4. A matéria-prima enviada à produção também sai por documento de retirada.

Consequência de hoje: o saldo físico só cai quando a Expedição recebe; o almoxarife não tem registro de quem retirou, e item que sai para produção nunca baixa.

### O que falta desenvolver

| # | O quê | Dono | Nó | Selo |
|---|---|---|---|---|
| 1 | **Documento de retirada** (modelo, rotas, tela de pedido e de confirmação) e **baixa do saldo na retirada**; tirar `consumirReservasDaParcial` do `receber()` da Embalagem | Robert (decisão: Nathan) | E6 | 🔴 |

Os demais itens estão em [[05-Estoque-Atendimento]] e [[09-Estoque-Entrada-do-Lote]].

### Pendências

- Nathan: o documento de retirada nasce de quem? Expedição pede ao Estoque, ou o Estoque gera quando a parcial chega à Expedição? O que o documento imprime e quem confirma? **Decidido em 29/10/2026 (N16-120): a Expedição ou a Produção pede ao Estoque, e só o Estoque confirma. O que o documento imprime segue aberto.**
- Nathan: a Reserva continua existindo depois da retirada (para rastrear custo) ou é consumida junto? **Decidido em 29/10/2026 (N16-121): consumida junto com a baixa.**
