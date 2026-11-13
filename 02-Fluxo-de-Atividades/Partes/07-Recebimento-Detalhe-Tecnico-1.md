---
tags: [fluxo, raia, recebimento, doca, nf, conferencia, divergencia, lote, mes, r0, r1, r2, r3, r4, r6, parte]
criado: 2026-11-05
estado-em: 2026-11-13
status: vigente
dono: Robert (MES) · Nathan (decisões)
parte-de: "[[07-Recebimento]]"
develop-conferida: [api-acos-vital e522962, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-13, reteste por cliques e Da proposta à comissão; api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13; api-acos-vital b97981c, av-hub 2e5456d, api-pcp befd973, app-pcp 93f96de, omie-elt-pipeline master 5e7e94d, em 2026-11-05]
fontes: [00-Fluxo-Mestre-0b, Integracao-AvHub-MES (INT-03), API-007, API-008, v1 02-PRD-Estoque/Fluxo-Recebimento-Completo, v1 App-PCP-Recebimento-Conferencia, decisões do Nathan de 14/10 (conferência contra a NF), api-pcp 579a625 (recebimento.service.ts, compras.service.ts, compras.prisma, compras-ccp.dto.ts), app-pcp 1fca8d3 (FilaSetor, ConferirRecebimentoModal, decisoes-pcp), api-pcp develop de 27/10/2026 (recebimento por OC e por NF, custo da OC), API-011, N16-134 a N16-137]
---

# Raia Recebimento (R0 a R6): detalhe técnico (1/2)

**Em uma frase:** detalhe técnico da nota [[07-Recebimento]] (parte 1 de 2): Nós; Quem atua (onde); Regras decididas; Estados; Telas; Endpoints e contratos.

**Onde estamos:** ← [[07-Recebimento]] (resumo e índice) · partes: **07-Recebimento-Detalhe-Tecnico-1** · [[07-Recebimento-Detalhe-Tecnico-2]]

## Nós

Nós do [[00-Fluxo-Mestre-0b]]: `R0` esperados e chegada com NF, `R1` conferência contra a NF, `R2` pesagem, `R3` bate com o esperado?, `R4` cria o lote em quarentena, `R6` divergência. (`R5` não existe no 0b.) `FN1` é o fornecedor entregando.

## Quem atua (onde)

| Quem | Papel | Onde |
|---|---|---|
| Doca (conferente) | Registra a chegada com NF, conta, pesa, informa avaria e descrição | MES, `/logistica/logistica-entrada` |
| Segunda pessoa | Reconta quando há divergência (quem conferiu **não** pode recontar) | idem |
| PCP | Decide `ACEITAR` ou `REABRIR` quando a recontagem continua divergindo | MES, `/decisoes-pcp` |
| Compras (`compras-liberar`, em geral só o Administrador) | Libera a requisição para o Recebimento sem OC aprovada | `FilaSetor` / `CompraCcpCard` |
| Qualidade | Recebe o lote | [[08-Qualidade-Entrada]] |

Permissões: `movimentacoes` (visualizar ou editar) para conferir e recontar; `decisoes-pcp` para listar e decidir; `pode_atuar` no setor Recebimento (`PerfilSetor`) para a chegada e a recontagem (`api-pcp` `src/compras/compras.service.ts:929-931` (`opcoes.checarPermissaoSetor !== false`), `src/compras/recebimento.service.ts:527` (`ensurePodeAtuarNoRecebimento`)); a decisão do PCP **não** exige setor (`src/compras/recebimento.service.ts:821` (`checarPermissaoSetor: false`), em `registrarRecebimento`).

## Regras decididas

