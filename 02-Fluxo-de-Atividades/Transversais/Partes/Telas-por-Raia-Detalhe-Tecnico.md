---
tags: [fluxo, telas, rotas, raias, referencia, parte]
criado: 2026-11-12
estado-em: 2026-11-12
status: vigente
dono: Nathan
parte-de: "[[Telas-por-Raia]]"
fontes: [Telas-por-Raia (Detalhe técnico movido em 12/11/2026 para a nota ficar abaixo de 25 KB), app-pcp 1fca8d3, HUB b55ac55, av-hub develop d82d58b em 12/11 (Compras · Divergências e avisos do MES)]
develop-conferida: [av-hub d82d58b, em 2026-11-12, só as linhas C8 e C1 de Compras; av-hub 44bb770, app-pcp 4c11886, em 2026-11-10]
---

# Telas por raia: detalhe técnico

**Em uma frase:** rotas, slugs, arquivos, nomes antigos e o sistema de cada tela do fluxo, setor por setor.

**Onde estamos:** ← [[Telas-por-Raia]] (o resumo por setor)

Fontes: `app-pcp` `1fca8d3` (`app/(protected)/**/page.tsx` e títulos dos `PageHeader`), HUB `b55ac55` (`app/(protected)`, `components`), v1 Fluxograma-Telas-por-Bloco, [[00-Fluxo-Mestre-0b]] e [[Regras-do-Vault]]. As colunas "Slug" são os identificadores de `telaId` ou de permissão. Nó, nome antigo e sistema vêm das tabelas por setor da versão anterior desta nota.

