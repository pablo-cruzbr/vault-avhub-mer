---
name: aplicar-documento-recebido
description: Só para o admin (Nathan, GitHub oluccaa). Aplicar no vault um PDF recebido no grupo (contrato novo, consulta ou relatório de entrega): confere tudo na develop, dá o ID, atualiza as notas numa branch e abre o PR. Use quando o Nathan disser "aplica este PDF", "registra este contrato" ou "atualiza o vault com este relatório".
---

# Aplicar um documento recebido (Nathan)

Só o admin altera o vault. Confira com `git config user.name` e `git config user.email` (nome `oluccaa` ou `Nathan Lucca`, ou e-mail com `oluccaa`). Se não for o admin, pare e use a skill `ler-o-vault`.

1. **Prepare o ambiente** (`CLAUDE.md`) e leia o PDF inteiro, incluindo o "Bloco para a IA do Nathan". Identifique o tipo (contrato, consulta, entrega), o autor e a data.
2. **Não confie no PDF: confira.** Cada afirmação sobre código é conferida na `origin/develop` (repositório, commit, arquivo:linha); cada texto "atual" é procurado no vault. Liste as divergências.
3. **Monte o plano e mostre ao Nathan antes de escrever:**
   - **Contrato:** confira se o PDF segue o `Modelo-de-Contrato` (arquivo único, com todas as seções de camada; peça o que faltar); próximo ID livre do tipo (fim do `06-Contratos/Contratos-da-v2` e `01-Projeto/Tipos-de-ID`), pasta `06-Contratos/Ativos/`, status, notas que vão citar o contrato. Siga o `Manual-de-Manutencao-do-Vault`, seção 6.
   - **Consulta:** próximo `CON`, pasta `06-Contratos/Consultas/`, no formato do `Modelo-de-Consulta`.
   - **Entrega:** só aplica o que está na `develop`. Para cada linha de "Mudanças propostas": nota, trecho, selo novo e origem; status das tasks no `Backlog-por-Frente` (e partes) e no `Onde-Estamos`; `develop-conferida` das notas tocadas.
4. Depois do "ok": crie a branch `docs/<contrato|consulta|entrega>-<id-ou-task>-AAAA-MM-DD` a partir da `main`, faça **um commit por nota** e ponha no `fontes` da nota "PDF de <autor> de <data>". O PDF não entra no git.
5. Atualize "Próximos IDs livres" no `Contratos-da-v2` e no `Tipos-de-ID` quando der um ID novo.
6. Rode `node scripts/validar.mjs` (e `cd 09-Diagramas/mapa && node build.mjs` se mexeu em contrato). Tem de dar tudo zero.
7. Faça push da branch e abra o PR. O merge é do Nathan.
8. Entregue ao Nathan a **mensagem de resposta para o grupo**: ID dado, notas atualizadas e o que ficou pendente ou divergente.
