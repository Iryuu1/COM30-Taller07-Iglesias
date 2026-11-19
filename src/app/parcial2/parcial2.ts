import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
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

  protected readonly M = M;
  protected readonly TOPE = TOPE;
  protected readonly enviado = signal(false);

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
