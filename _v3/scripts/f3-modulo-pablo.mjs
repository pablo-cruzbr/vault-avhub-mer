// Bloco 3, F3: o que do módulo do Pablo existe só no api-comercial de teste vira 🔴 "sem API e sem banco".
// O Nathan confirmou em 05/11/2026: o api-comercial será removido integralmente.
// Base (origin/develop): av-hub 2e5456d — o BFF `app/api/comercial/[...rota]/route.ts` só encaminha à API do Hub
// as rotas marcadas `api: 'hub'`; as outras respondem 503 RECURSO_NAO_MIGRADO (`lib/api/comercialApi.ts`, N16-111).
// api-acos-vital b97981c — tem `orcamento/fornecedores`, `/fornecedores/:codigo`, `/vinculos`, `/categorias`, `/cotacoes`
// (`src/schemas/core_compras/aggregates/orcamento/orcamento.route.js:140-312`) e `parametros_custo`; NÃO tem
// `produtos/:id/precos` nem `orcamento/matriz_precos`, embora o BFF aponte para elas.
// O fato continua escrito (o que o módulo de teste fazia); só o selo muda.
// Uso: node _v3/scripts/f3-modulo-pablo.mjs [--simular]   (idempotente)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const simular = process.argv.includes('--simular');
const F = path.join(raiz, '02-Fluxo-de-Atividades');
const SO = '🔴 sem API e sem banco (só no módulo de teste `av-hub/api-comercial`, que será removido; o BFF responde 503)';
const SOc = '🔴 só no módulo de teste';
// [nota, trecho único da linha, de, para]
const T = [
  ['01-Proposta-de-Venda', '| `GET /propostas/:id/versoes`', '✅ `propostas.routes.ts` (módulo de teste); 🔴 na `api-acos-vital`', `${SO}: \`propostas.routes.ts\``],
  ['01-Proposta-de-Venda', '| `POST /propostas/calcular`', '✅ `:27`, `:55`, `:68` (módulo de teste); 🔴 na `api-acos-vital`', `${SO}: \`:27\`, \`:55\`, \`:68\``],
  ['01-Proposta-de-Venda', '| `POST /custos/sugerir` | sugestão de custo para o item', '✅ `custos.routes.ts:30`', `${SO}: \`custos.routes.ts:30\``],
  ['01-Proposta-de-Venda', '| `GET /propostas/:id/pedido_omie`', '✅ `propostas.routes.ts:146-164`, saem', '🔴 só no módulo de teste (`propostas.routes.ts:146-164`), saem'],
  ['01-Proposta-de-Venda', '### Como está no código (✅ (`av-hub/api-comercial`) do módulo do Pablo)', '### Como está no código (✅ (`av-hub/api-comercial`) do módulo do Pablo)', '### Como estava no módulo de teste do Pablo (🔴 `av-hub/api-comercial`, que será removido)'],
  ['02-Orcamento-Base-de-Preco', '✅ Oferta imutável com histórico, média por período e pedido de custo', '✅ Oferta imutável com histórico, média por período e pedido de custo, no `api-comercial` de teste (legado de consulta, N16-117); falta portar para a `api-acos-vital`.', '🔴 Sem API e sem banco: oferta imutável com histórico, média por período e pedido de custo existem só no `api-comercial` de teste (legado de consulta, N16-117), que será removido; falta portar para a `api-acos-vital`. Na API do Hub já há a leitura de fornecedores, vínculos, categorias e cotações (✅ `api-acos-vital` `orcamento.route.js:140-312`).'],
  ['02-Orcamento-Base-de-Preco', '| `StatusSolicitacao` (pedido de custo)', '`enums.prisma:188-195` ✅', `\`enums.prisma:188-195\` ${SOc}`],
  ['02-Orcamento-Base-de-Preco', '| SLA da solicitação (calculado)', '`custos.routes.ts:338` ✅', `\`custos.routes.ts:338\` ${SOc}`],
  ['02-Orcamento-Base-de-Preco', '| `StatusOferta` |', '`enums.prisma:179-186` ✅', `\`enums.prisma:179-186\` ${SOc}`],
  ['02-Orcamento-Base-de-Preco', '| `FonteOferta` |', '`enums.prisma:170-177` ✅', `\`enums.prisma:170-177\` ${SOc}`],
  ['02-Orcamento-Base-de-Preco', '| `OrigemCusto` (item da proposta) |', '`enums.prisma:110-117` ✅', `\`enums.prisma:110-117\` ${SOc}`],
  ['02-Orcamento-Base-de-Preco', '| `GET /produtos`, `/produtos/:id`, `POST /produtos` | catálogo', '✅ `suprimentos.routes.ts:29`, `:72`, `:106`', '🟡 `GET /produtos` e `/produtos/:id` vão à API do Hub (✅ `api-acos-vital` `src/schemas/core/tables/produtos/produtos.route.js`); `POST /produtos` 🔴 só no módulo de teste (`suprimentos.routes.ts:29`, `:72`, `:106`)'],
  ['02-Orcamento-Base-de-Preco', '| `GET /produtos/:id/precos?dias=` |', '✅ `suprimentos.routes.ts:823-875`', '🔴 sem API e sem banco: o BFF aponta para a API do Hub, mas a `api-acos-vital` não tem a rota; existe só no módulo de teste (`suprimentos.routes.ts:823-875`)'],
  ['02-Orcamento-Base-de-Preco', '| `GET /solicitacoes_custo`, `POST /solicitacoes_custo` |', '✅ `custos.routes.ts:304`, `:367`', `${SO}: \`custos.routes.ts:304\`, \`:367\``],
  ['02-Orcamento-Base-de-Preco', '| `POST /solicitacoes_custo/:id/assumir`', '✅ `custos.routes.ts:494`', `${SO}: \`custos.routes.ts:494\``],
  ['02-Orcamento-Base-de-Preco', '| `POST /custos/sugerir` | sugestão de custo | `B2`', '✅ `custos.routes.ts:30`', `${SO}: \`custos.routes.ts:30\``],
  ['02-Orcamento-Base-de-Preco', '### Como está no código (✅ (`av-hub/api-comercial`))', '### Como está no código (✅ (`av-hub/api-comercial`))', '### Como estava no módulo de teste do Pablo (🔴 `av-hub/api-comercial`, que será removido)'],
  ['02-Orcamento-Base-de-Preco', '| `GET /produtos/:id/precos` | histórico, média e fornecedores', '✅ `suprimentos.routes.ts:823`', '🔴 sem API e sem banco (só no módulo de teste, `suprimentos.routes.ts:823`; a `api-acos-vital` não tem a rota)'],
  ['02-Orcamento-Base-de-Preco', '| `POST /solicitacoes_custo` e `responder`', '✅ `custos.r', '🔴 só no módulo de teste: `custos.r'],
  ['02-Orcamento-Base-de-Preco', '| Pedidos de custo (Painel do Comprador) |', '✅ (`av-hub`)', '🟡 tela no `av-hub`; os dados (`/painel-comprador`, `/solicitacoes-custo`) respondem 503 no BFF: sem API e sem banco 🔴 —'],
];
// bullets da seção "Como estava no módulo de teste": todo "- ✅" vira "- 🔴 (só no módulo de teste)"
const SECOES = [['01-Proposta-de-Venda', '### Como estava no módulo de teste do Pablo'], ['02-Orcamento-Base-de-Preco', '### Como estava no módulo de teste do Pablo']];
let n = 0;
const porNota = {};
for (const x of T) (porNota[x[0]] ||= []).push(x);
for (const nota of new Set([...Object.keys(porNota), ...SECOES.map((s) => s[0])])) {
  const p = path.join(F, nota + '.md');
  const ls = fs.readFileSync(p, 'utf8').split('\n');
  for (const [, trecho, de, para] of porNota[nota] || []) {
    const i = ls.findIndex((l) => l.includes(trecho) && l.includes(de));
    if (i < 0) { if (!ls.some((l) => l.includes(para))) console.log(`AVISO ${nota}: não achei "${trecho}"`); continue; }
    ls[i] = ls[i].replace(de, para); n++;
    console.log(`${nota}:${i + 1} → ${para.slice(0, 70)}`);
  }
  for (const [ns, titulo] of SECOES) {
    if (ns !== nota) continue;
    let i = ls.findIndex((l) => l.startsWith(titulo));
    if (i < 0) continue;
    for (i++; i < ls.length && !/^#{2,3} /.test(ls[i]); i++) {
      if (/^- ✅/.test(ls[i])) { ls[i] = ls[i].replace(/^- ✅( \(`av-hub`\))?/, '- 🔴 (só no módulo de teste)'); n++; }
    }
  }
  if (!simular) fs.writeFileSync(p, ls.join('\n'), 'utf8');
}
console.log(`${simular ? 'SIMULAÇÃO — ' : ''}${n} selos mudados pelo F3`);
