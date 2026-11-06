---
tags: [contrato, modelo]
criado: 2026-11-05
estado-em: 2026-11-06
status: vigente
dono: Nathan
fontes: [pedido do Nathan de 05/11/2026 e de 06/11/2026 (contrato em arquivo único, com todas as camadas), Regras-do-Vault, Manual-de-Manutencao-do-Vault (seção 6), Tipos-de-ID]
---

# Modelo de contrato (arquivo único, todas as camadas)

**Em uma frase:** todo contrato de mudança é **um arquivo só**, que explica o que deve ser feito e por quê, e detalha cada camada que a demanda toca (frontend, backend, API e banco), para quem implementa não precisar de mais nada.

**Quando consultar:** antes de escrever um contrato. Para uma **pergunta** de negócio (não uma mudança), use o [[Modelo-de-Consulta]]. Para contar uma task **já feita**, use o [[Modelo-de-Relatorio-de-Entrega]].

## Quem escreve e como entra no vault

| Quem | Como | Skill |
|---|---|---|
| **Admin do vault**: Nathan (GitHub `oluccaa`) | Cria o contrato **direto no vault**, numa branch, com ID final, e abre o PR | `criar-contrato` |
| Robert, Gustavo, Pablo | Escrevem no mesmo formato e mandam **em PDF** no grupo; o Nathan dá o ID e registra | `pedir-contrato` |

Só o admin escolhe o ID final. No PDF, quem escreve põe `id: a definir pelo Nathan`.

## Um arquivo, todas as camadas

- **Um contrato por demanda**, com todas as camadas que ela toca no mesmo arquivo. Não se abre um contrato para o banco e outro para a tela da mesma entrega.
- **Cada camada tem a sua seção.** Se a demanda não mexe numa camada, a seção fica com "**Não se aplica:** <motivo em uma linha>". Nunca apague a seção.
- **O prefixo do ID é a camada principal**, onde está a maior parte do trabalho ou a decisão central:

| Prefixo | Camada principal | Exemplo |
|---|---|---|
| `LOG` | Regra de negócio ou fluxo (backend e telas seguem a regra) | "Pedido do Omie chega travado até o vendedor liberar" |
| `SQL` | Banco (tabela, migration, view, função) | "Imposto na linha da OC" |
| `API` | Rota de API entre sistemas ou para o front | "`GET /itens/custo` do MES para o hub" |

Os prefixos e os próximos números livres estão em [[Tipos-de-ID]] e no fim do [[Contratos-da-v2]].

## Regras de escrita

1. **O porquê vem antes do como.** O contexto diz o problema, quem sofre com ele e o que acontece se não for feito.
2. **Resumo em linguagem simples em cima, detalhe técnico nas seções de camada.** Quem não programa precisa entender o topo.
3. **Toda afirmação tem origem:** repositório, `origin/develop`, commit e arquivo:linha; ou a nota e o ID do vault (`N16-60`, `BL-035`, `V0.3`).
4. **Só é ✅ o que está na `develop`** (regra F5). O resto é 🟡 (parcial), 🔴 (não existe) ou 📝 (decidido, sem código).
5. **Cada item de mudança é testável.** O critério de aceite diz o que conferir na `develop` para dar como feito, camada por camada.
6. **Nomes exatos:** tabelas, colunas, rotas, telas e valores de enum vão em `código`, com o nome real (ou o proposto, marcado como novo).
7. **Nada inventado.** O que não se sabe vai para "Riscos, rollback e perguntas em aberto".

## Estrutura do arquivo

