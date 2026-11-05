---
name: abrir-consulta
description: Escrever uma Consulta (CON) para tirar uma dúvida de negócio com quem opera, a partir do Modelo-de-Consulta do vault, e gerar o PDF para o grupo. Use quando a regra não está no código nem no vault e alguém precisa responder.
---

# Abrir uma Consulta (PDF para o grupo)

1. Siga os passos 1 e 2 da skill `ler-o-vault`.
2. Leia `06-Contratos/Modelos/Modelo-de-Consulta.md` e siga a estrutura e as regras dele à risca: escrita para quem não conhece o sistema, cenário com exemplo concreto, perguntas numeradas com o formato da resposta, o que acontece sem resposta e a mensagem pronta para o WhatsApp.
3. Confira antes que a resposta **não** está no vault nem na `develop`. Se estiver, responda pela skill `ler-o-vault` em vez de abrir a consulta.
4. Use `id: CON a definir pelo Nathan`. O Nathan dá o número e registra as respostas.
5. Inclua no fim o "Bloco para a IA do Nathan": tipo `consulta`, autor, data, nós, destinatários, prazo, `bloqueia` (BL, PS), perguntas.
6. Gere o PDF com a skill `gerar-pdf` (tipo `Consulta`).
