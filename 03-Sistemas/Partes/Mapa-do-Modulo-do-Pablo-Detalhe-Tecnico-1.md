---
tags: [pesquisa, comercial, suprimentos, api-comercial, proposta, orcamento, mapa, staging, parte]
criado: 2026-11-05
estado-em: 2026-11-13
status: proposta
dono: Pablo
parte-de: "[[Mapa-do-Modulo-do-Pablo]]"
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13]
fontes: [av-hub 5aa5311 (branch feat/menu-orcamento-vendas-compras) api-comercial/prisma/models e prisma/migrations, api-comercial/src/modules e src/domain, api-comercial/README.md, app/api/comercial/[...rota]/route.ts, app/(protected)/vendas orcamento compras, components/Propostas Suprimentos PainelComprador, lib/domain/fluxo-suprimentos.ts, docs/ENVIAR - contrato-comercial-suprimentos-telas.md, Dump Avhub (Esqueleto).sql, omie-elt-pipeline src/jobs/envioOrdensCompra.ts, 00-Briefing-Decisoes]
---

# Mapa do módulo do Pablo (Comercial e Suprimentos), como está hoje: detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[Mapa-do-Modulo-do-Pablo]] (parte 1 de 2): 1. Em uma página; 2. Camadas da requisição; 3. Banco: o que cada migration criou; 4. Regras de negócio no código.

**Onde estamos:** ← [[Mapa-do-Modulo-do-Pablo]] (resumo e índice) · partes: **Mapa-do-Modulo-do-Pablo-Detalhe-Tecnico-1** · [[Mapa-do-Modulo-do-Pablo-Detalhe-Tecnico-2]]

## 1. Em uma página

| Item | Valor | Selo |
|---|---|---|
| O que é | Backend Express 5, TypeScript, Prisma 7, PostgreSQL schema `core_comercial`, porta 3001 | ✅ `README.md:3-7`, `src/app.ts` |
| Tamanho | 30 models, 24 enums, 13 migrations, cerca de 91 handlers | ✅ `prisma/models/*.prisma`, `prisma/migrations/` |
| Situação | API só de teste, **fora do BFF desde 27/10 e só para leitura desde 28/10** (`LEIA-ME-LEGADO.md`); o Robert migra o que for útil para a `api-acos-vital` (as primeiras rotas `/comercial/*` já existem, 28 e 29/10; o Pablo acompanha, N16-117); o Gustavo revisa e cria no banco | 📝 N14-15, N16-15, N16-111, N16-117 |
| Banco publicado | Não existia `core_comercial` no dump de 14/10. **Existe no dump de 26/10 e no de 29/10**, com 23 tabelas (o legado tinha 30 models), criado pela migration `2026-10-15_052`; a N16-116 diz que ele não existirá, e o código de 28 e 29/10 ainda o usa | ✅ `Dump Avhub (Esqueleto).sql` de 14/10 (sem `CREATE SCHEMA core_comercial`); `Dump do Avhub para referência (29.10).sql` (com ele) |
| Permissão | 100% do RBAC do hub: telas × ações e escopo de vendedores viram "capacidades" | ✅ `src/domain/permissoes/capacidades.ts:8-19,64-84` |
| Front | Telas em `app/(protected)/vendas`, `orcamento` e `compras/historico-compras`; BFF em `app/api/comercial/[...rota]/route.ts` | ✅ |
| Cadastro das telas | Feito pelo Nathan na api-test em 16/10; em produção o Gustavo roda o SQL | 📝 N16-14, `telas-vendas-orcamento-compras.sql` (anexo do contrato do menu, removido em 29/10/2026) |

> [!info] O que não migra (27/10/2026)
> O módulo é só ambiente de teste e **não tem dado** (Nathan, N16-109). Para a migração, a lista do que **não portar** (sincronização própria do Omie e suas 7 tabelas de cópia, Histórico de compras, planilha do pedido no Omie, migração do ERP antigo, fechamento parcial, autenticação própria) e do que **reaproveitar** (motor na API, ofertas, fornecedores, parâmetros, pedido de custo, notificações) está em §5. O menu das telas descritas aqui também foi enxugado nesse contrato.

## 2. Camadas da requisição

`helmet`, `pino-http`, `express.json` (8 MB), CORS, tudo em `/v1`: rate limit por IP, `apiKey` (chave do BFF), `autenticacao` (JWT do hub), rate limit por usuário ✅ `src/app.ts:41-57,94-96`. Os routers entram na ordem de `src/app.ts:97-115`: cadastros, produtos pendentes, simulador, `/propostas`, suprimentos, histórico de compras, custos, dashboards, omie, pesquisa de materiais, clientes, relatórios, e-mail e PDF de proposta, pedido de cotação, notificações e painel do comprador.

