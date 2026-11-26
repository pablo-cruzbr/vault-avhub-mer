---
id: API-023
titulo: Qualidade no Hub: inspeção de entrada, inspeção de saída e documentação ao cliente
status: proposta
autor: Pablo
data: 2026-11-24
camadas: [frontend, backend, api, sql]
donos: {frontend: Nathan, backend: "a definir (rotas na api-acos-vital)", api: "a definir", sql: "a definir"}
nos_0b: [Q1, Q2, Q3, Q4, Q7, Q8, E5]
notas_afetadas: [08-Qualidade-Entrada, 11-Qualidade-Saida, 08-Qualidade-Entrada-Regras-no-Hub, 11-Qualidade-Saida-Regras-no-Hub, 11-Qualidade-Documentacao-ao-Cliente-Regras-no-Hub, Perguntas-Qualidade-Mayara, Chamados-Qualidade-v2]
depende_de: [LOG-53, LOG-58]
decisoes: [N16-124, N16-125, N16-126, N16-127, N16-128, N16-129]
develop-conferida: [av-hub d9809b8f (branch feat/qualidade-v2, PR #338 em rascunho, fora da develop), em 2026-11-24; api-acos-vital e api-pcp não conferidos para este contrato]
tags: [contrato, contrato-api, qualidade, qualidade-entrada, qualidade-saida, documentacao-cliente, lote, rnc, quarentena, conferencia, segregacao, data-book, rascunho]
criado: 2026-11-18
estado-em: 2026-11-26
dono: Nathan (telas e BFF) · Mayara (Qualidade) valida o dia a dia · Carlos Eduardo (Cadu) decide o que contraria regra antiga
fontes: ["02-Fluxo-de-Atividades/08-Qualidade-Entrada e 11-Qualidade-Saida", "fluxo oficial da Qualidade v2 (imagem public/qualidade/fluxo-processo-qualidade.jpg do av-hub, 9 passos)", "av-hub lib/domain/qualidade-*.ts e app/api/qualidade/** (PR #338)", "api-pcp qualidade.controller.ts e itens-parciais.service.ts (referência do MES)"]
---

# API-023 · Qualidade no Hub: inspeção de entrada, inspeção de saída e documentação ao cliente

> [!info] Situação em 24/11/2026
> **Status:** `proposta` (rascunho; o ID final é do admin) · **Pasta:** `Ativos` · **Nós do 0b:** `Q1` a `Q4`, `Q7`, `Q8`, `E5`
>
> - 🔴 As três telas (`/qualidade/inspecao-entrada`, `/qualidade/inspecao-saida`, `/qualidade/documentacao-cliente`) estão no PR #338 do `av-hub` (`Acosvital/av-hub`, rascunho), fora da `develop`. A API não publica as rotas abaixo: o BFF mostra **dados de teste** (faixa "dados de teste") enquanto isso.
> - 📝 O fluxo oficial da Qualidade tem 9 passos. Entrada e saída seguem o mesmo ciclo: conferir, decidir, se não conforme abre a RNC, trata, inspeciona de novo. Do passo 6 em diante é a documentação ao cliente.
> - ❓ Nada do que é novo em relação ao vault antigo (conferência por itens, RNC na saída, concessão, dossiê) é decisão até a Mayara validar o dia a dia e o Cadu decidir o que contraria regra antiga. As perguntas estão em [[Perguntas-Qualidade-Mayara]].
> - Os 7 defeitos achados na revisão do código estão em [[Chamados-Qualidade-v2]] (em correção no PR #338).

## 1. Resumo em linguagem simples

A Qualidade passa a trabalhar dentro do Hub, no mesmo sistema do Compras, do Estoque e do Comercial. O inspetor confere o material que chegou (14 itens) ou a peça que a Produção terminou (5 itens) e aprova ou reprova. Reprovou, o sistema abre a RNC (registro de não conformidade), guarda a causa e a ação, e o lote ou a peça só segue depois de uma nova inspeção. No fim, a Qualidade monta, revisa, envia e arquiva a documentação do pedido para o cliente (certificados, relatórios e Data Book).

## 2. Contexto: o que deve ser feito e por quê

- **O problema hoje.** A inspeção de entrada e de saída só existe no MES (`app-pcp`), com laudo, motivo e um clique. Não há conferência item a item, nem RNC com causa e ação, nem registro da tratativa na saída, nem documentação ao cliente em sistema: isso é feito fora.
- **Quem sofre.** A Qualidade (sem registro rastreável), o PCP e o Comercial (não sabem o que foi decidido da peça reprovada) e o cliente (recebe documento sem padrão).
- **De onde vem.** O fluxo oficial da Qualidade (9 passos, ciclo RNC/RDFA) e as decisões antigas em [[08-Qualidade-Entrada]] (N16-124 a N16-127) e [[11-Qualidade-Saida]] (N16-128 e N16-129).
- **Se não for feito.** A rastreabilidade (PO, item, corrida) continua em planilha e o cliente pode recusar a documentação sem que o sistema saiba por quê.

## 3. Onde fica no fluxo

- Entrada: `Q1` a `Q4` e `E5`, nota [[08-Qualidade-Entrada]]; regras do Hub em [[08-Qualidade-Entrada-Regras-no-Hub]].
- Saída: `Q7` e `Q8`, nota [[11-Qualidade-Saida]]; regras do Hub em [[11-Qualidade-Saida-Regras-no-Hub]].
- Documentação ao cliente (passos 6 a 9 do fluxo oficial): não tem nó no 0b; regras em [[11-Qualidade-Documentacao-ao-Cliente-Regras-no-Hub]].

## 4. Como está hoje

| Camada | Entrada | Saída | Documentação |
|---|---|---|---|
| MES (`api-pcp`) | ✅ laudo, aprovar, reprovar com cisão do lote e RNC ([[08-Qualidade-Entrada]]) | ✅ receber, iniciar, mover e reprovar; divergência para o PCP ([[11-Qualidade-Saida]]) | Não existe |
| Hub, telas e BFF | 🔴 PR #338 (rascunho) | 🔴 PR #338 (rascunho) | 🔴 PR #338 (rascunho) |
| Hub, API (`api-acos-vital`) e banco | 🔴 sem rotas e sem tabelas | 🔴 idem | 🔴 idem |

Hoje o BFF devolve dados de teste (`lib/qualidade/fixtures/`) quando a API responde 404 sem `codigo` (rota não publicada). Um 404 com `codigo` (por exemplo `LOTE_NAO_ENCONTRADO`) é do recurso e sobe como erro.

## 5. Regras de negócio

As regras completas, com o que está decidido e o que está pendente, ficam nas três notas de regras do Hub (seção 3). O que a API precisa garantir:

1. **Entrada, conferência.** Aprovar exige os 14 itens respondidos, nenhum "Não conforme" e o laudo. Reprovar exige pelo menos 1 "Não conforme" com observação, laudo, motivo e evidência.
2. **Laudo digital.** Se o laudo for o digital, a conclusão `REPROVADO` impede aprovar (409).
3. **Só lote `PENDENTE` é decidido** (outro status: 409).
4. **Reprovação parcial.** Quantidade menor que o saldo cria o lote filho `REPROVADO` (`lote_pai_id`); a parte boa fica em `QUARENTENA` enquanto há parcial esperando, ou `LIBERADO` se ninguém espera.
5. **RNC com causa e ação.** A RNC nasce `ABERTA` (`RNC-AAAA-NNNN`, mesma sequência na entrada e na saída). A tratativa grava a causa e a ação (`TROCA`, `REPARO`, `COMPLEMENTO`, `DEVOLUCAO`) e leva a RNC a `EM_TRATAMENTO`. Troca e devolução deixam a nota de devolução pendente no Omie (o sistema só sinaliza).
6. **Nova inspeção.** Troca e complemento esperam a reposição, que entra como lote novo e passa de novo pela conferência. Aprovada, libera a quarentena do lote de origem e encerra a RNC. A devolução se encerra quando a nota sai.
7. **Saída, conferência.** Mover (aprovar) exige os 5 itens respondidos e nenhum "Não conforme". Reprovar exige pelo menos 1 "Não conforme", motivo e o local de segregação; a peça fica `REPROVADO` (segregada e bloqueada) e abre a RNC. O aprovado vai ao Estoque, não à Expedição ([[Contratos-da-v2|LOG-53]]).
8. **Reprovação parcial na saída.** Quantidade menor que a da parcial: a parte reprovada vira uma parcial nova (`parcial_origem_id`) e o resto segue (N16-128).
9. **Tratativa da saída.** Só a peça `REPROVADO` com RNC `ABERTA` recebe tratativa. Escolhe-se uma ação (`FALSO_ALARME`, `RETRABALHO`, `REPARO`, `SUBSTITUICAO`, `DEVOLUCAO`, `DESCARTE`, `CONCESSAO`) e marca-se quem decidiu (`QUALIDADE`, `PCP`, `COMERCIAL`, `CLIENTE`). Substituição, devolução e descarte pedem justificativa. Concessão exige o cliente entre os responsáveis e a autorização dele anexada.
10. **Dossiê.** Um dossiê por pedido de venda: `EM_MONTAGEM` → `EM_REVISAO` → `APROVADO` → `ENVIADO` → `COMENTADO` → `ARQUIVADO`. Enviar à revisão exige todos os documentos obrigatórios e o índice do Data Book em dia. Aprovar exige 4 itens conferidos e rastreabilidade completa. Envio por portal exige protocolo; por e-mail, e-mail válido. Arquivar exige o caminho.
11. **O sistema não emite nota.** A nota de devolução sai no Omie.

## 6. Frontend

- **Sistema e telas:** av-hub (HUB), grupo de menu `qualidade`.

| Tela | Rota | Slug |
|---|---|---|
| Inspeção de entrada | `/qualidade/inspecao-entrada` | `inspecao-entrada` |
| Inspeção de saída | `/qualidade/inspecao-saida` | `inspecao-saida` |
| Documentação ao cliente | `/qualidade/documentacao-cliente` | `documentacao-cliente` |

- **O que a tela faz:** fila com cartões de resumo; lista de conferência por grupos (documental, inspeção do material e análise de conformidade; peça, na saída); laudo anexado ou digital; formulário de reprovação (motivo, evidência, quantidade, local de segregação); tratativa da RNC e da saída; dossiê com documentos, índice do Data Book, revisão, envio e arquivo; botão "Ver o fluxo da Qualidade" e tour explicado passo a passo.
- **Estados:** carregando, vazio, erro, "dados de teste" (faixa) e "Qualidade indisponível" (503) quando a API falha.
- **Validações no front** repetem as regras de `lib/domain/qualidade-*.ts`; o servidor confere de novo.
- **BFF:** rotas da seção 8 (coluna "BFF"). O BFF não confia no corpo vindo do navegador.

## 7. Backend

- **Repositório:** `api-acos-vital` (módulo novo `qualidade`, dono a definir). 🔴
- Aplica no servidor as regras 1 a 11, em transação (decidir o lote, criar o lote filho, abrir a RNC e mover a quarentena são um passo só).
- A conferência é gravada junto da decisão (lista de itens com resultado e observação): é a prova do "conforme" ou do motivo.
- Auditoria: quem decidiu e quando, em cada decisão, tratativa e mudança do dossiê (`historico`).
- Se a API ficar fora do ar, o BFF responde 503 "Qualidade indisponível" e não cai em dados de teste (só cai quando a rota não existe).

## 8. API

Permissões: `pode_visualizar`, `pode_editar` e `pode_aprovar` (só no dossiê: aprovar e devolver).

### Entrada

| Rota da API | BFF (Hub) | Permissão | Efeito |
|---|---|---|---|
| `GET /qualidade/lotes` | `GET /api/qualidade/entrada/lotes` | `inspecao-entrada` visualizar | Fila; filtros `status`, `q` (até 80 caracteres) e página |
| `POST /qualidade/lotes/:id/aprovar` | `POST /api/qualidade/entrada/lotes/:id/aprovar` | `inspecao-entrada` editar | `LIBERADO`; libera a quarentena do lote de origem quando é a reposição |
| `POST /qualidade/lotes/:id/reprovar` | `POST /api/qualidade/entrada/lotes/:id/reprovar` | `inspecao-entrada` editar | Reprovação total ou parcial, RNC e lote filho |
| `POST /qualidade/rnc/:id/tratativa` | `POST /api/qualidade/entrada/rnc/:id/tratativa` | `inspecao-entrada` editar | Causa e ação corretiva; RNC `EM_TRATAMENTO` |
| (só BFF) | `POST /api/qualidade/laudos` | `inspecao-entrada` editar | Gera o PDF do laudo digital e devolve o anexo |

Corpos (formatos exatos em `lib/domain/qualidade-entrada.ts`):

```ts
type StatusLote = 'PENDENTE' | 'LIBERADO' | 'REPROVADO' | 'QUARENTENA';
type StatusRnc = 'ABERTA' | 'EM_TRATAMENTO' | 'AGUARDANDO_REINSPECAO' | 'ENCERRADA';
type ResultadoConferencia = 'CONFORME' | 'NAO_CONFORME' | 'NAO_SE_APLICA';
interface ItemConferencia { id: string; grupo: 'DOCUMENTAL'|'INSPECAO'|'ANALISE'|'PECA'; descricao: string; ajuda: string|null; resultado: ResultadoConferencia|null; observacao: string|null }

// aprovar
{ laudo_url: string; conferencia: ItemConferencia[] }
// reprovar
{ laudo_url: string; motivo: string /* até 300 */; evidencia_url: string; conferencia: ItemConferencia[]; quantidade_reprovada?: number | null }
// tratativa
{ analise_causa: string /* até 500 */; acao_corretiva: 'TROCA'|'REPARO'|'COMPLEMENTO'|'DEVOLUCAO'; observacao?: string | null /* até 300 */ }
```

`aprovar` e `reprovar` respondem `{ lote, lote_filho | null }`. Os 14 itens da entrada são `nf_po`, `cert_qualidade`, `cert_origem`, `normas`, `requisitos_cliente`, `visual`, `dimensional`, `integridade`, `sinete`, `heat`, `nf_cert_material`, `requisitos_po`, `normas_atendidas` e `ensaios` (`conferenciaEntradaPadrao`). O servidor exige **todos** esses ids, sem repetir.

### Saída

| Rota da API | BFF (Hub) | Permissão | Efeito |
|---|---|---|---|
| `GET /qualidade/saida/parciais` (proposta) | `GET /api/qualidade/saida/parciais` | `inspecao-saida` visualizar | Parciais nos setores tipo `QUALIDADE`, exceto `qualidade-entrada` |
| `PATCH /itens-parciais/:id/receber` | `POST /api/qualidade/saida/parciais/:id/receber` | `inspecao-saida` editar | `EM_TRANSITO` → `RECEBIDO` |
| `PATCH /itens-parciais/:id/iniciar` | `POST .../iniciar` | idem | `RECEBIDO` → `EM_ANDAMENTO` |
| `PATCH /itens-parciais/:id/aprovar-saida` | `POST .../mover` | idem | Aprova: segue ao Estoque; exige a conferência. O MES recusa `mover` na inspeção de saída, então o BFF traduz o `mover` da tela (av-hub `b982c8ed`) |
| `PATCH /itens-parciais/:id/reprovar` | `POST .../reprovar` | idem | `REPROVADO`, segrega, abre a RNC; reprovação parcial pelo campo `quantidade` do MES (N16-128, api-pcp PR 108; o Hub manda `quantidade_reprovada`) |
| `POST /qualidade/saida/parciais/:id/tratativa` | `POST /api/qualidade/saida/parciais/:id/tratativa` | idem | Registra a tratativa (destino na regra 9 e abaixo) |

```ts
// mover: 5 itens (dimensional, visual, identificacao, rastreabilidade, requisitos_cliente)
{ conferencia: ItemConferencia[] }
// reprovar
{ conferencia: ItemConferencia[]; motivo: string /* até 300 */; local_segregacao: string /* até 80 */; evidencia_url?: string | null; quantidade_reprovada?: number | null }
// tratativa
{ tratativa: 'FALSO_ALARME'|'RETRABALHO'|'REPARO'|'SUBSTITUICAO'|'DEVOLUCAO'|'DESCARTE'|'CONCESSAO'; responsaveis: ('QUALIDADE'|'PCP'|'COMERCIAL'|'CLIENTE')[]; justificativa: string | null /* até 500 */; autorizacao_cliente_url?: string | null }
```

Ações por estado: `EM_TRANSITO` só `receber`; `RECEBIDO` só `iniciar`; `EM_ANDAMENTO` `mover` ou `reprovar`; `REPROVADO` nenhuma (só a tratativa). Destino da tratativa: falso alarme volta à inspeção (RNC encerrada); retrabalho e reparo voltam ao setor anterior (RNC `AGUARDANDO_REINSPECAO`); substituição, devolução e descarte saem da fila (RNC encerrada); concessão segue ao Estoque com `concessao = true`.

### Documentação ao cliente

| Rota da API | BFF (Hub) | Permissão | Efeito |
|---|---|---|---|
| `GET /qualidade/dossies` | `GET /api/qualidade/documentacao/dossies` | `documentacao-cliente` visualizar | Fila de dossiês, por pedido de venda |
| `POST /qualidade/dossies/:id/:acao` | `POST /api/qualidade/documentacao/dossies/:id/:acao` | `documentacao-cliente` editar; `aprovar` e `devolver` pedem `pode_aprovar` | `anexar`, `adicionar-documento`, `remover-documento`, `enviar-revisao`, `devolver`, `aprovar`, `registrar-envio`, `registrar-comentario`, `reabrir`, `arquivar` |
| (só BFF) | `POST /api/qualidade/documentacao/data-book` | `documentacao-cliente` editar | Gera o índice do Data Book e o anexa ao dossiê |

Status em que cada ação vale: `anexar`, `adicionar-documento`, `remover-documento` e `enviar-revisao` em `EM_MONTAGEM`; `devolver` e `aprovar` em `EM_REVISAO`; `registrar-envio` em `APROVADO`; `registrar-comentario` em `ENVIADO`; `reabrir` em `COMENTADO`; `arquivar` em `ENVIADO` ou `COMENTADO`. Se o cliente reprova, o dossiê volta a `EM_MONTAGEM` com o número da revisão a mais.

Anexos: `POST /api/qualidade/anexos` (editar em qualquer das três telas) e `GET /api/qualidade/anexos/:id`. Onde o arquivo definitivo é guardado é ❓ (hoje o BFF guarda só para a demonstração; ver o tema de pasta no SharePoint em [[Perguntas-Qualidade-Mayara]]).

### Erros

| Código | Quando |
|---|---|
| 400 | Falta laudo, motivo, evidência, local, causa ou protocolo; texto acima do limite; quantidade fora de 0,0001 até o saldo; conferência incompleta ou com id fora da lista padrão |
| 403 | Sem a permissão da tela |
| 404 | Lote, parcial, RNC ou dossiê inexistente (com `codigo`); sem `codigo` = rota não publicada |
| 409 | Lote que não está `PENDENTE`; laudo digital reprovado; ação fora do estado (`STATUS_INVALIDO`); documentos pendentes; rastreabilidade incompleta; remover documento obrigatório |
| 503 | A API do hub está fora do ar ("Qualidade indisponível") |

Chamada repetida: decidir de novo um lote ou uma peça já decidida responde 409; não há efeito duplo.

## 9. Banco (SQL)

🔴 Não existe nada na `api-acos-vital`. A proposta de tabelas e colunas vai no contrato [[SQL-025-Qualidade-v2-Banco-e-API]] (proposta, em revisão do Gustavo). O banco precisa guardar: lote e lote filho, conferência por item, laudo, RNC com causa e ação, segregação, tratativa da saída com os responsáveis, dossiê com documentos, revisões, envios, comentários e arquivamento, e a sequência `RNC-AAAA-NNNN`.

## 10. Permissões e perfis

| Tela (slug) | `visualizar` | `editar` | `aprovar` |
|---|---|---|---|
| `inspecao-entrada` | vê a fila de lotes | decide, trata a RNC e gera o laudo | não se aplica |
| `inspecao-saida` | vê a fila de parciais | recebe, inicia, move, reprova e trata | não se aplica |
| `documentacao-cliente` | vê os dossiês | monta, envia à revisão, registra o envio e arquiva | aprova e devolve na revisão |

Os slugs de entrada e saída são os do MES, de propósito. Perfis são dados do banco; o nome do perfil da Qualidade segue ❓. Para o `pode_aprovar` poder ser dado na tela de permissões em massa, o modal precisa oferecer "Aprovar" para `documentacao-cliente` ([[Chamados-Qualidade-v2]], chamado 1).

## 11. Integrações afetadas

- **Omie:** a nota de devolução continua saindo do Omie; o Hub só sinaliza `nota_devolucao_pendente`.
- **MES:** hoje a decisão da Qualidade acontece lá. Qual sistema vale depois que o Hub publicar é ❓ (Nathan e Robert; fora deste contrato).
- **Compras:** o aviso da recompra por RNC segue o [[LOG-58-Avisos-do-MES-ao-Compras|LOG-58]]; usar o mesmo aviso para a RNC aberta no Hub é ❓.

## 12. Critérios de aceite

- [ ] Frontend: as três telas funcionam contra a API real, sem a faixa "dados de teste".
- [ ] Backend: aprovar com item "Não conforme" ou conferência incompleta responde 400; aprovar com laudo digital `REPROVADO` responde 409.
- [ ] API: lote já decidido responde 409; só a peça `REPROVADO` aceita a tratativa; o dossiê respeita os status da seção 8.
- [ ] Banco: reprovar 30 de 100 deixa o pai com 70 (em `QUARENTENA` ou `LIBERADO`), cria o filho `REPROVADO` de 30 e a RNC.
- [ ] Quem não tem a permissão da tela recebe 403 nas ações.

## 13. Como testar

1. **Caminho feliz (entrada):** lote de 100 flanges `A105 4" 150#` do pedido 25931; marcar os 14 itens "Conforme", anexar o laudo e aprovar: o lote vira `LIBERADO`.
2. **Reprovação parcial:** marcar 1 item "Não conforme" e reprovar 5 de 100. O filho de 5 nasce `REPROVADO`, as 95 ficam em `QUARENTENA` e a RNC abre. Tratar com a causa e "Troca"; quando o lote de reposição de 5 chegar, aprovar: as 95 saem da quarentena e a RNC encerra.
3. **Saída:** peça em `EM_ANDAMENTO`, "Dimensional" não conforme, local "Área de segregados"; tratar com Qualidade e PCP e "Retrabalho": volta ao setor anterior com `retrabalho = true`.
4. **Dossiê:** anexar os obrigatórios, gerar o índice, enviar à revisão, aprovar, registrar o envio por portal com protocolo, registrar a reprova do cliente (volta à montagem, revisão 2) e arquivar.
5. **Limite:** busca com mais de 80 caracteres e quantidade `1.250` (lida como 1250).

## 14. Ordem de implementação e responsáveis

Banco, depois API e backend, depois BFF e telas (o BFF já existe no PR #338). Banco e API do Hub são do Gustavo pela divisão do vault ([[Regras-do-Vault]]); o Nathan confirma. Depende da validação da Mayara e das decisões do Cadu.

## 15. Riscos, rollback e perguntas em aberto

- **Perguntas:** as 16, em [[Perguntas-Qualidade-Mayara]]. Concessão e RNC na saída contrariam [[08-Qualidade-Entrada]] (N16-125) e [[11-Qualidade-Saida]] (divergência para o PCP) e são do Cadu.
- **Duas fontes de verdade:** se a decisão ficar no MES e no Hub ao mesmo tempo, o mesmo lote ou peça pode ser decidido duas vezes. Definir qual sistema vale antes de publicar.
- **Rollback:** as telas ficam atrás da permissão; sem as permissões concedidas, o menu não aparece.
- **Pendências antigas** (trava por setor N16-124, prioridade da fila, fechamento da RNC, sucata e refugo, saída sem laudo): seguem abertas nas notas de regras.

## 16. Impacto no vault quando for entregue

Os selos 🔴 das notas de regras viram ✅ com a citação do código; [[08-Qualidade-Entrada]] e [[11-Qualidade-Saida]] passam a descrever o Hub como a tela da Qualidade; este contrato vira `implementado-na-develop` e vai para `Entregues/`.

## Ver também

[[SQL-025-Qualidade-v2-Banco-e-API]] · [[08-Qualidade-Entrada]] · [[11-Qualidade-Saida]] · [[Perguntas-Qualidade-Mayara]] · [[Chamados-Qualidade-v2]] · [[Contratos-da-v2]] · [[00-Fluxo-Mestre-0b]]
