---
tags: [comissao, banco, core_comissao, modelo, proposta, controladoria]
criado: 2026-10-16
estado-em: 2026-11-23
status: proposta
dono: Gustavo (DBA)
develop-conferida: [api-acos-vital ce4f90f, av-hub 7f0f7e2, em 2026-11-23, só o grão do motor atual]
fontes: [N16-185 a N16-190, av-hub lib/simulador/motor.ts (develop 7f0f7e2), N16-02, N16-03, N16-09, N16-10, N16-11, N16-17, N16-18, N16-19, N16-20, OQ-06, OQ-11, OQ-12, OQ-28, dump core_comissionamento convertido, av-hub lib/simulador/motor.ts, tela-simulador-comissao.png]
---

# Modelo novo: schema `core_comissao`

**Em uma frase:** o módulo novo de comissão (`core_comissao`) foi desenhado sobre o motor de outubro, por item, e guarda cada cálculo, deixa a Controladoria decidir a comissão por nota fiscal e mostra ao vendedor só o que ele pode ver.

**Quando consultar esta nota:** quando precisar entender o desenho do banco da comissão nova, quem escreve em cada tabela e o que muda em relação ao módulo atual. Vendedor e Controladoria leem só o resumo. O time de TI segue para o detalhe técnico.

Tudo aqui é 🟡 proposta, salvo onde há decisão (📝) ou código (✅). **A comissão nova fica em `core_comissao`, schema próprio (N16-143, 29/10).** Onde esta nota diz `core_comercial.*` para proposta, pedido e custo por evento (`propostas`, `pedidos`, `custos_eventos`, `vw_pedido_item_custo`), são os nomes do desenho de 16/10: pela N16-116 esses objetos vão para `core_vendas_faturamento`, e o Robert refaz os nomes ao criar os contratos novos. O dump de 29/10 tem `core_comercial.propostas` (plural) e não traz `pedidos`, `pedidos_itens` nem `custos_eventos` ✅. O módulo novo fica em **Operações**, em schema novo, e **não toca em `core_comissionamento`** (N16-11). Os contratos do DDL, das rotas e das telas foram removidos em 29/10/2026. O Robert cria os novos. Motor atual: [[01-Motor-Atual-Como-Calcula]]. Tabelas atuais: [[02-Tabelas-Atuais-core_comissionamento]]. Estados: [[04-Regras-e-Estados-da-Comissao-Nova]]. Selos: [[Regras-do-Vault]].

## O motor mudou de grão (18 a 23/11)

Este desenho foi feito sobre o motor de outubro, que decidia a comissão **por item**. De 18 a 23/11 o motor atual passou a decidir **por pedido** ([[01-Motor-Atual-Como-Calcula]]). O módulo novo ainda não foi refeito; onde ele diverge, vale o motor atual até alguém revisar o desenho 🟡:

| Ponto | Motor atual (✅ `develop`) | Este desenho |
|---|---|---|
| Letra | Uma letra pela margem da revenda do **pedido**, para todos os itens (N16-185) | `letra_item` pela margem de cada item; faixas sobre a margem do item |
| Fabricação interna | Predominância: acima de `pct_predominancia_fabricacao` (50%) da venda, fixo em tudo; abaixo, a letra em tudo (N16-186) | Fixo sempre, fora da letra; sem o parâmetro do corte em `parametros` |
| Prejuízo | Pedido com margem da revenda ≤ 0 zera tudo: `PREJUIZO_PEDIDO` e `FABRICACAO_BLOQUEADA` (a Controladoria libera); `PREJUIZO` só sem preço (N16-185) | Zera só o item no prejuízo; `regra_aplicada` não tem os dois valores novos |
| Cotado × real | O pedido inteiro paga pela **versão** de menor comissão (empate, Compras) (N16-190) | `comissao_final_pct = LEAST(cotada, real)` item a item, por NF |
| Mês | Competência: o mês em que é paga, com dia de fechamento por unidade (N16-187) | Apuração mensal, sem regra para nota desbloqueada depois do fechamento |
| Quem vê | Só o vínculo próprio; sem vínculo, vazio (N16-189) | Visibilidade por perfil, sem a regra do auxiliar e do diligenciador |
| Versão do vendedor | Travada depois do envio, salvo `DEVOLVIDO` (N16-188) | Sem versão do vendedor: o cotado congela na aprovação da proposta |

