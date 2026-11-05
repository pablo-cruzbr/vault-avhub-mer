// Bloco 1: reescreve os [[links]] para contratos da v2 e para o Painel, apontando para [[Contratos-da-v2]].
// Regras: mantém o ID visível; respeita |alias, #seção, \| em tabela, embeds ![[...]], caminho e .md;
// não toca em blocos de código (``` e `inline`). Idempotente: rodar de novo não muda nada.
// Uso: node _v3/scripts/contratos-links.mjs --simular   (lista o que mudaria e uma amostra de 20)
//      node _v3/scripts/contratos-links.mjs             (grava)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const TAG = 'v2-antes-da-v3';
const INDICE = 'Contratos-da-v2';
const PASTAS = ['Ativos', 'Consultas', 'Entregues', 'Arquivados'];
const simular = process.argv.includes('--simular');
const git = (...a) => execFileSync('git', a, { cwd: raiz, encoding: 'utf8', maxBuffer: 64 << 20 });

// nome (sem .md) -> ID do contrato, lido da tag (vale antes e depois do git rm)
const alvo = new Map();
for (const f of git('ls-tree', '-r', '--name-only', TAG, '--', '06-Contratos').split('\n').filter(Boolean)) {
  const partes = f.split('/');
  if (partes.length < 3 || !PASTAS.includes(partes[1])) continue;
  const base = path.basename(f);
  if (base === 'Modelo-de-Consulta.md') continue;
  let id;
  if (f.endsWith('.md')) {
    const fm = (git('show', `${TAG}:${f}`).replace(/\r/g, '').match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
    id = ((fm.match(/^id:\s*(.*)$/m) || [, ''])[1]).trim() || base.replace(/\.md$/, '');
    alvo.set(base.replace(/\.md$/, ''), id);
  } else {
    // anexo: pasta "LOG-26-anexos" -> "LOG-26 (anexo)"
    const dono = partes[partes.length - 2].replace(/-anexos$/, '');
    alvo.set(base, `${dono} (anexo)`);
  }
}
const PAINEL = 'Painel-de-Contratos';

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
const notas = listar(raiz).filter((f) => {
  const r = rel(f);
  if (r === `06-Contratos/${PAINEL}.md`) return false; // será removido
  return !PASTAS.some((p) => r.startsWith(`06-Contratos/${p}/`)) || r.endsWith('/Modelo-de-Consulta.md');
});

function novoLink(m, embed, dentro, emTabela) {
  const escPipe = /\\\|/.test(dentro);
  const [alvoBruto, ...resto] = dentro.split(/\\?\|/);
  const alias = resto.length ? resto.join('|').trim() : null;
  const nome = alvoBruto.split('#')[0].trim().split('/').pop().replace(/\.md$/, '');
  const nomeComExt = alvoBruto.split('#')[0].trim().split('/').pop();
  const sep = escPipe || emTabela ? '\\|' : '|';
  if (nome === PAINEL) return alias ? `[[${INDICE}${sep}${alias}]]` : `[[${INDICE}]]`;
  const id = alvo.get(nome) ?? alvo.get(nomeComExt);
  if (!id) return null;
  const idCurto = id.replace(/ \(anexo\)$/, '');
  let rotulo;
  if (!alias) rotulo = id;
  else if (alias.includes(idCurto)) rotulo = alias;
  else if (nome.endsWith(alias) || alias === nome) rotulo = id; // alias era só o nome antigo do arquivo
  else rotulo = `${alias} (${id})`;
  return `[[${INDICE}${sep}${rotulo}]]`;
}

function reescrever(txt) {
  const trocas = [];
  const linhas = txt.split('\n');
  let emCodigo = false;
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i];
    if (/^\s*(```|~~~)/.test(l)) { emCodigo = !emCodigo; continue; }
    if (emCodigo) continue;
    const emTabela = /^\s*(>\s*)*\|/.test(l); // tabela, inclusive dentro de callout

    // trechos de código inline (`...`) fora de wikilinks: links dentro deles não são tocados.
    // Os wikilinks são mascarados antes, porque um alias pode conter `código`.
    const mascarada = l.replace(/!?\[\[[^\]\n]+?\]\]/g, (m) => 'x'.repeat(m.length));
    const codigo = [...mascarada.matchAll(/`[^`]*`/g)].map((m) => [m.index, m.index + m[0].length]);
    const emCodigoInline = (pos) => codigo.some(([a, b]) => pos >= a && pos < b);
    let mudou = false;
    const nova = l.replace(/(!?)\[\[([^\]\n]+?)\]\]/g, (m, embed, dentro, pos) => {
      if (emCodigoInline(pos)) return m;
      const n = novoLink(m, embed, dentro, emTabela);
      if (!n || n === m) return m;
      trocas.push({ linha: i + 1, de: m, para: n });
      mudou = true;
      return n;
    });
    if (mudou) linhas[i] = nova;
  }
  return { texto: linhas.join('\n'), trocas };
}

let total = 0;
const porNota = [];
for (const f of notas) {
  const txt = fs.readFileSync(f, 'utf8');
  const { texto, trocas } = reescrever(txt);
  if (!trocas.length) continue;
  total += trocas.length;
  porNota.push([rel(f), trocas]);
  if (!simular) fs.writeFileSync(f, texto, 'utf8');
}

console.log(`${simular ? 'SIMULAÇÃO — ' : ''}links reescritos: ${total} em ${porNota.length} notas`);
for (const [n, t] of porNota) console.log(`- ${n}: ${t.length}`);
// amostra: 1 troca de cada nota, espalhada, até 20 notas diferentes
const passo = Math.max(1, Math.floor(porNota.length / 20));
const amostra = porNota.filter((_, i) => i % passo === 0).slice(0, 20)
  .map(([n, t]) => { const x = t[Math.floor(t.length / 2)]; return `${n}:${x.linha}  ${x.de}  →  ${x.para}`; });
console.log('\n## Amostra (20 notas diferentes)');
for (const a of amostra) console.log(a);
