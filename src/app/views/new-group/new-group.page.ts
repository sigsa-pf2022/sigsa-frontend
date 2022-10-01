import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonDatetime, ModalController, NavController, ToastController } from '@ionic/angular';
import { DateFormatterService } from 'src/app/services/shared/date-formatter.service';
import { format, parseISO } from 'date-fns';
import { SuccessCreationAcountComponent } from 'src/app/components/success-creation-acount/success-creation-acount.component';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraResultType, ImageOptions } from '@capacitor/camera';
import { GroupsService } from '../groups/services/groups.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-new-group',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Nuevo grupo</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="pd">
      <form class="pd__form" [formGroup]="form">
        <ion-fab-button (click)="getPicture()" color="ligth">
          <ion-icon name="add"></ion-icon>
          <ion-img *ngIf="src !== ''" [src]="src"></ion-img>
        </ion-fab-button>
        <ion-input
          class="ui-form-input"
          formControlName="name"
          placeholder="Nombre del grupo"
          type="text"
        ></ion-input>
        <br />
        <ion-label>Datos del Dependiente</ion-label>
        <ion-input
          class="ui-form-input"
          formControlName="firstName"
          placeholder="Nombre"
          type="text"
        ></ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="lastName"
          placeholder="Apellido"
          type="text"
        ></ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="dni"
          placeholder="Dni"
          type="number"
        ></ion-input>
        <ion-select
          class="ui-form-input"
          formControlName="bloodType"
          placeholder="Grupo sanguineo"
          interface="alert"
        >
          <ion-select-option value="A+">A positivo (A +)</ion-select-option>
          <ion-select-option value="A-">A negativo (A-)</ion-select-option>
          <ion-select-option value="B+">B positivo (B +)</ion-select-option>
          <ion-select-option value="B-">B negativo (B-)</ion-select-option>
          <ion-select-option value="AB+">AB positivo (AB+)</ion-select-option>
          <ion-select-option value="AB-">AB negativo (AB-)</ion-select-option>
          <ion-select-option value="0+">O positivo (O+)</ion-select-option>
          <ion-select-option value="0-">O negativo (O-)</ion-select-option>
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
                  <ion-button color="primary" (click)="confirmDateSelection()"
                    >Confirmar</ion-button
                  >
                </ion-buttons>
              </ion-datetime>
            </ion-content>
          </ng-template>
        </ion-modal>
        <ion-button
          (click)="onSubmit()"
          [disabled]="!isFormValid()"
          color="primary"
        >
          Confirmar grupo
        </ion-button>
      </form>
    </ion-content>
  `,
  styleUrls: ['./new-group.page.scss'],
})
export class NewGroupPage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  camera = Camera;
  showCalendar = false;
  date = format(new Date(), 'yyyy-MM-dd');
  src = '';
  maxDate = format(new Date(), 'yyyy-MM-dd');
  file;
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
    private toast: ToastController,
    private translate: TranslateService,
    private groupsService: GroupsService,
    private authService: AuthenticationService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  isFormValid(){
    return this.form.valid && this.file;
  }
  async onSubmit() {
    await this.groupsService
      .createGroup(this.form.value, this.authService.user().uid, this.file)
      .then((res) => this.navController.navigateRoot(['/tabs/groups']));
  }
  ionViewWillEnter() {
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

  async showError(code: string) {
    const toast = await this.toast.create({
      message: this.translate.instant(`register.errors.${code}`),
      duration: 5000,
      color: 'danger',
    });
    await toast.present();
  }

  dateChanged(date: string) {
    this.form
      .get('birthday')
      .setValue(
        format(
          parseISO(
            format(
              this.dateFormatterService.createDateFromCalendarStringDate(date),
              'yyyy-MM-dd'
            )
          ),
          'dd/MM/yyyy'
        )
      );
  }

  confirmDateSelection() {
    this.datetime.confirm(true);
  }

  async getPicture() {
    const image = await this.camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });
    this.src = image.webPath;
    this.file = await fetch(image.webPath).then((res) => res.blob());
  }
}
