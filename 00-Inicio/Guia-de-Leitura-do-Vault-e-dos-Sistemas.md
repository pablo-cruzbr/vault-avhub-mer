---
tags: [inicio, guia, ia]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Nathan
fontes: [análise do vault de 05/11/2026, Regras-do-Vault, Comece-Aqui, instrução da v3 (07-Desenvolvimento/v3/INSTRUCAO.md, seção 1 e fatos F1 a F5)]
---

# Guia de leitura do vault e dos sistemas (para a IA)

**Em uma frase:** ensina a IA (e qualquer colaborador) a ler o vault e o código dos sistemas na ordem certa, para decidir com o máximo de certeza: o vault explica o que o sistema deve fazer, e o código e o banco provam o que ele faz.

**Quando consultar esta nota:** antes de qualquer análise que cruze o vault com o código, o banco ou as telas. Para o roteiro de 5 minutos de quem chegou agora, veja [[Comece-Aqui]]; para as regras de escrita, [[Regras-do-Vault]].

## Antes de tudo: preparar o ambiente

Faça isto no início de toda sessão, antes de ler ou escrever (é a seção 1 da instrução da v3).

1. **Atualize os seis repositórios.** Em cada pasta, rode `git fetch --all --prune` e anote o commit de `origin/develop` (no vault, o de `origin/main`).
2. **Vault:** traga o remoto com `git pull --ff-only`. Se não for fast-forward, pare e avise; não faça merge nem rebase por conta própria.
3. **Sistemas:** só leitura, sempre pela `origin/develop` (F5). Nunca troque de branch, faça commit ou stash neles. O `omie-elt-pipeline` não tem `develop`: a base é `origin/master`.
4. **Quebra de linha:** no vault, `git config core.autocrlf` tem de ser `false`. O `.gitattributes` exige `eol=lf`.
5. **Obsidian:** antes de mexer em muitas notas de uma vez (renomear, mover, dividir), confirme com o Nathan que o Obsidian está fechado.

**Os cinco fatos que valem (05/11/2026):**

- **F1.** A ordem do vault é a ordem do fluxo do mermaid: as raias vão de `01-Proposta-de-Venda` a `15-Custo-Real-e-Comissao`.
- **F2.** Os contratos da v2 ficaram na v2 (tag `v2-antes-da-v3`); o vault os consulta pelo índice [[Contratos-da-v2]].
- **F3.** O módulo do Pablo (proposta e suprimentos) não tem API nem banco. O que não estiver na `develop` é 🔴 "sem API e sem banco"; o `api-comercial` de teste será removido inteiro.
- **F4.** O Nathan fecha o Obsidian enquanto a IA trabalha em lote.
- **F5.** A base é a `develop` dos sistemas: se está na `develop`, está pronto (✅). A `main` não é critério de pronto; só aparece como informação ("publicado na `main`: sim/não").

## Comando: "atualizar o vault"

Quando o Nathan disser "atualizar o vault" (ou "atualiza o vault", "sincroniza o vault"), siga estes passos, nesta ordem. A base é sempre a `develop` dos sistemas: se está na `develop`, está ok (✅).

**1. Proteja o que é local, no repositório do vault.**

1. `git status --porcelain`: se houver alteração não commitada, liste e pergunte o que fazer. Nunca descarte nada.
2. `git fetch --all --prune`.
3. `git log --oneline @{u}..HEAD`: commits locais que não foram para o remoto. Se houver, liste e pergunte se pode fazer push. Sem "ok", não envie.
4. `git log --oneline HEAD..@{u}`: commits novos no remoto.
5. Se não há nada local pendente, rode `git pull --ff-only`. Se as branches divergiram, pare e avise. Não faça merge nem rebase por conta própria.
6. Se existir a branch `v3` ainda não mergeada, pergunte se a atualização vai para a `main` ou para a `v3`.

**2. Atualize os sistemas (só leitura).**

Faça isto em `api-acos-vital`, `av-hub`, `api-pcp`, `app-pcp` e `omie-elt-pipeline`:

1. `git fetch --all --prune`.
2. Relate, sem mexer, se há alteração não commitada ou commit local sem push na branch atual. É trabalho de alguém.
3. Se a branch atual for `develop`, o working tree estiver limpo e só faltar trazer o remoto, rode `git pull --ff-only`. Fora isso, não troque de branch, não faça commit e não faça stash.
4. Leia sempre pela `origin/develop`, sem checkout. Por exemplo: `git show origin/develop:<arquivo>` e `git grep <termo> origin/develop`. Se o repositório não tiver `develop`, use o ramo principal (`origin/master` no `omie-elt-pipeline`) e avise.

