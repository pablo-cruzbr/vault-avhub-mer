---
id: SQL-020
aliases: ["Contrato SQL 020", "020-Orcamento-por-PDF"]
tags: [contrato, contrato-sql, dba, api, orcamento, dashboard, experimental, tv]
criado: 2026-11-03
atualizado: 2026-11-03
status: parcial
sistemas: [hub-banco, hub-api, hub-front]
dono: "Gustavo (DBA)"
etapa_0b: []
fontes: ["av-hub/components/OrcamentoPdf/ (tela e leitor de PDF)", "api-acos-vital/2026-11-03_orcamento_pdf_relatorio.sql", "api-acos-vital/src/schemas/orcamento_pdf/", "api-acos-vital/test/unit/orcamentoPdf.test.js", "av-hub/app/api/orcamento-pdf/", "LOG-51 (identidade propagada e auth.rotas_telas)"]
criado_original: 2026-11-03
---

# Contrato SQL 020 — Orçamento por PDF: relatório compartilhado no banco

> **Onde atua:** av-hub: banco, API e front (tela experimental, mostrada em TV)

> [!abstract] Resumo em linguagem natural
> **O que é:** A tela experimental "Orçamento por PDF" lê o "Relatório Gerencial Comercial" do ERP (um PDF) no navegador e monta um dashboard igual ao de Vendas. Até 03/11 o resultado ficava só no `localStorage` do navegador de quem importou. Este contrato leva o resultado para o banco (schema `orcamento_pdf`, uma tabela só) para o gerente e a TV verem o mesmo painel.
> **Quem é afetado:** quem importa o PDF (Nathan e quem receber a permissão), o gerente e a TV da diretoria.
> **Situação:** Parcial. O SQL, a API e o front estão escritos e testados sem banco; falta o Gustavo aplicar o SQL, publicar a API e dar as permissões, e o Nathan testar de ponta a ponta.
> **Exemplo:** o Nathan importa o PDF de outubro (31 vendedores, R$ 187.641.569,57 em 696 cotações); o gerente abre a tela no computador dele e vê o mesmo ranking.

> [!info] Situação em 03/11/2026
> **Status:** `parcial` · **Pasta:** `Ativos` · **Nós do 0b:** — (tela experimental, fora do fluxo) · **Dono:** Gustavo (DBA)
>
> - ✅ **Escrito em 03/11/2026 (Nathan, com apoio do Claude):** SQL em `api-acos-vital/2026-11-03_orcamento_pdf_relatorio.sql`; API em `api-acos-vital/src/schemas/orcamento_pdf/` (4 rotas); BFF em `av-hub/app/api/orcamento-pdf/`; front em `av-hub/components/OrcamentoPdf/`.
> - ✅ **Testado sem banco:** 7 testes unitários novos da validação (81 no total passam); `eslint` e `tsc` limpos. Os dados lidos do PDF de outubro (31 vendedores, soma R$ 187.641.569,57 e 696 cotações) passam no esquema da API e voltam idênticos pelo front.
> - 🔴 **Não aplicado:** o SQL não foi rodado em nenhum banco (sem Postgres na máquina de desenvolvimento). Nenhuma rota foi chamada de verdade.
> - 🔴 **Gustavo:** aplicar o SQL, publicar a API, conceder a tela `orcamento-pdf` aos perfis (seção "Permissões") e conferir o GRANT do usuário da API.
> - 🔴 **Nathan:** depois disso, testar importar, trocar de período, remover e a TV em tela cheia.
> - ❓ A tela ainda não está no menu: o menu vem de `auth.telas`; entra quando o SQL rodar. A rota funciona pela URL `/experimental/orcamento-pdf` (até lá responde "sem acesso", porque a tela não existe no banco).
>
> Selos em [[Regras-do-Vault]].

## Por quê

A tela lê o PDF no navegador (pdf.js) e guardava o resultado no `localStorage`. Isso é por navegador: o gerente abria a tela vazia e a TV também. A diretoria precisa ver o mesmo painel em outro computador, então o dado tem de ficar no servidor. O PDF em si **não** é enviado nem guardado: só o resultado já interpretado (cerca de 8 KB por relatório).

