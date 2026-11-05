# AGENTS.md

Instruções para qualquer IA que abrir este repositório (Claude, Codex, Copilot, Cursor ou outra).

1. **Leia primeiro o `CLAUDE.md`.** Ele vale para todas as IAs: o que é o vault, como preparar o ambiente, a regra de estado (se está na `develop`, está pronto) e quem pode editar.
2. **Os procedimentos ficam em `.claude/skills/<nome>/SKILL.md`.** Mesmo que a sua ferramenta não carregue skills sozinha, abra o arquivo da tarefa e siga os passos:

| Skill | Quando usar | Quem |
|---|---|---|
| `ler-o-vault` | Qualquer pergunta sobre o projeto. Comece sempre por ela | Todos |
| `pedir-contrato` | Precisa que o sistema mude (regra, banco, API): gera o PDF do contrato | Todos |
| `abrir-consulta` | Precisa de uma resposta de negócio de quem opera: gera o PDF da consulta | Todos |
| `relatorio-de-entrega` | Terminou uma task que já está na `develop`: gera o PDF com o que mudar no vault | Todos |
| `gerar-pdf` | Último passo das três anteriores | Todos |
| `aplicar-documento-recebido` | Aplicar no vault um PDF recebido no grupo | Só o Nathan |
| `atualizar-o-vault` | Trazer o remoto e atualizar o vault pela `develop` | Só o Nathan (os demais só fazem `git pull`) |

3. **Só o Nathan altera o vault.** Para os demais, o vault é só leitura: os pedidos e as entregas vão em PDF para o grupo do WhatsApp.
