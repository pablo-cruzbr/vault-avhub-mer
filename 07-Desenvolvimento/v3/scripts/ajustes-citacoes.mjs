// Bloco 3: ajustes de citações feitos à mão contra a develop (05/11/2026), um por um, com o motivo.
// Cada troca vale só na linha da nota que contém a âncora. Registra antigo → novo em _v3/fatos/substituicoes.tsv.
// Base: av-hub 2e5456d · api-pcp befd973 · app-pcp 93f96de · api-acos-vital b97981c (origin/develop).
// Uso: node _v3/scripts/ajustes-citacoes.mjs [--simular]   (idempotente)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const simular = process.argv.includes('--simular');
const F = '02-Fluxo-de-Atividades/';
const FILA = 'fila/CartaoItemParcial.tsx';
// [nota, âncora da linha, antigo, novo, motivo]
const A = [
  // FilaSetor.tsx foi dividido em fila/CartaoItemParcial.tsx, fila/useFilaSetor.ts e fila/compraAvhub.tsx (app-pcp c199d91, 27/10)
  ['06-Circuito-de-Compra', 'sincronizar', 'FilaSetor.tsx:370-396', 'fila/compraAvhub.tsx:52-74', 'app-pcp c199d91 dividiu o FilaSetor; sincronizar está em compraAvhub.tsx'],
  ['07-Recebimento', 'Receber com NF', 'FilaSetor.tsx:594', 'FilaRecebimento.tsx:147', 'app-pcp: o Receber com NF abre de FilaRecebimento.tsx'],
  ['07-Recebimento', 'Conferir recebimento', 'FilaSetor.tsx:923', `${FILA}:907`, 'app-pcp c199d91'],
  ['07-Recebimento', 'Recontar', 'FilaSetor.tsx:936', `${FILA}:895`, 'app-pcp c199d91'],
  ['07-Recebimento', 'Liberar para o Recebimento sem OC', 'FilaSetor.tsx:911', `${FILA}:761`, 'app-pcp c199d91 (liberarSemOc)'],
  ['10-Producao-e-Roteiro', 'idSetorOrigem', 'FilaSetor.tsx:685-691', `${FILA}:301-305`, 'app-pcp c199d91 (filtro das ações)'],
  ['11-Qualidade-Saida', "setor.tipo === 'QUALIDADE'", 'FilaSetor.tsx:690', `${FILA}:305`, 'app-pcp c199d91'],
  ['11-Qualidade-Saida', 'rótulo da ação', 'FilaSetor.tsx:203', `${FILA}:150`, 'app-pcp c199d91 (resolver: Aprovar)'],
  ['11-Qualidade-Saida', 'ehUltimaEtapa', 'FilaSetor.tsx:687-688', `${FILA}:301-302`, 'app-pcp c199d91'],
  ['13-Expedicao', 'EXPEDICAO', 'FilaSetor.tsx:810-835', `${FILA}:435-444`, 'app-pcp c199d91 (pallets no setor EXPEDICAO)'],
  // intervalos que passavam do fim do arquivo: cortados no fim real ou recolocados no identificador
  ['02-Orcamento-Base-de-Preco', 'suprimentos.routes.ts', 'suprimentos.routes.ts:823-880', 'suprimentos.routes.ts:823-875', 'o arquivo do módulo de teste tem 875 linhas'],
  ['03-Pedido-de-Venda-e-Liberacao', 'importado', 'omie-integracao.ts:393-405', 'omie-integracao.ts:339-349', 'api-pcp: confirmação de importação nas linhas 339-349'],
  ['04-PCP-Triagem-e-Destinacao', 'pedidos.controller.ts:211-260', 'pedidos.controller.ts:211-260', 'pedidos.controller.ts:211-222', 'api-pcp: o controller tem 222 linhas'],
  ['04-PCP-Triagem-e-Destinacao', 'pedidos.service.ts:773-863', 'pedidos.service.ts:773-863', 'pedidos.service.ts:773-807', 'api-pcp: o service tem 807 linhas'],
  ['06-Circuito-de-Compra', 'Envio ao av-hub', 'integracao.prisma:290-320', 'integracao.prisma:20-28', 'api-pcp: enum StatusEnvioAvhub nas linhas 20-28'],
  ['08-Qualidade-Entrada', 'circuito-compra.ts:256-300', 'circuito-compra.ts:256-300', 'circuito-compra.ts:256-298', 'api-pcp: o arquivo tem 298 linhas'],
  ['08-Qualidade-Entrada', 'qualidade.controller.ts:31-35', 'qualidade.controller.ts:31-35', 'qualidade.controller.ts:31-34', 'api-pcp: o arquivo tem 34 linhas'],
  ['08-Qualidade-Entrada', 'qualidade.controller.ts:19-35', 'qualidade.controller.ts:19-35', 'qualidade.controller.ts:19-34', 'api-pcp: o arquivo tem 34 linhas'],
  ['08-Qualidade-Entrada', 'reprovar-lote.dto.ts:5-27', 'reprovar-lote.dto.ts:5-27', 'reprovar-lote.dto.ts:5-26', 'api-pcp: o arquivo tem 26 linhas'],
  ['10-Producao-e-Roteiro', 'divergencias.controller.ts:26-63', 'divergencias.controller.ts:26-63', 'divergencias.controller.ts:26-61', 'api-pcp: o arquivo tem 61 linhas'],
  ['10-Producao-e-Roteiro', 'fabricas.prisma:162-185', 'fabricas.prisma:162-185', 'fabricas.prisma:162-176', 'api-pcp: o arquivo tem 176 linhas'],
  ['10-Producao-e-Roteiro', 'item-parcial-status.constants.ts:44-50', 'item-parcial-status.constants.ts:44-50', 'item-parcial-status.constants.ts:31-41', 'api-pcp: STATUS_EM_PRODUCAO e o comentário "EM_PRODUCAO nunca é gravado"'],
  ['13-Expedicao', 'item-parcial-status.constants.ts:44-50', 'item-parcial-status.constants.ts:44-50', 'item-parcial-status.constants.ts:31-41', 'api-pcp: idem'],
  ['13-Expedicao', 'entregas.controller.ts:40-50', 'entregas.controller.ts:40-50', 'entregas.controller.ts:40-44', 'api-pcp: o arquivo tem 44 linhas'],
  ['13-Expedicao', 'etapaDoItem', 'integracao-avhub.service.ts:187-188', 'integracao-avhub.service.ts:158-184', 'api-pcp: função etapaDoItem começa na linha 158'],
  // páginas de Vendas mudaram de pasta (av-hub d5fa9a6, "move o Portal do Vendedor para dentro de Vendas")
  ['03-Pedido-de-Venda-e-Liberacao', 'components/LiberarPedidos/', 'app/(protected)/liberar-pedidos/page.tsx', 'app/(protected)/vendas/liberar-pedidos/page.tsx', 'av-hub d5fa9a6'],
  ['14-Fiscal-Omie', 'Minhas Notas', '`/minhas-notas` | HUB | ✅ `app/(protected)/minhas-notas/page.tsx`', '`/vendas/minhas-notas` | HUB | ✅ `app/(protected)/vendas/minhas-notas/page.tsx`', 'av-hub d5fa9a6'],
  ['03-Pedido-de-Venda-e-Liberacao', 'Portal do Vendedor, `/liberar-', '`/liberar-pedidos`', '`/vendas/liberar-pedidos`', 'av-hub d5fa9a6: a rota passou para /vendas'],
  ['03-Pedido-de-Venda-e-Liberacao', '| Liberar Pedidos | Caixa de entrada', '`/liberar-pedidos`', '`/vendas/liberar-pedidos`', 'av-hub d5fa9a6'],
  ['03-Pedido-de-Venda-e-Liberacao', '| Liberar Pedidos, Liberação da Equipe |', '`/liberar-pedidos`, `/liberacao-equipe`', '`/vendas/liberar-pedidos`, `/liberacao-equipe`', 'av-hub d5fa9a6 (liberacao-equipe continua na raiz)'],
  ['Transversais/Telas-por-Raia', '| V2, V3 | Liberar Pedidos |', '`/liberar-pedidos`', '`/vendas/liberar-pedidos`', 'av-hub d5fa9a6'],
  // selo que muda pela develop: os JSON do Orçamento saíram todos
  ['02-Orcamento-Base-de-Preco', 'JSON `lib/orcamento/data/*.json`',
    '**Saíram 3:** `categorias.json`, `historicoPrecos.json`, `vinculos.json` (`ededeea`). **Ficam 3:** `familias.json`, `fornecedores.json`, `produtos.json`, lidos por `lib/orcamento/dados.ts` para o cadastro de produtos e o simulador de comissão (`app/api/orcamento/{familias,produtos,todos-fornecedores}`). `fornecedores.json` (CNPJ, e-mail, telefone) continua versionado no git 🔴',
    '**Saíram os 6** ✅ (av-hub `develop` 2e5456d): `categorias.json`, `historicoPrecos.json`, `vinculos.json` (`ededeea`) e depois `familias.json`, `fornecedores.json`, `produtos.json` e o `lib/orcamento/dados.ts` que os lia (`c851cda`, 16/10, "remove the legacy Orcamento module"). Registro anterior (v2): "ficam 3 … `fornecedores.json` (CNPJ, e-mail, telefone) continua versionado no git 🔴". Os arquivos seguem no histórico do git',
    'selo muda pela develop (F5): av-hub c851cda tirou os 3 JSON que a v2 dava como presentes'],
  ['02-Orcamento-Base-de-Preco', 'Marcas `GAMBIARRA` O1 e O2', '**Saíram:** o arquivo não tem mais a marca; as funções O1 e O2 foram removidas junto das telas', '**Saíram** ✅: o arquivo `lib/orcamento/dados.ts` foi removido inteiro (av-hub `c851cda`, 16/10); as funções O1 e O2 foram removidas junto das telas', 'av-hub c851cda'],
];

