// Blocos 3, 5 e 8: lista de fatos de uma nota, salva ANTES de mexer nela, e conferência DEPOIS.
//
//   node _v3/scripts/fatos.mjs extrair <caminho/da/nota.md> [--simular]
//       grava _v3/fatos/<nota>.md com: IDs (decisões, BL, PS, contratos), commits, arquivo:linha,
//       rotas, identificadores de código entre crases, datas, números com unidade, nós e as linhas
//       de regra (linhas de tabela e de lista). Não sobrescreve um arquivo de fatos que já existe
//       (a lista é a foto de ANTES); use --refazer para forçar.
//   node _v3/scripts/fatos.mjs conferir [nota] [--pasta=<sub>]
//       para cada lista em _v3/fatos/, confere se cada fato aparece em alguma nota do vault (fora de _v3).
//       Fatos "token" precisam aparecer literalmente. Linhas de regra são conferidas pelo texto sem
//       selos e sem formatação; as que não batem vão para "conferir à mão" (o selo pode mudar pelo F5,
//       o fato não pode sumir).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
// --pasta=<sub> grava e confere em _v3/fatos/<sub>/ (Bloco 5: _v3/fatos/bloco5, porque já há fotos do Bloco 3 com o mesmo nome)
const pastaArg = (process.argv.find((a) => a.startsWith('--pasta=')) || '').slice(8);
const dirFatos = path.join(raiz, '_v3', 'fatos', pastaArg);
const [modo, alvo] = process.argv.slice(2).filter((a) => !a.startsWith('--')); // flags não são nome de nota
const simular = process.argv.includes('--simular');
const refazer = process.argv.includes('--refazer');

