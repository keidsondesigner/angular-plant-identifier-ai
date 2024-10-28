import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { PlantUploaderComponent } from './app/components/plant-uploader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlantUploaderComponent],
  template: `
    <div class="min-h-screen py-8">
      <header class="text-center mb-12">
        <h1 class="text-5xl font-bold text-green-800 mb-4">
          <i class="fas fa-leaf mr-2"></i>Identificador de Plantas
        </h1>
        <p class="text-xl text-gray-600">
          Envie uma foto de qualquer planta para identificá-la e aprender mais sobre ela
        </p>
      </header>
      
      <app-plant-uploader></app-plant-uploader>

      <footer class="text-center mt-12 text-gray-500">
        <p>Desenvolvido com <i class="fas fa-heart text-red-500"></i> para amantes de plantas</p>
      </footer>
    </div>
  `
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
});