Convenções ✅ `README.md:37-44`: envelope de erro `{ detail, codigo?, campos? }`; paginação `{ data, total, page, limit, total_pages }`; dinheiro como `Decimal` em string; `PUT`, `DELETE`, `/fechar`, `/perder`, `/reabrir` exigem `If-Match` (428 sem, 409 desatualizado); `POST /propostas` e `POST /solicitacoes_custo` aceitam `Idempotency-Key`.

## 3. Banco: o que cada migration criou

As 13 migrations em `prisma/migrations/` (ordem de pasta):

| # | Migration | O que faz | Linha |
|---|---|---|---|
| 1 | `20261001000000_mvp_inicial` | Cria o schema `core_comercial`, 24 enums e 22 tabelas: `empresas_emissoras`, `sequencias_proposta`, `sequencias_documento`, `perfis_comerciais`, `notificacoes`, `categorias_suprimento`, `produtos`, `fornecedores`, `fornecedores_categorias`, `certificados`, `ofertas`, `parametros_custo`, `tabelas_custo_telha`, `solicitacoes_custo`, `sincronizacoes_omie`, `clientes`, `clientes_contatos`, `propostas`, `propostas_itens`, `propostas_eventos`, `propostas_versoes`, `auditoria` | ✅ `migration.sql:2,74-494` |
| 2 | `20261002114920_oferta_quantidade` | `ofertas.quantidade` (pondera a média de preço realizado) | ✅ `migration.sql:2` |
| 3 | `20261005111706_solicitacao_resposta_comprador` | `solicitacoes_custo.resposta_comprador` | ✅ `migration.sql:2` |
| 4 | `20261005112201_chaves_idempotencia` | Tabela `chaves_idempotencia` (24 h) | ✅ `migration.sql:2-16` |
| 5 | `20261005120000_omie_chaves_ordens_compra` | `pg_trgm`; `produtos_contas_omie`, `fornecedores_contas_omie`, `ordens_compra`, `itens_ordem_compra`, `omie_registros_brutos`; índices GIN de busca | ✅ `migration.sql:9,15-70,103-106` |
| 6 | `20261005142936_clientes_relacionamento` | `status`, `segmento`, `potencial`, `proximo_contato`, `observacoes`, `versao` em `clientes`; `cargo` em contatos | ✅ `migration.sql:2-22` |
| 7 | `20261006113409_apelidos_fornecedor` | `apelidos_fornecedor` | ✅ `migration.sql:2-20` |
| 8 | `20261006114520_solicitacoes_atribuir_cancelar` | `atribuida_em`, `cancelada_em`, `id_cancelada_por`, `motivo_cancelamento` | ✅ `migration.sql:2-8` |
| 9 | `20261006120642_travas_tarefa` | `travas_tarefa` (uma sincronização do Omie por vez) | ✅ `migration.sql:2-8` |
| 10 | `20261007160000_evento_email_enviado` | Evento `EMAIL_ENVIADO` | ✅ `migration.sql:2` |
| 11 | `20261013120000_numero_proposta_so_digitos` | Tira `numero_completo` e `numero` de versão: o `CO-AV2026-0012-R03` passa a ser montado só na saída | ✅ `migration.sql:5-38` |
| 12 | `20261013130000_pedido_omie_proposta` | `acompanhamento_qualidade` e `numero_pedido_omie` na proposta; evento `PEDIDO_OMIE_ATUALIZADO` | ✅ `migration.sql:2-7` |
| 13 | `20261013140000_usuarios_comerciais_diretorio` | `perfis_comerciais` vira diretório de usuários; sai cargo, empresas e unidades; entra `responsavel_proposta` | ✅ `migration.sql:8-22` |

### 3.1 As 30 tabelas por arquivo do Prisma

