import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observer, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private _className: string;
  private _isMobileWeb: boolean;
  constructor(public platform: Platform) {
    this._className = this.platform.is('desktop') ? 'desktop' : 'mobile';
    this._isMobileWeb = this.platform.is('mobileweb');
  }

  public get className(): string {
    return this._className;
  }

  public get isMobileWeb(): boolean {
    return this._isMobileWeb;
  }

  public isDesktop(): boolean {
    return this._className === 'desktop';
  }
}