**3. Descubra o que mudou desde a última atualização.**

1. Leia `07-Desenvolvimento/Ultima-Atualizacao-do-Vault.md`, que guarda o commit de `origin/develop` de cada sistema usado na última atualização.
   - Se a nota não existir, use como ponto de partida a data do estado do `Onde-Estamos` (`git log --since=<data> origin/develop`).
2. Em cada sistema, rode `git log --oneline <ultimo>..origin/develop` e `git diff --stat <ultimo> origin/develop`.
3. Ligue cada arquivo alterado à nota do vault que o descreve. Use a tabela nó → raia do `00-Fluxo-Mestre-0b`, as rotas e telas das notas de raia e as notas de sistema (`AV-Hub-API`, `MES-Backend`, etc.).

**4. Mostre o plano antes de escrever.**

Mostre uma lista com:

- o que mudou no código (repositório, commit, arquivo);
- quais notas e selos mudam;
- o que ficou em dúvida.

Espere o "ok" do Nathan.

**5. Atualize e registre.**

1. Crie a branch `docs/atualizacao-AAAA-MM-DD` (padrão do repositório).
2. Faça um commit por nota, seguindo `Regras-do-Vault`.
3. Ajuste os selos pela `develop`, citando repositório, commit e arquivo:linha.
4. Registre cada divergência como `PS` em `Pontas-Soltas`.
5. Atualize `Ultima-Atualizacao-do-Vault` com os novos commits de `origin/develop` e a data.
6. Rode a validação (links resolvem, nenhuma nota órfã).
7. Faça push da branch e abra o PR só quando o Nathan pedir.

## Mapa das pastas

Tudo fica dentro de `C:\Users\nathan.silva\Desktop\Gerenciamento-de-Integracoes`. Essa pasta só agrupa os projetos; o que importa está em cada subpasta.

| Pasta | Grupo | O que é | Onde o vault descreve |
| --- | --- | --- | --- |
| `vault-avhub-mer-v2` | Vault | O manual do fluxo de Atividades (pedido de 0 a 100%) | `Home`, `Comece-Aqui`, `Regras-do-Vault` |
| `api-acos-vital` | ERP | API do av-hub (dono: Gustavo; rotas comerciais com o Robert desde 28/10) | `AV-Hub-API`, `Banco-AvHub` |
| `av-hub` | ERP | Front do av-hub, o HUB em Next.js, com o BFF e a pasta `api-comercial/` (módulo de teste do Pablo, será removido inteiro; não conta como pronto, F3) | `AV-Hub-Front`, `Mapa-Rotas-BFF-Bearer`, `Telas-por-Raia` |
| `api-pcp` | MES | Backend do MES, o sistema de chão de fábrica (dono: Robert) | `MES-Backend`, `Banco-MES` |
| `app-pcp` | MES | Front do MES (dono: Robert) | `MES-Front`, `Estados-e-Status` |
| `omie-elt-pipeline` | Pipeline | Carrega dados do Omie para o Postgres do av-hub | `Pipeline-Omie`, `Omie-Integracao-Estado` |

Os sistemas conversam assim: o av-hub e o MES trocam requisições, OCs e status (`Integracao-AvHub-MES`), e o av-hub fala com o Omie, o ERP externo da empresa (`Estudo-Omie-API`, `Mapa-IncluirPedido-Omie`).

Antes de ler qualquer código, confirme a estrutura real de cada pasta (`README`, `package.json`, `git status`, `git branch`): este guia diz onde olhar, não substitui a conferência.

## Como ler o vault

**Ordem de leitura.** Nunca comece por busca ampla; comece pela porta de entrada e desça.

1. `Comece-Aqui` e `Regras-do-Vault`: ordem de leitura, selos e regras de escrita.
2. `Visao-do-Projeto` e `Sistemas-e-Responsabilidades`: o que é o ERP e quem cuida de quê.
3. `00-Fluxo-Mestre-0b`: o diagrama do pedido. Cada nó (`V1`, `P2`, `E6`…) liga setor, tela, endpoint, contrato e código. É o índice central.
4. `Onde-Estamos`: o que está pronto e o que falta, por setor.
5. A nota de raia do setor em questão (`02-Fluxo-de-Atividades`), depois o contrato e a decisão (`08-Decisoes`). Contrato da v2 se acha pelo ID no `Contratos-da-v2`, que leva ao texto no GitHub (tag `v2-antes-da-v3`); contrato novo fica em `06-Contratos`.

