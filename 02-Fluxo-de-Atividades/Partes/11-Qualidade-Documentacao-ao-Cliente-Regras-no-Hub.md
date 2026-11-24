---
tags: [fluxo, qualidade, documentacao-cliente, dossie, data-book, regras, hub, parte]
criado: 2026-11-24
estado-em: 2026-11-24
status: vigente
dono: Nathan (telas) · Mayara (Qualidade, valida o dia a dia) · Cadu (decisões que contrariam regra antiga)
parte-de: "[[11-Qualidade-Saida]]"
develop-conferida: [av-hub d9809b8f (branch feat/qualidade-v2, PR #338 em rascunho, fora da develop), em 2026-11-24]
fontes: [fluxo oficial da Qualidade v2 (passos 6 a 9, imagem public/qualidade/fluxo-processo-qualidade.jpg do av-hub), av-hub lib/domain/qualidade-documentacao.ts e components/Qualidade/Comum/passosTour.ts, API-023]
---

# Documentação ao cliente: regras no Hub (rascunho v2)

**Em uma frase:** são as regras do dossiê que a Qualidade monta, revisa, envia e arquiva para o cliente de cada pedido (passos 6 a 9 do fluxo oficial), com o que está decidido, o que está pendente e de quem é a decisão.

**Onde estamos:** ← [[11-Qualidade-Saida]] (a documentação sai depois da inspeção de saída; não tem nó próprio no 0b) · contrato: `API-023` · perguntas: [[Perguntas-Qualidade-Mayara]]

Nada disso existe no MES nem na `develop`. Selos: 🔴 tudo está só no PR #338; ❓ sem resposta da Qualidade.

## O ciclo (fluxo oficial, passos 6 a 9)

Emitir a documentação (6), revisar e validar (7), enviar ao cliente (8) e arquivar (9). Se o cliente reprova, o dossiê volta para correção.

Estados do dossiê (um por pedido de venda): `EM_MONTAGEM`, `EM_REVISAO`, `APROVADO`, `ENVIADO`, `COMENTADO` e `ARQUIVADO`.

## Regras

| # | Regra | Estado | Quem decide |
|---|---|---|---|
| D1 | Um dossiê por pedido de venda, com a PO, os requisitos do cliente (normas, CE% máximo, NACE, PIT, Data Book) e os itens com lote e corrida | 🔴 | ❓ Mayara |
| D2 | Tipos de documento: certificado de qualidade, certificado de origem (Mill Test), relatório de ensaio, relatório de inspeção, RNC / RDFA, Data Book e outro. Os obrigatórios vêm dos requisitos do pedido e não saem da lista; documento extra pode ser incluído e tirado | 🔴 | ❓ Mayara |
| D3 | **Data Book:** o sistema gera o **índice**, e só depois de anexados os outros obrigatórios. Se um documento mudar depois, o índice fica desatualizado e é preciso gerar de novo antes de enviar à revisão | 🔴 | ❓ Mayara: Data Book em todo pedido ou só quando o cliente pede? |
| D4 | **Enviar à revisão** exige todos os obrigatórios anexados e o índice em dia | 🔴 | Mayara |
| D5 | **Quem monta e quem aprova:** montar é `editar`; **aprovar e devolver** pedem a permissão `aprovar` (passo 7, validação) | 🔴 | ❓ Mayara |
| D6 | **Aprovar** exige 4 itens conferidos (atende a PO, normas, requisitos do cliente, rastreabilidade) e rastreabilidade completa (todo item com lote e corrida). Se algo não confere, devolve para a montagem com o motivo | 🔴 | ❓ Mayara |
| D7 | **Registrar o envio:** por **portal**, com o protocolo do portal obrigatório; por **e-mail**, com e-mail válido (vários separados por vírgula) | 🔴 | ❓ Mayara: todo portal dá protocolo? |
| D8 | **Cliente comenta ou reprova:** reprova volta o dossiê a `EM_MONTAGEM` com o número da revisão a mais; comentário leva a `COMENTADO`, e depois reabre ou arquiva. O sistema deixa **registrar um comentário sem reprovar** | 🔴 | ❓ Mayara |
| D9 | **Arquivar** exige o local (SharePoint ou ERP) e o caminho. Fica guardado por pedido, item e corrida | 🔴 | ❓ Mayara: padrão de pasta no SharePoint |
| D10 | Todo passo fica no histórico do dossiê (quem e quando) | 🔴 | Decidido (rastreabilidade) |
| D11 | Onde o arquivo anexado fica guardado de verdade (SharePoint ou outro) ainda não foi definido; hoje só serve para a demonstração | ❓ | Nathan e Mayara |

## Pendente, e de quem é

| Tema | Pergunta | Quem responde |
|---|---|---|
| Quem monta e aprova (D5) | Quem monta o dossiê e quem aprova | Mayara |
| Data Book (D3) | Em todo pedido? | Mayara |
| Protocolo do portal (D7) | Todo portal dá um protocolo? | Mayara |
| Comentar sem reprovar (D8) | O cliente pode comentar sem reprovar? O que acontece | Mayara |
| Pasta no SharePoint (D9) | Qual o padrão de pasta | Mayara |
| RNC / RDFA (D2) | O que é RDFA e quando entra no dossiê | Mayara |

As 16 perguntas completas estão em [[Perguntas-Qualidade-Mayara]].
