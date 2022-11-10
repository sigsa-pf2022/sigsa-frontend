import { Injectable } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
@Injectable({
  providedIn: 'root',
})
export class DateFormatterService {
  constructor() {}

  createDateFromCalendarStringDate(dateNotFormatted: string) {
    const date = dateNotFormatted.split('-');
    return new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]));
  }

  getSpanishFormattedDate(date) {
    const dateNF: Date = parseISO(date);
    const fDay = format(dateNF, "eeee dd 'de' MMMM - p", { locale: es });
    const items = fDay.split(' ');
    items[0] = this.capitalize(items[0]);
    items[3] = this.capitalize(items[3]);
    return items.join(' ');
  }

  capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
