import { Component, computed, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { M, PATRON_CODIGO, TOPE } from '../validadores';

@Component({
  selector: 'app-detalle-parcial2',
  imports: [RouterLink],
  templateUrl: './detalle.html',
})
export class DetalleParcial2 {
  readonly codigo = input.required<string>();
  readonly cantidad = input(0, { transform: numberAttribute });

  protected readonly M = M;
  protected readonly TOPE = TOPE;
  protected readonly valido = computed(() => PATRON_CODIGO.test(this.codigo()));
  protected readonly cantidadSegura = computed(() => {
    const cantidad = this.cantidad();

    return Number.isFinite(cantidad) ? cantidad : 0;
  });
  protected readonly bloques = computed(() => this.cantidadSegura() / M);
  protected readonly margen = computed(() => TOPE - this.cantidadSegura());
}