const PADROES = {
  'decisões e IDs': /\b(?:N\d{1,2}-\d{1,3}|DEC-\d+|EC-\d+|PS-\d{3}|BL-\d{3}|INT-\d+|D\d+ do \d{3})\b/g,
  contratos: /\b(?:LOG|SQL|API|CON)-\d{2,3}[a-z]?\b/g,
  commits: /`([0-9a-f]{7,10})`/g,
  'arquivo:linha': /[\w./-]+\.(?:ts|tsx|js|mjs|prisma|sql|json|md)(?::\d+(?:-\d+)?)?(?:,\s*`?:\d+(?:-\d+)?`?)*/g,
  rotas: /\b(?:GET|POST|PATCH|PUT|DELETE)\s+\/[^\s`|),]+/g,
  datas: /\b\d{2}\/\d{2}(?:\/\d{4})?\b/g,
  'código entre crases': /`([^`\n]{2,80})`/g,
};

function semCodigoMermaid(t) { return t.replace(/```mermaid[\s\S]*?```/g, ''); }
function normal(s) {
  return s.replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, '$2').replace(/\\\|/g, '|')
    .replace(/[✅🟡🔴❓📝⚠️*_`>]/gu, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function extrair(arq) {
  const txt = fs.readFileSync(arq, 'utf8');
  const corpo = semCodigoMermaid(txt.replace(/^---\n[\s\S]*?\n---\n/, ''));
  const grupos = {};
  for (const [nome, re] of Object.entries(PADROES)) {
    const s = new Set();
    for (const m of corpo.matchAll(re)) s.add((m[1] ?? m[0]).trim());
    grupos[nome] = [...s].sort();
  }
  const merm = (txt.match(/```mermaid\n([\s\S]*?)```/) || [, ''])[1];
  const regras = corpo.split('\n')
    .filter((l) => /^\s*(\||[-*] |\d+\. )/.test(l) && !/^\s*\|[\s:|-]+\|\s*$/.test(l) && normal(l).length > 25)
    .map((l) => l.trim());
  return { grupos, regras, mermaid: merm.trim() };
}

function gravar(arq) {
  const nome = path.basename(arq, '.md');
  const destino = path.join(dirFatos, nome + '.md');
  if (fs.existsSync(destino) && !refazer) { console.log(`já existe ${path.relative(raiz, destino)} (foto de antes); nada muda`); return; }
  const { grupos, regras, mermaid } = extrair(arq);
  const rel = path.relative(raiz, arq).split(path.sep).join('/');
  let out = `# Fatos de ${nome}\n\nFoto tirada em ${new Date().toISOString().slice(0, 10)} de \`${rel}\`, antes de mexer na nota.\nGerada por \`node _v3/scripts/fatos.mjs extrair\`. Conferência: \`node _v3/scripts/fatos.mjs conferir ${nome}\`.\n`;
  for (const [g, l] of Object.entries(grupos)) {
    out += `\n## ${g} (${l.length})\n\n`;
    for (const x of l) out += `- ${'`'}${x.replace(/`/g, '')}${'`'}\n`;
  }
  out += `\n## regras e linhas de conteúdo (${regras.length})\n\n`;
  for (const r of regras) out += `- ${r.replace(/^\s*[-*] |^\s*\d+\. /, '')}\n`;
  if (mermaid) out += `\n## subfluxo mermaid\n\n\`\`\`text\n${mermaid}\n\`\`\`\n`;
  if (simular) { console.log(`[simular] gravaria ${path.relative(raiz, destino)}: ${Object.values(grupos).reduce((s, l) => s + l.length, 0)} fatos, ${regras.length} linhas`); return; }
  fs.mkdirSync(dirFatos, { recursive: true });
  fs.writeFileSync(destino, out, 'utf8');
  console.log(`gravado ${path.relative(raiz, destino)}`);
}

function lerLista(f) {
  const t = fs.readFileSync(f, 'utf8');
  const tokens = [], regras = [];
  let secao = '';
  for (const l of t.split('\n')) {
    const h = l.match(/^## (.+?) \(\d+\)$/);
    if (h) { secao = h[1]; continue; }
    if (/^## subfluxo/.test(l)) { secao = 'mermaid'; continue; }
    if (!l.startsWith('- ')) continue;
    if (secao.startsWith('regras')) regras.push(l.slice(2));
    else if (secao && secao !== 'mermaid') tokens.push([secao, l.slice(2).replace(/^`|`$/g, '')]);
  }
  return { tokens, regras };
}

function corpus() {
  const IGN = new Set(['.git', '.obsidian', 'node_modules', '_v3']);
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (IGN.has(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else if (e.name.endsWith('.md')) out.push(fs.readFileSync(p, 'utf8'));
    }
  })(raiz);
  const bruto = out.join('\n');
  return { bruto, normal: normal(bruto) };
}

function conferir(so) {
  if (!fs.existsSync(dirFatos)) { console.log('sem listas de fatos'); return; }
  const { bruto, normal: norm } = corpus();
  // substituições registradas (o fato foi atualizado, não sumiu): antigo → novo, com o motivo
  const subst = new Map();
  const ps = path.join(dirFatos, 'substituicoes.tsv');
  if (fs.existsSync(ps)) for (const l of fs.readFileSync(ps, 'utf8').split('\n').slice(1).filter(Boolean)) {
    const [a, n] = l.split('\t');
    if (!subst.has(a)) subst.set(a, []);
    subst.get(a).push(n);
  }
  const presente = (t) => bruto.includes(t) || (subst.get(t) || []).some((n) => bruto.includes(n))
    || [...subst].some(([a, ns]) => t.includes(a) && ns.some((n) => bruto.includes(t.replace(a, n))));
  let falhas = 0;
  for (const f of fs.readdirSync(dirFatos).filter((x) => x.endsWith('.md'))) {
    if (so && path.basename(f, '.md') !== so) continue;
    const { tokens, regras } = lerLista(path.join(dirFatos, f));
    const faltam = tokens.filter(([, t]) => !presente(t));
    const regrasFaltam = regras.filter((r) => !norm.includes(normal(r)));
    falhas += faltam.length;
    console.log(`\n## ${f}: ${tokens.length - faltam.length}/${tokens.length} fatos; ${regras.length - regrasFaltam.length}/${regras.length} linhas iguais`);
    for (const [g, t] of faltam) console.log(`- FALTA (${g}): ${t}`);
    for (const r of regrasFaltam) console.log(`- conferir à mão: ${r.slice(0, 160)}`);
  }
  console.log(`\nTotal de fatos que sumiram: ${falhas}`);
  process.exitCode = falhas ? 1 : 0;
}

if (modo === 'extrair' && alvo) gravar(path.resolve(raiz, alvo));
else if (modo === 'conferir') conferir(alvo);
else console.log('uso: fatos.mjs extrair <nota.md> [--simular|--refazer] | conferir [nota]');