## O que fica guardado

Uma linha por relatório, na tabela `orcamento_pdf.relatorio`. Chave de negócio: **período + escopo**; importar de novo o mesmo período e escopo substitui o relatório anterior (upsert). O escopo é a linha de filtro impressa no PDF ("Grupo completo • Todas as unidades • Todos os vendedores"): um relatório de uma unidade só não substitui o do grupo.

## SQL (arquivo `api-acos-vital/2026-11-03_orcamento_pdf_relatorio.sql`)

Idempotente. Cria o schema, a tabela, os índices e o gatilho de `updated_at`, e registra a tela e as 4 rotas em `auth`. Nada em tabela existente é alterado.

```sql
-- ============================================================================
-- Orçamento por PDF (tela experimental do av-hub) — contrato SQL-020.
--
-- Guarda, num schema próprio e numa única tabela, o "Relatório Gerencial
-- Comercial" do ERP depois de lido pelo front (o PDF em si NÃO é guardado, só o
-- resultado interpretado). Antes ficava no localStorage do navegador; agora o
-- gerente e a TV enxergam o mesmo relatório.
--
-- Idempotente: pode rodar mais de uma vez. Nada aqui mexe em tabela existente
-- (só INSERT em auth.telas e auth.rotas_telas, e só se ainda não existir).
-- ============================================================================

BEGIN;

-- ─── 1. Schema e tabela ─────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS orcamento_pdf;
COMMENT ON SCHEMA orcamento_pdf IS 'SQL-020: dados da tela experimental "Orçamento por PDF" do av-hub. Uma tabela só (relatorio).';

CREATE TABLE IF NOT EXISTS orcamento_pdf.relatorio (
    id             uuid        DEFAULT uuidv7() NOT NULL,
    -- Chave de negócio: o mesmo período e escopo importado de novo SUBSTITUI o anterior.
    periodo_inicio date        NOT NULL,
    periodo_fim    date        NOT NULL,
    escopo         varchar(200) NOT NULL,
    arquivo_nome   varchar(255),
    gerado_em_erp  timestamptz,
    -- Desnormalizados do JSON para a lista não precisar abrir o documento.
    -- A API os calcula a partir de `dados`; o front não os envia.
    total_cotado   numeric(18,2) NOT NULL,
    qtd_cotacoes   integer     NOT NULL,
    -- O relatório já interpretado: resumo, empresas, unidades, status da carteira e vendedores.
    dados          jsonb       NOT NULL,
    created_at     timestamptz DEFAULT now() NOT NULL,
    created_by     uuid,
    updated_at     timestamptz DEFAULT now() NOT NULL,
    updated_by     uuid,
    deleted_at     timestamptz,
    deleted_by     uuid,
    CONSTRAINT pk_orcamento_pdf_relatorio PRIMARY KEY (id),
    CONSTRAINT ck_orcamento_pdf_relatorio_periodo CHECK (periodo_fim >= periodo_inicio),
    CONSTRAINT ck_orcamento_pdf_relatorio_totais  CHECK (total_cotado >= 0 AND qtd_cotacoes >= 0),
    CONSTRAINT ck_orcamento_pdf_relatorio_dados   CHECK (jsonb_typeof(dados) = 'object' AND pg_column_size(dados) <= 1048576)
);

COMMENT ON TABLE  orcamento_pdf.relatorio IS 'SQL-020: um Relatório Gerencial Comercial do ERP por período e escopo, já lido do PDF. Exclusão lógica (deleted_at). O PDF não é guardado.';
COMMENT ON COLUMN orcamento_pdf.relatorio.escopo        IS 'Linha de filtro impressa no PDF, ex.: "Grupo completo • Todas as unidades • Todos os vendedores". Faz parte da chave: relatório de uma unidade só não substitui o do grupo.';
COMMENT ON COLUMN orcamento_pdf.relatorio.total_cotado  IS 'Total cotado do período (= dados.totalCotado). Calculado pela API.';
COMMENT ON COLUMN orcamento_pdf.relatorio.qtd_cotacoes  IS 'Quantidade de cotações do período (= dados.cotacoes). Calculado pela API.';
COMMENT ON COLUMN orcamento_pdf.relatorio.dados         IS 'Relatório interpretado (contrato SQL-020, seção "Formato de dados"). Máx. 1 MB. A API só grava se a soma dos vendedores fechar com o total do resumo.';

-- Um relatório ativo por período + escopo (a API faz upsert nesta chave).
CREATE UNIQUE INDEX IF NOT EXISTS ux_orcamento_pdf_relatorio_periodo
    ON orcamento_pdf.relatorio (periodo_inicio, periodo_fim, escopo)
    WHERE deleted_at IS NULL;

-- Lista: mais recente primeiro.
CREATE INDEX IF NOT EXISTS ix_orcamento_pdf_relatorio_recente
    ON orcamento_pdf.relatorio (periodo_fim DESC, created_at DESC)
    WHERE deleted_at IS NULL;

-- updated_at só se move quando a linha muda de fato (mesma função das outras tabelas).
DROP TRIGGER IF EXISTS trg_orcamento_pdf_relatorio_updated_at ON orcamento_pdf.relatorio;
CREATE TRIGGER trg_orcamento_pdf_relatorio_updated_at
    BEFORE UPDATE ON orcamento_pdf.relatorio
    FOR EACH ROW
    WHEN (NOT (new.updated_at IS DISTINCT FROM old.updated_at))
    EXECUTE FUNCTION public.fn_updated_at_se_mudou();

-- Permissão de uso do schema para o usuário da API (ajustar ao papel do ambiente):
-- GRANT USAGE ON SCHEMA orcamento_pdf TO <usuario_da_api>;
-- GRANT SELECT, INSERT, UPDATE ON orcamento_pdf.relatorio TO <usuario_da_api>;

-- ─── 2. Tela e rotas no mapa de permissões (auth) ──────────────────────────
-- A API é fail-closed: rota sem linha em auth.rotas_telas responde 403.

-- A tela fica dentro do grupo "Experimental". Se o slug do grupo for outro, ajustar
-- no SELECT abaixo; sem grupo encontrado a tela nasce na raiz (id_parent nulo).
INSERT INTO auth.telas (nome, id_parent, ordem, slug)
SELECT 'Orçamento por PDF',
       (SELECT t.id FROM auth.telas t WHERE t.slug = 'experimental' AND t.deleted_at IS NULL LIMIT 1),
       0,
       'orcamento-pdf'
 WHERE NOT EXISTS (SELECT 1 FROM auth.telas WHERE slug = 'orcamento-pdf');

-- O caminho com id é normalizado para "*" por auth.fn_caminho_normalizado.
INSERT INTO auth.rotas_telas (metodo, rota, slug_tela, acao, observacao)
SELECT v.metodo, v.rota, 'orcamento-pdf', v.acao, 'SQL-020: Orçamento por PDF'
  FROM (VALUES
         ('GET',    '/orcamento_pdf/relatorios',   'pode_visualizar'),
         ('GET',    '/orcamento_pdf/relatorios/*', 'pode_visualizar'),
         ('PUT',    '/orcamento_pdf/relatorios',   'pode_criar'),
         ('DELETE', '/orcamento_pdf/relatorios/*', 'pode_deletar')
       ) AS v(metodo, rota, acao)
 WHERE NOT EXISTS (
         SELECT 1 FROM auth.rotas_telas r
          WHERE r.metodo = v.metodo AND r.rota = v.rota
            AND COALESCE(r.slug_tela, '') = 'orcamento-pdf' AND COALESCE(r.acao, '') = v.acao);

-- ─── 3. Quem pode o quê (decisão do DBA, não vai neste arquivo) ────────────
-- Conceder a tela "orcamento-pdf" em auth.permissoes aos perfis certos:
--   pode_visualizar → gerente e quem usa a TV;
--   pode_criar      → quem importa o PDF (substitui o relatório do mesmo período);
--   pode_deletar    → quem remove um relatório.

COMMIT;

-- ─── Conferência (rodar depois) ─────────────────────────────────────────────
-- SELECT count(*) FROM orcamento_pdf.relatorio;                       -- 0 no começo
-- SELECT metodo, rota, acao FROM auth.rotas_telas WHERE slug_tela = 'orcamento-pdf' ORDER BY 1, 2;  -- 4 linhas
-- SELECT slug, nome, id_parent FROM auth.telas WHERE slug = 'orcamento-pdf';                        -- 1 linha
```