| Arquivo | Models (tabela física) | Linhas |
|---|---|---|
| `prisma/models/vendas.prisma` | `Cliente` (`clientes`), `ClienteContato` (`clientes_contatos`), `Proposta` (`propostas`), `PropostaItem` (`propostas_itens`), `PropostaEvento` (`propostas_eventos`), `PropostaVersao` (`propostas_versoes`), `Auditoria` (`auditoria`) | ✅ `:3-212` |
| `prisma/models/empresas.prisma` | `EmpresaEmissora` (`empresas_emissoras`), `SequenciaProposta` (`sequencias_proposta`), `SequenciaDocumento` (`sequencias_documento`), `UsuarioComercial` (`perfis_comerciais`) | ✅ `:2-78` |
| `prisma/models/suprimentos.prisma` | `CategoriaSuprimento`, `Produto`, `Fornecedor`, `ApelidoFornecedor`, `FornecedorCategoria`, `Certificado`, `Oferta`, `ParametroCusto`, `TabelaCustoTelha`, `SolicitacaoCusto`, `SincronizacaoOmie` | ✅ `:4-260` |
| `prisma/models/omie.prisma` | `ProdutoContaOmie`, `FornecedorContaOmie`, `OrdemCompra`, `ItemOrdemCompra`, `OmieRegistroBruto` | ✅ `:8-97` |
| `prisma/models/infra.prisma` | `Notificacao`, `ChaveIdempotencia`, `TravaTarefa` | ✅ `:2-45` |

### 3.2 Enums (24) em `prisma/models/enums.prisma`

| Enum | Valores | Linha |
|---|---|---|
| `CodigoEmpresa` | `AV`, `AU`, `HRM` | `:1-7` |
| `Unidade` | `MOGI`, `UBERABA`, `ARUJA` | `:9-15` |
| `ContaOmie` | `MOGI`, `UBERABA` | `:17-23` |
| `TipoPessoa` | `PJ`, `PF` | `:24-29` |
| `TipoVenda` | `NACIONAL`, `EXPORTACAO` | `:31-36` |
| `Moeda` | `BRL`, `USD`, `EUR` | `:38-44` |
| `Incoterm` | `EXW`, `FCA`, `CPT`, `CIP`, `DAP`, `DPU`, `DDP`, `FOB`, `CFR`, `CIF` | `:46-59` |
| `Finalidade` | `INDUSTRIALIZACAO`, `REVENDA`, `CONSUMO_FINAL` | `:61-67` |
| `StatusProposta` | `ABERTA`, `PARCIAL`, `FECHADA`, `PERDIDA` | `:69-76` |
| `UnidadeMedida` | `PC`, `KG`, `M`, `TN`, `CJ`, `M2`, `UN` | `:78-88` |
| `MotivoPerda` | `PRECO_ALTO`, `PRAZO`, `COMPROU_CONCORRENTE`, `PROJETO_CANCELADO`, `SEM_RETORNO`, `CONDICAO_PAGAMENTO`, `FRETE`, `OUTRO` | `:90-101` |
| `RequisitoQualidade` | `CRC_PETROBRAS`, `ISO_9001` | `:103-108` |
| `OrigemCusto` | `VIGENTE`, `HISTORICO`, `MANUAL`, `SEM_CUSTO` | `:110-117` |
| `TipoEventoProposta` | `CRIADA`, `REVISADA`, `PERDIDA`, `REABERTA`, `FECHAMENTO_PARCIAL`, `FECHAMENTO_TOTAL`, `DUPLICADA`, `COPIADA`, `PDF_GERADO`, `EMAIL_ENVIADO`, `EXCLUIDA`, `CUSTO_ALTERADO`, `MIGRADA`, `PEDIDO_OMIE_ATUALIZADO` | `:119-136` |
| `StatusFornecedorCategoria` | `ATIVO`, `SUSPENSO` | `:138-143` |
| `TipoCertificado` | `ISO_9001`, `CRC_PETROBRAS` | `:145-150` |
| `OrigemIcmsCompra` | `SP`, `SP_REDUZIDA`, `OUTRA_UF`, `IMPORTACAO_SP`, `IMPORTACAO_OUTRA_UF`, `SIMPLES` | `:152-161` |
| `TipoFrete` | `CIF`, `FOB` | `:163-168` |
| `FonteOferta` | `MANUAL`, `MAPA_COTACAO`, `PEDIDO_OMIE`, `MIGRACAO` | `:170-177` |
| `StatusOferta` | `VIGENTE`, `VENCIDA`, `INVALIDADA`, `HISTORICA` | `:179-186` |
| `StatusSolicitacao` | `ABERTA`, `RESPONDIDA`, `SEM_FORNECEDOR`, `CANCELADA` | `:188-195` |
| `StatusRelacionamento` | `ATIVO`, `PROSPECCAO`, `MORNO`, `QUENTE`, `INATIVO` | `:198-206` |
| `SegmentoCliente` | `INDUSTRIA`, `MINERACAO`, `ENGENHARIA`, `CONSTRUTORA`, `MANUTENCAO`, `REVENDA`, `USINA`, `OUTRO` | `:208-219` |
| `PotencialCliente` | `BAIXO`, `MEDIO`, `ALTO`, `ESTRATEGICO` | `:221-228` |

