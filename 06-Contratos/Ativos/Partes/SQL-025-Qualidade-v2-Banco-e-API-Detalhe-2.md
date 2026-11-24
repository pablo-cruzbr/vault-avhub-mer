---
tags: [contrato, banco, qualidade, rnc, dossie, laudo, minio, proposta, parte]
criado: 2026-11-24
estado-em: 2026-11-24
status: proposta
dono: Pablo
parte-de: "[[SQL-025-Qualidade-v2-Banco-e-API]]"
fontes: [av-hub feat/qualidade-v2 (lib/domain/qualidade-*.ts, app/api/qualidade/**), api-acos-vital (leitura), Banco-MES, API-023, SQL-024]
---

# SQL-025 · Qualidade v2: §7 a §12 Rotas, migração, riscos e aceite (2/2)

## 7. Rotas a publicar no Hub (`api-acos-vital`)

Todas sob `/qualidade/*`, com o Bearer do usuário, `codigo_empresa` pelo escopo de unidade e um `ROTA_SEM_PERMISSAO_MAPEADA` (403) para quem não tem a tela, como o mapa de rotas do SQL-023. O BFF chama as rotas com o mesmo caminho. Erros no padrão do Hub: `{ error: string, codigo?: string }`; **404 sem `codigo` = rota não publicada** (o BFF usa isso, ver `gravarNoHub`); **404 com `codigo` = recurso inexistente** (`LOTE_NAO_ENCONTRADO`, `PARCIAL_NAO_ENCONTRADA`, `RNC_NAO_ENCONTRADA`, `DOSSIE_NAO_ENCONTRADO`, `ANEXO_NAO_ENCONTRADO`). **A API nunca deve responder 404 sem `codigo` para recurso inexistente.**

Permissões: `V` = `pode_visualizar`, `E` = `pode_editar`, `A` = `pode_aprovar`.

### 7.1 Entrada

| Método e rota (API) | Rota do BFF | Perm. | Corpo | Resposta | Erros |
|---|---|---|---|---|---|
| `GET /qualidade/lotes` | `GET /api/qualidade/entrada/lotes` | `inspecao-entrada` V | query `codigo_empresa` (uuid), `status` (`PENDENTE`, `QUARENTENA`, `LIBERADO`, `REPROVADO`), `q` (até 80), `page`, `limit` (até 200) | `{ lotes: LoteInspecao[], total, resumo: { pendentes, quarentena, reprovados, rnc_devolucao_pendente, rnc_sem_tratativa } }` | 400 filtro inválido |
| `POST /qualidade/lotes/:id/aprovar` | `POST /api/qualidade/entrada/lotes/:id/aprovar` | `inspecao-entrada` E | `{ laudo_url: string(<=1000), conferencia: ItemConferencia[] }` | `{ lote, lote_filho: null }` | 400 falta laudo, conferência incompleta, item não conforme, ids da lista padrão ausentes; 404 `LOTE_NAO_ENCONTRADO`; 409 lote não `PENDENTE` ("já foi decidido"); 409 laudo digital com `conclusao = REPROVADO` |
| `POST /qualidade/lotes/:id/reprovar` | `POST /api/qualidade/entrada/lotes/:id/reprovar` | `inspecao-entrada` E | `{ laudo_url, motivo(<=300), evidencia_url, conferencia, quantidade_reprovada?: number\|null }` | `{ lote, lote_filho }` (`lote_filho` só se parcial); abre a RNC com número `RNC-AAAA-NNNN` | 400 motivo, evidência, laudo, conferência sem item não conforme, quantidade fora de 0,0001 até o saldo; 404; 409 já decidido |
| `POST /qualidade/rnc/:id/tratativa` | `POST /api/qualidade/entrada/rnc/:id/tratativa` | `inspecao-entrada` E | `{ analise_causa(<=500), acao_corretiva: TROCA\|REPARO\|COMPLEMENTO\|DEVOLUCAO, observacao?: string(<=300) }` | `LoteInspecao` com a RNC em `EM_TRATAMENTO`; `nota_devolucao_pendente = true` se troca ou devolução | 400 campo; 404 `RNC_NAO_ENCONTRADA`; 409 RNC fora de `ABERTA` ("já tem tratativa") |

Quantidades: `numeric(14,4)`, a API aceita decimal com ponto. `LoteInspecao` e `Rnc` com os campos de `lib/domain/qualidade-entrada.ts` (a RNC traz `numero`, `origem`, `status`, `analise_causa`, `acao_corretiva`, `reposicao_lote_id`...). A reposição aprovada por um lote com `lote_pai_id` da RNC **encerra** a RNC de troca ou complemento; o reparo aprovado encerra a de reparo; a devolução encerra com a nota emitida (a nota continua no Omie, fora do sistema). Aprovar qualquer outro lote da mesma requisição e material **não** libera a quarentena (bug 5 da revisão): só o lote de reposição ou o reparado daquela RNC (`lote_pai_id`).

### 7.2 Saída

| Método e rota (API) | Rota do BFF | Perm. | Corpo | Resposta | Erros |
|---|---|---|---|---|---|
| `GET /qualidade/saida/parciais` | `GET /api/qualidade/saida/parciais` | `inspecao-saida` V | filtros como acima | `{ parciais: ParcialInspecao[], total, resumo: { a_receber, em_inspecao, reprovadas, segregadas } }` | 400 |
| `POST /qualidade/saida/parciais/:id/receber` | idem | `inspecao-saida` E | `{}` | `ParcialInspecao` (`EM_TRANSITO` → `RECEBIDO`) | 404 `PARCIAL_NAO_ENCONTRADA`; 409 estado |
| `POST /qualidade/saida/parciais/:id/iniciar` | idem | `inspecao-saida` E | `{}` | `ParcialInspecao` (`RECEBIDO` → `EM_ANDAMENTO`) | 404; 409 |
| `POST /qualidade/saida/parciais/:id/mover` | idem | `inspecao-saida` E | `{ conferencia }` (completa e sem não conforme) | `ParcialInspecao`; **aprova**: segue ao Estoque (LOG-53); grava a conferência | 400; 404; 409 (só `EM_ANDAMENTO`) |
| `POST /qualidade/saida/parciais/:id/reprovar` | idem | `inspecao-saida` E | `{ conferencia, motivo(<=300), local_segregacao(<=80), evidencia_url?, quantidade_reprovada?: number\|null }` | `ParcialInspecao` com `status = REPROVADO`, `segregacao`, `nao_conformidade` (RNC `ABERTA`, número novo) e, se parcial, `parcial_origem_id` | 400; 404; 409 (só `EM_ANDAMENTO`) |
| `POST /qualidade/saida/parciais/:id/tratativa` | idem | `inspecao-saida` E | `{ tratativa, responsaveis: ('QUALIDADE'\|'PCP'\|'COMERCIAL'\|'CLIENTE')[], justificativa: string\|null, autorizacao_cliente_url?: string\|null }` | `ParcialInspecao` como ficou (ver abaixo) | 400 (responsáveis vazios ou repetidos, `CONCESSAO` sem `CLIENTE`, justificativa ou autorização faltando); 404; 409 (peça não `REPROVADO` ou RNC fora de `ABERTA`) |

Efeito da tratativa (de `destinoDaTratativaSaida`): `FALSO_ALARME`: sai da segregação, volta a `EM_ANDAMENTO`, RNC `ENCERRADA`; `RETRABALHO` e `REPARO`: volta ao setor anterior como `EM_TRANSITO` com `retrabalho = true`, RNC `AGUARDANDO_REINSPECAO` (encerra quando a peça passar na nova verificação); `SUBSTITUICAO`, `DEVOLUCAO`, `DESCARTE`: a peça sai da fila, RNC `ENCERRADA`; `CONCESSAO`: segue para a próxima etapa com `concessao = true`, RNC `ENCERRADA`. A segregação ganha `liberada_em` em todos os casos em que a peça sai dela.

### 7.3 Laudo e anexos

| Método e rota (API) | Rota do BFF | Perm. | Corpo | Resposta | Erros |
|---|---|---|---|---|---|
| `POST /qualidade/anexos` | `POST /api/qualidade/anexos` | `inspecao-entrada` ou `inspecao-saida` ou `documentacao-cliente`, E | multipart: `arquivo`, `origem` | `AnexoQualidade` `{ id, nome, tipo, tamanho, url }` | 400 tipo, vazio ou acima de 10 MB; conteúdo não bate com o tipo |
| `GET /qualidade/anexos/:id` | `GET /api/qualidade/anexos/:id` | as mesmas, V | | arquivo (ou URL assinada) | 404 `ANEXO_NAO_ENCONTRADO` |
| `POST /qualidade/laudos` | `POST /api/qualidade/laudos` | `inspecao-entrada` E | `{ anexo_id, lote_id, numero_certificado, corrida, itens[], observacoes }` | `{ numero: 'LD-AAAA-NNNN', conclusao, anexo }` | 400 itens vazios ou acima de 30; 404 lote; 409 lote não `PENDENTE` |

### 7.4 Documentação ao cliente

| Método e rota (API) | Rota do BFF | Perm. | Corpo | Resposta | Erros |
|---|---|---|---|---|---|
| `GET /qualidade/dossies` | `GET /api/qualidade/documentacao/dossies` | `documentacao-cliente` V | `codigo_empresa`, `status`, `q`, `page`, `limit` | `{ dossies: Dossie[], total, resumo: { em_montagem, em_revisao, aprovados, enviados, comentados, arquivados } }` | 400 |
| `GET /qualidade/dossies/:id` | (usado pelo BFF do Data Book) | V | | `Dossie` | 404 `DOSSIE_NAO_ENCONTRADO` |
| `POST /qualidade/dossies/:id/anexar` | `POST /api/qualidade/documentacao/dossies/:id/anexar` | E | `{ documento_id, anexo: AnexoQualidade\|null }` | `Dossie` | 400; 404; 409 (status) |
| `POST .../adicionar-documento` | idem | E | `{ tipo, nome(<=120), rastreio: { item, lote, corrida }\|null }` | `Dossie` | 400; 409 |
| `POST .../remover-documento` | idem | E | `{ documento_id }` | `Dossie` | 404; 409 |
| `POST .../enviar-revisao` | idem | E | `{}` | `Dossie` `EM_REVISAO` (todos os obrigatórios anexados) | 409 faltam documentos |
| `POST .../devolver` | idem | **A** | `{ motivo(<=500) }` | `Dossie` `EM_MONTAGEM` | 400; 409 |
| `POST .../aprovar` | idem | **A** | `{ itens: [{ id, confere }], observacao }` (os 4 ids; todos `true`) | `Dossie` `APROVADO` | 400; 409 |
| `POST .../registrar-envio` | idem | E | `{ canal: 'PORTAL'\|'EMAIL', destino(<=200), protocolo?: string(<=80) }` | `Dossie` `ENVIADO` | 400; 409 |
| `POST .../registrar-comentario` | idem | E | `{ texto(<=1000), reprova: boolean }` | `Dossie`: `COMENTADO`; se `reprova`, volta a `EM_MONTAGEM` e `revisao_numero + 1` | 400; 409 |
| `POST .../reabrir` | idem | E | `{}` | `Dossie` `EM_MONTAGEM`, `revisao_numero + 1` | 409 |
| `POST .../arquivar` | idem | E | `{ local: 'SHAREPOINT'\|'ERP', caminho(<=300) }` | `Dossie` `ARQUIVADO` | 400; 409 |
| `POST /qualidade/dossies` (nova) | (criado pelo pedido) | E | `{ codigo_empresa, numero_pedido_venda }` | `Dossie` | 409 já existe dossiê do pedido |

Aprovar e devolver são da validação (passo 7) e pedem `pode_aprovar` em `documentacao-cliente`. **Ações por tela (`acoes_usadas`):** a tela de permissões do Hub passou a mostrar só as ações que a API devolve em `acoes_usadas` por tela. Para o "Aprovar" aparecer em `documentacao-cliente`, a API precisa (1) **cadastrar a tela `documentacao-cliente`** em `auth.telas` (grupo `qualidade`) e (2) **listar `pode_aprovar`** nas `acoes_usadas` dela (além de `pode_visualizar` e `pode_editar`). `inspecao-entrada` e `inspecao-saida` listam `pode_visualizar` e `pode_editar`; se a Qualidade decidir que a decisão do lote exige aprovador separado, `pode_aprovar` entra aqui também. Sem isso, ninguém consegue ser perfilado para aprovar ou devolver o dossiê (bug 1 da revisão, do lado do Hub). **[D12]** Quando o dossiê nasce: **[PAUTA QUALIDADE]** (D9): ao liberar o pedido com `acompanhamento_qualidade`, ou só quando o último item fabricado for aprovado na saída?

### 7.5 Fora desta proposta

`POST /qualidade/simulacao` e `POST .../documentacao/simulacao` (existem no BFF só para demonstrar com dados de teste; **não publicar**). O endpoint do índice do Data Book (`POST /api/qualidade/documentacao/data-book`) gera o PDF no BFF e usa `GET /qualidade/dossies/:id` e `POST .../anexar` acima. A nota de devolução continua no Omie.

## 8. Migração

1. **Ordem:** (a) migração do MES (alterar `rncs`, criar as tabelas 4.2 a 4.3 e `qualidade_sequencias`); (b) SQL do Hub (schema `core_qualidade`, tabelas 4.5 e 4.6, telas e mapa de rotas); (c) criar o bucket; (d) publicar as rotas na API (primeiro leitura, depois escrita); (e) o Hub passa `QUALIDADE_FIXTURES` para desligado.
2. **RNCs que já existem no MES:** dar número e `origem = ENTRADA`, `status` conforme o lote (lote `REPROVADO` com RNC e nota emitida = `ENCERRADA`; senão `ABERTA`), na ordem de `created_at` por ano, **na mesma migração** que cria o contador (o contador começa do maior número usado em cada ano). Motivo copiado de `lotes.motivo_reprovacao`.
3. **Lotes e parciais antigos** não têm conferência: ficam sem linha em `qualidade_conferencias` (a tela mostra "sem conferência registrada").
4. **Idempotência e volta:** `CREATE ... IF NOT EXISTS`; rodar de novo não muda nada. Volta pela auditoria; como as colunas novas são anuláveis, reverter o código basta.
5. **Permissões (SQL, no padrão do SQL-023 e SQL-024):** telas `inspecao-entrada`, `inspecao-saida`, `documentacao-cliente` em `auth.telas` (grupo `qualidade`, mesmos slugs do MES), linhas no mapa de rotas para cada rota da seção 7, e `pode_aprovar` listada em `acoes_usadas` de `documentacao-cliente` e concedida só ao perfil que valida (**[PAUTA QUALIDADE]**: qual perfil).
6. **Teste no Docker** com a cópia do tst antes do tst e da produção, como no SQL-024.

## 9. Riscos

- **Dois bancos:** RNC no MES e anexo no Hub: sem FK, o `evidencia_anexo_id` pode apontar para um anexo apagado. Mitigação: anexo nunca é apagado de verdade (só `deleted_at`); rotina de conferência.
- **Alterar `rncs` com dados em produção:** a coluna `id_lote` passa a nula e a RNC ganha número; o MES (telas e `qualidade.service.ts`) e o aviso de recompra (LOG-58, `enfileirarAvisoRecompraRnc`) leem essa tabela. Precisa de teste no `api-pcp` e de acordo com quem mantém o MES.
- **Número com buraco** se alguém usar `SEQUENCE` ou reservar o número antes de gravar: ver seção 5.
- **Regra duplicada** no Hub (domínio em TypeScript) e na API (JS) e no MES: a fonte única é `lib/domain/qualidade-*.ts` do av-hub e os testes dela; a API tem de repetir e testar os mesmos casos (transições do dossiê, tratativas, conferência).
- **Concorrência:** dois inspetores decidindo o mesmo lote: o `UPDATE ... WHERE status = 'PENDENTE'` e o 409 resolvem; a decisão, a RNC, o lote filho, a conferência e o `lote_historico` vão na mesma transação.
- **Anexo grande ou arquivo falso:** limite de 10 MB e conferência do conteúdo no servidor.
- **O MES caído:** as rotas `/qualidade/lotes` e `/qualidade/saida/*` dependem dele; precisam responder 503 com `codigo` (como a Torre de Fluxo responde `mes_indisponivel`).

## 10. Para o Gustavo revisar

1. **D1. Onde mora cada coisa.** A divisão da seção 3 (conferência, RNC, tratativa e segregação no MES; dossiê, anexos e laudo no Hub) está certa? A alternativa é tudo no Hub, com o MES lendo por API, ao custo de perder a atomicidade com `lotes` e `itens_parciais`.
2. **D2. Bucket e MinIO.** O storage é SeaweedFS ou MinIO? Posso criar o bucket `qualidade` com versionamento? Quem cria o `S3_BUCKET_QUALIDADE` no ambiente?
3. **D3. Quem grava o arquivo.** A API do Hub recebe o upload e grava no S3, ou o BFF grava e só registra o metadado? (A proposta é a API, para o MES e o Hub terem um só dono do arquivo.)
4. **D4. `rncs` do MES.** Qual o schema Prisma atual da tabela (há `numero`? como o aviso de recompra a lê)? Ok alterá-la em vez de criar uma tabela nova? E a `Divergencia` tipo `QUALIDADE` da saída continua sendo aberta junto da RNC, ou a RNC a substitui?
5. **D5. Número e unicidade.** O contador por `INSERT ... ON CONFLICT ... RETURNING` na mesma transação serve? Pode ser uma só sequência `RNC` para entrada e saída (é o que o Hub assume)? E o índice parcial que impede duas RNCs ativas no mesmo lote ou peça?
6. **D6. Conferência.** Gravar os itens da conferência como linhas (4.2) ou como `jsonb` no lote? Os ids da lista padrão ficam no código (e a API valida), ou numa tabela de modelos de conferência?
7. **D7. Reprovação parcial na saída.** Usar o split de `itens_parciais` existente (`id_parcial_origem`) para a parte reprovada, e a parte boa seguir? Há efeito em reserva, consumo de matéria-prima ou OP que eu não vejo?
8. **D8. Dossiê.** Os `itens` e os `requisitos` ficam como `jsonb` (foto do pedido) ou viram tabela? Precisamos de uma view para o Hub ler o pedido e o lote de cada item (hoje o dossiê trazia o lote e a corrida escritos à mão)?
9. **D9. Chamada ao MES.** As rotas `/qualidade/lotes` e `/qualidade/saida/*` do Hub seguem o proxy do `/fluxo` (`MES_API_URL` e `MES_API_KEY`) ou o `api-pcp` publica as rotas e o BFF chama direto? Como o MES sabe qual usuário do Hub decidiu (`decidido_por`)?
10. **D10. Permissões.** Posso seguir o padrão do SQL-023 e SQL-024 (telas em `auth.telas`, mapa de rotas, `pode_aprovar` só para `documentacao-cliente` aprovar e devolver)? Os três slugs existem no banco real? (Não achei `inspecao-entrada`, `inspecao-saida` nem `documentacao-cliente` no esqueleto de 23/11 do tst.)
12. **D12. `acoes_usadas` por tela.** A API cadastra `documentacao-cliente` em `auth.telas` e devolve `pode_aprovar` nas `acoes_usadas` dela (e `pode_visualizar`/`pode_editar` nas três telas)? De onde sai `acoes_usadas`: do mapa de rotas (as rotas `aprovar` e `devolver` exigem `pode_aprovar`) ou de coluna própria da tela?
11. **D11. Concorrência e auditoria.** Trigger de imutabilidade em `dossie_eventos` e `lote_historico` está bom? Quanto tempo guardar os arquivos?

## 11. Decisões pendentes da Qualidade (pauta com a Mayara e o Cadu)

Nada abaixo é decisão do banco; a estrutura acima admite qualquer resposta, mas os CHECKs e as listas dependem delas:

- Lista de tratativas da saída: **falso alarme** e **concessão do cliente** ficam? (o N16-125 proibia a concessão.)
- **Quem decide** cada tratativa e quem pode ser responsável (Qualidade, PCP, Comercial, Cliente).
- O que **RDFA** significa (o documento aparece como "RNC / RDFA" sem definição).
- **Reprovação parcial na saída** (N16-128): quando entra.
- **Dono do fechamento da RNC** (Qualidade ou Compras) e a **nota de devolução** (só sinalizar, ou o sistema cria no Omie).
- **Quando nasce o dossiê** e quem o aprova (perfil da validação, passo 7).
- **Prazo de guarda** de laudo, RNC e dossiê; **local do arquivo** (SharePoint ou ERP).
- Quarentena da parte boa na reprovação parcial da entrada (API-023, seção 7).

## 12. Critérios de aceite

- [ ] Aprovar lote com laudo digital `REPROVADO` responde 409; sem conferência completa, 400.
- [ ] Reprovar 30 de 100 cria lote filho `REPROVADO`, RNC `RNC-AAAA-NNNN` com `nota_devolucao_pendente = true` e conferência gravada, na mesma transação.
- [ ] 20 RNCs simultâneas, com 1 forçada a falhar, dão 19 números seguidos, sem buraco nem repetição; em 1º de janeiro o contador recomeça.
- [ ] A tratativa da saída muda a peça, a segregação e a RNC como na seção 7.2; concessão sem autorização ou sem responsável `CLIENTE` responde 400.
- [ ] O dossiê percorre `EM_MONTAGEM` até `ARQUIVADO`; ação fora do status responde 409; aprovar sem `pode_aprovar` responde 403.
- [ ] Anexo de 11 MB ou de tipo diferente responde 400; arquivo com tipo falso é recusado; o arquivo fica no bucket `qualidade`.
- [ ] Rota não publicada responde 404 **sem** `codigo`; recurso inexistente responde 404 **com** `codigo`.
