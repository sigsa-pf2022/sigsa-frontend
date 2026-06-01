import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-item',
  template: `
    <ion-item class="list-item" lines="none" [button]="true" detail="false">
      <div class="list-item__icon list-item__icon--med" aria-hidden="true">
        <ion-icon name="people"></ion-icon>
      </div>
      <div class="list-item__body">
        <span class="list-item__title">{{ this.group?.name | titlecase }}</span>
        <span class="list-item__subtitle">
          {{ this.group?.members?.length || 0 }} {{ (this.group?.members?.length === 1) ? 'miembro' : 'miembros' }}
        </span>
      </div>
      <ion-icon name="chevron-forward" class="list-item__chevron" aria-hidden="true"></ion-icon>
    </ion-item>
  `,
  styleUrls: ['./group-item.component.scss'],
})
export class GroupItemComponent implements OnInit {
  @Input() group;
  constructor() {}

  ngOnInit() {}
}
