import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonDatetime, NavController } from '@ionic/angular';
import { formatISO } from 'date-fns';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Professional } from '../../doctors/shared/interfaces/Professional.interface';
import { AppointmentDataService } from '../shared/services/appointment-data/appointment-data.service';
import { AppointmentsService } from '../shared/services/appointments/appointments.service';

@Component({
  selector: 'app-create-appointment',
  template: `<ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="this.backUrl"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">
          {{ this.isEditMode ? 'Editar' : 'Crear' }} turno
          <span *ngIf="dependentName" style="font-size: 0.8em; display: block;"
            >para {{ dependentName | titlecase }}</span
          >
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ca">
      <div class="ca__doctor">
        <div class="ca__doctor__background">
          <ion-item lines="none" class="ca__doctor__item no-padding">
            <div class="ca__doctor__item__wrapper">
              <ion-img [src]="'assets/images/reminders/doctor-colored.svg'"></ion-img>
              <div class="ca__doctor__item__wrapper__content">
                <ion-text class="ui-font-profile-title"> Dr/a. {{ this.doctor?.lastName }}</ion-text>
              </div>
            </div>
          </ion-item>
        </div>
      </div>
      <form [formGroup]="this.form">
        <div class="ca__data">
          <!-- <ion-text class="ui-font-profile-label" -->
          <!-- >Dirección de atención: {{ this.doctor?.streetName }} {{ this.doctor?.streetNumber }}</ion-text -->
          <!-- > -->
          <ion-input class="ui-form-input" placeholder="Fecha de Atencion" formControlName="date" id="open-modal">
          </ion-input>
          <ion-modal trigger="open-modal" class="calendar-modal-time">
            <ng-template>
              <ion-content>
                <ion-datetime
                  #bdt
                  [value]="this.appointmentDate"
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
          <ion-textarea
            rows="8"
            class="ui-form-input"
            placeholder="Comentarios"
            formControlName="description"
          ></ion-textarea>
        </div>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!this.form.valid" color="primary">
        Confirmar
      </ion-button>
    </ion-footer>`,
  styleUrls: ['./create-appointment.page.scss'],
})
export class CreateAppointmentPage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  form = this.fb.group({
    date: [null, Validators.required],
    description: '',
  });
  showCalendar = false;
  minDate = formatISO(new Date());
  doctor: Professional;
  appointmentDate;
  appointmentId: number;
  isEditMode = false;
  backUrl: string;
  dependentId: number;
  dependentName: string;
  groupId: string;

  constructor(
    private dateFormatterService: DateFormatterService,
    private fb: FormBuilder,
    private appointmentDataService: AppointmentDataService,
    private appointmentsService: AppointmentsService,
    private toastService: ToastService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    // Capturar parámetros del dependiente si existen
    this.route.queryParams.subscribe((params) => {
      // Cast seguro (evita 'undefined' string y asegura number)
      const rawDependentId = params['dependentId'];
      this.dependentId =
        rawDependentId !== undefined && rawDependentId !== null && rawDependentId !== ''
          ? Number(rawDependentId)
          : null;
      this.dependentName = params['dependentName'] || null;
      this.groupId = params['groupId'] || null;

      // Fallback: si no llegaron por query params, intentar tomar del servicio temporal
      if (!this.dependentId && this.appointmentDataService.data?.dependentId) {
        this.dependentId = this.appointmentDataService.data.dependentId;
        this.dependentName = this.appointmentDataService.data.dependentName;
        this.groupId = this.appointmentDataService.data.groupId;
      }
    });

    this.setMode();
  }

  setMode() {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.appointmentId) {
      this.isEditMode = true;
      this.setAppointmentInfo();
      this.backUrl = `/appointments/edit/${this.appointmentId}/pick-doctor`;
    } else {
      this.setProfessionalAndType(this.appointmentDataService.data);
      this.backUrl = `/appointments/create/pick-doctor`;
    }
  }

  setProfessionalAndType(data: any) {
    this.doctor = data.professional;

    // Remover controles previos si existen
    if (this.form.get('myProfessional')) {
      this.form.removeControl('myProfessional');
    }
    if (this.form.get('professional')) {
      this.form.removeControl('professional');
    }

    // Agregar el control correcto
    this.form.addControl(data.isMyProfessional ? 'myProfessional' : 'professional', new FormControl(this.doctor));
  }

  setAppointmentInfo() {
    this.form.patchValue({ description: this.appointmentDataService.data.description });
    this.dateChanged(this.appointmentDataService.data.date);
    this.setProfessionalAndType(this.appointmentDataService.data);
  }

  dateChanged(date: string | string[]) {
    const dateValue = Array.isArray(date) ? date[0] : date;
    this.appointmentDate = dateValue;
    this.form.get('date').setValue(this.dateFormatterService.getSpanishFormattedDate(dateValue));
  }

  confirmDateSelection() {
    this.datetime.confirm(true);
  }

  async onSubmit() {
    // Asegurar que tenemos una fecha seleccionada antes de enviar
    if (!this.appointmentDate) {
      this.toastService.showError?.('Seleccioná una fecha');
      return;
    }
    this.form.get('date').setValue(this.appointmentDate);
    return this.isEditMode ? this.editAppointment() : this.createAppointment();
  }

  async editAppointment() {
    await this.appointmentsService
      .editAppointment(this.appointmentId, this.form.value)
      .then(() => this.successEdition());
  }

  async createAppointment() {
    // Construir payload limpio evitando formatos locales y objetos innecesarios
    const isMyProfessional = !!this.form.get('myProfessional');
    const professionalControl = isMyProfessional ? this.form.get('myProfessional') : this.form.get('professional');
    const professionalValue: any = professionalControl?.value;

    const appointmentData: any = {
      date: this.appointmentDate, // ISO string recibido del ion-datetime
      description: this.form.get('description').value || '',
    };

    if (isMyProfessional) {
      appointmentData.myProfessional = { id: professionalValue?.id };
    } else {
      appointmentData.professional = { id: professionalValue?.id };
    }

    if (!professionalValue?.id) {
      this.toastService.showError?.('Seleccioná un profesional');
      return;
    }

    // Si estamos creando un turno para un dependiente, agregar los datos correspondientes
    if (this.dependentId) {
      appointmentData.createdById = this.dependentId; // backend espera id numérico
      appointmentData.createdByType = 'dependent';
      // Guardar nuevamente en el servicio para continuidad entre pasos / redirecciones
      this.appointmentDataService.update({
        dependentId: this.dependentId,
        dependentName: this.dependentName,
        groupId: this.groupId,
      });
    }

    // Debug log temporal (remover en producción)
    // eslint-disable-next-line no-console
    console.log('[CreateAppointment] Payload enviado', appointmentData);
    try {
      const res: any = await this.appointmentsService.createAppointment(appointmentData);
      this.successCreation(res.appointment);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[CreateAppointment] Error creación', err);
      this.toastService.showError?.('No se pudo crear el turno');
    }
  }

  successCreation(appointment) {
    this.toastService.showSuccess('Turno creado correctamente.');
    // Limpiar datos temporales para evitar contaminación en futuras creaciones
    this.appointmentDataService.clear();

    // Si venimos de un grupo específico, regresar a ese grupo
    if (this.dependentId && this.groupId) {
    return this.navController.navigateRoot([`/groups/home/${this.groupId}`]);
    } else if (this.dependentId) {
        // Si solo tenemos dependentId pero no groupId, ir al listado de grupos
        return this.navController.navigateBack(['/groups']);
    } else {
      // Usuario normal, ir a appointments
      return this.navController.navigateForward(['/tabs/appointments']);
    }
  }

  successEdition() {
    this.toastService.showSuccess('Turno editado correctamente.');
    this.appointmentDataService.clear();
    return this.navController.navigateForward(['/tabs/appointments']);
  }

  dispatch(notification, id) {
    if (notification.actionId === 'confirm') {
      this.confirmAppointment(id);
    } else if (notification.actionId === 'tap') {
      this.viewAppointment(id);
    }
  }

  viewAppointment(id) {
    return this.navController.navigateForward([`/appointments/view/${id}`]);
  }

  confirmAppointment(id) {
    this.appointmentsService.confirmAppointment(id);
  }
}
