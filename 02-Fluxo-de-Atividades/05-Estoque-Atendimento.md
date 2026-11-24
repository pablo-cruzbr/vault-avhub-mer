---
tags: [fluxo, raia, estoque, atendimento, reserva, lote, custo, inventario, kardex, mes, e1, e2, e3, e4]
criado: 2026-10-14
estado-em: 2026-11-24
status: vigente
ordem: 5
nos: [E1, E2, E3, E4]
anterior: "[[04-PCP-Triagem-e-Destinacao]]"
proxima: "[[06-Circuito-de-Compra]]"
develop-conferida: [api-pcp 50f0a65, app-pcp 03fb038, em 2026-11-24 (coletor, PRs #99 e #86, N16-201); api-pcp 6bca516, app-pcp ffdcd3f, em 2026-11-24 (retirada e matéria-prima pela retirada, PRs #96, #97, #83 e #84); api-pcp c8036db, app-pcp 8259344, em 2026-11-23; api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, app-pcp 4c11886, omie-elt-pipeline master 0593c9f, em 2026-11-10; api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13 (BL-050, reteste)]
dono: Nathan (MES e decisões, N16-180)
fontes: [00-Fluxo-Mestre-0b, dividida de 03-Estoque-Atendimento-e-Despacho da v2 (tag v2-antes-da-v3) em 05/11/2026, v1 02-PRD-Estoque e Estoque-Custo-do-Lote, API-008, LOG-53, N16-09, N16-140, N16-180 a N16-184, OQ-49, api-pcp c8036db (PRs #85 a #95: testes, motor, conferência do livro, lote v2, travas, idempotência, kardex, inventário, painel, consulta), app-pcp 8259344 (PRs #70 a #82), validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Raia Estoque: atendimento (E1 a E4)

**Em uma frase:** toda parcial de item passa primeiro pelo Estoque. O almoxarife atende o que o saldo cobre e decide o que fazer com o resto: comprar ou mandar para a produção.

**Quando consultar:** dúvidas sobre o que o almoxarife faz com a parcial (saldo, reserva, atender, comprar ou produzir) e sobre as telas, as travas e o inventário do Estoque.

**Onde estamos no fluxo:** ← [[04-PCP-Triagem-e-Destinacao]] | [[06-Circuito-de-Compra]] → · nós desta nota: `E1`, `E2`, `E3`, `E4`

## Como funciona, passo a passo

1. A parcial chega ao Estoque, vinda do PCP (planejamento e controle da produção), com a quantidade toda.
2. O almoxarife abre "Atender pedidos" e vê o saldo livre na filial do pedido: lotes liberados menos reservas. `E1`
3. Ele informa quanto atende, de zero até a quantidade da parcial, e de quais lotes. Atender zero é um clique. `E2`
4. O sistema reserva o lote e separa a parte atendida, que segue para a Expedição. `E3`
5. Para o restante, o almoxarife escolhe: solicitar compra ou enviar à produção (🔴 sem matéria-prima no estoque só a compra; veja a regra 7). `E4`

Depois:

- A entrada do lote comprado ou fabricado (passo 6, `E5`) está em [[09-Estoque-Entrada-do-Lote]]. A entrada do fabricado segue a [[Contratos-da-v2|LOG-53]].
- O despacho pela retirada (passo 7, `E6`) está em [[12-Estoque-Despacho]] (N16-120 a N16-122 e N16-140).

Fora do atendimento, o Estoque trabalha em 7 telas por tarefa (N16-184), listadas em "Telas", sem dado de exemplo.

## Exemplo

O pedido tem 100 flanges. O almoxarife encontra 40 em lotes liberados e informa 40. Elas viram uma parcial própria, com reserva, a caminho da Expedição. As 60 restantes seguem na parcial original. Se o destino for a Revenda, as 60 vão para a compra. Se for fabricação, ele informa a matéria-prima do estoque que vai consumir, e só as flanges cobertas por ela seguem para a produção; o que sobrar vai para compra. Quando a Expedição recebe a parcial, o saldo baixa com o custo do lote. O decidido é baixar na retirada (N16-120 a N16-122), que não existe.

## Quem atua

| Quem | O que faz |
|---|---|
| Almoxarife | Atende pelo saldo, solicita compra, dá entrada, ajusta, transfere e conta o inventário |
| Gestor de Estoque | Acompanha o painel e as pendências; aprova o ajuste de inventário acima do limite |
| Compras e CCP (acompanhamento de compras) | Recebem o "Solicitar compra" pelo setor Requisições |
| Nathan | Dono do código do Estoque no MES (sistema de chão de fábrica) desde 19/11 (N16-180) |

## Regras que valem

As decisões de 29/10/2026 estão no lote N16-120 a N16-143 e as de 19/11 em N16-180 a N16-184 do [[Registro-de-Decisoes]].

- O saldo livre é por filial: lotes liberados menos reservas ativas, na filial do pedido.
- Saldo zero exige clique. A parcial nunca passa sozinha.
- O saldo é lido e a reserva criada no mesmo passo, para evitar corrida entre pedidos.
- A reserva não expira. Termina por liberação explícita ou quando a ordem é excluída.
- Na Revenda, o restante sempre vai para compra.
- Na fabricação, o restante pode comprar matéria-prima ou seguir o roteiro (regra 7). 🔴 A `develop` só manda o restante para compra e recusa o roteiro sem matéria-prima; ❓ OQ-49.
- Ajuste de saldo não usa o que está reservado e exige motivo.
- A carga inicial exige custo. O recebimento sem custo entra com o alerta "Custo a informar". O fabricado segue sem custo (N16-181, N16-166).
- O Estoque é "blindado" (N16-184): um motor só muda o saldo; o banco recusa saldo negativo, movimento alterado e livro diferente do saldo; ação repetida não grava duas vezes; o livro é conferido todo dia.
- Inventário: os endereços ficam travados durante a contagem; o que diverge é recontado às cegas; ajuste acima de R$ 500 ou 2% (ou sem custo) precisa de aprovação de quem não contou (N16-183).
- O saldo fica na unidade do material; o lote guarda o peso real e o kg por unidade (N16-182).
- A matéria-prima baixa do saldo na retirada, não no atendimento (N16-140).

## O que já existe e o que falta

Tudo o que é MES de 19/11 em diante está só na `develop` (a `main` do MES é de 18/11).

- ✅ (`app-pcp`) As 7 telas do Estoque (N16-184), com o visual do Hub (N16-192); lista em "Telas".
- ✅ (`api-pcp`) Reserva, divisão da parcial, solicitar compra, entrada do item comprado e baixa na Embalagem.
- ✅ (`api-pcp`) Motor único, travas no banco, idempotência e conferência diária do livro (N16-184). ⚠ A migration das travas falha no deploy se o banco tiver dado que quebre as regras (PS-061).
- ✅ (`api-pcp`, `app-pcp`) Painel do Estoque e Mapa (visão por endereço) com dados reais.
- ✅ (`api-pcp`, `app-pcp`) Kardex do material ou do lote e linha do tempo do lote.
- ✅ (`api-pcp`, `app-pcp`) Inventário com contagem cega, recontagem e aprovação (N16-183).
- ✅ (`api-pcp`) Testes automatizados do Estoque (vitest em `test/estoque/`).
- ✅ (`api-pcp`) Fabricado aprovado vira lote `PRODUCAO` e saldo; `GET /itens/custo`; custo da OC no lote do Recebimento; baixa de matéria-prima no "Atender pelo estoque".
- ✅ (`api-pcp`, `app-pcp`) Saldo futuro (BL-050) no "Atender pelo estoque", na tela Estoque e no Material (🟡 não no "Atender OP", BL-090); a reprovada com recompra conta uma vez só no tst ([[Dump-AvHub-Teste-2026-11-13]]). 🟡 Requisições não mostra a OC de estoque a chegar (RS-008).
- 🟡 Custo obrigatório (BL-066, N16-181): a carga inicial recusa lote sem custo; o recebimento sem custo fica em alerta até alguém informar. Custo do fabricado adiado (BL-067, N16-166).
- ✅ Peso (N16-182): o lote guarda peso e kg por unidade e a OC em kg vira lote na unidade do material; todo movimento grava o peso proporcional à quantidade, `api-pcp` `src/estoque/motor/motor-estoque.ts:299` (`pesoKg: lote?.kgPorUnidade`).
- 🟡 Acessos: as telas `pendencias`, `movimentar`, `inventario`, `inventario-aprovar` e `coletor` só existem no banco de teste; falta cadastrar no tst e na produção, renomear o menu e tirar "Mapa do Depósito" (PS-060).
- ✅ Retirada (BL-007) e matéria-prima pela retirada (N16-140, N16-193): aba Retiradas no Atender pedidos (`api-pcp` PRs #96 e #97, `app-pcp` PRs #83 e #84, 23/11); detalhe em [[12-Estoque-Despacho]].
- ✅ (`api-pcp`, `app-pcp`) Coletor (N16-201): ler a etiqueta do lote ou do endereço pelo leitor ou pela câmera; consultar, separar a retirada, contar o inventário e mudar de endereço lendo; etiqueta de endereço `END.<depósito>.<endereço>`. `api-pcp` `src/estoque/coletor/coletor.controller.ts:27` (`@Get('ler')`); detalhe em [[05-Estoque-Atendimento-Detalhe-Tecnico]].
- 🔴 Transferência entre filiais (passa direto, sem nota) e separação física.

Entrada: [[04-PCP-Triagem-e-Destinacao]]. Próxima raia: [[06-Circuito-de-Compra]].

## Detalhe técnico

Nós do [[00-Fluxo-Mestre-0b]]: `E1` saldo disponível, `E2` saldo cobre?, `E3` atende pelo saldo (split e reserva, custo do item), `E4` o que fazer com o restante. `E5`: [[09-Estoque-Entrada-do-Lote]]. `E6`: [[12-Estoque-Despacho]]. Vizinhos: [[06-Circuito-de-Compra]], [[07-Recebimento]], [[08-Qualidade-Entrada]], [[11-Qualidade-Saida]], [[13-Expedicao]]. Sistemas: [[MES-Backend]], [[MES-Front]]. Selos em [[Regras-do-Vault]].

Permissão: agir no setor exige `PerfilSetor.podeAtuar`; movimentar exige `PerfilDeposito.podeAtuar` ([[RBAC-e-Permissoes]]).

O detalhe técnico desta nota fica em uma nota à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[05-Estoque-Atendimento-Detalhe-Tecnico]]: Regras decididas · Estados · Telas · Endpoints e contratos · Como está no código · Dados · O que falta desenvolver · Pendências · Subfluxo
