// Bloco 3: move trechos de nós com mais de uma casa para a nota dona.
// Cada grupo tira linhas exatas da nota de origem (deixando uma frase e o link) e monta uma seção na
// nota dona com as mesmas linhas, sem reescrever. Idempotente: se a seção de destino já existe, pula.
// Uso: node 07-Desenvolvimento/v3/scripts/mover-trechos.mjs <grupo> [--simular]     grupos: c6-c8, v1-v3, b1-b4
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const R = path.join(raiz, '02-Fluxo-de-Atividades');
const [, , grupo] = process.argv;
const simular = process.argv.includes('--simular');
const ORIGEM = '01-Proposta-e-Pedido-de-Venda';

const ler = (n) => fs.readFileSync(path.join(R, n + '.md'), 'utf8');
function tirar(t, linhas, nota) {
  for (const l of linhas) {
    if (!t.includes(l + '\n')) throw new Error(`não achei em ${nota}: ${l.slice(0, 90)}`);
    t = t.replace(l + '\n', '');
  }
  return t;
}
function trocar(t, a, b, nota) {
  if (!t.includes(a)) throw new Error(`não achei em ${nota}: ${a.slice(0, 90)}`);
  return t.replace(a, b);
}
function inserirAntes(t, marca, bloco, nota) {
  const i = t.indexOf(marca);
  if (i < 0) throw new Error(`marca não achada em ${nota}: ${marca}`);
  return t.slice(0, i) + bloco + '\n' + t.slice(i);
}

