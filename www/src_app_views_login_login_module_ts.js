"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_views_login_login_module_ts"],{

/***/ 6106:
/*!*****************************************************************************************!*\
  !*** ./src/app/components/recovery-password-modal/recovery-password-modal.component.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RecoveryPasswordModalComponent": () => (/* binding */ RecoveryPasswordModalComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 34929);
/* harmony import */ var _recovery_password_modal_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./recovery-password-modal.component.scss?ngResource */ 30615);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 93819);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-translate/core */ 87514);
/* harmony import */ var src_app_services_authentication_authentication_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/authentication/authentication.service */ 97020);







let RecoveryPasswordModalComponent = class RecoveryPasswordModalComponent {
    constructor(modalController, fb, auth, toast, translate) {
        this.modalController = modalController;
        this.fb = fb;
        this.auth = auth;
        this.toast = toast;
        this.translate = translate;
        this.form = this.fb.group({
            email: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.email]],
        });
    }
    ngOnInit() { }
    close() {
        return this.modalController.dismiss();
    }
    send() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            yield this.auth
                .sendPasswordResetEmail(this.form.value)
                .then((res) => {
                this.showMessage('success', 'success');
                this.close();
            })
                .catch((err) => {
                this.showMessage('danger', err);
            });
        });
    }
    showMessage(color, code) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            const toast = yield this.toast.create({
                message: this.translate.instant(`login.recovery-password.${code}`),
                duration: 5000,
                color,
            });
            yield toast.present();
        });
    }
};
RecoveryPasswordModalComponent.ctorParameters = () => [
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.ModalController },
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder },
    { type: src_app_services_authentication_authentication_service__WEBPACK_IMPORTED_MODULE_1__.AuthenticationService },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.ToastController },
    { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__.TranslateService }
];
RecoveryPasswordModalComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Component)({
        selector: 'app-recovery-password-modal',
        template: `<div class="modal-content">
    <form [formGroup]="this.form">
      <div class="body">
        <ion-title>Recuperación de contraseña</ion-title>
        <ion-label
          >Le enviaremos un email para que pueda recuerar su contraseña a la
          direccion ingresada debajo</ion-label
        >
        <ion-input
          class="ui-form-input"
          placeholder="Email"
          formControlName="email"
        ></ion-input>
        <div class="body__actions">
          <ion-button (click)="close()">Cerrar</ion-button>
          <ion-button (click)="send()" [disabled]="!this.form.valid"
            >Enviar</ion-button
          >
        </div>
      </div>
    </form>
  </div>`,
        styles: [_recovery_password_modal_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_0__]
    })
], RecoveryPasswordModalComponent);



/***/ }),

/***/ 13397:
/*!*****************************************************************************************************!*\
  !*** ./src/app/components/send-verification-email-modal/send-verification-email-modal.component.ts ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendVerificationEmailModalComponent": () => (/* binding */ SendVerificationEmailModalComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 34929);
/* harmony import */ var _send_verification_email_modal_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./send-verification-email-modal.component.scss?ngResource */ 49114);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ 93819);




let SendVerificationEmailModalComponent = class SendVerificationEmailModalComponent {
    constructor(modalController) {
        this.modalController = modalController;
    }
    ngOnInit() { }
    close() {
        return this.modalController.dismiss();
    }
    resend() {
        return this.modalController.dismiss('resend');
    }
};
SendVerificationEmailModalComponent.ctorParameters = () => [
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.ModalController }
];
SendVerificationEmailModalComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
        selector: 'app-send-verification-email-modal',
        template: `<div class="modal-content">
    <div class="body">
      <ion-title>¡Atención!</ion-title>
      <ion-label
        >La cuenta debe confirmar el correo para continuar. Revise la casilla de
        correo o solicite un reenvío</ion-label
      >
      <div class="body__actions">
        <ion-button (click)="close()">Cerrar</ion-button>
        <ion-button (click)="resend()">Reenviar</ion-button>
      </div>
    </div>
  </div>`,
        styles: [_send_verification_email_modal_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_0__]
    })
], SendVerificationEmailModalComponent);



