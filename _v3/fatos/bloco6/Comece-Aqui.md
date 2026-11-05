# Fatos de Comece-Aqui

Foto tirada em 2026-11-05 de `00-Inicio/Comece-Aqui.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir Comece-Aqui`.

## decisões e IDs (0)


## contratos (1)

- `LOG-52`

## commits (0)


## arquivo:linha (0)


## rotas (0)


## datas (2)

- `26/10/2026`
- `28/10`

## código entre crases (6)

- `09-Diagramas/Historia-da-Proposta-ao-Pedido.pdf`
- `C6`
- `C8`
- `E6`
- `P2`
- `V1`

## regras e linhas de conteúdo (18)

- [[Visao-do-Projeto]]: o que é o ERP da Aços Vital e quais princípios o guiam.
- [[00-Fluxo-Mestre-0b]]: o diagrama do pedido de 0 a 100%. Cada nó (`V1`, `P2`, `E6`…) mostra setor, tela, endpoint, contrato e se já existe no código (✅ 🟡 🔴).
- [[Onde-Estamos]]: uma tela com o que está pronto e o que falta, setor por setor.
- [[01-Proposta-de-Venda]]: a proposta, com ligação para o Orçamento, o custo real e a comissão nova (aprovados em 26/10/2026). Antes, leia a história de ponta a ponta em `09-Diagramas/Historia-da-Proposta-ao-Pedido.pdf`.
- [[Regras-do-Vault]]: como escrever uma nota. Leia antes de editar qualquer coisa.
- | Robert (MES, o sistema de chão de fábrica, e o módulo comercial na API do Hub desde 28/10) | [[Backlog-por-Frente]] (frente MES), [[MES-Backend]], [[MES-Front]], [[Estados-e-Status]], [[Contratos-da-v2\|LOG-52]], [[Mapa-do-Modulo-do-Pablo]] |
- | Gustavo (DBA, cuida do banco e da API do av-hub) | [[Backlog-por-Frente]] (frente DBA), [[AV-Hub-API]], [[Banco-AvHub]], [[Diferencas-Codigo-x-Banco]] |
- | Nathan (front do av-hub) | [[AV-Hub-Front]], [[Telas-por-Raia]], [[Mapa-Rotas-BFF-Bearer]] |
- | Pablo (acompanha o módulo comercial e cuida do Orçamento) | [[Mapa-do-Modulo-do-Pablo]], [[02-Orcamento-Base-de-Preco]], [[API-Comercial]] (legado de leitura), [[Comercial-Suprimentos]] |
- | Controladoria (Michele) | [[15-Custo-Real-e-Comissao]], [[04-Regras-e-Estados-da-Comissao-Nova]] |
- | Compras e Orçamento | [[06-Circuito-de-Compra]] (com os nós `C6` a `C8`), [[02-Orcamento-Base-de-Preco]] |
- **Um contrato:** [[Contratos-da-v2]] (ID, apelido, status e nó do 0b).
- **Uma decisão:** [[Registro-de-Decisoes]].
- **Uma nota do vault antigo:** [[Mapa-v1-para-v2]] (v1 → v2) e [[Mapa-v2-para-v3]] (v2 → v3).
- **Como ler o vault junto com o código, as telas e o banco (para a IA e para quem analisa):** [[Guia-de-Leitura-do-Vault-e-dos-Sistemas]].
- **O que ainda está solto:** [[Pontas-Soltas]], [[Perguntas-Proposta-Pedido-Comissao]] e [[Contradicoes-Resolvidas]].
- | 🔴 | Aberto ou sem código |
- | ❓ | Não conferido em produção |
