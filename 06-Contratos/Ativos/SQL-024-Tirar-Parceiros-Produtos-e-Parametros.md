---
id: SQL-024
titulo: Saem de Cadastros › Auxiliares as telas Parceiros, Produtos, Produtos duplicados e Parâmetros de custo
status: para-implementar
autor: Nathan
data: 2026-11-18
camadas: [frontend, api, sql]
donos: {frontend: Nathan, api: Gustavo, sql: Gustavo}
nos_0b: []
notas_afetadas: [RBAC-e-Permissoes, Telas-e-Experiencia-do-Usuario, Registro-N16-167-em-diante]
depende_de: [SQL-023]
decisoes: [N16-179, N16-173]
develop-conferida: [api-acos-vital ce4f90f, em 2026-11-23 (a API do Gustavo, b9a46a1, também na main); av-hub 2d3b25f, em 2026-11-18, também na main (av-hub #322 8938199)]
tags: [contrato, banco, rbac, permissoes, telas, limpeza, cadastros]
criado: 2026-11-18
estado-em: 2026-11-23
dono: Nathan
fontes: [conversa do Nathan com o Claude de 18/11/2026 à noite, av-hub PR #321 e release #322, banco do Docker local com os dados do tst (docker-teste, fora do vault), SQL-023-Limpeza-das-Telas-Antigas, api-acos-vital b9a46a1]
---

# SQL-024 · Tirar Parceiros, Produtos e Parâmetros de custo

> **Situação em 23/11:** o Hub está na `develop` e na `main` (av-hub #321 e release #322). A API também mudou, na `develop` e na `main` (`api-acos-vital` `b9a46a1`, do Gustavo; seções 7 e 8). ❓ O SQL do Gustavo (seção 9) no tst e em produção não foi conferido; ele foi testado no Docker.

## 1. Resumo em linguagem simples

Quatro telas de Cadastros › Auxiliares saem do Hub: **Parceiros**, **Produtos**, **Produtos - Prováveis Duplicatas** e **Parâmetros de custo**. Os dados ficam no banco: os parceiros e os produtos continuam vindo do Omie, e a proposta continua usando os parâmetros de custo. O que muda é que ninguém mais edita isso pelo Hub; mudar um parâmetro de custo passa a ser um SQL do Gustavo.

## 2. Contexto: o que deve ser feito e por quê

- **De onde vem:** pedido do Nathan de 18/11/2026, à noite, ao revisar Cadastros (N16-179).
- **Por quê:** as quatro telas não são usadas no dia a dia. Parceiros e produtos vêm do Omie pela pipeline; a duplicata de produto se resolve no Omie; os parâmetros de custo mudam raramente (N16-173 já os tinha tirado do Orçamento).
- **Se não for feito:** o menu de Auxiliares continua com quatro telas que ninguém deveria usar.

## 3. Onde fica no fluxo

Transversal, sem nó do 0b.

## 4. Como está hoje

- As quatro telas existem em `auth.telas` e, no Docker (cópia do tst), têm permissão em Admin (Dev), Cadastros e Gerencia PCP (Parâmetros de custo, só Admin (Dev)).
- A lista de parceiros (`GET /parceiros`) é usada também fora da tela Parceiros, e no mapa de rotas só a tela `parceiros` a libera:
  - para escolher o cliente em Comissões (Blacklist de clientes e Regras de comissões fixas);
  - como `GET /parceiros/:id`, pelo BFF do Comercial, em Propostas e Fornecedores.
- `GET /produtos` também é liberado por `catalogo-produtos` e `compras`; `GET /familias_produtos`, por `catalogo-produtos` (SQL-023).

## 5. Regras de negócio

- **R1.** As quatro telas saem, com as permissões e as linhas delas no mapa de rotas.
- **R2.** Os dados ficam: `core.parceiros`, `core.produtos` e os parâmetros de custo não mudam.
- **R3.** A lista de parceiros continua para quem usa: as duas telas de Comissões, Propostas e Fornecedores.

## 6. Frontend

✅ Na `develop` e na `main` (av-hub #321 e #322):
- saem as quatro páginas, o BFF `/api/produtos` e a escrita de `/api/parceiros`;
- a lista de parceiros exige as telas de Comissões: `av-hub` `app/api/parceiros/route.ts:7` (`tela: ['blacklist-clientes', 'regras-comissoes-fixas']`);
- as famílias de produto exigem só o Catálogo: `app/api/familias/route.ts:25` (`requirePermission('catalogo-produtos'`);
- `components/Configuracoes/ParametrosCusto.tsx` fica no código, sem página, porque duas branches abertas mexem nele (BL-084).

## 7. Backend

✅ Na `develop` e na `main` (`api-acos-vital` `b9a46a1`): a lista `TELAS_MODULO`, que diz quais telas contam para o módulo Comercial, perdeu `parametros-custo` e ficou com 18 telas: `src/schemas/core_comercial/capacidades.js:23` (`As 18 telas do módulo`). Nenhuma regra nova: a autorização continua lendo o mapa de rotas.

## 8. API

✅ Na `develop` e na `main` (`api-acos-vital` `b9a46a1`), só na documentação (swagger); nenhuma rota sai do código:
- `GET` e `PUT /comercial/parametros_custo` documentam o 403 `ROTA_SEM_PERMISSAO_MAPEADA` a qualquer usuário com token; mudar os parâmetros passa a ser SQL do Gustavo, por `core_comercial.fn_parametros_custo_salvar`: `src/schemas/core_comercial/aggregates/cadastros/cadastros.swagger.json:918` (`desde o SQL-024 (18/11/2026) a rota não tem tela no mapa`) e `:1029` (`desde o SQL-024 (18/11/2026) a rota não tem tela no mapa`);
- `GET /produtos/duplicatas` continua, liberada pela mesma permissão do `GET /produtos`, agora documentada como `compras` ou `catalogo-produtos`: `src/schemas/core/tables/produtos/produtos.swagger.json:724` (`compras ou catalogo-produtos, pode_visualizar`).

As rotas de escrita (`POST /parceiros`, `PUT`/`DELETE /parceiros/*`, `POST /produtos`, `PUT`/`DELETE /produtos/*`) e `GET`/`PUT /comercial/parametros_custo` ficam sem tela no mapa: com token de usuário, respondem 403; sem token (MES, pipeline), nada muda.

## 9. Banco (SQL)

- **Arquivo:** `docker-teste/migrations/2026-11-18_tirar_parceiros_produtos_parametros.sql` (fora do vault). **Quem aplica:** Gustavo, depois do deploy do Hub.
- **Passos:**
  1. `GET /parceiros` ganha as telas `blacklist-clientes`, `regras-comissoes-fixas`, `propostas` e `fornecedores` (`observacao` começa com `SQL-024:`);
  2. trava: nenhuma tela que fica está dentro de uma que sai;
  3. saem as linhas do mapa de rotas das quatro telas;
  4. saem as telas (as permissões vão pela FK com CASCADE).
- **Conferência antes:** o arquivo traz a consulta de uso das rotas que ficam sem tela, por chave de serviço, e a dos perfis que perdem as telas.
- **Testado no Docker em 18/11:** saíram as 4 telas e as 10 linhas de rota; `GET /parceiros` ficou com as 4 telas; rodar de novo não muda nada.
- **Volta:** pela `auth.auditoria`, como no `SQL-023`.

## 10. Permissões e perfis

Quem tinha as telas perde o menu delas; nenhum outro acesso muda. Quem usa a lista de parceiros em Comissões, Propostas ou Fornecedores continua usando, pela tela em que está.

## 11. Integrações afetadas

MES e pipeline: nenhuma (chamam sem token).

## 12. Critérios de aceite

- [x] **Frontend:** as quatro páginas saíram da `develop` e da `main`; a lista de parceiros exige as telas de Comissões.
- [ ] **Banco:** as quatro telas não existem mais em `auth.telas`, e `GET /parceiros` tem as quatro telas novas no mapa.
- [ ] **Uso:** em Comissões, a Blacklist de clientes e as Regras de comissões fixas continuam achando o cliente.

## 13. Como testar

Depois do SQL, entrar com um perfil de Comissões sem a tela Parceiros e escolher um cliente na Blacklist de clientes: a lista tem de vir. Abrir uma proposta com cliente: o cliente tem de carregar.

## 14. Ordem de implementação e responsáveis

1. Nathan: o Hub (feito, #321 e #322).
2. Gustavo: o SQL, no tst e em produção, depois do deploy.

## 15. Riscos, rollback e perguntas em aberto

- **Risco:** alguém chamar com token uma rota de escrita de parceiro ou produto (passa a 403). A conferência de uso do arquivo mostra se alguma chave de serviço chamou nos últimos 30 dias.
- **Rollback:** pela `auth.auditoria`; no Hub, reverter o #321.

## 16. Impacto no vault quando for entregue

- [[Telas-e-Experiencia-do-Usuario]]: a linha de Parâmetros de custo.
- **Status do contrato:** `implementado-na-develop` quando o SQL estiver no tst.
