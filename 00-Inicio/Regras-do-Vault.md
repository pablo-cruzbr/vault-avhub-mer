---
tags: [vault, regras]
criado: 2026-10-14
estado-em: 2026-11-05
status: vigente
dono: Nathan
fontes: [plano de 14/10/2026, instrução da v3 (07-Desenvolvimento/v3/INSTRUCAO.md, fatos F1 a F5 de 05/11/2026)]
---

# Regras do vault

**Em uma frase:** são as regras para escrever e manter as notas, para o vault continuar curto, correto e fácil de ler.

**Quando consultar esta nota:** antes de criar ou editar qualquer nota.

Este vault é o **manual para desenvolver o fluxo de Atividades** do ERP Aços Vital (diagrama 0b). As versões anteriores do vault (v1, tag `arquivo/v1`; v2, tag `v2-final`) estão congeladas e servem só para consulta. Aqui vale uma regra central: **cada nota diz o estado atual**, sem camadas de histórico. O estado é medido na `develop` dos sistemas (F5): o que está na `develop` está pronto.

## Como escrever

- Escreva em português, direto. Uma ideia por frase.
- Abra a nota com "**Em uma frase:**". Quando fizer sentido, acrescente "**Quando consultar**". Nas notas de raia os dois são obrigatórios, seguidos de "**Onde estamos no fluxo**" (veja abaixo).
- Não empilhe "atualizado em" e não use texto riscado (`~~`). O histórico fica no git do vault (a v2 na tag `v2-antes-da-v3`) e no vault anterior. Quando algo muda, reescreva a nota.
- Valores de enum, rotas e nomes de tela vão exatos, em `código`.
- Ligue as notas com `[[links]]` do Obsidian. Todo link tem de resolver.
- Faça os diagramas em mermaid. Cada diagrama de fluxo usa os mesmos IDs de nó do [[00-Fluxo-Mestre-0b]].
- Em nota longa, o resumo vem no topo. Caminhos de código, colunas, rotas e contas ficam numa seção "Detalhe técnico" no fim (pedido do Nathan, 29/10/2026).
- Nota acima de ~25 KB é dividida: a original vira índice curto e os IDs são preservados.

## Notas de raia: nomes, numeração e cabeçalho

- As notas de `02-Fluxo-de-Atividades` seguem a **ordem do fluxo do mermaid** (F1): `01-Proposta-de-Venda` … `15-Custo-Real-e-Comissao`. O número é a posição no fluxo, não a ordem em que a nota foi escrita.
- Cada nó do mermaid tem **uma nota dona** só, listada no `nos:` dela. As outras notas citam o nó com uma frase e o link.
- Nota nova entre duas existentes usa letra (`06a-...`), para não renumerar as outras. IDs de nó e de decisão nunca mudam.
- Notas que não são etapa do fluxo (estados, telas) ficam em `02-Fluxo-de-Atividades/Transversais/`, sem número.
- Os números de tela da v1 (`10.1`, `11.1`) não são usados: cite o ID do nó (`X1`, `O1`).
- O cabeçalho de toda nota de raia é:

```markdown
# Título da raia (nós)

**Em uma frase:** o que acontece nesta etapa, em linguagem simples.

**Quando consultar:** dúvidas sobre ...

**Onde estamos no fluxo:** ← [[nota-anterior]] | [[próxima-nota]] → · nós desta nota: `X1`, `X2`
```

Depois do cabeçalho vêm, nesta ordem: "Como funciona, passo a passo", "Exemplo", "Quem atua", "Regras que valem", "O que já existe e o que falta" e, sempre por último, "Detalhe técnico".

## Selos de confiança

Toda afirmação relevante leva um selo. A base é a `develop` dos sistemas (F5); a `main` não é critério de pronto e só aparece como informação ("publicado na `main`: sim/não").

| Selo | Significa |
|---|---|
| ✅ | Está na `develop` (citar repositório, commit e arquivo:linha com âncora) |
| 📝 | Decidido (citar o ID da decisão) |
| 🟡 | Parcial na `develop` |
| 🔴 | Não está na `develop` |
| ❓ | Não conferido na `develop` |

- O commit da `develop` lido fica uma vez por nota, no `develop-conferida` do frontmatter; cada ✅ cita o repositório e o arquivo:linha.
- **Citação de código com âncora:** `` `repositório` `caminho/arquivo:linha` (`âncora`) ``, em que a âncora é um trecho literal e curto daquela linha (nome de função, constante, rota). Exemplo: `api-acos-vital` `src/schemas/core_vendas_faturamento/tables/ordens_compra/ordens_compra.route.js:42` (`EXIGIR_PODE_APROVAR`). A linha muda quando o código muda; a âncora deixa achar o lugar de novo. Toda citação nova leva âncora; as antigas ganham âncora quando a nota for mexida. `node scripts/conferir-citacoes.mjs` aponta as citações quebradas ou deslocadas.
- **Módulo do Pablo** (proposta e suprimentos, F3): o que for dele e não estiver na `develop` é 🔴 "sem API e sem banco". O `api-comercial` de teste (`av-hub/api-comercial`) será removido inteiro e não conta como pronto. Quando a parte chegar à `develop`, o selo vira ✅.

## Nomes de telas

Use o nome novo. O código ainda usa o antigo em alguns pontos, então registre as duas formas.

| Nome novo | Nome antigo | Rota |
|---|---|---|
| Triagem do Pedido | Carteira | `/carteira` |
| Destinação do Pedido | Nova Ordem de Produção | `/ordens-producao/novo` |
| Acompanhamento dos Pedidos | Lista de Ordens de Produção | |