/***/ }),

/***/ 76175:
/*!********************************************************!*\
  !*** ./src/app/components/shared-components.module.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SharedComponentsModule": () => (/* binding */ SharedComponentsModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 34929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 93819);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var _send_verification_email_modal_send_verification_email_modal_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./send-verification-email-modal/send-verification-email-modal.component */ 13397);
/* harmony import */ var _success_creation_acount_success_creation_acount_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./success-creation-acount/success-creation-acount.component */ 78);
/* harmony import */ var _recovery_password_modal_recovery_password_modal_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./recovery-password-modal/recovery-password-modal.component */ 6106);








let SharedComponentsModule = class SharedComponentsModule {
};
SharedComponentsModule = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.NgModule)({
        declarations: [_send_verification_email_modal_send_verification_email_modal_component__WEBPACK_IMPORTED_MODULE_0__.SendVerificationEmailModalComponent, _success_creation_acount_success_creation_acount_component__WEBPACK_IMPORTED_MODULE_1__.SuccessCreationAcountComponent, _recovery_password_modal_recovery_password_modal_component__WEBPACK_IMPORTED_MODULE_2__.RecoveryPasswordModalComponent],
        imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.ReactiveFormsModule],
        exports: [_send_verification_email_modal_send_verification_email_modal_component__WEBPACK_IMPORTED_MODULE_0__.SendVerificationEmailModalComponent, _success_creation_acount_success_creation_acount_component__WEBPACK_IMPORTED_MODULE_1__.SuccessCreationAcountComponent, _recovery_password_modal_recovery_password_modal_component__WEBPACK_IMPORTED_MODULE_2__.RecoveryPasswordModalComponent],
    })
], SharedComponentsModule);



/***/ }),

/***/ 50265:
/*!*********************************************!*\
  !*** ./src/app/views/login/login.module.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoginPageModule": () => (/* binding */ LoginPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 34929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 93819);
/* harmony import */ var _login_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login.page */ 29015);
/* harmony import */ var src_app_components_shared_components_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/components/shared-components.module */ 76175);








const routes = [
    {
        path: '',
        component: _login_page__WEBPACK_IMPORTED_MODULE_0__.LoginPage,
    },
];
let LoginPageModule = class LoginPageModule {
};
LoginPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.ReactiveFormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule.forChild(routes),
            src_app_components_shared_components_module__WEBPACK_IMPORTED_MODULE_1__.SharedComponentsModule
        ],
        declarations: [_login_page__WEBPACK_IMPORTED_MODULE_0__.LoginPage],
    })
], LoginPageModule);



/***/ }),

/***/ 29015:
/*!*******************************************!*\
  !*** ./src/app/views/login/login.page.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoginPage": () => (/* binding */ LoginPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 34929);
/* harmony import */ var _login_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login.page.scss?ngResource */ 65827);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 93819);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngx-translate/core */ 87514);
/* harmony import */ var src_app_components_recovery_password_modal_recovery_password_modal_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/components/recovery-password-modal/recovery-password-modal.component */ 6106);
/* harmony import */ var src_app_components_send_verification_email_modal_send_verification_email_modal_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/components/send-verification-email-modal/send-verification-email-modal.component */ 13397);
/* harmony import */ var src_app_services_authentication_authentication_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/authentication/authentication.service */ 97020);









