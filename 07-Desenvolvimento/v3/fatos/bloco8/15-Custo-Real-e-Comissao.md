# Fatos de 15-Custo-Real-e-Comissao

Foto tirada em 2026-11-05 de `02-Fluxo-de-Atividades/15-Custo-Real-e-Comissao.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir 15-Custo-Real-e-Comissao`.

## decisões e IDs (6)

- `N16-116`
- `N16-120`
- `N16-143`
- `N16-144`
- `N16-19`
- `N16-20`

## contratos (0)


## commits (0)


## arquivo:linha (0)


## rotas (0)


## datas (2)

- `29/10`
- `29/10/2026`

## código entre crases (18)

- `C8`
- `K1`
- `K2`
- `K3`
- `K4`
- `K5`
- `K6`
- `api-acos-vital`
- `av-hub`
- `core_comercial`
- `core_comercial.fn_proposta_*`
- `core_comercial.propostas`
- `core_comissao`
- `core_vendas_faturamento`
- `estoque`
- `pedidos_venda`
- `recompra`
- `uso_interno`

## regras e linhas de conteúdo (40)

- O vendedor monta a proposta e o sistema estima a comissão pelo motor atual. Ele só vê a estimativa que ele mesmo colocou. `K1`
- Cada compra, lote do Estoque ou matéria-prima da produção gera uma linha de custo real, com as condições do próprio evento. `K2`
- Enquanto o custo do item não cobre a quantidade, o custo é parcial. Só as peças com custo real entram na comissão. `K2`
- No recebimento, o valor da nota de entrada substitui o valor da ordem de compra (OC). `K2`
- Se a compra sai mais cara que a proposta, o vendedor aprova ou reprova a compra do produto dele. O preço de venda não muda. `C8`
- Quando o Omie emite a nota, a comissão fecha com o percentual vigente naquele momento e chega à Controladoria já calculada. `K3`
- Controladoria, Gerência ou Coordenação decidem: aprovar, desaprovar, bloquear, desbloquear, cortar ou alterar. Sempre com justificativa. `K4`
- Só depois da decisão o vendedor vê a comissão real e o motivo. Desaprovada aparece com R$ 0. `K5`
- Se a nota for cancelada, devolvida ou recusada, a comissão é abatida na mesma proporção. `K6`
- No início, a Controladoria vê custo parcial e a diferença contra o cotado.
- O vendedor aprova ou reprova a compra mais cara. Se aprova, a margem e a comissão caem.
- A nota sai e a comissão chega à Controladoria. Ela aprova ou corta, com justificativa.
- O vendedor do Cliente Exemplo S.A. passa a ver o valor real e o porquê.
- Se o cliente devolver parte das flanges, o Fiscal ou a Controladoria informam quantas voltaram. A comissão cai na proporção.
- | Vendedor | Estima a comissão; aprova ou reprova compra acima do valor; vê a real depois da decisão |
- | Controladoria | Acompanha o custo real, decide a comissão e informa o que voltou nas devoluções parciais |
- | Gerência e Coordenação | Mesmas permissões de decisão da Controladoria |
- | Compras | Fornece o custo real pela OC e pela nota de entrada |
- | Fiscal | Informa, com a Controladoria, o que voltou numa devolução parcial |
- Controladoria, Gerência e Coordenação decidem sem teto. Ninguém decide a própria comissão.
- Toda decisão tem justificativa, autor, data e valores anterior e novo.
- O vendedor vê a comissão real só depois da decisão.
- Com custo parcial, só as peças com custo real entram na comissão.
- Cada nota fecha com o percentual vigente. Nunca se paga duas vezes a mesma peça.
- A nota de entrada manda: ela substitui o valor da OC.
- O encargo da condição de pagamento entra no preço sugerido, não no custo.
- Cancelamento, devolução ou recusa abatem a comissão. Se já foi paga, o desconto entra na próxima apuração.
- Devolução total vem do Omie. Na parcial, o Fiscal ou a Controladoria informam o que voltou.
- ✅ (`api-acos-vital`) Motor atual de comissão, só leitura aqui.
- ✅ (`av-hub`) Simulador de Comissão, usado como referência da tela nova.
- 🟡 Tela "Custo real por item" existe, sem imposto e com dados de teste.
- 🟡 Módulo novo em `core_comissao`: modelado e testado no banco, sem API nem tela.
- 🔴 Comissão estimada na proposta (`K1`).
- 🔴 Custo real por evento, com a nota de entrada como verdade (`K2`).
- 🔴 Tela da Controladoria, relatórios e visão geral (`K4`).
- 🔴 Aprovação do vendedor na compra acima do valor.
- 🔴 Pendência de devolução parcial e apuração do vendedor.
- ❓ Sobra aproveitável de chapa (OQ-32) e devolução de compra ao fornecedor (OQ-42).
- [[15-Custo-Real-e-Comissao-Detalhe-Tecnico-1]]: Os nós K1 a K6 · Como o custo real atravessa o fluxo · O exemplo do Nathan · As condições de cada evento de custo (N16-20)
- [[15-Custo-Real-e-Comissao-Detalhe-Tecnico-2]]: A tela da comissão: três visões da mesma tela (N16-19) · Casos de borda do custo real · Estados da comissão · Quem vê o quê · Estado no código e o que falta · Diagrama do subfluxo
