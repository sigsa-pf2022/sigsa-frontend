import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonDatetime, ModalController, NavController, ToastController } from '@ionic/angular';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { format, parseISO } from 'date-fns';
import { SuccessCreationAcountComponent } from 'src/app/components/success-creation-acount/success-creation-acount.component';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraResultType, ImageOptions } from '@capacitor/camera';
import { GroupsService } from '../shared/services/groups/groups.service';
import { NewGroupDataService } from '../shared/services/new-group-data/new-group-data.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { BLOODTYPES } from 'src/app/constants/Bloodtypes.constant';

@Component({
  selector: 'app-new-group',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Nuevo grupo</ion-title>
        <ion-label class="ui-header__counter" slot="end">1 de 2</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ng">
      <form class="ng__form" [formGroup]="form">
        <!-- <ion-fab-button (click)="getPicture()" color="ligth">
          <ion-icon name="add"></ion-icon>
          <ion-img *ngIf="src !== ''" [src]="src"></ion-img>
        </ion-fab-button> -->
        <ion-label>Datos del Grupo</ion-label>
        <ion-input class="ui-form-input" formControlName="name" placeholder="Nombre del grupo" type="text"></ion-input>
        <br />
        <ion-label>Datos del Dependiente</ion-label>
        <ion-input class="ui-form-input" formControlName="firstName" placeholder="Nombre" type="text"></ion-input>
        <ion-input class="ui-form-input" formControlName="lastName" placeholder="Apellido" type="text"></ion-input>
        <ion-input class="ui-form-input" formControlName="dni" placeholder="Dni" type="number"></ion-input>
        <ion-select
          okText="Confirmar"
          cancelText="Cancelar"
          class="ui-form-input"
          formControlName="bloodType"
          placeholder="Grupo sanguineo"
          interface="alert"
        >
          <ion-select-option *ngFor="let bloodtype of bloodtypes" [value]="bloodtype.value">{{
            bloodtype.text
          }}</ion-select-option>
        </ion-select>
        <ion-input
          class="ui-form-input"
          [disabled]="true"
          placeholder="Fecha de Nacimiento"
          formControlName="birthday"
          id="open-modal"
        >
        </ion-input>
        <ion-modal trigger="open-modal" class="calendar-modal">
          <ng-template>
            <ion-content>
              <ion-datetime
                #bdt
                [value]="date"
                [max]="this.maxDate"
                locale="es-ES"
                presentation="date"
                (ionChange)="dateChanged(bdt.value)"
              >
                <ion-buttons slot="buttons">
                  <ion-button color="primary" (click)="confirmDateSelection()">Confirmar</ion-button>
                </ion-buttons>
              </ion-datetime>
            </ion-content>
          </ng-template>
        </ion-modal>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!isFormValid()" color="primary">
        Siguente
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./new-group.page.scss'],
})
export class NewGroupPage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  showCalendar = false;
  date = format(new Date(), 'yyyy-MM-dd');
  maxDate = format(new Date(), 'yyyy-MM-dd');
  bloodtypes = BLOODTYPES;
  form = this.fb.group({
    name: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dni: ['', Validators.required],
    bloodType: ['', Validators.required],
    birthday: ['', Validators.required],
  });
  constructor(
    private dateFormatterService: DateFormatterService,
    private fb: FormBuilder,
    private modalController: ModalController,
    private navController: NavController,
    private newGroupDataService: NewGroupDataService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {}

  isFormValid() {
    return this.form.valid;
  }
  async onSubmit() {
    this.saveData();
    this.navController.navigateForward(['/groups/add-members']);
  }

  saveData() {
    this.newGroupDataService.update(this.form.value);
  }
  openCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  async successRegister() {
    const modal = await this.modalController.create({
      component: SuccessCreationAcountComponent,
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }

  dateChanged(date: string) {
    this.form
      .get('birthday')
      .setValue(
        format(
          parseISO(format(this.dateFormatterService.createDateFromCalendarStringDate(date), 'yyyy-MM-dd')),
          'dd/MM/yyyy'
        )
      );
  }

  confirmDateSelection() {
    this.datetime.confirm(true);
  }
}
