---
tags: [decisoes, registro, dec, en, ec, n14, n16, parte]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Nathan
parte-de: "[[Registro-de-Decisoes]]"
fontes: [v1 00-Indice/Registro-de-Decisoes-2026-10-07 (#1 a #99), v1 Decisoes-Chave-ERP e Perguntas-em-Aberto-Consolidadas (DEC-1 a DEC-12), v1 Encaixe-Estoque-Revenda-no-PCP (EN-01 a EN-07, EC-01 a EC-08), decisões do Nathan de 14/10/2026, decisões N16 de 16 a 26/10/2026 (pasta Proposta-Orcamento-Comissao, histórico), código de 14/10]
---

# Registro de decisões: Registro DEC EN EC e 1 a 38

**Em uma frase:** parte da nota [[Registro-de-Decisoes]] com "DEC-1 a DEC-12 (decisões com prazo, de 21 e 22/09/2026)", "EN-01 a EN-07 e EC-01 a EC-08 (encaixe do Estoque, da Revenda e do circuito de compra no PCP)", "Ambientes e produção (#1 a #6)", "Pipeline Omie e segurança (#7 a #20)", "Estoque e MES (#21 a #31c)", "Equipe e cronograma (#32 a #38)". O texto foi movido sem mudança.

**Onde estamos:** ← [[Registro-de-Decisoes]] (resumo e índice) · partes: [[Registro-N14-01-a-N14-33]] · **Registro-DEC-EN-EC-e-1-a-38** · [[Registro-39-a-80]] · [[Registro-81-a-100-e-Estado-no-Codigo]]

## DEC-1 a DEC-12 (decisões com prazo, de 21 e 22/09/2026)

| ID | Decisão | Data | Dono | Selo | Superada |
|---|---|---|---|---|---|
| DEC-1 | **Vínculo Fábrica e Filial:** por pedido, não fixo. Uma fábrica pode atender a matriz e as filiais. A filial de cada ordem vem sempre do `codigo_empresa` do pedido, nunca de um campo da Fábrica. Gera requisito de RBAC (`PerfilSetor` com dimensão de filial, tarefas C2 e C3) | 21/09/2026 | Nathan e Robert | 📝 | |
| DEC-2 | **Mecanismo da integração av-hub e MES:** polling REST autenticado por `x-api-key`, sem webhook e sem tempo real, mesmo padrão do pipeline do Omie. Cobria 3 fluxos (requisição, referência da OC, status por item) | 21/09/2026 | Nathan, Robert e Gustavo | 📝 | Ajustada: a ida da requisição é push com fila e hoje há 8 fluxos ([[Contradicoes-Resolvidas]] CR-17, [[Integracao-AvHub-MES]]) |
| DEC-3 | **Aprovação condicional de compra:** acima de R$ 30.000 o diretor precisa aprovar a OC; abaixo, sem aprovação extra | 21/09/2026 | Nathan e Diretoria | superada | Superada por N14-21: acima de R$ 30 mil aprova o Gerente de Compras, não a Diretoria; até R$ 30 mil, compradores livres |
| DEC-4 | **Carga inicial:** o lote nasce liberado, com dupla conferência (contador e conferente; divergência = terceira contagem, #25) | 22/09/2026 | Nathan e Qualidade | 📝 ✅ (`origem: 'CARGA_INICIAL'`, `statusQualidade: 'LIBERADO'`) | |
| DEC-5 | **Balança:** digitação manual, sem integração automática. Destrava D6 e D7 (Recebimento) | 21/09/2026 | Nathan e Operação | 📝 | |
| DEC-6 | **Tolerância de peso:** padrão único de 5% para todo material, sem ajuste por categoria no v1 (#26) | 22/09/2026 | Nathan e Qualidade | 📝 ✅ (`Material.toleranciaPeso @default(0.05)`) | |
| DEC-7 | **Contratos SQL (Gustavo), 4 itens:** saldo de estoque = foto atual (upsert); id estável de item de compra = `(id_pedido_compra, ordem)`; `core.locais_estoque` sem FK para depósito por ora; exclusão no polling com `?incluir_deletados=true` em `/produtos` e `/parceiros` | 21/09/2026 | Gustavo | 📝 | |
| DEC-8 | **Hardware do posto de recebimento:** será comprado (impressora industrial e leitor 2D, cerca de R$ 5 a 7 mil), ao contrário do padrão de começar só com Code128 em impressora comum | 22/09/2026 | Nathan e Diretoria | 📝 | |
| DEC-9 | **Retenção de auditoria:** 5 anos, sem expurgo automático (validação com contabilidade e fiscal pendente). `auth.logs` com retenção curta (prazo 🔴 Gustavo) e `auth.auditoria` com 5 anos (#53) | 21/09/2026 | Nathan | 📝 | |
| DEC-10 | **Devolução de cliente:** o ciclo completo nasce no Estoque, inclusive capturar o valor da devolução parcial, que o Omie não expõe. Exceção deliberada ao padrão "av-hub decide, MES executa". Destrava a Fase D (Ciclo 2) | 21/09/2026 | Nathan | 📝 | |
| DEC-11 | **Módulo financeiro nativo:** adiado, fora do roadmap, sem data | 21/09/2026 | Nathan | 📝 | Revista em 07/10 (#30): o Omie segue como sistema financeiro e fiscal, sem plano de desligar |
| DEC-12 | **Alocação de lote no consumo de matéria-prima:** FIFO por `data_posicao` como padrão automático, com opção de escolher o lote manualmente. Trava a J3 (genealogia) | 21/09/2026 | Robert e Pablo | 📝 | |

## EN-01 a EN-07 e EC-01 a EC-08 (encaixe do Estoque, da Revenda e do circuito de compra no PCP)

Fonte: PDFs do Robert de 24/09 e 28/09 e respostas do Nathan de 25/09 e 29/09 ([[05-Estoque-Atendimento|03-Estoque-Atendimento-e-Despacho]], [[04-PCP-Triagem-e-Destinacao|02-PCP-Triagem-e-Destinacao]]).

| ID | Decisão | Data | Dono | Selo | Superada |
|---|---|---|---|---|---|
| EN-01 | **Saldo zero exige clique:** o parcial sem saldo não passa sozinho pelo Estoque; alguém confirma na tela, porque há compra de matéria-prima cuja descrição não bate com a do produto vendido (#31b). Antes do marco zero (13/11) todo parcial é tratado como saldo zero | 25/09/2026 (reconfirmada 08/10) | Nathan | 📝 ✅ | |
| EN-02 | **Nome na tela:** a fábrica de Revenda é chamada de "Destino" (nem "Fábrica", nem "Linha") | 25/09/2026 | Robert e Nathan | 📝 | |
| EN-03 | **Estoque duas vezes no roteiro da Revenda:** o primeiro Estoque é etapa fixa inserida pelo backend; o segundo (fim) é adicionado à mão na montagem do roteiro | 25/09/2026 | Nathan | 📝 | Ajustada em 29/09: setor Estoque único, sem "Estoque·Entrada" (EC-05) |
| EN-04 | **Produto fabricado termina no Estoque:** a regra Qualidade, depois Estoque, depois retirada vale também para o fabricado, não só para o comprado. Reconfirmada em 29/09 ("tudo que é fabricado deve ir para o estoque") e em 14/10 (N14-06) | 25/09/2026 | Nathan | 📝, 🔴 sem código (BL-008) | |
| EN-05 | **`Material.natureza`** (`MATERIA_PRIMA` ou `REVENDA`) fica só como classificação para filtro, relatório e saldo; não decide a rota nem trava a fábrica. A tela pode usá-lo para sugerir a fábrica padrão | 25/09/2026 (reconfirmada 29/09) | Pablo, Robert e Nathan | 📝 | |
| EN-06 | **Comprado "não acabado" sem setor de beneficiamento no roteiro:** usa o roteiro individual do item (`RoteiroItem`), ajustado item a item | 25/09/2026 | PCP e Robert | 📝 | |
| EN-07 | **`codigoEmpresa`:** o `idUnidade` do pedido é UUID e é o mesmo id do `Material.codigoEmpresa`, conferido no banco | 25/09/2026 | Gustavo | 📝 ✅ | |
| EC-01 | **Inspeção de Qualidade:** a de entrada é por lote (entidade `Lote`); a de saída é um setor tipo `QUALIDADE` no roteiro, na trilha da parcial | 29/09/2026 | Nathan | 📝 ✅ | |
| EC-02 | **Baixa de matéria-prima além do requisitado** (sobras e perdas de corte): tratar como `MovimentoEstoque` `AJUSTE` com motivo obrigatório (proposta); adiado para o Ciclo 2 (22/01/2027, #27) | 29/09/2026 | Robert e Produção | 🟡 | |
| EC-03 | **C8 respeita o `RoteiroItem`** na Expedição (mover e busca da etapa) | 29/09/2026 | Nathan | 📝, 🔴 parcial (BL-011) | |
| EC-04 | **`RequisicaoCompra` e `RequisicaoCompraItem`** entram dentro do setor `REQUISICAO`, não são peça separada | 29/09/2026 | Nathan | 📝 ✅ | |
| EC-05 | **Reserva e baixa:** a Reserva deixa de ser o mecanismo central e fica restrita a "separar sem despachar"; o setor Estoque é único; o circuito de compra (Requisição, Compras, Logística de Entrada, Qualidade, volta ao mesmo Estoque) sai do roteiro e vira desvio fixo disparado pelo Estoque; a baixa do saldo é no despacho do Estoque, não no recebimento da Embalagem | 29/09/2026 | Nathan | 📝 | Refinada por N14-05: o despacho gera documento de retirada, a baixa é na retirada |
| EC-06 | **Inspeção de saída obrigatória** em todo roteiro de fabricação | 29/09/2026 | Nathan | 📝 ✅ | |
| EC-07 | **Reprovação total ou parcial na entrada:** a parte aprovada fica em quarentena; a reprovada volta a Compras, que alinha devolução e substituição; a substituição refaz a inspeção e, se aprovada, une-se à quarentena | 29/09/2026 | Nathan | 📝 ✅ | |
| EC-08 | **Desenho completo validado** antes de codificar; vale também o circuito de compra fixo e o setor Estoque único | 29/09/2026 | Nathan | 📝 | |

## Ambientes e produção (#1 a #6)

| ID | Decisão | Data | Dono | Selo | Superada |
|---|---|---|---|---|---|
| #1 | **Homologação do MES.** `https://mes-test.acosvital.com.br/` roda a `develop` e está no ar. Marco M2 cumprido. | 07/10/2026 | Nathan | 📝 |  |
| #2 | **Contrato 34 (PUT da requisição).** O `PUT` de sucesso do MES já funcionou no ambiente de teste. | 07/10/2026 | Nathan | 📝 |  |
| #3 | **`fn_requisicao_mes_aplicar`.** Existe em produção, completa (dump de 07/10). O SQL ainda não está versionado no vault. | 07/10/2026 | Nathan | 📝 |  |
| #4 | **Infraestrutura.** Pipeline, MES e av-hub (e outros sistemas) na **VPS 1**. Bancos do MES, do av-hub e demais na **VPS 2**. Arquivos na **VPS 3**. | 07/10/2026 | Nathan | 📝 |  |
| #5 | **Etapas de faturamento.** `core.etapas_faturamento` está populada em produção. | 07/10/2026 | Nathan | 📝 |  |
| #6 | **Contrato 39.** API em produção. O front (`av-hub#155`) está só na `develop`. | 07/10/2026 | Nathan | 📝 |  |

## Pipeline Omie e segurança (#7 a #20)

| ID | Decisão | Data | Dono | Selo | Superada |
|---|---|---|---|---|---|
| #7 | **Envio de OC ao Omie.** Fica **fixo no código** e vai direto ao Omie, sem `SYNC_ENVIO_OC` nem `ENVIO_OC_DRY_RUN`. O Nathan rodou cerca de 4 testes reais e a OC entrou. L10.1, L10.6 (FOB) e L10.7 (b) a (d) viram **risco aceito**. Alteração de código: Gustavo. | 07/10/2026 | Nathan | 📝 |  |
| #8 | **`PERMISSOES_ROTA_MODO`.** Fixo em **`exigir`** no código, sem `.env`. **Implementado em 08/10** (`6317d5f`, `acessoConfig.js`: a variável deixou de ser lida). As chamadas de serviço do pipeline e do MES (só `x-api-key`, sem `Bearer`) passam sem mapeamento, porque o modo só confere permissão quando há token. | 07/10/2026 | Nathan | 📝 |  |
| #9 | **Chaves restantes do contrato 38.** Em resumo: só `ESCOPO_VENDEDORES_EXIGIR` é fixado agora; as outras chaves quebram o MES e a pipeline e ficam como estão. O Nathan confirmou que o front do av-hub manda token em todas as chamadas, mas **a auditoria de 08/10 mostra o contrário**: ao menos 38 arquivos do BFF (`compras/*`, `pedidos-venda/[fonte]/**`, `notas-fiscais/[fonte]/**`) mandam só `x-api-key` (ver auditoria de 08/10 (v1)). Os helpers precisam usar `headersComIdentidade()` antes de fixar a chave. Fixar **só `ESCOPO_VENDEDORES_EXIGIR`**. `IDENTIDADE_EXIGIR_TOKEN`, `ESCOPO_UNIDADE_EXIGIR_SESSAO` e `AUTENTICACAO_AZURE_VALIDAR_ID_TOKEN` quebram MES e pipeline enquanto eles usarem a chave do `.env` sem token, e `VENDAS_PLANILHA_PAGINAR_POR_PEDIDO` corta dados no front. Ficam como chave até separar as chaves de serviço. | 07/10/2026 | Gustavo | 🟡 (Gustavo) | Superada em parte: `ESCOPO_VENDEDORES_EXIGIR` foi fixado no código (contrato 40, 09/10, `acessoConfig.js:75`); as outras três chaves seguem como chave ([[Contradicoes-Resolvidas]] CR-15). |
| #10 | **Chave do MES (L6).** Chave restrita para MES e pipeline, ou continuar com a chave admin? Nathan deixou com o Gustavo. O MES precisa de escrita (`POST /pedidos_liberados/:n/importado`), o pipeline também (`PATCH /compras/ordens/:id/sincronizacao`). | 07/10/2026 | Gustavo | 🔴 (Gustavo) |  |
| #11 | **Nome da variável do MES.** O `api-pcp` usa `AVHUB_MES_INTEGRACAO_KEY` (singular). A `api-acos-vital` lê `MES_INTEGRACAO_KEYS` (plural, lista). O PDF e as notas que dizem `...KEYS` no lado do MES estão errados. | 07/10/2026 | Nathan | 🟡 |  |
| #12 | **Guards do `api-pcp`.** Adicionar `JwtAuthGuard` + `PermissionsGuard` com `@RequirePermission` em `UsuariosController` e `SetoresController`, como em `perfis.controller.ts`. `GET /setores` fica só com sessão e o login Azure não pode ser bloqueado. ✅ **Feito em 08/10** (PR #51 do `api-pcp`, `e8f951e`). | 07/10/2026 | Robert | 🟡 (Robert) |  |
| #13 | **Exposição da `api-pcp`.** Há domínio público no Coolify? O código escuta em todas as interfaces e não restringe origem. | 07/10/2026 | Gustavo | 🔴 (Gustavo) |  |
| #14 | **PR #50.** Nenhum consumidor das rotas apagadas foi achado em `api-pcp`, `app-pcp`, pipeline e `api-acos-vital`. O front do av-hub não estava no disco. | 07/10/2026 | Nathan | 🟡 |  |
| #15 | **`exclusionSync`.** **Risco crítico.** O job apaga `pedidos_vendas` por empresa e janela **sem filtrar `manual`**. Pedidos manuais têm `codigo_pedido_omie` negativo, não existem no Omie e entram na lista de excluídos (`exclusionSync.ts:98-106,136`). Confirmar antes de usar pedido manual em produção. | 07/10/2026 | Gustavo | 🔴 (Gustavo) |  |
| #16 | **500 em `exclusion_sync_curta`.** 497 erros em Mogi (490 HTTP 500). Causa não documentada. Ler `error_message` e `faultstring` em `omie_ctl.run_log`. | 07/10/2026 | Gustavo | 🔴 (Gustavo) |  |
| #17 | **Pedido de compra apagado por fora.** O `exclusionSync` não detecta. Aceito como limitação conhecida. | 07/10/2026 | Nathan | 🟡 (Nathan) |  |
| #18 | **`omie_raw` e `sql/002`.** Mortos. Marcar `sql/002` como obsoleto (Nathan). `DROP` das 5 tabelas vazias: Gustavo. | 07/10/2026 | Nathan | 🟡 | Marcação feita em 14/10 (N14-27); resta o `DROP` (BL-054). |
| #19 | **Manifesto (scraping).** Não precisa de plano para Uberaba: o login de Mogi traz as duas empresas. Confirmar por consulta que `manifestos` tem linhas de Uberaba. HRM não está coberta. | 07/10/2026 | Gustavo | 🟡 (Gustavo) |  |
| #20 | **`FAMILIA_PADRAO_POR_FILIAL`.** Corrigir a doc (`ARCHITECTURE.md` do pipeline, fora do vault) e registrar tarefa de código (Gustavo). | 07/10/2026 | Nathan | 📝 |  |

## Estoque e MES (#21 a #31c)

| ID | Decisão | Data | Dono | Selo | Superada |
|---|---|---|---|---|---|
| #21 | **Schema do Estoque.** Fica em **`public`**. Fecha CC-06. | 07/10/2026 | Nathan | 📝 |  |
| #22 | **`main` do MES.** Merge `develop` → `main` **antes do piloto**. Fecha CC-04. Data e responsável: 🔴 Robert. | 07/10/2026 | Nathan | 📝 |  |
| #23 | **Branch `feat/migracao-nestjs-prisma`.** Descartada. Fecha CC-09. | 07/10/2026 | Nathan | 📝 |  |
| #24 | **Transferência entre filiais.** Quem envia **aprova na origem** e só então gera a NF. O número da NF chega ao MES **via av-hub**. | 07/10/2026 | Nathan | 📝 |  |
| #25 | **Carga inicial do estoque.** Dupla conferência = **contador + conferente**. Divergência = **terceira contagem**. Lote nasce liberado (DEC-4). | 07/10/2026 | Nathan | 📝 |  |
| #26 | **Tolerância de peso.** **5% para todas** as categorias. Pode virar por categoria no futuro. | 07/10/2026 | Nathan | 📝 |  |
| #27 | **Ciclo 2.** Começa em (antes: 04/01/2027) **22/01/2027** (reajustado em 09/10/2026: o Robert só fecha o Ciclo 1 em 21/01/2027, ver item 96 e [[Cronograma]] seção 3.4). Entram EC-02 (sobras e perdas de matéria-prima), L-10 (sobras de chapa, perda no corte, unidade), remessa de produtos, Fase D e transferência etapas 2 a 4. | 07/10/2026 | Nathan | 📝 | Ciclo 2 começa em 22/01/2027 (era 04/01/2027): ver #96. |
| #28 | **Saldo do Omie.** O Omie recebe dados **só manualmente**; o estoque do Omie é ignorado. Passo 2 (`ListarPosEstoque`) **não será feito**. O MES é a referência do saldo físico (fecha L-03). | 07/10/2026 | Nathan | 📝 |  |
| #29 | **Locais e `lead_time` (B6).** B6 continua **só com os locais** (Passo 6). `lead_time` (Passo 3) sai do pipeline. | 07/10/2026 | Nathan | 📝 |  |
| #30 | **Financeiro.** O **Omie segue como sistema financeiro e fiscal** (DEC-11). Não há plano de desligar. Dados bancários e endereço de entrega de parceiro ficam fora; as tabelas existem e estão vazias. | 07/10/2026 | Nathan | 📝 |  |
| #31 | **Devolução e `valor_devolucao`.** O `StatusDevolucaoVenda` não está disponível no Omie. Devolução é nativa do Estoque (DEC-10), Ciclo 2. As colunas `valor_devolucao` em produção estão vazias (limpeza: Gustavo). | 07/10/2026 | Nathan | 🟡 |  |
| #31b | **Saldo zero: o item passa pelo Estoque sozinho ou exige clique?.** **Exige clique.** O parcial sem saldo não passa sozinho pelo Estoque: alguém confirma na tela. Fecha o EN-01 de [[05-Estoque-Atendimento\|03-Estoque-Atendimento-e-Despacho]]. As notas que sugeriam "automático" ([[05-Estoque-Atendimento\|03-Estoque-Atendimento-e-Despacho]] EA6 e [[00-Fluxo-Mestre-0b]]) foram corrigidas em 08/10. Antes do marco zero (13/11) todo parcial segue tratado como saldo zero. | 08/10/2026 | Nathan, 08/10 | 📝 (Nathan, 08/10) |  |
| #31c | **Vínculo Fábrica ↔ Filial.** Já decidido na DEC-1: a filial vem do pedido (`codigo_empresa`), nunca da Fábrica. `Perguntas-Pendentes-MES-Estoque` ainda a lista como aberta e precisa ser corrigida. | 07/10/2026 | Nathan | 📝 |  |

## Equipe e cronograma (#32 a #38)

| ID | Decisão | Data | Dono | Selo | Superada |
|---|---|---|---|---|---|
| #32 | **Pablo.** Atua no **Comercial & Suprimentos**. O MES fica com o **Robert**. | 07/10/2026 | Nathan | 📝 |  |
| #33 | **Tarefas do MES.** **Robert assume** G1 (carga em lote), baixa no despacho do Estoque, D11 (leitor 2D e posto de recebimento) e I1/J2/J5. A capacidade dele estoura e precisa ser recalculada (ver [[Cronograma]]). | 07/10/2026 | Nathan | 📝 |  |
| #33b | **Capacidade do Robert depois da reatribuição.** Em resumo: com as tarefas reatribuídas, o Robert fica com déficit de 10,1 pd e falta decidir como cobri-lo. Com G1, D11, I1, J2, J5 (e D12, atribuída por coerência) no Robert, o cálculo do [[Cronograma]] (seção 3.2) fecha em **−5,85 pd na S1–FC e −4,25 pd na S5, −10,1 pd no total**. A ordem de corte da seção 9 alivia no máximo ~4,0 pd. A baixa no despacho do Estoque não tem pd dimensionado, então o déficit real é maior. Falta decidir como cobrir: estender a janela, levar a J5 ao Ciclo 2 ou devolver parte do backend ao Gustavo. Os resíduos de D2 e D3 ficaram sem dono. A reserva real da S5 é **21,0 pd** (não 22,0), e **3,75 pd** depois da reatribuição. | 07/10/2026 | Nathan | 🔴 (Nathan) | Superada por #96: o déficit do Robert subiu de 10,1 para 16,1 pd. |
| #34 | **Plano.** Vale o plano de **3 meses** (18/09 a 21/12). M7 e S5 terminam em 18/12; 21/12 só fecha a conta de capacidade. | 07/10/2026 | Nathan | 🟡 | Datas superadas por #96 (Ciclo 1 até 21/01/2027). |
| #35 | **Déficit de 1,8 pd do Nathan na S5.** 11,0 pd (I5 4 + I6 7) contra 9,2 pd (23 dias úteis × 40%). Proposta: tirar a tela de ranking de gargalos da S5 e levar ao Ciclo 2 (a numeração T.5 ou T.6 precisa ser conferida em [[Telas-por-Raia\|Telas-por-Raia]]: o agente de edição viu "tempo por etapa e ranking" em T.5 e Auditoria em T.6). Como o Pablo está no Comercial, não há quem receba essas horas. | 07/10/2026 | Nathan | 🟡 (Nathan) |  |
| #36 | **Datas de marcos.** M2 cumprido. M3 (16/10) mantido. M4 (30/10) só antecipa se a homologação estiver estável até 16/10. M5, M6 e M7 mantidos. | 07/10/2026 | Nathan | 🟡 (Nathan) |  |
| #37 | **Equipe.** Robert Wilson, Pablo Cruz e Gustavo M. de Farias (pelo `git log`; cargo formal de RH não está no vault). | 07/10/2026 | Nathan | 🟡 |  |
| #38 | **Tarefas B6, G3, D1.** G3 deixa de reconciliar com o saldo do Omie. D1 deixa de dizer "a confirmar com o Robert". | 07/10/2026 | Nathan | 🟡 |  |
