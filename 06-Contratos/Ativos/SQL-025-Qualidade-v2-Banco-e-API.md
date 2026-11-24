---
id: SQL-025
titulo: Qualidade v2 no banco e na API do hub (conferência, RNC, tratativa, segregação, dossiê, laudo e anexos)
status: proposta
autor: Pablo
data: 2026-11-24
camadas: [sql, api]
donos: {sql: Gustavo, api: Gustavo, frontend: Pablo}
nos_0b: [Q1, Q2, Q3, Q4, Q7, Q8, E5]
notas_afetadas: [Banco-MES, Banco-AvHub, 08-Qualidade-Entrada, 08-Qualidade-Saida]
depende_de: [API-023]
decisoes: []
tags: [contrato, banco, qualidade, rnc, dossie, laudo, minio, proposta]
criado: 2026-11-24
estado-em: 2026-11-24
dono: Pablo
fontes: [av-hub feat/qualidade-v2 (lib/domain/qualidade-*.ts, app/api/qualidade/**), api-acos-vital (leitura), Banco-MES, Modelo-Estoque-e-Custo-do-Lote, API-023, SQL-024, Mapa da Qualidade v2 de 19/11]
---

# SQL-025 · Qualidade v2: proposta de banco e de API

> **Situação:** `proposta`, só para o **Gustavo revisar**. Nada aqui está implementado no banco nem na API. O Hub (av-hub, branch `feat/qualidade-v2`, PR #338, rascunho) já roda com dados de teste (fixtures) e define o contrato abaixo. Os pontos marcados **[PAUTA QUALIDADE]** são decisão da Qualidade (Mayara e Cadu), não do banco.
>
> O **API-023** continua sendo o contrato das duas filas (entrada e saída) do MVP; este arquivo **soma** o que a v2 acrescentou (conferência por item, tratativas, segregação, dossiê, laudo digital, anexos). Quem fechar o contrato deve unir os dois.

## 1. Contexto curto

- A Qualidade v2 tem 3 telas no Hub: `inspecao-entrada`, `inspecao-saida` e `documentacao-cliente`. O fluxo oficial é `public/qualidade/fluxo-processo-qualidade.jpg` (no av-hub).
- Hoje o BFF (`/api/qualidade/**`) chama `GET|POST /qualidade/...` na `api-acos-vital`. **Nenhuma dessas rotas existe** (a rota não publicada devolve 404 sem `codigo`; o BFF cai nos dados de teste ou responde 503 `QUALIDADE_INDISPONIVEL`).
- A v2 acrescentou, sobre o MVP: conferência item a item na decisão; RNC com causa, ação e status (entrada e saída, mesma numeração); tratativa da saída com responsáveis; segregação da peça; reprovação parcial na saída; laudo digital (PDF gerado); anexos; e a documentação ao cliente (dossiê por pedido de venda).

## 2. O que já existe e é reaproveitado

**Onde estão os dados hoje: no MES, não no Hub.** A `api-acos-vital` não tem nenhum módulo, tabela ou migração de qualidade (varredura de `src/` e do dump `Dump do Avhub para referência (29.10).sql`: só `core.documentos_anexos`, que é outra coisa, e `qualidade_acompanha`/`acompanhamento_qualidade` no pedido). O que a Qualidade usa está no banco do **MES** (`api-pcp`, Prisma, outro repositório e outro banco; [[Banco-MES]]):

| Já existe (MES) | Reaproveitado como |
|---|---|
| `lotes` (`status_qualidade` = `StatusQualidadeLote`: `PENDENTE`, `LIBERADO`, `REPROVADO`, `QUARENTENA`; `id_lote_pai`, `laudo_url`, `motivo_reprovacao`, `evidencia_url`, `reprovado_*`, `liberado_*`, `quarentena_desde`, `corrida`, `norma`, `grau`, `certificado_url`) | O lote da entrada; o lote filho da reprovação parcial já é `id_lote_pai` |
| `rncs` (`id_lote` RESTRICT, `quantidade_reprovada`, `evidencia_url`, `nota_devolucao_pendente` padrão `true`) | Base da RNC. Falta: número, origem, status, causa, ação, parcial (saída). **Alterar, não recriar** |
| `itens_parciais` (`status`, `id_setor_atual`, `id_parcial_origem` = split, `retrabalho`, `id_lote_compra`, `id_lote_fabricado`) | A parcial da saída; a reprovação parcial reaproveita o split (`id_parcial_origem`) |
| `divergencias` (`tipo` `QUALIDADE`, `StatusDivergencia`) | Hoje a reprovação da saída abre Divergência para o PCP. Ver dúvida D4: a RNC passa a ser o registro oficial; a Divergência fica como aviso ao PCP |
| `lote_historico` (só inclusão, trigger `lote_historico_imutavel`) | Linha do tempo do lote; registrar aí cada decisão da Qualidade |
| `recebimentos_divergencias` | Fica como está (conferência do **recebimento**, não da inspeção) |

No Hub (`api-acos-vital`), reaproveitados:

| Já existe (Hub) | Uso |
|---|---|
| `core_comercial.sequencias_documento (tipo, ano, ultimo_numero)` + `fn_proxima_sequencia_documento` (SC-AAAA-NNNN) | **Modelo** da numeração de RNC e laudo (seção 5); `tipo` aceita 2 a 10 letras maiúsculas |
| `core_vendas_faturamento.pedidos_vendas`, `pedidos_vendas_liberacao` (`acompanhamento_qualidade`), `core_comercial.pedidos_venda` (`qualidade_acompanha`, `requisitos_qualidade`) | De onde o dossiê tira pedido, cliente, PO e requisitos do cliente |
| `core_fluxo` (Torre de Fluxo): rotas do Hub que **chamam o MES** por `MES_API_URL` e `MES_API_KEY` (`item_estado_projetado.route.js`) | **Precedente** para o Hub expor `/qualidade/lotes` e `/qualidade/saida/parciais` lendo o MES |
| Permissões: telas em `auth.telas`, `requirePermission(tela, pode_visualizar | pode_editar | pode_aprovar)`; mapa de rotas por tela (SQL-023 e SQL-024 mostram o padrão) | As 3 telas da Qualidade e as rotas novas |
| `lib/s3/client.ts` (av-hub): cliente S3 compatível (SeaweedFS, `forcePathStyle`), buckets `pessoas` e `empresa` | Modelo do armazenamento dos anexos (seção 6); falta o bucket da Qualidade |
| `core.documentos_anexos` | **Não serve**: sem tamanho, tipo, vínculo tipado nem hash |

## 3. Onde fica cada coisa (proposta de divisão)

Dois bancos, e a decisão pesa nos riscos. **Proposta:**

| Dado | Banco | Por quê |
|---|---|---|
| Conferência, RNC, tratativa, segregação, reprovação parcial | **MES** (migração Prisma em `api-pcp`) | Precisam de FK e de transação com `lotes`, `itens_parciais` e o saldo (RESTRICT, split, `lote_historico`). Em outro banco não há FK nem atomicidade |
| Dossiê, documentos, envios, comentários, arquivamento | **Hub** (schema novo `core_qualidade`) | Nascem do pedido de venda e do cliente (Hub), usam a permissão `documentacao-cliente` e não mexem em saldo |
| Anexos e laudo (metadados) | **Hub** (`core_qualidade.anexos`), arquivo no bucket S3 | Um só lugar para o MES e o Hub apontarem; o MES guarda só o `id` do anexo |
| Numeração de RNC e laudo | **MES** para a RNC (mesma transação da RNC); **Hub** para o laudo (`LD`) | A sequência tem de estar no mesmo banco, e na mesma transação, de quem grava o registro |

A API publica tudo sob `/qualidade/*` no Hub. As rotas de lote e parcial **chamam o MES** (como `/fluxo/torre`), com o token do usuário para a permissão e a chave de serviço para o MES. **[Decisão do Gustavo: D1]**

## Partes deste contrato

A numeração das seções é contínua entre as partes.

- [[SQL-025-Qualidade-v2-Banco-e-API-Detalhe-1]]: §4 Tabelas propostas, §5 Numeração sem buraco e §6 Armazenamento dos anexos.
- [[SQL-025-Qualidade-v2-Banco-e-API-Detalhe-2]]: §7 Rotas a publicar, §8 Migração, §9 Riscos, §10 Para o Gustavo revisar, §11 Decisões pendentes da Qualidade e §12 Critérios de aceite.

## Ver também

[[API-023-Qualidade-de-Entrada-e-Saida-no-Hub]] · [[Chamados-Qualidade-v2]] · [[Contratos-da-v2]] · [[Banco-MES]] · [[Banco-AvHub]]
