---
tags: [contrato, adendo, refaturamento, omie, categoria, parte]
criado: 2026-11-09
estado-em: 2026-11-09
status: para-implementar
dono: Nathan
parte-de: "[[LOG-56-Transformar-Proposta-em-Pedido]]"
versao: 4
fontes: ["PDF de Robert de 09/11/2026 (adendo v4, alinhado ao contrato v8; substitui a v2, enviada com o arquivo nomeado Adendo-v3)", "Leitura do Robert nas três contas Omie em 06/11/2026 (geral/categorias:ListarCategorias, filtrar_por_tipo R, só leitura)", "Dump do Avhub de 04/11/2026 (linhas 18042-18043, 25386 e 25390)"]
---

# LOG-56 · Adendo v4: o refaturamento da HRM (1.01.98)

**Em uma frase:** a HRM tem uma categoria de refaturamento ativa (`1.01.98`, "Venda Cliente - Refaturamento") que o vault não registrava; com ela o RS-022 passa a valer para três unidades, e a regra do G6 que vale para a Liberar Pedidos tem uma segunda porta, a observação, que não olha a unidade. Por isso a N16-152 foi decidida pela saída (b).

Adendo do Robert (achado de conferência, não é contrato), versão 4, que acompanha o [[LOG-56-Transformar-Proposta-em-Pedido]] (v8). Decisões: N16-152 (saída (b), 09/11). Riscos: RS-022. Pontas soltas: PS-040.

**Nota de versão.** A v1 acompanhava o contrato v2 e dizia que "nenhuma correção de front é necessária", descrevendo a heurística do modal como `codigo === '1.01.96' || /refat/`. A v2 corrigiu isso, mas saiu com o arquivo nomeado `Adendo-v3` e o texto dizendo "Versão 2". A v4 tem o mesmo número no arquivo, no cabeçalho e no bloco, e a seção 5 reescrita pela decisão da N16-152.

## 1. O que foi conferido

Leitura direta das três contas Omie em 06/11/2026, via `geral/categorias:ListarCategorias` com `filtrar_por_tipo: "R"`, que devolve só categorias ativas, não totalizadoras e configuradas para exibição: o conjunto que o select de categoria do modal oferece ao vendedor.

Contas: `acos-59xny3pp` (ACOS VITAL / Mogi, 28 receitas), `acos-a90iosi5` (Aços Uberaba, 24) e `hrm-g0bxhyv8` (HRM Caldeiraria, 23). As três respondem separadamente, o que confirma a N16-79 por observação direta.

## 2. O achado

A tabela da §5.3.1 do [[Mapa-IncluirPedido-Omie]] (parte 2, levantamento de 04/11) comparava quatro códigos (`1.01.01`, `1.01.96`, `1.01.99` e `1.01.03`). Registrava o refaturamento de Mogi e o de Uberaba, e nenhum da HRM, porque o código da HRM não estava entre os quatro.

| Conta | Código do refaturamento | Descrição exata | Dispara o G6 pela categoria? |
|---|---|---|---|
| Mogi (AV) | `1.01.96` | Venda Cliente - Refaturamento | ✅ sim (é o literal da regra, dump de 04/11 linha 25386) |
| Uberaba (AU) | `1.01.99` | Venda Cliente - Refaturamento | 🔴 não (RS-022) |
| HRM | `1.01.98` | Venda Cliente - Refaturamento | 🔴 não (não estava mapeado) |

⚠️ A coluna acima fala só da porta da categoria. Pela segunda porta, a observação da venda, as três caem (§4).

## 3. Por que isso importa

**A armadilha dos códigos que colidem.** Os três códigos significam coisas diferentes em cada conta:

| Código | Mogi | Uberaba | HRM |
|---|---|---|---|
| `1.01.96` | Refaturamento | fora da lista ativa | fora da lista ativa |
| `1.01.98` | fora da lista ativa | Venda de Sucata | Refaturamento |
| `1.01.99` | Cobranças Jurídicas | Refaturamento | Revenda de Mercadoria |
| `1.01.01` | Venda de Cliente | Venda de Cliente | Venda de Mercadoria Fabricadas |

Qualquer regra escrita por código sem olhar a unidade erra nas duas direções. Acrescentar `1.01.98` à regra global para cobrir a HRM marcaria a Venda de Sucata de Uberaba como refaturamento: a mesma forma da armadilha do RS-022 (trocar o literal por `1.01.99` quebraria Mogi, onde é Cobranças Jurídicas), um nível mais fundo.

