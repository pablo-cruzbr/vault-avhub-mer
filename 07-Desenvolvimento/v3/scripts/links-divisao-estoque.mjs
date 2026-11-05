// Bloco 3: links para a nota provisória 05-Estoque-Atendimento-e-Despacho, decididos um por um
// pelo assunto (atendimento/saldo/reserva → 05, entrada do lote/fabricado → 09, retirada/despacho → 12).
// Uso: node _v3/scripts/links-divisao-estoque.mjs [--simular]   (idempotente: depois de aplicado, nada casa)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const simular = process.argv.includes('--simular');
const V = '05-Estoque-Atendimento-e-Despacho';
const A = '05-Estoque-Atendimento', L = '09-Estoque-Entrada-do-Lote', D = '12-Estoque-Despacho';
const tres = `[[${A}]] (E1–E4) · [[${L}]] (E5) · [[${D}]] (E6)`;

// [arquivo, linha, destino(s) na ordem das ocorrências da linha, motivo]
const DECISOES = [
  ['00-Inicio/Mapa-v1-para-v2.md', 25, [A], 'nota v1 de Estoque/Revenda no PCP: atendimento'],
  ['00-Inicio/Mapa-v1-para-v2.md', 38, [A], 'Rota-Estoque da v1: visão geral, entra pelo atendimento'],
  ['00-Inicio/Mapa-v1-para-v2.md', 45, [A], 'regras de negócio do Estoque: as regras gerais ficaram em 05'],
  ['00-Inicio/Mapa-v1-para-v2.md', 49, [A], 'fluxo completo do Estoque: começa no atendimento'],
  ['01-Projeto/Equipe-e-Divisao.md', 47, [A], 'almoxarife na tela Atendimento'],
  ['01-Projeto/Visao-do-Projeto.md', 45, [A], 'E1 a E4'],
  ['01-Projeto/Visao-do-Projeto.md', 51, [D], 'despacho antes da Expedição'],
  ['01-Projeto/Visao-do-Projeto.md', 104, [D], 'baixa na Embalagem e documento de retirada'],
  ['02-Fluxo-de-Atividades/04-PCP-Triagem-e-Destinacao.md', 72, [A], 'próxima raia depois do PCP'],
  ['02-Fluxo-de-Atividades/04-PCP-Triagem-e-Destinacao.md', 76, [A], 'saída do PCP'],
  ['02-Fluxo-de-Atividades/04-PCP-Triagem-e-Destinacao.md', 109, [A], 'tabela Reserva (estados em 05)'],
  ['02-Fluxo-de-Atividades/06-Circuito-de-Compra.md', 90, [A], 'E4 solicitar compra'],
  ['02-Fluxo-de-Atividades/07-Recebimento.md', 208, [A], 'tabela lotes (Dados em 05)'],
  ['02-Fluxo-de-Atividades/07-Recebimento.md', 222, [A], 'saldo futuro vira saldo atual (E1)'],
  ['02-Fluxo-de-Atividades/08-Qualidade-Entrada.md', 26, [L], 'parcial volta ao Estoque, E5'],
  ['02-Fluxo-de-Atividades/10-Producao-e-Roteiro.md', 13, [D], 'entrada vem do despacho (E6)'],
  ['02-Fluxo-de-Atividades/11-Qualidade-Saida.md', 119, [L], 'receber-fabricado cria o lote PRODUCAO'],
  ['02-Fluxo-de-Atividades/13-Expedicao.md', 74, [L, D], '1ª: fabricado volta ao Estoque (E5); 2ª: documento de retirada (E6)'],
  ['02-Fluxo-de-Atividades/13-Expedicao.md', 203, [D], 'raia vizinha anterior à Expedição'],
  ['02-Fluxo-de-Atividades/Transversais/Estados-e-Status.md', 99, [A], 'estados da Reserva (em 05)'],
  ['02-Fluxo-de-Atividades/Transversais/Estados-e-Status.md', 258, [A], 'estados da Reserva (em 05)'],
  ['04-Dados/Modelo-Estoque-e-Custo-do-Lote.md', 72, [D], 'documento de retirada (E6)'],
  ['07-Desenvolvimento/Backlog-por-Frente.md', 49, [A], 'regra 17, saldo futuro (em 05)'],
  ['07-Desenvolvimento/Pontas-Soltas.md', 80, [A], 'saldo futuro (E1)'],
  ['08-Decisoes/Registro-de-Decisoes.md', 326, [A], 'fonte geral do Estoque (alias da v2 mantido)'],
  ['08-Decisoes/Registro-de-Decisoes.md', 392, [A], 'saldo zero exige clique (regra 4, em 05)'],
  ['08-Decisoes/Registro-de-Decisoes.md', 457, [A], 'matéria-prima no atendimento (E4, em 05)'],
  ['09-Diagramas/Indice-de-Diagramas.md', 103, [A], 'telas de movimentação e ajuste (em 05)'],
  ['09-Diagramas/Sequencia.md', 252, [D], 'documento de retirada'],
  ['09-Diagramas/Sequencia.md', 286, [D], 'baixa na Embalagem, sem retirada'],
];

