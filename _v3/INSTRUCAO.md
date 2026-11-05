# Tarefa: criar o vault v3 (reestruturação), numa branch separada, em blocos retomáveis

O trabalho pode ser interrompido a qualquer momento (acabam os créditos ou o contexto) e continuado por outra IA, em outra ferramenta. Por isso **o estado fica no repositório**, nunca só na conversa.

## 0. Antes de tudo

**Pasta raiz (RAIZ):** `C:\Users\nathan.silva\Desktop\Gerenciamento-de-Integracoes`. A pasta só agrupa os projetos. Cada subpasta é um repositório git:

| Pasta | Grupo | Papel nesta tarefa |
|---|---|---|
| `vault-avhub-mer-v2` | Vault | Onde a v3 é construída (branch `v3`) |
| `api-acos-vital` | ERP | Só leitura, sempre pela `origin/develop` |
| `av-hub` | ERP | Só leitura, sempre pela `origin/develop` |
| `api-pcp` | MES | Só leitura, sempre pela `origin/develop` |
| `app-pcp` | MES | Só leitura, sempre pela `origin/develop` |
| `omie-elt-pipeline` | Pipeline | Só leitura, sempre pela `origin/develop` (se não tiver `develop`, ver seção 1) |

**Pré-requisitos:** um shell que rode comandos na RAIZ, com `git` e `node`. Sem isso, pare e avise o Nathan.

**O trabalho já começou?** Rode a seção 1 (preparação). Depois procure a branch `v3` do vault (local ou `origin/v3`). Se ela existir e tiver `_v3/PROGRESSO.md`, vá para a seção 11 (Retomada). Se não existir, comece pelo Bloco 0.

**Leia, nesta ordem:**

1. `00-Inicio/Guia-de-Leitura-do-Vault-e-dos-Sistemas.md`: como ler o vault e cruzar com código, telas e banco.
2. `07-Desenvolvimento/Analise-de-Organizacao-do-Vault.md`: diagnóstico da v2.
3. `00-Inicio/Regras-do-Vault.md`: regras de escrita da v2.
4. `02-Fluxo-de-Atividades/00-Fluxo-Mestre-0b.md`: o mermaid e a tabela nó → raia são a fonte da ordem.

**Protocolo de certeza do guia:** nada sem origem; na dúvida, vale o código da `develop` (F5). Se o vault e a `develop` se contradizem, ou se a ação é irreversível, pare e pergunte.

## 1. Preparação do ambiente (no início de TODA sessão e de TODO bloco)

Registre o resultado no PROGRESSO, em "Ambiente". Se algum passo falhar, pare e avise o Nathan.

1. **Atualize todos os repositórios.** Em cada um dos seis, rode `git fetch --all --prune` e anote o commit de `origin/develop` (no vault, de `origin/main` e de `origin/v3`).
2. **Vault:**
   - Se a `v3` existe, rode `git checkout v3` e depois `git pull --ff-only origin v3` (outra IA pode ter feito push).
   - Se o pull não for fast-forward, pare e avise: não faça merge nem rebase por conta própria.
   - Compare `main` com `origin/main` e anote os commits novos. Se a `main` estiver congelada (D4) e houver commit novo, avise o Nathan.
3. **Sistemas (só leitura, base = `develop`, F5):**
   - A referência é sempre `origin/develop`, depois do fetch. Se o repositório não tiver `develop`, use `origin/main`, registre no PROGRESSO e avise o Nathan.
   - Leia sem trocar de branch: `git show origin/develop:<arquivo>`, `git grep <termo> origin/develop`, `git log origin/develop`, `git ls-tree -r origin/develop`.
   - Para atualizar o local: se a branch atual for `develop` e o working tree estiver limpo, rode `git pull --ff-only`. Se não, não toque em nada; anote e siga.
   - **Nunca** troque de branch, faça commit ou stash nos repositórios dos sistemas.
   - Toda afirmação sobre código cita o repositório, `origin/develop`, o commit e o arquivo:linha.
4. **Quebra de linha:** confira `git config core.autocrlf` no vault. Se não for `false`, defina `git config core.autocrlf false` só neste repositório. O `.gitattributes` exige `eol=lf`.
5. **Obsidian:** confirme com o Nathan que o Obsidian está fechado antes dos blocos 1, 2, 3 e 5.
6. **Bloco 0, só na primeira vez:** teste o push com `git push -u origin v3`. Sem push não há continuidade entre IAs. Se falhar, pare.

