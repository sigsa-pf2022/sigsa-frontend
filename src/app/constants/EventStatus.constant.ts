export enum EventStatusEnum {
  CANCELADO = 'canceled',
  CREADO = 'created',
  CONFIRMADO = 'confirmed',
}
export type EventStatus = { value: EventStatusEnum; text: string; color: string };
export const EVENT_STATUS: EventStatus[] = [
  { value: EventStatusEnum.CANCELADO, text: 'CANCELADO', color: 'danger' },
  { value: EventStatusEnum.CREADO, text: 'CREADO', color: 'primary' },
  { value: EventStatusEnum.CONFIRMADO, text: 'CONFIRMADO', color: 'success' },
];
