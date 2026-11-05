---
tags: [contrato, modelo, entrega]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Nathan
fontes: [pedido do Nathan de 05/11/2026, Regras-do-Vault (F5), Manual-de-Manutencao-do-Vault]
---

# Modelo de relatório de entrega

**Em uma frase:** é o formato para quem terminou uma task contar ao Nathan o que entrou na `develop` e o que precisa mudar no vault, já com o texto proposto, para ele só conferir e aplicar.

**Quando consultar:** quando uma task (`BL-NNN`) ou um contrato (`LOG`, `SQL`, `API`) **já está na `develop`**. Para pedir uma mudança nova, use o [[Modelo-de-Contrato]]; para uma pergunta de negócio, o [[Modelo-de-Consulta]].

## Só vale para o que está na `develop`

A regra do vault (F5) é: **se está na `develop`, está pronto**. Trabalho que ainda está só numa branch de feature **não** gera relatório. Faça o merge na `develop` primeiro. A IA confere isso antes de escrever e para se não estiver lá.

## Quem escreve e como chega ao vault

- Quem fez a task escreve, normalmente pela IA, com a skill `relatorio-de-entrega` (`.claude/skills/relatorio-de-entrega/SKILL.md`), e manda o PDF no grupo.
- O Nathan aplica no vault com a skill `aplicar-documento-recebido`. A IA dele confere cada item na `develop` antes de mudar qualquer nota.

## Regras de escrita

1. **O texto atual do vault é copiado igual**, palavra por palavra, para o Nathan achar o trecho.
2. **Toda entrega cita a origem:** repositório, commit da `develop` e arquivo:linha.
3. **Só proponha ✅ para o que está na `develop`.** Parcial é 🟡.
4. **Diga o que ficou de fora.** Um relatório que só conta o que deu certo esconde pendência.
5. **Uma task por relatório** (ou um grupo de tasks do mesmo contrato).
6. **Nada inventado.** Divergência entre o vault e o código vai para a seção própria, com os dois lados.

## Estrutura do documento

```
---
tipo: relatorio-de-entrega
autor: <nome>
data: AAAA-MM-DD
tasks: [BL-NNN, ...]
contratos: [LOG-NN, ...]
nos_0b: [C4, ...]
develop-conferida: [api-acos-vital <commit>, ...]
commits: [<hash> <mensagem curta>, ...]
---
# Entrega · <task> · <título curto>
## Resumo em linguagem simples        o que passou a funcionar e para quem (até 6 linhas)
## O que foi entregue                 um item por mudança: o que faz; repositório, commit, arquivo:linha
## O que ficou de fora ou parcial
## Mudanças propostas no vault        tabela abaixo, uma linha por trecho
## Status das tasks e contratos       BL-NNN: 🔴 → ✅; LOG-NN: parcial → implementado-na-develop
## Divergências entre o vault e o código
## Perguntas para o Nathan
## Bloco para a IA do Nathan
## Mensagem pronta para o WhatsApp
```

Tabela de "Mudanças propostas no vault":

| Nota | Seção | Texto atual (copiado igual) | Texto proposto | Selo atual → proposto | Origem |
|---|---|---|---|---|---|

## Bloco para a IA do Nathan

```
tipo: relatorio-de-entrega
autor:
data: AAAA-MM-DD
tasks: []
contratos: []
develop-conferida: []
mudancas:
  - nota: <nome exato da nota>
    secao: <seção>
    texto_atual: "<copiado igual>"
    texto_proposto: "<novo>"
    selo: "🔴 -> ✅"
    origem: "<repositório> <commit> <arquivo:linha>"
status:
  - id: BL-NNN
    de: 🔴
    para: ✅
perguntas: []
```