## 2. Fatos e decisões já dados pelo Nathan (05/11/2026)

- **F1. A ordem do vault é a ordem do fluxo do mermaid.** A proposta vem antes da ordem de compra.
- **F2. Os contratos da v2 não vão para a v3.** Ficam na v2 (tag `v2-antes-da-v3`) e são consultados por um índice curto (seção 6). A v3 começa com a pasta de contratos vazia.
- **F3. O módulo do Pablo** (a parte de proposta e suprimentos) não tem API nem banco; está sendo construído aos poucos.
  - Na v3, o que for do Pablo e não estiver na `develop` aparece como 🔴 "sem API e sem banco".
  - O que já estiver na `develop` vale como pronto, pelo F5 (por exemplo, as rotas de proposta do Robert na `api-acos-vital`, se estiverem lá).
  - Se o vault da v2 e a `develop` divergirem sobre essa parte, registre e pergunte ao Nathan antes de escrever o estado.
- **F4. O Nathan fecha o Obsidian enquanto a IA trabalha.**
- **F5. A v3 é feita com base na `develop` dos sistemas.** Se está na `develop`, está ok: o selo é ✅.
  - A `main` não é critério de pronto. Quando for útil, pode aparecer como informação ("publicado na `main`: sim/não").
  - Na v2, "produção = `main`" e "❓ não conferido em produção" deixam de valer como critério de estado.

## 3. Regras de progresso (valem para todos os blocos)

- **Uma branch só no vault: `v3`.** Um commit por tarefa, com a mensagem `v3(bloco N): <tarefa>`.
- **Push ao fim de cada bloco** (`git push origin v3`). PR e merge na `main` do vault só quando o Nathan pedir. Nunca use force push.
- **Marque cada tarefa no `_v3/PROGRESSO.md` antes de começar a próxima:**
  - `- [x]` concluída, com data, hora e hash do commit;
  - `- [~]` em andamento;
  - `- [!]` bloqueada, com o motivo;
  - `- [ ]` pendente.
- **Todo passo é idempotente:** rodar de novo não duplica nem quebra nada.
- **Scripts só em Node** (`_v3/scripts/*.mjs`):
  - caminhos com `path.join`;
  - leitura e escrita em UTF-8 com LF;
  - nada de bash nem PowerShell para editar arquivos.

  Cada script tem um modo `--simular`, que lista o que mudaria. Rode esse modo primeiro.
- **Créditos ou contexto no fim:** pare num ponto seguro, atualize "Estado atual" e "Próxima ação", commite e faça push.
- **A memória do trabalho fica em `_v3/`:**
  - `PROGRESSO.md`;
  - `mapa-renomeacao.csv`, com as colunas `antigo,novo,tipo,motivo` (tipo: `final`, `provisorio`, `dividido` ou `contrato-v2`);
  - `perguntas-de-aceite.md`;
  - `fatos/`;
  - `scripts/`.

## 4. Por que reordenar (fatos medidos em 05/11/2026)

- **O mermaid começa pela proposta** (`SEC_PROP`, nós `V0.1–V0.7`) e segue esta ordem:
  - Orçamento (`B1–B4`), pedido (`V1–V3`), PCP e Estoque;
  - Compras, Recebimento, Qualidade de entrada, Produção e Qualidade de saída;
  - Expedição, Fiscal e Comissão.
- **Os arquivos estão em outra sequência:** `01-Vendas-Liberacao` … `10-Fiscal-Omie`, e só depois `11-Proposta`, `12-Orcamento`, `13-Custo-Real-e-Comissao` e `14-Telas`.
  - A compra (`04`) aparece antes da proposta (`11`).
  - O `Home` admite: "o número não segue a ordem do fluxo".
- **Há nós com mais de uma casa.** `11-Proposta` cita `B1–B4`, `C1–C4`, `C6–C8`, `P3` e `V1–V3`, que também estão em `12`, `04` e `01`.
- **`03-Estoque` mistura três momentos:** `E1–E4` (antes da compra), `E5` (depois da Qualidade de entrada) e `E6` (antes da Expedição).
- **Números antigos colidem com a numeração nova.** Os números de tela da v1 (`10.1–10.4`, `11.1`) aparecem em `09-Expedicao`, `10-Fiscal-Omie` e no Fluxo Mestre.

