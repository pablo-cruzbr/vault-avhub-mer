# Progresso da v3
Estado atual: Bloco 0, em andamento (ambiente, decisões, branch e tag feitos; faltam perguntas de aceite e validação base)
Próxima ação: escrever `_v3/perguntas-de-aceite.md` (10 perguntas conferidas na `develop`) e criar `_v3/scripts/validar.mjs`
Branch: v3   Último commit: (ver `git log`)   Push: não   Atualizado em: 2026-11-05

## Ambiente (última preparação)
Data: 2026-11-05  Vault: branch `v3` criada a partir de `main` 5203232 (tag `v2-antes-da-v3`); `origin/v3` ainda não existe  origin/main: 5203232 (sem commits novos)
origin/develop: api-acos-vital b97981c · av-hub 2e5456d · api-pcp befd973 · app-pcp 93f96de · omie-elt-pipeline **sem develop** (só `origin/master` 5e7e94d)
autocrlf: false (ajustado só no vault; estava `true`)   Obsidian fechado: a confirmar antes dos blocos 1, 2, 3 e 5
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
- [~] Criar `_v3/PROGRESSO.md`; commitar; testar o push
- [ ] Escrever `_v3/perguntas-de-aceite.md` com 10 perguntas-padrão; pedir aprovação
- [ ] Rodar a validação (seção 9) na v2 e gravar o resultado como base

### Bloco 1: Retirar os contratos da v2
- [ ] Gerar o índice `Contratos-da-v2` e conferir as 97 linhas e os links do GitHub
- [ ] Reescrever os links de contrato e do Painel por script
- [ ] Mostrar ao Nathan uma amostra de 20 links reescritos
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
(a base da v2 será gravada aqui ao fim do Bloco 0)

## Problemas e pendências
- Nathan precisa avisar Robert e Gustavo que a `main` do vault fica congelada (D4).
- `omie-elt-pipeline` sem `develop`: confirmar que `origin/master` é a base correta.

## Histórico de retomadas
(nenhuma)