## O que o módulo faz, etapa por etapa

1. **Proposta salva (V0.3):** o motor calcula a comissão **estimada**, por item e no total, com o custo que o vendedor pôs. 📝 N16-10
2. **Proposta aprovada:** a estimativa **congela**. 📝 N16-03, N16-17
3. **Custo real chega** (requisição, ordem de compra ou lote): o motor **recalcula sozinho**. O preço do cliente não muda. 📝 N16-09, N16-10
4. **Nota fiscal (NF) faturada:** a comissão **fecha por NF** e chega à Controladoria já calculada. 📝 N16-10
5. **Decisão:** Controladoria, Gerência ou Coordenação aprovam, desaprovam, bloqueiam, desbloqueiam, cortam ou alteram, sem teto e sempre com justificativa. Ninguém decide a própria comissão. 📝 N16-10, N16-44, N16-45
6. **Vendedor:** vê a comissão que ele colocou até a decisão. Depois vê a real, com a justificativa. 📝 N16-10, N16-46
7. **Compra acima do valor da proposta:** o vendedor aprova ou reprova a compra de cada produto (`C8`). Se aprova, a comissão real cai. 📝 N16-60 a N16-67, que superam N16-18
8. **Proposta cancelada:** a estimativa vira histórico. 📝 N16-02
9. **NF cancelada, devolvida ou recusada (`K6`):** a comissão é abatida na mesma proporção. Na devolução parcial, o Fiscal ou a Controladoria informam item, quantidade e valor, com pendência até lá. 📝 N16-47, N16-74
10. **Pedido cancelado:** o comprado vai ao Estoque e deixa de ser custo do pedido. No faturado em parte, o faturado fica. 📝 N16-68 a N16-71

## Exemplo

No pedido de 5 itens usado como teste, a comissão **cotada** é R$ 513,10. Calculada com o custo real, ela cai para R$ 307,50. Esse número foi conferido contra `lib/simulador/motor.ts` e validado em banco descartável.

Se um item sai em várias NFs, o banco guarda a quantidade já comissionada e nunca paga duas vezes a mesma peça (N16-49). Exemplo da Michele: venda de R$ 1.000 a 2%, com seis notas. Cada nota paga 2% sobre o seu valor.

## Princípios, em poucas palavras

- **Nada é sobrescrito.** Cada cálculo é uma linha nova e imutável. Proposta cancelada vira histórico sem esforço.
- **O que o vendedor vê é decidido no banco e na API**, não na tela.
- **Regra em tabela com tipo, não em JSON.** JSON só para log.
- **Vigência em todo parâmetro.** Mudar valor é fechar a vigência e abrir outra.
- **Justificativa obrigatória** em decisão, exclusão e cancelamento.
- **Custo real só reduz o percentual.** Vale o menor entre cotado e real (N16-11); no motor atual a comparação é da versão inteira do pedido (N16-190).
- **Preço da proposta não muda** com o custo real. Só mudam margem e comissão (N16-17).
- **Depois da decisão nada recalcula.** A NF decidida é uma foto.
- **Cada evento de custo tem as suas condições** (fornecedor, pagamento, impostos, frete). O item soma os eventos. O encargo da condição de pagamento não entra no custo, só no preço sugerido (N16-22). 📝 N16-20
- **Mesmas entradas do simulador** (N16-19): toda caixa e toda coluna da tela existe como coluna no modelo.

## As camadas do schema

| Camada | O que guarda | Quem escreve |
|---|---|---|
| Parâmetros | Percentuais, regra fixa por cliente, exclusões, coordenadores | Tela de parâmetros (Controladoria) |
| Dossiê | Uma comissão por proposta | API, ao salvar a proposta |
| Cálculo | Cada execução do motor, com itens e eventos de custo | Motor |
| NF | Uma comissão por nota faturada | Job de faturamento |
| Decisão | Conferência de Compras (🟡 OQ-28) e decisão da Controladoria | Compras e Controladoria |
| Rastro | Linha do tempo, fila de recálculo, auditoria | Funções e gatilhos |

## O que muda e o que não muda

No desenho, o motor de outubro (margem, letra, prejuízo, fabricação interna, teto da regra fixa e menor percentual) não mudava. O motor atual já mudou de grão (seção acima). Fora isso, o desenho muda só isto:

