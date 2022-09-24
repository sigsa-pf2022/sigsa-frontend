import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonDatetime, ModalController, ToastController } from '@ionic/angular';
import { DateFormatterService } from 'src/app/services/shared/date-formatter.service';
import { RegisterFormDataService } from '../register/services/register-form-data.service';
import { format, parseISO } from 'date-fns';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { SuccessCreationAcountComponent } from 'src/app/components/success-creation-acount/success-creation-acount.component';
import { TranslateService } from '@ngx-translate/core';
import {Camera, CameraResultType, ImageOptions } from '@capacitor/camera';


@Component({
  selector: 'app-new-group',
  template: `
  <ion-content class="pd">
    
    <form class="pd__form" [formGroup]="registerForm">
    <ion-title>Datos del Grupo</ion-title>
    <ion-fab-button color="ligth">
          <ion-icon (click)="tomarFoto()" name="add"></ion-icon>
          <img *ngIf="src != ''" [src]="src" />
    </ion-fab-button>
          <ion-input
            class="ui-form-input"
            formControlName="nameGroup"
            placeholder="Nombre del grupo"
            type="text"
            (ionChange)="change()"
          ></ion-input>
          <br>
          <ion-title>Datos del Dependiente</ion-title>
          <ion-input
            class="ui-form-input"
            formControlName="firstName"
            placeholder="Nombre"
            type="text"
            (ionChange)="change()"
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
        [disabled]="!this.registerForm.valid"
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
  registerForm: FormGroup;
  showCalendar = false;
  date = format(new Date(), 'yyyy-MM-dd');
  src:string="";

  constructor(
    private dateFormatterService: DateFormatterService,
    private registerFormDataService: RegisterFormDataService,
    private auth: AuthenticationService,
    private modalController: ModalController,
    private toast: ToastController,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.registerForm = this.registerFormDataService.form;
  }

  async onSubmit() {
     //this.auth.register(this.registerForm.value).subscribe(res =>{
     //  console.log(res);
     //});
    
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
      color:'danger',
    });
    await toast.present();
  }

  dateChanged(date: string) {
    this.registerForm
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
  change() {
    console.log(this.registerForm.get('firstName').errors);
  }

  tomarFoto()
  {
    let options:ImageOptions={
      quality:100,
      resultType:CameraResultType.DataUrl,
      saveToGallery:true,
    }
    Camera.getPhoto(options).then((result)=>{
      if(result.dataUrl){
        this.src = result.dataUrl;
      }
    },(err)=>{
      alert(JSON.stringify(err));
    })
  };




}
