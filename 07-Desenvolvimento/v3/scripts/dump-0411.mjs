// Bloco 8 (antes do 9): o Nathan enviou o dump do banco de teste do av-hub de 04/11/2026 (esqueleto, sem dados).
// Este script acrescenta às notas o que mudou em relação ao dump de 29/10 (comparação na nota 04-Dados/Dump-AvHub-Teste-2026-11-04).
// Regra: nada é apagado; o fato de 29/10 continua e o de 04/11 entra ao lado. Só a linha ❓ da 01 e a linha 78 do
// Diferencas-Codigo-x-Banco são reescritas, porque o dump novo responde a dúvida (os fatos antigos continuam no texto).
// Uso: node 07-Desenvolvimento/v3/scripts/dump-0411.mjs [--simular]   (idempotente)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const simular = process.argv.includes('--simular');
const D = '[[Dump-AvHub-Teste-2026-11-04]]';
const AJ = [
  ['02-Fluxo-de-Atividades/01-Proposta-de-Venda.md',
    '- ❓ As funções de revisar, aprovar, cancelar, copiar, transformar e expirar são chamadas pela API, mas a migration delas não está no repositório nem no dump (Gustavo).',
    `- ✅ No banco de teste (dump de 04/11/2026, ${D}), as funções de revisar, aprovar, cancelar, copiar, transformar e expirar existem: \`fn_proposta_revisar\`, \`fn_proposta_aprovar\`, \`fn_proposta_cancelar\`, \`fn_proposta_copiar\`, \`fn_proposta_transformar\` e \`fn_propostas_expirar\`. No dump de 29/10 elas não estavam.\n- ✅ O \`transformar\` grava o pedido do Hub em \`core_comercial.pedidos_venda\` e \`pedidos_venda_itens\` (status \`ABERTO\` ou \`CANCELADO\`, \`status_sincronizacao_omie\` \`pendente\`) e a simulação de comissão (\`core_comissionamento.simulacoes\`). 🔴 Ele não grava liberação (N16-05; BL-069).\n- ❓ A migration dessas funções continua fora do repositório (Gustavo).`],
  ['09-Diagramas/Estados.md',
    'que **não existe** no dump de 29/10; o schema final',
    'que **não existe** no dump de 29/10 e existe no dump do banco de teste de 04/11/2026 (status `ABERTO` ou `CANCELADO`, `ck_pedidos_venda_status`); o schema final'],
  ['02-Fluxo-de-Atividades/Transversais/Estados-e-Status.md',
    '❓ o `CHECK` do dump de 29/10 tem só os quatro primeiros |',
    '❓ o `CHECK` do dump de 29/10 tem só os quatro primeiros; no dump do banco de teste de 04/11/2026 o `ck_propostas_status` já aceita `EXPIRADA` ✅ |'],
  ['04-Dados/Diferencas-Codigo-x-Banco.md',
    '| rotas `/comercial/*` (funções `core_comercial.fn_proposta_*`, `fn_cliente_omie_registrar`, `fn_parametros_custo_salvar`, `vw_propostas_lista`) | ✅ existem no dump de 29/10 | ✅ | `core_comercial/aggregates/*` |',
    '| rotas `/comercial/*` (funções `core_comercial.fn_proposta_*`, `fn_cliente_omie_registrar`, `fn_parametros_custo_salvar`, `vw_propostas_lista`) | ✅ existem no dump de 29/10 só a criação e o cálculo do item (`fn_proposta_criar`, `fn_proposta_item_calcular`); as de revisar, aprovar, cancelar, copiar, transformar e expirar, e as tabelas `core_comercial.pedidos_venda` e `pedidos_venda_itens`, aparecem no dump do banco de teste de 04/11/2026 | ✅ | `core_comercial/aggregates/*` |'],
  ['02-Fluxo-de-Atividades/15-Custo-Real-e-Comissao.md',
    'o código e o dump de 29/10 da `api-acos-vital` já usam `core_comercial.propostas` e `core_comercial.fn_proposta_*`',
    'o código e o dump de 29/10 da `api-acos-vital` já usam `core_comercial.propostas` e `core_comercial.fn_proposta_*` (e o dump do banco de teste de 04/11/2026 também tem o pedido do Hub em `core_comercial.pedidos_venda`)'],
];
// acréscimos depois de uma âncora (a âncora fica igual)
const DEPOIS = [
  ['04-Dados/Banco-AvHub.md', '# Banco do av-hub\n',
    `\n> [!info] Dump mais novo: banco de teste, 04/11/2026\n> O Nathan enviou o esqueleto do banco de **teste** (\`tst\`) de 04/11/2026 23:58 (PostgreSQL 18.6), sem dados: ${D}. Frente ao de 29/10 abaixo: **15 schemas, 146 tabelas, 51 views, 238 funções e 191 triggers**. Mudou só o \`core_comercial\` e entrou o schema \`orcamento_pdf\` (tabela \`relatorio\`):\n> - \`core_comercial\` passa a ter **12 tabelas** (\`propostas\`, \`propostas_itens\`, \`propostas_eventos\`, \`propostas_versoes\`, \`pedidos_venda\`, \`pedidos_venda_itens\`, \`parametros_custo\`, \`unidades_emissoras\`, \`perfis_comerciais\`, \`sequencias_documento\`, \`sequencias_proposta\`, \`chaves_idempotencia\`), 2 views e 28 funções (entre elas \`fn_proposta_aprovar\`, \`_cancelar\`, \`_revisar\`, \`_copiar\`, \`_transformar\` e \`fn_propostas_expirar\`).\n> - Saíram as 13 tabelas do módulo de teste do Pablo: \`ofertas\`, \`solicitacoes_custo\`, \`clientes\`, \`clientes_contatos\`, \`fornecedores_perfil\`, \`fornecedores_categorias\`, \`categorias_suprimento\`, \`apelidos_fornecedor\`, \`certificados\`, \`notificacoes\`, \`produtos_pendentes\`, \`produtos_perfil\` e \`tabelas_custo_telha\` (com a view \`vw_fornecedores_por_cnpj\`).\n> - Sem mudança: \`divergencias_compra\` e o schema \`core_comissao\` continuam ausentes; o contador de documentos aceita só \`ordem_compra\` e \`requisicao_compra\`; a numeração da proposta continua \`CO-<código><ano>-<seq>-R00\`.\n> O resto desta nota descreve o dump de 29/10, que continua valendo para os outros schemas. Comparação completa: ${D}.\n`],
  ['00-Inicio/Onde-Estamos.md', 'Confirmar no banco o "Transformar em pedido";',
    ' no banco de teste de 04/11/2026 a função já existe e grava o pedido do Hub em `core_comercial.pedidos_venda`, sem liberação; falta a migration no repositório (' + D + ');'],
  ['00-Inicio/Onde-Estamos.md', 'falta confirmar o banco do "Transformar em pedido",',
    ' (no banco de teste de 04/11/2026 a função existe e grava o pedido do Hub em `core_comercial.pedidos_venda`; a migration segue fora do repositório),'],
  ['02-Fluxo-de-Atividades/02-Orcamento-Base-de-Preco.md', 'falta portar para a `api-acos-vital`.',
    ' No banco de teste de 04/11/2026 as tabelas `core_comercial.ofertas` e `solicitacoes_custo` também saíram (' + D + ').'],
  ['09-Diagramas/Componentes-e-Implantacao.md', 'e as rotas `/comercial/*` da API o usam.',
    ' No dump do banco de teste de 04/11/2026 o `core_comercial` tem 12 tabelas: saíram `ofertas`, `clientes` e as outras do módulo de teste, e entraram `pedidos_venda` e `pedidos_venda_itens`.'],
  ['04-Dados/Schemas-Postgres.md', '6. **`core_comercial` está no dump de 29/10** ✅ (23 tabelas); no de 14/10 não estava.',
    ' No dump do banco de teste de 04/11/2026 tem 12 tabelas (saíram as do módulo de teste do Pablo; entraram `pedidos_venda` e `pedidos_venda_itens`), e há um 15º schema, `orcamento_pdf` ✅ ' + D + '.'],
  ['07-Desenvolvimento/Ultima-Atualizacao-do-Vault.md', 'São os mesmos commits do `develop-conferida` das notas de raia.',
    `\n\n**Banco (fonte 2, depois do código):** o dump mais novo é o esqueleto do banco de **teste** do av-hub de 04/11/2026 23:58, enviado pelo Nathan: ${D}. O de 29/10 continua em \`api-acos-vital\` (\`Dump do Avhub para referência (29.10).sql\`, na \`develop\`). Do MES, o mais novo é o de 14/10.`],
];
const BL = [
  ['BL-068', '*Dump do banco de teste de 04/11/2026:* `fn_proposta_transformar` e as outras `fn_proposta_*` existem, com `core_comercial.pedidos_venda`; `divergencias_compra`, calendário de exceções e `core_comissao` continuam ausentes.'],
  ['BL-069', '*Dump do banco de teste de 04/11/2026:* o `ck_contadores_documento_tipo` ainda aceita só `ordem_compra` e `requisicao_compra`, e o `fn_proposta_transformar` não grava liberação.'],
  ['BL-071', '*Dump do banco de teste de 04/11/2026:* as funções de aprovar, cancelar e transformar existem; a numeração continua `CO-<código><ano>-<seq>-R00` (`fn_proposta_criar`), não só dígitos (N16-148, PS-038).'],
];
let mud = 0;
const ler = (r) => fs.readFileSync(path.join(raiz, r), 'utf8');
const gravar = (r, t) => { mud++; console.log(`${simular ? '[simular] ' : ''}${r}`); if (!simular) fs.writeFileSync(path.join(raiz, r), t, 'utf8'); };
for (const [r, a, b] of AJ) { const t = ler(r); if (t.includes(b)) continue; if (!t.includes(a)) throw new Error(`${r}: âncora`); gravar(r, t.replace(a, b)); }
for (const [r, a, b] of DEPOIS) { const t = ler(r); if (t.includes(b.trim().slice(0, 60))) continue; if (!t.includes(a)) throw new Error(`${r}: âncora`); gravar(r, t.replace(a, a + b)); }
for (const [n, txt] of [['Gustavo', BL[0]], ['Gustavo', BL[1]], ['Comercial-e-Suprimentos', BL[2]]]) {
  const r = `07-Desenvolvimento/Partes/Backlog-Frente-${n}.md`;
  const lin = ler(r).split('\n');
  const i = lin.findIndex((l) => l.startsWith(`| ${txt[0]} |`));
  if (i < 0) throw new Error(`${txt[0]} não achado`);
  if (lin[i].includes('Dump do banco de teste de 04/11/2026')) continue;
  const c = lin[i].split(/(?<!\\)\|/);
  c[3] = `${c[3].trimEnd()} ${txt[1]} `; // coluna "O que falta"
  lin[i] = c.join('|');
  gravar(r, lin.join('\n'));
}
console.log(`${mud} alterações`);