## 5. Estrutura alvo de `02-Fluxo-de-Atividades`

| Nota final | Nós (dono único) | Vem de |
|---|---|---|
| `00-Fluxo-Mestre-0b` | diagrama e tabela | igual |
| `01-Proposta-de-Venda` | V0.1–V0.7, V0C | `11` (parte) |
| `02-Orcamento-Base-de-Preco` | B1–B4 | `12` |
| `03-Pedido-de-Venda-e-Liberacao` | V1–V3 | `01` + `11` (parte) |
| `04-PCP-Triagem-e-Destinacao` | P1, P2, P6 | `02` |
| `05-Estoque-Atendimento` | E1–E4 | `03` (parte) |
| `06-Circuito-de-Compra` | P3, C0–C8, FN1 | `04` + `11` (C6–C8) |
| `07-Recebimento` | R0–R6 | `05` |
| `08-Qualidade-Entrada` | Q1–Q4 | `06` |
| `09-Estoque-Entrada-do-Lote` | E5 | `03` (parte) |
| `10-Producao-e-Roteiro` | F1 | `07` |
| `11-Qualidade-Saida` | Q7, Q8 | `08` |
| `12-Estoque-Despacho` | E6 | `03` (parte) |
| `13-Expedicao` | X1–X4 | `09` |
| `14-Fiscal-Omie` | O1, O2 | `10` |
| `15-Custo-Real-e-Comissao` | K1–K6 | `13` |

- **Variante da D1** (Estoque numa nota só): `05-Estoque` fica com E1–E6, as notas `09` e `12` não existem, e a numeração fecha a sequência (`09-Producao` … `13-Custo-Real-e-Comissao`). Grave no PROGRESSO a tabela que valer.
- **Transversais** saem da sequência e vão para `02-Fluxo-de-Atividades/Transversais/`: `Estados-e-Status`, `Telas-por-Raia` e `Telas-e-Experiencia-do-Usuario` (este perde o `14-`).
- **Nó novo entre dois existentes** usa letra (`06a`). IDs de decisão não mudam. As pastas de topo não mudam (salvo a D3).

## 6. Contratos na v3 (aplica o F2)

- **Índice primeiro.** Antes de retirar qualquer contrato, crie `06-Contratos/Contratos-da-v2.md`: uma tabela gerada por script a partir do frontmatter dos 97 contratos, com as colunas:
  - ID;
  - título;
  - pasta (`Ativos`, `Entregues`, `Arquivados`, `Consultas`);
  - status;
  - nós do 0b;
  - link para o GitHub, fixado na tag: `https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/<pasta>/<arquivo>.md`.

  Abra a nota com "Em uma frase" explicando que os contratos ficaram na v2, e destaque os `Ativos` e as `CON` em aberto, que ainda têm trabalho pendente.
- **Links:** os links para contratos (hoje 1.278, em 52 notas) passam a apontar para o índice, mantendo o ID visível: `[[LOG-34-...]]` vira `[[Contratos-da-v2|LOG-34]]`. Os links para `[[Painel-de-Contratos]]` (11 notas) passam a apontar para `[[Contratos-da-v2]]`.
- **Mapa:** `09-Diagramas/mapa/build.mjs` monta os links de contrato lendo `06-Contratos/`, e 11 fichas citam IDs de contrato. Ajuste o script para apontar os IDs para o índice (ou para o GitHub) e rode `node build.mjs`.
- **Remoção:** só depois disso, rode `git rm -r` em `Ativos`, `Entregues`, `Arquivados`, `Consultas` (com os anexos) e no `Painel-de-Contratos`. O conteúdo continua acessível pela tag.
  - O `Modelo-de-Consulta` é um modelo, não um contrato: vai para `06-Contratos/Modelos/`.
- **Contratos novos** continuam a numeração depois do maior ID da v2: `LOG-56`, `SQL-022`, `API-019`, `CON-04`. Confira no índice antes de registrar a regra.

## 7. Decisões do Nathan a perguntar no Bloco 0

Grave as respostas no PROGRESSO. Sem resposta, adote a opção recomendada, registre que foi assim e siga.