// linhas estruturais (lista das raias): trocadas por texto completo
const ESTRUTURAIS = [
  ['00-Inicio/Home.md', (t) => t.replace(`[[${V}]] → [[06-Circuito-de-Compra]] → [[07-Recebimento]] → [[08-Qualidade-Entrada]] → [[10-Producao-e-Roteiro]] → [[11-Qualidade-Saida]] → [[13-Expedicao]]`,
    `[[${A}]] → [[06-Circuito-de-Compra]] → [[07-Recebimento]] → [[08-Qualidade-Entrada]] → [[${L}]] → [[10-Producao-e-Roteiro]] → [[11-Qualidade-Saida]] → [[${D}]] → [[13-Expedicao]]`), 'sequência das raias'],
  ['00-Inicio/Onde-Estamos.md', (t) => t.replace(`| [[${V}]] | ✅ Atendimento · 🔴 despacho |`, `| [[${A}]] · [[${L}]] · [[${D}]] | ✅ Atendimento · 🔴 despacho |`)
    .replace(`| [[${V}]] | E1–E6 |`, `| ${tres.replace(/\|/g, '\\|')} | E1–E6 |`), 'tabelas de status por raia'],
  ['02-Fluxo-de-Atividades/00-Fluxo-Mestre-0b.md', (t) => t
    .replace(`| Estoque | E1–E6 | [[${V}]] |`, `| Estoque: atendimento | E1–E4 | [[${A}]] |`)
    .replace(/(\| Qualidade de entrada \| Q1–Q4 \| \[\[08-Qualidade-Entrada\]\] \|\n)(?!\| Estoque: entrada)/, `$1| Estoque: entrada do lote | E5 | [[${L}]] |\n`)
    .replace(/(\| Qualidade de saída \| [^\n]*\n)(?!\| Estoque: despacho)/, `$1| Estoque: despacho | E6 | [[${D}]] |\n`), 'tabela raia → nota'],
  ['02-Fluxo-de-Atividades/11-Qualidade-Saida.md', (t) => t.replace(`Raias vizinhas: [[10-Producao-e-Roteiro]], [[${V}]], [[13-Expedicao]].`,
    `Raias vizinhas: [[10-Producao-e-Roteiro]], [[${L}]] (o fabricado aprovado vira lote), [[${D}]], [[13-Expedicao]].`), 'raias vizinhas da Qualidade de saída'],
  ['02-Fluxo-de-Atividades/Transversais/Telas-por-Raia.md', (t) => t.replace(`## Estoque (E1 a E6) · [[${V}]]`, `## Estoque (E1 a E6) · ${tres}`), 'título da seção de Estoque'],
];

let total = 0;
for (const [arq, n, destinos, motivo] of DECISOES) {
  const p = path.join(raiz, arq);
  const ls = fs.readFileSync(p, 'utf8').split('\n');
  const l = ls[n - 1];
  let k = 0;
  const nova = l.replace(new RegExp(`\\[\\[${V}((?:\\\\?\\|)[^\\]]*)?\\]\\]`, 'g'), (m, resto) => {
    const d = destinos[Math.min(k++, destinos.length - 1)];
    return `[[${d}${resto ?? ''}]]`;
  });
  if (k === 0) { console.log(`(já feito ou não achado) ${arq}:${n}`); continue; }
  if (k !== destinos.length) console.log(`AVISO ${arq}:${n}: ${k} ocorrências, ${destinos.length} decisões`);
  total += k;
  console.log(`${arq}:${n} → ${destinos.join(', ')}  (${motivo})`);
  ls[n - 1] = nova;
  if (!simular) fs.writeFileSync(p, ls.join('\n'), 'utf8');
}
for (const [arq, fn, motivo] of ESTRUTURAIS) {
  const p = path.join(raiz, arq);
  const t = fs.readFileSync(p, 'utf8');
  const n = fn(t);
  if (n === t) { console.log(`(já feito) ${arq}`); continue; }
  total++;
  console.log(`${arq} → 05, 09 e 12  (${motivo})`);
  if (!simular) fs.writeFileSync(p, n, 'utf8');
}
console.log(`${simular ? 'SIMULAÇÃO — ' : ''}${total} trocas`);
