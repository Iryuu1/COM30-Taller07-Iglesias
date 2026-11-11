export type EstadoEquipo = 'Activo' | 'Mantenimiento' | 'Baja';

export interface Equipo {
  codigo: string;
  tipo: string;
  ubicacion: string;
  estado: EstadoEquipo;
}
