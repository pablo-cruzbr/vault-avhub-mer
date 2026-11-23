// Bloco 5: divide uma nota acima de ~25 KB. A original vira índice curto; os trechos vão, sem mudar o texto,
// para notas-parte em <pasta da nota>/Partes/. Os títulos movidos sobem de nível (### → ##) para a parte
// abrir em ##; o texto do título não muda, então links [[Nota#Título]] são reescritos para [[Parte#Título]].
//
//   node scripts/dividir.mjs <chave> [--simular]     (chave = entrada de PLANO; "todas" roda todas)
//
// Modos:
//   subsecoes: a seção `##` indicada fica na original como índice; seus `###` (ou `####`, se um `###` passar
//              do limite) são empacotados em partes de até LIMITE bytes.
//   secoes:    as seções `##` listadas em cada parte saem inteiras; a original ganha uma seção-índice no lugar.
//   linhas:    a tabela da seção `##` indicada é cortada por linhas em partes de até LIMITE bytes, cada uma com o
//              cabeçalho da tabela; a original fica com o texto da seção e o índice das partes.
// Idempotente: se a parte já existe, a nota não é tocada de novo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const simular = process.argv.includes('--simular');
const LIMITE = 20 * 1024;
const HOJE = '2026-11-05';

// Para dividir uma nota nova, acrescente uma entrada ao PLANO, rode com --simular e depois sem.
// As entradas abaixo são as do Bloco 5 da v3; rodar de novo não muda nada.
export const PLANO = {
  'mestre': { nota: '02-Fluxo-de-Atividades/00-Fluxo-Mestre-0b.md', modo: 'linhas', secao: 'Tabela nó → raia, tela, endpoint, contrato, código', prefixo: '00-Fluxo-Mestre-0b-Tabela', rotulo: 'tabela nó → raia', nomePorId: false },
  '01': { nota: '02-Fluxo-de-Atividades/01-Proposta-de-Venda.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  '02': { nota: '02-Fluxo-de-Atividades/02-Orcamento-Base-de-Preco.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  '03': { nota: '02-Fluxo-de-Atividades/03-Pedido-de-Venda-e-Liberacao.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  '05': { nota: '02-Fluxo-de-Atividades/05-Estoque-Atendimento.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  '06': { nota: '02-Fluxo-de-Atividades/06-Circuito-de-Compra.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  '07': { nota: '02-Fluxo-de-Atividades/07-Recebimento.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  '15': { nota: '02-Fluxo-de-Atividades/15-Custo-Real-e-Comissao.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'telas': { nota: '02-Fluxo-de-Atividades/Transversais/Telas-e-Experiencia-do-Usuario.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'av-hub-api': { nota: '03-Sistemas/AV-Hub-API.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'mes-backend': { nota: '03-Sistemas/MES-Backend.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'conexao-pablo': { nota: '03-Sistemas/Conexao-das-Telas-do-Pablo-com-a-API-do-Hub.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'mapa-pablo': { nota: '03-Sistemas/Mapa-do-Modulo-do-Pablo.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'comissao-01': { nota: '03-Sistemas/Comissao/01-Motor-Atual-Como-Calcula.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'comissao-02': { nota: '03-Sistemas/Comissao/02-Tabelas-Atuais-core_comissionamento.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'comissao-03': { nota: '03-Sistemas/Comissao/03-Modelo-Novo-core_comissao.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'int-mes': { nota: '05-Integracoes/Integracao-AvHub-MES.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'incluir-pedido': { nota: '05-Integracoes/Mapa-IncluirPedido-Omie.md', modo: 'subsecoes', secao: 'Detalhe técnico' },
  'backlog': { nota: '07-Desenvolvimento/Backlog-por-Frente.md', modo: 'subsecoes', secao: 'Lista completa', artigo: 'A', nomes: ['Backlog-Frente-Robert', 'Backlog-Frente-Gustavo', 'Backlog-Frente-Nathan', 'Backlog-Frente-Comercial-e-Suprimentos'] },
  'perguntas': { nota: '07-Desenvolvimento/Perguntas-Proposta-Pedido-Comissao.md', modo: 'secoes', indice: 'Lista completa', partes: [
    { nome: 'Perguntas-Proposta-Pedido-Comissao-Quadro-Geral', secoes: ['1. Quadro geral'] },
    { nome: 'Perguntas-Proposta-Pedido-Comissao-OQ-02-a-OQ-30', secoes: ['2. OQ-02 a OQ-12 (do briefing)', '3. OQ-13 a OQ-30 (descobertas ao documentar)', '4. Consultas que saem daqui', '5. Perguntas do documento de 16/10 já respondidas por decisão'] },
  ] },
  'contratos': { nota: '06-Contratos/Contratos-da-v2.md', modo: 'secoes', indice: 'Todos os contratos da v2', partes: [
    { nome: 'Contratos-da-v2-Lista-Completa', secoes: ['Todos os contratos da v2'] },
  ] },
  'registro-n16': { nota: '08-Decisoes/Registro-de-Decisoes.md', modo: 'linhas', secao: 'Decisões de 16 a 26/10/2026 (proposta, orçamento, pedido de venda, custo real e comissão)', prefixo: 'Registro', rotulo: 'decisões N16', nomePorId: true },
  'registro-resto': { nota: '08-Decisoes/Registro-de-Decisoes.md', modo: 'secoes', indice: 'Onde está cada decisão', partes: [
    { nome: 'Registro-N14-01-a-N14-33', secoes: ['Decisões de 14/10/2026 (Nathan)'] },
    { nome: 'Registro-DEC-EN-EC-e-1-a-38', secoes: ['DEC-1 a DEC-12 (decisões com prazo, de 21 e 22/09/2026)', 'EN-01 a EN-07 e EC-01 a EC-08 (encaixe do Estoque, da Revenda e do circuito de compra no PCP)', 'Ambientes e produção (#1 a #6)', 'Pipeline Omie e segurança (#7 a #20)', 'Estoque e MES (#21 a #31c)', 'Equipe e cronograma (#32 a #38)'] },
    { nome: 'Registro-39-a-80', secoes: ['Compras, CCP e contratos (#39 a #53)', 'Nomes, documentação e achados (#54 a #80)'] },
    { nome: 'Registro-81-a-100-e-Estado-no-Codigo', secoes: ['Contratos criados a partir do código (#81 a #96)', 'Custo do lote (#97 a #99)', 'Matéria-prima no atendimento (#100)', 'Estado no código das decisões que mexem em código (14/10/2026; linhas N16 lidas em 16/10/2026 no `api-comercial` 5aa5311)'] },
  ] },
};

const bytes = (s) => Buffer.byteLength(s, 'utf8');
const IGN = new Set(['.git', '.obsidian', 'node_modules', '_v3', 'v3', 'scripts']);
function todasNotas() {
  const out = [];
  (function w(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (IGN.has(e.name)) continue; const p = path.join(d, e.name); if (e.isDirectory()) w(p); else if (e.name.endsWith('.md')) out.push(p); } })(raiz);
  return out;
}

// linhas com nível de título (fora de blocos de código)
function titulos(lin) {
  const t = []; let code = false;
  lin.forEach((l, i) => { if (/^```/.test(l)) code = !code; const m = !code && l.match(/^(#{1,6}) (.+?)\s*$/); if (m) t.push({ i, nivel: m[1].length, texto: m[2] }); });
  return t;
}
function fimDaSecao(tit, i, nivel, total) { const p = tit.find((x) => x.i > i && x.nivel <= nivel); return p ? p.i : total; }
function promover(linhas, de) { // nível mínimo `de` vira 2
  const d = de - 2; if (d <= 0) return linhas; let code = false;
  return linhas.map((l) => { if (/^```/.test(l)) code = !code; return !code && /^#{3,6} /.test(l) ? l.slice(d) : l; });
}
function frontmatter(txt) { const m = txt.match(/^---\n([\s\S]*?)\n---\n/); return m ? m[1].split('\n') : []; }
function campo(fm, k) { const l = fm.find((x) => x.startsWith(k + ':')); return l ? l.slice(k.length + 1).trim() : null; }

function notaParte(origem, txtOrig, nome, titulo, frase, irmas, corpo) {
  const fm = frontmatter(txtOrig);
  const tags = (campo(fm, 'tags') || '[]').replace(/\]$/, ', parte]').replace('[, parte]', '[parte]');
  const linhas = ['---', `tags: ${tags}`, `criado: ${HOJE}`, `estado-em: ${campo(fm, 'estado-em') || campo(fm, 'atualizado') || HOJE}`, `status: ${campo(fm, 'status') || 'vigente'}`];
  if (campo(fm, 'dono')) linhas.push(`dono: ${campo(fm, 'dono')}`);
  linhas.push(`parte-de: "[[${origem}]]"`);
  if (campo(fm, 'develop-conferida')) linhas.push(`develop-conferida: ${campo(fm, 'develop-conferida')}`);
  if (campo(fm, 'fontes')) linhas.push(`fontes: ${campo(fm, 'fontes')}`);
  linhas.push('---', '', `# ${titulo}`, '', `**Em uma frase:** ${frase}`, '',
    `**Onde estamos:** ← [[${origem}]] (resumo e índice)${irmas.length > 1 ? ' · partes: ' + irmas.map((n) => (n === nome ? `**${n}**` : `[[${n}]]`)).join(' · ') : ''}`, '');
  return linhas.join('\n') + '\n' + corpo.replace(/^\n+/, '').replace(/\n*$/, '\n');
}

// equilibrado: n = teto(total / LIMITE) partes, cada uma perto de total / n (nunca acima de MAXIMO)
const MAXIMO = 23 * 1024;
function empacotar(blocos, tamanho = (b) => b.tam) {
  const total = blocos.reduce((s, b) => s + tamanho(b), 0);
  const n = Math.max(1, Math.ceil(total / LIMITE));
  const alvo = total / n;
  const partes = []; let cur = null, acumulado = 0;
  for (const b of blocos) {
    const t = tamanho(b);
    const passaDoAlvo = cur && acumulado + t / 2 > alvo * (partes.length) && partes.length < n;
    if (!cur || passaDoAlvo || cur.tam + t > MAXIMO) { cur = { blocos: [], tam: 0 }; partes.push(cur); }
    cur.blocos.push(b); cur.tam += t; acumulado += t;
  }
  return partes;
}

function reescreverLinks(origem, mapa, simul) { // mapa: título → nota-parte
  let n = 0; const tocadas = [];
  for (const f of todasNotas()) {
    const t = fs.readFileSync(f, 'utf8');
    const novo = t.replace(/(!?\[\[)([^\]|#]+)#([^\]|]+)((?:\\?\|[^\]]*)?\]\])/g, (m, a, alvo, ancora, resto) => {
      if (alvo.trim() !== origem || !mapa.has(ancora.trim())) return m;
      n++; return `${a}${mapa.get(ancora.trim())}#${ancora}${resto}`;
    });
    if (novo !== t) { tocadas.push(path.relative(raiz, f)); if (!simul) fs.writeFileSync(f, novo, 'utf8'); }
  }
  return { n, tocadas };
}

function dividir(chave) {
  const p = PLANO[chave];
  const arq = path.join(raiz, p.nota);
  const origem = path.basename(arq, '.md');
  const dirPartes = path.join(path.dirname(arq), 'Partes');
  if (p.partes && p.partes.every((pt) => fs.existsSync(path.join(dirPartes, pt.nome + '.md')))) { console.log(`${origem}: partes já existem; nada a fazer`); return; }
  let txt = fs.readFileSync(arq, 'utf8');
  const lin = txt.split('\n');
  const tit = titulos(lin);
  const tituloNota = (tit.find((x) => x.nivel === 1) || { texto: origem }).texto;
  const partes = []; // {nome, linhas(array), titulos(array de textos), resumo}
  let novaOrig;

  if (p.modo === 'subsecoes') {
    const s = tit.find((x) => x.nivel === 2 && x.texto.startsWith(p.secao));
    if (!s) throw new Error(`${origem}: seção ${p.secao} não achada`);
    const fim = fimDaSecao(tit, s.i, 2, lin.length);
    const sub = tit.filter((x) => x.i > s.i && x.i < fim && x.nivel === 3);
    const introFim = sub.length ? sub[0].i : fim;
    const blocos = [];
    for (const [k, h] of sub.entries()) {
      const hf = k + 1 < sub.length ? sub[k + 1].i : fim;
      const ls = lin.slice(h.i, hf);
      if (bytes(ls.join('\n')) <= LIMITE) { blocos.push({ linhas: ls, tam: bytes(ls.join('\n')), titulos: [h.texto], nivel: 3 }); continue; }
      // ### grande demais: corta pelos ####, o primeiro pedaço leva o título ### e a introdução
      const s4 = tit.filter((x) => x.i > h.i && x.i < hf && x.nivel === 4);
      const pontos = [h.i, ...s4.slice(1).map((x) => x.i), hf];
      for (let j = 0; j + 1 < pontos.length; j++) {
        const pedaco = lin.slice(pontos[j], pontos[j + 1]);
        const ts = titulos(pedaco).map((x) => x.texto); // o 1º pedaço começa no ###, os outros no ####
        blocos.push({ linhas: pedaco, tam: bytes(pedaco.join('\n')), titulos: ts, nivel: 3, cont: j > 0 ? h.texto : null });
      }
    }
    const pacotes = p.nomes ? blocos.map((b) => ({ blocos: [b], tam: b.tam })) : empacotar(blocos);
    const suf = p.sufixo || 'Detalhe-Tecnico';
    pacotes.forEach((pk, k) => {
      const nome = p.nomes ? p.nomes[k] : pacotes.length === 1 ? `${origem}-${suf}` : `${origem}-${suf}-${k + 1}`;
      let ls = [];
      for (const b of pk.blocos) { if (b.cont && ls.length === 0) ls.push(`## ${b.cont} (continuação)`, ''); ls.push(...b.linhas); }
      const ts = pk.blocos.flatMap((b) => b.titulos);
      partes.push({ nome, linhas: promover(ls, 3), titulos: ts, principais: pk.blocos.map((b) => b.cont ? `${b.titulos[0]} (de ${b.cont})` : b.titulos[0]) });
    });
    const rotuloSecao = p.secao.toLowerCase();
    const indice = [lin[s.i], '', ...lin.slice(s.i + 1, introFim).filter((l, i, a) => !(l === '' && (i === 0 || a[i - 1] === ''))),
      `${p.artigo || 'O'} ${rotuloSecao} desta nota fica em ${partes.length === 1 ? 'uma nota à parte' : partes.length + ' notas à parte'}, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3):`, '',
      ...partes.map((pt) => `- [[${pt.nome}]]: ${pt.principais.join(' · ')}`), ''];
    novaOrig = [...lin.slice(0, s.i), ...indice, ...lin.slice(fim)];
    partes.forEach((pt) => { pt.frase = `${rotuloSecao} da nota [[${origem}]]${partes.length > 1 ? ` (parte ${partes.indexOf(pt) + 1} de ${partes.length})` : ''}: ${pt.principais.join('; ')}.`; pt.titulo = `${tituloNota}: ${p.secao.toLowerCase()}${partes.length > 1 ? ` (${partes.indexOf(pt) + 1}/${partes.length})` : ''}`; });
  } else if (p.modo === 'secoes') {
    const remover = [];
    for (const pt of p.partes) {
      const ls = [], ts = [];
      for (const nomeSec of pt.secoes) {
        const s = tit.find((x) => x.nivel === 2 && x.texto === nomeSec);
        if (!s) throw new Error(`${origem}: seção "${nomeSec}" não achada`);
        const fim = fimDaSecao(tit, s.i, 2, lin.length);
        ls.push(...lin.slice(s.i, fim)); remover.push([s.i, fim]);
        ts.push(...tit.filter((x) => x.i >= s.i && x.i < fim).map((x) => x.texto));
      }
      partes.push({ nome: pt.nome, linhas: ls, titulos: ts, principais: pt.secoes, titulo: `${tituloNota}: ${pt.secoes.length === 1 ? pt.secoes[0] : pt.nome.replace(origem + '-', '').replace(/-/g, ' ')}`, frase: `parte da nota [[${origem}]] com ${pt.secoes.map((x) => `"${x}"`).join(', ')}. O texto foi movido sem mudança.` });
    }
    remover.sort((a, b) => a[0] - b[0]);
    const indice = [`## ${p.indice}`, '', `Estas seções ficam em notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3). O texto foi movido sem mudança:`, '',
      ...partes.map((pt) => `- [[${pt.nome}]]: ${pt.principais.join(' · ')}`), ''];
    const existeIndice = tit.find((x) => x.nivel === 2 && x.texto === p.indice && !remover.some(([a]) => a === x.i));
    novaOrig = [];
    let pos = 0, posto = false;
    for (const [a, b] of remover) {
      novaOrig.push(...lin.slice(pos, a));
      if (!posto && !existeIndice) { novaOrig.push(...indice); posto = true; }
      pos = b;
    }
    novaOrig.push(...lin.slice(pos));
    if (existeIndice) { // acrescenta o índice dentro da seção existente, logo depois do título
      const k = novaOrig.findIndex((l) => l === `## ${p.indice}`);
      novaOrig.splice(k + 1, 0, '', ...indice.slice(2, -1));
    }
  } else if (p.modo === 'linhas') {
    const s = tit.find((x) => x.nivel === 2 && x.texto === p.secao);
    if (!s) throw new Error(`${origem}: seção não achada`);
    const fim = fimDaSecao(tit, s.i, 2, lin.length);
    const iTab = lin.findIndex((l, i) => i > s.i && i < fim && l.startsWith('|'));
    if (iTab < 0) { console.log(`${origem}: a seção não tem mais tabela (já foi dividida?)`); return; }
    let iFimTab = iTab; while (iFimTab < fim && lin[iFimTab].startsWith('|')) iFimTab++;
    const cab = lin.slice(iTab, iTab + 2), rows = lin.slice(iTab + 2, iFimTab);
    const pacotes = empacotar(rows.map((r) => ({ r, tam: bytes(r) + 1 }))).map((pk) => ({ rows: pk.blocos.map((b) => b.r), tam: pk.tam }));
    const id = (r) => r.split('|')[1].replace(/\*/g, '').trim();
    pacotes.forEach((pk, k) => {
      const a = id(pk.rows[0]), b = id(pk.rows[pk.rows.length - 1]);
      const nome = p.nomePorId ? `${p.prefixo}-${a}-a-${b}` : `${p.prefixo}-${k + 1}`;
      partes.push({ nome, linhas: [`## ${p.secao} (${a} a ${b})`, '', ...cab, ...pk.rows, ''], titulos: [], principais: [`${a} a ${b}`],
        titulo: `${tituloNota}: ${p.rotulo}, ${a} a ${b}`, frase: `${p.rotulo} da nota [[${origem}]], linhas ${a} a ${b} (parte ${k + 1} de ${pacotes.length}). As linhas foram movidas sem mudança; o cabeçalho da tabela se repete em cada parte.` });
    });
    const indice = [`A tabela fica em ${partes.length} notas à parte, para cada arquivo ficar abaixo de 25 KB (Bloco 5 da v3). As linhas foram movidas sem mudança:`, '',
      ...partes.map((pt) => `- [[${pt.nome}]]: ${pt.principais[0]}`)];
    novaOrig = [...lin.slice(0, iTab), ...indice, ...lin.slice(iFimTab)];
  }

  if (!partes.length) { console.log(`${origem}: nada a dividir (já foi dividida?)`); return; }
  const nomes = partes.map((pt) => pt.nome);
  const ja = nomes.filter((n) => fs.existsSync(path.join(dirPartes, n + '.md')));
  if (ja.length) { console.log(`${origem}: partes já existem (${ja.join(', ')}); nada a fazer`); return; }
  const mapa = new Map(); for (const pt of partes) for (const t of pt.titulos) mapa.set(t, pt.nome);
  const conteudos = partes.map((pt) => ({ nome: pt.nome, txt: notaParte(origem, txt, pt.nome, pt.titulo, pt.frase, nomes, pt.linhas.join('\n')) }));
  const novoTxt = novaOrig.join('\n').replace(/\n{3,}/g, '\n\n');
  console.log(`\n${simular ? '[simular] ' : ''}${origem}: ${(bytes(txt) / 1024).toFixed(1)} KB → índice ${(bytes(novoTxt) / 1024).toFixed(1)} KB`);
  for (const c of conteudos) console.log(`  + Partes/${c.nome}.md (${(bytes(c.txt) / 1024).toFixed(1)} KB)`);
  if (!simular) {
    fs.mkdirSync(dirPartes, { recursive: true });
    for (const c of conteudos) fs.writeFileSync(path.join(dirPartes, c.nome + '.md'), c.txt, 'utf8');
    fs.writeFileSync(arq, novoTxt, 'utf8');
  }
  const r = reescreverLinks(origem, mapa, simular);
  console.log(`  links com #seção reescritos: ${r.n}${r.tocadas.length ? ' em ' + r.tocadas.join(', ') : ''}`);
}

const chave = process.argv[2];
if (!process.argv[1] || !process.argv[1].endsWith('dividir.mjs')) { /* importado */ }
else if (!chave) console.log('uso: dividir.mjs <chave|todas> [--simular]\nchaves: ' + Object.keys(PLANO).join(', '));
else for (const k of chave === 'todas' ? Object.keys(PLANO) : [chave]) dividir(k);
