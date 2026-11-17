---
id: LOG-61
titulo: Central de Avisos do Hub — uma caixa de avisos por pessoa, para todos os módulos
status: proposta
autor: Nathan
data: 2026-11-17
camadas: [frontend, backend, api, sql]
donos: {frontend: Nathan, backend: Gustavo, api: Gustavo, sql: Gustavo}
nos_0b: [B3, B4]
notas_afetadas: [02-Orcamento-Base-de-Preco, Telas-e-Experiencia-do-Usuario, Registro-N16-167-em-diante]
depende_de: [LOG-60]
decisoes: [N16-175, N16-58, N16-172]
develop-conferida: [api-acos-vital 96e83de, av-hub 4cce84b, em 2026-11-17]
tags: [contrato, avisos, notificacoes, sino, transversal, orcamento]
criado: 2026-11-17
estado-em: 2026-11-17
dono: Nathan
fontes: [conversa do Nathan com o Claude de 17/11/2026 (o sininho do Pablo, opções de entrega), av-hub develop 4cce84b, api-acos-vital develop 96e83de, módulo de teste do Pablo (f7d8d7f:api-comercial/prisma/models/infra.prisma, model Notificacao; api-comercial/src/modules/notificacoes/notificacoes.routes.ts)]
---

# LOG-61 · Central de Avisos do Hub

> **Situação em 17/11:** 📝 proposta. Nada na `develop`.
> - O sino do Pablo está desligado: `av-hub` `components/Layout/AppLayout/Menu/Menu.tsx:54` (`const MOSTRAR_SINO = false;`).
> - As rotas `/notificacoes` do BFF respondem 503: `app/api/comercial/[...rota]/route.ts:156` (`padrao: '/notificacoes'`).

## 1. Resumo em linguagem simples

O Hub ganha **uma caixa de avisos por pessoa**, para todos os módulos. Quando acontece algo que pede a ação de alguém, essa pessoa recebe um aviso no sino do topo da tela, com o link direto para onde agir.

Exemplos:
- o Orçamento respondeu o pedido de custo do vendedor;
- chegou um pedido de custo novo para o Orçamento.

O aviso nasce junto com o fato, só chega para quem pode abrir o link e junta os repetidos. A pessoa pode desligar os tipos que não quer. O Orçamento é o primeiro a usar; os outros módulos entram depois, sem mudar a estrutura.

## 2. Contexto: o que deve ser feito e por quê

- **O problema hoje.** Quem espera uma resposta só sabe que ela chegou se abrir a tela. O vendedor que pediu custo ao Orçamento não é avisado da resposta, e o orçamentista não é avisado do pedido novo. Cada módulo inventou o seu jeito:
  - Compras tem a caixa `core_vendas_faturamento.avisos_mes_compra` (LOG-58);
  - a proposta, o Compras e a divergência guardam eventos próprios (`propostas_eventos`, `requisicoes_compra_eventos`, `divergencias_compra_eventos`).
