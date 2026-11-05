---
tags: [telas, menu, experiencia-do-usuario, proposta, vendas, orcamento, compras, comissao, redundancia, auditoria-de-telas, parte]
criado: 2026-11-05
estado-em: 2026-10-29
status: proposta
dono: Nathan
parte-de: "[[Telas-e-Experiencia-do-Usuario]]"
fontes: ["av-hub develop (23/10/2026): lidos os 47 arquivos page.tsx de app/(protected)/vendas, orcamento e compras e os componentes que cada um abre (components/Propostas, Clientes, Relatorios, Suprimentos, PainelComprador, CustoItens, Configuracoes, Compras, Painel, Orcamento)", "lib/auth/devSemLogin.ts (MENU_DEV)", "av-hub docs/ENVIAR - contrato-comercial-suprimentos-telas.md", "Registro-de-Decisoes (N16-01 a N16-78)", "11-Proposta-e-Pedido-de-Venda, 12-Orcamento-Base-de-Preco, 13-Custo-Real-e-Comissao-no-Fluxo", "05-Integracoes/Mapa-IncluirPedido-Omie"]
---

# Telas de Vendas, Orçamento e Compras no modelo novo: detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[Telas-e-Experiencia-do-Usuario]] (parte 1 de 2): Como a auditoria foi feita; Texto completo e detalhe lido no código: Vendas; Texto completo e detalhe lido no código: Orçamento; Texto completo e detalhe lido no código: Compras; Painéis que a proposta deve respeitar: texto completo; Menu: tabela completa.

**Onde estamos:** ← [[Telas-e-Experiencia-do-Usuario]] (resumo e índice) · partes: **Telas-e-Experiencia-do-Usuario-Detalhe-Tecnico-1** · [[Telas-e-Experiencia-do-Usuario-Detalhe-Tecnico-2]]

## Como a auditoria foi feita

Foram lidos os 47 arquivos `page.tsx` de `app/(protected)/vendas`, `orcamento` e `compras` e os componentes que cada um abre: títulos, colunas, filtros, ações e serviços chamados. Os arquivos de PCP e Meus Pedidos foram vistos só pelo nome dos componentes (`CarteiraPrevisao`, `PainelPcp`, `PainelVendas`) ❓.

## Texto completo e detalhe lido no código: Vendas

