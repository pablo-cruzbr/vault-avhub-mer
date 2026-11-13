---
tags: [desenvolvimento, pontas-soltas, pendencias, parte]
criado: 2026-11-12
estado-em: 2026-11-12
status: vigente
dono: Nathan
parte-de: "[[Pontas-Soltas]]"
fontes: [Pontas-Soltas (seção movida em 12/11/2026 para a nota ficar abaixo de 25 KB), decisões do Nathan de 14/10/2026]
---

# Pontas soltas resolvidas em 14/10/2026

**Em uma frase:** as pontas soltas que o Nathan decidiu em 14/10/2026; o trabalho que sobrou está no [[Backlog-por-Frente]].

**Onde estamos:** ← [[Pontas-Soltas]] (as pontas abertas)

Decididas pelo Nathan em 14/10; o que sobra é trabalho e está em [[Backlog-por-Frente]].

| ID | Decisão | Nota afetada | Trabalho que sobra |
|---|---|---|---|
| PS-003 | O MES lê as OCs do hub: se a OC é vinculada a pedido de venda, o PCP vê a OC do pedido; se é de estoque, o Estoque mostra o saldo futuro. Substitui as opções (a) e (b). N14-20 | [[06-Circuito-de-Compra]], [[07-Recebimento]], [[05-Estoque-Atendimento]], [[04-PCP-Triagem-e-Destinacao]], [[Integracao-AvHub-MES]] | BL-006, BL-028, BL-041, BL-049, BL-050, BL-051 |
| PS-004 | A Ordem de Produção é entidade do sistema e também documento para impressão, só do que será fabricado. N14-22 | [[04-PCP-Triagem-e-Destinacao]], [[Glossario]] | BL-036, BL-052 |
| PS-007 | Perfil CCP: criado pelo Nathan em 30/10/2026 (❓ cadastro, não conferido no ambiente; no MES de teste não existe, PS-050). N14-24 | [[Equipe-e-Divisao]], [[RBAC-e-Permissoes]] | BL-017 (cadastral) |
| PS-008 | ✅ **Feito em 30/10/2026 (Nathan).** Vínculo de usuários à Gerência de Compras: tarefa cadastral. N14-24 | [[Equipe-e-Divisao]], [[06-Circuito-de-Compra]] | cadastro (RS-015) |
| PS-010 | OC acima de R$ 30 mil: Gerente de Compras aprova; até R$ 30 mil: compradores livres; sem Diretoria. É o que o código faz ✅. Regra mais rígida depois, com Compras 🟡. N14-21 | [[06-Circuito-de-Compra]], [[00-Fluxo-Mestre-0b]], [[AV-Hub-API]], [[Estados-e-Status]] | BL-038 e BL-040 fechados; endurecer depois (🟡, sem BL) |
| PS-021 | `sql/002` e `omie_raw` obsoletos (auditoria removida no contrato 38; nada lê nem escreve). N14-27 | [[Pipeline-Omie]], [[Banco-AvHub]], [[Diferencas-Codigo-x-Banco]] | BL-054 (`DROP`, Gustavo) |
| PS-028 | Notificações com 403 eram da `api-comercial` (API de teste do Pablo, removida do av-hub em 06/11/2026, PR #261); não se aplica. N14-26 | [[API-Comercial]] | — |
