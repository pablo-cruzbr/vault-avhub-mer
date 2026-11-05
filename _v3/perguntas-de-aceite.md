# Perguntas de aceite da v3

Status: **rascunho, aguardando aprovação do Nathan.**
Base conferida em 2026-11-05: `origin/develop` — api-acos-vital b97981c · av-hub 2e5456d · api-pcp befd973 · app-pcp 93f96de · omie-elt-pipeline (sem `develop`) `origin/master` 5e7e94d.
Cada pergunta deve ser respondida só com o vault v3 (Home, raias, links "próxima"), sem abrir o código. A resposta esperada abaixo vem do código na `develop`; no Bloco 7, a resposta da v3 é comparada com ela.

| # | Pergunta | Resposta esperada | Origem na `develop` |
|---|---|---|---|
| 1 | Em que ordem o pedido passa pelas notas do vault? | Proposta → Orçamento → Pedido → PCP → Estoque → Compra → Recebimento → Qualidade → Produção → Expedição → Fiscal → Comissão (F1, ordem do mermaid) | Ordem do `00-Fluxo-Mestre-0b` (decisão F1; não é código) |
| 2 | Em que nota fica o nó C6–C8 (circuito de compra ligado ao pedido de venda)? | Em uma só: `06-Circuito-de-Compra` (dono único; nas outras fica frase e link) | Regra de dono único (seção 5 da instrução) |
| 3 | O que é "reserva ATIVA" e como entra no saldo disponível (E1)? | Reserva com status `ATIVA`; o que falta consumir (quantidade − quantidadeConsumida) é descontado do lote; só lote `LIBERADO` conta | api-pcp `origin/develop`: `src/estoque/operacao/estoque-operacao.helpers.ts` (`reservadoPorLote`, ~linha 36–48); enum `StatusReserva` em `prisma/migrations/20260925150000_d9_saldo_reserva/migration.sql:7`; `StatusQualidadeLote` (PENDENTE/LIBERADO/REPROVADO) em `20260922110000_estoque_v1/migration.sql:8` |
| 4 | A inspeção de saída (Q7) é obrigatória no roteiro de fabricação? | Sim: tipo de setor `QUALIDADE` é a inspeção de saída, obrigatória no roteiro de fabricação (EC-06) | api-pcp `origin/develop`: `prisma/migrations/20260929120000_tipo_setor_logistica_qualidade/migration.sql:4,9` |
| 5 | O que a Qualidade de entrada (Q1) registra por lote e qual o campo do laudo? | Status de qualidade do lote (PENDENTE → LIBERADO ou REPROVADO) e o `laudo_url` | api-pcp `origin/develop`: `prisma/models/estoque.prisma:185` (`laudoUrl`); `20260922110000_estoque_v1/migration.sql:84-85`. **A confirmar:** se o laudo é *obrigatório* em código (a regra do Fluxo Mestre diz "laudo obrigatório"; o DTO `entrada-lote.dto.ts:25` tem `laudoUrl?` opcional) — divergência vault × `develop` a levar ao Nathan no Bloco 3 |
| 6 | Quem emite a nota fiscal e como o pedido pode ser faturado (O1)? | O Omie emite; o sistema nunca emite. O faturamento pode ser inteiro ou em sequenciais (por item e quantidade) | Vault: Fluxo Mestre linha O1 (N16-92 a N16-94, N16-100). **Código a conferir no Bloco 3** (api-acos-vital / av-hub `origin/develop`) |
| 7 | O pedido que nasce da proposta chega liberado ou travado? E o digitado no Omie? | Da proposta: liberado. Do Omie: chega travado e o vendedor responde Qualidade e faturamento (V1–V3) | Vault: Fluxo Mestre V1–V3. **Código a conferir no Bloco 3** (api-acos-vital `origin/develop`) |
| 8 | Qual é a base do estado "pronto" e por quê? | A `develop` dos sistemas (F5): selo ✅ exige repositório, commit e arquivo:linha; ainda não há produção | Decisão do Nathan 05/11/2026 (F5) |
| 9 | O que existe hoje do módulo do Pablo (proposta e suprimentos)? | Só o que estiver na `develop`; o resto é 🔴 "sem API e sem banco" (F3) | Decisão do Nathan 05/11/2026 (F3); estado exato a levantar no Bloco 3 |
| 10 | Onde estão os contratos da v2 e como achar um (ex.: LOG-34)? | Na tag `v2-antes-da-v3`; o índice `06-Contratos/Contratos-da-v2` lista ID, título, pasta, status, nós e link do GitHub | Decisão F2; índice criado no Bloco 1 |

## Observações para o aprovador
- As perguntas 3 e 4 estão conferidas em código na `develop` (arquivo:linha acima). As perguntas 5, 6 e 7 têm um ponto marcado "a conferir": entram no Bloco 3 como divergência ou confirmação, e a resposta final será atualizada aqui.
- Se preferir outras perguntas, diga quais temas (por exemplo, Fiscal, Expedição, Comissão) e eu troco.
