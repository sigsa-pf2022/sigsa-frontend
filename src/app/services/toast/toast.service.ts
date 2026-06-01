import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async showError(message: string, duration: number = 5000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
      cssClass: 'toast-danger',
    });
    await toast.present();
  }
  async showSuccess(message: string, duration: number = 5000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
      cssClass: 'toast-success',
    });
    await toast.present();
  }
}
