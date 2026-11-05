---
tags: [pesquisa, comercial, suprimentos, api-comercial, proposta, orcamento, mapa, staging, parte]
criado: 2026-11-05
estado-em: 2026-10-29
status: proposta
dono: Pablo
parte-de: "[[Mapa-do-Modulo-do-Pablo]]"
fontes: [av-hub 5aa5311 (branch feat/menu-orcamento-vendas-compras) api-comercial/prisma/models e prisma/migrations, api-comercial/src/modules e src/domain, api-comercial/README.md, app/api/comercial/[...rota]/route.ts, app/(protected)/vendas orcamento compras, components/Propostas Suprimentos PainelComprador, lib/domain/fluxo-suprimentos.ts, docs/ENVIAR - contrato-comercial-suprimentos-telas.md, Dump Avhub (Esqueleto).sql, omie-elt-pipeline src/jobs/envioOrdensCompra.ts, 00-Briefing-Decisoes]
---

# Mapa do módulo do Pablo (Comercial e Suprimentos), como está hoje: detalhe técnico (2/2)

**Em uma frase:** detalhe técnico da nota [[Mapa-do-Modulo-do-Pablo]] (parte 2 de 2): 5. Rotas por módulo (`/v1`); 6. Telas do av-hub; 7. Integrações com o Omie; 8. O que serve como está, o que muda e o que fica de fora; 9. Defeitos do código de teste que a migração não pode herdar; 10. Perguntas que nascem deste mapa.

**Onde estamos:** ← [[Mapa-do-Modulo-do-Pablo]] (resumo e índice) · partes: [[Mapa-do-Modulo-do-Pablo-Detalhe-Tecnico-1]] · **Mapa-do-Modulo-do-Pablo-Detalhe-Tecnico-2**

## 5. Rotas por módulo (`/v1`)

Prefixo de cada router em `src/app.ts:97-115`. Linha = handler.

| Módulo | Rotas | Arquivo e linhas |
|---|---|---|
| Cadastros | `GET /me`, `/empresas_emissoras`, `/parametros_custo`, `/cambio`, `/responsaveis`; `PUT /parametros_custo` | ✅ `src/modules/cadastros/cadastros.routes.ts:14,38,91,99,123,136` |
| Propostas | `GET /`, `/resumo`, `/:id`, `/:id/eventos`, `/:id/versoes`, `/:id/versoes/:revisao`, `/:id/pedido_omie` (+ `/xlsx`), `/itens/modelo`; `POST /`, `/calcular`, `/itens/importar`, `/:id/duplicar`, `/:id/fechar`, `/:id/perder`, `/:id/reabrir`, `/:id/email`, `/:id/eventos/pdf_gerado`; `PUT /:id`, `/:id/pedido_omie`; `DELETE /:id` | ✅ `src/modules/propostas/propostas.routes.ts:17-164`, `emailProposta.ts:26`, `pdfGerado.ts:17` |
| Clientes | `GET /clientes` (+ `/exportar`, `/resumo`, `/receita/:cnpj`, `/por_documento/:documento`, `/:id/propostas`, `/:id`); `POST /clientes`, `/:id/contatos`; `PUT /clientes/:id`, `/:id/contatos/:idContato`; `DELETE …/contatos/:idContato` | ✅ `src/modules/clientes/clientes.routes.ts:85-487` |
| Custos | `POST /custos/sugerir`; `GET /telha/tabela`, `/telha/tabelas`; `PUT /telha/tabela`; `POST /telha/calcular`; `GET/POST /solicitacoes_custo` e `/:id/responder`, `/assumir`, `/liberar`, `/cancelar` | ✅ `src/modules/custos/custos.routes.ts:30,159,173,213,251,304,367,406,494,500,508` |
| Suprimentos | `GET /produtos` (+ `/:id`, `/:id/precos`), `POST /produtos`; `GET /fornecedores` (+ `/exportar`, `/emails`, `/apelidos`, `/:id`), `PUT /fornecedores/:id/perfil`, categorias e certificados; `GET /categorias`; `GET /ofertas` (+ `/exportar`, `/importacoes`), `POST /ofertas`, `/ofertas/importar_mapa`, `/ofertas/:id/invalidar` | ✅ `src/modules/suprimentos/suprimentos.routes.ts:29,72,106,152,192,202,248,274,291,312,339,375,396,415,433,444,561,597,645,687,757,791,823` |
| Outros de Suprimentos | `GET /historico_compras` (+ `/resumo`); `GET /painel_comprador`; `GET /pedidos_cotacao/fornecedores`, `/analise`, `POST /pedidos_cotacao`; `GET /pesquisa_materiais` (+ `/:id`, `/pesquisa_materiais_cotacao`); `GET /produtos_pendentes`, `POST /produtos_pendentes/:id/vincular` | ✅ `historicoCompras.ts:100,129`, `painelComprador.ts:142`, `pedidoCotacao.ts:34,57,175`, `pesquisaMateriais.ts:55,166,189`, `produtosPendentes.ts:35,63` |
| Simulador | `POST /propostas/por_pedido_omie`, `POST /custos/sugerir_compra` (leitura para o Simulador de Comissões; a regra mora em `src/domain/simulador/ladoCompra.ts`) | ✅ `src/modules/simulador/simulador.routes.ts:125,219` |
| Dashboards e relatórios | `GET /dashboards/comercial`, `/relatorios/cotacoes`, `/relatorios/gerencial` (JSON ou XLSX) | ✅ `dashboards.routes.ts:40`, `relatorios.routes.ts:19,35` |
| Notificações | `GET /notificacoes`, `POST /:id/lida`, `/ler_todas` | ✅ `notificacoes.routes.ts:10,32,39` |
| Omie | `GET /omie/sincronizacoes`, `POST /omie/sincronizar` | ✅ `omie.routes.ts:27,55` |

