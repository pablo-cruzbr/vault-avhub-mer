---
tags: [projeto, sistemas, repositorios, responsabilidades]
criado: 2026-10-14
estado-em: 2026-11-11
status: vigente
dono: Nathan
fontes: [git dos cinco repositórios em 14/10/2026 e em 29/10/2026 (somente leitura), decisões do Nathan de 14/10 e N16-111, N16-117, N16-157, v1 Equipe-Projeto, v1 Registro-de-Decisoes #32 #33, Dockerfiles]
---

# Sistemas e responsabilidades

**Em uma frase:** o projeto tem cinco peças de software em uso (HUB, API do Hub, MES com dois repositórios e pipeline do Omie), e cada uma tem um dono.

**Quando consultar esta nota:** quando você quiser saber qual sistema faz o quê, de quem ele é e em que estado está.

## Quem cuida de quê

| Sistema | O que é | Dono |
|---|---|---|
| HUB (`av-hub`) | As telas do portal comercial e de compras | Nathan |
| `api-acos-vital` | A API do Hub, que fala com o banco do av-hub. Desde 28/10 o módulo comercial (`/comercial/*`) nasce aqui, conduzido pelo Robert | Gustavo (DBA); módulo comercial: Robert |
| `api-comercial` | API de teste do Pablo, **removida do av-hub em 06/11/2026 (PR #261, `dd9d729`)**. Antes disso foi legado só de leitura (N16-117). O código fica legível em `git show f7d8d7f:api-comercial/<arquivo>` | Ninguém. Não é fonte de regra nem de estado: vale o desenho do vault e as decisões; o módulo vive na `api-acos-vital` |
| MES: `api-pcp` (back) e `app-pcp` (front) | Chão de fábrica, Estoque, Recebimento e Qualidade | Robert |
| `omie-elt-pipeline` | Copia o Omie para o banco do av-hub e envia a OC ao Omie | Nathan 📝 |

## Quem faz o quê

| Pessoa | Frente | Onde trabalha | Entregas principais |
|---|---|---|---|
| **Gustavo M. de Farias** (DBA) | DBA e API de todo o sistema (N16-157; ❓ se inclui a `api-pcp`, falta confirmar) | `api-acos-vital`, migrations, `auth.*`, `core_*` | Aplicar migrations no banco; L3 de `auth.rotas_telas`; cadastrar as listas de rotas das chaves do MES e da pipeline (L6; o recurso já está no código); permissões `torre-fluxo` e `custo-itens`; versionar o SQL do contrato 34; exposição de rede da `api-pcp` |
| **Nathan** | Coordenação e gestão da equipe, dono da raia 06 Circuito de Compra e apoio ao Robert em cada processo (N16-157); telas do av-hub (front e BFF) | HUB | Telas de Compras, Torre de Fluxo, indicador de origem da requisição; perfil CCP; decisões e contratos; este vault. As telas de proposta, do custo por item e da comissão são do Robert, e as de Orçamento, do Pablo com o Robert (N16-157) |
| **Robert Wilson** | Dono de 13 das 15 raias do fluxo 0b (N16-157): MES inteiro e, desde 28/10, o módulo comercial na API do Hub; desde 11/11 também Fiscal · Omie e Custo Real e Comissão | `api-pcp`, `app-pcp`, rotas `/comercial/*` da `api-acos-vital` e telas de proposta do HUB | Documento de retirada e baixa na retirada, fabricado virar lote (feito na `develop`), `/fluxo/eventos`, G1 (carga em lote), D11, I1/J2/J5; rotas e telas da proposta. Já feitos na `develop`: `GET /itens/custo` (27/10) e o job da OC do contrato 004 (K4, 15/10) |
| **Pablo Cruz** | Desenvolvedor júnior, dono da raia 02 Orçamento com o acompanhamento do Robert (N16-157) | Telas de `orcamento/*` do HUB (a `api-comercial` dele foi removida em 06/11/2026) | Acompanhar o módulo na `api-acos-vital` pelo desenho das raias ([[Mapa-do-Modulo-do-Pablo]] é só histórico); telas e perfis do Orçamento |

As atribuições foram decididas em 07/10/2026 (itens 32 e 33 do Registro do v1) e reafirmadas em 14/10: MES com o Robert, Comercial & Suprimentos com o Pablo 📝. Em 28/10 o Robert passou a conduzir o módulo comercial, com o Pablo acompanhando (N16-117) 📝. Em 11/11 o Nathan definiu o dono de cada raia do fluxo 0b (N16-157) 📝. Nota completa em [[Equipe-e-Divisao]]. Backlog por dono em [[Backlog-por-Frente]].

## Como os sistemas se ligam

```mermaid
flowchart LR
    OMIE["Omie"]
    PIPE["Pipeline Omie"]
    API["api-acos-vital"]
    HUB["HUB front"]
    MESB["api-pcp"]
    MESF["app-pcp"]
    OMIE -->|"extrai"| PIPE
    PIPE -->|"upsert"| API
    PIPE -->|"UpsertPedCompra"| OMIE
    HUB -->|"BFF"| API
    MESF --> MESB
    MESB -->|"GET pedidos liberados"| API
    MESB -->|"PUT contrato 34 e GET eventos contrato 35"| API
    API -->|"GET itens status contrato 005"| MESB
```

Versão completa por contrato em [[Componentes-e-Implantacao|Diagrama-Componentes-e-Implantacao]]. Chaves e autenticação entre os sistemas em [[Chaves-e-Autenticacao]]. Contratos em [[Integracao-AvHub-MES]] e [[Contratos-da-v2]].

## Em que ambiente cada um está

| Ambiente | Estado |
|---|---|
| Produção do av-hub (HUB e API) | No ar, com contêineres saudáveis 📝 (Nathan, 14/10). A versão em produção é a `main` ❓ |
| `api-test` (API do av-hub de teste) | Ambiente em que os contratos foram validados (`develop`) 📝 |
| `mes-test.acosvital.com.br` | Homologação do MES com a `develop`. O `PUT` do contrato 34 funcionou no teste 📝 (v1 Registro #1 e #2) |
| Produção do MES | Banco vazio em 07/10 (dump) e sem as migrations da `develop` ❓ |
| `api-pcp` | No ar 📝 (Nathan, 14/10) |
| `api-comercial` | Removida do av-hub em 06/11/2026 (PR #261, `dd9d729`). Nunca teve ambiente nem foi publicada |

Topologia dos servidores em [[Infraestrutura]].

## Publicação na `main`

Pelo F5, o que está na `develop` já conta como pronto; a `main` é só o que foi publicado. Quanto falta publicar em cada sistema, e a pendência do MES (BL-035), está em [[Onde-Estamos#Publicado na main (informação)]].

## Detalhe técnico

### Repositórios, branches e commits de 14/10/2026 e de 29/10/2026

O branch de trabalho é `develop` (no pipeline, `master`). Os repositórios foram atualizados com `git fetch` e `git pull --ff-only` em 14/10/2026 ✅ e conferidos de novo em 29/10/2026. A coluna da `develop` e a da `main` abaixo mostram as duas datas.

| Sistema | Repositório (GitHub `Acosvital/…`) | Pasta local | `develop` em 14/10 | `main` | Dono |
|---|---|---|---|---|---|
| MES back (`api-pcp`) | `api-pcp` | `<pasta-mãe>\api-pcp` | 14/10: `de68086` (PR #58). **29/10: `befd973`** (PR #78, OP e lote do fabricado, 27/10) | 14/10: `8e2bf56` (08/10), `develop` 13 à frente. **29/10: igual, `develop` 53 à frente** | Robert |
| MES front (`app-pcp`) | `app-pcp` | `<pasta-mãe>\app-pcp` | 14/10: `df4a258` (PR #45). **29/10: `93f96de`** (PR #63, 27/10) | 14/10: `3b0f463` (08/10), `develop` 10 à frente. **29/10: igual, `develop` 51 à frente** | Robert |
| API do av-hub (`api-acos-vital`) | `api-acos-vital` | `<pasta-mãe>\api-acos-vital` | 14/10: `276dab8`. **29/10: `f2fa237`** (rotas de parceiros; o clone local tem mais 1 commit, `0384e89`, ainda não enviado) | 14/10: `49596ca` (09/10), `develop` 11 à frente. **29/10: `4151467` (PR #305), `develop` 0 à frente** | Gustavo (DBA); módulo comercial: Robert |
| HUB (front do av-hub) | `av-hub` | `TI\NATHAN\00 - HUB` (14/10); `<pasta-mãe>\av-hub` (29/10) | 14/10: `b55ac55` (PR #194). **29/10: `758d5f0`** (PR #251, abas da proposta) | 14/10: `cfed113` (06/10), `develop` 284 à frente. **29/10: `b977529` (23/10), `develop` 29 à frente** | Nathan |
| `api-comercial` | `av-hub` (pasta `api-comercial/` dentro do HUB) | não existe mais (histórico em `f7d8d7f`) | legado de leitura de `a90d306` (28/10) a `dd9d729` (06/11, PR #261), quando saiu da `develop`; legível em `git show f7d8d7f:api-comercial/<arquivo>` | publicado na `main`: a pasta ainda está lá (a remoção não chegou) | Ninguém; não é fonte de regra |
| Pipeline Omie | `omie-elt-pipeline` | `<pasta-mãe>\omie-elt-pipeline` | `master` `0f739f0` (PR #3, envio da OC fixo, 08/10) | — | Nathan 📝 |

Evidência: `git log -1`, `git branch --show-current` e `git rev-list --count origin/main..origin/develop` em cada repositório, 14/10/2026 ✅.

Divergência com o v1: o v1 dizia que a `main` do MES "parou em 28/08". Hoje a `main` do `api-pcp` e do `app-pcp` está em 08/10 ✅.

### Autores nos commits recentes (desde 15/09)

| Repositório | Autores (commits) | Leitura |
|---|---|---|
| `api-pcp` | Robert Wilson 28, arquitetoVital 17 (merges de PR), Pablo Cruz 9 | MES é do Robert; os 9 do Pablo são anteriores à reatribuição de 07/10 |
| `app-pcp` | Robert Wilson 37, arquitetoVital 20, Pablo Cruz 17 | idem |
| `api-acos-vital` | HauntedCrusader 87, Gustavo M. de Farias 15, arquitetoVital 5 | `HauntedCrusader` é o Gustavo 📝 |
| HUB | Pablo Cruz 258, oluccaa 137, Nathan Lucca 80, arquitetoVital 16, Robert Wilson 16 | Pablo concentra o Comercial & Suprimentos; `oluccaa` e `Nathan Lucca` são o Nathan 📝 |
| `omie-elt-pipeline` | oluccaa 15, Nathan Lucca 3, Claude 1 | O dono do pipeline é o Nathan 📝 (a atribuição "Gustavo" do v1 estava errada) |

### Stack e contêineres

| Sistema | Stack | Container |
|---|---|---|
| HUB | Next.js (BFF só com a API do Hub, `API_URL`; o `COMERCIAL_API_URL` saiu do código, `3bccfce`) | `Dockerfile` Node 20 alpine, porta 3000 |
| `api-acos-vital` | Express 4 + Sequelize, `src/schemas/**` | `Dockerfile` Node 20 alpine, porta 3000 |
| `api-comercial` | Express 5 + Prisma, schema `core_comercial` | `Dockerfile` Node 22 slim, porta 3001; removida do av-hub em 06/11/2026 (PR #261, `dd9d729`), nunca publicada |
| `api-pcp` | NestJS + Prisma | `Dockerfile` Node 22 slim, porta 3000 |
| `app-pcp` | Next.js | `Dockerfile` Node 22 slim, porta 3000 |
| Pipeline | Node (BullMQ, node-cron, Playwright) + Redis | `docker-compose.yml`, 6 processos no PM2 (`ecosystem.config.cjs`) |

Evidência: Dockerfiles em cada repositório e `ecosystem.config.cjs` do pipeline ✅.