```
---
id: <LOG-NN | SQL-NNN | API-NNN>       (no PDF: a definir pelo Nathan)
titulo: <título curto>
status: proposta | para-implementar
autor: <quem escreveu>
data: AAAA-MM-DD
camadas: [frontend, backend, api, sql]  (só as que a demanda toca)
donos: {frontend: <nome>, backend: <nome>, api: <nome>, sql: <nome>}
nos_0b: [V1, C4, ...]
notas_afetadas: [06-Circuito-de-Compra, ...]
depende_de: [BL-NNN, LOG-NN, ...]
decisoes: [N16-NN, ...]
develop-conferida: [api-acos-vital <commit>, av-hub <commit>, api-pcp <commit>, app-pcp <commit>]
---
# <ID> · <título curto>

## 1. Resumo em linguagem simples
O que muda, para quem, e o resultado esperado. Até 6 linhas.

## 2. Contexto: o que deve ser feito e por quê
- O problema hoje (com exemplo real: pedido, OC, item).
- Quem sofre com ele (setor, perfil).
- De onde vem a demanda (decisão N16-NN, BL-NNN, consulta, pedido de alguém).
- O que acontece se não for feito.

## 3. Onde fica no fluxo
Nós do 0b, raias e notas do vault afetadas (nome exato de cada nota).

## 4. Como está hoje
O que o vault diz e o que a develop tem, camada por camada, com origem.

## 5. Regras de negócio
Lista numerada (R1, R2...). Cada regra com a decisão de origem.

## 6. Frontend
Não se aplica: <motivo>  — ou:
- Sistema e tela: av-hub (HUB) ou app-pcp (MES); nome da tela, rota do front e nome antigo, se houver.
- O que muda na tela: campos, colunas, filtros, botões, textos exatos.
- Estados: carregando, vazio, erro (mensagem exata), sem permissão.
- Validações no front e o que é só exibição.
- BFF: rotas do BFF tocadas.

## 7. Backend
Não se aplica: <motivo>  — ou:
- Repositório e módulo (ex.: api-acos-vital src/schemas/core_comercial/...).
- Regras aplicadas no servidor (R1, R2...), validações e transação.
- Jobs, filas, integrações (Omie, MES) e o que acontece se a integração falhar.
- Logs e auditoria (o que fica registrado e onde).

## 8. API
Não se aplica: <motivo>  — ou, para cada rota:
| Método | Rota | Quem chama | Perfil/permissão |
- Request: corpo e parâmetros, com tipos e obrigatoriedade (exemplo em JSON).
- Response: corpo de sucesso (exemplo em JSON) e paginação, se houver.
- Erros: código HTTP, código interno e mensagem exata.
- Idempotência e o que acontece em chamada repetida.

## 9. Banco (SQL)
Não se aplica: <motivo>  — ou:
- Banco e schema (av-hub: core_*, auth, historico, omie_*; MES: public).
- Tabelas e colunas: nome, tipo, nulo, default, nova ou alterada.
- Constraints, índices, chaves estrangeiras.
- Migration: o que faz (up) e como desfaz (down); quem aplica e em que ambiente.
- Views e funções novas ou alteradas.
- Dados existentes: precisam de carga ou correção? Como.

## 10. Permissões e perfis
Quais perfis veem e fazem o quê (RBAC). Admin (Dev) não é ator.

## 11. Integrações afetadas
MES ↔ av-hub, Omie, pipeline: o que muda em cada lado. "Nenhuma", se for o caso.

## 12. Critérios de aceite
Por camada, verificáveis na develop:
- [ ] Frontend: ...
- [ ] Backend: ...
- [ ] API: ...
- [ ] Banco: ...

## 13. Como testar
Cenários com dados concretos (o caminho feliz, o erro principal e o limite).

## 14. Ordem de implementação e responsáveis
Normalmente: banco → backend/API → frontend. Quem faz cada parte e o que bloqueia o quê.

## 15. Riscos, rollback e perguntas em aberto

## 16. Impacto no vault quando for entregue
Notas e selos que mudam (raias, Backlog, Onde-Estamos). É o que o relatório de entrega vai propor.

## Bloco para a IA do Nathan        (só quando o contrato vai em PDF)
## Mensagem pronta para o WhatsApp  (2 ou 3 linhas)
```

## Bloco para a IA do Nathan (contrato enviado em PDF)

Última página do PDF, em bloco de texto, para o Nathan registrar sem reescrever:

```
tipo: contrato
id_sugerido: LOG | SQL | API
titulo:
autor:
data: AAAA-MM-DD
camadas: []
donos: {}
nos: []
notas_afetadas:
  - nota: <nome exato da nota>
    secao: <seção>
    acao: <incluir link para o contrato | registrar pendência | ...>
decisoes: []
depende_de: []
develop-conferida: []
perguntas: []
```

## Depois que entra no vault

O contrato fica em `06-Contratos/Ativos/<ID>-<Apelido>.md` com status `proposta` ou `para-implementar`, entra na seção "Contratos novos (v3)" do [[Contratos-da-v2]] e passa a ser citado na raia de cada nó afetado. Quando estiver na `develop`, quem fez manda o relatório pelo [[Modelo-de-Relatorio-de-Entrega]], e o status passa a `implementado-na-develop` (pasta `Entregues/`).
