import { NextEventType } from './next-event-type';

export interface NextEvent {
  date: Date;
  day: string;
  title: string;
  subtitle: string;
  type: NextEventType;
}
