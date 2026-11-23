---
tags: [contrato, proposta, pedido-de-venda, omie, liberacao, refaturamento, parte]
criado: 2026-11-09
estado-em: 2026-11-13
status: para-implementar
dono: Nathan
parte-de: "[[LOG-56-Transformar-Proposta-em-Pedido]]"
develop-conferida: [api-acos-vital 9abda4f, av-hub c6310ad, api-pcp bd6b442, app-pcp 897dcd7, omie-elt-pipeline 46b53d4 (master 8f79d12), em 2026-11-13; api-acos-vital 655896a, av-hub 6fcbba6, em 2026-11-09; api-acos-vital cc3fbb3, em 2026-11-11, só a N16-154; api-acos-vital bebca52, av-hub 16891f9, em 2026-11-12, só as citações]
fontes: ["PDF de Robert de 09/11/2026 (contrato v8)", "Dump do Avhub de 04/11/2026 (04-Dados/Dumps/avhub-tst-esqueleto-2026-11-04.sql)"]
---

# LOG-56 · Transformar proposta em pedido: §6 Frontend e §7 Backend (1/2)

**Em uma frase:** o que falta na tela e no BFF, e as decisões de 09/11 do backend: liberação como ato do vendedor, conta corrente padrão por conta Omie, troca pelo financeiro, valor inicial na Liberar Pedidos e o alcance real do refaturamento.

Volta para [[LOG-56-Transformar-Proposta-em-Pedido]]. Continua em [[LOG-56-Transformar-Proposta-em-Pedido-Detalhe-2]].

## 6. Frontend

### 6.1 O que falta no modal e no BFF

No modal, dois campos, e só: "A Qualidade acompanha o pedido por todos os processos?" (`Sim` / `Não`, sem valor inicial) e "O pedido pode faturar em partes?" (`Pode faturar em partes` / `Só quando tudo estiver pronto`, sem valor inicial). Os dois bloqueiam o botão. Nenhum dos dois pode ser escrito antes de o `esquemaEnvioOmie` aceitá-los: o `z.object` descarta chave desconhecida sem erro, e a tela passaria a mentir para o vendedor.

No BFF da liberação, o mesmo cuidado (novo na v8). O `PUT /api/liberar-pedidos/:codigoEmpresa/:numeroPedido` não repassa o corpo que recebe: monta um corpo novo com dois campos (`av-hub` `app/api/liberar-pedidos/[codigoEmpresa]/[numeroPedido]/route.ts:51` (`body: JSON.stringify({ acompanhamento_qualidade: acompanha`)) e valida só o `acompanhamento_qualidade` (`app/api/liberar-pedidos/[codigoEmpresa]/[numeroPedido]/route.ts:27-29` (`typeof acompanha !== 'boolean'`)). É um acerto de projeto (nada do navegador passa direto para a API), mas o `faturar_em_partes` precisa ser deixado passar explicitamente. Sem esse passo, o Gustavo entrega o campo na API, o teste falha e o sintoma é "a API aceita e a tela não manda".

### 6.2 O aviso de refaturamento casa pela descrição

Não existe código que sirva para as três contas (leitura do `ListarCategorias` nas três, 06/11; detalhe em [[LOG-56-Transformar-Proposta-em-Pedido-Adendo-v4]]):

| Código | Mogi | Uberaba | HRM |
|---|---|---|---|
| `1.01.96` | Refaturamento | fora da lista ativa | fora da lista ativa |
| `1.01.98` | fora da lista ativa | Venda de Sucata | Refaturamento |
| `1.01.99` | Cobranças Jurídicas | Refaturamento | Revenda de Mercadoria |

Testar `codigo === '1.01.96'` afirmava que esse código é refaturamento em qualquer conta, o que é falso; não dava falso-positivo só porque nas outras duas ele está inativo e oculto, invariante que não pertence àquela função. As três se chamam "Venda Cliente - Refaturamento".

### 6.3 A unidade das listas por conta Omie

