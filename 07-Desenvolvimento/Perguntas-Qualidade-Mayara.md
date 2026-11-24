---
tags: [desenvolvimento, perguntas, qualidade, qualidade-entrada, qualidade-saida, documentacao-cliente, consulta, rascunho]
criado: 2026-11-24
estado-em: 2026-11-24
status: proposta
dono: Nathan (registra as respostas) · Mayara (Qualidade, responde) · Cadu (QT-10 e QT-11)
develop-conferida: [av-hub d9809b8f (branch feat/qualidade-v2, PR #338 em rascunho, fora da develop), em 2026-11-24]
fontes: [API-023, 08-Qualidade-Entrada-Regras-no-Hub, 11-Qualidade-Saida-Regras-no-Hub, 11-Qualidade-Documentacao-ao-Cliente-Regras-no-Hub, fluxo oficial da Qualidade v2 (imagem public/qualidade/fluxo-processo-qualidade.jpg do av-hub), av-hub lib/domain/qualidade-*.ts]
---

# Perguntas para a Mayara: Qualidade no Hub (QT-01 a QT-16)

**Em uma frase:** são as 16 perguntas que a Mayara, da Qualidade, precisa responder para o Hub ficar igual ao dia a dia da inspeção; cada uma diz o que o sistema faz hoje e tem um campo para a resposta.

**Quando consultar:** antes de cobrar a validação da Qualidade, ou quando uma nota de regras ([[08-Qualidade-Entrada-Regras-no-Hub]], [[11-Qualidade-Saida-Regras-no-Hub]], [[11-Qualidade-Documentacao-ao-Cliente-Regras-no-Hub]]) ou o `API-023` cita uma `QT-nn`.

## Como usar

- **A Mayara** valida o dia a dia da inspeção. **O Cadu** só decide o que contraria uma regra antiga: a **concessão** (QT-11) e a **RNC na saída** (QT-10).
- O "sistema faz hoje" descreve o PR #338 do `av-hub` (rascunho, fora da `develop`), com dados de teste. Nenhuma resposta é decisão até estar preenchida e registrada.
- Cada pergunta tem o campo **Resposta**, com **quem respondeu** e a **data**. Quando a resposta chegar, o Nathan registra aqui e atualiza a nota de regras ligada (o ❓ vira 📝 e, quando entrar no código, ✅).
- Siglas: RNC = registro de não conformidade; PO = pedido de compra do cliente; PCP = planejamento e controle da produção.

## Bloco 1: o dia a dia da inspeção

### QT-01 · Itens da conferência da entrada

**Pergunta:** a lista de conferência do material que chega do fornecedor é esta? Falta algum item ou sobra algum?
**O sistema faz hoje:** mostra 14 itens em 3 grupos. Documental: nota fiscal × PO, certificado de qualidade, certificado de origem (Mill Test), normas aplicáveis, requisitos do cliente. Inspeção do material: visual, dimensional, integridade, sinete/gravação, rastreabilidade heat/lote. Análise de conformidade: NF × certificado × material, requisitos da PO, normas atendidas, ensaios. Cada item é Conforme, Não conforme ou Não se aplica. Para aprovar, todos precisam estar respondidos.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-02 · Laudo obrigatório

**Pergunta:** o laudo é obrigatório para todo lote, na aprovação e na reprovação? O laudo preenchido no sistema vale como laudo?
**O sistema faz hoje:** exige o laudo para aprovar e para reprovar. Aceita um PDF ou foto anexada, ou um laudo digital preenchido na tela (o sistema gera o PDF). Se o laudo digital der "Reprovado", o sistema não deixa aprovar.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-03 · Quarentena da parte boa

**Pergunta:** quando se reprova só uma parte do lote, a parte boa deve esperar em quarentena até a reposição ser aprovada, mesmo que ninguém esteja esperando esse material?
**O sistema faz hoje:** a parte reprovada vira um lote separado e a parte boa fica em quarentena enquanto há pedido esperando; quando ninguém espera, fica liberada na hora (é o que o MES faz). Se a reposição for aprovada, a quarentena é liberada.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-04 · Nova inspeção: marcada ou em branco

**Pergunta:** quando chega o material de reposição (ou o reparado) e ele passa de novo pela inspeção, a conferência deve começar toda em branco ou já marcada com o que foi conferido antes?
**O sistema faz hoje:** depende do caso. No lote reparado (reparo da RNC), a conferência volta já marcada com o resultado da inspeção anterior e o lote aparece como "nova inspeção". Na reposição (troca ou complemento), que chega como lote novo, a conferência começa em branco.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-05 · Itens da conferência da saída

**Pergunta:** a lista de conferência da peça que sai da Produção é esta? Falta algum item ou sobra algum?
**O sistema faz hoje:** mostra 5 itens: dimensional, visual, identificação (sinete, gravação, corrida, lote), rastreabilidade (peça × certificado × documentação de origem) e requisitos técnicos do cliente. Para liberar a peça, todos precisam estar respondidos e nenhum pode estar Não conforme. Antes, a saída era só um clique com motivo, sem lista.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-06 · Locais de segregação

**Pergunta:** onde a peça reprovada fica separada? Existe uma lista de locais fixos (por exemplo, "Área de segregados") que o sistema deva oferecer?
**O sistema faz hoje:** o inspetor digita o local em texto livre (até 80 caracteres) ao reprovar. Sem local, não deixa reprovar. A peça fica bloqueada até a tratativa.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-07 · Significado de RDFA

**Pergunta:** o que é RDFA? É a mesma coisa que a RNC, ou é outro documento? Quando se usa um e quando se usa o outro?
**O sistema faz hoje:** usa o nome "RNC / RDFA" nas telas e no tipo de documento do dossiê, porque o fluxo recebido escreve assim. O número gerado é `RNC-AAAA-NNNN`. O sistema trata os dois como um registro só.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

## Bloco 2: a tratativa da não conformidade

### QT-08 · Quem decide a tratativa

**Pergunta:** na peça reprovada, quem participa da decisão do que fazer: Qualidade, PCP, Comercial e o cliente? Precisa de todos, ou depende do caso?
**O sistema faz hoje:** ao registrar a tratativa, a pessoa marca quem decidiu (Qualidade, PCP, Comercial, Cliente) e precisa marcar pelo menos um. As ações são retrabalho, reparo, substituição, devolução, descarte, concessão e falso alarme. Substituição, devolução e descarte pedem uma justificativa. No desenho antigo, só o PCP resolvia.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-09 · Falso alarme

**Pergunta:** "falso alarme" (a peça estava boa e foi reprovada por engano) existe no dia a dia? Se existe, como se registra?
**O sistema faz hoje:** tem a opção "Falso alarme": a peça sai da segregação, volta para a inspeção e a RNC se encerra. Ela não aparece no fluxo oficial da Qualidade; foi mantida para desfazer uma reprovação por engano.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-10 · RNC na saída (decisão do Cadu)

**Pergunta:** reprovar uma peça na saída deve abrir uma RNC, como na entrada?
**O sistema faz hoje:** abre a RNC com o número da mesma sequência da entrada, guarda o motivo, a evidência e a tratativa. O vault antigo dizia que a reprovação na saída só abria uma divergência para o PCP, sem RNC. **Quem responde: Cadu** (contraria a regra antiga).
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-11 · Concessão (decisão do Cadu)

**Pergunta:** o cliente pode autorizar, por escrito, que uma peça fora da especificação siga como está (concessão)? Em que casos?
**O sistema faz hoje:** na saída permite a tratativa "Concessão do cliente": exige o cliente entre os responsáveis e a autorização anexada; a peça segue ao Estoque marcada como concessão. Na entrada continua sem concessão: o lote é liberado ou reprovado (regra N16-125). **Quem responde: Cadu** (contraria a regra antiga).
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

## Bloco 3: a documentação ao cliente

### QT-12 · Quem monta e quem aprova o dossiê

**Pergunta:** quem monta a documentação de um pedido e quem a revisa e aprova antes de ir ao cliente? São pessoas diferentes?
**O sistema faz hoje:** quem tem a permissão de editar monta o dossiê e o envia para revisão. Só quem tem a permissão de aprovar valida (confere 4 itens: atende a PO, normas, requisitos do cliente e rastreabilidade) ou devolve para a montagem com o motivo.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-13 · Data Book em todo pedido

**Pergunta:** o Data Book é feito em todo pedido, ou só quando o cliente exige?
**O sistema faz hoje:** o Data Book é um documento obrigatório só quando o pedido tem a exigência de Data Book. O sistema gera o índice, depois que os outros documentos obrigatórios estão anexados, e pede para gerar de novo se algum documento mudar.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-14 · Protocolo no portal

**Pergunta:** quando o envio é por portal do cliente, o portal sempre devolve um protocolo? Se não devolver, como se comprova o envio?
**O sistema faz hoje:** no envio por portal, exige o protocolo; no envio por e-mail, exige um e-mail de destino válido (vários separados por vírgula) e o próprio e-mail serve de comprovante.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-15 · Comentar sem reprovar

**Pergunta:** o cliente pode comentar a documentação sem reprovar? O que a Qualidade faz depois: corrige e reenvia, ou só arquiva?
**O sistema faz hoje:** o comentário do cliente leva o dossiê para "Cliente comentou", e a Qualidade escolhe reabrir (volta para montagem com uma revisão a mais) ou arquivar. Se o cliente reprova, o dossiê volta direto para montagem, também com uma revisão a mais.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

### QT-16 · Padrão de pasta no SharePoint

**Pergunta:** onde e como se guarda a documentação depois de aprovada? Há um padrão de pasta (por cliente, pedido, item, corrida)?
**O sistema faz hoje:** ao arquivar, pede o local (SharePoint ou ERP) e o caminho, em texto livre. O arquivo anexado no sistema só serve para a demonstração; o armazenamento definitivo ainda não foi definido.
**Resposta:** ____________ · **Quem respondeu:** ____________ · **Data:** ____/____/______

## Ver também

`API-023` · [[08-Qualidade-Entrada]] · [[11-Qualidade-Saida]] · [[Chamados-Qualidade-v2]]
