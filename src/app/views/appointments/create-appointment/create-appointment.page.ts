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
  template: `
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button
            type="button"
            class="auth-back"
            (click)="goBack()"
            aria-label="Volver"
          >
            <ion-icon name="chevron-back"></ion-icon>
          </button>
          <div class="auth-stepper" aria-label="Paso 2 de 2">
            <div class="auth-stepper__bar auth-stepper__bar--done"></div>
            <div class="auth-stepper__bar auth-stepper__bar--current"></div>
            <span class="auth-stepper__count">2/2</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">
          {{ this.isEditMode ? 'Editar turno' : 'Nuevo turno' }}
          <ng-container *ngIf="dependentName"> · para {{ dependentName | titlecase }}</ng-container>
        </p>
        <h1 class="listing-header__title">Fecha del turno</h1>
      </header>

      <div class="wizard-summary" *ngIf="this.doctor">
        <div class="wizard-summary__icon" aria-hidden="true">
          <ion-img src="assets/images/reminders/doctor-colored.svg"></ion-img>
        </div>
        <div class="wizard-summary__body">
          <p class="wizard-summary__eyebrow">Profesional</p>
          <p class="wizard-summary__title">Dr/a. {{ this.doctor?.firstName }} {{ this.doctor?.lastName }}</p>
        </div>
      </div>

      <form [formGroup]="this.form" class="auth-form ca__form">
        <div class="auth-field">
          <label class="auth-field__label" for="open-modal">Fecha y hora del turno</label>
          <button
            type="button"
            class="date-field"
            [class.date-field--empty]="!this.form.value.date"
            id="open-modal"
          >
            <span>{{ this.form.value.date || 'Seleccionar fecha y hora' }}</span>
            <ion-icon name="calendar-outline"></ion-icon>
          </button>
        </div>

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

        <div class="auth-field">
          <label class="auth-field__label" for="ca-description">Comentarios</label>
          <div class="auth-input ca__textarea">
            <ion-textarea
              id="ca-description"
              rows="5"
              placeholder="Notas sobre el turno (opcional)"
              formControlName="description"
              autoGrow="true"
            ></ion-textarea>
          </div>
        </div>
      </form>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="onSubmit()"
        [disabled]="!this.form.valid"
      >
        {{ isEditMode ? 'Actualizar' : 'Confirmar' }}
      </button>
    </ion-footer>
  `,
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

  goBack() {
    this.navController.navigateBack([this.backUrl]);
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

    try {
      const res: any = await this.appointmentsService.createAppointment(appointmentData);
      this.successCreation(res.appointment);
    } catch (err) {
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
