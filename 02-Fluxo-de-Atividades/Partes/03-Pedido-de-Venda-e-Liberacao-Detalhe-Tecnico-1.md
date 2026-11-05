---
tags: [fluxo, raia, vendas, liberacao, av-hub, v1, v2, v3, parte]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Nathan
parte-de: "[[03-Pedido-de-Venda-e-Liberacao]]"
develop-conferida: [api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
fontes: [LOG-26 (contrato de liberação), LOG-40 (escopo do vendedor), API-005, API-006, SQL-010, 00-Fluxo-Mestre-0b, v1 01-Fluxo-Operacional/Entrada-Comercial, v1 Fluxograma-Telas-por-Bloco bloco 1, v1 Fluxo-Sistema-no-Meio atos 1b e 17, api-acos-vital f322dcd, HUB b55ac55, api-pcp 579a625, app-pcp 1fca8d3, Dump Avhub 14/10]
---

# Raia Vendas: liberação do pedido (V1 a V3): detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[03-Pedido-de-Venda-e-Liberacao]] (parte 1 de 2): Quem atua (onde); Regras decididas; Estados; Telas; Endpoints e contratos; Como está no código.

**Onde estamos:** ← [[03-Pedido-de-Venda-e-Liberacao]] (resumo e índice) · partes: **03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-1** · [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2]]

## Quem atua (onde)

| Quem | Papel | Onde |
|---|---|---|
| Vendedor | Marca Sim ou Não e libera os pedidos dele | Portal do Vendedor, `/vendas/liberar-pedidos` |
| Auxiliar do titular | Libera pelos titulares que auxilia (mesmo escopo de Meus Pedidos) | idem |
| Gerente (perfis que já veem Pedidos da Equipe) | Vê todos os pedidos da liberação, só leitura; descobre quem está segurando pedido | Portal do Gerente, `/liberacao-equipe` |
| PCP | Consome os liberados (não marca nada) | MES, ver [[04-PCP-Triagem-e-Destinacao]] |
| Gustavo (DBA) | Banco e API desta raia | `api-acos-vital` |
| Nathan | Front do av-hub (telas e BFF) | HUB |
| Robert | Lado MES do contrato (`importado`, polling) | `api-pcp` |

Pedidos manuais (anexo) e comissões ficam fora desta raia (decisão do Nathan: Atividades é a espinha).

## Regras decididas

Origem: [[Contratos-da-v2|LOG-26]] §2, decisões do Nathan de 28/09/2026, salvo onde indicado.

| # | Regra | Selo |
|---|---|---|
| 1 | O pedido chega do Omie travado; o vendedor marca "a Qualidade acompanha desde o início?" (Sim ou Não) e libera **na mesma ação** (marcação e liberação não se separam). | 📝 |
| 2 | **Só pedido liberado vai ao MES.** Sem linha em `pedidos_vendas_liberacao`, o MES não enxerga o pedido (`/pedidos_liberados` não o lista; os itens respondem 409 `PEDIDO_NAO_LIBERADO`). | 📝 |
| 3 | Grão **por pedido** (`codigo_empresa` + `numero_pedido`). As parciais que o pipeline cria depois herdam a marcação. | 📝 |
| 4 | **Data de corte:** só pedido incluído a partir de `parametros_vendas.data_inicio_liberacao` precisa de liberação. A carteira anterior não trava. | 📝 |
| 5 | O vendedor pode **corrigir a marcação até o MES importar**. Depois da importação a marcação trava (409 `PEDIDO_IMPORTADO_MES`; no banco, erro `23514` do trigger). | 📝 |
| 6 | **Ninguém empurra ao MES: o MES faz GET (polling).** É o Fluxo 4 da integração (os Fluxos 1 a 3 são requisição, referência da OC e status por item). | 📝 |
| 7 | Quem libera: o vendedor e o auxiliar dos titulares que ele auxilia. | 📝 |
| 8 | O gerente tem tela própria, **só visualização**, com todos os vendedores. | 📝 |
| 9 | O escopo do vendedor é aplicado **pela API a partir do token** (contrato [[Contratos-da-v2\|LOG-40]]): sem a chave `vendedor`, a API preenche com os vendedores do usuário. O BFF não filtra mais. | 📝 |
| 10 | Pedido do Omie entra na liberação com os mesmos filtros que a Carteira antiga usava: `sequencial = 0`, sem track record, grupo líquido (sem dedução ou blacklist), `etapa <> 0`, incluído a partir da data de corte e `situacao = 'Pendente'` (ou já liberado). | 📝 |
| 11 | A marcação "Qualidade acompanha" é **capturada agora e consumida depois** pela fila de inspeção de processo da Qualidade (não existe, ver "O que falta"). | 📝 |