- **O sino do Pablo** existia só no módulo de teste (`f7d8d7f:api-comercial`). Tinha problemas:
  - a tabela era do Comercial (`core_comercial.notificacoes`);
  - o tipo era texto livre, sem regra de quem recebe;
  - não conferia permissão nem juntava repetidos;
  - não tinha preferências;
  - guardava só "lida sim/não".

  O módulo saiu do av-hub em 06/11 (PR #261). O sino ficou no código, desligado.
- **De onde vem.** Pedido do Nathan em 17/11/2026: "criar algo melhor, bem estruturado" para o aviso ao vendedor, que é o item 3 do que falta no Orçamento depois do `LOG-60`.
- **Se não for feito.** O pedido de custo depende de alguém lembrar de abrir a tela, e o tempo de resposta cronometrado (N16-58) cresce por esquecimento, não por falta de fornecedor.

## 3. Onde fica no fluxo

- Transversal: vale para todas as raias.
- Primeiro uso nos nós `B3` e `B4` (pedido de custo) de [[02-Orcamento-Base-de-Preco]].
- A tela entra em [[Telas-e-Experiencia-do-Usuario]].

## 4. Como está hoje

| Camada | Na `develop` |
|---|---|
| Banco | 🔴 Nenhuma tabela de aviso geral. Há a caixa de Compras `core_vendas_faturamento.avisos_mes_compra` (LOG-58) e as tabelas de eventos de cada assunto |
| API | 🔴 Sem `/notificacoes`. O router `/me` já existe (`src/schemas/auth/index.js:56`) e fica fora do mapa de telas (`src/utils/acessoConfig.js:72`, `ROTAS_SEM_PERMISSAO_DE_TELA`) |
| BFF | 🔴 `/notificacoes` responde 503 (`app/api/comercial/[...rota]/route.ts:156`, `padrao: '/notificacoes'`) |
| Tela | 🟡 O sino existe (`components/Layout/AppLayout/Menu/SinoNotificacoes.tsx`, com consulta a cada 60 s, `INTERVALO_MS = 60_000`), mas está desligado |

## 5. Regras de negócio

- **R1.** Um aviso é **uma linha por destinatário**. Cada pessoa vê só os seus avisos e marca só os seus como lidos.
- **R2.** O aviso nasce **na mesma transação** do fato que o gera, pela função do banco `core.fn_notificar`. Se a ação falha, não existe aviso; se a ação vale, o aviso existe.
- **R3.** Todo aviso tem um **tipo do catálogo** (`core.notificacao_tipos`). O tipo diz:
  - o módulo;
  - o texto;
  - a **tela e a ação** que a pessoa precisa ter;
  - se vem ligado por padrão;
  - se é crítico.

  Tipo fora do catálogo é recusado.
- **R4.** **Permissão:**
  - na criação, só recebe quem tem a tela do tipo;
  - na leitura, a API confere de novo: quem perdeu o acesso para de ver o aviso, que não é apagado.
- **R5.** **Agrupamento:** avisos com a mesma `chave_agrupamento`, não lidos e do mesmo destinatário viram um só. O contador sobe e a data vai para a mais nova. Exemplo: "5 pedidos de custo novos".
- **R6.** **Preferência:** a pessoa desliga um tipo para si. O tipo crítico não pode ser desligado. Desligado, o aviso não é criado para ela.
- **R7.** **Estado:** guarda `lida_em` e `arquivada_em`, e não um sim/não. Abrir o aviso marca como lido. Arquivar tira da lista do sino, mas o aviso continua no histórico.
- **R8.** **Limpeza:** avisos lidos ou arquivados com mais de 90 dias são apagados por rotina.
- **R9.** **Entrega pela consulta à API (N16-175):**
  - a tela pergunta o resumo a cada 30 a 60 s, só com a aba visível;
  - se nada mudou, a API responde 304;
  - **webhook não serve**, porque o navegador não recebe chamada de servidor;
  - **WebSocket é demais** para o tamanho do Hub;
  - SSE e e-mail ou Teams entram depois, lendo a mesma tabela, sem mudar os módulos que criam avisos (seção 15).
- **R10.** O aviso **nunca leva dado sensível no texto**: nada de preço, custo ou margem no título. O detalhe fica na tela do link, que confere a permissão.

## 6. Frontend

**Sistema:** av-hub.

| Peça | O que faz |
|---|---|
| **Sino** (topo do layout, para todos) | Mostra o número de não lidos (mais de 99 vira "99+"). Consulta `GET /api/avisos/resumo` a cada 45 s, só com a aba visível. Usa `If-None-Match`; com 304, não muda nada |
| **Lista do sino** | Os 20 mais recentes não arquivados, em "Hoje" e "Antes". Cada linha traz ícone do módulo, título, resumo e tempo ("há 5 min"), e quando há agrupamento o contador ("5 pedidos…"). Tem "Marcar todas como lidas" e "Ver todos" |
| **Clique no aviso** | Marca como lido e abre o `link` |
| **Página Avisos** (`/avisos`) | Histórico completo, com filtros por módulo e por lidos e não lidos. Arquivar e marcar como lido em lote. Paginação e filtros na URL (padrão `interface-hub`) |
| **Preferências** (aba da página Avisos) | Lista os tipos que a pessoa pode receber, com liga/desliga. Os críticos aparecem travados |

- **Estados:**
  - sem avisos: "Nada por aqui";
  - erro: o sino mantém o último número, sem toast;
  - sem login: não aparece.
- **BFF:** rotas próprias em `app/api/avisos/**`, só com a sessão, sem tela. Elas repassam o Bearer, e quem filtra é a API (R1, R4). Saem as linhas `/notificacoes` de `app/api/comercial/[...rota]/route.ts` e o `services/comercial/notificacoes.ts`. O `SinoNotificacoes.tsx` é reescrito (BL-084: conferir as branches antes de apagar).

## 7. Backend

- **Repositório:** `api-acos-vital`, no padrão novo (`asyncHandler`, `ErroHttp`, zod), dentro do router `/me`, que já fica fora do mapa de telas. A permissão de cada aviso é conferida pelo catálogo (R4).
- **Quem cria avisos:** a função `core.fn_notificar`, chamada dentro da transação da ação.
  - Pode ser chamada por função do banco, por exemplo dentro de uma `fn_*` do Comercial.
  - Ou pelo código da rota, com o mesmo `transaction`.
- **Primeiros chamadores:** as rotas de `solicitacoes_custo` do `LOG-60` (seção 11).
- **Rotina diária:** a limpeza da R8, junto da rotina de limpeza de `auth.logs` que já existe (`src/utils/logCleanup.js`).
- **Auditoria:** criar aviso não vai para `auth.auditoria`, porque é efeito da ação, que já é auditada. Marcar como lido e arquivar também não vão.

## 8. API

| Método | Rota | Para quê |
|---|---|---|
| GET | `/me/avisos/resumo` | `{ nao_lidos, versao }`, com `ETag` = versão; `If-None-Match` igual responde **304** |
| GET | `/me/avisos?situacao=nao_lidos\|todos\|arquivados&modulo=&page=&limit=` | Lista no envelope do hub (`{ total, page, totalPages, limit, avisos }`) |
| POST | `/me/avisos/:id/lido` | Marca como lido (idempotente: de novo, 200 sem mudar `lida_em`) |
| POST | `/me/avisos/ler-todos` | `{ modulo? }`; responde `{ atualizados }` |
| POST | `/me/avisos/:id/arquivar` | Arquiva (idempotente) |
| GET | `/me/avisos/preferencias` | Os tipos que a pessoa pode receber, com `ligado`, `critico` e `modulo` |
| PUT | `/me/avisos/preferencias` | `{ tipo, ligado }`; tipo crítico desligado dá 409 `TIPO_CRITICO` |

- **Aviso na lista:** `{ id, tipo, modulo, titulo, resumo, link, entidade, id_entidade, quantidade, criada_em, atualizada_em, lida_em, arquivada_em }`.
- **`versao`:** o maior `atualizada_em` dos avisos da pessoa, mais a contagem. Muda quando chega aviso novo ou quando a pessoa lê ou arquiva um.
- **Erros:**
  - 401 sem token;
  - 404 `NAO_ENCONTRADO` para aviso de outra pessoa (não revela que existe);
  - 400 para tipo fora do catálogo nas preferências.

## 9. Banco (SQL)

Schema `core`, porque é de todos os módulos. A migration é proposta para o Gustavo.

- **`core.notificacao_tipos`** (catálogo)
  - Colunas: `slug` (PK, ex.: `orcamento.pedido_respondido`), `modulo`, `titulo_modelo`, `slug_tela`, `acao` (o par tela e ação que o destinatário precisa ter), `ligado_por_padrao`, `critico`, `ativo`.
  - Carga inicial: os tipos da seção 11.
- **`core.notificacoes`**
  - Colunas: `id` (uuidv7), `id_usuario` (FK `auth.usuarios`), `tipo` (FK `notificacao_tipos`), `titulo`, `resumo`, `link` (caminho do Hub, começa com `/`), `entidade`, `id_entidade`, `chave_agrupamento`, `quantidade` (padrão 1), `criada_em`, `atualizada_em`, `lida_em`, `arquivada_em`.
  - Índices:
    - `(id_usuario, arquivada_em, atualizada_em DESC)`;
    - parcial `(id_usuario) WHERE lida_em IS NULL AND arquivada_em IS NULL`, para a contagem do sino;
    - único parcial `(id_usuario, chave_agrupamento) WHERE lida_em IS NULL AND arquivada_em IS NULL`, que é o que garante o agrupamento da R5.
  - CHECK: `link ~ '^/'` e `quantidade >= 1`.
- **`core.notificacao_preferencias`**
  - `(id_usuario, tipo)` PK, com a coluna `ligado`.
- **`core.fn_notificar(p_tipo text, p_destinatarios uuid[], p_titulo text, p_resumo text, p_link text, p_entidade text, p_id_entidade uuid, p_chave text)`**, que para cada destinatário:
  - confere a tela e a ação do tipo (`auth.fn_me_permissoes` ou a mesma regra de `auth.permissoes`);
  - aplica a preferência (o tipo crítico ignora);
  - faz o `INSERT … ON CONFLICT` no índice de agrupamento, com `quantidade + 1`, novo `atualizada_em`, título e resumo novos;
  - devolve quantos avisos criou ou atualizou.
- **`core.fn_destinatarios_por_tela(p_slug text, p_acao text) returns uuid[]`**: quem tem a tela e a ação. É o "avisar o setor" (ex.: todos com `painel-comprador:pode_editar`).
- **Desfazer (down):** `DROP FUNCTION` das duas funções e `DROP TABLE` das três tabelas. Não há dado de outro módulo dependendo delas.

## 10. Permissões e perfis

- Não há tela nova no mapa de telas. As rotas ficam em `/me`, e cada um vê os próprios avisos.
- Quem recebe é decidido pela tela e pela ação de cada tipo (R3, R4). Admin (Dev) não é ator: recebe só pelas telas que tem.

## 11. Integrações afetadas

**Primeiros tipos (Orçamento, `LOG-60`):**

| Tipo | Quando | Para quem | Link | Agrupa por |
|---|---|---|---|---|
| `orcamento.pedido_novo` | `POST /comercial/solicitacoes_custo` | `fn_destinatarios_por_tela('painel-comprador','pode_editar')` | `/orcamento/painel-comprador` (a fila) | `orcamento.pedido_novo` (vira "N pedidos de custo novos") |
| `orcamento.pedido_respondido` | `…/responder` com cotação | quem pediu | `/orcamento/painel-comprador/<id>` | o id do pedido |
| `orcamento.pedido_sem_fornecedor` | `…/responder` sem fornecedor | quem pediu | o pedido | o id do pedido |
| `orcamento.pedido_cancelado` | `…/cancelar` feito pelo Orçamento (não por quem pediu) | quem pediu | o pedido | o id do pedido |

**Depois, sem mudar a estrutura** (cada um com contrato ou task própria):
- proposta aguardando aprovação;
- compra acima do cotado para o vendedor aprovar (`LOG-57`);
- aviso do MES ao Compras (`LOG-58`, hoje em `avisos_mes_compra`): pode passar a gerar aviso, além da caixa que já existe.

**MES, Omie e pipeline:** nada muda.

## 12. Critérios de aceite

- [ ] **Banco:**
  - as três tabelas e as duas funções existem;
  - `fn_notificar` para quem não tem a tela não cria aviso;
  - chamar duas vezes com a mesma chave sobe `quantidade` para 2;
  - tipo desligado não cria aviso.
- [ ] **API:**
  - o resumo responde 304 com o `If-None-Match` igual;
  - aviso de outra pessoa dá 404;
  - desligar tipo crítico dá 409;
  - quem perdeu a tela deixa de ver o aviso.
- [ ] **Orçamento:**
  - responder um pedido gera o aviso para quem pediu, na mesma transação: se o `UPDATE` falha, não há aviso;
  - pedido novo gera "N pedidos de custo novos" para o setor.
- [ ] **Frontend:**
  - o sino aparece para todos, com contagem;
  - clicar marca como lido e abre o link;
  - a página `/avisos` filtra, arquiva e marca em lote;
  - as preferências travam os críticos;
  - o sino não consulta com a aba escondida;
  - o BFF `/notificacoes` antigo saiu.

## 13. Como testar

1. **Caminho feliz:**
   1. O vendedor pede custo: o orçamentista vê "1 pedido de custo novo".
   2. Outro vendedor pede: o mesmo aviso passa a "2 pedidos de custo novos".
   3. O orçamentista responde: o vendedor vê "Pedido PC-… respondido" e o link abre o pedido com a resposta.
2. **Erro:** forçar falha no `UPDATE` do responder (por exemplo, pedido já fechado). Não aparece aviso.
3. **Limites:**
   - o vendedor desliga `orcamento.pedido_cancelado` e não recebe mais esse aviso;
   - o perfil perde `painel-comprador`, e os avisos de pedido novo somem do sino;
   - 200 avisos não lidos: o sino mostra "99+" e a contagem responde rápido (índice parcial).

## 14. Ordem de implementação e responsáveis

1. **Banco** (Gustavo): tabelas, catálogo inicial e as duas funções.
2. **API** (Gustavo): rotas `/me/avisos`, mais a limpeza diária.
3. **Chamadores do Orçamento** (Nathan, nas rotas do `LOG-60`): `fn_notificar` nas quatro ações da seção 11.
4. **Front** (Nathan): sino novo, página Avisos e preferências. Sai o BFF antigo.
5. **Outros módulos:** cada um chama `fn_notificar` quando o seu contrato pedir. Robert para a proposta, Gustavo para Compras e MES.

## 15. Riscos, rollback e perguntas em aberto

- **Risco: aviso demais.** Mitigado pelo agrupamento (R5), pela preferência (R6) e pela regra de só avisar quem precisa agir.
- **Risco: carga.** Com dezenas de usuários a cada 45 s e 304 quando nada muda, a carga é pequena. A contagem usa o índice parcial.
- **Rollback:** desligar o sino na tela (como hoje) e rodar o down da seção 9. Os módulos que chamam `fn_notificar` precisam do down junto, ou de uma guarda (`to_regprocedure`).
- **Próximos passos registrados (não fazem parte deste contrato):**
  - **SSE**: o aviso chega na hora, pelo `LISTEN/NOTIFY` do Postgres, sem mudar as tabelas;
  - **e-mail e Teams** para tipos marcados, lendo a mesma tabela;
  - **Web Push** com a aba fechada.
- ❓ O `LOG-58` (avisos do MES ao Compras) deve migrar para a central ou continuar com a caixa própria e só gerar aviso? Proposta: continuar e gerar aviso.
- ❓ Prazo de guarda: 90 dias está bom para os lidos?

## 16. Impacto no vault quando for entregue

- [[02-Orcamento-Base-de-Preco]]: o aviso ao vendedor (item 3 do que falta depois do `LOG-60`) passa a ✅.
- [[Telas-e-Experiencia-do-Usuario]]: a Central de Avisos entra no mapa das telas, como peça transversal.
- [[Onde-Estamos]].
