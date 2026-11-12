---
tags: [fluxo, telas, rotas, raias, referencia]
criado: 2026-10-14
estado-em: 2026-11-12
status: vigente
dono: Nathan
fontes: [app-pcp 1fca8d3 (app/(protected)/**/page.tsx, títulos dos PageHeader), HUB b55ac55 em disco (app/(protected), components), v1 Fluxograma-Telas-por-Bloco, 00-Fluxo-Mestre-0b, Regras-do-Vault, app-pcp develop 93f96de e av-hub develop 758d5f0 de 29/10/2026, av-hub 44bb770 e app-pcp 4c11886 de 10/11/2026, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
develop-conferida: [av-hub d82d58b, em 2026-11-12, só Compras e Proposta; av-hub 44bb770, app-pcp 4c11886, em 2026-11-10]
---

# Telas por raia

## Em uma frase

Esta nota lista cada tela do fluxo de Atividades ([[00-Fluxo-Mestre-0b]]), setor por setor: o que ela faz, quem usa e se já existe.

## Como usar esta nota

- Ache o seu setor no **Mapa rápido** logo abaixo e vá à seção dele.
- O nó do fluxo vai entre parênteses. Rotas, slugs, arquivos, nomes antigos e o sistema (HUB ou app-pcp) estão em [[Telas-por-Raia-Detalhe-Tecnico]].

Os nomes novos já estão nos títulos do `app-pcp`; rotas, slugs e permissões seguem com os nomes antigos (ver "Detalhe técnico"). Convenção de nomes: [[Regras-do-Vault]].

Conferido em 29/10/2026 contra a `develop` do `av-hub` (`758d5f0`) e do `app-pcp` (`93f96de`). As telas do MES marcadas "develop" não estão na `main` do MES, que parou em 08/10 (merge BL-035).

Selos: ✅ existe · 🟡 parcial · 🔴 não existe · ❓ não conferido.

## Mapa rápido por setor

| Setor (nós) | O que as telas fazem | Situação |
|---|---|---|
| Vendas · V1 a V3 | Liberar e acompanhar pedido e o andamento na produção; clientes e relatório gerencial | ✅ 🟡 |
| PCP · P1, P2, P6 | Triar, destinar, montar o roteiro, ver os produtos em produção e imprimir a Ordem de Produção (develop). Faltam Novo norte e OC do pedido | ✅ 🔴 |
| Estoque · E1 a E6 | Atender, consultar, movimentar. Faltam retirada e saldo futuro | ✅ 🟡 🔴 |
| Compras · P3, C0 a C5 | Da requisição à OC | ✅ |
| Recebimento · R0 a R6 | Receber, conferir, decidir divergência | ✅ |
| Qualidade de entrada · Q1 a Q4 | Inspecionar o que chegou | ✅ |
| Produção · F1 | Tocar a fábrica. Falta o Painel TV | ✅ 🔴 |
| Qualidade de saída · Q7, Q8 | Aprovar o fabricado (develop) | ✅ |
| Expedição · X1 a X4 | Pallets e entrega. Faltam carga e transporte | ✅ 🔴 |
| Fiscal · O1, O2 | Ver notas depois do fato. Falta a sinalização | ✅ 🔴 |
| Proposta, Orçamento, comissão | Telas novas de 26/10/2026: proposta com criar, aprovar, cancelar, copiar, transformar e PDF; `C6` a `C8` com tela; Orçamento em andamento; comissão nova sem tela | ✅ 🟡 🔴 |
| Todos | Login, Acessos, Inicial. Torre de Fluxo existe sobre dados de exemplo | ✅ 🟡 |

## Vendas (V1 a V3) · [[03-Pedido-de-Venda-e-Liberacao]]

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Liberar Pedidos (V2, V3) | O vendedor libera os pedidos. Menu "Portal do Vendedor" | Vendedor | ✅ |
| Liberação da Equipe (V2, leitura) | Só leitura. Menu "Portal do Gerente" | Gerente | ✅ |
| Meus Pedidos, detalhe (V1 a O2) | Cartão "Andamento na produção". 🟡 Falta linha do tempo, SLA e filtro | Vendedor | ✅ |
| Pedidos da Equipe, detalhe | Mesmo cartão de etapa, para a equipe | Gerente | ✅ |
| Pedidos do PCP | Acompanhamento comercial por diligenciador. **Não é o `app-pcp`** | Diligenciador | ✅ |
| Propostas, lista, nova e detalhe (V0.1 a V0.7) | Criar, aprovar, cancelar, copiar e transformar em pedido. Ver [[01-Proposta-de-Venda]] | Vendedor | ✅ |
| Acompanhamento de Clientes | Clientes e grupos de empresa (a antiga tela Clientes, N16-112) | Vendedor | ✅ |
| Relatório Gerencial | Resumo por responsável, empresa e unidade | Gerência | ✅ |
| Pedidos de Venda e Notas Fiscais de Saída | Páginas existem, inativas no menu (N16-33) | — | ✅ |

## PCP (P1, P2, P6) · [[04-PCP-Triagem-e-Destinacao]]

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Triagem dos Pedidos (P1) | Primeira análise do pedido liberado | PCP | ✅ |
| Destinação do Pedido (P2) | Define a destinação do pedido | PCP | ✅ |
| Acompanhamento dos Pedidos | Lista dos pedidos em andamento | PCP | ✅ |
| Acompanhamento dos Pedidos, detalhe | Mini-roteiro, histórico, anexos, embalagens. 🟡 Falta a parte atendida pelo estoque e a reserva | PCP | ✅ |
| Pedidos excluídos | Guarda uma cópia do pedido excluído | PCP | ✅ |
| Montagem do Roteiro (P2) | Monta o roteiro base e os alternativos por item das OPs já destinadas e as libera. Só na develop (22/10) | PCP | ✅ |
| Produtos em Produção | Uma linha por split: onde cada produto está no roteiro. Só na develop (20/10) | PCP | ✅ |
| Novo norte (P6) | Retrabalho ou reabrir compra; a tela de decisões só trata recebimento | PCP | 🔴 |
| OC do pedido (P1, P2) | Mostrar na Triagem e na Destinação que já há OC (N14-20, BL-049). Hoje a Triagem mostra só as requisições do Compras com pedido de venda (develop, 23/10) | PCP | 🟡 🔴 |
| Ordem de Produção (P2) | Documento imprimível do que será fabricado (N14-22, BL-052): botão "Imprimir OP" e 2ª via no detalhe da ordem. Só na develop (27/10) | PCP | ✅ |

## Estoque (E1 a E6) · [[05-Estoque-Atendimento]] (E1–E4) · [[09-Estoque-Entrada-do-Lote]] (E5) · [[12-Estoque-Despacho]] (E6)

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Atendimento (E1 a E4) | Fila do setor, com a janela de atender | Estoque | ✅ |
| Saldo (E5, consulta) | Consulta de saldo | Estoque | ✅ |
| Reservas (E3) | Consulta das reservas | Estoque | ✅ |
| Movimentação e Ajuste (E6, parcial) | Histórico de entradas, saídas, transferências e ajustes. À mão, só transferência e ajuste, com motivo; não há entrada nem saída manual | Estoque | ✅ |
| Detalhe do lote (E5) | Movimentos do lote e etiqueta de código de barras | Estoque | ✅ |
| Painel do Estoque | Protótipo com dados de exemplo. Os alertas são reais | Estoque | 🟡 |
| Mapa do Depósito | Roda sobre dados de exemplo | Estoque | 🟡 |
| Materiais, Depósitos | Cadastros, com a API real | Estoque | ✅ |
| Documento de retirada (E6) | Não existe | Estoque | 🔴 |
| Saldo futuro (E1) | Saldo atual + OCs em andamento (N14-20, BL-050) | Estoque | 🔴 |

## Compras e fornecedor (P3, C0 a C5, FN1) · [[06-Circuito-de-Compra]]

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Requisições de compras (P3) | O "Solicitar compra" do Estoque cai aqui | Compras | ✅ |
| Compras · CCP (C5) | Só leitura. Linha do tempo por material | Compras | ✅ |
| Requisições, "Nova requisição" (C0, C1) | Caixa de entrada do Compras | Comprador | ✅ |
| Nova Ordem de Compra (C4) | Emissão da OC | Comprador | ✅ |
| Ordens de Compra (C4) | Lista das OC | Comprador | ✅ |
| Aprovações (C2, C3) | Só OC acima de R$ 30 mil; sem Diretoria (N14-21) | Gerência de Compras | ✅ |
| Follow-up (C5) | Follow-up do CCP | Comprador | ✅ |
| Dashboard de Compras | Painel de Compras | Compras | ✅ |
| Compradores | Cadastro usado pela OC (LOG-18, LOG-28, LOG-36) | Compras | ✅ |
| Avisos do MES (C1) | Recompra por RNC e recebimento reaberto, no detalhe da OC e em Requisições, com a Nova OC de recompra (LOG-58). Falta o MES mandar os avisos | Comprador | ✅ |
| Fornecedor (FN1) | Externo, sem tela | Fornecedor | — |

## Recebimento (R0 a R6) · [[07-Recebimento]]

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Recebimento (R0 a R4) | Mostra os esperados. Recebe com NF, confere e reconta | Operador do Recebimento | ✅ |
| Divergências de Recebimento (R6) | O PCP decide: aceito ou reaberto | PCP | ✅ |
| Detalhe do lote, "Imprimir etiqueta" (R4) | Imprime a etiqueta do lote | Operador do Recebimento | ✅ |
| Logística (índice) | Índice da área | Operador do Recebimento | ✅ |

## Qualidade de entrada (Q1 a Q4) · [[08-Qualidade-Entrada]]

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Inspeção de entrada (Q1 a Q4) | Inspeção do material recebido | Qualidade | ✅ |
| Fila Qualidade · Entrada | Só leitura | Qualidade | ✅ |

## Produção (F1) · [[10-Producao-e-Roteiro]]

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Filas de Produção, setores (F1) | Lista dos setores de produção | Operador, PCP | ✅ |
| Fila do setor (F1) | Tela de trabalho do setor, com 17 ações | Operador | ✅ |
| Dashboard | Dashboard de produção | PCP | ✅ |
| Painel TV | A parte do servidor existe, mas não há página | Chão de fábrica | 🔴 |
| Fábricas, Setores, Máquinas, Operadores | Cadastros operacionais | PCP | ✅ |
| Relatórios | Relatórios de produção | PCP | ✅ |

## Qualidade de saída (Q7, Q8) · [[11-Qualidade-Saida]]

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Inspeção de saída (Q7, Q8) | Fila do setor Qualidade no roteiro | Qualidade | ✅ |
| Qualidade, índice (Q7) | Índice da área | Qualidade | ✅ |

## Expedição (X1 a X4) · [[13-Expedicao]]

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Expedição (X1, X4) | Pallets e confirmação de entrega | Operador da Embalagem e da Logística | ✅ |
| Seção Embalagens do pedido (X1) | Embalagens dentro do detalhe do pedido | PCP | ✅ |
| Consolidação de carga (X3) | Não existe | Logística | 🔴 |
| Transporte e roteiro (X4) | Não existe | Logística | 🔴 |

## Fiscal (O1, O2) · [[14-Fiscal-Omie]]

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Fila de sinalização de faturamento (O1) | Não existe | Logística, Faturamento | 🔴 |
| Notas Fiscais de Saída (O2) | Lista das notas emitidas | Vendedor | ✅ |
| Minhas Notas, Notas da Equipe, Notas do PCP (O2) | Mostram as notas depois do fato | Vendedor, gerente, PCP | ✅ |

## Proposta, Orçamento e comissão nova (`V0`, `B1` a `B4`, `C6` a `C8`, `K1` a `K6`) · [[01-Proposta-de-Venda]] · [[02-Orcamento-Base-de-Preco]] · [[06-Circuito-de-Compra]] · [[15-Custo-Real-e-Comissao]]

Desenho aprovado em 26/10/2026. Em 12/11/2026 a proposta tem API na `api-acos-vital` e tela e BFF no `av-hub` para criar, aprovar, cancelar, copiar, transformar em pedido e gerar o PDF comercial, e o `C6` a `C8` têm API e tela; o resto segue sem código 🔴. As telas de proposta são do Robert e o Orçamento é do Pablo, com o Robert. Auditoria, conexões e menu: [[Telas-e-Experiencia-do-Usuario]].

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Proposta (`V0.1` a `V0.7`, `V0C`) | Cinco blocos e um botão principal por estado | Vendedor | ✅ criar, aprovar, cancelar, copiar e transformar, com botão e BFF (`av-hub` `components/Propostas/PropostaForm/AndamentoProposta.tsx:236`, `Transformar em pedido`); o modal envia as seis respostas, com Qualidade e faturamento em partes (PR #277); `V0.7` ✅ com "Tentar novamente no Omie". ✅ PDF comercial, item só do catálogo e encargo da condição do Omie (PRs #278, #286, #288 e #291); 🔴 envio por e-mail. Detalhe em [[01-Proposta-de-Venda]] |
| Meus Pedidos (`V1` a `V3`, `C8`, datas) | Pedido das duas origens, parte de compras, respostas, pendências de compra acima do valor, histórico de datas | Vendedor | 🟡 `C8` ✅ "Para você responder" no topo da lista (`av-hub` `app/(protected)/vendas/meus-pedidos/page.tsx:9`, `topo={<DivergenciasDoVendedor />}`); 🔴 o resto |
| Página do produto (`B2`) | Consulta de preço e fornecedores | Vendedor, Orçamento, Compras | 🔴 |
| Orçamento · Pedidos de custo (`B3`, `B4`) | Fila de pedidos de custo | Setor de Orçamento | 🟡 tela ✅ (aba da página Pedidos de custo); API na `api-acos-vital` 🔴 |
| Emitir OC (`C6`, `C7`) | Com os dados do vendedor e imposto por item | Comprador | 🟡 `C6` e `C7` ✅ "Cotado na proposta" na emissão (PR #282); 🔴 imposto por item (BL-053) |
| Compras · Divergências (`C8`) | Casos acima do cotado, com a solução de Compras para os reprovados | Comprador | ✅ `/compras/divergencias` (PR #283); entra no menu quando a tela `compras-divergencias` estiver cadastrada |
| Faturamento em partes (`O1`) | Bloco do pedido | Fiscal | 🔴 |
| Calendário (datas) | Exceções de feriado e dia útil por unidade | Marketing | 🔴 |
| Comissões novas (`K1` a `K6`) | Estimada, Minhas Comissões, fila e decisão da Controladoria, notas esperando a simulação, devoluções | Vendedor, Controladoria, Gerência, Coordenação, Fiscal | 🔴 |

## Telas que servem a todos

| Tela | Para que serve | Quem usa | Situação |
|---|---|---|---|
| Login (T.1) | Azure AD e usuário e senha | Todos | ✅ |
| Cadastros › Acessos (T.2) | Usuários, Perfis, Permissões, Telas e vínculos ([[RBAC-e-Permissoes]]). 🔴 `PerfilSetor` sem filial | Administrador | ✅ |
| Torre de Fluxo (T.3 a T.6) | Mapa, ranking, tempo e trilha por item. As telas existem no HUB sobre dados de exemplo (BL-022, 15/10, `3cd55de`); o MES ainda não publica o feed ([[Rastreabilidade-e-Torre-de-Fluxo]], [[Contratos-da-v2\|LOG-46]]) | Gestão | 🟡 |
| Inicial, Blank | Páginas básicas | Todos | ✅ |

## Detalhe técnico

Rotas, slugs, arquivos, nomes antigos e o sistema de cada tela ficam em [[Telas-por-Raia-Detalhe-Tecnico]].
