// Bloco 3: move um grupo de trechos (nós com mais de uma casa) da nota de origem para a nota dona.
// Genérico: cada "parte" tira linhas exatas da origem e as põe, iguais, numa subseção da dona.
// Na origem fica uma frase com o link: no lugar da linha (texto) ou logo depois da tabela (linha de tabela).
// Idempotente: se o título da seção já existe na dona, nada muda.
// Uso: node _v3/scripts/mover-grupo.mjs <grupo> [--simular]     grupos: v1-v3, b1-b4
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const R = path.join(raiz, '02-Fluxo-de-Atividades');
const [, , grupo] = process.argv;
const simular = process.argv.includes('--simular');
const ler = (n) => fs.readFileSync(path.join(R, n + '.md'), 'utf8');

const TAB_TELAS = ['| Nome atual | Rota | App | Quem | Nó | Estado |', '|---|---|---|---|---|---|'];
const TAB_REGRAS = ['| # | Regra | Selo |', '|---|---|---|'];
const TAB_END = ['| Método e rota | Uso | Nó | Estado |', '|---|---|---|---|'];
const TAB_FALTA = ['| # | O quê | Dono | Nó | Selo |', '|---|---|---|---|---|'];
const TAB_PEND = ['| # | Pergunta | Dono |', '|---|---|---|'];

