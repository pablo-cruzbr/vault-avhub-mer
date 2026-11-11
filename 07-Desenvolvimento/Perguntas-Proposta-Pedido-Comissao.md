---
tags: [decisoes, perguntas, oq, consulta, proposta, orcamento, comissao, staging]
criado: 2026-10-16
estado-em: 2026-11-11
status: proposta
dono: Nathan
fontes: [Proposta-Orcamento-Comissao/00-Briefing-Decisoes (OQ-02 a OQ-12, fora do vault), Proposta-Orcamento-Comissao/08-Reuniao/Proposta-Orcamento-Pedido-Comissao.docx (fora do vault) (perguntas das seções 4 e 5), Modelo-de-Consulta, Registro-de-Decisoes (até N16-155), LOG-56 (R7 e R11, 09/11/2026), CON-03 da v2 (Contratos-da-v2), Estudo-Omie-API, Pontas-Soltas, Riscos, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault) (OQ-49 a OQ-53), develop de 11/11/2026 (api-acos-vital cc3fbb3, av-hub 44bb770, api-pcp 2e564e6, app-pcp 4c11886, omie-elt-pipeline master 0593c9f)]
---

# Perguntas em aberto: OQ-02 a OQ-53

**Em uma frase:** esta nota reúne as perguntas de negócio e de sistema sobre proposta, pedido, orçamento e comissão: o que já foi respondido, e, para o que falta, a pergunta, quem responde e o que fica parado.

**Quando consultar:** antes de cobrar uma resposta de alguém, ou quando uma raia, um contrato ou uma tarefa cita uma `OQ-nn`.

## Como ler esta lista

