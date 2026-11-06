// Confere as citações de código do vault (`repositório` `caminho/arquivo:linha (âncora)`) contra a
// develop dos sistemas: o arquivo ainda existe? a linha ainda cabe no arquivo? a âncora ainda está na linha?
// Só lê: usa `git ls-tree` e `git show` na origin/develop (origin/master no omie-elt-pipeline). Não troca de branch.
//
// Uso (na raiz do vault):
//   node scripts/conferir-citacoes.mjs                 resumo e problemas
//   node scripts/conferir-citacoes.mjs --detalhe       também lista as citações sem âncora
//   node scripts/conferir-citacoes.mjs --nota=<parte>  só as notas cujo caminho contém <parte>
//   node scripts/conferir-citacoes.mjs --sistemas=<pasta>   pasta onde estão os repositórios (padrão: a pasta-mãe do vault)
//   node scripts/conferir-citacoes.mjs --raiz=<vault>        raiz do vault (padrão: a pasta acima de scripts/)
//
// Formato da âncora: logo depois da citação, entre parênteses, um trecho literal e curto da linha citada:
//   `api-acos-vital` `src/.../ordens_compra.route.js:42` (`EXIGIR_PODE_APROVAR`)
// Rode antes do `git fetch` dos sistemas ficar velho (veja a seção "Antes de qualquer tarefa" do CLAUDE.md).
// Sai com código 1 se houver citação quebrada (arquivo sumiu, linha além do fim, âncora deslocada ou sumida).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const arg = (nome) => {
  const a = process.argv.find((x) => x.startsWith(`--${nome}=`));
  return a ? a.slice(nome.length + 3) : null;
};
const raiz = path.resolve(arg('raiz') || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const DETALHE = process.argv.includes('--detalhe');
const FILTRO = arg('nota');
const pastaSistemas = path.resolve(arg('sistemas') || path.join(raiz, '..'));

const REPOS = {
  'api-acos-vital': 'origin/develop',
  'av-hub': 'origin/develop',
  'api-pcp': 'origin/develop',
  'app-pcp': 'origin/develop',
  'omie-elt-pipeline': 'origin/master',
  // Legado: o protótipo api-comercial saiu do av-hub (PR #261); as citações a ele são lidas no
  // último commit que o tinha, dentro do clone do av-hub.
  'api-comercial': 'f7d8d7f',
};
const NOMES = Object.keys(REPOS);
// Pasta do clone e subpasta de cada "repositório" (o legado mora dentro do av-hub).
const PASTA = { 'api-comercial': 'av-hub' };
const SUB = { 'api-comercial': 'api-comercial/' };
const pastaDe = (repo) => PASTA[repo] || repo;

const git = (repo, args) =>
  execFileSync('git', ['-C', path.join(pastaSistemas, pastaDe(repo)), ...args], {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });

// 1. Índice de arquivos de cada repositório na base
const arquivos = {};
const ausentes = [];
console.log('# Conferência das citações de código\n');
for (const repo of NOMES) {
  const base = REPOS[repo];
  if (!fs.existsSync(path.join(pastaSistemas, pastaDe(repo), '.git'))) {
    ausentes.push(`${repo} (pasta ${path.join(pastaSistemas, pastaDe(repo))} não existe)`);
    continue;
  }
  try {
    const commit = git(repo, ['rev-parse', '--short', base]).trim();
    const sub = SUB[repo] || '';
    arquivos[repo] = git(repo, ['ls-tree', '-r', '--name-only', base, ...(sub ? [sub] : [])])
      .split('\n')
      .filter(Boolean)
      .map((x) => x.slice(sub.length));
    console.log(`Base: ${repo} ${base} ${commit} (${arquivos[repo].length} arquivos)`);
  } catch {
    ausentes.push(`${repo} (sem ${base}; rode git fetch)`);
  }
}
if (ausentes.length) {
  console.log(`\nRepositórios ausentes: ${ausentes.join('; ')}`);
  console.log('As citações que só podem ser deles ficam fora da conferência. Veja "Repositório ausente" no CLAUDE.md.');
}

// 2. Notas do vault (fora do material histórico e dos exemplos de modelo)
const FORA = ['.git', '.obsidian', 'node_modules', '.claude'];
const foraRel = (r) => r.startsWith('07-Desenvolvimento/v3/') || r.startsWith('06-Contratos/Modelos/');
function listar(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (FORA.includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listar(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}
const rel = (f) => path.relative(raiz, f).split(path.sep).join('/');
const notas = listar(raiz).filter((f) => !foraRel(rel(f)) && (!FILTRO || rel(f).includes(FILTRO)));

// 3. Citações: <caminho>.<ext>:<linha>[-<linha>], com âncora opcional logo depois
const CIT = /([A-Za-z0-9_.@+\-\[\]()/]+\.(?:tsx|ts|mjs|js|json|prisma|sql)):(\d+)(?:-(\d+))?/g;
// Âncora: (`texto literal`) ou (identificador). Parênteses com comentário, como (dump 246) ou (ver X), não contam.
const ANCORA = /^`?\s*\(\s*`([^`]+)`\s*\)|^`?\s*\(\s*([A-Za-z_$][\w$.]*)\s*\)/;
const conteudo = new Map();
const lerArquivo = (repo, arq) => {
  const k = `${repo}:${arq}`;
  if (!conteudo.has(k)) {
    try { conteudo.set(k, git(repo, ['show', `${REPOS[repo]}:${SUB[repo] || ''}${arq}`]).split('\n')); } catch { conteudo.set(k, null); }
  }
  return conteudo.get(k);
};
const mencoes = (linha) => {
  const achados = [];
  for (const r of NOMES) {
    const re = new RegExp(`(?<![\\w-])${r.replace(/-/g, '\\-')}(?![\\w-])`, 'g');
    let m;
    while ((m = re.exec(linha))) achados.push({ r, i: m.index, f: m.index + r.length });
  }
  return achados;
};
// "colado": entre o nome do repositório e a citação só há espaço, crase, dois-pontos ou barra
const coladoAntes = (linha, pos) => {
  const a = mencoes(linha).filter((x) => x.f <= pos && /^[`\s:/]*$/.test(linha.slice(x.f, pos)));
  return a.length ? a[a.length - 1].r : null;
};

const res = { total: 0, conferidas: 0, comAncora: 0, semAncora: [], naoAchado: [], ambiguo: [], outroRepo: [], alemDoFim: [], deslocada: [], sumiu: [], semRepo: 0 };
for (const f of notas) {
  const linhas = fs.readFileSync(f, 'utf8').split('\n');
  const notaCita = new Set(linhas.flatMap((l) => mencoes(l).map((x) => x.r)));
  let codigo = false;
  linhas.forEach((linha, i) => {
    if (/^\s*```/.test(linha)) { codigo = !codigo; return; }
    if (codigo) return;
    let m;
    CIT.lastIndex = 0;
    while ((m = CIT.exec(linha))) {
      let alvo = m[1].replace(/^\(+(?!(protected|public)\))/, '').replace(/^\/+/, '');
      // caminho com o nome do repositório na frente (api-pcp/src/...) e reticências (app-pcp/.../acoes.ts)
      let prefixo = null;
      for (const r of NOMES) if (alvo.startsWith(r + '/')) { prefixo = r; alvo = alvo.slice(r.length + 1); }
      if (alvo.includes('.../')) alvo = alvo.slice(alvo.lastIndexOf('.../') + 4);
      if (/^https?:/.test(alvo) || alvo.startsWith('github.com')) continue;
      // linha de dump (arquivo .sql do banco, não do código): confira com a skill banco-de-dados
      if (alvo.endsWith('.sql') && /dump/i.test(linha) && !alvo.includes('migration')) continue;
      res.total++;
      const ini = Number(m[2]);
      const fim = m[3] ? Number(m[3]) : ini;
      const resto = linha.slice(m.index + m[0].length);
      const a = resto.match(ANCORA);
      const ancora = a ? (a[1] || a[2]).trim() : null;
      const onde = `${rel(f)}:${i + 1}`;
      const cit = `${m[1]}:${m[2]}${m[3] ? '-' + m[3] : ''}${ancora ? ` (${ancora})` : ''}`;

      const colado = prefixo || coladoAntes(linha, m.index);
      const detectado = colado ? [colado] : [];
      const casa = (repo) => (arquivos[repo] || []).filter((x) => x === alvo || x.endsWith('/' + alvo));
      if (colado && !arquivos[colado]) { res.semRepo++; continue; }
      // o legado só entra quando a nota fala dele (senão `motor.ts` viraria ambíguo com o do Hub)
      const citaLegado = (r) => !SUB[r] || notaCita.has(r);
      const candidatos = Object.keys(arquivos).filter(citaLegado);
      let achados = (colado ? [colado] : candidatos).flatMap((r) => casa(r).map((x) => ({ r, x })));
      if (!achados.length && colado) {
        const fora = candidatos.filter((r) => r !== colado).flatMap((r) => casa(r).map((x) => ({ r, x })));
        if (fora.length === 1) { res.outroRepo.push(`${onde}  \`${cit}\`: citado como ${colado}, achado em ${fora[0].r} ${fora[0].x}`); achados = fora; }
      }
      if (achados.length > 1) {
        // desempate: repositórios citados em qualquer lugar da linha
        const naLinha = new Set(mencoes(linha).map((x) => x.r));
        const filtrados = achados.filter((a) => naLinha.has(a.r));
        if (filtrados.length >= 1) achados = filtrados;
      }
      if (!achados.length) {
        if (fs.existsSync(path.join(raiz, alvo))) continue; // arquivo do próprio vault (scripts, mapa)
        res.naoAchado.push(`${onde}  \`${cit}\`${detectado.length ? ` (${detectado[0]})` : ''}`);
        continue;
      }
      if (achados.length > 1) {
        res.ambiguo.push(`${onde}  \`${cit}\`: ${achados.slice(0, 3).map((x) => `${x.r} ${x.x}`).join(' | ')}${achados.length > 3 ? ' ...' : ''}`);
        continue;
      }
      const { r, x } = achados[0];
      const texto = lerArquivo(r, x);
      if (!texto) { res.naoAchado.push(`${onde}  \`${cit}\` (${r}, ilegível)`); continue; }
      res.conferidas++;
      const n = texto.length - (texto[texto.length - 1] === '' ? 1 : 0);
      const fimOk = fim === n + 1 ? n : fim;
      if (ini > n || fimOk > n) { res.alemDoFim.push(`${onde}  \`${cit}\`: ${r} ${x} tem ${n} linhas`); continue; }
      if (!ancora) { res.semAncora.push(`${onde}  \`${cit}\` (${r})`); continue; }
      res.comAncora++;
      const trecho = texto.slice(ini - 1, fimOk).join('\n');
      if (trecho.includes(ancora)) continue;
      const nova = texto.findIndex((l) => l.includes(ancora));
      if (nova >= 0) res.deslocada.push(`${onde}  \`${cit}\`: a âncora agora está na linha ${nova + 1} de ${r} ${x}`);
      else res.sumiu.push(`${onde}  \`${cit}\`: a âncora não existe mais em ${r} ${x}`);
    }
  });
}