- **D1.** Separar `03-Estoque` em três notas (recomendado) ou manter uma só, organizada por "momentos".
- **D2.** A `main` do vault tem 4 arquivos não commitados (guia, análise, `Home`, `Comece-Aqui`). Recomendado: commitar na `main` antes de criar a `v3`.
- **D3.** Manter as pastas de topo como estão (recomendado).
- **D4.** Congelar a `main` do vault durante os blocos 1 a 3 (recomendado; o Nathan avisa Robert e Gustavo) ou sincronizar a cada bloco (seção 10).
- **D5.** Confirmar que nenhum contrato da v2, nem os `Ativos` e `CON` abertos, entra na v3 (padrão: nenhum entra). Trabalho que continuar ganha contrato novo, escrito na v3.
- **D6.** Fazer o Bloco 8, de reescrita para leitura (recomendado: só depois de aprovar o Bloco 7).
- **D7.** O guia cita o caminho antigo da pasta raiz. Confirmar o caminho novo para atualizar no Bloco 4.

## 8. Blocos (um por vez; só avance com o critério de saída cumprido e o "ok" do Nathan)

**Blocos 3, 5 e 8 exigem julgamento.** Se você é um modelo pequeno ou rápido, não execute esses blocos: pare e avise. Neles, entregue ao Nathan um resumo por nota: o que saiu, para onde foi, o que mudou e quais selos mudaram por causa da `develop`. Esse resumo é o que ele revisa, em vez do diff inteiro.

### Bloco 0: Preparação

- [ ] Rodar a seção 1 e gravar o resultado em "Ambiente"
- [ ] Perguntar D1–D7
- [ ] Resolver a D2; criar a tag `v2-antes-da-v3` na `main` do vault; criar a branch `v3`
- [ ] Copiar esta instrução, inteira e sem mudanças, para `_v3/INSTRUCAO.md`. É ela que a próxima IA lê na retomada.
- [ ] Criar `_v3/PROGRESSO.md` (seção 12); commitar; testar o push (seção 1, passo 6)
- [ ] Escrever `_v3/perguntas-de-aceite.md` com 10 perguntas-padrão e a resposta esperada de cada uma, conferida na `develop`; pedir aprovação
- [ ] Rodar a validação (seção 9) na v2 e gravar o resultado como base

Saída: ambiente conferido, decisões gravadas, base medida, `v3` no `origin`.

### Bloco 1: Retirar os contratos da v2 (seção 6)

- [ ] Gerar o índice `Contratos-da-v2` e conferir as 97 linhas e os links do GitHub
- [ ] Reescrever os links de contrato e do Painel por script
  - Cuidar de: `|alias`, `#seção`, `\|` em tabelas, embeds `![[...]]`, links com caminho ou `.md`.
  - Não tocar em links dentro de blocos de código.
- [ ] Mostrar ao Nathan uma amostra de 20 links reescritos, de notas diferentes, antes de commitar
- [ ] Ajustar `build.mjs` e as fichas; rodar `node build.mjs`
- [ ] Mover o `Modelo-de-Consulta` para `Modelos/`; rodar `git rm -r` nos contratos e no Painel

Saída: nenhum `[[link]]` para contrato da v2 ou para o Painel; o mapa abre; o índice tem as 97 linhas.

### Bloco 2: Renomear um para um (só mecânico, sem mexer no texto)

- [ ] Gerar o `mapa-renomeacao.csv`. É um para um, com nomes provisórios onde haverá divisão: `11-Proposta-e-Pedido-de-Venda` → `01-Proposta-e-Pedido-de-Venda` (provisório) e `03-Estoque-Atendimento-e-Despacho` → `05-Estoque-Atendimento-e-Despacho` (provisório).
- [ ] Rodar o script de renomeação: `git mv`, reescrita de links com as mesmas regras do Bloco 1, e o mapa inteiro aplicado de uma vez, sem cadeia de substituições
- [ ] Atualizar as referências entre crases aos nomes de notas e listá-las no PROGRESSO
- [ ] Mostrar ao Nathan uma amostra de 20 links reescritos
- [ ] Atualizar `build.mjs`, as fichas com nomes de notas (hoje 9; confira com `grep`) e `09-Diagramas/exemplo-mapa-vendas.html`; rodar `node build.mjs`
- [ ] Mover as transversais para `Transversais/`, com `14-Telas...` virando `Telas-e-Experiencia-do-Usuario`
- [ ] Criar `Mapa-v2-para-v3` (nome antigo → nome novo → motivo), com uma linha "contratos → `Contratos-da-v2`"

Saída: validação verde; nenhum `[[link]]` com nome antigo.

