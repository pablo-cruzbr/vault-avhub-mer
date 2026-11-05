// Validação do vault (seção 9 da instrução). Somente leitura.
// Uso: node _v3/scripts/validar.mjs [--simular]   (sem escrita; --simular aceito por padrão do projeto)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const IGNORAR = new Set(['.git', '.obsidian', 'node_modules']);

function listar(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORAR.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listar(p, out);
    else out.push(p);
  }
  return out;
}

const arquivos = listar(raiz);
const notas = arquivos.filter((f) => f.endsWith('.md'));
const rel = (f) => path.relative(raiz, f).split(path.sep).join('/');

// nomes resolvíveis: base sem extensão (notas) e nome com extensão (anexos)
const porNome = new Map();
for (const f of arquivos) {
  const base = path.basename(f);
  const chaves = [base, base.replace(/\.md$/, '')];
  for (const k of chaves) {
    if (!porNome.has(k)) porNome.set(k, []);
    porNome.get(k).push(f);
  }
}

function semCodigo(txt) {
  return txt.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

const quebrados = [];
const recebidos = new Map();
for (const f of notas) {
  const txt = semCodigo(fs.readFileSync(f, 'utf8'));
  for (const m of txt.matchAll(/!?\[\[([^\]\n]+)\]\]/g)) {
    let alvo = m[1].split('|')[0].split('#')[0].replace(/\\$/, '').trim();
    if (!alvo) continue; // link só de seção na mesma nota
    alvo = alvo.replace(/\.md$/, '');
    const nome = alvo.split('/').pop();
    const achou = porNome.get(nome) || porNome.get(nome + '.md');
    if (!achou) quebrados.push(`${rel(f)} -> [[${m[1]}]]`);
    else for (const a of achou) recebidos.set(a, (recebidos.get(a) || 0) + 1);
  }
}

const orfas = notas.filter((f) => !recebidos.has(f) && path.basename(f) !== 'CLAUDE.md' && !rel(f).startsWith('_v3/')).map(rel);

const crlf = [];
const corrompidos = [];
const grandes = [];
for (const f of notas) {
  const buf = fs.readFileSync(f);
  const txt = buf.toString('utf8');
  if (txt.includes('\r')) crlf.push(rel(f));
  // "Ã" sozinho é letra válida (AÇÃO); só conta quando seguido de byte de continuação (Ã§, Ã£...)
  if ((/Ã[\u0080-¿]|â€|�/.test(txt)) && !rel(f).startsWith('_v3/')) corrompidos.push(rel(f));
  if (buf.length > 25 * 1024) grandes.push(`${rel(f)} (${(buf.length / 1024).toFixed(1)} KB)`);
}

const contratosLinks = [];
for (const f of notas) {
  if (rel(f).startsWith('06-Contratos/')) continue;
  const txt = semCodigo(fs.readFileSync(f, 'utf8'));
  const n = [...txt.matchAll(/\[\[(?:LOG|SQL|API|CON|ATV)-\d+[^\]]*\]\]/g)].length;
  if (n) contratosLinks.push([rel(f), n]);
}

const secao = (t, l) => {
  console.log(`\n## ${t}: ${l.length}`);
  for (const x of l.slice(0, 40)) console.log(`- ${x}`);
  if (l.length > 40) console.log(`- ... (+${l.length - 40})`);
};

console.log(`# Validação do vault (${new Date().toISOString().slice(0, 10)})`);
console.log(`Notas: ${notas.length}  Arquivos: ${arquivos.length}`);
secao('Links quebrados', quebrados);
secao('Notas órfãs (ninguém aponta)', orfas);
secao('Arquivos com CRLF', crlf);
secao('Arquivos com caractere corrompido (Ã, â€, �)', corrompidos);
secao('Notas acima de 25 KB', grandes);
console.log(`\n## Links para contratos fora de 06-Contratos: ${contratosLinks.reduce((s, x) => s + x[1], 0)} em ${contratosLinks.length} notas`);
const idx = path.join(raiz, '06-Contratos', 'Contratos-da-v2.md');
if (fs.existsSync(idx)) { const ids = new Set([...fs.readFileSync(idx, 'utf8').matchAll(/^\| ((?:LOG|SQL|API|CON)-\d+[a-z]?) \|/gm)].map((m) => m[1])); console.log(`Índice Contratos-da-v2: ${ids.size} contratos distintos (esperado 92)`); }
