---
id: conexao-telas-pablo-api-hub
tags: [comercial, suprimentos, api-acos-vital, analise, rascunho]
criado: 2026-10-27
atualizado: 2026-10-29
status: proposta
dono: Nathan
fontes: ["Dump do Avhub para referência (completo).sql (avhub_prd_db, gerado em 26/10/2026 08:30)", "av-hub branch refactor/menu-enxuto-vendas-orcamento-compras (3bccfce): app/(protected)/vendas, orcamento, dashboards/dash-comercial, comissoes/simulador; app/api/comercial/**; services/comercial/*", "api-acos-vital origin/develop a7fda49: src/schemas/**", "api-acos-vital 0384e89 core_comercial e av-hub 758d5f0 app/api/comercial (29/10)", "LOG-52 §0, N16-109, N16-111"]
---

# Conexão das telas do Pablo com a API do Hub (página a página)

**Em uma frase:** a análise mostra, tela por tela do módulo do Pablo, o que o Hub já entrega, o que entrega em parte e o que ainda precisa de contrato.

**Quando consultar esta nota:** para decidir o que ligar agora e o que esperar. É rascunho para o Nathan revisar (pedido de 27/10/2026).

Legenda: ✅ o Hub já tem · 🟡 o Hub tem em parte · ❌ não existe · 🚫 sai pelo vault. Os contratos desta lista foram removidos em 29/10/2026; o Robert cria os novos.

## Como funciona hoje

Toda tela do módulo chama o BFF (camada intermediária do av-hub, `/api/comercial`), e ele só fala com a API do Hub. O que não existe lá responde erro 503 `RECURSO_NAO_MIGRADO`.

## Regra de ouro: um Hub só (N16-112)

Cada conceito tem uma tabela, uma rota e uma tela. O módulo do Pablo entra dentro do que já existe.

| Conceito | Fica | Sai ou se funde |
|---|---|---|
| Empresa que emite | `core.unidades` | Cadastro próprio do módulo |
| Cliente | `core.parceiros` e o Acompanhamento de Clientes | Clientes e contatos do módulo |
| Fornecedor e categoria | `core.parceiros` e o Orçamento antigo | Perfil e categorias repetidas do módulo |
| Cotação e oferta | Uma tabela só, a decidir | `core_comercial.ofertas` |
| Câmbio e motor de margem | PTAX do Hub e um motor só na API | Cópias no front e no módulo |
| E-mail e notificações | Serviço do Hub inteiro | Envio próprio do módulo |

## O que já está ligado (27/10)

| Tela | Ligada a | Observação |
|---|---|---|
| Fornecedores (lista e ficha) | Orçamento antigo do Hub | Perfil, categorias e certificados só leitura |
| Produtos (lista e detalhe) | Rotas de produtos do Hub | A família aparece como código: o Hub nega a permissão ao Admin (Dev) |
| Proposta: busca de produto e opções de margem | Produtos e parâmetros do simulador | Opções só com a tela `custo-item` |
| Cotação: fornecedores da categoria | Vínculos do Orçamento antigo | — |
| Clientes | Acompanhamento de Clientes | A tela Clientes do Pablo saiu do front |
| Parâmetros de custo, câmbio, "emitir em nome de" | Hub | Falta gravar "emitir em nome de" na proposta |
| Cadastro do cliente no Omie e lista de parceiros da proposta | `POST /comercial/clientes`, `GET /comercial/parceiros` (28 e 29/10) | Upsert por CNPJ no Omie da unidade e gravação em `core.parceiros` |

## O que falta, por tela

| Tela | Situação | O que falta |
|---|---|---|
| Propostas (lista) | 🟡 | Lista, criar e abrir já ligados ao Hub (`GET`/`POST /propostas`, `GET /propostas/:id`, 28 e 29/10). Filtros, KPIs (`/propostas/resumo`) e excluir ainda não: a rota de resumo existe na API do Hub, mas o BFF responde 503. Os status mudam |
| Proposta (nova e detalhe) | 🟡 | A API do Hub já tem revisar (`PUT`), aprovar, cancelar, copiar, transformar em pedido e a linha do tempo (29/10); o BFF ainda não liga essas rotas e o cálculo (`/propostas/calcular`) continua sem rota no Hub. Fechar, perder e reabrir saem 🚫 |
| Clientes | ✅ | CRM próprio (potencial, próximo contato) ❌ ou sai |
| Relatórios e Dashboard Comercial | ❌ | Dependem de propostas |
| Produtos e página do produto | ✅ 🟡 | Dados técnicos e produtos pendentes ❌ |
| Fornecedores | ✅ | Perfil de compras e certificados ❌ |
| Ofertas | 🟡 | Decidir se estende a tabela existente ou cria outra |
| Pedidos de custo | ❌ | Fila, respostas e painéis |
| Parâmetros | ✅ | Tabela da telha ❌ |
| Sino de notificações | ❌ | Esconder até existir |

## Achados do banco (dump de 26/10/2026)

- O schema do módulo do Pablo está em produção, vazio. Só 3 tabelas têm dado.
- A tabela de cotação por produto está vazia. As cotações estão no Orçamento antigo (2.697) e o preço de compra real no histórico do Omie (47.125 itens).
- O Hub não tem e-mail nem notificações. São infraestrutura, um contrato à parte.

## Revisão do Orçamento antigo (Nathan, 27/10/2026)

O que veio do Orçamento antigo passa por revisão completa, para atender só o que o vault precisa. As ligações acima usam essas rotas como estão hoje.

## Perguntas para o Nathan

- Clientes do Pablo e Acompanhamento de Clientes: unir numa tela só?
- Oferta: estender `parceiros_produtos` ou criar tabela própria?
- Receita, prospect e compradores: ficam?
- Importar e exportar planilhas: ficam?
- Telha: continua no escopo?

## Detalhe técnico

Tudo abaixo é o conteúdo completo da nota original, sem cortes.

> [!info] Para quê
> Rascunho para o Nathan revisar **página a página** antes de qualquer contrato (pedido de 27/10/2026). Depois da `api-comercial` removida (N16-111), toda tela do módulo chama o BFF `/api/comercial`, que só fala com a API do Hub; o que não existe lá responde 503 `RECURSO_NAO_MIGRADO`.
>
> Legenda: ✅ o Hub já tem e dá para ligar · 🟡 o Hub tem parte (dado sim, regra ou rota não) · ❌ não existe: vira contrato · 🚫 sai pelo vault (não migra).
>
> Lido no código em 27/10/2026. **Não rodei** nenhuma rota do Hub listada como ✅ além das já ligadas (empresas, parâmetros de custo, câmbio, `/me/permissoes`); os campos vêm da leitura das rotas em `origin/develop`.

O detalhe técnico desta nota fica em uma nota à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):

- [[Conexao-das-Telas-do-Pablo-com-a-API-do-Hub-Detalhe-Tecnico]]: Andamento da conexão (27/10/2026) · Princípio: um Hub só (Nathan, 27/10/2026, N16-112) · Conferência com o banco de produção (dump de 26/10/2026) · Achados que valem para várias páginas · Vendas · Orçamento · Outras · Resumo: o que dá para ligar já e o que vira contrato