### Bloco 3: Dono único para cada nó e estado pela `develop` (julgamento)

- [ ] Adicionar `nos: [...]` ao frontmatter de cada nota de raia
- [ ] Antes de mexer numa nota, salvar a lista de fatos dela em `_v3/fatos/<nota>.md`: regras, números, datas, IDs, rotas, tabelas, selos e donos
- [ ] Dividir as notas provisórias, uma divisão por tarefa; links para a nota dividida são decididos um por um, pelo `#seção` e pelo assunto
- [ ] Mover os trechos de nós com mais de uma casa (C6–C8, B1–B4, V1–V3, P3) para a nota dona, um grupo por tarefa; nas outras notas fica uma frase e o link
- [ ] Trocar `10.1–10.4` e `11.1` pelos IDs de nó (X1, X3, X4 e a ligação do O1), conferindo cada um na nota e na `develop`
- [ ] Reconferir os selos de cada raia contra a `origin/develop` (F5), uma raia por tarefa:
  - está na `develop`: ✅, com repositório, commit e arquivo:linha;
  - parcial: 🟡;
  - não está: 🔴.

  Selo que mudou entra no resumo por nota.
- [ ] Aplicar o F3 nas notas de proposta, orçamento e compras: o que não estiver na `develop` é 🔴 "sem API e sem banco"; se divergir do vault, pergunte
- [ ] Conferir as listas de `_v3/fatos/`: cada fato está em algum lugar da v3 (o selo pode mudar pelo F5; o fato não pode sumir)

Saída: cada nó do mermaid aparece no `nos:` de exatamente uma nota, todo ✅ cita a `develop`, e nenhum fato se perdeu.

### Bloco 4: Navegação, padrão e regras

- [ ] Cabeçalho padrão: "Em uma frase", "Quando consultar" e "Onde estamos no fluxo" (← anterior | próxima →, nós da nota)
- [ ] Frontmatter: `ordem`, `nos`, `anterior`, `proxima` e `estado-em` (no lugar de `atualizado`), mais `develop-conferida` (repositórios e commits lidos)
- [ ] Aplicar nas notas de raia, uma por tarefa, com o detalhe técnico sempre no fim
- [ ] Atualizar o `Regras-do-Vault`:
  - frontmatter, nomes, numeração e contratos;
  - tabela de selos pelo F5:

    | Selo | Significa |
    |---|---|
    | ✅ | Está na `develop` (citar repositório, commit e arquivo:linha) |
    | 📝 | Decidido (citar o ID da decisão) |
    | 🟡 | Parcial na `develop` |
    | 🔴 | Não está na `develop` |
    | ❓ | Não conferido na `develop` |

  - fontes da verdade: código na `develop`, depois dumps, depois decisões, depois o fluxo mestre.
- [ ] Atualizar o `Guia-de-Leitura-do-Vault-e-dos-Sistemas`:
  - nomes da v3, caminho da RAIZ da D7, `Contratos-da-v2`, F3, F5 e a seção 1 desta instrução;
  - manter a seção "Comando: atualizar o vault", ajustada aos nomes da v3;
  - remover "produção é a `main`" como critério de pronto.
- [ ] Atualizar o aviso de "produção" em `Onde-Estamos` pelo F5

Saída: dá para percorrer o fluxo inteiro só pelos links "próxima", e as regras dizem que a base é a `develop`.

### Bloco 5: Dividir os arquivos grandes (julgamento)

- [ ] Medir todas as notas e listar as que passam de 25 KB. Hoje entram, entre outras:
  - `Registro-de-Decisoes`, `Backlog-por-Frente`, `00-Fluxo-Mestre-0b` (diagrama de um lado, tabela de outro) e `03-Modelo-Novo-core_comissao`;
  - as raias grandes: Proposta, Telas, Circuito de Compra, Custo e Comissão, Recebimento, Estoque e Pedido.
- [ ] Salvar a lista de fatos da nota em `_v3/fatos/` antes de dividir
- [ ] Dividir uma nota por tarefa; a original vira índice curto; todos os IDs são preservados
- [ ] Conferir a lista de fatos depois da divisão

Saída: nenhuma nota acima de ~25 KB (contratos novos da v3 são exceção), e nenhum fato se perdeu.

### Bloco 6: Entrada da IA, dicionário e manutenção

