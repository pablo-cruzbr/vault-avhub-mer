// Bloco 4: cabeçalho padrão e frontmatter de navegação das notas de raia (01 a 15) e `ordem`/`proxima` no Mestre.
// - frontmatter: `ordem`, `nos` (já existe), `anterior`, `proxima`, `estado-em` (no lugar de `atualizado`), `develop-conferida` (já existe)
// - corpo: depois do parágrafo "Em uma frase", entram "Quando consultar" e "Onde estamos no fluxo"
// Uso: node _v3/scripts/cabecalho-raias.mjs [--simular]   (idempotente)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const R = path.join(raiz, '02-Fluxo-de-Atividades');
const simular = process.argv.includes('--simular');
const ESTADO_EM = '2026-11-05'; // data da reconferência dos selos contra a develop (Bloco 3)

const MESTRE = '00-Fluxo-Mestre-0b';
// ordem do fluxo = ordem do mermaid (F1); o texto de "Quando consultar" é uma frase por nota
const NOTAS = [
  ['01-Proposta-de-Venda', 'dúvidas sobre a proposta: como o vendedor monta, quem aprova, o que a proposta guarda e como ela vira pedido no Omie.'],
  ['02-Orcamento-Base-de-Preco', 'dúvidas sobre o preço de compra de um produto: de onde vem, como o histórico é guardado e como o vendedor pede cotação.'],
  ['03-Pedido-de-Venda-e-Liberacao', 'dúvidas sobre o pedido de venda: o portão de liberação, o cancelamento e o que o MES enxerga do pedido.'],
  ['04-PCP-Triagem-e-Destinacao', 'dúvidas sobre o PCP: como o pedido liberado é triado e para onde cada item vai (estoque, compra ou produção).'],
  ['05-Estoque-Atendimento', 'dúvidas sobre o que o almoxarife faz com a parcial: saldo, reserva, atender pelo estoque, comprar ou produzir.'],
  ['06-Circuito-de-Compra', 'dúvidas sobre compras: da necessidade à ordem de compra aprovada, o envio ao Omie e o acompanhamento até a entrega.'],
  ['07-Recebimento', 'dúvidas sobre a doca: conferência contra a nota fiscal, divergência e a criação do lote em quarentena.'],
  ['08-Qualidade-Entrada', 'dúvidas sobre a inspeção do material comprado: laudo, liberação do lote ou devolução para Compras.'],
  ['09-Estoque-Entrada-do-Lote', 'dúvidas sobre a entrada do lote no estoque depois da Qualidade: saldo, reserva e a entrada do fabricado.'],
  ['10-Producao-e-Roteiro', 'dúvidas sobre a fábrica: o roteiro por setores, a ordem de passagem, o histórico e o retorno de retrabalho.'],
  ['11-Qualidade-Saida', 'dúvidas sobre a inspeção do que a produção fabricou: aprovação e reprovação antes de seguir adiante.'],
  ['12-Estoque-Despacho', 'dúvidas sobre a saída física: o documento de retirada e o momento da baixa do saldo.'],
  ['13-Expedicao', 'dúvidas sobre a saída ao cliente: embalagem, pallets, entrega parcial ou integral, carga e transporte.'],
  ['14-Fiscal-Omie', 'dúvidas sobre a nota fiscal: o que o Omie emite, a baixa dos itens do pedido e o que o sistema só recebe.'],
  ['15-Custo-Real-e-Comissao', 'dúvidas sobre dinheiro do pedido: comissão estimada, custo real que chega ao longo do fluxo e a comissão final.'],
];

const link = (n) => `[[${n}]]`;
const resultado = [];
function ajustar(nome, txt, ordem, ant, prox, nos, consultar) {
  let t = txt;
  const m = t.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error(`${nome}: sem frontmatter`);
  let fm = m[1].split('\n').filter((l) => !/^(ordem|anterior|proxima):/.test(l));
  const iNos = fm.findIndex((l) => l.startsWith('nos:'));
  const extra = [];
  if (ant) extra.push(`anterior: "${link(ant)}"`);
  if (prox) extra.push(`proxima: "${link(prox)}"`);
  if (iNos >= 0) { fm.splice(iNos, 1, `ordem: ${ordem}`, fm[iNos], ...extra); }
  else { fm.splice(fm.findIndex((l) => l.startsWith('status:')) + 1, 0, `ordem: ${ordem}`, ...extra); }
  if (consultar) fm = fm.map((l) => (l.startsWith('atualizado:') ? `estado-em: ${ESTADO_EM}` : l));
  t = t.replace(m[0], `---\n${fm.join('\n')}\n---\n`);
  if (consultar) {
    // remove bloco antigo (idempotência) e reinsere depois do parágrafo "Em uma frase"
    t = t.replace(/\n\n\*\*Quando consultar:\*\*[^\n]*/, '').replace(/\n\n\*\*Onde estamos no fluxo:\*\*[^\n]*/, '');
    const lin = t.split('\n');
    const i = lin.findIndex((l) => l.startsWith('**Em uma frase:**'));
    if (i < 0) throw new Error(`${nome}: sem "Em uma frase"`);
    const nav = `**Onde estamos no fluxo:** ← ${ant ? link(ant) : 'início'} | ${prox ? link(prox) : 'fim do fluxo'} → · nós desta nota: ${nos.map((n) => '`' + n + '`').join(', ')}`;
    lin.splice(i + 1, 0, '', `**Quando consultar:** ${consultar}`, '', nav);
    t = lin.join('\n');
  }
  return t;
}

for (let k = 0; k < NOTAS.length; k++) {
  const [nome, consultar] = NOTAS[k];
  const arq = path.join(R, nome + '.md');
  const txt = fs.readFileSync(arq, 'utf8');
  const nos = (txt.match(/^nos: \[(.*)\]$/m) || [, ''])[1].split(',').map((s) => s.trim()).filter(Boolean);
  const ant = k === 0 ? MESTRE : NOTAS[k - 1][0];
  const prox = k === NOTAS.length - 1 ? null : NOTAS[k + 1][0];
  const novo = ajustar(nome, txt, k + 1, ant, prox, nos, consultar);
  if (novo !== txt) { resultado.push(nome); if (!simular) fs.writeFileSync(arq, novo, 'utf8'); }
}
// Mestre: só ordem e proxima no frontmatter
{
  const arq = path.join(R, MESTRE + '.md');
  const txt = fs.readFileSync(arq, 'utf8');
  const novo = ajustar(MESTRE, txt, 0, null, NOTAS[0][0], [], null);
  if (novo !== txt) { resultado.push(MESTRE); if (!simular) fs.writeFileSync(arq, novo, 'utf8'); }
}
console.log(`${simular ? '[simular] ' : ''}${resultado.length} notas alteradas:\n  ${resultado.join('\n  ')}`);
