---
id: LOG-56
titulo: "Transformar proposta em pedido: as respostas que faltam e as pontas soltas da tela"
tags: [contrato, proposta, pedido-de-venda, omie, liberacao, refaturamento]
criado: 2026-11-09
estado-em: 2026-11-12
status: parcial
dono: Nathan
autor: Robert
data: 2026-11-09
versao: 8
camadas: [frontend, backend, api, sql]
donos: {frontend: Robert, backend: Gustavo, api: Gustavo, sql: Gustavo}
nos_0b: [V0.6, V0.7, V1, V2]
notas_afetadas: [01-Proposta-de-Venda, 03-Pedido-de-Venda-e-Liberacao, Mapa-IncluirPedido-Omie, Roteiro-da-Proposta-em-Diante, AV-Hub-Front, AV-Hub-API, MES-Backend, Backlog-Frente-Robert, Backlog-Frente-Comercial-e-Suprimentos, Riscos, Pontas-Soltas, Onde-Estamos, Banco-AvHub]
depende_de: [BL-071, BL-062]
decisoes: [N16-150, N16-152, N16-89, N16-05, N16-29, N16-90, N16-149, N16-79, N16-98, N16-154]
develop-conferida: [api-acos-vital cc3fbb3, av-hub 6fcbba6, em 2026-11-11]
fontes: ["PDF de Robert de 09/11/2026 (contrato v8, 20 páginas, substitui a v7 de 09/11)", "PDF de Robert de 09/11/2026 (adendo v4, refaturamento da HRM 1.01.98)", "Q&A de 09/11/2026 Nathan → Robert, rodada 1, consolidado pelo Nathan (fora do vault: ../Perguntas-e-Respostas/QA-2026-11-09_Nathan-para-Robert_contrato-transformar-v7.md)", "Dump do Avhub de 04/11/2026 (04-Dados/Dumps/avhub-tst-esqueleto-2026-11-04.sql)", "PDF de Gustavo de 10/11/2026 (entrega LOG-56, banco e API)"]
---

# LOG-56 · Transformar proposta em pedido: as respostas que faltam e as pontas soltas da tela

**Em uma frase:** o modal de "Gerar pedido no Omie" já pergunta quatro das seis respostas da N16-150 e o pedido já chega ao Omie; faltam a Qualidade e o faturamento em partes (R1, R2), e o Omie ainda recusa o pedido por `codigo_conta_corrente`, que não existe em ponto nenhum do caminho de escrita.

## Situação em 09/11

- **Status:** `parcial` (10/11). A parte do Gustavo (passos 1 a 10 da §14) está na `develop` (api-acos-vital `e9878b7` e `c353135`) e no banco de teste; falta a do Robert (7d, 11 a 14) e a produção (migration log56, o INSERT da conta padrão e a API, nessa ordem). Conta padrão no teste: "01 - Boleto/Pix/TED" nas três unidades (Robert, 10/11).
- **Versão registrada:** a v8 do Robert, que aplica o Q&A de 09/11 (rodada 1, consolidada pelo Nathan). Conferida pelo Nathan contra a `develop` (api-acos-vital `655896a`, av-hub `6fcbba6`) e o dump de 04/11: sem divergência.
- **Continuam abertas, sem bloquear o começo:**
  - **Gustavo:** ✅ respondidas no Q&A de 09/11: o join é por `codigo_empresa_omie` + `codigo_pedido_omie`, na view; o `obs_venda` vem de `pedidos_venda.observacoes`, cópia da proposta (o risco da §7.7 está confirmado); as migrations ficam com o DBA, fora do repositório, por decisão (N16-155).
  - **Qualidade (o Nathan leva):** refaturamento passa por processo de qualidade? Escolhe entre a saída 1 e a 3 da §7.7.
  - **Medição do alcance do G6** nas três unidades (§7.7, PS-040): SQL pronto, só leitura, fora do vault em `../Perguntas-e-Respostas/medicao-V3_refaturamento-liberacao.sql`. ✅ Rodada pelo Nathan em 09/11/2026, no banco de teste: o G6 tira 142 de 2.028 pedidos, 98 deles pela porta da observação (números em [[Pontas-Soltas]], PS-040).

