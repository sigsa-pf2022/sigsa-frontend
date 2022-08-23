import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateFormatterService {
  constructor() {}

  createDateFromCalendarStringDate(dateNotFormatted: string) {
    console.log(dateNotFormatted);
    const date = dateNotFormatted.split('-');
    return new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]));
  }
}
