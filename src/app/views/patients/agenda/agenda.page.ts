import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { format, isSameDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { ToastService } from 'src/app/services/toast/toast.service';
import { titleCase } from 'src/app/utils/title-case';
import { PatientsService } from '../shared/services/patients.service';
import { AgendaAppointment } from '../shared/interfaces/PatientSummary.interface';

interface AgendaDay {
  key: string;
  label: string;
  appointments: AgendaAppointment[];
}

/**
 * Turnos que los pacientes vinculados le sacaron al profesional, de hoy a 30
 * días. El backend ya filtra los cancelados y los de pacientes sin vínculo.
 */
@Component({
  selector: 'app-agenda',
  template: `
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button type="button" class="auth-back" (click)="goBack()" aria-label="Volver">
            <ion-icon name="chevron-back"></ion-icon>
          </button>
          <div></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Próximos 30 días</p>
        <h1 class="listing-header__title">Mi agenda</h1>
      </header>

      <app-loading-state *ngIf="isLoading" [rows]="5"></app-loading-state>

      <div class="ag__scroll" *ngIf="!isLoading && days.length > 0">
        <section *ngFor="let day of days" class="ag__day">
          <div class="section-title">
            <h2>{{ day.label }}</h2>
            <span>{{ day.appointments.length }}</span>
          </div>
          <ion-item
            *ngFor="let a of day.appointments"
            class="list-item"
            lines="none"
            [button]="true"
            detail="false"
            (click)="openPatient(a)"
          >
            <div class="list-item__icon list-item__icon--appointment" aria-hidden="true">
              <ion-icon name="calendar"></ion-icon>
            </div>
            <div class="list-item__body">
              <div class="list-item__row">
                <span class="list-item__title">{{ a.date | date: 'HH:mm' }} · {{ patientName(a) }}</span>
                <span class="status-badge status-badge--info" *ngIf="a.isDependent">Dependiente</span>
              </div>
              <span class="list-item__subtitle">{{ a.description || 'Consulta' }}</span>
            </div>
          </ion-item>
        </section>
      </div>

      <div *ngIf="!isLoading && days.length === 0" class="empty-state" role="status">
        <div class="empty-state__icon" aria-hidden="true">
          <ion-icon name="calendar"></ion-icon>
        </div>
        <h2 class="empty-state__title">Agenda libre</h2>
        <p class="empty-state__subtitle">
          Cuando un paciente vinculado saque un turno con vos, lo vas a ver acá.
        </p>
      </div>
    </ion-content>
  `,
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage {
  days: AgendaDay[] = [];
  isLoading = true;

  constructor(
    private navController: NavController,
    private patientsService: PatientsService,
    private toastService: ToastService,
  ) {}

  async ionViewWillEnter() {
    this.isLoading = this.days.length === 0;
    try {
      const appointments = (await this.patientsService.getAgenda()) || [];
      this.days = this.groupByDay(appointments);
    } catch (error) {
      this.days = [];
      this.toastService.showError(error?.error?.message || 'No se pudo cargar la agenda');
    } finally {
      this.isLoading = false;
    }
  }

  private groupByDay(appointments: AgendaAppointment[]): AgendaDay[] {
    const days = new Map<string, AgendaDay>();
    for (const a of appointments) {
      const date = new Date(a.date);
      const key = format(date, 'yyyy-MM-dd');
      if (!days.has(key)) {
        days.set(key, { key, label: this.dayLabel(date), appointments: [] });
      }
      days.get(key).appointments.push(a);
    }
    return Array.from(days.values());
  }

  /** "Hoy", "Mañana" o "Jueves 16 de octubre". */
  private dayLabel(date: Date): string {
    const today = new Date();
    if (isSameDay(date, today)) return 'Hoy';
    if (isSameDay(date, addDays(today, 1))) return 'Mañana';
    const text = format(date, "EEEE d 'de' MMMM", { locale: es });
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  patientName(a: AgendaAppointment): string {
    return titleCase(a.patientName) || 'Paciente';
  }

  openPatient(a: AgendaAppointment) {
    this.navController.navigateForward([`/patients/${a.patientId}`], {
      queryParams: { patientType: a.patientType },
    });
  }

  goBack() {
    this.navController.navigateBack(['/patients']);
  }
}
