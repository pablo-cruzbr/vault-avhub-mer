---
tags: [decisoes, perguntas, oq, consulta, proposta, orcamento, comissao, staging]
criado: 2026-10-16
estado-em: 2026-11-10
status: proposta
dono: Nathan
fontes: [Proposta-Orcamento-Comissao/00-Briefing-Decisoes (OQ-02 a OQ-12, fora do vault), Proposta-Orcamento-Comissao/08-Reuniao/Proposta-Orcamento-Pedido-Comissao.docx (fora do vault) (perguntas das seções 4 e 5), Modelo-de-Consulta, api-comercial 5aa5311, Dump Avhub 14/10, Registro-de-Decisoes, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault) (OQ-49 a OQ-53)]
---

# Perguntas em aberto: OQ-02 a OQ-53

**Em uma frase:** esta nota reúne as perguntas de negócio e de sistema sobre proposta, pedido, orçamento e comissão, com quem responde e o que cada uma trava.

## Como ler esta lista

- Cada pergunta tem um ID `OQ-nn` (OQ = open question, pergunta em aberto). O ID não é reaproveitado.
- Colunas do quadro geral: **Pergunta**, **Quem responde**, **Vira** (a Consulta `CON-nn` ou ponta solta técnica que nasce dela) e **Bloqueia** (o que fica parado até a resposta).
- Selos: ✅ respondida, ⏳ respondida em parte ou em estudo, ⏸ adiada, 🟡 default (o que o time adota se ninguém responder), ❓ não confirmado.
- Para achar o que é seu, procure seu nome ou seu setor em **Quem responde**.
- Respostas citam decisões `N16-nn`, em [[Registro-de-Decisoes]].
- Linhas longas começam com uma **frase em negrito** que resume a pergunta. O texto original vem logo depois, completo.
- Siglas: OC = ordem de compra; NF = nota fiscal; CCP = acompanhamento das compras (Follow-up); PCP = planejamento e controle da produção; MES = sistema de chão de fábrica.

## Resumo por tema

- **Já respondidas.** A maioria: prazo e setor do Orçamento (OQ-02), alçada (OQ-04), relatórios (OQ-05), bloqueios (OQ-06), mão de obra (OQ-08), matriz de preços (OQ-10), cancelada, aprovada e numeração (OQ-14, OQ-26, OQ-27), PTAX (OQ-22), unidade de medida (OQ-23) e score de fornecedor (OQ-46).
- **Aguardam o Nathan.** Gravar a liberação na criação do pedido (OQ-15) e etapa e campos do pedido no Omie (OQ-16), ambas em estudo. Criar sequencial e testar cancelar pelo Omie num pedido não faturado (OQ-48 e OQ-17; cancelar existe por API, N16-84; PS-037). Como o vínculo é guardado (OQ-34, com Gustavo). Da validação local em Docker de 10/11/2026: fabricação sem matéria-prima só vai para compra (OQ-49), Gerência Geral sem "Visualizar" em 12 telas (OQ-50), quem vê o custo real (OQ-51), quem emite a OC pode aprová-la (OQ-52) e as contas genéricas `admin` em produção (OQ-53).
- **Aguardam Compras, PCP e Recebimento.** Sobra de chapa e seu custo (OQ-32), estoque e sobras (OQ-38), passo de Compras sobre o percentual (OQ-28) e validações de custo (OQ-45).
- **Aguardam a Controladoria e a Gerência.** Quem decide quando o custo real passa do cotado (OQ-03, João Vitor), devolução de compra (OQ-42, Nathan, Michele e Fiscal) e classificação Projeto e recompra (OQ-44, Michele).
- **Aguardam o Robert.** Custo obrigatório na carga inicial de 13/11 (OQ-07).
- **Adiadas.** Perfis e permissões novos (OQ-21, depois das telas) e reforma tributária (OQ-43).
- **Fiscal.** Cadastro de produto novo no Omie (OQ-36).

## Lista completa

Estas seções ficam em notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3). O texto foi movido sem mudança:

- [[Perguntas-Proposta-Pedido-Comissao-Quadro-Geral]]: 1. Quadro geral
- [[Perguntas-Proposta-Pedido-Comissao-OQ-02-a-OQ-30]]: 2. OQ-02 a OQ-12 (do briefing) · 3. OQ-13 a OQ-30 (descobertas ao documentar) · 4. Consultas que saem daqui · 5. Perguntas do documento de 16/10 já respondidas por decisão

OQ-02 a OQ-12 são do briefing do Nathan (16/10/2026); a OQ-01 foi respondida em 16/10 (N16-18) e saiu da lista, e o ID não é reaproveitado. OQ-13 a OQ-30 apareceram ao documentar o fluxo, a numeração, o pedido por API, o custo real e a tela da proposta; cada uma diz de onde veio. **Renumeração:** a pergunta "quem marca aprovada" era OQ-11 e a "cancelada é perdida" era OQ-12 na rodada anterior; passaram a **OQ-26** e **OQ-27** porque o briefing usa OQ-11 e OQ-12 para o imposto e o encargo do custo real (N16-20). O que tem **default 🟡** é o que o time adota se ninguém responder. Decisões já tomadas: [[Registro-de-Decisoes]]. **Estudo do Omie (21/10/2026), em [[Estudo-Omie-API]]:** a documentação resolve a OQ-15 (usar `codigo_pedido_integracao` e gravar a liberação na resposta do `IncluirPedido`) e a OQ-16 em parte (etapa `"10"` e campos; obrigatórios, numeração e `bloqueado` só por teste); mostrou, numa primeira leitura, que **não existia cancelar pedido por API** (OQ-17, OQ-48), mas a N16-84 corrigiu: existem `CancelarPedidoVenda`, `ExcluirPedido` e `AlterarPedidoVenda`, e só o teste num pedido não faturado segue aberto (PS-037); que o **imposto da OC existe por item em valor, sem DIFAL** (OQ-37) e vem **com percentual na NF de entrada**; que a documentação lista a ligação da NF de entrada ao item da OC e a quantidade devolvida por item, mas **o Nathan informou que na prática nenhuma das duas existe** (OQ-39, N16-57, OQ-42): o vínculo da NF fica manual, com o CCP (N16-86), e a proporção da devolução precisa de outra fonte. **Respondidas pelo Nathan em 16/10/2026 (N16-21 a N16-38):** OQ-06, 09, 10, 11, 12, 13, 14, 17, 19, 20, 22, 24, 26, 27, 29 e 30; texto completo em [[Registro-de-Decisoes]].

Quando a pergunta pede uma **resposta de negócio** de quem opera, ela vira um contrato de Consulta (`CON-NN`, regras em [[Modelo-de-Consulta]]). Os IDs `CON-01` e `CON-02` já existem como nota em `06-Contratos/Consultas/`; os novos são **CON-03, CON-04, CON-05 e CON-06**, ainda **sem nota** (só serão escritos quando as perguntas forem enviadas, não antes) (agrupados por destinatário, no máximo cinco perguntas cada, mensagem pronta para o WhatsApp). Perguntas técnicas (Robert, Gustavo, Pablo) não viram Consulta: entram em [[Pontas-Soltas]] com ID `PS-nnn`.