O BFF tem 84 entradas na allowlist, cada uma com tela e ação ✅ `app/api/comercial/[...rota]/route.ts:10-132`. Rotas dedicadas a arquivo: PDF da proposta, da aprovação interna, do lote e dos relatórios, planilhas de relatório, de clientes, de fornecedores, de ofertas, da importação de itens e do pedido Omie ✅ `find app/api/comercial` (14 arquivos além da allowlist).

## 6. Telas do av-hub

> [!info] Estado em 29/10/2026 (av-hub 758d5f0)
> A tabela abaixo é de 16/10 (av-hub 5aa5311). Depois do menu enxuto (N16-107, 27/10) **não existem mais** as telas `/vendas/clientes` (virou `/vendas/acompanhamento-clientes`), `/vendas/relatorio-cotacoes`, `/orcamento/pedido-cotacao`, `/orcamento/ofertas-fornecedor`, `/orcamento/pesquisa-materiais`, `/orcamento/tabela-telha` e `/compras/historico-compras` (N16-108). Existem hoje em `app/(protected)`: `vendas/propostas` (lista, `nova`, `[id]`; do Robert), `vendas/relatorio-gerencial`, `vendas/pedidos-de-venda`, `orcamento/{catalogo-produtos,fornecedores,painel-comprador,parametros-custo,custo-itens}` (do Pablo com o Robert) e `dashboards/dash-comercial` ✅. O BFF só liga ao Hub as rotas marcadas `api: 'hub'`; as demais respondem 503 `RECURSO_NAO_MIGRADO`.

