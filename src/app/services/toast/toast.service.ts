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
      color: 'danger',
    });
    await toast.present();
  }
  async showSuccess(message: string, duration: number = 5000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'success',
    });
    await toast.present();
  }
}