✅ `core.categorias` e `core.contas_correntes` são por unidade (Contrato 22), com FK para `core.unidades(id)`. A chave certa é a da conta Omie do pedido. Até 10/11, `unidades_emissoras` separava `id_unidade` (quem emite) de `id_unidade_conta_omie` (de qual conta), e o modal usava o primeiro, o que errava na HRM. **Resolvido pela N16-154 (10/11):** a emissora passou a ser a própria unidade, cada unidade com a própria conta Omie, e `GET /comercial/empresas_emissoras` devolve `id_unidade_conta_omie` igual ao `id_unidade` (`api-acos-vital` `cadastros.route.js:115`, `id_unidade_conta_omie: e.id,`). O modal pode continuar usando o `id_unidade`.

### 6.4 A ordem das entradas do BFF é armadilha estrutural

O `encaminhar` percorre a lista e para na primeira que casa. Reusar um padrão que já existe é regressão silenciosa: foi assim que o `/categorias` da proposta roubou o de Suprimentos e deu 403 para quem não tem a tela `propostas`. Corrigido com padrão próprio, e a condição de pagamento nasceu já seguindo a regra.

**Regra proposta para o vault:** no BFF da tela comercial, padrão novo, sempre. Veja a §17.

### 6.5 "Tentar novamente"

O pedido já vem no `GET /comercial/propostas/:id` (Gustavo, 06/11), com `status_sincronizacao_omie`; não é preciso `GET /pedidos/:id`.

### 6.6 Prontidão

`getProntidaoPedido` (`propostas.ts:377`) já trata 404. Falta a entrada do BFF e a rota da §8.1.

### 6.7 "Faturar em partes": fica no Hub até o contrato do MES

Decisão do Nathan, 09/11: opção 2. O vendedor responde, a resposta é gravada no pedido do Hub e percorre as duas primeiras pernas; as três do MES viram contrato próprio, no molde da N16-151.

O caminho que a Qualidade já percorre (Contrato 26 / Fluxo 4) é o modelo. A perna 2 está corrigida na v8: escrever e ler são rotas diferentes.

| # | Perna | Onde | Frente |
|---|---|---|---|
| 1 | Coluna na liberação | `pedidos_vendas_liberacao` | este contrato |
| 2a | Escrita: campo no corpo do PUT da tela | `PUT /pedidos_liberacao/:codigo_empresa/:numero_pedido` (`pedidos_liberacao.route.js:173`), mais o BFF (§6.1) | este contrato |
| 2b | Leitura pelo MES: campo no corpo das rotas do Fluxo 4, como o `acompanhamento_qualidade` já aparece lá | `GET /pedidos_liberados` e `/:numero/itens`: `COLUNAS` em `pedidos_liberados.route.js:36` (`v.status_liberacao, v.acompanhamento_qualidade, v.faturar_em_partes`) | este contrato; ✅ na `develop` de 12/11 (`faturar_em_partes` já sai nas duas rotas) |
| 3 | Leitura pelo MES | `api-pcp` `omie-integracao.ts:141` | frente do MES |
| 4 | Coluna em `pedidos` | migration `20260929150000_pedido_acompanhamento_qualidade` | frente do MES |
| 5 | Uso na geração da OP | `api-pcp` `src/pedidos/pedidos.service.ts:288` (`acompanhamentoQualidade: consulta.pedido.acompanhamentoQualidade`) | frente do MES |

⚠️ Enquanto as pernas 3 a 5 não existirem, a resposta fica no Hub: o PCP não a lê. A tela mostra, a liberação guarda, e mais nada. Isso precisa ser dito a quem for usar (está também na §16 e no bloco do fim).

⚠️ A coluna nova nasce nulável, pelas linhas que já existem; o nulo significa "pedido anterior à regra", o mesmo sentido que a migration do MES já dá à dela.

## 7. Backend

- **R1, R2** no `esquemaEnvioOmie` (`propostas.route.js:614`): `qualidade_acompanha` e `faturar_em_partes`, booleanos obrigatórios no `/transformar` e opcionais no `/enviar-omie`, com o mesmo "ausente = mantém" que o `dados_adicionais_nf` já tem.
- **R10:** `faturar_em_partes` gravado no pedido do Hub e levado à liberação quando o vendedor liberar (§7.6), mais o campo nas rotas do Fluxo 4 (§6.7).
- **R11:** `codigo_conta_corrente` (§7.4).

### 7.1 Reenvio de pedido anterior à migration