- [ ] Criar o `CLAUDE.md` na raiz do vault (cerca de 40 linhas, apontando para o guia e para o manual, com a seção 1, o F5 e o gatilho "atualizar o vault" → seção "Comando: atualizar o vault" do guia)
- [ ] Criar `07-Desenvolvimento/Ultima-Atualizacao-do-Vault.md` com o commit de `origin/develop` de cada sistema usado como base da v3 (o mesmo do relatório do Bloco 7) e a data. É o ponto de partida da próxima "atualizar o vault".
- [ ] Criar a nota `Tipos-de-ID`
- [ ] Dar dono único ao status: `Onde-Estamos` e `Backlog`, ambos conferidos na `develop`
- [ ] Reordenar `Home` e `Comece-Aqui`; incluir trilhas para Vendas, Fiscal, Estoque, Qualidade e Expedição
- [ ] Corrigir as referências em texto puro à numeração antiga ("notas 11 a 14" no `Home`, "notas 11" em `Telas`). Não mexer em "nota 01/03/04" dentro de `03-Sistemas/Comissao`: é a numeração da própria pasta.
- [ ] Criar `00-Inicio/Manual-de-Manutencao-do-Vault`, que diz, passo a passo:
  - preparar o ambiente (a seção 1);
  - executar o comando "atualizar o vault" (remoto → local sem perder nada local, leitura da `develop` desde a última atualização, plano, atualização e registro em `Ultima-Atualizacao-do-Vault`);
  - conferir um fato na `develop` e atualizar o selo;
  - criar uma nota (modelo de cabeçalho e frontmatter);
  - registrar uma decisão (ID novo, "supera" e "completa");
  - criar um contrato novo (numeração da seção 6, pasta, status, entrada no índice);
  - atualizar o status (só `Onde-Estamos` e `Backlog`);
  - incluir um nó no mermaid (ID, nota-casa, `nos:`, `anterior`/`proxima`, ficha do mapa, `node build.mjs`);
  - dividir uma nota que passou de 25 KB;
  - registrar o estado do módulo do Pablo à medida que chegar à `develop`;
  - manter o `CLAUDE.md` atualizado;
  - rodar a validação;
  - abrir uma versão nova (branch, tag `vX-antes-da-vY`, `Mapa-vX-para-vY`, `PROGRESSO`).
- [ ] Mover os scripts de validação de `_v3/scripts/` para `scripts/` na raiz do vault e citá-los no manual e no `CLAUDE.md`

Saída: IA e colaborador chegam a qualquer assunto em até 3 cliques, e o manual cobre cada tipo de mudança.

### Bloco 7: Validação e aceite

- [ ] Rodar a seção 1 de novo (fetch) e a validação completa
- [ ] Responder às 10 perguntas de aceite e comparar com a resposta esperada
- [ ] Relatório final no PROGRESSO, com o commit de `origin/develop` de cada sistema usado como base

Saída: aprovado pelo Nathan.

### Bloco 8: Reescrita para leitura (opcional, só se a D6 = sim; julgamento)

- [ ] Listar as notas a reescrever, na ordem do fluxo
- [ ] Reescrever uma nota por tarefa e por commit, com a lista de fatos salva antes e conferida depois
- [ ] Linguagem simples no topo e detalhe técnico no fim; nenhuma regra, número, ID ou selo pode sumir

Saída: as listas de fatos batem 100%, e a validação está verde.

### Bloco 9: Encerramento

- [ ] Mover `_v3/` para `07-Desenvolvimento/v3/`, para guardar o histórico
- [ ] Abrir o PR da `v3` para a `main` do vault, se o Nathan pedir
- [ ] Depois do merge, criar a tag `v2-final` no último commit da v2

## 9. Validação (ao fim de cada bloco; cole o resultado no PROGRESSO)

- **Links:** todo `[[link]]` resolve e não há nota órfã.
- **Nomes antigos (`grep` do mapa, em links e em texto entre crases):**
  - Exceções: `Mapa-v2-para-v3`, `Mapa-v1-para-v2`, `Contratos-da-v2`, `_v3/` e o histórico `Analise-de-Organizacao-do-Vault`, que ganha um aviso no topo dizendo que usa os nomes da v2.
