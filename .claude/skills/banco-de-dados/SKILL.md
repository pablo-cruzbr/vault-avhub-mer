---
name: banco-de-dados
description: Conferir o banco de dados do av-hub ou do MES (tabelas, colunas, funções, views, constraints) e pedir um dump atualizado quando o do vault estiver velho ou não tiver o que precisa. Use sempre que uma resposta, contrato ou relatório depender do que existe no banco.
---

# Banco de dados (av-hub e MES)

## 1. Onde está a verdade de cada banco
| Banco | Schemas | Onde conferir |
|---|---|---|
| **av-hub** (Postgres) | `core_*`, `auth`, `historico`, `omie_*` | **Só no dump**: o esquema não está no repositório da `api-acos-vital` |
| **MES** (Postgres) | `public` | `prisma/migrations/` da `origin/develop` do `api-pcp` (skill `sistema-mes`); o dump confirma o banco real |

Os dumps ficam em `04-Dados/Dumps/` (no git desde 05/11/2026; o repositório é privado). Cada dump tem uma ficha em `04-Dados/Dump-<Banco>-<Ambiente>-AAAA-MM-DD.md` (exemplo: `Dump-AvHub-Teste-2026-11-04`), que diz de quando é, de qual ambiente e o que mudou. As notas `04-Dados/Banco-AvHub`, `Banco-MES`, `Schemas-Postgres` e `Diferencas-Codigo-x-Banco` resumem o banco.

## 2. Como ler um dump sem se perder
Dumps são grandes: **nunca abra inteiro**. Busque o objeto:
- tabela: `grep -n "CREATE TABLE core_compras.ordens_compra" -A 40 04-Dados/Dumps/<arquivo>.sql`
- função: `grep -n "FUNCTION core_comercial.fn_" 04-Dados/Dumps/<arquivo>.sql`
- coluna: `grep -n "<coluna>" 04-Dados/Dumps/<arquivo>.sql`

Cite sempre o arquivo do dump, a data e a linha.

## 3. Quando pedir um dump atualizado
Peça ao Nathan um dump novo quando:
- o dump mais novo é anterior a uma mudança de banco que você viu no código ou num contrato;
- o código e o dump discordam sobre uma tabela, coluna, função ou constraint;
- a decisão depende do formato real dos dados (por exemplo, sequenciais ou itens sem valor);
- o objeto que você procura não aparece no dump.

## 4. Como pedir (mensagem pronta)
Você **nunca** pede senha nem conecta no banco. Quem gera o dump é o Nathan. Peça o mínimo: **só o esquema**, do ambiente de **teste**, salvo se for preciso outro. Se quem está usando não é o admin, a mensagem vai para o Nathan no grupo.

```
Nathan, preciso de um dump atualizado para conferir <o quê e por quê>.
Banco: <av-hub | MES>   Ambiente: <teste | outro>
Só o esquema, sem dados:
  pg_dump --schema-only --no-owner --no-privileges <-n schemas, ex.: -n 'core_*' -n auth -n historico -n 'omie_*'> -f <banco>-<ambiente>-esqueleto-AAAA-MM-DD.sql
<Dados só se necessário: tabelas exatas, sem dado pessoal.>
```

## 5. Quando o dump novo chegar (admin)
1. Salve em `04-Dados/Dumps/<banco>-<ambiente>-esqueleto-AAAA-MM-DD.sql`.
2. Compare com o dump anterior (`git diff --no-index --stat <antigo> <novo>`, depois por objeto) e liste o que mudou.
3. Crie a ficha `04-Dados/Dump-<Banco>-<Ambiente>-AAAA-MM-DD.md` (o mesmo formato da `Dump-AvHub-Teste-2026-11-04`) e atualize `Banco-AvHub` ou `Banco-MES` e `Diferencas-Codigo-x-Banco`.
4. Dado pessoal ou financeiro que vier no dump não vai para as notas.
