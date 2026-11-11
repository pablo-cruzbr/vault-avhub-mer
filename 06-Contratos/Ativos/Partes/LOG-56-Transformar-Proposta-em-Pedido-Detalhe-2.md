---
tags: [contrato, proposta, pedido-de-venda, omie, liberacao, refaturamento, parte]
criado: 2026-11-09
estado-em: 2026-11-11
status: para-implementar
dono: Nathan
parte-de: "[[LOG-56-Transformar-Proposta-em-Pedido]]"
develop-conferida: [api-acos-vital cc3fbb3, av-hub 6fcbba6, em 2026-11-11]
fontes: ["PDF de Robert de 09/11/2026 (contrato v8)", "Catálogo da API da Omie consultado em 09/11/2026 pelo conector do Omie (produtos/pedido:AlterarPedidoVenda, só a descrição; a operação não foi executada)", "PDF de Gustavo de 10/11/2026 (entrega LOG-56, banco e API)"]
---

# LOG-56 · Transformar proposta em pedido: §8 API a §17 (2/2)

**Em uma frase:** as rotas que mudam, o banco que depende da migration que falta, permissões, aceite, testes, a ordem de implementação com os responsáveis, os riscos e as três regras que custaram caro nesta frente.

Volta para [[LOG-56-Transformar-Proposta-em-Pedido]]. A parte anterior é [[LOG-56-Transformar-Proposta-em-Pedido-Detalhe-1]].

## 8. API

| Método | Rota | Mudança |
|---|---|---|
| POST | `/comercial/propostas/{id}/transformar` | + `qualidade_acompanha`, `faturar_em_partes` e a conta corrente (§7.4) |
| GET | `/comercial/propostas/{id}/prontidao-omie` | nova (§8.1) |
| POST | `/comercial/pedidos/{id}/enviar-omie` | aceita os novos (§7.1) |
| GET | `/comercial/empresas_emissoras` | + `id_unidade_conta_omie` |
| GET | `/pedidos_liberacao` (a rota da tela) | + os dois campos sugeridos da §7.6, na view **e** no `COLUNAS` (`pedidos_liberacao.route.js:39-47`) |
| PUT | `/pedidos_liberacao/:codigo_empresa/:numero_pedido` | + `faturar_em_partes` no corpo (§7.6), ao lado do `acompanhamento_qualidade`, com a mesma validação de `:174-176` e o mesmo `ON CONFLICT` de `:204-206` |
| GET | `/pedidos_liberados` e `/:numero/itens` (as rotas do MES) | + `faturar_em_partes` no corpo, para o Fluxo 4 ler (§6.7, perna 2b). Só leitura: não há PUT nesta rota, e ela não devolve pedido pendente |
| PUT | `/comercial/pedidos/{id}/conta-corrente` (nova, §8.2) | a troca pelo financeiro |

Escreve-se na rota da tela (`/pedidos_liberacao`), lê-se na rota do MES (`/pedidos_liberados`). É o que já acontece com o `acompanhamento_qualidade`, que a tela grava por PUT e o Fluxo 4 lê no `COLUNAS` de `pedidos_liberados.route.js:31`.

### 8.1 GET /prontidao-omie

Cinco códigos, e só eles, de `comercial-propostas.ts:431-435` (`'VENDEDOR_SEM_OMIE'` … `'UNIDADE_SEM_CONFIG'`). Somente leitura.

⚠️ Esta rota teria evitado o teste de 09/11 terminar em erro do Omie: `UNIDADE_SEM_CONFIG` é o caso da conta corrente ausente. A conferência existe no desenho, só não existe em código.

### 8.2 PUT /comercial/pedidos/{id}/conta-corrente: a troca pelo financeiro

```
PUT /comercial/pedidos/{id}/conta-corrente   // string: o codigo_conta_omie é bigint
{ "codigo_conta_corrente": "1234567890" }
```