## API (`api-acos-vital`, schema `orcamento_pdf`)

Montada em `/orcamento_pdf` com `exigirTokenUsuario` (sem Bearer: 401). A permissão vem de `auth.rotas_telas` (sem linha: 403). Handler com `asyncHandler`, erros por `tratarErrosHttp` (`codigo` e `detail`), entrada validada com zod, valores somados em `Decimal`. Sem model Sequelize: SQL direto, como o `core_comercial`.

| Método e rota | Tela e ação | O que faz |
|---|---|---|
| `GET /orcamento_pdf/relatorios` | `orcamento-pdf:pode_visualizar` | Lista sem o documento, mais recente primeiro (`periodo_fim` desc). Envelope do hub, lista em `relatorios`; `page` e `limit` (padrão 50, máx. 200). |
| `GET /orcamento_pdf/relatorios/{id}` | `orcamento-pdf:pode_visualizar` | Um relatório com `dados`. 404 se não existir ou foi removido. |
| `PUT /orcamento_pdf/relatorios` | `orcamento-pdf:pode_criar` | Grava por período e escopo. 201 se criou, 200 se substituiu. Resposta: `id`, `criado`, `created_at`, `updated_at`. |
| `DELETE /orcamento_pdf/relatorios/{id}` | `orcamento-pdf:pode_deletar` | Exclusão lógica (`deleted_at`, `deleted_by`). |

