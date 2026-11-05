# Bloco 8: notas a reescrever para leitura

Data: 2026-11-05. D6 = sim; o Bloco 7 foi aprovado pelo Nathan.

**Escopo:** as 15 notas de raia, na ordem do fluxo. Só a nota principal (resumo para leitura); as notas-parte em `Partes/` são detalhe técnico e ficam como estão. Fotos de fatos tiradas antes: `_v3/fatos/bloco8/`.

**Regras da reescrita** (seção 8 da instrução):
- Linguagem simples no topo; detalhe técnico no fim.
- Nenhuma regra, número, ID ou selo pode sumir. Quando uma decisão mais nova supera uma regra antiga, a regra fica escrita como está agora, com o ID da decisão.
- Os quadros datados ("Decisões de 29/10", "Situação em 29/10") viram texto no presente, nas seções certas, com os IDs.
- Uma nota por commit.

| Ordem | Nota | Tamanho antes | O que já se sabe que precisa |
|---|---|---|---|
| 1 | `01-Proposta-de-Venda` | 9,7 KB | Tirar o quadro "Situação em 29/10" do topo e levar o conteúdo para "O que já existe" |
| 2 | `02-Orcamento-Base-de-Preco` | 6,8 KB | Quadro datado no topo |
| 3 | `03-Pedido-de-Venda-e-Liberacao` | 6,1 KB | Quadro datado no topo |
| 4 | `04-PCP-Triagem-e-Destinacao` | 21,9 KB | Quadro datado; nota perto do limite de 25 KB |
| 5 | `05-Estoque-Atendimento` | 22,6 KB | Quadro datado; no mermaid, `C0` aparece como "OC do hub" (na 06, `C0` é a requisição de Compras); perto do limite |
| 6 | `06-Circuito-de-Compra` | 8,2 KB | Quadro datado; a frase do topo cita só `C0` a `C5` |
| 7 | `07-Recebimento` | 6,9 KB | Quadro datado |
| 8 | `08-Qualidade-Entrada` | 20,2 KB | Quadro datado |
| 9 | `09-Estoque-Entrada-do-Lote` | 5,2 KB | Quadro datado |
| 10 | `10-Producao-e-Roteiro` | 24,4 KB | Quadro datado; o mermaid mostra `E5` "sem código", mas o texto diz que está na `develop` desde 27/10; perto do limite |
| 11 | `11-Qualidade-Saida` | 12,6 KB | "🟡 laudo na reprovação" contra a N16-129 (sem laudo); duas ou três saídas do reprovado |
| 12 | `12-Estoque-Despacho` | 5,8 KB | Quadro datado |
| 13 | `13-Expedicao` | 16,0 KB | Quadro datado |
| 14 | `14-Fiscal-Omie` | 11,6 KB | Regra 6: o envio ao Omie é direto pela `api-acos-vital` desde 03/11, não pela pipeline; regra 3: quem escolhe inteiro ou em partes é o vendedor (N16-130), não a Expedição |
| 15 | `15-Custo-Real-e-Comissao` | 7,4 KB | Quadro datado |
