---
id: API-019
titulo: A emissão da OC mostra a parte de compras da proposta (C6 e C7)
status: para-implementar
autor: Nathan
data: 2026-11-11
camadas: [frontend, api]
donos: {frontend: Nathan, api: Gustavo}
nos_0b: [C6, C7]
notas_afetadas: [06-Circuito-de-Compra, 06-Circuito-de-Compra-Detalhe-Tecnico-2, 01-Proposta-de-Venda, Backlog-por-Frente]
depende_de: [LOG-56]
decisoes: [N16-08, N16-17, N16-19, N16-38, N16-53, N16-144, N16-157]
develop-conferida: [api-acos-vital 637f183, av-hub d0e8f8f, em 2026-11-11]
tags: [contrato, compras, proposta, oc, c6, c7]
criado: 2026-11-11
estado-em: 2026-11-11
dono: Nathan
fontes: [06-Circuito-de-Compra-Detalhe-Tecnico-2 (regras 14, 15 e 30; item 7 de "O que falta"), Registro-de-Decisoes N16-08, N16-17, N16-19, N16-38, N16-53, N16-144, api-acos-vital develop 637f183, av-hub develop d0e8f8f, banco do ambiente Docker local (dados do tst) em 11/11/2026]
---

# API-019 · A emissão da OC mostra a parte de compras da proposta (C6 e C7)

## 1. Resumo em linguagem simples

Quando o vendedor monta a proposta, ele cota a compra de cada item: fornecedor, preço de compra, IPI, ST e frete. Hoje o comprador não vê nada disso ao emitir a OC do pedido que nasceu dessa proposta. Com este contrato, a tela de emissão da OC mostra, ao lado de cada item ligado ao pedido, o que a proposta cotou, compara com o preço que o comprador está digitando e deixa usar o preço cotado com um clique. A proposta não muda (N16-17). O comprador continua decidindo o valor da OC.

## 2. Contexto: o que deve ser feito e por quê

- **O problema hoje.** O preço de compra cotado pelo vendedor fica só na proposta (`core_comercial.propostas_itens.preco_unit_compra`). O comprador emite a OC sem saber quanto a venda supôs pagar. Exemplo do banco de teste: a proposta `CO-AV2026-0010-R00` cotou CHAPA12150135A36 com CHAPINHAS a R$ 120,00 por M2; o pedido do Hub `PV-000003` nasceu dela (Omie 29853), e a tela da OC não mostra esse valor.
- **Quem sofre.** O comprador, que compra sem a referência, e o vendedor, cuja margem e comissão caem quando a compra sai acima do cotado (N16-60). Sem a referência na tela, nem o comprador percebe que vai abrir uma divergência (`C8`).
- **De onde vem.** Regras 14, 15 e 30 da raia 06 ([[06-Circuito-de-Compra-Detalhe-Tecnico-2]]), N16-08 (Compras confere a parte de compras da proposta e usa o valor certo na OC), N16-19 (Compras vê a mesma tela em leitura), N16-38 e N16-53. Item 7 de "O que falta" da mesma nota. Raia do Nathan desde a N16-157.
- **Se não for feito.** O `C8` (aviso ao vendedor de compra acima do valor) não tem de onde tirar o "valor da proposta" na tela, e o comprador segue comprando às cegas.

## 3. Onde fica no fluxo

Nós `C6` e `C7` do [[00-Fluxo-Mestre-0b]], raia [[06-Circuito-de-Compra]] (dona dos nós). Os dados nascem na raia [[01-Proposta-de-Venda]] (`V0.2`, custo do item). Prepara o `C8`, que terá contrato próprio.

## 4. Como está hoje

- **Banco.** 🟡 A proposta já guarda a cotação de compra por item: `core_comercial.propostas_itens` tem `fornecedor` (texto livre), `origem_compra`, `qtd_compra`, `unidade_compra`, `preco_unit_compra`, `ipi_compra_pct`, `st_compra_valor`, `frete_compra_valor`, `custo_liquido_unit` e `custo_liquido_total`; o cabeçalho `core_comercial.propostas` tem `frete_compra_tipo` e `frete_compra_valor` (banco do Docker local, dados do tst, 11/11). O pedido do Hub liga as duas pontas: `core_comercial.pedidos_venda` (`id_proposta`, `numero_proposta`, `numero_pedido_omie`, `codigo_empresa`) e `core_comercial.pedidos_venda_itens` (`id_proposta_item`, `codigo_produto_omie`).
- **API.** 🔴 Nenhuma rota de Compras lê esses campos. A tela da OC lê o pedido por `GET /compras/pedidos-venda/{numero}` ✅ `api-acos-vital` `src/schemas/core_vendas_faturamento/views/vw_pedido_venda_compras/vw_pedido_venda_compras.route.js:92` (`router.get("/:numero"`), que devolve só o cabeçalho do Omie e os itens de `vw_pedido_venda_itens_compra`.
- **Front.** 🔴 A tela `/compras/nova` mostra, por item, o destino no PV e mais nada da venda: `av-hub` `components/Compras/FecharCompra/ItemOrdem.tsx:240` (`<DestinoItem item={item} indice={indice} />`). O BFF é `app/api/compras/pedidos-venda/[numero]/route.ts:20` (`${process.env.API_URL}/compras/pedidos-venda/`).