- **Permissão:** a tela do financeiro com `pode_editar` (§7.5), não `propostas`. Precisa da linha em `auth.rotas_telas` (§14, passo 10) e da entrada no BFF; a entrada de `/contas-correntes` hoje é `tela: 'propostas'` (`route.ts:52`) e passa a aceitar as duas telas.
- **Ordem de escrita:** chama o `AlterarPedidoVenda` primeiro e só grava no Hub depois que o Omie aceitar. Se o Omie recusar, devolve o `faultstring` e nada muda no Hub.
- **Erros:** 409 se o pedido já estiver faturado; 422 se a conta não for da conta Omie do pedido; o erro do Omie repassado quando ele recusar.
- **Histórico:** quem trocou, quando, de qual conta para qual, no molde de `pedidos_vendas_liberacao_historico` com `valor_anterior`, gravado por trigger (§7.5).

**Fonte do que se diz sobre o `AlterarPedidoVenda`:** catálogo da API da Omie, consultado em 09/11/2026 pelo conector do Omie (descrição da operação `produtos/pedido:AlterarPedidoVenda`, endpoint `/api/v1/produtos/pedido/`). A operação **não** foi executada. Dali vêm três fatos: "`numero_pedido` NÃO deve ser enviado na alteração"; "o pedido é localizado por `codigo_pedido` ou `codigo_pedido_integracao`" (o `PV-000001` que o Hub já guarda); e `informacoes_adicionais.codigo_conta_corrente` está na entrada, como inteiro.

⚠️ Por não ter sido testada, o primeiro uso real dessa rota é um teste: pedido descartável, troca, conferência no Omie, e só então liberar a tela para o financeiro.

## 9. Banco (SQL)

❓ O código nomeia duas migrations que não estão no repositório. O vault registra isso desde 05/11 ([[Dump-AvHub-Teste-2026-11-04]] e [[Onde-Estamos]]). A citação da fonte, `propostas.route.js:32-34`:

```
// Migrations: 2026-11-05_comercial_limpeza_core_comercial.sql (item do produto
// da unidade) e 2026-11-05_comercial_pedido_venda_omie.sql (condição do Omie,
// colunas do pedido, prontidão e envio).
```

A pergunta ao Gustavo é a mesma de 05/11, sem resposta: onde estão as duas migrations? Na v8 ela ganhou um segundo item: de qual coluna `fn_pedido_venda_payload_omie` tira o `obs_venda` (§7.7); a função é da mesma migration.

❓ Continuam até ela aparecer: `dados_adicionais_nf` e `envio_omie_iniciado_em` (o código usa, o dump de 04/11 não tem), `codigo_condicao_pagamento` em `core_comercial.propostas` (idem) e a assinatura de `fn_proposta_transformar`, que o dump traz com 3 parâmetros e a API chama com 4 (`propostas.route.js:611`).

| Tabela | Coluna | Estado |
|---|---|---|
| `core_comercial.pedidos_venda` | `qualidade_acompanha`, `faturar_em_partes` | ✅ criadas pela `2026-11-09_log56_transformar_proposta_pedido.sql` (teste), nuláveis (nulo = pedido anterior à regra) |
| `core_comercial.pedidos_venda` | `codigo_conta_corrente` | ✅ criada pela log56 (teste), `bigint` nulável; campo do pedido, no molde de Compras (§7.4) |
| `core_vendas_faturamento.pedidos_vendas_liberacao` | `faturar_em_partes` | ✅ criada pela log56 (teste), nulável (R10) |
| `core_vendas_faturamento.vw_pedidos_liberacao` | `qualidade_acompanha_sugerida`, `faturar_em_partes_sugerido` | ✅ na view (log56, teste), por `LEFT JOIN LATERAL` em `codigo_empresa_omie` + `codigo_pedido_omie` |
| tabela nova da configuração padrão | uma linha por conta Omie | ✅ `core_comercial.parametros_pedido_venda_omie` (chave = unidade dona da conta Omie, sem default, trigger de conta ativa). Teste: "01 - Boleto/Pix/TED" nas três unidades (Robert, 10/11) |