**Partes deste contrato:**
- [[LOG-56-Transformar-Proposta-em-Pedido-Detalhe-1]]: §6 Frontend e §7 Backend (decisões de 09/11, valor inicial na Liberar Pedidos, refaturamento).
- [[LOG-56-Transformar-Proposta-em-Pedido-Detalhe-2]]: §8 API a §17 (banco, permissões, aceite, testes, ordem, riscos, impacto no vault, regras).
- [[LOG-56-Transformar-Proposta-em-Pedido-Adendo-v4]]: o adendo do Robert sobre o refaturamento da HRM (`1.01.98`).

## O que mudou da v7 para a v8

A v8 aplica o Q&A de 09/11. Seis pontos entraram, e os dois primeiros corrigem erro de fato da v7:

| # | O que muda | Onde |
|---|---|---|
| 1 | **A rota estava trocada.** A v7 pôs os campos sugeridos e o `faturar_em_partes` em `/pedidos_liberados`, que é a rota do MES. A rota da tela é `/pedidos_liberacao`; `/pedidos_liberados` não devolve pedido pendente nem tem PUT. | §7.5, §7.6, §8, §14 |
| 2 | **O alcance do refaturamento era maior.** O G6 que vale para a Liberar Pedidos vem da `vw_vendas_planilha`, não da `vw_faturamento_planilha`, e lá a regra tem duas portas: a categoria e a observação. Pela observação, o efeito atinge as três unidades hoje. | §7.7, §15, §16 |
| 3 | A §7.3 perdeu o parágrafo "O que isso simplifica", que afirmava duas coisas falsas. | §7.3 |
| 4 | O R11 passou a trazer a decisão de 09/11 e deixou de ser 🔴. | §5 |
| 5 | O passo da liberação ganhou a quarta camada: o BFF, que monta o corpo do PUT à mão e descartaria o campo novo em silêncio. | §6.1, §14 |
| 6 | Metadado: o bloco do fim diz `versao: 8`, a §6 foi renumerada (a antiga 6.7 virou 6.6) e o adendo é o v4, com o mesmo número no arquivo e no texto. | §6 |

Duas decisões do Nathan de 09/11 fecharam perguntas da v7: a configuração padrão da conta corrente é SQL do Gustavo, sem tela (a antiga §7.9 virou §7.8), e a N16-152 é a saída (b): o refaturamento passa a ser decidido pela tabela `refaturamentos`, e a observação deixa de contar.

## 1. Resumo em linguagem simples

Quando o vendedor aprova uma proposta e aperta "Gerar pedido no Omie", o sistema hoje pergunta previsão de faturamento, número do pedido do cliente, observação para a nota, se o pedido nasce bloqueado, o tipo da venda e a categoria. A N16-150 diz que são seis respostas, e duas ainda não existem: se a Qualidade acompanha o pedido e se ele pode ser faturado em partes. São as que mudam o que o PCP e a Qualidade fazem depois.

O pedido já chega ao Omie (novo desde a v4). Ele é recusado lá por um campo que ninguém preenche: a conta corrente onde nasce o título a receber. Não é esquecimento da tela: o campo não existe em ponto nenhum do caminho, do formulário até o payload.

## 2. Contexto: o que deve ser feito e por quê