## 5. Regras de negócio

- **R1.** Os dados da proposta são **só leitura** na OC. O comprador não altera a proposta, e o preço fechado com o cliente não muda (N16-17, regra 15).
- **R2.** A tela mostra, para cada item da OC ligado a um item de PV que nasceu de proposta: fornecedor cotado, origem, quantidade e unidade de compra, preço unitário de compra, IPI %, ST, frete do item e custo líquido unitário (N16-08, regra 14).
- **R3.** **Comparação:** se a OC é em reais e a unidade de medida da OC é a mesma da unidade de compra cotada, a tela compara o valor unitário da OC (já com desconto) com o `preco_unit_compra`. Unidades diferentes não se comparam, e a tela diz isso. OC em moeda estrangeira não se compara.
- **R4.** **Usar o valor da proposta:** um botão preenche o valor unitário do item da OC com o `preco_unit_compra`. O fornecedor cotado é texto livre; a tela só o mostra, e o comprador escolhe o fornecedor da OC na busca de sempre (N16-08: pode usar o fornecedor do vendedor ou outro).
- **R5.** **Acima do cotado:** quando o valor da OC passa do cotado, a tela avisa quanto passou (em R$ e %) e que, com o `C8`, o vendedor terá de aprovar (N16-60 a N16-64). Até o `C8` existir, o aviso só informa e não bloqueia. Abaixo ou igual, nada a avisar (N16-65).
- **R6.** **Impostos:** IPI e ST da proposta são só exibidos. Gravar imposto por item na OC é o BL-053 (desenho na N16-144), fora deste contrato.
- **R7.** **Frete:** a seção de frete da OC mostra o frete de compra do cabeçalho da proposta (`frete_compra_tipo` e `frete_compra_valor`), só para leitura.
- **R8.** **PV sem proposta** (digitado no Omie) ou item sem cotação: nada aparece e nada muda.
- **R9.** Um PV do Omie pode ter mais de um pedido do Hub? Não deve: vale o pedido do Hub não excluído com o mesmo `numero_pedido_omie` na mesma unidade. Se houver mais de um, a API usa o mais recente e registra aviso no log.

## 6. Frontend

- **Sistema e tela:** av-hub, "Nova ordem de compra" e "Ordem de compra da requisição" (`/compras/nova` e `/compras/nova/[requisicaoId]`), componente `FecharCompra`.
- **O que muda:**
  - Em cada item ligado a um PV com cotação (`compra_proposta` não nulo), um bloco **"Cotado na proposta CO-…"** abaixo do destino, com: fornecedor e origem; quantidade e unidade de compra; preço unitário; IPI %; ST; frete do item; custo líquido unitário.
  - Ao lado do valor unitário: "OC R$ X × proposta R$ Y" e a diferença (R3). Acima do cotado: aviso em âmbar com o texto **"Acima do cotado na proposta em R$ D (P%). Com o C8, o vendedor vai aprovar esta diferença."** (R5).
  - Botão **"Usar o preço da proposta"** (R4), que some quando o valor já é o cotado.
  - Na seção Frete, a linha **"Frete de compra na proposta: <tipo> · R$ V"** (R7).
- **Estados:** sem `proposta` no retorno, o bloco não aparece (R8). Erro ao carregar o PV continua como hoje.
- **Validações:** nenhuma nova; tudo é exibição, menos o botão do R4, que só preenche o campo.
- **BFF:** `app/api/compras/pedidos-venda/[numero]/route.ts` repassa os campos novos sem mudança. Tipos novos em `lib/domain/compras-ordem.ts`; a comparação do R3 e do R5 é função pura em `lib/domain/compras-fechamento-tela.ts`, com teste.

## 7. Backend

Não se aplica: a mudança é só de leitura, dentro da rota da seção 8; nenhuma regra nova é gravada.

## 8. API

| Método | Rota | Quem chama | Perfil/permissão |
|---|---|---|---|
| GET | `/compras/pedidos-venda/{numero}?codigo_empresa=` (existente) | BFF do av-hub, tela `compras` | a de hoje (sem mudança) |

- **Request:** igual a hoje.
- **Response:** acrescentar um campo no cabeçalho e um em cada item. Os outros campos não mudam.

```json
{
  "numero_pedido": "29853",
  "codigo_empresa": "759979bd-2b2d-41f2-b1b7-db6fae89ee59",
  "encontrado": true,
  "proposta": {
    "id_pedido_hub": "…uuid…",
    "numero_pedido_hub": "PV-000003",
    "id_proposta": "…uuid…",
    "numero_proposta": "CO-AV2026-0010-R00",
    "frete_compra_tipo": "RATEIO",
    "frete_compra_valor": 0
  },
  "itens": [
    {
      "codigo_produto_omie": "10222464315",
      "codigo_produto": "CHAPA12150135A36",
      "quantidade_pendente": 35,
      "compra_proposta": {
        "fornecedor": "CHAPINHAS",
        "origem_compra": "SÃO PAULO",
        "qtd_compra": 35,
        "unidade_compra": "M2",
        "preco_unit_compra": 120.0,
        "ipi_compra_pct": 0,
        "st_compra_valor": 0,
        "frete_compra_valor": 0,
        "custo_liquido_unit": null
      }
    }
  ]
}
```

