import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Parámetros de la fila d = 2 de la Tabla 1. */
export const M = 4;
export const TOPE = 24;
export const DESDE = 3;
export const HASTA = 4;

/** Valida que el valor sea un múltiplo exacto del número indicado. */
export function multiploDe(multiplo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return null;
    }

    return numero % multiplo === 0
      ? null
      : { multiplo: { multiplo, actual: numero } };
  };
}

/** Valida que el valor esté dentro del rango cerrado [minimo, maximo]. */
export function rangoEntre(minimo: number, maximo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return null;
    }

    if (numero < minimo) {
      return { min: { min: minimo, actual: numero } };
    }

    if (numero > maximo) {
      return { max: { max: maximo, actual: numero } };
    }

    return null;
  };
}

/** Validador de grupo: hasta debe ser estrictamente mayor que desde. */
export const hastaMayorQueDesde: ValidatorFn = (
  grupo: AbstractControl,
): ValidationErrors | null => {
  const controlDesde = grupo.get('desde');
  const controlHasta = grupo.get('hasta');
  const valorDesde = controlDesde?.value;
  const valorHasta = controlHasta?.value;

  if (
    valorDesde === null ||
    valorDesde === undefined ||
    valorDesde === '' ||
    valorHasta === null ||
    valorHasta === undefined ||
    valorHasta === ''
  ) {
    return null;
  }

  const desde = Number(valorDesde);
  const hasta = Number(valorHasta);

  if (!Number.isFinite(desde) || !Number.isFinite(hasta)) {
    return null;
  }

  return hasta > desde ? null : { hastaMayor: { desde, hasta } };
};