**O que muda em RS-022:** são três unidades; o refaturamento da HRM também não dispara o G6 pela categoria.

## 4. A segunda porta do G6 (novo na v4)

| View | Redação do ramo G6 | Fonte | Quem usa |
|---|---|---|---|
| `vw_vendas_planilha` | `obs_venda ~* 'refat\|reaft' OR codigo_categoria = '1.01.96'`, mais a porta da família (qualquer parcial com uma das duas condições leva o pedido-pai junto) | dump de 04/11, linhas 25386 e 25390 | a `vw_pedidos_liberacao`, caixa da Liberar Pedidos (filtra `p.grupo IS NULL`) |
| `vw_faturamento_planilha` | `(obs !~* 'refat\|reaft') AND codigo_categoria = '1.01.96'`; a observação com "refat" sai por outro ramo, ligado ao status do refaturamento | dump de 04/11, linhas 18042-18043 | a cascata de comissão, a descrita no [[Mapa-IncluirPedido-Omie]] (parte 2, linhas 98-99) |

**Consequência prática.** Na Liberar Pedidos, o pedido some em qualquer unidade quando a observação tem "refat" ou "reaft", e em Mogi some sempre, pela categoria. Quem lesse só a nota do vault concluiria que o problema é de Mogi; é das três.

**O que muda em PS-040.** A consulta pedida contava os pedidos de Uberaba com `1.01.99`. Para dimensionar o problema, ela precisa somar a HRM com `1.01.98`, rodar sobre a `vw_vendas_planilha` e contar as duas portas em separado, porque a decisão da N16-152 trata uma e não a outra.

## 5. O que pede, reescrito pela decisão da N16-152

A v2 pedia incluir o `1.01.98` na lista de categorias de refaturamento. Esse pedido caiu: em 09/11 o Nathan decidiu a saída (b), e o refaturamento passa a ser decidido pela tabela `core_vendas_faturamento.refaturamentos`; nem a categoria nem a observação continuam sendo porta. Não se conserta uma regra por código quando o mesmo código significa Venda de Sucata na unidade vizinha.

O que continua valendo (todos registrados no vault em 09/11, junto com este contrato):
- a linha do `1.01.98` na §5.3.1 do [[Mapa-IncluirPedido-Omie]] e o RS-022 dizendo "três unidades" ([[Riscos]]);
- nas linhas 98-99 da mesma nota, dizer de qual view é a cascata descrita;
- na medição do PS-040 ([[Pontas-Soltas]]): as três unidades, sobre a `vw_vendas_planilha`, com as portas contadas em separado. O Robert não conecta no banco (skill `banco-de-dados`): o SQL está pronto e falta rodar;
- o registro da N16-152 como saída (b), com a colisão da §3 como justificativa ([[Registro-N16-150-a-N16-152]]).

## 6. O que isso mudou no front

A v1 dizia que nenhuma correção de front era necessária, porque a heurística do modal era `codigo === '1.01.96' || /refat|reaft/i.test(descricao)` e o casamento por descrição já alcançava as três contas. Certo no efeito, errado no desenho. A função passou a casar só pela descrição:

```ts
const ehRefaturamento = (c: CategoriaUnidadeProps) => /refat|reaft/i.test(c.descricao);
```

Testar `codigo === '1.01.96'` afirma que esse código é refaturamento em qualquer conta, o que é falso. Não dava falso-positivo só porque em Uberaba e na HRM ele está inativo e oculto, invariante que vive em outro lugar. As três categorias se chamam "Venda Cliente - Refaturamento", então a descrição alcança as três e não alcança mais nada.

O `1.01.01` como pré-seleção foi retirado (decisão do Nathan, 09/11): se a categoria é obrigatória, vir marcada anula a obrigatoriedade. Na HRM, aliás, o `1.01.01` é "Venda de Mercadoria Fabricadas".

⚠️ O aviso continua sendo só aviso. Mesmo que a Qualidade responda que refaturamento não passa por processo de qualidade, a pergunta continua no modal e obrigatória.

Nada aqui bloqueia a criação mínima do pedido no Omie. O aviso da tela alerta nas três unidades; a regra de comissão, não, e é isso que o RS-022 e o PS-040 medem.
