---
tags: [sistemas, mes, api-pcp, nestjs, backend, parte]
criado: 2026-11-05
estado-em: 2026-11-24
status: vigente
dono: Robert
parte-de: "[[MES-Backend]]"
develop-conferida: [api-pcp 6bca516, app-pcp ffdcd3f, em 2026-11-24 (retirada, PRs #96, #97, #83 e #84); api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [api-pcp befd973 (develop, 27/10; a main parou em 08/10 e está em 8e2bf56), prisma/migrations até 20261028120100, Dump MES (Esqueleto).sql de 14/10 (defasado), v1 App-PCP-Backend-Producao, App-PCP-Visao-Geral, MES-Arquitetura-Decisoes]
---

# MES Backend (`api-pcp`): detalhe técnico (2/2)

**Em uma frase:** detalhe técnico da nota [[MES-Backend]] (parte 2 de 2): Serviços que fazem a regra; Jobs e timers (todos dentro do processo da API, sem `@nestjs/schedule`); Variáveis de ambiente (conferidas no código); O que o MES chama no av-hub; O que falta ou diverge (resumo; detalhe em [[Pontas-Soltas]] e [[Diferencas-Codigo-x-Banco]]).

**Onde estamos:** ← [[MES-Backend]] (resumo e índice) · partes: [[MES-Backend-Detalhe-Tecnico-1]] · **MES-Backend-Detalhe-Tecnico-2**

## Serviços que fazem a regra

| Serviço (arquivo) | Responsabilidade | Observações |
|---|---|---|
| `ItensParciaisService` (`itens-parciais/itens-parciais.service.ts`, 1775 linhas) | máquina de estados da parcial; `atenderEstoque` (`:607`) reserva lotes e divide a parcial; `receber` consome a reserva quando a Expedição recebe (`:279`) | ver [[Modelo-Estoque-e-Custo-do-Lote]] |
| `PedidosService` (`pedidos/pedidos.service.ts`) | cria a Destinação, confirma importação no av-hub, reenvia `importado` a cada 10 min (`:63-83`) | exige `PEDIDO_NAO_LIBERADO` do av-hub (`:245-248`) |
| `PedidosCarteiraService` + `omie-integracao.ts` | Triagem lê `GET /pedidos_liberados` do av-hub | `omie-integracao.ts:277-337` (`listarCarteiraIntegracao`) |
| `EstoqueOperacaoService` + `estoque-operacao.helpers.ts` | saldo, lote, movimento, reserva, `consumirReservasDaParcial` (`helpers:208`), `estornarConsumosDaParcial`, `copiarCustoParaFilho` (`:432`) | |
| `ComprasService` (`compras/compras.service.ts`, 674 linhas) | `requisitar` (`:135`), `cancelar` (`:228`), `esperados` (`:305`), `registrarChegada` (`:356`), `liberarRecebimento` (`:404`), `registrarRecebimento` (`:472`, chamado pelo Recebimento) | |
| `circuito-compra.ts` | setores fixos do circuito (`requisicoes-compra`, `compras`, `logistica-entrada`, `qualidade-entrada`, Estoque); `moverParcial`, `splitParaDestino`, `devolverAoEstoqueParciaisProntas` (`:166`), `devolverAComprasParteReprovada` (`:256`) | `circuito-compra.ts:19-25` |
| `marcos-compra.ts` | calcula a linha do tempo "Compras · CCP" por requisição | `:70`, `:131` |
| `RecebimentoService` (`compras/recebimento.service.ts`) | `conferir` (`:135`), `recontar` (`:249`), `decidir` (`:331`); tolerância de peso por material (padrão 5%) | `:390-395`; coluna `materiais.tolerancia_peso` (dump `:871`) |
| `QualidadeService` | aprova (lote → `LIBERADO`, devolve parciais prontas ao Estoque) e reprova (cisão do lote, RNC, devolve a parte reprovada a Compras) | `api-pcp` `src/qualidade/qualidade.service.ts:75-265` (`async aprovar(`, `async reprovar(`) |
| `EntregasService` | registra a entrega, decrementa `quantidadePendente`, consome reserva por garantia, fecha o pedido (`ENTREGUE`) | `entregas.service.ts:25-135` |
| `EnvioAvhubService` | fila de saída da requisição (LOG-34) | ver Jobs |
| `OcReferenciaAvhubService` + `compra-oc.ts` | lê `GET /ordens-compra/referencia` e grava `oc_referencia` e `oc_referencia_itens`; calcula o custo do lote a partir da OC (`origem = OC`) e o fornecedor | `oc-referencia-avhub.service.ts`; `compra-oc.ts:114` |
| `RequisicaoHubReferenciaAvhubService` | lê `GET /compras/requisicoes/referencia` (API-009) e grava `requisicoes_hub_referencia` | `requisicao-hub-referencia-avhub.service.ts` |
| `itens-custo.ts` | monta o `GET /itens/custo` | `integracao-avhub/itens-custo.ts` |
| `PedidosRoteiroService`, `PedidosProdutosProducaoService`, `FilaOrdemService` | roteiro da OP, tela Produtos em Produção, ordem da fila | `pedidos/`, `setores/` |
| `EventosAvhubService` + `requisicao-avhub.eventos.ts` | leitura dos marcos (LOG-35) e reação por tipo | ver Jobs |
| `IntegracaoAvhubService` | responde `/requisicoes-compra`, `/itens/status` e `/itens/custo`; `etapaDoItem` gera as 11 etapas | `integracao-avhub.service.ts:158-183` (`etapaDoItem`) |
| `AuthService` | login com `bcrypt`, rate limit de 5 falhas por usuário e 20 por IP em 15 min, token por `JWT_EXPIRES_IN` (padrão `8h`) | `auth.service.ts:8-15`, `auth.module.ts:19` |
| `PerfisService` | permissão por tela (OR entre perfis), `ensurePodeAtuar` por setor, `ensurePodeAtuarDepositos`, `depositosVisiveis`, `temPermissao` | `perfis.service.ts:260-345` (`ensurePodeAtuar`) |

## Jobs e timers (todos dentro do processo da API, sem `@nestjs/schedule`)

Não há `@Cron`; os cinco timers usam `setInterval` ✅ (grep em `src`).

| Job | Arquivo:linha | Intervalo | Faz | Variável |
|---|---|---|---|---|
| Envio da requisição ao av-hub (LOG-34) | `envio-avhub.service.ts:46-55` | 60 s (`0` desliga); primeira rodada 5 s depois da subida; backoff 1, 2, 5, 10, 30, 60 min (`:23`) | `PUT {API_URL}/compras/requisicoes/origem/{id_origem}`, lote de 100, timeout 15 s | `AVHUB_ENVIO_INTERVALO_SEG` |
| Leitura dos marcos (LOG-35) | `eventos-avhub.service.ts:58-66` | 5 min (`0` desliga); primeira rodada 10 s depois; sob demanda via `POST /compras/requisicoes/sincronizar`, pulada se a última leitura boa tem menos de 30 s (`:25,81-90`) | `GET {API_URL}/compras/requisicoes/eventos`, página de 200, até 50 páginas, relê 2 min para trás; cursor `integracao_avhub_cursores.chave = 'requisicoes-eventos'` | `AVHUB_EVENTOS_INTERVALO_MIN` |
| Reenvio de `importado` (LOG-26) | `pedidos.service.ts:81-83` | 10 min (`0` desliga) | `POST /pedidos_liberados/:numero/importado` para pedidos dos últimos 7 dias, 20 por rodada | `AVHUB_REENVIO_IMPORTADO_MIN` |
| Referência da OC (API-004/007) | `oc-referencia-avhub.service.ts:108-110` | 5 min (`0` desliga) e na subida | `GET {API_URL}/ordens-compra/referencia`, até 500 por página e 40 páginas, relê 5 min para trás; cursor `ordens-compra-referencia`; chave `API_KEY` | `AVHUB_OC_INTERVALO_MIN` |
| Referência da requisição do Hub (API-009) | `requisicao-hub-referencia-avhub.service.ts:87-89` | 5 min (`0` desliga) | `GET {API_URL}/compras/requisicoes/referencia`; linha com `visivel_ao_pcp = false` some da projeção | `AVHUB_REQ_HUB_INTERVALO_MIN` |

Reação por marco (`requisicao-avhub.eventos.ts:234-246`): `requisicao_recebida`, `requisicao_reaberta`, `oc_cancelada` → `AGUARDANDO_COMPRADOR`; `em_cotacao`, `oc_removida` → `EM_COTACAO`; `oc_criada`, `oc_enviada_aprovacao` → `EM_APROVACAO`; `oc_aprovada` → `COM_FORNECEDOR`; `despachada` → `EM_TRANSITO`; `requisicao_cancelada` → `CANCELADA` ✅. `fornecedor_confirmou`, `previsao_alterada`, `ocorrencia` e `oc_no_omie` só atualizam campos da situação (previsão, ocorrência aberta) sem mudar a etapa ❓ (conferir ramo a ramo em `:107-230`).

## Variáveis de ambiente (conferidas no código)

| Variável | Uso | Padrão | Código |
|---|---|---|---|
| `DATABASE_URL` | conexão Prisma (adaptador `pg`) | — | ✅ `prisma/prisma.service.ts:9` |
| `PORT` | porta HTTP | 3000 | ✅ `main.ts:156` (`process.env.PORT ?? 3000`) |
| `NODE_ENV` | produção esconde `/docs` sem senha | — | ✅ `main.ts:59` |
| `JWT_SECRET` | assina e valida o JWT | — | ✅ `auth.module.ts:15`, `strategies/jwt.strategy.ts:15` |
| `JWT_EXPIRES_IN` | validade do token | `8h` | ✅ `auth.module.ts:19` |
| `MES_INTERNAL_API_KEY` | chave do BFF app-pcp para `POST /auth/azure` | — (sem ela a rota fica fechada) | ✅ `auth/guards/api-key.guard.ts:15` |
| `MES_API_KEY` | chave que o av-hub usa para ler `/itens/status`, `/itens/custo` e `/requisicoes-compra` | — (sem ela fecha) | ✅ `integracao-avhub/avhub-api-key.guard.ts:14` |
| `API_URL` | base do av-hub (`api-acos-vital`) | `https://api.acosvital.com.br` | ✅ `api-pcp` `src/integracao-avhub/envio-avhub.service.ts:13` (`API_BASE_URL`), `eventos-avhub.service.ts:23`, `omie-integracao.ts:10`, `produtos-avhub.client.ts:24` |
| `API_KEY` | chave de leitura/escrita que o MES usa no av-hub (marcos, Triagem, Destinação, produtos, unidades) | — | ✅ `eventos-avhub.service.ts:192`, `omie-integracao.ts:149,241,349,411`, `produtos-avhub.client.ts:60` |
| `AVHUB_MES_INTEGRACAO_KEY` | chave do PUT da requisição e do POST dos avisos de compra (LOG-58); é um valor de `MES_INTEGRACAO_KEYS` do av-hub, mínimo 32 caracteres | — (sem ela a fila espera) | ✅ `api-pcp` `src/integracao-avhub/envio-avhub.service.ts:93` (`process.env.AVHUB_MES_INTEGRACAO_KEY`) |
| `AVHUB_ENVIO_INTERVALO_SEG`, `AVHUB_EVENTOS_INTERVALO_MIN`, `AVHUB_REENVIO_IMPORTADO_MIN`, `AVHUB_OC_INTERVALO_MIN`, `AVHUB_REQ_HUB_INTERVALO_MIN` | intervalos dos cinco timers | 60, 5, 10, 5, 5 | ✅ acima |
| `DOCS_USER`, `DOCS_PASSWORD`, `DOCS_ENABLED` | Basic Auth do `/docs` e liga/desliga | `docs`, vazio, ligado | ✅ `main.ts:56-58` |

As cinco variáveis `AVHUB_*_INTERVALO_*`/`_MIN` são regra em ambiente. A regra do Nathan ("nenhuma regra em variável de ambiente para jobs novos") vale para os jobs do av-hub; no MES os cinco timers leem ambiente 🟡. Chaves e escopos: [[Chaves-e-Autenticacao]].

## O que o MES chama no av-hub

`GET /pedidos_liberados`, `GET /pedidos_liberados/:numero/itens`, `POST /pedidos_liberados/:numero/importado` (LOG-26); `PUT /compras/requisicoes/origem/:id` (LOG-34); `GET /compras/requisicoes/eventos` (LOG-35); `GET /ordens-compra/referencia` (API-004/007, desde 15/10); `GET /compras/requisicoes/referencia` (API-009, desde 23/10); `GET /produtos`, `GET /produtos/:id` (snapshot do material); `GET /unidades` (nome da filial, cache de 10 min, `estoque-operacao.service.ts:37`) ✅.

## O que falta ou diverge (resumo; detalhe em [[Pontas-Soltas]] e [[Diferencas-Codigo-x-Banco]])

- 🔴 Módulo `fluxo` (Torre) não existe; o `GET /itens/custo` existe desde 27/10 (só na `develop`).
- ✅ Fabricado aprovado vira lote `PRODUCAO` (LOG-53, `OrigemLote.PRODUCAO`, `prisma/models/estoque.prisma:11-17`). O fabricado entra **sem custo** (`itens-parciais.service.ts:1403-1410`); o custo da matéria-prima do fabricado ainda não existe ❓.
- ✅ `lote_custo` é gravado na carga inicial, na cisão, pela OC no Recebimento (`compras.service.ts:1045`, `recebimento.service.ts:1148`, `compra-oc.ts:114`) e pela rota manual (`estoque-operacao.service.ts:732`).
- ✅ Retirada: a baixa do saldo acontece na confirmação da retirada (`src/estoque/retirada/retirada.ts:146`, `await registrarSaidaDoLote(tx, {`), e o recebimento da parcial espera a retirada concluir (`itens-parciais.service.ts:280`, `retiradaPendenteDaParcial`). A parcial atendida antes de 23/11 ainda baixa no recebimento (`itens-parciais.service.ts:332`) e, por garantia, na entrega (`entregas.service.ts:72`).
- 🟡 Tabela `fornecedores` (projeção de `core.parceiros`) existe e nenhum código a popula nem lê; o fornecedor da OC vem de `oc_referencia`.
- 🟡 `GET /requisicoes-compra` (contrato 003) sem consumidor.
