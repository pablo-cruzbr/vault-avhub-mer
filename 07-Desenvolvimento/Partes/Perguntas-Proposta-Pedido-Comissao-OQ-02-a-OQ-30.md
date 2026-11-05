---
tags: [decisoes, perguntas, oq, consulta, proposta, orcamento, comissao, staging, parte]
criado: 2026-11-05
estado-em: 2026-10-29
status: proposta
dono: Nathan
parte-de: "[[Perguntas-Proposta-Pedido-Comissao]]"
fontes: [Proposta-Orcamento-Comissao/00-Briefing-Decisoes (OQ-02 a OQ-12, fora do vault), Proposta-Orcamento-Comissao/08-Reuniao/Proposta-Orcamento-Pedido-Comissao.docx (fora do vault) (perguntas das seções 4 e 5), Modelo-de-Consulta, api-comercial 5aa5311, Dump Avhub 14/10, Registro-de-Decisoes]
---

# Perguntas em aberto: OQ-02 a OQ-48: OQ 02 a OQ 30

**Em uma frase:** parte da nota [[Perguntas-Proposta-Pedido-Comissao]] com "2. OQ-02 a OQ-12 (do briefing)", "3. OQ-13 a OQ-30 (descobertas ao documentar)", "4. Consultas que saem daqui", "5. Perguntas do documento de 16/10 já respondidas por decisão". O texto foi movido sem mudança.

**Onde estamos:** ← [[Perguntas-Proposta-Pedido-Comissao]] (resumo e índice) · partes: [[Perguntas-Proposta-Pedido-Comissao-Quadro-Geral]] · **Perguntas-Proposta-Pedido-Comissao-OQ-02-a-OQ-30**

## 2. OQ-02 a OQ-12 (do briefing)

### OQ-02 · Prazo de resposta do pedido de custo e o que fazer se vencer

**Contexto.** N16-06 manda ter prazo, sem valor. O código já tem: `SolicitacaoCusto.prazoResposta` é obrigatório e o prazo padrão é de **2 dias úteis** ("SLA padrão", `api-comercial/src/modules/custos/custos.routes.ts:378`); a fila mostra `ATRASADA`, `VENCE_HOJE` ou `NO_PRAZO` (`:338`). Não há regra para o vencimento além do rótulo.

**Opções para o vencimento.** (a) só destacar na fila do Orçamento; (b) avisar o gerente do Orçamento; (c) liberar o vendedor para cotar sozinho (a rota `POST /solicitacoes_custo/:id/liberar` existe, `custos.routes.ts:500`); (d) cancelar a solicitação. **Opções para o prazo:** fixo (2 dias úteis), escolhido pelo vendedor, ou por tipo de produto.

**Quem responde.** João Vitor. **Default 🟡:** 2 dias úteis, rótulo `ATRASADA`, aviso ao gerente do Orçamento, e o vendedor **nunca fica bloqueado** (N16-06): ele pode seguir sozinho. **Vira:** CON-03.

### OQ-03 · Quem decide o que fazer com o cliente quando o custo real passa do cotado?

**Contexto.** O sistema não avisa o vendedor (N16-18); a Controladoria vê a diferença. Renegociar o preço, absorver a perda ou cancelar é decisão de pessoas.

**Opções.** O vendedor com a Gerência; só a Gerência; o vendedor sozinho dentro de um limite.

**Quem responde.** João Vitor. **Default 🟡:** a decisão fica **fora do sistema** neste ciclo; a Gerência decide com o vendedor. **Vira:** CON-03.

### OQ-04 · Quem aprova desconto e margem, e até quanto cada um aprova?

**Contexto.** A aprovação é física neste ciclo (N16-12) e entra no sistema no próximo. A resposta define a regra desse ciclo.

**Opções.** Alçadas por faixa de desconto, por faixa de margem, por valor total da proposta ou por cliente; um aprovador por faixa.

**Quem responde.** João Vitor. **Default 🟡:** nada a construir neste ciclo; a pergunta fica aberta para o próximo contrato. **Vira:** CON-03.

### OQ-05 · Relatórios da visão geral da Controladoria

**Contexto.** A Controladoria vê tudo até chegar a ela e tem a visão geral de todas as comissões (N16-10). Falta saber quais relatórios entram **no primeiro momento**.

**Candidatos 🟡.** Comissão por vendedor e por mês; estimada × real × final; pendentes de decisão; decididas por ação (aprovada, desaprovada, bloqueada, cortada, alterada); diferença entre custo cotado e custo real por proposta; comissões de propostas canceladas (histórico).

