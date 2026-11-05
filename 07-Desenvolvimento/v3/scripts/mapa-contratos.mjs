// Bloco 1: nas fichas do mapa, o campo "arquivo" que citava um contrato da v2 passa a citar o índice.
// "06-Contratos/Entregues, LOG-35-Compras-..." -> "06-Contratos/Contratos-da-v2, LOG-35"
// Uso: node 07-Desenvolvimento/v3/scripts/mapa-contratos.mjs [--simular]   (idempotente)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const dir = path.join(raiz, '09-Diagramas', 'mapa', 'fichas');
const simular = process.argv.includes('--simular');
const re = /("arquivo":\s*")06-Contratos(?:\/(?:Ativos|Entregues|Arquivados|Consultas))?,\s*(?:nota\s+)?((?:LOG|SQL|API|CON)-\d+[a-z]?)[^"]*"/g;
let n = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const p = path.join(dir, f);
  const t = fs.readFileSync(p, 'utf8');
  const novo = t.replace(re, (m, a, id) => { const r = `${a}06-Contratos/Contratos-da-v2, ${id}"`; if (r !== m) { n++; console.log(`${f}: ${m} -> ${r}`); } return r; });
  if (!simular && novo !== t) fs.writeFileSync(p, novo, 'utf8');
}
console.log(`${simular ? 'SIMULAÇÃO — ' : ''}${n} campos alterados`);
