// Bloco 2: renomeação um para um a partir de _v3/mapa-renomeacao.csv.
// Aplica o mapa inteiro de uma vez (sem cadeia de substituições): cada [[link]] é resolvido
// contra o nome ANTIGO e trocado uma única vez pelo nome NOVO.
//
// Uso:
//   node _v3/scripts/renomear.mjs --simular [--grupo=raias|transversais]   lista o que mudaria
//   node _v3/scripts/renomear.mjs [--grupo=...]                            git mv + reescrita de links
//   node _v3/scripts/renomear.mjs --crases [--simular]                     nomes entre crases (`...`)
// Grupos: "raias" = linhas cujo destino não está em Transversais/; "transversais" = as demais.
// Idempotente: linha cujo arquivo antigo não existe e o novo existe é pulada no git mv;
// links já no nome novo não casam com nenhum nome antigo.
//
// Regras dos links (iguais às do Bloco 1): |alias, #seção, \| em tabela (inclusive em callout),
// embeds ![[...]], links com caminho ou .md; nada dentro de ``` ou de `inline`.
// Nas notas históricas (EXCECOES), um link sem alias ganha o nome antigo como alias,
// para o texto visível não mudar (decisões e mapas antigos só mudam de arquivo, nunca de texto).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const simular = args.includes('--simular');
const crases = args.includes('--crases');
const grupo = (args.find((a) => a.startsWith('--grupo=')) || '').split('=')[1] || null;
const EXCECOES = new Set(['Registro-de-Decisoes', 'Mapa-v1-para-v2', 'Mapa-v2-para-v3', 'Analise-de-Organizacao-do-Vault']);

function lerCsv(p) {
  const linhas = fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).slice(1);
  return linhas.map((l) => {
    const c = [];
    let atual = '', aspas = false;
    for (const ch of l) {
      if (ch === '"') aspas = !aspas;
      else if (ch === ',' && !aspas) { c.push(atual); atual = ''; }
      else atual += ch;
    }
    c.push(atual);
    return { antigo: c[0], novo: c[1], tipo: c[2], motivo: c[3] };
  });
}

const todas = lerCsv(path.join(raiz, '_v3', 'mapa-renomeacao.csv'))
  .filter((r) => ['final', 'provisorio'].includes(r.tipo) && r.antigo.endsWith('.md') && !r.antigo.includes('*'));
const linhas = todas.filter((r) => {
  if (!grupo) return true;
  const t = r.novo.includes('/Transversais/');
  return grupo === 'transversais' ? t : !t;
});
const base = (p) => path.basename(p, '.md');
const mapa = new Map(linhas.map((r) => [base(r.antigo), { novoNome: base(r.novo), novoCaminho: r.novo.replace(/\.md$/, '') }]));