**Corpo do `PUT`:**

```json
{
  "periodo_inicio": "2026-10-01",
  "periodo_fim": "2026-10-31",
  "escopo": "Grupo completo • Todas as unidades • Todos os vendedores",
  "arquivo_nome": "Aços Vital - ERP Comercial.pdf",
  "gerado_em_erp": "2026-11-03T10:44:36-03:00",
  "dados": { "totalCotado": 187641569.57, "cotacoes": 696, "...": "ver Formato de dados" }
}
```

**Regras da gravação:**

- Campo desconhecido no corpo ou em `dados` é recusado (400 `REQUISICAO_INVALIDA`, com `erros` por campo): nada de lixo no `jsonb`.
- `total_cotado` e `qtd_cotacoes` **não vêm do corpo**: a API os calcula de `dados`.
- **A soma tem de fechar:** a soma de `vendedores[].valorCotado` (em `Decimal`, sem erro de ponto flutuante) e de `vendedores[].cotacoes` tem de ser igual a `totalCotado` e `cotacoes` do resumo. Senão, 422 `RELATORIO_NAO_CONFERE`, com os dois lados na resposta. Evita gravar um ranking incompleto quando a leitura do PDF perde um vendedor.
- Fim do período anterior ao início: 422 `PERIODO_INVALIDO`.
- Dinheiro com no máximo 2 casas e sem negativo; contagens inteiras; no máximo 500 vendedores e 20 itens por lista; documento até 1 MB.
- Repetir o `PUT` é seguro (mesma chave, mesmo resultado).
- Tabela ausente (migration não aplicada) vira 503 `MIGRATION_AUSENTE`, apontando o arquivo `2026-11-03_orcamento_pdf_relatorio.sql`.

## Formato de dados (`dados`)

