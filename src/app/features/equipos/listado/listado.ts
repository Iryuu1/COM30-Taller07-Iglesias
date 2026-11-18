import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipoApi } from '../../../services/equipo-api';

@Component({
  selector: 'app-listado-equipos',
  imports: [RouterLink],
  templateUrl: './listado.html',
})
export class ListadoEquipos {
  private readonly equipoApi = inject(EquipoApi);

  protected readonly equipos = this.equipoApi.equipos;
  protected readonly total = this.equipoApi.total;
}
