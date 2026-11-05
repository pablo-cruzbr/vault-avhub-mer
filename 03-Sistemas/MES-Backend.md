---
tags: [sistemas, mes, api-pcp, nestjs, backend]
criado: 2026-10-14
atualizado: 2026-10-29
status: vigente
dono: Robert
fontes: [api-pcp befd973 (develop, 27/10; a main parou em 08/10 e está em 8e2bf56), prisma/migrations até 20261028120100, Dump MES (Esqueleto).sql de 14/10 (defasado), v1 App-PCP-Backend-Producao, App-PCP-Visao-Geral, MES-Arquitetura-Decisoes]
---

# MES Backend (`api-pcp`)

**Em uma frase:** é a API do MES, o sistema de chão de fábrica da Aços Vital. Ela guarda os pedidos liberados, a produção por setor, o Estoque, as compras (lado fábrica), o Recebimento, a Qualidade e a Expedição. Dono: Robert.

## Quem usa e para quê

- As telas do MES ([[MES-Front]]): toda ação do operador passa por ela.
- O av-hub ([[AV-Hub-API]]): troca pedidos liberados, requisições de compra e a etapa de cada item.
- O sistema de permissões ([[RBAC-e-Permissoes]]): decide o que cada pessoa pode fazer.

## Como se encaixa no fluxo

- **PCP (planejamento e controle da produção):** lê os pedidos liberados na Triagem e grava a Destinação (`P1`, `P2`).
- **Estoque:** guarda saldo, lotes e reservas e atende as parciais (`E1` a `E5`).
- **Compras e Recebimento:** registra a requisição de compra (`P3`), a chegada com nota fiscal e a conferência (`R0` a `R6`).
- **Qualidade:** inspeciona o lote que chegou (`Q1` a `Q4`).
- **Produção e Expedição:** controla a fila de cada setor, a embalagem em pallets e a entrega (`F1`, `X1`, `X4`).
- **Troca com o av-hub:** cinco rotinas automáticas enviam a requisição de compra, leem o andamento da compra, leem as OCs aprovadas, leem as requisições que o Compras abriu no av-hub e reenviam o aviso de pedido importado. Três rotas de serviço respondem ao av-hub: requisições, etapa do item e custo por item.
- **Fabricação:** a OP (ordem de produção) é emitida na Destinação, o PCP monta o roteiro, e o fabricado aprovado na inspeção de saída entra no Estoque como lote de produção (LOG-53).

> Tudo o que é de 15 a 28/10 (OP, lote do fabricado, custo por item, referência da OC) está **só na `develop`** do `api-pcp`. A `main` parou em 08/10.

## Regras que valem

- Toda rota exige login. Só a checagem de saúde e o login são públicos.
- Quem não tem permissão explícita não passa. Basta um dos perfis da pessoa permitir.
- Mesmo com a tela liberada, só age num setor quem tem "pode atuar" nele.
- O custo do lote só aparece para quem tem a permissão de custo.
- Entrar com a conta Microsoft não cria usuário: o e-mail precisa já estar cadastrado.
- As rotinas automáticas rodam dentro da própria API, sem agendador externo.

## O que já existe e o que falta

- ✅ Pedidos, parciais, Estoque, Compras · CCP, Recebimento, Qualidade, Expedição e entregas.
- ✅ Envio da requisição ao av-hub e leitura dos 14 marcos da compra.
- ✅ O MES lê a referência da OC do av-hub (`GET /ordens-compra/referencia`), a cada 5 minutos, desde 15/10 (commit `114ba89`, K4). Na `develop`.
- ✅ O MES lê as requisições que o Compras abriu no av-hub com pedido de venda (API-009, `9e75df5`, 23/10). Na `develop`.
- ✅ O custo da OC é gravado no lote (`origem = OC`, `97b9adc`, 16/10), há rota de custo manual (`PUT /estoque/lotes/:id/custo`), snapshot do custo na saída e `GET /itens/custo` para o av-hub (`6c11147`, 27/10). Na `develop`.
- ✅ Fabricado aprovado vira lote `PRODUCAO` e saldo no Estoque (LOG-53, `ab3318d`, 27/10). A OP é emitida na criação. Na `develop`.
- ✅ O fornecedor da OC chega ao MES (api007b, 26/10) e preenche o fornecedor da requisição.
- 🔴 Torre de Fluxo não existe aqui (`/fluxo/*`). O job da Torre do av-hub recebe erro 404.
- 🔴 Não há documento de retirada. A baixa do saldo acontece quando a Embalagem recebe.
- 🟡 A tabela de fornecedores existe, mas nada a preenche nem lê.
- 🟡 A rota antiga `GET /requisicoes-compra` não tem consumidor.
- 🟡 Os intervalos automáticos ainda ficam em variável de ambiente.
- ❓ Conferir se as telas `movimentacao` e `movimentacoes` existem em produção.

## Detalhe técnico

API NestJS do MES: pedidos liberados, produção por setor, Estoque, circuito de compra (lado MES), Recebimento, Qualidade e Expedição. Dono: Robert. Stack: NestJS 11, Prisma 7 com adaptador `pg`, `class-validator`, JWT + `bcrypt`, Swagger/Scalar em `/docs` (✅ `api-pcp/package.json:19-47`, `src/main.ts:56-60`). Banco: [[Banco-MES]]. Telas que a consomem: [[MES-Front]]. Permissões: [[RBAC-e-Permissoes]]. Integração com o av-hub: [[Integracao-AvHub-MES]]. Selos: [[Regras-do-Vault]].

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[MES-Backend-Detalhe-Tecnico-1]]: Como o app sobe · Módulos (`src/app.module.ts:36-72`) · Rotas por módulo e permissão
- [[MES-Backend-Detalhe-Tecnico-2]]: Serviços que fazem a regra · Jobs e timers (todos dentro do processo da API, sem `@nestjs/schedule`) · Variáveis de ambiente (conferidas no código) · O que o MES chama no av-hub · O que falta ou diverge (resumo; detalhe em [[Pontas-Soltas]] e [[Diferencas-Codigo-x-Banco]])