O `/enviar-omie` não passa a exigir os campos novos: ele existe para reenviar o que já foi decidido. Pedido antigo com nulo reenvia normalmente e não gera linha de liberação; a resposta continua vindo da tela Liberar Pedidos, como hoje. Nenhum pedido criado depois da migration pode ter nulo, porque o `/transformar` exige.

### 7.2 A liberação continua com uma origem de escrita só

Com a §7.3, o `/transformar` não escreve em `pedidos_vendas_liberacao`. A única origem continua sendo o `PUT /pedidos_liberacao/:codigo_empresa/:numero_pedido` (`pedidos_liberacao.route.js:173`, com o `ON CONFLICT ... DO UPDATE` em `:204-206`), o caminho da correção da N16-29. Não há upsert novo, e por isso não há o que sobrescrever.

**Correção da v7:** a v7 escrevia `PUT /pedidos_liberados/:empresa/:numero` citando `pedidos_liberacao.route.js:204-206`, o nome de uma rota com a âncora de outra. O erro era de redação: todas as âncoras da v7 apontam para o arquivo certo. Em `/pedidos_liberados` não existe PUT (`pedidos_liberados.route.js:62, 115, 143`).

**Correção da v4, mantida:** o histórico da N16-29 já está implementado (`fn_pedidos_vendas_liberacao_historico`: `liberado` / `alterado` só quando a marcação muda, com `valor_anterior` / `importado_mes`).

### 7.3 R7, decidido: a liberação continua sendo um ato do vendedor

Decisão do Nathan, 09/11: a terceira saída. O `/transformar` grava a resposta da Qualidade só no pedido do Hub (`core_comercial.pedidos_venda`) e não cria linha em `pedidos_vendas_liberacao`. O `ON CONFLICT DO NOTHING` da v5 sai: não há upsert.

A tela Liberar Pedidos passa a mostrar essa resposta como valor inicial, e a liberação segue sendo um ato explícito, como no Contrato 26. O `faturar_em_partes` segue o mesmo caminho: grava no pedido e entra na liberação quando o vendedor liberar.

**Por que esta saída.** A `vw_pedidos_liberacao` é a fonte do Fluxo 4 do MES (`GET /pedidos_liberados`, que filtra `v.status_liberacao IN ('liberado', 'importado')` em `pedidos_liberados.route.js:64`) e dá `liberado` sempre que existe linha. Criar a linha no `/transformar` faria o pedido nascer importável pelo MES sem ninguém liberar. Com esta decisão, a resposta do vendedor vira uma sugestão informada para quem libera, não a liberação em si.

### 7.4 Conta corrente, decidido: padrão por conta Omie, invisível para o vendedor

Decisão do Nathan, 09/11. Na proposta o vendedor não escolhe e o campo nem aparece. O pedido nasce com a conta corrente padrão da conta Omie, configurada uma vez, e o valor fica gravado em `core_comercial.pedidos_venda.codigo_conta_corrente`, como já acontece em Compras.

**Correção da v5, mantida:** `conta_corrente` tem zero ocorrências no caminho do pedido de venda (`pedidoOmie.js` e `propostas.route.js`); no repositório são 17, todas de Compras, e é por isso que já existe molde.

**O molde de Compras:**

| Peça | Onde, hoje |
|---|---|
| A coluna, no próprio pedido | `pedidos_compras.model.js:31` (`codigo_conta_corrente: { type: DataTypes.BIGINT, allowNull: true }`) |
| A descrição, por subselect na unidade | `pedidos_compras.route.js:148-153` (`descricao_conta_corrente`), casando `cc.codigo_empresa` e `cc.codigo_conta_omie` em `core.contas_correntes` |
| O mesmo na OC | `ordens_compra.route.js:116` (`"codigo_conta_corrente"`) e `:195-198` (o mesmo subselect) |
| O padrão "configurado uma vez, por unidade" | `core_vendas_faturamento.parametros_compras` (`codigo_empresa uuid` + o parâmetro), `parametros_compras.model.js` |

⚠️ `codigo_conta_omie` é `bigint`: trafega como string até a tela, pela mesma razão da correção do `codigosDaResposta`.

