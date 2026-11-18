import { computed, Injectable, signal } from '@angular/core';
import { EQUIPOS } from '../data/equipos';
import { Equipo } from '../models/equipo';

@Injectable({ providedIn: 'root' })
export class EquipoApi {
  private readonly equiposInternos = signal<readonly Equipo[]>([...EQUIPOS]);

  readonly equipos = this.equiposInternos.asReadonly();
  readonly total = computed(() => this.equiposInternos().length);
}
