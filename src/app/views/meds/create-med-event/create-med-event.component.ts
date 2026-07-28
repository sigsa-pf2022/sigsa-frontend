import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonDatetime, IonModal, NavController } from '@ionic/angular';
import { formatISO } from 'date-fns';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MedsEventDataService } from '../shared/services/meds-events-data/meds-events-data.service';
import { MedsEventsService } from '../shared/services/meds-events/meds-events.service';

@Component({
  selector: 'app-create-med-event',
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
          {{ this.isEditMode ? 'Editar recordatorio' : 'Nuevo recordatorio' }}
        </p>
        <h1 class="listing-header__title">¿Cuándo lo vas a tomar?</h1>
      </header>

      <div class="wizard-summary" *ngIf="this.med">
        <div class="wizard-summary__icon" aria-hidden="true">
          <ion-img src="assets/images/reminders/pill-colored.svg"></ion-img>
        </div>
        <div class="wizard-summary__body">
          <p class="wizard-summary__eyebrow">Medicamento</p>
          <p class="wizard-summary__title">{{ this.med?.name }} {{ this.med?.dosage }}</p>
        </div>
      </div>

      <form [formGroup]="this.form" class="auth-form cme__form">
        <div class="auth-field">
          <label class="auth-field__label" for="open-modal">Fecha y hora de ingesta</label>
          <button
            type="button"
            class="date-field"
            [class.date-field--empty]="!this.form.value.date"
            (click)="openDateModal($event)"
          >
            <span>{{ this.form.value.date || 'Seleccionar fecha y hora' }}</span>
            <ion-icon name="calendar-outline"></ion-icon>
          </button>
          <p class="auth-field__hint">Te vamos a recordar 5 minutos antes.</p>
        </div>

        <ion-modal #dateModal class="calendar-modal-time">
          <ng-template>
            <ion-content>
              <ion-datetime
                #bdt
                [value]="this.medEventDate"
                [min]="this.minDate"
                locale="es-ES"
                (ionChange)="dateChanged(bdt.value)"
                [showDefaultButtons]="false"
              >
                <span slot="time-label">Hora</span>
                <ion-buttons slot="buttons">
                  <ion-button class="datetime-done" (click)="confirmDateSelection()">Listo</ion-button>
                </ion-buttons>
              </ion-datetime>
            </ion-content>
          </ng-template>
        </ion-modal>
      </form>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="onSubmit()"
        [disabled]="!this.form.valid || this.isSubmitting"
      >
        {{ isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar recordatorio' : 'Crear recordatorio') }}
      </button>
    </ion-footer>
  `,
  styleUrls: ['./create-med-event.component.scss'],
})
export class CreateMedEventComponent implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  @ViewChild('dateModal') dateModal: IonModal;
  form = this.fb.group({
    date: null,
  });
  showCalendar = false;
  // Hora actual SIN offset (YYYY-MM-DDTHH:mm:ss). Con el offset (-03:00),
  // ion-datetime lo convierte a UTC y el mínimo queda corrido +3h, impidiendo
  // elegir la hora actual.
  minDate = formatISO(new Date()).slice(0, 19);
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
    // Fallback por si la navegación perdió los query params
    if (!this.dependentId && this.medsEventDataService.data?.dependentId) {
      this.dependentId = this.medsEventDataService.data.dependentId;
      this.dependentName = this.medsEventDataService.data.dependentName;
      this.groupId = this.medsEventDataService.data.groupId;
    }
    this.setMode();
  }

  setMode() {
    this.medEventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.medEventId) {
      this.isEditMode = true;
      this.backUrl = `/meds/edit/${this.medEventId}/pick-med`;
      this.loadMedEvent();
    } else {
      this.setMed(this.medsEventDataService.data);
      this.backUrl = `/meds/create/pick-med`;
    }
  }

  setMed(data: any) {
    this.med = data.med;
    this.form.addControl('med', new FormControl(this.med));
  }

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

  async openDateModal(event: Event) {
    (event?.target as HTMLElement)?.blur();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    await this.dateModal?.present();
  }

  goBack() {
    // El paso 1 sólo lee el contexto del grupo de los query params, así que hay
    // que devolvérselo o pierde el dependiente y su botón de volver al grupo.
    const queryParams = this.dependentId
      ? { dependentId: this.dependentId, dependentName: this.dependentName, groupId: this.groupId }
      : {};
    this.navController.navigateBack([this.backUrl], { queryParams });
  }

  async onSubmit() {
    this.form.get('date').setValue(this.medEventDate);
    return this.isEditMode ? this.editMedEvent() : this.createMedEvent();
  }

  async editMedEvent() {
    if (this.isSubmitting) return;
    const isoDate = this.medEventDate || this.form.value.date;
    if (!isoDate) {
      this.toastService.showError?.('Fecha requerida');
      return;
    }
    const dateObj = new Date(isoDate);
    if (isNaN(dateObj.getTime())) {
      this.toastService.showError?.('Fecha inválida');
      return;
    }
    if (dateObj.getTime() < Date.now() - 60000) {
      this.toastService.showError?.('La fecha debe ser futura');
      return;
    }
    this.isSubmitting = true;
    try {
      const payload: any = { date: isoDate };
      const medId = this.medsEventDataService.data?.medId || this.med?.id;
      if (medId) {
        payload.medId = medId;
      }
      await this.medsEventService.editMedEvent(this.medEventId, payload);
      this.successEdition();
    } catch (err) {
      this.toastService.showError?.('No se pudo editar el recordatorio');
    } finally {
      this.isSubmitting = false;
    }
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
    if (dateObj.getTime() < Date.now() - 60000) {
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
    this.toastService.showSuccess('Recordatorio de medicamento creado correctamente.');
    const depId = this.dependentId || this.medsEventDataService.data?.dependentId;
    const grpId = this.groupId || this.medsEventDataService.data?.groupId;
    this.medsEventDataService.clean();
    if (depId && grpId) {
      return this.navController.navigateRoot(`/groups/home/${grpId}`);
    } else if (depId) {
      return this.navController.navigateBack('/groups');
    }
    return this.navController.navigateRoot('/tabs/meds');
  }

  successEdition() {
    this.toastService.showSuccess('Recordatorio de medicamento editado correctamente.');
    const depId = this.dependentId || this.medsEventDataService.data?.dependentId;
    const grpId = this.groupId || this.medsEventDataService.data?.groupId;
    this.medsEventDataService.clean();
    if (depId && grpId) {
      return this.navController.navigateRoot(`/groups/home/${grpId}`);
    } else if (depId) {
      return this.navController.navigateBack('/groups');
    }
    return this.navController.navigateRoot('/tabs/meds');
  }

  dispatch(notification, id) {
    if (notification.actionId === 'confirm') {
      this.confirmMedEvent(id);
    } else if (notification.actionId === 'tap') {
      this.viewMedEvent(id);
    }
  }

  viewMedEvent(id) {
    return this.navController.navigateForward(`/meds/view/${id}`);
  }

  private async loadMedEvent() {
    try {
      const medEvent = await this.medsEventService.getMedEvent(this.medEventId);
      if (!medEvent) {
        this.toastService.showError?.('Recordatorio no encontrado');
        return;
      }
      // Si el usuario cambió el med en pick-med, respetar esa elección.
      // Si el data service está vacío (primera entrada al wizard de edición), usar el de la API.
      const savedMed = this.medsEventDataService.data?.med;
      this.med = savedMed ?? medEvent.med;
      if (!this.form.get('med')) {
        this.form.addControl('med', new FormControl(this.med));
      } else {
        this.form.get('med').setValue(this.med);
      }
      if (!savedMed) {
        this.medsEventDataService.update({ med: this.med, medId: this.med?.id });
      }
      this.medEventDate = medEvent.date;
      this.form.get('date').setValue(this.dateFormatterService.getSpanishFormattedDate(medEvent.date));
    } catch (err) {
      this.toastService.showError?.('No se pudo cargar el recordatorio');
    }
  }

  confirmMedEvent(id) {
    // this.appointmentsService.confirmAppointment(id);
  }
}