const GRUPOS = {
  'v1-v3': {
    origem: '01-Proposta-e-Pedido-de-Venda',
    dona: '03-Pedido-de-Venda-e-Liberacao',
    titulo: '### Pedido que nasce da proposta: liberação e cancelamento',
    marca: '### O que falta desenvolver',
    intro: 'Trechos que estavam na nota de proposta da v2 (`11-Proposta-e-Pedido-de-Venda`), movidos em 05/11/2026 para cá, a nota dona do pedido de venda (`V1` a `V3`), junto com o cancelamento do pedido. A numeração das regras e dos itens é a da nota de origem. A proposta em si está em [[01-Proposta-e-Pedido-de-Venda]].',
    partes: [
      { sub: '#### Passo a passo', linhas: ['8. O pedido nasce liberado e o PCP o vê na triagem. O pedido digitado direto no Omie segue o mesmo caminho: chega travado, com vendas pronta, e o vendedor responde e libera. `V1`, `V2`, `V3`'],
        frase: '8. O pedido nasce liberado e o PCP o vê na triagem (`V1` a `V3`): ver [[03-Pedido-de-Venda-e-Liberacao#Pedido que nasce da proposta: liberação e cancelamento]].' },
      { sub: '#### Regras que valem', linhas: [
        '- O pedido criado pela proposta nasce liberado, porque a Qualidade já foi respondida na proposta.',
        '- Pedido cancelado: a requisição e a OC ainda não emitida cancelam sozinhas. O que já foi comprado vai ao Estoque, livre.',
        '- Pedido já faturado: o cancelamento não desfaz compra nem produção.'],
        frase: '- O pedido nasce liberado; o cancelamento do pedido (antes e depois de faturar) está em [[03-Pedido-de-Venda-e-Liberacao#Pedido que nasce da proposta: liberação e cancelamento]].' },
      { sub: '#### O que já existe e o que falta', linhas: [
        '- ✅ Telas Liberar Pedidos e Liberação da Equipe.',
        '- 🔴 Cancelamento do pedido, com tarja na requisição e na OC.'],
        frase: '- Liberação e cancelamento do pedido: ver [[03-Pedido-de-Venda-e-Liberacao#Pedido que nasce da proposta: liberação e cancelamento]].' },
      { sub: '#### Regras decididas', cab: TAB_REGRAS, linhas: [
        '| 10 | O pedido criado pela proposta **nasce liberado**, sem `V3`. O `V1` tem duas origens, que seguem o mesmo fluxo e a mesma tela; o pedido digitado no Omie chega com a parte de vendas pronta (só se altera no Omie), e o vendedor responde `V2`/`V3` e preenche a parte de compras no Hub, sem travar o fluxo | 📝 N16-05, N16-106 |',
        '| 22 | **Pedido cancelado:** a requisição do PCP e a OC ainda não emitida são **canceladas sozinhas, com tarja**; a OC e o PCP são avisados; o que já foi comprado vai ao **Estoque, livre**, como lote com o custo da OC | 📝 N16-68, N16-69, N16-70 |',
        '| 23 | **Pedido já faturado:** o cancelamento não desfaz compra nem produção; fica só o abatimento da comissão e o saldo ainda não faturado, **parte por parte** | 📝 N16-71 |',
        '| 26 | Se alguém mexer no pedido no Omie depois, o sistema só avisa e traz a mudança | 📝 N16-30 |',
        '| 32 | **Pedidos de Venda e Notas Fiscais de Saída** ficam inativas também em produção | 📝 N16-33 |'],
        frase: 'As regras 10, 22, 23, 26 e 32 (pedido, liberação, cancelamento e telas de pedido) estão em [[03-Pedido-de-Venda-e-Liberacao#Pedido que nasce da proposta: liberação e cancelamento]], com a mesma numeração.' },
      { sub: '#### Liberação', linhas: [
        '#### Liberação',
        '',
        'O pedido da proposta nasce em `status_liberacao = liberado` (valores em [[03-Pedido-de-Venda-e-Liberacao]]); o histórico `liberado` é gravado **na resposta do `IncluirPedido`**, usando o `codigo_pedido_integracao` como chave ([[Estudo-Omie-API]]).'],
        semSub: true,
        frase: 'A liberação do pedido da proposta está em [[03-Pedido-de-Venda-e-Liberacao#Pedido que nasce da proposta: liberação e cancelamento]].' },
      { sub: '#### Telas', cab: TAB_TELAS, linhas: [
        '| Pedidos de Venda (lista do Omie) | `/vendas/pedidos-de-venda` | HUB | Vendedor | `V1` | ✅ página no código; **inativada também em produção** (N16-33) |',
        '| Notas Fiscais de Saída | `/vendas/notas-fiscais-saida` | HUB | — | — | ✅ página no código; **inativada também em produção** (N16-33) |',
        '| **Tarja de pedido cancelado** na requisição e na OC | nas telas da requisição e da OC | HUB, MES | Compras, PCP | cancelamento | 🔴 |',
        '| Liberar Pedidos, Liberação da Equipe | `/liberar-pedidos`, `/liberacao-equipe` | HUB | Vendedor, gerente | `V2`, `V3` | ✅ hoje; a resposta passa para a tela do pedido (N16-106) 🟡 |'],
        frase: 'As telas do pedido (Pedidos de Venda, Notas Fiscais de Saída, tarja de cancelado, Liberar Pedidos) estão em [[03-Pedido-de-Venda-e-Liberacao#Pedido que nasce da proposta: liberação e cancelamento]].' },
      { sub: '#### Endpoints', cab: TAB_END, linhas: [
        '| `POST /pedidos_venda_hub/:id/cancelar` | registrar o cancelamento do pedido no hub; avisa OC e PCP, cancela requisição e OC não emitida, manda o comprado ao Estoque | cancelamento | 🔴 🟡 nome |'],
        frase: 'A rota de cancelamento do pedido está em [[03-Pedido-de-Venda-e-Liberacao#Pedido que nasce da proposta: liberação e cancelamento]].' },
      { sub: '#### O Omie e o cancelamento', linhas: [
        '- ✅ **Existe cancelar pedido por API** (`CancelarPedidoVenda`, serviço `/produtos/pedidovendafat/`), e também `ExcluirPedido` e `AlterarPedidoVenda`. **Quem cancela, edita e exclui é o vendedor** (N16-84), não o Fiscal. O `ListarEtapasPedido` (`/produtos/pedidoetapas/`) devolve, por pedido, cancelamento, devolução e faturamento. **O hub guarda o cancelamento por conta própria** (quem, quando, motivo) porque o `exclusionSync` apagaria do hub um pedido excluído no Omie.'],
        frase: '- O cancelamento do pedido no Omie (`CancelarPedidoVenda`, quem cancela) está em [[03-Pedido-de-Venda-e-Liberacao#Pedido que nasce da proposta: liberação e cancelamento]].' },
      { sub: '#### O que falta (numeração da nota de proposta)', cab: TAB_FALTA, linhas: [
        '| 6 | Liberação gravada na resposta do `IncluirPedido`, com histórico | Gustavo | `V1` | 🔴 |',
        '| 13 | **Cancelamento:** registro no hub, requisição e OC não emitida canceladas com tarja, aviso à OC e ao PCP, comprado ao Estoque, ajuste do `exclusionSync` | Nathan, Gustavo, Robert (Estoque) | cancelamento | 🔴 |'],
        frase: 'Os itens 6 (liberação) e 13 (cancelamento) estão em [[03-Pedido-de-Venda-e-Liberacao#Pedido que nasce da proposta: liberação e cancelamento]].' },
      { sub: '#### Pendências (numeração da nota de proposta)', cab: TAB_PEND, linhas: [
        '| 4 | ✅ Quem cancela: o vendedor, por API (N16-84). Falta testar a diferença entre `CancelarPedidoVenda` e `ExcluirPedido` e quando cada um vale (OQ-17, OQ-48) | Nathan |',
        '| 8 | Estado do item que vai ao Estoque quando o pedido cancela e a reserva do MES | Robert |'],
        frase: 'As pendências 4 e 8 (cancelamento) estão em [[03-Pedido-de-Venda-e-Liberacao#Pedido que nasce da proposta: liberação e cancelamento]].' },
    ],
  },
  'b1-b4': {
    origem: '01-Proposta-e-Pedido-de-Venda',
    dona: '02-Orcamento-Base-de-Preco',
    titulo: '### Orçamento visto da proposta (B2 a B4)',
    marca: '### O que falta desenvolver',
    intro: 'Trechos que estavam na nota de proposta da v2 (`11-Proposta-e-Pedido-de-Venda`), movidos em 05/11/2026 para cá, a nota dona de `B1` a `B4`. A numeração das regras e dos itens é a da nota de origem. A proposta em si está em [[01-Proposta-e-Pedido-de-Venda]].',
    partes: [
      { sub: '#### Regras decididas', cab: TAB_REGRAS, linhas: [
        '| 21 | O pedido de custo ao Orçamento **não tem prazo fixo**; o tempo é **cronometrado**. O setor é novo (o Moisés é uma das pessoas) e o sistema funciona sem orçamentista | 📝 N16-58, N16-59, N16-104 |'],
        frase: 'A regra 21 (pedido de custo ao Orçamento, `B3`) está em [[02-Orcamento-Base-de-Preco#Orçamento visto da proposta (B2 a B4)]].' },
      { sub: '#### Telas', cab: TAB_TELAS, linhas: [
        '| **Página do produto** (histórico, top fornecedores com score, flutuação, volatilidade, média) | a definir 🟡 | HUB | Vendedor | `V0.2`, `B2` | 🔴 ([[02-Orcamento-Base-de-Preco]]) |'],
        frase: 'A página do produto (`B2`) está em [[02-Orcamento-Base-de-Preco#Orçamento visto da proposta (B2 a B4)]].' },
      { sub: '#### Endpoints do módulo de teste', cab: TAB_END, linhas: [
        '| `GET /produtos/:id/precos` | histórico, média e fornecedores | `B2` | ✅ `suprimentos.routes.ts:823` |',
        '| `POST /solicitacoes_custo` e `responder`, `assumir`, `liberar`, `cancelar` | pedido de custo (o prazo obrigatório de 2 dias úteis **sai**: N16-58) | `B3`, `B4` | ✅ `custos.routes.ts:304-510`; 🔴 ajuste |'],
        frase: 'As rotas de preço do produto e de pedido de custo (`B2` a `B4`) estão em [[02-Orcamento-Base-de-Preco#Orçamento visto da proposta (B2 a B4)]].' },
      { sub: '#### Como está no código (módulo de teste)', linhas: [
        '- ✅ **Pedido de custo** com prazo padrão de 2 dias úteis (`custos.routes.ts:378`) e rótulos `ATRASADA`, `VENCE_HOJE`, `NO_PRAZO` (`:338`): **saem** com N16-58 (cronômetro, sem prazo). `GET /produtos/:id/precos` (`suprimentos.routes.ts:823-880`).'],
        frase: '- O pedido de custo no módulo de teste está em [[02-Orcamento-Base-de-Preco#Orçamento visto da proposta (B2 a B4)]].' },
      { sub: '#### O que falta (numeração da nota de proposta)', cab: TAB_FALTA, linhas: [
        '| 15 | Página do produto e regras do score | Nathan, Robert, Pablo | `V0.2`, `B2` | 🔴 ([[02-Orcamento-Base-de-Preco]]) |'],
        frase: 'O item 15 (página do produto) está em [[02-Orcamento-Base-de-Preco#Orçamento visto da proposta (B2 a B4)]].' },
    ],
  },
};

