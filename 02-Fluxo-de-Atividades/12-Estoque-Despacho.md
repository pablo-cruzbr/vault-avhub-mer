---
tags: [fluxo, raia, estoque, despacho, retirada, baixa, mes, e6]
criado: 2026-11-05
estado-em: 2026-11-24
status: vigente
ordem: 12
nos: [E6]
anterior: "[[11-Qualidade-Saida]]"
proxima: "[[13-Expedicao]]"
develop-conferida: [api-pcp 50f0a65, app-pcp 03fb038, em 2026-11-24 (coletor, PRs #99 e #86, N16-201); api-pcp 6bca516, app-pcp ffdcd3f, em 2026-11-24 (retirada, PRs #96, #97, #83 e #84); api-pcp c8036db, app-pcp 8259344, em 2026-11-23; api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Nathan (MES e decisões, N16-180)
fontes: [00-Fluxo-Mestre-0b, dividida de 03-Estoque-Atendimento-e-Despacho da v2 (tag v2-antes-da-v3) em 05/11/2026, api-pcp 579a625 (itens-parciais.service.ts, estoque-operacao.helpers.ts), LOG-54, N16-120 a N16-122, N16-140, N16-180, api-pcp c8036db (motor do Estoque, PR #86), N16-193, api-pcp 6bca516 (src/estoque/retirada/), app-pcp ffdcd3f (aba Retiradas)]
---

# Raia Estoque: despacho (E6)

**Em uma frase:** na saída física, o atendimento abre uma retirada no Estoque; o almoxarife separa pela lista impressa, confirma o que saiu e só então o saldo baixa e a Expedição ou a Produção recebe.

**Quando consultar:** dúvidas sobre a saída física: a retirada, a lista de separação, o momento da baixa do saldo e a devolução da sobra de matéria-prima.

**Onde estamos no fluxo:** ← [[11-Qualidade-Saida]] | [[13-Expedicao]] → · nós desta nota: `E6`

## Como funciona, passo a passo

7. Ao atender pelo estoque, a parte pronta abre uma retirada para a Expedição, e a matéria-prima de uma fabricação fica reservada e abre uma retirada para a Produção. O almoxarife imprime a lista de separação, separa e confirma o que saiu, no todo ou em parte. A baixa do saldo acontece nessa confirmação. A Expedição (ou a Produção) só recebe a parcial com a retirada concluída. A sobra de matéria-prima volta ao Estoque pela devolução da retirada. `E6`

Os passos 1 a 5 estão em [[05-Estoque-Atendimento]]; o passo 6 (entrada do lote) em [[09-Estoque-Entrada-do-Lote]].

## Exemplo

Uma parte pronta de 2 peças está reservada num lote. Ao atender, abre a retirada `RT-20261123-0001` para a Expedição. O almoxarife imprime a lista, tira 1 peça da prateleira e confirma 1: o saldo cai 1, a retirada fica `PARCIAL` e a Embalagem ainda não consegue receber. Ele confirma a outra peça, a retirada vai a `CONCLUIDA` e a Embalagem recebe a parcial.

## Quem atua

| Quem | O que faz |
|---|---|
| Almoxarife (Estoque) | Imprime a lista de separação, separa e confirma o que saiu; recebe a devolução da sobra de matéria-prima |
| Expedição (Embalagem) | Recebe a parcial depois da retirada concluída |
| Produção | Recebe a matéria-prima pela retirada e devolve a sobra |

O Gestor de Estoque e o Nathan (dono do código, N16-180) estão em [[05-Estoque-Atendimento]].

## Regras que valem

Decisões de 29/10/2026 (N16-120 a N16-122, N16-140) e de 23/11/2026 (N16-193). Contrato: [[Contratos-da-v2|LOG-54]].

- A retirada nasce do atendimento pelo estoque; só o Estoque confirma (N16-120). Confirma quem pode atuar num dos depósitos do lote; a confirmação pode ser parcial, e o resto continua reservado com a retirada aberta (N16-193).
- A lista de separação é um PDF A4: número, destino, quem pediu, pedido e OP; por linha, lote, endereço, material, quantidade com unidade e peso; assinatura de quem separou e de quem recebeu (N16-193).
- A reserva é consumida junto com a baixa. A saída grava o lote, o pedido, o custo do lote e o peso (N16-121, N16-182).
- A Expedição e a Produção só recebem a parcial depois da retirada concluída (N16-122).
- A matéria-prima sai pela quantidade pedida (N16-140). A sobra volta como devolução ao mesmo lote, no endereço de onde mais saiu, com o custo da saída, até o que saiu menos o que já voltou (N16-193).
- Liberar a reserva cancela a retirada aberta. Desfazer o recebimento depois da retirada não estorna a baixa.

## O que já existe e o que falta

- ✅ (`api-pcp` PR #96, `app-pcp` PR #83, 23/11) Retirada com lista de separação, confirmação parcial e baixa na confirmação (BL-007).
- ✅ (`api-pcp` PR #97, `app-pcp` PR #84, 23/11) Matéria-prima pela retirada e devolução da sobra.
- ✅ (`api-pcp` PR #99, `app-pcp` PR #86, 24/11) Separação pelo coletor: lê o endereço e o lote de cada linha, recusa o errado, e a baixa sai só do endereço lido (N16-201).
- 🟡 A parcial atendida antes de a retirada existir ainda baixa quando a Embalagem recebe (caminho antigo, para os dados de antes de 23/11).
- 🔴 As telas e permissões do Estoque em Acessos no tst e na produção (PS-060).
- Publicado na `main`: não (a `main` da `api-pcp` está no PR #84, de 18/11).

Entrada: [[11-Qualidade-Saida]] (fabricado aprovado) e o atendimento pelo saldo em [[05-Estoque-Atendimento]]. Próxima raia: [[13-Expedicao]].

## Detalhe técnico

Nó do [[00-Fluxo-Mestre-0b]]: `E6` despacho. Selos em [[Regras-do-Vault]].

### Quem atua (onde)

| Quem | Papel | Onde |
|---|---|---|
| Almoxarife | Confirma a retirada e recebe a devolução | MES, Estoque › Atender pedidos, aba Retiradas |
| Expedição (Embalagem) | Recebe a parcial com a retirada concluída | MES, [[13-Expedicao]] |
| Produção | Recebe a matéria-prima pela retirada | MES, [[10-Producao-e-Roteiro]] |

### Regras decididas

A numeração é a da nota de Estoque da v2; as outras regras estão em [[05-Estoque-Atendimento]] e [[09-Estoque-Entrada-do-Lote]].

| # | Regra | Selo |
|---|---|---|
| 10 | **Despacho é no Estoque**: o atendimento abre a **retirada**; a **baixa do saldo ocorre na confirmação da retirada** | ✅ `api-pcp` `src/estoque/retirada/retirada.ts:179` (`await registrarSaidaDoLote(tx, {`); N16-120 a N16-122, N16-193 |

### Telas

| Nome atual | Rota | Slug | Estado |
|---|---|---|---|
| Atender pedidos › aba Retiradas (lista, PDF, confirmar, devolver sobra) | `/estoque-operacao/atendimento` | `atendimento` | ✅ `app-pcp` `app/(protected)/estoque-operacao/atendimento/RetiradasAba.tsx:43` (`export default function RetiradasAba()`) |

### Endpoints e contratos

| Método e rota | Permissão | Efeito | Código |
|---|---|---|---|
| `GET /estoque/retiradas`, `GET /estoque/retiradas/:id` | `atendimento` visualizar | Lista e detalhe | ✅ `api-pcp` `src/estoque/retirada/retirada.controller.ts:29` (`@Controller('estoque/retiradas')`) |
| `GET /estoque/retiradas/:id/pdf` | `atendimento` visualizar | Lista de separação A4 | ✅ `retirada.controller.ts:47` (`@Get(':id/pdf')`) |
| `POST /estoque/retiradas/:id/confirmar` | `atendimento` editar + `Idempotency-Key` | Confirma o que saiu e baixa o saldo | ✅ `retirada.controller.ts:55` (`@Post(':id/confirmar')`) |
| `POST /estoque/retiradas/:id/devolucao` | `atendimento` editar + `Idempotency-Key` | Devolve a sobra de matéria-prima | ✅ `retirada.controller.ts:67` (`@Post(':id/devolucao')`) |

No `app-pcp`, o BFF repete as rotas em `app/api/estoque-operacao/retiradas/` (`route.ts`, `[id]/confirmar`, `[id]/devolucao`, `[id]/pdf`).

### Como está no código

#### E6: despacho

✅ **Abertura.** No atendimento pelo estoque, a parte `PRONTO` abre a retirada para a Expedição e a parte `MP` reserva a matéria-prima e abre a retirada para a Produção: `api-pcp` `src/itens-parciais/itens-parciais.service.ts:1211` (`if (parte.tipo === 'PRONTO') {`), `:1221` (`await reservarMateriaPrima(tx, {`) e `src/estoque/retirada/retirada.ts:37` (`export async function abrirRetiradaDaParcial(`). O número é `RT-AAAAMMDD-nnnn`, `retirada.ts:62` (`codigo: await gerarCodigo(tx),`).

✅ **Confirmação e baixa.** `retirada.ts:99` (`export async function confirmarRetirada(`) trava os lotes, recusa quantidade acima do que falta e baixa pelo motor com a reserva e a linha da retirada no movimento, `retirada.ts:156` (`vinculo: { idReserva: item.reserva.id, idRetiradaItem: item.id },`). Quem confirma tem de poder atuar num dos depósitos do lote: `src/estoque/retirada/retirada.service.ts:137` (`ensurePodeAtuarAlgumDeposito(userId, depositos)`). Todo movimento grava o peso: `src/estoque/motor/motor-estoque.ts:299` (`pesoKg: lote?.kgPorUnidade`).

✅ **Recebimento travado.** `itens-parciais.service.ts:280` (`const pendente = await retiradaPendenteDaParcial(this.prisma, id);`) responde 409 "Aguardando a retirada … no Estoque" enquanto a retirada não conclui.

✅ **Devolução da sobra.** `retirada.ts:227` (`export async function devolverSobraDaRetirada(`), só para destino `PRODUCAO`.

🟡 **Caminho antigo.** A parcial atendida antes da retirada existir ainda baixa no recebimento da Embalagem: `itens-parciais.service.ts:332` (`await consumirReservasDaParcial(tx, {`), e a entrega chama de novo por garantia, `src/entregas/entregas.service.ts:72` (`await consumirReservasDaParcial(tx, {`).

**Banco.** Migrations `20261123120000_estoque_retirada` (tipos `StatusRetirada` e `DestinoRetirada`, tabelas `retiradas` e `retirada_itens`, colunas `id_retirada_item` e `peso_kg` em `movimentos_estoque`) e `20261123150000_estoque_retirada_devolucao` (`quantidade_devolvida`). Detalhe em [[Banco-MES]].

### O que falta desenvolver

| # | O quê | Dono | Nó | Selo |
|---|---|---|---|---|
| 1 | Cadastrar as telas e permissões do Estoque em Acessos (tst e produção) | Nathan | E6 | 🔴 PS-060 |
| 2 | Ler a etiqueta do lote na confirmação da retirada (coletor) | Nathan | E6 | ✅ N16-201: o coletor lê o endereço e o lote de cada linha, recusa o errado e confirma com o `idLocalizacao` lido, `api-pcp` `src/estoque/retirada/retirada.ts:158` (`if (c.idLocalizacao) {`) |

Os demais itens estão em [[05-Estoque-Atendimento]] e [[09-Estoque-Entrada-do-Lote]].

### Pendências

Respondidas: quem gera a retirada e quem confirma (N16-120), se a reserva continua depois da retirada (não, é consumida junto com a baixa, N16-121) e o que a lista imprime (N16-193, 23/11/2026).