**As raias, na ordem do fluxo (F1).** `01-Proposta-de-Venda` → `02-Orcamento-Base-de-Preco` → `03-Pedido-de-Venda-e-Liberacao` → `04-PCP-Triagem-e-Destinacao` → `05-Estoque-Atendimento` → `06-Circuito-de-Compra` → `07-Recebimento` → `08-Qualidade-Entrada` → `09-Estoque-Entrada-do-Lote` → `10-Producao-e-Roteiro` → `11-Qualidade-Saida` → `12-Estoque-Despacho` → `13-Expedicao` → `14-Fiscal-Omie` → `15-Custo-Real-e-Comissao`. Cada raia abre com "Em uma frase", "Quando consultar" e "Onde estamos no fluxo" (anterior, próxima e os nós de que é dona, também no frontmatter `nos:`). Estados e telas ficam em `02-Fluxo-de-Atividades/Transversais/`. Os nomes da v2 estão no `Mapa-v2-para-v3`.

**Precedência das fontes.** Em conflito, vale a ordem abaixo; entre dois itens do mesmo nível, vale a data mais recente.

1. Código na `origin/develop` dos sistemas (F5); o `develop-conferida` de cada nota diz qual commit foi lido.
2. Dumps de esquema (MES e av-hub, de 14/10/2026).
3. `Registro-de-Decisoes`.
4. `00-Fluxo-Mestre-0b`.
5. O vault anterior (`vault-avhub-mer`, congelado), só quando não conflita com os itens acima.

**Selos de confiança.** Leia o selo antes da afirmação.

| Selo | Significa | O que fazer |
| --- | --- | --- |
| ✅ | Está na `develop` | Confira na `origin/develop` o `arquivo:linha` citado; o código pode ter mudado |
| 📝 | Decidido | Procure o ID da decisão no registro e veja se algo a supera |
| 🟡 | Parcial na `develop` | Não trate como pronto; veja o que falta na nota |
| 🔴 | Não está na `develop` | Não assuma que existe (no módulo do Pablo: "sem API e sem banco", F3) |
| ❓ | Não conferido na `develop` | Confira na `origin/develop` antes de afirmar. A `main` é só informação (o que já foi publicado), não critério de pronto |

**Achar pelo ID, não pela leitura.** Busque o ID exato (`N16-60`, `BL-035`, `PS-037`, `OQ-15`, `LOG-46`, `V0.3`) em vez de abrir a nota inteira. Prefixos: `N16`/`N14`/`DEC`/`EN`/`EC`/`#` são decisões, `BL` é tarefa do backlog, `PS` é ponta solta, `OQ` é pergunta em aberto, `RS` é risco, `LOG`/`SQL`/`API`/`CON` são contratos (os da v2 estão no `Contratos-da-v2`).

**Notas divididas.** Desde a v3, nenhuma nota passa de ~25 KB. A nota grande ficou com o resumo e um índice, e o detalhe foi para notas-parte em `<pasta>/Partes/` (frontmatter `parte-de`). Exemplos: o `Registro-de-Decisoes` é um índice, e as decisões estão em `Registro-N16-01-a-N16-43` e nas outras notas por faixa de ID; a tabela nó → raia do `00-Fluxo-Mestre-0b` está em `00-Fluxo-Mestre-0b-Tabela-1` a `-3`; o `Backlog-por-Frente` tem uma nota por frente; a lista completa de contratos está em `Contratos-da-v2-Lista-Completa`. Para achar um ID, use a busca do vault com o ID inteiro. Os `.csv`, `.sql`, `.html` e PDFs de `04-Dados/Sequenciais`, `09-Diagramas` e `10-Anexo-Fora-do-Fluxo` só se a tarefa pedir.

**Regra do perfil de teste.** `Admin (Dev)` é perfil de teste do time de TI, não é ator. Nunca o liste em "quem atua", diagramas ou papéis.

**Nomes de telas.** Use o nome novo e registre os dois: Triagem do Pedido (antes Carteira, `/carteira`), Destinação do Pedido (antes Nova Ordem de Produção, `/ordens-producao/novo`).

