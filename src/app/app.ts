import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EQUIPOS } from './data/equipos';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly equipos = EQUIPOS;
}