**Onde mora a configuração padrão.** Não existe ainda, e é o que o [[Mapa-IncluirPedido-Omie]] (parte 2, linha 161) já listava como faltando: "Configuração por conta Omie: `codigo_categoria`, `codigo_conta_corrente`, `codigo_cenario_impostos`, etapa inicial e local de estoque. Hoje não existe lugar."

Proposta: uma tabela irmã da `parametros_compras`, chaveada pela unidade da conta Omie (desde a N16-154 é a própria unidade do pedido, `core.unidades.id`), nascendo com o campo desta decisão e com espaço para os outros quatro.

Diferença em relação à `parametros_compras`: lá, unidade sem linha cai num default de 30.000 e a operação segue. Aqui não pode haver default (não existe conta bancária razoável para adivinhar). Sem configuração, o pedido não é enviado: a prontidão devolve `UNIDADE_SEM_CONFIG` (§8.1), código que já existe no front para este caso.

### 7.5 A troca pelo financeiro

Depois que a proposta vira pedido, o financeiro pode abrir o pedido e trocar a conta.

| # | Ponto | Proposta |
|---|---|---|
| 1 | Onde troca | Na tela do pedido de venda, não na proposta. A lista vem de `core.contas_correntes` da conta Omie do pedido, pela rota `/contas-correntes` que o BFF já tem (`av-hub` `app/api/comercial/[...rota]/route.ts:49` (`'/contas-correntes'`)). |
| 2 | Quem pode | Uma tela do financeiro com `pode_editar`, não `propostas`, para o vendedor não conseguir trocar. Precisa da linha em `auth.rotas_telas` para a rota de alteração e da entrada do BFF com essa tela (a de `/contas-correntes` hoje é `tela: 'propostas'` e vai precisar aceitar as duas). |
| 3 | Como chega ao Omie | Grava no Hub e chama `AlterarPedidoVenda` na hora. ⚠️ O Omie localiza o pedido por `codigo_pedido_integracao` (o `PV-000001` que o Hub já guarda) e aceita `informacoes_adicionais.codigo_conta_corrente`. Regra do Omie: `numero_pedido` não deve ser enviado na alteração. |
| 4 | Até quando | Enquanto o pedido não estiver faturado. Depois disso a alteração é outra operação (`AlterarPedFaturado`) e fica fora. Se o Omie recusar, o Hub não grava: a tela mostra o `faultstring` e a conta continua a anterior. |
| 5 | Histórico | Quem trocou, quando, de qual conta para qual. Molde: `pedidos_vendas_liberacao_historico`, com `valor_anterior`, gravado por trigger. |

⚠️ Ponto em aberto que a decisão cria: se o pedido já foi enviado e a conta muda, o Hub e o Omie precisam continuar iguais. Por isso o ponto 4 só grava depois que o Omie aceitar.

### 7.6 O valor inicial na Liberar Pedidos, na rota certa

A §7.3 diz que a tela mostra a resposta do vendedor como valor inicial. Isso não é automático: a Liberar Pedidos lê a `vw_pedidos_liberacao`, que vem de `core_vendas_faturamento.pedidos_vendas` (a pipeline), e a resposta está em `core_comercial.pedidos_venda` (o Hub).

A chave é o `codigo_pedido_omie`, que os dois lados têm:
- `core_comercial.pedidos_venda.codigo_pedido_omie` `bigint`, preenchido quando o envio dá certo; a constraint `ck_pedidos_venda_sincronizado` garante (status sincronizado exige `codigo_pedido_omie IS NOT NULL`, dump de 04/11, linha 15702);
- `core_vendas_faturamento.pedidos_vendas.codigo_pedido_omie` `bigint NOT NULL`, e a `vw_pedidos_liberacao` já o expõe (`pedidos_liberacao.route.js:47`).

**Proposta:** a `vw_pedidos_liberacao` ganha dois campos, vindos de `core_comercial.pedidos_venda` por esse join: `qualidade_acompanha_sugerida` e `faturar_em_partes_sugerido`. Nomes diferentes dos da liberação, de propósito: são sugestão do vendedor, não a marcação efetiva. A tela usa o valor sugerido para pré-marcar o controle quando ainda não há liberação, e mostra de onde veio.

