// Bloco 3: a nota provisória 01-Proposta-e-Pedido-de-Venda vira 01-Proposta-de-Venda (V0.1–V0.7, V0C),
// depois que C6–C8, V1–V3 e B2–B4 saíram para as notas donas. Os links são decididos pelo assunto:
// os que falavam de C6–C8 ou do pedido apontam para a nota dona; os demais, para a proposta.
// Uso: node 07-Desenvolvimento/v3/scripts/renomear-proposta.mjs [--simular]   (idempotente)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const simular = process.argv.includes('--simular');
const V = '01-Proposta-e-Pedido-de-Venda', N = '01-Proposta-de-Venda';
const F = '02-Fluxo-de-Atividades/';
const SEC06 = '06-Circuito-de-Compra#C6, C7 e C8: a parte de compras do pedido da proposta';

// trocas especiais (texto exato → texto novo, motivo); aplicadas antes da troca geral
const ESPECIAIS = [
  ['00-Inicio/Comece-Aqui.md', `[[06-Circuito-de-Compra]], [[02-Orcamento-Base-de-Preco]], [[${V}]] (nós \`C6\` a \`C8\`)`, `[[06-Circuito-de-Compra]] (com os nós \`C6\` a \`C8\`), [[02-Orcamento-Base-de-Preco]]`, 'C6–C8 agora são do Circuito'],
  ['00-Inicio/Comece-Aqui.md', `4. [[${V}]]: a proposta, o Orçamento, o custo real e a comissão nova`, `4. [[${N}]]: a proposta, com ligação para o Orçamento, o custo real e a comissão nova`, 'nota passa a ser só a proposta'],
  ['00-Inicio/Onde-Estamos.md', `| [[06-Circuito-de-Compra]] e [[${V}]] | C6–C8 |`, `| [[06-Circuito-de-Compra]] | C6–C8 |`, 'C6–C8 têm dono único'],
  ['00-Inicio/Home.md', `[[${V}]] (com [[02-Orcamento-Base-de-Preco]]) → [[03-Pedido-de-Venda-e-Liberacao]]`, `[[${N}]] → [[02-Orcamento-Base-de-Preco]] → [[03-Pedido-de-Venda-e-Liberacao]]`, 'ordem do fluxo (F1)'],
  [F + '00-Fluxo-Mestre-0b.md', `| Vendas: pedido | V1–V3 | [[03-Pedido-de-Venda-e-Liberacao]] e [[${V}]] |`, `| Vendas: pedido | V1–V3 | [[03-Pedido-de-Venda-e-Liberacao]] |`, 'V1–V3 têm dono único'],
  [F + '00-Fluxo-Mestre-0b.md', `| Compras e fornecedor | P3, C0–C8, FN1 | [[06-Circuito-de-Compra]] e [[${V}]] |`, `| Compras e fornecedor | P3, C0–C8, FN1 | [[06-Circuito-de-Compra]] |`, 'C6–C8 têm dono único'],
  [F + '00-Fluxo-Mestre-0b.md', `- **Datas do pedido** ([[${V}]]):`, `- **Datas do pedido** ([[06-Circuito-de-Compra]], datas do fornecedor e do CCP, N16-88):`, 'as datas do pedido não estavam na nota de proposta; quem registra as datas é Compras e o CCP'],
  [F + '06-Circuito-de-Compra.md', `> - Tudo isso exige contrato novo entre MES e hub. Detalhe em [[${V}]].`, `> - Tudo isso exige contrato novo entre MES e hub. Detalhe de \`C6\` a \`C8\` em [[${SEC06}]].`, 'o detalhe agora está na própria nota'],
  [F + 'Transversais/Telas-por-Raia.md', `## Proposta, Orçamento e comissão nova (\`V0\`, \`B1\` a \`B4\`, \`C6\` a \`C8\`, \`K1\` a \`K6\`) · [[${V}]]`, `## Proposta, Orçamento e comissão nova (\`V0\`, \`B1\` a \`B4\`, \`C6\` a \`C8\`, \`K1\` a \`K6\`) · [[${N}]] · [[02-Orcamento-Base-de-Preco]] · [[06-Circuito-de-Compra]] · [[15-Custo-Real-e-Comissao]]`, 'título da seção cobre quatro notas donas'],
];

const IGN = new Set(['.git', '.obsidian', 'node_modules', '_v3', 'v3']);
const notas = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (IGN.has(e.name)) continue; const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.md')) notas.push(p); } })(raiz);
const rel = (f) => path.relative(raiz, f).split(path.sep).join('/');

const de = path.join(raiz, F + V + '.md'), para = path.join(raiz, F + N + '.md');
if (fs.existsSync(de)) {
  console.log(`${simular ? '[simular] ' : ''}git mv ${F}${V}.md -> ${F}${N}.md`);
  if (!simular) execFileSync('git', ['mv', F + V + '.md', F + N + '.md'], { cwd: raiz });
}

let total = 0;
for (const f of notas.map((n) => (n === de && !simular ? para : n))) {
  const r = rel(f);
  if (r.endsWith('Mapa-v2-para-v3.md')) continue; // o mapa é atualizado à parte
  let t = fs.readFileSync(fs.existsSync(f) ? f : de, 'utf8');
  const antes = t;
  for (const [arq, a, b, motivo] of ESPECIAIS) if (arq === r && t.includes(a)) { t = t.replace(a, b); total++; console.log(`${r}: especial (${motivo})`); }
  const n = (t.match(new RegExp(`\\[\\[${V}(?=[\\]|#\\\\])`, 'g')) || []).length;
  if (n) { t = t.replace(new RegExp(`\\[\\[${V}(?=[\\]|#\\\\])`, 'g'), `[[${N}`); total += n; console.log(`${r}: ${n} link(s) → ${N}`); }
  if (t !== antes && !simular) fs.writeFileSync(fs.existsSync(f) ? f : para, t, 'utf8');
}

// a própria nota: título e frontmatter
if (!simular && fs.existsSync(para)) {
  let t = fs.readFileSync(para, 'utf8');
  const a = t;
  t = t.replace('tags: [fluxo, raia, vendas, proposta, pedido-de-venda, compras, v0, v1, v2, v3, c6, c7, c8, cancelamento, simulador, tela]', 'tags: [fluxo, raia, vendas, proposta, v0, simulador, tela]');
  t = t.replace('# Proposta e pedido de venda\n', '# Proposta de venda\n');
  t = t.replace(/^fontes: \[/m, 'fontes: [nota 11-Proposta-e-Pedido-de-Venda da v2 (tag v2-antes-da-v3), sem C6–C8, V1–V3 e B2–B4, que foram para 06, 03 e 02 em 05/11/2026, ');
  if (t !== a) { fs.writeFileSync(para, t, 'utf8'); console.log('título, tags e fontes ajustados'); }
}
console.log(`${simular ? 'SIMULAÇÃO — ' : ''}${total} trocas`);
