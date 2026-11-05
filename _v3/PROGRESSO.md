# Progresso da v3
Estado atual: Bloco 1, tarefa 3 (amostra de 20 links aguardando aprovação do Nathan)
Próxima ação: com o "ok" da amostra, rodar `node _v3/scripts/contratos-links.mjs` (grava 372 links em 57 notas) e commitar
Branch: v3   Último commit: (ver `git log`)   Push: sim   Atualizado em: 2026-11-05

## Ambiente (última preparação)
Data: 2026-11-05  Vault: branch `v3` criada a partir de `main` 5203232 (tag `v2-antes-da-v3`); `origin/v3` ainda não existe  origin/main: 5203232 (sem commits novos)
origin/develop: api-acos-vital b97981c · av-hub 2e5456d · api-pcp befd973 · app-pcp 93f96de · omie-elt-pipeline **sem develop** (só `origin/master` 5e7e94d)
autocrlf: false (ajustado só no vault; estava `true`)   Obsidian fechado: sim no Bloco 1 (processo não está rodando, conferido em 2026-11-05)
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
- [~] Reescrever os links de contrato e do Painel por script (`_v3/scripts/contratos-links.mjs`: 372 links em 57 notas na simulação; idempotente; nada sobra fora de código. A contagem da instrução, 1.278, incluía links internos de `06-Contratos`, que saem com as pastas)
- [~] Mostrar ao Nathan uma amostra de 20 links reescritos (`_v3/amostra-links-bloco1.txt`; aguardando ok)
- [ ] Ajustar `build.mjs` e as fichas; rodar `node build.mjs`
- [ ] Mover o `Modelo-de-Consulta` para `Modelos/`; `git rm -r` nos contratos e no Painel

### Bloco 2: Renomear um para um
- [ ] Gerar o `mapa-renomeacao.csv`
- [ ] Rodar o script de renomeação
- [ ] Atualizar as referências entre crases aos nomes de notas
- [ ] Mostrar ao Nathan uma amostra de 20 links reescritos
- [ ] Atualizar `build.mjs`, fichas e `exemplo-mapa-vendas.html`; rodar `node build.mjs`
- [ ] Mover as transversais para `Transversais/`
- [ ] Criar `Mapa-v2-para-v3`

### Bloco 3: Dono único e estado pela `develop` (julgamento)
- [ ] (copiar a lista da seção 8 da instrução quando o bloco começar)

### Blocos 4 a 9
- [ ] Pendentes (ver `_v3/INSTRUCAO.md`, seção 8)

## Validações
Base v2 (2026-11-05, `_v3/validacao-base-v2.md`): 186 notas; 0 links quebrados; 0 CRLF; 0 caracteres corrompidos reais (o único achado é o texto da própria instrução); 37 notas acima de 25 KB; 354 links de contrato (regex `LOG|SQL|API|CON|ATV-n`) em 52 notas fora de `06-Contratos` (a instrução cita 1.278; a diferença será reconciliada no Bloco 1). Ajuste na checagem: `Ã` sozinho é letra válida em português, então só `Ã` + byte de continuação, `â€` e `�` contam.

## Problemas e pendências
- Nathan precisa avisar Robert e Gustavo que a `main` do vault fica congelada (D4).
- `omie-elt-pipeline` sem `develop`: confirmar que `origin/master` é a base correta.

## Histórico de retomadas
(nenhuma)