**Rota (a correção central da v8):** `GET /pedidos_liberacao`, a que a tela usa (`app/api/liberar-pedidos/route.ts:53`, `${process.env.API_URL}/pedidos_liberacao?${params}`). A v7 escrevia `GET /pedidos_liberados`, que filtra `v.status_liberacao IN ('liberado', 'importado')` (`pedidos_liberados.route.js:64`); o valor sugerido só serve enquanto o pedido está pendente.

**Duas camadas, não uma.** As duas rotas leem a mesma view, mas cada uma tem a sua lista de colunas: `COLUNAS` em `pedidos_liberacao.route.js:39-47` e em `pedidos_liberados.route.js:25-32`. Então: campos na view (uma vez só, e o Fluxo 4 aproveita depois) **e** acrescentados ao `COLUNAS` da rota da tela. O mesmo `COLUNAS` volta na resposta do PUT (`:211`), então a tela recebe o valor atualizado sem recarregar a caixa.

Quem faz: a view, o `COLUNAS` e o corpo são do Gustavo (§14, passos 7a a 7c); o BFF e a tela são do Robert (passos 7d e 14).

❓ **Pergunta ao Gustavo, item 1: o join.** O pedido do Hub tem dois campos de empresa: `codigo_empresa` (a emissora) e `codigo_empresa_omie` (a conta Omie). A `vw_vendas_planilha` traz `codigo_empresa` de `pedidos_vendas`, que a pipeline preenche a partir da conta Omie. O join é `pedidos_venda.codigo_empresa_omie = pedidos_vendas.codigo_empresa`, e não pelo `codigo_empresa` do Hub? Com três contas e a pendência da HRM, errar isso mistura unidades em silêncio.

❓ **Pergunta ao Gustavo, item 2: view ou SELECT.** A proposta é pôr os campos na view, para não escrever o join duas vezes. Mas a `vw_pedidos_liberacao` já é cara (`pedidos_liberacao.route.js:115`, `a view é cara (vw_vendas_planilha por baixo)`; a v8 citava `:49-50`, corrigido em 09/11). Se for melhor no SELECT da rota, tudo bem, mas a escolha precisa estar feita antes do passo 7a.

### 7.7 Refaturamento: o alcance real, e o que a N16-152 muda

❓ A preocupação do filtro `grupo IS NULL` não sumiu com a §7.3: mudou de forma e piorou.
- a `vw_pedidos_liberacao` filtra `p.grupo IS NULL`, então pedido com grupo nunca aparece na Liberar Pedidos;
- com a §7.3, a resposta da Qualidade só chega ao MES pela liberação;
- portanto, para um pedido que caia em G6, a resposta do vendedor nunca chega ao PCP.

**Correção de fato da v7: o G6 tem duas portas, e a segunda não olha a unidade.** A regra que "compara o literal `'1.01.96'`" é a cascata da `vw_faturamento_planilha`, a descrita no [[Mapa-IncluirPedido-Omie]] (parte 2, linhas 98-99), e não é a que importa aqui. A `vw_pedidos_liberacao` é construída sobre a `vw_vendas_planilha` (dump de 04/11, a partir da linha 25460), e lá o grupo sai de:

```sql
WHEN ((p.obs_venda ~* 'refat|reaft'::text) OR ((p.codigo_categoria)::text = '1.01.96'::text))
  THEN 'G6'::text  -- dump de 04/11, linha 25386
```

mais a porta da família (linha 25390): se alguma parcial (`sequencial > 0`, não excluída, `etapa <> 0`) tiver `1.01.96` ou `refat|reaft` na observação, o pedido-pai vai para G6 junto. Na `vw_faturamento_planilha` a redação é outra (linhas 18042-18043), e por isso as duas não são equivalentes.

| Porta | Quem cai | Depende de |
|---|---|---|
| Categoria = `'1.01.96'` | Só Mogi | Nada: é automático em Mogi (RS-022: Uberaba `1.01.99` e HRM `1.01.98` não caem por esta porta) |
| Observação `~* 'refat\|reaft'` | Qualquer unidade, as três | Do que estiver escrito na observação da venda |

**Para o pedido nascido no Hub:** em Mogi, some sempre. Em Uberaba e na HRM, some quando a observação tiver "refat" ou "reaft"; a detecção de refaturamento da v5 é por descrição da categoria, no select (`ehRefaturamento`), e não escreve em `obs_venda`. Para pedido que vem do Omie pela pipeline, vale o que estiver lá, e em Uberaba praticamente todo `1.01.99` é refaturamento ([[Mapa-IncluirPedido-Omie]], parte 2, linha 126).

