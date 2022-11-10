import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observer, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private _className: string;
  constructor(public platform: Platform) {
    this._className = this.platform.is('desktop') ? 'desktop' : 'mobile';
  }

  public get className(): string {
    return this._className;
  }

  public isDesktop(): boolean {
    return this._className === 'desktop';
  }
}
