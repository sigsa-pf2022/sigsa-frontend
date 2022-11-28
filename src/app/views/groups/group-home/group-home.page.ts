import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimationController, NavController } from '@ionic/angular';
import { REMINDERS_TYPE } from '../../home/shared/constants/remindersType';
import { FAKE_APPOINTMENTS_REMINDERS_DATA } from '../../home/shared/fakes/fakeAppointmentsReminderData';
import { FAKE_DOCUMENTS_REMINDERS_DATA } from '../../home/shared/fakes/fakeDocumentsReminderData';
import { FAKE_MEDICATIONS_REMINDERS_DATA } from '../../home/shared/fakes/fakeMedicationsReminderData';
import { FamilyGroup } from '../shared/interfaces/FamilyGroup';
import { GroupsService } from '../shared/services/groups/groups.service';

@Component({
  selector: 'app-group-home',
  template: `
    <app-menu contentId="group-home"></app-menu>
    <div class="ui-main-menu-content" id="group-home">
      <ion-header class="ui-background__light">
        <ion-toolbar class="ui-toolbar__primary">
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title *ngIf="this.group" class="ui-header__title-center">{{ this.group.name }}</ion-title>
          <ion-buttons slot="end">
            <ion-icon (click)="exitGroup()" name="log-out-outline"></ion-icon>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="gh" *ngIf="this.group">
        <div>
          <ion-item lines="none" class="gh__item ion-no-padding">
            <div class="gh__item__wrapper">
              <div class="gh__item__wrapper__img">
                <ion-img [src]="this.group.imgUrl"></ion-img>
              </div>
              <div class="gh__item__wrapper__data">
                <ion-text class="item__wrapper__data__title"
                  >{{ this.group.dependent.lastName }}, {{ this.group.dependent.firstName }}</ion-text
                >
                <ion-text class="gh__item__wrapper__data__info"
                  ><b>Fecha de nacimiento:</b> {{ this.group.dependent.birthday | date: 'dd/MM/YYYY' }}</ion-text
                >
                <ion-text class="gh__item__wrapper__data__info"><b>DNI:</b> {{ this.group.dependent.dni }}</ion-text>
                <ion-text class="gh__item__wrapper__data__info"
                  ><b>Grupo sanguíneo:</b> {{ this.group.dependent.bloodType }}</ion-text
                >
              </div>
            </div>
          </ion-item>
          <app-next-events [events]="this.events"></app-next-events>
          <app-reminders height="37vh" [reminders]="this.reminders" (changeReminders)="changeReminders($event)"></app-reminders>
          <ion-fab class="gh__fab" vertical="bottom" horizontal="center" slot="fixed">
            <ion-fab-button (click)="openFabList($event)">
              <ion-icon name="add"></ion-icon>
            </ion-fab-button>
            <ion-fab-list side="top" class="gh__fab__list" #fabList>
              <div class="gh__fab__list__button">
                <img [src]="'/assets/images/reminders/pill.svg'" />
                <ion-text color="light">Medicamento</ion-text>
              </div>
              <div class="gh__fab__list__button">
                <img [src]="'/assets/images/reminders/doctor.svg'" />
                <ion-text color="light">Turno</ion-text>
              </div>
              <div class="gh__fab__list__button">
                <img [src]="'/assets/images/reminders/document.svg'" />
                <ion-text color="light">Documento</ion-text>
              </div>
            </ion-fab-list>
          </ion-fab>
        </div>
      </ion-content>
    </div>
  `,
  styleUrls: ['./group-home.page.scss'],
})
export class GroupHomePage implements OnInit {
  @ViewChild('fabList', { read: ElementRef }) fabListRef: ElementRef;
  events = [];
  opened = false;
  group: FamilyGroup;
  reminders: any;
  constructor(
    private animationCtrl: AnimationController,
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.groupsService
      .getFamilyGroupById(this.route.snapshot.paramMap.get('id'))
      .then(async (res: FamilyGroup) => (this.group = res));
    // await this.groupsService
    //   .getFamilyGroupById(this.route.snapshot.paramMap.get('id'))
    //   .then(async (res: FamilyGroup) => {
    //     if (res) {
    //       res.imgUrl = URL.createObjectURL(
    //         await this.groupsService.getGroupImage(res.imgUrl)
    //       );
    //     }
    //     this.group = res;
    //   });
  }

  openFabList(ev: Event) {
    if (this.opened) {
      ev.stopPropagation();
      this.closeAnimation();
    } else {
      this.openAnimation();
    }
    this.opened = !this.opened;
  }
  closeAnimation() {
    this.animationCtrl
      .create()
      .addElement(this.fabListRef.nativeElement)
      .duration(250)
      .fromTo('opacity', '1', '0')
      .play()
      .then(() => {
        this.fabListRef.nativeElement.click();
      });
  }
  openAnimation() {
    this.animationCtrl
      .create()
      .addElement(this.fabListRef.nativeElement)
      .duration(250)
      .fromTo('opacity', '0', '1')
      .play();
  }

  changeReminders(value) {
    // switch (value) {
    //   case REMINDERS_TYPE.appointments:
    //     this.reminders = FAKE_APPOINTMENTS_REMINDERS_DATA;
    //     break;
    //   case REMINDERS_TYPE.medications:
    //     this.reminders = FAKE_MEDICATIONS_REMINDERS_DATA;
    //     break;
    //   case REMINDERS_TYPE.documents:
    //     this.reminders = FAKE_DOCUMENTS_REMINDERS_DATA;
    //     break;
    // }
  }

  exitGroup() {
    this.navController.navigateBack(['/tabs/groups']);
  }
}
