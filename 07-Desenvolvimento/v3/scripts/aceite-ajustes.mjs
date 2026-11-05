// Bloco 7: correções pequenas apontadas pelo teste das perguntas de aceite (agente que leu só o vault).
// Uso: node 07-Desenvolvimento/v3/scripts/aceite-ajustes.mjs [--simular]   (idempotente)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const simular = process.argv.includes('--simular');
const AJ = [
  ['02-Fluxo-de-Atividades/08-Qualidade-Entrada.md', '- Aprovar exige laudo. Reprovar exige laudo, motivo e evidência.\n',
   '- Aprovar exige laudo. Reprovar exige laudo, motivo e evidência. No recebimento e na entrada de lote no estoque o laudo é opcional ✅ (`api-pcp` `src/qualidade/dto/aprovar-lote.dto.ts:8` e `reprovar-lote.dto.ts:9` obrigatórios; `src/compras/dto/registrar-recebimento.dto.ts:53`, `conferir-recebimento.dto.ts:106,268` e `src/estoque/operacao/dto/entrada-lote.dto.ts:25` opcionais).\n'],
  ['02-Fluxo-de-Atividades/06-Circuito-de-Compra.md', '# Circuito de compra (P3, C0 a C5, FN1)', '# Circuito de compra (P3, C0 a C8, FN1)'],
  ['02-Fluxo-de-Atividades/10-Producao-e-Roteiro.md', '# Produção e roteiro (F1, P6)', '# Produção e roteiro (F1)'],
  ['06-Contratos/Contratos-da-v2.md', 'Esta nota é gerada por script a partir do frontmatter dos contratos. Não edite as linhas à mão: rode `node 07-Desenvolvimento/v3/scripts/contratos-indice.mjs`.',
   'Esta nota foi gerada por script (`07-Desenvolvimento/v3/scripts/contratos-indice.mjs`, Bloco 1 da v3) a partir do frontmatter dos contratos da v2, e a lista completa foi para [[Contratos-da-v2-Lista-Completa]] no Bloco 5. Os contratos da v2 não mudam mais: não rode o script de novo (ele juntaria a lista outra vez nesta nota). Contrato novo entra à mão na seção "Contratos novos (v3)" (veja o [[Manual-de-Manutencao-do-Vault]]). A coluna de status traz o vocabulário da v2 (`implementado-no-codigo`, `aplicado-em-producao`); na v3, contrato novo usa `implementado-na-develop`.'],
  ['03-Sistemas/Mapa-do-Modulo-do-Pablo.md', '**Quando consultar esta nota:** antes de migrar, reaproveitar ou descartar qualquer parte do código do Pablo (`av-hub\\api-comercial`).',
   '**Quando consultar esta nota:** antes de migrar, reaproveitar ou descartar qualquer parte do código do Pablo (`av-hub\\api-comercial`).\n\n> [!warning] Leia os selos desta nota pelo F3 (05/11/2026)\n> Esta nota descreve o `api-comercial` de teste, que será removido inteiro. Aqui, ✅ quer dizer "visto no código de teste", e **não** pronto: pelo F3, o que só existe no `api-comercial` é 🔴 "sem API e sem banco". O estado do módulo na `develop` está no [[Onde-Estamos]] (linhas da proposta e do Orçamento), nas raias [[01-Proposta-de-Venda]], [[02-Orcamento-Base-de-Preco]] e [[06-Circuito-de-Compra]] e no [[Backlog-Frente-Comercial-e-Suprimentos]]. O envio do pedido ao Omie não é mais por fila: desde 03/11 a `api-acos-vital` chama o Omie direto ([[Mapa-IncluirPedido-Omie]]).'],
];
for (const [rel, a, b] of AJ) {
  const f = path.join(raiz, rel);
  let t = fs.readFileSync(f, 'utf8');
  if (t.includes(b)) { console.log(`ok (já aplicado) ${rel}`); continue; }
  if (!t.includes(a)) throw new Error(`não achei em ${rel}: ${a.slice(0, 60)}`);
  t = t.replace(a, b);
  console.log(`${simular ? '[simular] ' : ''}ajustado ${rel}`);
  if (!simular) fs.writeFileSync(f, t, 'utf8');
}
