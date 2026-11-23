---
tags: [projeto, equipe, divisao]
criado: 2026-10-14
atualizado: 2026-11-23
status: vigente
dono: Nathan
fontes: [v1 05-Pessoas-e-Equipe/Equipe-Projeto, v1 Cronograma-2-Meses §3.2 e §3.4, v1 Registro-de-Decisoes #32 #33 #33b, git log dos repositórios em 14/10/2026 e em 29/10/2026, Registro-de-Decisoes N16-09, N16-15, N16-117, N16-118, N16-119, N16-157, N16-158, N16-168, N16-169 e N16-170]
---

# Equipe e divisão

**Em uma frase:** são quatro pessoas de TI: Nathan coordena e gerencia a equipe, é dono do Circuito de Compra e do Orçamento e ajuda o Robert em cada processo; Robert é dono de 13 das 15 raias do fluxo 0b; Pablo é analista e não desenvolve; e Gustavo é o DBA e a API de todo o sistema (N16-157, N16-168). O Comercial é desenvolvido só pelo Nathan e pelo Robert, com prazo em 01/12/2026 (N16-169, N16-170).

**Quando consultar esta nota:** quando você precisar saber quem decide, quem constrói e a quem perguntar sobre cada parte.

Os nomes completos vêm do `git log`.

## Dono de cada raia do fluxo 0b

Decisão do Nathan de 11/11/2026 (N16-157), ajustada em 17/11/2026 (N16-168, N16-169) e em 19/11/2026 (N16-180, o Estoque com o Nathan). Ser dono não quer dizer fazer sozinho: o Nathan coordena, gerencia a equipe e ajuda o Robert em cada processo, porque não é válido nem justo deixar as raias só com ele. Desde 17/11 o Pablo é analista e não desenvolve, e o Nathan ficou dono do Orçamento. Na raia 15, o Robert faz o motor da comissão e o custo por evento, e o Nathan faz as telas (veja "Comercial: quem faz o quê" abaixo). O banco e a API são do Gustavo em todas as raias.

| Raia | Nota | Dono |
|---|---|---|
| 01 Proposta de Venda | [[01-Proposta-de-Venda]] | Robert |
| 02 Orçamento (base de preço) | [[02-Orcamento-Base-de-Preco]] | Nathan (N16-168); o Pablo apoia como analista |
| 03 Pedido de Venda e Liberação | [[03-Pedido-de-Venda-e-Liberacao]] | Robert |
| 04 PCP (triagem e destinação) | [[04-PCP-Triagem-e-Destinacao]] | Robert |
| 05 Estoque · atendimento | [[05-Estoque-Atendimento]] | Nathan (N16-180) |
| 06 Circuito de Compra | [[06-Circuito-de-Compra]] | Nathan |
| 07 Recebimento | [[07-Recebimento]] | Robert |
| 08 Qualidade de entrada | [[08-Qualidade-Entrada]] | Robert |
| 09 Estoque · entrada do lote | [[09-Estoque-Entrada-do-Lote]] | Nathan (N16-180) |
| 10 Produção e Roteiro | [[10-Producao-e-Roteiro]] | Robert |
| 11 Qualidade de saída | [[11-Qualidade-Saida]] | Robert |
| 12 Estoque · despacho | [[12-Estoque-Despacho]] | Nathan (N16-180) |
| 13 Expedição | [[13-Expedicao]] | Robert |
| 14 Fiscal · Omie | [[14-Fiscal-Omie]] | Robert |
| 15 Custo Real e Comissão | [[15-Custo-Real-e-Comissao]] | Robert (motor e custo por evento) e Nathan (telas) (N16-169) |

A API do MES (`api-pcp`) continua com o Robert, acompanhado pelo Gustavo (N16-158), menos o módulo do Estoque (`src/estoque/`), que o Nathan desenvolve desde 19/11 (N16-180).

## Comercial: quem faz o quê

Decisão do Nathan de 17/11/2026 (N16-169). O corte é pela camada: o Robert fica com a API e a integração; o Nathan, com as telas e a base de preço. O Gustavo segue com o banco e a API de tudo, e o Pablo apoia como analista (N16-168).

| Raia | Robert | Nathan |
|---|---|---|
| 01 Proposta de Venda | Inteira | — |
| 02 Orçamento | — | Inteira; o Pablo levanta e valida as regras com o setor |
| 03 Pedido de Venda e Liberação | Inteira: `transformar`, Omie e liberação para o MES | — |
| 15 Custo Real e Comissão | Motor da comissão na API (BL-078) e custo por evento (`K2`) | Telas: comissão estimada na proposta (`K1`), Controladoria, visão geral, minhas comissões e parâmetros (`K4`) e custo real por item (BL-088, BL-053) |
| **Estimativa** 🟡 | ~29 pd | ~54 pd: 27 das telas da raia 15 e ~27 do Orçamento (blocos P4, P5 e N7, que eram do Pablo) |

A estimativa tem margem de ±30% e o Robert ainda valida ([[Capacidade-do-Robert]]). O prazo é 01/12/2026 (N16-170): nele cabe só a entrega mínima, em que a proposta vira pedido no Omie (cerca de 15 pd); o escopo ainda não foi fechado 🟡.

## Quem faz o quê

| Pessoa | Papel | O que toca |
|---|---|---|
| **Nathan** | Coordenador de TI e arquiteto do ERP. Coordena e gerencia a equipe e ajuda o Robert em cada processo (N16-157). É o dono deste vault, das decisões e do pipeline Omie 📝 | Dono da raia 06 Circuito de Compra (N16-157) e, desde 17/11, da raia 02 Orçamento e das telas da raia 15 (N16-168, N16-169). Telas do av-hub (o front e o BFF, a camada que liga o front à API), o `omie-elt-pipeline`, os contratos e a coordenação. Faz as telas de Compras e a organização do código do HUB. **Desde 11/11 o pipeline do pedido de venda e as telas da Comissão nova passam ao Robert** (N16-157, supera em parte a N16-15) |
| **Gustavo M. de Farias** | Colega, DBA (administrador de banco de dados) | **DBA e API de todo o sistema** (N16-157). Banco e API do av-hub (`api-acos-vital`): migrations, `auth.*`, funções, envio fixo da OC, chaves de serviço do MES e da pipeline (L6) e `exclusionSync`. Revisa e aplica no banco o módulo comercial e o Orçamento e a comissão nova (`core_comissao`, N16-143) (N16-15). Acompanha a API do MES (`api-pcp`), que é do Robert (N16-158) |
| **Robert Wilson** | Colega, fullstack sênior | **Dono de 13 das 15 raias do fluxo 0b** (todas menos 02 e 06; N16-157), com o Nathan ajudando em cada processo. O MES inteiro (`api-pcp` e `app-pcp`): Recebimento, carga inicial em lote (G1), baixa no despacho, D11 (leitor 2D e posto de recebimento) e I1/J2/J5. Também o custo obrigatório em todo lote e o `GET /itens/custo` (N16-09, feito na `develop` em 27/10). **Desde 28/10 conduz o módulo comercial na `api-acos-vital`** (N16-117) e troca o backend das telas de proposta (N16-118, N16-119); já criou as rotas `/comercial/*` de cadastros, clientes, parceiros e propostas. **Desde 11/11 também o Fiscal · Omie (pipeline do pedido de venda) e o Custo Real e Comissão** (N16-157); na raia 15, desde 17/11, só o motor da comissão e o custo por evento, e as telas passam ao Nathan (N16-169). Não acompanha mais o Orçamento (N16-168) |
| **Pablo Cruz** | Colega, **analista** desde 17/11/2026 (N16-168); antes, desenvolvedor júnior | Não desenvolve. Apoia o Orçamento como analista: levanta e valida as regras com o setor (N16-168). Até 17/11 era dono da raia 02, com acompanhamento do Robert (N16-157). Criou o módulo Comercial & Suprimentos (a `api-comercial`, removida do av-hub em 06/11/2026 (PR #261, `dd9d729`); legível em `git show f7d8d7f:api-comercial/<arquivo>`). **Desde 28/10 acompanha** o módulo comercial, que o Robert conduz, e cuida do Orçamento, com a supervisão do Robert. Ele saiu do MES em 07/10 |

Atribuições decididas: Pablo no Comercial & Suprimentos e Robert no MES 📝 (decisões #32 e #33 do Registro do v1), reafirmadas em 14/10. Em 28/10 o Nathan passou a condução do módulo comercial para o Robert, com o Pablo acompanhando (N16-117) ([[Registro-de-Decisoes]]). Em 11/11 o Nathan definiu o dono de cada raia do fluxo 0b (N16-157, tabela acima). O detalhe de repositórios está em [[Sistemas-e-Responsabilidades]].

## O que cada pessoa decide e entrega

| Quem | Decide | Entrega neste vault |
|---|---|---|
| Nathan | Regras de negócio e fluxo; nomes de tela; escopo; prioridade; coordenação da equipe | Raias 06 Circuito de Compra e 02 Orçamento, telas de Compras, telas da comissão e do custo real (N16-169), BFF, [[Backlog-por-Frente]] da frente front, aprovação dos contratos; apoio ao Robert em cada processo |
| Gustavo | Modelo de banco, funções e rotas da API; chaves de serviço | Migrations (`047b`, `046b`, `035b`), mapa de `auth.rotas_telas`, SQL dos contratos |
| Robert | Modelo e regras do MES; telas do `app-pcp`; rotas do módulo comercial na `api-acos-vital`; as raias de que é dono (N16-157) | Documento de retirada, `lote_custo`, feed `/fluxo/eventos`, job do contrato 004 (feito, K4), rotas e telas da proposta, pipeline do pedido de venda no Omie, motor da comissão e custo por evento (as telas da comissão passaram ao Nathan, N16-169) |
| Pablo | Como analista: regras do Orçamento validadas com o setor (N16-168) | Regras do legado a portar ([[Mapa-do-Modulo-do-Pablo]]) |

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
| Pablo | — | Analista desde 17/11/2026: fora da conta de desenvolvimento (N16-168) |

### Evidência no git

Desde 15/09/2026, em 14/10: os commits do MES são do Robert (28 no `api-pcp`, 37 no `app-pcp`). Os do Pablo no MES (9 e 17) são anteriores à reatribuição. Os do Comercial & Suprimentos no HUB são do Pablo (258 em 14/10, 348 em 29/10) ✅. Desde 28/10 os commits das telas de proposta no HUB e das rotas `/comercial/*` na API são do Robert ✅ (git, 29/10). Detalhe em [[Sistemas-e-Responsabilidades]].

### Conta da capacidade do Robert

Com G1, D11, I1, J2, J5 e D12 no Robert e o custo do lote (K3 a K6) somado, o plano fecha em **déficit de 16,1 pd** no Ciclo 1 (**32,6 pd desde 15/10**, com o N14-29, e o Nathan aceitou deslocar a data: N14-30). O planejado é 64,85 pd contra 48,75 pd de capacidade. A conta não inclui a baixa no despacho do Estoque, que não tem pd dimensionado 🟡. As estimativas são minhas, ±30%, e o Robert valida. **11/11/2026:** o Robert validou a conta de 36,1 pd e 03/03/2027; a G1 (carga em lote) sai do Ciclo 1 até o setor responsável dar a data do levantamento (N16-156), e o BL-003 (I1 a I3 e I7 da Torre, ~14 pd) passa para depois do Ciclo 1 sem mudar o fim.

Consequência: o Ciclo 1 só fecha em 21/01/2027 e o Ciclo 2 começa em 22/01/2027. **Desde 15/10, as datas são 18/02/2027 e 19/02/2027** (N14-30 e N14-32; com BL-007, BL-049 e BL-050 (N16-145): 36,1 pd e 03/03/2027 a 75% de foco; o Robert valida).
