import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantService, PlantAnalysis } from '../services/plant.service';

@Component({
  selector: 'app-plant-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div 
        class="border-2 border-dashed border-green-400 rounded-lg p-8 text-center hover:border-green-600 transition-colors cursor-pointer bg-white/50 backdrop-blur-sm"
        [class.bg-green-50]="isDragging"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()">
        <input
          #fileInput
          type="file"
          class="hidden"
          accept="image/*"
          (change)="onFileSelected($event)">
        <div class="space-y-4">
          <div class="text-5xl text-green-600">
            <i class="fas fa-leaf animate-bounce"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-700">
            Arraste sua foto aqui
          </h3>
          <p class="text-sm text-gray-500">
            ou clique para selecionar um arquivo
          </p>
        </div>
      </div>

      <div *ngIf="isLoading" class="mt-8 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-lg text-gray-600">Analisando sua planta...</p>
      </div>

      <div *ngIf="plantInfo && !isLoading" class="mt-8">
        <div class="overflow-hidden">
          <div *ngIf="previewUrl" class="w-full h-64 bg-gray-100">
            <img [src]="previewUrl" class="w-full h-full object-contain" alt="Planta enviada">
          </div>
          
          <div class="bg-white rounded-xl shadow-md p-6 mt-4">
            <h2 class="text-2xl font-bold text-green-800 mb-4">{{ plantInfo.nome }}</h2>
            <p class="text-gray-600 italic mb-6">{{ plantInfo.nomeCientifico }}</p>
            
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold text-green-700">Características</h3>
                <p class="text-gray-700">{{ plantInfo.caracteristicas }}</p>
              </div>
              
              <div>
                <h3 class="text-xl font-semibold text-green-700">Cuidados Necessários</h3>
                <p class="text-gray-700">{{ plantInfo.cuidadosNecessarios }}</p>
              </div>
              
              <div>
                <h3 class="text-xl font-semibold text-green-700">Benefícios e Curiosidades</h3>
                <p class="text-gray-700">{{ plantInfo.beneficiosCuriosidades }}</p>
              </div>
              
              <div>
                <h3 class="text-xl font-semibold text-green-700">Problemas e Soluções</h3>
                <p class="text-gray-700">{{ plantInfo.problemasSolucoes }}</p>
              </div>
              
              <div>
                <h3 class="text-xl font-semibold text-green-700">Métodos de Propagação</h3>
                <p class="text-gray-700">{{ plantInfo.metodosPropagacao }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="mt-6 bg-red-50 text-red-600 p-4 rounded-lg text-center">
        {{ error }}
      </div>
    </div>
  `,
  styles: [``],
})
export class PlantUploaderComponent {
  isDragging = false;
  isLoading = false;
  plantInfo: PlantAnalysis | null = null;
  error: string | null = null;
  previewUrl: string | null = null;

  constructor(private plantService: PlantService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  private clearPreviousResults() {
    this.plantInfo = null;
    this.error = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }

  private async handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.error = 'Por favor, selecione apenas arquivos de imagem.';
      return;
    }

    this.clearPreviousResults();
    this.isLoading = true;
    this.createImagePreview(file);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imageData = e.target?.result as string;
        const result = await this.plantService.identifyPlant(imageData);
        this.plantInfo = result;
        this.error = null;
      } catch (error: any) {
        this.error = error.message;
        this.plantInfo = null;
      } finally {
        this.isLoading = false;
      }
    };
    reader.readAsDataURL(file);
  }

  private createImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
