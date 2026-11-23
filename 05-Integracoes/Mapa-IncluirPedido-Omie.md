---
tags: [omie, pedido-de-venda, incluir-pedido, api, mapa-de-campos, pesquisa]
criado: 2026-10-23
estado-em: 2026-11-13
status: proposta
dono: Nathan
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: ["Documentação do Omie lida em 23/10/2026: https://app.omie.com.br/api/v1/produtos/pedido/ (serviço PedidoVendaProduto, método IncluirPedido e tipos complexos)", "Exemplo de IncluirPedido enviado pelo Nathan em 23/10/2026", "05-Integracoes/Estudo-Omie-API (estudo de 21/10)", "av-hub components/Propostas/PropostaForm (PedidoOmieModal.tsx, ItemProposta.tsx, PropostaForm.tsx)", "Pedido do Robert ao Nathan de 03/11/2026 e errata de 05/11/2026", "api-acos-vital develop 1654f65 (pedidoOmie.js, propostas.route.js, pedidos.route.js, categorias.route.js), conferido em 05/11/2026", "Consultas só de leitura ao Omie nas três contas em 04/11/2026 (ListarCategorias, ListarFormasPagCompras, ListarFormasPagVendas, ListarContasCorrentes)", "Dump do Avhub de 29/10/2026 (vw_faturamento_planilha, vw_comissao_master)"]
---

# Mapa do `IncluirPedido` do Omie: o que o hub manda, de onde vem cada campo e o que ainda não sabemos

**Em uma frase:** esta nota lista, campo a campo, o que o hub vai mandar ao Omie quando uma proposta virar pedido de venda, de onde vem cada dado e o que ainda precisa de teste.

**Quando consultar esta nota:** ao desenhar ou revisar o envio do pedido ao Omie (o ERP, sistema fiscal e financeiro), ou ao decidir qual dado da proposta vira campo do pedido. Status: 🟡 proposta. **Nenhum pedido foi criado no Omie:** o código do envio existe na `api-acos-vital` desde o commit `1654f65` (05/11/2026), mas nenhum teste real foi registrado e o banco que monta o payload está fora do repositório ❓. A documentação foi lida em 23/10/2026, e em 04/11/2026 fizemos consultas só de leitura aos catálogos das três contas (categorias, condições de pagamento e contas correntes).

## Quem manda dado para quem, quando e por quê

- **Hub para Omie, ao virar pedido.** O vendedor transforma a proposta em pedido no hub. O hub envia o pedido ao Omie pelo método `IncluirPedido` (a chamada do Omie que cria pedido de venda). Por quê: o faturamento acontece no Omie.
- **Uma conta Omie por unidade.** São três contas: Mogi (Aços Vital), Arujá (HRM) e Uberaba (Aços Uberaba). O pedido vai à conta da empresa emissora da proposta (N16-79, N16-80).
- **O hub manda só o necessário para faturar:** cliente, produtos, quantidades, preços, condição de pagamento, vendedor. O que só o hub tem fica no hub: Qualidade, faturamento em partes, previsões, requisitos e moeda de origem (decisão do Nathan, 23/10).
- **Omie para hub, na volta.** O Omie devolve o código e o número do pedido. A pipeline (o programa que copia dados do Omie para o hub) lê o pedido de volta e compara total, itens e códigos. Se algo divergir, o pedido recebe um aviso e **não é liberado**.
- **Moeda.** O Omie não tem campo de moeda. Proposta em dólar ou euro vira reais pela cotação do Banco Central (PTAX) do dia da aprovação (N16-13, N16-27). O pedido do hub e o do Omie ficam em reais.
- **Impostos.** O vendedor digita ICMS, IPI e ST na proposta, e esses valores ficam no pedido do Hub (N16-95). **Eles não viajam ao Omie** (decidido em 03/11, registrado pelo Robert): o Omie calcula pelo cenário de impostos, então o total da proposta e o do pedido no Omie podem divergir. Divergência marca o pedido com aviso e não libera.
- **Quando o pedido não vai:** se o cliente não tem cadastro na conta do Omie, ou se o produto ainda é pendente (N16-28).
- **Condição de pagamento.** Hoje a proposta guarda texto livre, mas o Omie quer um código cadastrado, diferente em cada conta. O código real é o que vai, e só ele 🟡. A pipeline já copia as condições: a tabela `condicoes_pagamento_compras` (do `ListarFormasPagCompras`) é a fonte, e o `ListarFormasPagVendas` traz as mesmas condições ✅ (conferido em 04/11).

## O pedido mínimo e o que está fechado (04 e 05/11/2026)

