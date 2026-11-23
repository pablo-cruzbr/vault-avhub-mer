---
tags: [telas, menu, experiencia-do-usuario, proposta, vendas, orcamento, compras, comissao, redundancia, auditoria-de-telas, parte]
criado: 2026-11-05
estado-em: 2026-11-23
status: proposta
dono: Nathan
develop-conferida: [av-hub 7f0f7e2, app-pcp 8259344, em 2026-11-23 (padrão visual)]
parte-de: "[[Telas-e-Experiencia-do-Usuario]]"
fontes: ["av-hub develop (23/10/2026): lidos os 47 arquivos page.tsx de app/(protected)/vendas, orcamento e compras e os componentes que cada um abre (components/Propostas, Clientes, Relatorios, Suprimentos, PainelComprador, CustoItens, Configuracoes, Compras, Painel, Orcamento)", "lib/auth/devSemLogin.ts (MENU_DEV)", "av-hub docs/ENVIAR - contrato-comercial-suprimentos-telas.md", "Registro-de-Decisoes (N16-01 a N16-78)", "11-Proposta-e-Pedido-de-Venda, 12-Orcamento-Base-de-Preco, 13-Custo-Real-e-Comissao-no-Fluxo", "05-Integracoes/Mapa-IncluirPedido-Omie", "N16-192", "av-hub #319, #336", "app-pcp #78, #79, #80, #82"]
---

# Telas de Vendas, Orçamento e Compras no modelo novo: detalhe técnico (2/2)

**Em uma frase:** detalhe técnico da nota [[Telas-e-Experiencia-do-Usuario]] (parte 2 de 2): Menu revisto em 27/10/2026; Conexões entre telas: o que já está ligado; Repetições e confusões: texto completo; Telas que faltam: texto completo; A página de proposta: texto completo (seção 5); Itens da proposta e campos do formulário (`PropostaForm.tsx`, `ItemProposta.tsx`); Menu de desenvolvimento e ocultas; Um visual só: as peças no código.

**Onde estamos:** ← [[Telas-e-Experiencia-do-Usuario]] (resumo e índice) · partes: [[Telas-e-Experiencia-do-Usuario-Detalhe-Tecnico-1]] · **Telas-e-Experiencia-do-Usuario-Detalhe-Tecnico-2**

## Menu revisto em 27/10/2026

> [!info] Menu de Vendas e Orçamento revisto em 27/10/2026
> As decisões N16-107 e N16-108 enxugaram o menu. Vendas fica com 4 entradas. Orçamento também fica com 4: Pedidos de custo (abas Fila e Cotação), Produtos (abas Preços, Comparar e Ofertas), Fornecedores e Parâmetros (abas Custo e Telha). O **Histórico de compras sai**, porque a tela Ordens de compra já mostra o histórico. As linhas de Vendas, Orçamento e Compras abaixo já refletem isso.

## Conexões entre telas: o que já está ligado

**Já está ligado no código** ✅:
- Proposta e Painel do Comprador: o vendedor pede o custo e recebe a resposta.
- Proposta e Simulador de comissão: "simular a comissão deste pedido".
- Catálogo, Ofertas, Fornecedores e Pesquisa conversam entre si.
- Requisição, Emitir OC, Follow-up e Ordens seguem em sequência.
- Pedidos de venda do Omie alimentam o Painel PCP.

## Repetições e confusões: texto completo

