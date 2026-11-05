// Bloco 3: grava `nos: [...]` no frontmatter de cada nota de raia (dono único de cada nó do mermaid).
// A tabela abaixo é a da seção 5 da instrução (D1: três notas de Estoque). Notas provisórias
// recebem os nós que terão depois da divisão; a nota que nascer da divisão recebe os seus ao nascer.
// Uso: node 07-Desenvolvimento/v3/scripts/nos-frontmatter.mjs [--simular]   (idempotente: troca a linha `nos:` se já existir)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const R = path.join(raiz, '02-Fluxo-de-Atividades');
const simular = process.argv.includes('--simular');
export const DONOS = {
  '01-Proposta-e-Pedido-de-Venda': ['V0.1', 'V0.2', 'V0.3', 'V0.4', 'V0.5', 'V0.6', 'V0.7', 'V0C'],
  '01-Proposta-de-Venda': ['V0.1', 'V0.2', 'V0.3', 'V0.4', 'V0.5', 'V0.6', 'V0.7', 'V0C'],
  '02-Orcamento-Base-de-Preco': ['B1', 'B2', 'B3', 'B4'],
  '03-Pedido-de-Venda-e-Liberacao': ['V1', 'V2', 'V3'],
  '04-PCP-Triagem-e-Destinacao': ['P1', 'P2', 'P6'],
  '05-Estoque-Atendimento-e-Despacho': ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'],
  '05-Estoque-Atendimento': ['E1', 'E2', 'E3', 'E4'],
  '06-Circuito-de-Compra': ['P3', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'FN1'],
  '07-Recebimento': ['R0', 'R1', 'R2', 'R3', 'R4', 'R6'],
  '08-Qualidade-Entrada': ['Q1', 'Q2', 'Q3', 'Q4'],
  '09-Estoque-Entrada-do-Lote': ['E5'],
  '10-Producao-e-Roteiro': ['F1'],
  '11-Qualidade-Saida': ['Q7', 'Q8'],
  '12-Estoque-Despacho': ['E6'],
  '13-Expedicao': ['X1', 'X2', 'X3', 'X4'],
  '14-Fiscal-Omie': ['O1', 'O2'],
  '15-Custo-Real-e-Comissao': ['K1', 'K2', 'K3', 'K4', 'K5', 'K6'],
};
if (process.argv[1] && process.argv[1].endsWith('nos-frontmatter.mjs')) {
  let n = 0;
  for (const [nota, nos] of Object.entries(DONOS)) {
    const f = path.join(R, nota + '.md');
    if (!fs.existsSync(f)) continue;
    const t = fs.readFileSync(f, 'utf8');
    const m = t.match(/^---\n([\s\S]*?)\n---\n/);
    if (!m) { console.log(`SEM FRONTMATTER: ${nota}`); continue; }
    const linha = `nos: [${nos.join(', ')}]`;
    let fm = m[1];
    fm = /^nos:.*$/m.test(fm) ? fm.replace(/^nos:.*$/m, linha) : fm.replace(/^(status:.*)$/m, `$1\n${linha}`);
    const novo = `---\n${fm}\n---\n` + t.slice(m[0].length);
    if (novo !== t) { n++; console.log(`${simular ? '[simular] ' : ''}${nota}: ${linha}`); if (!simular) fs.writeFileSync(f, novo, 'utf8'); }
  }
  console.log(`${simular ? 'SIMULAÇÃO — ' : ''}${n} notas alteradas`);
}
