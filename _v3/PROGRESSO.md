# Progresso da v3
Estado atual: Bloco 3, divisão de 01-Proposta-e-Pedido-de-Venda (próxima tarefa)
Próxima ação: salvar `_v3/fatos/01-Proposta-e-Pedido-de-Venda.md`, ler a nota por seções (47 KB) e dividir
Branch: v3   Último commit: (ver `git log`)   Push: sim   Atualizado em: 2026-11-05

## Ambiente (última preparação)
Data: 2026-11-05  Vault: branch `v3` criada a partir de `main` 5203232 (tag `v2-antes-da-v3`); `origin/v3` ainda não existe  origin/main: 5203232 (sem commits novos)
origin/develop: api-acos-vital b97981c · av-hub 2e5456d · api-pcp befd973 · app-pcp 93f96de · omie-elt-pipeline **sem develop** (só `origin/master` 5e7e94d)
autocrlf: false (ajustado só no vault; estava `true`)   Obsidian fechado: sim no Bloco 1 e no Bloco 2 (processo não está rodando, conferido em 2026-11-05)
Observações:
- `omie-elt-pipeline` não tem `develop` nem `main`: a base é `origin/master`. Avisado ao Nathan.
- Primeiro fetch de api-pcp, app-pcp e omie falhou por rede; repetido com sucesso.
- Repositórios dos sistemas estão em branches locais próprias (api-acos-vital e av-hub em `feat/...`); não foram tocados. A leitura é sempre por `origin/develop`.
- A `main` do vault tinha working tree limpo: os 4 arquivos da D2 já foram commitados (PR #73).

## Fatos do Nathan
F1 ordem do mermaid · F2 contratos ficam na v2 · F3 módulo do Pablo sem API e sem banco · F4 Obsidian fechado · F5 base = develop
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
- [~] Antes de mexer numa nota, salvar a lista de fatos dela em `_v3/fatos/<nota>.md` (script `_v3/scripts/fatos.mjs`; feito: 05-Estoque-Atendimento-e-Despacho, 5136542)
- [ ] Dividir as notas provisórias (uma divisão por tarefa)
  - [x] 05-Estoque-Atendimento-e-Despacho → 05-Estoque-Atendimento (E1–E4), 09-Estoque-Entrada-do-Lote (E5), 12-Estoque-Despacho (E6) (2026-11-05, 4c146bb e decdb4d: 36 links decididos um por um em `_v3/scripts/links-divisao-estoque.mjs`; regras 9 e 11 → 09, regra 10 → 12; fatos 307/307 e 116/116)
  - [ ] 01-Proposta-e-Pedido-de-Venda → 01-Proposta-de-Venda (V0.1–V0.7, V0C); trechos de V1–V3 para 03, B1–B4 para 02, C6–C8 para 06
- [ ] Mover os trechos de nós com mais de uma casa (C6–C8, B1–B4, V1–V3, P3) para a nota dona
- [ ] Trocar `10.1–10.4` e `11.1` pelos IDs de nó (X1, X3, X4 e a ligação do O1)
- [ ] Reconferir os selos de cada raia contra a `origin/develop` (F5), uma raia por tarefa
- [ ] Aplicar o F3 nas notas de proposta, orçamento e compras
- [ ] Conferir as listas de `_v3/fatos/`

### Blocos 4 a 9
- [ ] Pendentes (ver `_v3/INSTRUCAO.md`, seção 8)

## Validações
Base v2 (2026-11-05, `_v3/validacao-base-v2.md`): 186 notas; 0 links quebrados; 0 CRLF; 0 caracteres corrompidos reais (o único achado é o texto da própria instrução); 37 notas acima de 25 KB; 354 links de contrato (regex `LOG|SQL|API|CON|ATV-n`) em 52 notas fora de `06-Contratos` (a instrução cita 1.278; a diferença será reconciliada no Bloco 1). Ajuste na checagem: `Ã` sozinho é letra válida em português, então só `Ã` + byte de continuação, `â€` e `�` contam.

### Bloco 1 (2026-11-05, `_v3/validacao-bloco1.md`)
92 notas; 0 links quebrados; 0 órfãs; 0 CRLF; 0 corrompidos; 0 links para contrato da v2 fora do índice; índice com 92 contratos distintos; 19 notas acima de 25 KB (Bloco 5); mapa regenerado (12 fichas). Validador ajustado: `_v3/` fica fora de órfãs e de codificação (cita os padrões de propósito).

### Bloco 2 (2026-11-05, `_v3/validacao-bloco2.md`)
95 notas; 0 links quebrados; 0 órfãs; 0 CRLF; 0 corrompidos; 0 links para contratos da v2; índice com 92; nomes antigos: só 2 (`Painel-de-Contratos` entre crases no Guia, para o Bloco 4); mapa regenerado. O validador ganhou a checagem de nomes antigos (links e crases) a partir do CSV.

## Problemas e pendências
- Referências entre crases a `Painel-de-Contratos` ficam no `Guia-de-Leitura` (linhas 112 e 133; atualizar no Bloco 4), no frontmatter `fontes` de `Onde-Estamos` (histórico) e em `Analise-de-Organizacao-do-Vault` (exceção).
- Nathan precisa avisar Robert e Gustavo que a `main` do vault fica congelada (D4).
- `omie-elt-pipeline` sem `develop`: confirmar que `origin/master` é a base correta.

## Histórico de retomadas
(nenhuma)
