// Bloco 3 (F5): todo ✅ cita o repositório. Este script põe o repositório logo depois do primeiro ✅ da linha,
// decidido linha a linha (05/11/2026) pelo que a linha descreve: tela → av-hub ou app-pcp; API e banco do hub →
// api-acos-vital; MES → api-pcp; pipeline → omie-elt-pipeline; módulo de teste do Pablo → av-hub/api-comercial.
// "decidir" troca ✅ por 📝: a linha registra uma decisão ou resposta, não código (tabela de selos, F5).
// O commit lido da develop vai no frontmatter (develop-conferida), uma vez por nota (decisão do Nathan, 05/11).
// Uso: node _v3/scripts/selos-repositorio.mjs [--simular]   (idempotente: linha já marcada não muda)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const simular = process.argv.includes('--simular');
const F = path.join(raiz, '02-Fluxo-de-Atividades');
const H = 'av-hub', A = 'api-acos-vital', P = 'api-pcp', M = 'app-pcp', O = 'omie-elt-pipeline', T = 'av-hub/api-comercial';
// [nota, trecho único da linha, repositório(s) ou 'decidir']
const L = [
  ['01-Proposta-de-Venda', '✅ Lista de propostas, nova proposta', [H]],
  ['01-Proposta-de-Venda', '✅ Meus Pedidos, com a etapa dos itens.', [H]],
  ['01-Proposta-de-Venda', '✅ o gestor vê o time', [A]],
  ['01-Proposta-de-Venda', '| Relatório Gerencial | `/vendas/relatorio-gerencial`', [H]],
  ['01-Proposta-de-Venda', '### Como está no código (✅ do módulo do Pablo)', [T]],
  ['01-Proposta-de-Venda', 'as páginas de Vendas já estão em `app/(protected)/vendas/*` ✅', [H]],
  ['01-Proposta-de-Venda', '✅ O `IncluirPedido` aceita o **nosso código de integração**', ['Omie']],
  ['01-Proposta-de-Venda', '| 2 | Estado `APROVADA`, trava de ajuste', [A]],
  ['01-Proposta-de-Venda', '| 3 | Cancelar com motivo: rota feita', [A]],
  ['01-Proposta-de-Venda', '| 4 | Botão "Transformar em pedido"', [A]],
  ['01-Proposta-de-Venda', '| 8 | Trocar a AwesomeAPI pela PTAX', [H]],
  ['01-Proposta-de-Venda', '| 1 | ✅ Alçada de desconto e margem', 'decidir'],
  ['02-Orcamento-Base-de-Preco', '| Pedidos de custo (Painel do Comprador) |', [H]],
  ['02-Orcamento-Base-de-Preco', '| Fornecedores (e ficha) |', [H]],
  ['02-Orcamento-Base-de-Preco', '| Parâmetros de custo |', [H]],
  ['02-Orcamento-Base-de-Preco', '| Custo por item |', [H]],
  ['02-Orcamento-Base-de-Preco', '| Custo do item (oculta) |', [A]],
  ['02-Orcamento-Base-de-Preco', '| Solicitações de custo (oculta, em Vendas) |', [A]],
  ['02-Orcamento-Base-de-Preco', '### Como está no código (✅)', [T]],
  ['02-Orcamento-Base-de-Preco', '✅ **Resposta com oferta no Painel do Comprador:**', [H]],
  ['03-Pedido-de-Venda-e-Liberacao', '✅ Telas Liberar Pedidos e Liberação da Equipe, e as rotas da API.', [H, A]],
  ['03-Pedido-de-Venda-e-Liberacao', '✅ O MES lê os liberados', [P]],
  ['03-Pedido-de-Venda-e-Liberacao', '✅ Cartão "Etapa dos itens"', [H]],
  ['03-Pedido-de-Venda-e-Liberacao', '- ✅ Telas Liberar Pedidos e Liberação da Equipe.', [H]],
  ['03-Pedido-de-Venda-e-Liberacao', '| Notas Fiscais de Saída | `/vendas/notas-fiscais-saida`', [H]],
  ['03-Pedido-de-Venda-e-Liberacao', '| Liberar Pedidos, Liberação da Equipe | `/vendas/liberar-pedidos`', [H]],
  ['03-Pedido-de-Venda-e-Liberacao', '| 4 | ✅ Quem cancela: o vendedor', 'decidir'],
  ['03-Pedido-de-Venda-e-Liberacao', '| 2 | ✅ Pedidos anteriores à data de corte', [P]],
  ['04-PCP-Triagem-e-Destinacao', '✅ Na `develop` (27/10): Ordem de Produção como documento impresso', [P, M]],
  ['04-PCP-Triagem-e-Destinacao', '✅ Na `develop` (22/10): Montagem do Roteiro', [P, M]],
  ['04-PCP-Triagem-e-Destinacao', '| 15 | **Se o Compras já emitiu OC vinculada', [P]],
  ['04-PCP-Triagem-e-Destinacao', '🔴 **OC do pedido na Triagem e na Destinação (N14-20).**', [P]],
  ['04-PCP-Triagem-e-Destinacao', '| 4 | Baixa de matéria-prima na retirada do Estoque (J2, J3; N16-140)', [P]],
  ['04-PCP-Triagem-e-Destinacao', '| 7 | **Ordem de Produção: entidade e documento imprimível**', [P]],
  ['05-Estoque-Atendimento', '✅ Telas Atendimento, Saldo, Reservas', [M]],
  ['05-Estoque-Atendimento', '✅ Reserva, divisão da parcial, solicitar compra', [P]],
  ['05-Estoque-Atendimento', '✅ Na `develop` do MES: fabricado aprovado vira lote', [P]],
  ['05-Estoque-Atendimento', '| 17 | **Saldo futuro:**', [P]],
  ['05-Estoque-Atendimento', '| Saldo | Consulta de Saldo |', [M]],
  ['05-Estoque-Atendimento', '| Reservas | — | `/estoque-operacao/reservas`', [M]],
  ['05-Estoque-Atendimento', '| Movimentação | — | `/estoque-operacao/movimentacao`', [M]],
  ['05-Estoque-Atendimento', '| Lote (detalhe, etiqueta) |', [M, P]],
  ['05-Estoque-Atendimento', '| `PUT /estoque/lotes/:id/custo` |', [P]],
  ['05-Estoque-Atendimento', '✅ **Custo do item (na `develop`, 27/10).**', [P]],
  ['05-Estoque-Atendimento', '✅ **Enviar à produção**', [P]],
  ['05-Estoque-Atendimento', '| 3 | `GET /itens/custo`: feito na `develop`', [P]],
  ['05-Estoque-Atendimento', '| 4 | `lote_custo` com `origem = OC`', [P]],
  ['05-Estoque-Atendimento', '| 5 | Baixa de matéria-prima **na retirada**', [P]],
  ['06-Circuito-de-Compra', '✅ Telas das duas origens, emissão da OC', [H, M]],
  ['06-Circuito-de-Compra', '| Dashboard de Compras, Compradores |', [H]],
  ['06-Circuito-de-Compra', '| `GET /ordens-compra/referencia` | MES (job)', [A]],
  ['06-Circuito-de-Compra', '| `GET /compras/requisicoes/referencia` | MES (job)', [A]],
  ['06-Circuito-de-Compra', '#### C2 e C3: aprovação (✅ código igual à decisão)', [A]],
  ['06-Circuito-de-Compra', '✅ 📝 **Regra (N14-21):**', [A]],
  ['06-Circuito-de-Compra', '✅ HUB `/compras/followup`', [H, A]],
  ['06-Circuito-de-Compra', '| 2 | **MES ler as OCs do hub:**', [P]],
  ['06-Circuito-de-Compra', '| 3 | Job do contrato 004/007 no MES', [P]],
  ['06-Circuito-de-Compra', '| 8 | Aviso ao PCP e ao vendedor quando a previsão de chegada atrasa', 'decidir'],
  ['07-Recebimento', '✅ Telas de recebimento, recontagem e decisão do PCP', [M]],
  ['07-Recebimento', '✅ Recebimento parcial com divisão da parcial.', [P]],
  ['07-Recebimento', '✅ Na `develop` do MES: o custo da OC é gravado no lote', [P]],
  ['07-Recebimento', '| 13 | **Custo do lote vem da OC.**', [P]],
  ['07-Recebimento', '| `POST /compras/requisicoes/:id/recebimentos` | — | **Removida**', [P]],
  ['07-Recebimento', '✅ **Feito na `develop` do MES (16 a 20/10/2026, BL-051):**', [P]],
  ['07-Recebimento', '| 1 | Gravar o custo da OC no lote', [P]],
  ['07-Recebimento', '| 3 | Caminho de entrada da mercadoria de OC sem requisição do MES', [P]],
  ['08-Qualidade-Entrada', '✅ Tela de inspeção, aprovação, reprovação com cisão', [M]],
  ['08-Qualidade-Entrada', '✅ Substituição que se une à parte em quarentena', [P]],
  ['08-Qualidade-Entrada', '| Inspeção de entrada é por **lote**;', [P]],
  ['08-Qualidade-Entrada', '| Login | Escritório entra por Azure AD', [P]],
  ['09-Estoque-Entrada-do-Lote', '| 11 | **Tudo que é fabricado ou comprado vai para o Estoque**', [P]],
  ['09-Estoque-Entrada-do-Lote', '✅ **Fabricado (na `develop`, 27/10, `ab3318d`):**', [P]],
  ['09-Estoque-Entrada-do-Lote', '| 2 | Fabricado vira lote e saldo: feito na `develop`', [P]],
  ['10-Producao-e-Roteiro', '✅ Roteiro, filas por setor, receber, iniciar', [P, M]],
  ['10-Producao-e-Roteiro', '✅ Telas: Filas de Produção, Destinação do Pedido', [M]],
  ['10-Producao-e-Roteiro', '✅ Na `develop` (23/10): ação "finalizar" no setor', [P]],
  ['10-Producao-e-Roteiro', '✅ Na `develop` (27/10): Ordem de Produção impressa', [P]],
  ['10-Producao-e-Roteiro', '| 11 | **Tudo que é fabricado volta ao Estoque**', [P]],
  ['10-Producao-e-Roteiro', '| 13 | Novo norte (P6):', [P]],
  ['10-Producao-e-Roteiro', '| `PATCH /:id/finalizar`, `PATCH /:id/reabrir` |', [P]],
  ['10-Producao-e-Roteiro', '| `PATCH /:id/aprovar-saida`, `PATCH /:id/receber-fabricado` |', [P]],
  ['10-Producao-e-Roteiro', '#### Fabricado vira lote ✅ (só na `develop`)', [P]],
  ['10-Producao-e-Roteiro', '| 1 | Baixa de matéria-prima na retirada do Estoque (N16-140) e genealogia', [P]],
  ['10-Producao-e-Roteiro', '| 2 | Fabricado aprovado vira lote e saldo: feito na `develop`', [P]],
  ['10-Producao-e-Roteiro', '| 3 | `RoteiroItem` lido por `mover`', [P]],
  ['11-Qualidade-Saida', '✅ Telas de inspeção e fila da Qualidade', [M]],
  ['11-Qualidade-Saida', '✅ Na `develop` (27/10): o "sim" leva ao Estoque', [P]],
  ['11-Qualidade-Saida', '| 5 | Aprovado volta ao Estoque: **lote e saldo do fabricado**', [P]],
  ['11-Qualidade-Saida', '| 7 | Inspeção de saída tem trava de laudo?', [P]],
  ['11-Qualidade-Saida', '| `PATCH /itens-parciais/:id/receber-fabricado` `{ idLocalizacao }` |', [P]],
  ['11-Qualidade-Saida', '| 1 | O "sim" do Q8 leva ao Estoque', [P]],
  ['11-Qualidade-Saida', '| 2 | Ação explícita de aprovar na inspeção', [P]],
  ['13-Expedicao', '✅ Fila, pallets, confirmar entrega com comprovante', [M, P]],
  ['13-Expedicao', '#### X1 · paletes ✅', [M, P]],
  ['14-Fiscal-Omie', '| 2 | A baixa de item no pedido volta pelo **pipeline**', [O]],
  ['15-Custo-Real-e-Comissao', '✅ Motor atual de comissão, só leitura aqui.', [A]],
  ['15-Custo-Real-e-Comissao', '✅ Simulador de Comissão, usado como referência', [H]],
  ['15-Custo-Real-e-Comissao', '| `C4` | O valor da OC, por item, vinculado ao pedido de venda', [A]],
  ['15-Custo-Real-e-Comissao', '| `R4` | O lote nasce com custo, **obrigatório**', [P]],
  ['15-Custo-Real-e-Comissao', '| `E3` | Item atendido pelo Estoque usa o **custo real do lote**', [P]],
  ['15-Custo-Real-e-Comissao', '| `E5` | O fabricado aprovado vira lote;', [P]],
  ['15-Custo-Real-e-Comissao', '| Motor atual (menor entre o percentual', [A]],
  ['15-Custo-Real-e-Comissao', '| Custo obrigatório em todo lote e `GET /itens/custo` |', [P]],
];
const tag = (rs) => ' (' + rs.map((r) => (r === 'Omie' ? 'Omie, [[Estudo-Omie-API]]' : '`' + r + '`')).join(', ') + ')';
let n = 0, decid = 0;
const porNota = {};
for (const x of L) (porNota[x[0]] ||= []).push(x);
for (const [nota, lista] of Object.entries(porNota)) {
  const p = path.join(F, nota + '.md');
  const ls = fs.readFileSync(p, 'utf8').split('\n');
  for (const [, trecho, rs] of lista) {
    const idx = ls.findIndex((l) => l.includes(trecho));
    if (idx < 0) { console.log(`AVISO ${nota}: não achei "${trecho}"`); continue; }
    const l = ls[idx];
    if (rs === 'decidir') {
      if (!l.includes('✅')) continue; // já trocado
      ls[idx] = l.replace('✅', '📝'); decid++;
      console.log(`${nota}:${idx + 1} ✅ → 📝 (decisão, não código)`);
      continue;
    }
    const t = tag(rs);
    if (l.includes('✅' + t)) continue; // já marcado
    const i = l.indexOf('✅');
    if (i < 0) { console.log(`AVISO ${nota}:${idx + 1} sem ✅`); continue; }
    ls[idx] = l.slice(0, i + 1) + t + l.slice(i + 1);
    n++;
  }
  if (!simular) fs.writeFileSync(p, ls.join('\n'), 'utf8');
}
console.log(`${simular ? 'SIMULAÇÃO — ' : ''}${n} ✅ com repositório; ${decid} ✅ trocados por 📝`);
