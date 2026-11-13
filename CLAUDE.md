# CLAUDE.md: vault do fluxo de Atividades (Aços Hub)

Este repositório é um vault Obsidian em português: o manual do fluxo de um pedido de venda de 0 a 100% no ERP da Aços Vital. Os sistemas ficam nas pastas vizinhas do vault, dentro da mesma pasta-mãe (`api-acos-vital`, `av-hub`, `api-pcp`, `app-pcp`, `omie-elt-pipeline`). Quem usar o vault precisa ter os seis repositórios clonados lado a lado nessa pasta-mãe, com estes nomes; o vault fica em `vault-avhub-mer`, o mesmo nome do repositório no GitHub. Os caminhos são sempre relativos ao vault (por exemplo, `../api-pcp`).

## Leia primeiro

1. `00-Inicio/Guia-de-Leitura-do-Vault-e-dos-Sistemas.md`: como ler o vault junto com o código, o banco e as telas, e o protocolo de certeza.
2. `00-Inicio/Manual-de-Manutencao-do-Vault.md`: o passo a passo de cada tipo de mudança no vault.
3. `00-Inicio/Regras-do-Vault.md`: regras de escrita, selos e frontmatter.

## Antes de qualquer tarefa: preparar o ambiente

1. Em cada um dos seis repositórios: `git fetch --all --prune`; anote o commit de `origin/develop` (todos têm `develop`; no `omie-elt-pipeline` ela existe desde 12/11/2026 e a produção é a `master`).
2. No vault: `git pull --ff-only`. Se não for fast-forward, pare e avise quem pediu a tarefa; nada de merge ou rebase por conta própria.
3. Sistemas são **só leitura**: nunca troque de branch, faça commit ou stash neles. Leia sem checkout: `git show origin/develop:<arquivo>`, `git grep <termo> origin/develop`.
4. No vault, `git config core.autocrlf` tem de ser `false` (o `.gitattributes` exige LF).
5. Antes de mexer em muitas notas de uma vez, confirme com quem está usando que o Obsidian está fechado.

### Repositório ausente

Se um sistema não estiver ao lado do vault (`../<repo>` não existe), não adivinhe o código:
- **No computador de quem usa:** avise e peça para clonar com o nome exato: `git clone https://github.com/Acosvital/<repo>.git ../<repo>`.
- **Numa sessão sem os repositórios (por exemplo, na nuvem):** peça acesso de leitura ao repositório pela ferramenta de repositórios da sessão e clone ao lado do vault. Sem acesso, diga isso, responda só pelo vault e marque como ❓ "não conferido na develop" tudo o que dependeria do código.
- Os cinco repositórios: `Acosvital/api-acos-vital`, `Acosvital/av-hub`, `Acosvital/api-pcp`, `Acosvital/app-pcp` e `Acosvital/omie-elt-pipeline`.

## A regra de estado (F5)

**Se está na `develop`, está pronto (✅).** A `main` não é critério de pronto, só informação. Todo ✅ cita o repositório e o arquivo:linha com âncora, por exemplo `api-acos-vital` `src/.../ordens_compra.route.js:42` (`EXIGIR_PODE_APROVAR`): a âncora é um trecho literal e curto da linha citada, e acha o lugar mesmo se a linha mudar; o commit lido fica no `develop-conferida` da nota. O módulo do Pablo (proposta e suprimentos) que não estiver na `develop` é 🔴 "sem API e sem banco".

## Gatilho: "atualizar o vault"

Quando quem estiver usando disser "atualizar o vault" (ou "atualiza o vault", "sincroniza o vault"), siga a seção **"Comando: atualizar o vault"** do Guia de Leitura. O ponto de partida é `07-Desenvolvimento/Ultima-Atualizacao-do-Vault.md`. Mostre o plano e espere o "ok" antes de escrever.

## Quem edita e os procedimentos (skills)

