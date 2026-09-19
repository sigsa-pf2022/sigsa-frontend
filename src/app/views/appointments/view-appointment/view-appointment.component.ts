import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { YesNoModalComponent } from 'src/app/components/yes-no-modal/yes-no-modal.component';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Professional } from '../../doctors/shared/interfaces/Professional.interface';
import { AppointmentsService } from '../shared/services/appointments/appointments.service';
import { GroupEventsService } from 'src/app/views/groups/shared/services/group-events/group-events.service';
import { actorName } from 'src/app/utils/event-actor';
import { titleCase } from 'src/app/utils/title-case';
import {
  isActionable,
  resolveEventStatus,
  STATUS_BADGE_CLASS,
} from 'src/app/constants/EventStatus.constant';

@Component({
  selector: 'app-view-appointment',
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
          <div></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Consulta</p>
        <h1 class="listing-header__title">Turno</h1>
      </header>

      <app-loading-state *ngIf="loading" variant="spinner"></app-loading-state>

      <ng-container *ngIf="!loading && appointment">
        <article class="va__summary">
          <div class="va__summary-icon" aria-hidden="true">
            <ion-icon name="calendar"></ion-icon>
          </div>
          <div class="va__summary-body">
            <p class="va__summary-name">
              Dr/a. {{ appointment?.professional?.firstName | titlecase }} {{ appointment?.professional?.lastName | titlecase }}
            </p>
            <p class="va__summary-meta" *ngIf="appointment?.professional?.specialization?.[0]?.name">
              {{ appointment.professional.specialization[0].name }}
            </p>
          </div>
          <span
            *ngIf="appointment?.status"
            class="status-badge"
            [ngClass]="statusBadgeClass"
          >
            {{ statusLabel }}
          </span>
        </article>

        <section class="va__section">
          <div class="section-title va__section-title">
            <h2>Detalles</h2>
          </div>
          <div class="va__card">
            <div class="va__row">
              <span class="va__row-label">Fecha y hora</span>
              <span class="va__row-value">{{ appointment?.date | date: 'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="va__row" *ngIf="appointment?.description">
              <span class="va__row-label">Comentarios</span>
              <span class="va__row-value">{{ appointment?.description }}</span>
            </div>
          </div>
        </section>

        <!-- Un turno cancelado dejó de ocultarse de los listados: hay que
             decir quién lo dio de baja, igual que se dice quién se hizo cargo. -->
        <section class="va__section" *ngIf="this.groupId && canceledLabel">
          <div class="va__takecharge va__takecharge--canceled">
            <ion-icon name="close-circle" aria-hidden="true"></ion-icon>
            <span>
              {{ canceledLabel }} canceló el turno
              <small *ngIf="appointment?.canceledAt">
                · {{ appointment.canceledAt | date: 'dd/MM HH:mm' }}
              </small>
            </span>
          </div>
        </section>

        <!-- Sólo el aviso de que alguien ya se ocupa. El botón "Me hago cargo"
             vive en el footer junto a las demás acciones. -->
        <section
          class="va__section"
          *ngIf="this.groupId && !canceledLabel && appointment?.takenChargeByUserId"
        >
          <div class="va__takecharge">
            <ion-icon name="checkmark-circle" aria-hidden="true"></ion-icon>
            <span>
              {{ takenChargeLabel }} se hizo cargo
              <small *ngIf="appointment?.takenChargeAt">
                · {{ appointment.takenChargeAt | date: 'dd/MM HH:mm' }}
              </small>
            </span>
          </div>
        </section>

        <!--
          Borrar es para lo que se cargó por error, y por eso la etiqueta nombra
          la situación y no la operación: un botón que dijera "Borrar" obligaría
          a compararlo con "Cancelar", y son cosas distintas. Va acá abajo, con
          mucho menos peso que las acciones del footer.

          OJO: la condición NO es canAct. Esa función da false justo para los
          vencidos y los cancelados, que son los que más ganas hay de borrar.
        -->
        <div class="va__danger-zone" *ngIf="canDelete">
          <button
            type="button"
            class="auth-btn auth-btn--ghost-danger"
            (click)="deleteEvent()"
            [disabled]="deleting"
          >
            <ion-spinner *ngIf="deleting" name="crescent"></ion-spinner>
            <ng-container *ngIf="!deleting">Lo cargué por error · Borrar</ng-container>
          </button>
        </div>
      </ng-container>
    </ion-content>

    <ion-footer class="auth-footer" mode="md" *ngIf="appointment">
      <!--
        "Confirmar turno" sólo fuera de un grupo. Adentro la acción es
        "Me hago cargo", que además confirma: tener los dos botones juntos
        confundía, porque parecían alternativas y en realidad escribían
        cosas distintas (uno el status, el otro quién se ocupa).
      -->
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        *ngIf="canAct && !isConfirmed && !groupId"
        (click)="confirmAppointment()"
      >
        <ion-icon name="checkmark" aria-hidden="true"></ion-icon>
        Confirmar turno
      </button>
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        *ngIf="canAct && groupId && !appointment?.takenChargeByUserId"
        (click)="takeCharge()"
        [disabled]="responding"
      >
        <ion-spinner *ngIf="responding" name="crescent"></ion-spinner>
        <ng-container *ngIf="!responding">Me hago cargo</ng-container>
      </button>
      <button
        type="button"
        class="auth-btn va__btn-danger"
        *ngIf="canAct"
        (click)="cancelAppointment()"
      >
        Cancelar turno
      </button>
    </ion-footer>
  `,
  styleUrls: ['./view-appointment.component.scss'],
})
export class ViewAppointmentComponent implements OnInit {
  appointmentId: number;
  appointment: any;
  groupId: string | null = null;
  isConfirmed: boolean = false;
  responding = false;
  deleting = false;
  loading = true;
  constructor(
    private appointmentsService: AppointmentsService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private navController: NavController,
    private groupEventsService: GroupEventsService,
    private toastService: ToastService
  ) {}

  /**
   * Si el turno todavía admite acciones. Gobierna los tres botones del footer:
   * sobre un turno vencido o cancelado no se confirma, no se cancela y no hay
   * de qué hacerse cargo.
   *
   * El criterio es el mismo que usan las listas y el desplegable; vive en
   * `EventStatus.constant` para que no vuelva a haber una copia por pantalla.
   */
  get canAct(): boolean {
    return isActionable(this.appointment);
  }

  /**
   * Si se puede borrar. Deliberadamente distinto de `canAct`: un turno vencido o
   * cancelado no admite acciones pero sí se puede sacar de la lista. Lo único
   * que lo impide es que alguien se haya comprometido, porque el grupo coordinó
   * sobre eso y hacerlo desaparecer para todos sería peor que dejarlo cancelado.
   */
  get canDelete(): boolean {
    return !!this.appointment && !this.appointment.takenChargeByUserId;
  }

  /** Nombre de quien canceló, vacío si no lo canceló nadie. */
  get canceledLabel(): string {
    return actorName(this.appointment?.canceledBy);
  }

  get takenChargeLabel(): string {
    // Al cargar viene la relación `takenChargeBy`; al responder en el momento,
    // el nombre lo devuelve el propio endpoint.
    const by = this.appointment?.takenChargeBy;
    const fromRelation = by ? `${by.firstName ?? ''} ${by.lastName ?? ''}`.trim() : '';
    return titleCase(fromRelation || this.appointment?.takenChargeByName) || 'Alguien del grupo';
  }

  /** Un integrante avisa que él lleva al dependiente a este turno. */
  async takeCharge() {
    if (this.responding || !this.appointment) return;
    this.responding = true;
    try {
      const res = await this.groupEventsService.respondToEvent(
        'appointment',
        this.appointment.id,
        'take_charge'
      );
      // El backend deja el turno confirmado al tomarlo, así que la pastilla y
      // el footer tienen que reflejarlo sin esperar a recargar la vista.
      this.appointment = {
        ...this.appointment,
        takenChargeByUserId: res.takenChargeByUserId,
        takenChargeByName: res.takenChargeByName,
        takenChargeAt: res.takenChargeAt,
        status: 'confirmed',
      };
      this.isConfirmed = true;
      this.appointmentsService.notifyAppointmentsChanged();
      this.toastService.showSuccess('Avisamos al grupo que te hacés cargo.');
    } catch ({ error }) {
      // 409: otro integrante ganó la carrera. El mensaje dice quién fue.
      this.toastService.showError(error?.message || 'No pudimos registrar la acción');
    } finally {
      this.responding = false;
    }
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.groupId = this.route.snapshot.queryParamMap.get('groupId');
    this.getAppointment();
  }

  goBack() {
    // Si venimos del home de un grupo, volvemos ahí y no a la pestaña personal.
    const fallback = this.groupId ? `/groups/home/${this.groupId}` : '/tabs/appointments';
    this.navController.navigateBack([fallback]);
  }

  /**
   * Después de confirmar o cancelar volvemos al origen: si el turno es de un
   * dependiente, al home del grupo y no a la pestaña de turnos personales.
   *
   * Quien llama tiene que emitir antes `notifyAppointmentsChanged()`. Volver al
   * grupo usa `navigateRoot`, que reconstruye la vista y dispara su
   * `ionViewWillEnter`; volver a la pestaña personal no, porque el listado vive
   * en el outlet anidado de tabs y su vista activa nunca cambió. Sin el aviso,
   * el turno seguía figurando con el estado viejo hasta salir y entrar de otra
   * pestaña.
   */
  private leaveAfterAction() {
    if (this.groupId) {
      return this.navController.navigateRoot([`/groups/home/${this.groupId}`]);
    }
    return this.navController.navigateForward('/tabs/appointments');
  }

  /** Mismo criterio que las listas: se resuelve en un solo lugar. */
  get statusLabel(): string {
    return resolveEventStatus(this.appointment)?.text ?? '';
  }

  get statusBadgeClass(): string {
    const status = resolveEventStatus(this.appointment);
    return status ? STATUS_BADGE_CLASS[status.color] : '';
  }

  async getAppointment() {
    // Sin esto la pantalla quedaba en blanco hasta que llegaba la respuesta.
    this.loading = !this.appointment;
    try {
      this.appointment = await this.appointmentsService.getAppointment(this.appointmentId);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
    this.isConfirmed = this.appointment && this.appointment.status === 'confirmed';
  }

  async confirmAppointment() {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: '¿Desea confirmar el turno?',
        yesColor: 'primary',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.appointmentsService
        .confirmAppointment(this.appointmentId)
        .then(() => this.toastService.showSuccess('Turno confirmado correctamente.'))
        .then(() => this.appointmentsService.notifyAppointmentsChanged())
        .then(() => this.leaveAfterAction())
        .catch(() => {});
    }
  }

  async deleteEvent() {
    if (this.deleting) return;
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        title: '¿Borrar el turno?',
        text: 'Se va a borrar de la agenda como si nunca lo hubieras cargado.',
        subtext: 'Esta acción no se puede deshacer.',
        confirmText: 'Borrar',
        cancelText: 'No',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (!data) return;

    this.deleting = true;
    try {
      await this.appointmentsService.deleteAppointment(this.appointmentId);
      this.toastService.showSuccess('Turno borrado.');
      this.appointmentsService.notifyAppointmentsChanged();
      this.leaveAfterAction();
    } catch ({ error }) {
      this.toastService.showError(error?.message || 'No pudimos borrar el turno');
    } finally {
      this.deleting = false;
    }
  }

  async cancelAppointment() {
    const modal = await this.modalController.create({
      component: YesNoModalComponent,
      cssClass: 'modal',
      componentProps: {
        text: '¿Desea cancelar el turno?',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.appointmentsService
        .cancelAppointment(this.appointmentId)
        .then(() => this.toastService.showSuccess('Turno cancelado correctamente.'))
        .then(() => this.appointmentsService.notifyAppointmentsChanged())
        .then(() => this.leaveAfterAction())
        .catch(() => {});
    }
  }
}
