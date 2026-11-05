// Bloco 3 (F5, decisão do Nathan de 05/11/2026): o commit da develop lido fica uma vez por nota, no frontmatter.
// Grava `develop-conferida: [...]` logo depois de `nos:` em cada nota de raia. Idempotente (troca a linha se existir).
// Uso: node 07-Desenvolvimento/v3/scripts/develop-conferida.mjs [--simular]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const simular = process.argv.includes('--simular');
const REPOS = ['api-acos-vital', 'av-hub', 'api-pcp', 'app-pcp', 'omie-elt-pipeline'];
const ref = (r) => { for (const x of ['origin/develop', 'origin/master']) { try { return [x, execFileSync('git', ['rev-parse', '--short', x], { cwd: path.join(raiz, '..', r), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()]; } catch {} } };
const linha = 'develop-conferida: [' + REPOS.map((r) => { const [x, h] = ref(r); return `${r} ${x === 'origin/develop' ? '' : 'master '}${h}`; }).join(', ') + ', em 2026-11-05]';
const F = path.join(raiz, '02-Fluxo-de-Atividades');
let n = 0;
for (const f of fs.readdirSync(F).filter((x) => /^(0[1-9]|1[0-5])-.*\.md$/.test(x))) {
  const p = path.join(F, f);
  const t = fs.readFileSync(p, 'utf8');
  const m = t.match(/^---\n([\s\S]*?)\n---\n/);
  let fm = m[1];
  fm = /^develop-conferida:.*$/m.test(fm) ? fm.replace(/^develop-conferida:.*$/m, linha) : fm.replace(/^(nos:.*)$/m, `$1\n${linha}`);
  const novo = `---\n${fm}\n---\n` + t.slice(m[0].length);
  if (novo !== t) { n++; if (!simular) fs.writeFileSync(p, novo, 'utf8'); }
}
console.log(linha);
console.log(`${simular ? 'SIMULAÇÃO — ' : ''}${n} notas`);