const log = [];
const porNota = {};
for (const x of A) (porNota[x[0]] ||= []).push(x);
for (const [nota, lista] of Object.entries(porNota)) {
  const p = path.join(raiz, F + nota + '.md');
  const ls = fs.readFileSync(p, 'utf8').split('\n');
  let mudou = false;
  for (const [, ancora, antigo, novo, motivo] of lista) {
    const idx = ls.map((l, i) => (l.includes(ancora) && l.includes(antigo) ? i : -1)).filter((i) => i >= 0);
    if (!idx.length) {
      if (!ls.some((l) => l.includes(novo))) console.log(`AVISO ${nota}: não achei "${antigo.slice(0, 60)}" na linha com "${ancora}"`);
      continue;
    }
    for (const i of idx) {
      ls[i] = ls[i].split(antigo).join(novo);
      mudou = true;
      log.push([antigo, novo, `${F}${nota}.md:${i + 1}`, motivo].join('\t'));
      console.log(`${nota}:${i + 1}  ${antigo.slice(0, 60)} → ${novo.slice(0, 60)}`);
    }
  }
  if (mudou && !simular) fs.writeFileSync(p, ls.join('\n'), 'utf8');
}
if (!simular && log.length) {
  const ps = path.join(raiz, '_v3', 'fatos', 'substituicoes.tsv');
  const ant = fs.readFileSync(ps, 'utf8').split('\n').filter(Boolean);
  for (const l of log) if (!ant.includes(l)) ant.push(l);
  fs.writeFileSync(ps, ant.join('\n') + '\n', 'utf8');
}
console.log(`${simular ? 'SIMULAÇÃO — ' : ''}${log.length} ajustes`);
