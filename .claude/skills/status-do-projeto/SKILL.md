---
name: status-do-projeto
description: Montar o panorama do projeto num formato fixo: o que está pronto na develop, o que falta, o que está parado e o que já foi feito mas o vault ainda não registrou, por raia do fluxo e por pessoa (Robert, Gustavo, Pablo, Nathan). Use quando pedirem "o que falta", "status do projeto", "panorama", "como estamos", relatório para reunião ou para a Diretoria.
---

# Status do projeto (panorama em formato fixo)

Só leitura: funciona para todos e não grava nada no vault. Se o admin quiser registrar o que achar, ele usa depois a skill `atualizar-o-vault`.

## 1. Prepare
1. Prepare o ambiente como manda o `CLAUDE.md` (fetch do vault e dos cinco sistemas; `git pull --ff-only` no vault). Repositório que faltar: "Repositório ausente" no `CLAUDE.md`.
2. Anote o commit de `origin/develop` de cada sistema e compare com `07-Desenvolvimento/Ultima-Atualizacao-do-Vault.md`.

## 2. Leia, nesta ordem (só o necessário)
| Fonte | Para quê |
|---|---|
| `00-Inicio/Onde-Estamos.md` | Estado por setor: é o dono do status |
| `07-Desenvolvimento/Backlog-por-Frente.md` e `07-Desenvolvimento/Partes/Backlog-Frente-*.md` (Robert, Gustavo, Nathan, Nathan-Proposta-Omie-e-Comissao, Comercial-e-Suprimentos) | Tasks `BL` de cada pessoa, com selo |
| Seção "O que falta" de cada raia `02-Fluxo-de-Atividades/01-...` a `15-...` | Pendência por nó do fluxo |
| `07-Desenvolvimento/Pontas-Soltas.md`, `Riscos.md` e `Perguntas-Proposta-Pedido-Comissao.md` | `PS`, `RS` e `OQ` abertos (bloqueios e decisões) |
| `06-Contratos/Contratos-da-v2.md` (contratos ativos e "Contratos novos (v3)") | Contratos em andamento |

Pablo não tem frente própria no Backlog: o trabalho dele está em "Comercial e Suprimentos" e no módulo dele (`03-Sistemas/Mapa-do-Modulo-do-Pablo`, regra F3).

## 3. Confira na `develop`
1. Para cada sistema, liste o que mudou desde a última atualização: `git -C ../<repo> log --oneline <commit-da-ultima-atualizacao>..origin/develop` e `git -C ../<repo> diff --stat <commit> origin/develop`.
2. Para cada task `BL` aberta (🔴, 🟡, ❓) cujo assunto aparece nesses commits ou arquivos, confira com a skill do sistema (`sistema-avhub`, `sistema-mes`, `sistema-pipeline-omie`) se ela ficou pronta. Esses são os candidatos a **"feito mas não registrado"**: cite repositório, commit e arquivo:linha com âncora.
3. Uma task é **parada** quando está aberta e nenhum commit da `develop` desde a última atualização toca o assunto dela. Diga isso como fato ("sem commit relacionado desde <data>"), não como julgamento.
4. Não confira tudo de novo: o que não mudou na `develop` vale como está no vault. Diga isso no grau de certeza.

## 4. Responda sempre neste formato
```
# Status do projeto · <data> · develop: api-acos-vital <c> · av-hub <c> · api-pcp <c> · app-pcp <c> · omie master <c>

## Resumo
3 a 5 linhas: o que avançou desde <data da última atualização>, o que trava e a contagem de tasks por selo (✅ / 🟡 / 🔴 / ❓).

## Por raia (na ordem do fluxo)
| Raia | Estado | O que falta (curto) | Dono | Bloqueio |
(15 linhas, de 01-Proposta-de-Venda a 15-Custo-Real-e-Comissao)

## Por pessoa
### Robert · ### Gustavo · ### Pablo (Comercial e Suprimentos) · ### Nathan
| BL | O que | Selo no vault | Na develop? | Situação: em andamento / parada / feita e não registrada |

## Feito na develop, mas o vault ainda não sabe
Lista com a prova (repositório, commit, arquivo:linha com âncora) e a nota que precisa mudar.

## Bloqueios e decisões pendentes
OQ, CON, PS e RS abertos que travam algo, com quem decide.

## Próximos passos sugeridos
3 a 5 itens, em ordem de impacto.

## Grau de certeza
O que foi conferido na develop agora e o que vem só do vault.
```

## 5. Se pedirem para a reunião ou para a Diretoria
Gere também o PDF com a skill `gerar-pdf` (tipo `Status`). Na versão para a Diretoria, troque o detalhe técnico por linguagem simples e deixe as citações de código só na última seção.
