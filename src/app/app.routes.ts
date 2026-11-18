import { Routes } from '@angular/router';
import { AltaEquipo } from './features/equipos/alta/alta';
import { DetalleEquipo } from './features/equipos/detalle/detalle';
import { ListadoEquipos } from './features/equipos/listado/listado';
import { NoEncontrada } from './features/no-encontrada/no-encontrada';

export const routes: Routes = [
  { path: '', redirectTo: 'equipos', pathMatch: 'full' },
  {
    path: 'equipos',
    component: ListadoEquipos,
    title: 'Equipos · Inventario',
  },
  {
    path: 'equipos/nueva',
    component: AltaEquipo,
    title: 'Nuevo equipo · Inventario',
  },
  {
    path: 'equipos/:codigo',
    component: DetalleEquipo,
    title: 'Detalle del equipo · Inventario',
  },
  {
    path: 'estadisticas',
    loadComponent: () =>
      import('./features/estadisticas/estadisticas').then((modulo) => modulo.Estadisticas),
    title: 'Estadísticas · Inventario',
  },
  {
    path: '**',
    component: NoEncontrada,
    title: 'Página no encontrada · Inventario',
  },
];
