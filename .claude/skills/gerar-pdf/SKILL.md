---
name: gerar-pdf
description: Transformar um contrato, consulta ou relatório de entrega em PDF pronto para o grupo do WhatsApp, com o script scripts/gerar-pdf.mjs do vault. Use no último passo das skills pedir-contrato, abrir-consulta, relatorio-de-entrega e status-do-projeto.
---

# Gerar o PDF

1. **Escreva o documento em HTML simples** (`<h1>`, `<h2>`, `<p>`, `<ul>`, `<table>`, `<code>`, `<pre>`). Não precisa de `<html>` nem de estilo: o script põe o estilo padrão.
   - Primeira parte: `<div class="capa">` com tipo, data, autor, nós, task ou contrato e o resumo em até 5 linhas.
   - O "Bloco para a IA do Nathan" vai no fim, numa página própria: `<h2 class="quebra">Bloco para a IA do Nathan</h2><pre>…</pre>`.
2. **Salve fora do vault**, na pasta-mãe: `../Documentos-para-o-Nathan/AAAA-MM-DD_<Contrato|Consulta|Entrega|Status>_<Autor>_<assunto-curto>.html` (crie a pasta se não existir). O vault continua sem alteração.
3. **Gere:** `node scripts/gerar-pdf.mjs ../Documentos-para-o-Nathan/<arquivo>.html`. O PDF sai ao lado, com o mesmo nome. O script usa o Edge ou o Chrome instalado; para forçar outro, defina `NAVEGADOR` com o caminho do executável.
4. **Se o script falhar** (nenhum navegador achado), abra o `.html` no navegador e use Imprimir → Salvar como PDF.
5. **Entregue:** o caminho do PDF e a mensagem pronta para o WhatsApp (2 ou 3 linhas). Confirme que o vault não ficou com alteração (`git status` limpo).