## 4. Regras de negócio no código

### 4.1 Numeração: `CO-AV2026-0012-R03`

- Formato `CO-{AV|AU|HRM}{AAAA}-{NNNN}-R{RR}`, 4 dígitos que viram 5 depois de 9999; o banco guarda só empresa, ano, sequencial e revisão e o texto é montado na saída ✅ `src/domain/numeracao/numeroProposta.ts:1-12`, migration 11.
- Sequência por empresa e ano, atômica por `INSERT … ON CONFLICT DO UPDATE … RETURNING` ✅ `src/modules/propostas/propostas.service.ts:313-322`, `prisma/models/empresas.prisma:32-42`. A proposta é única por `(id_empresa, ano, sequencial)` ✅ `vendas.prisma:103`.
- A proposta técnica usa o mesmo número com prefixo `PT-` ✅ `numeroProposta.ts:22-25`. O antigo prefixo `PC-` ainda é lido na busca e nos eventos ✅ `numeroProposta.ts:35-36`, `propostas.service.ts:754-772`.
- A solicitação de custo usa `SC-AAAA-NNNN` por ano, em `sequencias_documento` ✅ `numeroProposta.ts:61-63`, `src/modules/custos/custos.routes.ts:381-385`.
- A `api-acos-vital` já numera a OC e a requisição por unidade com `contadores_documento (codigo_empresa, tipo)` e prefixo `OC-000001` ✅ `Dump Avhub (Esqueleto).sql:16555-16561,8110-8135`. É o padrão que N16-04 manda seguir.

### 4.2 Cálculo da proposta (função pura, `decimal.js`)

| Regra | Onde |
|---|---|
| Preço automático: `(custo × kg/m × metragem + pintura) × (1 + margem%)`; sem custo e margem vale o preço digitado; pintura soma ao preço base manual | ✅ `src/domain/calculo/linhaItem.ts:20-37` |
| Por linha: subtotal bruto, preço líquido de desconto, base, valor de desconto, ICMS, IPI e ST sobre a base | ✅ `linhaItem.ts:64-88` |
| Total = Σ(base + IPI + ST) + frete; frete só com Incoterm CIF | ✅ `src/domain/calculo/totais.ts:18-30` |
| Exportação ou isento zera ICMS, IPI e ST | ✅ `src/modules/propostas/propostas.calculo.ts:187-207` |
| Margem real = (base − custo total) ÷ base | ✅ `src/domain/custo/custo.ts:119-125`, `propostas.calculo.ts:221-236` |
| Fechamento total ou parcial proporcional à base de cada item | ✅ `src/domain/calculo/fechamento.ts:13-39` |
| ICMS do item só 0, 4, 7, 12 ou 18; PJ exige comprador; exportação exige cotação | ✅ `src/modules/propostas/propostas.schemas.ts:18,30,86-98` |
| A revisão sobe quando a assinatura do conteúdo comercial muda (preço, impressos, fatores da fórmula; o snapshot de custo não entra) | ✅ `propostas.calculo.ts:278-335`, `propostas.service.ts:483-486` |

### 4.3 Custo de referência, ofertas e médias

- Custo líquido = `preço × (1 + IPI) + ST − ICMS a recuperar`; com ST não há crédito ✅ `custo.ts:33-42`. Tabela padrão de ICMS a recuperar por origem em `custo.ts:13-20`, sobrescrita por `parametros_custo` ✅ `prisma/seed.ts:75`.
- Seleção do custo: vigentes elegíveis primeiro (menor custo); sem vigente, o realizado mais recente dentro de `diasHistorico` (90) ✅ `custo.ts:79-117`. Elegível = fornecedor ativo, vinculado à categoria, não suspenso, com certificado exigido e sem "verificar escala" ✅ `src/modules/custos/custos.routes.ts:57-64`.
- Oferta é imutável: corrigir é invalidar com motivo e lançar outra ✅ `suprimentos.prisma:138-139`, `suprimentos.routes.ts:791-806`. Trava de escala: preço fora de 1/3 a 3 vezes a mediana pede confirmação ✅ `suprimentos.routes.ts:697-712`.
- Médias e estatísticas: média ponderada pela quantidade quando todos os registros têm quantidade, senão simples; mínimo, máximo, último; janela de 90 dias; aviso "acima da média" a partir de 15% ✅ `src/domain/custo/medias.ts:161-211`, `custos.routes.ts:84-125`. Rota `GET /produtos/:id/precos` (por produto e por fornecedor) ✅ `suprimentos.routes.ts:823-874`.
- Preço realizado vem do pedido de compra do Omie: cada item vira oferta `PEDIDO_OMIE`; OC cancelada invalida a oferta ✅ `src/modules/omie/sincronizacao.ts:265-380`.
- Análise para o pedido de cotação (última compra, média e mínimo por unidade, por fornecedor) ✅ `src/domain/custo/analiseCompras.ts:242-277`.

