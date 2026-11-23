---
tags: [desenvolvimento, backlog, pendencias, parte, validacao]
criado: 2026-11-16
estado-em: 2026-11-16
status: vigente
dono: Nathan
parte-de: "[[Backlog-por-Frente]]"
develop-conferida: [api-acos-vital 96316f4, av-hub f63b01b, api-pcp bd6b442, app-pcp 897dcd7, em 2026-11-16]
fontes: [reteste R4 no Docker local de 16/11/2026, o fluxo de 0 a 100% pelas telas (docker-teste/RETESTE-R4-2026-11-16.md, fora do vault), N16-166]
---

# Backlog: defeitos do reteste R4 de 16/11

**Em uma frase:** itens BL-097 a BL-100, o que o reteste R4 achou ao percorrer o fluxo inteiro pelas telas no Docker local, em 16/11/2026. Cada linha diz a frente.

**Onde estamos:** ← [[Backlog-por-Frente]] (resumo e índice) · reteste anterior: [[Backlog-Reteste-por-Cliques-2026-11-13]]

O R4 rodou na `develop` de 16/11 (av-hub `f63b01b`, api-acos-vital `96316f4`, app-pcp `897dcd7`, api-pcp `bd6b442`), por cliques no Hub e no MES, em dois fios: a proposta AV2026-0021 virou o pedido do Hub PV-000009, cuja simulação de comissão foi aprovada por Compras; e o pedido do Omie 28190 foi liberado, destinado (OP 28190/1, fabricação), comprou a chapa (REQ-000047, OC-000024), recebeu, passou pela Qualidade, pelo Corte e pela inspeção de saída e foi entregue. O fluxo passa de ponta a ponta.

Confirmado no R4: o BL-089 ("Necessário até") está resolvido; o BL-088 (custo real por item: filial obrigatória e mensagem de escopo errada) e o BL-092 (cartão da proposta depois da falha do Omie) continuam; o cartão também diz "Qualidade: não informada" num pedido com Qualidade sim. O custo do fabricado que não chega ao Hub deixou de ser defeito pela N16-166 (BL-067 adiado).

| ID | Nó | Frente | O que falta | Selo | Evidência |
|---|---|---|---|---|---|
| BL-097 | V0.1 | Gustavo | **"Desvios" e "Pintura/acabamento" do item somem sem aviso.** A API aceita `tec_desvios` e `tec_esquema_pintura` (`api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.route.js:113` (`tec_desvios: texto(500)`)), e a tela os mostra em "Dados técnicos" (`av-hub` `components/Propostas/PropostaForm/DadosTecnicos.tsx:36` (`label="Desvios"`)); sem a migration `2026-11-16_comercial_proposta_item_desvios_pintura` (com o DBA), a proposta grava e os dois campos se perdem. Aplicar a migration no tst antes de liberar a tela | 🔴 banco pendente | AV2026-0021 no Docker local |
| BL-098 | R1 | Robert | **A fila do Recebimento mostra o produto da OP, não o material comprado.** A OC-000024 (2 chapas CH11X7X316) aparece como "DEGRAU ESCADA … 40 PÇ esperado"; a conferência mostra certo (a chapa, 2 PC) | 🟡 | NF 999024, RN-20261116-0001 |
| BL-099 | E1 | Robert | **"Usar MP…" fica fora da área visível no "Atender OP" de fabricação.** O botão está na última coluna da tabela; sem rolar para o lado, o atendimento só oferece mandar para compra | 🟡 | OP 28190/1 |
| BL-100 | K5 | Nathan | **O vendedor aprova a comissão do próprio pedido.** O Robert (Admin (Dev) e vendedor do PV-000009) aprovou a simulação na Análise de Simuladores. **Pergunta (Nathan):** vale a mesma regra da OC (N16-161), ou Compras não pode aprovar a comissão de um pedido em que é o vendedor? No Docker, sem a migration de 13/11, a v1 nasceu enviada e foi direto à fila de Compras | 🟡 ❓ | simulação `01a1e481-1072-…` |