const GRUPOS = {
  'c6-c8': {
    dona: '06-Circuito-de-Compra',
    titulo: '### C6, C7 e C8: a parte de compras do pedido da proposta',
    marca: '### O que falta desenvolver',
    passos: [
      '9. Compras recebe a requisição. O sistema puxa da proposta impostos, frete e fornecedor. Compras confere, edita e usa o valor correto na OC. A proposta não muda. `C6`, `C7`',
      '10. Se Compras comprar por mais que o valor da proposta, o vendedor recebe um aviso em Meus Pedidos. Ele aprova ou reprova, produto por produto. `C8`',
    ],
    regrasQueValem: [
      '- Compras não altera a proposta. O preço fechado com o cliente não muda.',
      '- Compra acima do valor da proposta: o vendedor aprova ou reprova, por produto, sem tolerância e sem tempo limite.',
      '- Se ele reprova, Compras leva o caso à Gerência pessoalmente. A Gerência não cancela no sistema.',
      '- Aviso favorável (a margem sobe) é só informativo.',
    ],
    regras: [
      '| 14 | Compras confere a parte de compras da proposta (`C6`): o sistema **puxa os dados da proposta**; Compras confere os impostos, edita no hub, pode usar o fornecedor do vendedor ou outro, e usa o valor correto na OC (`C7`) | 📝 N16-08, N16-38, N16-53 |',
      '| 15 | Compras **não altera** a proposta; o preço fechado com o cliente não muda | 📝 N16-08, N16-17 |',
      '| 16 | **Compra acima do valor da proposta (`C8`):** o vendedor é avisado em **Meus Pedidos** e **aprova ou reprova, por produto, sem tolerância e sem tempo limite**. Aprovada, o processo continua e a margem e a comissão dele caem. **Supera** a regra antiga de que o vendedor não recebe aviso | 📝 N16-60, N16-61, N16-63, N16-64 |',
      '| 17 | O aviso traz PV e OC, **margem atual** (do simulador), **margem considerada** (da compra real), **motivo escrito por Compras** (obrigatório), diferença de custo e fornecedor com prazo e pagamento | 📝 N16-62 |',
      '| 18 | Aviso **favorável** (a margem sobe) é só informativo | 📝 N16-65 |',
      '| 19 | Vendedor reprova: **Compras leva o caso à Gerência (João Vitor ou Sérgio Vital), fisicamente**, e, se preciso, fala com o vendedor. A Gerência **não cancela** no sistema e a aprovação dela **é conversa**, não botão. Compras resolve (busca valor melhor) e notifica o vendedor, que só vê a notificação e resolve fisicamente | 📝 N16-61, N16-65, N16-66, N16-67 |',
      '| 20 | Compras tem uma **lista dos casos reprovados ainda sem solução** e um mecanismo para registrar a solução | 📝 N16-73; 🟡 o desenho |',
      '| 30 | Compras vê a mesma tela em **leitura** (cotado do vendedor ao lado do valor da OC, em `C6`); o valor correto entra na **OC** (`C7`), não na proposta | 📝 N16-08, N16-19 |',
    ],
    estado: [
      '#### Pedido de aprovação do vendedor (`C8`) 🟡',
      '',
      'Estados propostos (N16-66, N16-73): `PENDENTE` (na lista do vendedor, sem tempo limite), `APROVADO` (a compra segue), `REPROVADO` (em tratativa: entra na **lista de Compras**) e `RESOLVIDO` (Compras registrou a solução: novo valor, novo fornecedor, mantido ou pedido cancelado; o vendedor foi notificado). O tempo em cada estado é cronometrado.',
      '',
    ],
    telas: [
      '| **Meus Pedidos**, com o andamento da venda e **o que está aberto para o vendedor** (aprovar ou reprovar compra acima do valor) | `/meus-pedidos` 🟡 | HUB | Vendedor | `C8` | 🔴 a tela existe e outra frente a evolui (encerramento por saldo zerado, SQL-014); a área de pendências é nova |',
      '| **Lista de casos reprovados pelo vendedor** (sem solução) | `/compras/...` 🟡 | HUB | Comprador | `C8` | 🔴 |',
      '| Visão de Compras da mesma tela (leitura) | dentro de `/compras/nova/[requisicaoId]` 🟡 | HUB | Comprador | `C6`, `C7` | 🔴 |',
      '| Conferência de Compras (parte de compras da proposta) | dentro de `/compras/nova/[requisicaoId]` 🟡 | HUB | Comprador | `C6`, `C7` | 🔴 |',
    ],
    endpoints: [
      '| `GET /divergencias_compra`, `POST /:id/aprovar`, `/:id/reprovar`, `/:id/resolver` | aviso ao vendedor, decisão dele e solução de Compras | `C8` | 🔴 🟡 nomes |',
    ],
    dados: [
      '| `divergencias_compra` (pedido, produto, valor da proposta, valor da compra, motivo, estado, quem decidiu e quando, solução, tempos) | uma linha por produto (N16-63); estados `PENDENTE`, `APROVADO`, `REPROVADO`, `RESOLVIDO` 🟡 |',
    ],
    falta: [
      '| 7 | `C6` e `C7` na tela de emissão da OC: mostrar a parte de compras da proposta, puxar fornecedor e impostos, editar, gravar o valor correto sem tocar a proposta | Nathan, Gustavo | `C6`, `C7` | 🔴 |',
      '| 12 | **`C8`:** aviso e aprovação em Meus Pedidos, tabela `divergencias_compra`, lista de Compras dos reprovados e registro da solução | Nathan, Robert, Gustavo | `C8` | 🔴 |',
    ],
    pendencias: [
      '| 6 | O e-mail de Compras ao vendedor deixa de ser necessário? (N16-64) | Nathan, Compras |',
      '| 7 | Quem recebe o aviso quando a Gerência quer falar com Compras sobre um caso (fora do sistema) | — |',
    ],
    fraseOrigem: {
      passos: '9. Compras confere a parte de compras e, se comprar acima do valor da proposta, o vendedor aprova ou reprova por produto: `C6`, `C7` e `C8` estão em [[06-Circuito-de-Compra#C6, C7 e C8: a parte de compras do pedido da proposta]].',
      regrasQueValem: '- Regras de Compras sobre a proposta (não altera a proposta, compra acima do valor, reprovação, aviso favorável): [[06-Circuito-de-Compra#C6, C7 e C8: a parte de compras do pedido da proposta]].',
      regras: 'As regras 14 a 20 e 30 (`C6`, `C7`, `C8`) estão em [[06-Circuito-de-Compra#C6, C7 e C8: a parte de compras do pedido da proposta]], com a mesma numeração.',
      estado: 'O pedido de aprovação do vendedor (`C8`) está em [[06-Circuito-de-Compra#C6, C7 e C8: a parte de compras do pedido da proposta]].',
      telas: 'As telas de `C6`, `C7` e `C8` (Meus Pedidos com a aprovação, lista de reprovados, visão e conferência de Compras) estão em [[06-Circuito-de-Compra#C6, C7 e C8: a parte de compras do pedido da proposta]].',
      falta: 'Os itens 7 e 12 (`C6`, `C7`, `C8`) estão em [[06-Circuito-de-Compra#C6, C7 e C8: a parte de compras do pedido da proposta]].',
      pendencias: 'As pendências 6 e 7 (aviso e e-mail de Compras) estão em [[06-Circuito-de-Compra#C6, C7 e C8: a parte de compras do pedido da proposta]].',
    },
  },
};

