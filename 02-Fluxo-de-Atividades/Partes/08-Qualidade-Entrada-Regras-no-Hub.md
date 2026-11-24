---
tags: [fluxo, raia, qualidade, qualidade-entrada, regras, hub, rnc, conferencia, parte]
criado: 2026-11-24
estado-em: 2026-11-24
status: vigente
dono: Nathan (telas) · Mayara (Qualidade, valida o dia a dia) · Cadu (decisões que contrariam regra antiga)
parte-de: "[[08-Qualidade-Entrada]]"
develop-conferida: [av-hub d9809b8f (branch feat/qualidade-v2, PR #338 em rascunho, fora da develop), em 2026-11-24]
fontes: [fluxo oficial da Qualidade v2 (9 passos, imagem public/qualidade/fluxo-processo-qualidade.jpg do av-hub), av-hub lib/domain/qualidade-conferencia.ts, entrada.ts e components/Qualidade/Comum/passosTour.ts, API-023, Registro-de-Decisoes N16-124 a N16-127]
---

# Qualidade de entrada: regras no Hub (rascunho v2)

**Em uma frase:** são as regras da inspeção de entrada como o Hub a faz no PR #338 do `av-hub` (conferência por itens, RNC com causa e ação, nova inspeção), com o que está decidido, o que está pendente e de quem é a decisão.

**Onde estamos:** ← [[08-Qualidade-Entrada]] (nota da raia, regras do MES) · contrato: `API-023` · perguntas: [[Perguntas-Qualidade-Mayara]]

Selos: 🔴 tudo o que está só no PR #338 (fora da `develop`); 📝 decidido (ID da decisão); ❓ ainda sem resposta da Qualidade. Quem valida o dia a dia é a Mayara; o Cadu só decide o que contraria regra antiga.

## O ciclo (fluxo oficial, passos 1 a 5)

Recebimento, conferência documental, inspeção do material e análise de conformidade. Conforme? **Sim:** libera para o Estoque. **Não:** abre a RNC (na tela o rótulo é "RNC / RDFA"), analisa a causa, define a ação corretiva e faz a nova inspeção.

## Regras

| # | Regra | Estado | Quem decide |
|---|---|---|---|
| E1 | A inspeção vale para o **lote**, nunca para a parcial | 📝 EC-01 | Decidido |
| E2 | A **conferência** tem 14 itens em 3 grupos: documental (`nf_po`, `cert_qualidade`, `cert_origem`, `normas`, `requisitos_cliente`), inspeção do material (`visual`, `dimensional`, `integridade`, `sinete`, `heat`) e análise de conformidade (`nf_cert_material`, `requisitos_po`, `normas_atendidas`, `ensaios`). Cada item é Conforme, Não conforme ou Não se aplica | 🔴 | ❓ Mayara: a lista é a certa? |
| E3 | **Aprovar** exige os 14 itens respondidos, nenhum Não conforme e o laudo | 🔴 | ❓ Mayara |
| E4 | **Reprovar** exige pelo menos 1 item Não conforme (com observação), laudo, motivo (até 300 caracteres), evidência e a quantidade reprovada (vazia = o lote todo). O motivo vem sugerido pelos itens não conformes | 🔴 | ❓ Mayara |
| E5 | **Laudo obrigatório** em aprovar e reprovar. Vale o anexo (PDF ou foto) ou o laudo digital preenchido no sistema; se o laudo digital der `REPROVADO`, o sistema não deixa aprovar | 📝 no MES (DTO); laudo digital 🔴 | ❓ Mayara: o laudo digital vale como laudo? |
| E6 | **Sem concessão** na entrada: o lote é liberado ou reprovado | 📝 N16-125 | Decidido |
| E7 | Só lote `PENDENTE` é decidido; outro status responde 409 | 🔴 no Hub (no MES já existe) | Decidido |
| E8 | **Reprovação parcial:** a parte reprovada vira lote filho `REPROVADO`; a parte boa fica em `QUARENTENA` enquanto há parcial esperando, senão `LIBERADO` | 📝 EC-07 e PS-053 (o MES libera na hora quando ninguém espera) | ❓ Mayara: a parte boa espera mesmo sem ninguém esperar? |
| E9 | A RNC nasce `ABERTA` com número `RNC-AAAA-NNNN` (mesma sequência da saída). A **tratativa** grava a causa (até 500 caracteres) e a ação corretiva e leva a RNC a `EM_TRATAMENTO` | 🔴 | ❓ Mayara: quais ações existem |
| E10 | **Ações corretivas:** `TROCA` (devolve e o fornecedor manda igual), `REPARO` (corrige e inspeciona de novo), `COMPLEMENTO` (falta documento ou quantidade), `DEVOLUCAO` (devolve sem reposição) | 🔴 | ❓ Mayara |
| E11 | Troca e devolução deixam a **nota de devolução pendente**; o sistema só sinaliza e a nota sai no Omie | 📝 N16-126 e Registro #30 | Decidido |
| E12 | **Nova inspeção:** troca e complemento esperam a reposição, que entra como lote novo e passa pela mesma conferência, em branco; no reparo, o lote volta com a conferência anterior já marcada. Aprovada, libera a quarentena do lote de origem e a RNC encerra. A devolução encerra quando a nota sai | 🔴 | ❓ Mayara: a nova inspeção começa marcada ou em branco? |
| E13 | Material aprovado vai ao **Estoque**, nunca direto à Expedição | 📝 24/09 e 14/10 | Decidido |
| E14 | Só o setor da Qualidade decide o lote (trava por setor) | 📝 N16-124; sem código no Hub nem no MES | Decidido (falta código) |
| E15 | O Compras é avisado da recompra por RNC | 📝 N16-127; no MES já existe (LOG-58); no Hub ❓ | Nathan |

## Pendente, e de quem é

| Tema | Pergunta | Quem responde |
|---|---|---|
| Itens da conferência (E2) | Os 14 itens e os grupos são os da inspeção real? | Mayara |
| Laudo (E5) | Laudo é obrigatório para todo lote? O digital vale? | Mayara |
| Quarentena da parte boa (E8) | Espera sempre ou só quando há parcial esperando? | Mayara |
| Nova inspeção (E12) | Os itens começam marcados ou em branco? | Mayara |
| Significado de RDFA | O que é RDFA e quando se usa no lugar de RNC? | Mayara |
| Perfil da Qualidade | Nome do perfil e quem acessa entrada e saída | Mayara e Nathan |
| Fechamento da RNC | Quem fecha: Qualidade ou Compras? A baixa do lote reprovado é manual hoje | Nathan |
| Duas fontes de verdade | Entrada decidida no MES e no Hub: qual vale? | Nathan e Robert |

As 16 perguntas completas estão em [[Perguntas-Qualidade-Mayara]].