| URL | Componente | Slug | Selo |
|---|---|---|---|
| `/vendas/propostas` | `components/Propostas/PropostasLista.tsx` | `propostas` | ✅ |
| `/vendas/propostas/nova`, `/vendas/propostas/[id]` | `components/Propostas/PropostaForm/PropostaForm.tsx` (897 linhas) com `ItemProposta`, `ConfiguradorTelhaModal`, `FecharItensModal`, `PedidoOmieModal`, `RevisoesModal`, `LinhaDoTempoModal`, `SolicitacoesProposta`, `EnviarEmail`, `AndamentoProposta` | `propostas` | ✅ |
| `/vendas/clientes`, `/novo`, `/[id]` | `components/Comercial` e páginas | `clientes` | ✅ |
| `/vendas/relatorio-cotacoes`, `/vendas/relatorio-gerencial` | páginas | `relatorio-cotacoes`, `relatorio-gerencial` | ✅ |
| `/vendas/pedidos-de-venda` | página da lista de pedidos do Omie (tabela `pedidos_vendas`, contrato 08) | slug ❓ (não consta no SQL de 16/10; é do módulo Vendas já existente) | ✅ `app/(protected)/vendas/pedidos-de-venda/page.tsx:26-32` |
| `/orcamento/painel-comprador` | `components/PainelComprador/PainelComprador.tsx`, `ResponderSolicitacaoModal.tsx` | `painel-comprador` | ✅ |
| `/orcamento/pedido-cotacao` | `components/Suprimentos/PedidoCotacao.tsx`, `AnaliseItemPedidoModal.tsx` | `pedido-cotacao` | ✅ |
| `/orcamento/ofertas-fornecedor` | `OfertasLista.tsx`, `LancarOfertaModal.tsx`, `ImportarMapaModal.tsx`, `LigarFornecedorMapa.tsx` | `ofertas-fornecedor` | ✅ |
| `/orcamento/fornecedores`, `/[id]` | `FornecedoresLista.tsx`, `FornecedorFicha.tsx`, `CategoriasFornecedor.tsx`, `CertificadosFornecedor.tsx`, `EditarPerfilFornecedorModal.tsx` | `fornecedores` | ✅ |
| `/orcamento/catalogo-produtos`, `/[id]` | `CatalogoLista.tsx` (lista de 80 mil produtos com busca por trigramas), `ProdutoDetalhe.tsx` (abas Cadastro, Especificação e Preço por fornecedor; média geral de 90 dias), `ProdutosPendentesModal.tsx` | `catalogo-produtos` | ✅ `CatalogoLista.tsx:23-174`, `ProdutoDetalhe.tsx:204-323` |
| `/orcamento/pesquisa-materiais` | `PesquisaMateriais.tsx`, `ComparativoMaterialModal.tsx` | `pesquisa-materiais` | ✅ |
| `/orcamento/parametros-custo`, `/orcamento/tabela-telha` | páginas | `parametros-custo`, `tabela-telha` | ✅ |
| `/compras/historico-compras` | `HistoricoCompras.tsx`, `GraficoComprasMes.tsx` | `historico-compras` | ✅ |
| `/dashboards/dash-comercial` | página | `dash-comercial` | ✅ |
| Faixa "fluxo do custo" nas telas de Orçamento | `FluxoDoCusto.tsx` e `lib/domain/fluxo-suprimentos.ts:19-56` (5 passos: vendedor pede custo, comprador assume, pedir cotação, registrar preço, custo volta à proposta) | — | ✅ |

Tipos de tela ainda dizem "api-comercial" e `PARCIAL`/`FECHADA` (`lib/domain/comercial-propostas.ts:5`): precisam acompanhar a nova API.

## 7. Integrações com o Omie

| O que | Como é hoje | Selo |
|---|---|---|
| Produtos e fornecedores | Cópia local sincronizada a cada 15 min a partir do espelho do hub (`core.produtos`, `core.parceiros`), com de-para de unidade de medida (cerca de 85 grafias) | ✅ `src/modules/omie/fonteHub.ts:4-10`, `normalizacao.ts`, `agendador.ts:41-` |
| Pedidos de compra | Lidos direto da API do Omie (`PesquisarPedCompra`), pelas chaves do app de Mogi e Uberaba; viram ofertas `PEDIDO_OMIE`; a releitura cobre os últimos 60 dias e os cancelados vêm de uma segunda consulta | ✅ `docs/contrato-pedidos-compra-omie.md:5-9`, `sincronizacao.ts:265-380` |
| Câmbio | AwesomeAPI com fallback para a PTAX do Banco Central; cache de 10 min | ✅ `src/modules/cadastros/cambio.ts:1-59` |
| Pedido de venda | Só o resumo para o vendedor digitar (ver 4.5) | ✅ `pedidoOmie.ts:7-12` |
| Envio de OC (modelo para o pedido de venda) | A API do hub guarda a OC com `status_sincronizacao_omie` e expõe `GET /compras/ordens/fila-omie`; a pipeline lê a fila, chama `UpsertPedCompra` com `cCodIntPed` = número da OC, devolve `nCodPed` e `cNumero` por `PATCH /compras/ordens/{id}/sincronizacao`; recusa vira `erro` e só volta por `POST /:id/reenviar` | ✅ `api-acos-vital/src/schemas/core_vendas_faturamento/tables/ordens_compra/ordens_compra.route.js:857-889,1264-1356`, `omie-elt-pipeline/src/jobs/envioOrdensCompra.ts:16-39,130-167` |
| Pedido de venda por API | A pipeline não tem nenhum método de criação de pedido de venda (grep sem ocorrência de `IncluirPedido`) | ✅ 🔴 `omie-elt-pipeline/src/omie/resources` (só leitura de `pedidosVendas.ts`) |
| Retorno do pedido | O pedido criado no Omie volta pela pipeline para `core_vendas_faturamento.pedidos_vendas` e `produto_vendas` | ✅ `Dump Avhub (Esqueleto).sql:2328,2490` |

