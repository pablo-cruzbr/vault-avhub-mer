---
tags: [anexo, comercial, suprimentos, api-comercial, fora-do-fluxo]
criado: 2026-10-14
estado-em: 2026-11-11
status: vigente
dono: Robert (migração para a API do Hub, N16-117) · Pablo acompanha · Gustavo (banco)
fontes: [HUB b55ac55 api-comercial/ (prisma, src/modules, Dockerfile, env.ts), app/(protected)/comercial e suprimentos, app/api/comercial, v1 AV-Hub-Comercial-Suprimentos, conferência de 29/10/2026 em av-hub develop 758d5f0 (lib/api/comercialApi.ts, app/(protected)/vendas e orcamento, a90d306) e api-acos-vital develop 0384e89 (schemas/core_comercial)]
---

# Comercial e Suprimentos (`api-comercial`, removida em 06/11/2026)

**Em uma frase:** a `api-comercial` foi o serviço de teste que o Pablo criou para propostas, clientes, ofertas de fornecedor, custos e o painel do comprador; foi **removida do av-hub em 06/11/2026** (PR #261, `dd9d729`). O módulo comercial vive hoje na `api-acos-vital`, conduzido pelo Robert; o que não foi portado para lá é 🔴 "sem API e sem banco" (F3).

**Quando consultar:** quando a dúvida é "o que o módulo do Pablo fazia e o que já existe na API do Hub?". A `api-comercial` não é fonte de regra nem de estado: vale o desenho das raias e as decisões. O módulo fica fora do fluxo 0b e do MES. O orçamento está em [[02-Orcamento-Base-de-Preco]] (o anexo antigo [[Orcamento]] está arquivado). Mapa do módulo: [[Mapa-do-Modulo-do-Pablo]]. Modelo de classes: [[Classes]], diagrama 4.

Quem cuida hoje: o Robert conduz a migração das rotas para a `api-acos-vital`; o Pablo acompanha e cuida do Orçamento (com supervisão do Robert); o Gustavo revisa o banco; o Nathan faz as telas (N16-117). Desde 11/11 o Robert é dono da Proposta e do Pedido, e o Pablo, júnior, do Orçamento com o acompanhamento do Robert; o Nathan coordena e apoia (N16-157).

> [!info] Migração para a API do hub (15/10/2026)
> O serviço `api-comercial` era de teste (N14-15) e foi removido em 06/11/2026. O plano de migração para a `api-acos-vital` está em [[Contratos-da-v2|LOG-52]]; o que vale hoje é o desenho das raias e as decisões.

> [!info] Legado só para leitura (28/10/2026, N16-117)
> A pasta `api-comercial/` do HUB foi legado de consulta de 28/10 a 06/11/2026 e foi **removida do av-hub em 06/11/2026 (PR #261, `dd9d729`)**; o código fica legível em `git show f7d8d7f:api-comercial/<arquivo>`. O front fala só com a API do Hub. O que o código antigo tinha está em [[Mapa-do-Modulo-do-Pablo]] (histórico).

> [!info] Proposta e Orçamento no fluxo (26/10/2026)
> A proposta (`V0`) e o Orçamento (`B1` a `B4`) entraram no [[00-Fluxo-Mestre-0b]] (N16-01, N16-07; N14-02 ajustada). O desenho aprovado muda o ciclo da proposta do módulo (sem fechamento parcial, cancelada no lugar de perdida, pedido criado pelo Hub). Os contratos dessa parte foram removidos em 29/10/2026, e o Robert cria os novos.

## O que existe

- ✅ O serviço não existe mais no repositório do HUB: foi removido do av-hub em 06/11/2026 (PR #261, `dd9d729`), av-hub `lib/api/comercialApi.ts:15` (`A api-comercial de teste foi removida`). O schema `core_comercial` continua no banco do av-hub. Antes disso foi legado só de leitura (`a90d306`, 28/10).
- ✅ **Onde as rotas novas nascem:** a `api-acos-vital` já tem o módulo `/comercial/*` (pasta `src/schemas/core_comercial`, LOG-52), feito pelo Robert: `/me`, `/empresas_emissoras`, `/responsaveis`, `/parametros_custo` (GET e PUT), `POST /clientes` (cadastro no Omie da unidade, 28/10), `/parceiros` (29/10) e `/propostas` (criar, listar, resumo, detalhe, eventos, `PUT`, `aprovar`, `cancelar`, `copiar`, `transformar`, 28 e 29/10). `/suprimentos` está montado, mas sem rota. Todas exigem o token do usuário.
- ✅ **O BFF** (`app/api/comercial/[...rota]`) fala só com a API do Hub; das 72 rotas da lista, 21 já têm destino no Hub e as demais respondem 503 `RECURSO_NAO_MIGRADO` até serem criadas lá (`lib/api/comercialApi.ts`, `3bccfce`).
- (histórico) A `api-comercial` tinha propostas, clientes, custos, suprimentos, cadastros, relatórios, dashboards, notificações e integração com o Omie (lia pedidos de compra). O que não está na `api-acos-vital` é 🔴 "sem API e sem banco".
- ✅ No legado, o acesso era pela chave do HUB mais o login do usuário, com o perfil comercial em `UsuarioComercial`. Na API do Hub vale só o token do usuário e a tabela `auth.rotas_telas`.
- ✅ Telas: as pastas `comercial/` e `suprimentos/` do HUB **deixaram de existir** em 16/10 (`19a17cf`, `1ab365d`). Hoje as propostas estão em `vendas/propostas` (lista, nova, `[id]`), o relatório gerencial em `vendas/relatorio-gerencial` e as telas de suprimentos em `orcamento/` (`catalogo-produtos`, `custo-itens`, `fornecedores`, `painel-comprador`, `parametros-custo`). Há também o `dashboards/dash-comercial`. O que o menu enxuto deixou de fora (pedido de cotação, ofertas, histórico de compras, pesquisa de materiais, tabela da telha, sincronização com o Omie, clientes, relatório de cotações) não tem mais página (N16-107, N16-108).
- 📝 Nunca foi publicado (N16-117) e foi removido em 06/11/2026.

## Pendências

- ✅ Decidido: o serviço não seria publicado (N16-117); foi removido em 06/11/2026. 🔴 A N16-116 disse que o schema `core_comercial` não existiria (a proposta ficaria em `core_vendas_faturamento`), mas o código e o dump de 29/10 da `api-acos-vital` ainda o usam; está em decisão. As pendências abaixo só importam quando a parte equivalente existir na API do Hub.
- ❓ Token com claim de perfis: o v1 apontava como pendência; a claim não foi relida.
- ❓ Comprador detectado por nome de perfil no v1, frágil; não reconferido.
- ❓ E-mail da proposta: aceita `smtp` ou `memoria`; não se sabe se o SMTP está configurado em produção.

## Detalhe técnico

### O serviço (histórico)

A tabela descreve o código como estava (14/10, conferido em 29/10). Os caminhos são relativos a `f7d8d7f:api-comercial/`, e o ✅ quer dizer "visto no código antigo", não pronto.

| Item | Estado | Selo |
|---|---|---|
| Onde estava | Pasta `api-comercial/` do repositório do HUB; removida em 06/11/2026 (PR #261), a `develop` `44bb770` não tem a pasta | ✅ |
| Stack | Node 22 (`FROM node:22-slim`), Express 5, Prisma, schema `core_comercial`, porta 3001 (`PORT` padrão em `src/config/env.ts:12`) | ✅ histórico: `f7d8d7f:api-comercial/Dockerfile:2` (`FROM node:22-slim`), `env.ts:12` |
| Migrations | 13 em `prisma/migrations`, de `20261001000000_mvp_inicial` a `20261013140000_usuarios_comerciais_diretorio` | ✅ |
| Módulos | `propostas`, `clientes`, `custos`, `suprimentos`, `cadastros`, `relatorios`, `dashboards`, `notificacoes`, `omie` | ✅ `src/modules/*` |
| Rotas de proposta | `GET /`, `/resumo`, `/:id`, `POST /`, `/calcular`, `/itens/importar`, `PUT /:id`, `POST /:id/perder`, `/reabrir`, `/fechar`, `/duplicar`, `GET /:id/eventos`, `/versoes`, `PUT /:id/pedido_omie` | ✅ `propostas.routes.ts:17-160` |
| Omie | `POST /omie/sincronizar`, `GET /omie/sincronizacoes`; sincroniza produtos e fornecedores do hub e lê pedidos de compra por conta | ✅ `omie.routes.ts:27,55` |
| Acesso (legado) | `x-api-key` mais Bearer do hub; perfil comercial em `UsuarioComercial` (tabela `perfis_comerciais`, sem coluna de cargo) | ✅ `empresas.prisma:61-78` |
| BFF | `app/api/comercial/[...rota]/route.ts` com lista de rota, método, tela e ação (por exemplo `GET /dashboards/comercial` exige `dash-comercial`); destino é a API do Hub (`lib/api/comercialApi.ts`); sem `api: 'hub'` a rota responde 503 | ✅ |
| Publicação | Nunca publicada; removida do av-hub em 06/11/2026; o roteiro `docs/ENVIAR - roteiro-publicacao-api-comercial.md` não vale mais | 📝 N16-117 |

### Telas do HUB (conferido em 29/10/2026)

- `vendas/`: `propostas` (lista, `nova`, `[id]`) e `relatorio-gerencial`. As telas de proposta são do Robert (N16-117).
- `orcamento/`: `catalogo-produtos` (e `[id]`), `custo-itens`, `fornecedores` (e `[id]`), `painel-comprador`, `parametros-custo`. O Orçamento é do Pablo, com o Robert.
- `dashboards/dash-comercial`.
- Saíram em 16/10: as pastas `comercial/` (clientes, relatório de cotações) e `suprimentos/` (pedido de cotação, ofertas, histórico de compras, pesquisa de materiais, tabela da telha, sincronização com o Omie).

✅ `app/(protected)/vendas/**` e `orcamento/**`. Cadastro de cada slug em `auth.telas` de produção ❓ Gustavo (o Dump Avhub é só esquema).

### Pendências (detalhe)

- Publicar o serviço: **encerrado** pela N16-117 (não será publicado). Sobre o schema `core_comercial`, a N16-116 diz que não existirá, mas o código da `api-acos-vital` (migration 052) e o dump de 29/10 já o têm, com `propostas`, `clientes`, `ofertas` e outras 20 tabelas 🔴 divergência a decidir entre Nathan e Robert.
- Token com claim de perfis ❓: a v1 apontava como pendência; o `api-comercial` identificava o usuário em `UsuarioComercial` (histórico), mas a claim não foi relida.
- Comprador detectado por nome de perfil no v1 (`/compr|suprimento/i`), frágil ❓ não reconferido.
- E-mail da proposta: `EMAIL_TRANSPORTE` aceita `smtp` ou `memoria` (padrão `smtp`) ✅ `env.ts:54`; se o SMTP está configurado em produção ❓.
