import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipoApi } from '../../../services/equipo-api';
import { EstadoEquipo } from '../../../models/equipo';

@Component({
  selector: 'app-listado-equipos',
  imports: [RouterLink],
  templateUrl: './listado.html',
})
export class ListadoEquipos {
  private readonly equipoApi = inject(EquipoApi);

  readonly estado = input<string>();
  protected readonly equipos = this.equipoApi.equipos;
  protected readonly total = this.equipoApi.total;

  protected readonly estados: readonly EstadoEquipo[] = ['Activo', 'Mantenimiento', 'Baja'];

  protected readonly visibles = computed(() => {
    const estado = this.estado();
    const equipos = this.equipos();

    return estado ? equipos.filter((equipo) => equipo.estado === estado) : equipos;
  });

  protected readonly conteos = computed(() => {
    const equipos = this.equipos();

    return {
      Activo: equipos.filter((equipo) => equipo.estado === 'Activo').length,
      Mantenimiento: equipos.filter((equipo) => equipo.estado === 'Mantenimiento').length,
      Baja: equipos.filter((equipo) => equipo.estado === 'Baja').length,
    } as const;
  });
}