As quatro primeiras linhas dependem da migration desta seção.

## 10. Permissões e perfis

Sem perfil novo. `Admin (Dev)` não é ator. As entradas do BFF precisam da linha em `auth.rotas_telas`, ou a API devolve 403 `ROTA_SEM_PERMISSAO_MAPEADA`.

| Rota | Estado | Quem |
|---|---|---|
| `/produtos-da-proposta`, `/categorias-da-proposta`, `/contas-correntes`, `/pedidos/:id/enviar-omie` | no BFF; falta a linha | Gustavo |
| `/compras/condicoes-pagamento` para a tela `propostas` | ✅ mapeada para `propostas` desde 05/11 (`2026-11-05_condicoes_pagamento_encargos.sql:84`; teste, produção pendente) | Gustavo |
| `/propostas/:id/prontidao-omie` | falta no BFF e a linha | Robert + Gustavo |
| `/comercial/pedidos/{id}/conta-corrente` (§8.2) | ✅ tela `pedidos-venda-financeiro` (inativa, sem perfil) com `PUT /comercial/pedidos/*/conta-corrente` (`pode_editar`) e `GET /contas_correntes` (`pode_visualizar`); falta decidir os perfis | Gustavo |

## 11. Integrações afetadas

- ❓ **Omie:** o payload ganha a conta corrente (§7.4); os dois campos novos não vão para lá, ficam no Hub. O que já vai em `observacoes.obs_venda` é pergunta da §7.7.
- **Pipeline:** nenhuma mudança.
- **MES:** muda, e é contrato próprio (§6.7). Até lá, a resposta do faturamento em partes fica no Hub. O que este contrato entrega do lado do MES é só a perna 2b: o campo legível em `GET /pedidos_liberados`.
- **Liberar Pedidos:** não recebe linhas do `/transformar` (§7.3). A tela passa a mostrar a resposta do vendedor como valor inicial (§7.6), e a liberação segue sendo um ato explícito.
- **Suprimentos:** nenhuma, desde que a §6.4 seja respeitada.

## 12. Critérios de aceite

**Frontend**
- ☐ O modal não deixa gerar sem Qualidade, faturamento em partes, categoria, tipo da venda e previsão.
- ☐ O aviso de refaturamento aparece nas três unidades, com códigos diferentes.
- ☐ Valor inicial (§7.6): pedido transformado com Qualidade "sim" aparece na Liberar Pedidos, depois da pipeline, com o controle já marcado como sim e indicando que veio do vendedor, e ainda como pendente de liberação.
- ☐ Novo na v8: liberando com o faturamento em partes alterado em relação ao sugerido, o valor que chega à API é o que o usuário viu na tela (o BFF repassou o campo, §6.1).
- ☑ Desmarcar "bloquear" tem efeito: a correção está na `develop`; confirmar no primeiro pedido que nascer.

**Backend e API**
- ☐ O pedido é criado no Omie (hoje para na conta corrente).
- ☑ A observação aparece em "Dados adicionais" no Omie (já verificado).
- ☐ Pedido em erro anterior à migration reenvia sem erro e sem criar linha de liberação.
- ☐ A troca da conta funciona (§8.2): o `ConsultarPedido` no Omie passa a mostrar a conta nova, e o Hub também.
- ☐ A troca recusada não separa os dois: forçando a recusa do Omie, a tela mostra o erro e a conta continua a anterior, no Hub e no Omie.
- ☐ Sem conta padrão (§7.8): a prontidão devolve `UNIDADE_SEM_CONFIG` dizendo qual unidade, e o pedido não é enviado.
- ☐ Um vendedor sem a tela `compras` consegue carregar a lista de condições (§10).
- ☐ Fornecedores, Catálogo e Painel do comprador continuam listando categorias, inclusive para quem não tem a tela `propostas`.
- ☐ Novo na v8: `GET /pedidos_liberados` devolve o `faturar_em_partes` do pedido liberado (perna 2b) e continua sem devolver pedido pendente.

