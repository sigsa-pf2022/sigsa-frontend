import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MedsEventDataService {
  private _data: any;
  constructor() {}

  public get data(): any {
    return this._data;
  }

  update(values) {
    this._data = { ...this._data, ...values };
  }

  clean(){
    this._data = {};
  }
}
