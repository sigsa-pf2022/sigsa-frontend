/**
 * Grupos sanguíneos.
 *
 * Ojo con los dos últimos: van con la **letra O**, no con un cero. El enum de
 * la base (`dependent_blood_type_enum`) acepta 'O+' y 'O-', y Postgres rechaza
 * '0+' y '0-'. Cuando estaban escritos con cero, elegir "0 positivo" hacía
 * fallar el alta del grupo entera sin ningún mensaje visible.
 */
export const BLOODTYPES = [
  { value: 'A+', text: 'A positivo (A+)' },
  { value: 'A-', text: 'A negativo (A-)' },
  { value: 'B+', text: 'B positivo (B+)' },
  { value: 'B-', text: 'B negativo (B-)' },
  { value: 'AB+', text: 'AB positivo (AB+)' },
  { value: 'AB-', text: 'AB negativo (AB-)' },
  { value: 'O+', text: 'O positivo (O+)' },
  { value: 'O-', text: 'O negativo (O-)' },
];
