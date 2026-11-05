# Fatos de 03-Pedido-de-Venda-e-Liberacao

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/03-Pedido-de-Venda-e-Liberacao.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir 03-Pedido-de-Venda-e-Liberacao`.

## decisões e IDs (3)

- `N16-05`
- `N16-106`
- `N16-91`

## contratos (2)

- `API-005`
- `API-006`

## commits (0)


## arquivo:linha (0)


## rotas (0)


## datas (3)

- `26/10`
- `26/10/2026`
- `29/10/2026`

## código entre crases (10)

- `P1`
- `P2`
- `V1`
- `V2`
- `V3`
- `api-acos-vital`
- `api-pcp`
- `api005`
- `av-hub`
- `develop`

## regras e linhas de conteúdo (34)

- O pedido nasce no Omie (o sistema de gestão) e chega ao av-hub **travado**. `V1`
- O vendedor, ou o auxiliar dele, abre a tela Liberar Pedidos, na aba "Aguardando você".
- Ele responde: a Qualidade acompanha esse pedido desde o início? Sim ou Não. `V2`
- Ele libera **na mesma ação** da resposta. `V3`
- Até o PCP importar o pedido, o vendedor ainda pode corrigir a resposta.
- O MES (sistema de chão de fábrica) consulta a lista de liberados. Ninguém empurra o pedido para ele. `P1`
- Quando o PCP grava as ordens, o MES avisa o av-hub. O pedido vira "No PCP" e a resposta trava, com um cadeado. `P2`
- Depois disso, o vendedor só acompanha. O cartão "Etapa dos itens" mostra em que etapa está cada item.
- | Vendedor | Marca Sim ou Não e libera os pedidos dele |
- | Auxiliar do titular | Libera pelos titulares que ele auxilia |
- | Gerente | Só vê todos os pedidos da liberação; descobre quem está segurando pedido |
- | PCP | Usa os pedidos liberados; não marca nada |
- | Gustavo (DBA), Nathan, Robert | Banco e API, telas do av-hub, e lado MES |
- Só pedido liberado vai ao MES. Sem liberação, o PCP não vê o pedido.
- A resposta e a liberação são uma ação só.
- A regra vale por pedido. As parciais criadas depois herdam a resposta.
- Só pedido incluído a partir da data de corte precisa de liberação. A carteira anterior não trava.
- O vendedor corrige a resposta até o MES importar. Depois, ela trava.
- O MES busca a lista. Ninguém empurra pedido para ele.
- O gerente só visualiza. Vendedor e auxiliar liberam.
- O vendedor vê só os pedidos dele. A API aplica isso pelo token de login.
- O pedido do Omie entra na liberação com os mesmos filtros da Carteira antiga.
- A resposta sobre Qualidade é guardada agora e usada depois, na fila de inspeção de processo. Essa fila ainda não existe.
- ✅ (`av-hub`, `api-acos-vital`) Telas Liberar Pedidos e Liberação da Equipe, e as rotas da API.
- ✅ (`api-pcp`) O MES lê os liberados, recusa pedido não liberado e confirma a importação, com reenvio automático.
- ✅ (`av-hub`) Cartão "Etapa dos itens" no detalhe do pedido.
- 🟡 Os 9 estados macro do vendedor não existem no código. Hoje ele vê a situação da liberação e 11 etapas por item.
- 🔴 Chave própria do MES, mapa de rotas por tela e teste do escopo do vendedor.
- 🔴 Renovar o token expirado, reabrir marcação depois da importação e alertar pedido parado.
- 🔴 Fila de inspeção de processo da Qualidade e refinos do cartão Etapa dos itens.
- 🔴 Pedido manual: o desenho só prevê pedido que chega do Omie.
- ❓ Valor da data de corte em produção e migration `api005`.
- [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-1]]: Quem atua (onde) · Regras decididas · Estados · Telas · Endpoints e contratos · Como está no código
- [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2]]: Dados · Quem vê o quê · Pedido que nasce da proposta: liberação e cancelamento · O que falta desenvolver · Pendências · Diagrama do subfluxo
