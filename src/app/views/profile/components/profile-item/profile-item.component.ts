import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-item',
  template: `
    <ion-item class="">
      <div class="row">
        <div class="icon-column">
          <ion-icon
            class="profile-icon"
            slot="start"
            name="{{ icon }}"
          ></ion-icon>
        </div>
        <div class="column">
          <h5>{{ title }}</h5>
          <p>{{ content1 }}</p>
          <p>{{ content2 }}</p>
          <ion-toggle *ngIf="icon === 'settings-outline'"></ion-toggle>
        </div>
      </div>
    </ion-item>
  `,
  styleUrls: ['./profile-item.component.scss'],
})
export class ProfileItemComponent implements OnInit {
  @Input() title: string;
  @Input() icon: string;
  @Input() content1: string;
  @Input() content2: string;

  constructor() {}

  ngOnInit() {}
}
