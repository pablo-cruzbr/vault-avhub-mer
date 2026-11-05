---
name: relatorio-de-entrega
description: Gerar o relatório de entrega de uma task (BL) ou contrato já feito: confere na develop o que mudou, compara com o vault e gera o PDF com o texto proposto para o Nathan atualizar o vault. Use quando alguém diz que terminou uma task ou que o vault está desatualizado sobre algo que fez.
---

# Relatório de entrega (PDF para o grupo)

1. Siga os passos 1 e 2 da skill `ler-o-vault`.
2. Leia `06-Contratos/Modelos/Modelo-de-Relatorio-de-Entrega.md` inteiro.
3. **Ache a task no vault:** o `BL-NNN` em `07-Desenvolvimento/Backlog-por-Frente` e nas partes; o nó, a raia e o contrato ligados.
4. **Confira que está na `develop`** (regra F5). Procure os commits na `origin/develop` (`git log origin/develop --oneline -- <arquivos>`, `git log origin/develop --grep <BL-NNN>`) e leia os arquivos sem checkout.
   - **Se ainda não estiver na `develop`, pare.** Diga que o relatório só sai depois do merge na `develop` e não gere PDF.
   - Se só parte está na `develop`, o relatório cobre só essa parte e lista o resto em "O que ficou de fora".
5. **Compare com o vault** e monte a tabela de "Mudanças propostas": o texto atual copiado igual, o texto proposto, o selo atual → proposto e a origem (repositório, commit, arquivo:linha).
6. Liste o que ficou de fora, as divergências entre vault e código e as perguntas.
7. **Confira antes de gerar:** cada ✅ proposto tem commit da `develop`; cada texto atual foi copiado igual; nada inventado.
8. Gere o PDF com a skill `gerar-pdf` (tipo `Entrega`).
