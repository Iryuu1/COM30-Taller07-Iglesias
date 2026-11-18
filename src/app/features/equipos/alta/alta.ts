import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EstadoEquipo } from '../../../models/equipo';
import { EquipoApi } from '../../../services/equipo-api';

@Component({
  selector: 'app-alta-equipo',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './alta.html',
})
export class AltaEquipo {
  private readonly equipoApi = inject(EquipoApi);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly proximoCodigo = this.equipoApi.proximoCodigo;
  protected readonly tipos = ['Portátil', 'Monitor', 'Impresora', 'Router', 'Proyector'];
  protected readonly ubicaciones = ['Sala 1', 'Sala 2', 'Laboratorio', 'Biblioteca'];
  protected readonly estados: readonly EstadoEquipo[] = ['Activo', 'Mantenimiento', 'Baja'];

  protected readonly formulario = this.fb.group({
    tipo: ['', [Validators.required]],
    ubicacion: ['', [Validators.required]],
    estado: this.fb.control<EstadoEquipo>('Activo', [Validators.required]),
  });

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const equipo = this.equipoApi.agregar(this.formulario.getRawValue());

    void this.router.navigate(['/equipos', equipo.codigo]);
  }
}
