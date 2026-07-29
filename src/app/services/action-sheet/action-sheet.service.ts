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
  /**
   * Para tratamientos periódicos: no se ofrece "Editar" porque cambiarle la
   * fecha a una serie entera no es una edición puntual; se cancela y se crea
   * de nuevo.
   */
  async createForTreatment(header: string, canCancel: boolean) {
    return await this.actionSheetCtrl.create({
      header,
      mode: 'ios',
      buttons: [
        {
          text: 'Ver tratamiento',
          role: 'view',
        },
        ...(canCancel
          ? [
              {
                text: 'Cancelar tratamiento',
                role: 'destructive',
              },
            ]
          : []),
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
