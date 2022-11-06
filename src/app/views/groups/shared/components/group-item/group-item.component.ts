import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-group-item',
  template: `
    <ion-item lines="none" class="gi">
      <div class="gi__wrap">
        <!-- <ion-avatar slot="start" class="gi__wrap__avatar">
          <ion-img [src]="this.group.imgUrl"></ion-img>
        </ion-avatar> -->
        <div class="gi__wrap__description">
          <ion-label class="gi__wrap__description__title titulo">{{
            this.group.name
          }}</ion-label>
          <ion-label class="gi__wrap__description__subtitle subtitulo"
            >{{ this.group.members.length + ' miembro/s' }} </ion-label
          >
        </div>
        <ion-icon
          name="chevron-forward-outline"
          class="gi__wrap__icon"
        ></ion-icon>
      </div>
    </ion-item>
  `,
  styleUrls: ['./group-item.component.scss'],
})
export class GroupItemComponent implements OnInit {
  @Input() group;
  constructor() {}

  ngOnInit() {
    console.log(this.group);
  }

}
