---
tags: [omie, pedido-de-venda, incluir-pedido, api, mapa-de-campos, pesquisa, parte]
criado: 2026-11-05
estado-em: 2026-11-05
status: proposta
dono: Nathan
parte-de: "[[Mapa-IncluirPedido-Omie]]"
fontes: ["Documentação do Omie lida em 23/10/2026: https://app.omie.com.br/api/v1/produtos/pedido/ (serviço PedidoVendaProduto, método IncluirPedido e tipos complexos)", "Exemplo de IncluirPedido enviado pelo Nathan em 23/10/2026", "05-Integracoes/Estudo-Omie-API (estudo de 21/10)", "av-hub components/Propostas/PropostaForm (PedidoOmieModal.tsx, ItemProposta.tsx, PropostaForm.tsx)", "Pedido do Robert ao Nathan de 03/11/2026 e errata de 05/11/2026", "Consultas só de leitura ao Omie nas três contas em 04/11/2026 (ListarCategorias, ListarFormasPagCompras, ListarFormasPagVendas, ListarContasCorrentes)", "Dump do Avhub de 29/10/2026 (vw_faturamento_planilha, vw_comissao_master)"]
---

# Mapa do `IncluirPedido` do Omie: o que o hub manda, de onde vem cada campo e o que ainda não sabemos: detalhe técnico (2/2)

**Em uma frase:** detalhe técnico da nota [[Mapa-IncluirPedido-Omie]] (parte 2 de 2): 5. Condição de pagamento, frete, informações adicionais; 6. O que a documentação **não** responde (testes no Omie, OQ-16); 7. Dois achados que mudam o desenho; 8. O que isso muda nos contratos; Ver também.

**Onde estamos:** ← [[Mapa-IncluirPedido-Omie]] (resumo e índice) · partes: [[Mapa-IncluirPedido-Omie-Detalhe-Tecnico-1]] · **Mapa-IncluirPedido-Omie-Detalhe-Tecnico-2**

## 5. Condição de pagamento, frete, informações adicionais

### 5.1 Parcelas (`lista_parcelas.parcela[]`)

| Campo | Observação |
|---|---|
| `numero_parcela`, `valor`, `percentual`, `data_vencimento` | exemplo manda os quatro. Com `codigo_parcela = "999"` o Omie aceita parcelas à mão |
| `quantidade_dias` | alternativa a `data_vencimento` ("dias até o vencimento") — 🟡 melhor para condição do tipo 28/45: o vencimento real depende da data de **faturamento**, não da inclusão |
| `tipo_documento`, `meio_pagamento`, `nao_gerar_boleto`, `parcela_adiantamento` | 🟡 `meio_pagamento` (campo `tPag` da NF) precisa de decisão do Financeiro |

🔴 **A proposta tem a condição de pagamento como texto livre** (`condicao_pagamento`, 200 caracteres) e **outro campo separado** para a "condição (tabela de encargos)" da análise. O Omie precisa de uma condição **cadastrada** (código) ou de parcelas calculadas.

**Fonte escolhida (Nathan, 04/11/2026): a tabela `condicoes_pagamento_compras`.** O Omie tem um cadastro só de condições, exposto por dois endpoints (`ListarFormasPagCompras` e `ListarFormasPagVendas`). Comparei as listas completas, página a página, em 04/11: Mogi 331 e 331, Uberaba 42 e 42, HRM 134 e 134, sem condição só de um lado e sem diferença de código nem de conteúdo ✅. Por isso **não há recurso novo de venda** e o `codigo_parcela` vem da tabela de compras (`codigo_omie varchar(3)`). Risco aceito: se o Omie um dia separar os cadastros, a proposta passa a oferecer condições de compra. A coluna `encargos` que o Gustavo vai criar (dado do simulador, inerte no `IncluirPedido`) fica nessa tabela e o sync não a sobrescreve (`PROTECTED_COLUMNS`) 🟡.

**Serviço de condições de pagamento do Omie (lido em 23/10/2026):** `https://app.omie.com.br/api/v1/geral/parcelas/`. ✅