## Como ler os sistemas (o código)

O vault diz o que procurar; o código diz o que existe. Para cada afirmação relevante, vá da nota ao código e volte.

1. **Parta do nó ou do ID.** Na tabela nó → raia, tela, endpoint, contrato, código do `00-Fluxo-Mestre-0b`, ache a tela, a rota e o contrato do nó. A nota de sistema (`AV-Hub-API`, `MES-Backend`, `AV-Hub-Front`…) diz em qual pasta e arquivo olhar.
2. **Leia a `develop`.** Rode `git fetch` e leia pela `origin/develop` (`git show origin/develop:<arquivo>`), sem trocar de branch. Se está na `develop`, está ok. Diga sempre o repositório e o commit de onde veio o que você afirma.
3. **Siga o caminho completo da funcionalidade.** Tela no `av-hub` (ou `app-pcp`), depois a rota do BFF, depois a rota da API (`api-acos-vital` ou `api-pcp`), depois a tabela no banco. Se um elo não existe, a funcionalidade não está pronta, mesmo que a nota diga ✅.
4. **Compare nota, código e banco.** `Diferencas-Codigo-x-Banco` já lista divergências conhecidas. Uma divergência nova entra como candidata a `PS` (ponta solta) em `Pontas-Soltas`; não corrija a nota em silêncio.
5. **Integrações: leia os dois lados.** Para av-hub ↔ MES, leia `Integracao-AvHub-MES` e o código dos dois projetos. Para Omie, leia `Mapa-IncluirPedido-Omie` e `Colunas-Protegidas` antes de tocar em qualquer coisa que grave.

### Onde olhar em cada projeto

| Quero entender | Veja primeiro no vault | Depois no código |
| --- | --- | --- |
| Uma tela do HUB | `Telas-por-Raia`, `AV-Hub-Front` | `av-hub` (página, componente e BFF) |
| Uma rota ou regra da API do Hub | `AV-Hub-API`, o contrato pelo ID no `Contratos-da-v2` | `api-acos-vital` |
| Chão de fábrica, OP, lote, recebimento | `MES-Backend`, `MES-Front`, `Estados-e-Status` | `api-pcp` e `app-pcp` |
| Dados vindos do Omie | `Pipeline-Omie`, `Omie-Integracao-Estado` | `omie-elt-pipeline` e schemas `omie_*` |
| Permissões e perfis | `RBAC-e-Permissoes`, `Chaves-e-Autenticacao` | `api-acos-vital` (e o BFF do `av-hub`) |
| Comissão | `03-Sistemas/Comissao` (atual e nova) | `api-acos-vital`; schemas `core_comissionamento` e `core_comissao` |

## Protocolo de certeza

O Nathan precisa de máxima certeza em cada decisão. Antes de recomendar ou afirmar algo, a IA cumpre este protocolo.

1. **Separe fato de hipótese.** Todo ponto da resposta leva a origem: `arquivo:linha` e commit (código), tabela e coluna (banco), ID da decisão (vault). Sem origem, escreva "não conferido".
2. **Uma fonte não basta para decisão.** Cruze pelo menos duas: nota do vault e código; código e banco; banco e tela. Quando divergem, aplique a precedência e relate a divergência.
3. **Não complete lacunas por analogia.** Se o código ou o dump não mostra, diga o que falta e como obter, em vez de supor.
4. **Diga o grau de certeza.** Use as palavras: *confirmado* (código ou banco lido), *indicado* (só o vault), *não verificado*.
5. **Pare e pergunte quando a decisão não dá para desfazer** (migration, gravação no Omie, apagar dado) ou quando o vault e o código se contradizem sem decisão que resolva.
6. **Registre o que descobrir.** Divergência vira `PS`; dúvida de negócio vira `OQ` ou consulta `CON`; decisão do Nathan vai ao `Registro-de-Decisoes` com ID novo.

### O que conta como prova

| Afirmação | Prova aceita | Não basta |
| --- | --- | --- |
| "A funcionalidade existe" | Rota e tela na `origin/develop`, mais a tabela no banco | A nota dizer ✅ |
| "O banco tem a coluna" | Dump atual ou consulta ao banco | O dump de 14/10 sem checar migrations posteriores |
| "A tela se comporta assim" | Preview aberto e testado (veja a seção abaixo) | Só ler o componente |
| "A regra foi decidida" | ID da decisão, sem outra que a supere | A regra aparecer numa nota de raia |
| "Está pronto" | Estar na `origin/develop` (repositório, commit, arquivo:linha) | A nota dizer ✅, ou estar só numa branch de feature |

