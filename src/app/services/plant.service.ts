import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(
      'AIzaSyC6a46sCUIIT7u0PUbyvcnGGjZLlmoOofs'
    );
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  async identifyPlant(imageData: string): Promise<string> {
    try {
      const prompt = `Analise esta imagem específica de planta e forneça informações detalhadas em português do Brasil.
      Por favor, identifique APENAS a planta mostrada na imagem atual e inclua os seguintes tópicos:

      1. Nome comum e nome científico da planta identificada na imagem
      2. Características principais (aparência, tamanho, cores, etc.)
      3. Cuidados necessários:
         - Rega (frequência e quantidade)
         - Iluminação ideal
         - Solo adequado
         - Temperatura ideal
      4. Benefícios e curiosidades específicas desta planta
      5. Problemas comuns e soluções
      6. Métodos de propagação recomendados

      IMPORTANTE: Certifique-se de que todas as informações sejam específicas APENAS para a planta mostrada na imagem atual.
      NÃO reutilize informações de análises anteriores.
      Formate a resposta de maneira clara e estruturada, usando emojis relevantes no início de cada seção.

      Retorne as informações em formato { "key": "texto", }com keys: nome, nomeCientifico, características, cuidadosNecessario, beneficiosCuriosidades, problemasSolucoes, metodosPropagacao
      NÃO retorne esse caracter "*", "**", *, (*), (**)
      
      `;

      // Fetch image as array buffer and convert to Base64
      const imageBytes = await fetch(imageData).then((res) =>
        res.arrayBuffer()
      );
      const base64Image = btoa(
        new Uint8Array(imageBytes).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      console.log('Imagem em Base64:', base64Image); // Log para verificar o Base64

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg',
        },
      };

      // Envio para API
      const result = await this.model.generateContent([prompt, imagePart]);
      console.log('Resposta da API:', result); // Log para verificar a resposta da API

      const response = await result.response;
      const text = await response.text();

      if (!text || text.trim() === '') {
        throw new Error(
          'Não foi possível identificar a planta. Por favor, tente novamente com outra imagem.'
        );
      }

      console.log('Texto da resposta:', text); // Log para verificar o texto da resposta

      return text;
    } catch (error) {
      console.error('Erro ao identificar planta:', error);
      throw new Error(
        'Erro ao processar a imagem. Por favor, verifique se a imagem é clara e tente novamente.'
      );
    }
  }
}
