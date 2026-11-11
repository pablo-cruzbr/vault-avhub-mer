---
tags: [projeto, equipe, divisao]
criado: 2026-10-14
atualizado: 2026-11-11
status: vigente
dono: Nathan
fontes: [v1 05-Pessoas-e-Equipe/Equipe-Projeto, v1 Cronograma-2-Meses §3.2 e §3.4, v1 Registro-de-Decisoes #32 #33 #33b, git log dos repositórios em 14/10/2026 e em 29/10/2026, Registro-de-Decisoes N16-09, N16-15, N16-117, N16-118, N16-119, N16-157 e N16-158]
---

# Equipe e divisão

**Em uma frase:** são quatro pessoas de TI: Nathan coordena e gerencia a equipe, é dono do Circuito de Compra e ajuda o Robert em cada processo; Robert é dono de 13 das 15 raias do fluxo 0b; Pablo, desenvolvedor júnior, é dono do Orçamento com o acompanhamento do Robert; e Gustavo é o DBA e a API de todo o sistema (N16-157).

**Quando consultar esta nota:** quando você precisar saber quem decide, quem constrói e a quem perguntar sobre cada parte.

Os nomes completos vêm do `git log`.

## Dono de cada raia do fluxo 0b

Decisão do Nathan de 11/11/2026 (N16-157). Ser dono não quer dizer fazer sozinho: o Nathan coordena, gerencia a equipe e ajuda o Robert em cada processo, porque não é válido nem justo deixar as raias só com ele. O Pablo é desenvolvedor júnior, e por isso não fica como dono sozinho: o Orçamento tem o acompanhamento do Robert. O banco e a API são do Gustavo em todas as raias.

| Raia | Nota | Dono |
|---|---|---|
| 01 Proposta de Venda | [[01-Proposta-de-Venda]] | Robert |
| 02 Orçamento (base de preço) | [[02-Orcamento-Base-de-Preco]] | Pablo, com acompanhamento do Robert |
| 03 Pedido de Venda e Liberação | [[03-Pedido-de-Venda-e-Liberacao]] | Robert |
| 04 PCP (triagem e destinação) | [[04-PCP-Triagem-e-Destinacao]] | Robert |
| 05 Estoque · atendimento | [[05-Estoque-Atendimento]] | Robert |
| 06 Circuito de Compra | [[06-Circuito-de-Compra]] | Nathan |
| 07 Recebimento | [[07-Recebimento]] | Robert |
| 08 Qualidade de entrada | [[08-Qualidade-Entrada]] | Robert |
| 09 Estoque · entrada do lote | [[09-Estoque-Entrada-do-Lote]] | Robert |
| 10 Produção e Roteiro | [[10-Producao-e-Roteiro]] | Robert |
| 11 Qualidade de saída | [[11-Qualidade-Saida]] | Robert |
| 12 Estoque · despacho | [[12-Estoque-Despacho]] | Robert |
| 13 Expedição | [[13-Expedicao]] | Robert |
| 14 Fiscal · Omie | [[14-Fiscal-Omie]] | Robert |
| 15 Custo Real e Comissão | [[15-Custo-Real-e-Comissao]] | Robert |

A API do MES (`api-pcp`) continua com o Robert, acompanhado pelo Gustavo (N16-158).

## Quem faz o quê

| Pessoa | Papel | O que toca |
|---|---|---|
| **Nathan** | Coordenador de TI e arquiteto do ERP. Coordena e gerencia a equipe e ajuda o Robert em cada processo (N16-157). É o dono deste vault, das decisões e do pipeline Omie 📝 | Dono da raia 06 Circuito de Compra (N16-157). Telas do av-hub (o front e o BFF, a camada que liga o front à API), o `omie-elt-pipeline`, os contratos e a coordenação. Faz as telas de Compras e a organização do código do HUB. **Desde 11/11 o pipeline do pedido de venda e as telas da Comissão nova passam ao Robert** (N16-157, supera em parte a N16-15) |
| **Gustavo M. de Farias** | Colega, DBA (administrador de banco de dados) | **DBA e API de todo o sistema** (N16-157). Banco e API do av-hub (`api-acos-vital`): migrations, `auth.*`, funções, envio fixo da OC, chaves de serviço do MES e da pipeline (L6) e `exclusionSync`. Revisa e aplica no banco o módulo comercial e o Orçamento e a comissão nova (`core_comissao`, N16-143) (N16-15). Acompanha a API do MES (`api-pcp`), que é do Robert (N16-158) |
| **Robert Wilson** | Colega, fullstack sênior | **Dono de 13 das 15 raias do fluxo 0b** (todas menos 02 e 06; N16-157), com o Nathan ajudando em cada processo. O MES inteiro (`api-pcp` e `app-pcp`): Recebimento, carga inicial em lote (G1), baixa no despacho, D11 (leitor 2D e posto de recebimento) e I1/J2/J5. Também o custo obrigatório em todo lote e o `GET /itens/custo` (N16-09, feito na `develop` em 27/10). **Desde 28/10 conduz o módulo comercial na `api-acos-vital`** (N16-117) e troca o backend das telas de proposta (N16-118, N16-119); já criou as rotas `/comercial/*` de cadastros, clientes, parceiros e propostas. **Desde 11/11 também o Fiscal · Omie (pipeline do pedido de venda) e o Custo Real e Comissão** (N16-157). Acompanha o Pablo no Orçamento |
| **Pablo Cruz** | Colega, desenvolvedor júnior (N16-157) | Dono da raia 02 Orçamento, com acompanhamento do Robert (N16-157). Criou o módulo Comercial & Suprimentos (a `api-comercial`, removida do av-hub em 06/11/2026 (PR #261, `dd9d729`); legível em `git show f7d8d7f:api-comercial/<arquivo>`). **Desde 28/10 acompanha** o módulo comercial, que o Robert conduz, e cuida do Orçamento, com a supervisão do Robert. Ele saiu do MES em 07/10 |

Atribuições decididas: Pablo no Comercial & Suprimentos e Robert no MES 📝 (decisões #32 e #33 do Registro do v1), reafirmadas em 14/10. Em 28/10 o Nathan passou a condução do módulo comercial para o Robert, com o Pablo acompanhando (N16-117) ([[Registro-de-Decisoes]]). Em 11/11 o Nathan definiu o dono de cada raia do fluxo 0b (N16-157, tabela acima). O detalhe de repositórios está em [[Sistemas-e-Responsabilidades]].

## O que cada pessoa decide e entrega

| Quem | Decide | Entrega neste vault |
|---|---|---|
| Nathan | Regras de negócio e fluxo; nomes de tela; escopo; prioridade; coordenação da equipe | Raia 06 Circuito de Compra, telas de Compras, BFF, [[Backlog-por-Frente]] da frente front, aprovação dos contratos; apoio ao Robert em cada processo |
| Gustavo | Modelo de banco, funções e rotas da API; chaves de serviço | Migrations (`047b`, `046b`, `035b`), mapa de `auth.rotas_telas`, SQL dos contratos |
| Robert | Modelo e regras do MES; telas do `app-pcp`; rotas do módulo comercial na `api-acos-vital`; as raias de que é dono (N16-157) | Documento de retirada, `lote_custo`, feed `/fluxo/eventos`, job do contrato 004 (feito, K4), rotas e telas da proposta, pipeline do pedido de venda no Omie e motor e telas da comissão |
| Pablo | Orçamento, com o acompanhamento do Robert | Regras do legado a portar ([[Mapa-do-Modulo-do-Pablo]]) e as telas de Orçamento |

## Risco: capacidade do Robert

O plano pede mais trabalho do Robert do que ele consegue entregar no prazo. O Ciclo 1 só fecha em 18/02/2027 por causa disso. Ele chegou a ser 21/01/2027, e o Ciclo 2 começa em 19/02/2027 (N14-30 e N14-32; com BL-007, BL-049 e BL-050 (N16-145): 36,1 pd e 03/03/2027 a 75% de foco; o Robert valida). **Desde 11/11 o Robert também é dono da Proposta, do Pedido, do Fiscal · Omie e da Comissão (N16-157)**, cerca de 62 pd a mais (43 a 81). Sozinho, o fim do plano vai a 28/03/2028; com o Nathan desenvolvendo junto em todo o processo (40% de foco), a 20/10/2027 🟡 (o Robert valida). Conta em [[Capacidade-do-Robert]]; marcos em [[Cronograma]]; risco em [[Riscos]] (RS-004).

## Quem usa o sistema (perfis de uso, não de desenvolvimento)

| Ator | Onde atua | Nota |
|---|---|---|
| Vendedor, Gerente (equipe) | HUB: Liberar Pedidos, Pedidos da equipe | [[03-Pedido-de-Venda-e-Liberacao]] |
| PCP e Almoxarife (setor Estoque) | `app-pcp`: Triagem, Destinação, Atendimento | [[04-PCP-Triagem-e-Destinacao]], [[05-Estoque-Atendimento]] |
| Comprador (livre até R$ 30 mil), Gerente de Compras (aprova acima de R$ 30 mil) | HUB: Compras | [[06-Circuito-de-Compra]] |
| CCP (acompanhamento de compras) | HUB Follow-up; MES Compras · CCP (leitura) | O pessoal do CCP faz parte do PCP e acompanha as compras. Compras acessa só para ler. Havendo ocorrência, o CCP interage aprovando ou não 📝 (Nathan, 14/10). O perfil será criado em breve: tarefa cadastral simples, sem bloqueio de desenho (Nathan, Gustavo; N14-24) |
| Recebimento (doca), Qualidade | `app-pcp` | [[07-Recebimento]], [[08-Qualidade-Entrada]], [[11-Qualidade-Saida]] |
| Operador de fábrica, Expedição | `app-pcp` | [[10-Producao-e-Roteiro]], [[13-Expedicao]] |
| Fiscal | Omie | Emite a nota e separa o pedido em sequenciais para faturar em partes. Informa a devolução parcial ([[14-Fiscal-Omie]], N16-92, N16-74) |
| Orçamento (setor orçamentário, novo; o Moisés é uma das pessoas) | HUB: Orçamento | Cota com fornecedores e mantém a base de preço de compra com histórico. O vendedor só consulta ([[02-Orcamento-Base-de-Preco]], N16-104) |
| Gerência (João Vitor, Sérgio Vital) | Fora do sistema neste ciclo | Aprova desconto e margem da proposta fisicamente. Recebe de Compras os casos de compra acima do valor reprovados pelo vendedor (N16-12, N16-66) |
| Controladoria (Michele) | HUB: Operações | Decide a comissão ao fim, com o custo real. Tem a visão geral e os relatórios ([[15-Custo-Real-e-Comissao]], N16-10, N16-50) |
| Marketing | HUB: calendário | Cadastra as exceções do calendário da unidade (feriados e dias úteis), usadas na previsão de faturamento (N16-104) |

## Tarefas de cadastro (não são desenvolvimento)

Nathan e Gustavo fazem em breve, sem bloquear o desenho 📝 N14-24:

- ❓ o **perfil CCP** (BL-017): criado pelo Nathan em 30/10/2026;
- ❓ o **vínculo de usuários à Gerência de Compras**: feito pelo Nathan em 30/10/2026 (RS-015);
- ❓ o vínculo de compradores a funcionários (BL-045): feito pelo Nathan em 30/10/2026;
- o perfil **orçamentista**, que também precisa existir (N16-59).

Permissões por perfil: [[RBAC-e-Permissoes]]. Atores nos casos de uso: [[Casos-de-Uso|Diagrama-Casos-de-Uso]].

## Detalhe técnico

### Foco e capacidade de cada pessoa

Foco e capacidade são premissa do plano de 21/09, não alocação registrada em RH 🟡. Fonte: [[Cronograma]].

| Pessoa | Foco no plano | Capacidade S1–FC |
|---|---|---|
| Nathan | 40% | 16,8 pd |
| Gustavo | 60% | 25,2 pd |
| Robert | 75% | 31,5 pd |
| Pablo | 75% | 31,5 pd (hoje fora da conta do plano) |

### Evidência no git

Desde 15/09/2026, em 14/10: os commits do MES são do Robert (28 no `api-pcp`, 37 no `app-pcp`). Os do Pablo no MES (9 e 17) são anteriores à reatribuição. Os do Comercial & Suprimentos no HUB são do Pablo (258 em 14/10, 348 em 29/10) ✅. Desde 28/10 os commits das telas de proposta no HUB e das rotas `/comercial/*` na API são do Robert ✅ (git, 29/10). Detalhe em [[Sistemas-e-Responsabilidades]].

### Conta da capacidade do Robert

Com G1, D11, I1, J2, J5 e D12 no Robert e o custo do lote (K3 a K6) somado, o plano fecha em **déficit de 16,1 pd** no Ciclo 1 (**32,6 pd desde 15/10**, com o N14-29, e o Nathan aceitou deslocar a data: N14-30). O planejado é 64,85 pd contra 48,75 pd de capacidade. A conta não inclui a baixa no despacho do Estoque, que não tem pd dimensionado 🟡. As estimativas são minhas, ±30%, e o Robert valida. **11/11/2026:** o Robert validou a conta de 36,1 pd e 03/03/2027; a G1 (carga em lote) sai do Ciclo 1 até o setor responsável dar a data do levantamento (N16-156), e o BL-003 (I1 a I3 e I7 da Torre, ~14 pd) passa para depois do Ciclo 1 sem mudar o fim.

Consequência: o Ciclo 1 só fecha em 21/01/2027 e o Ciclo 2 começa em 22/01/2027. **Desde 15/10, as datas são 18/02/2027 e 19/02/2027** (N14-30 e N14-32; com BL-007, BL-049 e BL-050 (N16-145): 36,1 pd e 03/03/2027 a 75% de foco; o Robert valida).
