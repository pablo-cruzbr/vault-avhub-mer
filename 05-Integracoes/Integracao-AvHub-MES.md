---
tags: [integracao, av-hub, mes, contratos, sequencia]
criado: 2026-10-14
estado-em: 2026-11-13
status: vigente
dono: Nathan
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [api-pcp develop befd973 e api-acos-vital develop 0384e89 (conferência de 29/10; antes 579a625 e f322dcd), app-pcp 1fca8d3, HUB b55ac55, Dump Avhub e Dump MES de 14/10, v1 Chaves-de-Integracao-AvHub-MES-Pipeline, Integracao-AvHub-MES-Especificacao-F1, Integracao-AvHub-MES-Volta-Plano, MES-Arquitetura-Decisoes]
---

# Integração av-hub ↔ MES

**Em uma frase:** esta nota mostra como o av-hub (o sistema comercial) e o MES (o sistema da fábrica) trocam informação: quem manda o quê, quando e o que acontece se um dos dois cair.

**Quando consultar esta nota:** ao mexer em qualquer troca entre os dois sistemas (liberação de pedido, requisição de compra, etapa do item, custo, Torre de Fluxo) ou ao investigar por que um dado não chegou ao outro lado.

Siglas: **av-hub** = a API `api-acos-vital` mais as telas do HUB. **MES** = a API `api-pcp` mais as telas `app-pcp`. **PCP** = planejamento da produção. **OC** = ordem de compra. Os dois sistemas têm bancos separados e nunca leem o banco um do outro.

## Quem manda dado para quem, quando e por quê

Cada dado tem um dono. O dono oferece o dado numa "rota" (um endereço de consulta protegido por chave). Quem precisa pergunta de tempos em tempos e guarda uma cópia própria. Não há aviso automático: sempre é consulta periódica.

- **Liberação do pedido (INT-01).** O vendedor libera o pedido no HUB. Quando o PCP abre a Triagem no MES, o MES pergunta ao av-hub quais pedidos estão liberados. Depois de criar a Destinação, o MES avisa que "importou". Por quê: o pedido só vai à produção depois de liberado. ✅ funciona ponta a ponta.
- **Requisição de compra, ida (INT-02).** O MES envia ao av-hub cada pedido de material que o PCP faz, assim Compras passa a vê-lo. Se o av-hub estiver fora, a fila do MES espera e reenvia. ✅
- **Marcos da requisição, volta (INT-03).** A cada 5 minutos, o MES pergunta ao av-hub em que ponto da compra está cada requisição dele (cotação, OC aprovada, despachada). Por quê: o MES acompanha a compra sem receber dado comercial. ✅ para requisição criada no MES.
- **Referência da OC (INT-04).** O av-hub oferece as OCs aprovadas. O MES as consulta a cada 5 minutos, para conferir o recebimento e dar custo ao lote. ✅ desde 15/10, só na `develop` do MES (a `main` parou em 08/10).
- **Requisições do Compras com pedido de venda (INT-09).** O av-hub oferece as requisições que o Compras abriu com pedido de venda; o MES as lê a cada 5 minutos para o PCP ver que já há compra em andamento e não pedir de novo. ✅ desde 23/10, só na `develop` do MES.
- **Etapa de cada item (INT-05).** A cada 90 segundos, o av-hub pergunta ao MES em que etapa está cada item. Por quê: o vendedor vê "Etapa dos itens" no pedido. ✅
- **Custo real por item (INT-06).** O av-hub pergunta ao MES o custo de cada item a cada 90 segundos. ✅ A rota do MES foi feita em 27/10, só na `develop`; falta subir para a `main` e ligar a tela no hub.
- **Torre de Fluxo (INT-07).** O av-hub quer ler do MES o histórico de eventos de cada item. 🔴 O MES ainda não tem o módulo.
- **Requisições lidas do MES (INT-08).** Desenho antigo, sem uso: ninguém consome. Candidato a remoção.

O MES nunca fala com o Omie (o ERP, sistema fiscal e financeiro). O que ele precisa do Omie chega pelo av-hub. Requisição criada só no HUB não vai ao MES; o MES enxerga a OC dela (decisão N14-20).

## Se um lado cair

- **av-hub fora:** a Triagem e a Destinação mostram erro, a fila de requisições acumula e nada se perde. O aviso "importado" é reenviado a cada 10 minutos por 7 dias.
- **MES fora:** o vendedor segue liberando pedidos. Os jobs do av-hub repetem a consulta, e o HUB mostra "dado velho" depois de 10 minutos.

## O que falta

- **Robert (MES):** o módulo da Torre (BL-003); usar a leitura da OC no PCP (BL-049, BL-051; o saldo futuro do Estoque, BL-050, está na `develop` desde 13/11); subir a `develop` para a `main` (BL-035); mandar o motivo no cancelamento da requisição. Os avisos de recompra por RNC e de reabertura do recebimento (N16-127, N16-137) estão na `develop` pelo LOG-58; a recompra foi testada no Docker em 13/11.
- **Gustavo (banco e API):** cadastrar as listas de rotas das chaves de serviço do MES e do pipeline (BL-018, BL-057) e permissões das telas de custo e Torre (BL-020, BL-021).
- **Nathan (HUB):** telas da Torre (BL-022, consideradas ok em 29/10 sobre dados de teste) e de custo (BL-023, restam o simulador, Compras e Orçamento).

A lista completa, com donos e nós, está em "O que falta desenvolver" no detalhe. Selos: ✅ pronto · 🟡 proposta · 🔴 não existe · ❓ não conferido. Regras do vault: [[Regras-do-Vault]].

## Detalhe técnico

Nota canônica das integrações entre o av-hub (`api-acos-vital` + HUB) e o MES (`api-pcp` + `app-pcp`). Uma seção por fluxo, com rota, direção, chave, cursor, idempotência, falha e estado no código. Os IDs dos nós são os do [[00-Fluxo-Mestre-0b]]. Chaves e escopos: [[Chaves-e-Autenticacao]]. Selos: [[Regras-do-Vault]].

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[Integracao-AvHub-MES-Detalhe-Tecnico-1]]: Regras que valem para todos os fluxos · Tabela-resumo · INT-01 Liberação do pedido (contrato 26) · INT-02 Requisição de compra, ida (contrato 34) · INT-03 Marcos da requisição, volta (contrato 35)
- [[Integracao-AvHub-MES-Detalhe-Tecnico-2]]: INT-04 Referência da OC (contratos 004 e 007) · INT-05 Status por item (contratos 005 e 006) · INT-06 Custo real por item (contratos 008 e 47) · INT-07 Torre de Fluxo (contrato 46) · INT-08 `GET /requisicoes-compra` (003, legado) · Requisito: o MES lê as OCs do hub (requisição só do av-hub, C0) · Outras pontes com o MES · O que acontece quando o outro lado cai · O que falta desenvolver · Pendências