| Tela | O que faz (texto completo) | No modelo novo (texto completo) | Detalhe lido no código |
|---|---|---|---|
| **Propostas, lista** | Mostra o resumo das propostas, com filtros por empresa, status, período, unidade e responsável. Daqui o vendedor abre uma nova proposta. | ✅ Muda: estados e rótulos (seção 4) | Resumo: Total cotado, Em aberto, Fechadas, Perdidas, Conversão. Filtros: Empresa, Status, Período, Unidade (**Mogi, Uberaba, Arujá**), Responsável. Busca por nº e cliente. Botão "Nova proposta". |
| **Proposta, formulário** | Reúne emissão, cliente, itens, condições e análise de margem. Na lateral ficam os totais e as ações. | 🔴 Será reescrita (seção 5) | Blocos Emissão, Cliente, Itens, Condições de fornecimento, Análise de margem. Lateral com Totais e ações: Salvar, Fechar itens, Reabrir, Perder, "Pedido no Omie", Duplicar, Revisões, Linha do tempo, PDF, E-mail. |
| **Proposta, "Pedido no Omie"** | Monta os dados para o vendedor **digitar no Omie à mão** e pede de volta o número do pedido. | 🔴 **Sai.** O pedido vai por API, com fila e pipeline | `PedidoOmieModal`: monta o cabeçalho e os itens para **copiar e digitar no Omie à mão**, escolhe a conta (Mogi ou Uberaba) e pede de volta o nº do pedido digitado. |
| **Clientes, lista** | Mostra cards de clientes, propostas dos últimos 90 dias e contatos atrasados. Permite exportar contatos. | ✅ Mantém | Cards Clientes, Com proposta em 90 dias, Próximo contato vencido. Filtros Status, Segmento, Próximo contato. Exportar contatos. |
| **Cliente, ficha** | Mostra dados, compradores, relacionamento e estatísticas de propostas. | ✅ Mantém. "Total fechado" e "Conversão" passam a contar **propostas aprovadas** | Dados, compradores, relacionamento (segmento, potencial, próximo contato). Estatísticas: Propostas, Última proposta, Total cotado, **Total fechado**, **Conversão**, Ticket médio. |
| **Relatório de Cotações** | Mostra totais de propostas, valor acumulado, fechadas e conversão, com Excel. | ✅ Mantém, com os novos estados | Totais: Propostas, Valor acumulado, **Fechadas**, Valor fechado, Conversão. Tabela Cliente, Responsável, Valor. Excel. |
| **Relatório Gerencial** | Mostra o resumo, a divisão por responsável, empresa e unidade, os motivos de perda e a carteira. | ✅ Mantém. "Perdidas" vira **Canceladas**. Os motivos de perda viram **motivos de cancelamento** | Resumo (Total cotado, Em aberto, Fechadas, **Perdidas**, Conversão). Por responsável, empresa e unidade (**Mogi, Uberaba, Arujá**). **Motivos de perda**. Status da carteira. Excel. |
| **Pedidos de Venda** (inativa no menu, N16-33) | Lista os pedidos **sincronizados do Omie**. O detalhe mostra a situação e as datas de cada pedido. | ✅ Continua inativa, mas **é valiosa**: já mostra os **sinalizadores do Omie** que a comissão precisa (cancelado, devolvido, devolvido parcial). É a base da fila do Fiscal (seção 4) | Pedidos **sincronizados do Omie**: nº, sequencial, inclusão, etapa, cliente, vendedor, valor, situação. Detalhe com **Autorizado, Denegado, Faturado, Cancelado, Devolvido, Devolução Parcial, Encerrado**. Datas de inclusão, previsão, faturamento, cancelamento e encerramento. Motivo e usuário do encerramento. |
| **Notas Fiscais de Saída** (inativa) | Lista as notas de saída com valores e se foi averbada. | ✅ Continua inativa | Data, nº NF, cliente, vendedor, filial, categoria, IPI, mercadorias, total, "Averbada?". |

## Texto completo e detalhe lido no código: Orçamento

