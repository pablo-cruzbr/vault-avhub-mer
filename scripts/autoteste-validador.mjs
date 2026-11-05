// Autoteste do validador: prova que cada checagem acusa o que deve, em vez de dar verde por não olhar nada.
// Motivo: até 05/11/2026 a checagem de selos não examinava nenhuma nota no Windows e sempre dava 0.
//
// Como funciona: copia o vault para uma pasta temporária (sem .git), confere que a cópia está verde,
// quebra de propósito um link, um selo ✅, o tamanho de uma nota e a quebra de linha (CRLF),
// roda o validador DA CÓPIA e confere se cada problema aparece. O vault de verdade não é tocado.
//
// Uso: node scripts/autoteste-validador.mjs     (sai com código 1 se alguma checagem falhar)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IGNORAR = new Set(['.git', 'node_modules']);
const RAIA = path.join('02-Fluxo-de-Atividades', '01-Proposta-de-Venda.md');
const OUTRA = path.join('00-Inicio', 'Home.md');

function validar(dir) {
  return execFileSync(process.execPath, [path.join(dir, 'scripts', 'validar.mjs')], { cwd: dir, encoding: 'utf8', maxBuffer: 64 << 20 });
}
function contar(saida, rotulo) {
  const l = saida.split('\n').find((x) => x.startsWith(`## ${rotulo}`));
  if (!l) throw new Error(`a saída do validador não tem a seção "${rotulo}"`);
  return Number(l.match(/:\s*(\d+)/)[1]);
}
function notasDeRaia(saida) {
  const m = saida.match(/Notas de raia conferidas nos selos: (\d+)/);
  return m ? Number(m[1]) : 0;
}

const CHECAGENS = [
  ['Links quebrados', 'link para nota que não existe', (d) => fs.appendFileSync(path.join(d, RAIA), '\n[[Nota-Que-Nao-Existe-Autoteste]]\n')],
  ['Selos ✅ sem citação', 'selo ✅ sem repositório nem arquivo', (d) => fs.appendFileSync(path.join(d, RAIA), '\n- ✅ Selo do autoteste sem origem.\n')],
  ['Notas acima de 25 KB', 'nota com mais de 25 KB', (d) => fs.appendFileSync(path.join(d, OUTRA), '\n' + 'Texto de enchimento do autoteste. '.repeat(900) + '\n')],
  ['Arquivos com CRLF', 'quebra de linha do Windows', (d) => fs.appendFileSync(path.join(d, OUTRA), 'linha com CRLF do autoteste\r\n')],
];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'autoteste-vault-'));
let falhas = 0;
try {
  fs.cpSync(raiz, tmp, { recursive: true, filter: (src) => !IGNORAR.has(path.basename(src)) });

  // 1) a cópia limpa tem de estar verde nessas checagens, e a de selos tem de olhar notas
  const antes = validar(tmp);
  const base = Object.fromEntries(CHECAGENS.map(([r]) => [r, contar(antes, r)]));
  const nRaias = notasDeRaia(antes);
  console.log(`Cópia limpa: ${CHECAGENS.map(([r]) => `${r} = ${base[r]}`).join(' · ')} · notas de raia nos selos = ${nRaias}`);
  if (nRaias === 0) { console.log('FALHA: a checagem de selos não examinou nenhuma nota'); falhas++; }

  // 2) estraga a cópia e confere que cada checagem sobe
  for (const [, , estragar] of CHECAGENS) estragar(tmp);
  const depois = validar(tmp);
  for (const [rotulo, oque] of CHECAGENS) {
    const n = contar(depois, rotulo);
    const ok = n > base[rotulo];
    if (!ok) falhas++;
    console.log(`${ok ? 'ok   ' : 'FALHA'} ${rotulo}: ${base[rotulo]} → ${n} (${oque})`);
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
console.log(falhas ? `\n${falhas} checagem(ns) do validador NÃO acusaram o problema.` : '\nAutoteste ok: o validador acusou todos os problemas plantados.');
process.exitCode = falhas ? 1 : 0;
