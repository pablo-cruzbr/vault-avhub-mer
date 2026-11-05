---
tags: [home, moc]
criado: 2026-10-14
estado-em: 2026-11-05
status: vigente
dono: Nathan
fontes: [plano de 14/10/2026, estrutura da v3 (05/11/2026)]
---

# Home: manual do fluxo de Atividades (0b)

**Em uma frase:** este vault é o manual para construir o fluxo de **Atividades** do ERP (sistema de gestão) da Aços Vital: o caminho de um pedido de venda de 0 a 100%.

**Quando consultar esta nota:** quando você quiser achar qualquer assunto do projeto. Ela é o índice de todas as pastas.

O pedido começa na proposta (ou no pedido digitado no Omie) e termina na nota fiscal e na comissão. Este vault substitui a v1 e a v2 (tags `arquivo/v1` e `v2-final`, congeladas).

## Por onde começar

- Chegou agora? Comece por [[Comece-Aqui]].
- Quer saber o que está pronto e o que falta? Veja [[Onde-Estamos]] (estado) e [[Backlog-por-Frente]] (tarefas).
- É uma IA, ou vai analisar o código com o vault? Leia [[Guia-de-Leitura-do-Vault-e-dos-Sistemas]].
- Vai mudar o vault? Siga o [[Manual-de-Manutencao-do-Vault]] e as [[Regras-do-Vault]].
- Achou um código que não conhece (`N16-60`, `BL-035`, `LOG-34`)? Veja [[Tipos-de-ID]].

## O fluxo, na ordem do pedido

O número de cada nota é a posição dela no fluxo. Cada raia tem, no topo, a anterior e a próxima: dá para percorrer o fluxo inteiro só pelos links "próxima". O diagrama completo é o [[00-Fluxo-Mestre-0b]].

1. [[01-Proposta-de-Venda]]
2. [[02-Orcamento-Base-de-Preco]]
3. [[03-Pedido-de-Venda-e-Liberacao]]
4. [[04-PCP-Triagem-e-Destinacao]]
5. [[05-Estoque-Atendimento]]
6. [[06-Circuito-de-Compra]]
7. [[07-Recebimento]]
8. [[08-Qualidade-Entrada]]
9. [[09-Estoque-Entrada-do-Lote]]
10. [[10-Producao-e-Roteiro]]
11. [[11-Qualidade-Saida]]
12. [[12-Estoque-Despacho]]
13. [[13-Expedicao]]
14. [[14-Fiscal-Omie]]
15. [[15-Custo-Real-e-Comissao]]

Em resumo: Proposta → Orçamento → Pedido → PCP → Estoque → Compra → Recebimento → Qualidade → Produção → Expedição → Fiscal → Comissão.

## Trilhas por assunto

| Assunto | Leia nesta ordem |
|---|---|
| **Vendas** (proposta e pedido) | [[01-Proposta-de-Venda]] → [[03-Pedido-de-Venda-e-Liberacao]] → [[Telas-e-Experiencia-do-Usuario]] → [[Mapa-IncluirPedido-Omie]] |
| **Orçamento e Compras** | [[02-Orcamento-Base-de-Preco]] → [[06-Circuito-de-Compra]] → [[07-Recebimento]] → [[Integracao-AvHub-MES]] |
| **Estoque** | [[05-Estoque-Atendimento]] → [[09-Estoque-Entrada-do-Lote]] → [[12-Estoque-Despacho]] → [[Modelo-Estoque-e-Custo-do-Lote]] |
| **Qualidade** | [[08-Qualidade-Entrada]] → [[11-Qualidade-Saida]] → [[Estados-e-Status]] |
| **Produção** | [[04-PCP-Triagem-e-Destinacao]] → [[10-Producao-e-Roteiro]] → [[MES-Backend]] |
| **Expedição** | [[12-Estoque-Despacho]] → [[13-Expedicao]] → [[14-Fiscal-Omie]] |
| **Fiscal e Omie** | [[14-Fiscal-Omie]] → [[Omie-Integracao-Estado]] → [[Etapas-Faturamento]] → [[Colunas-Protegidas]] → [[Estudo-Omie-API]] |
| **Custo e comissão** | [[15-Custo-Real-e-Comissao]] → [[04-Regras-e-Estados-da-Comissao-Nova]] → [[03-Modelo-Novo-core_comissao]] |

## Mapa das pastas