## 8. O que serve como está, o que muda e o que fica de fora

### 8.1 Serve como está (porta para a `api-acos-vital` sem mudar a regra)

| Item | Por quê | Selo |
|---|---|---|
| Cálculo de linha, totais, margem real | Regra travada contra o legado; N16-11 manda manter o motor | ✅ `linhaItem.ts`, `totais.ts` 🟡 porta como está |
| Custo líquido, médias, seleção de custo, análise de compras | Servem à base de preço do Orçamento | ✅ `custo.ts`, `medias.ts`, `analiseCompras.ts` |
| Configurador de telha e a ideia da tabela com vigência | N16-15 mantém o módulo; só a tabela vira estruturada | ✅ `configurador.ts` |
| Clientes, contatos, carteira e ficha | Continuam em Vendas | ✅ `clientes.routes.ts` |
| Idempotência, `If-Match`/`ETag`, envelope de erro | Padrão de [[Contratos-da-v2\|LOG-52]] T3 e T4 | ✅ `README.md:37-44` |
| Empresas emissoras (AV, AU, HRM) com cabeçalho do PDF | Continuam; ganham a unidade do Omie onde o pedido é criado | ✅ `empresas.prisma:2-29` |
| Solicitação de custo (assumir, liberar, responder, cancelar) | Vira o pedido de custo ao Orçamento (N16-06) | ✅ `custos.routes.ts:304-542` |
| Ofertas imutáveis, invalidar com motivo, trava de escala | Base com histórico sempre (N16-07) | ✅ `suprimentos.routes.ts:687-806` |
| Painel do Comprador, pedido de cotação, pesquisa de materiais, fornecedores, catálogo | Telas do Orçamento | ✅ |
| Histórico de compras | Fica em Compras (N14-14, N16-14) | ✅ `historicoCompras.ts` |

### 8.2 Muda por causa das decisões

| Hoje no código | Muda para | Decisão | Onde fica o desenho |
|---|---|---|---|
| Número `CO-AV2026-0012-R03`, com letras, ano e revisão no texto | Número só numérico, em sequência própria; prefixo só na tela e no PDF | 📝 N16-04 | |
| Status `ABERTA`, `PARCIAL`, `FECHADA`, `PERDIDA` e editar só em `ABERTA` | `ABERTA` (ajusta), `APROVADA` (trava), `TRANSFORMADA`, `CANCELADA` | 📝 N16-02, N16-03 | |
| `PUT` edita e reabre depois de fechada ou perdida | Depois de aprovada não se ajusta nem se reabre | 📝 N16-03 | |
| Fechamento parcial por itens, `valor_fechado`, `valor_aberto`, evento `FECHAMENTO_PARCIAL` | Some: uma proposta é um pedido | 📝 N16-02 | |
| Proposta incompleta (item sem custo) pode ser salva e fechada | Incompleta não aprova (parte de compras vazia) | 📝 N16-03 | (`fn_proposta_travar`) |
| Pedido digitado pelo vendedor no Omie, com `PUT /pedido_omie` registrando número e Qualidade | Botão "Transformar em pedido de venda"; a API grava numa fila e a pipeline cria o pedido por API | 📝 N16-02 | |
| Qualidade registrada depois, na liberação do hub (V3) | `V2` obrigatório na proposta; o pedido nasce liberado, sem V3; o pedido que chega do Omie sem proposta segue com V2 e V3 | 📝 N16-05 | |
| Câmbio da AwesomeAPI com fallback PTAX | PTAX do hub (`core.cotacoes_moeda`) | 📝 N16-13 | (`id_cotacao_moeda`) |
| Custo do item só como snapshot da oferta sugerida | Parte de compras do vendedor + pedido de custo ao Orçamento, que preenche | 📝 N16-06 | |
| Solicitação de custo com prazo fixo de 2 dias úteis no código | Prazo definido pelo negócio (parâmetro) | 📝 N16-06, 🔴 OQ-02 | (`sla_solicitacao_dias_uteis`) |
| Catálogo de produtos é tela de Compras | O vendedor ganha tela de consulta (histórico, fornecedores, preços, média); matriz de preços nova | 📝 N16-07, 🔴 OQ-10 | |
| Ofertas `PEDIDO_OMIE` vêm de sincronização própria que lê o Omie | Derivam das OCs do hub e do espelho `pedidos_compras` (a pipeline é a fonte) | 📝 N16-15 | (`fn_oferta_gerar_de_ocs`) |
| Custo real do pedido não existe (só margem estimada com o custo cotado) | Custo real por evento e por item do pedido, com view `vw_pedido_item_custo` | 📝 N16-09 | |
| Compras não tem papel sobre a proposta | Compras confere a parte de compras (C6) e usa o valor correto na OC (C7); não altera a proposta; o preço fechado com o cliente não muda | 📝 N16-08, N16-17 | |
| Simulador de Comissões lê a proposta pelo `numero_pedido_omie` | Lê o pedido de venda do hub ligado à proposta (`pedido_venda.id_proposta`) | 📝 N16-11 | §9 |

