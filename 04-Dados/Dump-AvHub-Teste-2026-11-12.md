---
tags: [dados, banco, dump, av-hub, teste]
criado: 2026-11-12
estado-em: 2026-11-12
status: vigente
dono: Gustavo (DBA)
fontes: ["Dump avhub teste 12.11.sql, gerado em 12/11/2026 15:01 e enviado pelo Nathan em 12/11/2026", "Dump-AvHub-Teste-2026-11-10 (comparação)", "api-acos-vital bebca52 e av-hub 16891f9 (origin/develop de 12/11/2026, só para conferir se o código acompanha)"]
---

# Dump do banco de teste do av-hub (12/11/2026)

**Em uma frase:** é o retrato mais novo do esquema do banco do av-hub, tirado do ambiente de **teste** em 12/11/2026. Ele mostra a empresa emissora virando a própria unidade, o índice único do LOG-56, o banco do LOG-57 (compra acima do cotado), do LOG-58 (avisos do MES ao Compras) e do API-019, e a carteira de clientes na proposta.

**Quando consultar:** quando uma nota citar o banco do av-hub e você precisar saber se o que ela diz ainda vale. A nota geral do banco é o [[Banco-AvHub]]. O dump anterior é o [[Dump-AvHub-Teste-2026-11-10]].

## Ficha do arquivo

- **Arquivo:** `04-Dados/Dumps/avhub-tst-esqueleto-2026-11-12.sql`, cópia sem mudança do arquivo enviado pelo Nathan em 12/11/2026 (`Dump avhub teste 12.11.sql`).
- **Ambiente:** teste (`tst`). Gerado em 12/11/2026 às 15:01, PostgreSQL 18.6 (pg_dump 18.3), dump do cluster (papéis e esquema).
- **Só esquema:** nenhum `COPY` de dados, e os papéis não trazem senha. O único `INSERT` do arquivo é texto de um comentário. Não há dado de cliente, de pedido nem de usuário.
- **Lugar na precedência:** fonte 2 (dumps), depois do código na `develop` (F5). Ele mostra o que está **aplicado no banco de teste** e é a referência do esquema: as migrations ficam com o DBA, fora do repositório (N16-155).

## O que mudou desde o dump de 10/11

| | 10/11 (teste) | 12/11 (teste) |
|---|---|---|
| Schemas | 15 | 15 |
| Tabelas | 148 | 151 |
| Views | 51 | 55 |
| Funções | 259 | 283 |
| Triggers | 195 | 204 |
| Índices | 315 | 324 |
| `core_comercial`: tabelas e funções | 14 e 48 | 16 e 64 |

### A empresa emissora virou a própria unidade (pedido do Robert, 10/11)

- **Saiu** a tabela `core_comercial.unidades_emissoras`, com a view `vw_unidades_emissoras`, o trigger `trg_unidades_emissoras_updated_at` e as FKs que apontavam para ela (`fk_propostas_emissora`, `fk_pedidos_venda_emissora`, `fk_sequencias_proposta_emissora`).
- **Saiu** a coluna `id_unidade_emissora` de `propostas` (`:4283`) e de `pedidos_venda` (`:18157`). Em `sequencias_proposta` (`:18722`) ela virou `codigo_empresa`, com a FK `fk_sequencias_proposta_unidade`; `fn_proxima_sequencia_proposta(p_codigo_empresa, p_ano)` (`:5352`) mudou junto. O índice `idx_propostas_emissora_status` virou `idx_propostas_empresa_status`.
- **Entrou** em `core.unidades` (`:17474`): `sigla` (coluna gerada por `core.fn_sigla_unidade` a partir do nome fantasia, `:17508` e `:1857`, única por `uq_core_unidades_sigla`), e o cabeçalho dos documentos: `nome_documento`, `telefone_documento`, `email_documento`, `site_documento` e `logo_url`.
- **Entrou** a view `core.vw_unidades_cabecalho` (`:17658`): o cabeçalho do PDF da proposta, lido pelo `GET /comercial/empresas_emissoras`.
- **O código acompanha:** na `origin/develop` da `api-acos-vital` (`bebca52`) a rota lê `vw_unidades_cabecalho` e não usa mais `unidades_emissoras`. No `av-hub` (`16891f9`) só sobraram comentários que citam a tabela antiga (veja [[Diferencas-Codigo-x-Banco]]).

### LOG-56: o índice único foi aplicado

- `uq_pedidos_venda_omie` (`:32197`), único em `(codigo_empresa_omie, codigo_pedido_omie)`, substitui o `ix_pedidos_venda_omie` (parcial e não único), que saiu. Era o que faltava no banco de teste em 10/11 (§7.6).
- `fn_proposta_transformar` (`:4962`), `fn_proposta_criar`, `fn_proposta_revisar`, `fn_proposta_copiar`, `fn_proposta_analise_gravar`, `fn_proposta_itens_produtos_conferir` e `fn_responsaveis_proposta` (`:5376`) mudaram por dentro: deixaram de usar a emissora e passaram a usar a unidade.

### LOG-57: compra acima do cotado

