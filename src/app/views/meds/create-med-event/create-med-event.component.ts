import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonDatetime, NavController } from '@ionic/angular';
import { formatISO } from 'date-fns';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { LocalNotificationsService } from 'src/app/services/local-notifications/local-notifications.service';
import { PlatformService } from 'src/app/services/platform/platform.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MedsEventDataService } from '../shared/services/meds-events-data/meds-events-data.service';
import { MedsEventsService } from '../shared/services/meds-events/meds-events.service';

@Component({
  selector: 'app-create-med-event',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="this.backUrl"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">{{ this.isEditMode ? 'Editar' : 'Crear' }} recordatorio</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ca">
      <div class="ca__doctor">
        <div class="ca__doctor__background">
          <ion-item lines="none" class="ca__doctor__item no-padding">
            <div class="ca__doctor__item__wrapper">
              <ion-img [src]="'assets/images/reminders/pill-colored.svg'"></ion-img>
              <div class="ca__doctor__item__wrapper__content">
                <ion-text class="ui-font-profile-title"> {{ this.med?.name }} {{ this.med?.dosage }}</ion-text>
              </div>
            </div>
          </ion-item>
        </div>
      </div>
      <form [formGroup]="this.form">
        <div class="ca__data">
          <ion-input
            class="ui-form-input"
            placeholder="Fecha de ingesta"
            formControlName="date"
            id="open-modal"
          >
          </ion-input>
          <ion-modal trigger="open-modal" class="calendar-modal-time">
            <ng-template>
              <ion-content>
                <ion-datetime
                  #bdt
                  [value]="this.medEventDate"
                  [min]="this.minDate"
                  locale="es-ES"
                  (ionChange)="dateChanged(bdt.value)"
                  [showDefaultButtons]="true"
                >
                  <span slot="time-label">Tiempo</span>
                  <ion-buttons slot="buttons">
                    <ion-button color="primary" (click)="confirmDateSelection()">Confirmar</ion-button>
                  </ion-buttons>
                </ion-datetime>
              </ion-content>
            </ng-template>
          </ion-modal>
        </div>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!this.form.valid" color="primary">
        Confirmar
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./create-med-event.component.scss'],
})
export class CreateMedEventComponent implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  form = this.fb.group({
    date: null,
  });
  showCalendar = false;
  minDate = formatISO(new Date());
  med: any;
  medEventDate;
  medEventId: number;
  isEditMode = false;
  backUrl: string;
  dependentId: number;
  dependentName: string;
  groupId: string;
  isSubmitting = false;
  constructor(
    private dateFormatterService: DateFormatterService,
    private fb: FormBuilder,
    private medsEventService: MedsEventsService,
    private medsEventDataService: MedsEventDataService,
    private toastService: ToastService,
    private navController: NavController,
    private localNotificationsService: LocalNotificationsService,
    private platformService: PlatformService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    // Capturar parámetros del dependiente si existen
    this.route.queryParams.subscribe(params => {
      const rawDependentId = params['dependentId'];
      this.dependentId = rawDependentId !== undefined && rawDependentId !== null && rawDependentId !== ''
        ? Number(rawDependentId)
        : null;
      this.dependentName = params['dependentName'] || null;
      this.groupId = params['groupId'] || null;
      if (this.dependentId) {
        this.medsEventDataService.update({
          dependentId: this.dependentId,
          dependentName: this.dependentName,
          groupId: this.groupId,
        });
      }
    });
    this.setMode();
  }

  setMode() {
    this.medEventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.medEventId) {
      this.isEditMode = true;
      // this.setAppointmentInfo();
      this.backUrl = `/meds/edit/${this.medEventId}/pick-med`;
    } else {
      this.setMed(this.medsEventDataService.data);
      this.backUrl = `/meds/create/pick-med`;
    }
  }

  setMed(data: any) {
    this.med = data.med;
    this.form.addControl('med', new FormControl(this.med));
  }

  // setAppointmentInfo() {
  // this.form.patchValue({ description: this.appointmentDataService.data.description });
  // this.dateChanged(this.appointmentDataService.data.date);
  // this.setProfessionalAndType(this.appointmentDataService.data);
  // }

  dateChanged(date: string | string[]) {
    const value = Array.isArray(date) ? date[0] : date;
    this.medEventDate = value;
    this.form.get('date').setValue(this.dateFormatterService.getSpanishFormattedDate(value));
    this.form.get('date').markAsDirty();
    this.form.get('date').markAsTouched();
  }

  confirmDateSelection() {
    this.datetime.confirm(true);
  }

  async onSubmit() {
    this.form.get('date').setValue(this.medEventDate);
    return this.isEditMode ? this.editMedEvent() : this.createMedEvent();
  }

  async editMedEvent() {
    // await this.appointmentsService
    //   .editAppointment(this.appointmentId, this.form.value)
    //   .then(() => this.successEdition());
  }

  async createMedEvent() {
    if (this.isSubmitting) return;
    const isoDate = this.medEventDate || this.form.value.date;
    const medId = this.medsEventDataService.data?.medId || this.med?.id;
    if (!medId) {
      this.toastService.showError?.('Medicamento inválido');
      return;
    }
    if (!isoDate) {
      this.toastService.showError?.('Fecha requerida');
      return;
    }
    const dateObj = new Date(isoDate);
    if (isNaN(dateObj.getTime())) {
      this.toastService.showError?.('Fecha inválida');
      return;
    }
    if (dateObj.getTime() < Date.now() - 60000) { // permitir 1 min de tolerancia
      this.toastService.showError?.('La fecha debe ser futura');
      return;
    }
    this.isSubmitting = true;
    const payload = { medId, date: isoDate };
    try {
      const res: any = this.dependentId
        ? await this.medsEventService.createMedEventForDependent(this.dependentId, payload)
        : await this.medsEventService.createMedEvent(payload);
      this.successCreation(res.medEvent || res);
    } catch (err) {
      this.toastService.showError?.('No se pudo crear el recordatorio');
    } finally {
      this.isSubmitting = false;
    }
  }

  successCreation(medEvent) {
    this.createNotification(medEvent);
    this.toastService.showSuccess('Recordatorio de medicamento creado correctamente.');
    this.medsEventDataService.clean();
    if (this.dependentId && this.groupId) {
      return this.navController.navigateRoot([`/groups/home/${this.groupId}`]);
    } else if (this.dependentId) {
      return this.navController.navigateBack(['/groups']);
    }
    return this.navController.navigateForward(['/tabs/meds']);
  }

  successEdition() {
    this.toastService.showSuccess('Recordatorio de medicamento editado correctamente.');
    return this.navController.navigateForward(['/tabs/meds']);
  }

  createNotification(medEvent) {
    this.localNotificationsService.requestPermissions();
    if (!this.platformService.isMobileWeb) {
      this.localNotificationsService.registerActionTypes();
      this.localNotificationsService.addEventListener((notification) => {
        this.dispatch(notification, medEvent.id);
      });
    }
    this.localNotificationsService.scheduleMedEvent(medEvent.date, medEvent.med);
  }

  dispatch(notification, id) {
    if (notification.actionId === 'confirm') {
      this.confirmMedEvent(id);
    } else if (notification.actionId === 'tap') {
      this.viewMedEvent(id);
    }
  }

  viewMedEvent(id) {
    // return this.navController.navigateForward([`/meds/view/${id}`]);
  }

  confirmMedEvent(id) {
    // this.appointmentsService.confirmAppointment(id);
  }
}
