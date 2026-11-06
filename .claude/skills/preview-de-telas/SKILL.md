---
name: preview-de-telas
description: Ver uma tela do av-hub ou do app-pcp funcionando, no navegador embutido do app (preview), rodando o código da develop no computador local. Use quando a resposta depender do que a tela mostra, dos campos, botões, mensagens, permissões por perfil ou do caminho de um nó do fluxo na prática.
---

# Preview de telas (av-hub e app-pcp)

Ler o componente não prova o que a tela faz; o preview prova. Siga estes passos e **peça permissão ao usuário antes do passo 2**, porque ele cria uma pasta e instala pacotes no computador.

## 1. Decida o que vai olhar
- O sistema (`av-hub` ou `app-pcp`), a tela e a rota (skills `sistema-avhub` ou `sistema-mes`, e a nota `Telas-por-Raia`).
- O que precisa conferir: campos, botões, estados (vazio, erro, carregando), mensagens, o que cada perfil vê.

## 2. Suba a `develop` sem mexer no trabalho de ninguém
Se `../<repo>` não existir, ou se a sessão não roda no computador de quem usa (por exemplo, na nuvem), não há preview: diga isso e use só a leitura do código. A pasta local do repositório pode estar numa branch de feature. **Não troque de branch.** Crie uma cópia de trabalho separada da `develop`:

```
git -C ../<repo> fetch --all --prune
git -C ../<repo> worktree add ../_preview/<repo> origin/develop --detach
```

Depois:
1. **Arquivo de ambiente:** o `av-hub` usa `.env.local`; o `app-pcp`, o arquivo que o usuário indicar. Peça ao usuário para copiar o arquivo para `../_preview/<repo>/`, ou copie com a autorização dele. **Nunca mostre nem leia em voz alta o conteúdo.** Se não existir, pare e pergunte.
2. **Pacotes:** `npm ci` dentro de `../_preview/<repo>`.
3. **Porta própria** (todos os sistemas usam a 3000 por padrão): `av-hub` → `npm run dev -- -p 3100`; `app-pcp` → `npm run dev -- -p 3200`.
4. **API por trás:** a tela chama a API do `API_URL` do arquivo de ambiente. Confirme com o usuário qual API é (local ou de teste). **Nunca use produção para testar escrita.**
5. **Login:** no `av-hub`, o modo de desenvolvimento sem login liga com `NEXT_PUBLIC_DEV_SEM_LOGIN=true` (veja `lib/auth/devSemLogin.ts`; nunca vale em produção). Telas sem dados reais podem usar `FLUXO_FIXTURES` e `CUSTO_ITENS_FIXTURES`. No `app-pcp`, use o usuário de teste que o usuário passar.

## 3. Olhe a tela
1. Abra `http://localhost:<porta>/<rota>` no navegador embutido (preview) do app.
2. Navegue pelo caminho do nó no `00-Fluxo-Mestre-0b` e anote o que viu e o que o vault diz.
3. **Teste com um perfil de negócio**, não só com `Admin (Dev)`: esse perfil vê tudo e esconde problema de permissão.
4. **Não grave dado em ambiente real.** Só crie registros se o usuário autorizar e se a API for de teste.

## 4. Registre e limpe
1. Cite o repositório, o commit da `develop` usado no preview, a rota e o perfil. Divergência vai para o relatório (ou para `Pontas-Soltas`, se for o admin).
2. Pare o servidor e remova a cópia: `git -C ../<repo> worktree remove ../_preview/<repo>`. Se o arquivo de ambiente foi copiado, ele sai junto com a pasta.
