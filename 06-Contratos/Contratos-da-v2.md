---
tags: [contratos, indice, v2]
criado: 2026-11-05
estado-em: 2026-11-13
status: vigente
dono: Nathan
fontes: ["tag v2-antes-da-v3 do vault (06-Contratos)", "gerado por 07-Desenvolvimento/v3/scripts/contratos-indice.mjs", "PDF de Robert de 09/11/2026 (contrato LOG-56 v8)", "PDF de Gustavo de 10/11/2026 (entrega LOG-56, banco e API)"]
---

# Contratos da v2

> **Em uma frase:** os contratos da v2 não vieram para a v3; eles ficaram guardados na tag `v2-antes-da-v3` do GitHub, e esta nota é o índice para achar cada um.

**Quando consultar:** quando uma nota cita um ID de contrato antigo (`LOG-34`, `SQL-014`, `API-011`, `CON-02`) ou quando for registrar um contrato novo (veja a numeração no fim).

Esta nota foi gerada por script (`07-Desenvolvimento/v3/scripts/contratos-indice.mjs`, Bloco 1 da v3) a partir do frontmatter dos contratos da v2, e a lista completa foi para [[Contratos-da-v2-Lista-Completa]] no Bloco 5. Os contratos da v2 não mudam mais: não rode o script de novo (ele juntaria a lista outra vez nesta nota). Contrato novo entra à mão na seção "Contratos novos (v3)" (veja o [[Manual-de-Manutencao-do-Vault]]). A coluna de status traz o vocabulário da v2 (`implementado-no-codigo`, `aplicado-em-producao`); na v3, contrato novo usa `implementado-na-develop`.

Total: **92 contratos** (Ativos 12 · Consultas 3 · Entregues 69 · Arquivados 8), mais 3 documentos históricos e 18 anexos (`.sql`, `.patch`), todos acessíveis pela tag.

## Ainda têm trabalho pendente

Os contratos `Ativos` e as consultas (`CON`) em aberto **não** foram trazidos para a v3 (D5). O trabalho que continuar ganha um contrato novo, escrito na v3, que cita o ID antigo.

| ID | Título | Pasta | Status | Nós do 0b | Link (tag `v2-antes-da-v3`) |
|---|---|---|---|---|---|
| API-008 | Custo do lote no MES (`lote_custo`, G1, recebimento, consumo e `GET /itens/custo`) | Ativos | parcial | R4, E3, E5 | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/API-008-Custo-do-Lote-no-MES.md) |
| API-010 | Requisição do Compras: finalidade, pedido de venda e produto do cadastro | Ativos | parcial | C0 | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/API-010-Requisicao-do-Compras-Finalidade-Pedido-e-Produto.md) |
| API-011 | Compra em andamento, recebimento por item da OC e uso interno (MES) | Ativos | parcial | P1, P2, P3, E1, R0, R1, R4 | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/API-011-Compra-em-Andamento-Recebimento-por-Item-da-OC-e-Uso-Interno.md) |
| LOG-42 | Coordenadores e Orçamento: sair do JSON do repositório | Ativos | parcial |  | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/LOG-42-Coordenadores-e-Orcamento-sair-do-JSON-do-Repositorio.md) |
| LOG-43 | Ordem das etapas de faturamento vem do cadastro (fecha a marca P6) | Ativos | parcial |  | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/LOG-43-Ordem-das-Etapas-de-Faturamento-no-Cadastro.md) |
| LOG-46 | Torre de Fluxo: feed do MES, jobs de projeção e telas (I5 e I6) | Ativos | parcial | F1, X1, Q7 | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/LOG-46-Torre-de-Fluxo-Feed-Jobs-e-Telas.md) |
| LOG-47 | Custo real por item no av-hub: simulador (etapa 2), comissão por faturamento (etapa 3), Compras e Orçamento | Ativos | parcial | E3, R4 | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/LOG-47-Custo-Real-por-Item-no-Hub.md) |
| LOG-48 | Acompanhamento de Clientes e grupos de empresa | Ativos | parcial |  | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/LOG-48-Acompanhamento-de-Clientes-Grupos-de-Empresa.md) |
| LOG-51 | Segurança e padrão da API do av-hub (`api-acos-vital`) | Ativos | parcial |  | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/LOG-51-Seguranca-e-Padrao-da-API-do-Hub.md) |
| LOG-52 | Migrar o módulo Comercial & Suprimentos para a API do av-hub e aposentar a `api-comercial` | Ativos | parcial |  | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/LOG-52-Migracao-do-Modulo-Comercial-para-a-API-do-Hub.md) |
| LOG-54 | Documento de retirada e baixa do saldo na retirada (MES) | Ativos | proposta | E6, X1, F1 | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/LOG-54-Documento-de-Retirada-e-Baixa-na-Retirada.md) |
| SQL-021 | Item do pedido de venda: `produto_vendas.codigo_item_integracao` | Ativos | parcial |  | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Ativos/SQL-021-Produto-Vendas-Codigo-Item-Integracao.md) |
| CON-01 | Relatórios de valores por vendedor e de faturamento mensal (itens 28 e 29) | Consultas | aguardando-resposta | O1, O2 | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Consultas/CON-01-Relatorios-Valores-e-Faturamento-Itens-28-e-29.md) |
| CON-02 | Rastreabilidade por material e ciclo do Book (Caldeiraria HRM) | Consultas | aguardando-resposta | F1, Q7, Q8 | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Consultas/CON-02-Rastreabilidade-e-Book-Itens-18-e-20.md) |
| CON-03 | Devolução de compra e classificação do pedido | Consultas | aguardando-resposta | K1, K2, K6 | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Consultas/CON-03-Devolucao-de-Compra-e-Classificacao-do-Pedido.md) |

