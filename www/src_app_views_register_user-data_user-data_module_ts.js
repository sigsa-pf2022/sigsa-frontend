"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_views_register_user-data_user-data_module_ts"],{

/***/ 64017:
/*!**************************************************************!*\
  !*** ./src/app/views/register/user-data/user-data.module.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UserDataModule": () => (/* binding */ UserDataModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 34929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ 93819);
/* harmony import */ var _user_data_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user-data.page */ 64965);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 52816);







const routes = [
    {
        path: '',
        component: _user_data_page__WEBPACK_IMPORTED_MODULE_0__.UserDataPage,
    },
];
let UserDataModule = class UserDataModule {
};
UserDataModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.ReactiveFormsModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonicModule, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterModule.forChild(routes)],
        declarations: [_user_data_page__WEBPACK_IMPORTED_MODULE_0__.UserDataPage],
    })
], UserDataModule);



/***/ }),

/***/ 64965:
/*!************************************************************!*\
  !*** ./src/app/views/register/user-data/user-data.page.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UserDataPage": () => (/* binding */ UserDataPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 34929);
/* harmony import */ var _user_data_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user-data.page.scss?ngResource */ 511);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 93819);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngx-translate/core */ 87514);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! date-fns */ 86712);
/* harmony import */ var src_app_components_success_creation_acount_success_creation_acount_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/components/success-creation-acount/success-creation-acount.component */ 78);
/* harmony import */ var src_app_services_authentication_authentication_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/authentication/authentication.service */ 97020);
/* harmony import */ var _services_register_form_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/register-form-data.service */ 8163);









let UserDataPage = class UserDataPage {
    constructor(registerFormDataService, toast, translate, auth, modalController) {
        this.registerFormDataService = registerFormDataService;
        this.toast = toast;
        this.translate = translate;
        this.auth = auth;
        this.modalController = modalController;
        this.showCalendar = false;
        this.date = (0,date_fns__WEBPACK_IMPORTED_MODULE_4__["default"])(new Date(), 'yyyy-MM-dd');
    }
    ngOnInit() {
        this.registerForm = this.registerFormDataService.form;
    }
    onSubmit() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__awaiter)(this, void 0, void 0, function* () {
            // this.auth.register(this.registerForm.value).subscribe(res =>{
            //   console.log(res);
            // });
            yield this.auth
                .signUp(this.registerForm.get('email').value, this.registerForm.get('password').value)
                .then((res) => (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__awaiter)(this, void 0, void 0, function* () {
                yield this.successRegister();
            }))
                .catch((error) => (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__awaiter)(this, void 0, void 0, function* () {
                yield this.showError(error);
                console.log(error);
            }));
        });
    }
    successRegister() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__awaiter)(this, void 0, void 0, function* () {
            const modal = yield this.modalController.create({
                component: src_app_components_success_creation_acount_success_creation_acount_component__WEBPACK_IMPORTED_MODULE_1__.SuccessCreationAcountComponent,
                cssClass: 'modal',
                backdropDismiss: false,
            });
            yield modal.present();
        });
    }
    showError(code) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__awaiter)(this, void 0, void 0, function* () {
            const toast = yield this.toast.create({
                message: this.translate.instant(`register.errors.${code}`),
                duration: 5000,
                color: 'danger',
            });
            yield toast.present();
        });
    }
};
UserDataPage.ctorParameters = () => [
    { type: _services_register_form_data_service__WEBPACK_IMPORTED_MODULE_3__.RegisterFormDataService },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.ToastController },
    { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__.TranslateService },
    { type: src_app_services_authentication_authentication_service__WEBPACK_IMPORTED_MODULE_2__.AuthenticationService },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.ModalController }
];
UserDataPage.propDecorators = {
    datetime: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_8__.ViewChild, args: [_ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonDatetime,] }]
};
UserDataPage = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.Component)({
        selector: 'app-user-data',
        template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary">
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/register/personal-data"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Register</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ud">
      <ion-img
        class="ud__img"
        src="/assets/images/register/user-data.svg"
      ></ion-img>
      <form class="ud__form" [formGroup]="registerForm" (submit)="onSubmit()">
        <ion-input
          class="ui-form-input"
          formControlName="email"
          placeholder="Email"
          type="text"
        ></ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="password"
          placeholder="Contraseña"
          type="password"
        ></ion-input>
        <ion-input
          class="ui-form-input"
          formControlName="repeatPassword"
          placeholder="Repetir Contraseña"
          type="password"
        ></ion-input>
      </form>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button
        (click)="onSubmit()"
        [disabled]="!this.registerForm.valid"
        color="primary"
      >
        Confirmar
      </ion-button>
    </ion-footer>
  `,
        styles: [_user_data_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_0__]
    })
], UserDataPage);



/***/ }),

/***/ 511:
/*!*************************************************************************!*\
  !*** ./src/app/views/register/user-data/user-data.page.scss?ngResource ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = ".ud {\n  background-color: var(--ion-color-white);\n}\n.ud__img {\n  margin-top: 35px;\n}\n.ud__form {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n  margin-top: 35px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZXItZGF0YS5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSx3Q0FBQTtBQUNKO0FBQUk7RUFDSSxnQkFBQTtBQUVSO0FBQUk7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsU0FBQTtFQUNBLGdCQUFBO0FBRVIiLCJmaWxlIjoidXNlci1kYXRhLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi51ZHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1pb24tY29sb3Itd2hpdGUpO1xuICAgICZfX2ltZ3tcbiAgICAgICAgbWFyZ2luLXRvcDogMzVweDtcbiAgICB9XG4gICAgJl9fZm9ybXtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogMTZweDtcbiAgICAgICAgbWFyZ2luLXRvcDogMzVweDtcbiAgICB9XG59Il19 */";

/***/ })

}]);
//# sourceMappingURL=src_app_views_register_user-data_user-data_module_ts.js.map