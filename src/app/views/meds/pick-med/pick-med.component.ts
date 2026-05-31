import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MedsEventDataService } from '../shared/services/meds-events-data/meds-events-data.service';
import { MedsEventsService } from '../shared/services/meds-events/meds-events.service';

@Component({
  selector: 'app-pick-med',
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
          <div class="auth-stepper" aria-label="Paso 1 de 2">
            <div class="auth-stepper__bar auth-stepper__bar--current"></div>
            <div class="auth-stepper__bar"></div>
            <span class="auth-stepper__count">1/2</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">
          {{ this.isEditMode ? 'Editar recordatorio' : 'Nuevo recordatorio' }}
        </p>
        <h1 class="listing-header__title">Elegí el medicamento</h1>
      </header>

      <form [formGroup]="this.searchForm" class="listing-search">
        <ion-searchbar
          class="listing-searchbar"
          formControlName="search"
          placeholder="Buscar medicamento..."
          debounce="400"
          type="string"
          mode="md"
          (ionChange)="handleChange($event)"
        ></ion-searchbar>
      </form>

      <div class="pick-med__scroll">
        <ng-container *ngIf="this.filteredMeds?.length > 0; else emptyState">
          <app-items-list
            *ngFor="let med of this.filteredMeds"
            (click)="setMed(med)"
            [showIcon]="false"
            [isSelectable]="true"
            [value]="med.id"
            [selectedValue]="this.med?.id"
            [title]="med.name"
            [subtitle]="med.dosage"
            img="pill"
          ></app-items-list>
        </ng-container>

        <ng-template #emptyState>
          <div class="empty-state" role="status">
            <div class="empty-state__icon" aria-hidden="true">
              <ion-icon name="search-outline"></ion-icon>
            </div>
            <h2 class="empty-state__title">Sin resultados</h2>
            <p class="empty-state__subtitle">
              Probá con otro nombre o revisá la ortografía.
            </p>
          </div>
        </ng-template>
      </div>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="nextStep()"
        [disabled]="!this.med"
      >
        Siguiente
        <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
      </button>
    </ion-footer>
  `,
  styleUrls: ['./pick-med.component.scss'],
})
export class PickMedComponent implements OnInit, OnDestroy {
  searchForm = this.fb.group({
    search: '',
  });
  med: any = null;
  meds: any[];
  filteredMeds: any[];
  isEditMode = false;
  medEventId: number;
  dependentId: number;
  dependentName: string;
  groupId: string;
  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private medsEventsService: MedsEventsService,
    private medEventDataService: MedsEventDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      const rawDependentId = params['dependentId'];
      this.dependentId = rawDependentId !== undefined && rawDependentId !== null && rawDependentId !== ''
        ? Number(rawDependentId)
        : null;
      this.dependentName = params['dependentName'] || null;
      this.groupId = params['groupId'] || null;
      if (this.dependentId) {
        this.medEventDataService.update({
          dependentId: this.dependentId,
          dependentName: this.dependentName,
          groupId: this.groupId,
        });
      }
    });
    this.getMeds();
    this.setMode();
  }

  setMode() {
    this.medEventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.medEventId) {
      this.isEditMode = true;
      const savedMed = this.medEventDataService.data?.med;
      if (savedMed) {
        // Usuario volvió atrás desde el paso 2 con un med ya elegido
        this.med = savedMed;
      } else {
        // Primera entrada al wizard de edición: cargar el med actual desde la API
        this.loadCurrentMed();
      }
    } else {
      // Modo creación: restaurar selección si el usuario volvió atrás
      if (this.medEventDataService.data?.med) {
        this.med = this.medEventDataService.data.med;
      }
    }
  }

  private async loadCurrentMed() {
    try {
      const medEvent = await this.medsEventsService.getMedEvent(this.medEventId);
      if (medEvent?.med) {
        this.med = medEvent.med;
        this.medEventDataService.update({ med: this.med, medId: this.med.id });
      }
    } catch {}
  }

  setMed(value) {
    this.med = value;
  }

  async handleChange(event) {
    const search = (event.detail.value || '').toLowerCase();
    this.filteredMeds = this.meds.filter((d) =>
      String(d?.name ?? '').toLowerCase().includes(search)
    );
  }

  async getMeds() {
    this.meds = await this.medsEventsService.getMeds();
    this.filteredMeds = this.meds;
  }

  goBack() {
    this.navController.navigateBack(['/tabs/meds']);
  }

  nextStep() {
    this.medEventDataService.update({
      medId: this.med?.id,
      med: this.med,
      dependentId: this.dependentId,
      dependentName: this.dependentName,
      groupId: this.groupId,
    });
    const url = this.isEditMode ? `/meds/edit/${this.medEventId}/med` : '/meds/create/med';
    const navigationExtras = this.dependentId ? {
      queryParams: {
        dependentId: this.dependentId,
        dependentName: this.dependentName,
        groupId: this.groupId,
      }
    } : undefined;
    return this.navController.navigateForward(url, navigationExtras);
  }

  goToMyProfessionals() {
    this.searchForm.reset();
    const url = this.isEditMode ? `/meds/edit/${this.medEventId}/my-meds` : '/meds/create/my-meds';
    return this.navController.navigateForward(url);
  }

  ngOnDestroy(){
    this.med = null;
  }
}