const IGNORAR = new Set(['.git', '.obsidian', 'node_modules', '_v3']);
function listar(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORAR.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listar(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}
const rel = (f) => path.relative(raiz, f).split(path.sep).join('/');

function novoLink(m, embed, dentro, emTabela, historica) {
  const escPipe = /\\\|/.test(dentro);
  const i = dentro.search(/\\?\|/);
  const alvoSecao = i < 0 ? dentro : dentro.slice(0, i);
  const aliasBruto = i < 0 ? null : dentro.slice(i).replace(/^\\?\|/, '');
  const [alvo, ...secao] = alvoSecao.split('#');
  const temMd = /\.md\s*$/.test(alvo);
  const temCaminho = alvo.includes('/');
  const nome = alvo.trim().split('/').pop().replace(/\.md$/, '');
  const d = mapa.get(nome);
  if (!d) return null;
  let novoAlvo = temCaminho ? d.novoCaminho : d.novoNome;
  if (temMd) novoAlvo += '.md';
  const sec = secao.length ? '#' + secao.join('#') : '';
  const sep = escPipe || emTabela ? '\\|' : '|';
  let alias = aliasBruto;
  if (alias == null && historica) alias = nome + (secao.length ? '#' + secao.join('#') : '');
  return `${embed}[[${novoAlvo}${sec}${alias != null ? sep + alias : ''}]]`;
}

function reescreverLinhas(txt, historica, porLinha) {
  const trocas = [];
  const ls = txt.split('\n');
  let emCodigo = false;
  for (let i = 0; i < ls.length; i++) {
    const l = ls[i];
    if (/^\s*(```|~~~)/.test(l)) { emCodigo = !emCodigo; continue; }
    if (emCodigo) continue;
    const r = porLinha(l, i, trocas, historica);
    if (r !== l) ls[i] = r;
  }
  return { texto: ls.join('\n'), trocas };
}

function linksDaLinha(l, i, trocas, historica) {
  const emTabela = /^\s*(>\s*)*\|/.test(l);
  const mascarada = l.replace(/!?\[\[[^\]\n]+?\]\]/g, (m) => 'x'.repeat(m.length));
  const codigo = [...mascarada.matchAll(/`[^`]*`/g)].map((m) => [m.index, m.index + m[0].length]);
  return l.replace(/(!?)\[\[([^\]\n]+?)\]\]/g, (m, embed, dentro, pos) => {
    if (codigo.some(([a, b]) => pos >= a && pos < b)) return m;
    const n = novoLink(m, embed, dentro, emTabela, historica);
    if (!n || n === m) return m;
    trocas.push({ linha: i + 1, de: m, para: n });
    return n;
  });
}

const nomesAntigos = [...mapa.keys()].sort((a, b) => b.length - a.length);
const reNome = new RegExp(`(?<![A-Za-z0-9-])(${nomesAntigos.map((n) => n.replace(/[-]/g, '\\-')).join('|')})(?![A-Za-z0-9-])`, 'g');
function crasesDaLinha(l, i, trocas) {
  // só o conteúdo de spans `...` fora de wikilinks
  const mascarada = l.replace(/!?\[\[[^\]\n]+?\]\]/g, (m) => 'x'.repeat(m.length));
  let out = '', ult = 0;
  for (const m of mascarada.matchAll(/`[^`]*`/g)) {
    const span = l.slice(m.index, m.index + m[0].length);
    const novo = span.replace(reNome, (n) => mapa.get(n).novoNome);
    out += l.slice(ult, m.index) + novo;
    ult = m.index + m[0].length;
    if (novo !== span) trocas.push({ linha: i + 1, de: span, para: novo });
  }
  return out + l.slice(ult);
}

// 1) git mv (só no modo de links)
if (!crases) {
  for (const r of linhas) {
    const de = path.join(raiz, r.antigo), para = path.join(raiz, r.novo);
    if (!fs.existsSync(de) && fs.existsSync(para)) continue;
    if (!fs.existsSync(de)) { console.log(`AVISO: não existe ${r.antigo}`); continue; }
    console.log(`${simular ? '[simular] ' : ''}git mv ${r.antigo} -> ${r.novo}`);
    if (!simular) {
      fs.mkdirSync(path.dirname(para), { recursive: true });
      execFileSync('git', ['mv', r.antigo, r.novo], { cwd: raiz });
    }
  }
}

// 2) reescrita
let total = 0;
const porNota = [];
for (const f of listar(raiz)) {
  const historica = EXCECOES.has(base(f));
  if (crases && historica) continue; // texto das notas históricas não muda
  const txt = fs.readFileSync(f, 'utf8');
  const { texto, trocas } = reescreverLinhas(txt, historica, crases ? crasesDaLinha : linksDaLinha);
  if (!trocas.length) continue;
  total += trocas.length;
  porNota.push([rel(f), trocas]);
  if (!simular) fs.writeFileSync(f, texto, 'utf8');
}
console.log(`\n${simular ? 'SIMULAÇÃO — ' : ''}${crases ? 'referências entre crases' : 'links'} reescritos: ${total} em ${porNota.length} notas${grupo ? ` (grupo ${grupo})` : ''}`);
for (const [n, t] of porNota) console.log(`- ${n}: ${t.length}`);
if (crases) for (const [n, t] of porNota) for (const x of t) console.log(`  ${n}:${x.linha}  ${x.de}  →  ${x.para}`);
const passo = Math.max(1, Math.floor(porNota.length / 20));
const amostra = porNota.filter((_, i) => i % passo === 0).slice(0, 20)
  .map(([n, t]) => { const x = t[Math.floor(t.length / 2)]; return `${n}:${x.linha}  ${x.de}  →  ${x.para}`; });
if (!crases) { console.log('\n## Amostra (até 20 notas diferentes)'); for (const a of amostra) console.log(a); }
