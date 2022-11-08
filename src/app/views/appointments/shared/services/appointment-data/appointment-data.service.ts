import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppointmentDataService {
  private _data: any;
  constructor() {}

  public get data(): any {
    return this._data;
  }

  update(values) {
    this._data = { ...this._data, ...values };
  }
}
