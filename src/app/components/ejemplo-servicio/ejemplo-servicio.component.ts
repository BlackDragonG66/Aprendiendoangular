import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatosService, Usuario, Mensaje } from '../../services/datos.service';
import { Subscription } from 'rxjs';

/**
 * 🧩 COMPONENTE EJEMPLO SERVICIO
 * 
 * Este componente demuestra:
 * - Inyección de dependencias
 * - Uso de servicios
 * - Subscripciones a Observables
 * - Lifecycle hooks (OnInit, OnDestroy)
 * - Formularios básicos con FormsModule
 * - Manejo de estado asíncrono
 */

@Component({
  selector: 'app-ejemplo-servicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ejemplo-servicio.component.html',
  styleUrl: './ejemplo-servicio.component.scss'
})
export class EjemploServicioComponent implements OnInit, OnDestroy {
  
  // 📝 Propiedades del componente
  usuarios: Usuario[] = [];
  mensajes: Mensaje[] = [];
  loading = false;
  estadisticas = { total: 0, activos: 0, inactivos: 0 };
  
  // Formulario para nuevo usuario
  nuevoUsuario = {
    nombre: '',
    email: ''
  };
  
  // Control de estado
  mostrarFormulario = false;
  operacionEnProceso = false;
  
  // 📝 Subscripciones para cleanup
  private subscriptions: Subscription[] = [];

  constructor(
    private datosService: DatosService // 👈 Inyección de dependencias
  ) {
    console.log('🧩 EjemploServicioComponent creado');
  }

  ngOnInit(): void {
    console.log('🧩 EjemploServicioComponent inicializado');
    this.cargarDatos();
    this.suscribirseAObservables();
  }

  ngOnDestroy(): void {
    console.log('🧩 EjemploServicioComponent destruido');
    // 🧹 Limpiar subscripciones para evitar memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // 📝 Métodos de inicialización
  private cargarDatos(): void {
    // Cargar usuarios con simulación de loading
    const usuariosSub = this.datosService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.datosService.finalizarLoading();
        console.log('✅ Usuarios cargados:', usuarios.length);
      },
      error: (error) => {
        console.error('❌ Error cargando usuarios:', error);
        this.datosService.finalizarLoading();
      }
    });
    
    this.subscriptions.push(usuariosSub);
    
    // Cargar estadísticas
    this.cargarEstadisticas();
  }

  private suscribirseAObservables(): void {
    // Suscribirse a usuarios (reactivo)
    const usuariosSub = this.datosService.usuarios$.subscribe(usuarios => {
      this.usuarios = usuarios;
      this.cargarEstadisticas(); // Actualizar estadísticas cuando cambien usuarios
    });

    // Suscribirse a mensajes (reactivo)
    const mensajesSub = this.datosService.mensajes$.subscribe(mensajes => {
      this.mensajes = mensajes;
    });

    // Suscribirse a loading
    const loadingSub = this.datosService.loading$.subscribe(loading => {
      this.loading = loading;
    });

    this.subscriptions.push(usuariosSub, mensajesSub, loadingSub);
  }

  // 📝 Métodos de interacción
  cargarEstadisticas(): void {
    const estadisticasSub = this.datosService.obtenerEstadisticas().subscribe(stats => {
      this.estadisticas = stats;
    });
    
    this.subscriptions.push(estadisticasSub);
  }

  toggleUsuario(id: number): void {
    this.datosService.toggleUsuarioActivo(id);
  }

  agregarUsuario(): void {
    if (this.nuevoUsuario.nombre.trim() && this.nuevoUsuario.email.trim()) {
      this.datosService.agregarUsuario(
        this.nuevoUsuario.nombre.trim(),
        this.nuevoUsuario.email.trim()
      );
      
      // Limpiar formulario
      this.nuevoUsuario = { nombre: '', email: '' };
      this.mostrarFormulario = false;
    }
  }

  cancelarFormulario(): void {
    this.nuevoUsuario = { nombre: '', email: '' };
    this.mostrarFormulario = false;
  }

  ejecutarOperacionAsincrona(): void {
    this.operacionEnProceso = true;
    
    const operacionSub = this.datosService.operacionAsincrona().subscribe({
      next: (resultado) => {
        this.datosService.agregarMensaje(resultado, 'success');
        this.operacionEnProceso = false;
      },
      error: (error) => {
        this.datosService.agregarMensaje('Error en la operación', 'error');
        this.operacionEnProceso = false;
      }
    });
    
    this.subscriptions.push(operacionSub);
  }

  limpiarMensajes(): void {
    this.datosService.limpiarMensajes();
  }

  agregarMensajePersonalizado(): void {
    const mensajes = [
      'Los servicios son geniales! 🚀',
      'Angular facilita la inyección de dependencias 💉',
      'RxJS hace que todo sea reactivo ⚡',
      'Los Observables son súper útiles 👀',
      'TypeScript + Angular = ❤️'
    ];
    
    const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
    this.datosService.agregarMensaje(mensajeAleatorio, 'info');
  }

  // 📝 Métodos utilitarios
  obtenerClaseMensaje(tipo: Mensaje['tipo']): string {
    const clases = {
      info: 'mensaje-info',
      success: 'mensaje-success',
      warning: 'mensaje-warning',
      error: 'mensaje-error'
    };
    return clases[tipo];
  }

  obtenerEmojiTipo(tipo: Mensaje['tipo']): string {
    const emojis = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return emojis[tipo];
  }

  // 📝 TrackBy functions para optimizar *ngFor
  trackByUsuarioId(index: number, usuario: Usuario): number {
    return usuario.id;
  }

  trackByMensajeId(index: number, mensaje: Mensaje): number {
    return mensaje.id;
  }
}
