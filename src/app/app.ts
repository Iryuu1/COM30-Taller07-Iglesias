import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, debounceTime, distinctUntilChanged, finalize, map, of, startWith, switchMap } from 'rxjs';
import { EquipoApi } from './services/equipo-api';
import { Equipo } from './models/equipo';

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
}
