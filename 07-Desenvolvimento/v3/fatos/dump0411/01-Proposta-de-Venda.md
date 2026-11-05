# Fatos de 01-Proposta-de-Venda

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/01-Proposta-de-Venda.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir 01-Proposta-de-Venda`.

## decisões e IDs (7)

- `N16-112`
- `N16-115`
- `N16-117`
- `N16-118`
- `N16-119`
- `N16-149`
- `N16-19`

## contratos (0)


## commits (1)

- `cc30c85`

## arquivo:linha (0)


## rotas (2)

- `GET /comercial/parceiros`
- `POST /comercial/clientes`

## datas (5)

- `03/11`
- `03/11/2026`
- `26/10/2026`
- `29/10`
- `29/10/2026`

## código entre crases (40)

- `"10"`
- `/comercial/propostas`
- `/empresas_emissoras`
- `/me`
- `/parametros_custo`
- `/responsaveis`
- `C6`
- `C7`
- `C8`
- `ExcluirPedido`
- `GET /comercial/parceiros`
- `If-Match`
- `IncluirPedido`
- `K1`
- `PEND-xxxx`
- `POST /comercial/clientes`
- `PUT`
- `V0.1`
- `V0.2`
- `V0.3`
- `V0.4`
- `V0.5`
- `V0.6`
- `V0.7`
- `V0C`
- `V1`
- `V3`
- `api-acos-vital`
- `aprovar`
- `av-hub`
- `av-hub/api-comercial`
- `bloqueado = "S"`
- `cancelar`
- `cc30c85`
- `core_comercial.propostas`
- `develop`
- `fn_proposta_criar`
- `pendente`
- `status_sincronizacao_omie = pendente`
- `transformar`

## regras e linhas de conteúdo (51)

- O vendedor cria a proposta. O sistema dá a ela um número automático, só com dígitos. `V0.1`
- O vendedor preenche o custo com o que conseguiu, por telefone ou e-mail. Se não tem o dado, pede cotação ao Orçamento ou olha o histórico das ordens de compra (OC). `V0.2`
- O sistema calcula margem e comissão estimada. Só o vendedor vê. Item sem custo e sem fornecedor deixa a proposta incompleta, e ela não pode ser aprovada. `V0.3`
- A Gerência aprova desconto e margem pessoalmente, fora do sistema, neste ciclo. `V0.4`
- O vendedor marca "aprovada" no sistema. O sistema grava quem, quando e qual revisão, e a proposta trava. Se a proposta não segue, ela é cancelada e não reabre. `V0.5`, `V0C`
- O vendedor clica em "Transformar em pedido de venda". Ele precisa dizer se a Qualidade acompanha o pedido. `V0.6`
- O sistema coloca o pedido numa fila e a integração o cria no Omie. Se o Omie recusar, aparece o motivo e o botão "Tentar novamente". `V0.7`
- O pedido nasce liberado e o PCP o vê na triagem (`V1` a `V3`): ver [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].
- Compras confere a parte de compras e, se comprar acima do valor da proposta, o vendedor aprova ou reprova por produto: `C6`, `C7` e `C8` estão em [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].
- | Vendedor | Cria e revisa a proposta, marca aprovada, transforma em pedido, aprova ou reprova compra mais cara, cancela ou exclui o pedido |
- | Auxiliar do titular | Faz o mesmo pelos titulares que ajuda 🟡 |
- | Gerência (João Vitor, Sérgio Vital) | Aprova desconto e margem pessoalmente. Não tem tela no sistema |
- | Orçamento | Setor novo; o Moisés é uma das pessoas. Responde pedidos de custo |
- | PCP | Lê o pedido liberado, abre a requisição, é avisado do cancelamento e liga a NF de entrada ao item |
- | Compras | Confere a parte de compras (`C6`, `C7`), trata a compra acima do valor (`C8`) e emite a OC |
- | Fiscal | Cria produto novo no Omie, separa o pedido para faturar em partes e informa devolução parcial. Não cancela pedido |
- | Controladoria (Michele) | Decide a comissão no fim, com o custo real |
- | Gerente de Vendas | Lê as propostas da equipe 🟡 |
- O Robert faz as telas de proposta e as rotas na `api-acos-vital`.
- O Orçamento é do Pablo, com o Robert.
- O Nathan cuida da comissão estimada (`K1`, N16-115, N16-118).
- O Gustavo (DBA, administrador do banco) cuida do banco.
- Uma proposta vira um único pedido. Não existe fechamento parcial.
- A proposta só muda até ser aprovada. Cada ajuste gera uma revisão.
- Proposta incompleta (item sem custo e sem fornecedor) não pode ser aprovada.
- O botão "Transformar em pedido" só aparece na proposta aprovada.
- Sem a resposta "a Qualidade acompanha?", o pedido não é criado. O vendedor pode corrigir até o MES (sistema de chão de fábrica) importar o pedido.
- O pedido nasce liberado; o cancelamento do pedido (antes e depois de faturar) está em [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].
- O vendedor não é dono do dado de custo. Ele decide o valor que põe e responde por ele.
- Regras de Compras sobre a proposta (não altera a proposta, compra acima do valor, reprovação, aviso favorável): [[06-Circuito-de-Compra-Detalhe-Tecnico-2#C6, C7 e C8: a parte de compras do pedido da proposta]].
- Proposta cancelada não reabre. O vendedor duplica.
- Produto pendente (`PEND-xxxx`) não vira pedido até o cadastro no Omie.
- O câmbio vem da PTAX do Hub, do dia da aprovação.
- ✅ (`av-hub`) Lista de propostas, nova proposta e detalhe da proposta no front, lendo a API do Hub; clientes pelo Acompanhamento de Clientes (N16-112).
- ✅ (`av-hub`) Meus Pedidos, com a etapa dos itens.
- 🟡 O front lista, cria e abre a proposta pela API do Hub (`av-hub` `develop`, 758d5f0). O BFF (a camada que liga a tela à API) ainda não tem `aprovar`, `cancelar` nem `transformar`. O cartão de andamento diz que a etapa do pedido fica pendente enquanto a rota não existe.
- 🟡 Aprovar e transformar em pedido: a API existe; falta ligar o BFF e a tela.
- 🔴 Tela da proposta no formato do Simulador de Comissão, com comissão estimada.
- 🔴 Aviso e aprovação da compra mais cara em Meus Pedidos (`C8`).
- ✅ API da proposta na `api-acos-vital` (`develop`, `cc30c85`, de 28 e 29/10). As rotas ficam em `/comercial/propostas`: criar, listar, resumo, detalhe, linha do tempo, revisar (`PUT`, com `If-Match`), aprovar, cancelar com motivo, copiar e **transformar em pedido do Hub**.
- ✅ Também existem `POST /comercial/clientes` (cadastra o cliente no Omie da unidade), `GET /comercial/parceiros`, `/me`, `/empresas_emissoras`, `/responsaveis` e `/parametros_custo`.
- 🔴 Criar o pedido no Omie (`V0.7`). Desde 03/11/2026 o envio é síncrono, direto da `api-acos-vital` ao `IncluirPedido`, sem fila nem pipeline (N16-149; [[Mapa-IncluirPedido-Omie]]); o desenho anterior era por fila e pipeline, com a pipeline como 2ª etapa. Hoje o pedido do Hub nasce com `status_sincronizacao_omie = pendente`. Ele fica `pendente`, e nada o envia: a API **não escreve no Omie** nesse passo.
- 🟡 Nomes de rota das partes que faltam: o Gustavo e o Robert fecham.
- ✅ No banco, o dump de 29/10 traz `core_comercial.propostas`, os itens, as versões, os eventos e a função `fn_proposta_criar`.
- ❓ As funções de revisar, aprovar, cancelar, copiar, transformar e expirar são chamadas pela API, mas a migration delas não está no repositório nem no dump (Gustavo).
- 📝 Todas as regras acima estão decididas.
- O contrato do menu e os 15 contratos de proposta, orçamento, custo real e comissão nova foram removidos em 29/10/2026. O Robert cria os novos.
- Liberação e cancelamento do pedido: ver [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].
- ❓ Testes no Omie: número próprio do pedido, pedido bloqueado e `ExcluirPedido`. O primeiro teste (item 4 do pedido do Robert de 03/11) sai com etapa `"10"`, `bloqueado = "S"`, sem CFOP e sem impostos no payload, e categoria de uma lista da unidade; ver [[Mapa-IncluirPedido-Omie]].
- [[01-Proposta-de-Venda-Detalhe-Tecnico-1]]: Nota de raia · Objetivo · Quem atua (completo) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[01-Proposta-de-Venda-Detalhe-Tecnico-2]]: Como estava no módulo de teste do Pablo (🔴 `av-hub/api-comercial`, que será removido) · O Omie nesta raia ([[Estudo-Omie-API]]) · Dados 🟡 · Quem vê o quê · A tela da proposta (N16-19) · O que falta desenvolver · Pendências · Diagrama do subfluxo