| Método | Entrada | Saída |
|---|---|---|
| `ListarParcelas` | `pagina`, `registros_por_pagina`, `filtrar_por_descricao`, `ordenar_por`, `apenas_importado_api` | por condição: `nCodigo` (texto de 3, é o `codigo_parcela` do pedido), `cDescricao` (até 30) e `nParcelas` (quantidade) |
| `IncluirParcela` | `cParcela` (a **descrição** da parcela a criar) | `cCodParcela` (código gerado, 3), `cDesParcela` (descrição, até 200), `cCodStatus` (`"0"` é sucesso) |

**Precedente no nosso código: é o mesmo esquema da ordem de compra.** ✅ (lido em `omie-elt-pipeline/src/omie/ordemCompraOmie.ts:305-326`, `resources/condicoesPagamentoCompras.ts` e `api-acos-vital/.../condicoes_pagamento_compras`)

| | **Ordem de compra** (já em produção) | **Pedido de venda** (a construir) |
|---|---|---|
| Campo do Omie | `cCodParc` (ex.: `"U10"`) | `codigo_parcela` (ex.: `"999"`) |
| Tamanho | código de 3 caracteres | código de 3 caracteres (`string3`) |
| Catálogo | `ListarFormasPagCompras`, serviço `/produtos/formaspagcompras/` | o mesmo cadastro: `ListarFormasPagVendas` (`/produtos/formaspagvendas/`) traz as mesmas condições ✅ |
| Por conta Omie | sim, tabela `condicoes_pagamento_compras` com `codigo_empresa` + `codigo_omie` | sim, **a mesma tabela** ✅ |
| O que o catálogo traz | código, descrição, `nQtdeParc`, **`cListaParc`** (dias, ex. "30,40,50") e `nDiasParc` | código, descrição e `nParcelas`; **não traz a lista de dias** |
| Pipeline sincroniza | sim, "sempre ligado", camada lenta | **sim**, é o mesmo recurso ✅ |
| O que a OC/pedido manda | **só o código e a quantidade** (`cCodParc` + `nQtdeParc`), sem parcelas | 🟡 o mesmo: **só `codigo_parcela`**, sem `lista_parcelas` |

**O teste de 05/10/2026 em Mogi (comentário em `ordemCompraOmie.ts`) vale para a venda:** na OC, mandar `parcelas_upsert` fez o Omie **trocar a condição para 999** ("informar parcelas"); sem mandar as parcelas, a condição `S18` ficou `S18` e o Omie gerou 30/60/90 dias pelos prazos dela. Ou seja, o `"999"` com `lista_parcelas` do exemplo da documentação **faz o pedido perder a condição de pagamento**, e o código real é o caminho que o Nathan já escolheu na compra. ❓ Falta confirmar na venda (o comportamento é o do Omie, mas o método é outro).

O que isso resolve e o que não resolve:

- ✅ **A condição é cadastro do Omie, por conta.** O código (`nCodigo`) de "28/45" pode ser **diferente em Mogi e em Uberaba**. O hub não pode gravar um código único: precisa guardar **um código por conta**, lido do `ListarParcelas`.
- ✅ **A lista só traz descrição e número de parcelas**, não os dias nem os percentuais. Então o vínculo entre a condição do hub (a chave da tabela de encargos, ex. `28/45`) e a do Omie é pela **descrição**. 🟡 Se a descrição do Omie for "28/45 DDL" e a do hub "28/45", o casamento falha: é preciso uma tabela de **de-para** (condição do hub × descrição Omie por conta), preenchida uma vez e conferida.
- ✅ **O `IncluirParcela` cria a condição só com a descrição.** ❓ Não sabemos se o Omie **interpreta** o texto (ex.: lê "28/45" como duas parcelas em 28 e 45 dias) ou só guarda o nome; só o teste diz. 🟡 Não criar condição por API sem esse teste: criar duplicada ou errada polui o cadastro da empresa inteira.
- 🟡 **Fluxo proposto:** (1) a pipeline já sincroniza as condições de cada conta em `condicoes_pagamento_compras`; (2) a proposta oferece **apenas** as condições que existem **na conta da empresa emissora** (e têm encargo na tabela do motor); (3) ao transformar em pedido, `codigo_parcela` recebe o `nCodigo` da conta; (4) condição digitada à mão que não existe na lista **não é aceita** ("peça ao Financeiro para cadastrar no Omie").
- ❓ **Condição à vista, "A combinar" e "999":** a lista pode ter códigos especiais; o `"999"` do exemplo é "parcelas informadas no pedido". Conferir no `ListarParcelas` da conta.
- 🔴 **O catálogo de venda não traz os dias de cada condição** (o de compra traz `cListaParc`). Com `codigo_parcela` cadastrado, o Omie calcula os vencimentos sozinho (na OC o prazo contou a partir da data de previsão; ❓ na venda, a partir de quê?). 🟡 O hub **não precisa** dos dias para criar o pedido. Só precisaria para **mostrar o vencimento na proposta ou no PDF**; nesse caso: ou se lê `ConsultarPedido` depois de incluir, ou se cadastra os dias no de-para (condição do hub × código Omie × dias).
- 🟡 **Decisão proposta:** usar o **código real** (`codigo_parcela`) e **não mandar `lista_parcelas`**, igual à OC. `"999"` com parcelas só para condição especial combinada com o cliente que não exista no cadastro, e então a perda da condição é aceita e avisada.

### 5.2 Frete (`frete`)

| Campo | Observação |
|---|---|
| `modalidade` | `"9"` no exemplo (sem frete). Os valores do Omie seguem a NF-e: 0 emitente, 1 destinatário, 2 terceiros, 3 e 4 próprio, 9 sem frete. 🟡 mapear o incoterm do hub (CIF, FOB, …) para a modalidade; ❓ confirmar a tabela na documentação do campo |
| `valor_frete`, `valor_seguro`, `outras_despesas` | 🟡 o frete da proposta (CIF) vai em `valor_frete` |
| `codigo_transportadora`, `placa`, `peso_*`, `quantidade_volumes` | 🟡 opcionais; transportadora não existe na proposta |

### 5.3 Informações adicionais (`informacoes_adicionais`)

| Campo | O que mandar | Origem | Situação |
|---|---|---|---|
| `codigo_categoria` | categoria de receita (ex. `1.01.01`) | **o vendedor escolhe**, de uma lista filtrada pela unidade emissora | 📝 lista por unidade (Nathan, 04/11). ✅ `core.categorias` tem `codigo_empresa` e `GET /categorias?codigo_empresa=` filtra por unidade. 🔴 A rota só sabe filtrar despesa (`tipo=despesa`): falta `tipo=receita` (lançáveis, ativas, sem `nao_exibir`) e o campo na proposta |
| `codigo_conta_corrente` | conta corrente de recebimento | ⚠️ **em aberto:** omitir (Robert, 05/11) ou lista por unidade (Nathan, 04/11) | 🟡 O vendedor não preenche conta no Omie, e ela define onde nasce o título a receber. O teste cria o pedido **sem** `codigo_conta_corrente` e vê o que o Omie grava. ✅ `core.contas_correntes` já sincroniza por unidade (`ListarContasCorrentes`); a HRM tem 18, uma inativa |
| `consumidor_final` | `"S"`/`"N"` | `finalidade = CONSUMO_FINAL` | 🟡 |
| `enviar_email` | `"N"` | fixo | ✅ exemplo (não mandar boleto por e-mail no pedido) |
| `codVend` | ID do vendedor no Omie | `pedido_venda.codigo_vendedor_omie` | ✅ já existe no desenho; **necessário para a comissão e para o relatório por vendedor**. 📝 **Bloqueante:** `pedidosVendas.ts` pula o registro sem `codigo_vendedor_omie`, então o pedido existiria no Omie e sumiria do Hub, de `produto_vendas` e da comissão, sem erro. O vendedor resolvido na unidade é condição para transformar a proposta em pedido (Robert, 03/11) |
| `codProj` | projeto | — | 🟡 projeto de venda; ver "Projeto" (OQ-44) |
| `numero_pedido_cliente` | nº da requisição/pedido do cliente | `numero_requisicao_cliente` | ✅ existe na proposta |
| `numero_contrato`, `contato` | — | — | 🟡 `contato` pode levar o comprador |
| `dados_adicionais_nf` | texto da NF | `observacoes`? | ❓ o que da proposta deve sair na NF |
| `meio_pagamento`, `tipo_documento`, `nfRelacionada`, `outros_detalhes` | — | — | 🟡 `outros_detalhes.cNatOperacaoOd` (natureza da operação) e local de retirada/entrega só se necessário |

