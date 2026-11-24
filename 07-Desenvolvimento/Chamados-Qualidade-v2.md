---
tags: [desenvolvimento, chamados, bugs, qualidade, qualidade-entrada, qualidade-saida, documentacao-cliente, av-hub]
criado: 2026-11-24
estado-em: 2026-11-24
status: vigente
dono: Nathan
develop-conferida: [av-hub d9809b8f (branch feat/qualidade-v2, PR #338 em rascunho, fora da develop), em 2026-11-24]
fontes: [revisão de código do módulo Qualidade v2 em 24/11/2026 (av-hub lib/domain/qualidade-*.ts, lib/qualidade/*, app/api/qualidade/**, components/Qualidade/**), API-023]
---

# Chamados da Qualidade v2 (CQ-01 a CQ-07)

**Em uma frase:** são os 7 defeitos achados na revisão de código do módulo Qualidade do Hub, escritos como chamados (passo a passo, o que aconteceu, o que deveria ter acontecido e os dados usados).

**Quando consultar:** antes de testar a Qualidade no PR #338 do `av-hub`, ou quando o `API-023` cita um `CQ-nn`.

**Situação:** o CQ-01 está pendente na API (cadastro da tela na `api-acos-vital`, SQL-025). Os CQ-02 a CQ-07 estão corrigidos no **PR #338** (`Acosvital/av-hub`, rascunho, branch `feat/qualidade-v2`; commits `0aa62bcd` e `0f9a7afa`), aguardando merge. Quando cada correção entrar na `develop` e o chamado for conferido, apague a linha daqui (regra do vault: cada nota diz o estado atual).

| # | Chamado | Tela ou rota | Situação |
|---|---|---|---|
| CQ-01 | Não dá para liberar "Aprovar" na Documentação ao cliente | Permissões (tela de telas e ações) | Pendente na API (SQL-025) |
| CQ-02 | Lote com laudo digital reprovado pode ser aprovado | Inspeção de entrada | Corrigido no PR #338, aguardando merge |
| CQ-03 | A conferência aceita lista incompleta ou inventada | Inspeção de entrada e de saída | Corrigido no PR #338, aguardando merge |
| CQ-04 | Data Book: dossiê inexistente aparece como "Qualidade indisponível" | Documentação ao cliente | Corrigido no PR #338, aguardando merge |
| CQ-05 | Quarentena: a parte boa não é liberada na devolução e é liberada por engano | Inspeção de entrada (dados de teste) | Corrigido no PR #338, aguardando merge |
| CQ-06 | Busca com texto longo e quantidade com ponto de milhar | Entrada e saída | Corrigido no PR #338, aguardando merge |
| CQ-07 | Nomes e tamanho dos arquivos fora da convenção do `av-hub` | Código (`lib/domain/qualidade-*.ts`) | Corrigido no PR #338, aguardando merge |

Dados de teste usados em todos: o pedido de exemplo `25931` (Cliente Exemplo S.A.), com o lote de 100 flanges `Flange cego aço carbono ASTM A105 4" 150# RF` (fornecedor Forjados Vale do Aço S.A.). O Hub mostra a faixa "dados de teste" nessas telas.

## CQ-01 · Não dá para liberar "Aprovar" na Documentação ao cliente

**Pendente na API** (`api-acos-vital`), previsto no `SQL-025` (permissões, §8). Não é defeito do front.

**Passo a passo**
1. Entre no Hub com um perfil que administra acessos.
2. Abra Cadastros › Acessos › Permissões (`/cadastros/acessos/permissoes`).
3. Escolha o perfil da Qualidade (ou um perfil de teste) e abra a aba de telas e ações (`components/Acessos/AbaTelasAcoes.tsx`).
4. Procure a tela "Documentação ao cliente" (`documentacao-cliente`).
5. Procure a ação "Aprovar" dessa tela.

**O que aconteceu:** a ação "Aprovar" não aparece. A tela de permissões nova mostra só as ações que a API devolve em `acoes_usadas` para cada tela, e a tela `documentacao-cliente` ainda não está cadastrada na API com `pode_aprovar`. Só dá para liberar "Visualizar" e "Editar".

**O que deveria ter acontecido:** a ação "Aprovar" aparece. O conserto é na API: cadastrar a tela `documentacao-cliente` com `pode_aprovar` em `acoes_usadas` (no mesmo padrão do SQL-023 e do SQL-024), como prevê o SQL-025. No servidor do Hub, aprovar ou devolver um dossiê já exige `pode_aprovar` em `documentacao-cliente` (`app/api/qualidade/documentacao/dossies/[id]/[acao]/route.ts`, `requirePermission('documentacao-cliente', validacao ? 'pode_aprovar' : 'pode_editar')`). Sem a ação cadastrada, ninguém além do perfil de testes consegue aprovar o dossiê.

**Telas, exemplos e dados:** Cadastros › Acessos › Permissões; tela `documentacao-cliente`; dossiê do pedido 25931 no passo "Revisar e aprovar" do tour.

## CQ-02 · Lote com laudo digital reprovado pode ser aprovado

**Corrigido no PR #338, aguardando merge** (`Acosvital/av-hub`, commits `0aa62bcd` e `0f9a7afa`).

**Passo a passo**
1. Entre no Hub com um perfil que tenha `inspecao-entrada` com "Editar".
2. Abra Qualidade › Inspeção de entrada (`/qualidade/inspecao-entrada`).
3. Clique no lote `Flange cego aço carbono ASTM A105 4" 150# RF` (100 peças, status "Aguardando inspeção").
4. Em "Laudo", escolha o laudo digital. Preencha a dureza medida em `210` HB com a faixa até `187` HB (item NOK) e gere o laudo: a conclusão é `REPROVADO` e o PDF entra como anexo.
5. Na conferência, marque os 14 itens como "Conforme".
6. Clique em Aprovar.

**O que aconteceu:** o lote foi aprovado (`LIBERADO`). O servidor (`app/api/qualidade/entrada/lotes/[id]/aprovar/route.ts`) só olhava se havia `laudo_url`, sem ler o conteúdo do laudo anexado.

**O que deveria ter acontecido:** o servidor lê o anexo do laudo (`lerAnexo`, a partir do id em `laudo_url`) e, se `laudo_digital.conclusao` for `REPROVADO`, responde 409 e não aprova. O laudo diz só o que foi medido; a decisão de não aprovar vale mesmo se os 14 itens estiverem "Conforme".

**Telas, exemplos e dados:** Inspeção de entrada; laudo digital (`POST /api/qualidade/laudos`); dureza 210 HB contra o máximo de 187 HB; rota `POST /api/qualidade/entrada/lotes/:id/aprovar`.

## CQ-03 · A conferência aceita lista incompleta ou inventada

**Corrigido no PR #338, aguardando merge** (`Acosvital/av-hub`, commits `0aa62bcd` e `0f9a7afa`).

**Passo a passo**
1. Entre no Hub com um perfil que tenha `inspecao-entrada` e `inspecao-saida` com "Editar".
2. Abra Qualidade › Inspeção de entrada e anote o id do lote das flanges (`LT-...`).
3. Com uma ferramenta de chamada de API (ou o console do navegador, já logado), envie `POST /api/qualidade/entrada/lotes/<id>/aprovar` com o corpo: `laudo_url` de um anexo válido e `conferencia` com **um só item**: `[{ "id": "visual", "grupo": "INSPECAO", "descricao": "Visual", "ajuda": null, "resultado": "CONFORME", "observacao": null }]`.
4. Repita na saída: Qualidade › Inspeção de saída, uma peça em inspeção, `POST /api/qualidade/saida/parciais/<id>/mover` com a mesma ideia (1 item) ou com itens de ids que não existem na lista (`"id": "qualquer"`).

**O que aconteceu:** o servidor aceitou. A função `errosConferencia` só confere se há itens, se não se repetem e se os resultados fazem sentido; não exige os ids da lista padrão.

**O que deveria ter acontecido:** responde 400. Aprovar, mover ou reprovar exige **todos** os ids da lista padrão: os 14 da entrada (`conferenciaEntradaPadrao`) e os 5 da saída (`conferenciaSaidaPadrao`). Sem isso, a Qualidade pode registrar como "conferido" um lote de que só um item foi olhado.

**Telas, exemplos e dados:** as duas telas de inspeção; rotas `.../aprovar`, `.../reprovar` (entrada) e `.../mover`, `.../reprovar` (saída); `lib/domain/qualidade-conferencia.ts`.

## CQ-04 · Data Book: dossiê inexistente aparece como "Qualidade indisponível"

**Corrigido no PR #338, aguardando merge** (`Acosvital/av-hub`, commits `0aa62bcd` e `0f9a7afa`).

**Passo a passo**
1. Entre no Hub com um perfil que tenha `documentacao-cliente` com "Editar".
2. Abra Qualidade › Documentação ao cliente (`/qualidade/documentacao-cliente`) e abra o dossiê do pedido `25931`.
3. Em outra aba, faça o mesmo dossiê deixar de existir (apagado por outra pessoa ou id errado na chamada).
4. Volte à primeira aba e clique em "Gerar índice do Data Book" (`POST /api/qualidade/documentacao/data-book`).

**O que aconteceu:** a tela mostra "Qualidade indisponível" (503), como se a API estivesse fora do ar. A rota (`app/api/qualidade/documentacao/data-book/route.ts`) tratava todo 404 do hub como "rota não publicada".

**O que deveria ter acontecido:** "Dossiê não encontrado" (404). Só o 404 **sem** `codigo` é rota não publicada (cai nos dados de teste ou no 503); o 404 **com** `codigo` (por exemplo `DOSSIE_NAO_ENCONTRADO`) é do recurso e sobe como 404. É a mesma regra que `gravarNoHub` e `lerDoHub` já seguem em `lib/qualidade/bff.ts`.

**Telas, exemplos e dados:** Documentação ao cliente; dossiê do pedido 25931; botão "Gerar índice do Data Book".

## CQ-05 · Quarentena: a parte boa não é liberada na devolução e é liberada por engano

**Corrigido no PR #338, aguardando merge** (`Acosvital/av-hub`, commits `0aa62bcd` e `0f9a7afa`). Vale para os dados de teste (`lib/qualidade/fixtures/entrada.ts`); a API real tem de seguir a mesma regra ([[08-Qualidade-Entrada-Regras-no-Hub]], E12).

**Passo a passo (a): devolução**
1. Entre no Hub com `inspecao-entrada` "Editar" e abra Qualidade › Inspeção de entrada.
2. Abra o lote das 100 flanges, marque 1 item "Não conforme" ("Rebarba na face de vedação"), anexe laudo e evidência, digite `5` na quantidade e clique em Reprovar. O lote filho de 5 nasce `REPROVADO` e as 95 ficam em "Em quarentena".
3. Abra o lote das 5 reprovadas, escreva a causa e escolha a ação "Devolução".
4. Simule a nota de devolução (botão do tour, evento `devolucao_emitida`).

**O que aconteceu (a):** a RNC encerra, mas as 95 peças continuam em quarentena para sempre, sem nada que as libere.

**O que deveria ter acontecido (a):** a devolução é sem reposição: ao encerrar a RNC, o lote pai (95) sai da quarentena e vira `LIBERADO`.

**Passo a passo (b): liberação por engano**
1. Repita os passos 1 e 2 acima (95 em quarentena).
2. Tenha na fila outro lote da **mesma requisição e do mesmo material** (por exemplo, a reposição de outra RNC ou uma segunda entrega).
3. Aprove esse outro lote.

**O que aconteceu (b):** a aprovação libera as 95 da quarentena, mesmo sem ter relação com a RNC.

**O que deveria ter acontecido (b):** a quarentena só é liberada quando o lote aprovado é a **reposição** ou o **reparado** daquela RNC (`lote_pai_id` aponta o pai em quarentena).

**Telas, exemplos e dados:** Inspeção de entrada; 100 flanges, 5 reprovadas e 95 em quarentena; ação "Devolução"; `lib/qualidade/fixtures/entrada.ts`.

## CQ-06 · Busca com texto longo e quantidade com ponto de milhar

**Corrigido no PR #338, aguardando merge** (`Acosvital/av-hub`, commits `0aa62bcd` e `0f9a7afa`). Dois defeitos na mesma tela.

**Passo a passo (a): busca**
1. Entre no Hub e abra Qualidade › Inspeção de entrada.
2. No campo de busca, cole um texto de 90 caracteres (por exemplo, um nome de fornecedor repetido).
3. Faça o mesmo em Qualidade › Inspeção de saída.

**O que aconteceu (a):** o BFF (`lerParametros` em `lib/qualidade/bff.ts`) recusa busca com mais de 80 caracteres, mas o campo da entrada deixa digitar até 100 e o da saída não tem limite. O resultado é um erro em vez da lista.

**O que deveria ter acontecido (a):** o campo limita a 80 caracteres nas duas telas, o mesmo limite do servidor.

**Passo a passo (b): quantidade**
1. Abra um lote de 2.000 peças (ou uma peça de saída com quantidade grande) e clique em Reprovar.
2. Em "Quantidade reprovada", digite `1.250` (ponto como separador de milhar, como se escreve no Brasil).
3. Confira o que o sistema entendeu antes de confirmar.

**O que aconteceu (b):** `1.250` virou `1,25`. Isso acontece em `numeroDigitado` do `DecisaoLoteForm` (entrada) e no `ReprovarSaidaForm` (saída): cada um lê o número do seu jeito.

**O que deveria ter acontecido (b):** `1.250` é mil duzentos e cinquenta, e `1,25` é um vírgula vinte e cinco. Um leitor único de número em pt-BR, no domínio (`lib/domain/qualidade-*.ts`), usado nas duas telas, como já existe para o laudo (`numeroDoTextoLaudo`).

**Telas, exemplos e dados:** campo de busca da entrada e da saída; formulários de reprovação; `1.250` e `12,5`.

## CQ-07 · Nomes e tamanho dos arquivos fora da convenção do `av-hub`

**Corrigido no PR #338, aguardando merge** (`Acosvital/av-hub`, commits `0aa62bcd` e `0f9a7afa`). Não aparece para o usuário; é dívida de código.

**Passo a passo**
1. Abra o repositório `av-hub` na branch `feat/qualidade-v2`.
2. Leia a convenção de nomes do domínio no `CLAUDE.md` (arquivos `lib/domain/<assunto>-<parte>.ts`).
3. Veja os arquivos `lib/domain/qualidade-*.ts` e rode a contagem de linhas de `qualidade-documentacao.ts`.
4. Procure o texto `PAUTA CADU` nos comentários.

**O que aconteceu:** o módulo estava numa subpasta `lib/domain/qualidade/*` (a convenção é um arquivo por assunto, no formato `lib/domain/qualidade-<assunto>.ts`); `documentacao.ts` tinha 713 linhas (o limite é 400 por arquivo); e os comentários marcavam as decisões em aberto como `PAUTA CADU`, mas quem valida o dia a dia é a Mayara.

**O que deveria ter acontecido (feito):** arquivos renomeados para `lib/domain/qualidade-<assunto>.ts`; `documentacao.ts` dividido em arquivos de até 400 linhas; marcador trocado para `PAUTA QUALIDADE`. As decisões do Cadu (concessão e RNC na saída) continuam nomeadas em [[Perguntas-Qualidade-Mayara]].

**Telas, exemplos e dados:** nenhuma tela; `lib/domain/qualidade-*.ts`, `CLAUDE.md` do `av-hub`.

## Ver também

`API-023` · [[Perguntas-Qualidade-Mayara]] · [[Bugs-Conhecidos]] · [[Backlog-por-Frente]]
