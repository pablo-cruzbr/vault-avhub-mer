---
name: perguntas-e-respostas
description: Montar, responder e incorporar um documento de Perguntas e Respostas (Q&A) em Markdown que vai e volta entre duas pessoas do time (por exemplo Nathan e Robert), cada uma com a própria IA. Use quando alguém disser "monta as perguntas pro Robert", "gera um Q&A disso" ou "preciso perguntar isso pra fulano", quando colar ou anexar um Q&A recebido para responder, ou quando trouxer de volta um Q&A respondido para incorporar.
---

# Perguntas e Respostas entre o time

O documento é a única ponte entre duas conversas de IA que não se conhecem. Quem recebe **não tem
o contexto da conversa de quem enviou**: o documento precisa se explicar sozinho, ser fácil de
responder e voltar num formato que dê para incorporar sem retrabalho.

O mesmo arquivo `.md` vai e volta. Cada ida e volta é uma **rodada**. Nada é apagado: respostas
e novas perguntas são acrescentadas e o histórico fica no próprio arquivo.

Modelo do documento: [modelo.md](modelo.md). Siga a estrutura à risca. As instruções no topo do
modelo fazem a IA de quem recebe funcionar mesmo sem esta skill.

**Q&A ou Consulta?** A `abrir-consulta` é para resposta de **negócio** de quem opera, com ID `CON`
e PDF para o grupo. Este Q&A é para dúvidas de **trabalho entre o time** (técnica, de decisão, de
andamento), informal e sem ID. Se a dúvida for de regra de negócio que o vault precisa registrar,
use a `abrir-consulta`.

**O vault não muda.** Os arquivos de Q&A ficam fora dele, na pasta-mãe:
`../Perguntas-e-Respostas/QA-AAAA-MM-DD_<De>-para-<Para>_<assunto-curto>.md` (crie a pasta se não
existir). No fim de qualquer modo, `git status` do vault tem de estar limpo.

## Descubra o modo

| Situação | Modo |
|---|---|
| A pessoa tem uma dúvida e quer perguntar para alguém | **1. Montar** |
| A pessoa colou ou anexou um Q&A em que ela é o "Para", com respostas em branco | **2. Responder** |
| A pessoa trouxe de volta um Q&A em que ela é o "De", agora respondido | **3. Incorporar** |

Se não der para saber, pergunte em uma frase. Nunca adivinhe quem é o remetente.

---

## 1. Montar

### 1.1 Destrinche antes de escrever
- Siga os passos 1 e 2 da skill `ler-o-vault`.
- **Qual decisão ou ação está travada?** Toda pergunta tem de destravar algo. Se não destrava, corte.
- **O que já se sabe?** Busque no vault e na `develop` (skills `ler-o-vault`, `sistema-*`,
  `banco-de-dados`). **Não pergunte o que o vault ou o código já respondem.** O que já está
  confirmado vai para o Contexto, citado como o vault manda: nota, nó, selo e
  repositório `arquivo:linha` (`âncora`).
- **O que é suposição?** Separe fato de hipótese. Hipótese vira pergunta de confirmação.
- **Quem recebe e o que domina?** Ajuste o vocabulário. Termo ou ID que ele possa não conhecer
  (`N16-60`, `BL-035`, nome de tabela) vai para o Glossário.
- **Quebre a dúvida grande em perguntas atômicas**, uma decisão por pergunta.

Se faltar algo que só quem pediu sabe (para quem vai, prazo, a opinião dele), pergunte antes de gerar.

### 1.2 Regras de uma boa pergunta
Cada pergunta tem um ID fixo (`P1`, `P2`…; na rodada 2 a numeração continua: `P7`, `P8`…) e:

1. **Uma coisa só.** Se tem "e" no meio, provavelmente são duas.
2. **Contexto curto e suficiente:** 1 a 4 linhas com o que o leitor precisa para responder
   aquela pergunta, sem depender de outras partes.
3. **Por que importa:** o que muda conforme a resposta.
4. **Fechada quando possível:** opções (A, B, C), com a recomendada marcada e o motivo.
   Sempre deixe "Outra".