- **Como achar o pedido do Hub:** `core_comercial.pedidos_venda` com `codigo_empresa = :e`, `deleted_at IS NULL` e `ltrim(numero_pedido_omie, '0') = ltrim(:n, '0')` (o Omie grava com zeros à esquerda: `000000000029853`). Mais de um: o de `created_at` mais recente (R9).
- **Como achar o item:** `pedidos_venda_itens.codigo_produto_omie = item.codigo_produto_omie` do pedido achado, e dele `propostas_itens` por `id_proposta_item`.
- `proposta` é `null` quando o PV não nasceu de proposta; `compra_proposta` é `null` quando o item não tem cotação (`preco_unit_compra` nulo e `fornecedor` vazio) (R8). Números vêm como número, não texto.
- **Erros:** os de hoje. A leitura da proposta nunca derruba a rota: se ela falhar, a rota responde sem `proposta` e registra o erro no log.
- **Idempotência:** leitura pura.

## 9. Banco (SQL)

Não se aplica: as colunas já existem (seção 4). Se o Gustavo preferir, a junção pode virar uma view (`core_comercial.vw_pedido_venda_compra_proposta`), sem mudar o contrato da rota.

## 10. Permissões e perfis

Quem já emite OC (tela `compras`) passa a ver a cotação da proposta. O vendedor não ganha acesso novo. Sem mudança em `auth.rotas_telas`.

## 11. Integrações afetadas

Nenhuma. Omie e MES não mudam.

## 12. Critérios de aceite

- [ ] API: `GET /compras/pedidos-venda/{numero}` devolve `proposta` e `compra_proposta` como na seção 8 para um PV nascido de proposta, e `null` nos dois para um PV digitado no Omie.
- [ ] API: o número do Omie com zeros à esquerda casa com o número sem zeros.
- [ ] Frontend: na Nova OC com esse PV, o item mostra o bloco "Cotado na proposta", a comparação e o aviso quando o valor passa do cotado.
- [ ] Frontend: "Usar o preço da proposta" preenche o valor unitário; a proposta não muda no banco.
- [ ] Frontend: PV sem proposta mostra a tela como hoje.

## 13. Como testar

1. **Caminho feliz:** proposta `CO-AV2026-0010-R00` → `PV-000003` (Omie 29853, Aços Vital). Nova OC com finalidade "Pedidos de venda", PV 29853, item CHAPA12150135A36: aparece "Cotado na proposta CO-AV2026-0010-R00 · CHAPINHAS · R$ 120,00/M2". Digitar R$ 130,00 em M2 mostra "Acima do cotado em R$ 10,00 (8,3%)". "Usar o preço da proposta" põe R$ 120,00.
2. **Sem proposta:** PV 28189 (digitado no Omie): nada muda.
3. **Unidade diferente:** item da OC em KG com cotação em M2: "Unidades diferentes, sem comparação".
4. No ambiente Docker, o PV 29853 não está em `pedidos_vendas` (a pipeline do Omie não roda lá); para o teste, carregar o PV de teste ou usar um pedido do Hub que já tenha número do Omie.

## 14. Ordem de implementação e responsáveis

1. **API (Gustavo):** os dois campos na rota. Não depende de nada.
2. **Front (Nathan):** tipos, função pura, bloco no item e linha do frete. Pode começar antes, contra este contrato; só vai para a `develop` depois da API.

## 15. Riscos, rollback e perguntas em aberto

- **Rollback:** campos novos e opcionais; o front ignora a ausência deles.
- **Risco:** pedido do Hub ainda sem `numero_pedido_omie` (o Omie recusou) não acha o PV pela rota. É o caso de PV-000004 e PV-000005 no Docker; na produção o pedido só chega a Compras depois de existir no Omie.
- **Pergunta (Nathan):** o fornecedor cotado é texto livre. Vale pedir à proposta o parceiro do cadastro (código Omie) em vez do nome? Isso é da raia 01 (Robert).
- **Pergunta (Nathan):** o `custo_liquido_unit` está vazio em todas as propostas do banco de teste. Ele deveria vir preenchido pelo motor da proposta (BL-078)?

## 16. Impacto no vault quando for entregue

- [[06-Circuito-de-Compra]] e [[06-Circuito-de-Compra-Detalhe-Tecnico-2]]: `C6` e `C7` passam de 🔴 a ✅ (com a citação da rota e da tela); item 7 de "O que falta" sai.
- [[Backlog-por-Frente]]: a linha de `C6` e `C7` fecha.
- O `C8` ganha a base para o contrato próprio.