## Todos os contratos da v2

Estas seções ficam em notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3). O texto foi movido sem mudança:

- [[Contratos-da-v2-Lista-Completa]]: Todos os contratos da v2

## Documentos históricos da pasta de contratos

| Documento | Título | Link |
|---|---|---|
| HIST-Analise-Contratos-vs-Hub-2026-10-01 | Análise: contratos em aberto × código do av-hub (01/10/2026) | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Arquivados/HIST-Analise-Contratos-vs-Hub-2026-10-01.md) |
| HIST-Indice-Contratos | Contratos — ERP Aços Vital | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Arquivados/HIST-Indice-Contratos.md) |
| HIST-Indice-Logica-Fora-do-Backend | Índice — lógica que ainda está fora do banco (gambiarras marcadas no av-hub) | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Arquivados/HIST-Indice-Logica-Fora-do-Backend.md) |
| Painel-de-Contratos | Painel de contratos (resumo da v2) | [GitHub](https://github.com/Acosvital/vault-avhub-mer/blob/v2-antes-da-v3/06-Contratos/Painel-de-Contratos.md) |

## Contratos novos (v3)

A numeração continua depois do maior ID da v2. Próximos IDs livres: `API-020`, `CON-04`, `LOG-59`, `SQL-023`.

| ID | Título | Status | Autor | Data |
|---|---|---|---|---|
| [[LOG-56-Transformar-Proposta-em-Pedido\|LOG-56]] | Transformar proposta em pedido: as respostas que faltam e as pontas soltas da tela (v8) | `parcial` | Robert | 2026-11-10 |
| [[API-019-Compra-da-Proposta-na-OC\|API-019]] | A emissão da OC mostra a parte de compras da proposta (`C6` e `C7`) | `implementado-na-develop` | Nathan | 2026-11-11 |
| [[LOG-57-Compra-Acima-do-Cotado\|LOG-57]] | Compra acima do cotado na proposta, aprovação do vendedor e lista de Compras (`C8`) | `parcial` | Nathan | 2026-11-11 |
| [[LOG-58-Avisos-do-MES-ao-Compras\|LOG-58]] | O MES avisa o Compras no av-hub da recompra por RNC e da reabertura do recebimento | `parcial` | Nathan | 2026-11-12 |
| [[SQL-022-Aviso-da-Recompra-na-Referencia-da-OC\|SQL-022]] | A referência da OC para o MES diz de qual aviso do MES a OC é a recompra (saldo futuro, BL-050) | `implementado-na-develop` | Nathan | 2026-11-13 |

O modelo de consulta está em [[Modelo-de-Consulta]].
