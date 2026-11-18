import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrada',
  imports: [RouterLink],
  templateUrl: './no-encontrada.html',
})
export class NoEncontrada {
  private readonly router = inject(Router);

  protected get direccion(): string {
    return this.router.url;
  }
}
