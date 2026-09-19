import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetService {
  constructor(private actionSheetCtrl: ActionSheetController) {}

  /**
   * `destructiveText` existe porque la acción destructiva no significa lo mismo
   * en todos lados: a un turno o a una toma les cambia el estado y la fila
   * sobrevive, pero a un documento lo borra de la base. Decirle "Cancelar" a un
   * borrado definitivo era engañoso.
   */
  async createDefault(header: string, destructiveText = 'Cancelar') {
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
          text: destructiveText,
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