| # | Regra | Selo |
|---|---|---|
| 1 | **Esperados:** só aparece na lista da doca a parcial em Compras · CCP cuja requisição tem **OC aprovada** no av-hub (e não cancelada) ou **liberação manual** | 📝 ✅ `compras.service.ts:305-351`, `:448-456` |
| 2 | **Sem NF a parcial não sai de Compras · CCP**, para o tempo do fornecedor não cair no Recebimento. A doca informa número ou **chave de 44 dígitos** | 📝 ✅ `compras.service.ts:356-370`, `compras-ccp.dto.ts:17-20` |
| 3 | **A conferência é contra a NF**, não contra o pendente nem a OC. Receber mais do que a requisição pede é permitido; a sobra fica livre no estoque | 📝 ✅ `recebimento.service.ts:101-103`, `:176-177`; `compras.service.ts:464` |
| 4 | **Peso:** se o material tem peso teórico, o **peso real é obrigatório**; desvio acima da tolerância (padrão 5%, por material) vira divergência `PESO` | 📝 ✅ `recebimento.service.ts:374-401`, `estoque.prisma:167` |
| 5 | Tudo bate: o lote nasce **na hora**, `PENDENTE`, com `ENTRADA` no saldo na localização da conferência; recebimento `CONCLUIDO` | 📝 ✅ `recebimento.service.ts:201-232`, `compras.service.ts:537-568` |
| 6 | Diverge: **nada entra**; `AGUARDANDO_RECONTAGEM`; outra pessoa reconta | 📝 ✅ `recebimento.service.ts:234-245`, `:254-258` |
| 7 | Recontagem bate: `CONCLUIDO`. Continua divergindo: `AGUARDANDO_DECISAO` do PCP | 📝 ✅ `recebimento.service.ts:316-327` |
| 8 | PCP `ACEITAR` (entra a quantidade recontada) ou `REABRIR` (nada entra; a parcial volta a Compras · CCP); **motivo obrigatório** | 📝 ✅ `recebimento.service.ts:332-369`, `conferir-recebimento.dto.ts:140-143` |
| 9 | **Recebimento parcial faz split:** o que chegou segue para a Qualidade, o **restante volta a Compras · CCP** aguardando a próxima NF | 📝 ✅ `compras.service.ts:506-531`, `:590-611` |
| 10 | Avaria exige foto (URL de evidência); descrição e avaria são informadas pelo conferente; quantidade e peso o sistema calcula | ✅ `recebimento.service.ts:412-414`; `compras.prisma:39-47` |
| 11 | Só um recebimento aberto por parcial (409 se há conferência aguardando recontagem ou decisão) | ✅ `recebimento.service.ts:535-547` |
| 12 | Lote **sempre** nasce `PENDENTE` (quarentena), mesmo item "acabado" | 📝 ✅ `compras.service.ts:545-547` |
| 13 | **Custo do lote vem da OC.** Hoje é opcional e não bloqueia o recebimento; a N16-09 torna o custo obrigatório em todo lote | 📝 ✅ (`api-pcp`) gravado na `develop` (19/10, `97b9adc`; ver R4); 🔴 obrigatório (BL-066) |
| 14 | Recebimento nunca decide compra: a divergência vai ao PCP; o `REABERTO` devolve a Compras | 📝 ✅ `recebimento.service.ts:341-352` |

## Estados

### `StatusRecebimento` (`compras.prisma:31-37`)

| Valor | Significado | Próximo |
|---|---|---|
| `CONCLUIDO` | Bateu (na conferência ou na recontagem); lotes criados | Qualidade |
| `AGUARDANDO_RECONTAGEM` | Divergiu; nada entrou | recontagem por outra pessoa |
| `AGUARDANDO_DECISAO` | A recontagem continua divergindo | PCP |
| `ACEITO` | PCP aceitou; entrou a quantidade recontada | Qualidade |
| `REABERTO` | PCP reabriu; nada entrou | Compras · CCP |

### `TipoDivergenciaRecebimento` (`compras.prisma:42-47`)

`QUANTIDADE` (contado ≠ NF, calculada), `PESO` (fora da tolerância, calculada), `DESCRICAO` (informada), `AVARIA` (informada, com foto). Cada divergência guarda `etapa`: `conferencia` ou `recontagem`.

### Parcial e requisição

Parcial no setor `LOGISTICA_ENTRADA` (nome "Recebimento", código `logistica-entrada`) em estado "aguardando": `CRIADO`, `EM_TRANSITO`, `RECEBIDO` ou `EM_ANDAMENTO` (`STATUS_AGUARDANDO`, `circuito-compra.ts:30-35`). `StatusRequisicaoCompra`: `ABERTA`/`EM_COMPRA` → `RECEBIDA_PARCIAL` → `RECEBIDA` (`compras.service.ts:111-114`); `CANCELADA`. Lote: `PENDENTE` ([[08-Qualidade-Entrada]], [[Estados-e-Status]]).

## Telas

