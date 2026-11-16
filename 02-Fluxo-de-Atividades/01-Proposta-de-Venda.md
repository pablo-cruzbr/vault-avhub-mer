---
tags: [fluxo, raia, vendas, proposta, v0, simulador, tela]
criado: 2026-10-16
estado-em: 2026-11-16
status: proposta
ordem: 1
nos: [V0.1, V0.2, V0.3, V0.4, V0.5, V0.6, V0.7, V0C]
anterior: "[[00-Fluxo-Mestre-0b]]"
proxima: "[[02-Orcamento-Base-de-Preco]]"
develop-conferida: [av-hub f63b01b, api-acos-vital 96316f4, em 2026-11-16, citações e N16-166; api-acos-vital e522962, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13, reteste por cliques e Da proposta à comissão; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13; av-hub c6310ad, em 2026-11-13, o teste da proposta no Docker; api-acos-vital bebca52, av-hub d82d58b, em 2026-11-12, a seção O que já existe e o que falta; api-acos-vital bebca52, em 2026-11-12, só o número, a emissão e a carteira; api-acos-vital cc3fbb3, av-hub 44bb770, em 2026-11-10; api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Nathan (regra) · Robert (rotas e telas de proposta) · Pablo (acompanha) · Gustavo (banco) · Compras (C6, C7, C8)
fontes: ["av-hub develop d82d58b de 12/11/2026 (PRs #278, #279, #282, #283, #286, #288 e #291)", "Relatórios de entrega de Gustavo de 12/11/2026 (emissora vira unidade e número sem CO-; empresa, responsável e carteira de clientes)", nota 11-Proposta-e-Pedido-de-Venda da v2 (tag v2-antes-da-v3), sem C6–C8, V1–V3 e B2–B4, que foram para 06, 03 e 02 em 05/11/2026, Registro-de-Decisoes (N16-01 a N16-144), api-acos-vital develop cc30c85 e 0384e89 de 29/10/2026 (core_comercial/aggregates/propostas/propostas.route.js, clientes, cadastros, parceiros), Dump Avhub 29/10/2026 (fn_proposta_criar, core_comercial.propostas), av-hub develop 758d5f0 (app/api/comercial/[...rota]/route.ts, lib/domain/andamento-proposta.ts), Estudo-Omie-API, 09-Diagramas/fontes/tela-simulador-comissao.png, 09-Diagramas/fontes/email-divergencia-margem-pv27824.jpg e pv28204.jpg, av-hub comissoes/simulador/page.tsx, 00-Fluxo-Mestre-0b, 01-Vendas-Liberacao, 04-Circuito-de-Compra, Proposta-Orcamento-Comissao/08-Reuniao/Proposta-Orcamento-Pedido-Comissao.docx (fora do vault), 09-Diagramas/artifact-proposta-pedido.html, api-comercial 5aa5311 (propostas.routes.ts, propostas.service.ts, vendas.prisma, enums.prisma, custos.routes.ts, numeroProposta.ts), Dump Avhub 14/10, Dump-AvHub-Teste-2026-11-09 (09/11/2026), Dump-AvHub-Teste-2026-11-10 (fn_proposta_criar), av-hub develop 44bb770 (PR #277, commit 20e6089: TransformarModal.tsx, AndamentoProposta.tsx, app/api/comercial/[...rota]/route.ts), api-acos-vital develop cc3fbb3 (propostas.route.js, pedidoOmie.js, pedidos.route.js), validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault), PDF de Gustavo de 10/11/2026 (entrega LOG-56, banco e API)]
---

# Proposta de venda

**Em uma frase:** o vendedor monta a proposta, a Gerência aprova, e a proposta aprovada vira pedido de venda (PV) no Omie, já liberado para o PCP (planejamento e controle da produção) começar.

**Quando consultar:** dúvidas sobre a proposta: como o vendedor monta, quem aprova, o que a proposta guarda e como ela vira pedido no Omie.

**Onde estamos no fluxo:** ← [[00-Fluxo-Mestre-0b]] | [[02-Orcamento-Base-de-Preco]] → · nós desta nota: `V0.1`, `V0.2`, `V0.3`, `V0.4`, `V0.5`, `V0.6`, `V0.7`, `V0C`

Nesta etapa o vendedor também acompanha o pedido, aprova compras mais caras e pode cancelar. A nota é uma proposta: o fluxo foi aprovado em 26/10/2026.

## Como funciona, passo a passo

1. O vendedor cria a proposta. O sistema dá a ela um número automático como `AV2026-0011-R00`: sigla da unidade e ano, sequência de quatro dígitos e revisão (sem o `CO-` desde 10/11/2026, pedido do Robert). A decisão de guardar só dígitos no banco, com o prefixo só na tela e no PDF (N16-148), ainda não foi aplicada. `V0.1`
2. O vendedor preenche o custo com o que conseguiu, por telefone ou e-mail. Se não tem o dado, pede cotação ao Orçamento ou olha o histórico das ordens de compra (OC). `V0.2`
3. O sistema calcula margem e comissão estimada. Só o vendedor vê. Item de revenda sem custo e sem fornecedor deixa a proposta incompleta, e ela não pode ser aprovada; item de fabricação não tem custo (N16-166). `V0.3`
4. A Gerência aprova desconto e margem pessoalmente, fora do sistema, neste ciclo. `V0.4`
5. O vendedor marca "aprovada" no sistema. O sistema grava quem, quando e qual revisão, e a proposta trava. Se a proposta não segue, ela é cancelada e não reabre. `V0.5`, `V0C`
6. O vendedor clica em "Transformar em pedido de venda" e responde seis campos (N16-150): se a Qualidade acompanha o pedido por todos os processos (`Sim` ou `Não`); a previsão de faturamento, que é a data de entrega ao cliente; se a venda é `SPOT` (cliente sem contrato) ou `CONTRATO`; se o pedido fatura em partes ou só quando tudo estiver pronto; o número do pedido do cliente (opcional); e a categoria, escolhida numa lista com código e descrição. O modal envia as seis respostas e só gera o pedido com todas preenchidas, menos o número do pedido do cliente. Se fatura em partes, a data do pedido é a data final e cada item leva a sua data, igual ou anterior a ela. `V0.6`
7. O sistema coloca o pedido numa fila e a integração o cria no Omie. Se o Omie recusar, aparece o motivo e o botão "Tentar novamente". `V0.7`
8. O pedido nasce liberado e o PCP o vê na triagem (`V1` a `V3`): ver [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].
9. Compras confere a parte de compras e, se comprar acima do valor da proposta, o vendedor aprova ou reprova por produto: `C6`, `C7` e `C8` estão em [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].

## Exemplo

O Cliente Exemplo S.A. pede 100 flanges. O vendedor lança o cliente e o item e a proposta nasce aberta. Ele não tem o preço do flange, pede ao Orçamento e vê o histórico enquanto espera.

Com o custo preenchido, a margem aparece no rodapé. A Gerência aceita o desconto numa conversa, e o vendedor marca a proposta como aprovada. Os flanges têm certificado de material, então ele marca que a Qualidade acompanha. O pedido vai ao Omie e nasce liberado.

Depois, Compras acha o flange mais caro que o previsto. O aviso mostra a margem atual, a nova margem e o motivo. O vendedor aprova e a comissão dele cai.

## Quem atua

| Quem | O que faz |
|---|---|
| Vendedor | Cria e revisa a proposta, marca aprovada, transforma em pedido, aprova ou reprova compra mais cara, cancela ou exclui o pedido |
| Auxiliar do titular | Faz o mesmo pelos titulares que ajuda 🟡 |
| Gerência (João Vitor, Sérgio Vital) | Aprova desconto e margem pessoalmente. Não tem tela no sistema |
| Orçamento | Setor novo; o Moisés é uma das pessoas. Responde pedidos de custo |
| PCP | Lê o pedido liberado, abre a requisição, é avisado do cancelamento e liga a NF de entrada ao item |
| Compras | Confere a parte de compras (`C6`, `C7`), trata a compra acima do valor (`C8`) e emite a OC |
| Fiscal | Cria produto novo no Omie, separa o pedido para faturar em partes e informa devolução parcial. Não cancela pedido |
| Controladoria (Michele) | Decide a comissão no fim, com o custo real |
| Gerente de Vendas | Lê as propostas da equipe 🟡 |

Quem desenvolve (N16-117 a N16-119):

- O Robert faz as telas de proposta e as rotas na `api-acos-vital`.
- O Orçamento é do Pablo, com o Robert.
- O Nathan cuida da comissão estimada (`K1`, N16-115, N16-118).
- O Gustavo (DBA, administrador do banco) cuida do banco.

## Regras que valem

- Uma proposta vira um único pedido. Não existe fechamento parcial.
- A proposta só muda até ser aprovada. Cada ajuste gera uma revisão.
- Proposta incompleta (item de revenda sem custo e sem fornecedor) não pode ser aprovada.
- O botão "Transformar em pedido" só aparece na proposta aprovada.
- Sem a resposta "a Qualidade acompanha?", o pedido não é criado. O vendedor pode corrigir até o MES (sistema de chão de fábrica) importar o pedido.
- Sem os campos obrigatórios do modal (Qualidade, previsão de faturamento, `SPOT` ou `CONTRATO`, faturamento em partes ou não e categoria), o pedido não é criado. O tipo da venda (`SPOT` ou `CONTRATO`) é só informativo. Em faturamento em partes, a data por item é obrigatória (N16-150) 📝.
- Qualidade "Sim": o PCP é obrigado a pôr a Qualidade em todo o roteiro e em todas as etapas da fábrica. É mudança do lado do MES, em contrato à parte (N16-151) 📝.
- Refaturamento: a categoria de refaturamento depende da unidade (Mogi `1.01.96`, Uberaba `1.01.99`, HRM `1.01.98`), e a observação com a referência também conta. Ser refaturamento não basta para sair do líquido: só sai o Proibido ou Sem Referência; o refaturamento do mesmo mês com referência válida (Permitido) conta (N16-153, que supera em parte a N16-152) 📝.
- O pedido nasce liberado; o cancelamento do pedido (antes e depois de faturar) está em [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].
- O vendedor não é dono do dado de custo. Ele decide o valor que põe e responde por ele.
- Regras de Compras sobre a proposta (não altera a proposta, compra acima do valor, reprovação, aviso favorável): [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].
- Proposta cancelada não reabre. O vendedor duplica.
- Produto pendente (`PEND-xxxx`) não vira pedido até o cadastro no Omie.
- O câmbio vem da PTAX do Hub, do dia da aprovação.
- **Quem emite e para quem (pedido do Robert, 11/11/2026).** O vendedor emite em nome dele ou de um titular que auxilia, só na unidade em que tem vendedor ativo no Omie. O cliente é do vendedor da última venda (pedido ou NF), se ativo no Omie; sem venda, de quem fez proposta para ele nos últimos 30 dias. Cliente de outra carteira é recusado ("fale com a gerência"); a gerência passa. A regra é do banco (trigger `trg_propostas_conferir_emissao`, erros AV545 a AV548) ✅ `api-acos-vital` `src/utils/erroHttp.js:88` (`AV545`) (N16-160).

## O que já existe e o que falta

**A tela (front, `av-hub`)**

- ✅ (`av-hub`) Lista de propostas, nova proposta e detalhe da proposta no front, lendo a API do Hub; clientes pelo Acompanhamento de Clientes (N16-112).
- ✅ (`av-hub`) Meus Pedidos, com o cartão "Andamento na produção" (onde está cada item no MES).
- ✅ Aprovar, cancelar, copiar e transformar têm tela e BFF (a camada que liga a tela à API). O BFF repassa as quatro rotas e o reenvio ao Omie: `av-hub` `app/api/comercial/[...rota]/route.ts:35` (`/propostas/:id/aprovar`), `:36` (`/propostas/:id/cancelar`), `:37` (`/propostas/:id/copiar`), `:42` (`/propostas/:id/transformar`) e `:57` (`/pedidos/:id/enviar-omie`). Os botões ficam no cartão de andamento do detalhe da proposta: `components/Propostas/PropostaForm/AndamentoProposta.tsx:227` (`Cliente aprovou`), `:236` (`Transformar em pedido`), `:241` (`Cancelar proposta`), `:251` (`Tentar novamente no Omie`) e `:256` (`Copiar para nova proposta`). Na validação local em Docker de 10/11/2026, aprovar, cancelar, copiar e transformar funcionaram pela tela.
- ✅ O modal do transformar pergunta e envia as seis respostas, incluindo se a Qualidade acompanha e se o pedido fatura em partes (PR #277 do av-hub, commit `20e6089`): `av-hub` `components/Propostas/PropostaForm/TransformarModal.tsx:292` (`qualidade_acompanha: qualidadeAcompanha === 'sim'`) e `:296` (`faturar_em_partes: faturarEmPartes === 'sim'`). Sem tipo da venda, categoria, Qualidade ou faturamento em partes, o modal não envia: `:272` (`Escolha se a venda é SPOT ou CONTRATO`), `:275` (`Escolha a categoria do pedido`), `:278` (`Responda se a Qualidade acompanha`) e `:279` (`Responda se o pedido pode ser faturado em partes`). A validação local de 10/11/2026 rodou antes desse PR (av-hub `6fcbba6`): ali todo transformar pela tela recebia 400, porque o modal ainda não mandava as duas respostas que a API exige.
- ✅ O item da proposta só aceita produto do catálogo da unidade emissora; o que não está no catálogo o Fiscal cadastra no Omie (PR #278 do av-hub): `av-hub` `components/Propostas/PropostaForm/CompositorItem.tsx:194` (`O item só sai do catálogo`). Item antigo digitado sem produto avisa que não vira pedido no Omie (`:652`, `Este item foi digitado sem produto do catálogo`).
- ✅ Saíram da tela Duplicar, Copiar para outra empresa e Revisões, que não existem na API do Hub (PR #279 do av-hub, commit `07d1fbc`). Fica o "Copiar para nova proposta" do cartão de andamento, que só aparece em proposta `CANCELADA` ou `EXPIRADA` (`av-hub` `components/Propostas/PropostaForm/AndamentoProposta.tsx:250` (`proposta.status === 'EXPIRADA' || proposta.status === 'CANCELADA'`)); a aberta ou aprovada não tem cópia pela tela (reteste por cliques de 13/11).
- 🟡 O nº do pedido do cliente: o modal do transformar aceita 30 caracteres, mas o pedido vai ao Omie com no máximo 15 (`fn_pedido_venda_payload_omie`), sem aviso (reteste por cliques de 13/11, BL-093). O cartão da proposta não muda depois da falha do Omie até recarregar a página e o "Virou pedido" mostra "Qualidade: não informada" (BL-092).
- ✅ O frete da compra aparece no rateio (no compositor, no resultado do item, na grade e na Análise de margem) e o valor digitado com vírgula passa a ser lido (PR #286 do av-hub): `av-hub` `lib/domain/proposta-analise.ts:185` (`frete_compra: txt(r.itens.reduce`). O frete por item é só da tela; não é gravado.
- ✅ PDF comercial da proposta, uma por vez ou em lote, gerado no BFF (PR #288 do av-hub): `av-hub` `app/api/comercial/propostas/[id]/pdf/route.ts:24` (`requirePermission('propostas', 'pode_visualizar')`) e `app/api/comercial/propostas/lote/pdf/route.ts:30` (`requirePermission('propostas', 'pode_visualizar')`). 🔴 O envio por e-mail fica escondido até existir na API do Hub (`components/Propostas/PropostaForm/ResumoProposta.tsx:20`, `ENVIO_POR_EMAIL = false`): o vendedor baixa o PDF e envia por fora.
- ✅ A condição de pagamento vem só do Omie (Condições comerciais), e o encargo dela vai para a Análise de margem: travado quando a condição tem encargo no Hub, livre de 0 a 100% quando não tem (PR #291 do av-hub): `av-hub` `components/Propostas/PropostaForm/AbaCondicoes.tsx:107` (`value={form.codigo_condicao_pagamento}`) e `components/Propostas/PropostaForm/AbaAnalise.tsx:29` (`Esta condição ainda não tem encargo no Hub`). Proposta gravada antes do campo continua com o encargo pela condição do simulador (`:20`, `Proposta gravada antes do campo`). A regra do motor está em [[15-Custo-Real-e-Comissao]].
- 🔴 Tela da proposta no formato do Simulador de Comissão, com comissão estimada. Hoje o item entra sem fornecedor, e a proposta assim pode ser aprovada (`V0.3` não implementado).
- 🟡 Teste no Docker local em 13/11 (proposta AV2026-0015 até o PV-000006): criar, revisar (R01), PDFs comercial e técnico, linha do tempo, aprovar, cancelar com motivo, copiar e transformar funcionaram; o Omie falhou só por falta de credencial no ambiente. Três defeitos de tela: o cartão diz "Qualidade: não informada" depois do transformar, porque lê um campo que a API não devolve (`av-hub` `lib/domain/andamento-proposta.ts:151` (`p.acompanhamento_qualidade === true`)); depois da falha do Omie, o cartão só mostra o "Tentar novamente" após recarregar a página; e "Simular comissão deste pedido" abria o simulador sem o pedido (o botão saiu no av-hub #299, 16/11). Para um vendedor usar, faltam as telas no perfil Vendedor (PS-046) e as rotas do Comercial em `auth.rotas_telas` (PS-056).
- 🟡 Reteste no Docker em 13/11 (develop de 12/11, proposta AV2026-0017 até o PV-000007):
  - Copiar também respeita a carteira de clientes: copiar proposta de cliente de outro vendedor dá 403 `CLIENTE_FORA_DA_CARTEIRA` (a mesma regra do cadastro de cliente; a gerência passa) ✅ `api-acos-vital` `src/utils/erroHttp.js:92-93` (`CLIENTE_FORA_DA_CARTEIRA`), lida na rota `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:606` (`router.post("/propostas/:id/copiar"`).
  - A cópia nasce sem validade, preço, custo e análise (mantém cliente, destino, condição, quantidade e produto); aprovar a cópia sem revisar dá 409 `PROPOSTA_SEM_VALIDADE` ✅ `src/utils/erroHttp.js:65` (`PROPOSTA_SEM_VALIDADE`). ❓ Pergunta do reteste: a cópia deve levar validade, preço, custo e análise?
  - "Aprovação interna" (PDF), "Enviar por e-mail", importar itens por planilha e baixar o modelo da planilha dão 500 na tela: as rotas do BFF existem, mas chamam ajudantes que só devolvem 503 `RECURSO_NAO_MIGRADO`, porque a API do Hub não tem essas rotas 🔴 `av-hub` `lib/api/comercialApi.ts:114-132` (`return naoMigrado();`), por exemplo `app/api/comercial/propostas/[id]/aprovacao/route.ts:62` (`buscarComercial<PropostaProps>`) e `services/comercial/propostas.ts:808` (`baixarModeloItensPlanilha`). O botão de e-mail já fica escondido (`ENVIO_POR_EMAIL = false`); os outros aparecem e falham sem explicar.
- ✅ `C6` e `C7` na tela da OC (PR #282 do av-hub): `av-hub` `components/Compras/FecharCompra/CotacaoDaProposta.tsx:45` (`Cotado na proposta`). Detalhe em [[06-Circuito-de-Compra]].
- ✅ Aviso e aprovação da compra mais cara em Meus Pedidos (`C8`, LOG-57, PR #283 do av-hub): `av-hub` `components/Pedidos/DivergenciasDoVendedor.tsx:76` (`Para você responder`) e `:110` (`Aprovar a compra`). 🟡 A margem considerada ainda sai nula até o motor da comissão estar na API (BL-078).

**A API (`api-acos-vital`)**

- ✅ API da proposta na `api-acos-vital` (`develop`, `cc30c85`, de 28 e 29/10). As rotas ficam em `/comercial/propostas`: criar, listar, resumo, detalhe, linha do tempo, revisar (`PUT`, com `If-Match`), aprovar, cancelar com motivo, copiar e **transformar em pedido do Hub**.
- ✅ Também existem `POST /comercial/clientes` (cadastra o cliente no Omie da unidade; recusa cliente de outra carteira com `403 CLIENTE_FORA_DA_CARTEIRA`, `api-acos-vital` `src/schemas/core_comercial/aggregates/clientes/clientes.route.js:151`, `fn_cliente_cadastro_conferir(:u, :e, :d)`), `GET /comercial/parceiros` (filtra pela carteira do responsável mais os livres; a gerência vê tudo; `src/schemas/core_comercial/aggregates/parceiros/parceiros.route.js:53`, `responsavel: z.uuid().optional(),`), `GET /comercial/emissao` (empresas e responsáveis que o usuário pode usar; `src/schemas/core_comercial/aggregates/cadastros/cadastros.route.js:153`, `router.get("/emissao"`), `/me`, `/empresas_emissoras`, `/responsaveis` e `/parametros_custo`.
- 🟡 Criar o pedido no Omie (`V0.7`). Desde 03/11/2026 o envio é síncrono, direto da `api-acos-vital` ao `IncluirPedido`, sem fila nem pipeline (N16-149; [[Mapa-IncluirPedido-Omie]]). ✅ O código existe na `develop`: o `transformar` cria o pedido do Hub e, na mesma requisição, chama `ConsultarPedido` e depois `IncluirPedido` com uma tentativa só, para não duplicar (`api-acos-vital` `src/schemas/core_comercial/pedidoOmie.js:140` (`call: "ConsultarPedido"`) e `:239` (`call: "IncluirPedido"`)). Se o Omie recusar, o pedido fica no Hub com status `erro` e a rota `POST /comercial/pedidos/:id/enviar-omie` faz o "Tentar novamente" (`src/schemas/core_comercial/aggregates/pedidos/pedidos.route.js:33`, `router.post("/pedidos/:id/enviar-omie"`). ✅ O BFF e a tela já chamam essas rotas (ver "A tela"). Na validação local de 10/11/2026, com o Omie desligado, o pedido ficou no Hub com `status_sincronizacao_omie = erro` e a tela ofereceu "Tentar novamente no Omie". ❓ Falta o banco (ver "O banco"). Nenhum teste real no Omie está registrado (BL-081).
- 🟡 Nomes de rota das partes que faltam: o Gustavo e o Robert fecham.
- ✅ O `transformar` exige a previsão de faturamento, a resposta da Qualidade e o faturamento em partes (LOG-56), e recebe também o número do pedido do cliente, a categoria, `numero_contrato` (`SPOT` ou `CONTRATO`), `bloqueado`, `frete_modalidade` e `dados_adicionais_nf`: `api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:631` (`data_previsao: previsaoObrigatoria`), `:635` (`qualidade_acompanha: previsaoObrigatoria`), `:638` (`faturar_em_partes: previsaoObrigatoria`) e `:645` (`router.post("/propostas/:id/transformar"`). As duas respostas ficam no pedido do Hub e não vão ao Omie. Também há `GET /comercial/produtos` (catálogo da unidade da proposta, `src/schemas/core_comercial/aggregates/produtos/produtos.route.js:42`, `router.get("/produtos"`) e `GET /categorias?tipo=receita` (categorias de receita lançáveis, `src/schemas/core/tables/categorias/categorias.route.js:57`, `conta_receita = true`), que alimentam o item e o campo categoria do modal.
- ✅ A proposta e a simulação gravam o encargo da condição de pagamento (`encargo_pagamento`, de 0 a 100): `api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:219` (`encargo_pagamento: dec({ min: 0, max: "100" })`) e `src/schemas/core_comissionamento/tables/simulacoes/simulacoes.route.js:52` (`"encargo_pagamento", "codigo_condicao_pagamento"`). A coluna vem da migration `2026-11-12_comercial_encargo_pagamento_proposta_simulacao.sql`, com o DBA (N16-155); ❓ não conferida no banco de teste (PS-054).
- 🟡 Na API, a categoria e o tipo da venda continuam opcionais (`propostas.route.js:638` (`codigo_categoria`) e `:624` (`numero_contrato`)); só o modal os exige (N16-150). 🔴 Falta a data por item no faturamento em partes: nem o modal nem a API a recebem. O refaturamento sem comissão e a Qualidade no roteiro do PCP também não existem no código (N16-151, N16-152).

**O banco**

- ✅ No banco, o dump de 29/10 traz `core_comercial.propostas`, os itens, as versões, os eventos e a função `fn_proposta_criar`.
- ✅ No banco de teste (dump de 04/11/2026, [[Dump-AvHub-Teste-2026-11-04]]), as funções de revisar, aprovar, cancelar, copiar, transformar e expirar existem: `fn_proposta_revisar`, `fn_proposta_aprovar`, `fn_proposta_cancelar`, `fn_proposta_copiar`, `fn_proposta_transformar` e `fn_propostas_expirar`. No dump de 29/10 elas não estavam.
- 🟡 A rota chama `fn_proposta_transformar` com **4 argumentos** (`api-acos-vital` `propostas.route.js:669` (`fn_proposta_transformar`)). A versão de 4 argumentos está no banco de teste (dump de 09/11, [[Dump-AvHub-Teste-2026-11-09]], `:3876`), mas a migration `2026-11-05_comercial_pedido_venda_omie.sql` que a cria está fora do repositório e não foi aplicada em produção (Gustavo, 09/11; BL-024). O que o dump de 04/11 mostra: o `transformar` grava o pedido do Hub em `core_comercial.pedidos_venda` e `pedidos_venda_itens` (status `ABERTO` ou `CANCELADO`, `status_sincronizacao_omie` `pendente`) e a simulação de comissão (`core_comissionamento.simulacoes`). 🔴 Ele não grava liberação (N16-05; BL-069).
- ✅ O número da proposta é montado no banco por `fn_proposta_criar`, no formato `<sigla da unidade><ano>-<sequência de 4 dígitos>-R00` (a sigla vem de `core.unidades.sigla`, gerada do nome fantasia; a sequência é por unidade e ano); a revisão troca o `-R00` por `-R01`, `-R02` ([[Dump-AvHub-Teste-2026-11-12]], `04-Dados/Dumps/avhub-tst-esqueleto-2026-11-12.sql:4234`, `format('%s%s-%s-R00', v_unidade.sigla`). O `CO-` saiu em 10/11/2026 (pedido do Robert), também dos números já gravados (migration `2026-11-10_comercial_numero_proposta_sem_co`). 🔴 A numeração só de dígitos (N16-148, PS-038) não foi feita.
- ✅ As funções estão no banco de teste (dump de 10/11). As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); falta aplicá-las em produção (Gustavo).

**Regras, contratos e testes**

- 📝 Todas as regras acima estão decididas.
- O contrato do menu e os 15 contratos de proposta, orçamento, custo real e comissão nova foram removidos em 29/10/2026. O Robert cria os novos.
- `LOG-56` (`06-Contratos/Ativos/LOG-56-Transformar-Proposta-em-Pedido`) (`parcial`, 10/11/2026: banco e API na `develop`, falta o front do Robert e a produção): as respostas da Qualidade e do faturamento em partes no modal de transformar (já na `develop`, na API e na tela, PR #277 do av-hub), a conta corrente padrão por conta Omie e o valor inicial na Liberar Pedidos. Nós `V0.6` e `V0.7`.
- Liberação e cancelamento do pedido: ver [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].
- ❓ Testes no Omie: número próprio do pedido, pedido bloqueado e `ExcluirPedido`. O primeiro teste (item 4 do pedido do Robert de 03/11) sai com etapa `"10"`, `bloqueado = "S"`, sem CFOP e sem impostos no payload, e categoria de uma lista da unidade; ver [[Mapa-IncluirPedido-Omie]].

## Detalhe técnico

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[01-Proposta-de-Venda-Detalhe-Tecnico-1]]: Nota de raia · Objetivo · Quem atua (completo) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[01-Proposta-de-Venda-Detalhe-Tecnico-2]]: Como estava no módulo de teste do Pablo (🔴 `av-hub/api-comercial`, removido em 06/11/2026) · O Omie nesta raia ([[Estudo-Omie-API]]) · Dados 🟡 · Quem vê o quê · A tela da proposta (N16-19) · O que falta desenvolver · Pendências · Diagrama do subfluxo
