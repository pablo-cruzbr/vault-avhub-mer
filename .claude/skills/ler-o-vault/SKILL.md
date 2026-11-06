---
name: ler-o-vault
description: Responder perguntas sobre o ERP da Aços Vital (fluxo do pedido, av-hub, MES, Omie, proposta, compras, estoque, comissão, decisões, tasks BL, contratos) lendo o vault e conferindo na develop dos sistemas. Use em qualquer pergunta sobre o projeto, antes de qualquer outra skill.
---

# Ler o vault e responder

O vault é **só leitura** para quem não é o admin (Nathan, GitHub `oluccaa`; veja como conferir no `CLAUDE.md`). Não edite, não commite, não faça push.

1. **Prepare o ambiente** como manda o `CLAUDE.md` ("Antes de qualquer tarefa"): `git fetch --all --prune` no vault e nos cinco sistemas vizinhos; no vault, `git checkout main` e `git pull --ff-only` (se houver alteração local, avise e pare).
2. **Leia o necessário, nada além:**
   - `CLAUDE.md` e `00-Inicio/Guia-de-Leitura-do-Vault-e-dos-Sistemas.md` (protocolo de certeza);
   - `00-Inicio/Home.md` para achar a raia; o `nos:` do frontmatter diz de quais nós ela é dona;
   - `01-Projeto/Tipos-de-ID.md` para entender um código (`N16-60`, `BL-035`, `PS-037`, `LOG-34`);
   - o `Registro-de-Decisoes` só por busca do ID; o detalhe técnico das notas grandes fica em `Partes/`.
   - Nunca abra inteiro um arquivo acima de 25 KB: busque pelo ID ou leia os títulos.
3. **Pergunta sobre estado (existe? está pronto?):** use a skill do sistema (`sistema-avhub`, `sistema-mes` ou `sistema-pipeline-omie`) para saber onde procurar, `banco-de-dados` para o banco e `preview-de-telas` para ver a tela. Confira na `origin/develop` do sistema, sem trocar de branch (`git show origin/develop:<arquivo>`, `git grep <termo> origin/develop`). Se está na `develop`, está pronto (✅). O `omie-elt-pipeline` usa `origin/master`.
4. **Responda citando** a nota, o nó e o selo de cada afirmação, e a origem no código (repositório, commit, arquivo:linha) quando conferiu.
   - Se o vault não tiver a resposta, diga isso. Não invente.
   - Se o código e o vault divergirem, mostre os dois lados.
5. **Se a resposta mostrar que falta algo:** ofereça a skill certa: `criar-contrato` se for o admin, ou `pedir-contrato` se não for (precisa mudar o sistema), `abrir-consulta` (precisa de resposta de negócio) ou `relatorio-de-entrega` (a pessoa já fez uma task e o vault está desatualizado).
