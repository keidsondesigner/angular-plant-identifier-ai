import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ANALYSIS_PROMPT_ERROR_MESSAGES } from './analysis-prompt-error-msg';

export interface PlantAnalysis {
  nome: string;
  nomeCientifico: string;
  caracteristicas: string;
  cuidadosNecessarios: string;
  beneficiosCuriosidades: string;
  problemasSolucoes: string;
  metodosPropagacao: string;
}

interface ApiError {
  message: string;
  statusCode?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  // backend Nest
  private apiUrl = 'http://localhost:3000/plant';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string>('');

  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  async identifyPlant(imageData: string): Promise<PlantAnalysis> {
    try {
      this.loadingSubject.next(true);
      this.errorSubject.next('');

      // Backend Python com proxy.conf.json
      // const response = await this.http
      //   .post<PlantAnalysis>('/plant/identify', { imageData })
      //   .toPromise();

      const response = await this.http
        .post<PlantAnalysis>(`${this.apiUrl}/identify`, { imageData })
        .toPromise();


      if (!response) {
        throw new Error(ANALYSIS_PROMPT_ERROR_MESSAGES.PROCESSING_ERROR);
      }

      return response;
    } catch (error: unknown) {
      console.error('Erro ao identificar planta:', error);

      let errorMessage = ANALYSIS_PROMPT_ERROR_MESSAGES.IMAGE_PROCESSING_ERROR;

      if (error instanceof HttpErrorResponse) {
        // Erro de resposta HTTP
        const apiError = error.error as ApiError;
        errorMessage = apiError.message || errorMessage;
      } else if (error instanceof Error) {
        // Erro JavaScript padrão
        errorMessage = error.message;
      }
      
      this.errorSubject.next(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
