import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantService } from '../services/plant.service';

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
          <div class="grid gap-4">
          <div *ngFor="let section of formattedSections" class="bg-white rounded-xl shadow-md p-6 mb-4">
            <div [innerHTML]="section"></div>
          </div>
        </div>
        </div>
      </div>

      <div *ngIf="error" class="mt-6 bg-red-50 text-red-600 p-4 rounded-lg text-center">
        {{ error }}
      </div>
    </div>
  `,
  styles: [
    `
    .plant-info :deep(h2) {
      @apply text-2xl font-bold text-green-800 mt-6 mb-4;
    }
    .plant-info :deep(h3) {
      @apply text-xl font-semibold text-green-700 mt-4 mb-2;
    }
    .plant-info :deep(ul) {
      @apply space-y-2 my-4;
    }
    .plant-info :deep(li) {
      @apply flex items-start;
    }
    .plant-info :deep(li::before) {
      content: "🌱";
      @apply mr-2;
    }
  `,
  ],
})
export class PlantUploaderComponent {
  isDragging = false;
  isLoading = false;
  plantInfo: string | null = null;
  error: string | null = null;
  previewUrl: string | null = null;

  constructor(private plantService: PlantService) {}

  get formattedSections(): string[] {
    if (!this.plantInfo) return [];
    try {
      console.log('JSON recebido:', this.plantInfo);

      // Remove qualquer texto adicional antes ou depois do JSON
      const cleanJson = this.plantInfo.trim()
        .replace(/^[\s\S]*?({[\s\S]*})[\s\S]*$/, '$1')
        .replace(/```json/g, '')
        .replace(/```/g, '');
      
      console.log('JSON limpo:', cleanJson);

      const jsonContent = JSON.parse(cleanJson);
      return Object.keys(jsonContent).map((key) => {
        const sectionContent = jsonContent[key];
        return `<div class="card-section"><strong>${key}</strong>: ${sectionContent}</div>`;
      });
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return [];
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
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
    this.previewUrl = null;
  }

  private handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.error = 'Por favor, envie apenas arquivos de imagem.';
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
