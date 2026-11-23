---
id: SQL-022
titulo: A referência da OC para o MES diz de qual aviso do MES a OC é a recompra
status: implementado-na-develop
autor: Nathan
data: 2026-11-13
camadas: [frontend, backend, api, sql]
donos: {frontend: Nathan, backend: Nathan, api: Nathan, sql: Gustavo}
nos_0b: [E1, C0]
notas_afetadas: [05-Estoque-Atendimento, Backlog-Frente-Robert, LOG-58-Avisos-do-MES-ao-Compras, Integracao-AvHub-MES]
depende_de: [BL-050, LOG-58]
decisoes: [N14-20]
develop-conferida: [api-acos-vital 9abda4f, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13]
tags: [contrato, banco, view, mes, estoque, saldo-futuro, recompra]
criado: 2026-11-13
estado-em: 2026-11-13
dono: Nathan
fontes: [Backlog-Frente-Robert BL-050, LOG-58-Avisos-do-MES-ao-Compras, Dump-AvHub-Teste-2026-11-12, api-acos-vital develop 9abda4f (PR #310), api-pcp develop bd6b442 (PR #81), app-pcp develop 897dcd7 (PR #66), teste no Docker local de 12/11/2026 (docker-teste, fora do vault), "Mensagem de Gustavo de 13/11/2026 (SQL-022 aplicada no tst)", "Relatório de entrega de Gustavo de 13/11/2026 (LOG-57, LOG-58 e SQL-022: respostas e log58b)", Dump-AvHub-Teste-2026-11-13]
---

# SQL-022 · A referência da OC para o MES diz de qual aviso do MES a OC é a recompra

## 1. Resumo em linguagem simples

O Estoque do MES já mostra o que ainda vai chegar por OC de estoque (o "saldo futuro", BL-050). Para não contar duas vezes a peça reprovada que o Compras já recomprou, falta uma coluna numa view do banco do av-hub. O código dos três sistemas está pronto na `develop`, e a view está no tst desde 13/11 (Gustavo); falta só a produção.

## 2. Contexto: o que deve ser feito e por quê

- **O problema:** pela regra do Recebimento, a peça reprovada na inspeção volta ao fornecedor e a OC original continua esperando por ela (`api-pcp` `src/compras/compra-oc.ts:199` (`volta ao fornecedor e continua esperado`)). Quando o Compras resolve o aviso do [[LOG-58-Avisos-do-MES-ao-Compras|LOG-58]] com uma OC de recompra, a mesma quantidade aparece nas duas OCs.
- **Exemplo real (Docker, 12/11):** a OC-000013 recebeu 5 PÇ e teve 2 reprovadas, e a OC-000014 é a recompra dessas 2. O saldo futuro do produto 10222656014 mostrava 4 PÇ a chegar; o certo é 2.
- **Quem sofre:** o Estoque e o CCP, que olham o saldo futuro antes de pedir compra.
- **Por que o MES não resolve sozinho:** só o av-hub sabe que uma OC é recompra de um aviso, pelo `ordens_compra.id_aviso_mes`. Esse campo guarda o id do aviso **no av-hub**, não o do MES (escolha da entrega do LOG-58, seção 15). A referência da OC que o MES lê não traz essa ligação.
- **Decisão:** a reprovada com recompra sai do saldo futuro (Nathan, 12/11).
- **Se não for feito:** o saldo futuro conta em dobro toda reprovada recomprada. Nada quebra, porque o MES e a API ignoram o campo enquanto ele não existir.

## 3. Onde fica no fluxo

`E1` (saldo disponível, com o saldo futuro) em [[05-Estoque-Atendimento]]; `C0` (o MES lê as OCs do hub) em [[06-Circuito-de-Compra]]. Integração: [[Integracao-AvHub-MES]].

## 4. Como está hoje

- ✅ **MES, backend** (`api-pcp`, `bd6b442`):
  - saldo futuro: `src/estoque/operacao/saldo-futuro.ts:68` (`export async function saldoFuturoPorProduto`);
  - desconto da reprovada com recompra: `src/estoque/operacao/saldo-futuro.ts:38` (`async function reprovadoComRecompra`);
  - rota: `src/estoque/operacao/estoque-operacao.controller.ts:48` (`@Get('saldo/futuro')`);
  - coluna `oc_referencia.id_aviso_mes_origem`: `prisma/models/integracao.prisma:159` (`idAvisoMesOrigem String?`), criada pela migration `20261113120000_bl050_oc_aviso_recompra`.
- ✅ **MES, front** (`app-pcp`, `897dcd7`):
  - bloco no modal: `app/(protected)/movimentacoes/components/AtenderEstoqueModal.tsx:452` (`A chegar por OC de estoque:`);
  - coluna "A chegar" na tela Estoque (o card da tela Saldo saiu na reorganização de 19/11, N16-184): `app/(protected)/estoque-operacao/saldo/TabelaMateriais.tsx:33` (`A chegar`).
- ✅ **API do av-hub** (`api-acos-vital`, `9abda4f`): a rota lê a coluna nova em `src/schemas/core_vendas_faturamento/views/vw_ordens_compra_referencia_mes/vw_ordens_compra_referencia_mes.route.js:71` (`v.id_aviso_mes_origem`). Sem a coluna no banco, lê o conjunto anterior (`:89`, `migration: "bl050"`).
- ✅ **Banco do av-hub:** aplicada no tst em 13/11 pelo Gustavo (migration `2026-11-13_sql022_aviso_recompra_referencia_oc.sql`, com o DBA, N16-155): a view tem `id_aviso_mes_origem` no fim ([[Dump-AvHub-Teste-2026-11-13]], `avhub-tst-esqueleto-2026-11-13.sql:27920`, `av.id_aviso_mes AS id_aviso_mes_origem`). No tst as 9 OCs da referência vêm com o campo nulo, porque lá ainda não há recompra emitida a partir de aviso. Produção pendente, depois da log58.

## 5. Regras de negócio

- **R1.** O saldo futuro conta só OC aprovada com finalidade `estoque`: o pedido menos o recebido, sem o coberto por requisição (N14-20, BL-050).
- **R2.** A peça reprovada continua esperada na OC original, como no Recebimento.
- **R3.** Exceção à R2 (Nathan, 12/11): se o aviso `RECOMPRA_RNC` do item tem OC de recompra **aprovada**, a quantidade do aviso sai da OC original. Quem a traz é a recompra, que entra no saldo futuro pela R1.
- **R4.** Se a OC de recompra for cancelada, a quantidade volta a contar na OC original.

## 6. Frontend

**Não se aplica:** o front não muda; as telas do BL-050 já estão na `develop` (seção 4) e mostram o número que o backend devolve.

## 7. Backend

**Não se aplica:** já está na `develop` do `api-pcp` (seção 4). O job da OC (`OcReferenciaAvhubService`) grava `id_aviso_mes_origem` quando o campo vem; sem o campo, não mexe no que já está gravado.

## 8. API

**Não se aplica:** já está na `develop` da `api-acos-vital` (seção 4). A rota `GET /ordens-compra/referencia` (contrato 004) ganhou o campo `id_aviso_mes_origem` (uuid ou `null`), já documentado no Swagger.

## 9. Banco (SQL)

- **Banco e schema:** av-hub, `core_vendas_faturamento`.
- **View alterada:** `vw_ordens_compra_referencia_mes` ganha, no fim, a coluna `id_aviso_mes_origem uuid`. Na OC emitida com `ordens_compra.id_aviso_mes`, ela traz o `avisos_mes_compra.id_aviso_mes` (o id que o MES gerou); nas outras OCs, vem `null`. O valor sai de um `LEFT JOIN` em `avisos_mes_compra`.
- **Up:** o SQL abaixo. Ele só acrescenta uma coluna no fim, e o `CREATE OR REPLACE VIEW` mantém as permissões. Foi testado no banco local do Docker, carregado com o dump de 12/11.
- **Down:** o mesmo `CREATE OR REPLACE VIEW`, sem a última coluna e sem o `LEFT JOIN` (a definição do dump de 12/11).
- **Quem aplica:** Gustavo (DBA), primeiro no tst e depois na produção.
- **Dados existentes:**
  - a mudança da view sozinha não altera o `alterado_em`, então as recompras já emitidas só chegariam ao MES quando a OC mudasse;
  - **como o Gustavo aplicou (13/11):** na 1ª execução, a migration marca de novo em `ordens_compra_referencia_mes` só as OCs que já têm `id_aviso_mes`, e o MES as relê; o cursor do MES não é mexido (o SQL abaixo é o do contrato e não faz essa marcação; a versão aplicada fica com o DBA).

```sql
-- BL-050 / LOG-58: a referência da OC para o MES passa a dizer de qual aviso do MES
-- a OC é a recompra. id_aviso_mes_origem = avisos_mes_compra.id_aviso_mes (o id que o
-- MES gerou), só nas OCs emitidas com id_aviso_mes; null nas outras.
-- O MES usa para não contar duas vezes, no saldo futuro, a peça reprovada que já tem
-- recompra (a OC original continua esperando a reprovada pela regra do Recebimento).
-- Só acrescenta uma coluna no fim: CREATE OR REPLACE VIEW mantém as permissões.
BEGIN;
CREATE OR REPLACE VIEW core_vendas_faturamento.vw_ordens_compra_referencia_mes AS
 SELECT oc.id AS id_ordem_compra,
    oc.codigo_empresa,
    oc.numero_pedido,
    oc.numero_pedido_omie,
        CASE
            WHEN oc.status::text = 'aprovado'::text AND oc.deleted_at IS NULL THEN 'aprovada'::text
            ELSE 'cancelada'::text
        END::character varying(10) AS situacao,
    oc.finalidade,
    oc.data_previsao_chegada,
    m.alterado_em,
    to_char((m.alterado_em AT TIME ZONE 'UTC'::text), 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'::text) AS alterado_em_utc,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id_item_oc', i.id, 'ordem', i.ordem, 'codigo_produto_omie', p.codigo_produto_omie, 'descricao_produto', i.descricao_produto, 'quantidade', trim_scale(i.quantidade), 'unidade_medida', i.unidade_medida, 'tipo_material', i.tipo_material, 'local_estoque', i.local_estoque, 'id_requisicao', r.id, 'id_origem', r.id_origem, 'numero_requisicao_mes', r.numero_requisicao_mes, 'id_setor', r.id_setor, 'setor_solicitante', st.nome, 'destino', COALESCE(v.pedidos, '[]'::jsonb) ||
                CASE
                    WHEN (i.quantidade - COALESCE(v.soma, 0::numeric)) > 0::numeric THEN jsonb_build_array(jsonb_build_object('tipo', 'estoque', 'quantidade', trim_scale(i.quantidade - COALESCE(v.soma, 0::numeric))))
                    ELSE '[]'::jsonb
                END, 'valor_unitario', i.valor_unitario, 'desconto_pct', i.desconto, 'valor_desconto', i.valor_desconto, 'valor_total_item', i.valor_total_item) ORDER BY i.ordem, i.id) AS jsonb_agg
           FROM core_vendas_faturamento.ordens_compra_itens i
             LEFT JOIN core_vendas_faturamento.requisicoes_compra r ON r.id = COALESCE(i.id_requisicao, oc.id_requisicao)
             LEFT JOIN core.setores st ON st.id = r.id_setor
             LEFT JOIN core.produtos p ON p.codigo_empresa = oc.codigo_empresa AND p.codigo_produto_omie::text = btrim(i.codigo_produto::text)
             LEFT JOIN LATERAL ( SELECT jsonb_agg(jsonb_build_object('tipo', 'pedido_venda', 'numero_pedido_venda', vi.numero_pedido_venda, 'codigo_empresa_pv', vi.codigo_empresa_pv, 'quantidade', trim_scale(vi.quantidade)) ORDER BY vi.created_at, vi.id) AS pedidos,
                    sum(vi.quantidade) AS soma
                   FROM core_vendas_faturamento.ordens_compra_itens_vinculos vi
                  WHERE vi.id_ordem_compra_item = i.id) v ON true
          WHERE i.id_ordem_compra = oc.id), '[]'::jsonb) AS itens,
    oc.moeda,
    oc.cotacao_moeda,
    oc.cotacao_data,
    oc.cotacao_origem,
    oc.valor_frete,
    oc.valor_seguro,
    oc.codigo_fornecedor,
    COALESCE(NULLIF(btrim(forn.nome_fantasia::text), ''::text), forn.razao_social::text) AS nome_fornecedor,
    forn.cpf_cnpj AS cnpj_fornecedor,
    av.id_aviso_mes AS id_aviso_mes_origem
   FROM core_vendas_faturamento.ordens_compra oc
     JOIN core_vendas_faturamento.ordens_compra_referencia_mes m ON m.id_ordem_compra = oc.id
     LEFT JOIN core.parceiros forn ON forn.codigo_empresa = oc.codigo_empresa AND forn.codigo_parceiro_omie::text = oc.codigo_fornecedor::text AND forn.deleted_at IS NULL
     LEFT JOIN core_vendas_faturamento.avisos_mes_compra av ON av.id = oc.id_aviso_mes
  WHERE oc.status::text = 'aprovado'::text AND oc.deleted_at IS NULL OR (oc.status::text = 'cancelado'::text OR oc.deleted_at IS NOT NULL) AND (oc.aprovado_em IS NOT NULL OR (EXISTS ( SELECT 1
           FROM core_vendas_faturamento.ordens_compra_historico h
          WHERE h.id_ordem_compra = oc.id AND h.status_novo::text = 'aprovado'::text)));
COMMIT;
```

## 10. Permissões e perfis

Nenhuma mudança: a rota continua de serviço (chave de leitura do MES), e as telas do MES usam a tela `saldo`.

## 11. Integrações afetadas

- **av-hub → MES:** a referência da OC (contratos 004 e 007) ganha um campo opcional. Os dois lados já estão prontos e funcionam sem ele.
- **Omie e pipeline:** nenhuma.

## 12. Critérios de aceite

- [x] Frontend: o modal "Atender pelo estoque" e a tela Saldo mostram "A chegar por OC de estoque".
- [x] Backend: o saldo futuro desconta o aviso `RECOMPRA_RNC` que tem OC de recompra aprovada.
- [x] API: `GET /ordens-compra/referencia` traz `id_aviso_mes_origem` quando a view tem a coluna; sem ela, responde 200 sem o campo.
- [ ] Banco: no tst, `SELECT numero_pedido, id_aviso_mes_origem FROM core_vendas_faturamento.vw_ordens_compra_referencia_mes WHERE id_aviso_mes_origem IS NOT NULL` lista as OCs de recompra do LOG-58.

## 13. Como testar

1. **Caminho feliz** (Docker, 12/11):
   - aplique a view;
   - volte o cursor `ordens-compra-referencia` do MES;
   - confira que a OC-000014 chega com `id_aviso_mes_origem`;
   - `GET /estoque/saldo/futuro` deve mostrar o produto 10222656014 com 2 PÇ, só da OC-000014 (antes da view, mostrava 4).
2. **Sem a view:** a rota da API responde 200 sem o campo, e o MES continua contando como hoje.
3. **Limite:** se a OC de recompra for cancelada, as 2 PÇ voltam a contar na OC-000013, e o aviso volta a `ABERTO` para o Compras (LOG-58b).
4. **No tst (Nathan, pedido do Gustavo em 13/11), sem mexer no cursor:**
   - reprovar parte de um lote de uma OC de estoque aprovada e conferir que o aviso chega ao Hub;
   - emitir e aprovar a OC de recompra a partir do aviso: ela aparece na referência com `id_aviso_mes_origem` preenchido (o Gustavo confere no banco);
   - no saldo futuro do produto, a peça reprovada conta uma vez só.

## 14. Ordem de implementação e responsáveis

1. ✅ **API, MES e front** (Nathan, 12/11 e 13/11): `api-acos-vital` PR #310, `api-pcp` PR #81 e `app-pcp` PR #66, todos na `develop`.
2. ✅ **Banco do tst** (Gustavo, 13/11): view aplicada com `2026-11-13_sql022_aviso_recompra_referencia_oc.sql`. Falta o teste no tst (seção 13, item 4, Nathan), e o Gustavo confere a OC de recompra no banco.
3. 🔴 **Produção** (Gustavo): vai junto com tudo o que está no tst, de uma vez, quando o Nathan pedir; sempre depois da log58. A migration do MES sobe sozinha com o container.

## 15. Riscos, rollback e perguntas em aberto

- **Rollback:**
  - volte a view à definição do dump de 12/11;
  - a API passa a ler o conjunto anterior de colunas, e o MES fica com o último valor gravado;
  - para zerar esse valor, rode no MES `UPDATE oc_referencia SET id_aviso_mes_origem = NULL`.
- **Risco: recompra de outro produto.** O desconto é pelo item do aviso (`id_ordem_compra_item`), então uma recompra de produto diferente não tira nada do produto original.
- **Respondida (Gustavo, 13/11):** tudo o que está no tst vai de uma vez para a produção, quando o Nathan pedir, e a view vai depois da log58. Os cadastros do LOG-57 e do LOG-58 (tela, permissões e `auth.rotas_telas`) vêm dentro das próprias migrations e vão junto (PS-055).

## 16. Impacto no vault quando for entregue

- [[05-Estoque-Atendimento]]: o saldo futuro passa a ✅ sem ressalva.
- [[Backlog-Frente-Robert]]: o BL-050 fecha.
- [[LOG-58-Avisos-do-MES-ao-Compras]]: a OC de recompra chega ao MES ligada ao aviso.
- Este contrato vai para `implementado-na-develop`, na pasta `Entregues/`.
