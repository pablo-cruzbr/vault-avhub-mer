---
tags: [desenvolvimento, analise, vault, ia]
criado: 2026-11-05
atualizado: 2026-11-05
status: proposta
dono: Nathan
fontes: [leitura de 83 notas do vault em 05/11/2026, checagem automática de links, frontmatter e tamanho]
---

# Análise do vault: como organizar para IA e colaboradores

**Em uma frase:** o vault já é bem estruturado (frontmatter, selos de confiança, IDs de nó como `V1`, `P2`, `E6`, quase nenhum link quebrado); o que faz a IA se perder e o colaborador duvidar são cinco falhas pontuais, listadas abaixo por impacto.

**Quando consultar esta nota:** ao planejar a reorganização do vault. Para a leitura correta do vault e dos sistemas, veja [[Guia-de-Leitura-do-Vault-e-dos-Sistemas]]; para as regras de escrita, [[Regras-do-Vault]].

## Escopo da análise

- **Lido por inteiro:** `Comece-Aqui`, `Home`, `Regras-do-Vault` e `Onde-Estamos`.
- **Lido em parte:** `Registro-de-Decisoes`, `Painel-de-Contratos`, `Fluxo-Mestre-0b` e `Backlog-por-Frente`.
- **Checagem automática** de links, frontmatter e tamanho em 83 notas.
- **Não lido:** os cerca de 110 contratos (`Ativos`, `Entregues`, `Arquivados`), que só foram listados, e os `Omie-Dicionarios`.
- **Nada foi alterado** no vault durante a análise: foi só de leitura.

## O que corrigir, por ordem de impacto

1. **Criar um arquivo de entrada para a IA.** A raiz do vault não tem nenhum `.md`; as regras estão em `Regras-do-Vault`, escritas para humanos. Crie um `CLAUDE.md` (ou `AGENTS.md`) com cerca de 40 linhas:
    - ordem de leitura e mapa das pastas;
    - precedência das fontes: código, depois dumps, depois registro de decisões, depois fluxo mestre;
    - o que a IA nunca deve ler inteiro: o registro de decisões, os `.csv`, `.sql`, `.html` e PDFs;
    - como achar por ID: buscar `N16-60`, `BL-035` ou `V0.3` em vez de abrir a nota inteira;
    - que o perfil `Admin (Dev)` não é ator.
2. **Dividir as notas grandes demais.** 14 notas passam de 30 KB. Quando a IA abre uma delas, o contexto enche e o raciocínio se perde. Meta: nenhuma nota acima de uns 25 KB, cada pedaço compreensível sozinho.
3. **Dar um dono único a cada tipo de fato.** O estado dos setores aparece em `Onde-Estamos` (em duas tabelas), `Backlog-por-Frente`, `Fluxo-Mestre-0b` e nas notas de raia, e já diverge entre eles.
4. **Definir os prefixos de ID num só lugar.** `PS`, `OQ`, `BL`, `RS`, `N16`, `N14`, `DEC`, `EN`, `EC`, `LOG`, `SQL`, `API`, `CON` e os nós `V/P/E/C/R/Q/F/X/O/K/B` hoje são explicados em notas diferentes. Crie `Tipos-de-ID` e ligue do `CLAUDE.md` e do `Comece-Aqui`.
5. **Uniformizar o formato das notas.** 10 notas não têm "Em uma frase", entre elas `Fluxo-Mestre-0b`, `Painel-de-Contratos`, `Banco-AvHub`, `Banco-MES`, `Schemas-Postgres` e `Diferencas-Codigo-x-Banco`; `CON-03` está sem `tags` e `fontes`. Acrescente ao frontmatter `nos-do-fluxo`, `depende-de` e `resumo` (uma linha), para a IA decidir o que abrir sem abrir.

### Notas que precisam ser divididas

| Nota | Tamanho | Como dividir |
| --- | --- | --- |
| `Registro-de-Decisoes` | 190 KB (cerca de 50 mil tokens) | Um arquivo por época (N16, N14, DEC/EN/EC, #1–106) e um `Decisoes-Vigentes.md` curto |
| `03-Modelo-Novo-core_comissao` | 74 KB | Separar modelo de dados, regras e exemplos |
| `Backlog-por-Frente` | 72 KB | Um arquivo por frente: Robert, Gustavo, Nathan, Comercial |
| `00-Fluxo-Mestre-0b` | 69 KB | Diagrama de um lado, tabela nó → tela → endpoint → contrato de outro |
| `Painel-de-Contratos` | 48 KB | Um índice por pasta (`Ativos`, `Entregues`, `Arquivados`) |

### Onde o estado já diverge

- `Onde-Estamos` está rotulado "estado de 29/10", mas foi atualizado em 05/11 e cita fatos de 30/10 e 03/11, e repete a mesma tabela duas vezes (resumo e "Detalhe técnico").
- `Fluxo-Mestre-0b` e `Painel-de-Contratos` citam decisões só até N16-144; o registro vai até N16-148.
- O `Painel-de-Contratos` ainda mostra CON-01 e CON-02 como "aguardando resposta", com prazo de 20/10.
- 72 das 83 notas têm `atualizado: 2026-10-29`; é data de carga em lote e não informa nada.

**Correção:** status só em `Onde-Estamos` e `Backlog`, e as notas de raia apenas apontam para eles. Troque `atualizado` por `estado-em:` com a data real do conteúdo. Gere as contagens do `Painel` por script ou Dataview.

## Para os colaboradores entenderem 100%

- **Trilhas por perfil que faltam.** A tabela do `Comece-Aqui` cobre TI, Controladoria e Compras. Faltam Vendas, Fiscal, Estoque, Qualidade e Expedição, que são quem valida as regras de negócio.
- **Detalhe técnico no fim, como regra geral.** Vale para toda nota acima de 10 KB, não só para `Onde-Estamos`; o topo fica em linguagem simples, como o registro de decisões já faz.
- **Pasta 10 mal classificada.** `Mapa-Rotas-BFF-Bearer` está em "Fora do Fluxo", mas o `Comece-Aqui` o lista como leitura principal do front. Mova para `03-Sistemas`.
- **Teste de aceite.** Faça 10 perguntas-padrão, como "qual a regra de aprovação de OC?" e "quem toca o Recebimento?". Rode com a IA e com um colaborador de cada área depois de cada reorganização. Se errar, a nota certa está mal indexada.

## Links e frontmatter

Nas 83 notas lidas não há link realmente quebrado nem nota órfã. Os 16 "links quebrados" que o script apontou são falsos alarmes: apontam para notas não lidas (`Omie-Dicionarios`, `Arquivados`) ou vêm de pipes escapados em tabelas.

## Próximo passo

Escrever o `CLAUDE.md`, a nota `Tipos-de-ID` e a divisão do `Registro-de-Decisoes`.
