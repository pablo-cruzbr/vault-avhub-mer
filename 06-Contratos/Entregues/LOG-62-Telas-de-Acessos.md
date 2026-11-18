---
id: LOG-62
titulo: Redesenho das telas de Acessos (Perfis, Pessoas e Telas)
status: implementado-na-develop
autor: Nathan
data: 2026-11-18
camadas: [frontend, backend, api, sql]
donos: {frontend: Nathan, backend: Nathan, api: Nathan, sql: Gustavo}
nos_0b: []
notas_afetadas: [RBAC-e-Permissoes, Banco-AvHub, Telas-e-Experiencia-do-Usuario]
depende_de: [SQL-023]
decisoes: [N16-178, N16-177]
develop-conferida: [api-acos-vital a6eee9d, av-hub 22ccece, em 2026-11-18, entrega (também na main: api-acos-vital #318 d282db3, av-hub #315 9f8f10a); api-acos-vital 68bbe9c, av-hub 718b41b, em 2026-11-18]
tags: [contrato, rbac, permissoes, telas, acessos, perfis, usuarios]
criado: 2026-11-18
estado-em: 2026-11-18
dono: Nathan
fontes: [conversa do Nathan com o Claude de 18/11/2026 (redesenho das telas de Acessos e o protótipo no artifact "Acessos do Hub (redesenho)"), mapa das 9 telas de Cadastros › Acessos lido na develop do av-hub 718b41b e da api-acos-vital 68bbe9c, banco do Docker local com os dados do tst (docker-teste, fora do vault), SQL-023-Limpeza-das-Telas-Antigas, RBAC-e-Permissoes, conversa do Nathan com o Claude de 18/11/2026 à tarde (P1 e P2, testes no tst), av-hub PR #314 e releases #315 e api-acos-vital #318]
---

# LOG-62 · Redesenho das telas de Acessos

> **Situação em 18/11:** ✅ implementado na `develop` e levado à `main`; o Gustavo aplicou o SQL no tst e em produção.
> - API (Gustavo, `a6eee9d`, release #318): o módulo é montado com token obrigatório em `api-acos-vital` `src/schemas/auth/index.js:60` (`path: "/acessos"`). Troca do conjunto inteiro: `src/schemas/auth/aggregates/acessos/acessos.perfis.route.js:207` (`router.put("/perfis/:id/permissoes"`). Ação que a tela não usa: `src/schemas/auth/aggregates/acessos/acessos.regras.js:119` (`codigo: "ACAO_NAO_USADA"`). Slug em uso: `src/schemas/auth/aggregates/acessos/acessos.telas.route.js:136` (`"SLUG_EM_USO"`). O que a pessoa acessa: `src/schemas/auth/aggregates/acessos/acessos.pessoas.route.js:92` (`router.get("/pessoas/:id"`). Último acesso no login: `src/schemas/auth/aggregates/autenticacao/autenticacao.route.js:53` (`async function registrarAcesso`).
> - Telas (Nathan, av-hub #314 `22ccece`, release #315): o BFF em `av-hub` `app/api/acessos/[...rota]/route.ts:9` (`const ROTAS: RotaComercial`). Perfis: `components/Acessos/PerfisLista.tsx:29` (`export default function PerfisLista`) e `components/Acessos/PerfilPagina.tsx:26` (`export default function PerfilPagina`), com a aba `components/Acessos/AbaTelasAcoes.tsx:23` (`export default function AbaTelasAcoes`) e o resumo antes de salvar em `components/Acessos/ConfirmarMudancasDialog.tsx:11` (`export default function ConfirmarMudancasDialog`). Pessoas: `components/Acessos/PessoasLista.tsx:36` (`export default function PessoasLista`) e `components/Acessos/PessoaPagina.tsx:19` (`export default function PessoaPagina`). Telas: `components/Acessos/TelasDoMenu.tsx:22` (`export default function TelasDoMenu`). Permissões redireciona: `app/(protected)/cadastros/acessos/permissoes/page.tsx:5` (`redirect('/cadastros/acessos/perfis')`).
> - Testado no tst em 18/11, com perfil, pessoa e telas criados só para o teste e apagados no fim: copiar perfil, ligar ações e salvar, dados do perfil, pôr e tirar pessoa, unidade, desativar e reativar, ordem, nome e slug com confirmação; e os erros `ACAO_NAO_USADA`, `TELA_INICIAL_FORA_DO_PERFIL`, `ESCOPO_INVALIDO` e `PERFIL_JA_EXISTE`.
> - Diferenças do desenho:
>   - sem "Redefinir senha": a API só troca a própria senha (BL-109);
>   - criar pessoa, desativar, unidades, funcionário e "Nova tela" usam as rotas antigas (`/usuarios`, `/telas`), porque `/acessos/*` não tem essas escritas;
>   - "o que acessa" esconde os grupos do menu no Hub, `lib/domain/acessos-pessoas.ts:115` (`export function semGrupos`), com `GAMBIARRA(vault LOG-62)`, até a API marcar os grupos (BL-108);
>   - a tela fora do menu só aparece no perfil que já a tem; "Fica em" só grava com o botão Mover.
> - 🔴 A P2 não entrou no SQL do tst: `custo-item` ainda é tela comum (BL-110).

## 1. Resumo em linguagem simples

Dar acesso a uma pessoa no Hub passa hoje por quatro telas (Usuários, Usuários × Perfis, Perfis e Permissões), sem link entre elas, e cada tela mostra quatro interruptores mesmo quando só um faz efeito. O redesenho troca isso por **duas páginas que se completam**: a do **perfil** (as telas e as ações que ele libera, as pessoas dele e os dados dele) e a da **pessoa** (perfis, unidades, ligações e tudo o que ela acessa). A tela **Telas** fica só para o administrador. Vendedores, Compradores, Auxiliares e Diligenciadores vão para um grupo próprio, **Cadastros › Vínculos**, e o redesenho deles fica para a segunda etapa.

O protótipo clicável está no artifact "Acessos do Hub (redesenho)", do Nathan, com 6 telas: antes e depois, lista de perfis, página do perfil, página da pessoa, lista de pessoas e Telas.

## 2. Contexto: o que deve ser feito e por quê

- **O problema:** o mapa das 9 telas de Cadastros › Acessos (18/11/2026) achou:
  - quatro telas para dar acesso a uma pessoa, sem link entre elas;
  - os mesmos interruptores (Visualizar, Criar, Editar e Deletar) em toda tela, mesmo onde a tela só tem rota de leitura. O "Aprovar" aparece só em duas telas, fixas no código: o `BulkPermissaoModal.tsx` da tela Permissões tinha `const TELAS_COM_APROVACAO = new Set(['compras', 'solicitacoes-de-vagas']);` (av-hub `718b41b`; o arquivo saiu no #314). O "Exportar" não aparece em lugar nenhum, e o BFF descarta o campo: `app/api/permissoes/bulk/route.ts:6` (`const CAMPOS_ACAO = ['pode_visualizar', 'pode_criar', 'pode_editar', 'pode_deletar'] as const;`);
  - o alcance de vendedores do perfil (`auth.perfis.escopo_vendedores`: todos, vinculados ou só os próprios), que decide o que o vendedor vê, não aparece nem se edita;
  - números errados acima de 200 linhas: as telas pedem `limit: 1000`, e a API corta em 200. Por exemplo, a página Permissões pedia `getPermissoes({ limit: 1000 })` (av-hub `718b41b`; a página virou um redirect no #314) contra `api-acos-vital` `src/utils/pagination.js:6` (`maxLimit = 200`);
  - Usuários × Perfis mostra códigos, porque a API devolve só os IDs: `src/schemas/auth/tables/usuarios_perfis/usuarios_perfis.route.js:26` (`router.get("/", async (req, res) => {`);
  - campos que ficam vazios sem aviso quando quem cadastra não tem a tela de Funcionários, Unidades ou Vendedores.
- **Quem sofre:** quem cadastra acesso (o Nathan e o Gustavo) e quem recebe acesso errado ou a mais.
- **De onde vem:** pedido do Nathan de 18/11/2026, depois da limpeza das telas antigas (`SQL-023`, N16-177). As escolhas estão na N16-178.
- **Se não for feito:** o acesso continua sendo dado por tentativa, com interruptores sem efeito e configurações escondidas.

## 3. Onde fica no fluxo

É transversal, sem nó do 0b. Notas afetadas: [[RBAC-e-Permissoes]], [[Banco-AvHub]] (schema `auth`) e [[Telas-e-Experiencia-do-Usuario]] (o menu de Cadastros).

## 4. Como está hoje

- **Hub (`av-hub` `718b41b`):** 9 telas em `app/(protected)/cadastros/acessos/`. As maiores passam do limite de ~400 linhas do projeto: `usuarios` 577, `telas` 508, `diligenciadores` 502. Vendedores e Compradores já usam o painel lateral novo (`components/Acessos/PainelVinculo.tsx`). Auxiliares, Diligenciadores e Usuários × Perfis usam os modais antigos.
- **API (`api-acos-vital` `68bbe9c`):**
  - `/perfis`, `/telas`, `/permissoes` (com `POST /permissoes/lote`, que já aceita as 6 ações), `/usuarios`, `/usuarios/:id/unidades` e `/usuarios_perfis`;
  - `GET /me/permissoes` lê `auth.fn_me_permissoes`, que soma as ações dos perfis do usuário e ignora tela desativada: `src/schemas/auth/aggregates/me/me.route.js:15` (`SELECT auth.fn_me_permissoes(:u) AS dados`).
- **O que não existe na API:**
  - nenhuma rota lê `auth.rotas_telas`; a tabela só é lida pela autorização (`auth.fn_autorizar`);
  - não há como editar `auth.perfis.escopo_vendedores`: o model de perfis não tem a coluna (`src/schemas/auth/tables/perfis/perfis.model.js`);
  - não há data de último acesso em `auth.usuarios`.
- **Banco (tst):** 41 usuários, 22 perfis (3 sem ninguém), 85 telas depois do `SQL-023`, 1,3 perfil por pessoa em média. No mapa de rotas, 66 telas usam "ver", 36 "criar", 38 "editar", 31 "excluir", 3 "aprovar" e nenhuma "exportar".
- **Telas que são uma ação de outra:** `propostas-valores` e `propostas-delegacao` (de Propostas), `torre-fluxo-trilha` (da Torre de Fluxo) e `pedidos-venda-financeiro` (conta corrente do pedido). Hoje aparecem como telas soltas.

## 5. Regras de negócio

- **R1.** O acesso se dá no **perfil**, nunca direto na pessoa. A pessoa recebe a soma dos perfis dela (N16-178).
- **R2.** Na página do perfil, cada tela mostra **só as ações que ela usa**: as ações das rotas ativas dela em `auth.rotas_telas`. Uma ação sem rota não aparece. Exceção: "ver" aparece sempre, porque libera a tela no menu.
- **R3.** "Exportar" e "Aprovar" aparecem pelo mesmo critério da R2. Acaba a lista fixa do Hub.
- **R4.** As telas que são uma ação de outra aparecem **dentro da tela dona**, com rótulo de ação: "Ver valores" e "Delegar" em Propostas, "Ver a trilha" na Torre de Fluxo e "Conta corrente" em Pedidos de venda. Por dentro continuam sendo telas, para nada mudar na autorização.
- **R5.** O alcance de vendedores do perfil é editável em "Dados do perfil": Todos, Vinculados ou Só os próprios.
- **R6.** A tela inicial do perfil só pode ser uma tela que o perfil libera.
- **R7.** O slug da tela fica travado. Trocar exige confirmar, depois de a tela mostrar quantas rotas e perfis dependem dele.
- **R8.** Toda lista e todo número vêm prontos da API, sem `limit: 1000` no Hub. Filtro, busca, contagem e paginação são da API (regra do projeto).
- **R9.** "Copiar perfil" cria um perfil novo com as mesmas permissões, sem as pessoas.
- **R10.** A página da pessoa mostra o que ela acessa e de qual perfil vem cada tela. Para mudar, muda-se o perfil.
- **R11.** O grupo Vínculos (Vendedores, Compradores, Auxiliares e Diligenciadores) só muda de lugar no menu nesta etapa.

## 6. Frontend

**Sistema:** av-hub (HUB). Segue a skill `interface-hub`: lista com página de URL própria para o perfil e para a pessoa, filtros na URL, KPIs que filtram.

| Tela | Rota | O que tem |
|---|---|---|
| **Perfis** | `/cadastros/acessos/perfis` | KPIs: Perfis, Pessoas com perfil, Perfis sem ninguém e Telas no menu. Busca. Tabela com Perfil, Pessoas, Telas, Tela inicial e Vendedores que vê. Botão "Novo perfil". |
| **Página do perfil** | `/cadastros/acessos/perfis/[id]` | Cabeçalho com Copiar perfil e Salvar. KPIs de pessoas, telas liberadas, tela inicial e alcance. Três abas na URL (`?aba=`): **Telas e ações** (árvore do menu, ações como pílulas que ligam e desligam, "só as liberadas", busca por tela); **Pessoas** (lista, adicionar e tirar); **Dados do perfil** (nome, descrição, tela inicial e alcance de vendedores). |
| **Pessoas** | `/cadastros/acessos/pessoas` | KPIs que filtram: Ativas, Sem perfil, Sem funcionário e Inativas. Busca por nome, e-mail ou funcionário. Filtros de perfil e de unidade. Tabela com Pessoa, Perfis, Unidades e Último acesso. Botão "Nova pessoa". |
| **Página da pessoa** | `/cadastros/acessos/pessoas/[id]` | Cabeçalho com Redefinir senha e Desativar. Blocos Perfis (adicionar e tirar), Unidades e Ligações (funcionário; vendedor só para ver, com link para Vínculos; último acesso). Ao lado, a tabela "O que acessa", com Tela, Ações e Vem do perfil. |
| **Telas** (só administrador) | `/cadastros/acessos/telas` | Árvore do menu com reordenação por arrastar. O detalhe da tela mostra nome, onde fica, slug travado (R7), ações usadas (R2), rotas da API e perfis com acesso. |

- **Saem do menu:** Permissões e Usuários × Perfis. As rotas antigas `/cadastros/acessos/permissoes` e `/cadastros/acessos/usuarios-perfis` redirecionam para Perfis e para Pessoas. A rota `/cadastros/acessos/usuarios` redireciona para `/cadastros/acessos/pessoas`.
- **Vínculos:** as quatro telas passam para `Cadastros › Vínculos` no menu (é só `auth.telas.id_parent`, seção 9). As URLs continuam as mesmas nesta etapa.
- **Estados:** esqueleto com a forma da lista ou da árvore; vazio com saída ("Limpar filtros"; perfil sem pessoas: "Adicionar pessoa"); erro que limpa o dado velho. Quem não tem a tela vê "Você não tem acesso a esta tela".
- **Sem dependência escondida:** quem tem Perfis ou Pessoas consegue escolher pessoa, unidade e funcionário sem ter as telas Funcionários, Unidades ou Vendedores. As listas de escolha vêm de rotas próprias (seção 8).
- **Arquivos:** os componentes novos vão para `components/Acessos/`, com o estado em hooks e as funções puras em `lib/domain/acessos-*.ts`, com teste. Nenhum arquivo passa de ~400 linhas.
- **BFF:** rotas próprias em `app/api/acessos/**`, cada uma com `requirePermission` da tela (`perfis`, `usuarios` ou `telas`).

## 7. Backend

- **Repositório:** `api-acos-vital`, módulo novo `src/schemas/auth/aggregates/acessos/` no padrão novo (`asyncHandler`, `ErroHttp`, zod, SQL direto), com `exigirTokenUsuario`.
- **Validações no servidor:**
  - ação marcada que a tela não usa (R2) responde 400 `ACAO_NAO_USADA`;
  - tela inicial fora do perfil (R6) responde 400 `TELA_INICIAL_FORA_DO_PERFIL`;
  - troca de slug sem `confirmar: true` (R7) responde 409 `SLUG_EM_USO`, com a contagem de rotas e perfis.
- **Transação:** salvar as permissões do perfil é uma transação só (troca o conjunto inteiro do perfil). "Copiar perfil" também.
- **Auditoria:** já existe (`trg_auditoria_linha` em `auth.perfis`, `auth.permissoes`, `auth.usuarios_perfis`, `auth.telas` e `auth.usuarios`). Nada novo.
- **Último acesso:** o login grava `auth.usuarios.ultimo_acesso_em` (coluna nova, seção 9).

## 8. API

| Método | Rota | Quem chama | Permissão |
|---|---|---|---|
| GET | `/acessos/perfis` | lista de Perfis | `perfis`: ver |
| GET | `/acessos/perfis/:id` | página do perfil | `perfis`: ver |
| PUT | `/acessos/perfis/:id` | Dados do perfil | `perfis`: editar |
| PUT | `/acessos/perfis/:id/permissoes` | aba Telas e ações | `perfis`: editar |
| POST | `/acessos/perfis/:id/copiar` | Copiar perfil | `perfis`: criar |
| GET | `/acessos/perfis/:id/pessoas` | aba Pessoas | `perfis`: ver |
| POST, DELETE | `/acessos/perfis/:id/pessoas/:id_usuario` | aba Pessoas e página da pessoa | `perfis`: editar, ou `usuarios`: editar |
| GET | `/acessos/pessoas` | lista de Pessoas | `usuarios`: ver |
| GET | `/acessos/pessoas/:id` | página da pessoa | `usuarios`: ver |
| GET | `/acessos/opcoes` | escolhas de pessoa, perfil, unidade e funcionário | `perfis` ou `usuarios`: ver |
| GET | `/acessos/telas` | árvore com as ações usadas | `telas`: ver; `perfis`: ver (sem as rotas) |
| PUT | `/acessos/telas/ordem` | arrastar na árvore | `telas`: editar |

- **`GET /acessos/perfis`:** `?busca=&page=&limit=` (até 200). Resposta:
  ```json
  {"total":22,"page":1,"limit":50,"kpis":{"perfis":22,"pessoas":41,"sem_pessoas":3,"telas_menu":85},
   "perfis":[{"id":"…","nome":"Orçamentos","pessoas":1,"telas":3,"tela_inicial":{"id":"…","nome":"Pedidos de custo"},"escopo_vendedores":"vinculados"}]}
  ```
- **`GET /acessos/perfis/:id`:** devolve o perfil e `telas`, a árvore inteira do menu. Cada tela traz `acoes_usadas` (R2), `acoes_extras` (R4) e o que o perfil tem:
  ```json
  {"id":"…","nome":"Orçamentos","descricao":"…","escopo_vendedores":"vinculados","tela_inicial_id":"…",
   "telas":[{"id":"…","slug":"propostas","nome":"Propostas","id_parent":"…","acoes_usadas":["pode_visualizar","pode_criar","pode_editar"],
     "acoes_extras":[{"slug":"propostas-valores","rotulo":"Ver valores"},{"slug":"propostas-delegacao","rotulo":"Delegar"}],
     "permissao":{"pode_visualizar":true,"pode_criar":false,"pode_editar":false,"pode_deletar":false,"pode_aprovar":false,"pode_exportar":false},
     "extras_liberadas":["propostas-valores"]}]}
  ```
- **`PUT /acessos/perfis/:id`:** `{nome?, descricao?, tela_inicial_id?, escopo_vendedores?}`. O `escopo_vendedores` aceita `todos`, `vinculados` ou `proprios`.
- **`PUT /acessos/perfis/:id/permissoes`:** `{"telas":[{"id_tela":"…","acoes":["pode_visualizar","pode_editar"]}],"extras":["propostas-valores"]}` troca o conjunto inteiro do perfil. Tela fora da lista perde as permissões (a linha é apagada). Repetir a mesma chamada dá o mesmo resultado.
- **`GET /acessos/pessoas`:** `?busca=&perfil=&unidade=&situacao=ativas|inativas|sem_perfil|sem_funcionario&page=&limit=`. Cada pessoa vem com nome, e-mail, `perfis[{id,nome}]`, `unidades[{codigo_empresa,nome_fantasia}]` (vazio = todas), `funcionario{id,nome}` e `ultimo_acesso_em`. Os `kpis` vêm junto.
- **`GET /acessos/pessoas/:id`:** a pessoa, os perfis, as unidades, o funcionário, o vendedor ligado (só leitura) e `acessos[{tela, menu, acoes, perfis_de_origem[]}]`. Os acessos são calculados como no `auth.fn_me_permissoes`, mas guardando de qual perfil vem cada tela.
- **Erros:** 400 `ACAO_NAO_USADA`, `TELA_INICIAL_FORA_DO_PERFIL` e `ESCOPO_INVALIDO`; 404 `PERFIL_NAO_ENCONTRADO` e `PESSOA_NAO_ENCONTRADA`; 409 `PERFIL_JA_EXISTE` (nome repetido) e `SLUG_EM_USO`.
- **As rotas antigas** (`/perfis`, `/permissoes`, `/usuarios_perfis`, `/telas`, `/usuarios`) continuam, porque o MES e os scripts podem usar. O Hub para de usá-las nas telas de Acessos.
- **Mapa de rotas:** as rotas novas entram em `auth.rotas_telas` (seção 9).

## 9. Banco (SQL)

- **Banco e schema:** av-hub, `auth`. **Quem aplica:** Gustavo.
- **Colunas novas:**
  - `auth.telas.acao_de uuid NULL REFERENCES auth.telas(id)` e `auth.telas.rotulo_acao varchar(40) NULL`: a tela que é uma ação de outra (R4) aponta para a dona e diz o rótulo. Carga: `propostas-valores` → `propostas` ("Ver valores"), `propostas-delegacao` → `propostas` ("Delegar"), `torre-fluxo-trilha` → `torre-fluxo` ("Ver a trilha") e `pedidos-venda-financeiro` → `pedidos-equipe` ("Conta corrente"). A dona da conta corrente fica para conferir: **P1**.
  - `auth.usuarios.ultimo_acesso_em timestamptz NULL`: gravada no login.
- **View nova:** `auth.vw_telas_acoes_usadas (id_tela, slug, acoes text[])`, lida das linhas ativas de `auth.rotas_telas`. Sempre inclui `pode_visualizar`.
- **Menu:** um grupo novo `vinculos` ("Vínculos"), filho de `cadastros`. As telas `vendedores`, `compradores`, `auxiliares-vendedor` e `diligenciadores` passam para ele (`id_parent`).
- **Mapa de rotas:** linhas para as rotas da seção 8.
- **Volta:** apagar as colunas novas, a view, o grupo `vinculos` (devolvendo o `id_parent` das quatro telas para `acessos`) e as linhas novas do mapa.

## 10. Permissões e perfis

- **Perfis** exige a tela `perfis`. **Pessoas** exige a tela `usuarios`. **Telas** exige a tela `telas`.
- Quem tem hoje `permissoes` ou `usuarios-perfis` precisa ter `perfis` ou `usuarios`. O SQL confere e acrescenta onde faltar, antes de tirar as duas telas do menu.
- Admin (Dev) não é ator.

## 11. Integrações afetadas

- **MES:** continua lendo as permissões como hoje. As rotas antigas ficam.
- **A autorização da API** (`fn_autorizar`) e o `/me/permissoes`: nenhuma mudança.
- **Omie e pipeline:** nenhuma.

## 12. Critérios de aceite

- [x] **Banco:** as colunas `auth.telas.acao_de` e `rotulo_acao` existem e estão preenchidas nas 4 telas; existem `auth.usuarios.ultimo_acesso_em` e `auth.vw_telas_acoes_usadas`; o grupo Vínculos existe com as 4 telas dentro.
- [x] **API:** as rotas da seção 8 estão na `develop`; `GET /acessos/perfis/:id` devolve `acoes_usadas`; o PUT de permissões recusa ação não usada; as listas paginam na API.
- [x] **Frontend:** as telas Perfis, Pessoas, Telas e as páginas de perfil e pessoa estão na `develop`; Permissões e Usuários × Perfis saíram do menu e redirecionam; nenhuma tela de Acessos pede `limit: 1000`; o `npm run check` passa.
- [x] **Uso:** dar a um vendedor novo o perfil Vendedor, com uma unidade, leva uma página só.

## 13. Como testar

- **Caminho feliz:** abrir o perfil Orçamentos, ligar "Ver" em Solicitações de custo e salvar. A pessoa do perfil passa a ver a tela no menu, e a página dela mostra "Vem do perfil: Orçamentos".
- **Erro principal:** mandar `pode_criar` para Fornecedores (que só usa "ver") dá 400 `ACAO_NAO_USADA`.
- **Limite:** a lista de Pessoas com mais de 200 pessoas pagina certo, e a contagem do perfil bate com a da API.
- **Alcance:** trocar o perfil Vendedor para "Só os próprios" muda o que aparece em Meus Pedidos para quem tem esse perfil.

## 14. Ordem de implementação e responsáveis

1. **Gustavo:** o SQL (seção 9).
2. **Nathan:** a API (seções 7 e 8).
3. **Nathan:** o Hub (seção 6), por partes: Perfis e a página do perfil; depois Pessoas e a página da pessoa; depois Telas.
4. **Segunda etapa, em contrato próprio:** as telas de Vínculos no mesmo padrão de painel.

## 15. Riscos, rollback e perguntas em aberto

- **Risco:** ao trocar o conjunto inteiro de permissões de um perfil, uma tela some sem querer. Por isso a tela mostra o que muda antes de salvar, e a auditoria guarda o antes.
- **Rollback:** o Hub volta para as telas antigas (as rotas antigas da API continuam), e o SQL tem volta (seção 9).
- **P1.** De qual tela a "Conta corrente" (`pedidos-venda-financeiro`) é ação: Pedidos da Equipe, Meus Pedidos ou outra? **Respondida pelo Nathan em 18/11:** de Pedidos da Equipe (`pedidos-equipe`). Está assim no tst; a tela continua desativada até o Hub ter onde trocar a conta.
- **P2.** Quem recebe a tela `custo-item` (quem vê o custo), que em produção só o Admin (Dev) tem (P1 do `SQL-023`). Pode virar ação de uma tela do Orçamento pela R4. **Respondida pelo Nathan em 18/11:** vira a ação "Ver custo" de Propostas (`acao_de` = `propostas`), criada pelo SQL onde não existir (no tst não existia); cada perfil decide se liga. Falta no SQL (BL-110).

## 16. Impacto no vault quando for entregue

- **[[RBAC-e-Permissoes]]:** as telas de Acessos novas, a R2 (ações pelas rotas) e as colunas novas.
- **[[Banco-AvHub]]:** as colunas, a view e o grupo Vínculos.
- **[[Telas-e-Experiencia-do-Usuario]]:** o menu de Cadastros com Acessos e Vínculos.
- **Status do contrato:** `implementado-na-develop`.
