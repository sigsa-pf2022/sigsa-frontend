/**
 * Estados de un evento (turno, recordatorio de medicamento) y cómo se muestran.
 *
 * El backend maneja cinco estados; antes acá sólo estaban mapeados tres, así
 * que un evento en `sended` o `discarded` se dibujaba sin ninguna pastilla y
 * parecía un error de renderizado.
 *
 * Además del estado hay una segunda dimensión: si el evento ya pasó y si
 * alguien se hizo cargo. Se resuelven juntas en `resolveEventStatus` para que
 * las listas y las vistas de detalle no vuelvan a divergir.
 */

export enum EventStatusEnum {
  CREADO = 'created',
  AVISADO = 'sended',
  CONFIRMADO = 'confirmed',
  DESCARTADO = 'discarded',
  CANCELADO = 'canceled',
}

/** `neutral` es la pastilla base, sin modificador: gris. */
export type EventStatusColor = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export type EventStatus = { value: EventStatusEnum; text: string; color: EventStatusColor };

export const EVENT_STATUS: EventStatus[] = [
  { value: EventStatusEnum.CREADO, text: 'PROGRAMADO', color: 'primary' },
  { value: EventStatusEnum.AVISADO, text: 'AVISADO', color: 'neutral' },
  { value: EventStatusEnum.CONFIRMADO, text: 'CONFIRMADO', color: 'success' },
  { value: EventStatusEnum.DESCARTADO, text: 'DESCARTADO', color: 'neutral' },
  { value: EventStatusEnum.CANCELADO, text: 'CANCELADO', color: 'danger' },
];

/** Rojo sólo para cancelado: es el único estado terminal negativo. */
export const STATUS_BADGE_CLASS: Record<EventStatusColor, string> = {
  neutral: '',
  primary: 'status-badge--violet',
  success: 'status-badge--success',
  warning: 'status-badge--warning',
  danger: 'status-badge--danger',
};

/** Estados que siguen abiertos: todavía esperan que alguien haga algo. */
const ABIERTOS: EventStatusEnum[] = [EventStatusEnum.CREADO, EventStatusEnum.AVISADO];

export type EventLike = {
  status?: string;
  date?: string | Date;
  takenChargeByUserId?: number | null;
};

/**
 * Qué pastilla corresponde a un evento, cruzando estado con el paso del tiempo.
 *
 * Un evento abierto cuya fecha pasó y que nadie tomó a cargo se muestra
 * "VENCIDO" en ámbar: es el único caso en el que la app tiene algo que avisar.
 * Si alguien se hizo cargo, es historia y va en gris. Antes todo esto se pintaba
 * de rojo y se confundía con un turno cancelado.
 */
export function resolveEventStatus(event?: EventLike | null): EventStatus | null {
  if (!event?.status) return null;

  const base = EVENT_STATUS.find((es) => es.value === event.status);
  if (!base) return null;
  if (!ABIERTOS.includes(base.value)) return base;

  const date = event.date ? new Date(event.date) : null;
  const yaPaso = !!date && !isNaN(date.getTime()) && date.getTime() < Date.now();
  if (!yaPaso) return base;

  return event.takenChargeByUserId
    ? { ...base, text: 'PASADO', color: 'neutral' }
    : { ...base, text: 'VENCIDO', color: 'warning' };
}

/** El ícono se atenúa para todo lo que ya pasó, sin importar el estado. */
export function isPastEvent(event?: EventLike | null): boolean {
  if (!event?.date) return false;
  const date = new Date(event.date);
  return !isNaN(date.getTime()) && date.getTime() < Date.now();
}
