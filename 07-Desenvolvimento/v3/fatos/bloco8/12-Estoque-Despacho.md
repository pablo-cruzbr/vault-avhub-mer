# Fatos de 12-Estoque-Despacho

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/12-Estoque-Despacho.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir 12-Estoque-Despacho`.

## decisões e IDs (5)

- `N16-120`
- `N16-121`
- `N16-122`
- `N16-140`
- `N16-143`

## contratos (1)

- `LOG-54`

## commits (0)


## arquivo:linha (2)

- `estoque-operacao.helpers.ts:317-393`
- `itens-parciais.service.ts:318-328`

## rotas (1)

- `PATCH /itens-parciais/:id/receber`

## datas (1)

- `29/10/2026`

## código entre crases (12)

- `:253-258`
- `CONSUMIDA`
- `E6`
- `MovimentoEstoque`
- `PATCH /itens-parciais/:id/receber`
- `SAIDA`
- `consumirReservasDaParcial`
- `estoque-operacao.helpers.ts:317-393`
- `estornarConsumosDaParcial`
- `idReserva`
- `itens-parciais.service.ts:318-328`
- `receber()`

## regras e linhas de conteúdo (20)

- Na saída física, quem precisa da mercadoria pede um documento de retirada, e a baixa acontece na retirada. Hoje a baixa acontece quando a Embalagem recebe a parcial. `E6`
- | Expedição (Embalagem) | Hoje dispara a baixa ao receber a parcial. No desenho final, pede a retirada |
- | Produção | Receberia matéria-prima por documento de retirada, que ainda não existe |
- 🔴 Documento de retirada e baixa na retirada.
- 🔴 Baixa de matéria-prima na retirada (hoje é na hora do atendimento).
- | Expedição (Embalagem) | Hoje dispara a baixa ao receber a parcial; no desenho final pede a retirada | MES, [[13-Expedicao]] |
- | Produção | Receberia matéria-prima por documento de retirada (não existe) | MES, [[10-Producao-e-Roteiro]] |
- | 10 | **Despacho é no Estoque**: quem precisa da mercadoria gera o **documento de retirada**; a **baixa do saldo ocorre na retirada** | 📝 🔴 não existe; contrato [[Contratos-da-v2\|LOG-54]], decisões N16-120 a N16-122 |
- | Nome atual | Nome antigo | Rota | Slug | Estado |
- | Retirada (documento de despacho) | — | — | — | 🔴 não existe |
- | Método e rota | Permissão | Efeito | Código |
- | Documento de retirada (criar, listar, confirmar) | a definir | Gera a retirada; baixa o saldo | 🔴 sem contrato, sem rota |
- **Documento de retirada** gerado por quem precisa da mercadoria (Expedição ou Produção), com itens, lotes, quantidades e solicitante.
- **Baixa na retirada**, feita pelo Estoque, e não no recebimento da Embalagem.
- Reserva passa a significar só "separar sem despachar".
- A matéria-prima enviada à produção também sai por documento de retirada.
- | # | O quê | Dono | Nó | Selo |
- | 1 | **Documento de retirada** (modelo, rotas, tela de pedido e de confirmação) e **baixa do saldo na retirada**; tirar `consumirReservasDaParcial` do `receber()` da Embalagem | Robert (decisão: Nathan) | E6 | 🔴 |
- Nathan: o documento de retirada nasce de quem? Expedição pede ao Estoque, ou o Estoque gera quando a parcial chega à Expedição? O que o documento imprime e quem confirma? **Decidido em 29/10/2026 (N16-120): a Expedição ou a Produção pede ao Estoque, e só o Estoque confirma. O que o documento imprime segue aberto.**
- Nathan: a Reserva continua existindo depois da retirada (para rastrear custo) ou é consumida junto? **Decidido em 29/10/2026 (N16-121): consumida junto com a baixa.**
