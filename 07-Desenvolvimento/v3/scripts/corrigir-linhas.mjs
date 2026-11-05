// Bloco 3: corrige números de linha de citações `arquivo:linha` que se deslocaram na develop.
// Para cada citação de uma linha da nota que também cita identificadores de código (`nomeDaFuncao`),
// se nenhum identificador aparece perto da linha citada (±30), procura a ocorrência do identificador mais
// próxima da linha antiga e desloca o intervalo inteiro pela mesma diferença. Só troca números; o selo não muda.
// Uso: node 07-Desenvolvimento/v3/scripts/corrigir-linhas.mjs <nota> [--simular]   (idempotente: depois de corrigido, nada casa)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SIS = path.resolve(raiz, '..');
const REPOS = ['api-acos-vital', 'av-hub', 'api-pcp', 'app-pcp', 'omie-elt-pipeline'];
const [, , nota] = process.argv;
const simular = process.argv.includes('--simular');
const git = (r, ...a) => execFileSync('git', a, { cwd: path.join(SIS, r), encoding: 'utf8', maxBuffer: 256 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
const ref = (r) => { for (const x of ['origin/develop', 'origin/master']) { try { git(r, 'rev-parse', x); return x; } catch {} } };
const arv = {}; const tree = (r) => (arv[r] ||= git(r, 'ls-tree', '-r', '--name-only', ref(r)).split('\n'));
const cache = {}; const conteudo = (r, f) => (cache[r + f] ||= git(r, 'show', `${ref(r)}:${f}`).split('\n'));
function resolver(cit) {
  let c = cit.replace(/^\.?\//, '').replace(/^.*\.\.\.\//, '');
  for (const r of REPOS.concat(['api-comercial'])) if (c.startsWith(r + '/')) c = c.slice(r.length + 1);
  const out = [];
  for (const r of REPOS) for (const f of tree(r)) if (c.includes('/') ? f.endsWith(c) : path.posix.basename(f) === c) out.push([r, f]);
  return out;
}
const SEG = String.raw`(?:[\w.\-\[\]]|\([\w-]+\))+`;
const RE = new RegExp(String.raw`(${SEG}(?:/${SEG})*\.(?:tsx|ts|json|mjs|js|prisma|sql))(?![\w]):(\d+)(?:-(\d+))?`, 'g');
// citações conferidas à mão em 05/11/2026 (o identificador mais próximo levava a um comentário):
// consumirReservasDaParcial começa na linha 317 de api-pcp src/estoque/operacao/estoque-operacao.helpers.ts (befd973)
const CONFERIDAS_A_MAO = new Set(['estoque-operacao.helpers.ts:317-389', 'estoque-operacao.helpers.ts:317-393']);
const arq = path.join(raiz, '02-Fluxo-de-Atividades', nota + '.md');
const ls = fs.readFileSync(arq, 'utf8').split('\n');
let emCod = false, n = 0;
for (let i = 0; i < ls.length; i++) {
  const l = ls[i];
  if (/^\s*```/.test(l)) { emCod = !emCod; continue; }
  if (emCod) continue;
  // só nomes de código com cara de função ou tipo (camelCase ou PascalCase), não palavras nem enums
  const idsPos = [...l.matchAll(/`([A-Za-z_]\w{3,})(?:\(\))?`/g)].filter((m) => /[a-z][A-Z]/.test(m[1])).map((m) => [m[1], m.index]);
  if (!idsPos.length) continue;
  ls[i] = l.replace(RE, (m, cit, a0, b0, pos) => {
    if (CONFERIDAS_A_MAO.has(m)) return m;
    // o identificador escrito mais perto da citação (antes dela vale mais), até 160 caracteres
    // mesma frase (sem ". " entre o identificador e a citação); depois dela, só até 40 caracteres; nunca o nome do próprio arquivo
    const proprio = path.posix.basename(cit).replace(/\.\w+$/, '');
    const ids = idsPos.filter(([id]) => id !== proprio)
      .map(([id, p]) => [id, p < pos ? pos - p : (p - pos) * 4, p < pos ? l.slice(p, pos) : l.slice(pos, p)])
      .filter(([, d, entre]) => d <= 160 && !/\. [A-Z]/.test(entre))
      .sort((x, y) => x[1] - y[1]).map(([id]) => id).slice(0, 1);
    if (!ids.length) return m;
    const ach = resolver(cit);
    if (ach.length !== 1) return m;
    const txt = conteudo(...ach[0]);
    const [a, b] = [Number(a0), Number(b0 || a0)];
    const perto = (id) => txt.slice(Math.max(0, a - 31), b + 30).some((x) => x.includes(id));
    const cand = ids.filter((id) => txt.some((x) => x.includes(id)));
    if (!cand.length || cand.some(perto)) return m;
    // ocorrência mais próxima da linha antiga, preferindo definição (id seguido de "(" ou ":" ou "=")
    let melhor = null;
    for (const id of cand) txt.forEach((x, k) => {
      if (!x.includes(id)) return;
      const def = new RegExp(`^\\s*(export\\s+)?(private\\s+|public\\s+)?(async\\s+)?(function\\s+)?${id}\\s*\\(|(function|class|enum|model)\\s+${id}\\b`).test(x) ? 0 : 1;
      const d = Math.abs(k + 1 - a);
      if (!melhor || def < melhor.def || (def === melhor.def && d < melhor.d)) melhor = { id, k: k + 1, d, def };
    });
    const delta = melhor.k - a;
    const novo = `${cit}:${a + delta}${b0 ? '-' + (b + delta) : ''}`;
    n++;
    console.log(`linha ${i + 1}: ${m} → ${novo}  (${ach[0][0]}, \`${melhor.id}\` na linha ${melhor.k}: ${txt[melhor.k - 1].trim().slice(0, 90)})`);
    return novo;
  });
}
if (!simular && n) fs.writeFileSync(arq, ls.join('\n'), 'utf8');
console.log(`${simular ? 'SIMULAÇÃO — ' : ''}${nota}: ${n} citações corrigidas`);
