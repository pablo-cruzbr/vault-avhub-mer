---
tags: [projeto, ids, dicionario]
criado: 2026-11-05
estado-em: 2026-11-13
status: vigente
dono: Nathan
fontes: [busca dos prefixos em todas as notas do vault em 05/11/2026 (fora de 07-Desenvolvimento/v3), Registro-de-Decisoes, Backlog-por-Frente, Pontas-Soltas, Perguntas-Proposta-Pedido-Comissao, Riscos, Contradicoes-Resolvidas, Contratos-da-v2, Integracao-AvHub-MES, 00-Fluxo-Mestre-0b, validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault) (BL-086 a BL-088, PS-046 a PS-053, RS-023, OQ-49 a OQ-53)]
---

# Tipos de ID

**Em uma frase:** é o dicionário dos códigos que aparecem no vault (`N16-60`, `BL-035`, `LOG-34`, `V0.3`…): o que cada prefixo quer dizer, onde ele nasce e qual é o próximo número livre.

**Quando consultar:** quando encontrar um código que não conhece, ou antes de criar um ID novo.

## Como usar

- **Ache pelo ID, não pela leitura.** Busque o ID inteiro na busca do vault (Ctrl+Shift+F): a linha onde ele nasce e todas as notas que o citam aparecem juntas.
- **Um ID nunca muda nem é reaproveitado.** Decisão superada continua com o mesmo ID; a nova diz "supera N16-xx".
- **ID novo:** use o próximo número livre da tabela abaixo e atualize esta nota no mesmo commit.

## Os prefixos

| Prefixo | O que é | Onde nasce (a linha "dona") | Quantos hoje | Próximo livre |
|---|---|---|---|---|
| `N16-nn` | Decisão do Nathan desde 16/10/2026 (proposta, pedido, custo real, comissão e o que veio depois) | [[Registro-de-Decisoes]], nas notas `Registro-N16-...` | 165 (`N16-01` a `N16-165`) | `N16-166` |
| `N14-nn` | Decisão do Nathan de 14 e 15/10/2026 | [[Registro-N14-01-a-N14-33]] | 33 | série fechada |
| `DEC-n` | Decisão com prazo de 21 e 22/09/2026 | [[Registro-DEC-EN-EC-e-1-a-38]] | 12 | série fechada |
| `EN-nn`, `EC-nn` | Encaixe do Estoque e da Revenda no PCP (EN) e do circuito de compra (EC) | [[Registro-DEC-EN-EC-e-1-a-38]] | 7 e 8 | séries fechadas |
| `#n` | Decisão do registro de 07/10/2026 (vault v1) | [[Registro-DEC-EN-EC-e-1-a-38]], [[Registro-39-a-80]], [[Registro-81-a-100-e-Estado-no-Codigo]] | `#1` a `#106` | série fechada |
| `BL-nnn` | Tarefa do backlog: o que falta desenvolver | [[Backlog-por-Frente]] (uma nota por frente) | 87 (até `BL-088`) | `BL-089` |
| `PS-nnn` | Ponta solta: divergência entre vault, código e banco | [[Pontas-Soltas]] | 56 (até `PS-056`) | `PS-057` |
| `OQ-nn` | Pergunta em aberto (de negócio ou técnica) | [[Perguntas-Proposta-Pedido-Comissao]] e notas de estudo (por exemplo [[Estudo-Omie-API]]) | 52 (até `OQ-53`) | `OQ-54` |
| `RS-nn` | Risco | [[Riscos]] | 24 (até `RS-024`) | `RS-025` |
| `CR-nn` | Contradição do vault v1 já resolvida | [[Contradicoes-Resolvidas]] | 19 | `CR-20` |
| `INT-nn` | Troca de dados entre o av-hub e o MES | [[Integracao-AvHub-MES]] | 9 (até `INT-09`) | `INT-10` |
| `LOG-nn` | Contrato de lógica (regra de negócio, fluxo) | [[Contratos-da-v2]] (v2) e `06-Contratos/` (v3) | 55 na v2 e 3 na v3 (`LOG-56` a `LOG-58`) | `LOG-59` |
| `SQL-nnn` | Contrato de banco (tabela, migration, view) | idem | 17 na v2; `SQL-022` na v3 | `SQL-023` |
| `API-nnn` | Contrato de rota de API | idem | 17 na v2; `API-019` na v3 | `API-020` |
| `CON-nn` | Consulta: pergunta formal a alguém, com resposta registrada | idem; modelo em [[Modelo-de-Consulta]] | 3 na v2 | `CON-04` |

As contagens de contrato são as linhas distintas do índice (92 contratos; IDs com letra, como `LOG-04a`, contam à parte). Os próximos IDs continuam depois do maior ID da v2 (veja o fim do [[Contratos-da-v2]]).

## IDs de nó do fluxo

Os nós do diagrama [[00-Fluxo-Mestre-0b]] também são IDs fixos. Cada um tem **uma nota dona** (frontmatter `nos:` da raia).

| Letra | Setor | Exemplos | Nota dona |
|---|---|---|---|
| `V0.n`, `V0C` | Proposta de venda | `V0.1` a `V0.7`, `V0C` (cancelada) | [[01-Proposta-de-Venda]] |
| `B` | Orçamento | `B1` a `B4` | [[02-Orcamento-Base-de-Preco]] |
| `V` | Pedido de venda e liberação | `V1` a `V3` | [[03-Pedido-de-Venda-e-Liberacao]] |
| `P` | PCP | `P1`, `P2`, `P6` (e `P3` em Compras) | [[04-PCP-Triagem-e-Destinacao]] |
| `E` | Estoque | `E1` a `E4`; `E5`; `E6` | [[05-Estoque-Atendimento]], [[09-Estoque-Entrada-do-Lote]], [[12-Estoque-Despacho]] |
| `C`, `FN1` | Compras e financeiro da compra | `P3`, `C0` a `C8`, `FN1` | [[06-Circuito-de-Compra]] |
| `R` | Recebimento | `R0` a `R6` | [[07-Recebimento]] |
| `Q` | Qualidade | `Q1` a `Q4` (entrada); `Q7`, `Q8` (saída) | [[08-Qualidade-Entrada]], [[11-Qualidade-Saida]] |
| `F` | Produção | `F1` | [[10-Producao-e-Roteiro]] |
| `X` | Expedição | `X1` a `X4` | [[13-Expedicao]] |
| `O` | Fiscal no Omie | `O1`, `O2` | [[14-Fiscal-Omie]] |
| `K` | Custo real e comissão | `K1` a `K6` | [[15-Custo-Real-e-Comissao]] |

Nó novo entre dois existentes usa letra ou sufixo, sem renumerar os outros (veja o [[Manual-de-Manutencao-do-Vault]]). Os números de tela da v1 (`10.1`, `11.1`) não são mais usados.

## Outros códigos que aparecem

- **Commits** (`b97981c`): sempre com o repositório ao lado; a base da última atualização está em [[Ultima-Atualizacao-do-Vault]].
- **Arquivo:linha** (`compras.service.ts:120`): posição no código da `develop` citada por um ✅.
- **PR** (`#306` em `api-acos-vital`): número de pull request no GitHub. Não confundir com as decisões `#n`, que só aparecem no Registro e nas notas que o citam.
