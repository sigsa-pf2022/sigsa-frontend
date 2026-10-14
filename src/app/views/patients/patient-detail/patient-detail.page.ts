import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ProfessionalNote } from 'src/app/interfaces/professional-note';
import { titleCase } from 'src/app/utils/title-case';
import { PatientsService } from '../shared/services/patients.service';
import {
  Adherence,
  PatientSummary,
  PatientTreatment,
} from '../shared/interfaces/PatientSummary.interface';

type Tab = 'summary' | 'notes' | 'documents';

const NOTE_MAX_LENGTH = 1000;

@Component({
  selector: 'app-patient-detail',
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
        <p class="listing-header__eyebrow">{{ eyebrow }}</p>
        <h1 class="listing-header__title">{{ patientName | titlecase }}</h1>
      </header>

      <div class="pdt__tabs">
        <ion-segment class="pdt__segment" [value]="tab" (ionChange)="changeTab($event)" mode="md">
          <ion-segment-button value="summary"><ion-label>Resumen</ion-label></ion-segment-button>
          <ion-segment-button value="notes"><ion-label>Indicaciones</ion-label></ion-segment-button>
          <ion-segment-button value="documents"><ion-label>Documentos</ion-label></ion-segment-button>
        </ion-segment>
      </div>

      <app-loading-state *ngIf="isLoading" [rows]="4"></app-loading-state>

      <!-- Resumen -->
      <div class="pdt__scroll" *ngIf="!isLoading && summary && tab === 'summary'">
        <section class="pdt__card">
          <div class="pdt__card-head">
            <span class="pdt__card-title">Adherencia (últimos 30 días)</span>
            <span class="status-badge" [ngClass]="badgeClass(summary.overallAdherence)">
              {{ pctLabel(summary.overallAdherence) }}
            </span>
          </div>
          <div class="pdt__bar" *ngIf="summary.overallAdherence.pct !== null">
            <div
              class="pdt__bar-fill"
              [ngClass]="barClass(summary.overallAdherence)"
              [style.width.%]="summary.overallAdherence.pct"
            ></div>
          </div>
          <span class="pdt__muted">{{ countsLabel(summary.overallAdherence) }}</span>
        </section>

        <div class="section-title"><h2>Próximo turno</h2></div>
        <section class="pdt__card" *ngIf="summary.nextAppointment; else noAppointment">
          <div class="pdt__card-head">
            <span class="pdt__card-title">
              {{ summary.nextAppointment.date | date: 'dd/MM/yyyy HH:mm' }} hs
            </span>
            <span class="status-badge status-badge--violet" *ngIf="summary.nextAppointment.withMe">Con vos</span>
          </div>
          <span class="pdt__muted">
            {{ summary.nextAppointment.description || 'Turno' }}
            <ng-container *ngIf="!summary.nextAppointment.withMe && summary.nextAppointment.professional">
              · con {{ professionalName(summary.nextAppointment.professional) }}
            </ng-container>
          </span>
        </section>
        <ng-template #noAppointment>
          <p class="pdt__empty-line">No tiene turnos agendados.</p>
        </ng-template>

        <div class="section-title">
          <h2>Tratamientos</h2>
          <span>{{ treatments.length }}</span>
        </div>
        <section class="pdt__card" *ngFor="let t of treatments">
          <div class="pdt__card-head">
            <span class="pdt__card-title">{{ t.med?.name || 'Medicamento' }}</span>
            <span class="status-badge" [ngClass]="badgeClass(t.adherence)">{{ pctLabel(t.adherence) }}</span>
          </div>
          <span class="pdt__muted">
            Cada {{ t.intervalHours }} h · {{ t.totalDoses }} tomas ·
            {{ t.inProgress ? 'En curso' : 'Finalizado el ' + (t.endsAt | date: 'dd/MM') }}
          </span>
          <div class="pdt__bar" *ngIf="t.adherence.pct !== null">
            <div class="pdt__bar-fill" [ngClass]="barClass(t.adherence)" [style.width.%]="t.adherence.pct"></div>
          </div>
          <span class="pdt__muted">{{ countsLabel(t.adherence) }}</span>
        </section>
        <section class="pdt__card" *ngIf="singleDoses.count > 0">
          <div class="pdt__card-head">
            <span class="pdt__card-title">Tomas sueltas</span>
            <span class="status-badge" [ngClass]="badgeClass(singleDoses.adherence)">
              {{ pctLabel(singleDoses.adherence) }}
            </span>
          </div>
          <span class="pdt__muted">{{ singleDoses.names }}</span>
          <div class="pdt__bar" *ngIf="singleDoses.adherence.pct !== null">
            <div
              class="pdt__bar-fill"
              [ngClass]="barClass(singleDoses.adherence)"
              [style.width.%]="singleDoses.adherence.pct"
            ></div>
          </div>
          <span class="pdt__muted">{{ countsLabel(singleDoses.adherence) }}</span>
        </section>
        <p class="pdt__empty-line" *ngIf="!treatments.length && !singleDoses.count">
          Sin medicación registrada en los últimos 30 días.
        </p>

        <div class="section-title">
          <h2>Últimas indicaciones</h2>
          <span class="pdt__link" role="button" (click)="tab = 'notes'">Ver todas</span>
        </div>
        <section class="pdt__card" *ngFor="let note of summary.lastNotes">
          <p class="pdt__note">{{ note.content }}</p>
          <span class="pdt__muted">{{ note.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
        </section>
        <p class="pdt__empty-line" *ngIf="!summary.lastNotes.length">Todavía no le dejaste indicaciones.</p>
      </div>

      <!-- Indicaciones -->
      <div class="pdt__scroll" *ngIf="!isLoading && tab === 'notes'">
        <div class="auth-field">
          <label class="auth-field__label" for="pdt-note">Nueva indicación</label>
          <div class="auth-input pdt__textarea">
            <ion-textarea
              id="pdt-note"
              rows="4"
              autoGrow="true"
              [maxlength]="noteMaxLength"
              placeholder="Ej.: Controlar la presión dos veces por día"
              [(ngModel)]="newNote"
            ></ion-textarea>
          </div>
          <span class="auth-field__hint">
            {{ patientType === 'dependent' ? 'Le llega una notificación a todo el grupo familiar.' : 'Le llega una notificación al paciente.' }}
            ({{ newNote.length }}/{{ noteMaxLength }})
          </span>
        </div>
        <button
          type="button"
          class="auth-btn auth-btn--primary"
          [disabled]="!newNote.trim() || isSaving"
          (click)="sendNote()"
        >
          {{ isSaving ? 'Enviando...' : 'Enviar indicación' }}
        </button>

        <div class="section-title pdt__section-flush">
          <h2>Indicaciones enviadas</h2>
          <span>{{ notes.length }}</span>
        </div>
        <section class="pdt__card" *ngFor="let note of notes">
          <p class="pdt__note">{{ note.content }}</p>
          <span class="pdt__muted">{{ note.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
        </section>
        <div *ngIf="!notes.length" class="empty-state" role="status">
          <div class="empty-state__icon" aria-hidden="true">
            <ion-icon name="chatbox-ellipses"></ion-icon>
          </div>
          <h2 class="empty-state__title">Sin indicaciones</h2>
          <p class="empty-state__subtitle">Lo que escribas acá le llega al paciente como notificación.</p>
        </div>
      </div>

      <div *ngIf="!isLoading && !summary && tab === 'summary'" class="empty-state" role="status">
        <div class="empty-state__icon" aria-hidden="true">
          <ion-icon name="alert-circle"></ion-icon>
        </div>
        <h2 class="empty-state__title">No se pudo cargar la ficha</h2>
        <p class="empty-state__subtitle">Revisá que el paciente siga vinculado.</p>
      </div>
    </ion-content>
  `,
  styleUrls: ['./patient-detail.page.scss'],
})
export class PatientDetailPage {
  patientId: number;
  patientType: 'user' | 'dependent' = 'user';
  tab: Tab = 'summary';
  summary: PatientSummary | null = null;
  treatments: PatientTreatment[] = [];
  singleDoses = { count: 0, names: '', adherence: null as Adherence | null };
  notes: ProfessionalNote[] = [];
  newNote = '';
  noteMaxLength = NOTE_MAX_LENGTH;
  isLoading = true;
  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private patientsService: PatientsService,
    private toastService: ToastService,
  ) {}

  get patientName(): string {
    const p = this.summary?.patient;
    return p ? `${p.firstName} ${p.lastName}` : 'Paciente';
  }

  get eyebrow(): string {
    const p = this.summary?.patient;
    if (!p) return 'Paciente';
    const parts = [p.type === 'dependent' ? 'Dependiente' : 'Paciente'];
    const age = this.ageOf(p.birthday);
    if (age !== null) parts.push(`${age} años`);
    if (p.bloodType) parts.push(`Grupo ${p.bloodType}`);
    return parts.join(' · ');
  }

  async ionViewWillEnter() {
    this.patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    this.patientType =
      this.route.snapshot.queryParamMap.get('patientType') === 'dependent' ? 'dependent' : 'user';
    await this.load();
  }

  goBack() {
    this.navController.navigateBack(['/patients']);
  }

  changeTab(event) {
    const value = event.detail.value as Tab;
    if (value === 'documents') {
      // Documentos ya tiene su pantalla: se navega en vez de duplicarla acá, y
      // el segmento vuelve a la pestaña en la que estaba.
      event.target.value = this.tab;
      this.navController.navigateForward([`/patients/${this.patientId}/documents`], {
        queryParams: { patientType: this.patientType, name: this.patientName },
      });
      return;
    }
    this.tab = value;
  }

  private async load() {
    this.isLoading = !this.summary;
    try {
      const [summary, notes] = await Promise.all([
        this.patientsService.getPatientSummary(this.patientId, this.patientType),
        this.patientsService.getPatientNotes(this.patientId, this.patientType),
      ]);
      this.summary = summary;
      this.notes = notes || [];
      this.splitTreatments(summary.activeTreatments || []);
    } catch (error) {
      this.summary = null;
      this.toastService.showError(error?.error?.message || 'Error al cargar la ficha del paciente');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Las tomas únicas llegan como "tratamientos" de una sola toma. Mostradas una
   * por una tapaban a los tratamientos de verdad, así que se agrupan en una
   * sola tarjeta con su adherencia sumada.
   */
  private splitTreatments(all: PatientTreatment[]) {
    this.treatments = all.filter((t) => t.totalDoses > 1);
    const singles = all.filter((t) => t.totalDoses <= 1);
    const sum = singles.reduce(
      (acc, t) => ({
        taken: acc.taken + t.adherence.taken,
        omitted: acc.omitted + t.adherence.omitted,
        pending: acc.pending + t.adherence.pending,
      }),
      { taken: 0, omitted: 0, pending: 0 },
    );
    const measured = sum.taken + sum.omitted;
    const names = Array.from(new Set(singles.map((t) => t.med?.name).filter(Boolean)));
    this.singleDoses = {
      count: singles.length,
      names: names.join(', '),
      adherence: { ...sum, pct: measured ? Math.round((sum.taken / measured) * 100) : null },
    };
  }

  async sendNote() {
    const content = this.newNote.trim();
    if (!content || this.isSaving) return;
    this.isSaving = true;
    try {
      const res = await this.patientsService.createPatientNote(this.patientId, this.patientType, content);
      this.notes = [res.note, ...this.notes];
      if (this.summary) {
        this.summary.lastNotes = [res.note, ...this.summary.lastNotes].slice(0, 3);
      }
      this.newNote = '';
      this.toastService.showSuccess('Indicación enviada');
    } catch (error) {
      const message = error?.error?.message;
      this.toastService.showError(
        Array.isArray(message) ? message[0] : message || 'No se pudo enviar la indicación',
      );
    } finally {
      this.isSaving = false;
    }
  }

  pctLabel(a: Adherence | null): string {
    return a?.pct === null || a?.pct === undefined ? 'Sin datos' : `${a.pct}%`;
  }

  badgeClass(a: Adherence | null): string {
    if (a?.pct === null || a?.pct === undefined) return '';
    if (a.pct >= 80) return 'status-badge--success';
    if (a.pct >= 50) return 'status-badge--warning';
    return 'status-badge--danger';
  }

  barClass(a: Adherence | null): string {
    if (a?.pct === null || a?.pct === undefined) return '';
    if (a.pct >= 80) return 'pdt__bar-fill--success';
    if (a.pct >= 50) return 'pdt__bar-fill--warning';
    return 'pdt__bar-fill--danger';
  }

  countsLabel(a: Adherence | null): string {
    if (!a) return '';
    const parts = [`${a.taken} ${a.taken === 1 ? 'tomada' : 'tomadas'}`, `${a.omitted} ${a.omitted === 1 ? 'omitida' : 'omitidas'}`];
    if (a.pending) parts.push(`${a.pending} ${a.pending === 1 ? 'pendiente' : 'pendientes'}`);
    return parts.join(' · ');
  }

  professionalName(p: { firstName: string; lastName: string }): string {
    return titleCase(`${p.firstName} ${p.lastName}`);
  }

  private ageOf(birthday?: string): number | null {
    if (!birthday) return null;
    const b = new Date(birthday);
    if (isNaN(b.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
    return age;
  }
}