**Quem responde.** Michele. **Default 🟡:** lista filtrável por mês, vendedor, unidade e status, com totais e exportação em planilha. **Vira:** CON-04.

### OQ-06 · Bloqueio, blacklists e coordenadores no módulo novo

**Contexto.** N16-11 traz o motor atual para a proposta: percentual final = menor entre o do vendedor e o de compras, regras fixas, bloqueios e blacklists. Falta confirmar com a Michele se **todos** valem no módulo novo e como ficam os coordenadores (hoje `comissao_coordenadores`, ainda lidos de JSON no front, LOG-42).

**Opções.** (a) Copiar tudo (bloqueio por NF, blacklist de clientes, blacklist de vendedores, regras fixas) e manter as listas separadas do módulo atual; (b) as listas passam a ser uma só, compartilhada; (c) coordenadores ficam no módulo atual até uma decisão própria.

**Quem responde.** Michele. **Default 🟡:** (a) e (c). **Vira:** CON-04.

### OQ-07 · Custo obrigatório em todo lote, inclusive carga inicial de 13/11

**Contexto.** N16-09 torna o custo obrigatório em todo lote e supera o #93. A carga inicial em lote (G1, BL-031) está em desenvolvimento pelo Robert para 23/10, com custo **opcional**, antes do levantamento físico de 26 a 30/10 e do marco zero de 13/11. Exigir custo de todo o saldo inicial é trabalho de Compras e Controladoria, não só de código.

**Opções.** (a) Obrigatório já na G1: sem custo, a linha não entra; (b) obrigatório no Recebimento (`R4`) e, na carga inicial, custo informado ou custo estimado com origem `MANUAL`, motivo obrigatório e auditoria (a origem `MANUAL` já existe, `estoque.prisma:378-382`); (c) obrigatório só depois do marco zero.

**Quem responde.** Robert (escopo e data), com o Nathan. **Default 🟡:** (b). **Impacto:** muda a G1 e o K5 do Robert; ver a proposta de cronograma (`Proposta-Orcamento-Comissao/07-Cronograma/Proposta-de-Cronograma.md`, fora do vault, a validar). **Vira:** ponta solta técnica.

### OQ-08 · OC de serviço (mão de obra) existe no Compras?

**Contexto.** N16-09 diz que a mão de obra também é gerada na OC e entra no custo. No exemplo do Nathan, o item B é "1 Mão de obra". No código do av-hub, o item da OC exige produto do cadastro (LOG-36) e só tem `tipo_material` `acabado` ou `nao_acabado` ([[Estados-e-Status]]); não conferi se há produto do tipo serviço em `core.produtos` ❓.

**O que precisa responder.** Como Compras emite hoje a OC de mão de obra (produto de serviço no Omie, texto livre, outra rotina)? Que campos o item de serviço precisa (quantidade, valor, descrição, vínculo ao pedido) para gerar uma linha de custo por item e parcial?

**Quem responde.** Gustavo (cadastro) e Compras (processo). **Default 🟡:** item de serviço como produto do cadastro, vinculado ao pedido (`ordens_compra_itens_vinculos`), igual a qualquer item. **Vira:** CON-05.

### OQ-09 · Se o Omie recusar o pedido criado no hub

**Contexto.** O pedido segue o padrão da OC: a API grava numa fila e a pipeline envia. Na OC, o retorno do Omie vai por `PATCH /compras/ordens/:id/sincronizacao`; OC com erro **sai** da fila e só volta por "Reenviar" (`omie-elt-pipeline` `envioOrdensCompra.ts:18-40`; [[06-Circuito-de-Compra]]).

**Proposta 🟡.** O pedido do hub guarda `status_sincronizacao_omie` com `pendente`, `sincronizado` e `erro` (mesmo vocabulário da OC) e o texto do erro. O vendedor vê "Pedido não criado no Omie: <motivo>" e o botão "Tentar de novo". A proposta continua `APROVADA`; a marcação da Qualidade não se perde.

**Quem responde.** Nathan e Gustavo. **Vira:** ponta solta técnica.

### OQ-10 · Matriz de preços: dimensões

**Contexto.** N16-07 diz que a matriz será criada. Hoje existe só a oferta por produto e fornecedor, com histórico e média (`Oferta`, `suprimentos.prisma:138-183`).

**Candidatos 🟡.** Por unidade (Mogi, Uberaba, Aruja); por período de vigência; por condição de compra (CIF ou FOB, mínimo, prazo, origem do ICMS); por quantidade (faixas de escala); por moeda.

**Quem responde.** Nathan e Compras (o setor que vai usar). **Default 🟡:** produto × fornecedor × unidade × vigência até a resposta. **Vira:** CON-05.

