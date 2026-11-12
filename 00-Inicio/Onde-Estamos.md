---
tags: [inicio, status]
criado: 2026-10-14
estado-em: 2026-11-12
status: vigente
dono: Nathan
develop-conferida: [api-acos-vital bebca52, av-hub d82d58b, omie-elt-pipeline d8fddca, em 2026-11-12, só proposta, Compras e pipeline; api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, app-pcp 4c11886, omie-elt-pipeline master 0593c9f, em 2026-11-10]
fontes: [00-Fluxo-Mestre-0b, seção "O que já existe e o que falta" das notas de raia 01 a 15 (conferidas na develop em 05/11/2026, Bloco 3 da v3), Backlog-por-Frente, Registro-de-Decisoes (N16-01 a N16-149), Contratos-da-v2, api-pcp src/common/constants/item-parcial-status.constants.ts:33 (EM_PRODUCAO nunca gravado), av-hub lib/api/custoItensFixtures.ts (custo por item ainda com dados de exemplo), Dump-AvHub-Teste-2026-11-09 (09/11/2026), validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault)]
---

# Onde estamos (estado conferido na develop em 10/11/2026 e, no comercial, em Compras e na pipeline, em 12/11/2026)

**Em uma frase:** o fluxo do pedido já funciona da liberação ao recebimento, e a OP, o lote do fabricado e o custo por item já estão na `develop` do MES; o que falta é, sobretudo, o pedido da proposta no Omie, a API e o banco do Orçamento, a comissão nova e o documento de retirada. Publicar o MES na `main` (BL-035) é informação de publicação, não critério de pronto.

