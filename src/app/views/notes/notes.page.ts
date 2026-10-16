import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ProfessionalNote } from 'src/app/interfaces/professional-note';
import { titleCase } from 'src/app/utils/title-case';
import { NotesService } from './shared/services/notes.service';

/**
 * Indicaciones que dejaron los profesionales vinculados. Sin `dependentId` son
 * las del propio usuario; con él, las del dependiente del grupo.
 */
@Component({
  selector: 'app-notes',
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
        <h1 class="listing-header__title">Indicaciones</h1>
      </header>

      <app-loading-state *ngIf="isLoading" [rows]="4"></app-loading-state>

      <div class="nts__scroll" *ngIf="!isLoading && notes.length > 0">
        <article class="nts__card" *ngFor="let note of notes">
          <div class="nts__head">
            <div class="list-item__icon list-item__icon--med" aria-hidden="true">
              <ion-icon name="chatbox-ellipses"></ion-icon>
            </div>
            <div class="nts__author">
              <span class="nts__name">{{ professionalLabel(note) }}</span>
              <span class="nts__meta">
                <ng-container *ngIf="note.professional?.licenseNumber">MP {{ note.professional.licenseNumber }} · </ng-container>
                {{ note.createdAt | date: 'dd/MM/yyyy HH:mm' }}
              </span>
            </div>
          </div>
          <p class="nts__content">{{ note.content }}</p>
        </article>
      </div>

      <div *ngIf="!isLoading && notes.length === 0" class="empty-state" role="status">
        <div class="empty-state__icon" aria-hidden="true">
          <ion-icon name="chatbox-ellipses"></ion-icon>
        </div>
        <h2 class="empty-state__title">Sin indicaciones</h2>
        <p class="empty-state__subtitle">
          Cuando un profesional vinculado deje una indicación, la vas a ver acá y te va a llegar una notificación.
        </p>
      </div>
    </ion-content>
  `,
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage {
  notes: ProfessionalNote[] = [];
  isLoading = true;
  dependentId: number | null = null;
  groupId: string | null = null;
  dependentName = '';

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private notesService: NotesService,
    private toastService: ToastService,
  ) {}

  get eyebrow(): string {
    if (!this.dependentId) return 'De mis profesionales';
    return this.dependentName ? `Para ${titleCase(this.dependentName)}` : 'Para el dependiente';
  }

  async ionViewWillEnter() {
    const params = this.route.snapshot.queryParamMap;
    const dep = Number(params.get('dependentId'));
    this.dependentId = dep > 0 ? dep : null;
    this.groupId = params.get('groupId');
    this.dependentName = params.get('dependentName') || '';
    await this.load();
  }

  private async load() {
    this.isLoading = this.notes.length === 0;
    try {
      this.notes = (await this.notesService.getReceivedNotes(this.dependentId)) || [];
    } catch (error) {
      this.notes = [];
      this.toastService.showError(error?.error?.message || 'No se pudieron cargar las indicaciones');
    } finally {
      this.isLoading = false;
    }
  }

  professionalLabel(note: ProfessionalNote): string {
    const p = note.professional;
    return p ? `Dr/a ${titleCase(`${p.firstName} ${p.lastName}`)}` : 'Profesional';
  }

  goBack() {
    // Desde el grupo (o desde la push de un dependiente) se vuelve al grupo.
    const fallback = this.groupId ? `/groups/home/${this.groupId}` : '/profile';
    this.navController.navigateBack([fallback]);
  }
}
