---
tags: [contrato, modelo]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Nathan
fontes: [pedido do Nathan de 05/11/2026, Regras-do-Vault, Manual-de-Manutencao-do-Vault (seção 6), Tipos-de-ID]
---

# Modelo de contrato de mudança (`LOG`, `SQL`, `API`)

**Em uma frase:** é o formato de todo pedido de mudança no sistema (regra, banco ou rota de API), para quem escreve dizer tudo o que o Nathan e quem implementa precisam, sem ida e volta.

**Quando consultar:** antes de escrever um contrato novo. Para uma **pergunta** de negócio (não uma mudança), use o [[Modelo-de-Consulta]]. Para contar uma task **já feita**, use o [[Modelo-de-Relatorio-de-Entrega]].

## Qual tipo usar

| Tipo | Quando | Exemplo |
|---|---|---|
| `LOG` | Regra de negócio ou fluxo (o que o sistema faz, em que ordem, quem pode) | "Pedido do Omie chega travado até o vendedor liberar" |
| `SQL` | Banco: tabela, coluna, migration, view, função | "Coluna de imposto na linha da OC" |
| `API` | Rota de API entre sistemas ou para o front | "`GET /itens/custo` do MES para o hub" |

Se a mudança tocar dois tipos, escolha o principal e cite o outro em "O que precisa mudar". Os prefixos estão em [[Tipos-de-ID]].

## Quem escreve e quem numera

- **Qualquer pessoa do time escreve.** Normalmente pela IA, com a skill `pedir-contrato` (`.claude/skills/pedir-contrato/SKILL.md`). O documento vai em PDF para o grupo do WhatsApp.
- **O ID final é sempre do Nathan.** Quem escreve põe `id: a definir pelo Nathan` e sugere o tipo. Assim não nascem dois `LOG-56` ao mesmo tempo.
- O Nathan registra o contrato no vault pelo [[Manual-de-Manutencao-do-Vault]] (seção 6) e responde no grupo com o ID dado.

## Regras de escrita

1. **Resumo em linguagem simples em cima, detalhe técnico embaixo.** Quem não programa precisa entender o topo.
2. **Toda afirmação tem origem:** repositório, `origin/develop`, commit e arquivo:linha; ou a nota e o ID do vault (`N16-60`, `BL-035`, `V0.3`).
3. **Só é ✅ o que está na `develop`** (regra F5). O resto é 🟡 (parcial), 🔴 (não existe) ou 📝 (decidido, sem código).
4. **Uma mudança por contrato.** Se crescer, divida em dois contratos que dependem um do outro.
5. **Critério de pronto verificável na `develop`:** quem lê sabe exatamente o que conferir no código para dar como feito.
6. **Nada inventado.** O que não se sabe vira pergunta em "Riscos e perguntas em aberto".

## Estrutura do documento

```
---
id: a definir pelo Nathan        (tipo sugerido: LOG | SQL | API)
tipo: Lógica | Banco | API
status: proposta
autor: <nome de quem escreveu>
dono: <quem vai implementar>
data: AAAA-MM-DD
nos_0b: [V1, C4, ...]
notas_afetadas: [06-Circuito-de-Compra, ...]
depende_de: [BL-NNN, LOG-NN, ...]
decisoes: [N16-NN, ...]
develop-conferida: [api-acos-vital <commit>, av-hub <commit>, ...]
---
# <ID a definir> · <título curto>
## Resumo em linguagem simples      o que é, quem é afetado, por que agora (até 6 linhas)
## Onde fica no fluxo               nós do 0b, raias e notas do vault, com o nome exato de cada nota
## Como está hoje                   o que o vault diz e o que a develop tem, com origem
## O que precisa mudar              lista numerada; cada item testável
## Critério de pronto               o que conferir na develop para dar como feito
## Quem faz e de quem depende
## Riscos e perguntas em aberto
## Decisões que este contrato usa ou contraria   IDs do Registro-de-Decisoes
## Detalhe técnico                  tabelas e colunas, rotas, payloads, telas, SQL
## Bloco para a IA do Nathan        lista estruturada (abaixo)
## Mensagem pronta para o WhatsApp  2 ou 3 linhas
```

## Bloco para a IA do Nathan

Última página do PDF, em bloco de texto, para o Nathan colar no vault sem reescrever:

```
tipo: contrato
id_sugerido: LOG | SQL | API
titulo:
autor:
data: AAAA-MM-DD
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

## Depois que o Nathan registra

O contrato ganha o ID, vai para `06-Contratos/Ativos/` com status `proposta` ou `para-implementar`, entra na seção "Contratos novos (v3)" do [[Contratos-da-v2]] e passa a ser citado na raia do nó. Quando estiver na `develop`, quem fez manda o relatório pelo [[Modelo-de-Relatorio-de-Entrega]].