### OQ-11 · De onde vêm o IPI, o ICMS, a ST e o DIFAL reais de cada evento de custo

**Contexto.** N16-20: cada evento de custo carrega as suas condições (condição de pagamento, encargo, impostos, frete, fornecedor) e o custo líquido do evento sai da fórmula do motor. A OC do hub **não guarda** IPI, ICMS, ST nem DIFAL por item (só preço, desconto e, no cabeçalho, frete, seguro, moeda e condição de pagamento; N14-23 deixou o Ciclo 1 sem imposto). O desenho do imposto por item já era a PS-014 e o BL-053.

**Opções.** (a) campos novos na OC e no item da OC, preenchidos por Compras; (b) a nota fiscal de entrada (chave de 44 dígitos que o Recebimento já confere; `ListarNF` da pipeline); (c) as duas, com a NF como verdade.

**Quem responde.** Nathan, Gustavo e Compras. **Default 🟡:** (c). **Impacto:** sem a resposta, o custo real por evento sai **sem imposto** (como o Ciclo 1), e o cenário com imposto do motor não fecha; ver a proposta de cronograma (`Proposta-Orcamento-Comissao/07-Cronograma/Proposta-de-Cronograma.md`, fora do vault, a validar) (dependência 🔴). **Vira:** ponta solta técnica ligada à PS-014 e ao BL-053.

### OQ-12 · Encargo financeiro do evento

**Contexto.** O encargo do evento vem da condição de pagamento da OC (código e parcelas). Hoje a OC não guarda o percentual de encargo; o Simulador usa o encargo cadastrado por condição (ex.: 28/45, 1,5%).

**Opções.** (a) calcular das parcelas (vencimento e valor) da OC; (b) cadastrar o percentual por condição de pagamento.

**Quem responde.** Gustavo e Compras. **Default 🟡:** (b), reaproveitando o cadastro de condições do motor. **Vira:** ponta solta técnica.

## 3. OQ-13 a OQ-30 (descobertas ao documentar)