1. O custo de compra do item vem dos eventos de custo, não de digitação. Sem imposto real, o evento herda o da proposta e o cálculo é marcado "custo parcial por imposto" (OQ-11).
2. As chaves passam a ser códigos em vez de texto.
3. O teto da regra fixa passa a ser aplicado dentro do motor, e não só na view.
4. O arredondamento do valor em reais é feito no banco.
5. O passo "Compras aprova o percentual" vira uma conferência por NF, **desligada** por padrão (N16-51, OQ-28).

**Custo parcial (OQ-25, respondida em N16-48):** enquanto o custo não cobre a quantidade, só as peças com custo real entram na comissão. Quando o custo completa, a diferença vai para a apuração seguinte, para nova decisão.

## Onde o cálculo roda

Hoje o motor roda no navegador. Há três opções: tudo no banco, motor na API, ou híbrido. A sugestão 🟡 é o **híbrido**: o mesmo código do motor roda na API, e tudo que fecha dinheiro roda no banco, com restrições contra valor errado. A decisão é do Nathan e do Gustavo.

## O que migra e o que não migra

- **Migra:** os parâmetros (3 linhas), as regras fixas vivas (4), as exclusões (9: 1 cliente e 8 vendedores) e os coordenadores (6 pessoas e 6 regras). 🟡
- **Não migra:** simulações e itens antigos (14 e 21), o bloqueio por NF (2 linhas, ambas desbloqueadas), o histórico dos coordenadores e as 4 views antigas. Ficam no módulo atual, intocados.
- O pedido que chega do Omie **sem proposta** entra no módulo novo (N16-103). O vendedor preenche a simulação como hoje.

## Principais riscos

1. O custo real do Ciclo 1 vem sem impostos. A Controladoria vê "imposto estimado" até existir imposto por item (OQ-11).
2. Muitos eventos por item geram muitas linhas, e o cálculo é imutável. O job agrupa eventos pendentes.
3. O motor em JavaScript usa ponto flutuante e o banco usa `numeric`. Aceita-se até R$ 0,01 por NF, com explicação.
4. A remuneração dos coordenadores é dado pessoal. A tela de parâmetros terá perfil restrito.

## Perguntas em aberto

A Michele respondeu em 19/10/2026 (N16-42 a N16-51). Respondidas: C01, C02, C03, C05, C06, C07, C09, C10 e C12. Seguem abertas: C04 (de onde sai a entrada do motor), C08 (data de vigência da carga), C11 (DIFAL da compra no custo), C13 e C14. A tabela completa está no detalhe técnico.

## Detalhe técnico

Desenho do módulo de comissão da proposta. **Motor de outubro, tabelas refeitas** (N16-11); o motor atual já é por pedido (seção "O motor mudou de grão"). O módulo novo fica em **Operações**, em **schema novo**, e **não toca em `core_comissionamento`**. Os contratos do DDL, das rotas e das telas foram removidos em 29/10/2026; o Robert cria os novos. O motor atual está explicado em [[01-Motor-Atual-Como-Calcula]], as tabelas atuais em [[02-Tabelas-Atuais-core_comissionamento]] e os estados em [[04-Regras-e-Estados-da-Comissao-Nova]]. Selos: [[Regras-do-Vault]]. Tudo aqui é 🟡 proposta, salvo onde há decisão (📝) ou código (✅).

O detalhe técnico desta nota fica em 4 notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-1]]: O que o módulo faz, em uma frase por etapa · Princípios · Convenções de nome · Visão geral · Em camadas · Entradas do motor e a tela do simulador (N16-19) · Valores fixos (`CHECK`) · Índices e chaves únicas principais
- [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-2]]: Tabelas e colunas · Grupo: Dossiê e cálculo (de Tabelas e colunas)
- [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-3]]: Grupo: NF, conferência de Compras e decisão (de Tabelas e colunas) · Grupo: Rastro (de Tabelas e colunas) · Como as tabelas respondem ao que o Nathan pediu · Views · Funções do banco
- [[03-Modelo-Novo-core_comissao-Detalhe-Tecnico-4]]: O motor é o mesmo: a fórmula preservada · Onde o cálculo roda · Mapa de-para: tabela atual → tabela nova · O que NÃO migra · Plano de carga de dados (para o Gustavo) · Riscos · Perguntas em aberto
