# AGENTS.md

Instruções para qualquer IA que abrir este repositório (Claude, Codex, Copilot, Cursor ou outra).

1. **Leia primeiro o `CLAUDE.md`.** Ele vale para todas as IAs: o que é o vault, como preparar o ambiente, a regra de estado (se está na `develop`, está pronto) e quem pode editar.
2. **Os procedimentos ficam em `.claude/skills/<nome>/SKILL.md`.** Mesmo que a sua ferramenta não carregue skills sozinha, abra o arquivo da tarefa e siga os passos:

| Skill | Quando usar | Quem |
|---|---|---|
| `ler-o-vault` | Qualquer pergunta sobre o projeto. Comece sempre por ela | Todos |
| `criar-contrato` | Cria o contrato direto no vault, com ID, numa branch com PR | Só o admin |
| `sistema-avhub` | Ler e procurar no av-hub (front `av-hub` e API `api-acos-vital`): tela → BFF → rota → banco | Todos |
| `sistema-mes` | Ler e procurar no MES (API `api-pcp` e front `app-pcp`), incluindo as migrations Prisma | Todos |
| `sistema-pipeline-omie` | Ler e procurar no `omie-elt-pipeline` (sincronização com o Omie e envio de OC) | Todos |
| `banco-de-dados` | Conferir tabela, coluna ou função no dump e pedir um dump atualizado | Todos |
| `status-do-projeto` | Panorama em formato fixo: pronto, falta, parado e feito sem registro, por raia e por pessoa | Todos |
| `preview-de-telas` | Ver uma tela da `develop` funcionando no navegador embutido | Todos |
| `pedir-contrato` | Precisa que o sistema mude: gera o PDF do contrato (arquivo único com frontend, backend, API e banco) | Quem não é admin |
| `abrir-consulta` | Precisa de uma resposta de negócio de quem opera: gera o PDF da consulta | Todos |
| `relatorio-de-entrega` | Terminou uma task que já está na `develop`: gera o PDF com o que mudar no vault | Todos |
| `gerar-pdf` | Último passo das três anteriores | Todos |
| `aplicar-documento-recebido` | Aplicar no vault um PDF recebido no grupo | Só o admin |
| `atualizar-o-vault` | Trazer o remoto e atualizar o vault pela `develop` | Só o admin (os demais só fazem `git pull`) |

3. **Só o admin altera o vault: Nathan, Coordenador de TI (GitHub `oluccaa`).** Confira com `git config user.name` e `git config user.email`: é o admin se o nome for `oluccaa` ou `Nathan Lucca`, ou se o e-mail contiver `oluccaa`. Para os demais, o vault é só leitura: os pedidos e as entregas vão em PDF para o grupo do WhatsApp.