| Nome atual | Nome antigo | Rota | Slug | Ações |
|---|---|---|---|---|
| Recebimento | Logística de entrada | `/logistica/logistica-entrada` | `logistica-entrada` | lista de esperados, **Receber com NF** (`FilaRecebimento.tsx:147`, `ReceberComNfModal.tsx:56`), **Conferir recebimento** (`fila/CartaoItemParcial.tsx:907`, `ConferirRecebimentoModal.tsx:199`), **Recontar** (`fila/CartaoItemParcial.tsx:895`, `RecontarRecebimentoModal.tsx:91`), **Liberar para o Recebimento sem OC** (`fila/CartaoItemParcial.tsx:761`) |
| Divergências de Recebimento | Decisões do PCP | `/decisoes-pcp` | `decisoes-pcp` | Aceitar ou Reabrir com motivo (`decisoes-pcp/page.tsx`) |
| Compras · CCP | Pedidos de Compra | `/compras/pedidos-compra` | `pedidos-compra` | onde a parcial espera até a NF chegar ([[06-Circuito-de-Compra]]) |

`/logistica/logistica-entrada/page.tsx` é só `ModuloSetores` com `tipos=['LOGISTICA_ENTRADA']`. A NF da chegada vem pré-preenchida na conferência (`ConferirRecebimentoModal.tsx:60`). Não há leitor de código de barras: a chave de 44 dígitos é digitada.

## Endpoints e contratos

| Método e rota | Permissão | Efeito | Código |
|---|---|---|---|
| `GET /compras/requisicoes/esperados` | `movimentacoes:visualizar` | R0: lista de esperados | `compras.controller.ts:45-51` ✅ |
| `POST /compras/requisicoes/:id/chegada` `{idItemParcial, numeroNf?, chaveAcessoNf?}` | `movimentacoes:editar` | R0: grava `nfChegada`, `chaveNfChegada`, `chegadaEm`; parcial vai ao Recebimento | `compras.controller.ts:93-103`, `compras.service.ts:819-862` ✅ |
| `POST /compras/requisicoes/:id/liberar-recebimento` `{motivo}` | `movimentacoes:editar` + `compras-liberar` | Rede de segurança (motivo até 500) | `compras.controller.ts:105-115`, `compras.service.ts:404-446` ✅ |
| `GET /compras/recebimentos`, `GET /:id` | `movimentacoes:visualizar` | Lista (até 200) e detalhe | `recebimento.controller.ts:26-43` ✅ |
| `GET /compras/recebimentos/decisoes` | `decisoes-pcp:visualizar` | Fila `AGUARDANDO_DECISAO` | `:32-37` ✅ |
| `POST /compras/recebimentos` | `movimentacoes:editar` | R1 a R4: conferir (`idRequisicao`, `idItemParcial`, itens com `quantidadeNf`, `quantidadeContada`, `pesoReal`, `idLocalizacao`; cabeçalho `numeroNf`, `chaveAcessoNf`, `fornecedor`, `laudoUrl`; divergências informadas) | `:45-49` ✅ |
| `POST /compras/recebimentos/nf` | `movimentacoes:editar` | Conferência de uma NF com várias conferências, cada uma de uma requisição do MES (`itensRequisicao`) ou de uma OC do hub sem requisição (`idOrdemCompra` e `itensOc`); item de uso interno não vira lote. Testado pela tela em 13/11: a NF 999022 juntou a requisição do MES e uma OC do Hub sem requisição, com um recebimento para cada (RB-20261113-0004 e -0005) | `recebimento.controller.ts`, `recebimento.service.ts` (`ConferirNfDto`) ✅ `develop` |
| `GET /compras/recebimentos/oc-esperadas` | `movimentacoes:visualizar` | Esperados por item de OC aprovada, com ou sem requisição do MES | `recebimento.controller.ts` ✅ `develop` |
| `POST /compras/recebimentos/:id/recontar` | `movimentacoes:editar` | Recontagem por outra pessoa | `:51-59` ✅ |
| `POST /compras/recebimentos/:id/decidir` `{decisao: ACEITAR\|REABRIR, motivo}` | `decisoes-pcp:editar` | Decisão do PCP | `:61-69` ✅ |
| `POST /compras/requisicoes/:id/recebimentos` | — | **Removida**; o registro direto não existe mais | ✅ (`api-pcp`) |
| `GET /estoque/lotes/:id/etiqueta` | Estoque | PDF Code128 do lote | `estoque/etiquetas/etiqueta.controller.ts` ✅ |

Contratos de apoio: [[Contratos-da-v2|LOG-35]] (marco `oc_aprovada` põe a parcial nos esperados), [[Contratos-da-v2|API-004]] e [[Contratos-da-v2|API-007]] (referência e valores da OC; o MES consome na `develop`, K4 de 15/10), [[Contratos-da-v2|API-008]] (custo no lote).
