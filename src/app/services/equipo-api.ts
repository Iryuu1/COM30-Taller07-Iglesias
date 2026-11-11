import { Injectable, signal } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EQUIPOS } from '../data/equipos';
import { Equipo } from '../models/equipo';

@Injectable({ providedIn: 'root' })
export class EquipoApi {
  private readonly equipos = EQUIPOS;
  private readonly llamadasInternas = signal(0);
  readonly llamadas = this.llamadasInternas.asReadonly();

  buscar(texto: string): Observable<Equipo[]> {
    const consulta = texto.trim();
    const consultaNormalizada = this.normalizar(consulta);
    const retardo = Math.max(150, 1500 - 300 * consulta.length);

    return defer(() => {
      this.llamadasInternas.update((total) => total + 1);

      const resultado = this.equipos.filter((equipo) => {
        const campos = `${equipo.codigo} ${equipo.tipo} ${equipo.ubicacion}`;
        return this.normalizar(campos).includes(consultaNormalizada);
      });

      return of(resultado).pipe(delay(retardo));
    });
  }

  private normalizar(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es')
      .trim();
  }
}
