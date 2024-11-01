import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ANALYSIS_PROMPT } from './analysis-prompt';
import { ANALYSIS_PROMPT_ERROR_MESSAGES } from './analysis-prompt-error-msg';

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
      const prompt = ANALYSIS_PROMPT;

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
          ANALYSIS_PROMPT_ERROR_MESSAGES.PROCESSING_ERROR
        );
      }

      console.log('Texto da resposta:', text); // Log para verificar o texto da resposta

      return text;
    } catch (error) {
      console.error('Erro ao identificar planta:', error);
      throw new Error(
        ANALYSIS_PROMPT_ERROR_MESSAGES.IMAGE_PROCESSING_ERROR
      );
    }
  }
}
