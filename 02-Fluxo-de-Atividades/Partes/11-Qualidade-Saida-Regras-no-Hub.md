---
tags: [fluxo, raia, qualidade, qualidade-saida, regras, hub, rnc, segregacao, tratativa, parte]
criado: 2026-11-24
estado-em: 2026-11-24
status: vigente
dono: Nathan (telas) · Mayara (Qualidade, valida o dia a dia) · Cadu (concessão e RNC na saída)
parte-de: "[[11-Qualidade-Saida]]"
develop-conferida: [av-hub d9809b8f (branch feat/qualidade-v2, PR #338 em rascunho, fora da develop), em 2026-11-24]
fontes: [fluxo oficial da Qualidade v2 (9 passos, imagem public/qualidade/fluxo-processo-qualidade.jpg do av-hub), av-hub lib/domain/qualidade-conferencia.ts e saida.ts e components/Qualidade/Comum/passosTour.ts, API-023, Registro-de-Decisoes N16-125, N16-128, N16-129]
---

# Qualidade de saída: regras no Hub (rascunho v2)

**Em uma frase:** são as regras da inspeção de saída como o Hub a faz no PR #338 do `av-hub` (conferência da peça, segregação, RNC, reprovação parcial e tratativa), com o que está decidido, o que está pendente e de quem é a decisão.

**Onde estamos:** ← [[11-Qualidade-Saida]] (nota da raia, regras do MES) · contrato: `API-023` · perguntas: [[Perguntas-Qualidade-Mayara]]

Selos: 🔴 tudo o que está só no PR #338 (fora da `develop`); 📝 decidido (ID da decisão); ❓ ainda sem resposta. Quem valida o dia a dia é a Mayara; o Cadu decide o que contraria regra antiga (concessão e RNC na saída).

## O ciclo (fluxo oficial)

Recebe da Produção, faz a conferência da peça. Conforme? **Sim:** libera para o Estoque. **Não:** segrega e bloqueia a peça, registra a RNC (o desvio), define a tratativa com Qualidade, PCP, Comercial e, se preciso, o cliente, e faz a nova verificação.

## Regras

| # | Regra | Estado | Quem decide |
|---|---|---|---|
| S1 | Ações por estado: `EM_TRANSITO` só receber; `RECEBIDO` só iniciar; `EM_ANDAMENTO` aprovar (`mover`) ou reprovar; `REPROVADO` só a tratativa | 📝 regra do MES (já existe lá); Hub 🔴 | Decidido |
| S2 | A **conferência da peça** tem 5 itens: `dimensional`, `visual`, `identificacao`, `rastreabilidade`, `requisitos_cliente` | 🔴 (o vault dizia "sem laudo nem checklist", N16-129) | ❓ Mayara: a lista é a certa? Cadu: contraria a N16-129 |
| S3 | **Aprovar** exige os 5 itens respondidos e nenhum Não conforme. O aprovado vai ao **Estoque** | 🔴; 📝 LOG-53 | Mayara |
| S4 | **Reprovar** exige pelo menos 1 Não conforme (com observação), motivo (até 300 caracteres) e o **local onde a peça ficou separada** (até 80) | 🔴 | ❓ Mayara |
| S5 | **Segregação:** a peça reprovada fica separada e bloqueada (`REPROVADO`) até a tratativa. O local é texto livre | 🔴 | ❓ Mayara: lista fixa de locais? |
| S6 | **RNC na saída:** a reprovação abre RNC (`RNC-AAAA-NNNN`, mesma sequência da entrada). O vault antigo só previa uma Divergência para o PCP, sem RNC | 🔴 contraria o desenho antigo | **Cadu** |
| S7 | **Reprovação parcial:** quantidade menor que a da parcial faz a parte reprovada virar uma parcial nova (`parcial_origem_id`); o resto segue | 📝 N16-128; 🔴 no Hub | Decidido |
| S8 | **Tratativa:** só a peça `REPROVADO` com RNC `ABERTA` recebe. Ações: `RETRABALHO`, `REPARO`, `SUBSTITUICAO`, `DEVOLUCAO`, `DESCARTE`, `CONCESSAO` e `FALSO_ALARME` | 🔴 | ❓ Mayara: quais ações existem |
| S9 | **Quem decide a tratativa:** marcar pelo menos um entre Qualidade, PCP, Comercial e Cliente. Antes, quem resolvia era só o PCP | 🔴 | ❓ Mayara |
| S10 | Destino: retrabalho e reparo voltam ao setor anterior com `retrabalho = true` e a RNC espera a nova verificação; substituição, devolução e descarte saem da fila (na substituição a Produção faz outra); falso alarme volta à inspeção | 🔴 | ❓ Mayara |
| S11 | Substituição, devolução e descarte pedem **justificativa** (até 500 caracteres) | 🔴 | Mayara |
| S12 | **Falso alarme** não está no fluxo oficial; o sistema o mantém para desfazer uma reprovação por engano. No MES aparece como "Aprovar", sem motivo | 🔴 | ❓ Mayara |
| S13 | **Concessão do cliente:** a peça segue ao Estoque com `concessao = true`; exige o Cliente entre os responsáveis e a autorização dele por escrito, anexada. O vault proibia concessão na entrada (N16-125) e a saída nunca a previu | 🔴 contraria o desenho antigo | **Cadu** |
| S14 | A saída não exige laudo, só a conferência | 📝 N16-129 | ❓ Mayara: basta a conferência? |
| S15 | O sistema não emite nota; devolução e descarte são tratados fora | 📝 Registro #30 | Decidido |

## Pendente, e de quem é

| Tema | Pergunta | Quem responde |
|---|---|---|
| Itens da saída (S2) | Os 5 itens são os da inspeção real? | Mayara |
| Locais de segregação (S5) | Lista fixa ou texto livre? | Mayara |
| Quem decide a tratativa (S9) | Quem decide e quem só participa? | Mayara |
| Falso alarme (S12) | Fica ou sai? | Mayara |
| RNC na saída (S6) | A saída passa a abrir RNC? | **Cadu** |
| Concessão (S13) | O cliente pode autorizar a peça como está? | **Cadu** |
| Sucata e refugo | Como entram no saldo e no custo | Nathan |

As 16 perguntas completas estão em [[Perguntas-Qualidade-Mayara]]. A documentação ao cliente, depois da saída, está em [[11-Qualidade-Documentacao-ao-Cliente-Regras-no-Hub]].