- **O problema.** Quando o pedido chega ao PCP, ninguém sabe se a Qualidade acompanha, e é essa marcação que define se o pedido passa pelos processos de qualidade desde o início (N16-05). Hoje a resposta só existe na tela Liberar Pedidos, preenchida depois, à mão, pedido a pedido. A mesma lacuna vale para "pode faturar em partes".
- **Quem sofre.** O PCP e a Qualidade, que recebem o pedido sem a informação; e o vendedor, que responde duas vezes a mesma pergunta.
- **De onde vem.** N16-150 (05/11/2026), que completa N16-05, N16-89, N16-130 e N16-149 e registra o que falta: "a resposta da Qualidade, o faturamento em partes, a data por item, e tornar obrigatórios o tipo da venda e a categoria". Os dois últimos já estão feitos.
- **Se não for feito.** O pedido continua nascendo incompleto para quem produz; e, enquanto a conta corrente não existir no caminho, nenhum pedido é criado no Omie.

## 3. Onde fica no fluxo

Nós: V0.6 (aprovar), V0.7 (transformar), V1 (pedido de venda) e V2 (acompanhamento da Qualidade).

Notas afetadas: [[01-Proposta-de-Venda]] (e a parte 1), [[03-Pedido-de-Venda-e-Liberacao]] (e a parte 2), [[Mapa-IncluirPedido-Omie]] (parte 2: §5.3, §5.3.1, linhas 98-99 e a pergunta 4), [[Roteiro-da-Proposta-em-Diante]], [[AV-Hub-Front]], [[AV-Hub-API]], [[MES-Backend]], [[Backlog-Frente-Robert]], [[Backlog-Frente-Comercial-e-Suprimentos]], [[Riscos]], [[Pontas-Soltas]], [[Onde-Estamos]] e [[Banco-AvHub]].

## 4. Como está hoje, na develop

Base: av-hub `6fcbba6` e api-acos-vital `655896a`. Cada âncora usa o trecho que distingue esta versão da anterior, não o começo que as duas compartilham (§17, regra 2).

### 4.1 O que já funciona

| Camada | O quê | Âncora |
|---|---|---|
| API | ✅ `POST /comercial/propostas/{id}/transformar` valida, chama `fn_proposta_transformar` e envia ao Omie na mesma requisição | `api-acos-vital` `propostas.route.js:603` (`"/propostas/:id/transformar"`), `:611` (`fn_proposta_transformar`) |
| API + Front | ✅ R5 completo e provado no Omie de teste: a observação da nota chega ao Omie | `propostas.route.js:598` (`z.string().trim().max(5000)`); `av-hub` `TransformarModal.tsx:276` (`dados_adicionais_nf: paraPipe(observacao)`) |
| Front | ✅ R9 corrigido: o front manda `bloqueado`, o nome que a API declara | `TransformarModal.tsx:141` (`const [bloqueado, setBloqueado]`), `:277` (`bloqueado,`) |
| Front | ✅ R4: tipo da venda obrigatório | `TransformarModal.tsx:143` (`const [tipoVenda, setTipoVenda]`), `:278` (`numero_contrato: tipoVenda`) |
| Front | ✅ R3: categoria obrigatória, sem pré-seleção | `TransformarModal.tsx:147` (`const [codigoCategoria, setCodigoCategoria]`), `:251` (`SEM pré-seleção (Nathan, 09/11)`), `:279` (`codigo_categoria: codigoCategoria`) |
| Front | ✅ Aviso de refaturamento só pela descrição; alcança as três contas, que usam três códigos diferentes | `TransformarModal.tsx:88` (`/refat\|reaft/i.test(c.descricao)`) |
| Front | ✅ A condição do Omie, causa da primeira recusa: campo próprio na aba de condições, lista por unidade | `AbaCondicoes.tsx:118` (`proposta-condicao-omie`), `comercial-propostas.ts:254` (`codigo_condicao_pagamento: string`), `propostas.ts:738` (`buscarCondicoesOmie`) |
| Front | ✅ "Tentar novamente" no card, para o pedido que ficou em erro | `AndamentoProposta.tsx:87` (`status_sincronizacao_omie === 'erro'`), `propostas.ts:357` (`reenviarPedidoAoOmie`) |
| Front | ✅ Busca de produto por unidade, por rota própria; a genérica continua servindo Catálogo, OC e Suprimentos | `route.ts:105` (`'/produtos-da-proposta'`), `propostas.ts:677` (`buscarProdutosDaProposta`), `:652` (`buscarProdutos(q: string, signal?: AbortSignal)`) |
| Front | ✅ Categoria por rota própria, sem roubar o `/categorias` de Suprimentos (§6.4) | `route.ts:51` (`'/categorias-da-proposta'`), `:135` (`destino: '/orcamento/categorias'`) |
| Backend | ✅ Trava do envio e saída única: erro que não é do Omie vira 500 `ENVIO_FALHOU_NA_API`, com o pedido em erro e a trava solta | `pedidoOmie.js:128` (`fn_pedido_venda_envio_iniciar`), `:234` (`ENVIO_FALHOU_NA_API`); `TransformarModal.tsx:44` |
| SQL | ✅ A liberação existe inteira (Contrato 26): coluna, trava depois do `importado_mes_em` e histórico completo (`liberado` / `alterado` / `importado_mes`) | dump de 04/11: `fn_pedidos_vendas_liberacao_regras`, `fn_pedidos_vendas_liberacao_historico` |
| API | ✅ Novo na v8: as duas rotas da liberação existem lado a lado e fazem coisas diferentes. `/pedidos_liberacao` é a da tela (`GET /` e `PUT /:codigo_empresa/:numero_pedido`); `/pedidos_liberados` é a do MES (`GET /`, `GET /:numero/itens`, `POST /:numero/importado`) | `core_vendas_faturamento/index.js:193-194` (`{ path: "/pedidos_liberacao" }`, `{ path: "/pedidos_liberados" }`); `pedidos_liberacao.route.js:89` (`router.get("/"`), `:165` (`router.put("/:codigo_empresa/:numero_pedido"`); `pedidos_liberados.route.js:57, 115, 143` |

