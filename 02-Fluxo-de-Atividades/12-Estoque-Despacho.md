---
tags: [fluxo, raia, estoque, despacho, retirada, baixa, mes, e6]
criado: 2026-11-05
estado-em: 2026-11-23
status: vigente
ordem: 12
nos: [E6]
anterior: "[[11-Qualidade-Saida]]"
proxima: "[[13-Expedicao]]"
develop-conferida: [api-pcp c8036db, app-pcp 8259344, em 2026-11-23; api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Nathan (MES e decisões, N16-180)
fontes: [00-Fluxo-Mestre-0b, dividida de 03-Estoque-Atendimento-e-Despacho da v2 (tag v2-antes-da-v3) em 05/11/2026, api-pcp 579a625 (itens-parciais.service.ts, estoque-operacao.helpers.ts), LOG-54, N16-120 a N16-122, N16-140, N16-180, api-pcp c8036db (motor do Estoque, PR #86)]
---

# Raia Estoque: despacho (E6)

**Em uma frase:** na saída física, quem precisa da mercadoria pede ao Estoque um documento de retirada, e a baixa do saldo acontece na retirada; hoje a baixa ainda acontece quando a Embalagem recebe a parcial.

**Quando consultar:** dúvidas sobre a saída física: o documento de retirada e o momento da baixa do saldo.

**Onde estamos no fluxo:** ← [[11-Qualidade-Saida]] | [[13-Expedicao]] → · nós desta nota: `E6`

## Como funciona, passo a passo

7. Na saída física, quem precisa da mercadoria pede um documento de retirada, e a baixa acontece na retirada. Hoje a baixa acontece quando a Embalagem recebe a parcial. `E6`

Os passos 1 a 5 estão em [[05-Estoque-Atendimento]]; o passo 6 (entrada do lote) em [[09-Estoque-Entrada-do-Lote]].

## Quem atua

| Quem | O que faz |
|---|---|
| Expedição (Embalagem) | Hoje dispara a baixa ao receber a parcial. No desenho final, pede a retirada |
| Produção | Receberia matéria-prima por documento de retirada, que ainda não existe |

O almoxarife, o Gestor de Estoque e o Nathan (dono do código, N16-180) estão em [[05-Estoque-Atendimento]].

## Regras que valem

Decisões de 29/10/2026 (bloco N16-120 a N16-143). Contrato: [[Contratos-da-v2|LOG-54]].

- Quem precisa da mercadoria pede o documento de retirada ao Estoque: a Expedição ou a Produção. Só o Estoque confirma (N16-120).
- O que o documento imprime ainda está em aberto.
- A reserva é consumida junto com a baixa. A saída grava o lote, o pedido e o custo do lote naquele momento (N16-121).
- A Embalagem só recebe a parcial depois da retirada confirmada (N16-122).
- A matéria-prima da produção também sai por documento de retirada, pela quantidade pedida (N16-140).

## O que já existe e o que falta

- ✅ (`api-pcp`) A baixa de hoje (no recebimento da Embalagem) passa pelo motor único do Estoque, com o custo do lote e as travas do banco (N16-184).
- 🔴 Documento de retirada e baixa na retirada (BL-007).
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

✅ O que existe: quando a **Embalagem recebe** a parcial atendida (`PATCH /itens-parciais/:id/receber`), o código chama `consumirReservasDaParcial`: `api-pcp` `src/itens-parciais/itens-parciais.service.ts:318` (`await consumirReservasDaParcial(tx, {`). A entrega chama de novo, por garantia, e não faz nada se já consumiu: `src/entregas/entregas.service.ts:72` (`await consumirReservasDaParcial(tx, {`). O helper `src/estoque/operacao/estoque-operacao.helpers.ts:272` (`export async function consumirReservasDaParcial(`) trava os lotes, consome as reservas mais antigas e tira o saldo pelo motor, `estoque-operacao.helpers.ts:295` (`await registrarSaidaDoLote(tx, {`): maior saldo primeiro, um `SAIDA` por pedaço com `idReserva` e o custo do lote; a reserva vira `CONSUMIDA` quando zera. Se o saldo físico não cobre, 409 "registre um ajuste de estoque antes de entregar", `estoque-operacao.helpers.ts:302` (`Saldo físico do lote da reserva não cobre`). Se a Embalagem desfaz o recebimento ou devolve ao Estoque, o saldo volta (`estornarConsumosDaParcial`).

🔴 O que o desenho decidido exige e não existe:
1. **Documento de retirada** gerado por quem precisa da mercadoria (Expedição ou Produção), com itens, lotes, quantidades e solicitante.
2. **Baixa na retirada**, feita pelo Estoque, e não no recebimento da Embalagem.
3. Reserva passa a significar só "separar sem despachar".
4. A matéria-prima enviada à produção também sai por documento de retirada.

Consequência de hoje: o saldo físico só cai quando a Expedição recebe; o almoxarife não tem registro de quem retirou, e item que sai para produção nunca baixa.

### O que falta desenvolver

| # | O quê | Dono | Nó | Selo |
|---|---|---|---|---|
| 1 | **Documento de retirada** (modelo, rotas, tela de pedido e de confirmação) e **baixa do saldo na retirada**; tirar `consumirReservasDaParcial` do `receber()` da Embalagem | Nathan (N16-180) | E6 | 🔴 BL-007 |

Os demais itens estão em [[05-Estoque-Atendimento]] e [[09-Estoque-Entrada-do-Lote]].

### Pendências

- Nathan: o que o documento de retirada imprime? Segue aberto.

Respondidas em 29/10/2026: quem gera o documento (a Expedição ou a Produção pede ao Estoque, e só o Estoque confirma, N16-120) e se a Reserva continua depois da retirada para rastrear custo (não: é consumida junto com a baixa, N16-121).