> [!info] Validação ponta a ponta de 10/11/2026
> O fluxo físico foi testado de ponta a ponta num ambiente Docker local, com a `develop` e os dados do tst: o pedido 28189 foi liberado, triado, destinado (uma OP de fabricação e uma de revenda), comprou, recebeu, passou pelas duas qualidades, foi produzido, embalado e entregue, com o Hub acompanhando cada etapa. Os problemas ficaram nas pontas e estão no backlog e nas pontas soltas: OC aberta pela "Nova ordem de compra" desliga a compra do pedido (BL-086), ICMS do item que não acompanha o destino (BL-087), custo real inacessível (BL-088), fabricado sem custo (BL-067), Torre de Fluxo vazia (BL-003), cadastros do tst (PS-046 a PS-051), dois pontos em que a `develop` não segue a regra do vault (Destinação sem rodada, PS-052; reprovação parcial na entrada, PS-053), conta `admin` genérica (RS-023) e cinco perguntas ao Nathan (OQ-49 a OQ-53). O "transformar proposta em pedido", que no teste dava 400, já foi corrigido na `develop` depois dele (av-hub PR #277).

**Quando consultar esta nota:** quando você precisar saber o que está pronto, o que falta e quem toca cada setor.

**Dono do status:** esta nota é o único resumo do estado do projeto, e o [[Backlog-por-Frente]] é a única lista de tarefas. As outras notas não repetem o status: as raias têm o detalhe dos seus nós (com arquivo:linha) e apontam para cá.

> [!warning] Pronto é estar na `develop` (F5, Nathan, 05/11/2026)
> **O critério de pronto é a `develop` dos sistemas**: se está na `develop`, o selo é ✅. A `develop` está congelada e é a versão mais atualizada; o software ainda não foi lançado. A `main` (a última versão publicada e testada) não é critério de pronto e só aparece como informação ("publicado na `main`: sim/não").
> **Em uso real hoje, só os dashboards, a tela de aprovação de vagas e as telas da gerência** (Nathan, 30/10/2026). O resto (Compras, ordem de compra, requisição, proposta, pedido manual, Torre, custo e as demais telas) ainda não tem uso real: nenhuma OC criada no av-hub existe no banco de produção. Onde uma nota antiga ainda disser "produção ❓" ou "não conferido em produção", leia "não conferido na `develop`" e confira. Mudanças de formato, como a numeração só com dígitos (N16-148), não têm dado real para migrar.

O estado é o da `develop` dos cinco sistemas lida em 05/11/2026 e, nas raias tocadas pela validação, em 10/11/2026 (commits no `develop-conferida` acima e em [[Ultima-Atualizacao-do-Vault]]). Cada linha resume a seção "O que já existe e o que falta" da raia, que cita repositório e arquivo:linha. Publicado na `main`: a `main` do MES parou em 08/10, então a OP, o lote do fabricado e o custo por item (26 e 27/10) ainda não foram publicados (BL-035). A API da proposta e as telas já existem; o Orçamento, a conferência de Compras (`C6` a `C8`) e a comissão nova ainda não têm código. A fila de trabalho está em [[Backlog-por-Frente]].

**Decisões de 30/10/2026 (N16-145 a N16-148):** o Ciclo 1 passa a incluir o documento de retirada (BL-007), BL-049 e BL-050 (déficit do Robert de 36,1 pd e fim em 03/03/2027 a 75% de foco; o Robert valida a conta); os modelos dos documentos de retirada e de devolução da sobra ao Estoque foram aprovados; o número da proposta e da ordem de compra é só dígitos no banco, com o prefixo só na tela e no PDF; só o perfil Admin vê a Torre de Fluxo por enquanto.

## Resumo por setor

| Setor | Como está | Quem toca | O que falta |
|---|---|---|---|
| [[01-Proposta-de-Venda]] | 🟡 API e telas da proposta existem na `develop`; o envio ao Omie existe na API (`1654f65`), falta o banco e a tela. Desde 12/11 a tela tem o PDF comercial, o item só do catálogo e o encargo da condição do Omie (av-hub #278 a #291) | Robert (rotas e telas), Gustavo, Pablo acompanha | Aplicar no tst a migration do encargo (PS-054); versionar e aplicar em produção as migrations do "Transformar em pedido" e do envio ao Omie: a função de 4 argumentos já está no banco de teste ([[Dump-AvHub-Teste-2026-11-09]]), mas as migrations de 05/11 e 06/11 estão fora do repositório (BL-024); o BFF e a tela já chamam o `transformar` com as seis respostas do modal, inclusive Qualidade e faturar em partes (av-hub PR #277, 10/11), e o "Tentar novamente"; falta a data por item (N16-150) e liberar a tela Propostas ao perfil Vendedor (PS-046); fazer o teste do pedido mínimo no Omie (BL-081); motor da comissão na API; decidir o schema (`core_comercial` ou `core_vendas_faturamento`, N16-116) |
| [[02-Orcamento-Base-de-Preco]] | 🟡 Telas no front (`develop`) · 🔴 sem API e sem banco (existia só no `api-comercial` de teste, removido do av-hub em 06/11/2026 (PR #261, `dd9d729`), F3) | Pablo, Robert, Gustavo | Portar oferta, histórico e pedido de custo para a `api-acos-vital`; base de preço gerada das compras; página do produto com score e volatilidade; pedido de custo ao Orçamento |
| [[03-Pedido-de-Venda-e-Liberacao]] | ✅ Liberação funciona · 🔴 pedido no Hub | Nathan, Gustavo | Pedido do Omie no mesmo fluxo do pedido da proposta; compras e faturamento em partes na tela do pedido |
| [[04-PCP-Triagem-e-Destinacao]] | ✅ Triagem e Destinação · 🔴 volta de reprovado | Robert | Caminho para o item reprovado (retrabalho ou nova compra); mostrar a OC do pedido ao PCP. A Ordem de Produção já é emitida e impressa e a Triagem mostra as requisições do hub (`develop`, 23 e 27/10) |
| [[05-Estoque-Atendimento]] · [[09-Estoque-Entrada-do-Lote]] · [[12-Estoque-Despacho]] | ✅ Atendimento · 🔴 despacho | Robert | Documento de retirada com baixa na retirada (no Ciclo 1; modelos de retirada e de devolução aprovados em 30/10, N16-145 e N16-146); saldo futuro. O custo do item e o fabricado virando lote já estão na `develop` (27/10) |
| [[06-Circuito-de-Compra]] | ✅ Compra, aprovação e envio ao Omie · ✅ o MES lê a OC (`develop`) · ✅ API e tela dos avisos do MES (LOG-58, 12/11) | Robert, Gustavo | O MES mandar os avisos de recompra e de recebimento reaberto (LOG-58); mostrar a OC do pedido ao PCP e o saldo futuro; regra de aprovação definitiva com Compras |
| Conferência de Compras (`C6` a `C8`) | ✅ API e tela na `develop` (api-acos-vital `bebca52`; av-hub #282 e #283, 12/11) | Nathan, Gustavo | A margem considerada (BL-078) e o teste com dado real |
| [[07-Recebimento]] | ✅ Recebimento por OC e por NF na `develop` | Robert | Conferir contra a OC (preço, quantidade, fornecedor, N16-135); rateio da chegada; testar em homologação |
| [[08-Qualidade-Entrada]] | ✅ Inspeção, aprovação e cisão do lote · 🔴 fechar a RNC | Robert, Gustavo | Fechar a RNC (relatório de não conformidade) no MES; avisar Compras da recompra por RNC (sem contrato); travar a decisão ao setor da Qualidade (N16-124) |
| [[10-Producao-e-Roteiro]] | ✅ Filas, roteiro individual e OP impressa · 🟡 matéria-prima | Robert | A matéria-prima já baixa no "Atender pelo estoque"; a decisão é baixar na retirada (N16-140); gravar os status `EM_PRODUCAO` e `BLOQUEADO` do pedido (nunca são gravados); tela do novo norte e de divergência de produção |
| [[11-Qualidade-Saida]] | ✅ Aprovar leva ao Estoque · 🔴 reprovar só uma parte | Robert | O aprovado já volta ao Estoque como lote `PRODUCAO` (`develop`, 27/10); reprovar só uma parte (N16-128); confirmar se ainda sobra porta direta na Expedição |
| [[13-Expedicao]] | 🟡 Parcial | Robert | Consolidar carga; transporte; resolver o pedido integral travado por item que não chega; confirmar as portas de entrada |
| [[14-Fiscal-Omie]] | ✅ Lado Omie · 🔴 aviso do MES | Robert, Gustavo, Nathan | Ligar a Expedição à nota do Omie; faturamento em partes; testar como o Omie cria o sequencial |
| [[15-Custo-Real-e-Comissao]] | 🔴 Sem API e sem tela · 🟡 `core_comissao` modelado e testado no banco | Gustavo, Nathan, Robert | Schema novo da comissão; motor de cálculo; custo real por evento; decisão da Controladoria; custo obrigatório em todo lote |

## Assuntos que cruzam os setores

| Tema | Como está |
|---|---|
| Requisição MES ↔ av-hub | ✅ Funciona nos dois sentidos, por pedido imediato e por consulta a cada 5 minutos |
| Status por item | ✅ Pronto |
| Torre de Fluxo (painel de acompanhamento) | 🟡 API, rotinas e telas prontas no av-hub (telas sobre dados de exemplo, desde 15/10); o MES não envia os eventos e a Torre fica vazia com dados reais (BL-003, confirmado em 10/11); só o perfil Admin (os desenvolvedores) vê as telas, por enquanto (N16-148, BL-021) |
| Custo por item | 🟡 O lote nasce com o custo da OC e o MES publica `GET /itens/custo` (27/10, na `develop`); a tela do hub lê os dados reais (os de exemplo só entram se a API falhar fora de produção), mas o acesso e a filial travam o uso (BL-088), e o fabricado chega com custo 0 (BL-067). O Ciclo 1 segue sem imposto; o modelo com impostos foi desenhado em 29/10 (N16-144) |
| Cadastros TESTE no Omie | 🟡 O Omie não tem ambiente de teste. Os cadastros TESTE do Nathan entram nos relatórios: filtre ao conferir |
| Pendências de cadastro | ❓ Feitas pelo Nathan em 30/10/2026: perfil CCP criado e usuários vinculados à Gerência de Compras (BL-017, RS-015). No banco de teste de 10/11 elas não aparecem: nenhum Comprador vinculado, Gerência de Compras sem usuário, MES com um perfil só (PS-047, PS-049, PS-050) |

## Publicado na main (informação)

Não é critério de pronto (F5): mostra o que já foi publicado. Contagem de 05/11/2026 (`git rev-list --count origin/main..origin/develop`):

| Sistema | Commits da `develop` fora da `main` | Última `main` |
|---|---|---|
| `api-acos-vital` | 0: tudo o que está na `develop` já foi publicado (a `main` tem 35 commits de merge a mais) | 03/11/2026 |
| `av-hub` | 12 | 04/11/2026 |
| `api-pcp` | 53 | 08/10/2026 |
| `app-pcp` | 51 | 08/10/2026 |

O Nathan afirma que tudo o que está na `develop` foi testado e funciona, e que o merge para a `main` pode ser feito a qualquer momento 📝. No MES, a OP, o lote do fabricado e o custo por item ainda não foram publicados: o merge é do Robert (BL-035). O banco de produção do MES, pelo dump de 07/10, não tem as migrations da `develop` ❓ ([[Banco-MES]]). Em 29/10/2026 a `api-acos-vital` igualou a `main` à `develop` (PR #305).

## Próximos passos

A ordem por nó do 0b está em [[Backlog-por-Frente]]. As pontas soltas estão em [[Pontas-Soltas]] e os riscos em [[Riscos]].

## Detalhe técnico

Versão completa da tabela por setor, com os nós do [[00-Fluxo-Mestre-0b]] e o dono de cada pendência.

| Raia | Nós | Estado | O que falta | Dono |
|---|---|---|---|---|
| [[01-Proposta-de-Venda]] | V0.1–V0.7, V0C | 🟡 API e telas da proposta na `develop` | A rota de proposta (criar, revisar, aprovar, cancelar, copiar, transformar) existe na `api-acos-vital` e as telas, no av-hub, com o Robert; o banco de teste já tem o "Transformar em pedido" de 4 argumentos e o envio ao Omie (dump de 09/11/2026), mas as migrations de 05/11 e 06/11 ainda não foram aplicadas em produção; ligar a tela ao `transformar` com o corpo do modal e ao envio ao Omie, que já existe na API (direto, sem fila), e decidir o schema (N16-116 diz `core_vendas_faturamento`, o código usa `core_comercial`); estados `ABERTA`, `APROVADA`, `TRANSFORMADA`, `CANCELADA` e `EXPIRADA` (validade sem decisão N16) | Robert, Gustavo, Pablo acompanha |
| [[02-Orcamento-Base-de-Preco]] | B1–B4 | 🟡 menu e abas no front | Base de preço gerada das OCs; página do produto com score e volatilidade; pedido de custo sem prazo, com o tempo cronometrado | Pablo, Robert, Gustavo |
| [[03-Pedido-de-Venda-e-Liberacao]] | V1–V3 | ✅ liberação · 🔴 pedido no Hub | Pedido do Omie no mesmo fluxo do pedido da proposta (N16-106); parte de compras e faturamento em partes na tela do pedido | Nathan, Gustavo |
| [[04-PCP-Triagem-e-Destinacao]] | P1, P2, P6 | ✅ P1/P2 · 🔴 P6 | Novo norte (retrabalho ou reabre compra): o motor passou a ler o `RoteiroItem`, mas a volta de reprovado segue sem tela; renomear rotas antigas; **OC do pedido** visível ao PCP. ✅ **Ordem de Produção** emitida na criação e imprimível (27/10, `develop`); ✅ requisições do hub na Triagem (23/10) | Robert |
| [[05-Estoque-Atendimento]] (E1–E4) · [[09-Estoque-Entrada-do-Lote]] (E5) · [[12-Estoque-Despacho]] (E6) | E1–E6 | ✅ E1–E5 · 🔴 E6 | **Documento de retirada com baixa na retirada** (hoje baixa em `receber()`); ✅ custo do item (`GET /itens/custo`) e fabricado virando lote `PRODUCAO` (27/10, `develop`); **saldo futuro** (saldo atual + OCs em andamento de estoque) | Robert |
| [[06-Circuito-de-Compra]] | P3, C0–C5, FN1 | ✅ ida e volta e aprovação (C3) · ✅ o MES lê a OC do hub (C0, `develop`) | Aprovação já funciona (OC acima de R$ 30 mil: Gerente de Compras; até R$ 30 mil: compradores livres) e endurece depois com Compras 🟡; o MES já lê as OCs (K4, 15/10) e a referência das requisições (23/10); falta mostrar a OC do pedido ao PCP e o saldo futuro ao Estoque; envio real da OC ao Omie testado em 14/10, produção ❓ | Robert, Gustavo |
| [[06-Circuito-de-Compra]] | C6–C8 | ✅ API, banco de teste e tela na `develop` (12/11) | Conferência da parte de compras na emissão da OC (API-019); aviso de compra acima do custo do vendedor em Meus Pedidos e a lista de Divergências de Compras (`divergencias_compra`, LOG-57); falta a margem considerada (BL-078) | Nathan, Gustavo |
| [[07-Recebimento]] | R0–R6 | ✅ | ✅ custo da OC no lote, recebimento por OC e por NF (várias OCs na mesma nota, N16-136) na `develop`; falta a conferência contra a OC (N16-135), o rateio da chegada e testar em homologação | Robert |
| [[08-Qualidade-Entrada]] | Q1–Q4 | ✅ inspeção · 🔴 fechar RNC | Fechar a RNC (nota de devolução e baixa do lote reprovado, hoje manual); recompra por RNC sem contrato; travar a decisão à Qualidade (N16-124) | Robert, Gustavo |
| [[10-Producao-e-Roteiro]] | F1 | ✅ filas · 🟡 matéria-prima | Matéria-prima baixa no "Atender pelo estoque" (19/10), a decisão é na retirada (N16-140) 🔴; `StatusPedido.EM_PRODUCAO` e `BLOQUEADO` nunca são gravados (`api-pcp` `src/common/constants/item-parcial-status.constants.ts:33`; `BLOQUEADO` só é lido em `src/dashboard/dashboard.service.ts:86`); divergência de produção sem tela | Robert |
| [[11-Qualidade-Saida]] | Q7, Q8 | ✅ aprovar · 🔴 reprovar parte | 🔴 reprovar só uma parte (N16-128); ✅ `aprovar-saida` e `receber-fabricado`: o aprovado volta ao Estoque como lote `PRODUCAO` (`develop`, 27/10); confirmar se ainda sobra porta direta na Expedição | Robert |
| [[13-Expedicao]] | X1–X4 | 🟡 | Consolidar carga (X3), transporte (X4); integral travado por item que não chega (T-06); confirmar as portas de entrada depois do fabricado voltar ao Estoque | Robert |
| [[14-Fiscal-Omie]] | O1, O2 | ✅ lado Omie · 🔴 sinalização | Contrato que ligue a Expedição à NF do Omie (ligação do O1); faturamento em partes (sequenciais ligados ao item do pedido) e teste de como o Omie cria o sequencial (PS-037) | Robert, Gustavo, Nathan |
| [[15-Custo-Real-e-Comissao]] | K1–K6 | 🔴 sem API e tela (desenho aprovado em 26/10) · 🟡 schema testado no banco | Schema `core_comissao` na API; motor na API; custo real por evento; fila e decisão da Controladoria; custo obrigatório em todo lote no MES | Gustavo, Nathan, Robert |

Transversais, na versão técnica:

| Tema | Estado |
|---|---|
| Integração requisição MES ↔ av-hub (LOG-34, LOG-35) | ✅ ida e volta; sob demanda e polling de 5 min ([[Integracao-AvHub-MES]]) |
| Status por item (API-005, API-006) | ✅ |
| Torre de Fluxo (LOG-46) | 🟡 API e jobs no av-hub; BFF `/api/fluxo/*` e 4 telas no HUB sobre dados de exemplo (15/10); o MES não publica `/fluxo/eventos`; a 046b só deu as telas ao perfil de testes do time de TI, e só o Admin as vê por enquanto (N16-148, BL-021) |
| Custo por item (API-008, LOG-47) | 🟡 `lote_custo` nasce com o custo da OC (19/10) e `GET /itens/custo` está publicada na `develop` do MES (27/10); falta o hub ler (a tela usa `custoItensFixtures`, `av-hub` `lib/api/custoItensFixtures.ts`); publicado na `main`: ainda não (BL-035). O Ciclo 1 segue sem imposto; o modelo com impostos foi desenhado em 29/10 (N16-144); falta código; a fórmula do custo com imposto segue o motor do comissionamento, e cada setor confere as mudanças na implementação |
| Cadastros TESTE no Omie | 🟡 O Omie não tem ambiente de teste; os cadastros TESTE do Nathan entram na pipeline e nos relatórios: filtrar ao conferir (BL-055) |
| Pendências cadastrais | ❓ Perfil CCP e vínculo de usuários à Gerência de Compras: feitos pelo Nathan em 30/10/2026 (BL-017, RS-015); cadastro no banco, não conferido no ambiente |