O primeiro pedido de teste sai com o payload mínimo: cabeçalho (cliente, código de integração do pedido, previsão, etapa, condição de pagamento, quantidade de itens), itens (código de integração do item, produto, descrição, quantidade, unidade e valor unitário), vendedor, categoria, número do pedido do cliente, consumidor final, e-mail e frete. O envio é **síncrono**: a `api-acos-vital` chama o Omie direto pelo cliente `utils/omie.js`, sem fila e sem worker na pipeline (pedido do Robert, 03/11). ✅ Está no código: o `transformar` cria o pedido do Hub e chama `ConsultarPedido` pelo número do pedido (`PV-000001`, o código de integração) antes de incluir; se o Omie já tem, só grava o retorno. Depois chama `IncluirPedido` com uma tentativa só, para não duplicar após um timeout (`api-acos-vital` `src/schemas/core_comercial/pedidoOmie.js:144` (`call: "ConsultarPedido"`) e `:239` (`call: "IncluirPedido"`), `develop` `1654f65`, reconferido em 13/11). Se o Omie recusar, o pedido fica no Hub com status `erro` e `POST /comercial/pedidos/:id/enviar-omie` reenvia (`pedidos.route.js:33`). O payload sai pronto de `fn_pedido_venda_envio_iniciar`, função do banco que **não está no repositório nem no dump de 04/11** ❓: os campos da tabela abaixo não podem ser conferidos no que é enviado.

| Ponto | Situação |
|---|---|
| Etapa | 📝 sempre `"10"` (Nathan, 04/11). ❓ O Hub tem a coluna `etapa` no pedido (`pedidoOmie.js:69`), mas o valor enviado vem do banco |
| `bloqueado` | 📝 `"S"` no primeiro teste, para ver como o pedido aparece no Omie (Nathan, 04/11). ✅ O corpo do `transformar` aceita `bloqueado` (booleano) e o padrão é `true` (`propostas.route.js:620`) |
| Condição de pagamento | 📝 vem de `condicoes_pagamento_compras`; não há recurso novo de venda (Nathan, 04/11) |
| Categoria | 📝 lista por unidade, filtrada pela unidade emissora; o vendedor escolhe (Nathan, 04/11). ✅ `GET /categorias?codigo_empresa=&tipo=receita` devolve as de receita lançáveis (`categorias.route.js:47-57`) e o `transformar` recebe `codigo_categoria` (opcional hoje, `propostas.route.js:622`). 🟡 Pré-selecionar `1.01.01` e avisar a consequência do refaturamento (Robert, 05/11; seção 5.3.1; N16-152) |
| `numero_contrato` | ✅ o `transformar` recebe `SPOT` ou `CONTRATO` (opcional hoje, `propostas.route.js:624-626`); só informativo (N16-150) |
| Conta corrente | ⚠️ **em aberto, decisão do Nathan.** O vendedor não preenche conta no Omie hoje (quem tem acesso é o Financeiro). O Robert propõe **omitir** o campo e ver no teste o que o Omie grava 🟡; a ideia de 04/11 era uma lista por unidade |
| CFOP | 🟡 não mandar: o vendedor também não o preenche, e se o pedido sai certo assim é o cenário de impostos que resolve. O teste confirma |
| Impostos (`det[].imposto`) | 📝 não viajam (decidido em 03/11, registrado pelo Robert) |
| Vendedor (`codVend`) | 📝 obrigatório: sem ele o pedido existe no Omie e some do Hub e da comissão |

O teste do item 4 (pedido do Robert) segue o roteiro: `IncluirPedido` com o payload mínimo, `ConsultarPedido`, comparar com um pedido equivalente digitado à mão e `ExcluirPedido`, com cadastros TESTE de cliente e produto. Ele responde o que o Omie grava de CFOP e de conta corrente quando omitimos, se o `valor_unitario` é base com IPI e ST por fora e se o cenário padrão resolve. 🔴 Ainda não foi feito: o código existe (`1654f65`), mas o teste espera o banco com as migrations de 05/11 aplicadas, a unidade, a categoria e a decisão da conta.

## O que ainda não sabemos

Os testes no Omie ficam para depois que as telas estiverem prontas (N16-82). O Omie não tem ambiente de teste, então usa-se cadastros TESTE no ambiente real. Perguntas em aberto: mínimo obrigatório por conta, se o pedido nasce bloqueado, como o Omie trata CFOP e cenário de impostos, e como conta o vencimento das parcelas. A lista de 13 testes está na seção 6 do detalhe (OQ-16).

Complementa o [[Estudo-Omie-API]]. Selos: ✅ está na documentação ou no código · 📝 decisão do Nathan · 🟡 proposta · 🔴 não existe · ❓ não conferido.

## Detalhe técnico

Complementa o [[Estudo-Omie-API]]. Aqui a documentação do `IncluirPedido` foi lida campo a campo e cruzada com a proposta do hub. **Nenhuma chamada foi feita ao Omie**: tudo o que depende de comportamento real está marcado ❓ e entra na lista de testes da seção 6.

Selos: ✅ está na documentação ou no código · 📝 decisão do Nathan · 🟡 proposta · 🔴 não existe · ❓ não conferido.

O detalhe técnico desta nota fica em 2 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[Mapa-IncluirPedido-Omie-Detalhe-Tecnico-1]]: 1. O método em uma tela · 2. Cabeçalho (`cabecalho`) · 3. Itens (`det`, uma linha por item) · 4. Impostos de venda
- [[Mapa-IncluirPedido-Omie-Detalhe-Tecnico-2]]: 5. Condição de pagamento, frete, informações adicionais · 6. O que a documentação **não** responde (testes no Omie, OQ-16) · 7. Dois achados que mudam o desenho · 8. O que isso muda nos contratos · Ver também
