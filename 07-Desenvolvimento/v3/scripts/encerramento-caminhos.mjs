// Bloco 9: depois do `git mv _v3 07-Desenvolvimento/v3`, ajusta os caminhos.
// - scripts desta pasta: a raiz do vault fica três pastas acima; '_v3' vira 07-Desenvolvimento/v3;
// - notas e scripts/ da raiz: as citações `_v3/...` passam a `07-Desenvolvimento/v3/...`.
// Os históricos dentro de 07-Desenvolvimento/v3 (PROGRESSO, INSTRUCAO, validações, fatos) não mudam: contam o que aconteceu.
// Uso: node 07-Desenvolvimento/v3/scripts/encerramento-caminhos.mjs [--simular]   (idempotente)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '..', '..', '..');
const simular = process.argv.includes('--simular');
const NOVO = '07-Desenvolvimento/v3';
let mud = 0;
function trocar(arq, fn) {
  const t = fs.readFileSync(arq, 'utf8');
  const n = fn(t);
  if (n !== t) { mud++; console.log(`${simular ? '[simular] ' : ''}${path.relative(raiz, arq)}`); if (!simular) fs.writeFileSync(arq, n, 'utf8'); }
}
// 1. scripts desta pasta
for (const f of fs.readdirSync(aqui).filter((x) => x.endsWith('.mjs') && x !== 'encerramento-caminhos.mjs')) {
  trocar(path.join(aqui, f), (t) => t
    .replace(/fileURLToPath\(import\.meta\.url\)\), '\.\.', '\.\.'\)/g, "fileURLToPath(import.meta.url)), '..', '..', '..')")
    .replace(/path\.join\(raiz, '_v3'/g, "path.join(raiz, '07-Desenvolvimento', 'v3'")
    .replace(/'node_modules', '_v3'\]/g, "'node_modules', '_v3', 'v3']")
    .replace(/(?<![\w/])_v3\//g, `${NOVO}/`));
}
// 2. notas e scripts da raiz que citam _v3
const ALVOS = [
  '00-Inicio/Guia-de-Leitura-do-Vault-e-dos-Sistemas.md', '00-Inicio/Manual-de-Manutencao-do-Vault.md', '00-Inicio/Mapa-v2-para-v3.md',
  '00-Inicio/Regras-do-Vault.md', '01-Projeto/Tipos-de-ID.md', '06-Contratos/Contratos-da-v2.md',
  '06-Contratos/Partes/Contratos-da-v2-Lista-Completa.md', '07-Desenvolvimento/Ultima-Atualizacao-do-Vault.md',
  'scripts/validar.mjs', 'scripts/fatos.mjs', 'scripts/dividir.mjs',
];
for (const r of ALVOS) {
  trocar(path.join(raiz, r), (t) => {
    if (r === 'scripts/validar.mjs') return t; // o validador já trata as duas pastas; os comentários contam o histórico
    let n = t.replace(/(?<![\w/])_v3\//g, `${NOVO}/`).replace(/\(fora de _v3\)/g, `(fora de ${NOVO})`);
    if (r === 'scripts/fatos.mjs') n = n.replace(`As listas da v3 estão em ${NOVO}/fatos e ${NOVO}/fatos/bloco5\n//   (depois do Bloco 9, em 07-Desenvolvimento/v3/fatos).`, `As listas da v3 estão em ${NOVO}/fatos (e nas subpastas bloco5,\n//   bloco6, bloco8 e dump0411); até o Bloco 9 a pasta era \`_v3\` (na raiz).`);
    return n;
  });
}
console.log(`${mud} arquivos`);