| Tela | O que faz (texto completo) | No modelo novo (texto completo) | Detalhe lido no código |
|---|---|---|---|
| **Painel do Comprador** | Organiza a fila de pedidos de custo. O comprador assume, libera, responde, diz "sem fornecedor" ou cancela. | ✅ Mantém, mas **tira "Vencem hoje" e "Atrasadas"**, porque não há prazo (N16-58). Fica o tempo cronometrado | Cards Fila de hoje, Solicitações abertas, **Vencem hoje, Atrasadas**, Ofertas vencendo em 7 dias. Atribuição: Comigo, Livres na fila. Ações: Assumir, Liberar, Responder, "Sem fornecedor", Cancelar. Avisos de "Sem disputas suficientes" e de certificados vencendo. |
| **Responder solicitação** | O comprador escolhe a **oferta vigente** que vira o custo do item. O vendedor é avisado. | ✅ Mantém | O Comprador escolhe a **oferta vigente** que vira o custo do item; "o vendedor é avisado"; lança nova oferta ou responde "Sem fornecedor". |
| **Pedido de cotação** | Envia um e-mail por fornecedor da categoria, com os itens e a data de resposta. | ✅ Mantém | Um e-mail por fornecedor da categoria, com itens e "Resposta até". Busca no catálogo. Modal de análise do item: última compra, média e mínimo, cotações válidas. |
| **Ofertas de fornecedor** | Lista as ofertas e deixa lançar, importar o mapa de Compras, invalidar e exportar. | ✅ Mantém. As ofertas das OCs (ordens de compra) entram sozinhas | Lista: produto, fornecedor, preço, custo líquido, cotação, validade. Ações: Lançar oferta, **Importar mapa** (xlsx de Compras, com produtos pendentes), Importações, Invalidar, Exportar. |
| **Fornecedores, lista e ficha** | Mostra o perfil de compras, as categorias, os certificados e as ofertas de cada fornecedor. | ✅ Mantém | Busca por nome ou CNPJ, categoria. Ficha com perfil de compras (e-mail de cotação, origem do ICMS padrão, entrega certificado), categorias, certificados, ofertas. |
| **Catálogo de produtos, lista e ficha** | Lista os produtos e mostra preços e a média geral de 90 dias. Permite ligar produtos pendentes ao Omie. | ✅ Vira a **página do produto** (`B2`) | Busca por código ou trechos. **Produtos pendentes** (modal para ligar ao Omie). Ficha com preços, **média geral de 90 dias**, "pendente no Omie". |
| **Pesquisa de materiais** | Mostra o menor custo e o fornecedor vencedor de cada material. Gera o PDF "Cotação de Materiais". | ✅ Mantém. **Repete** parte do catálogo (seção 3) | Menor custo e fornecedor vencedor por material, prazo e frete, quantos cotaram. Comparativo por quantidade. PDF "Cotação de Materiais". |
| **Parâmetros de custo** | Guarda ICMS a recuperar, validade da oferta e janela do histórico. Salvar abre uma nova vigência. | ✅ Mantém | ICMS a recuperar por origem, validade padrão da oferta, janela do histórico; "salvar abre uma nova vigência". |
| **Tabela da telha** | Guarda o custo por classe e espessura, com vigência. Telhas já orçadas mantêm o custo da época. | ✅ Mantém | Custo por classe × espessura, núcleos, pinturas, com vigência; telhas já orçadas mantêm o custo da época. |
| **Custo por item** (`custo-itens`) | Mostra itens, lotes e custo médio de um pedido. | ✅ Vira "Custo real do pedido". O aviso de exemplo precisa sair quando houver dado real | Resumo do pedido, itens, **lotes**, custo médio, origem, "Cotação a conferir", "Custo completo/incompleto". Avisos **"Dados de exemplo"** e **"Custo sem impostos"**. |
| **Simulador de Orçamento** | Calcula custo, preço sugerido, margem e letra sem pedido. **Não grava.** | ✅ Existe. **Repete** a análise da proposta (seção 3) | Digita compra e venda sem pedido e vê custo líquido, preço sugerido, margem, letra e status com o motor do Simulador de Comissão. **Não grava.** |
| **Sincronização Omie** | Mostra a sincronização rodando. A automática está desligada: só roda pelo botão. | ✅ Existe na `develop`. É ferramenta de TI, **não** de usuário final ❓ | "Sincronizando agora" e "Automática desligada: só pelo botão". |
| **Guia do fluxo do custo** | Páginas explicativas "Para que serve". | 🔴 Descrevem o fluxo **antigo**. Precisam ser reescritas | `FluxoDoCusto` e `GuiaSuprimentos`: páginas "Para que serve". |

## Texto completo e detalhe lido no código: Compras

