# Fatos de 01-Proposta-de-Venda

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/01-Proposta-de-Venda.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir 01-Proposta-de-Venda`.

## decisões e IDs (6)

- `N16-112`
- `N16-115`
- `N16-117`
- `N16-118`
- `N16-119`
- `N16-19`

## contratos (0)


## commits (1)

- `cc30c85`

## arquivo:linha (0)


## rotas (2)

- `GET /comercial/parceiros`
- `POST /comercial/clientes`

## datas (4)

- `03/11`
- `26/10/2026`
- `29/10`
- `29/10/2026`

## código entre crases (39)

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

## regras e linhas de conteúdo (42)

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
- Liberação e cancelamento do pedido: ver [[03-Pedido-de-Venda-e-Liberacao-Detalhe-Tecnico-2#Pedido que nasce da proposta: liberação e cancelamento]].
- ✅ (`av-hub`) Meus Pedidos, com a etapa dos itens.
- ✅ API da proposta na `api-acos-vital` (`develop`, 29/10): criar, listar, revisar, aprovar, cancelar, copiar e transformar em pedido do Hub.
- 📝 Todas as regras acima estão decididas.
- 🟡 Aprovar e transformar em pedido: a API existe; falta ligar o BFF e a tela.
- 🔴 Criar o pedido no Omie por fila e pipeline (`V0.7`): o pedido do Hub fica `pendente` e nada o envia.
- 🔴 Tela da proposta no formato do Simulador de Comissão, com comissão estimada.
- 🔴 Aviso e aprovação da compra mais cara em Meus Pedidos (`C8`).
- 🟡 Nomes de rota das partes que faltam: o Gustavo e o Robert fecham.
- ❓ Testes no Omie: número próprio do pedido, pedido bloqueado e `ExcluirPedido`. O primeiro teste (item 4 do pedido do Robert de 03/11) sai com etapa `"10"`, `bloqueado = "S"`, sem CFOP e sem impostos no payload, e categoria de uma lista da unidade; ver [[Mapa-IncluirPedido-Omie]].
- [[01-Proposta-de-Venda-Detalhe-Tecnico-1]]: Nota de raia · Objetivo · Quem atua (completo) · Regras decididas · Estados · Telas · Endpoints e contratos
- [[01-Proposta-de-Venda-Detalhe-Tecnico-2]]: Como estava no módulo de teste do Pablo (🔴 `av-hub/api-comercial`, que será removido) · O Omie nesta raia ([[Estudo-Omie-API]]) · Dados 🟡 · Quem vê o quê · A tela da proposta (N16-19) · O que falta desenvolver · Pendências · Diagrama do subfluxo
