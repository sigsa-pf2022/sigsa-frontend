import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetService {
  constructor(private actionSheetCtrl: ActionSheetController) {}

  async createDefault(header: string) {
    return await this.actionSheetCtrl.create({
      header,
      mode: 'ios',
      buttons: [
        {
          text: 'Ver',
          role: 'view',
        },
        {
          text: 'Editar',
          role: 'edit',
        },
        {
          text: 'Cancelar',
          role: 'destructive',
        },
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
  }
  async createOnlyView(header: string) {
    return await this.actionSheetCtrl.create({
      header,
      mode: 'ios',
      buttons: [
        {
          text: 'Ver',
          role: 'view',
        },
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
  }
}
