import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipoApi } from '../../services/equipo-api';

interface GrupoEstadistica {
  valor: string;
  cantidad: number;
  porcentaje: number;
}

@Component({
  selector: 'app-estadisticas',
  imports: [RouterLink],
  templateUrl: './estadisticas.html',
})
export class Estadisticas {
  private readonly equipoApi = inject(EquipoApi);

  protected readonly total = this.equipoApi.total;
  protected readonly equipos = this.equipoApi.equipos;
  protected readonly porEstado = computed(() => this.agrupar('estado'));
  protected readonly porTipo = computed(() => this.agrupar('tipo'));
  protected readonly porUbicacion = computed(() => this.agrupar('ubicacion'));

  private agrupar(campo: 'estado' | 'tipo' | 'ubicacion'): GrupoEstadistica[] {
    const equipos = this.equipos();
    const conteos = new Map<string, number>();

    for (const equipo of equipos) {
      conteos.set(equipo[campo], (conteos.get(equipo[campo]) ?? 0) + 1);
    }

    return [...conteos.entries()]
      .map(([valor, cantidad]) => ({
        valor,
        cantidad,
        porcentaje: equipos.length === 0 ? 0 : Math.round((cantidad / equipos.length) * 100),
      }))
      .sort((a, b) => b.cantidad - a.cantidad || a.valor.localeCompare(b.valor));
  }
}