Os nomes novos já estão nos **títulos** do `app-pcp` (`9bb47e4`, #39: só rótulos). **Rotas, slugs, pastas e permissões seguem com os nomes antigos.** O texto do menu vem da tabela `telas` do banco, não do código ❓. A convenção de nomes está em [[Regras-do-Vault]]. Cabe ao Nathan decidir se rotas e slugs acompanham os títulos; isso altera `auth.telas` no av-hub e `telas` no MES, fora do repositório.

**Sistemas:** **HUB** é o front do av-hub (`b55ac55`, conferido em disco). **app-pcp** é o front do MES. As rotas do HUB passam pelo BFF (`app/api/...`).

### Vendas

| Nó | Nome atual | Nome antigo | Sistema | Rota | Slug | Arquivo ou observação |
|---|---|---|---|---|---|---|
| V2, V3 | Liberar Pedidos | Caixa de entrada do vendedor (1.1) | HUB | `/vendas/liberar-pedidos` | `liberar-pedidos` | `av-hub` `app/(protected)/vendas/liberar-pedidos/page.tsx:6` (`Portal do Vendedor`) |
| V2 (leitura) | Liberação da Equipe | Visão do gerente da 1.1 | HUB | `/liberacao-equipe` | `liberacao-equipe` | `av-hub` `components/Layout/AppLayout/Menu/MenuItem/groupMap.ts:25` (`'liberacao-equipe': 'Portal do Gerente'`) |
| V1 a O2 | Meus Pedidos, detalhe com o cartão "Andamento na produção" | Meus Pedidos por etapa (1.2) | HUB | `/meus-pedidos`, `/meus-pedidos/pedido/[codigoEmpresa]/[pedidoVenda]` | `meus-pedidos` | Cartão `components/Pedidos/EtapaDosItens.tsx:61` (`<h2>Andamento na produção</h2>`; o arquivo guarda o nome antigo "Etapa dos itens"), usado em `components/Pedidos/PedidoDetalhe.tsx:93` (`<EtapaDosItens`) |
| idem | Pedidos da Equipe, detalhe | idem | HUB | `/pedidos-equipe`, `/pedidos-equipe/pedido/...` | `pedidos-equipe` | Mesmo cartão |
| — | Pedidos do PCP | Portal PCP | HUB | `/pcp-pedidos`, `/pcp-pedidos/pedido/...` | `pcp-pedidos` | Não é o `app-pcp` |
| V0.1 a V0.7 | Propostas (lista, nova, detalhe) | — | HUB | `/vendas/propostas`, `/vendas/propostas/nova`, `/vendas/propostas/[id]` | `propostas` | BFF `app/api/comercial/[...rota]/route.ts`; lê e grava na `api-acos-vital` (`/comercial/propostas`) |
| — | Acompanhamento de Clientes | Clientes | HUB | `/vendas/acompanhamento-clientes` (e ficha `cliente/...`, `grupo/[id]`) | `acompanhamento-clientes` | N16-112 |
| — | Relatório Gerencial, Meu Dashboard, Minhas Notas | — | HUB | `/vendas/relatorio-gerencial`, `/vendas/meu-dashboard`, `/vendas/minhas-notas` | ❓ |  |

### PCP

| Nó | Nome atual | Nome antigo | Sistema | Rota | Slug | Arquivo ou observação |
|---|---|---|---|---|---|---|
| P1 | Triagem dos Pedidos | Carteira (de Pedidos) | app-pcp | `/carteira` | `carteira` ❓ | Título em `carteira/page.tsx:178`; lê `GET /pedidos/carteira` |
| P2 | Destinação do Pedido | Nova Ordem de Produção | app-pcp | `/ordens-producao/novo` | `ordens-producao` | Título em `ordens-producao/novo/page.tsx:517`; `POST /pedidos/completo/lote` |
| — | Acompanhamento dos Pedidos | Ordens de Produção (lista) | app-pcp | `/ordens-producao` | `ordens-producao` | Título em `ordens-producao/page.tsx:144` |
| — | Acompanhamento dos Pedidos, detalhe | Ordem de Produção (detalhe) | app-pcp | `/ordens-producao/[id]` | `ordens-producao` | Mini-roteiro, histórico, anexos, embalagens; 🟡 falta mostrar o split atendido pelo estoque e a reserva |
| — | Pedidos excluídos | — | app-pcp | `/pedidos-excluidos` | ❓ | Snapshot de pedido excluído |
| P6 | Novo norte (retrabalho ou reabrir compra) | Fila "Novo norte" (2.5) | app-pcp | — | — | 🔴 Sem tela; `/decisoes-pcp` só trata recebimento |
| P1, P2 | OC do pedido (coluna ou cartão na Triagem e na Destinação) | — | app-pcp | `/carteira`, `/ordens-producao/novo` | — | 🔴 N14-20, BL-049 |
| P2 | Montagem do Roteiro | — | app-pcp | `/montagem-roteiro`, `/montagem-roteiro/[id]` | `montagem-roteiro` | Só na develop (22/10); `GET /pedidos/roteiros`, `PUT /pedidos/:id/roteiro` |
| — | Produtos em Produção | — | app-pcp | `/produtos-em-producao` | `produtos-em-producao` | Só na develop (20/10); `GET /pedidos/produtos-em-producao` |
| P2 | Ordem de Produção (entidade e documento imprimível, só do que será fabricado) | — | app-pcp | `/ordens-producao/[id]` (botão "Imprimir OP") | `ordens-producao` | ✅ só na develop (27/10, `ab3318d`, BL-052); `GET /pedidos/:id/op` |

### Estoque

| Nó | Nome atual | Nome antigo | Sistema | Rota | Slug | Arquivo ou observação |
|---|---|---|---|---|---|---|
| E1 a E4 | Atendimento | Atendimento / Baixa (8.12) | app-pcp | `/estoque-operacao/atendimento` | `atendimento` | `AtenderEstoqueModal` (título `atendimento/page.tsx:10`) |
| E5 (consulta) | Saldo | Consulta de Saldo (8.4) | app-pcp | `/estoque-operacao/saldo` | ❓ | Título `saldo/page.tsx:73` |
| E3 | Reservas | Reservas (8.5) | app-pcp | `/estoque-operacao/reservas` | ❓ |  |
| E6 (parcial) | Movimentação e Ajuste | Movimentação (8.6) | app-pcp | `/estoque-operacao/movimentacao` | ❓ | O histórico mostra `ENTRADA`, `SAIDA`, `TRANSFERENCIA` e `AJUSTE`; à mão, só `TRANSFERENCIA` e `AJUSTE` (`app-pcp` `app/(protected)/estoque-operacao/movimentacao/page.tsx:229` `Transferência entre localizações`, `:230` `Ajuste de saldo`) |
| E5 | Detalhe do lote | Detalhe do lote (8.7) | app-pcp | `/estoque-operacao/lotes/[id]` | ❓ | Movimentos, etiqueta Code128 |
| — | Painel do Estoque | Dashboard do Estoque | app-pcp | `/estoque-operacao/painel-estoque` | `painel-estoque` | Protótipo com dados de exemplo; alertas reais |
| — | Mapa do Depósito | — | app-pcp | `/estoque-operacao/mapa-deposito` | ❓ | Sobre `MOCK_DEPOSITOS` |
| — | Materiais, Depósitos | Cadastro de material, Depósitos (8.1, 8.2) | app-pcp | `/cadastros/estoque/materiais`, `/cadastros/estoque/depositos` | ❓ | API real |
| E6 | Documento de retirada | — | app-pcp | — | — | 🔴 |
| E1 | Saldo futuro (no Atendimento e no Saldo: saldo atual + OCs em andamento de estoque) | — | app-pcp | `/estoque-operacao/atendimento`, `/estoque-operacao/saldo` | — | 🔴 N14-20, BL-050 |

### Compras e fornecedor

| Nó | Nome atual | Nome antigo | Sistema | Rota | Slug | Arquivo ou observação |
|---|---|---|---|---|---|---|
| P3 | Requisições de compras | Setor Compras (2.4), fila `requisicoes` | app-pcp | `/compras/requisicoes` | `requisicoes` | `RequisitarCompraModal` ("Solicitar compra" do Estoque cai aqui); título `requisicoes/page.tsx:10` |
| C5 | Compras · CCP | Pedidos de Compra / Compras | app-pcp | `/compras/pedidos-compra` (e `/compras`) | `pedidos-compra` | Só leitura; título `pedidos-compra/page.tsx:11`; linha do tempo por material, `EventosRequisicaoModal` |
| C0, C1 | Requisições (caixa do Compras), "Nova requisição" | Caixa de entrada de Requisições (3.1) | HUB | `/compras/requisicoes`, `/compras/requisicoes/kanban` | ❓ | `components/Compras/ComprasRequisicoes.tsx:188`, `:426` |
| C4 | Nova Ordem de Compra | Emissão da OC (3.2) | HUB | `/compras/nova`, `/compras/nova/[requisicaoId]` | ❓ |  |
| C4 | Ordens de Compra | Ordens de Compra (3.3) | HUB | `/compras/ordens`, `/compras/ordens/kanban`, `/compras/ordem/[id]`, `/compras/pedido-omie/[id]` | ❓ |  |
| C2, C3 | Aprovações | Fila de Aprovações (3.4) | HUB | `/compras/aprovacoes` | ❓ | Aprova só OC acima de R$ 30 mil (Gerência de Compras); sem Diretoria (N14-21) |
| C5 | Follow-up | Follow-up do CCP (3.6) | HUB | `/compras/followup` | ❓ |  |
| — | Dashboard de Compras | (3.5) | HUB | `/compras/dashboard-compras` | ❓ |  |
| — | Compradores | — | HUB | `/compras/compradores` | ❓ | Cadastro usado pela OC (LOG-18, LOG-28, LOG-36) |
| C8 | Compras · Divergências | — | HUB | `/compras/divergencias` | `compras-divergencias` | Compra acima do cotado na proposta (LOG-57); a tela entra no menu quando estiver cadastrada nas telas da API: `app/(protected)/compras/divergencias/page.tsx:5` (`C8 (LOG-57): a tela`) |
| C1 | Avisos do MES | — | HUB | no detalhe da OC e em `/compras/requisicoes`; a recompra abre `/compras/nova?aviso={id}` | `compras` | Recompra por RNC e recebimento reaberto (LOG-58): `components/Compras/OrdemDetalhe.tsx:216` (`<AvisosMesDaOrdem idOrdem={ordem.id} />`) e `components/Compras/ComprasRequisicoes.tsx:167` (`<AvisosMesPainel`) |
| FN1 | — | — | — | — | — | — |

### Recebimento

| Nó | Nome atual | Nome antigo | Sistema | Rota | Slug | Arquivo ou observação |
|---|---|---|---|---|---|---|
| R0 a R4 | Recebimento | Logística de entrada | app-pcp | `/logistica/logistica-entrada` | `logistica-entrada` | Título `logistica-entrada/page.tsx:10`; esperados, "Receber com NF" (`ReceberComNfModal`), conferência (`ConferirRecebimentoModal`), recontagem (`RecontarRecebimentoModal`) |
| R6 | Divergências de Recebimento | Decisões do PCP | app-pcp | `/decisoes-pcp` | `decisoes-pcp` | Título `decisoes-pcp/page.tsx:74`; `ACEITO` ou `REABERTO` |
| R4 | Detalhe do lote, "Imprimir etiqueta" | (6.5) | app-pcp | `/estoque-operacao/lotes/[id]` | ❓ |  |
| — | Logística (índice) | — | app-pcp | `/logistica` | ❓ |  |

### Qualidade de entrada

| Nó | Nome atual | Nome antigo | Sistema | Rota | Slug | Arquivo ou observação |
|---|---|---|---|---|---|---|
| Q1 a Q4 | Inspeção de entrada | Qualidade (mock) | app-pcp | `/qualidade/inspecao-entrada` | `inspecao-entrada` | Título `inspecao-entrada/page.tsx:117` |
| — | Fila Qualidade · Entrada | — | app-pcp | `/movimentacoes/[setorId]` (setor `qualidade-entrada`) | `movimentacoes` | Só leitura (`acoes.ts:98-100`) |

### Produção

| Nó | Nome atual | Nome antigo | Sistema | Rota | Slug | Arquivo ou observação |
|---|---|---|---|---|---|---|
| F1 | Filas de Produção (setores) | Movimentações | app-pcp | `/movimentacoes` | `movimentacoes` | Título `movimentacoes/page.tsx:121` |
| F1 | Fila do setor | Board do setor (7.1) | app-pcp | `/movimentacoes/[setorId]` | `movimentacoes` | `FilaSetor.tsx`, 17 ações |
| — | Dashboard | Dashboard de produção (7.3) | app-pcp | `/dashboard` | ❓ |  |
| — | Painel TV | (7.4) | app-pcp | — | — | 🔴 Backend `GET /dashboard/tv` sem página |
| — | Fábricas, Setores, Máquinas, Operadores | Cadastros operacionais | app-pcp | `/cadastros/operacional/fabricas`, `setores`, `maquinas`, `operadores` | ❓ |  |
| — | Relatórios | — | app-pcp | `/relatorios` | ❓ |  |

### Qualidade de saída

| Nó | Nome atual | Nome antigo | Sistema | Rota | Slug | Arquivo ou observação |
|---|---|---|---|---|---|---|
| Q7, Q8 | Inspeção de saída | Fila do setor Qualidade no roteiro | app-pcp | `/qualidade/inspecao-saida` | `inspecao-saida` | `inspecao-saida/page.tsx:1-18` |
| Q7 | Qualidade (índice) | — | app-pcp | `/qualidade` | ❓ |  |

### Expedição

| Nó | Nome atual | Nome antigo | Sistema | Rota | Slug | Arquivo ou observação |
|---|---|---|---|---|---|---|
| X1, X4 | Expedição | Embalagem e Logística de saída | app-pcp | `/logistica/expedicao` | `expedicao` | `expedicao/page.tsx:1-16`; pallets (`PalletsModal`), `ConfirmarEntregaModal` |
| X1 | Seção Embalagens do pedido | — | app-pcp | `/ordens-producao/[id]` | `ordens-producao` | `EmbalagensSection.tsx` |
| X3 | Consolidação de carga | — | app-pcp | — | — | 🔴 |
| X4 | Transporte e roteiro | — | app-pcp | — | — | 🔴 |

### Fiscal

| Nó | Nome atual | Nome antigo | Sistema | Rota | Slug | Arquivo ou observação |
|---|---|---|---|---|---|---|
| O1 | Fila de sinalização de faturamento | — | app-pcp | — | — | 🔴 |
| O2 | Notas Fiscais de Saída | — | HUB | `/vendas/notas-fiscais-saida` | ❓ | Título `app/(protected)/vendas/notas-fiscais-saida/page.tsx:98` (`PageHeader`) |
| O2 | Minhas Notas, Notas da Equipe, Notas do PCP | — | HUB | `/vendas/minhas-notas`, `/notas-equipe`, `/pcp-notas` | ❓ | Pós-fato |

### Telas que servem a todos

| Nome atual | Nome antigo | Sistema | Rota | Observação |
|---|---|---|---|---|
| Login (Azure AD e usuário e senha) | T.1 | app-pcp | `/login` | `(public)/login/page.tsx` |
| Cadastros › Acessos: Usuários, Perfis, Permissões, Telas, Usuários por Perfil, Setores por Perfil, Depósitos por Perfil | T.2 | app-pcp | `/cadastros/acessos/usuarios`, `perfis`, `permissoes`, `telas`, `usuarios-perfis`, `setores-perfil`, `depositos-perfil` | `PerfilSetor` sem filial 🔴 |
| Torre de Fluxo (mapa, ranking, tempo por etapa, item) | T.3 a T.6 | HUB | `/torre-fluxo`, `/torre-fluxo/ranking`, `/torre-fluxo/tempo`, `/torre-fluxo/item/[id]` | Telas e BFF `/api/fluxo` sobre dados de exemplo (BL-022, `3cd55de`, 15/10); registro de 14/10 (superado): nenhuma ocorrência de "torre" no HUB |
| Inicial, Blank | — | app-pcp | `/`, `/blank` |  |

### Nomes novos que ainda não chegaram ao código

| Nome novo (título e vault) | Ainda no código |
|---|---|
| Triagem dos Pedidos | Pasta e rota `carteira`; `GET /pedidos/carteira`; `services/carteira.ts` |
| Destinação do Pedido | Rota `/ordens-producao/novo`; campo `ordemProducao`; códigos `OP-` |
| Acompanhamento dos Pedidos | Rota `/ordens-producao`; permissão `ordens-producao` |
| Filas de Produção | Rota `/movimentacoes`; permissão `movimentacoes` (também protege Entrega, Divergência e Recebimento) |
| Divergências de Recebimento | Rota e slug `decisoes-pcp` |
| Compras · CCP | Rota `/compras/pedidos-compra`; slug `pedidos-compra` |