## Estados

### Estado da liberação (`status_liberacao`, valor da view `vw_pedidos_liberacao`)

| Valor | Significado | Quem vê |
|---|---|---|
| `pendente` | O vendedor ainda não liberou; o PCP não vê. Aba "Aguardando você" (vendedor) ou "Aguardando vendedor" (gerente) | vendedor, gerente |
| `liberado` | Liberado; o MES ainda não confirmou a importação. Dá para trocar a marcação. Aba "Liberados" | vendedor, gerente, MES |
| `importado` | O MES confirmou (`importado_mes_em` preenchido). A marcação está travada. Aba "No PCP" | vendedor, gerente, MES |

Campo `acompanhamento_qualidade`: `true` (a Qualidade acompanha desde o início), `false` (só inspeção no fim), `null` (sem linha: não liberado). Histórico em `pedidos_vendas_liberacao_historico.acao`: `liberado`, `alterado` (guarda `valor_anterior`), `importado_mes`.

### Etapa de cada item, depois da liberação

`GET /itens_pedido_status` devolve, por parcial, `etapa` com 11 valores (lista e rótulos em [[Estados-e-Status]]): `compras.requisicao`, `compras.fechamento`, `recebimento.conferencia`, `qualidade.quarentena`, `qualidade.inspecao`, `qualidade.reprovado`, `estoque.atendimento`, `fabrica.espera`, `fabrica.execucao`, `expedicao.embalagem`, `expedicao.concluido`. Vocabulário provisório: a tela traduz o que conhece e mostra o código cru do resto (`lib/domain/etapas-item.ts:30-41` no HUB).

### Estados do vendedor (visão macro do pedido)

O desenho do v1 (estados do item visto pelo vendedor) tem 9 valores: `AGUARDANDO_LIBERACAO`, `PENDENTE_PCP`, `EM_ESTOQUE`, `EM_COMPRA`, `EM_PRODUCAO`, `EM_RECEBIMENTO`, `EM_INSPECAO`, `PRONTO_EXPEDICAO`, `FATURADO` (nove nomes, oito transições de negócio). 🟡 **Não existe no código**: nenhuma ocorrência desses nomes em HUB, `api-acos-vital` ou `api-pcp` (busca em 14/10). Hoje o vendedor vê dois níveis: `status_liberacao` (acima) e as 11 etapas por item. O mapeamento etapa para estado macro existe como coluna `estado_macro` em `core_fluxo.item_estado_projetado` (Dump Avhub, linha 2176), preenchida pelo feed do MES, que o MES ainda não publica (ver [[Rastreabilidade-e-Torre-de-Fluxo]]). Decidir se o vendedor ganha esses 8 estados ou fica com as 11 etapas é pendência do Nathan.

## Telas

| Nome atual | Nome antigo | Rota | App | Quem |
|---|---|---|---|---|
| Liberar Pedidos | Caixa de entrada do vendedor (tela 1.1) | `/vendas/liberar-pedidos` | HUB (Portal do Vendedor) | Vendedor: `pode_visualizar` e `pode_editar` |
| Liberação da Equipe | visão do gerente da 1.1 | `/liberacao-equipe` | HUB (Portal do Gerente) | perfis com `pedidos-equipe`: só `pode_visualizar` |
| Meus Pedidos (detalhe, cartão Etapa dos itens) | Meus Pedidos por etapa (tela 1.2) | `/meus-pedidos/pedido/:empresa/:numero` | HUB | Vendedor |
| Pedidos da Equipe (detalhe, mesmo cartão) | idem | `/pedidos-equipe/pedido/:empresa/:numero` | HUB | Gerência |
| Pedidos do PCP | Portal PCP | `/pcp-pedidos`, `/pcp-pedidos/pedido/...` | HUB | acompanhamento comercial, **não** é o `app-pcp` |
| Triagem dos Pedidos | Carteira de Pedidos | `/carteira` | app-pcp | PCP (ver [[04-PCP-Triagem-e-Destinacao]]) |

