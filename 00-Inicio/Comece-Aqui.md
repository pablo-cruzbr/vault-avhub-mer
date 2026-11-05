---
tags: [inicio, guia]
criado: 2026-10-14
atualizado: 2026-10-29
status: vigente
dono: Nathan
fontes: [plano de 14/10/2026]
---

# Comece aqui

**Em uma frase:** é o roteiro de leitura para quem acabou de chegar: em 5 minutos você entende o projeto e sabe onde procurar o resto.

**Quando consultar esta nota:** na sua primeira visita, ou quando não souber por onde começar.

## Leia nesta ordem (5 minutos)

1. [[Visao-do-Projeto]]: o que é o ERP da Aços Vital e quais princípios o guiam.
2. [[00-Fluxo-Mestre-0b]]: o diagrama do pedido de 0 a 100%. Cada nó (`V1`, `P2`, `E6`…) mostra setor, tela, endpoint, contrato e se já existe no código (✅ 🟡 🔴).
3. [[Onde-Estamos]]: uma tela com o que está pronto e o que falta, setor por setor.
4. [[01-Proposta-e-Pedido-de-Venda]]: a proposta, o Orçamento, o custo real e a comissão nova (aprovados em 26/10/2026). Antes, leia a história de ponta a ponta em `09-Diagramas/Historia-da-Proposta-ao-Pedido.pdf`.
5. [[Regras-do-Vault]]: como escrever uma nota. Leia antes de editar qualquer coisa.

## Por perfil

| Quem | Vá para |
|---|---|
| Robert (MES, o sistema de chão de fábrica, e o módulo comercial na API do Hub desde 28/10) | [[Backlog-por-Frente]] (frente MES), [[MES-Backend]], [[MES-Front]], [[Estados-e-Status]], [[Contratos-da-v2\|LOG-52]], [[Mapa-do-Modulo-do-Pablo]] |
| Gustavo (DBA, cuida do banco e da API do av-hub) | [[Backlog-por-Frente]] (frente DBA), [[AV-Hub-API]], [[Banco-AvHub]], [[Diferencas-Codigo-x-Banco]] |
| Nathan (front do av-hub) | [[AV-Hub-Front]], [[Telas-por-Raia]], [[Mapa-Rotas-BFF-Bearer]] |
| Pablo (acompanha o módulo comercial e cuida do Orçamento) | [[Mapa-do-Modulo-do-Pablo]], [[02-Orcamento-Base-de-Preco]], [[API-Comercial]] (legado de leitura), [[Comercial-Suprimentos]] |
| Controladoria (Michele) | [[15-Custo-Real-e-Comissao]], [[04-Regras-e-Estados-da-Comissao-Nova]] |
| Compras e Orçamento | [[06-Circuito-de-Compra]], [[02-Orcamento-Base-de-Preco]], [[01-Proposta-e-Pedido-de-Venda]] (nós `C6` a `C8`) |

## Como achar as coisas

- **Um contrato:** [[Contratos-da-v2]] (ID, apelido, status e nó do 0b).
- **Uma decisão:** [[Registro-de-Decisoes]].
- **Um termo:** [[Glossario]].
- **Uma nota do vault antigo:** [[Mapa-v1-para-v2]] (v1 → v2) e [[Mapa-v2-para-v3]] (v2 → v3).
- **Como ler o vault junto com o código, as telas e o banco (para a IA e para quem analisa):** [[Guia-de-Leitura-do-Vault-e-dos-Sistemas]].
- **O que ainda está solto:** [[Pontas-Soltas]], [[Perguntas-Proposta-Pedido-Comissao]] e [[Contradicoes-Resolvidas]].

## Selos

| Selo | Significa |
|---|---|
| ✅ | Está no código |
| 📝 | Decidido |
| 🟡 | Proposta ou parcial |
| 🔴 | Aberto ou sem código |
| ❓ | Não conferido em produção |
