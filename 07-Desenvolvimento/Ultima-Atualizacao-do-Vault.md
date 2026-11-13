---
tags: [desenvolvimento, atualizacao, develop, manutencao]
criado: 2026-11-05
estado-em: 2026-11-13
status: vigente
dono: Nathan
fontes: [git log -1 origin/develop de cada sistema em 2026-11-13, conferência completa do vault de 13/11/2026 (docker-teste/conferencia-vault/, fora do vault), reteste R2 no Docker de 13/11/2026 (docker-teste/RELATORIO-VALIDACAO.md seção R2, RETESTE-2026-11-13-AVHUB.md e RETESTE-2026-11-13-MES.md, fora do vault), teste da proposta no Docker local de 13/11, validação local em Docker de 10/11/2026]
---

# Última atualização do vault

**Em uma frase:** guarda o commit de `origin/develop` de cada sistema que serviu de base para o vault na última atualização; é o ponto de partida do próximo comando "atualizar o vault".

**Quando consultar:** no passo 3 do comando "atualizar o vault" ([[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]) e no [[Manual-de-Manutencao-do-Vault]], para saber o que mudou na `develop` desde a última vez.

## Base atual

**Data:** 13/11/2026 (segunda atualização do dia). **Motivo:** a conferência completa do vault de 13/11 (todas as 1.640 citações de código relidas na `develop`, inclusive o que já estava conferido) e o reteste R2 no Docker de 13/11 (develop de 12/11, Hub e MES varridos por rota e por tela). **Nesta atualização:** os 14 fatos que estavam desatualizados (limite de 100 KB do corpo da API, chave do MES também no `POST /integracao/mes/avisos-compra`, fila `AVISO_COMPRA` e `id_aviso_mes_origem`, BL-013, RS-008, LOG-56 R1/R2, B16 e BL-033, BL-083, `aprovar` da Qualidade, `acessoConfig.js`, aprovação da OC em `useFecharCompra.ts`, simulador dividido, tabelas planejadas em [[Estados-e-Status]] e a tabela de schemas do [[Banco-AvHub]]); a seed 013 da família da HRM (pipeline `46b53d4`, PS-016 com o Nathan pela P9); o cabeçalho de `core.unidades` (🔴 sem tela); as 247 citações que mudaram de linha e as reescritas, além do fim, ambíguas e sumidas; os achados novos do reteste (PS-057 a PS-059, [[01-Proposta-de-Venda]], [[05-Estoque-Atendimento]], [[07-Recebimento]], [[08-Qualidade-Entrada]], [[04-PCP-Triagem-e-Destinacao]], [[06-Circuito-de-Compra]], [[RBAC-e-Permissoes]], [[MES-Front]], [[Integracao-AvHub-MES]] e LOG-58). Os fatos 1, 2, 3 e 6 foram confirmados na prática no Docker em 13/11. **Ficam de fora, com motivo:** as citações ao `api-comercial` removido (lidas em `f7d8d7f`, 25 linhas além do fim ou ambíguas, mantidas como registro do protótipo). **Antes, na primeira atualização de 13/11:** o filtro da fila por PV (BL-086, api-acos-vital #309 e av-hub #295), os avisos do MES de ponta a ponta (LOG-58, api-pcp #80 e av-hub #294) e os ajustes de Compras (av-hub #293, #296, #297 e #298) em [[06-Circuito-de-Compra]], na parte técnica 2 e no LOG-58; o menu (#292) em [[Telas-por-Raia]]; o histórico do pedido (#285) em [[03-Pedido-de-Venda-e-Liberacao]]; o prazo da requisição (app-pcp #65) em [[04-PCP-Triagem-e-Destinacao]]; o teste da proposta no Docker de 13/11 em [[01-Proposta-de-Venda]], com a PS-056 e a PS-046 em [[Pontas-Soltas]]; [[Onde-Estamos]]. O saldo futuro (BL-050, api-pcp #81, app-pcp #66, api-acos-vital #310) já tinha entrado no PR #127 do vault. As raias 02, 09, 10, 12 e 14 não tinham fato novo na conferência de 13/11.

| Sistema | Ramo lido | Commit | Data do commit | Último merge |
|---|---|---|---|---|
| `api-acos-vital` | `origin/develop` | `9abda4f` | 12/11/2026 | PR #310 (`feat/oc-referencia-aviso-recompra`) |
| `av-hub` | `origin/develop` | `c6310ad` | 12/11/2026 | PR #297 (`fix/compras-oc-omie-sem-fornecedor`) |
| `api-pcp` | `origin/develop` | `bd6b442` | 12/11/2026 | PR #81 (`feat/saldo-futuro-oc-estoque`) |
| `app-pcp` | `origin/develop` | `897dcd7` | 12/11/2026 | PR #66 (`feat/saldo-futuro-oc-estoque`) |
| `omie-elt-pipeline` | `origin/develop` (a `master`, de produção, está em `8f79d12`, sem a seed 013; o `conferir-citacoes` lê a `master`) | `46b53d4` | 13/11/2026 | seed `sql/dba_migrations/013_seed_familia_produtos_hrm.sql` (família padrão da HRM, ⏳ pendente do DBA) |

São os commits do `develop-conferida` das notas conferidas nesta atualização; as raias não tocadas ainda dizem commits anteriores.

**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 13/11/2026 09:40 (`04-Dados/Dumps/avhub-tst-esqueleto-2026-11-13.sql`, [[Dump-AvHub-Teste-2026-11-13]]), com o LOG-58b, a SQL-022 e a coluna da SQL-021. As migrations ficam com o DBA, fora do repositório, por decisão (N16-155); o dump é a referência do esquema. Do MES, o mais novo é o de 14/10.

## Como usar na próxima atualização

1. Em cada sistema, depois do `git fetch --all --prune`: `git log --oneline <commit acima>..origin/develop` e `git diff --stat <commit acima> origin/develop`.
2. Ligue cada arquivo alterado à nota que o descreve e mostre o plano ao Nathan antes de escrever.
3. Ao terminar, troque a tabela "Base atual" pelos commits novos e ponha a data. Não acumule histórico aqui: o histórico fica no git do vault.
