import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, Platform } from '@ionic/angular';

/** Lado máximo de la foto de perfil, en píxeles. */
const AVATAR_SIZE = 256;

@Injectable({ providedIn: 'root' })
export class PhotoPickerService {
  constructor(
    private actionSheetController: ActionSheetController,
    private platform: Platform
  ) {}

  /**
   * Pide una foto (cámara o galería) y la devuelve como data URI ya reescalada.
   * Devuelve null si el usuario cancela.
   *
   * A diferencia de los documentos, que se guardan en tamaño completo, el
   * avatar se recorta a un cuadrado de 256px: viaja en la respuesta del login,
   * vive en localStorage y se muestra en el header de todas las pantallas.
   */
  async pick(): Promise<string | null> {
    const source = await this.askSource();
    if (!source) return null;

    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source,
        width: 1024,
      });
      if (!image?.base64String) return null;

      const dataUri = `data:image/${image.format};base64,${image.base64String}`;
      return await this.toSquareJpeg(dataUri);
    } catch {
      // Capacitor tira cuando el usuario cancela el picker.
      return null;
    }
  }

  private async askSource(): Promise<CameraSource | null> {
    // En el navegador el plugin abre su propio selector de archivo.
    if (!this.platform.is('capacitor')) return CameraSource.Photos;

    const actionSheet = await this.actionSheetController.create({
      header: 'Foto de perfil',
      mode: 'ios',
      buttons: [
        { text: 'Sacar una foto', role: 'camera' },
        { text: 'Elegir de la galería', role: 'gallery' },
        { text: 'Cerrar', role: 'cancel' },
      ],
    });
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();

    if (role === 'camera') return CameraSource.Camera;
    if (role === 'gallery') return CameraSource.Photos;
    return null;
  }

  /**
   * Recorta al cuadrado centrado y reescala a AVATAR_SIZE, en JPEG.
   * Una foto de cámara de 3MB queda en ~20-40KB.
   */
  private toSquareJpeg(dataUri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('No se pudo procesar la imagen'));

        ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('No se pudo leer la imagen'));
      img.src = dataUri;
    });
  }
}
