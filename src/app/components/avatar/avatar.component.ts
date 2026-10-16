import { Component, Input } from '@angular/core';
import { titleCase } from 'src/app/utils/title-case';

/**
 * Avatar con foto si hay, y si no las iniciales (o un ícono cuando no hay
 * nombre del cual sacarlas). Reemplaza la lógica de iniciales que estaba
 * repetida en el header, el perfil, el grupo y las listas de miembros.
 */
@Component({
  selector: 'app-avatar',
  template: `
    <img *ngIf="photo; else fallbackTpl" class="avatar__img" [src]="photo" [alt]="alt" />

    <ng-template #fallbackTpl>
      <span *ngIf="initials; else iconTpl" class="avatar__initials">{{ initials }}</span>
      <ng-template #iconTpl>
        <ion-icon class="avatar__icon" [name]="icon"></ion-icon>
      </ng-template>
    </ng-template>
  `,
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  /** Data URI de la foto. Si falta, se cae a iniciales. */
  @Input() photo?: string | null;
  /** Nombre del que se sacan las iniciales. */
  @Input() name?: string | null;
  /** Ícono a usar cuando no hay foto ni nombre. */
  @Input() icon = 'person';

  get initials(): string {
    const clean = (this.name ?? '').trim();
    if (!clean) return '';
    const parts = clean.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  get alt(): string {
    return this.name ? `Foto de ${titleCase(this.name)}` : 'Foto de perfil';
  }
}
