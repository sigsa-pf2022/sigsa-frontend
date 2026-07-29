import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonDatetime, IonModal, NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { GENDERS } from 'src/app/constants/Gender.constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { RecoveryPasswordFormDataService } from 'src/app/services/recovery-password-form-data/recovery-password-form-data.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-my-data',
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
        <p class="listing-header__eyebrow">Tu cuenta</p>
        <h1 class="listing-header__title">Mis datos</h1>
      </header>

      <div class="md__container">
        <form class="auth-form" [formGroup]="this.form">
          <div class="auth-field">
            <label class="auth-field__label" for="md-firstname">Nombre</label>
            <div class="auth-input">
              <ion-input
                id="md-firstname"
                formControlName="firstName"
                placeholder="Ej: Pedro"
                type="text"
                autocapitalize="words"
              ></ion-input>
            </div>
            <p class="auth-field__error" *ngIf="form.get('firstName')?.touched && form.get('firstName')?.invalid">
              Ingresá tu nombre.
            </p>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="md-lastname">Apellido</label>
            <div class="auth-input">
              <ion-input
                id="md-lastname"
                formControlName="lastName"
                placeholder="Ej: Martínez"
                type="text"
                autocapitalize="words"
              ></ion-input>
            </div>
            <p class="auth-field__error" *ngIf="form.get('lastName')?.touched && form.get('lastName')?.invalid">
              Ingresá tu apellido.
            </p>
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="md-gender">Género</label>
            <div class="auth-input">
              <ion-select
                id="md-gender"
                okText="Confirmar"
                cancelText="Cancelar"
                formControlName="gender"
                placeholder="Seleccioná una opción"
                interface="alert"
              >
                <ion-select-option *ngFor="let gender of this.genders" [value]="gender.value">{{
                  gender.text
                }}</ion-select-option>
              </ion-select>
            </div>
          </div>

          <div class="auth-field">
            <label class="auth-field__label">Fecha de nacimiento</label>
            <button
              type="button"
              class="date-field"
              [class.date-field--empty]="!form.value.birthday"
              (click)="openDateModal($event)"
            >
              <span>{{ form.value.birthday || 'DD/MM/AAAA' }}</span>
              <ion-icon name="calendar-outline"></ion-icon>
            </button>
            <ion-modal #dateModal class="calendar-modal">
              <ng-template>
                <ion-content>
                  <ion-datetime
                    #bdt
                    [value]="this.calendarValue"
                    [max]="this.maxDate"
                    locale="es-ES"
                    presentation="date"
                    (ionChange)="dateChanged(bdt.value)"
                    [showDefaultButtons]="false"
                  >
                    <ion-buttons slot="buttons">
                      <ion-button class="datetime-done" (click)="confirmDateSelection()">Listo</ion-button>
                    </ion-buttons>
                  </ion-datetime>
                </ion-content>
              </ng-template>
            </ion-modal>
          </div>
        </form>

        <section class="md__section">
          <div class="section-title">
            <h2>Datos fijos</h2>
          </div>
          <div class="md__card">
            <div class="md__row">
              <span class="md__row-label">DNI</span>
              <span class="md__row-value">{{ user?.dni || '—' }}</span>
            </div>
            <div class="md__row">
              <span class="md__row-label">Correo electrónico</span>
              <span class="md__row-value">{{ user?.email || '—' }}</span>
            </div>
          </div>
          <p class="auth-field__hint">
            El DNI y el correo no se pueden editar porque identifican tu cuenta.
          </p>
        </section>

        <section class="md__section">
          <div class="section-title">
            <h2>Seguridad</h2>
          </div>
          <button type="button" class="md__action" (click)="changePassword()" [disabled]="sendingReset">
            <span class="option-row__icon" aria-hidden="true">
              <ion-icon name="lock-closed-outline"></ion-icon>
            </span>
            <span class="option-row__title">Cambiar contraseña</span>
            <ion-spinner *ngIf="sendingReset" name="crescent"></ion-spinner>
            <ion-icon *ngIf="!sendingReset" class="md__action-chevron" name="chevron-forward"></ion-icon>
          </button>
          <p class="auth-field__hint">
            Te enviamos un código a tu correo para elegir una contraseña nueva.
          </p>
        </section>
      </div>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="save()"
        [disabled]="!this.form.valid || saving"
      >
        <ion-spinner *ngIf="saving" name="crescent"></ion-spinner>
        <ng-container *ngIf="!saving">Guardar cambios</ng-container>
      </button>
    </ion-footer>
  `,
  styleUrls: ['./my-data.page.scss'],
})
export class MyDataPage {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  @ViewChild('dateModal') dateModal: IonModal;

  form = this.fb.group({
    firstName: [null, [Validators.compose([Validators.required, Validators.maxLength(50)])]],
    lastName: [null, [Validators.compose([Validators.required, Validators.maxLength(50)])]],
    gender: [null, Validators.required],
    birthday: [null, Validators.required],
  });

  genders = GENDERS;
  user: any;
  saving = false;
  sendingReset = false;
  // Mismo criterio que el registro: mayores de 18.
  maxDate = format(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()), 'yyyy-MM-dd');
  calendarValue = this.maxDate;

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private navController: NavController,
    private router: Router,
    private toastService: ToastService,
    private dateFormatterService: DateFormatterService,
    private recoveryPasswordFormDataService: RecoveryPasswordFormDataService
  ) {}

  ionViewWillEnter() {
    this.user = this.auth.user();
    if (!this.user) return;

    const birthday = this.toDisplayDate(this.user.birthday);
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      gender: this.user.gender,
      birthday,
    });
    this.calendarValue = this.toIsoDay(this.user.birthday) || this.maxDate;
  }

  goBack() {
    this.navController.navigateBack(['/profile']);
  }

  /**
   * El backend devuelve la fecha como timestamp ISO. Nos quedamos con la parte
   * del día tal cual viene, sin construir un Date, para que la zona horaria no
   * corra el cumpleaños un día.
   */
  private toIsoDay(value: string): string | null {
    if (!value) return null;
    return String(value).slice(0, 10);
  }

  private toDisplayDate(value: string): string | null {
    const isoDay = this.toIsoDay(value);
    return isoDay ? isoDay.split('-').reverse().join('/') : null;
  }

  dateChanged(date: string | string[]) {
    const dateStr = Array.isArray(date) ? date[0] : date;
    if (!dateStr) return;
    this.form
      .get('birthday')
      .setValue(
        format(
          parseISO(format(this.dateFormatterService.createDateFromCalendarStringDate(dateStr.slice(0, 10)), 'yyyy-MM-dd')),
          'dd/MM/yyyy'
        )
      );
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

  async save() {
    if (!this.form.valid || this.saving) return;
    this.saving = true;

    const { firstName, lastName, gender, birthday } = this.form.value;
    const payload = {
      firstName,
      lastName,
      gender,
      // El form guarda dd/MM/yyyy y el backend espera yyyy-MM-dd (mismo
      // criterio que el registro).
      birthday: String(birthday).split('/').reverse().join('-'),
    };

    try {
      const updated = await this.auth.updateMe(payload);
      this.auth.updateStoredUser(updated);
      this.user = updated;
      this.toastService.showSuccess('Datos actualizados');
      this.goBack();
    } catch ({ error }) {
      this.toastService.showError(error?.message || 'No pudimos guardar tus datos');
    } finally {
      this.saving = false;
    }
  }

  /**
   * Reusa el flujo de recuperación por email que ya existe desde el login,
   * salteando el modal que pide el correo: acá ya lo conocemos.
   */
  async changePassword() {
    if (this.sendingReset) return;
    const email = this.user?.email;
    if (!email) return;

    this.sendingReset = true;
    try {
      await this.auth.sendPasswordResetEmail(email);
      this.recoveryPasswordFormDataService.tokenForm.patchValue({ email });
      this.router.navigateByUrl('/recovery-password/token-verification');
    } catch ({ error }) {
      this.toastService.showError(error?.message || 'No pudimos enviar el correo');
    } finally {
      this.sendingReset = false;
    }
  }
}