### 4.4 Telha TR40

Configurador por classe, espessura, núcleo (EPS ou PIR) e pintura; o custo base já embute EPS 30 mm e troca pelo núcleo escolhido; largura útil de bobina 1,2 m e aço 7,85 ✅ `src/domain/telha/configurador.ts:60-120`. A tabela de custo tem vigência: salvar abre vigência nova a partir de hoje e fecha a anterior; no mesmo dia corrige a do dia ✅ `custos.routes.ts:213-239`. O dado fica em `tabelas_custo_telha` com `base`, `nucleos` e `pinturas` em JSON ✅ `suprimentos.prisma:200-213`.

### 4.5 Fechamento e pedido no Omie (o que N16 troca)

- O vendedor fecha a proposta inteira ou por itens; o fechamento parcial marca itens e calcula `valor_fechado` e `valor_aberto` ✅ `propostas.service.ts:609-647`, `fechamento.ts`. A proposta só é editada com status `ABERTA` ✅ `propostas.service.ts:474-476`.
- Perder (motivo obrigatório, texto de 3 letras ou mais) e reabrir (limpa as marcas de itens fechados) ✅ `propostas.service.ts:555-607`.
- **O av-hub não cria o pedido no Omie.** A API monta um resumo "a digitar no Omie" (campo a campo, com código do produto da conta de Mogi ou de Uberaba) e uma planilha; o vendedor digita no Omie e registra de volta o número do pedido e se a Qualidade acompanha ✅ `src/modules/propostas/pedidoOmie.ts:7-12`, `propostas.service.ts:649-724`, `propostas.routes.ts:144-164`. Depois o pedido volta pela pipeline e é liberado no hub (V3) ✅ `pedidoOmie.ts:7-12`.

### 4.6 Escopo, perfis e telas de permissão

- Escopo por usuário dono (`id_responsavel`): `PROPRIAS`, `COMPARTILHADA` (que não restringe nada) e `TODAS` ✅ `propostas.service.ts:23-34`.
- Slugs que decidem capacidade ✅ `src/domain/permissoes/capacidades.ts:47-56`: `propostas`, `propostas-delegacao`, `propostas-valores`, `custo-item`, `relatorio-gerencial`, `painel-comprador`, `clientes`, `simulador`. Capacidades: `veValores`, `veCusto`, `comprador`, `podeDelegar`, `editaTerceiros`, `exclui`, `escopo`, `escopoClientes`, `relatorioGerencial`, `simulador`.
- Perfis de teste (bypass de desenvolvimento): `Comercial - Vendedor`, `Auxiliar`, `Gestão`, `Diretoria`, `Suprimentos - Comprador`, `Pós-venda`, `Comissões - Simulador` ✅ `perfisDev.ts:12-77`. São fixtures do bypass; não migram.
- Telas cadastradas em 16/10 (nome, slug, pai, ordem relativa) ✅ `telas-vendas-orcamento-compras.sql`, linhas 51 a 70 (anexo removido em 29/10/2026; fica só este registro):

| Grupo | Slugs |
|---|---|
| `vendas` | `propostas` (20), `clientes` (21), `relatorio-cotacoes` (22), `relatorio-gerencial` (23); ocultas: `propostas-delegacao` (90), `propostas-valores` (91), `solicitacoes-custo` (92) |
| `orcamento` | `painel-comprador` (1), `pedido-cotacao` (2), `ofertas-fornecedor` (3), `fornecedores` (4), `catalogo-produtos` (5), `pesquisa-materiais` (6), `parametros-custo` (7), `tabela-telha` (8); oculta: `custo-item` (90) |
| `compras` | `historico-compras` (30) |
| fora do menu | `sincronizacao-omie` sai (passo 4 do SQL); as 5 telas antigas do Orçamento (`categorias`, `fornecedores`, `historico-produtos`, `sem-cadastro`, `vinculos`) saem (passo 2) |

- O BFF ainda cita o slug `matriz-precos` (`app/api/comercial/[...rota]/route.ts:125,104`), que o SQL de 16/10 não cadastra; o contrato de telas diz "tela ainda não construída" ✅ `docs/ENVIAR - contrato-comercial-suprimentos-telas.md:75`. O slug `simulador` (Simulador de Comissões) também é consultado ✅ `capacidades.ts:55`.
