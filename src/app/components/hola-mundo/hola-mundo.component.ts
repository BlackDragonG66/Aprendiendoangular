import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 🎯 COMPONENTE HOLA MUNDO
 * 
 * Este es un ejemplo básico de un componente Angular que demuestra:
 * - Decorador @Component
 * - Properties del componente
 * - Interpolación en el template
 * - Property binding
 * - Event binding
 * - Directivas estructurales básicas
 */

@Component({
  selector: 'app-hola-mundo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hola-mundo.component.html',
  styleUrl: './hola-mundo.component.scss'
})
export class HolaMundoComponent {
  // 📝 Propiedades del componente
  titulo = 'Hola Mundo';
  mensaje = '¡Bienvenido a Angular!';
  contador = 0;
  usuario = 'Desarrollador';
  
  // Array para demostrar *ngFor
  tecnologias = [
    'TypeScript',
    'HTML',
    'SCSS',
    'RxJS',
    'Signals'
  ];
  
  // Boolean para demostrar *ngIf
  mostrarDetalles = false;
  
  // 📝 Métodos del componente (Event Binding)
  incrementar() {
    this.contador++;
  }
  
  decrementar() {
    this.contador--;
  }
  
  resetear() {
    this.contador = 0;
  }
  
  toggleDetalles() {
    this.mostrarDetalles = !this.mostrarDetalles;
  }
  
  cambiarUsuario() {
    const nombres = ['Ana', 'Carlos', 'María', 'José', 'Desarrollador'];
    const indiceActual = nombres.indexOf(this.usuario);
    const siguienteIndice = (indiceActual + 1) % nombres.length;
    this.usuario = nombres[siguienteIndice];
  }
}