function aplicar(g) {
  const G = GRUPOS[g];
  if (!G) throw new Error('grupo desconhecido: ' + g);
  let dona = ler(G.dona);
  if (dona.includes(G.titulo)) { console.log(`já feito: "${G.titulo}" existe em ${G.dona}`); return; }
  let ls = ler(G.origem).split('\n');
  const blocos = [G.titulo, '', G.intro, ''];
  for (const p of G.partes) {
    const ehTabela = p.linhas[0].startsWith('|');
    // linhas de tabela: cada uma pela própria posição; texto: bloco contíguo a partir da primeira linha
    // (procurar linha vazia isolada acharia a primeira linha vazia da nota)
    const i0 = ls.indexOf(p.linhas[0]);
    const idx = ehTabela ? p.linhas.map((l) => ls.indexOf(l))
      : p.linhas.map((l, k) => (k === 0 ? i0 : ls[i0 + k] === l ? i0 + k : ls.indexOf(l)));
    idx.forEach((i, k) => { if (i < 0 || (!ehTabela && k > 0 && p.linhas[k] === '' && i !== i0 + k)) throw new Error(`não achei em ${G.origem}: ${p.linhas[k].slice(0, 90) || '(linha vazia)'}`); });
    let pos;
    if (ehTabela) { pos = idx[0]; while (pos + 1 < ls.length && ls[pos + 1].startsWith('|')) pos++; } // fim da tabela
    const primeiro = Math.min(...idx);
    // marca para remoção
    const remover = new Set();
    if (!ehTabela && idx.length > 1 && idx.every((i, k) => k === 0 || i === idx[k - 1] + 1)) {
      for (let i = idx[0]; i <= idx[idx.length - 1]; i++) remover.add(i);
    } else idx.forEach((i) => remover.add(i));
    const novas = [];
    ls.forEach((l, i) => {
      if (!ehTabela && i === primeiro) novas.push(p.frase);
      if (!remover.has(i)) novas.push(l);
      if (ehTabela && i === pos) { novas.push(''); novas.push(p.frase); }
    });
    ls = novas;
    if (!p.semSub) blocos.push(p.sub, '');
    if (p.cab) blocos.push(...p.cab);
    blocos.push(...p.linhas, '');
  }
  const i = dona.indexOf(G.marca);
  if (i < 0) throw new Error(`marca não achada em ${G.dona}`);
  dona = dona.slice(0, i) + blocos.join('\n') + '\n' + dona.slice(i);
  if (simular) { console.log(`[simular] ${g}: ${G.partes.length} partes de ${G.origem} para ${G.dona}`); return; }
  fs.writeFileSync(path.join(R, G.origem + '.md'), ls.join('\n'), 'utf8');
  fs.writeFileSync(path.join(R, G.dona + '.md'), dona, 'utf8');
  console.log(`feito ${g}`);
}
aplicar(grupo);