- **Contratos (a partir do Bloco 1):** nenhum link para contrato da v2 fora do índice, e o índice com os 97.
- **Dono dos nós (a partir do Bloco 3):** cada nó do mermaid aparece no `nos:` de exatamente uma nota.
- **Selos (a partir do Bloco 3):** todo ✅ cita repositório, `develop` e commit; nenhum ✅ apoiado só na `main` ou em "produção".
- **Fatos (blocos 3, 5 e 8):** toda lista de `_v3/fatos/` confere.
- **Tamanho (a partir do Bloco 5):** nenhuma nota acima de ~25 KB, exceto contratos novos.
- **Mapa HTML:** regenerado, e os links funcionam.
- **Codificação:** nenhum arquivo com CRLF nem caractere corrompido (procure por `Ã`, `â€` e `�`).
- **Ordem:** a pergunta "em que ordem o pedido passa pelas notas?" é respondida só com o `Home` e as raias, na sequência Proposta → Orçamento → Pedido → PCP → Estoque → Compra → Recebimento → Qualidade → Produção → Expedição → Fiscal → Comissão.

## 10. Sincronização com a `main` do vault (só se a D4 não congelou a `main`)

No início de cada bloco, depois da seção 1:

1. `git merge origin/main` dentro da `v3`.
2. Resolva os conflitos aceitando o conteúdo novo da `main` e o nome novo da `v3`.
3. Rode de novo os scripts dos blocos já feitos (são idempotentes). Contrato novo que chegou da `main` entra no índice e sai da pasta; links novos são reescritos.
4. Valide, commite e faça push.

## 11. Retomada (quando outra IA assume)

1. Rode a seção 1 inteira (fetch de todos os repositórios, pull da `v3`, quebra de linha, Obsidian).
2. Leia `_v3/INSTRUCAO.md` (esta instrução) e `_v3/PROGRESSO.md`: "Estado atual", "Próxima ação", "Decisões" e "Ambiente".
3. **Não confie só nos checkboxes:** rode `git status`, `git log --oneline -15` e a validação. Item `[x]` que não bate com o repositório volta para `[ ]` e é refeito.
4. **A `develop` andou?** Compare o commit de `origin/develop` de cada sistema com o registrado em "Ambiente". Se andou, reconfira os selos das raias já feitas que dependem dos arquivos alterados (`git diff --stat <commit-antigo> origin/develop`).
5. Tarefa `[~]` com alterações não commitadas: `git stash push -m "v3 retomada"` (nunca `git restore`), e refaça a tarefa a partir do último commit.
6. Anote "Retomado por <IA> em <data>" e continue do próximo `[ ]`.

## 12. Modelo do `_v3/PROGRESSO.md`

```
# Progresso da v3
Estado atual: <bloco e tarefa em andamento>
Próxima ação: <um passo concreto>
Branch: v3   Último commit: <hash>   Push: <sim/não>   Atualizado em: <data e hora>

## Ambiente (última preparação)
Data: ...  Vault: v3 <commit>, pull ok?  origin/main: commits novos?
origin/develop: api-acos-vital <commit> · av-hub <commit> · api-pcp <commit> · app-pcp <commit> · omie-elt-pipeline <commit ou "sem develop">
autocrlf: false   Obsidian fechado: sim

## Fatos do Nathan
F1 ordem do mermaid · F2 contratos ficam na v2 · F3 módulo do Pablo sem API e sem banco · F4 Obsidian fechado · F5 base = develop

## Decisões
D1: ...  D2: ...  D3: ...  D4: ...  D5: ...  D6: ...  D7: ...
Tabela alvo que vale: <seção 5 ou variante da D1>

## Blocos
(copie as listas da seção 8; marque [x] com data, hora e hash)

## Validações
## Problemas e pendências
## Histórico de retomadas
```

## 13. Regras gerais

- **Contexto:**
  - Nunca abra inteiro um arquivo acima de 25 KB.
  - Leia o cabeçalho e os títulos, e busque por ID (`N16-60`, `BL-035`, `V0.3`).
  - O `Registro-de-Decisoes` só se lê por busca.
- **Origem:** todo fato novo cita o repositório, `origin/develop`, o commit e o arquivo:linha; ou a tabela e a coluna; ou o ID de decisão.
- **O que não tocar:** o código dos sistemas (nunca checkout, commit ou stash neles) e as decisões (que só mudam de arquivo, nunca de texto).
- **Nada some:** nunca apague conteúdo fora do que a seção 6 determina; para mover, use `git mv`.
- **Mudança irreversível:** peça permissão antes.
- **Fim de cada bloco:** mostre o resumo do que mudou e espere o "ok" do Nathan.
