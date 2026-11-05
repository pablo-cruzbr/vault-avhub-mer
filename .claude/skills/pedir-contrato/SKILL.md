---
name: pedir-contrato
description: Escrever um contrato novo de mudança (LOG regra, SQL banco, API rota) a partir do modelo do vault e gerar o PDF para mandar no grupo do WhatsApp. Use quando alguém precisa que o sistema mude ou pede para "criar um contrato".
---

# Pedir um contrato novo (PDF para o grupo)

Quem não é o Nathan **não grava nada no vault**: o contrato vai em PDF, e o Nathan registra e dá o ID.

1. Siga os passos 1 e 2 da skill `ler-o-vault` (ambiente atualizado, leitura do necessário).
2. Leia `06-Contratos/Modelos/Modelo-de-Contrato.md` inteiro. Ele manda na estrutura e nas regras.
3. **Junte o contexto antes de escrever:**
   - a raia do nó envolvido (`02-Fluxo-de-Atividades/NN-...`) e as partes dela;
   - as decisões ligadas (busca no `Registro-de-Decisoes`);
   - contratos parecidos no `06-Contratos/Contratos-da-v2` e as tasks no `07-Desenvolvimento/Backlog-por-Frente`;
   - o estado atual na `origin/develop` dos sistemas envolvidos, com arquivo:linha.
4. **Pergunte o que faltar** (no máximo 3 perguntas por vez): quem implementa, o que exatamente muda, como saber que ficou pronto.
5. **Escreva no formato do modelo**, com `id: a definir pelo Nathan` e o tipo sugerido (`LOG`, `SQL` ou `API`) com o motivo. Inclua o "Bloco para a IA do Nathan" e a "Mensagem pronta para o WhatsApp".
6. **Confira antes de gerar:** toda afirmação tem origem; nenhum ✅ sem a `develop`; critério de pronto verificável; nada inventado.
7. **Gere o PDF** com a skill `gerar-pdf` (tipo `Contrato`) e mostre o caminho do arquivo e a mensagem para o grupo.
