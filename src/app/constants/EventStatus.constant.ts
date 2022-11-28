export type EventStatus = { value: string; text: string; color: string };
export const EVENT_STATUS: EventStatus[] = [
  { value: 'canceled', text: 'CANCELADO', color: 'danger' },
  { value: 'created', text: 'CREADO', color: 'primary' },
  { value: 'confirmed', text: 'CONFIRMADO', color: 'success' },
];