- Tabelas `core_comercial.divergencias_compra` (`:17909`) e `divergencias_compra_eventos` (`:18039`, o histórico de cada estado, gravado por `trg_divergencias_compra_eventos`). Uma divergência por item da OC e item do pedido (`uq_divergencias_compra_item_pv`).
- Nasce na emissão da OC por `fn_divergencias_compra_gerar` (`:2748`): compra **acima** do cotado fica `PENDENTE` (o vendedor decide em Meus Pedidos e a OC espera); **abaixo** fica `INFORMATIVA`. A decisão é `fn_divergencia_compra_decidir` (`:2541`) e a OC volta a andar com `fn_oc_liberar_apos_divergencia` (`:3139`).
- View `vw_divergencias_compra` (`:19278`) para as listas `GET /compras/divergencias` e `/meus-pedidos/divergencias`. Coluna nova `ordens_compra_itens.motivo_divergencia` (`:19223`, até 1000 caracteres).
- `fn_ordens_compra_status` (`:11773`) e `fn_ordens_compra_recalcular` mudaram por dentro, e o trigger `trg_ordens_compra_divergencias_cancelar` cancela as divergências quando a OC é cancelada.

### LOG-58: avisos do MES ao Compras

- Tabela `core_vendas_faturamento.avisos_mes_compra` (`:23757`): `RECOMPRA_RNC` (a Qualidade reprovou parte ou todo um lote comprado) e `RECEBIMENTO_REABERTO` (o PCP reabriu um recebimento). O aviso não muda a OC; fica aberto até o Compras emitir a OC de recompra ou descartar.
- Entrada pelo MES em `fn_aviso_mes_compra_registrar` (`:7295`, idempotente por `id_aviso_mes`), tratamento em `fn_aviso_mes_compra_tratar` (`:7371`). A OC de recompra guarda o aviso em `ordens_compra.id_aviso_mes` (`:18986`, única por `uq_ordens_compra_id_aviso_mes`), com os triggers `trg_ordens_compra_aviso_mes`, `_fixo` e `_resolver`.
- View `vw_avisos_mes_compra` (`:26232`) para `GET /compras/avisos-mes`.

### API-019: a compra da proposta na OC

- View `core_comercial.vw_pedido_venda_compra_proposta` (`:19381`): uma linha por item do pedido do Hub já com número no Omie, com o frete da compra e se o item tem cotação.
- Índice `ix_pedidos_venda_numero_omie_sem_zeros` (`:32100`) para casar o PV do Omie com o pedido do Hub pelo número sem zeros à esquerda.

### Carteira de clientes e responsável da proposta (pedidos do Robert, 11/11)

- **Carteira:** tabela `core_comercial.parametros_carteira_clientes` (`:18064`, uma linha só, com por quantos dias a proposta mais recente reserva um cliente sem dono), `core_vendas_faturamento.fn_carteira_clientes` (`:7470`, o dono de cada cliente por unidade) e a view `vw_carteira_clientes` (`:26287`); `core_comercial.fn_cliente_carteira` (`:2302`) e `fn_carteira_vendedores` respondem se o cliente é livre ou de quem é.
- **Cadastro de cliente:** `fn_cliente_cadastro_conferir` (`:2261`) confere, antes de o `POST /comercial/clientes` chamar o Omie, se o CPF/CNPJ já está na carteira de outro vendedor.
- **Responsável da proposta:** `fn_emissao_opcoes` (`:2962`, para o `GET /comercial/emissao`), `fn_emissao_responsavel_situacao` (`:3004`), `fn_emissao_vinculo` e `fn_usuario_pode_criar` (tela `propostas-delegacao`). O trigger `trg_propostas_conferir_emissao` (`:34514`, função `:5210`) barra a proposta quando o responsável ou o cliente não podem ser usados por quem grava.

### Encargo da condição de pagamento

- `propostas.encargo_pagamento` (`:4347`) e `core_comissionamento.simulacoes.encargo_pagamento` (`:20116`), em ponto percentual (0 a 100). A simulação ganhou também `codigo_condicao_pagamento`. Simulação gravada antes de 12/11 fica com o encargo nulo.

### Não mudou

- O `obs_venda` continua indo ao Omie com as observações da proposta (`:3701`).
- A regra do refaturamento não mudou: `fn_resolver_refaturamento` (`:14507`) e `fn_resolver_refaturamento_lote` (`:14761`) estão iguais às de 10/11, com o código fixo `1.01.96` (RS-022). O banco de teste continua sem a extensão `pg_cron` (o nome só aparece no comentário da função).
- A conta corrente do pedido (LOG-56, R11) está igual à de 10/11 (`parametros_pedido_venda_omie`, `:18123`).

## O que isso muda no vault

- [[Banco-AvHub]]: o aviso do dump mais novo passa a ser este, e `core_comercial` deixa de ter `unidades_emissoras`.
- LOG-56: o índice único (§7.6) está aplicado no teste. A emissora citada no contrato agora é a unidade.
- LOG-57, LOG-58 e API-019: o banco está aplicado no teste.
- As notas que descreviam `unidades_emissoras` passam a apontar para `core.unidades` e `vw_unidades_cabecalho`.
