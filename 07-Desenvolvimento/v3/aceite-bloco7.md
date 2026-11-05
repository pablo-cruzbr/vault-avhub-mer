# Aceite da v3 (Bloco 7)

Data: 2026-11-05. Base: `origin/develop` api-acos-vital b97981c · av-hub 2e5456d · api-pcp befd973 · app-pcp 93f96de · omie-elt-pipeline `origin/master` 5e7e94d (iguais ao Bloco 0; nada novo no fetch do Bloco 7).

**Como foi feito:** um agente novo, sem o contexto desta conversa, respondeu às 10 perguntas lendo só o vault (sem `_v3/` e sem código), partindo do `Home` e anotando os cliques. Depois, cada resposta foi comparada com a resposta esperada de `perguntas-de-aceite.md`, que vem da `develop`.

| # | Pergunta | Bate com o esperado? | Onde o vault responde | Cliques desde o Home |
|---|---|---|---|---|
| 1 | Ordem do pedido pelas notas | Sim. As 15 raias na ordem do mermaid; o resumo do Home dá Proposta → … → Comissão | `Home`, "O fluxo, na ordem do pedido" | 0 |
| 2 | Nota do C6–C8 | Sim. Só na `06-Circuito-de-Compra` (`nos:`), 📝 decidido e 🔴 sem código | `06-Circuito-de-Compra` e `06-…-Detalhe-Tecnico-2` | 1 (2 no detalhe) |
| 3 | Reserva `ATIVA` e saldo (E1) | Sim. Saldo = lotes `LIBERADO` − reservas `ATIVA`; o reservado é `quantidade − quantidade_consumida` | `05-Estoque-Atendimento` (regras e estados); `Modelo-Estoque-e-Custo-do-Lote` (`helpers.ts:41-53`) | 1 (2 na fórmula, pela trilha Estoque) |
| 4 | Q7 obrigatória na fabricação | Sim. O setor `QUALIDADE` vem antes da primeira `EXPEDICAO` (EC-06); a Revenda não exige | `10-Producao-e-Roteiro` e `11-Qualidade-Saida` | 1 |
| 5 | O que o Q1 registra; laudo | **Em parte → corrigido.** O vault dizia que o laudo é obrigatório para aprovar e reprovar, mas não dizia que é opcional no recebimento e na entrada de lote. A regra da nota 08 ganhou isso, com arquivo:linha da `develop` | `08-Qualidade-Entrada`, "Regras que valem" | 1 |
| 6 | Quem emite a nota; como faturar | Sim. Só o Omie emite; nota inteira ou em partes (sequenciais, N16-92 a N16-94; quem decide é o vendedor, N16-130) | `14-Fiscal-Omie` | 1 |
| 7 | Pedido da proposta × pedido do Omie | Sim. Proposta: nasce liberado (N16-05); Omie: chega travado (N16-106). No código, o `transformar` existe ✅ e o envio ao Omie e a liberação gravada não existem 🔴 | `03-Pedido-de-Venda-e-Liberacao`; `Onde-Estamos` | 1 |
| 8 | Base do "pronto" | Sim. A `develop` (F5); a `main` é informação; ainda não há produção | `Onde-Estamos` (aviso F5); `Regras-do-Vault` | 1 |
| 9 | O que existe do módulo do Pablo | **Em parte → corrigido.** O agente partiu do `Mapa-do-Modulo-do-Pablo`, que descreve o `api-comercial` de teste com ✅ de "visto no código". Ganhou um aviso no topo: ali ✅ não é pronto (F3), e o estado está no `Onde-Estamos`, nas raias 01, 02 e 06 e no Backlog Comercial. A resposta esperada (rotas da proposta e leituras de fornecedores, vínculos, categorias, cotações e parâmetros ✅; o resto 🔴) está na raia 02, "O que já existe" | `Onde-Estamos`; `02-Orcamento-Base-de-Preco` | 1 |
| 10 | Contratos da v2 e LOG-34 | Sim. Tag `v2-antes-da-v3`; índice `Contratos-da-v2`; o LOG-34 está em `Contratos-da-v2-Lista-Completa`, com o link do GitHub | `Contratos-da-v2` → `Contratos-da-v2-Lista-Completa` | 2 (mais Ctrl+F) |

**Resultado:** 8 de 10 bateram de primeira; 2 batiam em parte e foram corrigidos neste bloco (`_v3/scripts/aceite-ajustes.mjs`). Todas as respostas chegaram em até 2 cliques (a meta era 3).

## Problemas de leitura apontados pelo teste

Corrigidos no Bloco 7 (`aceite-ajustes.mjs`):

- **Títulos:** o da 06 não citava C6–C8, e o da 10 citava `P6`, que pertence à nota 04.
- **`Contratos-da-v2`:** mandava rodar de novo o script de `_v3/` (que desfaria a divisão) e não explicava o vocabulário de status da v2.
- **`Mapa-do-Modulo-do-Pablo`:** sem aviso de F3, e ainda falava em fila para o envio ao Omie.

Ficam para o Nathan decidir ou para o Bloco 8 (mudam o texto de regra):

1. **`14-Fiscal-Omie`:**
   - A regra 6 diz que o pedido da proposta fica `pendente` e o envio é da pipeline. O `Mapa-IncluirPedido-Omie` e o `Onde-Estamos` dizem que, desde 03/11, a `api-acos-vital` chama o Omie direto.
   - A regra 3 diz que a escolha entre inteiro e em partes é da Expedição (`X2`); na mesma linha, a N16-130 diz que é do vendedor.
2. **`11-Qualidade-Saida`:**
   - Mantém "🟡 laudo ou evidência na reprovação de saída", mas a N16-129 decidiu "sem laudo".
   - "Regras que valem" dá duas saídas para o reprovado; o passo 6 e o `P6` dão três (com "reabrir a compra").
3. **Mermaid das raias:**
   - O subfluxo da 10 ainda mostra `E5` como "sem código", mas o texto diz que está na `develop` desde 27/10.
   - O da 05 chama `C0` de "OC do hub"; na 06, `C0` é a requisição de Compras.
4. **Ordem das raias × caminho físico:** a 10 recebe do despacho `E6` (nota 12), que vem depois na numeração. A numeração segue a seção 5 da instrução (ordem do mermaid); o caminho físico está nos textos "Entrada/Próxima raia". Não muda nada; só fica registrado.
