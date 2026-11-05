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
  // _v3/ é material de trabalho (fotos de fatos); fica fora do limite de tamanho
  if (buf.length > 25 * 1024 && !rel(f).startsWith('_v3/')) grandes.push(`${rel(f)} (${(buf.length / 1024).toFixed(1)} KB)`);
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

// Nomes antigos do mapa (a partir do Bloco 2): em [[links]] e em texto entre crases.
const csv = path.join(raiz, '_v3', 'mapa-renomeacao.csv');
if (fs.existsSync(csv)) {
  const EXC = ['Mapa-v2-para-v3', 'Mapa-v1-para-v2', 'Contratos-da-v2', 'Analise-de-Organizacao-do-Vault', 'Registro-de-Decisoes'];
  const antigos = fs.readFileSync(csv, 'utf8').split('\n').slice(1)
    .map((l) => l.split(',')[0]).filter((a) => a && a.endsWith('.md') && !a.includes('*'))
    .map((a) => path.basename(a, '.md'))
    .filter((n) => !notas.some((f) => path.basename(f, '.md') === n)); // nome antigo que ainda existe como nota não conta
  const re = new RegExp(`(?<![A-Za-z0-9-])(${antigos.join('|')})(?![A-Za-z0-9-])`);
  const achados = [];
  for (const f of notas) {
    const r = rel(f);
    if (r.startsWith('_v3/') || EXC.includes(path.basename(f, '.md'))) continue;
    const txt = fs.readFileSync(f, 'utf8');
    for (const [i, l] of txt.split('\n').entries()) {
      const trechos = [...l.matchAll(/\[\[[^\]\n]+?\]\]/g), ...l.replace(/\[\[[^\]\n]+?\]\]/g, (m) => 'x'.repeat(m.length)).matchAll(/`[^`]*`/g)]
        .map((m) => l.slice(m.index, m.index + m[0].length));
      for (const t of trechos) if (re.test(t)) achados.push(`${r}:${i + 1} ${t.slice(0, 90)}`);
    }
  }
  secao('Nomes antigos em links ou crases (fora das exceções)', achados);
}

// Dono dos nós (a partir do Bloco 3): cada nó do mermaid aparece no `nos:` de exatamente uma nota.
const mestre = path.join(raiz, '02-Fluxo-de-Atividades', '00-Fluxo-Mestre-0b.md');
if (fs.existsSync(mestre)) {
  const t = fs.readFileSync(mestre, 'utf8');
  const merm = (t.match(/```mermaid\n([\s\S]*?)```/) || [, ''])[1];
  const nosMerm = new Set([...merm.matchAll(/^\s*([A-Z][A-Z0-9_]*)\s*[\[\(\{]/gm)].map((m) => m[1].replace(/^V0(\d)$/, 'V0.$1')));
  const donos = new Map();
  for (const f of notas) {
    const fm = (fs.readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
    const l = fm.match(/^nos:\s*\[(.*)\]\s*$/m);
    if (!l) continue;
    for (const n of l[1].split(',').map((s) => s.trim()).filter(Boolean)) {
      if (!donos.has(n)) donos.set(n, []);
      donos.get(n).push(path.basename(f, '.md'));
    }
  }
  if (donos.size) {
    const prob = [];
    for (const n of nosMerm) {
      const d = donos.get(n) || [];
      if (d.length !== 1) prob.push(`${n}: ${d.length ? d.join(', ') : 'sem dono'}`);
    }
    for (const n of donos.keys()) if (!nosMerm.has(n)) prob.push(`${n}: no nos: mas não no mermaid (${donos.get(n).join(', ')})`);
    console.log(`\nNós do mermaid: ${nosMerm.size}`);
    secao('Nós sem dono único', prob);
  }
}

// Mapa HTML: todo caminho de nota citado no build.mjs existe.
const build = path.join(raiz, '09-Diagramas', 'mapa', 'build.mjs');
if (fs.existsSync(build)) {
  const b = fs.readFileSync(build, 'utf8');
  const R = '02-Fluxo-de-Atividades/';
  const caminhos = [...b.matchAll(/R \+ "([^"]+)"/g)].map((m) => R + m[1])
    .concat([...b.matchAll(/"(\d\d-[A-Za-z]+\/[^"]+)"/g)].map((m) => m[1]));
  secao('Caminhos do build.mjs que não existem', caminhos.filter((c) => !fs.existsSync(path.join(raiz, c + '.md'))));
}

// Selos (a partir do Bloco 3, F5): nas raias, todo ✅ cita repositório ou arquivo (ou o dump, ou o Omie),
// e a nota traz `develop-conferida` no frontmatter com o commit lido. Nenhum ✅ apoiado só na main.
{
  const SEG = String.raw`(?:[\w.\-\[\]]|\([\w-]+\))+`;
  const ARQ = new RegExp(String.raw`${SEG}(?:/${SEG})*\.(?:tsx|ts|json|mjs|js|prisma|sql)(?![\w])`);
  const CIT = /\b(api-acos-vital|av-hub|api-pcp|app-pcp|omie-elt-pipeline|api-comercial|Dump|dump|Omie|Estudo-Omie-API)\b|(service|controller|helpers|route|dto)?:\d+(-\d+)?\b/;
  const prob = [];
  // Bloco 5: as partes das raias (Partes/NN-...) também
  for (const f of notas.filter((x) => /02-Fluxo-de-Atividades[\/](Partes[\/])?(0[1-9]|1[0-5])-/.test(x))) {
    const t = fs.readFileSync(f, 'utf8');
    if (!/^develop-conferida:/m.test((t.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1])) prob.push(`${rel(f)}: sem develop-conferida`);
    let cod = false;
    t.split('\n').forEach((l, i) => {
      if (/^\s*```/.test(l)) { cod = !cod; return; }
      if (cod || !l.includes('✅')) return;
      if (!ARQ.test(l) && !CIT.test(l)) prob.push(`${rel(f)}:${i + 1} ✅ sem citação`);
      if (/✅[^|]*\b(só na|apenas na|na) `?main`?\b/.test(l) && !/develop/.test(l)) prob.push(`${rel(f)}:${i + 1} ✅ apoiado na main`);
    });
  }
  secao('Selos ✅ sem citação ou sem develop-conferida', prob);
}
