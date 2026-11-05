# Fatos de Onde-Estamos

Foto tirada em 2026-11-05 de `00-Inicio/Onde-Estamos.md`, antes de mexer na nota.
Gerada por `node scripts/fatos.mjs extrair`. Conferência: `node scripts/fatos.mjs conferir Onde-Estamos`.

## decisões e IDs (19)

- `BL-007`
- `BL-021`
- `BL-035`
- `BL-049`
- `BL-050`
- `BL-055`
- `BL-081`
- `N16-106`
- `N16-116`
- `N16-124`
- `N16-128`
- `N16-135`
- `N16-136`
- `N16-140`
- `N16-144`
- `N16-145`
- `N16-146`
- `N16-148`
- `PS-037`

## contratos (7)

- `API-005`
- `API-006`
- `API-008`
- `LOG-34`
- `LOG-35`
- `LOG-46`
- `LOG-47`

## commits (0)


## arquivo:linha (3)

- `lib/api/custoItensFixtures.ts`
- `src/common/constants/item-parcial-status.constants.ts:33`
- `src/dashboard/dashboard.service.ts:86`

## rotas (1)

- `GET /itens/custo`

## datas (18)

- `03/03/2027`
- `03/11`
- `03/11/2026`
- `04/11/2026`
- `05/11/2026`
- `07/10`
- `08/10`
- `08/10/2026`
- `14/10`
- `15/10`
- `19/10`
- `23/10`
- `26/10`
- `27/10`
- `29/10`
- `29/10/2026`
- `30/10`
- `30/10/2026`

## código entre crases (36)

- `/api/fluxo/*`
- `/fluxo/eventos`
- `ABERTA`
- `APROVADA`
- `BLOQUEADO`
- `C6`
- `C8`
- `CANCELADA`
- `EM_PRODUCAO`
- `EXPIRADA`
- `GET /itens/custo`
- `PRODUCAO`
- `RoteiroItem`
- `StatusPedido.EM_PRODUCAO`
- `TRANSFORMADA`
- `api-acos-vital`
- `api-comercial`
- `api-pcp`
- `app-pcp`
- `aprovar-saida`
- `av-hub`
- `core_comercial`
- `core_comissao`
- `core_vendas_faturamento`
- `custoItensFixtures`
- `develop`
- `develop-conferida`
- `divergencias_compra`
- `git rev-list --count origin/main..origin/develop`
- `lib/api/custoItensFixtures.ts`
- `lote_custo`
- `main`
- `receber()`
- `receber-fabricado`
- `src/common/constants/item-parcial-status.constants.ts:33`
- `src/dashboard/dashboard.service.ts:86`

## regras e linhas de conteúdo (47)