// 4. Relatório
const secao = (t, l, sempre = true) => {
  console.log(`\n## ${t}: ${l.length}`);
  if (sempre) for (const x of l) console.log(`- ${x}`);
};
console.log(`\nNotas lidas: ${notas.length} · citações achadas: ${res.total} · conferidas no código: ${res.conferidas} · com âncora: ${res.comAncora}${res.semRepo ? ` · de repositório ausente: ${res.semRepo}` : ''}`);
secao('Arquivo não encontrado na base', res.naoAchado);
secao('Linha além do fim do arquivo', res.alemDoFim);
secao('Âncora deslocada (corrija o número da linha)', res.deslocada);
secao('Âncora sumiu do arquivo (reconfira o fato)', res.sumiu);
secao('Citação ambígua (diga o caminho ou o repositório)', res.ambiguo);
secao('Citada num repositório, achada em outro', res.outroRepo);
secao('Sem âncora (só a linha; acrescente a âncora quando mexer na nota)', res.semAncora, DETALHE);
if (!DETALHE && res.semAncora.length) console.log('(use --detalhe para listar)');
const quebradas = res.naoAchado.length + res.alemDoFim.length + res.deslocada.length + res.sumiu.length;
console.log(quebradas ? `\nRESULTADO: ${quebradas} citação(ões) quebrada(s) ou deslocada(s).` : '\nRESULTADO: nenhuma citação quebrada.');
process.exitCode = quebradas ? 1 : 0;
