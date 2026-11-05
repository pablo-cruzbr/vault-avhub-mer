---
tags: [omie, pedido-de-venda, incluir-pedido, api, mapa-de-campos, pesquisa, parte]
criado: 2026-11-05
estado-em: 2026-11-05
status: proposta
dono: Nathan
parte-de: "[[Mapa-IncluirPedido-Omie]]"
fontes: ["Documentação do Omie lida em 23/10/2026: https://app.omie.com.br/api/v1/produtos/pedido/ (serviço PedidoVendaProduto, método IncluirPedido e tipos complexos)", "Exemplo de IncluirPedido enviado pelo Nathan em 23/10/2026", "05-Integracoes/Estudo-Omie-API (estudo de 21/10)", "av-hub components/Propostas/PropostaForm (PedidoOmieModal.tsx, ItemProposta.tsx, PropostaForm.tsx)", "Pedido do Robert ao Nathan de 03/11/2026 e errata de 05/11/2026", "Consultas só de leitura ao Omie nas três contas em 04/11/2026 (ListarCategorias, ListarFormasPagCompras, ListarFormasPagVendas, ListarContasCorrentes)", "Dump do Avhub de 29/10/2026 (vw_faturamento_planilha, vw_comissao_master)"]
---

# Mapa do `IncluirPedido` do Omie: o que o hub manda, de onde vem cada campo e o que ainda não sabemos: detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[Mapa-IncluirPedido-Omie]] (parte 1 de 2): 1. O método em uma tela; 2. Cabeçalho (`cabecalho`); 3. Itens (`det`, uma linha por item); 4. Impostos de venda.

**Onde estamos:** ← [[Mapa-IncluirPedido-Omie]] (resumo e índice) · partes: **Mapa-IncluirPedido-Omie-Detalhe-Tecnico-1** · [[Mapa-IncluirPedido-Omie-Detalhe-Tecnico-2]]

## 1. O método em uma tela

- **Endpoint:** `https://app.omie.com.br/api/v1/produtos/pedido/`, método `IncluirPedido` ("Inclui um pedido de venda de produto"). ✅
- **Entrada e saída:** recebe `pedido_venda_produto` e devolve `codigo_pedido`, `codigo_pedido_integracao`, `numero_pedido`, `codigo_status` e `descricao_status`. ✅ Erro vem no formato `omie_fail` (`code`, `description`, `referer`, `fatal`). ✅
- **Mesma estrutura para incluir, alterar e consultar:** o `AlterarPedidoVenda` e o `ConsultarPedido` usam o mesmo objeto. ✅ Isso permite ler de volta o que o Omie gravou e comparar com o que enviamos.
- **Outros métodos do serviço:** `ListarPedidos`, `ConsultarPedido`, `StatusPedido`, `TrocarEtapaPedido`, `AlterarPedFaturado`, `SimularImpostos`, `DevolverPedido` e `ExcluirPedido`. ✅ **Neste serviço não existe** método de cancelar pedido; o cancelar existe no serviço `pedidovendafat` (`CancelarPedidoVenda`, N16-84; falta só testar num pedido não faturado, PS-037). ✅
- **Cada conta Omie é uma unidade — são três:** Mogi (Aços Vital), Arujá (HRM) e Uberaba (Aços Uberaba), no mesmo sistema do Hub (N16-79). O pedido vai à conta da empresa emissora da proposta (a unidade da proposta, `core.unidades`; N16-80). ✅

## 2. Cabeçalho (`cabecalho`)

