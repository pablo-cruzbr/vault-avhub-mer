---
tags: [desenvolvimento, pontas-soltas, pendencias, parte]
criado: 2026-11-12
estado-em: 2026-11-13
status: vigente
dono: Nathan
parte-de: "[[Pontas-Soltas]]"
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [Pontas-Soltas (seção movida em 12/11/2026 e as pontas fechadas movidas em 13/11/2026, para a nota ficar abaixo de 25 KB), decisões do Nathan de 14/10/2026]
---

# Pontas soltas resolvidas

**Em uma frase:** as pontas soltas fechadas: as que o Nathan decidiu em 14/10/2026 e, desde 13/11/2026, as fechadas depois; o trabalho que sobrou está no [[Backlog-por-Frente]].

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

## Fechadas depois de 14/10/2026

Movidas da [[Pontas-Soltas]] em 13/11/2026, sem mudar o texto. O original de cada uma está resumido na própria linha.

| ID | Ponta solta | Dono | Nó | Proposta | Ref |
|---|---|---|---|---|---|
| PS-001 | ✅ **Fechada (29/10/2026):** o fornecedor da OC chega ao MES pela rota do hub (`codigo_fornecedor`, `nome_fornecedor`, `cnpj_fornecedor`, desde a `api007b`) e o MES o grava (`api-pcp` `oc-referencia-avhub.service.ts:14`; `5a0f535`, 26/10). Original: o fornecedor era digitado na conferência | Robert | C4, R1 | ✅ | BL-001 |
| PS-005 | ✅ **Fechada (28/10/2026):** o 07 foi arquivado e substituído pelo LOG-42; o 38 §6 virou histórico. Original: contratos 07 (orçamento) e 38 §6 "a reescrever" sem responsável | Nathan | C | ✅ | #39, #60; [[Contratos-da-v2\|LOG-38]] |
| PS-006 | ✅ **Fechada (19/10/2026, conferida em 11/11):** Compras respondeu a OQ-23 pela CON-05: não há conversão de unidade, e a OC segue a unidade de faturamento do fornecedor; o que sobrou foi para a OQ-34 (decidida na N16-148). Original: unidade diferente entre OC e lote; fator de conversão | Nathan com Compras | R4 | ✅ | D2 do [[Contratos-da-v2\|API-008]], #98, OQ-23 |
| PS-011 | **Quem marca a requisição como atendida no MES?** Hoje o resumo é recalculado por OC e recebimento, `api-pcp` `src/integracao-avhub/requisicao-avhub.eventos.ts:311` (`export async function resumirRequisicao`); as setas de recebida parcial e recebida ainda não foram relidas ([[Estados]]). Em 10/11 o lote comprado não voltou sozinho para o pedido (BL-086) | Robert | R0, R4 | ✅ Fechada (11/11): ninguém marca à mão; o recebimento grava `RECEBIDA`/`RECEBIDA_PARCIAL` (`compras.service.ts:1073`); no Hub, "atendida" é a OC aberta pela requisição. Documentar em [[07-Recebimento]] | [[Integracao-AvHub-MES]], BL-086 |
| PS-024 | ✅ **Fechada (29/10/2026):** o Robert estimou o documento de retirada em 3,5 pd (±30%) em 15/10 ([[Contratos-da-v2\|LOG-54]], BL-007); fica fora da conta do Ciclo 1 até o Nathan decidir (RS-004). Original: baixa no despacho do Estoque sem estimativa | Robert | E6 | ✅ | BL-007, RS-004 |
| PS-025 | ✅ **Fechada (29/10/2026):** `api-acos-vital` `0384e89` trocou "Contrato 30" por 45 (LOG-45) nos comentários e no swagger do pedido manual. Original: o código chamava o pedido manual de "Contrato 30" | Gustavo | — | ✅ | #85 |
| PS-030 | ✅ **Fechada (11/11/2026): não pede decisão nem trabalho.** As [[Regras-do-Vault]] já dizem que o vault anterior só vale quando não conflita com a `develop`, o dump, as decisões e o fluxo. Original: documentos do v1 ("Estoque·Entrada", "registrar compra" manual) descrevem desenho superado | Nathan | E, C | ✅ | [[Contradicoes-Resolvidas]] |
| PS-031 | ✅ **Fechada (28/10/2026, N16-117):** o Robert escreve o módulo Comercial & Suprimentos na `api-acos-vital`, o Pablo acompanha e o Gustavo revisa o banco. O CS5 do [[Cronograma]] já diz "migrar para a `api-acos-vital`". Original: quem escreve o módulo? | Nathan | — | ✅ | [[Contratos-da-v2\|LOG-52]] Q10 e Q11, BL-062 |
| PS-033 | ✅ **Fechada (29/10/2026):** o filtro `alterado_desde` roda antes do `return` em `parceiros.route.js` e `produtos.route.js` ("LOG-51 S27"). Original: o filtro do API-001 nunca executava (B10 em [[Bugs-Conhecidos]]) | Gustavo | — | ✅ | [[Contratos-da-v2\|LOG-51]] S27, [[Contratos-da-v2\|API-001]] |
| PS-035 | ✅ **Fechada (11/11/2026): o ciclo novo está no banco e na API.** A proposta só tem `ABERTA`, `APROVADA`, `TRANSFORMADA`, `CANCELADA` e `EXPIRADA`, sem fechamento parcial nem "perdida" (`ck_propostas_status`; N16-02, N16-24). Sobra na tela a linha do tempo com os eventos antigos, `av-hub` `components/Propostas/PropostaForm/LinhaDoTempoModal.tsx:31` (`case 'PERDIDA':`) ❓ sem efeito? Original: o `core_comercial` e as telas usavam fechamento parcial, "perdida" e "reabrir", que o desenho (N16-03, N16-84, N16-106) troca | Nathan, Robert, Gustavo (Pablo acompanha) | V0 | ✅ | [[Contratos-da-v2\|LOG-52]] |
| PS-040 | ✅ **Fechada (09/11/2026): medição feita pelo Nathan** no banco de teste (corte em 01/09/2026): o G6 tira 142 de 2.028 pedidos, 98 deles pela observação. SQL e resultado em `../Perguntas-e-Respostas/` (`medicao-V3_refaturamento-liberacao.sql`), fora do vault. A regra é a **N16-153** (10/11). Original: refaturamento de Uberaba (`1.01.99`) na base de comissão (Robert, 05/11); em 09/11 virou medição na `vw_vendas_planilha`, nas três unidades | Nathan (medir), Gustavo (regra) | V0.7 | ✅ Regra: N16-153 | [[Mapa-IncluirPedido-Omie]] (seção 5.3.1), [[Riscos]] (RS-022) |
| PS-041 | ✅ **Fechada (09/11/2026) pelo R11 do LOG-56:** o pedido leva `codigo_conta_corrente`, com conta padrão por conta Omie, configurada uma vez e invisível para o vendedor (§7.4); omitir o campo não dá (o Omie recusa: teste de 09/11, `PV-000002`). Original: omitir a conta ou dar lista por unidade? | Nathan | V0.7 | ✅ A configuração é o passo 4 da §14 do LOG-56 | [[Mapa-IncluirPedido-Omie]], BL-081 |
| PS-052 | ✅ **Fechada (12/11/2026, N16-162): a Destinação é do pedido inteiro, como a `develop` faz; a rodada sai do desenho.** Original: **Destinação sem rodada (develop × desenho).** A regra 6 de [[04-PCP-Triagem-e-Destinacao]] manda destinar por rodada; a `develop` exige o pedido inteiro: `api-pcp` `src/pedidos/pedidos.service.ts:482` (`exigirPedidoInteiroDestinado`), commit `fe11538`, 22/10 | Robert, Nathan | P2 | ✅ (N16-162) | — |
| PS-054 | ✅ **Fechada (13/11/2026), pela resposta do Gustavo:** a migration `2026-11-12_comercial_encargo_pagamento_proposta_simulacao.sql` está no tst desde 12/11; ❓ está no dump de 13/11 ([[Dump-AvHub-Teste-2026-11-13]]); a produção vem depois. Original: o av-hub PR #291 grava o `encargo_pagamento` e a migration não tinha sido conferida no tst (sem a coluna, salvar a proposta com encargo falha) | Gustavo | V0.3 | ✅ respondida | [[01-Proposta-de-Venda]], [[15-Custo-Real-e-Comissao]] |
| PS-055 | ✅ **Fechada (13/11/2026), pela resposta do Gustavo:** os cadastros estão no tst desde 12/11 e vêm dentro das migrations do LOG-57 e do LOG-58, então vão junto para a produção. Original: a tela `compras-divergencias`, as permissões e as linhas de `auth.rotas_telas` são dados e não vêm no dump de esquema; sem elas o BFF dá 403 e o C8 some sem erro (Docker de 12/11, só com o esquema) | Gustavo | C8, C1 | ✅ respondida | LOG-57, LOG-58 |
