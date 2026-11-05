// Bloco 3: confere, para uma nota de raia, as citações de código contra a origin/develop dos sistemas (F5).
// Só lê os repositórios dos sistemas (git ls-tree / git show), nunca troca de branch.
//   node _v3/scripts/selos.mjs relatorio <nota>   → _v3/selos/<nota>.md: cada arquivo citado, em que repositório
//                                                    está na develop, se a linha citada ainda existe, e os ✅ sem citação
//   node _v3/scripts/selos.mjs commits             → commit de origin/develop (ou master) de cada sistema
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const RAIZ_SIS = path.resolve(raiz, '..');
export const REPOS = ['api-acos-vital', 'av-hub', 'api-pcp', 'app-pcp', 'omie-elt-pipeline'];
const git = (repo, ...a) => execFileSync('git', a, { cwd: path.join(RAIZ_SIS, repo), encoding: 'utf8', maxBuffer: 256 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
export function base(repo) {
  for (const r of ['origin/develop', 'origin/master', 'origin/main']) {
    try { return { ref: r, hash: git(repo, 'rev-parse', '--short', r).trim() }; } catch {}
  }
  return null;
}
const cacheArvore = {};
function arvore(repo) {
  if (!cacheArvore[repo]) cacheArvore[repo] = git(repo, 'ls-tree', '-r', '--name-only', base(repo).ref).split('\n').filter(Boolean);
  return cacheArvore[repo];
}
const cacheLinhas = {};
function linhas(repo, arq) {
  const k = repo + ':' + arq;
  if (!(k in cacheLinhas)) cacheLinhas[k] = git(repo, 'show', `${base(repo).ref}:${arq}`).split('\n');
  return cacheLinhas[k];
}
export function resolver(cit, dica) {
  // "app-pcp/.../movimentacoes/acoes.ts" → casa pelo sufixo depois do "..."; prefixo de repositório sai
  let limpo = cit.replace(/^\.?\//, '').replace(/^.*\.\.\.\//, '');
  for (const r of REPOS.concat(['api-comercial'])) if (limpo.startsWith(r + '/')) limpo = limpo.slice(r.length + 1);
  const achados = [];
  for (const repo of REPOS) {
    if (dica && repo !== dica) continue;
    for (const f of arvore(repo)) {
      if (limpo.includes('/') ? f.endsWith(limpo) || f.endsWith(limpo.replace(/^[^/]+\//, '')) : path.posix.basename(f) === limpo) achados.push({ repo, arq: f });
    }
  }
  return achados;
}

// segmento de caminho: letras, ., -, [id] e grupos como (protected); extensão mais longa primeiro (tsx antes de ts)
const SEG = String.raw`(?:[\w.\-\[\]]|\([\w-]+\))+`;
const RE_ARQ = new RegExp(String.raw`(${SEG}(?:/${SEG})*\.(?:tsx|ts|json|mjs|js|prisma|sql))(?![\w])(?::(\d+)(?:-(\d+))?)?`, 'g');
// conta como citação: nome do repositório (não "MES"/"HUB" soltos), o dump do banco (fonte 2), o Omie (sistema
// externo, ver Estudo-Omie-API) e referência curta de linha cujo arquivo está no título da seção (`service:224`, `:53-60`)
const RE_REPO = new RegExp(`\\b(${REPOS.join('|')}|api-comercial|Dump|dump|Omie|Estudo-Omie-API)\\b|(service|controller|helpers|route|dto)?:\\d+(-\\d+)?\\b`);

function relatorio(nota) {
  const arqNota = [path.join(raiz, '02-Fluxo-de-Atividades', nota + '.md')].find(fs.existsSync);
  if (!arqNota) throw new Error('nota não achada: ' + nota);
  const t = fs.readFileSync(arqNota, 'utf8');
  const ls = t.split('\n');
  const cits = new Map();
  let emCod = false;
  ls.forEach((l, i) => {
    if (/^\s*```/.test(l)) { emCod = !emCod; return; }
    if (emCod) return;
    const dica = REPOS.find((r) => l.includes(r + '/')) || null;
    for (const m of l.matchAll(RE_ARQ)) {
      const k = m[1];
      if (!cits.has(k)) cits.set(k, { linhasNota: [], refs: [], dica });
      cits.get(k).linhasNota.push(i + 1);
      if (m[2]) cits.get(k).refs.push([Number(m[2]), Number(m[3] || m[2])]);
    }
  });
  const out = [`# Selos de ${nota} contra a develop`, '', `Gerado em ${new Date().toISOString().slice(0, 10)} por \`node _v3/scripts/selos.mjs relatorio ${nota}\`.`, '',
    'Base: ' + REPOS.map((r) => `${r} \`${base(r).ref}\` ${base(r).hash}`).join(' · '), '', '## Arquivos citados', '',
    '| Arquivo citado | Linhas da nota | Repositório e caminho na develop | Linhas citadas | Situação |', '|---|---|---|---|---|'];
  let problemas = 0;
  for (const [k, v] of [...cits].sort()) {
    let achados = resolver(k, null);
    if (achados.length > 1 && v.dica) achados = achados.filter((a) => a.repo === v.dica).length ? achados.filter((a) => a.repo === v.dica) : achados;
    let sit;
    if (!achados.length) { sit = '🔴 não existe na develop'; problemas++; }
    else if (achados.length > 3) sit = `ambíguo (${achados.length} arquivos)`;
    else {
      const tam = Math.max(...achados.map((a) => linhas(a.repo, a.arq).length));
      const fora = v.refs.filter(([, b]) => b > tam);
      sit = fora.length ? (problemas++, `🟡 linha ${fora.map((x) => x.join('-')).join(', ')} passa do fim (${tam} linhas)`) : `ok (${tam} linhas)`;
    }
    out.push(`| \`${k}\` | ${[...new Set(v.linhasNota)].join(', ')} | ${achados.slice(0, 3).map((a) => `${a.repo}: \`${a.arq}\``).join('<br>') || '—'} | ${v.refs.map((x) => x.join('-')).join(', ') || '—'} | ${sit} |`);
  }
  const semCit = [];
  emCod = false;
  ls.forEach((l, i) => {
    if (/^\s*```/.test(l)) { emCod = !emCod; return; }
    if (emCod || !l.includes('✅')) return;
    RE_ARQ.lastIndex = 0;
    const temArq = RE_ARQ.test(l);
    const temRepo = RE_REPO.test(l);
    if (!temArq && !temRepo) semCit.push(`- linha ${i + 1}: ${l.trim().slice(0, 160)}`);
  });
  out.push('', `## ✅ sem repositório nem arquivo citado (${semCit.length})`, '', ...semCit, '');

  // conteúdo: para cada arquivo:linha, algum identificador citado na mesma linha da nota aparece perto da linha?
  const desl = [];
  emCod = false;
  ls.forEach((l, i) => {
    if (/^\s*```/.test(l)) { emCod = !emCod; return; }
    if (emCod) return;
    const ids = [...l.matchAll(/`([A-Za-z_][\w]{3,})(?:\(\))?`/g)].map((m) => m[1]).filter((x) => !/^(develop|main|ATIVA|true|false)$/.test(x));
    if (!ids.length) return;
    for (const m of l.matchAll(RE_ARQ)) {
      if (!m[2]) continue;
      const [a, b] = [Number(m[2]), Number(m[3] || m[2])];
      const ach = resolver(m[1], null);
      if (ach.length !== 1) continue;
      const txt = linhas(ach[0].repo, ach[0].arq);
      const perto = (id) => txt.slice(Math.max(0, a - 31), b + 30).some((x) => x.includes(id));
      const candidatos = ids.filter((id) => txt.some((x) => x.includes(id)));
      if (!candidatos.length || candidatos.some(perto)) continue;
      const id = candidatos[0];
      const nova = txt.findIndex((x) => x.includes(id)) + 1;
      desl.push(`- nota linha ${i + 1}: \`${m[0]}\` (${ach[0].repo}) — \`${id}\` não está perto; aparece na linha ${nova}`);
    }
  });
  out.push(`## Citações deslocadas (o identificador está em outra linha) (${desl.length})`, '', ...desl, '');
  fs.mkdirSync(path.join(raiz, '_v3', 'selos'), { recursive: true });
  fs.writeFileSync(path.join(raiz, '_v3', 'selos', nota + '.md'), out.join('\n'), 'utf8');
  console.log(`${nota}: ${cits.size} arquivos citados, ${problemas} com problema; ${semCit.length} ✅ sem citação`);
}

const [, , modo, alvo] = process.argv;
if (modo === 'relatorio') relatorio(alvo);
else if (modo === 'commits') for (const r of REPOS) console.log(`${r} ${base(r).ref} ${base(r).hash}`);
