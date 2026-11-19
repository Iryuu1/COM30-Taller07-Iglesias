import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { EquipoApi } from '../services/equipo-api';
import {
  DESDE,
  HASTA,
  M,
  TOPE,
  hastaMayorQueDesde,
  multiploDe,
  rangoEntre,
} from './validadores';

@Component({
  selector: 'app-parcial2',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './parcial2.html',
})
export class Parcial2 {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly equipoApi = inject(EquipoApi);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly M = M;
  protected readonly TOPE = TOPE;
  protected readonly enviado = signal(false);

  protected readonly buscar = new FormControl('', { nonNullable: true });
  protected readonly ultimoValor = signal('');
  protected readonly emisiones = signal(0);

  protected readonly equipos = this.equipoApi.equipos;
  protected readonly visibles = computed(() => {
    const termino = this.ultimoValor().toLowerCase();
    const equipos = this.equipos();

    if (!termino) {
      return equipos;
    }

    return equipos.filter((equipo) =>
      [equipo.codigo, equipo.tipo, equipo.ubicacion, equipo.estado].some((valor) =>
        valor.toLowerCase().includes(termino),
      ),
    );
  });

  protected readonly formulario = this.fb.group(
    {
      codigo: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^[A-Z]{2}\d{3}$/),
      ]),
      cantidad: this.fb.control(1, [
        Validators.required,
        rangoEntre(1, TOPE),
        multiploDe(M),
      ]),
      desde: this.fb.control(DESDE, [Validators.required]),
      hasta: this.fb.control(HASTA, [Validators.required]),
    },
    { validators: hastaMayorQueDesde },
  );

  constructor() {
    this.buscar.valueChanges
      .pipe(
        debounceTime(300),
        map((valor) => valor.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((valor) => {
        this.ultimoValor.set(valor);
        this.emisiones.update((total) => total + 1);
      });
  }

  protected mostrarError(campo: 'codigo' | 'cantidad' | 'desde' | 'hasta'): boolean {
    const control = this.formulario.controls[campo];

    return control.invalid && (control.touched || control.dirty);
  }

  protected mostrarErrorHastaMayor(): boolean {
    const hasta = this.formulario.controls.hasta;

    return this.formulario.hasError('hastaMayor') && (hasta.touched || hasta.dirty);
  }

  protected enviar(): void {
    this.enviado.set(false);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviado.set(true);
  }
}