Lista completa por raia em [[Telas-por-Raia]]. O "Portal PCP" do av-hub é acompanhamento comercial por diligenciador; não confundir com o setor PCP do MES.

### O que a tela de liberação mostra e faz

Abas com contagem vinda do backend (`contagem.pendente`, `liberado`, `importado`) e "Todos"; busca por número, cliente e vendedor; ordenação por `data_inclusao`, `data_previsao`, `total_pedido_venda`, `cliente`, `numero_pedido`, `liberado_em`; Sim/Não por linha; aviso da última marcação; cadeado quando o PCP já importou. A tela da equipe acrescenta o nome do vendedor, filtro por unidade e mostra a marcação como texto ("Sim", "Não", "Não marcado"). Configuração das duas fontes em `components/LiberarPedidos/fontes.ts`.

## Endpoints e contratos

| Método e rota | Direção | Uso | Contrato |
|---|---|---|---|
| `GET /pedidos_liberacao?vendedor=&codigo_empresa=&status=&busca=&sort=&order=&page=&limit=` | HUB lê da API | caixa do vendedor e tela do gerente (sem `vendedor` = todos) | [[Contratos-da-v2\|LOG-26]] §4.1 |
| `PUT /pedidos_liberacao/:codigo_empresa/:numero_pedido` `{ acompanhamento_qualidade, updated_by }` | HUB escreve | libera (1ª vez) ou troca a marcação; 404 `PEDIDO_FORA_DA_LIBERACAO`, 409 `PEDIDO_IMPORTADO_MES`, 403 `PEDIDO_FORA_DO_ESCOPO` e `SEM_VENDEDOR_VINCULADO` | idem |
| `GET /pedidos_liberados?codigo_empresa=&alterado_desde=&mes=&ano=&importado=&page=&limit=` | MES lê (polling) | só liberados; com `alterado_desde` ordena por `liberacao_alterada_em` crescente | idem §4.2 |
| `GET /pedidos_liberados/:numero/itens?codigo_empresa=` | MES lê | itens do pedido mais o objeto `liberacao`; 409 `PEDIDO_NAO_LIBERADO` | idem |
| `POST /pedidos_liberados/:numero/importado?codigo_empresa=` `{ referencia }` | MES escreve | confirma a importação (idempotente); trava a marcação | idem |
| `GET /api/liberar-pedidos` e `PUT /api/liberar-pedidos/:empresa/:numero` | BFF do HUB | repassa à API; `?fonte=equipe` exige a tela `liberacao-equipe` | idem §5 |
| `GET /itens/status` (MES) e `GET /itens_pedido_status?codigo_empresa=&pedido_venda=&historico=` (hub) | MES para hub (job de 90 s) e HUB lê | cartão Etapa dos itens | [[Contratos-da-v2\|API-005]], [[Contratos-da-v2\|API-006]], [[Contratos-da-v2\|SQL-010]] |
| `GET /api/pedidos-venda/:fonte/:empresa/:pedido/etapas` | BFF do HUB | repassa `/itens_pedido_status`; responde `disponivel: false` quando o hub ainda não tem a rota | API-006 |

Banco e telas (DDL e `auth.telas`): apêndices A e B do contrato 26. Diagnóstico das chaves (a do MES só vale para o PUT do contrato 34; as leituras e o `POST importado` usam outra): [[Chaves-e-Autenticacao]].

## Como está no código

### Banco e API (`api-acos-vital` f322dcd)

