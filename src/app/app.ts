import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Aplicación Angular - Ejemplo Educativo';
  
  // Propiedades para demostrar data binding
  mensaje = '¡Hola! Esta es una aplicación Angular';
  mostrarComponentes = true;
  
  // Método para demostrar event binding
  toggleComponentes() {
    this.mostrarComponentes = !this.mostrarComponentes;
  }
}