| Pasta | O que tem |
|---|---|
| `00-Inicio` | Porta de entrada: [[Comece-Aqui]] · [[Onde-Estamos]] · [[Regras-do-Vault]] · [[Guia-de-Leitura-do-Vault-e-dos-Sistemas]] · [[Manual-de-Manutencao-do-Vault]] · [[Mapa-v1-para-v2]] · [[Mapa-v2-para-v3]] |
| `01-Projeto` | O projeto em si: [[Visao-do-Projeto]] · [[Sistemas-e-Responsabilidades]] · [[Equipe-e-Divisao]] · [[Cronograma]] · [[Infraestrutura]] · [[Glossario]] · [[Tipos-de-ID]] |
| `02-Fluxo-de-Atividades` | **O coração do manual.** [[00-Fluxo-Mestre-0b]] e uma nota por etapa (lista acima); em `Transversais/`: [[Telas-e-Experiencia-do-Usuario]], [[Estados-e-Status]] e [[Telas-por-Raia]] |
| `03-Sistemas` | Como cada sistema é feito: [[AV-Hub-Front]] · [[AV-Hub-API]] · [[API-Comercial]] · [[Mapa-do-Modulo-do-Pablo]] · [[Conexao-das-Telas-do-Pablo-com-a-API-do-Hub]] · [[Roteiro-da-Proposta-em-Diante]] · [[MES-Backend]] · [[MES-Front]] · [[Pipeline-Omie]] · [[RBAC-e-Permissoes]] · [[Bugs-Conhecidos]] · [[Proposta-Score-e-Volatilidade-OQ-46]] |
| `03-Sistemas/Comissao` | A comissão atual e a nova: [[01-Motor-Atual-Como-Calcula]] · [[02-Tabelas-Atuais-core_comissionamento]] · [[03-Modelo-Novo-core_comissao]] · [[04-Regras-e-Estados-da-Comissao-Nova]] |
| `04-Dados` | Os bancos de dados: [[Banco-AvHub]] · [[Banco-MES]] · [[Modelo-Estoque-e-Custo-do-Lote]] · [[Schemas-Postgres]] · [[Diferencas-Codigo-x-Banco]] |
| `05-Integracoes` | Como os sistemas conversam: [[Integracao-AvHub-MES]] · [[Chaves-e-Autenticacao]] · [[Omie-Integracao-Estado]] · [[Estudo-Omie-API]] · [[Mapa-IncluirPedido-Omie]] · [[Colunas-Protegidas]] · [[Rastreabilidade-e-Torre-de-Fluxo]] · dicionários do Omie em `05-Integracoes/Omie-Dicionarios` |
| `06-Contratos` | [[Contratos-da-v2]] (índice; o texto fica no GitHub, tag `v2-antes-da-v3`) · lista completa em [[Contratos-da-v2-Lista-Completa]] · modelo de consulta: [[Modelo-de-Consulta]] |
| `07-Desenvolvimento` | O que falta fazer: [[Backlog-por-Frente]] · [[Pontas-Soltas]] · [[Perguntas-Proposta-Pedido-Comissao]] · [[Contradicoes-Resolvidas]] · [[Riscos]] · [[Ultima-Atualizacao-do-Vault]] · [[Analise-de-Organizacao-do-Vault]] (histórico, nomes da v2) |
| `08-Decisoes` | [[Registro-de-Decisoes]] (índice; as decisões ficam em notas por faixa de ID) |
| `09-Diagramas` | [[Indice-de-Diagramas]] (inclui os artifacts do 0b e da proposta ao pedido) · [[Classes]] · [[Estados]] · [[Casos-de-Uso]] · [[Sequencia]] · [[Componentes-e-Implantacao]] · [[Modelo-de-Dados]] |
| `10-Anexo-Fora-do-Fluxo` | Assuntos fora do fluxo principal: [[Comissoes]] · [[RH-Vagas-Funcionarios]] · [[Dashboards]] · [[Pedido-Manual]] · [[Acompanhamento-Clientes]] · [[Comercial-Suprimentos]] · [[Mapa-Rotas-BFF-Bearer]] · [[Transferencia-entre-Filiais]] |

Notas grandes têm o detalhe em `Partes/`, dentro da própria pasta; a nota principal lista as partes. Os scripts de manutenção ficam em `scripts/` (veja o Manual).

## Anexo

O índice do anexo é a linha `10-Anexo-Fora-do-Fluxo` da tabela acima. O antigo anexo [[Orcamento]] foi arquivado em 26/10/2026, porque o Orçamento agora faz parte do fluxo.
