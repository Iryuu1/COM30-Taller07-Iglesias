import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, debounceTime, distinctUntilChanged, finalize, map, of, startWith, switchMap, tap } from 'rxjs';
import { EquipoApi } from './services/equipo-api';
import { Equipo, EstadoEquipo } from './models/equipo';

@Component({
  imports: [ReactiveFormsModule, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly equipoApi = inject(EquipoApi);
  protected readonly busqueda = new FormControl('', { nonNullable: true });
  protected readonly buscando = signal(false);
  protected readonly filtroEstado = signal<'Todos' | EstadoEquipo>('Todos');
  private readonly consultaProcesada = signal('');

  protected readonly consultaActual = toSignal(
    this.busqueda.valueChanges.pipe(
      map((texto) => texto.trim()),
      startWith(this.busqueda.value),
    ),
    { initialValue: '' },
  );

  protected readonly equipos = toSignal(
    this.busqueda.valueChanges.pipe(
      map((texto) => texto.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      tap((texto) => this.consultaProcesada.set(texto)),
      startWith(this.busqueda.value),
      switchMap((texto): Observable<Equipo[]> => {
        if (texto.length < 2) {
          this.buscando.set(false);
          return of([]);
        }

        this.buscando.set(true);
        return this.equipoApi.buscar(texto).pipe(
          finalize(() => this.buscando.set(false)),
        );
      }),
    ),
    { initialValue: [] },
  );

  protected readonly estadoBusqueda = computed(() => {
    const consulta = this.consultaActual();

    if (consulta.length < 2) {
      return 'minimo';
    }

    if (consulta !== this.consultaProcesada() || this.buscando()) {
      return 'buscando';
    }

    return this.equipos().length === 0 ? 'vacio' : 'resultados';
  });

  protected readonly resumen = computed(() => {
    const equipos = this.equipos();

    return {
      total: equipos.length,
      activos: equipos.filter((equipo) => equipo.estado === 'Activo').length,
      mantenimiento: equipos.filter((equipo) => equipo.estado === 'Mantenimiento').length,
      bajas: equipos.filter((equipo) => equipo.estado === 'Baja').length,
    };
  });

  protected readonly equiposVisibles = computed(() => {
    const estado = this.filtroEstado();
    const equipos = this.equipos();

    return estado === 'Todos'
      ? equipos
      : equipos.filter((equipo) => equipo.estado === estado);
  });

  protected readonly filtroSinResultados = computed(
    () => this.estadoBusqueda() === 'resultados' && this.equiposVisibles().length === 0,
  );

  protected cambiarFiltro(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;

    if (valor === 'Todos' || valor === 'Activo' || valor === 'Mantenimiento' || valor === 'Baja') {
      this.filtroEstado.set(valor);
    }
  }
}