| # | Onde | O problema | Proposta 🟡 |
|---|---|---|---|
| 1 | Margem em três lugares | A "Análise de margem" da proposta, o **Simulador de Orçamento** e o **Simulador de comissão** usam o mesmo motor e podem dar resultados diferentes. | Um só cálculo, na API. A proposta é a casa. O Simulador de Orçamento vira "simular sem proposta", com **a mesma tela de custo**. O Simulador de comissão fica (módulo atual). |
| 2 | Preço do produto em quatro telas | Catálogo, Pesquisa de materiais, Ofertas e Histórico de compras mostram recortes diferentes. | Uma **página do produto** com abas: Fornecedores e score, Ofertas, Histórico de compras e Série de preço. Pesquisa e Ofertas ficam como **operação** do Orçamento. |
| 3 | Duas condições de pagamento na proposta | Há um texto livre e uma "Condição (tabela de encargos)". | **Um só campo**, com a lista da conta Omie ([[Mapa-IncluirPedido-Omie]] §5.1). |
| 4 | Estado de destino × UF do cliente | Podem divergir, e o ICMS depende deles. | O destino vem do cliente ou do local de entrega. Editar exige motivo. |
| 5 | ICMS, IPI e ST digitados × cálculo do Omie | O total da proposta pode ficar diferente do total da nota. | ✅ **Decidido (N16-95): o vendedor digita e o valor segue para o pedido.** Compras confere e pode alterar na OC. O Fiscal também pode alterar. Conferir com o Omie é só opcional. |
| 6 | Tipo de item "Revenda" × "Fabricação interna" | O vendedor classifica o que a comissão trata de forma diferente (letra × 2% fixo, N16-78). | Mantém, com um **texto de ajuda** que mostra o efeito na comissão **estimada dele**. |
| 7 | **Dois "Aprovações"** em Compras | Um é a OC acima do limite (aprovador). O outro é a compra acima do valor da proposta (vendedor, `C8`). | Renomear para **"Aprovar OC"** (Compras) e **"Pendências"** (Meus Pedidos). "Aprovações" sozinho não aparece em lugar nenhum. |
| 8 | "Custo" com três sentidos | Há o custo cotado (proposta), o custo da oferta (Orçamento) e o custo real (pedido). | Três rótulos fixos: **Custo cotado**, **Custo da oferta** e **Custo real**. |
| 9 | Painel do Comprador com SLA | "Vencem hoje" e "Atrasadas" contrariam N16-58. | Tira os dois e mostra o **tempo parado**. |
| 10 | Relatórios com "Fechadas/Perdidas" | São estados do modelo antigo. | Usar **Aprovadas/Canceladas**. "Motivos de perda" vira "Motivos de cancelamento". |
| 11 | Guias do fluxo do custo | Descrevem o fluxo antigo. | Reescrever depois que o fluxo novo estiver no ar. |
| 12 | Sincronização Omie no menu de Orçamento | Ferramenta de TI parece tarefa do usuário. | Sair do menu comum e ficar só para TI ❓ |
| 13 | Unidades: **Mogi (Aços Vital), Uberaba (Aços Uberaba) e Arujá (HRM)** | ✅ **Resolvido (N16-79): são três contas Omie e um só sistema.** O Hub mostra a **logo e a identidade da unidade do usuário** e emite pedidos, OCs e propostas com essa identidade. | O catálogo de condições, as categorias e as contas correntes são **por unidade**. A proposta e o relatório escolhem a unidade pela emissora (AV, AU, HRM). |

## Telas que faltam: texto completo

| Tela | Onde fica | Quem usa | Nó |
|---|---|---|---|
| Aprovar proposta (revisão e total à vista) | Dentro da proposta | Vendedor | `V0.5` |
| Transformar em pedido (Qualidade, cliente no Omie, produtos cadastrados) | Dentro da proposta | Vendedor | `V0.6` |
| Estado do pedido no Omie (fila, enviado, erro com motivo e "Tentar novamente") | Proposta e Meus Pedidos | Vendedor | `V0.7` |
| Página do produto | Orçamento e dentro da proposta | Vendedor, Orçamento, Compras | `B2` |
| Emitir OC com dados da proposta e imposto por item | Compras | Comprador | `C6`, `C7` |
| Pendências (aprovar ou reprovar compra acima do valor) | Meus Pedidos | Vendedor | `C8` |
| Reprovados sem solução | Compras | Comprador | `C8` |
| Tarja de pedido cancelado | Requisição, OC, PCP | Todos | `V0C` |
| **Fila do Fiscal**: devoluções parciais a informar e pedidos cancelados no Omie. Reaproveita a lista "Pedidos de Venda" | Cadastros ou Fiscal | Fiscal, Controladoria | `K6` |
| Comissão estimada na proposta, Minhas Comissões, Decisão, Drill-down, Devoluções pendentes, Visão Geral, Parâmetros | Comissões (novas) | Vendedor, Controladoria, Gerência, Coordenação, Fiscal | `K1` a `K6` |
| Configuração por conta Omie (categoria, conta corrente, cenário, etapa, condições de pagamento) | Administração | TI | `V0.7` |
| **Calendário**: feriados e dias úteis de exceção por unidade (N16-104) | Cadastros | Marketing | datas |
| **Histórico de datas do pedido**: inicial, entregas de Compras, novas datas do CCP, atraso e a data vigente (N16-104) | Meus Pedidos (vendedor) e Carteira do PCP | Vendedor, PCP | datas |
| **Pedido do Omie na tela do pedido** (N16-106) | Meus Pedidos | Vendedor | `V1`, `K1` |

Sobre o **pedido do Omie na tela do pedido** (N16-106):
- A parte de vendas vem do Omie e fica só para leitura ("altere no Omie").
- O vendedor preenche a parte de compras, que é a simulação da comissão.
- O vendedor também responde Qualidade e faturamento em partes.
- A tela e as pendências são as mesmas do pedido que nasceu da proposta.

## A página de proposta: texto completo (seção 5)

### 5.1 O que está pesado ou errado hoje