| Campo do Omie | Tipo | O que o hub manda | Origem no hub | Situação |
|---|---|---|---|---|
| `codigo_cliente` | inteiro | ID do cliente **na conta Omie da emissora** | `cliente_unidade_omie` | ✅ obrigatório no exemplo. Cliente sem cadastro na conta **não vira pedido** (`CLIENTE_SEM_CADASTRO_OMIE`) |
| `codigo_cliente_integracao` | texto 60 | alternativa ao ID | — | 🟡 não usar: o ID é mais direto |
| `codigo_pedido_integracao` | texto 60 | o **nosso código** do pedido | `pedido_venda.codigo_pedido_integracao` (= número do hub) | ✅ chave de idempotência; a pipeline consulta por ele antes de recriar |
| `numero_pedido` | texto 15 | o número do pedido que **nós** geramos | `pedido_venda.numero` | ✅ o campo existe e o exemplo o manda. ✅ O Omie aceita o número nosso (N16-82); o número do Omie continua a chave no MES |
| `data_previsao` | texto 10 (`dd/mm/aaaa`) | previsão de **faturamento** | **a data que o vendedor informa, obrigatória**, ao transformar em pedido; depois passa a ser a **vigente** (entrega do fornecedor mais recente + 1; N16-88) | ✅ o Omie chama de "Data de Previsão de Faturamento". A previsão vigente (entrega + 1 dia útil) **não volta ao Omie** (N16-91); o Omie guarda a inicial |
| `etapa` | texto 2 | `"10"` | fixo | 📝 sempre `"10"` (Nathan, 04/11). ❓ o nome das etapas da conta está em `core.etapas_faturamento` (`codigo_operacao = '11'`), por unidade |
| `codigo_parcela` | texto 3 | `"999"` quando mandamos `lista_parcelas`; ou o código da condição cadastrada | `proposta.codigo_parcela_omie` | ✅ exemplo; ❓ ver seção 5 (condição de pagamento) |
| `qtde_parcelas` | inteiro | — | — | 🟡 deixar o Omie deduzir de `lista_parcelas` |
| `quantidade_itens` | inteiro | número de linhas de `det` | contagem | ✅ exemplo |
| `origem_pedido` | texto 3 | — | — | ❓ para que serve (ex.: marcar "API"); o Omie já marca `importado_api`/`cImpAPI` sozinho |
| `bloqueado` | texto 1 | `"S"` no primeiro teste | fixo | 📝 primeiro teste com `"S"` (Nathan, 04/11). ✅ campo existe ("Pedido Bloqueado pela API"). ❓ **O pedido nasce bloqueado por padrão?** Se nascer, o Fiscal não fatura sem desbloquear (`AlterarPedidoVenda` com `bloqueado = "N"`) |
| `codigo_cenario_impostos` | inteiro | cenário de impostos da conta | cadastro | 🟡 não mandar: a documentação diz que, omitido, o Omie assume o cenário padrão. ❓ O teste confirma |
| `tipo_desconto_pedido`, `perc_desconto_pedido`, `valor_desconto_pedido` | — | — | — | 🟡 não usar: o desconto vai por item |
| `encerrado`, `enc_motivo`, `enc_data`, `enc_hora`, `enc_user` | — | — | — | ✅ existem na resposta; relacionam com o **encerramento por saldo zerado** de "Meus Pedidos" (outra frente) |
| `nao_gerar_boleto` | texto 1 | — | — | 🟡 decidir com o Financeiro |
| `cbs`, `ibs` | — | — | — | ✅ já existem no tipo (reforma tributária); não enviar, o Omie calcula |

## 3. Itens (`det`, uma linha por item)

### 3.1 Identificação (`ide`)

| Campo | O que mandar | Origem | Situação |
|---|---|---|---|
| `codigo_item_integracao` | código nosso do item, até 30 caracteres | `pedidos_itens.id` ou ordem (o exemplo do Robert usa a sequência do item, `"1"`) | ✅ obrigatório no exemplo. A pipeline **grava de volta** o `codigo_item_omie` por item (hoje chega por `ListarPedidos`). 🟡 A pipeline mapeia também o `codigo_item_integracao` para `produto_vendas.codigo_item_integracao` ([[Contratos-da-v2\|SQL-021]]); o valor repete entre pedidos e só serve junto do `codigo_pedido_omie` |
| `simples_nacional` | `"S"`/`"N"` | emissora | ❓ o Omie deduz da empresa? |
| `acao_item` | só em alteração | — | ✅ |
| `id_ordem_producao` | — | — | ❓ ver se o Omie liga o PV a uma OP dele; não é o nosso PCP |

### 3.2 Produto (`produto`)

| Campo | Tipo | Origem | Situação |
|---|---|---|---|
| `codigo_produto` | inteiro (ID do Omie) | `core.produtos.codigo_produto_omie` | ✅ exemplo. **Produto pendente (`PEND-xxxx`) não tem ID** → a proposta não vira pedido até o Fiscal cadastrar (N16-28) |
| `codigo_produto_integracao`, `codigo` | texto | — | 🟡 mandar só o ID; manter o código para exibição |
| `descricao` | texto 120 | `proposta_item.descricao` | ✅ exemplo. 🟡 **limite de 120 caracteres**: a descrição técnica da proposta pode passar; cortar com aviso na proposta; o texto inteiro fica no Hub |
| `cfop` | texto 10 | **regra fiscal** (finalidade, UF, tipo) | ✅ exemplo manda `5.102`. 🟡 **Não mandar** (Robert, 05/11): o vendedor não preenche CFOP no Omie. ❓ O teste mostra o CFOP que o Omie grava. O CFOP **não entra na comissão** (seção 5.3.1) |
| `ncm` | texto 13 | `proposta_item.ncm` | ✅ exemplo |
| `unidade` | texto 6 | `unidade_medida` | ✅ exemplo. 🟡 conferir se a UM do hub é a mesma do cadastro Omie do produto |
| `quantidade` | decimal | `quantidade` | ✅ |
| `valor_unitario` | decimal | `preco_unitario` | ✅. ❓ **Preço com ou sem imposto?** A proposta mostra "ICMS (incluso)"; o Omie, pelo exemplo, soma impostos por cima quando há IPI e ST |
| `tipo_desconto`, `valor_desconto`, `percentual_desconto` | `"V"`/`"P"` | `desconto_pct` | ✅ exemplo manda `"V"` e 0. 🟡 enviar **valor** (`V`) para evitar divergência de arredondamento |
| `valor_mercadoria`, `valor_total` | decimal | cálculo | 🟡 não mandar; conferir pela leitura de volta |
| `codigo_tabela_preco` | inteiro | — | 🟡 não usar |
| `reservado` | `"S"`/`"N"` | — | ❓ **reserva estoque no Omie**; o nosso estoque é o MES, então `"N"` |
| `ean`, `cnpj_fabricante`, `indicador_escala`, `kit`, `valor_deducao`, `valor_icms_desonerado` | — | — | 🟡 não usar |

