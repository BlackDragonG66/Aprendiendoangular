import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';

/**
 * 🔧 SERVICIO DE DATOS
 * 
 * Este servicio demuestra:
 * - Decorador @Injectable
 * - Inyección de dependencias
 * - Observables y BehaviorSubject
 * - Simulación de API calls
 * - Gestión de estado básico
 */

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

export interface Mensaje {
  id: number;
  texto: string;
  timestamp: Date;
  tipo: 'info' | 'success' | 'warning' | 'error';
}

@Injectable({
  providedIn: 'root' // 👈 Singleton en toda la aplicación
})
export class DatosService {
  
  // 📝 Estado privado del servicio
  private usuarios: Usuario[] = [
    { id: 1, nombre: 'Ana García', email: 'ana@example.com', activo: true },
    { id: 2, nombre: 'Carlos López', email: 'carlos@example.com', activo: true },
    { id: 3, nombre: 'María Rodríguez', email: 'maria@example.com', activo: false },
    { id: 4, nombre: 'José Martínez', email: 'jose@example.com', activo: true },
  ];

  private mensajes: Mensaje[] = [
    {
      id: 1,
      texto: '¡Bienvenido a Angular!',
      timestamp: new Date(),
      tipo: 'success'
    },
    {
      id: 2,
      texto: 'Los servicios permiten compartir datos entre componentes',
      timestamp: new Date(Date.now() - 60000),
      tipo: 'info'
    },
    {
      id: 3,
      texto: 'RxJS hace que el manejo de datos asíncronos sea fácil',
      timestamp: new Date(Date.now() - 120000),
      tipo: 'info'
    }
  ];

  // 📝 BehaviorSubject para estado reactivo
  private usuariosSubject = new BehaviorSubject<Usuario[]>(this.usuarios);
  private mensajesSubject = new BehaviorSubject<Mensaje[]>(this.mensajes);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // 📝 Observables públicos (solo lectura)
  usuarios$ = this.usuariosSubject.asObservable();
  mensajes$ = this.mensajesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    console.log('🔧 DatosService inicializado');
  }

  // 📝 Métodos para manejar usuarios
  obtenerUsuarios(): Observable<Usuario[]> {
    this.loadingSubject.next(true);
    
    // Simular llamada a API con delay
    return of(this.usuarios).pipe(
      delay(1000) // Simula latencia de red
    );
  }

  obtenerUsuariosActivos(): Observable<Usuario[]> {
    const usuariosActivos = this.usuarios.filter(u => u.activo);
    return of(usuariosActivos).pipe(delay(500));
  }

  agregarUsuario(nombre: string, email: string): void {
    const nuevoUsuario: Usuario = {
      id: this.usuarios.length + 1,
      nombre,
      email,
      activo: true
    };
    
    this.usuarios.push(nuevoUsuario);
    this.usuariosSubject.next([...this.usuarios]);
    
    this.agregarMensaje(
      `Usuario "${nombre}" agregado exitosamente`,
      'success'
    );
  }

  toggleUsuarioActivo(id: number): void {
    const usuario = this.usuarios.find(u => u.id === id);
    if (usuario) {
      usuario.activo = !usuario.activo;
      this.usuariosSubject.next([...this.usuarios]);
      
      this.agregarMensaje(
        `Usuario "${usuario.nombre}" ${usuario.activo ? 'activado' : 'desactivado'}`,
        usuario.activo ? 'success' : 'warning'
      );
    }
  }

  // 📝 Métodos para manejar mensajes
  agregarMensaje(texto: string, tipo: Mensaje['tipo'] = 'info'): void {
    const nuevoMensaje: Mensaje = {
      id: this.mensajes.length + 1,
      texto,
      timestamp: new Date(),
      tipo
    };
    
    this.mensajes.unshift(nuevoMensaje); // Agregar al inicio
    this.mensajesSubject.next([...this.mensajes]);
  }

  limpiarMensajes(): void {
    this.mensajes = [];
    this.mensajesSubject.next([]);
  }

  // 📝 Métodos utilitarios
  obtenerEstadisticas(): Observable<{ total: number; activos: number; inactivos: number }> {
    const total = this.usuarios.length;
    const activos = this.usuarios.filter(u => u.activo).length;
    const inactivos = total - activos;
    
    return of({ total, activos, inactivos }).pipe(delay(300));
  }

  // 📝 Simular operación asíncrona
  operacionAsincrona(): Observable<string> {
    this.loadingSubject.next(true);
    
    return of('¡Operación completada exitosamente!').pipe(
      delay(2000) // Simula operación lenta
    );
  }

  // 📝 Método para finalizar loading
  finalizarLoading(): void {
    this.loadingSubject.next(false);
  }
}
