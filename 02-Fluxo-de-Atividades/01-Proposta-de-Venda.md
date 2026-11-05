---
tags: [fluxo, raia, vendas, proposta, v0, simulador, tela]
criado: 2026-10-16
estado-em: 2026-11-05
status: proposta
ordem: 1
nos: [V0.1, V0.2, V0.3, V0.4, V0.5, V0.6, V0.7, V0C]
anterior: "[[00-Fluxo-Mestre-0b]]"
proxima: "[[02-Orcamento-Base-de-Preco]]"
develop-conferida: [api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
dono: Nathan (regra) · Robert (rotas e telas de proposta) · Pablo (acompanha) · Gustavo (banco) · Compras (C6, C7, C8)
fontes: [nota 11-Proposta-e-Pedido-de-Venda da v2 (tag v2-antes-da-v3), sem C6–C8, V1–V3 e B2–B4, que foram para 06, 03 e 02 em 05/11/2026, Registro-de-Decisoes (N16-01 a N16-144), api-acos-vital develop cc30c85 e 0384e89 de 29/10/2026 (core_comercial/aggregates/propostas/propostas.route.js, clientes, cadastros, parceiros), Dump Avhub 29/10/2026 (fn_proposta_criar, core_comercial.propostas), av-hub develop 758d5f0 (app/api/comercial/[...rota]/route.ts, lib/domain/andamento-proposta.ts), Estudo-Omie-API, 09-Diagramas/fontes/tela-simulador-comissao.png, 09-Diagramas/fontes/email-divergencia-margem-pv27824.jpg e pv28204.jpg, av-hub comissoes/simulador/page.tsx, 00-Fluxo-Mestre-0b, 01-Vendas-Liberacao, 04-Circuito-de-Compra, Proposta-Orcamento-Comissao/08-Reuniao/Proposta-Orcamento-Pedido-Comissao.docx (fora do vault), 09-Diagramas/artifact-proposta-pedido.html, api-comercial 5aa5311 (propostas.routes.ts, propostas.service.ts, vendas.prisma, enums.prisma, custos.routes.ts, numeroProposta.ts), Dump Avhub 14/10]
---

# Proposta de venda

**Em uma frase:** o vendedor monta a proposta, a Gerência aprova, e a proposta aprovada vira pedido de venda (PV) no Omie, já liberado para o PCP (planejamento e controle da produção) começar.

**Quando consultar:** dúvidas sobre a proposta: como o vendedor monta, quem aprova, o que a proposta guarda e como ela vira pedido no Omie.

**Onde estamos no fluxo:** ← [[00-Fluxo-Mestre-0b]] | [[02-Orcamento-Base-de-Preco]] → · nós desta nota: `V0.1`, `V0.2`, `V0.3`, `V0.4`, `V0.5`, `V0.6`, `V0.7`, `V0C`

Nesta etapa o vendedor também acompanha o pedido, aprova compras mais caras e pode cancelar. A nota é uma proposta: o fluxo foi aprovado em 26/10/2026.

## Como funciona, passo a passo

1. O vendedor cria a proposta. O sistema dá a ela um número automático, só com dígitos. `V0.1`
2. O vendedor preenche o custo com o que conseguiu, por telefone ou e-mail. Se não tem o dado, pede cotação ao Orçamento ou olha o histórico das ordens de compra (OC). `V0.2`
3. O sistema calcula margem e comissão estimada. Só o vendedor vê. Item sem custo e sem fornecedor deixa a proposta incompleta, e ela não pode ser aprovada. `V0.3`
4. A Gerência aprova desconto e margem pessoalmente, fora do sistema, neste ciclo. `V0.4`
5. O vendedor marca "aprovada" no sistema. O sistema grava quem, quando e qual revisão, e a proposta trava. Se a proposta não segue, ela é cancelada e não reabre. `V0.5`, `V0C`
6. O vendedor clica em "Transformar em pedido de venda" e responde seis campos (N16-150): se a Qualidade acompanha o pedido por todos os processos (`Sim` ou `Não`); a previsão de faturamento, que é a data de entrega ao cliente; se a venda é `SPOT` (cliente sem contrato) ou `CONTRATO`; se o pedido fatura em partes ou só quando tudo estiver pronto; o número do pedido do cliente (opcional); e a categoria, escolhida numa lista com código e descrição. Se fatura em partes, a data do pedido é a data final e cada item leva a sua data, igual ou anterior a ela. `V0.6`
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
- Proposta incompleta (item sem custo e sem fornecedor) não pode ser aprovada.
- O botão "Transformar em pedido" só aparece na proposta aprovada.
- Sem a resposta "a Qualidade acompanha?", o pedido não é criado. O vendedor pode corrigir até o MES (sistema de chão de fábrica) importar o pedido.
- Sem os campos obrigatórios do modal (Qualidade, previsão de faturamento, `SPOT` ou `CONTRATO`, faturamento em partes ou não e categoria), o pedido não é criado. O tipo da venda (`SPOT` ou `CONTRATO`) é só informativo. Em faturamento em partes, a data por item é obrigatória (N16-150) 📝.
- Qualidade "Sim": o PCP é obrigado a pôr a Qualidade em todo o roteiro e em todas as etapas da fábrica. É mudança do lado do MES, em contrato à parte (N16-151) 📝.
- Refaturamento: se a categoria escolhida é de refaturamento, a comissão do vendedor nesse pedido é desconsiderada. Quais categorias são refaturamento ainda será definido (N16-152, PS-040) 📝.
- O pedido nasce liberado; o cancelamento do pedido (antes e depois de faturar) está em [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].
- O vendedor não é dono do dado de custo. Ele decide o valor que põe e responde por ele.
- Regras de Compras sobre a proposta (não altera a proposta, compra acima do valor, reprovação, aviso favorável): [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].
- Proposta cancelada não reabre. O vendedor duplica.
- Produto pendente (`PEND-xxxx`) não vira pedido até o cadastro no Omie.
- O câmbio vem da PTAX do Hub, do dia da aprovação.

## O que já existe e o que falta

**A tela (front, `av-hub`)**

- ✅ (`av-hub`) Lista de propostas, nova proposta e detalhe da proposta no front, lendo a API do Hub; clientes pelo Acompanhamento de Clientes (N16-112).
- ✅ (`av-hub`) Meus Pedidos, com a etapa dos itens.
- 🟡 O front lista, cria e abre a proposta pela API do Hub (`av-hub` `develop`, 758d5f0). O BFF (a camada que liga a tela à API) ainda não tem `aprovar`, `cancelar` nem `transformar`. O cartão de andamento diz que a etapa do pedido fica pendente enquanto a rota não existe.
- 🟡 Aprovar e transformar em pedido: a API existe; falta ligar o BFF e a tela.
- 🔴 Tela da proposta no formato do Simulador de Comissão, com comissão estimada.
- 🔴 `C6` e `C7` na tela da OC.
- 🔴 Aviso e aprovação da compra mais cara em Meus Pedidos (`C8`).

**A API (`api-acos-vital`)**

- ✅ API da proposta na `api-acos-vital` (`develop`, `cc30c85`, de 28 e 29/10). As rotas ficam em `/comercial/propostas`: criar, listar, resumo, detalhe, linha do tempo, revisar (`PUT`, com `If-Match`), aprovar, cancelar com motivo, copiar e **transformar em pedido do Hub**.
- ✅ Também existem `POST /comercial/clientes` (cadastra o cliente no Omie da unidade), `GET /comercial/parceiros`, `/me`, `/empresas_emissoras`, `/responsaveis` e `/parametros_custo`.
- 🔴 Criar o pedido no Omie (`V0.7`). Desde 03/11/2026 o envio é síncrono, direto da `api-acos-vital` ao `IncluirPedido`, sem fila nem pipeline (N16-149; [[Mapa-IncluirPedido-Omie]]); o desenho anterior era por fila e pipeline, com a pipeline como 2ª etapa. Hoje o pedido do Hub nasce com `status_sincronizacao_omie = pendente`. Ele fica `pendente`, e nada o envia: a API **não escreve no Omie** nesse passo.
- 🟡 Nomes de rota das partes que faltam: o Gustavo e o Robert fecham.
- 🟡 O corpo do `transformar` já recebe previsão de faturamento (obrigatória), número do pedido do cliente, categoria (opcional), `numero_contrato` (`SPOT` ou `CONTRATO`, opcional), `bloqueado` e `frete_modalidade` (✅ `api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:579-617`, `develop` 1654f65). Esse mesmo commit passou a enviar o pedido ao Omie na mesma requisição (`pedidoOmie.js`). O vault ainda descreve o `V0.7` como 🔴 acima e não foi reconferido nesta atualização: conferir o caminho inteiro (tela, API, banco) antes de trocar o selo.
- 🔴 Faltam no `transformar`: a resposta da Qualidade, o faturamento em partes com a data por item, e tornar obrigatórios o tipo da venda e a categoria (N16-150). O refaturamento sem comissão e a Qualidade no roteiro do PCP também não existem no código (N16-151, N16-152).

**O banco**

- ✅ No banco, o dump de 29/10 traz `core_comercial.propostas`, os itens, as versões, os eventos e a função `fn_proposta_criar`.
- ✅ No banco de teste (dump de 04/11/2026, [[Dump-AvHub-Teste-2026-11-04]]), as funções de revisar, aprovar, cancelar, copiar, transformar e expirar existem: `fn_proposta_revisar`, `fn_proposta_aprovar`, `fn_proposta_cancelar`, `fn_proposta_copiar`, `fn_proposta_transformar` e `fn_propostas_expirar`. No dump de 29/10 elas não estavam.
- ✅ (`api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:548-568`, que chama `core_comercial.fn_proposta_transformar`; a função e as tabelas estão no Dump de 04/11, [[Dump-AvHub-Teste-2026-11-04]]) O `transformar` grava o pedido do Hub em `core_comercial.pedidos_venda` e `pedidos_venda_itens` (status `ABERTO` ou `CANCELADO`, `status_sincronizacao_omie` `pendente`) e a simulação de comissão (`core_comissionamento.simulacoes`). 🔴 Ele não grava liberação (N16-05; BL-069).
- ❓ A migration dessas funções continua fora do repositório (Gustavo).

**Regras, contratos e testes**

- 📝 Todas as regras acima estão decididas.
- O contrato do menu e os 15 contratos de proposta, orçamento, custo real e comissão nova foram removidos em 29/10/2026. O Robert cria os novos.
- Liberação e cancelamento do pedido: ver [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].
- ❓ Testes no Omie: número próprio do pedido, pedido bloqueado e `ExcluirPedido`. O primeiro teste (item 4 do pedido do Robert de 03/11) sai com etapa `"10"`, `bloqueado = "S"`, sem CFOP e sem impostos no payload, e categoria de uma lista da unidade; ver [[Mapa-IncluirPedido-Omie]].

## Detalhe técnico

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[01-Proposta-de-Venda-Detalhe-Tecnico-1]]: Nota de raia · Objetivo · Quem atua (completo) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[01-Proposta-de-Venda-Detalhe-Tecnico-2]]: Como estava no módulo de teste do Pablo (🔴 `av-hub/api-comercial`, que será removido) · O Omie nesta raia ([[Estudo-Omie-API]]) · Dados 🟡 · Quem vê o quê · A tela da proposta (N16-19) · O que falta desenvolver · Pendências · Diagrama do subfluxo
