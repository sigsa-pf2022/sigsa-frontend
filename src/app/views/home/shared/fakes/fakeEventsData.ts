import { NextEvent } from '../interfaces/next-event';

export const FAKE_EVENTS_DATA: NextEvent[] = [
  {
    date: new Date(),
    day: 'Lunes',
    title: 'Ibuprofeno',
    subtitle: '400mg',
    type: {
      title: 'medication',
    },
  },
  {
    date: new Date(),
    day: 'Lunes',
    title: 'Dra. Quintero',
    subtitle: 'Clinica Cruz Azul',
    type: {
      title: 'appointment',
    },
  },
];