- **Admin do vault: Nathan, Coordenador de TI (GitHub `oluccaa`).** Só ele altera o vault (commit, PR, merge) e cria contratos direto no vault. Para saber se quem está usando é o admin, rode `git config user.name` e `git config user.email`: é o admin se o nome for `oluccaa` ou `Nathan Lucca`, ou se o e-mail contiver `oluccaa`. Se não for, trabalhe em modo leitura e não grave nada no vault.
- Robert, Gustavo e Pablo só leem: fazem `git pull` e mandam pedidos e entregas em PDF no grupo do WhatsApp.
- Os passo a passo ficam em `.claude/skills/<nome>/SKILL.md` (lista e quando usar em `AGENTS.md`): `ler-o-vault`, `pedir-contrato`, `abrir-consulta`, `perguntas-e-respostas`, `relatorio-de-entrega`, `gerar-pdf`; por sistema, `sistema-avhub`, `sistema-mes` e `sistema-pipeline-omie`, mais `banco-de-dados`, `preview-de-telas` e `status-do-projeto`; e, só para o admin, `criar-contrato`, `aplicar-documento-recebido` e `atualizar-o-vault`.
- **Contrato é um arquivo único por demanda:** contexto (o que e por quê) e as seções de frontend, backend, API e banco, com "Não se aplica" na camada que a demanda não toca. Modelo: `06-Contratos/Modelos/Modelo-de-Contrato.md`. Também há `Modelo-de-Consulta.md` (CON) e `Modelo-de-Relatorio-de-Entrega.md`. O ID final de contrato e de consulta é sempre do admin.
- Relatório de entrega só para o que já está na `develop`.

## Como achar as coisas

- Ordem do fluxo: `02-Fluxo-de-Atividades/01-...` a `15-...`; cada raia tem "anterior" e "próxima" e o `nos:` dos nós de que é dona. O diagrama é o `00-Fluxo-Mestre-0b`.
- IDs: veja `01-Projeto/Tipos-de-ID.md`. Busque o ID exato (`N16-60`, `BL-035`, `LOG-34`, `V0.3`) em vez de abrir notas inteiras.
- Notas grandes foram divididas: o detalhe fica em `<pasta>/Partes/` (frontmatter `parte-de`). Nenhuma nota passa de ~25 KB.
- Contratos da v2: `06-Contratos/Contratos-da-v2.md` (texto no GitHub, tag `v2-antes-da-v3`).
- `07-Desenvolvimento/v3/` é só o histórico da reestruturação (nomes da v2); não é fonte de estado. As fotos de fatos de antes da reescrita saíram da `main` e estão no commit `249baa8`.

## Scripts (Node, em `scripts/`)

- `node scripts/validar.mjs`: links, órfãs, CRLF, codificação, tamanho, dono dos nós e selos. Rode depois de toda mudança.
- No GitHub, a Action `validar` roda os dois em todo PR. Trabalhe numa branch, abra o PR e só mergeie com o check verde; nunca faça push direto na `main` (o GitHub não trava isso no plano atual, então a regra depende de quem usa).
- `node scripts/autoteste-validador.mjs`: prova, numa cópia temporária, que o validador acusa o que deve. Rode depois de mexer no validador.
- `node scripts/fatos.mjs extrair <nota.md>` antes de reescrever ou dividir uma nota, e `node scripts/fatos.mjs conferir` depois.
- `node scripts/dividir.mjs <chave> --simular`: divide uma nota acima de 25 KB (acrescente a entrada no `PLANO`).
- `cd 09-Diagramas/mapa && node build.mjs`: regenera o mapa HTML.
- `node scripts/conferir-citacoes.mjs`: confere as citações `arquivo:linha` do vault na `develop` dos sistemas (arquivo sumiu, linha além do fim, âncora deslocada ou sumida). Precisa dos repositórios ao lado do vault; não roda na Action.
- `node scripts/gerar-pdf.mjs <arquivo.html>`: gera o PDF de um contrato, consulta ou relatório (usa o Edge ou o Chrome instalado).

Mantenha este arquivo curto e atualizado quando mudar a estrutura, os scripts ou as regras (veja o Manual).
