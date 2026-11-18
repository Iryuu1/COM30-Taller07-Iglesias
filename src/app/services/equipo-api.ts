import { computed, Injectable, signal } from '@angular/core';
import { EQUIPOS } from '../data/equipos';
import { Equipo } from '../models/equipo';

@Injectable({ providedIn: 'root' })
export class EquipoApi {
  private readonly equiposInternos = signal<readonly Equipo[]>([...EQUIPOS]);

  readonly equipos = this.equiposInternos.asReadonly();
  readonly total = computed(() => this.equiposInternos().length);

  readonly proximoCodigo = computed(() => {
    const ultimo = this.equiposInternos().reduce((maximo, equipo) => {
      const numero = Number(equipo.codigo.replace(/\D/g, ''));
      return Number.isFinite(numero) ? Math.max(maximo, numero) : maximo;
    }, 0);

    return `EQ-${String(ultimo + 1).padStart(3, '0')}`;
  });

  buscar(codigo: string): Equipo | undefined {
    const buscado = codigo.trim().toUpperCase();

    return this.equiposInternos().find((equipo) => equipo.codigo.toUpperCase() === buscado);
  }

  agregar(datos: Omit<Equipo, 'codigo'>): Equipo {
    const equipo: Equipo = { codigo: this.proximoCodigo(), ...datos };

    this.equiposInternos.update((equipos) => [...equipos, equipo]);

    return equipo;
  }
}