- | Setor | Como está | Quem toca | O que falta |
- | [[01-Proposta-de-Venda]] | 🟡 API e telas da proposta existem na `develop`; falta o pedido no Omie | Robert (rotas e telas), Gustavo, Pablo acompanha | Confirmar no banco o "Transformar em pedido"; enviar o pedido ao Omie direto pela API (a fila caiu em 03/11) e fazer o teste do pedido mínimo (BL-081); motor da comissão na API; decidir o schema (`core_comercial` ou `core_vendas_faturamento`, N16-116) |
- | [[02-Orcamento-Base-de-Preco]] | 🟡 Telas no front (`develop`) · 🔴 sem API e sem banco (o que existe está só no `api-comercial` de teste, F3) | Pablo, Robert, Gustavo | Portar oferta, histórico e pedido de custo para a `api-acos-vital`; base de preço gerada das compras; página do produto com score e volatilidade; pedido de custo ao Orçamento |
- | [[03-Pedido-de-Venda-e-Liberacao]] | ✅ Liberação funciona · 🔴 pedido no Hub | Nathan, Gustavo | Pedido do Omie no mesmo fluxo do pedido da proposta; compras e faturamento em partes na tela do pedido |
- | [[04-PCP-Triagem-e-Destinacao]] | ✅ Triagem e Destinação · 🔴 volta de reprovado | Robert | Caminho para o item reprovado (retrabalho ou nova compra); mostrar a OC do pedido ao PCP. A Ordem de Produção já é emitida e impressa e a Triagem mostra as requisições do hub (`develop`, 23 e 27/10) |
- | [[05-Estoque-Atendimento]] · [[09-Estoque-Entrada-do-Lote]] · [[12-Estoque-Despacho]] | ✅ Atendimento · 🔴 despacho | Robert | Documento de retirada com baixa na retirada (no Ciclo 1; modelos de retirada e de devolução aprovados em 30/10, N16-145 e N16-146); saldo futuro. O custo do item e o fabricado virando lote já estão na `develop` (27/10) |
- | [[06-Circuito-de-Compra]] | ✅ Compra, aprovação e envio ao Omie · ✅ o MES lê a OC (`develop`) | Robert, Gustavo | Mostrar a OC do pedido ao PCP e o saldo futuro; regra de aprovação definitiva com Compras |
- | Conferência de Compras (`C6` a `C8`) | 🔴 Desenhada e aprovada, sem código | Nathan, Gustavo | Conferir a parte do vendedor ao emitir a OC; avisar o vendedor se a compra sair mais cara |
- | [[07-Recebimento]] | ✅ Recebimento por OC e por NF na `develop` | Robert | Conferir contra a OC (preço, quantidade, fornecedor, N16-135); rateio da chegada; testar em homologação |
- | [[08-Qualidade-Entrada]] | ✅ Inspeção, aprovação e cisão do lote · 🔴 fechar a RNC | Robert, Gustavo | Fechar a RNC (relatório de não conformidade) no MES; avisar Compras da recompra por RNC (sem contrato); travar a decisão ao setor da Qualidade (N16-124) |
- | [[10-Producao-e-Roteiro]] | ✅ Filas, roteiro individual e OP impressa · 🟡 matéria-prima | Robert | A matéria-prima já baixa no "Atender pelo estoque"; a decisão é baixar na retirada (N16-140); gravar os status `EM_PRODUCAO` e `BLOQUEADO` do pedido (nunca são gravados); tela do novo norte e de divergência de produção |
- | [[11-Qualidade-Saida]] | ✅ Aprovar leva ao Estoque · 🔴 reprovar só uma parte | Robert | O aprovado já volta ao Estoque como lote `PRODUCAO` (`develop`, 27/10); reprovar só uma parte (N16-128); confirmar se ainda sobra porta direta na Expedição |
- | [[13-Expedicao]] | 🟡 Parcial | Robert | Consolidar carga; transporte; resolver o pedido integral travado por item que não chega; confirmar as portas de entrada |
- | [[14-Fiscal-Omie]] | ✅ Lado Omie · 🔴 aviso do MES | Robert, Gustavo, Nathan | Ligar a Expedição à nota do Omie; faturamento em partes; testar como o Omie cria o sequencial |
- | [[15-Custo-Real-e-Comissao]] | 🔴 Sem API e sem tela · 🟡 `core_comissao` modelado e testado no banco | Gustavo, Nathan, Robert | Schema novo da comissão; motor de cálculo; custo real por evento; decisão da Controladoria; custo obrigatório em todo lote |
- | Requisição MES ↔ av-hub | ✅ Funciona nos dois sentidos, por pedido imediato e por consulta a cada 5 minutos |
- | Status por item | ✅ Pronto |
- | Torre de Fluxo (painel de acompanhamento) | 🟡 API, rotinas e telas prontas no av-hub (telas sobre dados de exemplo, desde 15/10); o MES não envia os eventos; só o perfil Admin (os desenvolvedores) vê as telas, por enquanto (N16-148, BL-021) |
- | Custo por item | 🟡 O lote nasce com o custo da OC e o MES publica `GET /itens/custo` (27/10, na `develop`); falta o hub ler (a tela usa dados de exemplo). O Ciclo 1 segue sem imposto; o modelo com impostos foi desenhado em 29/10 (N16-144) |
- | Cadastros TESTE no Omie | 🟡 O Omie não tem ambiente de teste. Os cadastros TESTE do Nathan entram nos relatórios: filtre ao conferir |
- | Pendências de cadastro | O perfil CCP e o vínculo de usuários à Gerência de Compras saem em breve. É cadastro simples e não trava o desenho |
- | Sistema | Commits da `develop` fora da `main` | Última `main` |
- | `api-acos-vital` | 0: tudo o que está na `develop` já foi publicado (a `main` tem 35 commits de merge a mais) | 03/11/2026 |
- | `av-hub` | 12 | 04/11/2026 |
- | `api-pcp` | 53 | 08/10/2026 |
- | `app-pcp` | 51 | 08/10/2026 |
- | Raia | Nós | Estado | O que falta | Dono |
- | [[01-Proposta-de-Venda]] | V0.1–V0.7, V0C | 🟡 API e telas da proposta na `develop` | A rota de proposta (criar, revisar, aprovar, cancelar, copiar, transformar) existe na `api-acos-vital` e as telas, no av-hub, com o Robert; falta confirmar o banco do "Transformar em pedido", o pedido por API no Omie, direto da API (a fila caiu em 03/11), e decidir o schema (N16-116 diz `core_vendas_faturamento`, o código usa `core_comercial`); estados `ABERTA`, `APROVADA`, `TRANSFORMADA`, `CANCELADA` e `EXPIRADA` (validade sem decisão N16) | Robert, Gustavo, Pablo acompanha |
- | [[02-Orcamento-Base-de-Preco]] | B1–B4 | 🟡 menu e abas no front | Base de preço gerada das OCs; página do produto com score e volatilidade; pedido de custo sem prazo, com o tempo cronometrado | Pablo, Robert, Gustavo |
- | [[03-Pedido-de-Venda-e-Liberacao]] | V1–V3 | ✅ liberação · 🔴 pedido no Hub | Pedido do Omie no mesmo fluxo do pedido da proposta (N16-106); parte de compras e faturamento em partes na tela do pedido | Nathan, Gustavo |
- | [[04-PCP-Triagem-e-Destinacao]] | P1, P2, P6 | ✅ P1/P2 · 🔴 P6 | Novo norte (retrabalho ou reabre compra): o motor passou a ler o `RoteiroItem`, mas a volta de reprovado segue sem tela; renomear rotas antigas; **OC do pedido** visível ao PCP. ✅ **Ordem de Produção** emitida na criação e imprimível (27/10, `develop`); ✅ requisições do hub na Triagem (23/10) | Robert |
- | [[05-Estoque-Atendimento]] (E1–E4) · [[09-Estoque-Entrada-do-Lote]] (E5) · [[12-Estoque-Despacho]] (E6) | E1–E6 | ✅ E1–E5 · 🔴 E6 | **Documento de retirada com baixa na retirada** (hoje baixa em `receber()`); ✅ custo do item (`GET /itens/custo`) e fabricado virando lote `PRODUCAO` (27/10, `develop`); **saldo futuro** (saldo atual + OCs em andamento de estoque) | Robert |
- | [[06-Circuito-de-Compra]] | P3, C0–C5, FN1 | ✅ ida e volta e aprovação (C3) · ✅ o MES lê a OC do hub (C0, `develop`) | Aprovação já funciona (OC acima de R$ 30 mil: Gerente de Compras; até R$ 30 mil: compradores livres) e endurece depois com Compras 🟡; o MES já lê as OCs (K4, 15/10) e a referência das requisições (23/10); falta mostrar a OC do pedido ao PCP e o saldo futuro ao Estoque; envio real da OC ao Omie testado em 14/10, produção ❓ | Robert, Gustavo |
- | [[06-Circuito-de-Compra]] | C6–C8 | 🔴 (desenho aprovado em 26/10) | Conferência da parte de compras na emissão da OC; aviso de compra acima do custo do vendedor em Meus Pedidos e lista de reprovados de Compras (`divergencias_compra`) | Nathan, Gustavo |
- | [[07-Recebimento]] | R0–R6 | ✅ | ✅ custo da OC no lote, recebimento por OC e por NF (várias OCs na mesma nota, N16-136) na `develop`; falta a conferência contra a OC (N16-135), o rateio da chegada e testar em homologação | Robert |
- | [[08-Qualidade-Entrada]] | Q1–Q4 | ✅ inspeção · 🔴 fechar RNC | Fechar a RNC (nota de devolução e baixa do lote reprovado, hoje manual); recompra por RNC sem contrato; travar a decisão à Qualidade (N16-124) | Robert, Gustavo |
- | [[10-Producao-e-Roteiro]] | F1 | ✅ filas · 🟡 matéria-prima | Matéria-prima baixa no "Atender pelo estoque" (19/10), a decisão é na retirada (N16-140) 🔴; `StatusPedido.EM_PRODUCAO` e `BLOQUEADO` nunca são gravados (`api-pcp` `src/common/constants/item-parcial-status.constants.ts:33`; `BLOQUEADO` só é lido em `src/dashboard/dashboard.service.ts:86`); divergência de produção sem tela | Robert |
- | [[11-Qualidade-Saida]] | Q7, Q8 | ✅ aprovar · 🔴 reprovar parte | 🔴 reprovar só uma parte (N16-128); ✅ `aprovar-saida` e `receber-fabricado`: o aprovado volta ao Estoque como lote `PRODUCAO` (`develop`, 27/10); confirmar se ainda sobra porta direta na Expedição | Robert |
- | [[13-Expedicao]] | X1–X4 | 🟡 | Consolidar carga (X3), transporte (X4); integral travado por item que não chega (T-06); confirmar as portas de entrada depois do fabricado voltar ao Estoque | Robert |
- | [[14-Fiscal-Omie]] | O1, O2 | ✅ lado Omie · 🔴 sinalização | Contrato que ligue a Expedição à NF do Omie (ligação do O1); faturamento em partes (sequenciais ligados ao item do pedido) e teste de como o Omie cria o sequencial (PS-037) | Robert, Gustavo, Nathan |
- | [[15-Custo-Real-e-Comissao]] | K1–K6 | 🔴 sem API e tela (desenho aprovado em 26/10) · 🟡 schema testado no banco | Schema `core_comissao` na API; motor na API; custo real por evento; fila e decisão da Controladoria; custo obrigatório em todo lote no MES | Gustavo, Nathan, Robert |
- | Integração requisição MES ↔ av-hub (LOG-34, LOG-35) | ✅ ida e volta; sob demanda e polling de 5 min ([[Integracao-AvHub-MES]]) |
- | Status por item (API-005, API-006) | ✅ |
- | Torre de Fluxo (LOG-46) | 🟡 API e jobs no av-hub; BFF `/api/fluxo/*` e 4 telas no HUB sobre dados de exemplo (15/10); o MES não publica `/fluxo/eventos`; a 046b só deu as telas ao perfil de testes do time de TI, e só o Admin as vê por enquanto (N16-148, BL-021) |
- | Custo por item (API-008, LOG-47) | 🟡 `lote_custo` nasce com o custo da OC (19/10) e `GET /itens/custo` está publicada na `develop` do MES (27/10); falta o hub ler (a tela usa `custoItensFixtures`, `av-hub` `lib/api/custoItensFixtures.ts`); publicado na `main`: ainda não (BL-035). O Ciclo 1 segue sem imposto; o modelo com impostos foi desenhado em 29/10 (N16-144); falta código; a fórmula do custo com imposto segue o motor do comissionamento, e cada setor confere as mudanças na implementação |
- | Cadastros TESTE no Omie | 🟡 O Omie não tem ambiente de teste; os cadastros TESTE do Nathan entram na pipeline e nos relatórios: filtrar ao conferir (BL-055) |
- | Pendências cadastrais | Perfil CCP e vínculo de usuários à Gerência de Compras: serão criados em breve, assunto cadastral simples (Nathan e Gustavo), sem bloqueio de desenho |
