import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `
    <div
      class="loading-state"
      [class.loading-state--spinner]="this.variant === 'spinner'"
      role="status"
      aria-busy="true"
      aria-label="Cargando"
    >
      <ng-container *ngIf="this.variant === 'spinner'; else listSkeleton">
        <ion-spinner color="primary"></ion-spinner>
      </ng-container>

      <ng-template #listSkeleton>
        <div class="loading-state__row" *ngFor="let row of this.rowsArray">
          <ion-skeleton-text
            *ngIf="this.avatar"
            class="loading-state__avatar"
            [animated]="true"
          ></ion-skeleton-text>
          <div class="loading-state__text">
            <ion-skeleton-text
              class="loading-state__line loading-state__line--title"
              [animated]="true"
            ></ion-skeleton-text>
            <ion-skeleton-text
              class="loading-state__line loading-state__line--sub"
              [animated]="true"
            ></ion-skeleton-text>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./loading-state.component.scss'],
})
export class LoadingStateComponent {
  @Input() variant: 'list' | 'spinner' = 'list';
  @Input() avatar = true;

  rowsArray: number[] = Array.from({ length: 5 }, (_, i) => i);

  @Input() set rows(value: number) {
    const total = Number(value) > 0 ? Number(value) : 5;
    this.rowsArray = Array.from({ length: total }, (_, i) => i);
  }
}