### 5.3.1 Categoria: as listas das três contas e o efeito na comissão

**As categorias de receita (`1.01.*`) mudam de uma conta para outra** (consulta só de leitura ao `ListarCategorias`, 04/11/2026) ✅. O código `1.01.01` existe e está ativo nas três, mas o nome muda; por isso a tela mostra o nome da unidade e o Hub guarda o código.

| Código | Mogi | Uberaba | HRM |
|---|---|---|---|
| `1.01.01` | Venda de Cliente | Venda de Cliente | Venda de Mercadoria Fabricadas |
| `1.01.96` | Venda Cliente - Refaturamento (ativa) | Venda Cliente - Avanço (**inativa e oculta**) | `<Disponível>` (**inativa e oculta**) |
| `1.01.99` | Cobranças Jurídicas | **Venda Cliente - Refaturamento** (ativa) | Revenda de Mercadoria |
| `1.01.03` | Venda de Sucata | Venda para Coligadas (inativa) | Venda de Sucata |

- **O `1.01.96` não serve como padrão:** só vale em Mogi. Nas outras duas está inativo e oculto, e o Omie recusaria o pedido ou o lançaria no lugar errado.
- A lista de venda deve trazer só categorias de **receita, lançáveis e ativas**; senão aparece o grupo `1.01 - Receitas Diretas`, que só agrupa.
- **A categoria decide se o pedido gera comissão.** ✅ Na cascata do grupo da `vw_faturamento_planilha`, o pedido cai em **G6** quando a categoria do pedido é o código literal `'1.01.96'` (e a observação não tem `refat`), e a `core_comissionamento.vw_comissao_master` só lê `grupo IS NULL`. A categoria que o Hub manda em `informacoes_adicionais.codigo_categoria` entra direto nessa regra. Oferecer "Refaturamento" entre as opções é oferecer um jeito de zerar a própria comissão: não se bloqueia (refaturamento é operação legítima), mas 🟡 a tela mostra a consequência na hora de escolher.
- **A regra não olha a unidade** ✅ (o literal `'1.01.96'` aparece em cerca de 14 pontos de views e funções do dump de 29/10). O refaturamento de Uberaba é o `1.01.99`, que **não** cai em G6; ele só é excluído pela outra porta da regra (`refat` ou `reaft` na observação da venda, e só quando não há refaturamento com referência válida). Ver [[Riscos]] (RS-022) e [[Pontas-Soltas]] (PS-040).
- **O CFOP não entra na comissão** ✅ (errata do Robert, 05/11, conferida no dump de 29/10). A cascata do grupo não tem CFOP. Ele aparece em três lugares: a coluna informativa `cfop` da planilha (`string_agg`), o `valor_nao_permitido` (soma dos itens fora da lista fixa de 18 CFOPs, coluna e não filtro) e o CTE de itens, que descarta item de CFOP nulo. O único efeito concreto do CFOP nulo é que o `valor_itens` da nota perde aquela parcela, e o `valor_itens` é o segundo fallback da base da comissão (`COALESCE(valor_faturado_item, valor_itens, total_nota_fiscal_ajustado)`). Com simulação, a base é `valor_faturado_item` e o CFOP nulo é irrelevante. Conferir a lista curada `core_vendas_faturamento.cfop` continua valendo, mas não bloqueia o primeiro pedido.

