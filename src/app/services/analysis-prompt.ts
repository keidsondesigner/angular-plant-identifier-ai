export const ANALYSIS_PROMPT =  `Analise esta imagem focando EXCLUSIVAMENTE na planta presente. Ignore completamente quaisquer outros elementos como carros, pessoas, móveis ou objetos. Esta análise deve ser fornecida em português do Brasil.

REGRAS ESTRITAS:
- Analise SOMENTE a planta na imagem
- Ignore COMPLETAMENTE qualquer outro elemento que não seja a planta
- Retorne APENAS o objeto JSON, sem markdown ou formatação adicional
- Se a imagem não contiver uma planta, retorne: {"erro": "Nenhuma planta identificada na imagem"}

TÓPICOS OBRIGATÓRIOS:
1. Identificação Botânica (nome e nome científico)
2. Descrição morfológica (porte, cores, características)
3. Requisitos de cultivo (rega, luz, solo, temperatura)
4. Informações complementares (benefícios, problemas, propagação)

FORMATO DE RESPOSTA:
Retorne exatamente neste formato JSON, sem nenhum texto adicional antes ou depois:
{
  "nome": "Nome popular da planta",
  "nomeCientifico": "Genus species",
  "caracteristicas": "Descrição das características",
  "cuidadosNecessarios": "Detalhes sobre os cuidados",
  "beneficiosCuriosidades": "Benefícios e curiosidades",
  "problemasSolucoes": "Problemas comuns e soluções",
  "metodosPropagacao": "Métodos de propagação"
}`;