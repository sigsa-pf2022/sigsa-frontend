import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MedsEventsService } from '../shared/services/meds-events/meds-events.service';

@Component({
  selector: 'app-view-med-event',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/meds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Medicamento</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="vm">
      <div class="vm__med">
        <div class="vm__med__background">
          <ion-item lines="none" class="vm__med__item no-padding">
            <div class="vm__med__item__wrapper">
              <ion-img [src]="'assets/images/reminders/pill-colored.svg'"></ion-img>
              <div class="vm__med__item__wrapper__content">
                <ion-text class="ui-font-profile-title"> {{ medEvent?.med?.name }} {{ medEvent?.med?.dosage }} </ion-text>
              </div>
            </div>
          </ion-item>
        </div>
      </div>
      <div class="vm__data">
        <div class="vm__data__item">
          <ion-text class="vm__data__item__label">Fecha:</ion-text>
          <ion-text class="vm__data__item__value">{{ medEvent?.date | date : 'dd/MM/YYYY HH:mm' }}</ion-text>
        </div>
        <div class="vm__data__item" *ngIf="medEvent?.description">
          <ion-text class="vm__data__item__label">Descripción:</ion-text>
          <ion-text class="vm__data__item__value">{{ medEvent?.description }}</ion-text>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./view-med-event.component.scss']
})
export class ViewMedEventComponent implements OnInit {
  medEventId: number;
  medEvent: any;
  constructor(
    private route: ActivatedRoute,
    private medsEventsService: MedsEventsService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.medEventId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  async load() {
    try {
      const list = await this.medsEventsService.getMedsEventsByUser();
      this.medEvent = list?.find((m) => m.id === this.medEventId);
      if (!this.medEvent) {
  this.navController.navigateBack(['/meds']);
      }
    } catch (e) {
  this.navController.navigateBack(['/meds']);
    }
  }
}