### 8.3 Fica de fora da migração

| Item | Motivo | Decisão |
|---|---|---|
| Migração do ERP antigo (`erp_quotations`, `src/domain/migracao/erpAntigo.ts`, `src/modules/propostas/migracao.ts`, `npm run migrar:erp-antigo`), campo `legado` e evento `MIGRADA` | Não há migração do ERP antigo | 📝 N16-13 |
| Sincronização Omie (`src/modules/omie/*`, rotas `/omie/*`, tabelas `sincronizacoes_omie`, `omie_registros_brutos`, `travas_tarefa`, `produtos_contas_omie`, `fornecedores_contas_omie`, `ordens_compra`, `itens_ordem_compra` do comercial, slug `sincronizacao-omie`) | A Sincronização Omie sai do menu e a pipeline é a fonte | 📝 N16-14, N14-15 |
| Câmbio próprio (`cambio.ts`) e rota `GET /cambio` | PTAX do hub | 📝 N16-13 |
| Planilha e resumo "pedido a digitar no Omie" (`pedidoOmie.ts`, `GET/PUT /propostas/:id/pedido_omie`, `…/xlsx`, `PedidoOmieModal.tsx`) | O pedido é criado por API | 📝 N16-02 |
| `Auditoria` própria | Já existe `auth.auditoria` | 🟡 [[Contratos-da-v2\|LOG-52]] §3.1 |
| `perfisDev.ts` e `AUTH_DEV_BYPASS` | Perfis fictícios, nunca em produção | 🟡 LOG-52 §6 |
| As 5 telas antigas de `/orcamento/*` e as rotas `app/api/historicoProdutos` | Removidas do av-hub em 16/10 | 📝 N16-14 |
| `Unidade` (`MOGI`, `UBERABA`, `ARUJA`) e `ContaOmie` como enums | Viram `core.unidades` (uuid) | 🟡 |
| Faixa "fluxo do custo" que começa em "Vendedor pede custo" | Texto muda: o setor orçamentário preenche | 🟡 |

## 9. Defeitos do código de teste que a migração não pode herdar

A auditoria de 15/10 (24 itens) está em [[Contratos-da-v2|LOG-52]] §10. Os que tocam as tabelas e regras da proposta, do Orçamento e da comissão: filtro por responsável que anula o escopo `proprios` (item 1), `vinculados` que não restringe (item 2), CNPJ alfanumérico rejeitado (item 4), cliente criado na proposta que sobrescreve o cadastro de outro vendedor (item 6), custo e margem apagados por `PUT` sem `veCusto` (item 8), `normalizarIpi` na oferta digitada (item 16), sem FK nem `CHECK` (item 17). Os DDL de já trazem FK, `CHECK` e CNPJ de 14 posições alfanuméricas.

## 10. Perguntas que nascem deste mapa

| # | Pergunta | Quem | Selo |
|---|---|---|---|
| M1 | O slug da tela `/vendas/pedidos-de-venda` e o da `notas-fiscais-saida` são os que a pasta `app/(protected)` usa; confirmar o slug real em `auth.telas` | Nathan | ❓ |
| M2 | O catálogo de condições de pagamento de **venda** do Omie não está espelhado (só `condicoes_pagamento_compras`): como o pedido por API recebe a condição da proposta, que hoje é texto livre? | Gustavo, Nathan | 🔴 |
| M3 | O cadastro do cliente da proposta existe nas duas contas Omie? Se não, o pedido espera o cadastro ou a pipeline cria o cliente? | Nathan, Gustavo | 🔴 |
