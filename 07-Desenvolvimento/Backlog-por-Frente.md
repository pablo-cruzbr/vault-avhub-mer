---
tags: [desenvolvimento, backlog, pendencias]
criado: 2026-10-14
estado-em: 2026-11-13
status: vigente
dono: Nathan
develop-conferida: [api-acos-vital e522962, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13, reteste por cliques e Da proposta à comissão; api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
fontes: [00-Fluxo-Mestre-0b, Integracao-AvHub-MES, api-pcp 579a625, app-pcp 1fca8d3, api-acos-vital f322dcd, omie-elt-pipeline 0f739f0, HUB b55ac55, Dump Avhub e Dump MES de 14/10, Registro-de-Decisoes (N16 de 16 a 26/10), validação local em Docker de 10/11/2026 (docker-teste/RELATORIO-VALIDACAO.md, fora do vault), PDF de Gustavo de 10/11/2026 (entrega BL-056, LOG-51 S15)]
---

# Backlog por frente

**Em uma frase:** esta é a lista do que ainda falta construir no fluxo de Atividades, separada por quem faz (Robert, Gustavo, Nathan e o módulo Comercial).

## Como ler esta lista

- Cada tarefa tem um ID `BL-nnn` (BL = backlog, a lista de trabalho). O número não muda e outras notas o citam.
- Colunas: **Nó** (a etapa do fluxo mestre, [[00-Fluxo-Mestre-0b]]), **O que falta**, **Contrato** (a nota que descreve a entrega), **Selo** e **Evidência** (onde no código se conferiu).
- Selos (pela `develop`, F5): ✅ está na `develop`, 📝 decidido, 🟡 parcial na `develop`, 🔴 não está na `develop`, ❓ não conferido na `develop`.
- Para achar o que é seu, vá direto à tabela da sua frente: Robert (MES), Gustavo (banco e API), Nathan (front e coordenação) ou Comercial.
- Descrições longas começam com uma **frase em negrito** que resume a linha. O texto original vem logo depois, completo.
- Siglas: MES = sistema de chão de fábrica; OC = ordem de compra; PCP = planejamento e controle da produção; pd = pessoa-dia; PR = pedido de mesclagem de código.

## Resumo por frente

- **Robert (MES).** Feito: o MES lê a OC do hub (BL-001, BL-006), o lote do Recebimento nasce com o custo da OC (BL-005), o recebimento por OC e o uso interno estão em boa parte prontos (BL-051), a Triagem mostra as requisições do hub (BL-065, 23/10) e, em 27/10, a Ordem de Produção (BL-052), o fabricado virando lote no Estoque (BL-008) e o custo por item (BL-004), tudo na `develop`. Falta: documento de retirada (BL-007), custo do fabricado (BL-067, confirmado na validação local de 10/11), módulo da Torre (BL-003, idem) e mostrar a OC ao PCP (BL-049, BL-050). Travado por capacidade: o déficit do Ciclo 1 era de 29,6 pd e, com BL-007, BL-049 e BL-050 no ciclo (N16-145, 30/10), passa a 36,1 pd (RS-004 em [[Riscos]]; o Robert valida a conta). Ele também precisa fazer o merge da `develop` para a `main` antes do piloto (BL-035).
- **Gustavo (banco e API).** Feito: `id_origem` na referência da OC (BL-002), referência da OC conferida (BL-028) e hub pronto para o custo (BL-019). Feito também: rota de requisições para o MES (BL-064). Falta: chave de serviço restrita (BL-018, BL-057), segurança da API (BL-059 a BL-061; a fase 1, BL-056, ficou pronta em 09/11), migrações do módulo comercial (BL-068), contadores da proposta e Carteira do PCP lendo a previsão do Hub (BL-069; a liberação na criação saiu pelo R7 do LOG-56) e proteger pedido manual do `exclusionSync` (BL-027, risco alto). Do pedido de venda no Omie (04 e 05/11): a coluna `produto_vendas.codigo_item_integracao` (BL-079) e as listas do pedido filtradas pela unidade (BL-080).
- **Donos das raias (N16-157, 11/11/2026).** O Robert é dono de 13 das 15 raias do fluxo 0b, o Nathan do Circuito de Compra e o Pablo (júnior) do Orçamento, com o Robert acompanhando; o Gustavo é o DBA e a API de todo o sistema; o Nathan coordena e ajuda o Robert em cada processo ([[Equipe-e-Divisao]]). Com isso, saem da frente Nathan e vão para o Robert: BL-023 e BL-088 na parte da tela (custo real), BL-053 (imposto por item), BL-075 a BL-078, BL-080 na parte da tela, BL-081 e BL-087 (ICMS da proposta). Ficam com o Nathan: BL-055 e BL-082 a BL-085 (o BL-086 foi feito em 12/11) e as decisões das [[Pontas-Soltas]]. As linhas continuam nas notas da frente Nathan até a próxima divisão.
- **Nathan (front e coordenação).** Feito: telas da Torre (BL-022), "Nova requisição" testada ponta a ponta (BL-041), cartão "Etapa dos itens" com status traduzido (BL-048), marcas temporárias fechadas (BL-043, BL-044), `fetchMenu` resolvido (BL-042) e o HUB falando só com a API do Hub (BL-063). Desenho do imposto por item decidido (BL-053, N16-144). Falta: os cadastros (BL-017, BL-045, BL-055). Desde 11/11 (N16-157) a pipeline do pedido, o motor da comissão, a tela de custo real e o teste do pedido real no Omie (BL-023, BL-076, BL-078, BL-081) são do Robert, com o Nathan apoiando; as telas da proposta (BL-075) já estavam com ele e o Orçamento com o Pablo. Da organização do código do av-hub (PRs #260 a #273), sem prazo e para quando os arquivos forem mexidos: dividir os arquivos acima de 600 linhas (BL-082), levar mais rotas para o `rotaDeRepasse` (BL-083), apagar os órfãos quando as branches fecharem (BL-084) e o teste de componente (BL-085); as decisões que faltam são a PS-042 a PS-044. Da validação local em Docker de 10/11/2026: a OC aberta pela "Nova ordem de compra" com pedido de venda que não fecha a requisição (BL-086) ✅ feito em 12/11 (av-hub PR #281); o ICMS do item que não acompanha o destino da proposta (BL-087) e o custo real por item inacessível (BL-088, com o Gustavo na API) passaram ao Robert (N16-157).
- **Comercial e Suprimentos.** O Robert conduz a migração para a `api-acos-vital` desde 28/10, e o Pablo acompanha (BL-062, BL-071 a BL-073). A pergunta de como o Orçamento se liga à OC está respondida (BL-046). Falta o Gustavo confirmar o que a pipeline carrega (BL-047).
- **Quem precisa agir agora.** Robert no merge da `develop` para a `main` do MES (BL-035), porque a OP, o lote do fabricado e o custo por item estão só na `develop`; depois, na OC do pedido para o PCP (BL-049, BL-050). Gustavo no `exclusionSync` que apaga pedido manual (BL-027, risco alto).

## Lista completa

O que **falta desenvolver** no fluxo de Atividades ([[00-Fluxo-Mestre-0b]]), conferido no código em 14/10/2026 e com os selos reconferidos item a item na `develop` em 05/11/2026 (coluna Evidência: "develop 05/11" é a prova atual; "14/10" fica só quando ainda vale; o texto "Conferido na develop em 05/11/2026" no fim de "O que falta" diz o que mudou). Cada item tem ID `BL-nnn` (estável, citado por outras notas), nó do 0b, contrato, selo e evidência. Dentro de cada frente a ordem é a dos nós do 0b (V, P, E, C, FN, R, Q, F, X, O) e depois o transversal. Divisão: Robert = MES (`api-pcp`, `app-pcp`); Gustavo = banco e API do av-hub; Nathan = front do HUB e coordenação; Robert também conduz o módulo Comercial & Suprimentos na `api-acos-vital` (N16-117, 28/10), com Pablo acompanhando ([[Equipe-e-Divisao]]). Selos: [[Regras-do-Vault]]. Lacunas de decisão e dúvidas: [[Pontas-Soltas]]; riscos: [[Riscos]].

A lista completa desta nota fica em 4 notas à parte, uma por frente, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[Backlog-Frente-Robert]]: Frente Robert (MES: `api-pcp` e `app-pcp`)
- [[Backlog-Frente-Gustavo]]: Frente Gustavo (banco e API do av-hub)
- [[Backlog-Frente-Nathan]]: Frente Nathan (front do av-hub, BFF e coordenação)
- [[Backlog-Frente-Nathan-Proposta-Omie-e-Comissao]]: itens BL-075 a BL-081 (proposta, pedido no Omie e comissão), do Robert desde 11/11 (N16-157), com o Nathan apoiando
- [[Backlog-Reteste-por-Cliques-2026-11-13]]: itens BL-089 a BL-096, defeitos de tela do reteste por cliques de 13/11/2026 (frentes Robert, Gustavo e Nathan, indicadas em cada linha)
- [[Backlog-Reteste-R4-2026-11-16]]: itens BL-097 a BL-100, o que o reteste R4 (o fluxo de 0 a 100% pelas telas, 16/11/2026) achou
- [[Backlog-Frente-Comercial-e-Suprimentos]]: Frente Comercial & Suprimentos (Robert conduz; Pablo acompanha)

## Fechados em 14/10/2026

- **BL-038** (regra de aprovação da OC) e **BL-040** (tela de Aprovações com degrau da Diretoria): fechados. A regra decidida (N14-21: acima de R$ 30 mil aprova o Gerente de Compras; até R$ 30 mil, compradores livres; sem Diretoria) é o que o código já faz. Endurecer a regra depois da conversa com Compras é pendência futura 🟡, sem item de backlog ainda.

## Ordem sugerida (caminho crítico)

1. Gustavo: BL-018 (chave), BL-002 (`id_origem` e chave de leitura), BL-028 (conferir a referência para saldo futuro), BL-019 (047b). Destravam o Robert.
2. Robert: BL-001 e BL-005 (OC e custo no recebimento), BL-006, BL-049, BL-050 e BL-051 (OC do hub no MES: OC do pedido, saldo futuro e entrada), BL-004 (`itens/custo`), BL-007 e BL-008 (retirada e fabricado no Estoque), BL-052 (Ordem de Produção), BL-003 (fluxo).
3. Nathan: BL-022 sobre fixtures enquanto o MES publica. Robert, desde 11/11 (N16-157): BL-023 e BL-053 (modelo do imposto) com o Gustavo.
4. Proposta ao pedido, Orçamento e comissão nova (desenho aprovado em 26/10/2026): Gustavo aplica as migrações (BL-068) e os contadores da proposta (BL-069; a liberação na criação saiu pelo R7 do LOG-56); Robert migra e estende o módulo, começando pela proposta, com Pablo acompanhando (BL-071, BL-072, BL-073; N16-117, N16-118); Robert faz as telas e a pipeline do pedido (BL-075, BL-076, BL-078; N16-157), com o Nathan apoiando; Robert torna o custo obrigatório (BL-066, BL-067). Datas 🟡 em `Proposta-Orcamento-Comissao/07-Cronograma/Proposta-de-Cronograma.md` (fora do vault, a validar).
5. Antes do piloto: BL-035 e RS-002.

A capacidade do Robert está em déficit de 29,6 pd no Ciclo 1 (16,1 + 16,5 do N14-29 − 3,0 do K4 já na `develop`; o Nathan aceitou deslocar a data, N14-30 e N14-32) ([[Equipe-e-Divisao]], [[Riscos]] RS-004): o BL-007 foi dimensionado em 3,5 pd e entrou no Ciclo 1, com BL-049 e BL-050 (N16-145, 30/10): o déficit passa a 36,1 pd e o fim a 03/03/2027 a 75% de foco; o Robert valida a conta.