- ✅ Rotas montadas em `src/schemas/core_vendas_faturamento/index.js:179-180` (`/pedidos_liberacao`, `/pedidos_liberados`) e job de status em `:181-186`.
- ✅ `GET /pedidos_liberacao` em `aggregates/pedidos_liberacao/pedidos_liberacao.route.js:88` (lê uma vez a view e deriva página, total e contagem por status); `PUT` em `:164`, com `PEDIDO_FORA_DA_LIBERACAO` (`:187`) e `PEDIDO_IMPORTADO_MES` (`:194`, `:222`).
- ✅ `GET /pedidos_liberados` em `aggregates/pedidos_liberados/pedidos_liberados.route.js:57` (filtra `status_liberacao IN ('liberado','importado')`), `/:numero/itens` em `:115` (409 `PEDIDO_NAO_LIBERADO` definido em `:50`), `POST /:numero/importado` em `:143`.
- ✅ Escopo do vendedor **fixo no código**: `src/utils/acessoConfig.js:73-74` (`escopoVendedoresExigir = () => true`; a chave `ESCOPO_VENDEDORES_EXIGIR` não é mais lida). Regra da rota em `src/middlewares/escopoVendedor.js:79` (`pedidos_liberacao`: formato `par`, detalhe `pedido_venda`).
- ✅ Regras no banco (Dump Avhub 14/10): trigger `fn_pedidos_vendas_liberacao_regras` (linha 7783: `liberado_por` e `liberado_em` não mudam; depois de `importado_mes_em`, trocar a marcação dá `23514`), `fn_pedidos_vendas_liberacao_historico` (linha 7743), tabela `parametros_vendas` (linha 18031), `pedidos_vendas_liberacao` (linha 18285), view `vw_pedidos_liberacao` (linha 20870).
- ✅ Job que alimenta o cartão: `tables/itens_pedido_status/itens_pedido_status.job.js` (intervalo `MES_STATUS_INTERVALO_SEG`, padrão 90, linha 217) e rota `itens_pedido_status.route.js:54`. O escopo do vendedor cobre `/itens_pedido_status` (dono por pedido; pedido sem dono conhecido em `pedidos_vendas` dá 403, fail-closed).

### HUB (b55ac55)

- ✅ BFF `app/api/liberar-pedidos/route.ts` (GET): para a fonte `vendedor` exige token de usuário (sem ele, 401 "Sessão sem identidade no backend") e **não manda `vendedor`**; 403 `SEM_VENDEDOR_VINCULADO` vira "sem vínculo". `[codigoEmpresa]/[numeroPedido]/route.ts` (PUT): exige token, põe o autor pela sessão, e o dono do pedido é conferido pela API.
- ✅ `components/LiberarPedidos/` (lista, tabela, hook e `fontes.ts`) e páginas `app/(protected)/vendas/liberar-pedidos/page.tsx` e `liberacao-equipe/page.tsx`.
- ✅ Cartão `components/Pedidos/EtapaDosItens.tsx`, embutido em `PedidoDetalhe.tsx:1051` (ao lado de `ComprasDoPedido`, `:814`), alimentado por `app/api/pedidos-venda/[fonte]/[codigoEmpresa]/[pedidoVenda]/etapas/route.ts`. Tradução das etapas em `lib/domain/etapas-item.ts:30-41`; aviso de dado velho acima de 10 minutos (`ETAPA_ATRASO_MINUTOS`).

### MES (`api-pcp` 579a625, `app-pcp` 1fca8d3)

- ✅ A Triagem lê `GET /pedidos_liberados` (`api-pcp/src/pedidos/omie-integracao.ts:338`); os itens vêm de `/pedidos_liberados/:numero/itens` (`:141`).
- ✅ A criação da destinação recusa pedido não liberado (`pedidos.service.ts:244-249`, `ConflictException`) e guarda `Pedidos.acompanhamentoQualidade` (`:283`, coluna em `producao.prisma:118`). A Triagem mostra a coluna Qualidade ("Acompanha" ou "Não", `app-pcp/app/(protected)/carteira/page.tsx:286-290`).
- ✅ Confirmação de importação (`POST .../importado`, `omie-integracao.ts:339-349`) feita depois da criação das OPs (`pedidos.service.ts:402-406`), com **reenvio automático** a cada `AVHUB_REENVIO_IMPORTADO_MIN` (padrão 10 min) para pedidos dos últimos 7 dias (`pedidos.service.ts:63-122`). Isto cumpre a promessa de retentativa feita no contrato 26.
- ✅ O status por item sai de `GET /itens/status` (`integracao-avhub.controller.ts:26`; `integracao-avhub.service.ts:114-156`; `etapaDoItem` em `:167-192`), protegido por `AvhubApiKeyGuard` com `MES_API_KEY` (fail-closed).