5. **Prioridade:** 🔴 Bloqueante (nada anda sem isso) · 🟡 Importante · 🟢 Pode esperar.
6. **O que assumimos se não houver resposta:** o padrão que vamos seguir. Evita travar e deixa o risco claro.
7. **Evidência só quando ajuda:** um número, um trecho de log, uma citação `arquivo:linha`.
   Nada de colar arquivo inteiro.

Ordene: bloqueantes primeiro, depois agrupe por assunto. Prefira 3 a 10 perguntas; acima de 12,
divida em rodadas ou corte.

### 1.3 Entregue
- Salve em `../Perguntas-e-Respostas/` com o nome do padrão acima e preencha o cabeçalho
  (De, Para, data, rodada 1, status `Aguardando resposta`).
- **Releia como quem recebe, sem contexto:** dá para responder tudo só com o documento? Tem termo
  sem explicação? Pergunta dupla? Corrija antes de entregar.
- Entregue o caminho do arquivo, um resumo de 2 ou 3 linhas do que está sendo perguntado e a
  mensagem pronta para mandar junto (WhatsApp), por exemplo: "Robert, segue um Q&A sobre <assunto>.
  Joga no teu Claude, responde e me devolve o mesmo arquivo. As 🔴 travam <o quê>."
- Mande o `.md`, não PDF: a IA de quem recebe precisa editar o arquivo e devolver.

---

## 2. Responder

Você está do lado de quem recebeu. Siga também as instruções do topo do documento.

1. **Leia o documento inteiro** e absorva o Contexto e o Glossário antes de responder qualquer item.
2. **Use o vault e a `develop`** (skill `ler-o-vault`) para conferir o que for possível e cite a
   origem. Se o que você achar contradiz o Contexto do documento, aponte com a evidência.
3. **Responda com a pessoa, não por ela.** Proponha rascunhos, mas fatos e decisões que só ela
   sabe vêm dela; confirme os rascunhos antes de fechar. Se forem muitas perguntas, vá em blocos,
   bloqueantes primeiro.
4. Para cada pergunta, preencha **só** o bloco `Resposta` dela:
   - **resposta direta** na primeira linha (a opção escolhida ou o fato);
   - detalhe ou justificativa curta, se precisar;
   - **Confiança:** Certeza · Acho que sim · Não sei;
   - se não souber, diga quem sabe ou o que falta.
5. **Não altere** perguntas, contexto, IDs nem rodadas anteriores. Não apague nada.
6. Dúvidas para quem enviou, ou algo importante que ninguém perguntou, vão em
   `Perguntas de volta / Observações` da rodada.
7. Atualize o cabeçalho (status `Respondido`, "Respondido por"), salve e diga à pessoa que o
   arquivo está pronto para devolver. Não grave nada no vault.

---

## 3. Incorporar

O Q&A voltou respondido.

1. **Leia todas as respostas** e cruze com o contexto original, com o vault e com a `develop`.
2. **Classifique cada pergunta:**
   - ✅ Resolvida: resposta clara e confiante.
   - ⚠️ Parcial: respondeu com dúvida, ou a resposta abriu outra questão.
   - ❌ Sem resposta: vale o "o que assumimos".
   - 🔁 Conflito: contradiz o vault, o código ou outra resposta (mostre os dois lados com a evidência).
3. **Escreva a `Consolidação da rodada N`** no fim do documento: tabela com o status de cada
   pergunta e as **decisões** em linguagem de ação ("Vamos usar X porque Y").
4. **Responda as `Perguntas de volta`**, se houver.
5. Se ainda houver ⚠️ ou ❌ importantes, ou algum 🔁, monte a **Rodada N+1** no mesmo arquivo
   seguindo o modo Montar (a numeração dos IDs continua) e volte o status para
   `Aguardando resposta`. Se tudo estiver resolvido, status `Concluído`.
6. **Se uma decisão muda o vault ou o sistema**, não edite nada agora. Diga o que muda e ofereça a
   skill certa: para o admin, `criar-contrato` ou o fluxo de branch e PR do `CLAUDE.md`; para os
   demais, `pedir-contrato`, `abrir-consulta` ou `relatorio-de-entrega`.
7. Entregue, curto: o que foi decidido, o que muda no plano e se há nova rodada (com a mensagem
   pronta para reenviar).