## Preview das telas

A IA pode abrir o preview das telas (o navegador embutido do app, com o front rodando no computador do Nathan) para ver o que o código faz na prática. É a prova aceita para qualquer afirmação sobre comportamento de tela.

**Abra o preview sempre que a decisão depender de:**

- o que aparece na tela, em que ordem e com que nome (compare com `Telas-por-Raia` e `Telas-e-Experiencia-do-Usuario`);
- campos, botões, estados vazios, mensagens de erro e validações;
- o que cada perfil vê ou não vê (`RBAC-e-Permissoes`);
- o caminho completo de um nó do fluxo, da tela até a resposta da API.

**Como proceder:**

1. Peça ao Nathan para subir o projeto certo (`av-hub` ou `app-pcp`) na `develop` atualizada, e confirme o commit em uso. É a `develop` que vale.
2. Navegue pelo caminho do nó no `00-Fluxo-Mestre-0b`, anotando o que viu e o que o vault dizia.
3. Teste com um perfil de negócio, não só com `Admin (Dev)`: esse perfil vê tudo e esconde problemas de permissão. A Torre de Fluxo, por exemplo, só aparece para o Admin por enquanto (N16-148).
4. Registre divergências como `PS` e cite a rota e o branch.

**Cuidados:** não grave dados em ambiente real. Peça ao Nathan o usuário e o ambiente de teste; não guarde senhas nem chaves em notas. Tela que só existe com dados de exemplo (a Torre de Fluxo, desde 15/10) não prova integração com o MES.

## Dump do banco

A IA pode, e deve, pedir ao Nathan um dump do banco sempre que a resposta depender do que o banco tem de fato. Os dumps de esquema do vault são de 14/10/2026; migrations e dados posteriores não aparecem neles.

**Peça um dump quando:**

- a nota (`Banco-AvHub`, `Banco-MES`, `Schemas-Postgres`) e o código discordam sobre uma tabela, coluna ou constraint;
- uma migration recente pode ter mudado o esquema;
- a decisão depende de volume ou formato real dos dados (por exemplo, sequenciais, itens sem valor, OCs);
- for preciso confirmar views, funções ou permissões.

**Como pedir, em uma mensagem curta:**

1. Qual banco: av-hub (schemas `core_*`, `auth`, `historico`, `omie_*`) ou MES (tudo em `public`).
2. O que preciso ver: só o esquema (`pg_dump --schema-only`), só certas tabelas, ou o resultado de uma consulta pontual.
3. Por quê: qual dúvida o dump resolve.
4. Peça o mínimo: esquema sem dados sempre que bastar; dados só das tabelas necessárias.

**Como analisar:** compare o dump com `Banco-AvHub` ou `Banco-MES` e com `Diferencas-Codigo-x-Banco`; liste o que mudou desde 14/10; cite tabela e coluna em cada conclusão. Dado pessoal ou financeiro que chegar no dump não vai para as notas do vault.

## Cuidados

- **Segredos.** `Chaves-e-Autenticacao` e os arquivos `.env` dos projetos tratam de chaves. Leia para entender o desenho, mas nunca copie chave, token ou senha para o vault, para respostas ou para este guia.
- **Omie não tem ambiente de teste.** Qualquer chamada que grava no Omie (por exemplo `IncluirPedido`) afeta dado real. Só teste com autorização expressa do Nathan, e consulte `Colunas-Protegidas` antes.
- **Cadastros TESTE no Omie.** Os cadastros TESTE do Nathan entram nos relatórios e na pipeline; filtre-os ao conferir números (BL-055).
- **Vault anterior congelado.** `vault-avhub-mer` (v1) só serve para consulta; não edite.
- **Edição das notas.** Siga `Regras-do-Vault`: abra com "Em uma frase", mantenha frontmatter, mantenha todos os `[[links]]` resolvendo, e reescreva a nota em vez de empilhar histórico. Cada ID existente continua o mesmo.
- **Arquivos do computador.** Trabalhe sobre cópia ou em novo arquivo ao lado do original. Altere um arquivo existente só quando o Nathan pedir, e nunca apague nada sem pedir permissão.