- **Ordem confusa.** O vendedor só descobre o que falta depois de rolar a tela toda.
- **Item com cerca de 25 campos.** Venda e compra aparecem misturadas na mesma linha.
- **Botões do modelo antigo.** Há "Fechar itens", "Reabrir", "Perder" e o modal de digitar no Omie.
- **Não mostra o que falta.** "Incompleta" só aparece como erro, depois.
- **Duas condições de pagamento, destino repetido e imposto digitado** (seção 3).
- **Sem o estado do pedido.** Só aparece "Pedido no Omie: nº" depois de digitado à mão.

### 5.2 Como deve ficar 🟡

**Princípio:** uma ação principal por estado, sempre visível. A tela diz o que falta para a próxima etapa.

**Cinco blocos, nesta ordem, mais um resumo fixo:**

1. **Quem e para quem.** Número, revisão, estado, **unidade emissora** (a do usuário; logo e identidade vêm dela, N16-79/N16-80) e responsável. O cliente mostra o selo "cadastrado no Omie de Mogi/Uberaba" ou o aviso "não vira pedido". Também entram comprador, número da requisição do cliente e finalidade.
2. **O que se vende.** Cada item mostra **só o que o cliente vê**: produto (do cadastro do Omie; pendente em destaque), quantidade, UM, preço, desconto e prazo. Os **impostos são digitados pelo vendedor** (ICMS %, IPI %, ST %) e seguem para o pedido (N16-95). O Hub calcula o total. A especificação técnica fica recolhida em "Detalhes técnicos".
3. **Condições.** Frete e valor, **condição de pagamento escolhida da lista da conta**, validade, moeda e câmbio (PTAX do dia da aprovação, visível).
4. **Custo de compra**, só para quem vê custo. Cada item mostra de onde veio o custo (digitado, pedido de custo respondido ou histórico de OC), o fornecedor e o link para a página do produto. O pedido de custo mora aqui.
5. **Resultado**, para vendedor e gerência: margem, letra e **a comissão estimada que ele colocou**. Nunca a comissão real.

**Resumo fixo na lateral:**
- Totais: subtotal, desconto, impostos do Omie, frete e total.
- **Pendências clicáveis**, como "Item 3 sem custo e sem fornecedor", "Cliente sem cadastro no Omie de Mogi", "Produto PEND-0042 sem cadastro" e "Condição de pagamento não existe na conta". Cada uma leva ao campo.
- **Um botão principal por estado:**
  1. `Salvar` (proposta aberta).
  2. `Marcar como aprovada`. Só habilita sem pendência e mostra revisão e total.
  3. `Transformar em pedido`. Pede **três coisas obrigatórias**: a **data de previsão de faturamento**, se **a Qualidade acompanha todo o processo desde o zero** (sim ou não) e se o pedido **pode faturar em partes ou somente inteiro** (N16-88 e N16-89).
  4. Depois disso, só o estado do pedido, com a **previsão de faturamento vigente** e o histórico das datas (inicial, entrega de Compras, entrega do CCP, atraso do fornecedor).
- No menu: Duplicar, Cancelar (com motivo), Revisões, Linha do tempo, PDF e E-mail.
- **Identidade visual da unidade (logo e cores):** por enquanto só no **PDF** (N16-99). Os **textos padrão** ficam para mais para frente.

**Como a proposta aparece em cada estado:**
- **Aprovada:** só leitura, com a faixa "Aprovada em dd/mm por Fulano (revisão R). Para mudar, cancele e duplique."
- **Transformada:** faixa com o número do hub, o número do Omie e o estado (na fila, enviado ou erro com **motivo**). Mostra também a Qualidade marcada e o aviso de compra acima do valor, se existir.
- **Cancelada:** só leitura, com motivo, quem e quando. Só permite **Duplicar**.

### 5.3 Regras de clareza (valem para todas as telas novas)

1. **Um número, um nome, uma origem visível.** Use "Custo cotado", "Custo da oferta", "Custo real", "Preço de venda" e "Preço sugerido".
2. **O que é calculado fica só para leitura e diz quem calculou** ("Omie", "motor", "média das OCs").
3. **O que o perfil não pode ver some.** Não vira "—". Comissão real e custo real nunca aparecem vazios para o vendedor.
4. **O imposto é digitado pelo vendedor** e segue para o pedido (N16-95). O Omie não o substitui.
5. **O erro diz o que fazer.** Exemplo: "O Omie recusou: falta a conta corrente da unidade. Fale com a TI."
6. **Sem dado, sem inventar.** Sem OC no histórico, a página do produto diz "sem compras registradas" e não mostra média zero.
7. **Uma pergunta por decisão.** Aprovar ou reprovar, informar a devolução, decidir a comissão.
8. **Nenhum nome repetido para coisas diferentes** (ver "Aprovações", seção 3, item 7).

