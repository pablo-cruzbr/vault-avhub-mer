# Fatos de 15-Custo-Real-e-Comissao

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/15-Custo-Real-e-Comissao.md`, antes de mexer na nota.
Gerada por `node _v3/scripts/fatos.mjs extrair`. Conferência: `node _v3/scripts/fatos.mjs conferir 15-Custo-Real-e-Comissao`.

## decisões e IDs (46)

- `BL-010`
- `BL-023`
- `BL-035`
- `BL-066`
- `BL-067`
- `D6 do 008`
- `N16-08`
- `N16-09`
- `N16-10`
- `N16-104`
- `N16-105`
- `N16-106`
- `N16-11`
- `N16-116`
- `N16-120`
- `N16-140`
- `N16-143`
- `N16-144`
- `N16-17`
- `N16-18`
- `N16-19`
- `N16-20`
- `N16-21`
- `N16-22`
- `N16-23`
- `N16-37`
- `N16-38`
- `N16-39`
- `N16-40`
- `N16-42`
- `N16-44`
- `N16-45`
- `N16-46`
- `N16-47`
- `N16-48`
- `N16-49`
- `N16-50`
- `N16-51`
- `N16-53`
- `N16-57`
- `N16-60`
- `N16-68`
- `N16-69`
- `N16-71`
- `N16-74`
- `N16-86`

## contratos (5)

- `API-008`
- `LOG-14b`
- `LOG-45`
- `LOG-47`
- `LOG-53`

## commits (3)

- `544ee0b`
- `6c11147`
- `97b9adc`

## arquivo:linha (9)

- `/comissoes/simulador/page.ts`
- `/orcamento/custo-itens/page.ts`
- `Proposta-Orcamento-Comissao/07-Cronograma/Proposta-de-Cronograma.md`
- `api-pcp/prisma/models/estoque.prisma`
- `estoque.prisma:378-382`
- `itens_pedido_custo.job.js:78`
- `lib/simulador/motor.ts:277-283`
- `simulacoes.route.js:30-36`
- `simulador/page.ts`

## rotas (1)

- `GET /itens/custo`

## datas (5)

- `16/10`
- `19/10`
- `27/10`
- `29/10`
- `29/10/2026`

## código entre crases (98)

- `09-Diagramas/fontes/tela-simulador-comissao.png`
- `544ee0b`
- `6c11147`
- `97b9adc`
- `:233-259`
- `:307-312`
- `ABATIMENTO`
- `ABERTA`
- `AGUARDANDO_DECISAO`
- `ALTERADA`
- `APROVADA`
- `BLOQUEADA`
- `C4`
- `C6`
- `C7`
- `C8`
- `CANCELADA`
- `CARGA_INICIAL`
- `COMPLEMENTO`
- `COMPRAS`
- `CONGELADA`
- `CORTADA`
- `CustoItens`
- `DESAPROVADA`
- `DESCONTO`
- `DISPENSADA`
- `E3`
- `E5`
- `EM_ACOMPANHAMENTO`
- `ENCERRADA`
- `ESTIMADA`
- `F1`
- `GET /itens/custo`
- `INFORMADA`
- `K1`
- `K2`
- `K3`
- `K4`
- `K5`
- `K6`
- `LOTE`
- `MAN-`
- `MANUAL`
- `MATERIA_PRIMA`
- `NF_CANCELADA`
- `NF_ENTRADA`
- `O1`
- `OC`
- `OrigemCusto`
- `PRODUCAO`
- `Proposta-Orcamento-Comissao/07-Cronograma/Proposta-de-Cronograma.md`
- `R4`
- `REAL`
- `V0.2`
- `V0.3`
- `V0.4`
- `V0.6`
- `V0C`
- `alterar`
- `api-acos-vital`
- `api-pcp`
- `api-pcp/prisma/models/estoque.prisma`
- `app/(protected)/comissoes/*`
- `app/(protected)/orcamento/custo-itens/page.tsx`
- `aprovar`
- `av-hub`
- `av-hub/app/(protected)/comissoes/simulador/page.tsx`
- `bloquear`
- `comissao_devolucao_pendencia`
- `comissoes`
- `comissoes_nf`
- `core_comercial`
- `core_comercial.fn_proposta_*`
- `core_comercial.propostas`
- `core_comissao`
- `core_comissionamento`
- `core_vendas_faturamento`
- `cortar`
- `custo-itens`
- `desaprovar`
- `desbloquear`
- `develop`
- `estoque`
- `estoque.prisma:378-382`
- `id_parametros`
- `itens_pedido_custo`
- `itens_pedido_custo.job.js:78`
- `lib/simulador/motor.ts:277-283`
- `lote_custo`
- `main`
- `matriz-precos`
- `ordens_compra_itens`
- `ordens_compra_itens_vinculos`
- `pedidos_venda`
- `recompra`
- `simulacoes.route.js:30-36`
- `simulador/page.tsx:1192-1234`
- `uso_interno`

## regras e linhas de conteúdo (132)

- O vendedor monta a proposta e o sistema estima a comissão pelo motor atual. Ele só vê a estimativa que ele mesmo colocou. `K1`
- Cada compra, lote do Estoque ou matéria-prima da produção gera uma linha de custo real, com as condições do próprio evento. `K2`
- Enquanto o custo do item não cobre a quantidade, o custo é parcial. Só as peças com custo real entram na comissão. `K2`
- No recebimento, o valor da nota de entrada substitui o valor da ordem de compra (OC). `K2`
- Se a compra sai mais cara que a proposta, o vendedor aprova ou reprova a compra do produto dele. O preço de venda não muda. `C8`
- Quando o Omie emite a nota, a comissão fecha com o percentual vigente naquele momento e chega à Controladoria já calculada. `K3`
- Controladoria, Gerência ou Coordenação decidem: aprovar, desaprovar, bloquear, desbloquear, cortar ou alterar. Sempre com justificativa. `K4`
- Só depois da decisão o vendedor vê a comissão real e o motivo. Desaprovada aparece com R$ 0. `K5`
- Se a nota for cancelada, devolvida ou recusada, a comissão é abatida na mesma proporção. `K6`
- No início, a Controladoria vê custo parcial e a diferença contra o cotado.
- O vendedor aprova ou reprova a compra mais cara. Se aprova, a margem e a comissão caem.
- A nota sai e a comissão chega à Controladoria. Ela aprova ou corta, com justificativa.
- O vendedor do Cliente Exemplo S.A. passa a ver o valor real e o porquê.
- Se o cliente devolver parte das flanges, o Fiscal ou a Controladoria informam quantas voltaram. A comissão cai na proporção.
- | Vendedor | Estima a comissão; aprova ou reprova compra acima do valor; vê a real depois da decisão |
- | Controladoria | Acompanha o custo real, decide a comissão e informa o que voltou nas devoluções parciais |
- | Gerência e Coordenação | Mesmas permissões de decisão da Controladoria |
- | Compras | Fornece o custo real pela OC e pela nota de entrada |
- | Fiscal | Informa, com a Controladoria, o que voltou numa devolução parcial |
- Controladoria, Gerência e Coordenação decidem sem teto. Ninguém decide a própria comissão.
- Toda decisão tem justificativa, autor, data e valores anterior e novo.
- O vendedor vê a comissão real só depois da decisão.
- Com custo parcial, só as peças com custo real entram na comissão.
- Cada nota fecha com o percentual vigente. Nunca se paga duas vezes a mesma peça.
- A nota de entrada manda: ela substitui o valor da OC.
- O encargo da condição de pagamento entra no preço sugerido, não no custo.
- Cancelamento, devolução ou recusa abatem a comissão. Se já foi paga, o desconto entra na próxima apuração.
- Devolução total vem do Omie. Na parcial, o Fiscal ou a Controladoria informam o que voltou.
- ✅ (`api-acos-vital`) Motor atual de comissão, só leitura aqui.
- ✅ (`av-hub`) Simulador de Comissão, usado como referência da tela nova.
- 🟡 Tela "Custo real por item" existe, sem imposto e com dados de teste.
- 🟡 Módulo novo em `core_comissao`: modelado e testado no banco, sem API nem tela.
- 🔴 Comissão estimada na proposta (`K1`).
- 🔴 Custo real por evento, com a nota de entrada como verdade (`K2`).
- 🔴 Tela da Controladoria, relatórios e visão geral (`K4`).
- 🔴 Aprovação do vendedor na compra acima do valor.
- 🔴 Pendência de devolução parcial e apuração do vendedor.
- ❓ Sobra aproveitável de chapa (OQ-32) e devolução de compra ao fornecedor (OQ-42).
- | Nó | O que acontece | Quando |
- | `K1` | **Comissão estimada** nasce na proposta (`V0.3`), pelo motor atual (percentual final = menor entre o do vendedor e o de compras), numa tela semelhante à do Simulador de Comissão (N16-19). O vendedor só vê a comissão que ele colocou. Parâmetros: os de **"Maio/23"** continuam, com vigência (N16-39); o **encargo** entra no **preço sugerido**, não no custo | ao criar e a cada revisão da proposta |
- | `K2` | **Recalcula com o custo real**, por evento: OC (com o valor da NF de entrada no recebimento), lote do Estoque, matéria-prima da produção. **Cada evento carrega as suas condições** (N16-20). Enquanto o custo do item não cobre a quantidade, o custo é **parcial**, e a comissão só vale para as **peças com custo real** (N16-48) | a cada evento de custo |
- | `K3` | **Fecha por nota fiscal** (`O1`). **Cada nota fecha com o percentual vigente naquele momento**, com o custo real que já entrou. Chega à Controladoria **já calculada**. O mesmo item pode sair em várias notas, **sem pagar duas vezes a mesma quantidade** (N16-49). Quando o custo completa depois da decisão, a diferença (complemento ou desconto) vai para a **apuração seguinte, para nova decisão** | quando o Omie emite a nota |
- | `K4` | **Decidem a Controladoria, a Gerência ou a Coordenação**, com as mesmas permissões: aprovar, desaprovar, bloquear (e **desbloquear**), cortar ou alterar, por **valor ou percentual, sem teto**, **sempre com justificativa** e rastro (quem, quando, valor anterior e novo). **Ninguém decide sobre a própria comissão** (N16-44, N16-45). A Controladoria também tem a visão geral e os relatórios (N16-50) | depois de `K3` |
- | `K5` | **O vendedor vê a comissão real**, com a **justificativa**, **só depois da decisão** (N16-46). Desaprovada aparece com **R$ 0 e o motivo** | depois de `K4` |
- | `K6` | **NF cancelada, devolvida ou recusada**: a comissão é **abatida na mesma proporção**. Se ainda não foi paga, reduz o valor a pagar; **se já foi paga, o desconto entra na próxima apuração** do vendedor (N16-47). A devolução **total** vem do Omie; a **parcial** só chega marcada, e o Fiscal ou a Controladoria **informam o que voltou** (N16-74) | depois da nota |
- | Nó | O que entra no custo real | Origem da linha | Selo |
- | `C4` | O valor da OC, por item, vinculado ao pedido de venda (`ordens_compra_itens_vinculos`); inclui a **OC de mão de obra** (categoria "Despesas com Industrialização", ou "Serviços Tomados" com o Nº do Pedido do Fornecedor apontando um PV) | `OC` | 🔴 linha por evento; vínculo ✅ (`api-acos-vital`) ([[Contratos-da-v2\|LOG-14b]]) |
- | `C7` | Compras usa o valor correto; a proposta **não muda**; se for maior que o da proposta, o vendedor aprova ou reprova (`C8`) | `OC` | 📝 N16-08, N16-17, N16-60 |
- | NF de entrada | No recebimento, o valor da NF substitui o da OC. **O CCP vincula a NF de entrada à OC**, na tela de Follow-up, e o item do pedido vem do vínculo da OC (a ligação automática do Omie não existe na prática; N16-57, N16-86), inclusive com várias NFs por OC e KG contra PC. A NF traz **imposto real** e a **data real de recebimento** | `NF_ENTRADA` | 🔴 recurso novo na pipeline ([[Estudo-Omie-API]]) |
- | `R4` | O lote nasce com custo, **obrigatório**: valor total e valor por item; no fim, o valor unitário | `OC` (ou `CARGA_INICIAL`, `MANUAL`) | ✅ (`api-pcp`) o lote do Recebimento nasce com o custo da OC na `develop` do MES (19/10, `97b9adc`); 🔴 custo obrigatório (N16-09, BL-066). ❓ o dado de estoque hoje não é confiável (aviso de Compras) |
- | `E3` | Item atendido pelo Estoque usa o **custo real do lote** (o da OC que o originou) | lote | ✅ (`api-pcp`) `GET /itens/custo` existe na `develop` do MES (27/10, `6c11147`); 🔴 teste junto com o job do hub e merge do MES para a `main` (BL-035) |
- | `E5` | O fabricado aprovado vira lote; o custo do lote fabricado é **só a matéria-prima** | `PRODUCAO` | ✅ (`api-pcp`) o lote `PRODUCAO` existe na `develop` (27/10); 🔴 o custo do fabricado (BL-067) ([[Contratos-da-v2\|LOG-53]]) |
- | `F1` | A matéria-prima enviada à produção para o item fabricado (J2, J3) | lote da matéria-prima | 🟡 a `develop` baixa a matéria-prima no "Atender pelo estoque" (19/10); a baixa na retirada (N16-140) e o custo da matéria-prima no fabricado são 🔴 (BL-010) |
- | `O1` | Fecha a comissão sobre a NF | NF | ✅ lado Omie; `K3` 🔴 |
- | Dia | Evento (PCP e Compras) | Item | Origem | Linha de custo | Custo acumulado do item |
- | 01 | Requisição de 50 tubos | C | OC | 50 × R$ 80 = R$ 4.000 | C: 50 de 50, R$ 4.000, unitário R$ 80 (completo) |
- | 01 | Requisição de 10 flanges | A | OC | 10 × R$ 140 = R$ 1.400 | A: 10 de 50, R$ 1.400 (**parcial**) |
- | 02 | 20 flanges | A | OC | 20 × R$ 150 = R$ 3.000 | A: 30 de 50, R$ 4.400 (parcial) |
- | 03 | 1 mão de obra | B | OC de serviço | 1 × R$ 1.200 = R$ 1.200 | B: 1 de 1, R$ 1.200 (completo) |
- | 03 | O restante das flanges normais | A | OC | 20 × R$ 155 = R$ 3.100 | A: 50 de 50, R$ 7.500, **unitário R$ 150** (completo) |
- | 04 | As 50 flanges cegas já estão no estoque | E | lote | 50 × R$ 90 = R$ 4.500 (custo real do lote, o da OC que o originou) | E: 50 de 50, R$ 4.500, unitário R$ 90 |
- | 05 | O PCP manda a matéria-prima para a flange sobre desenho | D | lote da matéria-prima | custo só da matéria-prima, por exemplo R$ 600 | D: custo da matéria-prima; completo quando a quantidade do item está coberta |
- | Momento | `K` | O que o sistema faz | Quem vê |
- | Proposta criada | `K1` | Estima a comissão com o custo cotado (A a R$ 100) | o vendedor vê a estimada que ele pôs |
- | Dia 01 a 03 | `K2` | A cada linha de custo recalcula. Enquanto A está **parcial**, **só as peças com custo real entram na comissão**; o restante espera (N16-48) | a Controladoria vê o custo real e a diferença |
- | Dia 01 a 03, compra acima do valor | `C8` | O vendedor é avisado em Meus Pedidos e aprova ou reprova a compra de A | o vendedor vê o valor da compra de A |
- | Dia 03, A completo | `K2` | A fecha a R$ 150; a margem do item cai; a comissão cai. A diferença das peças que entraram depois vai para a **apuração seguinte**, para nova decisão | só a Controladoria |
- | Depois do faturamento (`O1`) | `K3` | Fecha sobre a NF, já calculada, com o percentual vigente naquele momento | Controladoria |
- | Decisão | `K4` | Controladoria, Gerência ou Coordenação aprovam, desaprovam, bloqueiam, cortam ou alteram, com justificativa | **agora** o vendedor vê a comissão real e a justificativa (`K5`) |
- | Devolução da nota | `K6` | Total: abatimento de 100% sozinho. Parcial: pendência para Fiscal ou Controladoria informarem o que voltou; depois, abatimento proporcional | Controladoria; o vendedor vê o desconto com o motivo |
- | Lado | Condições | De onde vêm |
- | **Venda** | **Um conjunto por pedido**, como no Simulador: estado de destino e ICMS, condição de pagamento e encargo, "com impostos", valor ST, imposto retido ou DIFAL, frete na venda | a proposta (`V0.2`, `V0.3`); na tela da Controladoria, as mesmas |
- | **Custo real** | **Um conjunto por evento**: fornecedor, condição de pagamento, IPI, ICMS, ST, DIFAL, frete, origem do fornecedor (por exemplo, optante pelo Simples) | a OC (`C4`, `C7`) ou a **NF de entrada** (imposto real), o lote (`R4`, `E3`) ou a matéria-prima (`F1`) |
- O **custo líquido de cada evento** é calculado com as condições do próprio evento, pela **mesma fórmula do motor** (compra, IPI e crédito de ICMS em `lib/simulador/motor.ts:277-283`; frete e custo líquido em `:307-312`, ver [[01-Motor-Atual-Como-Calcula]]). Depois **soma**: o custo líquido do item é a soma dos eventos e o unitário médio é o total dividido pela quantidade coberta. O custo do pedido é a soma dos itens. **O encargo da condição de pagamento NÃO entra no custo**: entra no **preço sugerido**, como no motor atual (N16-22).
- **Imposto da compra.** O vendedor registra os impostos na proposta; ao chegar a requisição, o sistema os **puxa para a OC**, Compras os confere e edita **no hub**, e o que edita **volta ao Omie pela mesma sincronização da OC** (N16-38, N16-53). O hub **não** guarda hoje IPI, ICMS, ST nem DIFAL por item; **o Omie guarda** ICMS, ST, IPI, PIS e COFINS por item do pedido de compra, **em valor e sem DIFAL**, e a **NF de entrada** traz base, alíquota e valor ([[Estudo-Omie-API]]). **O Nathan traz esses dados do Omie para o hub.** O **DIFAL da compra** fica fora do custo líquido (provisório, Compras valida). Conferido em 29/10/2026 no dump: `ordens_compra_itens` ainda não tem coluna de imposto. Pela N16-144 (29/10), o imposto da linha da OC vem da **parte de compras do pedido** (o que o vendedor preencheu, N16-38 e N16-106) quando a OC é de pedido ou de recompra; nas OCs de estoque ou uso interno o Comprador digita; a edição na OC não volta ao pedido.
- Até os campos existirem, o evento calcula **sem imposto** (como o Ciclo 1) e a linha mostra "sem imposto" 🟡; a Controladoria vê que o custo está sem o imposto real. O impacto no cronograma está na proposta de cronograma (`Proposta-Orcamento-Comissao/07-Cronograma/Proposta-de-Cronograma.md`, fora do vault, a validar).
- No exemplo do Nathan (item A), cada requisição vira uma OC com o seu fornecedor, a sua condição e o seu imposto. O custo líquido de A é a soma das três, cada uma com as suas condições. Impostos e encargos de cada uma são "a definir": **não há valor inventado aqui** 🟡.
- | Data e origem | `OC`, `NF_ENTRADA`, `LOTE`, `MATERIA_PRIMA`, `CARGA_INICIAL`, `MANUAL` (origens do MES em `estoque.prisma:378-382`, mais a NF de entrada e a matéria-prima do fabricado) |
- | Documento | número da OC, NF de entrada, lote, parcial do MES (5.01, 5.02…) |
- | Fornecedor e condição de pagamento | com o encargo do evento só para auditoria (N16-22) |
- | Quantidade e preço | preço de compra do evento |
- | IPI, ICMS, ST, DIFAL, frete | do evento; "sem imposto" enquanto não houver o imposto real |
- | Custo líquido do evento e unitário | pelo motor |
- | Cotado × real | o que o vendedor pôs para a mesma quantidade e a diferença (só a Controladoria vê) |
- | Estado da linha | normal, estornada (OC cancelada), "unidade diferente", "sem imposto" |
- | Bloco do Simulador (imagem) | (a) Vendedor, na proposta (`V0.2`, `V0.3`) | (b) Compras (`C6`, `C7`, `C8`) | (c) Controladoria (`K4`) |
- | **Pedido:** Unidade, Número do pedido (busca pelo número exato), Cliente, Vendedor, Itens | Unidade, **número da proposta** (automático, só dígitos, sem busca), cliente, vendedor, itens | Pedido, proposta ligada, requisição do PCP | NF, pedido, proposta, vendedor, cliente |
- | **Condições comerciais**, com "Parâmetros: Maio/23": estado de destino e ICMS, condição de pagamento e encargo, "Com impostos", frete na compra, valor ST, imposto retido ou DIFAL, frete na venda | Preenche. Os parâmetros vigentes são gravados com o cálculo (`id_parametros`, [[03-Modelo-Novo-core_comissao]]) | Lê as da proposta (só leitura) | As da venda (um conjunto por pedido) e, no drill-down, **as de cada evento de custo** (N16-20) |
- | **Itens:** "Compra: você preenche", "Resultado: o sistema calcula"; colunas COMPRA, VENDA, RESULTADO | Preenche a compra (custo cotado) e a venda; vê custo líquido, sugerido, margem e letra | Vê o **cotado do vendedor** ao lado do **valor da OC** e do fornecedor; edita os campos de imposto da OC; **não altera a proposta** (N16-08) | **Estimado × real, lado a lado**: custo líquido real, margem real, letra real, comissão real, por item e por evento |
- | **Chip** "Comissão: após a aprovação de Compras" | Não aparece. O vendedor vê a comissão estimada que ele colocou; a real só depois da decisão | **O passo de Compras aprovar o percentual fica desligado** (provisório; o valor estimado por Compras vem do Omie, sem digitação; N16-51) | Substituído pela decisão |
- | **Rodapé:** custo, venda, total da NF, sugerido, mark-up real, mark-up s/ compra, margem e letra | Estimados | Estimados e reais | Estimados e reais, com a queda por custo |
- | **Botões:** Recomeçar, Salvar rascunho, Enviar | Salvar a proposta; "Enviar" vira marcar aprovada e transformar em pedido (`V0.4` a `V0.6`) | Registrar a OC e tratar a lista dos casos reprovados | **Aprovar, desaprovar, bloquear, desbloquear, cortar ou alterar**, sempre com justificativa |
- | Item do menu na imagem | O que é hoje | Alinhamento 🟡 |
- | Comissões › Simulador, Análise de Simuladores, Minhas Comissões, Visão Geral, Parâmetros, Bloqueio de Comissões | Módulo atual (`app/(protected)/comissoes/*`), **não muda** (N16-11) | O módulo novo fica em Operações |
- | Operações › "Custo real por item" | `app/(protected)/orcamento/custo-itens/page.tsx` (`CustoItens`; a rota antiga `custo-itens` foi para o menu Orçamento em 27/10): custo real por pedido, KPIs, lotes e simulador de margem **sem imposto**, sobre dados de teste (BL-023, `544ee0b`; [[Contratos-da-v2\|LOG-47]]) | Pode ser a entrada do drill-down por evento da Controladoria; precisa ligar ao custo por evento e ao imposto |
- | Dashboards › "Matriz de preços" | O BFF cita o slug `matriz-precos`; a tela ainda não existe | É a matriz de preços do Orçamento ([[02-Orcamento-Base-de-Preco]]) |
- | OC cancelada antes de receber | A linha de custo dela é estornada; o item volta a parcial |
- | NF de entrada diferente da OC (peso da balança) | O valor da NF substitui o da OC (N16-40) |
- | Item sem nenhuma linha quando a NF de saída sai | `K3` fecha só as peças com custo real; o resto espera (N16-48); a Controladoria vê "custo parcial" |
- | Unidade de medida diferente entre proposta, OC e lote (KG × PC) | **Sem conversão no sistema** (Compras); o CCP liga a NF de entrada à OC (N16-86, que corrige a N16-57); linha marcada "unidade diferente" |
- | Pedido digitado no Omie | O `K1` nasce quando o vendedor preenche a parte de compras do pedido (a simulação, N16-104, N16-106); a nota que sair antes **espera**, e a Controladoria já vê a margem real (N16-105); com as duas, fecha pelo menor |
- | Proposta ou pedido **cancelado** | A estimada vira histórico. O que já foi comprado vai ao **Estoque, livre**, como lote com o custo da OC, e **deixa de ser custo** do pedido cancelado (N16-68, N16-69) |
- | Pedido **faturado** e depois cancelado | O cancelamento não desfaz compra nem produção; fica o abatimento da comissão (`K6`) e o saldo não faturado, parte por parte (N16-71) |
- | Devolução de **venda** | Total vem do Omie; parcial só chega marcada e o Fiscal ou a Controladoria informam item, quantidade e valor (N16-74) |
- | Devolução de **compra** (NF de entrada devolvida ao fornecedor) | ❓ Como aparece no Omie e o efeito na linha de custo: adiado (OQ-42) |
- | Pedido manual (`MAN-`) | Nunca entra no custo (D6 do 008, [[Contratos-da-v2\|LOG-45]]) |
- | Nó | Dossiê da proposta ou do pedido (`comissoes`) | Comissão da nota (`comissoes_nf`) e lançamentos |
- | `K1` | `ESTIMADA` (salva e revisada); `CONGELADA` quando a proposta é aprovada | — |
- | `K2` | `EM_ACOMPANHAMENTO` (o pedido existe e o custo real chega) | — |
- | `K3` | `EM_ACOMPANHAMENTO` | `AGUARDANDO_DECISAO` (a nota fechou, já calculada); lançamento `COMPLEMENTO` ou `DESCONTO` quando o custo completa depois |
- | `K4` | — | `APROVADA`, `DESAPROVADA` (R$ 0, visível), `CORTADA`, `ALTERADA` ou `BLOQUEADA` (desbloquear devolve à fila, com justificativa) |
- | `K6` | — | `NF_CANCELADA` (nota cancelada inteira antes da decisão); lançamento `ABATIMENTO`; devolução parcial em `comissao_devolucao_pendencia` (`ABERTA` → `INFORMADA` ou `DISPENSADA`) |
- | `V0C` | `CANCELADA` (vira histórico, com motivo; só sem nota faturada) | — |
- | fim | `ENCERRADA` (tudo faturado e decidido) | — |
- | Dado | Vendedor | Gerência e Coordenação | Compras | Controladoria |
- | Comissão estimada | a que ele pôs | 🟡 OQ-21 | não | sim |
- | Custo real e diferença cotado × real | **não** | 🟡 | custo da OC | sim |
- | Valor da compra de um produto dele, em aprovação (`C8`) | **sim** | não | sim | sim |
- | Comissão real e justificativa | só depois da decisão | decidem | não | sim |
- | Complementos, descontos e abatimentos | os dele, com o motivo, depois de decididos | decidem | não | sim |
- | Visão geral e relatórios | não | 🟡 | não | sim |
- | Pendência de devolução parcial | não | não | não | sim (com o Fiscal) |
- | Motor atual (menor entre o percentual do vendedor e o de compras, regras fixas, bloqueios, blacklists) | existe em `core_comissionamento`, só leitura aqui ([[Comissoes]]) | ✅ (`api-acos-vital`) |
- | Módulo novo em `core_comissao`, em Operações | rascunhado e **testado num Postgres 18 em 19/10**; sem API nem tela | 🔴 Gustavo (banco), Nathan (telas) |
- | Comissão estimada na proposta (`K1`) | não existe; o simulador do Hub só pré-preenche o lado da compra | 🔴 |
- | Custo real por evento, com a NF de entrada como verdade (`K2`) | não existe | 🔴 Robert, Gustavo |
- | Recurso novo da pipeline: recebimento de NF-e (imposto real, data de recebimento) | não existe | 🔴 Nathan ([[Estudo-Omie-API]]) |
- | Custo obrigatório em todo lote e `GET /itens/custo` | `GET /itens/custo` e o custo da OC no lote existem na `develop` do MES (27/10 e 19/10); o custo obrigatório (BL-066) não | ✅ (`api-pcp`) rota; 🔴 obrigatório, Robert (OQ-07) |
- | Tela da Controladoria igual à do Simulador, com custo real, e visão geral (`K4`, N16-19) | não existe; o Simulador atual é a referência | 🔴 Nathan |
- | Aprovação do vendedor na compra acima do valor, lista de Compras e cancelamento | não existe; o modelo atual **ainda não conhece** | 🔴 |
- | Abatimento por devolução, pendência de devolução parcial e apuração do vendedor | o abatimento está no modelo; a pendência de devolução parcial e a apuração (OQ-42) **não** | 🔴 |
- | Tela da proposta no formato do Simulador | não existe; o Simulador atual calcula no navegador | 🔴 Robert (tela de proposta), Nathan (`K1`) |

## subfluxo mermaid

```text
flowchart TD
    subgraph SEC_VENDAS["Vendas · av-hub"]
        V03["V0.3 · Comissão estimada nasce"]
        V0C["V0C · Proposta cancelada"]
    end
    subgraph SEC_COMP["Compras · av-hub"]
        C7["C7 · Compras usa o valor correto na OC"]
        C8["C8 · Compra acima do valor<br/>vendedor aprova ou reprova"]
        C4["C4 · Emite a Ordem de Compra<br/>inclui OC de mão de obra"]
        NFE["NF de entrada<br/>valor real e imposto real<br/>CCP vincula à OC"]
    end
    subgraph SEC_EST["Estoque · MES"]
        E3["E3 · Atende pelo saldo<br/>custo real do lote"]
    end
    subgraph SEC_PROD["Produção · MES"]
        F1["F1 · Setores produtivos<br/>fabricado: só a matéria-prima"]
    end
    subgraph SEC_FIS["Fiscal · Omie"]
        O1["O1 · Emite a nota fiscal"]
    end
    subgraph SEC_COM["Comissão · av-hub · Operações"]
        K1["K1 · Comissão estimada"]
        K2["K2 · Recalcula com o custo real<br/>só as peças com custo real"]
        K3["K3 · Fecha por nota fiscal<br/>diferença na apuração seguinte"]
        K4["K4 · Controladoria, Gerência ou Coordenação decidem<br/>sempre justificam"]
        K5["K5 · Vendedor vê a comissão real e a justificativa"]
        K6["K6 · NF cancelada, devolvida ou recusada<br/>abatimento proporcional"]
        K1 --> K2 --> K3 --> K4 --> K5
        K3 -.-> K6
    end
    V03 --> K1
    V0C -.->|"vira histórico"| K1
    C7 --> C8 --> C4
    C4 -.->|"valor da OC, provisório"| K2
    NFE -.->|"substitui o valor da OC"| K2
    E3 -.->|"custo real do lote"| K2
    F1 -.->|"matéria-prima"| K2
    O1 --> K3
    O1 -.->|"cancelada, devolvida, recusada"| K6
```