Resumo: `totalCotado`, `cotacoes`, `emAberto`, `emCarteira`, `fechadas`, `convertidas`, `perdidas`, `encerradas`, `conversao` (0 a 100, a conversão do ERP = fechadas ÷ (fechadas + perdidas)). Listas: `empresas`, `unidades` e `status` (cada item com `nome`, `qtd`, `qtdSecundaria` e `valor`) e `vendedores` (cada um com `nome`, `email`, `unidade`, `av`, `au`, `hrm`, `cotacoes`, `valorCotado`, `abertasQtd`, `abertasValor`, `fechadasQtd`, `fechadasValor`). Valores em reais como número com até 2 casas. A definição completa está em `api-acos-vital/src/schemas/orcamento_pdf/aggregates/relatorios/relatorios.swagger.json` (aparece no `/docs`, grupo "Orçamento por PDF (experimental)").

`total_cotado` na resposta de lista e de detalhe sai como **string** (`numeric(18,2)`, padrão do hub para dinheiro). Dentro de `dados` os valores são números JSON, como o front os leu.

## Permissões (decisão do Gustavo)

A tela `orcamento-pdf` (grupo Experimental) e as 4 rotas entram pelo SQL. Falta conceder em `auth.permissoes`:

| Quem | Ação |
|---|---|
| Gerente e quem usa a TV | `pode_visualizar` |
| Quem importa o PDF | `pode_criar` |
| Quem remove um relatório | `pode_deletar` |

O front esconde "Importar PDF" e o botão de remover de quem não tem a ação; a API continua barrando mesmo assim.

## Front (Nathan)

- `av-hub/app/api/orcamento-pdf/` (`route.ts` e `[id]/route.ts`): o BFF confere a permissão da tela e repassa; não calcula nada.
- `components/OrcamentoPdf/api.ts` converte entre o formato da tela (datas "01/10/2026") e o da API (ISO); `useRelatorios.ts` lista, abre um relatório e **se atualiza a cada minuto** (e renova a sessão, como os dashboards), então a TV mostra o PDF que outra pessoa importou. Erro no auto-refresh mantém o último relatório bom.
- A rota `/experimental/orcamento-pdf` usa o header de dashboard (`Layout.tsx` passou a tratá-la como dashboard) e, em tela cheia, esconde a barra de importação.
- O `localStorage` deixou de ser usado; o que estava gravado nele (chave `av.orcamentoPdf.v1`) fica sem efeito e pode ser apagado.

## Critérios de aceite

1. Com o SQL aplicado, `GET /orcamento_pdf/relatorios` responde 200 com `relatorios` vazio para quem tem `pode_visualizar` e 403 para quem não tem.
2. Importar o PDF de outubro grava 1 linha: `total_cotado` = 187641569.57, `qtd_cotacoes` = 696, 31 vendedores em `dados`. Importar de novo o mesmo PDF responde 200 e continua 1 linha.
3. Outro usuário, em outro computador, abre a tela e vê o mesmo painel (ranking, gauge, unidades).
4. Um `PUT` com um vendedor a menos responde 422 `RELATORIO_NAO_CONFERE` e não grava.
5. A TV em tela cheia mostra o relatório novo em até 1 minuto depois de outra pessoa importar.
6. Quem só tem `pode_visualizar` não vê "Importar PDF" e recebe 403 num `PUT` direto.

## Fora deste contrato

- Guardar o PDF original (só o resultado interpretado é guardado).
- Filtros do header de dashboard (calendário, unidade, histórico e busca de pedido): não filtram nada nesta tela, porque os dados vêm só do PDF.
- Virar tela oficial: o desenho de dados seria outro (relatório lido do ERP pela pipeline, sem PDF); fica para quando a diretoria decidir.

## Riscos

- O leitor depende do layout do PDF atual do ERP. Se o ERP mudar o texto, a leitura falha com mensagem clara (nada é gravado); a API não repara um relatório mal lido, só recusa o que não fecha.
- Quem tem `pode_criar` sobrescreve o relatório de um período para todos. O `updated_by` guarda quem foi; o histórico de versões não é guardado.