- Cada pergunta tem um ID `OQ-nn` (OQ = open question, pergunta em aberto). O ID não é reaproveitado. A OQ-01 foi respondida em 16/10 (N16-18) e a OQ-18 nunca foi usada.
- Selos: ✅ respondida (cita a decisão) · ⏸ adiada, com padrão provisório · **Aberta** · ❓ não deu para conferir.
- Respostas citam decisões `N16-nn`, em [[Registro-de-Decisoes]]. O desenho do vault (raias, [[00-Fluxo-Mestre-0b]] e decisões) é a regra; a `develop` diz o estado.
- Siglas: OC = ordem de compra; NF = nota fiscal; CCP = acompanhamento das compras (Follow-up); PCP = planejamento e controle da produção; MES = sistema de chão de fábrica.
- O `api-comercial`, protótipo do Pablo citado nas perguntas antigas, foi removido do av-hub em 06/11/2026 (PR #261, commit `dd9d729`). Nenhuma pergunta depende mais dele; as citações ficam só como histórico.

## Situação em 11/11/2026

Das 51 perguntas (OQ-02 a OQ-53, sem a OQ-18): **33 respondidas**, **5 adiadas** e **13 abertas**.

**Abertas, por quem responde** (cada uma numa frase; o detalhe está no [[Perguntas-Proposta-Pedido-Comissao-Quadro-Geral]]):

- **Nathan**
  - OQ-48: como se cria o sequencial pela API do Omie e o que `CancelarPedidoVenda` e `ExcluirPedido` fazem num pedido não faturado? (teste no Omie, PS-037; trava o faturamento em partes com sequenciais.)
  - OQ-49: na fabricação sem matéria-prima no estoque, o restante volta a poder seguir o roteiro (regra 7 de [[05-Estoque-Atendimento]]) ou a regra muda para "só compra", como a `develop` faz? (trava `E4` e `F1`.)
  - OQ-50: a Gerência Geral e Diretoria deve ter "Visualizar" nas 12 telas que hoje não tem, entre elas a Liberação da Equipe? (PS-048; trava `V3`.)
  - OQ-51: quais perfis veem o custo real dos itens, e com qual escopo? (PS-049, BL-088; trava `K2` e `K5`.)
  - OQ-52: mantém a N16-123 (quem emite a OC pode aprová-la) ou exige outra pessoa? (depois da conversa com Compras; `C3`.)
  - OQ-53: as contas genéricas `admin` do MES e "Admin" do Hub existem na produção, e podem ser desativadas? (RS-023; segurança.)
  - OQ-47, com Compras: o aviso na tela "Meus Pedidos" substitui o e-mail usado hoje para a compra acima do valor? (não trava o sistema.)
- **Robert:** OQ-07 e OQ-38 fecharam em 11/11 (N16-156): não há carga em 13/11, e na carga futura o lote sem custo entra com custo `MANUAL` e motivo.
- **Gustavo:** OQ-39: o banco guarda o vínculo da NF de entrada com a OC pela quantidade coberta de cada item ou pelo valor total da NF? (trava o custo real pela NF, `K2`.)
- **Michele e Fiscal,** na [[Contratos-da-v2\|CON-03]] (já escrita, aguardando resposta): OQ-44: como se classifica Projeto e o que é "recompra no mesmo pedido"? OQ-42: como a devolução de compra aparece no Omie e o que muda no custo real?
- **Fiscal:** OQ-36: quem cadastra no Omie o produto novo da proposta, e em quanto tempo? (a proposta com produto pendente não vira pedido, N16-28.)

**Adiadas:** OQ-21 (perfis novos, depois das telas, N16-85), OQ-28 e OQ-45 (Compras valida o padrão provisório da N16-51; a N16-77 manda seguir sem travar), OQ-32 (custo da sobra de chapa, conversa de dezembro, N16-146) e OQ-43 (percentuais da CBS em 2027).

**Fechadas nesta revisão (11/11/2026):** OQ-15, superada pelo R7 do LOG-56 (a liberação não é gravada na criação; continua ato do vendedor); OQ-16, respondida pela N16-149, pela N16-83 e pelo R11 do LOG-56; OQ-03, coberta pelas N16-61 e N16-69; OQ-34, pelas N16-86 e N16-148 (o resto foi para a OQ-39); OQ-40 e OQ-41, que já tinham resposta. A OQ-19 tinha resposta velha: a N16-104 corrigiu a N16-35, e o pedido digitado no Omie **tem** estimativa.

**Pergunta fora da numeração OQ:** a comissão estimada na proposta (`V0.3`) também zera quando o pedido é refaturamento? Aberta desde a N16-152 e mantida aberta pela N16-153; responde o Nathan.

## Lista completa

As seções ficam em notas à parte, para cada arquivo ficar abaixo de 25 KB:

- [[Perguntas-Proposta-Pedido-Comissao-Quadro-Geral]]: 1. Quadro geral, com todas as OQ, a situação, quem responde e o que bloqueia.
- [[Perguntas-Proposta-Pedido-Comissao-OQ-02-a-OQ-30]]: 2. OQ-02 a OQ-12 (do briefing) · 3. OQ-13 a OQ-30 (descobertas ao documentar) · 4. Consultas que saem daqui · 5. Perguntas do documento de 16/10 já respondidas por decisão.

**Origem das perguntas.** OQ-02 a OQ-12 são do briefing do Nathan (16/10/2026). OQ-13 a OQ-30 apareceram ao documentar o fluxo, a numeração, o pedido por API, o custo real e a tela da proposta. OQ-31 a OQ-48 vieram, na maior parte, das respostas de Compras e da Controladoria (19 a 22/10) e do estudo do Omie. OQ-49 a OQ-53 vieram da validação local em Docker de 10/11/2026. **Renumeração antiga:** "quem marca aprovada" era OQ-11 e "cancelada é perdida" era OQ-12; passaram a OQ-26 e OQ-27, porque o briefing usa OQ-11 e OQ-12 para o imposto e o encargo do custo real (N16-20).

**Estudo do Omie (21/10/2026), em [[Estudo-Omie-API]].** A documentação deu a etapa `"10"` (OQ-16) e o código de integração do pedido. A leitura de que gravar a liberação na resposta do `IncluirPedido` resolvia a OQ-15 foi superada pelo R7 do LOG-56 (09/11/2026). Cancelar pedido existe por API (`CancelarPedidoVenda`, `ExcluirPedido`, `AlterarPedidoVenda`, N16-84); só o teste num pedido não faturado segue aberto (OQ-48, PS-037). O imposto da OC existe por item, em valor, sem DIFAL (OQ-37). A ligação da NF de entrada ao item da OC e a quantidade devolvida por item aparecem na documentação, mas o Nathan informou que na prática não existem (OQ-39, OQ-42): o vínculo da NF é manual, pelo CCP (N16-86).

**Consultas.** Pergunta de negócio para quem opera vira uma Consulta (`CON-nn`, regras em [[Modelo-de-Consulta]]); o ID é sempre do Nathan, e o próximo livre é `CON-04`. Hoje existe a [[Contratos-da-v2\|CON-03]] (Michele e Fiscal, OQ-42 e OQ-44). Perguntas técnicas (Robert, Gustavo, Nathan) não viram Consulta: ficam em [[Pontas-Soltas]] (PS-039 aponta para esta nota).
