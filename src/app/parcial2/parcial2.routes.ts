import { Routes } from '@angular/router';
import { Parcial2 } from './parcial2';
import { DetalleParcial2 } from './detalle/detalle';

export const PARCIAL2_ROUTES: Routes = [
  {
    path: '',
    component: Parcial2,
    title: 'Parcial 2 · Solicitud validada',
  },
  {
    path: 'detalle/:codigo',
    component: DetalleParcial2,
    title: 'Detalle de la solicitud · Parcial 2',
  },
];
