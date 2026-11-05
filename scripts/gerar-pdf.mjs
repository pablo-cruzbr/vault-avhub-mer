// Gera um PDF a partir de um arquivo HTML, usando o navegador instalado (Edge ou Chrome) em modo headless.
// Não precisa de pacote npm. Serve para os documentos que vão para o grupo (contrato, consulta, relatório de entrega).
//
// Uso:
//   node scripts/gerar-pdf.mjs <arquivo.html> [saida.pdf]
//
// - Se o HTML não tiver <html>, o script embrulha o conteúdo com o estilo padrão (A4, fonte legível, tabelas com borda).
// - Sem [saida.pdf], o PDF sai ao lado do HTML, com o mesmo nome.
// - Para forçar um navegador: defina a variável NAVEGADOR com o caminho do executável.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const [, , entrada, saidaArg] = process.argv;
if (!entrada) {
  console.error('Uso: node scripts/gerar-pdf.mjs <arquivo.html> [saida.pdf]');
  process.exit(1);
}
const html = path.resolve(entrada);
if (!fs.existsSync(html)) {
  console.error(`Arquivo não encontrado: ${html}`);
  process.exit(1);
}

const ESTILO = `
@page { size: A4; margin: 18mm 16mm; }
body { font-family: "Segoe UI", Arial, sans-serif; font-size: 10.5pt; line-height: 1.45; color: #1a1a1a; }
h1 { font-size: 18pt; color: #0b3d6e; margin: 0 0 6pt; }
h2 { font-size: 13pt; color: #0b3d6e; border-bottom: 1px solid #c9d3de; padding-bottom: 2pt; margin-top: 16pt; }
h3 { font-size: 11pt; margin-top: 12pt; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0; page-break-inside: auto; }
th, td { border: 1px solid #b8c2cc; padding: 4pt 6pt; vertical-align: top; text-align: left; }
th { background: #eef2f6; }
tr { page-break-inside: avoid; }
code { font-family: Consolas, "Courier New", monospace; font-size: 9pt; background: #f3f5f7; padding: 0 2pt; }
pre { font-family: Consolas, "Courier New", monospace; font-size: 8.5pt; background: #f3f5f7; padding: 6pt; white-space: pre-wrap; word-break: break-word; border: 1px solid #dde3e8; }
.capa { border: 1px solid #c9d3de; background: #f7f9fb; padding: 8pt 10pt; margin-bottom: 10pt; }
.quebra { page-break-before: always; }
`;

const conteudo = fs.readFileSync(html, 'utf8');
let alvo = html;
let temporario = null;
if (!/<html[\s>]/i.test(conteudo)) {
  temporario = html.replace(/\.html?$/i, '') + '.completo.html';
  fs.writeFileSync(
    temporario,
    `<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><style>${ESTILO}</style></head><body>\n${conteudo}\n</body></html>\n`,
    'utf8',
  );
  alvo = temporario;
}
const saida = path.resolve(saidaArg || html.replace(/\.html?$/i, '') + '.pdf');

function candidatos() {
  const lista = [];
  if (process.env.NAVEGADOR) lista.push(process.env.NAVEGADOR);
  const pf = process.env['ProgramFiles'] || 'C:\\Program Files';
  const pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
  const local = process.env['LOCALAPPDATA'] || '';
  lista.push(
    path.join(pf86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(pf, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(pf86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    local && path.join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  );
  for (const nome of ['microsoft-edge', 'google-chrome', 'chromium', 'chromium-browser']) {
    const r = spawnSync(process.platform === 'win32' ? 'where' : 'which', [nome], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) lista.push(r.stdout.trim().split(/\r?\n/)[0]);
  }
  return lista.filter((c) => c && fs.existsSync(c));
}

const navegadores = candidatos();
if (!navegadores.length) {
  console.error('Nenhum Edge ou Chrome encontrado. Defina NAVEGADOR com o caminho do executável,');
  console.error(`ou abra ${alvo} no navegador e use Imprimir > Salvar como PDF.`);
  process.exit(1);
}

// Perfil temporário: funciona mesmo com o navegador aberto.
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'gerar-pdf-'));
const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--no-pdf-header-footer',
  `--user-data-dir=${perfil}`,
  `--print-to-pdf=${saida}`,
  pathToFileURL(alvo).href,
];
if (fs.existsSync(saida)) fs.rmSync(saida);
const r = spawnSync(navegadores[0], args, { encoding: 'utf8', timeout: 90000 });

try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* perfil temporário, pode ficar */ }
if (temporario) { try { fs.rmSync(temporario); } catch { /* o .completo.html pode ficar */ } }

if (!fs.existsSync(saida) || fs.statSync(saida).size === 0) {
  console.error(`Falhou ao gerar o PDF com ${navegadores[0]}.`);
  if (r.stderr) console.error(r.stderr.slice(-1500));
  process.exit(1);
}
console.log(`PDF gerado: ${saida} (${Math.round(fs.statSync(saida).size / 1024)} KB, navegador: ${path.basename(navegadores[0])})`);
