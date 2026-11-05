// Bloco 3: troca os números de tela do v1 (10.1 a 10.4 e 11.1) pelos IDs de nó do fluxo.
// 10.1 paletes → X1 · 10.2 consolidar carga → X3 · 10.3 transporte → X4 · 10.4 comprovante → X4 · 11.1 sinalização de faturamento → ligação do O1.
// Conferido na develop em 05/11/2026: app-pcp 93f96de tem PalletsModal, EmbalagensSection e ConfirmarEntregaModal (X1, X4 comprovante);
// não há consolidação de carga, romaneio, transporte de saída nem sinalização ao Omie (X3, X4 transporte, O1) em app-pcp nem em api-pcp befd973.
// Lista explícita (sem regex geral): "L10.1" e outros IDs parecidos não são tocados. Mapa-v1-para-v2 e Registro-de-Decisoes ficam como estão.
// Uso: node _v3/scripts/telas-v1-para-nos.mjs [--simular]   (idempotente)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const simular = process.argv.includes('--simular');
const F = '02-Fluxo-de-Atividades/';
const TROCAS = {
  '00-Inicio/Onde-Estamos.md': [['Consolidar carga (10.2), transporte (10.3)', 'Consolidar carga (X3), transporte (X4)'], ['NF do Omie (11.1)', 'NF do Omie (ligação do O1)']],
  '01-Projeto/Visao-do-Projeto.md': [['Sinalização do MES ao Omie (`11.1`, Nathan, Robert)', 'Sinalização do MES ao Omie (ligação do `O1`, Nathan, Robert)']],
  [F + '00-Fluxo-Mestre-0b.md']: [['Consolida a carga (10.2)', 'Consolida a carga'], ['Logística de saída: transporte (10.3), comprovante (10.4)', 'Logística de saída: transporte e comprovante'], ['| ✅ (10.1 paletes)', '| ✅ (paletes)'], ['**sinalização do MES ao Omie (11.1) 🔴**', '**sinalização do MES ao Omie (ligação do `O1`) 🔴**']],
  [F + '13-Expedicao.md']: [
    ['(fila 11.1)', '(fila de sinalização, ligação do `O1`)'],
    ['No v1 as telas são 10.1 a 10.4.', 'No v1 eram as telas 10.1 a 10.4; na v3 elas se chamam pelos nós `X1` a `X4`.'],
    ['| Consolidação de carga (10.2) |', '| Consolidação de carga (`X3`) |'],
    ['| Transporte e roteiro (10.3) |', '| Transporte e roteiro (`X4`) |'],
    ['| Fila de sinalização de faturamento (11.1) |', '| Fila de sinalização de faturamento (ligação do `O1`) |'],
    ['#### X1 · 10.1 paletes ✅', '#### X1 · paletes ✅'],
    ['O comprovante de entrega (10.4) está feito ✅.', 'O comprovante de entrega (`X4`) está feito ✅.'],
    ['| 4 | Consolidação de carga (10.2):', '| 4 | Consolidação de carga:'],
    ['| 5 | Transporte e roteiro (10.3):', '| 5 | Transporte e roteiro:'],
    ['| 6 | Sinalização do MES ao Omie (11.1) com', '| 6 | Sinalização do MES ao Omie (ligação do `O1`) com'],
  ],
  [F + '14-Fiscal-Omie.md']: [
    ['Fila de sinalização de carga pronta (tela 11.1)', 'Fila de sinalização de carga pronta (ligação do `O1`)'],
    ['que a carga está pronta (11.1);', 'que a carga está pronta (ligação do `O1`);'],
    ['uma fila de cargas prontas (tela 11.1),', 'uma fila de cargas prontas (ligação do `O1`),'],
    ['| Fila de sinalização de faturamento (11.1) |', '| Fila de sinalização de faturamento (ligação do `O1`) |'],
    ['| Sinalização do MES ao Omie (11.1) |', '| Sinalização do MES ao Omie (ligação do `O1`) |'],
    ['#### Sinalização do MES ao Omie (11.1) 🔴', '#### Sinalização do MES ao Omie (ligação do O1) 🔴'],
    ['O desenho do v1 (11.1):', 'O desenho do v1 (tela 11.1, hoje a ligação do `O1`):'],
    ['| 2 | Tela 11.1 no MES:', '| 2 | Tela de sinalização (ligação do `O1`) no MES:'],
    ['"sinalizacao 11.1 (sem codigo)"', '"sinalizacao O1 (sem codigo)"'],
  ],
  [F + 'Transversais/Telas-por-Raia.md']: [
    ['| Embalagem e Logística de saída (10.1, 10.4) |', '| Embalagem e Logística de saída |'],
    ['| Seção Embalagens do pedido | (10.1) |', '| Seção Embalagens do pedido | — |'],
    ['| Consolidação de carga | (10.2) |', '| Consolidação de carga | — |'],
    ['| Transporte e roteiro | (10.3) |', '| Transporte e roteiro | — |'],
    ['| Fila de sinalização de faturamento | (11.1) |', '| Fila de sinalização de faturamento | — |'],
  ],
  '05-Integracoes/Integracao-AvHub-MES.md': [['(nó O1, tela 11.1)', '(ligação do nó O1)']],
  '05-Integracoes/Omie-Integracao-Estado.md': [['sinalização do MES ao Omie (tela 11.1)', 'sinalização do MES ao Omie (ligação do O1)']],
  '07-Desenvolvimento/Backlog-por-Frente.md': [['Consolidar a carga (10.2)', 'Consolidar a carga'], ['transporte (10.3). O comprovante (10.4) existe', 'transporte. O comprovante existe']],
  '09-Diagramas/Sequencia.md': [['🔴 Aviso do MES ao Omie para faturar (11.1).', '🔴 Aviso do MES ao Omie para faturar (ligação do `O1`).'], ['🔴 Sinalização de faturamento (11.1).', '🔴 Sinalização de faturamento (ligação do `O1`).']],
  '09-Diagramas/Casos-de-Uso.md': [['| Paletes (10.1) |', '| Paletes |'], ['| Consolidar a carga (10.2) |', '| Consolidar a carga |'], ['sinalização do MES ao Omie (11.1)', 'sinalização do MES ao Omie (ligação do O1)']],
};
let n = 0;
for (const [arq, pares] of Object.entries(TROCAS)) {
  const p = path.join(raiz, arq);
  let t = fs.readFileSync(p, 'utf8');
  const a = t;
  for (const [de, para] of pares) {
    if (t.includes(de)) { t = t.split(de).join(para); n++; console.log(`${arq}: ${de} → ${para}`); }
    else if (!t.includes(para)) console.log(`AVISO não achei em ${arq}: ${de}`);
  }
  if (t !== a && !simular) fs.writeFileSync(p, t, 'utf8');
}
console.log(`${simular ? 'SIMULAÇÃO — ' : ''}${n} trocas`);
