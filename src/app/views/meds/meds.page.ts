import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { isBefore, parseISO } from 'date-fns';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ActionSheetService } from 'src/app/services/action-sheet/action-sheet.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MedsEventsService } from './shared/services/meds-events/meds-events.service';
import { MedsEventDataService } from './shared/services/meds-events-data/meds-events-data.service';
import { slideUpAnimation } from 'src/app/animations/slide-up.animation';

@Component({
  selector: 'app-meds',
  template: `
    <ion-content class="listing meds">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Tu medicación</p>
        <h1 class="listing-header__title">Recordatorios</h1>
      </header>

      <ng-container *ngIf="this.medsEvents.length > 0; else emptyState">
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

        <cdk-virtual-scroll-viewport itemSize="80" class="listing-scroll">
          <app-meds-event-item-list
            *cdkVirtualFor="let medEvent of this.filteredMedsEvents"
            [medEvent]="medEvent"
            [flush]="true"
            (click)="presentActionSheet(medEvent)"
          ></app-meds-event-item-list>
        </cdk-virtual-scroll-viewport>
      </ng-container>

      <ng-template #emptyState>
        <div class="empty-state" role="status">
          <div class="empty-state__icon" aria-hidden="true">
            <ion-icon name="medkit"></ion-icon>
          </div>
          <h2 class="empty-state__title">Sin recordatorios todavía</h2>
          <p class="empty-state__subtitle">
            Agregá tu primer medicamento y te avisamos cuándo tomarlo.
          </p>
          <button type="button" class="empty-state__cta" (click)="newMedEvent()">
            <ion-icon name="add"></ion-icon>
            Agregar medicamento
          </button>
        </div>
      </ng-template>

      <ion-fab class="app-fab" vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button
          class="app-fab-button"
          (click)="newMedEvent()"
          aria-label="Agregar medicamento"
        >
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./meds.page.scss'],
})
export class MedsPage implements OnInit, OnDestroy {
  medsEvents: any[] = [];
  filteredMedsEvents: any[] = [];
  searchForm = this.fb.group({
    search: '',
  });
  private routerSub: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private router: Router,
    private medsEventsService: MedsEventsService,
    private medsEventDataService: MedsEventDataService,
    private actionSheetService: ActionSheetService,
    private modalController: ModalController,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        if (e.urlAfterRedirects === '/tabs/meds' || e.url === '/tabs/meds') {
          this.setMedsEvents();
        }
      });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  async ionViewWillEnter() {
    this.setMedsEvents();
  }

  async setMedsEvents() {
    this.medsEvents = [...(await this.medsEventsService.getMedsEventsByUser())];
    this.filteredMedsEvents = this.medsEvents;
  }

  async presentActionSheet(medEvent) {
    const headerText = 'Mi Medicamento';
    const actionSheet = isBefore(parseISO(medEvent.date), new Date())
      ? await this.actionSheetService.createOnlyView(headerText)
      : await this.actionSheetService.createDefault(headerText);
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
    this.doActionByRole(role, medEvent.id);
  }

  doActionByRole(value: string, id: number) {
    switch (value) {
      case 'destructive':
        this.cancelMedEvent(id);
        break;
      case 'edit':
        this.editMedEvent(id);
        break;
      case 'view':
        this.viewMedEvent(id);
        break;
      default:
        break;
    }
  }

  async cancelMedEvent(id: number) {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: '¿Desea cancelar el recordatorio de medicamento?',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.medsEventsService
        .cancelMedEvent(id)
        .then(() => this.toastService.showSuccess('Recordatorio cancelado correctamente.'))
        .then(() => this.setMedsEvents())
        .catch(() => this.toastService.showError('No se pudo cancelar el recordatorio.'));
    }
  }

  async handleChange(event) {
    const search = (event.detail.value || '').toLowerCase();
    this.filteredMedsEvents = this.medsEvents.filter((d) => {
      const name = d?.med?.name ?? d?.name ?? '';
      return String(name).toLowerCase().includes(search);
    });
  }

  newMedEvent() {
    return this.navController.navigateForward(['/meds/create/pick-med'], { animation: slideUpAnimation });
  }

  editMedEvent(id) {
    this.medsEventDataService.clean();
    return this.navController.navigateForward([`/meds/edit/${id}/pick-med`]);
  }

  viewMedEvent(id) {
    return this.navController.navigateForward([`/meds/view/${id}`]);
  }
}
