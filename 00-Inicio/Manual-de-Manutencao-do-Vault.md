---
tags: [inicio, manual, manutencao, ia]
criado: 2026-11-05
estado-em: 2026-11-10
status: vigente
dono: Nathan
fontes: [instrução da v3 (07-Desenvolvimento/v3/INSTRUCAO.md, seções 1, 3, 6 e 9), Regras-do-Vault, Guia-de-Leitura-do-Vault-e-dos-Sistemas, scripts/validar.mjs, scripts/fatos.mjs, scripts/dividir.mjs, 09-Diagramas/mapa/build.mjs]
---

# Manual de manutenção do vault

**Em uma frase:** é o passo a passo de cada tipo de mudança no vault (atualizar pela `develop`, criar nota, registrar decisão ou contrato, incluir nó, dividir nota, validar, abrir versão nova), para que qualquer pessoa ou IA mude o vault sem quebrar nada.

**Quando consultar:** antes de mudar qualquer coisa no vault. As regras de escrita estão em [[Regras-do-Vault]]; como ler o vault com o código, no [[Guia-de-Leitura-do-Vault-e-dos-Sistemas]].

**Três regras que valem para tudo:**

- **Base = `develop`** (F5): o estado vem da `origin/develop` dos sistemas (no `omie-elt-pipeline`, `origin/master`). A `main` é só informação.
- **Nada some:** o vault só muda de lugar com `git mv`; antes de reescrever ou dividir, salve a lista de fatos.
- **Um commit por tarefa**, e `node scripts/validar.mjs` verde antes do push.

## 1. Preparar o ambiente (sempre, antes de começar)

1. Em cada um dos seis repositórios da pasta-mãe do vault (`vault-avhub-mer`, `api-acos-vital`, `av-hub`, `api-pcp`, `app-pcp`, `omie-elt-pipeline`, lado a lado): `git fetch --all --prune`. Anote o commit de `origin/develop`.
2. No vault: `git status` (se houver alteração não commitada, pergunte ao dono antes de qualquer coisa) e `git pull --ff-only`. Se não for fast-forward, pare e avise; não faça merge nem rebase por conta própria.
3. Nos sistemas, **só leitura**: nunca troque de branch, faça commit ou stash. Leia com `git show origin/develop:<arquivo>`, `git grep -n <termo> origin/develop`, `git log origin/develop`. Se a branch local for `develop` e o working tree estiver limpo, `git pull --ff-only` é permitido; fora isso, não toque.
4. No vault, `git config core.autocrlf` deve ser `false` (o `.gitattributes` exige LF).
5. Se for mexer em muitas notas (renomear, mover, dividir), confirme que o Obsidian está fechado.

## 2. Comando "atualizar o vault"