❓ **Pergunta ao Gustavo, item 3: de onde vem o `obs_venda` do payload.** É o que decide se o parágrafo acima é alívio ou o pior caso. O envio ao Omie manda `observacoes.obs_venda` (`api-acos-vital` `src/schemas/core_comercial/aggregates/propostas/propostas.swagger.json:3121` (`observacoes.obs_venda`)), e o payload sai de `fn_pedido_venda_payload_omie` (`pedidoOmie.js:37`), que não está no repositório nem no dump de 04/11: é da migration `2026-11-05` que falta (§9). Se vier das `observacoes` da proposta (`propostas.route.js:198`, até 10000 caracteres), basta o vendedor escrever "refat" na proposta para o pedido sumir da Liberar Pedidos, em qualquer unidade. Vai junto com as migrations, no mesmo pedido.

**O que a N16-152 decide.** Decisão do Nathan, 09/11: a saída (b). O refaturamento passa a ser decidido pela tabela `core_vendas_faturamento.refaturamentos`, e a observação deixa de ser porta. Não se acrescenta código à regra global: `1.01.98` é Venda de Sucata em Uberaba e `1.01.99` é Cobranças Jurídicas em Mogi, então "consertar" a regra por código quebra outra unidade. **Superada em parte pela N16-153 (10/11/2026):** o código de refaturamento passa a ser lido pela unidade do pedido, e a observação continua sendo porta ([[Registro-N16-150-a-N16-155]]).

| Quando | O que some da Liberar Pedidos |
|---|---|
| Hoje | Todo pedido com "refat/reaft" na observação, em qualquer unidade, e todo pedido de Mogi com `1.01.96` |
| Depois da N16-152 | Só o pedido registrado como refaturamento na tabela `refaturamentos`. O problema fica previsível e deixa de depender do que o vendedor escreve |

❓ **Pergunta à Qualidade, que o Nathan leva.** Refaturamento passa por processo de qualidade? Vale nos dois cenários, e a resposta escolhe a saída:
1. ⚠️ Não passa: custa zero, registra-se a razão no vault. Mesmo assim a pergunta continua no modal e obrigatória (decisão do Nathan, 09/11): a heurística da descrição só avisa, não decide obrigatoriedade.
2. Precisa, e a view muda para deixar passar o refaturamento com um marcador próprio: mexe numa view que a comissão também usa, então não é barato.
3. Precisa, e o MES lê do Hub para esses casos: vira parte do contrato do MES (§6.7), não deste.

**Medição feita (PS-040, ampliada; rodada pelo Nathan em 09/11/2026 no banco de teste: o G6 tira 142 de 2.028 pedidos, 36 pela categoria, 98 pela observação e 8 pela família; números em [[Pontas-Soltas]]).** A consulta do [[Mapa-IncluirPedido-Omie]] (parte 2, linhas 102-126) media o vazamento de comissão de Uberaba. Com esta correção, ela mede também quantos pedidos somem da Liberar Pedidos, adaptada: sobre a `vw_vendas_planilha`, pelas três unidades, com as portas em separado. O SQL está pronto (fora do vault, `../Perguntas-e-Respostas/medicao-V3_refaturamento-liberacao.sql`). O resultado vem antes da conversa com a Qualidade e não bloqueia nenhum passo da §14.

### 7.8 Quem preenche a configuração padrão, decidido: SQL, sem tela

A tabela da §7.4 precisa de uma linha por conta Omie: três linhas, que mudam quase nunca. Decisão do Nathan, 09/11: SQL do Gustavo, sem tela. São três linhas; quem sabe qual conta usar é o financeiro; e uma tela nova pede rota, permissão, auditoria e teste, caro demais para algo que muda quando a empresa troca de banco.

⚠️ Com a condição posta junto: sem a linha, o pedido não é enviado (`UNIDADE_SEM_CONFIG`, §7.4). A mensagem da prontidão diz **qual unidade** está sem configuração e que isso se resolve com o Gustavo, não com o vendedor.
