import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipoApi } from '../../../services/equipo-api';

@Component({
  selector: 'app-detalle-equipo',
  imports: [RouterLink],
  templateUrl: './detalle.html',
})
export class DetalleEquipo {
  private readonly equipoApi = inject(EquipoApi);

  readonly codigo = input.required<string>();
  protected readonly equipo = computed(() => this.equipoApi.buscar(this.codigo()));
}
