/**
 * Convierte una fecha que viene de la API al formato que espera `ion-datetime`.
 *
 * `ion-datetime` no tiene noción de zona horaria: muestra los dígitos del
 * string tal cual se los damos. El backend devuelve siempre UTC
 * ("2026-09-08T17:23:00.000Z"), así que al reabrir un recordatorio ya creado el
 * picker mostraba las 17:23 en vez de las 14:23 de Argentina, y si el usuario
 * confirmaba sin corregir, guardaba la hora corrida.
 *
 * Devolvemos entonces un string "flotante" con los componentes locales y sin
 * offset, igual que `minDate`. Al confirmar, Ionic le agrega el offset real del
 * dispositivo, así que la vuelta al backend sigue siendo correcta.
 */
export function toPickerValue(value?: string | Date | null): string | undefined {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const pad = (n: number) => String(n).padStart(2, '0');
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

  return `${day}T${time}`;
}