### 5.4 O pedido em partes (sequenciais) 🟡

O vendedor pode marcar "pode faturar em partes" (N16-89). Nesse caso a tela do **pedido**, dentro de Meus Pedidos, ganha o bloco **Sequenciais**.

- Cada linha é um sequencial, com número, valor, estado (aberto, faturado ou cancelado) e nota fiscal. Abaixo fica o **saldo do original**.
- Quem age, normalmente, é o **Fiscal**.
- **Quebrar:** escolhe **itens e quantidades**, e o valor sai deles.
- **Cancelar:** o valor volta ao saldo e o número não se reusa.
- **Excluir:** só vale para sequencial aberto.
- Pedido "somente inteiro" não mostra o bloco.
- O nome na tela é **"Faturamento em partes"**. Assim não se confunde com a **divisão da triagem do PCP** (fabricação, revenda…), que é outra coisa (N16-93).
- Tela e API dependem de descobrir como o Omie cria o sequencial.

## Itens da proposta e campos do formulário (`PropostaForm.tsx`, `ItemProposta.tsx`)

- Ordem atual da tela: Emissão → Cliente → Itens → Condições → *Análise de margem* (só para quem vê custo) → lateral com Totais e botões.
- Campos da linha do item (~25): descrição, qtd, UM, preço, desconto, ICMS %, IPI %, ST %, prazo, norma, material, certificados, ensaios, tipo, qtd comprada, UM compra, preço compra, origem da compra, IPI compra, ST compra, frete compra, fornecedor, custo, kg/m, metragem, margem.
- Condições: texto livre + "Condição (tabela de encargos)".
- O Painel do Comprador é lido como `PainelComprador`; os cards "Vencem hoje" e "Atrasadas" contrariam N16-58.

## Menu de desenvolvimento e ocultas

- O menu de teste sem login vem de `lib/auth/devSemLogin.ts` (`MENU_DEV`).
- Telas ocultas: `propostas-delegacao`, `propostas-valores`, `custo-item`, `solicitacoes-custo`.
- Fontes da auditoria: `av-hub docs/ENVIAR - contrato-comercial-suprimentos-telas.md`, Registro-de-Decisoes (N16-01 a N16-78) e as notas 11, 12 e 13.

## Um visual só: as peças no código

O modelo são as telas de Compras do Hub (N16-192). Conferido em `av-hub` `7f0f7e2` e `app-pcp` `8259344`.

| Peça | Para que serve | Onde está |
|---|---|---|
| Cabeçalho da tela (Hub, #319) | Caminho no menu, título, subtítulo e ações, com o fundo das Ordens de compra; usado em Acessos, Vínculos, Auxiliares e Orçamento | ✅ `av-hub` `components/Ui/CabecalhoDaTela/CabecalhoDaTela.tsx:22` (`export default function CabecalhoDaTela`) |
| Estilos da lista | Barra de busca, KPIs e fundo da página (`PedidosLista.module.css`); tabela (`ComprasLista.module.css`) | ✅ `av-hub` `components/Orcamento/BarraDaLista.tsx:5` (`import shell from '@/components/Pedidos/PedidosLista.module.css'`) |
| Barra da lista do Orçamento (#336) | Busca, abas e KPIs no padrão das listas de pedidos | ✅ `av-hub` `components/Orcamento/BarraDaLista.tsx:24` (`export default function BarraDaLista`) |
| Botão voltar do Orçamento (#336) | Volta da página do pedido, do produto ou do fornecedor para a lista | ✅ `av-hub` `components/Orcamento/BotaoVoltar.tsx:10` (`export default function BotaoVoltar`) |
| Linhas de carregamento do Orçamento (#336) | Esqueleto da tabela enquanto carrega | ✅ `av-hub` `components/Orcamento/LinhasEsqueleto.tsx:6` (`export default function LinhasEsqueleto`) |
| Cabeçalho do MES (#78) | Caminho automático pelo menu da sessão (`trilha`) e ações | ✅ `app-pcp` `components/Layout/PageLayout/PageHeader/PageHeader.tsx:58` (`const PageHeader = ({ title, subtitle, trilha, acoes }`) |
| Cartão translúcido do MES (#78) | Cartão sobre a luz de fundo no tema escuro | ✅ `app-pcp` `styles/variables.css:304` (`--card-surface: color-mix(`) |
| Seletor de período e busca que escolhe item (MES, #82) | Mesmo jeito do Dashboard de compras do Hub, no lugar do Autocomplete do MUI | ✅ `app-pcp` `components/Ui/Alternar/Alternar.tsx:16` (`export default function Alternar`) e `components/Ui/BuscaSelecao/BuscaSelecao.tsx:30` (`export default function BuscaSelecao`) |
