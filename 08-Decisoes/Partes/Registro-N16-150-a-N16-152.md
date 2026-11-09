---
tags: [decisoes, registro, n16, parte]
criado: 2026-11-05
estado-em: 2026-11-09
status: vigente
dono: Nathan
parte-de: "[[Registro-de-Decisoes]]"
fontes: [conversa do Nathan de 05/11/2026 sobre o botão "Transformar em pedido de venda", N16-05, N16-89, N16-130, N16-149, api-acos-vital develop 1654f65 (src/schemas/core_comercial/aggregates/propostas/propostas.route.js:579-618), dump do banco de teste de 04/11/2026 (core.categorias, core_comercial.pedidos_venda), PDF de Robert de 09/11/2026 (contrato LOG-56 v8 e adendo v4)]
---

# Registro de decisões: decisões N16, N16-150 a N16-152

**Em uma frase:** decisões N16 da nota [[Registro-de-Decisoes]], linhas N16-150 a N16-152 (parte 6): o que o vendedor responde ao transformar a proposta em pedido, o que a Qualidade "Sim" obriga o PCP a fazer e o refaturamento sem comissão.

**Onde estamos:** ← [[Registro-de-Decisoes]] (resumo e índice) · partes: [[Registro-N16-01-a-N16-43]] · [[Registro-N16-44-a-N16-72]] · [[Registro-N16-73-a-N16-96]] · [[Registro-N16-97-a-N16-116]] · [[Registro-N16-117-a-N16-149]] · **Registro-N16-150-a-N16-152**

## Decisões de 05/11/2026 (modal "Transformar em pedido de venda") (N16-150 a N16-152)

| ID | Decisão | Data | Dono | Selo | Superada |
|---|---|---|---|---|---|
| N16-150 | **O modal "Transformar em pedido de venda" tem seis campos, e as datas seguem uma regra.** Nathan, 05/11/2026. O botão só aparece na proposta aprovada (`V0.6`). Campos: (1) **a Qualidade acompanha o pedido por todos os processos?** `Sim` ou `Não`, **obrigatório**; (2) **previsão de faturamento**, **obrigatória**, a data de entrega ao cliente, **uma data para o pedido**; (3) **tipo da venda**, `SPOT` (cliente sem contrato, venda casual ou normal) ou `CONTRATO`, **obrigatório e só informativo**: não muda comissão, prioridade nem campo do Omie; (4) **o pedido pode faturar em partes (por parciais) ou só quando tudo estiver pronto**, **obrigatório**; (5) **número do pedido do cliente**, **em branco para o vendedor preencher e opcional**; (6) **categoria**, escolhida numa lista de `core.categorias` que mostra **código e descrição** (por exemplo `1.01.01` Venda Cliente), da unidade do pedido (N16-149). **Regra das datas:** se o pedido **não** fatura em partes, vale só a data do pedido. Se **fatura em partes**, a data do pedido passa a ser a **data final (a máxima)** e o vendedor informa **uma data por item, obrigatória para todos os itens**; a data de cada item é **anterior ou igual** à data do pedido. 🟡 Hoje a API já recebe no corpo do `transformar` a previsão (obrigatória, não anterior a hoje), o número do pedido do cliente, a categoria (opcional), o `numero_contrato` (`SPOT` ou `CONTRATO`, opcional), `bloqueado` e `frete_modalidade` (✅ `api-acos-vital` `propostas.route.js:579-618`, `develop` 1654f65). Falta: a resposta da Qualidade, o faturamento em partes, a data por item, e tornar obrigatórios o tipo da venda e a categoria | 05/11/2026 | Nathan | 📝; 🟡 | N16-05, N16-89, N16-130, N16-149 (completa) |
| N16-151 | **Qualidade "Sim": o PCP é obrigado a pôr a Qualidade em todo o roteiro e em todas as etapas da fábrica.** Nathan, 05/11/2026. A resposta do vendedor (N16-150, campo 1) é gravada no pedido e o MES a lê na liberação; o que ela obriga no chão de fábrica é **outra mudança, do lado do MES (`api-pcp` e `app-pcp`), e vira contrato à parte**. A fila de inspeção de processo ainda não existe ([[03-Pedido-de-Venda-e-Liberacao]]) | 05/11/2026 | Nathan | 📝; 🔴 sem código | N16-05, N16-89 (completa) |
| N16-152 | **Refaturamento: a comissão do pedido é desconsiderada.** Nathan, 05/11/2026. Se a categoria escolhida no modal (N16-150, campo 6) é de refaturamento, **a comissão do vendedor nesse pedido não conta**. **Quais categorias são refaturamento será avaliado e definido depois** (PS-040): hoje só se sabe o `1.01.96` em Mogi, que cai em G6, e o `1.01.99` em Uberaba, que não cai (RS-022, PS-040). A regra tem de valer para todas as unidades, não só Mogi. 🔴 Não existe no código. Em aberto: se a comissão estimada na proposta (`V0.3`) também zera nesse caso. **Atualização de 09/11/2026: saída (b), ver abaixo** | 05/11/2026 | Nathan | 📝; 🔴 sem código | N16-149 (completa) |

### Atualização da N16-152 em 09/11/2026: saída (b)

**Decisão do Nathan, 09/11/2026.** 📝; 🔴 sem código. O refaturamento passa a ser decidido pela tabela `core_vendas_faturamento.refaturamentos` (chave `codigo_pedido_omie`, `status_refaturamento` em `Permitido`, `Proibido` ou `Sem Referência`, calculada com `computed_at` e `periodo`, por `codigo_empresa`; dump de teste de 04/11, linha 17487). A observação (`refat` ou `reaft`) deixa de ser porta do G6. Não se acrescenta código de categoria à regra global.

**Motivo: os códigos colidem entre as três contas** (`ListarCategorias`, 06/11/2026, leitura do Robert). Refaturamento é `1.01.96` em Mogi, `1.01.99` em Uberaba e `1.01.98` na HRM. Mas o `1.01.98` é Venda de Sucata em Uberaba, e o `1.01.99` é Cobranças Jurídicas em Mogi e Revenda de Mercadoria na HRM. Acrescentar o `1.01.98` à regra global marcaria a venda de sucata de Uberaba como refaturamento. Tabela das contas em [[Mapa-IncluirPedido-Omie-Detalhe-Tecnico-2]] (seção 5.3.1); as duas redações atuais do G6 em [[Banco-AvHub]].

**Avisos para quando a N16-152 virar contrato:**

1. A tabela `refaturamentos` precisa estar preenchida e confiável antes da troca. Senão o G6 para de pegar quem pega hoje, com efeito na comissão.
2. O contrato tem de dizer se "registrado como refaturamento" é qualquer linha da tabela ou só `Proibido` e `Sem Referência` (como a `vw_faturamento_planilha` faz hoje).
3. Pedido nascido no Hub só ganha linha na tabela depois de estar no Omie e de o cálculo rodar.

Medição pendente: [[Pontas-Soltas]] (PS-040). Risco: [[Riscos]] (RS-022).