Consulta (só leitura) para dimensionar o vazamento de Uberaba. Aplica o `grupo IS NULL` e o `faturado` da master, mas não as listas negras da comissão, então o resultado é um teto. Os nomes das colunas vêm do dump de 29/10:

```sql
SELECT u.nome_fantasia                                        AS unidade,
       count(DISTINCT f.pedido)                               AS pedidos_na_base,
       count(DISTINCT f.pedido) FILTER (WHERE f.obs_pedido ~* 'refat|reaft')
                                                              AS com_refat_na_obs,
       count(DISTINCT f.pedido) FILTER (WHERE f.obs_pedido IS NULL
                                           OR f.obs_pedido !~* 'refat|reaft')
                                                              AS sem_refat_na_obs,
       round(sum(f.total_nota_fiscal), 2)                     AS valor_total_nf
  FROM core_vendas_faturamento.vw_faturamento_planilha f
  JOIN core.unidades u ON u.id = f.codigo_empresa
 WHERE f.codigo_categoria_pedido = '1.01.99'
   AND f.grupo IS NULL
   AND f.faturado = true
   AND f.deleted_at IS NULL
   AND f.pedido IS NOT NULL
   AND f.vendedor IS NOT NULL
   AND f.data_emissao >= date_trunc('month', now()) - interval '12 months'
 GROUP BY u.nome_fantasia
 ORDER BY 1;
```

Em Uberaba todo pedido com `1.01.99` é refaturamento por definição; `sem_refat_na_obs` é o número que importa. Mogi e HRM entram só para comparar (lá o `1.01.99` não é refaturamento).

### 5.4 Observações (`observacoes.obs_venda`)

**Não usamos** (decisão do Nathan, 23/10): os dados que o Hub tem e o Omie não (Qualidade, faturamento em partes, previsões, requisitos, moeda de origem) **ficam só no Hub**. O Omie recebe o que ele precisa para faturar e nada mais.

## 6. O que a documentação **não** responde (testes no Omie, OQ-16)

**Decisão do Nathan (N16-82): os testes ficam para depois que as telas estiverem prontas**; cadastra-se pelas telas e vão-se cortando as rebarbas ou acrescentando o que falta, como foi feito com a OC. Já respondidos: o Omie **aceita o nosso `numero_pedido`** (item 2); o vencimento conta do **faturamento** (item 9, provisório); o catálogo de condições é **por unidade** (as três contas são puxadas e cada unidade vê a sua); apagar o pedido no Hub apaga no Omie e o código de integração pode ser reutilizado (item 12). Sem ambiente de teste, os testes usam cadastros TESTE no ambiente real e devem ser feitos por quem tem acesso, um por vez:

