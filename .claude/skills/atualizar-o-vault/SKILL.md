---
name: atualizar-o-vault
description: Só para o Nathan. Trazer o remoto para o local sem perder nada local, ler o que mudou na develop dos sistemas desde a última atualização e atualizar o vault. Use quando o Nathan disser "atualizar o vault", "atualiza o vault" ou "sincroniza o vault".
---

# Atualizar o vault (Nathan)

Para quem não é o Nathan, "atualizar" quer dizer só trazer o remoto: `git fetch --all --prune`, `git checkout main` e `git pull --ff-only`, e nada mais.

Para o Nathan, siga **à risca** a seção "Comando: atualizar o vault" de `00-Inicio/Guia-de-Leitura-do-Vault-e-dos-Sistemas.md`. O ponto de partida é `07-Desenvolvimento/Ultima-Atualizacao-do-Vault.md`. Resumo da ordem:

1. Proteger o que é local (alterações e commits sem push: listar e perguntar).
2. Trazer o remoto com `git pull --ff-only` (se divergir, parar).
3. `git fetch` nos sistemas e ler a `origin/develop` sem checkout.
4. Descobrir o que mudou desde o commit registrado e ligar a cada nota.
5. Mostrar o plano e esperar o "ok".
6. Atualizar numa branch, um commit por nota, validar, registrar os novos commits em `Ultima-Atualizacao-do-Vault` e abrir o PR.