### 3.3 Informações adicionais do item (`inf_adic`)

| Campo | O que mandar | Situação |
|---|---|---|
| `peso_bruto`, `peso_liquido` | peso do item (kg) | ✅ exemplo manda 150/150. 🔴 o hub **não guarda peso** na proposta; ❓ o Omie busca do cadastro do produto? |
| `numero_pedido_compra`, `item_pedido_compra` | liga o item de venda a um pedido de compra | ❓ **poderia ligar PV e PC no Omie**; hoje o vínculo é nosso (requisição do PCP). Não usar até testar |
| `nao_movimentar_estoque`, `nao_gerar_financeiro` | `"N"` | 🟡 conferir com o Fiscal |
| `codigo_local_estoque` | local de estoque | ❓ por unidade |
| `dados_adicionais_item` | texto para a NF | 🟡 candidato a levar norma, material e certificados da proposta |
| `codigo_cenario_impostos_item` | cenário por item | ❓ ver seção 4 |

### 3.4 Observação do item (`observacao.obs_item`)

**Não usamos** (N16-90): a especificação técnica fica só no Hub. A `descricao` do Omie tem limite de 120 caracteres; o excesso é cortado com aviso na tela do Hub, que mantém a descrição inteira.

## 4. Impostos de venda

- **Cenários e CFOP (lidos em 23/10/2026, serviço `/geral/cenarios/`):** `ListarCenarios` lista os cenários da conta (`nCodigo`, `cNome`, `padrao`, tipo de empresa, `inativo`); `ListarImpostosCenario` recebe cliente, produto e cenário e devolve **o CFOP e todas as alíquotas** (ICMS, ST, IPI, PIS, COFINS, IBS, CBS). ✅ O Omie também tem o serviço **CFOP** (`/produtos/cfop/`) e **Origem do Pedido** (`/geral/origempedido/`), ainda não lidos ❓. **Decisão do Nathan (N16-83):** o CFOP e o cenário se escolhem ao cadastrar o produto na proposta (⚠️ em 05/11 o Robert propôs **não mandar** CFOP nem cenário no primeiro pedido, porque o vendedor não os preenche; o teste decide 🟡); o CFOP já está no banco do Hub e os cenários vêm do Omie. 🔴 Falta o recurso de pipeline que sincroniza os cenários por conta. 🟡 `ListarImpostosCenario` pode ser a fonte das alíquotas **mostradas na proposta**, no lugar do `SimularImpostos`; testar qual bate com o pedido.
- O exemplo de `IncluirPedido` **não manda imposto**: o Omie calcula pelo cenário de impostos da conta. ✅
- Existe `SimularImpostos` (cliente, UF de entrega, frete, itens com cenário) que devolve ICMS, ST, IPI, PIS e COFINS **por item**. ✅
- O hub deixa o vendedor **digitar** ICMS %, IPI % e ST % em cada item e mostra "ICMS (incluso)". **Decisão do Nathan (N16-95): isso continua**: os impostos digitados vão para o pedido e o Hub não os troca pelos do Omie. ⚠️ O risco que eu apontei (o total da proposta pode diferir do que o Omie fatura) fica como **ponto de atenção**, não como regra.
- O imposto **é o que o vendedor digitou** (N16-95); o Omie não o substitui. O `SimularImpostos` e o `ListarImpostosCenario` podem servir só de **conferência opcional**. 📝 **Decidido em 03/11 (registrado pelo Robert):** o Hub **não** manda `det[].imposto`; o Omie calcula pelo cenário (a documentação diz que, omitida a estrutura, "o Omie irá identificar a regra de imposto que melhor se ajusta"). O vendedor continua digitando ICMS, IPI e ST na proposta, e o Hub não troca esses números pelos do Omie. Se o total divergir muito num tipo de operação, o conserto é no cadastro do cenário, e não no payload. ❓ Onde o Fiscal altera os impostos.
- `total_pedido` (`valor_total_pedido`, `valor_mercadorias`, impostos) existe na resposta; 🟡 usar para **conferir** o total depois da inclusão: se divergir da proposta, marcar o pedido com aviso e não liberar.