### 4.2 O que ainda falta

| Camada | O quê | Âncora / evidência |
|---|---|---|
| Omie | 🟡 O pedido leva `informacoes_adicionais.codigo_conta_corrente` com a conta padrão da conta Omie (`parametros_pedido_venda_omie`); falta provar no Omie de teste (BL-081) | Teste de 09/11, pedido `PV-000002` (o Omie recusou sem a conta). Hoje: `pedidoOmie.js:73,152` (`e9878b7`); migration log56 `:408` |
| Front + API | 🟡 API ✅ o `esquemaEnvioOmie` aceita R1 e R2 (obrigatórios no `/transformar`); Front 🔴 o modal ainda não pergunta (passo 11, Robert) | `TransformarModal.tsx:141-147`; `propostas.route.js:604` (`qualidade_acompanha: previsaoObrigatoria`), `:607` (`e9878b7`) |
| Front (BFF) | 🔴 Novo na v8: o BFF da liberação monta o corpo do PUT à mão e valida só a Qualidade; campo novo que a API venha a aceitar morre aqui, sem erro | `app/api/liberar-pedidos/[codigoEmpresa]/[numeroPedido]/route.ts:27-29` (`typeof acompanha !== 'boolean'`), `:51` (`body: JSON.stringify({ acompanhamento_qualidade: acompanha, updated_by: idUsuario })`) |
| API | ✅ `GET /comercial/propostas/{id}/prontidao-omie` existe, com os 5 códigos; o BFF ainda falta (passo 12, Robert) | `propostas.route.js:646` (`e9878b7`); migration log56 `:635`; `propostas.ts:377` (`getProntidaoPedido`), que devolve `null` em 404 |
| Permissão | ✅ `GET /compras/condicoes-pagamento` tem linha para a tela `propostas` desde a migration de 05/11 (teste; produção pendente) | `app/api/comercial/condicoes-pagamento/route.ts`; migration `2026-11-05_condicoes_pagamento_encargos.sql:84` |
| SQL | ✅ Aplicadas no teste (dump de 10/11; o índice único `uq_pedidos_venda_omie`, em `(codigo_empresa_omie, codigo_pedido_omie)`, no dump de 12/11, que tirou o `ix_pedidos_venda_omie` parcial, [[Dump-AvHub-Teste-2026-11-12]]); ficam com o DBA, fora do repositório (N16-155); produção pendente | §9; Q&A de 09/11 (P4) |

