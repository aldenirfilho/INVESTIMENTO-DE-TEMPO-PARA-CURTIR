# Tempo de Viver 360X — Investimento de tempo para curtir

Site estático do **Projeto Tempo de Viver 360X**, concebido por Aldenir Rocha de Oliveira Filho.

A proposta: substituir a acumulação financeira sem finalidade por escolhas conscientes sobre o que queremos viver, quanto precisamos para sustentar essas escolhas e quanto tempo estamos dispostos a dedicar ao trabalho, usando tecnologia, inteligência artificial e imaginação (o Reaverso) para diminuir o esforço de organizar experiências, sem abrir mão da proteção financeira.

## O que o site contém

| Seção | Conteúdo |
|---|---|
| A ideia central | Seis dimensões de uma vida boa, proteção financeira como parte da liberdade e nota honesta sobre a metáfora do cigarro |
| Cinco módulos | Bússola do viver · Capital e tempo · Trabalho e aprendizagem · Viver e conviver · IA e Reaverso |
| Bússola do viver (interativa) | Informa tempo, orçamento (inclusive zero), disposição, companhia e interesses; recebe até três sugestões calculadas no navegador |
| Capital e tempo | Tabela de destinos do dinheiro e calculadora “quantas horas de trabalho custa essa compra?” com as três verificações |
| Trabalho e educação | Passos para autonomia no trabalho e trilhas de uma escola mais estimulante |
| Vínculos, prazer e sexualidade | Convivência, eixo adulto (18+) com consentimento, privacidade e saúde sexual; frente juvenil apenas educativa e protetiva |
| IA e Reaverso | Funções da IA com controle da pessoa e os “feitiços” como linguagem criativa |
| Sociedade | Frentes de acesso, governança e sustentabilidade |
| Piloto de 30 dias | Linha do tempo em quatro fases e revisão semanal interativa |
| Erros a evitar, prompt de continuidade e referências | Com links para as fontes |

Nenhum dado é enviado ou armazenado: todas as interações rodam localmente no navegador.

## Estrutura

```
index.html   — página única com todas as seções
base.css     — reset e fundamentos
style.css    — tokens de design e componentes
app.js       — bússola, calculadora, revisão semanal, navegação
assets/      — ilustrações (WebP)
docs/        — documento-fonte do projeto (Word)
```

## Publicação

O site é estático e pode ser servido pelo GitHub Pages a partir da branch `main` (raiz). Para rodar localmente:

```bash
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Documento-fonte

`docs/Tempo_de_Viver_360X_Projeto_v1.docx` — projeto conceitual v1 (18 de outubro de 2026), com fundamentos, módulos, piloto, indicadores, prompt de continuidade e referências.

## Identificador de continuidade

- **ID:** 360X-TEMPO-VIVER
- **Estado:** projeto conceitual v1 concluído; implantação em exploração
- **Próxima ação:** escolher uma experiência desejada que já seja acessível e reservar dez minutos para começar
