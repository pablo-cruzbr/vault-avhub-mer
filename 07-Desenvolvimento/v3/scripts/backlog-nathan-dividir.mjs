// Bloco 6: depois da conferência na develop, Backlog-Frente-Nathan passou de 25 KB. Os itens BL-075 a BL-081
// (proposta, pedido no Omie e comissão) vão, sem mudança, para Backlog-Frente-Nathan-Proposta-Omie-e-Comissao.
// Uso: node 07-Desenvolvimento/v3/scripts/backlog-nathan-dividir.mjs [--simular]   (idempotente)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const P = path.join(raiz, '07-Desenvolvimento', 'Partes');
const simular = process.argv.includes('--simular');
const NOVA = 'Backlog-Frente-Nathan-Proposta-Omie-e-Comissao';
const IDS = ['BL-075', 'BL-076', 'BL-077', 'BL-078', 'BL-079', 'BL-080', 'BL-081'];
const arqN = path.join(P, 'Backlog-Frente-Nathan.md');
if (fs.existsSync(path.join(P, NOVA + '.md'))) { console.log('já dividida'); process.exit(0); }
const lin = fs.readFileSync(arqN, 'utf8').split('\n');
const iCab = lin.findIndex((l) => l.startsWith('| ID'));
const cab = lin.slice(iCab, iCab + 2);
const mover = lin.filter((l) => IDS.some((id) => l.startsWith(`| ${id} |`)));
if (mover.length !== IDS.length) throw new Error(`achei ${mover.length} de ${IDS.length}`);
const fica = lin.filter((l) => !mover.includes(l));
const iFimTab = fica.findIndex((l, i) => i > iCab && !l.startsWith('|'));
fica.splice(iFimTab, 0, '', `Os itens da proposta ao pedido no Omie e da comissão (${IDS[0]} a ${IDS[IDS.length - 1]}) estão em [[${NOVA}]].`);
const fm = lin.slice(0, lin.indexOf('---', 1) + 1).join('\n').replace(/^criado: .*$/m, 'criado: 2026-11-05').replace(/^parte-de: .*$/m, 'parte-de: "[[Backlog-por-Frente]]"');
const nova = `${fm}

# Backlog por frente: Nathan, proposta ao pedido no Omie e comissão

**Em uma frase:** itens ${IDS[0]} a ${IDS[IDS.length - 1]} da frente Nathan (proposta, pedido no Omie, motor e telas da comissão), separados de [[Backlog-Frente-Nathan]] quando a conferência na \`develop\` (05/11/2026) fez a nota passar de 25 KB. As linhas foram movidas sem mudança.

**Onde estamos:** ← [[Backlog-por-Frente]] (resumo e índice) · [[Backlog-Frente-Nathan]] (o resto da frente)

## Frente Nathan: proposta, pedido no Omie e comissão

${[...cab, ...mover].join('\n')}
`;
const idx = path.join(raiz, '07-Desenvolvimento', 'Backlog-por-Frente.md');
let ti = fs.readFileSync(idx, 'utf8');
const a = '- [[Backlog-Frente-Nathan]]: Frente Nathan (front do av-hub, BFF e coordenação)';
if (!ti.includes(a)) throw new Error('linha do índice');
ti = ti.replace(a, `${a}\n- [[${NOVA}]]: Frente Nathan, itens ${IDS[0]} a ${IDS[IDS.length - 1]} (proposta, pedido no Omie e comissão)`);
console.log(`${simular ? '[simular] ' : ''}${mover.length} linhas; Nathan ${(Buffer.byteLength(fica.join('\n')) / 1024).toFixed(1)} KB; nova ${(Buffer.byteLength(nova) / 1024).toFixed(1)} KB`);
if (!simular) { fs.writeFileSync(arqN, fica.join('\n'), 'utf8'); fs.writeFileSync(path.join(P, NOVA + '.md'), nova, 'utf8'); fs.writeFileSync(idx, ti, 'utf8'); }