**Banco**
- ☐ As quatro colunas da §9 existem e são nuláveis.
- ☐ Os dois campos sugeridos chegam ao corpo de `GET /pedidos_liberacao`, não só à view.
- ☐ O histórico da liberação segue registrando liberado e alterado (N16-29), sem mudança.

## 13. Como testar

1. **Caminho feliz.** Proposta em Mogi, as seis respostas, bloquear desmarcado. Conferir no `ConsultarPedido`: observação, `bloqueado = "N"`, categoria, condição e conta corrente. Apagar com `ExcluirPedido`.
2. **Erros.** Erro do Omie (credencial derrubada) e erro interno (falha depois do `envio_iniciar` → 500 `ENVIO_FALHOU_NA_API`, trava solta, reenvio completa na hora).
3. **A liberação continua sendo um ato.** Depois de transformar, o pedido aparece na Liberar Pedidos como pendente, com a resposta da Qualidade marcada como valor inicial, e não como liberado.
4. **A rota certa (novo na v8).** Com o pedido pendente, o valor sugerido vem no corpo de `GET /pedidos_liberacao?status=pendente`. Se vier só em `/pedidos_liberados`, o campo foi para a rota errada.
5. **Conta corrente.** Unidade sem padrão: a prontidão devolve `UNIDADE_SEM_CONFIG` e o pedido não é enviado. Com padrão: o pedido nasce no Omie com a conta certa, sem o vendedor ver o campo.
6. **Refaturamento (novo na v8).** Dois pedidos em Uberaba com a mesma categoria, um com "refat" na observação e outro sem. O primeiro não aparece na Liberar Pedidos; o segundo aparece. Prova a porta da observação (§7.7).
7. **HRM.** De qual conta Omie vêm as listas e em qual conta o pedido nasce (§6.3).
8. **Permissão.** Um vendedor sem a tela `compras` (§10).

## 14. Ordem de implementação e responsáveis

As decisões de 09/11 estão todas tomadas; não há passo de decisão. Restam as três perguntas ao Gustavo (§7.6 itens 1 e 2, §7.7 item 3) e a da Qualidade, e nenhuma bloqueia o começo, com uma ressalva: a pergunta 2 (view ou SELECT) precisa de resposta antes do passo 7a.

| # | O quê | Quem | Depende de |
|---|---|---|---|
| 1 | Achar as duas migrations da §9 e dizer de onde sai o `obs_venda` (§7.7) | Gustavo | — |
| 2 | Corrigir `id_unidade_conta_omie` da HRM (N16-98). Antes do passo 4: a configuração é chaveada por esse campo, e com ele errado a HRM nasceria com a conta corrente de Mogi | Gustavo | — |
| 3 | Migration: `qualidade_acompanha`, `faturar_em_partes` e `codigo_conta_corrente` em `pedidos_venda`; `faturar_em_partes` na liberação | Gustavo | 1 |
| 4 | Tabela da configuração padrão por conta Omie (§7.4 e §7.8) | Gustavo | 1, 2 |
| 5 | `esquemaEnvioOmie` + payload: a conta corrente lida da configuração; regra do §7.1 | Gustavo | 3, 4 |
| 6 | `PUT /comercial/pedidos/{id}/conta-corrente` (§8.2), com a permissão do financeiro | Gustavo | 3 |
| 7a | Os dois campos sugeridos na `vw_pedidos_liberacao`, pelo join em `codigo_pedido_omie` (§7.6) | Gustavo | 3 e a pergunta 2 |
| 7b | Os mesmos campos no `COLUNAS` de `pedidos_liberacao.route.js:39-47`; sem isto o campo fica na view e não chega à tela | Gustavo | 7a |
| 7c | `faturar_em_partes` no corpo do `PUT /pedidos_liberacao/:codigo_empresa/:numero_pedido` e legível em `GET /pedidos_liberados` (perna 2b) | Gustavo | 3 |
| 7d | Deixar o campo passar no BFF da liberação (`app/api/liberar-pedidos/[codigoEmpresa]/[numeroPedido]/route.ts:27-29` e `:51`) | Robert | 7c |
| 8 | `GET /prontidao-omie`, com `UNIDADE_SEM_CONFIG` quando faltar a conta padrão | Gustavo | 4 |
| 9 | `id_unidade_conta_omie` no corpo de `/empresas_emissoras` | Gustavo | — |
| 10 | Linhas de `auth.rotas_telas` (§10), incluindo a rota do passo 6 | Gustavo | 6 |
| 11 | Modal: Qualidade e faturar em partes | Robert | 5 |
| 12 | BFF da prontidão | Robert | 8 (para ter efeito) |
| 13 | Tela do financeiro: trocar a conta do pedido | Robert | 6 e 10 |
| 14 | Liberar Pedidos: mostrar o valor inicial (§7.6) | Robert | 7b |
| — | Medição do alcance do G6 nas três unidades (§7.7) | Robert + Nathan (dado) | — |
| — | Contrato próprio: pernas 3 a 5 do MES; data por item | frentes do MES / Nathan | — |

