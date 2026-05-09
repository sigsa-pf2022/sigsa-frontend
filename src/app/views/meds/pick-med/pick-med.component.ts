import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MedsEventDataService } from '../shared/services/meds-events-data/meds-events-data.service';
import { MedsEventsService } from '../shared/services/meds-events/meds-events.service';

@Component({
  selector: 'app-pick-med',
  template: ` 
  <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/meds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">{{ this.isEditMode ? 'Editar' : 'Crear' }} recordatorio</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="apm">
      <form [formGroup]="this.searchForm">
        <ion-searchbar
          formControlName="search"
          placeholder="Buscar medicamentos ..."
          class="ui-search-input  ui-search-input__no-show"
          debounce="400"
          type="string"
          (ionChange)="handleChange($event)"
        ></ion-searchbar>
      </form>
      <ion-list *ngIf="this.filteredMeds?.length > 0">
        <ion-radio-group [value]="this.med?.id">
          <app-items-list
            class="apm__list"
            *ngFor="let med of this.filteredMeds"
            (click)="setMed(med)"
            [showIcon]="false"
            [isSelectable]="true"
            [value]="med.id"
            [title]="med.name + ' ' + med.dosage"
            img="pill"
            height="60%"
          ></app-items-list>
        </ion-radio-group>
      </ion-list>
      <!-- <div class="apm__empty-list" *ngIf="this.meds?.length === 0">
        <ion-text>No se encontraron medicamentos con los filtros solicitados.</ion-text>
        <ion-button (click)="goToMyProfessionals()" color="secondary" fill="outline">Usá el tuyo</ion-button>
      </div> -->
    </ion-content>
    <ion-footer class="footer__light">
      <div class="apm__actions">
        <ion-button [disabled]="!this.med" (click)="nextStep()">Siguiente</ion-button>
      </div>
    </ion-footer>`,
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
    const search = event.detail.value;
    this.filteredMeds = this.meds.filter((d) => d.name.includes(search));
  }

  async getMeds() {
    this.meds = await this.medsEventsService.getMeds();
    this.filteredMeds = this.meds;
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
