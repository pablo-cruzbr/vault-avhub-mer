# Progresso da v3
Estado atual: Bloco 5 concluído, aguardando "ok" do Nathan para o Bloco 6
Próxima ação: com o "ok", rodar a seção 1 e começar o Bloco 6 (CLAUDE.md na raiz do vault)
Branch: v3   Último commit: (ver `git log`)   Push: sim   Atualizado em: 2026-11-05

## Ambiente (última preparação)
Data: 2026-11-05 (reconferido no início dos Blocos 4 e 5)  Vault: `v3` 05891e7 = `origin/v3`, pull ok; tag `v2-antes-da-v3`  origin/main: 5203232 (sem commits novos)
origin/develop: api-acos-vital b97981c · av-hub 2e5456d · api-pcp befd973 · app-pcp 93f96de · omie-elt-pipeline **sem develop** (só `origin/master` 5e7e94d)
autocrlf: false (ajustado só no vault; estava `true`)   Obsidian fechado: sim no Bloco 1 e no Bloco 2 (processo não está rodando, conferido em 2026-11-05)
Observações:
- `omie-elt-pipeline` não tem `develop` nem `main`: a base é `origin/master`. Avisado ao Nathan.
- Primeiro fetch de api-pcp, app-pcp e omie falhou por rede; repetido com sucesso.
- Repositórios dos sistemas estão em branches locais próprias (api-acos-vital e av-hub em `feat/...`); não foram tocados. A leitura é sempre por `origin/develop`.
- A `main` do vault tinha working tree limpo: os 4 arquivos da D2 já foram commitados (PR #73).

## Fatos do Nathan
F1 ordem do mermaid · F2 contratos ficam na v2 · F3 módulo do Pablo sem API e sem banco · F4 Obsidian fechado · F5 base = develop
Complemento do F3 (05/11/2026): o `api-comercial` (módulo de teste do Pablo em `av-hub/api-comercial`) será removido integralmente; o que só existe nele é 🔴.
Decisão de formato (05/11/2026): o commit da develop lido fica uma vez por nota, em `develop-conferida`; cada ✅ cita repositório e arquivo:linha.
Complemento (05/11/2026): a `develop` dos sistemas está congelada e é a versão mais atualizada; ainda não há produção (o software não foi lançado).

## Decisões
D1: três notas de Estoque (recomendado)
D2: sem efeito: working tree da `main` já estava limpo, nada a commitar
D3: pastas de topo mantidas (padrão, sem resposta)
D4: sem resposta clara sobre a `main` do vault; adotado o recomendado: **congelar a `main`** nos blocos 1 a 3 (o Nathan avisa Robert e Gustavo). O Nathan disse que a `develop` dos sistemas está congelada e vale como base.
D5: nenhum contrato da v2 entra na v3 (padrão, sem resposta)
D6: sim, fazer o Bloco 8 depois da aprovação do Bloco 7
D7: manter `C:\Users\nathan.silva\Desktop\Gerenciamento-de-Integracoes`
Tabela alvo que vale: seção 5 da instrução (três notas de Estoque: 05, 09 e 12)

## Blocos
### Bloco 0: Preparação
- [x] Rodar a seção 1 e gravar o resultado em "Ambiente" (2026-11-05)
- [x] Perguntar D1–D7 (2026-11-05)
- [x] Resolver a D2; criar a tag `v2-antes-da-v3` na `main` do vault; criar a branch `v3` (2026-11-05; tag e branch locais, ainda não enviadas)
- [x] Copiar a instrução, inteira e sem mudanças, para `_v3/INSTRUCAO.md` (cópia byte a byte conferida)
- [x] Criar `_v3/PROGRESSO.md`; commitar; testar o push (push de `v3` e da tag `v2-antes-da-v3` ok, 2026-11-05)
- [x] Escrever `_v3/perguntas-de-aceite.md` com 10 perguntas-padrão; pedir aprovação (aprovado pelo Nathan em 2026-11-05; 3 respostas "a conferir" no Bloco 3)
- [x] Rodar a validação (seção 9) na v2 e gravar o resultado como base (`_v3/validacao-base-v2.md`, script `_v3/scripts/validar.mjs`)

### Bloco 1: Retirar os contratos da v2
- [x] Gerar o índice `Contratos-da-v2` e conferir as 97 linhas e os links do GitHub (2026-11-05, e5d763d). Os 97 `.md` de `06-Contratos` = 92 contratos + 3 HIST + Painel + Modelo-de-Consulta. O índice tem 92 linhas de contrato e uma tabela à parte com os 3 HIST e o Painel; o Modelo vai para `Modelos/`. Todos os links do GitHub conferidos contra a tag. Próximos IDs: API-019, CON-04, LOG-56, SQL-022.
- [x] Reescrever os links de contrato e do Painel por script (2026-11-05, 2fb8a01: 372 links em 57 notas; segunda rodada = 0)
- [x] Mostrar ao Nathan uma amostra de 20 links reescritos (aprovada em 2026-11-05; `_v3/amostra-links-bloco1.txt`)
- [x] Ajustar `build.mjs` e as fichas; rodar `node build.mjs` (2026-11-05, e0364bc: 9 campos `arquivo` nas fichas; IDs apontam para o índice; "0 contratos sem nota achada")
- [x] Mover o `Modelo-de-Consulta` para `Modelos/`; `git rm -r` nos contratos e no Painel (2026-11-05, e0364bc: saiu no mesmo commit do mapa, porque o `git rm` já estava no índice do git)

### Bloco 2: Renomear um para um
- [x] Gerar o `mapa-renomeacao.csv` (2026-11-05: 13 raias, 3 transversais, 3 linhas de contrato/modelo do Bloco 1)
- [x] Rodar o script de renomeação (2026-11-05, 3f84353: 13 `git mv`, 330 links em 46 notas; nas notas históricas o link ganhou o nome antigo como alias)
- [x] Atualizar as referências entre crases aos nomes de notas (2026-11-05, 9fde32d: só 1, `14-Telas-e-Experiencia-do-Usuario` no Guia, linha 166; restam `Painel-de-Contratos` no Guia, linhas 112 e 133, para o Bloco 4)
- [x] Mostrar ao Nathan uma amostra de 20 links reescritos (aprovada em 2026-11-05; `_v3/amostra-links-bloco2.txt`)
- [x] Atualizar `build.mjs`, fichas e `exemplo-mapa-vendas.html`; rodar `node build.mjs` (2026-11-05, 89f409d: 13 caminhos no `build.mjs`, 1 menção "nota 11" na ficha de Compras, 1 menção a contrato no exemplo; as 9 fichas com contrato já foram no Bloco 1)
- [x] Mover as transversais para `Transversais/` (2026-11-05, 9fde32d: 3 `git mv`, 10 links em 8 notas)
- [x] Criar `Mapa-v2-para-v3` (2026-11-05, 8bf55ff; ligado no Home e no Comece-Aqui)

### Bloco 3: Dono único e estado pela `develop` (julgamento)
- [x] Adicionar `nos: [...]` ao frontmatter de cada nota de raia (2026-11-05, 2610177: 13 notas; 60 nós do mermaid, cada um com um dono; R5 não existe no mermaid; provisórias: 01 fica com V0.1–V0.7 e V0C, 05 com E1–E6 até a divisão)
- [x] Antes de mexer numa nota, salvar a lista de fatos dela em `_v3/fatos/<nota>.md` (feito para 05-Estoque, 01-Proposta, 02, 03, 06, 13 e 14; as de 13 e 14 foram tiradas do commit b27a30d, antes da troca, porque a foto não foi feita antes da edição)
- [x] Dividir as notas provisórias (uma divisão por tarefa)
  - [x] 05-Estoque-Atendimento-e-Despacho → 05-Estoque-Atendimento (E1–E4), 09-Estoque-Entrada-do-Lote (E5), 12-Estoque-Despacho (E6) (2026-11-05, 4c146bb e decdb4d: 36 links decididos um por um em `_v3/scripts/links-divisao-estoque.mjs`; regras 9 e 11 → 09, regra 10 → 12; fatos 307/307 e 116/116)
  - [x] 01-Proposta-e-Pedido-de-Venda → 01-Proposta-de-Venda (V0.1–V0.7, V0C) (2026-11-05, b27a30d; links decididos em `_v3/scripts/renomear-proposta.mjs`; "Datas do pedido" do Mestre passou a apontar para 06, porque a nota de proposta não tinha esse conteúdo)
- [x] Mover os trechos de nós com mais de uma casa (C6–C8 → 06 em c122c9b; V1–V3, liberação e cancelamento do pedido → 03 em b34dee0; B2–B4 → 02 em 315a621; P3: nada a mover, as outras notas só citam com link)
- [x] Trocar `10.1–10.4` e `11.1` pelos IDs de nó (2026-11-05, c13593a: 40 trocas em 12 notas; conferido em app-pcp 93f96de e api-pcp befd973; Mapa-v1-para-v2 e Registro-de-Decisoes ficaram como estão)
- [x] Reconferir os selos de cada raia contra a `origin/develop` (F5) (2026-11-05, até 8351ea6. Decisão do Nathan: commit da develop uma vez por nota, em `develop-conferida`; cada ✅ cita repositório e arquivo:linha. Relatórios em `_v3/selos/`. 25 linhas corrigidas por script e 34 à mão (`_v3/fatos/substituicoes.tsv`); 100 ✅ ganharam o repositório; 3 ✅ viraram 📝; JSON do Orçamento 🔴 → ✅ removidos (av-hub c851cda). Limite: a checagem de conteúdo é por identificador perto da linha; ~50 citações sem identificador seguem só com arquivo e intervalo conferidos)
- [x] Aplicar o F3 nas notas de proposta, orçamento e compras (2026-11-05, 10e5e3b: Nathan confirmou que o `api-comercial` será removido integralmente; 35 selos das notas 01 e 02 passam a 🔴 "sem API e sem banco"; na 06 nada dependia dele. Na API do Hub ficam ✅ as rotas da proposta e a leitura de fornecedores, vínculos, categorias, cotações e parâmetros de custo; `produtos/:id/precos` e `matriz_precos` são apontadas pelo BFF mas não existem na `api-acos-vital`)
- [x] Conferir as listas de `_v3/fatos/` (2026-11-05: 0 fatos sumiram em 7 listas; trocas de linha e de caminho registradas em `_v3/fatos/substituicoes.tsv`)

### Bloco 4: Navegação, padrão e regras
- [x] Rodar a seção 1 (2026-11-05: `develop` dos sistemas sem mudança desde o Bloco 0; `origin/main` do vault sem commit novo; `v3` em dia com `origin/v3`; autocrlf false; Obsidian sem processo rodando)
- [x] Cabeçalho padrão: "Em uma frase" (já existia nas 15), "Quando consultar" e "Onde estamos no fluxo" (← anterior | próxima →, nós da nota) (2026-11-05, 49b988a, script `_v3/scripts/cabecalho-raias.mjs`)
- [x] Frontmatter: `ordem`, `nos`, `anterior`, `proxima`, `estado-em` (no lugar de `atualizado`, com a data da reconferência do Bloco 3, 2026-11-05) e `develop-conferida` (já do Bloco 3). O Mestre ganhou `ordem: 0` e `proxima` (49b988a)
- [x] Aplicar nas notas de raia, uma por tarefa (2026-11-05, ebd8b8b … 7c65b17: 15 commits). "Detalhe técnico" já era a última seção nas 15
- [x] Atualizar o `Regras-do-Vault` (2026-11-05, cf9a469: tabela de selos do F5, `develop-conferida`, F3, numeração e cabeçalho das raias, frontmatter novo, contratos da v2 pelo índice e próximos IDs, fontes da verdade com a `develop` primeiro). Mudança de vocabulário de status de contrato novo: `implementado-no-codigo` → `implementado-na-develop`; `aplicado-em-producao` saiu (publicado na `main` é informação)
- [x] Atualizar o `Guia-de-Leitura-do-Vault-e-dos-Sistemas` (2026-11-05, 140619c: seção "Antes de tudo: preparar o ambiente" (seção 1) e F1–F5; ordem das raias da v3; `Contratos-da-v2` no lugar do `Painel-de-Contratos` (linhas 112 e 133 da v2); `api-comercial` pelo F3; `omie-elt-pipeline` = `origin/master`; selos 🟡/🔴 pela `develop`; caminho da RAIZ mantido (D7); "Comando: atualizar o vault" mantido)
- [x] Atualizar o aviso de "produção" em `Onde-Estamos` pelo F5 (2026-11-05, 6b8a135; o fato "em uso real só dashboards, vagas e gerência" foi mantido)
- [x] Extra: legendas de selo com "❓ não conferido em produção" no Glossário, Mestre, Backlog e Comissão/01 passam ao F5 (7d138c9). Os "produção ❓" sobre o envio real da OC ao Omie (PS-009) ficaram: falam do ambiente real do Omie, não da `main`

### Bloco 5: Dividir os arquivos grandes (julgamento)
- [x] Rodar a seção 1 (2026-11-05: nada novo na `develop` nem na `main`; `v3` = `origin/v3` 2b45a3e; Obsidian sem processo rodando)
- [x] Medir todas as notas: 20 acima de 25 KB fora de `_v3/` (raias 00, 01, 02, 03, 06, 07, 15; Telas; AV-Hub-API; MES-Backend; Conexao e Mapa do Pablo; Comissão 01 e 03; Integracao-AvHub-MES; Mapa-IncluirPedido-Omie; Contratos-da-v2; Backlog; Perguntas; Registro). As fotos de `_v3/fatos/` ficam fora do limite (material de trabalho)
- [x] Salvar a lista de fatos de cada nota antes de dividir (2026-11-05, 0a8e405: `_v3/fatos/bloco5/`, 20 listas; `fatos.mjs` ganhou `--pasta=`, porque já havia fotos do Bloco 3 com o mesmo nome)
- [x] Dividir uma nota por tarefa (2026-11-05, 52cde97 … dad1efa: 19 commits, script `_v3/scripts/dividir.mjs` com o plano de cada nota). Regra: a original fica com o resumo e um índice no lugar da seção grande; o texto movido vai sem mudança para `<pasta>/Partes/<nota>-...`, com `parte-de` e o frontmatter da original (inclusive `develop-conferida`, sem `nos:`); os títulos sobem um nível (### → ##). 23 links `[[Nota#Seção]]` foram reescritos para a parte (em 01-Proposta e 06). Casos especiais: Mestre (a tabela nó → raia foi cortada por linhas em 3 partes; o diagrama ficou), Registro (N16 em 5 notas por faixa de ID; N14, DEC/EN/EC/#1–#38, #39–#80 e #81–#100 + estado no código em 4 notas; o texto das decisões não mudou), Backlog (uma nota por frente), Perguntas (Quadro geral e OQ-02 a OQ-30), Contratos-da-v2 (lista completa numa parte; o índice ficou com os pendentes e os contratos novos)
- [x] Conferir a lista de fatos depois da divisão (2026-11-05: 0 fatos sumiram em 20 listas, 8.607 fatos; 11 linhas "conferir à mão", todas esperadas: 7 links cujo alvo virou a parte e 4 instruções de uso do Registro reescritas de propósito; `_v3/fatos/bloco5/conferencia.txt`). `fatos.mjs conferir` passou a ignorar flags como nome de nota
- [x] Extras: `build.mjs` do mapa lê os IDs também em `Contratos-da-v2-Lista-Completa` (442770a; 0 contratos sem nota); Regras e Guia explicam as notas divididas (ea913a1); o validador confere os selos também nas partes das raias e conta os contratos nas partes (859f4ce)

### Blocos 6 a 9
- [ ] Pendentes (ver `_v3/INSTRUCAO.md`, seção 8)

## Validações
Base v2 (2026-11-05, `_v3/validacao-base-v2.md`): 186 notas; 0 links quebrados; 0 CRLF; 0 caracteres corrompidos reais (o único achado é o texto da própria instrução); 37 notas acima de 25 KB; 354 links de contrato (regex `LOG|SQL|API|CON|ATV-n`) em 52 notas fora de `06-Contratos` (a instrução cita 1.278; a diferença será reconciliada no Bloco 1). Ajuste na checagem: `Ã` sozinho é letra válida em português, então só `Ã` + byte de continuação, `â€` e `�` contam.

### Bloco 1 (2026-11-05, `_v3/validacao-bloco1.md`)
92 notas; 0 links quebrados; 0 órfãs; 0 CRLF; 0 corrompidos; 0 links para contrato da v2 fora do índice; índice com 92 contratos distintos; 19 notas acima de 25 KB (Bloco 5); mapa regenerado (12 fichas). Validador ajustado: `_v3/` fica fora de órfãs e de codificação (cita os padrões de propósito).

### Bloco 2 (2026-11-05, `_v3/validacao-bloco2.md`)
95 notas; 0 links quebrados; 0 órfãs; 0 CRLF; 0 corrompidos; 0 links para contratos da v2; índice com 92; nomes antigos: só 2 (`Painel-de-Contratos` entre crases no Guia, para o Bloco 4); mapa regenerado. O validador ganhou a checagem de nomes antigos (links e crases) a partir do CSV.

### Bloco 3 (2026-11-05, `_v3/validacao-bloco3.md`)
0 links quebrados; 0 órfãs; 0 CRLF; 0 corrompidos; 60 nós com dono único; todo ✅ das raias cita repositório ou arquivo e cada raia tem `develop-conferida`; 0 fatos sumiram; mapa ok. 24 notas acima de 25 KB (Bloco 5); 2 nomes antigos no Guia (Bloco 4).

### Bloco 4 (2026-11-05, `_v3/validacao-bloco4.md`)
0 links quebrados; 0 órfãs; 0 CRLF; 0 corrompidos; 0 nomes antigos (as 2 crases do Guia foram resolvidas); 60 nós com dono único; 0 ✅ sem citação; mapa regenerado (12 fichas, 0 contratos sem nota). A cadeia `proxima` vai do Mestre à 15 passando pelas 15 raias na ordem do F1. 24 notas acima de 25 KB (Bloco 5).

### Bloco 5 (2026-11-05, `_v3/validacao-bloco5.md`)
192 notas; 0 links quebrados; 0 órfãs; 0 CRLF; 0 corrompidos; **0 notas acima de 25 KB** (fora de `_v3/`); índice de contratos com 92 (índice + parte); 0 nomes antigos; 60 nós com dono único; 0 ✅ sem citação (agora também nas partes das raias); mapa regenerado (12 fichas, 0 contratos sem nota); fatos: 0 sumiram.

## Problemas e pendências
- `_v3/scripts/contratos-indice.mjs` (Bloco 1) regenera o `Contratos-da-v2` inteiro numa nota só; se for rodado de novo, a lista completa volta para o índice. Não rodar sem ajustar para a parte `Contratos-da-v2-Lista-Completa`.
- A tabela do Mestre foi cortada por tamanho (V0.1 a E1, E2 a Q2, Q3 a K6), não por raia. Dá para reagrupar por raia no Bloco 8, se o Nathan preferir.
- Referências entre crases a `Painel-de-Contratos`: as do Guia saíram no Bloco 4; ficam no frontmatter `fontes` de `Onde-Estamos` (histórico) e em `Analise-de-Organizacao-do-Vault` (exceção).
- Nathan precisa avisar Robert e Gustavo que a `main` do vault fica congelada (D4).
- `omie-elt-pipeline` sem `develop`: confirmar que `origin/master` é a base correta.

## Histórico de retomadas
(nenhuma)