| ID | Contexto e origem | Opções | Default 🟡 |
|---|---|---|---|
| **OQ-26** Quem marca "aprovada" | A aprovação da Gerência é física (N16-12), mas o sistema precisa de um estado "aprovada" que libere o botão `V0.6` (N16-02) e trave a edição (N16-03). Origem: leitura do `StatusProposta` (`ABERTA`, `PARCIAL`, `FECHADA`, `PERDIDA`, `enums.prisma:69-76`), que não tem esse papel | (a) o vendedor marca "Aprovada pela Gerência" e confirma que tem a aprovação física, o sistema grava quem, quando e **qual revisão**; (b) só perfil da Gerência marca; (c) o vendedor marca e a Gerência confirma depois no sistema (próximo ciclo) | (a), com o número da revisão e os totais na tela de confirmação |
| **OQ-27** "Cancelada" é "perdida"? | O briefing fala em proposta **cancelada**; o código tem `PERDIDA` com motivo obrigatório e `reabrir` (`propostas.service.ts:555-606`) | (a) um só estado `CANCELADA` com o motivo da perda; (b) dois estados: `PERDIDA` (cliente não fechou) e `CANCELADA` (vendedor desistiu); reabertura: (i) nunca, o vendedor duplica (`POST /:id/duplicar` existe, `propostas.routes.ts:125`), (ii) só antes de aprovar | (a) e reabertura (i): cancelada não volta; duplica |
| **OQ-13** Evento do custo real | N16-09 diz "por evento" e "vem da ordem de compra". Não diz em que momento a linha nasce. Origem: exemplo do Nathan (dias 01 a 05) | OC: (a) emitida, (b) aprovada, (c) recebida. Lote do Estoque: (a) reserva (`E3`), (b) saída (`E6`) | OC **aprovada** (valor firme; OC cancelada estorna a linha); lote na **reserva** (`E3`), confirmada na saída (`E6`) |
| **OQ-14** Dois números do pedido | N16-04 diz "só números" e "sincroniza com o Omie". O Omie atribui o próprio número (`numero_pedido`), que é a chave em `pedidos_vendas`, na liberação e no MES; o número próprio iria em `cCodIntPed` (limite de 20 caracteres). A OC usa `OC-000001` por unidade (`fn_proximo_numero_documento`, Dump Avhub 8110-8140) | Sequência: por unidade (como a OC) ou por empresa emissora e ano (como a proposta hoje) | Por **unidade e tipo** (`contadores_documento`, com `CHECK` ampliado para `proposta` e `pedido_venda`); o número do Omie continua a chave no MES |
| **OQ-15** Liberação gravada na criação | `pedidos_vendas_liberacao` tem chave `(codigo_empresa, numero_pedido)` com o número do Omie, `acompanhamento_qualidade` e `liberado_por` obrigatórios (Dump Avhub 18285-18296). O número do Omie só existe depois da resposta da API | (a) a pipeline, ao trazer o pedido (casa por `cCodIntPed`), grava a liberação com o que a proposta guardou; (b) a pipeline grava a liberação na resposta do `IncluirPedido`; (c) trigger no banco | (b): é o momento em que o número do Omie nasce; sem janela em que o pedido existe sem liberação |
| **OQ-16** Etapa e campos do pedido no Omie | A view da liberação só aceita pedido com `etapa <> 0` ([[03-Pedido-de-Venda-e-Liberacao]] regra 10); etapa 0 é orçamento no Omie. Os nomes das etapas 10, 15 e 20 estão pendentes (#52) | Etapa inicial: a de "Pedido de venda" da conta; campos: vendedor, condição, parcelas, projeto, frete | Etapa de pedido de venda; Gustavo e Nathan conferem no Omie |
| **OQ-17** Pedido mexido no Omie depois | Se alguém altera item ou cancela o pedido direto no Omie, a proposta aprovada e a comissão estimada divergem. Origem: LOG-45 e #15 (o Omie é o sistema fiscal) | (a) só aviso e a pipeline traz o que mudou; (b) pedido cancelado cancela a proposta e a comissão vira histórico | (a); decisão de negócio com João Vitor |
| **OQ-19** Pedido sem proposta | Para o pedido que chega do Omie sem proposta não há `V0.3`, logo não há `K1`. O `V2` e o `V3` seguem como hoje (N16-05) | (a) `K2` e `K3` calculam só na NF com o custo real, sem estimativa; (b) o vendedor preenche uma estimativa no pedido | (a): a comissão nasce na NF; o motor é o mesmo |
| **OQ-20** "Parte de compras vazia" | N16-03 impede aprovar proposta incompleta. O código aceita item sem custo (`origemCusto = SEM_CUSTO`, `vendas.prisma:144`) | (a) qualquer item sem custo e sem fornecedor deixa a proposta incompleta; (b) só quando **todos** os itens estão vazios; (c) item de serviço fica fora | (a), com (c) a confirmar |
| **OQ-21** Perfis e permissões | N16-13: "cada perfil recebe o seu módulo". A capacidade hoje deriva de telas (`propostas`, `propostas-valores`, `custo-item`, `painel-comprador`, `simulador`, `capacidades.ts:47-56`) e o SQL de 16/10 cria `solicitacoes-custo`. Faltam as telas da comissão e da decisão da Controladoria | Lista de perfis por módulo; quem vê custo, margem e comissão estimada | Matriz 🟡 da seção "Permissões"; Gustavo cadastra |
| **OQ-22** PTAX de que dia | N16-13: a PTAX do hub. A proposta em USD ou EUR guarda `cotacaoMoeda` (`vendas.prisma:62`); o `api-comercial` usa AwesomeAPI (`cambio.ts:1-2`) | Dia da criação da revisão, da aprovação ou da criação do pedido | Dia da **aprovação** (congela com o preço fechado); a OC usa a PTAX da OC ([[Contratos-da-v2\|LOG-11]]) |
| **OQ-23** Unidade de medida diferente | Proposta em `PC`, `KG`, `M`, `TN`...; OC e lote em outra unidade. Já era a PS-006 e o D2 do 008, que o N16-09 supera | (a) fator de conversão por produto; (b) bloquear até alguém converter à mão; (c) custo parcial marcado "unidade diferente" | (c) no Ciclo 1; (a) depois. **Pergunta a Compras** |
| **OQ-24** Produto pendente vira pedido? | Produto novo na proposta nasce `PEND-xxxx` sem cadastro no Omie (`produtos_pendentes`, [[Contratos-da-v2\|LOG-52]] seção 3.3); o Omie recusa item sem cadastro | (a) a proposta com produto pendente não vira pedido até o cadastro; (b) `V0.7` cria o produto no Omie | (a) |
| **OQ-25** Comissão enquanto o custo é parcial | No exemplo do Nathan o item A passa dias com 10, 30 e depois 50 de 50 flanges cobertas. N16-09 diz que o custo é parcial; não diz como `K2` recalcula nesse intervalo ([[15-Custo-Real-e-Comissao]]) | (a) custo real do coberto mais cotado do restante; (b) só recalcula quando o item está completo; (c) usa o custo médio já comprado para todo o item | (a). Pergunta à Michele (CON-04) e ao Gustavo |
| **OQ-28** Aprovação de Compras sobre o percentual | **Respondida em parte: o passo de Compras sai do fluxo, mas Compras ainda valida o valor estimado.** O Simulador atual tem um passo de Compras: abre a simulação do vendedor, cria uma versão com os custos corrigidos (origem `COMPRAS`) e aprova; o percentual final é o menor entre o do vendedor e o de Compras (`simulacoes.route.js:30-36`, `:233-259`; `simulador/page.tsx:1192-1234`; chip "Comissão: após a aprovação de Compras" na imagem do Simulador). N16-08 diz que Compras **não altera a proposta**; N16-19 manda usar o mesmo motor | (a) o passo some: o cálculo `REAL` gerado pelos eventos de custo (`C7`, OC, lote) faz o papel da versão de Compras; (b) Compras ainda aprova a comissão estimada antes de a proposta ser aprovada; (c) Compras confere só (`C6`), sem aprovar percentual | (a). Pergunta a Michele e ao Nathan (CON-04) |
| **OQ-29** Pedidos de Venda e NF de Saída | O Nathan inativou as duas telas na api-test (16/10). O SQL de produção não as toca. As páginas seguem no código em `app/(protected)/vendas/pedidos-de-venda` e `.../notas-fiscais-saida` | (a) inativar também em produção, no mesmo SQL; (b) manter só em produção até decidir | (a) se o Nathan confirmar; o Gustavo inclui o passo no SQL |
| **OQ-30** Correção da marcação no pedido da proposta | Hoje o vendedor corrige a marcação até o MES importar (regra 5 de [[03-Pedido-de-Venda-e-Liberacao]]). A proposta aprovada não muda (N16-03), mas a marcação do pedido sim | (a) manter a correção, com histórico `alterado`; (b) bloquear para o pedido de origem proposta | (a) |

## 4. Consultas que saem daqui

| Consulta | Para quem | Perguntas que entram | Observação |
|---|---|---|---|
| **CON-03** Gerência | João Vitor | OQ-02, OQ-03, OQ-04 | OQ-04 respondida por N16-75 e o fluxo da compra acima do valor confirmado por N16-76: nada mais a perguntar ao João Vitor. OQ-17, 20, 26 e 27 já respondidas pelo Nathan (N16-30, N16-31, N16-25, N16-24); o João Vitor pode contestar |
| **CON-04** Controladoria | Michele | OQ-05, OQ-25, OQ-28 (OQ-06 e OQ-19 já respondidas, N16-34 e N16-35; a Michele confirma), mais as duas perguntas do documento de 16/10 que não viraram OQ: "o que a Controladoria ajusta (percentual, valor ou os dois) e com qual justificativa" (já decidido em N16-10: aprova, desaprova, bloqueia, corta, altera, sempre justifica) e "a estimada da proposta cancelada, guardada como histórico, atende a auditoria?" | Se a Michele confirmar N16-10, essas duas somem |
| **CON-05** Compras e Orçamento | Compras (Gerente de Compras, compradores) e quem vai operar o Orçamento | OQ-32 (parte aberta), OQ-34 (OQ-08, 10, 22, 23 e 33 respondidas) | O setor orçamentário ainda não tem nome de pessoa no vault ❓ |

Perguntas que **não** viram Consulta e vão para [[Pontas-Soltas]] (em 26/10/2026 entraram lá como PS-035 a PS-039; as que seguem abertas estão nesta lista): OQ-07, OQ-15, OQ-16, OQ-21 e os campos novos da OC (N16-38; a fonte do imposto por item da OC foi decidida em 29/10, N16-144, e o contrato só será escrito quando o desenvolvimento começar). As OQ-12, 14, 24 e 30 foram respondidas e só viram requisito do contrato.

## 5. Perguntas do documento de 16/10 já respondidas por decisão

| Pergunta do documento | Resposta |
|---|---|
| "Uma proposta marcada como incompleta pode ser aprovada?" (João Vitor) | Não: N16-03 |
| "Até quando uma proposta aprovada pode ser revisada?" (João Vitor) | Não pode: N16-03 (ajuste só até aprovar) |
| "O bloqueio de comissões e as listas de bloqueio valem também no módulo novo?" (Michele) | N16-11 traz bloqueios e blacklists; resta confirmar (OQ-06) |
| "A Controladoria quer ser avisada ou só ver a diferença?" (Michele) | A Controladoria vê o custo real e a diferença (N16-18); o vendedor não recebe aviso |
