---
tags: [desenvolvimento, backlog, pendencias, parte, validacao, acessos]
criado: 2026-11-18
estado-em: 2026-11-18
status: vigente
dono: Nathan
parte-de: "[[Backlog-por-Frente]]"
develop-conferida: [api-acos-vital a6eee9d, av-hub 22ccece, em 2026-11-18]
fontes: [teste das telas de Acessos (LOG-62) contra a API do tst em 18/11/2026, com perfil, pessoa e telas criados só para o teste e apagados no fim, N16-178]
---

# Backlog: o que o teste das telas de Acessos achou, 18/11

**Em uma frase:** itens BL-108 a BL-110, o que ficou faltando depois de testar Perfis, Pessoas e Telas (`LOG-62`) contra a API do tst, em 18/11/2026. Cada linha diz a frente.

**Onde estamos:** ← [[Backlog-por-Frente]] (resumo e índice) · reteste anterior: [[Backlog-Reteste-R5-R6-2026-11-16]]

O teste rodou com a `develop` de 18/11 (av-hub `22ccece`, api-acos-vital `a6eee9d`) e o SQL do LOG-62 já aplicado no tst. As telas e as gravações funcionaram; o que segue é o que falta fora do Hub.

| ID | Nó | Frente | O que falta | Selo | Evidência |
|---|---|---|---|---|---|
| BL-108 | transversal | Gustavo | **A página da pessoa recebe os grupos do menu.** `GET /acessos/pessoas/:id` manda Cadastros, Compras etc. como telas, com as ações antigas. O Hub esconde por conta própria (`av-hub` `lib/domain/acessos-pessoas.ts:115` (`export function semGrupos`), `GAMBIARRA(vault LOG-62)`). Falta a API marcar o grupo (`grupo: true`) ou não mandá-lo, e trazer só as ações que a tela usa; depois o Hub tira o remendo | 🔴 | Página da pessoa no tst |
| BL-109 | transversal | Gustavo | **Não há como redefinir a senha de outra pessoa.** O `PATCH /usuarios/:id/senha` só troca a própria (`SENHA_DE_OUTRO_USUARIO`). Falta a rota; depois a página da pessoa ganha o botão "Redefinir senha" do protótipo | 🔴 | Protótipo do LOG-62 |
| BL-110 | transversal | Gustavo | **A P2 do LOG-62 não entrou no SQL.** `custo-item` ainda é tela comum no tst; pela decisão do Nathan de 18/11, vira a ação "Ver custo" de Propostas (`acao_de` = `propostas`, `rotulo_acao` = "Ver custo"), criada onde não existir | 🔴 | `GET /acessos/telas` no tst |