✅ **Saíram desta lista em 11/11 (N16-154):** a empresa emissora passou a ser a própria unidade e `core_comercial.unidades_emissoras` saiu (migration `2026-11-10_comercial_emissora_vira_unidade`). `GET /comercial/empresas_emissoras` continua na API do Hub e já devolve `id_unidade_conta_omie`, igual ao `id_unidade` (`api-acos-vital` `cc3fbb3`, `cadastros.route.js:103`, `id_unidade_conta_omie: e.id,`). Com isso o modal, que usa o `id_unidade`, fica certo também na HRM, e a pendência de dado da N16-98 (HRM na conta de Mogi) deixa de existir. ✅ A migration está aplicada no teste: no dump de 12/11 a tabela e a coluna `id_unidade_emissora` saíram, e o cabeçalho do documento vem de `core.vw_unidades_cabecalho` ([[Dump-AvHub-Teste-2026-11-12]]). Falta aplicá-la na produção.

## 5. Regras de negócio

| # | Regra | Estado |
|---|---|---|
| R1 | O vendedor responde "a Qualidade acompanha o pedido por todos os processos?", sim ou não. Obrigatório, sem padrão. | 🔴 a fazer |
| R2 | O vendedor responde "o pedido pode faturar em partes ou só quando tudo estiver pronto?". Obrigatório, sem padrão. A resposta fica no Hub até o contrato do MES (§6.7). | 🔴 a fazer · opção 2 decidida em 09/11 |
| R3 | Categoria obrigatória, da conta Omie do pedido, sem pré-seleção. | ✅ feito |
| R4 | Tipo da venda (`SPOT` / `CONTRATO`) obrigatório. | ✅ feito |
| R5 | A observação para a nota vai em `informacoes_adicionais.dados_adicionais_nf`, até 5000. | ✅ feito e testado no Omie |
| R6 | Nada da tela vai para `observacoes.obs_venda`. O payload do Omie tem esse campo e ele é montado no banco: de onde ele sai é pergunta aberta da §7.7. | ✅ mantido na tela · ❓ no banco |
| R7 | A Qualidade é gravada só em `core_comercial.pedidos_venda`. O `/transformar` não cria linha em `pedidos_vendas_liberacao`: a Liberar Pedidos usa a resposta como valor inicial e a liberação continua sendo ato do vendedor. | 🔴 a fazer · decidido em 09/11 · §7.3 |
| R8 | Produto só da unidade da proposta, pelo select. | ✅ feito |
| R9 | O front manda `bloqueado` com o nome certo. | ✅ feito |
| R10 | O `faturar_em_partes` percorre as duas primeiras pernas do caminho do Contrato 26; as três do MES são contrato próprio. | 🔴 a fazer · §6.7 |
| R11 | O pedido leva `codigo_conta_corrente` ao Omie. **Decidido em 09/11: conta padrão por conta Omie, configurada uma vez, invisível para o vendedor (§7.4).** Sem configuração da unidade, a prontidão devolve `UNIDADE_SEM_CONFIG` e o pedido não é enviado. | 📝 decidido, sem código · §7.4 |

Fora deste contrato, confirmado pelo Nathan em 09/11: a data por item da N16-150 vira contrato próprio.

**Continua em:** [[LOG-56-Transformar-Proposta-em-Pedido-Detalhe-1]] (§6 e §7) e [[LOG-56-Transformar-Proposta-em-Pedido-Detalhe-2]] (§8 a §17).
