# CLAUDE.md: vault do fluxo de Atividades (Aços Hub)

Este repositório é um vault Obsidian em português: o manual do fluxo de um pedido de venda de 0 a 100% no ERP da Aços Vital. Os sistemas ficam nas pastas vizinhas de `C:\Users\nathan.silva\Desktop\Gerenciamento-de-Integracoes` (`api-acos-vital`, `av-hub`, `api-pcp`, `app-pcp`, `omie-elt-pipeline`).

## Leia primeiro

1. `00-Inicio/Guia-de-Leitura-do-Vault-e-dos-Sistemas.md`: como ler o vault junto com o código, o banco e as telas, e o protocolo de certeza.
2. `00-Inicio/Manual-de-Manutencao-do-Vault.md`: o passo a passo de cada tipo de mudança no vault.
3. `00-Inicio/Regras-do-Vault.md`: regras de escrita, selos e frontmatter.

## Antes de qualquer tarefa: preparar o ambiente

1. Em cada um dos seis repositórios: `git fetch --all --prune`; anote o commit de `origin/develop` (no `omie-elt-pipeline`, `origin/master`).
2. No vault: `git pull --ff-only`. Se não for fast-forward, pare e avise o Nathan; nada de merge ou rebase por conta própria.
3. Sistemas são **só leitura**: nunca troque de branch, faça commit ou stash neles. Leia sem checkout: `git show origin/develop:<arquivo>`, `git grep <termo> origin/develop`.
4. No vault, `git config core.autocrlf` tem de ser `false` (o `.gitattributes` exige LF).
5. Antes de mexer em muitas notas de uma vez, confirme com o Nathan que o Obsidian está fechado.

## A regra de estado (F5)

**Se está na `develop`, está pronto (✅).** A `main` não é critério de pronto, só informação. Todo ✅ cita o repositório e o arquivo:linha; o commit lido fica no `develop-conferida` da nota. O módulo do Pablo (proposta e suprimentos) que não estiver na `develop` é 🔴 "sem API e sem banco".

## Gatilho: "atualizar o vault"

Quando o Nathan disser "atualizar o vault" (ou "atualiza o vault", "sincroniza o vault"), siga a seção **"Comando: atualizar o vault"** do Guia de Leitura. O ponto de partida é `07-Desenvolvimento/Ultima-Atualizacao-do-Vault.md`. Mostre o plano e espere o "ok" antes de escrever.

## Como achar as coisas

- Ordem do fluxo: `02-Fluxo-de-Atividades/01-...` a `15-...`; cada raia tem "anterior" e "próxima" e o `nos:` dos nós de que é dona. O diagrama é o `00-Fluxo-Mestre-0b`.
- IDs: veja `01-Projeto/Tipos-de-ID.md`. Busque o ID exato (`N16-60`, `BL-035`, `LOG-34`, `V0.3`) em vez de abrir notas inteiras.
- Notas grandes foram divididas: o detalhe fica em `<pasta>/Partes/` (frontmatter `parte-de`). Nenhuma nota passa de ~25 KB.
- Contratos da v2: `06-Contratos/Contratos-da-v2.md` (texto no GitHub, tag `v2-antes-da-v3`).
- `07-Desenvolvimento/v3/` é só o histórico da reestruturação (nomes da v2); não é fonte de estado. As fotos de fatos de antes da reescrita saíram da `main` e estão no commit `249baa8`.

## Scripts (Node, em `scripts/`)

- `node scripts/validar.mjs`: links, órfãs, CRLF, codificação, tamanho, dono dos nós e selos. Rode depois de toda mudança.
- `node scripts/autoteste-validador.mjs`: prova, numa cópia temporária, que o validador acusa o que deve. Rode depois de mexer no validador.
- `node scripts/fatos.mjs extrair <nota.md>` antes de reescrever ou dividir uma nota, e `node scripts/fatos.mjs conferir` depois.
- `node scripts/dividir.mjs <chave> --simular`: divide uma nota acima de 25 KB (acrescente a entrada no `PLANO`).
- `cd 09-Diagramas/mapa && node build.mjs`: regenera o mapa HTML.

Mantenha este arquivo curto e atualizado quando mudar a estrutura, os scripts ou as regras (veja o Manual).