Gatilho: quem está usando diz "atualizar o vault" (ou "atualiza", "sincroniza"). O roteiro completo é a seção "Comando: atualizar o vault" do [[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]. Em resumo:

1. **Remoto → local sem perder nada local:** faça a seção 1. Commits locais sem push são listados e só vão com o "ok".
2. **Ler a `develop` desde a última atualização:** os commits de partida estão em [[Ultima-Atualizacao-do-Vault]]. Em cada sistema: `git log --oneline <commit>..origin/develop` e `git diff --stat <commit> origin/develop`.
3. **Plano:** ligue cada arquivo alterado à nota que o descreve (tabela nó → raia do [[00-Fluxo-Mestre-0b]], "Detalhe técnico" das raias, notas de sistema). Mostre ao Nathan o que mudou, que notas e selos mudam e o que ficou em dúvida. Espere o "ok".
4. **Atualização:** branch `docs/atualizacao-AAAA-MM-DD`; um commit por nota; selos pela seção 3 deste manual; status só no [[Onde-Estamos]] e no [[Backlog-por-Frente]] (seção 7); divergência nova vira `PS` em [[Pontas-Soltas]].
5. **Registro:** troque a tabela de [[Ultima-Atualizacao-do-Vault]] pelos commits novos e a data; atualize o `develop-conferida` e o `estado-em` das notas conferidas; rode a validação (seção 13); push; PR só quando o Nathan pedir.

## 3. Conferir um fato na `develop` e atualizar o selo

1. Ache no código a prova: rota, tela, tabela ou regra, em `origin/develop` (seção 1, passo 3). Siga o caminho inteiro: tela → BFF → API → banco. Um elo faltando = não está pronto.
2. Escolha o selo:

| Selo | Quando |
|---|---|
| ✅ | Está na `develop`: cite o repositório e o arquivo:linha com âncora, um trecho literal da linha (ex.: `api-pcp` `src/qualidade/qualidade.service.ts:97` (`aprovarLote`)) |
| 🟡 | Parcial na `develop`: diga o que falta |
| 🔴 | Não está na `develop` (no módulo do Pablo: "sem API e sem banco") |
| 📝 | Decidido: cite o ID da decisão |
| ❓ | Não deu para conferir: diga o que falta para conferir |

3. Na nota, atualize o `develop-conferida` (repositórios e commits lidos, com a data) e o `estado-em`.
4. Se o vault e o código se contradizem sem decisão que resolva, não escolha sozinho: registre um `PS` e pergunte.
5. Rode `node scripts/conferir-citacoes.mjs --nota=<nome da nota>` e corrija as citações que ele apontar.

## 4. Criar uma nota

1. Escolha a pasta pelo assunto (veja o mapa no [[Home]]). Nome em `Palavras-Com-Hifen`, sem acento.
2. Use este modelo:

```markdown
---
tags: [assunto, ...]
criado: AAAA-MM-DD
estado-em: AAAA-MM-DD
status: vigente | proposta | arquivado
dono: Nathan | Robert | Gustavo (DBA) | Pablo | ...
fontes: [repositório arquivo:linha, IDs de decisão, notas]
---

# Título

**Em uma frase:** ...

**Quando consultar:** ...

## (conteúdo: o resumo em linguagem simples primeiro)

## Detalhe técnico
```

3. **Nota de raia** (`02-Fluxo-de-Atividades`): acrescente `ordem`, `nos`, `anterior`, `proxima` e `develop-conferida` no frontmatter, e a linha `**Onde estamos no fluxo:** ← [[anterior]] | [[próxima]] → · nós desta nota: ...` depois do "Quando consultar". Atualize o `anterior`/`proxima` das vizinhas. Seções, nesta ordem: Como funciona, passo a passo · Exemplo · Quem atua · Regras que valem · O que já existe e o que falta · Detalhe técnico.
4. Ligue a nota nova a partir de pelo menos uma nota existente (o [[Home]], a nota-mãe ou a raia). Nota órfã reprova a validação.
5. Rode a validação.

## 5. Registrar uma decisão

1. Veja o próximo ID em [[Tipos-de-ID]] (hoje, `N16-154`).
2. Escreva a linha na tabela da nota de decisões mais nova (hoje [[Registro-N16-150-a-N16-153]]), com as colunas ID | Decisão | Data | Dono | Selo | Superada. Comece o texto com um título em **negrito**.
3. **Supera e completa:** se a decisão troca outra, escreva na coluna *Superada* "N16-xx (supera)" ou "(supera em parte)"; se só acrescenta, "(completa)". A decisão antiga **não** é editada nem apagada.
4. Quando a nota de decisões passar de ~25 KB, crie a próxima (`Registro-N16-150-a-N16-nnn`, com o mesmo cabeçalho de tabela), ligue-a no [[Registro-de-Decisoes]] e renomeie a anterior só se o nome dela ficar errado (com `git mv` e reescrevendo os links).
5. Atualize o "próximo livre" em [[Tipos-de-ID]] e, se a decisão mudar uma regra, a nota de raia afetada (com o ID ao lado da regra).

## 6. Criar um contrato novo

Contrato é **um arquivo único por demanda**: contexto (o que deve ser feito e por quê) e as seções de frontend, backend, API e banco, conforme a demanda, no formato do [[Modelo-de-Contrato]]. O admin (Nathan, GitHub `oluccaa`) cria direto no vault com a skill `criar-contrato`. Os demais mandam em PDF no grupo do WhatsApp, escritos a partir dos modelos [[Modelo-de-Contrato]] (prefixo `LOG`, `SQL` ou `API` pela camada principal), [[Modelo-de-Consulta]] (`CON`) e [[Modelo-de-Relatorio-de-Entrega]] (entrega de task). Para aplicar um PDF recebido, use a skill `aplicar-documento-recebido` (`.claude/skills/`). Quem escreve não escolhe o ID: o Nathan dá o próximo livre.

1. O próximo ID está no fim do [[Contratos-da-v2]] e em [[Tipos-de-ID]]: `LOG-57`, `SQL-022`, `API-019`, `CON-04` (a numeração continua depois do maior ID da v2).
2. Crie a nota em `06-Contratos/<Pasta>/<ID>-<Apelido>.md`, com a pasta pelo estado: `Ativos/` (a fazer ou parcial), `Entregues/` (está na `develop`), `Arquivados/` ou `Consultas/` (as `CON`, a partir do [[Modelo-de-Consulta]]).
3. Status: `proposta`, `para-implementar`, `parcial`, `implementado-na-develop` ou `arquivado`.
4. Acrescente a linha na seção "Contratos novos (v3)" do [[Contratos-da-v2]] e atualize a linha "Próximos IDs livres" e o [[Tipos-de-ID]].
5. Ligue o contrato a partir da raia do nó, com `[[ID-Apelido|ID]]`. O mapa (`09-Diagramas/mapa/build.mjs`) acha sozinho os contratos das pastas novas; rode `node build.mjs`.

## 7. Atualizar o status

O status do projeto tem **dois donos, e só dois**: o [[Onde-Estamos]] (estado por setor) e o [[Backlog-por-Frente]] (tarefas `BL-nnn`, uma nota por frente em `07-Desenvolvimento/Partes/`).

1. Confira na `develop` (seção 3) antes de mudar um selo.
2. Mude primeiro a raia (o detalhe, com arquivo:linha), depois a linha do [[Onde-Estamos]] e a tarefa no Backlog. Tarefa nova: próximo `BL-nnn` de [[Tipos-de-ID]], na frente de quem faz, na ordem dos nós.
3. Tarefa concluída: selo ✅ com a evidência na `develop`; não apague a linha.
4. Outras notas (Visão, Home, Roteiro, sistemas) não repetem o status: apontam para essas duas.

## 8. Incluir um nó no mermaid

1. **ID:** use a letra do setor (veja [[Tipos-de-ID]]). Entre dois nós existentes, use sufixo (`C6a`) em vez de renumerar.
2. **Diagrama:** acrescente o nó no mermaid do [[00-Fluxo-Mestre-0b]] e a linha na tabela nó → raia (nas notas `00-Fluxo-Mestre-0b-Tabela-n`, na ordem do fluxo).
3. **Nota-casa:** acrescente o ID no `nos:` de **uma** raia só (o dono). As outras raias citam o nó com uma frase e o link.
4. **Se o nó abrir uma etapa nova:** crie a raia com número com letra (`06a-...`), ajuste o `anterior`/`proxima` das vizinhas e a lista do [[Home]].
5. **Mapa:** se o nó aparece numa ficha (`09-Diagramas/mapa/fichas/*.json`), acrescente-o lá e rode `cd 09-Diagramas/mapa && node build.mjs`.
6. Rode a validação: "Nós sem dono único" tem de ser 0.

## 9. Dividir uma nota que passou de 25 KB

1. Salve a lista de fatos: `node scripts/fatos.mjs extrair <pasta/Nota.md>` (grava em `scripts/fatos/`).
2. Acrescente a nota ao `PLANO` de `scripts/dividir.mjs`: modo `subsecoes` (os `###` de uma seção, normalmente "Detalhe técnico"), `secoes` (seções `##` inteiras) ou `linhas` (uma tabela grande, cortada por linhas).
3. `node scripts/dividir.mjs <chave> --simular`; confira os tamanhos; rode sem `--simular`. As partes vão para `<pasta>/Partes/`, com `parte-de`, e a original fica com o resumo e o índice. Links `[[Nota#Seção]]` são reescritos.
4. `node scripts/fatos.mjs conferir <Nota>`: 0 fatos sumidos. Linhas "conferir à mão" que só mudaram de link estão certas.
5. Valide e faça um commit por nota.

## 10. Módulo do Pablo: registrar o estado quando chegar à `develop`

1. Hoje o que é do módulo comercial (proposta e suprimentos) e não está na `develop` é 🔴 "sem API e sem banco"; o `av-hub/api-comercial` era teste e foi removido inteiro (o protótipo saiu do av-hub no PR #261 e fica legível no commit `f7d8d7f`).
2. Quando uma parte chegar à `develop` (rota na `api-acos-vital`, tabela, tela no `av-hub`), confira o caminho inteiro (seção 3) e troque o selo para ✅ com o arquivo:linha, nas raias 01, 02 e 06 e nas notas [[Mapa-do-Modulo-do-Pablo]] e [[Conexao-das-Telas-do-Pablo-com-a-API-do-Hub]].
3. Atualize a linha do setor no [[Onde-Estamos]] e as tarefas BL da [[Backlog-Frente-Comercial-e-Suprimentos]].

## 11. Manter o `CLAUDE.md` atualizado

O `CLAUDE.md` na raiz do vault é a porta da IA (cerca de 40 linhas). Atualize-o no mesmo commit quando mudar: a preparação do ambiente, a regra de estado, o gatilho "atualizar o vault", os scripts ou a estrutura de pastas. Ele aponta para este manual e para o Guia; não copie conteúdo deles para lá.

## 12. Notas de partida e de controle

- [[Ultima-Atualizacao-do-Vault]]: commits da `develop` usados como base. Só muda no fim de uma atualização.
- [[Tipos-de-ID]]: próximos IDs livres. Muda junto com cada ID novo.
- [[Mapa-v2-para-v3]]: nomes antigos → novos. Não muda depois da v3.

## 13. Rodar a validação

```bash
node scripts/validar.mjs
```

Tem de dar 0 em: links quebrados, notas órfãs, CRLF, caractere corrompido, notas acima de 25 KB, nomes antigos, nós sem dono único, caminhos do `build.mjs` que não existem e ✅ sem citação nas raias. O índice de contratos tem de somar 92. A última linha diz "RESULTADO: tudo verde"; com qualquer problema, o validador sai com código 1.

**No GitHub, isso roda sozinho.** A Action `.github/workflows/validar.yml` roda o validador e o autoteste em todo PR para a `main` e em todo push nela. O resultado aparece no PR como o check `validar`, verde ou vermelho. O caminho de toda mudança é branch → PR → check verde → merge: **não mergeie PR com o check vermelho e não faça push direto na `main`.** Hoje isso é regra de equipe, não trava do GitHub: com o repositório privado e a organização no plano gratuito, o GitHub não deixa proteger a `main` (exige o plano Team). Se a organização mudar de plano, ative a proteção exigindo o check `validar`. Se mexeu em mapa ou fichas, rode também `cd 09-Diagramas/mapa && node build.mjs` ("0 contratos sem nota achada").

**Citações de código.** O validador não abre os sistemas. Para conferir as citações `arquivo:linha` contra a `develop`, rode na sua máquina, com os repositórios ao lado do vault:

```bash
node scripts/conferir-citacoes.mjs            # problemas
node scripts/conferir-citacoes.mjs --detalhe  # também as citações sem âncora
```

Ele lista o arquivo que sumiu, a linha além do fim do arquivo, a âncora deslocada (com a linha nova) e a âncora que sumiu. Corrija ao mexer na nota; na atualização do vault, corrija as das notas tocadas.

Se mudou o próprio validador, ou se ele der tudo 0 e você desconfiar, rode o autoteste:

```bash
node scripts/autoteste-validador.mjs
```

Ele copia o vault para uma pasta temporária, planta um link quebrado, um ✅ sem citação, uma nota acima de 25 KB e uma linha com CRLF, e confere se o validador acusa os quatro. Também falha se a checagem de selos não examinar nenhuma nota. O vault de verdade não é tocado. Foi o que faltou até 05/11/2026: no Windows, a checagem de selos não olhava nenhuma nota e dava 0 sempre.

## 14. Abrir uma versão nova do vault

Para uma reestruturação grande (como a v3), em vez de mudar a `main` aos poucos:

1. Tag do ponto de partida na `main`: `git tag vX-antes-da-vY` e `git push origin vX-antes-da-vY`.
2. Branch `vY` a partir da `main`; teste o push na hora (`git push -u origin vY`).
3. Pasta de trabalho `_vY/` com a instrução copiada, o `PROGRESSO.md` (estado atual, próxima ação, ambiente, decisões, blocos), as listas de fatos e os scripts da versão. Tudo o que a próxima IA precisa para retomar fica ali, nunca só na conversa.
4. Renomeações vão num `mapa-renomeacao.csv` e viram a nota `Mapa-vX-para-vY`.
5. Um commit por tarefa (`vY(bloco N): ...`), push ao fim de cada bloco, validação verde em cada bloco. No fim: `_vY/` vai para `07-Desenvolvimento/vY/`, PR para a `main` quando o Nathan pedir e, depois do merge, a tag `vX-final`.
