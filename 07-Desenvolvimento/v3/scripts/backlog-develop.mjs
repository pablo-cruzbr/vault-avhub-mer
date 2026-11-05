// Bloco 6: aplica nas notas Backlog-Frente-* a conferência dos itens BL na origin/develop (05/11/2026),
// feita item a item e gravada em 07-Desenvolvimento/v3/selos/Backlog-*-develop.md (colunas: BL | selo atual | selo pela develop |
// evidência na develop | o que mudou | a evidência antiga ainda vale?).
// - Selo: passa a ser o "selo pela develop".
// - Evidência: "develop 05/11: <nova>"; a antiga fica depois ("14/10: ...") só quando ainda vale.
// - O que falta: ganha "Conferido na develop em 05/11/2026: <o que mudou>" quando algo mudou. Nada é apagado
//   além da evidência antiga que deixou de valer (linha ou arquivo mudou).
// Uso: node 07-Desenvolvimento/v3/scripts/backlog-develop.mjs [--simular]   (idempotente: não reaplica linha já marcada)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const simular = process.argv.includes('--simular');
const celulas = (l) => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim());
const conf = new Map();
for (const f of ['Backlog-robert-develop.md', 'Backlog-gustavo-develop.md', 'Backlog-nathan-comercial-develop.md']) {
  for (const l of fs.readFileSync(path.join(raiz, '07-Desenvolvimento', 'v3', 'selos', f), 'utf8').split('\n')) {
    if (!l.startsWith('| BL-')) continue;
    const c = celulas(l);
    if (c.length < 6) throw new Error('linha com colunas a menos: ' + l.slice(0, 60));
    conf.set(c[0], { selo: c[2], evid: c[3], mudou: c[4], vale: c[5] });
  }
}
const SEM_MUDANCA = /^(nada|—|-|sem mudança|continua igual)/i;
let total = 0;
for (const n of ['Robert', 'Gustavo', 'Nathan', 'Comercial-e-Suprimentos']) {
  const arq = path.join(raiz, '07-Desenvolvimento', 'Partes', `Backlog-Frente-${n}.md`);
  const lin = fs.readFileSync(arq, 'utf8').split('\n');
  let mud = 0;
  for (let i = 0; i < lin.length; i++) {
    const m = lin[i].match(/^\| (BL-\d{3}) \|/);
    if (!m || !conf.has(m[1])) continue;
    const c = celulas(lin[i]);
    if (c.length < 5) throw new Error(`${n} ${m[1]}: ${c.length} colunas`);
    const iS = c.length - 2, iE = c.length - 1; // Comercial não tem a coluna Contrato
    if (c[iE].startsWith('**develop 05/11:**')) continue; // já aplicado
    const k = conf.get(m[1]);
    const antiga = c[iE];
    c[iS] = k.selo;
    c[iE] = `**develop 05/11:** ${k.evid}` + (/^sim\b/i.test(k.vale) && antiga && antiga !== '—' ? ` · *14/10:* ${antiga}` : '');
    if (!SEM_MUDANCA.test(k.mudou)) c[2] = `${c[2]} *Conferido na develop em 05/11/2026:* ${k.mudou}`;
    lin[i] = `| ${c.join(' | ')} |`;
    mud++; conf.delete(m[1]);
  }
  total += mud;
  console.log(`${simular ? '[simular] ' : ''}Backlog-Frente-${n}: ${mud} itens`);
  if (!simular && mud) fs.writeFileSync(arq, lin.join('\n'), 'utf8');
}
console.log(`total ${total}; sem linha na nota: ${[...conf.keys()].join(', ') || 'nenhum'}`);