A coluna "Depende de" foi remontada a partir do PDF, cuja tabela saiu desalinhada na extração; confira contra o PDF antes de cobrar uma dependência.

## 15. Riscos, rollback e perguntas em aberto

- ✅ Decidido: a conta corrente é padrão por conta Omie, invisível para o vendedor (§7.4), com a troca pelo financeiro (§7.5). Continua bloqueando até a coluna, a configuração e o payload existirem.
- ✅ Decidido: o R7 grava só no pedido do Hub; a liberação continua sendo um ato do vendedor (§7.3).
- ✅ Decidido: a configuração padrão é SQL, sem tela (§7.8), com a mensagem da prontidão nomeando a unidade.
- ✅ Decidido: a N16-152 é a saída (b), refaturamento pela tabela `refaturamentos`; a observação deixa de contar (§7.7). **Superada em parte pela N16-153 (10/11/2026):** o código de refaturamento passa a ser lido pela unidade do pedido, e a observação continua sendo porta ([[Registro-N16-150-a-N16-153]]).
- ⚠️ Corrigido na v8, e era risco escondido: a v7 mandava criar o campo na rota do MES; o campo nasceria onde a tela não lê.
- ⚠️ Criado pela decisão da §7.5: depois de o pedido ir ao Omie, Hub e Omie precisam continuar iguais. Só gravar no Hub depois que o Omie aceitar.
- ❓ As duas migrations da §9, com o segundo item: de onde vem o `obs_venda` do payload (§7.7). É o maior risco aberto: se vier das observações da proposta, o vendedor derruba o próprio pedido da Liberar Pedidos escrevendo "refat" num campo de texto livre, nas três unidades.
- ❓ `auth.rotas_telas` para a lista de condições (§10).
- ❓ O join do valor inicial e a escolha entre view e SELECT da rota (§7.6).
- ❓ Pendência de dado da HRM (N16-98): já afeta pedido real.
- ❓ Refaturamento, com o alcance corrigido (§7.7): enquanto a regra do G6 tiver a porta da observação, pedido de qualquer unidade some da Liberar Pedidos por causa de texto livre; pela porta da categoria, o `1.01.96` de Mogi some sempre, enquanto o de Uberaba e o da HRM continuam entrando na base de comissão. O aviso da tela alerta nas três; a regra, não. A N16-152 (b) resolve os dois lados ([[LOG-56-Transformar-Proposta-em-Pedido-Adendo-v4]]).
- ✅ Encerrado: o tipo da venda continua em `numero_contrato` (confirmação do Nathan, 09/11).

## 16. Impacto no vault quando for entregue