| Tela | O que faz (texto completo) | No modelo novo (texto completo) | Detalhe lido no código |
|---|---|---|---|
| **Dashboard de compras** | Mostra a fila de compras, o valor comprado em 12 meses, os atrasos e o que há a receber. | ✅ Mantém | `PainelCompras`, `ComprasDashboard`. Fila de compras: requisições abertas, em cotação, aguardando aprovação, a receber, entregas atrasadas. Valor comprado em 12 meses, por comprador, atraso por tempo, a receber por etapa. |
| **Requisições** (lista e kanban) | Lista as requisições do PCP ou manuais. Permite fechar a compra, ver a OC e cancelar com motivo. | ✅ Mantém e **ganha a tarja de pedido cancelado** | Requisições vindas do PCP ou manuais. Fechar compra, Ver OC. Filtro Unidade, Status, Ação. Arrastar no kanban. Cancelar com motivo. |
| **Nova requisição** | É o "pedido de compra interno": unidade, número do pedido de venda, produto, quantidade, prazo e finalidade. | ✅ Mantém. Com a proposta, o pedido de venda vem do hub, não do Omie | Unidade, **nº do pedido de venda**, produto, quantidade, prazo, tipo sugerido (acabado ou não), finalidade. |
| **Emitir OC** | Monta a ordem de compra com fornecedor, pagamento, itens, frete e observações. O Omie só aceita item com produto cadastrado na unidade. | 🔴 **Não tem imposto por item e não conhece a proposta.** Precisa de `C6` e `C7` (puxar da proposta, conferir e editar impostos) | `FecharCompra`, **1.869 linhas**. Campos: unidade, fornecedor, contato, previsão, condição de pagamento e parcelas, moeda, contrato, nº do pedido no fornecedor, itens (produto, qtd, valor, desconto, tipo de material, local de estoque), frete (modalidade, placa), categoria, conta corrente, projeto, observações, resumo. "O Omie só aceita item com produto cadastrado na unidade." |
| **Pedidos de venda da OC** | Responde "Para que é esta compra". O comprador **digita um pedido de venda de cada vez** e marca o que falta comprar. | ✅ Mantém. 🟡 Com a proposta, a ligação PV ↔ item de compra deixa de ser digitada | `PedidosVendaOC`: "Para que é esta compra". O comprador **digita um pedido de venda de cada vez**, vê o que falta comprar por item e marca. |
| **Ordens** (lista, kanban, detalhe) | Mostra as OCs por status e origem, com Aprovar, Reprovar e Cancelar OC. | ✅ Mantém. O detalhe ganha "compra acima do valor" (`C8`) | OC por status e origem ("Pedido feito direto no Omie: só leitura"). Detalhe com itens, parcelas, observações, histórico, comprador, PDF, Aprovar, Reprovar, Cancelar OC. |
| **Aprovações** | Mostra as OCs **acima do limite da unidade** que esperam o aprovador. | ✅ Mantém. ⚠️ **Nome igual a outra coisa**: não é a aprovação do vendedor (`C8`) | OCs **acima do limite da unidade** aguardando o aprovador: Aprovar, Reprovar com motivo. |
| **Follow-up (CCP)** | Acompanha as OCs aprovadas: confirmação do fornecedor, despacho, contatos e ocorrências. | ✅ Mantém. 📝 **CCP é parte do PCP e cuida do follow-up das compras** (N14-24) | OCs aprovadas: confirmação do fornecedor, despacho (data, NF, transportadora), contatos, ocorrências. Cards Sem confirmação, Atrasadas, Chegam em 7 dias, Com ocorrência. |
| **Pedido Omie (detalhe)** | Mostra, só para leitura, o pedido de compra **feito direto no Omie**. | ✅ Mantém | Pedido de compra **feito direto no Omie**, só leitura, com itens, "Recebido", parcelas. |
| **Histórico de compras** | Mostra as compras por conta, período, produto e fornecedor, com gráfico por mês. | ✅ Mantém. Vira aba da página do produto | Filtro Conta (Mogi, Uberaba), período, produto, fornecedor. Resumo. Gráfico por mês. |
| **Compradores** | Liga os compradores do Omie por unidade ao funcionário que emite a OC por eles. | ✅ Mantém (Cadastros/Acessos) | Compradores do Omie por unidade e o funcionário que emite a OC por eles. |

## Painéis que a proposta deve respeitar: texto completo

O **Painel PCP** e o **Dashboard de Vendas** mostram a carteira, o desvio de previsão e o **"Em avanço"**. "Em avanço" é o pedido que o diligenciador marcou como faturamento em etapas. **Meus Pedidos** e **Pedidos da Equipe** são a casa do pedido do vendedor. ❓ Foram lidos só pelo nome dos componentes.

## Menu: tabela completa

| Menu | Entradas | Observação |
|---|---|---|
| **Vendas** | Propostas · Clientes · **Meus Pedidos** · Relatórios (Gerencial, com a aba Cotações) | Meus Pedidos entra no grupo: é onde o vendedor responde `C8`. |
| **Orçamento** | **Pedidos de custo** (Painel do Comprador + Pedido de cotação) · **Produtos** (Catálogo + Pesquisa de materiais + Ofertas, com a página do produto) · Fornecedores · **Parâmetros** (custo e telha) | De 9 entradas para 4. |
| **Compras** | Requisições · Ordens · **Aprovar OC** · Follow-up (CCP) · **Reprovados** · Dashboard | "Aprovações" vira "Aprovar OC". **Sem Histórico**: vira filtro por produto em Ordens. |
| **Comissões** | O módulo atual (não muda) + Comissões da proposta (novas) | Nada do módulo atual é tocado. |
| **Cadastros ou Fiscal** | Compradores · **Fila do Fiscal** · Sincronização Omie (TI) | |
| **Ocultas** | `propostas-delegacao`, `propostas-valores`, `custo-item`, `solicitacoes-custo` | Liberam capacidade e não aparecem no menu. |