1. **Mínimo obrigatório:** qual é o menor `IncluirPedido` que o Omie aceita em Mogi, em Arujá e em Uberaba (as três contas podem exigir coisas diferentes).
2. **`numero_pedido` próprio:** ✅ o Omie aceita o nosso número (N16-82).
3. **Bloqueio:** o pedido incluído por API nasce `bloqueado`? O Fiscal consegue faturar sem mexer? 📝 O primeiro teste manda `bloqueado = "S"` (Nathan, 04/11).
4. **CFOP, cenário e conta corrente:** se não mandarmos `cfop`, `codigo_cenario_impostos` nem `codigo_conta_corrente`, o Omie preenche certo? 🟡 O teste do item 4 cria o pedido sem os três e confere com um pedido digitado à mão.
5. **Preço com ou sem imposto:** o `valor_unitario` é a base e o Omie soma IPI e ST por cima? O total do pedido bate com o total da proposta?
6. **`SimularImpostos`** dá o mesmo valor do pedido incluído?
7. **Peso:** o Omie preenche `peso_bruto`/`peso_liquido` do cadastro do produto?
8. **Descrição:** o que acontece com descrição acima de 120 caracteres?
9. **Parcelas:** com `codigo_parcela` cadastrado, o Omie calcula o vencimento a partir do **faturamento**? `quantidade_dias` conta a partir de quê (inclusão ou faturamento)? `"999"` com `lista_parcelas` × condição cadastrada. O `IncluirParcela` interpreta a descrição ("28/45") ou só a guarda? O código de uma mesma condição é diferente em Mogi e em Uberaba?
10. **Moeda:** ver abaixo.
11. **Cancelamento:** `CancelarPedidoVenda` (serviço `pedidovendafat`) e `ExcluirPedido`: o que cada um faz num pedido não faturado e o que o `ListarEtapasPedido` devolve (`cCancelado`, data, usuário).
12. **Reenvio:** repetir o `IncluirPedido` com o mesmo `codigo_pedido_integracao` devolve erro ou o pedido existente?
13. **Sequencial:** criar um sequencial (faturar em partes) por `IncluirPedido` com `cabecalho.sequencial`, com itens e quantidades parciais; ver se o valor sai do original e volta ao cancelar. Testar quando a tela de "Faturamento em partes" existir (N16-92, N16-93).

## 7. Dois achados que mudam o desenho

1. **O `IncluirPedido` não tem campo de moeda.** ✅ (nenhum campo de moeda ou cotação no cabeçalho, no item ou no total, nesta documentação). Proposta em USD ou EUR precisa virar **reais** antes de ir ao Omie, pela PTAX do dia da aprovação (N16-13, N16-27). 🟡 O contrato precisa dizer: a proposta guarda moeda e câmbio; o **pedido do hub e o do Omie ficam em reais**, com o valor convertido congelado e o câmbio gravado. Existe o bloco `exportacao` (`nao_exportacao`, local de embarque, UF, local de despacho) para cliente estrangeiro. ❓ Testar com cliente estrangeiro de teste.
2. **O Omie recalcula impostos.** O total da proposta (digitado) e o total da nota (calculado) podem divergir. A solução proposta é a da seção 4: mostrar e conferir pelo Omie.

## 8. O que isso muda nos contratos

- **Pedido no Hub:** `pedidos` precisa guardar `valor_total_omie` (conferência), `status_etapa_omie`, a resposta de `ConsultarPedido` em JSON para auditoria, o câmbio usado e o `valor_frete`/`modalidade_frete` já mapeados. 🟡
- **Conferência na pipeline:** a pipeline lê o pedido de volta (`ConsultarPedido`) depois de incluir e compara total, itens e `codigo_item_omie`; divergência marca o pedido com aviso e **não libera**.
- **Condições de pagamento de venda por conta:** 📝 decidido (Nathan, 04/11): fica só `condicoes_pagamento_compras`, sem recurso novo (ver o início da seção 5.1). Falta o de-para com a chave da tabela de encargos do motor, e a coluna `encargos` (Gustavo). 🟡
- **Categoria, conta corrente, projeto e etapa já são sincronizados** pela pipeline (`categorias`, `contasCorrentes`, `projetos`, `etapasFaturamento`, `vendedores`). ✅ Não é preciso digitar códigos: a configuração por conta **escolhe** da lista sincronizada. 🟡 O que falta é guardar **qual** categoria, conta corrente e cenário o pedido de venda usa em cada conta.
- **Configuração por conta Omie** (nova tabela ou parâmetros): `codigo_categoria`, `codigo_conta_corrente`, `codigo_cenario_impostos`, etapa inicial e local de estoque, **por conta** (Mogi e Uberaba). 🔴 hoje não existe lugar.
- **Proposta:** ver [[Telas-e-Experiencia-do-Usuario]] para o que isso muda na tela (condição de pagamento escolhida de uma lista, imposto vindo do Omie, destino derivado do cliente).

## Ver também

[[Estudo-Omie-API]] · [[01-Proposta-de-Venda]] · [[Telas-e-Experiencia-do-Usuario]]