let LoginPage = class LoginPage {
    constructor(fb, navController, auth, modalController, toast, translate) {
        this.fb = fb;
        this.navController = navController;
        this.auth = auth;
        this.modalController = modalController;
        this.toast = toast;
        this.translate = translate;
        this.loginForm = this.fb.group({
            email: [
                null,
                [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.compose([_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.email, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required])],
            ],
            password: [
                null,
                [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.compose([_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.minLength(6), _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required])],
            ],
        });
    }
    ngOnInit() { }
    onSubmit() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__awaiter)(this, void 0, void 0, function* () {
            yield this.auth
                .signIn(this.loginForm.value)
                .then((user) => (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__awaiter)(this, void 0, void 0, function* () {
                if (!user.emailVerified) {
                    this.sendVerificationEmailModal();
                }
            }))
                .catch((error) => {
                this.showError(error);
            });
        });
    }
    goHome() {
        this.navController.navigateRoot(['tabs/home']);
    }
    sendVerificationEmailModal() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__awaiter)(this, void 0, void 0, function* () {
            const modal = yield this.modalController.create({
                component: src_app_components_send_verification_email_modal_send_verification_email_modal_component__WEBPACK_IMPORTED_MODULE_2__.SendVerificationEmailModalComponent,
                cssClass: 'modal',
            });
            yield modal.present();
            const { data } = yield modal.onWillDismiss();
            if (data === 'resend') {
                yield this.auth.sendVerificationMail();
            }
            yield this.auth.signOut();
        });
    }
    openRecoveryPassword() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__awaiter)(this, void 0, void 0, function* () {
            const modal = yield this.modalController.create({
                component: src_app_components_recovery_password_modal_recovery_password_modal_component__WEBPACK_IMPORTED_MODULE_1__.RecoveryPasswordModalComponent,
                cssClass: 'modal',
            });
            yield modal.present();
        });
    }
    goToRegister() {
        this.navController.navigateForward(['/register/personal-data']);
    }
    showError(code) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__awaiter)(this, void 0, void 0, function* () {
            const toast = yield this.toast.create({
                message: this.translate.instant(`login.errors.${code}`),
                duration: 5000,
                color: 'danger',
            });
            yield toast.present();
        });
    }
};
LoginPage.ctorParameters = () => [
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.NavController },
    { type: src_app_services_authentication_authentication_service__WEBPACK_IMPORTED_MODULE_3__.AuthenticationService },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.ModalController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.ToastController },
    { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__.TranslateService }
];
LoginPage = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.Component)({
        selector: 'app-login',
        template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__transparent">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="login">
      <div class="login__logo ui-background__light">
        <ion-img
          class="ui-logo__small"
          src="/assets/images/logos/logo-with-title.png"
        ></ion-img>
      </div>
      <div class="login__content ui-background__light">
        <form
          class="login__content__form"
          [formGroup]="this.loginForm"
          (submit)="onSubmit()"
        >
          <ion-text
            class="login__content__form__title ui-font-title"
            color="complementary"
            >Bienvenido</ion-text
          >
          <div class="login__content__form__items">
            <ion-input
              class="ui-form-input"
              formControlName="email"
              placeholder="Email"
            ></ion-input>
            <ion-input
              class="ui-form-input"
              formControlName="password"
              placeholder="Contraseña"
              type="password"
            ></ion-input>
            <ion-text
              class="login__content__form__items__forgot-password ui-font-text"
              color="complementary"
              (click)="openRecoveryPassword()"
              >¿Olvido su contraseña?</ion-text
            >
          </div>
          <div class="login__content__form__actions">
            <ion-button
              class="ui-button"
              type="submit"
              color="primary"
              expand="block"
              [disabled]="!this.loginForm.valid"
            >
              Ingresar
            </ion-button>
            <div class="login__content__form__actions__secondary">
              <ion-text class="ui-font-text" color="medium"
                >No tiene una cuenta?</ion-text
              >
              <ion-text
                (click)="goToRegister()"
                class="ui-font-text"
                color="complementary"
              >
                Registrese</ion-text
              >
            </div>
          </div>
        </form>
      </div>
    </ion-content>
  `,
        styles: [_login_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_0__]
    })
], LoginPage);



/***/ }),

/***/ 30615:
/*!******************************************************************************************************!*\
  !*** ./src/app/components/recovery-password-modal/recovery-password-modal.component.scss?ngResource ***!
  \******************************************************************************************************/
/***/ ((module) => {

module.exports = ":host {\n  justify-content: center;\n}\n:host .body {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 12px;\n  align-items: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlY292ZXJ5LXBhc3N3b3JkLW1vZGFsLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksdUJBQUE7QUFDSjtBQUFJO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsUUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtBQUVSIiwiZmlsZSI6InJlY292ZXJ5LXBhc3N3b3JkLW1vZGFsLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3R7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgLmJvZHl7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBwYWRkaW5nOiAxMnB4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cbn0iXX0= */";

/***/ }),

/***/ 49114:
/*!******************************************************************************************************************!*\
  !*** ./src/app/components/send-verification-email-modal/send-verification-email-modal.component.scss?ngResource ***!
  \******************************************************************************************************************/
/***/ ((module) => {

module.exports = ":host {\n  justify-content: center;\n}\n:host .body {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 12px;\n  align-items: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlbmQtdmVyaWZpY2F0aW9uLWVtYWlsLW1vZGFsLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksdUJBQUE7QUFDSjtBQUFJO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsUUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtBQUVSIiwiZmlsZSI6InNlbmQtdmVyaWZpY2F0aW9uLWVtYWlsLW1vZGFsLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3R7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgLmJvZHl7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBwYWRkaW5nOiAxMnB4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cbn0iXX0= */";

/***/ }),

/***/ 65827:
/*!********************************************************!*\
  !*** ./src/app/views/login/login.page.scss?ngResource ***!
  \********************************************************/
/***/ ((module) => {

module.exports = ".login {\n  background-color: var(--ion-color-light);\n}\n.login__logo {\n  display: flex;\n  justify-content: center;\n  padding-top: 4px;\n  padding-bottom: 32px;\n}\n.login__content__form {\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  background-color: var(--ion-color-white);\n  border-top-left-radius: 20px;\n  border-top-right-radius: 20px;\n}\n.login__content__form__items {\n  margin-top: 32px;\n  display: flex;\n  flex-flow: column;\n  align-items: center;\n  gap: 16px;\n}\n.login__content__form__items__forgot-password {\n  font-size: 16px;\n  align-self: flex-end;\n}\n.login__content__form__actions {\n  margin-top: 60px;\n}\n.login__content__form__actions__secondary {\n  font-size: 16px;\n  margin-top: 24px;\n  text-align: center;\n}\n.login__content__form__title {\n  margin-top: 30px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHdDQUFBO0FBQ0Y7QUFBRTtFQUNFLGFBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0VBQ0Esb0JBQUE7QUFFSjtBQUNJO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0Esc0JBQUE7RUFDQSx3Q0FBQTtFQUNBLDRCQUFBO0VBQ0EsNkJBQUE7QUFDTjtBQUFNO0VBQ0UsZ0JBQUE7RUFDQSxhQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7QUFFUjtBQURRO0VBQ0UsZUFBQTtFQUNBLG9CQUFBO0FBR1Y7QUFBTTtFQUNFLGdCQUFBO0FBRVI7QUFEUTtFQUNFLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FBR1Y7QUFBTTtFQUNFLGdCQUFBO0FBRVIiLCJmaWxlIjoibG9naW4ucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmxvZ2luIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taW9uLWNvbG9yLWxpZ2h0KTtcbiAgJl9fbG9nbyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBwYWRkaW5nLXRvcDogNHB4O1xuICAgIHBhZGRpbmctYm90dG9tOiAzMnB4O1xuICB9XG4gICZfX2NvbnRlbnQge1xuICAgICZfX2Zvcm0ge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taW9uLWNvbG9yLXdoaXRlKTtcbiAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDIwcHg7XG4gICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMjBweDtcbiAgICAgICZfX2l0ZW1zIHtcbiAgICAgICAgbWFyZ2luLXRvcDogMzJweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1mbG93OiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogMTZweDtcbiAgICAgICAgJl9fZm9yZ290LXBhc3N3b3Jke1xuICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgICAgICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgJl9fYWN0aW9uc3tcbiAgICAgICAgbWFyZ2luLXRvcDogNjBweDtcbiAgICAgICAgJl9fc2Vjb25kYXJ5e1xuICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgICAgICBtYXJnaW4tdG9wOiAyNHB4O1xuICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgJl9fdGl0bGV7XG4gICAgICAgIG1hcmdpbi10b3A6MzBweDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ== */";

/***/ })

}]);
//# sourceMappingURL=src_app_views_login_login_module_ts.js.map