## O perfil `Admin (Dev)` não é ator

`Admin (Dev)` é um perfil de **teste** do time de TI (Nathan, Robert, Pablo e Gustavo), com permissão a tudo. Quem o tem não atua no sistema.

**Não liste esse perfil como ator** em "Quem atua", em diagramas ou em tabelas de papéis. Ele só aparece onde o fato é técnico. Exemplo: "a migration concede a tela só ao perfil de testes", o que mostra que nenhum perfil de negócio recebeu a permissão.

## Divisão de trabalho (para as pendências)

- **Gustavo (DBA):** banco e API do av-hub (`api-acos-vital`).
- **Nathan:** front do av-hub (telas e BFF, a camada que liga o front à API).
- **Robert:** MES (`api-pcp` e `app-pcp`) e, desde 28/10/2026, as rotas do módulo comercial na `api-acos-vital` (N16-117).
- **Pablo:** acompanha o módulo comercial e cuida do Orçamento, com a supervisão do Robert. A `api-comercial` dele é de teste e será removida inteira (F3, 05/11/2026).

## Contratos

Contrato é o combinado por escrito entre dois sistemas ou entre duas pessoas sobre uma entrega.

- **Os contratos da v2 ficaram na v2** (F2). Eles são consultados pelo índice [[Contratos-da-v2]], que leva ao texto no GitHub, fixado na tag `v2-antes-da-v3`. Link para contrato antigo é sempre `[[Contratos-da-v2|LOG-34]]`, com o ID visível.
- **Contrato é um arquivo único por demanda**, com contexto e as seções de frontend, backend, API e banco ([[Modelo-de-Contrato]]); o prefixo é o da camada principal. Só o admin (Nathan, GitHub `oluccaa`) cria contrato direto no vault.
- Trabalho que continuar ganha **contrato novo**, escrito na v3 em `06-Contratos/`. A numeração continua depois do maior ID da v2: `LOG-56`, `SQL-022`, `API-019`, `CON-04`. Confira os próximos IDs livres no fim do [[Contratos-da-v2]] e atualize a linha ao registrar.
- O texto do contrato é copiado inteiro. Só o frontmatter, um bloco "Resumo em linguagem natural" (o que é, quem é afetado, situação) e um bloco "Situação em DD/MM" no topo são acrescentados.
- Os IDs são únicos: `SQL-007`, `API-004`, `LOG-34`. O número original é preservado. Os duplicados ganham letra (`LOG-04a`, `LOG-04b`).
- Os contratos de **Consulta** (`CON-NN`) pedem uma **resposta**, não uma mudança. Dão o contexto e um cenário, fazem perguntas numeradas e trazem uma mensagem pronta para o WhatsApp. As respostas voltam pelo WhatsApp do Nathan e são registradas na própria nota. Modelo e regras em [[Modelo-de-Consulta]] (`06-Contratos/Modelos/`).

## Detalhe técnico

### Fontes da verdade, em ordem

1. **Código na `develop`** dos sistemas (`origin/develop`, depois de `git fetch`), lido sem trocar de branch: `git show origin/develop:<arquivo>`. O `omie-elt-pipeline` não tem `develop`: a base é `origin/master`. Os commits lidos ficam no `develop-conferida` de cada nota.
2. **Dumps de esquema** (MES e av-hub).
3. **Decisões** em [[Registro-de-Decisoes]].
4. **O fluxo mestre** em [[00-Fluxo-Mestre-0b]].
5. O vault anterior, só quando não conflita com 1 a 4.

### Frontmatter obrigatório

```yaml
---
tags: [...]
criado: 2026-10-14
estado-em: AAAA-MM-DD          # data em que o estado foi conferido na develop (substitui "atualizado")
status: vigente | proposta | arquivado
dono: Nathan | Robert | Gustavo (DBA) | Pablo | Compras | ...
fontes: [arquivo:linha, commits, IDs de decisão]
---
```

Nas notas de raia, também:

```yaml
ordem: 6                        # posição no fluxo (00 é o Mestre)
nos: [P3, C0, C1]               # nós do mermaid de que esta nota é dona
anterior: "[[05-Estoque-Atendimento]]"   # ausente só na primeira raia
proxima: "[[07-Recebimento]]"            # ausente só na última raia
develop-conferida: [api-acos-vital <commit>, av-hub <commit>, api-pcp <commit>, app-pcp <commit>, omie-elt-pipeline master <commit>, em AAAA-MM-DD]
```

### Contratos novos: pastas e status

- Pastas: `Ativos/` (a fazer ou parcial), `Entregues/` (feito na `develop`), `Arquivados/` (superado, fora de escopo ou histórico) e `Consultas/`. Modelos em `Modelos/`.
- Vocabulário de status: `proposta`, `para-implementar`, `parcial`, `implementado-na-develop`, `arquivado`. Publicado na `main` é informação, não status.
- Todo contrato novo ganha uma linha na seção "Contratos novos (v3)" do [[Contratos-da-v2]] (o primeiro contrato novo cria a tabela ali), e a linha "Próximos IDs livres" é atualizada. A lista completa dos contratos da v2 fica em [[Contratos-da-v2-Lista-Completa]].
- Nota que passar de ~25 KB é dividida: o resumo fica na nota, e o detalhe vai para notas-parte em `<pasta>/Partes/`, com `parte-de` no frontmatter (script `scripts/dividir.mjs`; veja o [[Manual-de-Manutencao-do-Vault]]).

### Esquemas de banco

- **MES:** tudo no schema `public` (decisão #21).
- **av-hub:** dividido em schemas por domínio: `core_*`, `auth`, `historico`, `omie_*`.