- [[Mapa-IncluirPedido-Omie]] parte 2: §5.3 tira o ❓ do `dados_adicionais_nf` (testado); a linha 75 do `codigo_conta_corrente` sai de "em aberto" para "obrigatório: o Omie recusa sem ele"; a pergunta 4 fica respondida. (A linha do `1.01.98` na §5.3.1 e a indicação da view nas linhas 98-99 já entraram no registro deste contrato, em 09/11.)
- [[Riscos]] (RS-022) e [[Pontas-Soltas]] (PS-040): refaturamento em três unidades, com a porta da observação explicitada (registrado em 09/11).
- [[03-Pedido-de-Venda-e-Liberacao]]: a liberação continua com uma origem de escrita só (§7.3); o que muda é o valor inicial vindo do pedido do Hub (§7.6), e "a resposta do faturamento em partes fica no Hub até o contrato do MES". A divisão das duas rotas foi registrada em 09/11.
- [[MES-Backend]]: o caminho do Contrato 26 é o modelo; pernas 3 a 5 abertas.
- [[AV-Hub-Front]]: a regra da §6.4 e as da §17. O BFF da liberação monta o corpo à mão: campo novo da API precisa ser liberado lá também.
- [[Banco-AvHub]]: as duas redações do G6 (registrado em 09/11).
- [[01-Proposta-de-Venda]], [[Roteiro-da-Proposta-em-Diante]], [[Backlog-por-Frente]], [[Onde-Estamos]], [[Registro-de-Decisoes]].

## 17. Três regras que custaram caro nesta frente

Cada uma tem várias ocorrências em poucos dias, e todas viraram revisão do Nathan ou CI vermelho.

**1. Nome ou caminho que já tem dono: ou use, ou escolha outro. Nunca uma terceira cópia.**

| Caso | O que aconteceu |
|---|---|
| `/categorias` no BFF | reusou o padrão de Suprimentos e o roubou: outro formato e 403 |
| `buscarProdutos` | mudou a assinatura de uma função compartilhada; três telas de Suprimentos quebraram |
| `documentoCompleto` | duas implementações com o mesmo nome e comportamentos diferentes (uma descartava as letras do CNPJ alfanumérico) |
| `PedidoVendaProps` | terceira cópia do nome para um conceito diferente; o `mapa:check` barrou o merge, e com razão |

O `CLAUDE.md` do av-hub já diz "procure se já existe" e o `conferir-mapa.mjs` já cobra. O que faltou foi seguir.

**2. Verifique contra a fonte, não contra um retrato dela.** A v1 descreveu a árvore de trabalho e chamou de `develop`; a v3 citou `655896a` lendo um checkout de um dia antes; a v4 deu a correção do refaturamento como presente no remoto porque conferiu o começo idêntico das duas versões (`const ehRefaturamento = (c: CategoriaUnidadeProps) =>`). Daí: a §4 lê `git show origin/develop:` no momento de escrever, e cada âncora usa o trecho que distingue a versão nova da antiga.

O número da linha também é fonte: só de `grep -n` ou de leitura contígua, nunca de trechos concatenados e renumerados. Foi o que deslocou as duas citações de `pedidos_liberacao.route.js` na v8 (a regra geral está em [[Regras-do-Vault]]).

**3. Nome parecido não é a mesma coisa, e regra repetida em dois lugares não é a mesma regra (nova na v8).**
- `/pedidos_liberacao` × `/pedidos_liberados`: dois nomes quase iguais, montados em linhas vizinhas (`index.js:193-194`), finalidades opostas. A v7 citava as âncoras certas e o nome errado: ler a âncora não basta, é preciso conferir o nome contra o que a tela chama (`route.ts:53`).
- "G6" na `vw_vendas_planilha` × na `vw_faturamento_planilha`: o mesmo conceito, duas redações no mesmo banco, e a nota do vault documentava uma só.

**A regra operacional:** antes de mandar alguém mexer numa rota, numa view ou numa regra, abrir o ponto de consumo (a linha da tela que chama, ou a view que a tela lê) e confirmar que o nome bate. A âncora prova que o trecho existe; o consumo prova que é o trecho certo.
