---
tags: [contrato, banco, qualidade, rnc, dossie, laudo, minio, proposta, parte]
criado: 2026-11-24
estado-em: 2026-11-24
status: proposta
dono: Pablo
parte-de: "[[SQL-025-Qualidade-v2-Banco-e-API]]"
fontes: [av-hub feat/qualidade-v2 (lib/domain/qualidade-*.ts, app/api/qualidade/**), api-acos-vital (leitura), Banco-MES, API-023, SQL-024]
---

# SQL-025 · Qualidade v2: §4 a §6 Tabelas, numeração e anexos (1/2)

## 4. Tabelas propostas

Convenções: no MES, `uuid` gerado pela aplicação, `timestamp(3)`, `numeric(14,4)` para quantidade, `snake_case`, FK RESTRICT por padrão. No Hub, `uuidv7()`, `timestamptz`, `created_at/by`, `updated_at/by`, `deleted_at/by` como `core.documentos_anexos`. Valores de status como `varchar` + `CHECK` no Hub e `enum` no Prisma do MES (padrão de cada banco). Listas abaixo: `PK` chave primária, `FK` chave estrangeira, `UQ` único, `IX` índice.

### 4.1 MES — alterar `rncs` (existe)

Colunas a **acrescentar** (todas anuláveis ou com padrão, para não quebrar as linhas atuais):

| Coluna | Tipo | Observação |
|---|---|---|
| `numero` | `varchar(14)` UQ | `RNC-AAAA-NNNN`; as linhas antigas recebem número na migração (seção 8) |
| `origem` | enum `OrigemRnc` (`ENTRADA`, `SAIDA`) | padrão `ENTRADA` |
| `status` | enum `StatusRnc` (`ABERTA`, `EM_TRATAMENTO`, `AGUARDANDO_REINSPECAO`, `ENCERRADA`) | padrão `ABERTA` |
| `motivo` | `varchar(300)` | hoje o motivo está em `lotes.motivo_reprovacao`; copiar e passar a ler da RNC |
| `id_item_parcial` | `uuid` FK `itens_parciais` RESTRICT, nulo | preenchido quando `origem = SAIDA` |
| `id_lote` | passa a **nulo** | na saída não há lote de compra (CHECK: `id_lote` ou `id_item_parcial`, nunca os dois nulos) |
| `analise_causa` | `varchar(500)` | |
| `acao_corretiva` | enum `AcaoCorretivaEntrada` (`TROCA`, `REPARO`, `COMPLEMENTO`, `DEVOLUCAO`) | só entrada |
| `observacao_tratativa` | `varchar(300)` | |
| `id_lote_reposicao` | `uuid` FK `lotes` SET NULL | lote que chegou na troca ou no complemento |
| `evidencia_anexo_id` | `uuid` | `core_qualidade.anexos` (outro banco: sem FK, como `materiais.id_produto_avhub`); `evidencia_url` fica durante a transição |
| `aberta_por`, `tratativa_em`, `tratativa_por`, `encerrada_em`, `encerrada_por` | `uuid`/`timestamp(3)` | quem e quando |

Índices: `UQ(numero)`, `IX(status)`, `IX(id_lote)`, `IX(id_item_parcial)`, `IX(origem, status)`.
Regra no banco: `UNIQUE (id_lote) WHERE status <> 'ENCERRADA' AND origem = 'ENTRADA'` e o mesmo para `id_item_parcial`, para não abrir duas RNCs ativas para o mesmo lote ou peça. **[D5]**

### 4.2 MES — `qualidade_conferencias` (nova): conferência item a item

Uma linha por item marcado, gravada **na mesma transação** da decisão (aprovar, reprovar, mover).

| Coluna | Tipo | Observação |
|---|---|---|
| `id` | `uuid` PK | |
| `id_lote` | `uuid` FK `lotes` RESTRICT, nulo | entrada |
| `id_item_parcial` | `uuid` FK `itens_parciais` RESTRICT, nulo | saída. CHECK: exatamente um dos dois preenchido |
| `ciclo` | `int` | 1 na primeira inspeção; sobe a cada reinspeção (reparo, retrabalho). A conferência antiga fica |
| `item_id` | `varchar(40)` | `nf_po`, `dimensional`... (ids de `conferenciaEntradaPadrao` e `conferenciaSaidaPadrao`) |
| `grupo` | enum `GrupoConferencia` (`DOCUMENTAL`, `INSPECAO`, `ANALISE`, `PECA`) | |
| `descricao` | `varchar(120)` | cópia do texto do item na hora da decisão (a lista pode mudar depois) |
| `resultado` | enum (`CONFORME`, `NAO_CONFORME`, `NAO_SE_APLICA`), **nulo** | nulo = não conferido (permitido só na reprovação; ver `errosConferencia`) |
| `observacao` | `varchar(200)` | obrigatória se `NAO_CONFORME` (CHECK) |
| `decisao` | enum (`APROVADO`, `REPROVADO`) | a decisão que a conferência sustentou |
| `conferido_por`, `conferido_em` | `uuid`, `timestamp(3)` | |

`UQ(id_lote, ciclo, item_id)` e `UQ(id_item_parcial, ciclo, item_id)` (parciais). `IX(id_lote)`, `IX(id_item_parcial)`.
A lista padrão **não** fica no banco (é código do Hub e da API); o servidor valida que **todos os ids da lista padrão** vieram (bug 3 da revisão) e grava o que veio. **[D6]**

### 4.3 MES — tratativa da saída e segregação

**`qualidade_tratativas_saida`** (nova), 1 para 1 com a RNC de origem `SAIDA`:

| Coluna | Tipo | Observação |
|---|---|---|
| `id_rnc` | `uuid` PK e FK `rncs` RESTRICT | |
| `tratativa` | enum `TratativaSaida` (`FALSO_ALARME`, `RETRABALHO`, `REPARO`, `SUBSTITUICAO`, `DEVOLUCAO`, `DESCARTE`, `CONCESSAO`) | **[PAUTA QUALIDADE]** a lista (falso alarme, concessão) |
| `justificativa` | `varchar(500)` | obrigatória em substituição, devolução e descarte (CHECK) |
| `autorizacao_cliente_anexo_id` | `uuid` | obrigatória em `CONCESSAO` (CHECK) |
| `destino` | enum (`VOLTA_PARA_INSPECAO`, `VOLTA_AO_SETOR`, `SAI_DA_FILA`, `SEGUE_COM_CONCESSAO`) | derivado da tratativa; gravado para auditoria |
| `decidido_por`, `decidido_em` | `uuid`, `timestamp(3)` | |

**`qualidade_tratativa_responsaveis`** (nova): `id_rnc` FK, `responsavel` enum (`QUALIDADE`, `PCP`, `COMERCIAL`, `CLIENTE`), PK `(id_rnc, responsavel)`. Regra: `CONCESSAO` exige a linha `CLIENTE` (validada na API; CHECK entre tabelas não existe, usar trigger ou a função). **[PAUTA QUALIDADE]**: quem pode decidir o quê.

**`qualidade_segregacoes`** (nova): a peça separada e bloqueada.

| Coluna | Tipo |
|---|---|
| `id` | `uuid` PK |
| `id_item_parcial` | `uuid` FK `itens_parciais` RESTRICT |
| `id_rnc` | `uuid` FK `rncs` RESTRICT |
| `local` | `varchar(80)` |
| `quantidade` | `numeric(14,4)` |
| `bloqueada_em`, `bloqueada_por` | `timestamp(3)`, `uuid` |
| `liberada_em`, `liberada_por` | nulos até a tratativa liberar |

`IX(id_item_parcial)`; `UNIQUE (id_item_parcial) WHERE liberada_em IS NULL` (uma segregação ativa por parcial). A peça segregada **não conta no saldo nem segue no roteiro**: `itens_parciais.status = REPROVADO` continua sendo o bloqueio; esta tabela só diz onde ela está.

### 4.4 MES — reprovação parcial na saída (N16-128)

Sem tabela nova. Reprovar parte da parcial **divide** a `itens_parciais` com o split que já existe: a parte boa continua `EM_ANDAMENTO` (ou segue); a parte reprovada vira uma parcial nova, `status = REPROVADO`, `id_parcial_origem` apontando a original, e a RNC e a segregação pertencem à parcial nova. A soma das duas quantidades tem de ser igual à da original (CHECK na função). Quantidade reprovada de 0,0001 até a quantidade da parcial; igual = reprovação total (sem split). **[PAUTA QUALIDADE]**: o N16-128 diz quando entra a reprovação parcial na saída (D7).

### 4.5 Hub — schema `core_qualidade` (novo): dossiê

Criar o schema `core_qualidade` (SQL-023 e SQL-024 não criam schema; este contrato sim).

**`dossies`**: um por pedido de venda (e por revisão de entrega do dossiê, no mesmo registro: `revisao_numero`).

| Coluna | Tipo | Observação |
|---|---|---|
| `id` | `uuid` PK (`uuidv7()`) | |
| `codigo_empresa` | `uuid` NOT NULL | unidade (escopo de unidade, como o resto do Hub) |
| `numero_pedido_venda` | `varchar(15)` NOT NULL | mesma chave de `pedidos_vendas_liberacao` `(codigo_empresa, numero_pedido)` |
| `cliente`, `po_cliente`, `prazo_entrega` | `varchar`, `varchar`, `date` | cópia do pedido na criação |
| `revisao_numero` | `int` NOT NULL, padrão 0 | sobe a cada volta à montagem depois de enviado |
| `status` | `varchar(12)` CHECK (`EM_MONTAGEM`, `EM_REVISAO`, `APROVADO`, `ENVIADO`, `COMENTADO`, `ARQUIVADO`) | padrão `EM_MONTAGEM` |
| `requisitos` | `jsonb` | `normas[]`, `ce_maximo`, `nace`, `pit`, `data_book`, `outros[]` (vem de `requisitos_qualidade` do pedido) |
| `itens` | `jsonb` | itens rastreados (`item`, `descricao`, `quantidade`, `unidade_medida`, `lote`, `corrida`). **Proposta:** jsonb por ser cópia (foto) do pedido; D8 pergunta se vira tabela |
| `revisao` | `jsonb` | conferência final (4 itens: `atende_po`, `normas`, `requisitos_cliente`, `rastreabilidade`), `observacao`, `validado_por`, `aprovado_em` |
| `documentos_alterados_em` | `timestamptz` | última mudança em documento que não é o índice do Data Book |
| `arquivamento_local`, `arquivamento_caminho`, `arquivado_em`, `arquivado_por` | `varchar(10)` (`SHAREPOINT`, `ERP`), `varchar(300)`, `timestamptz`, `uuid` | arquivamento |
| auditoria | `created_at/by`, `updated_at/by` | |

`UQ(codigo_empresa, numero_pedido_venda) WHERE deleted_at IS NULL` (um dossiê vivo por pedido), `IX(status)`, `IX(codigo_empresa, status)`.

**`dossie_documentos`**: `id` PK; `id_dossie` FK CASCADE; `tipo` (`CERTIFICADO_QUALIDADE`, `CERTIFICADO_ORIGEM`, `RELATORIO_ENSAIO`, `RELATORIO_INSPECAO`, `RNC_RDFA`, `DATA_BOOK`, `OUTRO`); `nome varchar(120)`; `obrigatorio bool`; `id_anexo` FK `anexos` (nulo até anexar); `rastreio_item varchar(40)`, `rastreio_lote varchar(40)`, `rastreio_corrida varchar(40)`; `anexado_em`, `anexado_por`. `IX(id_dossie)`. Documento removido = `deleted_at`.

**`dossie_envios`**: `id`; `id_dossie` FK; `revisao_numero`; `canal` (`PORTAL`, `EMAIL`); `destino varchar(200)`; `protocolo varchar(80)`; `enviado_em`; `enviado_por`. `IX(id_dossie)`. Só inclusão.

**`dossie_comentarios_cliente`**: `id`; `id_dossie` FK; `revisao_numero`; `texto varchar(1000)`; `reprova bool`; `em`; `registrado_por`. `IX(id_dossie)`. Só inclusão.

**`dossie_eventos`** (histórico): `id`; `id_dossie` FK; `em`; `por`; `acao varchar(30)`; `texto varchar(500)`. Só inclusão, com trigger que recusa `UPDATE` e `DELETE` (igual a `lote_historico_imutavel`).

Transições (a API repete as regras de `lib/domain/qualidade-documentacao.ts`): `anexar`, `adicionar-documento`, `remover-documento`, `enviar-revisao` só em `EM_MONTAGEM`; `devolver` e `aprovar` só em `EM_REVISAO`; `registrar-envio` só em `APROVADO`; `registrar-comentario` só em `ENVIADO`; `reabrir` só em `COMENTADO`; `arquivar` em `ENVIADO` ou `COMENTADO`. Outro status: 409.

### 4.6 Hub — `core_qualidade.anexos` e `laudos`

**`anexos`**: `id uuid` PK; `bucket varchar(40)`; `chave varchar(300)` (caminho no S3); `nome varchar(200)`; `tipo varchar(40)` (`application/pdf`, `image/jpeg`, `image/png`, `image/webp`); `tamanho bigint` (> 0 e ≤ 10 MB); `sha256 char(64)`; `origem varchar(20)` (`LAUDO`, `EVIDENCIA`, `AUTORIZACAO_CLIENTE`, `DOCUMENTO_DOSSIE`, `DATA_BOOK`); `codigo_empresa uuid`; `created_at/by`; `deleted_at/by`. `UQ(bucket, chave)`, `IX(origem)`, `IX(sha256)`.

**`laudos`** (laudo digital preenchido no sistema): `id`; `numero varchar(14)` UQ (`LD-AAAA-NNNN`); `id_lote uuid` (MES, sem FK: outro banco); `id_anexo` FK `anexos` (o PDF); `conclusao` (`APROVADO`, `REPROVADO`); `numero_certificado varchar(40)`; `corrida varchar(40)`; `itens jsonb` (características, faixa, medido, resultado: ver `laudo.ts`); `observacoes varchar(1000)`; `created_at/by`. `IX(id_lote)`. O laudo digital é só inclusão; um novo laudo para o mesmo lote é outro número.

## 5. Numeração sem buraco, por ano

RNC (`RNC-AAAA-NNNN`, **a mesma sequência para entrada e saída**) e laudo (`LD-AAAA-NNNN`).

- Tabela de contadores (uma por banco): `(tipo varchar(10), ano int, ultimo_numero int)`, PK `(tipo, ano)`, como `core_comercial.sequencias_documento`. No MES: `qualidade_sequencias` (`tipo = 'RNC'`); no Hub, `core_qualidade.sequencias` (`tipo = 'LD'`).
- **Não usar `SEQUENCE` do Postgres**: ela não devolve o número quando a transação desfaz, e isso abre buraco. Usar `INSERT ... ON CONFLICT (tipo, ano) DO UPDATE SET ultimo_numero = ultimo_numero + 1 RETURNING ultimo_numero`, **dentro da mesma transação** que grava a RNC (ou o laudo). O `UPDATE` trava a linha; se a transação desfaz, o contador volta e nenhum número é perdido. Quem grava ao mesmo tempo espera na fila (aceitável: poucas RNCs por dia).
- O número só existe em um registro gravado: nunca reservar antes (a tela mostra o número depois de salvar).
- Ano pelo relógio do **servidor** em `America/Sao_Paulo` (`to_char(now() AT TIME ZONE 'America/Sao_Paulo','YYYY')`), não pelo do navegador. Em 1º de janeiro começa em 0001.
- Formato: `lpad(n::text, 4, '0')`; passando de 9999 vira 5 dígitos (o `varchar(14)` comporta).
- `CHECK (numero ~ '^RNC-[0-9]{4}-[0-9]{4,}$')` e `UQ(numero)`. Nenhum número é apagado: RNC cancelada fica `ENCERRADA` (não se deleta).
- Teste de aceite: 20 RNCs em paralelo, uma delas forçada a falhar depois de pegar o número, e o resultado são 19 números seguidos e sem repetição.

## 6. Armazenamento dos anexos (MinIO / S3)

- **Bucket novo `qualidade`** (variável `S3_BUCKET_QUALIDADE`, ao lado de `S3_BUCKET_PESSOAS` e `S3_BUCKET_EMPRESA`), privado, com versionamento ligado (o arquivo da RNC não pode sumir) e `lib/s3/client.ts` aceitando o terceiro nome. O endpoint é S3 compatível com `forcePathStyle` (hoje SeaweedFS no Hub; MinIO serve igual). **[D2]** confirmar quem hospeda.
- **Chave:** `qualidade/{ano}/{origem}/{id_anexo}/{nome-sem-caracteres-especiais}`. Nunca o nome do usuário puro.
- **Quem grava:** quem tem o arquivo grava no S3. Proposta: **a API do Hub** recebe o upload (hoje o BFF guarda em memória, só para dados de teste, e a produção responde 503), confere o tipo pelo começo do arquivo (`%PDF`, JPEG, PNG, WebP, como `conteudoCombinaComTipo` do BFF), calcula o `sha256`, grava no S3 e na tabela `anexos`. **[D3]** ou o BFF grava direto no S3 e só registra o metadado na API.
- **Leitura:** `GET /qualidade/anexos/:id` confere a permissão (`inspecao-entrada`, `inspecao-saida` ou `documentacao-cliente`, `pode_visualizar`) e devolve o arquivo em fluxo ou uma URL assinada de 60 segundos. O endereço dos anexos que as telas usam hoje (`/api/qualidade/anexos/:id`) não muda; o BFF repassa.
- **Limites** (iguais aos do BFF): 10 MB; PDF, JPEG, PNG, WebP; anexo vazio recusado.
- **Laudo digital:** o BFF gera o PDF (react-pdf) e o envia pelo mesmo `POST /qualidade/anexos` com `origem = LAUDO`; depois `POST /qualidade/laudos` registra o laudo e pega o número `LD`. **O servidor lê o anexo e a conclusão do laudo** ao aprovar a entrada: `REPROVADO` no laudo digital e aprovação do lote responde 409 (bug 2 da revisão).
- **Retenção:** o arquivo de RNC, laudo e dossiê arquivado não se apaga (só `deleted_at` lógico). **[PAUTA QUALIDADE]** prazo de guarda.

