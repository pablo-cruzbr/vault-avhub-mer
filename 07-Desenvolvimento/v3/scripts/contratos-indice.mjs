// Bloco 1: gera 06-Contratos/Contratos-da-v2.md a partir do frontmatter dos contratos da v2.
// Lê da tag v2-antes-da-v3 (git), então funciona igual antes e depois do `git rm`.
// Uso: node 07-Desenvolvimento/v3/scripts/contratos-indice.mjs --simular   (mostra o resumo, não grava)
//      node 07-Desenvolvimento/v3/scripts/contratos-indice.mjs             (grava o índice)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TAG = 'v2-antes-da-v3';
const GH = `https://github.com/Acosvital/vault-avhub-mer/blob/${TAG}/`;
const PASTAS = ['Ativos', 'Consultas', 'Entregues', 'Arquivados'];
const simular = process.argv.includes('--simular');

const git = (...a) => execFileSync('git', a, { cwd: raiz, encoding: 'utf8', maxBuffer: 64 << 20 });

export function lerContratosDaTag() {
  const arquivos = git('ls-tree', '-r', '--name-only', TAG, '--', '06-Contratos')
    .split('\n').filter(Boolean);
  const notas = [];
  const anexos = [];
  for (const f of arquivos) {
    const partes = f.split('/');
    if (partes.length < 3 || !PASTAS.includes(partes[1])) continue; // Painel fica fora
    if (!f.endsWith('.md')) { anexos.push(f); continue; }
    if (path.basename(f) === 'Modelo-de-Consulta.md') continue;
    const txt = git('show', `${TAG}:${f}`).replace(/\r/g, '');
    const fm = (txt.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
    const campo = (k) => ((fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [, ''])[1]).trim();
    const lista = (v) => v.replace(/^\[|\]$/g, '').split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    const h1 = ((txt.match(/^# (.+)$/m) || [, ''])[1]).trim();
    const titulo = h1
      .replace(/^Contrato( de)?( (API|SQL|lógica|LOG))?( \d+\w?)?\s*[—-]\s*/i, '')
      .replace(/^(CON|LOG|SQL|API)-\d+\w?\s*[·—-]\s*/, '')
      .trim() || h1;
    notas.push({
      arquivo: f,
      nome: path.basename(f, '.md'),
      pasta: partes[1],
      id: campo('id') || path.basename(f, '.md'),
      titulo,
      status: campo('status'),
      nos: lista(campo('etapa_0b') || campo('nos_0b')).filter((x) => !/\s/.test(x)),
      historico: path.basename(f).startsWith('HIST-'),
    });
  }
  return { notas, anexos };
}

const esc = (s) => s.replace(/\|/g, '\\|');
const ordemId = (id) => {
  const m = id.match(/^([A-Z]+)-(\d+)([a-z]?)/);
  return m ? [m[1], Number(m[2]), m[3]] : ['ZZZ', 0, id];
};
const cmp = (a, b) => {
  const [x, y] = [ordemId(a.id), ordemId(b.id)];
  return x[0].localeCompare(y[0]) || x[1] - y[1] || String(x[2]).localeCompare(String(y[2]));
};
const link = (n) => `[GitHub](${GH}${encodeURI(n.arquivo)})`;
const linha = (n) => `| ${n.id} | ${esc(n.titulo)} | ${n.pasta} | ${n.status} | ${n.nos.join(', ')} | ${link(n)} |`;
const cab = '| ID | Título | Pasta | Status | Nós do 0b | Link (tag `v2-antes-da-v3`) |\n|---|---|---|---|---|---|';

function maiorPorPrefixo(cs) {
  const m = {};
  for (const c of cs) {
    const [p, n] = ordemId(c.id);
    if (p !== 'ZZZ') m[p] = Math.max(m[p] || 0, n);
  }
  return m;
}

function gerar({ notas, anexos }) {
  const contratos = notas.filter((n) => !n.historico).sort(cmp);
  const historicos = notas.filter((n) => n.historico).sort((a, b) => a.id.localeCompare(b.id));
  const ativos = contratos.filter((n) => n.pasta === 'Ativos');
  const conAbertas = contratos.filter((n) => n.pasta === 'Consultas' && !/respondid|encerrad|arquivad/i.test(n.status));
  const max = maiorPorPrefixo(contratos);
  const pad = (p, n) => (p === 'LOG' || p === 'CON' ? String(n).padStart(2, '0') : String(n).padStart(3, '0'));
  const proximos = Object.entries(max).map(([p, n]) => `\`${p}-${pad(p, n + 1)}\``).join(', ');
  const porPasta = PASTAS.map((p) => `${p} ${contratos.filter((n) => n.pasta === p).length}`).join(' · ');

  return `---
tags: [contratos, indice, v2]
criado: 2026-11-05
estado-em: 2026-11-05
status: vigente
dono: Nathan
fontes: ["tag ${TAG} do vault (06-Contratos)", "gerado por 07-Desenvolvimento/v3/scripts/contratos-indice.mjs"]
---

# Contratos da v2

> **Em uma frase:** os contratos da v2 não vieram para a v3; eles ficaram guardados na tag \`${TAG}\` do GitHub, e esta nota é o índice para achar cada um.

**Quando consultar:** quando uma nota cita um ID de contrato antigo (\`LOG-34\`, \`SQL-014\`, \`API-011\`, \`CON-02\`) ou quando for registrar um contrato novo (veja a numeração no fim).

Esta nota é gerada por script a partir do frontmatter dos contratos. Não edite as linhas à mão: rode \`node 07-Desenvolvimento/v3/scripts/contratos-indice.mjs\`.

Total: **${contratos.length} contratos** (${porPasta}), mais ${historicos.length} documentos históricos e ${anexos.length} anexos (\`.sql\`, \`.patch\`), todos acessíveis pela tag.

## Ainda têm trabalho pendente

Os contratos \`Ativos\` e as consultas (\`CON\`) em aberto **não** foram trazidos para a v3 (D5). O trabalho que continuar ganha um contrato novo, escrito na v3, que cita o ID antigo.

${cab}
${[...ativos, ...conAbertas].map(linha).join('\n')}

## Todos os contratos da v2

${cab}
${contratos.map(linha).join('\n')}

## Documentos históricos da pasta de contratos

| Documento | Título | Link |
|---|---|---|
${historicos.map((n) => `| ${n.id} | ${esc(n.titulo)} | ${link(n)} |`).join('\n')}
| Painel-de-Contratos | Painel de contratos (resumo da v2) | [GitHub](${GH}06-Contratos/Painel-de-Contratos.md) |

## Contratos novos (v3)

A numeração continua depois do maior ID da v2. Próximos IDs livres: ${proximos}.
O modelo de consulta está em [[Modelo-de-Consulta]].
`;
}

const dados = lerContratosDaTag();
const texto = gerar(dados);
const destino = path.join(raiz, '06-Contratos', 'Contratos-da-v2.md');
const contratos = dados.notas.filter((n) => !n.historico);
console.log(`contratos: ${contratos.length} · históricos: ${dados.notas.length - contratos.length} · anexos: ${dados.anexos.length}`);
const semNos = contratos.filter((n) => !n.nos.length).map((n) => n.id);
console.log(`sem etapa_0b: ${semNos.length}${semNos.length ? ' (' + semNos.join(', ') + ')' : ''}`);
const atual = fs.existsSync(destino) ? fs.readFileSync(destino, 'utf8') : null;
if (simular) console.log(atual === texto ? 'índice já está igual (nada muda)' : `gravaria ${destino} (${texto.length} bytes)`);
else if (atual !== texto) { fs.writeFileSync(destino, texto, 'utf8'); console.log(`gravado ${destino}`); }
else console.log('índice já está igual (nada muda)');