function aplicar(g) {
  const G = GRUPOS[g];
  if (!G) throw new Error('grupo desconhecido: ' + g);
  let dona = ler(G.dona);
  if (dona.includes(G.titulo)) { console.log(`já feito: ${G.titulo} existe em ${G.dona}`); return; }
  let orig = ler(ORIGEM);
  const F = G.fraseOrigem;

  // origem: tira e deixa frase
  orig = trocar(orig, G.passos.join('\n') + '\n', F.passos + '\n', ORIGEM);
  orig = trocar(orig, G.regrasQueValem[0] + '\n', F.regrasQueValem + '\n', ORIGEM);
  orig = tirar(orig, G.regrasQueValem.slice(1), ORIGEM);
  orig = tirar(orig, G.regras, ORIGEM);
  orig = trocar(orig, 'Origem: [[Registro-de-Decisoes]].\n', 'Origem: [[Registro-de-Decisoes]]. ' + F.regras + '\n', ORIGEM);
  orig = trocar(orig, G.estado.join('\n') + '\n', F.estado + '\n\n', ORIGEM);
  orig = tirar(orig, G.telas, ORIGEM);
  orig = trocar(orig, '\nO contrato do menu de Vendas, Orçamento e Compras', '\n' + F.telas + '\n\nO contrato do menu de Vendas, Orçamento e Compras', ORIGEM);
  orig = tirar(orig, G.endpoints, ORIGEM);
  orig = tirar(orig, G.dados, ORIGEM);
  orig = tirar(orig, G.falta, ORIGEM);
  orig = trocar(orig, '### O que falta desenvolver\n\n', '### O que falta desenvolver\n\n' + F.falta + '\n\n', ORIGEM);
  orig = tirar(orig, G.pendencias, ORIGEM);
  orig = trocar(orig, '\nLista completa em [[Perguntas-Proposta-Pedido-Comissao]].', '\n' + F.pendencias + '\n\nLista completa em [[Perguntas-Proposta-Pedido-Comissao]].', ORIGEM);

  // dona: seção nova, linhas iguais às da origem
  const bloco = [
    G.titulo,
    '',
    `Trechos que estavam na nota de proposta da v2 (\`11-Proposta-e-Pedido-de-Venda\`), movidos em 05/11/2026 para cá, a nota dona de \`C6\`, \`C7\` e \`C8\`. A numeração das regras e dos itens é a da nota de origem. A proposta em si está em [[${ORIGEM}]].`,
    '',
    '#### Passo a passo (pedido que vem da proposta)',
    '',
    ...G.passos,
    '',
    '#### Regras que valem',
    '',
    ...G.regrasQueValem,
    '',
    '#### Regras decididas',
    '',
    '| # | Regra | Selo |',
    '|---|---|---|',
    ...G.regras,
    '',
    ...G.estado,
    '#### Telas',
    '',
    '| Nome atual | Rota | App | Quem | Nó | Estado |',
    '|---|---|---|---|---|---|',
    ...G.telas,
    '',
    '#### Endpoints',
    '',
    '| Método e rota | Uso | Nó | Estado |',
    '|---|---|---|---|',
    ...G.endpoints,
    '',
    '#### Dados',
    '',
    '| Dado | Regra |',
    '|---|---|',
    ...G.dados,
    '',
    '#### O que falta (numeração da nota de proposta)',
    '',
    '| # | O quê | Dono | Nó | Selo |',
    '|---|---|---|---|---|',
    ...G.falta,
    '',
    '#### Pendências (numeração da nota de proposta)',
    '',
    '| # | Pergunta | Dono |',
    '|---|---|---|',
    ...G.pendencias,
    '',
  ].join('\n');
  dona = inserirAntes(dona, G.marca, bloco, G.dona);
  if (simular) { console.log(`[simular] ${g}: tira ${G.regras.length} regras, ${G.telas.length} telas e mais de ${ORIGEM}; seção nova em ${G.dona}`); return; }
  fs.writeFileSync(path.join(R, ORIGEM + '.md'), orig, 'utf8');
  fs.writeFileSync(path.join(R, G.dona + '.md'), dona, 'utf8');
  console.log(`feito ${g}`);
}
aplicar(grupo);
